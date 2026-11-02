// BDSM com segurança
const BDP=[ // id, nível, dor 0-5, ícone, brinquedo relacionado
 {id:'venda',lv:1,d:0,ic:'lock',toy:'blind',
  pt:['Venda nos olhos','Ela fica sem ver. Cada toque vira surpresa e fica muito mais forte.',['Combinem a palavra de segurança antes.','Coloque a venda e comece devagar: beijo no pescoço, mãos nas costas, respiração perto da orelha.','Faça pausas entre um toque e outro. A expectativa é o que esquenta.'],'Nunca deixe quem está vendada sozinha nem levante sem avisar.'],
  es:['Venda en los ojos','Ella no ve. Cada caricia es una sorpresa y se siente mucho más.',['Acordad la palabra de seguridad antes.','Pon la venda y empieza despacio: besos en el cuello, manos en la espalda, la respiración cerca de la oreja.','Haz pausas entre una caricia y otra. La expectativa es lo que enciende.'],'Nunca dejes sola a quien tiene los ojos vendados ni te levantes sin avisar.']},
 {id:'maos',lv:1,d:0,ic:'lock',toy:'cuffs',
  pt:['Mãos presas','Prender as mãos de um jeito leve, com algema forrada ou uma faixa macia.',['Prenda os pulsos na frente do corpo ou na cabeceira, sem apertar: tem que caber um dedo.','Pergunte de vez em quando se as mãos estão formigando.','Comece com 10 minutos e vá aumentando aos poucos.'],'Formigou, ficou dormente, frio ou roxo? Solte na hora. Nunca use corda fina, fio ou abraçadeira de plástico.'],
  es:['Manos atadas','Sujetar las manos de forma suave, con esposas forradas o una cinta blanda.',['Ata las muñecas delante del cuerpo o al cabecero, sin apretar: tiene que caber un dedo.','Pregunta de vez en cuando si las manos hormiguean.','Empieza con 10 minutos y ve subiendo poco a poco.'],'¿Hormigueo, adormecimiento, frío o color morado? Suelta enseguida. Nunca uses cuerda fina, cable ni bridas de plástico.']},
 {id:'ordens',lv:1,d:0,ic:'talk',
  pt:['Quem manda hoje','Um dos dois dá as ordens e o outro obedece. Pode ser ele ou ela.',['Combinem antes quem manda e até onde as ordens podem ir.','Comece com ordens simples: “fica parada”, “olha pra mim”, “só pode me tocar quando eu deixar”.','Quem obedece pode usar a palavra de segurança a qualquer momento.'],'Ordem não é humilhação. Se algo machucar de verdade, por dentro ou por fora, para.'],
  es:['Quién manda hoy','Uno da las órdenes y el otro obedece. Puede ser él o ella.',['Acordad antes quién manda y hasta dónde pueden llegar las órdenes.','Empieza con órdenes sencillas: “quédate quieta”, “mírame”, “solo puedes tocarme cuando yo te deje”.','Quien obedece puede usar la palabra de seguridad en cualquier momento.'],'Una orden no es humillación. Si algo hace daño de verdad, por dentro o por fuera, se para.']},
 {id:'nega',lv:1,d:0,ic:'heat',
  pt:['Provocar e não deixar gozar','Levar até perto do orgasmo, parar e começar de novo. O orgasmo no final fica muito mais forte.',['Estimule até a pessoa avisar que está perto.','Pare, espere a respiração acalmar e recomece.','Repita 3 ou 4 vezes antes de deixar gozar.'],'Combinem antes se no fim vai ter orgasmo ou não, pra ninguém se frustrar.'],
  es:['Provocar y no dejar llegar','Llevar hasta cerca del orgasmo, parar y volver a empezar. El orgasmo final es mucho más intenso.',['Estimula hasta que la otra persona avise que está cerca.','Para, espera a que la respiración se calme y vuelve a empezar.','Repite 3 o 4 veces antes de dejar llegar.'],'Acordad antes si al final habrá orgasmo o no, para que nadie se frustre.']},
 {id:'temp',lv:1,d:1,ic:'fore',
  pt:['Gelo e calor','Alternar a sensação do gelo com a da boca quente.',['Passe um cubo de gelo devagar pelo pescoço, seios e barriga.','Logo depois, passe a boca quente no mesmo caminho.','Combine com a venda pra ficar mais intenso.'],'Não deixe o gelo parado no mesmo lugar por muito tempo e não coloque gelo dentro do corpo.'],
  es:['Hielo y calor','Alternar la sensación del hielo con la de la boca caliente.',['Pasa un cubito de hielo despacio por el cuello, los senos y el vientre.','Justo después, pasa la boca caliente por el mismo camino.','Combínalo con la venda para que sea más intenso.'],'No dejes el hielo quieto en el mismo sitio mucho tiempo ni lo metas dentro del cuerpo.']},
 {id:'tapas',lv:1,d:2,ic:'toys',toy:'paddle',
  pt:['Tapas no bumbum','Tapas com a mão aberta, que esquentam a pele e o clima.',['Só no bumbum e na parte de trás das coxas.','Comece com tapinhas leves e carinho. Vá aumentando só se ela pedir.','Mão em concha faz mais barulho e dói menos.'],'Nunca no rosto, na coluna, nos rins (parte de baixo das costas) ou nas articulações.'],
  es:['Azotes en los glúteos','Azotes con la mano abierta, que calientan la piel y el ambiente.',['Solo en los glúteos y la parte de atrás de los muslos.','Empieza con palmaditas suaves y caricias. Sube solo si ella lo pide.','La mano en forma de cuenco hace más ruido y duele menos.'],'Nunca en la cara, la columna, los riñones (parte baja de la espalda) ni las articulaciones.']},
 {id:'sentidos',lv:2,d:0,ic:'lock',toy:'blind',
  pt:['Sem ver e sem ouvir','Venda nos olhos e fone com música baixa: só o toque existe.',['Escolham juntos uma música calma antes.','Coloque a venda e o fone, e use pena, gelo, beijos e mãos.','Como ela não escuta, combine um sinal com a mão pra parar.'],'Toque sempre de leve antes de mudar de lugar, pra ela não levar susto.'],
  es:['Sin ver y sin oír','Venda en los ojos y auriculares con música baja: solo existe el tacto.',['Elegid juntos una música tranquila antes.','Pon la venda y los auriculares, y usa pluma, hielo, besos y manos.','Como ella no oye, acordad una señal con la mano para parar.'],'Toca siempre suave antes de cambiar de sitio, para que no se asuste.']},
 {id:'cera',lv:2,d:2,ic:'heat',
  pt:['Cera de vela','Gotas de cera morna na pele: um calor rápido que arrepia.',['Use só vela própria pra massagem ou pra esse uso. Vela comum, de cera de abelha ou perfumada esquenta demais.','Teste antes no seu braço. Pingue de longe (uns 50 cm) e vá chegando perto só se ela quiser.','Comece pelas costas e coxas.'],'Nunca no rosto, nos olhos ou nas partes íntimas. Não use lubrificante de óleo perto da chama. Tenha água por perto.'],
  es:['Cera de vela','Gotas de cera tibia sobre la piel: un calor rápido que eriza.',['Usa solo velas de masaje o hechas para esto. Las velas comunes, de cera de abeja o perfumadas queman demasiado.','Prueba antes en tu brazo. Deja caer desde lejos (unos 50 cm) y acércate solo si ella quiere.','Empieza por la espalda y los muslos.'],'Nunca en la cara, los ojos ni las zonas íntimas. No uses lubricante de aceite cerca de la llama. Ten agua cerca.']},
 {id:'chicote',lv:2,d:2,ic:'toys',toy:'flogger',
  pt:['Chicote de tiras','Tiras macias batendo de leve: mais barulho e arrepio do que dor.',['Comece arrastando as tiras pela pele.','Depois, batidinhas leves nas costas (parte de cima), bumbum e coxas.','Alterne com carinho na pele.'],'Nunca no rosto, pescoço, coluna, rins ou articulações.'],
  es:['Látigo de tiras','Tiras suaves golpeando ligero: más ruido y escalofrío que dolor.',['Empieza arrastrando las tiras por la piel.','Después, golpecitos suaves en la parte alta de la espalda, glúteos y muslos.','Alterna con caricias en la piel.'],'Nunca en la cara, el cuello, la columna, los riñones ni las articulaciones.']},
 {id:'amarra',lv:2,d:0,ic:'lock',toy:'tiekit',
  pt:['Presa na cama','Braços e pernas presos, abertos, com ela totalmente entregue.',['Use braceletes acolchoados com tiras por baixo do colchão.','Prenda sem esticar demais e confira os pulsos e tornozelos de tempos em tempos.','Deixe uma tesoura sem ponta ao alcance de quem está livre.'],'Nunca deixe sozinha presa. Máximo de 20 a 30 minutos na mesma posição.'],
  es:['Atada a la cama','Brazos y piernas sujetos, abiertos, con ella totalmente entregada.',['Usa muñequeras acolchadas con correas por debajo del colchón.','Sujeta sin estirar de más y revisa muñecas y tobillos de vez en cuando.','Deja unas tijeras de punta roma al alcance de quien está libre.'],'Nunca la dejes sola atada. Máximo de 20 a 30 minutos en la misma postura.']},
 {id:'coleira',lv:2,d:0,ic:'lock',toy:'leash',
  pt:['Coleira e entrega','A coleira como símbolo: enquanto ela usa, ele conduz.',['Coloque a coleira devagar, com dois dedos de folga.','Combinem o que muda quando a coleira está no pescoço.','A guia serve só pra conduzir, nunca pra puxar.'],'Nada que aperte o pescoço, nunca.'],
  es:['Collar y entrega','El collar como símbolo: mientras ella lo lleva, él guía.',['Pon el collar despacio, con dos dedos de holgura.','Acordad qué cambia cuando el collar está puesto.','La correa sirve solo para guiar, nunca para tirar.'],'Nada que apriete el cuello, nunca.']},
 {id:'papeis',lv:2,d:0,ic:'both',
  pt:['Jogo de papéis com poder','Uma fantasia em que um tem o poder: chefe e funcionária, professor e aluna, desconhecidos.',['Escolham juntos o papel de cada um e onde começa e termina a cena.','Entrem no papel aos poucos, com roupa ou um objeto que marque o início.','A palavra de segurança tira os dois do papel na hora.'],'Depois, saiam do papel juntos, com abraço e conversa.'],
  es:['Juego de roles con poder','Una fantasía en la que uno tiene el poder: jefe y empleada, profesor y alumna, desconocidos.',['Elegid juntos el papel de cada uno y dónde empieza y termina la escena.','Entrad en el papel poco a poco, con ropa o un objeto que marque el inicio.','La palabra de seguridad os saca del papel al momento.'],'Después, salid del papel juntos, con un abrazo y una conversación.']},
 {id:'prende',lv:3,d:3,ic:'toys',toy:'clamps',
  pt:['Prendedores nos mamilos','Pressão nos mamilos que aumenta a sensibilidade. O pico vem ao tirar.',['Use os ajustáveis, começando no mais frouxo.','Aperte só até uma pressão gostosa.','Tire um de cada vez e beije logo depois.'],'Máximo de 15 minutos. Dor aguda ou pele branca: tire na hora.'],
  es:['Pinzas en los pezones','Presión en los pezones que aumenta la sensibilidad. El pico llega al quitarlas.',['Usa las ajustables, empezando por lo más flojo.','Aprieta solo hasta una presión agradable.','Quítalas una a una y besa justo después.'],'Máximo 15 minutos. Dolor agudo o piel blanca: quítalas enseguida.']},
 {id:'barra',lv:3,d:1,ic:'lock',toy:'spreader',
  pt:['Barra separadora','Pernas mantidas abertas por uma barra com tornozeleiras.',['Ajuste a barra curta no começo.','Prenda os tornozelos com um dedo de folga.','Deixe ela deitada de costas e confortável, com travesseiro.'],'Não mais que 20 minutos. Ajude a fechar as pernas devagar ao soltar.'],
  es:['Barra separadora','Piernas abiertas sujetas por una barra con tobilleras.',['Ajusta la barra corta al principio.','Sujeta los tobillos con un dedo de holgura.','Que ella esté tumbada boca arriba y cómoda, con almohada.'],'No más de 20 minutos. Ayúdala a cerrar las piernas despacio al soltar.']},
 {id:'mordaca',lv:3,d:0,ic:'lock',toy:'gag',
  pt:['Mordaça','Ela fica sem poder falar, e a entrega fica completa.',['Como não dá pra falar a palavra, combinem um sinal: estalar os dedos ou soltar um objeto da mão.','Use mordaça com furinhos pra respirar e tira com folga.','Pouco tempo e sempre de olho na respiração.'],'Nunca com nariz entupido, gripe ou depois de beber.'],
  es:['Mordaza','Ella no puede hablar, y la entrega es completa.',['Como no puede decir la palabra, acordad una señal: chasquear los dedos o soltar un objeto de la mano.','Usa una mordaza con agujeritos para respirar y correa con holgura.','Poco tiempo y siempre atento a la respiración.'],'Nunca con la nariz tapada, resfriado o después de beber.']},
 {id:'chibata',lv:3,d:4,ic:'toys',toy:'crop',
  pt:['Chibata','Batidas precisas com a pontinha de couro. Dói mais e marca mais.',['Só pra quem já gostou do chicote de tiras.','Batidinhas leves no bumbum e nas coxas, criando ritmo.','Não bata duas vezes seguidas no mesmo ponto.'],'Nunca no rosto, coluna, rins ou articulações. Marca roxa forte é sinal de exagero.'],
  es:['Fusta','Golpes precisos con la puntita de cuero. Duele más y marca más.',['Solo para quien ya disfrutó del látigo de tiras.','Golpecitos suaves en glúteos y muslos, creando ritmo.','No golpees dos veces seguidas en el mismo punto.'],'Nunca en la cara, la columna, los riñones ni las articulaciones. Un moratón fuerte es señal de exceso.']}
];

