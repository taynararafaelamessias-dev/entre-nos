// =====================================================================
// Entre Nós · jogos de verdade (salas em tempo real, jogo grátis com link)
// Só funciona no modo real (com Supabase).
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;

const RG={
 pt:{signT:'Antes de jogar, crie seu acesso',signLead:'É rapidinho e serve pros seus 3 jogos grátis. Ninguém vê seus dados.',haveAcc:'Já tenho conta',noAcc:'Criar conta',
  nick:'Seu apelido',nickPh:'Como a pessoa te conhece',email:'Seu e-mail',pass:'Senha',passPh:'Mínimo 6 caracteres',iam:'Eu sou',w:'Mulher',m:'Homem',
  age:'Tenho 18 anos ou mais e aceito os <a href="#" data-en="terms">termos de uso</a> e a <a href="#" data-en="terms">política de privacidade</a>.',
  sens:'Autorizo o Entre Nós a guardar minhas escolhas nos jogos pra que eles funcionem. Posso retirar quando quiser.',
  create:'Criar e continuar',enter:'Entrar e continuar',errFill:'Preencha apelido, e-mail, senha (mínimo 6) e “Eu sou”.',errAge:'Marque as duas caixinhas pra continuar.',
  pick:'Escolha o jogo',left:n=>n>0?`${n} de 3 jogos grátis restantes`:'Seus 3 jogos grátis acabaram',
  waitT:'Mande o link pra pessoa',waitLead:n=>`Assim que ${n?n:'a pessoa'} entrar, o jogo começa aqui sozinho.`,waiting:'Esperando a outra pessoa entrar…',
  copy:'Copiar link',copyMsg:'Copiar mensagem pro WhatsApp',copied:'Copiado ✓',msg:(n,g)=>`${n} te chamou pra jogar “${g}” no Entre Nós 🔥 Cada um no seu celular. Entra por aqui:\n`,
  invT:(n)=>`<em>${n}</em> te chamou pra jogar`,invLead:'Um jogo a dois, cada um no seu celular. Pra entrar, você cria um acesso rápido. Ninguém vê seus dados.',
  invGo:'Quero jogar',invNo:'Agora não',expired:'Esse convite expirou ou a sala já está cheia.',joined:n=>`${n} entrou no jogo 🔥`,
  turnMe:'Sua vez',turnThem:n=>`Vez de ${n}…`,them:'A outra pessoa',leave:'Sair da sala',erased:'Tudo que vocês escreverem aqui se apaga sozinho em 24 horas.',
  planWait:n=>`Esperando ${n} enviar…`,planMine:'Você já enviou. Assim que a outra pessoa enviar, aparece o que deu match.',
  todWait:n=>`${n} está escolhendo…`,todTheirs:(n,k)=>`${n} escolheu ${k}:`,answer:'Responder',teaseNone:'Nenhuma provocação ainda.',
  call:n=>`${n} te chamou pra jogar`,callGo:'Entrar no jogo',endAsk:'Encerrar o jogo',paywall:'Você usou seus 3 jogos grátis. Assine o Entre Nós pra jogar sem limite.',subscribe:'Conhecer o Entre Nós',
  err:'Algo deu errado. Tente de novo.',locked:'Essa parte é do Entre Nós completo. No grátis, só os jogos.',overT:'Esse jogo grátis chegou ao fim 🔥',overL:'Cada jogo grátis tem 20 jogadas. Pra continuar jogando sem limite e liberar posições em 3D, preliminares, brinquedos e tudo mais, assine o Entre Nós.',backFree:'Voltar aos jogos grátis',playsLeft:n=>`${n} jogadas restantes neste jogo grátis`,switchT:'Jogar outra coisa com a mesma pessoa',switchHint:'Trocar de jogo aqui não gasta outro jogo grátis.',openT:'Continuar de onde parou',openWait:'esperando alguém entrar',openWith:n=>`com ${n}`,notConf:'Seu e-mail ainda não foi confirmado. Abra o e-mail de confirmação e toque no link, depois entre aqui.',finT:'Falta só completar seu perfil',finBtn:'Concluir e continuar'},
 es:{signT:'Antes de jugar, crea tu acceso',signLead:'Es rapidito y sirve para tus 3 juegos gratis. Nadie ve tus datos.',haveAcc:'Ya tengo cuenta',noAcc:'Crear cuenta',
  nick:'Tu apodo',nickPh:'Como te conoce la otra persona',email:'Tu correo',pass:'Contraseña',passPh:'Mínimo 6 caracteres',iam:'Soy',w:'Mujer',m:'Hombre',
  age:'Tengo 18 años o más y acepto los <a href="#" data-en="terms">términos de uso</a> y la <a href="#" data-en="terms">política de privacidad</a>.',
  sens:'Autorizo a Entre Nosotros a guardar mis elecciones en los juegos para que funcionen. Puedo retirarlo cuando quiera.',
  create:'Crear y continuar',enter:'Entrar y continuar',errFill:'Rellena apodo, correo, contraseña (mínimo 6) y “Soy”.',errAge:'Marca las dos casillas para continuar.',
  pick:'Elige el juego',left:n=>n>0?`Te quedan ${n} de 3 juegos gratis`:'Se acabaron tus 3 juegos gratis',
  waitT:'Envía el enlace a la otra persona',waitLead:n=>`En cuanto ${n?n:'la otra persona'} entre, el juego empieza aquí solo.`,waiting:'Esperando a que la otra persona entre…',
  copy:'Copiar enlace',copyMsg:'Copiar mensaje para WhatsApp',copied:'Copiado ✓',msg:(n,g)=>`${n} te invitó a jugar “${g}” en Entre Nosotros 🔥 Cada uno en su móvil. Entra aquí:\n`,
  invT:(n)=>`<em>${n}</em> te invitó a jugar`,invLead:'Un juego a dos, cada uno en su móvil. Para entrar, creas un acceso rápido. Nadie ve tus datos.',
  invGo:'Quiero jugar',invNo:'Ahora no',expired:'Esta invitación caducó o la sala ya está llena.',joined:n=>`${n} entró al juego 🔥`,
  turnMe:'Tu turno',turnThem:n=>`Turno de ${n}…`,them:'La otra persona',leave:'Salir de la sala',erased:'Todo lo que escriban aquí se borra solo en 24 horas.',
  planWait:n=>`Esperando a que ${n} envíe…`,planMine:'Ya enviaste. En cuanto la otra persona envíe, aparece el match.',
  todWait:n=>`${n} está eligiendo…`,todTheirs:(n,k)=>`${n} eligió ${k}:`,answer:'Responder',teaseNone:'Todavía no hay provocaciones.',
  call:n=>`${n} te invitó a jugar`,callGo:'Entrar al juego',endAsk:'Terminar el juego',paywall:'Usaste tus 3 juegos gratis. Suscríbete a Entre Nosotros para jugar sin límite.',subscribe:'Conocer Entre Nosotros',
  err:'Algo salió mal. Inténtalo de nuevo.',locked:'Esta parte es de Entre Nosotros completo. En la versión gratis, solo los juegos.',overT:'Este juego gratis llegó al final 🔥',overL:'Cada juego gratis tiene 20 jugadas. Para seguir jugando sin límite y desbloquear posturas en 3D, preliminares, juguetes y todo lo demás, suscríbete a Entre Nosotros.',backFree:'Volver a los juegos gratis',playsLeft:n=>`Quedan ${n} jugadas en este juego gratis`,switchT:'Jugar a otra cosa con la misma persona',switchHint:'Cambiar de juego aquí no gasta otro juego gratis.',openT:'Seguir donde lo dejaste',openWait:'esperando a que alguien entre',openWith:n=>`con ${n}`,notConf:'Tu correo todavía no está confirmado. Abre el correo de confirmación y toca el enlace, después entra aquí.',finT:'Solo falta completar tu perfil',finBtn:'Terminar y continuar'}};
