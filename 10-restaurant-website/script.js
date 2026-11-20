(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = () => window.lucide && lucide.createIcons();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MENU = {
    starters: {
      img: 'menu-starters',
      label: 'Starters',
      items: [
        { name: 'Heirloom Tomato Consommé', desc: 'Basil oil, compressed cucumber, lemon thyme', price: 24 },
        { name: 'Hokkaido Scallop Crudo', desc: 'Yuzu kosho, finger lime, brown butter crumb', price: 28 },
        { name: 'Foie Gras Torchon', desc: 'Sauternes gelée, toasted brioche, quince', price: 32 },
        { name: 'Roasted Bone Marrow', desc: 'Parsley salad, smoked salt, grilled sourdough', price: 26 }
      ]
    },
    mains: {
      img: 'menu-mains',
      label: 'Mains',
      items: [
        { name: 'Dry-Aged Duck Breast', desc: 'Cherry gastrique, black garlic, wilted greens', price: 48 },
        { name: 'Line-Caught Halibut', desc: 'Beurre blanc, sea beans, champagne grapes', price: 52 },
        { name: 'Wagyu Strip Loin', desc: 'Bone jus, roasted alliums, potato pavé', price: 68 },
        { name: 'Wild Mushroom Risotto', desc: 'Aged parmesan, truffle butter, herb oil', price: 42 }
      ]
    },
    desserts: {
      img: 'menu-desserts',
      label: 'Desserts',
      items: [
        { name: 'Dark Chocolate Sphere', desc: 'Hazelnut praline, espresso anglaise', price: 18 },
        { name: 'Vanilla Bean Soufflé', desc: 'Crème anglaise, seasonal berries', price: 17 },
        { name: 'Citrus Olive Oil Cake', desc: 'Yuzu curd, candied peel, crème fraîche', price: 16 },
        { name: 'Selection of Cheeses', desc: 'Three artisan cheeses, honeycomb, lavash', price: 22 }
      ]
    },
    cellar: {
      img: 'menu-cellar',
      label: 'Cellar',
      items: [
        { name: 'Champagne · Billecart-Salmon Brut', desc: 'Mareuil-sur-Aÿ, NV · glass', price: 28 },
        { name: 'Burgundy · Domaine Leflaive Bourgogne', desc: 'Puligny-adjacent fruit, 2022 · glass', price: 32 },
        { name: 'Bordeaux · Château Talbot', desc: 'Saint-Julien, 2016 · glass', price: 36 },
        { name: 'Sommelier Pairing', desc: 'Five glasses matched to the tasting menu', price: 95 }
      ]
    }
  };

  const DISHES = [
    { img: 'dish-1', name: 'Scallop Crudo', tag: 'Starter' },
    { img: 'dish-2', name: 'Dry-Aged Duck', tag: 'Signature' },
    { img: 'dish-3', name: 'Halibut & Grapes', tag: 'Main' },
    { img: 'dish-4', name: 'Chocolate Sphere', tag: 'Dessert' },
    { img: 'dish-5', name: 'Cheese Course', tag: 'Finale' }
  ];

  let galIndex = 0;

  const toast = (msg) => {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-on'), 2400);
  };

  const renderMenu = (key = 'starters') => {
    const data = MENU[key];
    $('#menuCaption').textContent = data.label;
    $('#menuVisual img').src = `assets/${data.img}.jpg`;
    $('#menuList').innerHTML = data.items.map((item) => `
      <article class="menu-item">
        <div>
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.desc)}</p>
        </div>
        <span class="price">$${item.price}</span>
      </article>
    `).join('');

    if (typeof gsap !== 'undefined' && !reduce) {
      gsap.from('.menu-item', { y: 20, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' });
      gsap.from('#menuVisual img', { scale: 1.08, duration: 0.75, ease: 'power2.out' });
    }
  };

  const renderDishes = () => {
    $('#dishRail').innerHTML = DISHES.map((d) => `
      <article class="dish">
        <img src="assets/${d.img}.jpg" alt="${esc(d.name)}" loading="lazy">
        <div class="dish-cap">
          <span>${esc(d.tag)}</span>
          <h3>${esc(d.name)}</h3>
        </div>
      </article>
    `).join('');
  };

  const updateGallery = () => {
    const track = $('#galTrack');
    const card = track.children[0];
    if (!card) return;
    const step = card.getBoundingClientRect().width + 14;
    const max = Math.max(0, track.children.length - (window.innerWidth > 960 ? 3 : 1));
    galIndex = Math.max(0, Math.min(galIndex, max));
    track.style.transform = `translateX(${-galIndex * step}px)`;
  };

  const openReserve = (open = true) => {
    $('#reserveModal').classList.toggle('is-open', open);
    $('#reserveModal').setAttribute('aria-hidden', String(!open));
    $('#scrim').hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (open) {
      $('#reserveBody').hidden = false;
      $('#reserveSuccess').hidden = true;
      $('#mnav').classList.remove('is-open');
    }
  };

  const openMnav = (open) => {
    $('#mnav').classList.toggle('is-open', open);
    $('#mnav').setAttribute('aria-hidden', String(!open));
    $('#burger').setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  };

  /* Menu tabs */
  $$('#menuTabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('#menuTabs .tab').forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderMenu(tab.dataset.tab);
    });
  });

  /* Reserve */
  $$('[data-reserve]').forEach((btn) => btn.addEventListener('click', () => openReserve(true)));
  $('#reserveClose').addEventListener('click', () => openReserve(false));
  $('#successClose').addEventListener('click', () => openReserve(false));
  $('#scrim').addEventListener('click', () => openReserve(false));

  const dateInput = $('#reserveForm [name="date"]');
  const min = new Date();
  min.setDate(min.getDate() + 1);
  dateInput.min = min.toISOString().slice(0, 10);
  dateInput.value = dateInput.min;

  $('#guestsSelect').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => `<option value="${n}" ${n === 2 ? 'selected' : ''}>${n}</option>`).join('');

  $('#reserveForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const date = fd.get('date');
    const time = fd.get('time');
    const party = fd.get('guests');
    const timeLabel = [...e.target.time.options].find((o) => o.value === time)?.text || time;
    $('#successMsg').textContent = `Thank you, ${name}. We’ve received your request for ${party} on ${date} at ${timeLabel}. Our team will confirm by email shortly.`;
    $('#reserveBody').hidden = true;
    $('#reserveSuccess').hidden = false;
    e.target.reset();
    dateInput.value = dateInput.min;
    $('#guestsSelect').value = '2';
  });

  $('#giftBtn').addEventListener('click', () => toast('Gift cards available in-house and by phone.'));
  $('#pressBtn').addEventListener('click', () => toast('Press inquiries: press@lumiere.nyc'));

  /* Mobile nav */
  $('#burger').addEventListener('click', () => openMnav(true));
  $('#mnavClose').addEventListener('click', () => openMnav(false));
  $$('#mnav a').forEach((a) => a.addEventListener('click', () => openMnav(false)));

  /* Gallery */
  $('#galPrev').addEventListener('click', () => { galIndex -= 1; updateGallery(); });
  $('#galNext').addEventListener('click', () => { galIndex += 1; updateGallery(); });
  window.addEventListener('resize', updateGallery);

  window.addEventListener('scroll', () => {
    $('#header').classList.toggle('is-solid', window.scrollY > 40);
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      openReserve(false);
      openMnav(false);
    }
  });

  renderMenu();
  renderDishes();
  icons();
  updateGallery();

  /* GSAP */
  const loader = $('#loader');
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.95,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.remove();
            document.body.classList.remove('is-loading');
          }
        });
      }
    });
    tl.to('.loader-bar i', { width: '100%', duration: 1.1, ease: 'power2.inOut' });

    if (!reduce) {
      gsap.from('.hero-title .line > span', {
        yPercent: 110,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.95
      });
      gsap.from('.hero .reveal', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.15
      });
      gsap.to('#heroMedia img', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      $$('.section-head, .menu-stage, .dish, .story-copy, .story-visuals figure, .chef-portrait, .chef-copy, .gal-track figure, .visit-img, .visit-copy, .cta-band').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%' },
          y: 40,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out'
        });
      });

      $$('.story-stats [data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(el, { textContent: 0 }, {
              textContent: end,
              duration: 1.2,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate() {
                const n = Math.round(Number(el.textContent));
                el.textContent = end >= 100 ? `${n}+`.replace('++', '+') : String(n);
                if (end === 900) el.textContent = `${n}+`;
              }
            });
          }
        });
      });
    } else {
      loader.remove();
      document.body.classList.remove('is-loading');
      $$('[data-count]').forEach((el) => {
        const n = el.dataset.count;
        el.textContent = n === '900' ? '900+' : n;
      });
    }
  } else {
    loader.remove();
    document.body.classList.remove('is-loading');
  }
})();
