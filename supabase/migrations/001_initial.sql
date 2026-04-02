-- Access codes delivered via Etsy
CREATE TABLE access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(14) UNIQUE NOT NULL,
  etsy_order_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'unused'
    CHECK (status IN ('unused', 'active', 'completed', 'expired')),
  design_id UUID,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_access_codes_code ON access_codes(code);
CREATE INDEX idx_access_codes_status ON access_codes(status);

-- Customer designs
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code_id UUID REFERENCES access_codes(id),
  template_id VARCHAR(50) NOT NULL DEFAULT 'classic-elegance',
  palette_id VARCHAR(50) NOT NULL DEFAULT 'sage-gold',
  font_id VARCHAR(50) NOT NULL DEFAULT 'playfair-display',
  content JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  pdf_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from access_codes to designs after designs table exists
ALTER TABLE access_codes ADD CONSTRAINT fk_access_codes_design
  FOREIGN KEY (design_id) REFERENCES designs(id);

-- Print orders
CREATE TABLE print_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) NOT NULL,
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),
  prodigi_order_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'submitted', 'printing',
                      'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  tracking_number VARCHAR(255),
  amount_paid INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER designs_updated_at BEFORE UPDATE ON designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER print_orders_updated_at BEFORE UPDATE ON print_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_orders ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (API routes use service role key)
CREATE POLICY "Service role full access" ON access_codes FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON designs FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON print_orders FOR ALL
  USING (auth.role() = 'service_role');
