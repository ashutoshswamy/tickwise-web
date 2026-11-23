CREATE TABLE IF NOT EXISTS users(
  uid TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS campaigns(
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(uid),
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 48),
  cpm_cents INTEGER NOT NULL CHECK (cpm_cents >= 200),
  budget_cents INTEGER NOT NULL CHECK (budget_cents >= 500),
  spent_micro BIGINT NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'unpaid',
  placement TEXT NOT NULL DEFAULT 'both' CHECK (placement IN ('terminal','extension','both')),
  created TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS impressions(
  id BIGSERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
  dev_id TEXT NOT NULL REFERENCES users(uid),
  dev_micro INTEGER NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS imp_dev ON impressions(dev_id, campaign_id, ts DESC);
CREATE INDEX IF NOT EXISTS camp_live ON campaigns(status, cpm_cents DESC);
CREATE TABLE IF NOT EXISTS payouts(
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(uid),
  cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  ts TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS link_url TEXT;
CREATE TABLE IF NOT EXISTS clicks(
  id BIGSERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
  dev_id TEXT NOT NULL REFERENCES users(uid),
  ts TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS clk_campaign ON clicks(campaign_id, ts DESC);
CREATE INDEX IF NOT EXISTS clk_dev ON clicks(dev_id, campaign_id, ts DESC);
-- Existing databases: ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS placement TEXT NOT NULL DEFAULT 'both' CHECK (placement IN ('terminal','extension','both'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS payout_details TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_version TEXT;
CREATE TABLE IF NOT EXISTS waitlist(
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'developer' CHECK (role IN ('developer','advertiser')),
  created TIMESTAMPTZ NOT NULL DEFAULT now());
