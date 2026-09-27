const { test, expect } = require("@playwright/test");
const {
  startGame,
  seedAndLoad,
  openLevel,
  loadQuestions,
  answerCurrentCorrectly,
  playUntilLeaveQuest,
  padAnswer
} = require("./helpers");

test.describe("Welcome", () => {
  test("mostra Olá, 6 níveis e pede nome + hiperfoco", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#w-title")).toHaveText("Olá!");
    await expect(page.locator("#screen-welcome")).toHaveClass(/active/);
    await expect(page.locator("#hud")).toBeHidden();
    await expect(page.locator(".rules li")).toHaveCount(10);
    await expect(page.locator("body")).toContainText("Lembrar");
    await expect(page.locator("body")).toContainText("Criar");
    await expect(page.locator("#player-name")).toBeVisible();
    await expect(page.locator("#player-interest option")).toHaveCount(9);
  });

  test("não entra sem nome e hiperfoco", async ({ page }) => {
    await page.goto("/");
    await page.locator("#form-welcome button[type=\"submit\"]").click();
    await expect(page.locator("#screen-welcome")).toHaveClass(/active/);
  });

  test("entra no mapa após nome e hiperfoco", async ({ page }) => {
    await startGame(page, "Luna", "trains");
    await expect(page.locator("#hud")).toBeVisible();
    await expect(page.locator("#chip-name")).toHaveText("Luna");
    await expect(page.locator("#coins")).toHaveText("0");
    await expect(page.locator("#xp")).toHaveText("0");
    await expect(page.locator("#map .tile")).toHaveCount(6);
    await expect(page.locator("#global-progress-label")).toHaveText("0/6");
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")));
    expect(save.started).toBe(true);
    expect(save.medals).toContain("inicio");
  });
});

test.describe("Mapa e salas", () => {
  test("só a sala 1 abre no início", async ({ page }) => {
    await startGame(page);
    const tiles = page.locator("#map .tile");
    await expect(tiles.nth(0)).toBeEnabled();
    await expect(tiles.nth(0)).toHaveClass(/current/);
    for (let i = 1; i < 6; i++) {
      await expect(tiles.nth(i)).toBeDisabled();
      await expect(tiles.nth(i)).toContainText("Trancado");
    }
  });

  test("abre pergunta da sala 1", async ({ page }) => {
    await startGame(page);
    await openLevel(page, 1);
    await expect(page.locator("#q-prompt")).toContainText("música");
    await expect(page.locator("#q-kicker")).toContainText("Nível 1");
    await expect(page.locator(".choice")).toHaveCount(4);
    await expect(page.locator("#btn-submit")).toBeVisible();
    await expect(page.locator("#btn-next")).toBeHidden();
  });

  test("sala 2 abre só depois de zerar a 1", async ({ page }) => {
    await seedAndLoad(page, { completedLevels: [1], unlockedLevel: 2, coins: 74, xp: 106 });
    const tiles = page.locator("#map .tile");
    await expect(tiles.nth(0)).toContainText("Selo conquistado");
    await expect(tiles.nth(1)).toBeEnabled();
    await expect(tiles.nth(2)).toBeDisabled();
    await expect(page.locator("#global-progress-label")).toHaveText("1/6");
  });
});

test.describe("Múltipla escolha", () => {
  test("pede escolha se tentar sem opção", async ({ page }) => {
    await startGame(page);
    await openLevel(page, 1);
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toBeVisible();
    await expect(page.locator("#q-feedback")).toContainText("Escolha uma opção primeiro");
    await expect(page.locator("#btn-submit")).toBeVisible();
  });

  test("erro é safe-fail e não revela a certa", async ({ page }) => {
    await startGame(page);
    await openLevel(page, 1);
    await page.locator('.choice[data-id="a"]').click();
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toContainText("Ainda não");
    await expect(page.locator("#q-feedback")).toContainText("A resposta certa não aparece");
    await expect(page.locator(".choice.correct")).toHaveCount(0);
    await expect(page.locator("#btn-next")).toBeHidden();
    await expect(page.locator(".choice").first()).toBeEnabled();
    const medals = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")).medals);
    expect(medals).toContain("safe-fail");
  });

  test("acerto mostra feedback, notas e Próxima", async ({ page }) => {
    await startGame(page);
    await openLevel(page, 1);
    await page.locator('.choice[data-id="b"]').click();
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toContainText("Isso.");
    await expect(page.locator("#coins")).toHaveText("8");
    await expect(page.locator("#xp")).toHaveText("12");
    await expect(page.locator("#btn-next")).toBeVisible();
    await expect(page.locator("#btn-submit")).toBeHidden();
    await expect(page.locator('.choice[data-id="b"]')).toHaveClass(/correct/);
  });
});

