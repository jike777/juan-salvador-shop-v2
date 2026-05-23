<p align="center">
   <a href="https://github.com/jike777/html-css-portafolio2">
       <img src="https://img.shields.io/badge/STATUS-EN%20DESAROLLO-green">
   </a>
</p>

<p align="center">
   <img src="https://github.com/user-attachments/assets/cb6cee9b-bd98-41d9-bc62-e657622644bd" alt="Foto de la tienda Juan Salvador">
</p>

<p align="center" style="display: flex; justify-content: center; gap: 10px;">
    <a href="https://github.com/jike777/html-css-portafolio2">
        <img src="https://img.shields.io/badge/STATUS-Open%20Source-green">
    </a>
    <a href="https://github.com/jike777/html-css-portafolio2">
        <img src="https://img.shields.io/badge/License-not%20specified-red">
    </a>
</p>


<h1 align="center">E-commerce Website Project</h1>

## Índice
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estado del Proyecto](#estado-del-proyecto)
- [Características de la Aplicación y Demostración](#características-de-la-aplicación-y-demostración)
- [Acceso al Proyecto](#acceso-al-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Mejoras Implementadas](#mejoras-implementadas)
- [Cómo Contribuir](#cómo-contribuir)
- [Personas Desarrolladoras del Proyecto](#personas-desarrolladoras-del-proyecto)
- [Licencia](#licencia)

## Descripción del Proyecto
Este proyecto es un sitio web de e-commerce totalmente responsivo, creado utilizando HTML, CSS y JavaScript. Está diseñado para enseñar a principiantes cómo construir y desplegar un sitio web de comercio electrónico multipágina desde cero. El proyecto abarca desde la creación de una barra de navegación responsiva hasta un pie de página completamente funcional, todo en un solo video tutorial.

### Objetivos del Proyecto
- Mejorar la accesibilidad de la página.
- Realizar todo tipo de pruebas para asegurar la funcionalidad.
- Habilitar el carrito de compras dinámico..
- Agregar una pasarela de pago.
- Ajustar estilos CSS según sea necesario.
- Añadir nuevos productos y fotos.
- Crear una validación de clientes.
- Crear una base de datos para la página.
- Usar Firebase como backend ligero.

## Estado del Proyecto
<h4 align="center"> 
   🚧 Proyecto en construcción 🚧 
</h4>

## Características de la Aplicación y Demostración
### :hammer: Funcionalidades del Proyecto
- `Funcionalidad 1`: Mejora de la accesibilidad.
- `Funcionalidad 2`: Habilitación del carrito de compras.
- `Funcionalidad 3`: Integración de pasarela de pagos.
- `Funcionalidad 4`: Ajustes de estilos CSS.
- `Funcionalidad 5`: Añadir nuevos productos y fotografías.
- `Funcionalidad 6`: Creación de validaciones de cliente.
- `Funcionalidad 7`: Creación de una base de datos para la página.

## ✅ Mejoras Implementadas

- **HTML Semántico**: Uso adecuado de `section`, `header`, `footer`, `main`, etc.
- **Accesibilidad Web**: Mejora de textos alternativos (`alt`), encabezados estructurados, y mejor contraste.
- **Responsive Design**: Ajuste completo en CSS para mejorar visualización en todos los dispositivos.
- **SEO Inicial**: Uso correcto de `meta` etiquetas, estructura jerárquica y enlaces accesibles.
- **Carrito Dinámico**: Base funcional del carrito conectada con JavaScript.
- **Optimización Visual**: Rediseño visual del `header`, `footer` y banners usando Flexbox y estilos más suaves.
- **Conexión con Firebase**: Preparado para añadir base de datos y autenticación.
- **Código Limpio y Validado**: Sintaxis HTML/CSS revisada, validada y optimizada.
- **Versionamiento en GitHub**: Proyecto vinculado a GitHub con control de versiones.
- **Integridad y Seguridad del Carrito**: Se implementaron firmas HMAC-SHA256 para validar la integridad del carrito y detectar manipulaciones de datos. 
- **Manejo de Errores y Seguridad**: Se mejoró el manejo de errores con `console.error()` y se eliminó cualquier `console.log()` que podría exponer datos sensibles.
- **Validación de Carrito en `gracias.html`**: Se añadió validación de integridad del carrito en la página de confirmación.
- **Uso de `sessionStorage` y `localStorage`**: Se optimizó el uso de `sessionStorage` y `localStorage` para almacenar de manera segura la firma y los productos del carrito.



## 🌐 Acceso a la Demo

Puedes ver una demo en línea del sitio web aquí:  
👉 [https://jike777.github.io/html-css-portafolio2](https://jike777.github.io/html-css-portafolio2)

> ⚠️ Si aún no está publicada, puedes hacerlo usando GitHub Pages. ¿Quieres ayuda con eso?

## 📊 Funcionalidades y Progreso

| Funcionalidad                           | Estado       | Notas adicionales                          |
|----------------------------------------|--------------|--------------------------------------------|
| Estructura base multipágina            | ✅ Completo   | Todas las secciones funcionando            |
| Diseño Responsivo                      | ✅ Completo   | Adaptado a móviles y tablets               |
| Sistema de carrito con JavaScript      | ⚙️ En progreso | Permite agregar y mostrar productos        |
| Validación de cliente                  | ⚙️ En progreso | Implementación en Firebase Functions       |
| Base de datos (Firebase)               | ⚙️ En progreso | Estructura modular añadida                 |
| Pasarela de pagos                      | ⚙️ En progreso | Configuración con ePayco en marcha         |
| Mejora de accesibilidad y semántica    | ✅ Completo   | Revisión de `alt`, encabezados y roles     |
| SEO básico                             | ✅ Completo   | Meta etiquetas, títulos correctos          |
| Subida y gestión en GitHub             | ✅ Completo   | Proyecto en repositorio público            |
| Hosting y backend (Firebase)           | ✅ Completo   | Dominio personalizado y funciones activas  |


# 🛠️ Proyecto Web - Documentación

## Mejoras recientes

### #feat: Integración completa de backend y frontend con Firebase

- Implementación de la validación y firma del carrito en el backend usando Firebase Functions.
- Configuración de la firma digital de las transacciones ePayco para garantizar seguridad.
- Realización de pruebas exitosas con curl y validación en el emulador.
- Conexión correcta entre el backend (Firebase Functions) y el frontend (Firebase Hosting).
- Despliegue de la aplicación en Firebase Hosting con dominio personalizado configurado.
- Solución de problemas con la configuración del dominio y la propagación de DNS.

## Acceso al Proyecto

**Puedes descargar o acceder al código fuente del proyecto de las siguientes maneras:**

- Clona el repositorio usando HTTPS: [https://github.com/jike777/html-css-portafolio2.git](https://github.com/jike777/html-css-portafolio2.git)
- Usa GitHub CLI para clonar el repositorio: `gh repo clone jike777/html-css-portafolio2`

## 🛠️ Abre y Ejecuta el Proyecto

**Para abrir y ejecutar el proyecto, sigue estos pasos:**

1. **Clona el repositorio:**
   - Usa el comando `git clone https://github.com/jike777/html-css-portafolio2.git` en tu terminal o clona el repositorio con GitHub CLI usando `gh repo clone jike777/html-css-portafolio2`.

2. **Navega a la carpeta del proyecto:**
   - Abre una terminal y navega a la carpeta del proyecto con `cd html-css-portafolio2`.

3. **Abre los archivos del proyecto:**
   - Puedes abrir los archivos del proyecto en tu editor de código favorito, como Visual Studio Code, usando el comando `code .` (si tienes Visual Studio Code instalado).

4. **Visualiza el proyecto en un navegador:**
   - Si el proyecto incluye un archivo HTML, puedes abrir el archivo `index.html` en tu navegador para ver el sitio web.

5. **Ejecuta un servidor local (si es necesario):**
   - Si el proyecto requiere un servidor local, usa herramientas como `live-server` (instalado con npm) o cualquier otra herramienta para servir archivos estáticos.

   ```sh
   npx live-server


## Tecnologías Utilizadas
- **HTML**: Para la estructura del sitio web.
- **CSS**: Para el diseño y estilo responsivo.
- **JavaScript**: Para la interactividad y funcionalidad dinámica del sitio web.
- **Web Crypto API**: Para la generación y verificación de firmas HMAC-SHA256 en el carrito de compras.
- **sessionStorage** y **localStorage**: Para almacenar de manera segura los datos del carrito y las firmas HMAC.


## 🧪 Pruebas de Integridad

- **Pruebas de Firma HMAC**: Se realizaron pruebas exhaustivas para verificar la integridad del carrito, incluyendo cambios en la cantidad, eliminación y reordenamiento de productos. 
- **Validación en `gracias.html`**: Se verificó que la firma del carrito sea correcta al momento de la confirmación del pago. 
- **Seguridad Mejorada**: Se implementaron controles para evitar manipulaciones del carrito y garantizar la integridad de los datos.


## Cómo Contribuir
Este proyecto está abierto a la colaboración. Si deseas contribuir, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una rama con tu función: `git checkout -b mi-nueva-funcionalidad`.
3. Haz commit de tus cambios: `git commit -m 'Añadir nueva funcionalidad'`.
4. Push a la rama: `git push origin mi-nueva-funcionalidad`.
5. Abre un Pull Request para revisar tus cambios.

## Personas Desarrolladoras del Proyecto
<p align="left">
  <img src="https://github.com/user-attachments/assets/233b8aab-a134-40c0-84c5-793c51706cdd" alt="Persona Desarrolladora" width="115">
  <br>
  <sub>Jimmy Orlando Cortes</sub>
  <br>
  <a href="https://github.com/jike777">Jike777</a>
</p>


## Licencia
Este proyecto no tiene una licencia especificada. Si deseas contribuir o utilizar el código, ten en cuenta que esto podría limitar los permisos disponibles.

# Build-and-Deploy-Ecommerce-Website-With-HTML-CSS-JavaScript 
## About this course

I LEARN HOW TO BUILD AND DEPLOY FULLY RESPONSIVE E-COMMERCE WEBSITE USING HTML CSS & JAVASCRIPT. This is a free HTML CSS Course that I find on YouTube. And in this course, I learned how to build and deploy a full multipage e-commerce website completely from scratch, step by step. I created from responsive navbar using HTML CSS JavaScript to responsive footer in one video.

## Why This Course?

- Responsive Ecommerce Website Tutorial Using HTML CSS & JavaScript.
- Completely For Beginners.
- Multipage Ecommerce Website Project.
- Best Beginner Friendly Free Course On YouTube.
- Learn How to build amazing professional and responsive websites.
- Learn the fundamentals of web design.
- Modern CSS, including flexbox and CSS Grid for layout.
- Modern CSS techniques to create stunning designs and effects.
- How to use common components and layout patterns for professional website design and development.
- Advanced responsive design using media queries.
- And Many More.

## Sections

- Part1: Responsive Home Page Design.
- Part2: Shop Page & Single Product Page.
- Part3: Blog Page.
- Part4: About Page.
- Part5: Contact Us.
- Part6: Ecommerce Shopping Cart.

## Here is the source of this project where I learned a lot:

[<img alt="Build-and-Deploy-Ecommerce-Website-With-HTML-CSS-JavaScript" width="100%" src="https://github.com/tech2etc/Youtube-Tutorials/blob/main/Build%20and%20Deploy%20Ecommerce%20Website%20With%20HTML%20CSS%20JavaScript%20Full%20Responsive%20Ecommerce%20Course%20FREE.PNG?raw=true" />](https://youtu.be/P8YuWEkTeuE/)
