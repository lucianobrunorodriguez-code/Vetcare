// ============================================================================
// common.js
// Código compartido por TODAS las páginas (index.html, paciente.html, doctor.html).
// Acá viven: los datos de la clínica (servicios, equipo, pacientes de ejemplo),
// los íconos, las fotos, y funciones de utilidad (modales, animaciones, chatbot).
// Cada página además carga su propio script (home.js / paciente.js / doctor.js)
// con la lógica que le pertenece solo a ella.
//
// Este archivo usa "funciones flecha" (const x = () => {...}) y plantillas de
// texto con backticks `hola ${variable}` en vez de comillas normales — son dos
// formas modernas de escribir JavaScript, hacen lo mismo que las formas
// clásicas (function() {...} y "hola " + variable) pero más corto.
// ============================================================================

// ============================================================================
// GUÍA: cómo poner tus propias fotos (leé esto primero)
// ============================================================================
// Todas las fotos del sitio salen de la carpeta fotos/ (ver fotos/LEEME.txt
// para la lista exacta de nombres de archivo). Ya NO se usan fotos de
// internet como relleno — si alguna vez falta un archivo local para algo
// que sí necesita foto (una mascota nueva sin foto propia, o un doctor
// invitado que no está en el equipo), se usa una de las fotos LOCALES que
// ya tenemos como imagen genérica (ver DEFAULT_PHOTOS más abajo), nunca se
// va a internet a buscar una.
const FOTOS_LOCAL = 'fotos/';

// Fotos genéricas locales para los casos sin foto propia asignada:
//  - doctor: cuando alguien inicia sesión como doctor con un nombre que no
//    coincide con nadie del equipo ("doctor invitado").
//  - perro / gato: cuando el paciente registra una mascota nueva durante la
//    reserva (no hay forma de subir una foto en el formulario).
const DEFAULT_PHOTOS = {
  doctor: 'equipo/dr.pitbull.jpg',
  perro: 'mascotas/goldenret.jpg',
  gato: 'mascotas/taly gato.jpeg'
};
// Foto genérica según la especie (para mascotas sin foto propia).
function defaultPetPhoto(especie) {
  return especie === 'Gato' ? DEFAULT_PHOTOS.gato : DEFAULT_PHOTOS.perro;
}

// avatarImg(): arma un <img> circular apuntando a una foto local.
//   localFile → el nombre del archivo dentro de fotos/ (ej. 'equipo/dra.ruth.jpg').
//   alt, cls  → el texto alternativo y la clase CSS del <img>, como siempre.
// Si localFile viene vacío, no dibuja ningún <img> (queda lo que haya
// detrás, por ejemplo las iniciales del doctor). El onerror solo cubre el
// caso de que el archivo esté roto o mal escrito: ahí sí lo saca del todo
// en vez de mostrar el ícono de "imagen rota".
function avatarImg(localFile, alt, cls) {
  if (!localFile) return '';
  return `<img src="${FOTOS_LOCAL + localFile}" alt="${alt}" class="${cls}" loading="lazy" onerror="this.remove()">`;
}

// bgFoto(): lo mismo que avatarImg() pero para fotos de FONDO puestas con
// CSS background-image (los banners de servicios, el hero de los portales,
// etc.) en vez de con una etiqueta <img>. extraLayer es opcional (ej. un
// degradé de color) y se dibuja detrás, por si la foto tarda en cargar.
function bgFoto(localFile, extraLayer) {
  const layers = [`url('${FOTOS_LOCAL + localFile}')`];
  if (extraLayer) layers.push(extraLayer);
  return layers.join(', ');
}

// ==================== ÍCONOS ====================
// Cada ícono es un SVG chiquito (24x24) dibujado a mano con líneas simples.
// Se guardan como texto (strings de HTML) para poder insertarlos fácil
// dentro de otras plantillas con innerHTML. La clave (ej. "cirugia") es la
// que se usa en SERVICES/TEAM para saber qué ícono le corresponde a cada uno.
// (Estos son puro dibujo vectorial, no hace falta tocarlos para cambiar fotos.)
const ICONS = {
  consulta: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v4a2.5 2.5 0 0 0 5 0V3"/><path d="M9 10v2.5a4.5 4.5 0 0 0 9 0V10"/><circle cx="18" cy="9" r="2"/></svg>`,
  cirugia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l6 2.5v5c0 4.5-3 7.5-6 8.5-3-1-6-4-6-8.5v-5L12 3z"/><path d="M12 8.5v5M9.3 11h5.4"/></svg>`,
  vacunacion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(45 12 12)"><rect x="7.5" y="9.5" width="10" height="5" rx="1.2"/><line x1="7.5" y1="9.5" x2="7.5" y2="14.5"/><line x1="17.5" y1="12" x2="21" y2="12"/><line x1="10.5" y1="9.5" x2="10.5" y2="14.5"/></g></svg>`,
  laboratorio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4M11 3v9l-4.3 6.2A2 2 0 0 0 8.3 21h7.4a2 2 0 0 0 1.6-3.2L13 12V3"/><path d="M9 15.5h6"/></svg>`,
  odontologia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4c0-1.1 1.4-2 2.5-1.3.5.3 1 .4 1.5.4s1-.1 1.5-.4C13.6 2 15 2.9 15 4c0 1.4-.6 2-1 4.3-.3 2-.4 5.7-1.8 5.7-1.1 0-1.2-2.2-1.5-3.6-.1-.7-.4-1.1-.7-1.1s-.6.4-.7 1.1c-.3 1.4-.4 3.6-1.5 3.6-1.4 0-1.5-3.7-1.8-5.7C5.6 6 5 5.4 5 4"/></svg>`,
  emergencia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.3-9.5-8.8C.8 7.7 2.5 4 6 4c2 0 3.4 1.1 4 2 .6-.9 2-2 4-2 3.5 0 5.2 3.7 3.5 7.2C19 15.7 12 20 12 20z"/><path d="M4.5 11.5h3l1.5-3 2 5 1.5-3H19"/></svg>`,
  bano: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z"/><path d="M4 12V8a2 2 0 0 1 3.5-1.3"/><path d="M6 19v1.6M15 19v1.6"/><circle cx="17" cy="5" r="1"/><circle cx="19.3" cy="7.2" r=".8"/></svg>`,
  corte: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M7.8 7.5L19 18M7.8 16.5L19 6"/></svg>`,
  deslanado: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="10" height="4" rx="1.2"/><path d="M6.5 10V7.5M8.5 10V6.5M10.5 10V7.5M12.5 10V6.5M14.5 10V7.5"/><path d="M18.2 8.5c1.4 1.6 1.4 3.4 0 5-1.4-1.6-1.4-3.4 0-5z"/></svg>`,
  rayosx: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.6"/><circle cx="15.5" cy="15" r="1.6"/><line x1="9.7" y1="10.2" x2="14.3" y2="13.8"/></svg>`,
  ecografia: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="9" width="7" height="10" rx="2"/><path d="M13.5 9c2 1.5 2 6.5 0 8"/><path d="M17 6c4 3 4 11 0 14"/></svg>`,
  hospitalizacion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/><path d="M13 13v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M2 18h20M2 15h20"/><circle cx="7" cy="9" r="1.4"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>`
};

