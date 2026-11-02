// Entrada: cadastro do casal numa tela só, cadastro do parceiro pelo link, login e esqueci o PIN
S.pgender=S.pgender||'m';S.pname='';
const EN={
 pt:{
  w_lead:'Um cantinho seguro pra aprender, conversar sem vergonha e reacender a relação a dois.',
  s_title:'Vamos criar <em>a conta de vocês</em>',
  s_lead:'A assinatura é pra duas pessoas: quem está comprando e o seu amor. Preencha as duas caixinhas.',
  buyerT:'Quem está comprando', buyerD:'Seus dados de acesso.',
  loveT:'Meu amor', loveD:p=>`${p==='f'?'Ela':'Ele'} recebe no e-mail um link pra criar a senha e entrar. Não paga nada: a assinatura vale pros dois.`,
  pem:'E-mail do seu amor', pem_ph:'email@dele.com', pis:'Meu amor é',
  linkT:'Se preferir, mande também pelo WhatsApp', linkD:'O link é só pro seu amor: ele dá acesso à segunda pessoa da assinatura.',
  age:'Tenho 18 anos ou mais e aceito os <a href="#" data-en="terms">termos de uso</a> e a <a href="#" data-en="terms">política de privacidade</a>.',
  ageErr:'Pra continuar, confirme que tem 18 anos ou mais e aceita os termos.',
  sens:'Autorizo o Entre Nós a guardar minhas preferências, listas e limites sobre a vida a dois pra que o app funcione. Posso retirar essa autorização quando quiser.', sensErr:'Pra usar o app, marque a autorização pra guardar suas preferências.',
  create:'Criar conta e enviar convite por e-mail', sentTo:e=>`Convite enviado pro e-mail ${e} ✉️`,
  err:'Preencha apelido, e-mail, senha e “Eu sou”, e o e-mail e o “Meu amor é” do seu amor.',
  termsSoon:'Aqui abre o texto dos termos e da política de privacidade.',
  tour:[['','Pergunte sem vergonha','Mande sua dúvida anônima pras mulheres ou pros homens. Ninguém sabe que foi você.'],
   ['','Aprenda junto','Posições em 3D, preliminares, brinquedos e muito mais, com explicação clara e sem julgamento.'],
   ['','Do casal','Lista de desejos secreta, sala de jogos, desafio do casal e mensagens de carinho. Tudo pensado pros dois.'],
   ['','Discreto','Nome neutro no celular e PIN pra abrir. Com segurança, só de vocês.'],
   ['','Comece por aqui','Na página inicial, o card “O que tem em cada card” explica tudo do app.']],
  pa_lead:g=>`Um espaço discreto, só de vocês dois. Você não paga nada: entra pela assinatura ${g==='m'?'dele':'dela'}.`,
  ps_title:'Crie <em>seu acesso</em>', ps_lead:'Seu e-mail já veio no convite. Só falta criar sua senha.', ps_email:'Seu e-mail', ps_name:g=>`Como quer ser ${g==='f'?'chamada':'chamado'}?`, ps_btn:'Criar meu acesso', ps_err:'Preencha seu apelido e uma senha de pelo menos 6 caracteres.',
  connected:'Contas ligadas 💞 Agora vocês dividem a área do casal.',
  l_title:g=>g==='m'?'Bem-vindo de volta':'Bem-vinda de volta',
  lg_title:'Entrar na <em>sua conta</em>', lg_lead:'Use o e-mail e a senha do cadastro. Depois você cria o PIN deste celular.', lg_btn:'Entrar', lg_err:'Preencha e-mail e senha.', lg_forgotPw:'Esqueci a senha', lg_pwSent:'Mandamos um link pro seu e-mail pra criar uma senha nova.',
  fp_title:'Esqueceu o <em>PIN</em>?', fp_lead:'Digite a senha da sua conta pra criar um PIN novo.', fp_btn:'Criar PIN novo', fp_err:'Digite sua senha.',
  i_lead:p=>`${p==='f'?'Ela':'Ele'} entra de graça com a sua assinatura e vocês passam a dividir a área do casal.`, i_sent:(e,p)=>`Também mandamos o convite pro e-mail ${p==='f'?'dela':'dele'}: ${e}`, i_mail:'Reenviar convite por e-mail', mailSent:'Convite reenviado ✉️'
 },
 es:{
  w_lead:'Un rincón seguro para aprender, hablar sin vergüenza y reavivar la relación en pareja.',
  s_title:'Vamos a crear <em>vuestra cuenta</em>',
  s_lead:'La suscripción es para dos personas: quien compra y tu amor. Rellena los dos recuadros.',
  buyerT:'Quien compra', buyerD:'Tus datos de acceso.',
  loveT:'Mi amor', loveD:p=>`${p==='f'?'Ella':'Él'} recibe en su correo un enlace para crear su contraseña y entrar. No paga nada: la suscripción vale para los dos.`,
  pem:'Correo de tu amor', pem_ph:'correo@suyo.com', pis:'Mi amor es',
  linkT:'Si prefieres, envíalo también por WhatsApp', linkD:'El enlace es solo para tu amor: da acceso a la segunda persona de la suscripción.',
  age:'Tengo 18 años o más y acepto los <a href="#" data-en="terms">términos de uso</a> y la <a href="#" data-en="terms">política de privacidad</a>.',
  ageErr:'Para continuar, confirma que tienes 18 años o más y aceptas los términos.',
  sens:'Autorizo a Entre Nosotros a guardar mis preferencias, listas y límites sobre la vida en pareja para que la app funcione. Puedo retirar esta autorización cuando quiera.', sensErr:'Para usar la app, marca la autorización para guardar tus preferencias.',
  create:'Crear cuenta y enviar invitación por correo', sentTo:e=>`Invitación enviada al correo ${e} ✉️`,
  err:'Rellena apodo, correo, contraseña y “Soy”, y el correo y el “Mi amor es” de tu amor.',
  termsSoon:'Aquí se abre el texto de los términos y de la política de privacidad.',
  tour:[['','Pregunta sin vergüenza','Envía tu duda anónima a las mujeres o a los hombres. Nadie sabe que fuiste tú.'],
   ['','Aprended juntos','Posturas en 3D, preliminares, juguetes y mucho más, con explicaciones claras y sin juicios.'],
   ['','En pareja','Lista de deseos secreta, sala de juegos, reto de pareja y mensajes de cariño. Todo pensado para los dos.'],
   ['','Discreta','Nombre neutro en el móvil y PIN para abrir. Con seguridad, solo vuestra.'],
   ['','Empieza por aquí','En la página de inicio, la tarjeta “Qué hay en cada tarjeta” explica toda la app.']],
  pa_lead:g=>`Un espacio discreto, solo de vosotros dos. No pagas nada: entras con la suscripción ${g==='m'?'de él':'de ella'}.`,
  ps_title:'Crea <em>tu acceso</em>', ps_lead:'Tu correo ya vino en la invitación. Solo falta crear tu contraseña.', ps_email:'Tu correo', ps_name:g=>`¿Cómo quieres que te llamemos?`, ps_btn:'Crear mi acceso', ps_err:'Rellena tu apodo y una contraseña de al menos 6 caracteres.',
  connected:'Cuentas conectadas 💞 Ahora compartís el área de pareja.',
  l_title:g=>g==='m'?'Bienvenido de nuevo':'Bienvenida de nuevo',
  lg_title:'Entrar en <em>tu cuenta</em>', lg_lead:'Usa el correo y la contraseña del registro. Después creas el PIN de este móvil.', lg_btn:'Entrar', lg_err:'Rellena correo y contraseña.', lg_forgotPw:'Olvidé la contraseña', lg_pwSent:'Te enviamos un enlace al correo para crear una contraseña nueva.',
  fp_title:'¿Olvidaste el <em>PIN</em>?', fp_lead:'Escribe la contraseña de tu cuenta para crear un PIN nuevo.', fp_btn:'Crear PIN nuevo', fp_err:'Escribe tu contraseña.',
  i_lead:p=>`${p==='f'?'Ella':'Él'} entra gratis con tu suscripción y pasáis a compartir el área de pareja.`, i_sent:(e,p)=>`También enviamos la invitación a su correo: ${e}`, i_mail:'Reenviar invitación por correo', mailSent:'Invitación reenviada ✉️'
 }};
