# CONDOR Funnel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever o funil VORTX como CONDOR, hiper-focado em disfunção erétil (DE) e ejaculação precoce (EP), com mecanismo "Circuito Adormecido", quiz ramificado em 3 rotas, medidor de bloqueio, teste do gatilho sem perdedor, oferta única R$37 e slot de vídeo, sem tocar no tracking.

**Architecture:** Funil estático (HTML/CSS/JS). O conteúdo vive em `js/quiz-data.js` (dados/copy) e a lógica em `js/app.js` (engine de quiz, branching condicional já existente, score, render de resultado/preço/checkout). A reescrita é majoritariamente de dados (quiz-data) mais ajustes cirúrgicos de lógica (app.js) para rota, medidor de bloqueio e teste do gatilho. Checkout segue LastLink one-click com passagem de tracking intacta.

**Tech Stack:** HTML, CSS (styles.css + .min), Vanilla JS (app.js + .min, quiz-data.js + .min), GTM/Stape (NÃO TOCAR), LastLink checkout.

---

## Disciplinas do repo (valem em TODA tarefa de código)

1. **Embarque do .min:** o HTML carrega `js/app.min.js`, `js/quiz-data.min.js`, `css/styles.min.css`. Hoje os `.min` de JS são byte-idênticos aos fontes. Depois de editar o fonte, sincronize o `.min` copiando o fonte por cima:
   - `cp js/quiz-data.js js/quiz-data.min.js`
   - `cp js/app.js js/app.min.js`
   - CSS: o `styles.min.css` é minificado de verdade; edite `styles.css` e regenere o `.min` (ver Task 9) ou edite ambos a mão para mudanças pequenas.
2. **Cache busting:** sempre que mudar um arquivo embarcado, suba o `?v=` dele no `index.html`:
   - `js/quiz-data.min.js?v=19` -> `?v=20`
   - `js/app.min.js?v=24` -> `?v=25`
   - `css/styles.min.css?v=15` -> `?v=16`
3. **NÃO TOCAR (golden rule de tracking):** o stub inline no `<head>` do index.html (sck, fbclid/fbc/ttclid/ttp/fbp/utm, `vortxTrack`, `vortxGetAttribution`, `vortxIsLegitimateConversionPage`), o snippet GTM, e TODA a lógica de montagem da `checkoutUrl` em `app.js` (linhas ~1634-1709). Só é permitido trocar a STRING base do produto LastLink e os textos. Eventos `begin_checkout`/`view_pricing`/`quiz_complete` permanecem.
4. **Verificação (não há framework de teste neste repo):** cada tarefa termina com um walkthrough no navegador via servidor local `python -m http.server 8080` na raiz do repo e checagem do `dataLayer` no console quando o tracking for relevante. Nada de afirmar "funciona" sem abrir e clicar.
5. **Sem tells de IA na escrita:** sem travessão na copy.

---

## File Structure

- `index.html` — gate estático (copy do gancho Condor), `<title>`/meta, versões `?v=`. Modificar.
- `js/quiz-data.js` (+ `.min`) — todo o conteúdo: BRAND, GATE_DATA, PHASES, STEPS, LOADING_DATA, NAMEGATE_DATA, RESULT_DATA, PROTOCOL_DATA, TESTIMONIALS, PRICING_DATA, THANKYOU_DATA, e novos: VIDEO_DATA, GATILHO copy. Reescrever conteúdo.
- `js/app.js` (+ `.min`) — ajustes de lógica: set de `state.route` na Q1, medidor de bloqueio ao vivo, render de resultado por rota e em chave negativa, teste do gatilho (INTERSTITIALS/steps condicionais), render de preço single-plan, slot de vídeo na revelação. Modificar pontualmente.
- `css/styles.css` (+ `.min`) — classes do medidor de bloqueio e do slot de vídeo; rebrand de tokens se necessário. Modificar.
- LastLink (externo, manual do Flavio) — criar produtos (principal + 3 bumps + upsell + downsell + cross) e devolver os product codes para fiar nas URLs.

---

## Task 0: Salvaguarda e rollback

**Files:** nenhum (git).

- [ ] **Step 1: Confirmar branch e tag de rollback**

Run:
```bash
cd "/c/Users/Flavio Souza/vortx-br"
git checkout feat/condor-redesign
git tag rollback/pre-condor main
git tag
```
Expected: branch `feat/condor-redesign` ativa, tag `rollback/pre-condor` apontando pro último commit estável da `main`.

- [ ] **Step 2: Registrar procedimento de rollback no topo do plano (já documentado)**

Rollback = `git checkout main && <republish>` ou reverter o merge. A tag `rollback/pre-condor` garante o ponto de retorno. Sem código.

---

## Task 1: Rebrand de fachada (CONDOR) no gate e meta

**Files:**
- Modify: `index.html` (linhas 7-9 title/meta, 42-52 gate estático)
- Modify: `js/quiz-data.js` (BRAND linha 1, GATE_DATA linhas 3-11)

