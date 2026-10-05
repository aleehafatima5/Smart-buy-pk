/* SmartBuy PK - shared data, layout and page logic */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const enc = encodeURIComponent;
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls = {
  get(k, d){ try{ const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};

/* ============ DATA ============ */
const CATEGORIES = [
  {id:"mobiles",    icon:"📱", name:"Mobile Phones",          desc:"Smartphones, tablets and accessories.",        ex:["Samsung Galaxy A15","iPhone 13","Infinix Hot 40"]},
  {id:"laptops",    icon:"💻", name:"Laptops & Computers",    desc:"Laptops, desktops, monitors and parts.",        ex:["Dell Inspiron 15","HP 250 G9","Lenovo IdeaPad"]},
  {id:"electronics",icon:"🎧", name:"Electronics & Gadgets",  desc:"Earbuds, smartwatches, speakers, cameras.",    ex:["Airdopes earbuds","Xiaomi smart band","JBL speaker"]},
  {id:"gaming",     icon:"🎮", name:"Gaming",                 desc:"Consoles, controllers and gaming gear.",        ex:["PS5 controller","Gaming mouse","Nintendo Switch"]},
  {id:"mens",       icon:"👔", name:"Men's Fashion",          desc:"Shirts, kurtas, jeans and more.",              ex:["Men's kurta","Denim jacket","Polo shirt"]},
  {id:"womens",     icon:"👗", name:"Women's Fashion",        desc:"Dresses, lawn suits, abayas and more.",         ex:["Lawn 3 piece suit","Party wear dress","Abaya"]},
  {id:"shoes",      icon:"👟", name:"Shoes & Footwear",       desc:"Sneakers, sandals, formal shoes.",              ex:["Running shoes","Peshawari chappal","Women's heels"]},
  {id:"watches",    icon:"⌚", name:"Watches",                desc:"Analog, digital and smart watches.",            ex:["Casio watch","Fossil watch","Smartwatch"]},
  {id:"bags",       icon:"👜", name:"Bags & Luggage",         desc:"Handbags, backpacks, travel bags.",             ex:["Laptop backpack","Ladies handbag","Travel suitcase"]},
  {id:"jewelry",    icon:"💍", name:"Jewelry & Accessories",  desc:"Necklaces, rings, bangles, sunglasses.",        ex:["Gold plated necklace","Artificial jewelry set","Sunglasses"]},
  {id:"beauty",     icon:"🧴", name:"Beauty & Skincare",      desc:"Lotion, face wash, makeup, perfume.",           ex:["Nivea body lotion","CeraVe cleanser","Sunscreen SPF 50"]},
  {id:"haircare",   icon:"💇", name:"Hair Care",              desc:"Shampoo, oil, dryers and straighteners.",       ex:["Head & Shoulders shampoo","Hair straightener","Argan hair oil"]},
  {id:"health",     icon:"💊", name:"Health & Wellness",      desc:"Supplements, devices, personal care.",          ex:["Vitamin D3","Blood pressure monitor","Protein powder"]},
  {id:"home",       icon:"🏠", name:"Home & Kitchen",         desc:"Cookware, decor, bedding and storage.",         ex:["Non-stick pan set","Bed sheet","Air fryer"]},
  {id:"appliances", icon:"🧊", name:"Home Appliances",        desc:"Fridges, ACs, washing machines, fans.",         ex:["Inverter AC 1.5 ton","Washing machine","Ceiling fan"]},
  {id:"furniture",  icon:"🛋️", name:"Furniture",              desc:"Beds, sofas, office chairs, tables.",           ex:["Office chair","Study table","Sofa set"]},
  {id:"grocery",    icon:"🛒", name:"Grocery & Food",         desc:"Daily needs, snacks, tea, cooking oil.",        ex:["Tapal tea","Cooking oil 5L","Basmati rice"]},
  {id:"baby",       icon:"🍼", name:"Baby & Kids",            desc:"Diapers, baby care, kids clothing.",            ex:["Pampers diapers","Baby stroller","Kids shoes"]},
  {id:"toys",       icon:"🧸", name:"Toys & Games",           desc:"Toys, puzzles, board games, RC cars.",          ex:["Lego set","RC car","Board game"]},
  {id:"sports",     icon:"🏏", name:"Sports & Fitness",       desc:"Cricket gear, gym equipment, yoga.",            ex:["Cricket bat","Dumbbell set","Yoga mat"]},
  {id:"books",      icon:"📚", name:"Books & Stationery",     desc:"Books, notebooks, pens, art supplies.",         ex:["Atomic Habits","Notebook pack","Gel pens"]},
  {id:"auto",       icon:"🚗", name:"Auto & Bike Accessories",desc:"Car care, helmets, tools, covers.",             ex:["Bike helmet","Car vacuum cleaner","Dash camera"]},
  {id:"other",      icon:"🛍️", name:"Anything Else",          desc:"Any other product you can think of.",           ex:["Power bank","LED bulb","Water bottle"]}
];

/* t: pk = Pakistani store, used = second hand, intl = international */
const STORES = [
  {n:"Daraz", t:"pk", cats:["all"], dom:"daraz.pk", d:"Biggest online marketplace in Pakistan. Cash on delivery in most cities.", find:q=>`https://www.daraz.pk/catalog/?q=${q}`},
  {n:"PriceOye", t:"pk", cats:["mobiles","electronics","laptops"], dom:"priceoye.pk", d:"Mobiles and gadgets with price comparison.", find:q=>`https://priceoye.pk/search?q=${q}`},
  {n:"Telemart", t:"pk", cats:["laptops","electronics","gaming","appliances"], dom:"telemart.pk", d:"Laptops, PC parts, gaming and electronics."},
  {n:"Shophive", t:"pk", cats:["laptops","mobiles","electronics","gaming"], dom:"shophive.com", d:"Laptops, mobiles and accessories."},
  {n:"Mega.pk", t:"pk", cats:["mobiles","electronics","appliances"], dom:"mega.pk", d:"Mobile phones, electronics and home appliances."},
  {n:"Homeshopping.pk", t:"pk", cats:["electronics","home","appliances","beauty","other"], dom:"homeshopping.pk", d:"General online store with many categories."},
  {n:"Goto.com.pk", t:"pk", cats:["womens","mens","beauty","jewelry","bags","watches"], dom:"goto.com.pk", d:"Fashion, beauty and lifestyle products."},
  {n:"Khaadi", t:"pk", cats:["womens","mens","baby"], dom:"khaadi.com", d:"Pakistani clothing brand with its own online shop."},
  {n:"Sapphire", t:"pk", cats:["womens","mens","home","baby"], dom:"pk.sapphireonline.pk", d:"Fashion and home textiles from a Pakistani brand."},
  {n:"Outfitters", t:"pk", cats:["mens","womens"], dom:"outfitters.com.pk", d:"Western-style fashion for men and women."},
  {n:"Junaid Jamshed (J.)", t:"pk", cats:["mens","womens","beauty"], dom:"junaidjamshed.com", d:"Clothing, fragrances and accessories."},
  {n:"Gul Ahmed", t:"pk", cats:["womens","mens","home"], dom:"gulahmedshop.com", d:"Lawn, clothing and home textiles."},
  {n:"Breakout", t:"pk", cats:["mens","womens"], dom:"breakout.com.pk", d:"Everyday fashion for men and women."},
  {n:"Bata Pakistan", t:"pk", cats:["shoes","bags"], dom:"bata.com.pk", d:"Shoes and bags from a well known brand."},
  {n:"Stylo Shoes", t:"pk", cats:["shoes","bags"], dom:"stylo.pk", d:"Footwear and bags for men, women and kids."},
  {n:"Naheed Supermarket", t:"pk", cats:["grocery","home","baby","beauty"], dom:"naheed.pk", d:"Groceries and household items."},
  {n:"Metro Online", t:"pk", cats:["grocery","home","appliances"], dom:"metro-online.pk", d:"Groceries, home items and appliances."},
  {n:"Carrefour Pakistan", t:"pk", cats:["grocery","home","appliances","baby"], dom:"carrefour.pk", d:"Groceries, home and baby items."},
  {n:"Imtiaz Super Market", t:"pk", cats:["grocery"], dom:"imtiaz.com.pk", d:"Daily grocery shopping."},
  {n:"DVAGO", t:"pk", cats:["health","beauty","baby"], dom:"dvago.pk", d:"Medicines, health and personal care."},
  {n:"Instagram & Facebook shops", t:"pk", cats:["womens","jewelry","beauty","haircare","bags","watches","shoes","toys"], dom:"instagram.com", d:"Many small Pakistani sellers. Always check seller reviews before paying."},
  {n:"OLX Pakistan", t:"used", cats:["all"], dom:"olx.com.pk", d:"Used or second-hand deals. Meet in person and check before paying.", find:q=>`https://www.olx.com.pk/items/q-${q}`},
  {n:"AliExpress", t:"intl", cats:["all"], dom:"aliexpress.com", d:"Low prices. Delivery to Pakistan takes weeks and customs may apply.", find:q=>`https://www.aliexpress.com/wholesale?SearchText=${q}`},
  {n:"Amazon", t:"intl", cats:["all"], dom:"amazon.com", d:"Check if the item ships to Pakistan. Many do not.", find:q=>`https://www.amazon.com/s?k=${q}`},
  {n:"Temu", t:"intl", cats:["all"], dom:"temu.com", d:"Very cheap items. Check delivery to Pakistan first.", find:q=>`https://www.temu.com/search_result.html?search_key=${q}`}
];
STORES.forEach(s => { s.search = q => s.find ? s.find(q) : `https://www.google.com/search?q=${q}+site:${s.dom}`; s.home = `https://${s.dom}`; });

const SOURCES = [
  {n:"YouTube Reviews", i:"▶️", u:q=>`https://www.youtube.com/results?search_query=${q}+review`},
  {n:"Google Reviews",  i:"🔎", u:q=>`https://www.google.com/search?q=${q}+review+Pakistan`},
  {n:"Instagram",       i:"📸", u:q=>`https://www.google.com/search?q=${q}+review+site:instagram.com`},
  {n:"Facebook Groups", i:"👥", u:q=>`https://www.google.com/search?q=${q}+review+site:facebook.com`},
  {n:"Reddit",          i:"💬", u:q=>`https://www.reddit.com/search/?q=${q}+review`},
  {n:"Price in Pakistan",i:"📉", u:q=>`https://www.google.com/search?q=${q}+price+in+Pakistan`}
];

const TYPE_ORDER = {pk:0, used:1, intl:2};
const badgeFor = t => t === "pk" ? '<span class="badge b-pk">Pakistan store</span>' : t === "used" ? '<span class="badge b-used">Used / local</span>' : '<span class="badge b-intl">Check delivery</span>';
const catById = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const storesFor = cat => STORES.filter(s => s.cats.includes("all") || s.cats.includes(cat)).sort((a, b) => TYPE_ORDER[a.t] - TYPE_ORDER[b.t]);

/* ============ SHARED LAYOUT ============ */
function buildLayout(){
  const page = location.pathname.split("/").pop() || "index.html";
  const links = [["index.html","Home"],["categories.html","Categories"],["stores.html","Stores"],["how-it-works.html","How it Works"],["tips.html","Safe Shopping"],["about.html","About"]];
  const header = `
  <header class="site-header"><div class="wrap nav">
    <a class="logo" href="index.html"><i class="mark">S</i><span>Smart<b>Buy</b> PK</span></a>
    <nav class="menu" id="menu">
      ${links.map(([h,t]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t}</a>`).join("")}
      <a class="cta" href="finder.html">Check a product</a>
    </nav>
    <button class="theme" id="themeBtn" aria-label="Switch light or dark theme" title="Switch theme">🌙</button>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false">☰</button>
  </div></header>`;
  const topCats = CATEGORIES.slice(0, 6).map(c => `<a href="finder.html?cat=${c.id}">${c.name}</a>`).join("");
  const footer = `
  <footer class="site-footer"><div class="wrap">
    <div class="foot">
      <div>
        <a class="logo" href="index.html"><i class="mark">S</i><span>Smart<b>Buy</b> PK</span></a>
        <p>Your smart shopping guide for Pakistan. Find where to buy, compare prices and check reviews before you pay.</p>
      </div>
      <div><h4>Explore</h4><a href="index.html">Home</a><a href="finder.html">Check a product</a><a href="categories.html">All categories</a><a href="stores.html">Stores directory</a></div>
      <div><h4>Popular categories</h4>${topCats}</div>
      <div><h4>Help</h4><a href="how-it-works.html">How it works</a><a href="tips.html">Safe shopping tips</a><a href="about.html">About us</a><a href="contact.html">Contact</a></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} SmartBuy PK. All rights reserved.</span><span>Prices and ratings come from the stores. Always double check before paying.</span></div>
  </div></footer>`;
  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);

  const root = document.documentElement, btn = $("#themeBtn");
  const isDark = () => root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  const sync = () => { btn.textContent = isDark() ? "☀️" : "🌙"; };
  sync();
  btn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    ls.set("sb-theme", root.dataset.theme); sync();
  });
  /* remember the product a visitor clicked, in case the page address loses its ?q= part */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href*="finder.html?"]');
    if(!a) return;
    const u = new URL(a.getAttribute("href"), location.href);
    ls.set("sb-pending", {q:u.searchParams.get("q") || "", cat:u.searchParams.get("cat") || ""});
  });
  const burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
}

/* ============ HOME ============ */
function initHome(){
  $("#heroCat").innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
  $("#heroForm").addEventListener("submit", e => {
    e.preventDefault();
    ls.set("sb-pending", {q:$("#heroQ").value.trim(), cat:$("#heroCat").value});
    location.href = `finder.html?q=${enc($("#heroQ").value.trim())}&cat=${$("#heroCat").value}`;
  });
  $("#statCats").textContent = CATEGORIES.length;
  $("#statStores").textContent = STORES.length;
  $("#statSources").textContent = SOURCES.length;
  $("#popular").innerHTML = CATEGORIES.slice(0, 8).map(c =>
    `<a class="card hover" href="finder.html?cat=${c.id}"><span class="ico">${c.icon}</span><h3>${c.name}</h3><p>${c.desc}</p></a>`).join("");
  const recent = ls.get("sb-recent", []);
  if(recent.length){
    $("#recentBox").classList.remove("hidden");
    $("#recent").innerHTML = recent.map(r => `<a class="chip dark" href="finder.html?q=${enc(r.q)}&cat=${r.cat}">${catById(r.cat).icon} ${esc(r.q)}</a>`).join("");
  }
}

/* ============ FINDER ============ */
let st = {name:"", cat:"other", budget:0, prio:"balanced", stores:[]};

function renderStores(){
  const box = $("#stores"); box.innerHTML = "";
  const q = enc(st.name);
  st.stores.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "store"; div.id = "store" + i;
    div.innerHTML = `
      <h4>${s.n} ${badgeFor(s.t)}</h4>
      <p>${s.d}</p>
      <div class="mini">
        <div><label>Price (PKR)</label><input type="number" min="0" data-i="${i}" data-k="price" value="${s.price || ""}"></div>
        <div><label>Rating (0-5)</label><input type="number" min="0" max="5" step="0.1" data-i="${i}" data-k="rating" value="${s.rating || ""}"></div>
        <div><label>Reviews</label><input type="number" min="0" data-i="${i}" data-k="count" value="${s.count || ""}"></div>
      </div>
      <a class="open" target="_blank" rel="noopener" href="${s.search(q)}">Search here ↗</a>`;
    box.appendChild(div);
  });
  $$("input", box).forEach(inp => inp.addEventListener("input", e => {
    const i = +e.target.dataset.i, k = e.target.dataset.k;
    st.stores[i][k] = e.target.value === "" ? null : parseFloat(e.target.value);
    judge();
  }));
}

function startCheck(name, cat, budget, prio, imgSrc, sample){
  st = {name, cat, budget, prio, stores: storesFor(cat).map(s => ({...s, price:null, rating:null, count:null}))};
  if(sample){
    const demo = [[42999,4.5,860],[44500,4.3,320],[39999,3.9,45],[47000,4.4,150],[28000,4.8,3]];
    st.stores.slice(0, 5).forEach((s, i) => { [s.price, s.rating, s.count] = demo[i]; });
  }
  const c = catById(cat);
  $("#productCard").innerHTML = (imgSrc ? `<img src="${imgSrc}" alt="Product picture">` : `<div class="ph">${c.icon}</div>`) +
    `<div><h3>${esc(name)}</h3><span class="tag">${c.name}</span>
     ${budget ? `<span class="tag">Budget: PKR ${budget.toLocaleString()}</span>` : ""}
     <span class="tag">Priority: ${prio}</span></div>`;
  renderStores();
  const q = enc(name);
  $("#sources").innerHTML = SOURCES.map(s => `<a class="src" target="_blank" rel="noopener" href="${s.u(q)}"><span class="ic">${s.i}</span>${s.n}</a>`).join("");
  $("#results").classList.remove("hidden");
  judge();
  $("#results").scrollIntoView({behavior:"smooth"});
  if(!sample){
    const rec = ls.get("sb-recent", []).filter(r => r.q.toLowerCase() !== name.toLowerCase());
    rec.unshift({q:name, cat}); ls.set("sb-recent", rec.slice(0, 6));
  }
}

function judge(){
  const rows = st.stores.map((s, i) => ({...s, i})).filter(s => s.price > 0 && s.rating > 0);
  const V = $("#verdict"), C = $("#compare");
  $$(".store").forEach(e => e.classList.remove("best"));
  if(!rows.length){
    V.className = "verdict v-none";
    V.innerHTML = "<h3>Waiting for data</h3><p>Fill price and rating for at least one store.</p>";
    C.innerHTML = ""; return;
  }
  const prices = rows.map(r => r.price), minP = Math.min(...prices), avgP = prices.reduce((a, b) => a + b, 0) / prices.length;
  const w = st.prio === "price" ? [0.7, 0.3] : st.prio === "quality" ? [0.3, 0.7] : [0.5, 0.5];
  rows.forEach(r => {
    const trust = Math.min(1, Math.log10((r.count || 0) + 1) / 2.5);
    const quality = (r.rating / 5) * (0.6 + 0.4 * trust);
    r.score = Math.round((w[0] * (minP / r.price) + w[1] * quality) * 100);
    r.flags = [];
    if((r.count || 0) < 10) r.flags.push("Very few reviews, the rating is not reliable");
    if(rows.length > 1 && r.price < avgP * 0.65) r.flags.push("Price is much lower than the others. Be careful of fake or low quality items");
    if(st.budget && r.price > st.budget) r.flags.push("Above your budget");
    if(r.rating < 3.5) r.flags.push("Low rating");
    if(r.t === "intl") r.flags.push("International store: delivery time and customs charges");
  });
  rows.sort((a, b) => b.score - a.score);
  const best = rows[0];
  $("#store" + best.i).classList.add("best");
  let cls = "v-ok", title = "Okay, but think first";
  const serious = best.flags.some(f => f.startsWith("Low") || f.startsWith("Very few") || f.startsWith("Price is much"));
  if(best.rating >= 4.2 && (best.count || 0) >= 50 && !serious && !(st.budget && best.price > st.budget)){ cls = "v-good"; title = "Good buy ✅"; }
  else if(best.rating < 3.5 || (st.budget && best.price > st.budget * 1.2)){ cls = "v-bad"; title = "Not recommended ❌"; }
  V.className = "verdict " + cls;
  V.innerHTML = `<h3>${title}</h3>
    <p>Best option: <b>${best.n}</b> at <b>PKR ${best.price.toLocaleString()}</b> with rating <b>${best.rating}/5</b>${best.count ? ` from ${best.count} reviews` : ""}. Score: ${best.score}/100.</p>
    ${best.flags.length ? `<ul>${best.flags.map(f => `<li>${f}</li>`).join("")}</ul>` : "<ul><li>No warning signs found in the numbers you entered.</li></ul>"}`;
  C.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Store</th><th>Price (PKR)</th><th>Rating</th><th>Reviews</th><th>Score</th></tr></thead><tbody>` +
    rows.map(r => `<tr><td>${r.n}</td><td>${r.price.toLocaleString()}</td><td>${r.rating}</td><td>${r.count ?? "-"}</td><td><b>${r.score}</b></td></tr>`).join("") +
    `</tbody></table></div>`;
}

