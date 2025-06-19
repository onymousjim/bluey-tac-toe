const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing complete game flow on target viewports...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Test PC Monitor complete flow
        console.log('💻 Testing PC Monitor complete game flow...');
        await page.setViewport({width: 1920, height: 1080});
        
        // Character selection
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        // Play complete winning game
        await page.click('.cell[data-index="0"]'); // Bluey
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="3"]'); // Bingo
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="1"]'); // Bluey
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="4"]'); // Bingo
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="2"]'); // Bluey wins!
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.screenshot({
            path: 'Screenshots/pc-complete-game-winner.png',
            fullPage: false
        });
        console.log('📸 PC complete game winner captured');
        
        // Test character change and new game
        await page.click('#change-characters');
        await page.waitForSelector('.character-selection-container');
        
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        await page.screenshot({
            path: 'Screenshots/pc-character-change-new-game.png',
            fullPage: false
        });
        console.log('📸 PC character change new game captured');
        
        // Test Pixel 9 Pro complete flow
        console.log('📱 Testing Pixel 9 Pro complete game flow...');
        await page.setViewport({width: 424, height: 896});
        
        // Play some moves
        await page.click('.cell[data-index="4"]'); // Bingo (center)
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="0"]'); // Bluey
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="3"]'); // Bingo
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="1"]'); // Bluey
        await new Promise(resolve => setTimeout(resolve, 200));
        await page.click('.cell[data-index="5"]'); // Bingo wins!
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.screenshot({
            path: 'Screenshots/pixel9pro-complete-game-winner.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro complete game winner captured');
        
        // Test reset game functionality
        await page.click('#reset-game');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await page.screenshot({
            path: 'Screenshots/pixel9pro-reset-game.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro reset game captured');
        
        // Test new game functionality
        await page.click('.cell[data-index="8"]'); // Bingo (bottom-right)
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await page.screenshot({
            path: 'Screenshots/pixel9pro-new-game-move.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro new game move captured');
        
        // Final viewport validation
        const finalTests = [
            {name: 'PC Monitor', width: 1920, height: 1080},
            {name: 'Pixel 9 Pro', width: 424, height: 896}
        ];
        
        for (const test of finalTests) {
            await page.setViewport({width: test.width, height: test.height});
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
            const viewportHeight = await page.evaluate(() => window.innerHeight);
            const needsScrolling = scrollHeight > viewportHeight;
            
            console.log(`✅ ${test.name}: Fits without scrolling = ${!needsScrolling}`);
        }
        
        console.log('✅ Complete game viewport test passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'Screenshots/complete-game-viewport-error.png'});
    } finally {
        await browser.close();
    }
})();