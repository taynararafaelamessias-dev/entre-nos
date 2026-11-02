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
   how:['Cada um define a meta do outro: quantas vezes ele ou ela vai ter que chegar no limite sem terminar.','Quem está recebendo avisa quando estiver quase chegando. Aí o outro para… e recomeça.','Depois troquem: agora é a vez do outro.','No fim da noite, cada um marca se alcançou a meta.'],
   care:'Combinem antes, falem durante e qualquer um pode parar quando quiser. É brincadeira, não prova.',
   metaFor:n=>`Meta de ${n}: quantas vezes vai ter que segurar?`,metaMine:'Sua meta',metaTheirs:n=>`Meta de ${n}`,times:n=>`${n} ${n===1?'vez':'vezes'}`,metaWait:n=>`${n} define a sua meta quando aceitar`,
   did:'Você alcançou a sua meta?',yes:'Alcancei ✓',no:'Não alcancei',count:'Quantas vezes? (opcional)',hitY:'Alcançou ✓',hitN:'Não alcançou',waitRes:'Ainda não marcou',
   pts:'Alcançou a meta +3 · não alcançou +1 por participar',she:'Ela',he:'Ele'},
  care:{lead:'Uma semana de carinho, que não é sobre sexo. Um é o responsável da semana, escolhe os dias e faz um carinho em cada um. O outro devolve com um ❤️.',
   who:'Quem é o responsável desta semana?',me:'Eu',them:n=>n,suggest:'Na próxima semana, troquem o responsável.',
   pickDays:'Em quais dias você vai fazer o carinho?',tipDays:'Dica: o ideal é a semana inteira 💗',saveDays:'Confirmar os dias',waitDays:n=>`${n} está escolhendo os dias da semana.`,changeDays:'Mudar os dias',
   wd:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],wdl:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],open:'Marcar o que fiz',done:'Feito ✓',notChosen:'Dia livre',
   today:'O carinho de hoje',pick:'O que você fez?',own:'Ou escreva o seu',mark:'Feito ✓',
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
   how:['Cada uno define la meta del otro: cuántas veces va a tener que llegar al límite sin terminar.','Quien está recibiendo avisa cuando esté a punto de llegar. Ahí el otro para… y vuelve a empezar.','Después cambien: ahora es el turno del otro.','Al final de la noche, cada uno marca si alcanzó su meta.'],
   care:'Acuérdenlo antes, hablen durante y cualquiera puede parar cuando quiera. Es un juego, no una prueba.',
   metaFor:n=>`Meta de ${n}: ¿cuántas veces va a tener que aguantar?`,metaMine:'Tu meta',metaTheirs:n=>`Meta de ${n}`,times:n=>`${n} ${n===1?'vez':'veces'}`,metaWait:n=>`${n} define tu meta cuando acepte`,
   did:'¿Alcanzaste tu meta?',yes:'La alcancé ✓',no:'No la alcancé',count:'¿Cuántas veces? (opcional)',hitY:'Alcanzó ✓',hitN:'No alcanzó',waitRes:'Todavía no marcó',
   pts:'Alcanzó la meta +3 · no la alcanzó +1 por participar',she:'Ella',he:'Él'},
  care:{lead:'Una semana de cariño, que no es sobre sexo. Uno es el responsable de la semana, elige los días y hace un cariño en cada uno. El otro lo devuelve con un ❤️.',
   pickDays:'¿Qué días vas a hacer el cariño?',tipDays:'Consejo: lo ideal es la semana entera 💗',saveDays:'Confirmar los días',waitDays:n=>`${n} está eligiendo los días de la semana.`,changeDays:'Cambiar los días',
   wd:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],wdl:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],open:'Marcar lo que hice',done:'Hecho ✓',notChosen:'Día libre',
   who:'¿Quién es el responsable de esta semana?',me:'Yo',them:n=>n,suggest:'La próxima semana, cambien de responsable.',
   today:'El cariño de hoy',pick:'¿Qué hiciste?',own:'O escribe el tuyo',mark:'Hecho ✓',
   doneToday:'Cuidado de hoy marcado 💗',day:k=>`Día ${k}`,heart:'Devolver ❤️',got:'❤️ recibido',nothing:'—',resp:n=>`Responsable: ${n}`,
   items:['Beso largo','Abrazo apretado','Mensaje romántico por WhatsApp','Desayuno en la cama','Masaje','Nota escondida','Elogio delante de alguien','Cociné su plato favorito','Baño preparado','Caricias en el pelo','Caminar de la mano','Atención sin móvil'],
   end:n=>`Semana terminada: ${n} de 7 días de cuidado 💗`},
  love:{btn:'Con amor',tag:'Con amor',lead:'Elige un mensaje, déjalo a tu manera y envíalo.',send:'Enviar con amor',ph:'Escríbelo a tu manera…'},
  err:'No salió bien. Inténtalo de nuevo.'}};