- [ ] **Step 1: Trocar BRAND e GATE_DATA em quiz-data.js**

Substituir o bloco BRAND + GATE_DATA por:
```js
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
```

- [ ] **Step 2: Espelhar o gate estático em index.html**

Em `index.html`, dentro de `<section id="gate">`, trocar:
- `.gate-badge` para: `O circuito que a vida moderna desliga depois dos 35`
- `.gate-headline` (h1) para: `Por que homens de 70 anos a 4.500m nos Andes nunca falham na cama nem terminam cedo?`
- `.gate-subheadline` para o texto da subheadline acima.
- `#btn-start` para: `DESCOBRIR MEU NÍVEL DE BLOQUEIO`
- `.gate-social-count` para: `17.483 homens já reativaram o circuito. Tempo médio: 21 dias.`

O `.gate-logo` continua `VORTX<span></span>`; trocar o texto para `CONDOR<span></span>`.

- [ ] **Step 3: Title e meta**

Em `index.html` linhas 7-8:
```html
<title>CONDOR | O circuito que a vida moderna desliga (e como reacender em 21 dias)</title>
<meta name="description" content="Não é idade, não é cabeça, não é hormônio. É um circuito que desliga depois dos 35 e tira sua ereção e seu controle. Teste anônimo de 2 minutos mede quanto do seu já apagou.">
```

- [ ] **Step 4: Sync min + cache bump**

```bash
cp js/quiz-data.js js/quiz-data.min.js
```
Em `index.html`: `quiz-data.min.js?v=19` -> `?v=20`.

- [ ] **Step 5: Verificar no navegador**

```bash
python -m http.server 8080
```
Abrir `http://localhost:8080`. Esperado: gate mostra marca CONDOR, headline do Condor/Andes/Vasquez, botão "DESCOBRIR MEU NÍVEL DE BLOQUEIO". Sem erro no console.

- [ ] **Step 6: Commit**
```bash
git add index.html js/quiz-data.js js/quiz-data.min.js
git commit -m "feat(condor): rebrand do gate (marca Condor, gancho Andes/Vasquez)"
```

---

## Task 2: Reescrever STEPS (quiz DE+EP) e PHASES

**Files:**
- Modify: `js/quiz-data.js` (PHASES linhas 13-19, STEPS linhas 21-174)

- [ ] **Step 1: Trocar PHASES**

```js
PHASES=[
  {id:1,label:"VALIDAÇÃO",steps:["q1","q2"]},
  {id:2,label:"PRESSÃO",steps:["q3","q4","q5"]},
  {id:3,label:"GATILHO",steps:["q6","q7","q8"]},
  {id:4,label:"SABOTADOR",steps:["q9"]},
  {id:5,label:"VEREDITO",steps:["q10"]}
],
```

- [ ] **Step 2: Trocar STEPS pelo conjunto DE+EP (com `route` na Q1)**

```js
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
    microcopy:"Ereção matinal forte = pressão chegando. Se sumiu, o circuito da pressão já caiu.",
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
      sempre:"🛑 Sem aviso = gatilho sem freio. É o sinal mais claro do circuito do controle apagado.",
      asvezes:"⚠ Te pegar de surpresa é o freio falhando. Dá pra reinstalar o comando."
    },
    weight:15,category:"gatilho"
  },
  {
    id:"q8",phase:3,type:"single-select",
    question:"Você consegue parar quase no fim e voltar?",
    microcopy:"O famoso 'segura e volta'. Ou é tudo ou nada?",
    options:[
      {value:"sim",label:"Sim, consigo segurar e voltar",icon:"💪",score:3},
      {value:"dificil",label:"Tento, mas quase sempre falho",icon:"⚠️",score:1},
      {value:"nao",label:"É tudo ou nada, não controlo",icon:"🛑",score:0}
    ],
    triggers:{
      nao:"🛑 'Tudo ou nada' é o gatilho sem modulação. O protocolo reinstala esse freio.",
      dificil:"⚠ Você tenta mas o freio não responde. É treinável, dia a dia."
    },
    weight:10,category:"gatilho"
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
      {value:"estresse",label:"Vivo no estresse / dormindo mal",icon:"🧠"},
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
    microcopy:"Guarda esse motivo. Em 2 minutos ele é o que te faz começar hoje, não 'segunda que vem'.",
    options:[
      {value:"parceira",label:"Pela minha parceira",icon:"💑"},
      {value:"eu_mesmo",label:"Por mim, quero me sentir homem de novo",icon:"🦾"},
      {value:"tudo",label:"Por tudo, quero minha vida de volta",icon:"🔥"},
      {value:"confianza",label:"Pelos dois, corpo e confiança",icon:"💪"}
    ],
    weight:0
  }
],
```

- [ ] **Step 3: Ajustar persistência que assume ids numéricos**

