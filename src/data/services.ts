export interface FrequencyOption {
  id: string;
  label: string;
  sublabel: string;
  price: string;
  period: string;
  popular?: boolean;
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  icon: string;
  image: string;
  included: string[];
  frequencies: FrequencyOption[];
  steps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  coverageText: string;
  seoTitle: string;
  seoDescription: string;
}

export const services: Service[] = [
  {
    slug: "fast-vask",
    name: "Fast vask",
    description: "Vi kommer fast — du slipper å tenke på det.",
    image: "/images/tjenester/fast-vask.webp",
    longDescription:
      "Vi tar oss av vasken, så slipper du. Samme team kommer hver gang, og de lærer seg hjemmet ditt fort. Du velger selv hvor ofte — ukentlig, annenhver uke eller månedlig. Vi er godkjent av Arbeidstilsynet og med i NHO.",
    price: "Fra 550 kr",
    icon: "Sparkles",
    frequencies: [
      { id: "weekly", label: "Ukentlig", sublabel: "Spar 15 %", price: "Fra 470", period: "kr/gang", popular: true },
      { id: "biweekly", label: "Annenhver uke", sublabel: "Standard", price: "Fra 550", period: "kr/gang" },
      { id: "monthly", label: "Månedlig", sublabel: "Vedlikehold", price: "Fra 630", period: "kr/gang" },
      { id: "once", label: "Engangsvask", sublabel: "Kun én gang", price: "Fra 690", period: "kr" },
    ],
    included: [
      "Støvtørking av alle møbler, lister, vinduskarmer, pyntegjenstander, lamper og bilder",
      "Vask av sofabord og spisestuebord",
      "Støvsuging av sofa, stoler, tepper og gulv",
      "Vask av gulv med våt/fuktig mopp (tilpasset type gulv)",
      "Vask av speil",
      "Sjekk og vask av dør og dørkarmer",
      "Vask av kjøkkenfronter og alle utvendige flater (kjøkkenbenk, koketopp, vifte, kjøleskapsdør, ovnsdør, oppvaskmaskin) og veggen over kjøkkenbenken",
      "Skuring av kjøkkenvask",
      "Vask av dusjkabinett, servant, toalett og badekar",
      "Vask av skapfronter på badet",
    ],
    steps: [
      { title: "Si hva du trenger", description: "Fortell oss om boligen og hvor ofte du vil ha vask." },
      { title: "Vi gir deg en pris", description: "Fast pris basert på størrelse. Ingen overraskelser." },
      { title: "Vi fikser resten", description: "Samme team hver gang, til avtalt tid." },
    ],
    faq: [
      { question: "Hvor ofte kan dere komme?", answer: "Ukentlig, annenhver uke, eller månedlig. Du bestemmer selv hva som passer." },
      { question: "Er det de samme som kommer hver gang?", answer: "Ja! Samme team hver gang. De blir kjent med hjemmet ditt og vet hva du liker." },
      { question: "Hva om jeg vil avlyse en gang?", answer: "Bare gi beskjed 24 timer før, så flytter vi vasken. Ingen ekstra kostnad." },
      { question: "Hva med ekstra vask?", answer: "Vi kan ta vinduer, innvendig i skap, stryking, klesvask og mer. Bare si ifra." },
    ],
    coverageText:
      "Vi vasker fast i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold. Vi er aldri langt unna.",
    seoTitle: "Fast vaskehjelp i Vestfold · Fra 550 kr/gang",
    seoDescription:
      "Fast vaskehjelp i Tønsberg og Vestfold. Vi kommer fast — du slipper å tenke på det. Godkjent og NHO-medlem. Få tilbud i dag.",
  },
  {
    slug: "flyttevask",
    name: "Flyttevask",
    description: "Grundig utvask med garanti. Du slipper å tenke på det.",
    image: "/images/tjenester/flyttevask.webp",
    longDescription:
      "Vi har gjort hundrevis av flyttevasker. Er ikke utleier fornøyd? Vi kommer tilbake og fikser det — gratis. Vi henter og leverer nøkkel, så du trenger ikke være hjemme.",
    price: "Fra 3 500 kr",
    icon: "Truck",
    frequencies: [
      { id: "once", label: "Hybel / liten leilighet", sublabel: "Under 50 m²", price: "3 500", period: "kr", popular: true },
      { id: "medium", label: "Leilighet", sublabel: "50–80 m²", price: "4 500", period: "kr" },
      { id: "large", label: "Hus / stor bolig", sublabel: "120+ m²", price: "Fra 9 000", period: "kr" },
    ],
    included: [
      "Tørrmopping av alle tak og lister",
      "Veggmopping i alle rom",
      "Skrubbing av baderomsvegger",
      "Grundig vask og desinfisering av servant, dusjkabinett, toalett og badekar",
      "Fullstendig kjøkkenvask med innvendig vask av hvitevarer",
      "Innvendig og utvendig skapvask",
      "Innvendig og utvendig vindusvask med karmvask",
      "Desinfisering av knotter, håndtak og kontakter",
      "Avtrekksvifter og taklampevask",
      "Tresiders dør- og karmvask",
    ],
    steps: [
      { title: "Si ifra", description: "Fortell oss størrelse, antall rom og når du skal flytte." },
      { title: "Du får fast pris", description: "Ingen overraskelser. Du vet hva det koster på forhånd." },
      { title: "Vi fikser alt", description: "Grundig vask fra gulv til tak. Vi henter nøkkel." },
    ],
    faq: [
      { question: "Hva koster flyttevask?", answer: "Det kommer an på størrelsen. En vanlig leilighet (50–80 m²) koster typisk 4 500–7 000 kr. Du får alltid fast pris på forhånd." },
      { question: "Hvor lang tid tar det?", answer: "En vanlig leilighet tar 4–6 timer. Større boliger kan ta en hel dag." },
      { question: "Garanterer dere godkjent utvask?", answer: "Ja! Er ikke utleier fornøyd, kommer vi tilbake og fikser det — gratis." },
      { question: "Kan dere hente nøkkel?", answer: "Klart! Vi henter og leverer nøkkel mellom 8 og 18. Du trenger ikke være hjemme." },
    ],
    coverageText:
      "Vi gjør flyttevask i Tønsberg, Nøtterøy, Sandefjord og hele Vestfold. Ofte ledig innen 2–3 dager.",
    seoTitle: "Flyttevask i Tønsberg & Vestfold · 100 % fornøydgaranti",
    seoDescription:
      "Flyttevask i Tønsberg og Vestfold fra 3 500 kr. Grundig utvask med garanti. Vi henter nøkkel. Bestill i dag.",
  },
  {
    slug: "kontorvask",
    name: "Kontorvask",
    description: "Rene kontorer, fornøyde ansatte. Fast avtale.",
    image: "/images/tjenester/kontorvask.webp",
    longDescription:
      "Rent kontor = bedre arbeidsmiljø. Vi lager en avtale som passer din bedrift. Du får en fast kontaktperson som kjenner lokalene, og skriftlig avtale med garanti.",
    price: "Etter avtale",
    icon: "Building2",
    frequencies: [
      { id: "daily", label: "Daglig", sublabel: "5 dager/uke", price: "Avtale", period: "" },
      { id: "thrice", label: "2–3 ganger/uke", sublabel: "Mest vanlig", price: "Avtale", period: "", popular: true },
      { id: "weekly", label: "Ukentlig", sublabel: "1 gang/uke", price: "Avtale", period: "" },
    ],
    included: [
      "Rengjøring av kontorplasser og arbeidsstasjoner",
      "Fellesarealer og møterom",
      "Kjøkken, kantine og spiserom",
      "Toaletter og sanitærrom med etterfylling av såpe og papir",
      "Støvsuging og mopping av alle gulv",
      "Søppeltømming og kildesortering",
      "Vindusvask etter avtale",
      "Gulvpolering ved behov",
    ],
    steps: [
      { title: "Vi tar en titt", description: "Vi kommer og ser på lokalene. Helt gratis." },
      { title: "Du får et tilbud", description: "Skriftlig avtale med fast pris. Rett frem." },
      { title: "Vi holder det rent", description: "Samme folk, uke etter uke. Stabil kvalitet." },
    ],
    faq: [
      { question: "Kan dere komme utenom arbeidstid?", answer: "Klart det. Kveld eller tidlig morgen — vi tilpasser oss så det ikke forstyrrer dere." },
      { question: "Hvor ofte bør et kontor vaskes?", answer: "De fleste trenger 2–5 ganger i uka. Vi finner ut hva som passer." },
      { question: "Har dere bedriftsforsikring?", answer: "Ja — full forsikring, MVA-registrert, og du får en fast kontaktperson." },
    ],
    coverageText:
      "Vi vasker kontorer i Tønsberg, Nøtterøy, Sandefjord, Horten og hele Vestfold.",
    seoTitle: "Kontorvask i Vestfold · Bedriftsrenhold",
    seoDescription:
      "Kontorvask og bedriftsrenhold i Vestfold. Fast avtale, fast kontaktperson. Garanti. Få tilbud gratis.",
  },
  {
    slug: "byggvask",
    name: "Byggvask",
    description: "Vi fjerner byggstøvet. Grundig og skikkelig.",
    image: "/images/tjenester/byggvask.webp",
    longDescription:
      "Byggstøv setter seg overalt. Vi tar alt — grundig — så du ikke ser spor etter håndverkerne. Er du ikke fornøyd, kommer vi tilbake gratis. Vi henter nøkkel om du trenger det.",
    price: "Fra 5 000 kr",
    icon: "HardHat",
    frequencies: [
      { id: "small", label: "Liten jobb", sublabel: "Under 80 m²", price: "5 000", period: "kr", popular: true },
      { id: "medium", label: "Mellomstor", sublabel: "80–150 m²", price: "8 000", period: "kr" },
      { id: "large", label: "Stor jobb", sublabel: "150+ m²", price: "Fra 14 000", period: "kr" },
    ],
    included: [
      "Innvendig og utvendig vindusvask med karmvask",
      "Tørrmopping av tak",
      "Vegg- og kontaktvask",
      "Gulvstøvsuging og vask",
      "Tresiders dør- og karmvask",
      "Trapper, fotlister, rekkverk og glassrekkverk",
      "Innvendig og utvendig skapvask (kjøkken og bad)",
      "Rengjøring av alle sanitærinstallasjoner",
      "Speil- og skapvask",
    ],
    steps: [
      { title: "Fortell oss om jobben", description: "Hva er bygget, og hvor mye støv snakker vi om?" },
      { title: "Vi ser på det", description: "Vi kommer og gir deg en fast pris." },
      { title: "Vi fikser det", description: "Grundig vask så alt er klart til bruk." },
    ],
    faq: [
      { question: "Når bør byggvask gjøres?", answer: "Etter at håndverkerne er ferdige, men før møblene kommer inn." },
      { question: "Trenger vi flere runder?", answer: "Én runde holder som regel. Mye støv? Da tar vi to omganger." },
      { question: "Kan dere ta hele bygget?", answer: "Ja — alt fra leiligheter til næringsbygg. Nybygg, renovering og tilbygg." },
    ],
    coverageText:
      "Vi utfører byggvask i hele Vestfold — fra Holmestrand i nord til Larvik i sør. Tar prosjekter av alle størrelser.",
    seoTitle: "Byggvask i Vestfold · 100 % fornøydgaranti",
    seoDescription:
      "Byggvask i Vestfold fra 5 000 kr. Vi fjerner byggstøvet grundig. Garanti. Få tilbud i dag.",
  },
  {
    slug: "spesialvask",
    name: "Spesialvask",
    description: "Vinduer, tepper og møbler. Vi tar det du ikke gidder.",
    image: "/images/tjenester/spesialvask.webp",
    longDescription:
      "Gruer du deg til vindusvask? Vi tar det gjerne. Rene vinduer gir masse dagslys, og vi gjør tepperens og møbelrens også. Bare si hva du trenger.",
    price: "Fra 800 kr",
    icon: "Wind",
    frequencies: [
      { id: "windows", label: "Vindusvask", sublabel: "Inn- og utvendig", price: "Fra 800", period: "kr", popular: true },
      { id: "carpet", label: "Tepperens", sublabel: "Per teppe", price: "Fra 400", period: "kr" },
      { id: "furniture", label: "Møbelrens", sublabel: "Per møbel", price: "Fra 600", period: "kr" },
    ],
    included: [
      "Rengjøring av alle glasstyper",
      "Innvendig og utvendig glassfasadevask",
      "Glassrekkverk og glassvegg",
      "Speil og glasspartier",
      "Tepperens og møbelrens",
      "Impregnering ved behov",
    ],
    steps: [
      { title: "Fortell oss hva du trenger", description: "Vinduer? Tepper? Møbler? Vi finner ut av det." },
      { title: "Du får en pris", description: "Fast pris basert på jobben. Ingen overraskelser." },
      { title: "Vi fikser det", description: "Ordentlig utført med riktig utstyr." },
    ],
    faq: [
      { question: "Vasker dere vinduer i høyden?", answer: "Ja, vi tar vinduer opptil 3. etasje." },
      { question: "Hvor ofte bør vinduer vaskes?", answer: "Minst 2 ganger i året — vår og høst. Da merker du forskjell." },
      { question: "Kan dere rense møbler og tepper?", answer: "Ja! Vi har riktig utstyr og bruker skånsomme midler." },
    ],
    coverageText:
      "Vi gjør spesialvask og vindusvask i Tønsberg, Nøtterøy, Tjøme og hele Vestfold.",
    seoTitle: "Spesialvask i Vestfold · Vindusvask & tepperens",
    seoDescription:
      "Vindusvask og spesialvask i Vestfold fra 800 kr. Vi tar det du ikke gidder. Ring for tilbud.",
  },
  {
    slug: "luktsanering",
    name: "Luktsanering",
    description: "Vi fjerner vond lukt. Skikkelig, ikke bare skjuler den.",
    image: "/images/tjenester/luktsanering.webp",
    longDescription:
      "Vond lukt blir bare verre om du lar den stå. Vi finner kilden og fjerner den ordentlig — ikke bare dekker over. Vi jobber med Inneklimaspesialisten og EV Of Norway, og bruker flere metoder for å få det helt bort.",
    price: "Fra 3 000 kr",
    icon: "Droplets",
    frequencies: [
      { id: "room", label: "Enkeltrom", sublabel: "1–2 rom", price: "3 000", period: "kr" },
      { id: "apartment", label: "Flere rom", sublabel: "Delvis bolig", price: "5 000", period: "kr", popular: true },
      { id: "house", label: "Hele boligen", sublabel: "Full behandling", price: "Fra 8 000", period: "kr" },
    ],
    included: [
      "Kartlegging og eliminering av luktkilde",
      "Behandling av berørte overflater",
      "Ozonsanering ved behov",
      "Tekstilbehandling",
      "Samarbeid med Inneklimaspesialisten",
      "Oppfølging og kontroll",
    ],
    steps: [
      { title: "Vi tar en titt", description: "Vi finner kilden til lukten." },
      { title: "Du får en plan", description: "Du vet hva vi gjør og hva det koster." },
      { title: "Vi fjerner lukten", description: "Grundig behandling til lukten er helt borte." },
    ],
    faq: [
      { question: "Hva slags lukt kan dere fjerne?", answer: "Røyk, kjæledyr, fukt, mugg, brann — du nevner det. Vi fikser det." },
      { question: "Hvor lang tid tar det?", answer: "Vanligvis 1–3 dager. Vi gir deg et estimat etter at vi har sett på det." },
      { question: "Hvilke metoder bruker dere?", answer: "Ozon, tekstilbehandling, ventilasjonssanering — vi bruker det som trengs. Vi jobber med Inneklimaspesialisten og EV Of Norway." },
    ],
    coverageText:
      "Vi gjør luktsanering i hele Vestfold. Ofte ledig innen få dager.",
    seoTitle: "Luktsanering i Vestfold · Fjern vond lukt",
    seoDescription:
      "Luktsanering i Vestfold fra 3 000 kr. Vi fjerner lukten ordentlig. Ring for befaring.",
  },
  {
    slug: "hovedrengjoring",
    name: "Hovedrengjøring",
    description: "Skikkelig grundig vask. Alt fra topp til bunn.",
    image: "/images/tjenester/hovedrengjoring.webp",
    longDescription:
      "Noen ganger trenger hjemmet en skikkelig omgang. Vi tar alt — innvendig i skap, bak møbler, stekeovn, kjøleskap, fliser. Det hele. Fint å gjøre 1–2 ganger i året.",
    price: "Fra 1 100 kr",
    icon: "Home",
    frequencies: [
      { id: "once", label: "Engangsvask", sublabel: "Grundig dyprengjøring", price: "Fra 1 100", period: "kr", popular: true },
      { id: "seasonal", label: "Sesongvask", sublabel: "2 ganger/år", price: "Fra 1 000", period: "kr/gang" },
    ],
    included: [
      "Alt i standard vask, pluss:",
      "Innvendig rengjøring av skap og skuffer",
      "Bak og under møbler og hvitevarer",
      "Grundig rengjøring av bad og fliser",
      "Stekeovn, kjøleskap og fryser innvendig",
      "Vinduskarmer og alle lister",
      "Flekk-fjerning på gulv",
      "Vegg- og takvask ved behov",
    ],
    steps: [
      { title: "Fortell oss hva du vil ha fokus på", description: "Boligstørrelse og hva som trenger ekstra kjærlighet." },
      { title: "Du får fast pris", description: "Basert på størrelse og omfang. Ingen overraskelser." },
      { title: "Vi tar alt fra topp til bunn", description: "Grundig dypvask. Du kjenner forskjellen." },
    ],
    faq: [
      { question: "Hva er forskjellen på vanlig vask og hovedrengjøring?", answer: "Vi går mye grundigere. Innvendig i skap, bak møbler, ordentlig på bad og kjøkken — alt det du ellers hopper over." },
      { question: "Hvor lang tid tar det?", answer: "En vanlig leilighet tar 5–8 timer. Større boliger kan ta en hel dag." },
      { question: "Hvor ofte bør man ha hovedrengjøring?", answer: "1–2 ganger i året holder fint. Vår og høst er populært." },
    ],
    coverageText:
      "Vi gjør hovedrengjøring i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold.",
    seoTitle: "Hovedrengjøring i Vestfold · Dyprengjøring",
    seoDescription:
      "Hovedrengjøring i Tønsberg og Vestfold fra 1 100 kr. Grundig fra topp til bunn. Bestill i dag.",
  },
  {
    slug: "visningsvask",
    name: "Visningsvask",
    description: "Boligen din klar for visning. Godt førsteinntrykk.",
    image: "/images/tjenester/visningsvask.webp",
    longDescription:
      "Førsteinntrykket teller. En skikkelig vask før visning gjør boligen innbydende — og kan faktisk øke salgsprisen. Vi er alltid ferdige i god tid.",
    price: "Fra 900 kr",
    icon: "Eye",
    frequencies: [
      { id: "small", label: "Hybel / liten leilighet", sublabel: "Under 50 m²", price: "Fra 900", period: "kr", popular: true },
      { id: "medium", label: "Leilighet", sublabel: "50–80 m²", price: "Fra 1 500", period: "kr" },
      { id: "large", label: "Hus / stor bolig", sublabel: "120+ m²", price: "Fra 2 800", period: "kr" },
    ],
    included: [
      "Grundig rengjøring av alle synlige flater",
      "Ekstra fokus på bad og kjøkken",
      "Vindusvask innvendig",
      "Gulvvask og polering",
      "Støvfjerning og rydding",
      "Klar for fotografering og visning",
    ],
    steps: [
      { title: "Si ifra", description: "Boligtype, størrelse og når visningen er." },
      { title: "Du får fast pris", description: "Ingen overraskelser. Rett frem." },
      { title: "Vi gjør den klar", description: "Boligen skinne til visning og foto." },
    ],
    faq: [
      { question: "Hvor tidlig bør jeg bestille?", answer: "Helst 3–5 dager før. Haster det? Bare ring — vi prøver alltid å få det til." },
      { question: "Kan dere komme samme dag som visningen?", answer: "Ja! Vi er ferdige i god tid før folk kommer." },
      { question: "Hva med hastebestilling?", answer: "Vi fikser haste-jobb innen 24 timer mot et tillegg. Ring oss direkte." },
    ],
    coverageText:
      "Vi gjør visningsvask i Tønsberg, Nøtterøy, Sandefjord og hele Vestfold. Vi vet at visningsdatoer ikke venter.",
    seoTitle: "Visningsvask i Vestfold · Klar for visning",
    seoDescription:
      "Visningsvask i Vestfold fra 900 kr. Boligen klar for visning. Godt førsteinntrykk. Bestill i dag.",
  },
  {
    slug: "borettslag",
    name: "Borettslag",
    description: "Rene fellesarealer, fornøyde beboere. Fast avtale.",
    image: "/images/tjenester/borettslag.webp",
    longDescription:
      "Rene oppganger og fellesarealer gjør at folk trives. Vi tar trappevask, garasjer, vaskerom — alt det felles. Du får en fast kontaktperson og skriftlig avtale.",
    price: "Månedlig avtale",
    icon: "Users",
    frequencies: [
      { id: "weekly", label: "Ukentlig", sublabel: "Mest vanlig", price: "Avtale", period: "", popular: true },
      { id: "biweekly", label: "Annenhver uke", sublabel: "Budsjettvenlig", price: "Avtale", period: "" },
      { id: "monthly", label: "Månedlig", sublabel: "Minimum", price: "Avtale", period: "" },
    ],
    included: [
      "Trappevask og fellesganger",
      "Inngangsparti og vindfang",
      "Vaskerom og tørkerom",
      "Garasje og bodområder",
      "Søppelrom",
      "Vindusvask i fellesarealer",
      "Sesongbasert tillegg (sandkasser, uteområder)",
    ],
    steps: [
      { title: "Vi tar en titt", description: "Vi ser på fellesarealene og finner ut hva som trengs." },
      { title: "Dere får en avtale", description: "Fast månedspris, fast kontaktperson. Enkelt." },
      { title: "Vi holder det rent", description: "Uke etter uke, hele året." },
    ],
    faq: [
      { question: "Hvor ofte bør fellesarealer vaskes?", answer: "De fleste trenger ukentlig trappevask. Vi finner ut hva som passer budsjettet." },
      { question: "Kan vi få tilbud for hele borettslaget?", answer: "Klart! Send oss antall oppganger og etasjer, så gir vi en totalpris." },
      { question: "Tilbyr dere snømåking?", answer: "Ja — vi tar snømåking som tillegg til renholdsavtalen om vinteren." },
    ],
    coverageText:
      "Vi vasker for borettslag og sameier i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold.",
    seoTitle: "Borettslag renhold i Vestfold · Fast avtale",
    seoDescription:
      "Renhold for borettslag i Vestfold. Trappevask og fellesarealer. Fast avtale. Få tilbud.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
