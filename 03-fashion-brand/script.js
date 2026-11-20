/* Maison Aurèle — editorial fashion house */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.lucide) lucide.createIcons();
  const euro = n => '€' + n.toLocaleString('en-US');

  /* ---------- Toast ---------- */
  let toastT;
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('is-show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-show'), 2600); };

  /* ---------- Boutique ---------- */
  const PRODUCTS = [
    { id: 'bomber', name: 'Suede Bomber', tone: 'Tobacco', price: 1450, cat: 'Outerwear', img: 'p-bomber', sizes: ['S', 'M', 'L', 'XL'], tag: 'New' },
    { id: 'knit', name: 'Open-Knit Poncho', tone: 'Ivoire', price: 680, cat: 'Knitwear', img: 'p-knit', sizes: ['S', 'M', 'L'] },
    { id: 'blazer', name: 'Unstructured Blazer', tone: 'Camel', price: 1250, cat: 'Tailoring', img: 'cat-tailoring', sizes: ['46', '48', '50', '52'], tag: 'New' },
    { id: 'sac', name: 'Le Petit Sac', tone: 'Vermillon', price: 1850, cat: 'Accessories', img: 'p-bag', sizes: ['One size'] },
    { id: 'leather', name: 'Lambskin Biker Jacket', tone: 'Noir', price: 2200, cat: 'Outerwear', img: 'p-leather', sizes: ['XS', 'S', 'M', 'L'] },
    { id: 'trouser', name: 'Pleated Wool Trouser', tone: 'Rose Poudré', price: 590, cat: 'Tailoring', img: 'p-trouser', sizes: ['34', '36', '38', '40'] },
    { id: 'sweat', name: 'Loopback Sweatshirt', tone: 'Craie', price: 320, cat: 'Knitwear', img: 'p-sweat', sizes: ['S', 'M', 'L', 'XL'] },
    { id: 'pump', name: 'Printed Silk Pump', tone: 'Azur', price: 740, cat: 'Accessories', img: 'p-heels', sizes: ['36', '37', '38', '39'], tag: 'Limited' },
    { id: 'tee', name: 'Pima Jersey T-Shirt', tone: 'Blanc', price: 160, cat: 'Knitwear', img: 'p-tee', sizes: ['S', 'M', 'L', 'XL'] }
  ];
  const track = $('#products'); let cat = 'All';
  function renderProducts(animate = true) {
    const list = PRODUCTS.filter(p => cat === 'All' || p.cat === cat);
    track.innerHTML = list.map(p => `<article class="prod">
      <div class="prod-media"><img src="assets/${p.img}.jpg" alt="${p.name} in ${p.tone}" loading="lazy">${p.tag ? `<span class="prod-tag">${p.tag}</span>` : ''}
        <div class="prod-sizes"><small>Add</small>${p.sizes.map(s => `<button data-add="${p.id}" data-size="${s}" aria-label="Add ${p.name}, size ${s}">${s}</button>`).join('')}</div></div>
      <div class="prod-info"><div><h3>${p.name}</h3><p>${p.cat} — ${p.tone}</p></div><b>${euro(p.price)}</b></div></article>`).join('');
    track.scrollLeft = 0; updateBar();
    if (animate && hasGsap) gsap.fromTo('.prod', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: .07, ease: 'expo.out', clearProps: 'transform' });
  }
  function updateBar() {
    const max = track.scrollWidth - track.clientWidth, bar = $('#prodBar');
    const frac = Math.min(1, track.clientWidth / track.scrollWidth);
    bar.style.width = frac * 100 + '%'; bar.style.marginLeft = (max > 0 ? track.scrollLeft / max : 0) * (1 - frac) * 100 + '%';
  }
  function setCat(c) { cat = c; $$('#tabs button').forEach(b => b.classList.toggle('is-active', b.dataset.cat === c)); renderProducts(); }
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setCat(b.dataset.cat); });
  track.addEventListener('scroll', updateBar, { passive: true });
  const step = () => ($('.prod')?.offsetWidth || 340) + 22;
  $('#prodPrev').addEventListener('click', () => track.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  $('#prodNext').addEventListener('click', () => track.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  $$('.cat').forEach(c => c.addEventListener('click', () => setCat(c.dataset.cat)));

  /* ---------- Bag ---------- */
  const bag = [];
  function renderBag() {
    const count = bag.reduce((a, l) => a + l.qty, 0), total = bag.reduce((a, l) => a + l.qty * l.p.price, 0);
    $('#bagCount').textContent = count; $('#bagTotal').textContent = euro(total); $('#bagFoot').style.display = bag.length ? '' : 'none';
    $('#bagBody').innerHTML = bag.length ? bag.map((l, i) => `<div class="bag-item"><figure><img src="assets/${l.p.img}.jpg" alt=""></figure>
      <div><h4>${l.p.name}</h4><p>${l.p.tone} · ${l.size}${l.qty > 1 ? ' · Qty ' + l.qty : ''}</p><button data-rm="${i}">Remove</button></div><b>${euro(l.p.price * l.qty)}</b></div>`).join('')
      : `<div class="bag-empty"><strong>Your bag is empty</strong><p>Twelve pieces, each made to stay. Begin with the one you will wear most.</p><a class="link-line" href="#boutique" data-bag-close><span>Visit the boutique</span></a></div>`;
  }
  const openBag = () => { $('#bag').classList.add('is-open'); $('#bag').setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('is-open'); document.body.classList.add('is-locked'); };
  const closeBag = () => { $('#bag').classList.remove('is-open'); $('#bag').setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('is-open'); document.body.classList.remove('is-locked'); };
  track.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const p = PRODUCTS.find(x => x.id === b.dataset.add), ex = bag.find(l => l.p === p && l.size === b.dataset.size);
    ex ? ex.qty++ : bag.push({ p, size: b.dataset.size, qty: 1 });
    renderBag(); openBag(); toast(`${p.name} added to your bag`);
  });
  $('#bagBody').addEventListener('click', e => {
    const rm = e.target.closest('[data-rm]'); if (rm) { bag.splice(+rm.dataset.rm, 1); renderBag(); }
    if (e.target.closest('[data-bag-close]')) closeBag();
  });
  $('#bagCheckout').addEventListener('click', () => {
    const ref = 'MA-' + String(Date.now()).slice(-5), total = $('#bagTotal').textContent;
    bag.length = 0; renderBag();
    $('#bagBody').innerHTML = `<div class="bag-empty"><strong>Merci — order ${ref}</strong><p>Your order of ${total} is confirmed. The atelier will write to you when it leaves Paris.</p><a class="link-line" href="#top" data-bag-close><span>Continue</span></a></div>`;
  });
  $('#bagOpen').addEventListener('click', openBag); $('#bagClose').addEventListener('click', closeBag); $('#scrim').addEventListener('click', closeBag);

  /* ---------- Menu ---------- */
  const menu = $('#menu'); let menuOpen = false;
  function toggleMenu(open) {
    if (open === menuOpen) return; menuOpen = open;
    $('#menuOpen').setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('is-locked', open);
    if (!hasGsap) { menu.classList.toggle('is-open', open); return; }
    gsap.killTweensOf([menu, '.menu-nav span', '.menu-preview', '.menu-foot']);
    if (open) {
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' });
      gsap.fromTo('.menu-nav span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .06, delay: .35, ease: 'expo.out' });
      gsap.fromTo('.menu-preview', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, delay: .45, ease: 'expo.inOut' });
      gsap.fromTo('.menu-foot', { opacity: 0 }, { opacity: 1, duration: .8, delay: .8 });
    } else {
      gsap.to(menu, { clipPath: 'inset(100% 0% 0% 0%)', duration: .9, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  }
  $('#menuOpen').addEventListener('click', () => toggleMenu(true));
  $('#menuClose').addEventListener('click', () => toggleMenu(false));
  $$('.menu-nav a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
    a.addEventListener('mouseenter', () => {
      const im = $('#menuImg'); if (im.getAttribute('src') === a.dataset.img) return;
      im.src = a.dataset.img;
      if (hasGsap) gsap.fromTo(im, { scale: 1.18, opacity: .4 }, { scale: 1, opacity: 1, duration: 1, ease: 'expo.out' });
    });
  });

  /* ---------- Lightbox ---------- */
  const figs = $$('[data-lightbox]'), lb = $('#lightbox'); let lbI = 0;
  function showLb(i) {
    lbI = (i + figs.length) % figs.length;
    const f = figs[lbI], im = $('img', f), cap = $('figcaption', f);
    $('#lbImg').src = im.getAttribute('src'); $('#lbImg').alt = im.alt;
    $('#lbCap').innerHTML = cap ? cap.innerHTML.replace(/<br\s*\/?>/g, ' · ') : '';
    if (hasGsap) gsap.fromTo('#lbImg', { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .8, ease: 'expo.out' });
  }
  const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); if (!menuOpen) document.body.classList.remove('is-locked'); };
  figs.forEach((f, i) => f.addEventListener('click', () => { showLb(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('is-locked'); }));
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => showLb(lbI - 1)); $('#lbNext').addEventListener('click', () => showLb(lbI + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLb(); closeBag(); toggleMenu(false); }
    if (lb.classList.contains('is-open')) { if (e.key === 'ArrowRight') showLb(lbI + 1); if (e.key === 'ArrowLeft') showLb(lbI - 1); }
  });

  /* ---------- Newsletter ---------- */
  $('#newsForm').addEventListener('submit', e => {
    e.preventDefault(); const v = $('#newsEmail').value.trim(), m = $('#newsMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { m.textContent = 'Please enter a valid email address.'; $('#newsEmail').focus(); return; }
    m.textContent = 'Thank you. The first letter arrives with the winter issue.'; $('#newsEmail').value = ''; toast('You are on the list');
  });

  /* ---------- Cursor ---------- */
  if (hasGsap && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cur = $('#cursor'); gsap.set(cur, { scale: 0 });
    const cx = gsap.quickTo(cur, 'x', { duration: .5, ease: 'power3.out' }), cy = gsap.quickTo(cur, 'y', { duration: .5, ease: 'power3.out' });
    addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener('mouseover', e => { if (e.target.closest('[data-cursor]')) gsap.to(cur, { scale: 1, duration: .5, ease: 'expo.out' }); });
    document.addEventListener('mouseout', e => { if (e.target.closest('[data-cursor]') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]'))) gsap.to(cur, { scale: 0, duration: .4, ease: 'power3.out' }); });
  }

  /* ---------- Text helpers ---------- */
  function splitLines(el) {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="l"><span>${l.trim()}</span></span>`).join('');
    return $$('.l > span', el);
  }
  function splitWords(el) {
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.append(' '); else { const s = document.createElement('span'); s.className = 'wd'; s.textContent = t; f.append(s); } });
          n.replaceWith(f);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(el); return $$('.wd', el);
  }

  /* ---------- Scroll choreography ---------- */
  function scrollFx() {
    if (!hasGsap || !window.ScrollTrigger) return;
    gsap.to('.hero-media', { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(splitWords($('#statement')), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#statement', start: 'top 82%', end: 'bottom 48%', scrub: .6 } });
    $$('[data-lines]').forEach(el => gsap.from(splitLines(el), { yPercent: 108, duration: 1.4, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    $$('.reveal').forEach(el => {
      const im = $('img', el);
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } })
        .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
        .fromTo(im, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' }, .1);
    });
    $$('[data-parallax]').forEach(im => {
      const p = +im.dataset.parallax / 2;
      gsap.fromTo(im, { yPercent: -p }, { yPercent: p, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.collection-copy > *:not(.h-xl)', { y: 30, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.collection-copy', start: 'top 80%' } });
    gsap.from('.cat', { yPercent: 14, opacity: 0, duration: 1.4, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.cat-row', start: 'top 85%' } });
    gsap.from('.ed-quote > *', { y: 40, opacity: 0, duration: 1.4, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.ed-quote', start: 'top 85%' } });
    gsap.from('.prod', { x: 80, opacity: 0, duration: 1.3, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '#products', start: 'top 88%' } });
    gsap.from('.maison-copy > *', { y: 34, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.maison-copy', start: 'top 82%' } });
    $$('[data-count]:not([data-plain])').forEach(el => {
      const o = { v: 0 }, end = +el.dataset.count, suf = el.dataset.suffix || '';
      gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => el.textContent = Math.round(o.v) + suf });
    });
    ScrollTrigger.matchMedia({
      '(min-width: 761px)': () => {
        const lt = $('#lookTrack'), dist = () => Math.max(0, lt.scrollWidth - innerWidth);
        gsap.to(lt, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: '#lookPin', pin: true, start: 'top top', end: () => '+=' + dist(), scrub: .9, invalidateOnRefresh: true, onUpdate: s => $('#lookNow').textContent = '0' + Math.min(6, 1 + Math.floor(s.progress * 6)) }
        });
      }
    });
    gsap.from('.footer-mark span', { yPercent: 35, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.footer-mark', start: 'top 100%' } });
  }

  /* ---------- Intro ---------- */
  renderProducts(false); renderBag();
  const loader = $('#loader');
  if (hasGsap) {
    document.body.classList.add('is-locked');
    gsap.set('.hero-media img', { scale: 1.3 });
    gsap.set('.hero-title .row > span', { yPercent: 115 });
    gsap.set(['.hero-top p', '.hero-foot > *', '.hero-title small', '.header > *'], { opacity: 0 });
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.loader-name > span', { yPercent: 120, duration: 1.2, stagger: .12 }, .2)
      .to('.loader-rule', { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, .5)
      .to('.loader-sub', { opacity: 1, duration: .8 }, .9)
      .to('.loader-mark', { opacity: 0, y: -16, duration: .6, ease: 'power2.in' }, 2.1)
      .to('.loader-top', { yPercent: -101, duration: 1.3, ease: 'expo.inOut' }, 2.5)
      .to('.loader-bottom', { yPercent: 101, duration: 1.3, ease: 'expo.inOut' }, 2.5)
      .add(() => { document.body.classList.remove('is-locked'); scrollFx(); }, 2.7)
      .to('.hero-media img', { scale: 1, duration: 2.6 }, 2.6)
      .to('.hero-title .row > span', { yPercent: 0, duration: 1.6, stagger: .14 }, 3)
      .to(['.header > *', '.hero-top p', '.hero-title small', '.hero-foot > *'], { opacity: 1, duration: 1.2, stagger: .08, ease: 'power2.out' }, 3.5)
      .add(() => loader.remove(), 4);
  } else loader.remove();
})();
