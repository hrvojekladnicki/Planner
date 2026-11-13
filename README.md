# Planner

Osobni planer (To Do, tjedni plan, liste, web stranice) sa sinkronizacijom u stvarnom vremenu između mobitela i računala preko Firebasea (Google prijava + Firestore).

## Što je novo (v2)

- **Novi dizajn**: bočni izbornik na računalu; donja navigacija i gumb **+** za brzo dodavanje na mobitelu; tamna tema.
- **Dashboard**: brojke na vrhu (hitno, danas, napredak tjedna, podsjetnici), hitna lista, **“Ovaj tjedan”** (zadaci po danima + stavke iz lista kojima rok pada ovaj tjedan) i tjedni plan.
- **Drag & drop** (preko ⠿): redoslijed hitne liste, zadaci gore/dolje unutar dana i premještanje na drugi dan, stavke u listama, redoslijed lista u izborniku, web stranice.
- **Prioritet po danu**: svaki zadatak ima prioritet (obojena traka). Točkica u polju “Dodaj…” bira prioritet novog zadatka. Izbornik ⋯ na danu nudi: sortiraj po prioritetu, prenesi nedovršeno na sljedeći dan, prebaci nedovršeno u Hitno, obriši završene.
- **Sve se može uređivati**: zadaci (tekst, link, bilješka, prioritet, dan, podsjetnik), stavke u listama, liste (naziv i ikona), web stranice, kategorije. Brisanje se može poništiti.
- **Povezani linkovi**: stavka poslana iz liste na To Do ostaje povezana. Chip vodi na izvor i natrag, a kvačica na jednom mjestu označi i drugo. URL-ovi u tekstu su klikabilni. Svaka lista ima svoj URL (`#/tab/kuca`), pa radi i gumb Natrag.
- **Povijest** (`#/history`): prošli tjedni s napretkom i pretragom, “Otvori u tjednom planu”, “Prenesi nedovršeno u ovaj tjedan” i arhiva završenih hitnih stavki.
- **Podsjetnici**: uključuju se na bilo kojem zadatku ili stavci. Kad otvoriš Planner (ili dok je otvoren), dospjeli podsjetnici se prikažu u panelu, uz opcije Gotovo / +1 h / Sutra 9:00 / Viđeno. Ako dopustiš, dobiješ i sistemsku obavijest. Uz to postoji opcionalni sažetak dana pri otvaranju.
- **Mobitel / PWA**: responzivno, može se instalirati na početni zaslon (manifest + service worker).

## Novo u v3

- **Notes**: u bočnom izborniku (na mobitelu donja traka). Možeš imati neograničeno bilježaka, a svaka ima tekst, naslove i **checkliste**. Predlošci: prazna, checklista, popis za dućan, popis materijala.
  - Enter u checklisti dodaje novu stavku, a Backspace na praznoj je briše. Zalijepljeni popis s više redaka postaje više stavki. `[] ` ili `- ` na početku retka pretvara ga u checklistu, a `# ` u naslov.
  - Napredak (npr. 3/8), filtar “Neoznačeno” za dućan, drag & drop redaka.
  - Izbornik ⋯ nudi: Odznači sve, Označene na dno, Obriši označene, Kopiraj kao tekst, Pošalji u Hitno, Prikvači, Dupliciraj, Obriši.
  - Brzo dodavanje (+ ili tipka N) → “U bilješku”: `mlijeko, kruh, jaja` dodaje 3 stavke.
- **Google Calendar**
  - Bez postavljanja: u uređivanju zadatka klikni **“Dodaj u Google Calendar”**. Otvara se kalendar s već popunjenim događajem.
  - Pravi sync (Postavke → Google Calendar → Client ID): tvoji događaji vide se u tjednom planu i u “Ovaj tjedan”. Zadatak se šalje kao događaj, a premještanje ili uređivanje ažurira događaj. Ako zadatak ima podsjetnik, Google Calendar te podsjeti **na mobitelu i kad je Planner zatvoren**. Upute za Client ID su u postavkama.
- **Dijeljenje plannera** (Postavke → Dijeljenje): dodaj nečiji Google e-mail. Ta osoba nakon prijave u bočnom izborniku bira “Moj planner / tvoj planner”.
- **Sigurnost**: ugrađena provjera uživo (Postavke → Sigurnosna provjera), stroža Firestore pravila, CSP, filtar linkova, sigurnosna kopija (izvoz/uvoz JSON). Detalji su u **SECURITY.md**.

Prečaci na računalu: `N` otvara brzo dodavanje, `/` pretragu, `Esc` zatvara prozor.

## Novo u v4 — Kuća i obitelj

Nova sekcija u bočnom izborniku (na mobitelu: **Kids** i **Više** u donjoj traci).

- **🍳 Kuharica** — vlastiti recepti sa slikama.
  - **Zalijepi recept**: tekst s weba ili iz poruke se sam raspodijeli na naslov, porcije, vrijeme, sastojke i korake.
  - Količine se prepoznaju (`250 g`, `1/2 žličice`, `2–3 režnja`) pa se **skaliraju** po broju porcija.
  - Sastojci i koraci se mogu kvačiti. Vremena u koracima (“20 min”) postaju **timeri** sa zvukom i obaviješću.
  - **Kuhaj korak po korak**: velika slova, ekran ostaje upaljen, swipe lijevo/desno.
  - Ostalo: kategorije, oznake, ocjena, favoriti, “Skuhao sam” brojač, linkovi/izvor, galerija s naslovnom slikom.
  - Sastojci idu **na popis za dućan** (bilješka “🛒 Popis za dućan”). Uz to: kopiranje kao tekst, dijeljenje, ispis i “planiraj za danas”.
