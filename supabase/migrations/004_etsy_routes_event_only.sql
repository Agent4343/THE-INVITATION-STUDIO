ALTER TABLE etsy_listing_routes
  DROP CONSTRAINT IF EXISTS etsy_listing_routes_event_tier_unique;

DROP INDEX IF EXISTS idx_etsy_listing_routes_event_tier;

ALTER TABLE etsy_listing_routes
  DROP COLUMN IF EXISTS package_tier;

ALTER TABLE etsy_listing_routes
  ADD CONSTRAINT etsy_listing_routes_event_unique UNIQUE (event_type);

CREATE INDEX IF NOT EXISTS idx_etsy_listing_routes_event
  ON etsy_listing_routes(event_type);
