export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  source: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sengemakeriet Duxiana",
    location: "Tønsberg",
    text: "Færder Multiservice har vasket hos oss i over 12 år. De tar både regelmessig vask av butikken og periodisk vask av vinduene. Vi er svært fornøyd med jobben de gjør. De er raske og effektive, og det blir alltid skinnende rent!",
    rating: 5,
    date: "Bedriftskunde",
    source: "Referanse",
  },
  {
    name: "Torunn G.",
    location: "Vestfold",
    text: "Vi har i flere år benyttet Færder Multiservice til renhold på våre kontorer. Vi er veldig tilfredse med jobben de gjør, alltid forekommende og fleksible, og de stiller alltid med hyggelige flinke folk.",
    rating: 5,
    date: "Pasient- og brukerombudet",
    source: "Referanse",
  },
  {
    name: "Madeleine P.",
    location: "Privatkunde",
    text: "I ca. 3 år har Færder Multiservice vasket hjemme hos oss. De er vanvittig flinke, svært nøye og veldig hyggelige! Vi har et stort hus og to hunder, og aldri har det vært en ting å utsette. Varm anbefaling!",
    rating: 5,
    date: "Fast kunde",
    source: "Referanse",
  },
  {
    name: "Oddmund N.",
    location: "Maritim Opplæring Sørøst",
    text: "Færder Multiservice har vasket hos oss i ca 13 år. De tar både regelmessig vask av kontorene og periodisk vask av vinduer. Vi er svært fornøyde. De er raske, effektive og veldig fleksible. Alle tomlene opp!",
    rating: 5,
    date: "Bedriftskunde",
    source: "Referanse",
  },
];
