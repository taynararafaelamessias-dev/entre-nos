-- =====================================================================
-- Entre Nós · parte 11: Sequência de fogo, Quem segura mais, Semana do cuidado,
-- pódio Ele × Ela e "Com amor" no Conversar
-- Cole tudo no SQL Editor do Supabase e toque em Run.
-- =====================================================================

-- "Com amor" vira um tipo de mensagem do Conversar
alter table public.couple_messages drop constraint if exists couple_messages_kind_check;
alter table public.couple_messages add constraint couple_messages_kind_check check (kind in ('text','tease','wish','love'));

-- dia do desafio do casal marcado como feito (pra contar ponto na semana certa)
alter table public.challenge_days add column if not exists done_at timestamptz;
create or replace function public.stamp_day_done() returns trigger language plpgsql set search_path = public as $$
begin if new.done and (tg_op = 'INSERT' or not coalesce(old.done,false)) then new.done_at := now(); end if;
      if not new.done then new.done_at := null; end if; return new; end $$;
drop trigger if exists trg_stamp_day_done on public.challenge_days;
create trigger trg_stamp_day_done before insert or update on public.challenge_days for each row execute function public.stamp_day_done();

-- ---------- desafios novos ----------
create table if not exists public.challenge_runs (
  id          uuid primary key default gen_random_uuid(),
  couple_id   uuid not null references public.couples(id) on delete cascade default public.my_couple(),
  type        text not null check (type in ('fire','hold','care')),
  created_by  uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  status      text not null default 'invited' check (status in ('invited','active','done','broken','declined','canceled')),
  config      jsonb not null default '{}'::jsonb,      -- fire: {"days":3} · hold: {"meta":{"<user>":5}} · care: {"resp":"<user>","days":[1,2,3]}
  start_date  date,
  created_at  timestamptz not null default now(),
  accepted_at timestamptz,
  ended_at    timestamptz
);
create index if not exists challenge_runs_couple on public.challenge_runs(couple_id, type, created_at desc);
create table if not exists public.challenge_marks (
  run_id     uuid not null references public.challenge_runs(id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  day_no     smallint not null default 1 check (day_no between 1 and 7),
  kind       text not null check (kind in ('done','fire','count','hit','care','heart')),
  value      int,
  note       text check (char_length(note) <= 300),
  created_at timestamptz not null default now(),
  primary key (run_id, user_id, day_no, kind)
);
alter table public.challenge_runs  enable row level security;
alter table public.challenge_marks enable row level security;
drop policy if exists "desafios novos: do meu casal" on public.challenge_runs;
create policy "desafios novos: do meu casal" on public.challenge_runs for select using (couple_id = public.my_couple());
drop policy if exists "marcas: do meu casal" on public.challenge_marks;
create policy "marcas: do meu casal" on public.challenge_marks for select
  using (exists (select 1 from public.challenge_runs r where r.id = run_id and r.couple_id = public.my_couple()));

-- dia de hoje no horário da Europa/Brasil não importa muito: usamos a data de Madrid
create or replace function public.ch_today() returns date language sql stable as $$ select (now() at time zone 'Europe/Madrid')::date $$;

-- atualiza o estado (quebrou a sequência, terminou a semana, os dois mandaram o número)
create or replace function public.ch_refresh(p_run uuid) returns void
language plpgsql security definer set search_path = public as $$
declare r challenge_runs; n int; k int; today date := public.ch_today(); users int;
begin
  select * into r from challenge_runs where id = p_run for update;
  if r.id is null or r.status <> 'active' then return; end if;
  if r.type = 'fire' then
    n := coalesce((r.config->>'days')::int, 3);
    for k in 1..n loop
      if not exists (select 1 from challenge_marks m where m.run_id = r.id and m.day_no = k and m.kind = 'done') then
        -- cada dia pode ser marcado até o fim do dia seguinte
        if today > r.start_date + k then
          update challenge_runs set status = 'broken', ended_at = now() where id = r.id; return;
        end if;
        return;  -- ainda dentro do prazo
      end if;
    end loop;
    update challenge_runs set status = 'done', ended_at = now() where id = r.id;
  elsif r.type = 'hold' then
    select count(distinct user_id) into users from challenge_marks where run_id = r.id and kind = 'hit';
    if users >= 2 then update challenge_runs set status = 'done', ended_at = now() where id = r.id; end if;
  elsif r.type = 'care' then
    if today > r.start_date + 7 then update challenge_runs set status = 'done', ended_at = now() where id = r.id; end if;
  end if;
end $$;

create or replace function public.ch_invite(p_type text, p_config jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare c uuid := public.my_couple(); v uuid;
begin
  if c is null then raise exception 'sem casal'; end if;
  if not exists (select 1 from couples where id = c and partner_id is not null) then raise exception 'seu par ainda não entrou'; end if;
  if exists (select 1 from challenge_runs where couple_id = c and type = p_type and status = 'active') then raise exception 'já tem um desse em andamento'; end if;
  update challenge_runs set status = 'canceled', ended_at = now() where couple_id = c and type = p_type and status = 'invited';
  insert into challenge_runs(type, config) values (p_type, coalesce(p_config,'{}'::jsonb)) returning id into v;
  return v;
end $$;

drop function if exists public.ch_answer(uuid, boolean);
create or replace function public.ch_answer(p_run uuid, p_accept boolean, p_config jsonb default null) returns void
language plpgsql security definer set search_path = public as $$
declare r challenge_runs; cfg jsonb;
begin
  select * into r from challenge_runs where id = p_run and couple_id = public.my_couple() for update;
  if r.id is null or r.status <> 'invited' then raise exception 'convite não encontrado'; end if;
  if r.created_by = auth.uid() then
    if not p_accept then update challenge_runs set status = 'canceled', ended_at = now() where id = r.id; return; end if;
    raise exception 'quem aceita é o seu par';
  end if;
  if p_accept then
    cfg := r.config;
    -- quem segura mais: quem aceita define a meta de quem convidou
    if r.type = 'hold' and p_config ? 'meta' then cfg := jsonb_set(cfg, '{meta}', coalesce(cfg->'meta','{}'::jsonb) || (p_config->'meta')); end if;
    update challenge_runs set status = 'active', accepted_at = now(), start_date = public.ch_today(), config = cfg where id = r.id;
  else update challenge_runs set status = 'declined', ended_at = now() where id = r.id; end if;
end $$;

-- semana do cuidado: o responsável escolhe os dias da semana em que vai fazer
create or replace function public.ch_set_days(p_run uuid, p_days int[]) returns void
language plpgsql security definer set search_path = public as $$
declare r challenge_runs;
begin
  select * into r from challenge_runs where id = p_run and couple_id = public.my_couple() for update;
  if r.id is null or r.type <> 'care' or r.status not in ('invited','active') then raise exception 'desafio não encontrado'; end if;
  if (r.config->>'resp')::uuid <> auth.uid() then raise exception 'quem escolhe os dias é o responsável'; end if;
  if p_days is null or array_length(p_days,1) is null or exists (select 1 from unnest(p_days) d where d not between 1 and 7) then raise exception 'escolha pelo menos um dia'; end if;
  update challenge_runs set config = jsonb_set(config, '{days}', to_jsonb((select array_agg(distinct d order by d) from unnest(p_days) d))) where id = r.id;
end $$;

create or replace function public.ch_mark(p_run uuid, p_day int, p_kind text, p_value int, p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare r challenge_runs; resp uuid; today_no int;
begin
  perform public.ch_refresh(p_run);
  select * into r from challenge_runs where id = p_run and couple_id = public.my_couple();
  if r.id is null or r.status <> 'active' then raise exception 'esse desafio não está em andamento'; end if;
  today_no := public.ch_today() - r.start_date + 1;
  if r.type = 'fire' then
    if p_kind not in ('done','fire') then raise exception 'marca inválida'; end if;
    if p_day > today_no or p_day < 1 or p_day > coalesce((r.config->>'days')::int,3) then raise exception 'esse dia ainda não chegou'; end if;
    if p_kind = 'fire' and not exists (select 1 from challenge_marks where run_id = r.id and day_no = p_day and kind = 'done') then raise exception 'marque o dia primeiro'; end if;
    if p_kind = 'fire' and (p_value is null or p_value not between 1 and 5) then raise exception 'nota de 1 a 5'; end if;
  elsif r.type = 'hold' then
    if p_kind = 'hit' then if p_value is null or p_value not in (0,1) then raise exception 'marque se alcançou'; end if;
    elsif p_kind = 'count' then if p_value is null or p_value not between 0 and 99 then raise exception 'número inválido'; end if;
    else raise exception 'marca inválida'; end if;
    p_day := 1;
  elsif r.type = 'care' then
    resp := (r.config->>'resp')::uuid;
    if p_kind = 'care' then
      if auth.uid() <> resp then raise exception 'quem marca o cuidado é o responsável da semana'; end if;
      if p_day < 1 or p_day > least(today_no, 7) then raise exception 'esse dia ainda não chegou'; end if;
      if r.config ? 'days' and not (r.config->'days') @> to_jsonb(p_day) then raise exception 'esse dia não foi escolhido'; end if;
    elsif p_kind = 'heart' then
      if auth.uid() = resp then raise exception 'o coração é do outro'; end if;
      if not exists (select 1 from challenge_marks where run_id = r.id and day_no = p_day and kind = 'care') then raise exception 'ainda não tem cuidado nesse dia'; end if;
    else raise exception 'marca inválida'; end if;
  end if;
  insert into challenge_marks(run_id, user_id, day_no, kind, value, note)
  values (r.id, auth.uid(), p_day, p_kind, p_value, nullif(trim(coalesce(p_note,'')),''))
  on conflict (run_id, user_id, day_no, kind) do update set value = excluded.value, note = excluded.note, created_at = case when challenge_marks.kind = 'care' then challenge_marks.created_at else now() end;
  perform public.ch_refresh(r.id);
end $$;

-- estado de tudo pra tela (e já atualiza os que venceram o prazo)
create or replace function public.ch_state() returns jsonb
language plpgsql security definer set search_path = public as $$
declare c uuid := public.my_couple(); x record;
begin
  if c is null then return '[]'::jsonb; end if;
  for x in select id from challenge_runs where couple_id = c and status = 'active' loop perform public.ch_refresh(x.id); end loop;
  return (select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'type', r.type, 'by', r.created_by, 'status', r.status, 'config', r.config,
      'start', r.start_date, 'today', public.ch_today(), 'created_at', r.created_at, 'ended_at', r.ended_at,
      'marks', (select coalesce(jsonb_agg(jsonb_build_object('u', m.user_id, 'd', m.day_no, 'k', m.kind, 'v', m.value, 'n', m.note)), '[]'::jsonb) from challenge_marks m where m.run_id = r.id))
      order by r.created_at desc), '[]'::jsonb)
    from (select distinct on (type) * from challenge_runs where couple_id = c and status <> 'canceled' order by type, created_at desc) r);