const BLEARN={
 pt:[
  ['O que é BDSM','A sigla junta várias práticas: amarrar e prender, quem manda e quem obedece, e brincar com sensações intensas, inclusive um pouco de dor. Tudo só entre adultos que querem, combinado antes. Não é violência: quem recebe tem sempre o poder de parar.'],
  ['As 4 regras de ouro',['Os dois querem, de verdade, e podem mudar de ideia a qualquer momento.','Tudo é combinado antes, nunca no meio da cena.','Os dois sóbrios: nada de bebida ou droga.','Começa leve. Dá pra subir na próxima vez, não dá pra desfazer um susto.']],
  ['Palavra de segurança e semáforo',['Escolham uma palavra que nunca falariam na hora, tipo “abacaxi”. Falou, parou tudo, sem discussão.','Semáforo: VERDE = tá bom, pode continuar. AMARELO = vai mais devagar ou mais leve. VERMELHO = para agora.','Se a boca estiver ocupada ou com mordaça: estalar os dedos três vezes ou soltar um objeto da mão quer dizer vermelho.','“Não” e “para” dentro do jogo só valem como parar se vocês combinarem assim. Na dúvida, pare.']],
  ['Antes: combinar',['Façam a lista de limites aqui no app (aba “Nossos limites”): o que é sim, talvez e não.','Cada um diz o seu limite de dor de 0 a 5. Vale sempre o menor dos dois.','Combinem quem conduz, quanto tempo e o que fazer depois.']],
  ['Durante: cuidar',['Quem conduz pergunta de vez em quando: “qual a cor?”.','Olhe pro rosto e pra respiração dela, não só pro corpo.','Nunca deixe sozinha quem está presa ou vendada.']],
  ['Depois: o carinho',['Solte devagar, abrace, ofereça água e um cobertor.','Conversem: o que foi bom, o que foi demais, o que querem repetir.','No dia seguinte, perguntem de novo. Às vezes bate uma tristeza ou um vazio horas depois, e isso é normal: carinho e conversa ajudam.']],
  ['Sinais de alerta',['Formigamento, dormência, mão ou pé frio, branco ou roxo: solte na hora.','Se a dormência durar mais de 1 ou 2 dias, ou se a mão ou o pé ficar fraco, procure um médico.','Choro inesperado, silêncio ou olhar perdido: pare e acolha, mesmo sem palavra de segurança.']],
  ['Kit de segurança',['Tesoura sem ponta pra soltar rápido.','Chave das algemas sempre à vista.','Água, cobertor e lenço por perto.','Luz suficiente pra ver a pele e o rosto.']],
  ['O que nunca fazer',['Nunca apertar ou prender o pescoço, nem tirar o ar: isso pode matar em segundos.','Nunca deixar alguém preso sozinho.','Nunca usar fio, corda fina ou abraçadeira de plástico.','Nunca fazer o que não foi combinado, nem “pra surpreender”.','Nunca bater no rosto, coluna, rins ou articulações.']]],
 es:[
  ['Qué es el BDSM','La sigla reúne varias prácticas: atar y sujetar, quién manda y quién obedece, y jugar con sensaciones intensas, incluso un poco de dolor. Todo solo entre adultos que quieren, acordado antes. No es violencia: quien recibe siempre tiene el poder de parar.'],
  ['Las 4 reglas de oro',['Los dos quieren, de verdad, y pueden cambiar de idea en cualquier momento.','Todo se acuerda antes, nunca en medio de la escena.','Los dos sobrios: nada de alcohol ni drogas.','Se empieza suave. Se puede subir la próxima vez; un susto no se puede deshacer.']],
  ['Palabra de seguridad y semáforo',['Elegid una palabra que nunca diríais en ese momento, como “piña”. Si se dice, se para todo, sin discutir.','Semáforo: VERDE = va bien, sigue. AMARILLO = más despacio o más suave. ROJO = para ya.','Si la boca está ocupada o con mordaza: chasquear los dedos tres veces o soltar un objeto de la mano significa rojo.','“No” y “para” dentro del juego solo valen como parar si así lo acordáis. Ante la duda, se para.']],
  ['Antes: acordar',['Haced la lista de límites aquí en la app (pestaña “Nuestros límites”): qué es sí, quizás y no.','Cada uno dice su límite de dolor de 0 a 5. Siempre vale el menor de los dos.','Acordad quién guía, cuánto tiempo y qué hacer después.']],
  ['Durante: cuidar',['Quien guía pregunta de vez en cuando: “¿qué color?”.','Mira su cara y su respiración, no solo su cuerpo.','Nunca dejes sola a quien está atada o vendada.']],
  ['Después: el cariño',['Suelta despacio, abraza, ofrece agua y una manta.','Hablad: qué fue bueno, qué fue demasiado, qué queréis repetir.','Al día siguiente, preguntad otra vez. A veces llega tristeza o un vacío horas después, y es normal: el cariño y la conversación ayudan.']],
  ['Señales de alerta',['Hormigueo, adormecimiento, mano o pie frío, blanco o morado: suelta enseguida.','Si el adormecimiento dura más de 1 o 2 días, o la mano o el pie se queda débil, ve al médico.','Llanto inesperado, silencio o mirada perdida: para y acoge, aunque no haya palabra de seguridad.']],
  ['Kit de seguridad',['Tijeras de punta roma para soltar rápido.','La llave de las esposas siempre a la vista.','Agua, manta y pañuelo cerca.','Luz suficiente para ver la piel y la cara.']],
  ['Lo que nunca se hace',['Nunca apretar o sujetar el cuello, ni cortar el aire: puede matar en segundos.','Nunca dejar a alguien atado solo.','Nunca usar cable, cuerda fina ni bridas de plástico.','Nunca hacer lo que no se acordó, ni “para sorprender”.','Nunca golpear la cara, la columna, los riñones ni las articulaciones.']]]};

