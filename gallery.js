(() => {
  'use strict';

  const PROJECTS = [
    {
      n: '01',
      title: 'Meridian',
      tag: 'SaaS Dashboard',
      desc: 'Dark revenue intelligence workspace with KPIs, charts, and team activity.',
      href: '01-saas-dashboard/index.html',
      img: '01-saas-dashboard/assets/av-maya.jpg',
      tint: '#1a1b2e'
    },
    {
      n: '02',
      title: 'OFFCOURT',
      tag: 'Sneaker Store',
      desc: 'High-end sneaker boutique with quick view, cart drawer, and drop energy.',
      href: '02-sneaker-store/index.html',
      img: '02-sneaker-store/assets/hero-volt.jpg',
      tint: '#111'
    },
    {
      n: '03',
      title: 'Maison Aurèle',
      tag: 'Fashion Brand',
      desc: 'Editorial fashion campaign site with oversized type and lookbook grids.',
      href: '03-fashion-brand/index.html',
      img: '03-fashion-brand/assets/hero.jpg',
      tint: '#1c1814'
    },
    {
      n: '04',
      title: 'Halden',
      tag: 'Fintech Dashboard',
      desc: 'Personal banking analytics with balances, cards, and spending charts.',
      href: '04-fintech-dashboard/index.html',
      img: '04-fintech-dashboard/assets/av-user.jpg',
      tint: '#0f1a17'
    },
    {
      n: '05',
      title: 'Axiom',
      tag: 'AI SaaS Landing',
      desc: 'Futuristic AI product site with gradient type, pricing, and workflows.',
      href: '05-ai-saas-landing/index.html',
      img: '05-ai-saas-landing/assets/av-maya.jpg',
      tint: '#10141f'
    },
    {
      n: '06',
      title: 'Ardmore Estates',
      tag: 'Real Estate',
      desc: 'Luxury property discovery with search, filters, and detail modals.',
      href: '06-real-estate/index.html',
      img: '06-real-estate/assets/hero.jpg',
      tint: '#151310'
    },
    {
      n: '07',
      title: 'FORGE',
      tag: 'Fitness Brand',
      desc: 'Athletic club site with programs, coaches, memberships, and results.',
      href: '07-fitness-brand/index.html',
      img: '07-fitness-brand/assets/hero.jpg',
      tint: '#0b0b0b'
    },
    {
      n: '08',
      title: 'Aurelia',
      tag: 'Skincare Store',
      desc: 'Minimal luxury beauty storefront with rituals, ingredients, and cart.',
      href: '08-skincare-store/index.html',
      img: '08-skincare-store/assets/hero.jpg',
      tint: '#1a1714'
    },
    {
      n: '09',
      title: 'Atlas',
      tag: 'Project Management',
      desc: 'Enterprise PM dashboard with kanban, calendar, and task creation.',
      href: '09-project-management-dashboard/index.html',
      img: '09-project-management-dashboard/assets/av-sofia.jpg',
      tint: '#0f172a'
    },
    {
      n: '10',
      title: 'Lumière',
      tag: 'Restaurant',
      desc: 'Cinematic fine-dining site with menu, chef story, and reservations.',
      href: '10-restaurant-website/index.html',
      img: '10-restaurant-website/assets/hero.jpg',
      tint: '#0c0b0a'
    }
  ];

  const grid = document.getElementById('grid');
  grid.innerHTML = PROJECTS.map((p) => `
    <a class="card" href="${p.href}" data-card style="--tint:${p.tint}">
      <div class="card-media" style="background:${p.tint}">
        <span class="card-num">${p.n}</span>
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <div class="card-overlay"></div>
      </div>
      <div class="card-body">
        <span class="card-tag">${p.tag}</span>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
        <span class="card-cta">Open concept
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </span>
      </div>
    </a>
  `).join('');

  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const loader = document.getElementById('loader');
  const bar = loader.querySelector('span');

  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => loader.remove()
        });
      }
    });
    tl.to(bar, { width: '100%', duration: 1.1, ease: 'power2.inOut' })
      .from('[data-card]', {
        y: 48,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out'
      }, '-=0.2')
      .from('.hero > *', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out'
      }, '-=1.1');
  } else {
    bar.style.width = '100%';
    setTimeout(() => loader.remove(), 400);
  }
})();
