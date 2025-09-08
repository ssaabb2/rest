/* ================== Global Styles ================== */
/* === Polish for Middle Theme === */
/* === Fix Pack 2025-08-19 ===
   - رفع z-index للـ .drawer إلى 1000
   - إضافة .side-mask ثابتة للقوائم الجانبية
   - توحيد سلوك الشريط الجانبي في الموبايل (off-canvas) وإزالة التعارض عند ≤640px
===================================================== */

/* استيراد خط Tajawal لكل الموقع */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

:root{
  /* أحمر العلامة (هادئ واحترافي) */
  --primary:#C33A41;
  --primary-700:#A33137;

  /* قاعدة محايدة دافئة */
  --bg:#F6F3EE;     /* خلفية الصفحة */
  --card:#FFFFFF;   /* بطاقات/أسطح لتبرز الصور */
  --border:#efece6; /* حدود دافئة ناعمة */

  --text:#1F2937;   /* نص أساسي */
  --muted:#667085;  /* نص ثانوي */

  /* اختياري كلون ثانوي خفيف للعناوين الفرعية/الشارات */
  --secondary:#2B7A78;

  /* لون النجوم */
  --star:#F5A524;

  --ring:rgba(195,58,65,.18);
  --shadow:0 12px 28px rgba(17,24,39,.06);
*{box-sizing:border-box}
html{
  direction:rtl;
  /* تعميم خط Tajawal */
  font-family:"Tajawal","Noto Sans Arabic","Noto Kufi Arabic",
              system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
}
body{
  margin:0;
  font-family:inherit; /* توريث Tajawal من html */
  background:var(--bg);
  color:var(--text);
}
body,button,input,select,textarea{ font-family:inherit }

/* Helpers */
.container{max-width:1200px;margin:0 auto;padding:0 16px}
.grid{display:grid;gap:24px}
.grid-3{grid-template-columns:repeat(3, minmax(0,1fr))}
@media (max-width:1000px){.grid-3{grid-template-columns:repeat(2, minmax(0,1fr))}}
@media (max-width:700px){
  .grid-3{grid-template-columns:repeat(2, minmax(0,1fr)); gap:14px;}
  .card{ min-width:0; } /* يمنع تمدد الكارد خارج العمود */
}

/* تحسين المسافات حول الكروت على الهاتف */
@media (max-width:700px){
  .grid-3{ padding-inline:42px; }
  .card{ margin:0; }
}

.card{
  background:var(--card);
  border-radius:18px;
  box-shadow:var(--shadow);
  overflow:hidden;
  border:1px solid #f2f2f2;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card:hover{
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(0,0,0,.08);
  border-color:#eee;
}

.btn{
  border:none;
  border-radius:999px;
  padding:10px 16px;
  font-weight:600;
  cursor:pointer;
  transition:.2s;
  box-shadow: 0 6px 12px rgba(0,0,0,.06)
}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn:hover{ transform: translateY(-1px) }
.btn:active{ transform: translateY(0) }

.btn-primary{background:var(--primary);color:#fff; box-shadow: 0 10px 18px rgba(214,72,72,.18) }
.btn-primary:hover{background:var(--primary-700); box-shadow: 0 14px 26px rgba(214,72,72,.28) }
.btn-ghost{background:#fff;border:1px solid #eee;color:var(--text)}
.btn-ghost:hover{ background:#fafafa; border-color:#e5e7eb }
.btn-olive{background:var(--olive);color:#fff; box-shadow: 0 10px 18px rgba(94,122,78,.18) }
.btn-olive:hover{ box-shadow: 0 14px 26px rgba(94,122,78,.26) }

/* حالة تحميل للزر */
.btn.is-loading{
  position: relative; pointer-events: none; color:transparent;
}
.btn.is-loading::after{
  content:""; position:absolute; inset:0; margin:auto; width:18px; height:18px;
  border:3px solid currentColor; border-right-color: transparent; border-radius:50%;
  animation: spin .8s linear infinite;
}

.badge{
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 10px;border-radius:999px;font-size:.78rem;font-weight:700;
  box-shadow: 0 6px 12px rgba(0,0,0,.05)
}
.badge-olive{background:var(--beige);color:var(--olive)}
.badge-danger{background:#fee2e2;color:#b91c1c}
.badge-muted{background:#f3f4f6;color:#374151}
@media (max-width:560px){
  .app-modal{ width:96vw; border-radius:12px }
  .app-modal .body{ max-height: calc(100dvh - 140px) }
}

/* ================== Navbar ================== */
.navbar{
  position:sticky;top:0;z-index:30;
  background: rgba(255,255,255,.75);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0,0,0,.06);
}
/* ===== شريط الأصناف تحت الـ App Bar ===== */
.cats-bar{
  background:#fff;
  border-bottom:1px solid #eee;
  position:relative; /* اجعله sticky إذا رغبت */
  z-index:29;
}
/* اجعله ثابتاً أسفل النافبار عند التمرير بإضافة .sticky (اختياري) */
.cats-bar.sticky{ position:sticky; top:56px; }

/* حاوية أفقية قابلة للسحب */
.h-scroll{
  display:flex; align-items:center; gap:10px;
  overflow-x:auto; padding:10px 0 12px;
  scroll-snap-type:x proximity;
  -webkit-overflow-scrolling: touch;
  /* تلاشي خفيف على الأطراف */
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%);
}
/* إخفاء شريط التمرير بشكل لطيف */
.h-scroll::-webkit-scrollbar{ height:8px }
.h-scroll::-webkit-scrollbar-thumb{ background:#e5e7eb; border-radius:999px }

/* كبسولات التصنيفات الموجودة لديك مسبقاً */
.h-scroll .pill{ flex:0 0 auto; scroll-snap-align:start }

.navbar.is-scrolled{ box-shadow: 0 8px 24px rgba(0,0,0,.06) }
.navbar .row{display:grid;grid-template-columns:1fr auto 1fr;align-items:center}

.brand{font-size:1.4rem;font-weight:900;color:var(--primary)}
.nav-links{display:flex;gap:22px;align-items:center;justify-content:center}
.nav-links a{color:#374151;text-decoration:none;font-weight:600;position:relative;padding-bottom:10px}
.nav-links a.active::after{
  content:"";position:absolute;right:0;left:0;bottom:0;height:3px;
  background:var(--primary);border-radius:6px;
}
.nav-actions{display:flex;align-items:center;gap:12px}
.nav-actions .admin-link{
  display:inline-flex;align-items:center;gap:8px;font-weight:700;
  text-decoration:none;color:#374151;border:1px solid #eee;border-radius:999px;padding:8px 12px;background:#fff;
}

/* بحث صغير في النافبار */
.nav-left{ display:flex; align-items:center; gap:10px }
.nav-search { display:flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
.nav-search input { border:none; outline:none; background:transparent; width:200px; font-family:inherit; }
@media (max-width: 640px){ .nav-search input{ width:140px } }

.icon-btn{
  position:relative;
  width: clamp(40px, 3.1vw, 50px);
  height: clamp(40px, 3.1vw, 50px);
  border-radius:50%;
  display:grid;place-items:center;border:1px solid #eee;background:#fff;cursor:pointer;
  transition: background-color .2s ease, border-color .2s ease, color .2s ease,
              box-shadow .25s ease, transform .18s ease, opacity .2s ease;
}
.icon-btn:hover{ transform: translateY(-1px) }
.icon-btn:active{ transform: translateY(0) }
.icon-btn svg{width: clamp(18px, 1.6vw, 24px);height: clamp(18px, 1.6vw, 24px)}
.icon-badge{
  position:absolute;top:-6px;left:-6px;background:var(--primary);color:#fff;
  font-size: clamp(.65rem, .85vw, .8rem);
  border-radius:999px;padding:2px 7px;font-weight:700;min-width: clamp(18px, 1.5vw, 22px);text-align:center;
  animation: pulse 1.8s ease-in-out infinite;
}

/* ================== Hero ================== */
.hero{
  background: radial-gradient(1200px 300px at 70% -50%, #fce2e2 20%, transparent 60%), 
              linear-gradient(180deg, #dd5b5b, #c53f3f);
  color:#fff;
  padding:60px 0 36px 0;
  margin-bottom:18px;
}
.hero h1{font-size:3rem;margin:0 0 12px 0}
.hero p{opacity:.95;margin:0}
.hero-controls{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:18px}
.hero-controls .search{flex:1 1 320px;max-width:520px}
.hero-controls #catPills{flex:3 1 520px}
  .hero-landing{position:relative;min-height:clamp(420px,70vh,780px);display:flex;align-items:center;color:#fff;overflow:hidden}
    .hero-landing .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.02)}
    .hero-landing .hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.35))}
    .hero-landing .hero-content{position:relative;text-align:center;max-width:900px;margin:0 auto;padding:0 16px}
    .hero-landing h1{font-size:clamp(2rem,5vw,3.4rem);margin:0 0 12px;font-weight:900}
    .hero-landing p{font-size:clamp(1rem,2.2vw,1.15rem);opacity:.96;margin:0 auto}
    .hero-actions{margin-top:18px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .btn-white{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.38)}
    .btn-white:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.6)}
    /* إزالة التسطير عن أزرار الهيرو فقط */
.hero-actions a,
.hero-actions a:link,
.hero-actions a:visited,
.hero-actions a:hover,
.hero-actions a:active{
  text-decoration: none !important;
  border-bottom: none !important; /* لو كان عندك ستايل عام يضيف خط سفلي كرابط */
}
/* ================== Filter Pills ================== */
.pills{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 26px}
.pill{
  background:#fff;border:1px solid #eee;color:#374151;
  border-radius:999px;padding:10px 16px;cursor:pointer;font-weight:700;box-shadow:var(--shadow);
  display:inline-flex;align-items:center;gap:10px;
  transition: background-color .2s ease, border-color .2s ease, color .2s ease,
              box-shadow .25s ease, transform .18s ease, opacity .2s ease;
}
.pill .ico{opacity:.8;font-size:1rem}
.pill.active{background:var(--primary);color:#fff;border-color:transparent; box-shadow: 0 10px 22px rgba(214,72,72,.22) }
.pill:hover{ transform: translateY(-1px); box-shadow: 0 10px 18px rgba(0,0,0,.08) }
.pill:active{ transform: translateY(0) }

/* ================== Search (عام) ================== */
.search{ position:relative; display:flex; align-items:center }
.search input{
  width:100%;padding:14px 16px;border-radius:14px;border:1px solid #eee;
  outline:none;box-shadow: var(--shadow);
}
.search input:focus{ border-color: var(--primary); box-shadow: 0 0 0 4px var(--ring) }
.search svg{position:absolute;left:12px;opacity:.6}

/* شريط بحث موسّع */
.search-panel{
  position: sticky; top: 0; z-index: 45;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
  max-height: 0; overflow: hidden; opacity: 0;
  transition: max-height .25s ease, opacity .2s ease;
}
.search-panel.open{ max-height: 120px; opacity: 1; }
.search-panel .search-panel-row{ display:flex; align-items:center; gap:12px; padding:12px 0; }
.search-lg{
  display:flex; align-items:center; gap:10px;
  padding:12px 16px; border:2px solid #e5e7eb;
  border-radius:999px; background:#fff; flex:1;
  box-shadow: inset 0 2px 12px rgba(0,0,0,.04);
}
.search-lg input{
  border:none; outline:none; background:transparent; width:100%; font-size:1rem; font-family:inherit;
}
.round{ width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; font-size:20px }
.round.danger{ background:#ef4444; color:#fff; box-shadow: 0 6px 16px rgba(239,68,68,.35) }

/* ================== Menu Cards ================== */
/* صورة بابعاد ثابتة بصرياً لكل البطاقات */
.item-img-wrap{ position:relative; aspect-ratio: 16/10; overflow:hidden }
.item-img{ width:100%; height:100%; object-fit:cover; transition: transform .6s ease }
.item-img-wrap:hover .item-img{ transform: scale(1.04) }

/* صف السعر + زر السلة بأسفل الكارد */
.item-cta{
  margin-top:auto;           /* يثبت الصف بأسفل جسم الكارد */
  display:flex;
  align-items:center;
  justify-content:space-between; /* في RTL: السعر يطلع يمين، الزر يسار */
  gap:10px;
}

/* زر مدمج أصغر */
.btn-compact{
  padding:8px 12px;
  border-radius:10px;
  font-weight:800;
  min-height:auto; /* يلغي الحد الأدنى الافتراضي */
  box-shadow: 0 6px 12px rgba(0,0,0,.06);
}

/* ضبط مظهر السعر داخل الصف */
.item-cta .price{ font-size:1rem; font-weight:900 }

/* جسم البطاقة يصبح عمودياً ليَثبُت الزر أسفلها */
.item-body{ padding:16px 16px 14px; display:flex; flex-direction:column; gap:10px; min-height: 210px }
.item-title{display:flex;justify-content:space-between;align-items:center;gap:12px}
.item-title h3{
  margin:0;font-size:1.1rem; font-weight:900; line-height:1.3;
  display:-webkit-box; -webkit-line-clamp:1; line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
}
.price{color:var(--primary);font-weight:900;font-size:1.1rem; white-space:nowrap}
.item-desc{
  color:var(--muted);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-clamp:2; overflow:hidden;
  min-height:2.8em; margin:4px 0 6px;
}

/* التقييم موحّد الحجم */
.stars{display:flex;gap:4px;align-items:center;color:#f59e0b}
.stars svg, .stars img, .star{ width:18px; height:18px }
.star{cursor:pointer;opacity:.8; transition: transform .15s ease, opacity .15s ease }
.star:hover{ transform:scale(1.1); opacity:1 }

/* زر السلة يلتصق بأسفل البطاقة */
.item-actions{ margin-top:auto }
.item-actions .btn{ width:100%; border-radius:12px; padding:10px 14px; font-weight:800 }
@media (max-width:700px){
  /* صورة أكبر وتناسب عرض الكارد (شكل مربع لطابع بصري حديث) */
  .item-img-wrap{ aspect-ratio: 1 / 1; }

  /* اجعل جسم الكارت أقل ارتفاعًا على الهاتف */
  .item-body{ min-height: unset; }

  /* السطر الأول: اسم + سعر */
  .item-title h3{ font-size: 1rem; }
  .price{ font-size: 1rem; }

  /* السطر الثاني: وصف أصغر وسطرين كحد أقصى */
  .item-desc{
    font-size: .90rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  /* السطر الثالث: نجوم أصغر + شارة المتوسط أصغر */
  .stars svg, .stars img, .star{ width:16px; height:16px }
  .avg-badge{ font-size:.78rem; padding:2px 6px; }
}

/* بادج على الصورة (مثل: طازج) */
.img-badge{
  position:absolute;top:12px;right:12px;
  background:#e9f7e9;color:#187a26;border-radius:999px;padding:6px 10px;font-weight:800;font-size:.8rem;
  box-shadow:var(--shadow)
}

/* ================== Drawer (يمين للسلة، يسار للقائمة) ================== */
.drawer{
  position:fixed;inset:0 0 0 auto;width: min(380px, 92vw);background:#fff;z-index:1000; /* رفعت من 50 إلى 1000 */
  transform:translateX(100%);border-left:1px solid #eee;box-shadow: -8px 0 16px rgba(0,0,0,.06);
  display:flex;flex-direction:column;
}
.drawer .head{
  padding:14px 16px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center
}
.drawer .body{padding:16px;flex:1;overflow:auto;display:flex;flex-direction:column;gap:12px}

.drawer.open{ transform:translateX(0); animation: slideInFromRight .25s ease-out both }
.drawer.closing{ animation: slideOutToRight .22s ease-in both }

/* نسخة اليسار */
.drawer.start{
  inset: 0 auto 0 0;             /* يسار */
  transform: translateX(-100%);
  border-right: 1px solid #eee; border-left:none;
  box-shadow: 8px 0 16px rgba(0,0,0,.06);
}
.drawer.start.open{ transform:translateX(0); animation: slideInFromLeft .25s ease-out both }
.drawer.start.closing{ animation: slideOutToLeft .22s ease-in both }
/* Force-hide notifications drawer unless open */
#notifDrawer{
  position: fixed; inset: 0 0 0 auto;
  width: min(420px, 92vw);
  background:#fff; border-left:1px solid #eee; box-shadow:-8px 0 16px rgba(0,0,0,.06);
  transform: translateX(100%);
  opacity:0; visibility:hidden; pointer-events:none;
  z-index:1000;
  transition: transform .25s ease, opacity .2s ease;
}
#notifDrawer.open{
  transform: translateX(0);
  opacity:1; visibility:visible; pointer-events:auto;
}

/* قناع عام يُستخدم مع الدرجات */
.side-mask{
  position:fixed; inset:0; background:rgba(0,0,0,.28);
  display:none; z-index:999;
}
.side-mask.open{ display:block; pointer-events:auto }

/* عناصر داخل الدرج الجانبي */
.side-nav{ display:flex; flex-direction:column; gap:6px }
.side-nav a{
  display:block; padding:10px 12px; border-radius:12px;
  color:#374151; text-decoration:none; font-weight:800;
}
.side-nav a:hover, .side-nav a.active{ background:var(--primary); color:#fff }

.side-brand{
  display:flex; flex-direction:column; align-items:center; gap:8px;
  padding:8px 0 12px;
}
.side-brand img{
  width:84px; height:84px; border-radius:50%;
  object-fit:cover; border:2px solid #eee;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
}
.side-brand .brand-name{ font-weight:800; font-size:1.05rem; cursor:pointer }
#frontSidebar .side-brand{ text-decoration: none; color: inherit; cursor: pointer; }
#frontSidebar .side-brand:active{ transform: translateY(1px); }

/* سوشيال ميديا داخل القائمة */
.drawer.start .social{
  margin-top:14px; display:flex; gap:10px; justify-content:center;
}
.drawer.start .social a{
  width:36px; height:36px; display:flex; align-items:center; justify-content:center;
  border-radius:10px; border:1px solid #e5e7eb; background:#fff;
  transition:.15s ease; text-decoration:none;
}
.drawer.start .social a:hover{
  transform: translateY(-2px);
  border-color: rgba(225,29,72,.5);
  box-shadow: 0 8px 18px rgba(225,29,72,.16);
}
.social a.wa svg{ color:#25D366 }
.social a.ig svg{ color:#E1306C }
.social a.tg svg{ color:#229ED9 }
.social a.tt svg{ color:#000 }

/* تنسيق احترافي لأيقونات السوشيال ميديا في القائمة الجانبية */
#frontSidebar .social {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

#frontSidebar .social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #374151;
  font-size: 1.6rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.18s;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  text-decoration: none;
  border: none;
}

#frontSidebar .social a:hover {
  background: var(--primary, #C33A41);
  color: #fff;
  box-shadow: 0 4px 16px rgba(195,58,65,.18);
  transform: translateY(-2px) scale(1.08);
}

/* ألوان مخصصة لكل أيقونة (اختياري) */
#frontSidebar .social a.wa svg { color: #25D366; }
#frontSidebar .social a.ig svg { color: #E1306C; }
#frontSidebar .social a.tg svg { color: #229ED9; }
#frontSidebar .social a.tt svg { color: #111; }

/* ================== Cart Items ================== */
.cart-item{display:flex;gap:10px;align-items:center;border:1px solid #eee;border-radius:12px;padding:8px 10px}
.cart-item img{width:64px;height:64px;object-fit:cover;border-radius:10px}
.qty{display:flex;align-items:center;gap:8px}
.qty button{width:28px;height:28px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer}
.totals{padding:16px;border-top:1px solid #eee}

/* ================== Admin (basic) ================== */
.admin-layout{display:grid;grid-template-columns:260px 1fr;min-height:100vh}
.sidebar{background:#fff;border-left:1px solid #eee;padding:14px 10px}
.sidebar h3{margin:8px 0 16px;color:#111}
.side-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;color:#374151;text-decoration:none;font-weight:700;}
.side-link:hover{background:#f7f7f7}
.main{padding:18px}
.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:20px}
@media (max-width:1100px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
.kpi{padding:16px;border:1px solid #eee;border-radius:16px;background:#fff;box-shadow:var(--shadow); transition: transform .18s ease, box-shadow .22s ease }
.kpi:hover{ transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0,0,0,.08) }
.section{margin:18px 0}
.table{width:100%;border-collapse:collapse}
.table th,.table td{padding:10px;border-bottom:1px solid #eee;text-align:right}
.form{display:grid;gap:10px}
.input, select, textarea{ padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;outline:none }
.input:focus, select:focus, textarea:focus{ border-color: var(--primary); box-shadow: 0 0 0 4px var(--ring) }
.notice{padding:12px;border-radius:12px;background:#fff3f3;border:1px solid #fde1e1;color:#a11f1f}
hr.sep{border:none;height:1px;background:#f0f0f0;margin:16px 0}
.small{font-size:.85rem;color:var(--muted)}

/* === Multipage add-ons === */
@media (min-width: 1024px){
  .layout { align-items: flex-start; }
  .sidebar{ position: sticky; top: 12px; max-height: calc(100vh - 24px); overflow:auto }
}
.sidebar .side-link.active{ background: var(--primary); color:#fff; border-radius:10px }

/* ====== شريط البحث الموسّع ترتيب داخلي ====== */
.search-panel .search-panel-row { display:flex }
.search-panel .search-lg { order: 1; flex: 1 }
#searchClose { order: 2 }

/* ===== KDS tweaks ===== */
.kds-head{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:12px}
.kds-tabs{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.kds-tab{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;border:1px solid #eee;background:#fff;cursor:pointer;font-weight:800}
.kds-tab.active{background:var(--primary);color:#fff;border-color:transparent}
.kds-tab .dot{width:10px;height:10px;border-radius:50%}
.dot-new{background:#f97316}
.dot-received{background:#3b82f6}
.dot-preparing{background:#10b981}
.dot-delivered{background:#9ca3af}
.kds-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.kds-search{position:relative}
.kds-search input{padding-inline-start:14px}
.kds-grid{display:grid;gap:16px;grid-template-columns:repeat(3, minmax(0,1fr))}
@media (max-width:1100px){.kds-grid{grid-template-columns:repeat(2, minmax(0,1fr))}}
@media (max-width:720px){.kds-grid{grid-template-columns:1fr}}
.kds-card{position:relative;border-radius:16px;border:1px solid #eee;background:#111827;color:#e5e7eb}
.kds-card .hdr{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.06)}
.kds-card .hdr .left{display:flex;gap:8px;align-items:center}
.kds-card .hdr .time{font-weight:800;opacity:.9}
.kds-card .hdr .chip{background:#0f172a;color:#cbd5e1;border:1px solid rgba(255,255,255,.08);padding:4px 8px;border-radius:999px;font-size:.78rem;font-weight:800}
.kds-card .body{padding:12px}
.kds-card .row{display:flex;justify-content:space-between;gap:8px;align-items:center}
.kds-card .title{font-size:1.05rem;font-weight:900}
.kds-note{margin-top:10px;padding:10px;border-radius:10px;background:#0b1220;border:1px dashed rgba(255,255,255,.12);font-size:.9rem}
.kds-items{margin-top:8px;border-top:1px solid rgba(255,255,255,.08);padding-top:8px}
.kds-items .it{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px dashed rgba(255,255,255,.06)}
.kds-items .it:last-child{border-bottom:none}
.kds-foot{display:grid;grid-template-columns:repeat(4, minmax(0,1fr));gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.06);background:#0b1220}
.kds-foot .btn{border-radius:12px;font-weight:800}
.kds-meter{height:6px;background:#0b1220;margin:8px 12px;border-radius:999px;overflow:hidden}
.kds-meter > span{display:block;height:100%}
.kds-new{box-shadow:0 0 0 2px rgba(249,115,22,.25) inset}
.kds-received{box-shadow:0 0 0 2px rgba(59,130,246,.25) inset}
.kds-preparing{box-shadow:0 0 0 2px rgba(16,185,129,.25) inset}
.kds-delivered{opacity:.7;box-shadow:0 0 0 2px rgba(156,163,175,.25) inset}
.kds-muted{color:#94a3b8}
/* modal (reuse drawer styling) */
.modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;place-items:center;z-index:1200}.modal.open{display:grid}
.modal .card{width:min(680px,95vw)}
.printable{font-family: 'Tajawal', system-ui, sans-serif}

/* ================== Interactive polish & micro-animations ================== */
::selection{background:var(--primary);color:#fff}
*{-webkit-tap-highlight-color: transparent}
a, button, .btn, .pill, .card, .icon-btn, .input, select, textarea {
  transition: background-color .2s ease, border-color .2s ease, color .2s ease,
              box-shadow .25s ease, transform .18s ease, opacity .2s ease;
}

/* ===== Keyframes (اتجاهين للدرج) ===== */
@keyframes slideInFromRight{ from{transform:translateX(100%); opacity:0} to{transform:translateX(0); opacity:1} }
@keyframes slideOutToRight{ from{transform:translateX(0); opacity:1} to{transform:translateX(100%); opacity:0} }
@keyframes slideInFromLeft{ from{transform:translateX(-100%); opacity:0} to{transform:translateX(0); opacity:1} }
@keyframes slideOutToLeft{ from{transform:translateX(0); opacity:1} to{transform:translateX(-100%); opacity:0} }

@keyframes pulse{
  0%,100%{ transform: translateY(0) scale(1); box-shadow: 0 0 0 0 rgba(214,72,72,.0) }
  50%{ transform: translateY(-1px) scale(1.05); box-shadow: 0 0 0 6px rgba(214,72,72,.12) }
}
@keyframes shimmer{ 0%{ transform: translateX(-100%) } 100%{ transform: translateX(100%) } }
@keyframes spin{ to{ transform: rotate(360deg) } }

/* ===== Skeleton loader ===== */
.skeleton{
  position: relative; overflow: hidden; background: #f3f4f6; border-radius: 8px; color: transparent;
}
.skeleton::after{
  content:""; position:absolute; inset:0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
  transform: translateX(-100%);
  animation: shimmer 1.4s infinite;
}

/* ===== Scrollbar ===== */
*{ scrollbar-width: thin; scrollbar-color: #cfcfcf transparent }
*::-webkit-scrollbar{ width:10px; height:10px }
*::-webkit-scrollbar-track{ background: transparent }
*::-webkit-scrollbar-thumb{ background:#d6d6d6; border-radius:999px }
*::-webkit-scrollbar-thumb:hover{ background:#c7c7c7 }

/* ===== Motion safety ===== */
@media (prefers-reduced-motion: reduce){
  *{ animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; scroll-behavior: auto !important }
}

/* ================== Responsive Fixes ================== */
@media (max-width: 700px){
  .table{ display:block; overflow-x:auto; -webkit-overflow-scrolling: touch; white-space: nowrap }
}
@media (max-width: 640px){
  .container{ padding-inline: 12px }
  .navbar .row{ flex-wrap: wrap; gap: 10px }
  .nav-links{ display:none }
  .brand{ font-size: clamp(1.05rem, 4.4vw, 1.25rem) }
  .btn{ padding: clamp(8px, 2.3vw, 10px) clamp(12px, 3.2vw, 16px) }
  .icon-btn{
    width: clamp(44px, 9vw, 54px);
    height: clamp(44px, 9vw, 54px);
  }
  .icon-btn svg{
    width: clamp(20px, 5.5vw, 26px);
    height: clamp(20px, 5.5vw, 26px);
  }
  .icon-badge{
    min-width: clamp(18px, 5vw, 24px);
    font-size: clamp(.68rem, 2.7vw, .85rem);
  }
  /* كان هنا سبب التعارض: تم حذف إدخال .sidebar داخل التدفق على الموبايل */
  .admin-layout{ grid-template-columns: 1fr }
}

/* ===== Status buttons for orders workflow ===== */
.status-btn{ border:none;border-radius:10px;padding:6px 10px;font-weight:800;cursor:pointer }
.sbtn-new{background:#f97316;color:#fff}
.sbtn-received{background:#3b82f6;color:#fff}
.sbtn-preparing{background:#10b981;color:#fff}
.sbtn-done{background:#e5e7eb;color:#111;cursor:default}
.btn-danger{background:#ef4444;color:#fff}
.btn-danger:hover{background:#dc2626}
.badge-pill{display:inline-block;background:#ef4444;color:#fff;border-radius:999px;padding:2px 8px;font-size:.75rem;font-weight:800}
#adminLink { display: none !important; }


body{ background:var(--bg); color:var(--text); line-height:1.7 }

.navbar{
  background:rgba(255,255,255,.9);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--border);
}

.cats-bar{ background:var(--card); border-bottom:1px solid var(--border) }

.card{ background:var(--card); border:1px solid var(--border); box-shadow:var(--shadow) }

.btn-primary{
  background:var(--primary); color:#fff;
  box-shadow:0 10px 18px rgba(195,58,65,.16);
}
.btn-primary:hover{ background:var(--primary-700) }
.price{ color:var(--primary); font-weight:700 }

.pill{ background:#fff; border:1px solid var(--border); color:#374151 }
.pill.active{ background:var(--primary); color:#fff; border-color:transparent }

.stars .icon{ color:var(--star) }

input,textarea,select{ border:1px solid var(--border); background:#fff }
input:focus,textarea:focus,select:focus{
  border-color:var(--primary);
  box-shadow:0 0 0 4px var(--ring);
  outline:none;
}

/* ===== Floating Cart FAB ===== */
/* مفعّل على الهاتف والكمبيوتر + حالة إخفاء عند فتح السلة */
.cart-fab{
  position: fixed;
  inset-inline-end: clamp(14px, 2vw, 22px);   /* يدعم RTL */
  bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
  width: 56px; height: 56px; border-radius: 9999px;
  background: var(--primary); color:#fff;
  border: none; cursor: pointer;
  display: grid; place-items: center;
  box-shadow: 0 12px 24px rgba(0,0,0,.18);
  z-index: 3000;  /* أعلى من المحتوى */
  transition: transform .15s ease, background-color .15s ease, opacity .15s ease;
}
.cart-fab:hover{ background: var(--primary-700); transform: translateY(-1px) }
.cart-fab:active{ transform: translateY(0) }
.cart-fab.fab-hide{ opacity:0; transform:scale(.92); pointer-events:none } /* تُستخدم عند فتح السلة */

.cart-fab .badge{
  position: absolute;
  top: -6px; inset-inline-end: -6px;
  min-width: 20px; height: 20px; padding: 0 6px;
  border-radius: 999px; font-size: 12px; font-weight: 700;
  background: #111827; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,.2);
}

/* لم يعد هناك إخفاء على الديسكتوب */
/* (أُزيلت الميديا كويري التي كانت: @media (min-width:1024px){ .cart-fab{ display:none } } ) */
/* === تحسين اللمس والتركيز === */
:focus-visible{ outline:3px solid var(--primary); outline-offset:2px }
.qty button{ width:36px; height:36px; font-size:18px } /* تكبير أزرار + و - */
.icon-btn, .btn{ min-height:44px } /* الحد الأدنى لسهولة اللمس */

/* === شريط التصنيفات أجمل === */
.cats-bar{ position:sticky; top:56px; z-index:29 }
.h-scroll{ gap:12px; padding-block:12px }
.pill{ padding:12px 16px; font-size:.95rem }
.pill.active{ box-shadow: 0 10px 22px rgba(195,58,65,.22) }

/* === خلفية غامقة عند فتح السلة (Backdrop) === */
.backdrop{
  position:fixed; inset:0; background:rgba(0,0,0,.28);
  opacity:0; pointer-events:none; z-index:48; transition:opacity .2s ease;
}
.backdrop.open{ opacity:1; pointer-events:auto }

/* === FAB ممتد يعرض المجموع === */
.cart-fab{ display:grid; grid-auto-flow:column; gap:10px; padding-inline:16px; height:56px; width:auto }
.cart-fab__label{ font-weight:800; white-space:nowrap; display:inline }

/* شارة العدّاد أجمل */
.cart-fab .badge{
  top:-8px; inset-inline-end:-8px; min-width:22px; height:22px; font-size:12px;
}

/* === توست (تمت الإضافة) === */
.toast{
  position:fixed; inset-inline-start:50%; bottom:22px;
  transform:translate(-50%, 10px); background:#111827; color:#fff;
  padding:10px 14px; border-radius:999px; font-weight:800;
  opacity:0; pointer-events:none; z-index:4000; transition:.2s ease;
}
.toast.open{ opacity:1; transform:translate(-50%, 0) }

/* عند فتح السلة: ممكن تخفي الهيدر/الشريط (اختياري) */
body.cart-open .navbar, body.cart-open .cats-bar{ opacity:.0; pointer-events:none }
/* ===== Modal polish (app modal) ===== */
.modal{ position:fixed; inset:0; background:rgba(0,0,0,.45); display:none; place-items:center; z-index:1200 }
.modal.open{ display:grid }
.modal .modal-dialog{
  width:min(520px, 92vw);
  background:#fff;
  border:1px solid var(--border);
  border-radius:16px;
  box-shadow: var(--shadow);
  overflow:hidden;
}
.modal .modal-head{
  padding:14px 16px;
  display:flex; justify-content:space-between; align-items:center;
  border-bottom:1px solid var(--border);
}
.modal .modal-body{
  padding:16px;
  max-height:calc(100dvh - 220px);  /* يمنع الطول الزائد على الشاشات الصغيرة */
  overflow:auto;
}
.modal .modal-actions{
  padding:12px 16px;
  border-top:1px solid var(--border);
  display:flex; gap:8px; justify-content:flex-end;
}

/* نموذج إتمام الطلب */
.form-vertical{ display:grid; grid-template-columns:1fr; gap:12px }
.form-row{ display:flex; flex-direction:column; gap:6px }
.label{ font-weight:800; color:#111 }
.req{ color:#ef4444; margin-inline:4px }
.input-md{
  width:100%;
  padding:12px 12px;
  border:1px solid var(--border);
  border-radius:12px;
  background:#fff;
  font-family:inherit;
}
.input-md:focus{ border-color:var(--primary); box-shadow:0 0 0 4px var(--ring); outline:none }
.form-error{ color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; padding:8px 10px; border-radius:10px }



/* === تكبير الـ App Bar (تجاوز/تحسين) === */
:root{
  --appbar-h: 56px;          /* ارتفاع تقريبي للهيدر */
  --appbar-pad: 12px;        /* مسافة داخلية عمودية */
}

/* زوّد الفراغ العمودي للـ App Bar */
.navbar{ padding-block: var(--appbar-pad); }
/* تأكيد حد أدنى للارتفاع */
.navbar .container{ min-height: var(--appbar-h); }

/* كبّر أزرار الأيقونات في الهيدر */
.icon-btn{
  width: clamp(48px, 4vw, 58px);
  height: clamp(48px, 4vw, 58px);
}

/* كبّر اسم المطعم */
.brand{ font-size: clamp(1.6rem, 2.2vw, 1.8rem); }

/* === الشريط الذي تحته مباشرة (شريط التصنيفات) === */
/* كبّر ارتفاعه عبر زيادة الـ padding الأفقي */
.cats-bar .h-scroll{ padding: 6px 0 8px; }

/* لو تستخدم .cats-bar.sticky تحت الهيدر مباشرة خلّيها تلحق ارتفاعه */
.cats-bar.sticky{ top: var(--appbar-h); }
/* ===== Section-as-Card layout ===== */
.menu-section{ margin: 18px 0; }

/* === Moving underline for category ribbon === */
#catRibbon{ position: relative; }           /* حاوية المؤشر */
#catRibbon .cat-underline{
  position: absolute;
  bottom: 4px;                              /* ارتكاز تحت الحبوب */
  height: 3px;
  background: var(--primary);
  border-radius: 999px;
  width: 0;                                 /* تتحدث ديناميكيًا */
  transform: translateX(0);
  transition: transform .24s ease, width .24s ease;
  pointer-events: none;
}

/* === Section-as-Card: خلفية أفتح + مسافات مريحة === */
.section-card{
  /* تدرّج خفيف مريح للعين */
  background:#fafbff;  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* إبعاد كروت الأصناف عن أعلى/أسفل ويمين/يسار داخل الكارد الحاوي */
.section-card .grid{
  padding-block: clamp(12px, 2.2vw, 20px);   /* أعلى/أسفل */
  padding-inline: clamp(12px, 2.2vw, 20px);  /* يمين/يسار */
}

/* تأكيد التباين: تظل كروت الأصناف بيضاء داخل الحاوي */
.section-card > .grid .card{
  background:#fff;
  border:1px solid var(--border);
}

/* مسافة بسيطة تحت عنوان القسم لتهوية أفضل */
.section-head{ margin-bottom: 8px }
/* ===== Half-star rendering + strokes ===== */
.stars{ display:inline-flex; align-items:center; gap:6px; }

.stars .star{ width:20px; height:20px; display:block; transition:transform .15s ease; }
.stars .star:hover{ transform:scale(1.08); }

/* ألوان الأساس والمفعّل وحدودها */
.stars .star .star-base{
  fill: var(--star-muted, #e5e7eb);
  stroke: var(--star-stroke-muted, #9ca3af);
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
}
.stars .star .star-fill{
  fill: var(--star, #F5A524);
  stroke: var(--star-stroke, #b45309);
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
}
/* قفل النجوم بعد التقييم */
.stars.is-rated{ pointer-events: none; opacity: .85; }
.stars.is-rated .star{ filter: grayscale(0.1); }

/* شارة متوسط التقييم (لو ما أضفتها سابقًا) */
.avg-badge{
  font-weight:800; font-size:.85rem; padding:2px 8px; border-radius:999px;
  border:1px solid transparent; line-height:1.4;
}
.avg-badge.rate-good{ color:#16a34a; background:rgba(34,197,94,.12); border-color:rgba(34,197,94,.35); }
.avg-badge.rate-mid{  color:#b45309; background:rgba(245,158,11,.12); border-color:rgba(245,158,11,.35); }
.avg-badge.rate-bad{  color:#b91c1c; background:rgba(239,68,68,.12); border-color:rgba(239,68,68,.35); }

/* ===== Cat Pills: حالة نشطة باللون الأحمر ===== */
#catPills .pill,
#catRibbon .pill{
  transition: background .2s ease, color .2s ease, border-color .2s ease, transform .15s ease;
}

#catPills .pill:hover,
#catRibbon .pill:hover{
  transform: translateY(-1px);
}

#catPills .pill.active,
#catRibbon .pill.active{
  color: #dc2626;                /* Red 600 */
  background: #fee2e2;           /* Red-200 (فاتح) */
  border-color: #fecaca;         /* Red-300 */
}
/* عنوان أقسام المنيو داخل الكارد */
.section-card { padding: 16px; }

.section-card .section-head{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0 18px;
}

.section-card .section-title{
  margin: 0;
  text-align: center;
  font-weight: 900;
  font-size: 1.35rem;
  position: relative;
  display: inline-block; /* حتى يتمركز الخط تحت العنوان فقط */
}

/* خط أحمر تحت العنوان */
.section-card .section-title::after{
  content: "";
  display: block;
  width: 72px;            /* غيّرها (مثلاً 56px أو 90px) حسب ذوقك */
  height: 3px;
  background: var(--primary); /* أحمر الهوية */
  border-radius: 999px;
  margin: 8px auto 0;     /* يتمركز تلقائياً تحت العنوان */
}
/* ===== Mobile-friendly tweaks (Admin + Global) ===== */

/* iOS safe area for sticky navbars */
.navbar{ padding-top: max(8px, env(safe-area-inset-top)) }

/* جرّب تقليل الاهتزاز عند السحب */
html, body{ overscroll-behavior: contain }

/* أزرار ولمسات أكبر على الشاشات الصغيرة */
@media (max-width:960px){
    .btn{ min-height:44px; font-size: clamp(.92rem, 3.6vw, 1rem) }
  .input, select, textarea{ min-height:44px }
}

/* ===== Admin sidebar: turn into off-canvas on mobile ===== */
@media (max-width:960px){
  .admin-layout{ grid-template-columns: 1fr !important; }

  /* الشريط الجانبي يخرج من اليمين (off-canvas) */
  .admin-layout .sidebar{
    position: fixed;
    inset: 0 0 0 auto;               /* يمين */
    width: min(84vw, 320px);
    background: var(--card);
    border-left: 1px solid var(--border, #eee);
    transform: translateX(100%);  
    opacity: 0; visibility: hidden; pointer-events: none;
    z-index: 1000;
    padding: 12px;
    box-shadow: -8px 0 16px rgba(0,0,0,.16);
  }
  .admin-layout .sidebar.open{
    transform: translateX(0);
    opacity: 1; visibility: visible; pointer-events: auto;
  }
}

  /* غطاء خلفي عند فتح القائمة (لأقسام الإدارة) */
  .sidebar-backdrop{
    position: fixed; inset: 0;
    background: rgba(0,0,0,.28);
    z-index: 90; display: none;
  }
  body.sidebar-open .sidebar-backdrop{ display:block }

  /* إظهار زر قائمة الموبايل */
  #adminMenuBtn{ display:inline-flex; align-items:center; }
}

/* على الديسكتوب اخفي زر قائمة الموبايل */
@media (min-width:961px){ #adminMenuBtn{ display:none } }

/* لو كان عندك جداول كبيرة داخل لوحة التحكم: ضمنّا الـ scroll */
@media (max-width:700px){
  .table, .table-soft{ display:block; overflow-x:auto; -webkit-overflow-scrolling:touch; white-space:nowrap }
}

/* إخفاء زر ودرج الإشعارات في كل لوحات الإدارة */
#notifyBtn, #notifDrawer{ display:none !important; }

/* (تكرار root المقصود لبعض الصفحات) */
:root{
  --primary:#C33A41;
  --primary-700:#9B2630;

  /* محايد بسيط عالي التباين */
  --bg:#FAFAFA;
  --surface:#FFFFFF;
  --card:#FFFFFF;

  --border:#EAEAEA;
  --border-strong:#DADADA;

  --text:#111827;
  --muted:#374151;

  --success:#16A34A;
  --warning:#EA580C;
  --info:#0EA5E9;

  /* أكسنت فحمي بسيط */
  --secondary:#111827;
  --olive:#4E6F56;
  --beige:#F5EFE6;

  --star:#F5A524;
  --star-stroke:#b45309;

  --ring:rgba(195,58,65,.22);
}

/* ===== Admin mobile menu button ===== */
#adminMenuBtn{ display:none; }
@media (max-width:960px){
  #adminMenuBtn{ display:inline-flex; align-items:center; }
}
@media (min-width:961px){
  #adminMenuBtn{ display:none }
}
/* إخفاء درج الإشعارات في لوحات الإدارة */
#notifyBtn, #notifDrawer{ display:none !important; }
.social .wa{ display:none; }



:root{ --hours-bg:#2b333e; } /* أو جرّب #0e141f */


/* كارد أوقات العمل (داكن) */
.hours-card{
  background:var(--hours-bg) !important;
  color:#e5e7eb !important;
  border:1px solid rgba(255,255,255,.08) !important;
  box-shadow: 0 18px 38px rgba(0,0,0,.28) !important;

  
}

/* صفوف الجدول */
.hours-list{ display:grid; gap:8px }
.hours-row{
  position:relative;
  display:grid;
  grid-template-columns: 1fr auto 1fr; /* اليوم | الوقت (منتصف) | الحالة */
  align-items:center;
  padding:10px 12px;
  border-radius:12px;
  background:rgba(255,255,255,.02);
  border:1px solid rgba(255,255,255,.06);
}
.hours-row .day{ font-weight:900; text-align:right }
.hours-row .time{ text-align:center; font-weight:900; letter-spacing:.2px }
.hours-row .st{ justify-self:end }

/* إبراز اليوم الحالي بـ "هافر" شفاف */
.hours-row.today::after{
  content:""; position:absolute; inset:0;
  background:rgba(255,255,255,.06);
  border:1px dashed rgba(255,255,255,.16);
  border-radius:12px; pointer-events:none;
}
.hours-row.today:hover::after{ background:rgba(255,255,255,.10) }

/* وسم الحالة كبادج صغير يناسب الخلفية الداكنة */
.badge.open   { background:rgba(16,185,129,.18); color:#bbf7d0; border:1px solid rgba(16,185,129,.35) }
.badge.closed { background:rgba(239,68,68,.18);  color:#fecaca; border:1px solid rgba(239,68,68,.35) }
.badge.neutral{ background:rgba(255,255,255,.08); color:#e5e7eb; border:1px solid rgba(255,255,255,.14) }


/* ===== About (من نحن) ===== */
/* تم تعديل font-size فقط ليكون متناسق مع بقية الموقع */
.about-card h2{ font-size:1.75rem; font-weight:900; margin-bottom:14px } /* كان 2rem */
.about-card p{
  font-size:1.05rem; /* كان 1rem */
  line-height:2.1; color:#374151; margin:0 0 12px;
}
.about-location{ margin-top:10px; text-align:right }
.about-location h3{ margin:14px 0 6px; font-size:1.2rem } /* كان 1.35rem */
.about-address{ font-size:1rem; margin-bottom:12px }      /* كان 1.05rem (تقليل بسيط) */

/* صف أيقونات السوشيال داخل الكارد */
.about-social{
  display:flex; gap:16px; align-items:center; justify-content:flex-start;
}
.about-social a{
  width:56px; height:56px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background: var(--primary); color:#fff; font-size:1.3rem; /* كان 1.55rem */
  text-decoration:none; transition: transform .18s ease, box-shadow .18s ease, opacity .2s ease;
  box-shadow: 0 6px 16px rgba(195,58,65,.25);
}
.about-social a:hover{ transform: translateY(-3px) scale(1.05); box-shadow: 0 10px 22px rgba(195,58,65,.3) }
.about-social a i{ pointer-events:none }

/* (اختياري) لو أردت تلوين الأيقونات نفسها بلون العلامة دائمًا */
.about-social .wa i, .about-social .ig i, .about-social .tw i, .about-social .fb i{ color:#fff; }

/* ===== ضبط للموبايل فقط (اختياري) ===== */
@media (max-width:640px){
  .about-card h2{ font-size:1.5rem; }
  .about-card p{ font-size:1rem; }
  .about-location h3{ font-size:1.1rem; }
  .about-social a{ font-size:1.2rem; }
}
/* تجعل الأرقام واضحة ومتراصة في حالات الأسعار وما شابه */
.price, .qty, .icon-badge, .badge, input[type="number"]{
  font-variant-numeric: tabular-nums;
}

/* لو أردت فرض اتجاه يسار→يمين على سطور محددة تحمل أرقامًا فقط */
.en-num{ direction:ltr; unicode-bidi:isolate; }












/* ===== Footer (Dark, Polished) ===== */
:root{
  /* ألوان قابلة للتعديل */
  --footer-bg: #233746;          /* خلفية داكنة هادئة */
  --footer-text: #e7eef5;        /* نص أساسي */
  --footer-muted: #c9d6e2;       /* نص ثانوي داخل الفوتر */
  --footer-border: rgba(255,255,255,.08);
  --footer-accent: var(--primary, #C33A41); /* خط تحت العنوان */
  --foot-lh: 1.85;

  /* قيمة الإزاحة الموحدة لبدء العنوان والمحتوى تحته من نفس الخط */
  --foot-offset: 125px;
}

.site-footer{
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: 48px 0 0;
}
.site-footer, .site-footer *{ line-height: var(--foot-lh); }
.site-footer a{
  color: inherit; text-decoration: none; transition: .18s ease;
}
.site-footer a:hover{
  color:#fff; text-decoration: underline; text-underline-offset: 3px;
}

/* شبكة الأعمدة (تناسق محاذاة العناوين لأعلى الأعمدة) */
.footer-grid{
  display:grid;
  grid-template-columns: 1.15fr 1fr 1.15fr; /* توازن بصري */
  gap:36px;
  align-items:start;                 /* مهم لتراص العناوين على سطر واحد */
}
.footer-grid > .foot-col{ text-align:right; }

/* عناوين الأعمدة – توحيد الحجم والمسافة والخط السفلي */
.foot-title{
  margin:0;
  font-weight:900;
  font-size: clamp(1.05rem, 1.3vw, 1.25rem);
  padding-bottom:12px;               /* نفس المسافة لكل الأعمدة */
  position:relative;

  /* الإزاحة المطلوبة لبدء العنوان من الداخل */
  padding-right: var(--foot-offset);
}
/* خط تحت بداية نص العنوان بعد الإزاحة */
.foot-title::after{
  content:"";
  position:absolute; bottom:0;
  right: var(--foot-offset);
  width:64px; height:3px;
  background: var(--footer-accent);
  border-radius:999px;
  opacity:.95;
}

/* جعل كل ما بعد العنوان يبدأ من نفس خطه (بنفس الإزاحة) */
.foot-col > :not(.foot-title){
  padding-right: var(--foot-offset);
}
/* مسافة بسيطة بين العنوان وأول عنصر تحته */
.foot-title + *{ margin-top:12px }
/* توحيد المسافات داخل العمود */
.foot-col > * + *{ margin-top:10px }

/* نص الوصف في العمود الأول */
.foot-desc{ margin:6px 0 0; color:var(--footer-muted); }

/* روابط سريعة */
.foot-links{ list-style:none; padding:0; margin:0; display:grid; gap:10px; }
.foot-links li a{
  display:inline-flex; align-items:center; gap:8px; font-weight:800; opacity:.95;
}
.foot-links li a:hover{ opacity:1; transform: translateX(-2px); }

/* اتصل بنا */
.foot-contact{ list-style:none; padding:0; margin:0; display:grid; gap:12px; }
.foot-contact li{
  display:grid; grid-template-columns: 28px 1fr; gap:10px; align-items:center;
}
.foot-contact i{
  width:28px; height:28px; display:grid; place-items:center;
  border-radius:8px; background: rgba(0,0,0,.18);
}

/* للأرقام/الإيميل الإنجليزية */
.ltr{ direction:ltr; unicode-bidi: embed; }

/* الذيل السفلي */
.footer-copy{
  border-top:1px solid var(--footer-border);
  margin-top:30px; padding:14px 0;
  color:var(--footer-muted);
  font-size:.95rem;
}
.footer-copy .container{ display:flex; justify-content:center; }


/* ===== Sidebar Social Brand Colors (Front Sidebar) ===== */

/* اجعل لون الأيقونة يأخذ من لون الرابط نفسه */
#frontSidebar .social a i{ color: currentColor; }

/* الخلفيات (ألوان العلامات) + نص أبيض */
#frontSidebar .social a.wa{
  background:#25D366; color:#fff; border-color:transparent;
}
#frontSidebar .social a.ig{
  /* تقدر تستبدلها بلون ثابت: background:#E1306C; */
  background: conic-gradient(from 225deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
  color:#fff; border-color:transparent;
}
#frontSidebar .social a.fb{
  background:#1877F2; color:#fff; border-color:transparent;
}
#frontSidebar .social a.tt{
  background:#000; color:#fff; border-color:transparent;
}

/* ثبّت لون العلامة عند التحويم (لا يتحول للـ primary) */
#frontSidebar .social a.wa:hover{ background:#25D366; color:#fff; box-shadow:0 6px 18px rgba(37,211,102,.25); transform:translateY(-2px) scale(1.08); }
#frontSidebar .social a.ig:hover{ background: conic-gradient(from 225deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5); color:#fff; box-shadow:0 6px 18px rgba(225,48,108,.25); transform:translateY(-2px) scale(1.08); }
#frontSidebar .social a.fb:hover{ background:#1877F2; color:#fff; box-shadow:0 6px 18px rgba(24,119,242,.25); transform:translateY(-2px) scale(1.08); }
#frontSidebar .social a.tt:hover{ background:#000; color:#fff; box-shadow:0 6px 18px rgba(0,0,0,.25); transform:translateY(-2px) scale(1.08); }

/* (اختياري) إن أضفت تيليجرام لاحقاً */
#frontSidebar .social a.tg{
  background:#229ED9; color:#fff; border-color:transparent;
}
#frontSidebar .social a.tg:hover{
  background:#229ED9; color:#fff; box-shadow:0 6px 18px rgba(34,158,217,.25); transform:translateY(-2px) scale(1.08);
}




/* styles.css */
.section-card{ padding:24px }            /* سطح مكتب أكبر */
@media (max-width:700px){
  .section-card{ padding:18px }          /* جوال */
}



/* == تحكم بحجم الكارد الحاوي لعناوين الأقسام + الشبكة == */
.section-card{ 
  /* حجم الكارد (المسافات الداخلية) */
  padding: 20px;            /* كان 16px؛ كبّر/صغّر كما تريد */
  border-radius: 20px;      /* تكبير الحواف */
}

/* المسافات حول شبكة الأصناف داخل الكارد */
.section-card .grid{
  padding-inline: 18px;     /* يمين/يسار داخل الكارد */
  padding-block: 18px;      /* أعلى/أسفل داخل الكارد */
}

/* جعل الكارد أعرض على الموبايل (قرب الحواف) */
@media (max-width:700px){
  /* لو تريد تقريبًا حافة لحافة على الهاتف */
  #menu.container{ padding-inline: 0px; }  /* أو 0px للحافة تمامًا */
  /* لو استخدمت 0px فوق: يمكنك تسطيح الحواف ليبدو فل بليد */
  /* .section-card{ border-radius: 0 } */
}





.stars svg, .stars img, .star{ width:11px !important; height:11px !important }

/* ===== Full-bleed cards on mobile: يصل للكروت للخطّين الحمر ===== */
@media (max-width:700px){
  /* 1) الحاوية العامة لقسم المنيو */
  #menu.container{ padding-inline: 0; }

  /* 2) الكارد الحاوي (العنوان + الشبكة) */
  .section-card{
    padding: 0;          /* إزالة الحشوة الجانبية كليًا */
    border-radius: 0;    /* اختياري: حافة-لحافة فعليًا */
  }
  .section-card .section-head{ padding: 12px 12px 14px; } /* نحافظ على مسافة العنوان فقط */

  /* 3) الشبكة داخل الكارد الحاوي */
  .section-card .grid{ padding-inline: 0; }

  /* 4) إلغاء الـ padding الجانبي الافتراضي على الموبايل للشبكات */
  .grid-3{ padding-inline: 0; }
  .card{ margin: 0; } /* نتأكد ما في مسافات أفقية إضافية */
}
@media (max-width:700px){
  #menu.container{ padding-inline:0 !important; }   /* يغلب سطر 49 و 608 */
  .section-card{ padding: 0.3em !important; }            /* يغلب سطر 898 */
  .section-card .grid{ padding-inline:0 !important; }/* يغلب سطر 840 */
  .grid-3{ padding-inline:0 !important; }           /* يغلب سطر 60 */
  .card{ margin:0 !important; }
}

/* === Mobile: compact category ribbon (catRibbon) === */
@media (max-width:700px){
  #catRibbon .pill{
    padding: 8px 12px !important;
    font-size: .90rem !important;
    line-height: 2 !important;     /* كان 2: يقلّل ارتفاع الزر */
    width: max-content !important;    /* عرض بحسب طول النص */
    white-space: nowrap;              /* يمنع سطرين */
    flex: 0 0 auto;                   /* يمنع التمدد داخل السحب الأفقي */
  }
}
/* ——— استجابة ممتازة ——— */
@media (max-width:1000px){
  .footer-grid{ grid-template-columns: 1fr 1fr; }
}

@media (max-width:640px){
  /* تقليل الإزاحة كي تكون مناسبة للموبايل */
  :root{ --foot-offset: 16px; }

  .footer-grid{ grid-template-columns: 1fr; gap:22px; }
  .footer-copy .container{ text-align:center; }
}
iframe, embed, object{ max-width:100%; display:block; }

/* 2) نص مرن (Fluid Type) */
:root{
  --fluid-300: clamp(.9rem, .26vw + .85rem, 1rem);
  --fluid-400: clamp(1rem, .6vw + .9rem, 1.125rem);
  --fluid-500: clamp(1.125rem, 1vw + .9rem, 1.375rem);
  --fluid-600: clamp(1.35rem, 1.6vw + 1rem, 1.75rem);
  --fluid-700: clamp(1.6rem, 2.2vw + 1rem, 2.25rem);
  --page-max: 1200px;
  --g: 16px; /* gap افتراضي */
}
body{ font-size:var(--fluid-400); line-height:1.7; }
h1{ font-size:var(--fluid-700); line-height:1.2; margin:0 0 .6em; }
h2{ font-size:var(--fluid-600); line-height:1.25; margin:0 0 .6em; }
h3{ font-size:var(--fluid-500); line-height:1.3; margin:0 0 .6em; }
p  { margin:0 0 1em; }

/* 3) حاوية مرنة (بدون ميديا كويري) */
.container{ width:min(100% - 24px, var(--page-max)); margin-inline:auto; }

/* 4) شبكة عامة مرنة تعمل تلقائياً */
.r-grid{
  --min: 260px;        /* أقل عرض للعمود قبل ما يلف لسطر جديد */
  --gap: var(--g);
  display:grid;
  gap:var(--gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--min), 1fr));
}
/* أمثلة سريعة لتغيير الحد الأدنى بعنصر واحد: 
   <div class="r-grid" style="--min:320px;--gap:20px">…</div> */

/* 5) Flex سريعة */
.row{ display:flex; flex-wrap:wrap; gap:var(--g); }
.row.center{ align-items:center; }
.row.between{ justify-content:space-between; }

/* 6) ميديا كويريز قياسية (إن احتجت فواصل جاهزة) */
@media (max-width:1200px){ .only-xl{ display:none !important; } }
@media (max-width:992px){  .only-lg{ display:none !important; } }
@media (max-width:768px){  .only-md{ display:none !important; } .container{ width:min(100% - 20px, var(--page-max)); } }
@media (max-width:480px){  .only-sm{ display:none !important; } }

/* 7) جداول ومحتوى عريض — لجعله ينساب بدون كسر الصفحة */
.r-scroll-x{ overflow-x:auto; -webkit-overflow-scrolling:touch; }
.r-scroll-x > table{ min-width:640px; border-collapse:collapse; width:100%; }

/* 8) فيديو/خرائط بنسبة أبعاد مرنة */
.resp-video{ width:100%; aspect-ratio:16/9; background:#000; }
.resp-video > iframe{ width:100%; height:100%; border:0; }

/* 9) أكواد/نصوص طويلة لا تُسبب تمطيط أفقي */
pre, code{ max-width:100%; overflow:auto; }
.long-text{ overflow-wrap:anywhere; word-break:break-word; }

/* 10) أزرار/حقول بعرض كامل على الشاشات الصغيرة */
@media (max-width:480px){
  .btn, button, input[type="text"], input[type="email"], input[type="tel"], select, textarea{
    width:100%;
  }
}

/* 11) صور غلاف مفيدة للأقسام */
.img-cover{ width:100%; height:100%; object-fit:cover; object-position:center; }

/* 12) مساعد تباعد عمودي سريع */
.stack > * + *{ margin-top: var(--stack, 12px); }

