// =====================================================================
// Entre Nós · Esquentar a relação: pódio Ele × Ela + Sequência de fogo,
// Quem segura mais, Semana do cuidado. E o "Com amor" dentro do Conversar.
// =====================================================================
(function(){
if(!window.REAL||!window.sb)return;
const sb=window.sb;
const HQ={
 pt:{title:'Esquentar a <em>relação</em>',pod:'Pódio do casal',week:'Esta semana',total:'Desde o começo',pts:n=>`${n} ${n===1?'ponto':'pontos'}`,
  lastWin:n=>`Semana passada: ${n} venceu 🏆`,lastTie:'Semana passada: empate 🤝',podHint:'Os pontos vêm dos desafios. O pódio da semana zera toda segunda.',
  you:'Você',par:'Seu amor',chooseT:'Desafios',
  cards:{chal:['Desafio do casal','1 a 7 dias. Cada um monta o seu dia'],fire:['Sequência de fogo','Dias seguidos de sexo. Quebrou, perdeu'],hold:['Quem segura mais','Uma noite só. Quem aguenta mais chegar no limite'],care:['Semana do cuidado','7 dias de carinho, sem ser sobre sexo']},
  st:{none:'Começar',invMe:'Convite enviado',invThem:n=>`${n} te convidou`,active:'Em andamento',fireDay:(k,n)=>`Em andamento · dia ${k} de ${n}`,careDay:k=>`Em andamento · dia ${k} de 7`,holdWait:'Esperando o resultado'},
  invite:n=>`Convidar ${n}`,inviteHold:n=>`Desafiar ${n} pra hoje`,sent:n=>`Convite enviado. Assim que ${n} aceitar, começa.`,cancel:'Cancelar convite',
  invited:n=>`${n} te convidou pra este desafio`,accept:'Aceitar',decline:'Agora não',again:'Fazer de novo',needPar:'Seu par precisa ter entrado no app pra jogar os desafios.',
  fire:{lead:'Vocês escolhem quantos dias seguidos vão fazer amor. Sem preliminar pra montar, sem regra de posição: é só fazer e marcar.',
   days:'Quantos dias seguidos?',tip:'Dica: o mais comum é 3 — sexta, sábado e domingo.',rule:'Regra: se pular um dia, a sequência quebra e os dois perdem os pontos dela.',
   grace:'Cada dia pode ser marcado até o fim do dia seguinte.',did:'Fizemos ✓',done:'Feito',locked:'Ainda não chegou',rate:'Sua nota pra esse dia',note:'Uma notinha (opcional)',save:'Salvar',
   theirs:n=>`Nota de ${n}`,noRate:'ainda não deu nota',complete:n=>`Sequência completa! 🔥 +${n} pontos pra cada um.`,broken:k=>`A sequência quebrou no dia ${k}. Os dois perderam os pontos desta vez.`,today:'hoje',yesterday:'ontem (ainda dá tempo)',missed:'perdido'},
  hold:{lead:'Desafio de uma noite só. Um leva o outro até quase chegar lá… para… e recomeça. Pode ser com sexo oral, com as mãos ou como preferirem.',
   how:['Quem está recebendo avisa quando estiver quase chegando. Aí o outro para.','Cada vez que você chegou no limite sem terminar, conta 1.','Depois troquem: agora é a vez do outro.','No fim da noite, cada um coloca aqui quantas vezes aguentou. Quem aguentou mais vence.'],
   care:'Combinem antes, falem durante e qualquer um pode parar quando quiser. É brincadeira, não prova.',
   q:'Quantas vezes você chegou no limite sem terminar?',send:'Enviar meu número',you:n=>`Você: ${n}`,wait:n=>`Esperando ${n} colocar o número.`,
   win:n=>`${n} segurou mais 🏆`,tie:'Empate! Os dois seguraram igual 🤝',pts:'Vencedor +3 · quem participou +1 · empate +2 cada'},
  care:{lead:'Uma semana inteira de carinho, que não é sobre sexo. Um é o responsável da semana e faz pelo menos um carinho por dia. O outro devolve com um ❤️.',
   who:'Quem é o responsável desta semana?',me:'Eu',them:n=>n,suggest:'Na próxima semana, troquem o responsável.',
   today:'O carinho de hoje',pick:'Escolha o que você fez hoje',own:'Ou escreva o seu',mark:'Marcar o cuidado de hoje',
   doneToday:'Cuidado de hoje marcado 💗',day:k=>`Dia ${k}`,heart:'Devolver ❤️',got:'❤️ recebido',nothing:'—',resp:n=>`Responsável: ${n}`,
   items:['Beijo demorado','Abraço apertado','Mensagem romântica no WhatsApp','Café da manhã na cama','Massagem','Bilhete escondido','Elogio na frente de alguém','Cozinhei o prato favorito','Banho preparado','Cafuné','Andar de mãos dadas','Dei atenção sem celular'],
   end:n=>`Semana encerrada: ${n} de 7 dias de cuidado 💗`},
  love:{btn:'Com amor',tag:'Com amor',lead:'Escolha uma mensagem, deixe do seu jeito e mande.',send:'Mandar com amor',ph:'Escreva do seu jeito…'},
  err:'Não deu certo. Tente de novo.'},
 es:{title:'Encender la <em>relación</em>',pod:'Podio de la pareja',week:'Esta semana',total:'Desde el inicio',pts:n=>`${n} ${n===1?'punto':'puntos'}`,
  lastWin:n=>`La semana pasada: ganó ${n} 🏆`,lastTie:'La semana pasada: empate 🤝',podHint:'Los puntos vienen de los retos. El podio de la semana se reinicia cada lunes.',
  you:'Tú',par:'Tu amor',chooseT:'Retos',
  cards:{chal:['Reto de pareja','1 a 7 días. Cada uno arma su día'],fire:['Racha de fuego','Días seguidos de sexo. Si se rompe, pierden'],hold:['Quién aguanta más','Una sola noche. Quién llega más veces al límite'],care:['Semana del cuidado','7 días de cariño, sin que sea sobre sexo']},
  st:{none:'Empezar',invMe:'Invitación enviada',invThem:n=>`${n} te invitó`,active:'En curso',fireDay:(k,n)=>`En curso · día ${k} de ${n}`,careDay:k=>`En curso · día ${k} de 7`,holdWait:'Esperando el resultado'},
  invite:n=>`Invitar a ${n}`,inviteHold:n=>`Retar a ${n} hoy`,sent:n=>`Invitación enviada. En cuanto ${n} acepte, empieza.`,cancel:'Cancelar invitación',
  invited:n=>`${n} te invitó a este reto`,accept:'Aceptar',decline:'Ahora no',again:'Hacerlo otra vez',needPar:'Tu pareja tiene que haber entrado en la app para jugar los retos.',
  fire:{lead:'Ustedes eligen cuántos días seguidos van a hacer el amor. Sin preliminares que armar, sin reglas de posición: solo hacerlo y marcar.',
   days:'¿Cuántos días seguidos?',tip:'Consejo: lo más común es 3 — viernes, sábado y domingo.',rule:'Regla: si se saltan un día, la racha se rompe y los dos pierden sus puntos.',
   grace:'Cada día se puede marcar hasta el final del día siguiente.',did:'Lo hicimos ✓',done:'Hecho',locked:'Todavía no llega',rate:'Tu nota para ese día',note:'Una notita (opcional)',save:'Guardar',
   theirs:n=>`Nota de ${n}`,noRate:'todavía no puso nota',complete:n=>`¡Racha completa! 🔥 +${n} puntos para cada uno.`,broken:k=>`La racha se rompió el día ${k}. Los dos perdieron los puntos esta vez.`,today:'hoy',yesterday:'ayer (todavía hay tiempo)',missed:'perdido'},
  hold:{lead:'Reto de una sola noche. Uno lleva al otro hasta casi llegar… para… y vuelve a empezar. Puede ser con sexo oral, con las manos o como prefieran.',
   how:['Quien está recibiendo avisa cuando esté a punto de llegar. Ahí el otro para.','Cada vez que llegaste al límite sin terminar, cuenta 1.','Después cambien: ahora es el turno del otro.','Al final de la noche, cada uno pone aquí cuántas veces aguantó. Gana quien aguantó más.'],
   care:'Acuérdenlo antes, hablen durante y cualquiera puede parar cuando quiera. Es un juego, no una prueba.',
   q:'¿Cuántas veces llegaste al límite sin terminar?',send:'Enviar mi número',you:n=>`Tú: ${n}`,wait:n=>`Esperando que ${n} ponga su número.`,
   win:n=>`${n} aguantó más 🏆`,tie:'¡Empate! Los dos aguantaron igual 🤝',pts:'Ganador +3 · quien participó +1 · empate +2 cada uno'},
  care:{lead:'Una semana entera de cariño, que no es sobre sexo. Uno es el responsable de la semana y hace al menos un cariño al día. El otro lo devuelve con un ❤️.',
   who:'¿Quién es el responsable de esta semana?',me:'Yo',them:n=>n,suggest:'La próxima semana, cambien de responsable.',
   today:'El cariño de hoy',pick:'Elige lo que hiciste hoy',own:'O escribe el tuyo',mark:'Marcar el cuidado de hoy',
   doneToday:'Cuidado de hoy marcado 💗',day:k=>`Día ${k}`,heart:'Devolver ❤️',got:'❤️ recibido',nothing:'—',resp:n=>`Responsable: ${n}`,
   items:['Beso largo','Abrazo apretado','Mensaje romántico por WhatsApp','Desayuno en la cama','Masaje','Nota escondida','Elogio delante de alguien','Cociné su plato favorito','Baño preparado','Caricias en el pelo','Caminar de la mano','Atención sin móvil'],
   end:n=>`Semana terminada: ${n} de 7 días de cuidado 💗`},
  love:{btn:'Con amor',tag:'Con amor',lead:'Elige un mensaje, déjalo a tu manera y envíalo.',send:'Enviar con amor',ph:'Escríbelo a tu manera…'},
  err:'No salió bien. Inténtalo de nuevo.'}};
const Q=()=>HQ[lang];
const PNAME=()=>esc(S.pname||Q().par);
S.hx={type:null,runs:{},pod:null,view:'week',days:3,resp:'me',count:0,care:null,careOwn:'',fnote:{},loaded:false};
let sig='';
const dnum=s=>Math.round(Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10))/864e5);
const todayNo=r=>r&&r.start?dnum(r.today)-dnum(r.start)+1:0;
const marks=(r,f)=>(r.marks||[]).filter(f);
const partnerId=()=>{const p=S.hx.pod&&S.hx.pod.total;return p?Object.keys(p).find(k=>k!==S.uid):null};

