// posições X dos fazendeiros (início)
let posicoes = [5, 5, 5];
// posições Y fixas das pistas dos fazendeiros
let trilhas = [75, 185, 285];
// teclas que cada jogador usa para andar
let teclas = ['w', 'd', 'a'];
// emojis dos fazendeiros
let fazendeiro = ["👨‍🌾", "👨‍🌾", "👨‍🌾"];
// emojis das frutas que cada fazendeiro carrega
let fruta = ["🍍", "🍇", "🍓"];

// posição X da linha de chegada (faixa amarela)
let chegada = 410;
// largura da faixa amarela
let faixa = 13;
// tamanho do emoji fazendeiro
let tamanhoF = 25;
// tamanho do emoji fruta
let tamanhoFruta = 16;

// controla se o jogo está em andamento
let jogando = false;
// indica se alguém venceu (fim do jogo)
let acabou = false;

// lista de prédios na cidade
let predios = [];
// lista de árvores na cidade (atrás da faixa)
let arvoresCidade = [];
// lista de árvores no campo (antes da faixa)
let arvoresCampo = [];

function setup() {
  createCanvas(660, 400);  // cria a tela do jogo

  // configurações para prédios da cidade
  let largPredio = 50;    // largura de cada prédio
  let espaco = 10;        // espaço entre prédios
  let inicio = 20;        // margem esquerda dentro da cidade
  // calcula quantos prédios cabem no espaço da cidade
  let num = int((width - (chegada + faixa) - inicio) / (largPredio + espaco));

  // cria os prédios com posições, altura e cor
  for (let i = 0; i < num; i++) {
    let x = chegada + faixa + inicio + i * (largPredio + espaco);
    let h = 150 + (i % 3) * 40;  // alturas variadas
    let y = height * 0.8 - h;    // posição Y para que fique alinhado
    let cores = ["#8C9EFF", "#5C6BC0", "#3949AB", "#283593", "#1A237E"];
    predios.push({ x: x, y: y, w: largPredio, h: h, cor: cores[i % 5] });
  }

  // cria as árvores da cidade atrás da faixa amarela
  for (let i = 0; i < 6; i++) {
    let x = chegada + faixa + 30 + i * 50;
    arvoresCidade.push({ x: x, y: height * 0.85 });
  }

  // cria uma grade de árvores no campo (antes da faixa)
  let col = 7, lin = 4;                     // 7 colunas e 4 linhas
  let espacX = (chegada - 60) / (col - 1); // espaço horizontal entre árvores
  let espacY = (height - 80) / (lin - 1);  // espaço vertical entre árvores

  for (let j = 0; j < lin; j++) {
    for (let i = 0; i < col; i++) {
      // desloca um pouco as árvores para ficar mais natural
      let dx = (j % 2 === 0 ? 8 : -8);
      let x = 30 + i * espacX + dx;
      let y = 40 + j * espacY;
      arvoresCampo.push({ x: x, y: y });
    }
  }
}

function draw() {
  // cor de fundo muda se o jogo começou (cinza azulado) ou não (amarelo)
  background(jogando ? "#607D8B" : "#FFC107");

  // desenha o gramado do campo (antes da faixa)
  fill("#4CAF50");
  rect(0, 0, chegada, height);

  // desenha todas as árvores do campo
  for (let a of arvoresCampo) desenhaArvore(a.x, a.y, 8, 30, 35);

  // desenha a cidade com prédios, rodovia e árvores
  desenhaCidade();

  // desenha a faixa amarela (linha de chegada)
  fill("#FFC107");
  rect(chegada, 0, faixa, height);
  // risquinhos pretos na faixa para dar efeito
  fill(0);
  for (let y = 0; y < height; y += 20) rect(chegada, y, faixa, 10);

  // desenha os fazendeiros e suas frutas
  for (let i = 0; i < 3; i++) {
    textSize(tamanhoF);
    text(fazendeiro[i], posicoes[i], trilhas[i]);
    textSize(tamanhoFruta);
    // fruta aparece um pouco à direita e acima do fazendeiro
    text(fruta[i], posicoes[i] + 20, trilhas[i] - 4);
  }

  // verifica se alguém ganhou, se o jogo está rolando e ninguém venceu ainda
  if (jogando && !acabou) checarVitoria();
}

// quando solta tecla, os fazendeiros andam
function keyReleased() {
  if (jogando && !acabou) {
    let i = teclas.indexOf(key);
    if (i !== -1) posicoes[i] += random(15, 35);
  }
}

// clique do mouse começa ou reinicia o jogo
function mousePressed() {
  if (acabou) {
    // reinicia tudo para o começo
    posicoes = [5, 5, 5];
    acabou = false;
    jogando = false;
    loop();  // volta a desenhar na tela
  } else if (!jogando) {
    jogando = true;  // começa o jogo no primeiro clique
  }
}

// desenha a cidade com prédios, rodovia e árvores
function desenhaCidade() {
  let xCidade = chegada + faixa;
  let larguraCidade = width - xCidade;

  // grama na parte inferior da cidade
  fill("#3E5F78");
  rect(xCidade, height * 0.8, larguraCidade, height * 0.2);

  // rodovia escura na frente da grama
  fill("#424242");
  rect(xCidade, height - 40, larguraCidade, 40);

  // faixas brancas na rodovia (meio da pista)
  fill("#FFF");
  for (let x = xCidade + 10; x < width - 30; x += 70) {
    rect(x, height - 20, 30, 6);
  }

  // desenha os prédios com janelas amarelas
  for (let p of predios) {
    fill(p.cor);
    rect(p.x, p.y, p.w, p.h);

    fill("#FFEB3B");  // cor das janelas
    // janelas em colunas espaçadas pela altura do prédio
    for (let j = 10; j < p.h - 10; j += 30) {
      rect(p.x + p.w / 4, p.y + j, 10, 15);
      rect(p.x + p.w / 4 + 15, p.y + j, 10, 15);
    }
  }

  // desenha as árvores da cidade atrás dos prédios
  for (let a of arvoresCidade) desenhaArvore(a.x, a.y, 10, 40, 40);
}

// desenha uma árvore com tronco e copa (usada para campo e cidade)
function desenhaArvore(x, y, troncoL, troncoA, copa) {
  fill("#5D4037");  // cor do tronco (marrom)
  rect(x, y - troncoA, troncoL, troncoA);
  fill("#2E7D32");  // cor da copa (verde)
  ellipse(x + troncoL / 2, y - troncoA - copa / 4, copa, copa);
}

// verifica se algum fazendeiro cruzou a linha de chegada
function checarVitoria() {
  for (let i = 0; i < 3; i++) {
    // considerando tamanho do fazendeiro + fruta (aproximado)
    if (posicoes[i] + 35 > chegada + faixa) {
      acabou = true;
      fill(0);
      textSize(30);
      text(fazendeiro[i] + " entregou na cidade " + fruta[i], 20, 75);
      noLoop();  // para o jogo (parar o draw)
    }
  }
}