const BX={
 pt:{title:'BDSM com <em>segurança</em>',lead:'Explorar com limites, combinado e cuidado. Comece pelo “Aprender”.',tabs:['Aprender','Nossos limites','Práticas'],
  toysBtn:'Ver brinquedos de BDSM',painT:'Meu limite de dor',painL:['0 · Nenhuma dor','1 · Quase nada','2 · Leve','3 · Médio','4 · Forte','5 · Bem forte'],
  wordT:'Nossa palavra de segurança',wordPh:'Ex.: abacaxi',signT:'Sinal sem falar',signPh:'Ex.: estalar os dedos 3 vezes',
  listT:'Minha lista: sim, talvez ou não',listHint:'Marque cada prática. Seu amor faz a mesma lista. Vocês só veem o que os dois toparam: o “não” do outro nunca aparece.',
  yes:'Sim',maybe:'Talvez',no:'Não',send:'Enviar pro meu amor',wait:'Esperando seu amor responder…',needAll:n=>`Falta marcar ${n}.`,
  resT:'O que vocês combinaram',both:'Os dois querem',talk:'Conversem antes (alguém marcou talvez)',none:'Nada em comum ainda.',painRes:(a,b)=>`Seu limite: ${a} · Limite dele: ${b}. Vale o menor: ${Math.min(a,b)}.`,redo:'Refazer a lista',
  ofPain:'Dor',addWish:'Lista de desejos',inWish:'Na lista ✓',seeToy:'Ver o brinquedo',how:'Como começar',care:'Cuidado',lvAll:'Todos',overLimit:'Acima do limite de dor de vocês'},
 es:{title:'BDSM con <em>seguridad</em>',lead:'Explorar con límites, acuerdo y cuidado. Empieza por “Aprender”.',tabs:['Aprender','Nuestros límites','Prácticas'],
  toysBtn:'Ver juguetes de BDSM',painT:'Mi límite de dolor',painL:['0 · Nada de dolor','1 · Casi nada','2 · Suave','3 · Medio','4 · Fuerte','5 · Muy fuerte'],
  wordT:'Nuestra palabra de seguridad',wordPh:'Ej.: piña',signT:'Señal sin hablar',signPh:'Ej.: chasquear los dedos 3 veces',
  listT:'Mi lista: sí, quizás o no',listHint:'Marca cada práctica. Tu amor hace la misma lista. Solo veis lo que los dos aceptaron: el “no” del otro nunca aparece.',
  yes:'Sí',maybe:'Quizás',no:'No',send:'Enviar a mi amor',wait:'Esperando la respuesta de tu amor…',needAll:n=>`Faltan ${n} por marcar.`,
  resT:'Lo que acordasteis',both:'Los dos quieren',talk:'Hablad antes (alguien marcó quizás)',none:'Nada en común todavía.',painRes:(a,b)=>`Tu límite: ${a} · Límite de él: ${b}. Vale el menor: ${Math.min(a,b)}.`,redo:'Rehacer la lista',
  ofPain:'Dolor',addWish:'Lista de deseos',inWish:'En la lista ✓',seeToy:'Ver el juguete',how:'Cómo empezar',care:'Cuidado',lvAll:'Todos',overLimit:'Por encima de vuestro límite de dolor'}};
