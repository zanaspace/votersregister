import fs from 'fs';

const pols = JSON.parse(fs.readFileSync('data/politicians_registry.json', 'utf8'));
const records = JSON.parse(fs.readFileSync('data/voter_records.json', 'utf8'));

console.log("=== CROSS-REFERENCING POLITICIANS WITH OFFICIAL VOTER RECORDS ===");

for (const p of pols) {
  const lgaRecords = records.filter(r => 
    r.state.toUpperCase() === p.state.toUpperCase() && 
    (r.lga.toUpperCase() === p.lga.toUpperCase() || r.lga.toUpperCase().includes(p.lga.toUpperCase()) || p.lga.toUpperCase().includes(r.lga.toUpperCase()))
  );

  const wardClean = p.ward.replace(/\(WARD \d+\)/i, '').trim().toUpperCase();
  const wardRecords = lgaRecords.filter(r => 
    r.ward.toUpperCase() === wardClean || 
    r.ward.toUpperCase().includes(wardClean) || 
    wardClean.includes(r.ward.toUpperCase())
  );

  console.log(`\n[${p.id}] ${p.name} (${p.state} | ${p.lga} | ${p.ward})`);
  if (wardRecords.length > 0) {
    console.log(`  -> Exact/Close Ward Matches in CSV (${wardRecords.length}):`);
    wardRecords.slice(0, 3).forEach(w => console.log(`     PU: ${w.pu_code} | Ward: "${w.ward}" | PU Name: "${w.pu_name}" | 2023: ${w.count_2023}`));
  } else if (lgaRecords.length > 0) {
    console.log(`  -> LGA Matches in CSV (${lgaRecords.length} records). Available Wards: ${[...new Set(lgaRecords.map(r => r.ward))].join(', ')}`);
  } else {
    console.log(`  -> No LGA records in CSV.`);
  }
}

