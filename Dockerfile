FROM node:20-alpine AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS devdeps
COPY ./prisma ./prisma
COPY ./package.json ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM devdeps AS build
COPY . .
RUN pnpm build

FROM base AS deps
COPY ./prisma ./prisma
COPY ./package.json ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --production

FROM deps AS deploy
COPY --from=build /app/.output ./

CMD node ./server/index.mjs
