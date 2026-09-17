// ============================================================================
// paciente.js
// Lógica exclusiva de paciente.html: el portal del dueño de mascota.
// Las mascotas y citas YA NO se guardan solo en esta pestaña: viven en el
// almacén compartido de common.js (localStorage), filtradas por "ownerKey"
// (quién sos). Por eso el doctor puede ver, en su propia pestaña, una cita
// que reservaste acá.
// ============================================================================

const session = Session.get() || { role: 'paciente', name: 'Invitado', email: '', specialty: '' };
const ownerKey = ownerKeyFromSession(session);

function misMascotas() { return mascotasByOwner(ownerKey); }
function misCitas() { return citasByOwner(ownerKey); }

// Dibuja todo el contenido del portal: saludo, foto del banner, próximas
// citas, tarjetas de mascotas (con sus datos clínicos) e historial completo.
function renderPatientPage() {
  $('#patientGreeting').textContent = `Hola, ${session.name}`;

  const pets = misMascotas();
  const heroPet = pets[0];
  $('#patientHeroPhoto').style.backgroundImage = bgFoto(heroPet ? (heroPet.file || defaultPetPhoto(heroPet.especie)) : DEFAULT_PHOTOS.perro);

  // --- Próximas citas / recordatorios ---
  const citas = misCitas();
  const upcoming = $('#patientUpcomingList');
  if (!citas.length) {
    upcoming.innerHTML = `<p class="crm-preview-value">No tienes citas próximas. ¡Reserva una cuando quieras!</p>`;
  } else {
    upcoming.innerHTML = citas.map(c => `
      <div class="patient-card reminder-card">
        <div class="icon-circle green sm">${ICONS.calendar}</div>
        <div class="grow">
          <p class="mini-title">${c.servicio}</p>
          <p class="mini-sub">${c.doctor}</p>
        </div>
        <div class="reminder-right">
          <span class="tag tag-green">${c.estado}</span>
          <p class="mini-sub-xs">${c.fecha} · ${c.hora}</p>
        </div>
      </div>
    `).join('');
  }
  $('#patientNextStat').textContent = citas[0] ? citas[0].hora : '—';

  // --- Mis mascotas ---
  const petsGrid = $('#patientPetsList');
  if (!pets.length) {
    petsGrid.innerHTML = `<p class="crm-preview-value">Todavía no tenés mascotas registradas. Reservá tu primera cita y la ficha se crea sola.</p>`;
  } else {
    petsGrid.innerHTML = pets.map(pet => `
      <div class="card pet-card" data-id="${pet.id}">
        <div class="pet-photo-wrap">${avatarImg(pet.file || defaultPetPhoto(pet.especie), pet.nombre, 'pet-photo')}</div>
        <p class="mini-title">${pet.nombre}</p>
        <p class="mini-sub">${pet.especie} · ${pet.raza}</p>
        <p class="mini-sub-xs">${pet.edad} · ${pet.peso || 'peso sin registrar'}</p>
        <button class="btn-text pet-detail-btn" data-id="${pet.id}">Ver ficha completa →</button>
      </div>
    `).join('');
  }
  $('#patientPetCount').textContent = pets.length;

  // Cada tarjeta de mascota abre su propio modal con la ficha completa
  $$('.pet-detail-btn', petsGrid).forEach(btn => {
    btn.addEventListener('click', () => openPetDetail(btn.dataset.id));
  });

  // --- Historial de citas (junta el historial de TODAS las mascotas) ---
  const allHistory = pets.flatMap(pet => (pet.historial || []).map(h => ({ ...h, mascota: pet.nombre })));
  allHistory.sort((a, b) => b.fecha.localeCompare(a.fecha)); // más reciente primero
  $('#patientVisitCount').textContent = allHistory.length;

  const historyEl = $('#patientHistoryList');
  if (!allHistory.length) {
    historyEl.innerHTML = `<p class="crm-preview-value">Todavía no hay visitas registradas.</p>`;
  } else {
    historyEl.innerHTML = allHistory.map(h => `
      <div class="historial-item">
        <span class="historial-dot"></span>
        <div>
          <p class="historial-top"><strong>${h.servicio} · ${h.mascota}</strong><span>${h.fecha}</span></p>
          <p class="historial-doctor">${h.doctor}</p>
          <p class="historial-nota">${h.nota}</p>
        </div>
      </div>
    `).join('');
  }
}

// Dibuja una lista chiquita tipo "Antirrábica — 15 Ene 2026" (se usa para
// vacunas y desparasitaciones, que tienen la misma pinta: dos datos y una fecha).
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