- **🍸 Kokteli i napitci** — 19 recepata s postera i 9 zimskih/domaćih dodataka. Dodaci su: kuhana rakija, kuhano bijelo vino, Bombardino, Hot Buttered Rum, vruća čokolada s Baileysom, topli jabučni punč, Old Fashioned, White Russian i Orahovac.
  - Skaliranje po osobama, prikaz u ml / cl / oz, filtri po žestici, favoriti, ocjene i vlastita bilješka.
  - **Moj bar**: označiš što imaš doma i vidiš što možeš napraviti odmah, a što ti fali za samo jedan sastojak.
  - Dodaj svoju fotku, prilagodi recept (tvoja verzija) ili dodaj potpuno novi napitak.
- **🔨 DIY** — projekti po **podsekcijama** (Stolarija, Kuća, Vrt, Elektrika, Popravci, OPG). Podsekcije se mogu dodavati i uređivati.
  - Predlošci: drvena vrata, polica/ormar, nadstrešnica/pergola, popravak.
  - **Materijal** s količinom, cijenom, trgovinom/linkom i kvačicom “nabavljeno”, plus zbrojevi troška. Zalijepi popis i dobiješ više stavki (npr. “4 kom grede 12,50 €”).
  - **Alat**, **koraci** (svaki korak može imati slike), **galerija** skica i fotki, **linkovi**, mjere, budžet, rok i status.
  - Nenabavljeni materijal može ići na popis za kupnju ili u Hitno. Projekt se može dodati na To Do.
- **🧒 Kids** — školski raspored po djetetu.
  - **Zvono**: generator (početak, trajanje sata, mali i veliki odmor). Podržane su **A/B smjene** koje se izmjenjuju tjedno.
  - Raspored sati s obojenim predmetima: klik na polje i odabir predmeta, uz automatski prelazak na idući sat.
  - Izvanškolske aktivnosti i **važni datumi**: testovi, zadaće, izleti, “nema nastave”. Datum može dodati i podsjetnik u tjedni plan.
  - Na **Dashboardu** je kartica “Djeca danas” s podacima *U školi 08:00 – 12:35*, trenutnim satom i nadolazećim testovima.

### Pohrana (skalabilno)
- Recepti, DIY projekti i vlastiti napici spremaju se kao **zasebni dokumenti** (`planners/{uid}/docs/{id}`), pa više ne vrijedi limit od 1 MB za cijeli planner.
- **Slike** se u pregledniku smanje (≈200–500 KB plus sličica) i spremaju u `planners/{uid}/blobs/{id}`. Ovo radi na besplatnom Firebase planu, bez Storagea.
- Dijeljeni planner vidi i recepte, projekte i slike.

> ⚠️ **Obavezno ponovno objavi `firestore.rules`** (Firestore → Rules → zalijepi → Publish). Bez novih pravila recepti, DIY i slike se neće spremati u oblak.

## Postavljanje (jednom)

1. Uploadaj sve datoteke i mapu `vendor/` u repo (`planner.html`, `app.js`, `store.js`, `drinks-data.js`, `kitchen.js`, `diy.js`, `kids.js`, `boot.js`, `features.css`, `firebase.js`, `vendor/sortable.min.js`, `index.html`, `sw.js`, `manifest.webmanifest`, `icon*.png`, `icon.svg`, `firestore.rules`).
2. **GitHub Pages**: Settings → Pages → Source: *Deploy from a branch* → `main` / root. Adresa će biti `https://hrvojekladnicki.github.io/Planner/`.
3. **Firebase Console → Authentication → Settings → Authorized domains**: dodaj `hrvojekladnicki.github.io`. Bez toga Google prijava ne radi s te adrese.
4. **Firestore → Rules**: zalijepi sadržaj `firestore.rules` → **Publish**. Ovo je obavezno: pravila su jedino što štiti podatke, a ujedno omogućuju dijeljenje.
5. U Planneru otvori **Postavke → Sigurnosna provjera** i provjeri da je sve ✅.
6. Na mobitelu otvori adresu, prijavi se istim Google računom i (po želji) odaberi *Dodaj na početni zaslon*.

Za lokalno testiranje bez prijave otvori `planner.html?local=1`. Podaci se tada spremaju samo u taj preglednik.

## Kako radi real-time sinkronizacija

- Svi podaci su u jednom Firestore dokumentu `planners/{uid}`. Svaki otvoreni uređaj sluša promjene preko `onSnapshot`, pa se izmjena s mobitela na računalu vidi za oko 1 s (i obrnuto).
- Spremanje kreće 400 ms nakon zadnje promjene, a odmah kad aplikacija ode u pozadinu ili se zatvori.
- **Offline cache** (IndexedDB): Planner se učita trenutno, radi bez interneta i sam se sinkronizira kad se veza vrati.
- Vlastiti upisi se ne primjenjuju dvaput. Ako promjena s drugog uređaja stigne dok tipkaš ili povlačiš zadatak, prikaz se osvježi tek kad završiš.
- Aktivni tab više nije dio sinkroniziranih podataka, pa promjena taba na mobitelu ne prebacuje tab na računalu.

**Ograničenje**: ako na dva uređaja mijenjaš nešto u istoj sekundi, vrijedi zadnja spremljena verzija. Za osobnu upotrebu to je rijetko. Rješenje bi bila podjela na zasebne dokumente po zadatku.

**Obavijesti kad je Planner zatvoren**: najjednostavnije preko Google Calendar synca, jer događaj s podsjetnikom javlja Google Calendar aplikacija. Bez toga Planner prikazuje podsjetnike kad ga otvoriš ili dok je otvoren.