Em `app.js` `tryResumeProgress` (linha ~170 e ~182) há `data.currentStepId || 3`. Como os ids viraram strings (`"q1"`...), trocar os fallbacks de `3` para `"q1"`:
- linha ~170: `Você está no passo ${data.currentStepId || "1"} de ${STEPS.length}.` (usar índice humano simples)
- linha ~182: `state.currentStepId = data.currentStepId || "q1";`

E em `getStepById` (linha ~213) já há `s.id === id || s.id === String(id)`, que cobre string. OK.

- [ ] **Step 4: Sync min + cache bump**
```bash
cp js/quiz-data.js js/quiz-data.min.js
cp js/app.js js/app.min.js
```
`index.html`: `quiz-data.min.js?v=20` -> `?v=21`, `app.min.js?v=24` -> `?v=25`.

- [ ] **Step 5: Verificar no navegador**

Abrir, iniciar o quiz, responder Q1..Q10. Esperado: 10 perguntas novas aparecem na ordem, triggers inline disparam, barra de progresso por fase (VALIDAÇÃO/PRESSÃO/GATILHO/SABOTADOR/VEREDITO) avança, sem erro no console. (O teste do gatilho entra na Task 4; aqui Q6-Q8 são perguntas normais.)

- [ ] **Step 6: Commit**
```bash
git add index.html js/quiz-data.js js/quiz-data.min.js js/app.js js/app.min.js
git commit -m "feat(condor): reescreve quiz para DE+EP (10 perguntas, 5 fases)"
```

---

## Task 3: Rota DE/EP/ambos (state.route + personalização base)

**Files:**
- Modify: `js/app.js` (state init ~linha 81; bindStepEvents/advanceStep onde a resposta é gravada)

- [ ] **Step 1: Adicionar `route` ao state**

No objeto `state` (perto da linha 81), adicionar:
```js
    route: "ambos",
```

- [ ] **Step 2: Setar a rota quando a Q1 é respondida**

Em `app.js`, na função que grava a resposta de single-select (dentro de `bindStepEvents`, no handler de click do card, perto da linha 562-578), após gravar `state.answers[step.id] = value;` adicionar:
```js
        if (step.id === "q1") {
          var opt = step.options.find(function(o){ return o.value === value; });
          state.route = (opt && opt.route) || "ambos";
        }
```

- [ ] **Step 3: Helper de rota para copy condicional**

Adicionar perto dos helpers (após `injectName`, ~linha 219):
```js
  function byRoute(de, ep, ambos) {
    if (state.route === "DE") return de;
    if (state.route === "EP") return ep;
    return ambos;
  }
```

- [ ] **Step 4: Sync min + cache bump**
```bash
cp js/app.js js/app.min.js
```
`index.html`: `app.min.js?v=25` -> `?v=26`.

- [ ] **Step 5: Verificar**

Abrir o quiz, no console rodar após responder a Q1: `console.log(window)` não é trivial (state é privado). Em vez disso, adicionar TEMPORARIAMENTE `window.__condorState = state;` no fim de `init()`, recarregar, responder Q1 com cada opção e checar `__condorState.route` no console (DE/EP/ambos). Remover a linha temporária antes do commit.

- [ ] **Step 6: Commit**
```bash
git add js/app.js js/app.min.js index.html
git commit -m "feat(condor): captura rota DE/EP/ambos na Q1 + helper byRoute"
```

---

## Task 4: Teste do Gatilho (sem perdedor, com porta de fuga)

**Files:**
- Modify: `js/quiz-data.js` (adicionar steps condicionais do gatilho ao array STEPS, logo após q8)
- Modify: `js/app.js` (garantir que `buildStepOrder` e `advanceStep` conduzem o branching; INTERSTITIALS)

- [ ] **Step 1: Adicionar 3 steps do gatilho em STEPS (após q8, antes de q9)**

```js
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
      {value:"falhou",label:"Não aguentei / afrouxou rápido",icon:"🛑",score:0},
      {value:"tremeu",label:"Aguentei, mas tremeu / foi difícil",icon:"⚠️",score:1},
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
```

- [ ] **Step 2: Garantir branching condicional para frente no engine**

No `app.js`, `buildStepOrder` (linha ~208) já exclui `isConditional`. O `advanceStep` (linha ~913-929) já trata `currentStep.conditional[answer]`. Confirmar que, ao entrar num step condicional (gatilho_test/mirror), o avanço seguinte vá para `nextId`. Ajustar `advanceStep` para honrar `nextId` quando presente:

Logo no início de `advanceStep`, após `const currentStep = getCurrentStep();`:
```js
    if (currentStep && currentStep.nextId) {
      saveProgress();
      var nIdx = stepOrder.findIndex(function(s){ return s.id === currentStep.nextId; });
      if (nIdx >= 0) {
        state.currentStepIndex = nIdx;
        renderStep();
        return;
      }
    }
```

