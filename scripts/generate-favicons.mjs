import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Clean, high-impact, cyber-modern 'S' monogram designed specifically for high legibility at 16x16 SERP & high-res
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF453A" />
      <stop offset="50%" stop-color="#EF4444" />
      <stop offset="100%" stop-color="#DC2626" />
    </linearGradient>
    <linearGradient id="glowBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF453A" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#EF4444" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#B91C1C" stop-opacity="0.8" />
    </linearGradient>
  </defs>

  <!-- High-contrast rounded container for universal dark/light search engine visibility -->
  <rect x="20" y="20" width="472" height="472" rx="104" fill="url(#bgGrad)" stroke="url(#glowBorder)" stroke-width="16" />
  
  <!-- Subtle tech dot matrix accent in corner -->
  <circle cx="100" cy="100" r="8" fill="#FF453A" opacity="0.6" />
  <circle cx="124" cy="100" r="4" fill="#FF453A" opacity="0.3" />
  <circle cx="100" cy="124" r="4" fill="#FF453A" opacity="0.3" />
  
  <circle cx="412" cy="412" r="8" fill="#FF453A" opacity="0.6" />
  <circle cx="388" cy="412" r="4" fill="#FF453A" opacity="0.3" />
  <circle cx="412" cy="388" r="4" fill="#FF453A" opacity="0.3" />

  <!-- Bold Modern 'S' Shape with High Visibility -->
  <path d="M 368 184 C 368 132 328 92 256 92 C 184 92 144 132 144 184 C 144 240 188 268 250 286 L 278 294 C 332 310 368 334 368 382 C 368 438 322 476 256 476 C 180 476 138 432 134 366 L 202 366 C 206 400 228 422 256 422 C 286 422 308 404 308 380 C 308 340 274 322 216 304 L 188 296 C 136 280 84 248 84 186 C 84 126 134 44 256 44 C 364 44 428 116 428 184 Z" fill="none" />
  
  <!-- Solid Bold S Glyph with chamfered futuristic geometry -->
  <path d="M 376 176 
           C 376 120 326 84 256 84 
           C 182 84 136 122 136 182 
           C 136 238 180 264 244 282 
           L 272 290 
           C 328 306 360 330 360 376 
           C 360 426 318 456 256 456 
           C 186 456 142 418 138 358 
           L 204 358 
           C 208 392 228 408 256 408 
           C 284 408 302 392 302 372 
           C 302 338 274 322 218 306 
           L 190 298 
           C 136 282 92 250 92 186 
           C 92 124 142 56 256 56 
           C 358 56 414 116 416 176 
           Z" 
        fill="url(#redGrad)" />
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
            html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
            svg { width: 100%; height: 100%; display: block; }
          </style>
        </head>
        <body>${svgContent}</body>
      </html>
    `);
    
    const outPath = path.join(publicDir, item.name);
    await page.screenshot({ path: outPath, omitBackground: true });
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
