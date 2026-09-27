const { expect } = require("@playwright/test");

function padAnswer(q) {
  const key = (q.keywords && q.keywords[0]) || "som";
  const min = q.minWords || 8;
  let text = key + " mais palavras claras sobre o tema desta aula na escola hoje agora mesmo aqui com cuidado";
  while (text.trim().split(/\s+/).length < min) {
    text += " detalhe";
  }
  return text;
}

async function loadQuestions(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem("mosaico-sonoro-v1");
    const interest = raw ? JSON.parse(raw).interest : "trains";
    return buildQuestions(interest).map((q) => ({
      id: q.id,
      type: q.type,
      answer: q.answer || null,
      keywords: q.keywords || [],
      minWords: q.minWords || 0,
      level: q.level,
      prompt: q.prompt,
      checkpoint: !!q.checkpoint,
      coins: q.coins,
      hint: q.hint
    }));
  });
}

async function startGame(page, name = "Luna", interest = "trains") {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("#w-title")).toHaveText("Olá!");
  await page.locator("#player-name").fill(name);
  await page.locator("#player-interest").selectOption(interest);
  await page.locator("#form-welcome button[type=\"submit\"]").click();
  await expect(page.locator("#screen-map")).toHaveClass(/active/);
  await expect(page.locator("#chip-name")).toHaveText(name);
}

async function seedAndLoad(page, patch) {
  await page.goto("/");
  await page.evaluate((p) => {
    const interest = p.interest || "trains";
    const qs = buildQuestions(interest);
    const answered = {};
    (p.completedLevels || []).forEach((lvl) => {
      qs.filter((q) => q.level === lvl).forEach((q) => {
        answered[q.id] = true;
      });
    });
    Object.assign(answered, p.answered || {});
    const state = {
      name: p.name || "Luna",
      interest,
      title: p.title || "",
      coins: p.coins ?? 80,
      xp: p.xp ?? 40,
      hints: p.hints ?? 1,
      theme: p.theme || "",
      unlockedLevel: p.unlockedLevel ?? 1,
      qIndex: 0,
      completedLevels: p.completedLevels || [],
      medals: p.medals || ["inicio"],
      owned: p.owned || [],
      answered,
      mosaicBits: p.mosaicBits ?? Object.keys(answered).length,
      tokens: p.tokens ?? 0,
      started: true
    };
    localStorage.setItem("mosaico-sonoro-v1", JSON.stringify(state));
  }, patch);
  await page.reload();
  await expect(page.locator("#screen-map")).toHaveClass(/active/);
}

async function openLevel(page, level) {
  const tiles = page.locator("#map .tile");
  await expect(tiles).toHaveCount(6);
  await tiles.nth(level - 1).click();
  await expect(page.locator("#screen-quest")).toHaveClass(/active/);
}

async function waitAfterNext(page, previousPrompt) {
  await page.waitForFunction((oldPrompt) => {
    const quest = document.getElementById("screen-quest");
    const map = document.getElementById("screen-map");
    const end = document.getElementById("screen-end");
    if (map && map.classList.contains("active")) return true;
    if (end && end.classList.contains("active")) return true;
    if (quest && quest.classList.contains("active")) {
      return document.getElementById("q-prompt").textContent !== oldPrompt;
    }
    return false;
  }, previousPrompt);
}

async function answerCurrentCorrectly(page, questions) {
  const prompt = await page.locator("#q-prompt").innerText();
  const q = questions.find((item) => item.prompt === prompt);
  if (!q) throw new Error("Unknown prompt: " + prompt);
  if (q.type === "mc") {
    await page.locator('.choice[data-id="' + q.answer + '"]').click();
  } else {
    await page.locator("#open-answer").fill(padAnswer(q));
  }
  await page.locator("#btn-submit").click();
  await expect(page.locator("#q-feedback")).toBeVisible();
  await expect(page.locator("#btn-next")).toBeVisible();
  await page.locator("#btn-next").click();
  await waitAfterNext(page, prompt);
  return q;
}

async function playUntilLeaveQuest(page) {
  const questions = await loadQuestions(page);
  for (let i = 0; i < 40; i++) {
    const onQuest = await page.locator("#screen-quest.active").count();
    if (!onQuest) break;
    await answerCurrentCorrectly(page, questions);
  }
}

module.exports = {
  padAnswer,
  loadQuestions,
  startGame,
  seedAndLoad,
  openLevel,
  answerCurrentCorrectly,
  playUntilLeaveQuest
};
