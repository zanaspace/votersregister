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

// Master VIP Database: Presidency, Ministers, Senators, House of Reps, State Governors & Leaders
const ALL_POLITICIANS_RAW = [
  // ==========================================
  // 1. PRESIDENCY & PRESIDENTIAL CANDIDATES
  // ==========================================
  {
    id: 'tinubu',
    name: 'Asiwaju Bola Ahmed Tinubu (GCFR)',
    role: 'President of the Federal Republic of Nigeria',
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
    name: 'Sen. Kashim Shettima (GCON)',
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
    name: 'Mr. Peter Gregory Obi (CON)',
    role: '2023 LP Presidential Candidate & Former Anambra Gov',
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
    role: '2023 PDP Presidential Candidate & Former Vice President',
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
    name: 'Engr. Rabiu Musa Kwankwaso (FNSE)',
    role: '2023 NNPP Presidential Candidate & Former Kano Gov',
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

  // ==========================================
  // 2. FEDERAL MINISTERS (CABINET)
  // ==========================================
  {
    id: 'lateef-fagbemi',
    name: 'Prince Lateef Fagbemi (SAN)',
    role: 'Attorney General of the Federation & Minister of Justice',
    category: 'ministers',
    party: 'APC',
    state: 'KWARA',
    lga: 'OYUN',
    ward: 'IJAGBO (WARD 02)',
    pu_code: '23-14-02-004',
    pu_name: 'IJAGBO COMMUNITY PRIMARY SCHOOL PU 004',
    default_c23: 542,
    default_c27: 588
  },
  {
    id: 'wale-edun',
    name: 'Mr. Olawale Edun',
    role: 'Minister of Finance & Coordinating Minister of Economy',
    category: 'ministers',
    party: 'APC',
    state: 'OGUN',
    lga: 'ABEOKUTA SOUTH',
    ward: 'AKE 1 (WARD 01)',
    pu_code: '27-02-01-005',
    pu_name: 'AKE PALACE OPEN SPACE PU 005',
    default_c23: 490,
    default_c27: 535
  },
  {
    id: 'wike-minister',
    name: 'Chief Nyesom Ezenwo Wike (CON)',
    role: 'Minister of Federal Capital Territory (FCT)',
    category: 'ministers',
    party: 'PDP',
    state: 'RIVERS',
    lga: 'OBIO/AKPOR',
    ward: 'RUMUEPIRIKOM (WARD 09)',
    pu_code: '32-15-09-042',
    pu_name: 'RUMUEPIRIKOM VILLAGE SQUARE PU 042',
    default_c23: 1233,
    default_c27: 1220
  },
  {
    id: 'dave-umahi-min',
    name: 'Engr. David Nweze Umahi (CON)',
    role: 'Minister of Works',
    category: 'ministers',
    party: 'APC',
    state: 'EBONYI',
    lga: 'OHAOZARA',
    ward: 'UMUNAGA (WARD 03)',
    pu_code: '11-11-03-020',
    pu_name: 'OGWE ABOSHI AMATA SQUARE PU 020, UBURU',
    default_c23: 3,
    default_c27: 196
  },
  {
    id: 'festus-keyamo',
    name: 'Mr. Festus Keyamo (SAN, CON)',
    role: 'Minister of Aviation and Aerospace Development',
    category: 'ministers',
    party: 'APC',
    state: 'DELTA',
    lga: 'UVWIE',
    ward: 'EFFURUN 1 (WARD 02)',
    pu_code: '10-23-02-008',
    pu_name: 'EFFURUN MARKET SQUARE PU 008',
    default_c23: 620,
    default_c27: 685
  },
  {
    id: 'dele-alake',
    name: 'Mr. Henry Dele Alake',
    role: 'Minister of Solid Minerals Development',
    category: 'ministers',
    party: 'APC',
    state: 'EKITI',
    lga: 'IKOLE',
    ward: 'ILORO / AYEDUN (WARD 04)',
    pu_code: '13-07-04-006',
    pu_name: 'ST. PAULS PRY. SCH. ILEMO PU 006, IKOLE',
    default_c23: 412,
    default_c27: 438
  },
  {
    id: 'muhammad-pate',
    name: 'Prof. Muhammad Ali Pate',
    role: 'Coordinating Minister of Health and Social Welfare',
    category: 'ministers',
    party: 'Technocrat',
    state: 'BAUCHI',
    lga: 'MISAU',
    ward: 'KUKADI / GUNDUWA (WARD 03)',
    pu_code: '05-14-03-007',
    pu_name: 'CENTRAL PRY. SCH. MISAU PU 007',
    default_c23: 560,
    default_c27: 615
  },
  {
    id: 'bosun-tijani',
    name: 'Dr. Bosun Tijani',
    role: 'Minister of Communications, Innovation & Digital Economy',
    category: 'ministers',
    party: 'Technocrat',
    state: 'OGUN',
    lga: 'IJEBU ODE',
    ward: 'POROGUN 1 (WARD 01)',
    pu_code: '27-10-01-008',
    pu_name: 'ANG. PRY. SCH. POROGUN PU 008',
    default_c23: 380,
    default_c27: 412
  },
  {
    id: 'abubakar-kyari',
    name: 'Sen. Abubakar Kyari',
    role: 'Minister of Agriculture and Food Security',
    category: 'ministers',
    party: 'APC',
    state: 'BORNO',
    lga: 'MOBBAR',
    ward: 'DAMASAK (WARD 01)',
    pu_code: '08-19-01-005',
    pu_name: 'DAMASAK CENTRAL PRY. SCH. PU 005',
    default_c23: 450,
    default_c27: 492
  },
  {
    id: 'adebayo-adelabu',
    name: 'Chief Adebayo Adelabu (FCA)',
    role: 'Minister of Power',
    category: 'ministers',
    party: 'APC',
    state: 'OYO',
    lga: 'IBADAN SOUTH EAST',
    ward: 'KUDETI (WARD 06)',
    pu_code: '30-18-06-004',
    pu_name: 'ST. DAVIDS PRY. SCH. KUDETI PU 004',
    default_c23: 520,
    default_c27: 574
  },
  {
    id: 'badaru-abubakar',
    name: 'Alhaji Mohammed Badaru Abubakar (CON)',
    role: 'Minister of Defence',
    category: 'ministers',
    party: 'APC',
    state: 'JIGAWA',
    lga: 'BABURA',
    ward: 'BABURA (WARD 01)',
    pu_code: '17-02-01-004',
    pu_name: 'KOFAR FADA BABURA PU 004',
    default_c23: 467,
    default_c27: 534
  },
  {
    id: 'bello-matawalle',
    name: 'Dr. Bello Mohammed Matawalle',
    role: 'Minister of State for Defence & Former Zamfara Gov',
    category: 'ministers',
    party: 'APC',
    state: 'ZAMFARA',
    lga: 'MARADUN',
    ward: 'MARADUN SOUTH (WARD 02)',
    pu_code: '36-09-02-003',
    pu_name: 'MODEL PRIMARY SCHOOL MARADUN PU 003',
    default_c23: 740,
    default_c27: 812
  },
  {
    id: 'heineken-lokpobiri',
    name: 'Sen. Heineken Lokpobiri',
    role: 'Minister of State for Petroleum Resources (Oil)',
    category: 'ministers',
    party: 'APC',
    state: 'BAYELSA',
    lga: 'EKEREMOR',
    ward: 'EKEREMOR 1 (WARD 01)',
    pu_code: '06-02-01-004',
    pu_name: 'COMMUNITY PRY. SCH. EKEREMOR PU 004',
    default_c23: 610,
    default_c27: 642
  },
  {
    id: 'atiku-bagudu',
    name: 'Sen. Abubakar Atiku Bagudu (CON)',
    role: 'Minister of Budget and National Planning',
    category: 'ministers',
    party: 'APC',
    state: 'KEBBI',
    lga: 'BIRNIN KEBBI',
    ward: 'DANGALADIMA (WARD 02)',
    pu_code: '21-04-02-007',
    pu_name: 'MAI ALELU PRY. SCH. PU 007, BIRNIN KEBBI',
    default_c23: 630,
    default_c27: 678
  },
  {
    id: 'gboyega-oyetola',
    name: 'Alhaji Adegboyega Oyetola (CON)',
    role: 'Minister of Marine and Blue Economy & Former Osun Gov',
    category: 'ministers',
    party: 'APC',
    state: 'OSUN',
    lga: 'BORIPE',
    ward: 'IRAGBIJI 1 (WARD 01)',
    pu_code: '29-06-01-002',
    pu_name: 'ST. PETERS PRY. SCH. IRAGBIJI PU 002',
    default_c23: 482,
    default_c27: 587
  },
  {
    id: 'yusuf-tuggar',
    name: 'Amb. Yusuf Maitama Tuggar',
    role: 'Minister of Foreign Affairs',
    category: 'ministers',
    party: 'APC',
    state: 'BAUCHI',
    lga: 'GAMAWA',
    ward: 'RAGA (WARD 09)',
    pu_code: '05-07-09-017',
    pu_name: 'BAKORI BAKORI VILLAGE PU 017, GAMAWA',
    default_c23: 592,
    default_c27: 657
  },

  // ==========================================
  // 3. 10TH SENATE (SENATORS)
  // ==========================================
  {
    id: 'akpabio-senate',
    name: 'Sen. Godswill Obot Akpabio (CON)',
    role: 'President of the Senate (Akwa Ibom North West)',
    category: 'senators',
    party: 'APC',
    state: 'AKWA IBOM',
    lga: 'ESSIEN UDIM',
    ward: 'UKANA WEST 2 (WARD 06)',
    pu_code: '03-05-06-009',
    pu_name: 'UKANA WEST 2 COUNCIL HALL PU 009',
    default_c23: 562,
    default_c27: 559
  },
  {
    id: 'barau-jibrin',
    name: 'Sen. Barau I. Jibrin (CON)',
    role: 'Deputy Senate President (Kano North)',
    category: 'senators',
    party: 'APC',
    state: 'KANO',
    lga: 'KABO',
    ward: 'KABO (WARD 01)',
    pu_code: '19-21-01-004',
    pu_name: 'KABO CENTRAL PRIMARY SCHOOL PU 004',
    default_c23: 650,
    default_c27: 720
  },
  {
    id: 'opeyemi-bamidele',
    name: 'Sen. Michael Opeyemi Bamidele',
    role: 'Senate Majority Leader (Ekiti Central)',
    category: 'senators',
    party: 'APC',
    state: 'EKITI',
    lga: 'IREPODUN/IFELODUN',
    ward: 'IYIN 1 (WARD 01)',
    pu_code: '13-10-01-003',
    pu_name: 'ST. MICHAELS PRY. SCH. IYIN-EKITI PU 003',
    default_c23: 404,
    default_c27: 430
  },
  {
    id: 'adams-oshiomhole',
    name: 'Sen. Adams Aliyu Oshiomhole (mni, CON)',
    role: 'Senator for Edo North & Former Edo Governor',
    category: 'senators',
    party: 'APC',
    state: 'EDO',
    lga: 'ETSAKO WEST',
    ward: 'IYAMHO (WARD 10)',
    pu_code: '12-08-10-001',
    pu_name: 'IYAMHO PRIMARY SCHOOL PU 001, UZAIRUE',
    default_c23: 750,
    default_c27: 876
  },
  {
    id: 'aminu-tambuwal',
    name: 'Sen. Aminu Waziri Tambuwal (CFR)',
    role: 'Senator for Sokoto South & Former Speaker / Gov',
    category: 'senators',
    party: 'PDP',
    state: 'SOKOTO',
    lga: 'TAMBUWAL',
    ward: 'TAMBUWAL (WARD 01)',
    pu_code: '33-18-01-006',
    pu_name: 'SHIYAR AHMADU PRIMARY SCHOOL PU 006',
    default_c23: 706,
    default_c27: 765
  },
  {
    id: 'gbenga-daniel',
    name: 'Sen. Otunba Justus Olugbenga Daniel',
    role: 'Senator for Ogun East & Former Ogun Governor',
    category: 'senators',
    party: 'APC',
    state: 'OGUN',
    lga: 'SAGAMU',
    ward: 'ISOKUN (WARD 05)',
    pu_code: '27-18-05-004',
    pu_name: 'BAPTIST PRY. SCH. ISOKUN PU 004, SAGAMU',
    default_c23: 480,
    default_c27: 524
  },
  {
    id: 'seriake-dickson',
    name: 'Sen. Henry Seriake Dickson',
    role: 'Senator for Bayelsa West & Former Bayelsa Gov',
    category: 'senators',
    party: 'PDP',
    state: 'BAYELSA',
    lga: 'SAGBAMA',
    ward: 'TORU-ORUA (WARD 02)',
    pu_code: '06-07-02-005',
    pu_name: 'COMMUNITY SECONDARY SCH. TORU-ORUA PU 005',
    default_c23: 650,
    default_c27: 688
  },
  {
    id: 'danjuma-goje',
    name: 'Sen. Mohammed Danjuma Goje',
    role: 'Senator for Gombe Central & Former Gombe Gov',
    category: 'senators',
    party: 'APC',
    state: 'GOMBE',
    lga: 'AKKO',
    ward: 'KUMO EAST (WARD 03)',
    pu_code: '15-01-03-005',
    pu_name: 'KASUWA CENTRAL PRY. SCH. KUMO PU 005',
    default_c23: 1916,
    default_c27: 3120
  },
  {
    id: 'enyinnaya-abaribe',
    name: 'Sen. Enyinnaya Harcourt Abaribe',
    role: 'Senator for Abia South (Former Senate Minority Leader)',
    category: 'senators',
    party: 'APGA',
    state: 'ABIA',
    lga: 'OBINGWA',
    ward: 'OHANZE (WARD 05)',
    pu_code: '01-09-05-007',
    pu_name: 'UMUOBIOM TOWN HALL PU 007, OHANZE',
    default_c23: 512,
    default_c27: 546
  },
  {
    id: 'orji-uzor-kalu',
    name: 'Sen. Dr. Orji Uzor Kalu (MON)',
    role: 'Senator for Abia North & Former Abia Governor',
    category: 'senators',
    party: 'APC',
    state: 'ABIA',
    lga: 'BENDE',
    ward: 'IGBERE B (WARD 07)',
    pu_code: '01-04-07-003',
    pu_name: 'IGBERE CENTRAL SCHOOL PU 003, BENDE',
    default_c23: 640,
    default_c27: 672
  },
  {
    id: 'abdul-ningi',
    name: 'Sen. Abdul Ahmed Ningi',
    role: 'Senator for Bauchi Central',
    category: 'senators',
    party: 'PDP',
    state: 'BAUCHI',
    lga: 'NINGI',
    ward: 'KUDU / YAMMA (WARD 06)',
    pu_code: '05-15-06-033',
    pu_name: 'JIMI DISPENSARY PU 033, NINGI',
    default_c23: 100,
    default_c27: 288
  },
  {
    id: 'aliyu-wamakko',
    name: 'Sen. Aliyu Magatakarda Wamakko',
    role: 'Senator for Sokoto North & Former Sokoto Gov',
    category: 'senators',
    party: 'APC',
    state: 'SOKOTO',
    lga: 'WAMAKKO',
    ward: 'WAMAKKO (WARD 01)',
    pu_code: '33-22-01-004',
    pu_name: 'SARKIN YAKI PRY. SCH. WAMAKKO PU 004',
    default_c23: 720,
    default_c27: 775
  },
  {
    id: 'ned-nwoko',
    name: 'Sen. Prince Chinedu Munir Nwoko',
    role: 'Senator for Delta North',
    category: 'senators',
    party: 'PDP',
    state: 'DELTA',
    lga: 'ANIOCHA NORTH',
    ward: 'IDUMUJE-UGBOKO (WARD 08)',
    pu_code: '10-02-08-003',
    pu_name: 'IDUMUJE-UGBOKO PRY. SCH. PU 003',
    default_c23: 450,
    default_c27: 498
  },
  {
    id: 'natasha-akpoti',
    name: 'Sen. Barr. Natasha Akpoti-Uduaghan',
    role: 'Senator for Kogi Central',
    category: 'senators',
    party: 'PDP',
    state: 'KOGI',
    lga: 'OKEHI',
    ward: 'IHIMA (WARD 04)',
    pu_code: '22-16-04-006',
    pu_name: 'ORIDE PRY. SCH. IHIMA PU 006',
    default_c23: 520,
    default_c27: 574
  },
  {
    id: 'ireti-kingibe',
    name: 'Sen. Hajiya Ireti Heebah Kingibe',
    role: 'Senator for Federal Capital Territory (FCT)',
    category: 'senators',
    party: 'LP',
    state: 'FCT',
    lga: 'MUNICIPAL',
    ward: 'GARKI (WARD 02)',
    pu_code: '37-06-02-014',
    pu_name: 'AREA 2 OPEN SPACE, GARKI PU 014',
    default_c23: 750,
    default_c27: 825
  },
  {
    id: 'sani-musa',
    name: 'Sen. Mohammed Sani Musa (313)',
    role: 'Senator for Niger East',
    category: 'senators',
    party: 'APC',
    state: 'NIGER',
    lga: 'CHANCHAGA',
    ward: 'MINNA SOUTH (WARD 04)',
    pu_code: '26-06-04-008',
    pu_name: 'POLICE BARRACKS OPEN SPACE PU 008, MINNA',
    default_c23: 630,
    default_c27: 688
  },
  {
    id: 'jimoh-ibrahim',
    name: 'Sen. Dr. Jimoh Ibrahim (CFR)',
    role: 'Senator for Ondo South',
    category: 'senators',
    party: 'APC',
    state: 'ONDO',
    lga: 'OKITIPUPA',
    ward: 'IGBOTAKO 1 (WARD 03)',
    pu_code: '28-14-03-005',
    pu_name: 'COMMUNITY GRAMMAR SCH. IGBOTAKO PU 005',
    default_c23: 510,
    default_c27: 554
  },
  {
    id: 'ali-ndume',
    name: 'Sen. Mohammed Ali Ndume',
    role: 'Senator for Borno South',
    category: 'senators',
    party: 'APC',
    state: 'BORNO',
    lga: 'GWOZA',
    ward: 'GWOZA WAKANE (WARD 01)',
    pu_code: '08-11-01-008',
    pu_name: 'CENTRAL PRY. SCH. GWOZA PU 008',
    default_c23: 799,
    default_c27: 835
  },
  {
    id: 'ahmad-lawan',
    name: 'Sen. Dr. Ahmad Ibrahim Lawan (GCON)',
    role: 'Senator for Yobe North & 9th Senate President',
    category: 'senators',
    party: 'APC',
    state: 'YOBE',
    lga: 'BADE',
    ward: 'GASHUA CENTRAL (WARD 01)',
    pu_code: '35-01-01-004',
    pu_name: 'KATUZU PRIMARY SCHOOL PU 004, GASHUA',
    default_c23: 720,
    default_c27: 768
  },
  {
    id: 'solomon-adeola',
    name: 'Sen. Solomon Olamilekan Adeola (Yayi)',
    role: 'Senator for Ogun West (Senate Appropriations Chair)',
    category: 'senators',
    party: 'APC',
    state: 'OGUN',
    lga: 'YEWA SOUTH',
    ward: 'ILARO 1 (WARD 01)',
    pu_code: '27-19-01-006',
    pu_name: 'COMMUNITY PRY. SCH. ILARO PU 006',
    default_c23: 690,
    default_c27: 755
  },
  {
    id: 'tokunbo-abiru',
    name: 'Sen. Mukhail Adetokunbo Abiru (FCA)',
    role: 'Senator for Lagos East',
    category: 'senators',
    party: 'APC',
    state: 'LAGOS',
    lga: 'IKORODU',
    ward: 'IKORODU 1 (WARD 01)',
    pu_code: '24-12-01-010',
    pu_name: 'AGUDA GRAMMAR SCH. IKORODU PU 010',
    default_c23: 750,
    default_c27: 864
  },

  // ==========================================
  // 4. HOUSE OF REPRESENTATIVES (MEMBERS)
  // ==========================================
  {
    id: 'tajudeen-abbas-reps',
    name: 'Rt. Hon. Abbas Tajudeen (Ph.D, GCON)',
    role: 'Speaker of the House of Representatives',
    category: 'reps',
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
    id: 'benjamin-kalu',
    name: 'Rt. Hon. Benjamin Okezie Kalu',
    role: 'Deputy Speaker, House of Representatives (Bende)',
    category: 'reps',
    party: 'APC',
    state: 'ABIA',
    lga: 'BENDE',
    ward: 'BENDE (WARD 01)',
    pu_code: '01-04-01-006',
    pu_name: 'PRACTICING SCHOOL BENDE PU 006',
    default_c23: 450,
    default_c27: 486
  },
  {
    id: 'julius-ihonvbere',
    name: 'Prof. Julius Omozuanvbo Ihonvbere',
    role: 'House Majority Leader (Owan Federal Constituency)',
    category: 'reps',
    party: 'APC',
    state: 'EDO',
    lga: 'OWAN WEST',
    ward: 'UZESSI (WARD 03)',
    pu_code: '12-14-03-002',
    pu_name: 'UZESSI PRY. SCH. PU 002',
    default_c23: 420,
    default_c27: 455
  },
  {
    id: 'kingsley-chinda',
    name: 'Rt. Hon. Kingsley Ogundu Chinda',
    role: 'House Minority Leader (Obio/Akpor)',
    category: 'reps',
    party: 'PDP',
    state: 'RIVERS',
    lga: 'OBIO/AKPOR',
    ward: 'ELELENWO (WARD 06)',
    pu_code: '32-15-06-015',
    pu_name: 'ELELENWO TOWN HALL PU 015',
    default_c23: 750,
    default_c27: 810
  },
  {
    id: 'aliyu-betara',
    name: 'Rt. Hon. Muktar Aliyu Betara',
    role: 'Member (Biu/Bayo/Shani/Kwaya Kusar, Borno)',
    category: 'reps',
    party: 'APC',
    state: 'BORNO',
    lga: 'BIU',
    ward: 'BIU CENTRAL (WARD 01)',
    pu_code: '08-05-01-008',
    pu_name: 'BIU SOUTH PRIMARY SCHOOL PU 008',
    default_c23: 850,
    default_c27: 915
  },
  {
    id: 'alhassan-doguwa',
    name: 'Hon. Alhassan Ado Garba Doguwa',
    role: 'Member (Tudun Wada/Doguwa, Kano)',
    category: 'reps',
    party: 'APC',
    state: 'KANO',
    lga: 'TUDUN WADA',
    ward: 'JITA (WARD 05)',
    pu_code: '19-41-05-006',
    pu_name: 'NASSARAWAN JITA PRI. SCH PU 006',
    default_c23: 465,
    default_c27: 475
  },
  {
    id: 'james-faleke',
    name: 'Rt. Hon. James Abiodun Faleke',
    role: 'Member (Ikeja Federal Constituency, Lagos)',
    category: 'reps',
    party: 'APC',
    state: 'LAGOS',
    lga: 'IKEJA',
    ward: 'OJODU / AGIDINGBI (WARD 02)',
    pu_code: '24-11-02-062',
    pu_name: 'YAKOYO MARKET PU 062, OJODU, IKEJA',
    default_c23: 750,
    default_c27: 1152
  },
  {
    id: 'babajimi-benson',
    name: 'Hon. Babajimi Adegoke Benson',
    role: 'Member (Ikorodu Federal Constituency, Lagos)',
    category: 'reps',
    party: 'APC',
    state: 'LAGOS',
    lga: 'IKORODU',
    ward: 'IKORODU 2 (WARD 02)',
    pu_code: '24-12-02-008',
    pu_name: 'SHAMS-EL-DEEN PRY. SCH. IKORODU PU 008',
    default_c23: 750,
    default_c27: 840
  },
  {
    id: 'bamidele-salam',
    name: 'Hon. Bamidele Salam',
    role: 'Member (Ede North/South/Egbedore/Ejigbo, Osun)',
    category: 'reps',
    party: 'PDP',
    state: 'OSUN',
    lga: 'EDE NORTH',
    ward: 'EDE WARD 06',
    pu_code: '29-07-06-010',
    pu_name: 'OLAOLU N/P SCHOOL PU 010, EDE NORTH',
    default_c23: 482,
    default_c27: 587
  },
  {
    id: 'ginger-onwusibe',
    name: 'Hon. Ginger Obinna Onwusibe',
    role: 'Member (Isiala Ngwa North/South, Abia)',
    category: 'reps',
    party: 'LP',
    state: 'ABIA',
    lga: 'ISIALA NGWA NORTH',
    ward: 'AMAPU (WARD 02)',
    pu_code: '01-06-02-005',
    pu_name: 'COMMUNITY PRY. SCH. AMAPU PU 005',
    default_c23: 460,
    default_c27: 495
  },

  // ==========================================
  // 5. ALL 36 STATE GOVERNORS & PAST PRESIDENTS
  // ==========================================
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
    pu_name: 'LATEEF JAKANDE / FEMI OKUNNU PU 006',
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
    pu_name: 'ABAYOMI IWO ROAD PU 001, IBADAN',
    default_c23: 366,
    default_c27: 416
  },
  {
    id: 'soludo',
    name: 'Prof. Charles Chukwuma Soludo (CFR)',
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
    name: 'Sen. Hope Odidika Uzodimma (CON)',
    role: 'Governor of Imo State (Progressive Govs Chair)',
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
    id: 'dapo-abiodun',
    name: 'Prince Dapo Abiodun (MFR, CON)',
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
    name: 'Sen. Bala Abdulkadir Mohammed (CON)',
    role: 'Governor of Bauchi State (PDP Govs Forum Chair)',
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
    name: 'Sir Siminalayi Fubara (GSSRS)',
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
    name: 'Prof. Babagana Umara Zulum (CON)',
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
  },
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
    pu_name: 'SARKIN YARA POLLING UNIT 003, DAURA',
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
    pu_name: 'OLUSOMI COMPOUND PU 022, TOTORO',
    default_c23: 312,
    default_c27: 334
  },
  {
    id: 'el-rufai',
    name: 'Mallam Nasir Ahmad El-Rufai (OFR)',
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
    name: 'Rt. Hon. Rotimi Chibuike Amaechi (CON)',
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
  }
];

