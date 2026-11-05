# Postgres com WAL-G (ADR 0003) e o serviço `backup`. Build: contexto = raiz do repo.

# WAL-G v3.0.9: os binários oficiais são só glibc; compilamos para Alpine.
FROM golang:1.27.3-alpine3.24 AS walg
RUN apk add --no-cache git
RUN git clone --depth 1 --branch v3.0.9 https://github.com/wal-g/wal-g.git /src
RUN cd /src && CGO_ENABLED=0 go build -mod=mod -o /out/wal-g ./main/pg

# Dependências de produção do servidor (espelha o Dockerfile do app) para o restore-check.
FROM node:24.22.1-alpine3.24 AS deps
RUN npm install -g pnpm@12.16.1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod --filter @entre-nos/server...
COPY packages/contracts packages/contracts
COPY apps/server apps/server

# Banco: arquiva cada segmento de WAL no bucket.
FROM postgres:18-alpine3.24 AS db
COPY --from=walg /out/wal-g /usr/local/bin/wal-g
CMD ["postgres", "-c", "archive_mode=on", "-c", "archive_command=wal-g wal-push %p", "-c", "archive_timeout=60"]

# Rotinas de backup e restauração, com o dono do banco (o app nunca vê estas credenciais).
FROM db AS backup
RUN apk add --no-cache libstdc++
COPY --from=deps /usr/local/bin/node /usr/local/bin/node
COPY --from=deps /app /app
COPY --chmod=755 docker/postgres/bin/ /usr/local/bin/
CMD ["sleep", "infinity"]
