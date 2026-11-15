#!/bin/sh
# Roda um job do serviço `backup` (backup-push, restore-check) com o ambiente do container
# e manda a saída e o resultado para o log do container (stdout do PID 1):
#   <UTC ISO> job <nome> OK   |   <UTC ISO> job <nome> FALHOU (<código>)
# Sai com o código do job.
# busybox ash tem pipefail.
# shellcheck disable=SC3040
set -eu -o pipefail
[ "$#" -eq 1 ] || { echo "uso: run-job.sh <job>" >&2; exit 2; }
job=$1
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH
# shellcheck disable=SC1091
. /run/backup.env

log=/proc/1/fd/1
# Pelo crond o stdout já é o log do container: sem o tee extra, cada linha sairia duas vezes.
if [ "$(readlink "/proc/$$/fd/1")" = "$(readlink /proc/1/fd/1)" ]; then
  log=/dev/null
fi
set +e
"/usr/local/bin/$job.sh" 2>&1 | tee -a "$log"
rc=$?
set -e
if [ "$rc" -eq 0 ]; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) job $job OK" | tee -a "$log"
else
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) job $job FALHOU ($rc)" | tee -a "$log"
fi
exit "$rc"
