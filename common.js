const FOTOS_LOCAL = 'fotos/';

const DEFAULT_PHOTOS = {
  doctor: 'equipo/dr.pitbull.jpg',
  perro: 'mascotas/goldenret.jpg',
  gato: 'mascotas/taly gato.jpeg'
};
function defaultPetPhoto(especie) {
  return especie === 'Gato' ? DEFAULT_PHOTOS.gato : DEFAULT_PHOTOS.perro;
}

function avatarImg(localFile, alt, cls) {
  if (!localFile) return '';
  return `<img src="${FOTOS_LOCAL + localFile}" alt="${alt}" class="${cls}" loading="lazy" onerror="this.remove()">`;
}

function bgFoto(localFile, extraLayer) {
  const layers = [`url('${FOTOS_LOCAL + localFile}')`];
  if (extraLayer) layers.push(extraLayer);
  return layers.join(', ');
}

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

const TEAM = [
  { name: 'Dra. Natalia Montaño', specialty: 'Cirugía general', initials: 'NM', icon: 'cirugia', file: 'equipo/dra.ruth.jpg', specialtyKeys: ['cirugia'] },
  { name: 'Dr. Aaron Aramayo', specialty: 'Medicina general y preventiva', initials: 'AA', icon: 'consulta', file: 'equipo/dr.ozuna.jpg', specialtyKeys: ['medicina-general', 'prevencion'] },
  { name: 'Dra. Gema Claudia', specialty: 'Medicina interna y diagnóstico', initials: 'GC', icon: 'laboratorio', file: 'equipo/dra.robamaridos.jpg', specialtyKeys: ['diagnostico'] },
  { name: 'Dra. Ruth', specialty: 'Estética y grooming', initials: 'R', icon: 'corte', file: 'equipo/dra. p3.jpg', specialtyKeys: ['estetica'] },
  { name: 'Dr. Luciano Rodriguez', specialty: 'Odontología veterinaria', initials: 'LR', icon: 'odontologia', file: 'equipo/dr.maluma.jpg', specialtyKeys: ['odontologia'] },
  { name: 'Dr. Cesar Vega', specialty: 'Medicina general', initials: 'CV', icon: 'consulta', file: 'equipo/dr.pitbull.jpg', specialtyKeys: ['medicina-general'] },
  { name: 'Dr. Rafael Roman', specialty: 'Estética y grooming', initials: 'RR', icon: 'corte', file: 'equipo/rafael roman.jpg', specialtyKeys: ['estetica'] },
  { name: 'Dra. Renata Cano', specialty: 'Cirugía y odontología', initials: 'RC', icon: 'cirugia', file: 'equipo/dra. renata.jpg', specialtyKeys: ['cirugia', 'odontologia'] },
  { name: 'Dr. Bruno Salas', specialty: 'Diagnóstico clínico', initials: 'BS', icon: 'laboratorio', file: 'equipo/dr.bruno.jpg', specialtyKeys: ['diagnostico'] },
  { name: 'Dra. Paula Ibáñez', specialty: 'Urgencias y medicina preventiva', initials: 'PI', icon: 'emergencia', file: 'equipo/dra. paula.jpg', specialtyKeys: ['urgencias', 'prevencion'] },
  { name: 'Dra. Melissa Fuentes', specialty: 'Rayos X', initials: 'MF', icon: 'rayosx', file: 'equipo/dra.rayosx.jpg', specialtyKeys: ['rayosx'] },
  { name: 'Dr. Carlos Espinoza', specialty: 'Ecografía', initials: 'CE', icon: 'ecografia', file: 'equipo/dr.ecografias.jpg', specialtyKeys: ['ecografia'] },
  { name: 'Dra. Daniela Cortez', specialty: 'Hospitalización', initials: 'DC', icon: 'hospitalizacion', file: 'equipo/dra.hospitalizacion.jpg', specialtyKeys: ['hospitalizacion'] }
];

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
function doctorsForSpecialty(key) {
  return TEAM.filter(t => t.specialtyKeys.includes(key));
}

