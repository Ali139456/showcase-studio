/* Halden — Personal Banking */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  const icons = () => { if (window.lucide) window.lucide.createIcons(); };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Formatting ---------- */
  const fmt = (n, d = 2) => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtK = n => n >= 1000 ? '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : '$' + Math.round(n);
  const pct = n => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1) + '%';
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAY = 864e5;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayAt = offset => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  const shortDate = d => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  const timeOf = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const seeded = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  /* ---------- Data ---------- */
  const CATS = {
    Housing: { icon: 'house', color: '#0f3d2e' },
    Groceries: { icon: 'shopping-basket', color: '#2f7a5a' },
    Dining: { icon: 'utensils', color: '#8fc46b' },
    Shopping: { icon: 'shopping-bag', color: '#c8f169' },
    Transport: { icon: 'car', color: '#e8a24a' },
    Travel: { icon: 'plane', color: '#14201a' },
    Bills: { icon: 'receipt', color: '#a9a48f' },
    Health: { icon: 'heart-pulse', color: '#d4cfbd' },
    Entertainment: { icon: 'clapperboard', color: '#6b7a70' },
    Transfers: { icon: 'arrow-up-right', color: '#c4513a' },
    Salary: { icon: 'briefcase', color: '#0f3d2e' },
    Freelance: { icon: 'pen-tool', color: '#0f3d2e' },
    Investments: { icon: 'trending-up', color: '#0f3d2e' },
    'Top up': { icon: 'arrow-down-left', color: '#0f3d2e' }
  };

  const POOL = [
    ['Whole Foods Market', 'Groceries', 38, 142], ['Trader Joe\'s', 'Groceries', 22, 96], ['Union Market', 'Groceries', 12, 58],
    ['Sweetgreen', 'Dining', 14, 22], ['Blue Bottle Coffee', 'Dining', 5, 13], ['Lilia', 'Dining', 86, 190], ['Russ & Daughters', 'Dining', 18, 46], ['Superiority Burger', 'Dining', 16, 38],
    ['Uber', 'Transport', 11, 44], ['MTA OMNY', 'Transport', 2.9, 2.9], ['Citi Bike', 'Transport', 4.5, 9], ['Shell', 'Transport', 38, 64],
    ['Apple Store', 'Shopping', 29, 249], ['Aesop', 'Shopping', 35, 120], ['Uniqlo', 'Shopping', 30, 130], ['McNally Jackson Books', 'Shopping', 16, 62],
    ['CVS Pharmacy', 'Health', 8, 44], ['One Medical', 'Health', 30, 75],
    ['Metrograph', 'Entertainment', 17, 34], ['Brooklyn Steel', 'Entertainment', 45, 98]
  ];
  const BIG = [['Delta Air Lines', 'Travel', 286, 720], ['Airbnb', 'Travel', 340, 980], ['Amtrak', 'Travel', 62, 180], ['The Hoxton', 'Travel', 240, 520]];
  const INCOME = [['Studio Kiln', 'Freelance', 650, 2400], ['Vanguard dividend', 'Investments', 84, 310], ['Oda Collective', 'Freelance', 400, 1500]];

  let uid = 0;
  const TX = [];
  (function generate() {
    const r = seeded(20261);
    const round = n => Math.round(n * 100) / 100;
    const pick = arr => arr[Math.floor(r() * arr.length)];
    const add = (date, name, cat, amt, via, h) => {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h ?? 8 + Math.floor(r() * 13), Math.floor(r() * 60));
      if (d > now) d.setTime(now.getTime() - Math.floor(r() * 50 + 5) * 6e4);
      TX.push({ id: 'T' + (10000 + uid++), date: d, name, cat, amt: round(amt), via });
    };
    for (let i = 729; i >= 0; i--) {
      const date = dayAt(-i);
      const dom = date.getDate();
      if (dom === 1 || dom === 15) add(date, 'Northwind Labs', 'Salary', 4850, 'Direct deposit', 6);
      if (dom === 1) add(date, '88 Wythe Avenue', 'Housing', -2400, 'Bank transfer', 7);
      if (dom === 3) add(date, 'Spotify', 'Entertainment', -11.99, 'Virtual •• 3364', 9);
      if (dom === 5) add(date, 'Netflix', 'Entertainment', -22.99, 'Virtual •• 3364', 9);
      if (dom === 8) add(date, 'Verizon Fios', 'Bills', -85, 'Bank transfer', 8);
      if (dom === 12) add(date, 'Con Edison', 'Bills', -(92 + r() * 54), 'Bank transfer', 8);
      if (dom === 20) add(date, 'Equinox', 'Health', -260, 'Black •• 4281', 7);
      const n = r() < .22 ? 0 : r() < .62 ? 1 : 2;
      for (let k = 0; k < n; k++) {
        const [name, cat, lo, hi] = pick(POOL);
        add(date, name, cat, -(lo + r() * (hi - lo)), r() < .62 ? 'Black •• 4281' : 'Everyday •• 9017');
      }
      if (r() < .035) { const [name, cat, lo, hi] = pick(BIG); add(date, name, cat, -(lo + r() * (hi - lo)), 'Black •• 4281'); }
      if (r() < .045) { const [name, cat, lo, hi] = pick(INCOME); add(date, name, cat, lo + r() * (hi - lo), 'Bank transfer'); }
    }
    TX.sort((a, b) => b.date - a.date);
  })();

  const EUR = 1.0814;
  const ACCOUNTS = [
    { id: 'everyday', name: 'Everyday', kind: 'Current account', icon: 'wallet', num: '•• 4281', full: 'US64 HALD 0210 0002 1844 281', bal: 12480.52, chg: 2.4, seed: 11 },
    { id: 'reserve', name: 'Reserve', kind: 'Savings · 4.35% APY', icon: 'piggy-bank', num: '•• 7730', full: 'US12 HALD 0210 0007 3390 730', bal: 68900, chg: 1.1, seed: 23 },
    { id: 'portfolio', name: 'Portfolio', kind: 'Investments', icon: 'trending-up', num: '•• 1196', full: 'HLD-INV-0041196', bal: 129614.84, chg: 6.8, seed: 37 },
    { id: 'euro', name: 'Euro wallet', kind: 'EUR · Travel', icon: 'euro', num: '•• 5502', full: 'DE44 5001 0517 5407 3249 31', bal: 3010, cur: 'EUR', chg: -0.6, seed: 51 }
  ];
  const acct = id => ACCOUNTS.find(a => a.id === id);
  const usd = a => a.cur === 'EUR' ? a.bal * EUR : a.bal;
  const total = () => ACCOUNTS.reduce((s, a) => s + usd(a), 0);

  const CARDS = [
    { id: 'black', name: 'Halden Black', kind: 'Metal · Visa', skin: 'green', last: '4281', full: '4539 2210 7745 4281', exp: '09/29', cvv: '418', limit: 5000, frozen: false, online: true, net: 'visa', via: 'Black •• 4281' },
    { id: 'everyday', name: 'Everyday', kind: 'Debit · Mastercard', skin: 'lime', last: '9017', full: '5412 7534 0088 9017', exp: '02/28', cvv: '902', limit: 2500, frozen: false, online: true, net: 'mc', via: 'Everyday •• 9017' },
    { id: 'virtual', name: 'Virtual', kind: 'Online only · Visa', skin: 'bone', last: '3364', full: '4716 5520 1903 3364', exp: '11/27', cvv: '267', limit: 1000, frozen: false, online: true, net: 'visa', via: 'Virtual •• 3364' }
  ];

  const PEOPLE = [
    { id: 'isla', name: 'Isla', full: 'Isla Brennan' }, { id: 'finn', name: 'Finn', full: 'Finn Okafor' }, { id: 'ruby', name: 'Ruby', full: 'Ruby Castellan' },
    { id: 'lucas', name: 'Lucas', full: 'Lucas Ferreira' }, { id: 'mei', name: 'Mei', full: 'Mei Tanaka' }
  ];

  const GOALS = [
    { id: 'kyoto', name: 'Kyoto in spring', icon: 'plane', saved: 3240, target: 5200, due: 'Mar 2027' },
    { id: 'buffer', name: 'Six-month buffer', icon: 'shield-check', saved: 21500, target: 28000, due: 'Ongoing' },
    { id: 'studio', name: 'Studio deposit', icon: 'key-round', saved: 8100, target: 30000, due: 'Dec 2028' }
  ];

  const nextDom = dom => { const d = new Date(today.getFullYear(), today.getMonth(), dom); if (d <= today) d.setMonth(d.getMonth() + 1); return Math.round((d - today) / DAY); };
  const BILLS = [
    { id: 'rent', name: '88 Wythe Avenue', note: 'Rent', icon: 'house', cat: 'Housing', amt: 2400, due: nextDom(1), paid: false },
    { id: 'coned', name: 'Con Edison', note: 'Electricity', icon: 'zap', cat: 'Bills', amt: 118.4, due: nextDom(12), paid: false },
    { id: 'verizon', name: 'Verizon Fios', note: 'Internet', icon: 'wifi', cat: 'Bills', amt: 85, due: nextDom(8), paid: false },
    { id: 'equinox', name: 'Equinox', note: 'Membership', icon: 'dumbbell', cat: 'Health', amt: 260, due: nextDom(20), paid: false }
  ].sort((a, b) => a.due - b.due);

  const BUDGETS = { Groceries: 720, Dining: 480, Shopping: 620, Transport: 300, Health: 380, Entertainment: 160 };

  const NOTES = [
    { icon: 'arrow-down-left', title: 'Salary received', text: 'Northwind Labs paid $4,850.00', time: '2h', unread: true },
    { icon: 'shield-check', title: 'New sign-in approved', text: 'MacBook Pro · Brooklyn, NY', time: '5h', unread: true },
    { icon: 'receipt', title: 'Con Edison bill is ready', text: 'Due soon — pay from Upcoming bills', time: '1d', unread: true },
    { icon: 'sparkles', title: 'Reserve rate increased', text: 'Your savings now earn 4.35% APY', time: '3d', unread: false }
  ];

  /* ---------- State ---------- */
  const state = { view: 'overview', range: '1M', q: '', type: 'all', cat: 'all', shown: 14, series: { income: true, expense: true }, person: 'isla', cardOrder: ['black', 'everyday', 'virtual'], reveal: false, newId: null };
  const RANGE = {
    '1W': { days: 7, label: 'this week', long: 'last 7 days' },
    '1M': { days: 30, label: 'this month', long: 'last 30 days' },
    '3M': { days: 91, label: 'this quarter', long: 'last 3 months' },
    '1Y': { days: 365, label: 'this year', long: 'last 12 months' }
  };
  const rangeStart = () => state.range === '1Y' ? new Date(today.getFullYear(), today.getMonth() - 11, 1) : dayAt(-(RANGE[state.range].days - 1));
  const prevStart = () => { const s = rangeStart(); return state.range === '1Y' ? new Date(s.getFullYear() - 1, s.getMonth(), 1) : new Date(s.getTime() - RANGE[state.range].days * DAY); };
  const inRange = () => { const s = rangeStart(); return TX.filter(t => t.date >= s); };
  const inPrev = () => { const s = rangeStart(), p = prevStart(); return TX.filter(t => t.date >= p && t.date < s); };
  const sums = list => list.reduce((o, t) => { if (t.amt > 0) o.inc += t.amt; else o.exp -= t.amt; return o; }, { inc: 0, exp: 0 });

  /* ---------- Toast ---------- */
  function toast(msg, icon = 'check') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<i data-lucide="${icon}"></i><span>${esc(msg)}</span>`;
    $('#toasts').appendChild(el); icons();
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 380); }, 2800);
  }

  function download(name, text, type = 'text/plain') {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  function copy(text, msg) {
    const done = () => toast(msg, 'copy');
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else { const t = Object.assign(document.createElement('textarea'), { value: text }); document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) { /* noop */ } t.remove(); done(); }
  }

  /* ---------- Sparkline ---------- */
  function sparkPath(vals, w, h, pad = 3) {
    const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
    const pts = vals.map((v, i) => [i / (vals.length - 1) * w, pad + (1 - (v - min) / span) * (h - pad * 2)]);
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  /* ---------- Head ---------- */
  const HEADS = {
    transactions: ['Transactions', 'Every payment in and out of your accounts.'],
    cards: ['Cards', 'Three cards, one set of controls.'],
    analytics: ['Analytics', 'Where your money came from, and where it went.'],
    accounts: ['Accounts', 'Balances, savings goals and transfers.']
  };
  function renderHead() {
    $('#headDate').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    if (state.view === 'overview') {
      const h = now.getHours();
      $('#headTitle').textContent = `Good ${h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'}, Arjun`;
      const s = sums(inRange()), net = s.inc - s.exp;
      $('#headSub').innerHTML = net >= 0
        ? `You have kept <b class="amt">${fmt(net)}</b> ${RANGE[state.range].label} — ${Math.round(net / (s.inc || 1) * 100)}% of what came in.`
        : `You have spent <b class="amt">${fmt(-net)}</b> more than you earned ${RANGE[state.range].label}.`;
    } else {
      $('#headTitle').textContent = HEADS[state.view][0];
      $('#headSub').textContent = HEADS[state.view][1];
    }
  }

  /* ---------- Balance ---------- */
  let shownTotal = 0;
  const balanceHtml = v => { const [a, b] = fmt(v).split('.'); return `${a}<span class="cents">.${b}</span>`; };
  function renderBalance(animate) {
    const t = total();
    const el = $('#balanceNum');
    if (hasGsap && animate !== false && Math.abs(t - shownTotal) > .005) {
      const o = { v: shownTotal };
      gsap.to(o, { v: t, duration: 1.4, ease: 'power3.out', onUpdate: () => { el.innerHTML = balanceHtml(o.v); }, onComplete: () => { el.innerHTML = balanceHtml(t); } });
    } else el.innerHTML = balanceHtml(t);
    shownTotal = t;

    const list = inRange(), s = sums(list), net = s.inc - s.exp, d = net / ((t - net) || 1) * 100;
    const chip = $('#balanceDelta');
    chip.className = 'chip-up' + (d < 0 ? ' is-down' : '');
    chip.innerHTML = `<i data-lucide="${d < 0 ? 'arrow-down-right' : 'arrow-up-right'}"></i>${pct(d)}`;
    $('#balanceNote').innerHTML = `<span class="amt">${net >= 0 ? '+' : ''}${fmt(net)}</span> ${RANGE[state.range].label}`;
    icons();

    // running balance sparkline
    const start = rangeStart(), days = Math.max(2, Math.round((dayAt(1) - start) / DAY));
    const byDay = new Array(days).fill(0);
    list.forEach(tx => { byDay[Math.min(days - 1, Math.floor((tx.date - start) / DAY))] += tx.amt; });
    const vals = new Array(days); let run = t;
    for (let i = days - 1; i >= 0; i--) { vals[i] = run; run -= byDay[i]; }
    const step = Math.max(1, Math.floor(days / 60)), pts = vals.filter((_, i) => i % step === 0 || i === days - 1);
    const svg = $('#balanceSpark'), w = 400, h = 90;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const d0 = sparkPath(pts, w, h, 8);
    svg.innerHTML = `<defs><linearGradient id="bsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8f169" stop-opacity=".32"/><stop offset="1" stop-color="#c8f169" stop-opacity="0"/></linearGradient></defs><path d="${d0} L${w},${h} L0,${h} Z" fill="url(#bsg)"/><path class="bs-line" d="${d0}" fill="none" stroke="#c8f169" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`;
    if (hasGsap && animate !== false) {
      const p = $('.bs-line', svg), len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', onComplete: () => p.removeAttribute('style') });
    }
  }

  /* ---------- Cash-flow chart ---------- */
  function buckets() {
    const out = [];
    if (state.range === '1W') for (let i = 6; i >= 0; i--) out.push({ from: dayAt(-i), to: dayAt(-i + 1), label: DAYS[dayAt(-i).getDay()], long: shortDate(dayAt(-i)) });
    if (state.range === '1M') for (let i = 9; i >= 0; i--) { const f = dayAt(-(i * 3 + 2)), t = dayAt(-(i * 3) + 1); out.push({ from: f, to: t, label: shortDate(f), long: `${shortDate(f)} – ${shortDate(dayAt(-(i * 3)))}` }); }
    if (state.range === '3M') for (let i = 12; i >= 0; i--) { const f = dayAt(-(i * 7 + 6)), t = dayAt(-(i * 7) + 1); out.push({ from: f, to: t, label: shortDate(f), long: `Week of ${shortDate(f)}` }); }
    if (state.range === '1Y') for (let i = 11; i >= 0; i--) { const f = new Date(today.getFullYear(), today.getMonth() - i, 1), t = new Date(today.getFullYear(), today.getMonth() - i + 1, 1); out.push({ from: f, to: t, label: MONTHS[f.getMonth()], long: `${MONTHS[f.getMonth()]} ${f.getFullYear()}` }); }
    out.forEach(b => { b.inc = 0; b.exp = 0; });
    const first = out[0].from;
    TX.forEach(t => { if (t.date < first) return; const b = out.find(x => t.date >= x.from && t.date < x.to); if (b) { if (t.amt > 0) b.inc += t.amt; else b.exp -= t.amt; } });
    return out;
  }
  const niceMax = v => { if (v <= 0) return 100; const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };

  let flowData = [];
  function drawFlow(animate) {
    const box = $('#flowChart'), svg = $('#flowSvg');
    const W = box.clientWidth, H = box.clientHeight;
    if (!W || !H) return;
    const data = flowData = buckets();
    const { income: showIn, expense: showOut } = state.series;
    const pad = { l: 46, r: 4, t: 10, b: 28 };
    const max = niceMax(Math.max(1, ...data.map(b => Math.max(showIn ? b.inc : 0, showOut ? b.exp : 0))));
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b, cw = iw / data.length;
    const bw = Math.max(5, Math.min(26, cw * (showIn && showOut ? .3 : .46))), gap = Math.min(5, bw * .25);
    const y = v => pad.t + ih - v / max * ih;
    const every = cw < 34 ? 3 : cw < 58 ? 2 : 1;
    let h = '';
    for (let i = 0; i <= 4; i++) { const v = max / 4 * i, yy = y(v); h += `<line class="gl" x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}"/><text class="gt" x="${pad.l - 10}" y="${yy + 3.5}" text-anchor="end">${fmtK(v)}</text>`; }
    data.forEach((b, i) => {
      const cx = pad.l + cw * i + cw / 2;
      const bar = (cls, v, x) => { const hh = Math.max(v > 0 ? 2 : 0, v / max * ih), r = Math.min(6, bw / 2, hh); return `<path class="${cls} bar" data-h="${hh}" d="M${x},${pad.t + ih} v${-(hh - r)} q0,${-r} ${r},${-r} h${bw - r * 2} q${r},0 ${r},${r} v${hh - r} z"/>`; };
      h += `<g class="col" data-i="${i}"><rect class="col-bg" x="${pad.l + cw * i + 2}" y="${pad.t - 6}" width="${cw - 4}" height="${ih + 6}" rx="10"/>`;
      if (showIn && showOut) h += bar('bar-in', b.inc, cx - bw - gap / 2) + bar('bar-out', b.exp, cx + gap / 2);
      else if (showIn) h += bar('bar-in', b.inc, cx - bw / 2);
      else h += bar('bar-out', b.exp, cx - bw / 2);
      if (i % every === (data.length - 1) % every) h += `<text class="gt" x="${cx}" y="${H - 8}" text-anchor="middle">${b.label}</text>`;
      h += '</g>';
    });
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = h;
    if (hasGsap && animate) {
      gsap.fromTo($$('.bar', svg), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .9, ease: 'power3.out', stagger: { each: .018 }, clearProps: 'transform' });
    }

    const cur = sums(inRange()), prev = sums(inPrev());
    const delta = (a, b, goodUp) => { if (!b) return ''; const d = (a - b) / b * 100; return `<em class="${(d >= 0) === goodUp ? '' : 'is-bad'}">${pct(d)}</em>`; };
    const net = cur.inc - cur.exp;
    $('#flowStats').innerHTML = `
      <div><span>Income</span><b class="amt">${fmt(cur.inc, 0)}</b>${delta(cur.inc, prev.inc, true)}</div>
      <div><span>Spending</span><b class="amt">${fmt(cur.exp, 0)}</b>${delta(cur.exp, prev.exp, false)}</div>
      <div><span>Net saved</span><b class="amt">${fmt(net, 0)}</b><em class="${net < 0 ? 'is-bad' : ''}">${Math.round(net / (cur.inc || 1) * 100)}% rate</em></div>`;
    $('#flowSub').textContent = `Income against spending · ${RANGE[state.range].long}`;
  }

  function flowHover(e) {
    const col = e.target.closest('.col'), tip = $('#flowTip');
    $$('.col.is-hot').forEach(c => c.classList.remove('is-hot'));
    if (!col) { tip.classList.remove('is-on'); return; }
    col.classList.add('is-hot');
    const b = flowData[+col.dataset.i], net = b.inc - b.exp;
    tip.innerHTML = `<b>${b.long}</b><p><span><i class="sw sw-in"></i>Income</span>${fmt(b.inc)}</p><p><span><i class="sw sw-out"></i>Spending</span>${fmt(b.exp)}</p><p class="net"><span>Net</span>${net >= 0 ? '+' : ''}${fmt(net)}</p>`;
    const box = $('#flowChart').getBoundingClientRect(), r = col.getBoundingClientRect();
    const tw = tip.offsetWidth, x = Math.max(0, Math.min(box.width - tw, r.left - box.left + r.width / 2 - tw / 2));
    tip.style.transform = `translate(${x}px, ${Math.max(0, e.clientY - box.top - tip.offsetHeight - 18)}px)`;
    tip.classList.add('is-on');
  }

  /* ---------- Accounts ---------- */
  function renderAccounts() {
    $('#acctList').innerHTML = ACCOUNTS.map(a => {
      const r = seeded(a.seed), vals = []; let v = 50;
      for (let i = 0; i < 16; i++) { v += (r() - .5 + a.chg / 22) * 9; vals.push(v); }
      const up = a.chg >= 0;
      return `<button class="acct" data-acct="${a.id}">
        <div class="acct-top"><span class="acct-ico"><i data-lucide="${a.icon}"></i></span><div><b>${a.name}</b><span>${a.kind}</span></div><i data-lucide="arrow-up-right"></i></div>
        <div class="acct-bottom"><div><div class="acct-bal amt">${a.cur === 'EUR' ? '€' + a.bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : fmt(a.bal)}</div><span class="acct-chg ${up ? '' : 'is-down'}">${pct(a.chg)} · 30d</span></div>
        <svg class="spark" viewBox="0 0 84 34"><path d="${sparkPath(vals, 84, 34)}" fill="none" stroke="${up ? '#1b5a43' : '#c4513a'}" stroke-width="1.8" stroke-linecap="round"/></svg></div>
      </button>`;
    }).join('');
  }

  function openAccount(id) {
    const a = acct(id);
    const recent = id === 'everyday' ? TX.slice(0, 3) : [];
    openModal(`
      <p class="m-eyebrow">${a.kind}</p><h3>${a.name}</h3>
      <div class="m-hero"><span class="tx-ico"><i data-lucide="${a.icon}"></i></span><div><b class="amt">${a.cur === 'EUR' ? '€' + a.bal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : fmt(a.bal)}</b><span>${a.cur === 'EUR' ? `≈ ${fmt(usd(a))} at 1 EUR = $${EUR}` : 'Available balance'}</span></div></div>
      <div class="m-rows">
        <div><span>Account number</span><b class="mono">${a.full}</b></div>
        <div><span>Status</span><b class="status">Active</b></div>
        <div><span>30-day change</span><b>${pct(a.chg)}</b></div>
        ${recent.map(t => `<div><span>${esc(t.name)}</span><b>${t.amt > 0 ? '+' : ''}${fmt(t.amt)}</b></div>`).join('')}
      </div>
      <div class="m-actions"><button class="btn btn-ghost" id="mCopy"><i data-lucide="copy"></i>Copy number</button><button class="btn btn-primary" id="mStatement"><i data-lucide="file-down"></i>Statement</button></div>`);
    $('#mCopy').onclick = () => copy(a.full, 'Account number copied');
    $('#mStatement').onclick = () => { exportCsv(inRange(), `halden-${a.id}-statement.csv`); };
  }

  /* ---------- Cards ---------- */
  const card = id => CARDS.find(c => c.id === id);
  const topCard = () => card(state.cardOrder[0]);
  const monthSpend = c => { const s = new Date(today.getFullYear(), today.getMonth(), 1); return TX.filter(t => t.date >= s && t.amt < 0 && t.via === c.via).reduce((n, t) => n - t.amt, 0); };

  function renderCards(rebuild = true) {
    const stack = $('#cardStack');
    if (rebuild || !stack.children.length) {
      stack.innerHTML = CARDS.map(c => `
        <button class="pay" data-card="${c.id}" data-skin="${c.skin}" aria-label="${c.name} card">
          <div class="pay-top"><b>Halden</b><span>${c.kind}</span></div>
          <div class="pay-chip"></div>
          <div class="pay-num" data-num></div>
          <div class="pay-bot"><div><small>Card holder</small><b>Arjun Mehta</b></div><div><small data-exp-label>Expires</small><b data-exp></b></div>${c.net === 'visa' ? '<div class="pay-net visa">VISA</div>' : '<div class="pay-net"><i></i><i></i></div>'}</div>
          <div class="pay-frost"><i data-lucide="snowflake"></i>Card frozen</div>
        </button>`).join('');
    }
    $$('.pay', stack).forEach(el => {
      const c = card(el.dataset.card), pos = state.cardOrder.indexOf(c.id), show = state.reveal && pos === 0;
      el.dataset.pos = pos;
      el.classList.toggle('is-frozen', c.frozen);
      $('[data-num]', el).textContent = show ? c.full : `•••• •••• •••• ${c.last}`;
      $('[data-exp-label]', el).textContent = show ? 'Exp / CVV' : 'Expires';
      $('[data-exp]', el).textContent = show ? `${c.exp} · ${c.cvv}` : c.exp;
      el.tabIndex = pos === 0 ? -1 : 0;
    });
    const c = topCard(), spent = monthSpend(c), ratio = Math.min(1, spent / c.limit);
    $('#cardSub').textContent = `${c.name} · •• ${c.last}`;
    $('#limitSpent').textContent = fmt(spent, 0);
    $('#limitMax').textContent = fmt(c.limit, 0);
    $('#limitFill').style.width = (ratio * 100).toFixed(1) + '%';
    $('#limitFill').classList.toggle('is-hot', ratio > .85);
    $('#limitRange').value = c.limit;
    $('#freezeBtn').setAttribute('aria-pressed', c.frozen);
    $('#onlineBtn').setAttribute('aria-pressed', c.online);
    $('#revealBtn').setAttribute('aria-pressed', state.reveal);
    icons();
  }
  function rotateCards(dir) {
    const o = state.cardOrder;
    if (dir > 0) o.push(o.shift()); else o.unshift(o.pop());
    state.reveal = false; renderCards(false);
  }

  /* ---------- Spending ---------- */
  function spendCats() {
    const map = {};
    inRange().forEach(t => { if (t.amt < 0) map[t.cat] = (map[t.cat] || 0) - t.amt; });
    const all = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const sum = all.reduce((s, x) => s + x[1], 0);
    const top = all.slice(0, 6).map(([name, v]) => ({ name, v, color: CATS[name].color }));
    const rest = all.slice(6).reduce((s, x) => s + x[1], 0);
    if (rest > 0) top.push({ name: 'Other', v: rest, color: '#ebe8dc', other: true });
    return { list: top, sum };
  }
  let spendData = { list: [], sum: 0 };
  function renderSpend(animate) {
    const data = spendData = spendCats(), R = 80, C = 2 * Math.PI * R, gap = data.list.length > 1 ? 3 : 0;
    let off = 0, h = `<circle class="track" cx="100" cy="100" r="${R}"/>`;
    data.list.forEach((c, i) => {
      const len = c.v / (data.sum || 1) * C;
      h += `<circle class="seg-arc" data-i="${i}" cx="100" cy="100" r="${R}" stroke="${c.color}" stroke-dasharray="${Math.max(0.1, len - gap).toFixed(2)} ${(C - len + gap).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"/>`;
      off += len;
    });
    $('#donut').innerHTML = h;
    $('#cats').innerHTML = data.list.map((c, i) => {
      const inner = `<i style="background:${c.color}"></i><span>${c.name}</span><b class="amt">${fmt(c.v, 0)}</b><em>${Math.round(c.v / (data.sum || 1) * 100)}%</em>`;
      return `<li>${c.other ? `<button data-i="${i}" tabindex="-1" style="cursor:default">${inner}</button>` : `<button data-i="${i}" data-cat="${c.name}" class="${state.cat === c.name ? 'is-active' : ''}">${inner}</button>`}</li>`;
    }).join('') || '<li class="tx-empty">No spending in this period.</li>';
    donutFocus(-1);
    $('#spendSub').textContent = `By category · ${RANGE[state.range].long}`;
    $('#spendClear').hidden = state.cat === 'all';
    if (hasGsap && animate) {
      gsap.from($$('.seg-arc', $('#donut')), { attr: { 'stroke-dasharray': `0.1 ${C}` }, duration: 1.1, ease: 'power3.out', stagger: .05 });
    }
  }
  function donutFocus(i) {
    const d = spendData, c = d.list[i];
    $('.donut').classList.toggle('is-hover', !!c);
    $$('.seg-arc').forEach(a => a.classList.toggle('is-hot', +a.dataset.i === i));
    $$('#cats button').forEach(b => b.classList.toggle('is-hot', +b.dataset.i === i));
    $('#donutLabel').textContent = c ? c.name : 'Total spent';
    $('#donutValue').textContent = fmt(c ? c.v : d.sum, 0);
    $('#donutPct').textContent = c ? `${Math.round(c.v / (d.sum || 1) * 100)}% of spending` : RANGE[state.range].long;
  }

  /* ---------- Transactions ---------- */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return inRange().filter(t =>
      (state.type === 'all' || (state.type === 'in' ? t.amt > 0 : t.amt < 0)) &&
      (state.cat === 'all' || t.cat === state.cat) &&
      (!q || t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q) || t.via.toLowerCase().includes(q)));
  }
  function dayLabel(d) {
    const diff = Math.round((today - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / DAY);
    return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${DAYS[d.getDay()]}, ${shortDate(d)}${d.getFullYear() !== today.getFullYear() ? ' ' + d.getFullYear() : ''}`;
  }
  function renderTx() {
    const list = filtered(), limit = state.view === 'overview' ? 7 : state.shown, show = list.slice(0, limit);
    let h = '', last = '';
    show.forEach(t => {
      const key = t.date.toDateString();
      if (key !== last) {
        last = key;
        const net = list.filter(x => x.date.toDateString() === key).reduce((s, x) => s + x.amt, 0);
        h += `<div class="tx-day"><span>${dayLabel(t.date)}</span><span class="amt">${net >= 0 ? '+' : ''}${fmt(net)}</span></div>`;
      }
      h += `<button class="tx-row ${t.amt > 0 ? 'is-in' : ''} ${t.id === state.newId ? 'is-new' : ''}" data-tx="${t.id}">
        <span class="tx-ico"><i data-lucide="${CATS[t.cat].icon}"></i></span>
        <span><b>${esc(t.name)}</b><small>${t.cat} · ${timeOf(t.date)}</small></span>
        <span class="tx-via">${esc(t.via)}</span>
        <span class="tx-amt amt">${t.amt > 0 ? '+' : ''}${fmt(t.amt)}</span>
        <i data-lucide="chevron-right"></i></button>`;
    });
    if (!show.length) h = `<div class="tx-empty"><i data-lucide="search-x"></i><b>No transactions match</b><span>Try another search, category or a longer date range.</span><button id="txReset">Reset filters</button></div>`;
    $('#txList').innerHTML = h;
    $('#txSub').textContent = `${list.length} ${list.length === 1 ? 'transaction' : 'transactions'} · ${RANGE[state.range].long}`;
    const more = $('#txMore');
    if (state.view === 'overview') { more.hidden = list.length <= limit; more.innerHTML = 'View all transactions<i data-lucide="arrow-right"></i>'; }
    else { more.hidden = list.length <= limit; more.innerHTML = `Show more <span style="color:var(--mute);font-weight:500">(${list.length - show.length} remaining)</span>`; }
    const sel = $('#catSelect'), cats = [...new Set(inRange().map(t => t.cat))].sort();
    sel.innerHTML = `<option value="all">All categories</option>` + cats.map(c => `<option ${c === state.cat ? 'selected' : ''}>${c}</option>`).join('');
    if (state.cat !== 'all' && !cats.includes(state.cat)) sel.insertAdjacentHTML('beforeend', `<option selected>${state.cat}</option>`);
    $$('#typeSeg button').forEach(b => b.classList.toggle('is-active', b.dataset.type === state.type));
    if ($('#txSearch').value !== state.q) $('#txSearch').value = state.q;
    if ($('#globalSearch').value !== state.q) $('#globalSearch').value = state.q;
    icons();
  }
  function exportCsv(list, name = 'halden-transactions.csv') {
    const rows = [['Date', 'Time', 'Merchant', 'Category', 'Method', 'Amount (USD)'], ...list.map(t => [t.date.toISOString().slice(0, 10), timeOf(t.date), t.name, t.cat, t.via.replace(/•/g, '*'), t.amt.toFixed(2)])];
    download(name, rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv');
    toast(`Exported ${list.length} transactions`, 'download');
  }
  function openTx(id) {
    const t = TX.find(x => x.id === id); if (!t) return;
    const isIn = t.amt > 0;
    openModal(`
      <p class="m-eyebrow">${isIn ? 'Money in' : 'Payment'}</p><h3>${esc(t.name)}</h3>
      <div class="m-hero ${isIn ? 'is-in' : ''}"><span class="tx-ico"><i data-lucide="${CATS[t.cat].icon}"></i></span><div><b class="amt">${isIn ? '+' : ''}${fmt(t.amt)}</b><span>${dayLabel(t.date)} at ${timeOf(t.date)}</span></div></div>
      <div class="m-rows">
        <div><span>Status</span><b class="status">Completed</b></div>
        <div><span>Category</span><b>${t.cat}</b></div>
        <div><span>${isIn ? 'Received via' : 'Paid with'}</span><b>${esc(t.via)}</b></div>
        <div><span>Reference</span><b class="mono">HLD-${t.id}</b></div>
      </div>
      <div class="m-actions"><button class="btn btn-ghost" id="mFilter"><i data-lucide="list-filter"></i>All ${t.cat}</button><button class="btn btn-primary" id="mReceipt"><i data-lucide="file-down"></i>Receipt</button></div>`);
    $('#mReceipt').onclick = () => { download(`halden-receipt-${t.id}.txt`, `HALDEN — RECEIPT\n\nReference:  HLD-${t.id}\nMerchant:   ${t.name}\nCategory:   ${t.cat}\nDate:       ${t.date.toLocaleString('en-US')}\nMethod:     ${t.via.replace(/•/g, '*')}\nAmount:     ${t.amt.toFixed(2)} USD\nStatus:     Completed\n`); toast('Receipt downloaded', 'file-down'); };
    $('#mFilter').onclick = () => { closeModal(); setCat(t.cat, true); };
  }
  function setCat(cat, jump) {
    state.cat = state.cat === cat ? 'all' : cat; state.shown = 14;
    if (jump && !$('#pTx').dataset.views.split(' ').includes(state.view)) setView('transactions');
    else { renderTx(); renderSpend(false); }
  }

  function addTx(name, cat, amt, via) {
    const t = { id: 'T' + (10000 + uid++), date: new Date(), name, cat, amt: Math.round(amt * 100) / 100, via };
    TX.unshift(t); state.newId = t.id;
    acct('everyday').bal = Math.round((acct('everyday').bal + t.amt) * 100) / 100;
    renderAll(false);
    setTimeout(() => { state.newId = null; }, 1800);
    return t;
  }

  /* ---------- Transfer ---------- */
  const person = id => PEOPLE.find(p => p.id === id);
  const peopleHtml = active => PEOPLE.map(p => `<button type="button" class="person ${p.id === active ? 'is-active' : ''}" data-person="${p.id}"><img src="assets/av-${p.id}.jpg" alt="${p.full}" loading="lazy">${p.name}</button>`).join('');
  function renderPeople() {
    $('#people').innerHTML = peopleHtml(state.person);
    $('#transferLabel').textContent = `Send to ${person(state.person).name}`;
  }
  const parseAmt = v => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isFinite(n) ? Math.round(n * 100) / 100 : 0; };
  function validateAmt(n, max = acct('everyday').bal) {
    if (!n || n <= 0) return 'Enter an amount greater than zero.';
    if (n > max) return `That is more than the ${fmt(max)} available in Everyday.`;
    return '';
  }

  /* ---------- Goals / Bills / Budgets / Insights ---------- */
  function renderGoals() {
    $('#goalSub').textContent = `${fmt(GOALS.reduce((s, g) => s + g.saved, 0), 0)} set aside across ${GOALS.length} goals`;
    $('#goalList').innerHTML = GOALS.map(g => {
      const p = Math.min(100, g.saved / g.target * 100);
      return `<div class="goal"><div class="goal-top"><span class="goal-ico"><i data-lucide="${g.icon}"></i></span><div><b>${g.name}</b><span>Target ${g.due}</span></div><button data-goal="${g.id}" aria-label="Add funds to ${g.name}"><i data-lucide="plus"></i></button></div>
        <div class="goal-bar"><span style="width:${p.toFixed(1)}%"></span></div>
        <div class="goal-num"><span><b class="amt">${fmt(g.saved, 0)}</b> of ${fmt(g.target, 0)}</span><em>${Math.round(p)}%</em></div></div>`;
    }).join('');
  }
  function renderBills() {
    const open = BILLS.filter(b => !b.paid);
    $('#billSub').textContent = open.length ? `${fmt(open.reduce((s, b) => s + b.amt, 0))} due in the next 30 days` : 'Everything is paid. Nothing due.';
    $('#billList').innerHTML = BILLS.map(b => `<li class="bill ${b.paid ? 'is-paid' : ''}"><span class="bill-ico"><i data-lucide="${b.icon}"></i></span><div><b>${b.name}</b><span class="${!b.paid && b.due <= 5 ? 'is-soon' : ''}">${b.note} · ${b.paid ? 'Paid today' : b.due === 1 ? 'Due tomorrow' : `Due in ${b.due} days`}</span></div><span class="bill-amt amt">${fmt(b.amt)}</span><button data-bill="${b.id}">${b.paid ? '<i data-lucide="check"></i>Paid' : 'Pay'}</button></li>`).join('');
  }
  function renderBudgets(animate) {
    const scale = RANGE[state.range].days / 30, map = {};
    inRange().forEach(t => { if (t.amt < 0) map[t.cat] = (map[t.cat] || 0) - t.amt; });
    let over = 0;
    $('#budgetList').innerHTML = Object.entries(BUDGETS).map(([cat, m]) => {
      const budget = m * scale, spent = map[cat] || 0, r = spent / budget, isOver = r > 1; if (isOver) over++;
      return `<div class="budget-row"><div class="budget-top"><b><i style="background:${CATS[cat].color}"></i>${cat}</b><span class="${isOver ? 'is-over' : ''}"><span class="amt">${fmt(spent, 0)}</span> <em>of ${fmt(budget, 0)}</em>${isOver ? ` · ${fmt(spent - budget, 0)} over` : ''}</span></div><div class="budget-bar"><span class="${isOver ? 'is-over' : ''}" style="width:${Math.min(100, r * 100).toFixed(1)}%"></span></div></div>`;
    }).join('');
    $('#budgetSub').textContent = over ? `${over} of ${Object.keys(BUDGETS).length} categories over budget · ${RANGE[state.range].long}` : `All categories within budget · ${RANGE[state.range].long}`;
    if (hasGsap && animate) gsap.from('.budget-bar span', { scaleX: 0, duration: 1, ease: 'power3.out', stagger: .06 });
  }
  function renderInsights(animate) {
    const list = inRange().filter(t => t.amt < 0), prev = sums(inPrev()), cur = sums(inRange());
    const wd = new Array(7).fill(0); list.forEach(t => { if (t.cat !== 'Housing') wd[t.date.getDay()] -= t.amt; });
    const order = [1, 2, 3, 4, 5, 6, 0], max = Math.max(1, ...wd), top = wd.indexOf(Math.max(...wd));
    $('#weekChart').innerHTML = order.map(d => `<div class="${d === top ? 'is-top' : ''}" data-v="${fmt(wd[d], 0)}"><i style="height:${Math.max(4, wd[d] / max * 100).toFixed(1)}%"></i>${DAYS[d]}</div>`).join('');
    const sc = spendData.list[0], big = list.slice().sort((a, b) => a.amt - b.amt)[0];
    const change = prev.exp ? (cur.exp - prev.exp) / prev.exp * 100 : 0;
    const days = Math.max(1, Math.round((dayAt(1) - rangeStart()) / DAY));
    const rows = [];
    if (sc) rows.push(['pie-chart', `${sc.name} is your largest category`, `${fmt(sc.v, 0)} — ${Math.round(sc.v / (spendData.sum || 1) * 100)}% of everything you spent`]);
    rows.push([change <= 0 ? 'trending-down' : 'trending-up', `Spending is ${change <= 0 ? 'down' : 'up'} ${Math.abs(change).toFixed(1)}% on the previous period`, `${fmt(Math.abs(cur.exp - prev.exp), 0)} ${change <= 0 ? 'less' : 'more'} than the ${RANGE[state.range].days} days before`]);
    if (big) rows.push(['receipt', `Largest payment: ${big.name}`, `${fmt(-big.amt)} on ${shortDate(big.date)} · ${big.cat}`]);
    rows.push(['calendar-days', `${DAYS[top]} is your most expensive day`, `You average ${fmt(cur.exp / days)} a day across the period`]);
    $('#insightList').innerHTML = rows.map(r => `<li><span><i data-lucide="${r[0]}"></i></span><div><b>${esc(r[1])}</b><p>${esc(r[2])}</p></div></li>`).join('');
    if (hasGsap && animate) gsap.from('#weekChart i', { scaleY: 0, duration: .9, ease: 'power3.out', stagger: .05, clearProps: 'transform' });
  }

  /* ---------- Notifications ---------- */
  function renderNotes() {
    $('#notes').innerHTML = NOTES.map((n, i) => `<li class="${n.unread ? 'is-unread' : ''}" data-note="${i}"><span class="n-ico"><i data-lucide="${n.icon}"></i></span><div><b>${n.title}</b><span>${n.text}</span></div><time>${n.time}</time></li>`).join('');
    $('#bellDot').classList.toggle('is-off', !NOTES.some(n => n.unread));
    icons();
  }

  /* ---------- Render all ---------- */
  function renderAll(animate) {
    renderHead(); renderBalance(animate); drawFlow(animate); renderAccounts(); renderCards(false); renderSpend(animate); renderTx(); renderGoals(); renderBills(); renderBudgets(animate); renderInsights(animate); icons();
  }

  /* ---------- Views ---------- */
  function movePill() {
    const b = $('#tabs button.is-active'), pill = $('#tabsPill');
    pill.style.width = b.offsetWidth + 'px';
    pill.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  function setView(v, opts = {}) {
    if (!HEADS[v] && v !== 'overview') return;
    state.view = v; state.shown = 14;
    $$('#tabs button').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
    movePill();
    $('#grid').dataset.view = v;
    const vis = [];
    $$('.panel[data-views]').forEach(p => { const on = p.dataset.views.split(' ').includes(v); p.classList.toggle('is-hidden', !on); if (on) vis.push(p); });
    renderAll(true);
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'auto' });
    if (hasGsap) {
      gsap.killTweensOf(vis);
      gsap.fromTo(vis, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .05, clearProps: 'transform,opacity' });
      gsap.fromTo('.head > div:first-child > *', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: .05, clearProps: 'transform,opacity' });
    }
    const active = $('#tabs button.is-active');
    if (active && $('#tabs').scrollWidth > $('#tabs').clientWidth) $('#tabs').scrollTo({ left: active.offsetLeft - 20, behavior: 'smooth' });
  }
  function setRange(r) {
    state.range = r; state.shown = 14;
    $$('#rangeSeg button').forEach(b => b.classList.toggle('is-active', b.dataset.range === r));
    renderAll(true);
  }

  /* ---------- Modal ---------- */
  let lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    $('#modalBody').innerHTML = html; icons();
    $('#modal').classList.add('is-open'); $('#modal').setAttribute('aria-hidden', 'false');
    const f = $('#modalBody input, #modalBody select, #modalBody button');
    if (f) setTimeout(() => f.focus({ preventScroll: true }), 60);
  }
  function closeModal() {
    $('#modal').classList.remove('is-open'); $('#modal').setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  const success = (title, text, btn = 'Done') => {
    $('#modalBody').innerHTML = `<div class="m-ok"><span class="m-ok-ico"><i data-lucide="check"></i></span><h3>${esc(title)}</h3><p>${text}</p><button class="btn btn-primary btn-block" data-close>${btn}</button></div>`;
    icons();
    if (hasGsap) gsap.from('.m-ok > *', { y: 16, opacity: 0, duration: .6, ease: 'power3.out', stagger: .07 });
  };

  function openAction(type, preset = {}) {
    let who = preset.person || state.person;
    const bal = acct('everyday').bal;
    if (type === 'send' || type === 'request') {
      const send = type === 'send';
      openModal(`
        <p class="m-eyebrow">${send ? 'From Everyday · ' + fmt(bal) + ' available' : 'Paid into Everyday'}</p><h3>${send ? 'Send money' : 'Request money'}</h3>
        <p class="m-sub">${send ? 'Transfers to Halden contacts arrive instantly.' : 'They will get a secure link to pay you.'}</p>
        <form id="mForm" novalidate>
          <div class="m-people" id="mPeople">${peopleHtml(who)}</div>
          <label class="field"><span>Amount (USD)</span><input id="mAmt" inputmode="decimal" placeholder="0.00" autocomplete="off" value="${preset.amount || ''}"></label>
          <label class="field"><span>Note (optional)</span><input id="mNote" maxlength="60" placeholder="${send ? 'Dinner on Friday' : 'Your half of the cabin'}" autocomplete="off"></label>
          <p class="m-err" id="mErr"></p>
          <button class="btn btn-primary btn-block" type="submit"><span id="mLabel"></span><i data-lucide="${send ? 'send' : 'arrow-down-left'}"></i></button>
        </form>`);
      const label = () => { $('#mLabel').textContent = `${send ? 'Send to' : 'Request from'} ${person(who).name}`; };
      label();
      $('#mPeople').onclick = e => { const b = e.target.closest('[data-person]'); if (!b) return; who = b.dataset.person; $$('#mPeople .person').forEach(x => x.classList.toggle('is-active', x === b)); label(); };
      $('#mForm').onsubmit = e => {
        e.preventDefault();
        const n = parseAmt($('#mAmt').value), err = send ? validateAmt(n) : (n > 0 ? '' : 'Enter an amount greater than zero.');
        $('#mErr').textContent = err; $('#mAmt').closest('.field').classList.toggle('is-bad', !!err);
        if (err) return;
        const p = person(who), note = $('#mNote').value.trim();
        if (send) { addTx(`Transfer to ${p.full}`, 'Transfers', -n, 'Everyday •• 4281'); success(`${fmt(n)} sent to ${p.name}`, `${esc(p.full)} has the money now.${note ? ` Note: “${esc(note)}”.` : ''} Your Everyday balance is <b>${fmt(acct('everyday').bal)}</b>.`); }
        else { success(`Request sent to ${p.name}`, `We have asked ${esc(p.full)} for <b>${fmt(n)}</b>${note ? ` — “${esc(note)}”` : ''}. You will be notified when it is paid.`); NOTES.unshift({ icon: 'arrow-down-left', title: `Request sent to ${p.name}`, text: `${fmt(n)} · awaiting payment`, time: 'now', unread: true }); renderNotes(); }
      };
    }
    if (type === 'topup') {
      openModal(`
        <p class="m-eyebrow">Into Everyday</p><h3>Add money</h3><p class="m-sub">Top up instantly from a linked account.</p>
        <form id="mForm" novalidate>
          <label class="field"><span>From</span><select id="mFrom"><option>Chase Checking •• 8841</option><option>Apple Pay</option><option>Wise USD •• 2207</option></select></label>
          <label class="field"><span>Amount (USD)</span><input id="mAmt" inputmode="decimal" placeholder="0.00" autocomplete="off"></label>
          <p class="m-err" id="mErr"></p>
          <button class="btn btn-primary btn-block" type="submit">Add money<i data-lucide="plus"></i></button>
        </form>`);
      $('#mForm').onsubmit = e => {
        e.preventDefault();
        const n = parseAmt($('#mAmt').value), err = n <= 0 ? 'Enter an amount greater than zero.' : n > 25000 ? 'Single top-ups are limited to $25,000.' : '';
        $('#mErr').textContent = err; $('#mAmt').closest('.field').classList.toggle('is-bad', !!err);
        if (err) return;
        const from = $('#mFrom').value;
        addTx(`Top up from ${from.split(' ••')[0]}`, 'Top up', n, from);
        success(`${fmt(n)} added`, `Your Everyday balance is now <b>${fmt(acct('everyday').bal)}</b>.`);
      };
    }
    if (type === 'exchange') {
      const rate = 1 / EUR;
      openModal(`
        <p class="m-eyebrow">Everyday → Euro wallet</p><h3>Exchange</h3><p class="m-sub">Mid-market rate, no markup on your first $5,000 each month.</p>
        <form id="mForm" novalidate>
          <div class="field-row"><label class="field"><span>You send (USD)</span><input id="mAmt" inputmode="decimal" placeholder="0.00" autocomplete="off" value="500"></label><label class="field"><span>You get (EUR)</span><input id="mGet" readonly tabindex="-1"></label></div>
          <div class="m-rate"><span>Rate</span><b>1 USD = ${rate.toFixed(4)} EUR</b></div>
          <p class="m-err" id="mErr"></p>
          <button class="btn btn-primary btn-block" type="submit">Exchange now<i data-lucide="repeat-2"></i></button>
        </form>`);
      const calc = () => { $('#mGet').value = '€' + (parseAmt($('#mAmt').value) * rate).toFixed(2); };
      calc(); $('#mAmt').oninput = calc;
      $('#mForm').onsubmit = e => {
        e.preventDefault();
        const n = parseAmt($('#mAmt').value), err = validateAmt(n);
        $('#mErr').textContent = err; $('#mAmt').closest('.field').classList.toggle('is-bad', !!err);
        if (err) return;
        const eur = Math.round(n * rate * 100) / 100;
        acct('euro').bal = Math.round((acct('euro').bal + eur) * 100) / 100;
        addTx('Exchange USD → EUR', 'Transfers', -n, 'Everyday •• 4281');
        success(`€${eur.toFixed(2)} added to Euro wallet`, `${fmt(n)} converted at ${rate.toFixed(4)}. Your Euro wallet holds <b>€${acct('euro').bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>.`);
      };
    }
  }

  function openGoal(id) {
    const g = GOALS.find(x => x.id === id), left = Math.max(0, g.target - g.saved);
    openModal(`
      <p class="m-eyebrow">Savings goal · ${Math.round(g.saved / g.target * 100)}% funded</p><h3>${g.name}</h3><p class="m-sub">${fmt(left, 0)} to go. Money moves from Everyday (${fmt(acct('everyday').bal)} available).</p>
      <form id="mForm" novalidate>
        <label class="field"><span>Amount to add (USD)</span><input id="mAmt" inputmode="decimal" placeholder="0.00" autocomplete="off" value="200"></label>
        <p class="m-err" id="mErr"></p>
        <button class="btn btn-primary btn-block" type="submit">Add to goal<i data-lucide="plus"></i></button>
      </form>`);
    $('#mForm').onsubmit = e => {
      e.preventDefault();
      const n = parseAmt($('#mAmt').value), err = validateAmt(n);
      $('#mErr').textContent = err; $('#mAmt').closest('.field').classList.toggle('is-bad', !!err);
      if (err) return;
      g.saved = Math.round((g.saved + n) * 100) / 100;
      acct('reserve').bal = Math.round((acct('reserve').bal + n) * 100) / 100;
      addTx(`Goal · ${g.name}`, 'Transfers', -n, 'Everyday •• 4281');
      success(`${fmt(n)} added to ${g.name}`, g.saved >= g.target ? 'Goal reached — well done.' : `You are now <b>${Math.round(g.saved / g.target * 100)}%</b> of the way there.`);
    };
  }

  /* ---------- Events ---------- */
  function closePops(except) { $$('.pop.is-open').forEach(p => { if (p !== except) { p.classList.remove('is-open'); p.previousElementSibling.setAttribute('aria-expanded', 'false'); } }); }
  function togglePop(btn, pop) { const open = !pop.classList.contains('is-open'); closePops(); pop.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open); }
  function setPrivate(on) {
    document.body.classList.toggle('is-private', on);
    $('#privacySwitch').classList.toggle('is-on', on);
    $('#eyeBtn').innerHTML = `<i data-lucide="${on ? 'eye-off' : 'eye'}"></i>`;
    $('#eyeBtn').setAttribute('aria-label', on ? 'Show balance' : 'Hide balance');
    icons();
  }

  function bind() {
    document.addEventListener('click', e => {
      const t = e.target;
      const viewBtn = t.closest('[data-view]');
      if (viewBtn && viewBtn.closest('#tabs, .brand')) { e.preventDefault(); setView(viewBtn.dataset.view); return; }
      const go = t.closest('[data-goto]');
      if (go) { e.preventDefault(); closePops(); setView(go.dataset.goto); return; }
      const act = t.closest('[data-action]');
      if (act) { openAction(act.dataset.action); return; }
      if (t.closest('[data-close]')) { closeModal(); return; }
      const a = t.closest('[data-acct]'); if (a) { openAccount(a.dataset.acct); return; }
      const tx = t.closest('[data-tx]'); if (tx) { openTx(tx.dataset.tx); return; }
      const g = t.closest('[data-goal]'); if (g) { openGoal(g.dataset.goal); return; }
      const bill = t.closest('[data-bill]');
      if (bill) {
        const b = BILLS.find(x => x.id === bill.dataset.bill);
        if (b.amt > acct('everyday').bal) { toast('Not enough in Everyday to pay this bill', 'circle-alert'); return; }
        b.paid = true; addTx(b.name, b.cat, -b.amt, 'Bank transfer'); toast(`${b.name} paid · ${fmt(b.amt)}`);
        return;
      }
      const cat = t.closest('#cats [data-cat]'); if (cat) { setCat(cat.dataset.cat, true); return; }
      const arc = t.closest('.seg-arc'); if (arc) { const c = spendData.list[+arc.dataset.i]; if (c && !c.other) setCat(c.name, true); return; }
      const p = t.closest('#people [data-person]'); if (p) { state.person = p.dataset.person; renderPeople(); return; }
      const pay = t.closest('.pay');
      if (pay) { const id = pay.dataset.card, o = state.cardOrder; if (o[0] !== id) { while (o[0] !== id) o.push(o.shift()); state.reveal = false; renderCards(false); } return; }
      if (t.closest('#txReset')) { state.q = ''; state.type = 'all'; state.cat = 'all'; renderTx(); renderSpend(false); return; }
      const note = t.closest('[data-note]'); if (note) { NOTES[+note.dataset.note].unread = false; renderNotes(); return; }
      if (!t.closest('.pop-wrap')) closePops();
    });

    $('#rangeSeg').addEventListener('click', e => { const b = e.target.closest('[data-range]'); if (b) setRange(b.dataset.range); });
    $('#flowLegend').addEventListener('click', e => {
      const b = e.target.closest('[data-series]'); if (!b) return;
      const k = b.dataset.series, other = k === 'income' ? 'expense' : 'income';
      if (state.series[k] && !state.series[other]) { toast('Keep at least one series visible', 'info'); return; }
      state.series[k] = !state.series[k]; b.classList.toggle('is-on', state.series[k]); drawFlow(true);
    });
    const chart = $('#flowChart');
    chart.addEventListener('mousemove', flowHover);
    chart.addEventListener('mouseleave', () => { $('#flowTip').classList.remove('is-on'); $$('.col.is-hot').forEach(c => c.classList.remove('is-hot')); });

    const hov = e => { const el = e.target.closest('[data-i]'); donutFocus(el ? +el.dataset.i : -1); };
    $('#donut').addEventListener('mouseover', hov); $('#donut').addEventListener('mouseleave', () => donutFocus(-1));
    $('#cats').addEventListener('mouseover', hov); $('#cats').addEventListener('mouseleave', () => donutFocus(-1));
    $('#spendClear').addEventListener('click', () => { state.cat = 'all'; renderTx(); renderSpend(false); });

    $('#cardPrev').addEventListener('click', () => rotateCards(-1));
    $('#cardNext').addEventListener('click', () => rotateCards(1));
    $('#freezeBtn').addEventListener('click', () => { const c = topCard(); c.frozen = !c.frozen; renderCards(false); toast(c.frozen ? `${c.name} frozen — payments are blocked` : `${c.name} is active again`, c.frozen ? 'snowflake' : 'check'); });
    $('#onlineBtn').addEventListener('click', () => { const c = topCard(); c.online = !c.online; renderCards(false); toast(`Online payments ${c.online ? 'enabled' : 'disabled'} for ${c.name}`, 'globe'); });
    $('#revealBtn').addEventListener('click', () => { state.reveal = !state.reveal; renderCards(false); });
    $('#limitRange').addEventListener('input', e => { topCard().limit = +e.target.value; renderCards(false); });
    $('#limitRange').addEventListener('change', e => toast(`${topCard().name} limit set to ${fmt(+e.target.value, 0)} a month`, 'sliders-horizontal'));

    $('#presets').addEventListener('click', e => { const b = e.target.closest('[data-amt]'); if (b) { $('#transferAmount').value = (+b.dataset.amt).toFixed(2); $('#transferMsg').textContent = ''; } });
    $('#transferAmount').addEventListener('input', () => { $('#transferMsg').textContent = ''; });
    $('#transferForm').addEventListener('submit', e => {
      e.preventDefault();
      const n = parseAmt($('#transferAmount').value), err = validateAmt(n), msg = $('#transferMsg'), p = person(state.person);
      msg.className = 'form-msg'; msg.textContent = err;
      if (err) { if (hasGsap) gsap.fromTo('.amount', { x: -7 }, { x: 0, duration: .5, ease: 'elastic.out(1, .35)' }); return; }
      addTx(`Transfer to ${p.full}`, 'Transfers', -n, 'Everyday •• 4281');
      $('#transferAmount').value = ''; msg.className = 'form-msg is-ok'; msg.textContent = `${fmt(n)} sent to ${p.full}.`;
      toast(`${fmt(n)} sent to ${p.name}`, 'send');
    });

    const onSearch = v => { state.q = v; state.shown = 14; if (!$('#pTx').dataset.views.split(' ').includes(state.view)) setView('transactions'); else renderTx(); };
    $('#txSearch').addEventListener('input', e => onSearch(e.target.value));
    $('#globalSearch').addEventListener('input', e => { if (state.view === 'overview' && e.target.value) { state.q = e.target.value; setView('transactions', { keepScroll: true }); e.target.focus(); } else onSearch(e.target.value); });
    $('.search').addEventListener('click', () => { if (getComputedStyle($('#globalSearch')).display === 'none') { setView('transactions'); $('#txSearch').focus(); } });
    $('#typeSeg').addEventListener('click', e => { const b = e.target.closest('[data-type]'); if (b) { state.type = b.dataset.type; state.shown = 14; renderTx(); } });
    $('#catSelect').addEventListener('change', e => { state.cat = e.target.value; state.shown = 14; renderTx(); renderSpend(false); });
    $('#exportBtn').addEventListener('click', () => exportCsv(filtered()));
    $('#txMore').addEventListener('click', () => { if (state.view === 'overview') setView('transactions'); else { state.shown += 12; renderTx(); } });

    $('#bellBtn').addEventListener('click', () => togglePop($('#bellBtn'), $('#bellPop')));
    $('#meBtn').addEventListener('click', () => togglePop($('#meBtn'), $('#mePop')));
    $('#markRead').addEventListener('click', () => { NOTES.forEach(n => { n.unread = false; }); renderNotes(); });
    $('#privacyBtn').addEventListener('click', () => setPrivate(!document.body.classList.contains('is-private')));
    $('#eyeBtn').addEventListener('click', () => setPrivate(!document.body.classList.contains('is-private')));
    $('#statementBtn').addEventListener('click', () => { closePops(); exportCsv(inRange(), 'halden-statement.csv'); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { if ($('#modal').classList.contains('is-open')) closeModal(); else closePops(); }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        const g = $('#globalSearch');
        if (getComputedStyle(g).display === 'none') { setView('transactions'); $('#txSearch').focus(); } else g.focus();
      }
    });
    window.addEventListener('scroll', () => $('#top').classList.toggle('is-stuck', window.scrollY > 6), { passive: true });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { movePill(); drawFlow(false); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
  }

  /* ---------- Init ---------- */
  function init() {
    icons();
    renderNotes(); renderPeople(); renderCards(true);
    $$('.panel[data-views]').forEach(p => p.classList.toggle('is-hidden', !p.dataset.views.split(' ').includes('overview')));
    bind(); movePill();
    const loader = $('#loader');
    if (!hasGsap) { loader.remove(); renderAll(false); return; }
    renderAll(false);
    $('#balanceNum').innerHTML = balanceHtml(0); shownTotal = 0;
    gsap.set('.panel:not(.is-hidden)', { y: 30, opacity: 0 });
    gsap.set(['.top > *', '.head > *'], { opacity: 0, y: -10 });
    gsap.timeline()
      .to('.loader-bar span', { scaleX: 1, duration: .8, ease: 'power2.inOut' })
      .to('.loader-mark', { scale: .8, opacity: 0, duration: .35, ease: 'power2.in' }, '-=.1')
      .to(loader, { yPercent: -100, duration: .8, ease: 'power4.inOut', onComplete: () => loader.remove() })
      .to(['.top > *', '.head > *'], { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .06, clearProps: 'transform,opacity' }, '-=.45')
      .to('.panel:not(.is-hidden)', { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .06, clearProps: 'transform,opacity' }, '-=.55')
      .add(() => { renderBalance(true); drawFlow(true); renderSpend(true); movePill(); }, '-=.9');
  }
  init();
})();
