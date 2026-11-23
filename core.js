/* CASE FILES core: save versioning + migration, and case schema validation.
   Pure functions, no DOM. Loaded before game.js. Also loaded by tests/run.js in Node. */
(function(root){'use strict';
const VERSION=2;
const TOK={rookie:5,investigator:3,chief:2};   /* hint tokens per difficulty */
const TRUST={rookie:4,investigator:3,chief:2}; /* witness trust hearts per difficulty */
const DL={rookie:0,investigator:1,chief:2};    /* red-herring level: an item with rh:N shows when DL>=N */
/* v1 saves stored searched objects as indexes into the old single room. Map them to the new ids. */
const OLD_FOUND=['off.papers','off.cabinet','lia.telex','ctl.coat','off.drawer','ctl.terminal','ctl.notice','ctl.mug','ctl.panel','ctl.window'];
const OLD_WIT=['sup','dep'];

function fresh(diff){diff=TOK[diff]?diff:'investigator';
 return {v:VERSION,case:null,state:'MENU',at:null,max:0,seen:{p:[],a:[]},ev:[],links:[],tl:[],q:{},dec:{},score:0,simIn:0,te:0,so:0,tlOrder:null,tlOk:0,tlIn:0,dr:null,
  inv:[],found:[],tried:[],tok:TOK[diff],se:0,iv:0,iw:0,tr:{},ex:[],tb:0,
  diff:diff,mentor:1,hu:{},sc:'ctl',asked:{},closed:{},wd:{},lost:[],wrong:0}}

const isObj=x=>x&&typeof x==='object'&&!Array.isArray(x);
const arr=x=>Array.isArray(x)?x.slice():[];
const obj=x=>isObj(x)?Object.assign({},x):{};

function migrate(d){
 if(!isObj(d))return fresh();
 const o=Object.assign(fresh(d.diff),d);
 const v=+d.v||1;
 ['inv','found','tried','ex','lost','links','tl'].forEach(k=>o[k]=arr(o[k]));
 ['tr','hu','asked','closed','wd','q','dec'].forEach(k=>o[k]=obj(o[k]));
 o.seen=isObj(o.seen)?{p:arr(o.seen.p),a:arr(o.seen.a)}:{p:[],a:[]};
 if(v<2){
  o.found=arr(d.found).map(i=>typeof i==='number'?OLD_FOUND[i]:i).filter(i=>typeof i==='string');
  o.ex=arr(d.ex).map(k=>{const m=/^(\d+)\.(\d+)$/.exec(k);return m&&OLD_WIT[+m[1]]?OLD_WIT[+m[1]]+'.'+m[2]:k}).filter(k=>typeof k==='string'&&!/^\d+\.\d+$/.test(k));
  const tr={};Object.keys(obj(d.tr)).forEach(k=>{const id=OLD_WIT[+k];if(id)tr[id]=d.tr[k]});o.tr=tr;
  /* witnesses the old player already passed count as done; new witnesses are skipped for old saves that finished the interviews */
  for(let i=0;i<Math.min(+d.iw||0,OLD_WIT.length);i++)o.wd[OLD_WIT[i]]='done';
  if(d.iv)OLD_WIT.concat(['des','ins']).forEach(id=>o.wd[id]='done');
 }
 o.v=VERSION;
 if(typeof o.state!=='string')o.state='MENU';
 if(!TOK[o.diff])o.diff='investigator';
 o.tok=Math.max(0,+o.tok||0);o.max=+o.max||0;o.score=+o.score||0;o.iw=+o.iw||0;
 if(typeof o.sc!=='string')o.sc='ctl';
 o.mentor=o.mentor===0?0:1;
 return o}

/* ---- validation. Returns a list of error strings (empty = ok). ---- */
function validate(cases,opt){const errs=[];opt=opt||{};
 (cases||[]).filter(c=>c&&c.playable).forEach(c=>{const E=m=>errs.push((c.id||'?')+': '+m);
  ['id','title','items','search','witnesses','evidence','links'].forEach(k=>{if(!c[k])E('missing field '+k)});
  if(!c.items||!c.search||!c.witnesses)return;
  const it=c.items,has=id=>Object.prototype.hasOwnProperty.call(it,id);
  Object.keys(it).forEach(k=>{const x=it[k];if(!x.n||!x.ic||!x.t)E('item '+k+' needs n, ic, t');if(x.key&&!(Array.isArray(x.h)&&x.h.length===3))E('key item '+k+' needs 3 hint levels (h)');if(x.rh&&!(x.rm))E('red herring '+k+' needs rm (rejection message)')});
  const sc=c.search.scenes;if(!Array.isArray(sc)||!sc.length){E('search.scenes is empty');return}
  const hid={};
  sc.forEach(s=>{if(!s.id||!s.title)E('scene needs id and title');(s.objs||[]).forEach(o=>{
   if(!o.id)E('hotspot without id in '+s.id);else{if(hid[o.id])E('duplicate hotspot id '+o.id);hid[o.id]=o}
   if(!(o.x>=0&&o.y>=0&&o.w>0&&o.h>0&&o.x+o.w<=320&&o.y+o.h<=180))E('hotspot '+o.id+' is outside 320x180');
   if(!o.n||!o.m)E('hotspot '+o.id+' needs n and m');
   if(o.it&&!has(o.it))E('hotspot '+o.id+' gives unknown item '+o.it);
   if(o.it&&it[o.it]&&it[o.it].rh&&!o.m2)E('hotspot '+o.id+' holds a red herring and needs m2 (text when it is switched off)');
   if(o.lock&&!has(o.lock))E('hotspot '+o.id+' needs unknown key '+o.lock);
   if(o.lock&&!o.lockMsg)E('hotspot '+o.id+' is locked and needs lockMsg');
   if(o.code&&!(o.codeFrom&&has(o.codeFrom)))E('hotspot '+o.id+' has a code but no valid codeFrom item');
   if(o.code&&o.codeFrom&&has(o.codeFrom)&&String(it[o.codeFrom].t).indexOf(o.code)<0)E('code '+o.code+' is not printed in item '+o.codeFrom+' (unsolvable)')})});
  (c.search.combos||[]).forEach(m=>{if(m.length!==3||!m.every(has))E('bad combo '+JSON.stringify(m))});
  const wids={};
  c.witnesses.forEach(w=>{if(!w.id||wids[w.id])E('witness id missing or duplicate: '+w.id);wids[w.id]=1;
   if(!(w.st&&w.st.length>=3&&w.st.length<=5))E('witness '+w.id+' needs 3-5 statements');
   if(!(w.asks&&w.asks.length>=3&&w.asks.length<=5))E('witness '+w.id+' needs 3-5 questions');
   (w.st||[]).forEach((s,i)=>{if(!s.s||!s.press)E(w.id+'.st'+i+' needs s and press');
    if(s.c){if(!s.c.every(has))E(w.id+'.st'+i+' lists an unknown clue');if(!s.ok)E(w.id+'.st'+i+' needs ok');if(!(s.h&&s.h.length===3))E(w.id+'.st'+i+' needs 3 hint levels')}});
   const aid={};(w.asks||[]).forEach(a=>{if(!a.id||aid[a.id])E(w.id+' ask id missing or duplicate');aid[a.id]=1;if(!a.q||!a.a)E(w.id+'.'+a.id+' needs q and a');
    if(a.gives&&!has(a.gives))E(w.id+'.'+a.id+' gives unknown item');
    if(a.req&&!(typeof a.req.st==='number'&&w.st[a.req.st]&&w.st[a.req.st].c))E(w.id+'.'+a.id+' requires a statement that cannot be contradicted')})});
  /* ---- solvability: simulate a player who can only use what the game gives, per difficulty ---- */
  Object.keys(DL).forEach(diff=>{const on=id=>!it[id].rh||DL[diff]>=it[id].rh,inv=new Set();let ch=true;
   while(ch){ch=false;
    Object.keys(hid).forEach(k=>{const o=hid[k];if(!o.it||!on(o.it)||inv.has(o.it))return;if(o.lock&&!inv.has(o.lock))return;if(o.codeFrom&&!inv.has(o.codeFrom))return;inv.add(o.it);ch=true});
    (c.search.combos||[]).forEach(m=>{if(inv.has(m[0])&&inv.has(m[1])&&!inv.has(m[2])){inv.add(m[2]);ch=true}})}
   Object.keys(it).filter(k=>it[k].key).forEach(k=>{if(!inv.has(k))E('['+diff+'] key clue '+k+' cannot be reached')});
   c.witnesses.forEach(w=>{w.st.forEach((s,i)=>{if(s.c&&!s.c.some(id=>inv.has(id)))E('['+diff+'] '+w.id+'.st'+i+' cannot be contradicted with reachable clues')})})});
  const kk=Object.keys(it).filter(k=>it[k].key);
  (c.search.log||[]).forEach((r,i)=>{if(!r.p.some(id=>has(id)))E('log entry '+i+' has no valid proof');if(!(r.a>=0&&r.a<r.o.length))E('log entry '+i+' answer out of range')});
  if(!kk.length)E('no key clues');
 });
 return errs}

root.CF={VERSION,TOK,TRUST,DL,fresh,migrate,validate,OLD_FOUND,OLD_WIT};
if(typeof module!=='undefined'&&module.exports)module.exports=root.CF;
})(typeof window!=='undefined'?window:globalThis);
