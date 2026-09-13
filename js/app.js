
'use strict';

/* ==========================================================
   ALMACENAMIENTO
   Toda la persistencia pasa por aquí. Hoy vive en memoria.
   En tu servidor, reemplaza el cuerpo de get/set por:
     get(k,d){ try{const v=localStorage.getItem('rumbo:'+k);
                    return v?JSON.parse(v):d}catch(e){return d} }
     set(k,v){ try{localStorage.setItem('rumbo:'+k,JSON.stringify(v))}catch(e){} }
   No hay que tocar nada más en la app.
   ========================================================== */
const Store=(()=>{const m=new Map();return{get:(k,d)=>m.has(k)?m.get(k):d,set:(k,v)=>m.set(k,v)};})();

const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const rnd=(v,d=0)=>{const m=Math.pow(10,d);return Math.round(v*m)/m};
const kcalOf=f=>f.p*4+f.c*4+f.f*9;
const iso=d=>d.toISOString().slice(0,10);
const today=()=>iso(new Date());

/* ---------- alimentos ---------- */
const SEED=[
  {n:'Pechuga de pollo sin piel',b:'crudo',p:23.1,c:0,f:1.2},
  {n:'Muslo de pollo sin piel',b:'crudo',p:18.5,c:0,f:6.5},
  {n:'Lomo de res magro',b:'crudo',p:21.5,c:0,f:6.0},
  {n:'Carne molida de res 90/10',b:'crudo',p:20.0,c:0,f:10.0},
  {n:'Lomo de cerdo',b:'crudo',p:21.0,c:0,f:5.0},
  {n:'Tilapia',b:'crudo',p:20.1,c:0,f:1.7},
  {n:'Salmón',b:'crudo',p:20.4,c:0,f:13.4},
  {n:'Atún en agua escurrido',b:'cocido',p:23.6,c:0,f:0.8},
  {n:'Huevo entero',b:'unidad',p:6.3,c:0.4,f:4.8,u:50},
  {n:'Clara de huevo',b:'unidad',p:3.6,c:0.2,f:0.1,u:33},
  {n:'Yogur griego 0%',b:'cocido',p:10.0,c:3.6,f:0.4},
  {n:'Queso campesino',b:'cocido',p:14.0,c:3.0,f:10.0},
  {n:'Leche entera',b:'cocido',p:3.2,c:4.8,f:3.3},
  {n:'Leche semidescremada',b:'cocido',p:3.3,c:4.9,f:1.6},
  {n:'Proteína whey (1 scoop)',b:'unidad',p:24.0,c:2.0,f:1.5,u:30},
  {n:'Lentejas',b:'crudo',p:24.6,c:60.0,f:1.1},
  {n:'Fríjol rojo',b:'crudo',p:21.6,c:63.0,f:1.4},
  {n:'Garbanzo',b:'crudo',p:20.5,c:63.0,f:6.0},
  {n:'Arroz blanco (crudo)',b:'crudo',p:6.8,c:80.0,f:0.7},
  {n:'Arroz blanco (cocido)',b:'cocido',p:2.7,c:28.0,f:0.3},
  {n:'Pasta',b:'crudo',p:13.0,c:75.0,f:1.5},
  {n:'Avena en hojuelas',b:'crudo',p:13.2,c:67.0,f:6.5},
  {n:'Harina de maíz precocida',b:'crudo',p:8.0,c:76.0,f:1.5},
  {n:'Arepa de maíz asada',b:'unidad',p:5.0,c:40.0,f:1.5,u:80},
  {n:'Papa pastusa',b:'crudo',p:2.0,c:17.5,f:0.1},
  {n:'Papa criolla',b:'crudo',p:1.9,c:19.0,f:0.1},
  {n:'Yuca',b:'crudo',p:1.4,c:38.0,f:0.3},
  {n:'Plátano verde',b:'crudo',p:1.3,c:32.0,f:0.4},
  {n:'Plátano maduro',b:'crudo',p:1.3,c:31.0,f:0.4},
  {n:'Pan integral',b:'cocido',p:9.0,c:43.0,f:3.5},
  {n:'Pan blanco tajado',b:'unidad',p:2.4,c:15.0,f:1.0,u:30},
  {n:'Banano',b:'unidad',p:1.3,c:27.0,f:0.4,u:118},
  {n:'Manzana',b:'unidad',p:0.5,c:25.0,f:0.3,u:180},
  {n:'Papaya',b:'crudo',p:0.5,c:11.0,f:0.3},
  {n:'Piña',b:'crudo',p:0.5,c:13.0,f:0.1},
  {n:'Mango',b:'crudo',p:0.8,c:15.0,f:0.4},
  {n:'Aceite de oliva (1 cda)',b:'unidad',p:0,c:0,f:14.0,u:14},
  {n:'Aguacate',b:'crudo',p:2.0,c:9.0,f:15.0},
  {n:'Almendras',b:'crudo',p:21.0,c:22.0,f:50.0},
  {n:'Maní',b:'crudo',p:26.0,c:16.0,f:49.0},
  {n:'Mantequilla de maní (1 cda)',b:'unidad',p:4.0,c:3.0,f:8.0,u:16},
  {n:'Brócoli',b:'crudo',p:2.8,c:7.0,f:0.4},
  {n:'Espinaca',b:'crudo',p:2.9,c:3.6,f:0.4},
  {n:'Tomate',b:'crudo',p:0.9,c:3.9,f:0.2},
  {n:'Cebolla',b:'crudo',p:1.1,c:9.3,f:0.1},
  {n:'Zanahoria',b:'crudo',p:0.9,c:9.6,f:0.2},
  {n:'Lechuga',b:'crudo',p:1.4,c:2.9,f:0.2},
  {n:'Café negro (1 taza)',b:'unidad',p:0.3,c:0,f:0,u:240}
].map((x,i)=>({id:'s'+i,...x}));

Store.set('foods',SEED.slice());
Store.set('meals',[{id:'m1',n:'Desayuno',items:[]},{id:'m2',n:'Almuerzo',items:[]},{id:'m3',n:'Cena',items:[]}]);
Store.set('recent',[]);
Store.set('profile',{sex:'H',age:31,kg:95.7,cm:174,af:1.55});

