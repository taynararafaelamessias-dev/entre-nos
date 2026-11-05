#!/bin/sh
# Backup base para o bucket e poda dos antigos (mantém BACKUP_RETAIN_FULL completos).
set -eu
gosu postgres wal-g backup-push "$PGDATA"
gosu postgres wal-g delete retain FULL "${BACKUP_RETAIN_FULL:-14}" --confirm
