-- СТЗ Автоплатформи — пълна схема (пуска се веднъж върху празна база)
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'blocked',
  'completed',
  'cancelled'
);

CREATE TYPE booking_source AS ENUM ('web', 'admin');

CREATE TABLE platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text NOT NULL,
  length_m numeric(4,2) NOT NULL,
  width_m numeric(4,2) NOT NULL,
  capacity_kg integer NOT NULL,
  curb_weight_kg integer,
  payload_kg integer,
  description text NOT NULL DEFAULT '',
  suitable_for text[] NOT NULL DEFAULT '{}',
  highlight text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform_prices (
  platform_id uuid NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  days integer NOT NULL CHECK (days > 0),
  total_eur integer NOT NULL CHECK (total_eur >= 0),
  PRIMARY KEY (platform_id, days)
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid NOT NULL REFERENCES platforms(id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  customer_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  cargo text,
  note text,
  estimated_total_eur integer,
  source booking_source NOT NULL DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_date_range CHECK (end_date >= start_date),
  EXCLUDE USING gist (
    platform_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status <> 'cancelled')
);

CREATE INDEX bookings_platform_start_idx ON bookings (platform_id, start_date);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_set_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Права за PostgREST / service_role (RLS остава без публични policies)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE platforms, platform_prices, bookings TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Seed platforms
INSERT INTO platforms (
  id, slug, name, short_name, length_m, width_m, capacity_kg,
  curb_weight_kg, payload_kg, description, suitable_for, highlight, sort_order
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'ravna-5m',
  'Равна платформа 5 м',
  '5 м',
  5.00, 2.10, 3500, 650, 2750,
  'Равна платформа 5.00 × 2.10 м с товароносимост до 3500 кг.',
  ARRAY[
    'автомобили, джипове и бусове',
    'селскостопанска техника и продукция',
    'бали и торове',
    'строителни материали, греди, дъски, сандвич панели',
    'строителна техника',
    'всякакви товари, които се побират в размерите'
  ],
  NULL,
  1
),
(
  '22222222-2222-2222-2222-222222222222',
  'malka-4-5m',
  'Малка платформа 4.5 м',
  '4.5 м',
  4.50, 2.10, 2700, 500, 2200,
  'Компактна платформа 4.50 × 2.10 м с товароносимост 2700 кг.',
  ARRAY[
    'автомобили',
    'малка селскостопанска техника',
    'всякакви стоки и товари в габаритите ѝ'
  ],
  NULL,
  2
),
(
  '33333333-3333-3333-3333-333333333333',
  'dalga-6m',
  'Дълга платформа 6 м',
  '6 м',
  6.00, 2.10, 3500, 870, 2600,
  'Дълга платформа 6.00 × 2.10 м с товароносимост до 3500 кг.',
  ARRAY[
    'автомобили, пикапи, джипове и бусове',
    'строителни материали, греди, дъски, сандвич панели',
    'всякакви товари в размерите ѝ'
  ],
  'Подходяща и за ниски автомобили.',
  3
);

INSERT INTO platform_prices (platform_id, days, total_eur) VALUES
('11111111-1111-1111-1111-111111111111', 1, 16),
('11111111-1111-1111-1111-111111111111', 2, 60),
('11111111-1111-1111-1111-111111111111', 3, 85),
('11111111-1111-1111-1111-111111111111', 4, 110),
('11111111-1111-1111-1111-111111111111', 5, 135),
('11111111-1111-1111-1111-111111111111', 7, 175),
('11111111-1111-1111-1111-111111111111', 10, 240),
('11111111-1111-1111-1111-111111111111', 14, 300),
('11111111-1111-1111-1111-111111111111', 21, 399),
('11111111-1111-1111-1111-111111111111', 30, 510),
('22222222-2222-2222-2222-222222222222', 1, 16),
('22222222-2222-2222-2222-222222222222', 2, 55),
('22222222-2222-2222-2222-222222222222', 3, 80),
('22222222-2222-2222-2222-222222222222', 4, 100),
('22222222-2222-2222-2222-222222222222', 5, 120),
('22222222-2222-2222-2222-222222222222', 7, 160),
('22222222-2222-2222-2222-222222222222', 10, 210),
('22222222-2222-2222-2222-222222222222', 14, 280),
('22222222-2222-2222-2222-222222222222', 21, 390),
('22222222-2222-2222-2222-222222222222', 30, 480),
('33333333-3333-3333-3333-333333333333', 1, 16),
('33333333-3333-3333-3333-333333333333', 2, 60),
('33333333-3333-3333-3333-333333333333', 3, 85),
('33333333-3333-3333-3333-333333333333', 4, 110),
('33333333-3333-3333-3333-333333333333', 5, 135),
('33333333-3333-3333-3333-333333333333', 7, 175),
('33333333-3333-3333-3333-333333333333', 10, 240),
('33333333-3333-3333-3333-333333333333', 14, 300),
('33333333-3333-3333-3333-333333333333', 21, 399),
('33333333-3333-3333-3333-333333333333', 30, 510);
