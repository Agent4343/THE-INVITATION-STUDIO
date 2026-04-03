-- Ensure one access code is provisioned per Stripe checkout session.
CREATE UNIQUE INDEX IF NOT EXISTS idx_access_codes_etsy_order_unique
  ON access_codes(etsy_order_id)
  WHERE etsy_order_id IS NOT NULL;
