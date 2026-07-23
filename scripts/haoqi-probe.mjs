import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
try {
  const resp = await p.goto('https://haoqi.design/', { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => ({
    title: document.title,
    canvases: document.querySelectorAll('canvas').length,
    webgl: [...document.querySelectorAll('canvas')].map(c => { try { return !!(c.getContext('webgl2')||c.getContext('webgl')); } catch(e){ return 'ctx-taken'; } }),
    bodyFont: getComputedStyle(document.body).fontFamily,
    h1: (document.querySelector('h1')?.textContent||'').slice(0,120),
    sections: document.querySelectorAll('section').length,
    bg: getComputedStyle(document.body).backgroundColor,
  }));
  await p.screenshot({ path: 'docs/design-references/haoqi.design/probe-desktop.png', fullPage: true });
  console.log('STATUS', resp?.status());
  console.log(JSON.stringify(info, null, 2));
} catch (e) {
  console.log('PROBE_ERROR', e.message);
} finally { await b.close(); }
