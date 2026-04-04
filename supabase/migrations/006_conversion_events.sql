-- Track core conversion funnel events for profitability analysis.
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(80) NOT NULL,
  path VARCHAR(200) NOT NULL DEFAULT '/',
  session_id VARCHAR(80) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_event_name
  ON conversion_events(event_name);

CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at
  ON conversion_events(created_at DESC);

ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access conversion events"
  ON conversion_events FOR ALL
  USING (auth.role() = 'service_role');
