// Guia dos cards, Esquentar a relação (Desafio + Pro meu amor)
ICON.guide='<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><path d="M13 15h7M13 18h5"/>';
ICON.love='<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>';
ICON.chal='<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>';
ICON.check='<path d="M5 12.5l4.5 4.5L19 7.5"/>';

const HX={
pt:{
 guideTile:['','O que tem em cada card','Entenda o app antes de começar'],
 guideTitle:'O que tem em <em>cada card</em>', guideLead:'Toque num quadradinho pra ver o que tem lá dentro e como usar.',
 preview:'Como a tela aparece', inside:'O que você encontra aqui', gamesEach:'Os jogos, um por um', soonT:'Em breve',
 heatSub:'Desafio do casal e Pro meu amor',
 heatTitle:'Esquentar a <em>relação</em>',
 chalCard:['Desafio do casal','De 1 a 7 dias. Cada um monta os dias que escolheu.'],
 loveCard:['Pro meu amor','Mensagens de carinho, leves, pra mandar pro seu amor.'],
 chalTitle:'Desafio do <em>casal</em>',
 chalHow:'Como funciona: 1) escolham quantos dias vão brincar; 2) definam quem monta cada dia; 3) cada um monta o seu dia escolhendo até 2 posições, 2 preliminares, 2 brinquedos e 2 jogos. Nada é obrigatório: se não tem brinquedo, é só pular.',
 howMany:'Quantos dias vocês querem brincar?', whoPicks:'Quem monta cada dia?', day:n=>`Dia ${n}`, me:'Eu', them:'Meu amor',
 start:'Começar o desafio', restart:'Recomeçar desafio', restartQ:'Toque de novo pra confirmar: o desafio atual será apagado.',
 youPick:'Você monta', theyPick:'Seu amor monta', tapBuild:'Toque pra montar o seu dia', building:'Seu amor está montando…', empty:'Nada escolhido ainda',
 doneT:'Feito ✓', markDone:'Marcar como feito', undone:'Desmarcar',
 editTitle:n=>`Montar o dia ${n}`, editLead:'Toque nos quadradinhos pra escolher. Até 2 de cada tipo (posições, preliminares, brinquedos e jogos). Não precisa escolher de tudo: só o que fizer sentido pra vocês. Cada quadradinho mostra o que é, pra você saber mesmo se nunca fez.', others:'Outras opções', all:'Todas as opções',
 cats:{pos:'Posições',pre:'Preliminares',toy:'Brinquedos',game:'Jogos'}, max2:'Máximo de 2 nesse tipo. Desmarque um pra trocar.',
 fromWish:'Da sua lista de desejos', saveDay:'Pronto, enviar pro meu amor', needOne:'Escolha pelo menos 1 item pro dia.', saved:'Dia enviado pro seu amor 💞',
 theyBuilt:n=>`Seu amor montou o dia ${n} 🔥`, cmYou:'Seu comentário', cmThem:'Comentário do seu amor', cmPh:'Comente esse dia…', cmBtn:'Comentar',
 see3d:'Ver em 3D', dayB:'Durante o dia', actB:'Na hora', bdsmTag:'BDSM', progress:(a,b)=>`${a} de ${b} dias feitos`,
 loveTitle:'Pro meu <em>amor</em>', loveLead:'Um cantinho calmo, sem pressa. Escolha uma mensagem, deixe do seu jeito e mande. Ela chega só aqui dentro do app.',
 loveTabs:['Mandar','Nossas mensagens'], msgPh:'Escreva ou edite sua mensagem…', send:'Enviar pro meu amor', sent:'Mensagem enviada 💌', writeOwn:'Ou escreva a sua',
 youSent:'Você mandou', theySent:'Seu amor mandou', reply:'Responder', replyPh:'Responda com carinho…', noMsgs:'Nenhuma mensagem ainda.',
 lcats:{night:'Obrigada pela noite',love:'Eu te amo',praise:'Elogio',miss:'Saudade',day:'Bom dia e boa noite',sorry:'Desculpa'}
},
es:{
 guideTile:['','Qué hay en cada tarjeta','Entiende la app antes de empezar'],
 guideTitle:'Qué hay en <em>cada tarjeta</em>', guideLead:'Toca un cuadrito para ver qué hay dentro y cómo usarlo.',
 preview:'Así se ve la pantalla', inside:'Qué encuentras aquí', gamesEach:'Los juegos, uno por uno', soonT:'Próximamente',
 heatSub:'Reto de pareja y Para mi amor',
 heatTitle:'Encender la <em>relación</em>',
 chalCard:['Reto de pareja','De 1 a 7 días. Cada uno prepara los días que eligió.'],
 loveCard:['Para mi amor','Mensajes de cariño, suaves, para enviar a tu amor.'],
 chalTitle:'Reto de <em>pareja</em>',
 chalHow:'Cómo funciona: 1) elegid cuántos días vais a jugar; 2) decidid quién prepara cada día; 3) cada uno prepara su día eligiendo hasta 2 posturas, 2 preliminares, 2 juguetes y 2 juegos. Nada es obligatorio: si no tienes juguete, sáltalo.',
 howMany:'¿Cuántos días queréis jugar?', whoPicks:'¿Quién prepara cada día?', day:n=>`Día ${n}`, me:'Yo', them:'Mi amor',
 start:'Empezar el reto', restart:'Empezar de nuevo', restartQ:'Toca otra vez para confirmar: el reto actual se borrará.',
 youPick:'Tú preparas', theyPick:'Tu amor prepara', tapBuild:'Toca para preparar tu día', building:'Tu amor lo está preparando…', empty:'Nada elegido todavía',
 doneT:'Hecho ✓', markDone:'Marcar como hecho', undone:'Desmarcar',
 editTitle:n=>`Preparar el día ${n}`, editLead:'Toca los cuadritos para elegir. Hasta 2 de cada tipo (posturas, preliminares, juguetes y juegos). No hace falta elegir de todo: solo lo que tenga sentido para vosotros. Cada cuadrito muestra qué es, para que lo sepas aunque nunca lo hayas hecho.', others:'Otras opciones', all:'Todas las opciones',
 cats:{pos:'Posturas',pre:'Preliminares',toy:'Juguetes',game:'Juegos'}, max2:'Máximo 2 de este tipo. Desmarca uno para cambiar.',
 fromWish:'De tu lista de deseos', saveDay:'Listo, enviar a mi amor', needOne:'Elige al menos 1 cosa para el día.', saved:'Día enviado a tu amor 💞',
 theyBuilt:n=>`Tu amor preparó el día ${n} 🔥`, cmYou:'Tu comentario', cmThem:'Comentario de tu amor', cmPh:'Comenta este día…', cmBtn:'Comentar',
 see3d:'Ver en 3D', dayB:'Durante el día', actB:'En el momento', bdsmTag:'BDSM', progress:(a,b)=>`${a} de ${b} días hechos`,
 loveTitle:'Para mi <em>amor</em>', loveLead:'Un rincón tranquilo, sin prisa. Elige un mensaje, déjalo a tu manera y envíalo. Llega solo aquí dentro de la app.',
 loveTabs:['Enviar','Nuestros mensajes'], msgPh:'Escribe o edita tu mensaje…', send:'Enviar a mi amor', sent:'Mensaje enviado 💌', writeOwn:'O escribe el tuyo',
 youSent:'Tú enviaste', theySent:'Tu amor envió', reply:'Responder', replyPh:'Responde con cariño…', noMsgs:'Todavía no hay mensajes.',
 lcats:{night:'Gracias por la noche',love:'Te amo',praise:'Un elogio',miss:'Te extraño',day:'Buenos días y buenas noches',sorry:'Perdón'}
}};
const HXT=()=>HX[lang];