const R2=()=>RG[lang];

// ---------- estado da sala ----------
S.rm={id:null,code:null,game:null,host:null,people:{},events:[],ch:null,poll:null,lastId:0,draft:'',ideas:false,freeLeft:null,planSel:{},todLv:1};
S.mf={mode:'new',g:null,age:false,sens:false};   // formulário rápido do jogo grátis
S.pendingRoom=null;                               // código de sala vindo de um link
const me=()=>S.uid;
const otherId=()=>Object.keys(S.rm.people).find(id=>id!==me());
const otherName=()=>S.rm.people[otherId()]||R2().them;
const roomLink=()=>location.host+'/?jogo='+(S.rm.code||'');

async function enterRoom(roomId){
  const r=S.rm;leaveRoom(true);
  const {data:room}=await sb.from('game_rooms').select('id,code,game,created_by,state,free').eq('id',roomId).maybeSingle();
  if(!room){toast(R2().expired);return}
  Object.assign(r,{id:room.id,code:room.code,game:room.game,host:room.created_by,free:room.free,over:false,events:[],lastId:0,draft:'',ideas:false,planSel:{}});
  await loadPeople();await pullEvents();
  r.ch=sb.channel('room-'+room.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'game_events',filter:'room_id=eq.'+room.id},p=>addEvents([p.new]))
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'game_members',filter:'room_id=eq.'+room.id},async()=>{const before=Object.keys(r.people).length;await loadPeople();if(Object.keys(r.people).length>before&&otherId())toast(R2().joined(otherName()));rr()})
    .subscribe();
  r.poll=setInterval(async()=>{await pullEvents();if(!otherId()){await loadPeople();if(otherId()){toast(R2().joined(otherName()));rr()}}},4000);
  go('groom')}
