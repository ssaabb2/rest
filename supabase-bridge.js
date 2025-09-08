// ============= supabase-bridge.js (SAFE PACK) =============
// Requires: a Supabase client at window.supabase (create it in <head>).

(() => {
  if (!window.supabase) {
    console.warn('Supabase client is missing. Add it in <head> first.');
  }
})();

// LocalStorage helpers
const LS = {
  get(k, def){ try{ return JSON.parse(localStorage.getItem(k)) ?? def; }catch{ return def; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};

// ---------- Public: fetch categories & visible menu ----------
export async function syncPublicCatalogToLocal(){
  const sb = window.supabase;
  const cats = await sb.from('categories').select('*').order('sort', {ascending:true});
  if (cats.error) throw cats.error;

  const items = await sb.from('menu_items')
    .select('id,name,"desc",price,img,cat_id,available,fresh,rating_avg,rating_count')
    .eq('available', true)
    .order('created_at', {ascending:false});
  if (items.error) throw items.error;

  const adapted = (items.data||[]).map(it => ({
    id: it.id,
    name: it.name,
    desc: it["desc"],
    price: Number(it.price) || 0,
    img: it.img,
    catId: it.cat_id,
    fresh: !!it.fresh,
    rating: { avg: Number(it.rating_avg||0), count: Number(it.rating_count||0) }
  }));

  LS.set('categories', cats.data || []);
  LS.set('menuItems', adapted);
  return { categories: cats.data, items: adapted };
}

// ---------- Orders ----------
export async function createOrderSB({order_name, phone, table_no, notes, items}){
  const sb = window.supabase;
  const total = (items||[]).reduce((s,it)=> s + (Number(it.price)||0) * Number(it.qty||1), 0);

  const ins = await sb.from('orders')
    .insert([{ order_name, phone, table_no, notes, total }])
    .select()
    .single();
  if (ins.error) throw ins.error;
  const order = ins.data;

  const rows = (items||[]).map(it => ({
    order_id: order.id,
    item_id: it.id || null,
    name: it.name,
    price: Number(it.price)||0,
    qty: Number(it.qty)||1
  }));
  if (rows.length){
    const i2 = await sb.from('order_items').insert(rows);
    if (i2.error) throw i2.error;
  }

  // cache to LS for UI  (إكمال النموذج ليستجيب الـKDS/لوحة الأدمن)
  const old = LS.get('orders', []);
  const itemsLS = (items||[]).map(it => ({
    id: it.id || null,
    name: it.name || '',
    price: Number(it.price)||0,
    qty: Number(it.qty)||1
  }));
  const itemCount = itemsLS.reduce((s,it)=> s + (Number(it.qty)||1), 0);

  const nowISO = new Date().toISOString();
  old.unshift({
    id: order.id,
    total,
    itemCount,
    time: nowISO,           // مهم للفلاتر والمؤقّت
    createdAt: nowISO,      // مستخدم بالإشعارات
    status: 'new',          // يبدأ كجديد
    items: itemsLS,         // عرض تفاصيل العناصر على البطاقة
    table: table_no || '',
    orderName: order_name || '',
    notes: notes || ''
  });
  LS.set('orders', old);
  return order;
}
// ---------- Orders: update & delete ----------
export async function deleteOrderSB(orderId){
  const sb = window.supabase;
  const id = Number(orderId);
  const del = await sb.from('orders').delete().eq('id', id);
  if (del.error) throw del.error;

  // عكس التغيير في التخزين المحلي
  const orders = LS.get('orders', []);
  LS.set('orders', orders.filter(o => Number(o.id) !== id));

  // تنظيف إشعارات الطلب إن وُجدت
  const ns = LS.get('notifications', []).filter(n => n.type!=='order' || !String(n.title||'').includes(`#${id}`));
  LS.set('notifications', ns);

  try { document.dispatchEvent(new CustomEvent('sb:admin-synced', { detail: { at: Date.now() } })); } catch {}
  return true;
}

export async function updateOrderSB(orderId, { order_name, table_no, notes, total, status, additions, discount_pct, discount }){
  const sb = window.supabase;
  const id = Number(orderId);
  const payload = {};
if (typeof status       !== 'undefined') payload.status       = status;
if (typeof additions    !== 'undefined') payload.additions    = additions;
if (typeof discount_pct !== 'undefined') payload.discount_pct = Number(discount_pct)||0;
if (typeof discount     !== 'undefined') payload.discount     = Number(discount)||0;

  const upd = await sb.from('orders').update(payload).eq('id', id).select().single();
  if (upd.error) throw upd.error;

  // تحديث الكاش المحلي
  const orders = LS.get('orders', []);
  const o = orders.find(x => Number(x.id) === id);
  if (o){
  if ('status'       in payload) o.status      = payload.status;
if ('additions'    in payload) o.additions   = payload.additions;
if ('discount'     in payload) o.discount    = payload.discount;
if ('discount_pct' in payload) o.discountPct = payload.discount_pct;

    LS.set('orders', orders);
  }
  try { document.dispatchEvent(new CustomEvent('sb:admin-synced', { detail: { at: Date.now() } })); } catch {}
  return upd.data;
}

// ---------- Reservations ----------
export async function createReservationSB({name, phone, iso, people, kind='table', table='', notes, duration_minutes=90}){
  const sb = window.supabase;

  // إدراج بدون select لتوافق صلاحيات anon (insert فقط)
  const insOnly = await sb.from('reservations').insert([{
    name, phone, date: iso, people, kind, notes,
    duration_minutes, table_no: table
  }]);
  if (insOnly.error) throw insOnly.error;

  // نبني سجل محلي لواجهة المستخدم (بدون الاعتماد على إرجاع السيرفر)
  const r = {
    id: (crypto?.randomUUID?.() || `tmp-${Date.now()}`),
    name,
    phone,
    date: iso,
    people,
    kind,
    table_no: table || '',
    duration_minutes: duration_minutes || 90,
    notes: notes || '',
    status: 'new'
  };

  const list = LS.get('reservations', []);
  list.unshift({
    id: r.id,
    name: r.name,
    phone: r.phone,
    date: r.date,
    people: r.people,
    kind: r.kind,
    table: r.table_no || '',
    duration: r.duration_minutes || 90,
    notes: r.notes || '',
    status: r.status || 'new',
    createdAt: new Date().toISOString()
  });

  LS.set('reservations', list);
  return true;
}

export async function updateReservationSB(id, fields){
  const f = fields || {};
  const patch = {};
  if ('name' in f) patch.name = f.name;
  if ('phone' in f) patch.phone = f.phone;
  if ('date' in f) patch.date = f.date;
  if ('people' in f) patch.people = f.people;
  if ('status' in f) patch.status = f.status;
  if ('notes' in f) patch.notes = f.notes;
  if ('table_no' in f) patch.table = f.table_no;
  if ('duration_minutes' in f) patch.duration = f.duration_minutes;

  const isTmp = String(id).startsWith('tmp-') || Number.isNaN(Number(id));
  if (isTmp) {
    // تعديل محلي فقط للحجوزات ذات المعرّف المؤقّت
    const list = LS.get('reservations', []);
    const i = list.findIndex(r => String(r.id) === String(id));
    if (i >= 0) {
      list[i] = { ...list[i], ...patch, updatedAt: new Date().toISOString() };
      LS.set('reservations', list);
    }
    return true;
  }

  const sb = window.supabase;
  // (مهم) مطابقة نوع id مع bigint في القاعدة
  const up = await sb.from('reservations').update(fields).eq('id', Number(id)).select().single();
  if (up.error) throw up.error;

  const list = LS.get('reservations', []);
  const i = list.findIndex(r => String(r.id) === String(id));
  if (i >= 0) {
    list[i] = { ...list[i], ...patch, updatedAt: new Date().toISOString() };
    LS.set('reservations', list);
  }
  return up.data;
}

export async function deleteReservationSB(id){
  const isTmp = String(id).startsWith('tmp-') || Number.isNaN(Number(id));
  if (isTmp){
    // حذف محلي فقط للحجوزات ذات المعرّف المؤقّت
    const list = (LS.get('reservations', []) || []).filter(r => String(r.id) !== String(id));
    LS.set('reservations', list);
    return true;
  }

  const sb = window.supabase;
  // (مهم) مطابقة نوع id مع bigint في القاعدة
  const del = await sb.from('reservations').delete().eq('id', Number(id));
  if (del.error) throw del.error;

  const list = (LS.get('reservations', []) || []).filter(r => String(r.id) !== String(id));
  LS.set('reservations', list);
  return true;
}

// ---------- Categories ----------
export async function createCategorySB({ id, name, sort = 100 }){
  const sb = window.supabase;
  const ins = await sb.from('categories').insert([{ id, name, sort }]).select().single();
  if (ins.error) throw ins.error;
  // تحديث الكاش المحلي مباشرة لظهور القسم فورًا
  const cats = LS.get('categories', []);
  cats.push({ id: ins.data.id, name: ins.data.name, sort: ins.data.sort });
  LS.set('categories', cats);
  return ins.data;
}

// ---------- Categories (update & delete) ----------
export async function updateCategorySB(id, fields = {}){
  const sb = window.supabase;
  const payload = {};
  if (typeof fields.name !== 'undefined') payload.name = fields.name;
  if (typeof fields.sort !== 'undefined') payload.sort = fields.sort;
  const up = await sb.from('categories').update(payload).eq('id', id).select().single();
  if (up.error) throw up.error;

  // Update LS cache for immediate UI feedback
  const cats = LS.get('categories', []);
  const i = cats.findIndex(c => c.id === id);
  if (i >= 0) {
    cats[i] = { ...cats[i], ...up.data };
    LS.set('categories', cats);
  }
  return up.data;
}

export async function deleteCategorySB(id){
  const sb = window.supabase;
  const del = await sb.from('categories').delete().eq('id', id);
  if (del.error) throw del.error;

  // Reflect locally: remove cat + unlink items
  const cats = LS.get('categories', []).filter(c => c.id !== id);
  LS.set('categories', cats);
  const items = LS.get('menuItems', []);
  items.forEach(it => { if (it.catId === id) it.catId = null; });
  LS.set('menuItems', items);
  return true;
}

// ---------- Menu Items (create / update / delete) ----------
export async function createMenuItemSB({ name, desc='', price=0, img='', cat_id=null, available=true, fresh=false }){
  const sb = window.supabase;
  const ins = await sb.from('menu_items').insert([{
    name, "desc": desc, price, img, cat_id, available, fresh
  }]).select().single();
  if (ins.error) throw ins.error;

  // حدّث الكاش المحلي لظهور الصنف فورًا
  const items = LS.get('menuItems', []);
  const it = ins.data;
  items.unshift({
    id: it.id, name: it.name, desc: it["desc"], price: Number(it.price)||0,
    img: it.img, catId: it.cat_id, fresh: !!it.fresh,
    rating: { avg: Number(it.rating_avg||0), count: Number(it.rating_count||0) },
    available: !!it.available
  });
  LS.set('menuItems', items);
  return it;
}

export async function updateMenuItemSB(id, fields={}){
  const sb = window.supabase;
  const payload = {};
  if ('name' in fields) payload.name = fields.name;
  if ('desc' in fields) payload["desc"] = fields.desc;
  if ('price' in fields) payload.price = fields.price;
  if ('img' in fields) payload.img = fields.img;
  if ('catId' in fields) payload.cat_id = fields.catId;
  if ('available' in fields) payload.available = fields.available;
  if ('fresh' in fields) payload.fresh = fields.fresh;

  const up = await sb.from('menu_items').update(payload).eq('id', id).select().single();
  if (up.error) throw up.error;

  // حدّث الكاش المحلي
  const items = LS.get('menuItems', []);
  const i = items.findIndex(x => x.id === id);
  if (i >= 0){
    const it = up.data;
    items[i] = {
      id: it.id, name: it.name, desc: it["desc"], price: Number(it.price)||0,
      img: it.img, catId: it.cat_id, fresh: !!it.fresh,
      rating: items[i].rating || { avg: 0, count: 0 },
      available: !!it.available
    };
    LS.set('menuItems', items);
  }
  return up.data;
}

export async function deleteMenuItemSB(id){
  const sb = window.supabase;
  const del = await sb.from('menu_items').delete().eq('id', id);
  if (del.error) throw del.error;
  const items = (LS.get('menuItems', [])||[]).filter(x => x.id !== id);
  LS.set('menuItems', items);
  return true;
}

// ---------- Ratings ----------
export async function createRatingSB({item_id, stars}){
  const sb = window.supabase;
  const ins = await sb.from('ratings').insert([{ item_id, stars }]).select().single();
  if (ins.error) throw ins.error;
  return ins.data;
}

// ---------- Admin sync ----------
export async function syncAdminDataToLocal(){
  const sb = window.supabase;

  const cats = await sb.from('categories').select('*').order('sort', {ascending:true});
  if (cats.error) throw cats.error;

  const items = await sb.from('menu_items').select('*').order('created_at', {ascending:false});
  if (items.error) throw items.error;

  // Orders joined with items
const orders = await sb.from('orders').select('id,order_name,phone,table_no,notes,total,status,discount_pct,discount,additions,created_at').order('created_at', {ascending:false});
  if (orders.error) throw orders.error;

  const orderIds = (orders.data||[]).map(o=>o.id);
  let orderItems = [];
  if (orderIds.length){
    const oi = await sb.from('order_items').select('*').in('order_id', orderIds);
    if (oi.error) throw oi.error;
    orderItems = oi.data || [];
  }

  // ratings
  const ratings = await sb.from('ratings').select('*').order('created_at', {ascending:false});
  if (ratings.error) throw ratings.error;

  const reservations = await sb.from('reservations').select('*').order('date', {ascending:true});
  if (reservations.error) throw reservations.error;

  // adapt to your LS shapes
  LS.set('categories', cats.data || []);
  LS.set('menuItems', (items.data||[]).map(it => ([
    it.id, it.name, it["desc"], it.price, it.img, it.cat_id, it.fresh, it.rating_avg, it.rating_count, it.available
  ] && {
    id: it.id, name: it.name, desc: it["desc"], price: Number(it.price)||0,
    img: it.img, catId: it.cat_id, fresh: !!it.fresh,
    rating: { avg: Number(it.rating_avg)||0, count: Number(it.rating_count)||0 },
    available: !!it.available
  })));

  // join orders
  const adminOrders = (orders.data||[]).map(o=>{
    const its = orderItems.filter(oi => oi.order_id === o.id).map(oi => ({
      id: oi.item_id, name: oi.name, price: Number(oi.price)||0, qty: Number(oi.qty||1)
    }));
    const cnt = its.reduce((s,it)=> s + (Number(it.qty)||1), 0);
   return {
  id: o.id,
  total: Number(o.total)||0,
  itemCount: cnt,
  time: o.created_at,
  createdAt: o.created_at,
  status: o.status || 'new',
  table: o.table_no||'',
  orderName: o.order_name||'',
  notes: o.notes||'',
  additions: o.additions || [],
  discount: Number(o.discount)||0,
  discountPct: Number(o.discount_pct)||0,
  items: its
};

  });
  LS.set('orders', adminOrders);

  LS.set('reservations', (reservations.data||[]).map(r => ({
    id: Number(r.id),
    name: r.name,
    phone: r.phone,
    date: r.date,
    people: r.people,
    kind: r.kind,
    table: r.table_no || '',
    duration: r.duration_minutes || 90,
    notes: r.notes || '',
    status: r.status || 'new'
  })));

  // notifications: only orders for the admin drawer
  const notifOrders = adminOrders.map(o => ({
    id: `ord-${o.id}`,
    type: 'order',
    title: `طلب جديد #${o.id}`,
    message: `عدد العناصر: ${o.itemCount} | الإجمالي: ${o.total}`,
    time: o.createdAt,
    read: false
  }));
  const existing = LS.get('notifications', []).filter(n => n.type !== 'order');
  const merged = [...existing, ...notifOrders].sort((a,b)=> new Date(b.time) - new Date(a.time));
  LS.set('notifications', merged);

  try {
    document.dispatchEvent(new CustomEvent('sb:admin-synced', { detail: { at: Date.now() } }));
  } catch {}

  return true;
}

export async function requireAdminOrRedirect(loginPath='login.html'){
  const sb = window.supabase;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.replace(loginPath); return null; }
  return session; // أي مستخدم مسجّل دخولًا مسموح
}

// ---------- Auto bootstrap on admin pages (safe & optional) ----------
// يشغّل التحقق + المزامنة تلقائيًا على أي صفحة اسمها يحوي "admin"
(() => {
  try {
    const path = (location.pathname || '').toLowerCase();
    const isAdminPage = path.includes('admin');
    if (!isAdminPage) return;

    const run = async () => {
      try { await requireAdminOrRedirect('login.html'); } catch(e){ console.error(e); }
      try { await syncAdminDataToLocal(); } catch(e){ console.error(e); }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      run();
    }
  } catch(e) { console.error(e); }
})();

// Expose to window for non-module scripts
window.supabaseBridge = {
  syncPublicCatalogToLocal,
  createOrderSB,
  deleteOrderSB,
  updateOrderSB,
  createCategorySB,
  updateCategorySB,
  deleteCategorySB,
  createMenuItemSB,
  updateMenuItemSB,
  deleteMenuItemSB,   // <— أُضيفت هنا
  createReservationSB,
  updateReservationSB,
  deleteReservationSB,
  createRatingSB,
  syncAdminDataToLocal,
  requireAdminOrRedirect
};
