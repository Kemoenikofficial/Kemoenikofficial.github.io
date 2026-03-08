// ===== STATE =====
const state={
  user:storage.get('k_user',{nama:'',wa:''}),
  kal:storage.get('k_kal',null),
  quiz:storage.get('k_quiz',null),
  eval:storage.get('k_eval',[]),
  misi:storage.get('k_misi',{})
};

// ===== INIT =====
function init(){
  const wa=new URLSearchParams(location.search).get('wa')||storage.get('k_wa');
  const mode=new URLSearchParams(location.search).get('mode');
  
  if(!wa){show('accessScreen');return}
  
  storage.set('k_wa',wa);
  state.user.wa=wa;
  
  if(mode==='new'){storage.del('k_kal');storage.del('k_quiz');storage.del('k_eval');state.kal=null;state.quiz=null;state.eval=[]}
  
  hide('accessScreen');
  show('loadingScreen');
  
  setTimeout(()=>{
    hide('loadingScreen');
    show('app');
    renderAll();
  },800);
}

// ===== NAVIGATION =====
function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.bn').forEach(b=>b.classList.remove('on'));
  document.getElementById('page-'+page)?.classList.add('on');
  document.getElementById('bn-'+page)?.classList.add('on');
  if(page==='profil')renderProfil();
  scrollTo(0,0);
}

function openDrawer(){document.getElementById('drawer').classList.add('on');document.getElementById('overlay').classList.add('on')}
function closeDrawer(){document.getElementById('drawer').classList.remove('on');document.getElementById('overlay').classList.remove('on')}
function openPanel(id){document.getElementById(id).classList.add('on')}
function closeModal(id){document.getElementById(id).classList.remove('on')}
function openBeli(){openPanel('modalBeli')}
function scrollToFaq(){go('home');setTimeout(()=>document.getElementById('faqSection')?.scrollIntoView({behavior:'smooth'}),200)}
function goToAktivitas(){location.href='https://kemoenikofficial.github.io/aktivitas/'}

// ===== RENDER =====
function renderAll(){
  // Hero
  document.getElementById('userName').textContent=state.kal?.nama?.split(' ')[0]||'—';
  document.getElementById('dName').textContent=state.kal?.nama||'—';
  document.getElementById('heroName').textContent=state.quiz?.name||'—';
  document.getElementById('heroBadge').textContent=state.quiz?.metodeName||'—';
  document.getElementById('statKkal').textContent=state.kal?Math.round(state.kal.cal).toLocaleString():'—';
  document.getElementById('statMinggu').textContent=state.kal?state.kal.mg+'mg':'—';
  document.getElementById('statMetode').textContent=state.quiz?.metode||'—';
  
  // Progress
  if(state.kal){
    const start=new Date(state.kal.date),now=new Date();
    const day=Math.max(1,Math.floor((now-start)/(864e5))+1);
    const total=state.kal.mg*7;
    const pct=Math.min(100,Math.round(day/total*100));
    document.getElementById('progHari').textContent=day;
    document.getElementById('progTotal').textContent=total;
    document.getElementById('progPct').textContent=pct+'%';
    document.getElementById('progFill').style.width=pct+'%';
  }
  
  // Missions
  const ml=document.getElementById('missionList');
  ml.innerHTML=missions.map(m=>{
    const done=state.misi[m.id];
    return `<div class="mission-item ${done?'done':''}" onclick="toggleMisi('${m.id}')">
      <div class="mission-check">${done?'✓':''}</div>
      <div class="mission-text">
        <div class="mission-name">${m.icon} ${esc(m.name)}</div>
        <div class="mission-sub">${esc(m.sub)} · <span style="color:var(--${m.tag==='Herbal'?'gold':'green'})">${m.tag}</span></div>
      </div>
    </div>`;
  }).join('');
  
  // FAQ
  const fq=document.getElementById('faqSection');
  fq.innerHTML='<div class="sec-title">FAQ</div>'+faqData.map((c,ci)=>`
    <div class="acc" onclick="toggle(this)">
      <div class="acc-hd">${esc(c.cat)}</div>
      <div class="acc-body">${c.items.map(i=>`<p><strong>Q:</strong> ${esc(i.q)}<br><strong>A:</strong> ${esc(i.a)}</p>`).join('')}</div>
    </div>
  `).join('');
}