const Q=()=>HQ[lang];
const PNAME=()=>esc(S.pname||Q().par);
S.hx={meta:3,cnt:'',openDay:null,daySel:null,editDays:false,type:null,runs:{},pod:null,view:'week',days:3,resp:'me',count:0,care:null,careOwn:'',fnote:{},loaded:false};
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
// figuras ilustradas (mulher / homem), sem rosto, no estilo do app
// Charme: lábios pra ela, bigode e gravata-borboleta pra ele
function avatar(g,lead){const bg=g==='f'?'#2A1416':'#1d1715',ring=lead?'#C8A15A':'rgba(200,161,90,.45)';
  const art=g==='f'?`<path d="M28 60c8-10 17-15 24-12 4 2 6 3 8 3s4-1 8-3c7-3 16 2 24 12-8 12-19 19-32 19S36 72 28 60z" fill="#A01E2B"/><path d="M28 60c10 3 21 4 32 4s22-1 32-4" stroke="#5a0f18" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M44 54c4-2 7-1 9 1" stroke="#F2EBE5" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`
   :`<path d="M60 48c-6-8-18-10-26-3-3 3-2 8 2 8 3 0 5-3 9-3 6 0 10 4 15 4s9-4 15-4c4 0 6 3 9 3 4 0 5-5 2-8-8-7-20-5-26 3z" fill="#C8A15A"/><path d="M42 72l14 7-14 7z M78 72l-14 7 14 7z" fill="#A01E2B"/><circle cx="60" cy="79" r="5" fill="#A01E2B" stroke="#5a0f18" stroke-width="1.5"/>`;
  return `<svg class="ava" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="${bg}"/><circle cx="60" cy="60" r="50" fill="none" stroke="${ring}" stroke-width="${lead?2:1}"/>${art}</svg>`}
