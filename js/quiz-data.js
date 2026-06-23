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
  headline:"Analisando seu mapa vascular...",
  duration:12e3,
  messages:[
    "Cruzando seus sintomas com o banco de dados...",
    "Medindo o grau de bloqueio vascular...",
    "Identificando sua janela de reversão...",
    "Calculando perda estimada de tamanho e firmeza...",
    "Comparando com 17.483 diagnósticos anteriores...",
    "Isso vai mudar o que você achava que sabia sobre seu corpo...",
    "Preparando seu protocolo personalizado..."
  ]
},

NAMEGATE_DATA={
  headline:"Análise concluída",
  question:"Como devo te chamar?",
  microcopy:"Só o seu primeiro nome. O diagnóstico que vem a seguir é seu, e eu quero te chamar pelo nome enquanto te mostro o que travou. Fica entre nós, ninguém mais vê.",
  placeholder:"Seu primeiro nome...",
  cta:"VER MEU DIAGNÓSTICO"
},

RESULT_DATA={
  headlineTemplate:"Seu diagnóstico está pronto, {name}.",
  scoreZones:[
    {
      min:0,max:35,
      label:"COMPROMETIDO",
      color:"#C44B4B",
      description:"Seus vasos estão severamente bloqueados. O sangue não chega ao pênis: tamanho reduzido, firmeza zero, duração de segundos. Mas existe um protocolo que força o sangue a voltar."
    },
    {
      min:36,max:60,
      label:"EM DECLÍNIO",
      color:"#D4940A",
      description:"Seus vasos estão se fechando. Você já perdeu tamanho visível e a duração caiu. Ainda dá pra reverter, mas a janela está se fechando."
    },
    {
      min:61,max:80,
      label:"EM RISCO SILENCIOSO",
      color:"#C9A84C",
      description:"Seus vasos ainda funcionam mas já estão perdendo eficiência. Sem intervenção, a queda vai acelerar nos próximos 12 meses. Quando perceber, vai ser mais difícil reverter."
    },
    {
      min:81,max:100,
      label:"ALERTA PRECOCE",
      color:"#7FA86B",
      description:"Seu sistema ainda responde, mas os fatores de risco já estão ativos. Sem protocolo, a queda acelera nos próximos 12 meses. O momento de agir é agora, não depois."
    }
  ],
  criticalAreas:{
    libido:{label:"Fluxo Peniano",icon:"🍆"},
    cuerpo:{label:"Gordura Estrogênica",icon:"⚖️"},
    energia:{label:"Nível de Energia",icon:"⚡"},
    sueno:{label:"Qualidade do Sono",icon:"🌙"},
    fisica:{label:"Dependência Química",icon:"💊"},
    habitos:{label:"Hábitos Destrutivos",icon:"🔄"},
    saude:{label:"Risco Medicamentoso",icon:"🏥"}
  }
},

BRIDGE_DATA={cta:"VER COMO REVERTER MEU CASO"},

PROTOCOL_DATA={
  headline:"O Protocolo de Reversão Vascular, Desenhado para o Seu Caso",
  subheadline:"Sem cirurgia, sem pílulas, sem bomba: o método que destampa os vasos e faz o sangue voltar com pressão total. Montado dia a dia no app VORTX, no seu celular, pro seu diagnóstico: você abre e já sabe exatamente o que fazer hoje.",
  features:[
    {
      icon:"🍆",
      title:"Vasos reabertos em 21 dias — tamanho de volta",
      desc:"Seu pênis está menor porque o sangue não chega. O protocolo destampa os vasos e restaura o volume perdido. Diferença visível sem pílula, sem cirurgia."
    },
    {
      icon:"⏱️",
      title:"Dure 3 vezes mais — sem terminar antes",
      desc:"O protocolo fortalece o músculo PC e regula o fluxo. Resultado: você decide quando termina. Não seu corpo."
    },
    {
      icon:"🔩",
      title:"Ereção natural, sem a pílula azul",
      desc:"Seus vasos se reabrem e o sangue enche o pênis com a pressão que você tinha aos 25 anos. Sem química, sem dependência."
    },
    {
      icon:"🔥",
      title:"Desejo de predador — vontade que não para",
      desc:"Quando os vasos abrem e os hormônios se equilibram, o desejo volta como uma onda. Sua parceira sente antes de você."
    }
  ],
  seal:"Seu protocolo já está montado no app VORTX, com base no seu diagnóstico. Acesso restrito.",
  cta:"QUERO DESTRAVAR ISSO AGORA"
},

