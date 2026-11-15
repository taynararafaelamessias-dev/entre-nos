#!/bin/sh
# Teste de restauração (ADR 0003): marca um ponto de restauração na origem com o snapshot
# das contagens, espera o WAL dele chegar ao bucket, restaura até ele num diretório limpo
# e compara contagens, políticas de RLS e o papel do app (ADR 0005).
set -eu
CLI=/app/apps/server/src/backup/restore-check-cli.ts
name=restore_check_$(date -u +%Y%m%dT%H%M%SZ)
snap=$(mktemp)
trap 'rm -f "$snap"' EXIT

SOURCE_DATABASE_URL="postgres://$PGUSER:$PGPASSWORD@$PGHOST:$PGPORT/$PGDATABASE" \
  node "$CLI" mark "$name" "$snap"
wait-archived.sh
set +e
restore.sh --target-name "$name" -- node "$CLI" verify "$snap"
rc=$?
set -e
exit "$rc"
