# CONDOR — assets, prompts e config (registro durável)

Tudo que foi produzido fora do código (prompts de imagem/vídeo, config de voz, esteira LastLink, logo). Salvo aqui pra não perder. Visão geral da oferta está no spec (`../specs/2026-06-23-condor-funnel-redesign-design.md`) e no plano (`../plans/2026-06-23-condor-funnel-redesign.md`).

## Estado (24/06/2026)
- Funil CONDOR NO AR em produção (Vercel, projeto vortx-br, deploy auto no push da main). Substituiu o VORTX.
- Checkout LastLink: mesmo link do VORTX, produto `CD688C370` (pagamento único R$37). Código aponta certo, não precisa mexer.
- Rollback: Vercel Instant Rollback pro deploy `e04f7e7` (VORTX) ou tag `rollback/pre-condor`.

## LastLink
- Produto principal: nome **"Método Condor"** (discreto na fatura), imagem = logo abaixo.
- Order bumps (promessa pesada, preço de impulso, eixos virgens, não canibalizam os bônus grátis):
  1. **Modo Predador** — +R$9 — ancoragem de R$47 por R$9
     - Título: `Modo Predador — recarga em minutos`
     - Descrição: `Termine e volte pra segunda e terceira rodada na mesma noite, com o mesmo fôlego da primeira. Adicione por só +R$9 e nunca mais pare na primeira.`
  2. **Pressão de Touro** — +R$12 — ancoragem de R$57 por R$12
     - Título: `Pressão de Touro — mais grosso e mais duro`
     - Descrição: `O passo extra que prende mais sangue: ereção mais grossa, mais dura e maior à vista quando você está duro. A diferença que ela percebe na hora. Leve por +R$12.`
  3. **Fogo Selvagem** — +R$19 — ancoragem de R$67 por R$19
     - Título: `Fogo Selvagem — libido nas alturas`
     - Descrição: `Acorde duro todo dia e com vontade que não desliga, o fogo dos 18 no corpo de agora. Entra no seu plano por +R$19.`
- Esteira pós-compra (PENDENTE, deixada pra depois): upsell Condor Acelerado R$47 → downsell R$24 → cross Ritual de Ignição R$19.

## Logo
- Arquivo final usado no checkout (com margem de respiro pra LastLink não cortar): `~/Downloads/condor-logo-checkout.png` (gerei via PIL a partir da arte original do GPT Images, escala 0.74 num quadrado, borda cor do canto).
- Prompt GPT Images que gerou a arte original (condor bronze + montanhas + wordmark sobre ardósia):
  > Emblema de marca premium para "CONDOR". Um condor-dos-andes estilizado, asas abertas em arco simétrico, brasão metálico em bronze e cobre escovado sobre fundo de ardósia escura (granito frio). Silhueta de cordilheira embaixo. Logo vetorial moderno, minimalista, masculino, alto contraste, luz de borda dramática. Wordmark "CONDOR" em sans condensada robusta (estilo Oswald) em bronze. Sem fundo branco, sem pessoas, sem texto além de CONDOR.

## Vídeo da revelação (PRONTO E NO AR — 24/06/2026)
Proporção final: **16:9 landscape** (decisão do Flavio: ocupa menos espaço na página). Gerado no **HeyGen Video Agent** (Omniflash sem créditos): avatar Photo `vtxavatar` (Dr. Renato, de `~/Downloads/vtxavatar.png`), voz **Charon**, os 6 takes num vídeo só (médico A-roll + b-roll stock Andes/andinos/respiração), 47,7s. Legenda limpa queimada localmente (Whisper medium PT → ASS Arial branca contorno suave → ffmpeg). Masters em `~/Downloads/condor-reveal-heygen.mp4` (sem legenda) e `condor-reveal-legendado.mp4` (com legenda). HeyGen video_id `b902fdfe7c92481ea48a5c54dfd3bbd6`, edição em https://app.heygen.com/videos/b902fdfe7c92481ea48a5c54dfd3bbd6.

