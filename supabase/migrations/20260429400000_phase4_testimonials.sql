-- ============================================================
-- Fase 4: Testimonials (Færder)
-- Idempotent. Forutsetter fase 1.
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id         uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  author_name     text          NOT NULL,
  author_role     text          DEFAULT '' NOT NULL,        -- f.eks. "Tønsberg" eller "Maritim Opplæring Sørøst"
  author_company  text          DEFAULT '' NOT NULL,        -- f.eks. "Bedriftskunde", "Fast kunde"
  quote           text          NOT NULL,
  rating          integer,
  sort_order      integer       DEFAULT 0 NOT NULL,
  published       boolean       DEFAULT true NOT NULL,
  created_at      timestamptz   DEFAULT now() NOT NULL,
  updated_at      timestamptz   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS testimonials_site_id_idx ON testimonials(site_id, sort_order);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads testimonials" ON testimonials;
CREATE POLICY "Public reads testimonials" ON testimonials FOR SELECT USING (published);

DROP POLICY IF EXISTS "Site users write testimonials" ON testimonials;
CREATE POLICY "Site users write testimonials" ON testimonials FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS testimonials_touch_updated_at ON testimonials;
CREATE TRIGGER testimonials_touch_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Seed
DO $$
DECLARE faerder_id uuid;
BEGIN
  SELECT id INTO faerder_id FROM sites WHERE slug = 'faerder';
  IF faerder_id IS NULL THEN RETURN; END IF;

  INSERT INTO testimonials (site_id, author_name, author_role, author_company, quote, rating, sort_order) VALUES
    (faerder_id, 'Sengemakeriet Duxiana', 'Tønsberg', 'Bedriftskunde',
      'Færder Multiservice har vasket hos oss i over 12 år. De tar både regelmessig vask av butikken og periodisk vask av vinduene. Vi er svært fornøyd med jobben de gjør. De er raske og effektive, og det blir alltid skinnende rent!',
      5, 0),
    (faerder_id, 'Torunn G.', 'Vestfold', 'Pasient- og brukerombudet',
      'Vi har i flere år benyttet Færder Multiservice til renhold på våre kontorer. Vi er veldig tilfredse med jobben de gjør, alltid imøtekommende og fleksible, og de stiller alltid med hyggelige flinke folk.',
      5, 1),
    (faerder_id, 'Madeleine P.', 'Privatkunde', 'Fast kunde',
      'I ca. 3 år har Færder Multiservice vasket hjemme hos oss. De er vanvittig flinke, svært nøye og veldig hyggelige! Vi har et stort hus og to hunder, og aldri har det vært en ting å utsette. Varm anbefaling!',
      5, 2),
    (faerder_id, 'Oddmund N.', 'Maritim Opplæring Sørøst', 'Bedriftskunde',
      'Færder Multiservice har vasket hos oss i ca 13 år. De tar både regelmessig vask av kontorene og periodisk vask av vinduer. Vi er svært fornøyde. De er raske, effektive og veldig fleksible. Alle tomlene opp!',
      5, 3)
  ON CONFLICT DO NOTHING;
END $$;
