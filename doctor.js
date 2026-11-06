const doctorSession = Session.get() || { role: 'doctor', name: 'Dr. Cesar Vega', specialty: 'Medicina general' };
const me = findTeamMember(doctorSession.name);

function renderDoctorPage() {
  $('#doctorGreeting').textContent = doctorSession.name;
  $('#doctorSpecialty').textContent = doctorSession.specialty || 'Medicina general';
  $('#doctorHeroPhoto').style.backgroundImage = bgFoto('servicios/sobre vetcare.jpg');

  const photoWrap = $('#doctorAvatarWrap');
  photoWrap.innerHTML = avatarImg(me ? me.file : DEFAULT_PHOTOS.doctor, doctorSession.name, 'doctor-avatar-photo');

  renderAgenda();
  renderInternacionSection();
}

function renderAgenda() {
  const citas = citasByDoctor(doctorSession.name).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  $('#agendaCount').textContent = citas.length;
  $('#agendaNext').textContent = citas[0] ? citas[0].hora : '—';
  $('#agendaTotalPets').textContent = Object.keys(allMascotas()).length;

  const list = $('#doctorPatientList');
  if (!citas.length) {
    list.innerHTML = `<p class="crm-preview-value">Todavía no tenés citas asignadas.</p>`;
    return;
  }
  list.innerHTML = citas.map(c => {
    const pet = getMascota(c.mascotaId);
    if (!pet) return '';
    return `
    <div class="patient-card" data-cita="${c.id}" data-mascota="${pet.id}">
      <div class="pet-photo-wrap sm">${avatarImg(pet.file || defaultPetPhoto(pet.especie), pet.nombre, 'pet-photo')}</div>
      <div class="grow">
        <p class="mini-title">${pet.nombre}</p>
        <p class="mini-sub">${pet.especie} · ${pet.raza} · Dueño/a: ${c.ownerName || pet.ownerName || '—'}</p>
        <p class="mini-sub-xs patient-specialty">${c.servicio}</p>
      </div>
      <div class="reminder-right">
        <span class="patient-time">${c.hora}</span>
        <p class="mini-sub-xs">${c.fecha}</p>
      </div>
    </div>`;
  }).join('');

  $$('.patient-card', list).forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openFicha(card.dataset.mascota, card.dataset.cita));
  });
}

let fichaMascotaId = null;
let fichaCitaId = null;

function openFicha(mascotaId, citaId) {
  fichaMascotaId = mascotaId;
  fichaCitaId = citaId || null;
  renderFicha();
  openOverlay('fichaOverlay');
}

function renderFicha() {
  const pet = getMascota(fichaMascotaId);
  if (!pet) return;
  const cita = fichaCitaId ? allCitas().find(c => c.id === fichaCitaId) : null;

  $('#fichaNombre').textContent = pet.nombre;
  $('#fichaEspecieRaza').textContent = `${pet.especie} · ${pet.raza}`;
  $('#fichaDueno').textContent = (cita && cita.ownerName) || pet.ownerName || '—';
  $('#fichaHora').textContent = cita ? `${cita.fecha} · ${cita.hora}` : '—';
  $('#fichaEspecialidad').textContent = cita ? cita.servicio : '—';
  $('#fichaMotivo').textContent = (cita && cita.motivo) || 'Sin especificar';
  $('#fichaPhotoWrap').innerHTML = avatarImg(pet.file || defaultPetPhoto(pet.especie), pet.nombre, 'pet-photo');

  $('#editRaza').value = pet.raza || '';
  $('#editEdad').value = pet.edad || '';
  $('#editPeso').value = pet.peso || '';
  $('#editAlergias').value = pet.alergias || '';

  renderMiniList('fichaVacunas', pet.vacunas, 'nombre', 'fecha');
  renderMiniList('fichaDesparasitaciones', pet.desparasitaciones, 'tipo', 'fecha');
  renderHistorial('fichaHistorial', pet.historial || []);
}

