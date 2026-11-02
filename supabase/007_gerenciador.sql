-- =====================================================================
-- Entre Nós · parte 7: gerenciador (admin), pagamentos, mensagens, trocar o par
-- =====================================================================

-- ---------- quem é admin ----------
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- ---------- pagamentos (preenchido pelo aviso automático da Hotmart) ----------
create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  kind       text not null check (kind in ('purchase','renewal','cancel','refund','chargeback','other')),
  amount     numeric(12,2) not null default 0,
  currency   text not null default 'BRL',
  hotmart_tx text,
  raw        jsonb,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
drop policy if exists "pagamentos: só admin" on public.payments;
create policy "pagamentos: só admin" on public.payments for select using (public.is_admin());

-- ---------- mensagens pros usuários (sininho + aviso na página inicial) ----------
create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title_pt      text not null, body_pt text not null,
  title_es      text, body_es text,
  audience      text not null default 'all' check (audience in ('all','paid','free')),
  send_at       timestamptz not null default now(),
  repeat_weekly boolean not null default false,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);
alter table public.announcements enable row level security;
drop policy if exists "mensagens: admin gerencia" on public.announcements;
create policy "mensagens: admin gerencia" on public.announcements for all using (public.is_admin()) with check (public.is_admin());

-- o que cada usuário recebe (as semanais aparecem de novo a cada semana)
create or replace function public.my_announcements()
returns table (id uuid, title text, body text, shown_at timestamptz)
language sql stable security definer set search_path = public as $$
  with me as (select p.lang, public.has_active_plan() as paid from profiles p where p.id = auth.uid()),
  occ as (
    select a.*, case when a.repeat_weekly and now() > a.send_at
                     then a.send_at + floor(extract(epoch from now() - a.send_at) / 604800) * interval '7 days'
                     else a.send_at end as at
    from announcements a where a.active and a.send_at <= now())
  select o.id,
         case when me.lang = 'es' and o.title_es is not null and o.title_es <> '' then o.title_es else o.title_pt end,
         case when me.lang = 'es' and o.body_es  is not null and o.body_es  <> '' then o.body_es  else o.body_pt  end,
         o.at
  from occ o, me
  where (o.audience = 'all' or (o.audience = 'paid' and me.paid) or (o.audience = 'free' and not me.paid))
    and o.at > now() - interval '30 days'
  order by o.at desc limit 20 $$;

-- ---------- resposta da equipe na comunidade ----------
alter table public.answers add column if not exists staff boolean not null default false;
alter table public.concierge_requests add column if not exists handled_at timestamptz;

-- my_questions passa a dizer quando a resposta é da equipe
create or replace function public.my_questions() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'audience', q.audience, 'body', q.body, 'created_at', q.created_at, 'open', q.open,
    'answers', (select coalesce(jsonb_agg(jsonb_build_object(
        'id', a.id, 'body', a.body, 'staff', a.staff, 'audio_path', a.audio_path, 'audio_secs', a.audio_secs, 'created_at', a.created_at,
        'followups', (select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'body', f.body, 'reply', f.reply) order by f.created_at), '[]'::jsonb)
                      from followups f where f.answer_id = a.id)) order by a.created_at), '[]'::jsonb)
      from answers a where a.question_id = q.id and not a.hidden)
  ) order by q.created_at desc), '[]'::jsonb)
  from questions q where q.author_id = auth.uid() $$;

-- ---------- trocar o par (quem pagou faz no app; você faz no gerenciador) ----------
create or replace function public.do_change_partner(p_couple uuid, p_email text, p_gender text)
returns text language plpgsql security definer set search_path = public as $$
declare v_code text; v_old uuid;
begin
  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'e-mail inválido'; end if;
  select partner_id into v_old from couples where id = p_couple;
  update profiles set couple_id = null, role = null where id = v_old;             -- o par antigo perde o acesso
  update couples set partner_id = null, partner_email = lower(trim(p_email)), partner_gender = p_gender,
         invite_code = upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))
   where id = p_couple returning invite_code into v_code;
  delete from shares where couple_id = p_couple;                                   -- o que era compartilhado com o par antigo some
  return v_code;
