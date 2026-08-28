import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// World-Class Ultra-Crisp Cyber "S" Monogram
// Designed with thick geometric curves and sharp angled terminals for instant 16x16 SERP clarity
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#18181c" />
      <stop offset="100%" stop-color="#050507" />
    </radialGradient>
    
    <!-- Vivid Neon Red to Crimson Gradient -->
    <linearGradient id="neonRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2E2E" />
      <stop offset="45%" stop-color="#FF1A24" />
      <stop offset="100%" stop-color="#C4000C" />
    </linearGradient>

    <!-- Top Highlight Accent -->
    <linearGradient id="whiteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#FF4D4D" stop-opacity="0.2" />
    </linearGradient>
  </defs>

  <!-- Solid Circle Background matching Google SERP frame perfectly -->
  <circle cx="256" cy="256" r="256" fill="url(#bgGlow)" />
  
  <!-- Outer glowing accent ring -->
  <circle cx="256" cy="256" r="242" fill="none" stroke="#FF2E2E" stroke-width="12" stroke-opacity="0.85" />

  <!-- Iconic, Thick, Perfectly Balanced Geometric 'S' Shape -->
  <g transform="translate(256, 256) scale(1.05) translate(-256, -256)">
    <!-- Main S Body -->
    <path d="M 370 175 
             C 370 115 322 75 256 75 
             C 188 75 142 115 142 175 
             C 142 232 182 258 248 278 
             L 274 286 
             C 328 302 358 325 358 368 
             C 358 418 314 445 256 445 
             C 188 445 144 408 138 348 
             L 204 348 
             C 208 378 226 394 256 394 
             C 284 394 300 380 300 360 
             C 300 326 272 308 214 290 
             L 188 282 
             C 138 266 90 238 90 178 
             C 90 118 140 52 256 52 
             C 358 52 418 112 422 175 
             Z" 
          fill="url(#neonRed)" />

    <!-- Sharp Top-Right Terminal Cut Accent -->
    <path d="M 256 52 L 422 175 L 370 175 C 370 115 322 75 256 75 Z" fill="url(#whiteGlow)" />
    
    <!-- Center Cyber Dot Core -->
    <circle cx="256" cy="282" r="9" fill="#FFFFFF" opacity="0.9" />
  </g>
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
            html, body { width: 100%; height: 100%; overflow: hidden; background: #050507; }
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