const ENT=()=>EN[lang];
['pt','es'].forEach(l=>{T[l].w_lead=EN[l].w_lead;T[l].tour=EN[l].tour});
TOUR_IC.splice(0,TOUR_IC.length,'ask','compass','both','lock','guide');
S.age=false;S.page=false;

const gOpt=(attr,val,cur,L)=>`<div class="opts" role="group"><button type="button" class="opt" ${attr}="f" aria-pressed="${cur==='f'}"><span class="ic">${ic('fem',24)}</span>${L.woman}</button><button type="button" class="opt" ${attr}="m" aria-pressed="${cur==='m'}"><span class="ic">${ic('male',24)}</span>${L.man}</button></div>`;
R.signup=function(){const L=t(),E=ENT(),link=inviteLink();
  return `<section class="screen">${steps(1)}<div class="eyebrow">${L.s_eyebrow}</div><h2>${E.s_title}</h2><p>${E.s_lead}</p>
  <form id="f2" novalidate class="btns" style="gap:16px">
   <div class="regbox"><div class="regh">${ic('acc',20)}<div><strong>${E.buyerT}</strong><span>${E.buyerD}</span></div></div>
    <div class="field"><label for="nm">${L.name}</label><input id="nm" autocomplete="nickname" placeholder="${L.name_ph}" value="${esc(S.name)}"></div>
    <div class="field"><label for="em">${L.email}</label><input id="em" type="email" autocomplete="email" placeholder="${L.email_ph}" value="${esc(S.email)}"></div>
    <div class="field"><label for="pw">${L.pass}</label><input id="pw" type="password" autocomplete="new-password" placeholder="${L.pass_ph}"></div>
    <div class="field"><label>${L.iam}</label>${gOpt('data-g','',S.gender,L)}<span class="hint">${L.iam_hint}</span></div></div>
   <div class="regbox love"><div class="regh">${ic('love',20)}<div><strong>${E.loveT}</strong><span>${E.loveD(S.pgender)}</span></div></div>
    <div class="field"><label for="pem">${E.pem}</label><input id="pem" type="email" autocomplete="off" placeholder="${E.pem_ph}" value="${esc(S.pemail||'')}"></div>
    <div class="field"><label>${E.pis}</label>${gOpt('data-pg','',S.pgender,L)}</div>
    <div class="field"><label>${E.linkT}</label><span class="hint">${E.linkD}</span>
     <div class="linkbox"><code>${link}</code><button type="button" class="copy" data-act="copylink">${L.copy}</button></div>
     <button type="button" class="btn ghost sm" data-act="copymsg">${L.i_wa}</button></div></div>
   <label class="agechk"><input type="checkbox" id="age" ${S.age?'checked':''}><span>${E.age}</span></label>
   <label class="agechk"><input type="checkbox" id="sens" ${S.sens?'checked':''}><span>${E.sens}</span></label>
   <button class="btn pri" type="submit">${ic('mail',18)} ${E.create}</button>
  </form></section>`};