E para o salto via `conditional` (de gatilho_gate para um step `isConditional` fora do stepOrder), ajustar o bloco condicional existente para inserir o step alvo e renderizá-lo diretamente. Substituir o bloco `if (currentStep?.conditional)` por:
```js
    if (currentStep && currentStep.conditional) {
      var answer = state.answers[currentStep.id];
      var targetId = currentStep.conditional[answer];
      if (targetId) {
        var target = getStepById(targetId);
        if (target) {
          // insere o step condicional logo após o atual no stepOrder (se ainda não estiver)
          if (stepOrder.indexOf(target) === -1) {
            stepOrder.splice(state.currentStepIndex + 1, 0, target);
          }
          state.currentStepIndex++;
          saveProgress();
          renderStep();
          return;
        }
      }
    }
```

- [ ] **Step 3: Sync min + cache bump**
```bash
cp js/quiz-data.js js/quiz-data.min.js
cp js/app.js js/app.min.js
```
`index.html`: `quiz-data.min.js?v=21` -> `?v=22`, `app.min.js?v=26` -> `?v=27`.

- [ ] **Step 4: Verificar os dois caminhos no navegador**

Rodar o quiz duas vezes:
1. Em `gatilho_gate` escolher "Sim" -> deve cair em `gatilho_test` (texto do assoalho pélvico) -> escolher cada opção -> trigger correto -> seguir para q9.
2. Reabrir (limpar sessionStorage: `sessionStorage.clear()` no console) e escolher "Agora não dá" -> deve cair em `gatilho_mirror` (pergunta-espelho) -> seguir para q9.
Esperado: nenhum caminho leva a "você está bem"; ambos seguem para q9. Sem erro no console.

- [ ] **Step 5: Commit**
```bash
git add index.html js/quiz-data.js js/quiz-data.min.js js/app.js js/app.min.js
git commit -m "feat(condor): teste do gatilho sem perdedor com porta de fuga (3 saidas)"
```

---

## Task 5: Medidor de Bloqueio ao vivo (sempre negativo)

**Files:**
- Modify: `js/app.js` (`updateProgressBar` ~266; `advanceStep`; novo `updateBlockMeter`)
- Modify: `css/styles.css` (+ `.min`) — classes `.block-meter*`
- Modify: `index.html` — adicionar o nó do medidor dentro de `#progress-bar`

- [ ] **Step 1: Nó do medidor no index.html**

Dentro de `<div class="progress-bar-container" id="progress-bar">`, logo após `<div class="progress-inner">...</div>`, adicionar:
```html
      <div class="block-meter" id="block-meter" aria-hidden="true">
        <div class="block-meter-label">NÍVEL DE BLOQUEIO DO CIRCUITO</div>
        <div class="block-meter-track"><div class="block-meter-fill" id="block-meter-fill"></div></div>
        <div class="block-meter-value" id="block-meter-value">0%</div>
      </div>
```

- [ ] **Step 2: CSS do medidor (styles.css)**

```css
.block-meter{padding:6px 4px 2px}
.block-meter-label{font-size:.6rem;letter-spacing:1.5px;text-transform:uppercase;color:#9A978F;margin-bottom:4px}
.block-meter-track{height:8px;border-radius:30px;background:rgba(255,255,255,.06);overflow:hidden}
.block-meter-fill{height:100%;width:0;border-radius:30px;background:linear-gradient(90deg,#D4940A,#C44B4B);transition:width .6s cubic-bezier(.16,1,.3,1)}
.block-meter-value{text-align:right;font-size:.7rem;font-weight:700;color:#C44B4B;margin-top:3px}
```

- [ ] **Step 3: Função updateBlockMeter em app.js**

Adicionar (perto de `updateProgressBar`):
```js
  function partialBlockage() {
    // mesma lógica do calculateScore, mas só sobre o respondido; retorna % de BLOQUEIO (100 - score)
    var totalWeight = 0, weightedScore = 0;
    for (var i = 0; i < STEPS.length; i++) {
      var step = STEPS[i];
      if (!step.weight || step.weight === 0) continue;
      var answer = state.answers[step.id];
      if (answer === undefined) continue;
      totalWeight += step.weight;
      if (step.type === "single-select") {
        var opt = step.options.find(function(o){ return o.value === answer; });
        if (opt && opt.score !== undefined) {
          var max = Math.max.apply(null, step.options.filter(function(o){return o.score!==undefined;}).map(function(o){return o.score;}));
          weightedScore += (max > 0 ? opt.score / max : 0) * step.weight;
        }
      } else if (step.type === "multi-select" && Array.isArray(answer)) {
        var none = answer.indexOf("nenhum") > -1 || answer.indexOf("nenhuma") > -1;
        if (none) { weightedScore += step.weight; }
        else {
          var maxOpts = step.options.filter(function(o){return o.value!=="nenhum"&&o.value!=="nenhuma";}).length;
          weightedScore += Math.max(0, 1 - answer.length / maxOpts) * step.weight;
        }
      }
    }
    var score = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
    // piso de 35% pra nunca soar "tá tranquilo" mesmo cedo no quiz
    return Math.round(Math.max(35, Math.min(96, 100 - score)));
  }

  function updateBlockMeter() {
    var fill = document.getElementById("block-meter-fill");
    var val = document.getElementById("block-meter-value");
    if (!fill || !val) return;
    var blk = partialBlockage();
    fill.style.width = blk + "%";
    val.textContent = blk + "% travado";
  }
```

