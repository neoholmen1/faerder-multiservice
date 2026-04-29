-- ============================================================
-- Fase 3b: Seed page-innhold (Færder)
-- Setter inn hero + page_sections med dagens hardkodet tekst.
-- Idempotent. Forutsetter fase 3a.
-- ============================================================

DO $$
DECLARE faerder_id uuid;
BEGIN
  SELECT id INTO faerder_id FROM sites WHERE slug = 'faerder';
  IF faerder_id IS NULL THEN RETURN; END IF;

  -- ── FORSIDEN ──────────────────────────────────────────────
  UPDATE pages SET
    hero_eyebrow = 'Vaskebyrå i Vestfold',
    hero_title = 'Rent hjem.',
    hero_subtitle = 'Skikkelig renhold i hele Vestfold — fra 550 kr.',
    hero_cta_primary_label = 'Se våre tjenester',
    hero_cta_primary_href = '#tjenester',
    hero_cta_secondary_label = 'Ring oss',
    hero_cta_secondary_href = 'tel:+4796823647',
    meta_title = 'Vaskebyrå i Vestfold | Færder Multiservice',
    meta_description = 'Skikkelig renhold for hjem og bedrift i Vestfold. Godkjent, EV-sertifisert, fra 550 kr. Se priser og bestill.'
  WHERE site_id = faerder_id AND slug = 'home';

  -- Forsiden: "Hvorfor oss"-blokk (4 kort)
  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'home', 'hvorfor_oss', 'eyebrow', 'Derfor oss', 0),
    (faerder_id, 'home', 'hvorfor_oss', 'title', 'Derfor velger folk oss', 0),
    (faerder_id, 'home', 'hvorfor_oss', 'card_title', 'Offentlig godkjent', 0),
    (faerder_id, 'home', 'hvorfor_oss', 'card_text', 'Godkjent av Arbeidstilsynet. Alt er på stell hos oss.', 0),
    (faerder_id, 'home', 'hvorfor_oss', 'card_title', 'Medlem av NHO', 1),
    (faerder_id, 'home', 'hvorfor_oss', 'card_text', 'Vi er med i NHO Service og Handel. Vi gjør ting ordentlig.', 1),
    (faerder_id, 'home', 'hvorfor_oss', 'card_title', 'EV-sertifisert', 2),
    (faerder_id, 'home', 'hvorfor_oss', 'card_text', 'Vi vasker med damp — ingen sterke kjemikalier. Bra for deg og miljøet.', 2),
    (faerder_id, 'home', 'hvorfor_oss', 'card_title', 'Lokalt i Vestfold', 3),
    (faerder_id, 'home', 'hvorfor_oss', 'card_text', 'Vi holder til i Tønsberg. Kort vei til hele Vestfold.', 3)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;

  -- Forsiden: "Slik fungerer det"
  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'home', 'slik_fungerer', 'eyebrow', 'Slik fungerer det', 0),
    (faerder_id, 'home', 'slik_fungerer', 'title', 'Enkelt som 1-2-3', 0),
    (faerder_id, 'home', 'slik_fungerer', 'step_title', 'Fortell oss hva du trenger', 0),
    (faerder_id, 'home', 'slik_fungerer', 'step_text', 'Bruk kalkulatoren eller send oss en melding. Tar under ett minutt.', 0),
    (faerder_id, 'home', 'slik_fungerer', 'step_title', 'Vi gir deg en pris', 1),
    (faerder_id, 'home', 'slik_fungerer', 'step_text', 'Du får et tilbud samme dag — senest neste virkedag. Ingen skjulte kostnader.', 1),
    (faerder_id, 'home', 'slik_fungerer', 'step_title', 'Vi gjør jobben', 2),
    (faerder_id, 'home', 'slik_fungerer', 'step_text', 'Len deg tilbake. Vi fikser resten — grundig og skikkelig.', 2)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;

  -- Forsiden: Trust Bar (3 stats)
  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'home', 'trust_bar', 'stat_value', '6+', 0),
    (faerder_id, 'home', 'trust_bar', 'stat_label', 'Års erfaring', 0),
    (faerder_id, 'home', 'trust_bar', 'stat_value', '11+', 1),
    (faerder_id, 'home', 'trust_bar', 'stat_label', 'Ansatte', 1),
    (faerder_id, 'home', 'trust_bar', 'stat_value', 'Hundrevis', 2),
    (faerder_id, 'home', 'trust_bar', 'stat_label', 'Fornøyde kunder', 2)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;

  -- Forsiden: Anmeldelser-blokk
  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'home', 'kundeanmeldelser', 'eyebrow', 'Kundeanmeldelser', 0),
    (faerder_id, 'home', 'kundeanmeldelser', 'title', 'De fleste nye kundene våre kommer via anbefalinger', 0),
    (faerder_id, 'home', 'kundeanmeldelser', 'subtitle', 'Hør hva noen av dem sier.', 0)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;

  -- Forsiden: FAQ
  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'home', 'faq', 'eyebrow', 'FAQ', 0),
    (faerder_id, 'home', 'faq', 'title', 'Vanlige spørsmål', 0),
    (faerder_id, 'home', 'faq', 'q', 'Hva koster det?', 0),
    (faerder_id, 'home', 'faq', 'a', 'Prøv kalkulatoren vår — du får et estimat med en gang. Prisen avhenger av størrelse og type jobb. Vi gir alltid en fast pris etter befaring.', 0),
    (faerder_id, 'home', 'faq', 'q', 'Hva er inkludert?', 1),
    (faerder_id, 'home', 'faq', 'a', 'Alle flater, gulv, kjøkken, bad og støvtørking. Hver tjeneste har en egen sjekkliste så du vet nøyaktig hva du får.', 1),
    (faerder_id, 'home', 'faq', 'q', 'Dekker dere mitt område?', 2),
    (faerder_id, 'home', 'faq', 'a', 'Vi dekker hele Vestfold — Tønsberg, Nøtterøy, Tjøme, Færder, Sandefjord, Horten, Holmestrand og Larvik. Vi er aldri langt unna.', 2),
    (faerder_id, 'home', 'faq', 'q', 'Når kan dere komme?', 3),
    (faerder_id, 'home', 'faq', 'a', 'Som regel innen 3–5 virkedager. Haster det? Bare ring oss på 968 23 647.', 3),
    (faerder_id, 'home', 'faq', 'q', 'Har dere garanti?', 4),
    (faerder_id, 'home', 'faq', 'a', 'Ja! Er du ikke fornøyd, kommer vi tilbake og fikser det — helt gratis. Så enkelt er det.', 4)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;

  -- Forsiden: CTA
  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'home', 'cta_final', 'title', 'La oss ta renholdet for deg', 0),
    (faerder_id, 'home', 'cta_final', 'body', 'Send en melding eller bare ring. Vi svarer samme dag — senest neste virkedag.', 0)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;


  -- ── OM OSS ──────────────────────────────────────────────
  UPDATE pages SET
    meta_title = 'Om oss — Lokalt i Vestfold siden 2020',
    meta_description = 'Vi er 11 ansatte som vasker i hele Vestfold. Godkjent, EV-sertifisert, og med siden 2020. Bli kjent med oss.'
  WHERE site_id = faerder_id AND slug = 'om-oss';

  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'om-oss', 'hero', 'eyebrow', 'Om oss', 0),
    (faerder_id, 'om-oss', 'hero', 'title', 'Om Færder Multiservice', 0),
    (faerder_id, 'om-oss', 'hero', 'subtitle', 'Vi har vasket i Vestfold siden 2020.', 0),

    (faerder_id, 'om-oss', 'historie', 'eyebrow', 'Vår historie', 0),
    (faerder_id, 'om-oss', 'historie', 'title', 'Slik startet det', 0),
    (faerder_id, 'om-oss', 'historie', 'paragraph', 'Vi startet i 2020 med en enkel idé: å vaske skikkelig og behandle folk ordentlig. Det gjør vi fortsatt.', 0),
    (faerder_id, 'om-oss', 'historie', 'paragraph', 'I dag er vi over 11 ansatte. Vi vasker for folk, bedrifter, borettslag og utbyggere i hele Vestfold — fra Holmestrand til Larvik.', 1),
    (faerder_id, 'om-oss', 'historie', 'paragraph', 'Vi gjør heller én jobb grundig enn ti halvveis. Vi er ikke fornøyde før du er det.', 2),
    (faerder_id, 'om-oss', 'historie', 'leader_name', 'Aleksandra', 0),
    (faerder_id, 'om-oss', 'historie', 'leader_title', 'Daglig leder', 0),
    (faerder_id, 'om-oss', 'historie', 'leader_image', '/images/aleksandra-portrett.webp', 0),

    (faerder_id, 'om-oss', 'verdier', 'eyebrow', 'Våre verdier', 0),
    (faerder_id, 'om-oss', 'verdier', 'title', 'Det vi står for', 0),
    (faerder_id, 'om-oss', 'verdier', 'card_title', 'Grundig, alltid', 0),
    (faerder_id, 'om-oss', 'verdier', 'card_text', 'Ingen snarveier. Ingen halvgjort jobb. Sånn er det bare.', 0),
    (faerder_id, 'om-oss', 'verdier', 'card_title', 'Bra for miljøet', 1),
    (faerder_id, 'om-oss', 'verdier', 'card_text', 'Vi vasker med damp. Ingen sterke kjemikalier. Bra for deg og naturen.', 1),
    (faerder_id, 'om-oss', 'verdier', 'card_title', 'Lokalt og personlig', 2),
    (faerder_id, 'om-oss', 'verdier', 'card_text', 'Basert i Tønsberg. Kort reisevei, kjente fjes, personlig oppfølging.', 2),

    (faerder_id, 'om-oss', 'cta_final', 'title', 'Vil du vite mer?', 0),
    (faerder_id, 'om-oss', 'cta_final', 'body', 'Send oss en melding eller ring. Vi svarer samme dag — senest neste virkedag.', 0)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;


  -- ── KONTAKT ──────────────────────────────────────────────
  UPDATE pages SET
    meta_title = 'Kontakt oss — Gratis befaring',
    meta_description = 'Ta kontakt — vi gir deg gratis befaring og pris. Ring 968 23 647 eller send melding. Vi svarer samme dag — senest neste virkedag.'
  WHERE site_id = faerder_id AND slug = 'kontakt';

  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'kontakt', 'hero', 'eyebrow', 'Kontakt', 0),
    (faerder_id, 'kontakt', 'hero', 'title', 'Kontakt oss', 0),
    (faerder_id, 'kontakt', 'hero', 'subtitle', 'Vi svarer samme dag — senest neste virkedag.', 0),
    (faerder_id, 'kontakt', 'form', 'title', 'Skriv til oss', 0)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;


  -- ── JOBB ──────────────────────────────────────────────
  UPDATE pages SET
    meta_title = 'Jobb hos oss',
    meta_description = 'Bli med på laget! Vi er alltid på utkikk etter flinke folk. Godt miljø, god lønn og fleksible tider.'
  WHERE site_id = faerder_id AND slug = 'jobb';

  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'jobb', 'hero', 'eyebrow', 'Karriere', 0),
    (faerder_id, 'jobb', 'hero', 'title', 'Bli en del av teamet', 0),
    (faerder_id, 'jobb', 'hero', 'subtitle', 'Vi er alltid på utkikk etter flinke folk.', 0),

    (faerder_id, 'jobb', 'sitat', 'quote', 'Vi ønsker oss alltid nye og trivelige kollegaer i Færder Multiservice.', 0),
    (faerder_id, 'jobb', 'sitat', 'author', 'Aleksandra, daglig leder og eier', 0),

    (faerder_id, 'jobb', 'fordeler', 'eyebrow', 'Fordeler', 0),
    (faerder_id, 'jobb', 'fordeler', 'title', 'Hvorfor jobbe hos oss', 0),
    (faerder_id, 'jobb', 'fordeler', 'card_title', 'Godt miljø', 0),
    (faerder_id, 'jobb', 'fordeler', 'card_text', 'Vi er et tett team. God stemning og folk som bryr seg.', 0),
    (faerder_id, 'jobb', 'fordeler', 'card_title', 'God lønn', 1),
    (faerder_id, 'jobb', 'fordeler', 'card_text', 'Vi betaler godt. Gjør du en bra jobb, merker du det.', 1),
    (faerder_id, 'jobb', 'fordeler', 'card_title', 'Fleksible tider', 2),
    (faerder_id, 'jobb', 'fordeler', 'card_text', 'Vi finner tider som passer. Hverdagen skal gå opp.', 2),

    (faerder_id, 'jobb', 'soknad', 'eyebrow', 'Søk', 0),
    (faerder_id, 'jobb', 'soknad', 'title', 'Høres bra ut? Si hei!', 0)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;


  -- ── PRISLISTE ──────────────────────────────────────────
  UPDATE pages SET
    meta_title = 'Priser — Renhold i Vestfold',
    meta_description = 'Se priser for fast vask, flyttevask, kontorvask, byggvask og mer. Ingen skjulte kostnader. Få et uforpliktende tilbud i dag.'
  WHERE site_id = faerder_id AND slug = 'prisliste';

  INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order) VALUES
    (faerder_id, 'prisliste', 'hero', 'eyebrow', 'Priser', 0),
    (faerder_id, 'prisliste', 'hero', 'title', 'Hva koster det?', 0),
    (faerder_id, 'prisliste', 'hero', 'subtitle', 'Her ser du prisene våre. Ingen skjulte kostnader — du vet hva du betaler.', 0),
    (faerder_id, 'prisliste', 'disclaimer', 'text', 'Alle priser er inkl. mva. Endelig pris avhenger av boligens størrelse og tilstand.', 0),
    (faerder_id, 'prisliste', 'cta_final', 'title', 'Vil du ha en nøyaktig pris?', 0),
    (faerder_id, 'prisliste', 'cta_final', 'body', 'Send oss en melding eller ring. Vi gir deg et tilbud samme dag — senest neste virkedag.', 0)
  ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;

END $$;
