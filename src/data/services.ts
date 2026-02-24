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
    description: "Ukentlig eller månedlig renhold for et alltid rent hjem.",
    longDescription:
      "Vi tilbyr fullstendig rengjøring av ditt hjem. Rengjøringen skal ikke være noe du bekymrer deg for. Vi er offentlig godkjent og medlem av NHO Service og Handel. Vi vet at alle hjem har varierende behov, og sammen kommer vi frem til en renholdsplan som passer deg og utfyller dine ønsker. Rengjøring kan bestilles ukentlig, annenhver uke, hver tredje uke eller før/etter en fest.",
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
      { title: "Kontakt oss", description: "Fortell oss om boligen din og hvor ofte du ønsker vask." },
      { title: "Vi gir tilbud", description: "Du får et fast prisforslag basert på størrelse og behov." },
      { title: "Vi vasker", description: "Samme team kommer til avtalt tid, hver gang." },
    ],
    faq: [
      { question: "Hvor ofte kan dere komme?", answer: "Vi tilbyr ukentlig, annenhver uke, hver tredje uke eller månedlig vask. Du velger selv frekvensen som passer best." },
      { question: "Er det de samme som kommer hver gang?", answer: "Ja, vi tilstreber å sende samme team hver gang slik at de blir kjent med hjemmet ditt og vet hva du forventer." },
      { question: "Hva om jeg vil avlyse en gang?", answer: "Gi oss beskjed minst 24 timer i forveien, så flytter vi vasken uten ekstra kostnad." },
      { question: "Hva med ekstra vask?", answer: "Vi tilbyr tillegg som vinduer, innvendig i skap, stryking, klesvask og mer. Alt kan tilpasses ditt behov." },
    ],
    coverageText:
      "Vi tilbyr fast vaskehjelp i Tønsberg, Nøtterøy, Tjøme, Sandefjord og resten av Vestfold. Kort reisevei betyr raskt oppmøte og fleksible tidspunkter.",
    seoTitle: "Fast vaskehjelp i Vestfold · Fra 550 kr/gang",
    seoDescription:
      "Fast vaskehjelp i Tønsberg og Vestfold. Ukentlig eller månedlig renhold for hjemmet ditt. Offentlig godkjent. Medlem av NHO Service og Handel. Få tilbud i dag.",
  },
  {
    slug: "flyttevask",
    name: "Flyttevask",
    description: "Grundig vask ved inn- eller utflytting med 100 % fornøydgaranti.",
    longDescription:
      "Vi har lang erfaring med flyttevask og er så sikre i vår jobb at vi tilbyr 100 % fornøydgaranti. Er ikke utleier eller kjøper fornøyd, kommer vi tilbake og fikser det kostnadsfritt. Vi kan hente og levere nøkkel mellom kl. 8 og 18 uavhengig om du er hjemme eller på jobb.",
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
      { title: "Kontakt oss", description: "Oppgi boligstørrelse, antall rom og ønsket dato." },
      { title: "Vi gir fast pris", description: "Du får fast pris basert på boligens størrelse — ingen overraskelser." },
      { title: "Vi vasker", description: "Grundig vask fra gulv til tak — klar for overlevering. Nøkkelhenting inkludert." },
    ],
    faq: [
      { question: "Hva koster flyttevask?", answer: "Pris avhenger av boligstørrelse. En leilighet på 50–80 m² koster typisk 4 500–7 000 kr. Vi gir alltid fast pris på forhånd." },
      { question: "Hvor lang tid tar det?", answer: "En vanlig leilighet tar 4–6 timer. Større boliger kan ta en hel dag." },
      { question: "Garanterer dere godkjent utvask?", answer: "Ja — vi tilbyr 100 % fornøydgaranti. Er ikke utleier eller kjøper fornøyd, kommer vi tilbake kostnadsfritt." },
      { question: "Kan dere hente nøkkel?", answer: "Ja — vi henter og leverer nøkkel mellom kl. 8 og 18, uavhengig om du er hjemme eller på jobb." },
    ],
    coverageText:
      "Vi utfører flyttevask i Tønsberg, Nøtterøy, Sandefjord og resten av Vestfold. Kort reisevei betyr raskt oppmøte — ofte innen 2–3 virkedager.",
    seoTitle: "Flyttevask i Tønsberg & Vestfold · 100 % fornøydgaranti",
    seoDescription:
      "Flyttevask i Tønsberg og Vestfold fra 3 500 kr. Grundig utvask med 100 % fornøydgaranti. Nøkkelhenting inkludert. Bestill i dag.",
  },
  {
    slug: "kontorvask",
    name: "Kontorvask",
    description: "Profesjonelt renhold for bedrifter og kontorer.",
    longDescription:
      "Et rent kontor gir bedre arbeidsmiljø, færre sykedager og et profesjonelt inntrykk på kunder. Vi skreddersyr en renholdsavtale tilpasset din bedrift. Et godt forhold bygger først og fremst på en åpen dialog — du får en fast kontaktperson og skriftlig avtale med 100 % fornøydgaranti.",
    price: "Tilpasset avtale",
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
      { title: "Befaring", description: "Vi kommer og ser på lokalene, helt uforpliktende." },
      { title: "Skreddersydd tilbud", description: "Du får skriftlig avtale tilpasset omfang og frekvens." },
      { title: "Fast renhold", description: "Vi leverer konsistent kvalitet med fast kontaktperson, uke etter uke." },
    ],
    faq: [
      { question: "Kan dere komme utenom arbeidstid?", answer: "Ja, vi tilpasser tidspunktene slik at renholdet ikke forstyrrer arbeidsdagen. Kveld og tidlig morgen er vanlig." },
      { question: "Hvor ofte bør et kontor vaskes?", answer: "De fleste kontorer har behov for 2–5 ganger per uke, avhengig av antall ansatte og type virksomhet." },
      { question: "Har dere bedriftsforsikring?", answer: "Ja — vi har full bedriftsforsikring, er MVA-registrert og gir skriftlig avtale med fast kontaktperson." },
    ],
    coverageText:
      "Vi leverer kontorvask til bedrifter i Tønsberg, Nøtterøy, Sandefjord, Horten og hele Vestfold. Fast kontaktperson og stabil kvalitet.",
    seoTitle: "Kontorvask i Vestfold · Bedriftsrenhold",
    seoDescription:
      "Profesjonelt kontorvask og bedriftsrenhold i Vestfold. Skreddersydd avtale med skriftlig kontrakt. 100 % fornøydgaranti. Få uforpliktende tilbud.",
  },
  {
    slug: "byggvask",
    name: "Byggvask",
    description: "Rengjøring etter bygg og renovering med 100 % fornøydgaranti.",
    longDescription:
      "Byggstøv legger seg i de mest skjulte hjørnene. Vi fjerner alt grundig slik at du ikke ser sporet etter håndverkere og huset er klargjort til bruk. Vi tilbyr 100 % fornøydgaranti — er du ikke fornøyd, kommer vi tilbake kostnadsfritt. Vi kan hente og levere nøkkel mellom kl. 8 og 18.",
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
      { title: "Kontakt oss", description: "Beskriv prosjektet og omfanget av arbeidet." },
      { title: "Befaring", description: "Vi ser på lokalene og gir deg en fast pris." },
      { title: "Vi vasker", description: "Grundig byggvask slik at alt er klargjort til bruk." },
    ],
    faq: [
      { question: "Når bør byggvask utføres?", answer: "Byggvask gjøres etter at alt byggearbeid er ferdig, men før møbler og inventar flyttes inn." },
      { question: "Trenger vi flere runder?", answer: "Ofte holder én grundig runde, men ved mye støv kan det være nødvendig med to omganger." },
      { question: "Kan dere ta hele bygget?", answer: "Ja — vi tar alt fra leiligheter til større næringsbygg. Nybygg, renovering og tilbygg." },
    ],
    coverageText:
      "Vi utfører byggvask i hele Vestfold — fra Holmestrand i nord til Larvik i sør. Tar prosjekter av alle størrelser.",
    seoTitle: "Byggvask i Vestfold · 100 % fornøydgaranti",
    seoDescription:
      "Profesjonell byggvask i Vestfold fra 5 000 kr. Grundig rengjøring etter bygg og renovering. 100 % fornøydgaranti. Få tilbud i dag.",
  },
  {
    slug: "spesialvask",
    name: "Spesialvask",
    description: "Vindusvask, tepperens, møbelrens og spesialtjenester.",
    longDescription:
      "Vi elsker å vaske vinduer, så hvis det er noe du gruer deg til, tar vi det gjerne for deg. Det er viktig å sikre godt innslipp av dagslys — og for bedrifter er rene vinduer avgjørende for et profesjonelt inntrykk. Vi tilbyr også tepperens, møbelrens og andre spesialtjenester.",
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
      { title: "Kontakt oss", description: "Fortell oss hva som trengs, så vurderer vi omfanget." },
      { title: "Vi gir tilbud", description: "Fast pris basert på antall enheter og type jobb." },
      { title: "Vi utfører", description: "Profesjonelt utført med riktig utstyr og kompetanse." },
    ],
    faq: [
      { question: "Vasker dere vinduer i høyden?", answer: "Ja, vi har utstyr for vinduer opptil 3. etasje." },
      { question: "Hvor ofte bør vinduer vaskes?", answer: "Vi anbefaler minimum 2 ganger i året — vår og høst." },
      { question: "Kan dere rense møbler og tepper?", answer: "Ja — vi tilbyr tepperens og møbelrens med profesjonelt utstyr og skånsomme midler." },
    ],
    coverageText:
      "Vi tilbyr spesialvask og vindusvask i Tønsberg, Nøtterøy, Tjøme og hele Vestfold.",
    seoTitle: "Spesialvask i Vestfold · Vindusvask & tepperens",
    seoDescription:
      "Spesialvask og vindusvask i Vestfold fra 800 kr. Profesjonelt utført. Kontakt oss for tilbud.",
  },
  {
    slug: "luktsanering",
    name: "Luktsanering",
    description: "Profesjonell fjerning av vond lukt fra boliger og lokaler.",
    longDescription:
      "Vond lukt er forårsaket av en blanding av kjemiske stoffer fra proteiner, bakterier og organisk materiale. Uten behandling forsterkes luktproblemene og sprer seg, og blir stadig vanskeligere å håndtere. Vi samarbeider med Inneklimaspesialisten og EV Of Norway for å eliminere luktkilden og behandle berørte områder med flere metoder og spesialutstyr.",
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
      { title: "Befaring", description: "Vi kartlegger kilden til lukten og omfanget." },
      { title: "Behandlingsplan", description: "Du får en plan og pris for saneringen." },
      { title: "Vi sanerer", description: "Grundig behandling med spesialutstyr til lukten er borte." },
    ],
    faq: [
      { question: "Hva slags lukt kan dere fjerne?", answer: "Vi behandler røyklukt, kjæledyrlukt, fukt- og mugglukt, brannlukt og andre inneklimalukter." },
      { question: "Hvor lang tid tar det?", answer: "En vanlig luktsanering tar 1–3 dager, avhengig av omfang. Vi gir estimat etter befaring." },
      { question: "Hvilke metoder bruker dere?", answer: "Vi bruker flere metoder inkludert ozonsanering, tekstilbehandling og ventilasjonssanering — i samarbeid med Inneklimaspesialisten og EV Of Norway." },
    ],
    coverageText:
      "Vi utfører luktsanering i hele Vestfold. Rask responstid — vi kan ofte komme innen få dager.",
    seoTitle: "Luktsanering i Vestfold · Fjern vond lukt",
    seoDescription:
      "Profesjonell luktsanering i Vestfold fra 3 000 kr. Samarbeid med Inneklimaspesialisten. Befaring og tilbud.",
  },
  {
    slug: "hovedrengjoring",
    name: "Hovedrengjøring",
    description: "Grundig dyprengjøring fra topp til bunn.",
    longDescription:
      "Noen ganger trenger hjemmet en skikkelig grundig vask. Vår hovedrengjøring inkluderer alt i standard vask pluss innvendig i skap, bak og under møbler og hvitevarer, grundig rengjøring av bad og fliser, stekeovn, kjøleskap og fryser. Vi anbefaler 1–2 ganger i året som supplement til fast vask.",
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
      { title: "Kontakt oss", description: "Fortell oss om boligen og hva du ønsker ekstra fokus på." },
      { title: "Vi gir tilbud", description: "Fast pris basert på størrelse og omfang." },
      { title: "Vi rengjør", description: "Grundig dyprengjøring fra topp til bunn." },
    ],
    faq: [
      { question: "Hva er forskjellen på vanlig vask og hovedrengjøring?", answer: "Hovedrengjøring går mye grundigere — vi tar innvendig i skap, bak møbler, grundig på bad og kjøkken, og alle detaljer som ikke dekkes i vanlig vask." },
      { question: "Hvor lang tid tar det?", answer: "En leilighet på 50–80 m² tar typisk 5–8 timer. Større boliger kan ta en hel dag." },
      { question: "Hvor ofte bør man ha hovedrengjøring?", answer: "Vi anbefaler 1–2 ganger i året, gjerne vår og høst, som supplement til fast vask." },
    ],
    coverageText:
      "Vi tilbyr hovedrengjøring i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold.",
    seoTitle: "Hovedrengjøring i Vestfold · Dyprengjøring",
    seoDescription:
      "Grundig hovedrengjøring i Tønsberg og Vestfold fra 1 100 kr. Dyprengjøring fra topp til bunn. Bestill i dag.",
  },
  {
    slug: "visningsvask",
    name: "Visningsvask",
    description: "Klargjøring av bolig før visning.",
    longDescription:
      "Førsteinntrykket teller. En visningsvask gjør boligen din presentabel og innbydende for potensielle kjøpere — noe som kan øke salgsprisen. Vi planlegger slik at vi er ferdige i god tid før visningen starter.",
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
      { title: "Kontakt oss", description: "Oppgi boligtype, størrelse og visningstidspunkt." },
      { title: "Vi gir tilbud", description: "Fast pris — ingen overraskelser." },
      { title: "Vi klargjør", description: "Boligen er klar for visning og fotografering." },
    ],
    faq: [
      { question: "Hvor tidlig bør jeg bestille?", answer: "Vi anbefaler å bestille minst 3–5 virkedager før visning. Ved hast — ring oss, vi prøver alltid å finne en løsning." },
      { question: "Kan dere komme samme dag som visningen?", answer: "Ja — vi planlegger slik at vi er ferdige i god tid før visningen starter." },
      { question: "Hva med hastebestilling?", answer: "Vi tilbyr haste-levering innen 24 timer mot et tillegg. Ring oss direkte for raskest mulig respons." },
    ],
    coverageText:
      "Vi utfører visningsvask i Tønsberg, Nøtterøy, Sandefjord og Vestfold. Rask responstid — vi forstår at visningsdatoer ofte er faste.",
    seoTitle: "Visningsvask i Vestfold · Klar for visning",
    seoDescription:
      "Visningsvask i Vestfold fra 900 kr. Klargjøring av bolig før visning. Øk førsteinntrykket. Bestill i dag.",
  },
  {
    slug: "borettslag",
    name: "Borettslag",
    description: "Renhold av fellesarealer i borettslag og sameier.",
    longDescription:
      "Rene fellesarealer gir et bedre bomiljø for alle beboere. Vi tilbyr faste avtaler for trappevask, garasjer, vaskerom og andre fellesarealer. Fast kontaktperson, skriftlig avtale og konsistent kvalitet hele året.",
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
      { title: "Befaring", description: "Vi ser på fellesarealene og kartlegger behov." },
      { title: "Skriftlig avtale", description: "Skreddersydd avtale med fast månedspris og fast kontaktperson." },
      { title: "Fast renhold", description: "Konsistent kvalitet, uke etter uke, hele året." },
    ],
    faq: [
      { question: "Hvor ofte bør fellesarealer vaskes?", answer: "De fleste borettslag har behov for ukentlig trappevask. Vi tilpasser frekvensen etter behov og budsjett." },
      { question: "Kan vi få tilbud for hele borettslaget?", answer: "Ja — send oss informasjon om antall oppganger, etasjer og fellesarealer, så gir vi en totalpris." },
      { question: "Tilbyr dere snømåking?", answer: "Ja — vi tilbyr snømåking som vintertillegg til den faste renholdsavtalen." },
    ],
    coverageText:
      "Vi leverer renhold til borettslag og sameier i Tønsberg, Nøtterøy, Tjøme, Sandefjord og hele Vestfold.",
    seoTitle: "Borettslag renhold i Vestfold · Fast avtale",
    seoDescription:
      "Renhold for borettslag og sameier i Vestfold. Trappevask, fellesarealer, fast månedlig avtale. Få tilbud.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
