const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CLAVE_SECRETA = 'clave-super-secreta-1234';
const CLAVE_PRIVADA = process.env.CLAVE_PRIVADA || 'PON_TU_P_KEY_AQUI';

// 📦 Cargar productos desde productos.json
const rutaProductos = path.join(__dirname, '..', '..', 'productos.json');

let productos = [];
try {
  const datos = fs.readFileSync(rutaProductos, 'utf8');
  productos = JSON.parse(datos);
  console.log(`✅ Se cargaron ${productos.length} productos`);
} catch (error) {
  console.error('❌ Error al cargar productos.json:', error);
}

// ✅ Función para validar carrito (solo backend firma)
exports.validarCarrito = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send({ error: 'Método no permitido. Solo POST.' });
    }

    try {
      const { carrito } = req.body;

      if (!carrito || !Array.isArray(carrito)) {
        return res.status(400).send({ error: 'Faltan datos en la solicitud.' });
      }

      // 🔍 Completar datos del carrito (buscar precio real del producto)
      const carritoConPrecios = carrito.map((item) => {
        const producto = productos.find((p) => p.id === item.productoId);
        return {
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio: producto ? producto.precio : 0,
        };
      });

      // 🔐 Crear firma local del carrito con precios
      const hash = crypto
        .createHmac('sha256', CLAVE_SECRETA)
        .update(JSON.stringify(carritoConPrecios))
        .digest('hex');

      console.log('🧾 Carrito recibido:', carrito);
      console.log('🔐 Firma generada (backend):', hash);

      const total = carritoConPrecios.reduce(
        (sum, p) => sum + p.precio * p.cantidad,
        0
      );

      return res.status(200).send({
        mensaje: 'Carrito validado y firmado con éxito.',
        totalValidado: total,
        firma: hash,
        estado: 'OK',
      });
    } catch (err) {
      console.error('❌ Error al validar carrito:', err);
      return res
        .status(500)
        .send({ error: 'Error interno al procesar carrito.' });
    }
  });
});

// ✅ Confirmación de pago ePayco (con firma MD5)
exports.confirmacionPagoEpayco = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido');
  }

  const {
    x_cust_id_cliente,
    x_key,
    x_ref_payco,
    x_transaction_id,
    x_amount,
    x_currency_code,
    x_response,
    x_signature,
  } = req.body;

  // 👉📤 Agregamos el console.log para ver la cadena que se está firmando
  console.log(
    '🔐 Cadena para firmar:',
    `${x_cust_id_cliente}^${x_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`
  );

  // Cálculo de la firma esperada
  const firmaEsperada = crypto
    .createHash('md5')
    .update(
      `${x_cust_id_cliente}^${CLAVE_PRIVADA}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`
    )
    .digest('hex');

  console.log('🔐 Firma esperada:', firmaEsperada);
  console.log('🔐 Firma recibida:', x_signature);

  // Comparar la firma calculada con la recibida
  if (firmaEsperada !== x_signature) {
    console.warn('❌ Firma inválida en callback');
    return res.status(403).send('Firma no válida');
  }

  console.log('✅ Confirmación de pago recibida:', {
    ref: x_ref_payco,
    estado: x_response,
    monto: x_amount,
  });

  return res.status(200).send('OK');
});