end $$;
revoke execute on function public.do_change_partner(uuid,text,text) from public, anon, authenticated;

create or replace function public.change_partner(p_email text, p_gender text) returns text
language plpgsql security definer set search_path = public as $$
declare v_couple uuid;
begin
  select id into v_couple from couples where owner_id = auth.uid();
  if v_couple is null then raise exception 'só quem pagou pode trocar o par'; end if;
  return public.do_change_partner(v_couple, p_email, p_gender);
end $$;

-- ---------- funções do gerenciador (todas exigem admin) ----------
create or replace function public.admin_stats(p_days int) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => p_days); r jsonb;
begin
  if not public.is_admin() then raise exception 'sem permissão'; end if;
  select jsonb_build_object(
    'signups',      (select count(*) from profiles where created_at > since),
    'couples',      (select count(*) from couples where created_at > since),
    'partners_in',  (select count(*) from couples where partner_id is not null and created_at > since),
    'active_subs',  (select count(*) from couples where sub_status in ('trial','active')),
    'free_users',   (select count(*) from profiles where couple_id is null and created_at > since),
    'free_games',   (select count(*) from game_rooms r where r.free and r.created_at > since and (select count(*) from game_members m where m.room_id = r.id) = 2),
    'free_to_paid', (select count(*) from couples c join free_plays f on f.user_id = c.owner_id where c.created_at > since),
    'questions',    (select count(*) from questions where created_at > since),
    'revenue',      (select coalesce(sum(amount),0) from payments where kind in ('purchase','renewal') and created_at > since),
    'refunds_amt',  (select coalesce(sum(amount),0) from payments where kind in ('refund','chargeback') and created_at > since),
    'sales',        (select count(*) from payments where kind = 'purchase' and created_at > since),
    'renewals',     (select count(*) from payments where kind = 'renewal' and created_at > since),
    'cancels',      (select count(*) from payments where kind = 'cancel' and created_at > since),
    'refunds',      (select count(*) from payments where kind in ('refund','chargeback') and created_at > since),
    'by_day',       (select coalesce(jsonb_agg(jsonb_build_object('d', d, 'v', v) order by d), '[]'::jsonb) from (
                       select date_trunc('day', created_at)::date d, sum(amount) v from payments
                       where kind in ('purchase','renewal') and created_at > since group by 1) x)
  ) into r;
  return r;
end $$;

create or replace function public.admin_users(p_search text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare q text := '%' || lower(coalesce(p_search,'')) || '%';
begin
  if not public.is_admin() then raise exception 'sem permissão'; end if;
  return jsonb_build_object(
   'couples', (select coalesce(jsonb_agg(x order by (x->>'created_at') desc), '[]'::jsonb) from (
      select jsonb_build_object('id', c.id, 'created_at', c.created_at, 'sub_status', c.sub_status, 'invite_code', c.invite_code,
        'owner', jsonb_build_object('id', o.id, 'nick', o.nickname, 'email', ou.email, 'blocked', ou.banned_until is not null and ou.banned_until > now()),
        'partner_email', c.partner_email, 'partner_gender', c.partner_gender,
        'partner', case when p.id is null then null else jsonb_build_object('id', p.id, 'nick', p.nickname, 'email', pu.email, 'blocked', pu.banned_until is not null and pu.banned_until > now()) end) x
      from couples c join profiles o on o.id = c.owner_id join auth.users ou on ou.id = o.id
      left join profiles p on p.id = c.partner_id left join auth.users pu on pu.id = p.id
      where lower(ou.email) like q or lower(c.partner_email) like q or lower(o.nickname) like q or lower(coalesce(p.nickname,'')) like q
      limit 200) s),
   'free', (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'nick', p.nickname, 'email', u.email, 'created_at', p.created_at,
              'used', coalesce(f.used,0), 'blocked', u.banned_until is not null and u.banned_until > now()) order by p.created_at desc), '[]'::jsonb)
      from profiles p join auth.users u on u.id = p.id left join free_plays f on f.user_id = p.id
      where p.couple_id is null and (lower(u.email) like q or lower(p.nickname) like q)));