// ==================== DATOS DE LA CLÍNICA ====================
// TEAM y SERVICES son la "base de datos" del catálogo (fija, no cambia sola).
// Las MASCOTAS y CITAS en cambio SÍ se pueden crear/editar en vivo (el
// doctor agrega diagnósticos, el paciente reserva citas nuevas) — esas viven
// en un "almacén compartido" con localStorage, ver más abajo.
//
// Cada objeto tiene un campo "file": es el nombre exacto que tiene que tener
// tu foto dentro de la carpeta fotos/ para que se use en vez de la de relleno
// (ver la GUÍA arriba de todo y fotos/LEEME.txt).

// SPECIALTY_LABELS: el texto lindo que se muestra para cada especialidad.
// La CLAVE (ej. 'cirugia') es un identificador interno que conecta 3 cosas:
// 1) el "specialtyKey" de un servicio en SERVICES,
// 2) el/los "specialtyKeys" de cada doctor en TEAM,
// 3) el paso "elegí tu doctor" del asistente de reserva, que junta las dos
//    listas de arriba: agarra el specialtyKey del servicio elegido y busca
//    en TEAM todos los doctores que atienden esa especialidad.
const SPECIALTY_LABELS = {
  'medicina-general': 'Medicina general',
  'prevencion': 'Medicina preventiva',
  'cirugia': 'Cirugía general',
  'diagnostico': 'Diagnóstico clínico',
  'odontologia': 'Odontología veterinaria',
  'estetica': 'Estética y grooming',
  'urgencias': 'Urgencias',
  'rayosx': 'Rayos X',
  'ecografia': 'Ecografía',
  'hospitalizacion': 'Hospitalización'
};

// El equipo médico. Ahora cada especialidad tiene AL MENOS 2 doctores
// (menos urgencias), para que al reservar una cita realmente haya entre
// quién elegir.
//   file           → nombre del archivo en fotos/equipo/ (si no pusiste foto, queda null)
//   photo          → foto de relleno (retrato genérico) mientras no pongas la tuya
//   icon           → qué ícono le corresponde (ver ICONS arriba)
//   specialtyKeys  → en qué especialidades atiende (un doctor puede tener más de una)
const TEAM = [
  // Foto: fotos/equipo/dra.ruth.jpg
  { name: 'Dra. Natalia Montaño', specialty: 'Cirugía general', initials: 'NM', icon: 'cirugia', file: 'equipo/dra.ruth.jpg', specialtyKeys: ['cirugia'] },
  // Foto: fotos/equipo/dr.ozuna.jpg
  { name: 'Dr. Aaron Aramayo', specialty: 'Medicina general y preventiva', initials: 'AA', icon: 'consulta', file: 'equipo/dr.ozuna.jpg', specialtyKeys: ['medicina-general', 'prevencion'] },
  // Foto: fotos/equipo/dra.robamaridos.jpg
  { name: 'Dra. Gema Claudia', specialty: 'Medicina interna y diagnóstico', initials: 'GC', icon: 'laboratorio', file: 'equipo/dra.robamaridos.jpg', specialtyKeys: ['diagnostico'] },
  // Foto: fotos/equipo/dra. p3.jpg  (ojo: el nombre de archivo tiene un espacio, está bien así)
  { name: 'Dra. Ruth', specialty: 'Estética y grooming', initials: 'R', icon: 'corte', file: 'equipo/dra. p3.jpg', specialtyKeys: ['estetica'] },
  // Foto: fotos/equipo/dr.maluma.jpg
  { name: 'Dr. Luciano Rodriguez', specialty: 'Odontología veterinaria', initials: 'LR', icon: 'odontologia', file: 'equipo/dr.maluma.jpg', specialtyKeys: ['odontologia'] },
  // Foto: fotos/equipo/dr.pitbull.jpg — tu tutor
  { name: 'Dr. Cesar Vega', specialty: 'Medicina general', initials: 'CV', icon: 'consulta', file: 'equipo/dr.pitbull.jpg', specialtyKeys: ['medicina-general'] },
  // Foto: fotos/equipo/rafael roman.jpg — segundo peluquero/estilista
  { name: 'Dr. Rafael Roman', specialty: 'Estética y grooming', initials: 'RR', icon: 'corte', file: 'equipo/rafael roman.jpg', specialtyKeys: ['estetica'] },
  // Foto: fotos/equipo/dra. renata.jpg — segunda cirujana, también cubre odontología
  { name: 'Dra. Renata Cano', specialty: 'Cirugía y odontología', initials: 'RC', icon: 'cirugia', file: 'equipo/dra. renata.jpg', specialtyKeys: ['cirugia', 'odontologia'] },
  // Foto: fotos/equipo/dr.bruno.jpg — segundo especialista en diagnóstico
  { name: 'Dr. Bruno Salas', specialty: 'Diagnóstico clínico', initials: 'BS', icon: 'laboratorio', file: 'equipo/dr.bruno.jpg', specialtyKeys: ['diagnostico'] },
  // Foto: fotos/equipo/dra. paula.jpg — guardia de urgencias, también cubre vacunación
  { name: 'Dra. Paula Ibáñez', specialty: 'Urgencias y medicina preventiva', initials: 'PI', icon: 'emergencia', file: 'equipo/dra. paula.jpg', specialtyKeys: ['urgencias', 'prevencion'] },
  // Foto: fotos/equipo/dra.rayosx.jpg — encargada de Rayos X (nombre inventado, cambialo si querés)
  { name: 'Dra. Melissa Fuentes', specialty: 'Rayos X', initials: 'MF', icon: 'rayosx', file: 'equipo/dra.rayosx.jpg', specialtyKeys: ['rayosx'] },
  // Foto: fotos/equipo/dr.ecografias.jpg — encargada de Ecografías (nombre inventado, cambialo si querés)
  { name: 'Dra. Carla Espinoza', specialty: 'Ecografía', initials: 'CE', icon: 'ecografia', file: 'equipo/dr.ecografias.jpg', specialtyKeys: ['ecografia'] },
  // Foto: fotos/equipo/dra.hospitalizacion.jpg — encargada de Hospitalización (nombre inventado, cambialo si querés)
  { name: 'Dra. Daniela Cortez', specialty: 'Hospitalización', initials: 'DC', icon: 'hospitalizacion', file: 'equipo/dra.hospitalizacion.jpg', specialtyKeys: ['hospitalizacion'] }
];