**Embedado no funil** (branch `feat/condor-video-embed` → main): o legendado foi hospedado no **tynk.ai** (player VSL, link público) e ligado no slot via iframe 16:9. `VIDEO_DATA={enabled:true, url:"https://play.tynk.ai/p/7c53bf70-d248-44c5-b748-048a88d9b07f", embed:true}` (quiz-data.js/.min). `app.js`/`app.min.js` `showProtocol` renderiza `<iframe>` quando `embed:true`; CSS `.pv-frame`/`.protocol-video iframe` em 16:9. Cache bump index.html (styles v21, quiz-data v29, app v40). Tracking intocado. **AJUSTES NO PAINEL DO TYNK (não no código):** botão "ativar som" está em espanhol (trocar pra PT); selo "Pessoas assistindo – 500" é prova social automática.

### Prompt GPT Images — Dr. Renato Vasquez (foto realista)
> Fotografia hiper-realista, retrato vertical (2:3) de um cirurgião vascular brasileiro de uns 52 anos. Cabelo grisalho curto e bem cuidado, barba grisalha aparada, expressão séria mas acolhedora, olhar inteligente e levemente cansado. Camisa social azul-marinho escura com mangas dobradas (ou jaleco branco discreto). Consultório moderno e sóbrio ao fundo, desfocado. Luz natural suave de janela lateral, sombras realistas. Lente 85mm, profundidade de campo rasa, bokeh. Pele real com poros, textura, rugas e imperfeições naturais, sem retoque, sem pele plástica, sem sorriso de banco de imagem. Estilo fotojornalístico/documental, cores naturais. EVITAR: aparência de IA, simetria perfeita, pele lisa demais, dedos/dentes errados, texto/marca d'água, fundo branco de estúdio.

### Takes do vídeo (Omniflash, 9:16, cada um ≤10s, completos/standalone)
**Take 1 — Gancho:** Vídeo vertical 9:16, 10s, realismo documental. Um cirurgião vascular brasileiro de uns 52 anos, cabelo grisalho curto, barba grisalha aparada, olhar inteligente e levemente cansado, camisa social azul-marinho escura com mangas dobradas, sentado numa poltrona de couro num consultório moderno e sóbrio (estantes e diplomas desfocados ao fundo). Luz natural suave de janela à esquerda, sombras realistas. Olha direto pra câmera e começa a falar com seriedade calma, leve gesto com a mão direita. Câmera sutilmente na mão, micro-movimento natural. Lente 85mm, profundidade de campo rasa, fundo em bokeh. Pele real com poros e imperfeições, sem retoque. Cores naturais, estilo fotojornalístico. Sem aparência de IA/CGI, sem pele plástica, sem movimento robótico, sem texto/marca d'água.
- VO: "Se você fez o teste e o número não foi bom, presta atenção. O que te falaram a vida toda sobre isso está errado."

**Take 2 — Não é idade:** Vídeo vertical 9:16, 10s, realismo documental. O mesmo cirurgião (52 anos, grisalho, barba aparada, camisa azul-marinho escura) no mesmo consultório com luz de janela lateral. Inclina-se levemente pra frente, gesticula com as duas mãos explicando algo importante, expressão firme e convicta, sobrancelhas levemente franzidas. Câmera na mão com micro-movimento, leve aproximação suave. Lente 85mm, DOF rasa, fundo desfocado. Pele real, sem retoque, cores naturais. Sem IA/CGI, sem pele plástica, sem uncanny, sem texto/marca d'água.
- VO: "Não é idade, não é a sua cabeça. Existe um interruptor da ereção e do controle, e depois dos 35 ele vai desligando sozinho."

**Take 3 — Andes:** Vídeo vertical 9:16, 10s, realismo cinematográfico documental (estilo National Geographic). Cordilheira dos Andes ao amanhecer: picos nevados, encostas de pedra, um pequeno vilarejo rústico de pedra em grande altitude, nuvens baixas se movendo entre as montanhas. Plano aéreo de drone avançando devagar, revelando o vilarejo. Luz dourada natural do nascer do sol, neblina fina nos vales, cores naturais e frias de altitude. Textura real de rocha e neve. Sem CGI, sem aparência de IA, sem super-saturação, sem texto/marca d'água.
- VO: "Eu descobri isso num lugar onde os homens passam dos 70 e nunca falham na cama: os Andes."

