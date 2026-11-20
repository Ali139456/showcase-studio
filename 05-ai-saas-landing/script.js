/* Axiom — AI answer layer */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icons = () => { if (window.lucide) window.lucide.createIcons(); };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Data ---------- */
  const QA = [
    {
      q: 'What changed in our refund policy this quarter?',
      a: '<p>Three things changed when <b>Refund Policy v4.2</b> took effect on 1 October:</p><ul><li>The pro-rata window for annual plans went from 30 to <b>60 days</b> after renewal<sup>1</sup>.</li><li>Refunds under <b>$500</b> no longer need Finance approval — support leads can issue them directly<sup>2</sup>.</li><li>Credits now roll to the next billing cycle instead of expiring after 90 days<sup>3</sup>.</li></ul><p>Support was briefed on 3 October; the public help-centre article is still on v4.1 and should be updated<sup>2</sup>.</p>',
      src: [['file-text', 'Refund Policy v4.2 · Notion'], ['message-square', '#support-leads · 3 Oct'], ['folder', 'Finance memo Q3 · Drive']]
    },
    {
      q: 'Summarise why customers cancelled last month.',
      a: '<p>Across <b>84 cancellations</b> in October, three reasons account for most of the churn:</p><ul><li><b>Missing SSO on the Team plan</b> — cited in 31% of exit surveys, mostly 50–200 seat companies<sup>1</sup>.</li><li><b>Seat-based pricing</b> for occasional users — 24%, often with a request for viewer seats<sup>2</sup>.</li><li><b>Slow first sync</b> on large Drive workspaces — 17%, concentrated in the first week<sup>3</sup>.</li></ul><p>The remaining 28% were consolidations or company closures with no product feedback.</p>',
      src: [['file-text', 'Exit survey export · Drive'], ['ticket', 'Zendesk tag: cancellation'], ['message-square', '#cs-escalations']]
    },
    {
      q: 'Which enterprise deals are blocked on security review?',
      a: '<p>Three open deals are waiting on security, worth <b>$612k</b> in combined ARR:</p><ul><li><b>Kestrel Logistics</b> ($280k) — waiting on our pen-test summary; requested 14 Nov<sup>1</sup>.</li><li><b>Lumen Health</b> ($214k) — needs a signed BAA; Legal has the redlines<sup>2</sup>.</li><li><b>Oakline Bank</b> ($118k) — questionnaire 80% complete, data-residency answers outstanding<sup>3</sup>.</li></ul><p>Kestrel has the nearest close date, 12 December.</p>',
      src: [['database', 'Pipeline report · CRM'], ['message-square', '#deal-desk'], ['file-text', 'Security questionnaire tracker']]
    }
  ];

  const STEPS = [
    { icon: 'ticket', title: 'New ticket in Zendesk', sub: 'Trigger', lock: true, log: 'trigger <span class="hl2">zendesk.ticket.created</span> #48213 “Charged twice for annual plan”' },
    { icon: 'scan-search', title: 'Classify urgency', sub: 'Axiom · reads the ticket and account history', log: 'classify → <span class="hl2">billing / urgent</span> · confidence 0.97' },
    { icon: 'pen-line', title: 'Draft reply with citations', sub: 'Grounded in Refund Policy v4.2', log: 'draft → 142 words · 2 citations · Refund Policy v4.2 §3' },
    { icon: 'message-square', title: 'Post to #support-urgent', sub: 'Slack', log: 'slack.post → #support-urgent · delivered' },
    { icon: 'square-kanban', title: 'Create issue in Linear', sub: 'Team · Finance Ops', log: 'linear.issue.create → <span class="hl2">FIN-2291</span> · assigned to on-call' }
  ].map(s => ({ ...s, on: true }));

  const METRICS = {
    resolved: { label: 'Resolved by Axiom', title: 'Tickets resolved without a human', vals: [41, 46, 52, 55, 61, 64, 70, 74], max: 100, f: v => Math.round(v) + '%', delta: '+33 pts in eight weeks', note: 'Three in four tickets now close with a cited answer and no hand-off.' },
    time: { label: 'Response time', title: 'Median first response time', vals: [184, 160, 131, 96, 74, 52, 41, 38], max: 200, f: v => Math.round(v) + 's', delta: '−79% since week one', note: 'From three minutes to under forty seconds, at any hour.' },
    csat: { label: 'CSAT', title: 'Customer satisfaction score', vals: [4.1, 4.2, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8], max: 5, f: v => v.toFixed(1), delta: '+0.7 on a five-point scale', note: 'Faster, cited answers moved satisfaction to an all-time high.' }
  };

  const VOICES = [
    { img: 'av-amelia', name: 'Amelia Hartwell', role: 'VP Support, Northwind', quote: 'We stopped maintaining a help-desk wiki nobody read. New agents ask Axiom, get the paragraph and the source, and are answering customers on day two.', stat: '6×', label: 'faster agent onboarding' },
    { img: 'av-rafael', name: 'Rafael Domínguez', role: 'Head of RevOps, Kestrel', quote: 'The deal desk used to live in forty Slack threads. Now the answer to “what did we promise them?” takes one question and comes with receipts.', stat: '11 hrs', label: 'saved per rep each month' },
    { img: 'av-layla', name: 'Layla Nasser', role: 'CISO, Lumen Health', quote: 'It mirrors our permissions exactly and never trains on our data. It is the first AI tool that passed our security review without a single exception.', stat: '0', label: 'policy exceptions granted' },
    { img: 'av-jordan', name: 'Jordan Ellis', role: 'COO, Parallel', quote: 'Half of our internal questions were someone asking where something was. Those are simply gone, and the workflows quietly handle the follow-through.', stat: '−52%', label: 'internal tickets in a quarter' }
  ];

  const FAQ = [
    ['Does Axiom train models on our data?', 'No. Your content is used only to answer your own team\'s questions. It is never used to train shared models, and our model providers are contractually prohibited from retaining it.'],
    ['How does it handle permissions?', 'Axiom mirrors the access controls of each connected tool and checks them at query time. If someone cannot open a document in Drive, it will never appear in their answers or citations.'],
    ['What happens when it does not know the answer?', 'It says so. Every claim must be supported by a passage in your workspace; when nothing relevant is found, Axiom tells you that and suggests who might know, rather than guessing.'],
    ['Which tools can we connect?', 'More than forty, including Notion, Slack, Google Drive, Confluence, Jira, Linear, Zendesk, Salesforce, HubSpot and GitHub. Anything else can be reached through the API or a custom connector.'],
    ['How long does setup take?', 'Most teams ask their first question within five minutes of connecting a tool. A full initial sync of a mid-sized workspace usually finishes inside an hour and stays fresh from then on.'],
    ['Can we deploy it in our own cloud?', 'Yes. Enterprise customers can run Axiom in a dedicated single-tenant environment, in their own VPC, or on-premises, with EU or US data residency.']
  ];

  const PROMPTS = QA.map(x => x.q);

  /* ---------- WebGL orb ---------- */
  function initOrb() {
    const canvas = $('#orb');
    if (!window.THREE || !canvas) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return; }
    const px = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(px);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 60);
    camera.position.z = 7;
    const group = new THREE.Group();
    scene.add(group);

    const N = window.innerWidth < 760 ? 3600 : 8000, R = 1.95;
    const pos = new Float32Array(N * 3), rnd = new Float32Array(N), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = ga * i;
      pos[i * 3] = Math.cos(t) * r * R; pos[i * 3 + 1] = y * R; pos[i * 3 + 2] = Math.sin(t) * r * R;
      rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    const uniforms = { uTime: { value: 0 }, uPx: { value: px }, uA: { value: new THREE.Color('#7b5cff') }, uB: { value: new THREE.Color('#3ad6ff') }, uC: { value: new THREE.Color('#ff7ac6') } };
    const mat = new THREE.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime; uniform float uPx; attribute float aRnd; varying float vMix; varying float vAlpha;
        void main() {
          vec3 n = normalize(position);
          float w = sin(n.x * 3.2 + uTime * .7) * sin(n.y * 3.8 - uTime * .5) * sin(n.z * 3.0 + uTime * .6);
          float w2 = sin(n.y * 7.0 + uTime * 1.1 + n.x * 4.0) * .5;
          vec3 p = position + n * (w * .36 + w2 * .08 + aRnd * .06);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + aRnd * 2.4) * uPx * (7.0 / -mv.z);
          vMix = n.y * .5 + .5 + w * .55;
          vAlpha = .25 + .75 * smoothstep(-9.0, -5.2, mv.z);
        }`,
      fragmentShader: `
        uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying float vMix; varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - .5);
          float a = smoothstep(.5, .06, d);
          vec3 c = mix(uA, uB, smoothstep(.12, .58, vMix));
          c = mix(c, uC, smoothstep(.62, 1.08, vMix));
          gl_FragColor = vec4(c, a * vAlpha);
        }`
    });
    group.add(new THREE.Points(geo, mat));

    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.2, 1)), new THREE.LineBasicMaterial({ color: 0x8f7bff, transparent: true, opacity: .2 }));
    group.add(wire);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.42, 0), new THREE.MeshBasicMaterial({ color: 0x3ad6ff, wireframe: true, transparent: true, opacity: .55 }));
    group.add(core);

    const M = 900, rp = new Float32Array(M * 3);
    for (let i = 0; i < M; i++) { const a = Math.random() * Math.PI * 2, rr = 2.9 + (Math.random() - .5) * .5; rp[i * 3] = Math.cos(a) * rr; rp[i * 3 + 1] = (Math.random() - .5) * .08; rp[i * 3 + 2] = Math.sin(a) * rr; }
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
    const ring = new THREE.Points(rg, new THREE.PointsMaterial({ color: 0xa9e6ff, size: .022, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }));
    ring.rotation.set(1.15, 0, .35);
    scene.add(ring);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('pointermove', e => { mouse.tx = e.clientX / window.innerWidth - .5; mouse.ty = e.clientY / window.innerHeight - .5; }, { passive: true });
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < .9 ? 9 : 7;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let visible = true, raf = 0, t0 = performance.now(), first = true;
    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = (now - t0) / 1000;
      uniforms.uTime.value = t;
      mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
      const s = Math.min(1, window.scrollY / window.innerHeight);
      group.rotation.y = t * .12 + mouse.x * .9;
      group.rotation.x = mouse.y * .6 + s * .6;
      group.position.y = s * 1.2;
      wire.rotation.y = -t * .22; wire.rotation.x = t * .1;
      core.rotation.y = t * .5; core.rotation.z = t * .3;
      ring.rotation.z = .35 + t * .05 + mouse.x * .3;
      renderer.render(scene, camera);
      if (first) { first = false; canvas.classList.add('is-on'); }
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe($('#hero'));
    document.addEventListener('visibilitychange', kick);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); visible = false; canvas.classList.remove('is-on'); });
    kick();
  }

  /* ---------- Typing prompt ---------- */
  let promptIndex = 0;
  function initTyping() {
    const el = $('#typed');
    if (reduce) { el.textContent = PROMPTS[0]; return; }
    let i = 0, dir = 1;
    (function tick() {
      const text = PROMPTS[promptIndex];
      i += dir; el.textContent = text.slice(0, i);
      let d = dir > 0 ? 30 + Math.random() * 30 : 12;
      if (dir > 0 && i >= text.length) { dir = -1; d = 2600; }
      else if (dir < 0 && i <= 0) { dir = 1; promptIndex = (promptIndex + 1) % PROMPTS.length; d = 350; }
      setTimeout(tick, d);
    })();
  }

  /* ---------- Nav ---------- */
  function initNav() {
    const nav = $('#nav'), burger = $('#burger'), menu = $('#mmenu');
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 30);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    const setMenu = open => { menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', !open); burger.setAttribute('aria-expanded', open); document.body.classList.toggle('is-locked', open); };
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    menu.addEventListener('click', e => { if (e.target.closest('a, button')) setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1080) setMenu(false); });
    const links = $$('#navLinks a');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const s = $(a.getAttribute('href')); if (s) io.observe(s); });
    new IntersectionObserver(es => { if (es[0].isIntersecting) links.forEach(a => a.classList.remove('is-active')); }, { rootMargin: '-45% 0px -50% 0px' }).observe($('#hero'));
  }

  /* ---------- Bento spotlight ---------- */
  function initSpotlight() {
    $$('.cell').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));
  }

  /* ---------- Demo: tabs ---------- */
  let tourToken = 0;
  function moveGlider() {
    const b = $('#demoTabs button.is-active'), g = $('#tabsGlider');
    if (!b) return;
    g.style.width = b.offsetWidth + 'px'; g.style.transform = `translateX(${b.offsetLeft - 5}px)`;
  }
  function setTab(name) {
    $$('#demoTabs button').forEach(b => { const on = b.dataset.tab === name; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    $$('.pane').forEach(p => p.classList.toggle('is-active', p.dataset.pane === name));
    $('#appPath').textContent = name;
    moveGlider();
    const pane = $(`.pane[data-pane="${name}"]`);
    if (hasGsap) gsap.fromTo(pane.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', stagger: .06, clearProps: 'transform,opacity' });
    if (name === 'analyze') setMetric(metric, true);
  }

  /* ---------- Demo: ask ---------- */
  let askToken = 0;
  const chat = () => $('#chat');
  const chatDown = () => { const c = chat(); c.scrollTop = c.scrollHeight; };
  function chatEmpty() {
    chat().innerHTML = '<div class="chat-empty"><i data-lucide="sparkles"></i><b>Ask the demo workspace</b><span>Pick a question on the left or type your own. Every answer links back to its source.</span></div>';
    icons();
  }
  async function runAsk(q) {
    q = q.trim(); if (!q) return;
    const token = ++askToken;
    const known = QA.find(x => x.q.toLowerCase() === q.toLowerCase());
    $$('#askChips button').forEach(b => b.classList.toggle('is-active', !!known && b.textContent === known.q));
    const c = chat();
    const empty = $('.chat-empty', c); if (empty) empty.remove();
    c.insertAdjacentHTML('beforeend', `<div class="msg-q">${esc(q)}</div><div class="msg-a"><span class="msg-av"><i data-lucide="sparkles"></i></span><div class="msg-body"><span class="msg-think">Searching 48,210 documents across 4 sources…</span></div></div>`);
    icons(); chatDown();
    const body = $$('.msg-body', c).pop();
    await wait(950); if (token !== askToken) { body.innerHTML = '<p>Stopped.</p>'; return; }
    const html = known ? known.a : `<p>I searched the demo workspace for <b>“${esc(q)}”</b> and found nothing I can cite with confidence — so I won't guess.</p><p>In your own workspace I would search every connected tool and link each claim to the passage it came from. Try one of the suggested questions to see a fully cited answer.</p>`;
    const tokens = html.split(/(<[^>]+>|\s+)/).filter(Boolean);
    let out = '';
    for (const tk of tokens) {
      out += tk;
      if (tk[0] === '<' || !tk.trim()) continue;
      body.innerHTML = out; chatDown();
      await wait(reduce ? 0 : 24); if (token !== askToken) return;
    }
    body.innerHTML = html;
    const src = known ? known.src : [];
    body.insertAdjacentHTML('beforeend',
      (src.length ? `<div class="msg-src">${src.map((s, i) => `<span style="animation-delay:${i * .09}s"><b>${i + 1}</b><i data-lucide="${s[0]}"></i>${s[1]}</span>`).join('')}</div>` : '') +
      `<div class="msg-meta"><span>${known ? `Answered in 0.${38 + QA.indexOf(known) * 7}s · ${src.length} sources` : 'No matching sources'}</span><button data-copy><i data-lucide="copy"></i>Copy</button><button data-up><i data-lucide="thumbs-up"></i>Helpful</button></div>`);
    icons(); chatDown();
  }

  /* ---------- Demo: automate ---------- */
  let running = false;
  function renderSteps() {
    $('#flowSteps').innerHTML = STEPS.map((s, i) => `<li class="flow-step ${s.on ? '' : 'is-off'}" data-step="${i}"><span class="flow-ico"><i data-lucide="${s.icon}"></i></span><div><b>${s.title}</b><small>${s.sub}</small></div><button class="sw" role="switch" aria-checked="${s.on}" aria-label="Enable ${s.title}" ${s.lock ? 'disabled' : ''}></button></li>`).join('');
    icons();
  }
  const stamp = ms => { const s = (ms / 1000).toFixed(2); return `<time>+${s}s</time>`; };
  async function runFlow() {
    if (running) return;
    running = true;
    const btn = $('#runFlow'), state = $('#runState'), log = $('#consoleBody');
    btn.disabled = true; $('span', btn).textContent = 'Running…';
    state.textContent = 'Running'; state.className = 'is-run';
    renderSteps(); $$('.sw').forEach(s => { s.disabled = true; });
    log.innerHTML = `<p>${stamp(0)}run started · workflow <span class="hl2">escalate-urgent-tickets</span></p>`;
    let t = 0, done = 0;
    for (let i = 0; i < STEPS.length; i++) {
      const s = STEPS[i], el = $(`[data-step="${i}"]`), ico = $('.flow-ico', el);
      if (!s.on) { log.insertAdjacentHTML('beforeend', `<p class="skip">${stamp(t)}skip · ${s.title} (disabled)</p>`); continue; }
      el.classList.add('is-run'); ico.innerHTML = '<i data-lucide="loader-circle"></i>'; icons();
      const d = 420 + i * 90; await wait(reduce ? 0 : d + 180); t += d;
      el.classList.remove('is-run'); el.classList.add('is-done'); ico.innerHTML = '<i data-lucide="check"></i>'; icons();
      log.insertAdjacentHTML('beforeend', `<p>${stamp(t)}${s.log}</p>`); log.scrollTop = log.scrollHeight; done++;
    }
    log.insertAdjacentHTML('beforeend', `<p class="ok">${stamp(t + 40)}✓ completed · ${done} of ${STEPS.length} steps executed</p>`); log.scrollTop = log.scrollHeight;
    state.textContent = 'Succeeded'; state.className = 'is-ok';
    btn.disabled = false; $('span', btn).textContent = 'Run again';
    $$('.sw').forEach((s, i) => { s.disabled = !!STEPS[i].lock; });
    running = false;
  }

  /* ---------- Demo: analyze ---------- */
  let metric = 'resolved';
  function initAnalyze() {
    $('#anSeg').innerHTML = Object.entries(METRICS).map(([k, m]) => `<button data-metric="${k}" class="${k === metric ? 'is-active' : ''}">${m.label}</button>`).join('');
    $('#anChart').innerHTML = METRICS[metric].vals.map((_, i) => `<div class="an-bar" data-l="W${i + 1}" style="--h:0%"><i></i></div>`).join('');
    setMetric(metric);
  }
  let kpiTween = null;
  function setMetric(k, replay) {
    const m = METRICS[k], prev = METRICS[metric];
    metric = k;
    $$('#anSeg button').forEach(b => b.classList.toggle('is-active', b.dataset.metric === k));
    $('#anTitle').textContent = m.title;
    $('#anDelta').textContent = m.delta;
    $('#anNote').textContent = m.note;
    const bars = $$('.an-bar');
    if (replay) bars.forEach(b => b.style.setProperty('--h', '0%'));
    requestAnimationFrame(() => requestAnimationFrame(() => bars.forEach((b, i) => { b.style.setProperty('--h', (m.vals[i] / m.max * 100).toFixed(1) + '%'); b.dataset.v = m.f(m.vals[i]); })));
    const end = m.vals[m.vals.length - 1], el = $('#anValue');
    if (hasGsap && !reduce) {
      if (kpiTween) kpiTween.kill();
      const o = { v: replay ? 0 : prev.vals[prev.vals.length - 1] * (m.max / prev.max) };
      kpiTween = gsap.to(o, { v: end, duration: .9, ease: 'power3.out', onUpdate: () => { el.textContent = m.f(o.v); }, onComplete: () => { el.textContent = m.f(end); } });
    } else el.textContent = m.f(end);
  }

  function initDemo() {
    $('#askChips').innerHTML = QA.map(x => `<button>${x.q}</button>`).join('');
    chatEmpty(); renderSteps(); initAnalyze(); moveGlider();
    $('#demoTabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) { tourToken++; setTab(b.dataset.tab); } });
    $('#askChips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { tourToken++; runAsk(b.textContent); } });
    $('#askForm').addEventListener('submit', e => { e.preventDefault(); const i = $('#askInput'); if (!i.value.trim()) { i.focus(); return; } tourToken++; runAsk(i.value); i.value = ''; });
    $('#chat').addEventListener('click', e => {
      const cp = e.target.closest('[data-copy]'), up = e.target.closest('[data-up]');
      if (cp) {
        const text = cp.closest('.msg-body').cloneNode(true); $$('.msg-src, .msg-meta', text).forEach(n => n.remove());
        const done = () => { cp.innerHTML = '<i data-lucide="check"></i>Copied'; cp.classList.add('is-on'); icons(); setTimeout(() => { cp.innerHTML = '<i data-lucide="copy"></i>Copy'; cp.classList.remove('is-on'); icons(); }, 1600); };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text.innerText.trim()).then(done, done); else done();
      }
      if (up) up.classList.toggle('is-on');
    });
    $('#flowSteps').addEventListener('click', e => {
      const sw = e.target.closest('.sw'); if (!sw || sw.disabled || running) return;
      const i = +sw.closest('[data-step]').dataset.step; STEPS[i].on = !STEPS[i].on;
      sw.setAttribute('aria-checked', STEPS[i].on); sw.closest('.flow-step').classList.toggle('is-off', !STEPS[i].on);
      $$('.flow-step').forEach(el => el.classList.remove('is-done'));
    });
    $('#runFlow').addEventListener('click', () => { tourToken++; runFlow(); });
    $('#anSeg').addEventListener('click', e => { const b = e.target.closest('[data-metric]'); if (b) { tourToken++; setMetric(b.dataset.metric); } });
    $('#heroAsk').addEventListener('click', () => { tourToken++; const q = PROMPTS[promptIndex]; $('#showcase').scrollIntoView({ behavior: 'smooth' }); setTab('ask'); setTimeout(() => runAsk(q), 700); });
    $('#tourBtn').addEventListener('click', tour);
    window.addEventListener('resize', moveGlider);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveGlider);
  }

  async function tour() {
    const token = ++tourToken, alive = () => token === tourToken;
    $('#showcase').scrollIntoView({ behavior: 'smooth' });
    setTab('ask'); await wait(900); if (!alive()) return;
    chatEmpty(); await runAsk(QA[0].q); if (!alive()) return;
    await wait(2200); if (!alive()) return;
    setTab('automate'); await wait(700); if (!alive()) return;
    await runFlow(); if (!alive()) return;
    await wait(1600); if (!alive()) return;
    setTab('analyze');
    for (const k of ['time', 'csat', 'resolved']) { await wait(2200); if (!alive()) return; setMetric(k); }
  }

  /* ---------- Pricing ---------- */
  function initPricing() {
    let cur = 24;
    $('#bill').addEventListener('click', e => {
      const b = e.target.closest('[data-bill]'); if (!b || b.classList.contains('is-active')) return;
      $$('#bill button').forEach(x => x.classList.toggle('is-active', x === b));
      const annual = b.dataset.bill === 'annual', to = annual ? 19 : 24, el = $('#teamPrice');
      $('#teamNote').textContent = annual ? 'billed annually · $228 a seat' : 'billed monthly';
      if (hasGsap && !reduce) { const o = { v: cur }; gsap.to(o, { v: to, duration: .7, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } }); gsap.fromTo(el, { y: annual ? -14 : 14, opacity: .2 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', clearProps: 'all' }); }
      else el.textContent = to;
      cur = to;
    });
  }

  /* ---------- Voices ---------- */
  function initVoices() {
    const nav = $('#voiceNav');
    nav.innerHTML = VOICES.map((v, i) => `<button data-voice="${i}" aria-label="${v.name}"><i class="bar"></i><img src="assets/${v.img}.jpg" alt="" loading="lazy"><div><b>${v.name}</b><span>${v.role.split(', ')[1]}</span></div></button>`).join('');
    let cur = -1;
    function show(i) {
      if (i === cur) return; cur = i;
      const v = VOICES[i];
      $$('button', nav).forEach((b, k) => { b.classList.remove('is-active'); if (k === i) { void b.offsetWidth; b.classList.add('is-active'); } });
      const apply = () => {
        $('#voiceQuote').innerHTML = '“' + v.quote.split(' ').map(w => `<span class="w">${esc(w)}</span>`).join(' ') + '”';
        $('#voiceImg').src = `assets/${v.img}.jpg`; $('#voiceImg').alt = v.name;
        $('#voiceName').textContent = v.name; $('#voiceRole').textContent = v.role;
        $('#voiceStat').textContent = v.stat; $('#voiceStatLabel').textContent = v.label;
      };
      if (hasGsap && !reduce && $('#voiceQuote').textContent) {
        gsap.to(['#voiceQuote', '.voice-foot'], { opacity: 0, y: -10, duration: .3, ease: 'power2.in', onComplete: () => {
          apply(); gsap.set(['#voiceQuote', '.voice-foot'], { opacity: 1, y: 0 });
          gsap.from('#voiceQuote .w', { opacity: 0, y: 18, duration: .7, ease: 'power3.out', stagger: .018 });
          gsap.from('.voice-foot', { opacity: 0, y: 14, duration: .7, ease: 'power3.out', delay: .25 });
        } });
      } else apply();
    }
    nav.addEventListener('click', e => { const b = e.target.closest('[data-voice]'); if (b) show(+b.dataset.voice); });
    nav.addEventListener('animationend', e => { if (e.target.classList.contains('bar')) show((cur + 1) % VOICES.length); });
    $('#voice').addEventListener('mouseenter', () => nav.classList.add('is-paused'));
    $('#voice').addEventListener('mouseleave', () => nav.classList.remove('is-paused'));
    show(0);
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    const list = $('#faqList');
    list.innerHTML = FAQ.map(([q, a], i) => `<div class="faq-item ${i === 0 ? 'is-open' : ''}"><button class="faq-q" aria-expanded="${i === 0}"><span>${q}</span><i></i></button><div class="faq-a"><div><p>${a}</p></div></div></div>`).join('');
    list.addEventListener('click', e => {
      const q = e.target.closest('.faq-q'); if (!q) return;
      const item = q.parentElement, open = !item.classList.contains('is-open');
      $$('.faq-item', list).forEach(x => { x.classList.remove('is-open'); $('.faq-q', x).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
      if (hasST) setTimeout(() => ScrollTrigger.refresh(), 650);
    });
  }

  /* ---------- Forms & modal ---------- */
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  function initCta() {
    const form = $('#ctaForm'), msg = $('#ctaMsg'), input = $('#ctaEmail');
    input.addEventListener('input', () => { form.classList.remove('is-bad'); if (!msg.classList.contains('is-ok')) msg.textContent = ''; });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = validEmail(input.value);
      form.classList.toggle('is-bad', !ok); msg.classList.toggle('is-ok', ok);
      msg.textContent = ok ? `You're in. A workspace link is on its way to ${input.value.trim()}.` : 'Please enter a valid work email address.';
      if (ok) input.value = ''; else input.focus();
    });
  }

  let lastFocus = null;
  const MODES = {
    start: plan => ({ title: 'Create your workspace', sub: plan && plan !== 'Starter' ? `${plan} plan · 14-day trial, no card required.` : 'Free for up to three seats. No card required.', fields: '<label class="field"><span>Work email</span><input name="email" type="email" placeholder="you@company.com" autocomplete="email"><small></small></label><label class="field"><span>Company size</span><select name="size"><option>1 – 10 people</option><option>11 – 50 people</option><option selected>51 – 200 people</option><option>201 – 1,000 people</option><option>1,000+ people</option></select></label>', cta: 'Create workspace', alt: 'Already have a workspace? <button data-modal="signin">Sign in</button>', ok: ['Your workspace is ready', e => `We have sent a sign-in link to <b>${esc(e)}</b>. While you wait, the live demo runs on sample data.`] }),
    signin: () => ({ title: 'Welcome back', sub: 'Sign in to your Axiom workspace.', fields: '<label class="field"><span>Work email</span><input name="email" type="email" placeholder="you@company.com" autocomplete="email"><small></small></label><label class="field"><span>Password</span><input name="password" type="password" placeholder="At least 8 characters" autocomplete="current-password"><small></small></label>', cta: 'Sign in', alt: 'New to Axiom? <button data-modal="start">Create a workspace</button>', ok: ['Signed in to the demo', () => 'This concept runs on a sample workspace. Open the live demo to ask questions, run a workflow and explore analytics.'] }),
    demo: () => ({ title: 'Book a walkthrough', sub: 'Thirty minutes with a solutions engineer, on your own data if you like.', fields: '<label class="field"><span>Full name</span><input name="name" type="text" placeholder="Ada Lovelace" autocomplete="name"><small></small></label><label class="field"><span>Work email</span><input name="email" type="email" placeholder="you@company.com" autocomplete="email"><small></small></label>', cta: 'Request a time', alt: 'Prefer email? <a href="mailto:hello@axiom.ai" style="color:#fff;border-bottom:1px solid var(--line-2)">hello@axiom.ai</a>', ok: ['Request received', e => `A solutions engineer will write to <b>${esc(e)}</b> within one business day with a few times to choose from.`] })
  };
  function openModal(mode, plan) {
    const m = MODES[mode](plan);
    if (!$('#modal').classList.contains('is-open')) lastFocus = document.activeElement;
    $('#modalBody').innerHTML = `<h3 id="modalTitle">${m.title}</h3><p class="m-sub">${m.sub}</p><form id="mForm" novalidate>${m.fields}<button class="btn btn-grad btn-block" type="submit">${m.cta}<i data-lucide="arrow-right"></i></button></form><p class="m-alt">${m.alt}</p>`;
    icons();
    $('#modal').classList.add('is-open'); $('#modal').setAttribute('aria-hidden', 'false'); document.body.classList.add('is-locked');
    setTimeout(() => { const f = $('#mForm input'); if (f) f.focus({ preventScroll: true }); }, 80);
    $('#mForm').addEventListener('submit', e => {
      e.preventDefault();
      let bad = false;
      $$('#mForm input').forEach(i => {
        const v = i.value.trim();
        const err = i.name === 'email' ? (validEmail(v) ? '' : 'Enter a valid work email.') : i.name === 'password' ? (v.length >= 8 ? '' : 'Passwords have at least 8 characters.') : (v.length >= 2 ? '' : 'Please tell us your name.');
        i.closest('.field').classList.toggle('is-bad', !!err); $('small', i.closest('.field')).textContent = err;
        if (err && !bad) { bad = true; i.focus(); }
      });
      if (bad) return;
      const email = $('#mForm [name="email"]').value.trim();
      $('#modalBody').innerHTML = `<div class="m-ok"><span class="m-ok-ico"><i data-lucide="check"></i></span><h3 id="modalTitle">${m.ok[0]}</h3><p>${m.ok[1](email)}</p><button class="btn btn-light btn-block" id="mGo">Open the live demo<i data-lucide="arrow-right"></i></button></div>`;
      icons();
      if (hasGsap) gsap.from('.m-ok > *', { y: 16, opacity: 0, duration: .6, ease: 'power3.out', stagger: .07 });
      $('#mGo').addEventListener('click', () => { closeModal(); $('#showcase').scrollIntoView({ behavior: 'smooth' }); });
    });
  }
  function closeModal() {
    $('#modal').classList.remove('is-open'); $('#modal').setAttribute('aria-hidden', 'true');
    if (!$('#mmenu').classList.contains('is-open')) document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function initModal() {
    document.addEventListener('click', e => {
      const o = e.target.closest('[data-modal]'); if (o) { e.preventDefault(); openModal(o.dataset.modal, o.dataset.plan); return; }
      if (e.target.closest('[data-close]')) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').classList.contains('is-open')) closeModal(); });
  }

  /* ---------- Scroll effects ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (!hasGsap || reduce) { el.textContent = end.toFixed(dec); return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } });
  }
  function initScroll() {
    const steps = $$('.work-step');
    if (!hasST || reduce) {
      $$('[data-count]').forEach(countUp);
      steps.forEach(s => s.classList.add('is-on'));
      $('#workLine').style.transform = 'none';
      return;
    }
    const reveals = $$('[data-reveal], [data-split]').filter(el => !el.closest('.hero'));
    gsap.set(reveals, { opacity: 0, y: 36 });
    ScrollTrigger.batch(reveals, { start: 'top 88%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .09, clearProps: 'transform,opacity' }) });
    $$('[data-count]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) }));
    gsap.to('#workLine', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#workSteps', start: 'top 62%', end: 'bottom 62%', scrub: .5 } });
    steps.forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 62%', onEnter: () => s.classList.add('is-on'), onLeaveBack: () => s.classList.remove('is-on') }));
    gsap.from('#stepsMini li', { opacity: 0, x: -16, duration: .7, ease: 'power3.out', stagger: .22, scrollTrigger: { trigger: '#stepsMini', start: 'top 85%' } });
    gsap.to('.hero-inner', { yPercent: -8, opacity: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.app', { rotateX: 10, scale: .95, transformPerspective: 1400, transformOrigin: '50% 0', ease: 'none', scrollTrigger: { trigger: '.app', start: 'top 95%', end: 'top 45%', scrub: .6 } });
  }

  /* ---------- Intro ---------- */
  function intro() {
    const loader = $('#loader'), body = document.body;
    const heroBits = $$('.hero [data-reveal]');
    if (!hasGsap || reduce) { loader.remove(); body.classList.remove('is-loading'); return; }
    gsap.set('.hl > span', { yPercent: 115 });
    gsap.set(heroBits, { opacity: 0, y: 26 });
    gsap.set('#nav', { opacity: 0, y: -20 });
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.loader-tri', { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' })
      .to('.loader-dot', { scale: 1, duration: .5, ease: 'back.out(2.4)' }, '-=.25')
      .to(loader, { opacity: 0, duration: .5, ease: 'power2.inOut', onComplete: () => { loader.remove(); body.classList.remove('is-loading'); } }, '+=.15')
      .to('#nav', { opacity: 1, y: 0, duration: .9, clearProps: 'transform,opacity' }, '-=.2')
      .to(heroBits[0], { opacity: 1, y: 0, duration: .9, clearProps: 'transform,opacity' }, '<')
      .to('.hl > span', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .1, clearProps: 'transform' }, '<.1')
      .to(heroBits.slice(1), { opacity: 1, y: 0, duration: .9, stagger: .09, clearProps: 'transform,opacity' }, '<.35');
  }

  /* ---------- Init ---------- */
  icons();
  const track = $('#logoTrack'); track.innerHTML += track.innerHTML;
  initNav(); initSpotlight(); initDemo(); initPricing(); initVoices(); initFaq(); initCta(); initModal();
  initScroll(); initTyping(); intro();
  initOrb();
  window.addEventListener('load', () => { moveGlider(); if (hasST) ScrollTrigger.refresh(); });
})();
