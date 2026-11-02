// =====================================================================
// Entre Nós · modo real (Supabase). Se config.js não tiver as chaves,
// o app continua como protótipo.
// =====================================================================
(function(){
const ENVC=window.ENV||{};
if(!ENVC.SUPABASE_URL||!ENVC.SUPABASE_ANON||!window.supabase){window.REAL=false;return}
window.REAL=true;
const sb=window.supabase.createClient(ENVC.SUPABASE_URL,ENVC.SUPABASE_ANON,{auth:{persistSession:true,autoRefreshToken:true}});
window.sb=sb;
document.documentElement.classList.add('real');

const RX={
 pt:{wait:'Um instante…',confirm:'Enviamos um e-mail de confirmação. Abra o link e depois entre com seu e-mail e senha.',
  errAuth:'E-mail ou senha incorretos.',errExists:'Este e-mail já tem conta. Toque em “Já tenho conta”.',errGeneric:'Algo deu errado. Tente de novo.',
  pinBad:'PIN incorreto.',invalidInvite:'Este convite não existe ou já foi usado.',wrongEmail:'Este convite foi feito para outro e-mail.',
  saved:'Salvo ✓',offline:'Sem conexão. Tente de novo.',logout:'Sair da conta'},
 es:{wait:'Un momento…',confirm:'Te enviamos un correo de confirmación. Abre el enlace y después entra con tu correo y contraseña.',
  errAuth:'Correo o contraseña incorrectos.',errExists:'Este correo ya tiene cuenta. Toca “Ya tengo cuenta”.',errGeneric:'Algo salió mal. Inténtalo de nuevo.',
  pinBad:'PIN incorrecto.',invalidInvite:'Esta invitación no existe o ya se usó.',wrongEmail:'Esta invitación es para otro correo.',
  saved:'Guardado ✓',offline:'Sin conexión. Inténtalo de nuevo.',logout:'Cerrar sesión'}};
const RT=()=>RX[lang];
const errMsg=e=>{const m=(e&&(e.message||e.error_description))||'';if(/not confirmed/i.test(m))return lang==='pt'?'Seu e-mail ainda não foi confirmado. Abra o e-mail de confirmação e toque no link.':'Tu correo todavía no está confirmado. Abre el correo de confirmación y toca el enlace.';if(/Invalid login/i.test(m))return RT().errAuth;if(/already registered|already exists/i.test(m))return RT().errExists;
  if(/outro e-mail/.test(m))return RT().wrongEmail;if(/não encontrado|já usado/.test(m))return RT().invalidInvite;return m||RT().errGeneric};

// ---------- estado vazio (tira os exemplos do protótipo) ----------
function clearDemo(){S.wl=new Set();S.diary={};S.sh=[];S.shc={};S.dpc={};S.dmc={};S.lv.msgs=[];S.partner=false}

// ---------- PIN deste aparelho ----------
async function pinHash(uid,pin){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(uid+':'+pin));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
const pinKey=uid=>'en_pin_'+uid;
function getPin(uid){try{return localStorage.getItem(pinKey(uid))}catch(e){return null}}
function setPin(uid,h){try{localStorage.setItem(pinKey(uid),h)}catch(e){}}

window.onKey=function(k){
  if(k==='del'){S.pin=S.pin.slice(0,-1);render();return}
  if(S.pin.length>=4)return;
  S.pin+=k;render();
  if(S.pin.length!==4)return;
  setTimeout(async()=>{
    const uid=S.uid;
    if(S.screen==='lock'){const h=await pinHash(uid,S.pin);if(h===getPin(uid)){S.pin='';go('home',{reset:true})}else{S.pin='';render();const d=document.getElementById('dots');if(d)d.classList.add('err');toast(RT().pinBad)}return}
    if(S.pinStage===1){S.pin1=S.pin;S.pin='';S.pinStage=2;render();return}
    if(S.pin===S.pin1){setPin(uid,await pinHash(uid,S.pin));S.pin='';S.pinStage=1;S.tour=0;
      if(S.skipTour){S.skipTour=false;go('home',{reset:true})}else go('tour');return}
    S.pin='';S.pinStage=1;render();const d=document.getElementById('dots');if(d)d.classList.add('err');toast(t().p_wrong)
  },180)};

// ---------- carregar a conta ----------
async function loadAccount(){
  const {data:{user}}=await sb.auth.getUser();if(!user)return false;
  S.uid=user.id;S.email=user.email;
  const {data:profs}=await sb.from('profiles').select('id,nickname,gender,lang,couple_id,role');
  const me=(profs||[]).find(p=>p.id===user.id);if(!me)return 'noprofile';
  const pa=(profs||[]).find(p=>p.id!==user.id);
  S.name=me.nickname;S.gender=me.gender;S.isPartner=me.role==='partner';S.isFree=!me.couple_id;
  if(me.lang&&me.lang!==lang){lang=me.lang;try{localStorage.setItem('en_lang',lang)}catch(_){}}
  clearDemo();
  if(me.couple_id){const {data:c}=await sb.from('couples').select('partner_email,partner_gender,invite_code,partner_id,sub_status').eq('id',me.couple_id).maybeSingle();
    if(c){S.pemail=c.partner_email;S.pgender=c.partner_gender;S.code=c.invite_code;S.partner=!!c.partner_id;S.sub=c.sub_status}}
  S.pname=pa?pa.nickname:'';
  await loadData();
  return true}

async function loadData(){
  const [w,d,m]=await Promise.all([sb.from('wishlist').select('item_key'),sb.from('diary').select('pos_id,rating,note'),sb.rpc('couple_matches')]);
  S.wl=new Set((w.data||[]).map(r=>r.item_key));
  S.diary={};(d.data||[]).forEach(r=>S.diary[r.pos_id]={rating:r.rating||0,note:r.note||'',shared:false});
  S.matches=new Set(m.data||[]);
  snap()}

// ---------- sincronizar depois de cada tela (lista de desejos e diário) ----------
let last={wl:new Set(),diary:'{}'};
function snap(){last={wl:new Set(S.wl),diary:JSON.stringify(S.diary)}}
let syncT=null;
async function sync(){
  if(!S.uid||!(S.wl instanceof Set))return;
  const add=[...S.wl].filter(k=>!last.wl.has(k)),del=[...last.wl].filter(k=>!S.wl.has(k));
  const dNow=S.diary,dOld=JSON.parse(last.diary);
  const up=Object.keys(dNow).filter(id=>JSON.stringify(dNow[id])!==JSON.stringify(dOld[id])),rm=Object.keys(dOld).filter(id=>!dNow[id]);
  if(!add.length&&!del.length&&!up.length&&!rm.length)return;
  snap();
  try{
    if(add.length)await sb.from('wishlist').upsert(add.filter(k=>/^(pos|pre|toy|bdsm|w):[a-z0-9_-]+$/.test(k)).map(k=>({item_key:k})));
    if(del.length)await sb.from('wishlist').delete().in('item_key',del);
    if(up.length)await sb.from('diary').upsert(up.map(id=>({pos_id:id,rating:dNow[id].rating||null,note:dNow[id].note||null})));
    if(rm.length)await sb.from('diary').delete().in('pos_id',rm);
  }catch(e){toast(RT().offline)}}
const _render=window.render;
window.render=function(){_render();clearTimeout(syncT);syncT=setTimeout(sync,600)};

// ---------- link de convite ----------
window.inviteLinkReal=()=>location.host+'/?convite='+(S.code||'');

// ---------- cadastro, convite, login, esqueci o PIN ----------
document.addEventListener('submit',async e=>{const id=e.target.id;if(!['f2','f3','f4','f5'].includes(id))return;
  e.preventDefault();e.stopImmediatePropagation();
  const E=ENT(),v=x=>(document.getElementById(x)||{}).value||'';const btn=e.target.querySelector('button[type=submit]');if(btn)btn.disabled=true;
  try{
   if(id==='f2'){const nm=v('nm').trim(),em=v('em').trim().toLowerCase(),pw=v('pw'),pe=v('pem').trim().toLowerCase();
     if(!nm||!em||!pe||pw.length<6||!S.gender||!S.pgender){toast(E.err);return}if(!S.age){toast(E.ageErr);return}if(!S.sens){toast(E.sensErr);return}
     const reg={kind:'owner',nm,g:S.gender,pe,pg:S.pgender,lang};
     try{localStorage.setItem('en_pending',JSON.stringify(reg))}catch(_){}
     const {data,error}=await sb.auth.signUp({email:em,password:pw});if(error)throw error;
     if(!data.session){showCheckMail(em||S.pemail,'login');return}
     await finishPending();S.pinStage=1;S.skipTour=false;go('pin');toast(E.sentTo(pe))}
   else if(id==='f3'){const nm=v('pnm').trim(),pw=v('ppw');if(!nm||pw.length<6){toast(E.ps_err);return}if(!S.page){toast(E.ageErr);return}if(!S.psens){toast(E.sensErr);return}
     const reg={kind:'partner',code:S.inviteCode,nm,lang};try{localStorage.setItem('en_pending',JSON.stringify(reg))}catch(_){}
     const {data,error}=await sb.auth.signUp({email:S.pemail,password:pw});if(error)throw error;
     if(!data.session){showCheckMail(S.pemail,'login');return}
     await finishPending();S.pinStage=1;S.skipTour=false;go('pin')}
   else if(id==='f4'){const em=v('lem').trim().toLowerCase(),pw=v('lpw');if(!em||!pw){toast(E.lg_err);return}
     const {error}=await sb.auth.signInWithPassword({email:em,password:pw});if(error)throw error;
     await finishPending();const ok=await loadAccount();if(ok==='noprofile'){go('mgame',{reset:true});return}if(S.isFree){go('mgame',{reset:true});return}
     S.pinStage=1;S.skipTour=true;go('pin')}
   else if(id==='f5'){const pw=v('fpw');if(!pw){toast(E.fp_err);return}
     const {error}=await sb.auth.signInWithPassword({email:S.email,password:pw});if(error)throw error;
     S.pinStage=1;S.skipTour=true;go('pin')}
  }catch(err){toast(errMsg(err))}finally{if(btn)btn.disabled=false}
},true);

// termina o cadastro guardado (também serve quando a confirmação por e-mail está ligada)
async function finishPending(){let reg=null;try{reg=JSON.parse(localStorage.getItem('en_pending')||'null')}catch(_){}
  if(!reg)return;
  if(reg.kind==='owner'){const {data,error}=await sb.rpc('register_owner',{p_nickname:reg.nm,p_gender:reg.g,p_lang:reg.lang,p_partner_email:reg.pe,p_partner_gender:reg.pg,p_adult:true,p_sensitive:true});
    if(error&&!/já existe/.test(error.message))throw error;if(data&&data[0])S.code=data[0].invite_code}
  else if(reg.kind==='partner'){const {error}=await sb.rpc('accept_invite',{p_code:reg.code,p_nickname:reg.nm,p_lang:reg.lang,p_adult:true,p_sensitive:true});if(error)throw error}
  try{localStorage.removeItem('en_pending')}catch(_){}
  await loadAccount()}

// "Aceitar e criar meu login" já usa o e-mail do convite
// sair da conta
window.realLogout=async()=>{await sb.auth.signOut();clearDemo();S.uid=null;go('welcome',{reset:true})};


// ---------- tela "confirme seu e-mail" (fica parada na tela, não some) ----------
const CM={pt:{t:'Confirme seu <em>e-mail</em>',l:e=>`Mandamos um e-mail pra <strong>${e}</strong> com um link de confirmação. Abra o e-mail, toque no link e depois volte aqui.`,
  tip:'Não chegou? Olhe a caixa de spam ou promoções. Pode levar alguns minutos.',done:'Já confirmei, entrar',resend:'Reenviar e-mail',sent:'E-mail reenviado ✉️'},
 es:{t:'Confirma tu <em>correo</em>',l:e=>`Te enviamos un correo a <strong>${e}</strong> con un enlace de confirmación. Ábrelo, toca el enlace y después vuelve aquí.`,
  tip:'¿No llegó? Mira en spam o promociones. Puede tardar unos minutos.',done:'Ya confirmé, entrar',resend:'Reenviar correo',sent:'Correo reenviado ✉️'}};
window.showCheckMail=function(email,next){S.cmEmail=email;S.cmNext=next;go('checkmail')};
R.checkmail=function(){const C=CM[lang];return `<section class="screen center"><div class="spacer"></div><div class="bigic">${ic('mail',40)}</div><h2>${C.t}</h2><p>${C.l(esc(S.cmEmail||''))}</p><p class="hint">${C.tip}</p>
  <div class="btns" style="align-self:stretch"><button type="button" class="btn pri" data-cm="done">${C.done}</button><button type="button" class="btn ghost" data-cm="resend">${C.resend}</button></div><div class="spacer"></div></section>`};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-cm]');if(!b)return;
  if(b.dataset.cm==='resend'){const {error}=await sb.auth.resend({type:'signup',email:S.cmEmail});toast(error?RT().errGeneric:CM[lang].sent);return}
  if(S.cmNext==='mgame'){S.mf.mode='old';go('mgame',{reset:true})}else go('login',{reset:true})});

