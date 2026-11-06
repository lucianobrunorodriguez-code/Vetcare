function renderServices(filter = 'todos') {
  const grid = $('#servicesGrid');
  const list = filter === 'todos' ? SERVICES : SERVICES.filter(s => s.cat === filter);
  grid.innerHTML = list.map((s, i) => {
    const gradient = `linear-gradient(135deg, ${s.cat === 'medico' ? 'var(--green-100), var(--green)' : 'var(--pink-100), var(--pink)'})`;
    const bg = bgFoto(s.file, gradient);
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

const SCROLLY_ITEMS = ['cirugia', 'bano', 'vacunacion', 'corte', 'odontologia'].map(id => SERVICES.find(s => s.id === id));

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

function initScrolly() {
  const section = $('#scrollySection');
  if (!section) return;
  renderScrolly();
  const track = $('#scrollyTrack');
  const items = $$('.scrolly-item', track);
  const dots = $$('.scrolly-dot');
  const counter = $('#scrollyCounter');

  function isDesktop() { return window.innerWidth >= 760; }

  function update() {
    if (!isDesktop()) {
      track.style.transform = '';
      items.forEach(it => { it.style.transform = ''; it.style.opacity = ''; });
      return;
    }
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    let progress = -rect.top / total;
    progress = Math.max(0, Math.min(1, progress));

    const n = items.length;
    const activeFloat = progress * (n - 1);
    const activeIndex = Math.round(activeFloat);
    const itemWidth = items[0].offsetWidth;
    const gap = 32;
    const stageWidth = $('.scrolly-sticky').offsetWidth;
    const shift = stageWidth / 2 - itemWidth / 2 - activeFloat * (itemWidth + gap);
    track.style.transform = `translateX(${shift}px)`;

    items.forEach((it, i) => {
      const dist = Math.abs(i - activeFloat);
      const scale = Math.max(0.75, 1 - dist * 0.24);
      const opacity = Math.max(0.3, 1 - dist * 0.55);
      const textOpacity = Math.max(0, 1 - dist * 1.3);
      it.style.transform = `scale(${scale})`;
      it.style.opacity = opacity;
      it.querySelector('.scrolly-item-overlay').style.opacity = textOpacity;
      it.classList.toggle('is-active', i === activeIndex);
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
    if (counter) counter.textContent = `${activeIndex + 1} / ${n}`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

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

const authState = { tab: 'login', role: 'paciente' };

function initAuth() {
  const overlay = $('#authOverlay');
  const form = $('#authForm');

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

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay('authOverlay'); });

  $$('.auth-tab').forEach(tab => tab.addEventListener('click', () => setAuthTab(tab.dataset.tab)));
  $$('[data-tab-link]').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); setAuthTab(link.dataset.tabLink); }));
  $$('.role-toggle-btn').forEach(btn => btn.addEventListener('click', () => setAuthRole(btn.dataset.roleChoice)));
  updateAuthHint();

  form.addEventListener('submit', () => {
    const typedName = $('#authNombre').value.trim();

    if (authState.tab === 'register') {
      if (!typedName) { showToast('Escribí tu nombre para crear la cuenta.'); return; }
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

    const account = findAccount(typedName, authState.role);
    if (!account) {
      showToast('No encontramos ese usuario. ¿Ya creaste tu cuenta?');
      return;
    }
    loginAs(account);
  });
}

function loginAs(account) {
  Session.set({ role: account.role, name: account.name, email: account.email, specialty: account.specialty });
  showToast(`¡Bienvenido/a, ${account.name}!`);
  closeOverlay('authOverlay');
  setTimeout(() => {
    window.location.href = account.role === 'doctor' ? 'doctor.html' : 'paciente.html';
  }, 500);
}

function setAuthTab(tab) {
  authState.tab = tab;
  $$('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  $('#authSubmit').textContent = tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
  $$('.only-register').forEach(el => el.style.display = tab === 'register' ? '' : 'none');
  $$('.only-login').forEach(el => el.style.display = tab === 'login' ? '' : 'none');
  syncDoctorOnlyFields();
  updateAuthHint();
}

function setAuthRole(role) {
  authState.role = role;
  $$('.role-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.roleChoice === role));
  syncDoctorOnlyFields();
  updateAuthHint();
}

function updateAuthHint() {
  const hint = $('#authUserHint');
  if (!hint) return;
  if (authState.tab === 'register') {
    hint.textContent = '';
    return;
  }
  if (authState.role === 'doctor') {
    const nombres = TEAM.map(t => t.name.replace(/^Dr\.?a?\.?\s*/, '').split(' ')[0]).join(', ');
    hint.textContent = `Equipo: ${nombres}`;
  } else {
    hint.textContent = 'Pacientes de ejemplo: Jolye, Natalia, Luciano o Aaron';
  }
}

function syncDoctorOnlyFields() {
  const show = authState.tab === 'register' && authState.role === 'doctor';
  $$('.only-doctor').forEach(el => el.style.display = show ? '' : 'none');
}

document.addEventListener('DOMContentLoaded', () => {
  initServiceFilters();
  renderTeam();
  initScrolly();
  initAuth();
  initCrmDemo();
});
