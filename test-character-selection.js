const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🚀 Starting character selection test...');
        
        // Navigate to the application
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.character-selection-container');
        
        // Take screenshot of character selection screen
        await page.screenshot({
            path: 'Screenshots/Screenshots/character-selection-screen.png',
            fullPage: true
        });
        console.log('📸 Character selection screen captured');
        
        // Verify character selection prompt
        const prompt = await page.$eval('#selection-prompt', el => el.textContent);
        console.log(`📝 Selection prompt: ${prompt}`);
        
        // Check if character cards are loaded
        const characterCards = await page.$$('.character-card');
        console.log(`🎭 Found ${characterCards.length} character cards`);
        
        // Player 1 selects first character (Bluey)
        await page.click('.character-card[data-character-id="bluey"]');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take screenshot after Player 1 selection
        await page.screenshot({
            path: 'Screenshots/player1-selected.png',
            fullPage: true
        });
        console.log('📸 Player 1 selection captured');
        
        // Verify Player 1 selection
        const player1Name = await page.$eval('#player1-name', el => el.textContent);
        console.log(`👤 Player 1 selected: ${player1Name}`);
        
        // Player 2 selects second character (Bingo)
        await page.click('.character-card[data-character-id="bingo"]');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take screenshot after Player 2 selection
        await page.screenshot({
            path: 'Screenshots/both-players-selected.png',
            fullPage: true
        });
        console.log('📸 Both players selection captured');
        
        // Verify Player 2 selection
        const player2Name = await page.$eval('#player2-name', el => el.textContent);
        console.log(`👤 Player 2 selected: ${player2Name}`);
        
        // Start the game
        await page.click('#start-game');
        await page.waitForSelector('.game-container');
        
        // Take screenshot of game screen
        await page.screenshot({
            path: 'Screenshots/game-screen.png',
            fullPage: true
        });
        console.log('📸 Game screen captured');
        
        // Verify game setup with selected characters
        const gamePlayer1Name = await page.$eval('#game-player1-name', el => el.textContent);
        const gamePlayer2Name = await page.$eval('#game-player2-name', el => el.textContent);
        console.log(`🎮 Game players: ${gamePlayer1Name} vs ${gamePlayer2Name}`);
        
        // Play a complete game
        console.log('🎯 Playing complete game...');
        
        // Winning sequence for Player 1 (top row)
        await page.click('.cell[data-index="0"]'); // Player 1
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="3"]'); // Player 2
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="1"]'); // Player 1
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="4"]'); // Player 2
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.click('.cell[data-index="2"]'); // Player 1 wins!
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of winner
        await page.screenshot({
            path: 'Screenshots/game-winner.png',
            fullPage: true
        });
        console.log('📸 Game winner captured');
        
        // Verify winner message
        const winnerMessage = await page.$eval('#game-message', el => el.textContent);
        console.log(`🏆 Winner message: ${winnerMessage}`);
        
        // Test responsive design
        console.log('📱 Testing responsive design...');
        
        // Mobile viewport (480px)
        await page.setViewport({width: 480, height: 800});
        await page.click('#change-characters');
        await page.waitForSelector('.character-selection-container');
        
        await page.screenshot({
            path: 'Screenshots/mobile-character-selection.png',
            fullPage: true
        });
        console.log('📸 Mobile character selection captured');
        
        // Tablet viewport (768px)
        await page.setViewport({width: 768, height: 1024});
        
        await page.screenshot({
            path: 'Screenshots/tablet-character-selection.png',
            fullPage: true
        });
        console.log('📸 Tablet character selection captured');
        
        // Desktop viewport (1200px)
        await page.setViewport({width: 1200, height: 800});
        
        await page.screenshot({
            path: 'Screenshots/desktop-character-selection.png',
            fullPage: true
        });
        console.log('📸 Desktop character selection captured');
        
        console.log('✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({path: 'error-screenshot.png'});
    } finally {
        await browser.close();
    }
})();