async function loadHx(){if(!S.uid||S.isFree)return;
  const [a,b]=await Promise.all([sb.rpc('ch_state'),sb.rpc('couple_podium')]);if(a.error)return;
  const runs={};(a.data||[]).forEach(r=>runs[r.type]=r);const nsig=JSON.stringify([runs,b.data]);
  S.hx.runs=runs;S.hx.pod=b.data||null;S.hx.loaded=true;
  if(nsig!==sig){sig=nsig;if(['heat','hxc'].includes(S.screen)&&!document.activeElement.matches('input,textarea')){const y=window.scrollY;render();window.scrollTo(0,y)}}}

// ---------- tela Esquentar: pódio + lista ----------
function podium(){const q=Q(),p=S.hx.pod;if(!p)return '';const v=S.hx.view==='week'?p.week:p.total;const pid=partnerId();
  const me=(v&&v[S.uid])||0,th=(pid&&v&&v[pid])||0;
  const col=(name,n,lead)=>`<div class="podc ${lead?'lead':''}"><span class="crown">${lead?'👑':''}</span><strong>${name}</strong><span class="podn">${n}</span><small>${q.pts(n).replace(/^\d+ /,'')}</small></div>`;
  let last='';if(p.last&&pid){const a=p.last[S.uid]||0,b=p.last[pid]||0;if(a||b)last=`<p class="hint" style="margin:6px 0 0">${a===b?q.lastTie:q.lastWin(a>b?esc(S.name||q.you):PNAME())}</p>`}
  return `<div class="podium"><div class="row" style="justify-content:space-between;align-items:center"><div class="sec-t" style="margin:0;color:var(--honey)">🏆 ${q.pod}</div>
    <div class="seg mini" role="group"><button type="button" class="seg-b" data-hxv="week" aria-pressed="${S.hx.view==='week'}">${q.week}</button><button type="button" class="seg-b" data-hxv="total" aria-pressed="${S.hx.view==='total'}">${q.total}</button></div></div>
    <div class="podrow">${col(esc(S.name||q.you),me,me>th)}${col(PNAME(),th,th>me)}</div>${last}<p class="hint" style="margin:6px 0 0;font-size:12px">${q.podHint}</p></div>`}
