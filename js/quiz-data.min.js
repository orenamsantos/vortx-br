const BRAND={name:"CONDOR",tagline:"O Interruptor",year:(new Date).getFullYear()},

GATE_DATA={
  headline:"Você não fica duro e termina rápido. Não é idade: é um interruptor que desligou.",
  subheadline:"Homens de 70 anos a 4.500m nos Andes ficam duro e duram a noite toda. O cirurgião vascular Renato Vasquez descobriu o motivo: lá o interruptor da ereção e do controle nunca desliga. No resto do mundo, depois dos 35, ele apaga. Faça o teste de 2 minutos e veja o quanto o seu já desligou.",
  cta:"VER O QUANTO JÁ DESLIGOU",
  timerStrip:"🔒 Teste anônimo • Resultado imediato na tela • Sem cadastro, sem cobrança",
  socialProof:"17.483 homens já religaram. Tempo médio: 21 dias.",
  privacySeal:"100% confidencial • Anônimo • Ninguém vai saber",
  badge:"O interruptor que desliga depois dos 35"
},

PHASES=[
  {id:1,label:"VALIDAÇÃO",steps:["q1","q2"]},
  {id:2,label:"FICAR DURO",steps:["q3","q4","q5"]},
  {id:3,label:"DURAR",steps:["q6","q7","q8"]},
  {id:4,label:"SABOTADOR",steps:["q9"]},
  {id:5,label:"VEREDITO",steps:["q10"]}
],

