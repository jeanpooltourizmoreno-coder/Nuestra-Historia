/* =========================================================
   CONFIGURACIÓN — cambia aquí tu fecha de inicio
   ========================================================= */
const fechaInicio = new Date("2026-03-13T00:00:00");

/* =========================================================
   1. ABRIR EL LIBRO (portada -> libro)
   ========================================================= */
const portada = document.getElementById("portada");
const libroCerrado = document.querySelector(".libro-cerrado");
const btnAbrir = document.getElementById("btn-abrir");
const libro = document.getElementById("libro");

btnAbrir.addEventListener("click", () => {
  libroCerrado.classList.add("abriendo");

  // Esperamos a que termine la animación de apertura (1.3s en el CSS)
  setTimeout(() => {
    portada.classList.add("oculto");
    libro.classList.remove("oculto");
  }, 1300);
});

/* =========================================================
   2. SISTEMA DE PASAR PÁGINAS (efecto de hoja real)
   ========================================================= */
const paginas = Array.from(document.querySelectorAll(".pagina"));
let indiceActual = 0;

function mostrarPagina(nuevoIndice) {
  if (nuevoIndice < 0 || nuevoIndice >= paginas.length) return;

  const paginaQueGira = paginas[indiceActual];
  if (paginaQueGira) {
    paginaQueGira.classList.add("girando");
    setTimeout(() => paginaQueGira.classList.remove("girando"), 1100);
  }

  paginas.forEach((pagina, i) => {
    pagina.classList.remove("activa", "pasada", "esperando");

    if (i < nuevoIndice) {
      pagina.classList.add("pasada");
    } else if (i === nuevoIndice) {
      pagina.classList.add("activa");
    } else {
      pagina.classList.add("esperando");
    }
  });

  indiceActual = nuevoIndice;
}

// Botones "Continuar →"
document.querySelectorAll(".btn-siguiente").forEach((btn) => {
  btn.addEventListener("click", () => mostrarPagina(indiceActual + 1));
});

// Botones "← Volver"
document.querySelectorAll(".btn-anterior").forEach((btn) => {
  btn.addEventListener("click", () => mostrarPagina(indiceActual - 1));
});

// Estado inicial: solo la página 1 activa, el resto esperando
mostrarPagina(0);

/* =========================================================
   3. CONTADOR DE TIEMPO JUNTOS (página 5)
   ========================================================= */
function actualizarContador() {
  const ahora = new Date();
  let diferencia = ahora - fechaInicio;

  if (diferencia < 0) diferencia = 0;

  const segundosTotales = Math.floor(diferencia / 1000);
  const minutosTotales = Math.floor(segundosTotales / 60);
  const horasTotales = Math.floor(minutosTotales / 60);
  const diasTotales = Math.floor(horasTotales / 24);

  document.getElementById("c-dias").textContent = diasTotales;
  document.getElementById("c-horas").textContent = horasTotales % 24;
  document.getElementById("c-min").textContent = minutosTotales % 60;
  document.getElementById("c-seg").textContent = segundosTotales % 60;
}

actualizarContador();
setInterval(actualizarContador, 1000);

/* =========================================================
   4. CARTA (página 6)
   ========================================================= */
const btnLeerCarta = document.getElementById("btn-leer-carta");
const carta = document.getElementById("carta");

btnLeerCarta.addEventListener("click", () => {
  carta.classList.remove("oculto");
  btnLeerCarta.classList.add("oculto");
});

/* =========================================================
   5. MÚSICA DE FONDO
   ========================================================= */
const btnMusica = document.getElementById("btn-musica");
const audioFondo = document.getElementById("audio-fondo");
let sonando = false;

btnMusica.addEventListener("click", () => {
  if (sonando) {
    audioFondo.pause();
    btnMusica.textContent = "🎵 Música";
    btnMusica.classList.remove("sonando");
  } else {
    audioFondo.play().catch(() => {
      // Si el navegador bloquea la reproducción automática, no pasa nada:
      // simplemente el usuario deberá presionar el botón otra vez.
    });
    btnMusica.textContent = "⏸ Pausar";
    btnMusica.classList.add("sonando");
  }
  sonando = !sonando;
});

/* =========================================================
   6. PÁGINA FINAL — texto en secuencia + partículas
   ========================================================= */
const paginaFinal = document.querySelector(".pagina-final");
const linea2 = document.querySelector(".final-linea2");
const linea3 = document.querySelector(".final-linea3");
const contenedorParticulas = document.getElementById("particulas");

let animacionFinalHecha = false;

function lanzarParticulas() {
  const simbolos = ["❤️", "✨", "💕", "⭐"];
  for (let i = 0; i < 25; i++) {
    const particula = document.createElement("span");
    particula.className = "particula";
    particula.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    particula.style.left = Math.random() * 100 + "%";
    particula.style.fontSize = 14 + Math.random() * 16 + "px";
    particula.style.animationDuration = 4 + Math.random() * 4 + "s";
    particula.style.animationDelay = Math.random() * 3 + "s";
    contenedorParticulas.appendChild(particula);
  }
}

function reproducirAnimacionFinal() {
  if (animacionFinalHecha) return;
  animacionFinalHecha = true;

  lanzarParticulas();

  setTimeout(() => linea2.classList.remove("oculto"), 1200);
  setTimeout(() => linea3.classList.remove("oculto"), 2600);
}

// Detectamos cuándo el usuario llega a la última página
const observador = new MutationObserver(() => {
  if (paginaFinal.classList.contains("activa")) {
    reproducirAnimacionFinal();
  }
});
observador.observe(paginaFinal, { attributes: true, attributeFilter: ["class"] });
/* =========================================================
   7. MOSTRAR MENSAJE AL TOCAR UNA FOTO (página 4)
   ========================================================= */
document.querySelectorAll(".foto-marco").forEach((foto) => {
  foto.addEventListener("click", () => {
    foto.classList.toggle("mostrando-mensaje");
  });
});