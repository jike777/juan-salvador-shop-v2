// 📌 Product Card — Template puro de una tarjeta del grid.
// Responsabilidad única: dado un producto, devolver el HTML string de su .pro
// card. Sin side effects ni acceso al DOM.
//
// Extraído en sub-tarea 2.3 (FRONTEND-FASE-2). Consumido por products-grid.js
// y reutilizable desde cualquier otro renderer futuro.

import { renderEstrellas } from '../utils.js';

export function renderProductoCard(product, { eager = false } = {}) {
  // La primera imagen del primer batch carga eager para no penalizar el LCP
  // (best practice Lighthouse: above-the-fold no debe ser loading="lazy").
  const loadingAttr = eager ? 'eager' : 'lazy';
  const fetchAttr = eager ? ' fetchpriority="high"' : '';
  return `
    <div class="pro" onclick="window.location.href='product.html?id=${product.id}'">
      <img src="${product.imagen}" alt="${product.nombre}" loading="${loadingAttr}" decoding="async"${fetchAttr} />
      <div class="des">
        <span>${product.marca}</span>
        <h5>${product.descripcion}</h5>
        <div class="star">
${renderEstrellas(product.estrellas)}
</div>

        <h4>$${product.precio.toLocaleString()} Pesos</h4>
      </div>
      <a href="#" aria-label="Agregar ${product.nombre} al carrito"><i class="fal fa-shopping-cart cart" aria-hidden="true"></i></a>
    </div>
  `;
}
