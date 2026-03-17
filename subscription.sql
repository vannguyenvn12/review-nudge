ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier               text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status             text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS polar_customer_id               text,
  ADD COLUMN IF NOT EXISTS polar_subscription_id           text,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamptz;
