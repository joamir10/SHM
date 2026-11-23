/* Shared interactive background (dot grid, sparks, click bursts) for the portal and The Prof.
   Needs <canvas id="bgfx"> and an optional <button id="fxb">. Preference is shared with the Safety Manager mode (key sm_fx). */
(function(){const cv=document.getElementById('bgfx'),btn=document.getElementById('fxb');if(!cv)return;
const x=cv.getContext('2d'),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;let w,h,d,on=true,M={x:-999,y:-999,a:0},S=[],raf=0;
try{on=localStorage.getItem('sm_fx')!='0'&&!rm}catch(e){on=!rm}
const GAP=44,mk=(px,py,burst)=>{const a=burst?Math.random()*6.283:-1.57+(Math.random()-.5)*.8,v=burst?1.5+Math.random()*4:.3+Math.random()*.7;return{x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:burst?1:2+Math.random(),b:burst,c:Math.random()<.7?'242,183,5':'255,122,26'}};
function size(){d=Math.min(2,devicePixelRatio||1);w=innerWidth;h=innerHeight;cv.width=w*d;cv.height=h*d;x.setTransform(d,0,0,d,0,0)}
function seed(){S=S.filter(p=>p.b);for(let i=0;i<Math.round(w*h/26000);i++){const p=mk(Math.random()*w,Math.random()*h,false);p.l=Math.random()*3;S.push(p)}}
function frame(t){x.clearRect(0,0,w,h);M.a*=.96;
for(let gx=GAP/2;gx<w;gx+=GAP)for(let gy=GAP/2;gy<h;gy+=GAP){const dx=gx-M.x,dy=gy-M.y,dd=Math.hypot(dx,dy),n=dd<170?1-dd/170:0,o=dd>0&&dd<170?n*9:0,px=gx+dx/dd*o||gx,py=gy+dy/dd*o||gy;
x.fillStyle=n?`rgba(242,183,5,${.18+n*.8})`:'rgba(154,161,166,.16)';x.beginPath();x.arc(px,py,1.3+n*2.4,0,7);x.fill()}
const sweep=(t*.03)%(w+400)-200;x.fillStyle='rgba(242,183,5,.035)';x.beginPath();x.moveTo(sweep,0);x.lineTo(sweep+90,0);x.lineTo(sweep-50,h);x.lineTo(sweep-140,h);x.fill();
for(let i=S.length-1;i>=0;i--){const p=S[i],dx=p.x-M.x,dy=p.y-M.y,dd=Math.hypot(dx,dy);if(dd<130&&dd>0){p.vx+=dx/dd*.12;p.vy+=dy/dd*.12}
if(p.b)p.vy+=.08;p.vx*=p.b?.985:.995;p.vy*=p.b?.985:.995;p.x+=p.vx;p.y+=p.vy;p.l-=p.b?.018:.003;
if(p.l<=0||p.y<-20||p.x<-20||p.x>w+20||p.y>h+20){if(p.b){S.splice(i,1)}else Object.assign(p,mk(Math.random()*w,h+10,false));continue}
const al=Math.min(1,p.l);x.strokeStyle=`rgba(${p.c},${al*.8})`;x.lineWidth=p.b?2:1.4;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.vx*4,p.y-p.vy*4);x.stroke()}
if(M.a>.02){const g=x.createRadialGradient(M.x,M.y,0,M.x,M.y,200);g.addColorStop(0,`rgba(242,183,5,${.1*M.a})`);g.addColorStop(1,'rgba(242,183,5,0)');x.fillStyle=g;x.fillRect(M.x-200,M.y-200,400,400)}
raf=on&&!document.hidden?requestAnimationFrame(frame):0}
function run(){cancelAnimationFrame(raf);if(on){raf=requestAnimationFrame(frame)}else x.clearRect(0,0,w,h);if(btn)btn.textContent='Background: '+(on?'On':'Off')}
addEventListener('pointermove',e=>{M.x=e.clientX;M.y=e.clientY;M.a=1});
addEventListener('pointerdown',e=>{if(!on||e.target.closest('a,button,input,summary,nav,.stage,.panel,.card,.top,.hero,.mode,.team,.person'))return;for(let i=0;i<26;i++)S.push(mk(e.clientX,e.clientY,true))});
addEventListener('resize',()=>{size();seed()});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&on&&!raf)run()});
if(btn)btn.onclick=()=>{on=!on;try{localStorage.setItem('sm_fx',on?'1':'0')}catch(e){}run()};
size();seed();run()})();
