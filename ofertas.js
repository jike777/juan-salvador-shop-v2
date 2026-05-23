// ✅ Importamos la función desde productos-categoria.js
import { cargarProductosDesdeJSON } from './productos-categoria.js';

// ✅ Llamamos la función para mostrar solo los productos de la categoría 'coleccion'
// Se usa en la página coleccion.html
// ✅ Carga productos de OFERTA correctamente
cargarProductosDesdeJSON('productos.json', '.coleccion-grid', 'ofertas');

console.log('🔥 Script de OFERTAS cargado');
// ✅ Importamos la función desde productos-categoria.js