/* historial de ejemplo: 21 días. Marcado como ejemplo y borrable. */
(function seedHistory(){
  const h=[], base=97.3;
  for(let i=20;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const trend=base-(20-i)*0.075;
    const noise=(Math.sin(i*2.3)*0.45)+(Math.cos(i*1.1)*0.25);
    h.push({date:iso(d), kg:rnd(trend+noise,1),
      kcal:Math.round(2560+Math.sin(i*1.7)*210),
      p:Math.round(178+Math.cos(i*0.9)*26), demo:true});
  }
  Store.set('history',h);
})();

/* ==========================================================
   MOTOR DE CÁLCULO
   §6 y §7 de la especificación. Se conserva la lógica del
   prototipo: Mifflin-St Jeor, factores 1.2 a 1.9, y los cinco
   objetivos con su ajuste, referencia de proteína y % de grasa.
   Los parámetros son configurables, no verdad clínica.
   ========================================================== */
const GOALS={
  rapido:{adj:-500,pkg:2.2,fat:28,lab:'Déficit diario',
    desc:'Déficit fuerte. Bajas rápido, pero sube el riesgo de perder músculo y de abandonar. Pensado para bloques de 6 a 8 semanas, no de forma indefinida.'},
  suave:{adj:-150,pkg:2.0,fat:30,lab:'Déficit diario',
    desc:'Déficit pequeño. Progreso lento con poco impacto en el rendimiento del entrenamiento y en el hambre. Sirve para etapas largas.'},
  recomp:{adj:-300,pkg:2.4,fat:28,lab:'Déficit diario',
    desc:'Bajar grasa y construir músculo a la vez. Déficit moderado con proteína alta. Funciona mejor en quien ya entrenó antes o tiene grasa corporal alta.'},
  mantener:{adj:0,pkg:1.8,fat:30,lab:'Ajuste diario',
    desc:'Sostener el peso actual. Útil entre etapas o cuando ya estás donde quieres estar.'},
  volumen:{adj:300,pkg:2.0,fat:28,lab:'Superávit diario',
    desc:'Construir músculo aceptando algo de grasa. Un superávit sobre 500 kcal tiende a ir más a grasa que a músculo.'}
};
const mifflin=(sex,kg,cm,age)=>{const b=10*kg+6.25*cm-5*age;return sex==='H'?b+5:b-161;};

// Con IMC sobre 30 la masa grasa no demanda proteína: usar el peso
// real inflaría la cifra sin beneficio. Se usa peso ajustado.
function refWeight(kg,m){
  const bmi=kg/(m*m);
  if(bmi<=30) return {w:kg,adj:false};
  const ideal=25*m*m;
  return {w:ideal+0.5*(kg-ideal),adj:true};
}
const bmiLabel=b=>b<18.5?'bajo peso':b<25?'normal':b<30?'sobrepeso':b<35?'obesidad I':b<40?'obesidad II':'obesidad III';

function compute(cfg){
  const {sex,age,kg,cm,af,gk,adj,pkg,fatpct}=cfg;
  if(!age||!kg||!cm) return null;
  const m=cm/100, bmi=kg/(m*m);
  const bmr=mifflin(sex,kg,cm,age), tdee=bmr*af, ref=refWeight(kg,m);
  const sign=GOALS[gk].adj<0?-1:1;
  const delta=gk==='mantener'?0:sign*adj;
  const target=tdee+delta;
  // Proteína primero, grasa después, el carbohidrato absorbe el resto.
  const pg=ref.w*pkg, fFloor=ref.w*0.6;
  const fg=Math.max(fatpct/100*target/9, fFloor);
  const cg=(target-pg*4-fg*9)/4;
  return {gk,bmi,bmr,tdee,af,adj,delta,target,ref,pkg,fatpct,pg,fg,cg,fFloor};
}

function notesFor(r){
  const n=[], wk=Math.abs(r.delta)*7/7700;
  if(r.gk==='recomp') n.push(['good','En recomposición la báscula se mueve poco: entre 0.1 y 0.3 kg por semana, a veces nada. No es fallar. Tus indicadores reales son la cintura, las fotos y si sigues subiendo carga en el entrenamiento.']);
  else if(r.delta!==0) n.push(['good','Cambio esperado: '+(r.delta<0?'−':'+')+wk.toFixed(2)+' kg por semana. Compara siempre el promedio de la semana, nunca el dato de un día.']);
  if(r.target<r.bmr) n.push(['warn','El objetivo queda por debajo de tu metabolismo basal ('+rnd(r.bmr)+' kcal). Reduce el ajuste y compensa con más actividad diaria.']);
  else if(r.delta<0 && r.adj>r.tdee*0.25) n.push(['warn','El déficit pasa del 25% de tu mantenimiento. El rango sostenible está entre 15% y 25%.']);
  if(r.gk==='recomp' && r.adj>400) n.push(['warn','Con más de 400 kcal de déficit la recomposición deja de funcionar: no queda energía para construir tejido. El rango útil es 200 a 350.']);
  if(r.cg<0) n.push(['warn','La proteína y la grasa ya consumieron todas las calorías. Baja el porcentaje de grasa.']);
  else if(r.cg<60) n.push(['warn','Quedan solo '+rnd(r.cg)+' g de carbohidrato. Baja el porcentaje de grasa: el carbohidrato es el combustible de las series pesadas.']);
  if(r.fg>r.fatpct/100*r.target/9+0.5) n.push(['good','La grasa subió al piso de '+rnd(r.fFloor)+' g, el mínimo para no afectar la función hormonal.']);
  if(r.delta>500) n.push(['warn','Un superávit sobre 500 kcal tiende a ir más a grasa que a músculo.']);
  if(r.ref.adj) n.push(['good','Con IMC sobre 30 la proteína se calcula sobre '+r.ref.w.toFixed(1)+' kg y no sobre tu peso real, porque la masa grasa no demanda proteína.']);
  return n;
}
const renderNotes=(el,n)=>{ el.innerHTML=n.map(([t,x])=>`<div class="note ${t}">${x}</div>`).join(''); };

