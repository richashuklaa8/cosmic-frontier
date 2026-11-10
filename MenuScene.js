// Animated main-menu backdrop (the buttons themselves are DOM elements).
class MenuScene extends Phaser.Scene{
 constructor(){super('Menu');}
 create(){
  const ADD=Phaser.BlendModes.ADD,B=Phaser.Math.Between;
  this.s1=this.add.tileSprite(0,0,1280,720,'stars1').setOrigin(0);this.s2=this.add.tileSprite(0,0,1280,720,'stars2').setOrigin(0);
  [[900,200,0x5b3cff,9],[350,620,0x1b6bff,8],[1120,640,0xa63cff,7]].forEach(([x,y,c,s])=>{const g=this.add.image(x,y,'glow').setTint(c).setScale(s).setAlpha(.28).setBlendMode(ADD);this.tweens.add({targets:g,alpha:.12,duration:4000+B(0,2000),yoyo:true,repeat:-1,ease:'Sine.inOut'});});
  this.add.image(930,380,'glow').setTint(0x2de2ff).setScale(6.6).setAlpha(.32).setBlendMode(ADD);
  this.add.image(930,380,'planet');this.cl=this.add.image(930,380,'clouds');this.add.image(930,380,'shade');
  this.tweens.add({targets:this.cl,angle:360,duration:240000,repeat:-1});
  this.add.image(700,210,'glow').setTint(0x2de2ff).setScale(2).setAlpha(.3).setBlendMode(ADD);
  const a=this.add.image(700,210,'player').setScale(2.8);
  this.tweens.add({targets:a,y:190,angle:14,duration:3200,yoyo:true,repeat:-1,ease:'Sine.inOut'});a.setAngle(-14);
  const tr=this.add.particles(0,0,'spark',{emitting:false,lifespan:700,scale:{start:.9,end:0},alpha:{start:.8,end:0},blendMode:ADD,tint:0x2de2ff,speed:20});
  const fly=()=>{const sh=this.add.image(-100,B(90,320),'ship').setAngle(B(-5,8));this.tweens.add({targets:sh,x:1400,duration:7500,onUpdate:()=>tr.emitParticleAt(sh.x-8,sh.y,1),onComplete:()=>sh.destroy()});};
  this.time.addEvent({delay:9000,loop:true,callback:fly});this.time.delayedCall(1500,fly);
 }
 update(t,d){this.s1.tilePositionX+=d*.006;this.s2.tilePositionX+=d*.014;}
}
