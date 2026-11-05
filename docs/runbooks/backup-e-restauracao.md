# Backup e restauração do Postgres

Para quem precisa recuperar os dados do Entre Nós sem ajuda. Decisões: ADR 0003 (backup contínuo
fora de casa, teste semanal) e ADR 0005 (o app nunca vê credenciais do dono nem do bucket).

## O que roda e quando

| O quê | Onde | Quando (UTC) |
|---|---|---|
| Arquivamento contínuo do WAL (cada transação vai para o bucket em até 60 s) | serviço `db` (`archive_command = wal-g wal-push`) | sempre |
| Backup base completo + limpeza dos antigos | serviço `backup`, `backup-push.sh` | todo dia às 03:00 |
| Teste de restauração: restaura num Postgres limpo e confere contagens, políticas de RLS e o papel `entre_nos_app` | serviço `backup`, `restore-check.sh` | domingo às 04:30 |

- Retenção: os últimos `BACKUP_RETAIN_FULL` backups base (padrão 14) e todo o WAL desde o mais antigo.
  Dá para voltar a qualquer instante dentro dessa janela: `restore.sh --target-time T` parte do último
  backup base terminado antes de T e reaplica o WAL até T (o log diz qual base usou). Antes do mais
  antigo, falha com `nenhum backup base anterior a T`.
- Se o bucket está vazio quando o serviço `backup` sobe, ele já faz o primeiro backup base.
- Sem as variáveis do bucket no `.env`, nem o `db` sobe: não existe banco sem backup.

### Ler o resultado das rotinas

```sh
docker compose logs backup | grep ' job '
# 2026-11-09T04:31:12Z job restore-check OK
# 2026-11-09T04:31:12Z job restore-check FALHOU (1)   ← investigue as linhas logo acima
```

Rodar qualquer rotina agora, sem esperar o horário:

```sh
docker compose exec -T backup run-job.sh backup-push
docker compose exec -T backup run-job.sh restore-check
docker compose exec -T backup gosu postgres wal-g backup-list   # backups base no bucket
```

## Configuração (`.env`)

Só os nomes; os valores ficam no `.env` da máquina e no gerenciador de senhas de quem opera o servidor.

| Variável | O que é |
|---|---|
| `BACKUP_S3_ENDPOINT` | URL S3 do provedor. R2: `https://<account_id>.r2.cloudflarestorage.com`. B2: `https://s3.<region>.backblazeb2.com`. Local: `http://s3-local:9000` |
| `BACKUP_S3_BUCKET` | nome do bucket (crie antes, privado) |
| `BACKUP_S3_PATH` | pasta dentro do bucket (padrão `entre-nos`) |
| `BACKUP_S3_REGION` | R2: `auto`. B2: a região do endpoint. Local: `us-east-1` |
| `BACKUP_S3_FORCE_PATH_STYLE` | `true` (funciona nos três) |
| `BACKUP_S3_ACCESS_KEY_ID`, `BACKUP_S3_SECRET_ACCESS_KEY` | chave do bucket com leitura e escrita só nesse bucket |
| `BACKUP_RETAIN_FULL` | quantos backups base manter |
| `POSTGRES_PASSWORD`, `APP_DB_PASSWORD` | as senhas do banco (já existiam) |
| `RESTORE_DB_PORT` | porta local para inspecionar uma restauração (padrão 5445) |

**Guarde uma cópia do `.env` fora do m4mini** (gerenciador de senhas). Sem as chaves do bucket o
backup existe mas ninguém consegue baixá-lo.

Em desenvolvimento, sem bucket real: `docker compose --profile local-s3 up -d --wait s3-local` e
`docker compose --profile local-s3 run --rm s3-init` sobem um S3 local (RustFS) e criam o bucket.

## Atenção antes de restaurar

- Um Postgres restaurado que **sobe com arquivamento ligado** e é promovido grava uma timeline nova no
  bucket. Num desastre real é isso que se quer (a máquina nova vira a principal e continua o backup).
  Num ensaio, não: ensaie sempre com `archive_mode=off` (veja "Ensaio").
- `restore.sh` sem `--into` já sobe o servidor com `archive_mode=off`: é seguro para testar e inspecionar.
- Nunca restaure por cima do volume `db-data` em uso. `restore.sh --into` recusa um diretório que já tem
  um cluster (`PG_VERSION`).

## (a) Desastre: o m4mini sumiu, máquina nova