// Busca en TEAM al doctor cuyo nombre se parece a "name" (le sacamos el
// "Dr./Dra." antes de comparar, así funciona aunque falte el título).
// Se usa tanto para mostrar la foto del doctor logueado como para saber
// a qué doctor le pertenece cada cita.
function normalizeDoctorName(name) {
  return (name || '').toLowerCase().replace(/^dr\.?a?\.?\s*/, '').trim();
}
function findTeamMember(name) {
  const clean = normalizeDoctorName(name);
  if (!clean) return null;
  return TEAM.find(t => {
    const tClean = normalizeDoctorName(t.name);
    return tClean.includes(clean) || clean.includes(tClean);
  }) || null;
}
// Devuelve todos los doctores que atienden una especialidad (para el paso
// "elegí tu doctor" del asistente de reserva).
function doctorsForSpecialty(key) {
  return TEAM.filter(t => t.specialtyKeys.includes(key));
}

// El catálogo de servicios.
//   cat          → 'medico' o 'estetico' (para el filtro de chips en la página de inicio)
//   specialtyKey → qué especialidad cubre (conecta con doctorsForSpecialty, arriba)
//   file         → nombre del archivo en fotos/servicios/
//   photo        → palabra clave de relleno mientras no pongas tu propia foto
const SERVICES = [
  // Foto: fotos/servicios/consulta.jpg
  { id: 'consulta', cat: 'medico', title: 'Consulta general', desc: 'Revisión completa de salud con historial clínico digital siempre a mano.', specialtyKey: 'medicina-general', icon: 'consulta', file: 'servicios/consulta.jpg' },
  // Foto: fotos/servicios/cirugia.jpg
  { id: 'cirugia', cat: 'medico', title: 'Cirugía', desc: 'Procedimientos con equipo certificado y seguimiento post-operatorio.', specialtyKey: 'cirugia', icon: 'cirugia', file: 'servicios/cirugia.jpg' },
  // Foto: fotos/servicios/vacunacion.jpg
  { id: 'vacunacion', cat: 'medico', title: 'Vacunación', desc: 'Calendario de vacunas con recordatorios automáticos para no olvidar ninguna.', specialtyKey: 'prevencion', icon: 'vacunacion', file: 'servicios/vacunacion.jpg' },
  // Foto: fotos/servicios/laboratorio.jpg
  { id: 'laboratorio', cat: 'medico', title: 'Laboratorio', desc: 'Análisis clínicos con resultados digitales entregados directo al doctor.', specialtyKey: 'diagnostico', icon: 'laboratorio', file: 'servicios/laboratorio.jpg' },
  // Foto: fotos/servicios/rayosx.jpg
  { id: 'rayosx', cat: 'medico', title: 'Rayos X', desc: 'Radiografías digitales para detectar fracturas, obstrucciones y mucho más.', specialtyKey: 'rayosx', icon: 'rayosx', file: 'servicios/rayosx.jpg' },
  // Foto: fotos/servicios/ecografia.jpg
  { id: 'ecografia', cat: 'medico', title: 'Ecografía', desc: 'Estudio por imágenes para revisar órganos internos sin procedimientos invasivos.', specialtyKey: 'ecografia', icon: 'ecografia', file: 'servicios/ecografia.jpg' },
  // Foto: fotos/servicios/sonrisa.jpg
  { id: 'odontologia', cat: 'medico', title: 'Odontología', desc: 'Limpieza dental y tratamiento de piezas para una sonrisa sana.', specialtyKey: 'odontologia', icon: 'odontologia', file: 'servicios/sonrisa.jpg' },
  // Foto: fotos/servicios/hospitalizacion.jpg
  { id: 'hospitalizacion', cat: 'medico', title: 'Hospitalización', desc: 'Internación con monitoreo constante para una recuperación segura.', specialtyKey: 'hospitalizacion', icon: 'hospitalizacion', file: 'servicios/hospitalizacion.jpg' },
  // Foto: fotos/servicios/emergencias.jpg — no se reserva online, se llama directo, atiende las 24 horas
  { id: 'emergencias', cat: 'medico', title: 'Emergencias 24/7', desc: 'Atención prioritaria, todos los días del año, a cualquier hora.', specialtyKey: 'urgencias', icon: 'emergencia', file: 'servicios/emergencias.jpg' },
  // Foto: fotos/servicios/bano.jpg  (ej. baño y spa)
  { id: 'bano', cat: 'estetico', title: 'Baño y spa', desc: 'Baño relajante con productos hipoalergénicos e hidratación profunda.', specialtyKey: 'estetica', icon: 'bano', file: 'servicios/bano.jpg' },
  // Foto: fotos/servicios/cortes.jpeg  (ej. estética / peluquería)
  { id: 'corte', cat: 'estetico', title: 'Corte y peluquería', desc: 'Corte a tijera o máquina según la raza, con acabado de exposición.', specialtyKey: 'estetica', icon: 'corte', file: 'servicios/cortes.jpeg' },
  // Foto: fotos/servicios/deslanado.jpg
  { id: 'deslanado', cat: 'estetico', title: 'Deslanado e hidratación', desc: 'Tratamiento para el cambio de pelaje y piel reseca en cada temporada.', specialtyKey: 'estetica', icon: 'deslanado', file: 'servicios/deslanado.jpg' }
];