function initFichaEditing() {
  $('#saveDatosBtn').addEventListener('click', () => {
    updateMascota(fichaMascotaId, {
      raza: $('#editRaza').value.trim() || 'Sin especificar',
      edad: $('#editEdad').value.trim() || 'Sin especificar',
      peso: $('#editPeso').value.trim() || 'Sin registrar',
      alergias: $('#editAlergias').value.trim() || 'Ninguna conocida'
    });
    showToast('Datos actualizados.');
    renderFicha();
    renderAgenda();
  });

  $('#addVacunaBtn').addEventListener('click', () => {
    const nombre = $('#nuevaVacunaNombre').value.trim();
    if (!nombre) { showToast('Escribí el nombre de la vacuna.'); return; }
    addVacuna(fichaMascotaId, { nombre, fecha: hoyFechaEs() });
    $('#nuevaVacunaNombre').value = '';
    renderFicha();
    showToast('Vacuna agregada.');
  });

  $('#addDesparasitacionBtn').addEventListener('click', () => {
    const tipo = $('#nuevaDesparasitacionTipo').value.trim();
    if (!tipo) { showToast('Escribí el tipo de desparasitación.'); return; }
    addDesparasitacion(fichaMascotaId, { tipo, fecha: hoyFechaEs() });
    $('#nuevaDesparasitacionTipo').value = '';
    renderFicha();
    showToast('Desparasitación agregada.');
  });

  $('#addDiagnosticoBtn').addEventListener('click', () => {
    const servicio = $('#nuevoDiagnosticoTitulo').value.trim();
    const nota = $('#nuevoDiagnosticoNota').value.trim();
    if (!servicio || !nota) { showToast('Completá el título y la nota del diagnóstico.'); return; }
    addHistorialEntry(fichaMascotaId, { fecha: hoyFechaEs(), servicio, doctor: doctorSession.name, nota });
    $('#nuevoDiagnosticoTitulo').value = '';
    $('#nuevoDiagnosticoNota').value = '';
    renderFicha();
    showToast('Diagnóstico agregado a la ficha.');
  });
}

function renderInternacionSection() {
  const section = $('#internacionSection');
  const habilitado = me && me.specialtyKeys.includes('hospitalizacion');
  section.hidden = !habilitado;
  if (habilitado) renderInternados();
}

function internacionCardHtml(i) {
  const pet = getMascota(i.mascotaId);
  const nombre = pet ? pet.nombre : 'Mascota';
  const especieRaza = pet ? `${pet.especie} · ${pet.raza}` : '';
  const foto = pet ? avatarImg(pet.file || defaultPetPhoto(pet.especie), nombre, 'pet-photo') : '';
  return `
    <div class="patient-card" data-internacion="${i.id}">
      <div class="pet-photo-wrap sm">${foto}</div>
      <div class="grow">
        <p class="mini-title">${nombre}</p>
        <p class="mini-sub">${especieRaza} · ${i.motivo}</p>
        <p class="mini-sub-xs patient-specialty">${i.medicamentos.length} medicamento${i.medicamentos.length === 1 ? '' : 's'} activo${i.medicamentos.length === 1 ? '' : 's'}</p>
      </div>
      <div class="reminder-right">
        <span class="tag ${i.estado === 'Internado' ? 'tag-pink' : 'tag-green'}">${i.estado}</span>
        <p class="mini-sub-xs">Ingreso: ${i.fechaIngreso}</p>
      </div>
    </div>`;
}

function renderInternados() {
  const todas = internacionesByDoctor(doctorSession.name);
  const internados = todas.filter(i => i.estado === 'Internado');
  const altas = todas.filter(i => i.estado === 'Dado de alta').slice(0, 5);

  $('#internadosList').innerHTML = internados.length
    ? internados.map(internacionCardHtml).join('')
    : `<p class="crm-preview-value">No hay pacientes internados en este momento.</p>`;
  $('#altasList').innerHTML = altas.length
    ? altas.map(internacionCardHtml).join('')
    : `<p class="crm-preview-value">Todavía no diste de alta a nadie.</p>`;

  $$('.patient-card[data-internacion]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openInternacionFicha(card.dataset.internacion));
  });
}

function renderInternarPetSelect() {
  const select = $('#internarPetSelect');
  const opciones = Object.values(allMascotas())
    .map(p => `<option value="${p.id}">${p.nombre} (${p.especie} · ${p.ownerName || 'sin dueño registrado'})</option>`)
    .join('');
  select.innerHTML = opciones + `<option value="__new__">+ Nueva mascota</option>`;
  $('#internarNuevaMascota').hidden = select.value !== '__new__';
}

