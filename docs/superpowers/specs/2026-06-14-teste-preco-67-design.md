# Teste de preço R$37 → R$67 (VORTX BR) — Design

Data: 2026-06-14
Repo funil: `~/vortx-br` (branch base `main`)
Relacionado: diagnóstico em memória `ticto-checkout-quebrado-1206`, `ga4-direct-cli`, `vortx-pricing-cro`.

## 1. Contexto e motivação

O Flavio está insatisfeito com o ROI: muito InitiateCheckout, poucas vendas. Investigação ao vivo (14/06, Meta + GA4 via service account + CSV Ticto) concluiu:

- O funil NÃO está quebrado e o Ticto NÃO está desviando venda. Está no padrão normal dele.
- Quem gera PIX, paga (~88%). "PIX não chega" está descartado; recuperação n8n tem upside ~nulo.
- Dois ralos reais: **ver preço → clicar comprar ~40%** (60% saem na oferta) e **clicar comprar → gerar PIX no checkout Ticto ~21%** (79% abandonam a página do checkout). Quem gera, paga.
- O funil é economicamente magro de fábrica (breakeven ROAS ~1,1; ticket líquido ~R$33), por isso ROI curto.

Hipótese do teste: o preço R$37 pode estar barato a ponto de gerar **desconfiança**, alimentando os dois ralos. Subir para R$67 testa isso e, em paralelo, aumenta o ticket médio (alavanca direta de ROI).

## 2. Objetivo

Medir se **R$67 melhora a receita líquida por visitante** (e o ROI) frente ao R$37, e se reduz os ralos de oferta e de abandono de checkout. Decisão binária ao fim: fica R$67, volta pra R$37, ou parte pro próximo teste (LastLink).

Junto com a troca de preço, dois ajustes pedidos pelo Flavio (escopo aprovado):
- **Garantia:** trocar "garantia em dobro" por **garantia simples de 30 dias** (devolução do valor pago, sem dobrar). Remove a matemática R$ + R$.
- **Popup de saída (exit-intent):** **remover por completo** — pede WhatsApp e hoje não é usado pra nada. Inclui o popup, o trigger exit-intent e a captura/persistência.

Não-objetivos (YAGNI): redesenhar a página, mexer em bumps/esteira, mexer em tracking, testar mais de um preço, A/B simultâneo, mexer no WhatsApp do quiz (step `whatsapp-input`, que é outra coisa e fica intacto).

## 3. Método: troca sequencial (antes/depois)

Escolha do Flavio. Mesma oferta Ticto (`O7AAE3550`), só muda o número do preço dos dois lados. Rollback = voltar o preço.

- **Baseline** = os 7 dias anteriores a R$37 (dados já capturados: ~13-15 vendas/dia, funil GA4/Meta/Ticto).
- **Teste** = 7 dias corridos a R$67 (cobre todos os dias da semana).
- **Congelar** durante o teste: criativo, orçamento, segmentação da cp03, e qualquer outra mudança de funil (pricing CRO, esteira). Leitura limpa.

Fraqueza assumida do método: confusão temporal (fadiga de criativo, sazonalidade). Mitigação = 7 dias cheios + congelar tudo + comparar com a semana imediatamente anterior.

## 4. Escopo da mudança

### 4.1 Lado Ticto (Flavio configura)
- Alterar o preço da oferta `O7AAE3550` de R$37,00 para R$67,00. **Mesma oferta** → bumps (Controle R$9, Polegada R$19) e FunnelFlow (esteira upsell→down→cross) permanecem intactos.
- Rollback = voltar o preço da mesma oferta para R$37,00.

### 4.2 Lado funil (implementação no `app.js`, depois minificar e deploy)
Trocar o preço exibido em todos os pontos. Ocorrências mapeadas em `js/app.js`:

**(a) Preço e desconto:**

| linha | trecho | mudança |
|---|---|---|
| 1481 | `<div class="vsth-price"><span>R$</span>37</div>` (preço principal) | 37 → 67 |
| 1482 | `93% de desconto porque você entrou pelo diagnóstico gratuito` | 93% → 88% (1 − 67/547 ≈ 88%) |

**(b) Garantia (bloco ~1488-1495):** trocar para garantia simples de 30 dias, sem dobrar e sem número de preço (assim não vira mais um ponto de sincronia de preço). Mudanças:
- badge `GARANTIA EM DOBRO` → `GARANTIA DE 30 DIAS`
- título `Resultado visível em 30 dias, ou eu devolvo o DOBRO.` → `Resultado visível em 30 dias, ou seu dinheiro de volta.`
- texto 1493 → reescrever sem a matemática R$37+R$37/R$74, ex.: "Se em 30 dias sua parceira não notar a mudança, eu devolvo cada centavo. O risco é 100% meu. Você só precisa seguir o protocolo."
- pode manter as classes CSS (`guarantee-box--doubled` etc.) pra não mexer em estilo; só a cópia muda.