// ============================================================================
// ALMACÉN COMPARTIDO (localStorage) — mascotas y citas
// ============================================================================
// Acá está la parte "más real" que pediste: las mascotas y las citas ya NO
// son datos fijos, viven en localStorage. A diferencia de sessionStorage
// (que ya usábamos para "quién soy"), localStorage:
//   - se comparte entre TODAS las pestañas del mismo navegador (por eso el
//     doctor puede ver, en su propia pestaña, una cita que reservó el
//     paciente en la suya),
//   - NO se borra al cerrar la pestaña (solo si el usuario borra los datos
//     del sitio, o vos lo borrás a propósito).
// Límite real (no hay forma de evitarlo sin un servidor): esto solo se ve
// en la MISMA computadora y el MISMO navegador. Si lo abrís en otra PC o en
// modo incógnito, empieza de cero — no hay backend que sincronice entre
// dispositivos.
const STORE_KEYS = { mascotas: 'vetcareMascotas', citas: 'vetcareCitas', internaciones: 'vetcareInternaciones', seeded: 'vetcareSeededV2' };

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// mascotas se guarda como un OBJETO { idDeLaMascota: {...datos...} } en vez
// de un array, para poder ir directo a "la mascota con tal id" sin recorrer
// toda la lista cada vez (más simple para buscar/actualizar).
function allMascotas() { return loadJSON(STORE_KEYS.mascotas, {}); }
function allCitas() { return loadJSON(STORE_KEYS.citas, []); }

function getMascota(id) { return allMascotas()[id] || null; }

// Reemplaza (o crea) una mascota completa.
function saveMascota(mascota) {
  const all = allMascotas();
  all[mascota.id] = mascota;
  saveJSON(STORE_KEYS.mascotas, all);
}
// Actualiza SOLO los campos que le pases (ej. { peso: '8 kg' }), sin tocar
// el resto de la ficha. Esto es lo que usa el doctor cuando edita datos.
function updateMascota(id, patch) {
  const all = allMascotas();
  if (!all[id]) return null;
  all[id] = Object.assign({}, all[id], patch);
  saveJSON(STORE_KEYS.mascotas, all);
  return all[id];
}
// Agrega una entrada nueva al historial clínico (un "diagnóstico nuevo").
// unshift = la agrega al PRINCIPIO de la lista, para que lo último quede arriba.
function addHistorialEntry(mascotaId, entry) {
  const all = allMascotas();
  const m = all[mascotaId];
  if (!m) return;
  m.historial = [entry, ...(m.historial || [])];
  saveJSON(STORE_KEYS.mascotas, all);
}
function addVacuna(mascotaId, entry) {
  const all = allMascotas();
  const m = all[mascotaId];
  if (!m) return;
  m.vacunas = [...(m.vacunas || []), entry];
  saveJSON(STORE_KEYS.mascotas, all);
}
function addDesparasitacion(mascotaId, entry) {
  const all = allMascotas();
  const m = all[mascotaId];
  if (!m) return;
  m.desparasitaciones = [...(m.desparasitaciones || []), entry];
  saveJSON(STORE_KEYS.mascotas, all);
}

function addCita(cita) {
  const all = allCitas();
  all.unshift(cita);
  saveJSON(STORE_KEYS.citas, all);
}

// ==================== INTERNACIONES (pacientes hospitalizados) ====================
// Un registro de internación es más completo que una cita normal: guarda
// cuándo ingresó, cuándo se va (o null si sigue internado), y la lista de
// medicamentos que le están dando (nombre, cada cuánto, y desde cuándo).
// Vive en su propio "cajón" de localStorage, separado de citas/mascotas,
// porque es información propia de la internación, no de la mascota en sí
// ni de una cita puntual.
function allInternaciones() { return loadJSON(STORE_KEYS.internaciones, []); }
function saveInternaciones(list) { saveJSON(STORE_KEYS.internaciones, list); }

function addInternacion(internacion) {
  const all = allInternaciones();
  all.unshift(internacion);
  saveInternaciones(all);
  return internacion;
}
function updateInternacion(id, patch) {
  const all = allInternaciones();
  const i = all.findIndex(x => x.id === id);
  if (i === -1) return null;
  all[i] = Object.assign({}, all[i], patch);
  saveInternaciones(all);
  return all[i];
}
// Agrega un medicamento nuevo a la lista de esa internación.
function addMedicamento(internacionId, medicamento) {
  const all = allInternaciones();
  const i = all.findIndex(x => x.id === internacionId);
  if (i === -1) return;
  all[i].medicamentos = [...(all[i].medicamentos || []), medicamento];
  saveInternaciones(all);
}
// Todas las internaciones a cargo de un doctor (comparando el nombre de
// forma flexible, igual que citasByDoctor), más recientes primero.
function internacionesByDoctor(doctorName) {
  const clean = normalizeDoctorName(doctorName);
  return allInternaciones()
    .filter(i => normalizeDoctorName(i.doctor) === clean)
    .sort((a, b) => b.id.localeCompare(a.id));
}

