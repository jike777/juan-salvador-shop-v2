// ✅ Importamos la función desde productos-categoria.js
import { cargarProductosDesdeJSON } from './productos-categoria.js';

// ✅ Llamamos la función para mostrar solo los productos de la categoría 'coleccion'
// Se usa en la página coleccion.html
cargarProductosDesdeJSON('productos.json', '.coleccion-grid', 'coleccion');

console.log('🎨 Script de COLECCIÓN cargado');