function initFinder(){
  const sel = $("#cat");
  sel.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
  const p = new URLSearchParams(location.search);
  if(!p.get("q") && !p.get("cat")){
    const pend = ls.get("sb-pending", null);
    if(pend){ if(pend.q) p.set("q", pend.q); if(pend.cat) p.set("cat", pend.cat); }
  }
  ls.set("sb-pending", null);
  if(CATEGORIES.some(c => c.id === p.get("cat"))) sel.value = p.get("cat");
  if(p.get("q")) $("#name").value = p.get("q");
  $("#form").addEventListener("submit", e => {
    e.preventDefault();
    const f = $("#img").files[0];
    const go = src => startCheck($("#name").value.trim(), sel.value, parseInt($("#budget").value) || 0, $("#prio").value, src, false);
    if(f){ const r = new FileReader(); r.onload = ev => go(ev.target.result); r.readAsDataURL(f); } else go(null);
  });
  $("#demo").addEventListener("click", () => {
    $("#name").value = "Samsung Galaxy A15"; sel.value = "mobiles"; $("#budget").value = 45000; $("#prio").value = "balanced";
    startCheck("Samsung Galaxy A15", "mobiles", 45000, "balanced", null, true);
  });
  if(p.get("q")) startCheck(p.get("q"), sel.value, 0, "balanced", null, false);
}

