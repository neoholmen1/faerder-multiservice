-- ============================================================
-- Fase 2: Site-settings (Færder)
-- Kontaktinfo, åpningstider, sosiale medier, dekningsområde, badges.
-- Idempotent. Forutsetter fase 1.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  site_id         uuid          PRIMARY KEY REFERENCES sites(id) ON DELETE CASCADE,

  -- Kontakt
  phone           text,
  email_general   text,

  -- Adresse
  visit_address   text,
  postal_address  text,

  -- Åpningstider (multilinje, vises whitespace-pre-line)
  opening_hours   text,

  -- Sosiale medier (jsonb-objekt: { facebook, instagram, linkedin, ... })
  social          jsonb         DEFAULT '{}'::jsonb NOT NULL,

  -- Dekningsområde (liste over byer som vises i footer + sider)
  coverage_areas  jsonb         DEFAULT '[]'::jsonb NOT NULL,

  -- Badges (org-godkjenninger som vises i footer)
  badges          jsonb         DEFAULT '[]'::jsonb NOT NULL,

  updated_at      timestamptz   DEFAULT now() NOT NULL
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads site_settings" ON site_settings;
CREATE POLICY "Public reads site_settings"
  ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users insert site_settings" ON site_settings;
CREATE POLICY "Site users insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users update site_settings" ON site_settings;
CREATE POLICY "Site users update site_settings"
  ON site_settings FOR UPDATE
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users delete site_settings" ON site_settings;
CREATE POLICY "Site users delete site_settings"
  ON site_settings FOR DELETE
  USING (has_site_access(site_id));

DROP TRIGGER IF EXISTS site_settings_touch_updated_at ON site_settings;
CREATE TRIGGER site_settings_touch_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Seed Færder
INSERT INTO site_settings (
  site_id,
  phone,
  email_general,
  visit_address,
  postal_address,
  opening_hours,
  social,
  coverage_areas,
  badges
)
SELECT
  id,
  '968 23 647',
  'post@faerdermultiservice.no',
  'Rambergveien 1, Tønsberg',
  'Rambergveien 1, Tønsberg',
  E'Mandag–fredag: 08:00–16:00\nLørdag–søndag: Stengt',
  '{}'::jsonb,
  '["Tønsberg","Nøtterøy","Tjøme","Færder","Sandefjord","Horten","Holmestrand","Larvik"]'::jsonb,
  '[
    {"key":"godkjent","label":"Offentlig godkjent renholdsbedrift","tooltip":"Godkjent av Arbeidstilsynet. Registrert i Renholdsregisteret."},
    {"key":"nho","label":"Medlem av NHO Service og Handel","tooltip":"NHO Service og Handel: Norges ledende arbeidsgiverorganisasjon for servicenæringen."},
    {"key":"ev","label":"EV-sertifisert","tooltip":"EV-dampmaskin: Ingen sterke kjemikalier. Skånsomt for miljøet."}
  ]'::jsonb
FROM sites
WHERE slug = 'faerder'
ON CONFLICT (site_id) DO NOTHING;
