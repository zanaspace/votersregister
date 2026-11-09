import fs from 'fs';

const records = JSON.parse(fs.readFileSync('data/voter_records.json', 'utf8'));

// Build lookup maps
const lgaByState = {};
const wardByLga = {};

for (const r of records) {
  if (!lgaByState[r.state]) lgaByState[r.state] = new Set();
  lgaByState[r.state].add(r.lga);

  const lgaKey = `${r.state}|${r.lga}`;
  if (!wardByLga[lgaKey]) wardByLga[lgaKey] = new Set();
  wardByLga[lgaKey].add(r.ward);
}

console.log("LGAs in voter_records per state sample (Lagos):", Array.from(lgaByState['LAGOS'] || []));
console.log("Wards in Ikeja:", Array.from(wardByLga['LAGOS|IKEJA'] || []));
console.log("Wards in Eti-Osa:", Array.from(wardByLga['LAGOS|ETI-OSA'] || []));
console.log("Wards in Obio/Akpor (Rivers):", Array.from(wardByLga['RIVERS|OBIO/AKPOR'] || []));