R.partner=function(){const L=t(),E=ENT();return `<section class="screen">
  <div class="eyebrow">${L.pa_eyebrow}</div><h1 style="font-size:40px">${L.pa_title(esc(S.name||'Taynara'))}</h1>
  <p class="lead">${E.pa_lead(S.gender)}</p>
  <div class="couple"><span class="av a">${esc((S.name||'T')[0].toUpperCase())}</span><span class="av b">?</span>
  <div><strong>${esc(S.name||'Taynara')} + ?</strong><small>${L.tiles.wish[1]} · ${L.tiles.games[1]}</small></div></div>
  <div class="spacer"></div>
  <div class="btns"><button type="button" class="btn pri" data-en="psignup">${L.pa_btn}</button>
  <button type="button" class="btn link" data-act="welcome">${L.pa_no}</button></div></section>`};
R.psignup=function(){const L=t(),E=ENT();return `<section class="screen">${steps(1)}<div class="eyebrow">${L.s_eyebrow}</div><h2>${E.ps_title}</h2><p>${E.ps_lead}</p>
  <form id="f3" novalidate class="btns" style="gap:14px">
   <div class="field"><label>${E.ps_email}</label><input value="${esc(S.pemail||'marlon@email.com')}" readonly></div>
   <div class="field"><label for="pnm">${E.ps_name(S.pgender)}</label><input id="pnm" placeholder="${L.name_ph}" value="${esc(S.pname)}"></div>
   <div class="field"><label for="ppw">${L.pass}</label><input id="ppw" type="password" autocomplete="new-password" placeholder="${L.pass_ph}"></div>
   <label class="agechk"><input type="checkbox" id="page" ${S.page?'checked':''}><span>${E.age}</span></label>
   <label class="agechk"><input type="checkbox" id="psens" ${S.psens?'checked':''}><span>${E.sens}</span></label>
   <button class="btn pri" type="submit">${E.ps_btn}</button></form></section>`};
R.lock=function(){const L=t(),E=ENT();return `<section class="screen center">
  <div class="spacer"></div><div class="bigic">${ic('lock',40)}</div><h2>${E.l_title(S.isPartner?S.pgender:S.gender)}</h2><p>${L.l_lead}</p>${pinPad()}
  <button type="button" class="btn link" data-en="forgotpin">${L.l_forgot}</button><div class="spacer"></div></section>`};