function leaveRoom(silent){const r=S.rm;if(r.ch){sb.removeChannel(r.ch);r.ch=null}if(r.poll){clearInterval(r.poll);r.poll=null}if(!silent)r.id=null}
async function loadPeople(){const {data}=await sb.rpc('room_people',{p_room:S.rm.id});S.rm.people={};(data||[]).forEach(p=>S.rm.people[p.user_id]=p.nickname)}
async function pullEvents(){const r=S.rm;if(!r.id)return;const {data}=await sb.from('game_events').select('id,user_id,kind,body,data,created_at').eq('room_id',r.id).gt('id',r.lastId).order('id');if(data&&data.length)addEvents(data)}
function addEvents(list){const r=S.rm;let changed=false;list.forEach(e=>{if(e.room_id&&e.room_id!==r.id)return;if(r.events.some(x=>x.id===e.id))return;r.events.push(e);r.lastId=Math.max(r.lastId,e.id);changed=true});
  if(changed){r.events.sort((a,b)=>a.id-b.id);rr()}}
function rr(){if(S.screen==='groom'){const vw=document.getElementById('view');if(vw)vw.classList.add('still');setTimeout(()=>{if(vw)vw.classList.remove('still')},50);const y=window.scrollY;const ta=document.getElementById('rgin');const foc=ta&&document.activeElement===ta;render();window.scrollTo(0,y);if(foc){const n=document.getElementById('rgin');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}}}}
const PLAYK=['msg','tod','tdone','plan','tease'];const plays=()=>S.rm.events.filter(e=>PLAYK.includes(e.kind)).length;
async function send(kind,body,data){if(S.rm.free&&PLAYK.includes(kind)&&plays()>=FREE_MAX){S.rm.over=true;rr();return false}
  const {error}=await sb.from('game_events').insert({room_id:S.rm.id,kind,body:body||null,data:data||null});if(error){if(/limite/.test(error.message||'')){S.rm.over=true;rr();return false}toast(R2().err);return false}await pullEvents();return true}

// ---------- regras de cada jogo, a partir dos eventos ----------
function sinceReset(){const ev=S.rm.events;let i=-1;ev.forEach((e,k)=>{if(e.kind==='reset'||e.kind==='switch')i=k});return ev.slice(i+1)}
function curGame(){const sw=S.rm.events.filter(e=>e.kind==='switch');return sw.length?sw[sw.length-1].data.game:S.rm.game}
function sceneIdx(){const ev=S.rm.events.filter(e=>e.kind==='reset');const base=parseInt(S.rm.code.replace(/[^0-9]/g,'')||'0',10);return (base+ev.length)%SCENES.length}
function chatTurn(msgs){if(!msgs.length)return S.rm.host;const last=msgs[msgs.length-1].user_id;return last===me()?otherId():me()}

function bodyScene(isScene){const G=GTX(),X=R2(),ev=sinceReset(),msgs=ev.filter(e=>e.kind==='msg'),ended=ev.some(e=>e.kind==='end');
  const chat=`<div class="chat">${msgs.map(m=>`<div class="bub2 ${m.user_id===me()?'me':'them'}">${esc(m.body)}</div>`).join('')}</div>`;
  if(ended){if(isScene)return `${chat}<div class="wkhero center"><div class="bigic">${ic('heat',40)}</div><h2>${G.ended}</h2><p class="hint">${G.erase}</p><button type="button" class="btn pri" data-rg="reset">${G.newScene}</button></div>`;
    const mine=msgs.filter(m=>m.user_id===me()),th=msgs.filter(m=>m.user_id!==me());
    return `<div class="wkhero"><span class="tagc gold">${ic('toys',14)} ${G.mapT}</span><div class="sec-t">${G.mapYou}</div>${mine.map(c=>`<div class="witem"><p>${esc(c.body)}</p></div>`).join('')}<div class="sec-t">${G.mapThem}</div>${th.map(c=>`<div class="witem"><p>${esc(c.body)}</p></div>`).join('')}</div><button type="button" class="btn ghost" data-rg="reset">${lang==='pt'?'Jogar de novo':'Jugar otra vez'}</button>`}
  const turn=chatTurn(msgs),mine=turn===me(),st=Math.min(2,Math.floor(msgs.filter(m=>m.user_id===me()).length/2));
  return `${isScene?`<div class="scene"><span class="po">${G.sceneT}</span><p>${SCENES[sceneIdx()][lang]}</p></div>`:`<div class="note">${G.likeLead}</div><p class="hint">${G.likeEx}</p>`}${chat}
   ${mine?`<div class="tturn">${X.turnMe}</div><textarea id="rgin" rows="2" placeholder="${isScene?G.scenePh:G.likePh}">${esc(S.rm.draft)}</textarea>
     ${isScene&&S.rm.ideas?`<p class="hint">${G.ideaT}</p><div class="ideas">${IDEAS[lang][st].map((x,i)=>`<button type="button" class="ideab" data-rgidea="${i}">${x}</button>`).join('')}</div>`:''}
     <div class="row"><button type="button" class="btn pri sm" data-rg="msg">${G.send}</button>${isScene?`<button type="button" class="btn ghost sm" data-rg="ideas">${ic('fore',15)} ${G.idea}</button>`:''}</div>`
   :`<div class="bub2 them typing">${X.turnThem(esc(otherName()))}</div>`}
   ${msgs.length>=2?`<button type="button" class="btn gold" data-rg="end">${isScene?G.end:G.likeEnd}</button>`:''}`}

