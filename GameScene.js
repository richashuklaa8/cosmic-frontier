const dist=Phaser.Math.Distance.Between;
const circ=(s,r)=>s.body.setCircle(r,s.width/2-r,s.height/2-r);

class GameScene extends Phaser.Scene{
 constructor(){super('Game');}
 init(d){this.L=LEVELS[d.level-1];}
 create(){
  const L=this.L,th=L.theme;[this.WW,this.WH]=L.world;
  Object.assign(this,{score:0,hp:100,o2:100,en:100,inv:0,hurt:false,started:false,over:false,elapsed:0,factI:0,gate:null,nCr:0,nSm:0,beaconNext:0,lastTrail:0,
   placed:[{x:260,y:this.WH/2,r:230}],prog:{sample:0,crystal:0,beacon:0},samples:[],crystals:[],pods:[],vents:[],drones:[],wells:[],beacons:[]});
  this.physics.world.setBounds(0,0,this.WW,this.WH);
  const cam=this.cameras.main;cam.setBounds(0,0,this.WW,this.WH).setBackgroundColor(th.bg);cam.fadeIn(500,0,0,0);
  this.background();this.makeFx();
  this.rocks=this.physics.add.group({immovable:true});this.asts=this.physics.add.group();this.dronesG=this.physics.add.group();
  this.player=this.physics.add.image(260,this.WH/2,'player').setDepth(10).setCollideWorldBounds(true).setDrag(L.drag).setMaxVelocity(L.maxV);circ(this.player,13);
  cam.startFollow(this.player,true,.1,.1);
  this.populate();
  this.physics.add.collider(this.player,this.rocks);this.physics.add.collider(this.dronesG,this.rocks);this.physics.add.collider(this.asts,this.rocks);this.physics.add.collider(this.asts,this.asts);
  this.arrow=this.add.triangle(0,0,0,0,18,9,0,18,0x2de2ff).setDepth(15).setAlpha(.85).setVisible(false);
  this.k=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE');
  this.input.on('pointerdown',()=>this.scan());
  this.physics.pause();
  UI.brief(this);
 }
 begin(){this.started=true;this.physics.resume();UI.toast('<b>TIP</b><br>'+this.L.tip,'info',6000);}

 background(){
  const L=this.L,th=L.theme,ADD=Phaser.BlendModes.ADD,B=Phaser.Math.Between;
  if(L.surface)this.add.tileSprite(0,0,this.WW,this.WH,'ground'+L.id).setOrigin(0).setDepth(-30);
  else{
   this.bg1=this.add.tileSprite(0,0,1280,720,'stars1').setOrigin(0).setScrollFactor(0).setDepth(-30);this.bg2=this.add.tileSprite(0,0,1280,720,'stars2').setOrigin(0).setScrollFactor(0).setDepth(-29);
   this.pl=this.add.image(1010,200,'planet').setScrollFactor(0).setScale(.55).setTint(0xb8a0ff).setDepth(-28);
   const cl=this.add.image(1010,200,'clouds').setScrollFactor(0).setScale(.55).setDepth(-28);this.add.image(1010,200,'shade').setScrollFactor(0).setScale(.55).setDepth(-28);
   this.tweens.add({targets:cl,angle:360,duration:200000,repeat:-1});this.cl4=cl;
  }
  for(let i=0;i<8;i++){const g=this.add.image(B(0,this.WW),B(0,this.WH),'glow').setTint(th.neb[i%2]).setScale(B(6,11)).setAlpha(.16).setBlendMode(ADD).setDepth(-20);this.tweens.add({targets:g,alpha:.07,duration:B(3000,6000),yoyo:true,repeat:-1,ease:'Sine.inOut'});}
 }
 makeFx(){
  const mk=(tint,sp,l)=>this.add.particles(0,0,'spark',{emitting:false,speed:{min:40,max:sp},lifespan:l,scale:{start:1,end:0},alpha:{start:1,end:0},blendMode:Phaser.BlendModes.ADD,tint}).setDepth(20);
  this.fx={cyan:mk(0x2de2ff,220,500),amber:mk(0xffcf5a,200,500),red:mk(0xff4d6d,340,700),violet:mk(0xa66bff,200,500),green:mk(0x7dffb0,200,500)};
  this.trail=this.add.particles(0,0,'spark',{emitting:false,lifespan:380,scale:{start:.55,end:0},alpha:{start:.7,end:0},blendMode:Phaser.BlendModes.ADD,tint:0x7fb0ff,speed:12}).setDepth(9);
 }
 burst(x,y,c,n=14){this.fx[c].explode(n,x,y);}
 spot(pad,min=0,from=[260,this.WH/2]){let x,y,n=0;do{x=Phaser.Math.Between(120,this.WW-120);y=Phaser.Math.Between(120,this.WH-120);n++;}while(n<200&&(dist(x,y,from[0],from[1])<min||this.placed.some(q=>dist(x,y,q.x,q.y)<q.r+pad)));return{x,y};}
 glow(x,y,tint,sc,a){const g=this.add.image(x,y,'glow').setTint(tint).setScale(sc).setAlpha(a).setBlendMode(Phaser.BlendModes.ADD).setDepth(4);this.tweens.add({targets:g,alpha:a*.4,duration:900,yoyo:true,repeat:-1});return g;}

