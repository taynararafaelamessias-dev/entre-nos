#!/usr/bin/env bash
# Prova da restauração no tempo (ADR 0003): uma linha existe no instante T, é apagada depois,
# e a restauração com --target-time T a traz de volta (contagem 1) enquanto a origem tem 0.
# Um backup base feito depois do delete prova que a restauração escolhe o último base anterior
# a T. Um recovery_target_time inerte no postgresql.auto.conf da origem (vai junto em todo base)
# prova que restore.sh descarta alvos antigos: o restore-check no fim usa --target-name.
set -euo pipefail
cd "$(dirname "$0")/../.."

docker compose --profile local-s3 up -d --wait s3-local
docker compose --profile local-s3 run --rm s3-init
docker compose up -d --build --wait db backup

psql_db() {
  docker compose exec -T db psql -U entre_nos -d entre_nos -v ON_ERROR_STOP=1 -tA "$@"
}

reset_probe() {
  psql_db -c "alter system reset recovery_target_time" -c "select pg_reload_conf()" >/dev/null || true
}
trap reset_probe EXIT
# Num primário, recovery_target_* não fazem nada; aqui só entram no auto.conf e nos backups base.
psql_db -c "alter system set recovery_target_time = '2000-01-01 00:00:00+00'" -c "select pg_reload_conf()" >/dev/null

psql_db -c "create schema if not exists backup_probe" \
  -c "create table if not exists backup_probe.linhas (id bigserial primary key, nota text not null, em timestamptz not null default now())"

marker="pitr-$(date +%s)-$RANDOM"
psql_db -c "insert into backup_probe.linhas (nota) values ('$marker')"
docker compose exec -T backup backup-push.sh

sleep 2
T=$(psql_db -c "select to_char(now() at time zone 'utc', 'YYYY-MM-DD HH24:MI:SS.US') || '+00'")
sleep 2

psql_db -c "delete from backup_probe.linhas where nota = '$marker'"
source_count=$(psql_db -c "select count(*) from backup_probe.linhas where nota = '$marker'")
if [ "$source_count" != "0" ]; then
  echo "VERIFY PITR FALHOU: a origem ainda tem $source_count linha(s) de $marker depois do delete" >&2
  exit 1
fi
# Base depois de T: restaurar a partir dele devolveria o banco já sem a linha.
docker compose exec -T backup backup-push.sh
# O WAL com o delete precisa estar no bucket para o replay passar de T e parar nele.
docker compose exec -T backup wait-archived.sh

got=$(docker compose run --rm -T backup restore.sh --target-time "$T" -- \
  psql -tA -c "select count(*) from backup_probe.linhas where nota = '$marker'")
if [ "$got" != "1" ]; then
  echo "VERIFY PITR FALHOU: esperava 1 linha de $marker em T=$T, a restauração devolveu '$got'" >&2
  exit 1
fi
# Restauração por nome partindo de um base que carrega um recovery_target_time antigo.
docker compose run --rm -T backup restore-check.sh
echo "VERIFY PITR OK"
