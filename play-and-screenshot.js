const puppeteer = require('puppeteer');
const path = require('path');

async function playGameAndScreenshot() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, // Show browser to see the game
      defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();
    
    // Open the HTML file directly
    const htmlPath = path.join(__dirname, 'index.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle2' });
    
    console.log('Game loaded, starting to play...');
    
    // Wait a moment for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Play a winning game sequence (Bluey wins)
    // Let's create a winning pattern: top row
    const moves = [
      '[data-index="0"]', // Bluey
      '[data-index="3"]', // Bingo
      '[data-index="1"]', // Bluey
      '[data-index="4"]', // Bingo
      '[data-index="2"]'  // Bluey wins (top row)
    ];
    
    for (let i = 0; i < moves.length; i++) {
      await page.click(moves[i]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between moves
      console.log(`Move ${i + 1} completed`);
    }
    
    // Wait a moment for the win animation/message to appear
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Game completed, taking screenshot...');
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'Screenshots', 'winning-game.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Keep browser open for a moment to see the result
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

playGameAndScreenshot();