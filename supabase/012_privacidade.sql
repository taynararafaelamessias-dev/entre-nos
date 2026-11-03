-- =====================================================================
-- Entre Nós · parte 12: privacidade
-- 1) quem não está logado não enxerga nenhuma tabela (nem os nomes)
-- 2) funções internas não podem ser chamadas direto
-- 3) "Apagar minha conta": apaga tudo da pessoa (GDPR / LGPD)
-- Cole tudo no SQL Editor do Supabase e toque em Run.
-- =====================================================================

-- 1) fecha tudo pra quem não está logado (as travas por linha continuam valendo pra quem está)
revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables    from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke execute on functions from anon;
-- só o que precisa funcionar antes do login: abrir link de convite e link de jogo
grant execute on function public.invite_info(text) to anon;
grant execute on function public.room_info(text)   to anon;

-- 2) funções internas: só o próprio banco usa
alter function public.ch_today() set search_path = public;
revoke execute on function public.ch_refresh(uuid)           from public, anon, authenticated;
revoke execute on function public.couple_points(timestamptz) from public, anon, authenticated;

-- 3) apagar a minha conta e tudo que é meu
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
declare me uuid := auth.uid(); c record;
begin
  if me is null then raise exception 'entre primeiro'; end if;
  -- se eu assinei: o casal acaba, e o meu par fica com uma conta sem casal (pode entrar em outro casal)
  for c in select * from couples where owner_id = me loop
    update profiles set couple_id = null, role = null where couple_id = c.id and id <> me;
  end loop;
  -- se eu sou o par: saio do casal e quem assinou recebe um convite novo pra chamar outra pessoa
  update couples set partner_id = null,
         invite_code = upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))
   where partner_id = me;
  update profiles set couple_id = null where id = me;
  update admin_invites set created_by = null where created_by = me;
  update admin_invites set used_by = null where used_by = me;
  -- apaga a conta: o resto (perfil, desejos, diário, mensagens, desafios, jogos, perguntas) vai junto
  delete from couples where owner_id = me;
  delete from auth.users where id = me;
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