function initInternarModal() {
  const select = $('#internarPetSelect');
  select.addEventListener('change', () => { $('#internarNuevaMascota').hidden = select.value !== '__new__'; });

  $('#openInternarBtn').addEventListener('click', () => {
    renderInternarPetSelect();
    $('#internarForm').reset();
    $('#internarNuevaMascota').hidden = true;
    openOverlay('internarOverlay');
  });

  $('#confirmInternarBtn').addEventListener('click', () => {
    const motivo = $('#internarMotivo').value.trim();
    if (!motivo) { showToast('Escribí el motivo de la internación.'); return; }

    let mascotaId = select.value;
    if (mascotaId === '__new__') {
      const nombre = $('#internarNuevoNombre').value.trim();
      if (!nombre) { showToast('Escribí el nombre de la mascota.'); return; }
      const especie = $('#internarNuevaEspecie').value;
      const raza = $('#internarNuevaRaza').value.trim() || 'Sin especificar';
      mascotaId = 'pet-' + Date.now();
      saveMascota({
        id: mascotaId, nombre, especie, raza, edad: 'Sin especificar', peso: 'Sin registrar',
        alergias: 'Sin registrar', vacunas: [], desparasitaciones: [], historial: [],
        file: null, ownerKey: '', ownerName: 'Sin dueño registrado'
      });
    }

    addInternacion({
      id: 'int-' + Date.now(),
      mascotaId,
      doctor: doctorSession.name,
      motivo,
      fechaIngreso: ahoraFechaHoraEs(),
      fechaSalida: null,
      estado: 'Internado',
      medicamentos: []
    });

    closeOverlay('internarOverlay');
    showToast('Paciente internado correctamente.');
    renderInternados();
  });
}

let internacionActualId = null;

function openInternacionFicha(id) {
  internacionActualId = id;
  renderInternacionFicha();
  openOverlay('internacionFichaOverlay');
}

function renderInternacionFicha() {
  const i = allInternaciones().find(x => x.id === internacionActualId);
  if (!i) return;
  const pet = getMascota(i.mascotaId);

  $('#internacionNombre').textContent = pet ? pet.nombre : 'Mascota';
  $('#internacionEspecieRaza').textContent = pet ? `${pet.especie} · ${pet.raza}` : '—';
  $('#internacionPhotoWrap').innerHTML = pet ? avatarImg(pet.file || defaultPetPhoto(pet.especie), pet.nombre, 'pet-photo') : '';
  $('#internacionIngreso').textContent = i.fechaIngreso;
  $('#internacionSalida').textContent = i.fechaSalida || 'Sigue internado/a';
  $('#internacionMotivo').textContent = i.motivo;

  const estaInternado = i.estado === 'Internado';
  $('#internacionEstadoTag').textContent = i.estado;
  $('#internacionEstadoTag').className = `tag ${estaInternado ? 'tag-pink' : 'tag-green'}`;
  $('#addMedicamentoRow').hidden = !estaInternado;
  $('#darDeAltaBtn').hidden = !estaInternado;

  const cont = $('#internacionMedicamentos');
  cont.innerHTML = i.medicamentos.length
    ? i.medicamentos.map(m => `
      <div class="historial-item">
        <span class="historial-dot"></span>
        <div>
          <p class="historial-top"><strong>${m.nombre}</strong><span>${m.frecuencia}</span></p>
          <p class="historial-doctor">Desde: ${m.inicio}</p>
        </div>
      </div>`).join('')
    : `<p class="crm-preview-value">Todavía no se registraron medicamentos.</p>`;
}

function initInternacionFicha() {
  $('#addMedicamentoBtn').addEventListener('click', () => {
    const nombre = $('#nuevoMedNombre').value.trim();
    if (!nombre) { showToast('Escribí el nombre del medicamento.'); return; }
    const frecuencia = $('#nuevoMedFrecuencia').value;
    addMedicamento(internacionActualId, { nombre, frecuencia, inicio: ahoraFechaHoraEs() });
    $('#nuevoMedNombre').value = '';
    renderInternacionFicha();
    showToast('Medicamento agregado.');
  });

  $('#darDeAltaBtn').addEventListener('click', () => {
    updateInternacion(internacionActualId, { estado: 'Dado de alta', fechaSalida: ahoraFechaHoraEs() });
    renderInternacionFicha();
    renderInternados();
    showToast('Paciente dado de alta.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDoctorPage();
  initFichaEditing();
  initInternarModal();
  initInternacionFicha();
  $('#logoutBtn').addEventListener('click', () => { Session.clear(); window.location.href = 'index.html'; });
  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => closeOverlay(btn.dataset.close + 'Overlay')));
  $$('.overlay').forEach(ov => ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov.id); }));
});
