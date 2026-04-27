export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "5-ting-du-bor-vite-for-du-bestiller-flyttevask",
    title: "5 ting du bør vite før du bestiller flyttevask",
    excerpt:
      "Skal du flytte? Her er fem tips som gjør at du får tilbake depositumet og leverer en bolig du kan være stolt av.",
    tags: ["Tips", "Flyttevask"],
    image: "/images/illustrations/blogg-flyttevask.webp",
    date: "Februar 2026",
    seoTitle: "5 ting du bør vite før du bestiller flyttevask — Færder Multiservice",
    seoDescription:
      "Skal du flytte? Her er fem tips som gjør at du får tilbake depositumet og leverer en bolig du kan være stolt av.",
    content: `
      <h2>1. Bestill i god tid</h2>
      <p>Flyttesesongen i Vestfold er spesielt travel fra mai til august. Bestiller du to til tre uker i forveien, er du trygg på å få en tid som passer — og slipper stresset med å finne noen i siste liten.</p>

      <h2>2. Tøm boligen først</h2>
      <p>Vi vasker grundigere når alle rom er tomme. Fjern møbler, pappesker og personlige eiendeler før vi kommer. Det sparer tid for oss og penger for deg.</p>

      <h2>3. Sjekk hva som er inkludert</h2>
      <p>En god flyttevask dekker alle synlige flater: gulv, vegger, vinduskarmer, kjøkken (inkl. innvendig i skap og hvitevarer), bad og boder. Spør alltid om en detaljert sjekkliste slik at det ikke blir noen overraskelser.</p>

      <h2>4. Dokumentér tilstanden</h2>
      <p>Ta bilder av boligen etter vask. Dette er ditt bevis overfor utleier eller megler dersom det oppstår uenighet om depositumet.</p>

      <h2>5. Velg en godkjent renholdsbedrift</h2>
      <p>Sørg for at firmaet er registrert i Renholdsregisteret og har offentlig godkjenning fra Arbeidstilsynet. Det gir deg trygghet for at jobben utføres forsvarlig — og at arbeiderne har ordnede forhold.</p>
    `,
  },
  {
    slug: "hvor-ofte-bor-du-ha-fast-vask",
    title: "Hvor ofte bør du ha fast vask? En guide",
    excerpt:
      "Ukentlig, annenhver uke eller månedlig? Vi hjelper deg å finne riktig frekvens for hjemmet ditt.",
    tags: ["Guide", "Fast vask"],
    image: "/images/illustrations/blogg-fast-vask.webp",
    date: "Februar 2026",
    seoTitle: "Hvor ofte bør du ha fast vask? En guide — Færder Multiservice",
    seoDescription:
      "Ukentlig, annenhver uke eller månedlig? Vi hjelper deg å finne riktig frekvens for hjemmet ditt.",
    content: `
      <h2>Det finnes ikke ett riktig svar</h2>
      <p>Hvor ofte du trenger vask avhenger av flere ting: størrelsen på boligen, antall personer i husstanden, om du har kjæledyr, og hva du forventer av renhold i hverdagen.</p>

      <h2>Ukentlig vask</h2>
      <p>Passer best for familier med barn, husstander med kjæledyr, eller alle som ønsker at hjemmet alltid ser presentabelt ut. Gulv, bad og kjøkken holdes kontinuerlig rene.</p>

      <h2>Annenhver uke</h2>
      <p>Det vanligste valget. Du får en grundig rengjøring jevnlig uten at det blir et stort innhogg i budsjettet. Mellom vaskene holder de fleste hjemmet rent med lett vedlikehold.</p>

      <h2>Månedlig vask</h2>
      <p>Et godt alternativ for enslige eller par uten barn som ønsker en skikkelig gjennomgang en gang i måneden. Kombiner gjerne med en hovedrengjøring hvert halvår.</p>

      <h2>Vår anbefaling</h2>
      <p>Start med annenhver uke. Etter to-tre runder ser du raskt om du vil øke eller redusere frekvensen. Vi tilpasser alltid opplegget etter dine behov — uten bindingstid.</p>
    `,
  },
  {
    slug: "slik-holder-du-hjemmet-rent-mellom-vaskene",
    title: "Slik holder du hjemmet rent mellom vaskene",
    excerpt:
      "Små daglige rutiner gjør en stor forskjell. Her er våre beste tips for et rent hjem — uten å bruke hele helgen.",
    tags: ["Tips", "Renhold"],
    image: "/images/illustrations/blogg-rent-mellom.webp",
    date: "Januar 2026",
    seoTitle: "Slik holder du hjemmet rent mellom vaskene — Færder Multiservice",
    seoDescription:
      "Små daglige rutiner gjør en stor forskjell. Her er våre beste tips for et rent hjem — uten å bruke hele helgen.",
    content: `
      <h2>Ti minutter om dagen</h2>
      <p>Sett av ti minutter hver kveld til hurtigfiks: tørk av kjøkkenbenken, rydd bort oppvasken, og ta en rask runde med støvmopp i gangen. Det høres lite ut, men det forhindrer at rot samler seg opp.</p>

      <h2>En ting om gangen</h2>
      <p>Ikke prøv å gjøre alt på en gang. Mandag: bad. Onsdag: kjøkken. Fredag: støvsuging. Små bolker er enklere å gjennomføre enn en hel vaskedag i helgen.</p>

      <h2>Hold ryddige flater</h2>
      <p>Jo færre ting som ligger på benkene, desto raskere går det å tørke av. Finn faste plasser for nøkler, post og småting — det gjør en overraskende stor forskjell.</p>

      <h2>Invester i riktig utstyr</h2>
      <p>En god mikrofiberklut, en lettvint støvmopp og en sprayflaske med allrengjøring er alt du trenger for daglig vedlikehold. Dropp unødvendig mange spesialprodukter.</p>

      <h2>La proffene ta storrunden</h2>
      <p>Daglig vedlikehold holder hjemmet trivelig, men det erstatter ikke en grundig rengjøring. La oss ta de tunge løftene — så kan du bruke tiden din på det som betyr mest.</p>
    `,
  },
  {
    slug: "derfor-bor-bedrifter-investere-i-profesjonelt-renhold",
    title: "Derfor bør bedrifter investere i profesjonelt renhold",
    excerpt:
      "Et rent arbeidsmiljø øker produktivitet, reduserer sykefravær og gir et bedre inntrykk på kunder og ansatte.",
    tags: ["Guide", "Kontor"],
    image: "/images/illustrations/blogg-profesjonelt-renhold.webp",
    date: "Januar 2026",
    seoTitle: "Derfor bør bedrifter investere i profesjonelt renhold — Færder Multiservice",
    seoDescription:
      "Et rent arbeidsmiljø øker produktivitet, reduserer sykefravær og gir et bedre inntrykk på kunder og ansatte.",
    content: `
      <h2>Førsteinntrykket teller</h2>
      <p>Enten det er kunder, samarbeidspartnere eller potensielle ansatte — alle legger merke til et rent og velholdt lokale. Et rotete kontor får folk til å lure på hva annet dere slurver med.</p>

      <h2>Mindre sykefravær</h2>
      <p>Støv, bakterier og dårlig inneklima er blant de vanligste årsakene til forkjølelse og allergi på arbeidsplassen. Jevnlig grundig renhold reduserer sykefraværet merkbart.</p>

      <h2>Bedre konsentrasjon</h2>
      <p>De fleste merker det selv: man jobber bedre når det er ryddig rundt en. Færre distraksjoner, mindre frustrasjon over rotet på pulten ved siden av.</p>

      <h2>Spar tid og ressurser</h2>
      <p>Når de ansatte slipper å bruke tid på renhold, kan de fokusere på det de er best på. Overlat jobben til proffene — det lønner seg.</p>

      <h2>Tilpasset din bedrift</h2>
      <p>Vi legger opp vasken etter bedriftens størrelse, type lokale og behov. Alt fra daglig kontorvask til ukentlig grundig rengjøring — vi finner et opplegg som passer for dere.</p>
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  return [...new Set(blogPosts.flatMap((p) => p.tags))];
}
