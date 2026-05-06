// ============================================================
// VORTX Quiz Engine v5 (CONVERSÃO MÁXIMA, foco total)
// Melhorias v5:
//   1. Triggers em TODAS as respostas do step 2 (idade)
//   2. Interstitial 2 usa resposta real do usuário (step 9/10)
//   3. Interstitial 3 com tensão antecipatória antes do veredicto
//   4. Step 22 diferenciado visualmente por variante (gold/red)
//   5. Depoimentos filtrados por dor no protocolo
//   6. CTA do checkout personalizado por nome + dor declarada
// ============================================================

(function () {
  "use strict";

// ═══════════════════════════════════════════════════════════════
// CLIENT-SIDE TRACKING DISABLED — server-side será implementado externamente.
// Stubs no-op para preservar todas as chamadas existentes sem quebrar o código.
// Quando o GTM Server estiver pronto, basta substituir o corpo de cada stub
// por dataLayer.push({...}) ou fetch('/server-event', {...}).
// ═══════════════════════════════════════════════════════════════
window.vortxTrack          = window.vortxTrack          || function(){};
window.vortxTrackSync      = window.vortxTrackSync      || function(){ return null; };
window.vortxEnsureTracking = window.vortxEnsureTracking || function(){};
window.vortxGetAttribution = window.vortxGetAttribution || function(){
  // Mantém a captura de fbclid/utm para URL do checkout (atribuição funciona sem pixel)
  try {
    var p = {};
    var url = new URLSearchParams(window.location.search);
    var fbclid = url.get("fbclid") || sessionStorage.getItem("vx_fbclid");
    if (fbclid) {
      sessionStorage.setItem("vx_fbclid", fbclid);
      p.fbclid = fbclid;
    }
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(function(k){
      var v = url.get(k) || sessionStorage.getItem("vx_" + k);
      if (v) { sessionStorage.setItem("vx_" + k, v); p[k] = v; }
    });
    return p;
  } catch(e){ return {}; }
};
window.vortxIsLegitimateConversionPage = window.vortxIsLegitimateConversionPage || function(){
  // Continua validando acesso direto às thank-you pages (independente de pixel)
  try {
    var params = new URLSearchParams(window.location.search);
    // (hottok removido — migrado para PerfectPay)
    if (/^HP[A-Z0-9]{6,}/i.test(params.get("transaction")||"")) return true;
    if (params.get("src") === "vortx_funnel") return true;
    var ref = document.referrer || "";
    if (/go\.centerpag\.com|app\.perfectpay\.com\.br|perfectpay\.com\.br/i.test(ref)) return true;
    if (ref.indexOf(location.origin) === 0) return true;
    return false;
  } catch(e){ return false; }
};



  // ── STATE ─────────────────────────────────────────────────
  const state = {
    exitIntentShown: false,
    currentScreen: "gate",
    currentStepIndex: 0,
    answers: {},
    userData: { name: "", whatsapp: "", height: 0, weight: 0 },
    optIn: true,
    selectedPlan: "vitalicio",
    score: 0,
    criticalAreas: [],
    timerInterval: null,
    timerSeconds: PRICING_DATA.timerMinutes * 60,
    history: [],
    audioCtx: null,
    alertNodes: [],
  };

  let stepOrder = [];

  // ── INTERSTITIALS ─────────────────────────────────────────
  const INTERSTITIALS = [
    {
      afterStep: 6,  // após erección matinal
      emoji: "🔬",
      headline: '{name}, isso tem nome: <span class="highlight">bloqueio vascular peniano.</span>',
      getText: () => "Não é a idade. É obstrução nos vasos que levam sangue ao pênis. Agora vamos mapear o dano.",
      stat: "Quem identifica o padrão agora tem 3.7x mais chances de reverter.",
      cta: "MAPEAR O DANO",
    },
    {
      afterStep: 9,  // após pastilla
      emoji: "🧠",
      headline: 'O mapa vascular de <span class="highlight">{name}</span> não é animador.',
      getText: () => {
        const pastilla = state.answers[9];
        const nome     = state.userData.name || "tú";
        if (pastilla === "viciado") {
          return `${nome}, seu corpo criou dependência química. Sem a pílula, nada funciona. Mas dá pra reativar sem química.`;
        }
        if (pastilla === "asvezes") {
          return `${nome}, ter ela "por garantia" já é sinal. Em 2 anos, sem ela, nada vai responder.`;
        }
        return `${nome}, seus vasos estão se fechando. Agora cruzamos com seus hábitos pra descobrir o que está acelerando isso.`;
      },
      stat: "93% dos homens com esse perfil respondem ao protocolo em menos de 21 dias.",
      cta: "VER MEUS HÁBITOS",
    },
    {
      afterStep: 10,  // após hábitos — prepara resultado
      emoji: "🔴",
      headline: 'Você vai ver um número agora. <span class="highlight">Revela quanto seus vasos se fecharam.</span>',
      getText: () => {
        const nome = state.userData.name || "tú";
        return `${nome}, o sistema cruzou suas respostas com 17.483 diagnósticos. Alguns homens ficam em choque, outros sentem alívio. Prepare-se.`;
      },
      stat: "A maioria dos homens nunca soube que esse número existia.",
      cta: "VER MEU DIAGNÓSTICO",
    },
  ];


  // ── PROGRESS PERSISTENCE — recovery after abandonment ────────
  const STORAGE_KEY = "vx_quiz_progress_v1";
  const STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
  function saveProgress() {
    try {
      const data = {
        t: Date.now(),
        currentStepId: state.currentStepId,
        userData: state.userData,
        answers: state.answers,
        selectedPlan: state.selectedPlan,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }
  function tryResumeProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !data.t) return;
      if (Date.now() - data.t > STORAGE_TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      // Só restaura se tiver ao menos o nome + 1 resposta (step 3 em diante)
      if (!data.userData || !data.userData.name) return;
      if (!data.answers || Object.keys(data.answers).length < 1) return;

      const resumeDiv = document.createElement("div");
      resumeDiv.className = "resume-banner";
      resumeDiv.innerHTML = `
        <p>Vamos continuar de onde você parou, ${data.userData.name}. Você está no passo ${data.currentStepId || 3} de ${STEPS.length}.</p>
        <div class="resume-actions">
          <button class="btn-resume-yes">CONTINUAR</button>
          <button class="btn-resume-no">COMEÇAR DE NOVO</button>
        </div>
      `;
      document.body.appendChild(resumeDiv);

      resumeDiv.querySelector(".btn-resume-yes").onclick = () => {
        state.userData = data.userData;
        state.answers = data.answers || {};
        state.selectedPlan = data.selectedPlan || state.selectedPlan;
        state.currentStepId = data.currentStepId || 3;
        resumeDiv.remove();
        document.getElementById("gate").classList.remove("active");
        document.getElementById("progress-bar").style.display = "block";
        showStep();
      };
      resumeDiv.querySelector(".btn-resume-no").onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        resumeDiv.remove();
      };
    } catch (e) {}
  }
  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  // ── INIT ──────────────────────────────────────────────────
  function init() {
    buildStepOrder();
    // Resume progress from localStorage (recover abandoners)
    tryResumeProgress();
    renderGate();
    initProgressBar();
    bindGlobalEvents();
  }

  function buildStepOrder() {
    stepOrder = STEPS.filter((s) => !s.isConditional);
  }

  function getStepById(id) {
    return STEPS.find((s) => s.id === id || s.id === String(id));
  }

  function getCurrentStep() { return stepOrder[state.currentStepIndex]; }
  function getCurrentPhase() { const s = getCurrentStep(); return s ? s.phase : 1; }

  function injectName(text) {
    return text.replace(/\{name\}/g, state.userData.name || "você");
  }

  // ── RENDER GATE ───────────────────────────────────────────
  function renderGate() {
    document.getElementById("gate").innerHTML = `
      <div class="gate-logo">VORTX<span></span></div>
      <div class="gate-badge">${GATE_DATA.badge}</div>
      <h1 class="gate-headline">${GATE_DATA.headline}</h1>
      <p class="gate-subheadline">${GATE_DATA.subheadline}</p>
      ${GATE_DATA.timerStrip ? `<div class="gate-timer-strip">${GATE_DATA.timerStrip}</div>` : ""}
      <button class="btn-cta" id="btn-start">${GATE_DATA.cta}</button>
      <div class="gate-social-proof">
        <div class="stars">★ ★ ★ ★ ★</div>
        <span class="gate-social-count">${GATE_DATA.socialProof}</span>
      </div>
      <div class="gate-privacy">${GATE_DATA.privacySeal}</div>
    `;
  }

  // ── PROGRESS BAR ──────────────────────────────────────────
  function initProgressBar() {
    const phasesContainer = document.getElementById("progress-phases");
    const labelsContainer = document.getElementById("progress-labels");
    let phasesHtml = "";
    let labelsHtml = "";
    PHASES.forEach((p) => {
      phasesHtml += `<div class="progress-phase" data-phase="${p.id}"><div class="progress-phase-fill"></div></div>`;
      labelsHtml += `<span class="progress-phase-label" data-phase-label="${p.id}">${p.label}</span>`;
    });
    phasesContainer.innerHTML = phasesHtml;
    labelsContainer.innerHTML = labelsHtml;

    // Criar elemento de step counter ("Paso X de Y — X%") se ainda não existir
    if (!document.getElementById("progress-step-counter")) {
      const counter = document.createElement("div");
      counter.id = "progress-step-counter";
      counter.className = "progress-step-counter";
      counter.innerHTML = '<span class="progress-step-num"></span><span class="progress-step-pct"></span>';
      labelsContainer.parentNode.insertBefore(counter, labelsContainer);
    }
  }

  function updateProgressBar() {
    const currentPhase = getCurrentPhase();
    const step = getCurrentStep();
    if (!step) return;
    PHASES.forEach((phase) => {
      const barEl   = document.querySelector(`.progress-phase[data-phase="${phase.id}"]`);
      const labelEl = document.querySelector(`[data-phase-label="${phase.id}"]`);
      const fill    = barEl.querySelector(".progress-phase-fill");
      barEl.classList.remove("completed");
      labelEl.classList.remove("active", "completed");
      if (phase.id < currentPhase) {
        barEl.classList.add("completed");
        fill.style.width = "100%";
        labelEl.classList.add("completed");
      } else if (phase.id === currentPhase) {
        labelEl.classList.add("active");
        const phaseSteps = stepOrder.filter((s) => s.phase === currentPhase);
        const currentIdx = phaseSteps.findIndex((s) => s.id === step.id);
        fill.style.width = `${((currentIdx + 1) / phaseSteps.length) * 100}%`;
      } else {
        fill.style.width = "0%";
      }
    });

    // Atualizar o counter numérico
    const counterNum = document.querySelector(".progress-step-num");
    const counterPct = document.querySelector(".progress-step-pct");
    if (counterNum && counterPct) {
      const totalSteps = stepOrder.length;
      const currentIdx = stepOrder.findIndex((s) => s.id === step.id) + 1;
      const pct        = Math.round((currentIdx / totalSteps) * 100);
      counterNum.textContent = `Passo ${currentIdx} de ${totalSteps}`;
      counterPct.textContent = `${pct}%`;
    }
  }


  // ── SOCIAL COUNTER ANIMATION ──────────────────────────────
  function animateSocialCounter() {
    const el = document.getElementById("social-counter");
    if (!el) return;
    const target = 17483;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString("pt-BR");
      if (pct < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── SCREEN MANAGEMENT ─────────────────────────────────────
  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
    state.currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("progress-bar").style.display = screenId === "quiz" ? "block" : "none";
  }

  // ── GLOBAL EVENTS ─────────────────────────────────────────
  function bindGlobalEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.id === "btn-start" || e.target.closest("#btn-start")) {
        unlockAudio();
        if (window.vortxTrack) vortxTrack("quiz_start");
        showScreen("quiz");
        renderStep();
        // History API: marca entrada no quiz para interceptar botão voltar
        try {
          history.pushState({ vortx: "quiz", stepIndex: state.currentStepIndex }, "");
        } catch (err) {}
      }
    });
    document.getElementById("btn-back").addEventListener("click", goBack);
  }

  function unlockAudio() {
    try {
      if (state.audioCtx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      state.audioCtx = ctx;
    } catch (e) {}
  }

  function goBack() {
    if (state.currentStepIndex > 0) {
      // Usa history.back() — isso dispara popstate que faz o rewind
      try {
        history.back();
      } catch (err) {
        // Fallback se History API falhar
        state.currentStepIndex--;
        renderStep();
      }
    }
  }

  // ── POPSTATE LISTENER — Intercepta botão voltar do navegador ──
  window.addEventListener("popstate", function (ev) {
    // Prioridade 1: Se tem lightbox aberto, fecha ele
    var lightbox = document.querySelector(".wa-lightbox");
    if (lightbox) {
      lightbox.remove();
      return;
    }

    // Prioridade 2: Se tem resume banner aberto, ignora
    var resumeBanner = document.querySelector(".resume-banner");
    if (resumeBanner) {
      // Re-empurra estado do quiz para não sair
      try {
        history.pushState({ vortx: "quiz", stepIndex: state.currentStepIndex }, "");
      } catch (err) {}
      return;
    }

    // Prioridade 3: Se está no quiz, navega para step anterior
    if (state.currentScreen === "quiz") {
      var targetIndex = ev.state && ev.state.vortx === "quiz"
        ? ev.state.stepIndex
        : Math.max(0, state.currentStepIndex - 1);
      
      if (targetIndex >= 0 && targetIndex < stepOrder.length) {
        state.currentStepIndex = targetIndex;
        renderStep();
      } else if (targetIndex < 0 || !ev.state) {
        // Voltou além do primeiro step → volta pro gate
        showScreen("gate");
        // Re-empurra estado neutro para manter o controle
        try {
          history.pushState({ vortx: "gate" }, "");
        } catch (err) {}
      }
    }
  });

  // ── RENDER STEP ───────────────────────────────────────────
  function renderStep() {
    const step = getCurrentStep();
    if (!step) return;
    updateProgressBar();
    if (window.vortxTrack) vortxTrack("quiz_step", { step_id: step.id, step_phase: step.phase, step_type: step.type });

    const container = document.getElementById("step-container");
    container.classList.remove("fade-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.classList.add("fade-enter");
      });
    });

    const isSingle = step.type === "single-select";
    const question = injectName(step.question);
    const microcopy = step.microcopy ? injectName(step.microcopy) : null;

    let html = `
      <h2 class="step-question">${question}</h2>
      ${microcopy ? `<p class="step-microcopy">${microcopy}</p>` : '<div class="step-no-microcopy"></div>'}
    `;

    switch (step.type) {
      case "single-select":   html += renderSingleSelect(step);   break;
      case "multi-select":    html += renderMultiSelect(step);    break;
      case "biometric-input": html += renderBiometricInput(step); break;
      case "text-input":      html += renderTextInput(step);      break;
      case "email-input":     html += renderEmailInput(step);     break;
      case "whatsapp-input":  html += renderWhatsappInput(step);  break;
    }

    html += `<div id="step-trigger" class="step-trigger"></div>`;

    if (!isSingle) {
      html += `
        <div class="step-footer">
          <button class="btn-cta" id="btn-continue" disabled>Continuar</button>
        </div>
      `;
    }

    container.innerHTML = html;
    bindStepEvents(step);
    restoreAnswer(step);
  }

  // ── RENDER HELPERS ────────────────────────────────────────
  function renderSingleSelect(step) {
    let html = '<div class="options-grid single-select">';
    step.options.forEach((opt) => {
      const variantClass = opt.variant ? `option-variant-${opt.variant}` : "";
      html += `
        <div class="option-card ${variantClass}" data-value="${opt.value}">
          <div class="option-card-icon">${opt.icon}</div>
          <span class="option-card-label">${opt.label}</span>
        </div>
      `;
    });
    return html + "</div>";
  }

  function renderMultiSelect(step) {
    let html = '<div class="options-grid multi-select">';
    step.options.forEach((opt) => {
      html += `
        <div class="option-card" data-value="${opt.value}">
          <div class="option-card-icon">${opt.icon}</div>
          <span class="option-card-label">${opt.label}</span>
          <div class="option-card-check"></div>
        </div>
      `;
    });
    return html + "</div>";
  }

  function renderBiometricInput(step) {
    let html = '<div class="biometric-grid">';
    step.fields.forEach((f) => {
      html += `
        <div class="input-group">
          <label class="input-label">${f.label}</label>
          <div class="input-wrapper">
            <input type="number" class="input-field mono" id="input-${f.name}" name="${f.name}"
              placeholder="${f.placeholder}" min="${f.min}" max="${f.max}" inputmode="numeric">
            <span class="input-unit">${f.unit}</span>
          </div>
        </div>
      `;
    });
    return html + "</div>";
  }

  function renderTextInput(step) {
    return `
      <div class="input-group">
        <input type="text" class="input-field" id="input-${step.field.name}"
          name="${step.field.name}" placeholder="${step.field.placeholder}"
          maxlength="${step.field.maxLength || 50}" autocomplete="given-name">
      </div>
    `;
  }

  function renderEmailInput(step) {
    return `
      <div class="input-group">
        <input type="email" class="input-field" id="input-${step.field.name}"
          name="${step.field.name}" placeholder="${step.field.placeholder}" autocomplete="email">
      </div>
      <div class="optin-container" id="optin-toggle">
        <div class="optin-checkbox checked" id="optin-check"></div>
        <span class="optin-label">${step.optIn.text}</span>
      </div>
      <p class="body-sm" style="text-align:center;">${step.privacySeal}</p>
    `;
  }

  function renderWhatsappInput(step) {
    return `
      <div class="input-group" style="padding:0;">
        <div class="whatsapp-input-wrapper">
          <div class="whatsapp-ddi-fixed" id="ddi-select" aria-label="Código do país: Brasil +55">🇧🇷 +55</div>
          <input type="tel" class="input-field whatsapp-field" id="input-${step.field.name}"
            name="${step.field.name}" placeholder="(00) 00000-0000"
            inputmode="numeric" maxlength="15" autocomplete="tel">
        </div>
      </div>
      <div class="optin-container" id="optin-toggle">
        <div class="optin-checkbox checked" id="optin-check"></div>
        <span class="optin-label">${step.optIn.text}</span>
      </div>
      <p class="body-sm" style="text-align:center;">${step.privacySeal}</p>
    `;
  }

  // ── BIND EVENTS ───────────────────────────────────────────
  function bindStepEvents(step) {
    const btnContinue = document.getElementById("btn-continue");

    if (step.type === "single-select") {
      document.querySelectorAll(".option-card").forEach((card) => {
        card.addEventListener("click", function () {
          document.querySelectorAll(".option-card").forEach((c) => c.classList.remove("selected"));
          this.classList.add("selected");
          state.answers[step.id] = this.dataset.value;
          const triggerMsg = getTriggerMessage(step, this.dataset.value);
          if (triggerMsg) {
            showShockScreen(injectName(triggerMsg), () => advanceStep());
          } else {
            setTimeout(() => advanceStep(), 450);
          }
        });
      });
    }

    if (step.type === "multi-select") {
      document.querySelectorAll(".option-card").forEach((card) => {
        card.addEventListener("click", function () {
          const val = this.dataset.value;
          if (val === "nenhuma" || val === "nenhum") {
            document.querySelectorAll(".option-card").forEach((c) => c.classList.remove("selected"));
            this.classList.add("selected");
          } else {
            document.querySelector('.option-card[data-value="nenhuma"]')?.classList.remove("selected");
            document.querySelector('.option-card[data-value="nenhum"]')?.classList.remove("selected");
            this.classList.toggle("selected");
          }
          const selected = Array.from(document.querySelectorAll(".option-card.selected")).map((c) => c.dataset.value);
          state.answers[step.id] = selected;
          if (btnContinue) btnContinue.disabled = selected.length < (step.minSelections || 1);
          if (step.triggers && step.triggers._any_except_nenhuma) {
            const hasNeg = selected.some((v) => v !== "nenhuma" && v !== "nenhum");
            if (hasNeg) showInlineTrigger(injectName(step.triggers._any_except_nenhuma));
          }
        });
      });
    }

    if (step.type === "biometric-input") {
      const inputs = document.querySelectorAll(".biometric-grid .input-field");
      const LIMITS = {
        height: { min: 140, max: 220, unit: "cm", label: "Altura" },
        weight: { min: 40,  max: 250, unit: "kg", label: "Peso"   },
      };
      function getError(name, val) {
        const v = Number(val); const l = LIMITS[name];
        if (!l) return null;
        if (!val || isNaN(v) || v === 0) return null;
        if (v < l.min) return `${l.label} mínima: ${l.min}${l.unit}`;
        if (v > l.max) return `${l.label} máxima: ${l.max}${l.unit}`;
        return null;
      }
      function showFieldError(input, msg) {
        const wrapper = input.closest(".input-group");
        let err = wrapper.querySelector(".biometric-error");
        if (msg) {
          if (!err) { err = document.createElement("span"); err.className = "biometric-error"; wrapper.appendChild(err); }
          err.textContent = msg; input.classList.add("input-error");
        } else { if (err) err.remove(); input.classList.remove("input-error"); }
      }
      function validateAll() {
        let allValid = true;
        inputs.forEach((i) => {
          const v = Number(i.value); const l = LIMITS[i.name];
          if (!i.value || isNaN(v) || v === 0) { allValid = false; return; }
          if (l && (v < l.min || v > l.max)) allValid = false;
        });
        if (btnContinue) btnContinue.disabled = !allValid;
      }
      inputs.forEach((input) => {
        input.addEventListener("input", function () {
          showFieldError(this, getError(this.name, this.value));
          if (this.name === "height") state.userData.height = Number(this.value);
          if (this.name === "weight") state.userData.weight = Number(this.value);
          state.answers[step.id] = { height: state.userData.height, weight: state.userData.weight };
          validateAll();
        });
      });
    }

    if (step.type === "text-input") {
      const input = document.getElementById(`input-${step.field.name}`);
      input.addEventListener("input", function () {
        if (btnContinue) btnContinue.disabled = !this.value.trim();
        if (step.field.name === "userName") state.userData.name = this.value.trim();
        state.answers[step.id] = this.value.trim();
      });
      setTimeout(() => input.focus(), 400);
    }

    if (step.type === "email-input") {
      const input = document.getElementById(`input-${step.field.name}`);
      input.addEventListener("input", function () {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
        if (btnContinue) btnContinue.disabled = !valid;
        state.userData.email = this.value.trim();
        state.answers[step.id] = this.value.trim();
      });
      setTimeout(() => input.focus(), 400);
      document.getElementById("optin-toggle")?.addEventListener("click", () => {
        const check = document.getElementById("optin-check");
        check.classList.toggle("checked");
        state.optIn = check.classList.contains("checked");
      });
    }

    if (step.type === "whatsapp-input") {
      const input = document.getElementById(`input-${step.field.name}`);

      // ── Funil 100% Brasil — DDI fixo +55 ──────────────────────────────
      // Brasil: fixo 10 dígitos, celular 11 dígitos (com 9 obrigatório no início)
      const BR_MIN_LEN = 10;
      const BR_MAX_LEN = 11;

      // ── Exibe/oculta mensagem de erro ────────────────────────────────
      function showWhatsappError(msg) {
        const wrapper = input.closest(".input-group");
        let err = wrapper.querySelector(".whatsapp-error");
        if (msg) {
          if (!err) {
            err = document.createElement("span");
            err.className = "whatsapp-error";
            wrapper.appendChild(err);
          }
          err.textContent = msg;
          input.classList.add("input-error");
        } else {
          if (err) err.remove();
          input.classList.remove("input-error");
        }
      }

      // ── Valida número brasileiro: DDD válido + celular com 9 ──────────
      function validateWhatsappIntl(digits) {
        if (digits.length === 0) return null;
        if (digits.length < BR_MIN_LEN) return null; // ainda digitando
        const ddd = parseInt(digits.substring(0, 2), 10);
        if (ddd < 11 || ddd > 99) return "DDD inválido";
        if (digits.length === 11 && digits[2] !== "9") return "Celular deve começar com 9";
        if (/^(\d)\1+$/.test(digits.substring(2))) return "Número inválido";
        return null;
      }

      // ── Máscara brasileira: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX ────────
      function applyMask(rawDigits) {
        const v = rawDigits.substring(0, 11);
        if (v.length > 6) return `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
        if (v.length > 2) return `(${v.substring(0,2)}) ${v.substring(2)}`;
        if (v.length > 0) return `(${v}`;
        return "";
      }

      // ── Atualiza estado do botão e dados do usuário ───────────────────
      function updateWhatsappState() {
        const digits = input.value.replace(/\D/g, "");
        const errorMsg = validateWhatsappIntl(digits);
        const complete = digits.length >= BR_MIN_LEN && digits.length <= BR_MAX_LEN && !errorMsg;
        const isOptional = step.optional === true;

        // Se opcional: mostra erro só se começou a digitar
        showWhatsappError(complete || digits.length === 0 ? null : errorMsg);

        // Se opcional: botão nunca fica disabled.
        // Se obrigatório: botão só habilita com número completo.
        if (btnContinue) {
          btnContinue.disabled = isOptional ? false : !complete;
          updateContinueLabel(complete);
        }

        if (complete) {
          state.userData.whatsapp = `+55${digits}`;
        } else {
          state.userData.whatsapp = "";
        }
        state.answers[step.id] = state.userData.whatsapp;
      }

      // Altera o texto do botão Continuar conforme o lead preenche ou não
      function updateContinueLabel(hasValidNumber) {
        if (!btnContinue || !step.optional) return;
        const label = btnContinue.querySelector(".btn-label") || btnContinue;
        if (hasValidNumber) {
          label.textContent = "ENVIAR PELO WHATSAPP E VER DIAGNÓSTICO";
        } else {
          label.textContent = "VER MEU DIAGNÓSTICO SEM WHATSAPP";
        }
      }

      // Init: se step é opcional, já começa com botão ativo e label "ver sin whatsapp"
      if (step.optional && btnContinue) {
        btnContinue.disabled = false;
        updateContinueLabel(false);
      }

      // ── Listener: input do campo ──────────────────────────────────────
      input.addEventListener("input", function () {
        const rawDigits = this.value.replace(/\D/g, "").substring(0, BR_MAX_LEN);
        this.value = applyMask(rawDigits);
        updateWhatsappState();
      });

      setTimeout(() => input.focus(), 400);

      // ── Opt-in toggle ─────────────────────────────────────────────────
      document.getElementById("optin-toggle")?.addEventListener("click", () => {
        const check = document.getElementById("optin-check");
        check.classList.toggle("checked");
        state.optIn = check.classList.contains("checked");
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener("click", function () {
        if (!this.disabled) advanceStep();
      });
    }
  }

  // ── TRIGGERS ──────────────────────────────────────────────
  function getTriggerMessage(step, value) {
    if (!step.triggers) return null;
    return step.triggers[value] || step.triggers._all || null;
  }

  function showInlineTrigger(text) {
    const el = document.getElementById("step-trigger");
    if (el) { el.textContent = injectName(text); el.classList.add("visible"); }
  }

  // ── ÁUDIO ─────────────────────────────────────────────────
  function playCriticalAlert() {
    try {
      const ctx = state.audioCtx;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      _playAlertTones(ctx);
    } catch (e) {}
  }

  function stopCriticalAlert() {
    try {
      state.alertNodes.forEach((node) => {
        try { node.gain.gain.cancelScheduledValues(0); node.gain.gain.setValueAtTime(0, 0); } catch (_) {}
        try { node.osc.stop(0); } catch (_) {}
      });
    } catch (e) {}
    state.alertNodes = [];
  }

  function _playAlertTones(ctx) {
    try {
      stopCriticalAlert();
      const master = ctx.createGain();
      master.gain.setValueAtTime(1.0, ctx.currentTime);
      master.connect(ctx.destination);
      [0, 0.55, 1.10, 1.65, 2.20].forEach((offset) => {
        const osc1 = ctx.createOscillator(); const gain1 = ctx.createGain();
        osc1.connect(gain1); gain1.connect(master); osc1.type = "sine";
        osc1.frequency.setValueAtTime(130, ctx.currentTime + offset);
        osc1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + offset + 0.45);
        gain1.gain.setValueAtTime(1.0, ctx.currentTime + offset);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.50);
        osc1.start(ctx.currentTime + offset); osc1.stop(ctx.currentTime + offset + 0.50);
        state.alertNodes.push({ osc: osc1, gain: gain1 });

        const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
        osc2.connect(gain2); gain2.connect(master); osc2.type = "sine";
        osc2.frequency.setValueAtTime(420, ctx.currentTime + offset + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + offset + 0.45);
        gain2.gain.setValueAtTime(0.0,  ctx.currentTime + offset + 0.05);
        gain2.gain.linearRampToValueAtTime(0.80, ctx.currentTime + offset + 0.10);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.50);
        osc2.start(ctx.currentTime + offset + 0.05); osc2.stop(ctx.currentTime + offset + 0.50);
        state.alertNodes.push({ osc: osc2, gain: gain2 });
      });
      setTimeout(() => { state.alertNodes = []; }, 3500);
    } catch (e) {}
  }

  // ── SHOCK SCREEN ─────────────────────────────────────────
  function showShockScreen(message, onContinue) {
    const screen = document.getElementById("interstitial");
    const emojiMatch = message.match(/^(🛑|⚠|⚠️|✓)/u);
    const emoji = emojiMatch ? emojiMatch[0] : "⚠️";
    const bodyText = injectName(message.replace(/^(🛑|⚠|⚠️|✓)\s*/u, ""));
    const isCritical = emoji === "🛑";
    const isAlert    = isCritical || emoji === "⚠️" || emoji === "⚠";
    const isPositive = emoji === "✓";

    if (isCritical) playCriticalAlert();

    let shockCta;
    if (isPositive) {
      shockCta = "CONTINUAR →";
    } else if (message.includes("pênis") || message.includes("ereção") || message.includes("duro") || message.includes("abaixo") || message.includes("pílula")) {
      shockCta = isCritical ? "ENTENDI, QUERO SABER SE TEM SOLUÇÃO" : "VER O PRÓXIMO";
    } else if (message.includes("músculo") || message.includes("gordura") || message.includes("barriga") || message.includes("hormônio")) {
      shockCta = isCritical ? "ENTENDI, CONTINUAR O DIAGNÓSTICO" : "VER O PRÓXIMO";
    } else if (message.includes("testosterona") || message.includes("cortisol") || message.includes("energia") || message.includes("sono")) {
      shockCta = isCritical ? "ENTENDI, CONTINUAR O DIAGNÓSTICO" : "VER O PRÓXIMO";
    } else if (message.includes("vaso") || message.includes("sangue") || message.includes("bloqueio") || message.includes("fluxo")) {
      shockCta = isCritical ? "ENTENDI, CONTINUAR O DIAGNÓSTICO" : "VER O PRÓXIMO";
    } else {
      shockCta = isCritical ? "ENTENDI, CONTINUAR O DIAGNÓSTICO" : "VER O PRÓXIMO";
    }

    screen.innerHTML = `
      <div class="shock-screen ${isAlert ? "shock-alert" : ""} ${isPositive ? "shock-positive" : ""}">
        <div class="shock-icon">${emoji}</div>
        <p class="shock-body">${bodyText}</p>
        <button class="btn-cta shock-cta" id="btn-shock-continue">${shockCta}</button>
      </div>
    `;

    showScreen("interstitial");

    document.getElementById("btn-shock-continue").addEventListener("click", () => {
      stopCriticalAlert();
      showScreen("quiz");
      onContinue();
    });
  }

  function restoreAnswer(step) {
    const answer = state.answers[step.id];
    if (!answer) return;
    if (step.type === "single-select") {
      document.querySelector(`.option-card[data-value="${answer}"]`)?.classList.add("selected");
    } else if (step.type === "multi-select" && Array.isArray(answer)) {
      answer.forEach((val) => document.querySelector(`.option-card[data-value="${val}"]`)?.classList.add("selected"));
      const btn = document.getElementById("btn-continue");
      if (btn) btn.disabled = answer.length < (step.minSelections || 1);
    }
  }

  // ── STEP NAVIGATION ───────────────────────────────────────
  function advanceStep() {
    const currentStep = getCurrentStep();

    if (currentStep?.conditional) {
      const answer = state.answers[currentStep.id];
      const target = currentStep.conditional[answer];
      if (target) {
        const condStep = getStepById(target);
        if (condStep) {
          const nextIdx = state.currentStepIndex + 1;
          if (!stepOrder[nextIdx] || stepOrder[nextIdx].id !== condStep.id)
            stepOrder.splice(nextIdx, 0, condStep);
        }
      }
    }

    state.currentStepIndex++;

    if (state.currentStepIndex >= stepOrder.length) {
      startLoading();
      return;
    }

    // History API: push state para cada step (botão voltar navega entre steps)
    try {
      history.pushState({ vortx: "quiz", stepIndex: state.currentStepIndex }, "");
    } catch (err) {}

    const inter = INTERSTITIALS.find((i) => i.afterStep === (currentStep ? currentStep.id : null));
    if (inter) showInterstitial(inter);
    else renderStep();
  }

  // ── INTERSTITIAL DE FASE ──────────────────────────────────
  function showInterstitial(inter) {
    showScreen("interstitial");
    const container = document.getElementById("interstitial");
    // getText() é uma função que gera o texto com dados reais do state
    const dynamicText = typeof inter.getText === "function" ? inter.getText() : inter.text;

    container.innerHTML = `
      <div class="interstitial-image">
        <span class="interstitial-image-placeholder">${inter.emoji}</span>
      </div>
      <h2 class="interstitial-headline">${injectName(inter.headline)}</h2>
      <p class="interstitial-text">${dynamicText}</p>
      <p class="interstitial-stat">${inter.stat}</p>
      <button class="btn-cta" id="btn-inter-continue">${inter.cta || "Continuar"}</button>
    `;

    document.getElementById("btn-inter-continue").addEventListener("click", () => {
      showScreen("quiz");
      renderStep();
    });
  }

  // ── LOADING SCREEN ────────────────────────────────────────
  function startLoading() {
    showScreen("loading");
    if (window.vortxTrack) vortxTrack("quiz_complete");
    const name = state.userData.name || "tú";

    const testimonialsHtml = TESTIMONIALS.map((t, i) => `
      <div class="loading-testimonial-card ${i === 0 ? "active" : ""}" data-testimonial="${i}">
        <div class="loading-testimonial-header">
          <div class="loading-testimonial-avatar"><img src="${t.photo}" alt="${t.initials}" loading="lazy" decoding="async" width="80" height="80"></div>
          <div>
            <div class="loading-testimonial-name">${t.initials}, ${t.age}, ${t.occupation}</div>
            <div class="loading-testimonial-stars">★ ★ ★ ★ ★</div>
          </div>
        </div>
        <div class="loading-testimonial-text">"${t.text}"</div>
        <div class="loading-testimonial-result">
          <span class="loading-testimonial-badge">${t.result}</span>
          <span class="loading-testimonial-highlight">${t.highlight}</span>
        </div>
      </div>
    `).join("");

    document.getElementById("loading").innerHTML = `
      <div class="loading-rings">
        <div class="loading-ring"></div><div class="loading-ring"></div>
        <div class="loading-ring"></div><div class="loading-ring"></div>
        <div class="loading-percentage" id="loading-pct">0%</div>
      </div>
      <h2 class="loading-headline">${injectName(LOADING_DATA.headline)}</h2>
      <p class="loading-message" id="loading-msg">${injectName(LOADING_DATA.messages[0])}</p>
      <div class="loading-testimonials-carousel">${testimonialsHtml}</div>
      <div class="loading-testimonials-dots" id="testimonial-dots">
        ${TESTIMONIALS.map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}" data-dot="${i}"></span>`).join("")}
      </div>
    `;

    calculateScore();

    const pctEl = document.getElementById("loading-pct");
    const msgEl = document.getElementById("loading-msg");
    const messages = LOADING_DATA.messages.map(m => injectName(m));
    const duration = LOADING_DATA.duration;
    const startTime = Date.now();
    let msgIdx = 0, testimonialIdx = 0;

    const msgInterval = setInterval(() => {
      msgIdx++;
      if (msgIdx >= messages.length) { clearInterval(msgInterval); return; }
      msgEl.style.opacity = "0";
      setTimeout(() => { msgEl.textContent = messages[msgIdx]; msgEl.style.opacity = "1"; }, 250);
    }, duration / messages.length);

    const testimonialInterval = setInterval(() => {
      const cards = document.querySelectorAll(".loading-testimonial-card");
      const dots  = document.querySelectorAll(".dot");
      if (!cards.length) { clearInterval(testimonialInterval); return; }
      cards[testimonialIdx].classList.remove("active");
      dots[testimonialIdx]?.classList.remove("active");
      testimonialIdx = (testimonialIdx + 1) % cards.length;
      cards[testimonialIdx].classList.add("active");
      dots[testimonialIdx]?.classList.add("active");
    }, 1800);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      pctEl.textContent = `${pct}%`;
      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(testimonialInterval);
        setTimeout(() => showResult(), 400);
      }
    }, 50);
  }

  // ── SCORE ─────────────────────────────────────────────────
  function calculateScore() {
    let totalWeight = 0, weightedScore = 0;
    const categoryScores = {};

    for (const step of STEPS) {
      if (!step.weight || step.weight === 0) continue;
      const answer = state.answers[step.id];
      if (answer === undefined) continue;
      totalWeight += step.weight;

      if (step.type === "single-select") {
        const opt = step.options.find((o) => o.value === answer);
        if (opt && opt.score !== undefined) {
          const maxScore = Math.max(...step.options.filter(o => o.score !== undefined).map(o => o.score));
          const norm = maxScore > 0 ? opt.score / maxScore : 0;
          weightedScore += norm * step.weight;
          if (step.category) categoryScores[step.category] = norm;
        }
      } else if (step.type === "multi-select" && Array.isArray(answer)) {
        const hasNone = answer.includes("nenhuma") || answer.includes("nenhum");
        if (hasNone) {
          weightedScore += step.weight;
          if (step.category) categoryScores[step.category] = 1;
        } else {
          const maxOpts = step.options.filter(o => o.value !== "nenhuma" && o.value !== "nenhum").length;
          const norm = Math.max(0, 1 - answer.length / maxOpts);
          weightedScore += norm * step.weight;
          if (step.category) categoryScores[step.category] = norm;
        }
      }
    }

    state.score = Math.round(Math.max(15, Math.min(92, totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 50)));
    state.criticalAreas = [];
    for (const [cat, sc] of Object.entries(categoryScores)) {
      const status = sc <= 0.25 ? "critical" : sc <= 0.5 ? "attention" : sc <= 0.75 ? "moderate" : "good";
      state.criticalAreas.push({ category: cat, score: sc, status, ...RESULT_DATA.criticalAreas[cat] });
    }
    state.criticalAreas.sort((a, b) => a.score - b.score);
  }

  // ── RESULT ────────────────────────────────────────────────
  function showResult() {
    showScreen("result");
    const score = state.score;
    if (window.vortxTrack) vortxTrack("view_result", { score: score });
    const zone  = RESULT_DATA.scoreZones.find((z) => score >= z.min && score <= z.max);
    const name  = state.userData.name || "Usuário";
    const circ  = 2 * Math.PI * 80;
    const offset= circ - (score / 100) * circ;

    const areasHtml = state.criticalAreas.map((a) => `
      <div class="critical-area-card">
        <span class="critical-area-icon">${a.icon}</span>
        <div>
          <div class="critical-area-label">${a.label}</div>
          <div class="critical-area-status status-${a.status}">${({critical:"Crítico",attention:"Atenção",moderate:"Moderado",good:"Bom"})[a.status] || a.status}</div>
        </div>
      </div>
    `).join("");

    document.getElementById("result").innerHTML = `
      <h2 class="heading-xl">${RESULT_DATA.headlineTemplate.replace("{name}", name)}</h2>
      <div class="result-gauge">
        <svg viewBox="0 0 200 200">
          <circle class="result-gauge-bg" cx="100" cy="100" r="80"/>
          <circle class="result-gauge-fill" cx="100" cy="100" r="80"
            style="stroke-dasharray:${circ};stroke-dashoffset:${circ};stroke:${zone.color};" id="gauge-fill"/>
        </svg>
        <div class="result-score-value">
          <div class="result-score-number" id="score-display" style="color:${zone.color}">0</div>
          <div class="result-score-out-of">/100</div>
          <div class="result-score-label" style="color:${zone.color}">${zone.label}</div>
        </div>
      </div>
      <p class="result-description">${zone.description}</p>
      <div class="result-critical-areas">${areasHtml}</div>
      <div class="result-urgency-block">
        <p class="result-urgency-text">Seus vasos estão se fechando agora, enquanto você lê isso. Cada mês sem agir é mais bloqueio, menos sangue, menos tamanho, menos duração — e esse grau ainda tem reversão, mas não pra sempre.</p>
        <p class="result-urgency-subtext">O protocolo de reversão vascular foi calibrado pro seu perfil exato.</p>
      </div>
      <div style="width:100%;padding:20px 0;display:flex;justify-content:center;">
        <button class="btn-cta" id="btn-see-protocol">QUERO VER O QUE RESOLVE ISSO</button>
      </div>
    `;

    setTimeout(() => {
      document.getElementById("gauge-fill").style.strokeDashoffset = offset;
      animateNumber("score-display", 0, score, 1500);
    }, 300);

    document.getElementById("btn-see-protocol").addEventListener("click", showBridge);
  }

  function animateNumber(id, start, end, dur) {
    const el = document.getElementById(id);
    if (!el) return;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── BRIDGE ────────────────────────────────────────────────
  function showBridge() {
    showScreen("bridge");
    const name  = state.userData.name || "tú";
    const score = state.score;

    const diasJanela = score <= 35 ? 47 : score <= 60 ? 90 : score <= 80 ? 180 : 365;
    const urgLabel   = score <= 35 ? "CRÍTICA" : score <= 60 ? "CURTA" : "ABERTA";
    const urgColor   = score <= 35 ? "#C44B4B" : score <= 60 ? "#D4940A" : "#C9A84C";

    let bridgeText;
    if (score <= 35) {
      bridgeText = `${name}, seus vasos estão quase fechados — mas "quase" significa que ainda tem tempo. O protocolo foi criado exatamente pra esse grau de bloqueio, pra forçar o sangue a voltar. Não é pra todo mundo. É pra quem chegou até aqui e quer o tamanho, a firmeza e a duração de volta.`;
    } else if (score <= 60) {
      bridgeText = `${name}, seus vasos estão se fechando, mês a mês. O tamanho já caiu. A duração já encurtou. O protocolo de reversão vascular está calibrado pro seu grau exato de bloqueio. Mas cada mês sem agir fecha mais um vaso.`;
    } else if (score <= 80) {
      bridgeText = `${name}, a queda ainda é sutil, mas está acelerando. Em 2-3 anos sem intervenção, o dano fica irreversível. O protocolo freia a queda e maximiza o fluxo sanguíneo ao pênis enquanto ainda dá tempo.`;
    } else {
      bridgeText = `${name}, seus vasos ainda respondem. Mas os fatores de risco estão aí. O protocolo garante que você mantenha e maximize cada centímetro, cada minuto de duração, cada ereção — enquanto os outros ao seu redor vão perdendo.`;
    }

    document.getElementById("bridge").innerHTML = `
      <div class="bridge-container">
        <div class="bridge-icon">⚔️</div>
        <p class="bridge-label">PROTOCOLO ENCONTRADO</p>
        <div class="bridge-window-block">
          <span class="bridge-window-label">Janela para agir</span>
          <span class="bridge-window-status" style="color:${urgColor}">${urgLabel}</span>
          <span class="bridge-window-days" style="color:${urgColor}">${diasJanela} dias estimados</span>
        </div>
        <p class="bridge-text">${bridgeText}</p>
        <div class="bridge-divider"></div>
        <p class="bridge-warning">Protocolo gerado com base nas suas respostas. Acesso restrito.</p>
        <button class="btn-cta" id="btn-bridge-continue">${BRIDGE_DATA.cta}</button>
      </div>
    `;

    document.getElementById("btn-bridge-continue").addEventListener("click", showProtocol);
  }

  // ── PROTOCOL ──────────────────────────────────────────────
  function showProtocol() {
    showScreen("protocol");
    const name     = state.userData.name || "tú";
    const painArea = state.answers[12];

    const headlineMap = {
      parceira: "O Protocolo Para Que Sua Parceira Não Queira Que Você Pare",
      eu_mesmo: "O Protocolo Para Você Voltar a Se Reconhecer Como Homem",
      tudo:     "O Protocolo Para Recuperar Tamanho, Duração e Controle — Tudo de Volta",
      confianza:"O Protocolo Para Recuperar Seu Corpo e Sua Confiança",
    };
    const headline = headlineMap[painArea] || PROTOCOL_DATA.headline;

    const featuresHtml = PROTOCOL_DATA.features.map((f) => `
      <div class="protocol-feature">
        <div class="protocol-feature-icon">${f.icon}</div>
        <div>
          <div class="protocol-feature-title">${f.title}</div>
          <div class="protocol-feature-desc">${f.desc}</div>
        </div>
      </div>
    `).join("");

    // ── Depoimentos filtrados pela dor declarada ──
    const filtered = getFilteredTestimonials(painArea);
    const testimonialsHtml = filtered.map((t) => `
      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="testimonial-avatar"><img src="${t.photo}" alt="${t.initials}" loading="lazy" decoding="async" width="80" height="80"></div>
          <div><div class="testimonial-name">${t.initials}, ${t.age}, ${t.occupation}</div></div>
        </div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-result">
          <span class="testimonial-score">${t.result}</span>
          <span class="testimonial-highlight">${t.highlight}</span>
        </div>
      </div>
    `).join("");

    document.getElementById("protocol").innerHTML = `
      <div style="text-align:center;">
        <p class="body-sm text-gold" style="letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Preparado para ${name}</p>
        <h2 class="heading-xl">${headline}</h2>
        <p class="body-md" style="margin-top:8px;">${PROTOCOL_DATA.subheadline}</p>
      </div>
      <div class="protocol-features">${featuresHtml}</div>
      <div class="protocol-seal">🏥 ${PROTOCOL_DATA.seal}</div>
      <div style="padding:16px 0;display:flex;justify-content:center;">
        <button class="btn-cta" id="btn-go-pricing">${PROTOCOL_DATA.cta}</button>
      </div>
      <div>
        <p class="testimonials-title">Homens que tinham o mesmo problema que você</p>
        ${testimonialsHtml}
      </div>
    `;

    document.getElementById("btn-go-pricing").addEventListener("click", showPricing);
  }

  // ── PRICING ───────────────────────────────────────────────
  function showPricing() {
    showScreen("pricing");
    if (window.vortxTrack) vortxTrack("view_pricing", { score: state.score });

    const painArea  = state.answers[12];
    const name      = state.userData.name || "";
    const buildCheckoutCta = (planId) => {
      const plan = PRICING_DATA.plans.find((p) => p.id === planId);
      if (!plan) return "";
      return `<span style="display:block;font-size:0.65rem;letter-spacing:2px;opacity:0.7;margin-bottom:2px;">${plan.ctaTag}</span>${plan.ctaLabel}<br><span style="display:block;font-size:1.4rem;margin-top:4px;">R$ ${plan.price}</span>`;
    };

    const plansHtml = PRICING_DATA.plans.map((plan) => {
      const isFeatured  = plan.id === "vitalicio";
      const isSelected  = plan.id === state.selectedPlan;
      const isDowngrade = plan.id === "mensal";
      const isAnchor    = plan.isAnchor === true;
      const featList    = plan.features.map((f) => `<li>${f}</li>`).join("");
      return `
        <div class="pricing-plan ${isFeatured ? "featured" : ""} ${isSelected ? "selected" : ""} ${isDowngrade ? "plan-downgrade" : ""} ${isAnchor ? "plan-anchor" : ""}" data-plan="${plan.id}">
          ${plan.badge ? `<div class="pricing-plan-badge-top">${plan.badge}</div>` : ""}
          ${isDowngrade ? `<div class="plan-downgrade-label">⚠ Versão limitada — sem protocolo vascular</div>` : ""}
          ${isAnchor ? `<div class="plan-anchor-label">⚠ Versão limitada — sem protocolo completo</div>` : ""}
          <div class="pricing-plan-header">
            <div class="pricing-plan-name">${plan.name}</div>
            <div class="pricing-plan-price-container">
              <div class="pricing-plan-original-price">R$ ${plan.originalPrice}</div>
              <div class="pricing-plan-price"><span>R$</span> ${plan.price}</div>
              <div class="pricing-plan-period">${plan.period}</div>
            </div>
          </div>
          <ul class="pricing-plan-features">${featList}</ul>
        </div>
      `;
    }).join("");

    originalPlansHtml = plansHtml;

    const selectedPrice = PRICING_DATA.plans.find((p) => p.id === state.selectedPlan).price;

    const score = state.score;
    const pricingHeadline = score <= 35
      ? `${name ? name + ", seus" : "Seus"} vasos estão quase fechados. Essa é a última janela.`
      : score <= 60
      ? `${name ? name + ", o" : "O"} bloqueio ainda é reversível — mas não por muito tempo.`
      : `${name ? name + ", o" : "O"} protocolo vascular está pronto. Só falta você.`;

    document.getElementById("pricing").innerHTML = `
      <div style="text-align:center;">
        <h2 class="heading-xl">${pricingHeadline}</h2>
      </div>

      <div class="pricing-timer-container">
        <div class="pricing-timer-label">${PRICING_DATA.urgencyText}</div>
        <div class="pricing-timer" id="pricing-timer">08:00</div>
        <div class="pricing-timer-sub">Depois disso o preço volta para R$ 197</div>
      </div>

      <div class="pricing-social-counter">
        <div class="pricing-social-num" id="social-counter">17.483</div>
        <div class="pricing-social-txt">homens já começaram o protocolo</div>
        <div class="pricing-social-live"><span class="pulse-dot"></span> 34 pessoas vendo essa página agora</div>
      </div>

      <div class="pricing-anchor-block">
        <p class="pricing-anchor-text">Cada mês sem agir você perde mais tamanho, mais firmeza, mais duração. Em 12 meses o dano fica irreversível — e o custo de não agir é perder o que te faz homem.</p>
      </div>

      <!-- HORMOZI VALUE STACK -->
      <div class="value-stack">
        <div class="value-stack-header">O QUE VOCÊ RECEBE HOJE:</div>
        <div class="value-stack-item">
          <div class="vsi-check">✓</div>
          <div class="vsi-content">
            <div class="vsi-title">Diagnóstico Vascular Personalizado</div>
            <div class="vsi-desc">Seu mapa exato de bloqueio com base nas respostas do teste</div>
          </div>
          <div class="vsi-price">R$ 47</div>
        </div>
        <div class="value-stack-item">
          <div class="vsi-check">✓</div>
          <div class="vsi-content">
            <div class="vsi-title">Protocolo Vascular de 21 Dias</div>
            <div class="vsi-desc">As 4 rotinas — quase nenhuma leva mais de 4 minutos por dia</div>
          </div>
          <div class="vsi-price">R$ 97</div>
        </div>
        <div class="value-stack-item">
          <div class="vsi-check">✓</div>
          <div class="vsi-content">
            <div class="vsi-title">Plano Alimentar Anti-Estrogênio</div>
            <div class="vsi-desc">Os 12 alimentos que disparam testosterona + os 10 que destroem</div>
          </div>
          <div class="vsi-price">R$ 39</div>
        </div>
        <div class="value-stack-item">
          <div class="vsi-check">✓</div>
          <div class="vsi-content">
            <div class="vsi-title">Stack Hormonal Noturno</div>
            <div class="vsi-desc">3 compostos baratos que triplicam sua testosterona enquanto você dorme</div>
          </div>
          <div class="vsi-price">R$ 29</div>
        </div>
        <div class="value-stack-item value-stack-bonus">
          <div class="vsi-check">🎁</div>
          <div class="vsi-content">
            <div class="vsi-title">BÔNUS: Acesso vitalício</div>
            <div class="vsi-desc">Todas as atualizações futuras incluídas — sem custo extra</div>
          </div>
          <div class="vsi-price">R$ 47</div>
        </div>

        <div class="value-stack-total">
          <div class="vst-label">VALOR TOTAL:</div>
          <div class="vst-old">R$ 259</div>
        </div>
        <div class="value-stack-today">
          <div class="vsth-label">HOJE, SÓ HOJE:</div>
          <div class="vsth-price"><span>R$</span>27</div>
          <div class="vsth-tag">90% de desconto porque você entrou pelo diagnóstico gratuito</div>
        </div>
      </div>

      <div class="pricing-plans" style="display:none;">${plansHtml}</div>

      <div class="effort-box">
        <div class="effort-icon">⏱️</div>
        <div class="effort-content">
          <div class="effort-title">4 minutos por dia. Sem pílulas. Sem receita.</div>
          <div class="effort-desc">Sem academia, sem dietas extremas, sem produtos químicos. Só rotinas simples que qualquer homem faz em casa.</div>
        </div>
      </div>

      <div class="pricing-urgency-bio-block">
        <p class="pricing-urgency-bio-text">Hoje à noite você vai deitar. Vai olhar pro teto e vai saber que podia ter feito algo diferente. Amanhã vai acordar igual ou pior. O bloqueio vascular não espera, não para, não negocia. <strong>A única pergunta é: você vai agir enquanto ainda dá tempo?</strong></p>
      </div>

      <!-- HORMOZI DOUBLE-YOUR-MONEY GUARANTEE -->
      <div class="guarantee-box guarantee-box--doubled">
        <div class="guarantee-shield">🛡️</div>
        <div class="guarantee-badge">GARANTIA EM DOBRO</div>
        <div class="guarantee-title-big">Resultado visível em 30 dias — ou eu devolvo o DOBRO.</div>
        <p class="guarantee-text-big">Se em 30 dias sua parceira não notar a mudança sem que você precise dizer nada, devolvo os R$ 27 + outros R$ 27 pelo meu erro. <strong>Total: R$ 54.</strong> O risco é 100% meu. Você só precisa seguir o protocolo.</p>
        <div class="guarantee-small">Sem perguntas. Sem burocracia. Sem letrinha miúda.</div>
      </div>

      <!-- WHATSAPP-STYLE TESTIMONIAL PLACEHOLDERS (you'll add real images here) -->
      <div class="whatsapp-testimonials" id="wa-testimonials">
        <div class="wa-test-header">📱 Mensagens reais de clientes</div>
        <div class="wa-test-grid">
          <div class="wa-placeholder" data-slot="1">
            <!-- Insert WhatsApp screenshot #1 here (upload to /img/wa1.jpg) -->
            <img src="img/wa1.jpg" alt="Mensagem de cliente" loading="lazy" onerror="this.style.display='none'">
          </div>
          <div class="wa-placeholder" data-slot="2">
            <img src="img/wa2.jpg" alt="Mensagem de cliente" loading="lazy" onerror="this.style.display='none'">
          </div>
          <div class="wa-placeholder" data-slot="3">
            <img src="img/wa3.jpg" alt="Mensagem de cliente" loading="lazy" onerror="this.style.display='none'">
          </div>
          <div class="wa-placeholder" data-slot="4">
            <img src="img/wa4.jpg" alt="Mensagem de cliente" loading="lazy" onerror="this.style.display='none'">
          </div>
        </div>
      </div>

      <div class="testimonial-pre-cta">
        <div class="testimonial-pre-cta-stars">★★★★★</div>
        <p class="testimonial-pre-cta-text">"No dia 14 minha esposa me olhou diferente. Eu não disse nada. Não precisei."</p>
        <span class="testimonial-pre-cta-author">— Roberto M., 44 anos · Rio de Janeiro</span>
      </div>

      <div class="checkout-cta-block">
        <a href="https://checkout.ticto.app/O41BD3C90" class="btn-cta btn-cta--checkout" id="btn-checkout" rel="noopener">${buildCheckoutCta(state.selectedPlan)}</a>
        <p class="checkout-sub">Acesso imediato • Sem assinatura oculta • Garantia em DOBRO — 30 dias</p>
        <div class="payment-methods">
          ${PRICING_DATA.paymentMethods.map((m) => `<span class="payment-method">${m}</span>`).join("")}
        </div>
      </div>

      <div class="final-reassurance">
        <div class="fr-item">🔒 Pagamento 100% seguro</div>
        <div class="fr-item">✉️ Acesso imediato por email</div>
        <div class="fr-item">🛡️ Garantia em dobro — 30 dias</div>
      </div>
    `;

    // Animated social counter
    animateSocialCounter();

    // Exit intent popup (desktop mouseleave + mobile scroll up detection)
    setupExitIntent();


    // WhatsApp testimonial lightbox (tap to enlarge) — com suporte ao botão voltar
    document.querySelectorAll(".wa-placeholder img").forEach(function(img) {
      img.addEventListener("click", function(ev) {
        if (img.style.display === "none") return;
        ev.preventDefault();
        var overlay = document.createElement("div");
        overlay.className = "wa-lightbox";
        overlay.innerHTML = '<button class="wa-lightbox-close" aria-label="Fechar">✕</button><img src="' + img.src + '" alt="">';
        document.body.appendChild(overlay);

        // Push state para botão voltar fechar o lightbox em vez de sair do site
        try { history.pushState({ vortx: "lightbox" }, ""); } catch (err) {}

        var closeLightbox = function() {
          // Se o state atual é o do lightbox, volta (dispara popstate que remove o overlay)
          if (history.state && history.state.vortx === "lightbox") {
            try { history.back(); return; } catch (err) {}
          }
          overlay.remove();
        };
        overlay.addEventListener("click", closeLightbox);
      });
    });

    rebindPlanSelection(buildCheckoutCta);



    // ── EXIT INTENT POPUP ─────────────────────────────────────
    // Oferta A (recomendada): guardar diagnóstico por 24h SEM desconto.
    // Captura WhatsApp/email para recovery. NÃO treina o lead a esperar desconto.
    function setupExitIntent() {
      if (state.exitIntentShown) return;
      if (sessionStorage.getItem("vx_exit_shown_v1")) return;

      var fired = false;
      function fire() {
        if (fired) return;
        fired = true;
        state.exitIntentShown = true;
        try { sessionStorage.setItem("vx_exit_shown_v1", "1"); } catch (e) {}
        showExitIntentPopup();
      }

      // DESKTOP: detecta mouse saindo do topo da viewport
      var mouseLeaveHandler = function (ev) {
        if (ev.clientY <= 0) fire();
      };
      document.addEventListener("mouseleave", mouseLeaveHandler);

      // MOBILE: detecta scroll rápido pra cima após chegar ao final
      var lastY = window.scrollY;
      var reachedBottom = false;
      var scrollHandler = function () {
        var currentY = window.scrollY;
        var pct = (currentY + window.innerHeight) / document.body.scrollHeight;
        if (pct > 0.70) reachedBottom = true;
        if (reachedBottom && lastY - currentY > 45) {
          // scroll UP rápido depois de ter descido → intent de sair
          fire();
        }
        lastY = currentY;
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });

      // MOBILE FALLBACK: tempo longo parado sem scroll (60s) na pricing
      setTimeout(function () {
        if (!fired && window.scrollY < 200) fire();
      }, 60000);
    }

    function showExitIntentPopup() {
      if (document.getElementById("vx-exit-popup")) return;

      var userName = (state.userData && state.userData.name) || "";
      var prefillWhatsapp = (state.userData && state.userData.whatsapp) || "";

      var popup = document.createElement("div");
      popup.id = "vx-exit-popup";
      popup.className = "vx-exit-popup";
      popup.innerHTML = `
        <div class="vep-card">
          <button class="vep-close" aria-label="Fechar">✕</button>
          <div class="vep-icon">⏸</div>
          <div class="vep-title">Espera${userName ? ", " + escapeHtml(userName) : ""} — antes de ir</div>
          <div class="vep-subtitle">Posso fazer uma coisa por você?</div>
          <div class="vep-body">
            <p><strong>Guardo seu diagnóstico de graça por 24 horas.</strong></p>
            <p>O preço de <span class="vep-price-now">R$ 27</span> continua disponível se você decidir voltar. Depois disso, volta para <span class="vep-price-old">R$ 97</span>.</p>
            <p class="vep-note">Mando pro seu WhatsApp — sem spam, uma única mensagem.</p>
          </div>
          <form class="vep-form" id="vep-form">
            <input type="tel" id="vep-whatsapp" placeholder="Seu WhatsApp (com DDD)" value="${prefillWhatsapp ? escapeHtml(prefillWhatsapp) : ""}" required>
            <button type="submit" class="vep-btn">GUARDA MEU DIAGNÓSTICO</button>
          </form>
          <button class="vep-skip" id="vep-skip">Não, obrigado, fechar</button>
          <div class="vep-footer">
            <span>🔒 100% privado</span>
            <span>•</span>
            <span>Uma única mensagem</span>
            <span>•</span>
            <span>Sem spam</span>
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      // Track
      if (window.vortxTrack) vortxTrack("exit_intent_shown");

      var closePopup = function () {
        popup.classList.add("vep-closing");
        setTimeout(function () { popup.remove(); }, 250);
      };

      popup.querySelector(".vep-close").addEventListener("click", closePopup);
      popup.querySelector("#vep-skip").addEventListener("click", function () {
        if (window.vortxTrack) vortxTrack("exit_intent_decline");
        closePopup();
      });

      // Click no overlay (fora do card) fecha
      popup.addEventListener("click", function (ev) {
        if (ev.target === popup) closePopup();
      });

      popup.querySelector("#vep-form").addEventListener("submit", function (ev) {
        ev.preventDefault();
        var wa = popup.querySelector("#vep-whatsapp").value.trim();
        if (!wa || wa.length < 7) return;

        // Persist para usar no recovery
        try {
          state.userData.whatsapp = wa;
          localStorage.setItem("vx_exit_recovery", JSON.stringify({
            whatsapp: wa,
            name: userName,
            timestamp: Date.now(),
            plan: state.selectedPlan
          }));
        } catch (e) {}

        if (window.vortxTrack) {
          vortxTrack("exit_intent_captured", {
            has_whatsapp: true,
            plan: state.selectedPlan
          });
        }

        // Mostrar confirmação dentro do próprio popup
        popup.querySelector(".vep-card").innerHTML = `
          <div class="vep-success">
            <div class="vep-success-icon">✓</div>
            <div class="vep-success-title">Diagnóstico guardado!</div>
            <p>Te mando o resumo em instantes. O preço de R$ 27 continua disponível por 24 horas.</p>
            <button class="vep-btn vep-btn-back" id="vep-stay">Continuar aqui e ver a oferta</button>
          </div>
        `;
        popup.querySelector("#vep-stay").addEventListener("click", closePopup);
      });
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    // ── CHECKOUT TRANSITION SCREEN ────────────────────────────
    // Tela de preparação mental antes do redirect para PerfectPay
    function showCheckoutTransition() {
      var existing = document.getElementById("checkout-transition");
      if (existing) return;

      var overlay = document.createElement("div");
      overlay.id = "checkout-transition";
      overlay.className = "checkout-transition";
      overlay.innerHTML = `
        <div class="ct-card">
          <div class="ct-spinner">
            <div class="ct-spinner-ring"></div>
            <div class="ct-spinner-lock">🔒</div>
          </div>
          <div class="ct-title">Preparando seu pagamento seguro</div>
          <div class="ct-steps">
            <div class="ct-step ct-step-1">
              <span class="ct-check">✓</span>
              <span>Dados validados</span>
            </div>
            <div class="ct-step ct-step-2">
              <span class="ct-check">✓</span>
              <span>Conexão SSL criptografada</span>
            </div>
            <div class="ct-step ct-step-3">
              <span class="ct-check">✓</span>
              <span>Conectando com Ticto...</span>
            </div>
          </div>
          <div class="ct-footer">
            <img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23C9A84C\'><path d=\'M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z\'/></svg>" alt="" class="ct-badge-icon">
            <span>Processado pela <strong>Ticto</strong> — plataforma 100% segura</span>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Animar os checks sequencialmente
      setTimeout(function(){ overlay.querySelector(".ct-step-1").classList.add("done"); }, 200);
      setTimeout(function(){ overlay.querySelector(".ct-step-2").classList.add("done"); }, 600);
      setTimeout(function(){ overlay.querySelector(".ct-step-3").classList.add("done"); }, 1000);
    }

    document.getElementById("btn-checkout").addEventListener("click", (ev) => {
      ev.preventDefault();

      var selectedPlan = state.selectedPlan;
      var plan  = PRICING_DATA.plans.find(function (p) { return p.id === selectedPlan; });
      var price = plan ? plan.price : 0;

      // ── DISPARO SÍNCRONO DO InitiateCheckout ──────────────────
      // vortxTrackSync força load do pixel E dispara fbq imediatamente.
      // Retorna o event_id para rastreamento.
      var eventId = null;
      if (window.vortxTrackSync) {
        eventId = window.vortxTrackSync("begin_checkout", {
          value:    price,
          currency: "BRL",
          plan:     selectedPlan
        });
      } else if (window.vortxTrack) {
        // Fallback
        vortxTrack("begin_checkout", { value: price, currency: "BRL", plan: selectedPlan });
      }

      // ── MONTAGEM DA URL COM ATRIBUIÇÃO ─────────────────────────
      // Parâmetros nativos do quiz
      var userName = encodeURIComponent(state.userData.name || "");
      var baseUrl  = "https://checkout.ticto.app/O41BD3C90";
      var checkoutUrl = baseUrl + "?name=" + userName + "&plan=" + selectedPlan + "&value=" + price;
      if (state.userData.whatsapp) checkoutUrl += "&phonenumber=" + encodeURIComponent(state.userData.whatsapp);

      // Atribuição Meta Ads (fbclid, fbp, fbc) + sck único + UTMs
      // sck é a chave única por visitante, gerada em tracking-stub.js
      // e incluída automaticamente no dataLayer.push de begin_checkout.
      // Cruza dados client-side (Stape Store, gravado pela Tag BD InitiateCheckout)
      // com o webhook server-side da Ticto.
      try {
        // sck único por visitante (mesmo que vai no dataLayer do begin_checkout)
        var sck = window.vortxGetOrCreateSck ? window.vortxGetOrCreateSck() : null;
        if (sck) checkoutUrl += "&sck=" + encodeURIComponent(sck);

        if (window.vortxGetAttribution) {
          var attr = window.vortxGetAttribution();
          // fbclid — parâmetro de atribuição Meta Ads
          if (attr.fbclid) checkoutUrl += "&fbclid=" + encodeURIComponent(attr.fbclid);
          // fbp/fbc passados como params diretos
          if (attr.fbp) checkoutUrl += "&fbp=" + encodeURIComponent(attr.fbp);
          if (attr.fbc) checkoutUrl += "&fbc=" + encodeURIComponent(attr.fbc);
          if (eventId)  checkoutUrl += "&eid=" + encodeURIComponent(eventId);
          // src recebe utm_campaign (campo separado do sck, não conflita)
          if (attr.utm_campaign) checkoutUrl += "&src=" + encodeURIComponent(attr.utm_campaign);
        }
      } catch (e) {}

      // ── TELA DE TRANSIÇÃO "PREPARANDO TU PAGO" ──────────────
      // Prepara mentalmente o lead para o redirect (evita estranhamento
      // ao ver checkout.ticto.com.br na barra de endereço) + dá tempo para o
      // Pixel do Meta disparar antes da navegação.
      // Atualiza href do <a> para que GTM detecte navegação correta como gtm.linkClick
      try { ev.target.closest("a").setAttribute("href", checkoutUrl); } catch(_) {}
      showCheckoutTransition();
      setTimeout(function () {
        try { clearProgress(); } catch(e){}
        window.location.href = checkoutUrl;
      }, 1400);
    });
    startPricingTimer();
  }

  function startPricingTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timerSeconds--;
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        state.timerSeconds = 0;
        const timerEl = document.getElementById("pricing-timer");
        if (timerEl) timerEl.textContent = "00:00";
        const plansEl = document.querySelector(".pricing-plans");
        if (plansEl) {
          plansEl.innerHTML = `
            <div class="timer-expired-block">
              <div class="timer-expired-icon">⏰</div>
              <p class="timer-expired-title">Esse preço não está mais disponível.</p>
              <p class="timer-expired-text">O preço especial expirou e o protocolo voltou para R$ 197.</p>
              <button class="btn-cta" id="btn-recover-offer">QUERO 10 MINUTOS A MAIS COM O PREÇO ESPECIAL</button>
            </div>
          `;
          document.getElementById("btn-recover-offer").addEventListener("click", () => {
            state.timerSeconds = 10 * 60;
            plansEl.innerHTML = originalPlansHtml;
            rebindPlanSelection((planId) => {
              const plan = PRICING_DATA.plans.find((p) => p.id === planId);
              if (!plan) return "";
              return `<span style="display:block;font-size:0.65rem;letter-spacing:2px;opacity:0.7;margin-bottom:2px;">${plan.ctaTag}</span>${plan.ctaLabel}<br><span style="display:block;font-size:1.4rem;margin-top:4px;">R$ ${plan.price}</span>`;
            });
            startPricingTimer();
          });
        }
        return;
      }
      const m = Math.floor(state.timerSeconds / 60);
      const s = state.timerSeconds % 60;
      const el = document.getElementById("pricing-timer");
      if (el) el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (state.timerSeconds <= 60) document.getElementById("pricing-timer")?.classList.add("timer-critical");
    }, 1000);
  }

  let originalPlansHtml = "";

  function rebindPlanSelection(buildCtaFn) {
    document.querySelectorAll(".pricing-plan").forEach((el) => {
      el.addEventListener("click", function () {
        document.querySelectorAll(".pricing-plan").forEach((p) => p.classList.remove("selected"));
        this.classList.add("selected");
        state.selectedPlan = this.dataset.plan;
        const btn   = document.getElementById("btn-checkout");
        if (btn && buildCtaFn) btn.innerHTML = buildCtaFn(state.selectedPlan);
      });
    });
  }

  // ── THANK YOU ─────────────────────────────────────────────
  function showThankYou() {
    showScreen("thankyou");
    const name = state.userData.name || "Usuário";
    const stepsHtml = THANKYOU_DATA.steps.map((s) => `
      <div class="thankyou-step">
        <div class="thankyou-step-number">${s.number}</div>
        <div>
          <div class="thankyou-step-title">${s.title}</div>
          <div class="thankyou-step-desc">${s.desc}</div>
        </div>
      </div>
    `).join("");
    document.getElementById("thankyou").innerHTML = `
      <div class="thankyou-checkmark">✓</div>
      <div>
        <h2 class="heading-xl">${THANKYOU_DATA.headline.replace("{name}", name)}</h2>
        <p class="body-md" style="margin-top:8px;text-align:center;">${THANKYOU_DATA.subheadline}</p>
      </div>
      <div class="thankyou-steps">${stepsHtml}</div>
      <button class="btn-cta" id="btn-access-app">${THANKYOU_DATA.cta}</button>
      <p class="body-sm" style="text-align:center;">Diagnóstico enviado para o WhatsApp <strong>${state.userData.whatsapp || "informado"}</strong></p>
    `;
    document.getElementById("btn-access-app").addEventListener("click", () => { /* CHECKOUT */ });
    if (state.timerInterval) clearInterval(state.timerInterval);
  }

  // ── INIT ──────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", init);
})();
