// ✅ Función para agregar un producto desde product.html al carrito
async function agregarAlCarritoDesdeProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  try {
    const response = await fetch('productos.json');
    const data = await response.json();

    const producto = data.find((p) => p.id == productId);
    if (!producto) return;

    const cantidadInput = document.querySelector(
      '.simgle-pro-details input[type="number"]'
    );
    const cantidadSeleccionada = parseInt(cantidadInput.value);

    if (cantidadSeleccionada < 1) {
      alert('La cantidad debe ser al menos 1.');
      return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let productoExistente = carrito.find((p) => p.id == producto.id);

    if (productoExistente) {
      productoExistente.cantidad += cantidadSeleccionada;
    } else {
      producto.cantidad = cantidadSeleccionada;
      carrito.push(producto);
    }

    // ✅ Guardamos el carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.nombre} se ha agregado al carrito.`);
  } catch (error) {
    console.error('❌ Error al agregar producto al carrito:', error);
    alert('Ocurrió un error al intentar agregar el producto.');
  }
}

// 🔍 EFECTO DE LUPA EN IMAGEN DE PRODUCTO
document.addEventListener('DOMContentLoaded', function () {
  const mainImg = document.getElementById('MainImg');

  const zoomBox = document.createElement('div');
  zoomBox.style.position = 'absolute';
  zoomBox.style.width = '700px';
  zoomBox.style.height = '700px';
  zoomBox.style.overflow = 'hidden';
  zoomBox.style.border = '2px solid #ddd';
  zoomBox.style.display = 'none';
  zoomBox.style.backgroundRepeat = 'no-repeat';
  zoomBox.style.backgroundSize = '800px auto';
  zoomBox.style.left = '110%';
  zoomBox.style.top = '0';
  zoomBox.style.zIndex = '10';

  const magnifier = document.createElement('div');
  magnifier.style.position = 'absolute';
  magnifier.style.width = '200px';
  magnifier.style.height = '200px';
  magnifier.style.background = 'rgba(0, 0, 0, 0.2)';
  magnifier.style.borderRadius = '50%';
  magnifier.style.pointerEvents = 'none';
  magnifier.style.display = 'none';
  magnifier.style.zIndex = '5';

  const imageContainer = document.querySelector('.single-pro-image');
  imageContainer.style.position = 'relative';
  imageContainer.appendChild(zoomBox);
  imageContainer.appendChild(magnifier);

  mainImg.addEventListener('mouseenter', () => {
    zoomBox.style.display = 'block';
    magnifier.style.display = 'block';
    zoomBox.style.backgroundImage = `url(${mainImg.src})`;
    mainImg.style.cursor = 'zoom-in';
  });

  mainImg.addEventListener('mouseleave', () => {
    zoomBox.style.display = 'none';
    magnifier.style.display = 'none';
  });

  mainImg.addEventListener('mousemove', (e) => {
    const rect = mainImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    magnifier.style.left = `${x - 100}px`;
    magnifier.style.top = `${y - 100}px`;

    const zoomX = (x / rect.width) * 100;
    const zoomY = (y / rect.height) * 100;
    zoomBox.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
  });
});

// 🔹 Exponemos la función para usarla desde HTML
window.agregarAlCarritoDesdeProducto = agregarAlCarritoDesdeProducto;
