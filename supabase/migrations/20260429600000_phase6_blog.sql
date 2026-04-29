-- ============================================================
-- Fase 6: Blog posts (Færder)
-- Idempotent. Forutsetter fase 1.
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id                uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id           uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug              text          NOT NULL,
  title             text          NOT NULL,
  excerpt           text          DEFAULT '' NOT NULL,
  body              text          DEFAULT '' NOT NULL,           -- HTML eller markdown
  cover_image_url   text,
  tags              jsonb         DEFAULT '[]'::jsonb NOT NULL,   -- string[]
  author_name       text          DEFAULT '' NOT NULL,
  published_at      timestamptz,
  status            text          DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published')),
  seo_title         text,
  seo_description   text,
  created_at        timestamptz   DEFAULT now() NOT NULL,
  updated_at        timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS blog_posts_site_status_idx ON blog_posts(site_id, status, published_at DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads published blog_posts" ON blog_posts;
CREATE POLICY "Public reads published blog_posts" ON blog_posts FOR SELECT
  USING (status = 'published' OR has_site_access(site_id));

DROP POLICY IF EXISTS "Site users write blog_posts" ON blog_posts;
CREATE POLICY "Site users write blog_posts" ON blog_posts FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS blog_posts_touch_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_touch_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- Seed
DO $$
DECLARE faerder_id uuid;
BEGIN
  SELECT id INTO faerder_id FROM sites WHERE slug = 'faerder';
  IF faerder_id IS NULL THEN RETURN; END IF;

  INSERT INTO blog_posts (site_id, slug, title, excerpt, body, cover_image_url, tags, published_at, status, seo_title, seo_description) VALUES (
    faerder_id, '5-ting-du-bor-vite-for-du-bestiller-flyttevask',
    '5 ting du bør vite før du bestiller flyttevask',
    'Skal du flytte? Her er fem tips som gjør at du får tilbake depositumet og leverer en bolig du kan være stolt av.',
    E'<h2>1. Bestill i god tid</h2>\n<p>Flyttesesongen i Vestfold er spesielt travel fra mai til august. Bestiller du to til tre uker i forveien, er du trygg på å få en tid som passer — og slipper stresset med å finne noen i siste liten.</p>\n\n<h2>2. Tøm boligen først</h2>\n<p>Vi vasker grundigere når alle rom er tomme. Fjern møbler, pappesker og personlige eiendeler før vi kommer. Det sparer tid for oss og penger for deg.</p>\n\n<h2>3. Sjekk hva som er inkludert</h2>\n<p>En god flyttevask dekker alle synlige flater: gulv, vegger, vinduskarmer, kjøkken (inkl. innvendig i skap og hvitevarer), bad og boder. Spør alltid om en detaljert sjekkliste slik at det ikke blir noen overraskelser.</p>\n\n<h2>4. Dokumentér tilstanden</h2>\n<p>Ta bilder av boligen etter vask. Dette er ditt bevis overfor utleier eller megler dersom det oppstår uenighet om depositumet.</p>\n\n<h2>5. Velg en godkjent renholdsbedrift</h2>\n<p>Sørg for at firmaet er registrert i Renholdsregisteret og har offentlig godkjenning fra Arbeidstilsynet. Det gir deg trygghet for at jobben utføres forsvarlig — og at arbeiderne har ordnede forhold.</p>',
    '/images/illustrations/blogg-flyttevask.webp',
    '["Tips","Flyttevask"]'::jsonb,
    '2026-02-15 12:00:00+00', 'published',
    '5 ting du bør vite før du bestiller flyttevask — Færder Multiservice',
    'Skal du flytte? Her er fem tips som gjør at du får tilbake depositumet og leverer en bolig du kan være stolt av.'
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  INSERT INTO blog_posts (site_id, slug, title, excerpt, body, cover_image_url, tags, published_at, status, seo_title, seo_description) VALUES (
    faerder_id, 'hvor-ofte-bor-du-ha-fast-vask',
    'Hvor ofte bør du ha fast vask? En guide',
    'Ukentlig, annenhver uke eller månedlig? Vi hjelper deg å finne riktig frekvens for hjemmet ditt.',
    E'<h2>Det finnes ikke ett riktig svar</h2>\n<p>Hvor ofte du trenger vask avhenger av flere ting: størrelsen på boligen, antall personer i husstanden, om du har kjæledyr, og hva du forventer av renhold i hverdagen.</p>\n\n<h2>Ukentlig vask</h2>\n<p>Passer best for familier med barn, husstander med kjæledyr, eller alle som ønsker at hjemmet alltid ser presentabelt ut. Gulv, bad og kjøkken holdes kontinuerlig rene.</p>\n\n<h2>Annenhver uke</h2>\n<p>Det vanligste valget. Du får en grundig rengjøring jevnlig uten at det blir et stort innhogg i budsjettet. Mellom vaskene holder de fleste hjemmet rent med lett vedlikehold.</p>\n\n<h2>Månedlig vask</h2>\n<p>Et godt alternativ for enslige eller par uten barn som ønsker en skikkelig gjennomgang en gang i måneden. Kombiner gjerne med en hovedrengjøring hvert halvår.</p>\n\n<h2>Vår anbefaling</h2>\n<p>Start med annenhver uke. Etter to-tre runder ser du raskt om du vil øke eller redusere frekvensen. Vi tilpasser alltid opplegget etter dine behov — uten bindingstid.</p>',
    '/images/illustrations/blogg-fast-vask.webp',
    '["Guide","Fast vask"]'::jsonb,
    '2026-02-08 12:00:00+00', 'published',
    'Hvor ofte bør du ha fast vask? En guide — Færder Multiservice',
    'Ukentlig, annenhver uke eller månedlig? Vi hjelper deg å finne riktig frekvens for hjemmet ditt.'
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  INSERT INTO blog_posts (site_id, slug, title, excerpt, body, cover_image_url, tags, published_at, status, seo_title, seo_description) VALUES (
    faerder_id, 'slik-holder-du-hjemmet-rent-mellom-vaskene',
    'Slik holder du hjemmet rent mellom vaskene',
    'Små daglige rutiner gjør en stor forskjell. Her er våre beste tips for et rent hjem — uten å bruke hele helgen.',
    E'<h2>Ti minutter om dagen</h2>\n<p>Sett av ti minutter hver kveld til hurtigfiks: tørk av kjøkkenbenken, rydd bort oppvasken, og ta en rask runde med støvmopp i gangen. Det høres lite ut, men det forhindrer at rot samler seg opp.</p>\n\n<h2>En ting om gangen</h2>\n<p>Ikke prøv å gjøre alt på en gang. Mandag: bad. Onsdag: kjøkken. Fredag: støvsuging. Små bolker er enklere å gjennomføre enn en hel vaskedag i helgen.</p>\n\n<h2>Hold ryddige flater</h2>\n<p>Jo færre ting som ligger på benkene, desto raskere går det å tørke av. Finn faste plasser for nøkler, post og småting — det gjør en overraskende stor forskjell.</p>\n\n<h2>Invester i riktig utstyr</h2>\n<p>En god mikrofiberklut, en lettvint støvmopp og en sprayflaske med allrengjøring er alt du trenger for daglig vedlikehold. Dropp unødvendig mange spesialprodukter.</p>\n\n<h2>La proffene ta storrunden</h2>\n<p>Daglig vedlikehold holder hjemmet trivelig, men det erstatter ikke en grundig rengjøring. La oss ta de tunge løftene — så kan du bruke tiden din på det som betyr mest.</p>',
    '/images/illustrations/blogg-rent-mellom.webp',
    '["Tips","Renhold"]'::jsonb,
    '2026-01-20 12:00:00+00', 'published',
    'Slik holder du hjemmet rent mellom vaskene — Færder Multiservice',
    'Små daglige rutiner gjør en stor forskjell. Her er våre beste tips for et rent hjem — uten å bruke hele helgen.'
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  INSERT INTO blog_posts (site_id, slug, title, excerpt, body, cover_image_url, tags, published_at, status, seo_title, seo_description) VALUES (
    faerder_id, 'derfor-bor-bedrifter-investere-i-profesjonelt-renhold',
    'Derfor bør bedrifter investere i profesjonelt renhold',
    'Et rent arbeidsmiljø øker produktivitet, reduserer sykefravær og gir et bedre inntrykk på kunder og ansatte.',
    E'<h2>Førsteinntrykket teller</h2>\n<p>Enten det er kunder, samarbeidspartnere eller potensielle ansatte — alle legger merke til et rent og velholdt lokale. Et rotete kontor får folk til å lure på hva annet dere slurver med.</p>\n\n<h2>Mindre sykefravær</h2>\n<p>Støv, bakterier og dårlig inneklima er blant de vanligste årsakene til forkjølelse og allergi på arbeidsplassen. Jevnlig grundig renhold reduserer sykefraværet merkbart.</p>\n\n<h2>Bedre konsentrasjon</h2>\n<p>De fleste merker det selv: man jobber bedre når det er ryddig rundt en. Færre distraksjoner, mindre frustrasjon over rotet på pulten ved siden av.</p>\n\n<h2>Spar tid og ressurser</h2>\n<p>Når de ansatte slipper å bruke tid på renhold, kan de fokusere på det de er best på. Overlat jobben til proffene — det lønner seg.</p>\n\n<h2>Tilpasset din bedrift</h2>\n<p>Vi legger opp vasken etter bedriftens størrelse, type lokale og behov. Alt fra daglig kontorvask til ukentlig grundig rengjøring — vi finner et opplegg som passer for dere.</p>',
    '/images/illustrations/blogg-profesjonelt-renhold.webp',
    '["Guide","Kontor"]'::jsonb,
    '2026-01-10 12:00:00+00', 'published',
    'Derfor bør bedrifter investere i profesjonelt renhold — Færder Multiservice',
    'Et rent arbeidsmiljø øker produktivitet, reduserer sykefravær og gir et bedre inntrykk på kunder og ansatte.'
  ) ON CONFLICT (site_id, slug) DO NOTHING;

END $$;