TESTIMONIALS=[
  {
    initials:"César M.",age:52,occupation:"Dono de Construtora, São Paulo",
    photo:"img/testimonials/cesar-m.jpg",
    text:"15 dias de protocolo e minha esposa me perguntou que diabos eu estava tomando. Voltei a funcionar como se tivesse 30.",
    result:"Funcionou em 15 dias",highlight:"+ Tamanho e firmeza restaurados",
    painTags:["parceira","tudo","confianza"]
  },
  {
    initials:"Roberto Q.",age:44,occupation:"Investidor, Rio de Janeiro",
    photo:"img/testimonials/roberto-q.jpg",
    text:"Meu pênis tinha encolhido e eu terminava em 2 minutos. Era vascular. O protocolo me devolveu centímetros e controle total.",
    result:"Tamanho e duração de volta",highlight:"+ Controle total restaurado",
    painTags:["parceira","eu_mesmo","tudo"]
  },
  {
    initials:"Sergio O.",age:60,occupation:"Ex-Militar, Curitiba",
    photo:"img/testimonials/sergio-o.jpg",
    text:"60 anos. Dependia da pílula. Hoje acordo com ereção forte, sem precisar de nada. O tamanho voltou aos meus 40.",
    result:"Sem pílula aos 60 anos",highlight:"+ Vasos reabertos naturalmente",
    painTags:["parceira","eu_mesmo","tudo"]
  },
  {
    initials:"Marcos T.",age:48,occupation:"Caminhoneiro, Belo Horizonte",
    photo:"img/testimonials/marcos-t.jpg",
    text:"3 semanas de protocolo e minha esposa voltou pro quarto. Hoje aguento a noite toda.",
    result:"Duração triplicada",highlight:"+ Energia restaurada",
    painTags:["parceira","tudo"]
  },
  {
    initials:"Ricardo F.",age:55,occupation:"Advogado, Brasília",
    photo:"img/testimonials/ricardo-f.jpg",
    text:"Terminava em 1 minuto. Hoje controlo quando quero e minha esposa pede mais.",
    result:"De 1 minuto pra 40+",highlight:"+ Controle de ejaculação",
    painTags:["eu_mesmo","parceira","tudo"]
  },
  {
    initials:"Pablo S.",age:41,occupation:"Empresário, São Paulo",
    photo:"img/testimonials/pablo-s.jpg",
    text:"60 dias: a barriga sumiu, o peito desapareceu e o tamanho voltou visivelmente. Minha esposa não acreditava.",
    result:"Corpo e tamanho restaurados",highlight:"+ Estrogênio eliminado",
    painTags:["eu_mesmo","tudo","confianza"]
  },
  {
    initials:"Andrés L.",age:49,occupation:"Engenheiro, Porto Alegre",
    photo:"img/testimonials/andres-l.jpg",
    text:"30 dias de protocolo: minha esposa olhou e disse 'o que aconteceu com você?'. Voltei a ser eu.",
    result:"Reversão em 30 dias",highlight:"+ Circulação reaberta",
    painTags:["eu_mesmo","parceira","tudo","confianza"]
  },
  {
    initials:"Felipe R.",age:53,occupation:"Médico, Salvador",
    photo:"img/testimonials/felipe-r.jpg",
    text:"Sou médico e não conseguia resolver meu próprio problema. Esse protocolo fez o que 5 anos de consultas não conseguiram.",
    result:"Funcionou onde a medicina falhou",highlight:"+ Abordagem vascular comprovada",
    painTags:["eu_mesmo","parceira","tudo"]
  },
  {
    initials:"Jonathan P.",age:46,occupation:"Professor, Florianópolis",
    photo:"img/testimonials/jonathan-p.jpg",
    text:"O protocolo abriu os vasos e o sangue voltou com pressão. Minha parceira notou na primeira semana.",
    result:"Resultado visível em 7 dias",highlight:"+ Fluxo restaurado",
    painTags:["parceira","tudo"]
  },
  {
    initials:"Gilberto A.",age:58,occupation:"Empresário, Goiânia",
    photo:"img/testimonials/gilberto-a.jpg",
    text:"3 semanas: duro como touro, duração que ela nunca tinha visto. Não quer sair da cama.",
    result:"Firmeza e duração de touro",highlight:"+ Performance total",
    painTags:["parceira","eu_mesmo","tudo"]
  },
  {
    initials:"Carlos V.",age:43,occupation:"Policial, Recife",
    photo:"img/testimonials/carlos-v.jpg",
    text:"Antes terminava antes de começar. Hoje controlo e duro o que quero. VORTX salvou meu casamento.",
    result:"Ejaculação sob controle",highlight:"+ Performance restaurada",
    painTags:["eu_mesmo","tudo","confianza"]
  },
  {
    initials:"Daniel M.",age:37,occupation:"Desenvolvedor, Fortaleza",
    photo:"img/testimonials/daniel-m.jpg",
    text:"Tinha 37 e achava que era jovem demais pra isso. 3 semanas e a firmeza voltou com força total.",
    result:"Revertido aos 37",highlight:"+ Vasos reabertos a tempo",
    painTags:["eu_mesmo","tudo","confianza"]
  },
  {
    initials:"Héctor M.",age:61,occupation:"Aposentado, Manaus",
    photo:"img/testimonials/hector-m.jpg",
    text:"61 anos. 5 anos sem funcionar. 3 semanas de protocolo — voltei com tamanho, firmeza e duração. Ela chorou.",
    result:"Reverteu tudo aos 61",highlight:"+ 5 anos de dano revertidos",
    painTags:["parceira","eu_mesmo","tudo"]
  }
];