const LOVEMSG={
 pt:{night:['Obrigada pela noite de ontem. Ainda tô sorrindo.','Acordei pensando em você e em tudo o que a gente viveu ontem. Obrigada por cuidar de mim.','Ontem foi especial. Amo a nossa intimidade.','Obrigada pela paciência e pelo carinho de ontem. Me senti muito amada.'],
  love:['Eu te amo. Só isso, só queria que você soubesse agora.','Escolheria você de novo, todos os dias.','Você é o meu lugar seguro.','Obrigada por ser meu parceiro em tudo.'],
  praise:['Você estava lindo hoje. Fiquei te olhando de longe.','Admiro muito o homem que você é.','Seu abraço resolve o meu dia.','Tenho orgulho de você, sabia?'],
  miss:['Tô com saudade de você. Volta logo pra casa.','O dia fica comprido sem você.','Contando as horas pra te abraçar.','Saudade do seu cheiro.'],
  day:['Bom dia, amor. Que seu dia seja leve.','Boa noite. Dorme sabendo que é muito amado.','Bom dia! Já tô com saudade de você.','Boa noite, meu amor. Obrigada por mais um dia juntos.'],
  sorry:['Desculpa por hoje. Eu te amo e quero conversar com calma.','Eu errei. Me perdoa? Você é importante demais pra mim.','Desculpa ter sido dura. Vamos fazer as pazes?','Quero resolver isso com você, não contra você.']},
 es:{night:['Gracias por lo de anoche. Todavía sonrío.','Me desperté pensando en ti y en todo lo que vivimos anoche. Gracias por cuidarme.','Anoche fue especial. Me encanta nuestra intimidad.','Gracias por la paciencia y el cariño de anoche. Me sentí muy amada.'],
  love:['Te amo. Solo eso, quería que lo supieras ahora.','Te elegiría otra vez, todos los días.','Eres mi lugar seguro.','Gracias por ser mi compañero en todo.'],
  praise:['Hoy estabas guapísimo. Me quedé mirándote de lejos.','Admiro mucho al hombre que eres.','Tu abrazo me arregla el día.','Estoy orgullosa de ti, ¿sabías?'],
  miss:['Te extraño. Vuelve pronto a casa.','El día se hace largo sin ti.','Contando las horas para abrazarte.','Extraño tu olor.'],
  day:['Buenos días, amor. Que tu día sea ligero.','Buenas noches. Duerme sabiendo que eres muy amado.','¡Buenos días! Ya te extraño.','Buenas noches, mi amor. Gracias por otro día juntos.'],
  sorry:['Perdón por lo de hoy. Te amo y quiero hablarlo con calma.','Me equivoqué. ¿Me perdonas? Eres demasiado importante para mí.','Perdón por haber sido dura. ¿Hacemos las paces?','Quiero resolverlo contigo, no contra ti.']}};
