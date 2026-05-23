// signing.js vacío pero con exports válidos

export async function firmarCarritoSeguro() {
  console.warn(
    'firmarCarritoSeguro ya no es necesario, toda la firma ocurre en el backend.'
  );
  return 'firma-deprecated';
}

export async function validarFirmaCarrito() {
  console.warn(
    'validarFirmaCarrito ya no es necesario, toda la firma ocurre en el backend.'
  );
  return true;
}

export async function getOrCreateHMACKey() {
  console.warn('getOrCreateHMACKey ya no se usa.');
  return null;
}
