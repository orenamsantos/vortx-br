const BRAND={name:"CONDOR",tagline:"Reative o Circuito",year:(new Date).getFullYear()},

GATE_DATA={
  headline:"Por que homens de 70 anos a 4.500m nos Andes nunca falham na cama nem terminam cedo?",
  subheadline:"O cirurgião vascular Renato Vasquez foi atrás dessa anomalia e achou a resposta: um circuito que a vida moderna desliga depois dos 35. Não é idade, não é cabeça, não é hormônio. Faça o teste de 2 minutos e veja quanto do seu já apagou.",
  cta:"DESCOBRIR MEU NÍVEL DE BLOQUEIO",
  timerStrip:"🔒 Teste anônimo • Resultado imediato na tela • Sem cadastro, sem cobrança",
  socialProof:"17.483 homens já reativaram o circuito. Tempo médio: 21 dias.",
  privacySeal:"100% confidencial • Anônimo • Ninguém vai saber",
  badge:"O circuito que a vida moderna desliga depois dos 35"
},

PHASES=[
  {id:1,label:"VALIDAÇÃO",steps:["q1","q2"]},
  {id:2,label:"PRESSÃO",steps:["q3","q4","q5"]},
  {id:3,label:"GATILHO",steps:["q6","q7","q8"]},
  {id:4,label:"SABOTADOR",steps:["q9"]},
  {id:5,label:"VEREDITO",steps:["q10"]}
],

