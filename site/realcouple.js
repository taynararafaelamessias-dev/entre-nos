// =====================================================================
// Entre Nós · partes do casal de verdade: desafio, Pro meu amor, limites de BDSM,
// consultoria discreta, Minha conta e sininho
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
const X2={pt:{acc:'Minha <em>conta</em>',you:'Você',par:'Seu par',parWait:'Convite pendente',parIn:'Conectado',copyInv:'Copiar link de convite',change:'Trocar meu par',changeT:'Novo e-mail do seu par',changeG:'Seu novo par é',changeBtn:'Trocar e gerar novo convite',changeWarn:'Quem é o par hoje perde o acesso na hora, e o que vocês compartilharam some. Isso não tem volta.',changed:'Par trocado. Mande o novo convite.',onlyOwner:'Só quem pagou pode trocar o par.',lang:'Idioma',logout:'Sair da conta',plan:'Assinatura',planTest:'Acesso de teste (gratuito por enquanto)',menu:'Mais opções',bellT:'Avisos',bellNone:'Nenhum aviso por enquanto.',saved:'Pedido enviado! Uma consultora vai te chamar em até 24 horas.',err:'Algo deu errado. Tente de novo.',w:'Mulher',m:'Homem',needDb:'Essa função fica disponível depois da próxima atualização do banco.'},
 es:{acc:'Mi <em>cuenta</em>',you:'Tú',par:'Tu pareja',parWait:'Invitación pendiente',parIn:'Conectados',copyInv:'Copiar enlace de invitación',change:'Cambiar mi pareja',changeT:'Nuevo correo de tu pareja',changeG:'Tu nueva pareja es',changeBtn:'Cambiar y generar nueva invitación',changeWarn:'Quien es tu pareja hoy pierde el acceso al momento, y lo que compartieron desaparece. No se puede deshacer.',changed:'Pareja cambiada. Envía la nueva invitación.',onlyOwner:'Solo quien pagó puede cambiar la pareja.',lang:'Idioma',logout:'Cerrar sesión',plan:'Suscripción',planTest:'Acceso de prueba (gratis por ahora)',menu:'Más opciones',bellT:'Avisos',bellNone:'Todavía no hay avisos.',saved:'¡Solicitud enviada! Una asesora te contactará en menos de 24 horas.',err:'Algo salió mal. Inténtalo de nuevo.',w:'Mujer',m:'Hombre',needDb:'Esta función estará disponible tras la próxima actualización de la base de datos.'}};
const X=()=>X2[lang];
let partnerId=null;
async function getPartner(){if(partnerId)return partnerId;const {data}=await sb.from('profiles').select('id').neq('id',S.uid);partnerId=(data&&data[0]&&data[0].id)||null;return partnerId}

// ===================== DESAFIO DO CASAL =====================
const split=items=>{const o={pos:[],pre:[],toy:[],game:[]};(items||[]).forEach(k=>{const c=k.split(':')[0];if(o[c])o[c].push(k)});return o};
async function loadChal(){if(!S.uid)return;const c=S.ch;
  const {data:ch}=await sb.from('challenges').select('id,days').eq('active',true).order('created_at',{ascending:false}).limit(1);
  if(!ch||!ch.length){if(c.stage!=='setup'&&c.edit==null){c.stage='setup';c.d=[]}c.chId=null;if(S.screen==='chal')render();return}
  const chal=ch[0];const {data:days}=await sb.from('challenge_days').select('id,day_no,picker,items,sent,done').eq('challenge_id',chal.id).order('day_no');
  const ids=(days||[]).map(d=>d.id);const {data:cms}=ids.length?await sb.from('challenge_comments').select('day_id,user_id,body').in('day_id',ids):{data:[]};
  if(c.edit!=null)return;
  c.chId=chal.id;c.n=chal.days;c.stage='run';
  c.d=(days||[]).map(d=>{const cm={me:'',them:''};(cms||[]).filter(x=>x.day_id===d.id).forEach(x=>{cm[x.user_id===S.uid?'me':'them']=x.body});
    return Object.assign({id:d.id,who:d.picker===S.uid?'me':'them',sent:d.sent,done:d.done,cm},split(d.items))});
  c.who=c.d.map(d=>d.who);if(S.screen==='chal'){const y=window.scrollY;render();window.scrollTo(0,y)}}
