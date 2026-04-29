# Supabase-oppsett — Færder Multiservice CMS

Denne guiden tar deg fra et tomt Supabase-prosjekt til et fungerende admin-panel.
Tar typisk 15–20 minutter første gang.

> **Status før du starter:** Nettsiden fungerer fullt ut uten Supabase
> (alt innhold leses fra hardkodet fallback i `src/data/*.ts`). Når du
> kobler til Supabase, blir alt redigerbart fra `/admin`. Det du IKKE
> redigerer i admin, fortsetter å bruke fallback-verdien.

---

## 1. Opprett Supabase-prosjekt

1. Gå til [supabase.com](https://supabase.com) og logg inn
2. Klikk **New project**
3. Velg gratis-tier
4. Region: `eu-north-1` (Sverige) for raskest svar fra Norge
5. Sett et databasepassord (lagre det et trygt sted — du trenger det aldri etter dette)
6. Vent ~2 minutter mens prosjektet provisjoneres

## 2. Hent API-nøkler

I prosjekt-dashboardet:

1. **Settings** → **API**
2. Kopier `Project URL` og `anon public` key
3. Lim inn i `.env.local` (kopier `.env.local.example` først):

```bash
cp .env.local.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_SLUG=faerder
```

> ⚠️ Anon-nøkkelen er **trygg å eksponere** i frontend. Den respekterer RLS-policyene
> dine. Service-role-nøkkelen skal aldri legges i .env.local — du trenger den ikke
> til vanlig drift.

## 3. Kjør SQL-migrasjonene

I Supabase-dashbordet: **SQL Editor** → **New query**.

Kjør filene **én av gangen** i denne rekkefølgen (kopier hele filen, lim inn, kjør):

| # | Fil | Hva den gjør |
|---|-----|--------------|
| 1 | `supabase/migrations/20260429000000_phase1_multi_tenant.sql` | Oppretter `sites`, `super_admins`, `site_users`, RLS-funksjoner |
| 2 | `supabase/migrations/20260429100000_phase2_site_settings.sql` | Kontaktinfo, åpningstider, dekningsområde, badges |
| 3 | `supabase/migrations/20260429200000_phase3a_cms_foundation.sql` | `media`, `pages`, `page_sections` + Storage-bucket |
| 4 | `supabase/migrations/20260429300000_phase3b_seed_content.sql` | Fyller alle sider med dagens hardkodet tekst |
| 5 | `supabase/migrations/20260429400000_phase4_testimonials.sql` | De 4 ekte kundeanmeldelsene |
| 6 | `supabase/migrations/20260429500000_phase5_services.sql` | Alle 9 tjenester med priser, FAQ, frekvenser |
| 7 | `supabase/migrations/20260429600000_phase6_blog.sql` | De 4 blogginnleggene |

Alle filene er **idempotente** — du kan kjøre dem på nytt uten å miste data.

> Hvis en migrasjon feiler, sjekk feilmeldingen. De fleste feil skyldes at en
> tidligere migrasjon ikke ble kjørt. Migrasjon 1 må alltid kjøres først.

## 4. Opprett en bruker

I dashbordet: **Authentication** → **Users** → **Add user** → **Create new user**.

- E-post: `neoholmen1@gmail.com`
- Passord: velg ett du husker
- Auto-bekreft brukeren (skru på "Auto Confirm User")

## 5. Gjør brukeren til super-admin

Tilbake i SQL Editor, kjør:

```sql
INSERT INTO super_admins (user_id)
SELECT id FROM auth.users WHERE email = 'neoholmen1@gmail.com'
ON CONFLICT DO NOTHING;
```

Dette gir brukeren full tilgang til alle sites (foreløpig bare én — `faerder`).

## 6. Restart dev-serveren

```bash
npm run dev
```

Gå til [http://localhost:3000/admin](http://localhost:3000/admin), logg inn med
e-post + passord. Du bør lande på `/admin/nettside`.

---

## Hvor er hva i admin-panelet

| Sidebar-punkt | Hva du kan redigere |
|---|---|
| **Nettside** | Hero-tekst, undertekst og blokker på hver side (forsiden, om-oss, kontakt, jobb, prisliste) |
| **Tjenester** | Beskrivelser, priser, bilder, FAQ, frekvenser for alle 9 tjenester |
| **Blogg** | Skriv nye innlegg eller rediger eksisterende. Markdown-editor. |
| **Innstillinger** | Telefon, e-post, adresse, åpningstider, sosiale medier, dekningsområde, badges, kundeanmeldelser |

## Hva som forblir hardkodet (v1)

- **Hero-typewriter-ord** på forsiden (`hjem.`, `kontor.`, …) — i `page.tsx`
- **Strukturert data (JSON-LD)** — i `src/components/seo/JsonLd.tsx` og `src/app/layout.tsx`
- **Konfigurator-prislogikk** (`src/data/configurator.ts`) — JS-funksjon, ikke flyttbar til DB uten større refaktorering
- **Forsiden, kontakt, jobb, prisliste, om-oss** leser ennå tekst fra hardkodet fallback. Disse kan rewires senere — admin-panelet og DB er klart, men frontend-komponentene må selv lese fra DB.

## Det som er live-koblet

- **Footer**: kontaktinfo, dekningsområde, badges
- **Tjenester-listing** (`/tjenester`): leser fra DB med fallback
- **Tjenestesider** (`/tjenester/[slug]`): leser ennå hardkodet fallback (kompleks kalkulator-integrasjon)
- **Blogg-listing** (`/blogg`): leser fra DB med fallback
- **Blogginnlegg** (`/blogg/[slug]`): leser fra DB med fallback

> Fremover: Når du redigerer noe i admin og lagrer, kalles `revalidatePath("/")`,
> og endringen blir synlig på public-siden umiddelbart.

---

## Vedlikehold

### Legge til en ny bruker

1. **Authentication** → **Users** → **Add user**
2. SQL Editor:
   ```sql
   INSERT INTO site_users (site_id, user_id, role)
   SELECT s.id, u.id, 'editor'::site_role
   FROM sites s, auth.users u
   WHERE s.slug = 'faerder' AND u.email = 'ny.bruker@example.com';
   ```

### Reset av tekst

Hvis du har rotet til noe og vil tilbake til "fabrikk", kjør seed-migrasjonen
(`20260429300000_phase3b_seed_content.sql`) på nytt. Den bruker
`ON CONFLICT DO NOTHING`, så **eksisterende endringer overskrives ikke**. For å
faktisk resette må du først slette de aktuelle radene fra `pages`/`page_sections`.

### Backup

Supabase tar automatiske backups på betalte planer. På gratis-tier kan du
eksportere via dashbordet: **Database** → **Backups** (eller bruk `pg_dump`).

---

## Feilsøking

**"Database ikke koblet til" på `/admin`**
→ Sjekk at `.env.local` har riktige verdier og at du har restartet dev-serveren.

**"Ingen tilgang" etter innlogging**
→ Brukeren er ikke i `super_admins` eller `site_users`. Kjør SQL-snutten i steg 5
eller "Legge til en ny bruker" over.

**Bilder lastes ikke opp**
→ Sjekk at `media`-bucket finnes (kjørte du migrasjon 3?) og at storage-policies
er på plass. Du kan se bucket-er i dashbordet under **Storage**.

**Endringer i admin vises ikke på public-siden**
→ Sjekk om siden er live-koblet (se tabellen over). Hvis ja, prøv hardrefresh
(⌘⇧R / Ctrl+Shift+R). Hvis nei, må komponenten rewires.