**Take 4 — Os andinos:** Vídeo vertical 9:16, 10s, retrato documental real. Dois ou três homens andinos idosos (70-80 anos), rostos muito enrugados e curtidos pelo sol, pele real com marcas, vestindo ponchos e gorros de lã tradicionais, ao ar livre numa aldeia de montanha em grande altitude. Respiram fundo o ar fino, olham o horizonte com vitalidade tranquila, um esboça leve sorriso sereno. Vento suave nas roupas. Luz natural dura de altitude, sombras reais. Câmera na mão, leve movimento. Cores naturais, documentário verdadeiro. Sem CGI/IA, sem pele plástica, sem texto/marca d'água.
- VO: "Lá o interruptor nunca desliga. Não é sorte nem genética: é uma coisa simples que eles fazem todo dia."

**Take 5 — Religando:** Vídeo vertical 9:16, 10s, realismo íntimo documental. Close-up de um homem brasileiro comum de uns 40 anos, barba por fazer, num quarto com luz natural suave de fim de tarde. Olhos fechados, respirando fundo e devagar, uma mão no peito, ombros relaxando a cada expiração, leve expressão de alívio e foco. Movimento sutil e natural. Lente 50mm, DOF rasa, fundo desfocado. Pele real com poros, luz quente natural, cores naturais. Sem IA/CGI, sem pele plástica, sem movimento robótico, sem texto/marca d'água.
- VO: "Quando eu trouxe isso pro consultório, homens que não conseguiam mais voltaram a ficar duro e a durar. Em semanas."

**Take 6 — Fechamento:** Vídeo vertical 9:16, 10s, realismo documental. O mesmo cirurgião (52 anos, grisalho, barba aparada, camisa azul-marinho escura) no mesmo consultório com luz de janela. Enquadramento mais fechado (peito pra cima), olha firme e direto pra câmera, tom de conclusão e confiança, pausa e leve aceno afirmativo com a cabeça. Câmera na mão, micro-movimento. Lente 85mm, DOF rasa, bokeh. Pele real, sem retoque, cores naturais, fotojornalístico. Sem IA/CGI, sem pele plástica, sem uncanny, sem texto/marca d'água.
- VO: "O seu interruptor tem volta. E eu vou te mostrar exatamente como ligar de novo."

### Config de voz (Omniflash / Gemini)
- Voz recomendada: **Charon** (Male, informative, lower pitch). Alternativa: Alnilam (firm).
- Exemplo de diálogo (≤120): `Não é idade, nem a sua cabeça. Existe um interruptor, e depois dos 35 ele começa a desligar.`
- Customize Performance: `Homem brasileiro de uns 52 anos, médico experiente. Voz grave e calma, autoritária mas acolhedora. Ritmo pausado e seguro, falando direto para uma única pessoa, com gravidade e confiança. Sem tom de locutor de propaganda, sem pressa, articulação clara e natural.`
- Narração toda em PT (o idioma do texto define o sotaque).

## HeyGen (caminho alternativo pro vídeo do médico)
- Skills instaladas em `.agents/skills/` (heygen-avatar, heygen-video, heygen-translate) via `npx skills add heygen-com/skills`. Manifesto em `skills-lock.json`.
- MCP adicionado: `claude mcp add --transport http heygen https://mcp.heygen.com/mcp/v1/` (escopo local do projeto). STATUS: **Needs authentication** — falta o Flavio rodar `/mcp` → heygen → Authenticate e REINICIAR a sessão pra carregar os tools `mcp__heygen__*`.
- Plano com HeyGen: heygen-avatar cria o Dr. (photo avatar da foto do GPT, ou prompt avatar) → heygen-video gera 9:16 com voz grave → baixa mp4 → liga no funil. Híbrido ideal: HeyGen pro médico falando + Omniflash pros b-rolls (Andes/andinos/religando).

## Ícones do quiz
- Decisão: mantidos os EMOJIS (o set duotone foi testado e revertido, ficou menos visual). Preview do duotone em `quiz-icons.html` caso queira retomar.
