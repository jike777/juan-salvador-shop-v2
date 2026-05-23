const fs = require('fs');
const path = require('path');

// Cambia el nombre del archivo JSON si es necesario
const data = JSON.parse(fs.readFileSync('./productos.json', 'utf8'));

let errores = [];

data.forEach((producto) => {
  producto.imagenes.forEach((imagen) => {
    const ruta = path.join(__dirname, imagen);
    if (!fs.existsSync(ruta)) {
      errores.push(`❌ Imagen no encontrada: ${imagen}`);
    }
  });
});

if (errores.length > 0) {
  console.log('Rutas de imagen con errores:\n');
  errores.forEach((e) => console.log(e));
} else {
  console.log('✅ Todas las imágenes existen correctamente.');
}

// Si quieres que el script se ejecute automáticamente al abrir la terminal, puedes usar el siguiente comando:
// node verificarImagenes.js
