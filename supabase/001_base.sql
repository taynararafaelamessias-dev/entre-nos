-- =====================================================================
-- Entre Nós · banco de dados (parte 1: base, casal e regras de privacidade)
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Pode rodar de novo sem quebrar (usa IF NOT EXISTS / OR REPLACE).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- PERFIS (uma linha por pessoa) ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nickname      text not null check (char_length(nickname) between 1 and 40),
  gender        text not null check (gender in ('f','m')),
  lang          text not null default 'pt' check (lang in ('pt','es')),
  couple_id     uuid,
  role          text check (role in ('owner','partner')),
  adult_ok_at   timestamptz not null,           -- marcou "tenho 18+ e aceito os termos"
  sensitive_ok_at timestamptz,                  -- marcou a autorização de dados sensíveis (LGPD art. 11 / RGPD art. 9)
  created_at    timestamptz not null default now()
);

-- ---------- CASAL (uma assinatura = duas pessoas) ----------
create table if not exists public.couples (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  partner_id      uuid references public.profiles(id) on delete set null,
  partner_email   text not null,
  partner_gender  text not null check (partner_gender in ('f','m')),
  invite_code     text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  sub_status      text not null default 'trial' check (sub_status in ('trial','active','canceled','expired')),
  sub_until       timestamptz,
  hotmart_ref     text,
  created_at      timestamptz not null default now()
);
alter table public.profiles drop constraint if exists profiles_couple_fk;
alter table public.profiles add constraint profiles_couple_fk foreign key (couple_id) references public.couples(id) on delete set null;

-- ---------- funções de apoio (quem sou eu, qual meu casal, quem é meu par) ----------
create or replace function public.my_couple() returns uuid
language sql stable security definer set search_path = public as
$$ select couple_id from public.profiles where id = auth.uid() $$;

create or replace function public.my_partner() returns uuid
language sql stable security definer set search_path = public as
$$ select case when c.owner_id = auth.uid() then c.partner_id else c.owner_id end
   from public.couples c where c.id = public.my_couple() $$;

alter table public.profiles enable row level security;
alter table public.couples  enable row level security;

drop policy if exists "perfil: ver o meu e o do meu par" on public.profiles;
create policy "perfil: ver o meu e o do meu par" on public.profiles for select
  using (id = auth.uid() or (couple_id is not null and couple_id = public.my_couple()));
drop policy if exists "perfil: editar só o meu" on public.profiles;
create policy "perfil: editar só o meu" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "casal: ver o meu" on public.couples;
create policy "casal: ver o meu" on public.couples for select
  using (owner_id = auth.uid() or partner_id = auth.uid());
-- inserir/alterar casal só pelas funções abaixo (sem policy de insert/update = bloqueado)

-- ---------- CADASTRO DE QUEM COMPRA ----------
create or replace function public.register_owner(p_nickname text, p_gender text, p_lang text,
  p_partner_email text, p_partner_gender text, p_adult boolean, p_sensitive boolean)
returns table (couple_id uuid, invite_code text)
language plpgsql security definer set search_path = public as $$
declare v_couple uuid; v_code text;
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if not p_adult then raise exception 'precisa confirmar 18+ e aceitar os termos'; end if;
  if not p_sensitive then raise exception 'precisa autorizar os dados sensíveis'; end if;
  if exists (select 1 from profiles where id = auth.uid()) then raise exception 'perfil já existe'; end if;
  insert into profiles(id, nickname, gender, lang, role, adult_ok_at, sensitive_ok_at)
    values (auth.uid(), p_nickname, p_gender, coalesce(p_lang,'pt'), 'owner', now(), now());
  insert into couples(owner_id, partner_email, partner_gender)
    values (auth.uid(), lower(trim(p_partner_email)), p_partner_gender)
    returning id, couples.invite_code into v_couple, v_code;
  update profiles set couple_id = v_couple where id = auth.uid();
  return query select v_couple, v_code;
end $$;

-- ---------- O CONVITE (o parceiro abre o link) ----------
-- Mostra só o necessário pra tela "Fulana te chamou pro Entre Nós", sem estar logado.
create or replace function public.invite_info(p_code text)
returns table (inviter_nickname text, inviter_gender text, partner_email text, partner_gender text, already_used boolean)
language sql stable security definer set search_path = public as $$
  select p.nickname, p.gender, c.partner_email, c.partner_gender, c.partner_id is not null
  from couples c join profiles p on p.id = c.owner_id
  where c.invite_code = upper(trim(p_code)) $$;
grant execute on function public.invite_info(text) to anon, authenticated;

