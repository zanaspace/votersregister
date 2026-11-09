import fs from 'fs';

function validateHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let index = 0;
  let errors = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    index++;
    const code = match[1].trim();
    if (!code) continue;
    try {
      new Function(code);
      console.log(`[PASS] ${filePath} Script block #${index} syntax valid (${code.length} chars)`);
    } catch (e) {
      console.error(`[FAIL] ${filePath} Script block #${index} Syntax Error:`, e.message);
      errors++;
    }
  }

  return errors === 0;
}

const v1 = validateHtml('politicians.html');
const v2 = validateHtml('public/politicians.html');

if (!v1 || !v2) {
  console.error("Syntax validation failed!");
  process.exit(1);
} else {
  console.log("All politicians HTML script blocks parsed with zero syntax errors!");
}
