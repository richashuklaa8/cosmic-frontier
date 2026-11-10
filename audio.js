// Procedural WebAudio: no audio files needed.
const Sfx=(()=>{
 const S={sound:true,music:true,vol:.7,mvol:.5};let ctx,master,mus,sfx,nb;
 const apply=()=>{if(!ctx)return;master.gain.value=S.sound?S.vol:0;mus.gain.value=S.music?S.mvol*.6:0;};
 const tone=(f,dur,type='sine',v=.2,to,delay=0)=>{if(!ctx||!S.sound)return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(sfx);o.start(t);o.stop(t+dur+.02);};
 const noise=(dur,v,fr)=>{if(!ctx||!S.sound)return;const t=ctx.currentTime,s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nb;f.type='lowpass';f.frequency.setValueAtTime(fr,t);f.frequency.exponentialRampToValueAtTime(60,t+dur);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(sfx);s.start(t);s.stop(t+dur);};
 const ambience=()=>{
  [[55,'sine',.5],[82.4,'triangle',.25],[110.3,'sine',.12]].forEach(([f,ty,v])=>{const o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createOscillator(),lg=ctx.createGain();o.type=ty;o.frequency.value=f;g.gain.value=v*.35;l.frequency.value=.07+Math.random()*.1;lg.gain.value=v*.15;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(mus);o.start();l.start();});
  const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nb;s.loop=true;f.type='bandpass';f.frequency.value=380;f.Q.value=.6;g.gain.value=.05;s.connect(f);f.connect(g);g.connect(mus);s.start();};
 const NOTES=[220,261.6,293.7,329.6,392,440,523.3];
 const arp=()=>{if(!ctx||!S.music||!S.sound)return;const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=NOTES[Math.floor(Math.random()*NOTES.length)];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+2.4);o.connect(g);g.connect(mus);o.start(t);o.stop(t+2.5);};
 const init=()=>{if(ctx){if(ctx.state==='suspended')ctx.resume();return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ctx=new AC();master=ctx.createGain();sfx=ctx.createGain();mus=ctx.createGain();sfx.connect(master);mus.connect(master);master.connect(ctx.destination);
  nb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  apply();ambience();setInterval(arp,2200);};
 const P={
  click:()=>tone(620,.07,'square',.07,900),
  collect:()=>{tone(880,.1,'sine',.2);tone(1320,.14,'sine',.18,null,.07)},
  sample:()=>{[523,659,784].forEach((f,i)=>tone(f,.16,'triangle',.2,null,i*.07))},
  beacon:()=>{tone(440,.3,'sine',.25,880);tone(880,.3,'triangle',.15,null,.1)},
  scan:()=>tone(300,.45,'sine',.2,1000),
  error:()=>tone(150,.22,'square',.14,90),
  hurt:()=>{tone(180,.28,'sawtooth',.25,60);noise(.25,.25,900)},
  boom:()=>{noise(.7,.5,500);tone(80,.6,'sine',.4,30)},
  gate:()=>{tone(330,.6,'sine',.2,990);tone(495,.6,'triangle',.15,1320,.1)},
  complete:()=>{[523,659,784,1047,1319].forEach((f,i)=>tone(f,.3,'triangle',.2,null,i*.12))},
  lose:()=>{[392,330,262,196].forEach((f,i)=>tone(f,.4,'sawtooth',.15,null,i*.18))}};
 return{S,init,apply,play:n=>{try{P[n]&&P[n]()}catch(e){}}};
})();
