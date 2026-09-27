# Mosaico Sonoro

Portal gamificado de artes para o 7o ano. O aluno percorre 6 salas da taxonomia de Bloom (Lembrar ate Criar) misturando som, notacao musical e mosaico. Errar e seguro. Uma pergunta por vez.

Feito para um aluno com TDAH, TEA nivel 1 e altas habilidades. Frases curtas. Sem ironia. O hiperfoco entra nas perguntas dos niveis 4, 5 e 6.

## Como jogar

1. Abra o portal no navegador (veja Como rodar).
2. Informe o nome e o hiperfoco.
3. Entre no mapa. So a sala atual abre.
4. Responda. Em escolha multipla, a certa nao aparece no erro.
5. Use dica, pausa, loja, medalhas e o codice quando quiser.
6. Zere as 6 salas para juntar o mosaico.

O progresso fica em `localStorage` na chave `mosaico-sonoro-v1`.

## Pedagogia

| Nivel | Verbo Bloom | Sala | Foco |
| ----- | ----------- | ---- | ---- |
| 1 | Reconhecer | Atelier das Notas | Fatos: som, figura, pentagrama, Ur, Ohtake, Gaudi |
| 2 | Explicar | Sala do Eco | Timbre, melodia, harmonia, Cage, abstracionismo |
| 3 | Usar | Oficina de Ritmos | Garrafas, duracao, cola, rejunte, sons do hiperfoco |
| 4 | Separar | Torre dos Padroes | Ritmo, melodia e harmonia; Ur; Cage; Ohtake e O Gorman |
| 5 | Julgar | Tribunal do Som | Percussao, Zeugma, arte publica, vanguarda |
| 6 | Inventar | Forja do Mosaico Sonoro | Mini-peca, dois paineis, oficina, performance |

Conteudo escolar: caracteristicas do som, 4'33" de John Cage, Estandarte de Ur, Zeugma, Tomie Ohtake, Juan O Gorman, Antoni Gaudi e a oficina (cola, seca, rejunte, verniz).

## Acessibilidade

- Um passo por tela. Sem timer.
- Alvos de toque de no minimo 44px.
- Foco visivel laranja.
- `prefers-reduced-motion` desliga animacao.
- Link pular para o conteudo e regiao `aria-live`.
- Modo foco (pausa). Nada se perde.
- Safe-fail: erro nao apaga progresso e nao entrega a resposta.

## Arquitetura

```
index.html          telas, HUD, dialogos
css/styles.css      tokens, temas, a11y
js/content.js       Bloom, perguntas, loja, medalhas, lore
js/game.js          estado, render, save, fluxos
tests/              Playwright (fluxos do jogador)
```

Estado: nome, hiperfoco, notas, XP, dicas, tema, salas abertas, respostas por `q.id`, mosaico (36 celulas), medalhas e itens da loja.

Temas da loja: `estrelas`, `trilhos`, `selva`.

## Como rodar

Sem build. E um site estatico.

```
python3 -m http.server 8000
```

Abra `http://127.0.0.1:8000`.

## Testes

```
npm install
npx playwright install chromium
npm test
```

A suíte cobre welcome, mapa, escolha multipla, resposta aberta, dica, safe-fail, checkpoint, HUD, loja e temas, medalhas, lore, pausa, persistencia, reset, hiperfoco e zerar o jogo.

## Git

Conventional Commits, nomes de branch e template de PR. Leia CONTRIBUTING.md.

```
git checkout -b feature/minha-mudanca
git commit -m "feat(sala): descricao curta"
git push -u origin feature/minha-mudanca
```
