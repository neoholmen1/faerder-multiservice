-- ═══════════════════════════════════════════════════════════════════════
-- Færder Multiservice — innholdsfikser før kundemøte 02.10.2026
--
-- Retter KUN det som er etterprøvbart mot en ekstern kilde.
-- Priser er bevisst IKKE rørt — se note nederst.
--
-- Kjør i Supabase SQL Editor. Steg 0 lager sikkerhetskopi først.
-- ═══════════════════════════════════════════════════════════════════════

-- ── STEG 0: SIKKERHETSKOPI ────────────────────────────────────────────
-- Kopierer hele radene som berøres. Tabellene blir liggende til du
-- sletter dem selv, så du kan rulle tilbake når som helst.

CREATE TABLE IF NOT EXISTS backup_20261001_site_settings AS
  SELECT * FROM site_settings;

CREATE TABLE IF NOT EXISTS backup_20261001_pages AS
  SELECT * FROM pages;

CREATE TABLE IF NOT EXISTS backup_20261001_page_sections AS
  SELECT * FROM page_sections;

-- Kontroll: skal vise antall kopierte rader
SELECT 'site_settings' AS tabell, count(*) FROM backup_20261001_site_settings
UNION ALL SELECT 'pages',         count(*) FROM backup_20261001_pages
UNION ALL SELECT 'page_sections', count(*) FROM backup_20261001_page_sections;


-- ── STEG 1: ENDRINGENE ────────────────────────────────────────────────
DO $$
DECLARE
  v_site uuid;
BEGIN
  SELECT id INTO v_site FROM sites WHERE slug = 'faerder';
  IF v_site IS NULL THEN
    RAISE EXCEPTION 'Fant ingen site med slug=faerder — avbryter';
  END IF;

  -- 1a) ADRESSE
  -- Kilde: Brønnøysundregistrene (forretningsadresse, org.nr 824 779 392),
  --        bekreftet av 1881.no, proff.no og gulesider.no.
  -- Fra:   «Rambergveien 1, Tønsberg» — finnes i Tønsberg (postnr 3115),
  --        men er ikke firmaets adresse.
  UPDATE site_settings
     SET visit_address  = 'Stensarmen 3A, 3112 Tønsberg',
         postal_address = 'Stensarmen 3A, 3112 Tønsberg'
   WHERE site_id = v_site;

  -- 1b) ANTALL ANSATTE — fjerner tallpåstanden
  -- Kilde: Brønnøysund oppgir 9 ansatte (registrert 12.08.2026),
  --        1881.no oppgir 10. Nettsiden sier «11+». Ingen av tallene lar
  --        seg bekrefte, så påstanden tas ut i stedet for å byttes.
  UPDATE page_sections SET value = 'Etablert'
   WHERE site_id = v_site AND page_slug = 'home'
     AND section_key = 'trust_bar' AND field_key = 'stat_value' AND sort_order = 1;

  UPDATE page_sections SET value = 'Team i Vestfold'
   WHERE site_id = v_site AND page_slug = 'home'
     AND section_key = 'trust_bar' AND field_key = 'stat_label' AND sort_order = 1;

  UPDATE page_sections
     SET value = 'I dag er vi et etablert team. Vi vasker for folk, bedrifter, borettslag og utbyggere i hele Vestfold — fra Holmestrand til Larvik.'
   WHERE site_id = v_site AND page_slug = 'om-oss'
     AND section_key = 'historie' AND field_key = 'paragraph' AND sort_order = 1;

  UPDATE pages
     SET meta_description = 'Et etablert renholdsteam som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020. Bli kjent med oss.'
   WHERE site_id = v_site AND slug = 'om-oss';


  -- 1d) PRISER — tallene tas ut inntil kunden har bekreftet prismodell
  -- Dagens nettside (faerdermultiservice.no) har ingen priser i det hele
  -- tatt — 11 sider gjennomsøkt, null kronebeløp. Masterplan v3.2 oppgir
  -- TIMEPRIS for fire av tjenestene (fast vask 350 kr/t, byggvask 400 kr/t,
  -- spesialvask 350 kr/t, hovedrengjøring 450 kr/t), mens siden bruker
  -- stykkpris. Det er to ulike prismodeller, ikke bare ulike tall.
  --
  -- De tre som stemmer med masterplanen er IKKE rørt:
  --   flyttevask (3 500), kontorvask (avtale), borettslag (månedlig avtale)
  UPDATE services
     SET price_label = 'Pris etter befaring'
   WHERE site_id = v_site
     AND slug IN ('fast-vask','byggvask','spesialvask',
                  'luktsanering','hovedrengjoring','visningsvask');

  -- SEO-tekstene gjentok de samme tallene
  UPDATE services SET
    seo_title       = 'Fast vaskehjelp i Vestfold · Gratis befaring',
    seo_description = 'Fast vaskehjelp i Tønsberg og Vestfold. Vi kommer fast — du slipper å tenke på det. Godkjent og NHO-medlem. Gratis befaring.'
   WHERE site_id = v_site AND slug = 'fast-vask';

  UPDATE services SET seo_description = 'Byggvask i Vestfold. Vi fjerner byggstøvet grundig. 100 % fornøydgaranti. Gratis befaring.'
   WHERE site_id = v_site AND slug = 'byggvask';
  UPDATE services SET seo_description = 'Vindusvask og spesialvask i Vestfold. Vi tar det du ikke gidder. Ring for tilbud.'
   WHERE site_id = v_site AND slug = 'spesialvask';
  UPDATE services SET seo_description = 'Luktsanering i Vestfold. Vi fjerner lukten ordentlig. Ring for befaring.'
   WHERE site_id = v_site AND slug = 'luktsanering';
  UPDATE services SET seo_description = 'Hovedrengjøring i Tønsberg og Vestfold. Grundig fra topp til bunn. Gratis befaring.'
   WHERE site_id = v_site AND slug = 'hovedrengjoring';
  UPDATE services SET seo_description = 'Visningsvask i Vestfold. Boligen klar for visning. Godt førsteinntrykk. Gratis befaring.'
   WHERE site_id = v_site AND slug = 'visningsvask';

  -- Hero: «fra 750 kr» fantes ikke i noen pristabell overhodet
  UPDATE pages
     SET hero_subtitle    = 'Skikkelig renhold i hele Vestfold — pris etter befaring.',
         meta_description = 'Skikkelig renhold for hjem og bedrift i Vestfold. Godkjent og EV-sertifisert. Gratis befaring — vi gir deg pris samme dag.'
   WHERE site_id = v_site AND slug = 'home';

  UPDATE pages
     SET meta_description = 'Se hva vi tilbyr innen renhold i Vestfold. Fast vask, flyttevask, kontorvask, byggvask og mer. Gratis befaring.'
   WHERE site_id = v_site AND slug = 'tjenester';

  -- 1c) TOMME RADER (5 stk)
  -- Disse ble tømt i admin. Koden behandler '' som «ikke satt» og viser
  -- fallback-teksten i stedet — så Aleksandra ser et tomt felt mens
  -- besøkende ser tekst. Sletting gjør at admin og nettside viser det samme.
  DELETE FROM page_sections
   WHERE site_id = v_site AND (value IS NULL OR btrim(value) = '');