let edIdx=null,wasConfirm=false;
document.addEventListener('click',e=>{const b=e.target.closest('[data-hx]');if(!b)return;edIdx=S.ch.edit;wasConfirm=S.ch.confirm;
  if(b.dataset.hx==='start'&&S.uid&&!S.partner){e.stopImmediatePropagation();toast(lang==='pt'?'Seu par precisa entrar no app antes de vocês começarem o desafio.':'Tu pareja tiene que entrar en la app antes de empezar el reto.')}},true);
document.addEventListener('click',async e=>{const b=e.target.closest('[data-hx]');if(!b||!S.uid)return;const [a,p]=b.dataset.hx.split(':'),c=S.ch;
  try{
  if(a==='start'&&c.stage==='run'&&!c.chId){const pid=await getPartner();
    const {data:ch,error}=await sb.from('challenges').insert({days:c.d.length}).select('id').single();if(error)throw error;c.chId=ch.id;
    const rows=c.d.map((d,i)=>({challenge_id:ch.id,day_no:i+1,picker:d.who==='me'?S.uid:(pid||S.uid)}));
    const {data:ds,error:e2}=await sb.from('challenge_days').insert(rows).select('id,day_no');if(e2)throw e2;(ds||[]).forEach(r=>{c.d[r.day_no-1].id=r.id})}
  else if(a==='edsave'&&edIdx!=null&&c.edit==null){const d=c.d[edIdx];if(d&&d.id&&d.sent)await sb.from('challenge_days').update({items:[...d.pos,...d.pre,...d.toy,...d.game],sent:true}).eq('id',d.id)}
  else if(a==='done'){const d=c.d[+p];if(d&&d.id)await sb.from('challenge_days').update({done:d.done}).eq('id',d.id)}
  else if(a==='cm'){const d=c.d[+p];if(d&&d.id&&d.cm.me)await sb.from('challenge_comments').insert({day_id:d.id,body:d.cm.me})}
  else if(a==='restart'&&wasConfirm&&c.chId){await sb.from('challenges').update({active:false}).eq('id',c.chId);c.chId=null}
  else if(a==='go'&&p==='chal')loadChal();
  // Pro meu amor
  else if(a==='lsend'){const m=S.lv.msgs[S.lv.msgs.length-1];if(m&&m.from==='me'&&!m.id){const {data,error}=await sb.from('love_messages').insert({body:m.text}).select('id').single();if(error)throw error;m.id=data.id}}
  else if(a==='lrep'){const m=S.lv.msgs[+p];if(m&&m.id&&m.reply)await sb.from('love_messages').update({reply:m.reply}).eq('id',m.id)}
  else if(a==='go'&&p==='love')loadLove();
  else if(a==='ltab')loadLove();
  }catch(err){toast(X().err)}});
setInterval(()=>{if(S.uid&&S.screen==='chal'&&S.ch.edit==null&&!document.activeElement.matches('input,textarea'))loadChal();if(S.uid&&S.screen==='love'&&!document.activeElement.matches('input,textarea'))loadLove()},8000);

// ===================== PRO MEU AMOR =====================
async function loadLove(){if(!S.uid)return;const {data}=await sb.from('love_messages').select('id,from_user,body,reply,created_at').order('created_at');
  S.lv.msgs=(data||[]).map(r=>({id:r.id,from:r.from_user===S.uid?'me':'them',text:r.body,reply:r.reply||''}));if(S.screen==='love'){const y=window.scrollY;render();window.scrollTo(0,y)}}

// ===================== BDSM: NOSSOS LIMITES =====================
async function checkCouple(){const b=S.bd;const {data}=await sb.rpc('couple_limits');
  if(data&&data.length){b.their=Object.fromEntries(BDP.map(x=>[x.id,'n']));data.forEach(r=>{b.their[r.item]=r.both_yes?'y':'m'});b.theirPain=data[0].partner_pain;b.stage='done'}
  else if(b.stage!=='pick')b.stage='wait';if(S.screen==='bdsm'&&b.tab==='limits')render()}
