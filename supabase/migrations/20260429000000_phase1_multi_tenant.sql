-- ============================================================
-- Fase 1: Multi-tenant grunnmur (Færder Multiservice)
-- Kjøres i Supabase SQL Editor.
-- Idempotent: kan kjøres på nytt uten å miste data.
-- ============================================================

-- 1. SITES — én rad per kunde-nettsted
CREATE TABLE IF NOT EXISTS sites (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        text          NOT NULL UNIQUE,
  name        text          NOT NULL,
  domain      text,
  org_number  text,
  theme       jsonb         DEFAULT '{}'::jsonb,
  active      boolean       DEFAULT true NOT NULL,
  created_at  timestamptz   DEFAULT now() NOT NULL,
  updated_at  timestamptz   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS sites_slug_idx ON sites(slug);
CREATE INDEX IF NOT EXISTS sites_domain_idx ON sites(domain);

-- 2. SUPER_ADMINS — full tilgang på alle sites
CREATE TABLE IF NOT EXISTS super_admins (
  user_id     uuid          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz   DEFAULT now() NOT NULL
);

-- 3. SITE_USERS — hvem kan redigere hvilken site
DO $$ BEGIN
  CREATE TYPE site_role AS ENUM ('owner', 'editor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS site_users (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id     uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id     uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        site_role     NOT NULL DEFAULT 'editor',
  created_at  timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, user_id)
);

CREATE INDEX IF NOT EXISTS site_users_user_id_idx ON site_users(user_id);
CREATE INDEX IF NOT EXISTS site_users_site_id_idx ON site_users(site_id);

-- 4. HELPER FUNCTIONS
-- SECURITY DEFINER så funksjonen kan slå opp i super_admins selv om kalleren
-- ikke har lese-rettigheter direkte (RLS bypass for definisjons-eieren).
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM super_admins WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION has_site_access(p_site_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM site_users
      WHERE site_id = p_site_id AND user_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION has_site_role(p_site_id uuid, p_role site_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM site_users
      WHERE site_id = p_site_id
        AND user_id = auth.uid()
        AND role = p_role
    );
$$;

-- 5. RLS PÅ SITES
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active sites" ON sites;
CREATE POLICY "Public can read active sites"
  ON sites FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Super admins manage sites" ON sites;
CREATE POLICY "Super admins manage sites"
  ON sites FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "Owners can update own site" ON sites;
CREATE POLICY "Owners can update own site"
  ON sites FOR UPDATE
  USING (has_site_role(sites.id, 'owner'::site_role))
  WITH CHECK (has_site_role(sites.id, 'owner'::site_role));

-- 6. RLS PÅ SUPER_ADMINS
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own super_admin status" ON super_admins;
CREATE POLICY "Users can read own super_admin status"
  ON super_admins FOR SELECT
  USING (user_id = auth.uid());
-- Ingen INSERT/UPDATE/DELETE — kun service role kan endre denne tabellen.

-- 7. RLS PÅ SITE_USERS
ALTER TABLE site_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read site_users for sites they belong to" ON site_users;
CREATE POLICY "Users can read site_users for sites they belong to"
  ON site_users FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_super_admin()
    OR has_site_access(site_id)
  );

DROP POLICY IF EXISTS "Owners and super_admins manage site_users" ON site_users;
CREATE POLICY "Owners and super_admins manage site_users"
  ON site_users FOR ALL
  USING (
    is_super_admin()
    OR has_site_role(site_id, 'owner'::site_role)
  )
  WITH CHECK (
    is_super_admin()
    OR has_site_role(site_id, 'owner'::site_role)
  );

-- 8. SEED FAERDER MULTISERVICE
INSERT INTO sites (slug, name, domain, org_number)
VALUES ('faerder', 'Færder Multiservice AS', 'faerdermultiservice.no', '824 779 392')
ON CONFLICT (slug) DO NOTHING;

-- 9. TRIGGER: oppdater updated_at automatisk
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sites_touch_updated_at ON sites;
CREATE TRIGGER sites_touch_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