function bodyPlan(){const G=GTX(),X=R2(),ev=sinceReset().filter(e=>e.kind==='plan');const mine=[...ev].reverse().find(e=>e.user_id===me()),th=[...ev].reverse().find(e=>e.user_id!==me());
  if(!mine)return `<p class="hint">${G.planLead}</p><div class="plist2">${PLAN_IDS.map(id=>`<label class="pchk"><input type="checkbox" data-rgpl="${id}" ${S.rm.planSel[id]?'checked':''}><span>${WBY[id][lang]}</span></label>`).join('')}</div><button type="button" class="btn pri" data-rg="plan">${G.planSend}</button>`;
  if(!th)return `<div class="wkhero center"><div class="bigic">${ic('both',40)}</div><h2>${X.planWait(esc(otherName()))}</h2><p class="hint">${X.planMine}</p></div>`;
  const a=new Set(mine.data.sel||[]),m=(th.data.sel||[]).filter(id=>a.has(id));
  return `<div class="wkhero"><span class="tagc gold">${ic('heat',14)} ${G.planRes}</span>${m.length?m.map(id=>`<div class="witem"><p>${WBY[id][lang]}</p></div>`).join(''):`<p>${G.planNone}</p>`}</div><button type="button" class="btn ghost" data-rg="reset">${lang==='pt'?'Jogar de novo':'Jugar otra vez'}</button>`}

function bodyTod(){const G=GTX(),X=R2(),ev=sinceReset();
  // rodadas: 'tod' (escolha) → 'tdone' (feito/resposta) ou 'tskip' (pulou, escolhe de novo)
  let done=0,open=null,skips={};ev.forEach(e=>{if(e.kind==='tod')open=e;else if(e.kind==='tdone'&&open){done++;open=null}else if(e.kind==='tskip'&&open){skips[e.user_id]=(skips[e.user_id]||0)+1;open=null}});
  const chooser=done%2===0?S.rm.host:(S.rm.host===me()?otherId():me()),mineTurn=chooser===me();
  const lastDone=[...ev].reverse().find(e=>e.kind==='tdone');
  const lvl=`<div class="chips">${G.lv.map((l,i)=>`<button type="button" class="chip" data-rglv="${i}" aria-pressed="${S.rm.todLv===i}">${l}</button>`).join('')}</div>`;
  const prev=lastDone&&lastDone.body?`<div class="witem"><span class="po">${lastDone.user_id===me()?(lang==='pt'?'Sua resposta':'Tu respuesta'):esc(otherName())}</span><p>${esc(lastDone.body)}</p></div>`:'';
  if(open){const d=open.data,txt=TOD[lang][d.k][d.lv][d.i%3],kn=d.k==='t'?G.truth:G.dare;
    if(open.user_id===me())return `${prev}<div class="wcard"><span class="po">${kn}</span><p class="wtext">${txt}</p>${d.k==='t'?`<textarea id="rgin" rows="2" placeholder="${G.answerPh}">${esc(S.rm.draft)}</textarea>`:''}
      <div class="row"><button type="button" class="btn pri sm" data-rg="tdone">${d.k==='t'?X.answer:G.done}</button>${(skips[me()]||0)<1?`<button type="button" class="btn ghost sm" data-rg="tskip">${G.skip}</button>`:''}</div></div>`;
    return `${prev}<div class="wcard"><span class="po">${X.todTheirs(esc(otherName()),kn)}</span><p class="wtext">${txt}</p></div><p class="hint">${X.turnThem(esc(otherName()))}</p>`}
  if(!mineTurn)return `${prev}<div class="wkhero center"><h2>${X.todWait(esc(otherName()))}</h2></div>`;
  return `${prev}<p class="hint">${G.todLead}</p>${lvl}<div class="tturn">${X.turnMe}</div><div class="wbtns2"><button type="button" class="wb maybe" data-rgtk="t">${G.truth}</button><button type="button" class="wb yes" data-rgtk="d">${G.dare}</button></div>`}

