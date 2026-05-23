// 📌 Auth UI — Listener global de estado de autenticación + logout del navbar.
// Vive en todas las páginas que cargan main.js para reflejar el estado del
// usuario en el navbar (mostrar/ocultar "Usuario ▼" y manejar el logout).
//
// Extraído de js/script.js en sub-tarea 2.3 (FRONTEND-FASE-2).
// No confundir con js/auth.js — ese maneja el flujo de login en auth.html y
// es independiente; convive sin conflicto porque cada página carga uno u otro.

import { auth } from '../firebase-config.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';

export function init() {
  const userMenu = document.getElementById('user-menu');
  const userNameElement = document.getElementById('user-name');
  const logoutButton = document.getElementById('logout-btn');
  const shopSection = document.getElementById('shop-section');

  // 🟢 Escuchar cambios en la autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('🔓 Usuario autenticado:', user.displayName || user.email);

      if (shopSection) shopSection.style.display = 'block';

      if (userMenu && userNameElement) {
        userNameElement.textContent = user.displayName
          ? user.displayName
          : user.email;
        userMenu.style.display = 'block';
      }
    } else {
      // Usuario anónimo: home público, productos visibles. Auth se exige solo al hacer
      // checkout/agregar al carrito (ver cart.js). Antes redirigíamos a auth.html lo que
      // bloqueaba a todos los visitantes — patrón anti-UX para e-commerce.
      if (userMenu) userMenu.style.display = 'none';
    }
  });

  // 🟢 Cerrar sesión
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          console.log('🚪 Usuario cerró sesión');
          window.location.href = 'auth.html'; // Volver a login
        })
        .catch((error) => {
          console.error('❌ Error al cerrar sesión:', error);
        });
    });
  }
}
