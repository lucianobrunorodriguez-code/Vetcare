// ============================================================================
// home.js
// Lógica exclusiva de index.html (la página de inicio general):
// grilla de servicios con filtro, sección del equipo, el efecto de scroll
// cinematográfico ("scrolly"), la ficha en vivo (demo CRM) y el modal de
// login/registro que redirige a paciente.html o doctor.html.
// ============================================================================

// ==================== GRILLA DE SERVICIOS ====================
// Dibuja las tarjetas de servicio a partir del arreglo SERVICES (common.js).
// "filter" puede ser 'todos', 'medico' o 'estetico' — filtra el arreglo antes
// de dibujar. Se vuelve a llamar cada vez que tocás un chip de filtro.
function renderServices(filter = 'todos') {
  const grid = $('#servicesGrid');
  const list = filter === 'todos' ? SERVICES : SERVICES.filter(s => s.cat === filter);
  grid.innerHTML = list.map((s, i) => {
    // bgFoto arma: "tu foto local, foto de relleno, degradé de color" en ese
    // orden de capas — si tu archivo en fotos/servicios/ no existe todavía,
    // se ve la de relleno; si ninguna de las dos cargara, queda el degradé.
    const gradient = `linear-gradient(135deg, ${s.cat === 'medico' ? 'var(--green-100), var(--green)' : 'var(--pink-100), var(--pink)'})`;
    const bg = bgFoto(s.file, gradient);
    // Ya no mostramos UN doctor fijo (ahora hay varios para elegir al
    // reservar) — mostramos cuántos especialistas cubren este servicio.
    // Emergencias es la excepción: como es guardia (no se reserva online),
    // mostramos directo quién está de turno y que es 24/7.
    const docs = doctorsForSpecialty(s.specialtyKey);
    const footerText = s.id === 'emergencias'
      ? `De guardia: ${docs[0].name} · Disponible 24/7`
      : `${SPECIALTY_LABELS[s.specialtyKey]} · ${docs.length} especialista${docs.length === 1 ? '' : 's'}`;
    return `
    <article class="card service-card reveal in-view" style="--delay:${(i % 3) * 0.05}s">
      <div class="service-banner" style="background-image:${bg};">
        <span class="service-banner-icon">${ICONS[s.icon]}</span>
      </div>
      <div class="service-body">
        <div class="service-tags">
          <span class="tag ${s.cat === 'medico' ? 'tag-green' : 'tag-pink'}">${s.cat === 'medico' ? 'Médico' : 'Estético'}</span>
        </div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <p class="service-doctor">${footerText}</p>
      </div>
    </article>
  `;
  }).join('');
}

// Conecta los 3 chips "Todos / Médico / Estético" para que redibujen la grilla.
function initServiceFilters() {
  renderServices('todos');
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      renderServices(chip.dataset.filter);
    });
  });
}

// ==================== EQUIPO ====================
// Dibuja las tarjetas de "Nuestro equipo" a partir de TEAM (common.js).
// Cada tarjeta tiene el círculo con las iniciales de fondo y, encima, la
// foto real (avatarImg) — si la foto no carga, se borra sola y quedan
// visibles las iniciales como respaldo.
function renderTeam() {
  const grid = $('#teamGrid');
  grid.innerHTML = TEAM.map((t, i) => `
    <div class="card team-card reveal in-view" style="--delay:${(i % 4) * 0.05}s">
      <div class="team-avatar">
        <span>${t.initials}</span>
        ${avatarImg(t.file, t.name, 'team-avatar-photo')}
      </div>
      <h3>${t.name}</h3>
      <p class="team-specialty">${t.specialty}</p>
      <span class="team-icon-badge">${ICONS[t.icon]}</span>
    </div>
  `).join('');
}