function bodyTease(){const G=GTX(),X=R2(),ev=S.rm.events.filter(e=>e.kind==='tease');
  return `<p class="hint">${G.teaseLead}</p><div class="plist2">${TEASES[lang].map((x,i)=>`<button type="button" class="lvmsg" data-rgtz="${i}">${x}</button>`).join('')}</div>
   <textarea id="rgin" rows="2" placeholder="${G.teasePh}">${esc(S.rm.draft)}</textarea><button type="button" class="btn pri" data-rg="tease">${ic('heat',16)} ${G.teaseSend}</button>
   <div class="sec-t"></div>${ev.length?[...ev].reverse().map(e=>`<div class="notif"><span class="gic">${ic('bell',18)}</span><div><strong>${e.user_id===me()?(lang==='pt'?'Você mandou':'Tú enviaste'):G.teaseNotif(esc(otherName()))}</strong><span>${esc(e.body)}</span></div></div>`).join(''):`<p class="hint">${X.teaseNone}</p>`}`}

const FREE_MAX=20;
R.groom=function(){const G=GTX(),X=R2(),r=S.rm;if(!r.id)return R.games();
  if(r.free&&(r.over||plays()>=FREE_MAX))return `<section class="screen"><button type="button" class="back" data-rg="leave">${G.back}</button><div class="wkhero center"><div class="bigic">${ic('heat',40)}</div><h2>${X.overT}</h2><p>${X.overL}</p>
    <button type="button" class="btn pri" data-act="welcome">${X.subscribe}</button><button type="button" class="btn ghost" data-rg="leave">${X.backFree}</button></div></section>`;
  const cg=curGame();const title=G.games[cg]?G.games[cg][0]:'';let body='';
  if(!otherId()){const link=roomLink();
    body=`<div class="note">${X.waitLead(null)}</div><div class="invite"><label>${X.waitT}</label><div class="linkbox"><code>${link}</code><button type="button" class="copy" data-rg="copy">${X.copy}</button></div></div>
      <button type="button" class="btn gold" data-rg="copymsg">${X.copyMsg}</button><div class="wkhero center"><div class="bigic">${ic('both',36)}</div><p>${X.waiting}</p></div>`}
  else{body=(cg==='scene'?bodyScene(true):cg==='like'?bodyScene(false):cg==='plan'?bodyPlan():cg==='tod'?bodyTod():bodyTease())+`<div class="sec-t">${X.switchT}</div><div class="chips wrap">${Object.entries(G.games).filter(([k])=>k!==cg).map(([k,v])=>`<button type="button" class="chip" data-rgsw="${k}">${ic(GIC[k],14)} ${v[0]}</button>`).join('')}</div><p class="hint">${X.switchHint}</p>`}
  return `<section class="screen"><button type="button" class="back" data-rg="leave">${G.back}</button><h2>${title}</h2>
   ${otherId()?`<span class="tagc" style="align-self:flex-start">${ic('both',14)} ${esc(S.rm.people[me()]||'')} + ${esc(otherName())}</span>`:''}
   ${r.free&&otherId()?`<span class="tagc gold" style="align-self:flex-start">${X.playsLeft(Math.max(0,FREE_MAX-plays()))}</span>`:''}${body}<p class="hint">${ic('lock',13)} ${X.erased}</p></section>`};

