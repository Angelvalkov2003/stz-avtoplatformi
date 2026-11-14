# СТЗ Автоплатформи

Наем на автомобилни платформи — Next.js + Supabase + Resend.

## Локално пускане

1. `npm install`
2. Копирай `.env.example` → `.env.local` и попълни ключовете.
3. Пусни миграцията (виж по-долу).
4. `npm run dev`

## Миграция (Supabase)

1. Отвори Supabase → SQL Editor върху **празна** база.
2. Изпълни целия файл `supabase/migrations/0001_init.sql`.
3. Не добавяй нови миграции — редактирай само този файл.

## Env променливи

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — само сървър
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `ADMIN_NOTIFY_EMAIL`
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Деплой на Vercel

1. Import на GitHub репото.
2. Добави същите env променливи.
3. Deploy. След това пусни миграцията в Supabase, ако още не е.

Админ: `/admin/login`. Опционални GLB модели: `public/models/{slug}.glb`.
