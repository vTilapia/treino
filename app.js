const app=document.getElementById('app'),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),uid=()=>Math.random().toString(36).slice(2,9);
const MG=['Peito','Costas','Ombros','Bíceps','Tríceps','Quadríceps','Posterior','Glúteos','Panturrilha','Abdômen'];
const FM={epley:'Epley',brzycki:'Brzycki',lander:'Lander',lombardi:'Lombardi',oconner:'O’Conner',media:'Média das 5'};
const F={epley:[(l,r)=>l*(1+r/30),(m,r)=>m/(1+r/30)],brzycki:[(l,r)=>l*36/(37-r),(m,r)=>m*(37-r)/36],lander:[(l,r)=>l*100/(101.3-2.67123*r),(m,r)=>m*(101.3-2.67123*r)/100],lombardi:[(l,r)=>l*Math.pow(r,.1),(m,r)=>m/Math.pow(r,.1)],oconner:[(l,r)=>l*(1+r/40),(m,r)=>m/(1+r/40)]};
let S=null;try{S=JSON.parse(localStorage.getItem('gym1'))}catch(e){}
if(!S){S={w:[{id:uid(),n:'Treino A',e:[{id:uid(),n:'Supino reto',m:'Peito',i:'',s:[{t:'w',r:12,l:30,k:60},{t:'n',r:8,l:60,k:120},{t:'n',r:7,l:60,k:120},{t:'f',r:5,l:60,k:150}]}]}],h:[],set:{min:4,max:8,inc:2.5,formula:'epley'}}}
const save=()=>{try{localStorage.setItem('gym1',JSON.stringify(S))}catch(e){}};
const V={tab:'w',w:null,o:{},sc:'',me:'v',c:null};
const est=(l,r,i)=>{r=Math.min(r,30);if(i==0&&r<=1)return l;const A=Object.values(F),k=S.set.formula;return k=='media'?A.reduce((s,f)=>s+f[i](l,r),0)/A.length:F[k][i](l,r)};
const rm=(l,r)=>r<=1?l:est(l,r,0),ld=(m,r)=>est(m,r,1);
const wk=x=>x.s.filter(s=>s.t!='w'),vol=x=>wk(x).reduce((a,s)=>a+s.r*s.l,0),e1=x=>Math.max(0,...wk(x).filter(s=>s.l>0&&s.r>0).map(s=>rm(s.l,s.r)));
const fm=n=>+Number(n).toFixed(1);
function sug(x){const{min,max,inc}=S.set,w=wk(x).filter(s=>s.l>0&&s.r>0);if(!w.length)return;const best=Math.max(...w.map(s=>rm(s.l,s.r))),top=Math.max(...w.map(s=>s.l));
if(w.every(s=>s.r>=max)){const nl=+(top+inc).toFixed(2);return{t:`Bateu o topo (${max} reps): suba para ${nl} kg × ${min} reps.`,ap(){w.forEach(s=>{s.l=nl;s.r=min})}}}
if(w.some(s=>s.r<min)){const nl=+(Math.floor(ld(best,min)/inc)*inc).toFixed(2);return{t:`Abaixo do range: tente ${nl} kg × ${min} reps (1RM est. ${fm(best)} kg).`,ap(){w.forEach(s=>{s.l=nl;s.r=min})}}}
return{t:`Mantenha a carga e busque +1 rep nas séries abaixo de ${max}.`,ap(){w.forEach(s=>{if(s.r<max)s.r++})}}}
const hdr=(t,b)=>`<div class="hd">${b?'<button class="ic" data-a="back">‹</button>':''}<h1>${t}</h1></div>`;
const del=(id,at)=>`<button class="ic" data-a="del" ${at}>${V.c==id?'❓':'🗑'}</button>`;
function rW(){return hdr('Treinos')+(S.w.length?'':'<p class="mu">Nenhum treino ainda.</p>')+S.w.map(w=>{const a=`data-l="w" data-w="${w.id}"`;return`<div class="card"><div class="row"><input class="nm" value="${esc(w.n)}" data-f="n" data-w="${w.id}"><button class="ic" data-a="up" ${a}>↑</button><button class="ic" data-a="down" ${a}>↓</button>${del(w.id,a)}</div><div class="row" style="margin-top:8px"><span class="mu" style="flex:1">${w.e.length} exercício(s)</span><button class="pri" data-a="open" data-w="${w.id}">Abrir ›</button></div></div>`}).join('')+'<button class="btn pri" data-a="addw">+ Novo treino</button>'}
function exC(w,x){const a=`data-w="${w.id}" data-e="${x.id}"`,o=V.o[x.id],sg=sug(x);
return`<div class="card"><div class="row"><label class="th">${x.i?`<img src="${x.i}">`:'📷'}<input type="file" accept="image/*" hidden data-f="img" ${a}></label><div class="g"><input class="nm" value="${esc(x.n)}" data-f="n" ${a}><select data-f="m" ${a}>${MG.map(m=>`<option${x.m==m?' selected':''}>${m}</option>`).join('')}</select></div><div class="col"><button class="ic" data-a="up" data-l="e" ${a}>↑</button><button class="ic" data-a="down" data-l="e" ${a}>↓</button>${del(x.id,'data-l="e" '+a)}</div></div>
<div class="mu" style="margin-top:6px">${x.s.length} séries · volume ${fm(vol(x))} kg · 1RM est. ${fm(e1(x))} kg</div>
<button class="lk" data-a="tog" ${a}>${o?'Ocultar séries ▴':'Editar séries ▾'}</button>
${o?`<div class="sh"><span>Tipo</span><span>Reps</span><span>Carga kg</span><span>Desc. s</span><span></span><span></span></div>`+x.s.map((s,j)=>`<div class="st t${s.t}"><select data-f="t" data-s="${j}" ${a}>${[['w','Aquec.'],['n','Normal'],['f','Falha']].map(([k,l])=>`<option value="${k}"${s.t==k?' selected':''}>${l}</option>`).join('')}</select>${['r','l','k'].map(f=>`<input type="number" inputmode="decimal" min="0" step="any" value="${s[f]}" data-f="${f}" data-s="${j}" ${a}>`).join('')}<button class="ic" data-a="tm" data-k="${s.k}">⏱</button><button class="ic" data-a="rs" data-s="${j}" ${a}>✕</button></div>`).join('')+`<button class="btn" data-a="as" ${a}>+ Série</button>`:''}
${sg?`<div class="sg">💡 ${sg.t} <button class="ic" data-a="apply" ${a}>Aplicar</button></div>`:''}</div>`}
function rWo(){const w=S.w.find(x=>x.id==V.w);if(!w){V.w=null;return rW()}const mv={};w.e.forEach(x=>mv[x.m]=(mv[x.m]||0)+vol(x));
return hdr(esc(w.n),1)+(w.e.length?Object.entries(mv).map(([m,v])=>`<span class="chip">${m}: ${fm(v)} kg</span>`).join(''):'<p class="mu">Nenhum exercício ainda.</p>')+w.e.map(x=>exC(w,x)).join('')+`<button class="btn" data-a="addex" data-w="${w.id}">+ Exercício</button><button class="btn pri" data-a="log" data-w="${w.id}">✔ Registrar treino de hoje</button><p class="mu">Volume = reps × carga (séries normais e até a falha; aquecimento não conta).</p>`}
function chart(d){const ks=Object.keys(d).sort(),v=ks.map(k=>d[k]),mn=Math.min(...v),mx=Math.max(...v),r=mx-mn||1,X=i=>30+(ks.length>1?i*280/(ks.length-1):140),Y=y=>130-(y-mn)/r*100;
return`<svg viewBox="0 0 320 160" class="ch"><polyline points="${v.map((y,i)=>X(i)+','+Y(y)).join(' ')}"/>${v.map((y,i)=>`<circle cx="${X(i)}" cy="${Y(y)}" r="3.5"/>`).join('')}<text x="2" y="34">${Math.round(mx)}</text><text x="2" y="134">${Math.round(mn)}</text><text x="30" y="154">${ks[0].slice(5)}</text><text x="310" y="154" text-anchor="end">${ks[ks.length-1].slice(5)}</text></svg>`}
function rH(){if(!S.h.length)return hdr('Histórico')+'<p class="mu">Use “✔ Registrar treino de hoje” dentro de um treino para alimentar os gráficos.</p>';
const op=[...new Set(S.h.map(h=>h.m))].map(m=>['g:'+m,'Grupo: '+m]).concat([...new Set(S.h.map(h=>h.n))].map(n=>['e:'+n,'Exercício: '+n]));
if(!op.some(o=>o[0]==V.sc))V.sc=op[0][0];const ex=V.sc[0]=='e',nm=V.sc.slice(2),met=ex?V.me:'v',d={};
S.h.filter(h=>ex?h.n==nm:h.m==nm).forEach(h=>d[h.d]=(d[h.d]||0)+(met=='v'?h.v:h.r));const ks=Object.keys(d).sort();
return hdr('Histórico')+`<div class="card"><select data-v="sc">${op.map(o=>`<option value="${esc(o[0])}"${o[0]==V.sc?' selected':''}>${esc(o[1])}</option>`).join('')}</select>${ex?`<select data-v="me" style="margin-top:6px"><option value="v"${met=='v'?' selected':''}>Volume (kg)</option><option value="r"${met=='r'?' selected':''}>1RM estimado (kg)</option></select>`:''}<div style="margin-top:10px">${chart(d)}</div><div class="mu">${ks.slice(-6).reverse().map(k=>`${k}: ${fm(d[k])} kg`).join(' · ')}</div></div>`}
function rC(){const s=S.set,n=(k,l,st)=>`<label class="mu">${l}<input type="number" step="${st}" data-k="${k}" value="${s[k]}"></label>`;
return hdr('Configurações')+`<div class="card">${n('min','Reps mínimas do range',1)}${n('max','Reps máximas do range',1)}${n('inc','Incremento de carga (kg)',.5)}<label class="mu">Fórmula de 1RM<select data-k="formula">${Object.entries(FM).map(([k,l])=>`<option value="${k}"${s.formula==k?' selected':''}>${l}</option>`).join('')}</select></label></div><p class="mu">Progressão dupla: ao atingir o máximo de reps em todas as séries de trabalho, sobe a carga e volta ao mínimo; abaixo do mínimo, sugere reduzir a carga pelo 1RM estimado; no meio do range, +1 rep.</p>`}
function draw(){app.innerHTML=V.tab=='h'?rH():V.tab=='c'?rC():V.w?rWo():rW();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==V.tab))}
let te=0,tt;const tm=document.getElementById('tm'),ts=document.getElementById('ts');
const toast=m=>{ts.textContent=m;ts.hidden=0;clearTimeout(tt);tt=setTimeout(()=>ts.hidden=1,2200)};
setInterval(()=>{if(!te)return void(tm.hidden=1);const s=Math.ceil((te-Date.now())/1000);if(s<=0){te=0;tm.hidden=1;try{navigator.vibrate&&navigator.vibrate(300)}catch(e){}return}tm.hidden=0;tm.firstChild.textContent='⏱ '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')},250);
tm.onclick=()=>{te=0};
app.onclick=e=>{const t=e.target.closest('[data-a]');if(!t)return;draw.t=0;const d=t.dataset,a=d.a,w=S.w.find(y=>y.id==d.w),x=w&&w.e.find(y=>y.id==d.e);
if(a=='back'){V.w=null}else if(a=='open'){V.w=d.w}else if(a=='addw'){S.w.push({id:uid(),n:'Treino '+(S.w.length+1),e:[]})}
else if(a=='addex'){w.e.push({id:uid(),n:'Exercício '+(w.e.length+1),m:'Peito',i:'',s:[{t:'n',r:S.set.min,l:0,k:90}]})}
else if(a=='tog'){V.o[d.e]=!V.o[d.e]}
else if(a=='as'){const l=x.s[x.s.length-1];x.s.push(l?{...l,t:l.t=='w'?'n':l.t}:{t:'n',r:8,l:0,k:90})}
else if(a=='rs'){x.s.splice(d.s,1)}
else if(a=='apply'){sug(x).ap()}
else if(a=='tm'){te=Date.now()+(+d.k||60)*1000;return}
else if(a=='log'){const dt=new Date().toLocaleDateString('sv-SE');w.e.forEach(x=>{const v=vol(x);if(!v)return;S.h=S.h.filter(h=>!(h.d==dt&&h.x==x.id));S.h.push({d:dt,x:x.id,n:x.n,m:x.m,v,r:fm(e1(x))})});toast('Treino registrado no histórico')}
else if(a=='tab'){V.tab=d.t}
else if(a=='up'||a=='down'||a=='del'){const ar=d.l=='w'?S.w:w.e,id=d.l=='w'?w.id:x.id,i=ar.findIndex(y=>y.id==id);
if(a=='del'){if(V.c!=id){V.c=id;draw();return}ar.splice(i,1);V.c=null}else{const j=i+(a=='up'?-1:1);if(j>=0&&j<ar.length)[ar[i],ar[j]]=[ar[j],ar[i]]}}
save();draw()};
app.onchange=e=>{const t=e.target,d=t.dataset;if(d.v){V[d.v]=t.value;return draw()}
if(d.k){const k=d.k;S.set[k]=k=='formula'?t.value:(parseFloat(t.value)||S.set[k]);if(S.set.min>S.set.max)S.set.max=S.set.min;save();return draw()}
const w=S.w.find(y=>y.id==d.w),x=w&&w.e.find(y=>y.id==d.e),s=x&&x.s[d.s],f=d.f;if(!f||!w)return;
if(f=='img'){const fl=t.files[0];if(!fl)return;const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,160/Math.max(im.width,im.height));c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);x.i=c.toDataURL('image/jpeg',.7);save();draw()};im.src=rd.result};rd.readAsDataURL(fl);return}
const o=s||x||w;o[f]=['r','l','k'].includes(f)?Math.max(0,parseFloat(String(t.value).replace(',','.'))||0):t.value;save();draw()};
draw();

if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
