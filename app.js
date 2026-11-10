const app=document.getElementById('app'),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),uid=()=>Math.random().toString(36).slice(2,9);
const MG=['Peito','Costas','Trapézio','Ombro frontal','Ombro lateral','Bíceps','Tríceps','Quadríceps','Posterior','Glúteos','Panturrilha','Abdômen'];
const FM={epley:'Epley',brzycki:'Brzycki',lander:'Lander',lombardi:'Lombardi',oconner:'O’Conner',media:'Média das 5'};
const F={epley:[(l,r)=>l*(1+r/30),(m,r)=>m/(1+r/30)],brzycki:[(l,r)=>l*36/(37-r),(m,r)=>m*(37-r)/36],lander:[(l,r)=>l*100/(101.3-2.67123*r),(m,r)=>m*(101.3-2.67123*r)/100],lombardi:[(l,r)=>l*Math.pow(r,.1),(m,r)=>m/Math.pow(r,.1)],oconner:[(l,r)=>l*(1+r/40),(m,r)=>m/(1+r/40)]};
const RG={min:4,max:8,inc:2.5,formula:'epley',mode:'e',pct:5,st:2.5};
const P=(n,m,s,o={})=>({id:uid(),n,m,i:'',b:0,f:0,...o,s:s.split(' ').map(t=>{const[r,l]=t.split('x');return{t:'n',r:+r,l:+(l||0),k:o.k||90}})});
const PLAN=()=>[
{id:uid(),n:'Treino A',e:[
P('Supino inclinado com halteres','Peito','5x34 6x34',{b:1,f:1,k:120}),
P('Supino reto com halteres','Peito','6x30 6x30 8x30',{b:1,k:120}),
P('Crucifixo (máquina)','Peito','6x70 6x70'),
P('Desenvolvimento de ombros anterior','Ombro frontal','7x27.5 7x27.5 7x27.5',{b:1,k:120}),
P('Elevação lateral no cabo','Ombro lateral','6x15 6x15 6x15 6x15 6x15 6x15',{k:60}),
P('Abdominal na máquina','Abdômen','6x30 6x30 6x30',{k:60}),
P('Abdominal: elevação de pernas','Abdômen','10 10 10',{mn:10,mx:15,k:60})]},
{id:uid(),n:'Treino B',e:[
P('Puxada frontal articulada','Costas','7x70 7x70',{f:1,k:120}),
P('Remada alta unilateral','Costas','6x37.5 6x37.5',{b:1}),
P('Remada sentada','Costas','6x60 6x60'),
P('Encolhimento na máquina de terra','Trapézio','6x100 6x100 6x100'),
P('Tríceps na polia unilateral','Tríceps','6x25 6x25',{b:1,k:60}),
P('Tríceps na polia','Tríceps','6x32 6x32 7x32',{k:60}),
P('Rosca direta','Bíceps','6x32 6x32 7x32',{k:60}),
P('Extensão de tríceps','Tríceps','6x25 6x25',{k:60}),
P('Rosca martelo alternada','Bíceps','6x14 6x14 6x14',{b:1,k:60})]},
{id:uid(),n:'Treino C',e:[
P('Levantamento terra','Posterior','8x80 6x90 6x100',{f:1,k:180,st:5}),
P('Cadeira extensora','Quadríceps','6x67.5 7x67.5 8x67.5',{f:1}),
P('Cadeira flexora','Posterior','6x60 6x60 6x60'),
P('Flexora em pé unilateral','Posterior','6x20 6x20 6x20',{b:1})]}];
let S=null;try{S=JSON.parse(localStorage.getItem('gym1'))}catch(e){}
if(!S)S={w:[],h:[],set:{}};
S.set={...RG,...S.set};
const save=()=>{try{localStorage.setItem('gym1',JSON.stringify(S))}catch(e){}};
if((S.v||0)<3){const demo=S.w.length==1&&S.w[0].e.length==1&&S.w[0].e[0].n=='Supino reto';S.w=PLAN().concat(demo?[]:S.w);S.v=3;save()}
const V={tab:'w',w:null,o:{},sc:'',me:'v',c:null};
const est=(l,r,i)=>{r=Math.min(r,30);if(i==0&&r<=1)return l;const A=Object.values(F),k=S.set.formula;return k=='media'?A.reduce((s,f)=>s+f[i](l,r),0)/A.length:F[k][i](l,r)};
const rm=(l,r)=>r<=1?l:est(l,r,0),ld=(m,r)=>est(m,r,1);
const wk=x=>x.s.filter(s=>s.t!='w'),vol=x=>wk(x).reduce((a,s)=>a+s.r*s.l,0)*(x.b?2:1),e1=x=>Math.max(0,...wk(x).filter(s=>s.l>0&&s.r>0).map(s=>rm(s.l,s.r)));
const fm=n=>+Number(n).toFixed(1);
const mon=d=>{const t=new Date(d+'T12:00');t.setDate(t.getDate()-(t.getDay()+6)%7);return t.toLocaleDateString('sv-SE')};
function sug(x){const G=S.set,mn=x.mn||G.min,mx=Math.max(mn,x.mx||G.max),st=x.st||G.st,z=wk(x).filter(s=>s.r>0);if(!z.length)return;
const top=Math.max(...z.map(s=>s.l)),w=z.filter(s=>s.l==top),n=w.length,T=i=>G.mode=='u'?(i==n-1?mx:mn):Math.max(mn,mx-(n-1-i));
for(let i=n-1;i>=0;i--)if(w[i].r<T(i))return{t:`Degrau do dia: série ${i+1} (de ${n}) de ${w[i].r} para ${w[i].r+1} reps (meta ${T(i)}), mantendo ${top} kg.`,ap(){w[i].r++}};
if(!top)return{t:'Escada completa: adicione um pouco de carga (lastro ou caneleira) e recomece.',ap(){}};
const nl=+(top+Math.max(st,Math.round(top*G.pct/100/st)*st)).toFixed(2),pc=Math.round((nl/top-1)*1000)/10,best=Math.max(...w.map(s=>rm(s.l,s.r)));let r=1;while(r<30&&rm(nl,r+1)<=best)r++;r=Math.min(mx,Math.max(mn,r));
return{t:`Escada completa: suba para ${nl} kg (+${pc}%), com cerca de ${r} reps, e recomece a escada.${pc>10?' Atenção: salto acima de 10%; use um salto menor se puder.':''}`,ap(){w.forEach(s=>{s.l=nl;s.r=r})}}}
const hdr=(t,b)=>`<div class="hd">${b?'<button class="ic" data-a="back">‹</button>':''}<h1>${t}</h1></div>`;
const del=(id,at)=>`<button class="ic" data-a="del" ${at}>${V.c==id?'❓':'🗑'}</button>`;
function rW(){return hdr('Treinos')+(S.w.length?'':'<p class="mu">Nenhum treino ainda.</p>')+S.w.map(w=>{const a=`data-l="w" data-w="${w.id}"`;return`<div class="card"><div class="row"><input class="nm" value="${esc(w.n)}" data-f="n" data-w="${w.id}"><button class="ic" data-a="up" ${a}>↑</button><button class="ic" data-a="down" ${a}>↓</button>${del(w.id,a)}</div><div class="row" style="margin-top:8px"><span class="mu" style="flex:1">${w.e.length} exercício(s)</span><button class="pri" data-a="open" data-w="${w.id}">Abrir ›</button></div></div>`}).join('')+'<button class="btn pri" data-a="addw">+ Novo treino</button>'}
function exC(w,x){const a=`data-w="${w.id}" data-e="${x.id}"`,o=V.o[x.id],sg=sug(x),G=S.set;
const nf=(f,l,v,p)=>`<label class="mu">${l}<input type="number" inputmode="decimal" step="any" min="0" value="${v||''}" placeholder="${p}" data-f="${f}" ${a}></label>`;
return`<div class="card"><div class="row"><label class="th">${x.i?`<img src="${x.i}">`:'📷'}<input type="file" accept="image/*" hidden data-f="img" ${a}></label><div class="g"><input class="nm" value="${esc(x.n)}" data-f="n" ${a}><select data-f="m" ${a}>${MG.map(m=>`<option${x.m==m?' selected':''}>${m}</option>`).join('')}</select></div><div class="col"><button class="ic" data-a="star" ${a}>${x.f?'⭐':'☆'}</button><button class="ic" data-a="up" data-l="e" ${a}>↑</button><button class="ic" data-a="down" data-l="e" ${a}>↓</button>${del(x.id,'data-l="e" '+a)}</div></div>
<div class="mu" style="margin-top:6px">${wk(x).length} séries · volume ${fm(vol(x))} kg${x.b?' (carga por lado ×2)':''} · 1RM est. ${fm(e1(x))} kg</div>
<button class="lk" data-a="tog" ${a}>${o?'Ocultar séries ▴':'Editar séries ▾'}</button>
${o?`<div class="fl">${nf('mn','Reps mín',x.mn,G.min)}${nf('mx','Reps máx',x.mx,G.max)}${nf('st','Salto mín (kg)',x.st,G.st)}<label class="mu"><input type="checkbox" data-f="b" ${x.b?'checked':''} ${a}> Carga por lado (halteres/unilateral)</label></div><div class="sh"><span>Tipo</span><span>Reps</span><span>Carga kg</span><span>Desc. s</span><span></span><span></span></div>`+x.s.map((s,j)=>`<div class="st t${s.t}"><select data-f="t" data-s="${j}" ${a}>${[['w','Aquec.'],['n','Normal'],['f','Falha']].map(([k,l])=>`<option value="${k}"${s.t==k?' selected':''}>${l}</option>`).join('')}</select>${['r','l','k'].map(f=>`<input type="number" inputmode="decimal" min="0" step="any" value="${s[f]}" data-f="${f}" data-s="${j}" ${a}>`).join('')}<button class="ic" data-a="tm" data-k="${s.k}">⏱</button><button class="ic" data-a="rs" data-s="${j}" ${a}>✕</button></div>`).join('')+`<button class="btn" data-a="as" ${a}>+ Série</button>`:''}
${sg?`<div class="sg">💡 ${x.f?'':'Opcional: '}${sg.t} <button class="ic" data-a="apply" ${a}>Aplicar</button></div>`:''}</div>`}
function rWo(){const w=S.w.find(x=>x.id==V.w);if(!w){V.w=null;return rW()}const mv={};w.e.forEach(x=>{const o=mv[x.m]||(mv[x.m]={q:0,v:0});o.q+=wk(x).length;o.v+=vol(x)});
return hdr(esc(w.n),1)+(w.e.length?Object.entries(mv).map(([m,o])=>`<span class="chip">${m}: ${o.q} séries · ${fm(o.v)} kg</span>`).join(''):'<p class="mu">Nenhum exercício ainda.</p>')+w.e.map(x=>exC(w,x)).join('')+`<button class="btn" data-a="addex" data-w="${w.id}">+ Exercício</button><button class="btn pri" data-a="log" data-w="${w.id}">✔ Registrar treino de hoje</button><p class="mu">Séries e volume contam as séries normais e até a falha (aquecimento fica de fora). ⭐ = exercício foco; nos demais, manter já é aceitável.</p>`}
function chart(d){const ks=Object.keys(d).sort(),v=ks.map(k=>d[k]),mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1,X=i=>30+(ks.length>1?i*280/(ks.length-1):140),Y=y=>130-(y-mn)/r*100;
return`<svg viewBox="0 0 320 160" class="ch"><polyline points="${v.map((y,i)=>X(i)+','+Y(y)).join(' ')}"/>${v.map((y,i)=>`<circle cx="${X(i)}" cy="${Y(y)}" r="3.5"/>`).join('')}<text x="2" y="34">${Math.round(mx)}</text><text x="2" y="134">${Math.round(mn)}</text><text x="30" y="154">${ks[0].slice(5)}</text><text x="310" y="154" text-anchor="end">${ks[ks.length-1].slice(5)}</text></svg>`}
function rH(){if(!S.h.length)return hdr('Histórico')+'<p class="mu">Use “✔ Registrar treino de hoje” dentro de um treino para alimentar os gráficos.</p>';
const op=[...new Set(S.h.map(h=>h.m))].map(m=>['g:'+m,'Grupo: '+m]).concat([...new Set(S.h.map(h=>h.n))].map(n=>['e:'+n,'Exercício: '+n]));
if(!op.some(o=>o[0]==V.sc))V.sc=op[0][0];const ex=V.sc[0]=='e',nm=V.sc.slice(2),met=!ex&&V.me=='r'?'v':V.me,d={};
S.h.filter(h=>ex?h.n==nm:h.m==nm).forEach(h=>{const k=ex?h.d:mon(h.d);d[k]=(d[k]||0)+(met=='v'?h.v:met=='q'?(h.q||0):h.r)});
const ks=Object.keys(d).sort(),u=met=='q'?'séries':'kg';
return hdr('Histórico')+`<div class="card"><select data-v="sc">${op.map(o=>`<option value="${esc(o[0])}"${o[0]==V.sc?' selected':''}>${esc(o[1])}</option>`).join('')}</select><select data-v="me" style="margin-top:6px"><option value="v"${met=='v'?' selected':''}>Volume (kg)</option><option value="q"${met=='q'?' selected':''}>Séries</option>${ex?`<option value="r"${met=='r'?' selected':''}>1RM estimado (kg)</option>`:''}</select><div class="mu" style="margin-top:6px">${ex?'Um ponto por treino registrado.':'Soma por semana (a partir da segunda-feira).'}</div><div style="margin-top:6px">${chart(d)}</div><div class="mu">${ks.slice(-6).reverse().map(k=>`${k}: ${fm(d[k])} ${u}`).join(' · ')}</div></div>`}
function rC(){const s=S.set,n=(k,l,st)=>`<label class="mu">${l}<input type="number" step="${st}" data-k="${k}" value="${s[k]}"></label>`,sel=(k,l,o)=>`<label class="mu">${l}<select data-k="${k}">${o.map(([v,t])=>`<option value="${v}"${s[k]==v?' selected':''}>${t}</option>`).join('')}</select></label>`;
return hdr('Configurações')+`<div class="card">${n('min','Reps mínimas do range',1)}${n('max','Reps máximas do range',1)}${sel('mode','Modo de progressão',[['e','Escadinha (padrão)'],['u','Só a última série']])}${n('pct','Salto de carga (%, de 2 a 10)',0.5)}${n('st','Menor salto de carga (kg)',0.5)}${sel('formula','Fórmula de 1RM',Object.entries(FM))}</div><p class="mu">Escadinha: a meta de cada série, da última para a primeira, é o máximo do range, máximo−1, máximo−2… (nunca abaixo do mínimo). A cada treino, +1 rep na última série que ainda está abaixo da meta. Com a escada completa, a carga sobe pelo salto (em múltiplos do menor salto) e as reps iniciais vêm do 1RM estimado. “Séries de trabalho” são as da maior carga do exercício; aquecimento fica de fora. Cada exercício pode ter range e salto próprios.</p>`}
function draw(){app.innerHTML=V.tab=='h'?rH():V.tab=='c'?rC():V.w?rWo():rW();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==V.tab))}
let te=0,tt;const tm=document.getElementById('tm'),ts=document.getElementById('ts');
const toast=m=>{ts.textContent=m;ts.hidden=0;clearTimeout(tt);tt=setTimeout(()=>ts.hidden=1,2200)};
setInterval(()=>{if(!te)return void(tm.hidden=1);const s=Math.ceil((te-Date.now())/1000);if(s<=0){te=0;tm.hidden=1;try{navigator.vibrate&&navigator.vibrate(300)}catch(e){}return}tm.hidden=0;tm.firstChild.textContent='⏱ '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')},250);
tm.onclick=()=>{te=0};
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const d=t.dataset,a=d.a,w=S.w.find(y=>y.id==d.w),x=w&&w.e.find(y=>y.id==d.e);
if(a=='back'){V.w=null}else if(a=='open'){V.w=d.w}else if(a=='addw'){S.w.push({id:uid(),n:'Treino '+(S.w.length+1),e:[]})}
else if(a=='addex'){w.e.push({id:uid(),n:'Exercício '+(w.e.length+1),m:'Peito',i:'',s:[{t:'n',r:S.set.min,l:0,k:90}]})}
else if(a=='tog'){V.o[d.e]=!V.o[d.e]}else if(a=='star'){x.f=x.f?0:1}
else if(a=='as'){const l=x.s[x.s.length-1];x.s.push(l?{...l,t:l.t=='w'?'n':l.t}:{t:'n',r:8,l:0,k:90})}
else if(a=='rs'){x.s.splice(d.s,1)}
else if(a=='apply'){sug(x).ap()}
else if(a=='tm'){te=Date.now()+(+d.k||60)*1000;return}
else if(a=='log'){const dt=new Date().toLocaleDateString('sv-SE');w.e.forEach(x=>{const v=vol(x);if(!v)return;S.h=S.h.filter(h=>!(h.d==dt&&h.x==x.id));S.h.push({d:dt,x:x.id,n:x.n,m:x.m,v,q:wk(x).length,r:fm(e1(x))})});toast('Treino registrado no histórico')}
else if(a=='tab'){V.tab=d.t}
else if(a=='up'||a=='down'||a=='del'){const ar=d.l=='w'?S.w:w.e,id=d.l=='w'?w.id:x.id,i=ar.findIndex(y=>y.id==id);
if(a=='del'){if(V.c!=id){V.c=id;draw();return}ar.splice(i,1);V.c=null}else{const j=i+(a=='up'?-1:1);if(j>=0&&j<ar.length)[ar[i],ar[j]]=[ar[j],ar[i]]}}
save();draw()});
app.onchange=e=>{const t=e.target,d=t.dataset;if(d.v){V[d.v]=t.value;return draw()}
if(d.k){const k=d.k;S.set[k]=(k=='formula'||k=='mode')?t.value:(parseFloat(t.value)||S.set[k]);if(S.set.min>S.set.max)S.set.max=S.set.min;S.set.pct=Math.min(10,Math.max(2,S.set.pct));save();return draw()}
const w=S.w.find(y=>y.id==d.w),x=w&&w.e.find(y=>y.id==d.e),s=x&&x.s[d.s],f=d.f;if(!f||!w)return;
if(f=='img'){const fl=t.files[0];if(!fl)return;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,160/Math.max(im.width,im.height));c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);x.i=c.toDataURL('image/jpeg',.7);save();draw()};im.src=rd.result};rd.readAsDataURL(fl);return}
const o=s||x||w;o[f]=t.type=='checkbox'?(t.checked?1:0):['r','l','k','mn','mx','st'].includes(f)?Math.max(0,parseFloat(String(t.value).replace(',','.'))||0):t.value;save();draw()};
draw();

if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
