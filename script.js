class BlueyTicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.firstPlayer = localStorage.getItem('firstPlayer') || 'bluey';
        this.currentPlayer = this.firstPlayer;
        this.gameActive = true;
        this.scores = {
            bluey: parseInt(localStorage.getItem('blueyScore') || '0'),
            bingo: parseInt(localStorage.getItem('bingoScore') || '0')
        };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateScoreDisplay();
        this.updateGameMessage();
    }
    
    bindEvents() {
        const cells = document.querySelectorAll('.cell');
        const resetGameBtn = document.getElementById('reset-game');
        const resetScoresBtn = document.getElementById('reset-scores');
        
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        resetGameBtn.addEventListener('click', () => this.resetGame());
        resetScoresBtn.addEventListener('click', () => this.resetScores());
    }
    
    handleCellClick(event) {
        const cellIndex = parseInt(event.target.getAttribute('data-index'));
        
        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }
        
        this.board[cellIndex] = this.currentPlayer;
        event.target.classList.add(this.currentPlayer);
        
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
            this.updateGameMessage();
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
            this.scores[this.currentPlayer]++;
            this.saveScores();
            this.updateScoreDisplay();
            this.updateGameMessage(`${this.currentPlayer === 'bluey' ? 'Bluey' : 'Bingo'} wins! 🎉`);
        } else {
            this.updateGameMessage("It's a draw! 🤝");
        }
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'bluey' ? 'bingo' : 'bluey';
    }
    
    updateGameMessage(message = null) {
        const gameMessage = document.getElementById('game-message');
        if (message) {
            gameMessage.textContent = message;
        } else {
            const playerName = this.currentPlayer === 'bluey' ? 'Bluey' : 'Bingo';
            gameMessage.textContent = `${playerName}'s turn!`;
        }
    }
    
    updateScoreDisplay() {
        document.getElementById('bluey-score').textContent = this.scores.bluey;
        document.getElementById('bingo-score').textContent = this.scores.bingo;
    }
    
    saveScores() {
        localStorage.setItem('blueyScore', this.scores.bluey.toString());
        localStorage.setItem('bingoScore', this.scores.bingo.toString());
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        
        // Alternate who goes first each game
        this.firstPlayer = this.firstPlayer === 'bluey' ? 'bingo' : 'bluey';
        localStorage.setItem('firstPlayer', this.firstPlayer);
        this.currentPlayer = this.firstPlayer;
        this.gameActive = true;
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('bluey', 'bingo', 'winner');
        });
        
        this.updateGameMessage();
    }
    
    resetScores() {
        this.scores = { bluey: 0, bingo: 0 };
        this.firstPlayer = 'bluey';
        localStorage.setItem('firstPlayer', this.firstPlayer);
        this.saveScores();
        this.updateScoreDisplay();
        this.resetGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlueyTicTacToe();
});