function getFilteredTestimonials(e){
  const o=TESTIMONIALS.filter(o=>o.painTags&&o.painTags.includes(e));
  return[...o.length>=3?o:TESTIMONIALS].sort(()=>Math.random()-.5).slice(0,3)
}

const PRICING_DATA={
  urgencyText:"Esse preço desaparece em:",
  timerMinutes:8,
  checkoutCtaMap:{
    parceira:"RECUPERAR MEU CASAMENTO HOJE",
    eu_mesmo:"VOLTAR A SER HOMEM AGORA",
    tudo:"REVERTER TUDO EM 60 DIAS",
    confianza:"RECUPERAR MEU CORPO E MINHA CONFIANÇA",
    _default:"LIBERAR MEU PROTOCOLO"
  },
  plans:[
    {
      id:"esencial",
      name:"ACESSO ESSENCIAL",
      price:17,
      originalPrice:97,
      period:"pagamento único",
      description:"Módulo vascular básico apenas",
      badge:"",
      ctaLabel:"QUERO O ACESSO ESSENCIAL",
      ctaTag:"VERSÃO BÁSICA",
      isAnchor:true,
      features:[
        "Protocolo vascular básico — módulo 1 apenas",
        "Sem módulo de duração nem controle avançado",
        "Sem protocolo de sono hormonal",
        "Sem guia de eliminação de gordura estrogênica",
        "Sem atualizações futuras incluídas"
      ]
    },
    {
      id:"vitalicio",
      name:"PROTOCOLO COMPLETO — ACESSO VITALÍCIO",
      price:37,
      originalPrice:547,
      period:"pagamento único, acesso vitalício",
      description:"O protocolo completo de reversão vascular",
      badge:"🔓 MELHOR ESCOLHA",
      ctaLabel:"QUERO O PROTOCOLO COMPLETO",
      ctaTag:"ACESSO TOTAL",
      features:[
        "Vasos reabertos em 21 dias — tamanho e firmeza sem pílula",
        "Durar 3 vezes mais — controle total de ejaculação",
        "Ereção matinal de volta — sem dependência química",
        "Eliminação de gordura estrogênica — corpo voltando a responder",
        "Protocolo de sono profundo — produção hormonal noturna",
        "Acesso vitalício — todas as atualizações incluídas"
      ]
    }
  ],
  guarantee:{
    title:"30 dias de teste. Se não funcionar, devolvo tudo — sem perguntas.",
    text:"Siga o protocolo por 30 dias. Se seu tamanho, sua firmeza e sua duração não melhorarem de forma visível, devolvo 100% do seu dinheiro. Sem perguntas, sem burocracia. O risco é todo meu.",
    icon:"🛡️"
  },
  paymentMethods:["Cartão de Crédito • PIX • Pagamento 100% Seguro 🔒"]
},

THANKYOU_DATA={
  headline:"Bem-vindo ao outro lado, {name}.",
  subheadline:"O protocolo de reversão vascular está liberado — a partir de agora cada dia conta.",
  steps:[
    {number:"01",title:"Acesso chega em menos de 5 minutos",desc:"O link chega no seu WhatsApp assim que o pagamento for confirmado."},
    {number:"02",title:"Comece pelo Protocolo Vascular (Módulo 1)",desc:"É a base de tudo: sem destampar os vasos, nada funciona. Leia hoje."},
    {number:"03",title:"Siga exatamente como está escrito",desc:"Vai parecer simples demais — não mude nada. Aí está o resultado."},
    {number:"04",title:"Não conte pra ninguém, deixe o resultado falar",desc:"Em 2-3 semanas sua parceira vai ser a primeira a notar."}
  ],
  cta:"ACESSAR O PROTOCOLO AGORA"
};
