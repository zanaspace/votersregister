import http from 'http';
import fs from 'fs';

// Let's test all files
const files = ['index.html', 'dashboard.html', 'politicians.html', 'public/index.html', 'public/politicians.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}: length = ${content.length}`);
  
  // Check script tags
  const scripts = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log(`  Found ${scripts.length} script tags`);
  
  for (let i = 0; i < scripts.length; i++) {
    const s = scripts[i];
    // Strip tag
    const code = s.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '').trim();
    if (!code) continue;
    try {
      new Function(code);
    } catch (e) {
      console.error(`  [SYNTAX ERROR in ${file} script #${i+1}]:`, e.message);
    }
  }
}