// ==================== SCROLLY (efecto tipo TikTok/producto en scroll) ====================
// El carrusel NO tiene sus propias fotos: agarra 5 servicios de la lista
// SERVICES (arriba, en common.js) por su "id", y usa la foto que ya tiene
// cada uno ahí (el campo "file"). Es decir, para cambiar una foto del
// carrusel hay que ir a common.js y cambiar el "file" de ESE servicio
// (ej. buscar { id: 'bano', ... file: 'servicios/bano.jpg' ... } y
// cambiarle el nombre de archivo) — automáticamente se actualiza acá también.
//
// Para cambiar CUÁLES 5 servicios aparecen en el carrusel (o el orden),
// editá esta lista de ids. Los ids válidos son los mismos que están en
// SERVICES: 'consulta', 'cirugia', 'vacunacion', 'laboratorio',
// 'odontologia', 'emergencias', 'bano', 'corte', 'deslanado'.
const SCROLLY_ITEMS = ['cirugia', 'bano', 'vacunacion', 'corte', 'odontologia'].map(id => SERVICES.find(s => s.id === id));

// Dibuja las 5 fotos grandes en fila (el "carrusel") y los puntitos de abajo.
function renderScrolly() {
  const track = $('#scrollyTrack');
  const dots = $('#scrollyDots');
  if (!track) return;
  track.innerHTML = SCROLLY_ITEMS.map((s, i) => `
    <div class="scrolly-item" data-index="${i}" style="background-image:${bgFoto(s.file)}">
      <div class="scrolly-item-overlay">
        <span class="tag ${s.cat === 'medico' ? 'tag-green' : 'tag-pink'}">${s.cat === 'medico' ? 'Médico' : 'Estético'}</span>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <p class="scrolly-doctor">${SPECIALTY_LABELS[s.specialtyKey]}</p>
      </div>
    </div>
  `).join('');
  dots.innerHTML = SCROLLY_ITEMS.map((_, i) => `<span class="scrolly-dot" data-dot="${i}"></span>`).join('');
}

