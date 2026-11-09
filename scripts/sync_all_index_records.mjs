import fs from 'fs';

const records = JSON.parse(fs.readFileSync('data/voter_records.json', 'utf8'));
const recordsJson = JSON.stringify(records);

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const startIdx = content.indexOf('window.INITIAL_VOTER_RECORDS = [');
  if (startIdx !== -1) {
    const endIdx = content.indexOf('];', startIdx) + 2;
    content = content.slice(0, startIdx) + 'window.INITIAL_VOTER_RECORDS = ' + recordsJson + ';' + content.slice(endIdx);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file} with ${records.length} embedded voter records.`);
  } else {
    console.warn(`No INITIAL_VOTER_RECORDS found in ${file}`);
  }
}

updateFile('index.html');
updateFile('dashboard.html');
updateFile('public/index.html');