// ---------- jogo grátis: cadastro rápido, escolha do jogo, convite ----------
R.mgame=function(){const X=R2(),G=t().mg,f=S.mf;
  const head=`<section class="screen"><button type="button" class="back" data-act="back">${G?'← '+(lang==='pt'?'Voltar':'Volver'):''}</button><h2>${G.title}</h2>`;
  if(S.pendingRoom&&S.pendingRoom.info&&!S.uid){const inf=S.pendingRoom.info;
    if(!S.pendingRoom.go)return `${head}<h1 style="font-size:36px">${X.invT(esc(inf.host))}</h1><p class="lead">${X.invLead}</p><div class="scene"><span class="po">${GTX().games[inf.game][0]}</span><p>${GTX().games[inf.game][1]}</p></div>
      <div class="btns"><button type="button" class="btn pri" data-rg="invgo">${X.invGo}</button><button type="button" class="btn link" data-rg="invno">${X.invNo}</button></div></section>`}
  if(S.uid&&!S.hasProfile){f.mode='finish';
    return `${head}<div class="note">${X.signLead}</div><h3 style="margin:6px 0 0">${X.finT}</h3><form id="fg" novalidate class="btns" style="gap:14px">
      <div class="field"><label for="gnm">${X.nick}</label><input id="gnm" placeholder="${X.nickPh}" autocomplete="nickname"></div>
      <div class="field"><label>${X.iam}</label><div class="opts"><button type="button" class="opt" data-rgg="f" aria-pressed="${f.g==='f'}">${X.w}</button><button type="button" class="opt" data-rgg="m" aria-pressed="${f.g==='m'}">${X.m}</button></div></div>
      <label class="agechk"><input type="checkbox" id="gage" ${f.age?'checked':''}><span>${X.age}</span></label>
      <label class="agechk"><input type="checkbox" id="gsens" ${f.sens?'checked':''}><span>${X.sens}</span></label>
      <button class="btn pri" type="submit">${X.finBtn}</button></form></section>`}
  if(!S.uid||!S.hasProfile){
    const newAcc=f.mode==='new';
    return `${head}<p class="lead">${G.lead}</p><div class="note">${X.signLead}</div><h3 style="margin:6px 0 0">${X.signT}</h3>
     <div class="seg" role="group"><button type="button" class="seg-b" data-rg="fmode:new" aria-pressed="${newAcc}">${X.noAcc}</button><button type="button" class="seg-b" data-rg="fmode:old" aria-pressed="${!newAcc}">${X.haveAcc}</button></div>
     <form id="fg" novalidate class="btns" style="gap:14px">
      ${newAcc?`<div class="field"><label for="gnm">${X.nick}</label><input id="gnm" placeholder="${X.nickPh}" autocomplete="nickname"></div>`:''}
      <div class="field"><label for="gem">${X.email}</label><input id="gem" type="email" autocomplete="email"></div>
      <div class="field"><label for="gpw">${X.pass}</label><input id="gpw" type="password" placeholder="${X.passPh}" autocomplete="${newAcc?'new-password':'current-password'}"></div>
      ${newAcc?`<div class="field"><label>${X.iam}</label><div class="opts"><button type="button" class="opt" data-rgg="f" aria-pressed="${f.g==='f'}">${X.w}</button><button type="button" class="opt" data-rgg="m" aria-pressed="${f.g==='m'}">${X.m}</button></div></div>
      <label class="agechk"><input type="checkbox" id="gage" ${f.age?'checked':''}><span>${X.age}</span></label>
      <label class="agechk"><input type="checkbox" id="gsens" ${f.sens?'checked':''}><span>${X.sens}</span></label>`:''}
      <button class="btn pri" type="submit">${newAcc?X.create:X.enter}</button></form></section>`}
  const left=S.freeLeft;
  if(!S.isPaid&&left===0)return `${head}<div class="note">${X.paywall}</div><button type="button" class="btn pri" data-act="welcome">${X.subscribe}</button></section>`;
  const op=(S.openRooms||[]).length?`<div class="sec-t" style="color:var(--honey)">${X.openT}</div><div class="glist">${S.openRooms.map(o=>`<button type="button" class="gcard" data-rgresume="${o.id}"><span class="gic">${ic(GIC[o.game]||'games',24)}</span><span class="gbody"><strong>${(GTX().games[o.game]||[''])[0]}</strong><span>${o.with?X.openWith(esc(o.with)):X.openWait}</span></span><span class="gplay">${GTX().play}</span></button>`).join('')}</div>`:'';
  return `${head}${!S.isPaid&&left!=null?`<span class="tagc gold" style="align-self:flex-start">${X.left(left)}</span>`:''}${op}<div class="sec-t">${X.pick}</div>
   <div class="glist">${Object.entries(GTX().games).map(([k,v])=>`<button type="button" class="gcard" data-rgopen="${k}"><span class="gic">${ic(GIC[k],24)}</span><span class="gbody"><strong>${v[0]}</strong><span>${typeof GUIDE_GAMES!=='undefined'?GUIDE_GAMES[lang][k]:v[1]}</span></span><span class="gplay">${GTX().play}</span></button>`).join('')}</div></section>`};

async function refreshFree(){if(!S.uid)return;S.hasProfile=!!(await sb.from('profiles').select('id').eq('id',S.uid).maybeSingle()).data;
  const {data:p}=await sb.rpc('has_active_plan');S.isPaid=!!p;S.isFree=!S.isPaid;
  const {data:fp}=await sb.from('free_plays').select('used').eq('user_id',S.uid).maybeSingle();S.freeLeft=3-((fp&&fp.used)||0);await loadOpenRooms()}
async function loadOpenRooms(){const since=new Date(Date.now()-864e5).toISOString();
  const {data:rooms}=await sb.from('game_rooms').select('id,game,created_at').gt('created_at',since).order('created_at',{ascending:false}).limit(5);
  const out=[];for(const r of rooms||[]){const {data:pp}=await sb.rpc('room_people',{p_room:r.id});const o=(pp||[]).find(p=>p.user_id!==S.uid);out.push({id:r.id,game:r.game,with:o?o.nickname:null})}
  S.openRooms=out}

async function openRoom(game){const {data,error}=await sb.rpc('open_room',{p_game:game});
  if(error){toast(/3 jogos/.test(error.message)?R2().paywall:R2().err);return}
  const r=data[0];S.rm.freeLeft=r.free_left;await enterRoom(r.room_id)}

