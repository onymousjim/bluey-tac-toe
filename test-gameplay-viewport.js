const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing viewport with actual gameplay...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Select characters quickly
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        // Test PC Monitor with gameplay
        console.log('💻 Testing PC Monitor with gameplay (1920x1080)...');
        await page.setViewport({width: 1920, height: 1080});
        
        // Play some moves
        await page.click('.cell[data-index="0"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await page.screenshot({
            path: 'Screenshots/pc-monitor-gameplay.png',
            fullPage: false
        });
        console.log('📸 PC Monitor with gameplay captured');
        
        // Check viewport coverage for PC
        const gameContainer = await page.$eval('.game-container', el => el.getBoundingClientRect());
        const pcViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`💻 PC: Game container bottom=${Math.round(gameContainer.bottom)}, viewport height=${pcViewportHeight}, fits: ${gameContainer.bottom <= pcViewportHeight}`);
        
        // Test Pixel 9 Pro with gameplay
        console.log('📱 Testing Pixel 9 Pro with gameplay (424x896)...');
        await page.setViewport({width: 424, height: 896});
        
        await page.screenshot({
            path: 'Screenshots/pixel9pro-gameplay.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro with gameplay captured');
        
        // Check viewport coverage for Pixel 9 Pro
        const gameContainerPixel = await page.$eval('.game-container', el => el.getBoundingClientRect());
        const pixelViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`📱 Pixel 9 Pro: Game container bottom=${Math.round(gameContainerPixel.bottom)}, viewport height=${pixelViewportHeight}, fits: ${gameContainerPixel.bottom <= pixelViewportHeight}`);
        
        // Play a complete game to test with winner screen
        await page.click('.cell[data-index="3"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="4"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="5"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="6"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="7"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="8"]');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test winner screen on Pixel 9 Pro
        await page.screenshot({
            path: 'Screenshots/pixel9pro-winner.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro winner screen captured');
        
        // Check winner screen viewport
        const winnerGameContainer = await page.$eval('.game-container', el => el.getBoundingClientRect());
        console.log(`📱 Pixel 9 Pro Winner: Game container bottom=${Math.round(winnerGameContainer.bottom)}, viewport height=${pixelViewportHeight}, fits: ${winnerGameContainer.bottom <= pixelViewportHeight}`);
        
        // Test PC Monitor winner
        await page.setViewport({width: 1920, height: 1080});
        await page.screenshot({
            path: 'Screenshots/pc-monitor-winner.png',
            fullPage: false
        });
        console.log('📸 PC Monitor winner screen captured');
        
        // Test compact viewport scenarios
        console.log('📱 Testing very compact viewport (360x640)...');
        await page.setViewport({width: 360, height: 640});
        
        await page.screenshot({
            path: 'Screenshots/compact-winner.png',
            fullPage: false
        });
        console.log('📸 Compact winner screen captured');
        
        const compactGameContainer = await page.$eval('.game-container', el => el.getBoundingClientRect());
        const compactViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`📱 Compact: Game container bottom=${Math.round(compactGameContainer.bottom)}, viewport height=${compactViewportHeight}, fits: ${compactGameContainer.bottom <= compactViewportHeight}`);
        
        console.log('✅ Gameplay viewport test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'Screenshots/gameplay-viewport-error.png'});
    } finally {
        await browser.close();
    }
})();