const LOVEREPLY={pt:['❤️ Também te amo. Muito.','Você me ganhou o dia.','Li e sorri sozinho aqui.','Obrigado por existir na minha vida.'],es:['❤️ Yo también te amo. Mucho.','Me alegraste el día.','Lo leí y sonreí solo aquí.','Gracias por existir en mi vida.']};
const CHCMT={pt:['Mal posso esperar 🔥','Gostei muito da sua escolha.','Esse dia vai ser bom demais.'],es:['No puedo esperar 🔥','Me encantó tu elección.','Este día va a ser buenísimo.']};

// ---------- estado ----------
S.gx=null;
S.ch={stage:'setup',n:3,who:['me','them','me'],d:[],edit:null,cat:'pos',sel:null,confirm:false};
S.lv={tab:'send',cat:'night',draft:'',msgs:[{from:'them',text:lang==='es'?'Gracias por ser mi compañera. Te amo.':'Obrigado por ser minha companheira. Te amo.',reply:''}],rdraft:{}};

// ---------- guia ----------
const GUIDE={
 pt:{
  ask:['Pergunte sem vergonha','Uma caixinha anônima pra perguntar o que você nunca teve coragem.',['Pergunte pras mulheres, pros homens ou pros dois.','Ninguém sabe quem você é: sem nome, sem foto.','Cada pergunta recebe até 3 respostas. Depois disso, ela sai do mural.','As respostas podem ser por texto ou por áudio de no máximo 30 segundos.','Você pode pedir mais detalhes pra quem respondeu, no máximo 2 vezes por resposta.','Você também pode ajudar: nos murais, responda as perguntas de outras pessoas.','Regras claras: pode falar das partes do corpo, sem palavrão, sem link e sem telefone.']],
  wish:['Lista de desejos','Tudo o que você quer experimentar, num lugar só.',['Em cada posição, preliminar e brinquedo tem o botão “Adicionar à lista de desejos”.','Só você vê a sua lista.','Na aba “Deu match” aparece o que está na lista dos dois.','Você escolhe o que revelar pro seu amor na Conversa.']],
  games:['Sala de jogos','Jogos pra fazer a dois, cada um no seu celular.',['Cinco jogos diferentes, explicados um por um abaixo.','Toda sexta tem jogo novo em destaque.','As conversas dos jogos se apagam sozinhas em 24 horas.']],
  diary:['Diário das posições','O registro do que vocês já fizeram.',['Quando marca uma posição como feita, ela vem pra cá.','Na aba “Minhas”, você dá nota e escreve o que achou. Só você vê.','Na aba “Compartilhado”, manda pro seu amor e cada um comenta uma vez.']],
  talk:['Conversar','Pra puxar o assunto sem ficar sem graça.',['Mande uma provocação pronta ou escreva a sua.','Revele um desejo da sua lista: ele recebe como surpresa.','Tudo se apaga em 24 horas.']],
  pos:['Posições em 3D','60 posições com bonecos em 3D, e uma nova toda semana.',['Divididas em pra ela, pra ele e pros dois, e por nível: iniciante, intermediário e avançado.','Gire o boneco com o dedo pra ver de todo ângulo.','Cada posição tem o passo a passo de como se posicionar e dicas pra ela e pra ele.','Bolinhas mostram o prazer dela, o prazer dele, a intensidade, o esforço e a intimidade.','Botões: “Adicionar à lista de desejos” (quero fazer um dia), “Já fizemos” (vai pro diário) e compartilhar com seu amor.']],
  fore:['Preliminares','Ideias pra ela e pra ele, durante o dia e na hora H.',['“Durante o dia”: provocações fora da cama, como um beijo na parede ou um toque no carro.','“Na hora do ato”: oral, toques, anal, com dicas de como fazer.','Junte várias e mande pro seu amor de uma vez, com uma mensagem.','Mande como pedido (ele vê o que é) ou como surpresa (ele só sabe que tem algo).']],
  toys:['Brinquedos','Um guia pra entender cada tipo de brinquedo antes de comprar.',['Separados pra ela, pra ele e pro casal, por parte do corpo.','Cada um tem modelo 3D, notas de intensidade e rapidez, e o passo a passo de como usar.','A área de BDSM fica fechada: só abre se você tocar.','“Pedir orçamento”: uma consultora compra por você e entrega em embalagem discreta.']],
  heat:['Esquentar a relação','Pra sair da rotina, com calma.',['Desafio do casal: de 1 a 7 dias, vocês dividem quem monta cada dia e cada um escolhe até 2 posições, preliminares, brinquedos e jogos.','Os dois comentam cada dia e marcam quando fizeram.','Pro meu amor: mensagens de carinho prontas pra agradecer, elogiar, dizer que ama ou pedir desculpa.']],
  bdsm:['BDSM com segurança','Pra quem quer explorar com limites e cuidado.',['Como combinar limites e palavra de segurança.','O semáforo: verde continua, amarelo vai devagar, vermelho para.','Cuidados antes, durante e depois.']],
  acc:['Minha conta','Tudo da sua conta, com discrição.',['Trocar o PIN que protege o app.','Mudar o idioma (português ou espanhol).','Ver e gerenciar a assinatura do casal.']]},
 es:{
  ask:['Pregunta sin vergüenza','Un buzón anónimo para preguntar lo que nunca te atreviste.',['Pregunta a las mujeres, a los hombres o a los dos.','Nadie sabe quién eres: sin nombre, sin foto.','Cada pregunta recibe hasta 3 respuestas. Después, sale del muro.','Las respuestas pueden ser por texto o por audio de máximo 30 segundos.','Puedes pedir más detalles a quien respondió, como máximo 2 veces por respuesta.','También puedes ayudar: en los muros, responde las preguntas de otras personas.','Reglas claras: se puede hablar de las partes del cuerpo, sin palabrotas, sin enlaces y sin teléfono.']],
  wish:['Lista de deseos','Todo lo que quieres probar, en un solo lugar.',['En cada postura, preliminar y juguete está el botón “Añadir a la lista de deseos”.','Solo tú ves tu lista.','En la pestaña “Match” aparece lo que está en la lista de los dos.','Tú eliges qué revelar a tu amor en la Conversación.']],
  games:['Sala de juegos','Juegos para hacer a dos, cada uno en su móvil.',['Cinco juegos distintos, explicados uno por uno abajo.','Cada viernes hay un juego nuevo destacado.','Las conversaciones de los juegos se borran solas en 24 horas.']],
  diary:['Diario de posturas','El registro de lo que ya hicisteis.',['Cuando marcas una postura como hecha, viene aquí.','En “Mías”, le das nota y escribes qué te pareció. Solo tú lo ves.','En “Compartido”, se lo envías a tu amor y cada uno comenta una vez.']],
  talk:['Conversar','Para sacar el tema sin vergüenza.',['Envía una provocación lista o escribe la tuya.','Revela un deseo de tu lista: le llega como sorpresa.','Todo se borra en 24 horas.']],
  pos:['Posturas en 3D','60 posturas con muñecos en 3D, y una nueva cada semana.',['Divididas en para ella, para él y para los dos, y por nivel: principiante, intermedio y avanzado.','Gira el muñeco con el dedo para verlo desde todos los ángulos.','Cada postura tiene el paso a paso para colocarse y consejos para ella y para él.','Los puntos muestran el placer de ella, el de él, la intensidad, el esfuerzo y la intimidad.','Botones: “Añadir a la lista de deseos” (quiero hacerla algún día), “Ya la hicimos” (va al diario) y compartir con tu amor.']],
  fore:['Preliminares','Ideas para ella y para él, durante el día y en el momento.',['“Durante el día”: provocaciones fuera de la cama, como un beso contra la pared o una caricia en el coche.','“En el momento”: oral, caricias, anal, con consejos de cómo hacerlo.','Junta varias y envíalas a tu amor de una vez, con un mensaje.','Envíalas como petición (él ve qué es) o como sorpresa (solo sabe que hay algo).']],
  toys:['Juguetes','Una guía para entender cada tipo de juguete antes de comprar.',['Separados para ella, para él y para la pareja, por zona del cuerpo.','Cada uno tiene modelo 3D, notas de intensidad y rapidez, y el paso a paso para usarlo.','La zona BDSM está cerrada: solo se abre si la tocas.','“Pedir presupuesto”: una asesora lo compra por ti y te llega en un paquete discreto.']],
  heat:['Encender la relación','Para salir de la rutina, con calma.',['Reto de pareja: de 1 a 7 días, os repartís quién prepara cada día y cada uno elige hasta 2 posturas, preliminares, juguetes y juegos.','Los dos comentan cada día y lo marcan cuando lo hicieron.','Para mi amor: mensajes de cariño listos para agradecer, elogiar, decir te amo o pedir perdón.']],
  bdsm:['BDSM con seguridad','Para quien quiere explorar con límites y cuidado.',['Cómo acordar límites y palabra de seguridad.','El semáforo: verde sigue, amarillo más despacio, rojo se para.','Cuidados antes, durante y después.']],
  acc:['Mi cuenta','Todo de tu cuenta, con discreción.',['Cambiar el PIN que protege la app.','Cambiar el idioma (portugués o español).','Ver y gestionar la suscripción de la pareja.']]}
};
const GUIDE_GAMES={
 pt:{scene:'Vocês recebem um cenário (ex.: “quarto de hotel”) e constroem uma história juntos, uma frase cada um, em turnos, até o finalmente. Se travar, o botão “me dá uma ideia” sugere frases.',
  plan:'Cada um marca, sozinho, o que topa fazer hoje. Dá pra ver outras opções e escrever ideias suas. Depois que os dois enviam, aparece o que os dois marcaram, mais as ideias escritas. Ninguém fica sabendo do que o outro não quis.',
  like:'Uma corrente de confissões: cada um completa “Eu gosto quando você…”. No fim, vocês veem o mapa do prazer dos dois.',
  tod:'Em cada rodada, quem vai responder escolhe: verdade ou desafio. Quem pergunta recebe 3 opções do acervo (pode girar pra ver outras) e manda uma. Verdade se responde escrevendo; desafio, aceita ou não. Depois as posições trocam.',
  tease:'Escolha uma provocação pronta ou escreva a sua. Chega no celular dele na hora, como notificação.'},
 es:{scene:'Recibís un escenario (ej.: “habitación de hotel”) y construís una historia juntos, una frase cada uno, por turnos, hasta el final. Si os atascáis, el botón “dame una idea” sugiere frases.',
  plan:'Cada uno marca, a solas, lo que se anima a hacer hoy. Se pueden ver otras opciones y escribir ideas propias. Cuando los dos envían, aparece lo que marcaron los dos, más las ideas escritas. Nadie se entera de lo que el otro no quiso.',
  like:'Una cadena de confesiones: cada uno completa “Me gusta cuando tú…”. Al final, veis el mapa del placer de los dos.',
  tod:'En cada ronda, quien va a responder elige: verdad o reto. Quien pregunta recibe 3 opciones del acervo (puede girar para ver otras) y envía una. La verdad se responde por escrito; el reto, se acepta o no. Después se cambian los papeles.',
  tease:'Elige una provocación lista o escribe la tuya. Le llega al móvil al momento, como notificación.'}};
