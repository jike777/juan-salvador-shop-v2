// ✅ Importamos funciones desde signing.js
import {
  firmarCarritoSeguro,
  validarFirmaCarrito,
  getOrCreateHMACKey,
} from './signing.js';

// 📌 Cargar el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// 📌 Función para mostrar los productos en el carrito
function mostrarCarrito() {
  const tbody = document.querySelector('#cart tbody');
  tbody.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, index) => {
    let subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><a href="#" onclick="eliminarDelCarrito(${index})">
        <i class="far fa-times-circle"></i></a>
      </td>
      <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50"></td>
      <td>${producto.nombre}</td>
      <td>$${producto.precio}</td>
      <td>
        <!-- Campo de cantidad editable -->
        <input type="number" value="${producto.cantidad}" min="1" onchange="actualizarCantidad(${index}, this.value)" />
      </td>
      <td class="subtotal">$${subtotal}</td>
    `;
    tbody.appendChild(fila);
  });

  // Actualizar el total general en el carrito
  document.querySelector('#subtotal-carrito').innerText = `$${total.toFixed(2)}`;
  document.querySelector('#total-carrito').innerText = `$${total.toFixed(2)}`;
}

// 📌 Función para actualizar la cantidad
function actualizarCantidad(index, nuevaCantidad) {
  // Actualiza la cantidad del producto en el carrito
  if (nuevaCantidad >= 1) {
    carrito[index].cantidad = parseInt(nuevaCantidad, 10);
  }
  // Vuelve a mostrar el carrito con las cantidades actualizadas
  mostrarCarrito();
}


// 📌 Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

// 📌 Cargar el carrito cuando la página esté lista
document.addEventListener('DOMContentLoaded', mostrarCarrito);

// ✅ Escuchar click en el botón de pago y firmar el carrito
document
  .getElementById('btn-pagar')
  .addEventListener('click', async function () {
    let total = carrito.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );

    // Actualizamos los límites de validación
    if (total < 5000 || total > 5000000) {
      alert(
        'El total debe estar entre $5.000 y $5.000.000 COP para pagos en modo prueba.'
      );
      return;
    }

    try {
      // 🔐 Recuperamos la firma original del carrito
      const firmaOriginal = sessionStorage.getItem('firmaCarrito');
      if (!firmaOriginal) {
        alert('⚠️ No se encontró la firma original del carrito.');
        return;
      }

      // ✅ Firmamos el carrito actual usando las funciones refactorizadas
      const firmaActual = await firmarCarritoSeguro(carrito);

      // 🔎 Comparamos las firmas
      const esValida = await validarFirmaCarrito(carrito, firmaOriginal);
      if (!esValida) {
        alert('⚠️ El carrito fue modificado. Vuelve a agregar tus productos.');
        console.warn('❌ Firma inválida, bloqueo de pago.');
        return;
      }

      // ✅ Firma válida, actualizamos la firma y continuamos
      sessionStorage.setItem('firmaCarrito', firmaActual);
      sessionStorage.setItem('carritoFirmado', JSON.stringify(carrito));
    } catch (error) {
      console.error('❌ Error al firmar o verificar el carrito:', error);
      alert('Ocurrió un error al preparar el pago.');
      return;
    }

    // ✅ Aquí todo está validado... puedes continuar con el pago
    // document.forms['formularioDePago'].submit();
    // o continuar con el handler de ePayco, como abajo

    // 🧾 Configuración del checkout de ePayco
    const handler = ePayco.checkout.configure({
      key: 'e1298e47dbef7c0a10193b0a5b0da203', // la clave pública de producción
      test: false, // true para mode de prueba, false para producción
    });

    handler.open({
      name: 'Online Juan Salvador Shop',
      description: 'Pago de tus productos en Online Juan Salvador Shop',
      invoice: 'carrito_' + Date.now(),
      currency: 'cop',
      amount: total,
      tax_base: total,
      tax: '0',
      tax_ico: '0',
      country: 'co',
      lang: 'es',
      external: false,
      response: 'https://online-juan-salvador-s-shop.web.app/gracias.html',
      confirmation: 'https://online-juan-salvador-s-shop.web.app/gracias.html',
      method: 'all',
    });
  });

// ❗ Exportamos funciones globalmente para usarlas en HTML
window.eliminarDelCarrito = eliminarDelCarrito;
window.actualizarCantidad = actualizarCantidad;
window.firmarCarritoSeguro = firmarCarritoSeguro;
