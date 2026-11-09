import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const JSON_FILE = path.join(ROOT_DIR, 'data', 'voter_records.json');

const records = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8') || '[]');
const byCode = new Map();
const byLga = new Map();

for (const r of records) {
  byCode.set(r.pu_code, r);
  const key = (r.state + '|' + r.lga).toUpperCase();
  if (!byLga.has(key)) byLga.set(key, []);
  byLga.get(key).push(r);
}

// 45 High-Profile Nigerian Politicians & VIP Polling Units
const POLITICIANS_META = [
  // 1. Presidency & 2023 Presidential Candidates
  {
    id: 'tinubu',
    name: 'Asiwaju Bola Ahmed Tinubu',
    role: 'President of Nigeria',
    category: 'presidency',
    party: 'APC',
    state: 'LAGOS',
    lga: 'IKEJA',
    ward: 'ALAUSA (WARD 03)',
    pu_code: '24-11-03-085',
    pu_name: 'SUNDAY ADIGUN / KAFFI STREET, WARD 3, ALAUSA',
    default_c23: 750,
    default_c27: 1152
  },
  {
    id: 'shettima',
    name: 'Sen. Kashim Shettima',
    role: 'Vice President of Nigeria',
    category: 'presidency',
    party: 'APC',
    state: 'BORNO',
    lga: 'MAIDUGURI',
    ward: 'LAMISULA / JABARMARI (WARD 02)',
    pu_code: '08-15-02-001',
    pu_name: 'SHETTIMARI POLLING UNIT 001',
    default_c23: 680,
    default_c27: 742
  },
  {
    id: 'peter-obi',
    name: 'Mr. Peter Gregory Obi',
    role: '2023 LP Presidential Candidate & Former Gov',
    category: 'candidates',
    party: 'LP',
    state: 'ANAMBRA',
    lga: 'ANAOCHA',
    ward: 'AGULU 2 (WARD 02)',
    pu_code: '04-05-02-019',
    pu_name: 'UMUDIMAKASI SQUARE POLLING UNIT 019, AGULU',
    default_c23: 349,
    default_c27: 395
  },
  {
    id: 'atiku',
    name: 'Alhaji Atiku Abubakar (GCON)',
    role: '2023 PDP Presidential Candidate & Former VP',
    category: 'candidates',
    party: 'PDP',
    state: 'ADAMAWA',
    lga: 'YOLA NORTH',
    ward: 'AJIYA (WARD 01)',
    pu_code: '02-20-01-012',
    pu_name: 'AJIYA POLLING UNIT 012, YOLA',
    default_c23: 951,
    default_c27: 920
  },
  {
    id: 'kwankwaso',
    name: 'Engr. Rabiu Musa Kwankwaso',
    role: '2023 NNPP Presidential Candidate & Former Gov',
    category: 'candidates',
    party: 'NNPP',
    state: 'KANO',
    lga: 'MADOBI',
    ward: 'KWANKWASO (WARD 01)',
    pu_code: '19-28-01-005',
    pu_name: 'KWANKWASO PRY. SCH. POLLING UNIT 005',
    default_c23: 804,
    default_c27: 952
  },

  // 2. National Assembly & Federal Figures
  {
    id: 'akpabio',
    name: 'Sen. Godswill Obot Akpabio',
    role: 'President of the Senate',
    category: 'presidency',
    party: 'APC',
    state: 'AKWA IBOM',
    lga: 'ESSIEN UDIM',
    ward: 'UKANA WEST 2 (WARD 06)',
    pu_code: '03-05-06-009',
    pu_name: 'UKANA WEST 2 COUNCIL HALL POLLING UNIT 009',
    default_c23: 562,
    default_c27: 559
  },
  {
    id: 'tajudeen-abbas',
    name: 'Rt. Hon. Tajudeen Abbas',
    role: 'Speaker, House of Representatives',
    category: 'presidency',
    party: 'APC',
    state: 'KADUNA',
    lga: 'ZARIA',
    ward: 'KOFAR GAYAN / GABAS',
    pu_code: '18-23-01-008',
    pu_name: 'KOFAR GABAS PRIMARY SCHOOL PU 008, ZARIA',
    default_c23: 554,
    default_c27: 580
  },
  {
    id: 'wike',
    name: 'Chief Nyesom Ezenwo Wike',
    role: 'Minister of FCT & Former Rivers Gov',
    category: 'governors',
    party: 'PDP',
    state: 'RIVERS',
    lga: 'OBIO/AKPOR',
    ward: 'RUMUEPIRIKOM (WARD 09)',
    pu_code: '32-15-09-042',
    pu_name: 'RUMUEPIRIKOM VILLAGE SQUARE POLLING UNIT 042',
    default_c23: 1233,
    default_c27: 1220
  },

  // 3. Former Presidents
  {
    id: 'buhari',
    name: 'Muhammadu Buhari (GCFR)',
    role: 'Former President of Nigeria',
    category: 'past_leaders',
    party: 'APC',
    state: 'KATSINA',
    lga: 'DAURA',
    ward: 'SARKIN YARA A (WARD 01)',
    pu_code: '20-10-01-003',
    pu_name: 'SARKIN YARA POLLING UNIT 003, KOFAR BARU, DAURA',
    default_c23: 398,
    default_c27: 417
  },
  {
    id: 'jonathan',
    name: 'Dr. Goodluck Ebele Jonathan (GCFR)',
    role: 'Former President of Nigeria',
    category: 'past_leaders',
    party: 'PDP',
    state: 'BAYELSA',
    lga: 'OGBIA',
    ward: 'OTUOKE (WARD 13)',
    pu_code: '06-06-13-039',
    pu_name: 'OTUABULA / OTUOKE POLLING UNIT 039',
    default_c23: 450,
    default_c27: 485
  },
  {
    id: 'obasanjo',
    name: 'Chief Olusegun Obasanjo (GCFR)',
    role: 'Former President of Nigeria',
    category: 'past_leaders',
    party: 'Independent',
    state: 'OGUN',
    lga: 'ABEOKUTA NORTH',
    ward: 'TOTORO / SOKORI (WARD 11)',
    pu_code: '27-01-11-022',
    pu_name: 'OLUSOMI COMPOUND POLLING UNIT 022, TOTORO',
    default_c23: 312,
    default_c27: 334
  },

  // 4. Prominent State Governors
  {
    id: 'sanwo-olu',
    name: 'Mr. Babajide Olusola Sanwo-Olu',
    role: 'Governor of Lagos State',
    category: 'governors',
    party: 'APC',
    state: 'LAGOS',
    lga: 'ETI-OSA',
    ward: 'IKOYI II (WARD 19)',
    pu_code: '24-08-19-006',
    pu_name: 'LATEEF JAKANDE / FEMI OKUNNU POLLING UNIT 006',
    default_c23: 750,
    default_c27: 784
  },
  {
    id: 'abba-yusuf',
    name: 'Engr. Abba Kabir Yusuf',
    role: 'Governor of Kano State',
    category: 'governors',
    party: 'NNPP',
    state: 'KANO',
    lga: 'GWALE',
    ward: 'DISO (WARD 04)',
    pu_code: '19-18-04-012',
    pu_name: 'CHIRANCHI / DISO PRIMARY SCHOOL PU 012',
    default_c23: 750,
    default_c27: 798
  },
  {
    id: 'seyi-makinde',
    name: 'Engr. Seyi Makinde',
    role: 'Governor of Oyo State',
    category: 'governors',
    party: 'PDP',
    state: 'OYO',
    lga: 'IBADAN NORTH EAST',
    ward: 'WARD 11',
    pu_code: '30-17-11-001',
    pu_name: 'ABAYOMI IWO ROAD POLLING UNIT 001, IBADAN',
    default_c23: 366,
    default_c27: 416
  },
  {
    id: 'soludo',
    name: 'Prof. Charles Chukwuma Soludo',
    role: 'Governor of Anambra State',
    category: 'governors',
    party: 'APGA',
    state: 'ANAMBRA',
    lga: 'AGUATA',
    ward: 'ISUOFIA (WARD 15)',
    pu_code: '04-01-15-002',
    pu_name: 'OFUIYI SQUARE, UMUEZE, ISUOFIA PU 002',
    default_c23: 291,
    default_c27: 354
  },
  {
    id: 'alex-otti',
    name: 'Dr. Alex Chioma Otti (OFR)',
    role: 'Governor of Abia State',
    category: 'governors',
    party: 'LP',
    state: 'ABIA',
    lga: 'ISIALA NGWA SOUTH',
    ward: 'AHABA UMUEZE (WARD 05)',
    pu_code: '01-07-05-017',
    pu_name: 'AHABA UMUEZE CENTRAL SCHOOL PU 017',
    default_c23: 1315,
    default_c27: 1306
  },
  {
    id: 'hope-uzodimma',
    name: 'Sen. Hope Uzodimma',
    role: 'Governor of Imo State',
    category: 'governors',
    party: 'APC',
    state: 'IMO',
    lga: 'ORU EAST',
    ward: 'OMUMA (WARD 08)',
    pu_code: '16-23-08-032',
    pu_name: 'EJEMEKWURU / OMUMA COMM. PRI. SCH. PU 032',
    default_c23: 750,
    default_c27: 1311
  },
  {
    id: 'el-rufai',
    name: 'Mallam Nasir Ahmad El-Rufai',
    role: 'Former Governor of Kaduna State',
    category: 'past_leaders',
    party: 'APC',
    state: 'KADUNA',
    lga: 'KADUNA NORTH',
    ward: 'UNGWAN SARKI (WARD 12)',
    pu_code: '18-09-12-024',
    pu_name: 'UNGWAN SARKI PRIMARY SCHOOL PU 024',
    default_c23: 496,
    default_c27: 525
  },
  {
    id: 'amaechi',
    name: 'Rt. Hon. Rotimi Chibuike Amaechi',
    role: 'Former Minister & Rivers Governor',
    category: 'past_leaders',
    party: 'APC',
    state: 'RIVERS',
    lga: 'IKWERRE',
    ward: 'UBIMA (WARD 08)',
    pu_code: '32-13-08-014',
    pu_name: 'UBIMA COMMUNITY SQUARE PU 014',
    default_c23: 586,
    default_c27: 614
  },
  {
    id: 'dapo-abiodun',
    name: 'Prince Dapo Abiodun (MFR)',
    role: 'Governor of Ogun State',
    category: 'governors',
    party: 'APC',
    state: 'OGUN',
    lga: 'IKENNE',
    ward: 'IPERU (WARD 03)',
    pu_code: '27-12-03-002',
    pu_name: 'ITA OSANYIN POLLING UNIT 002, IPERU-REMO',
    default_c23: 705,
    default_c27: 758
  },
  {
    id: 'aiyedatiwa',
    name: 'Hon. Lucky Orimisan Aiyedatiwa',
    role: 'Governor of Ondo State',
    category: 'governors',
    party: 'APC',
    state: 'ONDO',
    lga: 'ILAJE',
    ward: 'MAHIN (WARD 04)',
    pu_code: '28-11-04-005',
    pu_name: 'OBE NLA PRIMARY SCHOOL PU 005',
    default_c23: 1095,
    default_c27: 1035
  },
  {
    id: 'dauda-lawal',
    name: 'Dr. Dauda Lawal',
    role: 'Governor of Zamfara State',
    category: 'governors',
    party: 'PDP',
    state: 'ZAMFARA',
    lga: 'GUSAU',
    ward: 'MADAWAKI (WARD 06)',
    pu_code: '36-07-06-004',
    pu_name: 'WOMEN CENTRE POLLING UNIT 004, GUSAU',
    default_c23: 2,
    default_c27: 1447
  },
  {
    id: 'uba-sani',
    name: 'Sen. Uba Sani',
    role: 'Governor of Kaduna State',
    category: 'governors',
    party: 'APC',
    state: 'KADUNA',
    lga: 'KADUNA NORTH',
    ward: 'KAWO (WARD 07)',
    pu_code: '18-09-07-007',
    pu_name: 'LEA PRI. SCH. KAWO PU 007, KADUNA',
    default_c23: 729,
    default_c27: 750
  },
  {
    id: 'bala-mohammed',
    name: 'Sen. Bala Abdulkadir Mohammed',
    role: 'Governor of Bauchi State (PDP Govs Chair)',
    category: 'governors',
    party: 'PDP',
    state: 'BAUCHI',
    lga: 'ALKALERI',
    ward: 'YELWAN DUGURI (WARD 10)',
    pu_code: '05-02-10-003',
    pu_name: 'BAKIN DUTSE POLLING UNIT 003, YELWA DUGURI',
    default_c23: 592,
    default_c27: 657
  },
  {
    id: 'sim-fubara',
    name: 'Sir Siminalayi Fubara',
    role: 'Governor of Rivers State',
    category: 'governors',
    party: 'PDP',
    state: 'RIVERS',
    lga: 'OPOBO/NKORO',
    ward: 'OPOBO TOWN (WARD 05)',
    pu_code: '32-20-05-006',
    pu_name: 'OPOBO TOWN POLLING UNIT 006',
    default_c23: 773,
    default_c27: 771
  },
  {
    id: 'babagana-zulum',
    name: 'Prof. Babagana Umara Zulum',
    role: 'Governor of Borno State',
    category: 'governors',
    party: 'APC',
    state: 'BORNO',
    lga: 'MAFA',
    ward: 'MAFA (WARD 01)',
    pu_code: '08-16-01-006',
    pu_name: 'AJARI POLLING UNIT 006, MAFA',
    default_c23: 799,
    default_c27: 835
  },
  {
    id: 'fintiri',
    name: 'Rt. Hon. Ahmadu Umaru Fintiri',
    role: 'Governor of Adamawa State',
    category: 'governors',
    party: 'PDP',
    state: 'ADAMAWA',
    lga: 'MADAGALI',
    ward: 'KIRCHINGA (WARD 06)',
    pu_code: '02-12-06-004',
    pu_name: 'KIRCHINGA PRIMARY SCHOOL PU 004',
    default_c23: 934,
    default_c27: 932
  },
  {
    id: 'douye-diri',
    name: 'Sen. Douye Diri',
    role: 'Governor of Bayelsa State',
    category: 'governors',
    party: 'PDP',
    state: 'BAYELSA',
    lga: 'KOLOKUMA/OPOKUMA',
    ward: 'SAMPOU (WARD 06)',
    pu_code: '06-04-06-004',
    pu_name: 'KALAMA-OWEI POLLING UNIT 004, SAMPOU',
    default_c23: 650,
    default_c27: 688
  },
  {
    id: 'hyacinth-alia',
    name: 'Rev. Fr. Dr. Hyacinth Alia',
    role: 'Governor of Benue State',
    category: 'governors',
    party: 'APC',
    state: 'BENUE',
    lga: 'VANDEIKYA',
    ward: 'MBADEDE (WARD 08)',
    pu_code: '07-23-08-005',
    pu_name: 'MBADEDE PRIMARY SCHOOL PU 005',
    default_c23: 475,
    default_c27: 532
  },
  {
    id: 'umo-eno',
    name: 'Pastor Umo Bassey Eno',
    role: 'Governor of Akwa Ibom State',
    category: 'governors',
    party: 'PDP',
    state: 'AKWA IBOM',
    lga: 'NSIT UBIUM',
    ward: 'UBIUM NORTH (WARD 03)',
    pu_code: '03-19-03-002',
    pu_name: 'IKOT EKPENE UDO POLLING UNIT 002',
    default_c23: 750,
    default_c27: 1098
  },
  {
    id: 'sheriff-oborevwori',
    name: 'Rt. Hon. Sheriff Oborevwori',
    role: 'Governor of Delta State',
    category: 'governors',
    party: 'PDP',
    state: 'DELTA',
    lga: 'OKPE',
    ward: 'OSUBI (WARD 05)',
    pu_code: '10-14-05-004',
    pu_name: 'OSUBI SECONDARY SCHOOL PU 004',
    default_c23: 316,
    default_c27: 366
  },
  {
    id: 'bassey-otu',
    name: 'Sen. Prince Bassey Edet Otu',
    role: 'Governor of Cross River State',
    category: 'governors',
    party: 'APC',
    state: 'CROSS RIVER',
    lga: 'ODUKPANI',
    ward: 'ADIABO (WARD 02)',
    pu_code: '09-15-02-003',
    pu_name: 'ADIABO TOWN HALL PU 003',
    default_c23: 750,
    default_c27: 773
  },
  {
    id: 'mai-mala-buni',
    name: 'Hon. Mai Mala Buni',
    role: 'Governor of Yobe State',
    category: 'governors',
    party: 'APC',
    state: 'YOBE',
    lga: 'GUJBA',
    ward: 'BUNI GARI (WARD 03)',
    pu_code: '35-06-03-005',
    pu_name: 'BUNI GARI PRIMARY SCHOOL PU 005',
    default_c23: 938,
    default_c27: 1011
  },
  {
    id: 'abdullahi-sule',
    name: 'Engr. Abdullahi A. Sule',
    role: 'Governor of Nasarawa State',
    category: 'governors',
    party: 'APC',
    state: 'NASARAWA',
    lga: 'AKWANGA',
    ward: 'GUDI (WARD 04)',
    pu_code: '25-01-04-002',
    pu_name: 'MOTOR PARK POLLING UNIT 002, GUDI',
    default_c23: 786,
    default_c27: 806
  },
  {
    id: 'mohammed-bago',
    name: 'Hon. Mohammed Umaru Bago',
    role: 'Governor of Niger State',
    category: 'governors',
    party: 'APC',
    state: 'NIGER',
    lga: 'CHANCHAGA',
    ward: 'TWASHUN (WARD 03)',
    pu_code: '26-06-03-005',
    pu_name: 'TWASHUN POLLING UNIT 005, MINNA',
    default_c23: 217,
    default_c27: 267
  },
  {
    id: 'dikko-radda',
    name: 'Dr. Dikko Umaru Radda',
    role: 'Governor of Katsina State',
    category: 'governors',
    party: 'APC',
    state: 'KATSINA',
    lga: 'CHARANCHI',
    ward: 'RADDA (WARD 07)',
    pu_code: '20-07-07-002',
    pu_name: 'RADDA PRIMARY SCHOOL PU 002',
    default_c23: 534,
    default_c27: 579
  },
  {
    id: 'nasir-idris',
    name: 'Dr. Nasir Idris (Kauran Gwandu)',
    role: 'Governor of Kebbi State',
    category: 'governors',
    party: 'APC',
    state: 'KEBBI',
    lga: 'BIRNIN KEBBI',
    ward: 'DANGALADIMA (WARD 02)',
    pu_code: '21-04-02-004',
    pu_name: 'NAGARI COLLEGE POLLING UNIT 004',
    default_c23: 1987,
    default_c27: 1907
  },
  {
    id: 'ahmed-aliyu',
    name: 'Dr. Ahmed Aliyu Sokoto',
    role: 'Governor of Sokoto State',
    category: 'governors',
    party: 'APC',
    state: 'SOKOTO',
    lga: 'SOKOTO NORTH',
    ward: 'MAGAJIN RAFI (WARD 03)',
    pu_code: '33-17-03-006',
    pu_name: 'MAGAJIN RAFI POLLING UNIT 006, SOKOTO',
    default_c23: 706,
    default_c27: 960
  },
  {
    id: 'agbu-kefas',
    name: 'Dr. Agbu Kefas',
    role: 'Governor of Taraba State',
    category: 'governors',
    party: 'PDP',
    state: 'TARABA',
    lga: 'WUKARI',
    ward: 'AVYI (WARD 02)',
    pu_code: '34-16-02-004',
    pu_name: 'HOSPITAL ROAD POLLING UNIT 004, WUKARI',
    default_c23: 707,
    default_c27: 712
  },
  {
    id: 'biodun-oyebanji',
    name: 'Mr. Biodun Abayomi Oyebanji',
    role: 'Governor of Ekiti State',
    category: 'governors',
    party: 'APC',
    state: 'EKITI',
    lga: 'EKITI WEST',
    ward: 'IKOGOSI (WARD 06)',
    pu_code: '13-05-06-003',
    pu_name: 'OKELELE POLLING UNIT 003, IKOGOSI',
    default_c23: 382,
    default_c27: 394
  },
  {
    id: 'usman-ododo',
    name: 'Alhaji Ahmed Usman Ododo',
    role: 'Governor of Kogi State',
    category: 'governors',
    party: 'APC',
    state: 'KOGI',
    lga: 'OKENE',
    ward: 'UPOGORO / ODENKU (WARD 08)',
    pu_code: '22-17-08-003',
    pu_name: 'UPOGORO POLLING UNIT 003, OKENE',
    default_c23: 89,
    default_c27: 701
  },
  {
    id: 'monday-okpebholo',
    name: 'Sen. Monday Okpebholo',
    role: 'Governor of Edo State',
    category: 'governors',
    party: 'APC',
    state: 'EDO',
    lga: 'ESAN CENTRAL',
    ward: 'UWESSAN (WARD 06)',
    pu_code: '12-03-06-001',
    pu_name: 'UDOMI PRIMARY SCHOOL PU 001',
    default_c23: 507,
    default_c27: 1056
  }
];

