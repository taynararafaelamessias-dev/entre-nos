// =====================================================================
// Entre Nós · "Apagar minha conta" (GDPR / LGPD)
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
const DX={pt:{btn:'Apagar minha conta',t:'Apagar a sua conta',w:'Isso apaga para sempre o seu perfil, a sua lista de desejos, o diário, as mensagens, os desafios, os jogos e as suas perguntas na comunidade. Não tem como desfazer.',
  w2:'Se você é quem assinou, o casal acaba e o seu par fica sem acesso à área do casal. Se você é o par, você sai do casal. A assinatura na Hotmart é cancelada lá, separadamente.',
  type:'Pra confirmar, escreva APAGAR',word:'APAGAR',go:'Apagar tudo agora',cancel:'Cancelar',done:'Sua conta foi apagada.',err:'Não deu certo. Tente de novo.'},
 es:{btn:'Eliminar mi cuenta',t:'Eliminar tu cuenta',w:'Esto borra para siempre tu perfil, tu lista de deseos, el diario, los mensajes, los retos, los juegos y tus preguntas en la comunidad. No se puede deshacer.',
  w2:'Si eres quien se suscribió, la pareja termina y tu pareja se queda sin acceso al área de la pareja. Si eres la pareja, sales de la pareja. La suscripción de Hotmart se cancela allí, por separado.',
  type:'Para confirmar, escribe ELIMINAR',word:'ELIMINAR',go:'Eliminar todo ahora',cancel:'Cancelar',done:'Tu cuenta fue eliminada.',err:'No salió bien. Inténtalo de nuevo.'}};
const D=()=>DX[lang];let open=false,typed='';
const _acc=R.account;
R.account=function(){let h=_acc();if(!S.uid)return h;const d=D();
  const box=open?`<div class="dcard delbox"><strong>${d.t}</strong><p style="margin:0">${d.w}</p><p class="hint" style="margin:0">${d.w2}</p>
     <label class="hint" for="delw" style="margin:0">${d.type}</label><input id="delw" autocomplete="off" value="${esc(typed)}">
     <div class="btns"><button type="button" class="btn pri" data-del="go">${d.go}</button><button type="button" class="btn link" data-del="x">${d.cancel}</button></div></div>`
    :`<button type="button" class="btn link delbtn" data-del="open">${d.btn}</button>`;
  const i=h.lastIndexOf('</section>');return i<0?h+box:h.slice(0,i)+box+h.slice(i)};
document.addEventListener('input',e=>{if(e.target.id==='delw')typed=e.target.value});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-del]');if(!b)return;e.stopImmediatePropagation();const d=D();
  if(b.dataset.del==='open'){open=true;typed='';render();return}
  if(b.dataset.del==='x'){open=false;typed='';render();return}
  if(typed.trim().toUpperCase()!==d.word){toast(d.type);return}
  b.disabled=true;const {error}=await sb.rpc('delete_my_account');
  if(error){b.disabled=false;toast(d.err);return}
  try{Object.keys(localStorage).filter(k=>k.startsWith('en_')).forEach(k=>localStorage.removeItem(k))}catch(_){}
  try{await sb.auth.signOut()}catch(_){}
  open=false;typed='';location.href=location.pathname+'?nova=1';setTimeout(()=>toast(d.done),50)},true);
})();