// Cómo funciona el efecto, paso a paso:
// 1) En el CSS, la sección .scrolly mide 5 pantallas de alto (5 * 92vh) pero
//    adentro, .scrolly-sticky tiene "position: sticky; top:0; height:100vh",
//    así que se queda pegada en pantalla mientras scrolleás esas 5 pantallas.
// 2) Cada vez que el usuario scrollea, calculamos qué tan "adentro" de esa
//    sección larga estamos (un número de 0 a 1: "progress").
// 3) Ese progreso (0 a 1) se convierte en un índice "activeFloat" (0 a 4, con
//    decimales) que nos dice qué tan cerca estamos de cada una de las 5 fotos.
// 4) Movemos la fila de fotos con translateX según ese índice, y agrandamos/
//    oscurecemos cada foto según qué tan lejos está del índice activo.
function initScrolly() {
  const section = $('#scrollySection');
  if (!section) return;
  renderScrolly();
  const track = $('#scrollyTrack');
  const items = $$('.scrolly-item', track);
  const dots = $$('.scrolly-dot');
  const counter = $('#scrollyCounter');

  // El efecto de "scroll fijado" solo tiene sentido en pantallas grandes;
  // en celular lo desactivamos (ver también el CSS en @media max-width:759px)
  // y la fila de fotos pasa a ser un scroll horizontal normal con el dedo.
  function isDesktop() { return window.innerWidth >= 760; }

  function update() {
    if (!isDesktop()) {
      track.style.transform = '';
      items.forEach(it => { it.style.transform = ''; it.style.opacity = ''; });
      return;
    }
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight; // cuánto scroll "dura" la sección
    if (total <= 0) return;
    // rect.top empieza en 0 (apenas llegamos) y se vuelve cada vez más negativo
    // a medida que scrolleamos adentro de la sección. Lo convertimos a 0→1.
    let progress = -rect.top / total;
    progress = Math.max(0, Math.min(1, progress)); // clamp: nunca menor a 0 ni mayor a 1

    const n = items.length;
    const activeFloat = progress * (n - 1); // ej: progress=0.5 con 5 fotos → activeFloat=2 (la del medio)
    const activeIndex = Math.round(activeFloat);
    const itemWidth = items[0].offsetWidth;
    const gap = 32; // debe coincidir con el "gap" del CSS .scrolly-track
    const stageWidth = $('.scrolly-sticky').offsetWidth;
    // shift centra la foto activa en la mitad de la pantalla, y se va corriendo
    // a la izquierda a medida que activeFloat crece (mostrando la siguiente foto).
    const shift = stageWidth / 2 - itemWidth / 2 - activeFloat * (itemWidth + gap);
    track.style.transform = `translateX(${shift}px)`;

    items.forEach((it, i) => {
      const dist = Math.abs(i - activeFloat); // qué tan lejos está esta foto de la activa
      const scale = Math.max(0.75, 1 - dist * 0.24);   // más lejos = más chica
      const opacity = Math.max(0.3, 1 - dist * 0.55);  // más lejos = más transparente
      const textOpacity = Math.max(0, 1 - dist * 1.3); // el texto se apaga más rápido que la foto
      it.style.transform = `scale(${scale})`;
      it.style.opacity = opacity;
      it.querySelector('.scrolly-item-overlay').style.opacity = textOpacity;
      it.classList.toggle('is-active', i === activeIndex);
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
    if (counter) counter.textContent = `${activeIndex + 1} / ${n}`;
  }

  // requestAnimationFrame + bandera "ticking": si el navegador dispara el
  // evento "scroll" muchas veces por segundo, no queremos recalcular todas
  // esas veces — con esto, como mucho recalculamos una vez por frame (~60/seg).
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update(); // dibuja el estado inicial (por si la página carga con scroll en 0)
}

// ==================== FICHA EN VIVO (demo del CRM) ====================
// A medida que el visitante escribe en el formulario de la izquierda, vamos
// actualizando en vivo la "vista previa del doctor" de la derecha — sin
// backend, solo copiando el valor del input al texto de la vista previa.
function initCrmDemo() {
  const nombre = $('#crmNombre'), especie = $('#crmEspecie'), raza = $('#crmRaza'),
        edad = $('#crmEdad'), motivo = $('#crmMotivo');
  if (!nombre) return;

  function update() {
    $('#previewNombre').textContent = nombre.value.trim() || 'Nombre de la mascota';
    $('#previewEspecieRaza').textContent = `${especie.value}${raza.value.trim() ? ' · ' + raza.value.trim() : ''}`;
    $('#previewEdad').textContent = edad.value.trim() || '—';
    $('#previewMotivo').textContent = motivo.value.trim() || 'Aún no hay información. Completa el formulario para ver la ficha aquí.';
  }
  [nombre, especie, raza, edad, motivo].forEach(el => el.addEventListener('input', update));
  especie.addEventListener('change', update);
}

// ==================== MODAL DE LOGIN/REGISTRO ====================
// authState guarda en qué pestaña estamos (login/register) y qué rol se
// eligió (paciente/doctor) — se usa para saber a qué página redirigir
// después de "iniciar sesión".
const authState = { tab: 'login', role: 'paciente' };

function initAuth() {
  const overlay = $('#authOverlay');
  const form = $('#authForm');

  // Cualquier botón con data-auth="login"/"register" (y opcionalmente
  // data-role="doctor"/"paciente") abre el modal ya configurado.
  $$('[data-auth]').forEach(btn => {
    btn.addEventListener('click', () => {
      setAuthTab(btn.dataset.auth);
      if (btn.dataset.role) setAuthRole(btn.dataset.role);
      openOverlay('authOverlay');
    });
  });

  $$('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeOverlay(btn.dataset.close + 'Overlay'));
  });

  // Tocar el fondo oscuro (fuera de la tarjeta) también cierra el modal
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay('authOverlay'); });

  $$('.auth-tab').forEach(tab => tab.addEventListener('click', () => setAuthTab(tab.dataset.tab)));
  $$('[data-tab-link]').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); setAuthTab(link.dataset.tabLink); }));
  $$('.role-toggle-btn').forEach(btn => btn.addEventListener('click', () => setAuthRole(btn.dataset.roleChoice)));
  updateAuthHint();

  // Al "enviar" el formulario (no hay backend real, es todo simulado) el
  // comportamiento es distinto según la pestaña:
  //
  // CREAR CUENTA: no navega a ningún lado. Solo agrega el nombre a la lista
  // de cuentas (ver registerAccount en common.js) y te manda de vuelta a la
  // pestaña "Iniciar sesión" con el nombre ya cargado, listo para entrar.
  //
  // INICIAR SESIÓN: busca ese nombre en la lista de cuentas (findAccount).
  // Si no existe, avisa y no pasa a ningún lado. Si existe, usamos el
  // nombre OFICIAL guardado en la cuenta (no lo que se haya escrito, por si
  // escribiste solo "cesar") y recién ahí redirige al portal.
  form.addEventListener('submit', () => {
    const typedName = $('#authNombre').value.trim();

    if (authState.tab === 'register') {
      if (!typedName) { showToast('Escribí tu nombre para crear la cuenta.'); return; }
      // Varios botones del sitio (ej. "Reservar una cita") abren el modal
      // directo en esta pestaña. Si el nombre que escribiste YA existe
      // (ej. "luciano"), no tiene sentido fingir que se crea de nuevo —
      // lo tratamos como si hubiera iniciado sesión directamente.
      const already = findAccount(typedName, authState.role);
      if (already) {
        loginAs(already);
        return;
      }
      const email = $('#authEmail').value.trim().toLowerCase();
      const specialty = $('#authEspecialidad').value;
      registerAccount({ name: typedName, email, role: authState.role, specialty });
      showToast('¡Cuenta creada con éxito! Ahora iniciá sesión.');
      setAuthTab('login');
      $('#authNombre').value = typedName;
      return;
    }

    // tab === 'login'
    const account = findAccount(typedName, authState.role);
    if (!account) {
      showToast('No encontramos ese usuario. ¿Ya creaste tu cuenta?');
      return;
    }
    loginAs(account);
  });
}

