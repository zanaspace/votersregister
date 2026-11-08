#!/usr/bin/env node
/**
 * INEC Polling Unit Voter Audit & Forensic Anomaly Dashboard Server
 * 
 * Features:
 * - Serves interactive Web Dashboard on http://localhost:3000
 * - REST API for voter records, state projections, anomaly forensics, and manipulation flags
 * - Real-time auto-reload on voter_records.json updates
 * - Dynamic parameter tuning (baseline growth, urban multiplier, discrepancy thresholds)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const JSON_FILE = path.join(DATA_DIR, 'voter_records.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PORT = process.env.PORT || 3000;

// Official 2023 INEC Registered Voters by State (National Total ~93,469,008)
const STATE_2023_BASELINE = {
  'ABIA': 2120808,
  'ADAMAWA': 2196566,
  'AKWA IBOM': 2357418,
  'ANAMBRA': 2656437,
  'BAUCHI': 2749268,
  'BAYELSA': 1056862,
  'BENUE': 2777727,
  'BORNO': 2513281,
  'CROSS RIVER': 1766466,
  'DELTA': 3225243,
  'EBONYI': 1597646,
  'EDO': 2501081,
  'EKITI': 987647,
  'ENUGU': 2112793,
  'FCT': 1570307,
  'GOMBE': 1575794,
  'IMO': 2419925,
  'JIGAWA': 2351298,
  'KADUNA': 4335208,
  'KANO': 5921370,
  'KATSINA': 3516719,
  'KEBBI': 2032041,
  'KOGI': 1932654,
  'KWARA': 1695927,
  'LAGOS': 7060198,
  'NASARAWA': 1899244,
  'NIGER': 2698344,
  'OGUN': 2688305,
  'ONDO': 1991344,
  'OSUN': 1954800,
  'OYO': 3276675,
  'PLATEAU': 2789528,
  'RIVERS': 3537190,
  'SOKOTO': 2172056,
  'TARABA': 2022374,
  'YOBE': 1485146,
  'ZAMFARA': 1926870
};

// Geopolitical Zones
const STATE_ZONES = {
  'ABIA': 'South East', 'ANAMBRA': 'South East', 'EBONYI': 'South East', 'ENUGU': 'South East', 'IMO': 'South East',
  'ADAMAWA': 'North East', 'BAUCHI': 'North East', 'BORNO': 'North East', 'GOMBE': 'North East', 'TARABA': 'North East', 'YOBE': 'North East',
  'BENUE': 'North Central', 'FCT': 'North Central', 'KOGI': 'North Central', 'KWARA': 'North Central', 'NASARAWA': 'North Central', 'NIGER': 'North Central', 'PLATEAU': 'North Central',
  'JIGAWA': 'North West', 'KADUNA': 'North West', 'KANO': 'North West', 'KATSINA': 'North West', 'KEBBI': 'North West', 'SOKOTO': 'North West', 'ZAMFARA': 'North West',
  'EKITI': 'South West', 'LAGOS': 'South West', 'OGUN': 'South West', 'ONDO': 'South West', 'OSUN': 'South West', 'OYO': 'South West',
  'AKWA IBOM': 'South South', 'BAYELSA': 'South South', 'CROSS RIVER': 'South South', 'DELTA': 'South South', 'EDO': 'South South', 'RIVERS': 'South South'
};

// Known Key Event Hubs & Demographic Corridors
const URBAN_LGAS = new Set([
  'IBEJU-LEKKI', 'ETI-OSA', 'ALIMOSHO', 'IKEJA', 'KOSOFE', 'AGEGE', 'AMUWO ODOFIN', 'OSHODI-ISOLO',
  'ADO ODO-OTA', 'IFO', 'SAGAMU', 'OBAFEMI OWODE',
  'KARU', 'KEFFI', 'LAFIA',
  'MUNICIPAL', 'BWARI', 'KUJE', 'GWAGWALADA',
  'OBIO/AKPOR', 'IKWERRE', 'PORT HARCOURT',
  'TARAUNI', 'NASSARAWA', 'FAGGE', 'GWALE', 'DALA',
  'IBADAN NORTH', 'IBADAN SOUTH WEST', 'EGArchitecture',
  'ENUGU NORTH', 'ENUGU SOUTH',
  'WARRI SOUTH', 'UGHELLI NORTH'
]);

const IDP_ZONES = new Set([
  'GUSAU', 'MARU', 'ANKA',
  'SHIRORO', 'RAFI', 'MUNYA',
  'GUMA', 'LOGO', 'AGATU',
  'KONDUGA', 'BAMA', 'CHIBOK', 'GWOZA', 'MAIDUGURI',
  'DAMBOA', 'BIRNIN GWARI', 'CHIKUN', 'KAJURU'
]);

// Forensic Evaluation Engine
function evaluateRecords(records, options = {}) {
  const organicRate = options.organicRate ?? 0.12; // 12% 4-year baseline organic growth
  const urbanMultiplier = options.urbanMultiplier ?? 0.35; // 35% allowable for high-urban corridors
  const megaPULimit = options.megaPULimit ?? 1000; // Statutory INEC threshold
  const suspiciousDiffThreshold = options.suspiciousThreshold ?? 50; // discrepancy threshold

  return records.map(r => {
    const c23 = Number(r.count_2023) || 0;
    const c27 = Number(r.count_2027) || 0;
    const delta = Number(r.difference) ?? (c27 - c23);
    const puName = (r.pu_name || '').toUpperCase();
    const lga = (r.lga || '').toUpperCase();
    const state = (r.state || '').toUpperCase();

    let eventDetected = null;
    let allowableGrowth = organicRate;
    let allowableBuffer = 30; // base natural variation tolerance

    // Check Key Event 1: Zero-Baseline Polling Unit Activation
    if (c23 === 0) {
      if (c27 <= 850) {
        eventDetected = {
          type: 'ZERO_BASELINE_ACTIVATION',
          title: 'Zero-Baseline Activation',
          description: 'Newly created polling unit in 2023 without initial registrants; normal cohort allocation.'
        };
        allowableGrowth = 999;
        allowableBuffer = 850;
      } else {
        eventDetected = {
          type: 'ZERO_BASELINE_OVERFLOW',
          title: 'Zero-Baseline Overflow',
          description: `Newly activated polling unit assigned ${c27} voters, exceeding standard capacity.`
        };
        allowableBuffer = 750;
      }
    }
    // Check Key Event 2: Tertiary Institution / Campus Registration Drive
    else if (puName.includes('CAMPUS') || puName.includes('UNIVERSITY') || puName.includes('POLYTECHNIC') || puName.includes('COLLEGE') || puName.includes('ACADEMY')) {
      eventDetected = {
        type: 'CAMPUS_HUB',
        title: 'Tertiary Campus Registration Hub',
        description: 'Voter registration surge supported by student population mobilization.'
      };
      allowableGrowth = Math.max(allowableGrowth, 0.40);
      allowableBuffer = 120;
    }
    // Check Key Event 3: Rapid Suburbanization / Urban Corridor
    else if (URBAN_LGAS.has(lga)) {
      eventDetected = {
        type: 'URBAN_CORRIDOR',
        title: 'Metropolitan Influx Corridor',
        description: `Rapid urban migration and residential expansion in ${lga}.`
      };
      allowableGrowth = Math.max(allowableGrowth, urbanMultiplier);
      allowableBuffer = 100;
    }
    // Check Key Event 4: IDP / Security Displacement Re-allocation
    else if (IDP_ZONES.has(lga)) {
      eventDetected = {
        type: 'DISPLACEMENT_CLUSTER',
        title: 'Security Displacement / IDP Center',
        description: `Voter influx associated with displacement and consolidation in ${lga}.`
      };
      allowableGrowth = Math.max(allowableGrowth, 0.45);
      allowableBuffer = 150;
    }

    // Expected Max Calculation
    const expectedMax = c23 === 0
      ? allowableBuffer
      : Math.round(c23 * (1 + allowableGrowth) + allowableBuffer);

    const discrepancy = Math.max(0, c27 - expectedMax);
    const pctGrowth = c23 > 0 ? ((c27 - c23) / c23) * 100 : (c27 > 0 ? 100 : 0);

    // Classification & Forensic Verdict
    let flag = 'NORMAL';
    let flagLabel = 'Normal Baseline';
    let severity = 'LOW';
    let forensicReason = 'Voter count aligns with demographic baseline.';

    if (delta < -25) {
      flag = 'VOTER_DRAIN';
      flagLabel = 'Voter Roll Shrinkage';
      severity = Math.abs(delta) > 50 ? 'HIGH' : 'MEDIUM';
      forensicReason = `Significant contraction of ${Math.abs(delta)} voters (${pctGrowth.toFixed(1)}%). Requires audit for possible wrongful deletion.`;
    } else if (c27 >= megaPULimit && c27 > c23 * 1.3) {
      flag = 'CRITICAL_MANIPULATION';
      flagLabel = '🚨 Critical: Mega-PU Cap Breach';
      severity = 'CRITICAL';
      forensicReason = `Register surged to ${c27} voters without statutory unbundling (+${delta} voters). Breaches statutory ceiling.`;
    } else if (discrepancy >= 200 || (c23 < 20 && c27 > 250 && !eventDetected)) {
      flag = 'CRITICAL_MANIPULATION';
      flagLabel = '🚨 Critical Register Manipulation';
      severity = 'CRITICAL';
      forensicReason = `Extreme unsubstantiated surge (+${delta} voters, +${pctGrowth.toFixed(1)}%) in settled/rural unit without demographic event. ${discrepancy} artificial excess voters estimated.`;
    } else if (discrepancy >= suspiciousDiffThreshold) {
      if (eventDetected) {
        flag = 'CONTEXTUAL_SURGE';
        flagLabel = 'ℹ️ Contextual Surge (Verified Event)';
        severity = 'MEDIUM';
        forensicReason = `Surge (+${delta} voters) partially justified by ${eventDetected.title}. Retains minor discrepancy of ${discrepancy}.`;
      } else {
        flag = 'SUSPICIOUS_MANIPULATION';
        flagLabel = '⚠️ Flagged: Suspected Manipulation';
        severity = 'HIGH';
        forensicReason = `Abnormal expansion (+${delta} voters, +${pctGrowth.toFixed(1)}%) with NO justifiable key event. ${discrepancy} excess voters above demographic ceiling.`;
      }
    } else if (discrepancy > 0) {
      if (eventDetected) {
        flag = 'EXPLAINED_EVENT';
        flagLabel = 'ℹ️ Key Event Explained';
        severity = 'LOW';
        forensicReason = `Increase within expected limits of ${eventDetected.title}.`;
      } else {
        flag = 'BORDERLINE_ANOMALY';
        flagLabel = 'Borderline Anomaly';
        severity = 'LOW';
        forensicReason = `Slightly exceeds baseline tolerance (+${discrepancy} voters).`;
      }
    }

    return {
      ...r,
      c23,
      c27,
      delta,
      pctGrowth: Number(pctGrowth.toFixed(1)),
      expectedMax,
      discrepancy,
      eventDetected,
      flag,
      flagLabel,
      severity,
      forensicReason,
      zone: STATE_ZONES[state] || 'National'
    };
  });
}

// Compute State-Level Projections & Risk Scoring
function computeStateProjections(evaluatedRecords) {
  const byState = {};

  for (const r of evaluatedRecords) {
    const s = r.state;
    if (!byState[s]) {
      byState[s] = {
        state: s,
        zone: r.zone,
        official2023Register: STATE_2023_BASELINE[s] || 2000000,
        sampleCount: 0,
        sample2023Total: 0,
        sample2027Total: 0,
        sampleNetDelta: 0,
        flaggedCount: 0,
        criticalCount: 0,
        drainCount: 0,
        totalDiscrepancy: 0,
        maxPUDelta: -Infinity,
        minPUDelta: Infinity,
        samplePUs: []
      };
    }
    const bs = byState[s];
    bs.sampleCount++;
    bs.sample2023Total += r.c23;
    bs.sample2027Total += r.c27;
    bs.sampleNetDelta += r.delta;
    bs.totalDiscrepancy += r.discrepancy;
    if (r.flag.includes('MANIPULATION')) bs.flaggedCount++;
    if (r.severity === 'CRITICAL') bs.criticalCount++;
    if (r.flag === 'VOTER_DRAIN') bs.drainCount++;
    if (r.delta > bs.maxPUDelta) bs.maxPUDelta = r.delta;
    if (r.delta < bs.minPUDelta) bs.minPUDelta = r.delta;
    bs.samplePUs.push(r);
  }

  return Object.values(byState).map(bs => {
    const sampleGrowthRate = bs.sample2023Total > 0
      ? ((bs.sample2027Total - bs.sample2023Total) / bs.sample2023Total)
      : 0;
    
    // Project full state register to 2027 based on sample growth trajectory
    const projected2027Register = Math.round(bs.official2023Register * (1 + sampleGrowthRate));
    
    // Theoretical 12% national demographic upper ceiling
    const demographicUpperCeiling = Math.round(bs.official2023Register * 1.12);
    
    // State-wide artificial discrepancy projection
    const projectedExcessVoters = Math.max(0, projected2027Register - demographicUpperCeiling);
    
    // Flag rate in sample
    const flagRate = bs.sampleCount > 0 ? (bs.flaggedCount / bs.sampleCount) * 100 : 0;
    
    // Risk Level
    let riskLevel = 'LOW';
    if (flagRate >= 20 || bs.criticalCount >= 3 || sampleGrowthRate > 0.25) {
      riskLevel = 'CRITICAL';
    } else if (flagRate >= 10 || bs.criticalCount >= 1 || sampleGrowthRate > 0.18) {
      riskLevel = 'HIGH';
    } else if (flagRate > 0 || sampleGrowthRate > 0.12) {
      riskLevel = 'MODERATE';
    }

    return {
      state: bs.state,
      zone: bs.zone,
      official2023Register: bs.official2023Register,
      sampleCount: bs.sampleCount,
      sample2023Total: bs.sample2023Total,
      sample2027Total: bs.sample2027Total,
      sampleNetDelta: bs.sampleNetDelta,
      sampleGrowthRate: Number((sampleGrowthRate * 100).toFixed(2)),
      projected2027Register,
      demographicUpperCeiling,
      projectedExcessVoters,
      flaggedCount: bs.flaggedCount,
      criticalCount: bs.criticalCount,
      drainCount: bs.drainCount,
      flagRate: Number(flagRate.toFixed(1)),
      totalDiscrepancy: bs.totalDiscrepancy,
      maxPUDelta: bs.maxPUDelta === -Infinity ? 0 : bs.maxPUDelta,
      minPUDelta: bs.minPUDelta === Infinity ? 0 : bs.minPUDelta,
      riskLevel
    };
  }).sort((a, b) => b.projectedExcessVoters - a.projectedExcessVoters || b.flagRate - a.flagRate);
}

// Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    let rawRecords = [];
    try {
      if (fs.existsSync(JSON_FILE)) {
        rawRecords = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8') || '[]');
      }
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to read voter records: ' + err.message }));
      return;
    }

    const options = {
      organicRate: parseFloat(parsedUrl.searchParams.get('organicRate') || '0.12'),
      urbanMultiplier: parseFloat(parsedUrl.searchParams.get('urbanMultiplier') || '0.35'),
      megaPULimit: parseInt(parsedUrl.searchParams.get('megaPULimit') || '1000', 10),
      suspiciousThreshold: parseInt(parsedUrl.searchParams.get('suspiciousThreshold') || '50', 10)
    };

    const evaluated = evaluateRecords(rawRecords, options);

    if (pathname === '/api/summary') {
      const stateProjections = computeStateProjections(evaluated);
      const flagged = evaluated.filter(r => r.flag.includes('MANIPULATION'));
      const critical = evaluated.filter(r => r.severity === 'CRITICAL');
      const drain = evaluated.filter(r => r.flag === 'VOTER_DRAIN');
      const contextual = evaluated.filter(r => r.eventDetected !== null);

      const total23 = evaluated.reduce((sum, r) => sum + r.c23, 0);
      const total27 = evaluated.reduce((sum, r) => sum + r.c27, 0);
      const netDelta = total27 - total23;
      const netGrowth = total23 > 0 ? ((netDelta / total23) * 100).toFixed(2) : 0;
      const totalDiscrepancy = evaluated.reduce((sum, r) => sum + r.discrepancy, 0);

      const summary = {
        totalAuditedPUs: evaluated.length,
        totalSample2023Voters: total23,
        totalSample2027Voters: total27,
        sampleNetDelta: netDelta,
        sampleNetGrowthPct: Number(netGrowth),
        flaggedManipulationsCount: flagged.length,
        flaggedManipulationsPct: Number(((flagged.length / (evaluated.length || 1)) * 100).toFixed(1)),
        criticalAnomaliesCount: critical.length,
        voterDrainCount: drain.length,
        contextualEventsCount: contextual.length,
        totalDiscrepancyVoters: totalDiscrepancy,
        statesCount: stateProjections.length,
        topHighRiskStates: stateProjections.filter(s => s.riskLevel === 'CRITICAL').map(s => s.state),
        auditTimestamp: new Date().toISOString()
      };

      res.writeHead(200);
      res.end(JSON.stringify(summary));
      return;
    }

    if (pathname === '/api/records') {
      const state = parsedUrl.searchParams.get('state');
      const flag = parsedUrl.searchParams.get('flag');
      const search = parsedUrl.searchParams.get('search')?.toLowerCase();
      const limit = parseInt(parsedUrl.searchParams.get('limit') || '5000', 10);

      let filtered = evaluated;
      if (state && state !== 'ALL') {
        filtered = filtered.filter(r => r.state === state.toUpperCase());
      }
      if (flag && flag !== 'ALL') {
        if (flag === 'FLAGGED_MANIPULATION') {
          filtered = filtered.filter(r => r.flag.includes('MANIPULATION'));
        } else {
          filtered = filtered.filter(r => r.flag === flag);
        }
      }
      if (search) {
        filtered = filtered.filter(r =>
          (r.pu_name && r.pu_name.toLowerCase().includes(search)) ||
          (r.pu_code && r.pu_code.toLowerCase().includes(search)) ||
          (r.lga && r.lga.toLowerCase().includes(search)) ||
          (r.ward && r.ward.toLowerCase().includes(search))
        );
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        total: filtered.length,
        records: filtered.slice(0, limit)
      }));
      return;
    }

    if (pathname === '/api/states') {
      const stateProjections = computeStateProjections(evaluated);
      res.writeHead(200);
      res.end(JSON.stringify(stateProjections));
      return;
    }

    if (pathname === '/api/events') {
      res.writeHead(200);
      res.end(JSON.stringify({
        events: [
          {
            type: 'URBAN_CORRIDOR',
            name: 'Rapid Suburban / Urban Influx',
            description: 'Major metropolitan expansion (e.g., Ibeju-Lekki, Karu, Ado-Odo/Ota, Tarauni). Allowable growth up to 35-50%.',
            activeLGAs: Array.from(URBAN_LGAS)
          },
          {
            type: 'DISPLACEMENT_CLUSTER',
            name: 'IDP & Security Displacement',
            description: 'Security relocation and camp consolidation (e.g., Gusau, Shiroro, Guma). Allowable growth up to 45-60%.',
            activeLGAs: Array.from(IDP_ZONES)
          },
          {
            type: 'CAMPUS_HUB',
            name: 'Tertiary Institution / Campus Mobilization',
            description: 'Intensive student voter registration on university and polytechnic campuses.',
            rule: 'Keyword match (CAMPUS, UNIVERSITY, COLLEGE, POLYTECHNIC)'
          },
          {
            type: 'ZERO_BASELINE_ACTIVATION',
            name: 'Zero-Baseline Activation',
            description: 'Units established in 2021-2023 with 0 initial registrants; up to 850 allowed before unbundling.'
          },
          {
            type: 'STATUTORY_CAP_BREACH',
            name: 'Mega-PU Single Unit Ceiling Breach',
            description: 'Exceeds statutory limit of 1,000 voters without voting point subdivision. Critical manipulation risk.'
          }
        ]
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading dashboard assets');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n===============================================================`);
  console.log(`🚀 INEC VOTER AUDIT & FORENSIC DISCREPANCY DASHBOARD ACTIVE`);
  console.log(`===============================================================`);
  console.log(`🌐 Local Web Interface : http://localhost:${PORT}`);
  console.log(`📊 Records API Endpoint : http://localhost:${PORT}/api/records`);
  console.log(`🗺️  State Projection API : http://localhost:${PORT}/api/states`);
  console.log(`⚠️  Executive Summary API: http://localhost:${PORT}/api/summary`);
  console.log(`===============================================================\n`);
});

