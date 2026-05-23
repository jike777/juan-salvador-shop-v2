// Este archivo contiene funciones de utilidad para el proyecto
// y se utiliza en varias partes del código
export function renderEstrellas(estrellas) {
  const completas = Math.floor(estrellas);
  const media = estrellas % 1 !== 0 ? 1 : 0;
  const vacías = 5 - completas - media;

  return `${'<i class="fas fa-star"></i>'.repeat(completas)}${
    media ? '<i class="fas fa-star-half-alt"></i>' : ''
  }${'<i class="far fa-star"></i>'.repeat(vacías)}`;
}
