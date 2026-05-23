# Juan Salvador's Shop — v2

> Rebuild del e-commerce educativo `html-css-portafolio2` con design system, accesibilidad y SEO modernos. Stack vanilla (HTML + CSS + JS + Firebase) — sin build step.

**Live:** https://jike777.github.io/juan-salvador-shop-v2/
**Repo origen:** https://github.com/jike777/html-css-portafolio2 (deprecated)

---

## Por qué v2

El repo original tenía:
- ~1850 líneas de CSS sin tokens, 20+ hex sueltos, 7 breakpoints superpuestos.
- 4 typos visibles en producción (`Satifechos`, `Mi cuanta`, `Iniciar Sección`, apóstrofes mal cerrados).
- HTML sin `<nav>` / `<main>`, iconos sin `aria-label`, headings invertidos.
- 0 metadata social (OG / Twitter Cards / JSON-LD).
- Auth-gate forzado en el home: cualquier visitante que no estuviera logueado era redirigido a `auth.html` antes de ver nada.

En vez de refactorizar en branches del repo viejo, se arrancó este v2 con baseline limpio y un sistema de diseño coherente.

---

## Stack

| Capa | Decisión |
|---|---|
| Estructura | HTML semántico (`<header>`, `<nav>`, `<main>`, `<footer>`) — sin framework |
| Estilos | CSS nativo con tokens (`css/tokens.css`) — sin Tailwind, sin build |
| Tipografía | Playfair Display (display) + Inter (sans) vía Google Fonts |
| Paleta | Premium black + gold (stone-50 / ink-900 / gold-600) |
| JS | ES Modules vanilla, sin bundler |
| Backend | Firebase Auth + (opcional) Cloud Functions en `functions/` |
| Datos | `productos.json` estático (660 líneas, ~37KB) |
| Pagos | ePayco checkout (sandbox, vía `<script src="checkout.epayco.co">`) |
| Hosting | GitHub Pages (rama `main`, root path) |

---

## Estructura del proyecto

```
juan-salvador-shop-v2/
├── index.html               ← Home (público, sin auth-gate)
├── shop.html / product.html / cart.html / auth.html
├── about.html / blog.html / contact.html
├── coleccion.html / ofertas.html
├── 404.html / gracias.html / confirmaicon.html
│
├── css/
│   ├── tokens.css           ← Source of truth: paleta, spacing 4/8,
│   │                          type scale, radius, shadows, motion
│   ├── style.css            ← Estilos globales del sitio (~2400 líneas)
│   └── colecciones.css      ← Estilos específicos de coleccion/ofertas
│
├── js/
│   ├── firebase-config.js   ← Init de Firebase (Auth + Google Provider)
│   ├── auth.js              ← Login con Google + manejo de sesión
│   ├── script.js            ← Lógica del home + nav + product detail
│   ├── cart.js              ← Carrito (con firma HMAC vía signing.js)
│   ├── signing.js           ← HMAC-SHA256 para integridad de carrito
│   ├── utils.js             ← Helpers (renderEstrellas, etc.)
│   ├── product.js           ← Página individual de producto
│   ├── coleccion.js / ofertas.js / productos-categoria.js
│   ├── whatsapp-fab.js      ← Botón flotante de WhatsApp
│   └── verificarImagenes.js ← Utility Node script (no se carga en browser)
│
├── img/                     ← Assets visuales (no se movió — paths estables)
│   ├── home/ banner/ products/ pay/ features/ favicon/
│
├── productos.json           ← Datos de productos (fetched por script.js)
├── functions/               ← Firebase Cloud Functions (opcional)
├── public/                  ← Firebase hosting target (alternativo a GH Pages)
├── firebase.json / .firebaserc
└── README.md
```

---

## Sistema de diseño

Tokens definidos en `css/tokens.css`. **No usar hex sueltos en componentes** — referenciar siempre `var(--*)`.

### Paleta

```css
/* Neutros warm (stone) */
--ink-950  #0C0A09   /* text max contrast */
--ink-900  #1C1917   /* botones primarios, headers */
--ink-700  #44403C   /* texto secundario */
--ink-500  #78716C   /* muted, labels */
--ink-300  #D6D3D1   /* borders, dividers */
--ink-100  #E8ECF0   /* surfaces */
--ink-50   #FAFAF9   /* background página */

/* Gold (único acento — además del negro) */
--gold-700  #854D0E   /* hover */
--gold-600  #A16207   /* primary accent */
--gold-400  #D4A017   /* highlights, ratings */

/* Semantic */
--destructive  #DC2626
--whatsapp     #25D366  /* brand externa — no tocar */
```

