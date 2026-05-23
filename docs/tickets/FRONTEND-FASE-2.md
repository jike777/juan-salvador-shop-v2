# [EPIC] Frontend — Fase 2 refactor

> **Asignar a:** Frontend Developer
> **Prioridad:** P1 — bloquea release v2.0 estable
> **Estimación total:** 8–12h (5 sub-tareas, ejecutables en orden)
> **Stack:** vanilla HTML + CSS custom properties + ES Modules + Firebase (no framework, sin build step)

---

## Contexto rápido

Repo `juan-salvador-shop-v2` es la reescritura del e-commerce educativo `html-css-portafolio2`. En Fase 1 ya se hizo:

- Design system completo en `css/tokens.css` (paleta black + gold, spacing 4/8, type scale, motion).
- Migración de hex sueltos a `var(--*)` en style.css y colecciones.css.
- HTML semántico (`<header>`, `<nav aria-label>`, `<main>`) en 9 páginas + ARIA en iconos.
- OG + Twitter Cards + JSON-LD ClothingStore/Product.
- Reorganización a folders `css/` y `js/`.
- Hero del `index.html` con jerarquía h1-first.
- Auth-gate forzado removido del home (público por default).

**Live:** https://jike777.github.io/juan-salvador-shop-v2/
**GH Pages auto-deploya cada push a `main`** (~1 min).

Esta Fase 2 cubre la deuda documentada en `README.md#deuda-pendiente`.

---

## Pre-lectura obligatoria

Antes de tocar código, leer en este orden:

1. `README.md` — stack, estructura, tokens. **15 min.**
2. `css/tokens.css` — todo el design system. **5 min.**
3. `css/style.css` líneas 1530–1565 (la sección documentada `MEDIA QUERIES`) — explica los 4 breakpoints canónicos y la deuda actual. **5 min.**
4. `js/script.js` — entender qué hace (es el monolito a partir). **10 min.**
5. Commits clave en `git log`:
   - `fa1d8ea` (Fase 1) — el grueso de los tokens y semántica
   - `18156d6` (fix home) — explica por qué el auth-gate se removió
   - `c53212c` (refactor structure) — el último estado

Si algo no está en estos archivos, asumir convenciones de **NO Tailwind, NO build step, vanilla puro.**

---

## Sub-tareas (ejecutar en orden)

### 2.1 — Consolidar breakpoints a los 4 canónicos · 3–4h

#### Estado actual
`css/style.css` tiene 13 breakpoints superpuestos (360 / 393 / 477 / 480 / 600 / 712 / 767 / 768 / 799 / 1024 / 1136 / 1279 / 1366 px). Hay duplicación, rangos solapados y un par que originalmente eran nested `@media` inválidos (ya extraídos en Fase 1).

#### Objetivo
Migrar todos los `@media` blocks a los 4 breakpoints definidos en `tokens.css`:

| Token  | Valor  | Cuándo usarlo |
|---|---|---|
| sm  | 640px  | phones grandes |
| md  | 768px  | tablet portrait |
| lg  | 1024px | tablet landscape / laptop chico |
| xl  | 1280px | desktop |

(`2xl: 1440px` queda como opcional para layouts ultra-amplios — no migrar todo a 2xl.)

#### Cómo
1. Inventariar cada `@media` block existente (línea + ancho + propósito).
2. Mapear al breakpoint canónico más cercano:
   - `≤360` / `≤393` / `≤477` / `≤480` → `(max-width: 640px)` (mobile)
   - `≤600` / `≤767` / `≤768` / `≤799` → `(max-width: 768px)` (tablet portrait)
   - `≤1024` / `≤1136` → `(max-width: 1024px)` (tablet landscape)
   - `≤1279` / `≤1366` → `(max-width: 1280px)` (laptop)
3. Mergear blocks adyacentes que apuntan al mismo BP final.
4. Convertir `max-width` a `min-width` donde el patrón sea **mobile-first** (recomendado pero no obligatorio).

#### Acceptance criteria
- [ ] Cada `@media` block en `css/style.css` y `css/colecciones.css` usa SOLO uno de: 640, 768, 1024, 1280 (o 1440).
- [ ] `grep -E "@media \([^)]*px" css/*.css | grep -oE "[0-9]+px" | sort -u` retorna solo esos 5 valores.
- [ ] El site **no se rompe visualmente** en 5 viewports: 375 (iPhone SE), 414 (iPhone Pro Max), 768 (iPad portrait), 1024 (iPad landscape), 1440 (desktop).
- [ ] La escala de header, hero, product cards, footer y carrito sigue intacta en cada uno.

#### QA obligatorio
Probar manualmente en Chrome DevTools device toolbar (5 viewports listed). Tomar 5 screenshots y adjuntarlos al PR. **No mergear sin screenshots.**

#### Riesgo
🔴 **Alto.** El refactor puede romper layouts. Por eso queda como sub-tarea 2.1 y no como un commit autónomo. Hacer en **una rama feature** y solo mergear si los 5 screenshots están limpios.