STEPS=[
  {
    id:"q1",phase:1,type:"single-select",
    question:"Seja honesto por 10 segundos.",
    microcopy:"O que mais te corrói hoje?",
    options:[
      {value:"de",label:"Perdi firmeza ou não fica em pé",icon:"🔻",route:"DE"},
      {value:"ep",label:"Termino rápido demais, sem controle",icon:"⏱️",route:"EP"},
      {value:"ambos",label:"Os dois ao mesmo tempo",icon:"🔥",route:"ambos"},
      {value:"comecando",label:"Tá começando agora, mas já assusta",icon:"⚠️",route:"ambos"}
    ],
    triggers:{
      de:"🛑 Firmeza que cai é o primeiro sinal de que o circuito da pressão apagou. Continue.",
      ep:"⚡ Terminar cedo não é frescura nem cabeça: é o gatilho do circuito disparando sozinho. Vamos medir.",
      ambos:"🔥 Quando os dois caem juntos, é o circuito inteiro adormecido. Justo o que esse teste mede.",
      comecando:"⚠ Pegar no começo muda tudo. A maioria só descobre tarde demais."
    },
    weight:0
  },
  {
    id:"q2",phase:1,type:"single-select",
    question:"Quantos anos você tem?",
    microcopy:"A velocidade que o circuito apaga muda brutalmente de uma faixa pra outra.",
    options:[
      {value:"35-39",label:"35 a 39 anos",icon:"⚠️"},
      {value:"40-44",label:"40 a 44 anos",icon:"⚠️"},
      {value:"45-49",label:"45 a 49 anos",icon:"🚨"},
      {value:"50-54",label:"50 a 54 anos",icon:"🚨"},
      {value:"55-59",label:"55 a 59 anos",icon:"🛑"},
      {value:"60-70",label:"60 anos ou mais",icon:"🛑"}
    ],
    triggers:{
      "35-39":"⚠ Você está descobrindo antes da maioria. Isso joga a seu favor.",
      "40-44":"⚠ Nessa faixa o circuito já começou a apagar. Em 3 anos sem agir, você não se reconhece.",
      "45-49":"🚨 Metade do circuito já caiu. Ainda dá pra reacender, mas a janela aperta.",
      "50-54":"🛑 Depois dos 50 o circuito perdeu metade da força. Existe forma de religar.",
      "55-59":"🛑 Faixa crítica. O circuito apaga mês a mês. Mas você ainda está aqui.",
      "60-70":"🛑 Situação grave, e mesmo assim homens de 63 anos reacenderam o circuito com o protocolo."
    },
    weight:0
  },
  {
    id:"q3",phase:2,type:"single-select",
    question:"Quando foi a última vez que você acordou duro, sem precisar de nada?",
    microcopy:"Ereção matinal forte significa pressão chegando. Se sumiu, o circuito da pressão já caiu.",
    options:[
      {value:"sempre",label:"Quase todo dia",icon:"✅",score:3},
      {value:"raro",label:"Raramente, só com sorte",icon:"⚠️",score:1},
      {value:"nunca",label:"Faz tempo que não acontece",icon:"🛑",score:0}
    ],
    triggers:{
      nunca:"🛑 Sem ereção matinal, a pressão não está chegando. É por isso que fraqueja na hora.",
      raro:"⚠ A pressão chega, mas fraca. Firmeza parcial é o circuito pela metade."
    },
    weight:20,category:"pressao"
  },
  {
    id:"q4",phase:2,type:"single-select",
    question:"Na hora H, como você está?",
    microcopy:"Sem desculpa. O que acontece quando precisa render?",
    options:[
      {value:"firme",label:"Duro do início ao fim",icon:"💪",score:3},
      {value:"murcha",label:"Não fica em pé ou murcha no meio",icon:"🚨",score:0},
      {value:"pilula",label:"Só com a pílula azul",icon:"💊",score:0}
    ],
    triggers:{
      murcha:"🚨 O sangue entra mas não fica preso. Pressão sem retenção. O protocolo corrige isso.",
      pilula:"🛑 Depender da pílula é o circuito terceirizado. Dá pra reativar o seu, sem química."
    },
    weight:15,category:"pressao"
  },
  {
    id:"q5",phase:2,type:"single-select",
    question:"Você evita o sexo por medo de falhar?",
    microcopy:"Fugir corrói por dentro e piora o circuito. Honestidade aqui vale o diagnóstico.",
    options:[
      {value:"nao",label:"Não, encaro normal",icon:"🚫",score:3},
      {value:"asvezes",label:"Às vezes invento desculpa",icon:"⚠️",score:1},
      {value:"sempre",label:"Quase sempre fujo",icon:"🛑",score:0}
    ],
    triggers:{
      sempre:"🛑 Cada fuga ensina o corpo a desligar mais. É um ciclo, e tem saída.",
      asvezes:"⚠ A desculpa de hoje vira o hábito de amanhã. Dá pra quebrar isso."
    },
    weight:10,category:"pressao"
  },
  {
    id:"q6",phase:3,type:"single-select",
    question:"Quando começa, quanto tempo você dura?",
    microcopy:"Da penetração até terminar. Sem arredondar pra cima.",
    options:[
      {value:"menos1",label:"Menos de 1 minuto",icon:"🛑",score:0},
      {value:"1a3",label:"Entre 1 e 3 minutos",icon:"🚨",score:1},
      {value:"3a7",label:"Entre 3 e 7 minutos",icon:"⚠️",score:2},
      {value:"controlo",label:"Aguento o quanto eu quiser",icon:"💪",score:3}
    ],
    triggers:{
      menos1:"🛑 Menos de 1 minuto é o gatilho disparando sem comando nenhum. É o circuito do controle apagado.",
      "1a3":"🚨 O gatilho dispara antes de você decidir. Dá pra retomar o comando."
    },
    weight:20,category:"gatilho"
  },
  {
    id:"q7",phase:3,type:"single-select",
    question:"Você termina antes de querer, sem aviso?",
    microcopy:"Aquele ponto sem volta que chega cedo demais.",
    options:[
      {value:"nunca",label:"Não, sinto e controlo",icon:"✅",score:3},
      {value:"asvezes",label:"Às vezes me pega de surpresa",icon:"⚠️",score:1},
      {value:"sempre",label:"Quase sempre, sem controle",icon:"🛑",score:0}
    ],
    triggers:{
      sempre:"🛑 Sem aviso significa gatilho sem freio. É o sinal mais claro do circuito do controle apagado.",
      asvezes:"⚠ Te pegar de surpresa é o freio falhando. Dá pra reinstalar o comando."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"q8",phase:3,type:"single-select",
    question:"Você consegue parar quase no fim e voltar?",
    microcopy:"O famoso segura e volta. Ou é tudo ou nada?",
    options:[
      {value:"sim",label:"Sim, consigo segurar e voltar",icon:"💪",score:3},
      {value:"dificil",label:"Tento, mas quase sempre falho",icon:"⚠️",score:1},
      {value:"nao",label:"É tudo ou nada, não controlo",icon:"🛑",score:0}
    ],
    triggers:{
      nao:"🛑 Tudo ou nada é o gatilho sem modulação. O protocolo reinstala esse freio.",
      dificil:"⚠ Você tenta mas o freio não responde. É treinável, dia a dia."
    },
    weight:10,category:"gatilho"
  },
  {
    id:"gatilho_gate",phase:3,type:"single-select",
    question:"Vamos medir seu gatilho agora.",
    microcopy:"Você está num lugar onde pode tentar uma coisa rápida e discreta?",
    options:[
      {value:"sim",label:"Sim, posso tentar agora",icon:"✅"},
      {value:"nao",label:"Agora não dá",icon:"🙈"}
    ],
    conditional:{ sim:"gatilho_test", nao:"gatilho_mirror" },
    weight:0
  },
  {
    id:"gatilho_test",phase:3,type:"single-select",isConditional:true,nextId:"q9",
    question:"Contraia o assoalho pélvico (como segurar o xixi) com força e segure 30 segundos sem afrouxar.",
    microcopy:"Conte os segundos. O que aconteceu?",
    options:[
      {value:"falhou",label:"Não aguentei, afrouxou rápido",icon:"🛑",score:0},
      {value:"tremeu",label:"Aguentei, mas tremeu e foi difícil",icon:"⚠️",score:1},
      {value:"facil",label:"Fácil, aguentei tranquilo",icon:"💪",score:3}
    ],
    triggers:{
      falhou:"🛑 Confirmado: seu gatilho já caiu. É exatamente por isso que você perde o controle.",
      tremeu:"⚠ Seu gatilho está enfraquecendo. Ainda tem reserva, mas a janela está fechando.",
      facil:"🔥 Raro. Você tem uma base que poucos têm na sua idade, e é justo isso que despenca mais rápido se você não treinar."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"gatilho_mirror",phase:3,type:"single-select",isConditional:true,nextId:"q9",
    question:"Sem problema. Vamos pela memória.",
    microcopy:"Da última vez que tentou se segurar pra não terminar, o que rolou?",
    options:[
      {value:"falhou",label:"Não consegui segurar",icon:"🛑",score:0},
      {value:"tremeu",label:"Segurei com muita dificuldade",icon:"⚠️",score:1},
      {value:"facil",label:"Controlo numa boa",icon:"💪",score:3}
    ],
    triggers:{
      falhou:"🛑 Confirmado: seu gatilho já caiu. É exatamente por isso que você perde o controle.",
      tremeu:"⚠ Seu gatilho está enfraquecendo. Ainda tem reserva, mas a janela está fechando.",
      facil:"🔥 Raro. Você tem uma base que poucos têm na sua idade, e é justo isso que despenca mais rápido se você não treinar."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"q9",phase:4,type:"multi-select",
    question:"O que ainda mantém seu circuito travado?",
    microcopy:"Cada um desses sabota o sangue e o nervo que o circuito usa.",
    minSelections:1,
    options:[
      {value:"alcool",label:"Bebo álcool toda semana",icon:"🍺"},
      {value:"cigarro",label:"Fumo ou fumei por anos",icon:"🚬"},
      {value:"sedentario",label:"Sem exercício há meses",icon:"🛋️"},
      {value:"estresse",label:"Vivo no estresse e dormindo mal",icon:"🧠"},
      {value:"nenhum",label:"Nenhum desses",icon:"✅"}
    ],
    triggers:{
      _any_except_nenhum:"🛑 Cada um desses mantém o circuito desligado. Quanto mais marcou, mais fundo o bloqueio."
    },
    weight:8,category:"sabotador",scoreLogic:"count-negative"
  },
  {
    id:"q10",phase:5,type:"single-select",
    question:"Última pergunta. Por quem você está fazendo isso?",
    microcopy:"Guarda esse motivo. Em 2 minutos ele é o que te faz começar hoje, não segunda que vem.",
    options:[
      {value:"parceira",label:"Pela minha parceira",icon:"💑"},
      {value:"eu_mesmo",label:"Por mim, quero me sentir homem de novo",icon:"🦾"},
      {value:"tudo",label:"Por tudo, quero minha vida de volta",icon:"🔥"},
      {value:"confianza",label:"Pelos dois, corpo e confiança",icon:"💪"}
    ],
    weight:0
  }
],

LOADING_DATA={
  headline:"Mapeando seu Circuito Adormecido...",
  duration:12e3,
  messages:[
    "Cruzando seus sintomas com o banco de dados...",
    "Medindo o bloqueio da pressão (ereção)...",
    "Medindo o bloqueio do gatilho (controle)...",
    "Calculando há quanto tempo o circuito apagou...",
    "Comparando com 17.483 diagnósticos anteriores...",
    "Isso vai mudar o que você achava do seu corpo...",
    "Montando seu protocolo de reativação..."
  ]
},

NAMEGATE_DATA={
  headline:"Mapa concluído",
  question:"Como devo te chamar?",
  microcopy:"Só o primeiro nome. O diagnóstico que vem a seguir é seu, e quero te chamar pelo nome enquanto te mostro o que apagou. Fica entre nós.",
  placeholder:"Seu primeiro nome...",
  cta:"VER MEU DIAGNÓSTICO"
},

RESULT_DATA={
  headlineTemplate:"Seu diagnóstico está pronto, {name}.",
  blockZones:[
    {min:71,max:100,label:"CIRCUITO EM FALÊNCIA",color:"#C44B4B",description:"Seu circuito está quase todo apagado. A pressão não chega (firmeza fraca, murcha) e o gatilho dispara sozinho (termina cedo). Agir hoje não é exagero, é o limite."},
    {min:41,max:70,label:"EM COLAPSO",color:"#D4940A",description:"Seu circuito está apagando rápido. Você já perdeu firmeza e controle de forma visível. Ainda dá pra reverter, mas a janela está se fechando."},
    {min:0,max:40,label:"JANELA FECHANDO",color:"#C9A84C",description:"Seu circuito ainda responde, mas os sinais de queda já estão ligados. Quem ignora nessa fase é exatamente quem vira o caso grave em 12 meses. O momento de blindar é agora."}
  ],
  criticalAreas:{
    pressao:{label:"Pressão (Ereção)",icon:"🔻"},
    gatilho:{label:"Gatilho (Controle)",icon:"⏱️"},
    sabotador:{label:"Sabotadores do Circuito",icon:"🔄"}
  }
},

BRIDGE_DATA={cta:"VER COMO REACENDER MEU CIRCUITO"};

const VIDEO_DATA={
  enabled:false,
  url:"",
  poster:""
};

var PROTOCOL_DATA={
  headline:"O Protocolo Condor, montado pro seu circuito",
  subheadline:"Sem cirurgia, sem pílula, sem bomba. A Respiração do Condor é o interruptor que reacende o circuito que a vida moderna desligou. Montado dia a dia no app Condor, no seu celular, pro seu diagnóstico.",
  features:[
    {icon:"🔺",title:"Pressão de volta em 21 dias",desc:"O circuito da pressão reabre e o sangue enche com a força que você tinha aos 25. Firmeza sem depender da pílula azul."},
    {icon:"⏱️",title:"Gatilho sob comando",desc:"Você reinstala o freio. Decide quando termina, em vez de ser pego de surpresa. Durar passa a ser escolha."},
    {icon:"🌄",title:"A Respiração do Condor",desc:"O ritual que os andinos usam pra manter o circuito aberto a vida toda. 6 minutos por dia, guiado no app."},
    {icon:"🔥",title:"Desejo que volta junto",desc:"Quando o circuito reacende, a vontade volta como onda. Sua parceira sente antes de você contar."}
  ],
  seal:"Seu protocolo já está montado no app Condor, com base no seu diagnóstico. Acesso restrito.",
  cta:"QUERO REACENDER ISSO AGORA"
},

TESTIMONIALS=[
  {initials:"César M.",age:52,occupation:"Dono de Construtora, São Paulo",photo:"img/testimonials/cesar-m.jpg",
   text:"Achei que era idade. Era o circuito. 15 dias reacendendo e minha esposa perguntou o que eu tava tomando. Firmeza de volta.",
   result:"Firmeza em 15 dias",highlight:"+ Pressão restaurada",painTags:["de","parceira","tudo","confianza"]},
  {initials:"Roberto Q.",age:44,occupation:"Investidor, Rio de Janeiro",photo:"img/testimonials/roberto-q.jpg",
   text:"Eu murchava no meio e terminava em 2 minutos. Reativei os dois lados do circuito. Hoje fico duro e duro o quanto quero.",
   result:"Pressão e controle de volta",highlight:"+ Circuito reativado",painTags:["ambos","eu_mesmo","tudo"]},
  {initials:"Sergio O.",age:60,occupation:"Ex-Militar, Curitiba",photo:"img/testimonials/sergio-o.jpg",
   text:"60 anos, dependia da pílula. Hoje acordo duro sem precisar de nada. O circuito voltou a ligar sozinho.",
   result:"Sem pílula aos 60",highlight:"+ Pressão natural",painTags:["de","parceira","eu_mesmo","tudo"]},
  {initials:"Marcos T.",age:48,occupation:"Caminhoneiro, Belo Horizonte",photo:"img/testimonials/marcos-t.jpg",
   text:"Terminava cedo e minha esposa nem vinha mais pro quarto. Reinstalei o gatilho e hoje aguento a noite toda.",
   result:"Controle restaurado",highlight:"+ Gatilho sob comando",painTags:["ep","parceira","tudo"]},
  {initials:"Ricardo F.",age:55,occupation:"Advogado, Brasília",photo:"img/testimonials/ricardo-f.jpg",
   text:"Terminava em 1 minuto. Hoje decido quando termino e ela pede mais.",
   result:"De 1 minuto pra 40+",highlight:"+ Controle de ejaculação",painTags:["ep","eu_mesmo","parceira","tudo"]},
  {initials:"Pablo S.",age:41,occupation:"Empresário, São Paulo",photo:"img/testimonials/pablo-s.jpg",
   text:"Firmeza fraca e sem controle. 60 dias reacendendo o circuito e os dois voltaram. Minha esposa não acreditava.",
   result:"Os dois lados de volta",highlight:"+ Circuito inteiro religado",painTags:["ambos","eu_mesmo","tudo","confianza"]},
  {initials:"Andrés L.",age:49,occupation:"Engenheiro, Porto Alegre",photo:"img/testimonials/andres-l.jpg",
   text:"30 dias e minha esposa olhou e disse: o que aconteceu com você? A pressão voltou.",
   result:"Reversão em 30 dias",highlight:"+ Pressão reaberta",painTags:["de","eu_mesmo","parceira","tudo","confianza"]},
  {initials:"Felipe R.",age:53,occupation:"Médico, Salvador",photo:"img/testimonials/felipe-r.jpg",
   text:"Sou médico e não resolvia o meu. Esse protocolo fez o que 5 anos de consulta não fizeram.",
   result:"Funcionou onde a medicina falhou",highlight:"+ Mecanismo do circuito",painTags:["ambos","eu_mesmo","parceira","tudo"]},
  {initials:"Jonathan P.",age:46,occupation:"Professor, Florianópolis",photo:"img/testimonials/jonathan-p.jpg",
   text:"O circuito reabriu e o sangue voltou com pressão. Minha parceira notou na primeira semana.",
   result:"Visível em 7 dias",highlight:"+ Pressão restaurada",painTags:["de","parceira","tudo"]},
  {initials:"Gilberto A.",age:58,occupation:"Empresário, Goiânia",photo:"img/testimonials/gilberto-a.jpg",
   text:"3 semanas: duro como pedra e duração que ela nunca viu. Não quer sair da cama.",
   result:"Firmeza e duração",highlight:"+ Performance total",painTags:["ambos","parceira","eu_mesmo","tudo"]},
  {initials:"Carlos V.",age:43,occupation:"Policial, Recife",photo:"img/testimonials/carlos-v.jpg",
   text:"Antes terminava antes de começar. Reacendi o gatilho e hoje duro o quanto quero. Salvou meu casamento.",
   result:"Gatilho sob controle",highlight:"+ Controle de ejaculação",painTags:["ep","eu_mesmo","tudo","confianza"]},
  {initials:"Daniel M.",age:37,occupation:"Desenvolvedor, Fortaleza",photo:"img/testimonials/daniel-m.jpg",
   text:"37 anos e já falhava. 3 semanas reacendendo o circuito e a firmeza voltou com força.",
   result:"Revertido aos 37",highlight:"+ Circuito reativado a tempo",painTags:["ambos","eu_mesmo","tudo","confianza"]},
  {initials:"Héctor M.",age:61,occupation:"Aposentado, Manaus",photo:"img/testimonials/hector-m.jpg",
   text:"61 anos, 5 anos sem funcionar. 3 semanas e voltei com pressão e firmeza. Ela chorou.",
   result:"Reverteu aos 61",highlight:"+ 5 anos revertidos",painTags:["de","parceira","eu_mesmo","tudo"]}
];

function getFilteredTestimonials(e){
  var key=(e||"").toString().toLowerCase();
  var o=TESTIMONIALS.filter(function(t){return t.painTags&&t.painTags.indexOf(key)>-1;});
  return (o.length>=3?o:TESTIMONIALS).slice().sort(function(){return Math.random()-.5;}).slice(0,3);
}

const PRICING_DATA={
  urgencyText:"Esse preço desaparece em:",
  timerMinutes:8,
  checkoutCtaMap:{
    parceira:"RECUPERAR MEU CASAMENTO HOJE",
    eu_mesmo:"VOLTAR A SER HOMEM AGORA",
    tudo:"REACENDER TUDO EM 21 DIAS",
    confianza:"RECUPERAR MEU CORPO E MINHA CONFIANÇA",
    _default:"REACENDER MEU CIRCUITO"
  },
  plans:[
    {
      id:"completo",
      name:"PROTOCOLO CONDOR COMPLETO",
      price:37,
      originalPrice:197,
      period:"pagamento único, acesso vitalício",
      description:"O protocolo completo de reativação do circuito",
      badge:"🔓 ACESSO TOTAL",
      ctaLabel:"QUERO O PROTOCOLO COMPLETO",
      ctaTag:"ACESSO TOTAL",
      features:[
        "Pressão de volta em 21 dias, firmeza sem pílula",
        "Gatilho sob comando, durar vira escolha",
        "A Respiração do Condor guiada, 6 minutos por dia",
        "App Condor personalizado pelo seu diagnóstico",
        "Acesso vitalício, com todas as atualizações incluídas"
      ]
    }
  ],
  guarantee:{
    title:"30 dias. Se o circuito não reacender, eu devolvo tudo.",
    text:"Siga o protocolo por 30 dias. Se sua firmeza e seu controle não melhorarem de forma visível, devolvo 100%. Sem perguntas. O risco é meu.",
    icon:"🛡️"
  },
  paymentMethods:["Cartão de Crédito • PIX • Pagamento 100% Seguro 🔒"]
},

THANKYOU_DATA={
  headline:"Bem-vindo ao outro lado, {name}.",
  subheadline:"O Protocolo Condor está liberado. A partir de agora cada dia reacende mais o circuito.",
  steps:[
    {number:"01",title:"Acesso em menos de 5 minutos",desc:"O link chega no seu e-mail ou WhatsApp assim que o pagamento confirmar."},
    {number:"02",title:"Comece pela Respiração do Condor (Dia 1)",desc:"É o interruptor. Sem ela, nada reacende. Faça hoje."},
    {number:"03",title:"Siga exatamente como está escrito",desc:"Vai parecer simples demais. Não mude nada. Aí está o resultado."},
    {number:"04",title:"Deixe o resultado falar",desc:"Em 2 a 3 semanas sua parceira vai ser a primeira a notar."}
  ],
  cta:"ACESSAR O PROTOCOLO AGORA"
};
