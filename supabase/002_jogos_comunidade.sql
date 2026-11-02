-- =====================================================================
-- Entre Nós · banco de dados (parte 2: jogos que se apagam em 24h,
-- jogos grátis e a comunidade anônima)
-- Rode DEPOIS da parte 1.
-- =====================================================================

-- ---------- conta grátis (só jogos) ----------
create or replace function public.register_free(p_nickname text, p_gender text, p_lang text, p_adult boolean, p_sensitive boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if not p_adult or not p_sensitive then raise exception 'precisa confirmar 18+ e as autorizações'; end if;
  insert into profiles(id, nickname, gender, lang, adult_ok_at, sensitive_ok_at)
    values (auth.uid(), p_nickname, p_gender, coalesce(p_lang,'pt'), now(), now())
    on conflict (id) do nothing;
end $$;

create table if not exists public.free_plays (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  used    smallint not null default 0
);
alter table public.free_plays enable row level security;
drop policy if exists "jogos grátis: ver os meus" on public.free_plays;
create policy "jogos grátis: ver os meus" on public.free_plays for select using (user_id = auth.uid());

create or replace function public.has_active_plan() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from couples c where c.id = public.my_couple()
                 and (c.sub_status in ('trial','active') or (c.sub_status = 'canceled' and c.sub_until > now()))) $$;

