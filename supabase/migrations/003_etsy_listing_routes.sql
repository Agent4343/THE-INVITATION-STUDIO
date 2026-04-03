CREATE TABLE etsy_listing_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(64) NOT NULL,
  package_tier VARCHAR(32) NOT NULL,
  listing_url TEXT NOT NULL,
  listing_label VARCHAR(120) NOT NULL DEFAULT 'Etsy Listing',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT etsy_listing_routes_event_tier_unique UNIQUE (event_type, package_tier)
);

CREATE INDEX idx_etsy_listing_routes_active
  ON etsy_listing_routes(is_active);

CREATE INDEX idx_etsy_listing_routes_event_tier
  ON etsy_listing_routes(event_type, package_tier);

CREATE TRIGGER etsy_listing_routes_updated_at
  BEFORE UPDATE ON etsy_listing_routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE etsy_listing_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON etsy_listing_routes FOR ALL
  USING (auth.role() = 'service_role');