test.describe("Dica", () => {
  test("abre dica sem spoiler e gasta 1", async ({ page }) => {
    await startGame(page);
    await openLevel(page, 1);
    await page.locator("#btn-hint").click();
    await expect(page.locator("#q-hint")).toBeVisible();
    await expect(page.locator("#q-hint")).toContainText("Dica:");
    await expect(page.locator("#q-hint")).toContainText("restam 0");
    await expect(page.locator("#q-hint")).not.toContainText("Sons");
  });

  test("sem dicas avisa na tela", async ({ page }) => {
    await seedAndLoad(page, { hints: 0 });
    await openLevel(page, 1);
    await page.locator("#btn-hint").click();
    await expect(page.locator("#q-feedback")).toContainText("Sem dicas agora");
  });
});

test.describe("Checkpoint e HUD", () => {
  test("checkpoint marca medalha Viajante", async ({ page }) => {
    await seedAndLoad(page, {
      answered: {
        "l1-musica": true,
        "l1-altura": true,
        "l1-semibreve": true,
        "l1-pentagrama": true,
        "l1-mosaico": true
      },
      mosaicBits: 5,
      coins: 44,
      xp: 64
    });
    await openLevel(page, 1);
    await expect(page.locator("#q-prompt")).toContainText("primeiros mosaicos");
    await expect(page.locator("#q-meta")).toContainText("Checkpoint");
    await page.locator('.choice[data-id="a"]').click();
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toContainText("Checkpoint salvo");
    const medals = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")).medals);
    expect(medals).toContain("checkpoint");
  });

  test("HUD mostra nome, notas e XP", async ({ page }) => {
    await seedAndLoad(page, { coins: 33, xp: 21, name: "Kai" });
    await expect(page.locator("#chip-name")).toHaveText("Kai");
    await expect(page.locator("#coins")).toHaveText("33");
    await expect(page.locator("#xp")).toHaveText("21");
    await expect(page.locator("#mosaic .mosaic-cell")).toHaveCount(36);
  });
});

test.describe("Resposta aberta", () => {
  test("pede mais palavras se texto curto", async ({ page }) => {
    await seedAndLoad(page, {
      completedLevels: [1, 2],
      unlockedLevel: 3,
      answered: {
        "l3-garrafa": true,
        "l3-colcheia": true,
        "l3-caracteristicas": true,
        "l3-cimento": true,
        "l3-oficina": true
      }
    });
    await openLevel(page, 3);
    await expect(page.locator("#open-answer")).toBeVisible();
    await page.locator("#open-answer").fill("som grave");
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toContainText("Escreva um pouco mais");
    await expect(page.locator("#btn-next")).toBeHidden();
  });

  test("pede ideia da aula se faltar palavra-chave", async ({ page }) => {
    await seedAndLoad(page, {
      completedLevels: [1, 2],
      unlockedLevel: 3,
      answered: {
        "l3-garrafa": true,
        "l3-colcheia": true,
        "l3-caracteristicas": true,
        "l3-cimento": true,
        "l3-oficina": true
      }
    });
    await openLevel(page, 3);
    await page.locator("#open-answer").fill("eu gosto muito de brincar no parque com amigos agora");
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toContainText("Quase");
    await expect(page.locator("#q-feedback")).toContainText("Safe-fail");
  });

  test("aceita texto com palavra-chave e minWords", async ({ page }) => {
    await seedAndLoad(page, {
      completedLevels: [1, 2],
      unlockedLevel: 3,
      answered: {
        "l3-garrafa": true,
        "l3-colcheia": true,
        "l3-caracteristicas": true,
        "l3-cimento": true,
        "l3-oficina": true
      }
    });
    await openLevel(page, 3);
    const questions = await loadQuestions(page);
    const q = questions.find((item) => item.id === "l3-open-sons");
    await page.locator("#open-answer").fill(padAnswer(q));
    await page.locator("#btn-submit").click();
    await expect(page.locator("#q-feedback")).toContainText("Checkpoint salvo");
    await expect(page.locator("#btn-next")).toBeVisible();
  });
});

