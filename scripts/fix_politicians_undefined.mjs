import fs from 'fs';

const politicians = JSON.parse(fs.readFileSync('data/politicians_registry.json', 'utf8'));

// Double check every politician has both c23/c27/delta AND count_2023/count_2027/difference
const enrichedPoliticians = politicians.map(p => {
  const c23 = Number(p.count_2023 ?? p.c23 ?? 0);
  const c27 = Number(p.count_2027 ?? p.c27 ?? 0);
  const delta = Number(p.difference ?? p.delta ?? (c27 - c23));
  const pctGrowth = p.pctGrowth !== undefined ? Number(p.pctGrowth) : (c23 > 0 ? Number(((delta / c23) * 100).toFixed(1)) : 0);
  return {
    ...p,
    c23,
    count_2023: c23,
    c27,
    count_2027: c27,
    delta,
    difference: delta,
    pctGrowth
  };
});

fs.writeFileSync('data/politicians_registry.json', JSON.stringify(enrichedPoliticians, null, 2), 'utf8');
fs.writeFileSync('public/data/politicians_registry.json', JSON.stringify(enrichedPoliticians, null, 2), 'utf8');

const politiciansJson = JSON.stringify(enrichedPoliticians, null, 2);

function updateHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace window.INITIAL_POLITICIANS = [...];
  const initStart = html.indexOf('window.INITIAL_POLITICIANS = [');
  if (initStart !== -1) {
    const initEnd = html.indexOf('];', initStart) + 2;
    html = html.slice(0, initStart) + 'window.INITIAL_POLITICIANS = ' + politiciansJson + ';' + html.slice(initEnd);
  }

  // Update normalizePoliticians in script
  const normFuncCode = `
    function normalizePoliticians(list) {
      if (!Array.isArray(list)) return [];
      return list.map(p => {
        const c23 = Number(p.count_2023 ?? p.c23 ?? 0);
        const c27 = Number(p.count_2027 ?? p.c27 ?? 0);
        const delta = Number(p.difference ?? p.delta ?? (c27 - c23));
        const pctGrowth = p.pctGrowth !== undefined ? Number(p.pctGrowth) : (c23 > 0 ? Number(((delta / c23) * 100).toFixed(1)) : 0);
        return {
          ...p,
          c23,
          count_2023: c23,
          c27,
          count_2027: c27,
          delta,
          difference: delta,
          pctGrowth
        };
      });
    }
  `;

  // Check if normalizePoliticians is present
  if (!html.includes('function normalizePoliticians(')) {
    const scriptStart = html.indexOf('let politiciansData = [];');
    if (scriptStart !== -1) {
      html = html.slice(0, scriptStart) + normFuncCode + '\n' + html.slice(scriptStart);
    }
  }

  // Replace initialization to use normalizePoliticians
  html = html.replace(
    'politiciansData = window.INITIAL_POLITICIANS;',
    'politiciansData = normalizePoliticians(window.INITIAL_POLITICIANS);'
  );
  html = html.replace(
    'politiciansData = await res.json();',
    'politiciansData = normalizePoliticians(await res.json());'
  );

  // In renderPoliticians, ensure c23, c27, delta, pctGrowth are extracted safely
  const oldCardExtractMarker = 'for (const p of filtered) {';
  const newCardExtractCode = `for (const p of filtered) {
        const c23 = Number(p.count_2023 ?? p.c23 ?? 0);
        const c27 = Number(p.count_2027 ?? p.c27 ?? 0);
        const delta = Number(p.difference ?? p.delta ?? (c27 - c23));
        const pctGrowth = p.pctGrowth !== undefined ? Number(p.pctGrowth) : (c23 > 0 ? Number(((delta / c23) * 100).toFixed(1)) : 0);
  `;
  if (html.includes(oldCardExtractMarker) && !html.includes('const c23 = Number(p.count_2023')) {
    html = html.replace(oldCardExtractMarker, newCardExtractCode);
  }

  // Replace template strings in cards: ${p.c23} -> ${c23.toLocaleString()}, ${p.c27} -> ${c27.toLocaleString()}, ${p.delta > 0 ? '+' : ''}${p.delta} (${p.pctGrowth}%) -> ${delta > 0 ? '+' : ''}${delta.toLocaleString()} (${pctGrowth}%)
  html = html.replace(
    '<span class="font-mono font-bold text-slate-800 text-xs sm:text-sm">${p.c23}</span>',
    '<span class="font-mono font-bold text-slate-800 text-xs sm:text-sm">${c23.toLocaleString()}</span>'
  );
  html = html.replace(
    '<span class="font-mono font-black text-slate-900 text-xs sm:text-sm">${p.c27}</span>',
    '<span class="font-mono font-black text-slate-900 text-xs sm:text-sm">${c27.toLocaleString()}</span>'
  );
  html = html.replace(
    '<span class="font-mono font-black text-xs sm:text-sm ${deltaColor}">${p.delta > 0 ? \'+\' : \'\'}${p.delta} (${p.pctGrowth}%)</span>',
    '<span class="font-mono font-black text-xs sm:text-sm ${deltaColor}">${delta > 0 ? \'+\' : \'\'}${delta.toLocaleString()} (${pctGrowth}%)</span>'
  );

  // In openPolModal:
  const oldModalAssign = `document.getElementById('modal-c23-val').textContent = pol.c23.toLocaleString();
      document.getElementById('modal-c27-val').textContent = pol.c27.toLocaleString();
      document.getElementById('modal-delta-badge').textContent = \`\${pol.delta > 0 ? '+' : ''}\${pol.delta} (\${pol.pctGrowth}%)\`;`;
  
  const newModalAssign = `const mC23 = Number(pol.count_2023 ?? pol.c23 ?? 0);
      const mC27 = Number(pol.count_2027 ?? pol.c27 ?? 0);
      const mDelta = Number(pol.difference ?? pol.delta ?? (mC27 - mC23));
      const mPct = pol.pctGrowth !== undefined ? Number(pol.pctGrowth) : (mC23 > 0 ? Number(((mDelta / mC23) * 100).toFixed(1)) : 0);

      document.getElementById('modal-c23-val').textContent = mC23.toLocaleString();
      document.getElementById('modal-c27-val').textContent = mC27.toLocaleString();
      document.getElementById('modal-delta-badge').textContent = \`\${mDelta > 0 ? '+' : ''}\${mDelta.toLocaleString()} (\${mPct}%)\`;`;

  if (html.includes(oldModalAssign)) {
    html = html.replace(oldModalAssign, newModalAssign);
  }

  // In shareAlarmOnWhatsApp:
  const oldShareBlock = `• 2023 Baseline: \${selectedPolitician.c23}
• 2027 Preliminary: \${selectedPolitician.c27}
• Change: \${selectedPolitician.delta > 0 ? '+' : ''}\${selectedPolitician.delta} (\${selectedPolitician.pctGrowth}%)`;

  const newShareBlock = `• 2023 Baseline: \${selectedPolitician.count_2023 ?? selectedPolitician.c23 ?? 0}
• 2027 Preliminary: \${selectedPolitician.count_2027 ?? selectedPolitician.c27 ?? 0}
• Change: \${(selectedPolitician.difference ?? selectedPolitician.delta ?? 0) > 0 ? '+' : ''}\${selectedPolitician.difference ?? selectedPolitician.delta ?? 0} (\${selectedPolitician.pctGrowth}%)`;

  if (html.includes(oldShareBlock)) {
    html = html.replace(oldShareBlock, newShareBlock);
  }

  // In copyPoliticianDossier:
  const oldCopyBlock = `2023 Baseline Count: \${selectedPolitician.c23}
2027 Preliminary Count: \${selectedPolitician.c27}
Difference: \${selectedPolitician.delta > 0 ? '+' : ''}\${selectedPolitician.delta} (\${selectedPolitician.pctGrowth}%)`;

  const newCopyBlock = `2023 Baseline Count: \${selectedPolitician.count_2023 ?? selectedPolitician.c23 ?? 0}
2027 Preliminary Count: \${selectedPolitician.count_2027 ?? selectedPolitician.c27 ?? 0}
Difference: \${(selectedPolitician.difference ?? selectedPolitician.delta ?? 0) > 0 ? '+' : ''}\${selectedPolitician.difference ?? selectedPolitician.delta ?? 0} (\${selectedPolitician.pctGrowth}%)`;

  if (html.includes(oldCopyBlock)) {
    html = html.replace(oldCopyBlock, newCopyBlock);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateHtmlFile('politicians.html');
updateHtmlFile('public/politicians.html');

