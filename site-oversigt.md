# Team Site — Projektdokument
*Senest opdateret: maj 2026*

---

## Status

| Del | Status |
|---|---|
| Vue 3 + Pinia + Vite grundstruktur | ✅ Bygget — `holdet-vue.zip` |
| GitHub Actions auto-deploy | ✅ Klar |
| NHL-inspireret design mockup | ✅ Godkendt — `mockup.html` |
| Ny Spiller-side | ✅ Bygget (`NySpillerView.vue`) |
| Regler med Generelle + Burger Cup tabs | ✅ Bygget (`ReglerView.vue`) |
| Holdet-side | ✅ Bygget (`HoldetView.vue`) |
| Kontakt-side | ✅ Bygget (`KontaktView.vue`) |
| Program-side med Pinia stores | ✅ Bygget (`ProgramView.vue`) |
| Design oversat til Vue CSS | ✅ `assets/css/main.css` |
| Cloudflare Worker proxy (Program-siden) | ⏳ Afventer |
| Rigtige navne, billeder, kontaktinfo | ⏳ Afventer — udfyldes manuelt |

---

## Stack

| Teknologi | Formål |
|---|---|
| **Vue 3** (Composition API) | UI framework |
| **Pinia** | State management (auth, program, regler-tab) |
| **Vue Router** | Klient-side navigation (hash history) |
| **Vite** | Dev server + build tool |
| **GitHub Actions** | Auto-deploy til GitHub Pages ved push til `main` |

---

## Design — Godkendt retning

NHL-inspireret, mørkt tema med blå/hvide holdfarver.

**Farvepalette:**
```
--navy:        #001433   (primær baggrund)
--navy2:       #002060   (surface/kort)
--navy3:       #0a2d6e   (hover states)
--blue:        #1560bd   (accent/knapper/navbar-linje)
--blue-light:  #3a8fd4   (detaljer, links, tal)
--white:       #f0f4f8   (brødtekst)
--white-pure:  #ffffff   (overskrifter)
--steel:       #7a9cb8   (muted tekst)
--muted:       #4a6a88   (meget dæmpet)
--border:      #0d2d55
--border2:     #1a3f6e
```

**Typografi:**
- Display/overskrifter: **Anton** (Google Fonts) — tung, bred, NHL-agtig
- Kondenseret UI: **Barlow Condensed** weight 600–900
- Brødtekst: **Barlow** weight 400–600

**Design-detaljer:**
- Hero: CSS-only is-rink tekstur, kæmpe jersey-nummer i baggrunden, kicker-linje over overskrift
- Stats-strip: Blå bar under hero med sæsontal
- Navbar: Sticky, navy baggrund, 2px blå bundlinje, kondenseret uppercase links med Regler-dropdown
- Kort: Navy2 baggrund, subtile borders, hover løfter 2px
- Sektionslabels: Uppercase med streg der løber til højre
- Sidetitler: Anton, uppercase, med blå accent-linje under

---

## Navigation

```
Forside → Ny Spiller → Regler ↓ → Holdet → Kontakt → Program
                             ├── Generelle Regler
                             └── Burger Cup Regler
```

Regler har dropdown i navbar. Tab-state styres via Pinia (`regler` store) så dropdown kan sætte aktiv tab før navigation.

---

## Sider

### Forside (`/`) — `HomeView.vue`
- Hero med is-rink tekstur og jersey-nummer i baggrunden
- Stats-strip (sæson, spillere, trænere, fremmødekrav)
- 5 navigationskort til alle sider

### Ny Spiller (`/ny-spiller/`) — `NySpillerView.vue`
- Info-box med tip
- 5 nummererede trin med cirkel-tal
- FAQ-sektion i bunden

### Regler (`/regler/`) — `ReglerView.vue`
- Tab-navigation styret af Pinia `regler` store
- **Generelle Regler:** 6 regler som `RuleCard` komponenter
- **Burger Cup:** Header med 🍔 ikon + 5 regler

### Holdet (`/holdet/`) — `HoldetView.vue`
- Sektion: Trænere & Stab
- Sektion: Spillertruppen
- `MemberCard` komponenter — understøtter foto eller emoji

### Kontakt (`/kontakt/`) — `KontaktView.vue`
- Kontaktkort med navn, rolle, telefon (klikbar), email (klikbar)
- Info-box om Holdsport som primær kommunikation

### Program (`/program/`) — `ProgramView.vue`
- Login-formular (gemmer i `auth` store)
- Efter login: aktivitetsliste via `program` store
- `ActivityCard` komponenter med dato, tid, sted, antal, RSVP-badge
- Loading spinner, fejlbesked, logout-knap
- CORS-advarsel med forklaring

