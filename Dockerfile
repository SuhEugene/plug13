FROM node:20.15-bookworm-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# For whatever reason it needs to be installed manually
RUN apt-get update -y && apt-get install -y openssl

FROM base AS devdeps
COPY ./prisma ./prisma
COPY ./package.json ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Needs to be installed manually
# https://github.com/radix-vue/shadcn-vue/issues/293
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -D oxc-parser

FROM devdeps AS build
COPY . .
RUN pnpm build

FROM base AS deps
COPY ./prisma ./prisma
COPY ./package.json ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --production

FROM deps AS deploy
COPY --from=build /app/.output ./

CMD ["sh", "-c", "pnpm prisma migrate deploy && node ./server/index.mjs"]