// "ownerKey" es cómo identificamos de quién es cada mascota, ya que no hay
// login real: usamos el NOMBRE que escribió al entrar (si no puso nombre,
// el correo), todo en minúscula. Dos personas que escriban el mismo nombre
// "comparten" las mismas mascotas — es una simulación, no un login de verdad.
// Para entrar como uno de los dueños de ejemplo y ver sus mascotas ya
// cargadas, alcanza con escribir el NOMBRE DE PILA al registrarte (no hace
// falta el apellido): "Jolye" (ve a Pujol), "Natalia" (ve a Michigan),
// "Luciano" (ve a Tinny) o "Aaron" (ve a Lizzie).
// Cualquier otro nombre = paciente nuevo, sin mascotas todavía.
function ownerKeyFromSession(session) {
  const raw = (session && (session.name || session.email)) || 'invitado';
  return raw.trim().toLowerCase();
}
// Compara el nombre que escribiste (sessionKey) contra el dueño guardado en
// un registro (recordKey): coinciden si son iguales, o si alguna de las
// PALABRAS del dueño guardado es exactamente lo que escribiste — así
// "luciano" matchea con "luciano rodriguez" sin tener que escribir el
// apellido. (Comparamos por palabra completa, no por cualquier pedacito de
// texto, para que un nombre cortito como "jo" no matchee por accidente con
// "jolye andia".)
function ownerMatches(recordKey, sessionKey) {
  if (!recordKey || !sessionKey) return false;
  if (recordKey === sessionKey) return true;
  return recordKey.split(/\s+/).includes(sessionKey);
}
function mascotasByOwner(ownerKey) {
  return Object.values(allMascotas()).filter(m => ownerMatches(m.ownerKey, ownerKey));
}
function citasByOwner(ownerKey) {
  return allCitas().filter(c => ownerMatches(c.ownerKey, ownerKey));
}
// Todas las citas asignadas a un doctor (comparando el nombre de forma
// flexible, igual que findTeamMember) — esto es lo que arma la agenda que
// ve el doctor al loguearse.
function citasByDoctor(doctorName) {
  const clean = normalizeDoctorName(doctorName);
  return allCitas().filter(c => normalizeDoctorName(c.doctor) === clean);
}

// Carga los datos de ejemplo la PRIMERA vez que se abre el sitio en este
// navegador (si ya existen, no hace nada — así no se pisan los cambios que
// ya hizo el doctor o las citas que ya reservó el paciente). Se llama una
// sola vez, más abajo, apenas carga este archivo.
function seedIfNeeded() {
  if (loadJSON(STORE_KEYS.seeded, false)) return;

  const mascotas = {
    pujol: {
      id: 'pujol', nombre: 'Pujol', especie: 'Perro', raza: 'Puddle', edad: '5 años', peso: '7.2 kg',
      alergias: 'Ninguna conocida',
      vacunas: [
        { nombre: 'Antirrábica', fecha: '15 Ene 2026' },
        { nombre: 'Polivalente (Óctuple)', fecha: '15 Ene 2026' }
      ],
      desparasitaciones: [{ tipo: 'Interna y externa', fecha: '15 Ene 2026' }],
      historial: [
        { fecha: '12 Jul 2026', servicio: 'Vacunación', doctor: 'Dr. Aaron Aramayo', nota: 'Refuerzo antirrábico aplicado sin novedad.' },
        { fecha: '02 Mar 2026', servicio: 'Consulta general', doctor: 'Dr. Cesar Vega', nota: 'Chequeo anual, peso e indicadores normales.' }
      ],
      file: 'mascotas/puddle.jpg', ownerKey: 'jolye andia', ownerName: 'Jolye Andia'
    },
    michigan: {
      id: 'michigan', nombre: 'Michigan', especie: 'Gato', raza: 'Mestizo', edad: '1 año', peso: '3.8 kg',
      alergias: 'Ninguna conocida',
      vacunas: [{ nombre: 'Triple felina', fecha: '18 May 2026' }],
      desparasitaciones: [{ tipo: 'Interna', fecha: '18 May 2026' }],
      historial: [
        { fecha: '18 May 2026', servicio: 'Consulta general', doctor: 'Dr. Aaron Aramayo', nota: 'Leve conjuntivitis, tratada con gotas.' }
      ],
      file: 'mascotas/taly.jpeg', ownerKey: 'natalia montaño', ownerName: 'Natalia Montaño'
    },
    tinny: {
      id: 'tinny', nombre: 'Tinny', especie: 'Perro', raza: 'Shih Tzu', edad: '2 años', peso: '6.5 kg',
      alergias: 'Ninguna conocida',
      vacunas: [
        { nombre: 'Antirrábica', fecha: '02 Mar 2026' },
        { nombre: 'Polivalente (Óctuple)', fecha: '02 Mar 2026' }
      ],
      desparasitaciones: [{ tipo: 'Interna y externa', fecha: '02 Mar 2026' }],
      historial: [
        { fecha: '30 Jul 2026', servicio: 'Cirugía', doctor: 'Dra. Natalia Montaño', nota: 'Esterilización sin complicaciones.' },
        { fecha: '10 Abr 2026', servicio: 'Consulta general', doctor: 'Dr. Cesar Vega', nota: 'Chequeo previo a la cirugía, apto para el procedimiento.' }
      ],
      file: 'mascotas/tinny.jpeg', ownerKey: 'luciano rodriguez', ownerName: 'Luciano Rodriguez'
    },
    lizzie: {
      id: 'lizzie', nombre: 'Lizzie', especie: 'Gato', raza: 'Persa', edad: '4 años', peso: '4.1 kg',
      alergias: 'Ninguna conocida',
      vacunas: [{ nombre: 'Triple felina', fecha: '05 Ene 2026' }],
      desparasitaciones: [{ tipo: 'Interna', fecha: '05 Ene 2026' }],
      historial: [
        { fecha: '05 Ene 2026', servicio: 'Laboratorio', doctor: 'Dra. Gema Claudia', nota: 'Panel sanguíneo dentro de parámetros normales.' }
      ],
      file: 'mascotas/aaron.jpeg', ownerKey: 'aaron aramayo', ownerName: 'Aaron Aramayo'
    },
    rio: {
      id: 'rio', nombre: 'Rio', especie: 'Ave', raza: 'Perico australiano', edad: '1 año', peso: '35 g',
      alergias: 'Ninguna conocida',
      vacunas: [],
      desparasitaciones: [{ tipo: 'Interna', fecha: '20 Jun 2026' }],
      historial: [
        { fecha: '20 Jun 2026', servicio: 'Consulta general', doctor: 'Dr. Cesar Vega', nota: 'Plumaje y peso normales, sin signos de enfermedad.' }
      ],
      file: 'mascotas/rio.jpg', ownerKey: 'jolye andia', ownerName: 'Jolye Andia'
    },
    copito: {
      id: 'copito', nombre: 'Copito', especie: 'Hamster', raza: 'Sirio', edad: '8 meses', peso: '140 g',
      alergias: 'Ninguna conocida',
      vacunas: [],
      desparasitaciones: [],
      historial: [
        { fecha: '02 Ago 2026', servicio: 'Consulta general', doctor: 'Dr. Aaron Aramayo', nota: 'Chequeo de rutina, buen estado general.' }
      ],
      file: 'mascotas/copito.jpg', ownerKey: 'natalia montaño', ownerName: 'Natalia Montaño'
    }
  };

  const citas = [
    { id: 'c1', mascotaId: 'pujol', servicio: 'Consulta general', fecha: '26 Ago 2026', hora: '4:30 PM', doctor: 'Dr. Cesar Vega', estado: 'Confirmada', ownerKey: 'jolye andia', motivo: 'Chequeo anual de rutina.' },
    { id: 'c2', mascotaId: 'michigan', servicio: 'Vacunación', fecha: '26 Ago 2026', hora: '5:00 PM', doctor: 'Dr. Aaron Aramayo', estado: 'Confirmada', ownerKey: 'natalia montaño', motivo: 'Control de vacunación anual.' },
    { id: 'c3', mascotaId: 'tinny', servicio: 'Control post-quirúrgico', fecha: '26 Ago 2026', hora: '5:30 PM', doctor: 'Dra. Natalia Montaño', estado: 'Confirmada', ownerKey: 'luciano rodriguez', motivo: 'Revisión post-operatoria.' },
    { id: 'c4', mascotaId: 'lizzie', servicio: 'Consulta general', fecha: '26 Ago 2026', hora: '6:00 PM', doctor: 'Dra. Gema Claudia', estado: 'Confirmada', ownerKey: 'aaron aramayo', motivo: 'Cojea de la pata trasera izquierda.' }
  ];

  saveJSON(STORE_KEYS.mascotas, mascotas);
  saveJSON(STORE_KEYS.citas, citas);
  saveJSON(STORE_KEYS.seeded, true);
}

