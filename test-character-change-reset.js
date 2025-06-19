const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing character change reset functionality...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Select characters and start first game
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        console.log('🎮 Playing first game with some moves...');
        
        // Play some moves to make the board dirty
        await page.click('.cell[data-index="0"]'); // Player 1 (Bluey)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]'); // Player 2 (Bingo)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]'); // Player 1 (Bluey)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="3"]'); // Player 2 (Bingo)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Take screenshot of game with moves
        await page.screenshot({
            path: 'Screenshots/game-with-moves.png',
            fullPage: true
        });
        console.log('📸 Game with moves captured');
        
        // Change characters
        await page.click('#change-characters');
        await page.waitForSelector('.character-selection-container');
        
        // Take screenshot of character selection
        await page.screenshot({
            path: 'Screenshots/back-to-character-selection.png',
            fullPage: true
        });
        console.log('📸 Back to character selection captured');
        
        // Select same characters again (should still reset the board)
        await page.click('.character-card[data-character-id="bingo"]'); // Switch order
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        // Take screenshot of clean board after character change
        await page.screenshot({
            path: 'Screenshots/clean-board-after-character-change.png',
            fullPage: true
        });
        console.log('📸 Clean board after character change captured');
        
        // Verify game message shows it's a new game
        const gameMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🎮 Game message after character change: ${gameMessage}`);
        
        // Verify board is actually clean by checking cells
        const cells = await page.$$eval('.cell', cells => 
            cells.map(cell => ({
                hasBackground: cell.style.backgroundImage !== '',
                hasClass: cell.classList.contains('cell-taken')
            }))
        );
        
        const dirtyCell = cells.find(cell => cell.hasBackground || cell.hasClass);
        if (dirtyCell) {
            console.log('❌ Board is not clean - found dirty cell');
        } else {
            console.log('✅ Board is clean - all cells properly reset');
        }
        
        // Play a few moves in the new game to verify it works
        console.log('🎮 Testing new game functionality...');
        await page.click('.cell[data-index="4"]'); // Player 1 (Bingo) - center
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="0"]'); // Player 2 (Bluey) - top-left
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Take screenshot of new game in progress
        await page.screenshot({
            path: 'Screenshots/new-game-in-progress.png',
            fullPage: true
        });
        console.log('📸 New game in progress captured');
        
        // Test another character change mid-game
        await page.click('#change-characters');
        await page.waitForSelector('.character-selection-container');
        
        // Select characters again
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        // Take final screenshot showing clean board again
        await page.screenshot({
            path: 'Screenshots/final-clean-board.png',
            fullPage: true
        });
        console.log('📸 Final clean board captured');
        
        // Verify it's truly a new game
        const finalMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🎮 Final game message: ${finalMessage}`);
        
        console.log('✅ Character change reset test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'Screenshots/character-change-error.png'});
    } finally {
        await browser.close();
    }
})();