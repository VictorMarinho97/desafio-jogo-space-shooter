const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png']; //Criando um array com os caminhos das imagens para os montros aparecem aleatoriamente.
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
var pontos = 0;

//Movimento e tiro da nave
function flyShip(event) { //Função apra ativar os eventos do teclado, de movimento, voo etc
    if(event.key === 'ArrowUp') { //O parâmetro mais o penteiro de teclas.
        event.preventDefault(); //Capturar o comportamento padrão do browser
        moveUp(); //Lembrando das funções de callback.
    } else if(event.key === 'ArrowDown') { //Coloque o nome 'Arrow no maiúsculo'
        event.preventDefault();
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

//Função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //getComputedStyled já foi utilziado em outros projetos, mas aqui foi recebida a variável do quert como parâmetro mais o get property value para pegar um código específico do css.
    if(topPosition === "0px") { //Com isso, a navenão vai sair das dimensões de cima da tela.
        return
    } else {
        let position = parseInt(topPosition);
        position -= 50; //Ao contrário de lá de cima, essa propriedade vai deixar a nave subir livremente, até a condição de lá de cima for alcançada.
        yourShip.style.top = `${position}px`; //Resgatando a posição final e escrevendo em string. Essa é uma forma diferente de escrever a string, com acento grave. 
    }
}

//Função de descer 
function moveDown() {
    //Como são escopos diferentes, podemos usar o mesmo nome de variáveis em funções diferentes.
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //A função é de descer, mas o atributo ainda está ligado ao top.
    if(topPosition >= "510px") { //Mesma coisa lá de cima. Só que com a parte de baixo da tela. Lmebre-se que são múltiplos de 50. portanto alguns valores que você colcoar aqui podem bugar
        return
    } else { 
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

//Função de tiro - Criar elemento tiro - Ativada quando apertar espaço 
function fireLaser() {
    let laser = createLaserElement(); //Função que vai ser criada para criar o laser na tela.
    playArea.appendChild(laser);
    moveLaser(laser); //Aqui, precisamos passar o parâmetro laser.
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left')); //Resgatando os valores originais.
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img'); //Criando uma variável e Resgatando os arquivos de imagem pelo js
    newLaser.src = 'img/shoot.png'; //Fazendo o src do resgate
    newLaser.classList.add('laser'); //Aqui, estamos criando uma classe pelo js. Com isso, já podemos adicionar e mexer nela lá no css. Já vinculamos também ela com o newLaser.
    newLaser.style.left = `${xPosition}px`; //Atualizando as posições do estilo. 
    newLaser.style.top = `${yPosition - 15}px`; // -10 porque ele não deve começar no mesmo início da nave.
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => { //Tempo que vai demorar para surgir um novo elemento laser na movimentação.
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien'); //Todos os aliens do html e iterando com a lista que vai surgir.

        aliens.forEach((alien) => { //Comparando se cada alien foi atingido. Se sim, troca o src da imagem.
            if(checkLaserCollision(laser, alien)) { //Se a colisão for verdadeira, estaremos removendo o sprite do alien e trocando pelo da posição.
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })
        
        if(xPosition === 340) { //Se isso for verdadeiro, o laser vai ser removido. Se ainda não, o laser vai caminhar de acordo coma próxima condição.
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`; //Ele sempre vai atirar 8px a frente
        }
    }, 10); //Executar a função a cada intervalo desse valor.

}

//Função para criar inimigos aleatórios.
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //Sorteio de imagens.
    newAlien.src = alienSprite; //O source dessa vez vai se vincular com o alienSprite que por sua vez contém todas as imagens da pasta.
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition'); //Animação básica do alien.
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//Função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) { //Se a posição de x for menor ou igual do que 50 e se o array incluir a classe dead-alien, o alien atual vai ser removido. Se não, é game over.
                alien.remove();
            } else {
                gameOver();
            } 

            } else {
                alien.style.left = `${xPosition - 4}px`; //Se nada adaquilo de cima estiver correto, o alien vai se mexer.
            }
        
    }, 30);
}

//Função para chegar colisão - 
//Receber laser e alien 
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20; //Comparar o top com o left, para a área que ainda vamos conseguir atirar no inimigo
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 /*comprimento da imagem do laser*/ >= alienLeft) { //Se eles não forem exatamente 340 e se ele mais 40 for igual ao espaço do alien na horizontal e se o top do alien for como o top do laser estiverem alinhados, eles estarão cocupando o mesmo espaço e a colisçao vai acontecer.
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            pontos = pontos + 10;
            return true;
        } else {
            return false;
        }

        } else {
            return false;
        }
    }

//Início do jogo

startButton.addEventListener('click', (event) => { //Função para clicar no star e o joog começar.
    playGame();
})

function playGame() {
    pontos = 0; //Resetando os placar.
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000); //A cada 2 segundos vai aparecer um alien novo na nossa tela.
}


//Função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());

    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    setTimeout(() => { //Indicar que o jogo acabou
        alert('Game over!' + ' Placar: ' + pontos);
        yourShip.style.top = "250px"; //Resetando os valores
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}

