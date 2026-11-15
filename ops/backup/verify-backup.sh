#!/usr/bin/env bash
# Prova ponta a ponta do backup (ADR 0003): backup base + WAL no bucket, restauração num
# Postgres limpo (container novo, diretório vazio) e checagem de contagens, políticas e papel.
set -euo pipefail
cd "$(dirname "$0")/../.."

docker compose --profile local-s3 up -d --wait s3-local
docker compose --profile local-s3 run --rm s3-init
docker compose up -d --build --wait db backup

psql_db() {
  docker compose exec -T db psql -U entre_nos -d entre_nos -v ON_ERROR_STOP=1 -tA "$@"
}

psql_db -c "create schema if not exists backup_probe" \
  -c "create table if not exists backup_probe.linhas (id bigserial primary key, nota text not null, em timestamptz not null default now())"
psql_db -c "insert into backup_probe.linhas (nota) select 'antes-' || g from generate_series(1, 50) g"
docker compose exec -T backup backup-push.sh
# Estas só voltam pelo replay do WAL arquivado depois do backup base.
psql_db -c "insert into backup_probe.linhas (nota) select 'depois-' || g from generate_series(1, 10) g"

docker compose run --rm -T backup restore-check.sh
echo "VERIFY BACKUP OK"
