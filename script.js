document.addEventListener('DOMContentLoaded', () => {
    startGame();
    document.getElementById('resetButton').addEventListener('click', resetGame);
});
    
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let currentLevel = 1;

async function setupLevel(level) {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = ''; // Limpiar el contenedor de juego anterior
    let cards = await getLevelCards(level);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.textContent = card; // Recuerda modificar es de prueba
        gameContainer.appendChild(cardElement);
        cardElement.addEventListener('click', flipCard);
    });
}

function startGame() {
    setupLevel(currentLevel);
}
    
function generateCards() {
    let cards = [];
    for (let i = 65; i <= 90; i++) { // Código ASCII de 'A' a 'Z'
        let letter = String.fromCharCode(i);
        cards.push(letter, letter); // Agregar dos veces cada letra para formar pares
    }
    return cards;
}

function getLevelCards(level) {
    let numPairs = Math.pow(2, level); // Duplica la cantidad de pares en cada nivel
    let allCards = generateCards();
    let selectedPairs = selectRandomPairs(allCards, numPairs);
    return shuffle(selectedPairs); // Baraja y devuelve el subconjunto necesario
}

function selectRandomPairs(allCards, numPairs) {
    let pairs = [];
    let indices = new Set(); // Usar un Set para evitar índices duplicados

    while (pairs.length < numPairs * 2) {
        let index = Math.floor(Math.random() * (allCards.length / 2));
        if (!indices.has(index)) {
            indices.add(index);
            pairs.push(allCards[index * 2], allCards[index * 2 + 1]);
        }
    }
    return pairs;
}
    
// Función para barajar las tarjetas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

    /* Función para crear tarjetas y agregarlas al DOM
    function createCards() {
        shuffle(cards);
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');

            // Crea un elemento hijo para el texto de la tarjeta
            const cardText = document.createElement('div');
            cardText.classList.add('card-text');
            cardText.textContent = card;  // Asigna el valor de la carta
            //cardText.style.display = 'none';  // Oculta el texto inicialmente

            cardElement.appendChild(cardText);  // Agrega el texto a la tarjeta
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', flipCard);
            gameContainer.appendChild(cardElement);

        });
    }*/

// Función para manejar el volteo de las tarjetas
function flipCard() {
    if (lockBoard || this.classList.contains('flip') || this.classList.contains('match')) return;
        
    this.classList.add('flip');
        
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    if (firstCard.dataset.value === this.dataset.value) {
        firstCard.classList.add('match');
        this.classList.add('match');
        disableCards(firstCard, this);
    } else {
        firstCard.classList.add('wrong');
        this.classList.add('wrong');
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip', 'wrong');
            this.classList.remove('flip', 'wrong');
            resetBoard();
        }, 1500);
    }
}

// Función para comprobar si las tarjetas coinciden
    function checkForMatch() {
        let isMatch = firstCard.dataset.value === secondCard.dataset.value;

        isMatch ? disableCards() : unflipCards();
    }

// Función para desactivar las tarjetas si coinciden
function disableCards(card1, card2) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);

    resetBoard();
    checkCompletion();
}

// Función para voltear las tarjetas si no coinciden
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip', 'wrong');
        secondCard.classList.remove('flip', 'wrong');
        resetBoard();
    }, 1500);
}

function checkCompletion() {
    let allFlipped = document.querySelectorAll('.card.match').length;
    let totalCards = document.querySelectorAll('.card').length;
    if (allFlipped === totalCards) {
        alert('Excelente, ahora un poco más dificil.');
        currentLevel++;
        setupLevel(currentLevel);
    }
}

// Función para resetear el tablero
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Función para resetear el juego al nivel inicial
function resetGame() {
    currentLevel = 1; 
    setupLevel(currentLevel); 
    console.log("El juego ha sido reiniciado al nivel 1.");
}


