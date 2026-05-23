// 📌 Productos — Carga paginada (lazy load) de productos en home / shop.
// Renderiza en batches de PAGE_SIZE con IntersectionObserver sobre un sentinel
// al final del grid + botón "Cargar más" como fallback accesible.
//
// Extraído de js/script.js en sub-tarea 2.3 (FRONTEND-FASE-2). La lógica de
// paginación se mantiene byte-equivalente a su versión previa (commit de9ecee).

import { renderProductoCard } from './product-card.js';

const PAGE_SIZE = 24;

function inicializarPaginacionProductos(productos, grid) {
  let renderedCount = 0;
  const total = productos.length;
  const parent = grid.parentElement || grid;

  // Sentinel + botón "Cargar más" — viven fuera del .pro-container para no
  // romper el flex-wrap del grid.
  const loadMoreWrapper = document.createElement('div');
  loadMoreWrapper.className = 'pro-load-more';
  loadMoreWrapper.innerHTML = `
    <button type="button" class="pro-load-more__btn" hidden>Cargar más productos</button>
    <div class="pro-load-more__sentinel" aria-hidden="true"></div>
    <p class="pro-load-more__status" role="status" aria-live="polite"></p>
  `;
  parent.insertBefore(loadMoreWrapper, grid.nextSibling);

  const btn = loadMoreWrapper.querySelector('.pro-load-more__btn');
  const sentinel = loadMoreWrapper.querySelector('.pro-load-more__sentinel');
  const status = loadMoreWrapper.querySelector('.pro-load-more__status');
  let observer = null;

  function renderNextBatch() {
    if (renderedCount >= total) return;

    const start = renderedCount;
    const end = Math.min(start + PAGE_SIZE, total);
    const html = productos
      .slice(start, end)
      .map((p, i) => renderProductoCard(p, { eager: start === 0 && i === 0 }))
      .join('');

    // appendChild a un wrapper temporal es ~10x más rápido que innerHTML +=
    // en loop (evita reflow/reparse por cada producto).
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    grid.appendChild(frag);

    renderedCount = end;
    status.textContent = `Mostrando ${renderedCount} de ${total} productos`;

    if (renderedCount >= total) {
      btn.hidden = true;
      if (observer) observer.disconnect();
      sentinel.remove();
    } else {
      btn.hidden = false;
    }
  }

  // Autocarga con IntersectionObserver. Fallback al botón si la API no existe.
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) renderNextBatch();
        });
      },
      { rootMargin: '300px 0px' } // precarga 300px antes de llegar al final
    );
    observer.observe(sentinel);
  }

  btn.addEventListener('click', renderNextBatch);
  renderNextBatch(); // primer batch
}

export function init() {
  const productContainer = document.querySelector('.pro-container');
  // 🛡️ Solo continuar si existe .pro-container (no aplica en product.html, etc).
  if (!productContainer) return;

  fetch('productos.json')
    .then((response) => response.json())
    .then((data) => {
      productContainer.innerHTML = '';
      inicializarPaginacionProductos(data, productContainer);
    })
    .catch((error) => console.error('Error al cargar los productos:', error));
}
