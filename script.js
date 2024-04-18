document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    
    // Función para barajar las tarjetas
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Función para crear tarjetas y agregarlas al DOM
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
    }

     /* Función para manejar el volteo de las tarjetas v1
     function flipCard() {
        if (lockBoard || this.classList.contains('flip')) return;
        if (this === firstCard) return;

        this.classList.toggle('flip');

        if (!hasFlippedCard) {
            // Primer clic
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Segundo clic
        secondCard = this;
        checkForMatch();
    }*/
    function flipCard() {
        if (lockBoard || this.classList.contains('flip')) return;
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
    
        if (firstCard.dataset.value === this.dataset.value) {
            firstCard.classList.add('match');
            this.classList.add('match');
            resetBoard();
        } else {
            firstCard.classList.add('wrong');
            this.classList.add('wrong');
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
    function disableCards() {
        firstCard.classList.add('match');
        secondCard.classList.add('match');

        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
    }

    // Función para voltear las tarjetas si no coinciden
    function unflipCards() {
        lockBoard = true;
        firstCard.classList.add('wrong');
        secondCard.classList.add('wrong');

        setTimeout(() => {
            firstCard.classList.remove('flip', 'wrong');
            secondCard.classList.remove('flip', 'wrong');
            resetBoard();
        }, 1500);
    }

    // Función para resetear el tablero
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    createCards();
});