// Abre el modal con la ficha completa de una mascota: la leemos de nuevo
// desde el almacén (no de la lista ya dibujada) para mostrar siempre los
// datos más recientes, por si el doctor la editó desde su propia pestaña.
function openPetDetail(id) {
  const pet = getMascota(id);
  if (!pet) return;
  $('#petNombre').textContent = pet.nombre;
  $('#petEspecieRaza').textContent = `${pet.especie} · ${pet.raza}`;
  $('#petEdad').textContent = pet.edad || '—';
  $('#petPeso').textContent = pet.peso || 'Sin registrar';
  $('#petAlergias').textContent = pet.alergias || 'Sin registrar';
  $('#petPhotoWrap').innerHTML = avatarImg(pet.file || defaultPetPhoto(pet.especie), pet.nombre, 'pet-photo');
  renderMiniList('petVacunas', pet.vacunas, 'nombre', 'fecha');
  renderMiniList('petDesparasitaciones', pet.desparasitaciones, 'tipo', 'fecha');
  renderHistorial('petHistorial', pet.historial || []);
  openOverlay('petOverlay');
}

// ==================== ASISTENTE DE RESERVA (5 pasos) ====================
// 1. Servicio → 2. Doctor (según la especialidad del servicio elegido) →
// 3. Fecha y hora → 4. Ficha de la mascota → 5. Confirmación.
function renderBookingServiceChips() {
  const grid = $('#serviceChipGrid');
  grid.innerHTML = SERVICES.filter(s => s.id !== 'emergencias').map(s => `<button type="button" class="chip" data-service="${s.id}">${s.title}</button>`).join('');
}

// Doctor chips: se vuelven a dibujar cada vez que se entra al paso 2, porque
// dependen de qué servicio (y por lo tanto qué especialidad) se eligió antes.
function renderDoctorChips() {
  const grid = $('#doctorChipGrid');
  const docs = bookingState.specialtyKey ? doctorsForSpecialty(bookingState.specialtyKey) : [];
  grid.innerHTML = docs.map(d => `
    <button type="button" class="chip doctor-chip" data-doctor="${d.name}">
      <span class="doctor-chip-avatar">${avatarImg(d.file || DEFAULT_PHOTOS.doctor, d.name, 'doctor-chip-photo')}</span>
      <span class="doctor-chip-text">
        <span class="doctor-chip-name">${d.name}</span>
        <span class="doctor-chip-specialty">${d.specialty}</span>
      </span>
    </button>
  `).join('');
}

function renderPetSelect() {
  const select = $('#bkPetSelect');
  const options = misMascotas().map(p => `<option value="${p.id}">${p.nombre} (${p.especie})</option>`).join('');
  select.innerHTML = options + `<option value="__new__">+ Nueva mascota</option>`;
}

const bookingState = { service: null, specialtyKey: null, doctorName: null, date: null, time: null };

