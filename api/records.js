import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    let filePath = path.join(process.cwd(), 'data', 'voter_records.json');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'data', 'voter_records.json');
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const records = JSON.parse(raw);
    res.status(200).json({ total: records.length, records });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load records: ' + err.message });
  }
}

