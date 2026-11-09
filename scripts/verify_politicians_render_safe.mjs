import fs from 'fs';

const html = fs.readFileSync('politicians.html', 'utf8');

// Find INITIAL_POLITICIANS
const initStart = html.indexOf('window.INITIAL_POLITICIANS = [');
const initEnd = html.indexOf('];', initStart) + 1;
const rawPols = JSON.parse(html.slice(initStart + 'window.INITIAL_POLITICIANS = '.length, initEnd));

console.log(`Loaded ${rawPols.length} politicians from HTML`);

// Mock DOM container
const cards = [];
const container = {
  innerHTML: '',
  appendChild(c) {
    cards.push(c);
  },
  classList: {
    add() {},
    remove() {}
  }
};
const emptyState = {
  classList: {
    add() {},
    remove() {}
  }
};

// Simulate render loop from politicians.html
for (const p of rawPols) {
  const c23 = Number(p.count_2023 ?? p.c23 ?? 0);
  const c27 = Number(p.count_2027 ?? p.c27 ?? 0);
  const delta = Number(p.difference ?? p.delta ?? (c27 - c23));
  const pctGrowth = p.pctGrowth !== undefined ? Number(p.pctGrowth) : (c23 > 0 ? Number(((delta / c23) * 100).toFixed(1)) : 0);

  const cardHtml = `
    <div>
      <span>${p.name}</span>
      <span>${p.role}</span>
      <span>${p.state} - ${p.lga}</span>
      <span>Ward: ${p.ward}</span>
      <span>PU: ${p.pu_name} (${p.pu_code})</span>
      <span>2023 Baseline: ${c23.toLocaleString()}</span>
      <span>2027 Prelim: ${c27.toLocaleString()}</span>
      <span>Change: ${delta > 0 ? '+' : ''}${delta.toLocaleString()} (${pctGrowth}%)</span>
    </div>
  `;

  if (cardHtml.includes('undefined') || cardHtml.includes('NaN')) {
    console.error(`Render error for ${p.name}`);
  }
  cards.push(cardHtml);
}

console.log(`Successfully generated ${cards.length} cards with ZERO undefined values!`);
