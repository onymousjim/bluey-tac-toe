class LilyTicTacToe {
    constructor() {
        this.availableCharacters = [];
        this.selectedCharacters = {
            player1: null,
            player2: null
        };
        this.board = Array(9).fill('');
        this.currentPlayer = 'player1';
        this.gameActive = false;
        this.scores = this.loadScores();
        this.selectionStep = 'player1'; // 'player1', 'player2', or 'complete'
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        this.initializeApp();
    }
    
    async initializeApp() {
        await this.loadAvailableCharacters();
        this.showCharacterSelection();
        this.bindCharacterSelectionEvents();
    }
    
    showCharacterSelection() {
        document.getElementById('character-selection').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
    }
    
    async loadAvailableCharacters() {
        // Since we can't directly read the filesystem in browser,
        // we'll use a predefined list that matches the Players directory
        // This could be made dynamic with a server endpoint in the future
        const characterFiles = ['bluey.png', 'bingo.png'];
        
        this.availableCharacters = characterFiles.map(filename => {
            const name = filename.replace('.png', '');
            return {
                id: name,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                image: `Players/${filename}`,
                available: true
            };
        });
        
        this.renderCharacterGrid();
    }
    
    renderCharacterGrid() {
        const grid = document.getElementById('character-grid');
        grid.innerHTML = '';
        
        this.availableCharacters.forEach(character => {
            if (character.available || this.selectionStep === 'player1') {
                const characterCard = this.createCharacterCard(character);
                grid.appendChild(characterCard);
            }
        });
    }
    
    createCharacterCard(character) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.characterId = character.id;
        
        if (!character.available && this.selectionStep !== 'player1') {
            card.classList.add('character-unavailable');
        }
        
        card.innerHTML = `
            <div class="character-image">
                <img src="${character.image}" alt="${character.name}" />
            </div>
            <div class="character-name">${character.name}</div>
        `;
        
        if (character.available || this.selectionStep === 'player1') {
            card.addEventListener('click', () => this.selectCharacter(character));
        }
        
        return card;
    }
    
    selectCharacter(character) {
        if (this.selectionStep === 'player1') {
            this.selectedCharacters.player1 = character;
            character.available = false;
            this.showPlayerSelection(1, character);
            this.selectionStep = 'player2';
            document.getElementById('selection-prompt').textContent = 'Player 2, select your character';
            document.getElementById('back-selection').style.display = 'inline-block';
            this.renderCharacterGrid();
        } else if (this.selectionStep === 'player2' && character.available) {
            this.selectedCharacters.player2 = character;
            character.available = false;
            this.showPlayerSelection(2, character);
            this.selectionStep = 'complete';
            document.getElementById('selection-prompt').textContent = 'Ready to play!';
            document.getElementById('start-game').style.display = 'inline-block';
            this.renderCharacterGrid();
        }
    }
    
    showPlayerSelection(playerNumber, character) {
        const playerSelection = document.getElementById(`player${playerNumber}-selection`);
        const playerAvatar = document.getElementById(`player${playerNumber}-avatar`);
        const playerName = document.getElementById(`player${playerNumber}-name`);
        
        playerAvatar.style.backgroundImage = `url('${character.image}')`;
        playerAvatar.style.backgroundSize = 'contain';
        playerAvatar.style.backgroundRepeat = 'no-repeat';
        playerAvatar.style.backgroundPosition = 'center';
        playerName.textContent = character.name;
        playerSelection.style.display = 'flex';
        
        if (playerNumber === 1) {
            document.getElementById('vs-selected').style.display = 'block';
        }
    }
    
    bindCharacterSelectionEvents() {
        document.getElementById('back-selection').addEventListener('click', () => {
            this.goBackInSelection();
        });
        
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('change-characters').addEventListener('click', () => {
            this.returnToCharacterSelection();
        });
    }
    
    goBackInSelection() {
        if (this.selectionStep === 'player2') {
            // Go back to player 1 selection
            const player1Character = this.selectedCharacters.player1;
            if (player1Character) {
                player1Character.available = true;
            }
            this.selectedCharacters.player1 = null;
            this.selectionStep = 'player1';
            document.getElementById('selection-prompt').textContent = 'Player 1, select your character';
            document.getElementById('player1-selection').style.display = 'none';
            document.getElementById('vs-selected').style.display = 'none';
            document.getElementById('back-selection').style.display = 'none';
            this.renderCharacterGrid();
        } else if (this.selectionStep === 'complete') {
            // Go back to player 2 selection
            const player2Character = this.selectedCharacters.player2;
            if (player2Character) {
                player2Character.available = true;
            }
            this.selectedCharacters.player2 = null;
            this.selectionStep = 'player2';
            document.getElementById('selection-prompt').textContent = 'Player 2, select your character';
            document.getElementById('player2-selection').style.display = 'none';
            document.getElementById('start-game').style.display = 'none';
            this.renderCharacterGrid();
        }
    }
    
    startGame() {
        document.getElementById('character-selection').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        
        this.setupGameWithSelectedCharacters();
        this.gameActive = true;
        this.bindGameEvents();
        this.updateGameDisplay();
    }
    
    setupGameWithSelectedCharacters() {
        // Set up player 1
        const player1Avatar = document.getElementById('game-player1-avatar');
        const player1Name = document.getElementById('game-player1-name');
        player1Avatar.style.backgroundImage = `url('${this.selectedCharacters.player1.image}')`;
        player1Avatar.style.backgroundSize = 'contain';
        player1Avatar.style.backgroundRepeat = 'no-repeat';
        player1Avatar.style.backgroundPosition = 'center';
        player1Name.textContent = this.selectedCharacters.player1.name;
        
        // Set up player 2
        const player2Avatar = document.getElementById('game-player2-avatar');
        const player2Name = document.getElementById('game-player2-name');
        player2Avatar.style.backgroundImage = `url('${this.selectedCharacters.player2.image}')`;
        player2Avatar.style.backgroundSize = 'contain';
        player2Avatar.style.backgroundRepeat = 'no-repeat';
        player2Avatar.style.backgroundPosition = 'center';
        player2Name.textContent = this.selectedCharacters.player2.name;
        
        // Update scores display
        this.updateScoreDisplay();
    }
    
    bindGameEvents() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.replaceWith(cell.cloneNode(true)); // Remove old event listeners
        });
        
        const newCells = document.querySelectorAll('.cell');
        newCells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('reset-scores').addEventListener('click', () => this.resetScores());
    }
    
    handleCellClick(event) {
        const cellIndex = parseInt(event.target.getAttribute('data-index'));
        
        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }
        
        this.board[cellIndex] = this.currentPlayer;
        
        // Set cell appearance based on current player's character
        const character = this.selectedCharacters[this.currentPlayer];
        event.target.style.backgroundImage = `url('${character.image}')`;
        event.target.style.backgroundSize = '60%';
        event.target.style.backgroundRepeat = 'no-repeat';
        event.target.style.backgroundPosition = 'center';
        event.target.style.backgroundColor = this.currentPlayer === 'player1' ? '#4A90E2' : '#FF6B35';
        event.target.classList.add('cell-taken');
        
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
            this.updateGameDisplay();
        }
    }
    
    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(condition);
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    highlightWinningCells(winningCondition) {
        const cells = document.querySelectorAll('.cell');
        winningCondition.forEach(index => {
            cells[index].classList.add('winner');
        });
    }
    
    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'win') {
            const winnerCharacter = this.selectedCharacters[this.currentPlayer];
            this.updateScore(this.currentPlayer);
            this.updateGameMessage(`${winnerCharacter.name} wins! 🎉`);
        } else {
            this.updateGameMessage("It's a draw! 🤝");
        }
    }
    
    updateScore(winner) {
        const characterId = this.selectedCharacters[winner].id;
        if (!this.scores[characterId]) {
            this.scores[characterId] = 0;
        }
        this.scores[characterId]++;
        this.saveScores();
        this.updateScoreDisplay();
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1';
    }
    
    updateGameDisplay() {
        const currentCharacter = this.selectedCharacters[this.currentPlayer];
        this.updateGameMessage(`${currentCharacter.name}'s turn!`);
    }
    
    updateGameMessage(message) {
        document.getElementById('game-message').textContent = message;
    }
    
    updateScoreDisplay() {
        const player1Character = this.selectedCharacters.player1;
        const player2Character = this.selectedCharacters.player2;
        
        const player1Score = this.scores[player1Character.id] || 0;
        const player2Score = this.scores[player2Character.id] || 0;
        
        document.getElementById('player1-score').textContent = player1Score;
        document.getElementById('player2-score').textContent = player2Score;
    }
    
    loadScores() {
        const savedScores = localStorage.getItem('characterScores');
        return savedScores ? JSON.parse(savedScores) : {};
    }
    
    saveScores() {
        localStorage.setItem('characterScores', JSON.stringify(this.scores));
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'player1';
        this.gameActive = true;
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.backgroundImage = '';
            cell.style.backgroundColor = '';
            cell.style.backgroundSize = '';
            cell.style.backgroundRepeat = '';
            cell.style.backgroundPosition = '';
            cell.classList.remove('cell-taken', 'winner');
        });
        
        this.updateGameDisplay();
    }
    
    resetScores() {
        this.scores = {};
        this.saveScores();
        this.updateScoreDisplay();
    }
    
    returnToCharacterSelection() {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('character-selection').style.display = 'block';
        
        // Reset character availability
        this.availableCharacters.forEach(character => {
            character.available = true;
        });
        
        // Reset selection state
        this.selectedCharacters = { player1: null, player2: null };
        this.selectionStep = 'player1';
        document.getElementById('selection-prompt').textContent = 'Player 1, select your character';
        document.getElementById('player1-selection').style.display = 'none';
        document.getElementById('player2-selection').style.display = 'none';
        document.getElementById('vs-selected').style.display = 'none';
        document.getElementById('back-selection').style.display = 'none';
        document.getElementById('start-game').style.display = 'none';
        
        this.renderCharacterGrid();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LilyTicTacToe();
});