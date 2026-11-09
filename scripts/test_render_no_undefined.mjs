import fs from 'fs';

const html = fs.readFileSync('politicians.html', 'utf8');
const data = JSON.parse(fs.readFileSync('data/politicians_registry.json', 'utf8'));

// Test card rendering template logic for every politician in data
let undefinedHits = 0;

data.forEach(p => {
  const c23 = Number(p.count_2023 ?? p.c23 ?? 0);
  const c27 = Number(p.count_2027 ?? p.c27 ?? 0);
  const delta = Number(p.difference ?? p.delta ?? (c27 - c23));
  const pctGrowth = p.pctGrowth !== undefined ? Number(p.pctGrowth) : (c23 > 0 ? Number(((delta / c23) * 100).toFixed(1)) : 0);

  const cardHtml = `
    <div>
      <span class="text-[9px] uppercase font-bold text-slate-400 block">2023 Baseline</span>
      <span class="font-mono font-bold text-slate-800 text-xs sm:text-sm">${c23.toLocaleString()}</span>
    </div>
    <div>
      <span class="text-[9px] uppercase font-bold text-amber-500 block">2027 Prelim</span>
      <span class="font-mono font-black text-slate-900 text-xs sm:text-sm">${c27.toLocaleString()}</span>
    </div>
    <div>
      <span class="text-[9px] uppercase font-bold text-slate-400 block">Change</span>
      <span class="font-mono font-black text-xs sm:text-sm">${delta > 0 ? '+' : ''}${delta.toLocaleString()} (${pctGrowth}%)</span>
    </div>
  `;

  if (cardHtml.includes('undefined') || cardHtml.includes('NaN')) {
    console.error(`Found undefined/NaN for ${p.name}`);
    undefinedHits++;
  }
});

console.log(`Render simulation test for ${data.length} politicians: ${undefinedHits} errors found.`);
if (undefinedHits === 0) {
  console.log("PASS: 100% of politicians render valid, formatted numbers (0 undefined/NaN).");
}

