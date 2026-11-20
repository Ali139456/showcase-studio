/* OFFCOURT — sneaker boutique */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const icons = () => window.lucide && lucide.createIcons();
  const img = id => `assets/p-${id}.jpg`;

  /* ---------- Catalogue ---------- */
  const P = [
    { id: 'free-red', brand: 'Nike', name: 'Free RN Flyknit', color: 'University Red', price: 140, cat: 'running', tag: 'New', sw: ['#c8102e', '#7a0f1c', '#f4f4f4'], o: ['58%', '40%'], desc: 'A sock-like Flyknit upper on the most flexible sole Nike makes. Light, breathable and built to move the way your foot does.' },
    { id: 'af1-wheat', brand: 'Nike', name: "Air Force 1 '07", color: 'Flax / Gum', price: 135, cat: 'lifestyle', sw: ['#b7793e', '#1d1d1d'], o: ['50%', '45%'], desc: 'The 1982 original in buttery nubuck with a gum outsole. A winter staple that only looks better with wear.' },
    { id: 'af1-pastel', brand: 'Nike', name: 'Air Force 1 Shadow', color: 'Pastel Multi', price: 130, cat: 'lifestyle', tag: 'New', sw: ['#c9c2f2', '#f6d9a8', '#f3c6cf'], o: ['48%', '52%'], desc: 'Doubled-up overlays, a stacked midsole and soft sorbet tones give the Shadow its layered, playful look.' },
    { id: 'airmax-ember', brand: 'Nike', name: 'Air Max 1', color: 'Sail / Habanero', price: 150, cat: 'running', sw: ['#f0ece2', '#ef5b2a'], o: ['52%', '50%'], desc: 'The shoe that first made Air visible. Mesh and suede in sail with a bright habanero mudguard.' },
    { id: 'superrep-volt', brand: 'Nike', name: 'SuperRep Go', color: 'Volt / Black', price: 110, cat: 'running', tag: 'New', sw: ['#b3e140', '#111111'], o: ['42%', '62%'], desc: 'Cushioned for circuits and short runs, with a rocker arc underfoot that keeps you moving between sets.' },
    { id: 'oldskool', brand: 'Vans', name: 'Old Skool Lite', color: 'Port Royale', price: 75, cat: 'skate', sw: ['#5c1a2b', '#ffffff'], o: ['48%', '42%'], desc: 'The first Vans to wear the sidestripe, rebuilt on a featherweight sole. Canvas and suede in deep burgundy.' },
    { id: 'j1-chicago', brand: 'Jordan', name: 'Air Jordan 1 Mid', color: 'White / Gym Red', price: 135, cat: 'basketball', tag: 'Low stock', sw: ['#ffffff', '#c8102e', '#111111'], o: ['56%', '58%'], desc: 'Premium leather in the colour blocking that started it all. Padded collar, Air-Sole unit, wings on the ankle.' },
    { id: 'nb-rose', brand: 'New Balance', name: 'X-90 Reconstructed', color: 'Rose / Sea Salt', price: 120, cat: 'lifestyle', sw: ['#e7a9b0', '#f1ece4'], o: ['50%', '46%'], desc: 'Nineties running lines pulled apart and rebuilt, with a sculpted midsole and soft suede overlays.' },
    { id: 'zoom-black', brand: 'Nike', name: 'Zoom Gravity', color: 'Triple Black', price: 160, cat: 'running', sw: ['#111111'], o: ['48%', '50%'], desc: 'A stripped-back daily runner with a responsive Zoom unit in the forefoot and a blacked-out engineered mesh.' },
    { id: 'kyrie', brand: 'Nike', name: 'Kyrie 7', color: 'Black / White', price: 130, cat: 'basketball', sw: ['#161616', '#ffffff'], o: ['50%', '54%'], desc: 'Built for the quickest first step in the game. A 360° traction pattern grips through every change of direction.' },
    { id: 'nb-olive', brand: 'New Balance', name: '247 Classic', color: 'Olive / White', price: 95, cat: 'lifestyle', sw: ['#6f7352', '#ffffff'], o: ['46%', '52%'], desc: 'A bootie-fit upper on a REVlite midsole — made for the full twenty-four hours, seven days a week.' },
    { id: 'chuck-red', brand: 'Converse', name: 'Chuck 70 Hi', color: 'Enamel Red', price: 90, cat: 'skate', sw: ['#c1272d', '#f3efe6'], o: ['48%', '56%'], desc: 'Heavier canvas, higher rubber foxing and a cushioned footbed. The Chuck, the way it was made in 1970.' },
    { id: 'dunk-pastel', brand: 'Nike', name: 'Dunk High Up', color: 'Sail / Cashmere', price: 145, cat: 'basketball', tag: 'New', sw: ['#efe6d6', '#f2a48f', '#a9c3d6'], o: ['54%', '62%'], desc: 'The college court icon with a lifted midsole and tonal layered Swooshes in soft washed colours.' },
    { id: 'j12-red', brand: 'Jordan', name: 'Air Jordan 12 Retro', color: 'Gym Red', price: 200, cat: 'basketball', tag: 'New', sw: ['#c8102e'], o: ['50%', '50%'], desc: 'Tumbled leather with the radiating stitch lines inspired by the Rising Sun flag, in head-to-toe red.' },
    { id: 'airmax-violet', brand: 'Nike', name: 'Air Max 90', color: 'Persian Violet', price: 160, cat: 'running', tag: 'New', sw: ['#5b53d6', '#1a1a2e'], o: ['50%', '54%'], desc: 'Waffle outsole, stitched overlays and the big-window Air unit, washed in electric violet.' },
    { id: 'af1-black', brand: 'Nike', name: 'Air Force 1 Utility', color: 'Black / White', price: 145, cat: 'lifestyle', sw: ['#111111', '#ffffff'], o: ['50%', '56%'], desc: 'Workwear details on a court classic — woven strap, oversized Swoosh and a hard-wearing leather upper.' },
    { id: 'af1-court', brand: 'Nike', name: 'Air Force 1 React', color: 'White / University Red', price: 150, cat: 'basketball', sw: ['#ffffff', '#c8102e', '#1f3fa8'], o: ['48%', '52%'], desc: 'React foam meets visible Air for an AF1 that finally feels as light as it looks.' },
    { id: 'court-white', brand: 'Nike', name: 'Court Vintage', color: 'Triple White', price: 85, cat: 'lifestyle', sw: ['#ffffff'], o: ['52%', '48%'], desc: 'Clean tennis lines in soft full-grain leather. The white sneaker you reach for without thinking.' }
  ];
  const byId = id => P.find(p => p.id === id);
  const SIZES = ['6', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12'];
  const soldOut = (id, i) => (id.length * 7 + i * 13) % 6 === 0;

  /* ---------- State ---------- */
  const cart = []; const wish = new Set();
  let cat = 'all', sort = 'featured', limit = 12, quickId = null, quickSize = null;

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg, icon = 'check') {
    const t = $('#toast'); t.innerHTML = `<i data-lucide="${icon}"></i><span>${msg}</span>`; icons();
    t.classList.add('is-show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-show'), 2600);
  }

  /* ---------- Cards ---------- */
  const cardHTML = p => `<article class="card" data-id="${p.id}">
    <div class="card-media" style="--ox:${p.o[0]};--oy:${p.o[1]}">
      <img class="img-a" src="${img(p.id)}" alt="${p.brand} ${p.name} in ${p.color}" loading="lazy">
      <img class="img-b" src="${img(p.id)}" alt="" loading="lazy" aria-hidden="true">
      ${p.tag ? `<span class="badge ${p.tag === 'Low stock' ? 'is-hot' : ''}">${p.tag}</span>` : ''}
      <button class="wish ${wish.has(p.id) ? 'is-on' : ''}" data-wish="${p.id}" aria-label="Save ${p.name}"><i data-lucide="heart"></i></button>
      <button class="card-quick" data-quick="${p.id}"><span>Quick view</span><i data-lucide="plus"></i></button>
    </div>
    <div class="card-info"><div><small>${p.brand}</small><h3>${p.name}</h3><p>${p.color}</p><div class="swatches">${p.sw.map(c => `<i style="--c:${c}"></i>`).join('')}</div></div><b>$${p.price}</b></div>
  </article>`;

  function getList() {
    let list = P.filter(p => cat === 'all' || p.cat === cat);
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'new') list = [...list].sort((a, b) => (b.tag === 'New') - (a.tag === 'New'));
    return list;
  }
  function renderGrid(animate = true) {
    const list = getList(), shown = list.slice(0, limit);
    $('#grid').innerHTML = shown.length ? shown.map(cardHTML).join('') : `<p class="grid-empty">Nothing in this category right now — check back after the next drop.</p>`;
    $('#shopCount').textContent = list.length;
    $('.more').classList.toggle('is-hidden', list.length <= limit);
    icons();
    if (animate && hasGsap) gsap.fromTo('#grid .card', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out', clearProps: 'transform' });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  function setCat(c, jump) {
    cat = c; $$('.chip').forEach(b => b.classList.toggle('is-active', b.dataset.cat === c));
    renderGrid();
    if (jump) $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  function renderRail() {
    const list = ['free-red', 'superrep-volt', 'af1-pastel', 'dunk-pastel', 'j12-red', 'airmax-violet'].map(byId);
    $('#rail').innerHTML = list.map((p, i) => `<article class="rail-card" data-id="${p.id}">
      <div class="rail-media" data-quick="${p.id}"><img src="${img(p.id)}" alt="${p.brand} ${p.name} in ${p.color}" draggable="false"><span class="rail-num">0${i + 1}</span><button class="rail-add" data-quick="${p.id}" aria-label="Quick view ${p.name}"><i data-lucide="plus"></i></button></div>
      <div class="rail-info"><div><small>${p.brand}</small><h3>${p.name}</h3><p>${p.color}</p></div><b>$${p.price}</b></div>
    </article>`).join('');
  }

  /* ---------- Overlays ---------- */
  const scrim = $('#scrim');
  function closeAll() {
    $$('.drawer, .modal, .search').forEach(el => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); });
    scrim.classList.remove('is-open'); document.body.classList.remove('is-locked');
  }
  function open(el) { closeAll(); el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); scrim.classList.add('is-open'); document.body.classList.add('is-locked'); }
  scrim.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => e.key === 'Escape' && closeAll());
  $('#quick').addEventListener('click', e => { if (e.target.id === 'quick') closeAll(); });

  /* ---------- Quick view ---------- */
  function openQuick(id) {
    const p = byId(id); if (!p) return;
    quickId = id; quickSize = null;
    const media = $('.qv-media'); media.classList.remove('is-zoom'); media.style.setProperty('--ox', p.o[0]); media.style.setProperty('--oy', p.o[1]);
    $('#qvImg').src = img(id); $('#qvImg').alt = `${p.brand} ${p.name} in ${p.color}`;
    $('#qvThumbs').innerHTML = [0, 1].map(i => `<button class="${i ? '' : 'is-active'}" data-zoom="${i}" aria-label="${i ? 'Detail view' : 'Full view'}"><img src="${img(id)}" alt=""></button>`).join('');
    $('#qvBrand').textContent = `${p.brand} — ${p.cat}`; $('#qvName').textContent = p.name; $('#qvColor').textContent = p.color;
    $('#qvPrice').textContent = `$${p.price}`; $('#qvDesc').textContent = p.desc; $('#qvSizeMsg').textContent = '';
    $('#qvSizes').innerHTML = SIZES.map((s, i) => `<button data-size="${s}" ${soldOut(id, i) ? 'disabled aria-label="Size ' + s + ' sold out"' : ''}>${s}</button>`).join('');
    $('#qvWish').classList.toggle('is-on', wish.has(id));
    open($('#quick'));
    if (hasGsap) gsap.from('.qv-info > *', { y: 18, opacity: 0, duration: .5, stagger: .045, delay: .15, ease: 'power3.out', clearProps: 'all' });
  }
  $('#qvThumbs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#qvThumbs button').forEach(x => x.classList.toggle('is-active', x === b));
    $('.qv-media').classList.toggle('is-zoom', b.dataset.zoom === '1');
  });
  $('#qvSizes').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    quickSize = b.dataset.size; $$('#qvSizes button').forEach(x => x.classList.toggle('is-active', x === b)); $('#qvSizeMsg').textContent = '';
  });
  $('#qvAdd').addEventListener('click', () => {
    if (!quickSize) {
      $('#qvSizeMsg').textContent = 'Please choose a size';
      const s = $('#qvSizes'); s.classList.remove('is-shake'); void s.offsetWidth; s.classList.add('is-shake'); return;
    }
    addToCart(quickId, quickSize); open($('#cart'));
  });
  $('#qvWish').addEventListener('click', () => toggleWish(quickId));

  /* ---------- Wishlist ---------- */
  function toggleWish(id) {
    wish.has(id) ? wish.delete(id) : wish.add(id);
    $$(`[data-wish="${id}"]`).forEach(b => b.classList.toggle('is-on', wish.has(id)));
    if (quickId === id) $('#qvWish').classList.toggle('is-on', wish.has(id));
    const c = $('#wishCount'); c.textContent = wish.size; c.classList.toggle('is-zero', !wish.size);
    toast(wish.has(id) ? `${byId(id).name} saved to wishlist` : 'Removed from wishlist', 'heart');
  }

  /* ---------- Cart ---------- */
  const FREE = 150;
  function addToCart(id, size) {
    const ex = cart.find(l => l.id === id && l.size === size);
    ex ? ex.qty++ : cart.push({ id, size, qty: 1 });
    renderCart(); toast(`${byId(id).name} · US ${size} added to cart`, 'shopping-bag');
    if (hasGsap) gsap.fromTo('#cartCount', { scale: 1.6 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
  }
  function renderCart() {
    const count = cart.reduce((a, l) => a + l.qty, 0), total = cart.reduce((a, l) => a + l.qty * byId(l.id).price, 0);
    const cc = $('#cartCount'); cc.textContent = count; cc.dataset.n = count;
    $('#cartHeadCount').textContent = `(${count})`; $('#cartTotal').textContent = `$${total.toLocaleString('en-US')}`;
    $('#cartFoot').style.display = cart.length ? '' : 'none'; $('.ship').style.display = cart.length ? '' : 'none';
    $('#shipText').innerHTML = total >= FREE ? 'You have unlocked <b>free express shipping</b>.' : `Add <b>$${FREE - total}</b> more for free express shipping.`;
    const bar = $('#shipBar'); bar.style.width = Math.min(100, total / FREE * 100) + '%'; bar.classList.toggle('is-full', total >= FREE);
    $('#cartBody').innerHTML = cart.length ? cart.map((l, i) => {
      const p = byId(l.id);
      return `<div class="cart-line"><div class="line-img"><img src="${img(p.id)}" alt=""></div>
        <div><h4>${p.name}</h4><small>${p.color} · US ${l.size}</small><div class="qty"><button data-q="-1" data-i="${i}" aria-label="Decrease"><i data-lucide="minus"></i></button><span>${l.qty}</span><button data-q="1" data-i="${i}" aria-label="Increase"><i data-lucide="plus"></i></button></div></div>
        <div class="line-side"><b>$${p.price * l.qty}</b><button class="line-rm" data-rm="${i}">Remove</button></div></div>`;
    }).join('') : `<div class="cart-empty"><i data-lucide="shopping-bag"></i><strong>Nothing here yet</strong><p>Your cart is empty. The good pairs go fast.</p><button class="btn btn-solid" data-close data-goto="#shop"><span>Shop all</span><i data-lucide="arrow-up-right"></i></button></div>`;
    icons();
  }
  $('#cartBody').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty < 1) cart.splice(+q.dataset.i, 1); renderCart(); }
    if (rm) { cart.splice(+rm.dataset.rm, 1); renderCart(); }
  });
  $('#checkout').addEventListener('click', () => {
    const total = $('#cartTotal').textContent, n = 'OC-' + String(Date.now()).slice(-6);
    cart.length = 0; renderCart();
    $('#cartBody').innerHTML = `<div class="cart-empty"><i data-lucide="package-check"></i><strong>Order confirmed</strong><p>Order ${n} · ${total}<br>A confirmation is on its way to your inbox. Your pairs ship within 24 hours.</p><button class="btn btn-solid" data-close><span>Keep browsing</span><i data-lucide="arrow-up-right"></i></button></div>`;
    icons();
    if (hasGsap) gsap.from('#cartBody .cart-empty > *', { y: 20, opacity: 0, duration: .5, stagger: .07, ease: 'power3.out' });
  });

  /* ---------- Search / wishlist panel ---------- */
  const searchRow = p => `<li class="search-item" data-quick="${p.id}"><span><img src="${img(p.id)}" alt=""></span><div><strong>${p.name}</strong><small>${p.brand} · ${p.color}</small></div><b>$${p.price}</b></li>`;
  function renderSearch(mode) {
    const q = $('#searchInput').value.trim().toLowerCase();
    let list, hint;
    if (mode === 'saved' && !q) { list = P.filter(p => wish.has(p.id)); hint = list.length ? `Saved pairs (${list.length})` : 'Your wishlist is empty — tap the heart on any pair to save it'; }
    else if (!q) { list = P.slice(0, 6); hint = 'Popular right now'; }
    else { list = P.filter(p => `${p.brand} ${p.name} ${p.color} ${p.cat}`.toLowerCase().includes(q)).slice(0, 8); hint = `${list.length} result${list.length === 1 ? '' : 's'} for “${q}”`; }
    $('#searchHint').textContent = hint;
    $('#searchList').innerHTML = list.length ? list.map(searchRow).join('') : (q ? `<li class="search-none">No pairs match that search. Try “Jordan”, “running” or “red”.</li>` : '');
  }
  let searchMode = 'search';
  function openSearch(mode) { searchMode = mode; $('#searchInput').value = ''; renderSearch(mode); open($('#search')); if (mode === 'search') setTimeout(() => $('#searchInput').focus(), 350); }
  $('#searchInput').addEventListener('input', () => renderSearch(searchMode));
  $('#searchOpen').addEventListener('click', () => openSearch('search'));
  $('#wishOpen').addEventListener('click', () => openSearch('saved'));

  /* ---------- Global delegation ---------- */
  let dragged = false;
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]'); if (w) { e.stopPropagation(); toggleWish(w.dataset.wish); return; }
    const q = e.target.closest('[data-quick]'); if (q) { if (dragged) return; openQuick(q.dataset.quick); return; }
    const c = e.target.closest('[data-close]'); if (c) { closeAll(); if (c.dataset.goto) $(c.dataset.goto).scrollIntoView({ behavior: 'smooth' }); return; }
    const j = e.target.closest('[data-filter-jump]'); if (j) { e.preventDefault(); setCat(j.dataset.filterJump, true); return; }
    const m = e.target.closest('.card-media'); if (m && !dragged) openQuick(m.parentElement.dataset.id);
  });
  $('#chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) setCat(b.dataset.cat); });
  $('#sort').addEventListener('change', e => { sort = e.target.value; renderGrid(); });
  $('#loadMore').addEventListener('click', () => {
    const before = $$('#grid .card').length; limit = Infinity; renderGrid(false);
    if (hasGsap) gsap.fromTo($$('#grid .card').slice(before), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'power3.out', clearProps: 'transform' });
  });
  $('#cartOpen').addEventListener('click', () => open($('#cart')));
  $('#menuOpen').addEventListener('click', () => open($('#menu')));
  $$('.menu-links a').forEach(a => a.addEventListener('click', closeAll));

  /* ---------- Club form ---------- */
  $('#clubForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#clubEmail').value.trim(), msg = $('#clubMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = 'That email doesn’t look right — try again.'; $('#clubEmail').focus(); return; }
    msg.textContent = `You’re in. Early access details are heading to ${v}.`; $('#clubEmail').value = '';
    toast('Welcome to the Club', 'party-popper');
  });

  /* ---------- Rail drag ---------- */
  const rail = $('#rail'); let down = false, sx = 0, sl = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; dragged = false; sx = e.clientX; sl = rail.scrollLeft; });
  window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 6) { dragged = true; rail.classList.add('is-drag'); } if (dragged) rail.scrollLeft = sl - dx; });
  window.addEventListener('pointerup', () => { if (!down) return; down = false; rail.classList.remove('is-drag'); setTimeout(() => dragged = false, 30); });
  const railStep = () => ($('.rail-card')?.offsetWidth || 400) + 18;
  $('#railPrev').addEventListener('click', () => rail.scrollBy({ left: -railStep(), behavior: 'smooth' }));
  $('#railNext').addEventListener('click', () => rail.scrollBy({ left: railStep(), behavior: 'smooth' }));

  /* ---------- Hero slider ---------- */
  const SLIDES = [
    { id: 'free-red', cls: 'is-red', bg: '#cc051c', fg: '#ffffff', inv: '#0d0d0d', lines: ['Free', 'Run', 'Flyknit'], eyebrow: 'Drop 047 — Just landed', desc: 'A sock-like Flyknit upper on the most flexible sole Nike makes. Built to move the way your foot does.', specs: [['Weight', '221 g'], ['Heel drop', '8 mm'], ['Upper', 'Flyknit']] },
    { id: 'superrep-volt', cls: 'is-volt', bg: '#b3e140', fg: '#0d0d0d', inv: '#ffffff', lines: ['Super', 'Rep', 'Go'], eyebrow: 'Training — Back in stock', desc: 'Cushioned for circuits and short runs, with a rocker arc underfoot that keeps you moving between sets.', specs: [['Weight', '286 g'], ['Heel drop', '10 mm'], ['Upper', 'Mesh']] },
    { id: 'kyrie', cls: 'is-blue', bg: '#86bedf', fg: '#0d0d0d', inv: '#ffffff', lines: ['Kyrie', 'Seven'], eyebrow: 'Basketball — Restock', desc: 'Built for the quickest first step in the game. 360° traction that grips through every change of direction.', specs: [['Weight', '354 g'], ['Cushioning', 'Zoom Turbo'], ['Cut', 'Mid']] }
  ];
  let slide = 0, busy = false, autoTween = null;
  const heroImgs = SLIDES.map(s => $(`.hero-img.${s.cls}`));
  function fillHero(i) {
    const s = SLIDES[i], p = byId(s.id);
    $('#heroTitle').innerHTML = s.lines.map((l, k) => `<span class="line ${k === 1 ? 'is-outline' : ''}"><span>${l}</span></span>`).join('');
    $('#heroEyebrow').textContent = s.eyebrow; $('#heroDesc').textContent = s.desc;
    $('#heroBrand').textContent = p.brand; $('#heroName').textContent = p.name; $('#heroColor').textContent = p.color; $('#heroPrice').textContent = `$${p.price}`;
    $('#heroSpecs').innerHTML = s.specs.map(x => `<li><small>${x[0]}</small>${x[1]}</li>`).join('');
    $('#heroIndex').textContent = `0${i + 1}`;
    document.documentElement.style.setProperty('--hfg', s.fg); document.documentElement.style.setProperty('--hinv', s.inv);
    $$('#heroDots button').forEach((b, k) => { b.classList.toggle('is-active', k === i); $('i', b).style.setProperty('--p', k < i ? 1 : 0); });
    $('#hero').dataset.slide = i;
  }
  function startAuto() {
    if (!hasGsap) return;
    if (autoTween) autoTween.kill();
    const bar = $('#heroDots button.is-active i');
    autoTween = gsap.fromTo(bar, { '--p': 0 }, { '--p': 1, duration: 6.5, ease: 'none', onComplete: () => go(slide + 1) });
  }
  function go(n, dir = 1) {
    n = (n + SLIDES.length) % SLIDES.length;
    if (busy || n === slide) return;
    const prev = heroImgs[slide], next = heroImgs[n]; slide = n;
    if (!hasGsap) { heroImgs.forEach(i => i.classList.remove('is-active')); next.classList.add('is-active'); $('#heroBg').style.background = SLIDES[n].bg; fillHero(n); return; }
    busy = true; if (autoTween) autoTween.kill();
    gsap.timeline({ onComplete: () => { busy = false; startAuto(); } })
      .to('#heroTitle .line > span', { yPercent: -110, duration: .5, stagger: .05, ease: 'power3.in' }, 0)
      .to(['.hero-eyebrow', '.hero-sub', '#heroCard', '#heroSpecs'], { opacity: 0, y: 10, duration: .3 }, 0)
      .to(prev, { xPercent: -14 * dir, rotate: -7 * dir, autoAlpha: 0, duration: .55, ease: 'power2.in' }, 0)
      .to('#heroBg', { backgroundColor: SLIDES[n].bg, duration: .7, ease: 'power2.inOut' }, .25)
      .add(() => { fillHero(n); prev.classList.remove('is-active'); next.classList.add('is-active'); }, .55)
      .fromTo(next, { xPercent: 20 * dir, rotate: 9 * dir, autoAlpha: 0 }, { xPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.05, ease: 'power3.out' }, .55)
      .fromTo('#heroTitle .line > span', { yPercent: 110 }, { yPercent: 0, duration: .85, stagger: .07, ease: 'power4.out', immediateRender: false, clearProps: 'transform' }, .6)
      .to(['.hero-eyebrow', '.hero-sub', '#heroCard', '#heroSpecs'], { opacity: 1, y: 0, duration: .55, stagger: .05, ease: 'power2.out' }, .8);
  }
  $('#heroNext').addEventListener('click', () => go(slide + 1, 1));
  $('#heroPrev').addEventListener('click', () => go(slide - 1, -1));
  $$('#heroDots button').forEach((b, i) => b.addEventListener('click', () => go(i, i > slide ? 1 : -1)));
  $('#heroShop').addEventListener('click', () => openQuick(SLIDES[slide].id));
  $('#heroView').addEventListener('click', () => openQuick(SLIDES[slide].id));
  if (hasGsap && matchMedia('(pointer: fine)').matches) {
    const mx = gsap.quickTo('#heroMedia', 'x', { duration: .9, ease: 'power3.out' }), my = gsap.quickTo('#heroMedia', 'y', { duration: .9, ease: 'power3.out' });
    $('#hero').addEventListener('mousemove', e => { mx((e.clientX / innerWidth - .5) * -26); my((e.clientY / innerHeight - .5) * -18); });
  }

  /* ---------- Header ---------- */
  const header = $('#header'); let lastY = 0;
  function onScroll() {
    const y = scrollY, edge = $('#hero').offsetHeight - 40;
    header.classList.toggle('is-solid', y > edge);
    header.classList.toggle('is-hidden', y > edge + 200 && y > lastY && !document.body.classList.contains('is-locked'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Text splitting ---------- */
  function split(el) {
    const frag = document.createDocumentFragment();
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) { frag.append(' '); return; }
        const w = document.createElement('span'), s = document.createElement('span'); w.className = 'w'; s.textContent = t; w.append(s); frag.append(w);
      }); else frag.append(n.cloneNode(true));
    });
    el.innerHTML = ''; el.append(frag);
    return $$('.w > span', el);
  }

  /* ---------- Scroll animation ---------- */
  function scrollFx() {
    if (!hasGsap || !window.ScrollTrigger) return;
    $$('[data-split]').forEach(el => {
      const words = split(el);
      gsap.from(words, { yPercent: 115, duration: 1, stagger: .06, ease: 'power4.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('[data-parallax]').forEach(el => {
      const p = +el.dataset.parallax;
      gsap.fromTo(el, { yPercent: -p }, { yPercent: p, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.rail-card', { x: 90, opacity: 0, duration: .9, stagger: .09, ease: 'power3.out', scrollTrigger: { trigger: '#rail', start: 'top 85%' } });
    gsap.from('.filters', { y: 20, opacity: 0, duration: .6, scrollTrigger: { trigger: '.filters', start: 'top 92%' } });
    gsap.from('.banner-copy > *:not(.display)', { y: 26, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.banner-copy', start: 'top 70%' } });
    gsap.from('.story-text p, .stats li', { y: 24, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.story-text', start: 'top 85%' } });
    gsap.from('.story-media figure', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: .18, ease: 'power4.inOut', scrollTrigger: { trigger: '.story-media', start: 'top 78%' } });
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count, dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || '', o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => el.textContent = o.v.toFixed(dec) + suf });
    });
    gsap.from('.club-lead, .club-form', { y: 30, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.club-lead', start: 'top 90%' } });
    gsap.from('.footer-word', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.footer-word', start: 'top 98%' } });
    ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', onLeave: () => autoTween && autoTween.pause(), onEnterBack: () => autoTween && autoTween.resume() });
  }

  /* ---------- Promo rotation ---------- */
  function promo() {
    const track = $('#promoTrack'), n = track.children.length; let i = 0;
    track.append(track.children[0].cloneNode(true));
    setInterval(() => {
      i++;
      if (hasGsap) gsap.to(track, { y: -36 * i, duration: .6, ease: 'power3.inOut', onComplete: () => { if (i === n) { i = 0; gsap.set(track, { y: 0 }); } } });
      else { if (i === n) i = 0; track.style.transform = `translateY(${-36 * i}px)`; }
    }, 3600);
  }

  /* ---------- Init ---------- */
  $$('.chip').forEach(b => { const c = b.dataset.cat; $('sup', b).textContent = c === 'all' ? P.length : P.filter(p => p.cat === c).length; });
  fillHero(0); renderRail(); renderGrid(false); renderCart(); icons(); promo(); onScroll();

  const loader = $('#loader');
  function intro() {
    scrollFx();
    if (!hasGsap) return;
    gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete: startAuto })
      .from(heroImgs[0], { xPercent: 26, rotate: 12, opacity: 0, duration: 1.5 }, 0)
      .from('#heroTitle .line > span', { yPercent: 110, duration: 1.1, stagger: .1, clearProps: 'transform' }, .15)
      .from(['.hero-eyebrow', '.hero-sub > *', '#heroCard', '.hero-foot'], { y: 24, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' }, .55)
      .from('.header > *', { y: -20, opacity: 0, duration: .7, stagger: .06, ease: 'power3.out', clearProps: 'all' }, .4);
  }
  if (hasGsap) {
    const c = { v: 0 };
    gsap.timeline()
      .from('.loader-word', { yPercent: 110, duration: .8, ease: 'power4.out' })
      .to(c, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => $('#loaderCount').textContent = String(Math.round(c.v)).padStart(3, '0') }, .1)
      .to('.loader-wipe', { scaleY: 1, duration: .6, ease: 'power4.inOut' }, '+=.05')
      .set('.loader-inner', { opacity: 0 })
      .set(loader, { background: 'transparent' })
      .to('.loader-wipe', { scaleY: 0, transformOrigin: 'top', duration: .7, ease: 'power4.inOut' })
      .add(intro, '-=.6')
      .add(() => loader.remove());
  } else { loader.remove(); intro(); }
})();