const SERVICES = [
  { id: 'consulta', cat: 'medico', title: 'Consulta general', desc: 'Revisión completa de salud con historial clínico digital siempre a mano.', specialtyKey: 'medicina-general', icon: 'consulta', file: 'servicios/consulta.jpg' },
  { id: 'cirugia', cat: 'medico', title: 'Cirugía', desc: 'Procedimientos con equipo certificado y seguimiento post-operatorio.', specialtyKey: 'cirugia', icon: 'cirugia', file: 'servicios/cirugia.jpg' },
  { id: 'vacunacion', cat: 'medico', title: 'Vacunación', desc: 'Calendario de vacunas con recordatorios automáticos para no olvidar ninguna.', specialtyKey: 'prevencion', icon: 'vacunacion', file: 'servicios/vacunacion.jpg' },
  { id: 'laboratorio', cat: 'medico', title: 'Laboratorio', desc: 'Análisis clínicos con resultados digitales entregados directo al doctor.', specialtyKey: 'diagnostico', icon: 'laboratorio', file: 'servicios/laboratorio.jpg' },
  { id: 'rayosx', cat: 'medico', title: 'Rayos X', desc: 'Radiografías digitales para detectar fracturas, obstrucciones y mucho más.', specialtyKey: 'rayosx', icon: 'rayosx', file: 'servicios/rayosx.jpg' },
  { id: 'ecografia', cat: 'medico', title: 'Ecografía', desc: 'Estudio por imágenes para revisar órganos internos sin procedimientos invasivos.', specialtyKey: 'ecografia', icon: 'ecografia', file: 'servicios/ecografia.jpg' },
  { id: 'odontologia', cat: 'medico', title: 'Odontología', desc: 'Limpieza dental y tratamiento de piezas para una sonrisa sana.', specialtyKey: 'odontologia', icon: 'odontologia', file: 'servicios/sonrisa.jpg' },
  { id: 'hospitalizacion', cat: 'medico', title: 'Hospitalización', desc: 'Internación con monitoreo constante para una recuperación segura.', specialtyKey: 'hospitalizacion', icon: 'hospitalizacion', file: 'servicios/hospitalizacion.jpg' },
  { id: 'emergencias', cat: 'medico', title: 'Emergencias 24/7', desc: 'Atención prioritaria, todos los días del año, a cualquier hora.', specialtyKey: 'urgencias', icon: 'emergencia', file: 'servicios/emergencias.jpg' },
  { id: 'bano', cat: 'estetico', title: 'Baño y spa', desc: 'Baño relajante con productos hipoalergénicos e hidratación profunda.', specialtyKey: 'estetica', icon: 'bano', file: 'servicios/bano.jpg' },
  { id: 'corte', cat: 'estetico', title: 'Corte y peluquería', desc: 'Corte a tijera o máquina según la raza, con acabado de exposición.', specialtyKey: 'estetica', icon: 'corte', file: 'servicios/cortes.jpeg' },
  { id: 'deslanado', cat: 'estetico', title: 'Deslanado e hidratación', desc: 'Tratamiento para el cambio de pelaje y piel reseca en cada temporada.', specialtyKey: 'estetica', icon: 'deslanado', file: 'servicios/deslanado.jpg' }
];

const STORE_KEYS = { mascotas: 'vetcareMascotas', citas: 'vetcareCitas', internaciones: 'vetcareInternaciones', seeded: 'vetcareSeededV2' };

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function allMascotas() { return loadJSON(STORE_KEYS.mascotas, {}); }
function allCitas() { return loadJSON(STORE_KEYS.citas, []); }

function getMascota(id) { return allMascotas()[id] || null; }

function saveMascota(mascota) {
  const all = allMascotas();
  all[mascota.id] = mascota;
  saveJSON(STORE_KEYS.mascotas, all);
}
function updateMascota(id, patch) {
  const all = allMascotas();
  if (!all[id]) return null;
  all[id] = Object.assign({}, all[id], patch);
  saveJSON(STORE_KEYS.mascotas, all);
  return all[id];
}
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
function addMedicamento(internacionId, medicamento) {
  const all = allInternaciones();
  const i = all.findIndex(x => x.id === internacionId);
  if (i === -1) return;
  all[i].medicamentos = [...(all[i].medicamentos || []), medicamento];
  saveInternaciones(all);
}
function internacionesByDoctor(doctorName) {
  const clean = normalizeDoctorName(doctorName);
  return allInternaciones()
    .filter(i => normalizeDoctorName(i.doctor) === clean)
    .sort((a, b) => b.id.localeCompare(a.id));
}

