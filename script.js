/* ==========================================================================
   گالریا — Home page interactions
   ========================================================================== */
(() => {
  'use strict';

  /* ---------------- Data ---------------- */
  const PRODUCTS = [
    { id:'p1', cat:'statue', no:'۰۰۱', title:'مجسمه «بانوی آرام»', material:'رزین و روکش برنز', price:1850000, seed:'galleria-p-statue-1', badge:'پرفروش' },
    { id:'p2', cat:'clock',  no:'۰۱۲', title:'ساعت «مینیمال طلایی»', material:'فلز و شیشه', price:1240000, seed:'galleria-p-clock-1', badge:null },
    { id:'p3', cat:'art',    no:'۰۲۴', title:'تابلو «غروب کویر»', material:'بوم و چاپ روغن', price:2100000, seed:'galleria-p-art-1', badge:'جدید' },
    { id:'p4', cat:'mirror', no:'۰۳۱', title:'آینه «هاله طلایی»', material:'فریم برنجی دست‌ساز', price:2950000, seed:'galleria-p-mirror-1', badge:null },
    { id:'p5', cat:'statue', no:'۰۰۷', title:'مجسمه «پرنده آزادی»', material:'سرامیک لعاب‌دار', price:980000, seed:'galleria-p-statue-2', badge:null },
    { id:'p6', cat:'clock',  no:'۰۱۸', title:'ساعت «چوب گردوی کلاسیک»', material:'چوب گردو و فلز', price:1650000, seed:'galleria-p-clock-2', badge:null },
    { id:'p7', cat:'art',    no:'۰۲۹', title:'تابلو «انتزاعی آبی»', material:'بوم و آکریلیک', price:1790000, seed:'galleria-p-art-2', badge:'پرفروش' },
    { id:'p8', cat:'mirror', no:'۰۳۶', title:'آینه «دایره مدرن»', material:'فریم فلزی مشکی', price:1420000, seed:'galleria-p-mirror-2', badge:null },
  ];

  const ARRIVALS = [
    { title:'مجسمه «رقص باد»', price:2340000, seed:'galleria-a-1' },
    { title:'ساعت «برج کوچک»', price:1180000, seed:'galleria-a-2' },
    { title:'تابلو «باغ ایرانی»', price:2600000, seed:'galleria-a-3' },
    { title:'آینه «برگ زیتون»', price:1950000, seed:'galleria-a-4' },
    { title:'مجسمه «سکوت»', price:1420000, seed:'galleria-a-5' },
    { title:'ساعت «آفتابگردان»', price:1080000, seed:'galleria-a-6' },
  ];

  const money = n => n.toLocaleString('fa-IR') + ' تومان';

  /* ---------------- Render products ---------------- */
  const grid = document.getElementById('productGrid');
  const cartIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 7a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="1.7"/></svg>`;
  const eyeIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>`;

  function productCard(p){
    const el = document.createElement('article');
    el.className = 'product-card';
    el.dataset.cat = p.cat;
    el.innerHTML = `
      <div class="product-media">
        <img src="https://picsum.photos/seed/${p.seed}/520/560" alt="${p.title}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="product-quick" aria-label="نمای سریع ${p.title}">${eyeIcon}</button>
      </div>
      <div class="product-plaque">
        <span class="product-no">قطعه ${p.no}</span>
        <h3 class="product-title">${p.title}</h3>
        <span class="product-material">${p.material}</span>
        <div class="product-foot">
          <span class="product-price">${money(p.price)}</span>
          <button class="add-cart-btn" data-id="${p.id}" aria-label="افزودن ${p.title} به سبد خرید">${cartIcon}</button>
        </div>
      </div>`;
    return el;
  }

  PRODUCTS.forEach(p => grid.appendChild(productCard(p)));

  /* ---------------- Arrivals row ---------------- */
  const arrivalsTrack = document.getElementById('arrivalsTrack');
  ARRIVALS.forEach(a => {
    const el = document.createElement('article');
    el.className = 'arrival-card';
    el.innerHTML = `
      <img src="https://picsum.photos/seed/${a.seed}/420/460" alt="${a.title}" loading="lazy">
      <div class="arrival-body">
        <h4>${a.title}</h4>
        <span>${money(a.price)}</span>
      </div>`;
    arrivalsTrack.appendChild(el);
  });

  /* ---------------- Filter tabs ---------------- */
  const filterTabs = document.getElementById('filterTabs');
  function applyFilter(filter){
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.toggle('hide', filter !== 'all' && card.dataset.cat !== filter);
    });
  }
  filterTabs.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if(!btn) return;
    filterTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
    document.getElementById('featured').scrollIntoView({ behavior:'smooth', block:'start' });
  });

  // Category cards & footer links jump to featured + apply filter
  document.querySelectorAll('[data-cat-filter], [data-cat-link]').forEach(link => {
    link.addEventListener('click', e => {
      const cat = link.dataset.catFilter || link.dataset.catLink;
      const target = filterTabs.querySelector(`[data-filter="${cat}"]`);
      if(target){ e.preventDefault(); target.click(); }
    });
  });

  /* ---------------- Cart ---------------- */
  const cart = {};
  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  function renderCart(){
    const ids = Object.keys(cart);
    cartCountEl.textContent = ids.reduce((sum,id) => sum + cart[id].qty, 0);
    if(ids.length === 0){
      cartItemsEl.innerHTML = '<p class="cart-empty">سبد خرید شما خالی است. یک اثر هنری برای خانه‌تان انتخاب کنید.</p>';
      cartTotalEl.textContent = money(0);
      return;
    }
    let total = 0;
    cartItemsEl.innerHTML = ids.map(id => {
      const item = cart[id];
      total += item.price * item.qty;
      return `
        <div class="cart-line" data-id="${id}">
          <img src="https://picsum.photos/seed/${item.seed}/120/120" alt="${item.title}">
          <div class="cart-line-info">
            <h5>${item.title}</h5>
            <span>${money(item.price)} × ${item.qty.toLocaleString('fa-IR')}</span>
          </div>
          <button class="cart-line-remove" data-remove="${id}" aria-label="حذف">×</button>
        </div>`;
    }).join('');
    cartTotalEl.textContent = money(total);
  }

  function addToCart(id, btn){
    const p = PRODUCTS.find(x => x.id === id);
    if(!p) return;
    if(cart[id]) cart[id].qty += 1;
    else cart[id] = { ...p, qty:1 };
    renderCart();
    showToast(`<strong>${p.title}</strong> به سبد خرید افزوده شد`);
    if(btn){
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 900);
    }
  }

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-cart-btn');
    if(!btn) return;
    addToCart(btn.dataset.id, btn);
  });

  cartItemsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if(!btn) return;
    delete cart[btn.dataset.remove];
    renderCart();
  });

  const cartDrawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  function openDrawer(){ cartDrawer.classList.add('open'); overlay.classList.add('show'); }
  function closeDrawer(){ cartDrawer.classList.remove('open'); overlay.classList.remove('show'); closeMenu(); }
  document.getElementById('cartBtn').addEventListener('click', openDrawer);
  document.getElementById('cartClose').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', () => { closeDrawer(); closeSearch(); });

  /* ---------------- Toasts ---------------- */
  const toastContainer = document.getElementById('toastContainer');
  function showToast(html){
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = html;
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 400);
    }, 2600);
  }

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive:true });

  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  function closeMenu(){ menuToggle.classList.remove('open'); mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); if(!cartDrawer.classList.contains('open') && !document.getElementById('searchPanel').classList.contains('open')) overlay.classList.remove('show'); }
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    overlay.classList.toggle('show', isOpen);
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------------- Search panel ---------------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  function closeSearch(){ searchPanel.classList.remove('open'); searchToggle.setAttribute('aria-expanded','false'); }
  searchToggle.addEventListener('click', () => {
    const open = searchPanel.classList.toggle('open');
    searchToggle.setAttribute('aria-expanded', String(open));
    if(open) setTimeout(() => searchInput.focus(), 250);
  });
  searchClose.addEventListener('click', closeSearch);
  document.getElementById('searchSubmit').addEventListener('click', () => {
    if(searchInput.value.trim()){
      showToast(`جستجو برای <strong>${searchInput.value.trim()}</strong>…`);
      closeSearch();
    }
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = ['hero','categories','featured','story','testimonials','footer'].map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- Stat counters ---------------- */
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('fa-IR');
        if(progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('fa-IR');
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold:0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---------------- Testimonial slider ---------------- */
  const slides = Array.from(document.querySelectorAll('.testi-slide'));
  const dotsWrap = document.getElementById('testiDots');
  let current = 0, testiTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if(i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `نظر ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(i){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }
  function resetTimer(){
    clearInterval(testiTimer);
    testiTimer = setInterval(() => goToSlide(current + 1), 6000);
  }
  document.getElementById('testiPrev').addEventListener('click', () => goToSlide(current - 1));
  document.getElementById('testiNext').addEventListener('click', () => goToSlide(current + 1));
  resetTimer();

  /* ---------------- Newsletter form ---------------- */
  document.getElementById('newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail');
    if(email.value.trim()){
      showToast('عضویت شما با موفقیت در <strong>خبرنامه گالریا</strong> ثبت شد 🌿');
      email.value = '';
    }
  });

  /* ---------------- Footer year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear().toLocaleString('fa-IR', { useGrouping:false });

  renderCart();
})();