function podium(){const q=Q(),p=S.hx.pod||{week:{},total:{},last:{}};const v=(S.hx.view==='week'?p.week:p.total)||{};const pid=partnerId();
  const me=v[S.uid]||0,th=(pid&&v[pid])||0;const meLead=me>th,thLead=th>me;
  const col=(name,g,n,lead,tie)=>`<div class="podc ${lead?'lead':''}"><span class="trophy">${lead?'🏆':tie&&n>0?'🤝':''}</span>${avatar(g,lead)}<strong>${name}</strong><div class="podbar" style="height:${lead?64:tie?52:40}px"><span class="podn">${n}</span><small>${q.pts(n).replace(/^\d+ /,'')}</small></div></div>`;
  let last='';if(p.last&&pid){const a=p.last[S.uid]||0,b=p.last[pid]||0;if(a||b)last=`<p class="hint" style="margin:8px 0 0;text-align:center">${a===b?q.lastTie:q.lastWin(a>b?esc(S.name||q.you):PNAME())}</p>`}
  const zero=!me&&!th?`<p class="hint" style="margin:8px 0 0;text-align:center">${lang==='pt'?'0 × 0 — comecem um desafio! 🔥':'0 × 0 — ¡empiecen un reto! 🔥'}</p>`:'';
  return `<div class="podium"><div class="sec-t" style="margin:0 0 4px;color:var(--honey);text-align:center">🏆 ${q.pod}</div>
    <div class="seg mini" role="group" style="margin:6px auto 0"><button type="button" class="seg-b" data-hxv="week" aria-pressed="${S.hx.view==='week'}">${q.week}</button><button type="button" class="seg-b" data-hxv="total" aria-pressed="${S.hx.view==='total'}">${q.total}</button></div>
    <div class="podrow">${col(esc(S.name||q.you),S.gender||'f',me,meLead,me===th)}${col(PNAME(),S.pgender||'m',th,thLead,me===th)}</div>${zero}${last}<p class="hint" style="margin:8px 0 0;font-size:12px;text-align:center">${q.podHint}</p></div>`}
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
    return head+`<div class="sec-t">${f.days}</div><div class="chips">${[1,2,3,4,5,6,7].map(d=>`<button type="button" class="chip" data-hxd="${d}" aria-pressed="${S.hx.days===d}">${d}</button>`).join('')}</div>
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
function vHold(r){const q=Q(),h=q.hold,pid=partnerId();
  const head=`<p>${h.lead}</p><ol class="steps">${h.how.map(x=>`<li>${x}</li>`).join('')}</ol><div class="note">${ic('lock',14)} ${h.care}</div><p class="hint">${h.pts}</p>`;
  const stepper=(key,val)=>`<div class="stepper"><button type="button" class="btn ghost" data-hxm="${key}:-1">−</button><span class="podn">${val}</span><button type="button" class="btn ghost" data-hxm="${key}:1">+</button></div>`;
  if(!r||r.status==='declined'||r.status==='canceled'||((r.status==='done')&&S.hx.again))
    return head+`<div class="sec-t">${h.metaFor(PNAME())}</div>${stepper('meta',S.hx.meta)}<button type="button" class="btn pri" data-hxa="invite">${ic('games',16)} ${q.inviteHold(PNAME())}</button>`;
  if(r.status==='invited'&&r.by!==S.uid)
    return head+`<div class="note gold">${q.invited(PNAME())} · ${h.metaMine}: ${h.times(((r.config.meta||{})[S.uid])||0)}</div><div class="sec-t">${h.metaFor(PNAME())}</div>${stepper('meta',S.hx.meta)}
      <div class="btns"><button type="button" class="btn pri" data-hxa="accept">${q.accept}</button><button type="button" class="btn link" data-hxa="decline">${q.decline}</button></div>`;
  const inv=inviteBlock('hold');if(inv)return head+inv;
  const meta=r.config.meta||{};
  const person=(uid,name,g)=>{const hit=marks(r,m=>m.k==='hit'&&m.u===uid)[0],cnt=marks(r,m=>m.k==='count'&&m.u===uid)[0];const mine=uid===S.uid;
    let res='';if(hit)res=`<span class="tagc ${hit.v?'gold':''}">${hit.v?h.hitY:h.hitN}</span>${cnt?`<small class="hint">${h.times(cnt.v)}</small>`:''}`;
    else if(mine&&r.status==='active')res=`<p class="hint" style="margin:0">${h.did}</p><div class="btns" style="gap:8px"><button type="button" class="btn pri sm" data-hxhit="1">${h.yes}</button><button type="button" class="btn ghost sm" data-hxhit="0">${h.no}</button></div>
      <input type="number" min="0" max="99" inputmode="numeric" id="hxcnt" placeholder="${h.count}" value="${S.hx.cnt||''}">`;
    else res=`<span class="hint">${h.waitRes}</span>`;
    return `<div class="dcard holdc">${avatar(g,hit&&hit.v)}<div class="holdb"><strong>${g==='f'?h.she:h.he} · ${name}</strong><span class="tagc">${mine?h.metaMine:h.metaTheirs(name)}: ${h.times(meta[uid]||0)}</span>${res}</div></div>`};
  const me=person(S.uid,esc(S.name||q.you),S.gender||'f'),th=person(pid,PNAME(),S.pgender||'m');
  const order=(S.gender||'f')==='f'?me+th:th+me;
  return order+(r.status==='done'?`<button type="button" class="btn ghost" data-hxa="again">${q.again}</button>`:'')+head}
function vCare(r){const q=Q(),c=q.care;
  const head=`<p>${c.lead}</p>`;
  if(!r||['declined','canceled'].includes(r.status)||(r.status==='done'&&S.hx.again)){
    return head+`<div class="sec-t">${c.who}</div><div class="opts"><button type="button" class="opt" data-hxr="me" aria-pressed="${S.hx.resp==='me'}">${c.me}</button><button type="button" class="opt" data-hxr="them" aria-pressed="${S.hx.resp==='them'}">${PNAME()}</button></div>
      <p class="hint">${c.suggest}</p><button type="button" class="btn pri" data-hxa="invite">${ic('love',16)} ${q.invite(PNAME())}</button>`}
  const resp=r.config.resp,iAm=resp===S.uid;
  const inv=inviteBlock('care');if(inv)return head+inv;
  const start=r.start?dnum(r.start):dnum(r.today),tn=Math.min(todayNo(r),7);
  const wdIdx=k=>{const d=new Date((start+k-1)*864e5);return (d.getUTCDay()+6)%7};
  const chosen=r.config.days||null;
  let top=`<div class="note">${c.resp(iAm?esc(S.name||q.you):PNAME())}</div>`;
  // o responsável escolhe os dias
  if(r.status==='active'&&(!chosen||S.hx.editDays)){
    if(!iAm)return head+top+`<div class="note gold">${c.waitDays(PNAME())}</div>`;
    const sel=S.hx.daySel||chosen||[1,2,3,4,5,6,7];S.hx.daySel=sel;
    return head+top+`<div class="sec-t">${c.pickDays}</div><div class="wkpick">${[1,2,3,4,5,6,7].map(k=>`<button type="button" class="wkd" data-hxday="${k}" aria-pressed="${sel.includes(k)}"><small>${c.wd[wdIdx(k)]}</small><strong>${new Date((start+k-1)*864e5).getUTCDate()}</strong></button>`).join('')}</div>
      <p class="hint">${c.tipDays}</p><button type="button" class="btn pri" data-hxa="days">${c.saveDays}</button>`}
  let list='';for(let k=1;k<=7;k++){const on=!chosen||chosen.includes(k);const cm=marks(r,m=>m.k==='care'&&m.d===k)[0],hm=marks(r,m=>m.k==='heart'&&m.d===k)[0];
    const label=`${c.wdl[wdIdx(k)]} · ${new Date((start+k-1)*864e5).getUTCDate()}`;const isToday=k===tn&&r.status==='active';
    if(!on){list+=`<div class="dcard off"><div class="dhead"><strong>${label}</strong><span class="hint">${c.notChosen}</span></div></div>`;continue}
    let inner='';
    if(cm)inner=`<p style="margin:0">💗 ${esc(cm.n||'')}</p>${hm?`<span class="tagc gold">${c.got}</span>`:(!iAm?`<button type="button" class="btn ghost sm" data-hxh="${k}">${c.heart}</button>`:'')}`;
    else if(iAm&&r.status==='active'&&k<=tn){
      inner=S.hx.openDay===k?`<p class="hint" style="margin:0">${c.pick}</p><div class="chips">${c.items.map((x,i)=>`<button type="button" class="chip" data-hxk="${i}" aria-pressed="${S.hx.care===i}">${x}</button>`).join('')}</div>
        <input id="hxown" placeholder="${c.own}" value="${esc(S.hx.careOwn)}"><button type="button" class="btn pri" data-hxa="care" data-day="${k}">${ic('check',16)} ${c.mark}</button>`
        :`<button type="button" class="btn ghost sm" data-hxopen="${k}">${c.open}</button>`}
    else inner=`<span class="hint">${k>tn?ic('lock',13):c.nothing}</span>`;
    list+=`<div class="dcard ${cm?'ok':''}"><div class="dhead"><strong>${label}</strong>${isToday?`<span class="tagc">${lang==='pt'?'hoje':'hoy'}</span>`:''}${cm?`<span class="tagc gold">${c.done}</span>`:''}</div>${inner}</div>`}
  if(r.status==='active'&&iAm)top+=`<button type="button" class="btn link" style="width:auto;align-self:flex-start" data-hxa="editdays">${c.changeDays}</button>`;
  if(r.status==='done')top=`<div class="note gold">${c.end(new Set(marks(r,m=>m.k==='care').map(m=>m.d)).size)}</div><button type="button" class="btn ghost" data-hxa="again">${q.again}</button>`+top;
  return head+top+list}
R.hxc=function(){const q=Q(),type=S.hx.type,r=S.hx.runs[type];
  let body=!S.partner?`<div class="note">${q.needPar}</div>`:type==='fire'?vFire(r):type==='hold'?vHold(r):vCare(r);
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${q.cards[type][0]}</h2>${body}</section>`};

