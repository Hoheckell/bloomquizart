const STORAGE_KEY = "mosaico-sonoro-v1";

const defaultState = () => ({
  name: "",
  interest: "",
  title: "",
  coins: 0,
  xp: 0,
  hints: 1,
  theme: "",
  unlockedLevel: 1,
  qIndex: 0,
  completedLevels: [],
  medals: [],
  owned: [],
  answered: {},
  mosaicBits: 0,
  tokens: 0,
  started: false
});

let state = load();
let questions = [];
let selected = null;
let lastScreen = "welcome";
let waitingNext = false;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = { ...defaultState(), ...JSON.parse(raw) };
    if (parsed.answered && !Array.isArray(parsed.answered)) {
      parsed.answered = { ...parsed.answered };
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function $(id) {
  return document.getElementById(id);
}

function announce(msg) {
  $("live").textContent = msg;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  const target = $("screen-" + id);
  if (target) target.classList.add("active");
  lastScreen = id;
  const hudOn = id !== "welcome";
  $("hud").hidden = !hudOn;
  window.scrollTo(0, 0);
}

function grantMedal(id) {
  if (state.medals.includes(id)) return;
  state.medals.push(id);
  save();
  announce("Nova medalha: " + (MEDALS.find((m) => m.id === id) || {}).name);
}

function addCoins(n, xp) {
  state.coins += n;
  state.xp += xp || 0;
  save();
  renderHud();
}

function renderHud() {
  const label = state.title ? state.name + " · " + state.title : state.name || "Jogador";
  $("chip-name").textContent = label;
  $("coins").textContent = state.coins;
  $("xp").textContent = state.xp;
  if (state.theme) document.documentElement.setAttribute("data-theme", state.theme);
  else document.documentElement.removeAttribute("data-theme");
}

function fillInterestSelect() {
  const sel = $("player-interest");
  INTERESTS.forEach((it) => {
    const o = document.createElement("option");
    o.value = it.id;
    o.textContent = it.label;
    sel.appendChild(o);
  });
}

function qKey(q) {
  return q && q.id ? q.id : "i-" + questions.indexOf(q);
}

function isAnswered(q) {
  if (!q) return false;
  if (state.answered[qKey(q)]) return true;
  const idx = questions.indexOf(q);
  return !!(state.answered[idx] || state.answered[String(idx)]);
}

function questionsForLevel(level) {
  return questions.filter((q) => q.level === level);
}

function currentQuestion() {
  return questions[state.qIndex] || null;
}

function indexOfFirstUnansweredInLevel(level) {
  const list = questions
    .map((q, i) => ({ q, i }))
    .filter((x) => x.q.level === level);
  const open = list.find((x) => !isAnswered(x.q));
  return open ? open.i : list[0].i;
}

function isLevelComplete(level) {
  return questions.filter((q) => q.level === level).every((q) => isAnswered(q));
}

function mosaicColors() {
  return ["#4338ca", "#1d4ed8", "#0d9488", "#7c3aed", "#c2410c", "#be185d", "#ca8a04", "#0369a1"];
}

function renderMosaic() {
  const box = $("mosaic");
  box.innerHTML = "";
  const colors = mosaicColors();
  const total = 36;
  const filled = Math.min(total, state.mosaicBits);
  for (let i = 0; i < total; i++) {
    const c = document.createElement("div");
    c.className = "mosaic-cell" + (i < filled ? " on" : "");
    if (i < filled) c.style.background = colors[i % colors.length];
    box.appendChild(c);
  }
}

function renderMap() {
  const map = $("map");
  map.innerHTML = "";
  const doneCount = BLOOM.filter((b) => isLevelComplete(b.id)).length;
  $("global-progress").style.width = (doneCount / 6) * 100 + "%";
  $("global-progress-label").textContent = doneCount + "/6";
  renderMosaic();

  BLOOM.forEach((b) => {
    const done = isLevelComplete(b.id);
    const locked = b.id > state.unlockedLevel;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile" + (done ? " done" : "") + (!locked && !done ? " current" : "");
    btn.disabled = locked;
    const qCount = questionsForLevel(b.id).length;
    const answered = questions.filter((q) => q.level === b.id && isAnswered(q)).length;
    btn.innerHTML =
      '<span class="lvl">Nível ' + b.id + " · " + b.verb + "</span>" +
      "<strong>" + b.name + "</strong>" +
      "<span>" + b.place + "</span>" +
      '<div class="progress-track"><div class="progress-fill" style="width:' + (qCount ? (answered / qCount) * 100 : 0) + '%"></div></div>' +
      "<span class='muted'>" + (locked ? "Trancado" : done ? "Selo conquistado" : answered + "/" + qCount + " peças") + "</span>";
    btn.addEventListener("click", () => startLevel(b.id));
    map.appendChild(btn);
  });
}

function startLevel(level) {
  state.qIndex = indexOfFirstUnansweredInLevel(level);
  save();
  openQuestion();
}

function openQuestion() {
  const q = currentQuestion();
  if (!q) {
    showScreen("map");
    renderMap();
    return;
  }
  if (isAnswered(q)) {
    goNextQuestion();
    return;
  }
  selected = null;
  waitingNext = false;
  $("q-kicker").textContent = "Nível " + q.level + " · " + BLOOM[q.level - 1].name + " · " + BLOOM[q.level - 1].place;
  $("q-title").textContent = "Peça " + (questions.filter((x, i) => x.level === q.level && i <= state.qIndex).length) + " desta sala";
  $("q-prompt").textContent = q.prompt;
  $("q-meta").innerHTML =
    '<span class="tag">+' + q.coins + " notas</span>" +
    '<span class="tag">+' + q.xp + " XP</span>" +
    (q.checkpoint ? '<span class="tag">Checkpoint</span>' : "") +
    (q.type === "open" ? '<span class="tag">Resposta sua</span>' : '<span class="tag">Escolha</span>');
  $("q-hint").hidden = true;
  $("q-hint").textContent = "";
  $("q-feedback").hidden = true;
  $("q-feedback").textContent = "";
  $("btn-next").hidden = true;
  $("btn-submit").hidden = false;
  $("btn-submit").disabled = false;
  $("btn-hint").disabled = false;

  const body = $("q-body");
  body.innerHTML = "";
  if (q.type === "mc") {
    const wrap = document.createElement("div");
    wrap.className = "choices";
    wrap.setAttribute("role", "radiogroup");
    q.options.forEach((op, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.dataset.id = op.id;
      b.innerHTML = '<span class="key">' + op.id.toUpperCase() + "</span>" + op.text;
      b.addEventListener("click", () => {
        selected = op.id;
        wrap.querySelectorAll(".choice").forEach((c) => c.classList.remove("selected"));
        b.classList.add("selected");
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
  } else {
    const field = document.createElement("div");
    field.className = "field";
    const lab = document.createElement("label");
    lab.setAttribute("for", "open-answer");
    lab.textContent = "Sua resposta (com suas palavras)";
    const ta = document.createElement("textarea");
    ta.id = "open-answer";
    ta.maxLength = 600;
    ta.placeholder = "Escreva aqui. Frases curtas valem.";
    field.appendChild(lab);
    field.appendChild(ta);
    body.appendChild(field);
  }
  showScreen("quest");
}

function wordCount(t) {
  return t.trim().split(/\s+/).filter(Boolean).length;
}

function keywordHit(text, keys) {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return (keys || []).some((k) => n.includes(k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
}

function showFeedback(kind, html) {
  const box = $("q-feedback");
  box.hidden = false;
  box.className = "feedback " + kind;
  box.innerHTML = html;
  announce(box.textContent);
}

function submitAnswer() {
  const q = currentQuestion();
  if (!q || waitingNext) return;

  if (q.type === "mc") {
    if (!selected) {
      showFeedback("info", "Escolha uma opção primeiro. Só uma.");
      return;
    }
    const buttons = document.querySelectorAll(".choice");
    if (selected === q.answer) {
      buttons.forEach((b) => {
        b.disabled = true;
        if (b.dataset.id === q.answer) b.classList.add("correct");
      });
      succeed(q);
    } else {
      buttons.forEach((b) => {
        if (b.dataset.id === selected) b.classList.add("wrong");
      });
      fail(q);
    }
    return;
  }

  const text = ($("open-answer") || {}).value || "";
  if (wordCount(text) < (q.minWords || 6)) {
    showFeedback("try", "Escreva um pouco mais. Pelo menos " + (q.minWords || 6) + " palavras. Você consegue. Nada some.");
    return;
  }
  if (!keywordHit(text, q.keywords)) {
    showFeedback("try", "Quase. Use pelo menos uma ideia da aula (som, mosaico, silêncio, regra, contraste...). Tente de novo. Safe-fail.");
    grantMedal("safe-fail");
    return;
  }
  succeed(q);
}

function succeed(q) {
  waitingNext = true;
  state.answered[qKey(q)] = true;
  state.mosaicBits += 1;
  addCoins(q.coins, q.xp);
  if (q.id === "l1-ohtake" || q.id === "l2-ohtake-cores") grantMedal("ohtake");
  if (q.checkpoint) {
    grantMedal("checkpoint");
    showFeedback("ok", "Acertou. Checkpoint salvo. " + q.why + " +" + q.coins + " notas.");
  } else {
    showFeedback("ok", "Isso. " + q.why + " +" + q.coins + " notas.");
  }
  $("btn-submit").hidden = true;
  $("btn-next").hidden = false;
  const level = q.level;
  if (isLevelComplete(level)) {
    if (!state.completedLevels.includes(level)) state.completedLevels.push(level);
    grantMedal("lvl-" + level);
    if (level < 6) state.unlockedLevel = Math.max(state.unlockedLevel, level + 1);
    if (level === 6) grantMedal("mestre");
    save();
  }
}

function fail(q) {
  grantMedal("safe-fail");
  showFeedback("try", "Ainda não. Nada se perde. Dica: " + q.hint + " Escolha de novo. A resposta certa não aparece.");
  document.querySelectorAll(".choice").forEach((b) => {
    b.disabled = false;
    b.classList.remove("wrong", "correct", "selected");
  });
  selected = null;
}

function goNextQuestion() {
  const q = currentQuestion();
  const level = q ? q.level : state.unlockedLevel;
  if (isLevelComplete(level)) {
    if (level === 6 && isLevelComplete(6)) {
      renderEnd();
      return;
    }
    showScreen("map");
    renderMap();
    announce("Sala concluída. Selo novo.");
    return;
  }
  const next = questions.findIndex((item, i) => i > state.qIndex && item.level === level && !isAnswered(item));
  state.qIndex = next === -1 ? indexOfFirstUnansweredInLevel(level) : next;
  save();
  openQuestion();
}

function renderShop() {
  const grid = $("shop-grid");
  grid.innerHTML = "";
  SHOP.forEach((item) => {
    const owned = state.owned.includes(item.id);
    const card = document.createElement("article");
    card.className = "card-item" + (owned ? " owned" : "");
    card.innerHTML =
      "<h3>" + item.name + "</h3>" +
      "<p>" + item.desc + "</p>" +
      "<p class='muted'>" + item.cost + " notas</p>";
    const btn = document.createElement("button");
    btn.className = "btn " + (owned ? "btn-ghost" : "btn-secondary");
    btn.type = "button";
    if (owned && item.type === "theme") {
      btn.textContent = state.theme === item.value ? "Em uso" : "Usar tema";
      btn.addEventListener("click", () => {
        state.theme = item.value;
        save();
        renderHud();
        renderShop();
      });
    } else if (owned) {
      btn.textContent = "Já é seu";
      btn.disabled = true;
    } else {
      btn.textContent = "Comprar";
      btn.addEventListener("click", () => buy(item));
    }
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

function buy(item) {
  if (state.coins < item.cost) {
    announce("Notas insuficientes.");
    const fb = $("shop-feedback");
    if (fb) {
      fb.textContent = "Faltam notas. Complete peças no mapa.";
      fb.hidden = false;
    }
    return;
  }
  const fb = $("shop-feedback");
  if (fb) fb.hidden = true;
  state.coins -= item.cost;
  state.owned.push(item.id);
  if (item.type === "theme") state.theme = item.value;
  if (item.type === "hint") state.hints += item.value;
  if (item.type === "token") state.tokens += 1;
  if (item.type === "title") state.title = item.value;
  grantMedal("loja");
  save();
  renderHud();
  renderShop();
  announce("Comprado: " + item.name);
}

function renderMedals() {
  const grid = $("medal-grid");
  grid.innerHTML = "";
  MEDALS.forEach((m) => {
    const got = state.medals.includes(m.id);
    const card = document.createElement("article");
    card.className = "card-item" + (got ? " owned" : "");
    card.innerHTML =
      "<h3>" + (got ? m.name : "Selo oculto") + "</h3>" +
      "<p>" + (got ? m.desc : "Ainda não. Continue a trilha.") + "</p>";
    grid.appendChild(card);
  });
}

function renderLore() {
  const box = $("lore-list");
  box.innerHTML = "";
  const unlocked = 1 + state.completedLevels.length;
  LORE.forEach((l, i) => {
    const art = document.createElement("article");
    art.style.marginBottom = "14px";
    if (i < unlocked) {
      art.innerHTML = "<h3>" + l.title + "</h3><p>" + l.text + "</p>";
    } else {
      art.innerHTML = "<h3>Página lacrada</h3><p class='muted'>Abre ao avançar de nível.</p>";
    }
    box.appendChild(art);
  });
}

function renderEnd() {
  $("end-text").textContent =
    state.name +
    ", você passou pelos 6 selos. Lembrar, entender, aplicar, analisar, avaliar e criar. O mosaico tem " +
    state.mosaicBits +
    " pedras. O Atelier lembra o seu hiperfoco: " +
    ((INTERESTS.find((i) => i.id === state.interest) || {}).label || state.interest) +
    ".";
  showScreen("end");
}

function renderSummary() {
  const list = $("summary-list");
  list.innerHTML = "";
  const interestLabel = (INTERESTS.find((i) => i.id === state.interest) || {}).label || state.interest;
  const medalNames = state.medals
    .map((id) => (MEDALS.find((m) => m.id === id) || {}).name)
    .filter(Boolean);
  const rows = [
    ["Nome", state.name + (state.title ? " · " + state.title : "")],
    ["Hiperfoco", interestLabel],
    ["Níveis concluídos", state.completedLevels.length + " de 6"],
    ["Notas sonoras", String(state.coins)],
    ["XP", String(state.xp)],
    ["Pedras no mosaico", state.mosaicBits + " de 36"],
    ["Dicas restantes", String(state.hints)],
    ["Cristais de checkpoint", String(state.tokens)],
    ["Medalhas", state.medals.length + " de " + MEDALS.length],
    ["Selos conquistados", medalNames.length ? medalNames.join(", ") : "Nenhum ainda"]
  ];
  rows.forEach(([term, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.appendChild(dt);
    list.appendChild(dd);
  });
  showScreen("summary");
}

function useHint() {
  const q = currentQuestion();
  if (!q) return;
  if (state.hints <= 0) {
    showFeedback("info", "Sem dicas agora. Ganhe na loja ou avance salas.");
    return;
  }
  state.hints -= 1;
  save();
  $("q-hint").hidden = false;
  $("q-hint").textContent = "Dica: " + q.hint + " (restam " + state.hints + ")";
  announce("Dica aberta. A resposta ainda é sua.");
}

function startGame(name, interest) {
  state.name = name;
  state.interest = interest;
  state.started = true;
  questions = buildQuestions(interest);
  grantMedal("inicio");
  save();
  renderHud();
  renderMap();
  showScreen("map");
}

function boot() {
  fillInterestSelect();
  $("form-welcome").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("player-name").value.trim();
    const interest = $("player-interest").value;
    if (!name || !interest) return;
    startGame(name, interest);
  });
  $("btn-submit").addEventListener("click", submitAnswer);
  $("btn-next").addEventListener("click", goNextQuestion);
  $("btn-hint").addEventListener("click", useHint);
  $("btn-pause").addEventListener("click", () => {
    $("pause").classList.add("show");
    grantMedal("foco");
  });
  $("btn-resume").addEventListener("click", () => $("pause").classList.remove("show"));
  $("btn-map").addEventListener("click", () => {
    renderMap();
    showScreen("map");
  });
  $("btn-shop").addEventListener("click", () => {
    renderShop();
    showScreen("shop");
  });
  $("btn-medals").addEventListener("click", () => {
    renderMedals();
    showScreen("medals");
  });
  $("btn-lore").addEventListener("click", () => {
    renderLore();
    showScreen("lore");
  });
  $("btn-reset").addEventListener("click", renderSummary);
  $("btn-reset-cancel").addEventListener("click", () => {
    renderEnd();
  });
  $("btn-reset-confirm").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    questions = [];
    showScreen("welcome");
    $("hud").hidden = true;
    $("form-welcome").reset();
  });
  document.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      const go = b.getAttribute("data-go");
      if (go === "map") {
        renderMap();
        showScreen("map");
      }
    });
  });

  if (state.started && state.name && state.interest) {
    questions = buildQuestions(state.interest);
    renderHud();
    renderMap();
    showScreen("map");
  }
}

boot();