-- ---------- salas de jogo (tudo some em 24 horas) ----------
create table if not exists public.game_rooms (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique default upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  game       text not null check (game in ('scene','plan','like','tod','tease','talk')),
  couple_id  uuid references public.couples(id) on delete cascade,
  free       boolean not null default false,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.game_members (
  room_id uuid not null references public.game_rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (room_id, user_id)
);
create table if not exists public.game_events (
  id         bigint generated always as identity primary key,
  room_id    uuid not null references public.game_rooms(id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  kind       text not null default 'msg',
  body       text check (char_length(body) <= 1000),
  data       jsonb,
  created_at timestamptz not null default now()
);
create or replace function public.in_room(p_room uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from game_members where room_id = p_room and user_id = auth.uid()) $$;

alter table public.game_rooms enable row level security;
alter table public.game_members enable row level security;
alter table public.game_events enable row level security;
drop policy if exists "salas: as minhas" on public.game_rooms;
create policy "salas: as minhas" on public.game_rooms for select using (public.in_room(id));
drop policy if exists "salas: atualizar estado" on public.game_rooms;
create policy "salas: atualizar estado" on public.game_rooms for update using (public.in_room(id));
drop policy if exists "membros: das minhas salas" on public.game_members;
create policy "membros: das minhas salas" on public.game_members for select using (public.in_room(room_id));
drop policy if exists "eventos: ler" on public.game_events;
create policy "eventos: ler" on public.game_events for select using (public.in_room(room_id));
drop policy if exists "eventos: enviar" on public.game_events;
create policy "eventos: enviar" on public.game_events for insert with check (user_id = auth.uid() and public.in_room(room_id));

-- abrir uma sala: assinante abre pro casal; quem não assina gasta 1 dos 3 jogos grátis
create or replace function public.open_room(p_game text)
returns table (room_id uuid, code text, free_left smallint)
language plpgsql security definer set search_path = public as $$
declare v_room uuid; v_code text; v_used smallint; v_couple uuid; v_partner uuid;
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  if public.has_active_plan() then
    v_couple := public.my_couple(); v_partner := public.my_partner();
    insert into game_rooms(game, couple_id) values (p_game, v_couple) returning id, game_rooms.code into v_room, v_code;
    insert into game_members values (v_room, auth.uid());
    if v_partner is not null then insert into game_members values (v_room, v_partner); end if;
    return query select v_room, v_code, null::smallint;
  else
    insert into free_plays(user_id) values (auth.uid()) on conflict (user_id) do nothing;
    select used into v_used from free_plays where user_id = auth.uid() for update;
    if v_used >= 3 then raise exception 'acabaram os 3 jogos grátis'; end if;
    update free_plays set used = used + 1 where user_id = auth.uid();
    insert into game_rooms(game, free) values (p_game, true) returning id, game_rooms.code into v_room, v_code;
    insert into game_members values (v_room, auth.uid());
    return query select v_room, v_code, (2 - v_used)::smallint;
  end if;
end $$;

-- entrar numa sala grátis pelo link (no máximo 2 pessoas)
create or replace function public.join_room(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_room uuid;
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  select id into v_room from game_rooms where code = upper(trim(p_code)) and created_at > now() - interval '24 hours';
  if v_room is null then raise exception 'sala não encontrada ou expirada'; end if;
  if (select count(*) from game_members where room_id = v_room) >= 2
     and not exists (select 1 from game_members where room_id = v_room and user_id = auth.uid())
  then raise exception 'sala cheia'; end if;
  insert into game_members values (v_room, auth.uid()) on conflict do nothing;
  return v_room;
end $$;

-- tempo real: os dois veem a jogada do outro na hora
do $$ begin
  alter publication supabase_realtime add table public.game_events;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.game_rooms;
exception when duplicate_object then null; end $$;

-- ---------- COMUNIDADE ANÔNIMA ----------
-- As tabelas ficam fechadas: ninguém lê direto (nem vê quem perguntou).
-- Tudo passa pelas funções abaixo, que nunca devolvem o autor.
create table if not exists public.questions (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  audience   text not null check (audience in ('f','m','b')),
  body       text not null check (char_length(body) between 5 and 1000),
  open       boolean not null default true,
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.answers (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  author_id   uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body        text check (char_length(body) <= 1500),
  audio_path  text,
  audio_secs  smallint check (audio_secs between 1 and 30),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (question_id, author_id),
  check (body is not null or audio_path is not null)
);
create table if not exists public.followups (
  id         uuid primary key default gen_random_uuid(),
  answer_id  uuid not null references public.answers(id) on delete cascade,
  body       text not null check (char_length(body) between 2 and 600),
  reply      text check (char_length(reply) <= 1500),
  created_at timestamptz not null default now()
);
create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  reporter   uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  target     text not null check (target in ('question','answer','followup')),
  target_id  uuid not null,
  reason     text check (char_length(reason) <= 300),
  created_at timestamptz not null default now()
);
alter table public.questions enable row level security;
alter table public.answers   enable row level security;
alter table public.followups enable row level security;
alter table public.reports   enable row level security;
drop policy if exists "denúncia: enviar" on public.reports;
create policy "denúncia: enviar" on public.reports for insert with check (reporter = auth.uid());

-- regras de texto: sem link, @, telefone e palavrão
create or replace function public.check_text(t text) returns void language plpgsql immutable as $$
begin
  if t is null then return; end if;
  if t ~* '(https?://|www\.|\.(com|net|org|br|es|app|me|io)\b|@\w)' then raise exception 'regra: sem link nem @'; end if;
  if t ~ '(\d[\s().-]*){8,}' then raise exception 'regra: sem telefone'; end if;
  if t ~* '\m(porra|caralho|buceta|xoxota|piroca|foder|fode|puta|puto|merda|viado|coño|joder|polla|mierda|follar|pendejo|cabr[oó]n)\M'
    then raise exception 'regra: sem palavrão'; end if;
end $$;

create or replace function public.ask_question(p_audience text, p_body text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  if not exists (select 1 from profiles where id = auth.uid()) then raise exception 'sem perfil'; end if;
  perform public.check_text(p_body);
  insert into questions(audience, body) values (p_audience, trim(p_body)) returning id into v;
  return v;
end $$;

-- o mural de quem vai responder: mulheres veem 'f' e 'b'; homens veem 'm' e 'b'
create or replace function public.wall()
returns table (id uuid, body text, created_at timestamptz, answers smallint)
language sql stable security definer set search_path = public as $$
  select q.id, q.body, q.created_at, (select count(*) from answers a where a.question_id = q.id and not a.hidden)::smallint
  from questions q, profiles me
  where me.id = auth.uid() and q.open and not q.hidden and q.author_id <> me.id
    and (q.audience = me.gender or q.audience = 'b')
    and not exists (select 1 from answers a where a.question_id = q.id and a.author_id = me.id)
  order by q.created_at desc limit 50 $$;

create or replace function public.answer_question(p_question uuid, p_body text, p_audio_path text, p_audio_secs smallint)
returns void language plpgsql security definer set search_path = public as $$
declare q record; n int; g text;
begin
  select gender into g from profiles where id = auth.uid();
  select * into q from questions where id = p_question for update;
  if q.id is null or not q.open or q.hidden then raise exception 'pergunta fechada'; end if;
  if q.author_id = auth.uid() then raise exception 'não dá pra responder a própria pergunta'; end if;
  if q.audience <> 'b' and q.audience <> g then raise exception 'esta pergunta é pra outro mural'; end if;
  perform public.check_text(p_body);
  insert into answers(question_id, body, audio_path, audio_secs) values (p_question, nullif(trim(p_body),''), p_audio_path, p_audio_secs);
  select count(*) into n from answers where question_id = p_question and not hidden;
  if n >= 3 then update questions set open = false where id = p_question; end if;
end $$;

-- minhas perguntas, com as respostas e os pedidos de detalhe (sem mostrar quem respondeu)
create or replace function public.my_questions() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'audience', q.audience, 'body', q.body, 'created_at', q.created_at, 'open', q.open,
    'answers', (select coalesce(jsonb_agg(jsonb_build_object(
        'id', a.id, 'body', a.body, 'audio_path', a.audio_path, 'audio_secs', a.audio_secs, 'created_at', a.created_at,
        'followups', (select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'body', f.body, 'reply', f.reply) order by f.created_at), '[]'::jsonb)
                      from followups f where f.answer_id = a.id)) order by a.created_at), '[]'::jsonb)
      from answers a where a.question_id = q.id and not a.hidden)
  ) order by q.created_at desc), '[]'::jsonb)
  from questions q where q.author_id = auth.uid() $$;

