#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const SCREENSHOTS_DIR = './Screenshots';

class PuppeteerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'puppeteer-screenshot',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'screenshot',
          description: 'Take a screenshot of a webpage',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to take screenshot of'
              },
              filename: {
                type: 'string',
                description: 'Filename for the screenshot (without extension)'
              },
              width: {
                type: 'number',
                description: 'Viewport width (default: 1280)',
                default: 1280
              },
              height: {
                type: 'number',
                description: 'Viewport height (default: 720)',
                default: 720
              },
              fullPage: {
                type: 'boolean',
                description: 'Take full page screenshot (default: false)',
                default: false
              }
            },
            required: ['url', 'filename']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'screenshot') {
        return await this.takeScreenshot(args);
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async takeScreenshot(args) {
    const { url, filename, width = 1280, height = 720, fullPage = false } = args;
    
    let browser;
    try {
      // Ensure screenshots directory exists
      await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setViewport({ width, height });
      
      // Navigate to the URL
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Take screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${filename}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: fullPage
      });

      await browser.close();

      return {
        content: [
          {
            type: 'text',
            text: `Screenshot taken successfully and saved to ${screenshotPath}`
          }
        ]
      };

    } catch (error) {
      if (browser) {
        await browser.close();
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `Error taking screenshot: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Puppeteer MCP server running on stdio');
  }
}

const server = new PuppeteerMCPServer();
server.run().catch(console.error);