test.describe("Loja e temas", () => {
  test("compra tema e aplica data-theme", async ({ page }) => {
    await seedAndLoad(page, { coins: 80 });
    await page.locator("#btn-shop").click();
    await expect(page.locator("#screen-shop")).toHaveClass(/active/);
    await expect(page.locator("#shop-grid .card-item")).toHaveCount(8);
    await page.locator("#shop-grid .card-item").first().locator("button").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "estrelas");
    await expect(page.locator("#coins")).toHaveText("60");
    await expect(page.locator("#chip-name")).toHaveText("Luna");
    const medals = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")).medals);
    expect(medals).toContain("loja");
  });

  test("avisa na tela se faltar notas", async ({ page }) => {
    await seedAndLoad(page, { coins: 5 });
    await page.locator("#btn-shop").click();
    await page.locator("#shop-grid .card-item").first().locator("button").click();
    await expect(page.locator("#shop-feedback")).toBeVisible();
    await expect(page.locator("#shop-feedback")).toContainText("Faltam notas");
    await expect(page.locator("#coins")).toHaveText("5");
  });

  test("título aparece no HUD após compra", async ({ page }) => {
    await seedAndLoad(page, { coins: 80 });
    await page.locator("#btn-shop").click();
    await page.locator("#shop-grid .card-item").nth(5).locator("button").click();
    await expect(page.locator("#chip-name")).toHaveText("Luna · Maestro Aprendiz");
  });

  test("voltar ao mapa pela loja", async ({ page }) => {
    await seedAndLoad(page, { coins: 20 });
    await page.locator("#btn-shop").click();
    await page.locator("#screen-shop [data-go=\"map\"]").click();
    await expect(page.locator("#screen-map")).toHaveClass(/active/);
  });
});

test.describe("Medalhas, lore e pausa", () => {
  test("mostra selos conquistados e ocultos", async ({ page }) => {
    await seedAndLoad(page, { medals: ["inicio", "lvl-1"] });
    await page.locator("#btn-medals").click();
    await expect(page.locator("#screen-medals")).toHaveClass(/active/);
    await expect(page.locator("#medal-grid")).toContainText("Primeiro passo");
    await expect(page.locator("#medal-grid")).toContainText("Guardião da Memória");
    await expect(page.locator("#medal-grid")).toContainText("Selo oculto");
  });

  test("lore libera páginas conforme níveis", async ({ page }) => {
    await seedAndLoad(page, { completedLevels: [1], unlockedLevel: 2 });
    await page.locator("#btn-lore").click();
    await expect(page.locator("#screen-lore")).toHaveClass(/active/);
    await expect(page.locator("#lore-list")).toContainText("O Atelier rachado");
    await expect(page.locator("#lore-list")).toContainText("Safe-fail");
    await expect(page.locator("#lore-list")).toContainText("Página lacrada");
  });

  test("pausa abre modo foco e dá medalha", async ({ page }) => {
    await startGame(page);
    await page.locator("#btn-pause").click();
    await expect(page.locator("#pause")).toHaveClass(/show/);
    await expect(page.locator("#pause-title")).toHaveText("Modo foco");
    await page.locator("#btn-resume").click();
    await expect(page.locator("#pause")).not.toHaveClass(/show/);
    const medals = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")).medals);
    expect(medals).toContain("foco");
  });
});

