
/*
  Google Sheets integration:
  1) Deploy the companion AIM_Sheets_Backend.gs as a Web App.
  2) Set the deployed /exec URL below.
*/
const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwLGDqOxhKUnICOnj23D8_-_n20NPf64AiSR7iFNMxceXdoRqHYo00x_K2fiQK07fxFyw/exec';
const SHEET_NAME = 'Sheet1';

const slideData=[
  {t:'Cover', act:'Act I · Foundation', teaser:'AIM at a glance'},
  {t:'Strategic idea', act:'Act I · Foundation', teaser:'Influence in, acquisition out'},
  {t:'Why AIM', act:'Act I · Foundation', teaser:'Closing the content-to-outcome gap'},
  {t:'Scale path', act:'Act II · Mechanics', teaser:'Employee pilot to public ecosystem'},
  {t:'Referral economics', act:'Act II · Mechanics', teaser:'Rp250K per qualifying customer'},
  {t:'Attribution', act:'Act II · Mechanics', teaser:'One journey, one source of truth'},
  {t:'Risk boundary', act:'Act III · Controls', teaser:'AIM vs. BAU Risk &amp; Fraud'},
  {t:'Content governance', act:'Act III · Controls', teaser:'Upload → AI check → human check → approved'},
  {t:'Governance', act:'Act III · Controls', teaser:'Function-by-function ownership'},
  {t:'Budget governance', act:'Act III · Controls', teaser:'Forecast from actual volume'},
  {t:'Disputes', act:'Act IV · Resolution', teaser:'One owner, 5–10 day SLA'},
  {t:'Corrective payment', act:'Act IV · Resolution', teaser:'PIC + Finance, BoD as backstop'},
  {t:'Ripple Effect', act:'Act V · Vision', teaser:'The long-term network vision'},
  {t:'Alignment', act:'Act V · Vision', teaser:'Five items to close before launch'},
  {t:'Closing', act:'Act V · Vision', teaser:'Build. Measure. Scale.'},
  {t:'Meeting notes', act:'Act VI · Notes', teaser:'Capture live questions to Sheet1'}
];
const actColors={'Act I · Foundation':'#023047','Act II · Mechanics':'#f38000','Act III · Controls':'#f9ca67','Act IV · Resolution':'#ffaf03','Act V · Vision':'#cadfd8','Act VI · Notes':'#7c8f89'};

let i=0;
const slides=[...document.querySelectorAll('.slide')];

/* ---- build left rail ---- */
const rail=document.getElementById('rail');


slideData.forEach((d,k)=>{
  const seg=document.createElement('div');
  seg.className='rail-seg';
  seg.dataset.idx=k;
  seg.innerHTML=`<span class="bar" style="background:${actColors[d.act]}"></span><span class="info"><span class="n">${String(k+1).padStart(2,'0')}</span><span class="t">${d.t}</span><span class="a">${d.act.split('·')[0].trim()}</span></span>`;
  seg.onclick=()=>show(k);
  rail.appendChild(seg);
});
const railSegs=[...rail.querySelectorAll('.rail-seg')];
rail.addEventListener('mouseenter',()=>document.body.classList.add('rail-open'));
rail.addEventListener('mouseleave',()=>document.body.classList.remove('rail-open'));

/* ---- build overview grid ---- */
const tocGrid=document.getElementById('tocGrid');
slideData.forEach((d,k)=>{
  const card=document.createElement('div');
  card.className='toc-card';
  card.style.borderTopColor=actColors[d.act];
  card.style.borderTop='3px solid '+actColors[d.act];
  card.innerHTML=`<div class="tag">${String(k+1).padStart(2,'0')} · ${d.act}</div><h4>${d.t}</h4><p>${d.teaser}</p>`;
  card.onclick=()=>{show(k);closeOverview();};
  tocGrid.appendChild(card);
});