const BXT=()=>BX[lang];
S.bd={tab:'learn',open:0,lv:0,exp:null,pain:2,word:'',sign:'',ans:{},stage:'pick',their:null,theirPain:3};

R.bdsm=function(){const B=BXT(),b=S.bd,C=CT();
  const tabs=`<div class="seg" role="group" style="grid-template-columns:repeat(3,1fr)">${['learn','limits','prac'].map((k,i)=>`<button type="button" class="seg-b" data-bd="tab:${k}" aria-pressed="${b.tab===k}">${B.tabs[i]}</button>`).join('')}</div>`;
  let body='';
  if(b.tab==='learn'){body=BLEARN[lang].map(([h,c],i)=>`<details class="bdl" ${b.open===i?'open':''} data-bd-i="${i}"><summary>${h}</summary><div class="rbody">${Array.isArray(c)?`<ul class="gdlist">${c.map(x=>`<li>${ic('check',16)}<span>${x}</span></li>`).join('')}</ul>`:`<p>${c}</p>`}</div></details>`).join('')
    +`<div class="sema"><span class="sg">${lang==='es'?'Verde':'Verde'}</span><span class="sy">${lang==='es'?'Amarillo':'Amarelo'}</span><span class="sr">${lang==='es'?'Rojo':'Vermelho'}</span></div>
    <button type="button" class="btn ghost" data-bd="toys">${ic('toys',16)} ${B.toysBtn}</button>`}
  else if(b.tab==='limits'){
    if(b.stage==='pick'){const left=BDP.filter(p=>!b.ans[p.id]).length;
      body=`<div class="sec-t">${B.painT}</div><div class="chips wrap">${B.painL.map((l,i)=>`<button type="button" class="chip" data-bd="pain:${i}" aria-pressed="${b.pain===i}">${l}</button>`).join('')}</div>
      <div class="field"><label for="bdw">${B.wordT}</label><input id="bdw" placeholder="${B.wordPh}" value="${esc(b.word)}"></div>
      <div class="field"><label for="bds">${B.signT}</label><input id="bds" placeholder="${B.signPh}" value="${esc(b.sign)}"></div>
      <div class="sec-t">${B.listT}</div><p class="hint">${B.listHint}</p>
      <div class="ynlist">${BDP.map(p=>`<div class="ynrow"><div><span class="lvd l${p.lv}"></span><strong>${p[lang][0]}</strong></div><div class="yn">${['y','m','n'].map((v,i)=>`<button type="button" class="ynb ${v}" data-bd="yn:${p.id}:${v}" aria-pressed="${b.ans[p.id]===v}">${[B.yes,B.maybe,B.no][i]}</button>`).join('')}</div></div>`).join('')}</div>
      ${left?`<p class="hint">${B.needAll(left)}</p>`:''}<button type="button" class="btn pri" data-bd="send">${B.send}</button>`}
    else if(b.stage==='wait')body=`<div class="wkhero center"><div class="bigic">${ic('both',40)}</div><h2>${B.wait}</h2></div>`;
    else{const yy=BDP.filter(p=>b.ans[p.id]==='y'&&b.their[p.id]==='y'),mm=BDP.filter(p=>!yy.includes(p)&&b.ans[p.id]!=='n'&&b.their[p.id]!=='n');
      const row=p=>`<div class="chit">${ic(p.ic,16)}<span>${p[lang][0]}</span>${p.d>Math.min(b.pain,b.theirPain)?`<small class="ctag">${B.overLimit}</small>`:''}</div>`;
      body=`<div class="wkhero"><span class="tagc gold">${ic('bdsm',14)} ${B.resT}</span><p>${B.painRes(b.pain,b.theirPain)}</p>${b.word?`<p><strong>${B.wordT}:</strong> ${esc(b.word)}</p>`:''}${b.sign?`<p><strong>${B.signT}:</strong> ${esc(b.sign)}</p>`:''}</div>
      <div class="sec-t" style="color:var(--honey)">${B.both}</div>${yy.length?`<div class="chitems">${yy.map(row).join('')}</div>`:`<p class="hint">${B.none}</p>`}
      <div class="sec-t">${B.talk}</div>${mm.length?`<div class="chitems">${mm.map(row).join('')}</div>`:`<p class="hint">${B.none}</p>`}
      <button type="button" class="btn link" data-bd="redo">${B.redo}</button>`}}
  else{const list=BDP.filter(p=>!b.lv||p.lv===b.lv),open=BDP.find(p=>p.id===b.exp);
    body=`<div class="chips"><button type="button" class="chip" data-bd="lv:0" aria-pressed="${!b.lv}">${B.lvAll}</button>${[1,2,3].map(n=>`<button type="button" class="chip" data-bd="lv:${n}" aria-pressed="${b.lv===n}"><span class="lvd l${n}"></span>${C.lv[n-1]}</button>`).join('')}</div>
    <div class="chgrid">${list.map(p=>`<button type="button" class="chtile ${b.exp===p.id?'on':''}" data-bd="exp:${p.id}"><span class="wtic">${p.toy?toyPic((TOYS.find(t=>t.id===p.toy)||{}).svg,90):ic(p.ic,34)}</span><span class="wtt"><span class="lvd l${p.lv}"></span>${p[lang][0]}</span><span class="chd">${p[lang][1]}</span></button>`).join('')}</div>
    ${open?`<div class="wdet" id="bdopen"><div class="tags">${lvTag(open.lv)}</div><strong>${open[lang][0]}</strong><p>${open[lang][1]}</p>
      <div class="mrows big"><div class="mrow"><span>${B.ofPain}</span><span class="bol her" aria-label="${open.d}/5">${[1,2,3,4,5].map(k=>`<i class="${k<=open.d?'on':''}"></i>`).join('')}</span></div></div>
      <div class="how"><div class="sec-t">${B.how}</div><ol>${open[lang][2].map(x=>`<li>${x}</li>`).join('')}</ol></div><div class="tip her"><b>${B.care}</b>${open[lang][3]}</div>
      <div class="row"><button type="button" class="btn ${S.wl.has('bdsm:'+open.id)?'gold':'ghost'} sm" data-bd="wish:${open.id}">${ic('wish',15)} ${S.wl.has('bdsm:'+open.id)?B.inWish:B.addWish}</button>${open.toy?`<button type="button" class="btn ghost sm" data-bd="toy:${open.toy}">${ic('toys',15)} ${B.seeToy}</button>`:''}</div></div>`:''}`}
  return `<section class="screen"><button type="button" class="back" data-act="back">${t().w.back}</button><h2>${B.title}</h2><p>${B.lead}</p>${tabs}${body}</section>`};

