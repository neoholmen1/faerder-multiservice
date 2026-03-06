import type { Metadata } from "next";
import { PageHero } from "@/components/DarkHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description: "Personvernerklæring for Færder Multiservice AS. Les om hvordan vi behandler dine personopplysninger.",
  alternates: { canonical: "/personvern" },
  openGraph: {
    title: "Personvernerklæring | Færder Multiservice",
    description: "Les om hvordan vi behandler dine personopplysninger.",
    url: "/personvern",
  },
};

export default function PersonvernPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Hjem", href: "/" },
        { name: "Personvern", href: "/personvern" },
      ]} />
      <PageHero title="Personvernerklæring" />

      <section className="py-24 lg:py-32">
        <article className="prose-custom mx-auto max-w-3xl px-6">
          <h2>Behandlingsansvarlig</h2>
          <p>
            Færder Multiservice AS (org.nr 824 779 392) er behandlingsansvarlig for
            personopplysninger som samles inn via denne nettsiden.
          </p>
          <p>
            <strong>Adresse:</strong> Rambergveien, 3115 Tønsberg<br />
            <strong>E-post:</strong> post@faerdermultiservice.no<br />
            <strong>Telefon:</strong> +47 968 23 647
          </p>

          <h2>Hvilke data vi samler inn</h2>
          <p>Vi samler inn opplysninger du oppgir i kontaktskjema og jobbsøknad:</p>
          <ul>
            <li>Navn</li>
            <li>E-postadresse</li>
            <li>Telefonnummer</li>
            <li>Postnummer / sted (valgfritt)</li>
            <li>Valgt tjeneste (valgfritt)</li>
            <li>Meldingstekst</li>
          </ul>

          <h2>Formål</h2>
          <p>Vi bruker opplysningene til å:</p>
          <ul>
            <li>Svare på din henvendelse</li>
            <li>Gi deg et tilbud på våre tjenester</li>
            <li>Følge opp jobbsøknader</li>
          </ul>

          <h2>Lagring</h2>
          <p>
            Opplysningene sendes via e-post gjennom Resend og lagres ikke i noen
            database på vår server. E-postene mottas i vår innboks og behandles
            derfra.
          </p>

          <h2>Sletting</h2>
          <p>
            Vi sletter henvendelser når de ikke lenger er nødvendige for oppfølging
            og kundebehandling. Jobbsøknader slettes senest 6 måneder etter mottatt
            søknad, med mindre vi har avtalt annet med deg.
          </p>

          <h2>Tredjeparts-tjenester</h2>
          <p>Vi bruker følgende tredjepartstjenester:</p>
          <ul>
            <li>
              <strong>Vercel</strong> — hosting og analytics. Samler anonymisert
              bruksstatistikk uten cookies.
            </li>
            <li>
              <strong>Resend</strong> — e-postutsendelse av kontaktskjema.
            </li>
            <li>
              <strong>Upstash Redis</strong> — rate limiting for å beskytte skjema
              mot misbruk. Ingen personopplysninger lagres.
            </li>
            <li>
              <strong>Google Analytics (GA4)</strong> — anonymisert
              besøksstatistikk. Lastes kun dersom du godtar informasjonskapsler.
              Google kan overføre data til servere i USA under EUs
              standardkontraktsklausuler.
            </li>
          </ul>

          <h2>Informasjonskapsler (cookies)</h2>
          <p>
            Denne nettsiden bruker Google Analytics for å samle anonymisert
            besøksstatistikk. Google Analytics settes kun dersom du godtar
            informasjonskapsler via banneret som vises ved første besøk. Ditt
            valg lagres lokalt i nettleseren din.
          </p>
          <p>
            Vercel Analytics kjører i tillegg og er helt cookiefri — den samler
            kun anonymisert data uten sporings&shy;teknologi.
          </p>
          <p>
            Du kan når som helst endre ditt valg ved å slette nettleserdata for
            denne siden, hvorpå banneret vises på nytt.
          </p>

          <h2>Dine rettigheter</h2>
          <p>I henhold til GDPR har du rett til å:</p>
          <ul>
            <li>Be om innsyn i hvilke opplysninger vi har om deg (artikkel 15)</li>
            <li>Be om retting av uriktige opplysninger (artikkel 16)</li>
            <li>Be om sletting av dine opplysninger (artikkel 17)</li>
            <li>Klage til Datatilsynet dersom du mener vi bryter regelverket</li>
          </ul>

          <h2>Kontakt</h2>
          <p>
            Har du spørsmål om vår behandling av personopplysninger? Kontakt oss på{" "}
            <a href="mailto:post@faerdermultiservice.no">
              post@faerdermultiservice.no
            </a>{" "}
            eller ring{" "}
            <a href="tel:+4796823647">+47 968 23 647</a>.
          </p>

          <p className="mt-12 text-sm text-text-secondary">
            Sist oppdatert: Mars 2026
          </p>
        </article>
      </section>
    </>
  );
}
