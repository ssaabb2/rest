/* ================== Global Styles ================== */
/* === Polish for Middle Theme – Fix Pack 2025-09-08 ===
   - رفع z-index للـ .drawer إلى 1000
   - إضافة .side-mask ثابتة للقوائم الجانبية
   - توحيد سلوك الشريط الجانبي في الموبايل (off-canvas)
   - إصلاح أقواس ميديا كويري مكسورة + إزالة تكرارات
   - إضافة ستايلات نافذة "قيّم طلبك" (مرّة واحدة) .rate-modal
===================================================== */

/* استيراد خط Tajawal لكل الموقع */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

:root{
  /* أحمر العلامة */
  --primary:#C33A41;
  --primary-700:#A33137;

  /* محايد دافئ */
  --bg:#F6F3EE;
  --card:#FFFFFF;
  --border:#efece6;

  --text:#1F2937;
  --muted:#667085;

  --secondary:#2B7A78;

  /* النجوم */
  --star:#F5A524;
  --star-stroke:#b45309;
  --star-muted:#e5e7eb;
  --star-stroke-muted:#9ca3af;

  --ring:rgba(195,58,65,.18);
  --shadow:0 12px 28px rgba(17,24,39,.06);

  /* إضافات عامة مرنة */
  --page-max: 1200px;
  --g: 16px;  /* gap افتراضي */
  --appbar-h: 56px;
  --appbar-pad: 12px;

  /* Footer */
  --footer-bg:#233746;
  --footer-text:#e7eef5;
  --footer-muted:#c9d6e2;
  --footer-border:rgba(255,255,255,.08);
  --footer-accent: var(--primary);
  --foot-lh:1.85;
  --foot-offset:125px;

  /* ساعات العمل */
  --hours-bg:#2b333e;

  /* إضافات ألوان */
  --olive:#4E6F56;
  --beige:#F5EFE6;
  --success:#16A34A;
  --warning:#EA580C;
  --info:#0EA5E9;
}

*{ box-sizing:border-box; -webkit-tap-highlight-color: transparent }
html{
  direction:rtl;
  font-family:"Tajawal","Noto Sans Arabic","Noto Kufi Arabic",
              system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  overscroll-behavior: contain;
}
body{
  margin:0;
  background:var(--bg);
  color:var(--text);
  line-height:1.7;
  font-size:clamp(1rem, .6vw + .9rem, 1.125rem);
}
body,button,input,select,textarea{ font-family:inherit }
:focus-visible{ outline:3px solid var(--primary); outline-offset:2px }

/* Helpers */
.container{ width:min(100% - 24px, var(--page-max)); margin-inline:auto; padding:0 0 }
.grid{ display:grid; gap:24px }
.grid-3{ grid-template-columns:repeat(3, minmax(0,1fr)) }
@media (max-width:1000px){ .grid-3{ grid-template-columns:repeat(2, minmax(0,1fr)) } }
@media (max-width:700px){
  .grid-3{ grid-template-columns:repeat(2, minmax(0,1fr)); gap:14px; padding-inline:0 }
  .card{ min-width:0; margin:0 }
}

/* نص مرن للعناوين */
h1{ font-size:clamp(1.6rem, 2.2vw, 2.25rem); line-height:1.2; margin:0 0 .6em }
h2{ font-size:clamp(1.35rem, 1.6vw, 1.75rem); line-height:1.25; margin:0 0 .6em }
h3{ font-size:clamp(1.125rem, 1vw, 1.375rem); line-height:1.3; margin:0 0 .6em }
p  { margin:0 0 1em }

/* عناصر تفاعلية عامة */
a, button, .btn, .pill, .card, .icon-btn, .input, select, textarea {
  transition: background-color .2s ease, border-color .2s ease, color .2s ease,
              box-shadow .25s ease, transform .18s ease, opacity .2s ease;
}

