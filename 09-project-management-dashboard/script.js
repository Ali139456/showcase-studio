(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = () => window.lucide && lucide.createIcons();

  const TEAM = [
    { id: 'sofia', name: 'Sofia Chen', role: 'Product Lead', img: 'av-sofia' },
    { id: 'marcus', name: 'Marcus Hale', role: 'Engineering', img: 'av-marcus' },
    { id: 'mei', name: 'Mei Tanaka', role: 'Design', img: 'av-mei' },
    { id: 'noah', name: 'Noah Brooks', role: 'Marketing', img: 'av-noah' },
    { id: 'clara', name: 'Clara Ruiz', role: 'Research', img: 'av-clara' },
    { id: 'emre', name: 'Emre Yilmaz', role: 'Engineering', img: 'av-emre' },
    { id: 'oliver', name: 'Oliver Grant', role: 'Ops', img: 'av-oliver' },
    { id: 'zoe', name: 'Zoe Park', role: 'Content', img: 'av-zoe' }
  ];

  const COLS = [
    { id: 'backlog', name: 'Backlog' },
    { id: 'progress', name: 'In Progress' },
    { id: 'review', name: 'Review' },
    { id: 'done', name: 'Done' }
  ];

  const PROJECTS = {
    brand: { name: 'Brand Refresh Q4', color: '#4338ca' },
    mobile: { name: 'Mobile App v2', color: '#ea580c' },
    launch: { name: 'Launch Ops', color: '#db2777' }
  };

  const today = new Date();
  const iso = (d) => {
    const x = d instanceof Date ? d : new Date(d);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  };
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return iso(d);
  };
  const hour = today.getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  let tasks = [
    { id: 't1', title: 'Finalize wordmark lockups', project: 'brand', priority: 'high', assignee: 'mei', column: 'progress', due: addDays(0) },
    { id: 't2', title: 'Ship onboarding empty states', project: 'mobile', priority: 'high', assignee: 'marcus', column: 'review', due: addDays(1) },
    { id: 't3', title: 'Write launch email sequence', project: 'launch', priority: 'med', assignee: 'zoe', column: 'progress', due: addDays(2) },
    { id: 't4', title: 'Audit competitor pricing pages', project: 'brand', priority: 'low', assignee: 'clara', column: 'backlog', due: addDays(5) },
    { id: 't5', title: 'Instrument funnel analytics', project: 'mobile', priority: 'med', assignee: 'emre', column: 'progress', due: addDays(0) },
    { id: 't6', title: 'Approve print collateral', project: 'brand', priority: 'med', assignee: 'noah', column: 'review', due: addDays(3) },
    { id: 't7', title: 'Vendor shortlist for event AV', project: 'launch', priority: 'low', assignee: 'oliver', column: 'backlog', due: addDays(6) },
    { id: 't8', title: 'QA dark mode tokens', project: 'mobile', priority: 'high', assignee: 'mei', column: 'done', due: addDays(-1) },
    { id: 't9', title: 'Draft press kit one-pager', project: 'launch', priority: 'med', assignee: 'noah', column: 'backlog', due: addDays(4) },
    { id: 't10', title: 'User interview synthesis', project: 'brand', priority: 'high', assignee: 'clara', column: 'done', due: addDays(-2) },
    { id: 't11', title: 'Push notification copy pass', project: 'mobile', priority: 'low', assignee: 'zoe', column: 'review', due: addDays(1) },
    { id: 't12', title: 'Runway checklist for launch week', project: 'launch', priority: 'high', assignee: 'sofia', column: 'progress', due: addDays(0) }
  ];

  let filters = { project: 'all', priority: 'all', assignee: 'all', query: '' };
  let view = 'board';
  let calCursor = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDay = iso(today);
  let dragId = null;

  const person = (id) => TEAM.find((t) => t.id === id);
  const toast = (msg) => {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-on'), 2200);
  };

  const matches = (t) => {
    if (filters.project !== 'all' && t.project !== filters.project) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.assignee !== 'all' && t.assignee !== filters.assignee) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${t.title} ${PROJECTS[t.project].name} ${person(t.assignee).name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };
  const filtered = () => tasks.filter(matches);

  const closeMobileNav = () => {
    $('#sidebar')?.classList.remove('is-open');
    const scrim = $('#navScrim');
    if (scrim) scrim.hidden = true;
  };

  const setView = (id) => {
    view = id;
    $$('.side-nav .nav-item').forEach((b) => b.classList.toggle('is-active', b.dataset.view === id));
    $$('.view').forEach((el) => el.classList.toggle('is-on', el.id === `view-${id}`));
    const title = $(`#view-${id}`)?.dataset.title || id;
    $('#crumb').textContent = title;
    if (id === 'overview') renderOverview();
    if (id === 'team') renderTeam();
    if (id === 'calendar') renderCalendar();
    if (id === 'activity') renderActivity();
    closeMobileNav();
    icons();
  };

  const renderKPIs = () => {
    const all = filtered();
    const dueToday = all.filter((t) => t.due === iso(today) && t.column !== 'done').length;
    $('#dueToday').textContent = dueToday;
    const stats = [
      ['Open', all.filter((t) => t.column !== 'done').length],
      ['In progress', all.filter((t) => t.column === 'progress').length],
      ['In review', all.filter((t) => t.column === 'review').length],
      ['Done', all.filter((t) => t.column === 'done').length]
    ];
    $('#kpiRow').innerHTML = stats.map(([l, v]) => `<div class="kpi"><b data-count="${v}">${v}</b><span>${l}</span></div>`).join('');
  };

  const cardHTML = (t) => {
    const p = person(t.assignee);
    const late = t.due < iso(today) && t.column !== 'done';
    return `
      <article class="card" draggable="true" data-id="${t.id}">
        <div class="card-top">
          <span class="prio ${t.priority}">${t.priority}</span>
          <span class="proj-tag">${PROJECTS[t.project].name}</span>
        </div>
        <h4>${esc(t.title)}</h4>
        <div class="card-foot">
          <img src="assets/${p.img}.jpg" alt="${esc(p.name)}" title="${esc(p.name)}">
          <span class="due ${late ? 'is-late' : ''}">${t.due}</span>
        </div>
        <div class="move">
          ${COLS.filter((c) => c.id !== t.column).map((c) => `<button type="button" data-move="${c.id}">${c.name.split(' ')[0]}</button>`).join('')}
        </div>
      </article>`;
  };

  const bindCards = () => {
    $$('.card').forEach((card) => {
      card.addEventListener('dragstart', () => {
        dragId = card.dataset.id;
        card.classList.add('is-dragging');
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('is-dragging');
        dragId = null;
        $$('.column').forEach((c) => c.classList.remove('is-dragover'));
      });
      card.addEventListener('click', (e) => {
        const move = e.target.closest('[data-move]')?.dataset.move;
        if (!move) return;
        const task = tasks.find((t) => t.id === card.dataset.id);
        if (!task) return;
        task.column = move;
        refresh();
        toast(`Moved to ${COLS.find((c) => c.id === move).name}`);
      });
    });

    $$('.column').forEach((col) => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('is-dragover');
      });
      col.addEventListener('dragleave', () => col.classList.remove('is-dragover'));
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('is-dragover');
        if (!dragId) return;
        const task = tasks.find((t) => t.id === dragId);
        if (!task) return;
        task.column = col.dataset.col;
        refresh();
        toast('Task moved');
      });
    });
  };

  const renderBoard = () => {
    const list = filtered();
    $('#board').innerHTML = COLS.map((col) => {
      const cards = list.filter((t) => t.column === col.id);
      return `
        <div class="column" data-col="${col.id}">
          <div class="col-head"><h3>${col.name}</h3><span class="col-count">${cards.length}</span></div>
          <div class="cards">${cards.map(cardHTML).join('')}</div>
        </div>`;
    }).join('');
    bindCards();
  };

  const renderOverview = () => {
    const byProj = Object.keys(PROJECTS).map((id) => {
      const all = tasks.filter((t) => t.project === id);
      const done = all.filter((t) => t.column === 'done').length;
      const pct = all.length ? Math.round((done / all.length) * 100) : 0;
      return { id, pct, done, total: all.length };
    });

    $('#healthList').innerHTML = byProj.map((p) => `
      <div class="health-item">
        <div class="meta">
          <strong>${PROJECTS[p.id].name}</strong>
          <span class="muted">${p.done}/${p.total} done</span>
        </div>
        <div class="bar"><i style="width:${p.pct}%;background:${PROJECTS[p.id].color}"></i></div>
        <b>${p.pct}%</b>
      </div>`).join('');

    const upcoming = [...filtered()]
      .filter((t) => t.column !== 'done')
      .sort((a, b) => a.due.localeCompare(b.due))
      .slice(0, 6);

    $('#upcoming').innerHTML = upcoming.length
      ? upcoming.map((t) => {
          const p = person(t.assignee);
          return `<div class="up-item">
            <img src="assets/${p.img}.jpg" alt="">
            <div style="flex:1;min-width:0">
              <strong>${esc(t.title)}</strong>
              <span class="muted">${PROJECTS[t.project].name} · ${t.priority}</span>
            </div>
            <span class="due ${t.due < iso(today) ? 'is-late' : ''}">${t.due}</span>
          </div>`;
        }).join('')
      : '<p class="muted">Nothing upcoming for these filters.</p>';

    $('#workload').innerHTML = TEAM.map((m) => {
      const open = tasks.filter((t) => t.assignee === m.id && t.column !== 'done').length;
      const max = 4;
      const pct = Math.min(100, Math.round((open / max) * 100));
      return `<div class="work-item">
        <img src="assets/${m.img}.jpg" alt="">
        <div style="flex:1">
          <strong>${esc(m.name)}</strong>
          <div class="bar" style="margin-top:6px"><i style="width:${pct}%"></i></div>
        </div>
        <b>${open}</b>
      </div>`;
    }).join('');

    const open = filtered().filter((t) => t.column !== 'done');
    const counts = {
      high: open.filter((t) => t.priority === 'high').length,
      med: open.filter((t) => t.priority === 'med').length,
      low: open.filter((t) => t.priority === 'low').length
    };
    const total = Math.max(1, open.length);
    const colors = { high: 'var(--high)', med: 'var(--med)', low: 'var(--low)' };
    $('#prioMix').innerHTML = ['high', 'med', 'low'].map((k) => `
      <div class="mix-row">
        <span class="prio ${k}">${k}</span>
        <div class="track"><i style="width:${Math.round((counts[k] / total) * 100)}%;background:${colors[k]}"></i></div>
        <b>${counts[k]}</b>
      </div>`).join('');
  };

  const renderTeam = () => {
    $('#teamCount').textContent = `${TEAM.length} people`;
    $('#teamGrid').innerHTML = TEAM.map((m) => {
      const open = tasks.filter((t) => t.assignee === m.id && t.column !== 'done').length;
      const done = tasks.filter((t) => t.assignee === m.id && t.column === 'done').length;
      return `<div class="team-card">
        <img src="assets/${m.img}.jpg" alt="">
        <div>
          <strong>${esc(m.name)}</strong>
          <div class="role">${esc(m.role)}</div>
        </div>
        <div class="stat"><span>Open <b>${open}</b></span><span>Done <b>${done}</b></span></div>
      </div>`;
    }).join('');
  };

  const renderActivity = () => {
    const items = [
      { who: 'mei', text: 'moved <strong>Finalize wordmark lockups</strong> to In Progress', when: '12 min ago' },
      { who: 'marcus', text: 'requested review on <strong>Ship onboarding empty states</strong>', when: '41 min ago' },
      { who: 'zoe', text: 'commented on <strong>Write launch email sequence</strong>', when: '1 hr ago' },
      { who: 'clara', text: 'completed <strong>User interview synthesis</strong>', when: '3 hr ago' },
      { who: 'emre', text: 'updated estimate on <strong>Instrument funnel analytics</strong>', when: 'Yesterday' },
      { who: 'sofia', text: 'created <strong>Runway checklist for launch week</strong>', when: 'Yesterday' },
      { who: 'noah', text: 'uploaded assets for <strong>Approve print collateral</strong>', when: '2 days ago' },
      { who: 'oliver', text: 'added vendors to <strong>Event AV shortlist</strong>', when: '2 days ago' }
    ];
    $('#timeline').innerHTML = items.map((i) => {
      const p = person(i.who);
      return `<div class="time-item">
        <img src="assets/${p.img}.jpg" alt="">
        <div>
          <p><strong>${esc(p.name)}</strong> ${i.text}</p>
          <small>${i.when}</small>
        </div>
      </div>`;
    }).join('');
  };

  const renderAgenda = () => {
    $('#agendaDate').textContent = selectedDay;
    const dayTasks = tasks.filter((t) => t.due === selectedDay);
    $('#dayAgenda').innerHTML = dayTasks.length
      ? dayTasks.map((t) => {
          const p = person(t.assignee);
          return `<div class="agenda-item">
            <img src="assets/${p.img}.jpg" alt="">
            <div style="flex:1;min-width:0">
              <strong>${esc(t.title)}</strong>
              <span class="muted">${PROJECTS[t.project].name} · ${COLS.find((c) => c.id === t.column).name}</span>
            </div>
            <span class="prio ${t.priority}">${t.priority}</span>
          </div>`;
        }).join('')
      : '<p class="muted">No tasks scheduled for this day.</p>';
  };

  const renderCalendar = () => {
    const y = calCursor.getFullYear();
    const m = calCursor.getMonth();
    $('#calTitle').textContent = calCursor.toLocaleString('en', { month: 'long', year: 'numeric' });
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const cells = [];

    for (let i = 0; i < 7; i++) {
      cells.push(`<div class="cal-dow">${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i]}</div>`);
    }
    for (let i = firstDow - 1; i >= 0; i--) {
      cells.push(`<button type="button" class="cal-day muted" tabindex="-1">${prevDays - i}</button>`);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const has = tasks.some((t) => t.due === date);
      const cls = [
        'cal-day',
        date === iso(today) ? 'is-today' : '',
        date === selectedDay ? 'is-selected' : '',
        has ? 'has-tasks' : ''
      ].filter(Boolean).join(' ');
      cells.push(`<button type="button" class="${cls}" data-day="${date}">${d}</button>`);
    }

    $('#calendar').innerHTML = cells.join('');
    $$('[data-day]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDay = btn.dataset.day;
        renderCalendar();
      });
    });
    renderAgenda();
  };

  const renderNotifs = () => {
    $('#notifList').innerHTML = [
      ['Marcus', 'requested your review on onboarding states', '41 min ago'],
      ['Mei', 'uploaded new wordmark explorations', '1 hr ago'],
      ['Oliver', 'flagged AV vendor quotes for launch', 'Yesterday']
    ].map(([who, text, when]) => `<li><strong>${who}</strong> ${text}<small>${when}</small></li>`).join('');
  };

  const refresh = () => {
    renderKPIs();
    renderBoard();
    if (view === 'overview') renderOverview();
    if (view === 'team') renderTeam();
    if (view === 'calendar') renderCalendar();
    if (view === 'activity') renderActivity();
    icons();
  };

  const openModal = (open = true) => {
    $('#taskModal').classList.toggle('is-open', open);
    $('#taskModal').setAttribute('aria-hidden', String(!open));
    $('#scrim').hidden = !open;
    if (open) $('#taskForm [name="title"]').focus();
  };

  /* Populate */
  $('#filterAssignee').innerHTML += TEAM.map((t) => `<option value="${t.id}">${t.name}</option>`).join('');
  $('#assigneeSelect').innerHTML = TEAM.map((t) => `<option value="${t.id}">${t.name}</option>`).join('');
  $('#taskForm [name="due"]').value = addDays(3);
  $('#dateLabel').textContent = today.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
  $('#greet').textContent = `${greet}, Sofia`;

  /* Events */
  $$('.side-nav .nav-item').forEach((btn) => btn.addEventListener('click', () => setView(btn.dataset.view)));
  $$('.proj').forEach((btn) => btn.addEventListener('click', () => {
    $$('.proj').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    filters.project = btn.dataset.project;
    refresh();
  }));

  $('#filterPriority').addEventListener('change', (e) => { filters.priority = e.target.value; refresh(); });
  $('#filterAssignee').addEventListener('change', (e) => { filters.assignee = e.target.value; refresh(); });
  $('#searchInput').addEventListener('input', (e) => { filters.query = e.target.value.trim(); refresh(); });

  $('#newTaskBtn').addEventListener('click', () => openModal(true));
  $('#modalClose').addEventListener('click', () => openModal(false));
  $('#modalCancel').addEventListener('click', () => openModal(false));
  $('#scrim').addEventListener('click', () => openModal(false));

  $('#taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    tasks.unshift({
      id: 't' + Date.now(),
      title: fd.get('title').toString().trim(),
      project: fd.get('project'),
      priority: fd.get('priority'),
      assignee: fd.get('assignee'),
      column: fd.get('column'),
      due: fd.get('due')
    });
    e.target.reset();
    $('#taskForm [name="due"]').value = addDays(3);
    $('#taskForm [name="priority"]').value = 'med';
    $('#taskForm [name="column"]').value = 'progress';
    openModal(false);
    setView('board');
    refresh();
    toast('Task created');
  });

  $('#notifBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const p = $('#notifPanel');
    p.hidden = !p.hidden;
    $('#notifBtn').setAttribute('aria-expanded', String(!p.hidden));
  });
  $('#markRead').addEventListener('click', () => {
    $('#notifPanel').hidden = true;
    $('.badge')?.remove();
    toast('Notifications cleared');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notifBtn') && !e.target.closest('#notifPanel')) {
      $('#notifPanel').hidden = true;
    }
  });

  $('#themeBtn').addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    $('#themeBtn').innerHTML = next === 'dark'
      ? '<i data-lucide="sun"></i><span>Light mode</span>'
      : '<i data-lucide="moon"></i><span>Dark mode</span>';
    icons();
  });

  $('#collapseBtn').addEventListener('click', () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      const open = !$('#sidebar').classList.contains('is-open');
      $('#sidebar').classList.toggle('is-open', open);
      const scrim = $('#navScrim');
      if (scrim) scrim.hidden = !open;
      return;
    }
    $('#app').classList.toggle('is-collapsed');
  });
  $('#menuBtn')?.addEventListener('click', () => {
    const open = !$('#sidebar').classList.contains('is-open');
    $('#sidebar').classList.toggle('is-open', open);
    const scrim = $('#navScrim');
    if (scrim) scrim.hidden = !open;
  });
  $('#navScrim')?.addEventListener('click', closeMobileNav);

  $('#calPrev').addEventListener('click', () => {
    calCursor.setMonth(calCursor.getMonth() - 1);
    if (view === 'calendar') renderCalendar();
    icons();
  });
  $('#calNext').addEventListener('click', () => {
    calCursor.setMonth(calCursor.getMonth() + 1);
    if (view === 'calendar') renderCalendar();
    icons();
  });
  $('#calToday').addEventListener('click', () => {
    calCursor = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedDay = iso(today);
    if (view === 'calendar') renderCalendar();
    icons();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#searchInput').focus();
    }
    if (e.key === 'Escape') openModal(false);
  });

  renderNotifs();
  setView('board');
  refresh();

  /* Loader */
  const loader = $('#loader');
  if (typeof gsap !== 'undefined') {
    gsap.to('.loader-bar i', {
      width: '100%',
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.65,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.remove();
            document.body.classList.remove('is-loading');
          }
        });
        gsap.from('.kpi, .column', {
          y: 18,
          opacity: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.1
        });
      }
    });
  } else {
    loader.remove();
    document.body.classList.remove('is-loading');
  }
})();