end $$;

-- ---------- pódio Ele × Ela ----------
create or replace function public.couple_points(p_since timestamptz)
returns table (user_id uuid, pts int)
language sql stable security definer set search_path = public as $$
  with c as (select public.my_couple() id),
  ev as (
    -- desafio do casal: 1 ponto pra quem montou o dia feito
    select d.picker u, 1 p, d.done_at at from challenge_days d join challenges ch on ch.id = d.challenge_id, c
     where ch.couple_id = c.id and d.done and d.done_at is not null
    -- sequência de fogo: só conta se completar. 1 por dia com nota + 3 de bônus
    union all select m.user_id, 1, r.ended_at from challenge_marks m join challenge_runs r on r.id = m.run_id, c
     where r.couple_id = c.id and r.type = 'fire' and r.status = 'done' and m.kind = 'fire'
    union all select u.uid, 3, r.ended_at from challenge_runs r, c,
       lateral (select owner_id uid from couples where id = c.id union select partner_id from couples where id = c.id) u
     where r.couple_id = c.id and r.type = 'fire' and r.status = 'done' and u.uid is not null
    -- quem segura mais: alcançou a meta = 3, não alcançou = 1 (por participar)
    union all select m.user_id, case when m.value = 1 then 3 else 1 end, r.ended_at
     from challenge_marks m join challenge_runs r on r.id = m.run_id, c
     where r.couple_id = c.id and r.type = 'hold' and r.status = 'done' and m.kind = 'hit'
    -- semana do cuidado: 1 por dia pro responsável (+3 nos 7 dias) e 1 por coração pro outro
    union all select m.user_id, 1, m.created_at from challenge_marks m join challenge_runs r on r.id = m.run_id, c
     where r.couple_id = c.id and r.type = 'care' and m.kind in ('care','heart')
    union all select (r.config->>'resp')::uuid, 3, r.ended_at from challenge_runs r, c
     where r.couple_id = c.id and r.type = 'care' and r.status = 'done'
       and (select count(distinct day_no) from challenge_marks m where m.run_id = r.id and m.kind = 'care') >= 7
  )
  select u.uid, coalesce((select sum(ev.p)::int from ev where ev.u = u.uid and ev.at >= p_since), 0)
  from c, lateral (select owner_id uid from couples where id = c.id union select partner_id from couples where id = c.id) u
  where u.uid is not null $$;