function ownerKeyFromSession(session) {
  const raw = (session && (session.name || session.email)) || 'invitado';
  return raw.trim().toLowerCase();
}
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
function citasByDoctor(doctorName) {
  const clean = normalizeDoctorName(doctorName);
  return allCitas().filter(c => normalizeDoctorName(c.doctor) === clean);
}

const HORAS_RESERVADAS_POR_OTROS = ['9:00 AM', '3:30 PM'];

function horarioOcupado(doctorName, fecha, hora) {
  const clean = normalizeDoctorName(doctorName);
  if (!clean) return false;
  if (HORAS_RESERVADAS_POR_OTROS.includes(hora)) return true;
  return allCitas().some(c =>
    normalizeDoctorName(c.doctor) === clean && c.fecha === fecha && c.hora === hora && c.estado !== 'Cancelada'
  );
}

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

const ACCOUNTS_KEY = 'vetcareAccounts';
function allAccounts() { return loadJSON(ACCOUNTS_KEY, []); }
function saveAccounts(list) { saveJSON(ACCOUNTS_KEY, list); }

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

function findAccount(typedName, role) {
  const key = (typedName || '').trim().toLowerCase();
  if (!key) return null;
  return allAccounts().find(a => {
    if (a.role !== role) return false;
    const aKey = a.name.toLowerCase();
    return aKey === key || aKey.split(/\s+/).includes(key) || aKey.includes(key) || key.includes(aKey);
  }) || null;
}

function registerAccount({ name, email, role, specialty }) {
  const accounts = allAccounts();
  const existing = findAccount(name, role);
  if (existing) return existing;
  const account = { name: name.trim(), email: (email || '').trim().toLowerCase(), role, specialty: specialty || '' };
  accounts.push(account);
  saveAccounts(accounts);
  return account;
}

function factoryResetIfNeeded() {
  try {
    if (loadJSON('vetcareResetV1', false)) return;
    localStorage.removeItem(STORE_KEYS.mascotas);
    localStorage.removeItem(STORE_KEYS.citas);
    localStorage.removeItem(STORE_KEYS.internaciones);
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.removeItem(STORE_KEYS.seeded);
    saveJSON('vetcareResetV1', true);
  } catch (e) {}
}

factoryResetIfNeeded();
seedIfNeeded();
seedAccountsIfNeeded();

const Session = {
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

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openOverlay(id) {
  $('#' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeOverlay(id) {
  $('#' + id).classList.remove('open');
  const anyOpen = $$('.overlay.open').length > 0;
  if (!anyOpen) document.body.style.overflow = '';
}

function initReveal() {
  const items = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => io.observe(el));
}

function initParallax() {
  const blobs = $$('.hero-blob');
  if (!blobs.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
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

function initNavbarScroll() {
  const nav = $('#navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav.style.boxShadow = '0 18px 40px rgba(92,129,86,.28)';
    else nav.style.boxShadow = '';
  }, { passive: true });
}

function initMobileNav() {
  const burger = $('#navBurger');
  const nav = $('#navbar');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('nav-open'));
  $$('.nav-links a, .nav-actions button', nav).forEach(el => el.addEventListener('click', () => nav.classList.remove('nav-open')));
}

function initAnchorScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

const MESES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
function hoyFechaEs() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')} ${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
}

function ahoraFechaHoraEs() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${hoyFechaEs()}, ${h}:${m} ${ampm}`;
}

function renderHistorial(containerId, historial) {
  const el = $('#' + containerId);
  if (!historial.length) {
    el.innerHTML = `<p class="crm-preview-value">Aún no hay visitas registradas.</p>`;
    return;
  }
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
  if (!toggle) return;
  const panel = $('#chatPanel');
  const body = $('#chatBody');
  const form = $('#chatForm');
  const input = $('#chatInput');

  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });

  body.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-faq]');
    if (!chip) return;
    addChatMessage(chip.textContent, 'user');
    respondBot(FAQ[chip.dataset.faq]);
  });

  form.addEventListener('submit', () => {
    const text = input.value.trim();
    if (!text) return;
    addChatMessage(text, 'user');
    input.value = '';
    respondBot('Gracias por tu mensaje. Un asistente humano lo revisará en breve; mientras tanto puedes usar los botones rápidos de arriba para respuestas al instante.');
  });

  function addChatMessage(text, who) {
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function respondBot(text) {
    setTimeout(() => addChatMessage(text, 'bot'), 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initParallax();
  initNavbarScroll();
  initMobileNav();
  initAnchorScroll();
  initChatbot();
});
