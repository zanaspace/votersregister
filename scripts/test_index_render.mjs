import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Extract evaluateRecordsClient, computeStateProjectionsClient, simParams, and window.INITIAL_VOTER_RECORDS
const initDataIdx = html.indexOf('window.INITIAL_VOTER_RECORDS = [');
const initDataEnd = html.indexOf('];', initDataIdx) + 1;
const dataJson = html.slice(initDataIdx + 'window.INITIAL_VOTER_RECORDS = '.length, initDataEnd);
const records = JSON.parse(dataJson);

console.log(`Embedded voter records count: ${records.length}`);
console.log(`Sample record:`, records[0]);

// Test evaluate logic
const options = {
  organicRate: 0.12,
  urbanMultiplier: 0.35,
  megaPULimit: 1000,
  suspiciousThreshold: 50
};

const URBAN_LGAS = new Set(['IBEJU-LEKKI', 'ETI-OSA', 'ALIMOSHO', 'IKEJA', 'KOSOFE', 'AGEGE', 'ADO ODO-OTA', 'IFO', 'KARU', 'MUNICIPAL', 'BWARI', 'OBIO/AKPOR', 'IKWERRE', 'TARAUNI', 'NASSARAWA']);

let evaluated = [];
try {
  evaluated = records.map(r => {
    const c23 = Number(r.c23 ?? r.count_2023 ?? 0);
    const c27 = Number(r.c27 ?? r.count_2027 ?? 0);
    const delta = Number(r.delta ?? r.difference ?? (c27 - c23));
    const puName = (r.pu_name || '').toUpperCase();
    const lga = (r.lga || '').toUpperCase();
    const state = (r.state || '').toUpperCase();
    return {
      ...r,
      c23,
      c27,
      delta,
      pctGrowth: c23 > 0 ? Number(((delta / c23) * 100).toFixed(1)) : 0
    };
  });
  console.log(`Evaluated ${evaluated.length} records successfully.`);
} catch (e) {
  console.error("Evaluation error:", e);
}

// Check if any record produces undefined in rendering row
let renderErrors = 0;
evaluated.slice(0, 100).forEach(r => {
  const rowHtml = `
    <td>${r.pu_code}</td>
    <td>${r.pu_name}</td>
    <td>${r.state}</td>
    <td>${r.lga}</td>
    <td>${r.c23}</td>
    <td>${r.c27}</td>
    <td>${r.delta}</td>
    <td>${r.pctGrowth}%</td>
  `;
  if (rowHtml.includes('undefined') || rowHtml.includes('NaN')) {
    renderErrors++;
  }
});

console.log(`Sample table rows render errors: ${renderErrors}`);