function macro3(el,r){
  el.innerHTML=[
    ['Proteína',r.pg,'var(--p)'],['Carbohidratos',r.cg,'var(--c)'],['Grasa',r.fg,'var(--g)']
  ].map(([nm,g,col])=>`<div class="m3" style="background:${col}">
    <span>${nm}</span><b>${rnd(g)}</b><em> g</em></div>`).join('');
}

/* ==========================================================
   ONBOARDING (§5) — progresivo, una pregunta por paso
   ========================================================== */
let obStep=0;
const obCfg={sex:'H',age:31,kg:95.7,cm:174,af:1.55,gk:'recomp',adj:300,pkg:2.4,fatpct:28};

function obPress(sel,cb){
  $$(sel+' button').forEach(b=>b.addEventListener('click',()=>{
    $$(sel+' button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    cb(b.dataset.v);
  }));
}
obPress('#ob-goal',v=>{
  obCfg.gk=v;
  const g=GOALS[v];
  obCfg.adj=Math.abs(g.adj); obCfg.pkg=g.pkg; obCfg.fatpct=g.fat;
  $('#ob-adj').value=obCfg.adj; $('#ob-adj-v').textContent=obCfg.adj;
  $('#ob-adj-lab').textContent=g.lab;
  $('#ob-adj').closest('.dial').style.display = v==='mantener'?'none':'block';
});
obPress('#ob-sex',v=>{obCfg.sex=v;});
obPress('#ob-act',v=>{obCfg.af=+v;});
['age','weight','height'].forEach(k=>{
  const map={age:'age',weight:'kg',height:'cm'};
  $('#ob-'+k).addEventListener('input',e=>{obCfg[map[k]]=+e.target.value||0;});
});
$('#ob-adj').addEventListener('input',e=>{
  obCfg.adj=+e.target.value; $('#ob-adj-v').textContent=e.target.value; obResult();
});

function obResult(){
  const r=compute(obCfg); if(!r) return;
  $('#ob-k').textContent=rnd(r.target);
  macro3($('#ob-m3'),r);
  renderNotes($('#ob-notes'),notesFor(r).slice(0,2));
}

function obShow(){
  $$('.ob .step').forEach(s=>s.classList.toggle('on',+s.dataset.s===obStep));
  $$('#ob-dots i').forEach((d,i)=>d.classList.toggle('on',i<=obStep));
  $('#ob-back').classList.toggle('hide',obStep===0);
  $('#ob-next').textContent = obStep===4 ? 'Empezar' : obStep===3 ? 'Confirmar' : 'Continuar';
  if(obStep===3) obResult();
  window.scrollTo({top:0});
}
$('#ob-next').addEventListener('click',()=>{
  if(obStep<4){ obStep++; obShow(); return; }
  finishOb();
});
$('#ob-back').addEventListener('click',()=>{ if(obStep>0){obStep--;obShow();} });
$('#ob-skip').addEventListener('click',finishOb);

function finishOb(){
  Store.set('profile',{sex:obCfg.sex,age:obCfg.age,kg:obCfg.kg,cm:obCfg.cm,af:obCfg.af});
  Store.set('goalcfg',{gk:obCfg.gk,adj:obCfg.adj,pkg:obCfg.pkg,fatpct:obCfg.fatpct});
  $('#ob').classList.add('hide');
  $('#app').classList.remove('hide');
  $('#nav').classList.remove('hide');
  syncObjetivoControls();
  renderObjetivo();
}

/* ==========================================================
   OBJETIVO (§11)
   ========================================================== */
Store.set('goalcfg',{gk:'recomp',adj:300,pkg:2.4,fatpct:28});

function cfgNow(){
  const p=Store.get('profile'), g=Store.get('goalcfg');
  return {...p,...g};
}
function syncObjetivoControls(){
  const p=Store.get('profile'), g=Store.get('goalcfg');
  $$('#o-sex button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===p.sex)));
  $('#o-age').value=p.age; $('#o-weight').value=p.kg; $('#o-height').value=p.cm; $('#o-act').value=p.af;
  $$('#o-goal button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===g.gk)));
  $('#o-adj').value=g.adj; $('#o-adj-v').textContent=g.adj;
  $('#o-pkg').value=g.pkg; $('#o-pk-v').textContent=g.pkg.toFixed(1);
  $('#o-fatpct').value=g.fatpct; $('#o-fp-v').textContent=g.fatpct;
  $('#o-adj-lab').textContent=GOALS[g.gk].lab;
  $('#o-adjrow').style.display=g.gk==='mantener'?'none':'block';
}

function renderObjetivo(){
  const r=compute(cfgNow()); if(!r) return;
  const g=Store.get('goalcfg');
  $('#o-k').textContent=rnd(r.target);
  $('#o-desc').textContent=GOALS[r.gk].desc;
  const wk=Math.abs(r.delta)*7/7700;
  $('#o-expect').textContent = r.gk==='recomp' ? 'La báscula se moverá poco. Eso es lo esperado en recomposición.'
    : r.delta===0 ? 'Para sostener tu peso actual.'
    : 'Cambio esperado de '+(r.delta<0?'−':'+')+wk.toFixed(2)+' kg por semana.';
  macro3($('#o-m3'),r);
  renderNotes($('#o-notes'),notesFor(r));
  $('#o-detail').innerHTML=[
    ['IMC',r.bmi.toFixed(1),bmiLabel(r.bmi)],
    ['Basal',rnd(r.bmr),'kcal'],
    ['Mantenimiento',rnd(r.tdee),'basal × '+r.af],
    ['Ajuste',(r.delta>=0?'+':'−')+Math.abs(rnd(r.delta)),'kcal'],
    ['Peso de referencia',r.ref.w.toFixed(1),r.ref.adj?'kg ajustado':'kg real']
  ].map(([a,b,c])=>`<div class="stat"><span>${a}</span><b>${b}</b><span class="d">${c}</span></div>`).join('');
  Store.set('target',{kcal:r.target,p:r.pg,c:r.cg,f:r.fg});
  renderHoy(); renderProgreso();
}

$$('#o-sex button').forEach(b=>b.addEventListener('click',()=>{
  $$('#o-sex button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  Store.set('profile',{...Store.get('profile'),sex:b.dataset.v}); renderObjetivo();
}));
$$('#o-goal button').forEach(b=>b.addEventListener('click',()=>{
  $$('#o-goal button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const g=GOALS[b.dataset.v];
  Store.set('goalcfg',{gk:b.dataset.v,adj:Math.abs(g.adj),pkg:g.pkg,fatpct:g.fat});
  syncObjetivoControls(); renderObjetivo();
}));
const bindProfile=(sel,key)=>$(sel).addEventListener('input',e=>{
  Store.set('profile',{...Store.get('profile'),[key]:+e.target.value||0}); renderObjetivo();
});
bindProfile('#o-age','age'); bindProfile('#o-weight','kg'); bindProfile('#o-height','cm');
$('#o-act').addEventListener('change',e=>{
  Store.set('profile',{...Store.get('profile'),af:+e.target.value}); renderObjetivo();
});
const bindGoal=(sel,key,lbl,fx)=>$(sel).addEventListener('input',e=>{
  const v=+e.target.value; $(lbl).textContent=fx?fx(v):v;
  Store.set('goalcfg',{...Store.get('goalcfg'),[key]:v}); renderObjetivo();
});
bindGoal('#o-adj','adj','#o-adj-v');
bindGoal('#o-pkg','pkg','#o-pk-v',v=>v.toFixed(1));
bindGoal('#o-fatpct','fatpct','#o-fp-v');

/* ==========================================================
   HOY (§8)
   ========================================================== */
function mealTotals(m){
  const foods=Store.get('foods',[]);
  return m.items.reduce((a,it)=>{
    const f=foods.find(x=>x.id===it.id); if(!f) return a;
    const k=f.b==='unidad'?it.qty:it.qty/100;
    return {kcal:a.kcal+kcalOf(f)*k,p:a.p+f.p*k,c:a.c+f.c*k,f:a.f+f.f*k};
  },{kcal:0,p:0,c:0,f:0});
}
const dayTotals=()=>Store.get('meals',[]).reduce((a,m)=>{
  const t=mealTotals(m);
  return {kcal:a.kcal+t.kcal,p:a.p+t.p,c:a.c+t.c,f:a.f+t.f};
},{kcal:0,p:0,c:0,f:0});

function renderHoy(){
  const foods=Store.get('foods',[]), meals=Store.get('meals',[]);
  const t=dayTotals(), g=Store.get('target',null), goal=g?g.kcal:0, rem=goal-t.kcal;

  $('#h-rem').textContent = goal?rnd(Math.abs(rem)):'—';
  $('#h-big').classList.toggle('over',goal>0&&rem<0);
  $('#h-lab').textContent = goal>0&&rem<0 ? 'Vas por encima' : 'Te quedan';
  $('#h-goal').textContent = goal?rnd(goal):'—';
  $('#h-food').textContent = rnd(t.kcal);
  $('#h-count').textContent = meals.reduce((a,m)=>a+m.items.length,0);

  $('#h-macros').innerHTML=[
    ['Proteína',t.p,g?g.p:0,'var(--p)'],
    ['Carbohidratos',t.c,g?g.c:0,'var(--c)'],
    ['Grasa',t.f,g?g.f:0,'var(--g)']
  ].map(([nm,v,gl,col])=>{
    const pct=gl>0?Math.min(v/gl*100,100):0, over=gl>0&&v>gl*1.05;
    return `<div class="mac ${over?'over':''}">
      <div class="l"><span class="n"><i style="background:${col}"></i>${nm}</span>
      <span class="v">${rnd(v)}<em> / ${rnd(gl)} g</em></span></div>
      <div class="t"><div class="f" style="width:${pct}%;background:${col}"></div></div></div>`;
  }).join('');

  $('#h-meals').innerHTML=meals.map(m=>{
    const mt=mealTotals(m);
    const items=m.items.map(it=>{
      const f=foods.find(x=>x.id===it.id); if(!f) return '';
      const k=f.b==='unidad'?it.qty:it.qty/100;
      return `<div class="it">
        <div class="n"><strong>${f.n}</strong>
          <small>P ${rnd(f.p*k,1)} · C ${rnd(f.c*k,1)} · G ${rnd(f.f*k,1)}</small></div>
        <div class="q">${it.qty} ${f.b==='unidad'?'und':'g'}</div>
        <div class="k">${rnd(kcalOf(f)*k)}</div>
        <button class="x" data-rm="${it.key}" aria-label="Quitar">✕</button></div>`;
    }).join('');
    return `<div class="meal">
      <div class="mh"><span class="t">${m.n}</span>
        <span class="r"><b>${rnd(mt.kcal)}</b> kcal
        ${m.id.startsWith('x')?`<button class="x" data-delmeal="${m.id}" style="color:var(--faint)">✕</button>`:''}</span></div>
      ${items?`<div class="items">${items}</div>`:''}
      <button class="mealadd" data-add="${m.id}"><i>+</i> Agregar alimento</button></div>`;
  }).join('');
}

$('#h-meals').addEventListener('click',e=>{
  const a=e.target.closest('[data-add]');
  if(a){ openAdd(a.dataset.add); return; }
  const rm=e.target.closest('[data-rm]');
  if(rm){ const meals=Store.get('meals',[]);
    meals.forEach(m=>{m.items=m.items.filter(i=>i.key!==rm.dataset.rm);});
    Store.set('meals',meals); renderHoy(); return; }
  const dm=e.target.closest('[data-delmeal]');
  if(dm){ Store.set('meals',Store.get('meals',[]).filter(m=>m.id!==dm.dataset.delmeal)); renderHoy(); }
});
$('#h-addmeal').addEventListener('click',()=>{
  const meals=Store.get('meals',[]);
  const n=meals.filter(m=>m.n.startsWith('Snack')).length;
  meals.push({id:'x'+Date.now(),n:'Snack '+(n+1),items:[]});
  Store.set('meals',meals); renderHoy();
});

/* Guardar el día: alimenta el historial que Progreso necesita
   para medir adherencia (§10). Sin este cierre solo hay peso. */
$('#h-close').addEventListener('click',()=>{
  const t=dayTotals();
  if(t.kcal<=0){ $('#h-closed').textContent='No hay nada registrado todavía.'; return; }
  const h=Store.get('history',[]), d=today();
  const ex=h.find(x=>x.date===d);
  if(ex){ ex.kcal=Math.round(t.kcal); ex.p=Math.round(t.p); delete ex.demo; }
  else h.push({date:d,kcal:Math.round(t.kcal),p:Math.round(t.p)});
  Store.set('history',h.sort((a,b)=>a.date<b.date?-1:1));
  $('#h-closed').textContent='Día guardado. Ya aparece en Progreso.';
  renderProgreso();
});

/* ==========================================================
   AGREGAR ALIMENTO (§9) — buscar, recientes, cantidad, comida
   ========================================================== */
let sheetMode=null, pendingMeal=null, pendingFood=null;

function openSheet(title){ $('#sh-title').textContent=title; $('#sheet').classList.add('on'); $('#scrim').classList.add('on'); }
function closeSheet(){ $('#sheet').classList.remove('on'); $('#scrim').classList.remove('on'); sheetMode=null; }
$('#sh-close').addEventListener('click',closeSheet);
$('#scrim').addEventListener('click',closeSheet);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeSheet(); });

function openAdd(mealId){
  pendingMeal=mealId; pendingFood=null; sheetMode='search';
  const m=Store.get('meals',[]).find(x=>x.id===mealId);
  openSheet('Agregar a '+(m?m.n.toLowerCase():'la comida'));
  renderSearchStep('');
  setTimeout(()=>{ const i=$('#sh-q'); if(i) i.focus(); },160);
}

function renderSearchStep(q){
  const foods=Store.get('foods',[]);
  const recent=Store.get('recent',[]).map(id=>foods.find(f=>f.id===id)).filter(Boolean).slice(0,6);
  const list=q ? foods.filter(f=>f.n.toLowerCase().includes(q.toLowerCase())).slice(0,25) : [];
  const row=f=>`<button class="res" data-pick="${f.id}">
      <div class="n"><strong>${f.n}</strong>
        <small>${f.b==='unidad'?'por unidad de '+f.u+' g':'por 100 g '+f.b}</small></div>
      <span class="k">${rnd(kcalOf(f))} kcal</span></button>`;
  $('#sh-body').innerHTML=`
    <input class="search" type="text" id="sh-q" placeholder="Buscar alimento…" value="${q.replace(/"/g,'&quot;')}" autocomplete="off">
    ${!q&&recent.length?`<div class="secttl">Recientes</div><div class="pillrow">${recent.map(f=>`<button class="pill" data-pick="${f.id}">${f.n}</button>`).join('')}</div>`:''}
    ${q?(list.length?`<div class="secttl">Resultados</div>${list.map(row).join('')}`
        :`<div class="secttl">Sin resultados</div><p style="color:var(--muted);font-size:.86rem">No encuentro «${q}». Puedes crearlo en la base de alimentos.</p>
          <button class="btn soft sm" id="sh-tofoods">Crear alimento</button>`)
      :(!recent.length?`<div class="secttl">Sugerencias</div>${foods.slice(0,8).map(row).join('')}`
        :`<div class="secttl">Sugerencias</div>${foods.slice(0,6).map(row).join('')}`)}`;
  const inp=$('#sh-q');
  inp.addEventListener('input',e=>{
    const pos=e.target.value;
    renderSearchStep(pos);
    const i2=$('#sh-q'); i2.focus(); i2.setSelectionRange(pos.length,pos.length);
  });
}

function renderQtyStep(){
  const f=pendingFood, meals=Store.get('meals',[]);
  const unit=f.b==='unidad'?'und':'g';
  const def=f.b==='unidad'?1:100;
  $('#sh-title').textContent=f.n;
  $('#sh-body').innerHTML=`
    <p style="color:var(--muted);font-size:.84rem;margin-top:0">
      Los valores son ${f.b==='unidad'?'por unidad de '+f.u+' g':'por 100 g en '+f.b}.
      ${f.b==='crudo'?'Pesa el alimento antes de cocinarlo.':''}</p>
    <label class="fld"><span>Cantidad (${unit})</span>
      <input type="number" id="sh-qty" step="${f.b==='unidad'?'0.5':'5'}" value="${def}" min="0"></label>
    <div class="preview" id="sh-prev"></div>
    <label class="fld"><span>¿A qué comida?</span>
      <select id="sh-meal">${meals.map(m=>`<option value="${m.id}" ${m.id===pendingMeal?'selected':''}>${m.n}</option>`).join('')}</select></label>
    <div class="btnrow" style="margin-top:18px">
      <button class="btn soft" id="sh-back">Atrás</button>
      <button class="btn" id="sh-confirm" style="flex:1">Agregar</button>
    </div>`;
  const upd=()=>{
    const q=+$('#sh-qty').value||0, k=f.b==='unidad'?q:q/100;
    $('#sh-prev').innerHTML=`<div class="k">${rnd(kcalOf(f)*k)}<span>kcal</span></div>
      <div class="m">
        <div><span>Proteína</span><b>${rnd(f.p*k,1)} g</b></div>
        <div><span>Carbos</span><b>${rnd(f.c*k,1)} g</b></div>
        <div><span>Grasa</span><b>${rnd(f.f*k,1)} g</b></div>
      </div>`;
  };
  upd();
  $('#sh-qty').addEventListener('input',upd);
  $('#sh-qty').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#sh-confirm').click(); });
  $('#sh-back').addEventListener('click',()=>{ sheetMode='search'; renderSearchStep(''); });
  $('#sh-confirm').addEventListener('click',()=>{
    const q=+$('#sh-qty').value||def, mid=$('#sh-meal').value;
    const meals=Store.get('meals',[]), m=meals.find(x=>x.id===mid); if(!m) return;
    m.items.push({key:'i'+Date.now()+Math.random().toString(36).slice(2,6),id:f.id,qty:q});
    Store.set('meals',meals);
    const rec=Store.get('recent',[]).filter(x=>x!==f.id); rec.unshift(f.id);
    Store.set('recent',rec.slice(0,12));
    closeSheet(); renderHoy();
  });
  setTimeout(()=>{ const i=$('#sh-qty'); if(i){i.focus();i.select();} },120);
}

$('#sh-body').addEventListener('click',e=>{
  const pick=e.target.closest('[data-pick]');
  if(pick){
    pendingFood=Store.get('foods',[]).find(f=>f.id===pick.dataset.pick);
    if(pendingFood){ sheetMode='qty'; renderQtyStep(); }
    return;
  }
  if(e.target.id==='sh-tofoods'){ openFoods(); return; }
  const del=e.target.closest('[data-delfood]');
  if(del){
    Store.set('foods',Store.get('foods',[]).filter(f=>f.id!==del.dataset.delfood));
    openFoods(); renderHoy(); return;
  }
  if(e.target.id==='nf-add'){
    const n=$('#nf-name').value.trim(), b=$('#nf-base').value;
    const p=+$('#nf-p').value,c=+$('#nf-c').value,fa=+$('#nf-f').value,u=+$('#nf-u').value;
    const msg=$('#nf-msg');
    if(!n){ msg.textContent='Falta el nombre.'; return; }
    if(b==='unidad'&&!u){ msg.textContent='Una unidad necesita su peso en gramos.'; return; }
    if(!p&&!c&&!fa){ msg.textContent='Al menos un macro debe ser mayor que cero.'; return; }
    const foods=Store.get('foods',[]);
    foods.unshift({id:'u'+Date.now(),n,b,p,c,f:fa,u:b==='unidad'?u:undefined});
    Store.set('foods',foods); openFoods();
  }
});

/* ==========================================================
   HERRAMIENTAS Y ALIMENTOS (§12) — secundarias, en sheet
   ========================================================== */
function openFoods(){
  sheetMode='foods'; openSheet('Base de alimentos');
  const foods=Store.get('foods',[]);
  $('#sh-body').innerHTML=`
    <div class="secttl">Crear alimento</div>
    <div class="fields">
      <label class="fld"><span>Nombre</span><input type="text" id="nf-name" placeholder="Pechuga de pollo"></label>
      <label class="fld"><span>Base</span><select id="nf-base">
        <option value="crudo">Crudo, por 100 g</option>
        <option value="cocido">Cocido, por 100 g</option>
        <option value="unidad">Unidad</option></select></label>
      <label class="fld"><span>Proteína (g)</span><input type="number" id="nf-p" step="0.1"></label>
      <label class="fld"><span>Carbohidratos (g)</span><input type="number" id="nf-c" step="0.1"></label>
      <label class="fld"><span>Grasa (g)</span><input type="number" id="nf-f" step="0.1"></label>
      <label class="fld"><span>Peso unidad (g)</span><input type="number" id="nf-u" step="1"></label>
    </div>
    <div class="btnrow" style="margin-top:14px;align-items:center">
      <button class="btn sm" id="nf-add">Guardar</button>
      <span id="nf-msg" style="font-size:.8rem;color:var(--muted)"></span>
    </div>
    <div class="secttl" style="margin-top:22px">${foods.length} alimentos</div>
    <p style="color:var(--muted);font-size:.82rem">Las calorías se calculan desde los macros (4/4/9), nunca se escriben a mano. Así no pueden quedar inconsistentes.</p>
    <div class="tw"><table>
      <thead><tr><th>Alimento</th><th>Base</th><th class="n">kcal</th><th class="n">P</th><th class="n">C</th><th class="n">G</th><th></th></tr></thead>
      <tbody>${foods.map(f=>`<tr><td>${f.n}</td>
        <td><span class="tag ${f.b}">${f.b==='unidad'?f.u+' g':f.b}</span></td>
        <td class="n">${rnd(kcalOf(f))}</td><td class="n">${f.p}</td><td class="n">${f.c}</td><td class="n">${f.f}</td>
        <td class="n">${f.id.startsWith('s')?'':`<button class="x" data-delfood="${f.id}" style="color:var(--bad)">✕</button>`}</td></tr>`).join('')}</tbody>
    </table></div>`;
}
$('#open-foods').addEventListener('click',openFoods);

function openTools(){
  sheetMode='tools'; openSheet('Herramientas');
  $('#sh-body').innerHTML=`
    <div class="secttl">Convertir cocido a crudo</div>
    <p style="color:var(--muted);font-size:.84rem">Para cuando cocinas en olla para varios días y no pesaste antes. El factor se calcula una vez por plato y se reutiliza siempre.</p>
    <div class="fields">
      <label class="fld"><span>Total en crudo (g)</span><input type="number" id="cv-raw" placeholder="500"></label>
      <label class="fld"><span>Total cocinado (g)</span><input type="number" id="cv-cook" placeholder="1450"></label>
      <label class="fld"><span>Me serví (g cocidos)</span><input type="number" id="cv-serve" placeholder="300"></label>
    </div>
    <div class="stats" id="cv-out" style="margin-top:14px"></div>
    <div id="cv-eq"></div>
    <div class="secttl" style="margin-top:22px">Por qué se pesa en crudo</div>
    <p style="color:var(--muted);font-size:.86rem">Cocinar no crea ni destruye proteína, grasa ni carbohidrato. Lo único que cambia es el agua: la carne la pierde, el arroz la absorbe.</p>
    <p style="color:var(--muted);font-size:.86rem">100 g de pollo crudo tienen la misma proteína quede en 70 g o en 85 g al cocinarse. El peso cambia, el macro no. Por eso el crudo es el dato estable y el cocido depende del método de cocción.</p>
    <div class="secttl" style="margin-top:22px">Exportar</div>
    <button class="btn soft sm" id="tl-csv">Descargar el día en CSV</button>`;
  const upd=()=>{
    const raw=+$('#cv-raw').value,cook=+$('#cv-cook').value,serve=+$('#cv-serve').value;
    if(!raw||!cook){ $('#cv-out').innerHTML='<div class="stat"><span>Factor</span><b>—</b><span class="d">faltan datos</span></div>'; $('#cv-eq').innerHTML=''; return; }
    const fx=cook/raw;
    $('#cv-out').innerHTML=`
      <div class="stat"><span>Factor</span><b>${fx.toFixed(2)}×</b><span class="d">${fx>=1?'absorbió agua':'perdió agua'}</span></div>
      <div class="stat"><span>1 g cocido</span><b>${(1/fx).toFixed(2)}</b><span class="d">g en crudo</span></div>
      <div class="stat"><span>Cambio</span><b>${fx>=1?'+':''}${rnd((fx-1)*100)}%</b><span class="d">al cocinar</span></div>`;
    $('#cv-eq').innerHTML = serve
      ? `<div class="note good">${serve} g cocidos equivalen a ${rnd(serve/fx)} g en crudo. Ese es el número que registras.</div>` : '';
  };
  upd();
  ['#cv-raw','#cv-cook','#cv-serve'].forEach(s=>$(s).addEventListener('input',upd));
  $('#tl-csv').addEventListener('click',exportCSV);
}
$('#open-tools').addEventListener('click',openTools);

function exportCSV(){
  const foods=Store.get('foods',[]);
  const rows=[['comida','alimento','base','cantidad','unidad','kcal','proteina_g','carbos_g','grasa_g']];
  Store.get('meals',[]).forEach(m=>m.items.forEach(it=>{
    const f=foods.find(x=>x.id===it.id); if(!f) return;
    const k=f.b==='unidad'?it.qty:it.qty/100;
    rows.push([m.n,f.n,f.b,it.qty,f.b==='unidad'?'und':'g',rnd(kcalOf(f)*k),rnd(f.p*k,1),rnd(f.c*k,1),rnd(f.f*k,1)]);
  }));
  if(rows.length===1) return;
  const t=dayTotals();
  rows.push(['TOTAL','','','','',rnd(t.kcal),rnd(t.p,1),rnd(t.c,1),rnd(t.f,1)]);
  const blob=new Blob(['\uFEFF'+rows.map(r=>r.join(';')).join('\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='rumbo-'+today()+'.csv'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

/* ==========================================================
   PROGRESO (§10) — tendencias, no números aislados
   ========================================================== */
function weighted(){ return Store.get('history',[]).filter(x=>typeof x.kg==='number').sort((a,b)=>a.date<b.date?-1:1); }

function rollingAvg(arr,win){
  return arr.map((_,i)=>{
    const s=Math.max(0,i-win+1), sl=arr.slice(s,i+1);
    return sl.reduce((a,b)=>a+b.kg,0)/sl.length;
  });
}

function renderChart(){
  const w=weighted(), box=$('#pg-chart');
  if(w.length<2){ box.innerHTML='<p style="color:var(--muted);font-size:.86rem;margin:0">Anota tu peso al menos dos días para ver la tendencia.</p>'; return; }
  const W=600,H=170,PL=34,PR=8,PT=12,PB=20;
  const kgs=w.map(x=>x.kg), avg=rollingAvg(w,7);
  const lo=Math.min(...kgs,...avg)-0.6, hi=Math.max(...kgs,...avg)+0.6;
  const X=i=>PL+(i/(w.length-1))*(W-PL-PR);
  const Y=v=>PT+(1-(v-lo)/(hi-lo))*(H-PT-PB);
  const dots=w.map((x,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(x.kg).toFixed(1)}" r="2.4" fill="#9CA2AA"/>`).join('');
  const line=avg.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const ticks=[hi,(hi+lo)/2,lo].map(v=>`
    <line x1="${PL}" y1="${Y(v).toFixed(1)}" x2="${W-PR}" y2="${Y(v).toFixed(1)}" stroke="#E7E7E2" stroke-width="1"/>
    <text x="0" y="${(Y(v)+3.5).toFixed(1)}" font-size="10" fill="#9CA2AA" font-weight="600">${v.toFixed(1)}</text>`).join('');
  const fmt=s=>{const d=new Date(s+'T12:00:00');return d.getDate()+'/'+(d.getMonth()+1);};
  box.innerHTML=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso">
    ${ticks}${dots}
    <path d="${line}" fill="none" stroke="#14161A" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="${PL}" y="${H-4}" font-size="10" fill="#9CA2AA" font-weight="600">${fmt(w[0].date)}</text>
    <text x="${W-PR}" y="${H-4}" font-size="10" fill="#9CA2AA" font-weight="600" text-anchor="end">${fmt(w[w.length-1].date)}</text>
  </svg>`;
}

function weekAvgs(){
  const w=weighted();
  const last7=w.slice(-7), prev7=w.slice(-14,-7);
  const mean=a=>a.length?a.reduce((s,x)=>s+x.kg,0)/a.length:null;
  return {cur:mean(last7),prev:mean(prev7),n:w.length,last:w.length?w[w.length-1]:null};
}

function renderProgreso(){
  renderChart();
  const wa=weekAvgs(), r=compute(cfgNow());
  const g=Store.get('target',null);

  $('#pg-wstats').innerHTML=[
    ['Último peso', wa.last?wa.last.kg.toFixed(1)+' kg':'—', wa.last?'anotado':'sin datos'],
    ['Promedio 7 días', wa.cur?wa.cur.toFixed(1)+' kg':'—','actual'],
    ['Semana anterior', wa.prev?wa.prev.toFixed(1)+' kg':'—','para comparar'],
    ['Cambio', (wa.cur&&wa.prev)?((wa.cur-wa.prev>=0?'+':'−')+Math.abs(wa.cur-wa.prev).toFixed(2)+' kg'):'—','por semana']
  ].map(([a,b,c])=>`<div class="stat"><span>${a}</span><b>${b}</b><span class="d">${c}</span></div>`).join('');

  /* veredicto: peso real contra lo que el objetivo predice */
  const box=$('#pg-verdict');
  if(!wa.cur||!wa.prev||!r){
    box.innerHTML='<div class="note">Necesito al menos dos semanas de peso para comparar tu evolución real contra lo que el objetivo predice.</div>';
  } else {
    const real=wa.cur-wa.prev;
    const expected=r.delta*7/7700;
    const isRecomp=r.gk==='recomp';
    let cls='good', txt='';
    if(isRecomp){
      if(real>0.35){ cls='warn'; txt=`Tu promedio subió ${real.toFixed(2)} kg esta semana. En recomposición se espera estabilidad o bajada leve. Si el peso sube dos semanas seguidas, el mantenimiento real es mayor de lo estimado: aumenta el déficit en 100 kcal.`; }
      else if(real<-0.7){ cls='warn'; txt=`Bajaste ${Math.abs(real).toFixed(2)} kg, más de lo que busca una recomposición. Estás perdiendo peso rápido y parte puede ser masa magra. Reduce el déficit en 100 a 150 kcal y revisa que estés cumpliendo la proteína.`; }
      else { txt=`Vas bien. ${real<=0?'Bajaste':'Subiste'} ${Math.abs(real).toFixed(2)} kg, dentro del rango esperado para recomposición. Recuerda que aquí la báscula no es el indicador principal: la cintura y la carga en el entrenamiento lo son.`; }
    } else if(r.delta===0){
      if(Math.abs(real)<=0.3) txt=`Tu peso está estable (${real>=0?'+':'−'}${Math.abs(real).toFixed(2)} kg). El mantenimiento estimado está funcionando.`;
      else { cls='warn'; txt=`Tu peso se movió ${real.toFixed(2)} kg cuando buscabas mantenerlo. Ajusta el objetivo unas 100 kcal en la dirección contraria.`; }
    } else {
      const ratio=expected!==0?real/expected:0;
      if(ratio>=0.6&&ratio<=1.6) txt=`Vas según lo previsto. Esperabas ${expected.toFixed(2)} kg por semana y tu promedio se movió ${real.toFixed(2)} kg. No cambies nada.`;
      else if(ratio<0.6){ cls='warn'; txt=`Esperabas ${expected.toFixed(2)} kg y tu promedio se movió ${real.toFixed(2)} kg. Si se repite otra semana, tu mantenimiento real es menor de lo estimado: ${r.delta<0?'resta':'suma'} 150 kcal o agrega 2.000 pasos diarios. Solo una de las dos cosas a la vez.`; }
      else { cls='warn'; txt=`Te estás moviendo más rápido de lo previsto (${real.toFixed(2)} kg frente a ${expected.toFixed(2)} esperados). ${r.delta<0?'Un descenso muy rápido cuesta masa magra: reduce el déficit unas 150 kcal.':'Parte de esa subida es grasa: reduce el superávit unas 150 kcal.'}`; }
    }
    box.innerHTML=`<div class="note ${cls}" style="margin-top:0">${txt}</div>
      <div class="stats" style="margin-top:12px">
        <div class="stat"><span>Cambio real</span><b>${real>=0?'+':'−'}${Math.abs(real).toFixed(2)}</b><span class="d">kg/semana</span></div>
        <div class="stat"><span>Cambio previsto</span><b>${expected>=0?'+':'−'}${Math.abs(expected).toFixed(2)}</b><span class="d">kg/semana</span></div>
      </div>`;
  }

  /* adherencia */
  const hist=Store.get('history',[]).filter(x=>typeof x.kcal==='number').slice(-14);
  const adh=$('#pg-adh');
  if(!hist.length||!g){
    adh.innerHTML='<div class="note" style="margin-top:0">Usa «Guardar el día» en Hoy al terminar de registrar. Con eso puedo medir tu adherencia.</div>';
  } else {
    const okK=hist.filter(x=>Math.abs(x.kcal-g.kcal)<=150).length;
    const okP=hist.filter(x=>x.p>=g.p*0.9).length;
    const avgK=hist.reduce((a,x)=>a+x.kcal,0)/hist.length;
    const avgP=hist.reduce((a,x)=>a+(x.p||0),0)/hist.length;
    const bar=(lab,pct,det,col)=>`<div class="abar">
      <div class="l"><span>${lab}</span><span>${det}</span></div>
      <div class="t"><div class="f" style="width:${Math.min(pct,100)}%;background:${col}"></div></div></div>`;
    adh.innerHTML=
      bar('Días dentro del objetivo (±150 kcal)',okK/hist.length*100,okK+' de '+hist.length+' días','var(--ink)')+
      bar('Días cumpliendo proteína',okP/hist.length*100,okP+' de '+hist.length+' días','var(--p)')+
      `<div class="stats" style="margin-top:6px">
        <div class="stat"><span>Promedio consumido</span><b>${rnd(avgK)}</b><span class="d">de ${rnd(g.kcal)} kcal</span></div>
        <div class="stat"><span>Promedio proteína</span><b>${rnd(avgP)}</b><span class="d">de ${rnd(g.p)} g</span></div>
      </div>`+
      (okP/hist.length<0.7?'<div class="note warn">La proteína es la variable que más protege la masa magra en déficit. Por debajo del 70% de cumplimiento, el resto del plan pierde efecto.</div>':'');
  }

  /* historial */
  const all=Store.get('history',[]).slice().sort((a,b)=>a.date<b.date?-1:1).reverse();
  $('#pg-tbody').innerHTML = all.length ? all.map(x=>{
    const d=new Date(x.date+'T12:00:00');
    return `<tr><td>${d.toLocaleDateString('es-CO',{day:'numeric',month:'short'})}${x.demo?' <span class="tag" style="background:var(--bg);color:var(--faint)">ej.</span>':''}</td>
      <td class="n">${typeof x.kg==='number'?x.kg.toFixed(1):'—'}</td>
      <td class="n">${x.kcal??'—'}</td><td class="n">${x.p??'—'}</td></tr>`;
  }).join('') : '<tr><td colspan="4" style="color:var(--faint)">Sin registros.</td></tr>';
}

$('#pg-save').addEventListener('click',()=>{
  const kg=+$('#pg-kg').value; if(!kg) return;
  const h=Store.get('history',[]), d=today();
  const ex=h.find(x=>x.date===d);
  if(ex){ ex.kg=kg; delete ex.demo; } else h.push({date:d,kg});
  Store.set('history',h.sort((a,b)=>a.date<b.date?-1:1));
  Store.set('profile',{...Store.get('profile'),kg});
  $('#pg-kg').value=''; syncObjetivoControls(); renderObjetivo();
});
$('#pg-clear').addEventListener('click',()=>{
  Store.set('history',Store.get('history',[]).filter(x=>!x.demo));
  renderProgreso();
});

/* ==========================================================
   NAVEGACIÓN (§4) — Hoy | Progreso | Objetivo
   ========================================================== */
$$('.nav button').forEach(b=>b.addEventListener('click',()=>{
  $$('.nav button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id==='s-'+b.dataset.s));
  $('#scr-title').textContent=b.dataset.title;
  $('#scr-sub').textContent=b.dataset.sub||new Date().toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'});
  window.scrollTo({top:0});
  if(b.dataset.s==='prog') renderProgreso();
}));
$('#scr-sub').textContent=new Date().toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'});

obShow();
renderObjetivo();
