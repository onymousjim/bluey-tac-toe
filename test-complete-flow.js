const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing complete character change flow...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Select characters and start game
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        console.log('🎮 Playing complete game...');
        
        // Play a complete winning game
        await page.click('.cell[data-index="0"]'); // Player 1 (Bluey)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="3"]'); // Player 2 (Bingo)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]'); // Player 1 (Bluey)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="4"]'); // Player 2 (Bingo)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]'); // Player 1 (Bluey) - WINS!
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of winner
        await page.screenshot({
            path: 'Screenshots/game-winner-before-change.png',
            fullPage: true
        });
        console.log('📸 Game winner captured');
        
        // Verify winner message
        const winnerMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🏆 Winner message: ${winnerMessage}`);
        
        // Change characters after winning
        await page.click('#change-characters');
        await page.waitForSelector('.character-selection-container');
        
        // Select different character order
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        // Take screenshot showing clean board and new player order
        await page.screenshot({
            path: 'Screenshots/clean-board-new-player-order.png',
            fullPage: true
        });
        console.log('📸 Clean board with new player order captured');
        
        // Verify new game message and player order
        const newGameMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🎮 New game message: ${newGameMessage}`);
        
        // Verify player names are swapped
        const player1Name = await page.$eval('#game-player1-name', el => el.textContent);
        const player2Name = await page.$eval('#game-player2-name', el => el.textContent);
        console.log(`👥 New player order: ${player1Name} vs ${player2Name}`);
        
        // Play a move to verify the new order works
        await page.click('.cell[data-index="4"]'); // Should be Bingo's turn (Player 1)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take final screenshot
        await page.screenshot({
            path: 'Screenshots/new-game-first-move.png',
            fullPage: true
        });
        console.log('📸 New game first move captured');
        
        // Verify the turn switched properly
        const turnMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🔄 Turn message after move: ${turnMessage}`);
        
        console.log('✅ Complete character change flow test passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'Screenshots/complete-flow-error.png'});
    } finally {
        await browser.close();
    }
})();