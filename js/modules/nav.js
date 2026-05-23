// 📌 Navegación — Menú Hamburguesa
// Maneja la apertura y cierre del menú en dispositivos móviles de forma dinámica.
// No-op si la página no tiene navbar con #bar / #navbar (ej: 404, auth.html).

export function init() {
  const menu = document.getElementById('navbar');
  const bar = document.getElementById('bar');
  const close = document.getElementById('close');

  if (!menu || !bar) return;

  bar.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  if (close) {
    close.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  }
}