function stLine(type){const q=Q(),r=S.hx.runs[type];if(!r)return q.st.none;
  if(r.status==='invited')return r.by===S.uid?q.st.invMe:q.st.invThem(PNAME());
  if(r.status==='active'){if(type==='fire')return q.st.fireDay(Math.min(todayNo(r),r.config.days||3),r.config.days||3);if(type==='care')return q.st.careDay(Math.min(todayNo(r),7));return q.st.holdWait}
  return q.st.none}
R.heat=function(){const q=Q(),H=typeof HXT==='function'?HXT():null;
  const card=(k,icn,go,sub)=>`<button type="button" class="gcard" ${go}><span class="gic">${ic(icn,24)}</span><span class="gbody"><strong>${q.cards[k][0]}</strong><span>${q.cards[k][1]}</span>${sub?`<span class="tagc gold" style="align-self:flex-start;margin-top:6px">${sub}</span>`:''}</span></button>`;
  if(!S.hx.loaded)loadHx();
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${q.title}</h2>${podium()}
   <div class="sec-t">${q.chooseT}</div><div class="glist">
   ${card('chal','chal','data-hx="go:chal"','')}
   ${card('fire','heat','data-hxo="fire"',S.hx.runs.fire&&['invited','active'].includes(S.hx.runs.fire.status)?stLine('fire'):'')}
   ${card('hold','games','data-hxo="hold"',S.hx.runs.hold&&['invited','active'].includes(S.hx.runs.hold.status)?stLine('hold'):'')}
   ${card('care','love','data-hxo="care"',S.hx.runs.care&&['invited','active'].includes(S.hx.runs.care.status)?stLine('care'):'')}
   </div></section>`};

// ---------- tela de cada desafio ----------
function inviteBlock(type){const q=Q(),r=S.hx.runs[type];
  if(r&&r.status==='invited'&&r.by===S.uid)return `<div class="note">${q.sent(PNAME())}</div><button type="button" class="btn ghost" data-hxa="cancel">${q.cancel}</button>`;
  if(r&&r.status==='invited')return `<div class="note gold">${q.invited(PNAME())}${type==='fire'?` · ${r.config.days} ${lang==='pt'?'dias':'días'}`:''}${type==='care'?` · ${q.care.resp(r.config.resp===S.uid?esc(S.name||q.you):PNAME())}`:''}</div>
    <div class="btns"><button type="button" class="btn pri" data-hxa="accept">${q.accept}</button><button type="button" class="btn link" data-hxa="decline">${q.decline}</button></div>`;
  return null}
function vFire(r){const q=Q(),f=q.fire,n=(r&&r.config.days)||S.hx.days;
  const inv=inviteBlock('fire');
  const head=`<p>${f.lead}</p><div class="note">${ic('lock',14)} ${f.rule}</div>`;
  if(!r||!['invited','active','done','broken'].includes(r.status)||((r.status==='done'||r.status==='broken')&&S.hx.again)){
    return head+`<div class="sec-t">${f.days}</div><div class="opts" style="flex-wrap:wrap">${[1,2,3,4,5,6,7].map(d=>`<button type="button" class="opt" data-hxd="${d}" aria-pressed="${S.hx.days===d}" style="min-width:44px;flex:0">${d}</button>`).join('')}</div>
      <p class="hint">${f.tip}</p><button type="button" class="btn pri" data-hxa="invite">${ic('heat',16)} ${q.invite(PNAME())}</button>`}
  if(inv)return head+inv;
  const tn=todayNo(r),pid=partnerId();let body='';
  for(let k=1;k<=n;k++){const done=marks(r,m=>m.d===k&&m.k==='done').length>0;const mine=marks(r,m=>m.d===k&&m.k==='fire'&&m.u===S.uid)[0];const th=marks(r,m=>m.d===k&&m.k==='fire'&&m.u!==S.uid)[0];
    const when=k===tn?f.today:k===tn-1&&!done&&r.status==='active'?f.yesterday:'';
    let inner='';
    if(done){inner=`<span class="tagc gold">✓ ${f.done}</span>
      <div class="mrow"><span>${f.rate}</span><span class="flames">${[1,2,3,4,5].map(v=>`<button type="button" class="fl ${mine&&v<=mine.v?'on':''}" data-hxf="${k}:${v}" aria-label="${v}">🔥</button>`).join('')}</span></div>
      ${r.status==='active'?`<div class="row" style="flex-wrap:nowrap"><input data-hxn="${k}" placeholder="${f.note}" value="${esc(S.hx.fnote[k]!=null?S.hx.fnote[k]:(mine&&mine.n)||'')}"><button type="button" class="btn ghost sm" data-hxfs="${k}">${f.save}</button></div>`:(mine&&mine.n?`<p class="dnote">“${esc(mine.n)}”</p>`:'')}
      <p class="hint" style="margin:0">${f.theirs(PNAME())}: ${th?'🔥'.repeat(th.v)+(th.n?` · “${esc(th.n)}”`:''):f.noRate}</p>`}
    else if(r.status==='active'&&(k===tn||k===tn-1))inner=`<button type="button" class="btn pri" data-hxdo="${k}">${f.did}</button>`;
    else if(k>tn)inner=`<span class="hint">${ic('lock',13)} ${f.locked}</span>`;
    else inner=`<span class="tagc">${f.missed}</span>`;
    body+=`<div class="dcard"><div class="dhead"><strong>${lang==='pt'?'Dia':'Día'} ${k}</strong>${when?`<span class="tagc">${when}</span>`:''}</div>${inner}</div>`}
  let end='';
  if(r.status==='done')end=`<div class="note gold">${f.complete(n+3)}</div><button type="button" class="btn ghost" data-hxa="again">${q.again}</button>`;
  if(r.status==='broken'){let k=1;while(k<=n&&marks(r,m=>m.d===k&&m.k==='done').length)k++;end=`<div class="note">${f.broken(k)}</div><button type="button" class="btn ghost" data-hxa="again">${q.again}</button>`}
  return head+`<p class="hint">${f.grace}</p>`+end+body}
function vHold(r){const q=Q(),h=q.hold;
  const head=`<p>${h.lead}</p><ol class="steps">${h.how.map(x=>`<li>${x}</li>`).join('')}</ol><div class="note">${ic('lock',14)} ${h.care}</div><p class="hint">${h.pts}</p>`;
  if(!r||r.status==='declined'||r.status==='canceled'||((r.status==='done')&&S.hx.again))return head+`<button type="button" class="btn pri" data-hxa="invite">${ic('games',16)} ${q.inviteHold(PNAME())}</button>`;
  const inv=inviteBlock('hold');if(inv)return head+inv;
  const mine=marks(r,m=>m.k==='count'&&m.u===S.uid)[0],th=marks(r,m=>m.k==='count'&&m.u!==S.uid)[0];
  if(r.status==='done'){const a=mine?mine.v:0,b=th?th.v:0;
    return `<div class="dcard"><div class="podrow">${`<div class="podc ${a>b?'lead':''}"><span class="crown">${a>b?'👑':''}</span><strong>${esc(S.name||q.you)}</strong><span class="podn">${a}</span></div><div class="podc ${b>a?'lead':''}"><span class="crown">${b>a?'👑':''}</span><strong>${PNAME()}</strong><span class="podn">${b}</span></div>`}</div>
      <div class="note gold">${a===b?h.tie:h.win(a>b?esc(S.name||q.you):PNAME())}</div></div><button type="button" class="btn ghost" data-hxa="again">${q.again}</button>`+head}
  if(mine)return head+`<div class="note gold">${h.you(mine.v)}</div><p class="hint">${h.wait(PNAME())}</p>`;
  return head+`<div class="sec-t">${h.q}</div><div class="stepper"><button type="button" class="btn ghost" data-hxc="-1">−</button><span class="podn">${S.hx.count}</span><button type="button" class="btn ghost" data-hxc="1">+</button></div>
    <button type="button" class="btn pri" data-hxa="count">${h.send}</button>`}
function vCare(r){const q=Q(),c=q.care;
  const head=`<p>${c.lead}</p>`;
  if(!r||['declined','canceled'].includes(r.status)||(r.status==='done'&&S.hx.again)){
    return head+`<div class="sec-t">${c.who}</div><div class="opts"><button type="button" class="opt" data-hxr="me" aria-pressed="${S.hx.resp==='me'}">${c.me}</button><button type="button" class="opt" data-hxr="them" aria-pressed="${S.hx.resp==='them'}">${PNAME()}</button></div>
      <p class="hint">${c.suggest}</p><button type="button" class="btn pri" data-hxa="invite">${ic('love',16)} ${q.invite(PNAME())}</button>`}
  const inv=inviteBlock('care');if(inv)return head+inv;
  const resp=r.config.resp,iAm=resp===S.uid,tn=Math.min(todayNo(r),7);
  let top=`<div class="note">${c.resp(iAm?esc(S.name||q.you):PNAME())}</div>`;
  if(r.status==='active'&&iAm){const today=marks(r,m=>m.k==='care'&&m.d===tn)[0];
    top+=today?`<div class="note gold">${c.doneToday} · ${esc(today.n||'')}</div>`:`<div class="dcard"><strong>${c.today}</strong><p class="hint" style="margin:0">${c.pick}</p>
      <div class="chips">${c.items.map((x,i)=>`<button type="button" class="chip" data-hxk="${i}" aria-pressed="${S.hx.care===i}">${x}</button>`).join('')}</div>
      <input id="hxown" placeholder="${c.own}" value="${esc(S.hx.careOwn)}"><button type="button" class="btn pri" data-hxa="care">${ic('love',16)} ${c.mark}</button></div>`}
  let days='';for(let k=1;k<=7;k++){const cm=marks(r,m=>m.k==='care'&&m.d===k)[0],hm=marks(r,m=>m.k==='heart'&&m.d===k)[0];
    days+=`<div class="dcard"><div class="dhead"><strong>${c.day(k)}</strong>${k===tn&&r.status==='active'?`<span class="tagc">${lang==='pt'?'hoje':'hoy'}</span>`:''}</div>
      ${cm?`<p style="margin:0">💗 ${esc(cm.n||'')}</p>${hm?`<span class="tagc gold">${c.got}</span>`:(!iAm&&r.status!=='broken'?`<button type="button" class="btn ghost sm" data-hxh="${k}">${c.heart}</button>`:'')}`:`<span class="hint">${k>tn?ic('lock',13):c.nothing}</span>`}</div>`}
  if(r.status==='done')top=`<div class="note gold">${c.end(new Set(marks(r,m=>m.k==='care').map(m=>m.d)).size)}</div><button type="button" class="btn ghost" data-hxa="again">${q.again}</button>`+top;
  return head+top+days}
R.hxc=function(){const q=Q(),type=S.hx.type,r=S.hx.runs[type];
  let body=!S.partner?`<div class="note">${q.needPar}</div>`:type==='fire'?vFire(r):type==='hold'?vHold(r):vCare(r);
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${q.cards[type][0]}</h2>${body}</section>`};