const GUIDE_ORDER=['ask','wish','games','diary','talk','pos','fore','toys','heat','bdsm','acc'];

// prévia: renderiza a tela de verdade, em miniatura e sem clique
function pvHTML(fn){const bak=Object.assign({},S);let h='';try{h=fn()}catch(e){h=''}for(const k of Object.keys(S))if(!(k in bak))delete S[k];Object.assign(S,bak);
  h=h.replace(/ id="[^"]*"/g,'').replace(/<button type="button" class="back"[^>]*>.*?<\/button>/,'');
  return h?`<div class="pvbox" aria-hidden="true"><div class="pvin">${h}</div></div>`:''}
const PV={
 ask:()=>R.ask(), wish:()=>{S.wtab='mine';S.wmode=null;S.wexp=null;return R.wish()}, games:()=>{S.free=false;S.gm=Object.assign({},S.gm,{game:null});return R.games()},
 diary:()=>{S.dtab='mine';return R.diary()}, talk:()=>{S.tk=Object.assign({},S.tk,{mode:null});return R.talk()}, pos:()=>{S.pcat='f';S.plv=0;return R.posl()},
 fore:()=>{S.prew='f';S.preb='day';S.pexp=null;S.tray=[];S.compose=false;return R.pre()}, toys:()=>{S.toyw='f';S.texp='suction';S.bdx=false;return R.toys()},
 heat:()=>R.heat(), bdsm:null, acc:null};
