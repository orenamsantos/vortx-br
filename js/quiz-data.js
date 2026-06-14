const BRAND={name:"VORTX",tagline:"Recuperação da Masculinidade",year:(new Date).getFullYear()},

GATE_DATA={
  headline:"Não é a idade. Não é a cabeça. É vascular. E seu urologista não vai te dizer.",
  subheadline:"Se você passou dos 35 e percebeu que algo mudou. Tamanho menor, firmeza fraca, duração caindo. Não é hormônio. Não é psicológico. O Dr. Marcus Hale, cirurgião vascular com 23 anos de experiência, descobriu a causa que a medicina tradicional ignora. Faça o teste de 2 minutos e descubra seu nível exato.",
  cta:"DESCOBRIR MEU NÍVEL AGORA",
  timerStrip:"🔒 Teste anônimo • Resultado imediato na tela • Sem cadastro, sem cobrança",
  socialProof:"17.483 homens já reverteram. Resultado médio: 21 dias.",
  privacySeal:"100% confidencial • Anônimo • Ninguém vai saber",
  badge:"17.483 homens reverteram em média em 21 dias"
},

PHASES=[
  {id:1,label:"VALIDAÇÃO",steps:[1,2]},
  {id:2,label:"PERFIL",steps:[4]},
  {id:3,label:"SINTOMAS",steps:[5,6,7,8,9]},
  {id:4,label:"HÁBITOS",steps:[10]},
  {id:5,label:"VEREDITO",steps:[12]}
],

