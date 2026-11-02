// =====================================================================
// Entre Nós · Novidades do par na tela inicial + Conversar de verdade
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
const NX={
 pt:{title:'Novidades',all:n=>`Ver todas (${n})`,less:'Ver menos',
  t:{love_new:n=>`${n} te deixou um recado de amor`,love_reply:n=>`${n} respondeu o seu recado de amor`,
   talk_text:n=>`${n} te mandou uma mensagem`,talk_tease:n=>`${n} te mandou uma provocação`,talk_wish:n=>`${n} revelou um desejo pra você`,
   share_pre:n=>`${n} compartilhou uma preliminar com você`,share_toys:n=>`${n} compartilhou um brinquedo com você`,share_diary:n=>`${n} compartilhou uma posição do diário`,share_wish:n=>`${n} compartilhou um desejo com você`,share_bdsm:n=>`${n} compartilhou algo do BDSM`,
   ask_pre:n=>`${n} te pediu uma preliminar`,ask_toys:n=>`${n} te pediu um brinquedo`,sur:n=>`${n} preparou uma surpresa pra você`,
   share_cmt:n=>`${n} comentou no que você compartilhou`,chal_new:n=>`${n} começou um desafio do casal`,chal_day:(n,r)=>`${n} montou o dia ${r} do desafio`,chal_cmt:(n,r)=>`${n} comentou no dia ${r} do desafio`,
   bdsm_limits:n=>`${n} preencheu os limites do BDSM. Já dá pra ver o resultado`,game_inv:n=>`${n} te chamou pra jogar`,game_tease:n=>`${n} te mandou uma provocação no jogo`},
  you:'Seu amor',edit:'Editar',edited:'editada · Editar',editT:'Editar mensagem',save:'Salvar',cancel:'Cancelar',sending:'Enviando…'},
 es:{title:'Novedades',all:n=>`Ver todas (${n})`,less:'Ver menos',
  t:{love_new:n=>`${n} te dejó un mensaje de amor`,love_reply:n=>`${n} respondió tu mensaje de amor`,
   talk_text:n=>`${n} te mandó un mensaje`,talk_tease:n=>`${n} te mandó una provocación`,talk_wish:n=>`${n} te reveló un deseo`,
   share_pre:n=>`${n} compartió un preliminar contigo`,share_toys:n=>`${n} compartió un juguete contigo`,share_diary:n=>`${n} compartió una posición del diario`,share_wish:n=>`${n} compartió un deseo contigo`,share_bdsm:n=>`${n} compartió algo de BDSM`,
   ask_pre:n=>`${n} te pidió un preliminar`,ask_toys:n=>`${n} te pidió un juguete`,sur:n=>`${n} te preparó una sorpresa`,
   share_cmt:n=>`${n} comentó lo que compartiste`,chal_new:n=>`${n} empezó un reto de pareja`,chal_day:(n,r)=>`${n} armó el día ${r} del reto`,chal_cmt:(n,r)=>`${n} comentó el día ${r} del reto`,
   bdsm_limits:n=>`${n} completó los límites de BDSM. Ya pueden ver el resultado`,game_inv:n=>`${n} te invitó a jugar`,game_tease:n=>`${n} te mandó una provocación en el juego`},
  you:'Tu amor',edit:'Editar',edited:'editado · Editar',editT:'Editar mensaje',save:'Guardar',cancel:'Cancelar',sending:'Enviando…'}};
const N=()=>NX[lang];
const ICO={love:'love',talk:'talk',pre:'fore',toys:'toys',diary:'diary',wish:'wish',bdsm:'bdsm',chal:'heat',games:'games'};
const TILE={love:'heat',chal:'heat',talk:'talk',pre:'fore',toys:'toys',diary:'diary',wish:'wish',bdsm:'bdsm',games:'games'};
const SCREEN_AREA={pre:'pre',toys:'toys',diary:'diary',wish:'wish',love:'love',chal:'chal',talk:'talk',bdsm:'bdsm',groom:'games'};
S.news=[];S.newsAll=false;let known=null;

