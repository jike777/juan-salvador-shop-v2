const mensaje = encodeURIComponent(
    '¡Hola! Estoy interesado en uno de los productos de la tienda y quiero hacer un pedido. ¿Me podrías dar más información y explicarme cómo funciona el envío?'
  );
  
  const fab = document.createElement('a');
  fab.href = `https://wa.me/573006722348?text=${mensaje}`;
  fab.className = 'whatsapp-fab';
  fab.target = '_blank';
  fab.setAttribute('aria-label', mensaje);
  
  // Imagen (añádela si no está)
  fab.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp">`;
  
  document.body.appendChild(fab);
  