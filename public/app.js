// App: renders products and about; reads banner image from server/localStorage
const LS_KEY = 'swag_site_data_v2';
const CART_KEY = 'swag_cart_v1';

const defaultData = {
  about: `
<h2>Our mission</h2>
<p>At <strong>swag.</strong> we design modern electronics that feel personal — elegant products that simplify daily life while looking beautiful.</p>
<div class="about-grid">
  <div class="about-card-lg">
    <h3>Design-forward</h3>
    <p>We prioritize thoughtful materials, refined finishes, and lasting usability.</p>
  </div>
  <div class="about-card">
    <h4>Accessible</h4>
    <p>Easy-to-use interfaces and considerate accessibility features.</p>
  </div>
  <div class="about-card">
    <h4>Sustainable</h4>
    <p>Durable devices with recyclable packaging and responsible sourcing.</p>
  </div>
  <div class="about-card">
    <h4>Community</h4>
    <p>Education-focused partnerships and developer-friendly platforms.</p>
  </div>
</div>
<p class="about-cta">Want to collaborate or learn more? <a href="mailto:hello@swag.example">hello@swag.example</a></p>
`,
  products:[
    {id:1,name:"Swag Studio Console",price:249,img:"swaglogo.jpg",short:"Hybrid learning & play console",long:"A compact hybrid console built for education and entertainment."},
    {id:2,name:"Swag Studio Pro Headphones",price:199,img:"swaglogo.jpg",short:"Active noise-canceling",long:"Comfortable premium sound for all-day listening."},
    {id:3,name:"Swag Portable Charger",price:49,img:"swaglogo.jpg",short:"Fast, small, reliable",long:"High-speed charging for your devices on the go."},
    {id:4,name:"Swag Protective Case",price:29,img:"swaglogo.jpg",short:"Sleek protective shell",long:"Durable case with a soft-touch finish."}
  ],
  banner: {image: "swaglogo.jpg", text: "Official site — free shipping on first order"}
};

function loadData(){ try{ const r = localStorage.getItem(LS_KEY); return r?JSON.parse(r):defaultData; }catch(e){return defaultData;} }
function saveData(d){ localStorage.setItem(LS_KEY, JSON.stringify(d)); }
function addToCart(pid){ const cart = JSON.parse(localStorage.getItem(CART_KEY)||'[]'); cart.push(pid); localStorage.setItem(CART_KEY, JSON.stringify(cart)); alert('Added to cart'); }

function renderProducts(){
  const data = loadData();
  const grid = document.getElementById('productGrid'); grid.innerHTML='';
  data.products.forEach(p=>{
    const div = document.createElement('div'); div.className='card reveal';
    div.innerHTML = `<img src="${p.img}" alt="${p.name}"/><div><h3>${p.name}</h3><p>${p.short}</p></div><div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:800">${p.price>0?('$'+p.price):'—'}</div><div><button class="btn btn-primary" data-id="${p.id}">Buy</button></div></div>`;
    grid.appendChild(div);
  });
  document.querySelectorAll('.card .btn').forEach(b=> b.addEventListener('click', (e)=>{ const id = +b.getAttribute('data-id'); addToCart(id); e.stopPropagation(); }));
  document.querySelectorAll('.card').forEach(card=> card.addEventListener('click', ()=> { const name = card.querySelector('h3').innerText; alert(name); }));
}

function renderAbout(){ const data = loadData(); const aboutEl = document.getElementById('aboutCard'); aboutEl.innerHTML = data.about || ''; }

function renderBanner(){
  const data = loadData();
  const banner = document.getElementById('top-banner');
  if(banner && data.banner && data.banner.image){
    banner.style.backgroundImage = `url('${data.banner.image}')`;
    const bt = document.getElementById('bannerText');
    if(bt) bt.innerText = data.banner.text || '';
  }
}

function initReveal(){ const els=document.querySelectorAll('.reveal'); const obs=new IntersectionObserver((entries)=>{entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); obs.unobserve(en.target);} }); },{threshold:0.12}); els.forEach(el=>obs.observe(el)); }

// Try server API for dynamic content; otherwise use local
fetch('/api/products').then(r=>r.json()).then(ps=>{ if(Array.isArray(ps) && ps.length){ const d = loadData(); d.products = ps.map(p=>({id:p.id,name:p.name,price:p.price,img:p.img||'swaglogo.jpg',short:p.description||'',long:p.description||''})); saveData(d); renderProducts(); renderAbout(); renderBanner(); initReveal(); }}).catch(()=>{ renderProducts(); renderAbout(); renderBanner(); initReveal(); });

// init Three.js (keeps the same as before, simple geometry)
(function initThree(){ try{ const canvas = document.getElementById('heroCanvas'); const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true}); renderer.setPixelRatio(window.devicePixelRatio); const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth/canvas.clientHeight, 0.1, 1000); camera.position.z = 3.2; const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5,5,5); scene.add(light); const geo = new THREE.TorusKnotGeometry(0.6,0.18,128,32); const mat = new THREE.MeshStandardMaterial({color:0x111111, metalness:0.6, roughness:0.3}); const mesh = new THREE.Mesh(geo, mat); scene.add(mesh); function onResize(){ const w = canvas.clientWidth; const h = canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix(); } onResize(); window.addEventListener('resize', onResize); let t=0; function anim(){ t += 0.01; mesh.rotation.x = 0.3*t; mesh.rotation.y = 0.6*t; mesh.position.y = Math.sin(t)*0.08; renderer.render(scene,camera); requestAnimationFrame(anim); } anim(); }catch(e){ console.warn('three init failed', e); } })();

// shop button
document.getElementById('shopBtn').addEventListener('click', ()=>{document.getElementById('products').scrollIntoView({behavior:'smooth'});});
