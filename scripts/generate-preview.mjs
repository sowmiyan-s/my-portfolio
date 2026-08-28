import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function generatePreview() {
  const publicDir = path.resolve('public');
  const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
  const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
  const execPath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await chromium.launch({
    executablePath: execPath,
    headless: true
  });
  const page = await browser.newPage();
  
  // Set standard OpenGraph 1200x630 dimensions
  await page.setViewportSize({ width: 1200, height: 630 });

  // Read the background image as base64 so it embeds instantly
  let bgBase64 = '';
  try {
    const bgBuffer = fs.readFileSync(path.join(publicDir, 'bg-image.png'));
    bgBase64 = `data:image/png;base64,${bgBuffer.toString('base64')}`;
  } catch (e) {
    console.warn('bg-image not read, using fallback');
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap');
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background: #09090b;
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      
      .bg-layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        z-index: 1;
      }

      .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, transparent 30%, rgba(9,9,11,0.6) 80%, rgba(9,9,11,0.95) 100%),
                    linear-gradient(to right, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.2) 60%, rgba(9,9,11,0.8) 100%);
        z-index: 2;
      }

      .content {
        position: relative;
        z-index: 10;
        height: 100%;
        padding: 48px 56px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .top-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo-pill {
        padding: 10px 24px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 9999px;
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        font-size: 14px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #fff;
        backdrop-filter: blur(12px);
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 32px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px 28px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
      }

      .nav-item {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
      }

      .nav-item.active {
        color: #ff3838;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .nav-item.active::after {
        content: '';
        width: 4px;
        height: 4px;
        background: #ff3838;
        border-radius: 50%;
      }

      .resume-pill {
        padding: 8px 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #fff;
      }

      .main-hero {
        max-width: 620px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .status-row {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 9999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.85);
      }

      .hero-name {
        font-family: 'Outfit', sans-serif;
        font-weight: 900;
        font-size: 64px;
        line-height: 1.0;
        letter-spacing: -0.02em;
        text-transform: uppercase;
        color: #ffffff;
      }

      .hero-tag {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        font-size: 15px;
        color: #ff3838;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }

      .bio-card {
        background: rgba(10, 10, 12, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 16px;
        padding: 20px 24px;
        backdrop-filter: blur(16px);
        display: flex;
        flex-direction: column;
        gap: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      }

      .bio-text {
        font-size: 13.5px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.85);
      }

      .cta-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .btn-primary {
        background: #ff2a2a;
        color: #fff;
        padding: 9px 18px;
        border-radius: 10px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #fff;
        padding: 9px 18px;
        border-radius: 10px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
    </style>
  </head>
  <body>
    ${bgBase64 ? `<img src="${bgBase64}" class="bg-layer" />` : ''}
    <div class="vignette"></div>

    <div class="content">
      <div class="top-nav">
        <div class="logo-pill">Sowmiyan S</div>
        <div class="nav-links">
          <span class="nav-item active">Home</span>
          <span class="nav-item">Projects</span>
          <span class="nav-item">Achievements</span>
          <span class="nav-item">Contact</span>
        </div>
        <div class="resume-pill">Resume ↗</div>
      </div>

      <div class="main-hero">
        <div class="status-row">
          <div class="pill">📍 Namakkal, Tamil Nadu</div>
          <div class="pill">▲ 8 Upvote</div>
        </div>

        <div class="hero-name">SOWMIYAN S</div>
        <div class="hero-tag">AI Engineer &amp; Full-Stack Developer</div>

        <div class="bio-card">
          <p class="bio-text">
            Final-year B.Tech AI &amp; Data Science engineer building autonomous AI agents, multi-agent workflows, and production-grade full-stack web platforms with a focus on real-world engineering and performance.
          </p>
          <div class="cta-row">
            <span class="btn-primary">Explore Projects ↗</span>
            <span class="btn-secondary">✉ Contact</span>
            <span class="btn-secondary">📄 Resume ↗</span>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent);
  await page.waitForTimeout(500);

  const ogPath = path.join(publicDir, 'og-image.png');
  const previewPath = path.join(publicDir, 'preview.png');
  
  await page.screenshot({ path: ogPath });
  fs.copyFileSync(ogPath, previewPath);
  console.log('Saved public/og-image.png and public/preview.png (1200x630 preview card)');

  await browser.close();
}

generatePreview().catch(console.error);
