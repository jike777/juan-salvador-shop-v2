// 📌 Página de Detalles del Producto (product.html)
// Lee ?id= de la URL, carga el producto desde productos.json y rellena el
// layout: imagen principal, categoría, descripción, precio, info técnica,
// miniaturas (con switcher) y select de colores.
//
// Extraído de js/script.js en sub-tarea 2.3 (FRONTEND-FASE-2).
// El script.js original tenía dos DOMContentLoaded duplicados ejecutando la
// misma carga (el primero era subset del segundo y se sobrescribía). Aquí
// consolidamos en un único fetch sin cambiar el output visible.

export function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId || !document.querySelector('#MainImg')) return;

  fetch('productos.json')
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((p) => p.id == productId);
      if (!product) {
        console.error('❌ Producto no encontrado');
        return;
      }
      pintarDetalle(product);
      pintarMiniaturas(product.imagenes);
      pintarColores(product.colores);
      console.log(`✅ Producto cargado: ${product.nombre}`);
    })
    .catch((error) => console.error('❌ Error al cargar el producto:', error));
}

function pintarDetalle(product) {
  document.querySelector('#MainImg').src = product.imagen;
  document.querySelector('.simgle-pro-details h6').textContent = product.categoria;
  document.querySelector('.simgle-pro-details h4').textContent = product.descripcion;
  document.querySelector('.simgle-pro-details h2').textContent =
    `$${product.precio.toLocaleString()} Pesos`;
  document.querySelector('.simgle-pro-details span').textContent = product.info_tecnica;
}

function pintarMiniaturas(imagenes) {
  const smallImgGroup = document.querySelector('.small-img-group');
  smallImgGroup.innerHTML = '';
  imagenes.forEach((imgSrc) => {
    const div = document.createElement('div');
    div.classList.add('small-img-col');
    div.innerHTML = `<img src="${imgSrc}" width="100%" class="small-img" alt="Imagen del producto">`;
    smallImgGroup.appendChild(div);
  });
  // Switcher: al clic en miniatura cambia la imagen principal.
  document.querySelectorAll('.small-img').forEach((img) => {
    img.addEventListener('click', function () {
      document.querySelector('#MainImg').src = this.src;
    });
  });
}

function pintarColores(colores) {
  const colorSelect = document.querySelector('.simgle-pro-details select');
  colorSelect.innerHTML = '<option>Selecciona un color</option>';
  if (colores && colores.length > 0) {
    colores.forEach((color) => {
      const option = document.createElement('option');
      option.textContent = color;
      colorSelect.appendChild(option);
    });
  } else {
    colorSelect.innerHTML += '<option>No hay colores disponibles</option>';
  }
}