test.describe("Persistência e reset", () => {
  test("recarregar mantém progresso", async ({ page }) => {
    await seedAndLoad(page, { completedLevels: [1], unlockedLevel: 2, coins: 74, name: "Nico" });
    await page.reload();
    await expect(page.locator("#screen-map")).toHaveClass(/active/);
    await expect(page.locator("#chip-name")).toHaveText("Nico");
    await expect(page.locator("#coins")).toHaveText("74");
    await expect(page.locator("#map .tile").nth(1)).toBeEnabled();
  });

  test("reset mostra trajetória antes e só limpa após confirmar", async ({ page }) => {
    await seedAndLoad(page, {
      name: "Luna",
      completedLevels: [1, 2, 3, 4, 5, 6],
      unlockedLevel: 6,
      coins: 74,
      xp: 106,
      mosaicBits: 36,
      medals: ["inicio", "mestre"]
    });
    await page.evaluate(() => {
      document.getElementById("screen-end").classList.add("active");
      document.getElementById("screen-map").classList.remove("active");
    });
    await page.locator("#btn-reset").click();
    await expect(page.locator("#screen-summary")).toHaveClass(/active/);
    await expect(page.locator("#summary-list")).toContainText("Luna");
    await expect(page.locator("#summary-list")).toContainText("6 de 6");
    await expect(page.locator("#summary-list")).toContainText("74");
    await expect(page.locator("#summary-list")).toContainText("106");
    await expect(page.locator("#summary-list")).toContainText("36 de 36");
    await expect(page.locator("#summary-list")).toContainText("Mosaico completo");
    const stillThere = await page.evaluate(() => localStorage.getItem("mosaico-sonoro-v1"));
    expect(stillThere).not.toBeNull();
    await page.locator("#btn-reset-confirm").click();
    await expect(page.locator("#screen-welcome")).toHaveClass(/active/);
    await expect(page.locator("#hud")).toBeHidden();
    const raw = await page.evaluate(() => localStorage.getItem("mosaico-sonoro-v1"));
    expect(raw).toBeNull();
  });

  test("cancelar o reset volta ao final sem apagar nada", async ({ page }) => {
    await seedAndLoad(page, {
      completedLevels: [1, 2, 3, 4, 5, 6],
      unlockedLevel: 6,
      medals: ["inicio", "mestre"]
    });
    await page.evaluate(() => {
      document.getElementById("screen-end").classList.add("active");
      document.getElementById("screen-map").classList.remove("active");
    });
    await page.locator("#btn-reset").click();
    await expect(page.locator("#screen-summary")).toHaveClass(/active/);
    await page.locator("#btn-reset-cancel").click();
    await expect(page.locator("#screen-end")).toHaveClass(/active/);
    const raw = await page.evaluate(() => localStorage.getItem("mosaico-sonoro-v1"));
    expect(raw).not.toBeNull();
  });
});

test.describe("Hiperfoco e medalha Ohtake", () => {
  test("pergunta de nível 3 usa o hiperfoco", async ({ page }) => {
    await seedAndLoad(page, {
      interest: "trains",
      completedLevels: [1, 2],
      unlockedLevel: 3,
      answered: {
        "l3-garrafa": true,
        "l3-colcheia": true
      }
    });
    await openLevel(page, 3);
    await expect(page.locator("#q-prompt")).toContainText("estação de trens");
  });

  test("Ohtake concede medalha quatro estações", async ({ page }) => {
    await seedAndLoad(page, {
      answered: {
        "l1-musica": true,
        "l1-altura": true,
        "l1-semibreve": true,
        "l1-pentagrama": true,
        "l1-mosaico": true,
        "l1-ur": true
      },
      mosaicBits: 6
    });
    await openLevel(page, 1);
    await page.locator('.choice[data-id="a"]').click();
    await page.locator("#btn-submit").click();
    const medals = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")).medals);
    expect(medals).toContain("ohtake");
  });
});

test.describe("Zerar o jogo", () => {
  test("completa os 6 níveis e chega na tela final", async ({ page }) => {
    await startGame(page, "Luna", "trains");
    for (let level = 1; level <= 6; level++) {
      await openLevel(page, level);
      await playUntilLeaveQuest(page);
      if (level < 6) {
        await expect(page.locator("#screen-map")).toHaveClass(/active/);
        await expect(page.locator("#global-progress-label")).toHaveText(level + "/6");
      }
    }
    await expect(page.locator("#screen-end")).toHaveClass(/active/);
    await expect(page.locator("#end-text")).toContainText("Luna");
    await expect(page.locator("#end-text")).toContainText("Trens");
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem("mosaico-sonoro-v1")));
    expect(save.medals).toContain("mestre");
    expect(save.completedLevels).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
