const BLOOM = [
  { id: 1, name: "Lembrar", verb: "Reconhecer", place: "Atelier das Notas", color: "#4338ca" },
  { id: 2, name: "Entender", verb: "Explicar", place: "Sala do Eco", color: "#1d4ed8" },
  { id: 3, name: "Aplicar", verb: "Usar", place: "Oficina de Ritmos", color: "#0d9488" },
  { id: 4, name: "Analisar", verb: "Separar", place: "Torre dos Padrões", color: "#7c3aed" },
  { id: 5, name: "Avaliar", verb: "Julgar", place: "Tribunal do Som", color: "#c2410c" },
  { id: 6, name: "Criar", verb: "Inventar", place: "Forja do Mosaico Sonoro", color: "#be185d" }
];

const INTERESTS = [
  { id: "games", label: "Videogames", hook: "jogo" },
  { id: "space", label: "Espaço", hook: "espaço" },
  { id: "dinos", label: "Dinossauros", hook: "dinossauro" },
  { id: "trains", label: "Trens", hook: "trem" },
  { id: "music", label: "Música", hook: "música" },
  { id: "animals", label: "Animais", hook: "animal" },
  { id: "robots", label: "Robôs", hook: "robô" },
  { id: "draw", label: "Desenho", hook: "desenho" }
];

function fillHook(text, interest) {
  const map = {
    games: {
      mundo: "um jogo de mundo aberto",
      coisa: "a trilha sonora de um chefão",
      peca: "um pixel",
      padrao: "um mapa de fases",
      heroi: "o herói do jogo",
      fase: "uma fase secreta",
      combo: "um combo",
      npc: "um NPC"
    },
    space: {
      mundo: "uma estação espacial",
      coisa: "o silêncio do espaço",
      peca: "uma estrela",
      padrao: "uma constelação",
      heroi: "uma astronauta",
      fase: "um planeta novo",
      combo: "um alinhamento de planetas",
      npc: "um satélite"
    },
    dinos: {
      mundo: "um vale jurássico",
      coisa: "o rugido de um Tiranossauro",
      peca: "um dente fóssil",
      padrao: "uma trilha de pegadas",
      heroi: "uma paleontóloga",
      fase: "uma nova camada de solo",
      combo: "um bando em movimento",
      npc: "um pterossauro"
    },
    trains: {
      mundo: "uma estação de trens",
      coisa: "o apito da locomotiva",
      peca: "um trilho",
      padrao: "uma linha férrea",
      heroi: "uma maquinista",
      fase: "um novo destino",
      combo: "vagões encaixados",
      npc: "um condutor"
    },
    music: {
      mundo: "um palco",
      coisa: "um solo de guitarra",
      peca: "uma nota",
      padrao: "uma partitura",
      heroi: "uma compositora",
      fase: "um refrão novo",
      combo: "um acorde",
      npc: "um baterista"
    },
    animals: {
      mundo: "uma floresta",
      coisa: "o canto de um pássaro",
      peca: "uma pena",
      padrao: "um ninho",
      heroi: "uma bióloga",
      fase: "um bioma novo",
      combo: "um bando",
      npc: "um lobo"
    },
    robots: {
      mundo: "um laboratório",
      coisa: "o bipe de um robô",
      peca: "um parafuso",
      padrao: "um circuito",
      heroi: "uma engenheira",
      fase: "um protótipo",
      combo: "um encaixe de peças",
      npc: "um dróide"
    },
    draw: {
      mundo: "um ateliê",
      coisa: "o som do lápis no papel",
      peca: "um ladrilho de cor",
      padrao: "um mosaico",
      heroi: "uma artista",
      fase: "um mural novo",
      combo: "um degradê",
      npc: "um pincel"
    }
  };
  const t = map[interest] || map.music;
  return text
    .replaceAll("{mundo}", t.mundo)
    .replaceAll("{coisa}", t.coisa)
    .replaceAll("{peca}", t.peca)
    .replaceAll("{padrao}", t.padrao)
    .replaceAll("{heroi}", t.heroi)
    .replaceAll("{fase}", t.fase)
    .replaceAll("{combo}", t.combo)
    .replaceAll("{npc}", t.npc);
}

