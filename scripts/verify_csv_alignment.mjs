import fs from 'fs';

const politicians = JSON.parse(fs.readFileSync('data/politicians_registry.json', 'utf8'));
const csvLines = fs.readFileSync('data/voter_records.csv', 'utf8').split('\n').filter(Boolean);

// Parse CSV lines
const csvMap = new Map();
// Header: pu_code,state,lga,ward,pu_name,count_2023,count_2027,difference,status,recorded_at
for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i];
  // Simple regex parser for quoted fields
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  if (!matches || matches.length < 5) continue;
  const clean = s => (s || '').replace(/^"|"$/g, '').trim();
  const pu_code = clean(matches[0]);
  const state = clean(matches[1]);
  const lga = clean(matches[2]);
  const ward = clean(matches[3]);
  const pu_name = clean(matches[4]);
  csvMap.set(pu_code, { pu_code, state, lga, ward, pu_name });
}

console.log(`Checking ${politicians.length} politicians against ${csvMap.size} voter_records.csv entries...`);

let perfectMatches = 0;
let errors = 0;

for (const p of politicians) {
  const match = csvMap.get(p.pu_code);
  if (!match) {
    console.error(`[MISSING IN CSV] ${p.name} (PU Code: ${p.pu_code})`);
    errors++;
  } else {
    const wardMatch = match.ward.toUpperCase() === p.ward.toUpperCase();
    const puMatch = match.pu_name.toUpperCase() === p.pu_name.toUpperCase();
    if (!wardMatch || !puMatch) {
      console.warn(`[MISMATCH] ${p.name}:`);
      if (!wardMatch) console.warn(`   Ward: Pol="${p.ward}" vs CSV="${match.ward}"`);
      if (!puMatch) console.warn(`   PU: Pol="${p.pu_name}" vs CSV="${match.pu_name}"`);
      errors++;
    } else {
      perfectMatches++;
    }
  }
}

console.log(`\nResults: ${perfectMatches}/${politicians.length} 100% IDENTICAL matches in voter_records.csv!`);
if (errors > 0) {
  console.error(`Found ${errors} issues.`);
  process.exit(1);
} else {
  console.log(`All politicians verified and aligned with official INEC voter records!`);
}