- [ ] **Step 4: Chamar updateBlockMeter ao avançar e ao renderizar**

Em `renderStep` (após mostrar o step) e em `advanceStep` (após gravar resposta), chamar `updateBlockMeter();`. Também chamar dentro de `updateProgressBar` no fim para manter sincronizado.

- [ ] **Step 5: Sync min + cache bump**
```bash
cp js/app.js js/app.min.js
# regenerar styles.min.css (ver Task 9 para o método); para mudança pequena, replicar as regras no .min manualmente
```
`index.html`: `app.min.js?v=27` -> `?v=28`, `styles.min.css?v=15` -> `?v=16`.

- [ ] **Step 6: Verificar**

Rodar o quiz. Esperado: a barra de bloqueio aparece no topo, começa em 35%+ e SOBE conforme respostas ruins (ex.: "nunca", "murcha", "menos1"), texto sempre "X% travado", nunca "ativo". Respostas boas reduzem pouco, mas o piso de 35% segura. Sem erro no console.

- [ ] **Step 7: Commit**
```bash
git add index.html js/app.js js/app.min.js css/styles.css css/styles.min.css
git commit -m "feat(condor): medidor de bloqueio ao vivo (sempre negativo)"
```

---

## Task 6: Resultado e bridge em chave negativa + por rota

**Files:**
- Modify: `js/quiz-data.js` (LOADING_DATA, NAMEGATE_DATA, RESULT_DATA, BRIDGE_DATA)
- Modify: `js/app.js` (`renderResult` ~1100-1165, `showBridge` ~1181, INTERSTITIALS ~99)

- [ ] **Step 1: Reescrever LOADING/RESULT/BRIDGE data**

```js
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
  // zonas agora em chave de BLOQUEIO (quanto MAIOR, pior). Nunca "você está bem".
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

BRIDGE_DATA={cta:"VER COMO REACENDER MEU CIRCUITO"},
```

- [ ] **Step 2: Inverter o gauge do resultado para mostrar bloqueio**

Em `renderResult` (~1100-1165), trocar a fonte do número e da zona:
```js
    var blockage = Math.max(0, Math.min(100, 100 - state.score));
    var zone = RESULT_DATA.blockZones.find(function(z){ return blockage >= z.min && blockage <= z.max; }) || RESULT_DATA.blockZones[0];
```
Usar `blockage` no `animateNumber("score-display", 0, blockage, 1500)` e no preenchimento do gauge (quanto maior o bloqueio, mais cheio). O `result-score-out-of` passa a ser `% travado` em vez de `/100`. O `result-score-label` usa `zone.label`.

- [ ] **Step 3: Personalizar o texto do diagnóstico por rota**

Logo após definir `zone`, montar a descrição por rota:
```js
    var routeLine = byRoute(
      "No seu caso o golpe está na PRESSÃO: o sangue não chega com força, por isso a firmeza some.",
      "No seu caso o golpe está no GATILHO: ele dispara sem comando, por isso você termina cedo.",
      "No seu caso os DOIS lados caíram: pressão e gatilho. O circuito inteiro adormeceu."
    );
```
e concatenar `routeLine` na descrição exibida (`zone.description + " " + routeLine`).

- [ ] **Step 4: Reescrever INTERSTITIALS (afterStep usa novos ids)**

Trocar o array `INTERSTITIALS` (linha ~99) para usar os novos ids e a linguagem do circuito:
```js
  const INTERSTITIALS = [
    {
      afterStep:"q5",
      emoji:"🔬",
      headline:'Isso tem nome: <span class="highlight">Circuito Adormecido.</span>',
      getText:()=>"Não é idade nem cabeça. É um circuito que a vida moderna desliga. Acabamos de medir o lado da PRESSÃO. Agora o lado do CONTROLE.",
      stat:"Quem mapeia os dois lados agora tem 3.7x mais chance de reverter.",
      cta:"MEDIR MEU CONTROLE"
    },
    {
      afterStep:"q9",
      emoji:"🔴",
      headline:'Você vai ver um número agora. <span class="highlight">É quanto do seu circuito já apagou.</span>',
      getText:()=>"O sistema cruzou suas respostas com 17.483 diagnósticos. Alguns ficam em choque. Prepare-se.",
      stat:"A maioria nunca soube que esse número existia.",
      cta:"VER MEU DIAGNÓSTICO"
    }
  ];
```

