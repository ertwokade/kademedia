import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const b = await chromium.launch();
const out = {};

async function extract(page) {
  return page.evaluate(() => {
    const cs = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el) : null; };
    const pick = (c, props) => c ? Object.fromEntries(props.map(p => [p, c[p]])) : null;
    const typo = ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textTransform','textDecoration'];
    // survey all visible colors
    const colorSet = new Set(), bgSet = new Set();
    [...document.querySelectorAll('*')].slice(0,600).forEach(el=>{
      const s=getComputedStyle(el);
      if(s.color) colorSet.add(s.color);
      if(s.backgroundColor && s.backgroundColor!=='rgba(0, 0, 0, 0)') bgSet.add(s.backgroundColor);
    });
    // link styles
    const links = [...document.querySelectorAll('a')].slice(0,8).map(a=>({
      text:(a.textContent||'').trim().slice(0,40),
      ...pick(getComputedStyle(a), ['color','textDecoration','textDecorationColor','textUnderlineOffset','fontFamily','fontSize'])
    }));
    // sections order
    const flow = [...document.querySelectorAll('section, header, footer, main > div, main > section')].slice(0,15).map(el=>({
      tag:el.tagName.toLowerCase(), cls:(el.className||'').toString().slice(0,60),
      bg:getComputedStyle(el).backgroundColor, h:el.getBoundingClientRect().height|0
    }));
    return {
      title: document.title,
      body: pick(getComputedStyle(document.body), ['fontFamily','fontSize','color','backgroundColor','lineHeight']),
      html: pick(getComputedStyle(document.documentElement), ['backgroundColor','color']),
      h1: pick(cs('h1'), typo), h2: pick(cs('h2'), typo),
      p: pick(cs('p'), typo),
      // monospace eyebrow labels & nav
      nav: pick(cs('nav a, header a'), typo),
      allColors: [...colorSet].slice(0,30),
      allBg: [...bgSet].slice(0,30),
      links, flow,
      dataTheme: document.documentElement.getAttribute('data-theme') || document.documentElement.className,
    };
  });
}

// Desktop
const pd = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pd.goto('https://haoqi.design/', { waitUntil: 'networkidle', timeout: 45000 });
await pd.waitForTimeout(3000);
out.desktop_default = await extract(pd);
await pd.screenshot({ path: 'docs/design-references/haoqi.design/home-desktop-full.png', fullPage: true });
// try to scroll to reveal dark portrait section & capture viewport there
await pd.evaluate(() => window.scrollTo(0, window.innerHeight * 1.1));
await pd.waitForTimeout(1500);
await pd.screenshot({ path: 'docs/design-references/haoqi.design/home-desktop-section2.png' });
out.section2_scroll = await pd.evaluate(() => {
  const els=[...document.querySelectorAll('section,div')].filter(el=>{const r=el.getBoundingClientRect();return r.top<window.innerHeight&&r.bottom>0&&r.height>200;}).slice(0,6);
  return els.map(el=>({cls:(el.className||'').toString().slice(0,50),bg:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}));
});
await pd.close();

// Mobile
const pm = await b.newPage({ viewport: { width: 390, height: 844 } });
await pm.goto('https://haoqi.design/', { waitUntil: 'networkidle', timeout: 45000 });
await pm.waitForTimeout(3000);
await pm.screenshot({ path: 'docs/design-references/haoqi.design/home-mobile-full.png', fullPage: true });
await pm.close();

await b.close();
writeFileSync('docs/research/haoqi.design/extraction.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
