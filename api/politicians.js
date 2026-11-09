import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    let filePath = path.join(process.cwd(), 'data', 'politicians_registry.json');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'data', 'politicians_registry.json');
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const politicians = JSON.parse(raw);
    res.status(200).json({ total: politicians.length, politicians });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load politicians registry: ' + err.message });
  }
}