// Enrich with live audit data if matched by PU code
const enrichedMaster = ALL_POLITICIANS_RAW.map(p => {
  let c23 = p.default_c23;
  let c27 = p.default_c27;
  let liveMatch = false;

  if (byCode.has(p.pu_code)) {
    const live = byCode.get(p.pu_code);
    c23 = Number(live.c23 ?? live.count_2023) || c23;
    c27 = Number(live.c27 ?? live.count_2027) || c27;
    liveMatch = true;
  }

  const delta = c27 - c23;
  const pctGrowth = c23 > 0 ? ((delta / c23) * 100) : (c27 > 0 ? 100 : 0);

  // Demographic expectation
  const expectedMax = Math.round(c23 * 1.12 + 30);
  const discrepancy = Math.max(0, c27 - expectedMax);

  // Forensic Alarm Level
  let alarmLevel = 'NORMAL_STABLE';
  let alarmBadge = '✅ Stable Baseline';
  let alarmReason = 'Voter count progression is consistent with Nigeria\'s organic 4-year demographic growth (~10-15%).';

  if (delta < -20) {
    alarmLevel = 'PURGE_ALERT';
    alarmBadge = '📉 Voter Purge Alert';
    alarmReason = `Abnormal voter contraction: ${Math.abs(delta)} voters vanished (${pctGrowth.toFixed(1)}%). Requires audit for possible voter roll suppression.`;
  } else if (c27 >= 1000 && c27 > c23 * 1.25) {
    alarmLevel = 'CRITICAL_ALARM';
    alarmBadge = '🚨 Critical: Statutory Cap Breach';
    alarmReason = `Severe Inflation Alert: Polling unit surged to ${c27} voters (+${delta} voters, +${pctGrowth.toFixed(1)}%), breaching statutory limit of 1,000 voters without unbundling.`;
  } else if (discrepancy >= 180 || (c23 < 30 && c27 > 250)) {
    alarmLevel = 'CRITICAL_ALARM';
    alarmBadge = '🚨 Critical Register Inflation';
    alarmReason = `Massive Unjustified Surge: Surged by +${delta} voters (+${pctGrowth.toFixed(1)}%). Estimated ${discrepancy} artificial excess voters above demographic ceiling.`;
  } else if (discrepancy >= 45) {
    alarmLevel = 'WARNING_SPIKE';
    alarmBadge = '⚠️ Abnormal Surge Alert';
    alarmReason = `Abnormal expansion (+${delta} voters, +${pctGrowth.toFixed(1)}%) exceeding regional demographic baseline. Discrepancy surplus of ${discrepancy} voters.`;
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

// Write to JSON registry
const outFile = path.join(ROOT_DIR, 'data', 'politicians_registry.json');
fs.writeFileSync(outFile, JSON.stringify(enrichedMaster, null, 2), 'utf8');

const publicOutFile = path.join(ROOT_DIR, 'public', 'data', 'politicians_registry.json');
fs.writeFileSync(publicOutFile, JSON.stringify(enrichedMaster, null, 2), 'utf8');

console.log('✅ Successfully compiled', enrichedMaster.length, 'comprehensive politicians (Senators, Reps, Ministers, Governors, Presidency) to data/politicians_registry.json');

const criticals = enrichedMaster.filter(p => p.alarmLevel === 'CRITICAL_ALARM').length;
const warnings = enrichedMaster.filter(p => p.alarmLevel === 'WARNING_SPIKE').length;
const purges = enrichedMaster.filter(p => p.alarmLevel === 'PURGE_ALERT').length;
console.log({ total: enrichedMaster.length, criticals, warnings, purges, stable: enrichedMaster.length - criticals - warnings - purges });
