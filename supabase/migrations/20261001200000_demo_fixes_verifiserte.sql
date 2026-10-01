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
SELECT 'tomme rader', count(*)::text FROM page_sections WHERE btrim(coalesce(value,'')) = '';


-- ═══════════════════════════════════════════════════════════════════════
-- IKKE RØRT: PRISER
--
-- Dagens nettside (faerdermultiservice.no) inneholder ingen priser i det
-- hele tatt — 11 sider gjennomsøkt, null kronebeløp. Prisen kan derfor
-- ikke hentes derfra.
--
-- Masterplan v3.2 oppgir «Fast vask — Fra 350 kr/time», altså TIMEPRIS.
-- Nettsiden bruker stykkpris. Det er to ulike prismodeller, ikke bare
-- ulike tall. Dette må Aleksandra avgjøre — se notat i rapporten.
--
-- ROLLBACK (hvis noe skulle være feil):
--   UPDATE site_settings s SET visit_address = b.visit_address,
--          postal_address = b.postal_address
--     FROM backup_20261001_site_settings b WHERE s.site_id = b.site_id;
--   -- page_sections: radene ble slettet, så gjenopprett med
--   INSERT INTO page_sections SELECT * FROM backup_20261001_page_sections
--     ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════
