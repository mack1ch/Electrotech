FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /repo

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3001

CMD ["pnpm", "--filter", "supplier", "exec", "next", "dev", "-H", "0.0.0.0", "-p", "3001"]
