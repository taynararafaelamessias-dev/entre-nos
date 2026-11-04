FROM node:24-alpine AS base
RUN npm install -g pnpm@12.16.1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY tsconfig.base.json ./
COPY packages/contracts packages/contracts
COPY apps/web apps/web
RUN pnpm --filter @entre-nos/web build

FROM base AS runtime
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod --filter @entre-nos/server...
COPY packages/contracts packages/contracts
COPY apps/server apps/server
COPY --from=build /app/apps/web/dist apps/web/dist
USER node
EXPOSE 3000
CMD ["node", "apps/server/src/index.ts"]
