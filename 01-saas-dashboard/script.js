/* Meridian — Revenue Intelligence dashboard */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  const icons = () => window.lucide && lucide.createIcons();
  const money = (v, compact = false) => compact
    ? '$' + (v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(v >= 1e5 ? 0 : 1) + 'k' : Math.round(v))
    : '$' + Math.round(v).toLocaleString('en-US');

  /* ---------- State & data ---------- */
  const state = { range: '30d', metric: 'revenue', view: 'overview', seed: 7, projFilter: 'all', notifFilter: 'all', mixMode: 'share', live: true };

  const rng = (seed) => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const makeSeries = (n, base, growth, vol, seed) => {
    const r = rng(seed); let v = base;
    return Array.from({ length: n }, () => { v = v * (1 + growth / n) + (r() - .46) * vol * base; return Math.max(v, base * .35); });
  };

  const RANGES = {
    '7d': { n: 7, step: 1, unit: 'day', caption: 'vs previous 7 days', scale: 1 },
    '30d': { n: 30, step: 1, unit: 'day', caption: 'vs previous 30 days', scale: 1 },
    '90d': { n: 13, step: 7, unit: 'day', caption: 'vs previous 90 days', scale: 7 },
    '12m': { n: 12, step: 1, unit: 'month', caption: 'vs previous 12 months', scale: 30.4 }
  };
  const METRICS = {
    revenue: { base: 10400, growth: .16, vol: .09, label: 'Revenue', goodUp: true },
    newmrr: { base: 1480, growth: .24, vol: .2, label: 'New MRR', goodUp: true },
    churn: { base: 520, growth: -.14, vol: .24, label: 'Churned MRR', goodUp: false }
  };
  const KPIS = [
    { key: 'mrr', label: 'Monthly recurring revenue', icon: 'circle-dollar-sign', fmt: v => money(v), good: 1, vals: { '7d': [342800, 1.8], '30d': [342800, 8.2], '90d': [342800, 21.4], '12m': [342800, 64.1] }, note: 'vs prior period' },
    { key: 'cust', label: 'Active customers', icon: 'building-2', fmt: v => Math.round(v).toLocaleString('en-US'), good: 1, vals: { '7d': [2847, 0.9], '30d': [2847, 4.6], '90d': [2847, 12.9], '12m': [2847, 41.2] }, note: '126 on trial' },
    { key: 'nrr', label: 'Net revenue retention', icon: 'repeat', fmt: v => v.toFixed(1) + '%', good: 1, vals: { '7d': [118.4, 0.3], '30d': [118.4, 2.1], '90d': [117.2, 3.4], '12m': [114.9, 6.8] }, note: 'Target 115%' },
    { key: 'churn', label: 'Logo churn rate', icon: 'user-minus', fmt: v => v.toFixed(2) + '%', good: -1, vals: { '7d': [1.92, -0.1], '30d': [1.92, -0.4], '90d': [2.05, -0.7], '12m': [2.31, -1.2] }, note: '11 accounts lost' }
  ];
  const PLANS = [
    { name: 'Enterprise', seats: '64 accounts', share: 46, c: '#7b7cff' },
    { name: 'Scale', seats: '312 accounts', share: 31, c: '#3fcf8e' },
    { name: 'Growth', seats: '1,104 accounts', share: 17, c: '#f0a93b' },
    { name: 'Starter', seats: '1,367 accounts', share: 6, c: '#ef6f9a' }
  ];
  const ARR = 4113600;
  const PEOPLE = {
    marco: ['Marco Bellini', 'av-marco'], sofia: ['Sofia Alvarez', 'av-sofia'], daniel: ['Daniel Reyes', 'av-daniel'], nora: ['Nora Lindqvist', 'av-nora'],
    arjun: ['Arjun Mehta', 'av-arjun'], maya: ['Maya Thompson', 'av-maya'], ethan: ['Ethan Cole', 'av-ethan'], marcus: ['Marcus Greene', 'av-marcus'], elena: ['Elena Marsh', 'av-elena']
  };
  const av = k => `assets/${PEOPLE[k][1]}.jpg`;
  let projects = [
    { name: 'Billing v3 migration', team: 'Platform', status: 'On track', pct: 72, lead: 'marco', due: 'Dec 04', icon: 'credit-card', c: '#7b7cff' },
    { name: 'Self-serve onboarding', team: 'Growth', status: 'On track', pct: 88, lead: 'sofia', due: 'Nov 28', icon: 'rocket', c: '#3fcf8e' },
    { name: 'Usage-based pricing', team: 'Monetization', status: 'At risk', pct: 41, lead: 'daniel', due: 'Dec 12', icon: 'gauge', c: '#f0a93b' },
    { name: 'SOC 2 Type II renewal', team: 'Security', status: 'On track', pct: 64, lead: 'nora', due: 'Jan 15', icon: 'shield-check', c: '#5cc8f0' },
    { name: 'Churn prediction model', team: 'Data', status: 'At risk', pct: 35, lead: 'arjun', due: 'Dec 19', icon: 'brain-circuit', c: '#ef6f9a' },
    { name: 'Partner API v2', team: 'Platform', status: 'Shipped', pct: 100, lead: 'maya', due: 'Nov 14', icon: 'plug', c: '#9d9eff' },
    { name: 'Annual plan upsell flow', team: 'Growth', status: 'Shipped', pct: 100, lead: 'ethan', due: 'Nov 06', icon: 'badge-percent', c: '#3fcf8e' },
    { name: 'EU data residency', team: 'Infrastructure', status: 'On track', pct: 57, lead: 'marcus', due: 'Jan 30', icon: 'globe', c: '#5cc8f0' }
  ];
  let feed = [
    { who: 'marco', html: 'merged <code>billing/proration-fix</code> into main', time: '4 min ago' },
    { who: 'sofia', html: 'rolled the onboarding checklist out to <b>25%</b> of new signups', time: '18 min ago' },
    { who: 'daniel', html: 'flagged <b>Usage-based pricing</b> as at risk', time: '42 min ago' },
    { who: 'nora', html: 'uploaded 14 evidence files to <b>SOC 2 Type II renewal</b>', time: '1 hr ago' },
    { who: 'maya', html: 'closed <b>Partner API v2</b> — shipped to all tenants', time: '3 hr ago' },
    { who: 'arjun', html: 'shared a holdout analysis in <b>Churn prediction model</b>', time: '5 hr ago' }
  ];
  const livePool = [
    { who: 'ethan', html: 'attached 3 new mocks to <b>Annual plan upsell flow</b>' },
    { who: 'marcus', html: 'provisioned the <code>eu-central-1</code> replica for <b>EU data residency</b>' },
    { who: 'sofia', html: 'moved activation rate target to <b>46%</b>' },
    { who: 'marco', html: 'opened pull request <code>#4182</code> · Invoice rounding' },
    { who: 'nora', html: 'resolved 6 audit findings in <b>SOC 2 Type II renewal</b>' },
    { who: 'arjun', html: 'retrained the churn model — AUC <b>0.87</b>' }
  ];
  let team = [
    { k: 'marco', role: 'Staff Engineer · Platform', status: 'online', load: 78 },
    { k: 'sofia', role: 'Growth Lead', status: 'online', load: 64 },
    { k: 'daniel', role: 'Head of Monetization', status: 'away', load: 91 },
    { k: 'nora', role: 'Security & Compliance', status: 'online', load: 52 },
    { k: 'arjun', role: 'Data Scientist', status: 'online', load: 70 },
    { k: 'maya', role: 'Engineering Manager', status: 'offline', load: 45 }
  ];
  let notifs = [
    { id: 1, icon: 'credit-card', tone: 'amber', html: '<b>Hartwell Logistics</b> payment failed — the $18,400 annual renewal retries tomorrow.', time: '6 min ago', read: false },
    { id: 2, icon: 'at-sign', tone: 'accent', html: '<b>Sofia Alvarez</b> mentioned you in <b>Self-serve onboarding</b>: “Can you sign off on the checklist copy?”', time: '24 min ago', read: false, mention: true },
    { id: 3, icon: 'trending-up', tone: 'green', html: '<b>Expansion signal</b> — Brightline Health crossed 80% seat utilisation.', time: '1 hr ago', read: false },
    { id: 4, icon: 'triangle-alert', tone: 'red', html: '<b>Churn risk</b> rose for 3 accounts on the Growth plan.', time: '2 hr ago', read: false },
    { id: 5, icon: 'check-circle-2', tone: 'green', html: '<b>Partner API v2</b> was marked as shipped by Maya Thompson.', time: '3 hr ago', read: true },
    { id: 6, icon: 'at-sign', tone: 'accent', html: '<b>Daniel Reyes</b> mentioned you in <b>Usage-based pricing</b>: “Need a call on metering before Friday.”', time: 'Yesterday', read: true, mention: true },
    { id: 7, icon: 'file-text', tone: 'accent', html: 'Your <b>October board report</b> is ready to export.', time: 'Yesterday', read: true }
  ];

  /* ---------- Toast ---------- */
  function toast(msg, icon = 'check-circle-2') {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i data-lucide="${icon}"></i><span>${msg}</span>`;
    $('#toasts').appendChild(t); icons();
    if (hasGsap) {
      gsap.from(t, { y: 16, opacity: 0, duration: .35, ease: 'power3.out' });
      gsap.to(t, { opacity: 0, y: -8, duration: .3, delay: 2.6, onComplete: () => t.remove() });
    } else setTimeout(() => t.remove(), 2800);
  }

  /* ---------- Labels ---------- */
  function buildLabels(range) {
    const { n, step, unit } = RANGES[range];
    const now = new Date(); const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now);
      if (unit === 'month') { d.setDate(1); d.setMonth(d.getMonth() - i); out.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', " '")); }
      else { d.setDate(d.getDate() - i * step); out.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })); }
    }
    return out;
  }
  function getData() {
    const R = RANGES[state.range], M = METRICS[state.metric];
    const seed = state.seed * 31 + state.range.length * 17 + state.metric.length * 5 + R.n;
    const cur = makeSeries(R.n, M.base * R.scale, M.growth, M.vol, seed);
    const prev = makeSeries(R.n, M.base * R.scale * (1 - M.growth * .62), M.growth * .7, M.vol, seed + 99);
    return { cur, prev, labels: buildLabels(state.range) };
  }

  /* ---------- KPIs ---------- */
  function sparkPath(vals, w, h) {
    const min = Math.min(...vals), max = Math.max(...vals);
    return vals.map((v, i) => `${i ? 'L' : 'M'}${(i / (vals.length - 1) * w).toFixed(1)},${(h - 3 - (v - min) / (max - min || 1) * (h - 6)).toFixed(1)}`).join(' ');
  }
  function renderKpis(animate = true) {
    const wrap = $('#kpis');
    wrap.innerHTML = KPIS.map((k, i) => {
      const [val, d] = k.vals[state.range];
      const good = d * k.good >= 0;
      const up = d >= 0;
      const s = makeSeries(16, 100, .3 * Math.sign(d), .1, state.seed * 13 + i * 7 + state.range.length);
      const path = sparkPath(s, 92, 34);
      const col = good ? 'var(--green)' : 'var(--red)';
      return `<article class="kpi">
        <div class="kpi-top"><i data-lucide="${k.icon}"></i>${k.label}</div>
        <div class="kpi-val" data-val="${val}" data-i="${i}">${k.fmt(val)}</div>
        <div class="kpi-bot"><span class="delta ${good ? 'up' : 'down'}"><i data-lucide="${up ? 'arrow-up-right' : 'arrow-down-right'}"></i>${Math.abs(d).toFixed(1)}%</span><span>${k.note}</span></div>
        <svg class="kpi-spark" viewBox="0 0 92 34" fill="none"><defs><linearGradient id="sg${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".28"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><path d="${path} L92,34 L0,34 Z" fill="url(#sg${i})"/><path class="spark-line" d="${path}" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </article>`;
    }).join('');
    icons();
    if (animate && hasGsap) {
      $$('.kpi-val', wrap).forEach(el => {
        const k = KPIS[+el.dataset.i], o = { v: +el.dataset.val * .82 };
        gsap.to(o, { v: +el.dataset.val, duration: 1.1, ease: 'power3.out', onUpdate: () => el.textContent = k.fmt(o.v) });
      });
      $$('.spark-line', wrap).forEach(p => { const L = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out' }); });
    }
  }

  /* ---------- Chart ---------- */
  const smooth = pts => {
    let d = `M${pts[0][0]},${pts[0][1]}`; const t = .17;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) * t},${p1[1] + (p2[1] - p0[1]) * t} ${p2[0] - (p3[0] - p1[0]) * t},${p2[1] - (p3[1] - p1[1]) * t} ${p2[0]},${p2[1]}`;
    }
    return d;
  };
  const niceMax = v => { const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
  let chartGeo = null;
  function drawChart(animate = true) {
    const box = $('#chart'), svg = $('#chartSvg');
    if (!box.offsetParent) return;
    const W = box.clientWidth - 16, H = box.clientHeight;
    const pad = { l: 48, r: 14, t: 16, b: 30 };
    const data = getData(); const { cur, prev, labels } = data;
    const max = niceMax(Math.max(...cur, ...prev) * 1.04);
    const x = i => pad.l + i * (W - pad.l - pad.r) / (cur.length - 1);
    const y = v => pad.t + (1 - v / max) * (H - pad.t - pad.b);
    const pc = cur.map((v, i) => [x(i), y(v)]), pp = prev.map((v, i) => [x(i), y(v)]);
    const line = smooth(pc), base = H - pad.b;
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const v = max * i / 4, yy = y(v);
      g += `<line class="grid-line" x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}"/><text class="axis" x="${pad.l - 10}" y="${yy + 3.5}" text-anchor="end">${money(v, true)}</text>`;
    }
    const every = Math.max(1, Math.ceil(labels.length / 7));
    labels.forEach((l, i) => { if ((labels.length - 1 - i) % every === 0) g += `<text class="axis" x="${x(i)}" y="${H - 8}" text-anchor="${i === labels.length - 1 ? 'end' : 'middle'}">${l}</text>`; });
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = `<defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".3"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${g}
      <path class="line-b" d="${smooth(pp)}"/>
      <path class="area" d="${line} L${x(cur.length - 1)},${base} L${x(0)},${base} Z" fill="url(#area)"/>
      <path class="line-a" d="${line}"/>
      <line class="cross" y1="${pad.t}" y2="${base}" opacity="0"/>
      <circle class="dot" r="4.5" opacity="0"/>`;
    chartGeo = { x, y, data, W, H, pad };

    const sumC = cur.reduce((a, b) => a + b, 0), sumP = prev.reduce((a, b) => a + b, 0);
    const d = (sumC - sumP) / sumP * 100, M = METRICS[state.metric];
    const good = (d >= 0) === M.goodUp;
    const totalEl = $('#chartTotal'), deltaEl = $('#chartDelta');
    deltaEl.className = 'delta ' + (good ? 'up' : 'down');
    deltaEl.innerHTML = `<i data-lucide="${d >= 0 ? 'arrow-up-right' : 'arrow-down-right'}"></i>${Math.abs(d).toFixed(1)}%`;
    $('#chartCaption').textContent = RANGES[state.range].caption;
    $('#forecast').textContent = money(cur[cur.length - 1] * 30.4 / RANGES[state.range].scale * (M.goodUp ? 1.04 : .94), true);
    icons();
    if (animate && hasGsap) {
      const la = $('.line-a', svg), L = la.getTotalLength();
      gsap.fromTo(la, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' });
      gsap.fromTo($('.area', svg), { opacity: 0 }, { opacity: 1, duration: .9, delay: .45 });
      gsap.fromTo($('.line-b', svg), { opacity: 0 }, { opacity: .7, duration: .8 });
      const o = { v: sumC * .8 };
      gsap.to(o, { v: sumC, duration: 1, ease: 'power3.out', onUpdate: () => totalEl.textContent = money(o.v) });
    } else totalEl.textContent = money(sumC);
  }
  function chartHover(e) {
    if (!chartGeo) return;
    const svg = $('#chartSvg'), rect = svg.getBoundingClientRect(), { x, y, data, W, pad } = chartGeo;
    const mx = (e.clientX - rect.left) / rect.width * W;
    const n = data.cur.length;
    const i = Math.max(0, Math.min(n - 1, Math.round((mx - pad.l) / ((W - pad.l - pad.r) / (n - 1)))));
    const cx = x(i), cy = y(data.cur[i]);
    const cross = $('.cross', svg), dot = $('.dot', svg), tip = $('#chartTip');
    cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('opacity', 1);
    dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); dot.setAttribute('opacity', 1);
    const diff = (data.cur[i] - data.prev[i]) / data.prev[i] * 100;
    $('small', tip).textContent = data.labels[i];
    $('strong', tip).textContent = money(data.cur[i]);
    $('span', tip).textContent = `${diff >= 0 ? '+' : '−'}${Math.abs(diff).toFixed(1)}% vs previous`;
    const px = cx / W * rect.width + 8, flip = px > rect.width - 170;
    tip.style.transform = `translate(${flip ? px - 160 : px + 14}px, ${Math.max(0, cy / chartGeo.H * rect.height - 30)}px)`;
    tip.style.opacity = 1;
  }

  /* ---------- Plan mix ---------- */
  function renderMix() {
    const C = 2 * Math.PI * 50; let off = 0;
    $('#mixSvg').innerHTML = `<circle class="track" cx="60" cy="60" r="50"/>` + PLANS.map((p, i) => {
      const len = C * p.share / 100, s = `<circle class="seg-arc" data-i="${i}" cx="60" cy="60" r="50" stroke="${p.c}" stroke-dasharray="${Math.max(len - 7, 1)} ${C}" stroke-dashoffset="${-off - 3.5}"/>`;
      off += len; return s;
    }).join('');
    $('#mixList').innerHTML = PLANS.map((p, i) => `<li data-i="${i}"><i style="--c:${p.c}"></i><span>${p.name}</span><small>${p.seats}</small><b>${state.mixMode === 'share' ? p.share + '%' : money(ARR * p.share / 100, true)}</b></li>`).join('');
    const focus = i => {
      $('.mix-ring').classList.toggle('has-focus', i != null);
      $$('.seg-arc').forEach(a => a.classList.toggle('is-focus', +a.dataset.i === i));
      $$('#mixList li').forEach(a => a.classList.toggle('is-focus', +a.dataset.i === i));
      $('.mix-center small').textContent = i == null ? 'ARR' : PLANS[i].name;
      $('#mixTotal').textContent = money(i == null ? ARR : ARR * PLANS[i].share / 100, true);
    };
    $$('.seg-arc, #mixList li').forEach(el => {
      el.addEventListener('mouseenter', () => focus(+el.dataset.i));
      el.addEventListener('mouseleave', () => focus(null));
    });
  }

  /* ---------- Projects ---------- */
  const pillClass = s => s === 'On track' ? 'ok' : s === 'At risk' ? 'risk' : 'done';
  function renderProjects(animate = false) {
    const list = projects.filter(p => state.projFilter === 'all' || p.status === state.projFilter);
    $('#projBody').innerHTML = list.length ? list.map(p => `<tr data-name="${p.name}">
      <td><div class="proj"><span class="proj-ic" style="--c:${p.c}"><i data-lucide="${p.icon}"></i></span><div><strong>${p.name}</strong><small>${p.team}</small></div></div></td>
      <td><span class="pill ${pillClass(p.status)}">${p.status}</span></td>
      <td><div class="prog"><div class="prog-bar"><span style="width:${p.pct}%;--c:${p.status === 'At risk' ? 'var(--amber)' : p.status === 'Shipped' ? 'var(--green)' : 'var(--accent)'}"></span></div><em>${p.pct}%</em></div></td>
      <td><div class="lead"><img src="${av(p.lead)}" alt="">${PEOPLE[p.lead][0]}</div></td>
      <td class="t-right"><span class="due">${p.due}</span></td></tr>`).join('')
      : `<tr class="empty-row"><td colspan="5">No projects match this filter.</td></tr>`;
    $('#projCount').textContent = projects.length; $('#navProjects').textContent = projects.length;
    icons();
    if (animate && hasGsap) {
      gsap.from('#projBody tr', { opacity: 0, y: 8, duration: .35, stagger: .035, ease: 'power2.out' });
      gsap.from('#projBody .prog-bar span', { scaleX: 0, duration: .8, stagger: .035, ease: 'power3.out' });
    }
  }
  function openProject(name) {
    const p = projects.find(x => x.name === name); if (!p) return;
    openModal(p.name, `
      <p>${p.team} · led by ${PEOPLE[p.lead][0]} · due ${p.due}</p>
      <div class="set-row"><div><strong>Status</strong><small>Reported by the project lead</small></div><span class="pill ${pillClass(p.status)}">${p.status}</span></div>
      <div class="set-row"><div><strong>Progress</strong><small>Milestones completed</small></div><div class="prog" style="width:180px"><div class="prog-bar"><span style="width:${p.pct}%"></span></div><em>${p.pct}%</em></div></div>
      <div class="modal-actions"><button class="btn btn-ghost" data-close>Close</button>${p.status !== 'Shipped' ? '<button class="btn btn-primary" id="shipIt"><i data-lucide="check"></i>Mark as shipped</button>' : ''}</div>`);
    const b = $('#shipIt');
    if (b) b.onclick = () => { p.status = 'Shipped'; p.pct = 100; renderProjects(true); closeAll(); pushFeed({ who: 'elena', html: `marked <b>${p.name}</b> as shipped` }); toast(`${p.name} marked as shipped`); };
  }
  function flashProject(name) {
    state.projFilter = 'all'; $$('#projTabs button').forEach(b => b.classList.toggle('is-active', b.dataset.status === 'all'));
    renderProjects();
    setView('projects');
    setTimeout(() => {
      const row = $$('#projBody tr').find(r => r.dataset.name === name);
      if (row) { row.classList.remove('is-flash'); void row.offsetWidth; row.classList.add('is-flash'); row.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }, 380);
  }

  /* ---------- Feed / team / notifications ---------- */
  function renderFeed() {
    $('#feed').innerHTML = feed.slice(0, 7).map(f => `<li><img src="${av(f.who)}" alt=""><div><p><b>${PEOPLE[f.who][0]}</b> ${f.html}</p><small>${f.time}</small></div></li>`).join('');
  }
  function pushFeed(item) {
    feed.unshift({ ...item, time: 'Just now' }); renderFeed();
    const first = $('#feed li');
    if (hasGsap && first) gsap.from(first, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: .5, ease: 'power3.out' });
    $('#refreshed').textContent = 'just now';
  }
  function renderTeam() {
    $('#team').innerHTML = team.map(m => `<li>
      <span class="team-av">${m.k ? `<img src="${av(m.k)}" alt="">` : `<span class="team-init">${m.name[0].toUpperCase()}</span>`}<i class="${m.status}"></i></span>
      <div><strong>${m.k ? PEOPLE[m.k][0] : m.name}</strong><small>${m.role}</small></div>
      ${m.pending ? '<span class="pill risk" style="margin-left:auto">Invited</span>' : `<span class="team-load"><div class="prog-bar"><span style="width:${m.load}%;--c:${m.load > 85 ? 'var(--amber)' : 'var(--accent)'}"></span></div>${m.load}%</span>`}
    </li>`).join('');
    $('#onlineCount').textContent = team.filter(m => m.status === 'online').length;
  }
  function renderNotifs() {
    const tone = t => t === 'accent' ? '' : `style="--c:var(--${t});--c-soft:var(--${t}-soft)"`;
    const item = n => `<li class="notif ${n.read ? 'is-read' : ''}" data-id="${n.id}"><span class="notif-ic" ${tone(n.tone)}><i data-lucide="${n.icon}"></i></span><div><p>${n.html}</p><small>${n.time}</small></div><span class="notif-dot"></span></li>`;
    const f = state.notifFilter;
    const list = notifs.filter(n => f === 'all' || (f === 'unread' && !n.read) || (f === 'mentions' && n.mention));
    $('#notifList').innerHTML = list.length ? list.map(item).join('') : `<li class="notif-empty">You’re all caught up.</li>`;
    $('#inboxList').innerHTML = notifs.slice(0, 6).map(item).join('');
    const unread = notifs.filter(n => !n.read).length;
    $('#unreadCount').textContent = unread; $('#unreadCount').style.display = unread ? '' : 'none';
    $('#navInbox').textContent = unread || '';
    $('#bellDot').classList.toggle('is-off', !unread);
    icons();
  }
  document.addEventListener('click', e => {
    const n = e.target.closest('.notif'); if (!n) return;
    const item = notifs.find(x => x.id === +n.dataset.id);
    if (item && !item.read) { item.read = true; renderNotifs(); }
  });
  const markAll = () => { notifs.forEach(n => n.read = true); renderNotifs(); toast('All notifications marked as read'); };

  /* ---------- Views ---------- */
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
  const VIEWS = {
    overview: [() => `${greeting()}, Elena`, 'Net new MRR is pacing <b>12.4% ahead</b> of plan. Three renewals need attention this week.'],
    revenue: [() => 'Revenue', 'Recurring revenue, expansion and churn across every plan and segment.'],
    projects: [() => 'Projects', 'Every initiative in flight, who is leading it and when it lands.'],
    team: [() => 'Team', 'Who is online, what they own and how much they are carrying.'],
    activity: [() => 'Activity', 'A live stream of everything happening in your workspace.'],
    inbox: [() => 'Inbox', 'Signals from billing, product and support that need a response.']
  };
  function setView(view, instant = false) {
    if (!VIEWS[view]) return;
    const prev = state.view; state.view = view;
    $$('.nav-item[data-view]').forEach(b => b.classList.toggle('is-active', b.dataset.view === view));
    $('#crumb').textContent = view[0].toUpperCase() + view.slice(1);
    closeSidebar();
    const apply = () => {
      $('#grid').dataset.view = view;
      $$('#grid > [data-views]').forEach(p => p.classList.toggle('is-hidden', !p.dataset.views.split(' ').includes(view)));
      $('#viewTitle').textContent = VIEWS[view][0]();
      $('#viewSub').innerHTML = VIEWS[view][1];
      $('#content').scrollTo({ top: 0 }); window.scrollTo({ top: 0 });
      drawChart(true);
    };
    if (instant || !hasGsap || prev === view) { apply(); return; }
    gsap.to(['.welcome', '#grid'], {
      opacity: 0, y: 6, duration: .16, ease: 'power1.in', onComplete: () => {
        apply();
        gsap.set(['.welcome', '#grid'], { opacity: 1, y: 0 });
        gsap.from(['.welcome', ...$$('#grid > [data-views]:not(.is-hidden)')], { opacity: 0, y: 14, duration: .45, stagger: .05, ease: 'power3.out', clearProps: 'all' });
      }
    });
  }

  /* ---------- Segmented control ---------- */
  function moveThumb() {
    const a = $('#rangeSeg .is-active'), t = $('.seg-thumb');
    if (!a) return; t.style.width = a.offsetWidth + 'px'; t.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  function setRange(r) {
    state.range = r;
    $$('#rangeSeg button').forEach(x => x.classList.toggle('is-active', x.dataset.range === r));
    moveThumb(); renderKpis(); drawChart();
  }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('meridian-theme', t); } catch (e) { /* storage unavailable */ }
    const sw = $('#swTheme'); if (sw) sw.classList.toggle('is-on', t === 'dark');
  }
  const toggleTheme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

  /* ---------- Overlays ---------- */
  const scrim = $('#scrim');
  function closeAll() {
    $$('.cmdk, .modal, .popover, .ws-menu').forEach(el => el.classList.remove('is-open'));
    scrim.classList.remove('is-open'); closeSidebar(false);
    $('#bellBtn').setAttribute('aria-expanded', 'false'); $('#wsBtn').setAttribute('aria-expanded', 'false');
  }
  function closeSidebar(keepScrim) { $('#sidebar').classList.remove('is-open'); if (keepScrim === undefined && !$('.cmdk.is-open, .modal.is-open')) scrim.classList.remove('is-open'); }
  function openModal(title, html) {
    closeAll();
    $('#modalTitle').textContent = title; $('#modalBody').innerHTML = html; icons();
    $('#modal').classList.add('is-open'); scrim.classList.add('is-open');
    const f = $('#modalBody input'); if (f) setTimeout(() => f.focus(), 60);
  }
  scrim.addEventListener('click', closeAll);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeAll();
    if (!e.target.closest('.pop-wrap')) { $('#notifPop').classList.remove('is-open'); $('#bellBtn').setAttribute('aria-expanded', 'false'); }
    if (!e.target.closest('.ws')) $('#wsMenu').classList.remove('is-open');
  });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeAll(); });
  $('#cmdk').addEventListener('click', e => { if (e.target.id === 'cmdk') closeAll(); });

  const leadOptions = Object.keys(PEOPLE).filter(k => k !== 'elena').map(k => `<option value="${k}">${PEOPLE[k][0]}</option>`).join('');
  function newProjectModal() {
    openModal('New project', `
      <p>Projects group revenue work so progress shows up on the overview.</p>
      <form id="projForm" novalidate>
        <div class="field"><label for="pName">Project name</label><input id="pName" placeholder="e.g. Multi-currency invoicing" autocomplete="off"></div>
        <div class="field-row">
          <div class="field"><label for="pTeam">Team</label><select id="pTeam"><option>Platform</option><option>Growth</option><option>Monetization</option><option>Data</option><option>Security</option></select></div>
          <div class="field"><label for="pLead">Lead</label><select id="pLead">${leadOptions}</select></div>
        </div>
        <div class="field"><label for="pDue">Due date</label><input id="pDue" type="date"></div>
        <div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary"><i data-lucide="plus"></i>Create project</button></div>
      </form>`);
    const d = new Date(); d.setDate(d.getDate() + 30); $('#pDue').value = d.toISOString().slice(0, 10);
    $('#projForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#pName').value.trim();
      if (!name) { $('#pName').parentElement.classList.add('is-error'); $('#pName').focus(); return; }
      const due = new Date($('#pDue').value || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      projects.unshift({ name, team: $('#pTeam').value, status: 'On track', pct: 0, lead: $('#pLead').value, due, icon: 'folder', c: '#7b7cff' });
      closeAll(); pushFeed({ who: 'elena', html: `created the project <b>${name}</b>` });
      flashProject(name); toast(`Project “${name}” created`);
    });
  }
  function inviteModal() {
    openModal('Invite a teammate', `
      <p>They will get an email with a link to join Northwind Cloud.</p>
      <form id="invForm" novalidate>
        <div class="field"><label for="iEmail">Work email</label><input id="iEmail" type="email" placeholder="name@northwind.cloud" autocomplete="off"></div>
        <div class="field"><label for="iRole">Role</label><select id="iRole"><option>Member</option><option>Admin</option><option>Billing manager</option><option>Viewer</option></select></div>
        <div class="modal-actions"><button type="button" class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary"><i data-lucide="send"></i>Send invite</button></div>
      </form>`);
    $('#invForm').addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#iEmail').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#iEmail').parentElement.classList.add('is-error'); $('#iEmail').focus(); return; }
      team.push({ name: email, role: $('#iRole').value + ' · invitation sent', status: 'offline', pending: true });
      renderTeam(); closeAll(); toast(`Invitation sent to ${email}`, 'send');
    });
  }
  function settingsModal() {
    const dark = document.documentElement.dataset.theme === 'dark';
    openModal('Settings', `
      <div class="set-row"><div><strong>Dark appearance</strong><small>Easier on the eyes for long sessions</small></div><button class="switch ${dark ? 'is-on' : ''}" id="swTheme" aria-label="Dark appearance"></button></div>
      <div class="set-row"><div><strong>Compact density</strong><small>Tighter rows in tables and lists</small></div><button class="switch ${document.body.classList.contains('is-compact') ? 'is-on' : ''}" id="swCompact" aria-label="Compact density"></button></div>
      <div class="set-row"><div><strong>Live activity</strong><small>Stream workspace events as they happen</small></div><button class="switch ${state.live ? 'is-on' : ''}" id="swLive" aria-label="Live activity"></button></div>
      <div class="modal-actions"><button class="btn btn-primary" data-close>Done</button></div>`);
    $('#swTheme').onclick = toggleTheme;
    $('#swCompact').onclick = e => { e.currentTarget.classList.toggle('is-on'); document.body.classList.toggle('is-compact'); };
    $('#swLive').onclick = e => { state.live = !state.live; e.currentTarget.classList.toggle('is-on', state.live); $('.live').style.opacity = state.live ? 1 : .35; };
  }
  function helpModal() {
    openModal('Keyboard shortcuts', `<ul class="keys">
      <li>Open command menu <span><kbd>Ctrl</kbd> <kbd>K</kbd></span></li>
      <li>Switch view <span><kbd>1</kbd> – <kbd>6</kbd></span></li>
      <li>New project <span><kbd>N</kbd></span></li>
      <li>Toggle theme <span><kbd>T</kbd></span></li>
      <li>Close any dialog <span><kbd>Esc</kbd></span></li></ul>
      <div class="modal-actions"><button class="btn btn-primary" data-close>Got it</button></div>`);
  }
  let currentPlan = 'Scale';
  function planModal() {
    const plans = [['Growth', 'Up to $1M tracked revenue', '$490/mo'], ['Scale', 'Up to $5M tracked revenue', '$1,450/mo'], ['Enterprise', 'Unlimited revenue, SSO and audit log', 'Custom']];
    openModal('Review plan', `<p>You are tracking $4.1M of the $5M included in your plan.</p>` + plans.map(p => `<div class="plan-card ${p[0] === currentPlan ? 'is-current' : ''}"><div><strong>${p[0]}</strong><small>${p[1]}</small></div><div style="display:flex;align-items:center;gap:12px"><b>${p[2]}</b>${p[0] === currentPlan ? '<span class="pill done">Current</span>' : `<button class="btn btn-ghost btn-sm" data-plan="${p[0]}">Switch</button>`}</div></div>`).join(''));
    $$('[data-plan]').forEach(b => b.onclick = () => { currentPlan = b.dataset.plan; $('.ws-meta small').textContent = `${currentPlan} plan · 48 seats`; closeAll(); toast(`Plan changed to ${currentPlan}`); });
  }
  function exportCsv() {
    const { cur, prev, labels } = getData();
    const csv = 'period,current,previous\n' + labels.map((l, i) => `"${l}",${cur[i].toFixed(2)},${prev[i].toFixed(2)}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `meridian-${state.metric}-${state.range}.csv`; a.click(); URL.revokeObjectURL(a.href);
    toast(`Exported ${METRICS[state.metric].label.toLowerCase()} · ${state.range.toUpperCase()}`, 'download');
  }

  /* ---------- Command palette ---------- */
  const COMMANDS = [
    ...Object.keys(VIEWS).map((v, i) => ({ g: 'Navigate', label: `Go to ${v[0].toUpperCase() + v.slice(1)}`, icon: 'arrow-right', hint: String(i + 1), run: () => setView(v) })),
    { g: 'Actions', label: 'Create new project', icon: 'plus', hint: 'N', run: newProjectModal },
    { g: 'Actions', label: 'Invite a teammate', icon: 'user-plus', run: inviteModal },
    { g: 'Actions', label: 'Export current chart as CSV', icon: 'download', run: exportCsv },
    { g: 'Actions', label: 'Mark all notifications as read', icon: 'check-check', run: markAll },
    { g: 'Preferences', label: 'Toggle light / dark theme', icon: 'sun-moon', hint: 'T', run: toggleTheme },
    { g: 'Preferences', label: 'Open settings', icon: 'settings', run: settingsModal },
    ...Object.keys(RANGES).map(r => ({ g: 'Date range', label: `Show last ${r.toUpperCase()}`, icon: 'calendar', run: () => setRange(r) }))
  ];
  let cmdSel = 0, cmdShown = [];
  function renderCmd() {
    const q = $('#cmdInput').value.trim().toLowerCase();
    cmdShown = COMMANDS.filter(c => !q || c.label.toLowerCase().includes(q) || c.g.toLowerCase().includes(q));
    cmdSel = Math.min(cmdSel, Math.max(0, cmdShown.length - 1));
    let g = '', html = '';
    cmdShown.forEach((c, i) => {
      if (c.g !== g) { g = c.g; html += `<li class="cmdk-group">${g}</li>`; }
      html += `<li class="cmdk-item ${i === cmdSel ? 'is-sel' : ''}" data-i="${i}"><i data-lucide="${c.icon}"></i>${c.label}${c.hint ? `<small>${c.hint}</small>` : ''}</li>`;
    });
    $('#cmdList').innerHTML = html || `<li class="notif-empty">No results for “${q}”.</li>`;
    icons();
    const sel = $('.cmdk-item.is-sel'); if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openCmd() { closeAll(); $('#cmdInput').value = ''; cmdSel = 0; renderCmd(); $('#cmdk').classList.add('is-open'); scrim.classList.add('is-open'); setTimeout(() => $('#cmdInput').focus(), 40); }
  const runCmd = i => { const c = cmdShown[i]; if (!c) return; closeAll(); c.run(); };
  $('#cmdInput').addEventListener('input', () => { cmdSel = 0; renderCmd(); });
  $('#cmdList').addEventListener('click', e => { const it = e.target.closest('.cmdk-item'); if (it) runCmd(+it.dataset.i); });
  $('#cmdList').addEventListener('mousemove', e => { const it = e.target.closest('.cmdk-item'); if (it && +it.dataset.i !== cmdSel) { cmdSel = +it.dataset.i; $$('.cmdk-item').forEach(x => x.classList.toggle('is-sel', x === it)); } });

  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#cmdk').classList.contains('is-open') ? closeAll() : openCmd(); return; }
    if (e.key === 'Escape') { closeAll(); return; }
    if ($('#cmdk').classList.contains('is-open')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); cmdSel = (cmdSel + 1) % cmdShown.length; renderCmd(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); cmdSel = (cmdSel - 1 + cmdShown.length) % cmdShown.length; renderCmd(); }
      if (e.key === 'Enter') { e.preventDefault(); runCmd(cmdSel); }
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey || $('.modal.is-open')) return;
    const views = Object.keys(VIEWS);
    if (/^[1-6]$/.test(e.key)) setView(views[+e.key - 1]);
    if (e.key.toLowerCase() === 't') toggleTheme();
    if (e.key.toLowerCase() === 'n') { e.preventDefault(); newProjectModal(); }
  });

  /* ---------- Wiring ---------- */
  $$('.nav-item[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  $$('.nav-pin').forEach(b => b.addEventListener('click', () => flashProject(b.dataset.project)));
  $$('#rangeSeg button').forEach(b => b.addEventListener('click', () => setRange(b.dataset.range)));
  $$('#metricTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#metricTabs button').forEach(x => x.classList.toggle('is-active', x === b)); state.metric = b.dataset.metric; drawChart();
  }));
  $$('#projTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#projTabs button').forEach(x => x.classList.toggle('is-active', x === b)); state.projFilter = b.dataset.status; renderProjects(true);
  }));
  $$('#notifTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#notifTabs button').forEach(x => x.classList.toggle('is-active', x === b)); state.notifFilter = b.dataset.filter; renderNotifs();
  }));
  $('#projBody').addEventListener('click', e => { const r = e.target.closest('tr[data-name]'); if (r) openProject(r.dataset.name); });
  $('#chartSvg').addEventListener('mousemove', chartHover);
  $('#chartSvg').addEventListener('mouseleave', () => { $('#chartTip').style.opacity = 0; $$('.cross, .dot', $('#chartSvg')).forEach(el => el.setAttribute('opacity', 0)); });
  $('#mixToggle').addEventListener('click', () => { state.mixMode = state.mixMode === 'share' ? 'value' : 'share'; renderMix(); });
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#bellBtn').addEventListener('click', e => { e.stopPropagation(); const open = $('#notifPop').classList.toggle('is-open'); $('#bellBtn').setAttribute('aria-expanded', open); $('#wsMenu').classList.remove('is-open'); });
  $('#wsBtn').addEventListener('click', e => { e.stopPropagation(); const open = $('#wsMenu').classList.toggle('is-open'); $('#wsBtn').setAttribute('aria-expanded', open); });
  $$('.ws-item').forEach(b => b.addEventListener('click', () => {
    $$('.ws-item').forEach(x => x.classList.toggle('is-active', x === b));
    const name = b.dataset.ws; $('#wsName').textContent = name; $('.crumbs span').textContent = name;
    state.seed = name.length * 3 + name.charCodeAt(0); $('#wsMenu').classList.remove('is-open');
    renderKpis(); drawChart(); toast(`Switched to ${name}`, 'building-2');
  }));
  $('#markAll').addEventListener('click', markAll); $('#markAll2').addEventListener('click', markAll);
  $('#searchBtn').addEventListener('click', openCmd);
  $('#newProjectBtn').addEventListener('click', newProjectModal);
  $('#inviteBtn').addEventListener('click', inviteModal);
  $('#settingsBtn').addEventListener('click', settingsModal);
  $('#profileBtn').addEventListener('click', settingsModal);
  $('#helpBtn').addEventListener('click', helpModal);
  $('#upgradeBtn').addEventListener('click', planModal);
  $('#exportBtn').addEventListener('click', exportCsv);
  $('#menuBtn').addEventListener('click', () => { $('#sidebar').classList.add('is-open'); scrim.classList.add('is-open'); });
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { drawChart(false); moveThumb(); }, 120); });

  /* ---------- Live activity ---------- */
  let liveI = 0;
  setInterval(() => { if (state.live && !document.hidden) pushFeed(livePool[liveI++ % livePool.length]); }, 9000);
  let mins = 0; setInterval(() => { mins++; $('#refreshed').textContent = `${mins} min ago`; }, 60000);

  /* ---------- Init ---------- */
  try { const t = localStorage.getItem('meridian-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) { /* storage unavailable */ }
  $('#today').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#viewTitle').textContent = VIEWS.overview[0]();
  icons();
  renderKpis(false); renderMix(); renderProjects(); renderFeed(); renderTeam(); renderNotifs();
  setView('overview', true);

  function intro() {
    moveThumb(); drawChart(true); renderKpis(true);
    if (!hasGsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.sidebar > *', { x: -14, opacity: 0, duration: .5, stagger: .05, clearProps: 'all' })
      .from('.topbar > *', { y: -10, opacity: 0, duration: .45, stagger: .05, clearProps: 'all' }, .05)
      .from('.welcome > *', { y: 18, opacity: 0, duration: .6, stagger: .08, clearProps: 'all' }, .15)
      .from('.kpi', { y: 22, opacity: 0, duration: .6, stagger: .07, clearProps: 'all' }, .28)
      .from('#grid > .panel', { y: 26, opacity: 0, duration: .7, stagger: .08, clearProps: 'all' }, .45)
      .from('#projBody .prog-bar span, .team .prog-bar span', { scaleX: 0, transformOrigin: 'left', duration: .9, stagger: .03 }, .8)
      .from('.seg-arc', { strokeDasharray: '0 400', duration: 1.1, stagger: .08, ease: 'power2.out' }, .7);
  }
  const loader = $('#loader');
  if (hasGsap) {
    gsap.timeline({ onComplete: () => { loader.remove(); } })
      .to('.loader-path', { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' })
      .to('.loader-bar span', { scaleX: 1, duration: .7, ease: 'power2.inOut' }, .15)
      .to(loader, { opacity: 0, duration: .4, ease: 'power2.out' }, '+=.1')
      .add(intro, '-=.35');
  } else { loader.remove(); intro(); }
})();