 populate(){
  const L=this.L,sp=L.spawn,th=L.theme,B=Phaser.Math.Between,ADD=Phaser.BlendModes.ADD;
  if(L.surface)for(let i=0;i<sp.rock;i++){const k='ast'+B(0,2),p=this.spot(SZ[k]/2+50),r=this.rocks.create(p.x,p.y,k).setTint(th.rockTint).setDepth(3).setAngle(B(0,360));circ(r,SZ[k]*.38);this.placed.push({x:p.x,y:p.y,r:SZ[k]/2});}
  for(let i=0;i<sp.well;i++){const p=this.spot(260),img=this.add.image(p.x,p.y,'well').setDepth(1);this.tweens.add({targets:img,angle:360,duration:9000,repeat:-1});this.add.circle(p.x,p.y,300).setStrokeStyle(2,0xa66bff,.3).setDepth(1);this.wells.push({x:p.x,y:p.y,R:300,g:700});this.placed.push({x:p.x,y:p.y,r:200});}
  for(let i=0;i<sp.vent;i++){const p=this.spot(60);this.add.image(p.x,p.y,'vent').setDepth(2);this.vents.push({x:p.x,y:p.y,off:B(0,3600),glow:this.add.image(p.x,p.y,'glow').setTint(0xff3bd4).setScale(1.5).setBlendMode(ADD).setDepth(4).setAlpha(.1)});this.placed.push({x:p.x,y:p.y,r:44});}
  for(let i=0;i<sp.sample;i++){const p=this.spot(40),img=this.add.image(p.x,p.y,'sample').setDepth(5),ring=this.add.circle(p.x,p.y,30).setStrokeStyle(2,0xffcf5a,.9).setFillStyle(0xffcf5a,.08).setDepth(5);
   this.tweens.add({targets:ring,scale:1.5,alpha:.2,duration:1100,repeat:-1});this.tweens.add({targets:img,y:p.y-5,yoyo:true,duration:900,repeat:-1,ease:'Sine.inOut'});this.samples.push({x:p.x,y:p.y,objs:[img,ring],d:false});this.placed.push({x:p.x,y:p.y,r:20});}
  for(let i=0;i<sp.crystal;i++){const p=this.spot(40),img=this.add.image(p.x,p.y,'crystal').setDepth(5),g=this.glow(p.x,p.y,0x2de2ff,.9,.55);this.tweens.add({targets:img,y:p.y-6,yoyo:true,duration:1000+B(0,500),repeat:-1,ease:'Sine.inOut'});this.crystals.push({x:p.x,y:p.y,objs:[img,g],d:false});this.placed.push({x:p.x,y:p.y,r:20});}
  if(sp.beacon){let vals=Phaser.Utils.Array.Shuffle(L.beaconVals.slice()).slice(0,sp.beacon);const sorted=vals.slice().sort((a,b)=>L.beaconAsc?a-b:b-a);
   vals.forEach(v=>{const p=this.spot(70),img=this.add.image(p.x,p.y,'beacon').setDepth(5),glow=this.glow(p.x,p.y-20,0x2de2ff,2.2,0),
    txt=this.add.text(p.x,p.y-52,v+L.beaconUnit,{fontFamily:'Segoe UI,sans-serif',fontSize:'15px',fontStyle:'bold',color:'#bff4ff',stroke:'#001',strokeThickness:3}).setOrigin(.5).setDepth(6);
    this.beacons.push({x:p.x,y:p.y,img,glow,txt,order:sorted.indexOf(v),on:false,d:false});this.placed.push({x:p.x,y:p.y,r:30});});}
  const pod=(kind,key,col)=>{const p=this.spot(40),img=this.add.image(p.x,p.y,key).setDepth(5),g=this.glow(p.x,p.y,col,.9,.45);this.pods.push({x:p.x,y:p.y,kind,objs:[img,g],d:false});this.placed.push({x:p.x,y:p.y,r:20});};
  for(let i=0;i<sp.o2;i++)pod('o2','o2',0x8fd3ff);for(let i=0;i<sp.med;i++)pod('med','med',0xff4d6d);
  for(let i=0;i<sp.drone;i++){const p=this.spot(60,520),d=this.dronesG.create(p.x,p.y,'drone').setDepth(8).setCollideWorldBounds(true).setBounce(1);circ(d,17);d.sp=B(75,100)+this.L.id*4;d.stun=0;d.next=0;this.drones.push(d);}
  for(let i=0;i<sp.ast;i++){const k='ast'+B(0,2),p=this.spot(0,520),a=this.asts.create(p.x,p.y,k).setDepth(7).setBounce(1).setCollideWorldBounds(true);circ(a,SZ[k]*.4);a.rad=SZ[k]*.42;const an=Math.random()*6.28,v=B(40,110);a.setVelocity(Math.cos(an)*v,Math.sin(an)*v).setAngularVelocity(B(-40,40));}
 }