// ---------- início ----------
async function boot(){
  const q=new URLSearchParams(location.search);const code=q.get('convite');
  if(q.get('jogo')){const {data:{session}}=await sb.auth.getSession();if(session)await loadAccount().catch(()=>{});return}
  if(code){const {data}=await sb.rpc('invite_info',{p_code:code});const r=data&&data[0];
    if(r&&!r.already_used){S.inviteCode=code;S.name=r.inviter_nickname;S.gender=r.inviter_gender;S.pemail=r.partner_email;S.pgender=r.partner_gender;
      history.replaceState(null,'',location.pathname);go('partner',{reset:true});return}
    toast(RT().invalidInvite)}
  let {data:{session}}=await sb.auth.getSession();
  if(session){const {data:u,error:ue}=await sb.auth.getUser();if(ue||!u||!u.user){await sb.auth.signOut().catch(()=>{});session=null}}
  if(session){await finishPending().catch(()=>{});const ok=await loadAccount();
    if(ok===true&&S.isFree){go('mgame',{reset:true});return}
    if(ok===true){if(getPin(S.uid)){S.pin='';go('lock',{reset:true})}else{S.pinStage=1;S.skipTour=true;go('pin',{reset:true})}return}}
  clearDemo();go('welcome',{reset:true})}
boot().catch(()=>{clearDemo();go('welcome',{reset:true})});
})();
