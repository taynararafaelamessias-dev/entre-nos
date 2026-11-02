-- Entre Nós · parte 6: cada jogo grátis tem no máximo 20 jogadas (somando os dois). Depois, só assinando.
create or replace function public.free_room_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.kind in ('msg','tod','tdone','plan','tease')
     and (select free from game_rooms where id = new.room_id)
     and (select count(*) from game_events where room_id = new.room_id and kind in ('msg','tod','tdone','plan','tease')) >= 20
  then raise exception 'limite do jogo grátis'; end if;
  return new;
end $$;
drop trigger if exists trg_free_room_limit on public.game_events;
create trigger trg_free_room_limit before insert on public.game_events for each row execute function public.free_room_limit();
revoke execute on function public.free_room_limit() from public, anon, authenticated;