document.addEventListener('click',e=>{const el=e.target.closest('[data-bd]');if(!el)return;const [a,p,q]=el.dataset.bd.split(':'),b=S.bd;
  switch(a){
   case 'tab':b.tab=p;render();break;
   case 'toys':S.toyw='f';S.bdx=true;S.texp=null;go('toys');break;
   case 'pain':b.pain=+p;render();break;
   case 'yn':b.ans[p]=q;{const y=window.scrollY;render();window.scrollTo(0,y)}break;
   case 'send':{const left=BDP.filter(x=>!b.ans[x.id]).length;if(left){toast(BXT().needAll(left));break}b.stage='wait';render();
     if(!window.REAL)setTimeout(()=>{b.their=Object.fromEntries(BDP.map((x,i)=>[x.id,x.lv===1?'y':(x.lv===2?(i%2?'y':'m'):(i%3?'n':'m'))]));b.stage='done';if(S.screen==='bdsm')render();toast(t().w.partnerDone)},1800);break}
   case 'redo':b.stage='pick';render();break;
   case 'lv':b.lv=+p;b.exp=null;render();break;
   case 'exp':b.exp=b.exp===p?null:p;render();if(b.exp){const o=document.getElementById('bdopen');if(o)o.scrollIntoView({behavior:'smooth',block:'start'})}break;
   case 'wish':{const k='bdsm:'+p;S.wl.has(k)?S.wl.delete(k):S.wl.add(k);render();toast(S.wl.has(k)?t().p.addedWish:t().p.removedWish);break}
   case 'toy':{const x=TOYS.find(t=>t.id===p);if(x){S.toyw='f';S.bdx=true;S.texp=p;go('toys')}break}
  }});