-- pedir mais detalhes: só quem perguntou, no máximo 2 vezes por resposta
create or replace function public.ask_followup(p_answer uuid, p_body text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from answers a join questions q on q.id = a.question_id where a.id = p_answer and q.author_id = auth.uid())
    then raise exception 'só quem perguntou pode pedir mais detalhes'; end if;
  if (select count(*) from followups where answer_id = p_answer) >= 2 then raise exception 'já usou os 2 pedidos de detalhe'; end if;
  perform public.check_text(p_body);
  insert into followups(answer_id, body) values (p_answer, trim(p_body));
end $$;

-- pedidos de detalhe que chegaram pra mim (eu respondi a pergunta)
create or replace function public.my_followups() returns table (id uuid, question text, my_answer text, body text)
language sql stable security definer set search_path = public as $$
  select f.id, q.body, a.body, f.body from followups f
  join answers a on a.id = f.answer_id join questions q on q.id = a.question_id
  where a.author_id = auth.uid() and f.reply is null order by f.created_at $$;

create or replace function public.reply_followup(p_id uuid, p_body text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from followups f join answers a on a.id = f.answer_id where f.id = p_id and a.author_id = auth.uid() and f.reply is null)
    then raise exception 'não encontrado'; end if;
  perform public.check_text(p_body);
  update followups set reply = trim(p_body) where id = p_id;
end $$;

-- ---------- LIMPEZA AUTOMÁTICA ----------
create extension if not exists pg_cron;
select cron.schedule('entrenos-apagar-24h', '7 * * * *',
  $$ delete from public.game_rooms where created_at < now() - interval '24 hours' $$);
select cron.schedule('entrenos-perguntas-90d', '17 3 * * *',
  $$ delete from public.questions where not open and created_at < now() - interval '90 days' $$);
