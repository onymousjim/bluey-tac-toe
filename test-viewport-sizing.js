const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing viewport sizing across different screen sizes...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Test PC Monitor viewport (1920x1080 - typical monitor)
        console.log('💻 Testing PC Monitor viewport (1920x1080)...');
        await page.setViewport({width: 1920, height: 1080});
        
        await page.screenshot({
            path: 'Screenshots/pc-monitor-character-selection.png',
            fullPage: false // Important: don't capture full page to see if scrolling is needed
        });
        console.log('📸 PC Monitor character selection captured');
        
        // Select characters and go to game
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        await page.screenshot({
            path: 'Screenshots/pc-monitor-game-board.png',
            fullPage: false
        });
        console.log('📸 PC Monitor game board captured');
        
        // Check if scrolling is needed on PC
        const pcScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const pcViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`💻 PC: scrollHeight=${pcScrollHeight}, viewportHeight=${pcViewportHeight}, scrolling needed: ${pcScrollHeight > pcViewportHeight}`);
        
        // Test Pixel 9 Pro viewport (424x896)
        console.log('📱 Testing Pixel 9 Pro viewport (424x896)...');
        await page.click('#change-characters');
        await page.waitForSelector('.character-selection-container');
        
        await page.setViewport({width: 424, height: 896});
        
        await page.screenshot({
            path: 'Screenshots/pixel9pro-character-selection.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro character selection captured');
        
        // Select characters and go to game
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        await page.screenshot({
            path: 'Screenshots/pixel9pro-game-board.png',
            fullPage: false
        });
        console.log('📸 Pixel 9 Pro game board captured');
        
        // Check if scrolling is needed on Pixel 9 Pro
        const pixelScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const pixelViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`📱 Pixel 9 Pro: scrollHeight=${pixelScrollHeight}, viewportHeight=${pixelViewportHeight}, scrolling needed: ${pixelScrollHeight > pixelViewportHeight}`);
        
        // Test smaller phone viewport (375x667 - iPhone SE)
        console.log('📱 Testing iPhone SE viewport (375x667)...');
        await page.setViewport({width: 375, height: 667});
        
        await page.screenshot({
            path: 'Screenshots/iphone-se-game-board.png',
            fullPage: false
        });
        console.log('📸 iPhone SE game board captured');
        
        const iphoneScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const iphoneViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`📱 iPhone SE: scrollHeight=${iphoneScrollHeight}, viewportHeight=${iphoneViewportHeight}, scrolling needed: ${iphoneScrollHeight > iphoneViewportHeight}`);
        
        // Test tablet viewport (768x1024 - iPad)
        console.log('📱 Testing iPad viewport (768x1024)...');
        await page.setViewport({width: 768, height: 1024});
        
        await page.screenshot({
            path: 'Screenshots/ipad-game-board.png',
            fullPage: false
        });
        console.log('📸 iPad game board captured');
        
        const ipadScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const ipadViewportHeight = await page.evaluate(() => window.innerHeight);
        console.log(`📱 iPad: scrollHeight=${ipadScrollHeight}, viewportHeight=${ipadViewportHeight}, scrolling needed: ${ipadScrollHeight > ipadViewportHeight}`);
        
        console.log('✅ Viewport sizing test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'Screenshots/viewport-test-error.png'});
    } finally {
        await browser.close();
    }
})();