STEPS=[
  {
    id:"q1",phase:1,type:"single-select",
    question:"Vou ser direto. Qual é o seu problema hoje?",
    microcopy:"Sem rodeio. O que mais te incomoda?",
    options:[
      {value:"de",label:"Não fico duro, ou murcho no meio",icon:"🔻",route:"DE"},
      {value:"ep",label:"Termino rápido demais, sem controle",icon:"⏱️",route:"EP"},
      {value:"ambos",label:"Os dois: não fico duro e ainda gozo cedo",icon:"🔥",route:"ambos"},
      {value:"comecando",label:"Tá começando agora, mas já assusta",icon:"⚠️",route:"ambos"}
    ],
    triggers:{
      de:"🛑 Murchar é o primeiro sinal de que o interruptor da ereção desligou. Segue.",
      ep:"⚡ Terminar cedo não é frescura nem cabeça: é o interruptor do controle desligado. Vamos medir.",
      ambos:"🔥 Os dois juntos é o interruptor apagado inteiro. É exatamente o que esse teste mede.",
      comecando:"⚠ Pegar no começo muda tudo. A maioria só vê quando já era tarde."
    },
    weight:0
  },
  {
    id:"q2",phase:1,type:"single-select",
    question:"Quantos anos você tem?",
    microcopy:"A velocidade que o interruptor apaga muda muito de uma faixa pra outra.",
    options:[
      {value:"35-39",label:"35 a 39 anos",icon:"⚠️"},
      {value:"40-44",label:"40 a 44 anos",icon:"⚠️"},
      {value:"45-49",label:"45 a 49 anos",icon:"🚨"},
      {value:"50-54",label:"50 a 54 anos",icon:"🚨"},
      {value:"55-59",label:"55 a 59 anos",icon:"🛑"},
      {value:"60-70",label:"60 anos ou mais",icon:"🛑"}
    ],
    triggers:{
      "35-39":"⚠ Você tá vendo antes da maioria. Isso joga a seu favor.",
      "40-44":"⚠ Nessa faixa o interruptor já começou a apagar. Em 3 anos sem agir, você não se reconhece.",
      "45-49":"🚨 Metade já desligou. Dá pra religar, mas a janela aperta.",
      "50-54":"🛑 Depois dos 50 o interruptor perdeu metade da força. Dá pra ligar de novo.",
      "55-59":"🛑 Faixa crítica. Ele apaga mês a mês. Mas você ainda tá aqui.",
      "60-70":"🛑 Situação grave, e mesmo assim homens de 63 anos religaram com o método."
    },
    weight:0
  },
  {
    id:"q3",phase:2,type:"single-select",
    question:"Quando foi a última vez que você acordou duro, sem fazer nada?",
    microcopy:"Acordar duro significa que o sangue chega. Se sumiu, o lado da ereção já desligou.",
    options:[
      {value:"sempre",label:"Quase todo dia",icon:"✅",score:3},
      {value:"raro",label:"Raramente, só com sorte",icon:"⚠️",score:1},
      {value:"nunca",label:"Faz tempo que não acontece",icon:"🛑",score:0}
    ],
    triggers:{
      nunca:"🛑 Sem ereção de manhã o sangue não tá chegando. É por isso que murcha na hora.",
      raro:"⚠ Chega, mas fraco. Duro pela metade é o interruptor pela metade."
    },
    weight:20,category:"pressao"
  },
  {
    id:"q4",phase:2,type:"single-select",
    question:"Na hora do sexo, como você fica?",
    microcopy:"Sem desculpa. O que acontece quando precisa.",
    options:[
      {value:"firme",label:"Duro do início ao fim",icon:"💪",score:3},
      {value:"murcha",label:"Não sobe ou murcha no meio",icon:"🚨",score:0},
      {value:"pilula",label:"Só com a pílula azul",icon:"💊",score:0}
    ],
    triggers:{
      murcha:"🚨 O sangue entra mas não fica. Sobe e cai. O método liga isso de novo.",
      pilula:"🛑 Depender da pílula é o interruptor terceirizado. Dá pra ligar o seu, sem química."
    },
    weight:15,category:"pressao"
  },
  {
    id:"q5",phase:2,type:"single-select",
    question:"Você foge do sexo com medo de não conseguir?",
    microcopy:"Fugir só piora. Honestidade aqui vale o diagnóstico.",
    options:[
      {value:"nao",label:"Não, encaro numa boa",icon:"🚫",score:3},
      {value:"asvezes",label:"Às vezes invento desculpa",icon:"⚠️",score:1},
      {value:"sempre",label:"Quase sempre fujo",icon:"🛑",score:0}
    ],
    triggers:{
      sempre:"🛑 Cada fuga ensina o corpo a desligar mais. É um ciclo, e tem saída.",
      asvezes:"⚠ A desculpa de hoje vira o medo de amanhã. Dá pra cortar isso."
    },
    weight:10,category:"pressao"
  },
  {
    id:"q6",phase:3,type:"single-select",
    question:"Quando começa, quanto tempo você dura?",
    microcopy:"Da hora que entra até gozar. Sem arredondar pra cima.",
    options:[
      {value:"menos1",label:"Menos de 1 minuto",icon:"🛑",score:0},
      {value:"1a3",label:"Entre 1 e 3 minutos",icon:"🚨",score:1},
      {value:"3a7",label:"Entre 3 e 7 minutos",icon:"⚠️",score:2},
      {value:"controlo",label:"Aguento o quanto eu quiser",icon:"💪",score:3}
    ],
    triggers:{
      menos1:"🛑 Menos de 1 minuto é gozar sem comando nenhum. O interruptor do controle tá apagado.",
      "1a3":"🚨 Você goza antes de decidir. Dá pra retomar o controle."
    },
    weight:20,category:"gatilho"
  },
  {
    id:"q7",phase:3,type:"single-select",
    question:"Você goza antes de querer, sem aviso?",
    microcopy:"Aquele ponto sem volta que chega cedo demais.",
    options:[
      {value:"nunca",label:"Não, sinto chegar e seguro",icon:"✅",score:3},
      {value:"asvezes",label:"Às vezes me pega de surpresa",icon:"⚠️",score:1},
      {value:"sempre",label:"Quase sempre, sem controle",icon:"🛑",score:0}
    ],
    triggers:{
      sempre:"🛑 Sem aviso é o freio quebrado. É o sinal mais claro do controle desligado.",
      asvezes:"⚠ Te pegar de surpresa é o freio falhando. Dá pra reinstalar."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"q8",phase:3,type:"single-select",
    question:"Você consegue segurar quase no fim e voltar?",
    microcopy:"O famoso segura e volta. Ou é tudo ou nada?",
    options:[
      {value:"sim",label:"Sim, seguro e volto",icon:"💪",score:3},
      {value:"dificil",label:"Tento, mas quase sempre gozo",icon:"⚠️",score:1},
      {value:"nao",label:"É tudo ou nada, não controlo",icon:"🛑",score:0}
    ],
    triggers:{
      nao:"🛑 Tudo ou nada é freio sem ajuste. O método reinstala esse freio.",
      dificil:"⚠ Você tenta mas o freio não responde. É treinável, dia a dia."
    },
    weight:10,category:"gatilho"
  },
  {
    id:"gatilho_gate",phase:3,type:"single-select",
    question:"Vamos medir seu controle agora.",
    microcopy:"Você tá num lugar onde pode tentar uma coisa rápida e discreta?",
    options:[
      {value:"sim",label:"Sim, posso tentar agora",icon:"✅"},
      {value:"nao",label:"Agora não dá",icon:"🙈"}
    ],
    conditional:{ sim:"gatilho_test", nao:"gatilho_mirror" },
    weight:0
  },
  {
    id:"gatilho_test",phase:3,type:"single-select",isConditional:true,nextId:"q9",
    question:"Aperte o músculo de segurar o xixi com força e segure 30 segundos sem afrouxar.",
    microcopy:"Conta os segundos. O que aconteceu?",
    options:[
      {value:"falhou",label:"Não aguentei, afrouxou rápido",icon:"🛑",score:0},
      {value:"tremeu",label:"Aguentei, mas tremeu e foi difícil",icon:"⚠️",score:1},
      {value:"facil",label:"Fácil, aguentei numa boa",icon:"💪",score:3}
    ],
    triggers:{
      falhou:"🛑 Confirmado: seu freio já caiu. É por isso que você goza cedo.",
      tremeu:"⚠ Seu freio tá enfraquecendo. Ainda tem reserva, mas a janela tá fechando.",
      facil:"🔥 Raro. Você tem uma base que poucos têm na sua idade, e é justo isso que cai mais rápido se não treinar."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"gatilho_mirror",phase:3,type:"single-select",isConditional:true,nextId:"q9",
    question:"Sem problema. Vamos pela memória.",
    microcopy:"Da última vez que tentou se segurar pra não gozar, o que rolou?",
    options:[
      {value:"falhou",label:"Não consegui segurar",icon:"🛑",score:0},
      {value:"tremeu",label:"Segurei com muita dificuldade",icon:"⚠️",score:1},
      {value:"facil",label:"Controlo numa boa",icon:"💪",score:3}
    ],
    triggers:{
      falhou:"🛑 Confirmado: seu freio já caiu. É por isso que você goza cedo.",
      tremeu:"⚠ Seu freio tá enfraquecendo. Ainda tem reserva, mas a janela tá fechando.",
      facil:"🔥 Raro. Você tem uma base que poucos têm na sua idade, e é justo isso que cai mais rápido se não treinar."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"q9",phase:4,type:"multi-select",
    question:"O que ainda mantém seu interruptor desligado?",
    microcopy:"Cada um desses sabota o sangue e o nervo que ligam o interruptor.",
    minSelections:1,
    options:[
      {value:"alcool",label:"Bebo álcool toda semana",icon:"🍺"},
      {value:"cigarro",label:"Fumo ou fumei por anos",icon:"🚬"},
      {value:"sedentario",label:"Sem exercício há meses",icon:"🛋️"},
      {value:"estresse",label:"Vivo no estresse e dormindo mal",icon:"🧠"},
      {value:"nenhum",label:"Nenhum desses",icon:"✅"}
    ],
    triggers:{
      _any_except_nenhum:"🛑 Cada um desses segura seu interruptor desligado. Quanto mais marcou, mais fundo."
    },
    weight:8,category:"sabotador",scoreLogic:"count-negative"
  },
  {
    id:"q10",phase:5,type:"single-select",
    question:"Última. Por quem você quer resolver isso?",
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
  headline:"Medindo o quanto seu interruptor desligou...",
  duration:12e3,
  messages:[
    "Cruzando suas respostas com o banco de dados...",
    "Medindo o lado de FICAR DURO...",
    "Medindo o lado de DURAR...",
    "Calculando há quanto tempo seu interruptor apagou...",
    "Comparando com 17.483 homens...",
    "Isso vai mudar o que você achava do seu corpo...",
    "Montando seu plano pra religar..."
  ]
},

NAMEGATE_DATA={
  headline:"Diagnóstico pronto",
  question:"Como devo te chamar?",
  microcopy:"Só o primeiro nome. O que vem a seguir é seu, e quero te chamar pelo nome enquanto te mostro o que desligou. Fica entre nós.",
  placeholder:"Seu primeiro nome...",
  cta:"VER MEU DIAGNÓSTICO"
},

RESULT_DATA={
  headlineTemplate:"Seu diagnóstico, {name}.",
  blockZones:[
    {min:71,max:100,label:"QUASE TODO DESLIGADO",color:"#D2553F",description:"Seu interruptor está quase todo apagado. Você não fica duro e termina rápido porque o comando se foi. Religar hoje não é exagero, é a sua última janela."},
    {min:41,max:70,label:"DESLIGANDO RÁPIDO",color:"#C8893C",description:"Seu interruptor está apagando rápido. Você já perde firmeza e controle de forma clara. Dá pra religar, mas a janela está fechando."},
    {min:0,max:40,label:"JÁ COMEÇOU A DESLIGAR",color:"#C08A4A",description:"Seu interruptor ainda responde, mas já começou a apagar. Quem ignora agora é quem não consegue mais em 12 meses. Religar agora é fácil. Depois, não."}
  ],
  criticalAreas:{
    pressao:{label:"Ficar duro",icon:"🔻"},
    gatilho:{label:"Durar",icon:"⏱️"},
    sabotador:{label:"O que te sabota",icon:"🔄"}
  }
},

BRIDGE_DATA={cta:"VER COMO RELIGAR ISSO"};

const VIDEO_DATA={
  enabled:false,
  url:"",
  poster:""
};

var PROTOCOL_DATA={
  headline:"O Método Condor liga seu interruptor de novo",
  subheadline:"Sem remédio, sem bomba, sem cirurgia. A Respiração do Condor é o que liga o interruptor que desligou depois dos 35. Guiado dia a dia no app, no seu celular, pro seu caso.",
  features:[
    {icon:"🔺",title:"Fica duro em 21 dias",desc:"O lado da ereção volta a ligar. Você fica duro quando quiser, com a firmeza dos 25, sem pílula azul."},
    {icon:"⏱️",title:"Dura o quanto quiser",desc:"Você reinstala o freio. Decide a hora de gozar, em vez de terminar antes do tempo. Durar vira escolha sua."},
    {icon:"🌄",title:"A Respiração do Condor",desc:"O que os homens dos Andes usam pra nunca desligar o interruptor. 6 minutos por dia, guiado no app."},
    {icon:"🔥",title:"A vontade volta junto",desc:"Quando o interruptor liga, o tesão volta com força. Sua parceira percebe antes de você falar."}
  ],
  seal:"Seu plano já está montado no app, pro seu diagnóstico. Acesso restrito.",
  cta:"QUERO LIGAR ISSO DE NOVO"
},

TESTIMONIALS=[
  {initials:"César M.",age:52,occupation:"Dono de Construtora, São Paulo",photo:"img/testimonials/cesar-m.jpg",
   text:"Achei que era idade. Era o interruptor. 15 dias religando e minha esposa perguntou o que eu tava tomando. Voltei a ficar duro.",
   result:"Duro de novo em 15 dias",highlight:"+ Ereção firme",painTags:["de","parceira","tudo","confianza"]},
  {initials:"Roberto Q.",age:44,occupation:"Investidor, Rio de Janeiro",photo:"img/testimonials/roberto-q.jpg",
   text:"Eu murchava no meio e gozava em 2 minutos. Liguei os dois lados. Hoje fico duro e duro o quanto quero.",
   result:"Duro e durando",highlight:"+ Interruptor ligado",painTags:["ambos","eu_mesmo","tudo"]},
  {initials:"Sergio O.",age:60,occupation:"Ex-Militar, Curitiba",photo:"img/testimonials/sergio-o.jpg",
   text:"60 anos, dependia da pílula. Hoje acordo duro sem nada. O interruptor voltou a ligar sozinho.",
   result:"Sem pílula aos 60",highlight:"+ Duro naturalmente",painTags:["de","parceira","eu_mesmo","tudo"]},
  {initials:"Marcos T.",age:48,occupation:"Caminhoneiro, Belo Horizonte",photo:"img/testimonials/marcos-t.jpg",
   text:"Gozava cedo e minha esposa nem vinha mais pro quarto. Reinstalei o freio e hoje aguento a noite toda.",
   result:"Aguento a noite toda",highlight:"+ Controle de volta",painTags:["ep","parceira","tudo"]},
  {initials:"Ricardo F.",age:55,occupation:"Advogado, Brasília",photo:"img/testimonials/ricardo-f.jpg",
   text:"Gozava em 1 minuto. Hoje eu decido a hora e ela pede mais.",
   result:"De 1 minuto pra 40+",highlight:"+ Controle total",painTags:["ep","eu_mesmo","parceira","tudo"]},
  {initials:"Pablo S.",age:41,occupation:"Empresário, São Paulo",photo:"img/testimonials/pablo-s.jpg",
   text:"Não ficava duro e não tinha controle. 60 dias religando e os dois voltaram. Minha esposa não acreditava.",
   result:"Os dois de volta",highlight:"+ Interruptor ligado inteiro",painTags:["ambos","eu_mesmo","tudo","confianza"]},
  {initials:"Andrés L.",age:49,occupation:"Engenheiro, Porto Alegre",photo:"img/testimonials/andres-l.jpg",
   text:"30 dias e minha esposa olhou e disse: o que aconteceu com você? Voltei a ficar duro.",
   result:"Religado em 30 dias",highlight:"+ Ereção de volta",painTags:["de","eu_mesmo","parceira","tudo","confianza"]},
  {initials:"Felipe R.",age:53,occupation:"Médico, Salvador",photo:"img/testimonials/felipe-r.jpg",
   text:"Sou médico e não resolvia o meu. Esse método fez o que 5 anos de consulta não fizeram.",
   result:"Funcionou onde a medicina falhou",highlight:"+ Mecanismo certo",painTags:["ambos","eu_mesmo","parceira","tudo"]},
  {initials:"Jonathan P.",age:46,occupation:"Professor, Florianópolis",photo:"img/testimonials/jonathan-p.jpg",
   text:"O sangue voltou a chegar com força e eu voltei a ficar duro. Minha parceira notou na primeira semana.",
   result:"Duro em 7 dias",highlight:"+ Ereção firme",painTags:["de","parceira","tudo"]},
  {initials:"Gilberto A.",age:58,occupation:"Empresário, Goiânia",photo:"img/testimonials/gilberto-a.jpg",
   text:"3 semanas: duro como pedra e durando o que ela nunca viu. Não quer sair da cama.",
   result:"Duro e durando",highlight:"+ Performance total",painTags:["ambos","parceira","eu_mesmo","tudo"]},
  {initials:"Carlos V.",age:43,occupation:"Policial, Recife",photo:"img/testimonials/carlos-v.jpg",
   text:"Antes gozava antes de começar. Reinstalei o freio e hoje duro o quanto quero. Salvou meu casamento.",
   result:"Controle de volta",highlight:"+ Durando muito mais",painTags:["ep","eu_mesmo","tudo","confianza"]},
  {initials:"Daniel M.",age:37,occupation:"Desenvolvedor, Fortaleza",photo:"img/testimonials/daniel-m.jpg",
   text:"37 anos e já falhava. 3 semanas religando e voltei a ficar duro com força.",
   result:"Religado aos 37",highlight:"+ Interruptor ligado a tempo",painTags:["ambos","eu_mesmo","tudo","confianza"]},
  {initials:"Héctor M.",age:61,occupation:"Aposentado, Manaus",photo:"img/testimonials/hector-m.jpg",
   text:"61 anos, 5 anos sem conseguir. 3 semanas e voltei a ficar duro. Ela chorou.",
   result:"Religado aos 61",highlight:"+ 5 anos recuperados",painTags:["de","parceira","eu_mesmo","tudo"]}
];

function getFilteredTestimonials(e){
  var key=(e||"").toString().toLowerCase();
  var o=TESTIMONIALS.filter(function(t){return t.painTags&&t.painTags.indexOf(key)>-1;});
  return (o.length>=3?o:TESTIMONIALS).slice().sort(function(){return Math.random()-.5;}).slice(0,3);
}

const PRICING_DATA={
  urgencyText:"Esse preço some em:",
  timerMinutes:8,
  checkoutCtaMap:{
    parceira:"RECUPERAR MEU CASAMENTO HOJE",
    eu_mesmo:"VOLTAR A FICAR DURO AGORA",
    tudo:"RELIGAR TUDO EM 21 DIAS",
    confianza:"RECUPERAR MEU CORPO E MINHA CONFIANÇA",
    _default:"RELIGAR MEU INTERRUPTOR"
  },
  plans:[
    {
      id:"completo",
      name:"MÉTODO CONDOR COMPLETO",
      price:37,
      originalPrice:197,
      period:"pagamento único, acesso vitalício",
      description:"O método completo pra religar seu interruptor",
      badge:"🔓 ACESSO TOTAL",
      ctaLabel:"QUERO O MÉTODO COMPLETO",
      ctaTag:"ACESSO TOTAL",
      features:[
        "Fica duro em 21 dias, sem pílula",
        "Dura o quanto quiser, controle de volta",
        "A Respiração do Condor guiada, 6 minutos por dia",
        "App Condor montado pro seu diagnóstico",
        "Acesso vitalício, com todas as atualizações"
      ]
    }
  ],
  guarantee:{
    title:"30 dias. Se seu interruptor não ligar, eu devolvo tudo.",
    text:"Siga o método por 30 dias. Se você não voltar a ficar duro e a durar, devolvo 100%. Sem perguntas. O risco é meu.",
    icon:"🛡️"
  },
  paymentMethods:["Cartão de Crédito • PIX • Pagamento 100% Seguro 🔒"]
},

THANKYOU_DATA={
  headline:"Bem-vindo ao outro lado, {name}.",
  subheadline:"O Método Condor tá liberado. A partir de hoje, cada dia liga mais o seu interruptor.",
  steps:[
    {number:"01",title:"Acesso em menos de 5 minutos",desc:"O link chega no seu e-mail ou WhatsApp assim que o pagamento confirmar."},
    {number:"02",title:"Comece pela Respiração do Condor (Dia 1)",desc:"É o que liga o interruptor. Sem ela, nada acontece. Faça hoje."},
    {number:"03",title:"Siga exatamente como está escrito",desc:"Vai parecer simples demais. Não mude nada. O resultado está aí."},
    {number:"04",title:"Deixe o resultado falar",desc:"Em 2 a 3 semanas sua parceira vai ser a primeira a notar."}
  ],
  cta:"ACESSAR O MÉTODO AGORA"
};
