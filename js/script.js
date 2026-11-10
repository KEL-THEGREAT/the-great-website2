// the great: page logic. Settings are in config.js.
let pending = false, vals = null;
class DCLogic {
  constructor() { this.props = CONFIG; this.state = {}; }
  setState(p) { this.state = Object.assign({}, this.state, p); schedule(); }
}
class Component extends DCLogic {
componentDidMount() { this._t = setInterval(() => this.setState({now: Date.now()}), 1000); }
componentWillUnmount() { clearInterval(this._t); }
renderVals() {
const s = this.state || {};
const price = Number(this.props.price ?? 25);
const money = n => '£' + (Number.isInteger(n) ? n : n.toFixed(2));
const P = [
{id:'dad', name:'Dad Cap', color:'Black', fill:'#14161A', seam:'#fff'},
{id:'snap', name:'Snapback', color:'Sand', fill:'#C9B28A', seam:'#000'},
{id:'truck', name:'Trucker', color:'Forest', fill:'#2F4A3A', seam:'#fff'},
{id:'panel', name:'5-Panel', color:'Navy', fill:'#1F2F5C', seam:'#fff'}];
const cat = s.cat || 'all';
const faqOpen = s.faq === undefined ? 0 : s.faq;
const go = () => { const e = document.getElementById('shop'); if (e) e.scrollIntoView({behavior: 'smooth'}); };
const cats = [{id:'all', label:'All'}].concat(P.map(p => ({id:p.id, label:p.name}))).map(c => ({
id: c.id, label: c.label, on: cat === c.id,
bg: cat === c.id ? '#14161A' : 'transparent', fg: cat === c.id ? '#F6F6F3' : '#14161A',
pick: () => this.setState({cat: c.id})}));
const shopMenu = [{id:'all', label:'All caps'}].concat(P.map(p => ({id:p.id, label:p.name + 's'}))).map(c => ({
label: c.label, go: () => { this.setState({cat: c.id, menu: null}); go(); }}));
const collMenu = ['New arrivals', 'Best sellers', 'Limited drops'].map(l => ({
label: l, go: () => { this.setState({cat: 'all', menu: null}); go(); }}));
const wish = s.wish || [];
const toggleWish = id => this.setState({wish: wish.indexOf(id) > -1 ? wish.filter(x => x !== id) : wish.concat([id])});
const items = P.map(p => Object.assign({}, p, {
priceLabel: money(price),
cls: 'cap cap-' + {dad:'black', snap:'sand', truck:'forest', panel:'navy'}[p.id],
display: (cat === 'all' || cat === p.id) ? 'block' : 'none',
view: () => this.setState({open: p.id, added: false, swatch: null}),
wished: wish.indexOf(p.id) > -1, heartFill: wish.indexOf(p.id) > -1 ? (this.props.accent ?? '#6B1D3A') : 'none', wishLabel: wish.indexOf(p.id) > -1 ? 'Remove from saved caps' : 'Save for later', toggleWish: () => toggleWish(p.id)}));
const wishItems = wish.map(id => P.find(p => p.id === id)).filter(Boolean).map(p => ({id: p.id, name: p.name, color: p.color, priceLabel: money(price), view: () => this.setState({acctOpen: false, open: p.id, added: false, swatch: null}), remove: () => toggleWish(p.id)}));
const faqs = [
{q:'Shipping and returns', a:'[Add your shipping and returns policy]'},
{q:'How do I find my size?', a:'[Add sizing guidance]'},
{q:'What are the caps made from?', a:'[Add materials and care]'}].map((f, i) => Object.assign({}, f, {
open: faqOpen === i, mark: faqOpen === i ? '\u2212' : '+',
toggle: () => this.setState({faq: faqOpen === i ? -1 : i})}));
const acc = this.props.accent ?? '#6B1D3A';
const SW = [{name:'Black', fill:'#14161A', seam:'#fff'}, {name:'Sand', fill:'#C9B28A', seam:'#000'}, {name:'Forest', fill:'#2F4A3A', seam:'#fff'}, {name:'Navy', fill:'#1F2F5C', seam:'#fff'}, {name:'Burgundy', fill:acc, seam:'#fff'}];
const sw = (s.swatch === null || s.swatch === undefined) ? null : SW[s.swatch];
const baseP = P.find(p => p.id === s.open) || P[0];
const KEYS = {dad:'black', snap:'sand', truck:'forest', panel:'navy'};
const cur = Object.assign({}, baseP, sw ? {fill: sw.fill, seam: sw.seam, color: sw.name} : {}, {priceLabel: money(price), cls: 'cap cap-' + (sw ? sw.name.toLowerCase() : KEYS[baseP.id])});
const swatches = SW.map((w, i) => Object.assign({}, w, {on: sw === w, ring: sw === w ? '#14161A' : 'transparent', pick: () => this.setState({swatch: i})}));
const rawLines = s.lines || [];
const qtyTotal = rawLines.reduce((n, l) => n + (l.qty || 1), 0);
const setQty = (i, q) => this.setState({lines: q < 1 ? rawLines.filter((_, k) => k !== i) : rawLines.map((l, k) => k === i ? Object.assign({}, l, {qty: q}) : l)});
const lines = rawLines.map((l, i) => Object.assign({}, l, {qty: l.qty || 1, lineTotal: money(price * (l.qty || 1)), dec: () => setQty(i, (l.qty || 1) - 1), inc: () => setQty(i, (l.qty || 1) + 1)}));
const subNum = price * qtyTotal;
const PROMOS = (typeof CONFIG !== 'undefined' && CONFIG.promoCodes) || {GREAT10: 10};
const promo = s.promo || '';
const pctOff = promo && PROMOS[promo] ? PROMOS[promo] : 0;
const discNum = Math.round(subNum * pctOff) / 100;
const totalNum = subNum - discNum;
const freeFrom = Number(this.props.freeShipping ?? 50);
const shipLeft = Math.max(0, freeFrom - subNum);
const applyPromo = () => {
const code = (((document.getElementById('promo') || {}).value) || '').trim().toUpperCase();
if (!code) { this.setState({promoMsg: 'Enter a code first.', promoOk: false}); return; }
if (PROMOS[code]) this.setState({promo: code, promoMsg: PROMOS[code] + '% off applied.', promoOk: true});
else this.setState({promo: '', promoMsg: 'That code isn’t valid.', promoOk: false});
};
const dropAt = new Date(this.props.dropDate ?? '2026-12-12T18:00:00').getTime();
const left = isNaN(dropAt) ? 0 : Math.max(0, dropAt - (s.now || Date.now()));
const p2 = n => String(n).padStart(2, '0');
const notify = () => {
const v = (((document.getElementById('notify-email') || {}).value) || '').trim().toLowerCase();
if (v.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || !/^[a-z0-9._+@~:-]+$/.test(v)) { this.setState({notified: false, notifyFail: false, notifyBad: true}); return; }
const ep = (typeof CONFIG !== 'undefined' && CONFIG.signupEndpoint) || '';
if (!ep) { this.setState({notified: true, notifyFail: false, notifyBad: false}); return; }
this.setState({notifyBad: false, notifyFail: false});
fetch(ep, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify({email: v, list: 'next-drop'})})
.then(r => { if (!r.ok) throw new Error('bad response'); this.setState({notified: true}); })
.catch(() => this.setState({notified: false, notifyFail: true}));
};
const R = [{quote:'[Customer review one]', who:'[Customer name]'}, {quote:'[Customer review two]', who:'[Customer name]'}, {quote:'[Customer review three]', who:'[Customer name]'}];
const ri = s.rev || 0;
const user = s.user || null;
const orderList = s.orders || [];
const tab = s.acctTab || 'login';
const place = (u) => {
const n = qtyTotal;
const order = {id: 'TG-' + (1001 + orderList.length), date: new Date().toLocaleDateString('en-GB'), items: rawLines.map(l => (l.qty || 1) + ' x ' + l.name + ' (' + l.color + ')').join(', '), total: money(totalNum), count: n};
this.setState({user: u, orders: orderList.concat([order]), lines: [], promo: '', promoMsg: '', cartOpen: false, acctOpen: true, pendingOrder: false, acctError: '', acctNote: ''});
};
const checkout = () => {
if (!rawLines.length) { this.setState({cartOpen: false}); return; }
if (!user) { this.setState({cartOpen: false, acctOpen: true, acctTab: 'login', acctError: '', acctNote: 'Log in or sign up to place your order.', pendingOrder: true}); return; }
place(user);
};
const submitAcct = () => {
const val = id => ((document.getElementById(id) || {}).value || '').trim();
const email = val('acct-email').toLowerCase(), pass = val('acct-pass'), name = val('acct-name');
if (tab === 'signup' && !name) { this.setState({acctError: 'Please enter your name.'}); return; }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.setState({acctError: 'Please enter a valid email address.'}); return; }
if (pass.length < 6) { this.setState({acctError: 'Your password needs at least 6 characters.'}); return; }
const u = {name: name || email.split('@')[0], email: email};
if (s.pendingOrder && rawLines.length) { place(u); return; }
this.setState({user: u, acctError: '', acctNote: ''});
};
return {
accent: this.props.accent ?? '#6B1D3A',
cart: qtyTotal,
subtotal: money(subNum), total: money(totalNum), hasCart: qtyTotal > 0,
hasDiscount: discNum > 0, promoCode: promo, discountLabel: '-' + money(discNum),
shipText: shipLeft > 0 ? 'Add ' + money(shipLeft) + ' more for free shipping' : 'You’ve got free shipping', shipPct: freeFrom > 0 ? Math.min(100, Math.round(subNum / freeFrom * 100)) : 100,
promoMsg: s.promoMsg || '', hasPromoMsg: !!s.promoMsg, promoColor: s.promoOk ? '#1B6B3A' : '#B3261E', applyPromo: applyPromo,
dropWait: left > 0, dropLive: left === 0, cdDays: p2(Math.floor(left / 864e5)), cdHours: p2(Math.floor(left / 36e5) % 24), cdMins: p2(Math.floor(left / 6e4) % 60), cdSecs: p2(Math.floor(left / 1e3) % 60),
notified: !!s.notified, notifyBad: !!s.notifyBad, notifyFail: !!s.notifyFail, notify: notify, wishItems: wishItems, hasWish: wishItems.length > 0,
shopOpen: s.menu === 'shop', collOpen: s.menu === 'coll', contactOpen: s.menu === 'contact',
toggleContact: () => this.setState({menu: s.menu === 'contact' ? null : 'contact'}),
toggleShop: () => this.setState({menu: s.menu === 'shop' ? null : 'shop'}),
toggleColl: () => this.setState({menu: s.menu === 'coll' ? null : 'coll'}),
shopMenu: shopMenu, collMenu: collMenu, cats: cats, items: items,
viewAll: () => this.setState({cat: 'all'}),
modalOpen: !!s.open, cur: cur,
close: () => this.setState({open: null}),
add: () => { const k = rawLines.findIndex(l => l.name === cur.name && l.color === cur.color); this.setState({lines: k > -1 ? rawLines.map((l, i) => i === k ? Object.assign({}, l, {qty: (l.qty || 1) + 1}) : l) : rawLines.concat([{name: cur.name, color: cur.color, qty: 1}]), added: true}); },
addLabel: s.added ? 'Added. Add another' : 'Add to cart',
acctOpen: !!s.acctOpen, signedIn: !!user, signedOut: !user, userName: user ? user.name : '', userEmail: user ? user.email : '',
isSignup: tab === 'signup', submitLabel: tab === 'signup' ? 'Create account' : 'Log in',
loginBg: tab === 'login' ? '#14161A' : 'transparent', loginFg: tab === 'login' ? '#F6F6F3' : '#14161A',
signupBg: tab === 'signup' ? '#14161A' : 'transparent', signupFg: tab === 'signup' ? '#F6F6F3' : '#14161A',
acctError: s.acctError || '', hasAcctError: !!s.acctError, acctNote: s.acctNote || '', hasAcctNote: !!s.acctNote,
openAcct: () => this.setState({acctOpen: true, acctError: '', acctNote: ''}), closeAcct: () => this.setState({acctOpen: false}),
pickLogin: () => this.setState({acctTab: 'login', acctError: ''}), pickSignup: () => this.setState({acctTab: 'signup', acctError: ''}),
submitAcct: submitAcct, signOut: () => this.setState({user: null, acctNote: '', acctError: ''}), checkout: checkout,
orders: orderList.slice().reverse().map(o => Object.assign({}, o, {pct: 25})), hasOrders: orderList.length > 0, noOrders: orderList.length === 0,
faqs: faqs, swatches: swatches, lines: lines, cartEmpty: rawLines.length === 0, cartOpen: !!s.cartOpen,
openCart: () => this.setState({cartOpen: true}), closeCart: () => this.setState({cartOpen: false}),
viewSig: () => this.setState({open: 'snap', added: false, swatch: null}),
rv: R[ri], rvCount: (ri + 1) + ' / ' + R.length,
rvPrev: () => this.setState({rev: (ri + R.length - 1) % R.length}), rvNext: () => this.setState({rev: (ri + 1) % R.length}), joined: !!s.joined, badEmail: !!s.badEmail, failed: !!s.failed,
join: () => {
const el = document.getElementById('email');
const v = ((el && el.value) || '').trim().toLowerCase();
if (v.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || !/^[a-z0-9._+@~:-]+$/.test(v)) { this.setState({joined: false, failed: false, badEmail: true}); return; }
if (!CONFIG.signupEndpoint) { this.setState({joined: true, failed: false, badEmail: false}); return; }
this.setState({badEmail: false, failed: false});
fetch(CONFIG.signupEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify({email: v})})
.then(r => { if (!r.ok) throw new Error('bad response'); this.setState({joined: true}); })
.catch(() => this.setState({joined: false, failed: true}));
}
};
}
}
const app = new Component();
const HOLE = /\{\{\s*([\w$.]+)\s*\}\}/g, ONE = /^\s*\{\{\s*([\w$.]+)\s*\}\}\s*$/;
const get = (scope, path) => { let v = scope; for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; } return v; };
const interp = (s, scope) => s.replace(HOLE, (m, p) => { const v = get(scope, p); return v == null ? '' : String(v); });
function build(node, scope, out) {
  if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
  if (node.nodeType !== 1) return;
  const tag = node.localName;
  if (tag === 'sc-if') { const m = ONE.exec(node.getAttribute('value') || ''); if (m && get(scope, m[1])) for (const c of node.childNodes) build(c, scope, out); return; }
  if (tag === 'sc-for') {
    const m = ONE.exec(node.getAttribute('list') || ''), list = (m && get(scope, m[1])) || [], as = node.getAttribute('as');
    for (const item of list) { const s = Object.create(scope); s[as] = item; for (const c of node.childNodes) build(c, s, out); }
    return;
  }
  const el = document.createElementNS(node.namespaceURI, node.localName);
  for (const at of node.attributes) {
    const name = at.name, value = at.value;
    if (name.indexOf('hint-placeholder') === 0) continue;
    const m = ONE.exec(value);
    if (name === 'data-click') { const f = m && get(scope, m[1]); if (typeof f === 'function') el.onclick = f; continue; }
    if (m) { const v = get(scope, m[1]); if (v != null) el.setAttribute(name, String(v)); continue; }
    el.setAttribute(name, interp(value, scope));
  }
  for (const c of node.childNodes) build(c, scope, el);
  out.appendChild(el);
}
function patch(oldEl, newEl) {
  const nl = Array.from(newEl.childNodes);
  nl.forEach((n, i) => {
    const o = oldEl.childNodes[i];
    if (!o) { oldEl.appendChild(n); return; }
    if (o.nodeType !== n.nodeType || (n.nodeType === 1 && (o.localName !== n.localName || o.namespaceURI !== n.namespaceURI))) { oldEl.replaceChild(n, o); return; }
    if (n.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
    for (const at of Array.from(o.attributes)) if (!n.hasAttribute(at.name)) o.removeAttribute(at.name);
    for (const at of Array.from(n.attributes)) if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value);
    o.onclick = n.onclick;
    patch(o, n);
  });
  while (oldEl.childNodes.length > nl.length) oldEl.removeChild(oldEl.lastChild);
}
const root = document.getElementById('root'), tpl = document.getElementById('tpl').content;
function render() {
  pending = false;
  vals = app.renderVals();
  const next = document.createElement('div');
  for (const c of tpl.childNodes) build(c, vals, next);
  patch(root, next);
}
function schedule() { if (!pending) { pending = true; queueMicrotask(render); } }
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target && e.target.id === 'email' && vals) vals.join();
  if (e.key === 'Enter' && e.target && e.target.id === 'notify-email' && vals) vals.notify();
  if (e.key === 'Enter' && e.target && e.target.id === 'promo' && vals) vals.applyPromo();
  if (e.key === 'Enter' && e.target && /^acct-/.test(e.target.id) && vals) vals.submitAcct();
  if (e.key === 'Escape') app.setState({open: null, cartOpen: false, acctOpen: false, menu: null});
});
render();
if (app.componentDidMount) app.componentDidMount();
