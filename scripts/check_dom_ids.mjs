import fs from 'fs';

// Check politicians.html runtime
const polHtml = fs.readFileSync('politicians.html', 'utf8');

// Check if any element ID looked up by getElementById in politicians.html exists in HTML
const polScriptMatches = polHtml.match(/document\.getElementById\(['"]([^'"]+)['"]\)/g) || [];
const missingInPol = [];
for (const m of polScriptMatches) {
  const id = m.match(/document\.getElementById\(['"]([^'"]+)['"]\)/)[1];
  if (!polHtml.includes(`id="${id}"`) && !polHtml.includes(`id='${id}'`)) {
    missingInPol.push(id);
  }
}
console.log('politicians.html missing DOM IDs:', missingInPol);

// Check index.html runtime
const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexScriptMatches = indexHtml.match(/document\.getElementById\(['"]([^'"]+)['"]\)/g) || [];
const missingInIndex = [];
for (const m of indexScriptMatches) {
  const id = m.match(/document\.getElementById\(['"]([^'"]+)['"]\)/)[1];
  if (!indexHtml.includes(`id="${id}"`) && !indexHtml.includes(`id='${id}'`)) {
    missingInIndex.push(id);
  }
}
console.log('index.html missing DOM IDs:', missingInIndex);

// Check dashboard.html runtime
const dashHtml = fs.readFileSync('dashboard.html', 'utf8');
const dashScriptMatches = dashHtml.match(/document\.getElementById\(['"]([^'"]+)['"]\)/g) || [];
const missingInDash = [];
for (const m of dashScriptMatches) {
  const id = m.match(/document\.getElementById\(['"]([^'"]+)['"]\)/)[1];
  if (!dashHtml.includes(`id="${id}"`) && !dashHtml.includes(`id='${id}'`)) {
    missingInDash.push(id);
  }
}
console.log('dashboard.html missing DOM IDs:', missingInDash);