const PVG={
 scene:()=>{S.gm=Object.assign({},S.gm,{game:'scene',ended:false,ideas:false,turn:'me',chat:[{who:'me',text:lang==='es'?'Abro la puerta de la habitación y te veo esperándome…':'Abro a porta do quarto e te vejo me esperando…'},{who:'them',text:lang==='es'?'Me acerco despacio y te beso el cuello.':'Chego devagar e beijo seu pescoço.'}]});S.gdraft='';return R.games()},
 plan:()=>{S.gm=Object.assign({},S.gm,{game:'plan',plan:{sel:{},stage:'pick'}});return R.games()},
 like:()=>{S.gm=Object.assign({},S.gm,{game:'like',ended:false,turn:'me',chat:[{who:'me',text:lang==='es'?'Me gusta cuando me besas despacio.':'Eu gosto quando você me beija devagar.'}]});S.gdraft='';return R.games()},
 tod:()=>{S.gm=Object.assign({},S.gm,{game:'tod',tod:{lv:1,kind:null,i:0,skip:true,theirs:null,stage:'pick'}});return R.games()},
 tease:()=>{S.gm=Object.assign({},S.gm,{game:'tease',tease:{sel:0,sent:false}});S.gdraft='';return R.games()}};

R.guide=function(){const H=HXT(),G=GUIDE[lang];
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${H.guideTitle}</h2><p>${H.guideLead}</p>
  <div class="gdgrid">${GUIDE_ORDER.map(k=>`<button type="button" class="gdtile ${S.gx===k?'on':''}" data-hx="gx:${k}"><span class="ic">${ic(k,26)}</span><strong>${G[k][0]}</strong><span>${G[k][1]}</span></button>`).join('')}</div></section>`};
R.guided=function(){const H=HXT(),k=S.gx,x=GUIDE[lang][k],GT2=GT[lang];
  const pv=PV[k]?pvHTML(PV[k]):`<div class="pvbox soon"><span class="tagc gold">${H.soonT}</span></div>`;
  let games='';
  if(k==='games')games=`<div class="sec-t">${H.gamesEach}</div>${Object.keys(PVG).map(g=>`<div class="gdgame"><div class="gdgh"><span class="gic">${ic(GIC[g],20)}</span><strong>${GT2.games[g][0]}</strong></div><p>${GUIDE_GAMES[lang][g]}</p>${pvHTML(PVG[g])}</div>`).join('')}`;
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button>
  <div class="gdhead"><span class="ic">${ic(k,28)}</span><div><h2>${x[0]}</h2><p>${x[1]}</p></div></div>
  <div class="sec-t">${H.preview}</div>${pv}
  <div class="sec-t">${H.inside}</div><ul class="gdlist">${x[2].map(b=>`<li>${ic('check',16)}<span>${b}</span></li>`).join('')}</ul>${games}</section>`};

