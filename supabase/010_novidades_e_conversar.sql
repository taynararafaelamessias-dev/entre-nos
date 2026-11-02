-- =====================================================================
-- Entre Nós · parte 10: Conversar de verdade + Novidades do par na tela inicial
-- Cole tudo no SQL Editor do Supabase e toque em Run.
-- =====================================================================

-- ---------- Conversar: mensagens do casal (somem em 24h) ----------
create table if not exists public.couple_messages (
  id         uuid primary key default gen_random_uuid(),
  couple_id  uuid not null references public.couples(id) on delete cascade default public.my_couple(),
  from_user  uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  kind       text not null default 'text' check (kind in ('text','tease','wish')),
  body       text check (char_length(body) <= 600),
  item_key   text check (item_key ~ '^(pos|pre|toy|bdsm|w):[a-z0-9_-]+$'),
  edited     boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists couple_messages_couple on public.couple_messages(couple_id, created_at);
alter table public.couple_messages enable row level security;
drop policy if exists "conversa: ler" on public.couple_messages;
create policy "conversa: ler" on public.couple_messages for select using (couple_id = public.my_couple());
drop policy if exists "conversa: mandar" on public.couple_messages;
create policy "conversa: mandar" on public.couple_messages for insert with check (couple_id = public.my_couple() and from_user = auth.uid());
drop policy if exists "conversa: editar a minha" on public.couple_messages;
create policy "conversa: editar a minha" on public.couple_messages for update using (from_user = auth.uid()) with check (from_user = auth.uid() and couple_id = public.my_couple());

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'couple_messages') then
    alter publication supabase_realtime add table public.couple_messages;
  end if;
end $$;

-- apaga sozinho depois de 24 horas (a cada 15 minutos)
do $$ begin
  perform cron.unschedule('apagar-conversa-24h') where exists (select 1 from cron.job where jobname = 'apagar-conversa-24h');
  perform cron.schedule('apagar-conversa-24h', '*/15 * * * *', $c$ delete from public.couple_messages where created_at < now() - interval '24 hours' $c$);
end $$;

-- ---------- datas que faltavam pra saber "quando" o par fez algo ----------
alter table public.love_messages  add column if not exists replied_at timestamptz;
alter table public.challenge_days add column if not exists sent_at    timestamptz;

create or replace function public.stamp_love_reply() returns trigger language plpgsql set search_path = public as $$
begin if new.reply is distinct from old.reply and coalesce(new.reply,'') <> '' then new.replied_at := now(); end if; return new; end $$;
drop trigger if exists trg_stamp_love_reply on public.love_messages;
create trigger trg_stamp_love_reply before update on public.love_messages for each row execute function public.stamp_love_reply();

create or replace function public.stamp_day_sent() returns trigger language plpgsql set search_path = public as $$
begin if new.sent and (tg_op = 'INSERT' or not coalesce(old.sent,false) or new.items is distinct from old.items) then new.sent_at := now(); end if; return new; end $$;
drop trigger if exists trg_stamp_day_sent on public.challenge_days;
create trigger trg_stamp_day_sent before insert or update on public.challenge_days for each row execute function public.stamp_day_sent();

create or replace function public.stamp_limits() returns trigger language plpgsql set search_path = public as $$
begin new.submitted_at := now(); return new; end $$;
drop trigger if exists trg_stamp_limits on public.bdsm_limits;
create trigger trg_stamp_limits before update on public.bdsm_limits for each row execute function public.stamp_limits();

-- ---------- o que eu já vi (vale em qualquer celular) ----------
create table if not exists public.news_seen (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  area    text not null,
  seen_at timestamptz not null default now(),
  primary key (user_id, area)
);
alter table public.news_seen enable row level security;
drop policy if exists "vistos: só eu" on public.news_seen;
create policy "vistos: só eu" on public.news_seen for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.mark_seen(p_area text) returns void
language sql security definer set search_path = public as $$
  insert into news_seen(user_id, area, seen_at) values (auth.uid(), p_area, now())
  on conflict (user_id, area) do update set seen_at = now() $$;

-- ---------- tudo que o par fez e eu ainda não vi (últimos 7 dias) ----------
create or replace function public.my_news()
returns table (area text, kind text, ref text, at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); c uuid := public.my_couple(); p uuid;
begin
  if me is null then return; end if;
  -- convites de jogo: salas que o par abriu nas últimas 24h e eu ainda não entrei
  return query
    select 'games'::text, 'game_inv'::text, r.code::text, r.created_at from game_rooms r
     where r.created_by in (select partner_id from couples where id = c union select owner_id from couples where id = c) and r.created_by <> me
       and r.created_at > now() - interval '24 hours'
       and not exists (select 1 from game_members m where m.room_id = r.id and m.user_id = me)
       and r.created_at > coalesce((select seen_at from news_seen s where s.user_id = me and s.area = 'games'), '-infinity');
  if c is null then return; end if;
  select case when owner_id = me then partner_id else owner_id end into p from couples where id = c;
  if p is null then return; end if;
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
  )
  select ev.area, ev.kind, ev.ref, ev.at from ev left join seen on seen.a = ev.area
   where ev.at > now() - interval '7 days' and ev.at > coalesce(seen.t, '-infinity')
   order by ev.at desc limit 50;
end $$;

do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and p.proname in ('my_news','mark_seen') loop
    execute format('revoke execute on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end $$;