/* بطاقات عامة */
.card{
  background:var(--card);
  border-radius:18px;
  box-shadow:var(--shadow);
  overflow:hidden;
  border:1px solid var(--border);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card:hover{
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(0,0,0,.08);
}

/* أزرار */
.btn{
  border:none; border-radius:999px; padding:10px 16px;
  font-weight:600; cursor:pointer; transition:.2s;
  box-shadow: 0 6px 12px rgba(0,0,0,.06);
  min-height:44px;
}
.btn:disabled{ opacity:.6; cursor:not-allowed }
.btn:hover{ transform: translateY(-1px) }
.btn:active{ transform: translateY(0) }
.btn-primary{ background:var(--primary); color:#fff; box-shadow:0 10px 18px rgba(195,58,65,.16) }
.btn-primary:hover{ background:var(--primary-700) }
.btn-ghost{ background:#fff; border:1px solid #eee; color:var(--text) }
.btn-olive{ background:var(--olive); color:#fff; box-shadow:0 10px 18px rgba(94,122,78,.18) }
.btn.is-loading{ position:relative; pointer-events:none; color:transparent }
.btn.is-loading::after{
  content:""; position:absolute; inset:0; margin:auto; width:18px; height:18px;
  border:3px solid currentColor; border-right-color:transparent; border-radius:50%;
  animation: spin .8s linear infinite;
}

/* بادج */
.badge{
  display:inline-flex; align-items:center; gap:6px;
  padding:6px 10px; border-radius:999px; font-size:.78rem; font-weight:700;
  box-shadow: 0 6px 12px rgba(0,0,0,.05);
}
.badge-olive{ background:var(--beige); color:var(--olive) }
.badge-danger{ background:#fee2e2; color:#b91c1c }
.badge-muted{ background:#f3f4f6; color:#374151 }

/* ================== Navbar ================== */
.navbar{
  position:sticky; top:0; z-index:30;
  padding-block: var(--appbar-pad);
  background:rgba(255,255,255,.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-bottom:1px solid var(--border);
}
.navbar .container{ min-height: var(--appbar-h) }
.navbar.is-scrolled{ box-shadow: 0 8px 24px rgba(0,0,0,.06) }
.navbar .row{ display:grid; grid-template-columns:1fr auto 1fr; align-items:center }

.brand{ font-size: clamp(1.6rem, 2.2vw, 1.8rem); font-weight:900; color:var(--primary) }
.nav-links{ display:flex; gap:22px; align-items:center; justify-content:center }
.nav-links a{ color:#374151; text-decoration:none; font-weight:600; position:relative; padding-bottom:10px }
.nav-links a.active::after{
  content:""; position:absolute; right:0; left:0; bottom:0; height:3px;
  background:var(--primary); border-radius:6px;
}
.nav-actions{ display:flex; align-items:center; gap:12px }

.nav-left{ display:flex; align-items:center; gap:10px }
.nav-search{ display:flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid #e5e7eb; border-radius:12px; background:#fff }
.nav-search input{ border:none; outline:none; background:transparent; width:200px }
@media (max-width:640px){ .nav-search input{ width:140px } }

.icon-btn{
  position:relative; width: clamp(48px, 4vw, 58px); height: clamp(48px, 4vw, 58px);
  border-radius:50%; display:grid; place-items:center; border:1px solid #eee; background:#fff; cursor:pointer;
}
.icon-btn svg{ width: clamp(20px, 5.5vw, 26px); height: clamp(20px, 5.5vw, 26px) }
.icon-badge{
  position:absolute; top:-6px; left:-6px; background:var(--primary); color:#fff;
  font-size: clamp(.65rem, .85vw, .8rem);
  border-radius:999px; padding:2px 7px; font-weight:700; min-width: clamp(18px, 1.5vw, 22px); text-align:center;
  animation: pulse 1.8s ease-in-out infinite;
}

/* ===== شريط الأصناف تحت الـ App Bar ===== */
.cats-bar{
  background:var(--card); border-bottom:1px solid var(--border);
  position:sticky; top:56px; z-index:29;
}
.cats-bar.sticky{ top: var(--appbar-h) }
.h-scroll{
  display:flex; align-items:center; gap:12px;
  overflow-x:auto; padding:12px 0;
  scroll-snap-type:x proximity;
  -webkit-overflow-scrolling: touch;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%);
}
.h-scroll::-webkit-scrollbar{ height:8px }
.h-scroll::-webkit-scrollbar-thumb{ background:#e5e7eb; border-radius:999px }

.pills{ display:flex; flex-wrap:wrap; gap:12px; margin:18px 0 26px }
.pill{
  background:#fff; border:1px solid var(--border); color:#374151;
  border-radius:999px; padding:12px 16px; cursor:pointer; font-weight:700; box-shadow:var(--shadow);
  display:inline-flex; align-items:center; gap:10px;
}
.pill.active{ background:var(--primary); color:#fff; border-color:transparent; box-shadow: 0 10px 22px rgba(195,58,65,.22) }
#catPills .pill.active, #catRibbon .pill.active{ color:#dc2626; background:#fee2e2; border-color:#fecaca }

/* ================== Hero ================== */
.hero{
  background: radial-gradient(1200px 300px at 70% -50%, #fce2e2 20%, transparent 60%),
              linear-gradient(180deg, #dd5b5b, #c53f3f);
  color:#fff; padding:60px 0 36px 0; margin-bottom:18px;
}
.hero h1{ margin:0 0 12px }
.hero p{ opacity:.95; margin:0 }
.hero-actions{ margin-top:18px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap }
.hero-actions a{ text-decoration:none !important; border-bottom:none !important }

/* ================== Search Panel (موسع) ================== */
.search-panel{
  position: sticky; top: 0; z-index: 45; background:#fff; border-bottom:1px solid #eee;
  box-shadow: 0 8px 18px rgba(0,0,0,.06); max-height:0; overflow:hidden; opacity:0;
  transition: max-height .25s ease, opacity .2s ease;
}
.search-panel.open{ max-height: 120px; opacity:1 }
.search-panel .search-panel-row{ display:flex; align-items:center; gap:12px; padding:12px 0 }
.search-lg{
  display:flex; align-items:center; gap:10px;
  padding:12px 16px; border:2px solid #e5e7eb; border-radius:999px; background:#fff; flex:1;
  box-shadow: inset 0 2px 12px rgba(0,0,0,.04);
}
.search-lg input{ border:none; outline:none; background:transparent; width:100% }

/* ================== Menu Cards ================== */
.item-img-wrap{ position:relative; aspect-ratio:16/10; overflow:hidden }
.item-img{ width:100%; height:100%; object-fit:cover; transition: transform .6s ease }
.item-img-wrap:hover .item-img{ transform: scale(1.04) }

.item-body{ padding:16px 16px 14px; display:flex; flex-direction:column; gap:10px; min-height:210px }
.item-title{ display:flex; justify-content:space-between; align-items:center; gap:12px }
.item-title h3{
  margin:0; font-size:1.1rem; font-weight:900; line-height:1.3;
  display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
}
.item-desc{
  color:var(--muted);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  min-height:2.8em; margin:4px 0 6px;
}
.price{ color:var(--primary); font-weight:900; font-size:1.1rem; white-space:nowrap }

.item-cta{ margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:10px }
.btn-compact{ padding:8px 12px; border-radius:10px; font-weight:800; min-height:auto; box-shadow:0 6px 12px rgba(0,0,0,.06) }
.item-actions{ margin-top:auto }
.item-actions .btn{ width:100%; border-radius:12px; padding:10px 14px; font-weight:800 }

/* نجوم عامة (عرض عنصر) */
.stars{ display:inline-flex; align-items:center; gap:6px; color:#f59e0b }
.stars .star{ width:20px; height:20px; display:block; cursor:pointer; opacity:.9; transition:transform .15s ease, opacity .15s ease }
.stars .star:hover{ transform:scale(1.08); opacity:1 }
.stars .star .star-base{ fill: var(--star-muted); stroke: var(--star-stroke-muted); stroke-width:1.2; vector-effect:non-scaling-stroke }
.stars .star .star-fill{ fill: var(--star); stroke: var(--star-stroke); stroke-width:1.2; vector-effect:non-scaling-stroke }
.stars.is-rated{ pointer-events:none; opacity:.85; filter: grayscale(.05) }
.avg-badge{
  font-weight:800; font-size:.85rem; padding:2px 8px; border-radius:999px; border:1px solid transparent; line-height:1.4;
}
.avg-badge.rate-good{ color:#16a34a; background:rgba(34,197,94,.12); border-color:rgba(34,197,94,.35) }
.avg-badge.rate-mid{  color:#b45309; background:rgba(245,158,11,.12); border-color:rgba(245,158,11,.35) }
.avg-badge.rate-bad{  color:#b91c1c; background:rgba(239,68,68,.12); border-color:rgba(239,68,68,.35) }

@media (max-width:700px){
  .item-img-wrap{ aspect-ratio:1/1 }
  .item-body{ min-height:unset }
  .item-title h3, .price{ font-size:1rem }
  .stars .star{ width:16px; height:16px }
  .avg-badge{ font-size:.78rem; padding:2px 6px }
}

/* بادج على الصورة */
.img-badge{
  position:absolute; top:12px; right:12px;
  background:#e9f7e9; color:#187a26; border-radius:999px; padding:6px 10px; font-weight:800; font-size:.8rem;
  box-shadow:var(--shadow);
}

/* ================== Drawer & Side Mask ================== */
.drawer{
  position:fixed; inset:0 0 0 auto; width:min(380px, 92vw);
  background:#fff; z-index:1000;
  transform:translateX(100%); border-left:1px solid #eee; box-shadow: -8px 0 16px rgba(0,0,0,.06);
  display:flex; flex-direction:column;
}
.drawer .head{ padding:14px 16px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center }
.drawer .body{ padding:16px; flex:1; overflow:auto; display:flex; flex-direction:column; gap:12px }
.drawer.open{ transform:translateX(0); animation: slideInFromRight .25s ease-out both }
.drawer.closing{ animation: slideOutToRight .22s ease-in both }

/* نسخة يسار */
.drawer.start{ inset:0 auto 0 0; transform:translateX(-100%); border-right:1px solid #eee; border-left:none; box-shadow:8px 0 16px rgba(0,0,0,.06) }
.drawer.start.open{ transform:translateX(0); animation: slideInFromLeft .25s ease-out both }
.drawer.start.closing{ animation: slideOutToLeft .22s ease-in both }

/* قناع جانبي عام */
.side-mask{ position:fixed; inset:0; background:rgba(0,0,0,.28); display:none; z-index:999 }
.side-mask.open{ display:block; pointer-events:auto }

/* Drawer Notifications (مخفي افتراضاً على الواجهات الإدارية) */
#notifDrawer{
  position:fixed; inset:0 0 0 auto; width:min(420px, 92vw); background:#fff;
  border-left:1px solid #eee; box-shadow:-8px 0 16px rgba(0,0,0,.06);
  transform:translateX(100%); opacity:0; visibility:hidden; pointer-events:none; z-index:1000;
  transition: transform .25s ease, opacity .2s ease;
}
#notifDrawer.open{ transform:translateX(0); opacity:1; visibility:visible; pointer-events:auto }

/* عناصر داخل الدرج */
.side-nav{ display:flex; flex-direction:column; gap:6px }
.side-nav a{
  display:block; padding:10px 12px; border-radius:12px; color:#374151; text-decoration:none; font-weight:800;
}
.side-nav a:hover, .side-nav a.active{ background:var(--primary); color:#fff }
.side-brand{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:8px 0 12px }
.side-brand img{ width:84px; height:84px; border-radius:50%; object-fit:cover; border:2px solid #eee; box-shadow:0 6px 16px rgba(0,0,0,.08) }
.side-brand .brand-name{ font-weight:800; font-size:1.05rem; cursor:pointer }

/* سوشيال داخل القائمة الأمامية */
#frontSidebar .social{ display:flex; gap:16px; justify-content:center; align-items:center; margin-bottom:16px }
#frontSidebar .social a{
  display:inline-flex; align-items:center; justify-content:center;
  width:44px; height:44px; border-radius:50%; background:#f3f4f6; color:#374151;
  font-size:1.6rem; box-shadow:0 2px 8px rgba(0,0,0,.08); text-decoration:none; border:none;
  transition: background .2s, color .2s, box-shadow .2s, transform .18s;
}
#frontSidebar .social a:hover{ background:var(--primary); color:#fff; box-shadow:0 4px 16px rgba(195,58,65,.18); transform: translateY(-2px) scale(1.08) }

/* ألوان علامة ثابتة */
#frontSidebar .social a.wa{ background:#25D366; color:#fff; border-color:transparent }
#frontSidebar .social a.ig{ background: conic-gradient(from 225deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5); color:#fff; border-color:transparent }
#frontSidebar .social a.fb{ background:#1877F2; color:#fff; border-color:transparent }
#frontSidebar .social a.tt{ background:#000; color:#fff; border-color:transparent }
#frontSidebar .social a:hover{ transform:translateY(-2px) scale(1.08) }
#frontSidebar .social a i{ color: currentColor }

/* ================== Cart FAB ================== */
.cart-fab{
  position: fixed; inset-inline-end: clamp(14px, 2vw, 22px);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
  height:56px; border-radius:9999px; background:var(--primary); color:#fff; border:none; cursor:pointer;
  display:grid; grid-auto-flow:column; place-items:center; gap:10px; padding-inline:16px; width:auto;
  box-shadow:0 12px 24px rgba(0,0,0,.18); z-index:3000;
  transition: transform .15s ease, background-color .15s ease, opacity .15s ease;
}
.cart-fab:hover{ background:var(--primary-700); transform:translateY(-1px) }
.cart-fab:active{ transform:translateY(0) }
.cart-fab.fab-hide{ opacity:0; transform:scale(.92); pointer-events:none }
.cart-fab .badge{
  position:absolute; top:-8px; inset-inline-end:-8px; min-width:22px; height:22px; padding:0 6px;
  border-radius:999px; font-size:12px; font-weight:700; background:#111827; color:#fff;
  display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,.2);
}

/* خلفية غامقة للسلة */
.backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.28); opacity:0; pointer-events:none; z-index:48; transition:opacity .2s ease }
.backdrop.open{ opacity:1; pointer-events:auto }
body.cart-open .navbar, body.cart-open .cats-bar{ opacity:0; pointer-events:none }

/* ================== Modal (تُستخدم أيضاً لنافذة التقييم) ================== */
.modal{ position:fixed; inset:0; background:rgba(0,0,0,.45); display:none; place-items:center; z-index:1200 }
.modal.open{ display:grid }
.modal .modal-dialog{
  width:min(520px, 92vw); background:#fff; border:1px solid var(--border);
  border-radius:16px; box-shadow:var(--shadow); overflow:hidden;
}
.modal .modal-head{
  padding:14px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border);
}
.modal .modal-body{ padding:16px; max-height:calc(100dvh - 220px); overflow:auto }
.modal .modal-actions{ padding:12px 16px; border-top:1px solid var(--border); display:flex; gap:8px; justify-content:flex-end }

/* ===== نافذة التقييم (مرة واحدة) ===== */
.rate-modal .small{ color:var(--muted) }
.rate-modal .rate-list{ display:grid; gap:10px; margin-top:6px }
.rate-modal .rate-row{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:10px 0; border-top:1px dashed var(--border);
}
.rate-modal .rate-row:first-child{ border-top:none }
.rate-modal .stars-pick{ display:inline-flex; gap:6px; align-items:center }
.rate-modal .stars-pick .s{
  appearance:none; border:none; background:transparent; cursor:pointer;
  font-size:22px; line-height:1; color:var(--star-muted);
  transition: transform .15s ease, color .15s ease, opacity .15s ease;
}
.rate-modal .stars-pick .s:hover{ transform:scale(1.12) }
.rate-modal .stars-pick .s.active{ color:var(--star) }
.rate-modal .stars-pick .s:focus-visible{ outline:2px solid var(--ring); border-radius:6px }

/* ================== Forms ================== */
.input, select, textarea{ padding:10px 12px; border:1px solid var(--border); border-radius:10px; outline:none; background:#fff }
.input:focus, select:focus, textarea:focus{ border-color:var(--primary); box-shadow:0 0 0 4px var(--ring) }
.input-md{ width:100%; padding:12px; border:1px solid var(--border); border-radius:12px; background:#fff }
.input-md:focus{ border-color:var(--primary); box-shadow:0 0 0 4px var(--ring) }
.form-vertical{ display:grid; grid-template-columns:1fr; gap:12px }
.form-row{ display:flex; flex-direction:column; gap:6px }
.label{ font-weight:800; color:#111 }
.req{ color:#ef4444; margin-inline:4px }
.form-error{ color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; padding:8px 10px; border-radius:10px }

/* ================== Admin Basics ================== */
.admin-layout{ display:grid; grid-template-columns:260px 1fr; min-height:100vh }
.sidebar{ background:#fff; border-left:1px solid #eee; padding:14px 10px }
.sidebar h3{ margin:8px 0 16px; color:#111 }
.side-link{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; color:#374151; text-decoration:none; font-weight:700 }
.side-link:hover{ background:#f7f7f7 }
.sidebar .side-link.active{ background:var(--primary); color:#fff; border-radius:10px }
.main{ padding:18px }
.kpis{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-bottom:20px }
@media (max-width:1100px){ .kpis{ grid-template-columns:repeat(2,minmax(0,1fr)) } }
.kpi{ padding:16px; border:1px solid #eee; border-radius:16px; background:#fff; box-shadow:var(--shadow); transition: transform .18s ease, box-shadow .22s ease }
.kpi:hover{ transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0,0,0,.08) }
.section{ margin:18px 0 }
.table{ width:100%; border-collapse:collapse }
.table th,.table td{ padding:10px; border-bottom:1px solid #eee; text-align:right }
.notice{ padding:12px; border-radius:12px; background:#fff3f3; border:1px solid #fde1e1; color:#a11f1f }
hr.sep{ border:none; height:1px; background:#f0f0f0; margin:16px 0 }

/* Admin sidebar -> off-canvas على الموبايل */
@media (min-width:1024px){ .layout { align-items:flex-start } .sidebar{ position:sticky; top:12px; max-height:calc(100vh - 24px); overflow:auto } }
#adminMenuBtn{ display:none }
@media (max-width:960px){
  .admin-layout{ grid-template-columns: 1fr !important }
  .admin-layout .sidebar{
    position:fixed; inset:0 0 0 auto; width:min(84vw, 320px);
    background:var(--card); border-left:1px solid var(--border);
    transform:translateX(100%); opacity:0; visibility:hidden; pointer-events:none; z-index:1000; padding:12px;
    box-shadow:-8px 0 16px rgba(0,0,0,.16);
  }
  .admin-layout .sidebar.open{ transform:translateX(0); opacity:1; visibility:visible; pointer-events:auto }
  /* غطاء خلفي */
  .sidebar-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.28); z-index:90; display:none }
  body.sidebar-open .sidebar-backdrop{ display:block }
  /* زر القائمة */
  #adminMenuBtn{ display:inline-flex; align-items:center }
}
@media (min-width:961px){ #adminMenuBtn{ display:none } }

/* إخفاء درج الإشعارات في لوحات الإدارة */
#notifyBtn, #notifDrawer{ display:none !important }

/* ================== KDS Tweaks ================== */
.kds-head{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between; margin-bottom:12px }
.kds-tabs{ display:flex; gap:8px; align-items:center; flex-wrap:wrap }
.kds-tab{ display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; border:1px solid #eee; background:#fff; cursor:pointer; font-weight:800 }
.kds-tab.active{ background:var(--primary); color:#fff; border-color:transparent }
.kds-tab .dot{ width:10px; height:10px; border-radius:50% }
.dot-new{ background:#f97316 } .dot-received{ background:#3b82f6 } .dot-preparing{ background:#10b981 } .dot-delivered{ background:#9ca3af }
.kds-actions{ display:flex; gap:8px; align-items:center; flex-wrap:wrap }
.kds-grid{ display:grid; gap:16px; grid-template-columns:repeat(3, minmax(0,1fr)) }
@media (max-width:1100px){ .kds-grid{ grid-template-columns:repeat(2, minmax(0,1fr)) } }
@media (max-width:720px){ .kds-grid{ grid-template-columns:1fr } }
.kds-card{ position:relative; border-radius:16px; border:1px solid #eee; background:#111827; color:#e5e7eb }
.kds-card .hdr{ display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.06) }
.kds-card .hdr .left{ display:flex; gap:8px; align-items:center }
.kds-card .hdr .time{ font-weight:800; opacity:.9 }
.kds-card .hdr .chip{ background:#0f172a; color:#cbd5e1; border:1px solid rgba(255,255,255,.08); padding:4px 8px; border-radius:999px; font-size:.78rem; font-weight:800 }
.kds-card .body{ padding:12px }
.kds-card .row{ display:flex; justify-content:space-between; gap:8px; align-items:center }
.kds-card .title{ font-size:1.05rem; font-weight:900 }
.kds-note{ margin-top:10px; padding:10px; border-radius:10px; background:#0b1220; border:1px dashed rgba(255,255,255,.12); font-size:.9rem }
.kds-items{ margin-top:8px; border-top:1px solid rgba(255,255,255,.08); padding-top:8px }
.kds-items .it{ display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,.06) }
.kds-items .it:last-child{ border-bottom:none }
.kds-foot{ display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:8px; padding:12px; border-top:1px solid rgba(255,255,255,.06); background:#0b1220 }
.kds-foot .btn{ border-radius:12px; font-weight:800 }
.kds-meter{ height:6px; background:#0b1220; margin:8px 12px; border-radius:999px; overflow:hidden }
.kds-meter > span{ display:block; height:100% }
.kds-new{ box-shadow:0 0 0 2px rgba(249,115,22,.25) inset }
.kds-received{ box-shadow:0 0 0 2px rgba(59,130,246,.25) inset }
.kds-preparing{ box-shadow:0 0 0 2px rgba(16,185,129,.25) inset }
.kds-delivered{ opacity:.7; box-shadow:0 0 0 2px rgba(156,163,175,.25) inset }
.kds-muted{ color:#94a3b8 }

/* ================== ساعات العمل (كارد داكن) ================== */
.hours-card{
  background:var(--hours-bg)!important; color:#e5e7eb!important;
  border:1px solid rgba(255,255,255,.08)!important; box-shadow:0 18px 38px rgba(0,0,0,.28)!important;
}
.hours-list{ display:grid; gap:8px }
.hours-row{
  position:relative; display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
  padding:10px 12px; border-radius:12px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
}
.hours-row .day{ font-weight:900; text-align:right }
.hours-row .time{ text-align:center; font-weight:900; letter-spacing:.2px }
.hours-row .st{ justify-self:end }
.hours-row.today::after{
  content:""; position:absolute; inset:0; background:rgba(255,255,255,.06);
  border:1px dashed rgba(255,255,255,.16); border-radius:12px; pointer-events:none;
}
.badge.open{ background:rgba(16,185,129,.18); color:#bbf7d0; border:1px solid rgba(16,185,129,.35) }
.badge.closed{ background:rgba(239,68,68,.18); color:#fecaca; border:1px solid rgba(239,68,68,.35) }
.badge.neutral{ background:rgba(255,255,255,.08); color:#e5e7eb; border:1px solid rgba(255,255,255,.14) }

/* ================== About ================== */
.about-card h2{ font-size:1.75rem; font-weight:900; margin-bottom:14px }
.about-card p{ font-size:1.05rem; line-height:2.1; color:#374151; margin:0 0 12px }
.about-location{ margin-top:10px; text-align:right }
.about-location h3{ margin:14px 0 6px; font-size:1.2rem }
.about-address{ font-size:1rem; margin-bottom:12px }
.about-social{ display:flex; gap:16px; align-items:center; justify-content:flex-start }
.about-social a{
  width:56px; height:56px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:var(--primary); color:#fff; font-size:1.3rem; text-decoration:none;
  box-shadow:0 6px 16px rgba(195,58,65,.25);
  transition: transform .18s ease, box-shadow .18s ease, opacity .2s ease;
}
.about-social a:hover{ transform: translateY(-3px) scale(1.05); box-shadow: 0 10px 22px rgba(195,58,65,.3) }
.about-social .wa i, .about-social .ig i, .about-social .tw i, .about-social .fb i{ color:#fff }

/* ================== Section as Card ================== */
.menu-section{ margin:18px 0 }
.section-card{
  background:#fafbff; border:1px solid var(--border); border-radius:20px; box-shadow:var(--shadow); overflow:hidden;
  padding:20px;
}
.section-card .grid{ padding-inline:18px; padding-block:18px }
.section-head{ margin-bottom:8px; display:flex; justify-content:center; align-items:center; padding:12px 0 18px }
.section-title{
  margin:0; text-align:center; font-weight:900; font-size:1.35rem; position:relative; display:inline-block;
}
.section-title::after{
  content:""; display:block; width:72px; height:3px; background:var(--primary); border-radius:999px; margin:8px auto 0;
}
@media (max-width:700px){
  #menu.container{ padding-inline:0 }
  .section-card{ padding:.3em; border-radius:0 }
  .section-card .grid{ padding-inline:0 }
}

/* ================== Footer (داكن مصقول) ================== */
.site-footer{ background:var(--footer-bg); color:var(--footer-text); padding:48px 0 0 }
.site-footer, .site-footer *{ line-height:var(--foot-lh) }
.site-footer a{ color:inherit; text-decoration:none }
.site-footer a:hover{ color:#fff; text-decoration:underline; text-underline-offset:3px }
.footer-grid{
  display:grid; grid-template-columns:1.15fr 1fr 1.15fr; gap:36px; align-items:start;
}
.footer-grid > .foot-col{ text-align:right }
.foot-title{
  margin:0; font-weight:900; font-size:clamp(1.05rem, 1.3vw, 1.25rem); padding-bottom:12px; position:relative; padding-right:var(--foot-offset);
}
.foot-title::after{
  content:""; position:absolute; bottom:0; right:var(--foot-offset);
  width:64px; height:3px; background:var(--footer-accent); border-radius:999px; opacity:.95;
}
.foot-col > :not(.foot-title){ padding-right: var(--foot-offset) }
.foot-title + *{ margin-top:12px }
.foot-col > * + *{ margin-top:10px }
.foot-desc{ margin:6px 0 0; color:var(--footer-muted) }
.foot-links{ list-style:none; padding:0; margin:0; display:grid; gap:10px }
.foot-links li a{ display:inline-flex; align-items:center; gap:8px; font-weight:800; opacity:.95 }
.foot-links li a:hover{ opacity:1; transform: translateX(-2px) }
.foot-contact{ list-style:none; padding:0; margin:0; display:grid; gap:12px }
.foot-contact li{ display:grid; grid-template-columns:28px 1fr; gap:10px; align-items:center }
.foot-contact i{ width:28px; height:28px; display:grid; place-items:center; border-radius:8px; background:rgba(0,0,0,.18) }
.ltr{ direction:ltr; unicode-bidi:embed }
.footer-copy{ border-top:1px solid var(--footer-border); margin-top:30px; padding:14px 0; color:var(--footer-muted); font-size:.95rem }
.footer-copy .container{ display:flex; justify-content:center }

@media (max-width:1000px){ .footer-grid{ grid-template-columns: 1fr 1fr } }
@media (max-width:640px){
  :root{ --foot-offset:16px }
  .footer-grid{ grid-template-columns:1fr; gap:22px }
  .footer-copy .container{ text-align:center }
}

/* ================== Status buttons (طلبات) ================== */
.status-btn{ border:none; border-radius:10px; padding:6px 10px; font-weight:800; cursor:pointer }
.sbtn-new{ background:#f97316; color:#fff }
.sbtn-received{ background:#3b82f6; color:#fff }
.sbtn-preparing{ background:#10b981; color:#fff }
.sbtn-done{ background:#e5e7eb; color:#111; cursor:default }
.btn-danger{ background:#ef4444; color:#fff }
.btn-danger:hover{ background:#dc2626 }
.badge-pill{ display:inline-block; background:#ef4444; color:#fff; border-radius:999px; padding:2px 8px; font-size:.75rem; font-weight:800 }

/* ================== Utilities ================== */
::selection{ background:var(--primary); color:#fff }
*{ scrollbar-width:thin; scrollbar-color:#cfcfcf transparent }
*::-webkit-scrollbar{ width:10px; height:10px }
*::-webkit-scrollbar-track{ background:transparent }
*::-webkit-scrollbar-thumb{ background:#d6d6d6; border-radius:999px }
*::-webkit-scrollbar-thumb:hover{ background:#c7c7c7 }
.en-num{ direction:ltr; unicode-bidi:isolate }
.price, .qty, .icon-badge, .badge, input[type="number"]{ font-variant-numeric: tabular-nums }
iframe, embed, object{ max-width:100%; display:block }
.r-grid{ --min:260px; --gap:var(--g); display:grid; gap:var(--gap); grid-template-columns:repeat(auto-fit, minmax(var(--min), 1fr)) }
.row{ display:flex; flex-wrap:wrap; gap:var(--g) }
.row.center{ align-items:center } .row.between{ justify-content:space-between }
.r-scroll-x{ overflow-x:auto; -webkit-overflow-scrolling:touch }
.r-scroll-x > table{ min-width:640px; border-collapse:collapse; width:100% }
.resp-video{ width:100%; aspect-ratio:16/9; background:#000 }
.resp-video > iframe{ width:100%; height:100%; border:0 }
pre, code{ max-width:100%; overflow:auto }
.long-text{ overflow-wrap:anywhere; word-break:break-word }

/* ================== Responsive Fixes ================== */
@media (max-width:700px){ .table{ display:block; overflow-x:auto; -webkit-overflow-scrolling:touch; white-space:nowrap } }
@media (max-width:640px){
  .container{ width:min(100% - 20px, var(--page-max)) }
  .navbar .row{ flex-wrap:wrap; gap:10px }
  .nav-links{ display:none }
  .brand{ font-size: clamp(1.05rem, 4.4vw, 1.25rem) }
  .btn{ padding: clamp(8px, 2.3vw, 10px) clamp(12px, 3.2vw, 16px) }
  .icon-btn{ width: clamp(44px, 9vw, 54px); height: clamp(44px, 9vw, 54px) }
  .icon-badge{ min-width: clamp(18px, 5vw, 24px); font-size: clamp(.68rem, 2.7vw, .85rem) }
}

/* ===== Keyframes ===== */
@keyframes slideInFromRight{ from{ transform:translateX(100%); opacity:0 } to{ transform:translateX(0); opacity:1 } }
@keyframes slideOutToRight{ from{ transform:translateX(0); opacity:1 } to{ transform:translateX(100%); opacity:0 } }
@keyframes slideInFromLeft{ from{ transform:translateX(-100%); opacity:0 } to{ transform:translateX(0); opacity:1 } }
@keyframes slideOutToLeft{ from{ transform:translateX(0); opacity:1 } to{ transform:translateX(-100%); opacity:0 } }
@keyframes pulse{ 0%,100%{ transform:translateY(0) scale(1); box-shadow:0 0 0 0 rgba(214,72,72,0) } 50%{ transform:translateY(-1px) scale(1.05); box-shadow:0 0 0 6px rgba(214,72,72,.12) } }
@keyframes shimmer{ 0%{ transform:translateX(-100%) } 100%{ transform:translateX(100%) } }
@keyframes spin{ to{ transform:rotate(360deg) } }

/* ===== Motion safety ===== */
@media (prefers-reduced-motion:reduce){
  *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; scroll-behavior:auto !important }
}
