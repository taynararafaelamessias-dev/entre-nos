#!/bin/sh
# Processo principal do serviço `backup`: crond com as rotinas de docker/postgres/crontab.
# O crond não repassa o ambiente do container aos jobs, então ele vai para /run/backup.env
# (só root lê; nunca é impresso). Sem nenhum backup base no bucket, faz o primeiro já.
set -eu
umask 077

export -p | grep -E '^export (PG|WALG_|AWS_|APP_DB_PASSWORD|BACKUP_)' >/run/backup.env

if ! gosu postgres wal-g backup-list 2>/dev/null | grep -q 'base_'; then
  echo "backup-entrypoint: nenhum backup base no bucket; rodando backup-push agora"
  run-job.sh backup-push &
fi

# Não damos exec no crond: como PID 1 ele ignoraria o SIGINT do `docker compose stop` (o
# sinal de parada da imagem postgres) e levaria SIGKILL. O sh fica de PID 1 e repassa.
crond -f -d 8 &
crond_pid=$!
stopping=''
trap 'stopping=1; echo "backup-entrypoint: parando o crond"; kill -TERM "$crond_pid" 2>/dev/null || true' INT TERM
rc=0
while kill -0 "$crond_pid" 2>/dev/null; do
  wait "$crond_pid" || rc=$?
done
[ -z "$stopping" ] || exit 0
echo "backup-entrypoint: crond saiu sozinho ($rc)" >&2
exit "$rc"
