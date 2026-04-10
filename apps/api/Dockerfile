FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /repo

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

ENV API_PORT=4000
EXPOSE 4000

CMD ["pnpm", "--filter", "api", "run", "dev"]