// ============================================================================
// CUENTAS (localStorage) — quién puede iniciar sesión
// ============================================================================
// "Crear cuenta" ya NO te lleva a ningún lado: solo agrega tu nombre a esta
// lista compartida (localStorage, así que también queda guardada si volvés
// mañana). "Iniciar sesión" SOLO funciona si el nombre que escribiste
// coincide con alguien de esta lista — si no, te avisa y no te deja pasar.
// Arranca con los 4 dueños de ejemplo y los 10 del equipo médico ya
// "registrados", para que se pueda probar el login desde el primer momento.
const ACCOUNTS_KEY = 'vetcareAccounts';
function allAccounts() { return loadJSON(ACCOUNTS_KEY, []); }
function saveAccounts(list) { saveJSON(ACCOUNTS_KEY, list); }

// A diferencia de seedIfNeeded() (que solo carga una vez y no toca nada más),
// esta se fija SIEMPRE que los 4 dueños de ejemplo y TODO el equipo de TEAM
// tengan su cuenta — así, si mañana agregás un doctor nuevo a TEAM, con solo
// recargar la página ya puede iniciar sesión, sin tener que borrar nada.
function seedAccountsIfNeeded() {
  const pacientes = [
    { name: 'Jolye Andia', email: '', role: 'paciente', specialty: '' },
    { name: 'Natalia Montaño', email: '', role: 'paciente', specialty: '' },
    { name: 'Luciano Rodriguez', email: '', role: 'paciente', specialty: '' },
    { name: 'Aaron Aramayo', email: '', role: 'paciente', specialty: '' }
  ];
  const doctores = TEAM.map(t => ({ name: t.name, email: '', role: 'doctor', specialty: t.specialty }));
  const accounts = allAccounts();
  [...pacientes, ...doctores].forEach(cuenta => {
    if (!findAccount(cuenta.name, cuenta.role)) accounts.push(cuenta);
  });
  saveAccounts(accounts);
}

// Busca una cuenta que coincida con lo que escribió el usuario (dentro del
// rol elegido: no confunde un doctor con un paciente). Coincide si es
// exactamente igual, si es una de las palabras del nombre guardado (así
// "cesar" encuentra a "Dr. Cesar Vega"), o si uno contiene al otro.
function findAccount(typedName, role) {
  const key = (typedName || '').trim().toLowerCase();
  if (!key) return null;
  return allAccounts().find(a => {
    if (a.role !== role) return false;
    const aKey = a.name.toLowerCase();
    return aKey === key || aKey.split(/\s+/).includes(key) || aKey.includes(key) || key.includes(aKey);
  }) || null;
}

// "Crea" una cuenta (simulado): la agrega a la lista si no existía ya una
// con ese nombre y rol. Devuelve la cuenta creada (o la que ya existía).
function registerAccount({ name, email, role, specialty }) {
  const accounts = allAccounts();
  const existing = findAccount(name, role);
  if (existing) return existing;
  const account = { name: name.trim(), email: (email || '').trim().toLowerCase(), role, specialty: specialty || '' };
  accounts.push(account);
  saveAccounts(accounts);
  return account;
}

// "Reseteo de fábrica": borra TODO lo que se haya probado (citas nuevas,
// mascotas creadas al vuelo, internaciones, cuentas registradas) y deja el
// sistema como recién instalado, con solo los datos de ejemplo originales.
// Corre UNA sola vez por navegador (usa su propia bandera, 'vetcareResetV1')
// — así que aunque lo agreguemos hoy, no le va a volver a borrar nada a
// nadie en el futuro; es un "limpiar de una vez", no un reseteo automático
// cada vez que se carga la página.
function factoryResetIfNeeded() {
  if (loadJSON('vetcareResetV1', false)) return;
  localStorage.removeItem(STORE_KEYS.mascotas);
  localStorage.removeItem(STORE_KEYS.citas);
  localStorage.removeItem(STORE_KEYS.internaciones);
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(STORE_KEYS.seeded);
  saveJSON('vetcareResetV1', true);
}

