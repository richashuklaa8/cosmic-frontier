// Generates every texture procedurally (no external assets). Loading progress = real task progress.
const TAU=Math.PI*2;
const mk=(sc,key,w,h,fn)=>{const t=sc.textures.createCanvas(key,w,h);fn(t.context,w,h);t.refresh();};
const rg=(c,x,y,r0,r1,st)=>{const g=c.createRadialGradient(x,y,r0,x,y,r1);st.forEach(([o,col])=>g.addColorStop(o,col));return g;};
const lg=(c,x0,y0,x1,y1,st)=>{const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,col])=>g.addColorStop(o,col));return g;};
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const circle=(c,x,y,r,f)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=f;c.fill();};

class BootScene extends Phaser.Scene{
 constructor(){super('Boot');}
 create(){
  const T=[],add=(l,f)=>T.push([l,f]);
  add('Starfields',sc=>[['stars1',160,1.2,1],['stars2',60,2.2,2]].forEach(([k,n,sz,sd])=>mk(sc,k,512,512,(c,w,h)=>{const R=rng(sd*99);for(let i=0;i<n;i++){const x=R()*w,y=R()*h,r=.4+R()*sz;circle(c,x,y,r,`rgba(${200+R()*55|0},${210+R()*45|0},255,${.4+R()*.6})`);if(r>1.6)circle(c,x,y,r*3,rg(c,x,y,0,r*3,[[0,'rgba(150,190,255,.35)'],[1,'rgba(150,190,255,0)']]));}})));
  add('Glow sprites',sc=>{mk(sc,'glow',128,128,c=>{c.fillStyle=rg(c,64,64,0,64,[[0,'rgba(255,255,255,1)'],[.4,'rgba(255,255,255,.3)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,128,128)});mk(sc,'spark',16,16,c=>{c.fillStyle=rg(c,8,8,0,8,[[0,'#fff'],[.5,'rgba(255,255,255,.5)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,16,16)});});
  LEVELS.filter(l=>l.surface).forEach(l=>add('Terrain '+l.id,sc=>mk(sc,'ground'+l.id,256,256,(c,w,h)=>{const R=rng(l.id*77),t=l.theme;c.fillStyle=t.ground;c.fillRect(0,0,w,h);
   for(let i=0;i<9;i++){const x=R()*w,y=R()*h,r=30+R()*60;for(const ox of[-w,0,w])for(const oy of[-h,0,h]){c.fillStyle=rg(c,x+ox,y+oy,0,r,[[0,t.rock+'99'],[1,t.rock+'00']]);c.fillRect(x+ox-r,y+oy-r,r*2,r*2);}}
   for(let i=0;i<150;i++){c.fillStyle=`rgba(255,255,255,${R()*.12})`;c.fillRect(R()*w,R()*h,1+R()*2,1+R()*2);}
   c.strokeStyle=t.accent+'1c';c.lineWidth=1;c.beginPath();[0,128].forEach(v=>{c.moveTo(v+.5,0);c.lineTo(v+.5,h);c.moveTo(0,v+.5);c.lineTo(w,v+.5)});c.stroke();})));
  add('Astronaut',sc=>mk(sc,'player',44,44,c=>{c.translate(22,22);c.fillStyle='#7d8fbd';c.fillRect(-9,3,18,15);c.fillStyle='#2de2ff';c.fillRect(-5,16,10,3);
   circle(c,0,2,13,rg(c,-4,-2,2,15,[[0,'#fff'],[1,'#a9b8de']]));circle(c,-14,0,5,'#c7d2ee');circle(c,14,0,5,'#c7d2ee');circle(c,0,-4,10,'#f2f6ff');
   c.fillStyle=lg(c,-6,-9,6,-2,[[0,'#7ff3ff'],[1,'#2a6bff']]);c.beginPath();c.ellipse(0,-6,6.5,4.5,0,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.fillRect(-4,-8,3,1.5);}));
  add('Items',sc=>{
   mk(sc,'crystal',32,40,c=>{c.beginPath();c.moveTo(16,2);c.lineTo(28,16);c.lineTo(16,38);c.lineTo(4,16);c.closePath();c.fillStyle=lg(c,4,2,28,38,[[0,'#c8fbff'],[1,'#1f8fff']]);c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.stroke();c.beginPath();c.moveTo(4,16);c.lineTo(28,16);c.moveTo(16,2);c.lineTo(16,38);c.strokeStyle='rgba(255,255,255,.35)';c.stroke();});
   mk(sc,'sample',32,32,c=>{circle(c,16,16,12,rg(c,12,12,1,14,[[0,'#fff2b8'],[1,'#e08a1e']]));c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.arc(16,16,12,0,TAU);c.stroke();c.fillStyle='#7a4a0a';c.fillRect(9,15,14,2);});
   mk(sc,'o2',28,36,c=>{c.fillStyle='#8fd3ff';c.fillRect(6,8,16,26);c.fillStyle='#dfe7fb';c.fillRect(10,2,8,7);c.fillStyle='#fff';c.fillRect(6,16,16,4);c.fillStyle='#134a6e';c.font='bold 9px sans-serif';c.textAlign='center';c.fillText('O2',14,29);});
   mk(sc,'med',28,28,c=>{c.fillStyle='#fff';c.fillRect(2,2,24,24);c.fillStyle='#ff4d6d';c.fillRect(11,5,6,18);c.fillRect(5,11,18,6);});});
  ['ast0','ast1','ast2'].forEach(k=>add('Rock '+k,sc=>mk(sc,k,SZ[k],SZ[k],(c,w)=>{const R=rng(w),r=w/2;c.translate(r,r);c.beginPath();for(let i=0;i<13;i++){const a=i/13*TAU,d=r*(.8+R()*.18);c[i?'lineTo':'moveTo'](Math.cos(a)*d,Math.sin(a)*d);}c.closePath();
   c.fillStyle=rg(c,-r*.3,-r*.3,r*.1,r,[[0,'#cfc6da'],[1,'#4b4356']]);c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1.5;c.stroke();
   for(let i=0;i<4;i++){const q=r*(.1+R()*.14);c.beginPath();c.arc((R()-.5)*r,(R()-.5)*r,q,0,TAU);c.fillStyle='rgba(30,24,40,.45)';c.fill();c.strokeStyle='rgba(255,255,255,.18)';c.stroke();}})));
  add('Hazards',sc=>{
   mk(sc,'drone',44,44,c=>{c.translate(22,22);circle(c,0,0,20,rg(c,0,0,4,20,[[0,'#6a2fb0'],[1,'#25104a']]));c.strokeStyle='#c04bff';c.lineWidth=2.5;c.beginPath();c.arc(0,0,17,0,TAU);c.stroke();for(let i=0;i<4;i++){c.save();c.rotate(i*TAU/4);c.fillStyle='#c04bff';c.fillRect(17,-2,5,4);c.restore();}circle(c,0,0,7,rg(c,0,0,0,7,[[0,'#fff'],[.4,'#ff4d6d'],[1,'#b0003a']]));});
   mk(sc,'vent',88,88,c=>{c.translate(44,44);circle(c,0,0,40,rg(c,0,0,10,40,[[0,'#08020f'],[.8,'#2a0a3a'],[1,'rgba(255,59,212,.5)']]));c.strokeStyle='rgba(255,59,212,.8)';c.lineWidth=2;c.beginPath();c.arc(0,0,38,0,TAU);c.stroke();circle(c,0,0,10,'#000');});
   mk(sc,'well',256,256,c=>{c.translate(128,128);circle(c,0,0,128,rg(c,0,0,0,128,[[0,'rgba(0,0,0,1)'],[.25,'rgba(10,0,30,.9)'],[1,'rgba(120,60,255,0)']]));c.lineWidth=3;for(let a=0;a<3;a++){c.beginPath();for(let t=0;t<4.6;t+=.1){const r=14+t*24,an=t+a*TAU/3;c[t?'lineTo':'moveTo'](Math.cos(an)*r,Math.sin(an)*r);}c.strokeStyle='rgba(166,107,255,.75)';c.stroke();}});});
  add('Beacon & gate',sc=>{
   mk(sc,'beacon',48,72,c=>{c.fillStyle='#394a7a';c.beginPath();c.moveTo(8,70);c.lineTo(40,70);c.lineTo(28,34);c.lineTo(20,34);c.closePath();c.fill();c.fillStyle='#8fa0d8';c.fillRect(22,22,4,16);circle(c,24,16,12,rg(c,20,12,1,13,[[0,'#fff'],[1,'#8a96b8']]));});
   mk(sc,'gate',128,128,c=>{c.translate(64,64);circle(c,0,0,52,rg(c,0,0,0,52,[[0,'rgba(120,240,255,.9)'],[1,'rgba(120,80,255,.15)']]));c.lineWidth=7;c.strokeStyle='#2de2ff';c.beginPath();c.arc(0,0,56,0,TAU);c.stroke();c.lineWidth=3;c.strokeStyle='#a66bff';c.setLineDash([14,10]);c.beginPath();c.arc(0,0,44,0,TAU);c.stroke();});});
  add('Planet',sc=>{
   mk(sc,'planet',520,520,c=>{const R=rng(5);c.save();c.beginPath();c.arc(260,260,240,0,TAU);c.clip();c.fillStyle=rg(c,190,170,20,300,[[0,'#8a7cff'],[.5,'#3a2a9a'],[1,'#0a0a3a']]);c.fillRect(0,0,520,520);
    for(let i=0;i<16;i++){c.fillStyle=`rgba(${R()<.5?'180,160,255':'80,200,255'},${.05+R()*.1})`;c.fillRect(0,20+i*30+R()*10,520,6+R()*14);}c.restore();
    c.lineWidth=5;c.strokeStyle=rg(c,260,260,226,246,[[0,'rgba(45,226,255,0)'],[.8,'rgba(45,226,255,.5)'],[1,'rgba(45,226,255,0)']]);c.beginPath();c.arc(260,260,240,0,TAU);c.stroke();});
   mk(sc,'clouds',520,520,c=>{const R=rng(9);c.save();c.beginPath();c.arc(260,260,240,0,TAU);c.clip();for(let i=0;i<46;i++){const x=R()*520,y=R()*520,w=40+R()*120;c.fillStyle=`rgba(255,255,255,${.04+R()*.09})`;c.beginPath();c.ellipse(x,y,w,6+R()*10,0,0,TAU);c.fill();}c.restore();});
   mk(sc,'shade',520,520,c=>{c.fillStyle=rg(c,170,150,60,300,[[0,'rgba(0,0,10,0)'],[.7,'rgba(0,0,12,.35)'],[1,'rgba(0,0,12,.9)']]);c.beginPath();c.arc(260,260,240,0,TAU);c.fill();});
   mk(sc,'ship',90,44,c=>{c.translate(0,22);c.fillStyle=lg(c,0,-14,0,14,[[0,'#e6edff'],[1,'#7c8ab8']]);c.beginPath();c.moveTo(88,0);c.lineTo(48,-10);c.lineTo(14,-9);c.lineTo(14,9);c.lineTo(48,10);c.closePath();c.fill();c.fillStyle='#a66bff';c.beginPath();c.moveTo(40,-9);c.lineTo(20,-21);c.lineTo(14,-9);c.fill();c.beginPath();c.moveTo(40,9);c.lineTo(20,21);c.lineTo(14,9);c.fill();c.fillStyle='#2de2ff';c.beginPath();c.ellipse(58,0,10,4,0,0,TAU);c.fill();c.fillStyle='#2a6bff';c.fillRect(8,-5,6,10);});});
  let i=0;const step=()=>{if(i>=T.length){UI.ready();this.scene.start('Menu');return;}UI.loading(i/T.length,T[i][0]+'…');T[i][1](this);i++;setTimeout(step,15);};
  step();
 }
}
