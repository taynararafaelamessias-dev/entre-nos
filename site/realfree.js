// =====================================================================
// Entre Nós · conta grátis: tela inicial com cadeados, janelinha de bloqueio,
// "Minha conta" liberada (convite de casal e trocar de conta)
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
const FX={
 pt:{lock:'Do Entre Nós completo',want:'Quero o Entre Nós completo',soon:'Em breve você vai poder assinar por aqui 💛',invite:'Tenho um convite de casal',later:'Agora não',
  free:n=>`Jogo do Match · ${n} de 3 jogos grátis`,freeGo:'Toque pra jogar com quem você quiser',
  acc:'Minha <em>conta</em>',plan:'Plano',planFree:n=>`Grátis · ${n} de 3 jogos restantes`,you:'Você',
  invT:'Tenho um convite de casal',invL:'Cole aqui o link ou o código que seu par te mandou. Sua conta vira a conta do casal.',invPh:'Link ou código do convite',invBtn:'Entrar no casal',
  invBad:'Esse convite não existe ou já foi usado.',invMail:'Esse convite foi feito pra outro e-mail. Peça pro seu par conferir o e-mail que ele cadastrou.',invOk:'Pronto! Agora vocês estão conectados 💞',
  swap:'Trocar de conta',out:'Sair da conta',
  why:{ask:'Pergunte o que tiver vergonha, anônima, e receba respostas de outras mulheres ou homens.',guide:'O que tem em cada parte do app, explicado com calma.',wish:'Sua lista de tudo que quer testar, e o match com o seu par.',
   diary:'O diário das posições que vocês fizeram, com nota e o que acharam.',talk:'Provocações e desejos revelados, só entre vocês.',pos:'Posições em 3D, pra ela, pra ele e pros dois, com nível.',
   fore:'Preliminares pra ela e pra ele, passo a passo.',heat:'Desafio do casal de 1 a 7 dias e o Pro meu amor.',bdsm:'BDSM com segurança: limites, semáforo e cuidado.',toys:'Guia de brinquedos e a consultoria discreta.',
   concierge:'Consultoria discreta pra escolher brinquedos.',chal:'Desafio do casal de 1 a 7 dias.',love:'Mensagens só entre vocês.',def:'Essa parte faz parte do Entre Nós completo.'}},
 es:{lock:'Del Entre Nosotros completo',want:'Quiero el Entre Nosotros completo',soon:'Muy pronto vas a poder suscribirte desde aquí 💛',invite:'Tengo una invitación de pareja',later:'Ahora no',
  free:n=>`Juego del Match · ${n} de 3 juegos gratis`,freeGo:'Toca para jugar con quien quieras',
  acc:'Mi <em>cuenta</em>',plan:'Plan',planFree:n=>`Gratis · ${n} de 3 juegos restantes`,you:'Tú',
  invT:'Tengo una invitación de pareja',invL:'Pega aquí el enlace o el código que te mandó tu pareja. Tu cuenta pasa a ser la de la pareja.',invPh:'Enlace o código de la invitación',invBtn:'Entrar en la pareja',
  invBad:'Esta invitación no existe o ya se usó.',invMail:'Esta invitación es para otro correo. Pide a tu pareja que revise el correo que registró.',invOk:'¡Listo! Ahora están conectados 💞',
  swap:'Cambiar de cuenta',out:'Cerrar sesión',
  why:{ask:'Pregunta lo que te dé vergüenza, de forma anónima, y recibe respuestas de otras mujeres u hombres.',guide:'Qué hay en cada parte de la app, explicado con calma.',wish:'Tu lista de todo lo que quieres probar, y el match con tu pareja.',
   diary:'El diario de las posiciones que hicieron, con nota y lo que les pareció.',talk:'Provocaciones y deseos revelados, solo entre ustedes.',pos:'Posiciones en 3D, para ella, para él y para los dos, con nivel.',
   fore:'Preliminares para ella y para él, paso a paso.',heat:'Reto de pareja de 1 a 7 días y el Para mi amor.',bdsm:'BDSM con seguridad: límites, semáforo y cuidado.',toys:'Guía de juguetes y la consultoría discreta.',
   concierge:'Consultoría discreta para elegir juguetes.',chal:'Reto de pareja de 1 a 7 días.',love:'Mensajes solo entre ustedes.',def:'Esta parte es del Entre Nosotros completo.'}}};
const F=()=>FX[lang];
const isFree=()=>!!(S.uid&&S.isFree);
const SCR2TILE={ask:'ask',guide:'guide',wish:'wish',diary:'diary',talk:'talk',posl:'pos',pos:'pos',pre:'fore',heat:'heat',chal:'heat',love:'heat',bdsm:'bdsm',toys:'toys',concierge:'toys'};
const freeLeft=()=>Math.max(0,S.freeLeft==null?3:S.freeLeft);

