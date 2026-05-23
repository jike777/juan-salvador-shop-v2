//esta importancion contiene funciones de utilidad para el proyecto
// y se utiliza en varias partes del código
import { renderEstrellas } from './utils.js';
console.log('🔧 Probando renderEstrellas(3):', renderEstrellas?.(3));

//📌 Navegación - Menú Hamburguesa
// Maneja la apertura y cierre del menú en dispositivos móviles de forma dinámica.

var menu = document.getElementById('navbar');
var bar = document.getElementById('bar');
var close = document.getElementById('close');
bar.addEventListener('click', function () {
  if (menu.classList.contains('active')) {
    menu.classList.remove('active');
  } else {
    menu.classList.add('active');
  }
});
close.addEventListener('click', function () {
  menu.classList.remove('active');
});

//📌 Productos - Carga paginada (lazy load) de productos en home / shop
// Renderiza en batches de PAGE_SIZE para no inyectar el catálogo completo en
// el primer paint. Usa IntersectionObserver sobre un sentinel al final del
// grid para autocargar al hacer scroll, con botón "Cargar más" como fallback
// accesible (teclado / JS limitado / observer no disparado).
//
// Nota: esta función se mantiene aislada para facilitar el split a módulo
// dedicado en la sub-tarea 2.3 del ticket FRONTEND-FASE-2.
const PAGE_SIZE = 24;

function renderProductoCard(product, { eager = false } = {}) {
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

function inicializarPaginacionProductos(productos, productContainer) {
  let renderedCount = 0;
  const total = productos.length;

  // Sentinel + botón "Cargar más" — viven fuera del .pro-container para no
  // romper el flex-wrap del grid.
  const grid = productContainer;
  const parent = grid.parentElement || grid;

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

  function renderNextBatch() {
    if (renderedCount >= total) return;

    const start = renderedCount;
    const end = Math.min(start + PAGE_SIZE, total);
    const fragmentHTML = productos
      .slice(start, end)
      .map((p, i) =>
        renderProductoCard(p, { eager: start === 0 && i === 0 })
      )
      .join('');

    // appendChild a un wrapper temporal es ~10x más rápido que innerHTML +=
    // en loop (evita reflow/reparse por cada producto).
    const tmp = document.createElement('div');
    tmp.innerHTML = fragmentHTML;
    const frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    grid.appendChild(frag);

    renderedCount = end;
    status.textContent = `Mostrando ${renderedCount} de ${total} productos`;

    if (renderedCount >= total) {
      btn.hidden = true;
      observer && observer.disconnect();
      sentinel.remove();
    } else {
      btn.hidden = false;
    }
  }

  // Autocarga con IntersectionObserver. Fallback al botón si la API no existe
  // (IE / entornos exóticos) — el botón siempre funciona como degradación.
  let observer = null;
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

  // Primer batch
  renderNextBatch();
}

document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.querySelector('.pro-container');

  // 🛡️ Solo continuar si existe .pro-container (no aplica en product.html, etc).
  if (!productContainer) {
    return;
  }

  fetch('productos.json')
    .then((response) => response.json())
    .then((data) => {
      productContainer.innerHTML = ''; // Limpiar productos existentes
      inicializarPaginacionProductos(data, productContainer);
    })
    .catch((error) => console.error('Error al cargar los productos:', error));
});

//📌 Página de Detalles del Producto
// Captura el ID del producto desde la URL y carga sus detalles dinámicamente en la página de descripción.

document.addEventListener('DOMContentLoaded', () => {
  // Obtener el ID del producto desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Verificar si estamos en la página de detalles del producto antes de ejecutar el código
  if (!productId || !document.querySelector('#MainImg')) return;

  // Cargar los productos desde el archivo JSON
  fetch('productos.json')
    .then((response) => response.json())
    .then((data) => {
      // Buscar el producto con el ID correspondiente
      const product = data.find((p) => p.id == productId);
      if (!product) {
        console.error('Producto no encontrado');
        return;
      }

      // Actualizar la imagen principal
      document.querySelector('#MainImg').src = product.imagen;

      // Actualizar la descripción y precio del producto
      document.querySelector('.simgle-pro-details h4').textContent =
        product.descripcion;
      document.querySelector(
        '.simgle-pro-details h2'
      ).textContent = `$${product.precio.toLocaleString()} Pesos`;
    })
    .catch((error) => console.error('Error al cargar el producto:', error));
});

