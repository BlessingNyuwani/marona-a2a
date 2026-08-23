FROM node:22-alpine AS builder

WORKDIR /build
RUN corepack enable
COPY examples/typescript/package.json examples/typescript/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY examples/typescript/tsconfig.json ./
COPY examples/typescript/src ./src
RUN pnpm run build && pnpm prune --prod

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node:node /build/package.json ./
COPY --from=builder --chown=node:node /build/node_modules ./node_modules
COPY --from=builder --chown=node:node /build/dist ./dist
USER node
EXPOSE 8100
ENTRYPOINT ["node", "dist/server.js"]