end $$;

create or replace function public.admin_change_partner(p_couple uuid, p_email text, p_gender text) returns text
language plpgsql security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if; return public.do_change_partner(p_couple, p_email, p_gender); end $$;

create or replace function public.admin_set_sub(p_couple uuid, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  update couples set sub_status = p_status where id = p_couple; end $$;

create or replace function public.admin_block(p_user uuid, p_block boolean) returns void
language plpgsql security definer set search_path = public, auth as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  update auth.users set banned_until = case when p_block then 'infinity'::timestamptz else null end where id = p_user; end $$;

-- comunidade: perguntas sem resposta há mais de 24h
create or replace function public.admin_stale_questions() returns table (id uuid, audience text, body text, created_at timestamptz, answers int)
language plpgsql stable security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  return query select q.id, q.audience, q.body, q.created_at, (select count(*)::int from answers a where a.question_id = q.id and not a.hidden)
  from questions q where q.open and not q.hidden and q.created_at < now() - interval '24 hours'
    and not exists (select 1 from answers a where a.question_id = q.id and a.staff)
  order by q.created_at; end $$;

create or replace function public.admin_answer(p_question uuid, p_body text) returns void
language plpgsql security definer set search_path = public as $$
declare n int;
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  insert into answers(question_id, author_id, body, staff) values (p_question, auth.uid(), trim(p_body), true);
  select count(*) into n from answers where question_id = p_question and not hidden;
  if n >= 3 then update questions set open = false where id = p_question; end if; end $$;

create or replace function public.admin_reports() returns table (id uuid, target text, target_id uuid, reason text, created_at timestamptz, content text, hidden boolean)
language plpgsql stable security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  return query select r.id, r.target, r.target_id, r.reason, r.created_at,
    coalesce((select q.body from questions q where q.id = r.target_id), (select a.body from answers a where a.id = r.target_id), (select f.body from followups f where f.id = r.target_id)),
    coalesce((select q.hidden from questions q where q.id = r.target_id), (select a.hidden from answers a where a.id = r.target_id), false)
  from reports r order by r.created_at desc limit 100; end $$;

create or replace function public.admin_hide(p_target text, p_id uuid, p_hidden boolean) returns void
language plpgsql security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  if p_target = 'question' then update questions set hidden = p_hidden where id = p_id;
  elsif p_target = 'answer' then update answers set hidden = p_hidden where id = p_id; end if; end $$;

create or replace function public.admin_concierge() returns table (id uuid, created_at timestamptz, nick text, toys text[], contact_type text, contact text, message text, handled_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  return query select c.id, c.created_at, p.nickname, c.toys, c.contact_type, c.contact, c.message, c.handled_at
  from concierge_requests c join profiles p on p.id = c.user_id order by c.handled_at nulls first, c.created_at desc limit 200; end $$;

create or replace function public.admin_concierge_done(p_id uuid, p_done boolean) returns void
language plpgsql security definer set search_path = public as $$
begin if not public.is_admin() then raise exception 'sem permissão'; end if;
  update concierge_requests set handled_at = case when p_done then now() else null end where id = p_id; end $$;

-- só quem está logado chama as funções novas
do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace
           where n.nspname='public' and p.prosecdef and p.proname in
           ('is_admin','my_announcements','my_questions','change_partner','admin_stats','admin_users','admin_change_partner','admin_set_sub','admin_block',
            'admin_stale_questions','admin_answer','admin_reports','admin_hide','admin_concierge','admin_concierge_done') loop
    execute format('revoke execute on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end $$;