function label(n){const L=N().t,who=esc(S.pname||N().you);
  if(n.kind==='share_ask'&&(n.area==='pre'||n.area==='toys'))return L['ask_'+n.area](who);
  if(n.kind==='share_sur')return L.sur(who);
  if(n.kind.startsWith('share_')&&n.kind!=='share_cmt')return (L['share_'+n.area]||L.share_wish)(who);
  const f=L[n.kind];return f?f(who,esc(n.ref||'')):''}

async function fetchNews(){if(!S.uid)return;const {data,error}=await sb.rpc('my_news');if(error)return;
  const list=data||[];const ids=new Set(list.map(n=>n.kind+n.ref+n.at));
  if(known){const fresh=list.filter(n=>!known.has(n.kind+n.ref+n.at));if(fresh.length&&document.visibilityState==='visible'&&SCREEN_AREA[S.screen]!==fresh[0].area)toast(label(fresh[0])+' 💌')}
  known=ids;const changed=JSON.stringify(list)!==JSON.stringify(S.news);S.news=list;if(changed&&S.screen==='home')render()}

async function seen(area){S.news=S.news.filter(n=>n.area!==area);try{await sb.rpc('mark_seen',{p_area:area})}catch(_){}}

// ---------- tela inicial: quadro de novidades + bolinha nos cards ----------
const _home=R.home;
R.home=function(){let h=_home();if(!S.uid||!S.news.length)return h;const nv=S.news,f=N();
  const show=S.newsAll?nv:nv.slice(0,3);
  const box=`<div class="newsbox"><div class="sec-t" style="margin:0;color:var(--honey)">${f.title} · ${nv.length}</div>${show.map(n=>`<button type="button" class="newsit" data-nw="${nv.indexOf(n)}"><span class="gic">${ic(ICO[n.area]||'bell',18)}</span><span>${label(n)}</span></button>`).join('')}
    ${nv.length>3?`<button type="button" class="btn link" data-nwall="1" style="width:auto;align-self:flex-start">${S.newsAll?f.less:f.all(nv.length)}</button>`:''}</div>`;
  h=h.replace(/(<\/div>\s*<button type="button" class="bell"[\s\S]*?<\/button><\/div>)/,'$1'+box);
  const dots=new Set(nv.map(n=>TILE[n.area]));
  h=h.replace(/<button type="button" class="tile([^"]*)" data-tile="([a-z]+)">/g,(m,c,k)=>dots.has(k)?`<button type="button" class="tile${c} hasnew" data-tile="${k}"><span class="ndot"></span>`:m);
  return h};
document.addEventListener('click',async e=>{
  if(e.target.closest('[data-nwall]')){e.stopImmediatePropagation();S.newsAll=!S.newsAll;render();return}
  const b=e.target.closest('[data-nw]');if(!b)return;e.stopImmediatePropagation();const n=S.news[+b.dataset.nw];if(!n)return;
  seen(n.area);
  switch(n.area){
    case 'pre':S.prew='sh';S.pexp=null;go('pre');break;
    case 'toys':S.toyw='sh';S.texp=null;go('toys');break;
    case 'diary':S.dtab='shared';go('diary');break;
    case 'wish':go('wish');break;
    case 'love':go('love');break;
    case 'chal':go('chal');break;
    case 'talk':go('talk');break;
    case 'bdsm':if(S.bd)S.bd.tab='limits';go('bdsm');break;
    case 'games':location.href=location.pathname+'?jogo='+encodeURIComponent(n.ref);break;
  }},true);

