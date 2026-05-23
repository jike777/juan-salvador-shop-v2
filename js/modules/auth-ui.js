// 📌 Auth UI — Listener global de estado de autenticación + logout del navbar.
// Vive en todas las páginas que cargan main.js para reflejar el estado del
// usuario en el navbar (mostrar/ocultar "Usuario ▼", manejar logout, y
// mostrar el link "Iniciar sesión" para anónimos).
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
  const loginLink = document.getElementById('login-link');

  // 🟢 Toggle del dropdown por click (touch-friendly).
  // Bug #1: en Android (device principal del usuario) el :hover no se sostiene
  // el tiempo suficiente para llegar al link "Cerrar sesión". El click toggle
  // mantiene el dropdown abierto hasta que el usuario decida cerrarlo.
  if (userMenu && userNameElement) {
    userNameElement.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = userMenu.classList.toggle('is-open');
      userNameElement.setAttribute('aria-expanded', String(isOpen));
    });

    // Permitir Enter/Space en el toggle (a11y — es un role="button" con tabindex=0).
    userNameElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = userMenu.classList.toggle('is-open');
        userNameElement.setAttribute('aria-expanded', String(isOpen));
      }
    });

    // Click fuera del menu cierra el dropdown.
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && userMenu.classList.contains('is-open')) {
        userMenu.classList.remove('is-open');
        userNameElement.setAttribute('aria-expanded', 'false');
      }
    });

    // Escape cierra el dropdown y devuelve foco al toggle (a11y).
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && userMenu.classList.contains('is-open')) {
        userMenu.classList.remove('is-open');
        userNameElement.setAttribute('aria-expanded', 'false');
        userNameElement.focus();
      }
    });
  }

  // Helpers para mostrar/ocultar el `<li>` del login.
  // El elemento arranca con atributo `hidden` (semántica + display:none nativo).
  // En vez de pelearse con style.display, alternamos el attribute `hidden`.
  const showLoginLink = () => {
    if (loginLink) loginLink.hidden = false;
  };
  const hideLoginLink = () => {
    if (loginLink) loginLink.hidden = true;
  };

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

      hideLoginLink();
    } else {
      // Usuario anónimo: home público, productos visibles. Auth se exige solo al hacer
      // checkout/agregar al carrito (ver cart.js). Antes redirigíamos a auth.html lo que
      // bloqueaba a todos los visitantes — patrón anti-UX para e-commerce.
      if (userMenu) {
        userMenu.style.display = 'none';
        // Cerrar dropdown si quedó abierto antes de un signOut.
        userMenu.classList.remove('is-open');
        if (userNameElement) {
          userNameElement.setAttribute('aria-expanded', 'false');
        }
      }

      // Bug #2: mostrar affordance de login en el navbar para anónimos.
      showLoginLink();
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