END $$;


-- ── STEG 2: KONTROLL ──────────────────────────────────────────────────
SELECT 'adresse'          AS felt, visit_address  AS verdi FROM site_settings
UNION ALL
SELECT 'trust_bar verdi', value FROM page_sections
  WHERE page_slug='home' AND section_key='trust_bar' AND field_key='stat_value' AND sort_order=1
UNION ALL
SELECT 'tomme rader', count(*)::text FROM page_sections WHERE btrim(coalesce(value,'')) = ''
UNION ALL
SELECT 'fast-vask pris', price_label FROM services WHERE slug='fast-vask'
UNION ALL
SELECT 'home hero', hero_subtitle FROM pages WHERE slug='home';


-- ═══════════════════════════════════════════════════════════════════════
-- FORTSATT ÅPENT: PRISMODELL
--
-- Timepris eller fastpris? Masterplanen sier timepris for fire tjenester,
-- kalkulatoren er bygget på stykkpris. Svaret avgjør om kalkulatoren må
-- bygges om. Pris-pakkene (frequencies) ligger urørt i databasen og kan
-- tas i bruk igjen ved å sette price_label tilbake til et tall.
--
-- ROLLBACK (hvis noe skulle være feil):
--   UPDATE site_settings s SET visit_address = b.visit_address,
--          postal_address = b.postal_address
--     FROM backup_20261001_site_settings b WHERE s.site_id = b.site_id;
--   -- page_sections: radene ble slettet, så gjenopprett med
--   INSERT INTO page_sections SELECT * FROM backup_20261001_page_sections
--     ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════
