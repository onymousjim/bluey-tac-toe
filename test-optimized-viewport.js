const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Testing optimized viewport sizing...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Test PC Monitor viewport (1920x1080)
        console.log('💻 Testing PC Monitor viewport (1920x1080)...');
        await page.setViewport({width: 1920, height: 1080});
        
        await page.screenshot({
            path: 'Screenshots/optimized-pc-character-selection.png',
            fullPage: false
        });
        console.log('📸 Optimized PC character selection captured');
        
        // Select characters and start game
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        await page.screenshot({
            path: 'Screenshots/optimized-pc-game.png',
            fullPage: false
        });
        console.log('📸 Optimized PC game captured');
        
        // Test Pixel 9 Pro viewport (424x896)
        console.log('📱 Testing Pixel 9 Pro viewport (424x896)...');
        await page.setViewport({width: 424, height: 896});
        
        await page.screenshot({
            path: 'Screenshots/optimized-pixel9pro-game.png',
            fullPage: false
        });
        console.log('📸 Optimized Pixel 9 Pro game captured');
        
        // Play a game and check winner screen
        await page.click('.cell[data-index="0"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="3"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="4"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]'); // Bluey wins!
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.screenshot({
            path: 'Screenshots/optimized-pixel9pro-winner.png',
            fullPage: false
        });
        console.log('📸 Optimized Pixel 9 Pro winner captured');
        
        // Test compact viewport (360x640 - very small phone)
        console.log('📱 Testing compact viewport (360x640)...');
        await page.click('#reset-game');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await page.setViewport({width: 360, height: 640});
        
        await page.screenshot({
            path: 'Screenshots/optimized-compact-game.png',
            fullPage: false
        });
        console.log('📸 Optimized compact game captured');
        
        // Test very short screen (480x600 - landscape phone)
        console.log('📱 Testing very short screen (480x600)...');
        await page.setViewport({width: 480, height: 600});
        
        await page.screenshot({
            path: 'Screenshots/optimized-short-landscape.png',
            fullPage: false
        });
        console.log('📸 Optimized short landscape captured');
        
        // Play some moves on short screen
        await page.click('.cell[data-index="4"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="0"]');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await page.screenshot({
            path: 'Screenshots/optimized-short-landscape-gameplay.png',
            fullPage: false
        });
        console.log('📸 Optimized short landscape gameplay captured');
        
        // Test iPhone SE (375x667)
        console.log('📱 Testing iPhone SE (375x667)...');
        await page.setViewport({width: 375, height: 667});
        
        await page.screenshot({
            path: 'Screenshots/optimized-iphone-se.png',
            fullPage: false
        });
        console.log('📸 Optimized iPhone SE captured');
        
        // Check scrolling requirements
        const viewportTests = [
            {name: 'PC Monitor', width: 1920, height: 1080},
            {name: 'Pixel 9 Pro', width: 424, height: 896},
            {name: 'iPhone SE', width: 375, height: 667},
            {name: 'Compact', width: 360, height: 640},
            {name: 'Short Landscape', width: 480, height: 600}
        ];
        
        for (const test of viewportTests) {
            await page.setViewport({width: test.width, height: test.height});
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
            const viewportHeight = await page.evaluate(() => window.innerHeight);
            const needsScrolling = scrollHeight > viewportHeight;
            
            console.log(`${test.name} (${test.width}x${test.height}): scrollHeight=${scrollHeight}, viewportHeight=${viewportHeight}, scrolling needed: ${needsScrolling}`);
        }
        
        console.log('✅ Optimized viewport test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'Screenshots/optimized-viewport-error.png'});
    } finally {
        await browser.close();
    }
})();