**(c) Remover o popup de saída (exit-intent) por completo:**
- função `showExitIntentPopup` (~1637-1726), incluindo o form de WhatsApp e os handlers.
- o bloco de trigger exit-intent (~1562-1635): guarda `state.exitIntentShown`, `mouseLeaveHandler`/`document.addEventListener("mouseleave", …)`, detecção de scroll-up mobile e o fallback de 60s, e a chamada a `showExitIntentPopup()`.
- o campo `state.exitIntentShown` (linha 80).
- `escapeHtml` (1728-1732): remover SÓ se não houver outro uso fora do popup (verificar por grep; se houver, deixar).
- Confirma por grep que nada consome `vx_exit_recovery` (localStorage) nem os eventos `exit_intent_*` antes de remover (Flavio confirmou que não é usado). Como o popup some, os pontos de preço R$37 das linhas 1654/1720 desaparecem junto.
- NÃO tocar no step de quiz `whatsapp-input` nem em `userData.whatsapp` (uso legítimo do quiz, separado do popup).

**Mantém** (âncora de valor, não é o preço): todos os `R$ 547` que sobram (linhas 1371, 1477, 1946) e o stat "93% dos homens" da linha 123 (não é desconto).

**Verificação obrigatória na implementação:** após as edições, rodar busca por `37`, `93%`, `vep-`, `exit_intent`, `exitIntent` e `vx_exit_recovery` em `js/app.js`, `index.html` e `styles.css` para garantir que (1) nenhuma exibição de preço ficou em R$37 (mismatch = quebra de confiança) e (2) não sobrou referência órfã ao popup removido. Atualizar o sticky CTA se exibir preço. CSS do popup (`.vx-exit-popup`/`.vep-*`) em `styles.css` pode ficar (inerte) ou ser removido; remoção é opcional e cosmética.

Build: minificar `app.js`→`app.min.js` (esbuild, padrão do repo), bump do `?v=` no `index.html`, merge em `main`, deploy Vercel. Smoke local (`~/pw-smoke`) confirmando que pricing renderiza R$67 e 88% sem erro de JS.

### 4.3 Tracking (nada a fazer)
O `value` da Purchase (CAPI + GA4) vem do payload do webhook Ticto, então passa a R$67 automaticamente. Nenhuma edição de GTM. Regra de ouro intacta. A cp03 otimiza por OFFSITE_CONVERSIONS (contagem), então o sinal não quebra com a mudança de valor.

## 5. Coordenação de go-live (evitar mismatch de preço)

Regra de segurança: durante a troca, **o funil nunca pode exibir um preço MENOR do que o Ticto cobra** (isso seria sobrecobrança = chargeback/quebra de confiança). Qualquer janela de descasamento deve ser uma SUBcobrança (inofensiva).

- **Subir (37→67):** deploy do funil em R$67 **primeiro**, depois Flavio sobe o Ticto para R$67. (Janela: funil 67 / Ticto 37 = subcobrança, ok.)
- **Rollback (67→37):** Flavio baixa o Ticto para R$37 **primeiro**, depois deploy do funil em R$37. (Janela: funil 67 / Ticto 37 = subcobrança, ok.)

## 6. Métricas e instrumentação

Janela de leitura: baseline 7d (R$37) vs teste 7d (R$67). Fontes: Meta MCP (dataset 1856237325333480 + campanha 120244138025260008), GA4 (`~/ga4-tools` via service account, `funnel --daily`), CSV Ticto (export do Flavio).

| tipo | métrica | fonte | lê |
|---|---|---|---|
| **Primária** | receita líquida por pricing-view e por dia | Ticto (valor pago) ÷ GA4 view_pricing | veredito de ROI |
| apoio | ROAS Meta, vendas pagas/dia | Meta + Ticto | economia + saúde do sinal |
| diagnóstico | pricing→checkout (GA4), IC→gera PIX (Ticto) | GA4 + CSV | se a desconfiança caiu |
| guarda | vendas pagas/dia, entrega (gasto/cliques), reembolso/chargeback | Meta + Ticto | não quebrar o que roda |

## 7. Regra de decisão (após 7 dias)

- **Receita/visitante e líquido/dia SOBEM** e volume de vendas não desabou → manter R$67 (e considerar testar mais alto).
- **Receita/visitante CAI** → rollback pra R$37. O ralo de abandono de checkout aponta o próximo teste (LastLink).
- **Conversão se mantém mas abandono de checkout segue ~79%** → confirma que o gargalo é a página do Ticto → justifica desenhar o teste de LastLink com dado.

**Gatilho de rollback antecipado:** se em 2-3 dias o volume de vendas cair a ponto de a receita líquida/dia despencar E a entrega da cp03 começar a encolher (starvation de sinal, igual ao incidente dos bumps de 10/06), reverter na hora pela ordem da seção 5.

## 8. Riscos

- **Starvation do CBO:** R$67 pode derrubar o volume de conversões e a cp03 perder sinal → entrega encolhe. Mitigação: métrica de guarda + gatilho de rollback antecipado.
- **Mismatch de preço:** mitigado pela ordem de go-live da seção 5.
- **Leitura confundida por tempo:** mitigado por janela de 7 dias cheios + congelar todo o resto.
- **Volume baixo:** ~15 vendas/dia dá leitura direcional, não significância estatística forte. A decisão é de direção (sobe/cai/empata), não de p-valor.
