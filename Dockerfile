FROM node:24-alpine AS base
RUN npm install -g pnpm@12.16.1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/contracts/package.json packages/contracts/
COPY apps/server/package.json apps/server/
COPY packages/i18n/package.json packages/i18n/
COPY apps/mobile/package.json apps/mobile/

FROM base AS runtime
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod --filter @entre-nos/server...
COPY packages/contracts packages/contracts
COPY apps/server apps/server
USER node
EXPOSE 3000
CMD ["node", "apps/server/src/index.ts"]