---

## Pinia Stores

### `stores/auth.js`
Gemmer Holdsport credentials i memory for sessionen.

```js
// State
email, password, teamId

// Computed
isLoggedIn        // true når alle tre felter er udfyldt
basicAuthHeader   // Base64-encoded "Basic ..." header

// Actions
setCredentials(e, p, t)
clearCredentials()
```

### `stores/program.js`
Henter og cacher aktiviteter fra Holdsport API. Bruger `auth` store internt.

```js
// State
activities     // array af aktiviteter
loading        // boolean
error          // string | null
lastFetched    // timestamp

// Computed
hasActivities  // activities.length > 0
isStale        // true hvis >5 min siden sidst

// Actions
fetchActivities(forceRefresh?)
clearActivities()
```

### `stores/regler.js`
Tracker aktiv rules-tab. Sættes fra NavBar, læses i ReglerView.

```js
// State
activeTab   // 'generelle' | 'burger'

// Actions
setTab(tab)
```

---

## Komponenter

| Komponent | Fil | Props |
|---|---|---|
| NavBar | `NavBar.vue` | ingen — bruger router + regler store |
| SiteFooter | `SiteFooter.vue` | ingen |
| RuleCard | `RuleCard.vue` | `number`, `title`, `description` |
| MemberCard | `MemberCard.vue` | `name`, `role`, `emoji?`, `image?` |
| ActivityCard | `ActivityCard.vue` | `activity` (Holdsport API objekt) |

---

## Filstruktur

```
holdet-vue/
├── index.html
├── vite.config.js           ← sæt base: '/REPO-NAVN/' ved deploy
├── package.json
├── README.md
├── src/
│   ├── main.js              ← registrerer Vue + Pinia + Router
│   ├── App.vue              ← root, NavBar + RouterView + Footer
│   ├── router/index.js      ← alle 6 routes, hash history
│   ├── stores/
│   │   ├── auth.js
│   │   ├── program.js
│   │   └── regler.js
│   ├── components/
│   │   ├── NavBar.vue
│   │   ├── SiteFooter.vue
│   │   ├── RuleCard.vue
│   │   ├── MemberCard.vue
│   │   └── ActivityCard.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── NySpillerView.vue
│   │   ├── ReglerView.vue
│   │   ├── HoldetView.vue
│   │   ├── KontaktView.vue
│   │   └── ProgramView.vue
│   └── assets/css/main.css  ← alle design tokens + global CSS
└── .github/workflows/
    └── deploy.yml           ← Node 20, npm ci, npm run build, deploy /dist
```

---

## Deploy — trin for trin

```bash
# 1. Pak ud og installer
unzip holdet-vue.zip && cd holdet-vue && npm install

# 2. Kør lokalt
npm run dev   # → http://localhost:5173

# 3. Push til GitHub
git init && git add . && git commit -m "init"
git branch -M main
git remote add origin https://github.com/DITBRUGERNAVN/REPO.git
git push -u origin main

# 4. Aktiver GitHub Pages
# Repo → Settings → Pages → Source → GitHub Actions
```

**Vigtigt:** Hvis du ikke bruger custom domain, sæt i `vite.config.js`:
```js
base: '/REPO-NAVN/'
```

---

## Holdsport API — reference

```bash
# Find dit hold-ID
curl -u "din@email.dk:password" \
  -H "Accept: application/json" \
  https://api.holdsport.dk/v1/teams

# Hent aktiviteter
curl -u "din@email.dk:password" \
  -H "Accept: application/json" \
  "https://api.holdsport.dk/v1/teams/HOLDID/activities?per_page=20"
```

Dokumentation: https://github.com/Holdsport/holdsport-api

---

## Næste skridt

1. **Udfyld indhold** — rigtige navne i `HoldetView.vue` og `KontaktView.vue`
2. **Cloudflare Worker proxy** — så Program-siden virker i browseren (~10 linjer JS, gratis)
3. **Billeder** — profilfotos i `public/images/`, angiv `image: '/images/navn.jpg'` på MemberCard
4. **Custom domain** — CNAME-fil + DNS-indstilling hvis ønsket

---

## Filer i dette projekt

| Fil | Indhold |
|---|---|
| `holdet-vue.zip` | Komplet Vue 3 projekt klar til `npm install` |
| `mockup.html` | Interaktivt design-mockup (godkendt reference) |
| `site-oversigt.md` | Dette dokument |

---

## .gitignore

Læg denne fil i roden af repo'et:

```
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/

# Vite cache
.vite/
*.local

# Environment files — never commit secrets
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Test output
coverage/
```

