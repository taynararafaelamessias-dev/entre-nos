#!/usr/bin/env bash
# Prova da rotina agendada (ADR 0003): o serviço `backup` roda crond com o backup diário e o
# teste de restauração semanal, e um job rodado como o cron roda sai 0 e deixa `OK` no log.
set -euo pipefail
cd "$(dirname "$0")/../.."

docker compose --profile local-s3 up -d --wait s3-local
docker compose --profile local-s3 run --rm s3-init
docker compose up -d --build --wait db backup

fail() { echo "verify-schedule: $*" >&2; exit 1; }

docker compose exec -T backup pgrep crond >/dev/null || fail "crond não está rodando no backup"

tab=$(docker compose exec -T backup crontab -l)
grep -qF '0 3 * * * /usr/local/bin/run-job.sh backup-push' <<<"$tab" ||
  fail "crontab sem o backup diário"
grep -qF '30 4 * * 0 /usr/local/bin/run-job.sh restore-check' <<<"$tab" ||
  fail "crontab sem o teste de restauração semanal"

since=$(date -u +%Y-%m-%dT%H:%M:%SZ)
out=$(docker compose exec -T backup run-job.sh restore-check) ||
  fail "run-job.sh restore-check saiu com erro: $(tail -n 20 <<<"$out")"
grep -q 'job restore-check OK' <<<"$out" || fail "saída sem 'job restore-check OK'"
docker compose logs --no-log-prefix --since "$since" backup | grep -q 'job restore-check OK' ||
  fail "'job restore-check OK' não chegou aos logs do backup"

echo "VERIFY SCHEDULE OK"
