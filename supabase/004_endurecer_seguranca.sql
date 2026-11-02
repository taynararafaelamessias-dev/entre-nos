-- Entre Nós · parte 4: só quem está logado chama as funções (menos as telas de convite)
do $$ declare f record; begin
  for f in select p.oid::regprocedure as sig, p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
           where n.nspname='public' and p.prosecdef loop
    execute format('revoke execute on function %s from public, anon', f.sig);
    if f.proname in ('invite_info','room_info') then
      execute format('grant execute on function %s to anon, authenticated', f.sig);
    else
      execute format('grant execute on function %s to authenticated', f.sig);
    end if;
  end loop;
end $$;
alter function public.check_text(text) set search_path = public;
alter function public.guard_challenge_day() set search_path = public;
