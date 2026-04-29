-- ============================================================
-- Fase 5: Services (Færder)
-- Tabell + seed for alle 9 tjenester.
-- Idempotent. Forutsetter fase 1.
-- ============================================================

CREATE TABLE IF NOT EXISTS services (
  id                    uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id               uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug                  text          NOT NULL,
  name                  text          NOT NULL,
  short_description     text          DEFAULT '' NOT NULL,
  long_description      text          DEFAULT '' NOT NULL,
  price_label           text          DEFAULT '' NOT NULL,
  icon                  text,
  image_url             text,
  included              jsonb         DEFAULT '[]'::jsonb NOT NULL,    -- string[]
  frequencies           jsonb         DEFAULT '[]'::jsonb NOT NULL,    -- [{id,label,sublabel,price,period,popular}]
  steps                 jsonb         DEFAULT '[]'::jsonb NOT NULL,    -- [{title,description}]
  faq                   jsonb         DEFAULT '[]'::jsonb NOT NULL,    -- [{question,answer}]
  coverage_text         text          DEFAULT '' NOT NULL,
  seo_title             text,
  seo_description       text,
  sort_order            integer       DEFAULT 0 NOT NULL,
  visible_on_homepage   boolean       DEFAULT true NOT NULL,
  visible_on_pricelist  boolean       DEFAULT true NOT NULL,
  published             boolean       DEFAULT true NOT NULL,
  created_at            timestamptz   DEFAULT now() NOT NULL,
  updated_at            timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS services_site_id_idx ON services(site_id, sort_order);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads services" ON services;
CREATE POLICY "Public reads services" ON services FOR SELECT USING (published);

DROP POLICY IF EXISTS "Site users write services" ON services;
CREATE POLICY "Site users write services" ON services FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS services_touch_updated_at ON services;
CREATE TRIGGER services_touch_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- Seed alle 9 tjenester
DO $$
DECLARE faerder_id uuid;
BEGIN
  SELECT id INTO faerder_id FROM sites WHERE slug = 'faerder';
  IF faerder_id IS NULL THEN RETURN; END IF;

  -- 1. FAST VASK
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'fast-vask', 'Fast vask',
    'Vi kommer fast — du slipper å tenke på det.',
    'Vi tar oss av vasken, så slipper du. Samme team kommer hver gang, og de lærer seg hjemmet ditt fort. Du velger selv hvor ofte — ukentlig, annenhver uke eller månedlig. Vi er godkjent av Arbeidstilsynet og med i NHO.',
    'Fra 550 kr', 'Sparkles', '/images/tjenester/fast-vask.webp',
    $j$["Støvtørking av alle møbler, lister, vinduskarmer, pyntegjenstander, lamper og bilder","Vask av sofabord og spisestuebord","Støvsuging av sofa, stoler, tepper og gulv","Vask av gulv med våt/fuktig mopp (tilpasset type gulv)","Vask av speil","Sjekk og vask av dør og dørkarmer","Vask av kjøkkenfronter og alle utvendige flater (kjøkkenbenk, koketopp, vifte, kjøleskapsdør, ovnsdør, oppvaskmaskin) og veggen over kjøkkenbenken","Skuring av kjøkkenvask","Vask av dusjkabinett, servant, toalett og badekar","Vask av skapfronter på badet"]$j$::jsonb,
    $j$[{"id":"weekly","label":"Ukentlig","sublabel":"Spar 15 %","price":"Fra 470","period":"kr/gang","popular":true},{"id":"biweekly","label":"Annenhver uke","sublabel":"Standard","price":"Fra 550","period":"kr/gang"},{"id":"monthly","label":"Månedlig","sublabel":"Vedlikehold","price":"Fra 630","period":"kr/gang"},{"id":"once","label":"Engangsvask","sublabel":"Kun én gang","price":"Fra 690","period":"kr"}]$j$::jsonb,
    $j$[{"title":"Si hva du trenger","description":"Fortell oss om boligen og hvor ofte du vil ha vask."},{"title":"Vi gir deg en pris","description":"Du får et prisanslag med en gang, og fast pris etter befaring."},{"title":"Vi fikser resten","description":"Samme team hver gang, til avtalt tid."}]$j$::jsonb,
    $j$[{"question":"Hvor ofte kan dere komme?","answer":"Ukentlig, annenhver uke, eller månedlig. Du bestemmer selv hva som passer."},{"question":"Er det de samme som kommer hver gang?","answer":"Ja! Samme team hver gang. De blir kjent med hjemmet ditt og vet hva du liker."},{"question":"Hva om jeg vil avlyse en gang?","answer":"Bare gi beskjed 24 timer før, så flytter vi vasken. Ingen ekstra kostnad."},{"question":"Hva med ekstra vask?","answer":"Vi kan ta vinduer, innvendig i skap, stryking, klesvask og mer. Bare si ifra."}]$j$::jsonb,
    'Vi vasker fast i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold. Vi er aldri langt unna.',
    'Fast vaskehjelp i Vestfold · Fra 550 kr/gang',
    'Fast vaskehjelp i Tønsberg og Vestfold. Vi kommer fast — du slipper å tenke på det. Godkjent og NHO-medlem. Få tilbud i dag.',
    0, true, true
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 2. FLYTTEVASK
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'flyttevask', 'Flyttevask',
    'Grundig utvask med garanti. Du slipper å tenke på det.',
    'Vi har gjort hundrevis av flyttevasker. Er ikke utleier fornøyd? Vi kommer tilbake og fikser det — gratis. Vi henter og leverer nøkkel, så du trenger ikke være hjemme.',
    'Fra 3 500 kr', 'Truck', '/images/tjenester/flyttevask.webp',
    $j$["Tørrmopping av alle tak og lister","Veggmopping i alle rom","Skrubbing av baderomsvegger","Grundig vask og desinfisering av servant, dusjkabinett, toalett og badekar","Fullstendig kjøkkenvask med innvendig vask av hvitevarer","Innvendig og utvendig skapvask","Innvendig og utvendig vindusvask med karmvask","Desinfisering av knotter, håndtak og kontakter","Avtrekksvifter og taklampevask","Vask av dører og karmer på alle sider"]$j$::jsonb,
    $j$[{"id":"once","label":"Hybel / liten leilighet","sublabel":"Under 50 m²","price":"3 500","period":"kr","popular":true},{"id":"medium","label":"Leilighet","sublabel":"50–80 m²","price":"4 500","period":"kr"},{"id":"large","label":"Hus / stor bolig","sublabel":"120+ m²","price":"Fra 9 000","period":"kr"}]$j$::jsonb,
    $j$[{"title":"Si ifra","description":"Fortell oss størrelse, antall rom og når du skal flytte."},{"title":"Du får fast pris","description":"Ingen overraskelser. Du vet hva det koster på forhånd."},{"title":"Vi fikser alt","description":"Grundig vask fra gulv til tak. Vi henter nøkkel."}]$j$::jsonb,
    $j$[{"question":"Hva koster flyttevask?","answer":"Det kommer an på størrelsen. En vanlig leilighet (50–80 m²) koster typisk 4 500–7 000 kr. Du får alltid fast pris på forhånd."},{"question":"Hvor lang tid tar det?","answer":"En vanlig leilighet tar 4–6 timer. Større boliger kan ta en hel dag."},{"question":"Garanterer dere godkjent utvask?","answer":"Ja! Er ikke utleier fornøyd, kommer vi tilbake og fikser det — gratis."},{"question":"Kan dere hente nøkkel?","answer":"Klart! Vi henter og leverer nøkkel mellom 8 og 18. Du trenger ikke være hjemme."}]$j$::jsonb,
    'Vi gjør flyttevask i Tønsberg, Nøtterøy, Sandefjord og hele Vestfold. Ofte ledig innen 2–3 dager.',
    'Flyttevask i Tønsberg & Vestfold · 100 % fornøydgaranti',
    'Flyttevask i Tønsberg og Vestfold fra 3 500 kr. Grundig utvask med garanti. Vi henter nøkkel. Bestill i dag.',
    1, true, true
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 3. KONTORVASK
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'kontorvask', 'Kontorvask',
    'Rene kontorer, fornøyde ansatte. Fast avtale.',
    'Rent kontor = bedre arbeidsmiljø. Vi lager en avtale som passer din bedrift. Du får en fast kontaktperson som kjenner lokalene, og skriftlig avtale med garanti.',
    'Etter avtale', 'Building2', '/images/tjenester/kontorvask.webp',
    $j$["Rengjøring av kontorplasser og arbeidsstasjoner","Fellesarealer og møterom","Kjøkken, kantine og spiserom","Toaletter og sanitærrom med etterfylling av såpe og papir","Støvsuging og mopping av alle gulv","Søppeltømming og kildesortering","Vindusvask etter avtale","Gulvpolering ved behov"]$j$::jsonb,
    $j$[{"id":"daily","label":"Daglig","sublabel":"5 dager/uke","price":"Avtale","period":""},{"id":"thrice","label":"2–3 ganger/uke","sublabel":"Mest vanlig","price":"Avtale","period":"","popular":true},{"id":"weekly","label":"Ukentlig","sublabel":"1 gang/uke","price":"Avtale","period":""}]$j$::jsonb,
    $j$[{"title":"Vi tar en titt","description":"Vi kommer og ser på lokalene. Helt gratis."},{"title":"Du får et tilbud","description":"Skriftlig avtale med fast pris. Rett frem."},{"title":"Vi holder det rent","description":"Samme folk, uke etter uke. Stabil kvalitet."}]$j$::jsonb,
    $j$[{"question":"Kan dere komme utenom arbeidstid?","answer":"Klart det. Kveld eller tidlig morgen — vi tilpasser oss så det ikke forstyrrer dere."},{"question":"Hvor ofte bør et kontor vaskes?","answer":"De fleste trenger 2–5 ganger i uka. Vi finner ut hva som passer."},{"question":"Har dere bedriftsforsikring?","answer":"Ja — full forsikring, MVA-registrert, og du får en fast kontaktperson."}]$j$::jsonb,
    'Vi vasker kontorer i Tønsberg, Nøtterøy, Sandefjord, Horten og hele Vestfold.',
    'Kontorvask i Vestfold · Bedriftsrenhold',
    'Kontorvask og bedriftsrenhold i Vestfold. Fast avtale, fast kontaktperson. Garanti. Få tilbud gratis.',
    2, true, true
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 4. BYGGVASK
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'byggvask', 'Byggvask',
    'Vi fjerner byggstøvet. Grundig og skikkelig.',
    'Byggstøv setter seg overalt. Vi tar alt — grundig — så du ikke ser spor etter håndverkerne. Er du ikke fornøyd, kommer vi tilbake gratis. Vi henter nøkkel om du trenger det.',
    'Fra 5 000 kr', 'HardHat', '/images/tjenester/byggvask.webp',
    $j$["Innvendig og utvendig vindusvask med karmvask","Tørrmopping av tak","Vegg- og kontaktvask","Gulvstøvsuging og vask","Vask av dører og karmer på alle sider","Trapper, fotlister, rekkverk og glassrekkverk","Innvendig og utvendig skapvask (kjøkken og bad)","Rengjøring av alle sanitærinstallasjoner","Speil- og skapvask"]$j$::jsonb,
    $j$[{"id":"small","label":"Liten jobb","sublabel":"Under 80 m²","price":"5 000","period":"kr","popular":true},{"id":"medium","label":"Mellomstor","sublabel":"80–150 m²","price":"8 000","period":"kr"},{"id":"large","label":"Stor jobb","sublabel":"150+ m²","price":"Fra 14 000","period":"kr"}]$j$::jsonb,
    $j$[{"title":"Fortell oss om jobben","description":"Hva er bygget, og hvor mye støv snakker vi om?"},{"title":"Vi ser på det","description":"Vi kommer og gir deg en fast pris."},{"title":"Vi fikser det","description":"Grundig vask så alt er klart til bruk."}]$j$::jsonb,
    $j$[{"question":"Når bør byggvask gjøres?","answer":"Etter at håndverkerne er ferdige, men før møblene kommer inn."},{"question":"Trenger vi flere runder?","answer":"Én runde holder som regel. Mye støv? Da tar vi to omganger."},{"question":"Kan dere ta hele bygget?","answer":"Ja — alt fra leiligheter til næringsbygg. Nybygg, renovering og tilbygg."}]$j$::jsonb,
    'Vi utfører byggvask i hele Vestfold — fra Holmestrand i nord til Larvik i sør. Tar prosjekter av alle størrelser.',
    'Byggvask i Vestfold · 100 % fornøydgaranti',
    'Byggvask i Vestfold fra 5 000 kr. Vi fjerner byggstøvet grundig. Garanti. Få tilbud i dag.',
    3, true, true
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 5. SPESIALVASK
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'spesialvask', 'Spesialvask',
    'Vinduer, tepper og møbler. Vi tar det du ikke gidder.',
    'Gruer du deg til vindusvask? Vi tar det gjerne. Rene vinduer gir masse dagslys, og vi gjør tepperens og møbelrens også. Bare si hva du trenger.',
    'Fra 400 kr', 'Wind', '/images/tjenester/spesialvask.webp',
    $j$["Rengjøring av alle glasstyper","Innvendig og utvendig glassfasadevask","Glassrekkverk og glassvegg","Speil og glasspartier","Tepperens og møbelrens","Impregnering ved behov"]$j$::jsonb,
    $j$[{"id":"windows","label":"Vindusvask","sublabel":"Inn- og utvendig","price":"Fra 800","period":"kr","popular":true},{"id":"carpet","label":"Tepperens","sublabel":"Per teppe","price":"Fra 400","period":"kr"},{"id":"furniture","label":"Møbelrens","sublabel":"Per møbel","price":"Fra 600","period":"kr"}]$j$::jsonb,
    $j$[{"title":"Fortell oss hva du trenger","description":"Vinduer? Tepper? Møbler? Vi finner ut av det."},{"title":"Du får en pris","description":"Fast pris basert på jobben. Ingen overraskelser."},{"title":"Vi fikser det","description":"Ordentlig utført med riktig utstyr."}]$j$::jsonb,
    $j$[{"question":"Vasker dere vinduer i høyden?","answer":"Ja, vi tar vinduer opptil 3. etasje."},{"question":"Hvor ofte bør vinduer vaskes?","answer":"Minst 2 ganger i året — vår og høst. Da merker du forskjell."},{"question":"Kan dere rense møbler og tepper?","answer":"Ja! Vi har riktig utstyr og bruker skånsomme midler."}]$j$::jsonb,
    'Vi gjør spesialvask og vindusvask i Tønsberg, Nøtterøy, Tjøme og hele Vestfold.',
    'Spesialvask i Vestfold · Vindusvask & tepperens',
    'Vindusvask og spesialvask i Vestfold fra 400 kr. Vi tar det du ikke gidder. Ring for tilbud.',
    4, true, true
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 6. LUKTSANERING
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'luktsanering', 'Luktsanering',
    'Vi fjerner vond lukt. Skikkelig, ikke bare skjuler den.',
    'Vond lukt blir bare verre om du lar den stå. Vi finner kilden og fjerner den ordentlig — ikke bare dekker over. Vi samarbeider med Inneklimaspesialisten og EV Of Norway — sertifiserte partnere innen inneklima og luktsanering — og bruker flere metoder for å få det helt bort.',
    'Fra 3 000 kr', 'Droplets', '/images/tjenester/luktsanering.webp',
    $j$["Kartlegging og eliminering av luktkilde","Behandling av berørte overflater","Ozonsanering ved behov","Tekstilbehandling","Samarbeid med Inneklimaspesialisten og EV Of Norway (sertifiserte inneklima-partnere)","Oppfølging og kontroll"]$j$::jsonb,
    $j$[{"id":"room","label":"Enkeltrom","sublabel":"1–2 rom","price":"3 000","period":"kr"},{"id":"apartment","label":"Flere rom","sublabel":"Delvis bolig","price":"5 000","period":"kr","popular":true},{"id":"house","label":"Hele boligen","sublabel":"Full behandling","price":"Fra 8 000","period":"kr"}]$j$::jsonb,
    $j$[{"title":"Vi tar en titt","description":"Vi finner kilden til lukten."},{"title":"Du får en plan","description":"Du vet hva vi gjør og hva det koster."},{"title":"Vi fjerner lukten","description":"Grundig behandling til lukten er helt borte."}]$j$::jsonb,
    $j$[{"question":"Hva slags lukt kan dere fjerne?","answer":"Røyk, kjæledyr, fukt, mugg, brann — du nevner det. Vi fikser det."},{"question":"Hvor lang tid tar det?","answer":"Vanligvis 1–3 dager. Vi gir deg et estimat etter at vi har sett på det."},{"question":"Hvilke metoder bruker dere?","answer":"Ozon, tekstilbehandling, ventilasjonssanering — vi bruker det som trengs. Vi samarbeider med Inneklimaspesialisten og EV Of Norway — sertifiserte partnere innen inneklima og luktsanering."}]$j$::jsonb,
    'Vi gjør luktsanering i hele Vestfold. Ofte ledig innen få dager.',
    'Luktsanering i Vestfold · Fjern vond lukt',
    'Luktsanering i Vestfold fra 3 000 kr. Vi fjerner lukten ordentlig. Ring for befaring.',
    5, true, true
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 7. HOVEDRENGJØRING
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'hovedrengjoring', 'Hovedrengjøring',
    'Skikkelig grundig vask. Alt fra topp til bunn.',
    'Noen ganger trenger hjemmet en skikkelig omgang. Vi tar alt — innvendig i skap, bak møbler, stekeovn, kjøleskap, fliser. Det hele. Fint å gjøre 1–2 ganger i året.',
    'Fra 1 100 kr', 'Home', '/images/tjenester/hovedrengjoring.webp',
    $j$["Alt i standard vask, pluss:","Innvendig rengjøring av skap og skuffer","Bak og under møbler og hvitevarer","Grundig rengjøring av bad og fliser","Stekeovn, kjøleskap og fryser innvendig","Vinduskarmer og alle lister","Flekk-fjerning på gulv","Vegg- og takvask ved behov"]$j$::jsonb,
    $j$[{"id":"once","label":"Engangsvask","sublabel":"Grundig dyprengjøring","price":"Fra 1 100","period":"kr","popular":true},{"id":"seasonal","label":"Sesongvask","sublabel":"2 ganger/år","price":"Fra 1 000","period":"kr/gang"}]$j$::jsonb,
    $j$[{"title":"Fortell oss hva du vil ha fokus på","description":"Boligstørrelse og hva som trenger ekstra kjærlighet."},{"title":"Du får fast pris","description":"Basert på størrelse og omfang. Ingen overraskelser."},{"title":"Vi tar alt fra topp til bunn","description":"Grundig dypvask. Du kjenner forskjellen."}]$j$::jsonb,
    $j$[{"question":"Hva er forskjellen på vanlig vask og hovedrengjøring?","answer":"Vi går mye grundigere. Innvendig i skap, bak møbler, ordentlig på bad og kjøkken — alt det du ellers hopper over."},{"question":"Hvor lang tid tar det?","answer":"En vanlig leilighet tar 5–8 timer. Større boliger kan ta en hel dag."},{"question":"Hvor ofte bør man ha hovedrengjøring?","answer":"1–2 ganger i året holder fint. Vår og høst er populært."}]$j$::jsonb,
    'Vi gjør hovedrengjøring i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold.',
    'Hovedrengjøring i Vestfold · Dyprengjøring',
    'Hovedrengjøring i Tønsberg og Vestfold fra 1 100 kr. Grundig fra topp til bunn. Bestill i dag.',
    6, false, false
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 8. VISNINGSVASK
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'visningsvask', 'Visningsvask',
    'Boligen din klar for visning. Godt førsteinntrykk.',
    'Førsteinntrykket teller. En skikkelig vask før visning gjør boligen innbydende — og kan faktisk øke salgsprisen. Vi er alltid ferdige i god tid.',
    'Fra 900 kr', 'Eye', '/images/tjenester/visningsvask.webp',
    $j$["Grundig rengjøring av alle synlige flater","Ekstra fokus på bad og kjøkken","Vindusvask innvendig","Gulvvask og polering","Støvfjerning og rydding","Klar for fotografering og visning"]$j$::jsonb,
    $j$[{"id":"small","label":"Hybel / liten leilighet","sublabel":"Under 50 m²","price":"Fra 900","period":"kr","popular":true},{"id":"medium","label":"Leilighet","sublabel":"50–80 m²","price":"Fra 1 500","period":"kr"},{"id":"large","label":"Hus / stor bolig","sublabel":"120+ m²","price":"Fra 2 800","period":"kr"}]$j$::jsonb,
    $j$[{"title":"Si ifra","description":"Boligtype, størrelse og når visningen er."},{"title":"Du får fast pris","description":"Ingen overraskelser. Rett frem."},{"title":"Vi gjør den klar","description":"Boligen skinner til visning og foto."}]$j$::jsonb,
    $j$[{"question":"Hvor tidlig bør jeg bestille?","answer":"Helst 3–5 dager før. Haster det? Bare ring — vi prøver alltid å få det til."},{"question":"Kan dere komme samme dag som visningen?","answer":"Ja! Vi er ferdige i god tid før folk kommer."},{"question":"Hva med hastebestilling?","answer":"Vi fikser haste-jobb innen 24 timer mot et tillegg. Ring oss direkte."}]$j$::jsonb,
    'Vi gjør visningsvask i Tønsberg, Nøtterøy, Sandefjord og hele Vestfold. Vi vet at visningsdatoer ikke venter.',
    'Visningsvask i Vestfold · Klar for visning',
    'Visningsvask i Vestfold fra 900 kr. Boligen klar for visning. Godt førsteinntrykk. Bestill i dag.',
    7, false, false
  ) ON CONFLICT (site_id, slug) DO NOTHING;

  -- 9. BORETTSLAG
  INSERT INTO services (site_id, slug, name, short_description, long_description, price_label, icon, image_url, included, frequencies, steps, faq, coverage_text, seo_title, seo_description, sort_order, visible_on_homepage, visible_on_pricelist) VALUES (
    faerder_id, 'borettslag', 'Borettslag',
    'Rene fellesarealer, fornøyde beboere. Fast avtale.',
    'Rene oppganger og fellesarealer gjør at folk trives. Vi tar trappevask, garasjer, vaskerom — alt det felles. Du får en fast kontaktperson og skriftlig avtale.',
    'Månedlig avtale', 'Users', '/images/tjenester/borettslag.webp',
    $j$["Trappevask og fellesganger","Inngangsparti og vindfang","Vaskerom og tørkerom","Garasje og bodområder","Søppelrom","Vindusvask i fellesarealer","Sesongbasert tillegg (sandkasser, uteområder)"]$j$::jsonb,
    $j$[{"id":"weekly","label":"Ukentlig","sublabel":"Mest vanlig","price":"Avtale","period":"","popular":true},{"id":"biweekly","label":"Annenhver uke","sublabel":"Budsjettvenlig","price":"Avtale","period":""},{"id":"monthly","label":"Månedlig","sublabel":"Minimum","price":"Avtale","period":""}]$j$::jsonb,
    $j$[{"title":"Vi tar en titt","description":"Vi ser på fellesarealene og finner ut hva som trengs."},{"title":"Dere får en avtale","description":"Fast månedspris, fast kontaktperson. Enkelt."},{"title":"Vi holder det rent","description":"Uke etter uke, hele året."}]$j$::jsonb,
    $j$[{"question":"Hvor ofte bør fellesarealer vaskes?","answer":"De fleste trenger ukentlig trappevask. Vi finner ut hva som passer budsjettet."},{"question":"Kan vi få tilbud for hele borettslaget?","answer":"Klart! Send oss antall oppganger og etasjer, så gir vi en totalpris."},{"question":"Tilbyr dere snømåking?","answer":"Ja — vi tar snømåking som tillegg til renholdsavtalen om vinteren."}]$j$::jsonb,
    'Vi vasker for borettslag og sameier i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold.',
    'Borettslag renhold i Vestfold · Fast avtale',
    'Renhold for borettslag i Vestfold. Trappevask og fellesarealer. Fast avtale. Få tilbud.',
    8, false, false
  ) ON CONFLICT (site_id, slug) DO NOTHING;

END $$;