- [ ] **Step 5: Bridge em chave negativa**

Em `showBridge` (~1181-1197), trocar os textos por linguagem de bloqueio (janela fechando proporcional ao bloqueio). Usar `var blockage = 100 - state.score;` e as faixas: `blockage >= 71` (crítica), `41-70` (curta), `<=40` (fechando). Reaproveitar a estrutura existente, só trocando as strings e a variável.

- [ ] **Step 6: Sync min + cache bump**
```bash
cp js/quiz-data.js js/quiz-data.min.js
cp js/app.js js/app.min.js
```
`index.html`: `quiz-data.min.js?v=22` -> `?v=23`, `app.min.js?v=28` -> `?v=29`.

- [ ] **Step 7: Verificar 3 rotas**

Rodar o quiz 3x, marcando na Q1 cada rota (DE/EP/ambos). Esperado: loading com mensagens novas, resultado mostra "% travado" (não /100), zona negativa correta, e a linha de diagnóstico muda conforme a rota. Interstitials aparecem após q5 e q9. Sem erro no console.

- [ ] **Step 8: Commit**
```bash
git add index.html js/quiz-data.js js/quiz-data.min.js js/app.js js/app.min.js
git commit -m "feat(condor): resultado/bridge em chave de bloqueio + diagnostico por rota"
```

---

## Task 7: Protocolo + depoimentos por rota (revelação do app) + slot de vídeo

**Files:**
- Modify: `js/quiz-data.js` (PROTOCOL_DATA, TESTIMONIALS, novo VIDEO_DATA)
- Modify: `js/app.js` (`showProtocol` ~1223; slot de vídeo)

- [ ] **Step 1: PROTOCOL_DATA rebrand Condor (features cobrindo pressão+gatilho)**

```js
PROTOCOL_DATA={
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
```

- [ ] **Step 2: VIDEO_DATA (slot, vazio até o Flavio gerar)**

```js
const VIDEO_DATA={
  enabled:false, // virar true quando o vídeo da revelação estiver pronto
  url:"", // URL do vídeo gerado no Omniflash (mp4/embed)
  poster:"" // imagem de capa opcional
};
```

- [ ] **Step 3: Slot de vídeo em showProtocol**

No `showProtocol` (~1223), antes da lista de features, injetar (condicional):
```js
      ${VIDEO_DATA.enabled && VIDEO_DATA.url ? `
        <div class="protocol-video">
          <video src="${VIDEO_DATA.url}" ${VIDEO_DATA.poster?`poster="${VIDEO_DATA.poster}"`:""} controls playsinline preload="metadata"></video>
        </div>` : ""}
```
CSS mínimo em styles.css:
```css
.protocol-video{margin:0 0 24px;border-radius:16px;overflow:hidden}
.protocol-video video{width:100%;display:block;background:#000}
```

- [ ] **Step 4: Depoimentos rebrand + tags de rota**

Reescrever `TESTIMONIALS` mantendo a estrutura (initials, age, occupation, photo, text, result, highlight, painTags), trocando a linguagem de "vascular/vasos" por "circuito" e marcando `painTags` que casem com rota (incluir "de", "ep", "ambos" além de parceira/eu_mesmo/tudo/confianza). `getFilteredTestimonials(e)` já filtra por tag; estender a chamada em `startLoading`/`showProtocol` para priorizar `state.route` (passar `state.route` quando não houver pain area). Manter as fotos existentes em `img/testimonials/`.

Exemplo (aplicar o mesmo padrão aos 13):
```js
  {initials:"Carlos V.",age:43,occupation:"Policial, Recife",photo:"img/testimonials/carlos-v.jpg",
   text:"Antes terminava antes de começar. Reacendi o gatilho e hoje duro o quanto quero. Salvou meu casamento.",
   result:"Gatilho sob controle",highlight:"+ Controle de ejaculação",painTags:["ep","eu_mesmo","tudo","confianza"]},
```

- [ ] **Step 5: Sync min + cache bump**
```bash
cp js/quiz-data.js js/quiz-data.min.js
cp js/app.js js/app.min.js
```
`index.html`: `quiz-data.min.js?v=23` -> `?v=24`, `app.min.js?v=29` -> `?v=30`, `styles.min.css?v=16` -> `?v=17`.

- [ ] **Step 6: Verificar**

Rodar até a revelação nas 3 rotas. Esperado: protocolo Condor com features novas, depoimentos coerentes com a rota, e (com `VIDEO_DATA.enabled=false`) nenhum vídeo quebrado. Setar `enabled:true` + uma url de teste e confirmar que o player aparece. Reverter para `false` antes do commit (vídeo entra depois). Sem erro no console.