STEPS=[
  {
    id:1,phase:1,type:"single-select",
    question:"Vamos ser honestos por 10 segundos.",
    microcopy:"Passou dos 35 e algo mudou. O que mais pesa em você?",
    options:[
      {value:"si_molesta",label:"Perdi firmeza ou tamanho",icon:"🔥"},
      {value:"si_activo",label:"Não duro como antes",icon:"⏱️"},
      {value:"si_empezando",label:"Sinto que tá começando agora",icon:"⚡"}
    ],
    weight:0
  },
  {
    id:2,phase:1,type:"single-select",
    question:"73% dos homens acima de 35 têm isso. E os médicos não detectam.",
    microcopy:"O problema não é hormonal. É 3 vezes mais comum do que dizem. Você sabia?",
    options:[
      {value:"no_sabia",label:"Não, nunca tinha ouvido falar",icon:"🧐"},
      {value:"sospechaba",label:"Suspeitava de algo assim",icon:"🔍"},
      {value:"quiero_saber",label:"Quero saber exatamente o que é",icon:"🔓"}
    ],
    triggers:{
      "no_sabia":"🛑 Isso é exatamente o que as farmacêuticas não querem que você saiba. Continue. Você vai entender.",
      "sospechaba":"⚡ Sua intuição está certa. O teste vai confirmar exatamente o que está acontecendo no seu corpo.",
      "quiero_saber":"🔥 Bom. Responda as próximas perguntas com honestidade. O diagnóstico depende disso."
    },
    weight:0
  },
  {
    id:4,phase:2,type:"single-select",
    question:"Quantos anos você tem?",
    microcopy:"A velocidade do dano muda brutalmente de uma faixa para outra.",
    options:[
      {value:"35-39",label:"35 a 39 anos",icon:"⚠️"},
      {value:"40-44",label:"40 a 44 anos",icon:"⚠️"},
      {value:"45-49",label:"45 a 49 anos",icon:"🚨"},
      {value:"50-54",label:"50 a 54 anos",icon:"🚨"},
      {value:"55-59",label:"55 a 59 anos",icon:"🛑"},
      {value:"60-65",label:"60 a 65 anos",icon:"🛑"}
    ],
    triggers:{
      "35-39":"⚠ A maioria percebe depois dos 40. Você está descobrindo antes. Isso muda tudo.",
      "40-44":"⚠ Nessa idade o corpo já começou a reduzir o fluxo. Em 3 anos você não vai se reconhecer.",
      "45-49":"🚨 O fluxo já caiu pela metade e o encolhimento já é visível. Mas ainda tem solução.",
      "50-54":"🛑 Depois dos 50 o corpo perdeu metade da capacidade. Existe uma forma de reverter.",
      "55-59":"🛑 Faixa crítica. Os vasos estão se fechando mês a mês. Mas você ainda está aqui.",
      "60-65":"🛑 Situação grave. Vasos quase bloqueados, mas homens de 63 anos já reverteram com o protocolo."
    },
    weight:0
  },
  {
    id:5,phase:3,type:"single-select",
    question:"O que mais te corrói?",
    microcopy:"Ninguém vai ver. Só você e eu.",
    options:[
      {value:"libido",label:"Perdeu tamanho, firmeza ou os dois",icon:"🔥"},
      {value:"cuerpo",label:"Barriga cresceu, músculo sumiu",icon:"⚖️"},
      {value:"energia",label:"Sem energia, destruído todo dia",icon:"⚡"},
      {value:"mental",label:"Sem fogo, sem vontade de nada",icon:"🧠"}
    ],
    weight:0
  },
  {
    id:6,phase:3,type:"single-select",
    question:"Quando foi a última vez que você acordou com ereção sem precisar de nada?",
    microcopy:"Ereção matinal forte = sangue chegando com pressão. Se parou, o problema já está avançado.",
    options:[
      {value:"siempre",label:"Todo dia, sem falta",icon:"✅",score:3},
      {value:"raro",label:"Raramente, só com sorte",icon:"⚠️",score:1},
      {value:"nunca",label:"Faz anos que não acontece",icon:"🛑",score:0}
    ],
    triggers:{
      nunca:"🛑 Sem ereção matinal os vasos estão bloqueados. Por isso parece menor. O protocolo reverte isso.",
      raro:"⚠ Vasos comprometidos. O sangue chega mas sem pressão: tamanho reduzido, firmeza fraca."
    },
    weight:20,category:"libido"
  },
  {
    id:7,phase:3,type:"single-select",
    question:"Na hora H, como você está?",
    microcopy:"Sem desculpas. O que acontece quando você precisa render?",
    options:[
      {value:"toro",label:"Duro do início ao fim, sempre",icon:"💪",score:3},
      {value:"falho",label:"Não fica em pé ou preciso da pílula",icon:"🚨",score:0},
      {value:"fujo",label:"Evito, tenho medo de falhar",icon:"🏃",score:0}
    ],
    triggers:{
      fujo:"🛑 Fugir da sua parceira destrói um homem por dentro. Quanto mais foge, pior fica. Mas tem saída.",
      falho:"🚨 O sangue entra mas não fica. Vasos fracos. O protocolo corrige exatamente isso."
    },
    weight:15,category:"libido"
  },
  {
    id:8,phase:3,type:"multi-select",
    question:"Se olhe agora. O que você vê?",
    microcopy:"Cada quilo de barriga fabrica hormônio feminino e rouba sangue do pênis.",
    minSelections:1,
    options:[
      {value:"barriga",label:"Barriga grande, dura ou mole",icon:"⚖️"},
      {value:"peito",label:"Peito inchado, parecido com seios",icon:"🍎"},
      {value:"braco",label:"Braços finos, sem músculo",icon:"📏"},
      {value:"rosto",label:"Rosto inchado, sem definição",icon:"🌝"},
      {value:"nenhuma",label:"Nenhuma dessas. Estou bem",icon:"✅"}
    ],
    triggers:{
      _any_except_nenhuma:"🛑 Essa gordura fabrica hormônio feminino dentro de você agora. É o que encolhe, amolece e tira o controle."
    },
    weight:10,category:"cuerpo",scoreLogic:"count-negative"
  },
  {
    id:9,phase:3,type:"single-select",
    question:"Já precisou da pílula azul para funcionar?",
    microcopy:"Cada vez que você usa, seu corpo aprende a não funcionar sozinho.",
    options:[
      {value:"nao",label:"Nunca precisei",icon:"🚫",score:3},
      {value:"asvezes",label:"Já usei ou tenho por garantia",icon:"💊",score:1},
      {value:"viciado",label:"Sem ela, nem tento mais",icon:"🚨",score:0}
    ],
    triggers:{
      viciado:"🛑 Seu corpo criou dependência. Sem a pílula, nada funciona. Mas dá pra reativar sem química.",
      asvezes:"⚠ Ter ela 'por garantia' é o primeiro passo pra virar refém. Em 2 anos, sem ela, nada vai responder."
    },
    weight:10,category:"fisica"
  },
  {
    id:10,phase:4,type:"multi-select",
    question:"Quais desses hábitos você tem?",
    microcopy:"Cada um deles fecha os vasos que alimentam o pênis por dentro.",
    minSelections:1,
    options:[
      {value:"alcool",label:"Bebo álcool toda semana",icon:"🍺"},
      {value:"cigarro",label:"Fumo ou fumei por anos",icon:"🚬"},
      {value:"remedio",label:"Medicação crônica (pressão, etc.)",icon:"💊"},
      {value:"sedentario",label:"Sem exercício há meses",icon:"🛋️"},
      {value:"nenhum",label:"Nenhum desses",icon:"✅"}
    ],
    triggers:{
      _any_except_nenhum:"🛑 Cada um desses hábitos fecha os vasos do pênis. Quantos mais marcou, mais bloqueado está."
    },
    weight:8,category:"habitos",scoreLogic:"count-negative"
  },
  {
    id:12,phase:5,type:"single-select",
    question:"Última pergunta. Por quem você está fazendo isso?",
    microcopy:"Guarda esse motivo. Daqui a 2 minutos ele vai ser o que te faz começar hoje, e não 'segunda que vem'.",
    options:[
      {value:"parceira",label:"Pela minha parceira. Quero voltar à altura",icon:"💑"},
      {value:"eu_mesmo",label:"Por mim. Quero me sentir homem de novo",icon:"🦾"},
      {value:"tudo",label:"Por tudo — quero minha vida de volta",icon:"🔥"},
      {value:"confianza",label:"Pelos dois. Quero meu corpo e confiança",icon:"💪"}
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
