// ✅ Importar Firebase desde firebase-config.js
import { auth, provider } from './firebase-config.js';
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';

// Función para manejar la redirección de la página
const redirectTo = (url) => {
  window.location.replace(url);
};

// Función para manejar los errores de autenticación
const handleAuthError = (error) => {
  console.error('❌ Error en autenticación:', error);
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      alert(
        'La ventana de inicio de sesión fue cerrada antes de completar el proceso.'
      );
      break;
    case 'auth/network-request-failed':
      alert('Error de red. Verifica tu conexión a internet.');
      break;
    case 'auth/cancelled-popup-request':
      alert(
        'Ya hay una ventana de inicio de sesión abierta. Por favor, ciérrala e intenta de nuevo.'
      );
      break;
    case 'auth/no-current-user':
      alert('No hay un usuario autenticado actualmente.');
      break;
    default:
      alert('Ocurrió un error inesperado. Intenta de nuevo más tarde.');
  }
};

// Función para manejar la autenticación de usuario
const handleAuthentication = (user) => {
  if (user) {
    console.log('🔒 Usuario autenticado:', user.displayName);
    redirectTo('index.html'); // Redirigir a index.html si está autenticado
  } else {
    console.log('🚪 No hay usuario autenticado');
    const loginButton = document.getElementById('login-btn');
    if (loginButton) loginButton.style.display = 'inline-block'; // Mostrar el botón de Google
  }
};

// 🟢 Verificar si el usuario está autenticado al cargar la página
onAuthStateChanged(auth, handleAuthentication);

// 🟢 Manipular el historial para evitar el retroceso
window.history.pushState(null, '', window.location.href); // Manipulamos el historial para evitar el retroceso

window.addEventListener('popstate', () => {
  // Si el usuario está autenticado, bloquear el retroceso
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      window.history.pushState(null, '', window.location.href); // Manipulamos el historial para evitar retroceder
    }
  });
});

// 🟢 Inicio de sesión con Google
const loginButton = document.getElementById('login-btn');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('✅ Usuario autenticado:', result.user);
        redirectTo('index.html'); // Redirigir al home después de iniciar sesión
      })
      .catch(handleAuthError); // Manejar errores en autenticación
  });
}

// 🟢 Cerrar sesión
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que el enlace recargue la página
    signOut(auth)
      .then(() => {
        console.log('🚪 Usuario cerró sesión');
        redirectTo('auth.html'); // Redirigir al login después de cerrar sesión
      })
      .catch(handleAuthError); // Manejar errores al cerrar sesión
  });
}