---

### 2.2 — Lazy load + paginación de productos en shop.html · 2h

#### Estado actual
`js/script.js` líneas 40–67: hace `fetch('productos.json')` (37KB) y luego `innerHTML +=` en loop para **los 660 productos**. Esto:
- Bloquea el main thread mientras parsea el JSON
- Inyecta 660 nodos DOM al toque (memory hog)
- Las imágenes cargan eager (no `loading="lazy"` en las dinámicas)

#### Objetivo
Mostrar 24 productos iniciales. Cargar más en scroll o con un botón "Cargar más".

#### Cómo
- En `js/script.js`, después del `fetch().then(data => ...)`, slice a los primeros 24.
- Agregar un botón "Cargar más" debajo de `.pro-container` que renderice los siguientes 24.
- Cada `<img>` dinámico debe tener `loading="lazy"` y `decoding="async"`.
- Alternativa: `IntersectionObserver` sobre un sentinel al final del grid → autocarga. Más elegante.

#### Acceptance criteria
- [ ] Home muestra 24 productos en el primer paint.
- [ ] Botón "Cargar más" funcional, o autocarga con sentinel.
- [ ] Lighthouse score Performance > 80 en mobile (antes está ~50–60 estimado).
- [ ] Imágenes de productos cargan lazy verificable en Network tab.

#### Riesgo
🟡 Medio. Hay que mantener el HTML que `script.js` genera idéntico al actual o el CSS de `.pro` se rompe.

---

### 2.3 — Split de `js/script.js` en módulos por feature · 2h

#### Estado actual
`js/script.js` (~250 líneas) hace 6 cosas:
1. Renderiza productos del home (líneas 25–67)
2. Carga product detail page (líneas 70–~140)
3. Maneja el menú hamburguesa (líneas 10–22)
4. Auth state listener (líneas 187–217)
5. Logout button handler (líneas 220–235)
6. Otras misceláneas

Es el monolito típico. Cada cambio futuro toca el mismo archivo.

#### Objetivo
Split en módulos cohesivos. Manteniendo el patrón ES Modules sin bundler.

#### Estructura propuesta
```
js/
├── main.js                  ← orquestador (import de los módulos en el orden correcto)
├── modules/
│   ├── nav.js              ← menú hamburguesa, navbar active state
│   ├── products-grid.js    ← render del home grid (con sub-tarea 2.2 ya integrada)
│   ├── product-detail.js   ← lógica de product.html
│   └── auth-ui.js          ← onAuthStateChanged + user menu show/hide + logout
├── firebase-config.js      ← se queda igual
├── utils.js                ← se queda igual
└── ... (cart.js, signing.js etc se quedan donde están)
```

#### Cómo
- Crear `js/main.js` que importa cada módulo.
- Mover los blocks correspondientes a cada `js/modules/*.js`.
- Cada módulo exporta una función `init(config?)` y `main.js` las llama en `DOMContentLoaded`.
- Actualizar refs en `*.html`: `<script type="module" src="js/script.js">` → `<script type="module" src="js/main.js">`.

#### Acceptance criteria
- [ ] `js/script.js` ya no existe.
- [ ] `js/main.js` es entry point único.
- [ ] Funcionalidad del home idéntica antes/después (productos cargan, login UI funciona, hamburguesa abre).
- [ ] Cada módulo < 80 líneas.
- [ ] No se introducen build steps.

#### Riesgo
🟡 Medio. Si se olvida un import o un selector, algo deja de funcionar silenciosamente. Probar todas las features manualmente.

---

### 2.4 — Dark mode · 1.5h

#### Estado actual
`css/tokens.css` ya tiene la paleta pensada para dual mode (ink-50 vs ink-950 son los extremos). Falta el media query + las variantes.

#### Objetivo
Soporte completo a `prefers-color-scheme: dark`. Sin toggle manual (eso es Fase 3).