function initBooking() {
  renderBookingServiceChips();
  renderPetSelect();

  const serviceGrid = $('#serviceChipGrid');
  const doctorGrid = $('#doctorChipGrid');
  const timeGrid = $('#timeChipGrid');
  const dateInput = $('#bookingDate');
  const petSelect = $('#bkPetSelect');

  // Paso 1: elegir servicio → guarda también su especialidad, y resetea el
  // doctor elegido antes (si volviste atrás y cambiaste de servicio).
  serviceGrid.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('.chip', serviceGrid).forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    const service = SERVICES.find(s => s.id === chip.dataset.service);
    bookingState.service = service.title;
    bookingState.specialtyKey = service.specialtyKey;
    bookingState.doctorName = null;
    $('#toStep2').disabled = false;
  });

  // Paso 2: elegir doctor (entre los que atienden esa especialidad)
  doctorGrid.addEventListener('click', (e) => {
    const chip = e.target.closest('.doctor-chip');
    if (!chip) return;
    $$('.doctor-chip', doctorGrid).forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    bookingState.doctorName = chip.dataset.doctor;
    $('#toStep3').disabled = false;
  });

  // Paso 3: fecha y hora
  timeGrid.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('.chip', timeGrid).forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    bookingState.time = chip.dataset.time;
    checkStep3Ready();
  });
  dateInput.addEventListener('change', () => { bookingState.date = dateInput.value; checkStep3Ready(); });
  function checkStep3Ready() { $('#toStep4').disabled = !(bookingState.date && bookingState.time); }

  // Paso 4: si el select apunta a una mascota que ya tenías registrada, se
  // autocompletan sus datos para no tener que volver a escribirlos. Se
  // llama tanto al cambiar el select a mano como al abrir el paso (ver
  // resetBooking), para que ya venga rellenado solo si tenés una mascota.
  function applyPetSelection() {
    const pet = getMascota(petSelect.value);
    if (pet) {
      $('#bkNombre').value = pet.nombre;
      $('#bkEspecie').value = pet.especie;
      $('#bkRaza').value = pet.raza;
    } else {
      $('#bkNombre').value = '';
      $('#bkRaza').value = '';
    }
  }
  petSelect.addEventListener('change', applyPetSelection);

  // Botones "Continuar": el paso 2 (doctor) hay que redibujarlo cada vez,
  // porque depende del servicio que se haya elegido en el paso 1.
  $$('[data-next]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.disabled) return;
    if (btn.dataset.next === '2') renderDoctorChips();
    goToBookingStep(btn.dataset.next);
  }));
  $$('[data-back]').forEach(btn => btn.addEventListener('click', () => goToBookingStep(btn.dataset.back)));

  // Confirmar cita: crea (o reutiliza) la mascota en el almacén compartido,
  // agrega la cita, y listo — esto ya es visible para el doctor elegido si
  // abre su propia pestaña.
  $('#confirmBooking').addEventListener('click', () => {
    const nombre = $('#bkNombre').value.trim() || 'Tu mascota';
    const especie = $('#bkEspecie').value;
    const raza = $('#bkRaza').value.trim() || 'Sin especificar';
    const motivo = $('#bkMotivo').value.trim() || 'Sin especificar';

    let pet = petSelect.value !== '__new__' ? getMascota(petSelect.value) : null;
    if (!pet) {
      pet = {
        id: 'pet-' + Date.now(), nombre, especie, raza, edad: 'Sin especificar', peso: 'Sin registrar',
        alergias: 'Sin registrar', vacunas: [], desparasitaciones: [], historial: [],
        file: null, ownerKey, ownerName: session.name
      };
      saveMascota(pet);
    }

    addCita({
      id: 'cita-' + Date.now(), mascotaId: pet.id, servicio: bookingState.service,
      fecha: formatDate(bookingState.date), hora: bookingState.time, doctor: bookingState.doctorName,
      estado: 'Confirmada', ownerKey, ownerName: session.name, motivo
    });

    $('#bookingSummary').innerHTML = `
      <p><strong>Mascota:</strong> ${nombre} (${especie} · ${raza})</p>
      <p><strong>Servicio:</strong> ${bookingState.service}</p>
      <p><strong>Doctor:</strong> ${bookingState.doctorName}</p>
      <p><strong>Fecha:</strong> ${formatDate(bookingState.date)}</p>
      <p><strong>Hora:</strong> ${bookingState.time}</p>
      <p><strong>Motivo:</strong> ${motivo}</p>
    `;

    renderPatientPage();
    goToBookingStep('5');
  });

  $('#backToPanel').addEventListener('click', () => closeOverlay('bookingOverlay'));

  $$('[data-open-booking]').forEach(btn => btn.addEventListener('click', () => {
    renderPetSelect();
    resetBooking();
    openOverlay('bookingOverlay');
  }));
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function goToBookingStep(step) {
  $$('.booking-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === step));
  $$('.bstep').forEach(s => s.classList.toggle('active', s.dataset.step === step));
}
function resetBooking() {
  bookingState.service = null; bookingState.specialtyKey = null; bookingState.doctorName = null;
  bookingState.date = null; bookingState.time = null;
  $$('.chip').forEach(c => c.classList.remove('selected'));
  $('#doctorChipGrid').innerHTML = '';
  $('#bookingDate').value = '';
  $('#bookingForm').reset(); // limpia el formulario ANTES de autocompletar (si no, borraría lo que rellenamos abajo)
  // Si ya tenés una mascota registrada, el select arranca en ELLA (no en
  // "+ Nueva mascota") y disparamos "change" para que sus datos se
  // autocompleten solos, sin que haya que tocar nada.
  const misPets = misMascotas();
  $('#bkPetSelect').value = misPets.length ? misPets[0].id : '__new__';
  $('#bkPetSelect').dispatchEvent(new Event('change'));
  $('#toStep2').disabled = true;
  $('#toStep3').disabled = true;
  $('#toStep4').disabled = true;
  goToBookingStep('1');
}

// ==================== ARRANQUE DE ESTA PÁGINA ====================
document.addEventListener('DOMContentLoaded', () => {
  renderPatientPage();
  initBooking();
  $('#logoutBtn').addEventListener('click', () => { Session.clear(); window.location.href = 'index.html'; });
  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => closeOverlay(btn.dataset.close + 'Overlay')));
  $$('.overlay').forEach(ov => ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov.id); }));
});
