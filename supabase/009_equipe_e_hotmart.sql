-- =====================================================================
-- Entre Nós · parte 9: equipe do gerenciador (convites) + Hotmart (valor real, por país)
-- Cole tudo no SQL Editor do Supabase e toque em Run.
-- =====================================================================

-- ---------- equipe: quem é dona e quem é administrador ----------
alter table public.admins add column if not exists is_owner boolean not null default false;
alter table public.admins add column if not exists name text;
alter table public.admins add column if not exists created_at timestamptz not null default now();
update public.admins set is_owner = true where not exists (select 1 from public.admins where is_owner);  -- quem já estava vira dona

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as $$ select exists (select 1 from admins where user_id = auth.uid() and is_owner) $$;

create table if not exists public.admin_invites (
  code       text primary key default upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  used_by    uuid references auth.users(id) on delete set null,
  used_at    timestamptz
);
alter table public.admin_invites enable row level security;

create or replace function public.admin_new_invite() returns text
language plpgsql security definer set search_path = public as $$
declare v text;
begin
  if not public.is_owner() then raise exception 'só a dona pode convidar'; end if;
  insert into admin_invites(created_by) values (auth.uid()) returning code into v;
  return v;
end $$;

create or replace function public.admin_accept_invite(p_code text, p_name text) returns boolean
language plpgsql security definer set search_path = public as $$
declare r admin_invites;
begin
  if auth.uid() is null then raise exception 'entre primeiro'; end if;
  select * into r from admin_invites where code = upper(trim(p_code)) for update;
  if r.code is null or r.used_at is not null or r.expires_at < now() then raise exception 'convite inválido ou vencido'; end if;
  insert into admins(user_id, name) values (auth.uid(), nullif(trim(p_name),'')) on conflict (user_id) do update set name = coalesce(excluded.name, admins.name);
  update admin_invites set used_by = auth.uid(), used_at = now() where code = r.code;
  return true;
end $$;

create or replace function public.admin_team() returns jsonb
language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then raise exception 'sem permissão'; end if;
  return jsonb_build_object(
    'me', auth.uid(), 'owner', public.is_owner(),
    'admins', (select coalesce(jsonb_agg(jsonb_build_object('id', a.user_id, 'name', coalesce(a.name, p.nickname), 'email', u.email, 'owner', a.is_owner, 'since', a.created_at) order by a.is_owner desc, a.created_at), '[]'::jsonb)
               from admins a join auth.users u on u.id = a.user_id left join profiles p on p.id = a.user_id),
    'invites', case when public.is_owner() then (select coalesce(jsonb_agg(jsonb_build_object('code', i.code, 'created_at', i.created_at, 'expires_at', i.expires_at) order by i.created_at desc), '[]'::jsonb)
               from admin_invites i where i.used_at is null and i.expires_at > now()) else '[]'::jsonb end);
end $$;

