#!/bin/sh
# Fecha o segmento de WAL atual e espera o db arquivá-lo no bucket (≤ 120 s).
set -eu
# Um commit antes: sem WAL novo desde a última troca (ex.: logo após backup-push),
# pg_switch_wal() não troca e devolveria o segmento ainda aberto.
psql -h db -tAc "select pg_current_xact_id()" >/dev/null
seg=$(psql -h db -tAc "select pg_walfile_name(pg_switch_wal())")
echo "wait-archived: esperando o segmento $seg" >&2
i=0
while [ "$i" -lt 120 ]; do
  ok=$(psql -h db -tAc "select coalesce(last_archived_wal >= '$seg', false) from pg_stat_archiver")
  if [ "$ok" = "t" ]; then
    echo "wait-archived: $seg arquivado" >&2
    exit 0
  fi
  i=$((i + 1))
  sleep 1
done
echo "wait-archived: $seg não foi arquivado em 120 s" >&2
exit 1