//📌 Página de Detalles del Producto
// Captura el ID del producto desde la URL y carga sus detalles dinámicamente en la página de descripción.

document.addEventListener('DOMContentLoaded', () => {
  //📌 Obtener el ID del producto desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  //📌 Verificar si estamos en la página de detalles del producto antes de ejecutar el código
  if (!productId || !document.querySelector('#MainImg')) return;

  //📌 Cargar los productos desde el archivo JSON
  fetch('productos.json')
    .then((response) => response.json())
    .then((data) => {
      //📌 Buscar el producto con el ID correspondiente
      const product = data.find((p) => p.id == productId);
      if (!product) {
        console.error('❌ Producto no encontrado');
        return;
      }

      //📌 Actualizar la imagen principal del producto
      document.querySelector('#MainImg').src = product.imagen;

      //📌 Actualizar la categoría del producto (Ejemplo: "Mountains / Trekking Bags")
      document.querySelector('.simgle-pro-details h6').textContent =
        product.categoria;

      //📌 Actualizar la descripción del producto
      document.querySelector('.simgle-pro-details h4').textContent =
        product.descripcion;

      //📌 Actualizar el precio del producto con formato de moneda
      document.querySelector(
        '.simgle-pro-details h2'
      ).textContent = `$${product.precio.toLocaleString()} Pesos`;

      //📌 Actualizar la información técnica del producto
      document.querySelector('.simgle-pro-details span').textContent =
        product.info_tecnica;

      //📌 Actualizar las imágenes pequeñas del producto
      const smallImgGroup = document.querySelector('.small-img-group');
      smallImgGroup.innerHTML = ''; //📌 Limpiar imágenes anteriores antes de agregar nuevas

      //📌 Insertar dinámicamente las imágenes en miniatura
      product.imagenes.forEach((imgSrc) => {
        const div = document.createElement('div');
        div.classList.add('small-img-col');
        div.innerHTML = `<img src="${imgSrc}" width="100%" class="small-img" alt="Imagen del producto">`;
        smallImgGroup.appendChild(div);
      });

      //📌 Agregar funcionalidad para cambiar la imagen principal al hacer clic en una imagen pequeña
      document.querySelectorAll('.small-img').forEach((img) => {
        img.addEventListener('click', function () {
          document.querySelector('#MainImg').src = this.src;
        });
      });

      //📌 Insertar colores en el `<select>`
      const colorSelect = document.querySelector('.simgle-pro-details select');
      colorSelect.innerHTML = '<option>Selecciona un color</option>';

      if (product.colores && product.colores.length > 0) {
        // Verificar si el producto tiene colores
        product.colores.forEach((color) => {
          const option = document.createElement('option');
          option.textContent = color;
          colorSelect.appendChild(option);
        });
      } else {
        colorSelect.innerHTML += '<option>No hay colores disponibles</option>';
      }

      console.log(`✅ Producto cargado: ${product.nombre}`);
    })
    .catch((error) => console.error('❌ Error al cargar el producto:', error));
});

import { auth } from './firebase-config.js'; // ✅ Importar la configuración de Firebase
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const userMenu = document.getElementById('user-menu'); // ✅ Aquí debe ser userMenu
  const userNameElement = document.getElementById('user-name');
  const logoutButton = document.getElementById('logout-btn');
  const shopSection = document.getElementById('shop-section');

  // 🟢 Escuchar cambios en la autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('🔓 Usuario autenticado:', user.displayName || user.email);

      // ✅ Mostrar la tienda
      if (shopSection) shopSection.style.display = 'block';

      // ✅ Mostrar nombre del usuario en el navbar
      if (userMenu && userNameElement) {
        // ✅ Ahora userMenu está bien definido
        userNameElement.textContent = user.displayName
          ? user.displayName
          : user.email;
        userMenu.style.display = 'block'; // ✅ Mostrar menú de usuario
      }
    } else {
      // Usuario anónimo: home público, productos visibles. Auth se exige solo al hacer
      // checkout/agregar al carrito (ver cart.js). Antes redirigíamos a auth.html lo que
      // bloqueaba a todos los visitantes — patrón anti-UX para e-commerce.
      if (userMenu) userMenu.style.display = 'none';
    }
  });

  // 🟢 Cerrar sesión
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          console.log('🚪 Usuario cerró sesión');
          window.location.href = 'auth.html'; // Volver a login
        })
        .catch((error) => {
          console.error('❌ Error al cerrar sesión:', error);
        });
    });
  }
});