// largura média e sem piscar
const _render=window.render;window.render=function(){_render();if(S.screen==='hxc'){const v=document.getElementById('view');if(v&&!v.classList.contains('mid'))v.className='mid'+(v.classList.contains('still')?' still':'')}};

// ---------- eventos ----------
async function call(fn,args){const {error}=await sb.rpc(fn,args);if(error){toast(/par ainda/.test(error.message)?Q().needPar:/andamento/.test(error.message)?error.message:Q().err);return false}sig='';await loadHx();return true}
document.addEventListener('click',async e=>{const el=e.target.closest('[data-hxo],[data-hxv],[data-hxd],[data-hxr],[data-hxk],[data-hxc],[data-hxa],[data-hxdo],[data-hxf],[data-hxfs],[data-hxh]');if(!el)return;
  e.stopImmediatePropagation();const h=S.hx,d=el.dataset,r=h.runs[h.type];
  if(d.hxo){h.type=d.hxo;h.again=false;h.count=0;h.care=null;h.careOwn='';go('hxc');loadHx();return}
  if(d.hxv){h.view=d.hxv;render();return}
  if(d.hxd){h.days=+d.hxd;render();return}
  if(d.hxr){h.resp=d.hxr;render();return}
  if(d.hxk){h.care=h.care===+d.hxk?null:+d.hxk;render();return}
  if(d.hxc){h.count=Math.max(0,Math.min(99,h.count+(+d.hxc)));render();return}
  if(d.hxdo){el.disabled=true;await call('ch_mark',{p_run:r.id,p_day:+d.hxdo,p_kind:'done',p_value:null,p_note:null});return}
  if(d.hxf){const [k,v]=d.hxf.split(':').map(Number);const note=h.fnote[k]!=null?h.fnote[k]:((marks(r,m=>m.d===k&&m.k==='fire'&&m.u===S.uid)[0]||{}).n||'');await call('ch_mark',{p_run:r.id,p_day:k,p_kind:'fire',p_value:v,p_note:note});return}
  if(d.hxfs){const k=+d.hxfs;const mine=marks(r,m=>m.d===k&&m.k==='fire'&&m.u===S.uid)[0];if(!mine){toast(lang==='pt'?'Escolha os foguinhos primeiro.':'Elige los fueguitos primero.');return}
    if(await call('ch_mark',{p_run:r.id,p_day:k,p_kind:'fire',p_value:mine.v,p_note:h.fnote[k]||''})){delete h.fnote[k];toast(lang==='pt'?'Salvo ✓':'Guardado ✓')}return}
  if(d.hxh){el.disabled=true;await call('ch_mark',{p_run:r.id,p_day:+d.hxh,p_kind:'heart',p_value:null,p_note:null});return}
  switch(d.hxa){
    case 'invite':{const cfg=h.type==='fire'?{days:h.days}:h.type==='care'?{resp:h.resp==='me'?S.uid:partnerId()}:{};
      if(h.type==='care'&&!cfg.resp){toast(Q().err);return}el.disabled=true;if(await call('ch_invite',{p_type:h.type,p_config:cfg}))h.again=false;el.disabled=false;return}
    case 'cancel':case 'decline':await call('ch_answer',{p_run:r.id,p_accept:false});return;
    case 'accept':await call('ch_answer',{p_run:r.id,p_accept:true});return;
    case 'again':h.again=true;if(h.type==='care'&&r&&r.config.resp)h.resp=r.config.resp===S.uid?'them':'me';render();return;
    case 'count':el.disabled=true;await call('ch_mark',{p_run:r.id,p_day:1,p_kind:'count',p_value:h.count,p_note:null});return;
    case 'care':{const own=(h.careOwn||'').trim();const tx=own||(h.care!=null?Q().care.items[h.care]:'');if(!tx){toast(Q().care.pick);return}
      el.disabled=true;if(await call('ch_mark',{p_run:r.id,p_day:Math.min(todayNo(r),7),p_kind:'care',p_value:null,p_note:tx})){h.care=null;h.careOwn=''}return}
  }},true);