document.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.bdI!=null&&d.open)S.bd.open=+d.dataset.bdI},true);
document.addEventListener('input',e=>{if(e.target.id==='bdw')S.bd.word=e.target.value;else if(e.target.id==='bds')S.bd.sign=e.target.value});
PV.bdsm=()=>{S.bd=Object.assign({},S.bd,{tab:'prac',exp:null,lv:0});return R.bdsm()};
GUIDE.pt.bdsm[2]=['“Aprender”: o que é, as 4 regras de ouro, palavra de segurança e semáforo, antes, durante e depois, sinais de alerta e o que nunca fazer.','“Nossos limites”: cada um marca o seu limite de dor e o que é sim, talvez ou não. Vocês só veem o que os dois toparam.','“Práticas”: 16 práticas por nível, cada uma com nível de dor, como começar e cuidados.','Botão “Adicionar à lista de desejos” e atalho pro brinquedo de cada prática.'];
GUIDE.es.bdsm[2]=['“Aprender”: qué es, las 4 reglas de oro, palabra de seguridad y semáforo, antes, durante y después, señales de alerta y lo que nunca se hace.','“Nuestros límites”: cada uno marca su límite de dolor y qué es sí, quizás o no. Solo veis lo que los dos aceptaron.','“Prácticas”: 16 prácticas por nivel, cada una con nivel de dolor, cómo empezar y cuidados.','Botón “Añadir a la lista de deseos” y acceso al juguete de cada práctica.'];
