# Sigurnosni izvještaj — Planner

Datum: 3. 11. 2026.

## Ukratko

| Područje | Stanje | Napomena |
|---|---|---|
| Pristup podacima bez prijave | ✅ Zaštićeno (uz nova pravila) | Ovisi isključivo o Firestore Rules. **Obavezno objavi `firestore.rules`.** |
| Pristup tuđim računom | ✅ Zaštićeno | Vidiš samo svoj dokument i plannere koji su eksplicitno podijeljeni s tvojim e-mailom. |
| Dijeljenje | ✅ Kontrolirano | Gost može čitati i uređivati sadržaj. Ne može mijenjati popis dijeljenja ni vlasnika, ni obrisati planner. |
| Ubacivanje koda kroz podatke (XSS) | ✅ Testirano | Pronađena je 1 rupa (`javascript:` link u web stranicama) i popravljena je. Na to se dodaje CSP. |
| Ubacivanje tuđih skripti | ✅ CSP | Skripte se smiju učitati samo s vlastite stranice i Googlea. |
| Ugrađivanje u tuđu stranicu (clickjacking) | ✅ Zaštićeno | Aplikacija se ne prikazuje unutar tuđeg okvira. |
| Izmjena koda u repozitoriju | ⚠️ Ovisi o tvom GitHub računu | Vidi preporuke niže. |
| Firebase API ključ u kodu | ℹ️ Normalno | Ključ je javan po dizajnu i sam ne daje pristup podacima. Preporučuje se ograničiti ga na tvoju domenu. |

## Što je testirano

### 1. Napadi ubacivanjem koda (XSS) — automatski test
U svako polje koje korisnik može upisati ubačeni su zlonamjerni sadržaji: naziv liste, stavka, link, bilješka, hitna stavka, zadatak dana, naslov i redak bilješke, web stranica, kategorija i postavke kalendara. Primjeri: `<img onerror=…>`, `<svg onload=…>`, `</textarea><img …>`, `javascript:` linkovi.
Zatim je otvoren svaki prikaz: dashboard, povijest, lista, web stranice, notes, bilješka, prozori za uređivanje, postavke i podsjetnici.

- **Nalaz:** link web stranice spremljen kao `javascript:…` bio je klikabilan. To bi bilo opasno kad dijeliš planner, jer bi gost mogao podmetnuti link koji izvršava kod u tvom pregledniku.
- **Popravak:** svi linkovi sada prolaze kroz filtar `safeUrl()`, koji dopušta samo `https:`, `http:`, `mailto:` i `tel:`.
- **Nakon popravka:** 0 izvršenih skripti, 0 `on…` atributa, 0 `javascript:` linkova, 0 CSP prekršaja u svim prikazima.

### 2. Firestore pravila — ugrađena provjera uživo
Iz ovog razvojnog okruženja nema pristupa tvom Firebase projektu. Zato je provjera ugrađena u aplikaciju (**Postavke → Sigurnosna provjera**) i radi na pravom projektu iz tvog preglednika:

1. čitanje tvog plannera **bez prijave** → mora biti odbijeno
2. popis svih plannera **bez prijave** → mora biti odbijeno
3. prijavljeni korisnik čita **tuđi** planner → mora biti odbijeno
4. prijavljeni korisnik izlistava **sve** plannere → mora biti odbijeno
5. prijavljeni korisnik **piše** u tuđi planner → mora biti odbijeno (ako prođe, testni zapis se odmah briše)
6. može li **stranac napraviti račun** (anonimno ili e-mailom) i s njim čitati tvoj planner (testni račun se odmah briše)
7. HTTPS, CSP, vanjske skripte, clickjacking

Logika provjere testirana je na simuliranom sigurnom poslužitelju (sve ✅) i simuliranom otvorenom poslužitelju (svih 7 testova pristupa ❌). Provjera dakle prepoznaje oba slučaja.

