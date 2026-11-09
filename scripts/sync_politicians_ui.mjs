import fs from 'fs';

const politicians = JSON.parse(fs.readFileSync('data/politicians_registry.json', 'utf8'));
const politiciansJson = JSON.stringify(politicians, null, 2);

function updateFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace category tabs section
  const searchPattern = '<div class="flex items-center space-x-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs shadow-xs min-w-max">';
  const tabStart = html.indexOf(searchPattern);
  
  if (tabStart !== -1) {
    const tabEnd = html.indexOf('</div>', tabStart) + 6;
    const newTabs = `<div class="flex items-center space-x-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs shadow-xs min-w-max">
          <button onclick="setCategoryFilter('ALL')" id="tab-cat-ALL" class="cat-tab px-3 py-1.5 rounded-lg font-bold bg-slate-200 text-slate-900 shadow-xs transition">
            All VIPs (<span id="cat-count-all">0</span>)
          </button>
          <button onclick="setCategoryFilter('ALARM_ONLY')" id="tab-cat-ALARM_ONLY" class="cat-tab px-3 py-1.5 rounded-lg font-bold text-rose-700 hover:bg-rose-50 transition">
            🚨 Raised Alarms (<span id="cat-count-alarms">0</span>)
          </button>
          <button onclick="setCategoryFilter('ministers')" id="tab-cat-ministers" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            💼 Ministers (<span id="cat-count-ministers">0</span>)
          </button>
          <button onclick="setCategoryFilter('senators')" id="tab-cat-senators" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            📜 10th Senate (<span id="cat-count-senators">0</span>)
          </button>
          <button onclick="setCategoryFilter('reps')" id="tab-cat-reps" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            🏛️ House of Reps (<span id="cat-count-reps">0</span>)
          </button>
          <button onclick="setCategoryFilter('governors')" id="tab-cat-governors" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            👑 Governors (<span id="cat-count-governors">0</span>)
          </button>
          <button onclick="setCategoryFilter('presidency')" id="tab-cat-presidency" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            🦅 Presidency (<span id="cat-count-presidency">0</span>)
          </button>
          <button onclick="setCategoryFilter('candidates')" id="tab-cat-candidates" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            🗳️ Candidates (<span id="cat-count-candidates">0</span>)
          </button>
          <button onclick="setCategoryFilter('past_leaders')" id="tab-cat-past_leaders" class="cat-tab px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-slate-900 transition">
            ⌛ Former VIPs (<span id="cat-count-past">0</span>)
          </button>
        </div>`;
    html = html.slice(0, tabStart) + newTabs + html.slice(tabEnd);
  }

  // Replace category tab counters update in updateSummaryCards
  const oldCounterMarker = '// Category tab counters';
  const oldCounterBlockStart = html.indexOf(oldCounterMarker);
  if (oldCounterBlockStart !== -1) {
    const oldCounterBlockEnd = html.indexOf('function populateStateDropdown()', oldCounterBlockStart);
    if (oldCounterBlockEnd !== -1) {
      const newCounters = `// Category tab counters
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setVal('cat-count-all', total);
      setVal('cat-count-alarms', critical + warnings + purges);
      setVal('cat-count-ministers', politiciansData.filter(p => p.category === 'ministers').length);
      setVal('cat-count-senators', politiciansData.filter(p => p.category === 'senators').length);
      setVal('cat-count-reps', politiciansData.filter(p => p.category === 'reps').length);
      setVal('cat-count-governors', politiciansData.filter(p => p.category === 'governors').length);
      setVal('cat-count-presidency', politiciansData.filter(p => p.category === 'presidency').length);
      setVal('cat-count-candidates', politiciansData.filter(p => p.category === 'candidates').length);
      setVal('cat-count-past', politiciansData.filter(p => p.category === 'past_leaders').length);
    }

    `;
      html = html.slice(0, oldCounterBlockStart) + newCounters + html.slice(oldCounterBlockEnd);
    }
  }

  // Replace window.INITIAL_POLITICIANS = [...];
  const initStart = html.indexOf('window.INITIAL_POLITICIANS = [');
  if (initStart !== -1) {
    const initEnd = html.indexOf('];', initStart) + 2;
    html = html.slice(0, initStart) + 'window.INITIAL_POLITICIANS = ' + politiciansJson + ';' + html.slice(initEnd);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateFile('politicians.html');
updateFile('public/politicians.html');
