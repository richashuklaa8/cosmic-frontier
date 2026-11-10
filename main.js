window.addEventListener('load',()=>{
 if(!window.Phaser){$('#loadtxt').textContent='Phaser failed to load. Check your connection or put phaser.min.js in lib/ (see README).';return;}
 CF.load();
 CF.game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1280,height:720,backgroundColor:'#04050f',
  physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
  scene:[BootScene,MenuScene,GameScene]});
});
