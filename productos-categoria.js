//esta importancion contiene funciones de utilidad para el proyecto
// y se utiliza en varias partes del código
import { renderEstrellas } from './utils.js';

// ✅ Función principal para cargar productos desde un archivo JSON y renderizarlos en el contenedor indicado
// Parámetros:
// - url: ruta del archivo JSON (ej. 'productos.json')
// - selector: contenedor HTML donde se mostrarán los productos (ej. '.pro-container')
// - filtroTipo: 'ofertas', 'coleccion' o null (para mostrar todos)
export function cargarProductosDesdeJSON(url, selector, filtroTipo) {
  document.addEventListener('DOMContentLoaded', () => {
    // 🔄 Obtener los datos del archivo JSON
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const contenedor = document.querySelector(selector);

        // ❌ Verificamos que el contenedor exista
        if (!contenedor) {
          console.warn(`⚠️ Contenedor no encontrado: ${selector}`);
          return;
        }

        // 🧹 Limpiar el contenedor antes de insertar productos nuevos
        contenedor.innerHTML = '';

        // 🟡 Filtrar productos según el tipo (si se indica)
        let productosFiltrados = data;
        if (filtroTipo === 'ofertas') {
          productosFiltrados = data.filter((p) => p.oferta); // Solo los productos en oferta
        } else if (filtroTipo === 'coleccion') {
          productosFiltrados = data.filter((p) => p.categoria === 'coleccion'); // Solo los productos de colección
        }

        // 🖼 Recorremos y renderizamos los productos filtrados
        productosFiltrados.forEach((producto) => {
          const html = `
            <div class="pro" onclick="window.location.href='product.html?id=${
              producto.id
            }'">
              <img src="${producto.imagen}" alt="${producto.nombre}" />
              <div class="des">
                <span>${producto.marca}</span>
                <h5>${producto.descripcion}</h5>
                <div class="star">
                  ${renderEstrellas(producto.estrellas)}
                </div>
                <h4>$${producto.precio.toLocaleString()} Pesos</h4>
              </div>
              <div class="cart-coleccion">
                <i class="fal fa-shopping-cart"></i>
              </div>
            </div>`;
          contenedor.innerHTML += html;
        });
      })
      .catch((err) =>
        console.error('❌ Error al cargar productos desde JSON:', err)
      );
  });
}
