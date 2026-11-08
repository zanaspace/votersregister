import fs from 'fs';
import path from 'path';

// Known Key Event Hubs
const URBAN_LGAS = new Set(['IBEJU-LEKKI', 'ETI-OSA', 'ALIMOSHO', 'IKEJA', 'KOSOFE', 'AGEGE', 'ADO ODO-OTA', 'IFO', 'KARU', 'MUNICIPAL', 'BWARI', 'OBIO/AKPOR', 'IKWERRE', 'TARAUNI', 'NASSARAWA']);
const IDP_ZONES = new Set(['GUSAU', 'SHIRORO', 'GUMA', 'KONDUGA', 'BAMA']);

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

    const evaluated = records.map(r => {
      const c23 = Number(r.c23 ?? r.count_2023 ?? 0);
      const c27 = Number(r.c27 ?? r.count_2027 ?? 0);
      const delta = Number(r.delta ?? r.difference ?? (c27 - c23));
      const puName = (r.pu_name || '').toUpperCase();
      const lga = (r.lga || '').toUpperCase();

      let eventDetected = null;
      let allowableGrowth = 0.12;
      let allowableBuffer = 30;

      if (c23 === 0) {
        if (c27 <= 850) {
          eventDetected = { type: 'ZERO_BASELINE_ACTIVATION', title: 'Zero-Baseline Activation', description: 'Newly activated unit in 2023 unbundling.' };
          allowableGrowth = 999;
          allowableBuffer = 850;
        } else {
          eventDetected = { type: 'ZERO_BASELINE_OVERFLOW', title: 'Zero-Baseline Overflow', description: 'Exceeded standard PU capacity.' };
          allowableBuffer = 750;
        }
      } else if (puName.includes('CAMPUS') || puName.includes('UNIVERSITY') || puName.includes('POLYTECHNIC') || puName.includes('COLLEGE')) {
        eventDetected = { type: 'CAMPUS_HUB', title: 'Campus Registration Hub', description: 'Student population mobilization.' };
        allowableGrowth = 0.40;
        allowableBuffer = 120;
      } else if (URBAN_LGAS.has(lga)) {
        eventDetected = { type: 'URBAN_CORRIDOR', title: 'Metropolitan Influx Corridor', description: 'Rapid suburban expansion.' };
        allowableGrowth = 0.35;
        allowableBuffer = 100;
      } else if (IDP_ZONES.has(lga)) {
        eventDetected = { type: 'DISPLACEMENT_CLUSTER', title: 'Displacement / IDP Center', description: 'Security displacement consolidation.' };
        allowableGrowth = 0.45;
        allowableBuffer = 150;
      }

      const expectedMax = c23 === 0 ? allowableBuffer : Math.round(c23 * (1 + allowableGrowth) + allowableBuffer);
      const discrepancy = Math.max(0, c27 - expectedMax);
      const pctGrowth = c23 > 0 ? ((c27 - c23) / c23) * 100 : (c27 > 0 ? 100 : 0);

      let flag = 'NORMAL';
      let flagLabel = 'Normal Baseline';
      let severity = 'LOW';
      let forensicReason = 'Voter count aligns with natural population growth.';

      if (delta < -25) {
        flag = 'VOTER_DRAIN';
        flagLabel = 'Voter Roll Shrinkage';
        severity = Math.abs(delta) > 50 ? 'HIGH' : 'MEDIUM';
        forensicReason = `Noticeable drop of ${Math.abs(delta)} voters. Worth checking for wrongful purge.`;
      } else if (c27 >= 1000 && c27 > c23 * 1.3) {
        flag = 'CRITICAL_MANIPULATION';
        flagLabel = '🚨 Critical: Mega-PU Cap Breach';
        severity = 'CRITICAL';
        forensicReason = `Register surged to ${c27} voters without unbundling, exceeding statutory ceiling.`;
      } else if (discrepancy >= 200 || (c23 < 20 && c27 > 250 && !eventDetected)) {
        flag = 'CRITICAL_MANIPULATION';
        flagLabel = '🚨 Critical Register Manipulation';
        severity = 'CRITICAL';
        forensicReason = `Extreme surge (+${delta} voters, +${pctGrowth.toFixed(1)}%) with no demographic event. ${discrepancy} excess artificial voters estimated.`;
      } else if (discrepancy >= 50) {
        if (eventDetected) {
          flag = 'CONTEXTUAL_SURGE';
          flagLabel = 'ℹ️ Verified Real-World Event';
          severity = 'MEDIUM';
          forensicReason = `Surge supported by ${eventDetected.title}.`;
        } else {
          flag = 'SUSPICIOUS_MANIPULATION';
          flagLabel = '⚠️ Flagged: Suspected Manipulation';
          severity = 'HIGH';
          forensicReason = `Abnormal increase (+${delta} voters, +${pctGrowth.toFixed(1)}%) with no justifiable event. ${discrepancy} excess voters.`;
        }
      }

      return {
        ...r,
        c23,
        count_2023: c23,
        c27,
        count_2027: c27,
        delta,
        difference: delta,
        pctGrowth: Number(pctGrowth.toFixed(1)),
        expectedMax,
        discrepancy,
        eventDetected,
        flag,
        flagLabel,
        severity,
        forensicReason
      };
    });

    res.status(200).json({ total: evaluated.length, records: evaluated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load records: ' + err.message });
  }
}