create or replace function public.admin_remove(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'só a dona pode tirar alguém'; end if;
  if exists (select 1 from admins where user_id = p_user and is_owner) then raise exception 'não dá pra tirar a dona'; end if;
  delete from admins where user_id = p_user;
end $$;

create or replace function public.admin_cancel_invite(p_code text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'sem permissão'; end if;
  update admin_invites set expires_at = now() where code = p_code and used_at is null;
end $$;

-- ---------- pagamentos com valor real (o que a Hotmart desconta) e país ----------
alter table public.payments add column if not exists event        text;
alter table public.payments add column if not exists country      text;          -- BR, ES, CO, AR, DE...
alter table public.payments add column if not exists product      text;
alter table public.payments add column if not exists net          numeric(12,2);  -- o que é seu, depois das taxas
alter table public.payments add column if not exists net_currency text;
alter table public.payments add column if not exists recurrence   int;
create unique index if not exists payments_tx_event on public.payments(hotmart_tx, event);

-- quem pagou (o app usa isto pra liberar ou cortar o acesso quando a venda de verdade começar)
create table if not exists public.paid_emails (
  email      text primary key,
  status     text not null check (status in ('active','canceled','refunded')),
  country    text,
  updated_at timestamptz not null default now()
);
alter table public.paid_emails enable row level security;
drop policy if exists "pagos: só admin" on public.paid_emails;
create policy "pagos: só admin" on public.paid_emails for select using (public.is_admin());

-- recebe o aviso da Hotmart (chamado só pela função do servidor, nunca pelo app)
create or replace function public.hotmart_ingest(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare
  ev    text := p->>'event';
  d     jsonb := p->'data';
  v_email text := lower(trim(d->'buyer'->>'email'));
  tx    text := coalesce(d->'purchase'->>'transaction', d->'subscription'->>'subscriber_code', p->>'id');
  rec   int  := nullif(d->'purchase'->>'recurrence_number','')::int;
  ctry  text := upper(coalesce(d->'purchase'->'checkout_country'->>'iso', d->'buyer'->'address'->>'country_iso'));
  prod  jsonb := (select c from jsonb_array_elements(coalesce(d->'commissions','[]'::jsonb)) c where c->>'source' = 'PRODUCER' limit 1);
  k     text;
  amt   numeric := coalesce(nullif(d->'purchase'->'price'->>'value','')::numeric, 0);
  cur   text := coalesce(d->'purchase'->'price'->>'currency_value', 'BRL');
  netv  numeric := nullif(prod->>'value','')::numeric;
  netc  text := prod->>'currency_value';
begin
  k := case
    when ev in ('PURCHASE_APPROVED','PURCHASE_COMPLETE') then case when coalesce(rec,1) > 1 then 'renewal' else 'purchase' end
    when ev in ('PURCHASE_CANCELED','SUBSCRIPTION_CANCELLATION') then 'cancel'
    when ev = 'PURCHASE_REFUNDED' then 'refund'
    when ev in ('PURCHASE_CHARGEBACK','PURCHASE_PROTEST') then 'chargeback'
    else 'other' end;
  -- COMPLETE chega depois do APPROVED da mesma venda: não conta duas vezes
  if ev = 'PURCHASE_COMPLETE' and exists (select 1 from payments where hotmart_tx = tx and event = 'PURCHASE_APPROVED') then return 'repetido'; end if;
  insert into payments(email, kind, amount, currency, hotmart_tx, raw, event, country, product, net, net_currency, recurrence)
  values (coalesce(v_email,''), k, case when k in ('cancel','other') then 0 else amt end, cur, tx, p, ev, ctry, d->'product'->>'name',
          case when k in ('cancel','other') then 0 else netv end, netc, rec)
  on conflict (hotmart_tx, event) do nothing;
  if v_email is not null and v_email <> '' then
    if k in ('purchase','renewal') then
      insert into paid_emails(email, status, country) values (v_email, 'active', ctry)
      on conflict (email) do update set status = 'active', country = coalesce(excluded.country, paid_emails.country), updated_at = now();
    elsif k in ('cancel','refund','chargeback') then
      insert into paid_emails(email, status, country) values (v_email, case when k = 'cancel' then 'canceled' else 'refunded' end, ctry)
      on conflict (email) do update set status = excluded.status, updated_at = now();
    end if;
  end if;
  return k;
end $$;
revoke execute on function public.hotmart_ingest(jsonb) from public, anon, authenticated;

-- financeiro por país (p_country = 'ALL' pra tudo junto)
create or replace function public.admin_finance(p_days int, p_country text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => p_days);
begin
  if not public.is_admin() then raise exception 'sem permissão'; end if;
  return (with pay as (
      select * from payments where created_at > since
        and (p_country = 'ALL' or coalesce(country,'??') = p_country
             or (p_country = 'OUT' and coalesce(country,'??') not in ('BR','ES','CO','AR','DE'))))
    select jsonb_build_object(
      'sales',    (select count(*) from pay where kind = 'purchase'),
      'renewals', (select count(*) from pay where kind = 'renewal'),
      'cancels',  (select count(*) from pay where kind = 'cancel'),
      'refunds',  (select count(*) from pay where kind in ('refund','chargeback')),
      -- o que o cliente pagou, separado por moeda
      'gross', (select coalesce(jsonb_agg(jsonb_build_object('cur', currency, 'v', v)), '[]'::jsonb) from (
                 select currency, sum(case when kind in ('purchase','renewal') then amount else -amount end) v
                 from pay where kind in ('purchase','renewal','refund','chargeback') group by currency) g),
      -- o que é seu de verdade (depois das taxas da Hotmart), separado pela moeda em que você recebe
      'net',   (select coalesce(jsonb_agg(jsonb_build_object('cur', net_currency, 'v', v)), '[]'::jsonb) from (
                 select coalesce(net_currency,'?') net_currency, sum(case when kind in ('purchase','renewal') then coalesce(net,0) else -coalesce(net,0) end) v
                 from pay where kind in ('purchase','renewal','refund','chargeback') group by 1) n),
      -- taxa: só dá pra calcular quando o cliente pagou na mesma moeda em que você recebe
      'fees',  (select coalesce(jsonb_agg(jsonb_build_object('cur', currency, 'v', v)), '[]'::jsonb) from (
                 select currency, sum(amount - coalesce(net,0)) v from pay
                 where kind in ('purchase','renewal') and net is not null and net_currency = currency group by currency) f),
      'by_day', (select coalesce(jsonb_agg(jsonb_build_object('d', d, 'cur', c, 'v', v) order by d), '[]'::jsonb) from (
                 select date_trunc('day', created_at)::date d, coalesce(net_currency, currency) c, sum(coalesce(net, amount)) v
                 from pay where kind in ('purchase','renewal') group by 1, 2) x),
      'countries', (select coalesce(jsonb_agg(jsonb_build_object('c', country, 'n', n)), '[]'::jsonb) from (
                 select coalesce(country,'??') country, count(*) n from payments where kind in ('purchase','renewal') group by 1) y)));
end $$;

do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and p.prosecdef and p.proname in
           ('is_owner','admin_new_invite','admin_accept_invite','admin_team','admin_remove','admin_cancel_invite','admin_finance') loop
    execute format('revoke execute on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end $$;
