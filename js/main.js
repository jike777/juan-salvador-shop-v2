// 📌 Main — Orquestador único del bundle de UI compartida.
// Reemplaza a js/script.js (eliminado en sub-tarea 2.3 de FRONTEND-FASE-2).
// Cada módulo expone init() y se autoinhibe si la página no tiene los nodos
// que necesita, así que es seguro inicializarlos todos en cada HTML.
//
// Stack: ES Modules nativos del browser, sin bundler.
// Páginas que lo cargan: index, shop, product, cart, about, blog, contact.

import { renderEstrellas } from './utils.js';
import * as nav from './modules/nav.js';
import * as productsGrid from './modules/products-grid.js';
import * as productDetail from './modules/product-detail.js';
import * as authUi from './modules/auth-ui.js';

// Smoke log heredado de script.js — confirma que utils.js se cargó OK.
console.log('🔧 Probando renderEstrellas(3):', renderEstrellas?.(3));

document.addEventListener('DOMContentLoaded', () => {
  nav.init();
  productsGrid.init();
  productDetail.init();
  authUi.init();
});