document.addEventListener('input',e=>{const t2=e.target;if(t2.id==='hxown')S.hx.careOwn=t2.value;else if(t2.dataset&&t2.dataset.hxn)S.hx.fnote[t2.dataset.hxn]=t2.value});
const _go=window.go;window.go=function(s,o){const r=_go(s,o);if((s==='heat'||s==='hxc')&&S.uid)loadHx();return r};
setInterval(()=>{if(S.uid&&['heat','hxc'].includes(S.screen)&&document.visibilityState==='visible')loadHx()},8000);

// ===================== CONVERSAR: "COM AMOR" =====================
const LOVE_MARK='⁣♥⁣';
S.tk.lcat=S.tk.lcat||'love';S.tk.ldraft='';
const _talk=R.talk;
R.talk=function(){const q=Q(),k=S.tk,H=typeof HXT==='function'?HXT():null;
  // mensagens "com amor" entram como texto marcado, e viram etiqueta depois
  const real=k.msgs;k.msgs=real.map(m=>m.kind==='love'?Object.assign({},m,{kind:'text'}):m);
  const loveMode=k.mode==='love';if(loveMode)k.mode=null;
  let h;try{h=_talk()}finally{k.msgs=real;if(loveMode)k.mode='love'}
  h=h.split(esc(LOVE_MARK)).join('').replace(/<div ([^>]*?)class="bub2 (me|them)( canedit)?">(?=⁣?)/g,(m)=>m);
  // etiqueta 💗 nas mensagens com amor
  let i=0;h=h.replace(/<div ((?:data-[a-z]+="[^"]*" )*)class="bub2 (me|them)([^"]*)">/g,(m,attrs,who,cls)=>{const msg=real[i++];if(msg&&msg.kind==='love')return `<div ${attrs}class="bub2 ${who}${cls} special lovec"><span class="po">💗 ${q.love.tag}</span>`;return m});
  // botão "Com amor"
  h=h.replace(/(<button type="button" class="btn [a-z]+ sm" data-act="tkpick">[\s\S]*?<\/button>)/,`$1<button type="button" class="btn ${loveMode?'gold':'ghost'} sm" data-tklove="1">${ic('love',15)} ${q.love.btn}</button>`);
  if(loveMode&&H&&typeof LOVEMSG!=='undefined'){const cats=H.lcats||{};const list=(LOVEMSG[lang][k.lcat]||[]);
    const panel=`<div class="panel"><p class="hint" style="margin:0">${q.love.lead}</p><div class="chips">${Object.entries(cats).map(([c,l])=>`<button type="button" class="chip" data-tklc="${c}" aria-pressed="${k.lcat===c}">${l}</button>`).join('')}</div>
      <div class="plist2">${list.map((m,j)=>`<button type="button" class="lvmsg ${k.ldraft===m?'on':''}" data-tklp="${j}">${m}</button>`).join('')}</div>
      <textarea id="tklove" rows="3" placeholder="${q.love.ph}">${esc(k.ldraft)}</textarea>
      <div class="row"><button type="button" class="btn pri sm" data-tkls="1">${ic('love',15)} ${q.love.send}</button><button type="button" class="btn link" style="width:auto" data-tklx="1">${Q().decline}</button></div></div>`;
    h=h.replace('<div class="chat">',panel+'<div class="chat">')}
  return h};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-tklove],[data-tklc],[data-tklp],[data-tkls],[data-tklx]');if(!b||S.screen!=='talk')return;e.stopImmediatePropagation();const k=S.tk,d=b.dataset;
  if(d.tklove||d.tklx){k.mode=k.mode==='love'?null:'love';render();return}
  if(d.tklc){k.lcat=d.tklc;render();return}
  if(d.tklp){k.ldraft=LOVEMSG[lang][k.lcat][+d.tklp];render();return}
  if(d.tkls){const tx=(k.ldraft||'').trim();if(!tx){toast(Q().love.lead);return}b.disabled=true;
    k.msgs.push({who:'me',kind:'love',text:tx});k.mode=null;k.ldraft='';if(window.talkReply)window.talkReply()}},true);
document.addEventListener('input',e=>{if(e.target.id==='tklove')S.tk.ldraft=e.target.value});
})();
