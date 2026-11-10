// DOM UI layer + game state / save data.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='cosmicFrontier.v1';
const starStr=n=>[0,1,2].map(i=>`<span class="${i<n?'':'off'}">★</span>`).join('');
const CF={game:null,state:'menu',level:1,sc:null,
 save:{unlocked:1,best:{},ach:{},stats:{crystals:0},set:{sound:true,music:true,vol:.7,mvol:.5}},
 load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s)Object.assign(this.save,s)}catch(e){}Object.assign(Sfx.S,this.save.set);UI.syncSettings();},
 persist(){try{this.save.set={...Sfx.S};localStorage.setItem(KEY,JSON.stringify(this.save))}catch(e){}},
 award(id){if(this.save.ach[id])return;this.save.ach[id]=1;this.persist();Sfx.play('collect');UI.toast(`🏆 <b>${ACH[id][0]}</b><br>${ACH[id][1]}`,'ach',5000);},
 addCrystal(){const s=this.save.stats;s.crystals++;if(s.crystals>=25)this.award('crystals');this.persist();},
 go(fn){const f=$('#fade');f.classList.add('on');setTimeout(()=>{fn();setTimeout(()=>f.classList.remove('on'),150)},360);},
 start(n){this.go(()=>{this.level=n;UI.show(null);$('#hud').classList.remove('hidden');const m=this.game.scene;m.stop('Menu');m.stop('Game');m.start('Game',{level:n});});},
 menu(){this.go(()=>{const m=this.game.scene;m.stop('Game');$('#hud').classList.add('hidden');m.start('Menu');UI.show('menu');this.state='menu';});},
 pause(){if(this.state!=='play')return;this.state='pause';this.game.scene.pause('Game');UI.show('pause');},
 resume(){if(this.state!=='pause')return;UI.show(null);this.game.scene.resume('Game');this.state='play';},
 over(cause,score){this.state='end';Sfx.play('lose');$('#gCause').textContent=cause.toUpperCase();$('#gScore').textContent='Score reached: '+score;UI.show('gameover');},
 finish(d){const s=this.save,L=LEVELS[d.level-1],b=s.best[d.level];this.state='end';
  if(!b||d.total>b.score)s.best[d.level]={score:d.total,stars:Math.max(d.stars,b?b.stars:0)};else b.stars=Math.max(b.stars,d.stars);
  if(d.level<5)s.unlocked=Math.max(s.unlocked,d.level+1);
  if(!d.hurt)this.award('clean');if(d.elapsed<=L.par)this.award('fast');if(d.o2<10)this.award('breath');if(d.level===3)this.award('decoder');if(d.level===5)this.award('pioneer');
  this.persist();d.level===5?UI.victory(d):UI.complete(d,L);}
};
const UI={
 show(id){$$('.screen').forEach(e=>e.classList.add('hidden'));if(id)$('#'+id).classList.remove('hidden');},
 loading(p,t){$('#loadbar').style.width=Math.round(p*100)+'%';$('#loadtxt').textContent=t;},
 ready(){$('#loadbar').style.width='100%';UI.show('menu');CF.state='menu';},
 toast(h,c='info',ms=4200){const t=$('#toast'),d=document.createElement('div');d.className='toast '+c;d.innerHTML=h;t.appendChild(d);while(t.children.length>3)t.firstChild.remove();setTimeout(()=>d.remove(),ms);},
 hud(s){const set=(id,v)=>{const e=$(id);e.style.width=Math.max(0,Math.min(100,v))+'%';e.parentNode.classList.toggle('low',v<25&&id!=='#hProg')};
  set('#hHp',s.hp);set('#hO2',s.o2);set('#hEn',s.en);set('#hProg',s.prog*100);
  const t=(id,v)=>{const e=$(id);if(e._v!==v){e.textContent=v;e._v=v}};t('#hScore',s.score);t('#hRes','◆ '+s.cr+'  ● '+s.sm);t('#hProgTxt',s.progTxt);},
 brief(sc){CF.sc=sc;const L=sc.L;CF.state='brief';
  $('#bNum').textContent='LEVEL '+L.id+' OF 5';$('#bName').textContent=L.name;$('#bPlanet').textContent=L.planet.toUpperCase();$('#bDesc').textContent=L.desc;
  $('#bGoals').innerHTML=L.goals.map(g=>`<li>${g.label}: ${g.n}</li>`).join('')+'<li>Reach the warp gate</li>';$('#bTip').textContent='TIP: '+L.tip;
  $('#hLv').textContent='LV '+L.id;$('#hMission').textContent=L.mission;UI.show('brief');},
 complete(d,L){$('#cName').textContent=L.name;$('#cStars').innerHTML=starStr(d.stars);
  $('#cTable').innerHTML=`<tr><td>Collected</td><td>${d.score}</td></tr><tr><td>Time bonus (par ${L.par}s, you ${Math.round(d.elapsed)}s)</td><td>+${d.tB}</td></tr><tr><td>Hull bonus</td><td>+${d.hB}</td></tr><tr><td>Oxygen bonus</td><td>+${d.oB}</td></tr><tr class="t"><td>TOTAL</td><td>${d.total}</td></tr>`;
  $('#cLearn').innerHTML=`<p><span class="tag fact">REAL SCIENCE</span>${L.learn}</p><p><span class="tag fic">GAME FICTION</span>${L.fiction}</p><p style="color:#ffcf5a">Reward: Level ${L.id+1} unlocked.</p>`;UI.show('complete');},
 victory(d){const tot=Object.values(CF.save.best).reduce((a,b)=>a+b.score,0),st=Object.values(CF.save.best).reduce((a,b)=>a+b.stars,0);
  $('#vStars').innerHTML=starStr(Math.round(st/5));$('#vTotal').textContent='Total score: '+tot+'  •  Stars: '+st+'/15';
  $('#vAch').innerHTML=Object.keys(ACH).map(k=>`<span class="chip ${CF.save.ach[k]?'on':''}">${ACH[k][0]}</span>`).join('');UI.show('victory');},
 missions(){$('#mList').innerHTML=LEVELS.map(L=>{const lock=L.id>CF.save.unlocked,b=CF.save.best[L.id];
  return `<div class="card ${lock?'lock':''}" ${lock?'':`data-lv="${L.id}"`}><div class="n">${L.id}</div><div><b>${L.name}</b><p>${L.desc}</p></div><div class="r">${lock?'🔒 LOCKED':b?starStr(b.stars)+'<br>'+b.score:'PLAY ▶'}</div></div>`}).join('');
  $('#aList').innerHTML='<h4>ACHIEVEMENTS</h4>'+Object.keys(ACH).map(k=>`<span class="chip ${CF.save.ach[k]?'on':''}" title="${ACH[k][1]}">${CF.save.ach[k]?'🏆 ':'🔒 '}${ACH[k][0]}</span>`).join('');UI.show('missions');},
 syncSettings(){const S=Sfx.S;$('#tSound').textContent=S.sound?'ON':'OFF';$('#tMusic').textContent=S.music?'ON':'OFF';$('#snd').textContent=S.sound?'🔊':'🔇';$('#vMaster').value=S.vol*100;$('#vMusic').value=S.mvol*100;}
};
document.addEventListener('click',e=>{
 const c=e.target.closest('[data-lv]');if(c){Sfx.init();Sfx.play('click');CF.start(+c.dataset.lv);return}
 const b=e.target.closest('button');if(!b)return;Sfx.init();Sfx.play('click');
 const a=b.dataset.act,S=Sfx.S,st=CF.state;
 if(a==='play')CF.start(CF.save.unlocked);
 else if(a==='howto')UI.show('howto');else if(a==='missions')UI.missions();else if(a==='settings')UI.show('settings');
 else if(a==='back')UI.show(st==='pause'?'pause':'menu');
 else if(a==='pause')CF.pause();else if(a==='resume')CF.resume();
 else if(a==='restart'||a==='replay')CF.start(CF.level);
 else if(a==='next')CF.start(Math.min(5,CF.level+1));else if(a==='again')CF.start(1);
 else if(a==='quit')CF.menu();
 else if(a==='go'){UI.show(null);CF.state='play';CF.sc.begin();}
 else if(a==='snd'||a==='tsound'){S.sound=!S.sound;Sfx.apply();UI.syncSettings();CF.persist();}
 else if(a==='tmusic'){S.music=!S.music;Sfx.apply();UI.syncSettings();CF.persist();}
});
['#vMaster','#vMusic'].forEach(id=>$(id).addEventListener('input',e=>{Sfx.S[id==='#vMaster'?'vol':'mvol']=e.target.value/100;Sfx.apply();CF.persist();}));
window.addEventListener('keydown',e=>{Sfx.init();if(e.key==='p'||e.key==='P'||e.key==='Escape'){if(CF.state==='play')CF.pause();else if(CF.state==='pause')CF.resume();else if(e.key==='Escape'&&CF.state==='menu')UI.show('menu');}});
window.addEventListener('blur',()=>{if(CF.state==='play')CF.pause();});