function renderProfil(){
  const empty=document.getElementById('profilEmpty');
  const content=document.getElementById('profilContent');
  if(!state.quiz){empty.style.display='block';content.style.display='none';return}
  empty.style.display='none';content.style.display='block';
  
  const t=quizTypes.find(x=>x.id===state.quiz.id);
  document.getElementById('traitBody').innerHTML=t.tips.map(tip=>`<p>✓ ${esc(tip)}</p>`).join('');
  document.getElementById('tipeBody').innerHTML=`
    <div style="background:${t.metode==='agresif'?'#FEF2F2':t.metode==='ringan'?'#FFFBEB':'#F0FDF4'};padding:16px;border-radius:16px;margin-bottom:12px">
      <div style="font-size:32px">${t.emoji}</div>
      <div style="font-family:var(--font-display);font-size:20px;font-weight:700">${esc(t.name)}</div>
      <div style="font-size:13px;opacity:0.8">${esc(t.tagline)}</div>
    </div>
    <p><strong>Metode:</strong> ${esc(t.metodeName)}</p>
    <p><strong>Skor:</strong> ${t.skor}%</p>
    <p><strong>Hindari:</strong> ${esc(t.hindari)}</p>
    <p><strong>Anjuran:</strong> ${esc(t.anjuran)}</p>
  `;
}

// ===== ACTIONS =====
function toggle(el){el.classList.toggle('on')}
function toggleMisi(id){
  state.misi[id]=!state.misi[id];
  storage.set('k_misi',state.misi);
  renderAll();
}

// ===== KALKULATOR =====
function hitungKal(){
  const nama=document.getElementById('inNama').value.trim();
  const usia=+document.getElementById('inUsia').value;
  const berat=+document.getElementById('inBerat').value;
  const tinggi=+document.getElementById('inTinggi').value;
  const akt=+document.getElementById('inAktivitas').value;
  const target=+document.getElementById('inTarget').value;
  
  if(!nama||usia<10||berat<30||tinggi<100||target<30||target>=berat){
    alert('Lengkapi data dengan benar!');return;
  }
  
  // BMR Mifflin-St Jeor
  const bmr=10*berat+6.25*tinggi-5*usia-161;
  const tdee=Math.round(bmr*akt);
  const defisit=tdee-500;
  const sel=berat-target;
  const mg=Math.ceil(sel/0.5);
  const date=new Date();
  
  state.kal={
    nama,usia,berat,tinggi,akt,target,
    cal:defisit,tdee,bmr,mg,sel,
    date:date.toISOString(),
    dateStr:fmtDate(date)
  };
  
  storage.set('k_kal',state.kal);
  storage.set('k_user',{...state.user,nama});
  
  document.getElementById('hasilKal').innerHTML=`
    <div style="background:linear-gradient(135deg,var(--green),var(--green3));color:#fff;padding:20px;border-radius:16px">
      <div style="font-size:28px;font-weight:800">${Math.round(defisit).toLocaleString()} kkal</div>
      <div style="font-size:13px;opacity:0.8">Target harian</div>
      <div style="margin-top:12px;font-size:16px">${mg} minggu program</div>
      <div style="font-size:13px;opacity:0.8">Mulai: ${fmtDate(date)}</div>
    </div>
  `;
  show('hasilKal');
}

// ===== QUIZ =====
let qIdx=0,qScores=[0,0,0,0,0,0,0],qSel=null;

function startQuiz(){
  qIdx=0;qScores=[0,0,0,0,0,0,0];
  hide('quizIntro');show('quizRun');
  renderQ();
}

function renderQ(){
  const q=quizQuestions[qIdx];
  document.getElementById('qNum').textContent=(qIdx+1)+'/15';
  document.getElementById('qFill').style.width=(qIdx/15*100)+'%';
  document.getElementById('qText').textContent=q.text;
  document.getElementById('qOptions').innerHTML=q.options.map((o,i)=>`
    <div class="quiz-option ${qSel===i?'sel':''}" onclick="selQ(${i})">
      <span style="font-size:24px">${o.emoji}</span> ${esc(o.text)}
    </div>
  `).join('');
  document.getElementById('btnNext').disabled=qSel===null;
  document.getElementById('btnNext').textContent=qIdx===14?'Lihat Hasil':'Lanjut';
}

function selQ(i){
  qSel=i;
  renderQ();
}

function nextQ(){
  if(qSel===null)return;
  quizQuestions[qIdx].options[qSel].scores.forEach((s,i)=>qScores[i]+=s);
  qIdx++;
  qSel=null;
  if(qIdx>=14){
    const maxI=qScores.indexOf(Math.max(...qScores));
    const t=quizTypes[maxI];
    state.quiz={id:t.id,name:t.name,metode:t.metode,metodeName:t.metodeName,skor:t.skor};
    document.getElementById('rTipe').textContent='Tipe: '+t.name+' '+t.emoji;
    document.getElementById('rDesc').textContent=t.tagline;
    hide('quizRun');show('quizResult');
  }else{
    renderQ();
  }
}

function saveQuiz(){
  storage.set('k_quiz',state.quiz);
  go('profil');
  setTimeout(()=>renderAll(),100);
}

// ===== UTILS =====
function show(id){document.getElementById(id).style.display='flex'}
function hide(id){document.getElementById(id).style.display='none'}

// ===== START =====
document.addEventListener('DOMContentLoaded',init);