#### Cómo
En `css/tokens.css`, agregar al final:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--ink-950);
    --color-foreground: var(--ink-50);
    --color-primary: var(--ink-50);
    --color-on-primary: var(--ink-950);
    --color-secondary: var(--ink-300);
    --color-muted: var(--ink-500);
    --color-border: var(--ink-700);
    --color-surface: var(--ink-900);

    --glass-bg: rgba(28, 25, 23, 0.55);
    --glass-border: rgba(255, 255, 255, 0.1);
  }
}
```

Después auditar todos los componentes:
- Header background (actualmente `--ink-50` fijo) → ¿queda visible en dark?
- Texto en cards de productos
- Botones (`--ink-900` background, blanco texto — invertir en dark)
- Banner overlays — el contraste cambia

#### Acceptance criteria
- [ ] Toggle del OS a dark mode invierte la UI sin romper nada.
- [ ] Contraste AA (4.5:1) verificado en 5 componentes: hero, product card, footer, button primary, navbar.
- [ ] Imágenes con fondo blanco no quedan flotando en dark (agregar background neutro si hace falta).

#### Riesgo
🟢 Bajo. Los tokens son la abstracción correcta. Solo hay que auditar visual.

---

### 2.5 — Font Awesome → Lucide SVG · 1.5h

#### Estado actual
Cada HTML carga **dos** stylesheets de Font Awesome (v5.15.4 + v5.10.0 Pro):
```html
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css">
```
Esto trae ~440KB de CSS + WOFF2 para usar **9 iconos únicos**: shopping-cart, times, outdent, facebook, twitter, instagram, pinterest, youtube, tiktok.

#### Objetivo
Reemplazar Font Awesome con SVG inline (Lucide u Heroicons).

#### Cómo
1. Inventariar los iconos usados: `grep -roE 'fa-[a-z-]+' . --include="*.html"` → lista de clases FA en uso.
2. Por cada uno, buscar equivalente en Lucide (lucide.dev): shopping-cart, x, menu, facebook, twitter, instagram, pinterest, youtube. TikTok no está en Lucide — usar SVG custom o Simple Icons.
3. Reemplazar cada `<i class="far fa-X"></i>` por el SVG inline (con `aria-hidden="true"` o `<title>` según el caso).
4. Remover los 2 `<link>` de FA del `<head>` de cada HTML.

#### Acceptance criteria
- [ ] Ningún HTML linkea `fontawesome.com` ni tiene `class="fa fa-..."`.
- [ ] Los 9 iconos se renderizan idénticos en tamaño y posición.
- [ ] Network tab muestra menos requests al cargar la home (~6 menos sin Font Awesome).
- [ ] Lighthouse Performance sube al menos 5 puntos en mobile.

#### Riesgo
🟢 Bajo. Tedioso pero mecánico.

---

## Definition of done (epic)

- [ ] Las 5 sub-tareas tienen sus acceptance criteria ✅.
- [ ] El site live (`https://jike777.github.io/juan-salvador-shop-v2/`) sigue funcionando sin regresiones visuales (carrito, login, navegación, productos).
- [ ] README.md actualizado: tachar los 5 ítems en "Deuda pendiente".
- [ ] Cada sub-tarea es un commit separado con mensaje convencional (`refactor(css):`, `feat(perf):`, etc).
- [ ] PR a `main` con screenshots de antes/después en mobile + desktop.

---

## Out of scope

Estas cosas **NO** son parte de este ticket. Si aparecen, dejarlas como TODO y mover a Fase 3:

- ❌ Service Worker / PWA / offline support
- ❌ Toggle manual de dark mode (botón en navbar)
- ❌ JSON-LD Product dinámico desde productos.json
- ❌ og:image dedicada (diseño visual 1200×630)
- ❌ Migrar a un framework (Astro, Vite, Next)
- ❌ Cambiar la paleta o tipografías
- ❌ Tocar `img/` (paths estables, no mover)
- ❌ Rediseñar el hero o componentes (el visual aprobado vive en `C:\Users\jimmy\Desktop\juan-salvador-hero-mock.html` como referencia)

---

## Risk register

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Breakpoints rompen layouts en algún viewport | Alta | Screenshots obligatorios en 5 viewports antes de mergear |
| Split de script.js rompe imports / lifecycle | Media | Testear cada feature manualmente: home productos, product detail, login, logout, hamburguesa |
| Lazy load cambia la altura del grid y rompe el footer sticky | Baja | Verificar layout antes/después con DevTools |
| Dark mode no respeta contraste en algunas imágenes | Media | Auditar con Lighthouse + WAVE en ambos modos |
| Reemplazo de FA olvida un icono | Media | Grep automatizado (ver sub-tarea 2.5 paso 1) |

---

## QA checklist final (antes de mergear)

```
✅ npm/python local server corre sin errores en consola browser
✅ Productos del home cargan (mínimo 24, botón "Cargar más" funciona)
✅ Click en un producto navega a product.html con detalle correcto
✅ Login con Google completa el flujo y muestra "Usuario ▼" en navbar
✅ Logout vuelve al estado anónimo
✅ Carrito sigue firmando con HMAC (cart.js intacto, no se rompió signing)
✅ WhatsApp FAB visible y clickable
✅ Footer accesible desde cualquier página
✅ 5 screenshots en device toolbar (375 / 414 / 768 / 1024 / 1440)
✅ Lighthouse mobile: Performance > 80, A11y > 95, Best Practices > 90, SEO > 95
✅ HTML válido (W3C validator no escupe errors críticos)
✅ Zero console errors / warnings en browser
```

---

## Cómo contactar si hay duda

Si algo no está claro:
1. **NO** asumir patrones de otros frameworks (este es vanilla).
2. **NO** introducir build steps, dependencias npm de runtime, o transpilers.
3. **Sí** preguntar antes de tocar `productos.json`, `firebase-config.js` o el carrito HMAC (`cart.js` + `signing.js`).
4. **Sí** documentar en cada commit message las decisiones no obvias.

**Repo:** https://github.com/jike777/juan-salvador-shop-v2
**Owner / PM:** Jimmy Orlando Cortés (@jike777)