// entrar na parte já marca como visto
const _go=window.go;window.go=function(s,o){const r=_go(s,o);const a=SCREEN_AREA[s];if(a&&S.uid&&S.news.some(n=>n.area===a))seen(a);if(s==='home'&&S.uid)fetchNews();if(s==='talk'&&S.uid)loadTalk(true);return r};
setInterval(()=>{if(S.uid&&document.visibilityState==='visible')fetchNews()},20000);
const iv=setInterval(()=>{if(S.uid){clearInterval(iv);fetchNews()}},700);setTimeout(()=>clearInterval(iv),20000);

// ===================== CONVERSAR DE VERDADE =====================
let talkSig='';
async function loadTalk(force){if(!S.uid||S.isFree)return;
  const {data,error}=await sb.from('couple_messages').select('id,from_user,kind,body,item_key,edited,created_at').order('created_at');if(error)return;
  const msgs=(data||[]).map(r=>({id:r.id,who:r.from_user===S.uid?'me':'them',kind:r.kind,text:r.body||'',key:r.item_key||undefined,edited:r.edited}));
  const sig=JSON.stringify(msgs);if(!force&&sig===talkSig)return;talkSig=sig;S.tk.msgs=msgs;
  if(S.screen==='talk'){const y=window.scrollY;render();window.scrollTo(0,y);if(S.news.some(n=>n.area==='talk'))seen('talk')}}
// o protótipo respondia sozinho: agora a mensagem vai de verdade pro par
window.talkReply=async function(){const m=[...S.tk.msgs].reverse().find(x=>x.who==='me'&&!x.id);render();if(!m)return;
  m.id='tmp';const row={kind:m.kind,body:m.text||null,item_key:m.kind==='wish'?m.key:null};
  const {error}=await sb.from('couple_messages').insert(row);if(error){toast(lang==='pt'?'Não deu pra enviar. Tente de novo.':'No se pudo enviar. Inténtalo de nuevo.');S.tk.msgs=S.tk.msgs.filter(x=>x!==m);render();return}
  loadTalk(true)};
if(S.tk&&!S.isFree)S.tk.msgs=[];
setInterval(()=>{if(S.uid&&S.screen==='talk'&&document.visibilityState==='visible'&&!document.querySelector('#tkov'))loadTalk()},4000);

// editar o que eu mandei
const _talk=R.talk;
R.talk=function(){let h=_talk();let i=0;const ms=S.tk.msgs,f=N();
  h=h.replace(/<div class="bub2 (me|them)/g,(m,who)=>{const msg=ms[i++];if(!msg||who!=='me'||!msg.id||msg.id==='tmp')return m;
    return `<div data-tke="${msg.id}" data-edl="${msg.edited?f.edited:f.edit}" class="bub2 ${who} canedit`});
  return h};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-tke]');if(!b||S.screen!=='talk')return;e.stopImmediatePropagation();
  const msg=S.tk.msgs.find(x=>x.id===b.dataset.tke);if(!msg)return;const f=N();
  const d=document.createElement('div');d.className='lockov';d.id='tkov';
  d.innerHTML=`<div class="locksh" role="dialog" aria-modal="true"><h2 style="font-size:24px">${f.editT}</h2><textarea id="tkedt" rows="3">${esc(msg.text||'')}</textarea>
    <div class="btns"><button type="button" class="btn pri" data-tked="save">${f.save}</button><button type="button" class="btn link" data-tked="x">${f.cancel}</button></div></div>`;
  document.body.appendChild(d);const ta=document.getElementById('tkedt');ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);
  d.addEventListener('click',async ev=>{const a=ev.target.closest('[data-tked]');if(ev.target===d||(a&&a.dataset.tked==='x')){d.remove();return}
    if(a&&a.dataset.tked==='save'){const tx=ta.value.trim();if(!tx&&msg.kind!=='wish')return;a.disabled=true;
      const {error}=await sb.from('couple_messages').update({body:tx||null,edited:true}).eq('id',msg.id);d.remove();if(!error)loadTalk(true)}})},true);
})();
