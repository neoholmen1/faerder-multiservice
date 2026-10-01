-- Retter innhold som avviker fra verifiserte fakta, og rydder tomme
-- page_sections-rader som fikk siden til å vise kode-fallback i stedet.
--
-- Kjøres i Supabase SQL Editor (postgres-rollen, forbi RLS).
-- Alt er markert TODO(kunde) — verdiene må bekreftes av Aleksandra før lansering.

DO $$
DECLARE
  v_site uuid;
BEGIN
  SELECT id INTO v_site FROM sites WHERE slug = 'faerder';
  IF v_site IS NULL THEN
    RAISE EXCEPTION 'Fant ingen site med slug=faerder';
  END IF;

  -- 1) ADRESSE — Brønnøysund + 1881 + proff: Stensarmen 3A, 3112 Tønsberg.
  --    «Rambergveien 1» finnes i Tønsberg (postnr 3115) men er ikke firmaets.
  UPDATE site_settings
     SET visit_address  = 'Stensarmen 3A, 3112 Tønsberg',
         postal_address = 'Stensarmen 3A, 3112 Tønsberg'
   WHERE site_id = v_site;

  -- 2) PRIS — «fra»-prisen må matche laveste faktiske trinn (ukentlig, hybel
  --    under 25 m² = 470). 600 og 750 fantes ikke i noe pristrinn.
  UPDATE services
     SET price_label = 'Fra 470 kr',
         seo_title   = 'Fast vaskehjelp i Vestfold · Fra 470 kr/gang'
   WHERE site_id = v_site AND slug = 'fast-vask';

  UPDATE pages
     SET hero_subtitle    = 'Fast vask i hele Vestfold — fra 470 kr.',
         hero_eyebrow     = 'Vaskebyrå i Vestfold',
         meta_description = 'Skikkelig renhold for hjem og bedrift i Vestfold. Godkjent, EV-sertifisert, fast vask fra 470 kr. Se priser og bestill.'
   WHERE site_id = v_site AND slug = 'home';

  -- 2b) Flere pris-etiketter som ikke matchet billigste pris-pakke:
  --     spesialvask sto med «fra 800» i SEO-teksten (vindusvask) mens
  --     etiketten er 400 (tepperens). Hovedrengjøring sto «fra 1 100»
  --     (engangsvask) mens sesongvask er 1 000.
  UPDATE services
     SET seo_description = 'Vindusvask og spesialvask i Vestfold fra 400 kr. Vi tar det du ikke gidder. Ring for tilbud.'
   WHERE site_id = v_site AND slug = 'spesialvask';

  UPDATE services
     SET price_label     = 'Fra 1 000 kr',
         seo_description = 'Hovedrengjøring i Tønsberg og Vestfold fra 1 000 kr. Grundig fra topp til bunn. Bestill i dag.'
   WHERE site_id = v_site AND slug = 'hovedrengjoring';

  -- 3) ANTALL ANSATTE — Brønnøysund har 9 (12.08.2026), 1881 har 10.
  --    Ingen tallpåstand som registeret kan motbevise.
  UPDATE pages
     SET meta_description = 'Et etablert renholdsteam som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020. Bli kjent med oss.'
   WHERE site_id = v_site AND slug = 'om-oss';

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

  -- 4) TOMME FELT — disse ble tømt i admin, men siden viser fallback-teksten
  --    fra koden fordi useCms() behandler '' som «ikke satt». Resultatet var
  --    at redaktøren så et tomt felt mens besøkende så tekst. Slett radene så
  --    admin og nettside viser det samme.
  DELETE FROM page_sections
   WHERE site_id = v_site AND (value IS NULL OR btrim(value) = '');
END $$;

-- Kontroll
SELECT 'site_settings' AS tabell, visit_address AS verdi FROM site_settings
UNION ALL SELECT 'fast-vask pris', price_label FROM services WHERE slug = 'fast-vask'
UNION ALL SELECT 'home hero',      hero_subtitle FROM pages WHERE slug = 'home'
UNION ALL SELECT 'tomme seksjoner', count(*)::text FROM page_sections WHERE btrim(coalesce(value,'')) = '';
