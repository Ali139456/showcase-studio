(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icons = () => window.lucide && lucide.createIcons();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Data ---------- */
  const PROGRAMS = [
    { id: 'strength', name: 'Strength', img: 'prog-strength', text: 'Squat, press, pull, repeat. Linear progress for as long as it lasts, then smarter programming for when it stops.', len: '12 weeks', level: 'All levels', freq: '4 sessions / week', classes: [['Barbell Club', 75], ['Heavy Singles', 60]], cap: 14, coach: 'marcus' },
    { id: 'hiit', name: 'Conditioning', img: 'prog-hiit', text: 'Short, honest intervals on ropes, rowers and sleds. Written to raise your ceiling, not just to leave you on the floor.', len: '12 weeks', level: 'Intermediate', freq: '3 sessions / week', classes: [['Engine Room', 45], ['Redline', 30]], cap: 16, coach: 'freya' },
    { id: 'functional', name: 'Hybrid', img: 'prog-functional', text: 'Kettlebells, carries and gymnastics basics for people who want to be good at more than one thing at once.', len: '12 weeks', level: 'All levels', freq: '4 sessions / week', classes: [['Hybrid Floor', 60], ['Sled & Carry', 45]], cap: 18, coach: 'dev' },
    { id: 'mobility', name: 'Mobility', img: 'prog-mobility', text: 'Slow, loaded range work that makes every other session better, and getting out of bed noticeably quieter.', len: '8 weeks', level: 'Beginner friendly', freq: '2 sessions / week', classes: [['Reset', 45], ['Hips & Shoulders', 30]], cap: 12, coach: 'lena' },
    { id: 'endurance', name: 'Endurance', img: 'prog-endurance', text: 'Run club with a plan. Aerobic base, track intervals and one long Sunday effort along the canal.', len: '16 weeks', level: 'All paces', freq: '3 sessions / week', classes: [['Long Aerobic', 60], ['Track Intervals', 50]], cap: 20, coach: 'lena' }
  ];
  const progById = (id) => PROGRAMS.find((p) => p.id === id);

  const COACHES = [
    { id: 'marcus', name: 'Marcus Reid', role: 'Head of Strength', bio: 'Twelve years coaching powerlifters and first-timers with exactly the same patience.', tags: ['Powerlifting', 'Barbell technique', 'Return from injury'], face: '50% 24%', zoom: 2.4 },
    { id: 'freya', name: 'Freya Lindqvist', role: 'Conditioning Lead', bio: 'Former national-level rower. Writes intervals you will hate, then thank her for.', tags: ['Engine building', 'Rowing', 'Fat loss'], face: '54% 36%', zoom: 2.6 },
    { id: 'dev', name: 'Dev Malhotra', role: 'Hybrid Coach', bio: 'Kettlebell specialist who is fairly sure loaded carries fix most things.', tags: ['Kettlebells', 'Gymnastics', 'Hyrox prep'], face: '52% 60%', zoom: 2.8 },
    { id: 'lena', name: 'Lena Morales', role: 'Mobility & Endurance', bio: 'Physio-trained marathoner, and the reason our members\' knees still work.', tags: ['Mobility', 'Running', 'Prehab'], face: '38% 42%', zoom: 2.4 }
  ];
  const coachById = (id) => COACHES.find((c) => c.id === id);

  const PLANS = [
    { id: 'base', name: 'Base', price: 49, text: 'Open floor access for people who already have a plan.', feats: [['24/7 floor access', 1], ['Movement screen on joining', 1], ['2 coached classes a month', 1], ['Written program, updated each block', 0], ['Monthly 1:1 coach review', 0]] },
    { id: 'forge', name: 'Forge', price: 89, hot: true, text: 'The full club. Unlimited classes and a program written for you.', feats: [['24/7 floor access', 1], ['Movement screen on joining', 1], ['Unlimited coached classes', 1], ['Written program, updated each block', 1], ['Monthly 1:1 coach review', 0]] },
    { id: 'elite', name: 'Elite', price: 149, text: 'Everything in Forge, plus a coach in your corner every month.', feats: [['24/7 floor access', 1], ['Movement screen on joining', 1], ['Unlimited coached classes', 1], ['Written program, updated each block', 1], ['Monthly 1:1 coach review', 1]] }
  ];
  const annual = (p) => Math.round((p * 10) / 12);

  const CATS = [['all', 'All'], ['strength', 'Strength'], ['fat', 'Fat loss'], ['performance', 'Performance']];
  const RESULTS = [
    { img: 'tf-4', name: 'Tomás Vidal', cat: 'strength', stat: '+85kg', label: 'on his three-lift total', prog: 'strength', quote: 'I stopped guessing. Every session had a number on it and the numbers kept going up.', stats: [['365 → 450', 'Total, kg'], ['+30kg', 'Back squat'], ['48', 'Weeks']] },
    { img: 'tf-5', name: 'Priya Nair', cat: 'fat', stat: '−14kg', label: 'and kept off for a year', prog: 'functional', quote: 'It was never a diet. Four sessions a week, a food log my coach actually read, and time.', stats: [['82 → 68', 'Bodyweight, kg'], ['4×', 'Sessions a week'], ['36', 'Weeks']] },
    { img: 'tf-2', name: 'Jonah Reyes', cat: 'performance', stat: '22', label: 'strict pull-ups, unbroken', prog: 'functional', quote: 'I walked in with nine ugly ones. Dev rebuilt them from the hang up.', stats: [['9 → 22', 'Pull-ups'], ['−41s', '2km row'], ['36', 'Weeks']] },
    { img: 'tf-1', name: 'Maya Okafor', cat: 'strength', stat: '+42kg', label: 'added to her deadlift', prog: 'strength', quote: 'My first pull-up was in week eleven. I may have cried a little. Marcus definitely did.', stats: [['62 → 104', 'Deadlift, kg'], ['0 → 7', 'Pull-ups'], ['24', 'Weeks']] },
    { img: 'tf-3', name: 'Elise Brandt', cat: 'fat', stat: '−9%', label: 'body fat across two blocks', prog: 'hiit', quote: 'The scale barely moved for a month. The photos and the lifts told a very different story.', stats: [['31 → 22%', 'Body fat'], ['+4kg', 'Lean mass'], ['24', 'Weeks']] },
    { img: 'tf-6', name: 'Andre Cole', cat: 'performance', stat: '3:12', label: 'off his half marathon', prog: 'endurance', quote: 'Turns out running slower most days is how you run faster on the one that counts.', stats: [['1:51 → 1:48', 'Half marathon'], ['52 → 47', 'Resting HR'], ['24', 'Weeks']] }
  ];

  const VOICES = [
    { img: 'av-kwame', name: 'Kwame Mensah', meta: 'Member since 2021 · Strength', quote: 'I trained alone for ten years. Twelve weeks here moved my squat further than the last three did.' },
    { img: 'av-camille', name: 'Camille Roux', meta: 'Member since 2023 · Hybrid', quote: 'Nobody shouted at me. Somebody wrote me a plan, and then checked that I had done it.' },
    { img: 'av-ethan', name: 'Ethan Park', meta: 'Member since 2019 · Conditioning', quote: 'I joined for the 5am access. I stayed because the coaches knew my name by Thursday.' }
  ];

  /* ---------- Schedule model ---------- */
  const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const WEEK_SLOTS = [[6, 0], [7, 15], [9, 30], [12, 15], [17, 30], [18, 45], [20, 0]];
  const WEEKEND_SLOTS = [[8, 0], [9, 30], [11, 0], [16, 0]];
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(now);
  const fmtTime = (h, m) => `${((h + 11) % 12) + 1}:${pad(m)}<small>${h < 12 ? 'AM' : 'PM'}</small>`;
  const fmtTimePlain = (h, m) => `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;

  const WEEK = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const w = date.getDay();
    const slots = w === 0 || w === 6 ? WEEKEND_SLOTS : WEEK_SLOTS;
    const classes = slots.map(([h, m], s) => {
      const prog = PROGRAMS[(w * 3 + s * 2 + (s > 3 ? 1 : 0)) % PROGRAMS.length];
      const [name, mins] = prog.classes[(w + s) % 2];
      const seed = (w * 37 + s * 53 + 11) % 97;
      const taken = Math.min(prog.cap, Math.round(prog.cap * (0.35 + (seed % 70) / 100)));
      const coach = prog.id === 'endurance' && s % 2 ? 'freya' : prog.coach;
      return { id: `${i}-${s}`, h, m, prog: prog.id, name, mins, cap: prog.cap, taken, coach, past: i === 0 && (h * 60 + m) <= now.getHours() * 60 + now.getMinutes() };
    });
    return { i, date, w, classes };
  });

  const state = {
    panel: 0,
    day: WEEK[0].classes.filter((c) => !c.past).length >= 2 ? 0 : 1,
    prog: 'all',
    booked: new Set(),
    bill: 'monthly',
    cat: 'all',
    lb: 0,
    voice: 0
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* ---------- Programs ---------- */
  function renderPanels() {
    $('#panels').innerHTML = PROGRAMS.map((p, i) => `
      <article class="panel${i === state.panel ? ' is-active' : ''}" data-panel="${i}" tabindex="0" aria-label="${esc(p.name)} program">
        <img src="assets/${p.img}.jpg" alt="${esc(p.name)} training at FORGE" loading="lazy">
        <span class="panel-num">0${i + 1}</span>
        <span class="panel-side" aria-hidden="true">${esc(p.name)}</span>
        <div class="panel-body">
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.text)}</p>
          <ul class="panel-meta">
            <li><span>Block</span>${esc(p.len)}</li>
            <li><span>Level</span>${esc(p.level)}</li>
            <li><span>Rhythm</span>${esc(p.freq)}</li>
            <li><span>Lead coach</span>${esc(coachById(p.coach).name)}</li>
          </ul>
          <button class="btn btn-lime" data-join data-program="${p.id}">Join ${esc(p.name)}<i data-lucide="arrow-up-right"></i></button>
        </div>
      </article>`).join('');
  }
  function setPanel(i) {
    if (i === state.panel) return;
    state.panel = i;
    $$('.panel').forEach((el, n) => el.classList.toggle('is-active', n === i));
    if (hasST) setTimeout(() => ScrollTrigger.refresh(), 950);
  }

  /* ---------- Schedule ---------- */
  function renderDays() {
    $('#days').innerHTML = WEEK.map((d) => `
      <button role="tab" aria-selected="${d.i === state.day}" class="${d.i === state.day ? 'is-active' : ''}${d.i === 0 ? ' is-today' : ''}" data-day="${d.i}">
        <b>${DAY[d.w]}</b><span>${MONTH[d.date.getMonth()]} ${d.date.getDate()}</span>
      </button>`).join('');
  }
  function spotsLeft(c) { return c.cap - c.taken - (state.booked.has(c.id) ? 1 : 0); }
  function classRow(c) {
    const coach = coachById(c.coach);
    const booked = state.booked.has(c.id);
    const left = spotsLeft(c);
    const full = left <= 0 && !booked;
    const fill = Math.round(((c.cap - left) / c.cap) * 100);
    const label = full ? 'Class full' : left === 0 ? 'Last spot taken' : `${left} ${left === 1 ? 'spot' : 'spots'} left`;
    return `
      <div class="class-row${booked ? ' is-booked' : ''}${full ? ' is-full' : ''}" data-class="${c.id}">
        <div class="class-time">${fmtTime(c.h, c.m)}</div>
        <div class="class-name"><span>${esc(progById(c.prog).name)}</span><b>${esc(c.name)}</b></div>
        <div class="class-coach"><i class="ava"><img src="assets/tr-${coach.id}.jpg" alt="" style="object-position:${coach.face};transform-origin:${coach.face};transform:scale(${coach.zoom})"></i><span>${esc(coach.name)}</span></div>
        <div class="class-dur">${c.mins} min</div>
        <div class="class-spots${left <= 3 ? ' is-low' : ''}" style="--fill:${fill}%"><span>${label}</span><i></i></div>
        <button class="btn ${booked ? 'btn-dark' : 'btn-lime'}" data-book="${c.id}" ${full ? 'disabled' : ''} aria-pressed="${booked}">${booked ? 'Booked<i data-lucide="check"></i>' : full ? 'Full' : 'Book<i data-lucide="plus"></i>'}</button>
      </div>`;
  }
  function renderClasses(animate) {
    const day = WEEK[state.day];
    const list = day.classes.filter((c) => !c.past && (state.prog === 'all' || c.prog === state.prog));
    const box = $('#classes');
    if (!list.length) {
      const what = state.prog === 'all' ? 'classes' : `${progById(state.prog).name} classes`;
      const done = state.day === 0 && day.classes.some((c) => c.past) && state.prog === 'all';
      box.innerHTML = `<div class="class-empty"><b>${done ? 'That is a wrap for today' : 'Rest day'}</b>No ${esc(what.toLowerCase())} ${done ? 'left' : 'on'} ${state.day === 0 ? 'today' : DAY[day.w]}. Try another day${state.prog === 'all' ? '' : ' or program'}.</div>`;
    } else {
      box.innerHTML = list.map(classRow).join('');
    }
    icons();
    if (animate && hasGsap && !reduce) gsap.from(box.children, { opacity: 0, x: -30, duration: .5, stagger: .05, ease: 'power3.out', clearProps: 'all' });
  }
  function toggleBook(id) {
    const c = WEEK.flatMap((d) => d.classes).find((x) => x.id === id);
    if (!c) return;
    const d = WEEK[+id.split('-')[0]];
    if (state.booked.has(id)) {
      state.booked.delete(id);
      toast(`Booking cancelled · ${c.name}`);
    } else {
      if (spotsLeft(c) <= 0) return;
      state.booked.add(id);
      toast(`You're in · ${c.name}, ${DAY[d.w]} ${fmtTimePlain(c.h, c.m)}`);
    }
    const row = $(`[data-class="${id}"]`);
    if (row) {
      row.outerHTML = classRow(c);
      icons();
    }
  }

  /* ---------- Coaches ---------- */
  function renderCoaches() {
    $('#coachGrid').innerHTML = COACHES.map((c, i) => `
      <article class="coach" data-rise tabindex="0">
        <img src="assets/tr-${c.id}.jpg" alt="${esc(c.name)}, ${esc(c.role)}" loading="lazy">
        <span class="coach-num">0${i + 1}</span>
        <div class="coach-body">
          <h3>${esc(c.name.split(' ')[0])}<br>${esc(c.name.split(' ')[1])}</h3>
          <span>${esc(c.role)}</span>
          <div class="coach-more"><div>
            <p>${esc(c.bio)}</p>
            <ul>${c.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            <button class="btn btn-lime btn-sm" data-join data-coach="${c.id}">Book intro session<i data-lucide="arrow-up-right"></i></button>
          </div></div>
        </div>
      </article>`).join('');
  }

  /* ---------- Membership ---------- */
  function renderPlans() {
    $('#plans').innerHTML = PLANS.map((p) => `
      <article class="plan${p.hot ? ' plan-hot' : ''}" data-rise>
        ${p.hot ? '<span class="plan-flag">Most joined</span>' : ''}
        <h3>${p.name}</h3>
        <p class="plan-for">${esc(p.text)}</p>
        <div class="plan-price"><b><sup>$</sup><span data-price="${p.id}">${p.price}</span></b><span>per month<br><em data-bill-note>billed monthly</em></span></div>
        <ul>${p.feats.map(([f, on]) => `<li class="${on ? '' : 'is-off'}"><i data-lucide="${on ? 'check' : 'minus'}"></i>${esc(f)}</li>`).join('')}</ul>
        <button class="btn ${p.hot ? 'btn-dark' : 'btn-lime'} btn-block" data-join data-plan="${p.id}">Start with ${p.name}<i data-lucide="arrow-up-right"></i></button>
      </article>`).join('');
  }
  function setBill(mode) {
    if (mode === state.bill) return;
    state.bill = mode;
    $$('#bill button').forEach((b) => b.classList.toggle('is-active', b.dataset.bill === mode));
    $$('[data-bill-note]').forEach((el) => { el.textContent = mode === 'annual' ? 'billed annually' : 'billed monthly'; });
    PLANS.forEach((p) => {
      const el = $(`[data-price="${p.id}"]`);
      const to = mode === 'annual' ? annual(p.price) : p.price;
      if (hasGsap && !reduce) {
        const o = { v: +el.textContent };
        gsap.to(o, { v: to, duration: .7, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
        gsap.fromTo(el.parentNode, { yPercent: mode === 'annual' ? -18 : 18, opacity: .3 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'power3.out', clearProps: 'all' });
      } else el.textContent = to;
    });
  }

  /* ---------- Results ---------- */
  const visibleResults = () => RESULTS.filter((r) => state.cat === 'all' || r.cat === state.cat);
  function renderTabs() {
    $('#resultTabs').innerHTML = CATS.map(([id, label]) => `<button class="${id === state.cat ? 'is-active' : ''}" data-cat="${id}">${label}</button>`).join('');
  }
  function renderResults(animate) {
    const list = visibleResults();
    const grid = $('#resultGrid');
    grid.innerHTML = list.map((r, i) => `
      <button class="result" data-result="${i}" aria-label="View ${esc(r.name)}'s result">
        <img src="assets/${r.img}.jpg" alt="${esc(r.name)} training at FORGE" loading="lazy">
        <div class="result-stat"><b>${esc(r.stat)}</b><span><i data-lucide="maximize-2"></i></span></div>
        <div class="result-body"><small>${esc(CATS.find((c) => c[0] === r.cat)[1])} · ${esc(progById(r.prog).name)}</small><h3>${esc(r.name)}</h3><p>${esc(r.label)}</p></div>
      </button>`).join('');
    icons();
    if (animate && hasGsap && !reduce) {
      gsap.from(grid.children, { opacity: 0, y: 40, duration: .6, stagger: .07, ease: 'power3.out', clearProps: 'all' });
      if (hasST) ScrollTrigger.refresh();
    }
  }
  function showResult(i, dir) {
    const list = visibleResults();
    state.lb = (i + list.length) % list.length;
    const r = list[state.lb];
    const img = $('#lbImg');
    img.src = `assets/${r.img}.jpg`;
    img.alt = `${r.name} training at FORGE`;
    $('#lbInfo').innerHTML = `
      <small>${esc(CATS.find((c) => c[0] === r.cat)[1])} · ${esc(progById(r.prog).name)} program</small>
      <h3>${esc(r.name)}</h3>
      <blockquote>“${esc(r.quote)}”</blockquote>
      <div class="lb-stats">${r.stats.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>
      <button class="btn btn-lime" data-join data-program="${r.prog}">Train ${esc(progById(r.prog).name)}<i data-lucide="arrow-up-right"></i></button>`;
    $('#lbCount').textContent = `${pad(state.lb + 1)} / ${pad(list.length)}`;
    icons();
    if (dir && hasGsap && !reduce) {
      gsap.fromTo(img, { xPercent: 8 * dir, opacity: 0, scale: 1.08 }, { xPercent: 0, opacity: 1, scale: 1, duration: .6, ease: 'power3.out', clearProps: 'all' });
      gsap.from($('#lbInfo').children, { opacity: 0, y: 18, duration: .45, stagger: .05, ease: 'power3.out', clearProps: 'all' });
    }
  }

  /* ---------- Voices ---------- */
  function renderVoiceNav() {
    $('#voiceNav').innerHTML = VOICES.map((v, i) => `
      <button data-voice="${i}" class="${i === state.voice ? 'is-active' : ''}" aria-label="${esc(v.name)}">
        <img src="assets/${v.img}.jpg" alt=""><div><b>${esc(v.name)}</b><span>${esc(v.meta.split(' · ')[1])}</span></div>
      </button>`).join('');
  }
  function showVoice(i, animate) {
    state.voice = (i + VOICES.length) % VOICES.length;
    const v = VOICES[state.voice];
    $$('#voiceNav button').forEach((b, n) => b.classList.toggle('is-active', n === state.voice));
    const q = $('#voiceQuote');
    q.innerHTML = v.quote.split(' ').map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
    $('#voiceName').textContent = v.name;
    $('#voiceMeta').textContent = v.meta;
    if (animate && hasGsap && !reduce) {
      gsap.from($$('.w', q), { opacity: 0, y: 26, skewX: -14, duration: .5, stagger: .022, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.voice-who', { opacity: 0, duration: .5, delay: .35, clearProps: 'all' });
    }
  }

  /* ---------- Modals ---------- */
  let lastFocus = null;
  function openModal(el) {
    lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
  }
  function closeModal(el) {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (!$('.modal.is-open')) document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  function check(field, ok, msg) {
    const wrap = field.closest('.f');
    wrap.classList.toggle('is-bad', !ok);
    const s = $('small', wrap);
    if (s) s.textContent = ok ? '' : msg;
    return ok;
  }
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  function openJoin(opts = {}) {
    const plan = opts.plan || 'forge';
    const coach = opts.coach ? coachById(opts.coach) : null;
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
    $('#joinBody').innerHTML = `
      <form id="joinForm" novalidate>
        <h3 id="joinTitle">${coach ? `Train with ${esc(coach.name.split(' ')[0])}` : 'Your free week'}</h3>
        <p class="d-sub">${coach ? `A 45-minute intro session with ${esc(coach.name)}, then seven days on the house.` : 'Seven days, every class, no card required. Pick a plan to try — you can change it any time.'}</p>
        <div class="pick" id="planPick" role="radiogroup" aria-label="Plan">
          ${PLANS.map((p) => `<button type="button" role="radio" aria-checked="${p.id === plan}" class="${p.id === plan ? 'is-active' : ''}" data-pick="${p.id}"><b>${p.name}</b><span>$${state.bill === 'annual' ? annual(p.price) : p.price} / month</span></button>`).join('')}
        </div>
        <div class="f-row">
          <label class="f"><span>Name</span><input name="name" autocomplete="name" placeholder="Your name"><small></small></label>
          <label class="f"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="you@email.com"><small></small></label>
        </div>
        <div class="f-row">
          <label class="f"><span>Program</span><select name="program"><option value="">Help me choose</option>${PROGRAMS.map((p) => `<option value="${p.id}"${p.id === opts.program ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label>
          <label class="f"><span>First session</span><input name="date" type="date" min="${isoDate(today)}" max="${isoDate(max)}" value="${isoDate(tomorrow)}"><small></small></label>
        </div>
        <button class="btn btn-lime btn-block" type="submit">${coach ? 'Book intro session' : 'Claim free week'}<i data-lucide="arrow-up-right"></i></button>
      </form>`;
    icons();
    const form = $('#joinForm');
    let picked = plan;
    $('#planPick').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (!b) return;
      picked = b.dataset.pick;
      $$('[data-pick]', form).forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-checked', on); });
    });
    form.addEventListener('input', (e) => { const f = e.target.closest('.f'); if (f && f.classList.contains('is-bad')) { f.classList.remove('is-bad'); const s = $('small', f); if (s) s.textContent = ''; } });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, email, date, program } = form.elements;
      const okN = check(name, name.value.trim().length > 1, 'Tell us your name');
      const okE = check(email, validEmail(email.value.trim()), 'Enter a valid email');
      const d = date.value ? new Date(`${date.value}T00:00`) : null;
      const okD = check(date, d && d >= today && d <= max, 'Pick a date in the next 60 days');
      if (!(okN && okE && okD)) { (okN ? (okE ? date : email) : name).focus(); return; }
      const p = PLANS.find((x) => x.id === picked);
      const first = name.value.trim().split(' ')[0];
      $('#joinBody').innerHTML = `
        <div class="done">
          <span class="done-ico"><i data-lucide="check"></i></span>
          <h3 id="joinTitle">You're in, ${esc(first)}</h3>
          <p>We've sent the details to ${esc(email.value.trim())}. Arrive ten minutes early — a coach will meet you at the front desk.</p>
          <dl>
            <div><dt>Trial plan</dt><dd>${p.name} · 7 days free</dd></div>
            <div><dt>Program</dt><dd>${program.value ? esc(progById(program.value).name) : 'Chosen with your coach'}</dd></div>
            ${coach ? `<div><dt>Coach</dt><dd>${esc(coach.name)}</dd></div>` : ''}
            <div><dt>First session</dt><dd>${DAY[d.getDay()]}, ${MONTH[d.getMonth()]} ${d.getDate()}</dd></div>
          </dl>
          <button class="btn btn-lime" data-close>Done</button>
        </div>`;
      icons();
      if (hasGsap && !reduce) gsap.from('#joinBody .done > *', { opacity: 0, y: 20, duration: .5, stagger: .07, ease: 'power3.out', clearProps: 'all' });
    });
    closeModal($('#lightbox'));
    setMenu(false);
    openModal($('#joinModal'));
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), 350);
  }

  /* ---------- Header / menu ---------- */
  function setMenu(open) {
    const m = $('#mnav'), b = $('#burger');
    m.classList.toggle('is-open', open);
    m.setAttribute('aria-hidden', !open);
    b.setAttribute('aria-expanded', open);
    document.body.classList.toggle('is-locked', open || !!$('.modal.is-open'));
    if (open && hasGsap && !reduce) gsap.from('#mnav nav a', { xPercent: 30, opacity: 0, duration: .6, stagger: .05, delay: .2, ease: 'power3.out', clearProps: 'all' });
  }
  function initHeader() {
    const header = $('#header');
    const links = $$('.nav a');
    const secs = links.map((a) => $(a.getAttribute('href')));
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-solid', y > 40);
      header.classList.toggle('is-hidden', y > 500 && y > last + 2 && !$('#mnav').classList.contains('is-open'));
      if (y < last - 2 || y <= 500) header.classList.remove('is-hidden');
      last = y;
      const mid = y + window.innerHeight * .4;
      let cur = -1;
      secs.forEach((s, i) => { if (s && s.offsetTop <= mid) cur = i; });
      links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Marquee bands ---------- */
  function initBands() {
    const words = [
      ['Lift heavy', 'Move well', 'Show up', 'Repeat'],
      ['Strength', 'Conditioning', 'Hybrid', 'Mobility', 'Endurance']
    ];
    const tracks = $$('.band-track').map((el, i) => {
      const set = words[i].map((w) => `<span>${w}</span>`).join('');
      el.innerHTML = set.repeat(8);
      return { el, dir: +el.dataset.speed, half: 0, x: 0 };
    });
    const measure = () => tracks.forEach((t) => { t.half = t.el.scrollWidth / 2; });
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if (reduce) return;
    let lastY = window.scrollY, boost = 0, visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe($('.bands'));
    const tick = () => {
      const y = window.scrollY;
      boost += (Math.min(40, Math.abs(y - lastY)) - boost) * .12;
      lastY = y;
      if (visible) tracks.forEach((t) => {
        if (!t.half) return;
        t.x = (t.x + 1.1 + boost * .55) % t.half;
        t.el.style.transform = `translate3d(${t.dir > 0 ? -t.x : t.x - t.half}px,0,0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Counters ---------- */
  function runCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const to = +el.dataset.count;
    const fmt = (v) => (el.hasAttribute('data-sep') ? Math.round(v).toLocaleString('en-US') : String(Math.round(v)));
    if (!hasGsap || reduce) { el.textContent = fmt(to); return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } });
  }

  /* ---------- Open state ---------- */
  function setOpenState() {
    const w = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    const [from, to] = w === 0 || w === 6 ? [7, 20] : [5, 22];
    const label = (n) => `${((n + 11) % 12) + 1}${n < 12 ? 'am' : 'pm'}`;
    $('#openState').textContent = h >= from && h < to ? `Open now · coaches on until ${label(to)}` : `Open now · member access only`;
  }

  /* ---------- Scroll animation ---------- */
  function splitLines() {
    $$('[data-lines]').forEach((h) => {
      h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="line"><span>${l.trim()}</span></span>`).join('');
    });
  }
  function initScroll() {
    if (!hasST || reduce) { $$('[data-count]').forEach(runCount); return; }

    $$('[data-lines]').forEach((h) => {
      gsap.from($$('.line > span', h), { yPercent: 115, skewY: 5, duration: 1, stagger: .1, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
    });
    gsap.set('[data-in]', { opacity: 0, y: 34 });
    ScrollTrigger.batch('[data-in]', { start: 'top 90%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'power3.out', clearProps: 'transform' }) });
    gsap.set('[data-rise]', { opacity: 0, y: 70 });
    ScrollTrigger.batch('[data-rise]', { start: 'top 92%', once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out', clearProps: 'transform,opacity' }) });

    $$('[data-wipe]').forEach((f, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 85%' } });
      tl.fromTo(f, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, delay: i * .15, ease: 'power4.inOut' })
        .from($('img', f), { scale: 1.35, duration: 1.6, ease: 'power3.out' }, '<');
    });
    gsap.to('.mm-b', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.manifesto-media', start: 'top bottom', end: 'bottom top', scrub: true } });

    gsap.from('.panel', { yPercent: 14, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '#panels', start: 'top 82%' } });
    gsap.from('.days button', { opacity: 0, y: 24, duration: .5, stagger: .04, ease: 'power3.out', scrollTrigger: { trigger: '#days', start: 'top 90%' } });
    gsap.from('#classes > *', { opacity: 0, x: -40, duration: .6, stagger: .06, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: '#classes', start: 'top 88%' } });
    gsap.from('#resultGrid > *', { opacity: 0, y: 60, duration: .8, stagger: .08, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: '#resultGrid', start: 'top 86%' } });

    ScrollTrigger.create({ trigger: '#voice', start: 'top 80%', once: true, onEnter: () => showVoice(state.voice, true) });

    gsap.to('#heroImg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-title', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('#ctaImg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.footer-word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.footer-word', start: 'top 96%' } });

    $$('[data-count]').forEach((el) => {
      if (el.closest('.hero')) return;
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => runCount(el) });
    });
  }

  /* ---------- Intro ---------- */
  function intro() {
    const loader = $('#loader');
    const finish = () => { document.body.classList.remove('is-loading'); loader.remove(); };
    const heroCounts = () => $$('.hero [data-count]').forEach(runCount);
    if (!hasGsap || reduce) { finish(); heroCounts(); return; }

    const num = $('#loaderNum');
    const o = { v: 0 };
    gsap.set('.hero-title .row > span', { yPercent: 118, skewY: 7 });
    gsap.set(['.hero-tag', '.hero-foot > *', '.hero-stats li'], { opacity: 0, y: 26 });
    gsap.set('.hero-badge', { opacity: 0, scale: .6, rotate: -40 });
    gsap.set('#header', { yPercent: -100 });
    gsap.set('.hero-media', { scale: 1.25 });

    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to(o, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(o.v); } })
      .to('.loader-bar i', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
      .from('.loader-word', { yPercent: 30, opacity: 0, duration: .8 }, 0)
      .to('.loader-word', { yPercent: -40, opacity: 0, duration: .5, ease: 'power3.in' }, 1.3)
      .to(loader, { yPercent: -100, duration: .9, ease: 'power4.inOut' }, 1.5)
      .add(finish, 2.4)
      .to('.hero-media', { scale: 1, duration: 2, ease: 'power3.out' }, 1.6)
      .to('.hero-title .row > span', { yPercent: 0, skewY: 0, duration: 1.1, stagger: .11 }, 1.95)
      .to('#header', { yPercent: 0, duration: .8, clearProps: 'transform' }, 2.2)
      .to(['.hero-tag', '.hero-foot > *', '.hero-stats li'], { opacity: 1, y: 0, duration: .8, stagger: .07, clearProps: 'transform' }, 2.35)
      .to('.hero-badge', { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.6)' }, 2.5)
      .add(heroCounts, 2.5);
  }

  /* ---------- Events ---------- */
  function bind() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      const join = t.closest('[data-join]');
      if (join) { e.preventDefault(); openJoin({ plan: join.dataset.plan, program: join.dataset.program, coach: join.dataset.coach }); return; }
      const close = t.closest('[data-close]');
      if (close) { closeModal(close.closest('.modal')); return; }
      const panel = t.closest('[data-panel]');
      if (panel) { setPanel(+panel.dataset.panel); return; }
      const day = t.closest('[data-day]');
      if (day) { state.day = +day.dataset.day; renderDays(); renderClasses(true); return; }
      const book = t.closest('[data-book]');
      if (book) { toggleBook(book.dataset.book); return; }
      const bill = t.closest('[data-bill]');
      if (bill) { setBill(bill.dataset.bill); return; }
      const cat = t.closest('[data-cat]');
      if (cat) { state.cat = cat.dataset.cat; renderTabs(); renderResults(true); return; }
      const res = t.closest('[data-result]');
      if (res) { showResult(+res.dataset.result); openModal($('#lightbox')); return; }
      const voice = t.closest('[data-voice]');
      if (voice) { showVoice(+voice.dataset.voice, true); return; }
      if (t.closest('#mnav a')) setMenu(false);
    });

    $('#panels').addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.panel')) { e.preventDefault(); setPanel(+e.target.dataset.panel); }
    });
    $('#schedProg').innerHTML = `<option value="all">All programs</option>${PROGRAMS.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}`;
    $('#schedProg').addEventListener('change', (e) => { state.prog = e.target.value; renderClasses(true); });
    $('#voicePrev').addEventListener('click', () => showVoice(state.voice - 1, true));
    $('#voiceNext').addEventListener('click', () => showVoice(state.voice + 1, true));
    $('#lbPrev').addEventListener('click', () => showResult(state.lb - 1, -1));
    $('#lbNext').addEventListener('click', () => showResult(state.lb + 1, 1));
    $('#burger').addEventListener('click', () => setMenu(!$('#mnav').classList.contains('is-open')));
    window.addEventListener('resize', () => { if (window.innerWidth > 1180 && $('#mnav').classList.contains('is-open')) setMenu(false); });

    document.addEventListener('keydown', (e) => {
      const lb = $('#lightbox').classList.contains('is-open');
      if (e.key === 'Escape') {
        const open = $$('.modal.is-open').pop();
        if (open) closeModal(open); else if ($('#mnav').classList.contains('is-open')) setMenu(false);
      } else if (lb && e.key === 'ArrowRight') showResult(state.lb + 1, 1);
      else if (lb && e.key === 'ArrowLeft') showResult(state.lb - 1, -1);
    });

    const form = $('#contactForm');
    form.addEventListener('input', (e) => { const f = e.target.closest('.f'); if (f && f.classList.contains('is-bad')) { f.classList.remove('is-bad'); const s = $('small', f); if (s) s.textContent = ''; } });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, email, goal } = form.elements;
      const okN = check(name, name.value.trim().length > 1, 'Tell us your name');
      const okE = check(email, validEmail(email.value.trim()), 'Enter a valid email');
      const ok = $('#contactOk');
      if (!(okN && okE)) { ok.textContent = ''; (okN ? email : name).focus(); return; }
      ok.textContent = `Thanks, ${name.value.trim().split(' ')[0]} — a coach will email you today to set a time. Goal noted: ${goal.value.toLowerCase()}.`;
      form.reset();
      toast('Tour request sent');
    });
  }

  /* ---------- Init ---------- */
  function init() {
    splitLines();
    renderPanels();
    renderDays();
    renderClasses(false);
    renderCoaches();
    renderPlans();
    renderTabs();
    renderResults(false);
    renderVoiceNav();
    showVoice(0, false);
    setOpenState();
    icons();
    bind();
    initHeader();
    initBands();
    intro();
    initScroll();
    window.addEventListener('load', () => hasST && ScrollTrigger.refresh());
  }

  init();
})();