function buildQuestions(interest) {
  const q = [];

  q.push({
    id: "l1-musica",
    level: 1,
    type: "mc",
    medal: "memoria-sonora",
    coins: 8,
    xp: 12,
    prompt: "A música é definida como a arte feita de quê?",
    options: [
      { id: "a", text: "Cores e desenhos" },
      { id: "b", text: "Sons" },
      { id: "c", text: "Números" },
      { id: "d", text: "Cheiros" }
    ],
    answer: "b",
    hint: "Pense no que seus ouvidos captam.",
    why: "Música é a arte feita de sons. Combinações diferentes despertam experiências diferentes."
  });

  q.push({
    id: "l1-altura",
    level: 1,
    type: "mc",
    medal: null,
    coins: 8,
    xp: 12,
    prompt: "Altura do som é o quê?",
    options: [
      { id: "a", text: "Se o som é fraco ou forte" },
      { id: "b", text: "Se o som é grave ou agudo" },
      { id: "c", text: "Quanto tempo o som dura" },
      { id: "d", text: "De qual instrumento vem o som" }
    ],
    answer: "b",
    hint: "Grave é baixo. Agudo é fino. Isso NÃO é volume.",
    why: "Altura = grave ou agudo. Volume é intensidade. São coisas diferentes."
  });

  q.push({
    id: "l1-semibreve",
    level: 1,
    type: "mc",
    coins: 8,
    xp: 12,
    prompt: "Qual figura de ritmo tem a MAIOR duração?",
    options: [
      { id: "a", text: "Colcheia" },
      { id: "b", text: "Semínima" },
      { id: "c", text: "Semibreve" },
      { id: "d", text: "Mínima" }
    ],
    answer: "c",
    hint: "É a figura “mãe”. As outras duram a metade dela, e assim por diante.",
    why: "Semibreve é a maior. Mínima = metade. Semínima = metade da mínima. Colcheia = metade da semínima."
  });

  q.push({
    id: "l1-pentagrama",
    level: 1,
    type: "mc",
    coins: 10,
    xp: 14,
    prompt: "Quantas linhas tem um pentagrama?",
    options: [
      { id: "a", text: "3" },
      { id: "b", text: "4" },
      { id: "c", text: "5" },
      { id: "d", text: "7" }
    ],
    answer: "c",
    hint: "O nome começa com “penta”.",
    why: "Penta = cinco. O pentagrama tem 5 linhas paralelas."
  });

  q.push({
    id: "l1-mosaico",
    level: 1,
    type: "mc",
    coins: 10,
    xp: 14,
    prompt: "O mosaico é uma arte de quê?",
    options: [
      { id: "a", text: "Pintar só com um pincel grande" },
      { id: "b", text: "Encaixar peças e formar padrões" },
      { id: "c", text: "Escrever poemas" },
      { id: "d", text: "Filmar dança" }
    ],
    answer: "b",
    hint: "Pense em pastilhas, pedrinhas, ladrilhos.",
    why: "Mosaico = encaixe de fragmentos (pedra, vidro, seixos) formando um padrão."
  });

  q.push({
    id: "l1-ur",
    level: 1,
    type: "mc",
    coins: 10,
    xp: 14,
    checkpoint: true,
    prompt: "Onde apareceu um dos primeiros mosaicos conhecidos (cerca de 2600 a.C.)?",
    options: [
      { id: "a", text: "Cidade de Ur, na Mesopotâmia" },
      { id: "b", text: "Rio de Janeiro" },
      { id: "c", text: "Tóquio" },
      { id: "d", text: "Nova York" }
    ],
    answer: "a",
    hint: "Hoje essa região fica no sul do Iraque.",
    why: "O Estandarte de Ur, na Mesopotâmia, é um dos primeiros registros de mosaico."
  });

  q.push({
    id: "l1-ohtake",
    level: 1,
    type: "mc",
    coins: 10,
    xp: 14,
    prompt: "Tomie Ohtake fez “Quatro estações” (1991) em qual lugar de São Paulo?",
    options: [
      { id: "a", text: "Estação de metrô Consolação" },
      { id: "b", text: "Estádio do Maracanã" },
      { id: "c", text: "Parque Güell" },
      { id: "d", text: "Biblioteca da Unam no México" }
    ],
    answer: "a",
    hint: "É uma estação de metrô na Avenida Paulista.",
    why: "A obra permanente fica na estação Consolação, em São Paulo."
  });

  q.push({
    id: "l1-gaudi",
    level: 1,
    type: "mc",
    coins: 10,
    xp: 14,
    prompt: "Antoni Gaudí construiu o Parque Güell em qual cidade?",
    options: [
      { id: "a", text: "Lisboa" },
      { id: "b", text: "Barcelona" },
      { id: "c", text: "Recife" },
      { id: "d", text: "Roma" }
    ],
    answer: "b",
    hint: "Cidade da Espanha. Modernismo catalão.",
    why: "Parque Güell fica em Barcelona (1900–1914)."
  });

  q.push({
    id: "l2-timbre",
    level: 2,
    type: "mc",
    coins: 12,
    xp: 16,
    prompt: "Por que o timbre deixa você reconhecer um piano e um bandolim tocando a mesma música?",
    options: [
      { id: "a", text: "Porque um toca mais forte" },
      { id: "b", text: "Porque cada fonte sonora tem uma “voz” própria" },
      { id: "c", text: "Porque um toca mais tempo" },
      { id: "d", text: "Porque um é mais agudo sempre" }
    ],
    answer: "b",
    hint: "Não é volume, nem duração, nem grave/agudo.",
    why: "Timbre é a identidade da fonte. Mesma nota, instrumentos diferentes = sons diferentes."
  });

  q.push({
    id: "l2-melodia",
    level: 2,
    type: "mc",
    coins: 12,
    xp: 16,
    prompt: "Melodia é mais parecida com o quê?",
    options: [
      { id: "a", text: "Uma frase que você consegue cantarolar" },
      { id: "b", text: "Várias notas ao mesmo tempo, paradas" },
      { id: "c", text: "Só o silêncio" },
      { id: "d", text: "O volume do aparelho" }
    ],
    answer: "a",
    hint: "Dá para reconhecer uma música sem a letra.",
    why: "Melodia é uma sucessão de sons (alturas + durações) que forma um sentido. Como uma frase."
  });

  q.push({
    id: "l2-harmonia",
    level: 2,
    type: "mc",
    coins: 12,
    xp: 16,
    prompt: "Quando duas ou mais notas soam ao mesmo tempo, isso se chama:",
    options: [
      { id: "a", text: "Só ritmo" },
      { id: "b", text: "Harmonia (pode formar um acorde)" },
      { id: "c", text: "Pausa" },
      { id: "d", text: "Pentagrama vazio" }
    ],
    answer: "b",
    hint: "Juntas no mesmo instante, não uma depois da outra.",
    why: "Harmonia = sons simultâneos. Podem ser consonantes (repouso) ou dissonantes (tensão)."
  });

  q.push({
    id: "l2-cage",
    level: 2,
    type: "mc",
    coins: 12,
    xp: 16,
    prompt: "Na obra 4'33\" de John Cage, o pianista não toca. Onde está a música, para ele?",
    options: [
      { id: "a", text: "Só na partitura impressa" },
      { id: "b", text: "Nos ruídos do ambiente e da plateia" },
      { id: "c", text: "Numa fita escondida" },
      { id: "d", text: "Não existe música nenhuma, ponto final, sem ideia" }
    ],
    answer: "b",
    hint: "Cage quis aproximar música e silêncio.",
    why: "Cage diz que a música está nos sons do lugar e da plateia. Ele questiona as regras."
  });

  q.push({
    id: "l2-ur-faces",
    level: 2,
    type: "mc",
    coins: 14,
    xp: 18,
    prompt: "Uma face do Estandarte de Ur mostra guerra. A outra mostra o quê?",
    options: [
      { id: "a", text: "Um mapa do céu" },
      { id: "b", text: "Um banquete de celebração da vitória" },
      { id: "c", text: "Um estádio de futebol" },
      { id: "d", text: "Um porto moderno" }
    ],
    answer: "b",
    hint: "Depois da batalha, as pessoas comemoram.",
    why: "Guerra de um lado. Banquete da vitória do outro. O mosaico conta uma história em duas cenas."
  });

  q.push({
    id: "l2-abstrato",
    level: 2,
    type: "mc",
    coins: 12,
    xp: 16,
    prompt: "O Abstracionismo é a arte que:",
    options: [
      { id: "a", text: "Copia pessoas e paisagens iguais ao mundo real" },
      { id: "b", text: "Não representa a realidade tal qual a vemos" },
      { id: "c", text: "Só usa preto e branco" },
      { id: "d", text: "Só existe em livros de música" }
    ],
    answer: "b",
    hint: "Não precisa parecer uma foto.",
    why: "Arte abstrata não reproduz imagens fidedignas de pessoas, paisagens ou objetos."
  });

  q.push({
    id: "l2-ohtake-cores",
    level: 2,
    type: "mc",
    coins: 12,
    xp: 16,
    prompt: "Em “Quatro estações”, de Tomie Ohtake, as cores verde, amarelo, marrom e azul significam:",
    options: [
      { id: "a", text: "Os quatro times de São Paulo" },
      { id: "b", text: "Primavera, verão, outono e inverno" },
      { id: "c", text: "As quatro faces do Estandarte de Ur" },
      { id: "d", text: "Grave, agudo, forte e fraco" }
    ],
    answer: "b",
    hint: "O mesmo desenho. Quatro painéis. Quatro estações.",
    why: "Verde = primavera. Amarelo = verão. Marrom = outono. Azul = inverno."
  });

  q.push({
    id: "l2-ogorman",
    level: 2,
    type: "mc",
    coins: 14,
    xp: 18,
    checkpoint: true,
    prompt: "A Biblioteca Central da Unam (México), de Juan O’Gorman, mostra o quê nos mosaicos?",
    options: [
      { id: "a", text: "Só o mapa do metrô de São Paulo" },
      { id: "b", text: "Fases da história do México, em milhões de pedras" },
      { id: "c", text: "Apenas flores sem significado" },
      { id: "d", text: "A partitura de 4'33\"" }
    ],
    answer: "b",
    hint: "Quatro mil metros quadrados. Passado e presente do país.",
    why: "O’Gorman retratou fases da história do México. Em 2007 a biblioteca virou Patrimônio da Humanidade."
  });

  q.push({
    id: "l3-garrafa",
    level: 3,
    type: "mc",
    coins: 14,
    xp: 18,
    prompt: "Você enche uma garrafa com muita água. O som, ao soprar, fica mais:",
    options: [
      { id: "a", text: "Agudo" },
      { id: "b", text: "Grave" },
      { id: "c", text: "Sempre igual" },
      { id: "d", text: "Mudo" }
    ],
    answer: "b",
    hint: "Garrafa mais cheia = menos ar vibrando.",
    why: "No piano de garrafas: mais água = som mais grave. Mais vazia = mais agudo."
  });

  q.push({
    id: "l3-colcheia",
    level: 3,
    type: "mc",
    coins: 14,
    xp: 18,
    prompt: "A duração da mínima é metade da semibreve. Se a semibreve vale 4 tempos, a colcheia vale:",
    options: [
      { id: "a", text: "4 tempos" },
      { id: "b", text: "2 tempos" },
      { id: "c", text: "1 tempo" },
      { id: "d", text: "1/2 tempo" }
    ],
    answer: "d",
    hint: "Semibreve 4 → mínima 2 → semínima 1 → colcheia ?",
    why: "Cada figura seguinte dura a metade. 4 → 2 → 1 → 0,5."
  });

  q.push({
    id: "l3-caracteristicas",
    level: 3,
    type: "mc",
    coins: 14,
    xp: 18,
    prompt: fillHook("Em {mundo}, você ouve {coisa}. Isso é um som longo e forte. Qual par de características combina?", interest),
    options: [
      { id: "a", text: "Duração longa + intensidade forte" },
      { id: "b", text: "Só timbre, nada mais" },
      { id: "c", text: "Altura = volume" },
      { id: "d", text: "Densidade = silêncio total" }
    ],
    answer: "a",
    hint: "Duração = tempo. Intensidade = fraco/forte.",
    why: "Você aplicou duas características ao mesmo som: quanto dura e quão forte é."
  });

  q.push({
    id: "l3-cimento",
    level: 3,
    type: "mc",
    coins: 16,
    xp: 20,
    prompt: "Para colar um mosaico no chão, uma técnica comum usa:",
    options: [
      { id: "a", text: "Apenas fita adesiva" },
      { id: "b", text: "Base de cimento + rejunte no acabamento" },
      { id: "c", text: "Água com sabão" },
      { id: "d", text: "Som de bateria" }
    ],
    answer: "b",
    hint: "Uma cola pesada e um acabamento nas juntas.",
    why: "Cimento segura as peças. Rejunte fecha os vãos."
  });

  q.push({
    id: "l3-oficina",
    level: 3,
    type: "mc",
    coins: 16,
    xp: 20,
    prompt: "Na oficina, depois de colar as peças, o próximo passo correto é:",
    options: [
      { id: "a", text: "Passar verniz na hora, ainda molhado" },
      { id: "b", text: "Deixar secar de um dia para o outro, depois rejunte" },
      { id: "c", text: "Lavar com água em fogo" },
      { id: "d", text: "Tocar piano em cima" }
    ],
    answer: "b",
    hint: "Cola primeiro. Seca. Só então rejunte.",
    why: "Passo 1: cola aos poucos. Passo 2: seca de um dia para o outro. Depois vem o rejunte."
  });

  q.push({
    id: "l3-open-sons",
    level: 3,
    type: "open",
    coins: 18,
    xp: 24,
    checkpoint: true,
    minWords: 8,
    keywords: ["grave", "agudo", "altura", "som", "nota", "instrumento", "timbre", "ritmo"],
    prompt: fillHook("Imagine {fase} no seu interesse. Escreva 2 sons desse lugar. Diga se cada um é grave ou agudo. Frase curta.", interest),
    hint: "Exemplo de forma: “O apito é agudo. O motor é grave.”",
    why: "Você aplicou altura (grave/agudo) em sons do mundo real. Isso é usar o conceito, não só repetir o nome."
  });

  q.push({
    id: "l4-ritmo-melodia",
    level: 4,
    type: "mc",
    coins: 18,
    xp: 24,
    prompt: "Separe: ritmo, melodia e harmonia. Qual afirmação está correta?",
    options: [
      { id: "a", text: "Ritmo = duração/pulsação. Melodia = frase em sequência. Harmonia = sons juntos." },
      { id: "b", text: "Os três significam exatamente volume." },
      { id: "c", text: "Harmonia é só silêncio." },
      { id: "d", text: "Melodia é o nome do pentagrama." }
    ],
    answer: "a",
    hint: "Um organiza o tempo. Uma canta a linha. A outra empilha notas.",
    why: "Analisar é separar partes. Ritmo (tempo), melodia (linha), harmonia (simultâneo)."
  });

  q.push({
    id: "l4-guerra-peixe",
    level: 4,
    type: "mc",
    coins: 18,
    xp: 24,
    prompt: "César Guerra-Peixe saiu do dodecafonismo e foi pesquisar maracatu, catimbó, jongo e samba rural. O que isso mostra?",
    options: [
      { id: "a", text: "Que música brasileira não serve para orquestra" },
      { id: "b", text: "Que um compositor pode misturar pesquisa popular com linguagem de concerto" },
      { id: "c", text: "Que só a Europa cria regras" },
      { id: "d", text: "Que o Recife não tem ritmo" }
    ],
    answer: "b",
    hint: "Ele queria o “sotaque” brasileiro na orquestra.",
    why: "Ele analisou ritmos locais e levou isso para a composição. Cultura popular + forma erudita."
  });

  q.push({
    id: "l4-gaudi-natureza",
    level: 4,
    type: "mc",
    coins: 18,
    xp: 24,
    prompt: "Separe as ideias de Gaudí no Parque Güell. O que ele mistura de propósito?",
    options: [
      { id: "a", text: "Formas da natureza + cores fortes + cerâmica brilhante com pedra rústica" },
      { id: "b", text: "Só linhas retas e uma cor só" },
      { id: "c", text: "Apenas silêncio, sem material" },
      { id: "d", text: "Somente fotos de metrô" }
    ],
    answer: "a",
    hint: "Arquitetura naturalista. Contraste de texturas.",
    why: "Gaudí usa formas orgânicas, cores vibrantes e o choque entre cerâmica e pedra rústica."
  });

  q.push({
    id: "l4-ur-open",
    level: 4,
    type: "open",
    coins: 20,
    xp: 28,
    minWords: 12,
    keywords: ["guerra", "festa", "vitoria", "vitória", "lado", "historia", "história", "contraste", "banquete", "mosaico"],
    prompt: "O Estandarte de Ur tem guerra de um lado e festa do outro. Por que mostrar os DOIS lados na mesma caixa? Escreva com suas palavras.",
    hint: "Pense em contraste: violência e comemoração.",
    why: "A obra analisa a vitória em duas cenas. Não é só enfeite: é narrativa visual."
  });

  q.push({
    id: "l4-cage-open",
    level: 4,
    type: "open",
    coins: 22,
    xp: 30,
    minWords: 14,
    keywords: ["silencio", "silêncio", "ruido", "ruído", "regra", "plateia", "ambiente", "convenc", "som", "musica", "música"],
    prompt: fillHook("John Cage fez 4'33\" (quase só “silêncio”). Compare com {coisa} no seu interesse. O que conta como “música” e o que as pessoas chamam de “barulho”? Por quê?", interest),
    hint: "Cage diz que ruído do ambiente também pode ser ouvido como música.",
    checkpoint: true,
    why: "Analisar é comparar regras. Cage quebra a regra “música = notas afinadas”."
  });

  q.push({
    id: "l4-ohtake-ogorman",
    level: 4,
    type: "open",
    coins: 22,
    xp: 30,
    minWords: 14,
    keywords: ["ohtake", "ogorman", "o'gorman", "historia", "história", "abstrat", "estacao", "estação", "painel", "mexico", "méxico", "cor", "tempo"],
    prompt: fillHook("Separe duas estratégias: Tomie Ohtake (mesmo desenho, 4 cores = 4 estações, no metrô) e Juan O’Gorman (milhões de pedras contando a história do México). Qual conta o TEMPO de um jeito diferente? Ligue com {padrao} do seu interesse.", interest),
    hint: "Uma usa estações do ano. A outra usa fases de um país.",
    why: "Analisar = ver o mesmo ofício (mosaico) com funções diferentes: ciclo abstrato vs narrativa histórica."
  });

  q.push({
    id: "l5-percussao",
    level: 5,
    type: "mc",
    coins: 20,
    xp: 28,
    prompt: "Alguém diz: “Percussão (pandeiro, triângulo) não é música, porque não tem nota afinada.” Você avalia essa frase como:",
    options: [
      { id: "a", text: "Certa sempre, em qualquer século" },
      { id: "b", text: "Fraca: hoje muitos sons sem afinação fazem parte da música" },
      { id: "c", text: "Certa só no samba" },
      { id: "d", text: "Certa porque mosaico não existe" }
    ],
    answer: "b",
    hint: "O texto da escola fala de ruídos que viraram música.",
    why: "Julgar uma ideia. Historicamente chamavam de ruído. Hoje percussão é música de verdade."
  });

  q.push({
    id: "l5-zeugma",
    level: 5,
    type: "open",
    coins: 22,
    xp: 32,
    minWords: 16,
    keywords: ["dono", "conversa", "mito", "casa", "status", "ideia", "tema", "convid", "historia", "história"],
    prompt: "Em Zeugma, o mosaico da casa seguia o interesse do dono (ex.: deuses, Eros e Telete). Isso era só decoração? Avalie: o que o mosaico “fazia” numa visita?",
    hint: "Servia de assunto. Mostrava o que o dono gostava de pensar.",
    why: "Você julgou função social da arte: identidade, conversa, status, imaginação."
  });

  q.push({
    id: "l5-publico",
    level: 5,
    type: "open",
    coins: 24,
    xp: 34,
    minWords: 16,
    keywords: ["publico", "público", "metro", "metrô", "biblioteca", "casa", "todos", "dono", "unesco", "cidade"],
    prompt: fillHook("Julgue: mosaico na CASA (Zeugma), no METRÔ (Ohtake) e na BIBLIOTECA da Unam (O’Gorman, Patrimônio da Humanidade). Qual serve mais pessoas? Qual serve melhor o hiperfoco de {heroi}? Escolha um e diga o motivo.", interest),
    hint: "Pense quem passa ali todo dia. Quem escolhe o tema. Quem pode entrar.",
    why: "Avaliar arte pública vs arte privada: acesso, poder e memória."
  });

  q.push({
    id: "l5-cluster",
    level: 5,
    type: "open",
    coins: 24,
    xp: 34,
    checkpoint: true,
    minWords: 18,
    keywords: ["regra", "liberdade", "erro", "novo", "vanguarda", "cage", "cluster", "tradicao", "tradição", "criar", "gaudi", "gaudí", "material"],
    prompt: fillHook("Um cluster no piano não busca acorde “bonito”. Gaudí usava material até o limite. Em {mundo}, isso é quebrar regra do {padrao}. Vale a pena? Dê 1 sim, 1 não, e escolha um lado com motivo.", interest),
    hint: "Não existe só uma resposta. O importante é o argumento.",
    why: "Avaliar = pesar prós e contras e escolher com motivo, não só gosto."
  });

  q.push({
    id: "l6-mini-peca",
    level: 6,
    type: "open",
    coins: 26,
    xp: 36,
    minWords: 12,
    keywords: ["grave", "agudo", "curto", "longo", "forte", "fraco", "timbre", "ritmo", "pausa"],
    prompt: fillHook("Crie uma mini-peça de 4 eventos sonoros para {fase}. Use só palavras. Ex.: 1) som grave e longo 2) pausa 3) som agudo e curto 4) {combo}.", interest),
    hint: "Não precisa de partitura. Liste 4 acontecimentos em ordem.",
    why: "Criar é combinar características do som numa ordem nova."
  });

  q.push({
    id: "l6-ur-paineis",
    level: 6,
    type: "open",
    coins: 28,
    xp: 40,
    minWords: 16,
    keywords: ["peca", "peça", "padrao", "padrão", "encaixe", "cor", "som", "mosaico", "lado", "historia", "história"],
    prompt: fillHook("Desenhe com palavras um mosaico-história do seu interesse. 2 painéis (como o Estandarte de Ur). Painel A = conflito. Painel B = celebração. Diga 3 {peca}s de cada painel.", interest),
    hint: "Guerra / festa no Ur. Aqui: problema / vitória no SEU tema.",
    why: "Você criou narrativa visual em duas faces, como o Estandarte."
  });

  q.push({
    id: "l6-oficina",
    level: 6,
    type: "open",
    coins: 30,
    xp: 44,
    minWords: 16,
    keywords: ["cola", "rejunte", "verniz", "secar", "titulo", "título", "objeto", "eva", "e.v.a", "pet", "madeira", "mdf", "espátula", "espatula"],
    prompt: fillHook("Oficina: escolha 1 objeto (tampa, MDF, papel). Liste os 7 passos (cola → secar → rejunte → limpar → verniz → título). O tema da obra é {fase}. Dê o título da exposição.", interest),
    hint: "Cola em pequenos espaços. Seca um dia. Rejunte. Limpa. Espera. Verniz. Título.",
    why: "Criar com o passo a passo real da escola. Depois a turma expõe."
  });

  q.push({
    id: "l6-final",
    level: 6,
    type: "open",
    coins: 32,
    xp: 50,
    checkpoint: true,
    minWords: 20,
    keywords: ["titulo", "título", "regra", "som", "mosaico", "silencio", "silêncio", "publico", "público", "cage", "ohtake", "gaudi", "gaudí"],
    prompt: fillHook("Última criação: performance de 1 minuto. Una SOM + MOSAICO + seu interesse. Dê: título, 1 regra, o que o público faz, 1 silêncio. Pode copiar a ideia de Ohtake (4 cores) ou de Gaudí (forma da natureza). Pense em {heroi}.", interest),
    hint: "Pode ser estranho. Cage também foi. Só precisa ser claro.",
    why: "Nível Criar: obra nova com regra, público e silêncio. Você zerou a trilha."
  });

  return q;
}