// Desafio do casal: "como funciona" em passos, um embaixo do outro
if(R.chal){const _chal=R.chal;R.chal=function(){let h=_chal();const H=typeof HXT==='function'?HXT():null;if(!H||!H.chalHow)return h;
  const raw=H.chalHow.replace(/^[^:]*:\s*/,'');const parts=raw.split(/\s*\d\)\s*/).filter(Boolean);
  if(parts.length<2)return h;const last=parts[parts.length-1];const m=last.match(/^(.*?[.;])\s+(.*)$/);const steps=parts.slice(0,-1).concat(m?[m[1]]:[last]).map(x=>x.replace(/[;.]\s*$/,''));
  const html=`<div class="sec-t" style="margin-top:0">${lang==='pt'?'Como funciona':'Cómo funciona'}</div><ol class="steps">${steps.map(x=>`<li>${x}</li>`).join('')}</ol>${m?`<p class="hint">${m[2]}</p>`:''}`;
  return h.replace(`<div class="note">${H.chalHow}</div>`,html)}}

// largura média e sem piscar
const _render=window.render;window.render=function(){_render();if(S.screen==='hxc'){const v=document.getElementById('view');if(v&&!v.classList.contains('mid'))v.className='mid'+(v.classList.contains('still')?' still':'')}};