// Guarda la sesión con los datos OFICIALES de la cuenta encontrada (no lo
// que se haya tecleado) y redirige al portal que corresponda.
function loginAs(account) {
  Session.set({ role: account.role, name: account.name, email: account.email, specialty: account.specialty });
  showToast(`¡Bienvenido/a, ${account.name}!`);
  closeOverlay('authOverlay');
  setTimeout(() => {
    window.location.href = account.role === 'doctor' ? 'doctor.html' : 'paciente.html';
  }, 500);
}

// Cambia entre la pestaña "Iniciar sesión" y "Crear cuenta": oculta/muestra
// los campos que solo aplican al registro (nombre, especialidad) usando las
// clases .only-register / .only-login definidas en el CSS.
function setAuthTab(tab) {
  authState.tab = tab;
  $$('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  $('#authSubmit').textContent = tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
  $$('.only-register').forEach(el => el.style.display = tab === 'register' ? '' : 'none');
  $$('.only-login').forEach(el => el.style.display = tab === 'login' ? '' : 'none');
  syncDoctorOnlyFields();
  updateAuthHint();
}

// Cambia entre "Dueño de mascota" y "Equipo médico".
function setAuthRole(role) {
  authState.role = role;
  $$('.role-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.roleChoice === role));
  syncDoctorOnlyFields();
  updateAuthHint();
}

// Le recuerda al usuario, según el rol elegido, qué nombres ya existen para
// poder iniciar sesión (así no tiene que adivinar). No hace falta el
// apellido: basta con el nombre de pila (ver findAccount en common.js). Esto
// solo tiene sentido en la pestaña "Iniciar sesión" — en "Crear cuenta" no
// se muestra, porque ahí no hace falta que ya exista una cuenta.
function updateAuthHint() {
  const hint = $('#authUserHint');
  if (!hint) return;
  if (authState.tab === 'register') {
    hint.textContent = '';
    return;
  }
  if (authState.role === 'doctor') {
    // Sale directo de TEAM (common.js) — si mañana agregás un doctor más,
    // esta pista se actualiza sola, sin tener que tocar este texto a mano.
    const nombres = TEAM.map(t => t.name.replace(/^Dr\.?a?\.?\s*/, '').split(' ')[0]).join(', ');
    hint.textContent = `Equipo: ${nombres}`;
  } else {
    hint.textContent = 'Pacientes de ejemplo: Jolye, Natalia, Luciano o Aaron';
  }
}

// El campo "Especialidad" solo se muestra si estás registrándote Y elegiste
// el rol de doctor (no tiene sentido pedirle especialidad a un dueño de mascota).
function syncDoctorOnlyFields() {
  const show = authState.tab === 'register' && authState.role === 'doctor';
  $$('.only-doctor').forEach(el => el.style.display = show ? '' : 'none');
}

// ==================== ARRANQUE DE ESTA PÁGINA ====================
document.addEventListener('DOMContentLoaded', () => {
  initServiceFilters();
  renderTeam();
  initScrolly();
  initAuth();
  initCrmDemo();
});