const SHOP = [
  { id: "theme-estrelas", name: "Tema Céu Noturno", cost: 20, type: "theme", value: "estrelas", desc: "Fundo escuro, calmo, com azul." },
  { id: "theme-trilhos", name: "Tema Trilhos", cost: 20, type: "theme", value: "trilhos", desc: "Laranja quente, como estação." },
  { id: "theme-selva", name: "Tema Selva", cost: 20, type: "theme", value: "selva", desc: "Verde suave para os olhos." },
  { id: "dica-extra", name: "Atalho Dica extra", cost: 15, type: "hint", value: 1, desc: "Ganha +1 dica para gastar quando quiser." },
  { id: "checkpoint-token", name: "Cristal de Checkpoint", cost: 25, type: "token", value: 1, desc: "Salva o progresso com brilho extra (colecionável)." },
  { id: "titulo-maestro", name: "Título: Maestro Aprendiz", cost: 40, type: "title", value: "Maestro Aprendiz", desc: "Aparece no seu cartão de jogador." },
  { id: "titulo-mosaicista", name: "Título: Mosaicista", cost: 40, type: "title", value: "Mosaicista", desc: "Aparece no seu cartão de jogador." },
  { id: "titulo-vanguarda", name: "Título: Ouvido de Vanguarda", cost: 55, type: "title", value: "Ouvido de Vanguarda", desc: "Raro. Para quem chegou longe." }
];

