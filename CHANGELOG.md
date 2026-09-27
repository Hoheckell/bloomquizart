# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/). Este projeto usa versionamento semântico.

## [1.1.0] - 2026-09-27

### Adicionado

- Tela de resumo da trajetória antes do reset: nome, título, hiperfoco, níveis, notas, XP, mosaico, dicas, cristais e medalhas. O save só é apagado após confirmação; dá para cancelar sem perder nada.
- Publicação no GitHub Pages: <https://hoheckell.github.io/bloomquizart/>

### Corrigido

- Loja não usa mais `alert()` nativo. Saldo insuficiente vira feedback inline na tela, perto da ação.

## [1.0.0] - 2026-09-27

### Adicionado

- Portal gamificado Mosaico Sonoro com 6 níveis da taxonomia de Bloom.
- Mapa com desbloqueio sequencial, checkpoints e mosaico de 36 células.
- Safe-fail: erro não revela a resposta e não apaga progresso.
- Loja com temas, títulos, dicas e cristais. Medalhas e códice de lore.
- Modo foco (pausa) e persistência em `localStorage`.
- Hiperfoco do jogador nas perguntas dos níveis 4, 5 e 6.
- Acessibilidade: skip link, `aria-live`, foco visível, `prefers-reduced-motion`, alvos de 44px.
- Suíte E2E Playwright com 29 testes cobrindo todos os fluxos.
- Husky + commitlint com Conventional Commits.
