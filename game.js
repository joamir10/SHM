(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='casefiles.v1';let mem=null,T=0,snd=false,AC,sel=[],att=0,ta={},sa={},pk=null;
const load=()=>{let d=null;try{d=JSON.parse(localStorage.getItem(KEY))}catch(e){}return CF.migrate(d)};
let S=load();
const fresh=()=>{const f=CF.fresh(S.diff);f.mentor=S.mentor;return f};
const save=()=>{mem=S;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const C=()=>CASES.find(c=>c.id===S.case);
const CH={INCIDENT_SCENE:1,AFTERMATH:1,INVESTIGATION_ROOM:2,EVIDENCE_EXAMINATION:2,TIMELINE:3,INVESTIGATION_QUESTIONS:3,DECISION_SIMULATION:4,FINAL_REPORT:5,COMPLETED:5,TESTIMONY:2,SORT:2,DRAFT:5,SEARCH:2,INTERROGATION:2};
const FIRST=[null,'INCIDENT_SCENE','SEARCH','TIMELINE','DECISION_SIMULATION','DRAFT'];
const A={c:null,want:'menu',step:0,cur:null,
MD:{off:{v:0},menu:{v:.5,n:.3,sc:[0,3,7,10,12]},calm:{v:.35,n:.2,sc:[0,7,12,15]},after:{v:.55,n:.15,sc:[0,1,6,7],g:4},invest:{v:.45,n:.4,sc:[0,3,5,7,10,12]},tense:{v:.55,n:.5,sc:[0,3,6,7,10],p:1},sim:{v:.6,n:.6,sc:[0,1,3,7,8],p:2},end:{v:.45,n:.4,sc:[0,4,7,11,12]}},
init(){const c=this.c;if(c){if(c.state==='suspended')c.resume();return}
 const x=this.c=new (window.AudioContext||window.webkitAudioContext)();
 this.m=x.createGain();this.m.gain.value=.8;this.m.connect(x.destination);
 this.mus=x.createGain();this.mus.gain.value=0;this.mus.connect(this.m);
 const d=x.createDelay(1),fb=x.createGain(),lp=x.createBiquadFilter();d.delayTime.value=.45;fb.gain.value=.45;lp.type='lowpass';lp.frequency.value=1300;
 this.mus.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(this.m);
 const b=x.createBuffer(1,x.sampleRate*2,x.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;this.nz=b;
 const q=this.q=x.createBiquadFilter();q.type='lowpass';q.frequency.value=200;q.connect(this.mus);
 this.dr=[[55,'sawtooth',.1],[55.4,'sawtooth',.1],[82.4,'triangle',.12]].map(([f,t,v])=>{const o=x.createOscillator(),g=x.createGain();o.type=t;o.frequency.value=f;g.gain.value=0;g._v=v;o.connect(g);g.connect(q);o.start();return g});
 const l=x.createOscillator(),lg=x.createGain();l.frequency.value=.07;lg.gain.value=80;l.connect(lg);lg.connect(q.frequency);l.start();
 setInterval(()=>this.tick(),260)},
apply(m){if(!this.c)return;const M=this.MD[m]||this.MD.off,t=this.c.currentTime;this.cur=M;this.dr.forEach(g=>g.gain.setTargetAtTime(M.v*g._v*3,t,1.2));this.q.frequency.setTargetAtTime(150+M.v*350,t,1.5);this.mus.gain.setTargetAtTime(M.v?1:0,t,.8)},
t(f,d,ty,v,w=0,sl=0,dest){const x=this.c;if(!x)return;const o=x.createOscillator(),g=x.createGain(),s=x.currentTime+w;o.type=ty;o.frequency.setValueAtTime(f,s);if(sl)o.frequency.exponentialRampToValueAtTime(sl,s+d);g.gain.setValueAtTime(.0001,s);g.gain.linearRampToValueAtTime(v,s+.015);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g);g.connect(dest||this.m);o.start(s);o.stop(s+d+.05)},
n(d,v,ft,f0,f1,w=0){const x=this.c;if(!x)return;const s=x.currentTime+w,o=x.createBufferSource(),f=x.createBiquadFilter(),g=x.createGain();o.buffer=this.nz;f.type=ft;f.frequency.setValueAtTime(f0,s);if(f1)f.frequency.exponentialRampToValueAtTime(f1,s+d);g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(f);f.connect(g);g.connect(this.m);o.start(s);o.stop(s+d+.05)},
tick(){const M=this.cur;if(!snd||!this.c||!M||!M.v)return;this.step++;
 if(Math.random()<M.n)this.t(220*2**(M.sc[Math.random()*M.sc.length|0]/12)*(Math.random()<.35?.5:1),2.4,'triangle',.05,0,0,this.mus);
 if(M.p&&this.step%(M.p>1?2:4)===0)this.t(62,.25,'sine',.35,0,32,this.mus);
 if(M.g)for(let k=0;k<M.g;k++)if(Math.random()<.5)setTimeout(()=>this.n(.012,.12,'highpass',2500),Math.random()*260)},
sfx(k){if(!snd||!this.c)return;const p=(f,d,ty,v,w,sl)=>this.t(f,d,ty,v,w,sl);
 ({click:()=>p(520,.06,'square',.03),
 tick:()=>p(1000+Math.random()*300,.02,'square',.012),
 ok:()=>[523,659,784].forEach((f,i)=>p(f,.18,'triangle',.07,i*.08)),
 reveal:()=>{p(392,.4,'sine',.08);p(587,.5,'sine',.06,.12)},
 bad:()=>p(160,.3,'sawtooth',.06,0,90),
 boom:()=>{this.n(2.6,.7,'lowpass',900,50);p(80,2.2,'sine',.6,0,22);this.n(.15,.5,'highpass',3000)},
 alarm:()=>{for(let i=0;i<4;i++){p(620,.16,'square',.04,i*.34);p(820,.16,'square',.04,i*.34+.17)}},
 rewind:()=>{this.n(1.4,.12,'bandpass',300,3500);p(180,1.3,'sawtooth',.03,0,900)},
 clue:()=>{p(988,.1,'sine',.04);p(1480,.22,'sine',.03,.08)},lock:()=>{p(140,.08,'square',.05);p(110,.12,'square',.05,.09)},obj:()=>{p(260,.09,'sawtooth',.07,0,700);p(520,.25,'square',.05,.09)},
 chapter:()=>[330,392,494,659].forEach((f,i)=>p(f,.7,'sine',.07,i*.14)),
 stamp:()=>{this.n(.18,.5,'lowpass',600,100);p(95,.2,'sine',.5,0,40)},
 fanfare:()=>[262,330,392,523].forEach((f,i)=>p(f,1.2,'triangle',.08,i*.25))})[k]()}};
const mood=m=>{A.want=m;if(snd&&A.c)A.apply(m)};
function beep(f){if(!snd)return;A.init();if(f===90)A.sfx('boom');else if(f===200)A.sfx('bad');else if(f===700)A.sfx('ok');else if(f===660)A.sfx('reveal');else A.t(f,.08,'square',.03)}
try{snd=localStorage.getItem('casefiles.snd')==='1'}catch(e){}
document.addEventListener('pointerdown',()=>{if(snd&&(!A.c||A.c.state!=='running')){A.init();A.apply(A.want)}});
/* ---------- Prof dialogue ---------- */
const P={q:[],i:0,done:null,tm:0,inv:null};let HX={id:'',lv:[],get:null},hbT=0;
function setHint(h,hid){HX=typeof h==='function'?{id:'',lv:[],get:h}:{id:hid||(S.state+':'+(Array.isArray(h)?h.join('|'):String(h||'')).slice(0,60)),lv:[].concat(h||[]),get:null};showHint()}
const curHint=()=>HX.get?HX.get():{id:HX.id,lv:HX.lv};
function showHint(){const H=curHint(),u=S.hu[H.id]||0;$('#ph').textContent=u&&H.lv[u-1]?`Hint ${u}/${H.lv.length}: ${H.lv[u-1]}`:''}
function say(lines,o={}){if(o.hint!==undefined)setHint(o.hint,o.hid);if(o.inv!==undefined)P.inv=o.inv;clearInterval(P.tm);P.done=o.done||null;
 if(!S.mentor&&!o.sys){P.q=[];P.i=0;$('#pt').textContent='';$('#bc').disabled=true;if(P.done){const d=P.done;P.done=null;d()}return}
 P.q=[].concat(lines);P.i=0;typ()}
function typ(){clearInterval(P.tm);const t=P.q[P.i];let n=0;$('#pt').textContent='';$('#bc').disabled=true;P.tm=setInterval(()=>{n+=2;if(n%6===0)A.sfx('tick');$('#pt').textContent=t.slice(0,n);if(n>=t.length)fin()},16)}
function fin(){clearInterval(P.tm);$('#pt').textContent=P.q[P.i]||'';$('#bc').disabled=!(P.i<P.q.length-1||P.done)}
$('#pt').onclick=fin;
$('#bc').onclick=()=>{beep(440);if(P.i<P.q.length-1){P.i++;typ()}else if(P.done){const d=P.done;P.done=null;fin();d()}};
function hb(){const b=$('#bh');b.textContent='HINT ('+S.tok+')';b.title='Hint tokens left: '+S.tok}
$('#bh').onclick=()=>{const now=Date.now();if(now-hbT<700)return;hbT=now;beep(330);const H=curHint(),L=H.lv.length?H.lv:['Look for anything highlighted or clickable.'],id=H.id||('gen:'+S.state),u=S.hu[id]||0;
 if(u>=L.length){$('#ph').textContent=`Hint ${u}/${L.length}: ${L[u-1]} (No stronger hint exists.)`;return}
 if(S.tok<=0){$('#ph').textContent=(u?`Hint ${u}/${L.length}: ${L[u-1]} `:'')+'No hint tokens left.';return}
 S.tok--;S.hu[id]=u+1;save();hb();$('#ph').textContent=`Hint ${u+1}/${L.length}: ${L[u]}`};
$('#bi').onclick=()=>{beep(520);if(P.inv)P.inv();else $$('.hs,.card,.node,.opt').forEach(e=>{e.classList.add('pulse');setTimeout(()=>e.classList.remove('pulse'),2200)})};
const mt=()=>{$('#bm').textContent='MENTOR: '+(S.mentor?'ON':'OFF');$('#bm').setAttribute('aria-pressed',!!S.mentor)};
$('#bm').onclick=()=>{S.mentor=S.mentor?0:1;save();mt();clearInterval(P.tm);if(S.mentor){P.q=['Mentor lines are on.'];P.i=0;typ()}else{$('#pt').textContent='';$('#bc').disabled=true}};
let colp=null;try{colp=localStorage.getItem('casefiles.col')}catch(e){}
const setCol=v=>{$('#prof').classList.toggle('col',v);$('#bx').textContent=v?'▸':'▾';$('#bx').setAttribute('aria-expanded',String(!v));try{localStorage.setItem('casefiles.col',v?'1':'0')}catch(e){}};
$('#bx').onclick=()=>setCol(!$('#prof').classList.contains('col'));
setCol(colp===null?matchMedia('(max-width:900px)').matches:colp==='1');mt();
$('#pic').innerHTML=PROF_SVG;
/* ---------- helpers ---------- */
const how=t=>`<div class="how px"><b>HOW TO PLAY</b><p>${t}</p></div>`;
function scene(h){$('#scene').innerHTML=h;window.scrollTo(0,0)}
let mFrom=null,mKey=null;
function modal(h){const m=$('#modal');mFrom=document.activeElement;m.innerHTML=`<div class="mbox" role="dialog" aria-modal="true" tabindex="-1">${h}</div>`;m.hidden=false;mKey=null;m.firstChild.focus()}
const closeModal=()=>{const m=$('#modal');m.hidden=true;mKey=null;if(mFrom&&document.body.contains(mFrom)&&mFrom.focus)mFrom.focus();mFrom=null};
document.addEventListener('keydown',e=>{if($('#modal').hidden)return;if(e.key==='Escape'){closeModal();return}if(mKey)mKey(e)});
function ask(msg,yes){modal(`<p>${msg}</p><button class="btn red" id="y">YES</button><button class="btn g" id="n">CANCEL</button>`);$('#y').onclick=()=>{closeModal();yes()};$('#n').onclick=closeModal}
function fx(lines,ms,cb){const f=$('#fx');f.className='fx dark';f.innerHTML=lines.map(l=>`<p>${l}</p>`).join('');setTimeout(()=>{f.className='fx';f.innerHTML='';cb&&cb()},ms)}
function unlock(n){S.max=Math.max(S.max,n);save()}
function go(st){T++;if(CH[st]!==CH[S.state])A.sfx('chapter');if(CH[st]>S.max)return;S.state=st;S.at=st;save();render()}
function prog(){return Math.round(100*(S.ev.length+Math.min(S.links.length,3)+S.tl.length+Object.keys(S.q).length+Object.keys(S.dec).length+(S.te?1:0)+(S.so?1:0)+(S.tlOk?1:0)+(S.dr?1:0)+(S.se?1:0)+(S.iv?1:0))/29)}
function maxScore(){const c=C(),it=c.items,fs=c.witnesses.reduce((n,w)=>n+w.st.filter(s=>s.c).length,0),wi=Object.keys(it).filter(k=>it[k].wit).length,ky=Object.keys(it).filter(k=>it[k].key).length;
 return 60+10*c.links.length+5*ky+10*c.search.combos.length+20+10*fs+5*wi+20+20+20+60+20*c.decisions.length+40+5*(CF.TOK[S.diff]||3)}
function top(){hb();const ch=CH[S.state]||0,p=S.case?prog():0;$('#chap').textContent=ch?`CHAPTER 0${ch}/05`:'CASE FILES';$('#pf').style.width=p+'%';$('#pp').textContent=S.case&&S.max?p+'%':'';
 $('#pips').innerHTML=[1,2,3,4,5].map(n=>`<button class="pip ${n===ch?'on':''}" data-c="${n}" ${n>S.max||!S.case?'disabled':''}>${n}</button>`).join('');
 $$('.pip').forEach(b=>b.onclick=()=>{const n=+b.dataset.c;go(CH[S.state]!==n&&CH[S.at]===n?S.at:FIRST[n])})}
const MOOD={MENU:'menu',INTRO:'tense',INCIDENT_SCENE:'calm',AFTERMATH:'after',INVESTIGATION_ROOM:'invest',EVIDENCE_EXAMINATION:'invest',TESTIMONY:'invest',SEARCH:'invest',INTERROGATION:'tense',SORT:'invest',TIMELINE:'tense',INVESTIGATION_QUESTIONS:'tense',DECISION_SIMULATION:'sim',DRAFT:'invest',FINAL_REPORT:'invest',COMPLETED:'end'};
function render(){P.inv=null;setHint([]);document.body.dataset.m=['MENU','INTRO'].includes(S.state)?'menu':'';top();mood(MOOD[S.state]||'menu');({MENU:menu,INTRO:intro,INCIDENT_SCENE:plant,AFTERMATH:after,INVESTIGATION_ROOM:()=>room(),EVIDENCE_EXAMINATION:()=>room(),TIMELINE:timeline,INVESTIGATION_QUESTIONS:quiz,TESTIMONY:testimony,SORT:sortEv,DRAFT:draft,SEARCH:search,INTERROGATION:interrogate,DECISION_SIMULATION:sim,FINAL_REPORT:report,COMPLETED:end})[S.state]()}
$('#snd').textContent=snd?'🔊':'🔇';
$('#snd').onclick=()=>{snd=!snd;$('#snd').textContent=snd?'🔊':'🔇';try{localStorage.setItem('casefiles.snd',snd?'1':'0')}catch(e){}if(snd){A.init();A.apply(A.want);beep(600)}else A.apply('off')};
$('#mn').onclick=()=>{T++;menu();top();mood('menu')};
/* ---------- menu & intro ---------- */
function menu(){const was=S.state;if(was!=='MENU'){S.at=S.at||was;}S.state='MENU';document.body.dataset.m='menu';
 const DD={rookie:'More guidance and no false leads. 5 hint tokens. 4 trust hearts.',investigator:'The standard case. Some false leads. 3 hint tokens. 3 trust hearts.',chief:'More false leads. 2 hint tokens. 2 trust hearts.'};
 scene(`<div class="menu"><h1>CASE FILES</h1><p class="s">Uncover the failures. Understand the risks. Change the outcome.</p><div class="mc">${CASES.map(c=>c.playable?`<div class="px"><div class="mut">CASE ${c.num}</div><h3>${c.title}</h3><p>${c.sub}</p><div class="diff" role="group" aria-label="Difficulty">${['rookie','investigator','chief'].map(d=>`<button class="btn sm ${S.diff===d?'':'g'}" data-d="${d}" aria-pressed="${S.diff===d}" ${S.max?'disabled':''}>${d.toUpperCase()}</button>`).join('')}</div><p class="mut">${DD[S.diff]}${S.max?' Difficulty is fixed once the case starts. Restart to change it.':''}</p><button class="btn" id="op">${S.case===c.id&&S.max?'RESUME':'OPEN CASE'}</button>${S.max?'<button class="btn g" id="rs">RESTART</button>':''}</div>`:`<div class="px lock"><div class="mut">LOCKED</div><h3>${c.title}</h3><p>${c.sub}. Coming soon.</p></div>`).join('')}</div><p><button class="btn sm g" id="mt2" aria-pressed="${!!S.mentor}">MENTOR LINES: ${S.mentor?'ON':'OFF'}</button></p></div>`);
 $$('[data-d]').forEach(b=>b.onclick=()=>{S.diff=b.dataset.d;S.tok=CF.TOK[S.diff];save();menu()});
 $('#mt2').onclick=()=>{S.mentor=S.mentor?0:1;save();mt();menu()};
 $('#op').onclick=()=>{T++;if(S.case==='chernobyl'&&S.max){S.state=S.at&&CH[S.at]?S.at:'INCIDENT_SCENE';save();render()}else{S=fresh();S.case='chernobyl';S.state='INTRO';save();render()}};
 const r=$('#rs');if(r)r.onclick=()=>ask('Reset all progress for this case? This cannot be undone.',()=>{S=fresh();save();menu();top()})}
function intro(){const L=C().intro,tok=++T;scene('<div class="intro" id="iw"></div>');let i=0;
 (function nx(){if(tok!==T)return;if(i>=L.length){$('#iw').insertAdjacentHTML('beforeend','<button class="btn" id="bg">BEGIN INVESTIGATION</button>');$('#bg').onclick=()=>{unlock(1);go('INCIDENT_SCENE')};return}
  const p=document.createElement('p');if(i===L.length-1)p.className='red';$('#iw').appendChild(p);let n=0;const t=setInterval(()=>{if(tok!==T){clearInterval(t);return}p.textContent=L[i].slice(0,++n);if(n>=L[i].length){clearInterval(t);i++;setTimeout(nx,450)}},40)})()}
/* ---------- chapter 1 ---------- */
function hotspots(objs,seen,after){const upd=()=>{$$('.hs').forEach(h=>h.classList.toggle('seen',seen.includes(+h.dataset.i)));after()};
 $$('.hs').forEach(h=>h.onclick=()=>{const i=+h.dataset.i,o=objs[i];if(!seen.includes(i)){seen.push(i);save()}$('#info').innerHTML=`<b>${o.n}</b><p>${o.t}</p>`;beep(520);upd()});upd()}
function plant(){const c=C();scene(`<div class="art px">${c.art.plant}</div><div id="info" class="info px"><b>UNIT 4, 00:50 AM</b><p>Click the dashed areas to inspect the plant.</p></div><div id="act"></div>`);
 hotspots(c.plantObjs,S.seen.p,()=>{if(S.seen.p.length>=2&&!$('#b')){$('#act').innerHTML='<button class="btn red" id="b">WATCH 01:23 AM</button>';$('#b').onclick=()=>{$('#b').disabled=true;boom()}}});
 say(c.prof.plant,{hint:'Inspect at least two areas, then the event button appears.'})}
function boom(){const tk=T;mood('off');const f=$('#fx');f.className='fx flash';$('#game').classList.add('shake');beep(90);
 setTimeout(()=>{$('#game').classList.remove('shake');if(tk!==T){f.className='fx';return}f.className='fx dark';f.innerHTML='<p>01:23 AM</p><p>UNIT 4 — REACTOR FAILURE</p><p class="red">The reactor has been destroyed.</p>'},900);
 setTimeout(()=>{f.className='fx';f.innerHTML='';if(tk===T)go('AFTERMATH')},4300)}
function after(){const c=C();scene(`<div class="art px">${c.art.after}</div><div id="info" class="info px"><b>UNIT 4, APRIL 26</b><p>Inspect the four areas of the aftermath.</p></div><div id="act"></div>`);
 hotspots(c.aftObjs,S.seen.a,()=>{if(S.seen.a.length>=4&&!$('#b')){$('#act').innerHTML='<button class="btn red" id="b">REOPEN THE CASE</button>';$('#b').onclick=()=>{unlock(2);go('SEARCH')}}});
 say(c.prof.after,{hint:'There are four areas: reactor, city, response and environment.'})}
/* ---------- chapter 2 ---------- */
function room(quiet){const c=C();S.state='INVESTIGATION_ROOM';sel=[];scene(how('Click EXAMINE on each card to add it to your board. Then click two examined cards that explain each other to test a link. You need all 6 cards and 3 correct links.')+`<div class="room"><div class="board px"><h3>EVIDENCE BOARD</h3><div class="cards" id="cd"></div><div class="mut">Examine a card, then select two discovered cards to test a connection.</div></div><div class="term px" id="tm"></div></div><div id="act"></div>`);
 drawRoom();if(!quiet)say(c.prof.room,{hint:'Start with The Test. Then look for causes and effects between cards.'})}
function drawRoom(msg){const c=C();
 $('#cd').innerHTML=c.evidence.map((e,i)=>{const id=i+1,d=S.ev.includes(id);return `<div class="card ${d?'disc':''} ${sel.includes(id)?'sel':''}" data-id="${id}"><span class="ico">${e.icon}</span><b>${e.title}</b><small>${d?'DISCOVERED':'UNEXAMINED'}</small><button class="btn sm ex" data-id="${id}">${d?'REVIEW':'EXAMINE'}</button></div>`}).join('');
 $('#tm').innerHTML=`<p>> TERMINAL READY</p><p>> EVIDENCE ${S.ev.length}/6</p><p>> CONNECTIONS ${S.links.length}/${c.links.length} (need 3)</p>`+S.links.map(k=>{const [a,b]=k.split('-');return `<p>> LINK: ${c.evidence[a-1].title} + ${c.evidence[b-1].title}</p>`}).join('')+(msg?`<p>> ${msg}</p>`:'');
 $$('.ex').forEach(b=>b.onclick=e=>{e.stopPropagation();exam(+b.dataset.id)});
 $$('.card').forEach(k=>k.onclick=()=>{const id=+k.dataset.id;if(!S.ev.includes(id)){drawRoom('Examine this evidence first.');return}sel=sel.includes(id)?sel.filter(x=>x!==id):sel.concat(id);if(sel.length===2)link();else drawRoom()});
 const ok=S.ev.length===6&&S.links.length>=3;
 $('#act').innerHTML=ok?'<button class="btn red" id="tb">OPEN THE WITNESS FILES</button>':`<p class="mut">Collect all 6 evidence cards and find 3 connections to continue (${S.ev.length}/6, ${S.links.length}/3).</p>`;
 if(ok)$('#tb').onclick=()=>{go('TESTIMONY')}}
function link(){const c=C(),[a,b]=sel.slice().sort((x,y)=>x-y),L=c.links.find(l=>l[0]===a&&l[1]===b);sel=[];
 if(L){const k=a+'-'+b;
  if(!S.links.includes(k)){const first=!S.links.length;S.links.push(k);S.score+=10;save();beep(700);say(first?[c.prof.firstLink,L[2]]:['Connected. '+L[2]]);drawRoom('CONNECTION CONFIRMED')}
  else{say('You already made that connection. '+L[2]);drawRoom('ALREADY CONNECTED')}}
 else{say('Interesting guess, but I see no direct cause-and-effect link between those two. Ask: does one change the risk created by the other?');drawRoom('NO DIRECT LINK FOUND');beep(200)}}
function exam(id){const e=C().evidence[id-1],had=S.ev.includes(id);S.state='EVIDENCE_EXAMINATION';
 const nt=()=>`<div class="note px"><b>INVESTIGATOR NOTE</b><p>${e.note}</p><p class="tag">SAFETY CONCEPT: ${e.concept}</p></div>`;
 modal(`<h3>${e.icon} EVIDENCE 0${id}: ${e.title}</h3><p class="doc">${e.text}</p><div id="nt">${had?nt():'<button class="btn" id="rv">REVEAL INVESTIGATOR NOTE</button>'}</div><button class="btn g" id="cl">CLOSE</button>`);
 const rv=$('#rv');if(rv)rv.onclick=()=>{S.ev.push(id);S.score+=10;save();beep(660);$('#nt').innerHTML=nt()};
 $('#cl').onclick=()=>{closeModal();S.state='INVESTIGATION_ROOM';top();drawRoom();if(!had&&S.ev.includes(id))say(e.prof)}}
/* ---------- chapter 3 ---------- */
function timeline(){const c=C();att=0;pk=null;
 if(!S.tlIn){S.tlIn=1;save();A.sfx('rewind');fx(['RECONSTRUCTING THE EVENTS...','APRIL 25, 1986'],2400)}
 if(!S.tlOrder){let o;do{o=[0,1,2,3,4,5].sort(()=>Math.random()-.5)}while(o.some((v,i)=>v===i));S.tlOrder=o;save()}
 const clue=e=>e.text.split('. ')[0]+'.';
 function draw(){const o=S.tlOrder,ok=S.tlOk;
  scene((ok?'':how('The six events are scrambled and their times are hidden. Click one card, then another, to swap them. Press CHECK ORDER to see how many sit in the right place. Details stay locked until the order is right.'))+`<div class="tl">${o.map((ei,p)=>{const e=c.tlEvents[ei];return `<button class="node ${S.tl.includes(ei)?'seen':''} ${pk===p?'sel':''}" data-p="${p}"><small>${ok?e.when:'TIME UNKNOWN'}</small><b>${e.title}</b><small>${ok?'':clue(e)}</small></button>`}).join('')}</div><div id="info" class="info px"><b>TIMELINE</b><p>${ok?'Open every event to follow the chain of failures.':'Order not verified yet.'}</p></div><div id="act"></div>`);
  const chk=()=>{if(ok&&S.tl.length===6&&!$('#qb')){$('#act').innerHTML='<button class="btn red" id="qb">BEGIN INVESTIGATION QUESTIONS</button>';$('#qb').onclick=()=>{S.state='INVESTIGATION_QUESTIONS';S.at=S.state;save();render()}}};
  if(!ok){$('#act').innerHTML='<button class="btn" id="ck">CHECK ORDER</button>';$('#ck').onclick=()=>{const n=o.filter((v,i)=>v===i).length;
   if(n===6){S.tlOk=1;S.score+=att?10:20;save();top();beep(700);say(c.prof.tl2);draw();return}
   att++;beep(200);$('#info').innerHTML=`<b>ORDER CHECK</b><p class="bad">${n} of 6 events are in the right place. Swap and check again.</p>`;say('For each event ask: what had to happen before it could happen?',{hint:'The test comes first. The explosion is the last link in the chain.'})}}
  $$('.node').forEach(n=>n.onclick=()=>{const p=+n.dataset.p,i=o[p];
   if(!ok){if(pk===null)pk=p;else{[o[pk],o[p]]=[o[p],o[pk]];pk=null;save()}beep(480);draw();return}
   const e=c.tlEvents[i];if(!S.tl.includes(i)){S.tl.push(i);save()}n.classList.add('seen');beep(480);
   $('#info').innerHTML=`<b>${e.when}: ${e.title}</b><p>${e.text}</p>`+(e.diag?`<div class="diag">${e.diag.map(x=>`<span>${x}</span>`).join('<i>→</i>')}<i>↺ repeats</i></div>`:'');
   say(e.prof);top();if(S.tl.length===6)setTimeout(()=>{say(c.prof.tlDone);chk()},900);chk()});
  chk()}
 draw();say(S.tlOk?c.prof.tl2:c.prof.tl,{hint:'Click a card, then another card, to swap them.'})}
/* ---------- shared: clues, toasts, stamps ---------- */
function giveItem(id){const x=C().items[id];if(!x||S.inv.includes(id))return false;S.inv.push(id);if(x.key||x.wit)S.score+=5;save();toast(x);top();return true}
function toast(x){const t=document.createElement('div');t.className='toast';t.innerHTML=`<b>${x.key?'KEY CLUE':'NEW CLUE'}</b> ${x.ic} ${x.n}${x.src?` <span class="tag">[${x.src}]</span>`:''}`;$('#toast').appendChild(t);A.sfx('clue');setTimeout(()=>t.remove(),3400)}
function stamp(t,cls){const s=document.createElement('div');s.className='stampfx '+(cls||'');s.textContent=t;document.body.appendChild(s);setTimeout(()=>s.remove(),1300)}
const refTxt=x=>`${x.ic} ${x.n}: ${x.t}`+(x.src?` <span class="tag">[${x.src}]</span>`:'');
const rhOn=id=>{const x=C().items[id];return !!x&&(!x.rh||(CF.DL[S.diff]||0)>=x.rh)};
const hsItem=o=>o.it&&rhOn(o.it)?o.it:null;
const invChips=(sel,on)=>{const it=C().items;return S.inv.length?S.inv.map(id=>`<button class="chip ${sel&&sel.includes(id)?'sel':''}" data-id="${id}" aria-pressed="${!!(sel&&sel.includes(id))}">${it[id].ic} ${it[id].n}</button>`).join(''):'<span class="mut">empty</span>'};
/* ---------- chapter 2: search scenes ---------- */
const SORDER=['c1','c3','c2','k1','c4','c5'];
function searchHint(){const it=C().items,m=SORDER.find(i=>!S.inv.includes(i));
 if(m)return{id:'search:'+m,lv:it[m].h||[]};
 return{id:'search:log',lv:['You hold every key clue. Open the case log.','Each log entry needs one conclusion and one clue as proof.','The proof must show the conclusion directly. A rumour is not proof.']}}
function keypad(o,ok){const it=C().items;let v='',tries=0;
 modal(`<h3>TERMINAL</h3><p>The screen asks for the <b>4-digit programme reference number</b>. A reference number is printed on a document you may already hold.</p><div class="lcd" id="lcd" aria-live="polite"></div><div class="kp">${[1,2,3,4,5,6,7,8,9,'CLR',0,'ENTER'].map(k=>`<button class="btn g kb" data-k="${k}">${k}</button>`).join('')}</div><p id="kf" class="bad" role="alert"></p><p class="mut">Check your clues:</p><div id="kc" class="inv">${invChips()}</div><div id="kd" class="doc">Click a clue to read it here.</div><button class="btn g" id="cl">CLOSE</button>`);
 const lcd=()=>{$('#lcd').textContent=(v+'____').slice(0,4).split('').join(' ')};
 const press=k=>{const f=$('#kf');
  if(/^\d$/.test(k)){if(v.length<4)v+=k;A.sfx('click');f.textContent=''}
  else if(k==='CLR'){v='';A.sfx('click');f.textContent=''}
  else if(k==='BS'){v=v.slice(0,-1);f.textContent=''}
  else if(k==='ENTER'){if(v.length<4){f.textContent='Enter all 4 digits first.';return lcd()}
   if(v===o.code){closeModal();ok();return}
   tries++;A.sfx('bad');f.textContent=tries<2?'ACCESS DENIED. That is not the reference number.':'ACCESS DENIED. Read the reference number on the document again. It has exactly 4 digits.';v='';$('#lcd').classList.add('deny');setTimeout(()=>{const l=$('#lcd');if(l)l.classList.remove('deny')},500)}
  lcd()};
 lcd();$$('.kb').forEach(b=>b.onclick=()=>press(b.dataset.k));
 $$('#kc .chip').forEach(b=>b.onclick=()=>{$('#kd').innerHTML=refTxt(it[b.dataset.id]);$('.mbox').focus()});
 $('#cl').onclick=closeModal;
 mKey=e=>{if(/^\d$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('BS');else if(e.key==='Enter'){const a=document.activeElement;if(a&&(a.classList.contains('kb')||a.id==='cl'))return;e.preventDefault();press('ENTER')}}}
function caselog(){const c=C(),R=c.search.log;
 modal('<h3>CASE LOG</h3><p class="mut">Pick a conclusion and one clue as proof for each entry. The log only tells you how many entries are right, not which.</p>'+R.map((r,i)=>`<div class="note px"><p>${r.q}</p><select id="a${i}" aria-label="Conclusion ${i+1}"><option value="">Choose a conclusion</option>${r.o.map((o,k)=>`<option value="${k}">${o}</option>`).join('')}</select><select id="p${i}" aria-label="Proof ${i+1}"><option value="">Choose your proof</option>${S.inv.map(id=>`<option value="${id}">${c.items[id].n}</option>`).join('')}</select></div>`).join('')+'<div id="lf" role="alert"></div><button class="btn red" id="lg">CONFIRM LOG</button><button class="btn g" id="cl">CLOSE</button>');
 $('#cl').onclick=closeModal;
 $('#lg').onclick=()=>{const ok=R.map((r,i)=>$('#a'+i).value!==''&&+$('#a'+i).value===r.a&&r.p.includes($('#p'+i).value)),n=ok.filter(Boolean).length;
  if(n===R.length){closeModal();S.se=1;S.score+=att?10:20;save();top();A.sfx('stamp');stamp('LOG CONFIRMED','good');go('INVESTIGATION_ROOM')}
  else{att++;S.wrong=(S.wrong||0)+1;save();A.sfx('bad');$('#lf').innerHTML=`<p class="bad">The log does not confirm. ${n} of ${R.length} entries are right. Re-read your clues.</p>`}}}
function search(){const c=C(),sc=c.search,it=c.items,KT=Object.keys(it).filter(k=>it[k].key).length;let cb=[],cur=sc.scenes.find(s=>s.id===S.sc)||sc.scenes[0];att=0;
 const keyN=()=>S.inv.filter(i=>it[i].key).length,clues=s=>s.objs.filter(o=>hsItem(o)),got=s=>clues(s).filter(o=>S.found.includes(o.id)).length;
 const show=h=>{$('#info').innerHTML=h};
 scene(how('1. Click things in a room to search them. 2. Clues go into your inventory. 3. Click two clues in the inventory to combine them. 4. A lock needs a key or a code from somewhere else. Use the room tabs to move around.')+'<div class="tabs" id="tabs" role="tablist"></div><div class="scn px '+(S.diff==='rookie'?'guide':'')+'"><div id="rm" class="art"></div><div id="tip" class="tip"></div></div><div id="inv" class="inv px"></div><div id="info" class="info px" aria-live="polite"></div><div id="act"></div>');
 const rc=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" pointer-events="none"/>`;
 const hsSVG=()=>cur.objs.map(o=>{const f=S.found.includes(o.id),lk=!f&&S.tried.includes(o.id),w=Math.max(o.w,22),h=Math.max(o.h,22),x=Math.max(0,Math.min(o.x-(w-o.w)/2,320-w)),y=Math.max(0,Math.min(o.y-(h-o.h)/2,180-h)),bx=x+w-9,by=y+2;
  let s=`<rect class="hs2${f?' done':''}" data-id="${o.id}" x="${x}" y="${y}" width="${w}" height="${h}" tabindex="0" role="button" aria-label="${f?'Searched: ':'Search: '}${o.n}"/>`;
  if(f)s+=rc(bx,by,7,7,'#8daa83')+`<path d="M${bx+1.5} ${by+3.5}l1.5 1.5l2.5-3" stroke="#101114" fill="none" stroke-width="1" pointer-events="none"/>`;
  else if(lk)s+=rc(bx,by+3,7,5,'#d9b45b')+rc(bx+1,by,1,3,'#d9b45b')+rc(bx+5,by,1,3,'#d9b45b')+rc(bx+1,by,5,1,'#d9b45b');
  return s}).join('');
 const take=o=>{S.found.push(o.id);const x=hsItem(o);
  if(x){giveItem(x);show(`<b>${o.n}</b><p>${o.m}</p><p class="doc">${refTxt(it[x])}</p>`)}
  else show(`<b>${o.n}</b><p>${o.it&&o.m2?o.m2:o.m}</p>`);
  beep(520);save();paint();
  if(x&&keyN()>=KT&&!S.se)say('That is every key clue. Open the case log and commit.',{sys:true})};
 const inspect=id=>{const o=cur.objs.find(k=>k.id===id);if(!o)return;
  if(S.found.includes(id)){const x=hsItem(o);show(`<b>${o.n}</b><p>${o.it&&!x&&o.m2?o.m2:o.m}</p>`+(x?'<p class="mut">Already searched. The clue is in your inventory.</p>':''));beep(520);return}
  if(o.lock&&!S.inv.includes(o.lock)){if(!S.tried.includes(id)){S.tried.push(id);save()}show(`<b>${o.n}: LOCKED</b><p>${o.lockMsg}</p>`);A.sfx('lock');paint();return}
  if(o.code){show(`<b>${o.n}</b><p>The screen asks for a 4-digit programme reference number.</p>`);keypad(o,()=>{A.sfx('ok');take(o)});if(!S.tried.includes(id)){S.tried.push(id);save()}return}
  take(o)};
 const bind=()=>{const scn=$('.scn'),tip=$('#tip');$$('.hs2').forEach(h=>{const id=h.dataset.id,o=cur.objs.find(k=>k.id===id);
  h.onmousemove=e=>{const b=scn.getBoundingClientRect();tip.textContent=S.found.includes(id)?o.n:'SEARCH';tip.style.cssText=`display:block;left:${e.clientX-b.left+14}px;top:${e.clientY-b.top+14}px`};
  h.onmouseleave=()=>{tip.style.display='none'};
  h.onclick=()=>{tip.style.display='none';inspect(id)};
  h.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect(id)}}})};
 const chip=id=>{beep(480);const x=it[id];show(`<b>${x.ic} ${x.n}</b><p class="doc">${x.t}${x.src?` <span class="tag">[${x.src}]</span>`:''}</p>`);cb=cb.includes(id)?cb.filter(y=>y!==id):cb.concat(id);
  if(cb.length===2){const [a,b]=cb,m=sc.combos.find(k=>(k[0]===a&&k[1]===b)||(k[0]===b&&k[1]===a));cb=[];
   if(m&&!S.inv.includes(m[2])){giveItem(m[2]);S.score+=10;save();A.sfx('ok');show(`<b>CLUES COMBINED</b><p class="doc">${refTxt(it[m[2]])}</p>`);say('Two documents, one story.',{})}
   else if(m)show('<b>COMBINE</b><p>You already made that connection.</p>');
   else{show('<b>COMBINE</b><p>These two clues do not combine.</p>');A.sfx('bad')}}
  paint()};
 const recheck=()=>{const un=$$('.hs2').filter(h=>!S.found.includes(h.dataset.id));un.forEach(h=>{h.classList.add('pulse');setTimeout(()=>h.classList.remove('pulse'),2200)});if(!un.length)show('<b>RE-CHECK</b><p>Every spot in this room has been searched.</p>')};
 const paint=()=>{
  $('#tabs').innerHTML=sc.scenes.map(s=>`<button class="tab ${s.id===cur.id?'on':''}" role="tab" aria-selected="${s.id===cur.id}" data-s="${s.id}">${s.title}<small>${got(s)} of ${clues(s).length} clues</small></button>`).join('');
  $$('.tab').forEach(b=>b.onclick=()=>{cur=sc.scenes.find(s=>s.id===b.dataset.s);S.sc=cur.id;save();A.sfx('click');cb=[];show(`<b>${cur.title}</b><p>${cur.intro}</p>`);paint()});
  $('#rm').innerHTML=ART.svg(cur.id,hsSVG());bind();
  $('#inv').innerHTML='<b class="tag">INVENTORY</b> '+invChips(cb)+'<p class="mut inh">Click two clues to combine them.</p>';
  $$('#inv .chip').forEach(b=>b.onclick=()=>chip(b.dataset.id));
  const cn=sc.combos.filter(m=>S.inv.includes(m[2])).length,aG=sc.scenes.reduce((n,s)=>n+got(s),0),aT=sc.scenes.reduce((n,s)=>n+clues(s).length,0);
  $('#act').innerHTML=`<p class="mut">All rooms: ${aG} of ${aT} clues. Combined clues: ${cn} of ${sc.combos.length}. Key clues: ${keyN()} of ${KT}.</p><button class="btn sm g" id="rc">RE-CHECK THIS ROOM</button>`+(keyN()>=KT?`<button class="btn red" id="nb">${S.se?'CONTINUE TO THE EVIDENCE BOARD':'OPEN THE CASE LOG'}</button>`:'');
  $('#rc').onclick=recheck;const nb=$('#nb');if(nb)nb.onclick=()=>S.se?go('INVESTIGATION_ROOM'):caselog();
  showHint()};
 show(`<b>${cur.title}</b><p>${cur.intro}</p>`);paint();
 say('Search every room. Some spots are empty. Some hold false leads.',{hint:searchHint,inv:recheck})}
/* ---------- chapter 2: interrogation ---------- */
function portrait(w){const a=w.acc;return `<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><rect x="3" y="1" width="10" height="4" fill="${w.hair}"/><rect x="4" y="4" width="8" height="7" fill="${w.skin}"/><rect x="5" y="6" width="2" height="2" fill="#101114"/><rect x="9" y="6" width="2" height="2" fill="#101114"/><rect x="6" y="9" width="4" height="1" fill="#8a5a44"/><rect x="2" y="11" width="12" height="5" fill="${w.cloth}"/><rect x="7" y="11" width="2" height="5" fill="#e8e5dc"/>`+(a==='cap'?'<rect x="3" y="0" width="10" height="2" fill="#2a3a22"/><rect x="2" y="3" width="12" height="1" fill="#2a3a22"/>':a==='glasses'?'<rect x="4" y="5" width="4" height="4" fill="none" stroke="#cfd2d6" stroke-width=".7"/><rect x="8" y="5" width="4" height="4" fill="none" stroke="#cfd2d6" stroke-width=".7"/>':a==='helmet'?'<rect x="3" y="0" width="10" height="3" fill="#d9b45b"/><rect x="2" y="3" width="12" height="1" fill="#d9b45b"/>':a==='tie'?'<rect x="7" y="11" width="2" height="4" fill="#c94b45"/>':'')+'</svg>'}
function interrogate(){const c=C(),W=c.witnesses,TN=CF.TRUST[S.diff]||3;
 let wi=Math.min(S.iw||0,W.length-1);while(wi<W.length-1&&S.wd[W[wi].id]==='done')wi++;if(wi!==S.iw){S.iw=wi;save()}
 const w=W[wi],wid=w.id,last=wi===W.length-1;
 if(S.wd[wid]==='done'&&last){S.iv=1;save();return go('SORT')}
 const tr=()=>S.tr[wid]??TN,asked=()=>S.asked[wid]||(S.asked[wid]=[]),closed=()=>S.closed[wid]||(S.closed[wid]=[]),contra=i=>S.ex.includes(wid+'.'+i),
  need=w.st.map((s,i)=>s.c?i:-1).filter(i=>i>=0),done=()=>need.every(contra),over=()=>tr()<=0||S.wd[wid]==='ended',
  askState=a=>asked().includes(a.id)?'done':closed().includes(a.id)?'closed':S.lost.includes(wid+'.'+a.id)?'lost':(a.req&&!contra(a.req.st))?'locked':'open';
 let pr=-1,msg='';
 scene(how('Read each statement. If one of your clues proves it false, press PRESENT A CLUE and pick that clue. PRESS asks for more detail and is free. A wrong clue costs 1 trust heart and closes a question. At zero hearts the witness leaves, and you lose clues only that person held. Not every statement is false.')+'<div id="inv" class="inv px"></div><div id="idet" class="doc" hidden></div><div class="qa px" id="w2"></div><div id="act"></div>');
 const pickClose=()=>{const o=w.asks.filter(a=>askState(a)==='open');return o.find(a=>a.gives)||o[0]||null};
 const wrong=(i,id)=>{const x=c.items[id],cl=pickClose();S.tr[wid]=tr()-1;S.wrong=(S.wrong||0)+1;A.sfx('bad');
  msg=(x.rm||'That clue does not contradict this statement.')+' Trust -1.';
  if(cl){closed().push(cl.id);msg+=` The question "${cl.q}" is now closed.`}
  if(tr()<=0){S.wd[wid]='ended';const lost=w.asks.filter(a=>a.gives&&askState(a)!=='done'&&!S.lost.includes(wid+'.'+a.id));lost.forEach(a=>S.lost.push(wid+'.'+a.id));
   msg+=` ${w.n} ends the interview.`+(lost.length?` You lose ${lost.length} clue${lost.length>1?'s':''} only this witness held.`:'')}
  save();draw()};
 const nxt=()=>{S.wd[wid]=S.wd[wid]==='ended'?'ended':'done';if(last){S.iv=1;save();go('SORT')}else{S.iw=wi+1;save();interrogate()}};
 const leave=()=>{const n=w.asks.filter(a=>askState(a)==='open').length;if(n&&!over())ask(`You can still ask ${n} question${n>1?'s':''}. Leave anyway?`,nxt);else nxt()};
 const draw=()=>{const t=Math.max(tr(),0),dead=over();
  $('#inv').innerHTML='<b class="tag">INVENTORY</b> '+invChips();$$('#inv .chip').forEach(b=>b.onclick=()=>{const d=$('#idet');d.hidden=false;d.innerHTML=refTxt(c.items[b.dataset.id])});
  const open=w.asks.filter(a=>askState(a)==='open'),lockedN=w.asks.filter(a=>askState(a)==='locked').length;
  $('#w2').innerHTML=`<div class="wit">${portrait(w)}<div><h3>${w.n}</h3><p class="mut">${w.role}. Witness ${wi+1} of ${W.length}.</p><p class="mut">"${w.line}"</p><p class="hearts" role="img" aria-label="Trust ${t} of ${TN}">TRUST ${'♥'.repeat(t)}${'♡'.repeat(TN-t)}</p></div></div>`
   +'<h3 class="sub">TESTIMONY</h3>'+w.st.map((s,i)=>{const ex=contra(i);return `<div class="bub${ex?' hit':''}"><p>"${s.s}"</p>`+(ex?`<p class="good"><b>CONTRADICTION.</b> ${s.ok}</p>`:`<button class="btn sm g" data-p="${i}" ${dead?'disabled':''}>PRESS</button><button class="btn sm" data-r="${i}" ${dead?'disabled':''}>PRESENT A CLUE</button>${pr===i?`<p class="mut">${s.press}</p>`:''}`)+'</div>'}).join('')
   +'<h3 class="sub">QUESTIONS</h3>'+w.asks.map(a=>{const st=askState(a);
    if(st==='done')return `<div class="ask done"><b>${a.q}</b><p>${a.a}</p></div>`;
    if(st==='open')return `<button class="opt ask" data-a="${a.id}" ${dead?'disabled':''}>${a.q}</button>`;
    if(st==='closed')return `<div class="ask shut">${a.q} <span class="bad">(closed)</span></div>`;
    if(st==='lost')return `<div class="ask shut">${a.q} <span class="bad">(lost)</span></div>`;return ''}).join('')
   +(lockedN&&!dead?'<p class="mut">Catching a contradiction can open new questions.</p>':'')
   +(msg?`<p class="bad" role="alert">${msg}</p>`:'')+(dead&&!msg?`<p class="bad"><b>${w.n} has ended the interview.</b></p>`:'');
  $$('[data-p]').forEach(b=>b.onclick=()=>{pr=+b.dataset.p;msg='';beep(330);draw()});
  $$('[data-a]').forEach(b=>b.onclick=()=>{const a=w.asks.find(k=>k.id===b.dataset.a);asked().push(a.id);if(a.gives)giveItem(a.gives);save();beep(520);msg='';draw()});
  $$('[data-r]').forEach(b=>b.onclick=()=>{const i=+b.dataset.r,s=w.st[i];
   modal('<h3>PRESENT WHICH CLUE?</h3><p class="mut">Pick the clue that proves this statement false. A wrong pick costs trust.</p><div class="doc">"'+s.s+'"</div>'+(S.inv.length?S.inv.map(id=>{const x=c.items[id];return `<button class="opt" data-it="${id}"><span><b>${x.ic} ${x.n}</b><br><small>${x.t}</small></span></button>`}).join(''):'<p>Your inventory is empty.</p>')+'<button class="btn g" id="cl">CANCEL</button>');$('#cl').onclick=closeModal;
   $$('[data-it]').forEach(x=>x.onclick=()=>{closeModal();const id=x.dataset.it;
    if(s.c&&s.c.includes(id)){S.ex.push(wid+'.'+i);S.score+=10;save();top();A.sfx('obj');msg='';pr=-1;draw();stamp('CONTRADICTION');say(['Got it.','That does not survive the record.','Caught. Keep going.'][i%3],{})}
    else wrong(i,id)})});
  $('#act').innerHTML=dead?`<button class="btn red" id="rt">TRY AGAIN WITH 1 HEART (-10 SCORE)</button><button class="btn g" id="mv">${last?'CONTINUE':'NEXT WITNESS'}</button>`:(done()?`<button class="btn red" id="nx">${last?'SORT THE EVIDENCE':'NEXT WITNESS'}</button>`:'<p class="mut">Catch every false statement to continue.</p>');
  const rt=$('#rt');if(rt)rt.onclick=()=>{S.tr[wid]=1;delete S.wd[wid];S.score=Math.max(0,S.score-10);msg='';save();top();draw()};
  const mv=$('#mv');if(mv)mv.onclick=nxt;const nx=$('#nx');if(nx)nx.onclick=leave;showHint()};
 const intHint=()=>{const i=need.find(k=>!contra(k));return i===undefined?{id:'wit:'+wid+':done',lv:['No false statements are left for this witness.','Questions you have not asked may still give clues.','Leave when you are ready.']}:{id:'wit:'+wid+':'+i,lv:w.st[i].h}};
 draw();say(`${w.n}. ${w.role}. Listen to every claim.`,{hint:intHint})}
function testimony(skip){const c=C(),ts=c.testimonies;att=0;ta=S.te?Object.fromEntries(ts.map((t,i)=>[i,t.f?0:1])):{};
 scene(how('Five statements from the record. Press REVIEW EVIDENCE and check each claim against what you collected. Mark every statement HOLDS UP or CONTRADICTS. Nothing tells you which are wrong; a failed check only tells you how many verdicts are off.')+`<div class="qa px"><h3>WITNESS FILES</h3><button class="btn g" id="oe">REVIEW EVIDENCE</button>${ts.map((t,i)=>`<div class="note px"><span class="tag">${t.who}</span><p>${t.s}</p><div id="w${i}"></div></div>`).join('')}<div id="fb"></div><div id="act"></div></div>`);
 $('#oe').onclick=()=>{modal('<h3>YOUR EVIDENCE</h3>'+c.evidence.map((e,i)=>`<p class="doc"><b>0${i+1} ${e.title}</b><br>${e.text}</p>`).join('')+'<button class="btn g" id="cl">CLOSE</button>');$('#cl').onclick=closeModal};
 const paint=()=>{ts.forEach((t,i)=>{$('#w'+i).innerHTML=`<button class="btn sm ${ta[i]===1?'':'g'}" data-i="${i}" data-v="1" ${S.te?'disabled':''}>HOLDS UP</button><button class="btn sm ${ta[i]===0?'red':'g'}" data-i="${i}" data-v="0" ${S.te?'disabled':''}>CONTRADICTS</button>`+(S.te?`<p class="mut">${t.why}</p>`:'')});
  $$('[data-v]').forEach(b=>b.onclick=()=>{ta[+b.dataset.i]=+b.dataset.v;beep(480);paint()});
  $('#act').innerHTML=S.te?'<button class="btn red" id="nx">FACE THE WITNESSES</button>':'<button class="btn" id="sb">SUBMIT VERDICTS</button>';
  const nx=$('#nx');if(nx)nx.onclick=()=>go('INTERROGATION');
  const sb=$('#sb');if(sb)sb.onclick=()=>{if(ts.some((t,i)=>!(i in ta))){$('#fb').innerHTML='<p class="bad">Mark all five statements first.</p>';return}
   const w=ts.filter((t,i)=>ta[i]!==(t.f?0:1)).length;
   if(w){att++;beep(200);$('#fb').innerHTML=`<p class="bad"><b>${w} of 5 verdicts are wrong.</b> Go back to the evidence and check each claim again.</p>`;say('Do not trust a statement because of who said it. Check it against a document.',{hint:'Compare each claim with the exact wording on the evidence cards.'});return}
   S.te=1;S.score+=att?10:20;save();top();beep(700);testimony(1);say('Good. You tested testimony against evidence instead of trusting it.')}};
 paint();if(!skip)say(S.te?'Your verdicts are in. Review them, then face the witnesses.':c.prof.te,{hint:'Compare each claim with the exact wording on the evidence cards.'})}
function sortEv(skip){const c=C(),cats=['TECHNICAL','HUMAN / OPERATIONAL','ORGANIZATIONAL'],key=c.sortKey;att=0;pk=null;sa={};if(S.so)key.forEach((k,i)=>sa[i]=k);
 const card=(i,pl)=>{const e=c.evidence[i];return `<div class="card ${pk===i?'sel':''}" data-i="${i}" data-pl="${pl}"><span class="ico">${e.icon}</span><b>${e.title}</b><small>${e.text}</small></div>`};
 scene(how('Click an evidence card to pick it up, then click the category box where it belongs. Click a placed card to take it back. When all 6 are placed, submit. A failed check only tells you how many cards are misplaced.')+`<div class="qa px"><h3>SORT THE EVIDENCE</h3><div id="sb"></div><div id="fb"></div><div id="act"></div></div>`);
 if(S.so)$('#fb').innerHTML=`<p class="good">${c.sortWhy}</p>`;
 const paint=()=>{const un=[0,1,2,3,4,5].filter(i=>!(i in sa));
  $('#sb').innerHTML=`<div class="cards">${un.map(i=>card(i,0)).join('')}</div><div class="bk">${cats.map((n,k)=>`<div class="px bucket" data-k="${k}"><h3>${n}</h3>${Object.keys(sa).filter(i=>sa[i]===k).map(i=>card(+i,1)).join('')}</div>`).join('')}</div>`;
  $$('#sb .card').forEach(x=>x.onclick=e=>{e.stopPropagation();if(S.so)return;const i=+x.dataset.i;if(+x.dataset.pl)delete sa[i];else pk=pk===i?null:i;paint()});
  $$('.bucket').forEach(b=>b.onclick=()=>{if(S.so||pk===null)return;sa[pk]=+b.dataset.k;pk=null;beep(480);paint()});
  $('#act').innerHTML=S.so?'<button class="btn red" id="nx">TRAVEL BACK TO APRIL 25</button>':`<button class="btn" id="sm" ${Object.keys(sa).length<6?'disabled':''}>SUBMIT CLASSIFICATION</button>`;
  const nx=$('#nx');if(nx)nx.onclick=()=>{unlock(3);go('TIMELINE')};
  const sm=$('#sm');if(sm)sm.onclick=()=>{const w=key.filter((k,i)=>sa[i]!==k).length;
   if(w){att++;beep(200);$('#fb').innerHTML=`<p class="bad"><b>${w} of 6 cards are in the wrong category.</b></p>`;say(att>1?c.prof.sortHint:'Not quite. Re-read each card and ask what kind of cause it describes.');return}
   S.so=1;S.score+=att?10:20;save();top();beep(700);$('#fb').innerHTML=`<p class="good">${c.sortWhy}</p>`;say('Correct. Now we can go back and see how these causes lined up in time.');paint()}};
 paint();if(!skip)say(S.so?'Evidence sorted. Travel back when you are ready.':c.prof.so,{hint:'Machine behaviour, what was done on the night, or the system around everyone?'})}

function quiz(){const c=C(),qs=c.questions,i=qs.findIndex(q=>!(q.id in S.q));
 if(i<0)return afterQuiz();const q=qs[i];att=0;
 scene(`<div class="qa px"><div class="mut">QUESTION ${i+1} / 3: ${q.tag}</div><h3>${q.q}</h3><div id="os">${q.o.map((o,k)=>`<label class="opt"><input type="${q.multi?'checkbox':'radio'}" name="o" value="${k}"><span>${o}</span></label>`).join('')}</div><div id="fb"></div><div id="act"><button class="btn" id="sb">SUBMIT ANSWER</button></div></div>`);
 $('#sb').onclick=()=>{const v=$$('#os input:checked').map(x=>+x.value).sort();if(!v.length){$('#fb').innerHTML='<p class="bad">Select an answer first.</p>';return}
  if(JSON.stringify(v)===JSON.stringify(q.a)){const pts=att?10:20;S.q[q.id]=att+1;S.score+=pts;save();top();beep(700);$$('#os input').forEach(x=>x.disabled=true);
   $('#fb').innerHTML=`<p class="good"><b>CORRECT.</b> ${q.exp}</p>`;$('#act').innerHTML='<button class="btn" id="nx">NEXT</button>';$('#nx').onclick=quiz;say(['Good reasoning. '+q.exp])}
  else{att++;beep(200);$('#fb').innerHTML=`<p class="bad"><b>NOT QUITE.</b> ${q.miss} You can try again.</p>`;say(c.prof.quiz[i]+' Review the evidence and try again.')}};
 say(c.prof.quiz[i],{hint:q.miss})}
function afterQuiz(){const c=C();scene(`<div class="qa px"><h3>THREE KINDS OF CAUSE</h3>${c.classify.map(x=>`<div class="note px"><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}<button class="btn red" id="sm">ENTER THE SIMULATION</button></div>`);
 $('#sm').onclick=()=>{unlock(4);go('DECISION_SIMULATION')};say(c.prof.after2)}
/* ---------- chapter 4 ---------- */
function sim(){const c=C(),ds=c.decisions,i=ds.findIndex((d,k)=>!(k in S.dec));
 if(i<0)return simDone();
 if(i===0&&!S.simIn){scene('<div class="sim px"><h2 class="red">SIMULATION MODE</h2><p>YOU HAVE BEEN GIVEN ONE CHANCE TO PREVENT THE DISASTER.</p><p>WHAT WOULD YOU CHANGE?</p><p class="mut">This is a hypothetical educational exercise, not a historical record.</p><button class="btn red" id="st">ENTER THE DECISION ROOM</button></div>');$('#st').onclick=()=>{S.simIn=1;save();sim()};say(c.prof.sim);A.sfx('alarm');return}
 const d=ds[i];scene(`<div class="sim px"><div class="mut">DECISION ${i+1} / ${ds.length}: ${d.t}</div><p class="doc">${d.s}</p><h3>${d.q}</h3><div id="os">${d.o.map((o,k)=>`<button class="opt" data-k="${k}">${'ABC'[k]}. ${o[0]}</button>`).join('')}</div><div id="fb"></div><div id="act"></div></div>`);
 $$('.opt').forEach(b=>b.onclick=()=>{const k=+b.dataset.k,o=d.o[k],good=k===d.p;S.dec[i]=k;if(good)S.score+=20;save();top();beep(good?700:200);
  $$('.opt').forEach(x=>{x.disabled=true;x.classList.add(+x.dataset.k===d.p?'ok':(+x.dataset.k===k?'no':'x'))});
  $('#fb').innerHTML=`<p><b>CONSEQUENCE:</b> ${o[1]}</p><p class="${good?'good':'bad'}"><b>${good?'PREFERRED DECISION.':'RISKY DECISION.'}</b> ${d.learn}</p>`;$('#act').innerHTML='<button class="btn" id="nx">NEXT</button>';$('#nx').onclick=sim;say(o[2])});
 say('Think like a safety manager: what is the consequence of uncertainty?',{hint:'Which option reduces risk at the source, and verifies the result?'})}
function simDone(){const c=C(),n=Object.keys(S.dec).filter(k=>S.dec[k]===c.decisions[k].p).length;
 scene(`<div class="sim px"><h2 class="good">SIMULATION COMPLETE</h2><p>Your decisions could have interrupted the chain of failures. (${n}/${c.decisions.length} preferred.)</p><p class="mut">This is a hypothetical educational simulation. It does not claim that one decision alone would certainly have prevented the historical disaster.</p><button class="btn red" id="fr">DRAFT YOUR CONCLUSION</button></div>`);
 $('#fr').onclick=()=>{unlock(5);go('DRAFT')};say('The simulation is over. Next you commit to your own conclusion, before seeing the official one.')}
/* ---------- chapter 5 ---------- */
function draft(){const c=C();if(S.dr){S.state='FINAL_REPORT';save();return report()}
 scene(how('Before you read the official report, write your own. In each category tick the findings your evidence supports. You get one submission. A wrong tick cancels a right one.')+`<div class="qa px"><h3>YOUR CONCLUSION</h3>${c.draft.map((g,k)=>`<h3 class="mut">${g.cat}</h3>${g.o.map((o,j)=>`<label class="opt"><input type="checkbox" data-k="${k}" data-j="${j}"><span>${o[0]}</span></label>`).join('')}`).join('')}<div id="act"><button class="btn red" id="sb">FILE MY CONCLUSION</button></div></div>`);
 $('#sb').onclick=()=>{const ch=$$('input:checked').map(x=>[+x.dataset.k,+x.dataset.j]);let t=0;
  const rows=c.draft.map((g,k)=>{const P2=ch.filter(p=>p[0]===k).map(p=>p[1]),cor=P2.filter(j=>g.o[j][1]).length;t+=Math.max(0,cor-(P2.length-cor))*5;
   return `<h3 class="mut">${g.cat}</h3>${g.o.map((o,j)=>{const p=P2.includes(j);return `<div class="opt ${p?(o[1]?'ok':'no'):(o[1]?'miss':'')}"><span>${p?(o[1]?'✓ ':'✗ '):(o[1]?'○ ':'· ')}${o[0]}</span></div>`}).join('')}`}).join('');
  S.dr={t};S.score+=t;save();top();beep(700);
  scene(`<div class="qa px"><h3>YOUR CONCLUSION VS THE RECORD</h3><p class="mut">✓ you found it. ✗ not supported by the evidence. ○ you missed it.</p>${rows}<p><b>Match: ${t}/40</b></p><div class="note px"><b>OFFICIAL FINDINGS</b><p>${c.rep.tech}</p><p>${c.rep.human}</p><p>${c.rep.org}</p></div><button class="btn red" id="rp">READ THE FINAL REPORT</button></div>`);
  $('#rp').onclick=()=>go('FINAL_REPORT');say('This comparison is the point of an investigation: your conclusion, tested against the record.')};
 say(c.prof.draft,{hint:'Tick only what the evidence supports.'})}

function rating(){const r=S.score/maxScore();return r<.4?'JUNIOR INVESTIGATOR':r<.65?'RISK ANALYST':r<.85?'SENIOR INVESTIGATOR':'MASTER OF SAFETY'}
function report(){if(!S.tb){S.tb=1;S.score+=S.tok*5;save()}const c=C(),fs=c.witnesses.reduce((n,w)=>n+w.st.filter(s=>s.c).length,0),good=Object.keys(S.dec).filter(k=>S.dec[k]===c.decisions[k].p).length,first=Object.values(S.q).filter(v=>v===1).length;
 scene(`<div class="rep px"><h3>1. WHAT DID WE LEARN?</h3>${c.lessons.map((l,i)=>`<div class="note px"><b>${i+1}. ${l[0]}</b><p>${l[1]}</p></div>`).join('')}<h3>2. GLOBAL IMPACT ON NUCLEAR SAFETY</h3><ul>${c.global.map(g=>`<li>${g}</li>`).join('')}</ul><p class="mut">Sources: IAEA INSAG-7, UNSCEAR, WHO, OECD-NEA.</p>
 <h3>3. FINAL INVESTIGATION REPORT</h3><pre class="doc" style="white-space:pre-wrap">CASE NO: ${c.num}\nCASE: ${c.title}\nSTATUS: ${S.dec&&Object.keys(S.dec).length===c.decisions.length?'COMPLETE':'IN PROGRESS'}\nEVIDENCE COLLECTED: ${S.ev.length}/6\nCONNECTIONS FOUND: ${S.links.length}/${c.links.length}\nQUESTIONS ANSWERED: ${Object.keys(S.q).length}/3 (${first} first try)\nDECISIONS (preferred): ${good}/${c.decisions.length}\nCONTRADICTIONS SPOTTED: ${S.te?'5/5':'-'}\nCONCLUSION MATCH: ${S.dr?S.dr.t:0}/40\nWITNESS CONTRADICTIONS: ${S.ex.length}/${fs}\nHINTS LEFT: ${S.tok}\nSCORE: ${S.score}/${maxScore()}\n\nTECHNICAL CAUSES: ${c.rep.tech}\nHUMAN/OPERATIONAL: ${c.rep.human}\nORGANIZATIONAL ROOT CAUSES: ${c.rep.org}\nPREVENTIVE MEASURES: ${c.rep.prev}</pre>
 <h2 class="red">RATING: ${rating()}</h2><button class="btn red" id="cc">CLOSE THE CASE</button></div>`);
 $('#cc').onclick=()=>go('COMPLETED');A.sfx('stamp');say(c.prof.rep,{hint:'Read the three sections, then close the case.'})}
function end(){const c=C();scene(`<div class="sim px" style="text-align:center"><h3 class="mut">CASE ${c.num} — ${c.title}</h3><h2 class="good">&lt;END OF INVESTIGATION&gt;</h2><p>Rating: <b>${rating()}</b> · Score ${S.score}/${maxScore()}</p><button class="btn" id="rv">REVIEW CASE</button><button class="btn g" id="pa">PLAY AGAIN</button><button class="btn g" id="bk">BACK TO CASE FILES</button></div>`);
 $('#rv').onclick=()=>go('INVESTIGATION_ROOM');$('#bk').onclick=()=>{T++;menu();top()};
 $('#pa').onclick=()=>ask('Reset progress and play this case again?',()=>{S=fresh();S.case='chernobyl';S.state='INTRO';save();render()});A.sfx('fanfare');say(c.prof.end)}
/* ---------- boot ---------- */
save();
try{CF.validate(CASES).forEach(m=>console.error('[case schema] '+m))}catch(x){console.error(x)}
if(!S.case||!CH[S.at]&&S.state!=='INTRO'){S.state='MENU'}else if(S.state!=='INTRO'){S.state=S.at}
S.state==='INTRO'||S.state==='MENU'?(S.state='MENU',render()):render();
})();
