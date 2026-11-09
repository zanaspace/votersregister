import fs from 'fs';

const politicians = JSON.parse(fs.readFileSync('data/politicians_registry.json', 'utf8'));
const voterRecords = JSON.parse(fs.readFileSync('data/voter_records.json', 'utf8'));

console.log(`Politicians count: ${politicians.length}`);
console.log(`Voter records count: ${voterRecords.length}`);

// Index voter records by PU code, and by state+lga+ward
const puMap = new Map();
const wardMap = new Map();

for (const r of voterRecords) {
  puMap.set(r.pu_code, r);
  const key = `${r.state}|${r.lga}`.toUpperCase();
  if (!wardMap.has(key)) wardMap.set(key, new Set());
  wardMap.get(key).add(r.ward);
}

const inCSV = [];
const notInCSV = [];

for (const p of politicians) {
  const match = puMap.get(p.pu_code);
  if (match) {
    inCSV.push({ politician: p, match });
  } else {
    notInCSV.push(p);
  }
}

console.log(`\nExact PU in voter_records.csv: ${inCSV.length}`);
console.log(`PU NOT in voter_records.csv: ${notInCSV.length}`);

// Print the ones in CSV and check ward differences
console.log('\n--- MATCHES IN CSV ---');
for (const item of inCSV) {
  const p = item.politician;
  const m = item.match;
  console.log(`${p.name}:`);
  console.log(`  Pol Registry: Ward="${p.ward}", PU="${p.pu_name}"`);
  console.log(`  CSV Official: Ward="${m.ward}", PU="${m.pu_name}"`);
}