1. Instale Docker, clone o repositório e coloque o `.env` guardado (mesmas variáveis).
2. Construa as imagens: `docker compose build db backup`
3. Restaure no volume vazio do `db` (o último instante disponível; para outro, acrescente
   `--target-time '2026-11-09 14:30:00+00'`):
   ```sh
   docker compose run --rm --no-deps backup restore.sh --into /var/lib/postgresql/18/docker
   ```
   Termina com `restore: pronto em /var/lib/postgresql/18/docker. Próximos passos: ...`
4. Suba o banco; ele reaplica o WAL e se promove: `docker compose up -d --wait db`
5. Confirme que saiu da recuperação (`f`):
   ```sh
   docker compose exec -T db psql -U entre_nos -d entre_nos -tAc 'select pg_is_in_recovery()'
   ```
6. Recrie o papel do app (o backup não traz papéis de forma usável) e aplique migrations pendentes:
   `docker compose run --rm migrate`
7. Confira que `entre_nos_app` existe sem bypass de RLS (`f`):
   ```sh
   docker compose exec -T db psql -U entre_nos -d entre_nos -tAc "select rolbypassrls from pg_roles where rolname = 'entre_nos_app'"
   ```
8. Suba o resto: `docker compose up -d` (app, backup).
9. Faça um backup base na timeline nova e teste: `docker compose exec -T backup run-job.sh backup-push`
   e depois `docker compose exec -T backup run-job.sh restore-check`.

## (b) Voltar a um instante nesta máquina (ex.: alguém apagou dados)

1. Descubra o instante (UTC) logo antes do erro. Inspecione primeiro com (c) até achar o instante certo.
2. Pare o app e o backup: `docker compose stop app backup`
3. Pare o banco e guarde o volume atual, sem apagar:
   ```sh
   docker compose stop db
   docker volume create entre-nos-db-antes-$(date -u +%Y%m%d)   # nome com o projeto do compose
   docker run --rm -v <projeto>_db-data:/from -v entre-nos-db-antes-$(date -u +%Y%m%d):/to alpine sh -c 'cp -a /from/. /to/'
   docker compose rm -f db backup && docker volume rm <projeto>_db-data
   ```
   (`<projeto>` é o `COMPOSE_PROJECT_NAME`, ou o nome da pasta; `docker volume ls | grep db-data` mostra.)
4. Siga (a) a partir do passo 3, com `--target-time '<instante>'`.
5. Só apague o volume guardado depois de alguns dias com o app funcionando.

## (c) Só olhar um instante, sem mexer em nada

```sh
docker compose run -d --name inspecao -p 127.0.0.1:${RESTORE_DB_PORT:-5445}:5445 backup \
  restore.sh --target-time '2026-11-09 14:30:00+00'
docker logs -f inspecao          # espere "restore: restaurado; servindo na porta 5445"
psql -h 127.0.0.1 -p "${RESTORE_DB_PORT:-5445}" -U entre_nos -d entre_nos   # senha: POSTGRES_PASSWORD
docker stop inspecao && docker rm inspecao             # para o servidor e apaga a cópia
```

Sem `--target-time`, restaura o último instante disponível. Nada vai para o bucket (`archive_mode=off`).

## Verificações automáticas (desenvolvimento / CI local)

Com o `.env` de desenvolvimento apontando para o S3 local:

| Script | Prova |
|---|---|
| `bash ops/backup/verify-backup.sh` | grava linhas → backup → restaura num Postgres limpo → contagens batem (`VERIFY BACKUP OK`) |
| `bash ops/backup/verify-pitr.sh` | apaga uma linha → restaura para antes → a linha volta (`VERIFY PITR OK`) |
| `bash ops/backup/verify-schedule.sh` | crond rodando com as duas rotinas; o teste de restauração roda sob demanda (`VERIFY SCHEDULE OK`) |

## Ensaio de desastre (a), sem tocar no ambiente real

Num projeto do compose separado, com o arquivamento desligado e uma porta própria:

```sh
cat > /tmp/ensaio.override.yml <<'EOF'
services:
  db:
    command: ["postgres", "-c", "archive_mode=off"]
  migrate:
    image: entre-nos-ensaio-app
EOF
E() { DB_PORT=5446 docker compose -p entre-nos-ensaio -f docker-compose.yml -f /tmp/ensaio.override.yml "$@"; }
E build db backup
E run --rm --no-deps backup restore.sh --into /var/lib/postgresql/18/docker
E up -d --wait db
E run --rm --build migrate
E exec -T db psql -U entre_nos -d entre_nos -tAc 'select pg_is_in_recovery()'   # f
E down -v                      # só o projeto do ensaio
docker rmi entre-nos-ensaio-app
```

Com o S3 local, o ensaio precisa alcançar o bucket pela porta do host:
`BACKUP_S3_ENDPOINT=http://host.docker.internal:${S3_LOCAL_PORT}` antes de `E`.