// ---------- Esquentar ----------
R.heat=function(){const H=HXT();
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${H.heatTitle}</h2>
  <div class="glist"><button type="button" class="gcard" data-hx="go:chal"><span class="gic">${ic('chal',24)}</span><span class="gbody"><strong>${H.chalCard[0]}</strong><span>${H.chalCard[1]}</span></span></button>
  <button type="button" class="gcard" data-hx="go:love"><span class="gic">${ic('love',24)}</span><span class="gbody"><strong>${H.loveCard[0]}</strong><span>${H.loveCard[1]}</span></span></button></div></section>`};

function chItems(){const wl=S.wl,H=HXT(),mk=(c,id,name,tag,pic,desc)=>({k:c+':'+id,name,tag,pic,desc,w:wl.has(c+':'+id)});
  return {pos:POS.map(x=>mk('pos',x.id,x[lang][0],`<span class="lvd l${x.lv}"></span>`,`<span class="wthumb"><img data-thumb="${x.id}" alt="" ${THUMBS[x.id]?`src="${THUMBS[x.id]}" class="ok"`:''}></span>`,x[lang][1])),
   pre:PRE.map(x=>mk('pre',x.id,x[lang][0],`<small class="ctag">${x.b==='day'?H.dayB:H.actB}</small>`,`<span class="wtic">${ic(x.b==='day'?DTIC[x.t]:PTIC[x.t],34)}</span>`,x[lang][1])),
   toy:TOYS.map(x=>mk('toy',x.id,x[lang][0],x.who==='x'?`<small class="ctag">${H.bdsmTag}</small>`:'',`<span class="wtic">${toyPic(x.svg,90)}</span>`,x[lang][1])),
   game:Object.entries(GT[lang].games).map(([id,v])=>({k:'game:'+id,name:v[0],tag:'',pic:`<span class="wtic">${ic(GIC[id],34)}</span>`,desc:GUIDE_GAMES[lang][id],w:false}))}}
function chName(k){const [c,id]=k.split(':');if(c==='game')return GT[lang].games[id][0];if(c==='pos'){const x=POS.find(p=>p.id===id);return x?x[lang][0]:id}
  if(c==='pre'){const x=PRE.find(p=>p.id===id);return x?x[lang][0]:id}const x=TOYS.find(p=>p.id===id);return x?x[lang][0]:id}
const CHIC={pos:'pos',pre:'fore',toy:'toys',game:'games'};
function dayList(d){const H=HXT();const all=['pos','pre','toy','game'].flatMap(c=>d[c].map(k=>k));
  if(!all.length)return `<p class="hint">${H.empty}</p>`;
  return `<div class="chitems">${all.map(k=>{const c=k.split(':')[0];return `<div class="chit">${ic(CHIC[c],16)}<span>${chName(k)}</span>${c==='pos'?`<button type="button" class="btn link sm" data-pid="${k.split(':')[1]}">${H.see3d}</button>`:''}</div>`}).join('')}</div>`}

R.chal=function(){const H=HXT(),c=S.ch;
  const head=`<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${H.chalTitle}</h2>`;
  if(c.edit!=null){const d=c.sel,cats=['pos','pre','toy','game'],it=chItems()[c.cat].slice().sort((a,b)=>b.w-a.w);
    return `<section class="screen"><button type="button" class="back" data-hx="edcancel">${t().w.back}</button><h2>${H.editTitle(c.edit+1)}</h2><div class="note">${H.editLead}</div>
    <div class="seg chseg" role="group">${cats.map(k=>`<button type="button" class="seg-b" data-hx="cat:${k}" aria-pressed="${c.cat===k}">${H.cats[k]} <b class="cnt">${d[k].length}/2</b></button>`).join('')}</div>
    ${(()=>{const tile=x=>{const on=d[c.cat].includes(x.k);return `<button type="button" class="chtile ${on?'on':''}" data-chk="${x.k}" aria-pressed="${on}">${x.pic}${on?`<span class="chck">${ic('check',16)}</span>`:''}<span class="wtt">${x.tag} ${x.name}</span><span class="chd">${x.desc||''}</span></button>`};
      const w=it.filter(x=>x.w),r=it.filter(x=>!x.w);
      return `${w.length?`<div class="sec-t" style="color:var(--honey)">${ic('wish',14)} ${H.fromWish}</div><div class="chgrid">${w.map(tile).join('')}</div>`:''}<div class="sec-t">${w.length?H.others:H.all}</div><div class="chgrid">${r.map(tile).join('')}</div>`})()}
    <div class="traybar"><span>${cats.reduce((n,k)=>n+d[k].length,0)} ${lang==='es'?'elegidos':'escolhidos'}</span><button type="button" class="btn pri sm" data-hx="edsave">${H.saveDay}</button></div></section>`}
  if(c.stage==='setup'){
    return `${head}<div class="note">${H.chalHow}</div>
    <div class="sec-t">${H.howMany}</div><div class="chips">${[1,2,3,4,5,6,7].map(n=>`<button type="button" class="chip" data-hx="n:${n}" aria-pressed="${c.n===n}">${n}</button>`).join('')}</div>
    <div class="sec-t">${H.whoPicks}</div><div class="chwho">${c.who.slice(0,c.n).map((w,i)=>`<div class="chwr"><strong>${H.day(i+1)}</strong><div class="opts"><button type="button" class="opt" data-hx="who:${i}:me" aria-pressed="${w==='me'}">${H.me}</button><button type="button" class="opt" data-hx="who:${i}:them" aria-pressed="${w==='them'}">${H.them}</button></div></div>`).join('')}</div>
    <button type="button" class="btn pri" data-hx="start">${H.start}</button></section>`}
  const done=c.d.filter(d=>d.done).length;
  return `${head}<span class="tagc gold" style="align-self:flex-start">${H.progress(done,c.d.length)}</span>
  ${c.d.map((d,i)=>{const mine=d.who==='me',filled=d.sent;
    return `<div class="chday ${d.done?'done':''}"><div class="chdh"><strong>${H.day(i+1)}</strong><span class="tagc">${mine?H.youPick:H.theyPick}</span>${d.done?`<span class="tagc gold">${H.doneT}</span>`:''}</div>
    ${!filled?(mine?`<button type="button" class="btn ghost" data-hx="edit:${i}">${ic('chal',16)} ${H.tapBuild}</button>`:`<p class="hint">${H.building}</p>`):dayList(d)}
    ${filled?`<div class="row">${mine&&!d.done?`<button type="button" class="btn ghost sm" data-hx="edit:${i}">${lang==='es'?'Editar':'Editar'}</button>`:''}<button type="button" class="btn ${d.done?'ghost':'gold'} sm" data-hx="done:${i}">${d.done?H.undone:H.markDone}</button></div>
    <div class="cmts">${d.cm.me?`<div class="cmt me"><small>${H.cmYou}</small>${esc(d.cm.me)}</div>`:`<div class="cmrow"><input data-chcm="${i}" placeholder="${H.cmPh}" value="${esc((S.chcmd||{})[i]||'')}"><button type="button" class="btn ghost sm" data-hx="cm:${i}">${H.cmBtn}</button></div>`}
    ${d.cm.them?`<div class="cmt them"><small>${H.cmThem}</small>${esc(d.cm.them)}</div>`:''}</div>`:''}</div>`}).join('')}
  <button type="button" class="btn link" data-hx="restart">${c.confirm?H.restartQ:H.restart}</button></section>`};

function partnerBuild(i){setTimeout(()=>{const d=S.ch.d[i];if(!d||d.sent)return;const pk=a=>a[Math.floor(Math.random()*a.length)];
  const fav=POS.filter(x=>x.lv<3);d.pos=[ 'pos:'+pk(fav).id ];d.pre=['pre:'+pk(PRE.filter(x=>x.b==='act')).id,'pre:'+pk(PRE.filter(x=>x.b==='day')).id];if(Math.random()<.6)d.game=['game:'+pk(['tod','scene','like'])];d.sent=true;
  if(S.screen==='chal')render();toast(HXT().theyBuilt(i+1))},1600+i*900)}

R.love=function(){const H=HXT(),v=S.lv;
  const tabs=`<div class="seg" role="group">${['send','box'].map((k,i)=>`<button type="button" class="seg-b" data-hx="ltab:${k}" aria-pressed="${v.tab===k}">${H.loveTabs[i]}${k==='box'?` <b class="cnt">${v.msgs.length}</b>`:''}</button>`).join('')}</div>`;
  let body='';
  if(v.tab==='send'){body=`<div class="chips">${Object.entries(H.lcats).map(([k,l])=>`<button type="button" class="chip" data-hx="lcat:${k}" aria-pressed="${v.cat===k}">${l}</button>`).join('')}</div>
    <div class="plist2">${LOVEMSG[lang][v.cat].map((m,i)=>`<button type="button" class="lvmsg ${v.draft===m?'on':''}" data-hx="lpick:${i}">${m}</button>`).join('')}</div>
    <div class="sec-t">${H.writeOwn}</div><textarea id="lvd" rows="3" placeholder="${H.msgPh}">${esc(v.draft)}</textarea>
    <button type="button" class="btn pri" data-hx="lsend">${ic('love',16)} ${H.send}</button>`}
  else body=v.msgs.length?v.msgs.slice().reverse().map(m=>{const i=v.msgs.indexOf(m);return `<div class="lvcard ${m.from}"><small>${m.from==='me'?H.youSent:H.theySent}</small><p>${esc(m.text)}</p>
    ${m.reply?`<div class="cmt ${m.from==='me'?'them':'me'}"><small>${m.from==='me'?H.cmThem:H.cmYou}</small>${esc(m.reply)}</div>`:(m.from==='them'?`<div class="cmrow"><input data-lvr="${i}" placeholder="${H.replyPh}" value="${esc(v.rdraft[i]||'')}"><button type="button" class="btn ghost sm" data-hx="lrep:${i}">${H.reply}</button></div>`:'')}</div>`}).join(''):`<p class="empty">${H.noMsgs}</p>`;
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${H.loveTitle}</h2><p>${H.loveLead}</p>${tabs}${body}</section>`};