create or replace function public.couple_podium() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'week',  (select jsonb_object_agg(user_id, pts) from public.couple_points(date_trunc('week', now() at time zone 'Europe/Madrid') at time zone 'Europe/Madrid')),
    'last',  (select jsonb_object_agg(a.user_id, a.pts - coalesce(b.pts,0))
               from public.couple_points(date_trunc('week', now() at time zone 'Europe/Madrid') at time zone 'Europe/Madrid' - interval '7 days') a
               left join public.couple_points(date_trunc('week', now() at time zone 'Europe/Madrid') at time zone 'Europe/Madrid') b on b.user_id = a.user_id),
    'total', (select jsonb_object_agg(user_id, pts) from public.couple_points('-infinity'))) $$;

-- ---------- Novidades: tudo de antes + desafios novos ----------
create or replace function public.my_news()
returns table (area text, kind text, ref text, at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); c uuid := public.my_couple(); p uuid; wk timestamptz;
begin
  if me is null then return; end if;
  return query
    select 'games'::text, 'game_inv'::text, r.code::text, r.created_at from game_rooms r
     where r.created_by in (select partner_id from couples where id = c union select owner_id from couples where id = c) and r.created_by <> me
       and r.created_at > now() - interval '24 hours'
       and not exists (select 1 from game_members m where m.room_id = r.id and m.user_id = me)
       and r.created_at > coalesce((select seen_at from news_seen s where s.user_id = me and s.area = 'games'), '-infinity');
  if c is null then return; end if;
  select case when owner_id = me then partner_id else owner_id end into p from couples where id = c;
  if p is null then return; end if;
  wk := date_trunc('week', now() at time zone 'Europe/Madrid') at time zone 'Europe/Madrid';
  return query
  with seen as (select s.area a, s.seen_at t from news_seen s where s.user_id = me),
  ev as (
    select 'love'::text area, 'love_new'::text kind, l.id::text ref, l.created_at at from love_messages l where l.couple_id = c and l.from_user = p
    union all select 'love', 'love_reply', l.id::text, l.replied_at from love_messages l where l.couple_id = c and l.from_user = me and l.replied_at is not null
    union all select 'talk', 'talk_' || m.kind, m.id::text, m.created_at from couple_messages m where m.couple_id = c and m.from_user = p
    union all select case s.kind when 'toy' then 'toys' else s.kind end, 'share_' || s.mode, s.id::text, s.created_at from shares s where s.couple_id = c and s.from_user = p
    union all select case s.kind when 'toy' then 'toys' else s.kind end, 'share_cmt', s.id::text, sc.created_at
      from share_comments sc join shares s on s.id = sc.share_id where s.couple_id = c and s.from_user = me and sc.user_id = p
    union all select 'chal', 'chal_new', ch.id::text, ch.created_at from challenges ch where ch.couple_id = c and ch.created_by = p and ch.active
    union all select 'chal', 'chal_day', d.day_no::text, d.sent_at from challenge_days d join challenges ch on ch.id = d.challenge_id
      where ch.couple_id = c and ch.active and d.picker = p and d.sent and d.sent_at is not null
    union all select 'chal', 'chal_cmt', d.day_no::text, cc.created_at from challenge_comments cc join challenge_days d on d.id = cc.day_id join challenges ch on ch.id = d.challenge_id
      where ch.couple_id = c and ch.active and cc.user_id = p
    union all select 'bdsm', 'bdsm_limits', '', b.submitted_at from bdsm_limits b where b.user_id = p
    union all select 'games', 'game_tease', r.code::text, e.created_at from game_events e join game_rooms r on r.id = e.room_id
      where e.kind = 'tease' and e.user_id = p and exists (select 1 from game_members m where m.room_id = r.id and m.user_id = me)
    -- desafios novos
    union all select 'heat', 'inv_' || r.type, r.id::text, r.created_at from challenge_runs r where r.couple_id = c and r.created_by = p and r.status = 'invited'
    union all select 'heat', 'acc_' || r.type, r.id::text, r.accepted_at from challenge_runs r where r.couple_id = c and r.created_by = me and r.accepted_at is not null
    union all select 'heat', 'mk_' || r.type || '_' || m.kind, m.day_no::text, m.created_at from challenge_marks m join challenge_runs r on r.id = m.run_id
      where r.couple_id = c and m.user_id = p and m.kind in ('done','care','heart','hit')
    union all select 'heat', 'end_' || r.type || '_' || r.status, r.id::text, r.ended_at from challenge_runs r
      where r.couple_id = c and r.status in ('done','broken') and r.ended_at is not null
    union all select 'heat', 'week_end', '', wk where exists (select 1 from public.couple_points(wk - interval '7 days') x left join public.couple_points(wk) y on y.user_id = x.user_id where x.pts - coalesce(y.pts,0) > 0)
  )
  select ev.area, ev.kind, ev.ref, ev.at from ev left join seen on seen.a = ev.area
   where ev.at > now() - interval '7 days' and ev.at <= now() and ev.at > coalesce(seen.t, '-infinity')
   order by ev.at desc limit 50;
end $$;

do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and p.proname in ('my_news','ch_refresh','ch_invite','ch_answer','ch_set_days','ch_mark','ch_state','couple_points','couple_podium') loop
    execute format('revoke execute on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end $$;