- [ ] **Step 7: Commit**
```bash
git add index.html js/quiz-data.js js/quiz-data.min.js js/app.js js/app.min.js css/styles.css css/styles.min.css
git commit -m "feat(condor): protocolo/depoimentos por rota + slot de video na revelacao"
```

---

## Task 8: Oferta única R$37 (corta decoy) + esteira no checkout

**Files:**
- Modify: `js/quiz-data.js` (PRICING_DATA ~367-423, THANKYOU_DATA)
- Modify: `js/app.js` (`showPricing` plansHtml ~1324-1334; render single-plan)

- [ ] **Step 1: PRICING_DATA com plano único + âncora R$197**

```js
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
      name:"PROTOCOLO CONDOR COMPLETO — ACESSO VITALÍCIO",
      price:37,
      originalPrice:197,
      period:"pagamento único, acesso vitalício",
      description:"O protocolo completo de reativação do circuito",
      badge:"🔓 ACESSO TOTAL",
      ctaLabel:"QUERO O PROTOCOLO COMPLETO",
      ctaTag:"ACESSO TOTAL",
      features:[
        "Pressão de volta em 21 dias — firmeza sem pílula",
        "Gatilho sob comando — durar vira escolha",
        "A Respiração do Condor guiada, 6 min/dia",
        "App Condor personalizado pelo seu diagnóstico",
        "Acesso vitalício — todas as atualizações incluídas"
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
```

- [ ] **Step 2: Render single-plan em showPricing**

Em `showPricing`, o `plansHtml` itera `PRICING_DATA.plans.map(...)`. Com 1 plano só, o map já funciona; mas remover a referência a `isAnchor`/`plan-anchor`/`isDowngrade` que assumia 2 planos não quebra (fica falsy). Garantir `state.selectedPlan` default = `"completo"`: no state init (~81) trocar o default `selectedPlan` para `"completo"`. Confirmar que `PRICING_DATA.plans.find((p)=>p.id===state.selectedPlan)` (linha ~1350) acha o plano.

- [ ] **Step 3: THANKYOU_DATA rebrand**

```js
THANKYOU_DATA={
  headline:"Bem-vindo ao outro lado, {name}.",
  subheadline:"O Protocolo Condor está liberado. A partir de agora cada dia reacende mais o circuito.",
  steps:[
    {number:"01",title:"Acesso em menos de 5 minutos",desc:"O link chega no seu e-mail/WhatsApp assim que o pagamento confirmar."},
    {number:"02",title:"Comece pela Respiração do Condor (Dia 1)",desc:"É o interruptor. Sem ela, nada reacende. Faça hoje."},
    {number:"03",title:"Siga exatamente como está escrito",desc:"Vai parecer simples demais. Não mude nada. Aí está o resultado."},
    {number:"04",title:"Deixe o resultado falar",desc:"Em 2-3 semanas sua parceira vai ser a primeira a notar."}
  ],
  cta:"ACESSAR O PROTOCOLO AGORA"
};
```

- [ ] **Step 4: Sync min + cache bump**
```bash
cp js/quiz-data.js js/quiz-data.min.js
cp js/app.js js/app.min.js
```
`index.html`: `quiz-data.min.js?v=24` -> `?v=25`, `app.min.js?v=30` -> `?v=31`.

- [ ] **Step 5: Verificar**

Rodar até o preço. Esperado: UM card (R$37 de R$197), garantia nova, CTA mapeado pela Q10, timer e sticky CTA funcionando. Clicar no checkout NÃO deve redirecionar pra produção em teste local (ok ver a URL montada no console). Sem erro no console.

- [ ] **Step 6: Commit**
```bash
git add index.html js/quiz-data.js js/quiz-data.min.js js/app.js js/app.min.js
git commit -m "feat(condor): oferta unica R$37 (de R$197), corta decoy, rebrand thankyou"
```

---

## Task 9: Regenerar styles.min.css e polir visual (impeccable)

**Files:**
- Modify: `css/styles.css` -> regenerar `css/styles.min.css`

- [ ] **Step 1: Regenerar o .min de forma confiável**

Se houver toolchain (checar `package.json` — não há hoje), usar. Sem toolchain, minificar via npx pontual:
```bash
npx --yes clean-css-cli@5 -o css/styles.min.css css/styles.css
```
Validar que o arquivo foi gerado e tem tamanho coerente (`ls -la css/`).

- [ ] **Step 2: Passar o impeccable nas telas-chave**

Invocar o skill `impeccable` para lapidar: medidor de bloqueio, telas das 3 portas do gatilho, resultado (gauge de bloqueio), revelação do app e preço. Manter o shell escuro-dourado; só refinar hierarquia, espaçamento, micro-interações. Aplicar mudanças em `styles.css`, regenerar `.min`, subir `?v=`.

- [ ] **Step 3: Verificar responsivo mobile**

No DevTools (375px), percorrer gate -> quiz -> gatilho -> resultado -> preço. Esperado: nada quebra, medidor legível, CTAs alcançáveis. Sem erro no console.