 fact(){const f=this.L.facts[this.factI++%this.L.facts.length];UI.toast(`<span class="tag ${f.f?'fact':'fic'}">${f.f?'REAL SCIENCE':'GAME FICTION'}</span>${f.t}`,'fact',6500);}
 scan(){
  if(!this.started||this.over)return;
  if(this.en<15){Sfx.play('error');UI.toast('Not enough energy','warn',1200);return;}
  this.en-=15;Sfx.play('scan');const p=this.player,R=130,now=this.time.now;
  const ring=this.add.circle(p.x,p.y,R).setStrokeStyle(3,0x2de2ff,.9).setFillStyle(0x2de2ff,.07).setDepth(12).setScale(.1);
  this.tweens.add({targets:ring,scale:1,alpha:0,duration:500,onComplete:()=>ring.destroy()});
  this.samples.forEach(s=>{if(!s.d&&dist(s.x,s.y,p.x,p.y)<R)this.takeSample(s);});
  this.drones.forEach(d=>{if(dist(d.x,d.y,p.x,p.y)<R)d.stun=now+2500;});
  const b=this.beacons.filter(b=>!b.on&&dist(b.x,b.y,p.x,p.y)<R).sort((a,c)=>dist(a.x,a.y,p.x,p.y)-dist(c.x,c.y,p.x,p.y))[0];
  if(b)this.hitBeacon(b);
 }
 take(o){o.d=true;o.objs.forEach(x=>x.destroy());}
 takeSample(s){this.take(s);this.burst(s.x,s.y,'amber',18);this.score+=150;this.nSm++;this.prog.sample++;CF.award('first');Sfx.play('sample');this.fact();this.check();}
 takeCrystal(c){this.take(c);this.burst(c.x,c.y,'cyan',14);this.score+=100;this.nCr++;this.prog.crystal++;this.en=Math.min(100,this.en+12);CF.addCrystal();Sfx.play('collect');this.check();}
 takePod(q){this.take(q);Sfx.play('collect');this.score+=25;if(q.kind==='o2'){this.o2=Math.min(100,this.o2+30);this.burst(q.x,q.y,'cyan',10);UI.toast('+30 oxygen','info',1200);}else{this.hp=Math.min(100,this.hp+25);this.burst(q.x,q.y,'red',10);UI.toast('+25 hull','info',1200);}}
 hitBeacon(b){
  if(b.order===this.beaconNext){b.on=true;this.beaconNext++;this.prog.beacon++;b.img.setTint(0x2de2ff);b.glow.setAlpha(.7);this.burst(b.x,b.y-20,'cyan',20);this.score+=300;Sfx.play('beacon');this.fact();this.check();}
  else{this.beacons.forEach(x=>{x.on=false;x.img.clearTint();x.glow.setAlpha(0);});this.beaconNext=0;this.prog.beacon=0;this.en=Math.max(0,this.en-10);Sfx.play('error');this.cameras.main.shake(200,.008);UI.toast('<b>SIGNAL SCRAMBLED</b><br>Wrong order: sequence reset.','warn',3500);}
 }
 check(){const L=this.L;if(!this.gate&&L.goals.every(g=>this.prog[g.k]>=g.n)){
  const p=this.spot(80,700,[this.player.x,this.player.y]),img=this.add.image(p.x,p.y,'gate').setDepth(6);this.tweens.add({targets:img,angle:360,duration:6000,repeat:-1});this.glow(p.x,p.y,0x2de2ff,4,.6);this.gate={x:p.x,y:p.y};Sfx.play('gate');UI.toast('<b>Objectives complete!</b><br>Warp gate online. Follow the arrow.','info',5000);}}
 damage(n,cause){const now=this.time.now;if(this.over||now<this.inv)return false;this.hp-=n;this.inv=now+1000;this.hurt=true;Sfx.play('hurt');const c=this.cameras.main;c.shake(180,.012);c.flash(120,255,60,90);
  this.tweens.add({targets:this.player,alpha:.35,yoyo:true,repeat:3,duration:90,onComplete:()=>this.player.setAlpha(1)});if(this.hp<=0){this.hp=0;this.die(cause);}return true;}
 knock(x,y,f){const a=Math.atan2(this.player.y-y,this.player.x-x);this.player.setVelocity(Math.cos(a)*f,Math.sin(a)*f);}
 die(cause){if(this.over)return;this.over=true;const p=this.player;p.setVelocity(0,0).setAcceleration(0,0).setTint(0xff4d6d);this.burst(p.x,p.y,'red',44);Sfx.play('boom');this.cameras.main.shake(400,.02);this.time.delayedCall(900,()=>CF.over(cause,this.score));}
 finish(){if(this.over)return;this.over=true;const L=this.L,p=this.player;p.setVelocity(0,0).setAcceleration(0,0);this.physics.pause();
  const tB=Math.max(0,Math.round((L.par-this.elapsed)*4)),hB=Math.round(this.hp*3),oB=Math.round(this.o2*2),total=this.score+tB+hB+oB,stars=1+(this.hp>=50?1:0)+(this.elapsed<=L.par?1:0);
  Sfx.play('complete');this.burst(p.x,p.y,'cyan',50);this.time.delayedCall(800,()=>CF.finish({level:L.id,score:this.score,tB,hB,oB,total,stars,elapsed:this.elapsed,hurt:this.hurt,o2:this.o2}));}