const MEDALS = [
  { id: "inicio", name: "Primeiro passo", desc: "Entrou no Atelier." },
  { id: "lvl-1", name: "Guardião da Memória", desc: "Zerou o nível Lembrar." },
  { id: "lvl-2", name: "Tradutor de Ecos", desc: "Zerou o nível Entender." },
  { id: "lvl-3", name: "Mãos na Oficina", desc: "Zerou o nível Aplicar." },
  { id: "lvl-4", name: "Olho do Padrão", desc: "Zerou o nível Analisar." },
  { id: "lvl-5", name: "Juiz do Som", desc: "Zerou o nível Avaliar." },
  { id: "lvl-6", name: "Forjador", desc: "Zerou o nível Criar." },
  { id: "safe-fail", name: "Erro valente", desc: "Errou, leu o porquê, tentou de novo." },
  { id: "checkpoint", name: "Viajante", desc: "Passou por um checkpoint." },
  { id: "loja", name: "Comprador curioso", desc: "Fez a primeira compra." },
  { id: "foco", name: "Modo foco", desc: "Usou a pausa para respirar." },
  { id: "mestre", name: "Mosaico completo", desc: "Concluiu os 6 níveis." },
  { id: "ohtake", name: "Quatro estações", desc: "Reconheceu a obra de Tomie Ohtake." }
];