> **Važno:** stara verzija nije imala datoteku s pravilima, pa ne znam kakva su pravila trenutno postavljena u Firebaseu. Ako su ostala na zadanom “test mode” (`allow read, write: if request.time < …`), podaci su bili otvoreni svima do isteka tog datuma. Pokreni provjeru odmah nakon objave.

### 3. Pregled koda
- Sav korisnički sadržaj prolazi kroz `esc()` prije prikaza. URL-ovi prolaze kroz `safeUrl()`.
- Nema `eval`, `new Function` ni inline skripti. Nema `onclick` ni `onerror` atributa.
- Treće strane: samo Google (Firebase SDK s `gstatic.com`, verzija zaključana na 10.12.2; Google Identity samo kad uključiš kalendar) i Google Fonts (CSS). SortableJS je **kopiran u repo** (`vendor/`), pa ne ovisi o CDN-u.
- Token za Google Calendar čuva se samo u `sessionStorage` te kartice (~1 h), ne u bazi.
- Odjava briše `sessionStorage`. Firebase prijava i offline kopija ostaju u pregledniku dok se ne odjaviš.

## Može li mi netko ubaciti virus u kod?

Planner je statična stranica na GitHub Pagesu. Kod se može promijeniti **samo** pushom u tvoj repozitorij. Realni rizici, od najvećeg prema najmanjem:

1. **Preuzimanje tvog GitHub računa** (ukradena lozinka ili token). Zaštita:
   - uključi 2FA (najbolje passkey ili aplikaciju za autentifikaciju): GitHub → Settings → Password and authentication
   - provjeri **Settings → Collaborators** (nitko osim tebe), **Deploy keys** (prazno) i **Settings → Applications** (makni aplikacije koje ne koristiš)
   - povremeno pogledaj popis commitova: nepoznat commit = alarm
   - po želji: Settings → Branches → zaštita grane `main`
2. **Kompromitirana vanjska skripta.** Nakon ove verzije jedine su Googleove (Firebase i Identity). CSP blokira sve ostale izvore.
3. **Podmetnut sadržaj kroz dijeljeni planner** (XSS). Testirano i blokirano escapingom, `safeUrl()` filtrom i CSP-om.

## Preporuke (redom važnosti)

1. **Objavi pravila**: Firebase Console → Firestore Database → Rules → zalijepi `firestore.rules` → Publish.
2. **Pokreni ugrađenu provjeru** (Postavke → Sigurnosna provjera) i provjeri da je sve ✅.
3. **Ograniči API ključ**: Google Cloud Console → APIs & Services → Credentials → Browser key → Application restrictions: *Websites* → `https://hrvojekladnicki.github.io/*` (i `https://planner-96d7c.firebaseapp.com/*`).
4. **Isključi nekorištene načine prijave**: Firebase → Authentication → Sign-in method. Ostavi samo Google.
5. **Authorized domains**: u Firebase Authentication ostavi samo `localhost`, `planner-96d7c.firebaseapp.com` i `hrvojekladnicki.github.io`.
6. **2FA na GitHubu i Google računu.**
7. Prije dijeljenja napravi **sigurnosnu kopiju** (Postavke → Sigurnosna kopija). Gost ima pravo uređivanja, a povijest verzija ne postoji.
8. (Napredno) **Firebase App Check** s reCAPTCHA Enterprise: dodatno otežava korištenje tvog projekta izvan tvoje stranice.

## Poznata ograničenja

- Podaci u Firestoreu su šifrirani na Googleovim poslužiteljima, ali nisu end-to-end šifrirani: Google ih tehnički može pročitati.
- Gost s kojim dijeliš vidi **cijeli** planner (sve liste, bilješke i povijest). Dijeljenje pojedinih lista nije podržano.
- Ako CSP zbog neke buduće promjene Googlea blokira prijavu, u konzoli preglednika pojavit će se poruka “Content Security Policy”. Privremeno rješenje: obrisati `<meta http-equiv="Content-Security-Policy" …>` iz `planner.html`.
