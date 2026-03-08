// Escape HTML
function esc(str){return str?String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'):''}

// Set HTML aman
function setHTML(el,html){if(!el)return;el.innerHTML='';const t=document.createElement('div');t.innerHTML=html;while(t.firstChild)el.appendChild(t.firstChild)}

// Format tanggal ID
function fmtDate(d){return d.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}

// Get today string
function todayStr(){return new Date().toISOString().split('T')[0]}

// Debounce
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}

// Storage helpers
const storage={
  get:(k,d=null)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  del:k=>{try{localStorage.removeItem(k)}catch(e){}}
};