// ---------- eventos ----------
async function call(fn,args){const {error}=await sb.rpc(fn,args);if(error){toast(/par ainda/.test(error.message)?Q().needPar:/andamento/.test(error.message)?error.message:Q().err);return false}sig='';await loadHx();return true}
document.addEventListener('click',async e=>{const el=e.target.closest('[data-hxo],[data-hxv],[data-hxd],[data-hxr],[data-hxk],[data-hxc],[data-hxa],[data-hxdo],[data-hxf],[data-hxfs],[data-hxh],[data-hxm],[data-hxhit],[data-hxday],[data-hxopen]');if(!el)return;
  e.stopImmediatePropagation();const h=S.hx,d=el.dataset,r=h.runs[h.type];
  if(d.hxo){h.type=d.hxo;h.again=false;h.count=0;h.care=null;h.careOwn='';h.meta=3;h.cnt='';h.openDay=null;h.daySel=null;h.editDays=false;go('hxc');loadHx();return}
  if(d.hxm){const [,dl]=d.hxm.split(':');h.meta=Math.max(1,Math.min(30,h.meta+(+dl)));render();return}
  if(d.hxopen){h.openDay=+d.hxopen;h.care=null;h.careOwn='';render();return}
  if(d.hxday){const k=+d.hxday;const sel=h.daySel||[];h.daySel=sel.includes(k)?sel.filter(x=>x!==k):[...sel,k].sort();render();return}
  if(d.hxhit){const cnt=(document.getElementById('hxcnt')||{}).value;el.disabled=true;
    if(cnt!==''&&cnt!=null&&!isNaN(+cnt))await sb.rpc('ch_mark',{p_run:r.id,p_day:1,p_kind:'count',p_value:Math.max(0,Math.min(99,Math.round(+cnt))),p_note:null});
    await call('ch_mark',{p_run:r.id,p_day:1,p_kind:'hit',p_value:+d.hxhit,p_note:null});return}
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
    case 'invite':{const pid=partnerId();const cfg=h.type==='fire'?{days:h.days}:h.type==='care'?{resp:h.resp==='me'?S.uid:pid}:{meta:{[pid]:h.meta}};
      if(h.type==='hold'&&!pid){toast(Q().err);return}
      if(h.type==='care'&&!cfg.resp){toast(Q().err);return}el.disabled=true;if(await call('ch_invite',{p_type:h.type,p_config:cfg}))h.again=false;el.disabled=false;return}
    case 'cancel':case 'decline':await call('ch_answer',{p_run:r.id,p_accept:false});return;
    case 'accept':await call('ch_answer',{p_run:r.id,p_accept:true,p_config:h.type==='hold'?{meta:{[r.by]:h.meta}}:null});return;
    case 'days':{const sel=h.daySel||[];if(!sel.length){toast(Q().care.pickDays);return}el.disabled=true;if(await call('ch_set_days',{p_run:r.id,p_days:sel})){h.editDays=false;h.daySel=null}return}
    case 'editdays':h.editDays=true;h.daySel=(r.config.days||[1,2,3,4,5,6,7]).slice();render();return;
    case 'again':h.again=true;if(h.type==='care'&&r&&r.config.resp)h.resp=r.config.resp===S.uid?'them':'me';render();return;
    case 'count':el.disabled=true;await call('ch_mark',{p_run:r.id,p_day:1,p_kind:'count',p_value:h.count,p_note:null});return;
    case 'care':{const own=(h.careOwn||'').trim();const tx=own||(h.care!=null?Q().care.items[h.care]:'');if(!tx){toast(Q().care.pick);return}
      el.disabled=true;if(await call('ch_mark',{p_run:r.id,p_day:+(el.dataset.day||Math.min(todayNo(r),7)),p_kind:'care',p_value:null,p_note:tx})){h.care=null;h.careOwn='';h.openDay=null}return}
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