function show(n){
  i=(n+slides.length)%slides.length;
  slides.forEach((s,k)=>s.classList.toggle('active',k===i));
  document.getElementById('counter').textContent=(i+1)+' / '+slides.length;
  document.getElementById('progress').style.width=((i+1)/slides.length*100)+'%';
  railSegs.forEach((s,k)=>s.classList.toggle('current',k===i));
  updateNoteContext();
}
function next(){show(i+1)}
function prev(){show(i-1)}
function toggleFS(){
  if(!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}
function openOverview(){document.getElementById('overview').classList.add('show')}
function closeOverview(){document.getElementById('overview').classList.remove('show')}
function openKbd(){document.getElementById('kbdOverlay').classList.add('show')}
function closeKbd(){document.getElementById('kbdOverlay').classList.remove('show')}

/* ---- meeting notes ---- */
function updateNoteContext(){
  const d=new Date();
  const pageEl=document.getElementById('notePage');
  if(!pageEl)return;
  pageEl.textContent=(i+1)+' / '+slides.length;
  document.getElementById('noteSlide').textContent=(slideData[i]&&slideData[i].t)||'Meeting notes';
  document.getElementById('noteTime').textContent=d.toLocaleString('en-ID',{dateStyle:'medium',timeStyle:'short'});
}
function setStatus(msg){document.getElementById('noteStatus').textContent=msg}
function saveLocalNote(){
  const note=document.getElementById('meetingNote').value.trim();
  if(!note){setStatus('Nothing to save.');return}
  localStorage.setItem('aim_meeting_note_draft',note);
  setStatus('Saved locally in this browser.');
}
function clearNote(){
  document.getElementById('meetingNote').value='';
  localStorage.removeItem('aim_meeting_note_draft');
  setStatus('Cleared.');
}
// ---- cover carousel ----
const heroCarouselImages = [
  'media/image1.png',
  'media/image2.png',
  'media/image3.png',
  'media/image4.png',
  'media/image5.png',
  'media/image6.png'
];
let heroCarouselIndex = 0;

function renderHeroCarousel(){
  const media = document.getElementById('heroCarouselMedia');
  if(!media || !heroCarouselImages.length) return;

  const img = document.createElement('img');
  img.src = heroCarouselImages[heroCarouselIndex];
  img.alt = 'AIM visual ' + (heroCarouselIndex + 1);
  img.draggable = false;
  media.replaceChildren(img);
}

function heroCarouselGo(n){
  heroCarouselIndex = (n + heroCarouselImages.length) % heroCarouselImages.length;
  renderHeroCarousel();
}

function heroCarouselPrev(event){
  if(event){ event.preventDefault(); event.stopPropagation(); }
  heroCarouselGo(heroCarouselIndex - 1);
}

function heroCarouselNext(event){
  if(event){ event.preventDefault(); event.stopPropagation(); }
  heroCarouselGo(heroCarouselIndex + 1);
}

document.addEventListener('DOMContentLoaded',()=>{
  renderHeroCarousel();
});

function submitNote(){
  const note=document.getElementById('meetingNote').value.trim();
  if(!note){setStatus('Please type a question or note first.');return}
  if(!SHEETS_WEB_APP_URL){
    localStorage.setItem('aim_meeting_note_draft',note);
    setStatus('Saved locally. Configure SHEETS_WEB_APP_URL to submit to Sheet1.');
    return;
  }

  const payload={
    sheet:SHEET_NAME,
    note,
    page:i+1,
    slide:(slideData[i]&&slideData[i].t)||'Meeting notes',
    timestamp:new Date().toISOString(),
    source:'AIM Stakeholder Presentation'
  };

  try{
    setStatus('Submitting…');

    // Use a native cross-origin form POST instead of fetch/no-cors.
    // This is more reliable when the presentation is opened as a local .html file.
    const iframe=document.createElement('iframe');
    iframe.name='aimSubmitFrame_'+Date.now();
    iframe.style.display='none';
    document.body.appendChild(iframe);

    const form=document.createElement('form');
    form.method='POST';
    form.action=SHEETS_WEB_APP_URL;
    form.target=iframe.name;
    form.style.display='none';

    Object.entries(payload).forEach(([key,value])=>{
      const input=document.createElement('input');
      input.type='hidden';
      input.name=key;
      input.value=String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(()=>{
      form.remove();
      iframe.remove();
      localStorage.removeItem('aim_meeting_note_draft');
      document.getElementById('meetingNote').value='';
      setStatus('Submitted to Sheet1.');
    },900);
  }catch(err){
    localStorage.setItem('aim_meeting_note_draft',note);
    setStatus('Submission failed. Note saved locally for retry.');
  }
}
const saved=localStorage.getItem('aim_meeting_note_draft');
if(saved){const el=document.getElementById('meetingNote'); if(el) el.value=saved;}

/* ---- process-flow click-to-expand ---- */
document.querySelectorAll('.pf-step').forEach(step=>{
  const detail=step.dataset.detail;
  const box=step.querySelector('.pf-detail');
  if(box && detail) box.textContent=detail;
  step.addEventListener('click',()=>step.classList.toggle('open'));
});

/* ---- referral economics calculator ---- */
const econSlider=document.getElementById('econSlider');
function rupiah(n){return 'Rp'+Math.round(n).toLocaleString('en-US').replace(/,/g,'.')}
function updateEcon(){
  const n=Number(econSlider.value);
  document.getElementById('econCount').textContent=n.toLocaleString('en-US').replace(/,/g,'.');
  document.getElementById('econCreator').textContent=rupiah(n*150000);
  document.getElementById('econCustomer').textContent=rupiah(n*100000);
  document.getElementById('econTotal').textContent=rupiah(n*250000);
}
if(econSlider){econSlider.addEventListener('input',updateEcon);updateEcon();}

/* ---- budget calculator ---- */
const budgetSlider=document.getElementById('budgetSlider');
function updateBudget(){
  const n=Number(budgetSlider.value);
  document.getElementById('budgetCount').textContent=n;
  document.getElementById('budgetDaily').textContent=rupiah(n*250000);
  document.getElementById('budgetMonthly').textContent=rupiah(n*250000*30);
}
if(budgetSlider){budgetSlider.addEventListener('input',updateBudget);updateBudget();}

/* ---- governance table filter ---- */
document.querySelectorAll('.filterbtn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filterbtn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('#govTable tr[data-status]').forEach(row=>{
      row.classList.toggle('hide', f!=='all' && row.dataset.status!==f);
    });
  });
});

