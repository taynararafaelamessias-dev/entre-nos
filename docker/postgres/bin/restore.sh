#!/bin/sh
# Restaura o último backup base + WAL do bucket num diretório limpo (ADR 0003).
#   restore.sh [--target-time T | --target-name N] [--into DIR] [-- cmd ...]
# Sem --into: sobe um Postgres descartável na porta 5445, com archive_mode=off (uma
# restauração de teste nunca empurra uma timeline nova para o bucket), roda cmd (ou espera
# SIGTERM/SIGINT) e apaga tudo ao sair. Com --into: só prepara DIR para o db subir nele.
# Logs próprios vão para stderr; stdout é só do cmd.
set -eu

PORT=5445
log() { echo "restore: $*" >&2; }
die() { log "$*"; exit 1; }

target_time=''
target_name=''
into=''
while [ "$#" -gt 0 ]; do
  case "$1" in
    --target-time) [ "$#" -ge 2 ] || die "--target-time precisa de um valor"; target_time=$2; shift 2 ;;
    --target-name) [ "$#" -ge 2 ] || die "--target-name precisa de um valor"; target_name=$2; shift 2 ;;
    --into) [ "$#" -ge 2 ] || die "--into precisa de um diretório"; into=$2; shift 2 ;;
    --) shift; break ;;
    *) die "argumento desconhecido: $1 (uso: restore.sh [--target-time T | --target-name N] [--into DIR] [-- cmd ...])" ;;
  esac
done
[ -z "$target_time" ] || [ -z "$target_name" ] || die "use --target-time ou --target-name, não os dois"

if ! gosu postgres wal-g backup-list 2>/dev/null | grep -q 'base_'; then
  die "nenhum backup base; rode backup-push.sh"
fi

started=''
DIR=''
sleeper=''
cleanup() {
  rc=$?
  [ -z "$sleeper" ] || kill "$sleeper" 2>/dev/null || true
  if [ -n "$started" ]; then
    log "parando o servidor restaurado"
    gosu postgres pg_ctl -D "$DIR" -m fast -w stop >/dev/null 2>&1 || true
  fi
  if [ -z "$into" ] && [ -n "$DIR" ]; then
    rm -rf "$DIR"
  fi
  exit "$rc"
}

if [ -n "$into" ]; then
  [ ! -e "$into/PG_VERSION" ] || die "$into já tem um cluster (PG_VERSION); recuso sobrescrever"
  mkdir -p "$into"
  DIR=$into
else
  DIR=$(mktemp -d /tmp/restore.XXXXXX)
  trap cleanup EXIT
  trap 'exit 143' TERM
  trap 'exit 130' INT
fi
chown postgres:postgres "$DIR"
chmod 700 "$DIR"

log "baixando o último backup base para $DIR"
gosu postgres wal-g backup-fetch "$DIR" LATEST
gosu postgres touch "$DIR/recovery.signal"
{
  echo ""
  echo "# restore.sh $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "restore_command = 'wal-g wal-fetch %f %p'"
  echo "recovery_target_timeline = 'latest'"
  echo "recovery_target_action = 'promote'"
  [ -z "$target_time" ] || echo "recovery_target_time = '$target_time'"
  [ -z "$target_name" ] || echo "recovery_target_name = '$target_name'"
} >>"$DIR/postgresql.auto.conf"

if [ -n "$into" ]; then
  log "pronto em $into. Próximos passos: suba o db (docker compose up -d db), espere a"
  log "promoção (select pg_is_in_recovery() = f) e rode o migrate (docker compose run --rm migrate)."
  exit 0
fi

log "subindo o Postgres restaurado na porta $PORT (archive_mode=off)"
started=1
gosu postgres pg_ctl -D "$DIR" -w -t 600 -l "$DIR/restore.log" \
  -o "-c port=$PORT -c listen_addresses='*' -c archive_mode=off -c unix_socket_directories=$DIR" start >&2 \
  || { tail -n 40 "$DIR/restore.log" >&2 || true; die "o servidor restaurado não subiu"; }

i=0
while :; do
  rec=$(psql -h "$DIR" -p "$PORT" -U entre_nos -d entre_nos -tAc 'select pg_is_in_recovery()' 2>/dev/null || true)
  [ "$rec" = "f" ] && break
  i=$((i + 1))
  if [ "$i" -ge 600 ]; then
    tail -n 40 "$DIR/restore.log" >&2 || true
    die "não saiu da recuperação em 600 s"
  fi
  sleep 1
done
log "recuperação concluída e promovido"

# Senha do dono pelo socket, sem passá-la em argv (\getenv lê do ambiente).
# shellcheck disable=SC2016
printf '%s\n' '\getenv pw PGPASSWORD' "alter role entre_nos password :'pw';" |
  psql -h "$DIR" -p "$PORT" -U entre_nos -d entre_nos -v ON_ERROR_STOP=1 -q >/dev/null

export PGHOST=127.0.0.1 PGPORT=$PORT
export RESTORED_DATABASE_URL="postgres://entre_nos:$PGPASSWORD@127.0.0.1:$PORT/entre_nos"

if [ "$#" -gt 0 ]; then
  set +e
  "$@"
  rc=$?
  set -e
  exit "$rc"
fi

log "restaurado; servindo na porta $PORT"
sleep 2147483647 &
sleeper=$!
wait "$sleeper" || true
