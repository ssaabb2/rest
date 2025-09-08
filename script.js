/* =====================================================
   Shared Data Helpers (localStorage based)
===================================================== */
/* افتح الصفحة دائماً من البداية */
(function () {
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(e){}
  // عند التحميل الأول
  window.addEventListener('load', () => { window.scrollTo(0, 0); });
  // عند الرجوع من الخلف/الكاش (Safari/Firefox)
  window.addEventListener('pageshow', (e) => { if (e.persisted) window.scrollTo(0, 0); });
})();
const LS = {
  get(key, def){ try{ return JSON.parse(localStorage.getItem(key)) ?? def; }catch{ return def; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
};
const nowISO = ()=> new Date().toISOString();

function seedIfNeeded(){

  // لا نُضيف بيانات تجريبية. فقط نضمن وجود المفاتيح كمصفوفات فارغة
  if(!localStorage.getItem('categories')) LS.set('categories', []);
  if(!localStorage.getItem('menuItems'))  LS.set('menuItems', []);

  if(!localStorage.getItem('orders')) LS.set('orders', []);
  if(!localStorage.getItem('notifications')) LS.set('notifications', []);
  if(!localStorage.getItem('ratings')) LS.set('ratings', []);
  if(!localStorage.getItem('userRated')) LS.set('userRated', {});
  /* ✅ تهيئة الحجوزات للربط مع لوحة التحكم */
  if(!localStorage.getItem('reservations')) LS.set('reservations', []);
}
seedIfNeeded();

/* ========== Global Modal Helper ========== */
(function(){
  const $ = (s)=>document.querySelector(s);
  const Modal = {
    root:null, title:null, body:null, actions:null, closeBtn:null,
    ensure(){
      if(this.root) return true;
      this.root = $('#appModal');
      if(!this.root) return false;
      this.title   = $('#appModalTitle');
      this.body    = $('#appModalBody');
      this.actions = $('#appModalActions');
      this.closeBtn= $('#appModalClose');
      if(this.closeBtn) this.closeBtn.onclick = ()=>this.hide();
      this.root.addEventListener('click', e=>{ if(e.target===this.root) this.hide(); });
      document.addEventListener('keydown', e=>{ if(e.key==='Escape') this.hide(); });
      return true;
    },
    show(title, html, btns){
      if(!this.ensure()){ alert((html||'').toString().replace(/<[^>]+>/g,'')); return; }
      this.title.textContent = title || '';
      this.body.innerHTML = html || '';
      this.actions.innerHTML = '';
      (btns||[]).forEach(b=> this.actions.appendChild(b));
      this.root.classList.add('open');
      this.root.setAttribute('aria-hidden','false');
    },
    hide(){
      if(!this.root) return;
      this.root.classList.remove('open');
      this.root.setAttribute('aria-hidden','true');
    },
    info(msg, title){
      const ok = document.createElement('button');
      ok.className='btn btn-primary'; ok.textContent='موافق';
      ok.onclick = ()=> this.hide();
      this.show(title||'إشعار', `<div class="small">${msg}</div>`, [ok]);
    },
    confirm(msg, title){
      return new Promise((resolve)=>{
        const yes = document.createElement('button'); yes.className='btn btn-primary'; yes.textContent='تأكيد';
        const no  = document.createElement('button'); no.className='btn btn-ghost';   no.textContent='إلغاء';
        yes.onclick=()=>{ this.hide(); resolve(true); };
        no.onclick =()=>{ this.hide(); resolve(false);};
        this.show(title||'تأكيد', `<div class="small">${msg}</div>`, [yes, no]);
      });
    }
  };
  window.Modal = Modal;
})();

/* =====================================================
   Rendering the Menu
===================================================== */
const catPills       = document.querySelector('#catPills');
const catRibbon      = document.querySelector('#catRibbon');
const grid           = document.querySelector('#itemsGrid');
const searchInput    = document.querySelector('#searchInput');
const cartBtn        = document.querySelector('#cartBtn');   // قد يكون غير موجود
const cartCount      = document.querySelector('#cartCount'); // قد يكون غير موجود
const cartDrawer     = document.querySelector('#cartDrawer');
const closeDrawerBtn = document.querySelector('#closeDrawer');
const checkoutBtn    = document.querySelector('#checkoutBtn');
const cartItemsEl    = document.querySelector('#cartItems');
const cartTotalEl    = document.querySelector('#cartTotal');

/* ===== FAB refs ===== */
let cartFab       = document.querySelector('#cartFab');
let cartFabCount  = document.querySelector('#cartFabCount');
const fabTotalEl  = document.querySelector('#fabTotal'); // قد يكون موجودًا في HTML الجديد

/* ===== Backdrop + Toast ===== */
const backdrop = document.getElementById('backdrop');

/* ---------- Inject minimal CSS for moving underline (إن لم يكن موجودًا في styles.css) ---------- */
function injectUnderlineStyle(){
  if(document.getElementById('catUnderlineStyle')) return;
  const s = document.createElement('style');
  s.id = 'catUnderlineStyle';
  s.textContent = `
    #catRibbon{ position:relative; }
    #catRibbon .cat-underline{
      position:absolute; bottom:4px; height:3px; background:var(--primary);
      border-radius:999px; width:0; transform:translateX(0);
      transition:transform .24s ease, width .24s ease; pointer-events:none;
    }
  `;
  document.head.appendChild(s);
}
injectUnderlineStyle();

/* ✅ حقن ستايل لتعطيل النجوم لمن لم يطلب الصنف */
function injectRatingGuardStyle(){
  if(document.getElementById('ratingGuardStyle')) return;
  const s = document.createElement('style');
  s.id = 'ratingGuardStyle';
  s.textContent = `.stars.disabled{pointer-events:none;opacity:.55;filter:grayscale(.15)}`
  document.head.appendChild(s);
}
injectRatingGuardStyle();

/* ---------- Underline slider + Section spy ---------- */
function ensureCatUnderline(){
  if(!catRibbon) return null;
  let u = catRibbon.querySelector('.cat-underline');
  if(!u){
    u = document.createElement('span');
    u.className = 'cat-underline';
    catRibbon.appendChild(u);
  }
  return u;
}
function moveCatUnderline(){
  const u = ensureCatUnderline();
  if(!u || !catRibbon) return;
  const active = catRibbon.querySelector('.pill.active') || catRibbon.querySelector('.pill');
  if(!active){ u.style.width='0px'; return; }
  const w = active.offsetWidth;
  const x = active.offsetLeft - catRibbon.scrollLeft; // تعويض سكرول أفقي للرِبن
  u.style.width = w + 'px';
  u.style.transform = `translateX(${x}px)`;
}
window.addEventListener('resize', moveCatUnderline);
if(catRibbon){ catRibbon.addEventListener('scroll', moveCatUnderline, {passive:true}); }

/* ===== حركة البداية: انقل السلايدر من "كل الأقسام" إلى التالي عند أول تحميل ===== */
let didInitialKick = false;
function kickUnderlineToNext(){
  if(didInitialKick || !catRibbon) return;
  const pills = Array.from(catRibbon.querySelectorAll('.pill'));
  if(pills.length < 2) return;
  // ابحث عن زر "كل الأقسام"
  const first = pills.find(p => p.dataset.id === 'sections') || pills[0];
  const idx   = pills.indexOf(first);
  const next  = pills[idx + 1] || pills[1];
  if(!next) return;

  // فعّل الـ active بصريًا على التالي (لا نغيّر state.activeCat)
  catRibbon.querySelectorAll('.pill').forEach(b => b.classList.toggle('active', b === next));
  didInitialKick = true;
  // حرّك السلايدر بعد تبديل الـ active لإظهار الأنيميشن
  requestAnimationFrame(() => moveCatUnderline());
}

let sectionObserver = null;
function setupSectionSpy(){
  if(sectionObserver){ sectionObserver.disconnect(); sectionObserver = null; }
  if(state.activeCat !== 'sections') return;

  const sections = Array.from(document.querySelectorAll('.menu-section'));
  if(sections.length === 0) return;

  sectionObserver = new IntersectionObserver((entries)=>{
    const vis = entries.filter(e=>e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if(!vis) return;
    const catId = vis.target.id.replace('sec-','');

    // حدّث شريط الأقسام
    if(catRibbon){
      catRibbon.querySelectorAll('.pill').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.id === catId);
      });
      moveCatUnderline();
    }
    // حدّث قائمة الجانب
    const side = document.querySelector('#sideCats');
    if(side){
      side.querySelectorAll('a').forEach(a=>{
        a.classList.toggle('active', a.getAttribute('data-id') === catId);
      });
    }
  }, { root:null, threshold:0.55 });

  sections.forEach(sec=> sectionObserver.observe(sec));
}

