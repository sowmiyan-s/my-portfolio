import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Centered, bold, high-contrast modern "S" monogram designed for Google Search SERP circular badge
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3838" />
      <stop offset="50%" stop-color="#EF1E28" />
      <stop offset="100%" stop-color="#B90E18" />
    </linearGradient>
  </defs>

  <!-- Full circular background matching Google's SERP badge exactly -->
  <circle cx="256" cy="256" r="256" fill="#070709" />

  <!-- Bold, perfectly balanced 'S' mark with high stroke weight for 16x16 visibility -->
  <path d="M 384 172 
           C 384 104 328 64 256 64 
           C 178 64 126 108 126 176 
           C 126 238 172 268 242 288 
           L 272 296 
           C 330 314 364 338 364 384 
           C 364 438 316 470 252 470 
           C 178 470 128 428 122 360 
           L 194 360 
           C 198 396 222 418 252 418 
           C 282 418 304 400 304 376 
           C 304 336 272 316 210 298 
           L 182 290 
           C 130 272 78 238 78 172 
           C 78 106 134 40 256 40 
           C 366 40 432 106 434 172 
           Z" 
        fill="url(#sGrad)" />
</svg>`;

async function generate() {
  const publicDir = path.resolve('public');
  
  // Write SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('Saved public/favicon.svg');

  // Launch system browser
  const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
  const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
  const execPath = fs.existsSync(edgePath) ? edgePath : chromePath;
  
  const browser = await chromium.launch({
    executablePath: execPath,
    headless: true
  });
  const page = await browser.newPage();
  
  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const item of sizes) {
    await page.setViewportSize({ width: item.size, height: item.size });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; overflow: hidden; background: #070709; }
            svg { width: 100%; height: 100%; display: block; }
          </style>
        </head>
        <body>${svgContent}</body>
      </html>
    `);
    
    const outPath = path.join(publicDir, item.name);
    await page.screenshot({ path: outPath, omitBackground: false });
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  // Create valid ICO file (48x48)
  const png48 = fs.readFileSync(path.join(publicDir, 'favicon-48x48.png'));
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(1, 4);

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(48, 0);
  icoEntry.writeUInt8(48, 1);
  icoEntry.writeUInt8(0, 2);
  icoEntry.writeUInt8(0, 3);
  icoEntry.writeUInt16LE(1, 4);
  icoEntry.writeUInt16LE(32, 6);
  icoEntry.writeUInt32LE(png48.length, 8);
  icoEntry.writeUInt32LE(22, 12);

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, png48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated public/favicon.ico');

  await browser.close();
}

generate().catch(console.error);