R.login=function(){const E=ENT(),L=t();return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${E.lg_title}</h2><p>${E.lg_lead}</p>
  <form id="f4" novalidate class="btns" style="gap:14px"><div class="field"><label for="lem">${L.email}</label><input id="lem" type="email" autocomplete="email" placeholder="${L.email_ph}"></div>
  <div class="field"><label for="lpw">${L.pass}</label><input id="lpw" type="password" autocomplete="current-password"></div>
  <button class="btn pri" type="submit">${E.lg_btn}</button><button type="button" class="btn link" data-en="pwsent">${E.lg_forgotPw}</button></form></section>`};
R.forgotpin=function(){const E=ENT(),L=t();return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><div class="bigic">${ic('lock',38)}</div><h2>${E.fp_title}</h2><p>${E.fp_lead}</p>
  <form id="f5" novalidate class="btns" style="gap:14px"><div class="field"><label for="fpw">${L.pass}</label><input id="fpw" type="password" autocomplete="current-password"></div>
  <button class="btn pri" type="submit">${E.fp_btn}</button><button type="button" class="btn link" data-en="pwsent">${E.lg_forgotPw}</button></form></section>`};
const _inviteR=R.invite;R.invite=function(){const E=ENT();let h=_inviteR();
  h=h.replace(t().i_lead,E.i_lead(S.pgender));if(S.pemail)h=h.replace(/<div class="note">[\s\S]*?<\/div>/,`<div class="note">${ic('mail',16)} ${E.i_sent(esc(S.pemail),S.pgender)}</div><button type="button" class="btn ghost" data-en="mail">${ic('mail',16)} ${E.i_mail}</button>`);return h};

document.addEventListener('click',e=>{const pg=e.target.closest('[data-pg]');if(pg){S.pgender=pg.dataset.pg;document.querySelectorAll('[data-pg]').forEach(b=>b.setAttribute('aria-pressed',b===pg));const d=document.querySelector('.regbox.love .regh span');if(d)d.textContent=ENT().loveD(S.pgender);return}
  const b=e.target.closest('[data-en]');if(!b)return;e.preventDefault();const E=ENT();
  switch(b.dataset.en){
   case 'terms':toast(E.termsSoon);break;
   case 'psignup':S.isPartner=true;go('psignup');break;
   case 'forgotpin':go('forgotpin');break;
   case 'pwsent':toast(E.lg_pwSent);break;
   case 'mail':toast(E.mailSent);break;
  }},true);
document.addEventListener('change',e=>{if(e.target.id==='age')S.age=e.target.checked;if(e.target.id==='page')S.page=e.target.checked;if(e.target.id==='sens')S.sens=e.target.checked;if(e.target.id==='psens')S.psens=e.target.checked});
document.addEventListener('input',e=>{if(e.target.id==='pnm')S.pname=e.target.value;else if(e.target.id==='pem')S.pemail=e.target.value;else if(e.target.id==='nm'&&S.screen==='signup')S.name=e.target.value;else if(e.target.id==='em'&&S.screen==='signup')S.email=e.target.value});
document.addEventListener('submit',e=>{const id=e.target.id,E=ENT(),v=x=>(document.getElementById(x)||{}).value||'';
  if(id==='f2'){e.preventDefault();const nm=v('nm').trim(),em=v('em').trim(),pw=v('pw'),pe=v('pem').trim();
    if(!nm||!em||!pe||pw.length<6||!S.gender||!S.pgender){toast(E.err);return}if(!S.age){toast(E.ageErr);return}if(!S.sens){toast(E.sensErr);return}
    S.name=nm;S.email=em;S.pemail=pe;S.isPartner=false;S.partner=false;S.pinStage=1;S.skipTour=false;go('pin');toast(E.sentTo(pe))}
  else if(id==='f3'){e.preventDefault();const nm=v('pnm').trim(),pw=v('ppw');if(!nm||pw.length<6){toast(E.ps_err);return}if(!S.page){toast(E.ageErr);return}if(!S.psens){toast(E.sensErr);return}
    S.pname=nm;S.pinStage=1;S.skipTour=false;go('pin')}
  else if(id==='f4'){e.preventDefault();if(!v('lem').trim()||!v('lpw')){toast(E.lg_err);return}S.pinStage=1;S.skipTour=true;go('pin')}
  else if(id==='f5'){e.preventDefault();if(!v('fpw')){toast(E.fp_err);return}S.pinStage=1;S.skipTour=true;go('pin')}
});
function finishEntry(){if(S.isPartner){S.partner=true;if(S.pname)S.name=S.pname;go('home',{reset:true});toast(ENT().connected)}else go('home',{reset:true})}