// Se ejecuta apenas se carga este archivo (no espera a DOMContentLoaded
// porque no toca la página, solo localStorage) para que los datos ya estén
// listos cuando home.js/paciente.js/doctor.js los necesiten.
factoryResetIfNeeded();
seedIfNeeded();
seedAccountsIfNeeded();

// ==================== SESIÓN (viaja entre páginas) ====================
// Como el sitio no tiene servidor/backend real, "iniciar sesión" solo guarda
// un objeto simple en sessionStorage del navegador (dura mientras la pestaña
// esté abierta; se borra si la cerrás). index.html lo escribe al hacer
// login/registro, y paciente.html / doctor.html lo leen al cargar para saber
// quién sos. Todo esto es "de mentira": no hay contraseñas reales verificadas
// en ningún lado, es solo para que la demo se sienta completa.
const Session = {
  // Lee { role, name, email, specialty } guardado al iniciar sesión en
  // index.html. Devuelve null si nunca se guardó nada (ej. primera visita).
  get() {
    try { return JSON.parse(sessionStorage.getItem('vetcareSession')) || null; }
    catch (e) { return null; }
  },
  set(data) {
    try { sessionStorage.setItem('vetcareSession', JSON.stringify(data)); } catch (e) {}
  },
  clear() {
    try { sessionStorage.removeItem('vetcareSession'); } catch (e) {}
  }
};

// ==================== ATAJOS ====================
// $ y $$ son atajos cortos para no escribir document.querySelector(All) cada
// vez. $('#algo') devuelve UN elemento; $$('.algo') devuelve una LISTA
// (un array de verdad, con .map/.forEach/.filter) de todos los que matcheen.
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Muestra el mensajito flotante arriba de la pantalla ("¡Cuenta creada!",
// etc.) y lo esconde solo después de 2.6 segundos.
function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t); // si ya había un mensaje por desaparecer, cancelamos ese timer viejo
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

// Abre/cierra un modal (login, ficha, reserva, etc.) agregando/quitando la
// clase CSS "open" — toda la animación de aparecer/desaparecer (fade, escala)
// vive en el CSS, acá solo prendemos o apagamos el interruptor (la clase).
function openOverlay(id) {
  $('#' + id).classList.add('open');
  document.body.style.overflow = 'hidden'; // evita que la página de atrás scrollee mientras el modal está abierto
}
function closeOverlay(id) {
  $('#' + id).classList.remove('open');
  const anyOpen = $$('.overlay.open').length > 0;
  if (!anyOpen) document.body.style.overflow = ''; // recién restauramos el scroll si no queda NINGÚN modal abierto
}

// ==================== ANIMACIÓN AL HACER SCROLL ====================
// Le pone la clase .reveal a un montón de elementos en el HTML (título,
// tarjetas, etc.) y estos empiezan invisibles y "caídos" (ver CSS .reveal).
// Un IntersectionObserver es una herramienta del navegador que avisa cuándo
// un elemento entra en la pantalla visible (sin tener que estar calculando
// posiciones a mano en cada scroll, mucho más eficiente). Apenas entra, le
// agregamos la clase .in-view, que en el CSS dispara la transición hacia el
// estado normal (aparece, se endereza).
function initReveal() {
  const items = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { // "isIntersecting" = true cuando el elemento ya se puede ver
        entry.target.classList.add('in-view');
        io.unobserve(entry.target); // ya apareció una vez, no hace falta seguir vigilando ese elemento
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }); // threshold: con que se vea un 15% ya cuenta
  items.forEach(el => io.observe(el));
}