const LORE = [
  { id: "l1", title: "O Atelier rachado", text: "Há um Atelier onde sons viram pastilhas. Cada nota é uma pedra. Cada silêncio é um vão. O Mosaico Sonoro quebrou. Seis salas guardam um pedaço." },
  { id: "l2", title: "Regra de ouro: Safe-fail", text: "Errar não apaga você. Errar mostra o caminho. Você sempre pode tentar de novo. Ninguém perde o jogo por um erro." },
  { id: "l3", title: "Os 6 selos", text: "Lembrar. Entender. Aplicar. Analisar. Avaliar. Criar. Sem pular sala. Um selo por vez. Assim o cérebro não mistura as peças." },
  { id: "l4", title: "John Cage na porta", text: "Um homem sentou 4 minutos e 33 segundos sem tocar. A plateia fez a música. O Atelier aprendeu: silêncio também é material." },
  { id: "l5", title: "Ur, Zeugma e a oficina", text: "Há 4600 anos, em Ur, uma caixa contou guerra e festa em pedras. Em Zeugma, casas falavam com mosaicos. Hoje a oficina usa cola, rejunte e verniz. Arte ainda é conversa." },
  { id: "l6", title: "Três muralistas do século XX", text: "Tomie Ohtake pintou estações do ano no metrô Consolação. Juan O’Gorman cobriu a biblioteca da Unam com a história do México. Gaudí dobrou a natureza em cerâmica no Parque Güell. Três jeitos de encaixar o mundo." }
];
