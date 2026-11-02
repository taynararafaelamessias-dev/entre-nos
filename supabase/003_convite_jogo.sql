-- =====================================================================
-- Entre Nós · banco de dados (parte 3: convite de jogo pelo link)
-- Rode DEPOIS das partes 1 e 2.
-- =====================================================================

-- Quem abre o link (ainda sem conta) vê só: quem chamou, qual jogo e se ainda dá pra entrar.
create or replace function public.room_info(p_code text)
returns table (room_id uuid, game text, host text, host_gender text, members int, expired boolean)
language sql stable security definer set search_path = public as $$
  select r.id, r.game, p.nickname, p.gender,
         (select count(*)::int from game_members m where m.room_id = r.id),
         r.created_at < now() - interval '24 hours'
  from game_rooms r join profiles p on p.id = r.created_by
  where r.code = upper(trim(p_code)) $$;
grant execute on function public.room_info(text) to anon, authenticated;

-- Dentro da sala, cada um vê o apelido do outro (e só isso).
create or replace function public.room_people(p_room uuid)
returns table (user_id uuid, nickname text)
language sql stable security definer set search_path = public as $$
  select m.user_id, p.nickname from game_members m join profiles p on p.id = m.user_id
  where m.room_id = p_room and public.in_room(p_room) $$;

-- Tempo real também pra quando a outra pessoa entra na sala.
do $$ begin
  alter publication supabase_realtime add table public.game_members;
exception when duplicate_object then null; end $$;