### Spacing (escala 4/8)
`--s-1` (4px) → `--s-24` (96px). Steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

### Type scale
`--t-xs` (0.75rem) → `--t-6xl` (4rem). Display headlines: `--t-display: clamp(2.75rem, 7vw, 5.75rem)`.

### Breakpoints canónicos
| Token | Min width |
|---|---|
| sm  | 640px  |
| md  | 768px  |
| lg  | 1024px |
| xl  | 1280px |
| 2xl | 1440px |

> **Deuda Fase 2:** quedan ~13 breakpoints legacy (360/393/477/480/600/712/767/799/1024/1136/1279/1366) por consolidar a los 4 canónicos. Documentado in-CSS en la sección "MEDIA QUERIES".

---

## Correr local

Por la arquitectura de `fetch('productos.json')`, **no funciona abrir el HTML por `file://`** — CORS lo bloquea. Necesitás un servidor HTTP local.

### Opción 1 — Python
```bash
cd juan-salvador-shop-v2
python -m http.server 8080
# Abrir http://localhost:8080
```

### Opción 2 — Node `serve`
```bash
npx serve .
```

### Opción 3 — VS Code Live Server
Instalá la extensión "Live Server" → click derecho sobre `index.html` → "Open with Live Server".

---

## Deploy

**Producción:** GitHub Pages está habilitado para `main` rama root.
- Cada push a `main` dispara rebuild automático (~1 min).
- URL: https://jike777.github.io/juan-salvador-shop-v2/
- Build status: `gh api repos/jike777/juan-salvador-shop-v2/pages/builds/latest`

---

## Decisiones arquitectónicas

### 1. Home público (sin auth-gate)
El repo original redirigía a `auth.html` a cualquier visitante sin login. Anti-UX para e-commerce. v2 sigue el patrón de Amazon/MercadoLibre/Zara: home y catálogo públicos, login solo requerido en flujos sensibles (checkout, agregar al carrito).

Ver `js/script.js:209` — el branch `else` de `onAuthStateChanged` ya no redirige.

### 2. Tokens > Tailwind
Tailwind agregaría un build step (PostCSS, JIT) que rompe la simplicidad del proyecto educativo. CSS custom properties nativas cubren el 95% del beneficio sin tooling.

### 3. Vanilla > Framework
El proyecto es trabajo de grado universitario. Mantener vanilla deja visible la arquitectura: cómo se carga Firebase, cómo se inyecta el carrito, cómo funciona el fetch de productos. Un framework abstrae todo eso.

### 4. ES Modules sin bundler
`<script type="module">` carga Firebase desde el CDN oficial y los archivos locales son importados con `from './...'`. Funciona en todos los browsers modernos sin Webpack/Vite/Rollup.

---

## Deuda pendiente (Fase 2 +)

- [ ] Consolidar ~13 breakpoints superpuestos a los 4 canónicos
- [ ] Heading hierarchy en headers internos de subpáginas (hero del index ya arreglado)
- [ ] Migrar `<section id="header">` restante en algunas subpáginas a `<header>`
- [ ] Lazy load de productos (paginación / infinite scroll en `shop.html`)
- [ ] Dark mode (variantes en `tokens.css` ya parcialmente listas)
- [ ] JSON-LD Product dinámico (actualmente genérico — debería leer de `productos.json`)
- [ ] og:image dedicada (actualmente apunta a logo3.webp — generar imagen 1200×630)
- [ ] Service Worker para PWA + offline
- [ ] Split de `js/script.js` (~250 líneas) en módulos por feature
- [ ] Sustituir Font Awesome (440KB) por SVG inline o Lucide

---

## Créditos

**Developer:** Jimmy Orlando Cortés ([@jike777](https://github.com/jike777)) — Universidad CUN
**Refactor v2:** sesión asistida con Claude Code (Anthropic).

## Licencia

No especificada todavía. El código original era educativo (trabajo de grado).