 update(t,dt){
  const L=this.L,p=this.player,cam=this.cameras.main;
  if(this.bg1){this.bg1.tilePositionX=cam.scrollX*.1;this.bg1.tilePositionY=cam.scrollY*.1;this.bg2.tilePositionX=cam.scrollX*.25;this.bg2.tilePositionY=cam.scrollY*.25;this.pl.x=1010-cam.scrollX*.03;}
  if(!this.started||this.over)return;
  const s=Math.min(dt,50)/1000,now=this.time.now,k=this.k;
  const ax=(k.D.isDown||k.RIGHT.isDown?1:0)-(k.A.isDown||k.LEFT.isDown?1:0),ay=(k.S.isDown||k.DOWN.isDown?1:0)-(k.W.isDown||k.UP.isDown?1:0),m=Math.hypot(ax,ay)||1;
  p.setAcceleration(ax/m*L.accel,ay/m*L.accel);
  const sp=p.body.speed;if(sp>25)p.rotation=Phaser.Math.Angle.RotateTo(p.rotation,Math.atan2(p.body.velocity.y,p.body.velocity.x)+Math.PI/2,.12);
  if((ax||ay)&&now-this.lastTrail>45){this.lastTrail=now;const a=p.rotation+Math.PI/2;this.trail.emitParticleAt(p.x-Math.cos(a)*14,p.y-Math.sin(a)*14,1);}
  if(Phaser.Input.Keyboard.JustDown(k.SPACE))this.scan();
  this.elapsed+=s;this.o2-=L.o2Rate*s;this.en=Math.min(100,this.en+5*s);
  if(this.o2<=0){this.o2=0;this.die('Oxygen depleted');return;}
  this.crystals.forEach(c=>{if(!c.d&&dist(c.x,c.y,p.x,p.y)<32)this.takeCrystal(c);});
  this.pods.forEach(q=>{if(!q.d&&dist(q.x,q.y,p.x,p.y)<32)this.takePod(q);});
  this.vents.forEach(v=>{const ph=(now+v.off)%3600,on=ph>2100;v.glow.setAlpha(on?.9:ph>1500?.25+.25*Math.sin(now/55):.1);if(on&&dist(v.x,v.y,p.x,p.y)<52)this.damage(10,'Toxic vent');});
  this.drones.forEach(d=>{const dd=dist(d.x,d.y,p.x,p.y);
   if(now<d.stun){d.setVelocity(0,0).setTint(0x6aa8ff);return;}d.clearTint();
   if(dd<380){const a=Math.atan2(p.y-d.y,p.x-d.x);d.setVelocity(Math.cos(a)*d.sp,Math.sin(a)*d.sp);}
   else if(now>d.next){const a=Math.random()*6.28;d.setVelocity(Math.cos(a)*d.sp*.5,Math.sin(a)*d.sp*.5);d.next=now+1500;}
   d.rotation+=s*2.5;if(dd<30&&this.damage(15,'Drone attack'))this.knock(d.x,d.y,360);});
  this.asts.getChildren().forEach(a=>{if(dist(a.x,a.y,p.x,p.y)<a.rad+11&&this.damage(a.rad>45?18:12,'Asteroid impact')){this.burst(p.x,p.y,'amber',16);Sfx.play('boom');this.knock(a.x,a.y,360);}});
  this.wells.forEach(w=>{const d=dist(w.x,w.y,p.x,p.y);if(d<w.R){const f=(1-d/w.R)*w.g*s,a=Math.atan2(w.y-p.y,w.x-p.x);p.body.velocity.x+=Math.cos(a)*f;p.body.velocity.y+=Math.sin(a)*f;}if(d<42)this.damage(12,'Gravity well');});
  if(this.gate&&dist(this.gate.x,this.gate.y,p.x,p.y)<46){this.finish();return;}
  // guidance arrow
  let tg=null;if(this.gate)tg=this.gate;else{const g=L.goals.find(g=>this.prog[g.k]<g.n);if(g){const list=(g.k==='sample'?this.samples:g.k==='crystal'?this.crystals:this.beacons.filter(b=>!b.on)).filter(o=>!o.d);tg=list.sort((a,b)=>dist(a.x,a.y,p.x,p.y)-dist(b.x,b.y,p.x,p.y))[0];}}
  if(tg){const a=Math.atan2(tg.y-p.y,tg.x-p.x);this.arrow.setPosition(p.x+Math.cos(a)*56,p.y+Math.sin(a)*56).setRotation(a).setVisible(true);}else this.arrow.setVisible(false);
  const tot=L.goals.reduce((a,g)=>a+g.n,0),done=L.goals.reduce((a,g)=>a+Math.min(this.prog[g.k],g.n),0);
  UI.hud({hp:this.hp,o2:this.o2,en:this.en,score:this.score,cr:this.nCr,sm:this.nSm,prog:done/tot,progTxt:this.gate?'ALL OBJECTIVES DONE: ENTER THE WARP GATE':L.goals.map(g=>`${g.label} ${Math.min(this.prog[g.k],g.n)}/${g.n}`).join('   •   ')});
 }
}