// cadastro rápido do jogo grátis
document.addEventListener('submit',async e=>{if(e.target.id!=='fg')return;e.preventDefault();e.stopImmediatePropagation();
  const X=R2(),f=S.mf,v=x=>(document.getElementById(x)||{}).value||'',btn=e.target.querySelector('button[type=submit]');btn.disabled=true;
  try{
    const em=v('gem').trim().toLowerCase(),pw=v('gpw');
    if(f.mode==='finish'){const nm=v('gnm').trim();if(!nm||!f.g){toast(X.errFill);return}if(!f.age||!f.sens){toast(X.errAge);return}
      const r=await sb.rpc('register_free',{p_nickname:nm,p_gender:f.g,p_lang:lang,p_adult:true,p_sensitive:true});if(r.error)throw r.error;S.name=nm}
    else if(f.mode==='new'){const nm=v('gnm').trim();if(!nm||!em||pw.length<6||!f.g){toast(X.errFill);return}if(!f.age||!f.sens){toast(X.errAge);return}
      const {data,error}=await sb.auth.signUp({email:em,password:pw});if(error)throw error;
      if(!data.session){try{localStorage.setItem('en_free_pending',JSON.stringify({nm,g:f.g}))}catch(_){}f.mode='old';showCheckMail(em,'mgame');return}
      S.uid=data.user.id;S.email=em;const r=await sb.rpc('register_free',{p_nickname:nm,p_gender:f.g,p_lang:lang,p_adult:true,p_sensitive:true});if(r.error)throw r.error;S.name=nm}
    else{if(!em||!pw){toast(X.errFill);return}const {data,error}=await sb.auth.signInWithPassword({email:em,password:pw});if(error)throw error;S.uid=data.user.id;S.email=em}
    await refreshFree();
    if(!S.hasProfile){let pend=null;try{pend=JSON.parse(localStorage.getItem('en_free_pending')||'null')}catch(_){}
      if(pend){const r=await sb.rpc('register_free',{p_nickname:pend.nm,p_gender:pend.g,p_lang:lang,p_adult:true,p_sensitive:true});if(!r.error){try{localStorage.removeItem('en_free_pending')}catch(_){}await refreshFree()}}}
    if(!S.hasProfile){render();return}
    if(S.pendingRoom){await joinPending();return}
    render();
  }catch(err){if(/not confirmed/i.test(err.message||'')){toast(X.notConf);return}toast(/Invalid login/i.test(err.message||'')?(lang==='pt'?'E-mail ou senha incorretos.':'Correo o contraseña incorrectos.'):/already/i.test(err.message||'')?(lang==='pt'?'Este e-mail já tem conta: toque em “Já tenho conta”.':'Este correo ya tiene cuenta: toca “Ya tengo cuenta”.'):R2().err)}
  finally{btn.disabled=false}},true);

async function joinPending(){const code=S.pendingRoom.code;S.pendingRoom=null;const {data,error}=await sb.rpc('join_room',{p_code:code});
  if(error){toast(R2().expired);go('mgame',{reset:true});return}await enterRoom(data)}

// cliques
document.addEventListener('click',async e=>{
  const o=e.target.closest('[data-rgopen]');if(o){e.stopImmediatePropagation();openRoom(o.dataset.rgopen);return}
  const g=e.target.closest('[data-rgg]');if(g){S.mf.g=g.dataset.rgg;document.querySelectorAll('[data-rgg]').forEach(b=>b.setAttribute('aria-pressed',b===g));return}
  const sw=e.target.closest('[data-rgsw]');if(sw){S.rm.planSel={};S.rm.draft='';send('switch',null,{game:sw.dataset.rgsw});window.scrollTo(0,0);return}
  const rs=e.target.closest('[data-rgresume]');if(rs){e.stopImmediatePropagation();enterRoom(rs.dataset.rgresume);return}
  const lv=e.target.closest('[data-rglv]');if(lv){S.rm.todLv=+lv.dataset.rglv;rr();return}
  const tk=e.target.closest('[data-rgtk]');if(tk){const n=S.rm.events.filter(x=>x.kind==='tod').length;send('tod',null,{k:tk.dataset.rgtk,lv:S.rm.todLv,i:n});return}
  const tz=e.target.closest('[data-rgtz]');if(tz){S.rm.draft=TEASES[lang][+tz.dataset.rgtz];rr();return}
  const id=e.target.closest('[data-rgidea]');if(id){S.rm.draft=id.textContent;S.rm.ideas=false;rr();return}
  const b=e.target.closest('[data-rg]');if(!b)return;const [a,p]=b.dataset.rg.split(':'),r=S.rm,X=R2();
  switch(a){
   case 'fmode':S.mf.mode=p;render();break;
   case 'invgo':S.pendingRoom.go=true;render();break;
   case 'invno':S.pendingRoom=null;go('welcome',{reset:true});break;
   case 'leave':leaveRoom();refreshFree().then(()=>{if(S.screen==='mgame')render()});go('mgame',{reset:true});break;
   case 'copy':copyText('https://'+roomLink(),X.copied);break;
   case 'copymsg':copyText(X.msg(S.rm.people[me()]||S.name||'',GTX().games[r.game][0])+'https://'+roomLink(),X.copied);break;
   case 'ideas':r.ideas=!r.ideas;rr();break;
   case 'msg':{const tx=r.draft.trim();if(!tx)break;r.draft='';r.ideas=false;await send('msg',tx);break}
   case 'end':await send('end');break;
   case 'reset':r.planSel={};await send('reset');break;
   case 'plan':{const sel=Object.keys(r.planSel).filter(k=>r.planSel[k]);await send('plan',null,{sel});break}
   case 'tdone':{const tx=r.draft.trim();r.draft='';await send('tdone',tx||null);break}
   case 'tskip':await send('tskip');break;
   case 'tease':{const tx=r.draft.trim();if(!tx)break;r.draft='';if(await send('tease',tx))toast(GTX().teaseSent);break}
  }},true);