// ---------- janelinha de bloqueio ----------
window.openLock=function(key){const f=F(),k=SCR2TILE[key]||key,tile=(t().tiles||{})[k];
  closeLock();const d=document.createElement('div');d.className='lockov';d.id='lockov';
  d.innerHTML=`<div class="locksh" role="dialog" aria-modal="true"><span class="lockic">${ic('lock',22)}</span><div class="eyebrow">${f.lock}</div>
   <h2>${tile?tile[1]:''}</h2><p>${f.why[k]||f.why[key]||f.why.def}</p>
   <div class="btns"><button type="button" class="btn pri" data-lk="want">${f.want}</button><button type="button" class="btn ghost" data-lk="inv">${f.invite}</button><button type="button" class="btn link" data-lk="close">${f.later}</button></div></div>`;
  document.body.appendChild(d)};
function closeLock(){const o=document.getElementById('lockov');if(o)o.remove()}
document.addEventListener('click',e=>{const ov=e.target.id==='lockov';const b=e.target.closest('[data-lk]');if(!ov&&!b)return;
  const a=ov?'close':b.dataset.lk;closeLock();
  if(a==='want')toast(F().soon);
  if(a==='inv'){S.fa={inv:true,code:''};go('account')}},true);

// ---------- tela inicial: tudo aparece, com cadeado ----------
const _home=R.home;
R.home=function(){let h=_home();if(!isFree())return h;const f=F();
  // no lugar do "esperando seu amor": o card do jogo grátis
  h=h.replace(/<button type="button" class="couple"[\s\S]*?<\/button>/,`<button type="button" class="wkban" data-fr="mgame"><span class="tagc gold">${ic('games',14)} ${f.free(freeLeft())}</span><strong>${t().g2?t().g2.room:''}</strong><span>${f.freeGo}</span></button>`);
  h=h.replace(/<button type="button" class="wkban" data-act="gowk">[\s\S]*?<\/button>/,'');
  // cadeado em tudo que não é jogo nem conta
  h=h.replace(/<button type="button" class="tile( [a-z0-9]+)?" data-tile="([a-z]+)">/g,(m,c,k)=>k==='games'||k==='acc'?m:`<button type="button" class="tile${c||''} locked" data-tile="${k}"><span class="lk">${ic('lock',14)}</span>`);
  return h};
document.addEventListener('click',e=>{if(!isFree())return;
  const g=e.target.closest('[data-fr="mgame"],[data-tile="games"],[data-act="gowk"]');if(g){e.stopImmediatePropagation();go('mgame');return}
  const tl=e.target.closest('.tile.locked');if(tl){e.stopImmediatePropagation();openLock(tl.dataset.tile)}},true);

// se a tela inicial abriu antes de saber que a conta é grátis, redesenha
let fixN=0;const fixIv=setInterval(()=>{if(++fixN>15){clearInterval(fixIv);return}if(S.screen==='home'&&isFree()&&!document.querySelector('#view .tile.locked'))render()},800);

// ---------- Minha conta da conta grátis ----------
S.fa={inv:false,code:''};
const _acc=R.account;
R.account=function(){if(!isFree())return _acc();const f=F(),fa=S.fa;
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${f.acc}</h2>
   <div class="regbox"><div class="regh">${ic('acc',20)}<div><strong>${esc(S.name||'')}</strong><span>${esc(S.email||'')}</span></div></div></div>
   <div class="regbox"><div class="regh">${ic('games',20)}<div><strong>${f.plan}</strong><span>${f.planFree(freeLeft())}</span></div></div>
     <button type="button" class="btn pri" data-fa="want" style="margin-top:12px">${f.want}</button></div>
   <div class="regbox love"><div class="regh">${ic('love',20)}<div><strong>${f.invT}</strong><span>${f.invL}</span></div></div>
     ${fa.inv?`<div class="field" style="margin-top:12px"><input id="facode" placeholder="${f.invPh}" value="${esc(fa.code)}" autocomplete="off"></div><button type="button" class="btn pri" data-fa="join">${f.invBtn}</button>`
       :`<button type="button" class="btn ghost" data-fa="open" style="margin-top:12px">${f.invite}</button>`}</div>
   <div class="btns" style="margin-top:8px"><button type="button" class="btn ghost" data-fa="swap">${f.swap}</button></div></section>`};
document.addEventListener('input',e=>{if(e.target.id==='facode')S.fa.code=e.target.value});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-fa]');if(!b)return;e.stopImmediatePropagation();const f=F(),a=b.dataset.fa;
  if(a==='want'){toast(f.soon);return}
  if(a==='open'){S.fa.inv=true;render();return}
  if(a==='swap'){try{await sb.auth.signOut()}catch(_){}S.uid=null;S.isFree=false;S.isPaid=false;S.hasProfile=false;S.email='';S.name='';if(S.mf)S.mf.mode='old';go('login',{reset:true});return}
  if(a==='join'){const raw=(S.fa.code||'').trim();const m=raw.match(/convite=([A-Za-z0-9]+)/);const code=(m?m[1]:raw).toUpperCase();
    if(!code){toast(f.invBad);return}b.disabled=true;
    const {error}=await sb.rpc('accept_invite',{p_code:code,p_nickname:S.name||'',p_lang:lang,p_adult:true,p_sensitive:true});b.disabled=false;
    if(error){toast(/outro e-mail/.test(error.message)?f.invMail:f.invBad);return}
    toast(f.invOk);setTimeout(()=>{location.href=location.pathname},900)}},true);
})();
