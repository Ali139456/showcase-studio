/* Ardmore Estates */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = hasGsap && !reduce;
  const icons = () => { if (window.lucide) window.lucide.createIcons(); };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$' + n.toLocaleString('en-US');
  const pad2 = n => String(n).padStart(2, '0');
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Data ---------- */
  const AGENTS = {
    amelia: { name: 'Amelia Whitford', role: 'Managing Partner', loc: 'Miami', sold: '$1.4B', years: 22, langs: 'English, Spanish', tel: '+13055550142', email: 'amelia@ardmore-estates.com' },
    victor: { name: 'Victor Langstrom', role: 'Partner', loc: 'New York', sold: '$980M', years: 17, langs: 'English, Swedish', tel: '+12125550187', email: 'victor@ardmore-estates.com' },
    james: { name: 'James Okonkwo', role: 'Partner', loc: 'Dubai', sold: '$1.1B', years: 14, langs: 'English, Arabic, French', tel: '+97145550123', email: 'james@ardmore-estates.com' },
    maya: { name: 'Maya Castellanos', role: 'Partner', loc: 'Malibu', sold: '$720M', years: 11, langs: 'English, Spanish', tel: '+13105550166', email: 'maya@ardmore-estates.com' }
  };
  const A = { pool: ['waves', 'Heated infinity pool'], dock: ['anchor', 'Private dock'], wine: ['wine', 'Wine room'], gym: ['dumbbell', 'Gym & sauna'], cinema: ['clapperboard', 'Screening room'], garage: ['car', 'Four-car garage'], garden: ['trees', 'Landscaped gardens'], smart: ['cpu', 'Lutron smart home'], guest: ['bed-double', 'Guest house'], terrace: ['sun', 'Rooftop terrace'], concierge: ['bell', '24-hour concierge'], fire: ['flame', 'Outdoor fireplace'], beach: ['umbrella', 'Direct beach access'], solar: ['zap', 'Solar & battery'], lift: ['arrow-up-down', 'Private lift'], study: ['book-open', 'Library & study'] };
  const P = (id, name, loc, area, type, price, beds, baths, sqft, year, tag, gallery, amen, desc, featured) => ({ id, name, loc, area, type, price, beds, baths, sqft, year, tag, img: 'prop-' + id, gallery, amen, desc, featured, agent: { Miami: 'amelia', 'New York': 'victor', Dubai: 'james', Malibu: 'maya' }[loc] });
  const PROPS = [
    P('lucente', 'Villa Lucente', 'Miami', 'Miami Beach', 'Villa', 8450000, 6, 7, 8200, 2021, 'New', ['int-living', 'int-kitchen', 'int-bedroom'], ['pool', 'dock', 'wine', 'smart', 'garage', 'gym'], 'A white modernist villa on a double lot off North Bay Road, arranged around a 70-foot pool so that every principal room opens to water and evening light.', true),
    P('pavilion', 'The Pavilion', 'Malibu', 'Point Dume', 'House', 12900000, 5, 6, 7400, 2019, 'Exclusive', ['int-lounge', 'int-stairs', 'int-bath'], ['pool', 'beach', 'cinema', 'fire', 'solar', 'guest'], 'A low, dark-timber pavilion set into the bluff at Point Dume, with a single glazed elevation running the full length of the house toward the Pacific.', true),
    P('skyline', 'Skyline Penthouse', 'New York', 'Tribeca', 'Penthouse', 14750000, 4, 5, 5600, 2017, 'Exclusive', ['int-neutral', 'int-kitchen', 'int-bedroom'], ['terrace', 'concierge', 'lift', 'wine', 'smart', 'study'], 'The full top floor of a converted 1920s warehouse, with eleven-foot ceilings, three exposures and a planted terrace that looks straight up the Hudson.', true),
    P('serena', 'Casa Serena', 'Malibu', 'Carbon Beach', 'Villa', 6200000, 4, 5, 5100, 2016, '', ['int-arched', 'int-living', 'int-bath'], ['beach', 'pool', 'fire', 'garden', 'smart', 'garage'], 'A lime-washed courtyard villa a short walk from the sand, with arched loggias, an olive garden and a plunge pool sheltered from the coast road.'),
    P('palm', 'Palm Residence', 'Dubai', 'Palm Jumeirah', 'Villa', 9750000, 6, 8, 9600, 2022, 'New', ['int-lounge', 'int-kitchen', 'int-bedroom'], ['beach', 'pool', 'cinema', 'gym', 'lift', 'garage'], 'A frond-tip villa with sixty feet of private beach, a double-height majlis and skyline views across the water to the Marina.'),
    P('hillcrest', 'Hillcrest House', 'Malibu', 'Serra Retreat', 'House', 5350000, 4, 4, 4300, 2014, 'Price reduced', ['int-stairs', 'int-neutral', 'int-kitchen'], ['pool', 'garden', 'fire', 'solar', 'study', 'garage'], 'Glass, cedar and board-formed concrete on a gated acre in Serra Retreat, oriented to catch canyon views in the morning and ocean light at dusk.'),
    P('coral', 'Coral Gables Estate', 'Miami', 'Coral Gables', 'House', 5900000, 5, 6, 6800, 2018, '', ['int-arched', 'int-living', 'int-bedroom'], ['pool', 'garden', 'wine', 'guest', 'garage', 'study'], 'A contemporary family estate beneath mature oaks, with a guest house, a lap pool and a kitchen designed for people who actually cook.'),
    P('loft', 'The Mercer Loft', 'New York', 'SoHo', 'Penthouse', 7850000, 3, 3, 3900, 1898, '', ['int-neutral', 'int-stairs', 'int-bath'], ['lift', 'terrace', 'study', 'smart', 'concierge', 'wine'], 'A cast-iron loft with its original columns and a key-locked lift, restored by a gallery owner over six years and never before offered for sale.'),
    P('cedar', 'Cedar Court', 'Dubai', 'Emirates Hills', 'Villa', 11200000, 7, 9, 12400, 2020, 'Exclusive', ['int-lounge', 'int-arched', 'int-bath'], ['pool', 'cinema', 'gym', 'garden', 'garage', 'guest'], 'A courtyard residence on the fairway at Emirates Hills, planned as a sequence of shaded gardens with a separate wing for guests and staff.'),
    P('azure', 'Azure Bay', 'Miami', 'Key Biscayne', 'Villa', 10400000, 5, 7, 7900, 2023, 'New', ['int-living', 'int-kitchen', 'int-bath'], ['dock', 'pool', 'terrace', 'smart', 'gym', 'solar'], 'Newly completed on the bay side of Key Biscayne, with a 90-foot dock, a rooftop terrace and unobstructed sunset views to the downtown skyline.'),
    P('mono', 'Mono House', 'Dubai', 'Al Barari', 'House', 4650000, 4, 5, 5200, 2021, '', ['int-neutral', 'int-stairs', 'int-bedroom'], ['pool', 'garden', 'smart', 'solar', 'study', 'garage'], 'A quiet, monolithic house in the gardens of Al Barari — deep reveals, pale stone and a pool court that stays in shade through the afternoon.'),
    P('lake', 'Hudson Lake House', 'New York', 'Hudson Valley', 'House', 3950000, 5, 4, 4800, 2009, 'Price reduced', ['int-living', 'int-arched', 'int-kitchen'], ['dock', 'fire', 'garden', 'guest', 'study', 'garage'], 'A shingled lake house two hours north of the city, on eleven wooded acres with a boathouse, a guest cottage and four working fireplaces.')
  ];
  const prop = id => PROPS.find(p => p.id === id);
  const FEATURED = PROPS.filter(p => p.featured);

  const STORIES = [
    { img: 'av-karen', name: 'Karen Lindqvist', meta: 'Purchased Villa Lucente, Miami Beach', quote: 'Amelia told us not to buy the first two houses we loved. The third was not on the market yet. It is the one we will keep.' },
    { img: 'av-robert', name: 'Robert Ashworth', meta: 'Sold a Tribeca penthouse, off-market', quote: 'No listing, no open house, no photographs online. Eleven private viewings, three offers, and a price above the last public record for the building.' },
    { img: 'av-nora', name: 'Nora El-Amin', meta: 'Relocated from London to Dubai', quote: 'They handled the purchase, the school introductions and the furniture arriving on the right floor. I had expected an agent. I got a chief of staff.' }
  ];

  /* ---------- State ---------- */
  const state = { type: 'all', loc: 'all', price: 'all', beds: 0, sort: 'featured' };
  const saved = new Set();
  const matches = (p, f = state) => (f.type === 'all' || p.type === f.type) && (f.loc === 'all' || p.loc === f.loc) && p.beds >= f.beds && (f.price === 'all' || (() => { const [a, b] = f.price.split('-').map(Number); return p.price >= a && p.price < b; })());
  const PRICE_LABEL = { '0-6000000': 'Up to $6M', '6000000-10000000': '$6M – $10M', '10000000-99000000': '$10M and above' };

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600); }

  /* ---------- Residences ---------- */
  function cardHtml(p) {
    return `<article class="prop" data-prop="${p.id}" tabindex="0" aria-label="${p.name}, ${p.area}">
      <div class="prop-media"><img src="assets/${p.img}.jpg" alt="${p.name}, ${p.area}" loading="lazy">
        ${p.tag ? `<span class="prop-tag ${p.tag === 'Exclusive' ? 'is-bronze' : ''}">${p.tag}</span>` : ''}
        <button class="heart ${saved.has(p.id) ? 'is-on' : ''}" data-save="${p.id}" aria-label="Save ${p.name}" aria-pressed="${saved.has(p.id)}"><i data-lucide="heart"></i></button>
        <span class="prop-view">View residence<i data-lucide="arrow-right"></i></span></div>
      <div class="prop-body">
        <p class="prop-loc"><i data-lucide="map-pin"></i>${p.area}, ${p.loc}</p>
        <div class="prop-row"><h3>${p.name}</h3><span class="prop-price">${money(p.price)}</span></div>
        <div class="prop-specs"><span><i data-lucide="bed-double"></i>${p.beds} beds</span><span><i data-lucide="bath"></i>${p.baths} baths</span><span><i data-lucide="ruler"></i>${p.sqft.toLocaleString('en-US')} sq ft</span></div>
      </div></article>`;
  }
  function renderChips() {
    const types = ['all', 'Villa', 'House', 'Penthouse'];
    $('#typeChips').innerHTML = types.map(t => `<button data-type="${t}" class="${state.type === t ? 'is-active' : ''}">${t === 'all' ? 'All residences' : t + 's'}<sup>${PROPS.filter(p => matches(p, { ...state, type: t })).length}</sup></button>`).join('');
  }
  function renderActive() {
    const pills = [];
    if (state.loc !== 'all') pills.push(['loc', state.loc]);
    if (state.price !== 'all') pills.push(['price', PRICE_LABEL[state.price]]);
    if (state.beds) pills.push(['beds', `${state.beds}+ bedrooms`]);
    $('#activeFilters').innerHTML = pills.map(([k, l]) => `<button data-clear="${k}" aria-label="Remove filter ${l}">${l}<i data-lucide="x"></i></button>`).join('') + (pills.length || state.type !== 'all' ? '<button class="clear" data-clear="all">Clear all</button>' : '');
  }
  function renderProps(animate = true) {
    let list = PROPS.filter(p => matches(p));
    if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
    if (state.sort === 'low') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'size') list.sort((a, b) => b.sqft - a.sqft);
    const grid = $('#props');
    grid.innerHTML = list.length ? list.map(cardHtml).join('') : `<div class="empty"><h3>Nothing matches — yet</h3><p>We hold a number of residences privately. Clear the filters, or ask an advisor what is coming to market.</p><button class="btn btn-dark" data-clear="all">Clear filters</button></div>`;
    $('#resultCount').textContent = `${list.length} of ${PROPS.length} residences`;
    renderChips(); renderActive(); syncSearch(); icons();
    if (anim && animate) gsap.fromTo(grid.children, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .06, clearProps: 'transform,opacity' });
    if (hasST) ScrollTrigger.refresh();
  }
  function syncSearch() {
    $('#sLoc').value = state.loc === 'all' ? 'all' : state.loc;
    $('#sType').value = state.type === 'all' ? 'all' : state.type;
    $('#sPrice').value = state.price; $('#sBeds').value = String(state.beds);
    updateSearchLabel();
  }
  function searchValues() { return { loc: $('#sLoc').value, type: $('#sType').value, price: $('#sPrice').value, beds: +$('#sBeds').value }; }
  function updateSearchLabel() { const n = PROPS.filter(p => matches(p, searchValues())).length; $('#searchLabel').textContent = n ? `Search ${n} ${n === 1 ? 'residence' : 'residences'}` : 'No matches — widen search'; }
  function goResidences() { $('#residences').scrollIntoView({ behavior: 'smooth' }); }
  function setLoc(loc) { state.loc = loc; renderProps(); goResidences(); }

  /* ---------- Saved ---------- */
  function toggleSave(id) {
    const p = prop(id), on = !saved.has(id);
    if (on) saved.add(id); else saved.delete(id);
    $$(`[data-save="${id}"]`).forEach(b => { b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    const pm = $('#pmSave'); if (pm && pm.dataset.id === id) { pm.classList.toggle('is-on', on); $('span', pm).textContent = on ? 'Saved' : 'Save'; }
    $('#savedCount').textContent = saved.size; $('#savedBtn').classList.toggle('has-items', saved.size > 0);
    renderDrawer();
    toast(on ? `${p.name} saved to your shortlist` : `${p.name} removed from your shortlist`);
    if (anim && on) gsap.fromTo('#savedBtn svg', { scale: 1.6 }, { scale: 1, duration: .7, ease: 'elastic.out(1, .4)', clearProps: 'transform' });
  }
  function renderDrawer() {
    const list = [...saved].map(prop);
    $('#drawerBody').innerHTML = list.length ? list.map(p => `<div class="saved-item" data-prop="${p.id}"><img src="assets/${p.img}.jpg" alt=""><div><b>${p.name}</b><span>${p.area}, ${p.loc}</span><em>${money(p.price)}</em></div><button data-save="${p.id}" aria-label="Remove ${p.name}"><i data-lucide="x"></i></button></div>`).join('') : '<div class="drawer-empty"><i data-lucide="heart"></i><b>No saved residences</b><span>Tap the heart on any home to keep it here while you compare.</span></div>';
    $('#drawerEnquire').disabled = !list.length;
    icons();
  }
  function setDrawer(open) { $('#drawer').classList.toggle('is-open', open); $('#drawerScrim').classList.toggle('is-open', open); $('#drawer').setAttribute('aria-hidden', !open); lock(); }
  const lock = () => document.body.classList.toggle('is-locked', !!$('.modal.is-open, .drawer.is-open, .mnav.is-open'));

  /* ---------- Featured ---------- */
  let featI = 0, featBusy = false;
  function featInfoHtml(p) {
    return `<div><p class="feat-tag">${p.tag || 'Featured'} · ${p.type}</p><h3>${p.name}</h3><p class="feat-loc"><i data-lucide="map-pin"></i>${p.area}, ${p.loc}</p><p class="feat-desc">${p.desc}</p></div>
      <div class="feat-specs"><div><b>${p.beds}</b><span>Bedrooms</span></div><div><b>${p.baths}</b><span>Bathrooms</span></div><div><b>${p.sqft.toLocaleString('en-US')}</b><span>Square feet</span></div></div>
      <div class="feat-foot"><p class="feat-price"><small>Guide price</small>${money(p.price)}</p><button class="btn btn-bronze" data-prop="${p.id}">View residence<i data-lucide="arrow-right"></i></button></div>`;
  }
  function showFeat(i, dir = 1) {
    if (featBusy) return;
    i = (i + FEATURED.length) % FEATURED.length;
    const p = FEATURED[i], media = $('#featMedia'), info = $('#featInfo'), first = !media.children.length;
    featI = i; $('#featIdx').textContent = pad2(i + 1); media.dataset.prop = p.id;
    const img = new Image(); img.src = `assets/${p.img}.jpg`; img.alt = `${p.name}, ${p.area}`;
    media.appendChild(img);
    if (!anim || first) { $$('img', media).slice(0, -1).forEach(n => n.remove()); info.innerHTML = featInfoHtml(p); icons(); return; }
    featBusy = true;
    gsap.fromTo(img, { clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', scale: 1.15 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 1.2, ease: 'expo.inOut', onComplete: () => { $$('img', media).slice(0, -1).forEach(n => n.remove()); featBusy = false; } });
    gsap.to(info.children, { opacity: 0, y: -16, duration: .35, ease: 'power2.in', stagger: .04, onComplete: () => {
      info.innerHTML = featInfoHtml(p); icons();
      gsap.fromTo(info.children, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .08, clearProps: 'transform,opacity' });
    } });
  }

  /* ---------- Property modal ---------- */
  let lastFocus = null;
  function openModal(el) { if (!$('.modal.is-open')) lastFocus = document.activeElement; el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); lock(); }
  function closeModal(el) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); lock(); if (!$('.modal.is-open') && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
  const todayIso = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  function validate(form) {
    let ok = true;
    $$('[data-req]', form).forEach(i => {
      const v = i.value.trim(), kind = i.dataset.req;
      const err = kind === 'email' ? (validEmail(v) ? '' : 'Please enter a valid email address.') : kind === 'date' ? (v && v >= todayIso() ? '' : 'Choose a date from tomorrow onwards.') : (v.length >= 2 ? '' : 'This field is required.');
      const f = i.closest('.field'); f.classList.toggle('is-bad', !!err);
      let s = $('small', f); if (!s) { s = document.createElement('small'); f.appendChild(s); } s.textContent = err;
      if (err && ok) { ok = false; i.focus(); }
    });
    return ok;
  }

  function openProp(id) {
    const p = prop(id), a = AGENTS[p.agent], imgs = [p.img, ...p.gallery];
    $('#propBody').innerHTML = `
      <div class="pm-gallery">
        <div class="pm-main" id="pmMain"><img src="assets/${imgs[0]}.jpg" alt="${p.name}"><span class="pm-count"><b id="pmIdx">01</b> / ${pad2(imgs.length)}</span></div>
        <div class="pm-thumbs" id="pmThumbs">${imgs.map((s, i) => `<button data-i="${i}" class="${i === 0 ? 'is-active' : ''}" aria-label="Photograph ${i + 1}"><img src="assets/${s}.jpg" alt=""></button>`).join('')}</div>
      </div>
      <div class="pm-info">
        <p class="kicker"><span></span>${p.type} · ${p.area}, ${p.loc}</p>
        <h2 id="pmTitle">${p.name}</h2>
        <div class="pm-price"><div><b>${money(p.price)}</b><small>Guide price · ${money(Math.round(p.price / p.sqft))} per sq ft</small></div><button class="pm-save ${saved.has(p.id) ? 'is-on' : ''}" id="pmSave" data-id="${p.id}"><i data-lucide="heart"></i><span>${saved.has(p.id) ? 'Saved' : 'Save'}</span></button></div>
        <div class="pm-specs"><div><i data-lucide="bed-double"></i><b>${p.beds}</b><span>Bedrooms</span></div><div><i data-lucide="bath"></i><b>${p.baths}</b><span>Bathrooms</span></div><div><i data-lucide="ruler"></i><b>${p.sqft.toLocaleString('en-US')}</b><span>Sq ft</span></div><div><i data-lucide="calendar"></i><b>${p.year}</b><span>${p.year < 1950 ? 'Built' : 'Completed'}</span></div></div>
        <p class="pm-desc">${p.desc}</p>
        <p class="pm-h">Amenities</p>
        <ul class="pm-amen">${p.amen.map(k => `<li><i data-lucide="${A[k][0]}"></i>${A[k][1]}</li>`).join('')}</ul>
        <p class="pm-h">Your advisor</p>
        <div class="pm-agent"><img src="assets/agent-${p.agent}.jpg" alt="${a.name}"><div><b>${a.name}</b><span>${a.role}, ${a.loc}</span></div><a href="tel:${a.tel}" aria-label="Call ${a.name}"><i data-lucide="phone"></i></a></div>
        <p class="pm-h">Request a private viewing</p>
        <form id="viewForm" novalidate>
          <div class="field-row"><label class="field"><span>Full name</span><input data-req="text" autocomplete="name"></label><label class="field"><span>Email</span><input data-req="email" type="email" autocomplete="email"></label></div>
          <label class="field"><span>Preferred date</span><input data-req="date" type="date" min="${todayIso()}"></label>
          <button class="btn btn-dark btn-block" type="submit">Request viewing<i data-lucide="arrow-right"></i></button>
        </form>
      </div>`;
    icons();
    openModal($('#propModal'));
    $('.pm-info').scrollTop = 0; $('#propBody').scrollTop = 0;
    let cur = 0;
    $('#pmThumbs').addEventListener('click', e => {
      const b = e.target.closest('[data-i]'); if (!b || +b.dataset.i === cur) return;
      cur = +b.dataset.i; $$('#pmThumbs button').forEach(x => x.classList.toggle('is-active', x === b)); $('#pmIdx').textContent = pad2(cur + 1);
      const main = $('#pmMain'), img = new Image(); img.src = `assets/${imgs[cur]}.jpg`; img.alt = p.name;
      main.insertBefore(img, $('.pm-count', main));
      const done = () => $$('img', main).slice(0, -1).forEach(n => n.remove());
      if (anim) gsap.fromTo(img, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .8, ease: 'power3.out', onComplete: done }); else done();
    });
    $('#pmSave').addEventListener('click', () => toggleSave(p.id));
    $('#viewForm').addEventListener('submit', e => {
      e.preventDefault(); const f = e.currentTarget; if (!validate(f)) return;
      const date = new Date($('[data-req="date"]', f).value + 'T12:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      f.outerHTML = `<div class="ok"><span class="ok-ico"><i data-lucide="check"></i></span><h3 style="font-family:var(--serif);font-weight:400;font-size:32px;line-height:1.1">Viewing requested</h3><p>${a.name.split(' ')[0]} will confirm your visit to ${p.name} on ${date} by email, usually within two hours.</p></div>`;
      icons(); toast('Viewing request sent');
    });
    if (anim) gsap.fromTo('.pm-info > *', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .05, delay: .2, clearProps: 'transform,opacity' });
  }

  /* ---------- Form modal ---------- */
  function openForm(kind, ctx) {
    const a = ctx && AGENTS[ctx];
    const cfg = {
      valuation: { k: 'For owners', t: 'Request a valuation', s: 'A partner will visit, and you will receive a written opinion within five working days. Entirely confidential.', f: `<div class="field-row"><label class="field"><span>Full name</span><input data-req="text" autocomplete="name"></label><label class="field"><span>Email</span><input data-req="email" type="email" autocomplete="email"></label></div><label class="field"><span>Property address</span><input data-req="text" placeholder="Street, city"></label><label class="field"><span>Destination</span><select><option>Miami</option><option>New York</option><option>Dubai</option><option>Malibu</option><option>Elsewhere</option></select></label>`, b: 'Request valuation', ok: ['Thank you', 'Your request has been received. A partner will telephone within one working day to arrange a visit.'] },
      agent: a && { k: `${a.role} · ${a.loc}`, t: `Write to ${a.name.split(' ')[0]}`, s: `${a.name} replies personally, usually the same day.`, f: `<div class="field-row"><label class="field"><span>Full name</span><input data-req="text" autocomplete="name"></label><label class="field"><span>Email</span><input data-req="email" type="email" autocomplete="email"></label></div><label class="field"><span>Message</span><textarea data-req="text" placeholder="Tell ${a.name.split(' ')[0]} what you are looking for"></textarea></label>`, b: 'Send message', ok: ['Message sent', `${a.name} will reply to you directly, usually the same day.`] },
      saved: { k: 'Your shortlist', t: `Enquire about ${saved.size} ${saved.size === 1 ? 'home' : 'homes'}`, s: 'We will send full particulars and arrange viewings in a single trip where possible.', f: `<div class="field-row"><label class="field"><span>Full name</span><input data-req="text" autocomplete="name"></label><label class="field"><span>Email</span><input data-req="email" type="email" autocomplete="email"></label></div><label class="field"><span>Residences</span><textarea data-req="text">${[...saved].map(id => prop(id).name).join(', ')}</textarea></label>`, b: 'Send enquiry', ok: ['Enquiry received', 'Particulars for your shortlist are on their way, and an advisor will be in touch to plan viewings.'] }
    }[kind];
    if (!cfg) return;
    $('#formBody').innerHTML = `<p class="kicker"><span></span>${cfg.k}</p><h3>${cfg.t}</h3><p class="d-sub">${cfg.s}</p><form id="dForm" novalidate>${cfg.f}<button class="btn btn-dark btn-block" type="submit">${cfg.b}<i data-lucide="arrow-right"></i></button></form>`;
    icons(); openModal($('#formModal'));
    setTimeout(() => { const f = $('#dForm input'); if (f) f.focus({ preventScroll: true }); }, 100);
    $('#dForm').addEventListener('submit', e => {
      e.preventDefault(); if (!validate(e.currentTarget)) return;
      $('#formBody').innerHTML = `<div class="ok"><span class="ok-ico"><i data-lucide="check"></i></span><h3>${cfg.ok[0]}</h3><p>${cfg.ok[1]}</p><button class="btn btn-dark" data-close>Close</button></div>`; icons();
      if (anim) gsap.from('.ok > *', { opacity: 0, y: 18, duration: .7, ease: 'power3.out', stagger: .08 });
    });
  }

  /* ---------- Agents ---------- */
  function renderAgents() {
    $('#agents').innerHTML = Object.entries(AGENTS).map(([id, a]) => `<article class="agent" data-rise>
      <div class="agent-media"><img src="assets/agent-${id}.jpg" alt="${a.name}" loading="lazy">
        <div class="agent-actions"><a href="tel:${a.tel}"><i data-lucide="phone"></i>Call</a><a href="mailto:${a.email}"><i data-lucide="mail"></i>Email</a><button data-agent="${id}"><i data-lucide="pen-line"></i>Write</button></div></div>
      <h3>${a.name}</h3><p class="agent-role">${a.role} · ${a.loc}</p>
      <dl><div><dt>Career sales</dt><dd>${a.sold}</dd></div><div><dt>Experience</dt><dd>${a.years} years</dd></div><div><dt>Languages</dt><dd>${a.langs}</dd></div></dl></article>`).join('');
  }

  /* ---------- Stories ---------- */
  let storyI = -1;
  function showStory(i) {
    i = (i + STORIES.length) % STORIES.length; if (i === storyI) return;
    const s = STORIES[i], first = storyI < 0; storyI = i; $('#storyIdx').textContent = pad2(i + 1);
    const apply = () => {
      $('#storyQuote').innerHTML = '“' + s.quote.split(' ').map(w => `<span class="w" style="display:inline-block">${esc(w)}</span>`).join(' ') + '”';
      $('#storyImg').src = `assets/${s.img}.jpg`; $('#storyImg').alt = s.name; $('#storyName').textContent = s.name; $('#storyMeta').textContent = s.meta;
    };
    if (!anim || first) { apply(); return; }
    gsap.to(['#storyQuote', '.story-who'], { opacity: 0, y: -12, duration: .3, ease: 'power2.in', onComplete: () => {
      apply(); gsap.set(['#storyQuote', '.story-who'], { opacity: 1, y: 0 });
      gsap.from('#storyQuote .w', { opacity: 0, y: 22, duration: .8, ease: 'power3.out', stagger: .02 });
      gsap.from('.story-who', { opacity: 0, y: 16, duration: .8, ease: 'power3.out', delay: .3 });
    } });
  }

  /* ---------- Events ---------- */
  function bind() {
    document.addEventListener('click', e => {
      const t = e.target;
      const save = t.closest('[data-save]'); if (save) { e.stopPropagation(); toggleSave(save.dataset.save); return; }
      const clear = t.closest('[data-clear]');
      if (clear) { const k = clear.dataset.clear; if (k === 'all') Object.assign(state, { type: 'all', loc: 'all', price: 'all', beds: 0 }); else state[k] = k === 'beds' ? 0 : 'all'; renderProps(); return; }
      const open = t.closest('[data-open]'); if (open) { setMenu(false); openForm(open.dataset.open); return; }
      const ag = t.closest('[data-agent]'); if (ag) { openForm('agent', ag.dataset.agent); return; }
      const loc = t.closest('[data-loc]'); if (loc) { setLoc(loc.dataset.loc); return; }
      if (t.closest('[data-close]')) { closeModal(t.closest('.modal')); return; }
      const p = t.closest('[data-prop]'); if (p) { if (p.closest('.drawer')) setDrawer(false); openProp(p.dataset.prop); return; }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { const m = $$('.modal.is-open').pop(); if (m) closeModal(m); else if ($('#drawer').classList.contains('is-open')) setDrawer(false); else setMenu(false); }
      if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('prop')) openProp(document.activeElement.dataset.prop);
    });
    $('#typeChips').addEventListener('click', e => { const b = e.target.closest('[data-type]'); if (b) { state.type = b.dataset.type; renderProps(); } });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderProps(); });
    $$('#search select').forEach(s => s.addEventListener('change', updateSearchLabel));
    $('#search').addEventListener('submit', e => { e.preventDefault(); Object.assign(state, searchValues()); renderProps(); goResidences(); });
    $('#featPrev').addEventListener('click', () => showFeat(featI - 1, -1));
    $('#featNext').addEventListener('click', () => showFeat(featI + 1, 1));
    $('#storyPrev').addEventListener('click', () => showStory(storyI - 1));
    $('#storyNext').addEventListener('click', () => showStory(storyI + 1));
    $('#savedBtn').addEventListener('click', () => setDrawer(true));
    $('#drawerClose').addEventListener('click', () => setDrawer(false));
    $('#drawerScrim').addEventListener('click', () => setDrawer(false));
    $('#drawerEnquire').addEventListener('click', () => { setDrawer(false); openForm('saved'); });
    $('#burger').addEventListener('click', () => setMenu(!$('#mnav').classList.contains('is-open')));
    $('#mnav').addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    $('#newsForm').addEventListener('submit', e => {
      e.preventDefault(); const i = $('#newsEmail'), ok = validEmail(i.value), m = $('#newsMsg');
      e.currentTarget.classList.toggle('is-bad', !ok); m.classList.toggle('is-ok', ok);
      m.textContent = ok ? 'Thank you. The next Ardmore Letter arrives on the first Thursday of the month.' : 'Please enter a valid email address.';
      if (ok) i.value = '';
    });
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 60);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { if (window.innerWidth > 1180) setMenu(false); });
    const links = $$('.nav a');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }
  function setMenu(open) { $('#mnav').classList.toggle('is-open', open); $('#mnav').setAttribute('aria-hidden', !open); $('#burger').setAttribute('aria-expanded', open); $('#header').classList.toggle('is-menu', open); lock(); }

  /* ---------- Scroll effects ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (!anim) { el.textContent = end.toFixed(dec); return; }
    const o = { v: 0 }; gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } });
  }
  function scrollFx() {
    const intro = $('#introText');
    intro.innerHTML = intro.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    if (!hasST || reduce) { $$('.w', intro).forEach(w => { w.style.opacity = 1; }); $$('[data-count]').forEach(countUp); return; }
    gsap.to($$('.w', intro), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: intro, start: 'top 82%', end: 'bottom 45%', scrub: .6 } });
    const rises = $$('[data-rise]');
    gsap.set(rises, { opacity: 0, y: 44 });
    ScrollTrigger.batch(rises, { start: 'top 90%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: .1, clearProps: 'transform,opacity' }) });
    $$('[data-clip]').forEach((el, i) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.out', delay: (i % 2) * .12, scrollTrigger: { trigger: el, start: 'top 92%', once: true }, clearProps: 'clipPath' });
      gsap.fromTo($('img', el), { scale: 1.3 }, { scale: 1, duration: 1.9, ease: 'expo.out', delay: (i % 2) * .12, scrollTrigger: { trigger: el, start: 'top 92%', once: true }, clearProps: 'transform' });
    });
    $$('[data-count]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => countUp(el) }));
    gsap.to('#heroImg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('#ctaImg', { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '#cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.footer-mark', { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer-mark', start: 'top 98%' } });
  }

  function intro() {
    const loader = $('#loader'), body = document.body;
    if (!anim) { loader.remove(); body.classList.remove('is-loading'); $('#heroImg').style.transform = 'none'; return; }
    gsap.set('.ln > span', { yPercent: 115 });
    gsap.set(['.hero-kicker', '.hero-lede', '.hero-feature', '.search'], { opacity: 0, y: 30 });
    gsap.set('#header', { opacity: 0, y: -20 });
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.loader svg', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to('.loader span', { opacity: 1, duration: .7 }, '-=.5')
      .to('.loader-inner', { opacity: 0, y: -16, duration: .5, ease: 'power2.in' }, '+=.25')
      .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onComplete: () => { loader.remove(); body.classList.remove('is-loading'); } })
      .fromTo('#heroImg', { scale: 1.28 }, { scale: 1.08, duration: 2.6, ease: 'expo.out' }, '-=.9')
      .to('.ln > span', { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: .14, clearProps: 'transform' }, '-=2.1')
      .to('#header', { opacity: 1, y: 0, duration: 1, clearProps: 'transform,opacity' }, '-=1.5')
      .to(['.hero-kicker', '.hero-lede', '.hero-feature', '.search'], { opacity: 1, y: 0, duration: 1.1, stagger: .1, clearProps: 'transform,opacity' }, '-=1.4');
  }

  /* ---------- Init ---------- */
  renderAgents();
  icons();
  $$('[data-loc-count]').forEach(el => { el.textContent = PROPS.filter(p => p.loc === el.dataset.locCount).length; });
  renderProps(false); renderDrawer(); showFeat(0); showStory(0);
  bind(); scrollFx(); intro();
  window.addEventListener('load', () => { if (hasST) ScrollTrigger.refresh(); });
})();
