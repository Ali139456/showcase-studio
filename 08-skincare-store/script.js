(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const PRODUCTS = [
    { id: 'serum', name: 'Centella Barrier Serum', cat: 'treat', price: 68, img: 'p-serum', img2: 'pdp-1', desc: 'A calming concentrate with madecassoside and panthenol for redness-prone skin.' },
    { id: 'cleanser', name: 'Balm-to-Oil Cleanser', cat: 'cleanse', price: 42, img: 'p-cleanser', img2: 'col-cleanse', desc: 'Melts makeup and SPF into a milky emulsion without stripping the barrier.' },
    { id: 'essence', name: 'Dew Essence Mist', cat: 'hydrate', price: 38, img: 'p-essence', img2: 'pdp-2', desc: 'A fine mist of fermented rice water and glycerin that preps skin for serums.' },
    { id: 'oil', name: 'Night Restore Oil', cat: 'hydrate', price: 72, img: 'p-oil', img2: 'pdp-4', desc: 'Plant squalane and evening primrose seal moisture overnight.' },
    { id: 'balm', name: 'Cloud Recovery Balm', cat: 'treat', price: 54, img: 'p-balm', img2: 'pdp-3', desc: 'A whipped balm for dry patches, cuticles, and post-treatment calm.' },
    { id: 'ritual', name: 'Radiance Ritual Set', cat: 'treat', price: 148, img: 'p-ritual', img2: 'col-treat', desc: 'Cleanse, treat, and hydrate — our four bestsellers in travel-ready sizes.' }
  ];

  const REVIEWS = [
    { name: 'Amelia Cho', meta: 'Verified · Serum', img: 'av-1', text: 'My redness dialed down in two weeks. The texture is silk — not sticky, not greasy.' },
    { name: 'Sofia Rahman', meta: 'Verified · Ritual Set', img: 'av-2', text: 'I simplified to Aurelia alone and my skin looks calmer than it has in years.' },
    { name: 'Elena Voss', meta: 'Verified · Night Oil', img: 'av-3', text: 'Finally an oil that doesn’t sit on my face. Pillowcase stays clean. Skin stays soft.' },
    { name: 'Maya Okada', meta: 'Verified · Cleanser', img: 'av-4', text: 'Removes every trace of SPF and somehow leaves my barrier happier than before.' }
  ];

  let cart = JSON.parse(localStorage.getItem('aurelia-cart') || '[]');
  let qvId = null;
  let ritualPrice = 68;
  let ritualSize = '30ml';

  const icons = () => window.lucide && lucide.createIcons();
  const money = (n) => `$${n.toFixed(0)}`;

  const toast = (msg) => {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-on'), 2400);
  };

  const saveCart = () => localStorage.setItem('aurelia-cart', JSON.stringify(cart));

  const cartQty = () => cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = () => cart.reduce((a, i) => a + i.price * i.qty, 0);

  const renderCart = () => {
    const count = $('#cartCount');
    count.textContent = cartQty();
    count.classList.toggle('is-zero', cartQty() === 0);
    $('#cartSub').textContent = money(cartTotal());
    const box = $('#cartItems');
    if (!cart.length) {
      box.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
      icons();
      return;
    }
    box.innerHTML = cart.map((i) => `
      <div class="cart-row" data-id="${i.id}">
        <figure><img src="assets/${i.img}.jpg" alt=""></figure>
        <div>
          <h4>${esc(i.name)}</h4>
          <p>${esc(i.size || i.cat)}</p>
          <div class="qty">
            <button data-act="dec" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button data-act="inc" aria-label="Increase">+</button>
          </div>
          <button class="remove" data-act="rm">Remove</button>
        </div>
        <div class="price">${money(i.price * i.qty)}</div>
      </div>
    `).join('');
    icons();
  };

  const addToCart = (product, opts = {}) => {
    const key = opts.size ? `${product.id}-${opts.size}` : product.id;
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.qty += 1;
    else cart.push({
      key,
      id: product.id,
      name: product.name,
      cat: product.cat,
      img: product.img,
      price: opts.price || product.price,
      size: opts.size || '',
      qty: 1
    });
    saveCart();
    renderCart();
    toast(`${product.name} added to bag`);
  };

  const openCart = (open = true) => {
    $('#cart').classList.toggle('is-open', open);
    $('#cart').setAttribute('aria-hidden', String(!open));
    $('#scrim').hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const openQV = (id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    qvId = id;
    $('#qvCat').textContent = p.cat;
    $('#qvName').textContent = p.name;
    $('#qvDesc').textContent = p.desc;
    $('#qvPrice').textContent = money(p.price);
    $('#qvImg').innerHTML = `<img src="assets/${p.img}.jpg" alt="${esc(p.name)}">`;
    $('#quickView').classList.add('is-open');
    $('#quickView').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    icons();
  };

  const closeQV = () => {
    $('#quickView').classList.remove('is-open');
    $('#quickView').setAttribute('aria-hidden', 'true');
    if (!$('#cart').classList.contains('is-open')) document.body.style.overflow = '';
  };

  const renderProducts = (cat = 'all') => {
    const grid = $('#productGrid');
    grid.innerHTML = PRODUCTS.map((p) => `
      <article class="product ${cat !== 'all' && p.cat !== cat ? 'is-hidden' : ''}" data-id="${p.id}">
        <div class="product-media">
          <img class="img-a" src="assets/${p.img}.jpg" alt="${esc(p.name)}" loading="lazy">
          <img class="img-b" src="assets/${p.img2}.jpg" alt="" loading="lazy">
          <div class="product-actions">
            <button data-act="qv">Quick view</button>
            <button data-act="add">Add</button>
          </div>
        </div>
        <div class="product-meta">
          <p class="cat">${p.cat}</p>
          <h3>${esc(p.name)}</h3>
          <p class="price">${money(p.price)}</p>
        </div>
      </article>
    `).join('');
  };

  const renderReviews = () => {
    $('#reviewGrid').innerHTML = REVIEWS.map((r) => `
      <article class="review">
        <div class="review-top">
          <img src="assets/${r.img}.jpg" alt="">
          <div>
            <strong>${esc(r.name)}</strong>
            <span>${esc(r.meta)}</span>
          </div>
        </div>
        <div class="stars">★★★★★</div>
        <p>“${esc(r.text)}”</p>
      </article>
    `).join('');
  };

  /* Events */
  $('#cartBtn').addEventListener('click', () => openCart(true));
  $('#cartClose').addEventListener('click', () => openCart(false));
  $('#continueBtn').addEventListener('click', () => openCart(false));
  $('#scrim').addEventListener('click', () => openCart(false));
  $('#checkoutBtn').addEventListener('click', () => {
    if (!cart.length) return toast('Your bag is empty');
    toast('Checkout demo — thank you for browsing Aurelia');
    cart = [];
    saveCart();
    renderCart();
    openCart(false);
  });

  $('#cartItems').addEventListener('click', (e) => {
    const row = e.target.closest('.cart-row');
    if (!row) return;
    const found = cart.find((i) => i.key === row.dataset.id);
    if (!found) return;
    const act = e.target.dataset.act;
    if (act === 'inc') found.qty += 1;
    if (act === 'dec') found.qty = Math.max(1, found.qty - 1);
    if (act === 'rm') cart = cart.filter((i) => i.key !== found.key);
    saveCart();
    renderCart();
  });

  $('#productGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.product');
    if (!card) return;
    const p = PRODUCTS.find((x) => x.id === card.dataset.id);
    const act = e.target.dataset.act;
    if (act === 'add') addToCart(p);
    if (act === 'qv') openQV(p.id);
  });

  $$('#filters .filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#filters .filter').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderProducts(btn.dataset.cat);
    });
  });

  $$('[data-filter]').forEach((a) => {
    a.addEventListener('click', () => {
      const cat = a.dataset.filter;
      $$('#filters .filter').forEach((b) => b.classList.toggle('is-active', b.dataset.cat === cat));
      renderProducts(cat);
    });
  });

  $$('#sizes .size').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#sizes .size').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      ritualPrice = Number(btn.dataset.price);
      ritualSize = btn.dataset.size;
    });
  });

  $('#addRitual').addEventListener('click', () => {
    const p = PRODUCTS.find((x) => x.id === 'serum');
    addToCart(p, { price: ritualPrice, size: ritualSize });
    openCart(true);
  });

  $('#qvClose').addEventListener('click', closeQV);
  $('#quickView').addEventListener('click', (e) => { if (e.target === $('#quickView')) closeQV(); });
  $('#qvAdd').addEventListener('click', () => {
    const p = PRODUCTS.find((x) => x.id === qvId);
    if (p) addToCart(p);
    closeQV();
  });

  $('#newsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#newsMsg').textContent = 'You’re on the list — welcome to the ritual.';
    e.target.reset();
  });

  $$('[data-toast]').forEach((btn) => btn.addEventListener('click', () => toast(btn.dataset.toast)));

  $('#searchBtn').addEventListener('click', () => {
    const q = prompt('Search Aurelia products');
    if (!q) return;
    const match = PRODUCTS.find((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (match) {
      renderProducts('all');
      openQV(match.id);
    } else toast('No products matched that search');
  });

  const mnav = $('#mnav');
  $('#menuBtn')?.addEventListener('click', () => {
    mnav.classList.add('is-open');
    mnav.setAttribute('aria-hidden', 'false');
  });
  $('#mnavClose').addEventListener('click', () => {
    mnav.classList.remove('is-open');
    mnav.setAttribute('aria-hidden', 'true');
  });
  $$('#mnav a').forEach((a) => a.addEventListener('click', () => {
    mnav.classList.remove('is-open');
    mnav.setAttribute('aria-hidden', 'true');
  }));

  window.addEventListener('scroll', () => {
    $('#header').classList.toggle('is-solid', window.scrollY > 20);
  }, { passive: true });

  /* Init */
  renderProducts();
  renderReviews();
  renderCart();
  icons();

  /* GSAP */
  const loader = $('#loader');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.remove();
            document.body.classList.remove('is-loading');
          }
        });
      }
    });
    tl.to('.loader-line i', { width: '100%', duration: 1, ease: 'power2.inOut' });

    if (!reduce) {
      gsap.from('.hero-copy > *', { y: 36, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.9 });
      gsap.from('.hero-visual figure', { y: 48, opacity: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out', delay: 1 });

      $$('.section-head, .col-card, .product, .ing-card, .review, .phil-copy, .phil-mosaic figure, .ritual-copy, .ritual-gallery figure, .news-copy').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%' },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        });
      });
    } else {
      loader.remove();
      document.body.classList.remove('is-loading');
    }
  } else {
    loader.remove();
    document.body.classList.remove('is-loading');
  }
})();