document.addEventListener('change',e=>{const pl=e.target.closest('[data-rgpl]');if(pl){S.rm.planSel[pl.dataset.rgpl]=pl.checked;return}
  if(e.target.id==='gage')S.mf.age=e.target.checked;if(e.target.id==='gsens')S.mf.sens=e.target.checked});
document.addEventListener('input',e=>{if(e.target.id==='rgin')S.rm.draft=e.target.value});

// assinantes: tocar num jogo da Sala de jogos abre uma sala de verdade pro casal
document.addEventListener('click',e=>{const gc=e.target.closest('[data-game]');if(!gc||!S.uid)return;e.stopImmediatePropagation();openRoom(gc.dataset.game)},true);

// aviso quando o par abre uma sala pro casal
let callCh=null;
async function watchCalls(){if(callCh||!S.uid)return;
  callCh=sb.channel('calls-'+S.uid).on('postgres_changes',{event:'INSERT',schema:'public',table:'game_members',filter:'user_id=eq.'+S.uid},async p=>{
    const rid=p.new.room_id;if(rid===S.rm.id)return;const {data:room}=await sb.from('game_rooms').select('id,game,created_by').eq('id',rid).maybeSingle();
    if(!room||room.created_by===S.uid)return;S.call={id:rid,game:room.game};render()}).subscribe()}
const _home=R.home;R.home=function(){let h=_home();if(S.call){const X=R2(),g=GTX().games[S.call.game];
  h=h.replace('<div class="sec-t">',`<button type="button" class="wkban" data-rgcall="1"><span class="tagc gold">${ic('games',14)} ${X.call(esc(S.pname||(lang==='pt'?'Seu amor':'Tu amor')))}</span><strong>${g?g[0]:''}</strong><span>${X.callGo}</span></button><div class="sec-t">`)}return h};
document.addEventListener('click',e=>{const c=e.target.closest('[data-rgcall]');if(!c)return;e.stopImmediatePropagation();const id=S.call.id;S.call=null;enterRoom(id)},true);

// ---------- início: link de jogo e conta ----------
(async()=>{
  const q=new URLSearchParams(location.search),code=q.get('jogo');
  const {data:{session}}=await sb.auth.getSession();if(session){S.uid=session.user.id;await refreshFree();
    if(!S.hasProfile){let pend=null;try{pend=JSON.parse(localStorage.getItem('en_free_pending')||'null')}catch(_){}
      if(pend){const r=await sb.rpc('register_free',{p_nickname:pend.nm,p_gender:pend.g,p_lang:lang,p_adult:true,p_sensitive:true});if(!r.error){try{localStorage.removeItem('en_free_pending')}catch(_){}await refreshFree();if(!code)setTimeout(()=>go('mgame',{reset:true}),400)}}}
    watchCalls()}
  sb.auth.onAuthStateChange((ev,s)=>{if(s&&s.user){S.uid=s.user.id;watchCalls()}});
  if(code){history.replaceState(null,'',location.pathname);
    const {data}=await sb.rpc('room_info',{p_code:code});const inf=data&&data[0];
    if(!inf||inf.expired){toast(R2().expired);return}
    if(S.uid&&S.hasProfile){const {data:rid,error}=await sb.rpc('join_room',{p_code:code});if(error){toast(R2().expired);return}enterRoom(rid);return}
    if(inf.members>=2){toast(R2().expired);return}
    S.pendingRoom={code,info:inf,go:false};S.mf.mode='new';setTimeout(()=>go('mgame',{reset:true}),300)}
})();
// ao entrar no "Jogar grátis", carrega quantos jogos restam
const FREE_OK=['welcome','signup','login','checkmail','mgame','groom','partner','psignup'];
const _go=window.go;window.go=function(s,o){if(S.uid&&S.isFree&&!FREE_OK.includes(s)){toast(R2().locked);s='mgame';o={reset:true}}if(s==='mgame'&&S.uid)refreshFree().then(()=>{if(S.screen==='mgame')render()});return _go(s,o)};
})();