async function loadLimits(){if(!S.uid)return;const b=S.bd;const {data}=await sb.from('bdsm_limits').select('pain,safe_word,safe_sign,answers').eq('user_id',S.uid).maybeSingle();
  if(data){b.pain=data.pain;b.word=data.safe_word||'';b.sign=data.safe_sign||'';b.ans=data.answers||{};if(b.stage==='pick')b.stage='wait';await checkCouple()}}
document.addEventListener('click',async e=>{const el=e.target.closest('[data-bd]');if(!el||!S.uid)return;const [a]=el.dataset.bd.split(':'),b=S.bd;
  if(a==='tab')loadLimits();
  if(a==='send'&&b.stage==='wait'){const {error}=await sb.from('bdsm_limits').upsert({user_id:S.uid,pain:b.pain,safe_word:b.word||null,safe_sign:b.sign||null,answers:b.ans,submitted_at:new Date().toISOString()});
    if(error){toast(X().err);return}await checkCouple()}
  if(a==='redo')b.stage='pick'});
setInterval(()=>{if(S.uid&&S.screen==='bdsm'&&S.bd.tab==='limits'&&S.bd.stage==='wait')checkCouple()},8000);

// ===================== CONSULTORIA DISCRETA =====================
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="cgsend"]');if(!b||!S.uid)return;e.stopImmediatePropagation();
  const c=S.cg;if(!c.sel.size||!c.ct.trim()){toast(CT().cgErr);return}b.disabled=true;
  const {error}=await sb.from('concierge_requests').insert({toys:[...c.sel],contact_type:c.contact,contact:c.ct.trim(),message:(c.msg||'').trim()||null});b.disabled=false;
  if(error){toast(X().err);return}c.done=true;render();toast(X().saved)},true);

// ===================== MINHA CONTA =====================
S.acc={menu:false,changing:false,email:'',g:'m',confirm:false};
R.account=function(){const x=X(),L=t(),a=S.acc,owner=!S.isPartner;
  const par=S.partner?`<span class="tagc gold">${x.parIn}</span>`:`<span class="tagc">${x.parWait}</span>`;
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${x.acc}</h2>
   <div class="regbox"><div class="regh">${ic('acc',20)}<div><strong>${esc(S.name||'')}</strong><span>${esc(S.email||'')}</span></div></div></div>
   <div class="regbox love"><div class="regh">${ic('love',20)}<div><strong>${x.par} ${par}</strong><span>${esc(S.pname||S.pemail||'')}${S.pname&&S.pemail?' · '+esc(S.pemail):''}</span></div>
     ${owner?`<button type="button" class="btn link" style="width:auto;margin-left:auto;font-size:22px;line-height:1" data-ac="menu" aria-label="${x.menu}">⋯</button>`:''}</div>
     ${a.menu&&owner?`<div class="btns"><button type="button" class="btn ghost sm" data-ac="copy">${x.copyInv}</button><button type="button" class="btn ghost sm" data-ac="change">${x.change}</button></div>`:''}
     ${a.changing?`<div class="field"><label for="acem">${x.changeT}</label><input id="acem" type="email" value="${esc(a.email)}"></div>
       <div class="field"><label>${x.changeG}</label><div class="opts"><button type="button" class="opt" data-acg="f" aria-pressed="${a.g==='f'}">${x.w}</button><button type="button" class="opt" data-acg="m" aria-pressed="${a.g==='m'}">${x.m}</button></div></div>
       <div class="tip her"><b>!</b>${x.changeWarn}</div><button type="button" class="btn pri" data-ac="dochange">${a.confirm?(lang==='pt'?'Toque de novo pra confirmar':'Toca otra vez para confirmar'):x.changeBtn}</button>`:''}</div>
   <div class="regbox"><div class="regh">${ic('lock',20)}<div><strong>${x.plan}</strong><span>${x.planTest}</span></div></div></div>
   <button type="button" class="btn ghost" data-ac="logout">${x.logout}</button></section>`};
document.addEventListener('click',async e=>{const g=e.target.closest('[data-acg]');if(g){S.acc.g=g.dataset.acg;render();return}
  const b=e.target.closest('[data-ac]');if(!b)return;const a=S.acc,x=X();
  switch(b.dataset.ac){
   case 'menu':a.menu=!a.menu;a.changing=false;render();break;
   case 'copy':copyText('https://'+inviteLink(),t().copied);break;
   case 'change':a.changing=true;a.menu=false;a.confirm=false;render();break;
   case 'dochange':{const em=(a.email||'').trim().toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast(t().err_fill);break}
     if(!a.confirm){a.confirm=true;render();break}
     const {data,error}=await sb.rpc('change_partner',{p_email:em,p_gender:a.g});
     if(error){toast(/Could not find|function/i.test(error.message)?x.needDb:/só quem pagou/.test(error.message)?x.onlyOwner:x.err);a.confirm=false;render();break}
     S.code=data;S.pemail=em;S.pgender=a.g;S.partner=false;S.pname='';partnerId=null;a.changing=false;a.confirm=false;render();toast(x.changed);break}
   case 'logout':if(window.realLogout)realLogout();break;
  }},true);
document.addEventListener('input',e=>{if(e.target.id==='acem')S.acc.email=e.target.value});
// o card "Minha conta" da página inicial abre a tela
document.addEventListener('click',e=>{const tl=e.target.closest('[data-tile="acc"]');if(!tl)return;e.stopImmediatePropagation();if(!S.uid){go('welcome',{reset:true});return}S.acc.menu=false;S.acc.changing=false;go('account')},true);

// ===================== SININHO =====================
S.bellList=null;
R.inbox=function(){const x=X(),list=S.bellList||[];
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${x.bellT}</h2>
   ${list.length?list.map(n=>`<div class="lvcard them"><small>${new Date(n.shown_at).toLocaleDateString(lang==='pt'?'pt-BR':'es-ES',{day:'2-digit',month:'short'})}</small><p><strong>${esc(n.title)}</strong></p><p style="font-size:15px">${esc(n.body)}</p></div>`).join(''):`<p class="empty">${x.bellNone}</p>`}</section>`};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="bell"]');if(!b||!S.uid)return;e.stopImmediatePropagation();
  const {data,error}=await sb.rpc('my_announcements');S.bellList=error?[]:(data||[]);try{localStorage.setItem('en_bell_seen',String(Date.now()))}catch(_){}go('inbox')},true);