/* ---- alignment checklist (persisted) ---- */
const alignKey='aim_alignment_progress';
let alignState={};
try{alignState=JSON.parse(localStorage.getItem(alignKey)||'{}')}catch(e){alignState={}}
function renderAlign(){
  const items=document.querySelectorAll('#alignList .check');
  let done=0;
  items.forEach(it=>{
    const id=it.dataset.id;
    const on=!!alignState[id];
    it.classList.toggle('done',on);
    it.querySelector('.checkbox').textContent=on?'✓':'';
    if(on)done++;
  });
  const prog=document.getElementById('alignProg');
  if(prog) prog.innerHTML=done+' / '+items.length+' marked <span>aligned</span> in this session';
}
document.querySelectorAll('#alignList .check').forEach(it=>{
  it.addEventListener('click',()=>{
    const id=it.dataset.id;
    alignState[id]=!alignState[id];
    localStorage.setItem(alignKey,JSON.stringify(alignState));
    renderAlign();
  });
});
renderAlign();

/* ---- keyboard ---- */
document.addEventListener('keydown',e=>{
  if(e.target && ['TEXTAREA','INPUT','SELECT'].includes(e.target.tagName)){
    if(e.key==='Escape') e.target.blur();
    return;
  }
  if(document.getElementById('overview').classList.contains('show')){
    if(e.key==='Escape') closeOverview();
    return;
  }
  if(document.getElementById('kbdOverlay').classList.contains('show')){
    if(e.key==='Escape') closeKbd();
    return;
  }
  if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();next()}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev()}
  if(e.key==='Home'){show(0)}
  if(e.key==='End'){show(slides.length-1)}
  if(e.key.toLowerCase()==='f') toggleFS();
  if(e.key.toLowerCase()==='n') show(slides.length-1);
  if(e.key.toLowerCase()==='o') openOverview();
  if(e.key==='?') openKbd();
});
document.getElementById('overview').addEventListener('click',e=>{if(e.target.id==='overview')closeOverview();});

show(0);
renderHeroCarousel();
