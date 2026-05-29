# Holdet — Vue 3 + Pinia + Vite

NHL-inspireret holdhjemmeside bygget med Vue 3, Pinia state management, Vue Router og Vite.

## Stack

| Teknologi | Formål |
|---|---|
| **Vue 3** (Composition API) | UI framework |
| **Pinia** | State management (auth, program, regler-tab) |
| **Vue Router** | Klient-side navigation |
| **Vite** | Dev server + build tool |
| **GitHub Actions** | Auto-deploy til GitHub Pages ved push til `main` |

---

## Kom i gang

### 1. Installer afhængigheder
```bash
npm install
```

### 2. Kør lokalt
```bash
npm run dev
```
Åbn `http://localhost:5173`

### 3. Byg til produktion
```bash
npm run build
```
Output i `/dist`

---

## Deploy til GitHub Pages

1. Opret et **public** repo på GitHub
2. Push koden:
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/DITBRUGERNAVN/REPO.git
git push -u origin main
```
3. Gå til repo → **Settings** → **Pages** → Source → **GitHub Actions**

Din side deployes automatisk ved hvert push til `main`. URL:
`https://DITBRUGERNAVN.github.io/REPO/`

> **Vigtigt:** Hvis du bruger et sub-path (ikke custom domain), skal du sætte `base` i `vite.config.js`:
> ```js
> base: '/REPO-NAVN/'
> ```

---

## Pinia Stores

### `src/stores/auth.js`
Gemmer Holdsport credentials (email, password, teamId) i memory for sessionen.
- `isLoggedIn` — computed: true når alle tre felter er udfyldt
- `basicAuthHeader` — computed: Base64-encoded til API-kald
- `setCredentials(e, p, t)` — gem login
- `clearCredentials()` — log ud

### `src/stores/program.js`
Henter og cacher aktiviteter fra Holdsport API.
- `activities` — array af aktiviteter
- `loading` / `error` — UI-states
- `isStale` — computed: re-fetch hvis >5 min siden sidst
- `fetchActivities(forceRefresh?)` — henter fra API
- `clearActivities()` — ryd cache

### `src/stores/regler.js`
Tracker hvilken rules-tab der er aktiv (generelle / burger).
- `activeTab` — 'generelle' | 'burger'
- `setTab(tab)` — skift tab (bruges også fra NavBar dropdown)

---

## Tilpasning

### Skift holdnavn
Opdatér `<title>` i `index.html` og logoet i `NavBar.vue`.

### Tilføj spillere
Åbn `src/views/HoldetView.vue` og tilføj til `staff` eller `players` array.

### Tilføj profilbilleder
Læg billeder i `public/images/` og angiv `image: '/images/navn.jpg'` på MemberCard.

### Skift farver
Alle design tokens er i `src/assets/css/main.css` under `:root {}`.

### Regler
Rediger `generelleRegler` og `burgerRegler` arrays i `src/views/ReglerView.vue`.

---

## Filstruktur

```
src/
├── main.js                  # App entry — registrerer Vue, Pinia, Router
├── App.vue                  # Root component
├── router/index.js          # Alle routes
├── stores/
│   ├── auth.js              # Holdsport credentials
│   ├── program.js           # Aktiviteter fra API
│   └── regler.js            # Aktiv rules-tab
├── components/
│   ├── NavBar.vue           # Sticky nav med dropdown
│   ├── SiteFooter.vue       # Footer
│   ├── RuleCard.vue         # Enkelt regelkort
│   ├── MemberCard.vue       # Holdmedlem-kort
│   └── ActivityCard.vue     # Aktivitetskort (Program)
├── views/
│   ├── HomeView.vue         # Forside
│   ├── NySpillerView.vue    # Ny spiller guide
│   ├── ReglerView.vue       # Regler med tabs
│   ├── HoldetView.vue       # Holdmedlemmer
│   ├── KontaktView.vue      # Kontaktinfo
│   └── ProgramView.vue      # Live Holdsport program
└── assets/css/main.css      # Global CSS + design tokens
```
