# Электротехника (electrotech)

Монорепозиторий для продукта **Электротехника**: публичный лендинг и сервис, отдельное приложение для поставщиков/администрирования и HTTP API. На текущем этапе репозиторий содержит только инженерный каркас без продуктовой бизнес-логики.

## Состав репозитория

| Путь                | Назначение                                    |
| ------------------- | --------------------------------------------- |
| `apps/web`          | Публичный фронтенд (Next.js, App Router)      |
| `apps/supplier`     | Зона поставщика/админки (Next.js, App Router) |
| `apps/api`          | HTTP API (NestJS), только health/readiness    |
| `packages/ui`       | Минимальный общий UI (`cn`, `Button`)         |
| `packages/utils`    | Общие утилиты без предметной области          |
| `packages/config-*` | Общие настройки TypeScript, ESLint, Tailwind  |
| `docs/`             | Контекст продукта, архитектура, правила, ADR  |

Подробнее: [docs/architecture.md](docs/architecture.md), [AGENTS.md](AGENTS.md).

## Требования

- **Node.js** 20.19+ (в [.nvmrc](.nvmrc) зафиксирована рекомендуемая **22** для `nvm use`)
- **pnpm** 9 (включается через [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`)
- **Docker Desktop** (или иной Docker) для `docker compose`

## Установка зависимостей

```bash
corepack enable
pnpm install
```

## Режим разработки

Перед первым запуском API с каталогом: скопируйте [apps/api/.env.example](apps/api/.env.example) в `apps/api/.env` и при необходимости поправьте `DATABASE_URL`. В примере уже включены удобные значения для локальной работы (`WEB_ORIGINS` для web и supplier, `CATALOG_FORCE_SEED=true` для стабильных мок-данных в БД).

Для **web** и **supplier** в репозитории лежат `apps/web/.env.development` и `apps/supplier/.env.development` (`NEXT_PUBLIC_API_URL`, отключение телеметрии Next.js). В `next dev` каталог на web по умолчанию отдаётся **встроенным моком**; реальный Nest нужен, если задать `NEXT_PUBLIC_USE_REAL_API=1` в `apps/web/.env.local`. Если API в dev недоступен, web подставит тот же мок (fallback), пока не установлен `NEXT_PUBLIC_DEV_API_NO_FALLBACK=1`.

### Команды запуска

| Сценарий | Команды |
| -------- | ------- |
| **Только публичный фронт** (порт 3000, данные каталога из мока, Postgres не нужен) | `pnpm install` → `pnpm dev:web` |
| **Фронт + API + Postgres/Redis** (инфра в Docker, приложения на хосте) | Терминал 1: `pnpm dev:db` → Терминал 2: один раз `cp apps/api/.env.example apps/api/.env` → `pnpm dev:api` → Терминал 3: `pnpm dev:web` (при необходимости ещё `pnpm dev:supplier`) |
| **Все приложения сразу** (web, supplier, api; нужен `apps/api/.env` и поднятая БД) | `pnpm dev:db` → `pnpm dev:apps` |
| **Всё в Docker** (сборка образов) | Скопируйте [.env.example](.env.example) в `.env` при необходимости → `docker compose up --build` |

Полезные сокращения из корня:

- `pnpm dev` — как и раньше, все workspace-пакеты с задачей `dev` (web, supplier, api, пакеты с dev-скриптом).
- `pnpm dev:db` — только `postgres` и `redis` в фоне (`docker compose up -d postgres redis`).

Точки входа:

- Web: [http://localhost:3000](http://localhost:3000) (Next.js с **Turbopack**)
- Supplier: [http://localhost:3001](http://localhost:3001)
- API: [http://localhost:4000/health](http://localhost:4000/health)

Требования: **Node.js** 20.19+ (рекомендуется 22 из [.nvmrc](.nvmrc)), **pnpm** 9, для вариантов с API — **Docker** для Postgres/Redis или своя установка PostgreSQL.

## Docker: один командный запуск

Из корня репозитория (рядом с `docker-compose.yml` можно положить `.env` на основе [.env.example](.env.example)):

```bash
docker compose up --build
```

Сервисы:

| Сервис     | Порт (хост) | Описание      |
| ---------- | ----------- | ------------- |
| `web`      | 3000        | Next.js dev   |
| `supplier` | 3001        | Next.js dev   |
| `api`      | 4000        | NestJS dev    |
| `postgres` | 5432        | PostgreSQL 16 |
| `redis`    | 6379        | Redis 7       |

Каждое приложение собирается своим `Dockerfile` в `apps/<app>/`; контекст сборки — корень монорепозитория, чтобы `pnpm` видел все workspace-пакеты.

Переменные окружения задаются в `docker-compose.yml` и/или в `.env`. Пример имён переменных — в [.env.example](.env.example).

### Демо на VPS (production-сборка, нестандартные порты)

Файл [docker-compose.vps.yml](docker-compose.vps.yml): **web** на хосте **`18080`**, **API** на **`18081`** (меняется через `VPS_WEB_PORT` / `VPS_API_PORT` в `.env`). Postgres и Redis наружу не пробрасываются.

1. Скопируйте [.env.vps.example](.env.vps.example) в **`.env`** в корне, задайте `POSTGRES_PASSWORD`, `NEXT_PUBLIC_API_URL` и `WEB_ORIGINS` с **реальным IP/доменом** (как открывает заказчик в браузере).
2. `docker compose -f docker-compose.vps.yml up -d --build`
3. Сайт: `http://<хост>:18080`. Первый запуск с пустым томом: `TYPEORM_SYNC=true` поднимает схему, затем API заливает **те же демо-данные**, что в локальном моке/сиде. Чтобы при перезапуске снова обнулить каталог: в `.env` выставьте `CATALOG_DEMO_RESEED=true` (только для демо).

`NEXT_PUBLIC_*` вшивается при **сборке** образа `web`; после смены URL API пересоберите: `docker compose -f docker-compose.vps.yml build web --no-cache`.

**Если в логах web «Failed to find Server Action» или в браузере пусто после деплоя:** в `.env` задайте `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (один раз: `openssl rand -base64 32`), пересоберите `web`. В nginx к прокси на `127.0.0.1:18080` добавьте директивы из [deploy/nginx-next-location-snippet.conf](deploy/nginx-next-location-snippet.conf) (в частности `proxy_buffering off`). У пользователей — жёсткое обновление страницы (Ctrl+Shift+R) или режим инкогнито.

Проверка HTML с сервера: `curl -sS https://ваш-домен/ | head -5` — должна быть строка с `<!DOCTYPE` или `<html`.

## Скрипты в корне

| Команда               | Действие                                                        |
| --------------------- | --------------------------------------------------------------- |
| `pnpm dev`            | `turbo dev` — dev-режим всех пакетов с задачей `dev`            |
| `pnpm dev:web`        | только `apps/web`                                               |
| `pnpm dev:supplier`   | только `apps/supplier`                                          |
| `pnpm dev:api`        | только `apps/api`                                               |
| `pnpm dev:apps`       | web + api + supplier параллельно                                |
| `pnpm dev:db`         | Postgres и Redis в Docker (`-d`)                                |
| `pnpm build`          | production-сборка через `turbo build`                           |
| `pnpm lint`           | ESLint во всех workspace-пакетах с задачей `lint`               |
| `pnpm typecheck`      | `tsc --noEmit` (где настроено)                                  |
| `pnpm format`         | Prettier по репозиторию                                         |
| `pnpm format:check`   | проверка форматирования без записи                              |

## Организация монорепозитория

- Менеджер пакетов: **pnpm workspaces**
- Оркестрация задач: **Turborepo** ([turbo.json](turbo.json))
- Импорты внутренних пакетов: `workspace:*` в `package.json` приложений

Добавление нового кода: сначала прочитать [AGENTS.md](AGENTS.md) и релевантные файлы в `docs/`.

## Документация для людей и LLM

- [AGENTS.md](AGENTS.md) — правила работы в репозитории для агентов/моделей
- [docs/llm-playbook.md](docs/llm-playbook.md) — практика итеративной разработки
- [docs/figma-workflow.md](docs/figma-workflow.md) — работа с дизайном через Figma MCP
- [docs/adr/](docs/adr/) — архитектурные решения