- [ ] **Step 4: Commit**
```bash
git add css/styles.css css/styles.min.css index.html
git commit -m "style(condor): regenera min + polimento impeccable das telas-chave"
```

---

## Task 10: LastLink — produtos da esteira e wiring (sem tocar tracking)

**Files:**
- Modify: `js/app.js` (somente a STRING base do produto na `checkoutUrl`, linhas ~1503 e ~1661; NÃO a lógica de params)

- [ ] **Step 1: (Flavio, manual) Criar os produtos na LastLink**

Criar e anotar os product codes:
- Principal: Protocolo Condor Completo R$37
- Order bumps: Gatilho de Aço R$9, Pressão Máxima R$12, Cabeça Blindada R$19
- Upsell 1-clique: Condor Acelerado R$47
- Downsell: Condor Acelerado reduzido R$24
- Cross: Ritual de Ignição R$19
Configurar os bumps no checkout do principal e o one-click do upsell/downsell/cross (esteira), espelhando o fluxo atual.

- [ ] **Step 2: Trocar a base do checkout no app.js**

Substituir as DUAS ocorrências da URL base `https://lastlink.com/p/CD688C370/checkout-payment/` (linhas ~1503 e ~1661) pelo novo product code do principal Condor. NÃO alterar nenhuma linha de montagem de query (sck, fbclid, utm, eid). Apenas a base.

- [ ] **Step 3: Sync min + cache bump**
```bash
cp js/app.js js/app.min.js
```
`index.html`: `app.min.js?v=31` -> `?v=32`.

- [ ] **Step 4: Verificar a URL montada (sem comprar)**

No navegador, ir até o preço, abrir console, clicar no checkout e inspecionar a `checkoutUrl` no log do `begin_checkout`: deve apontar pro novo produto Condor E conter `sck=`, atribuição e `eid=` exatamente como antes. Confirmar visualmente o domínio lastlink.com.

- [ ] **Step 5: Commit**
```bash
git add index.html js/app.js js/app.min.js
git commit -m "feat(condor): aponta checkout para produto LastLink Condor (tracking intacto)"
```

---

## Task 11: Verificação end-to-end, tracking e ensaio de rollback

**Files:** nenhum (verificação).

- [ ] **Step 1: Walkthrough completo das 3 rotas**

Para cada rota (DE/EP/ambos): gate -> 10 perguntas -> gatilho (Sim e, em outra passada, Não dá) -> loading -> nome -> resultado (bloqueio + diagnóstico da rota) -> revelação -> preço -> clique no checkout. Esperado: copy coerente com a rota em cada tela, medidor sempre negativo, nenhuma tela "você está bem".

- [ ] **Step 2: Conferir dataLayer (tracking preservado)**

No console, antes de iniciar: `window.dataLayer = window.dataLayer || []`. Percorrer o funil e confirmar os pushes: `quiz_complete`, `view_pricing`, `begin_checkout` com `sck` (formato `br_...`) e objeto `attribution`. Esperado: idênticos ao comportamento pré-Condor (só mudou copy/produto).

- [ ] **Step 3: Ensaio de rollback**

```bash
git checkout main
# (publicar main) e confirmar funil antigo no ar
git checkout feat/condor-redesign
```
Esperado: troca limpa de volta ao estado estável usando a tag `rollback/pre-condor` como rede.

- [ ] **Step 4: Abrir PR / merge conforme decisão do Flavio**

Não fazer merge sem aprovação explícita. Quando aprovado, seguir o skill `finishing-a-development-branch`.

---

## Self-Review (cobertura do spec)

- Marca CONDOR: Task 1. ✓
- Mecanismo Circuito Adormecido + Vasquez + Andes: Task 1, 6, 7. ✓
- Quiz DE+EP 10 perguntas + corte de temas off: Task 2. ✓
- 3 rotas ramificadas: Task 3, 6, 7. ✓
- Teste do gatilho sem perdedor + porta de fuga: Task 4. ✓
- Medidor de bloqueio (sempre negativo): Task 5. ✓
- Resultado/bridge em chave negativa: Task 6. ✓
- Vídeo na revelação (slot): Task 7. ✓
- Oferta única R$37 / âncora R$197 / corta decoy: Task 8. ✓
- Esteira (3 bumps + upsell + downsell + cross) na LastLink: Task 10. ✓
- Visual polido (impeccable) + identidade nova em paralelo: Task 9 (open design fica como exploração paralela fora deste plano de go-live, conforme spec). ✓
- Tracking intocado + rollback: disciplinas globais, Task 0, 10, 11. ✓
- Sem tells de IA na escrita: disciplina global. ✓

Lacunas conhecidas (intencionais, fora de escopo do go-live): geração do vídeo (Omniflash), conteúdo dos módulos no app, migração do nome interno VORTX no tracking, identidade visual nova finalizada no open design.