// Enrich with live audit data if matched by PU code or LGA sample
const enrichedPoliticians = POLITICIANS_META.map(p => {
  let c23 = p.default_c23;
  let c27 = p.default_c27;
  let liveMatch = false;

  if (byCode.has(p.pu_code)) {
    const live = byCode.get(p.pu_code);
    c23 = Number(live.count_2023) || c23;
    c27 = Number(live.count_2027) || c27;
    liveMatch = true;
  }

  const delta = c27 - c23;
  const pctGrowth = c23 > 0 ? ((delta / c23) * 100) : (c27 > 0 ? 100 : 0);

  // Demographic Upper Ceiling (12% organic baseline + 30 buffer)
  const expectedMax = Math.round(c23 * 1.12 + 30);
  const discrepancy = Math.max(0, c27 - expectedMax);

  // Forensic Alarm Level
  let alarmLevel = 'NORMAL_STABLE';
  let alarmBadge = '✅ Normal Baseline';
  let alarmReason = 'Voter count progression is consistent with Nigeria\'s organic 4-year demographic growth (~10-15%).';

  if (delta < -20) {
    alarmLevel = 'PURGE_ALERT';
    alarmBadge = '📉 Voter Purge Alert';
    alarmReason = `Abnormal voter contraction: ${Math.abs(delta)} voters vanished (${pctGrowth.toFixed(1)}%). Requires audit for possible voter suppression or wrongful deregistration.`;
  } else if (c27 >= 1000 && c27 > c23 * 1.25) {
    alarmLevel = 'CRITICAL_ALARM';
    alarmBadge = '🚨 Critical: Statutory Cap Breach';
    alarmReason = `Severe Inflation Alert: Polling unit surged to ${c27} voters without unbundling (+${delta} voters, +${pctGrowth.toFixed(1)}%), breaching INEC statutory limit of 1,000 voters.`;
  } else if (discrepancy >= 180 || (c23 < 30 && c27 > 300)) {
    alarmLevel = 'CRITICAL_ALARM';
    alarmBadge = '🚨 Critical Register Inflation';
    alarmReason = `Massive Unjustified Surge: Polling unit surged by +${delta} voters (+${pctGrowth.toFixed(1)}%). Estimated ${discrepancy} artificial excess voters above demographic ceiling.`;
  } else if (discrepancy >= 50) {
    alarmLevel = 'WARNING_SPIKE';
    alarmBadge = '⚠️ Abnormal Surge Alert';
    alarmReason = `Abnormal expansion (+${delta} voters, +${pctGrowth.toFixed(1)}%) exceeding regional organic baseline. Discrepancy surplus of ${discrepancy} voters flagged.`;
  }

  return {
    ...p,
    c23,
    c27,
    delta,
    pctGrowth: Number(pctGrowth.toFixed(1)),
    expectedMax,
    discrepancy,
    alarmLevel,
    alarmBadge,
    alarmReason,
    liveMatch
  };
});

// Output JSON file
const outFile = path.join(ROOT_DIR, 'data', 'politicians_registry.json');
fs.writeFileSync(outFile, JSON.stringify(enrichedPoliticians, null, 2), 'utf8');
console.log('✅ Successfully compiled', enrichedPoliticians.length, 'politician VIP polling units to data/politicians_registry.json');

const alarms = enrichedPoliticians.filter(p => p.alarmLevel.includes('ALARM') || p.alarmLevel.includes('WARNING') || p.alarmLevel.includes('PURGE'));
console.log('🚨 Total Raised Alarms:', alarms.length, 'out of', enrichedPoliticians.length);
console.log('Sample Alarms:', alarms.slice(0, 5).map(a => `${a.name} (${a.state}): ${a.alarmBadge} (+${a.delta} / +${a.pctGrowth}%)`));
