-- Admin-managed Etsy bundle promotion configuration.
-- Allows pricing/promo messaging changes without redeploying code.

CREATE TABLE IF NOT EXISTS etsy_bundle_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton_key VARCHAR(32) NOT NULL UNIQUE DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  min_distinct_items INTEGER NOT NULL DEFAULT 4
    CHECK (min_distinct_items >= 1 AND min_distinct_items <= 9),
  deal_code VARCHAR(64) NOT NULL DEFAULT 'STUDIO4PLUS',
  unlocked_message TEXT NOT NULL DEFAULT
    'Mix & Match 4+ perk unlocked. Ask seller to apply STUDIO4PLUS for bundle savings and coordinated finishing recommendations.',
  locked_message TEXT NOT NULL DEFAULT
    'Add 4 or more different pieces to unlock the STUDIO4PLUS bundle perk on Etsy.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO etsy_bundle_configs (
  singleton_key,
  is_active,
  min_distinct_items,
  deal_code,
  unlocked_message,
  locked_message
)
VALUES (
  'default',
  TRUE,
  4,
  'STUDIO4PLUS',
  'Mix & Match 4+ perk unlocked. Ask seller to apply STUDIO4PLUS for bundle savings and coordinated finishing recommendations.',
  'Add 4 or more different pieces to unlock the STUDIO4PLUS bundle perk on Etsy.'
)
ON CONFLICT (singleton_key) DO NOTHING;

ALTER TABLE etsy_bundle_configs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'etsy_bundle_configs'
      AND policyname = 'Service role full access etsy bundle configs'
  ) THEN
    CREATE POLICY "Service role full access etsy bundle configs"
      ON etsy_bundle_configs
      FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

DROP TRIGGER IF EXISTS etsy_bundle_configs_updated_at ON etsy_bundle_configs;
CREATE TRIGGER etsy_bundle_configs_updated_at
  BEFORE UPDATE ON etsy_bundle_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