/* ============ CATEGORIES PAGE ============ */
function initCategories(){
  const box = $("#catGrid"), input = $("#catSearch");
  const draw = () => {
    const t = input.value.trim().toLowerCase();
    const list = CATEGORIES.filter(c => !t || (c.name + " " + c.desc + " " + c.ex.join(" ")).toLowerCase().includes(t));
    box.innerHTML = list.length ? list.map(c => `
      <div class="card hover">
        <span class="ico">${c.icon}</span><h3>${c.name}</h3><p>${c.desc}</p>
        <div style="margin:10px 0 12px">${c.ex.map(x => `<a class="chip dark" href="finder.html?q=${enc(x)}&cat=${c.id}">${x}</a>`).join(" ")}</div>
        <a class="btn ghost" href="finder.html?cat=${c.id}">Check in this category</a>
      </div>`).join("") : '<p class="empty">No category found. Try "Anything Else".</p>';
  };
  input.addEventListener("input", draw); draw();
}

/* ============ STORES PAGE ============ */
function initStores(){
  const sel = $("#storeCat"), input = $("#storeSearch"), box = $("#storeGrid");
  sel.innerHTML = '<option value="">All categories</option>' + CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
  let type = "all";
  const draw = () => {
    const t = input.value.trim().toLowerCase(), cat = sel.value;
    const list = STORES.filter(s => (type === "all" || s.t === type) &&
      (!cat || s.cats.includes("all") || s.cats.includes(cat)) &&
      (!t || (s.n + " " + s.d).toLowerCase().includes(t)));
    $("#storeCount").textContent = list.length + (list.length === 1 ? " store" : " stores");
    box.innerHTML = list.length ? list.map(s => `
      <div class="card hover">
        <h3 style="display:flex;justify-content:space-between;gap:8px;align-items:center">${s.n} ${badgeFor(s.t)}</h3>
        <p>${s.d}</p>
        <div style="margin:10px 0">${s.cats.includes("all") ? '<span class="tag">All categories</span>' : s.cats.slice(0, 4).map(c => `<span class="tag">${catById(c).name}</span>`).join("")}</div>
        <a class="btn ghost" target="_blank" rel="noopener" href="${s.home}">Visit store ↗</a>
      </div>`).join("") : '<p class="empty">No store matches your filters.</p>';
  };
  $$("[data-type]").forEach(b => b.addEventListener("click", () => {
    type = b.dataset.type;
    $$("[data-type]").forEach(x => x.classList.toggle("on", x === b)); draw();
  }));
  input.addEventListener("input", draw); sel.addEventListener("change", draw); draw();
}

/* ============ SAFE SHOPPING CHECKLIST ============ */
function initTips(){
  const boxes = $$(".check input");
  const upd = () => {
    const n = boxes.filter(b => b.checked).length;
    $("#progText").textContent = `${n} of ${boxes.length} checks done`;
    $("#progBar").style.width = (n / boxes.length * 100) + "%";
    boxes.forEach(b => b.closest(".check").classList.toggle("done", b.checked));
  };
  boxes.forEach(b => b.addEventListener("change", upd)); upd();
}

/* ============ CONTACT ============ */
function initContact(){
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    $("#thanks").classList.remove("hidden");
    e.target.reset();
    $("#thanks").scrollIntoView({behavior:"smooth", block:"center"});
  });
}

/* ============ BOOT ============ */
document.addEventListener("DOMContentLoaded", () => {
  buildLayout();
  const init = {home:initHome, finder:initFinder, categories:initCategories, stores:initStores, tips:initTips, contact:initContact}[document.body.dataset.page];
  if(init) init();
});