create or replace function public.accept_invite(p_code text, p_nickname text, p_lang text, p_adult boolean, p_sensitive boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare c record; v_email text;
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if not p_adult then raise exception 'precisa confirmar 18+ e aceitar os termos'; end if;
  if not p_sensitive then raise exception 'precisa autorizar os dados sensíveis'; end if;
  select * into c from couples where invite_code = upper(trim(p_code)) for update;
  if c.id is null then raise exception 'convite não encontrado'; end if;
  if c.partner_id is not null then raise exception 'convite já usado'; end if;
  select lower(email) into v_email from auth.users where id = auth.uid();
  if v_email <> c.partner_email then raise exception 'este convite é para outro e-mail'; end if;
  insert into profiles(id, nickname, gender, lang, couple_id, role, adult_ok_at, sensitive_ok_at)
    values (auth.uid(), p_nickname, c.partner_gender, coalesce(p_lang,'pt'), c.id, 'partner', now(), now())
    on conflict (id) do update set couple_id = c.id, role = 'partner';
  update couples set partner_id = auth.uid() where id = c.id;
  return c.id;
end $$;

-- ---------- LISTA DE DESEJOS (privada) + MATCH ----------
create table if not exists public.wishlist (
  user_id   uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  item_key  text not null check (item_key ~ '^(pos|pre|toy|bdsm|w):[a-z0-9_-]+$'),
  created_at timestamptz not null default now(),
  primary key (user_id, item_key)
);
alter table public.wishlist enable row level security;
drop policy if exists "desejos: só eu" on public.wishlist;
create policy "desejos: só eu" on public.wishlist for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- o parceiro só fica sabendo do que está na lista DOS DOIS
create or replace function public.couple_matches() returns setof text
language sql stable security definer set search_path = public as $$
  select a.item_key from wishlist a join wishlist b on a.item_key = b.item_key
  where a.user_id = auth.uid() and b.user_id = public.my_partner() $$;

-- ---------- DIÁRIO DAS POSIÇÕES (privado) ----------
create table if not exists public.diary (
  user_id  uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  pos_id   text not null,
  rating   smallint check (rating between 1 and 5),
  note     text check (char_length(note) <= 1000),
  done_at  timestamptz not null default now(),
  primary key (user_id, pos_id)
);
alter table public.diary enable row level security;
drop policy if exists "diário: só eu" on public.diary;
create policy "diário: só eu" on public.diary for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- COMPARTILHADOS (diário, preliminares, brinquedos, desejos revelados) ----------
create table if not exists public.shares (
  id         uuid primary key default gen_random_uuid(),
  couple_id  uuid not null references public.couples(id) on delete cascade default public.my_couple(),
  from_user  uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  kind       text not null check (kind in ('diary','pre','toy','wish','bdsm')),
  keys       text[] not null,
  mode       text not null default 'share' check (mode in ('share','ask','sur')),
  message    text check (char_length(message) <= 500),
  created_at timestamptz not null default now()
);
create table if not exists public.share_comments (
  share_id   uuid not null references public.shares(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  body       text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  primary key (share_id, user_id)          -- cada um comenta UMA vez
);
alter table public.shares enable row level security;
alter table public.share_comments enable row level security;
drop policy if exists "compartilhados: do meu casal" on public.shares;
create policy "compartilhados: do meu casal" on public.shares for select using (couple_id = public.my_couple());
drop policy if exists "compartilhados: eu envio" on public.shares;
create policy "compartilhados: eu envio" on public.shares for insert with check (couple_id = public.my_couple() and from_user = auth.uid());
drop policy if exists "compartilhados: apago o meu" on public.shares;
create policy "compartilhados: apago o meu" on public.shares for delete using (from_user = auth.uid());
drop policy if exists "comentários: do meu casal" on public.share_comments;
create policy "comentários: do meu casal" on public.share_comments for select
  using (exists (select 1 from shares s where s.id = share_id and s.couple_id = public.my_couple()));
drop policy if exists "comentários: eu comento" on public.share_comments;
create policy "comentários: eu comento" on public.share_comments for insert
  with check (user_id = auth.uid() and exists (select 1 from shares s where s.id = share_id and s.couple_id = public.my_couple()));

-- ---------- BDSM: NOSSOS LIMITES (o "não" do outro nunca aparece) ----------
create table if not exists public.bdsm_limits (
  user_id      uuid primary key references public.profiles(id) on delete cascade default auth.uid(),
  pain         smallint not null check (pain between 0 and 5),
  safe_word    text check (char_length(safe_word) <= 40),
  safe_sign    text check (char_length(safe_sign) <= 80),
  answers      jsonb not null default '{}'::jsonb,   -- {"venda":"y","tapas":"m","mordaca":"n",...}
  submitted_at timestamptz not null default now()
);
alter table public.bdsm_limits enable row level security;
drop policy if exists "limites: só eu" on public.bdsm_limits;
create policy "limites: só eu" on public.bdsm_limits for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.couple_limits()
returns table (my_pain smallint, partner_pain smallint, partner_word text, partner_sign text, item text, both_yes boolean)
language sql stable security definer set search_path = public as $$
  with me as (select * from bdsm_limits where user_id = auth.uid()),
       pa as (select * from bdsm_limits where user_id = public.my_partner())
  select me.pain, pa.pain, pa.safe_word, pa.safe_sign, k.key,
         (me.answers->>k.key) = 'y' and (pa.answers->>k.key) = 'y'
  from me, pa, jsonb_object_keys(me.answers) as k(key)
  where coalesce(me.answers->>k.key,'n') <> 'n' and coalesce(pa.answers->>k.key,'n') <> 'n' $$;

-- ---------- DESAFIO DO CASAL ----------
create table if not exists public.challenges (
  id         uuid primary key default gen_random_uuid(),
  couple_id  uuid not null references public.couples(id) on delete cascade default public.my_couple(),
  days       smallint not null check (days between 1 and 7),
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.challenge_days (
  id           uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  day_no       smallint not null check (day_no between 1 and 7),
  picker       uuid not null references public.profiles(id) on delete cascade,
  items        text[] not null default '{}',
  sent         boolean not null default false,
  done         boolean not null default false,
  unique (challenge_id, day_no)
);
create table if not exists public.challenge_comments (
  day_id     uuid not null references public.challenge_days(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  body       text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  primary key (day_id, user_id)
);
alter table public.challenges enable row level security;
alter table public.challenge_days enable row level security;
alter table public.challenge_comments enable row level security;
drop policy if exists "desafio: do meu casal" on public.challenges;
create policy "desafio: do meu casal" on public.challenges for all using (couple_id = public.my_couple()) with check (couple_id = public.my_couple());
drop policy if exists "dias: do meu casal (ler)" on public.challenge_days;
create policy "dias: do meu casal (ler)" on public.challenge_days for select
  using (exists (select 1 from challenges c where c.id = challenge_id and c.couple_id = public.my_couple()));
drop policy if exists "dias: criar" on public.challenge_days;
create policy "dias: criar" on public.challenge_days for insert
  with check (exists (select 1 from challenges c where c.id = challenge_id and c.couple_id = public.my_couple()));
drop policy if exists "dias: editar" on public.challenge_days;
create policy "dias: editar" on public.challenge_days for update
  using (exists (select 1 from challenges c where c.id = challenge_id and c.couple_id = public.my_couple()));
-- quem não é o "picker" só pode marcar feito: trava abaixo
create or replace function public.guard_challenge_day() returns trigger language plpgsql as $$
begin
  if new.picker <> auth.uid() and (new.items is distinct from old.items or new.sent is distinct from old.sent) then
    raise exception 'só quem monta o dia pode escolher os itens';
  end if;
  if coalesce(array_length(new.items,1),0) > 8 then raise exception 'no máximo 2 itens de cada tipo'; end if;
  return new;
end $$;
drop trigger if exists trg_guard_challenge_day on public.challenge_days;
create trigger trg_guard_challenge_day before update on public.challenge_days for each row execute function public.guard_challenge_day();
drop policy if exists "comentários do desafio: ler" on public.challenge_comments;
create policy "comentários do desafio: ler" on public.challenge_comments for select
  using (exists (select 1 from challenge_days d join challenges c on c.id = d.challenge_id where d.id = day_id and c.couple_id = public.my_couple()));
drop policy if exists "comentários do desafio: comentar" on public.challenge_comments;
create policy "comentários do desafio: comentar" on public.challenge_comments for insert
  with check (user_id = auth.uid() and exists (select 1 from challenge_days d join challenges c on c.id = d.challenge_id where d.id = day_id and c.couple_id = public.my_couple()));

-- ---------- PRO MEU AMOR ----------
create table if not exists public.love_messages (
  id         uuid primary key default gen_random_uuid(),
  couple_id  uuid not null references public.couples(id) on delete cascade default public.my_couple(),
  from_user  uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  body       text not null check (char_length(body) between 1 and 600),
  reply      text check (char_length(reply) <= 600),
  created_at timestamptz not null default now()
);
alter table public.love_messages enable row level security;
drop policy if exists "amor: ler" on public.love_messages;
create policy "amor: ler" on public.love_messages for select using (couple_id = public.my_couple());
drop policy if exists "amor: enviar" on public.love_messages;
create policy "amor: enviar" on public.love_messages for insert with check (couple_id = public.my_couple() and from_user = auth.uid());
drop policy if exists "amor: responder" on public.love_messages;
create policy "amor: responder" on public.love_messages for update using (couple_id = public.my_couple() and from_user <> auth.uid());

-- ---------- CONSULTORIA DISCRETA ----------
create table if not exists public.concierge_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  toys         text[] not null,
  contact_type text not null check (contact_type in ('wa','mail')),
  contact      text not null check (char_length(contact) <= 120),
  message      text check (char_length(message) <= 600),
  created_at   timestamptz not null default now()
);
alter table public.concierge_requests enable row level security;
drop policy if exists "consultoria: o meu" on public.concierge_requests;
create policy "consultoria: o meu" on public.concierge_requests for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- índices ----------
create index if not exists shares_couple_idx on public.shares(couple_id, created_at desc);
create index if not exists love_couple_idx on public.love_messages(couple_id, created_at desc);
create index if not exists chdays_ch_idx on public.challenge_days(challenge_id);