// ==================== BLOBS FLOTANTES (efecto parallax) ====================
// Los círculos de color grandes del fondo del hero se mueven un poquito más
// lento que el resto de la página al scrollear, dando sensación de
// profundidad (como capas de un dibujo animado clásico). data-speed en el
// HTML define qué tan rápido se mueve cada uno (0.1 = muy lento, 0.25 = un
// poco más rápido, siempre más lento que "1" que sería la velocidad normal
// del scroll).
function initParallax() {
  const blobs = $$('.hero-blob');
  if (!blobs.length) return; // si esta página no tiene blobs (paciente.html/doctor.html), no hacemos nada
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    // requestAnimationFrame agrupa el cálculo con el refresco de pantalla del
    // navegador (~60 veces por segundo), así no se recalcula más veces de
    // las que realmente hacen falta — se ve igual de fluido pero gasta menos.
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blobs.forEach(b => {
        const speed = parseFloat(b.dataset.speed || 0.15);
        b.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

// Le agrega sombra a la barra de navegación cuando ya bajaste un poco,
// para que se note que está "flotando" sobre el contenido de la página.
function initNavbarScroll() {
  const nav = $('#navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav.style.boxShadow = '0 18px 40px rgba(92,129,86,.28)';
    else nav.style.boxShadow = '';
  }, { passive: true });
}

// Abre/cierra el menú hamburguesa (las 3 rayitas) en pantallas chicas.
function initMobileNav() {
  const burger = $('#navBurger');
  const nav = $('#navbar');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('nav-open'));
  // Si tocás un link o botón del menú, lo cerramos (si no, quedaría abierto tapando la página)
  $$('.nav-links a, .nav-actions button', nav).forEach(el => el.addEventListener('click', () => nav.classList.remove('nav-open')));
}

// Hace que los links tipo <a href="#servicios"> scrolleen suavemente hasta
// esa sección en vez de saltar de golpe.
function initAnchorScroll() {
  $$('a[href^="#"]').forEach(a => { // "empieza con #" → son los links que apuntan a una sección de ESTA página
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return; // ignora un simple href="#" vacío
      const target = $(id);
      if (!target) return;
      e.preventDefault(); // cancela el salto brusco por defecto del navegador
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Convierte la fecha de HOY al mismo formato de texto que usa el resto del
// historial clínico (ej. "26 Ago 2026"). La usa el doctor cuando agrega un
// diagnóstico, una vacuna o una desparasitación nueva.
const MESES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function hoyFechaEs() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')} ${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
}

// Igual que hoyFechaEs() pero con la hora incluida (ej. "26 Ago 2026, 4:30 PM").
// La usan las internaciones: hora de ingreso, de salida, y desde cuándo se
// está dando cada medicamento.
function ahoraFechaHoraEs() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${hoyFechaEs()}, ${h}:${m} ${ampm}`;
}

// Dibuja la listita de "Historial clínico" (se usa tanto en la ficha del
// doctor como en la ficha de mascota del paciente, por eso vive acá y no
// en doctor.js/paciente.js: para no repetir el mismo código dos veces).
function renderHistorial(containerId, historial) {
  const el = $('#' + containerId);
  if (!historial.length) {
    el.innerHTML = `<p class="crm-preview-value">Aún no hay visitas registradas.</p>`;
    return;
  }
  // .map() recorre el array "historial" y por cada visita arma un bloque de
  // HTML; .join('') pega todos esos bloques en un solo texto largo.
  el.innerHTML = historial.map(h => `
    <div class="historial-item">
      <span class="historial-dot"></span>
      <div>
        <p class="historial-top"><strong>${h.servicio}</strong><span>${h.fecha}</span></p>
        <p class="historial-doctor">${h.doctor}</p>
        <p class="historial-nota">${h.nota}</p>
      </div>
    </div>
  `).join('');
}

// Dibuja una lista chica de dos columnas (nombre/tipo + fecha) — se usa
// para las vacunas y las desparasitaciones, tanto en la ficha del doctor
// como en la del paciente (por eso vive acá, en vez de repetirla dos veces).
function renderMiniList(containerId, items, campoPrincipal, campoFecha) {
  const el = $('#' + containerId);
  if (!items || !items.length) {
    el.innerHTML = `<p class="crm-preview-value">Sin registros todavía.</p>`;
    return;
  }
  el.innerHTML = items.map(it => `
    <div class="mini-list-item"><span>${it[campoPrincipal]}</span><span class="mini-list-date">${it[campoFecha]}</span></div>
  `).join('');
}

// ==================== CHATBOT ====================
// Respuestas fijas (no hay IA real acá): cuando tocás un botón rápido tipo
// "Horarios", el código busca el texto correspondiente en este objeto y lo
// muestra como si el bot lo hubiera "respondido" — es un simple diccionario
// clave → respuesta.
const FAQ = {
  horarios: 'Atendemos de lunes a sábado de 8:00 AM a 8:00 PM, y emergencias las 24 horas, los 7 días de la semana.',
  vacunas: 'Manejamos el esquema completo: antirrábica, polivalente, y refuerzos anuales. Te enviamos un recordatorio automático antes de cada dosis.',
  precios: 'La consulta general empieza en $25. Los precios varían según el servicio; con gusto te doy un presupuesto exacto si me dices qué necesita tu mascota.',
  ubicacion: 'Estamos en el centro de la ciudad, con instalaciones propias y estacionamiento disponible. Escríbenos y te compartimos la dirección exacta para que llegues sin problema.',
  emergencias: 'Si es una emergencia real, no hace falta reservar cita: comunícate directo con nuestra línea de urgencias, disponible las 24 horas, los 7 días de la semana.',
  reservar: 'Podés reservar tu cita desde el botón "Reservar una cita": elegís el servicio, la fecha y la hora, y completás los datos de tu mascota. La confirmación te llega al instante.',
  mascotas: 'Atendemos perros, gatos, aves y otras mascotas pequeñas. Si no estás seguro/a de si atendemos a tu especie, contanos y te confirmamos enseguida.',
  pagos: 'Aceptamos efectivo, tarjeta de débito/crédito y transferencia. El pago se hace directo en la clínica al finalizar la consulta.',
  primeraVisita: 'Para la primera visita, traé el carnet de vacunas si tu mascota ya tiene uno, y cualquier estudio o receta anterior. Si es su primera vez en cualquier lado, no te preocupes: nosotros abrimos su ficha ahí mismo.',
  humano: 'Perfecto, te conecto con un miembro de nuestro equipo. Un momento por favor.'
};

function initChatbot() {
  const toggle = $('#chatToggle');
  if (!toggle) return; // el chatbot solo existe en index.html; en las otras páginas simplemente no hace nada
  const panel = $('#chatPanel');
  const body = $('#chatBody');
  const form = $('#chatForm');
  const input = $('#chatInput');

  // Abre/cierra la ventanita de chat y cambia el ícono del botón (💬 ↔ ✕)
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });

  // Click en un botón rápido (Horarios/Vacunas/Precios/Hablar con alguien):
  // agrega ese texto como si lo hubiera escrito el usuario, y responde con
  // el texto fijo correspondiente de FAQ.
  body.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-faq]');
    if (!chip) return;
    addChatMessage(chip.textContent, 'user');
    respondBot(FAQ[chip.dataset.faq]);
  });

  // Mensaje libre escrito por el usuario: como no hay IA de verdad conectada,
  // siempre responde lo mismo, invitando a usar los botones rápidos.
  form.addEventListener('submit', () => {
    const text = input.value.trim();
    if (!text) return;
    addChatMessage(text, 'user');
    input.value = '';
    respondBot('Gracias por tu mensaje. Un asistente humano lo revisará en breve; mientras tanto puedes usar los botones rápidos de arriba para respuestas al instante.');
  });

  function addChatMessage(text, who) {
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`; // who = 'user' o 'bot', cambia el color y el lado de la burbuja (ver CSS)
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight; // baja el scroll del todo para que se vea el mensaje nuevo
  }

  function respondBot(text) {
    setTimeout(() => addChatMessage(text, 'bot'), 500); // medio segundo de espera, simula que "está escribiendo"
  }
}

// ==================== ARRANQUE ====================
// "DOMContentLoaded" es el momento en que el navegador ya terminó de armar
// toda la página (el HTML), así que recién ahí es seguro buscar elementos
// con $ / $$ — si lo hiciéramos antes, todavía no existirían en la página.
//
// Estas funciones corren en TODAS las páginas apenas termina de cargar el
// HTML. Cada página además llama, en su propio archivo, a su propio arranque
// (ver el final de home.js, paciente.js, doctor.js) para lo que le falte a
// esa página en particular.
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initParallax();
  initNavbarScroll();
  initMobileNav();
  initAnchorScroll();
  initChatbot();
});