// avisos novos: bolinha no sininho só quando tem novidade + aviso na página inicial
let bellNew=null;
const seenAt=()=>{try{return +localStorage.getItem('en_bell_seen')||0}catch(_){return 0}};
async function checkBell(){const {data}=await sb.rpc('my_announcements');const l=data||[];S.bellList=l;
  bellNew=l.find(n=>new Date(n.shown_at).getTime()>seenAt())||null;if(S.screen==='home')decorateHome()}
function decorateHome(){if(bellNew&&new Date(bellNew.shown_at).getTime()<=seenAt())bellNew=null;
  const old=document.querySelector('#view .annc');if(old&&!bellNew)old.remove();const bell=document.querySelector('.bell');if(bell)bell.classList.toggle('new',!!bellNew);
  const v=document.getElementById('view');if(!v||!bellNew||v.querySelector('.annc'))return;const sec=v.querySelector('section');if(!sec)return;
  const d=document.createElement('button');d.type='button';d.className='annc';d.dataset.act='bell';
  d.innerHTML=`<span>${ic('bell',18)}</span><span><strong>${esc(bellNew.title)}</strong><small>${esc(bellNew.body)}</small></span>`;
  const top=sec.querySelector('.bell');const anchor=top?top.closest('div'):null;
  if(anchor&&anchor.parentNode===sec)anchor.after(d);else sec.prepend(d)}
const _rb=window.render;window.render=function(){_rb();if(S.screen==='home'&&S.uid)decorateHome()};
document.addEventListener('click',e=>{if(e.target.closest('[data-act="bell"]'))bellNew=null},true);
setInterval(()=>{if(S.uid&&!S.isFree&&S.screen==='home')checkBell()},60000);

// carregar ao entrar nas telas
const _go=window.go;window.go=function(s,o){const r=_go(s,o);if(S.uid){if(s==='home'&&!S.isFree)checkBell();if(s==='chal')loadChal();if(s==='love')loadLove();if(s==='bdsm')loadLimits()}return r};
})();