/* Toast بسيط */
const Toast = {
  el: document.getElementById('appToast'),
  show(msg='أُضيفت للسلة'){
    if(!this.el){
      this.el = document.createElement('div');
      this.el.id = 'appToast'; this.el.className = 'toast';
      document.body.appendChild(this.el);
    }
    this.el.textContent = msg;
    this.el.classList.add('open');
    clearTimeout(this._t);
    this._t = setTimeout(()=> this.el.classList.remove('open'), 1400);
  }
};

/* ===== Search Panel ===== */
const searchToggle = document.querySelector('#searchToggle');
const searchPanel  = document.querySelector('#searchPanel');
const searchClose  = document.querySelector('#searchClose');

function openSearchPanel(){
  if(!searchPanel) return;
  searchPanel.classList.add('open');
  searchPanel.setAttribute('aria-hidden','false');
  if(searchToggle) searchToggle.setAttribute('aria-expanded','true');
  setTimeout(()=> searchInput && searchInput.focus(), 120);
}

/* ===== Hero: Reserve Modal =====
   (تاريخ منفصل + وقت منفصل + نوع الحجز + ملاحظات + تحقق ذكي) */
document.addEventListener('DOMContentLoaded', ()=>{
  const reserveBtn = document.getElementById('reserveBtn');
  if (!reserveBtn) return;

  reserveBtn.addEventListener('click', ()=>{
    const html = `
      <form id="reserveForm" class="form-vertical" novalidate style="display:grid;gap:12px">
        <div class="form-row">
          <label class="label" for="rName">الاسم <span class="req">*</span></label>
          <input id="rName" class="input-md" type="text" autocomplete="name" />
        </div>

        <div class="form-row">
          <label class="label" for="rPhone">رقم الجوال <span class="req">*</span></label>
          <input id="rPhone" class="input-md" type="tel" inputmode="tel" placeholder="05xxxxxxxx" />
        </div>

        <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div>
            <label class="label" for="rDate">التاريخ <span class="req">*</span></label>
            <input id="rDate" class="input-md" type="date" />
          </div>
          <div>
            <label class="label" for="rTime">الوقت <span class="req">*</span></label>
            <input id="rTime" class="input-md" type="time" step="900" />
          </div>
        </div>

        <div class="form-row">
          <label class="label" for="rPeople">عدد الأشخاص <span class="req">*</span></label>
          <input id="rPeople" class="input-md" type="number" min="1" value="2" />
        </div>

        <div class="form-row">
          <label class="label" for="rType">نوع الحجز</label>
          <select id="rType" class="input-md">
            <option value="table">طاولة داخل المطعم</option>
            <option value="family">قسم العائلات</option>
            <option value="private">قسم خاص / مناسبات</option>
            <option value="full">حجز المطعم كامل</option>
          </select>
        </div>

        <div class="form-row">
          <label class="label" for="rNotes">ملاحظات (اختياري)</label>
          <textarea id="rNotes" class="input-md" rows="3" placeholder="مثال: تزيين بسيط لعيد ميلاد، قرب قسم العائلات..."></textarea>
        </div>

        <div id="reserveErr" class="form-error small" style="display:none;color:#b91c1c"></div>
      </form>
    `;

    const ok = document.createElement('button'); ok.className='btn btn-primary'; ok.textContent='تأكيد الحجز';
    const cancel = document.createElement('button'); cancel.className='btn btn-ghost';  cancel.textContent='إلغاء';
    cancel.onclick = ()=> Modal.hide();

    // [FIX] اجعل الحدث async
    ok.onclick = async ()=>{
      const name  = document.getElementById('rName')?.value.trim()  || '';
      const phone = document.getElementById('rPhone')?.value.trim() || '';
      const date  = document.getElementById('rDate')?.value || '';
      const time  = document.getElementById('rTime')?.value || '';
      const ppl   = Number(document.getElementById('rPeople')?.value || 0);
      const type  = document.getElementById('rType')?.value || 'table';
      const notes = document.getElementById('rNotes')?.value?.trim() || '';
      const errEl = document.getElementById('reserveErr');

      const errors = [];
      if(!name)  errors.push('يرجى إدخال الاسم.');
      if(!phone) errors.push('يرجى إدخال رقم الجوال.');
      if(!date)  errors.push('يرجى اختيار التاريخ.');
      if(!time)  errors.push('يرجى اختيار الوقت.');
      if(!ppl || ppl < 1) errors.push('عدد الأشخاص غير صحيح.');

      const todayStr = (()=>{ const d=new Date(); const m=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${d.getFullYear()}-${m}-${dd}`; })();
      if(date && date < todayStr) errors.push('لا يمكن اختيار تاريخ في الماضي.');

      // حدود ساعات العمل
      const minTime = '12:00';
      const maxTime = '23:30';
      if(time && time < minTime) errors.push(`الوقت يجب أن يكون بعد ${minTime}.`);
      if(time && time > maxTime) errors.push(`الوقت يجب أن يكون قبل ${maxTime}.`);

      // لو التاريخ اليوم: لا تسمح بوقت مضى
      if(date === todayStr && time){
        const now = new Date();
        const hh = String(now.getHours()).padStart(2,'0');
        const mm = String(now.getMinutes()).padStart(2,'0');
        const nowHM = `${hh}:${mm}`;
        if(time < nowHM) errors.push('الوقت المختار سابق للوقت الحالي.');
      }

      if(errors.length){
        errEl.style.display='block';
        errEl.innerHTML = errors.map(e=>`• ${e}`).join('<br>');
        return;
      }

      // [FIX] تحقّق من توفر الجسر
      if(!window.supabaseBridge || !window.supabaseBridge.createReservationSB){
        Modal.info('الخدمة غير متاحة الآن. تأكد من تحميل Supabase والجسر.','تعذّر الإرسال');
        return;
      }

      // [FIX] لفّ النداء بـ try/catch
      try{
        await window.supabaseBridge.createReservationSB({
          name, phone, iso: `${date}T${time}`, people: ppl, kind: type, notes, duration_minutes: 90
        });

        // إشعار لصفحة لوحة التحكم
        const ns = LS.get('notifications', []);
        ns.unshift({
          id: crypto.randomUUID(),
          type: 'reservation',
          title: 'طلب حجز جديد',
          message: `${name} — ${ppl} أشخاص — ${date} ${time}`,
          time: nowISO(),
          read: false
        });
        LS.set('notifications', ns);
      }catch(e){
        console.error(e);
        Modal.info('تعذّر إرسال الحجز، حاول لاحقًا.','خطأ');
        return; // لا تُظهر نجاح عند الفشل
      }
      /* }catch(e){} */ // [FIX] تحييد الـ catch القديم

      Modal.hide();
      Modal.info('تم استلام طلب الحجز وسنقوم بالتواصل لتأكيده.','حجز طاولة');
    };

    Modal.show('حجز طاولة', html, [ok, cancel]);

    // تهيئة الحقول: أقل تاريخ = اليوم، والوقت ضمن ساعات العمل
    const rDate = document.getElementById('rDate');
    const rTime = document.getElementById('rTime');
    const todayStr = (()=>{ const d=new Date(); const m=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${d.getFullYear()}-${m}-${dd}`; })();
    if(rDate){ rDate.min = todayStr; if(!rDate.value) rDate.value = todayStr; }
    if(rTime){
      rTime.min = '12:00';
      rTime.max = '23:30';
      rTime.step = 900; // كل 15 دقيقة
    }
    setTimeout(()=> document.getElementById('rName')?.focus(), 50);
  });
});

/* إغلاق البحث */
function closeSearchPanel(){
  if(!searchPanel) return;
  if (searchInput && searchInput.value !== '') searchInput.value = '';
  if (typeof state !== 'undefined'){ state.search = ''; try{ renderItems(); }catch{} }
  searchPanel.classList.remove('open');
  searchPanel.setAttribute('aria-hidden','true');
  if(searchToggle) searchToggle.setAttribute('aria-expanded','false');
}
if(searchToggle) searchToggle.addEventListener('click', (e)=>{ e.stopPropagation(); openSearchPanel(); });
if(searchClose)  searchClose .addEventListener('click', closeSearchPanel);

/* ===== تعديل مهم: لا تُغلق البحث عند النقر داخل شبكة النتائج (#itemsGrid) أو داخل عناصره ===== */
document.addEventListener('click', (e)=>{
  if(!searchPanel || !searchPanel.classList.contains('open')) return;

  const path = typeof e.composedPath === 'function' ? e.composedPath() : null;
  const isInside = (el)=> el && (path ? path.includes(el) : el.contains(e.target));

  const inside =
    isInside(searchPanel) ||
    (searchToggle && isInside(searchToggle)) ||
    (grid && isInside(grid)); // ✅ اعتبر شبكة النتائج كجزء من البحث

  if(!inside) closeSearchPanel();
});

/* =====================================================
   حالة الواجهة
===================================================== */
const state = { activeCat:'sections', search:'' };
const catIcons = { 'all':'🍽️','sections':'🗂️','starters':'🥗','mains':'🍛','desserts':'🍰','drinks':'🥤' };

/* ==== تنسيق أرقام إنجليزي لجميع العروض ==== */
const formatPrice = (n)=> Number(n||0).toLocaleString('en-US'); // أسعار
const formatInt   = (n)=> Number(n||0).toLocaleString('en-US'); // أعداد صحيحة (عدادات)
const formatAvg   = (n)=> Number(n||0).toLocaleString('en-US', { minimumFractionDigits:1, maximumFractionDigits:1 }); // متوسط

/* ===== نجمة بملء جزئي (RTL fill) مع حدود ===== */
function starSVGFrac(fill, key){
  const w = Math.max(0, Math.min(1, Number(fill)||0));
  const clipId = `clip-${key}`;
  const d = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
  const width = (w*24).toFixed(2);
  const x = (24 - w*24).toFixed(2); // ابدأ القص من اليمين لليسار
  return `
    <svg class="star" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <defs>
        <clipPath id="${clipId}">
          <rect x="${x}" y="0" width="${width}" height="24"></rect>
        </clipPath>
      </defs>
      <path d="${d}" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1.2"></path>
      <g clip-path="url(#${clipId})">
        <path d="${d}" fill="#F5A524" stroke="#b45309" stroke-width="1.2"></path>
      </g>
    </svg>
  `;
}

/* إجمالي الـ FAB */
function updateFabTotal(){
  const el = document.getElementById('fabTotal');
  if(!el) return;
  const items = LS.get('menuItems', []);
  const cart  = LS.get('cart', []);
  const total = cart.reduce((s,ci)=>{
    const it = items.find(x=>x.id===ci.id);
    return s + (it?.price||0)*ci.qty;
  }, 0);
  el.textContent = formatPrice(total);
}

function renderCats(){
  const cats = LS.get('categories', []);
  const list = cats.filter(c => c.id !== 'all');
  const pseudo = { id:'sections', name:'كل الأقسام' };
  const i = list.findIndex(c => c.id === 'starters');
  if (i > -1) list.splice(i, 0, pseudo);
  else list.unshift(pseudo);

  function drawInto(container){
    if(!container) return;
    container.innerHTML = '';
    list.forEach(c=>{
      const btn = document.createElement('button');
      const isActive = state.activeCat===c.id;
      btn.className = 'pill' + (isActive ? ' active' : '');
      btn.dataset.id = c.id; // مهم للسلايدر والتتبّع
      btn.innerHTML = `<span class="ico">${catIcons[c.id]||'•'}</span><span>${c.name}</span>`;
      btn.onclick = ()=>{
        if (c.id === 'sections'){
          state.activeCat = 'sections';
          renderItems(); renderCats();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (state.activeCat === 'sections'){
          const sec = document.getElementById('sec-'+c.id);
          if (sec) sec.scrollIntoView({ behavior:'smooth', block:'start' });
          // فعّلها فورًا على الشريط ليظهر المؤشر مباشرةً
          if(catRibbon){
            catRibbon.querySelectorAll('.pill').forEach(b=> b.classList.toggle('active', b===btn));
            moveCatUnderline();
          }
        } else {
          state.activeCat = c.id; renderItems(); renderCats();
        }
      };
      container.appendChild(btn);
    });
  }

  drawInto(catPills);
  drawInto(catRibbon);
  // حرّك المؤشر بعد اكتمال الرسم
  moveCatUnderline();

  // عند البداية فقط: حرّك السلايدر من "كل الأقسام" إلى التالي (تأثير بصري)
  if (state.activeCat === 'sections' && !didInitialKick) {
    requestAnimationFrame(() => setTimeout(kickUnderlineToNext, 60));
  }
}
renderCats();

function filteredItems(){
  const items = LS.get('menuItems', []).filter(i=>i.available!==false);
  return items.filter(i=> (state.activeCat==='all' || i.catId===state.activeCat) &&
                           (state.search==='' || i.name.includes(state.search) || i.desc?.includes(state.search)));
}

/* ===== Rating helpers ===== */
function userHasOrderedItem(itemId){
  // ✅ فحص مرن لكلٍ من itemId و id وبالمقارنة كنص لتفادي اختلاف النوع
  const orders = LS.get('orders', []);
  const want = String(itemId);
  return orders.some(o =>
    Array.isArray(o.items) &&
    o.items.some(it => String(it.itemId) === want || String(it.id) === want)
  );
}
function userHasRatedItem(itemId){
  const rated = LS.get('userRated', {});
  return !!rated[itemId];
}

function renderItems(){
  if(!grid) return;

  const allItems = LS.get('menuItems', []).filter(i=>i.available!==false);
  const q = (state.search||'').trim();

  // === بطاقة: السعر يمين + زر يسار + نجوم RTL جزئية + متوسط ملون ===
  function cardHTML(i){
    const canRate = userHasOrderedItem(i.id);
    const already = userHasRatedItem(i.id);
    const avgRaw  = Math.max(0, Math.min(5, Number(i.rating?.avg || 0)));
    const avgTxt  = formatAvg(avgRaw);
    const avgClass= avgRaw >= 4.5 ? 'rate-good' : (avgRaw >= 3 ? 'rate-mid' : 'rate-bad');
    const rateTitle = already ? 'تم التقييم سابقاً' : (canRate ? 'اضغط للتقييم' : 'يمكنك التقييم بعد طلب الصنف');

    return `
      <div class="card">
        <div class="item-img-wrap">
          <img src="${i.img||''}" loading="lazy" decoding="async" class="item-img" alt="${i.name}"/>
          ${i.fresh?'<span class="img-badge">طازج</span>':""}
        </div>
        <div class="item-body">
          <div class="item-title">
            <h3>${i.name}</h3>
            <div class="price"><span>${formatPrice(i.price)}</span> ل.س</div>
          </div>

          <div class="item-desc">${i.desc||''}</div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px">
            <div class="stars ${already?'is-rated':''} ${!canRate?'disabled':''}"
                 data-id="${i.id}"
                 title="${rateTitle}">
              ${[5,4,3,2,1].map(n=>{
                const f = Math.max(0, Math.min(1, avgRaw - (5 - n))); // املأ من اليمين إلى اليسار
                return starSVGFrac(f, `${i.id}-${n}`);
              }).join('')}
              <span class="avg-badge ${avgClass}" title="متوسط التقييم">${avgTxt}</span>
              <span class="small" style="margin-right:6px">(${formatInt(i.rating?.count||0)})</span>
            </div>
          </div>

          <div class="item-actions">
            <button class="btn btn-primary" onclick="addToCart('${i.id}', event)">أضِف إلى السلة</button>
          </div>

        </div>
      </div>
    `;
  }

  if (state.activeCat === 'sections'){
    grid.className = '';
    const cats = LS.get('categories', []).filter(c=>c.id!=='all');
    let html = '';
    cats.forEach(c=>{
      const arr = allItems.filter(i =>
        i.catId === c.id && (q==='' || i.name.includes(q) || i.desc?.includes(q))
      );
      if(arr.length===0) return;

      html += `
        <section class="menu-section" id="sec-${c.id}">
          <div class="card section-card">
            <div class="section-head">
              <h2 class="section-title">${c.name}</h2>
            </div>
            <div class="grid grid-3">
              ${arr.map(cardHTML).join('')}
            </div>
          </div>
        </section>
      `;
    });

    grid.innerHTML = html || '<div class="small" style="color:var(--muted)">لا يوجد أصناف مطابقة.</div>';

    // فعِّل تتبّع الأقسام في وضع "كل الأقسام"
    setupSectionSpy();

  } else {
    grid.className = 'grid grid-3';
    const items = allItems.filter(i=>
      (state.activeCat==='all' || i.catId===state.activeCat) &&
      (q==='' || i.name.includes(q) || i.desc?.includes(q))
    );
    grid.innerHTML = items.map(cardHTML).join('');

    // أوقف التتبّع في الوضع العادي وحرّك المؤشر لمواءمة الحبة النشطة
    if(sectionObserver){ sectionObserver.disconnect(); sectionObserver = null; }
    moveCatUnderline();
  }

  // ربط التقييم — تجاهل العناصر المقفلة/المقيّمة
  document.querySelectorAll('.stars').forEach(el=>{
    if(el.classList.contains('is-rated') || el.classList.contains('disabled')) return;
    const id = el.getAttribute('data-id');
    el.querySelectorAll('.star').forEach((star, idx)=>{
      star.addEventListener('click', ()=>rateItem(id, idx+1));
    });
  });
}
renderItems();

/* ===== بحث ===== */
if(searchInput){
  searchInput.addEventListener('input', (e)=>{ state.search = e.target.value.trim(); renderItems(); });
}

/* =====================================================
   Cart
===================================================== */
function getCart(){ return LS.get('cart', []); }
function setCart(c){ LS.set('cart', c); updateCartCount(); updateFabTotal(); }
function updateCartCount(){
  const c = getCart();
  const n = c.reduce((a,b)=>a+b.qty,0);

  if(cartCount){
    if(n>0){ cartCount.style.display='inline-block'; cartCount.textContent = formatInt(n); }
    else{ cartCount.style.display='none'; }
  }
  if(cartFabCount){
    if(n>0){
      cartFabCount.textContent = formatInt(n);
      cartFabCount.hidden = false;
      cartFabCount.style.display = '';
    }else{
      cartFabCount.hidden = true;
      cartFabCount.style.display = 'none';
    }
  }
}
updateCartCount();

/* ====== إنشاء/تفعيل زر السلة العائم (FAB) ====== */
(function initFab(){
  try{
    // إن لم يكن موجودًا في الـ HTML لأي سبب، أنشئه (بالإجمالي):
    if(!cartFab){
      const btn = document.createElement('button');
      btn.id = 'cartFab';
      btn.className = 'cart-fab';
      btn.type = 'button';
      btn.setAttribute('aria-label','افتح السلة');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.41A2 2 0 0 0 10 18h9v-2h-8.42a.25.25 0 0 1-.22-.37L11 13h6a2 2 0 0 0 1.8-1.1l3-6H7.42L7 4Z" fill="currentColor"/>
        </svg>
        <span class="cart-fab__label"><span id="fabTotal">0</span> ل.س</span>
        <span id="cartFabCount" class="badge" hidden>0</span>
      `;
      document.body.appendChild(btn);
      cartFab = btn;
      cartFabCount = btn.querySelector('#cartFabCount');
    }
    // منع إغلاق السلة فور النقر على الـ FAB
    if(cartFab){
      cartFab.addEventListener('click', (e)=>{ e.stopPropagation(); openCart(); });
    }
    updateCartCount();
    updateFabTotal();
  }catch(e){}
})();

/* ===== تعديل: استقبل الحدث وأوقف انتشاره لمنع إغلاق البحث عند الإضافة ===== */
function addToCart(id, ev){
  if(ev) ev.stopPropagation();
  const cart = getCart();
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.qty++;
  else cart.push({id, qty:1});
  setCart(cart);
  Toast.show('أُضيفت للسلة');
}

/* ===== فتح/إغلاق السلة ===== */
function openCart(){
  if(!cartDrawer) return;
  document.body.classList.add('cart-open');
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden','false');
  if(cartBtn) cartBtn.setAttribute('aria-expanded','true');
  if(cartFab) cartFab.classList.add('fab-hide');
  if(backdrop) backdrop.classList.add('open');
  renderCart();
}
function closeCart(){
  if(!cartDrawer) return;
  document.body.classList.remove('cart-open');
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden','true');
  if(cartBtn) cartBtn.setAttribute('aria-expanded','false');
  if(cartFab) cartFab.classList.remove('fab-hide');
  if(backdrop) backdrop.classList.remove('open');
}
if(cartBtn) cartBtn.addEventListener('click', openCart);
if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCart);

// إغلاق من الخلفية
if(backdrop){ backdrop.addEventListener('click', ()=> closeCart()); }

/* === إغلاق السلة عند النقر خارجها — نسخة محصّنة بـ composedPath === */
document.addEventListener('click', function (e) {
  if(!cartDrawer || !cartDrawer.classList.contains('open')) return;

  const path = typeof e.composedPath === 'function' ? e.composedPath() : null;
  const isInside = (node)=> node && (path ? path.includes(node) : node.contains(e.target));

  const inside =
    isInside(cartDrawer) ||
    (cartFab && isInside(cartFab)) ||
    (cartBtn && isInside(cartBtn));

  if(!inside) closeCart();
});

/* ===== رسم محتوى السلة ===== */
function renderCart(){
  if(!cartItemsEl || !cartTotalEl) return;
  const items = LS.get('menuItems', []);
  const cart  = getCart();
  let total = 0;

  cartItemsEl.innerHTML = '';
  if(cart.length===0){
    cartItemsEl.innerHTML = '<div class="small" style="text-align:center;color:var(--muted)">السلة فارغة</div>';
  }

  cart.forEach(ci=>{
    const item = items.find(x=>x.id===ci.id);
    if(!item) return;
    const sum = item.price * ci.qty;
    total += sum;

    const row = document.createElement('div');
    row.className='cart-item';
    row.innerHTML = `
      <img src="${item.img||''}" loading="lazy" decoding="async" alt="${item.name}"/>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${item.name}</strong>
          <button title="حذف" style="border:none;background:transparent;cursor:pointer;color:#b91c1c;font-weight:700" aria-label="حذف" onclick="removeFromCart('${ci.id}', event)">×</button>
        </div>
        <div class="small" style="color:var(--muted)">${formatPrice(item.price)} ل.س</div>
        <div class="qty" style="margin-top:6px">
          <button onclick="incQty('${ci.id}', event)">+</button>
          <span><strong>${formatInt(ci.qty)}</strong></span>
          <button onclick="decQty('${ci.id}', event)">-</button>
          <span class="small" style="margin-right:auto;color:var(--muted)">المجموع: ${formatPrice(sum)} ل.س</span>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });
  cartTotalEl.textContent = formatPrice(total);
  updateFabTotal();
}

/* ===== دوال الكمية (توقف انتشار الحدث) ===== */
function incQty(id, ev){
  if(ev) ev.stopPropagation();
  const c=getCart(); const x=c.find(i=>i.id===id);
  if(x){ x.qty++; setCart(c); renderCart(); }
}
function decQty(id, ev){
  if(ev) ev.stopPropagation();
  const c=getCart(); const x=c.find(i=>i.id===id);
  if(x){
    x.qty--;
    if(x.qty<=0){ return removeFromCart(id, ev); }
    setCart(c); renderCart();
  }
}
function removeFromCart(id, ev){
  if(ev) ev.stopPropagation();
  const c=getCart().filter(i=>i.id!==id);
  setCart(c); renderCart();
}

/* ============================
   نافذة إدخال بيانات الطلب
===============================*/
/* ============================
   نافذة إدخال بيانات الطلب (جديدة)
===============================*/
function askOrderInfo(){
  return new Promise((resolve)=>{
    const html = `
      <form id="orderForm" class="form-vertical" novalidate>
        <div class="form-row">
          <label class="label" for="tableInput">رقم الطاولة <span class="req">*</span></label>
          <input id="tableInput" class="input-md" type="text" inputmode="numeric" pattern="[0-9]*" dir="auto" placeholder="مثال: 12" />
        </div>

        <div class="form-row">
          <label class="label" for="notesInput">ملاحظات / إضافات <span class="small" style="color:var(--muted)">(اختياري)</span></label>
          <textarea id="notesInput" class="input-md" rows="3" placeholder="مثلاً: بدون بصل / زيادة صوص / إضافة خبز ..."></textarea>
        </div>

        <div id="orderErr" class="form-error small" style="display:none"></div>
      </form>
    `;

    const ok = document.createElement('button'); ok.className='btn btn-primary'; ok.textContent='تأكيد الطلب';
    const cancel = document.createElement('button'); cancel.className='btn btn-ghost';  cancel.textContent='إلغاء';

    ok.onclick = ()=>{
      const tableEl = document.querySelector('#tableInput');
      const notesEl = document.querySelector('#notesInput');
      const table   = (tableEl?.value||'').trim();
      const notes   = (notesEl?.value||'').trim();
      const err     = document.querySelector('#orderErr');

      const mark = (el, bad)=>{ if(!el) return; el.style.borderColor = bad ? '#ef4444' : 'var(--border)'; };
      let hasErr = false;
      if(!table){ hasErr = true; mark(tableEl, true); } else { mark(tableEl, false); }

      if(hasErr){
        if(err){ err.textContent = 'يرجى إدخال رقم الطاولة.'; err.style.display='block'; }
        return;
      }
      if(err) err.style.display='none';

      Modal.hide();
      resolve({ table, notes });
    };
    cancel.onclick = ()=>{ Modal.hide(); resolve(null); };

    Modal.show('إتمام الطلب', html, [ok, cancel]);

    // تركيز تلقائي ودعم Enter للإرسال
    setTimeout(()=>{
      const formEl  = document.querySelector('#orderForm');
      const tableEl = document.querySelector('#tableInput');
      if(tableEl) tableEl.focus();
      if(formEl){ formEl.addEventListener('submit', (e)=>{ e.preventDefault(); ok.click(); }); }
    }, 10);
  });
}

/* =====================================================
   Checkout
===================================================== */
if(checkoutBtn){
  checkoutBtn.addEventListener('click', async ()=>{
    const cart = getCart(); if(cart.length===0) return;
    const items = LS.get('menuItems', []);
    let total=0;

    // [FIX] جهّز عناصر الطلب والإجمالي ومعرّف للعرض
    const orderItems = cart.map(ci=>{
      const it = items.find(x=>x.id===ci.id) || {};
      return { itemId: ci.id, name: it.name || '', price: Number(it.price||0), qty: ci.qty };
    });
    total = orderItems.reduce((s,x)=> s + x.price * x.qty, 0);
    let orderId = Math.floor(Date.now()/1000);
    let __orderSuccessShown = false;

    const info = await askOrderInfo();
    if(!info) return;
    const { table, notes } = info;

    // [FIX] تحقّق من الجسر ولفّ النداء بـ try/catch
    try{
      if(!window.supabaseBridge || !window.supabaseBridge.createOrderSB){
        throw new Error('Supabase bridge not ready');
      }
      await window.supabaseBridge.createOrderSB({
        order_name: '',
        phone: '',
        table_no: table,
        notes,
        items: orderItems.map(x => ({ id: x.itemId, name: x.name, price: x.price, qty: x.qty }))
      });

      // ✅ خزّن الطلب محليًا حتى ينجح شرط "طلبت الصنف" فورًا
      const orders = LS.get('orders', []);
      orders.unshift({
        id: orderId,
        table_no: table,
        notes,
        items: orderItems.map(x => ({ itemId: x.itemId, qty: x.qty })),
        time: nowISO()
      });
      LS.set('orders', orders);

      // تنظيف السلة وعرض نجاح — [FIX] عرض مرّة واحدة
      if(!__orderSuccessShown){
        LS.set('cart', []); updateCartCount(); renderCart(); closeCart();
        Modal.info('تم إرسال الطلب بنجاح! ستصلك رسالة تأكيد قريباً.','نجاح');
        __orderSuccessShown = true;
      }
    }catch(e){
      console.error(e);
      Modal.info('تعذّر إرسال الطلب، حاول لاحقاً.','خطأ');
      return;
    }

    const notifs = LS.get('notifications', []);
    notifs.unshift({ id: crypto.randomUUID(), type:'order', title:`طلب جديد #${formatInt(orderId)}`, message:`إجمالي: ${formatPrice(total)} ل.س`, time: nowISO(), read:false });
    LS.set('notifications', notifs);

    // [FIX] امنع التكرار مرة ثانية
    if(!__orderSuccessShown){
      LS.set('cart', []); updateCartCount(); renderCart(); closeCart();
      Modal.info('تم إرسال الطلب بنجاح! ستصلك رسالة تأكيد قريباً.','نجاح');
      __orderSuccessShown = true;
    }
 
