#!/usr/bin/env node
/**
 * INEC Polling Unit Voter Auditor & Automated Submitter
 * 
 * Supports two operational modes:
 * 1. Fully Autonomous Mode: Provide your INEC session cookie (via --cookie or INEC_COOKIE env var).
 *    The script fetches the PU code from NigeriaElects, fetches the 2027 voter count from INEC,
 *    submits it to NigeriaElects, compares it against 2023, and records all data to CSV/JSON/Markdown.
 * 2. Assisted / Interactive Mode: No cookie required. The script fetches the PU code, copies it
 *    to your clipboard, prints the INEC URL, prompts you for the count, and takes care of submitting
 *    and logging everything automatically.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.resolve(ROOT_DIR, 'data');
const CSV_FILE = path.join(DATA_DIR, 'voter_records.csv');
const JSON_FILE = path.join(DATA_DIR, 'voter_records.json');
const JSONL_FILE = path.join(DATA_DIR, 'voter_records.jsonl');
const DOC_FILE = path.join(ROOT_DIR, 'INEC_POLLING_UNIT_AUDIT.md');
const ENV_FILE = path.join(ROOT_DIR, '.env');
const LOCK_FILE = path.join(DATA_DIR, '.file_lock');

function acquireLock(timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      fs.mkdirSync(LOCK_FILE);
      return true;
    } catch {
      // Busy wait short delay
      const waitTill = Date.now() + 50;
      while (Date.now() < waitTill) {}
    }
  }
  return false;
}

function releaseLock() {
  try {
    fs.rmdirSync(LOCK_FILE);
  } catch {}
}

function recordResult(entry) {
  // 1. Append to CSV (atomic line append)
  const csvRow = [
    `"${entry.pu_code}"`,
    `"${entry.state.replace(/"/g, '""')}"`,
    `"${entry.lga.replace(/"/g, '""')}"`,
    `"${entry.ward.replace(/"/g, '""')}"`,
    `"${entry.pu_name.replace(/"/g, '""')}"`,
    entry.count_2023 ?? '',
    entry.count_2027,
    entry.difference ?? '',
    `"${entry.status}"`,
    `"${entry.recorded_at}"`
  ].join(',') + '\n';
  fs.appendFileSync(CSV_FILE, csvRow, 'utf8');

  // 2. Append to JSONL (always atomic & safe for concurrent processes)
  fs.appendFileSync(JSONL_FILE, JSON.stringify(entry) + '\n', 'utf8');

  // 3. Thread-safe lock for JSON Array & Markdown document
  const locked = acquireLock();
  try {
    // Update JSON array
    try {
      const list = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8') || '[]');
      list.push(entry);
      fs.writeFileSync(JSON_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.error('Error updating JSON file:', err.message);
    }

    // Update Markdown table
    try {
      if (fs.existsSync(DOC_FILE)) {
        let content = fs.readFileSync(DOC_FILE, 'utf8');
        const tableMarker = '<!-- AUDIT_DATA_TABLE_START -->';
        if (content.includes(tableMarker)) {
          const diffDisplay = entry.difference !== null 
            ? (entry.difference > 0 ? `+${entry.difference}` : `${entry.difference}`)
            : 'N/A';
          const newRow = `| \`${entry.pu_code}\` | ${entry.state} | ${entry.lga} | ${entry.pu_name} | ${entry.count_2023 ?? 'N/A'} | **${entry.count_2027}** | ${diffDisplay} | ${entry.status} | ${entry.recorded_at.split('T')[0]} |\n`;
          content = content.replace(tableMarker, `${tableMarker}\n${newRow}`);
          fs.writeFileSync(DOC_FILE, content, 'utf8');
        }
      }
    } catch (err) {
      console.error('Error updating Markdown document:', err.message);
    }
  } finally {
    if (locked) releaseLock();
  }
}

// Auto-load .env if present
if (fs.existsSync(ENV_FILE)) {
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize CSV with header if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
  const header = 'pu_code,state,lga,ward,pu_name,count_2023,count_2027,difference,status,recorded_at\n';
  fs.writeFileSync(CSV_FILE, header, 'utf8');
}

// Initialize JSON array if it doesn't exist
if (!fs.existsSync(JSON_FILE)) {
  fs.writeFileSync(JSON_FILE, '[]', 'utf8');
}

function parseArgs() {
  const args = process.argv.slice(2);
  let workerId = 1;
  
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--worker' || args[i] === '-w') && args[i + 1]) {
      workerId = parseInt(args[i + 1], 10) || 1;
    }
  }

  // Detect cookie based on worker ID or general cookie env
  let detectedCookie = '';
  if (workerId === 2) {
    detectedCookie = process.env.INEC_COOKIE_2 || process.env.cookie_2 || process.env.INEC_COOKIE || process.env.cookie || '';
  } else {
    detectedCookie = process.env.INEC_COOKIE_1 || process.env.cookie_1 || process.env.INEC_COOKIE || process.env.cookie || '';
  }

  const options = {
    worker: workerId,
    cookie: detectedCookie,
    limit: Infinity,
    delay: 6000, // ms between submissions to respect INEC 10 requests/min rate limit
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cookie' && args[i + 1]) {
      options.cookie = args[i + 1];
      i++;
    } else if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--delay' && args[i + 1]) {
      options.delay = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--worker' || args[i] === '-w') {
      options.worker = parseInt(args[i + 1], 10) || 1;
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
INEC Polling Unit Voter Auditor CLI
===================================
Options:
  --worker, -w <1|2>  Worker / Account slot to use from .env (default: 1)
  --cookie <cookie>   Your INEC session cookie (overrides .env)
  --limit <number>    Number of polling units to process (default: continuous)
  --delay <ms>        Delay between checks in milliseconds (default: 6000)
  --help, -h          Show this help message

Multi-Terminal Setup:
  Terminal 1: node scripts/inec_voter_auditor.mjs --worker 1
  Terminal 2: node scripts/inec_voter_auditor.mjs --worker 2
      `);
      process.exit(0);
    }
  }
  return options;
}

function copyToClipboard(text) {
  return new Promise((resolve) => {
    // Windows PowerShell Set-Clipboard
    exec(`powershell -NoProfile -Command "Set-Clipboard -Value '${text.replace(/'/g, "''")}'"`, (err) => {
      resolve(!err);
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

class NigeriaElectsClient {
  constructor() {
    this.baseUrl = 'https://check.nigeriaelects.com';
    this.csrfToken = null;
    this.sessionId = null;
    this.cookies = [];
    this.currentState = null;
  }

  getCookieHeader() {
    return this.cookies.map(c => c.split(';')[0]).join('; ');
  }

  updateCookies(response) {
    const rawCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get('set-cookie')];
    if (rawCookies && rawCookies.length) {
      for (const raw of rawCookies) {
        if (!raw) continue;
        const name = raw.split('=')[0];
        this.cookies = this.cookies.filter(c => !c.startsWith(`${name}=`));
        this.cookies.push(raw);
      }
    }
  }

  async fetchApi(endpoint, body = null, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const isGet = body === null;
        const headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NigeriaElectsAuditor/1.0',
          'Accept': 'application/json'
        };
        if (!isGet) {
          headers['content-type'] = 'application/json';
          headers['origin'] = this.baseUrl;
          headers['referer'] = `${this.baseUrl}/register-check`;
          if (this.csrfToken) headers['x-csrf-token'] = this.csrfToken;
        }
        const cookieHdr = this.getCookieHeader();
        if (cookieHdr) headers['cookie'] = cookieHdr;

        const res = await fetch(`${this.baseUrl}/register-check/api/${endpoint}`, {
          method: isGet ? 'GET' : 'POST',
          headers,
          body: isGet ? undefined : JSON.stringify(body),
          signal: AbortSignal.timeout(30000)
        });

        this.updateCookies(res);
        const text = await res.text();

        let json = null;
        try {
          json = JSON.parse(text);
        } catch {
          // Response was HTML (e.g., Cloudflare 502/503/504 or temporary downtime)
          if (attempt < retries) {
            const waitTime = attempt * 5;
            console.warn(`\n⚠️ [NigeriaElects] Transient server response (${res.status}). Retrying in ${waitTime}s (${attempt}/${retries})...`);
            await new Promise(r => setTimeout(r, waitTime * 1000));
            continue;
          }
          throw new Error(`NigeriaElects returned non-JSON response (status ${res.status}): ${text.slice(0, 150)}`);
        }

        if (!res.ok || (json && json.error && !json.state)) {
          if (attempt < retries) {
            const errMsg = json?.error || `HTTP ${res.status}`;
            const waitTime = attempt * 5;
            console.warn(`\n⚠️ [NigeriaElects] Server notice: ${errMsg}. Retrying in ${waitTime}s (${attempt}/${retries})...`);
            await new Promise(r => setTimeout(r, waitTime * 1000));
            continue;
          }
          throw new Error(json?.error || `NigeriaElects HTTP error ${res.status}`);
        }

        return json;
      } catch (err) {
        if (attempt < retries) {
          const waitTime = attempt * 5;
          console.warn(`\n⚠️ [NigeriaElects] Connection notice: ${err.message}. Retrying in ${waitTime}s (${attempt}/${retries})...`);
          await new Promise(r => setTimeout(r, waitTime * 1000));
        } else {
          throw err;
        }
      }
    }
  }

  async bootstrap() {
    this.cookies = []; // Start fresh
    const data = await this.fetchApi('bootstrap');
    if (!data || !data.state) {
      throw new Error(data?.error || 'Bootstrap failed to retrieve state');
    }
    this.csrfToken = data.csrf_token;
    this.sessionId = data.session_id;
    this.currentState = data.state;
    return data;
  }

  async start() {
    const data = await this.fetchApi('start', {
      session_id: this.sessionId,
      state_version: this.currentState?.state_version || 0,
      pu_code: this.currentState?.pu_code || null
    });
    if (!data || !data.state) {
      throw new Error(data?.error || 'Start failed to retrieve task state');
    }
    this.currentState = data.state;
    this.sessionId = data.session_id || this.sessionId;
    return this.currentState;
  }

  async submit(votersCount) {
    const data = await this.fetchApi('submit', {
      session_id: this.sessionId,
      state_version: this.currentState?.state_version,
      pu_code: this.currentState?.pu_code,
      voters_count: String(votersCount)
    });
    if (!data || !data.state) {
      throw new Error(data?.error || 'Submit failed to retrieve receipt state');
    }
    this.currentState = data.state;
    this.sessionId = data.session_id || this.sessionId;
    return this.currentState;
  }

  async continue() {
    const data = await this.fetchApi('continue', {
      session_id: this.sessionId,
      state_version: this.currentState?.state_version,
      pu_code: this.currentState?.pu_code
    });
    if (!data || !data.state) {
      throw new Error(data?.error || 'Continue failed to retrieve next task state');
    }
    this.currentState = data.state;
    this.sessionId = data.session_id || this.sessionId;
    return this.currentState;
  }

  async skip() {
    const data = await this.fetchApi('skip', {
      session_id: this.sessionId,
      state_version: this.currentState?.state_version,
      pu_code: this.currentState?.pu_code
    });
    if (!data || !data.state) {
      throw new Error(data?.error || 'Skip failed to retrieve state');
    }
    this.currentState = data.state;
    this.sessionId = data.session_id || this.sessionId;
    return this.currentState;
  }
}

class InecPortalClient {
  constructor(cookie = '') {
    this.cookie = cookie;
    this.baseUrl = 'https://display.inecnigeria.org';
  }

  hasCookie() {
    return Boolean(this.cookie && this.cookie.trim().length > 0);
  }

  async checkSession() {
    if (!this.hasCookie()) return false;
    try {
      const res = await fetch(`${this.baseUrl}/api/session`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': this.cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        signal: AbortSignal.timeout(10000)
      });
      const data = await res.json();
      return Boolean(data && data.me);
    } catch {
      return false;
    }
  }

  async fetchVoterCount(puCode) {
    if (!this.hasCookie()) return null;
    try {
      // Step 1: Look up polling unit by code to obtain reference
      const lookupRes = await fetch(`${this.baseUrl}/api/pu/by-code/${encodeURIComponent(puCode)}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': this.cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!lookupRes.ok) {
        if (lookupRes.status === 401) {
          console.warn(`\n⚠️ [INEC] Session expired or account reached its 400 PU limit (401 Unauthorized). Please sign in again at https://display.inecnigeria.org/signin`);
        } else if (lookupRes.status === 405) {
          console.warn(`\n⚠️ [INEC] AWS WAF Captcha triggered (405). Complete the check in your browser.`);
        } else if (lookupRes.status === 404) {
          console.warn(`\n⚠️ [INEC] Polling unit ${puCode} not found on INEC database (404).`);
        } else if (lookupRes.status === 429) {
          console.warn(`\n⚠️ [INEC] Rate limited (429). Pausing...`);
        } else {
          console.warn(`\n⚠️ [INEC] Lookup returned HTTP ${lookupRes.status}`);
        }
        return null;
      }

      const puMeta = await lookupRes.json();
      const puRef = puMeta.ref;
      if (!puRef) return null;

      // Step 2: Query register for that polling unit reference
      const regRes = await fetch(`${this.baseUrl}/api/pu/${encodeURIComponent(puRef)}/register`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': this.cookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!regRes.ok) {
        return null;
      }

      const regData = await regRes.json();
      if (regData && regData.pu && typeof regData.pu.total === 'number') {
        return regData.pu.total;
      }
      return null;
    } catch (err) {
      console.warn(`[INEC] Error querying ${puCode}:`, err.message);
      return null;
    }
  }
}



async function main() {
  const options = parseArgs();

  console.log('====================================================');
  console.log(`   INEC POLLING UNIT VOTER AUDITOR (WORKER #${options.worker})     `);
  console.log('====================================================');

  const inec = new InecPortalClient(options.cookie);
  const ne = new NigeriaElectsClient();

  if (inec.hasCookie()) {
    console.log(`[Worker #${options.worker}] Checking INEC session authentication...`);
    const loggedIn = await inec.checkSession();
    if (loggedIn) {
      console.log(`✅ [Worker #${options.worker}] INEC session authenticated! Running in FULL AUTONOMOUS MODE.`);
    } else {
      console.log(`⚠️ [Worker #${options.worker}] INEC session cookie invalid or expired. Running in ASSISTED MODE.`);
    }
  } else {
    console.log(`ℹ️ [Worker #${options.worker}] No cookie found in INEC_COOKIE_${options.worker}. Running in ASSISTED MODE.`);
    console.log('   The script will copy PU codes to your clipboard automatically!');
  }

  console.log('\n[NigeriaElects] Initializing session...');
  let state = null;
  let initSuccess = false;
  for (let initTry = 1; initTry <= 5; initTry++) {
    try {
      await ne.bootstrap();
      state = await ne.start();
      initSuccess = true;
      break;
    } catch (err) {
      console.warn(`⚠️ [NigeriaElects] Initialization attempt ${initTry}/5 failed: ${err.message}. Retrying in 4s...`);
      await new Promise(r => setTimeout(r, 4000));
    }
  }

  if (!initSuccess) {
    console.error('❌ Could not initialize session with NigeriaElects after 5 attempts. Please check your internet connection and try again.');
    process.exit(1);
  }

  let processedCount = 0;

  while (processedCount < options.limit) {
    try {
      if (state.phase !== 'task' || !state.pu_code) {
        console.log('No task currently available or session finished. Trying again...');
        await new Promise(r => setTimeout(r, 2000));
        state = await ne.start();
        if (state.phase !== 'task') break;
      }

      const puCode = state.pu_code;
      console.log(`\n----------------------------------------------------`);
      console.log(`📌 Polling Unit #${processedCount + 1}: [ ${puCode} ]`);

      let voterCount = null;

      // Try autonomous fetch if INEC client has credentials
      if (inec.hasCookie()) {
        process.stdout.write('   Fetching voter count from INEC portal... ');
        voterCount = await inec.fetchVoterCount(puCode);
        if (voterCount !== null) {
          console.log(`Found: ${voterCount} registered voters.`);
        } else {
          console.log('Falling back to assisted input.');
        }
      }

      // Fall back to assisted interactive mode if no count obtained
      if (voterCount === null) {
        const copied = await copyToClipboard(puCode);
        if (copied) {
          console.log(`📋 Copied code "${puCode}" to your clipboard!`);
        }
        console.log(`🔗 Go to: https://display.inecnigeria.org/find`);
        console.log(`   Paste the code into the PU Code box and click "Find".`);
        
        const answer = await askQuestion(`👉 Enter Registered Voters count (or 's' to skip, 'q' to quit): `);
        const cleanAnswer = answer.trim();

        if (cleanAnswer.toLowerCase() === 'q') {
          console.log('Exiting auditor.');
          break;
        }

        if (cleanAnswer.toLowerCase() === 's' || cleanAnswer === '') {
          console.log('Skipping polling unit...');
          state = await ne.skip();
          continue;
        }

        const num = parseInt(cleanAnswer.replace(/,/g, ''), 10);
        if (isNaN(num) || num < 0) {
          console.log('❌ Invalid number entered. Skipping this polling unit.');
          state = await ne.skip();
          continue;
        }
        voterCount = num;
      }

      // Submit the voter count to NigeriaElects
      process.stdout.write(`   Submitting ${voterCount} voters to NigeriaElects... `);
      const receipt = await ne.submit(voterCount);
      console.log('Saved! 🎉');

      const location = receipt?.location || {};
      const stateName = location?.state?.name || 'Unknown State';
      const lgaName = location?.lga?.name || 'Unknown LGA';
      const wardName = location?.ward?.name || 'Unknown Ward';
      const puName = location?.pu_name || puCode;
      const count2023 = receipt?.count_2023 ?? null;
      const diff = receipt?.difference ?? null;

      console.log(`   Location: ${stateName} > ${lgaName} > ${wardName}`);
      console.log(`   PU Name : ${puName}`);
      console.log(`   2023 Count: ${count2023 !== null ? count2023.toLocaleString() : 'Unavailable'}`);
      console.log(`   2027 Count: ${voterCount.toLocaleString()}`);
      if (diff !== null) {
        const diffStr = diff > 0 ? `+${diff.toLocaleString()} (increase)` : diff < 0 ? `${diff.toLocaleString()} (decrease)` : '0 (unchanged)';
        console.log(`   Difference: ${diffStr}`);
      }

      // Save record
      const entry = {
        pu_code: puCode,
        state: stateName,
        lga: lgaName,
        ward: wardName,
        pu_name: puName,
        count_2023: count2023,
        count_2027: voterCount,
        difference: diff,
        status: receipt?.outcome || 'added',
        recorded_at: new Date().toISOString()
      };
      recordResult(entry);
      console.log(`   💾 Record saved to ${CSV_FILE} & ${DOC_FILE}`);

      processedCount++;

      if (processedCount < options.limit) {
        if (options.delay > 0) {
          await new Promise(r => setTimeout(r, options.delay));
        }
        process.stdout.write('   Requesting next polling unit... ');
        state = await ne.continue();
        console.log('Ready.');
      }
    } catch (loopErr) {
      console.warn(`\n⚠️ Transient error on this unit: ${loopErr.message}. Re-connecting in 5s...`);
      await new Promise(r => setTimeout(r, 5000));
      try {
        await ne.bootstrap();
        state = await ne.start();
      } catch (recoverErr) {
        console.warn(`Recovery attempt failed: ${recoverErr.message}. Will try next cycle.`);
      }
    }
  }

  rl.close();
  console.log('\n====================================================');
  console.log(`✅ Session completed. Total PUs processed: ${processedCount}`);
  console.log(`📁 CSV Log  : ${CSV_FILE}`);
  console.log(`📁 JSON Data: ${JSON_FILE}`);
  console.log(`📄 Audit Doc: ${DOC_FILE}`);
  console.log('====================================================');
}

main().catch((err) => {
  console.error('\n❌ Unhandled error:', err);
  rl.close();
  process.exit(1);
});

