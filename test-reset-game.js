const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing reset game functionality...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Select characters quickly
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Start game
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        console.log('🎮 Playing first game...');
        
        // Play some moves
        await page.click('.cell[data-index="0"]'); // Player 1 (Bluey)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]'); // Player 2 (Bingo)
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]'); // Player 1 (Bluey)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Take screenshot before reset
        await page.screenshot({
            path: 'Screenshots/before-reset.png',
            fullPage: true
        });
        console.log('📸 Before reset captured');
        
        // Reset the game
        await page.click('#reset-game');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take screenshot after reset
        await page.screenshot({
            path: 'Screenshots/after-reset.png',
            fullPage: true
        });
        console.log('📸 After reset captured');
        
        console.log('🎮 Playing second game after reset...');
        
        // Play moves again to test if cells display properly
        await page.click('.cell[data-index="4"]'); // Player 1 (Bluey) - center
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="0"]'); // Player 2 (Bingo) - top-left
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="8"]'); // Player 1 (Bluey) - bottom-right
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]'); // Player 2 (Bingo) - top-center
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]'); // Player 1 (Bluey) - top-right
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="6"]'); // Player 2 (Bingo) - bottom-left
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="7"]'); // Player 1 (Bluey) - bottom-center
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="3"]'); // Player 2 (Bingo) - middle-left
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="5"]'); // Player 1 (Bluey) - middle-right - WINS!
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of completed game after reset
        await page.screenshot({
            path: 'Screenshots/game-after-reset-complete.png',
            fullPage: true
        });
        console.log('📸 Game after reset complete captured');
        
        // Verify winner message
        const winnerMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🏆 Winner message: ${winnerMessage}`);
        
        // Test another reset
        await page.click('#reset-game');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take screenshot of second reset
        await page.screenshot({
            path: 'Screenshots/second-reset.png',
            fullPage: true
        });
        console.log('📸 Second reset captured');
        
        console.log('✅ Reset game test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'reset-test-error.png'});
    } finally {
        await browser.close();
    }
})();