// ---------- eventos ----------
document.addEventListener('click',e=>{const b=e.target.closest('[data-hx]');if(!b)return;const [a,p,q]=b.dataset.hx.split(':');const c=S.ch,v=S.lv,H=HXT();
  switch(a){
   case 'gx':S.gx=p;go('guided');break;
   case 'go':if(p==='chal'){c.edit=null}go(p);break;
   case 'n':c.n=+p;while(c.who.length<c.n)c.who.push(c.who.length%2?'them':'me');render();break;
   case 'who':c.who[+p]=q;render();break;
   case 'start':c.d=c.who.slice(0,c.n).map(w=>({who:w,pos:[],pre:[],toy:[],game:[],sent:false,done:false,cm:{me:'',them:''}}));c.stage='run';c.confirm=false;render();c.d.forEach((d,i)=>{if(d.who==='them')partnerBuild(i)});break;
   case 'restart':if(!c.confirm){c.confirm=true;render();break}c.stage='setup';c.d=[];c.confirm=false;render();break;
   case 'edit':{const d=c.d[+p];c.edit=+p;c.cat='pos';c.sel={pos:[...d.pos],pre:[...d.pre],toy:[...d.toy],game:[...d.game]};render();window.scrollTo(0,0);break}
   case 'cat':c.cat=p;render();break;
   case 'edcancel':c.edit=null;render();break;
   case 'edsave':{const s=c.sel;if(!(s.pos.length+s.pre.length+s.toy.length+s.game.length)){toast(H.needOne);break}Object.assign(c.d[c.edit],s,{sent:true});c.edit=null;render();window.scrollTo(0,0);toast(H.saved);break}
   case 'done':c.d[+p].done=!c.d[+p].done;render();break;
   case 'cm':{const i=+p,tx=((S.chcmd||{})[i]||'').trim();if(!tx)break;c.d[i].cm.me=tx;delete S.chcmd[i];render();setTimeout(()=>{if(!c.d[i])return;c.d[i].cm.them=CHCMT[lang][i%3];if(S.screen==='chal')render();toast(CT().theyCmt)},1500);break}
   case 'ltab':v.tab=p;render();break;
   case 'lcat':v.cat=p;v.draft='';render();break;
   case 'lpick':v.draft=LOVEMSG[lang][v.cat][+p];render();break;
   case 'lsend':{const tx=v.draft.trim();if(!tx)break;v.msgs.push({from:'me',text:tx,reply:''});v.draft='';v.tab='box';render();toast(H.sent);const m=v.msgs[v.msgs.length-1];setTimeout(()=>{m.reply=LOVEREPLY[lang][Math.floor(Math.random()*4)];if(S.screen==='love')render()},2000);break}
   case 'lrep':{const i=+p,tx=(v.rdraft[i]||'').trim();if(!tx)break;v.msgs[i].reply=tx;delete v.rdraft[i];render();break}
  }});
document.addEventListener('click',e=>{const x=e.target.closest('[data-chk]');if(!x)return;const c=S.ch,k=x.dataset.chk,arr=c.sel[k.split(':')[0]],j=arr.indexOf(k);
  if(j>-1)arr.splice(j,1);else{if(arr.length>=2){toast(HXT().max2);return}arr.push(k)}
  const y=window.scrollY;render();window.scrollTo(0,y)});
document.addEventListener('input',e=>{const t2=e.target;if(t2.dataset.chcm!=null){S.chcmd=S.chcmd||{};S.chcmd[t2.dataset.chcm]=t2.value}else if(t2.id==='lvd')S.lv.draft=t2.value;else if(t2.dataset.lvr!=null)S.lv.rdraft[t2.dataset.lvr]=t2.value});
T.pt.tiles.guide=HX.pt.guideTile;T.es.tiles.guide=HX.es.guideTile;T.pt.tiles.heat[2]=HX.pt.heatSub;T.es.tiles.heat[2]=HX.es.heatSub;
if(typeof S!=='undefined'&&S.screen==='home')render();
