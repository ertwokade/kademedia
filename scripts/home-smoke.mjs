import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
p.on('pageerror', e => errors.push('PAGEERROR: '+e.message));
try {
  await p.goto('http://localhost:5191/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3500);
  const info = await p.evaluate(() => {
    const iframe = document.querySelector('.home-hero-frame');
    let heroCanvas = 'no-iframe';
    try { heroCanvas = iframe && iframe.contentDocument ? iframe.contentDocument.querySelectorAll('canvas').length : 'no-access'; } catch(e){ heroCanvas = 'cross-'+e.message.slice(0,20); }
    return {
      hasNavbar: !!document.querySelector('.knav'),
      navLinks: [...document.querySelectorAll('.knav-link')].map(a=>a.textContent.trim()).filter(Boolean),
      hasHeroIframe: !!iframe,
      heroCanvasCount: heroCanvas,
      hasEditorial: !!document.querySelector('.home-service-list'),
      serviceCount: document.querySelectorAll('.home-service-link').length,
      ctaTitle: (document.querySelector('.home-cta-title')?.textContent||'').replace(/\s+/g,' ').trim(),
      isFrozenSite: !!document.querySelector('#kade-home-cleanup') || document.title.includes('HAOQI'),
    };
  });
  await p.screenshot({ path: 'docs/design-references/kade-home-native-desktop.png', fullPage: true });
  console.log(JSON.stringify(info, null, 2));
  console.log('CONSOLE ERRORS ('+errors.length+'):', JSON.stringify(errors.slice(0,8), null, 2));
} catch(e){ console.log('SMOKE_ERROR', e.message); }
finally { await b.close(); }
