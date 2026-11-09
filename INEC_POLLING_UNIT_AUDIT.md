# INEC Polling Unit Voter Audit & Verification System

This document serves as both the **official volunteer instructions** and the **automated verification registry** for auditing the 2027 Nigerian Preliminary Register of Voters compared against the 2023 General Election register across all 176,846 polling units nationwide.

---

## 📌 Original Manual Process & Instructions

> [!IMPORTANT]
> **Why we are doing this:**  
> INEC has restricted the amount of time each person can spend on its website, so we need as many people as possible to help with this exercise. We are counting the number of registered voters in each polling unit for 2027 and comparing it with the number of registered voters in that same polling unit in 2023. INEC won’t show us the full register, so we have to do this ourselves, one polling unit at a time.  
> 
> **It takes just 60 seconds!** 60 seconds of your time can help us build a clearer picture of what’s happening with our voters’ register.

```
                    ┌──────────────────────────────────────────────┐
                    │ STEP 1: Open check.nigeriaelects.com         │
                    └──────────────────────┬───────────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │ STEP 2: Copy your assigned PU Code           │
                    │         (e.g., 24-01-01-001)                 │
                    └──────────────────────┬───────────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │ STEP 3: Go to display.inecnigeria.org/find   │
                    │         Paste the code and click "Find"      │
                    └──────────────────────┬───────────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │ STEP 4: Note the Number of Registered Voters │
                    │         (e.g., 685)                          │
                    └──────────────────────┬───────────────────────┘
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │ STEP 5: Return to NigeriaElects, enter count │
                    │         and click "Submit"                   │
                    └──────────────────────────────────────────────┘
```

### Step-by-Step Instructions

1. **STEP 1**: Go to this link ⤵️  
   🔗 **[check.nigeriaelects.com](https://check.nigeriaelects.com)**
2. **STEP 2**: Copy the code generated where it says **“Your Polling Unit”**. It is the code containing numbers and dashes (e.g. `19-20-10-013`).
3. **STEP 3**: Go to the INEC website and scroll down to **“Find a Polling Unit”** (or visit **[display.inecnigeria.org/find](https://display.inecnigeria.org/find)**).  
   Paste the code you copied into the **PU Code** box and click **“Find”**.
4. **STEP 4**: The polling unit information will appear, including the number of registered voters.  
   Copy **ONLY** the number of registered voters (the whole number, without commas, signs, or decimals).
5. **STEP 5**: Return to the first website, paste the number into the space provided for registered voters, and click **Submit**.
6. **That’s all!** Share this with other Nigerians. The more people who help, the more polling units we can cover.

---

## ⚡ Automated Verification System

To accelerate data collection, eliminate manual data entry errors, and automatically store records, an automated CLI tool has been developed: [`scripts/inec_voter_auditor.mjs`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/scripts/inec_voter_auditor.mjs).

### Architecture & Endpoints

| Platform | Endpoint | Purpose | Authentication |
| :--- | :--- | :--- | :--- |
| **NigeriaElects** | `GET /register-check/api/bootstrap` | Initializes session and obtains CSRF token | Session cookie (`ne_register_run`) |
| **NigeriaElects** | `POST /register-check/api/start` | Receives assigned polling unit code (`pu_code`) | CSRF token + Session |
| **NigeriaElects** | `POST /register-check/api/submit` | Submits 2027 voter count; receives 2023 count and net delta | CSRF token + Session |
| **NigeriaElects** | `POST /register-check/api/continue` | Fetches next assigned polling unit code | CSRF token + Session |
| **INEC Portal** | `GET /api/pu/by-code/:code` | Looks up polling unit ID/reference by PU code | `X-Requested-With: XMLHttpRequest` + Session Cookie |
| **INEC Portal** | `GET /api/pu/:ref/register` | Fetches 2027 registered voters count (`pu.total`) | `X-Requested-With: XMLHttpRequest` + Session Cookie |

---

## 🚀 How to Run the Automation

The script runs with **Node.js 20+** (already pre-installed on this system).

### Mode 1: Assisted / Interactive Mode (Zero Setup)
If you don't have an INEC session cookie, the script still automates the entire process:
- Fetches the assigned PU code from NigeriaElects.
- Automatically copies the PU code to your clipboard.
- Opens/links directly to `https://display.inecnigeria.org/find`.
- Prompts you for the voter count and automatically submits it, computes deltas, and logs the record.

```powershell
node scripts/inec_voter_auditor.mjs
```

### Mode 2: Fully Autonomous Mode (Batch Verification)
To query INEC completely in the background without any manual copying or pasting:
1. Sign in once to [display.inecnigeria.org](https://display.inecnigeria.org/signin) in your browser.
2. Open DevTools (`F12`), go to the **Application** or **Network** tab, and copy your cookie string.
3. Run the script with the `--cookie` flag:

```powershell
node scripts/inec_voter_auditor.mjs --cookie "your_cookie_here" --limit 50
```

Or set the environment variable:
```powershell
$env:INEC_COOKIE = "your_cookie_here"
node scripts/inec_voter_auditor.mjs --limit 100 --delay 3000
```

### Available Options
- `--cookie <string>`: Your authenticated INEC session cookie.
- `--limit <number>`: Maximum number of polling units to process before stopping.
- `--delay <ms>`: Delay between requests in milliseconds (default: `2000` ms) to prevent rate limits.

---

## 📊 Live Polling Unit Audit Registry

All verified records are automatically synced and appended to:
- CSV Database: [`data/voter_records.csv`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/data/voter_records.csv)
- JSON Database: [`data/voter_records.json`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/data/voter_records.json)
- Live Markdown Summary below:

| Polling Unit Code | State | LGA | Polling Unit Name | 2023 Voters | 2027 Voters | Difference | Status | Verified Date |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
<!-- AUDIT_DATA_TABLE_START -->
| `07-11-04-002` | BENUE | KWANDE | RCM. PRI. SCHOOL, INJORSHA, SCHOOL PREMISES | 750 | **842** | +92 | added | 2026-11-09 |

| `07-06-05-008` | BENUE | GUMA | HUMBAOR AGER - LGEA PRIM. HUMBAOR AGER | 729 | **762** | +33 | added | 2026-11-09 |

| `24-03-04-223` | LAGOS | ALIMOSHO | IN FRONT OF 16, AMUSA IDOWU STREET, IJEGUN | 451 | **462** | +11 | added | 2026-11-09 |

| `33-18-06-011` | SOKOTO | TAMBUWAL | BAGASAKKA/NABARI - BAGASAKKA KASUWA | 888 | **1254** | +366 | added | 2026-11-09 |

| `32-06-01-003` | RIVERS | ASARI-TORU | OPUAMEE NGOAA SQUARE | 145 | **174** | +29 | added | 2026-11-09 |

| `09-02-01-027` | CROSS RIVER | AKAMKPA | BASE CAMP G/HOUSE II | 354 | **355** | +1 | added | 2026-11-09 |

| `01-02-12-030` | ABIA | ABA SOUTH | ABA TOWN HALL XIII | 77 | **119** | +42 | added | 2026-11-09 |

| `16-27-07-053` | IMO | OWERRI WEST | UMUEJECHI EXT. AREA H NEKEDE | 408 | **378** | -30 | added | 2026-11-09 |

| `14-12-06-016` | ENUGU | NKANU WEST | UGWU NKPUME MARKET SQUARE | 482 | **480** | -2 | added | 2026-11-09 |

| `18-21-09-005` | KADUNA | SOBA | UNG. UMAR/ L.E.A T/JIRGI | 1199 | **1215** | +16 | added | 2026-11-09 |

| `06-08-03-009` | BAYELSA | YENAGOA | FANYE PRIMARY SCHOOL | 750 | **759** | +9 | added | 2026-11-09 |

| `35-02-09-004` | YOBE | BURSARI | GARIN BOKA, DANDALI MAIGARI | 257 | **279** | +22 | added | 2026-11-09 |

| `01-10-03-022` | ABIA | OHAFIA | OGBANI - ETITI AMA COMM. SCHOOL  I | 855 | **858** | +3 | added | 2026-11-09 |

| `18-02-10-046` | KADUNA | CHIKUN | GALADIMA ST. BY JEMA'A RD | 110 | **132** | +22 | added | 2026-11-09 |

| `10-10-05-003` | DELTA | ISOKO SOUTH | ORUOKPHRO HALL, OKPOHRO/ADAZA/ETEVIE I | 1447 | **1555** | +108 | added | 2026-11-09 |

| `19-04-04-004` | KANO | BEBEJI | DANGA | 536 | **595** | +59 | added | 2026-11-09 |

| `21-16-01-010` | KEBBI | SAKABA | MAGANDA DISPENSARY (MAGANDA) | 539 | **768** | +229 | added | 2026-11-09 |

| `34-14-02-012` | TARABA | WUKARI | PWADZU, PWADZU PRIMARY SCHOOL | 1679 | **1633** | -46 | added | 2026-11-09 |

| `16-25-11-007` | IMO | OWERRI MUNICIPAL | HOLY GHOST PARK I | 1346 | **1284** | -62 | added | 2026-11-09 |

| `36-02-06-012` | ZAMFARA | BAKURA | TITI K/DAJI BAKIN KANAR | 314 | **591** | +277 | added | 2026-11-09 |

| `27-15-02-105` | OGUN | OBAFEMI/OWODE | OPEN SPACE AT IRE AKARI STR., MOWE | 164 | **189** | +25 | added | 2026-11-09 |

| `07-01-10-006` | BENUE | ADO | INIKIRU, MKT. SQ. | 713 | **713** | 0 | added | 2026-11-09 |

| `36-07-09-064` | ZAMFARA | GUSAU | METROLOGICAL CENTRE (OLD AIRPORT)/FILIN JIRGI | 806 | **1217** | +411 | added | 2026-11-09 |

| `17-03-11-008` | JIGAWA | BIRNIN KUDU | GIDAN SARKIN NOMA | 523 | **531** | +8 | added | 2026-11-09 |

| `20-12-08-004` | KATSINA | DUTSIN-MA | GARHI P.S. GARHI | 562 | **663** | +101 | added | 2026-11-09 |

| `21-04-08-012` | KEBBI | AUGIE | ZAGGI PRIMARY SCHOOL (ZAGI SHIYAR ARAWA) | 685 | **890** | +205 | added | 2026-11-09 |

| `19-26-08-010` | KANO | KUNCHI | TANGEL/TUWAWA | 290 | **332** | +42 | added | 2026-11-09 |

| `19-37-03-003` | KANO | TAKAI | FAJEWA KOFA | 561 | **577** | +16 | added | 2026-11-09 |

| `24-05-06-010` | LAGOS | APAPA | OJO APEJE HOUSE 2 | 618 | **597** | -21 | added | 2026-11-09 |

| `16-10-02-005` | IMO | ISU | UMUONA HALL | 695 | **753** | +58 | added | 2026-11-09 |

| `19-15-08-002` | KANO | GARUN MALAM | AGALAWA II | 531 | **563** | +32 | added | 2026-11-09 |

| `16-26-06-012` | IMO | OWERRI NORTH | UMUOCHAM VILL | 26 | **44** | +18 | added | 2026-11-09 |

| `24-18-11-001` | LAGOS | OSHODI/ISOLO | JUNCTION OF ASSOCIATION AVENUE/ADEBANJI ST. (BEHIND NEPA STATION ) | 1134 | **1175** | +41 | added | 2026-11-09 |

| `11-07-06-005` | EBONYI | IKWO | NDUBIA PLAY GROUND | 702 | **713** | +11 | added | 2026-11-09 |

| `23-01-10-008` | KWARA | ASA | ORI-ERU LGEA SCH | 317 | **484** | +167 | added | 2026-11-09 |

| `31-11-11-030` | PLATEAU | MANGU | EKAN PRI. SCH. C | 80 | **113** | +33 | added | 2026-11-09 |

| `18-05-03-019` | KADUNA | IKARA | FURANA/ PRIMARY SCHOOL | 758 | **847** | +89 | added | 2026-11-09 |

| `22-16-04-001` | KOGI | OKEHI | GOVT. DAY SEC. SCH. OHUETA I | 333 | **488** | +155 | added | 2026-11-09 |

| `33-08-03-001` | SOKOTO | ILLELA | SHIYAR GALADIMA DAMBA, GODABE | 403 | **720** | +317 | added | 2026-11-09 |

| `27-01-12-004` | OGUN | ABEOKUTA NORTH | NEAR FRESH FISH MARKET  I | 579 | **591** | +12 | added | 2026-11-09 |

| `26-11-05-014` | NIGER | KONTAGORA | OPP DAN FODIO ISLAMIC CENTRE (OPEN SPACE) | 121 | **159** | +38 | added | 2026-11-09 |

| `18-09-01-017` | KADUNA | KADUNA NORTH | ABEOKUTA STREET I/ E.11 BIDA ROAD | 667 | **677** | +10 | added | 2026-11-09 |

| `28-17-02-009` | ONDO | OSE | APOSTOLIC PRY SCH/ APOSTOLIC PRY SCH | 884 | **885** | +1 | added | 2026-11-09 |

| `24-13-07-079` | LAGOS | KOSOFE | ADIGUN FANBODE STREET BY SECURITY POST | 45 | **76** | +31 | added | 2026-11-09 |

| `19-19-02-031` | KANO | GWARZO | LIBERARY BOARD | 137 | **285** | +148 | added | 2026-11-09 |

| `09-09-07-006` | CROSS RIVER | CALABAR SOUTH | EDGERLEY/CHAMLEY I | 852 | **831** | -21 | added | 2026-11-09 |

| `31-17-12-019` | PLATEAU | WASE | PHC LAMBA | 243 | **270** | +27 | added | 2026-11-09 |

| `18-09-02-033` | KADUNA | KADUNA NORTH | ZARIA RD/MDG WATER TANK | 304 | **318** | +14 | added | 2026-11-09 |

| `22-16-01-004` | KOGI | OKEHI | L.G.E.A SCHOOL - OBEIBA IV | 422 | **451** | +29 | added | 2026-11-09 |

| `24-18-10-011` | LAGOS | OSHODI/ISOLO | JUNCTION OF AINA ROAD/OLUSEYE ST. | 985 | **951** | -34 | added | 2026-11-09 |

| `19-02-07-005` | KANO | ALBASU | GANUWA | 380 | **458** | +78 | added | 2026-11-09 |

| `33-11-01-005` | SOKOTO | KEBBE | KUNKURU, D/HILI | 401 | **436** | +35 | added | 2026-11-09 |

| `33-17-01-015` | SOKOTO | SOKOTO SOUTH | GARKAR SARKIN KUDUN GASAU I | 729 | **735** | +6 | added | 2026-11-09 |

| `02-05-10-008` | ADAMAWA | GOMBI | FUTENA PRY SCH | 38 | **64** | +26 | added | 2026-11-09 |

| `34-14-07-012` | TARABA | WUKARI | K/ISHAKU/UTUKU, KOFAR ISHAKU/UTUKU SONDI | 1395 | **1380** | -15 | added | 2026-11-09 |

| `30-21-02-012` | OYO | OGBOMOSO NORTH | OJUDE ILE BALOGUN AGBEDE | 462 | **446** | -16 | added | 2026-11-09 |

| `10-22-09-004` | DELTA | UVWIE | BY SHAGHOLOR  PRIMARY SCHOOL POLICE BARRACK | 1331 | **1317** | -14 | added | 2026-11-09 |

| `10-17-05-014` | DELTA | SAPELE | OGODO ROAD BY CEMETERY ROAD II | 70 | **89** | +19 | added | 2026-11-09 |

| `34-08-01-016` | TARABA | KARIM-LAMIDO | ANG. VELANGO PRIMARY SCHOOL | 0 | **63** | +63 | added | 2026-11-09 |

| `36-07-09-063` | ZAMFARA | GUSAU | COCIN KWANO/ TANKIN RUWA/HIRA DA KWADI | 729 | **808** | +79 | added | 2026-11-09 |

| `10-09-05-013` | DELTA | ISOKO NORTH | GOVERNMENT SECONDARY SCHOOL | 408 | **447** | +39 | added | 2026-11-09 |

| `14-04-13-008` | ENUGU | ENUGU NORTH | CARTER STREET PRIMARY SCHOOL I | 942 | **941** | -1 | added | 2026-11-09 |

| `27-04-09-026` | OGUN | EGBADO NORTH | ODAN IGA | 255 | **251** | -4 | added | 2026-11-09 |

| `28-02-04-003` | ONDO | AKOKO NORTH WEST | BAPTISIT DAY SCH, BAPTISIT DAY SCH, OYIN | 474 | **525** | +51 | added | 2026-11-09 |

| `11-11-10-003` | EBONYI | OHAOZARA | EKE MARKET SQUARE | 950 | **1004** | +54 | added | 2026-11-09 |

| `28-07-09-002` | ONDO | ESE-ODO | L.A SCH BOLOWOGHO | 821 | **875** | +54 | added | 2026-11-09 |

| `29-14-02-003` | OSUN | IFELODUN | AMOLA'S COMPOUND/AMOLA | 868 | **877** | +9 | added | 2026-11-09 |

| `19-26-02-003` | KANO | KUNCHI | GARIN SHEME I | 533 | **573** | +40 | added | 2026-11-09 |

| `13-15-01-001` | EKITI | MOBA | IMAYAN TOWN HALL / AJEBANDELE , SURULERE | 900 | **883** | -17 | added | 2026-11-09 |

| `03-20-05-007` | AKWA IBOM | NSIT IBOM | PRY. SCH, OBO NTONG | 710 | **721** | +11 | added | 2026-11-09 |

| `14-15-04-029` | ENUGU | UDENU | CUSTOMARY COURT OBOLLO-AFOR | 67 | **105** | +38 | added | 2026-11-09 |

| `18-07-09-020` | KADUNA | JEMA'A | UNG. MADAKI/ UNG. MADAKI | 352 | **365** | +13 | added | 2026-11-09 |

| `02-19-09-011` | ADAMAWA | TOUNGO | MDG BORE HOLE | 750 | **823** | +73 | added | 2026-11-09 |

| `01-17-06-006` | ABIA | UMU - NNEOCHI | OHUOBA TOWN HALL | 725 | **881** | +156 | added | 2026-11-09 |

| `32-15-16-068` | RIVERS | OBIO/AKPOR | OZUOBA PRIMARY HEALTH CENTRE | 422 | **562** | +140 | added | 2026-11-09 |

| `08-24-07-010` | BORNO | MONGUNO | VIEWING CENTRE | 1450 | **1512** | +62 | added | 2026-11-09 |

| `15-07-02-011` | GOMBE | KALTUNGO | SABON GARI, S. G. PRI. SCH. | 783 | **790** | +7 | added | 2026-11-09 |

| `32-19-02-008` | RIVERS | OMUMA | UMUAGUOZIA COMMUNITY CENTRE, OTUEBE/CHUKWU | 511 | **522** | +11 | added | 2026-11-09 |

| `28-09-09-020` | ONDO | IFEDORE | OPEN SPACE AT ATIBIOKE STREET IBULE | 182 | **269** | +87 | added | 2026-11-09 |

| `24-10-03-011` | LAGOS | IFAKO-IJAYE | STADIUM HIGH SCH. IFAKO I | 519 | **537** | +18 | added | 2026-11-09 |

| `19-07-04-027` | KANO | DALA | WOMEN CENTRE III | 750 | **758** | +8 | added | 2026-11-09 |

| `34-02-07-011` | TARABA | BALI | KASUWA MATA | 80 | **129** | +49 | added | 2026-11-09 |

| `27-03-07-041` | OGUN | ADO ODO-OTA | OPEN SPACE AT ONE ACCORD JUNCTION, ILEGBEDE ALAFIA ITELE | 147 | **210** | +63 | added | 2026-11-09 |

| `32-22-18-028` | RIVERS | PORT HARCOURT | OBAZIOLU HALL II | 38 | **131** | +93 | added | 2026-11-09 |

| `31-15-05-005` | PLATEAU | RIYOM | MAKERA MARKET | 1258 | **1287** | +29 | added | 2026-11-09 |

| `06-06-10-017` | BAYELSA | SAGBAMA | AGBEIOWEI PLAY GROUND | 418 | **487** | +69 | added | 2026-11-09 |

| `24-03-11-131` | LAGOS | ALIMOSHO | ADOGA/LERATO JUNCTION,MEIRAN | 411 | **445** | +34 | added | 2026-11-09 |

| `12-02-06-024` | EDO | EGOR | OPEN SPACE BY EVBAREKE JUNCTION, TEXTILE MILL RD | 750 | **771** | +21 | added | 2026-11-09 |

| `37-04-01-075` | FCT | KUJE | KUCHIYAKO SETTLMENT | 1453 | **1561** | +108 | added | 2026-11-09 |

| `17-21-03-002` | JIGAWA | MALAM MADORI | AKURYA GABAS PRI. SCH. I | 776 | **842** | +66 | added | 2026-11-09 |

| `29-04-05-005` | OSUN | AYEDIRE | N.U. D. SCHOOL, ILEOGBO II | 370 | **447** | +77 | added | 2026-11-09 |

| `09-06-03-007` | CROSS RIVER | BIASE | SECONDARY SCHOOL, OKURIKE | 436 | **451** | +15 | added | 2026-11-09 |

| `01-02-04-015` | ABIA | ABA SOUTH | NGWA-AGULU PEOPLES HALL III | 865 | **847** | -18 | added | 2026-11-09 |

| `18-10-07-022` | KADUNA | KADUNA SOUTH | PBI IBRAHIM TAIWO ROAD | 715 | **709** | -6 | added | 2026-11-09 |

| `06-02-08-010` | BAYELSA | EKEREMOR | TOMUBULOU/EGOUGBOUN. COMPOUND | 249 | **295** | +46 | added | 2026-11-09 |

| `21-03-11-013` | KEBBI | ARGUNGU | BABBAR GARKA. | 171 | **377** | +206 | added | 2026-11-09 |

| `33-09-08-004` | SOKOTO | ISA | SATIRU SHIYAR MAIGARI | 667 | **709** | +42 | added | 2026-11-09 |

| `05-16-02-013` | BAUCHI | SHIRA | KATABARWA,  KOFAR SARKI - II | 259 | **281** | +22 | added | 2026-11-09 |

| `30-06-05-037` | OYO | IBADAN NORTH | IKOLABA GRAMMAR SCHOOL II HALL | 55 | **102** | +47 | added | 2026-11-09 |

| `24-17-04-040` | LAGOS | OJO | OPEN SPACE AT THE BACK OF IJANIKIN POLICE STATION | 107 | **134** | +27 | added | 2026-11-09 |

| `29-11-03-006` | OSUN | IFE CENTRAL | AKODI GBUEDE | 460 | **528** | +68 | added | 2026-11-09 |

| `04-16-10-022` | ANAMBRA | OGBARU | EEDC OFFICE | 16 | **215** | +199 | added | 2026-11-09 |

| `10-17-03-005` | DELTA | SAPELE | BEHIND NENE HOSPITAL | 828 | **830** | +2 | added | 2026-11-09 |

| `19-22-08-007` | KANO | KARAYE | UNGUWAR HAJJI III | 726 | **731** | +5 | added | 2026-11-09 |

| `14-01-07-013` | ENUGU | ANINRI | UMUAGAM VILLAGE HALL | 479 | **484** | +5 | added | 2026-11-09 |

| `08-21-09-042` | BORNO | MAIDUGURI M. C. | ALHAJI MALA DANGEL | 481 | **478** | -3 | added | 2026-11-09 |

| `03-31-02-029` | AKWA IBOM | UYO | OPEN SPACE, MICHAEL ABRAHAM BY AKPAN UDOSEN STR. | 68 | **131** | +63 | added | 2026-11-09 |

| `15-02-07-021` | GOMBE | BALANGA | BAKIN KASUWA | 116 | **233** | +117 | added | 2026-11-09 |

| `07-04-07-006` | BENUE | BURUKU | LGEA SCHOOL, HAA I | 912 | **917** | +5 | added | 2026-11-09 |

| `37-04-03-036` | FCT | KUJE | CHIEF PALACE DAFARA | 27 | **202** | +175 | added | 2026-11-09 |

| `05-17-06-012` | BAUCHI | TAFAWA BALEWA | GUMEL / SHAFAU,   GUMEL PRIMARY SCHOOL | 384 | **387** | +3 | added | 2026-11-09 |

| `18-15-08-002` | KADUNA | KUBAU | KUDUMI/ PRI. SCH. | 910 | **923** | +13 | added | 2026-11-09 |

| `25-08-06-018` | NASARAWA | LAFIA | F/BAUNA SOUTH K/SARKI - OP | 660 | **672** | +12 | added | 2026-11-09 |

| `19-14-05-007` | KANO | GARKO | KAFIN MALAMAI HURUMI III | 542 | **561** | +19 | added | 2026-11-09 |

| `14-12-04-003` | ENUGU | NKANU WEST | AMODU NIGHT MARKET  SQUARE I | 560 | **564** | +4 | added | 2026-11-09 |

| `19-38-10-046` | KANO | TARAUNI | GGSS UNGUWA UKU XVI | 36 | **89** | +53 | added | 2026-11-09 |

| `33-07-06-031` | SOKOTO | GWADABAWA | OPEN SPACE BEHIND JSS GWADABAWA | 328 | **399** | +71 | added | 2026-11-09 |

| `27-06-03-016` | OGUN | EWEKORO | BESIDE TRANSFORMER DEBORAH'S COURT JUNCTION | 136 | **655** | +519 | added | 2026-11-09 |

| `28-02-04-011` | ONDO | AKOKO NORTH WEST | AYEGUNLE CAMP, ITA AGBO CAMP, OGE | 656 | **705** | +49 | added | 2026-11-09 |

| `03-26-12-013` | AKWA IBOM | ORUK ANAM | VILLAGE SQUARE, IKOT UDO ADUAK | 361 | **389** | +28 | added | 2026-11-09 |

| `14-04-12-025` | ENUGU | ENUGU NORTH | UGWUAKULU PRIMARY SCHOOL ENUGU NGWO II | 535 | **576** | +41 | added | 2026-11-09 |

| `04-18-12-004` | ANAMBRA | ONITSHA -SOUTH | CENTRAL SCHOOL I | 1172 | **1207** | +35 | added | 2026-11-09 |

| `24-10-04-023` | LAGOS | IFAKO-IJAYE | KUDIRAT ESTATE BY THE GATE | 212 | **248** | +36 | added | 2026-11-09 |

| `10-21-09-022` | DELTA | UKWUANI | OPEN SPACE GHANA QUARTERS JUNCTION OBIARUKU | 119 | **204** | +85 | added | 2026-11-09 |

| `31-06-10-032` | PLATEAU | JOS SOUTH | DAHWOLENG | 66 | **221** | +155 | added | 2026-11-09 |

| `06-07-02-025` | BAYELSA | SOUTHERN IJAW | OTUOBIRI TOWN HALL | 21 | **344** | +323 | added | 2026-11-09 |

| `13-16-12-006` | EKITI | OYE | AT ITA EKUN - ITA OTUN IJELU  II | 367 | **431** | +64 | added | 2026-11-09 |

| `07-06-08-016` | BENUE | GUMA | TSE ORTOM VILLAGE ORTOM | 728 | **752** | +24 | added | 2026-11-09 |

| `11-13-03-005` | EBONYI | ONICHA | UHU EZE VILLAGE SQUARE | 837 | **962** | +125 | added | 2026-11-09 |

| `26-22-09-003` | NIGER | SHIRORO | KATO | 1325 | **1276** | -49 | added | 2026-11-09 |

| `30-32-06-009` | OYO | SAKI WEST | BAPTIST SCHOOL, KINNIKINNI I | 732 | **738** | +6 | added | 2026-11-09 |

| `36-13-01-028` | ZAMFARA | TSAFE | MARBE/ PRI. SCHOOL | 104 | **124** | +20 | added | 2026-11-09 |

| `27-14-12-012` | OGUN | IPOKIA | OPEN SPACE NEAR C.A.C OKO EYE | 481 | **618** | +137 | added | 2026-11-09 |

| `12-13-05-018` | EDO | ORHIONMWON | OBOZOGBE- NIRO P/SCH. , UGBOKO - NIRO  IV | 319 | **381** | +62 | added | 2026-11-09 |

| `10-06-08-028` | DELTA | ETHIOPE  WEST | OPEN SPACE/JUNCTION BY NAVY LOGISTICS HEADQUARTERS, OGHAREFE | 65 | **124** | +59 | added | 2026-11-09 |

| `10-01-02-013` | DELTA | ANIOCHA NORTH | MIXED SEC SCH UMUOLO QTRS I | 33 | **50** | +17 | added | 2026-11-09 |

| `22-17-01-017` | KOGI | OKENE | OPEN SPACE BY LAWAL UBEINA | 282 | **386** | +104 | added | 2026-11-09 |

| `05-15-06-004` | BAUCHI | NINGI | MARKEN JATA,    KOFAR MAI UNGUWA | 528 | **735** | +207 | added | 2026-11-09 |

| `28-08-07-001` | ONDO | IDANRE | LISA OLATUNJI AREA, O/S AT LISA OLATUNJIS H/S I | 894 | **906** | +12 | added | 2026-11-09 |

| `09-07-10-014` | CROSS RIVER | BOKI | PLAYGROUND BEBUOSHIE | 311 | **322** | +11 | added | 2026-11-09 |

| `05-10-08-014` | BAUCHI | ITAS/GADAU | JAN  KAI,   RIJIYAR  HARDO | 403 | **401** | -2 | added | 2026-11-09 |

| `31-05-13-094` | PLATEAU | JOS NORTH | POLICE STATION UNG WALI | 22 | **27** | +5 | added | 2026-11-09 |

| `34-12-10-011` | TARABA | TAKUM | JIDU II OPEN SPACE | 173 | **317** | +144 | added | 2026-11-09 |

| `19-08-05-001` | KANO | DANBATA | BARO, OPEN SPACE | 502 | **502** | 0 | added | 2026-11-09 |

| `19-31-03-033` | KANO | NASARAWA | MAKARA HUTA III | 950 | **955** | +5 | added | 2026-11-09 |

| `36-07-09-053` | ZAMFARA | GUSAU | KAMUCHE BREAD CENTRE IV/ ARMY CHILDREN SCH | 502 | **518** | +16 | added | 2026-11-09 |

| `09-07-06-005` | CROSS RIVER | BOKI | PLAYGROUND,  BOKALUM | 375 | **382** | +7 | added | 2026-11-09 |

| `26-17-11-011` | NIGER | MOKWA | RABBA  KOSHABA | 468 | **466** | -2 | added | 2026-11-09 |

| `30-20-01-016` | OYO | LAGELU | OPEN SPACE OPP. CAC OKE AGBARA YAWURI | 598 | **764** | +166 | added | 2026-11-09 |

| `17-25-10-004` | JIGAWA | SULE-TANKARKAR | GARIN HARDO/HARDO UMARU | 530 | **544** | +14 | added | 2026-11-09 |

| `22-16-05-004` | KOGI | OKEHI | NEAR KUJENU'S HOUSE | 493 | **558** | +65 | added | 2026-11-09 |

| `30-09-02-008` | OYO | IBADAN SOUTH-EAST | ILE - ODE ISALE IJEBU | 750 | **740** | -10 | added | 2026-11-09 |

| `19-25-04-061` | KANO | KUMBOTSO | GOVT. GIRLS. SEC. SCH. SHEKA  VII | 750 | **769** | +19 | added | 2026-11-09 |

| `24-10-03-053` | LAGOS | IFAKO-IJAYE | JUNCTION OF OLUFEMI OGUNSOLA ST.MOYO AGORO, OGBA | 820 | **834** | +14 | added | 2026-11-09 |

| `01-08-03-009` | ABIA | ISUIKWUATO | AKOBA/AMAOGUDU VILLAGE SQUARE / OTAMKPA | 586 | **636** | +50 | added | 2026-11-09 |

| `03-26-02-008` | AKWA IBOM | ORUK ANAM | VILLAGE SQUARE, IKOT ESSIEN | 375 | **412** | +37 | added | 2026-11-09 |

| `10-03-01-017` | DELTA | BOMADI | AREGHAOWEI ( NSCDC), BOMADI. | 99 | **118** | +19 | added | 2026-11-09 |

| `20-06-09-006` | KATSINA | CHARANCHI | BANYE 'B' HEALTH CENTRE | 583 | **808** | +225 | added | 2026-11-09 |

| `24-06-11-001` | LAGOS | BADAGRY | OPEN SPACE AT TAKO  VILLAGE | 822 | **854** | +32 | added | 2026-11-09 |

| `36-02-03-001` | ZAMFARA | BAKURA | DAMRI   I/MODEL PRIMARY SCHOOL | 1289 | **1288** | -1 | added | 2026-11-09 |

| `03-03-06-024` | AKWA IBOM | EKET | VILLAGE HALL IDUNG UDO ATARA, NTAISIP IKOT IBIOK, OPPOSITE FAITH MOUNT ZION GOSPEL CHURCH. | 253 | **399** | +146 | added | 2026-11-09 |

| `09-08-08-046` | CROSS RIVER | CALABAR MUNICIPALITY | 046 - OPEN SPACE ASIMITA 
CLOSE BY TRANSFORMER | 590 | **595** | +5 | added | 2026-11-09 |

| `05-02-10-026` | BAUCHI | BAUCHI | BUTA KANGAL,  GIDIRGI  SHED | 210 | **261** | +51 | added | 2026-11-09 |

| `32-01-05-012` | RIVERS | ABUA-ODUAL | COMMUNITY COMPREHENSIVE SECONDARY SCHOOL OKOBOH MDG'S BUILDING | 49 | **87** | +38 | added | 2026-11-09 |

| `34-04-03-012` | TARABA | GASHAKA | SABON GIDAPRIMARY SCHOOL | 65 | **67** | +2 | added | 2026-11-09 |

| `04-07-20-015` | ANAMBRA | AWKA SOUTH | UMUENU VILLAGE HALL I | 635 | **700** | +65 | added | 2026-11-09 |

| `26-23-07-018` | NIGER | SULEJA | JACOB KURE UNDER FRUIT TREE | 432 | **469** | +37 | added | 2026-11-09 |

| `19-12-08-060` | KANO | FAGGE | ZAWAI PRIMARY SCH.  VI | 121 | **130** | +9 | added | 2026-11-09 |

| `19-36-05-002` | KANO | SUMAILA | BUNABUS | 723 | **1176** | +453 | added | 2026-11-09 |

| `02-12-01-001` | ADAMAWA | MAYO - BELWA | BAJAMA FULANI PRI. SCHOOL | 747 | **727** | -20 | added | 2026-11-09 |

| `24-11-05-033` | LAGOS | IKEJA | IN FRONT OF NO. 1 BISI OGABI ST. | 521 | **586** | +65 | added | 2026-11-09 |

| `31-16-09-006` | PLATEAU | SHENDAM | YARGAM STREET | 750 | **750** | 0 | added | 2026-11-09 |

| `32-12-17-005` | RIVERS | GOKANA | C.P.S. VI BIARA GIONSUGI II | 750 | **758** | +8 | added | 2026-11-09 |

| `03-16-06-005` | AKWA IBOM | ITU | VILLAGE SQUARE, ADANG | 588 | **615** | +27 | added | 2026-11-09 |

| `26-24-05-007` | NIGER | TAFA | YAGURU S/NOMA ALBARKA  I | 825 | **819** | -6 | added | 2026-11-09 |

| `02-02-02-002` | ADAMAWA | FUFORE | FARANG PRY SCH II | 956 | **936** | -20 | added | 2026-11-09 |

| `35-13-05-008` | YOBE | NGURU | ANGUWAN NASARAWA | 90 | **213** | +123 | added | 2026-11-09 |

| `08-21-13-138` | BORNO | MAIDUGURI M. C. | MOHAMMED GREMA MUSTAPHA'S GATE | 11 | **22** | +11 | added | 2026-11-09 |

| `30-31-04-003` | OYO | SAKI EAST | BAPTIST PRIMARY SCHOOL, OGBOORO I | 717 | **769** | +52 | added | 2026-11-09 |

| `31-12-02-002` | PLATEAU | MIKANG | ANGUWAN HAUSAWA | 813 | **803** | -10 | added | 2026-11-09 |

| `30-22-04-004` | OYO | OGBOMOSO SOUTH | ODO KOTO II | 797 | **823** | +26 | added | 2026-11-09 |

| `28-16-08-036` | ONDO | ONDO WEST | OPEN SPACE AT 16 AKINMORIN STREET | 88 | **200** | +112 | added | 2026-11-09 |

| `06-06-03-012` | BAYELSA | SAGBAMA | UTORODE-IBIAKO | 186 | **337** | +151 | added | 2026-11-09 |

| `37-06-10-079` | FCT | MUNICIPAL | HENRY CHUKWUEDO STREET HAYATUL ISLAMIC SCHOOL F.H.A. KARU | 483 | **497** | +14 | added | 2026-11-09 |

| `32-02-10-015` | RIVERS | AHOADA EAST | IHUAMA, TOWN HALL | 792 | **816** | +24 | added | 2026-11-09 |

| `26-24-04-007` | NIGER | TAFA | CHIPO PRY SCHOOL | 152 | **281** | +129 | added | 2026-11-09 |

| `22-12-09-005` | KOGI | LOKOJA | SHEVUN AREA, OPEN SPACE SHEVUN | 235 | **241** | +6 | added | 2026-11-09 |

| `32-17-08-010` | RIVERS | OGU/BOLO | OPEN SPACE ANNE | 255 | **257** | +2 | added | 2026-11-09 |

| `25-04-09-008` | NASARAWA | KARU | SAKA CIKIN GARI - OP | 750 | **752** | +2 | added | 2026-11-09 |

| `07-11-01-001` | BENUE | KWANDE | ADIKPO COMP. COLLEGE I - ADIKPO | 750 | **786** | +36 | added | 2026-11-09 |

| `15-02-04-012` | GOMBE | BALANGA | GARU WEST, MATERNITY | 726 | **794** | +68 | added | 2026-11-09 |

| `31-06-04-023` | PLATEAU | JOS SOUTH | RANKYENG  11 | 750 | **783** | +33 | added | 2026-11-09 |

| `01-10-11-004` | ABIA | OHAFIA | ISIOBA / NDI OWU / AKARANDU I - COMM. PRI. SCH. UKWA | 647 | **690** | +43 | added | 2026-11-09 |

| `33-04-08-020` | SOKOTO | GADA | HOLAI BUZAYE, PRY SCH | 172 | **176** | +4 | added | 2026-11-09 |

| `30-21-02-007` | OYO | OGBOMOSO NORTH | ILE AJO CARPENTER I | 538 | **538** | 0 | added | 2026-11-09 |

| `22-17-07-038` | KOGI | OKENE | OPEN SPACE EKUKU COMMUNITY, AGASSA | 350 | **498** | +148 | added | 2026-11-09 |

| `26-03-10-001` | NIGER | BIDA | ALHAJI NDALIMAN | 675 | **731** | +56 | added | 2026-11-09 |

| `03-31-11-018` | AKWA IBOM | UYO | OPEN SPACE BY NO 8 OKON INYANG STRT | 750 | **749** | -1 | added | 2026-11-09 |

| `04-19-13-002` | ANAMBRA | ORUMBA NORTH | CENTRAL SCHOOL, OZU II | 252 | **279** | +27 | added | 2026-11-09 |

| `24-20-04-035` | LAGOS | SURULERE | JUNCTION OF ADEDOYIN ST./CALFOS ST. I | 892 | **873** | -19 | added | 2026-11-09 |

| `23-08-02-011` | KWARA | ILORIN-WEST | ODE KOTO (POPO GIWA) | 901 | **888** | -13 | added | 2026-11-09 |

| `36-08-01-003` | ZAMFARA | KAURA NAMODA | DAN TABKI  /  SHIYAR DAN TABKI | 465 | **795** | +330 | added | 2026-11-09 |

| `32-05-04-010` | RIVERS | ANDONI | OTUOSO VILLAGE SQUARE | 730 | **811** | +81 | added | 2026-11-09 |

| `09-06-04-021` | CROSS RIVER | BIASE | OPEN SPACE AKPET CENTRAL SHOPPING COMPLEX | 750 | **803** | +53 | added | 2026-11-09 |

| `02-21-05-016` | ADAMAWA | YOLA SOUTH | NGURORE PRI. SCH./ NGURORE PRI. SCH. | 750 | **924** | +174 | added | 2026-11-09 |

| `23-06-04-014` | KWARA | ILORIN EAST | SAMSUDEEN L.G.E.A SCH III | 786 | **812** | +26 | added | 2026-11-09 |

| `18-20-11-001` | KADUNA | SANGA | UNG SARKI NANDU | 553 | **533** | -20 | added | 2026-11-09 |

| `30-20-04-021` | OYO | LAGELU | OPEN  SPACE BESIDE ARABIC INSTITUTE ILE-IGBON | 750 | **938** | +188 | added | 2026-11-09 |

| `15-09-03-014` | GOMBE | NAFADA | ABBA ISARI, KOFAR MAI ISARI | 374 | **397** | +23 | added | 2026-11-09 |

| `08-13-03-003` | BORNO | JERE | DALA BULAMA  .M | 1190 | **1349** | +159 | added | 2026-11-09 |

| `19-06-05-001` | KANO | BUNKURE | BUNKAU | 371 | **444** | +73 | added | 2026-11-09 |

| `24-03-03-084` | LAGOS | ALIMOSHO | LIASU ROAD COUNCIL JUNCTION, IDIMU | 750 | **772** | +22 | added | 2026-11-09 |

| `37-02-07-074` | FCT | BWARI | DUTSE BY CAPVILLE | 34 | **47** | +13 | added | 2026-11-09 |

| `24-10-01-015` | LAGOS | IFAKO-IJAYE | 1, MUYIWA CLOSE OFF AJAYI RD. OGBA | 872 | **846** | -26 | added | 2026-11-09 |

| `04-01-19-018` | ANAMBRA | AGUATA | IBUGHUBU VILLAGE | 20 | **78** | +58 | added | 2026-11-09 |

| `14-08-01-001` | ENUGU | IGBO EZE NORTH | C.S. AJI | 1309 | **1370** | +61 | added | 2026-11-09 |

| `18-10-07-007` | KADUNA | KADUNA SOUTH | GH 3 LERE STREET | 630 | **641** | +11 | added | 2026-11-09 |

| `18-17-08-038` | KADUNA | LERE | MAKERA / MAI SAWA | 116 | **116** | 0 | added | 2026-11-09 |

| `03-17-10-003` | AKWA IBOM | MBO | VILLAGE HALL, UDINGHI | 783 | **812** | +29 | added | 2026-11-09 |

| `01-07-07-017` | ABIA | ISIALA NGWA SOUTH | UMUOLIHIE  - VILLAGE HALL | 142 | **199** | +57 | added | 2026-11-09 |

| `17-26-01-016` | JIGAWA | TAURA | NAHUCE YAMMA PRI. SCH. II | 643 | **661** | +18 | added | 2026-11-09 |

| `18-02-05-024` | KADUNA | CHIKUN | LAYI GIDAN DANGUDE | 89 | **145** | +56 | added | 2026-11-09 |

| `28-06-02-059` | ONDO | AKURE SOUTH | OPEN SPACE BESIDE WHITE HOUSE  BY TRANSFORMER FALOWO | 24 | **51** | +27 | added | 2026-11-09 |

| `05-17-08-017` | BAUCHI | TAFAWA BALEWA | GITAL NOMADIC | 280 | **412** | +132 | added | 2026-11-09 |

| `19-23-09-007` | KANO | KIBIYA | FARAN HAYIN-HALILU II | 509 | **680** | +171 | added | 2026-11-09 |

| `20-29-03-016` | KATSINA | MUSAWA | DANJANKU II PRI.SCHOOL | 842 | **854** | +12 | added | 2026-11-09 |

| `10-22-03-024` | DELTA | UVWIE | OPEN SPACE BY BENDEL CLINIC | 165 | **213** | +48 | added | 2026-11-09 |

| `19-30-05-017` | KANO | MINJIBIR | JIRGABAWA PRIMARY SCH. | 320 | **385** | +65 | added | 2026-11-09 |

| `11-13-05-001` | EBONYI | ONICHA | UGWUENU PRIMARY SCHOOL | 750 | **804** | +54 | added | 2026-11-09 |

| `21-03-01-016` | KEBBI | ARGUNGU | SABON GARIN TUNGAR MARINA | 707 | **926** | +219 | added | 2026-11-09 |

| `37-02-08-039` | FCT | BWARI | PAZE VILLAGE SQUARE CHIEF PALACE | 105 | **175** | +70 | added | 2026-11-09 |

| `07-11-06-021` | BENUE | KWANDE | NKST. PRI. SCHOOL, CHAFA, SCHOOL PREMISES | 392 | **394** | +2 | added | 2026-11-09 |

| `12-12-12-001` | EDO | OREDO | IBIWE  I,  OBA MKT. PREMISES I | 902 | **886** | -16 | added | 2026-11-09 |

| `30-07-08-008` | OYO | IBADAN NORTH EAST | ST. PETER'S AREMO II | 750 | **732** | -18 | added | 2026-11-09 |

| `22-12-08-023` | KOGI | LOKOJA | INSIDE ADP QUARTERS FELELE ROAD | 750 | **1119** | +369 | added | 2026-11-09 |

| `19-31-10-026` | KANO | NASARAWA | TUDUN MURTALA, T/GARI I | 987 | **991** | +4 | added | 2026-11-09 |

| `31-10-06-004` | PLATEAU | LANGTANG SOUTH | KARKASHI PRIMARY SCHOOL | 975 | **962** | -13 | added | 2026-11-09 |

| `19-33-10-002` | KANO | RIMIN GADO | MAI AWAKI/HAYEWA, OPEN SPACE I | 634 | **661** | +27 | added | 2026-11-09 |

| `26-18-10-005` | NIGER | MUNYA | KAMPANI | 500 | **510** | +10 | added | 2026-11-09 |

| `21-08-08-031` | KEBBI | DANDI | ZANGO NEPA OFFICE | 66 | **136** | +70 | added | 2026-11-09 |

| `26-16-03-014` | NIGER | MASHEGU | GUNNA | 295 | **295** | 0 | added | 2026-11-09 |

| `20-11-09-008` | KATSINA | DUTSI | KAREMI PRI.SCHOOL | 614 | **629** | +15 | added | 2026-11-09 |

| `20-01-10-008` | KATSINA | BAKORI | UNG TAURA - K/G SAMBO KAILO | 424 | **428** | +4 | added | 2026-11-09 |

| `04-17-03-015` | ANAMBRA | ONITSHA-NORTH | OPEN SPACE BESIDE IBA ORAKWUE OPEN SPACE AGBA STREET | 8 | **33** | +25 | added | 2026-11-09 |

| `16-16-10-002` | IMO | OBOWO | MBARA IKORO VILL. SQ. II | 304 | **380** | +76 | added | 2026-11-09 |

| `16-01-01-017` | IMO | ABOH MBAISE | CENTRAL SCHOOL  EGBELU UMUHU | 750 | **756** | +6 | added | 2026-11-09 |

| `24-03-08-003` | LAGOS | ALIMOSHO | 3RD AVENUE 31 RD. D CLOSE   II | 750 | **731** | -19 | added | 2026-11-09 |

| `05-02-07-121` | BAUCHI | BAUCHI | KURMIN DORAWA K/MAKAMA | 134 | **211** | +77 | added | 2026-11-09 |

| `30-32-11-016` | OYO | SAKI WEST | BESIDE ELEWUODO | 750 | **767** | +17 | added | 2026-11-09 |

| `04-21-05-007` | ANAMBRA | OYI | EZIOYE VILLAGE HALL II | 260 | **270** | +10 | added | 2026-11-09 |

| `23-06-05-001` | KWARA | ILORIN EAST | FAMOLE L.G.E.A SCH | 243 | **271** | +28 | added | 2026-11-08 |

| `08-13-09-057` | BORNO | JERE | BAMODU GAMBOMI | 174 | **237** | +63 | added | 2026-11-08 |

| `18-19-01-007` | KADUNA | SABON GARI | YUSUF I/ YUSUF ROAD | 758 | **812** | +54 | added | 2026-11-08 |

| `33-07-03-006` | SOKOTO | GWADABAWA | KANGIYEN DAN INNA, KANGIYEN DAN INNA | 608 | **772** | +164 | added | 2026-11-08 |

| `14-05-13-003` | ENUGU | ENUGU SOUTH | NEW ERA BOYS' SECONDARY SCHOOL (NEBSS) III | 1336 | **1322** | -14 | added | 2026-11-08 |

| `13-01-13-023` | EKITI | ADO EKITI | PRY. SCH. AGO ADULOJU / AGO ADUGBOKUN , ADULOJU | 623 | **725** | +102 | added | 2026-11-08 |

| `03-03-02-016` | AKWA IBOM | EKET | OPEN SPACE EKPENE UKPA STREET, BESIDE NDUYE MEDICAL CENTRE. | 459 | **490** | +31 | added | 2026-11-08 |

| `10-12-01-025` | DELTA | NDOKWA WEST | UTAGBA - OGBE GRAMMAR SCHOOL - AKALA/EKWEKENE | 712 | **691** | -21 | added | 2026-11-08 |

| `24-13-04-109` | LAGOS | KOSOFE | ADESHIYAN ST., HOUSE NO. 11 | 75 | **95** | +20 | added | 2026-11-08 |

| `04-02-06-019` | ANAMBRA | AYAMELUM | AMA ERONYIA I | 482 | **554** | +72 | added | 2026-11-08 |

| `04-08-03-010` | ANAMBRA | DUNUKOFIA | ILOAMASATO SQUARE II | 356 | **376** | +20 | added | 2026-11-08 |

| `30-28-10-010` | OYO | ORI IRE | BOOSA OPEN SPACE II | 256 | **247** | -9 | added | 2026-11-08 |

| `02-03-04-028` | ADAMAWA | GANYE | MIN OF WORKS GANYE/BUNWAGAL II MATERNITY CLINIC | 457 | **621** | +164 | added | 2026-11-08 |

| `11-13-08-008` | EBONYI | ONICHA | IHUANI EZEIGBOKE VILLAGE SQUARE | 92 | **197** | +105 | added | 2026-11-08 |

| `01-11-02-044` | ABIA | OSISIOMA | UMUKAEGBU COUNCIL HALL I | 51 | **159** | +108 | added | 2026-11-08 |

| `16-22-08-011` | IMO | ORSU | UMUEGWUGWU HALL | 238 | **351** | +113 | added | 2026-11-08 |

| `30-21-09-018` | OYO | OGBOMOSO NORTH | AAJE IKOSE | 649 | **865** | +216 | added | 2026-11-08 |

| `24-13-05-169` | LAGOS | KOSOFE | INSIDE ORISIGUN PRIMARY SCHOOL | 43 | **105** | +62 | added | 2026-11-08 |

| `19-38-05-013` | KANO | TARAUNI | GYADI-GYADI, CENTRAL PRIMARY SCHOOL XIII | 1114 | **1138** | +24 | added | 2026-11-08 |

| `33-13-05-009` | SOKOTO | S/BIRNI | GIDAN HASSAN - GIDAN - HASSAN | 409 | **471** | +62 | added | 2026-11-08 |

| `29-18-09-002` | OSUN | ILESA EAST | ODI OLOWO AREA | 750 | **838** | +88 | added | 2026-11-08 |

| `31-14-11-058` | PLATEAU | QUA'AN PAN | PRIMARY SCHOOL PANKANG | 447 | **444** | -3 | added | 2026-11-08 |

| `14-08-15-006` | ENUGU | IGBO EZE NORTH | IKEM OBINETITI | 687 | **701** | +14 | added | 2026-11-08 |

| `12-12-10-014` | EDO | OREDO | OGBOKA/UNUERU  I I, OZA PRIMARY SCHOOL   VI | 539 | **575** | +36 | added | 2026-11-08 |

| `30-10-12-044` | OYO | IBADAN SOUTH WEST | OPEN SPACE AT OLURIN CLOSE II | 750 | **728** | -22 | added | 2026-11-08 |

| `19-22-09-008` | KANO | KARAYE | TSOHUWAR KARAYE II | 206 | **247** | +41 | added | 2026-11-08 |

| `10-09-11-020` | DELTA | ISOKO NORTH | OPEN SPACE, ODHEGBA STREET | 9 | **70** | +61 | added | 2026-11-08 |

| `37-06-05-038` | FCT | MUNICIPAL | GSS GWARINPA PRIMARY SCHOOL LIFE CAMP | 750 | **746** | -4 | added | 2026-11-08 |

| `12-02-10-009` | EDO | EGOR | UGBOWO PRIMARY SCH.,  UGBOWO II-I | 750 | **755** | +5 | added | 2026-11-08 |

| `30-02-05-056` | OYO | AKINYELE | FIELD AT ALADANLA, BARRACKS ROAD | 750 | **784** | +34 | added | 2026-11-08 |

| `10-05-10-003` | DELTA | ETHIOPE  EAST | EGBO/EKRUDU - EGBO | 258 | **291** | +33 | added | 2026-11-08 |

| `19-18-08-044` | KANO | GWALE | K/ WAIKA PRI. SCH...S. | 98 | **312** | +214 | added | 2026-11-08 |

| `28-01-01-002` | ONDO | AKOKO NORTH EAST | ODEKE/AISA/ODE ASSI ALU, IN FRONT OF CHIEF ASSIS HOUSE | 514 | **530** | +16 | added | 2026-11-08 |

| `04-10-06-005` | ANAMBRA | IDEMILI NORTH | UBUBA VILLAGE SQUARE | 1105 | **1139** | +34 | added | 2026-11-08 |

| `13-16-09-002` | EKITI | OYE | OSIKALU HALL - ILEOTUN / ILE OSE | 322 | **363** | +41 | added | 2026-11-08 |

| `15-08-05-006` | GOMBE | KWAMI | BULAMA DAUDA, SABON GADAM PRI. SCH. | 688 | **719** | +31 | added | 2026-11-08 |

| `19-03-05-012` | KANO | BAGWAI | K/ADAM PRI. SCH. II (KIYAWA K/ADAM II) | 569 | **638** | +69 | added | 2026-11-08 |

| `36-10-09-012` | ZAMFARA | MARU | BAKIN KASUWA RUMFAR DOGO II | 197 | **354** | +157 | added | 2026-11-08 |

| `24-18-02-027` | LAGOS | OSHODI/ISOLO | HOUSE 25 MOSAKU ST. | 750 | **740** | -10 | added | 2026-11-08 |

| `19-18-10-041` | KANO | GWALE | MA'AHAD KHALID ISLAMIYYA LITTAHFIZUL KUR'AN | 33 | **134** | +101 | added | 2026-11-08 |

| `19-42-07-031` | KANO | UNGOGO | RIJIYAR ZAKI III (A) | 34 | **61** | +27 | added | 2026-11-08 |

| `19-09-13-004` | KANO | DAWAKI KUDU | DISPENSARY | 549 | **567** | +18 | added | 2026-11-08 |

| `33-18-02-001` | SOKOTO | TAMBUWAL | BAKAYA - BAKAYA PRI.SCHOOL | 852 | **886** | +34 | added | 2026-11-08 |

| `24-01-05-010` | LAGOS | AGEGE | 19, ISAJIMI STREET | 757 | **735** | -22 | added | 2026-11-08 |

| `25-12-03-028` | NASARAWA | TOTO | LGEA PRI. SCH. JAWUN | 246 | **319** | +73 | added | 2026-11-08 |

| `31-12-07-009` | PLATEAU | MIKANG | MUANPUS | 1087 | **1114** | +27 | added | 2026-11-08 |

| `11-12-01-006` | EBONYI | OHAUKWU | OHAGE VILLAGE SQUARE EFFIUM | 589 | **593** | +4 | added | 2026-11-08 |

| `20-34-03-011` | KATSINA | ZANGO | 'ZANGO ABDU   /  YARKUKA | 750 | **792** | +42 | added | 2026-11-08 |

| `29-29-09-008` | OSUN | OROLU | AROHUN VILLAGE | 348 | **622** | +274 | added | 2026-11-08 |

| `02-13-07-001` | ADAMAWA | MICHIKA | CHASDEWOL  I / CHASDEWOL PRI. SCH. | 750 | **788** | +38 | added | 2026-11-08 |

| `01-04-01-019` | ABIA | BENDE | AMANKALU-OKPUFU VILLAGE HALL | 763 | **866** | +103 | added | 2026-11-08 |

| `34-12-11-004` | TARABA | TAKUM | KOFAR SARKI, KOFAR SARKI | 1076 | **1451** | +375 | added | 2026-11-08 |

| `28-18-11-008` | ONDO | OWO | AT. IMOGUN STREET, IMOGUN STREET II | 460 | **492** | +32 | added | 2026-11-08 |

| `02-15-01-001` | ADAMAWA | MUBI SOUTH | DIRBISHI/KOFAR ARDO DIRBISHI | 543 | **542** | -1 | added | 2026-11-08 |

| `04-03-09-009` | ANAMBRA | ANAMBRA EAST | NSUGBE CIVIC CENTRE | 166 | **228** | +62 | added | 2026-11-08 |

| `33-18-07-015` | SOKOTO | TAMBUWAL | SHIYAR FADAMA/RAFI - SHIYAR UBANDOMA | 719 | **812** | +93 | added | 2026-11-08 |

| `10-04-04-009` | DELTA | BURUTU | OKINEWARE/TAMUKUNOU  -  AYIBEBI II   P/G | 251 | **285** | +34 | added | 2026-11-08 |

| `16-04-03-012` | IMO | EZINIHITTE MBAISE | CENTRAL SCHOOL I | 759 | **779** | +20 | added | 2026-11-08 |

| `18-02-11-046` | KADUNA | CHIKUN | NAMSO STREET U/YELWA | 108 | **160** | +52 | added | 2026-11-08 |

| `19-07-05-028` | KANO | DALA | FILIN DURIMI, P/BUILDING X | 680 | **676** | -4 | added | 2026-11-08 |

| `24-03-04-058` | LAGOS | ALIMOSHO | OPP. 40 IJEGUN ROAD IKOTUN | 943 | **923** | -20 | added | 2026-11-08 |

| `26-11-09-011` | NIGER | KONTAGORA | RAFIN GORA PRY SCH. | 173 | **185** | +12 | added | 2026-11-08 |

| `17-03-05-016` | JIGAWA | BIRNIN KUDU | KWANGWARA PRI. SCH.  II | 54 | **114** | +60 | added | 2026-11-08 |

| `24-01-11-038` | LAGOS | AGEGE | 16, OMOTOYE ESTATE AGEGE | 112 | **211** | +99 | added | 2026-11-08 |

| `03-09-01-027` | AKWA IBOM | IBESIKPO ASUTAN | PRI. SCH. AFAHA IKOT OSSOM II | 98 | **114** | +16 | added | 2026-11-08 |

| `19-11-03-003` | KANO | DOGUWA | DOGUWA GABAS I | 764 | **786** | +22 | added | 2026-11-08 |

| `23-09-06-002` | KWARA | IREPODUN | ILE OLUPO  ODO OMU-ARAN II | 826 | **879** | +53 | added | 2026-11-08 |

| `19-05-02-022` | KANO | BICHI | S/LAYI KANTI NEW PRI. SCH. I (SABON LAYIYAMMA II) | 915 | **1034** | +119 | added | 2026-11-08 |

| `14-16-09-007` | ENUGU | UDI | AKAMA VILLAGE HALL I | 730 | **751** | +21 | added | 2026-11-08 |

| `19-41-05-004` | KANO | TUDUN WADA | GADANGA ISLAMIYYA  PRIMARY SCHOOL | 432 | **460** | +28 | added | 2026-11-08 |

| `25-04-11-114` | NASARAWA | KARU | MAI ANG. SAIDU USMAN AREA MARARABA | 750 | **819** | +69 | added | 2026-11-08 |

| `35-04-07-016` | YOBE | FIKA | KALIYO OPEN SPACE | 61 | **94** | +33 | added | 2026-11-08 |

| `30-07-02-009` | OYO | IBADAN NORTH EAST | JENRIYIN'S COMPOUND III | 433 | **473** | +40 | added | 2026-11-08 |

| `24-16-05-059` | LAGOS | MUSHIN | 2, OLAJUBU ST. II | 316 | **330** | +14 | added | 2026-11-08 |

| `32-22-04-013` | RIVERS | PORT HARCOURT | HOLY ROSARY SECONDARY SCHOOL III | 305 | **298** | -7 | added | 2026-11-08 |

| `30-05-06-007` | OYO | EGBEDA | AYEPE I | 750 | **716** | -34 | added | 2026-11-08 |

| `24-08-05-029` | LAGOS | ETI-OSA | ORILE MOBA TOWN | 3090 | **2936** | -154 | added | 2026-11-08 |

| `14-02-10-026` | ENUGU | AWGU | UMUANEKE VILLAGE SQAURE ITUKU | 58 | **59** | +1 | added | 2026-11-08 |

| `07-22-09-008` | BENUE | USHONGO | RCM SCHOOL UGAH | 734 | **749** | +15 | added | 2026-11-08 |

| `23-06-04-027` | KWARA | ILORIN EAST | OPEN SPACE INFRONT OF ILE ELESIN META OKELELE | 188 | **400** | +212 | added | 2026-11-08 |

| `37-02-09-065` | FCT | BWARI | DEIDEI MOPOL BARRACKS UNDER TELECOM MAST | 750 | **817** | +67 | added | 2026-11-08 |

| `14-03-12-018` | ENUGU | ENUGU EAST | UGWUOMU NIKE II | 427 | **429** | +2 | added | 2026-11-08 |

| `20-23-01-017` | KATSINA | KUSADA | BAKIN KASUWA ISLAMIYYA | 186 | **309** | +123 | added | 2026-11-08 |

| `34-06-05-023` | TARABA | IBI | ZENA PRIMARY SCHOOL NWONYO II,IBI | 326 | **478** | +152 | added | 2026-11-08 |

| `22-18-10-006` | KOGI | OLAMABORO | OPEN SPACE, UJUGBUDU | 458 | **524** | +66 | added | 2026-11-08 |

| `24-03-07-024` | LAGOS | ALIMOSHO | IN FRONT OF BLK. 490 | 837 | **803** | -34 | added | 2026-11-08 |

| `26-04-10-004` | NIGER | BORGU | KORO ZEB | 1118 | **1308** | +190 | added | 2026-11-08 |

| `04-03-14-001` | ANAMBRA | ANAMBRA EAST | AKWETE PUBLIC SQUARE I | 555 | **584** | +29 | added | 2026-11-08 |

| `23-13-04-013` | KWARA | OFFA | OPEN SPACE BELEORE II | 29 | **79** | +50 | added | 2026-11-08 |

| `32-15-03-034` | RIVERS | OBIO/AKPOR | OBIRI OKENE RUMUWEKEREBE RUMUOKWURUSI | 140 | **153** | +13 | added | 2026-11-08 |

| `27-05-08-010` | OGUN | EGBADO SOUTH | COMM. PRY SCHOOL OWODE I | 772 | **773** | +1 | added | 2026-11-08 |

| `34-11-10-008` | TARABA | SARDAUNA | TITONG I, TITONG PRIMARY SCHOOL | 1426 | **1516** | +90 | added | 2026-11-08 |

| `20-30-02-015` | KATSINA | RIMI | UNGUWAR YAN ALBASA | 101 | **128** | +27 | added | 2026-11-08 |

| `08-03-02-010` | BORNO | BAMA | BANKI GONIRI I | 645 | **646** | +1 | added | 2026-11-08 |

| `23-10-07-001` | KWARA | ISIN | COURT AREA OPEN SPACE | 851 | **853** | +2 | added | 2026-11-08 |

| `24-10-03-059` | LAGOS | IFAKO-IJAYE | 1,BILEWU OSHUFFA STR, IFAKO | 62 | **90** | +28 | added | 2026-11-08 |

| `12-12-03-033` | EDO | OREDO | OPEN SPACE, OWEGIE STREET BY 5TH EHENEDE JUNCTION. | 49 | **86** | +37 | added | 2026-11-08 |

| `16-27-03-002` | IMO | OWERRI WEST | COMM. SCHOOL OBOGWU | 750 | **773** | +23 | added | 2026-11-08 |

| `19-41-09-019` | KANO | TUDUN WADA | UNGUWA JIBRIN - PRIMARY SCHOOL V | 683 | **691** | +8 | added | 2026-11-08 |

| `10-13-03-023` | DELTA | OKPE | OPEN SPACE BY AYO SIGNBOARD STREET JUNCTION, OKUOKOKO | 739 | **753** | +14 | added | 2026-11-08 |

| `15-09-01-012` | GOMBE | NAFADA | DADINKOWA,  KOFAR JAURO JEIYO | 313 | **420** | +107 | added | 2026-11-08 |

| `17-16-01-008` | JIGAWA | KAUGAMA | KANJUWA GARI - KANJUWA | 235 | **307** | +72 | added | 2026-11-08 |

| `27-15-09-004` | OGUN | OBAFEMI/OWODE | O.O.L.G. SCHOOL, IDI OSAN | 356 | **359** | +3 | added | 2026-11-08 |

| `25-01-10-020` | NASARAWA | AKWANGA | ANGWAN CHUN MADA | 143 | **255** | +112 | added | 2026-11-08 |

| `19-36-05-003` | KANO | SUMAILA | DINGAMU, PRIMARY SCHOOL I | 602 | **605** | +3 | added | 2026-11-08 |

| `23-06-04-051` | KWARA | ILORIN EAST | OPEN SPACE ODE AMODE | 750 | **1165** | +415 | added | 2026-11-08 |

| `19-14-02-012` | KANO | GARKO | LAMA | 751 | **750** | -1 | added | 2026-11-08 |

| `16-24-09-001` | IMO | ORU WEST | UMUORJI GIRLS' SECONDARY SCHOOL I | 867 | **876** | +9 | added | 2026-11-08 |

| `18-14-06-004` | KADUNA | KAURU | KARKUN KASA/ K/G MAIUNGUWA | 750 | **777** | +27 | added | 2026-11-08 |

| `34-08-11-018` | TARABA | KARIM-LAMIDO | MAINA  PRIMARY SCHOOLANG ROGO | 259 | **268** | +9 | added | 2026-11-08 |

| `08-21-13-183` | BORNO | MAIDUGURI M. C. | IBRAHIM MAI SUGAR'S GATE | 81 | **125** | +44 | added | 2026-11-08 |

| `12-15-09-001` | EDO | OVIA SOUTH WEST | AJAKURAMA,  AJAKURAMA P/SCHOOL | 750 | **791** | +41 | added | 2026-11-08 |

| `20-20-03-008` | KATSINA | KANKIA | UNGUWAR GADA K/G UNGUWA | 652 | **650** | -2 | added | 2026-11-08 |

| `08-13-07-054` | BORNO | JERE | BULAMA LAMINU | 183 | **309** | +126 | added | 2026-11-08 |

| `19-40-05-005` | KANO | TSANYAWA | KWASKI DANKUNDA I | 1117 | **1133** | +16 | added | 2026-11-08 |

| `34-13-11-003` | TARABA | USSA | RUFU BAKIN KASUWA I, BAKIN KASUWA | 955 | **1039** | +84 | added | 2026-11-08 |

| `10-09-01-005` | DELTA | ISOKO NORTH | ULLI PRIMARY SCHOOL, ULLI-IYEDE | 710 | **741** | +31 | added | 2026-11-08 |

| `22-03-06-017` | KOGI | ANKPA | UKPAJA, OPEN SPACE | 588 | **610** | +22 | added | 2026-11-08 |

| `23-13-04-010` | KWARA | OFFA | OPEN SPACE ILE ELEPA II | 46 | **85** | +39 | added | 2026-11-08 |

| `24-03-11-093` | LAGOS | ALIMOSHO | EMMANUEL ABENI BALOGUN STREET, ABULE EGBA | 376 | **387** | +11 | added | 2026-11-08 |

| `16-22-05-002` | IMO | ORSU | PEOPLES PRIM. SCH. UBAHAEZE II | 695 | **713** | +18 | added | 2026-11-08 |

| `21-06-04-017` | KEBBI | BIRNIN KEBBI | ILLELAR YARI DISPENSARY | 572 | **981** | +409 | added | 2026-11-08 |

| `30-06-02-019` | OYO | IBADAN NORTH | OPPOSITE NITEL ONIYANRIN | 744 | **765** | +21 | added | 2026-11-08 |

| `34-02-08-009` | TARABA | BALI | J/NABAYI, J/NABAYI | 1482 | **1572** | +90 | added | 2026-11-08 |

| `32-19-09-005` | RIVERS | OMUMA | UMUOFFKE TOWN HALL | 144 | **159** | +15 | added | 2026-11-08 |

| `36-06-01-020` | ZAMFARA | GUMMI | DADU / BAKIN KASUWA | 554 | **674** | +120 | added | 2026-11-08 |

| `03-22-10-002` | AKWA IBOM | OBOT AKARA | VILLAGE HALL, IKOT UKANA I | 725 | **735** | +10 | added | 2026-11-08 |

| `18-20-05-007` | KADUNA | SANGA | ABU MAKARANTA | 749 | **764** | +15 | added | 2026-11-08 |

| `30-07-04-001` | OYO | IBADAN NORTH EAST | ABIOYE'S COMPOUND | 533 | **613** | +80 | added | 2026-11-08 |

| `33-08-01-028` | SOKOTO | ILLELA | YAR TANDA HANYAR KWANNI | 619 | **1096** | +477 | added | 2026-11-08 |

| `07-10-10-008` | BENUE | KONSHISHA | IKYOMBUN LGED SCHOOL - IKYOMBUN | 721 | **867** | +146 | added | 2026-11-08 |

| `25-08-05-031` | NASARAWA | LAFIA | AGYE | 420 | **611** | +191 | added | 2026-11-08 |

| `29-15-01-002` | OSUN | IFE NORTH | ST. JOHN'S SCHOOL II, ASIPA | 439 | **537** | +98 | added | 2026-11-08 |

| `08-21-12-007` | BORNO | MAIDUGURI M. C. | YERIMA BOYI  I | 592 | **599** | +7 | added | 2026-11-08 |

| `18-16-09-008` | KADUNA | KUDAN | UNG. WALI/ PRI. SCH. | 810 | **815** | +5 | added | 2026-11-08 |

| `34-14-08-033` | TARABA | WUKARI | ORPHANAGE PRIMARY SCHOOL | 47 | **172** | +125 | added | 2026-11-08 |

| `26-22-04-028` | NIGER | SHIRORO | GOV'T JNR SEC SCH GWADA | 602 | **626** | +24 | added | 2026-11-08 |

| `20-12-06-007` | KATSINA | DUTSIN-MA | A & B TASHAR ALA | 367 | **371** | +4 | added | 2026-11-08 |

| `24-10-09-109` | LAGOS | IFAKO-IJAYE | 1, EWA OLUWA STR. OFF ALAKUKO ROAD | 576 | **583** | +7 | added | 2026-11-08 |

| `33-13-09-005` | SOKOTO | S/BIRNI | TEKE MAIFULOTI | 746 | **940** | +194 | added | 2026-11-08 |

| `12-16-08-003` | EDO | OWAN EAST | NEAR THE TOWN HALL,  OTUO | 499 | **544** | +45 | added | 2026-11-08 |

| `03-31-10-016` | AKWA IBOM | UYO | ENEN IKPA JUNCTION, OPEN SPACE BY ETINGSEMA JUNCTION | 92 | **139** | +47 | added | 2026-11-08 |

| `19-12-01-013` | KANO | FAGGE | EL-DUNIYA V | 884 | **879** | -5 | added | 2026-11-08 |

| `32-22-01-007` | RIVERS | PORT HARCOURT | STATE SCHOOL OROMENIKE IV | 742 | **728** | -14 | added | 2026-11-08 |

| `10-06-01-008` | DELTA | ETHIOPE  WEST | IDJEKPOKPO/WILL ROYAL INTERNATIONAL COLLEGE | 353 | **461** | +108 | added | 2026-11-08 |

| `14-10-06-008` | ENUGU | ISI UZO | UGWU    ADAKA    VILL. SQUARE | 109 | **195** | +86 | added | 2026-11-08 |

| `17-06-01-010` | JIGAWA | DUTSE | MALORI | 407 | **421** | +14 | added | 2026-11-08 |

| `18-12-09-006` | KADUNA | KAJURU | IRI KADARA I/ K/G M/ANGUWA | 379 | **445** | +66 | added | 2026-11-08 |

| `34-03-05-002` | TARABA | DONGA | IMUDI II, KOFAR IMUDI II | 1551 | **1558** | +7 | added | 2026-11-08 |

| `11-08-08-010` | EBONYI | ISHIELU | ONU NWAEKE PRIMARY SCHOOL | 650 | **704** | +54 | added | 2026-11-08 |

| `30-21-07-003` | OYO | OGBOMOSO NORTH | OJUDE AJOMAGBODO | 567 | **612** | +45 | added | 2026-11-08 |

| `06-04-12-021` | BAYELSA | NEMBE | NDATIRI VILLAGE SQUARE | 233 | **250** | +17 | added | 2026-11-08 |

| `34-02-02-027` | TARABA | BALI | BAMBADOPRIMARY SCHOOL | 57 | **350** | +293 | added | 2026-11-08 |

| `11-10-01-015` | EBONYI | IZZI | NDIOGA EDUKWU NWAFIA | 560 | **547** | -13 | added | 2026-11-08 |

| `01-02-10-021` | ABIA | ABA SOUTH | MOSQUE NNEWI YOUTH HALL II | 536 | **521** | -15 | added | 2026-11-08 |

| `03-28-03-003` | AKWA IBOM | UKANAFUN | G/P/S NKEK ENEN IDO | 750 | **794** | +44 | added | 2026-11-08 |

| `16-02-06-008` | IMO | AHIAZU MBAISE | UMUDIWUKWAKU HALL | 505 | **510** | +5 | added | 2026-11-08 |

| `36-07-10-001` | ZAMFARA | GUSAU | GIDAN GABI / GARKAR MAI UNGUWA | 402 | **719** | +317 | added | 2026-11-08 |

| `23-13-08-006` | KWARA | OFFA | OPEN SPACE OLUOLO | 750 | **785** | +35 | added | 2026-11-08 |

| `06-08-06-043` | BAYELSA | YENAGOA | AZIKORO HEALTH CENTER | 244 | **309** | +65 | added | 2026-11-08 |

| `29-02-09-004` | OSUN | ATAKUMOSA WEST | ILOYA VILLAGE | 318 | **433** | +115 | added | 2026-11-08 |

| `07-04-04-022` | BENUE | BURUKU | TOM GERALD NUR PRI SCH, UGBEMA | 160 | **211** | +51 | added | 2026-11-08 |

| `23-15-03-005` | KWARA | OYUN | BOLORUNDURO LGEA SCH | 585 | **735** | +150 | added | 2026-11-08 |

| `05-20-02-014` | BAUCHI | ZAKI | DASSARE NEAR VILLAGE HEAD | 460 | **463** | +3 | added | 2026-11-08 |

| `24-11-10-056` | LAGOS | IKEJA | NO.13 ADEYEMI ADEOYE STREET | 9 | **262** | +253 | added | 2026-11-08 |

| `04-07-01-002` | ANAMBRA | AWKA SOUTH | BUREAU OF LANDS SQUARE I | 790 | **777** | -13 | added | 2026-11-08 |

| `10-03-02-006` | DELTA | BOMADI | AMALASAN/C/MATERNITY KPAKIAMA | 1037 | **1145** | +108 | added | 2026-11-08 |

| `31-15-10-010` | PLATEAU | RIYOM | LEA PRY SCHOOL JEBBU II | 77 | **89** | +12 | added | 2026-11-08 |

| `29-27-01-021` | OSUN | OLORUNDA | OPEN SPACE, T-JUNCTION, AROUND DEDON KING LOTTERIES, ALAAFIA AREA, OSOGBO | 750 | **780** | +30 | added | 2026-11-08 |

| `32-14-09-003` | RIVERS | KHANA | EETE GUI | 1001 | **997** | -4 | added | 2026-11-08 |

| `27-03-01-010` | OGUN | ADO ODO-OTA | NEAR AHMADIYA MOSQUE | 801 | **888** | +87 | added | 2026-11-08 |

| `06-07-10-010` | BAYELSA | SOUTHERN IJAW | PREYE COMM. SQUARE | 319 | **331** | +12 | added | 2026-11-08 |

| `19-31-03-010` | KANO | NASARAWA | BRIGADE PRIMARY SCHOOL X | 712 | **713** | +1 | added | 2026-11-08 |

| `27-01-05-028` | OGUN | ABEOKUTA NORTH | OPEN SPACE AT TEMIDIRE AREA, OKE ARAKANGA | 94 | **163** | +69 | added | 2026-11-08 |

| `08-18-06-002` | BORNO | KWAYA / KUSAR | KWAYAKUSAR PRI. SCH. II | 1573 | **1566** | -7 | added | 2026-11-08 |

| `10-05-08-009` | DELTA | ETHIOPE  EAST | OKODAFE/EREGBE P/S I | 511 | **548** | +37 | added | 2026-11-08 |

| `18-04-12-090` | KADUNA | IGABI | UNG. WAKILI | 163 | **176** | +13 | added | 2026-11-08 |

| `07-21-08-014` | BENUE | UKUM | ATSOR VILLAGE (WRONGLY CODED AS 019 BEFORE) | 179 | **243** | +64 | added | 2026-11-08 |

| `19-34-10-007` | KANO | ROGO | GAUZA | 712 | **723** | +11 | added | 2026-11-08 |

| `19-13-01-004` | KANO | GABASAWA | CIKIN GARIN,  GABASAWA II | 937 | **991** | +54 | added | 2026-11-08 |

| `13-15-07-006` | EKITI | MOBA | C.A.C PRY SCH. / ODO IKOLE & ILE AGBARIGBA | 372 | **396** | +24 | added | 2026-11-08 |

| `27-14-02-013` | OGUN | IPOKIA | ITADO BASE ODANPOPO | 67 | **176** | +109 | added | 2026-11-08 |

| `10-12-10-020` | DELTA | NDOKWA WEST | EMU IYASELE PRIMARY SCHOOL - EMU IYASELE  I & II QUARTERS | 312 | **313** | +1 | added | 2026-11-08 |

| `29-08-05-001` | OSUN | EDE SOUTH | ORISUMBARE VILLAGE | 872 | **1127** | +255 | added | 2026-11-08 |

| `01-10-06-003` | ABIA | OHAFIA | NDI ECHECHE - NDI ECHECHE HALL | 591 | **665** | +74 | added | 2026-11-08 |

| `03-10-08-011` | AKWA IBOM | IBIONO IBOM | VILLAGE HALL, IKOT  IFOT  ONO  II | 325 | **335** | +10 | added | 2026-11-08 |

| `09-16-09-036` | CROSS RIVER | OGOJA | OPPOSITE FRSC OFFICE STADIUM ROAD | 646 | **656** | +10 | added | 2026-11-08 |

| `19-38-07-011` | KANO | TARAUNI | KAUYEN ALU PRIMARY SCHOOL IV (KAUYEN MOHAMMADU IV) | 689 | **706** | +17 | added | 2026-11-08 |

| `30-04-02-001` | OYO | ATISBO | MATERNITY CENTRE | 364 | **388** | +24 | added | 2026-11-08 |

| `04-17-10-011` | ANAMBRA | ONITSHA-NORTH | HERITAGE AVENUE PLAY GROUND I | 772 | **789** | +17 | added | 2026-11-08 |

| `30-29-04-009` | OYO | OYO EAST | APAARA VILLAGE | 127 | **130** | +3 | added | 2026-11-08 |

| `12-13-05-006` | EDO | ORHIONMWON | IBIEGUAE VILLAGE SQUARE, UGO | 750 | **789** | +39 | added | 2026-11-08 |

| `10-15-03-012` | DELTA | OSHIMILI - SOUTH | IN FRONT OF OKWE POLICE BARRACKS | 750 | **744** | -6 | added | 2026-11-08 |

| `14-13-01-018` | ENUGU | NSUKKA | ISIBEGUA VILLAGE SQUARE OPI AGU | 284 | **283** | -1 | added | 2026-11-08 |

| `07-11-01-019` | BENUE | KWANDE | ADANYI BUR JUNCTION, FRONT OF ADANYI'S HOUSE | 734 | **750** | +16 | added | 2026-11-08 |

| `04-03-02-009` | ANAMBRA | ANAMBRA EAST | ERULU VILLAGE HALL | 191 | **357** | +166 | added | 2026-11-08 |

| `21-14-09-004` | KEBBI | MAIYAMA | MUNGADI KASUWAR DAJI (MUNGADI KAURA 'A') | 750 | **785** | +35 | added | 2026-11-08 |

| `03-17-08-009` | AKWA IBOM | MBO | VILLAGE SQUARE, IDAK IKONO, IBAKA, MBO | 481 | **501** | +20 | added | 2026-11-08 |

| `19-12-06-066` | KANO | FAGGE | NATSUGUNE PRIMARY SCHOOL II | 519 | **587** | +68 | added | 2026-11-08 |

| `32-15-08-015` | RIVERS | OBIO/AKPOR | STATE SCHOOL I TOWN HALL | 1332 | **1307** | -25 | added | 2026-11-08 |

| `05-07-06-013` | BAUCHI | GAMAWA | TUMBI,  PRIMARY SACHOOL III | 393 | **448** | +55 | added | 2026-11-08 |

| `30-28-01-009` | OYO | ORI IRE | LADOKUN JUNCTION, ILUJU I | 750 | **751** | +1 | added | 2026-11-08 |

| `01-07-05-001` | ABIA | ISIALA NGWA SOUTH | UMUEZU - UMUEZU HALL | 742 | **816** | +74 | added | 2026-11-08 |

| `31-14-02-001` | PLATEAU | QUA'AN PAN | KOPDANGLOE | 1248 | **1296** | +48 | added | 2026-11-08 |

| `08-21-09-043` | BORNO | MAIDUGURI M. C. | ABBA TAR KAGALMARI I | 434 | **432** | -2 | added | 2026-11-08 |

| `28-02-04-008` | ONDO | AKOKO NORTH WEST | ADE CLINIC OGE , BOBOYE/FADAMULA | 505 | **556** | +51 | added | 2026-11-08 |

| `36-05-03-023` | ZAMFARA | BUNGUDU | DAN SOKOTO II/ PRI.SCH | 446 | **473** | +27 | added | 2026-11-08 |

| `03-13-06-006` | AKWA IBOM | IKOT ABASI | VILLAGE SQUARE, ATAESSIEN UKAN | 750 | **779** | +29 | added | 2026-11-08 |

| `19-38-01-038` | KANO | TARAUNI | ADO GWARAM SCIENCE SEC. SCH. III | 44 | **69** | +25 | added | 2026-11-08 |

| `14-15-09-014` | ENUGU | UDENU | AMAOBA TOWN HALL | 709 | **706** | -3 | added | 2026-11-08 |

| `07-16-02-031` | BENUE | OJU | OBI-IJEGWU II - PLAY GROUND | 467 | **529** | +62 | added | 2026-11-08 |

| `17-03-05-015` | JIGAWA | BIRNIN KUDU | BARIKIN DAN GIWA/ BARIKIN DAN GIWA | 558 | **628** | +70 | added | 2026-11-08 |

| `01-06-04-024` | ABIA | ISIALA NGWA NORTH | MGBEDEALA VILLAGE HALL, AMORJI | 103 | **105** | +2 | added | 2026-11-08 |

| `14-03-05-012` | ENUGU | ENUGU EAST | C.P.S.  NEKE ODENIGBO II | 163 | **166** | +3 | added | 2026-11-08 |

| `04-05-19-014` | ANAMBRA | ANAOCHA | G.S.S OBALEDU | 677 | **773** | +96 | added | 2026-11-08 |

| `19-10-11-019` | KANO | DAWAKI TOFA | KATAYARI | 655 | **701** | +46 | added | 2026-11-08 |

| `18-02-09-027` | KADUNA | CHIKUN | KUNDANSA IV KOFAR/G LIMAN | 896 | **936** | +40 | added | 2026-11-08 |

| `19-39-06-008` | KANO | TOFA | TUDUN MALAMA C/GARI, HEALTH POST | 928 | **1061** | +133 | added | 2026-11-08 |

| `05-06-02-006` | BAUCHI | DASS | BUNDULIN KASA,  BUNDULIN KASA PRIMARY SCHOOL | 308 | **314** | +6 | added | 2026-11-08 |

| `10-24-04-022` | DELTA | WARRI SOUTH | MAIN GATE NPA II | 198 | **205** | +7 | added | 2026-11-08 |

| `23-07-04-037` | KWARA | ILORIN-SOUTH | OPEN SPACE, JUDGES QUARTERS JUNCTION, TANKE | 98 | **339** | +241 | added | 2026-11-08 |

| `04-11-12-039` | ANAMBRA | IDEMILI-SOUTH | COMMUNITY PRIMARY SCHOOL I | 86 | **91** | +5 | added | 2026-11-08 |

| `26-06-02-008` | NIGER | CHANCHAGA | FADUKPE | 1144 | **1288** | +144 | added | 2026-11-08 |

| `19-18-10-035` | KANO | GWALE | MAITASA PRI. SCH.. | 109 | **252** | +143 | added | 2026-11-08 |

| `21-15-04-005` | KEBBI | NGASKI | OPEN SPACE FILIN MANGORO (RAI SHE) | 721 | **714** | -7 | added | 2026-11-08 |

| `17-23-06-037` | JIGAWA | RINGIM | HURUMI VIEWING  CENTRE/HURUMI/TSIGI III | 105 | **208** | +103 | added | 2026-11-08 |

| `24-11-05-021` | LAGOS | IKEJA | IN FRONT OF NO. 6, MUSLIM AVENUE | 469 | **464** | -5 | added | 2026-11-08 |

| `26-04-02-016` | NIGER | BORGU | YUMMU CENT. MARKET | 57 | **162** | +105 | added | 2026-11-08 |

| `24-07-05-035` | LAGOS | EPE | APENA/OLOYE ST. II | 223 | **284** | +61 | added | 2026-11-08 |

| `14-07-06-002` | ENUGU | IGBO ETITI | AMANGWU HALL | 294 | **303** | +9 | added | 2026-11-08 |

| `17-23-04-005` | JIGAWA | RINGIM | KUKA PRI. SCH. KUKA MAI RUWA | 420 | **452** | +32 | added | 2026-11-08 |

| `04-20-12-012` | ANAMBRA | ORUMBA  SOUTH | UMUNEBO PUBLIC SQUARE II | 251 | **261** | +10 | added | 2026-11-08 |

| `05-14-04-027` | BAUCHI | MISAU | EMIRS PALACE,  EMIRS PALACE II | 1173 | **1172** | -1 | added | 2026-11-08 |

| `19-43-07-008` | KANO | WARAWA | AMANA CITY ISLAMIYYA | 416 | **471** | +55 | added | 2026-11-08 |

| `08-06-06-002` | BORNO | CHIBOK | KORONGILIM ZARMA | 427 | **446** | +19 | added | 2026-11-08 |

| `16-02-05-011` | IMO | AHIAZU MBAISE | GROUP SCHOOL UMUOKIRIKA | 763 | **759** | -4 | added | 2026-11-08 |

| `01-11-02-056` | ABIA | OSISIOMA | UKWU MANGO SQUARE II | 750 | **894** | +144 | added | 2026-11-08 |

| `19-41-06-022` | KANO | TUDUN WADA | TITIN DORAYI BY KAMFA | 246 | **256** | +10 | added | 2026-11-08 |

| `22-15-04-001` | KOGI | OGORI MANGOGO | OPEN SPACE OKESI, OGORI | 436 | **478** | +42 | added | 2026-11-08 |

| `37-06-10-026` | FCT | MUNICIPAL | UNG HAUSAWA WOMEN CENTER KATAMPE | 61 | **183** | +122 | added | 2026-11-08 |

| `15-06-01-016` | GOMBE | GOMBE | IDI PRIMARY SCH. II | 112 | **203** | +91 | added | 2026-11-08 |

| `24-01-03-021` | LAGOS | AGEGE | 65, ONIWAYA ROAD | 792 | **776** | -16 | added | 2026-11-08 |

| `30-10-12-096` | OYO | IBADAN SOUTH WEST | COMM. RECREATION CENTER, MOOR PLANTATION, APATA | 316 | **310** | -6 | added | 2026-11-08 |

| `26-19-05-006` | NIGER | PAIKORO | SABO | 870 | **929** | +59 | added | 2026-11-08 |

| `16-10-05-004` | IMO | ISU | AMAIKWEAKU VILLAGE SQUARE | 358 | **445** | +87 | added | 2026-11-08 |

| `28-11-08-001` | ONDO | ILEOLUJI/OKEIGBO | OKE OJEGE, OKE OJEGE | 616 | **644** | +28 | added | 2026-11-08 |

| `32-18-09-001` | RIVERS | OKRIKA | NDUBUISI COMPOUND, NDUBUISI AMA  I | 522 | **529** | +7 | added | 2026-11-08 |

| `07-03-05-006` | BENUE | APA | OCHEKELE PLAY GROUND | 346 | **365** | +19 | added | 2026-11-08 |

| `17-07-05-002` | JIGAWA | GARKI | SABON GARI PRI. SCH - SABON GARI | 402 | **411** | +9 | added | 2026-11-08 |

| `21-18-05-001` | KEBBI | SURU | DAKIN GARI KASUWA | 750 | **823** | +73 | added | 2026-11-08 |

| `19-12-07-010` | KANO | FAGGE | GAWON ALI X | 534 | **639** | +105 | added | 2026-11-08 |

| `11-08-01-005` | EBONYI | ISHIELU | EKE OMEGE PLAY GROUND | 620 | **649** | +29 | added | 2026-11-08 |

| `29-28-03-009` | OSUN | ORIADE | OGUNSEEMI'S HOUSE | 617 | **835** | +218 | added | 2026-11-08 |

| `12-06-06-017` | EDO | ESAN WEST | IREUKPEN MIXED SECONDARY SCHOOL | 464 | **956** | +492 | added | 2026-11-08 |

| `31-02-05-030` | PLATEAU | BASSA | GARKUWA | 72 | **137** | +65 | added | 2026-11-08 |

| `13-09-10-012` | EKITI | IJERO | OLUDE / GBADAMOSI - OLODE CAMP | 160 | **163** | +3 | added | 2026-11-08 |

| `16-15-11-006` | IMO | NWANGELE | UMUDURUIRE | 778 | **945** | +167 | added | 2026-11-08 |

| `34-03-01-010` | TARABA | DONGA | KOFAR SANI, KOFAR SANI | 1670 | **1660** | -10 | added | 2026-11-08 |

| `24-06-10-045` | LAGOS | BADAGRY | OPEN SPACE AT GBAGO, AJARA AGELASO | 155 | **191** | +36 | added | 2026-11-08 |

| `16-11-09-009` | IMO | MBAITOLI | DURUEJIAKA KINDRED HALL I | 660 | **669** | +9 | added | 2026-11-08 |

| `20-26-10-010` | KATSINA | MANI | WALAWA PRI.SCHOOL | 923 | **1030** | +107 | added | 2026-11-08 |

| `15-04-01-001` | GOMBE | DUKKU | HINNA G/ABBA, G/ABBA PRI. SCH. | 750 | **775** | +25 | added | 2026-11-08 |

| `24-07-11-005` | LAGOS | EPE | OTA PRY. SCH. OTA II | 556 | **599** | +43 | added | 2026-11-08 |

| `08-13-07-050` | BORNO | JERE | UMAR GUJJA TOM | 291 | **323** | +32 | added | 2026-11-08 |

| `13-08-06-013` | EKITI | IDO / OSI | ISIMO NEAR , ILORI'S HOUSE | 269 | **297** | +28 | added | 2026-11-08 |

| `07-10-09-002` | BENUE | KONSHISHA | IORPUU MARKET - IORPUU | 431 | **455** | +24 | added | 2026-11-08 |

| `20-21-08-023` | KATSINA | KATSINA | UNGUWAR MADAWAKI K/G BARAYA | 146 | **163** | +17 | added | 2026-11-08 |

| `03-14-03-006` | AKWA IBOM | IKOT EKPENE | VILLAGE HALL, IKOT OTU | 582 | **644** | +62 | added | 2026-11-08 |

| `20-17-06-018` | KATSINA | KAFUR | SABON LAYIN BAJA PRI. SCHOOL | 28 | **120** | +92 | added | 2026-11-08 |

| `21-17-03-015` | KEBBI | SHANGA | PRI. SCH. RAHA (D/RAHA G/HAKIMI 'B') | 95 | **149** | +54 | added | 2026-11-08 |

| `35-14-02-026` | YOBE | POTISKUM | KOFAR SARKI PERMANENT STAND III | 403 | **433** | +30 | added | 2026-11-08 |

| `03-19-01-011` | AKWA IBOM | NSIT ATAI | AFAHA HALL ODOT III | 281 | **306** | +25 | added | 2026-11-08 |

| `19-07-11-043` | KANO | DALA | KUKA BULUKIYA PRI. SCHOOL, P/BUILD VI | 273 | **295** | +22 | added | 2026-11-08 |

| `20-09-05-010` | KATSINA | DAN MUSA | TASHAR KADANYA - TASHA KADANYA | 652 | **1114** | +462 | added | 2026-11-08 |

| `08-04-09-013` | BORNO | BAYO | KOFAR LAWAN WUYO | 77 | **133** | +56 | added | 2026-11-08 |

| `28-14-08-011` | ONDO | OKITIPUPA | IRAPETU QTRS, 12 BRD ST NEAR YASERES HOUSE | 402 | **412** | +10 | added | 2026-11-08 |

| `12-11-09-019` | EDO | IKPOBA/OKHA | OBAYANTOR  IYI - EWUARE PRIMARY SCHOOL  I | 605 | **668** | +63 | added | 2026-11-08 |

| `28-06-09-035` | ONDO | AKURE SOUTH | OPEN SPACE AT IWALEWA OPPOSITE GENERAL HOPISTAL | 332 | **318** | -14 | added | 2026-11-08 |

| `29-18-06-003` | OSUN | ILESA EAST | IJOKA IREWOLE CT & CS OFFICE | 454 | **486** | +32 | added | 2026-11-08 |

| `20-15-07-006` | KATSINA | INGAWA | KAFIN DUKU - K/DUKU GARI | 442 | **496** | +54 | added | 2026-11-08 |

| `36-01-07-015` | ZAMFARA | ANKA | UNGUWAR DAKARKARI | 133 | **184** | +51 | added | 2026-11-08 |

| `18-16-05-010` | KADUNA | KUDAN | UNG. AMFANI/ KGM AMFANI | 558 | **634** | +76 | added | 2026-11-08 |

| `05-15-02-007` | BAUCHI | NINGI | KATSINAWA ,   KOFAR MAI UNGUWA I | 620 | **645** | +25 | added | 2026-11-08 |

| `33-17-06-002` | SOKOTO | SOKOTO SOUTH | GARKA BOYI DANJATAU | 509 | **553** | +44 | added | 2026-11-08 |

| `14-07-12-006` | ENUGU | IGBO ETITI | CENTRAL SCHOOL, DIOGBE III | 432 | **438** | +6 | added | 2026-11-08 |

| `18-09-07-047` | KADUNA | KADUNA NORTH | BEFORE SCH OF HOME ECONOMICS | 13 | **15** | +2 | added | 2026-11-08 |

| `29-28-11-002` | OSUN | ORIADE | TOWN HALL, IJEDA | 525 | **571** | +46 | added | 2026-11-08 |

| `19-27-08-031` | KANO | KURA | MAKERA FARFARU | 512 | **632** | +120 | added | 2026-11-08 |

| `32-01-01-002` | RIVERS | ABUA-ODUAL | OGBEMA II, C.P.S HALL | 553 | **362** | -191 | added | 2026-11-08 |

| `15-04-08-045` | GOMBE | DUKKU | DUGGE KOFAR MAI UNGUWA II | 130 | **208** | +78 | added | 2026-11-08 |

| `02-19-06-003` | ADAMAWA | TOUNGO | KOGIN BABA/ KOGIN BABA PRI. SCH. | 774 | **863** | +89 | added | 2026-11-08 |

| `12-15-08-023` | EDO | OVIA SOUTH WEST | MAKPORO PRIMARY SCHOOL | 340 | **348** | +8 | added | 2026-11-08 |

| `24-20-11-049` | LAGOS | SURULERE | JUNCTION OF IJESHA ROAD/SAMUEL ABBEY ST. | 850 | **823** | -27 | added | 2026-11-08 |

| `09-09-12-053` | CROSS RIVER | CALABAR SOUTH | OPEN SPACE EKPO ABASI/MAYNE AVENUE | 101 | **115** | +14 | added | 2026-11-08 |

| `32-12-09-005` | RIVERS | GOKANA | STATE SCHOOL KPOR, NOMA BON II | 481 | **519** | +38 | added | 2026-11-08 |

| `07-05-10-003` | BENUE | GBOKO | MBAKPER - NR ORPHANAGE HOME | 473 | **489** | +16 | added | 2026-11-08 |

| `32-09-03-016` | RIVERS | ELEME | OPEN SPACE MKPONWII  ABII  ( TOWN HALL OSAROLUKA) | 525 | **530** | +5 | added | 2026-11-08 |

| `20-22-08-008` | KATSINA | KURFI | BARKIYA - BARKIYA | 578 | **774** | +196 | added | 2026-11-08 |

| `12-09-11-012` | EDO | ETSAKO  WEST | OGHEMESE AREA - OPEN SPACE | 1144 | **1148** | +4 | added | 2026-11-08 |

| `29-13-04-015` | OSUN | IFE EAST | OLUBUSE MEMORIAL HIGH SCHOOL AGANHUN, ABIRI, OGUDU ROAD | 275 | **457** | +182 | added | 2026-11-08 |

| `31-07-05-006` | PLATEAU | KANAM | KUKAWA PRY. SCHOOL | 1113 | **1108** | -5 | added | 2026-11-08 |

| `34-14-03-060` | TARABA | WUKARI | G/D PRIMARY SCHOOL IV | 81 | **96** | +15 | added | 2026-11-08 |

| `04-17-01-024` | ANAMBRA | ONITSHA-NORTH | OPEN SPACE BESIDE 1 NWOSISI LANE | 40 | **123** | +83 | added | 2026-11-08 |

| `03-31-01-022` | AKWA IBOM | UYO | CLEMENT ISIONG/PRINCE UTUK ST. JUNCTION (FED MIN. OF WORKS, FED. HOUSING ESTATE, ABAK RD) | 901 | **932** | +31 | added | 2026-11-08 |

| `19-37-02-005` | KANO | TAKAI | DURBUNDE DALLO | 339 | **381** | +42 | added | 2026-11-08 |

| `27-20-06-009` | OGUN | SAGAMU | OPEN SPACE @ SABINTU/AJEGUNLE JUNCTION. | 65 | **192** | +127 | added | 2026-11-08 |

| `24-20-05-035` | LAGOS | SURULERE | JUNCTION OF OLAJUWON ST/OJUELEGBA ROAD | 45 | **110** | +65 | added | 2026-11-08 |

| `14-08-02-014` | ENUGU | IGBO EZE NORTH | UMUOGBOAGU COMM. HEALTH CENTRE | 60 | **186** | +126 | added | 2026-11-08 |

| `26-23-02-006` | NIGER | SULEJA | OPPOSITE EGWUAGWU SUPER MARKET | 750 | **745** | -5 | added | 2026-11-08 |

| `19-35-01-006` | KANO | SHANONO | KOYA CHIKIN GARI | 412 | **639** | +227 | added | 2026-11-08 |

| `10-12-01-051` | DELTA | NDOKWA WEST | HEALTH CENTRE II | 50 | **132** | +82 | added | 2026-11-08 |

| `24-05-10-028` | LAGOS | APAPA | SADIKU STREET II | 627 | **617** | -10 | added | 2026-11-08 |

| `37-06-08-032` | FCT | MUNICIPAL | JUNIOR QUARTERS .  KARSHI | 396 | **554** | +158 | added | 2026-11-08 |

| `05-18-08-008` | BAUCHI | TORO | S/RIRIWAI,  KOFAR M/UNGUWA | 828 | **822** | -6 | added | 2026-11-08 |

| `18-07-09-003` | KADUNA | JEMA'A | TANDA DOGO/ TANDA DOGO | 626 | **858** | +232 | added | 2026-11-08 |

| `03-20-10-001` | AKWA IBOM | NSIT IBOM | PRY SCH, MBIASO | 750 | **781** | +31 | added | 2026-11-08 |

| `18-05-10-018` | KADUNA | IKARA | P.H.C KUYA GARI | 528 | **522** | -6 | added | 2026-11-08 |

| `19-23-09-014` | KANO | KIBIYA | CENTRAL ISLAMIYYA PRI. SCH. II (TARAI KOFAR GABAS) | 618 | **620** | +2 | added | 2026-11-08 |

| `16-16-07-011` | IMO | OBOWO | UMUOKORO HALL | 750 | **746** | -4 | added | 2026-11-08 |

| `10-25-03-018` | DELTA | WARRI SOUTH  WEST | OLUKPEREBU SARABUBOR TOWN HALL | 435 | **435** | 0 | added | 2026-11-08 |

| `04-16-03-011` | ANAMBRA | OGBARU | CENTRAL SCHOOL, ATANI III | 814 | **809** | -5 | added | 2026-11-08 |

| `27-15-09-002` | OGUN | OBAFEMI/OWODE | METHODIST SCHOOL OYERO, IKOSOFE | 210 | **219** | +9 | added | 2026-11-08 |

| `12-12-03-054` | EDO | OREDO | OPEN FIELD EZOMO PRIMARY SCHOOL 1 OFF SECOND CEMETERY II | 694 | **701** | +7 | added | 2026-11-08 |

| `37-02-04-023` | FCT | BWARI | DNABOYI VILLAGE | 113 | **188** | +75 | added | 2026-11-08 |

| `26-18-05-004` | NIGER | MUNYA | KUKPAN | 395 | **463** | +68 | added | 2026-11-08 |

| `17-06-04-024` | JIGAWA | DUTSE | ARIRI | 596 | **814** | +218 | added | 2026-11-08 |

| `07-11-13-012` | BENUE | KWANDE | TSE AKOUGH, NEAR TSE AKOUGH COMPOUND | 608 | **634** | +26 | added | 2026-11-08 |

| `23-03-02-003` | KWARA | EDU | LOCAL GOVT DISPENSARY | 750 | **792** | +42 | added | 2026-11-08 |

| `18-22-02-001` | KADUNA | ZANGON KATAF | MASHAN DAJI/ L.E.A. PRI. SCH. | 682 | **718** | +36 | added | 2026-11-08 |

| `36-09-03-020` | ZAMFARA | MARADUN | SHIYAR S/BURMI / SH/ARDO | 531 | **560** | +29 | added | 2026-11-08 |

| `27-03-01-034` | OGUN | ADO ODO-OTA | OPEN SPACE BESIDE TRANSFORMER AT UPRIGHT FOUNDATION STREET,OLOSUN | 116 | **212** | +96 | added | 2026-11-08 |

| `21-17-06-004` | KEBBI | SHANGA | PRIMARY SCHOOL DALA (DALA  'A') | 820 | **878** | +58 | added | 2026-11-08 |

| `20-14-02-012` | KATSINA | FUNTUA | TUDUN WADA K/G LAWAL KAFINTA | 651 | **844** | +193 | added | 2026-11-08 |

| `24-05-04-021` | LAGOS | APAPA | OPEN SPACE JUNCT.OF PLATEAU/BURMA ROAD | 283 | **411** | +128 | added | 2026-11-08 |

| `28-13-03-008` | ONDO | ODIGBO | MATERNITY CENTRE ASEWELE KOREDE, MATERNITY CENTRE ASEWELE KOREDE | 950 | **921** | -29 | added | 2026-11-08 |

| `04-15-04-001` | ANAMBRA | NNEWI SOUTH | EBENASA HALL I | 287 | **359** | +72 | added | 2026-11-08 |

| `01-01-06-016` | ABIA | ABA NORTH | URATTA COUNCIL HALL  - HALL PREMISES XVI | 750 | **743** | -7 | added | 2026-11-08 |

| `12-08-08-015` | EDO | ETSAKO EAST | EVEVA  P/S OKUGBE III OKUGBE | 440 | **469** | +29 | added | 2026-11-08 |

| `20-27-02-016` | KATSINA | MASHI | KOGON YAMMA/K/G YAMMA | 549 | **603** | +54 | added | 2026-11-08 |

| `09-14-01-007` | CROSS RIVER | OBUDU | BIWHUE PLAYGROUND | 723 | **800** | +77 | added | 2026-11-08 |

| `12-02-07-011` | EDO | EGOR | USELU MOTOR PARK,  USELU I-I | 563 | **557** | -6 | added | 2026-11-08 |

| `02-20-06-024` | ADAMAWA | YOLA NORTH | BACHURE PRIMARY SCHOOL V | 750 | **761** | +11 | added | 2026-11-08 |

| `11-03-06-016` | EBONYI | AFIKPO  SOUTH | AMAEMU V/HALL | 28 | **114** | +86 | added | 2026-11-08 |

| `20-14-06-023` | KATSINA | FUNTUA | BARE-BARI PRI. SCH. | 196 | **314** | +118 | added | 2026-11-08 |

| `20-02-02-004` | KATSINA | BATAGARAWA | BADO NORTH PRI. SCHOOL | 855 | **864** | +9 | added | 2026-11-08 |

| `12-03-05-001` | EDO | ESAN CENTRAL | AKHO PRY. SCHOL/AKHO I | 750 | **1066** | +316 | added | 2026-11-08 |

| `26-19-11-015` | NIGER | PAIKORO | FICHE KUCHI | 565 | **752** | +187 | added | 2026-11-08 |

| `24-12-05-060` | LAGOS | IKORODU | JUNCTION OF HAMMED KAROUNWI/ADEREMI ADEDIGBA STREET, ORI OKUTA II | 750 | **810** | +60 | added | 2026-11-08 |

| `28-08-03-005` | ONDO | IDANRE | BIODUN AKINKUOWO AREA, ST MICHAEL SCH YABA | 875 | **888** | +13 | added | 2026-11-08 |

| `24-15-11-008` | LAGOS | LAGOS MAINLAND | LAGOS STATE SCH. OF HEALTH TECH. | 1287 | **1312** | +25 | added | 2026-11-08 |

| `18-17-01-034` | KADUNA | LERE | UNG. BAWA LOW COST II | 432 | **521** | +89 | added | 2026-11-08 |

| `26-15-05-014` | NIGER | MARIGA | WAMBA | 1110 | **1107** | -3 | added | 2026-11-08 |

| `15-06-07-038` | GOMBE | GOMBE | KOFAN BALA MAI KWALTA | 177 | **282** | +105 | added | 2026-11-08 |

| `06-07-13-003` | BAYELSA | SOUTHERN IJAW | OZONIGBOPO OPEN SPACE | 283 | **338** | +55 | added | 2026-11-08 |

| `16-02-10-005` | IMO | AHIAZU MBAISE | COMMUNITY SCHOOL EZIAMA II | 440 | **487** | +47 | added | 2026-11-08 |

| `27-05-06-015` | OGUN | EGBADO SOUTH | A/C SCHOOL R.M. II OKE-ODAN II | 524 | **524** | 0 | added | 2026-11-08 |

| `28-06-09-064` | ONDO | AKURE SOUTH | BESIDE KCM BETHEL STREET CANNANLAND | 93 | **268** | +175 | added | 2026-11-08 |

| `05-05-01-019` | BAUCHI | DARAZO | LIFIDI ,  ANNEX  PRIMARY  SCHOOL II | 768 | **824** | +56 | added | 2026-11-08 |

| `01-14-04-005` | ABIA | UKWA  WEST | UGWUATI  COMMUNITY PRIMARY SCHOOL I | 612 | **699** | +87 | added | 2026-11-08 |

| `15-06-07-041` | GOMBE | GOMBE | KOFAR BALA MAI KANYA KEKE | 167 | **188** | +21 | added | 2026-11-08 |

| `22-12-09-004` | KOGI | LOKOJA | YABBA AREA, OPEN SPACE, YABBA | 477 | **514** | +37 | added | 2026-11-08 |

| `18-10-08-069` | KADUNA | KADUNA SOUTH | LEA UNGUWAN MUAZU 2 A BLOCK C | 512 | **552** | +40 | added | 2026-11-08 |

| `11-02-10-012` | EBONYI | AFIKPO NORTH | EZI UZUEKWE PLAY GROUND II | 343 | **355** | +12 | added | 2026-11-08 |

| `17-20-10-006` | JIGAWA | MAIGATARI | TSANI PRI. SCH. TSANI TATTARI | 344 | **390** | +46 | added | 2026-11-08 |

| `01-01-06-008` | ABIA | ABA NORTH | URATTA COUNCIL HALL  - HALL PREMISES VIII | 750 | **740** | -10 | added | 2026-11-08 |

| `20-18-05-006` | KATSINA | KAITA | ZABAKAU - ZABAKAU PRI.SCHOOL | 518 | **549** | +31 | added | 2026-11-08 |

| `16-26-04-008` | IMO | OWERRI NORTH | MBUTU UMUAWUKA VILLAGE SQUARE | 750 | **760** | +10 | added | 2026-11-08 |

| `30-06-08-052` | OYO | IBADAN NORTH | RAKAB VENTURES | 127 | **154** | +27 | added | 2026-11-08 |

| `15-04-08-043` | GOMBE | DUKKU | ALANI PRIM. SCH. UNGUWAN BAUCHI | 750 | **937** | +187 | added | 2026-11-08 |

| `18-18-02-015` | KADUNA | MAKARFI | GDSS TUDUN WADA III | 576 | **667** | +91 | added | 2026-11-08 |

| `07-13-05-027` | BENUE | MAKURDI | NEAR HARUNA ADEMU HOUSE BAUCHI STREET | 298 | **297** | -1 | added | 2026-11-08 |

| `28-17-03-008` | ONDO | OSE | ISUA/IPE/CATH METH SCH | 594 | **643** | +49 | added | 2026-11-08 |

| `30-04-08-009` | OYO | ATISBO | SECOND BAPT. PRIMARY SCHOOL II (B) | 253 | **345** | +92 | added | 2026-11-08 |

| `25-13-01-006` | NASARAWA | WAMBA | ARUM TSAVO PHC | 151 | **266** | +115 | added | 2026-11-08 |

| `24-15-06-020` | LAGOS | LAGOS MAINLAND | LAGOS ST. (OPP. HOUSE 36) | 519 | **525** | +6 | added | 2026-11-08 |

| `05-02-07-119` | BAUCHI | BAUCHI | OPP. POLICE STATION TAMBARI HOUSING ESTATE | 287 | **513** | +226 | added | 2026-11-08 |

| `24-10-08-053` | LAGOS | IFAKO-IJAYE | JUNCTION OF AGBADO/IPETU IJESHA ST. JANKARA AREA | 750 | **779** | +29 | added | 2026-11-08 |

| `14-02-03-006` | ENUGU | AWGU | COMM. SCHOOL AMATA I | 669 | **683** | +14 | added | 2026-11-08 |

| `32-05-07-003` | RIVERS | ANDONI | OKAMA/ POLOKIRI VILLAGE SQUARE | 800 | **855** | +55 | added | 2026-11-08 |

| `09-11-01-023` | CROSS RIVER | IKOM | MARKET SQUARE, NKIM | 90 | **150** | +60 | added | 2026-11-08 |

| `02-18-08-037` | ADAMAWA | SONG | KOLERE OPEN SPACE NEAR BORE HOLE | 552 | **607** | +55 | added | 2026-11-08 |

| `25-13-02-004` | NASARAWA | WAMBA | YASHI - PRI.SCHOOL, YASHI | 770 | **917** | +147 | added | 2026-11-08 |

| `32-22-03-031` | RIVERS | PORT HARCOURT | AMADI FLAT POLICE POST VII | 869 | **848** | -21 | added | 2026-11-08 |

| `24-02-05-092` | LAGOS | AJEROMI/IFELODUN | 14, UGBOWANKWO LANE, VIA OLUBUKOLA | 96 | **228** | +132 | added | 2026-11-08 |

| `31-01-10-004` | PLATEAU | BARIKIN LADI | NFABON | 1082 | **1053** | -29 | added | 2026-11-08 |

| `13-16-12-009` | EKITI | OYE | ST ANDREW'S PRIMARY SCHOOL - IFON / IJISUN / INISA I | 402 | **485** | +83 | added | 2026-11-08 |

| `08-21-02-046` | BORNO | MAIDUGURI M. C. | BULAMA BOLEYA  I | 586 | **667** | +81 | added | 2026-11-08 |

| `18-06-09-006` | KADUNA | JABA | UNG. YARI/ K/GIDAN SARKI | 800 | **846** | +46 | added | 2026-11-08 |

| `06-02-04-001` | BAYELSA | EKEREMOR | KANREN/OMGBONTU | 395 | **446** | +51 | added | 2026-11-08 |

| `20-04-08-007` | KATSINA | BAURE | GOZAWA - PRIMARY SCHOOL | 717 | **816** | +99 | added | 2026-11-08 |

| `19-23-03-015` | KANO | KIBIYA | KIBILI PRIMARY SCHOOL III | 9 | **266** | +257 | added | 2026-11-08 |

| `05-09-06-013` | BAUCHI | GIADE | GANDUHA,  KOFAR JAURO II | 294 | **294** | 0 | added | 2026-11-08 |

| `31-06-12-069` | PLATEAU | JOS SOUTH | LAWRAK ROAD DASHIK | 145 | **209** | +64 | added | 2026-11-08 |

| `32-05-05-026` | RIVERS | ANDONI | IMIE VILLAGE TOWN HALL | 75 | **77** | +2 | added | 2026-11-08 |

| `27-03-01-001` | OGUN | ADO ODO-OTA | C.M.S  IPATE I | 750 | **809** | +59 | added | 2026-11-08 |

| `24-17-01-075` | LAGOS | OJO | OPEN SPACE AT THE JUNCTION OF ALI STR. IRA | 143 | **257** | +114 | added | 2026-11-08 |

| `22-17-10-030` | KOGI | OKENE | NEAR AMOH AREA | 716 | **765** | +49 | added | 2026-11-08 |

| `24-03-07-142` | LAGOS | ALIMOSHO | GBADAMOSI OPESA II, IPAJA | 494 | **496** | +2 | added | 2026-11-08 |

| `24-01-06-036` | LAGOS | AGEGE | 4, OREMETA STREET | 656 | **662** | +6 | added | 2026-11-08 |

| `19-18-03-090` | KANO | GWALE | JA'EN JILAWA PRIMARY SCHOOL II | 95 | **208** | +113 | added | 2026-11-08 |

| `19-25-03-006` | KANO | KUMBOTSO | GWAZAYE I | 750 | **750** | 0 | added | 2026-11-08 |

| `24-14-15-018` | LAGOS | LAGOS ISLAND | OPEN SPACE INSIDE PHASE 1  -  II | 625 | **613** | -12 | added | 2026-11-08 |

| `05-02-03-094` | BAUCHI | BAUCHI | KOBI PRIMARY SCHOOL | 479 | **523** | +44 | added | 2026-11-08 |

| `21-06-14-012` | KEBBI | BIRNIN KEBBI | G/ MAI NUFAWA | 750 | **760** | +10 | added | 2026-11-08 |

| `32-01-02-003` | RIVERS | ABUA-ODUAL | OKANA TOWN HALL, OMIMEGBO I | 520 | **552** | +32 | added | 2026-11-08 |

| `24-01-03-048` | LAGOS | AGEGE | 23, TIJANI STREET | 522 | **510** | -12 | added | 2026-11-08 |

| `14-09-07-005` | ENUGU | IGBO EZE SOUTH | ACHEBULE HALL | 1440 | **1443** | +3 | added | 2026-11-08 |

| `36-10-07-003` | ZAMFARA | MARU | UNG. MAJIDADI / GARKAR HAKIMI | 262 | **262** | 0 | added | 2026-11-08 |

| `04-18-09-026` | ANAMBRA | ONITSHA -SOUTH | OPEN SPACE IN FRONT OF NO. 1A, BALEWA STREET  II. | 7 | **16** | +9 | added | 2026-11-08 |

| `31-05-10-148` | PLATEAU | JOS NORTH | VICTORY HIGH SCHOOL | 517 | **555** | +38 | added | 2026-11-08 |

| `16-03-10-009` | IMO | EHIME MBANO | UMUEZEALAJI UMUODU SQUARE | 460 | **499** | +39 | added | 2026-11-08 |

| `18-08-05-020` | KADUNA | KACHIA | BAKIN KASUWA (YARBUNG) | 74 | **76** | +2 | added | 2026-11-08 |

| `07-14-08-008` | BENUE | OBI | OJO OTOBI | 313 | **389** | +76 | added | 2026-11-08 |

| `10-16-08-018` | DELTA | PATANI | 018 - AMATEBE PRY.
SCH. AMATEBE 
III | 39 | **104** | +65 | added | 2026-11-08 |

| `30-11-06-010` | OYO | IBARAPA CENTRAL | THE APOSTOLIC SCHOOL III | 465 | **518** | +53 | added | 2026-11-08 |

| `05-18-09-018` | BAUCHI | TORO | ZINGIRI,   KOFAR SARKI | 346 | **584** | +238 | added | 2026-11-08 |

| `33-12-09-002` | SOKOTO | RABAH | SHIYARAJIYA | 630 | **719** | +89 | added | 2026-11-08 |

| `27-15-02-111` | OGUN | OBAFEMI/OWODE | OPEN SPACE AT T-JUNCTION, SEINDE ALAKIJA, ORIMERUNMU | 88 | **143** | +55 | added | 2026-11-08 |

| `25-04-05-018` | NASARAWA | KARU | KAWO II OP | 334 | **359** | +25 | added | 2026-11-08 |

| `20-27-02-010` | KATSINA | MASHI | S/G TSAMIYA PRI.SCHOOL II | 474 | **568** | +94 | added | 2026-11-08 |

| `26-09-04-012` | NIGER | GURARA | SABO-GARI VIGILANTE OFFICE | 750 | **735** | -15 | added | 2026-11-08 |

| `10-07-02-005` | DELTA | IKA NORTH- EAST | EGHOMA PRIMARY SCHOOL (NEW SCHOOL), OWA - ALERO V | 787 | **808** | +21 | added | 2026-11-08 |

| `37-03-03-005` | FCT | GWAGWALADA | PHASE III PRI. SCH. I | 750 | **862** | +112 | added | 2026-11-08 |

| `18-10-12-035` | KADUNA | KADUNA SOUTH | ASIKOLAYE IV | 91 | **108** | +17 | added | 2026-11-08 |

| `07-08-04-009` | BENUE | GWER WEST | LGEA SCHOOL, NAKA - LGEA SCHOOL, NAKA | 1608 | **1588** | -20 | added | 2026-11-08 |

| `21-06-02-019` | KEBBI | BIRNIN KEBBI | ILLELAR YARI MPS | 589 | **586** | -3 | added | 2026-11-08 |

| `18-19-07-018` | KADUNA | SABON GARI | NMS STUDENTS/ BY NMS STAFF QTRS | 632 | **619** | -13 | added | 2026-11-08 |

| `37-04-02-026` | FCT | KUJE | PASSALI UNGWAN. LADO | 83 | **259** | +176 | added | 2026-11-08 |

| `32-18-06-009` | RIVERS | OKRIKA | KWANI SQUARE OGBOGBO | 850 | **868** | +18 | added | 2026-11-08 |

| `18-14-03-017` | KADUNA | KAURU | MAKAU  K/GMAIUNGUWA | 849 | **852** | +3 | added | 2026-11-08 |

| `24-11-06-032` | LAGOS | IKEJA | BACK OF BLOCK 5 OGBA | 9 | **313** | +304 | added | 2026-11-08 |

| `16-17-06-013` | IMO | OGUTA | IWUNZE UMUAHII | 12 | **58** | +46 | added | 2026-11-08 |

| `04-02-03-011` | ANAMBRA | AYAMELUM | AMA ISUIDALA III | 503 | **556** | +53 | added | 2026-11-08 |

| `01-12-08-010` | ABIA | UGWUNAGBO | ALAOJI - ALAOJI VILLAGE HALL | 1328 | **1328** | 0 | added | 2026-11-08 |

| `19-35-05-003` | KANO | SHANONO | GIRGAM | 442 | **493** | +51 | added | 2026-11-08 |

| `28-06-02-024` | ONDO | AKURE SOUTH | ST JOHN PRY SCH, ST JOHN PRY SCH I | 716 | **679** | -37 | added | 2026-11-08 |

| `19-07-04-022` | KANO | DALA | RIJIYA HUDU, OPEN SPACE X | 827 | **842** | +15 | added | 2026-11-08 |

| `14-13-05-005` | ENUGU | NSUKKA | OTOBO ISAMENU | 331 | **498** | +167 | added | 2026-11-08 |

| `10-22-08-003` | DELTA | UVWIE | MARKET SQUARE MAMMY MARKET | 2613 | **2640** | +27 | added | 2026-11-08 |

| `34-06-04-013` | TARABA | IBI | WAZIRI, KOFAR WAZIRI BANNU | 730 | **752** | +22 | added | 2026-11-08 |

| `24-13-04-072` | LAGOS | KOSOFE | JUNCTION OF SUNNY JIGIDE ST./SAMUEL ST. | 870 | **880** | +10 | added | 2026-11-08 |

| `24-11-05-019` | LAGOS | IKEJA | ALONG OLADIPO KUKU ST. | 842 | **821** | -21 | added | 2026-11-08 |

| `36-14-08-008` | ZAMFARA | ZURMI | GIDAN LADAN / MARARRABA | 458 | **462** | +4 | added | 2026-11-08 |

| `26-01-05-002` | NIGER | AGAIE | EMI ALIYU BANTIGI | 533 | **566** | +33 | added | 2026-11-08 |

| `18-23-02-041` | KADUNA | ZARIA | RIMIN TSIWA VI/K/G ABDULLAHI KHALIL | 191 | **245** | +54 | added | 2026-11-08 |

| `17-27-09-004` | JIGAWA | YANKWASHI | ZOTO FULANI | 471 | **556** | +85 | added | 2026-11-08 |

| `13-08-02-003` | EKITI | IDO / OSI | IDOFIN / ILOTIN O/S FALEYE'S HOUSE | 512 | **545** | +33 | added | 2026-11-08 |

| `33-17-11-004` | SOKOTO | SOKOTO SOUTH | SARKIN ADAR OFISHIN HAKIMI ATIKU/ROAD | 965 | **1014** | +49 | added | 2026-11-08 |

| `24-12-14-006` | LAGOS | IKORODU | ANGLICAN PRY. SCHOOL IJEDE 1 | 750 | **720** | -30 | added | 2026-11-08 |

| `26-06-11-036` | NIGER | CHANCHAGA | PEACE CORPS OFFICE | 142 | **271** | +129 | added | 2026-11-08 |

| `15-03-07-003` | GOMBE | BILLIRI | KOLONG, KOFAR JAURO KOLONG | 842 | **875** | +33 | added | 2026-11-08 |

| `07-06-08-003` | BENUE | GUMA | AKO - LGEA SCHOOL, AKO | 1012 | **1062** | +50 | added | 2026-11-08 |

| `17-23-06-036` | JIGAWA | RINGIM | HURUMI VIEWING  CENTRE/HURUMI/TSIGI II | 44 | **92** | +48 | added | 2026-11-08 |

| `26-19-07-008` | NIGER | PAIKORO | ZUBAKPERE | 991 | **1240** | +249 | added | 2026-11-08 |

| `24-03-02-100` | LAGOS | ALIMOSHO | 29, DUDUYEMI STREET, EGBEDA | 66 | **183** | +117 | added | 2026-11-08 |

| `34-14-07-011` | TARABA | WUKARI | KOFAR KUNDU, KOFAR KUNDU CHINKAI | 741 | **739** | -2 | added | 2026-11-08 |

| `07-10-06-004` | BENUE | KONSHISHA | MHAMBE MARKET - MHAMBE | 766 | **762** | -4 | added | 2026-11-08 |

| `07-13-11-039` | BENUE | MAKURDI | TONDO KAJO (NEAR) - FRONT OF THE HOUSE | 750 | **740** | -10 | added | 2026-11-08 |

| `11-06-07-011` | EBONYI | EZZA SOUTH | NGAMGBO ABAM VILLAGE SQUARE | 316 | **369** | +53 | added | 2026-11-08 |

| `18-22-09-027` | KADUNA | ZANGON KATAF | YAZANOM /LEA | 172 | **194** | +22 | added | 2026-11-08 |

| `11-04-03-005` | EBONYI | EBONYI | ABARIGWE PRIMARY SCHOOL | 1198 | **1328** | +130 | added | 2026-11-08 |

| `22-18-10-004` | KOGI | OLAMABORO | LGEA SCHOOL UGOJOUALE, UGOJO UBALU | 586 | **688** | +102 | added | 2026-11-08 |

| `30-11-09-020` | OYO | IBARAPA CENTRAL | ONIYERI COMPOUND, AREGBESOLA | 267 | **281** | +14 | added | 2026-11-08 |

| `22-17-09-013` | KOGI | OKENE | LGEA SCHOOL III OKENGWE | 675 | **689** | +14 | added | 2026-11-08 |

| `18-09-10-026` | KADUNA | KADUNA NORTH | KUDANSA ROAD II/ BY CARPENTER KAWO MARKET | 824 | **828** | +4 | added | 2026-11-08 |

| `26-06-11-029` | NIGER | CHANCHAGA | BESIDE SOGGI GUEST INN | 68 | **117** | +49 | added | 2026-11-08 |

| `06-02-05-007` | BAYELSA | EKEREMOR | C.P.S OGBOSUWARE QTRS | 481 | **496** | +15 | added | 2026-11-08 |

| `22-01-02-018` | KOGI | ADAVI | LGEA SCHOOL OGAMINANA | 664 | **661** | -3 | added | 2026-11-08 |

| `37-06-06-001` | FCT | MUNICIPAL | JIWA TSOHO / KOFAR GIDAN SARKI | 1361 | **1327** | -34 | added | 2026-11-08 |

| `14-17-10-003` | ENUGU | UZO-UWANI | UVURU ANI VILLAGE SQUARE | 457 | **478** | +21 | added | 2026-11-08 |

| `04-12-05-013` | ANAMBRA | IHIALA | IHITE P/SCHOOL IV | 243 | **276** | +33 | added | 2026-11-08 |

| `22-17-02-003` | KOGI | OKENE | OPEN SPACE NEAR R.B OJEBA | 459 | **597** | +138 | added | 2026-11-08 |

| `16-22-02-018` | IMO | ORSU | UMUENWURUM TOWN HALL | 0 | **22** | +22 | added | 2026-11-08 |

| `23-03-01-019` | KWARA | EDU | OPEN SPACE EGBAN LADAN KAFINTA | 662 | **679** | +17 | added | 2026-11-08 |

| `32-08-14-018` | RIVERS | DEGEMA | SOKARI KIRI III | 128 | **168** | +40 | added | 2026-11-08 |

| `15-11-11-010` | GOMBE | YALMALTU/ DEBA | DALA/KOFAR DALA II | 765 | **806** | +41 | added | 2026-11-08 |

| `32-15-06-063` | RIVERS | OBIO/AKPOR | RUMUROLU PLAY GROUND | 75 | **94** | +19 | added | 2026-11-08 |

| `24-11-08-022` | LAGOS | IKEJA | OPP. C.G.S.S. RES (MECH. W/SHOP) FAJUYI | 600 | **631** | +31 | added | 2026-11-08 |

| `32-19-08-023` | RIVERS | OMUMA | FRONT OF TOWN SQUARE I | 51 | **50** | -1 | added | 2026-11-08 |

| `24-16-12-062` | LAGOS | MUSHIN | 3, MOSALASI STREET | 104 | **234** | +130 | added | 2026-11-08 |

| `34-07-09-005` | TARABA | JALINGO | GINDIN RIMI, KOFAN SAMBO DONKI | 999 | **996** | -3 | added | 2026-11-08 |

| `18-08-01-011` | KADUNA | KACHIA | KURMIN BIRI II/ L.E.A. KATUL CROSSING | 750 | **812** | +62 | added | 2026-11-08 |

| `20-25-01-009` | KATSINA | MALUFASHI | GANGARAWA ADULT EDUCATION CLASS  I | 750 | **764** | +14 | added | 2026-11-08 |

| `13-10-02-006` | EKITI | IKERE | IDI - ISIN JUNCTION UNDER THE (TREE) IDI - ISIN RENU ORISAJEWI  II | 750 | **740** | -10 | added | 2026-11-08 |

| `31-11-11-006` | PLATEAU | MANGU | ANG. MADAKI I | 1062 | **1059** | -3 | added | 2026-11-08 |

| `18-04-08-019` | KADUNA | IGABI | WUSONO | 990 | **991** | +1 | added | 2026-11-08 |

| `12-18-10-009` | EDO | UHUNMWODE | UGBOGIRI,  OSULA P/SCHOOL | 750 | **909** | +159 | added | 2026-11-08 |

| `24-12-04-044` | LAGOS | IKORODU | IN FRONT OF 17 OSHOLIGBEHIN STREET, OKE OTA ONA | 624 | **668** | +44 | added | 2026-11-08 |

| `24-03-04-125` | LAGOS | ALIMOSHO | 13 ADEJUMOBI ST. IKOTUN | 5 | **89** | +84 | added | 2026-11-08 |

| `04-16-11-022` | ANAMBRA | OGBARU | NWANZE/ODUOKEKE III | 305 | **330** | +25 | added | 2026-11-08 |

| `19-02-02-007` | KANO | ALBASU | KWANGWARMI | 732 | **742** | +10 | added | 2026-11-08 |

| `14-10-07-009` | ENUGU | ISI UZO | ODOBIDO PRIMARY SCHOOL | 409 | **427** | +18 | added | 2026-11-08 |

| `30-06-05-032` | OYO | IBADAN NORTH | FESTOLA NURSERY/PRIMARY SCHOOL | 870 | **834** | -36 | added | 2026-11-08 |

| `08-08-01-001` | BORNO | DIKWA | BOBOSHE I | 936 | **1066** | +130 | added | 2026-11-08 |

| `30-33-08-010` | OYO | SURULERE | OLOSE VILLAGE | 162 | **188** | +26 | added | 2026-11-08 |

| `34-16-04-007` | TARABA | ZING | GWOLE, GWOLE | 352 | **355** | +3 | added | 2026-11-08 |

| `11-10-04-010` | EBONYI | IZZI | NDIACHI VILLAGE II | 577 | **640** | +63 | added | 2026-11-08 |

| `14-02-10-022` | ENUGU | AWGU | OBODO UMUONYE AGBUDU II | 70 | **72** | +2 | added | 2026-11-08 |

| `12-11-02-043` | EDO | IKPOBA/OKHA | OPEN SPACE IN FRONT OF PIONEER EDUCATION CENTER OFF JEMILA ROAD I | 152 | **191** | +39 | added | 2026-11-08 |

| `17-05-10-009` | JIGAWA | BUJI | K/MAIUNGUWA RIGAR FADA | 303 | **347** | +44 | added | 2026-11-08 |

| `26-17-03-010` | NIGER | MOKWA | BANZHI | 759 | **1005** | +246 | added | 2026-11-08 |

| `10-14-09-028` | DELTA | OSHIMILI - NORTH | OGBE OJIE HALL | 273 | **290** | +17 | added | 2026-11-08 |

| `16-24-06-007` | IMO | ORU WEST | AYA OHAKPU SQUARE | 109 | **114** | +5 | added | 2026-11-08 |

| `24-16-13-110` | LAGOS | MUSHIN | 6, OLAYINKA ST. II | 258 | **263** | +5 | added | 2026-11-08 |

| `31-09-12-007` | PLATEAU | LANGTANG NORTH | PISHE MARKET | 197 | **239** | +42 | added | 2026-11-08 |

| `24-03-06-004` | LAGOS | ALIMOSHO | OPEN SPACE AT IDO BALE | 2108 | **2018** | -90 | added | 2026-11-08 |

| `12-09-01-010` | EDO | ETSAKO  WEST | IDANE-IYETSE- IDANE-IYETSE BOOTH | 952 | **910** | -42 | added | 2026-11-08 |

| `35-11-02-003` | YOBE | MACHINA | DAMAI, BAKIN INJI | 829 | **912** | +83 | added | 2026-11-08 |

| `27-07-01-011` | OGUN | IFO | AGRIC. PHASE  II | 750 | **717** | -33 | added | 2026-11-08 |

| `01-15-02-014` | ABIA | UMUAHIA NORTH | ATA MARKET SQUARE | 54 | **92** | +38 | added | 2026-11-08 |

| `25-06-06-021` | NASARAWA | KEFFI | KOFAR ALH. MUNTARI AHUWA | 750 | **779** | +29 | added | 2026-11-08 |

| `14-03-07-034` | ENUGU | ENUGU EAST | OLD ORIE EMENE BY UGA STREET ORIE EMENE | 330 | **406** | +76 | added | 2026-11-08 |

| `20-07-01-004` | KATSINA | DANDUME | MAHUTA KUDU/ISLAMIYYA | 928 | **1037** | +109 | added | 2026-11-08 |

| `29-08-03-010` | OSUN | EDE SOUTH | 16, ORITA AKALA | 862 | **969** | +107 | added | 2026-11-08 |

| `20-17-06-003` | KATSINA | KAFUR | SABUWAR KASA III PRI.SCHOOL | 750 | **771** | +21 | added | 2026-11-08 |

| `37-06-05-129` | FCT | MUNICIPAL | UNGWAN LEATHER | 348 | **352** | +4 | added | 2026-11-08 |

| `03-13-02-008` | AKWA IBOM | IKOT ABASI | VILLAGE HALL, IKOT ETETUK | 574 | **594** | +20 | added | 2026-11-08 |

| `26-05-10-012` | NIGER | BOSSO | OPEN SPACE MARKET SQUARE PYATA | 196 | **263** | +67 | added | 2026-11-08 |

| `32-06-10-007` | RIVERS | ASARI-TORU | ORUADIRI SQUARE I | 173 | **196** | +23 | added | 2026-11-08 |

| `25-04-05-010` | NASARAWA | KARU | DOROWA - OP | 750 | **907** | +157 | added | 2026-11-08 |

| `32-06-09-004` | RIVERS | ASARI-TORU | WEST COMPOUND - TOM WEST II | 378 | **402** | +24 | added | 2026-11-08 |

| `24-19-12-084` | LAGOS | SOMOLU | ODUNSI STREET HOUSE NO 31 | 170 | **189** | +19 | added | 2026-11-08 |

| `20-25-11-014` | KATSINA | MALUFASHI | KADANYAR GIDAN MAGUS - VILLAGE CENTRE | 689 | **698** | +9 | added | 2026-11-08 |

| `16-23-08-005` | IMO | ORU EAST | IHITTE HALL II | 381 | **731** | +350 | added | 2026-11-08 |

| `25-10-14-008` | NASARAWA | NASARAWA EGGON | PRIMARY HEALTH CENTER OGBAGI-PB | 707 | **720** | +13 | added | 2026-11-08 |

| `35-03-09-008` | YOBE | DAMATURU | TSAMIYAN LILO,TSAMIYAN LILO | 750 | **745** | -5 | added | 2026-11-08 |

| `28-14-02-009` | ONDO | OKITIPUPA | ODOLAWE, R.C.M PRY SCH ERINJE | 442 | **469** | +27 | added | 2026-11-08 |

| `12-15-05-022` | EDO | OVIA SOUTH WEST | UNIVERSITY OF BENIN TEACHING HOSPITAL UDO | 117 | **171** | +54 | added | 2026-11-08 |

| `19-31-01-041` | KANO | NASARAWA | GOVT. SEC. SCH KAWAJI SENIOR III | 22 | **146** | +124 | added | 2026-11-08 |

| `03-18-09-001` | AKWA IBOM | MKPAT ENIN | PRY SCH, IKOT NTOT | 363 | **391** | +28 | added | 2026-11-08 |

| `09-07-02-010` | CROSS RIVER | BOKI | HEALTH CENTRE BETRIKO | 117 | **201** | +84 | added | 2026-11-08 |

| `05-20-06-001` | BAUCHI | ZAKI | GUMAI EAST,   PRIMARY SCHOOL | 876 | **936** | +60 | added | 2026-11-08 |

| `32-06-08-012` | RIVERS | ASARI-TORU | RICHARD SQUARE | 196 | **207** | +11 | added | 2026-11-08 |

| `27-11-07-012` | OGUN | IJEBU ODE | DEGUN JUNCTION, OBALENDE | 101 | **214** | +113 | added | 2026-11-08 |

| `10-13-03-002` | DELTA | OKPE | OGHWERE PRIMARY SCHOOL,  OHA  TOWN II | 846 | **838** | -8 | added | 2026-11-08 |

| `28-14-13-016` | ONDO | OKITIPUPA | NEW GARAGE ZONE, AT NEW MOTOR PARK I | 750 | **812** | +62 | added | 2026-11-08 |

| `28-13-01-001` | ONDO | ODIGBO | OJA BAALE VILLAGE, CENTRE OF OJA BAALE VILLAGE | 649 | **832** | +183 | added | 2026-11-08 |

| `27-15-07-017` | OGUN | OBAFEMI/OWODE | VILLAGE SQUARE SOGBAMU | 669 | **727** | +58 | added | 2026-11-08 |

| `28-16-03-010` | ONDO | ONDO WEST | ST AGNES PRY SCH, LIJOFI | 855 | **840** | -15 | added | 2026-11-08 |

| `18-22-08-011` | KADUNA | ZANGON KATAF | IFAM/ L.E.A. PRI. SCH. | 779 | **772** | -7 | added | 2026-11-08 |

| `31-04-10-009` | PLATEAU | JOS EAST | GANDI | 964 | **978** | +14 | added | 2026-11-08 |

| `01-14-03-004` | ABIA | UKWA  WEST | OGWE CENTRAL SCHOOL/OGWE II | 187 | **216** | +29 | added | 2026-11-08 |

| `24-03-09-061` | LAGOS | ALIMOSHO | SALVATION ARMY PRY SCH V, AYOBO | 750 | **896** | +146 | added | 2026-11-08 |

| `01-09-07-026` | ABIA | OBINGWA | OHANZE - C.P.S OHANZE | 845 | **961** | +116 | added | 2026-11-08 |

| `19-31-08-059` | KANO | NASARAWA | GOVT. JUN. SEC. SCH. KAWAJI YANKABA I | 19 | **115** | +96 | added | 2026-11-08 |

| `28-04-15-007` | ONDO | AKOKO SOUTH WEST | OWA-ODO II, ONITEKUN COMPOUND | 435 | **457** | +22 | added | 2026-11-08 |

| `31-12-10-009` | PLATEAU | MIKANG | TUNKUS (BAKIN RIJIYA) | 954 | **1064** | +110 | added | 2026-11-08 |

| `32-07-09-012` | RIVERS | BONNY | VILLAGE SQUARE, EFEREWARI | 193 | **211** | +18 | added | 2026-11-08 |

| `25-04-09-017` | NASARAWA | KARU | UPPER AREA COURT TARKO | 665 | **709** | +44 | added | 2026-11-08 |

| `36-02-08-010` | ZAMFARA | BAKURA | NASARAWA SHIYAR MARNA | 143 | **194** | +51 | added | 2026-11-08 |

| `24-03-02-064` | LAGOS | ALIMOSHO | AINA AKINBORO/DAUDU NO. 16 | 660 | **631** | -29 | added | 2026-11-08 |

| `07-01-04-006` | BENUE | ADO | OSUKPO, PLAY GROUND | 579 | **616** | +37 | added | 2026-11-08 |

| `16-12-02-011` | IMO | NGOR OKPALA | COMM. SCH. UMUOYERE OBIKE | 710 | **776** | +66 | added | 2026-11-08 |

| `32-13-05-012` | RIVERS | IKWERRE | OMUITI-OMUAGWO | 570 | **584** | +14 | added | 2026-11-08 |

| `23-04-04-001` | KWARA | EKITI | OPEN SPACE EKELA | 500 | **526** | +26 | added | 2026-11-08 |

| `29-14-07-020` | OSUN | IFELODUN | OPEN SPACE BESIDE FOURSQUARE CHURCH ODOFUN, IKIRUN | 469 | **532** | +63 | added | 2026-11-08 |

| `19-06-02-008` | KANO | BUNKURE | GUNKI CIKIN GARI I | 820 | **819** | -1 | added | 2026-11-08 |

| `18-14-09-009` | KADUNA | KAURU | KIRIRIN/ L.E.A PRI.SCH. | 725 | **814** | +89 | added | 2026-11-08 |

| `07-05-10-045` | BENUE | GBOKO | OPEN SPACE - ADUE JOV COMP. | 338 | **339** | +1 | added | 2026-11-08 |

| `31-06-11-004` | PLATEAU | JOS SOUTH | ZEK | 1849 | **1853** | +4 | added | 2026-11-08 |

| `20-19-06-014` | KATSINA | KANKARA | FERTILZER STORE 1 A&B - FETI STORE | 1059 | **1055** | -4 | added | 2026-11-08 |

| `06-08-01-004` | BAYELSA | YENAGOA | FANKILE TOWN HALL | 746 | **767** | +21 | added | 2026-11-08 |

| `18-02-11-029` | KADUNA | CHIKUN | MADAKI STREET U/YELWA | 351 | **417** | +66 | added | 2026-11-08 |

| `06-03-02-015` | BAYELSA | KOLOKUMA/OPOKUMA | TEIKIRI TOWN SQUARE | 284 | **309** | +25 | added | 2026-11-08 |

| `09-09-05-001` | CROSS RIVER | CALABAR SOUTH | GOVERNMENT PRIMARY SCHOOL HAWKINS RD I | 661 | **696** | +35 | added | 2026-11-08 |

| `27-20-11-018` | OGUN | SAGAMU | OPEN SPACE AT IWERA | 76 | **144** | +68 | added | 2026-11-08 |

| `32-01-01-013` | RIVERS | ABUA-ODUAL | KALIBIAMA, TOWN HALL | 858 | **861** | +3 | added | 2026-11-08 |

| `22-06-02-003` | KOGI | IBAJI | OLUKUDU/IKPOSU/ADAGWO OLUKUDU | 427 | **477** | +50 | added | 2026-11-08 |

| `26-16-02-023` | NIGER | MASHEGU | UNG. ADAKAKA | 66 | **73** | +7 | added | 2026-11-08 |

| `24-03-05-059` | LAGOS | ALIMOSHO | JUBA ALARO STR. BY REV. KOYEJO STR. EGBE | 501 | **521** | +20 | added | 2026-11-08 |

| `32-08-15-006` | RIVERS | DEGEMA | OKPUNADIKE SQUARE | 502 | **534** | +32 | added | 2026-11-08 |

| `31-05-01-009` | PLATEAU | JOS NORTH | MAMMAN BORNO I | 850 | **843** | -7 | added | 2026-11-08 |

| `26-08-10-010` | NIGER | GBAKO | GUDUDZURU | 609 | **750** | +141 | added | 2026-11-08 |

| `25-03-07-011` | NASARAWA | DOMA | ODOROGYA OP | 750 | **758** | +8 | added | 2026-11-08 |

| `22-18-02-017` | KOGI | OLAMABORO | LGEA PRIMARY SCHOOL, EFABO | 160 | **252** | +92 | added | 2026-11-08 |

| `33-08-11-004` | SOKOTO | ILLELA | MALALI, MAKARANTA | 283 | **424** | +141 | added | 2026-11-08 |

| `05-02-12-047` | BAUCHI | BAUCHI | KOFAR ALH. MAGAJI MAI SHINKAFA | 62 | **92** | +30 | added | 2026-11-08 |

| `25-08-03-023` | NASARAWA | LAFIA | LGEA PRIMARY SCH.  ANG RERE ASONYA | 118 | **150** | +32 | added | 2026-11-08 |

| `20-25-02-037` | KATSINA | MALUFASHI | K/GIDAN ALH. MANDE, T/WADA HOUSING ESTATE | 104 | **232** | +128 | added | 2026-11-08 |

| `19-38-06-013` | KANO | TARAUNI | GINDIN MANGWARO III | 556 | **571** | +15 | added | 2026-11-08 |

| `02-06-05-002` | ADAMAWA | GUYUK | DAKATSAMZA/ K/M UNG. DAKATSAMZA | 555 | **563** | +8 | added | 2026-11-08 |

| `31-02-05-001` | PLATEAU | BASSA | ANGUWAN MISSION  I | 2060 | **2044** | -16 | added | 2026-11-08 |

| `04-21-02-010` | ANAMBRA | OYI | EQUITY P/S II | 133 | **156** | +23 | added | 2026-11-08 |

| `27-10-07-003` | OGUN | IJEBU NORTH EAST | OPEN SPACE COSSY JUNCTION, ISOYIN | 351 | **403** | +52 | added | 2026-11-08 |

| `19-20-02-011` | KANO | KABO | SHADAU/ BANTAL III | 308 | **488** | +180 | added | 2026-11-08 |

| `23-02-07-006` | KWARA | BARUTEN | AYOO  L.G.E.A.SCH | 753 | **1016** | +263 | added | 2026-11-08 |

| `24-12-09-019` | LAGOS | IKORODU | ADEBORUNWA PALACE BUS STOP - II | 588 | **636** | +48 | added | 2026-11-08 |

| `30-21-09-002` | OYO | OGBOMOSO NORTH | CITY HOTEL I | 1063 | **1059** | -4 | added | 2026-11-08 |

| `31-16-04-009` | PLATEAU | SHENDAM | YAMINI UNG / HAUSAWA I | 642 | **645** | +3 | added | 2026-11-08 |

| `24-04-02-055` | LAGOS | AMUWO-ODOFIN | 711 ROAD JUNCTION, FESTAC | 337 | **542** | +205 | added | 2026-11-08 |

| `19-06-07-019` | KANO | BUNKURE | UNGUWAR KANAWA II | 67 | **81** | +14 | added | 2026-11-08 |

| `24-01-09-016` | LAGOS | AGEGE | 5, ADEBOLA STREET | 472 | **473** | +1 | added | 2026-11-08 |

| `19-18-02-009` | KANO | GWALE | GWALE, PRIMARY SCHOOL III | 1129 | **1127** | -2 | added | 2026-11-08 |

| `27-07-08-027` | OGUN | IFO | OPEN SPACE SHONDE, SHONDE TOWN VIA OLUKE | 288 | **411** | +123 | added | 2026-11-08 |

| `32-03-01-008` | RIVERS | AHOADA WEST | COMM. SEC. SCH. AKINIMA | 102 | **110** | +8 | added | 2026-11-08 |

| `10-10-04-012` | DELTA | ISOKO SOUTH | ABO-EZEDE HALL, EZEDE | 492 | **507** | +15 | added | 2026-11-08 |

| `26-17-02-009` | NIGER | MOKWA | TATABU | 730 | **1010** | +280 | added | 2026-11-08 |

| `24-01-05-027` | LAGOS | AGEGE | 6, IREPODUN STREET | 750 | **737** | -13 | added | 2026-11-08 |

| `08-04-02-003` | BORNO | BAYO | BRIYEL SOUTH | 2293 | **2226** | -67 | added | 2026-11-08 |

| `02-15-09-013` | ADAMAWA | MUBI SOUTH | SEBORE/ SEBORE PRI. SCH. | 973 | **1169** | +196 | added | 2026-11-08 |

| `19-07-08-004` | KANO | DALA | FILIN M. NURA ,(KANTUDU) O/SPACE II | 311 | **317** | +6 | added | 2026-11-08 |

| `35-13-10-009` | YOBE | NGURU | MADU MAI GINI KOFAR MADU MAI GINI | 805 | **890** | +85 | added | 2026-11-08 |

| `01-03-08-004` | ABIA | AROCHUKWU | AMAFIA/AMAETITI PRIM.SCH. | 366 | **401** | +35 | added | 2026-11-08 |

| `33-10-08-006` | SOKOTO | KWARE | TORANKA DAWAKI, TORANKA DAWAKI | 670 | **860** | +190 | added | 2026-11-08 |

| `35-06-07-016` | YOBE | GEIDAM | TOBACCO STORE,  HIGH COURT | 864 | **913** | +49 | added | 2026-11-08 |

| `05-12-01-046` | BAUCHI | KATAGUM | KOFAR ISAH KAFINTA | 74 | **84** | +10 | added | 2026-11-08 |

| `33-17-03-003` | SOKOTO | SOKOTO SOUTH | ISAH NA MALLANDO I | 878 | **887** | +9 | added | 2026-11-08 |

| `03-26-13-008` | AKWA IBOM | ORUK ANAM | PRY SCH, WARIFFE | 686 | **732** | +46 | added | 2026-11-08 |

| `30-32-11-015` | OYO | SAKI WEST | AJEUNSINUDEKU II | 385 | **413** | +28 | added | 2026-11-08 |

| `30-25-02-010` | OYO | OLUYOLE | OLUYOLE HIGH SCHOOL I | 925 | **901** | -24 | added | 2026-11-08 |

| `07-05-02-016` | BENUE | GBOKO | JOS STREET PRIMIER HOTEL | 615 | **622** | +7 | added | 2026-11-08 |

| `24-02-03-002` | LAGOS | AJEROMI/IFELODUN | B/W 66/68 IDEWU STREET | 791 | **804** | +13 | added | 2026-11-08 |

| `35-14-04-016` | YOBE | POTISKUM | JUMMA'A,  PRI. SCH. | 606 | **784** | +178 | added | 2026-11-08 |

| `19-42-04-009` | KANO | UNGOGO | MINCIKA A | 79 | **286** | +207 | added | 2026-11-08 |

| `02-14-09-046` | ADAMAWA | MUBI NORTH | KOFAR ABDULKADIR NEAR MARKET | 109 | **144** | +35 | added | 2026-11-08 |

| `26-17-08-004` | NIGER | MOKWA | DANKOGI | 821 | **1060** | +239 | added | 2026-11-08 |

| `10-01-02-012` | DELTA | ANIOCHA NORTH | POST OFFICE ISHIEKPE III | 147 | **245** | +98 | added | 2026-11-08 |

| `24-13-04-087` | LAGOS | KOSOFE | JUNCTION OF ABAYOMI ODUBENA ST/DOTUNSON ST. | 103 | **239** | +136 | added | 2026-11-08 |

| `26-15-06-004` | NIGER | MARIGA | KAHIGO | 794 | **798** | +4 | added | 2026-11-08 |

| `11-08-06-008` | EBONYI | ISHIELU | UBOJIMA VILLAGE SQUARE | 467 | **482** | +15 | added | 2026-11-08 |

| `26-15-05-017` | NIGER | MARIGA | UNG. YAN HAUSA MANGORO | 369 | **472** | +103 | added | 2026-11-08 |

| `03-03-01-010` | AKWA IBOM | EKET | VILLAGE SQUARE ADAHA UDARA, OPPOSITE THE APOSTOLIC CHURCH, IKOT ABIA. | 556 | **645** | +89 | added | 2026-11-08 |

| `17-01-02-008` | JIGAWA | AUYO | MATAKUWA K. FADA, AYATAKUWA | 793 | **931** | +138 | added | 2026-11-08 |

| `18-13-10-012` | KADUNA | KAURA | FADAN ATTAKAR/ SABASTIAN U/ASHIM | 471 | **484** | +13 | added | 2026-11-08 |

| `20-31-03-001` | KATSINA | SABUWA | GAZARI/PRI.SCHOOL | 1512 | **1505** | -7 | added | 2026-11-08 |

| `20-31-05-006` | KATSINA | SABUWA | UNGUWAR SABIU/KG SABI'U | 374 | **371** | -3 | added | 2026-11-08 |

| `26-06-11-020` | NIGER | CHANCHAGA | KASUWAN MAJE  (II) | 843 | **835** | -8 | added | 2026-11-08 |

| `17-12-10-002` | JIGAWA | GWIWA | KWARARE PRI. SCH. KWARARE | 829 | **831** | +2 | added | 2026-11-08 |

| `30-23-06-002` | OYO | OGO-OLUWA | COMMUNITY PRIMARY SCH, PONTELA AKINOLA II | 320 | **345** | +25 | added | 2026-11-08 |

| `30-05-07-023` | OYO | EGBEDA | OPEN SPACE BESIDE 16 FLAT IYALODE | 334 | **322** | -12 | added | 2026-11-08 |

| `33-01-10-006` | SOKOTO | BINJI | BIRNIN-WARI GAJARE | 637 | **669** | +32 | added | 2026-11-08 |

| `32-11-03-021` | RIVERS | ETCHE | UMUOGBU VILLAGE SQUARE | 145 | **145** | 0 | added | 2026-11-08 |

| `12-11-08-015` | EDO | IKPOBA/OKHA | IDOGBO, IDOGBO - NEAR NDLA OFFICE I | 707 | **803** | +96 | added | 2026-11-08 |

| `10-15-03-020` | DELTA | OSHIMILI - SOUTH | OKWE SEC. SCH. I | 60 | **66** | +6 | added | 2026-11-08 |

| `34-01-08-017` | TARABA | ARDO - KOLA | ADAMU CHAMBA MARKET SQUARE | 728 | **775** | +47 | added | 2026-11-08 |

| `28-16-04-006` | ONDO | ONDO WEST | L.A PRY SCH, IGBADO | 1037 | **1012** | -25 | added | 2026-11-08 |

| `23-02-10-005` | KWARA | BARUTEN | SHINAWU OLD MARKET I | 750 | **826** | +76 | added | 2026-11-08 |

| `19-29-08-011` | KANO | MAKODA | UNGUWAR ZUBAIRU II | 475 | **488** | +13 | added | 2026-11-08 |

| `31-06-03-019` | PLATEAU | JOS SOUTH | YINGI | 840 | **853** | +13 | added | 2026-11-08 |

| `28-18-08-007` | ONDO | OWO | AT OBAGBUJI STREET, OBAGBUJI/MARAN II | 753 | **754** | +1 | added | 2026-11-08 |

| `09-16-01-007` | CROSS RIVER | OGOJA | PRIMARY SCHOOL MFOM II | 750 | **773** | +23 | added | 2026-11-08 |

| `19-24-14-001` | KANO | KIRU | ALGAITA | 750 | **762** | +12 | added | 2026-11-08 |

| `27-03-13-002` | OGUN | ADO ODO-OTA | L.G. SCHOOL KETU | 1528 | **1632** | +104 | added | 2026-11-08 |

| `32-18-01-011` | RIVERS | OKRIKA | OPULA COMPOUND, ALA | 513 | **566** | +53 | added | 2026-11-08 |

| `08-11-08-014` | BORNO | GWOZA | LAWAN MUSA | 799 | **835** | +36 | added | 2026-11-08 |

| `19-22-08-004` | KANO | KARAYE | TINKIS I | 770 | **770** | 0 | added | 2026-11-08 |

| `20-13-02-009` | KATSINA | FASKARI | NASARAWA MATSERI KOFAR GIDAN MAI UNGUWA | 354 | **412** | +58 | added | 2026-11-08 |

| `16-01-04-002` | IMO | ABOH MBAISE | UKAONU UGAA HALL | 796 | **792** | -4 | added | 2026-11-08 |

| `32-05-09-019` | RIVERS | ANDONI | AWOH VILLAGE SQUARE | 1386 | **1400** | +14 | added | 2026-11-08 |

| `31-14-11-032` | PLATEAU | QUA'AN PAN | LANGKAKU | 1950 | **2084** | +134 | added | 2026-11-08 |

| `03-05-06-002` | AKWA IBOM | ESSIEN UDIM | PRY SCH, IKOT UMOESSIEN | 750 | **1098** | +348 | added | 2026-11-08 |

| `30-06-07-016` | OYO | IBADAN NORTH | AMISU STREET OKE ITUNU | 784 | **759** | -25 | added | 2026-11-08 |

| `18-17-09-020` | KADUNA | LERE | KURURUWA/ NEAR MAIUNGUWA HOUSE | 425 | **424** | -1 | added | 2026-11-08 |

| `29-24-07-010` | OSUN | OBOKUN | ESA-OKE GRAMMAR SCHOOL | 869 | **952** | +83 | added | 2026-11-08 |

| `20-29-10-013` | KATSINA | MUSAWA | GARU IV -GARU PRI SCH | 73 | **140** | +67 | added | 2026-11-08 |

| `30-06-06-007` | OYO | IBADAN NORTH | SABO MARKET | 1046 | **1055** | +9 | added | 2026-11-08 |

| `01-07-08-020` | ABIA | ISIALA NGWA SOUTH | UMUOKORO - CIVIC CENTRE | 441 | **495** | +54 | added | 2026-11-08 |

| `14-13-13-020` | ENUGU | NSUKKA | OTOBO ENU ONICHA | 304 | **299** | -5 | added | 2026-11-08 |

| `10-08-08-013` | DELTA | IKA - SOUTH | IHIOMA PRIMARY SCHOOL, BOJI BOJI II - I, AGBOR | 87 | **180** | +93 | added | 2026-11-08 |

| `24-19-04-022` | LAGOS | SOMOLU | HUMANI ST. IN FRONT OF HOUSE NO. 16 | 564 | **605** | +41 | added | 2026-11-08 |

| `02-20-03-003` | ADAMAWA | YOLA NORTH | CAPITAL SCH. / CAPITAL SCH. II | 750 | **727** | -23 | added | 2026-11-08 |

| `24-20-01-028` | LAGOS | SURULERE | JUNCTION OF OSHO ST./ADEBOWALE ST.III | 366 | **360** | -6 | added | 2026-11-08 |

| `30-32-02-026` | OYO | SAKI WEST | IDI-ERO (KOOMI ROAD) | 266 | **431** | +165 | added | 2026-11-08 |

| `11-09-05-009` | EBONYI | IVO | CHILDREN OF LIGHT NURSERY AND PRY. SCH. | 122 | **139** | +17 | added | 2026-11-08 |

| `30-09-06-044` | OYO | IBADAN SOUTH-EAST | OPEN SPACE AT AYEDADE ELEKURO VI | 234 | **290** | +56 | added | 2026-11-08 |

| `04-09-06-003` | ANAMBRA | EKWUSIGO | ORUMBA PRY. SCHOOL I | 387 | **444** | +57 | added | 2026-11-08 |

| `12-06-05-013` | EDO | ESAN WEST | ISIBHENELO PRIMARY SCHOOL, IHUMUDUMU | 92 | **512** | +420 | added | 2026-11-08 |

| `03-31-07-013` | AKWA IBOM | UYO | PRY SCH, USE OFFOT | 2189 | **2421** | +232 | added | 2026-11-08 |

| `18-03-06-001` | KADUNA | GIWA | UNG. SARKIN YAKAWADA I, II, III/ UNG. SARKI | 750 | **833** | +83 | added | 2026-11-08 |

| `20-15-07-005` | KATSINA | INGAWA | YANDORAWA - YANDORAWA | 368 | **429** | +61 | added | 2026-11-08 |

| `15-11-04-037` | GOMBE | YALMALTU/ DEBA | KUKAWA II, KUKAWA PRI. SCH. | 580 | **611** | +31 | added | 2026-11-08 |

| `01-02-08-012` | ABIA | ABA SOUTH | EKEOHA-NGWA ROAD PRIM.SCHL II | 1007 | **985** | -22 | added | 2026-11-08 |

| `15-01-08-031` | GOMBE | AKKO | KUMO SARKIN TANGALE II, CENT. PRI. SCH. | 73 | **95** | +22 | added | 2026-11-08 |

| `22-01-09-007` | KOGI | ADAVI | LGEA SCHOOL IRESUHUA I | 501 | **637** | +136 | added | 2026-11-08 |

| `23-07-04-025` | KWARA | ILORIN-SOUTH | AGO-AIYEKALE L.G.E.A SCH | 966 | **1046** | +80 | added | 2026-11-08 |

| `28-18-01-012` | ONDO | OWO | OPEN SPACE IN FRONT OF NO. 6, OBASOOTO EHINOGBE | 59 | **194** | +135 | added | 2026-11-08 |

| `10-22-01-004` | DELTA | UVWIE | OPP. PALACE GATE | 1498 | **1486** | -12 | added | 2026-11-08 |

| `01-02-01-053` | ABIA | ABA SOUTH | EZIUKWU EGBELU VILLAGE HALL VI | 82 | **118** | +36 | added | 2026-11-08 |

| `14-05-06-018` | ENUGU | ENUGU SOUTH | COLLEGE AVENUE, IDAW RIVER II | 46 | **48** | +2 | added | 2026-11-08 |

| `18-14-06-005` | KADUNA | KAURU | MAJAGADA/ L.E.A. PRI.SCH. | 750 | **889** | +139 | added | 2026-11-08 |

| `25-08-03-012` | NASARAWA | LAFIA | KURIKYO - OP | 786 | **806** | +20 | added | 2026-11-08 |

| `24-01-05-032` | LAGOS | AGEGE | 15, ISAJIMI STREET | 63 | **102** | +39 | added | 2026-11-08 |

| `29-07-06-010` | OSUN | EDE NORTH | OLAOLU N/P SCHOOL | 482 | **587** | +105 | added | 2026-11-08 |

| `12-04-07-004` | EDO | ESAN NORTH EAST | UROMI - AWO PRIMARY SCHOOL I | 750 | **876** | +126 | added | 2026-11-08 |

| `02-14-09-002` | ADAMAWA | MUBI NORTH | BUS STOP/ STATION | 934 | **932** | -2 | added | 2026-11-08 |

| `18-14-01-021` | KADUNA | KAURU | ANGUWAN KAURU II | 729 | **750** | +21 | added | 2026-11-08 |

| `17-01-08-011` | JIGAWA | AUYO | JSS KAFUR | 159 | **709** | +550 | added | 2026-11-08 |

| `10-05-06-014` | DELTA | ETHIOPE  EAST | KOKORI II/PRIMARY HEALTH CENTRE | 316 | **366** | +50 | added | 2026-11-08 |

| `04-07-04-006` | ANAMBRA | AWKA SOUTH | EKE MARKET SQUARE II | 891 | **978** | +87 | added | 2026-11-08 |

| `16-26-04-015` | IMO | OWERRI NORTH | UMUEZE VILL HALL | 1 | **52** | +51 | added | 2026-11-08 |

| `27-03-07-062` | OGUN | ADO ODO-OTA | ABOLOYIN HEALTH POST,  ABOLOYIN | 336 | **474** | +138 | added | 2026-11-08 |

| `26-22-14-009` | NIGER | SHIRORO | MUTUM DAYA PRIMARY SCHOOL | 1007 | **1062** | +55 | added | 2026-11-08 |

| `30-25-07-004` | OYO | OLUYOLE | OLOMI SCHOOL 1 B | 909 | **900** | -9 | added | 2026-11-08 |

| `18-20-08-010` | KADUNA | SANGA | ANCHA I | 876 | **976** | +100 | added | 2026-11-08 |

| `20-20-06-008` | KATSINA | KANKIA | SALIHAWA I&II OPEN SPACE | 362 | **401** | +39 | added | 2026-11-08 |

| `19-31-11-017` | KANO | NASARAWA | RIJIYAR DANGOTE III | 577 | **610** | +33 | added | 2026-11-08 |

| `13-13-06-014` | EKITI | IREPODUN / IFELODUN | ODOLORO COMPOUND - ODOLORO COMPOUND | 521 | **548** | +27 | added | 2026-11-08 |

| `27-03-09-018` | OGUN | ADO ODO-OTA | IDOLOWU AREA | 286 | **281** | -5 | added | 2026-11-08 |

| `13-16-01-006` | EKITI | OYE | ODE OMO II , OPEN SPACE AT ILOKA | 322 | **349** | +27 | added | 2026-11-08 |

| `24-16-12-017` | LAGOS | MUSHIN | STAFF QUARTERS, LUTH | 750 | **781** | +31 | added | 2026-11-08 |

| `27-06-07-005` | OGUN | EWEKORO | A/C SCHOOL AWADO | 318 | **411** | +93 | added | 2026-11-08 |

| `23-07-02-004` | KWARA | ILORIN-SOUTH | JOROMO OSHIN L.G.E.A SCH I | 342 | **370** | +28 | added | 2026-11-08 |

| `14-04-11-012` | ENUGU | ENUGU NORTH | I.M.T. CAMPUS II | 934 | **938** | +4 | added | 2026-11-08 |

| `29-14-07-002` | OSUN | IFELODUN | ESORUN SQUARE II | 621 | **694** | +73 | added | 2026-11-08 |

| `24-12-16-056` | LAGOS | IKORODU | WITHIN IDERA MARKET SQUARE, OJU EMUREN ROAD | 412 | **747** | +335 | added | 2026-11-08 |

| `20-13-10-017` | KATSINA | FASKARI | KYABUSHAWA BELLO AT PRI.SCHOOL | 371 | **477** | +106 | added | 2026-11-08 |

| `04-16-14-008` | ANAMBRA | OGBARU | G.C.M. I | 765 | **744** | -21 | added | 2026-11-08 |

| `20-05-01-011` | KATSINA | BINDAWA | KWANAR TORI GINDIN ADUA | 268 | **295** | +27 | added | 2026-11-08 |

| `20-04-12-004` | KATSINA | BAURE | AGALA FULANI - KOFAR HARDO | 500 | **513** | +13 | added | 2026-11-08 |

| `26-17-01-011` | NIGER | MOKWA | TIKA | 701 | **709** | +8 | added | 2026-11-08 |

| `34-16-01-009` | TARABA | ZING | SULE NAYA, SULE NAYA | 404 | **412** | +8 | added | 2026-11-08 |

| `18-23-09-019` | KADUNA | ZARIA | TUKUR TUKUR V/K/G ALH. ADAMU | 452 | **457** | +5 | added | 2026-11-08 |

| `10-25-01-004` | DELTA | WARRI SOUTH  WEST | OGBE - IJOH COURT HALL | 750 | **792** | +42 | added | 2026-11-08 |

| `01-09-07-030` | ABIA | OBINGWA | ABIA STATE COLLEGE OF HEALTH | 143 | **207** | +64 | added | 2026-11-08 |

| `34-11-02-046` | TARABA | SARDAUNA | LEME TELLAH | 89 | **146** | +57 | added | 2026-11-08 |

| `28-06-03-018` | ONDO | AKURE SOUTH | ILESA ROAD - BESIDE FAGBOTES HOUSE | 1089 | **1061** | -28 | added | 2026-11-08 |

| `24-02-05-081` | LAGOS | AJEROMI/IFELODUN | 40, ASIBEJOYE STREET | 559 | **552** | -7 | added | 2026-11-08 |

| `27-03-15-004` | OGUN | ADO ODO-OTA | AGBARA ESTATE  II | 1190 | **1202** | +12 | added | 2026-11-08 |

| `19-43-06-006` | KANO | WARAWA | MAKERA I | 776 | **817** | +41 | added | 2026-11-08 |

| `18-09-07-050` | KADUNA | KADUNA NORTH | OUTSIDE LEA GATE | 51 | **77** | +26 | added | 2026-11-08 |

| `20-05-03-018` | KATSINA | BINDAWA | RUGAR KARI-R/KARI PRI. SCHOOL | 426 | **428** | +2 | added | 2026-11-08 |

| `09-02-04-006` | CROSS RIVER | AKAMKPA | PLAYGROUND, OWAI | 750 | **773** | +23 | added | 2026-11-08 |

| `18-03-07-006` | KADUNA | GIWA | U/LIMAN I, II & U/ZOKO KAYA/ L.E.A KAYA | 750 | **771** | +21 | added | 2026-11-08 |

| `24-19-08-025` | LAGOS | SOMOLU | SOYINKA ST. IN FRONT OF HOUSE NO. 21 | 474 | **489** | +15 | added | 2026-11-08 |

| `10-20-02-006` | DELTA | UGHELLI SOUTH | ODON HALL, OLOTA | 431 | **457** | +26 | added | 2026-11-08 |

| `33-22-03-008` | SOKOTO | WURNO | SIDINGO | 327 | **429** | +102 | added | 2026-11-08 |

| `07-14-12-006` | BENUE | OBI | PLAY GROUND - OJWO/UDEBOR II | 800 | **805** | +5 | added | 2026-11-08 |

| `33-23-08-002` | SOKOTO | YABO | KILGORI/MODEL PRI.SCHOOL KILGORI | 912 | **986** | +74 | added | 2026-11-08 |

| `29-11-09-001` | OSUN | IFE CENTRAL | AKODI ATIKI | 596 | **666** | +70 | added | 2026-11-08 |

| `29-04-08-006` | OSUN | AYEDIRE | AYITEDO MATERNITY CENTRE ILEOGBO | 79 | **307** | +228 | added | 2026-11-08 |

| `24-02-04-007` | LAGOS | AJEROMI/IFELODUN | B/W 40/44 SALAMI STREET | 701 | **726** | +25 | added | 2026-11-08 |

| `01-04-12-008` | ABIA | BENDE | AMAOJI - PRI. SCH. AMAOJI | 492 | **512** | +20 | added | 2026-11-08 |

| `24-01-04-011` | LAGOS | AGEGE | 81, OLA-IYA STREET | 580 | **579** | -1 | added | 2026-11-08 |

| `30-05-06-046` | OYO | EGBEDA | OPEN SPACE OPPOSITE OWU CROWN HOTEL | 157 | **172** | +15 | added | 2026-11-08 |

| `32-14-01-001` | RIVERS | KHANA | MOTOR PARK | 750 | **791** | +41 | added | 2026-11-08 |

| `11-07-17-007` | EBONYI | IKWO | C.P.S IGWELEDOHA | 25 | **104** | +79 | added | 2026-11-08 |

| `36-13-05-013` | ZAMFARA | TSAFE | BARE-BARI / KOFAR BARNO | 586 | **592** | +6 | added | 2026-11-08 |

| `31-02-09-005` | PLATEAU | BASSA | TINJE II | 843 | **860** | +17 | added | 2026-11-08 |

| `07-19-12-022` | BENUE | OTUKPO | IPOLO-ICHO LGEA PRIMARY SCHOOL | 197 | **263** | +66 | added | 2026-11-08 |

| `32-06-11-023` | RIVERS | ASARI-TORU | ILELEMA TOWN HALL | 360 | **554** | +194 | added | 2026-11-08 |

| `02-04-04-011` | ADAMAWA | GIREI | WURO HAUSA - NEAR CLINIC | 421 | **516** | +95 | added | 2026-11-08 |

| `10-13-04-008` | DELTA | OKPE | OKWITAIRE TOWN HALL, OKWITAIRE | 454 | **467** | +13 | added | 2026-11-08 |

| `24-15-08-005` | LAGOS | LAGOS MAINLAND | JUNCTION OF ADERIBIGBE ST./ADEBIYI ST. | 487 | **492** | +5 | added | 2026-11-08 |

| `36-06-10-016` | ZAMFARA | GUMMI | LEMAWA II/SABON LAYI | 328 | **590** | +262 | added | 2026-11-08 |

| `30-24-05-002` | OYO | OLORUNSOGO | MATERNITY CENTRE, ASUNMADE | 621 | **897** | +276 | added | 2026-11-08 |

| `22-07-10-009` | KOGI | IDAH | OPEN SPACE, OCH IJENU/EKWOKATA | 462 | **504** | +42 | added | 2026-11-08 |

| `05-13-05-011` | BAUCHI | KIRFI | BOLI  EAST,  KOFAR SARKI | 326 | **334** | +8 | added | 2026-11-08 |

| `20-14-05-038` | KATSINA | FUNTUA | K/G YAKUBU MAI GORO | 24 | **116** | +92 | added | 2026-11-08 |

| `07-07-06-002` | BENUE | GWER EAST | GYUNGU - RCM SCHOOL | 805 | **806** | +1 | added | 2026-11-08 |

| `04-13-09-006` | ANAMBRA | NJIKOKA | IRE VILLAGE HALL | 955 | **966** | +11 | added | 2026-11-08 |

| `18-02-12-021` | KADUNA | CHIKUN | WAKILI STREET BY TRANSFORMER I | 750 | **755** | +5 | added | 2026-11-08 |

| `28-06-11-004` | ONDO | AKURE SOUTH | L.A PRY SCH - L.A PRY SCH | 840 | **836** | -4 | added | 2026-11-08 |

| `28-10-10-020` | ONDO | ILAJE | OBE BOWOTO, OPEN SPACE AT BOWOTO BEACH | 488 | **517** | +29 | added | 2026-11-08 |

| `21-11-04-016` | KEBBI | JEGA | KYARMI PRIMARY SCHOOL | 87 | **371** | +284 | added | 2026-11-08 |

| `37-06-12-045` | FCT | MUNICIPAL | TASHA II BEHIND MOSQUE | 571 | **575** | +4 | added | 2026-11-08 |

| `03-05-03-003` | AKWA IBOM | ESSIEN UDIM | VILLAGE SQUARE, IKOT UDO ESENOWO | 309 | **358** | +49 | added | 2026-11-08 |

| `26-16-01-011` | NIGER | MASHEGU | LIKYAULE  I | 412 | **893** | +481 | added | 2026-11-08 |

| `29-06-02-005` | OSUN | BORIPE | TINUBU FAGBEMI IRAGBIJI | 744 | **805** | +61 | added | 2026-11-08 |

| `17-02-10-006` | JIGAWA | BABURA | LAMINTANI PRI. SCH./ LAMIN TANI | 1208 | **1218** | +10 | added | 2026-11-08 |

| `04-01-02-010` | ANAMBRA | AGUATA | OBINIKPA PRY. SCHOOL II | 189 | **211** | +22 | added | 2026-11-08 |

| `03-07-01-020` | AKWA IBOM | ETINAN | ETINAN INSTITUTE, HOSPITAL ROAD, ETINAN | 452 | **537** | +85 | added | 2026-11-08 |

| `23-02-03-009` | KWARA | BARUTEN | OLD MARKET TOBURE | 406 | **457** | +51 | added | 2026-11-08 |

| `09-17-10-013` | CROSS RIVER | YAKURR | PRIMARY SCHOO, LOKPOI | 274 | **272** | -2 | added | 2026-11-08 |

| `24-13-06-004` | LAGOS | KOSOFE | AINA ROAD, IN FRONT OF HOUSE NO. 40 | 1000 | **1021** | +21 | added | 2026-11-08 |

| `13-01-12-002` | EKITI | ADO EKITI | IN FRONT OF FAKOREDE'S HOUSE / FAKOREDE'S COMP. | 1002 | **966** | -36 | added | 2026-11-08 |

| `14-02-10-002` | ENUGU | AWGU | OBODO ENUGU ISU VILLAGE SQUARE | 240 | **237** | -3 | added | 2026-11-08 |

| `28-16-04-010` | ONDO | ONDO WEST | COMM PRY SCH, ODOWO | 549 | **597** | +48 | added | 2026-11-08 |

| `04-20-15-023` | ANAMBRA | ORUMBA  SOUTH | NEW NKWO MARKET | 173 | **171** | -2 | added | 2026-11-08 |

| `24-09-02-015` | LAGOS | IBEJU/LEKKI | 26, TALEMU ST IGANDO OLOJA TOWN | 123 | **274** | +151 | added | 2026-11-08 |

| `19-06-09-016` | KANO | BUNKURE | DUSUSU III | 24 | **66** | +42 | added | 2026-11-08 |

| `26-04-08-012` | NIGER | BORGU | OPEN SPACE MASAMA | 43 | **43** | 0 | added | 2026-11-08 |

| `10-05-08-013` | DELTA | ETHIOPE  EAST | IGUN/IGUN GIRLS SCHOOL I | 533 | **547** | +14 | added | 2026-11-08 |

| `15-01-04-027` | GOMBE | AKKO | TUNGO MANARU, KOFAR JAURO | 391 | **399** | +8 | added | 2026-11-08 |

| `24-10-08-007` | LAGOS | IFAKO-IJAYE | 1, SHOYINKA ST. NEW OKO-OBA II | 985 | **956** | -29 | added | 2026-11-08 |

| `25-04-11-061` | NASARAWA | KARU | RUGA MADAKI PRIMARY SCHOOL | 750 | **1360** | +610 | added | 2026-11-08 |

| `11-03-11-007` | EBONYI | AFIKPO  SOUTH | UMUNNATO PRIMARY SCHOOL | 315 | **331** | +16 | added | 2026-11-08 |

| `29-30-03-003` | OSUN | OSOGBO | 7, EESA OLUGBEDE | 625 | **734** | +109 | added | 2026-11-08 |

| `19-09-09-009` | KANO | DAWAKI KUDU | KOWA DA NASA AB | 882 | **915** | +33 | added | 2026-11-08 |

| `12-17-04-020` | EDO | OWAN WEST | OPEN SPACE OPPOSITE OLD OWAN WEST PARK | 406 | **478** | +72 | added | 2026-11-08 |

| `04-02-01-019` | ANAMBRA | AYAMELUM | C.P.S ANAKU III | 653 | **681** | +28 | added | 2026-11-08 |

| `33-16-10-004` | SOKOTO | SOKOTO NORTH | DANHILI HUBBARE | 947 | **1169** | +222 | added | 2026-11-08 |

| `33-17-04-025` | SOKOTO | SOKOTO SOUTH | WADA UBA DK II | 637 | **678** | +41 | added | 2026-11-08 |

| `21-13-02-003` | KEBBI | KOKO/BESSE | DAN DASHE | 394 | **496** | +102 | added | 2026-11-08 |

| `32-05-08-003` | RIVERS | ANDONI | OTUIREM VILLAGE SQUARE | 834 | **834** | 0 | added | 2026-11-08 |

| `27-09-08-003` | OGUN | IJEBU NORTH | R. ODUS'S JUNCTION | 987 | **998** | +11 | added | 2026-11-08 |

| `26-12-01-009` | NIGER | LAPAI | LOWCOST BABA'S FORMER HOUSE | 1009 | **1103** | +94 | added | 2026-11-08 |

| `19-23-08-009` | KANO | KIBIYA | NARIYA GANGARE II | 442 | **527** | +85 | added | 2026-11-08 |

| `07-13-01-033` | BENUE | MAKURDI | UTAMBE | 541 | **607** | +66 | added | 2026-11-08 |

| `33-11-09-008` | SOKOTO | KEBBE | NASARAWA | 264 | **264** | 0 | added | 2026-11-08 |

| `24-03-11-111` | LAGOS | ALIMOSHO | OPPOSITE BLUE BANANA JUNCTION ALAGBADO | 369 | **416** | +47 | added | 2026-11-08 |

| `12-11-07-016` | EDO | IKPOBA/OKHA | ENIKARO - UGBEKUN PRIMARY SCHOOL I | 1105 | **1093** | -12 | added | 2026-11-08 |

| `28-15-06-006` | ONDO | ONDO EAST | MOBOLADE/OKE ALAFIA/LIJOKA/DAUDA/DEMILE/KASUNMU, OPEN SPACE AT DEMILE | 656 | **647** | -9 | added | 2026-11-08 |

| `12-16-02-015` | EDO | OWAN EAST | OVBIOMU TOWN HALL,OVBIOMU | 87 | **153** | +66 | added | 2026-11-08 |

| `05-02-03-133` | BAUCHI | BAUCHI | UNGUWAR BARNO PRIMARY SCHOOL III | 273 | **292** | +19 | added | 2026-11-08 |

| `27-08-04-011` | OGUN | IJEBU EAST | IWAYA ROAD | 528 | **537** | +9 | added | 2026-11-08 |

| `14-02-10-021` | ENUGU | AWGU | UMUAMANU VILLAGE SQUARE III | 151 | **161** | +10 | added | 2026-11-08 |

| `34-08-05-022` | TARABA | KARIM-LAMIDO | KALANKOH DISPENSARY | 82 | **82** | 0 | added | 2026-11-08 |

| `19-36-08-001` | KANO | SUMAILA | AWAYA | 349 | **352** | +3 | added | 2026-11-08 |

| `27-01-05-032` | OGUN | ABEOKUTA NORTH | OPEN SPACE AT IDOFIN JUNCTION, IYAN RESERVOIRE | 72 | **95** | +23 | added | 2026-11-08 |

| `01-02-09-025` | ABIA | ABA SOUTH | GLOUCESTER-GREEN STREET PRIM.SCHOOL I | 796 | **779** | -17 | added | 2026-11-08 |

| `32-12-17-004` | RIVERS | GOKANA | C.P.S. VI BIARA GIONSUGI I | 750 | **764** | +14 | added | 2026-11-08 |

| `24-11-08-007` | LAGOS | IKEJA | JUNCTION OF AINA ELEKO/OLAIDE BENSON | 710 | **743** | +33 | added | 2026-11-08 |

| `22-06-07-016` | KOGI | IBAJI | NWAJALA II OPEN SPACE | 1389 | **1452** | +63 | added | 2026-11-08 |

| `14-03-03-014` | ENUGU | ENUGU EAST | BACK TO LAND SQUARE AMANGWU I | 9 | **12** | +3 | added | 2026-11-08 |

| `12-16-07-007` | EDO | OWAN EAST | EKPENGA PRY. SCHOOL, IKHIN | 750 | **762** | +12 | added | 2026-11-08 |

| `24-02-02-005` | LAGOS | AJEROMI/IFELODUN | 11, ZACHEUS STREET AJEGUNLE I | 367 | **362** | -5 | added | 2026-11-08 |

| `02-18-09-012` | ADAMAWA | SONG | WURO KONCHA | 197 | **200** | +3 | added | 2026-11-08 |

| `05-18-01-039` | BAUCHI | TORO | YELWAN  GARI,  KOFAR SARKI | 570 | **619** | +49 | added | 2026-11-08 |

| `01-11-07-026` | ABIA | OSISIOMA | UMUEJI  VILLAGE HALL | 65 | **82** | +17 | added | 2026-11-08 |

| `16-25-04-018` | IMO | OWERRI MUNICIPAL | ITC PARK | 148 | **157** | +9 | added | 2026-11-08 |

| `02-14-06-013` | ADAMAWA | MUBI NORTH | MAYO BANI PRIMARY SCH | 588 | **584** | -4 | added | 2026-11-08 |

| `09-16-07-007` | CROSS RIVER | OGOJA | ST. MARK'S PRIMARY SCHOOL, UKPAGADA I | 805 | **818** | +13 | added | 2026-11-08 |

| `28-10-06-017` | ONDO | ILAJE | IGBOBI, BAPTIST PRY. SCHOOL, IGBOBI | 362 | **367** | +5 | added | 2026-11-08 |

| `21-14-04-013` | KEBBI | MAIYAMA | KARAYE PRI. SCH.(KARAYE YAMMA GARKAR TSOHO) | 750 | **864** | +114 | added | 2026-11-08 |

| `30-13-05-007` | OYO | IBARAPA NORTH | OKE OLA MARKET II | 358 | **409** | +51 | added | 2026-11-08 |

| `24-14-16-010` | LAGOS | LAGOS ISLAND | OPEN SPACE AT ARAROMI/BECKLEY JUNCTION | 72 | **237** | +165 | added | 2026-11-08 |

| `37-06-10-097` | FCT | MUNICIPAL | JIKWOYI/GAGADNAPNA BY PROPOSED CHIEF PALACE | 27 | **38** | +11 | added | 2026-11-08 |

| `30-23-05-006` | OYO | OGO-OLUWA | AJELANWA VILLAGE | 298 | **328** | +30 | added | 2026-11-08 |

| `04-02-08-018` | ANAMBRA | AYAMELUM | AMA ISIKAKWU HALL II | 49 | **152** | +103 | added | 2026-11-08 |

| `36-03-02-012` | ZAMFARA | BIRNIN MAGAJI | SHAMUSHALE II/ SHIYAR WAKILI | 681 | **685** | +4 | added | 2026-11-08 |

| `12-08-05-018` | EDO | ETSAKO EAST | AFEGBUA P/S AWUYEMI III | 101 | **262** | +161 | added | 2026-11-08 |

| `27-15-05-008` | OGUN | OBAFEMI/OWODE | R.C.M. SCHOOL, IDOWU OFONRAN | 244 | **252** | +8 | added | 2026-11-08 |

| `07-08-12-003` | BENUE | GWER WEST | ABIAN - ABIAN MARKET SQUARE | 906 | **938** | +32 | added | 2026-11-08 |

| `05-03-09-007` | BAUCHI | BOGORO | MBALL,   MBALL  PRIMARY SCHOOL | 695 | **786** | +91 | added | 2026-11-08 |

| `31-07-07-009` | PLATEAU | KANAM | KAKYAM | 1334 | **1332** | -2 | added | 2026-11-08 |

| `02-06-03-003` | ADAMAWA | GUYUK | DOMA/ DOMA PRY. SCH. | 750 | **795** | +45 | added | 2026-11-08 |

| `24-10-07-052` | LAGOS | IFAKO-IJAYE | 83, IJU ROAD BY IMOLA ESTATE | 57 | **56** | -1 | added | 2026-11-08 |

| `14-04-13-006` | ENUGU | ENUGU NORTH | METHODIST PRIMARY SCHOOL II | 552 | **542** | -10 | added | 2026-11-08 |

| `20-30-01-019` | KATSINA | RIMI | INWALA BAKIN KASUWA | 961 | **1002** | +41 | added | 2026-11-08 |

| `35-16-03-002` | YOBE | YUNUSARI | BIRNIN KOLORI, DANDALI | 811 | **884** | +73 | added | 2026-11-08 |

| `24-06-08-031` | LAGOS | BADAGRY | OPEN SPACE AT ILUPEJU | 77 | **99** | +22 | added | 2026-11-08 |

| `27-05-01-030` | OGUN | EGBADO SOUTH | OPEN SPACE AT FAYEGBAMI ATOYO ROAD | 106 | **426** | +320 | added | 2026-11-08 |

| `27-01-11-033` | OGUN | ABEOKUTA NORTH | ONIJAYE JUNCTION, SOKORI | 51 | **80** | +29 | added | 2026-11-08 |

| `12-02-01-013` | EDO | EGOR | ARUOSA PRIMARY SCHOOL,  EVBUOTUBU II | 722 | **728** | +6 | added | 2026-11-08 |

| `32-06-03-019` | RIVERS | ASARI-TORU | PEPPLE MEMORIAL HALL | 323 | **336** | +13 | added | 2026-11-08 |

| `25-12-03-010` | NASARAWA | TOTO | KARMO GANGI | 750 | **814** | +64 | added | 2026-11-08 |

| `25-04-01-075` | NASARAWA | KARU | ANGULU PRI. SCH. | 80 | **80** | 0 | added | 2026-11-08 |

| `24-12-02-019` | LAGOS | IKORODU | JUNCTION OF LADEGA/OLUBI ST. FRONTAGE OF MOSENNE COMPOUND. IKD. | 436 | **450** | +14 | added | 2026-11-08 |

| `33-21-08-024` | SOKOTO | WAMAKKO | KANEN TURU MASALACI | 505 | **540** | +35 | added | 2026-11-08 |

| `04-05-10-017` | ANAMBRA | ANAOCHA | CENTRAL SCHOOL III | 199 | **210** | +11 | added | 2026-11-08 |

| `18-07-02-002` | KADUNA | JEMA'A | KOFAR TANGALASHI I./ KASTINA ST. | 735 | **783** | +48 | added | 2026-11-08 |

| `10-10-02-012` | DELTA | ISOKO SOUTH | DAILY MARKET, DAILY MARKET | 771 | **915** | +144 | added | 2026-11-08 |

| `24-12-17-007` | LAGOS | IKORODU | AFRICAN BETHEL PRY. SCHOOL, MAYA | 931 | **981** | +50 | added | 2026-11-08 |

| `04-11-10-026` | ANAMBRA | IDEMILI-SOUTH | OKUZU AKANATO HALL | 111 | **488** | +377 | added | 2026-11-08 |

| `27-09-05-026` | OGUN | IJEBU NORTH | SHAMSUDEEN GRAMMAR SCHOOL .OKE AGBO | 282 | **532** | +250 | added | 2026-11-08 |

| `22-19-03-001` | KOGI | OMALA | LGEA SCHOOL OPADA, OPADA/AJEDIBALE | 444 | **481** | +37 | added | 2026-11-08 |

| `28-16-08-014` | ONDO | ONDO WEST | ST JOHNS BOSCO SCH, OKEDERA II | 770 | **735** | -35 | added | 2026-11-08 |

| `15-11-02-022` | GOMBE | YALMALTU/ DEBA | NAHUTA J. BABA, KOFAR J. NAHUTA | 478 | **495** | +17 | added | 2026-11-08 |

| `36-10-06-003` | ZAMFARA | MARU | ZAMAN GIRA / PRIMARY SCH | 562 | **559** | -3 | added | 2026-11-08 |

| `04-07-14-006` | ANAMBRA | AWKA SOUTH | EZI NWANKWO PRY. SCHOOL I | 476 | **493** | +17 | added | 2026-11-08 |

| `18-17-06-023` | KADUNA | LERE | DOGON DAJI  I | 3 | **177** | +174 | added | 2026-11-08 |

| `27-15-02-059` | OGUN | OBAFEMI/OWODE | IJERE ELELEDE WORUGUDU TOWNHALL PAKURO | 330 | **778** | +448 | added | 2026-11-08 |

| `29-20-11-004` | OSUN | IREPODUN | JAGBA AREA I | 414 | **453** | +39 | added | 2026-11-08 |

| `16-13-06-008` | IMO | NJABA | UMUGBA/AMAUKWU UMUGBA SQ. | 677 | **714** | +37 | added | 2026-11-08 |

| `28-10-11-004` | ONDO | ILAJE | AJEGUNLE 11, L.A SCH AJEGUNLE | 367 | **383** | +16 | added | 2026-11-08 |

| `15-07-07-005` | GOMBE | KALTUNGO | BEKWALUME,  BEKWALUME | 741 | **791** | +50 | added | 2026-11-08 |

| `36-10-09-003` | ZAMFARA | MARU | BAKIN KASUWA / RUNFA DOGO | 750 | **776** | +26 | added | 2026-11-08 |

| `10-18-09-034` | DELTA | UDU | ISUVWEN/ EKROVE OPEN SPACE | 321 | **325** | +4 | added | 2026-11-08 |

| `13-08-05-010` | EKITI | IDO / OSI | ILE OLOFIN , OLD ANGLICAN CHURCH | 283 | **288** | +5 | added | 2026-11-08 |

| `31-15-03-001` | PLATEAU | RIYOM | DANTO PRY. SCHOOL GANAWURI | 718 | **711** | -7 | added | 2026-11-08 |

| `05-03-08-009` | BAUCHI | BOGORO | BANRAM KAYARDA II | 164 | **284** | +120 | added | 2026-11-08 |

| `34-07-09-021` | TARABA | JALINGO | GINDIN RIMI, IBRAHIM DB | 735 | **722** | -13 | added | 2026-11-08 |

| `17-05-07-009` | JIGAWA | BUJI | BAKWARGA FADA AREWA PRI. SCH. | 756 | **803** | +47 | added | 2026-11-08 |

| `08-11-10-020` | BORNO | GWOZA | DUGJE NAGA | 451 | **470** | +19 | added | 2026-11-08 |

| `30-09-07-015` | OYO | IBADAN SOUTH-EAST | ENTRANCE OF C.A.C. GRAMMAR SCHOOL,ONIYERE | 469 | **472** | +3 | added | 2026-11-08 |

| `26-06-02-021` | NIGER | CHANCHAGA | MALLAM  MAITUMBI | 59 | **162** | +103 | added | 2026-11-08 |

| `01-01-06-023` | ABIA | ABA NORTH | STELLA MARIS SEC. SCHOOL  - SCHOOL PREMISES VI | 627 | **619** | -8 | added | 2026-11-08 |

| `32-05-01-029` | RIVERS | ANDONI | UBULOMAJA VILLAGE  SQUARE | 26 | **55** | +29 | added | 2026-11-08 |

| `18-06-05-006` | KADUNA | JABA | UNG ILIYA KUMDANGBO K/GIDAN ILIYA GAIYA | 558 | **564** | +6 | added | 2026-11-08 |

| `05-02-02-012` | BAUCHI | BAUCHI | FORMER GARKUWA HOUSE | 750 | **772** | +22 | added | 2026-11-08 |

| `31-02-05-027` | PLATEAU | BASSA | AGRIC | 17 | **93** | +76 | added | 2026-11-08 |

| `07-08-10-001` | BENUE | GWER WEST | ATONDIIR - ATONDIIR MARKET SQUARE | 717 | **738** | +21 | added | 2026-11-08 |

| `05-17-04-013` | BAUCHI | TAFAWA BALEWA | WADI | 282 | **305** | +23 | added | 2026-11-08 |

| `02-19-02-009` | ADAMAWA | TOUNGO | MIKUSUM/ KOFAR JAURO MIKUSUM | 112 | **146** | +34 | added | 2026-11-08 |

| `02-07-02-001` | ADAMAWA | HONG | BALANGA/ KOFAR JAURO BALANGA | 312 | **326** | +14 | added | 2026-11-08 |

| `24-17-05-076` | LAGOS | OJO | OPEN SPACE AT OKEMORO | 266 | **487** | +221 | added | 2026-11-08 |

| `17-11-03-020` | JIGAWA | GWARAM | KOFAR MAI UNGUWA/ROSO | 478 | **476** | -2 | added | 2026-11-08 |

| `21-01-03-005` | KEBBI | ALIERO | ATTAHIRU MODEL PRIMARY SCHOOL SABON GARI (SABON GARI) | 947 | **915** | -32 | added | 2026-11-08 |

| `04-21-04-008` | ANAMBRA | OYI | AMA IRUANYINIGWE VILLAGE SQUARE | 675 | **702** | +27 | added | 2026-11-08 |

| `18-04-03-020` | KADUNA | IGABI | JOGA I | 1074 | **1141** | +67 | added | 2026-11-08 |

| `27-07-05-044` | OGUN | IFO | OPEN SPACE NIYI AYEYE JUNCTION BY CHANNELS ISHERI | 193 | **200** | +7 | added | 2026-11-08 |

| `32-10-07-003` | RIVERS | EMOHUA | OPEN SPACE, UKELI | 791 | **795** | +4 | added | 2026-11-08 |

| `20-03-04-013` | KATSINA | BATSARI | ZAMFARAWA/TV CENTRE | 681 | **759** | +78 | added | 2026-11-08 |

| `37-06-08-031` | FCT | MUNICIPAL | NAVAL BARRACKS | 794 | **901** | +107 | added | 2026-11-08 |

| `32-15-10-097` | RIVERS | OBIO/AKPOR | OPEN SPACE BY WOBO STREET, ORO-AGBOLU. | 8 | **21** | +13 | added | 2026-11-08 |

| `22-08-07-020` | KOGI | IGALAMELA/ODOLU | OKADA BUS STOP F.P.I | 131 | **186** | +55 | added | 2026-11-08 |

| `11-08-08-034` | EBONYI | ISHIELU | COMM. PRI. SCH. AGUOBODO II | 334 | **358** | +24 | added | 2026-11-08 |

| `18-14-11-002` | KADUNA | KAURU | KAGADAMA II/ L.E.A. PRY. SCH. | 745 | **799** | +54 | added | 2026-11-08 |

| `18-07-05-017` | KADUNA | JEMA'A | JAGINDI TASHA F/STATION/ JAGINDI TASHA F/STATION | 858 | **958** | +100 | added | 2026-11-08 |

| `26-01-07-014` | NIGER | AGAIE | NANKOKAN PRIMARY SCHOOL | 181 | **319** | +138 | added | 2026-11-08 |

| `27-09-11-014` | OGUN | IJEBU NORTH | IGAN ORILE | 216 | **246** | +30 | added | 2026-11-08 |

| `26-22-02-020` | NIGER | SHIRORO | UNG. BOKA | 750 | **744** | -6 | added | 2026-11-08 |

| `37-06-02-159` | FCT | MUNICIPAL | LEA NOMADIC PRIMARY & SECONDARY SCHOOL DUTSE | 44 | **172** | +128 | added | 2026-11-08 |

| `10-17-07-021` | DELTA | SAPELE | OVERAH ROAD JUNCTION BY DEDEVWO | 620 | **600** | -20 | added | 2026-11-08 |

| `22-05-06-029` | KOGI | DEKINA | BARRACK III MARKET SQUARE | 750 | **755** | +5 | added | 2026-11-08 |

| `33-02-05-002` | SOKOTO | BODINGA | LUNGUN  DARHELA P.S | 396 | **482** | +86 | added | 2026-11-08 |

| `08-21-12-001` | BORNO | MAIDUGURI M. C. | BABAYO MUYI BELLO | 549 | **566** | +17 | added | 2026-11-08 |

| `27-16-06-020` | OGUN | ODEDA | FCE SCHOOL GATE II | 103 | **262** | +159 | added | 2026-11-08 |

| `30-21-09-022` | OYO | OGBOMOSO NORTH | OPEN SPACE AT MOREKE JUNCTION | 86 | **230** | +144 | added | 2026-11-08 |

| `09-03-10-002` | CROSS RIVER | AKPABUYO | PLAYGROUND, IKOT NAKANDA | 865 | **862** | -3 | added | 2026-11-08 |

| `32-10-08-005` | RIVERS | EMOHUA | TOWN HALL, OMEGWA | 554 | **580** | +26 | added | 2026-11-08 |

| `32-20-01-016` | RIVERS | OPOBO/NKORO | PRIMARY SCHOOL KALAIBIAMA SCHOOL AVENUE | 197 | **203** | +6 | added | 2026-11-08 |

| `21-05-11-005` | KEBBI | BAGUDO | S/DADARE | 750 | **745** | -5 | added | 2026-11-08 |

| `20-01-07-002` | KATSINA | BAKORI | LAYIN MAHAUTA - K/G ALH.NUHU | 595 | **596** | +1 | added | 2026-11-08 |

| `19-37-06-035` | KANO | TAKAI | NASARAWA PRIMARY SCHOOL I | 50 | **122** | +72 | added | 2026-11-08 |

| `06-04-10-017` | BAYELSA | NEMBE | UBE DOGUEWOAMA/HEALTH CENTRE | 594 | **656** | +62 | added | 2026-11-08 |

| `15-04-09-001` | GOMBE | DUKKU | WURO TALE, PRI. SCH. | 566 | **660** | +94 | added | 2026-11-08 |

| `13-01-11-016` | EKITI | ADO EKITI | AT AKOGUN'S COMP. / OLODE COMP. | 849 | **838** | -11 | added | 2026-11-08 |

| `28-18-04-001` | ONDO | OWO | ST PETERS C.A.C PRY SCH, OBALAJA TO IKARE RD | 1095 | **1035** | -60 | added | 2026-11-08 |

| `26-14-11-012` | NIGER | MAGAMA | UNGUWAN  HAUSAWA | 181 | **222** | +41 | added | 2026-11-08 |

| `24-10-07-055` | LAGOS | IFAKO-IJAYE | BY THE GATE MAPPLEWOOD ESTATE | 96 | **151** | +55 | added | 2026-11-08 |

| `18-01-04-028` | KADUNA | BIRNIN GWARI | MANDO CLINIC | 80 | **150** | +70 | added | 2026-11-08 |

| `24-03-06-081` | LAGOS | ALIMOSHO | OLD ONIGANDO PALACE ROAD II, IGANDO | 64 | **226** | +162 | added | 2026-11-08 |

| `10-17-02-016` | DELTA | SAPELE | AYOMANOR PRIMARY SCHOOL, SAPELE  IV | 377 | **464** | +87 | added | 2026-11-08 |

| `24-16-09-063` | LAGOS | MUSHIN | 54, YUSUF STREET | 97 | **160** | +63 | added | 2026-11-08 |

| `16-11-04-014` | IMO | MBAITOLI | AFOR ORJI MARKET SQUARE II | 786 | **794** | +8 | added | 2026-11-08 |

| `21-11-05-003` | KEBBI | JEGA | BIRNIN MALAM FADA  A | 542 | **707** | +165 | added | 2026-11-08 |

| `05-15-11-006` | BAUCHI | NINGI | RUWAN DINYA,  KOFAR MAI UNGUWA | 372 | **375** | +3 | added | 2026-11-08 |

| `22-06-02-014` | KOGI | IBAJI | IMIA UCHUCHU  II OKOCHE OPEN SPACE | 604 | **734** | +130 | added | 2026-11-08 |

| `18-10-02-072` | KADUNA | KADUNA SOUTH | NO 1 AMINU BAMBALE  SHAGARI LOW COST VI | 63 | **71** | +8 | added | 2026-11-08 |

| `32-03-04-009` | RIVERS | AHOADA WEST | PRIMARY SCHOOL, KUNUSHA | 385 | **416** | +31 | added | 2026-11-08 |

| `24-17-11-006` | LAGOS | OJO | IN FRONT OF ELECT. SEC. | 1376 | **1354** | -22 | added | 2026-11-08 |

| `16-23-10-011` | IMO | ORU EAST | ABIA CENTRAL SCHOOL | 750 | **1057** | +307 | added | 2026-11-08 |

| `07-09-04-020` | BENUE | KATSINA-ALA | TOWN CLUB II/UNDER MARINA TREES | 733 | **730** | -3 | added | 2026-11-08 |

| `24-20-07-038` | LAGOS | SURULERE | JUNCTION OF JOSEPH SHYNGLE ROAD/JAMES ROBERTON ROAD | 611 | **645** | +34 | added | 2026-11-08 |

| `06-07-08-008` | BAYELSA | SOUTHERN IJAW | AMASUO / OKOKODIA COMM.SQUARE | 608 | **610** | +2 | added | 2026-11-08 |

| `24-10-02-034` | LAGOS | IFAKO-IJAYE | 1, IDOWU SHOGBADE STR. | 48 | **109** | +61 | added | 2026-11-08 |

| `34-11-03-011` | TARABA | SARDAUNA | HAINARE, HAINARE PRIMARY SCHOOL | 1003 | **1165** | +162 | added | 2026-11-08 |

| `11-10-02-016` | EBONYI | IZZI | OFFEREKPE PRI. SCH. II | 578 | **954** | +376 | added | 2026-11-08 |

| `05-02-07-086` | BAUCHI | BAUCHI | YELWA MATERNITY II | 49 | **134** | +85 | added | 2026-11-08 |

| `24-15-09-008` | LAGOS | LAGOS MAINLAND | LADI-LAK INST. II | 366 | **392** | +26 | added | 2026-11-08 |

| `20-20-01-011` | KATSINA | KANKIA | UNG KANAWA OPEN SPACE | 603 | **628** | +25 | added | 2026-11-08 |

| `03-31-08-002` | AKWA IBOM | UYO | PRY SCH, ITON IKONO I | 392 | **405** | +13 | added | 2026-11-08 |

| `24-07-02-001` | LAGOS | EPE | IN FRONT OF LAGBADE MOSQUE | 341 | **394** | +53 | added | 2026-11-08 |

| `32-03-10-006` | RIVERS | AHOADA WEST | YOUTH CENTRE ODHIWU | 145 | **176** | +31 | added | 2026-11-08 |

| `14-01-07-008` | ENUGU | ANINRI | CENTRAL SCHOOL UHUEZE II | 750 | **750** | 0 | added | 2026-11-08 |

| `19-03-08-002` | KANO | BAGWAI | JARUMAWA PRI. SCH I . (JARUMAWA CIKIN GARI) | 808 | **812** | +4 | added | 2026-11-08 |

| `23-02-04-010` | KWARA | BARUTEN | NINGURUME  L.G.E.A.SCH | 548 | **609** | +61 | added | 2026-11-08 |

| `12-18-06-029` | EDO | UHUNMWODE | OGUEKA TOWN HALL | 465 | **708** | +243 | added | 2026-11-08 |

| `19-29-11-010` | KANO | MAKODA | WAILARE GARI IV | 45 | **157** | +112 | added | 2026-11-08 |

| `18-13-09-015` | KADUNA | KAURA | KAURA/ ADA BONNET | 562 | **598** | +36 | added | 2026-11-08 |

| `03-13-01-006` | AKWA IBOM | IKOT ABASI | VILLAGE SQUARE, UTA EWA | 750 | **721** | -29 | added | 2026-11-08 |

| `16-01-12-004` | IMO | ABOH MBAISE | COMMUNITY SCHOOL IBEKU | 885 | **913** | +28 | added | 2026-11-08 |

| `17-17-03-001` | JIGAWA | KAZAURE | BATSABA PRI. SCH./ BATSABA | 391 | **510** | +119 | added | 2026-11-08 |

| `15-06-03-034` | GOMBE | GOMBE | ARMY BARRACK IV SEC SCH | 121 | **165** | +44 | added | 2026-11-08 |

| `21-02-01-002` | KEBBI | AREWA | NIZZAMIYYA PRIMARY SCHOOL BUI (BIU SABON ZAMA ) | 964 | **987** | +23 | added | 2026-11-08 |

| `08-19-09-013` | BORNO | MAFA | AJARI VIEWING CENTER | 92 | **220** | +128 | added | 2026-11-08 |

| `29-04-08-002` | OSUN | AYEDIRE | AFRICAN CHURCH AREA, OPEN SPACE | 824 | **969** | +145 | added | 2026-11-08 |

| `31-02-11-011` | PLATEAU | BASSA | BIGAH | 114 | **120** | +6 | added | 2026-11-08 |

| `20-11-10-015` | KATSINA | DUTSI | MAKANGARA DISPENSARY | 16 | **34** | +18 | added | 2026-11-08 |

| `08-11-10-008` | BORNO | GWOZA | KIRAWA NOMADIC PRI. SCH. | 411 | **517** | +106 | added | 2026-11-08 |

| `32-22-02-001` | RIVERS | PORT HARCOURT | OROGBUM CIVIC CENTER I | 449 | **489** | +40 | added | 2026-11-08 |

| `13-11-03-010` | EKITI | IKOLE | IN FRONT OF CHIEF OLOMIDI GBASA'S HOUSE - IGBASA / IKASI/ ILADO | 529 | **651** | +122 | added | 2026-11-08 |

| `03-05-10-006` | AKWA IBOM | ESSIEN UDIM | VILLAGE SQUARE, IKOT OTU | 565 | **635** | +70 | added | 2026-11-08 |

| `25-09-09-012` | NASARAWA | NASARAWA | UNG. JARMAI-O/S | 651 | **650** | -1 | added | 2026-11-08 |

| `02-07-09-012` | ADAMAWA | HONG | PADA II / PRIMARY HEALTHCARE, BAKIN RIJIYA MARARRABA | 455 | **511** | +56 | added | 2026-11-08 |

| `15-01-02-058` | GOMBE | AKKO | BABA DIDI | 559 | **768** | +209 | added | 2026-11-08 |

| `32-15-10-094` | RIVERS | OBIO/AKPOR | OPEN SPACE BY ALEXANDER STREET, ULTIMATE JUNCTION, ORO-AKWOR. | 33 | **84** | +51 | added | 2026-11-08 |

| `15-01-02-012` | GOMBE | AKKO | ARDO BOYI, KOFAR JAURO | 897 | **949** | +52 | added | 2026-11-08 |

| `27-03-05-040` | OGUN | ADO ODO-OTA | COMMUNITY HEALTH CENTRE, ARIJE | 173 | **293** | +120 | added | 2026-11-08 |

| `24-06-04-016` | LAGOS | BADAGRY | BESIDE POLICE POST, APA | 319 | **513** | +194 | added | 2026-11-08 |

| `15-07-05-010` | GOMBE | KALTUNGO | JAURO GALE, K/ J GALE | 381 | **385** | +4 | added | 2026-11-08 |

| `29-27-09-004` | OSUN | OLORUNDA | FRONTAGE TOWN HALL | 414 | **539** | +125 | added | 2026-11-08 |

| `30-14-04-041` | OYO | IDO | METHODIST SCHOOL OKE-ODAN, APETE | 170 | **368** | +198 | added | 2026-11-08 |

| `17-23-01-003` | JIGAWA | RINGIM | KUNA PRI. SCH. KUNA/DOSA | 926 | **1054** | +128 | added | 2026-11-08 |

| `32-22-19-012` | RIVERS | PORT HARCOURT | OPEN SPACE BY SCHOOL ROAD URBAN COUNCIL GATE I (TRANS AMADI URBAN COUNCIL I) | 771 | **757** | -14 | added | 2026-11-08 |

| `36-07-10-031` | ZAMFARA | GUSAU | TUNGAR HAKI II/PRI. SCH. | 2 | **1447** | +1445 | added | 2026-11-08 |

| `27-20-14-002` | OGUN | SAGAMU | OPEN SPACE AT RASUSI COMPOUND | 542 | **569** | +27 | added | 2026-11-08 |

| `21-04-07-003` | KEBBI | AUGIE | BUBUCE DISPENSIRY (B/G/WANZAM) | 723 | **764** | +41 | added | 2026-11-08 |

| `11-08-15-017` | EBONYI | ISHIELU | NDIEZE PLAY GROUND | 31 | **120** | +89 | added | 2026-11-08 |

| `16-25-10-014` | IMO | OWERRI MUNICIPAL | IN FRONT OF COMPR HEALTH CENTRE AREA M, WBHE | 647 | **733** | +86 | added | 2026-11-08 |

| `09-13-04-017` | CROSS RIVER | OBUBRA | UBIBIRA PLAYGROUND | 695 | **743** | +48 | added | 2026-11-08 |

| `04-06-06-009` | ANAMBRA | AWKA NORTH | OBODO EZIKE SQUARE | 338 | **420** | +82 | added | 2026-11-08 |

| `12-15-09-010` | EDO | OVIA SOUTH WEST | AJAKURAMA SENIOR SECONDARY SCHOOL | 526 | **709** | +183 | added | 2026-11-08 |

| `24-14-04-014` | LAGOS | LAGOS ISLAND | FRONT OF ASHOGBON PALACE AGODOKOME ST. I | 530 | **567** | +37 | added | 2026-11-08 |

| `27-03-10-009` | OGUN | ADO ODO-OTA | OPPOSITE  DISPENSARY | 567 | **646** | +79 | added | 2026-11-08 |

| `03-01-01-022` | AKWA IBOM | ABAK | VILLAGE HALL, ATAI EDIENE | 484 | **500** | +16 | added | 2026-11-08 |

| `10-21-04-005` | DELTA | UKWUANI | UKWATA PRIMARY SCHOOL      OBINOMBA II | 750 | **752** | +2 | added | 2026-11-08 |

| `11-05-11-019` | EBONYI | EZZA NORTH | NGAMGBO NWOBOWHE P/G | 19 | **130** | +111 | added | 2026-11-08 |

| `26-16-09-001` | NIGER | MASHEGU | MAKAZANTA PRIMARY SCHOOL | 343 | **369** | +26 | added | 2026-11-08 |

| `37-05-08-011` | FCT | KWALI | JUNIOR SEC. SCH KWAITA HAUSA | 579 | **1030** | +451 | added | 2026-11-08 |

| `18-04-05-021` | KADUNA | IGABI | UNG. SHEKA | 287 | **295** | +8 | added | 2026-11-08 |

| `18-23-01-045` | KADUNA | ZARIA | UNG ASKA II/K/G MAGAJIN ASKA | 606 | **666** | +60 | added | 2026-11-08 |

| `24-17-05-021` | LAGOS | OJO | OPEN SPACE AT YELLOW CORNER IGBO-ELERIN VILLAGE | 1465 | **1467** | +2 | added | 2026-11-08 |

| `03-25-10-006` | AKWA IBOM | ORON | ST PAUL'S PRY SCH II | 515 | **662** | +147 | added | 2026-11-08 |

| `09-12-06-007` | CROSS RIVER | OBANLIKU | PRIMARY SCHOOL, KAKWE | 162 | **258** | +96 | added | 2026-11-08 |

| `04-01-02-002` | ANAMBRA | AGUATA | UMUELEKE HALL I | 491 | **558** | +67 | added | 2026-11-08 |

| `04-09-03-012` | ANAMBRA | EKWUSIGO | CENTRAL SCHOOL NKWO EDO II | 313 | **316** | +3 | added | 2026-11-08 |

| `31-15-03-015` | PLATEAU | RIYOM | GRADE 1 AREA COURT GANAWURI | 154 | **199** | +45 | added | 2026-11-08 |

| `28-06-02-032` | ONDO | AKURE SOUTH | ERUOBA,IN FRONT OF FALADES COMPOUND | 735 | **710** | -25 | added | 2026-11-08 |

| `26-10-03-007` | NIGER | KATCHA | TAKUNTU | 834 | **1144** | +310 | added | 2026-11-08 |

| `32-15-12-058` | RIVERS | OBIO/AKPOR | OPEN SPACE BY IVORY PALACE CHURCH, OWOLOMA ROAD OFF OBI-WALI ROAD, MGBUESILARU, RUMUIGBO | 44 | **59** | +15 | added | 2026-11-08 |

| `31-08-10-005` | PLATEAU | KANKE | KALIN | 914 | **920** | +6 | added | 2026-11-08 |

| `09-11-03-048` | CROSS RIVER | IKOM | PLAYGROUND ALLEGE QUARTER | 57 | **64** | +7 | added | 2026-11-08 |

| `01-11-03-068` | ABIA | OSISIOMA | ABIA STATE UNIVERSITY SCHOOL IV | 109 | **118** | +9 | added | 2026-11-08 |

| `18-01-09-012` | KADUNA | BIRNIN GWARI | UNG. SAMINAKA | 421 | **453** | +32 | added | 2026-11-08 |

| `19-30-02-002` | KANO | MINJIBIR | BAGURAWA GABAS,  PRIMARY SCHOOL I | 761 | **897** | +136 | added | 2026-11-08 |

| `18-17-07-035` | KADUNA | LERE | TASHA | 223 | **227** | +4 | added | 2026-11-08 |

| `06-03-07-003` | BAYELSA | KOLOKUMA/OPOKUMA | ORUBIRIB OGBO TOWN HALL | 388 | **483** | +95 | added | 2026-11-08 |

| `24-12-02-018` | LAGOS | IKORODU | JUNCTION OF LADEGA/ADENAIKE ALAGBE ST. IKD. | 456 | **497** | +41 | added | 2026-11-08 |

| `19-38-03-020` | KANO | TARAUNI | KUNDILA PRIMARY SCHOOL II | 1213 | **1225** | +12 | added | 2026-11-08 |

| `36-01-02-015` | ZAMFARA | ANKA | S/GARI SALA/S/ GARI | 245 | **247** | +2 | added | 2026-11-08 |

| `32-23-06-006` | RIVERS | TAI | C.P.S. HALL, KPORGHOR | 656 | **678** | +22 | added | 2026-11-08 |

| `29-10-11-010` | OSUN | EJIGBO | MOLOSANOWO VILLAGE | 194 | **243** | +49 | added | 2026-11-08 |

| `35-07-05-008` | YOBE | GUJBA | KUNDULI YARI, KUNDULI YARI | 479 | **594** | +115 | added | 2026-11-08 |

| `06-07-17-017` | BAYELSA | SOUTHERN IJAW | ADOWEI II OPEN SPACE | 619 | **650** | +31 | added | 2026-11-08 |

| `05-02-03-082` | BAUCHI | BAUCHI | GIDIN RIMI, GWABBA | 50 | **67** | +17 | added | 2026-11-08 |

| `05-06-03-006` | BAUCHI | DASS | MAKAMA, OLD POLICE STATION | 1564 | **1557** | -7 | added | 2026-11-08 |

| `18-02-02-014` | KADUNA | CHIKUN | BASHISHI/ BASHISHI | 183 | **233** | +50 | added | 2026-11-08 |

| `32-12-09-004` | RIVERS | GOKANA | STATE SCHOOL KPOR, NOMA BON I | 612 | **683** | +71 | added | 2026-11-08 |

| `20-27-09-007` | KATSINA | MASHI | AFANAWA/DOKA - UNG.BADOLE | 531 | **556** | +25 | added | 2026-11-08 |

| `13-05-06-010` | EKITI | EKITI SOUTH WEST | ASA / OBANLA  / NEAR OBANLA | 342 | **340** | -2 | added | 2026-11-08 |

| `29-24-01-006` | OSUN | OBOKUN | IBOKUN GRAMMAR SCHOOL | 778 | **866** | +88 | added | 2026-11-08 |

| `24-03-10-085` | LAGOS | ALIMOSHO | BAKARE JAFOJO STREET, OKI | 66 | **182** | +116 | added | 2026-11-08 |

| `30-17-10-008` | OYO | ITESIWAJU | ABA LEKE VILLAGE | 287 | **283** | -4 | added | 2026-11-08 |

| `13-04-11-011` | EKITI | EKITI WEST | FRONT OF CHIEF OLOYE'S HOUSE , OKE OYE | 430 | **477** | +47 | added | 2026-11-08 |

| `24-12-05-016` | LAGOS | IKORODU | BESIDE, OLAYINKA ST. MAJIDUN AWORI | 559 | **587** | +28 | added | 2026-11-08 |

| `32-15-09-048` | RIVERS | OBIO/AKPOR | RUMURUNUWORNJOR COMMUNITY HALL BY IKWERRE ROAD | 30 | **163** | +133 | added | 2026-11-08 |

| `30-04-04-001` | OYO | ATISBO | NURSERY PRIMARY SCHOOL I (A) | 222 | **219** | -3 | added | 2026-11-08 |

| `32-13-10-006` | RIVERS | IKWERRE | OMUOWHOR VILLAGE SQUARE | 502 | **519** | +17 | added | 2026-11-08 |

| `10-17-03-009` | DELTA | SAPELE | OLEH BY AGHOGHORUMA | 776 | **758** | -18 | added | 2026-11-08 |

| `31-10-07-003` | PLATEAU | LANGTANG SOUTH | TAHDUM PRIMARY SCHOOL | 567 | **608** | +41 | added | 2026-11-08 |

| `17-20-09-006` | JIGAWA | MAIGATARI | A.B ISLAMMIYYA PRI. SCH.  UNG. GABAS II | 641 | **653** | +12 | added | 2026-11-08 |

| `04-07-15-002` | ANAMBRA | AWKA SOUTH | UMUNONO HALL II | 858 | **1018** | +160 | added | 2026-11-08 |

| `12-15-03-007` | EDO | OVIA SOUTH WEST | OJUMU,  OKUA P/SCHOOL | 255 | **264** | +9 | added | 2026-11-08 |

| `04-05-05-010` | ANAMBRA | ANAOCHA | KINDERGARTEN IBEKWE II | 252 | **251** | -1 | added | 2026-11-08 |

| `31-05-13-062` | PLATEAU | JOS NORTH | UNG. LAGOS T/WADA III | 683 | **668** | -15 | added | 2026-11-08 |

| `14-04-06-016` | ENUGU | ENUGU NORTH | OGBETTE PRIMARY SCHOOL IV | 785 | **800** | +15 | added | 2026-11-08 |

| `17-06-10-010` | JIGAWA | DUTSE | KUHO PRI. SCH | 2160 | **2235** | +75 | added | 2026-11-08 |

| `28-10-12-003` | ONDO | ILAJE | MOLUTEHIN 1, L.A SCH MOLUTEHIN | 606 | **772** | +166 | added | 2026-11-08 |

| `26-22-14-004` | NIGER | SHIRORO | SHE MAKARANTA | 846 | **835** | -11 | added | 2026-11-08 |

| `32-15-11-009` | RIVERS | OBIO/AKPOR | OPEN SPACE IN FRONT OF NO.302 IKWERRE RD BESIDE OCC HOUSE MGBA | 37 | **57** | +20 | added | 2026-11-08 |

| `26-15-10-008` | NIGER | MARIGA | UNG. WAZIRI  II | 506 | **510** | +4 | added | 2026-11-08 |

| `30-03-07-002` | OYO | ATIBA | AJEGUNLE/ BOROBORO | 750 | **795** | +45 | added | 2026-11-08 |

| `04-13-14-010` | ANAMBRA | NJIKOKA | UMUKWA NURSERY SCHOOL II | 481 | **512** | +31 | added | 2026-11-08 |

| `08-27-06-004` | BORNO | SHANI | LAJADA PRI. SCH. , LAJADA  II | 220 | **238** | +18 | added | 2026-11-08 |

| `02-03-10-012` | ADAMAWA | GANYE | LABARI/ KJ LABARI | 400 | **408** | +8 | added | 2026-11-08 |

| `19-16-02-007` | KANO | GAYA | BURJI/DAGARAWA | 319 | **340** | +21 | added | 2026-11-08 |

| `32-18-06-026` | RIVERS | OKRIKA | OSOKOLO'S COMPOUND | 520 | **529** | +9 | added | 2026-11-08 |

| `25-08-03-013` | NASARAWA | LAFIA | GOVT.COLLEGE LAFIA - PB | 890 | **1057** | +167 | added | 2026-11-08 |

| `29-27-07-005` | OSUN | OLORUNDA | IN FRONT OF OLD MUSEUM | 750 | **730** | -20 | added | 2026-11-08 |

| `11-01-13-005` | EBONYI | ABAKALIKI | OKWUNYIRIONU PRIMARY SCHOOL I | 926 | **949** | +23 | added | 2026-11-08 |

| `17-23-07-015` | JIGAWA | RINGIM | KOFAR MAI'UNGUWA/SALIFAWA | 627 | **673** | +46 | added | 2026-11-08 |

| `03-31-06-031` | AKWA IBOM | UYO | NUNG EBET AYA, EFIAT MULTIPURPOSE CO-OP HALL | 187 | **346** | +159 | added | 2026-11-08 |

| `36-04-02-002` | ZAMFARA | BUKKUYUM | SHIYAR UBAN DAWAKI   /   WOMEN CENTRE | 750 | **849** | +99 | added | 2026-11-08 |

| `10-12-09-001` | DELTA | NDOKWA WEST | UMIA PRIMARY SCHOOL - UMU-ONYUGBA | 655 | **717** | +62 | added | 2026-11-08 |

| `34-02-03-001` | TARABA | BALI | ASINAI, ASINAI | 712 | **699** | -13 | added | 2026-11-08 |

| `19-16-06-021` | KANO | GAYA | TAMBULI | 362 | **387** | +25 | added | 2026-11-08 |

| `05-12-05-006` | BAUCHI | KATAGUM | JUGGA,    KOFAR JAURO | 474 | **475** | +1 | added | 2026-11-08 |

| `01-13-02-002` | ABIA | UKWA EAST | OBUOZU VILLAGE HALL - OBUOZU | 830 | **830** | 0 | added | 2026-11-08 |

| `10-20-02-005` | DELTA | UGHELLI SOUTH | UDUVWUKPOKPO  HALL, GBAREGOLOR | 603 | **691** | +88 | added | 2026-11-08 |

| `06-07-14-016` | BAYELSA | SOUTHERN IJAW | EKENI  I OPEN SPACE I | 506 | **606** | +100 | added | 2026-11-08 |

| `32-13-06-013` | RIVERS | IKWERRE | UMUGWOHA VILLAGE CENTRE APANI | 452 | **461** | +9 | added | 2026-11-08 |

| `28-13-10-031` | ONDO | ODIGBO | OPEN SPACE AT OWODUNNI STREET OPP. BLESSING SCHOOL, ORE | 126 | **298** | +172 | added | 2026-11-08 |

| `26-15-10-001` | NIGER | MARIGA | MAZAME  I | 400 | **400** | 0 | added | 2026-11-08 |

| `01-15-05-061` | ABIA | UMUAHIA NORTH | OGWUNAOSHIOHA  OKWULAGA VILLAGE HALL | 194 | **222** | +28 | added | 2026-11-08 |

| `32-11-16-002` | RIVERS | ETCHE | UMUAGHARA | 615 | **681** | +66 | added | 2026-11-08 |

| `34-06-06-021` | TARABA | IBI | MALLAM DAM SAMBO OPEN SPACE RIMI UKU I,IBI | 144 | **176** | +32 | added | 2026-11-08 |

| `14-12-10-011` | ENUGU | NKANU WEST | BOYS' SECONDARY SCHOOL II | 315 | **407** | +92 | added | 2026-11-08 |

| `05-08-08-008` | BAUCHI | GANJUWA | UNGUWAN S. KUDU,  KOFAR SARKI | 571 | **574** | +3 | added | 2026-11-08 |

| `19-18-09-024` | KANO | GWALE | IMAMU MALIK ISLAMIYYA  ZAWA'I | 34 | **48** | +14 | added | 2026-11-08 |

| `23-08-05-028` | KWARA | ILORIN-WEST | ODE ELEJA ADABATA | 750 | **758** | +8 | added | 2026-11-08 |

| `17-01-05-010` | JIGAWA | AUYO | GASANYA PRIMARY SCHOOL II | 161 | **322** | +161 | added | 2026-11-08 |

| `21-19-03-003` | KEBBI | WASAGU/DANKO | DANUMARU YAMMA | 713 | **995** | +282 | added | 2026-11-08 |

| `24-08-09-057` | LAGOS | ETI-OSA | 17A BOURDILLON ROAD | 67 | **100** | +33 | added | 2026-11-08 |

| `37-02-07-058` | FCT | BWARI | LEA PRI. SCHOOL BMUKO II | 467 | **610** | +143 | added | 2026-11-08 |

| `33-05-08-019` | SOKOTO | GORONYO | SHIYAR KWANNAWA | 51 | **251** | +200 | added | 2026-11-08 |

| `09-11-03-042` | CROSS RIVER | IKOM | PLAYGROUND BY PETER EKA STREET | 743 | **767** | +24 | added | 2026-11-08 |

| `12-13-10-005` | EDO | ORHIONMWON | AIWAGU ORE P/SCHOOL, EVBOESI           I | 499 | **653** | +154 | added | 2026-11-08 |

| `26-23-01-014` | NIGER | SULEJA | KANTOMA GARAGE OPEN SPACE | 358 | **352** | -6 | added | 2026-11-08 |

| `29-28-03-004` | OSUN | ORIADE | ST. MATHEW PRY. SCHOOL, 'B' IJEBU-JESA | 469 | **694** | +225 | added | 2026-11-08 |

| `03-14-10-007` | AKWA IBOM | IKOT EKPENE | TOWN HALL, IKOT ESA UDO | 412 | **446** | +34 | added | 2026-11-08 |

| `33-03-05-002` | SOKOTO | DANGE/SHUNI | SHUNI  MODEL PRY SCHOOL | 977 | **1031** | +54 | added | 2026-11-08 |

| `29-11-01-018` | OSUN | IFE CENTRAL | OPEN SPACE, ADJACENT FOURSQUARE GOSPEL CHURCH OLUWALOSE QUARTERS | 365 | **376** | +11 | added | 2026-11-08 |

| `10-22-05-028` | DELTA | UVWIE | RUTE INTERNATIONAL SCHOOL DDPA | 149 | **147** | -2 | added | 2026-11-08 |

| `04-10-07-046` | ANAMBRA | IDEMILI NORTH | UMUOTA  P/S II | 904 | **924** | +20 | added | 2026-11-08 |

| `30-14-10-015` | OYO | IDO | COMM PRIMARY SCHOOL OKE ALARO | 167 | **336** | +169 | added | 2026-11-08 |

| `28-06-09-049` | ONDO | AKURE SOUTH | OPEN SPACE KIKIOWO SHOPPING COMPLEX ALONG OLUWATUYI | 20 | **45** | +25 | added | 2026-11-08 |

| `21-06-04-015` | KEBBI | BIRNIN KEBBI | YAR YARA TOWN MPS | 374 | **362** | -12 | added | 2026-11-08 |

| `33-03-01-010` | SOKOTO | DANGE/SHUNI | HAUSA GARKAR HAKIMI | 559 | **639** | +80 | added | 2026-11-08 |

| `30-08-01-011` | OYO | IBADAN NORTH WEST | OKUNOLA IWERE | 609 | **602** | -7 | added | 2026-11-08 |

| `03-10-03-009` | AKWA IBOM | IBIONO IBOM | VILLAGE HALL, IKOT MKPO | 303 | **313** | +10 | added | 2026-11-08 |

| `06-01-06-007` | BAYELSA | BRASS | EGWEAMA -OGBO, OPEN SPACE | 371 | **426** | +55 | added | 2026-11-08 |

| `21-05-10-005` | KEBBI | BAGUDO | TUNGAN SHANGA | 429 | **456** | +27 | added | 2026-11-08 |

| `18-12-06-001` | KADUNA | KAJURU | D.E.O. OFFICE, D.E.O OFFICE | 847 | **876** | +29 | added | 2026-11-08 |

| `21-17-05-010` | KEBBI | SHANGA | TAFKI TARA DISPENSARY | 118 | **161** | +43 | added | 2026-11-08 |

| `24-18-01-095` | LAGOS | OSHODI/ISOLO | 21, OGUNLAJA STREET | 1 | **2** | +1 | added | 2026-11-08 |

| `13-12-04-001` | EKITI | ILEJEMEJE | ODOUN , M 12 AYEREMI STREET | 264 | **307** | +43 | added | 2026-11-08 |

| `27-03-03-001` | OGUN | ADO ODO-OTA | IDI OROGBO I | 1221 | **1191** | -30 | added | 2026-11-08 |

| `03-18-04-008` | AKWA IBOM | MKPAT ENIN | VILLAGE HALL, NUNG UKIM III. I | 484 | **521** | +37 | added | 2026-11-08 |

| `24-03-01-104` | LAGOS | ALIMOSHO | FRONT OF 11 BAMMEKE ROAD SHASHA | 65 | **223** | +158 | added | 2026-11-08 |

| `21-13-10-014` | KEBBI | KOKO/BESSE | T/TUNE/T.ATIKU | 154 | **184** | +30 | added | 2026-11-08 |

| `19-18-10-007` | KANO | GWALE | MAITASA PRIMARY SCHOOL IV | 1028 | **1081** | +53 | added | 2026-11-08 |

| `05-17-11-025` | BAUCHI | TAFAWA BALEWA | UNGUWAR MAGAJI  I,   PRIMARY SCHOOL | 491 | **509** | +18 | added | 2026-11-08 |

| `24-04-06-034` | LAGOS | AMUWO-ODOFIN | PIPELINE JUNCTION | 448 | **568** | +120 | added | 2026-11-08 |

| `16-02-01-013` | IMO | AHIAZU MBAISE | AFOR OGBE MARKET SQUARE II | 537 | **554** | +17 | added | 2026-11-08 |

| `26-23-09-059` | NIGER | SULEJA | UNG YAKUBU HOLY MESSIAH GABODNA | 158 | **189** | +31 | added | 2026-11-08 |

| `31-03-05-018` | PLATEAU | BOKKOS | VILLAGE SQUARE RUBOI TARANGOL | 211 | **272** | +61 | added | 2026-11-08 |

| `30-26-06-008` | OYO | ONA-ARA | GBAREMU | 728 | **813** | +85 | added | 2026-11-08 |

| `16-06-13-006` | IMO | IDEATO SOUTH | OKWARAEJESU SQ. | 571 | **667** | +96 | added | 2026-11-08 |

| `19-18-01-032` | KANO | GWALE | SANI BUHARI G. SCI. SEC. SCH.. (III) | 47 | **87** | +40 | added | 2026-11-08 |

| `26-06-02-007` | NIGER | CHANCHAGA | GIDAN HASSAN | 750 | **831** | +81 | added | 2026-11-08 |

| `08-21-06-009` | BORNO | MAIDUGURI M. C. | ALHAJI ADAMU JIKAN LADI  I | 474 | **482** | +8 | added | 2026-11-08 |

| `04-15-18-016` | ANAMBRA | NNEWI SOUTH | UMUIKE HALL I | 325 | **386** | +61 | added | 2026-11-08 |

| `32-15-11-022` | RIVERS | OBIO/AKPOR | OPEN SPACE INFRONT OF NO 11 RUMUCHIOLU RD | 35 | **61** | +26 | added | 2026-11-08 |

| `08-11-09-018` | BORNO | GWOZA | BULAMA NGAYA | 308 | **308** | 0 | added | 2026-11-08 |

| `18-10-01-046` | KADUNA | KADUNA SOUTH | NO.29 GALADIMA STREET, NO.29 GALADIMA STREET | 765 | **762** | -3 | added | 2026-11-08 |

| `14-02-10-020` | ENUGU | AWGU | UGBO ASHA VILLAGE SQUARE I | 407 | **410** | +3 | added | 2026-11-08 |

| `34-07-03-009` | TARABA | JALINGO | WURO MUSA, WURO MUSA | 845 | **834** | -11 | added | 2026-11-08 |

| `31-13-11-007` | PLATEAU | PANKSHIN | KYAM | 741 | **789** | +48 | added | 2026-11-08 |

| `24-10-11-011` | LAGOS | IFAKO-IJAYE | 3, ADEMOLA ABIOLA ST. ALAKUKO | 1422 | **1382** | -40 | added | 2026-11-08 |

| `17-03-10-018` | JIGAWA | BIRNIN KUDU | DUTSE MAI DANGA | 437 | **437** | 0 | added | 2026-11-08 |

| `31-11-15-012` | PLATEAU | MANGU | AJING | 869 | **876** | +7 | added | 2026-11-08 |

| `19-21-07-024` | KANO | KANO MUNICIPAL | SALANTA S.P.S XVI (SALANTA XVI) | 887 | **998** | +111 | added | 2026-11-08 |

| `19-39-12-001` | KANO | TOFA | FAKO, FAKO OPEN SPACE | 466 | **486** | +20 | added | 2026-11-08 |

| `01-13-08-004` | ABIA | UKWA EAST | OBUNKU C.P.S - OBUNKU  II | 384 | **480** | +96 | added | 2026-11-08 |

| `07-11-02-007` | BENUE | KWANDE | LGEA PRI. SCHOOL, UJAKA I, SCHOOL PREMISES | 267 | **276** | +9 | added | 2026-11-08 |

| `14-15-06-016` | ENUGU | UDENU | OHULOR VILLAGE HALL | 351 | **354** | +3 | added | 2026-11-08 |

| `28-06-06-023` | ONDO | AKURE SOUTH | OPEN SPACE  AT  AMACING GRACE BLOCK INDUSTRY EMILORO | 72 | **135** | +63 | added | 2026-11-08 |

| `19-34-08-018` | KANO | ROGO | TUKURWAN BABASHI | 23 | **61** | +38 | added | 2026-11-08 |

| `03-03-03-011` | AKWA IBOM | EKET | OPEN SPACE IN FRONT OF AKS WATER COMPANY, OPPOSITE ST. GREGORY PRIMARY SCH. ALONG ST.GREGORY ROAD, USUNG INYANG | 668 | **712** | +44 | added | 2026-11-08 |

| `33-16-04-012` | SOKOTO | SOKOTO NORTH | GARKAR  IDI | 934 | **948** | +14 | added | 2026-11-08 |

| `04-05-17-008` | ANAMBRA | ANAOCHA | NRIJIOFOR PRY. SCHOOL II | 349 | **395** | +46 | added | 2026-11-08 |

| `12-18-03-005` | EDO | UHUNMWODE | UTENI - UTERI PRIMARY SCHOOL | 408 | **438** | +30 | added | 2026-11-08 |

| `03-27-09-003` | AKWA IBOM | UDUNG UKO | VILLAGE  SQUARE, EYOBIOSIO EDIKOR | 690 | **757** | +67 | added | 2026-11-08 |

| `37-06-08-002` | FCT | MUNICIPAL | KARSHI II/ MARKET SQUARE KARSHI | 750 | **941** | +191 | added | 2026-11-08 |

| `12-06-04-046` | EDO | ESAN WEST | EMAUDO - EMAUDO SEC SCH, EMAUDO | 507 | **1056** | +549 | added | 2026-11-08 |

| `26-22-09-014` | NIGER | SHIRORO | KUNU | 252 | **680** | +428 | added | 2026-11-08 |

| `28-10-07-009` | ONDO | ILAJE | OGBOTI II, L.A SCH OGBOTI | 543 | **553** | +10 | added | 2026-11-08 |

| `24-10-08-063` | LAGOS | IFAKO-IJAYE | ALONG ODETUNDE ST. BESIDE ADESOLA POLICE POST, RAILWAY LINE    II | 1051 | **999** | -52 | added | 2026-11-08 |

| `20-30-01-032` | KATSINA | RIMI | UNGUWAR KWARI | 91 | **206** | +115 | added | 2026-11-08 |

| `24-12-02-011` | LAGOS | IKORODU | WITHIN ITAMUJA SQUARE, IKD. | 344 | **395** | +51 | added | 2026-11-08 |

| `14-05-13-005` | ENUGU | ENUGU SOUTH | TIMBER SHED I | 1233 | **1360** | +127 | added | 2026-11-08 |

| `15-11-07-013` | GOMBE | YALMALTU/ DEBA | WAJARI PILLAM, KOFAR J. PILLAM | 457 | **505** | +48 | added | 2026-11-08 |

| `22-02-06-004` | KOGI | AJAOKUTA | OPEN SPACE  COMMUNITY BOREHOLE (INOTUTU) OGIGIRI | 750 | **885** | +135 | added | 2026-11-08 |

| `08-07-08-012` | BORNO | DAMBOA | MALAMRI | 996 | **1056** | +60 | added | 2026-11-08 |

| `22-03-01-041` | KOGI | ANKPA | BACK OF PRISON YARD O/S | 97 | **423** | +326 | added | 2026-11-08 |

| `11-09-02-005` | EBONYI | IVO | AMOBALA PLAY GROUND | 750 | **834** | +84 | added | 2026-11-08 |

| `03-05-08-010` | AKWA IBOM | ESSIEN UDIM | PRY SCH, IKOT OKO | 784 | **874** | +90 | added | 2026-11-08 |

| `18-03-01-008` | KADUNA | GIWA | DUNDUBUS II & III/ L.E.A DUNDUBUS | 310 | **316** | +6 | added | 2026-11-08 |

| `12-12-03-032` | EDO | OREDO | OPEN SPACE, AGBOLAHOR STREET, OFF AGBOMA, BY UNIBEN SMALL GATE. | 95 | **138** | +43 | added | 2026-11-08 |

| `12-02-06-020` | EDO | EGOR | OPEN SPACE, SKILL AND UNSKILL LABOURER OTOTE JUNCTION | 213 | **279** | +66 | added | 2026-11-08 |

| `24-12-17-009` | LAGOS | IKORODU | ITAMAGA TOWN BUS STOP | 630 | **876** | +246 | added | 2026-11-08 |

| `30-10-09-051` | OYO | IBADAN SOUTH WEST | OPEN SPACE OPP.DADA HOUSE, ANFANI | 113 | **124** | +11 | added | 2026-11-08 |

| `07-21-05-020` | BENUE | UKUM | LGEA SCHOOL, ALEDA/SCHOOL PREMISES | 379 | **412** | +33 | added | 2026-11-08 |

| `23-16-10-013` | KWARA | PATIGI | KANWORO L.G.E.A. PRIMARY SCHOOL | 326 | **401** | +75 | added | 2026-11-08 |

| `17-02-03-006` | JIGAWA | BABURA | GIDAN GANJI/GIDAN GANJI | 363 | **412** | +49 | added | 2026-11-08 |

| `10-20-07-020` | DELTA | UGHELLI SOUTH | OTOKUTUTOWN HALL, OTOKUTU II | 1449 | **1457** | +8 | added | 2026-11-08 |

| `20-30-01-018` | KATSINA | RIMI | MAKERA - MAKERA | 648 | **704** | +56 | added | 2026-11-08 |

| `26-23-04-017` | NIGER | SULEJA | L.G.A.WORKS DEPT. (MAIN GATE) | 618 | **607** | -11 | added | 2026-11-08 |

| `19-32-09-010` | KANO | RANO | TAFIZUL QUR'AN GIDAN DAJE | 78 | **115** | +37 | added | 2026-11-08 |

| `37-06-06-032` | FCT | MUNICIPAL | 3. JIWA PRIMARY SCHOOL III | 750 | **780** | +30 | added | 2026-11-08 |

| `13-02-06-013` | EKITI | EFON | OLUJI FARM JUNCTION - IGBOABA | 162 | **162** | 0 | added | 2026-11-08 |

| `13-14-04-010` | EKITI | ISE / ORUN | NEAR / OLELE, NEAR LUCAS' HOUSE/OLELE | 496 | **519** | +23 | added | 2026-11-08 |

| `22-08-10-006` | KOGI | IGALAMELA/ODOLU | OFODO/OKAKU/OKAINWILI, OPEN SPACE, OKAINWILI | 936 | **1177** | +241 | added | 2026-11-08 |

| `26-19-10-039` | NIGER | PAIKORO | JAZU II | 83 | **178** | +95 | added | 2026-11-08 |

| `04-07-13-002` | ANAMBRA | AWKA SOUTH | NKWO MARKET SQUARE II | 278 | **286** | +8 | added | 2026-11-08 |

| `25-03-08-008` | NASARAWA | DOMA | K/LIMAN GARI OP | 586 | **593** | +7 | added | 2026-11-08 |

| `18-21-10-005` | KADUNA | SOBA | UNG. DODO/ K.G MAIANGUWA | 588 | **646** | +58 | added | 2026-11-08 |

| `10-01-05-009` | DELTA | ANIOCHA NORTH | ENUOFU P/S - AHABA DIEI, ISSELE-MKPITIME | 337 | **393** | +56 | added | 2026-11-08 |

| `15-01-02-036` | GOMBE | AKKO | BOMALA / BAPPA SIRA, KOFAR JAURO  BOMALA | 1916 | **3120** | +1204 | added | 2026-11-08 |

| `20-21-12-023` | KATSINA | KATSINA | SABUWAR UNGUWA - MAIKUDI HOTELS I | 596 | **609** | +13 | added | 2026-11-08 |

| `07-06-09-007` | BENUE | GUMA | ISHAN - LGEA SCHOOL, ISHAN | 721 | **763** | +42 | added | 2026-11-08 |

| `19-17-08-017` | KANO | GEZAWA | YALMAR MABUGA | 958 | **982** | +24 | added | 2026-11-08 |

| `32-15-10-033` | RIVERS | OBIO/AKPOR | NDONI CENTRAL GRA PHASE II | 1233 | **1220** | -13 | added | 2026-11-08 |

| `34-08-05-004` | TARABA | KARIM-LAMIDO | ANG.DOGORO/SAU-SAU | 708 | **710** | +2 | added | 2026-11-08 |

| `35-08-05-005` | YOBE | GULANI | MANN M. YAKUDI OPEN SPACE | 252 | **299** | +47 | added | 2026-11-08 |

| `22-02-14-005` | KOGI | AJAOKUTA | LGEA SCH. II(B) GEREGU | 750 | **752** | +2 | added | 2026-11-08 |

| `32-22-04-042` | RIVERS | PORT HARCOURT | FAITH BAPTIST COLLEGE II | 82 | **149** | +67 | added | 2026-11-08 |

| `35-14-10-014` | YOBE | POTISKUM | ARMY BARRACKS PRIMARY SCHOOL IV | 633 | **647** | +14 | added | 2026-11-08 |

| `14-10-02-004` | ENUGU | ISI UZO | UMUATA | 369 | **379** | +10 | added | 2026-11-08 |

| `04-11-11-008` | ANAMBRA | IDEMILI-SOUTH | OKPUNO UMUOGALI HALL II | 699 | **736** | +37 | added | 2026-11-08 |

| `26-14-03-019` | NIGER | MAGAMA | AGABA | 89 | **90** | +1 | added | 2026-11-08 |

| `07-02-08-008` | BENUE | AGATU | BANZU OPEN SPACE | 397 | **762** | +365 | added | 2026-11-08 |

| `04-18-03-005` | ANAMBRA | ONITSHA -SOUTH | OPEN SPACE  BESIDE TRANSFORMER, NO. 9, AKPO / URUNEBO STREET. | 114 | **230** | +116 | added | 2026-11-08 |

| `16-03-09-009` | IMO | EHIME MBANO | UKWUOBU UMUEZEALA OGWARA C/S | 501 | **516** | +15 | added | 2026-11-08 |

| `04-10-01-004` | ANAMBRA | IDEMILI NORTH | UMUDISI HALL I | 537 | **615** | +78 | added | 2026-11-08 |

| `23-05-10-012` | KWARA | IFELODUN | POLICE BARACK OPEN SPACE | 286 | **385** | +99 | added | 2026-11-08 |

| `19-08-09-011` | KANO | DANBATA | TAKAI, PRIMARY SCHOOL | 810 | **807** | -3 | added | 2026-11-08 |

| `26-06-11-035` | NIGER | CHANCHAGA | BESIDE PEACHES BAKERY | 126 | **168** | +42 | added | 2026-11-08 |

| `04-18-10-047` | ANAMBRA | ONITSHA -SOUTH | INFANT JESUS SECONDARY SCHOOL   III | 78 | **117** | +39 | added | 2026-11-08 |

| `18-08-10-007` | KADUNA | KACHIA | KWANTARO I/ KOFAR G/ALH. MAGAJI | 760 | **844** | +84 | added | 2026-11-08 |

| `24-15-02-006` | LAGOS | LAGOS MAINLAND | ST. PAULS CATH. PRY. SCH. I | 672 | **665** | -7 | added | 2026-11-08 |

| `31-06-01-050` | PLATEAU | JOS SOUTH | STEEL ROLLING MILL II | 95 | **98** | +3 | added | 2026-11-08 |

| `20-34-07-007` | KATSINA | ZANGO | TOKA BURA KOFAR MAIGARI | 461 | **613** | +152 | added | 2026-11-08 |

| `09-11-05-014` | CROSS RIVER | IKOM | TOWN HALL MGBAKA | 498 | **622** | +124 | added | 2026-11-08 |

| `04-01-15-006` | ANAMBRA | AGUATA | CENTRAL SCHOOL  II | 291 | **354** | +63 | added | 2026-11-08 |

| `11-05-02-011` | EBONYI | EZZA NORTH | UMUOBI EKKA HALL | 483 | **534** | +51 | added | 2026-11-08 |

| `17-26-10-013` | JIGAWA | TAURA | NURADDEEN ISLAMIYYA TAURA II | 119 | **244** | +125 | added | 2026-11-08 |

| `30-05-11-042` | OYO | EGBEDA | OPEN SPACE KATE JUNCTION, ILE-IWO | 88 | **158** | +70 | added | 2026-11-08 |

| `07-05-06-018` | BENUE | GBOKO | MBAANKU - NR SHIRGA COMP. | 442 | **444** | +2 | added | 2026-11-08 |

| `33-11-03-009` | SOKOTO | KEBBE | SH. SHANTALI TSOHUWAR ASIBITI | 413 | **896** | +483 | added | 2026-11-08 |

| `16-13-08-014` | IMO | NJABA | EZIKENUHIE VILL. SQ., UBA | 172 | **231** | +59 | added | 2026-11-08 |

| `24-10-09-072` | LAGOS | IFAKO-IJAYE | JUNCTION OF ADENIYI STREET/ABEOKUTA EXPRESS WAY. | 35 | **75** | +40 | added | 2026-11-08 |

| `01-07-04-008` | ABIA | ISIALA NGWA SOUTH | UMUEZEOCHE VILLAGE HALL | 507 | **551** | +44 | added | 2026-11-08 |

| `07-01-06-002` | BENUE | ADO | IPOLE I, PLAY GROUND | 817 | **833** | +16 | added | 2026-11-08 |

| `19-17-05-004` | KANO | GEZAWA | JAMAAR KWAGWAR II | 927 | **952** | +25 | added | 2026-11-08 |

| `28-11-03-003` | ONDO | ILEOLUJI/OKEIGBO | ODOLU, ODOLU YOUTH FOUNDATION | 843 | **843** | 0 | added | 2026-11-08 |

| `28-16-06-019` | ONDO | ONDO WEST | COMM PRY SCHOOL LAOSHO | 652 | **722** | +70 | added | 2026-11-08 |

| `29-25-14-008` | OSUN | ODO-OTIN | IN FRONT OF EESA'S PALACE SQUARE, OYAN | 305 | **406** | +101 | added | 2026-11-08 |

| `19-14-02-006` | KANO | GARKO | CEDIYA III | 616 | **666** | +50 | added | 2026-11-08 |

| `29-18-04-004` | OSUN | ILESA EAST | MECHANIC WORKS OPP. METHODIST MISSION | 428 | **527** | +99 | added | 2026-11-08 |

| `19-01-02-012` | KANO | AJINGI | TSE BURAWA GABAS/YAMMA WARD HOUSE | 654 | **777** | +123 | added | 2026-11-08 |

| `30-14-07-017` | OYO | IDO | OPEN SPACE ILETUNTUN | 170 | **253** | +83 | added | 2026-11-08 |

| `08-02-12-015` | BORNO | ASKIRA / UBA | KOFAR BADAUM | 586 | **671** | +85 | added | 2026-11-08 |

| `05-05-11-013` | BAUCHI | DARAZO | DUGO,  KOFAR SARKI | 361 | **362** | +1 | added | 2026-11-08 |

| `03-26-10-015` | AKWA IBOM | ORUK ANAM | COMMUNITY SECONDARY COMMERCIAL SCHOOL, IKOT INUEN | 235 | **285** | +50 | added | 2026-11-08 |

| `05-15-05-002` | BAUCHI | NINGI | D. BAUNA /L/I,  KOFAR IDAU | 340 | **340** | 0 | added | 2026-11-08 |

| `19-43-11-011` | KANO | WARAWA | YANSHUNI (YANSHUNI PRIMARY SCHOOL) | 84 | **108** | +24 | added | 2026-11-08 |

| `20-11-09-003` | KATSINA | DUTSI | DUBAWA GAMJI GARIN GAMJI | 596 | **653** | +57 | added | 2026-11-08 |

| `20-24-10-004` | KATSINA | MAI'ADUA | GAGIR FULANI - K/GIDAN MAIUNGUWA | 367 | **367** | 0 | added | 2026-11-08 |

| `01-06-05-018` | ABIA | ISIALA NGWA NORTH | AHIAEKE-UMUCHIMA MARKET SQUARE | 123 | **162** | +39 | added | 2026-11-08 |

| `12-14-10-009` | EDO | OVIA NORTH EAST | IGO, IGO PRIMARY SCHOOL | 750 | **812** | +62 | added | 2026-11-08 |

| `21-01-03-006` | KEBBI | ALIERO | OPEN SPACE OPPOSITE POLICE STATION TUDUN WADA (TUDUN WADA) | 1987 | **1907** | -80 | added | 2026-11-08 |

| `27-03-07-023` | OGUN | ADO ODO-OTA | SALVATION ARMY PRY SCHOOL, IJABA OTA | 289 | **394** | +105 | added | 2026-11-08 |

| `16-03-04-003` | IMO | EHIME MBANO | CIVIC HALL U'NUOHA | 548 | **811** | +263 | added | 2026-11-08 |

| `10-22-01-020` | DELTA | UVWIE | IZOBO LAYOUT OFF OVIE PALACE ROAD | 1377 | **1368** | -9 | added | 2026-11-08 |

| `31-14-03-011` | PLATEAU | QUA'AN PAN | KOPPA'AR II | 94 | **126** | +32 | added | 2026-11-08 |

| `15-07-06-012` | GOMBE | KALTUNGO | BILATUKU, FILANTIMEH | 435 | **457** | +22 | added | 2026-11-08 |

| `19-08-09-017` | KANO | DANBATA | SAIDAWA III | 92 | **363** | +271 | added | 2026-11-08 |

| `27-03-08-027` | OGUN | ADO ODO-OTA | OPEN SPACE ORI OKUTA, NEAR VIGILANTE OFFICE ILOGBO | 277 | **321** | +44 | added | 2026-11-08 |

| `01-09-04-027` | ABIA | OBINGWA | AKPUGA - AKPUGA CIVIC CENTRE | 356 | **376** | +20 | added | 2026-11-08 |

| `32-06-13-010` | RIVERS | ASARI-TORU | MISSION POLO, ANGULAMA | 211 | **216** | +5 | added | 2026-11-08 |

| `27-17-12-003` | OGUN | ODOGBOLU | FRONTAGE MATERNITY, ILOFA/IWAYE IGBILE | 471 | **528** | +57 | added | 2026-11-08 |

| `32-03-10-003` | RIVERS | AHOADA WEST | ODHIOGULU HALL | 854 | **861** | +7 | added | 2026-11-08 |

| `37-06-01-079` | FCT | MUNICIPAL | 3.INFORNT OF KAGORO CLOSE AREA 2,SEC. 2 | 2 | **4** | +2 | added | 2026-11-08 |

| `19-24-05-011` | KANO | KIRU | G S S DANGORA III | 54 | **180** | +126 | added | 2026-11-08 |

| `16-08-05-001` | IMO | IKEDURU | AMAUKWA VILLAGE HALL | 278 | **277** | -1 | added | 2026-11-08 |

| `19-09-03-012` | KANO | DAWAKI KUDU | GASS III | 818 | **827** | +9 | added | 2026-11-08 |

| `03-01-02-004` | AKWA IBOM | ABAK | VILLAGE HALL, IKOT AFAHA | 703 | **740** | +37 | added | 2026-11-08 |

| `20-09-01-017` | KATSINA | DAN MUSA | GINDIN CEDIYA | 67 | **307** | +240 | added | 2026-11-08 |

| `02-09-10-017` | ADAMAWA | LAMURDE | GDSS WADUKU | 167 | **168** | +1 | added | 2026-11-08 |

| `08-21-05-017` | BORNO | MAIDUGURI M. C. | BULAMA KYARI BUKAR  I | 432 | **437** | +5 | added | 2026-11-08 |

| `16-09-08-007` | IMO | ISIALA MBANO | COMM. SCH. UMUNEKE | 753 | **759** | +6 | added | 2026-11-08 |

| `01-12-07-024` | ABIA | UGWUNAGBO | ASANNENTU MOTOR PARTS MARKET X | 22 | **112** | +90 | added | 2026-11-08 |

| `30-06-12-006` | OYO | IBADAN NORTH | OPPOSITE AJEGUNLE BAPTIST CHURCH | 394 | **444** | +50 | added | 2026-11-08 |

| `26-02-08-009` | NIGER | AGWARA | MARARABAN DEMO  BOREHOLE | 81 | **189** | +108 | added | 2026-11-08 |

| `10-21-10-008` | DELTA | UKWUANI | OBIARUKU  II   ESUME  UKU  PRIMARY  SCHOOL II | 750 | **735** | -15 | added | 2026-11-08 |

| `04-20-02-006` | ANAMBRA | ORUMBA  SOUTH | PRY. SCHOOL, AKPU | 212 | **324** | +112 | added | 2026-11-08 |

| `24-08-09-035` | LAGOS | ETI-OSA | JUNCTION OF BAYO KUKU STR. | 34 | **72** | +38 | added | 2026-11-08 |

| `18-08-08-023` | KADUNA | KACHIA | BADOKO/HEALTH CARE | 72 | **73** | +1 | added | 2026-11-08 |

| `14-13-11-015` | ENUGU | NSUKKA | UNION PRI. SCH. IBAGWA ANI | 68 | **121** | +53 | added | 2026-11-08 |

| `10-10-02-007` | DELTA | ISOKO SOUTH | URUERO HALL, UKOLOBI QUARTERS I | 687 | **674** | -13 | added | 2026-11-08 |

| `24-08-08-008` | LAGOS | ETI-OSA | WARDERS' BARRACK II | 801 | **846** | +45 | added | 2026-11-08 |

| `13-01-11-004` | EKITI | ADO EKITI | AT BAPTIST SCH./  AKINYEDE'S COMP. | 996 | **979** | -17 | added | 2026-11-08 |

| `01-07-09-012` | ABIA | ISIALA NGWA SOUTH | UMURASI - COMMUNITY CIVIC HALL | 79 | **112** | +33 | added | 2026-11-08 |

| `22-08-03-005` | KOGI | IGALAMELA/ODOLU | OPEN SPACE, MARKET SQUARE, ODOLU | 927 | **952** | +25 | added | 2026-11-08 |

| `17-14-11-001` | JIGAWA | JAHUN | KANWA GIDAN MADAKI | 384 | **390** | +6 | added | 2026-11-08 |

| `12-10-02-003` | EDO | IGUEBEN | IGUEBEN-IDIGUN, EGUARE P/S III | 750 | **681** | -69 | added | 2026-11-08 |

| `01-01-01-048` | ABIA | ABA NORTH | EZIAMA HIGH SCH. IX | 265 | **273** | +8 | added | 2026-11-08 |

| `31-15-08-013` | PLATEAU | RIYOM | LEA PRY SCHOOL DUM | 205 | **207** | +2 | added | 2026-11-08 |

| `15-06-01-010` | GOMBE | GOMBE | KOFAR AJIYA OPEN SPACE II | 127 | **171** | +44 | added | 2026-11-08 |

| `08-21-02-013` | BORNO | MAIDUGURI M. C. | ZAJIRI PRI. SCH.  II | 578 | **588** | +10 | added | 2026-11-08 |

| `02-12-05-002` | ADAMAWA | MAYO - BELWA | NOKING/ KOFAR JAURO NOKING | 586 | **686** | +100 | added | 2026-11-08 |

| `05-16-03-011` | BAUCHI | SHIRA | BALIJAM GABAS,   KOFAR SARKI | 381 | **382** | +1 | added | 2026-11-08 |

| `19-18-03-051` | KANO | GWALE | KADAWA OPEN SPACE | 38 | **147** | +109 | added | 2026-11-08 |

| `16-04-09-004` | IMO | EZINIHITTE MBAISE | COMM. SCH. OBOKWU | 750 | **776** | +26 | added | 2026-11-08 |

| `14-13-01-024` | ENUGU | NSUKKA | UPATA VILLAGE HALL | 222 | **221** | -1 | added | 2026-11-08 |

| `12-02-09-017` | EDO | EGOR | OKHORO POLICE POST, OKHORO II-II | 750 | **821** | +71 | added | 2026-11-08 |

| `19-28-08-007` | KANO | MADOBI | FULATAN-KAGUWA II | 741 | **805** | +64 | added | 2026-11-08 |

| `01-09-05-008` | ABIA | OBINGWA | UMUNWANKWO - UMUNWANKWO  VILLAGE HALL | 510 | **514** | +4 | added | 2026-11-08 |

| `05-12-04-013` | BAUCHI | KATAGUM | LARISKI  K/FADA,   KOFAR FADA | 655 | **702** | +47 | added | 2026-11-08 |

| `03-31-01-024` | AKWA IBOM | UYO | OPEN SPACE NO. 15 UDOEKPO INYANG STR. BY UDOTUNG UBO JUNCTION | 144 | **176** | +32 | added | 2026-11-08 |

| `24-10-06-030` | LAGOS | IFAKO-IJAYE | ENTRANCE OF OGO OLUWA STR, AJUWON | 49 | **129** | +80 | added | 2026-11-08 |

| `18-05-08-019` | KADUNA | IKARA | UNG. SARKI RUMI III/ PRIMARY SCHOOL | 608 | **683** | +75 | added | 2026-11-08 |

| `29-07-07-013` | OSUN | EDE NORTH | OPEN SPACE BESIDE PRY HEALTH CENTRE | 111 | **197** | +86 | added | 2026-11-08 |

| `33-08-01-015` | SOKOTO | ILLELA | TUDUN GUDALE MAIRUWA I | 380 | **497** | +117 | added | 2026-11-08 |

| `24-10-08-008` | LAGOS | IFAKO-IJAYE | 15, OLADITOUN ST. NEW OKO-OBA | 805 | **766** | -39 | added | 2026-11-08 |

| `08-13-11-021` | BORNO | JERE | UMTH SECURITY HALL II | 911 | **944** | +33 | added | 2026-11-08 |

| `25-06-07-002` | NASARAWA | KEFFI | ECWA PRIMARY SCHOOL | 750 | **724** | -26 | added | 2026-11-08 |

| `25-04-11-093` | NASARAWA | KARU | APJ FOOTBALL FIELD TUDUNWADA MASAKA-OP | 750 | **908** | +158 | added | 2026-11-08 |

| `27-03-15-020` | OGUN | ADO ODO-OTA | LGA SCHOOL IGERE/ IHUNSA AGBARA | 559 | **696** | +137 | added | 2026-11-08 |

| `04-15-03-010` | ANAMBRA | NNEWI SOUTH | UNITY PRY. SCHOOL, OKPOKOLO VI | 530 | **695** | +165 | added | 2026-11-08 |

| `01-10-05-024` | ABIA | OHAFIA | OBU NDI OKEKE AMAJA | 111 | **131** | +20 | added | 2026-11-08 |

| `01-06-07-005` | ABIA | ISIALA NGWA NORTH | OKPUALA / UMUNACHI / MBARAUGBA - VILLAGE OKPUALA | 1008 | **1023** | +15 | added | 2026-11-08 |

| `19-37-05-017` | KANO | TAKAI | MAZARI | 631 | **644** | +13 | added | 2026-11-08 |

| `16-27-09-013` | IMO | OWERRI WEST | COMM. SCHOOL AMAKOHIAUBI III | 733 | **745** | +12 | added | 2026-11-08 |

| `18-02-11-039` | KADUNA | CHIKUN | SUNDAY MAIUNGUWA ROAD GBAGYI VILLA | 288 | **376** | +88 | added | 2026-11-08 |

| `17-12-09-015` | JIGAWA | GWIWA | SHAFE PRI. SCH. II | 88 | **158** | +70 | added | 2026-11-08 |

| `18-04-05-017` | KADUNA | IGABI | UNG. BAYI R/TSIWA | 447 | **460** | +13 | added | 2026-11-08 |

| `20-11-09-007` | KATSINA | DUTSI | KALGORE KWAKWARA | 423 | **427** | +4 | added | 2026-11-08 |

| `14-02-03-017` | ENUGU | AWGU | CENT. SCH. IMAMA II | 469 | **484** | +15 | added | 2026-11-08 |

| `30-16-07-011` | OYO | ISEYIN | OJU BABA | 1832 | **1844** | +12 | added | 2026-11-08 |

| `22-16-09-004` | KOGI | OKEHI | BESIDE UPACHE'S COMPOUND | 241 | **308** | +67 | added | 2026-11-08 |

| `11-03-11-010` | EBONYI | AFIKPO  SOUTH | OWUTU MOTOR PARK II | 613 | **657** | +44 | added | 2026-11-08 |

| `32-22-07-054` | RIVERS | PORT HARCOURT | IBADAN STREET PRIMARY SCHOOL VII | 400 | **401** | +1 | added | 2026-11-08 |

| `33-22-07-005` | SOKOTO | WURNO | SHIYAR DOKA | 503 | **562** | +59 | added | 2026-11-08 |

| `34-08-07-005` | TARABA | KARIM-LAMIDO | UNG. BITRUS, UNG. BITRUS | 785 | **935** | +150 | added | 2026-11-08 |

| `27-06-04-037` | OGUN | EWEKORO | OPN SPACE LUFODO PLAYING GROUND ITORI | 144 | **293** | +149 | added | 2026-11-08 |

| `26-05-09-008` | NIGER | BOSSO | PASSI | 681 | **858** | +177 | added | 2026-11-08 |

| `01-07-07-006` | ABIA | ISIALA NGWA SOUTH | OMOBA - CENTRAL SCHOOL | 1315 | **1306** | -9 | added | 2026-11-08 |

| `05-15-08-020` | BAUCHI | NINGI | TIPCHI,  TIPCHI PRIMARY SCHOOL | 592 | **670** | +78 | added | 2026-11-08 |

| `24-08-10-016` | LAGOS | ETI-OSA | DODAN BARRACKS IV | 746 | **967** | +221 | added | 2026-11-08 |

| `19-09-01-014` | KANO | DAWAKI KUDU | MARMARA I | 842 | **844** | +2 | added | 2026-11-08 |

| `24-12-05-001` | LAGOS | IKORODU | L.G. PRY. SCHOOL IPAKODO | 795 | **969** | +174 | added | 2026-11-08 |

| `04-18-15-009` | ANAMBRA | ONITSHA -SOUTH | UMUOJI/ULI STREET II | 490 | **538** | +48 | added | 2026-11-08 |

| `02-13-03-009` | ADAMAWA | MICHIKA | WHAZAMA / CENTRAL PRI. SCH. GARTA | 730 | **855** | +125 | added | 2026-11-08 |

| `15-10-10-009` | GOMBE | SHONGOM | LASSASAP, KOFAR J./ PETER | 465 | **513** | +48 | added | 2026-11-08 |

| `29-12-01-004` | OSUN | IFEDAYO | ASAOYE VILLAGE | 250 | **363** | +113 | added | 2026-11-08 |

| `24-03-04-274` | LAGOS | ALIMOSHO | IN FRONT OF 50, AKINREMI STREET, IJEGUN | 233 | **338** | +105 | added | 2026-11-08 |

| `20-32-09-001` | KATSINA | SAFANA | BAURE/PRI.SCHOOL | 699 | **698** | -1 | added | 2026-11-08 |

| `18-10-11-021` | KADUNA | KADUNA SOUTH | AF 37 FAKI ROAD | 927 | **930** | +3 | added | 2026-11-08 |

| `16-24-05-002` | IMO | ORU WEST | AMAOFUO POST OFFICE | 295 | **506** | +211 | added | 2026-11-08 |

| `03-29-10-015` | AKWA IBOM | URUAN | VILLAGE HALL, IBIAKU OBIO NDOBO | 393 | **439** | +46 | added | 2026-11-08 |

| `23-16-07-006` | KWARA | PATIGI | TANKPAFU COMMINUTY SECONDARY SCHOOL | 573 | **727** | +154 | added | 2026-11-08 |

| `26-13-11-011` | NIGER | LAVUN | SABO MEDINA PRIMARY SCHOOL | 124 | **126** | +2 | added | 2026-11-08 |

| `16-05-10-008` | IMO | IDEATO NORTH | OSINA TOWN HALL | 960 | **995** | +35 | added | 2026-11-08 |

| `35-13-10-003` | YOBE | NGURU | KOFAR LAWAN NGOMA, NGLAIWA PRI. SCH. | 2736 | **2993** | +257 | added | 2026-11-08 |

| `04-07-19-007` | ANAMBRA | AWKA SOUTH | EZI EBE UMODU | 1431 | **1409** | -22 | added | 2026-11-08 |

| `04-14-06-032` | ANAMBRA | NNEWI NORTH | INYABA COMMUNITY SCHOOL | 19 | **25** | +6 | added | 2026-11-08 |

| `16-11-02-008` | IMO | MBAITOLI | AMA UKWU UMUEZE VILL. SQ. | 696 | **703** | +7 | added | 2026-11-08 |

| `20-21-12-026` | KATSINA | KATSINA | SABON GARI WTC - S/GARI POLICE STATION | 1668 | **1761** | +93 | added | 2026-11-08 |

| `14-02-03-004` | ENUGU | AWGU | CENTRAL. SCHOOL IMAMA I | 1092 | **1138** | +46 | added | 2026-11-08 |

| `19-12-10-009` | KANO | FAGGE | KOFAR MAI UNGUWA II | 767 | **768** | +1 | added | 2026-11-08 |

| `27-04-04-003` | OGUN | EGBADO NORTH | ITA OJA, SAALA ORILE | 726 | **773** | +47 | added | 2026-11-08 |

| `06-02-06-006` | BAYELSA | EKEREMOR | ST. JULU ZION QTRS | 985 | **999** | +14 | added | 2026-11-08 |

| `24-04-04-041` | LAGOS | AMUWO-ODOFIN | MEMORIAL JNR HIGH SCHOOL | 183 | **195** | +12 | added | 2026-11-08 |

| `16-12-01-014` | IMO | NGOR OKPALA | UMUEWO VILLAGE HALL AMALA | 712 | **719** | +7 | added | 2026-11-08 |

| `12-03-06-003` | EDO | ESAN CENTRAL | USUGBENU PRY. SCHOOL/USUGBENU III | 753 | **1150** | +397 | added | 2026-11-08 |

| `12-11-01-001` | EDO | IKPOBA/OKHA | IKPOBA - ARMY CHILDREN SCHOOL I | 750 | **851** | +101 | added | 2026-11-08 |

| `14-17-11-004` | ENUGU | UZO-UWANI | ONU OFU OWERE | 417 | **452** | +35 | added | 2026-11-08 |

| `12-12-04-023` | EDO | OREDO | OKEMOLE I , EMOKPAE PRIMARY SCHOOL V | 713 | **697** | -16 | added | 2026-11-08 |

| `27-06-04-003` | OGUN | EWEKORO | IYANA STATION  I | 809 | **767** | -42 | added | 2026-11-08 |

| `21-18-02-017` | KEBBI | SURU | FILIN SAMINAKA SAKA | 218 | **230** | +12 | added | 2026-11-08 |

| `21-13-07-019` | KEBBI | KOKO/BESSE | UNGUWAR HAUSAWA MAKARANTA B | 535 | **628** | +93 | added | 2026-11-08 |

| `35-08-03-001` | YOBE | GULANI | BULARAFA LAWANTI , PRI. SCH. | 750 | **769** | +19 | added | 2026-11-08 |

| `24-06-09-007` | LAGOS | BADAGRY | OPP. TOWN HALL, IKOGA-ZEBE | 936 | **990** | +54 | added | 2026-11-08 |

| `08-17-02-018` | BORNO | KUKAWA | LAYIN KANTI | 139 | **250** | +111 | added | 2026-11-08 |

| `24-01-07-026` | LAGOS | AGEGE | 39, LAGOS STREET | 811 | **788** | -23 | added | 2026-11-08 |

| `24-05-04-008` | LAGOS | APAPA | IBIKUNLE/AKINTOYE/ADELE/CAMEROUN | 750 | **731** | -19 | added | 2026-11-08 |

| `18-11-03-006` | KADUNA | KAGARKO | CHAKULA/ K. GIDAN MAIUNGUWA | 688 | **730** | +42 | added | 2026-11-08 |

| `30-08-10-023` | OYO | IBADAN NORTH WEST | OPEN SPACE ALONG TCTC JUNCTION | 300 | **315** | +15 | added | 2026-11-08 |

| `15-10-08-003` | GOMBE | SHONGOM | GOMLE, KOFAR J/ BULUS | 735 | **807** | +72 | added | 2026-11-08 |

| `04-19-16-003` | ANAMBRA | ORUMBA NORTH | EZIOGWE SQUARE | 433 | **514** | +81 | added | 2026-11-08 |

| `21-06-05-013` | KEBBI | BIRNIN KEBBI | TARASA DISPENSARY TARASA | 233 | **374** | +141 | added | 2026-11-08 |

| `18-17-08-009` | KADUNA | LERE | KAFIN LAZURU/ K/MAIUNGUWA | 516 | **675** | +159 | added | 2026-11-08 |

| `10-22-03-010` | DELTA | UVWIE | BESIDE  WHASSAN HOTEL | 1021 | **1000** | -21 | added | 2026-11-08 |

| `26-12-08-009` | NIGER | LAPAI | LAPAI DISPENSARY | 335 | **364** | +29 | added | 2026-11-08 |

| `18-16-06-021` | KADUNA | KUDAN | PHC DOKA / PHC DOKA | 364 | **466** | +102 | added | 2026-11-08 |

| `11-09-09-008` | EBONYI | IVO | AGBA UKWU PLAY GROUND | 231 | **246** | +15 | added | 2026-11-08 |

| `20-17-05-011` | KATSINA | KAFUR | TAFKIN JANGE GIDAN KADO | 692 | **690** | -2 | added | 2026-11-08 |

| `22-06-02-017` | KOGI | IBAJI | IKAH II ODOBOLA OPEN SPACE | 89 | **701** | +612 | added | 2026-11-08 |

| `01-09-03-016` | ABIA | OBINGWA | UMUGWEZE / UMUOKPANI - NENU C.P.S CAMPUS  I | 623 | **644** | +21 | added | 2026-11-08 |

| `07-18-02-003` | BENUE | OKPOKWU | OGBULO/IPOLE PLAY GROUND - OGBULO | 337 | **395** | +58 | added | 2026-11-08 |

| `21-10-03-001` | KEBBI | GWANDU | DODORU | 750 | **819** | +69 | added | 2026-11-08 |

| `36-12-02-003` | ZAMFARA | TALATA MAFARA | MALLAWAMA / PRIMARY SCHOOL | 682 | **683** | +1 | added | 2026-11-08 |

| `31-05-13-134` | PLATEAU | JOS NORTH | MADO TOURISM GATE III | 597 | **614** | +17 | added | 2026-11-08 |

| `28-04-03-012` | ONDO | AKOKO SOUTH WEST | SIMERIN II, SIMERIN MKT SQUARE | 315 | **370** | +55 | added | 2026-11-08 |

| `27-01-03-008` | OGUN | ABEOKUTA NORTH | ITA BALOGUN MOSQUE  I | 616 | **635** | +19 | added | 2026-11-08 |

| `06-04-11-002` | BAYELSA | NEMBE | OBEMEKE VILLAGE SQUARE | 614 | **612** | -2 | added | 2026-11-08 |

| `24-11-03-022` | LAGOS | IKEJA | JUNCTION OF ALH. MULI/AYINDE ST. | 499 | **537** | +38 | added | 2026-11-08 |

| `21-15-05-012` | KEBBI | NGASKI | FOOTBALL FIELD, OPP. YUSUF MOHD UMAR (NOA) RESIDENCE LIBATA (OPEN SPACE) | 718 | **755** | +37 | added | 2026-11-08 |

| `18-17-11-032` | KADUNA | LERE | BUNDU  /  BABAN  LUWA | 97 | **99** | +2 | added | 2026-11-08 |

| `22-17-11-007` | KOGI | OKENE | LGEA PRIMARY SCHOOL - ODENKU II | 558 | **826** | +268 | added | 2026-11-08 |

| `27-01-12-006` | OGUN | ABEOKUTA NORTH | E.A.C. ITA OSHIN  I | 822 | **877** | +55 | added | 2026-11-08 |

| `08-18-05-004` | BORNO | KWAYA / KUSAR | TASHAN GAMBO | 496 | **506** | +10 | added | 2026-11-08 |

| `10-20-02-004` | DELTA | UGHELLI SOUTH | IKISE HALL, GBAREGOLOR | 814 | **1066** | +252 | added | 2026-11-08 |

| `33-21-01-025` | SOKOTO | WAMAKKO | CLAPPERTON ROAD | 750 | **857** | +107 | added | 2026-11-08 |

| `30-06-08-053` | OYO | IBADAN NORTH | BESIDE MCHAY DIAGNOSTIC CENTRE,AGBAJE ROAD | 270 | **360** | +90 | added | 2026-11-08 |

| `18-04-12-145` | KADUNA | IGABI | POLY FARM | 750 | **779** | +29 | added | 2026-11-08 |

| `24-01-08-040` | LAGOS | AGEGE | 1, BADEJO STREET II | 483 | **460** | -23 | added | 2026-11-08 |

| `32-02-04-010` | RIVERS | AHOADA EAST | U.P.E. SCHOOL | 1103 | **1105** | +2 | added | 2026-11-08 |

| `20-15-11-004` | KATSINA | INGAWA | WAILAWA TAUGUDDE KUSA DA FAMFO | 485 | **533** | +48 | added | 2026-11-08 |

| `34-11-06-001` | TARABA | SARDAUNA | BARIKI, DEV. AREA OFFICE | 847 | **849** | +2 | added | 2026-11-08 |

| `24-05-08-017` | LAGOS | APAPA | GASKIYA ROAD II | 811 | **771** | -40 | added | 2026-11-08 |

| `15-06-07-024` | GOMBE | GOMBE | IMMIGRATION QUARTERS, IMMIGRATION  QUARTERS | 1098 | **1086** | -12 | added | 2026-11-08 |

| `12-18-03-001` | EDO | UHUNMWODE | IGIEDUMA - ODOGBO PRIMARY SCHOOL | 750 | **843** | +93 | added | 2026-11-08 |

| `33-03-03-003` | SOKOTO | DANGE/SHUNI | RUNJIN DUBI | 487 | **540** | +53 | added | 2026-11-08 |

| `20-32-06-017` | KATSINA | SAFANA | MAIKADA DISPENSARY | 28 | **28** | 0 | added | 2026-11-08 |

| `18-11-10-004` | KADUNA | KAGARKO | KUBERE/ K/M UNGUWA | 620 | **629** | +9 | added | 2026-11-08 |

| `18-02-12-031` | KADUNA | CHIKUN | DALLATU BY MAIJAMAA | 68 | **134** | +66 | added | 2026-11-08 |

| `16-07-01-001` | IMO | IHITTE UBOMA | UMUEZEALA TOWN HALL I | 599 | **609** | +10 | added | 2026-11-08 |

| `32-22-19-028` | RIVERS | PORT HARCOURT | ILO HALL II | 925 | **903** | -22 | added | 2026-11-08 |

| `19-26-09-011` | KANO | KUNCHI | JIGAWA/BULBULA | 455 | **452** | -3 | added | 2026-11-08 |

| `27-13-04-014` | OGUN | IMEKO/AFON | OPEN SPACE AT ANOINNOIN | 64 | **59** | -5 | added | 2026-11-08 |

| `24-08-08-042` | LAGOS | ETI-OSA | INFRONT OF DSS QUARTERS, ALAGBON | 120 | **205** | +85 | added | 2026-11-08 |

| `07-15-11-008` | BENUE | OGBADIBO | ADE IGWU - ADE IGWU PLAY GROUND | 698 | **906** | +208 | added | 2026-11-08 |

| `10-17-11-004` | DELTA | SAPELE | O/S OKUODEDE  I AND II | 444 | **493** | +49 | added | 2026-11-08 |

| `19-37-04-016` | KANO | TAKAI | FALALI PRIMARY SCHOOL IIB | 82 | **103** | +21 | added | 2026-11-08 |

| `03-03-11-006` | AKWA IBOM | EKET | VILLAGE SQUARE IKOT AKPAIKPO | 425 | **461** | +36 | added | 2026-11-08 |

| `24-20-12-049` | LAGOS | SURULERE | ALEJE ST. BY HOUSE NO. 7 | 599 | **595** | -4 | added | 2026-11-08 |

| `05-12-07-022` | BAUCHI | KATAGUM | JABBAL,   KOFAR JAURO | 320 | **337** | +17 | added | 2026-11-08 |

| `04-07-02-010` | ANAMBRA | AWKA SOUTH | COMMUNITY PRIMARY SCHOOL III | 264 | **520** | +256 | added | 2026-11-08 |

| `26-06-08-022` | NIGER | CHANCHAGA | WAKILIN MAI ANGUWAN YAMMA | 530 | **554** | +24 | added | 2026-11-08 |

| `18-05-08-012` | KADUNA | IKARA | UNG. BALA/ PRIMARY SCHOOL | 753 | **753** | 0 | added | 2026-11-08 |

| `32-06-05-008` | RIVERS | ASARI-TORU | JOHNBULL COMPOUND, WELL/OKPARA II | 321 | **291** | -30 | added | 2026-11-08 |

| `13-10-05-003` | EKITI | IKERE | ISAOYE HALL / SALOTUN  / SAYA | 816 | **805** | -11 | added | 2026-11-08 |

| `19-38-01-019` | KANO | TARAUNI | HAUSAWA PRIMARY SCHOOL III | 1272 | **1300** | +28 | added | 2026-11-08 |

| `24-03-05-026` | LAGOS | ALIMOSHO | FRONT OF 65, ISOLO ROAD EGBE I | 750 | **711** | -39 | added | 2026-11-08 |

| `05-09-09-004` | BAUCHI | GIADE | AUYAKARI,   GIDAN WAKILI - II | 310 | **316** | +6 | added | 2026-11-08 |

| `24-06-08-049` | LAGOS | BADAGRY | OPEN SPACE AT BAALE'S WAY, IBIYE | 277 | **441** | +164 | added | 2026-11-08 |

| `30-27-07-002` | OYO | OORELOPE | OLUWO AKANBI COMPOUND | 685 | **767** | +82 | added | 2026-11-08 |

| `18-19-08-031` | KADUNA | SABON GARI | YAN KARFE BUS STOP/YAN KARFE STREET/INCO HOUSE | 750 | **776** | +26 | added | 2026-11-08 |

| `18-15-03-012` | KADUNA | KUBAU | UNG. NUHU I/ K/G UNGUWA | 837 | **858** | +21 | added | 2026-11-08 |

| `20-30-02-012` | KATSINA | RIMI | KADIYAWA - KADIYAWA | 402 | **444** | +42 | added | 2026-11-08 |

| `07-22-04-002` | BENUE | USHONGO | ATOGA MARKET SQUARE | 834 | **943** | +109 | added | 2026-11-08 |

| `15-11-03-006` | GOMBE | YALMALTU/ DEBA | GARIN KOSHI, KOFAR SARKI | 711 | **809** | +98 | added | 2026-11-08 |

| `37-06-02-128` | FCT | MUNICIPAL | APO TOWN HALL | 314 | **504** | +190 | added | 2026-11-08 |

| `19-38-10-034` | KANO | TARAUNI | GGSS UNGUWA UKU IV | 25 | **41** | +16 | added | 2026-11-08 |

| `12-11-05-023` | EDO | IKPOBA/OKHA | ST. SAVIOUR - UMELU SEC. SCHOOL I | 1077 | **1100** | +23 | added | 2026-11-08 |

| `13-01-09-016` | EKITI | ADO EKITI | IN FRONT OF PA JONATHAN'S HOUSE / OGBON OYO | 794 | **760** | -34 | added | 2026-11-08 |

| `27-17-14-011` | OGUN | ODOGBOLU | Z.I  PRIMARY SCHOOL, OMU | 124 | **285** | +161 | added | 2026-11-08 |

| `03-29-06-013` | AKWA IBOM | URUAN | VILLAGE HALL ATAI ROAD, IKOT AKPA EKANG | 93 | **185** | +92 | added | 2026-11-08 |

| `33-21-01-014` | SOKOTO | WAMAKKO | MINI MARKET TANKI I | 550 | **663** | +113 | added | 2026-11-08 |

| `20-25-03-004` | KATSINA | MALUFASHI | KABARA YABA - YABA PRI.SCHOOL | 564 | **569** | +5 | added | 2026-11-08 |

| `02-09-07-005` | ADAMAWA | LAMURDE | NGBARUWE/ KOFAR TUFULE | 600 | **616** | +16 | added | 2026-11-08 |

| `08-27-06-002` | BORNO | SHANI | KOFAR LAWAN , GWASKARA  II | 636 | **669** | +33 | added | 2026-11-08 |

| `16-04-07-004` | IMO | EZINIHITTE MBAISE | OMUKWU SQUARE II | 806 | **829** | +23 | added | 2026-11-08 |

| `08-21-04-010` | BORNO | MAIDUGURI M. C. | BAZAMBARI | 586 | **603** | +17 | added | 2026-11-08 |

| `30-07-10-002` | OYO | IBADAN NORTH EAST | ILE DELESOLU | 750 | **796** | +46 | added | 2026-11-08 |

| `15-05-02-006` | GOMBE | FUNAKAYE | BULTURI, KOFAR SARKI | 450 | **459** | +9 | added | 2026-11-08 |

| `34-16-07-017` | TARABA | ZING | YAKOKO I, YAKOKO PRIMARY SCHOOL I | 1205 | **1296** | +91 | added | 2026-11-08 |

| `29-01-06-002` | OSUN | ATAKUMOSA EAST | L.A. PRY. SCHOOL, AJIDO | 667 | **799** | +132 | added | 2026-11-08 |

| `19-42-11-008` | KANO | UNGOGO | RIMIN KEBE III | 1136 | **1150** | +14 | added | 2026-11-08 |

| `26-17-03-013` | NIGER | MOKWA | WUNANGI | 372 | **368** | -4 | added | 2026-11-08 |

| `24-03-07-035` | LAGOS | ALIMOSHO | FATADE VILLAGE ADELANWA STREET II | 750 | **734** | -16 | added | 2026-11-08 |

| `07-23-09-001` | BENUE | VANDEIKYA | LGEA SCHOOL PREMISES - GIRGI | 759 | **864** | +105 | added | 2026-11-08 |

| `05-07-04-009` | BAUCHI | GAMAWA | KARKANEMI,  KARKANEMI VILLAGE I | 564 | **571** | +7 | added | 2026-11-08 |

| `23-07-04-043` | KWARA | ILORIN-SOUTH | OPEN SPACE ANUOLUWA ASALA VILLA RIVER BASIN | 22 | **132** | +110 | added | 2026-11-08 |

| `02-05-09-009` | ADAMAWA | GOMBI | WUGULSA/ KOFAR JAURO | 588 | **785** | +197 | added | 2026-11-08 |

| `28-06-02-066` | ONDO | AKURE SOUTH | O/S BESIDE 5C ERUOBA | 10 | **13** | +3 | added | 2026-11-08 |

| `31-11-09-020` | PLATEAU | MANGU | CHANGFUN | 278 | **288** | +10 | added | 2026-11-08 |

| `18-17-04-029` | KADUNA | LERE | GALMAN DATTI / KAMPANI | 125 | **129** | +4 | added | 2026-11-08 |

| `06-07-06-013` | BAYELSA | SOUTHERN IJAW | BABERE GBENE COMM. SQUARE I | 248 | **291** | +43 | added | 2026-11-08 |

| `29-30-08-015` | OSUN | OSOGBO | OPEN SPACE, IJETU OLOWOKERE JUNCTION, OKE AYEPE, OSOGBO | 342 | **697** | +355 | added | 2026-11-08 |

| `01-01-02-001` | ABIA | ABA NORTH | NGWA CULTURAL HALL - NGWA CULTURAL HALL I | 708 | **683** | -25 | added | 2026-11-08 |

| `06-02-07-008` | BAYELSA | EKEREMOR | AZAGBENE SQUARE | 808 | **834** | +26 | added | 2026-11-08 |

| `21-13-12-006` | KEBBI | KOKO/BESSE | TUNGAR GIMBA | 415 | **430** | +15 | added | 2026-11-08 |

| `26-19-07-015` | NIGER | PAIKORO | SIKITI | 631 | **687** | +56 | added | 2026-11-08 |

| `25-10-03-017` | NASARAWA | NASARAWA EGGON | LGEA PRIMARY SCHOOL ONDZU | 249 | **275** | +26 | added | 2026-11-08 |

| `17-26-03-006` | JIGAWA | TAURA | VILLAGE HEAD GROUND / KATARIKA | 567 | **602** | +35 | added | 2026-11-08 |

| `11-05-10-005` | EBONYI | EZZA NORTH | C.P.S AZUITUMO II | 284 | **301** | +17 | added | 2026-11-08 |

| `07-17-07-007` | BENUE | OHIMINI | LGEA PRIM. SCH. AWULEMA | 203 | **283** | +80 | added | 2026-11-08 |

| `19-23-10-004` | KANO | KIBIYA | GAUDAWA TOWN II | 493 | **553** | +60 | added | 2026-11-08 |

| `04-11-04-002` | ANAMBRA | IDEMILI-SOUTH | EJIGHINANDU HALL II | 482 | **625** | +143 | added | 2026-11-08 |

| `32-17-02-012` | RIVERS | OGU/BOLO | OPEN SPACE, IGIO VI | 145 | **274** | +129 | added | 2026-11-08 |

| `32-09-02-008` | RIVERS | ELEME | TOWN HALL, NAAYA | 762 | **759** | -3 | added | 2026-11-08 |

| `32-07-07-007` | RIVERS | BONNY | EGELEBIE VILLAGE SQUARE / GBOTOMA | 470 | **506** | +36 | added | 2026-11-08 |

| `10-14-08-003` | DELTA | OSHIMILI - NORTH | ISUNAMBUOGU PRIMARY SCHOOL - UMUEDEM/UMUOCHE/OBODOAKPU/NKPOJI | 1265 | **1387** | +122 | added | 2026-11-08 |

| `03-09-04-001` | AKWA IBOM | IBESIKPO ASUTAN | PRY SCH, MBIKPONG ATAI | 714 | **726** | +12 | added | 2026-11-08 |

| `19-07-11-029` | KANO | DALA | KOFAR GIDAN S/KANGA/ O/SPACE VI | 406 | **405** | -1 | added | 2026-11-08 |

| `24-20-03-040` | LAGOS | SURULERE | OLUIROLU ST./OKE-OLORUNTEDO ST. - II | 411 | **442** | +31 | added | 2026-11-08 |

| `35-03-07-002` | YOBE | DAMATURU | FUGURI,FUGURI PRI. SCH. | 691 | **773** | +82 | added | 2026-11-08 |

| `08-22-10-002` | BORNO | MARTE | GARADAI PRI. SCH.  I | 995 | **1117** | +122 | added | 2026-11-08 |

| `08-07-05-015` | BORNO | DAMBOA | ALHAJI GREMA UMAR | 68 | **119** | +51 | added | 2026-11-08 |

| `16-06-12-007` | IMO | IDEATO SOUTH | UMUIRE SQ. | 883 | **906** | +23 | added | 2026-11-08 |

| `19-07-11-031` | KANO | DALA | KOFAR GIDAN S/KANGA/ O/SPACE VIII | 570 | **567** | -3 | added | 2026-11-08 |

| `23-11-07-013` | KWARA | KAIAMA | SABO EEC V0CATIONAL II | 102 | **129** | +27 | added | 2026-11-08 |

| `12-16-08-018` | EDO | OWAN EAST | IKHUERAN TOWN HALL OTUO II | 477 | **560** | +83 | added | 2026-11-08 |

| `24-03-03-055` | LAGOS | ALIMOSHO | SADIKU ILO BEHIND REGISTRY HALL, IDIMU | 340 | **410** | +70 | added | 2026-11-08 |

| `10-17-09-040` | DELTA | SAPELE | OKPE GRAMMAR SCHOOL, SAPELE III | 61 | **98** | +37 | added | 2026-11-08 |

| `30-09-11-033` | OYO | IBADAN SOUTH-EAST | K & S. ALADURA I | 627 | **621** | -6 | added | 2026-11-08 |

| `27-07-02-002` | OGUN | IFO | R.C.M. SCHOOL  II | 767 | **749** | -18 | added | 2026-11-08 |

| `19-43-12-015` | KANO | WARAWA | TANAGAR III (TANAGAR VETERINARY) | 571 | **676** | +105 | added | 2026-11-08 |

| `16-27-07-036` | IMO | OWERRI WEST | OUR LADY'S MATERNITY NEKEDE | 48 | **193** | +145 | added | 2026-11-08 |

| `19-11-06-002` | KANO | DOGUWA | DADIN KOWA I | 875 | **919** | +44 | added | 2026-11-08 |

| `22-19-06-012` | KOGI | OMALA | NEAR MADAKI'S HOUSE, OLIYA | 420 | **487** | +67 | added | 2026-11-08 |

| `01-12-09-015` | ABIA | UGWUNAGBO | IHIE OBEAKU PRIAMRY SCHOOL III | 130 | **156** | +26 | added | 2026-11-08 |

| `30-09-05-012` | OYO | IBADAN SOUTH-EAST | ITA OLUKOYI I | 750 | **719** | -31 | added | 2026-11-08 |

| `09-06-02-006` | CROSS RIVER | BIASE | EKPET VILLAGE HALL, ADIM | 763 | **808** | +45 | added | 2026-11-08 |

| `25-02-02-008` | NASARAWA | AWE | GINDIN - KADE - OB | 858 | **853** | -5 | added | 2026-11-08 |

| `36-10-05-017` | ZAMFARA | MARU | DAN AMARYA / GARKAR SARKI | 500 | **501** | +1 | added | 2026-11-08 |

| `19-28-11-005` | KANO | MADOBI | UNGUWAR DAWA/BODE | 804 | **952** | +148 | added | 2026-11-08 |

| `10-03-07-004` | DELTA | BOMADI | PENAWOU/KORO/ZION   PENAWOU LANE  O/S AKUGBENE | 1682 | **1699** | +17 | added | 2026-11-08 |

| `10-04-01-001` | DELTA | BURUTU | AMANADUMU  I  - GOVERNMENT DISPENSARY | 414 | **423** | +9 | added | 2026-11-08 |

| `04-12-04-004` | ANAMBRA | IHIALA | ASOC HALL I | 611 | **635** | +24 | added | 2026-11-08 |

| `06-02-01-021` | BAYELSA | EKEREMOR | ZIDEWARE ZIDE QTRS | 411 | **416** | +5 | added | 2026-11-08 |

| `31-01-07-007` | PLATEAU | BARIKIN LADI | LOHALA | 230 | **242** | +12 | added | 2026-11-08 |

| `19-34-06-014` | KANO | ROGO | SABUWAR UNGUWA | 19 | **91** | +72 | added | 2026-11-08 |

| `01-09-02-017` | ABIA | OBINGWA | UMUAFOR  CIVIC HALL | 1613 | **1690** | +77 | added | 2026-11-08 |

| `19-07-04-020` | KANO | DALA | RIJIYA HUDU, OPEN SPACE VIII | 551 | **546** | -5 | added | 2026-11-08 |

| `05-05-03-020` | BAUCHI | DARAZO | UNG BARDE PRI SCH | 210 | **242** | +32 | added | 2026-11-08 |

| `23-06-08-029` | KWARA | ILORIN EAST | G.S.S SECOND GATE FATE ROAD | 80 | **126** | +46 | added | 2026-11-08 |

| `09-15-09-009` | CROSS RIVER | ODUKPANI | PLAY GROUND, EKIM EBEBIT | 481 | **532** | +51 | added | 2026-11-08 |

| `34-07-02-031` | TARABA | JALINGO | SABON LAYI, BAMALU | 78 | **91** | +13 | added | 2026-11-08 |

| `09-07-08-006` | CROSS RIVER | BOKI | PLAYGROUND NTAMANTE I & II | 973 | **976** | +3 | added | 2026-11-08 |

| `28-14-08-001` | ONDO | OKITIPUPA | LILIKEN OGUNBAMERUN, ST PETER ANG SCH ILUTITUN I | 345 | **353** | +8 | added | 2026-11-08 |

| `27-03-01-049` | OGUN | ADO ODO-OTA | OPEN SPACE AT ALAFIA STREET, NEAR MORIKAZ SEBIL NAJAT , IDOTA | 115 | **143** | +28 | added | 2026-11-08 |

| `31-03-13-015` | PLATEAU | BOKKOS | PRI.SCH FITMATORMAN | 150 | **206** | +56 | added | 2026-11-08 |

| `25-08-07-019` | NASARAWA | LAFIA | K / SARKI ORGANIZER - OP | 750 | **807** | +57 | added | 2026-11-08 |

| `36-06-04-009` | ZAMFARA | GUMMI | UNG. GALADIMA III /SABON GARI | 555 | **675** | +120 | added | 2026-11-08 |

| `28-01-01-004` | ONDO | AKOKO NORTH EAST | ODE KOLOFIN/ODEAGBARI  IN FRONT OF CHIEF OLORUNS HOUSE | 479 | **496** | +17 | added | 2026-11-08 |

| `23-07-03-007` | KWARA | ILORIN-SOUTH | OKE OGUN HEALTH CENTRE | 750 | **779** | +29 | added | 2026-11-08 |

| `36-13-04-011` | ZAMFARA | TSAFE | UNGUWAN MANDE    /  FALANIN DODO | 617 | **734** | +117 | added | 2026-11-08 |

| `10-10-07-019` | DELTA | ISOKO SOUTH | UBRENYE HALL, UBRENYE QUARTERS II | 418 | **435** | +17 | added | 2026-11-08 |

| `07-05-01-007` | BENUE | GBOKO | LGEA PRIMARY SCHOOL, GBK CENTRAL | 1294 | **1315** | +21 | added | 2026-11-08 |

| `21-09-03-006` | KEBBI | FAKAI | URGUN PRI SCH (S. FAWA MAGAJI RES) | 1003 | **1132** | +129 | added | 2026-11-08 |

| `28-15-09-008` | ONDO | ONDO EAST | SASERE | 67 | **131** | +64 | added | 2026-11-08 |

| `02-02-02-016` | ADAMAWA | FUFORE | DAMARE PRY SCH | 378 | **380** | +2 | added | 2026-11-08 |

| `33-13-02-013` | SOKOTO | S/BIRNI | GOVERNMENT LODGE - SHIYAR MALLAN KADA | 896 | **883** | -13 | added | 2026-11-08 |

| `14-12-01-024` | ENUGU | NKANU WEST | EZIOBODO TOWN HALL | 17 | **129** | +112 | added | 2026-11-08 |

| `32-19-06-010` | RIVERS | OMUMA | UMUNWAKA I VILLAGE SQUARE | 210 | **217** | +7 | added | 2026-11-08 |

| `33-07-05-014` | SOKOTO | GWADABAWA | SHIYAR S FULANI, SH S.FULANI II | 478 | **544** | +66 | added | 2026-11-08 |

| `08-10-09-006` | BORNO | GUZAMALA | TAMALE | 379 | **523** | +144 | added | 2026-11-08 |

| `21-06-07-004` | KEBBI | BIRNIN KEBBI | GWAMBARA  TVC GWAMBARA | 293 | **294** | +1 | added | 2026-11-08 |

| `21-08-09-002` | KEBBI | DANDI | UNG. ZAKARU | 742 | **742** | 0 | added | 2026-11-08 |

| `27-17-07-008` | OGUN | ODOGBOLU | OBU OBASA SQUARE OSOSA | 99 | **225** | +126 | added | 2026-11-08 |

| `33-01-08-008` | SOKOTO | BINJI | GIDA-DILO PRIMARY SCHOOL. | 779 | **773** | -6 | added | 2026-11-08 |

| `03-10-08-020` | AKWA IBOM | IBIONO IBOM | VILLAGE SQUARE, AFAHA ISE | 254 | **265** | +11 | added | 2026-11-08 |

| `15-03-05-003` | GOMBE | BILLIRI | UNG. HAUSAWA, VIEWING CENTRE | 939 | **915** | -24 | added | 2026-11-08 |

| `03-28-03-006` | AKWA IBOM | UKANAFUN | G/P/S , OKOYO 1 & 11 | 654 | **747** | +93 | added | 2026-11-08 |

| `12-18-06-024` | EDO | UHUNMWODE | OPEN FIELD BY ARMY BARRACKS, EYAEN | 750 | **925** | +175 | added | 2026-11-08 |

| `32-22-20-120` | RIVERS | PORT HARCOURT | OKURU-AMA GOLF ESTATE | 750 | **844** | +94 | added | 2026-11-08 |

| `19-11-03-017` | KANO | DOGUWA | MAIKAULASAN/GANGARA STREET | 61 | **247** | +186 | added | 2026-11-08 |

| `28-13-02-014` | ONDO | ODIGBO | ORISUNBARE VILLAGE, MATERNITY CENTRE ORISANUNBARE | 377 | **417** | +40 | added | 2026-11-08 |

| `04-17-07-012` | ANAMBRA | ONITSHA-NORTH | OPEN SPACE BESIDE NO. 1 JUSTICE ARAKA OJUDO LANE | 108 | **161** | +53 | added | 2026-11-08 |

| `10-10-04-003` | DELTA | ISOKO SOUTH | ENYE HALL, URUKERE/OTEGELOMA | 484 | **493** | +9 | added | 2026-11-08 |

| `06-05-13-012` | BAYELSA | OGBIA | OBAKUBO - OTUABULA II | 216 | **220** | +4 | restored | 2026-11-08 |

| `19-16-02-017` | KANO | GAYA | HARUNAWA/UNGUWAR GABAS | 830 | **903** | +73 | added | 2026-11-08 |

| `28-06-03-058` | ONDO | AKURE SOUTH | O/S UNDER TREE AT FUTA SECONDARY SCHOOL | 750 | **751** | +1 | added | 2026-11-08 |

| `09-11-08-005` | CROSS RIVER | IKOM | COMM. SECONDARY SCHOOL,  OKANGHA | 823 | **830** | +7 | added | 2026-11-08 |

| `31-02-05-019` | PLATEAU | BASSA | BAKIN TITI | 0 | **14** | +14 | added | 2026-11-08 |

| `11-12-10-015` | EBONYI | OHAUKWU | EKWEBURU P/G | 322 | **436** | +114 | restored | 2026-11-08 |

| `03-27-02-006` | AKWA IBOM | UDUNG UKO | COMMUNITY MODEL PRIMARY SCHOOL, EYO UWE | 70 | **187** | +117 | added | 2026-11-08 |

| `10-15-02-006` | DELTA | OSHIMILI - SOUTH | OBI-OKPU PRIMARY SCHOOL - OBI-OKPU II | 788 | **808** | +20 | added | 2026-11-08 |

| `08-22-06-006` | BORNO | MARTE | KIRENOWA MARKET II | 937 | **998** | +61 | added | 2026-11-08 |

| `34-03-08-011` | TARABA | DONGA | NUKUNYA, NUKUNYA PRIMARY SCHOOL | 912 | **953** | +41 | added | 2026-11-08 |

| `20-02-01-024` | KATSINA | BATAGARAWA | BATAGARAWA LOW COST PRI. SCH. 'B' | 55 | **118** | +63 | added | 2026-11-08 |

| `21-06-04-007` | KEBBI | BIRNIN KEBBI | SABON BIRNI G/GWANGO GUMBA | 750 | **772** | +22 | added | 2026-11-08 |

| `14-12-11-009` | ENUGU | NKANU WEST | ONUEKE TOWN HALL | 324 | **340** | +16 | added | 2026-11-08 |

| `09-11-09-014` | CROSS RIVER | IKOM | PLAYGROUND ELA-EYAMBA EKUKUNELA VILLAGE | 123 | **145** | +22 | added | 2026-11-08 |

| `20-31-04-001` | KATSINA | SABUWA | MAI BAKKO/PRI.SCHOOL | 1194 | **1117** | -77 | added | 2026-11-08 |

| `11-07-14-012` | EBONYI | IKWO | OFUTU PRIMARY SCHOOL | 182 | **273** | +91 | added | 2026-11-08 |

| `16-18-01-013` | IMO | OHAJI EGBEMA | UMUGAMA TOWN HALL | 82 | **271** | +189 | added | 2026-11-08 |

| `20-10-01-006` | KATSINA | DAURA | UNGUWAR KAURA I DAKIN SHARAR DOLE | 398 | **417** | +19 | added | 2026-11-08 |

| `24-01-02-028` | LAGOS | AGEGE | 7, MUFUTAU SHOETAN | 453 | **445** | -8 | added | 2026-11-08 |

| `25-05-10-008` | NASARAWA | KEANA | LGEA PRIMARY SCHOOL, KPALEV | 592 | **1220** | +628 | added | 2026-11-08 |

| `35-12-09-011` | YOBE | NANGERE | DALLARI , KOFAR MAIGARI | 837 | **866** | +29 | added | 2026-11-08 |

| `01-02-04-037` | ABIA | ABA SOUTH | EHIME HALL III | 13 | **74** | +61 | added | 2026-11-08 |

| `08-05-09-012` | BORNO | BIU | ZAIFADA  I | 696 | **685** | -11 | added | 2026-11-08 |

| `04-11-10-001` | ANAMBRA | IDEMILI-SOUTH | OGWUGWU PRY. SCHOOL | 683 | **734** | +51 | added | 2026-11-08 |

| `05-12-02-048` | BAUCHI | KATAGUM | RIJIYAR YAN WANKI, RIJIYAR YAN WANKI II | 723 | **738** | +15 | added | 2026-11-08 |

| `24-10-06-023` | LAGOS | IFAKO-IJAYE | 25, AJIBONA CLOSE, IJU AJUWON | 19 | **26** | +7 | added | 2026-11-08 |

| `22-10-09-005` | KOGI | KABBA/BUNU | OBELE, OBELE | 498 | **530** | +32 | added | 2026-11-08 |

| `11-11-03-020` | EBONYI | OHAOZARA | OGWE ABOSHI AMATA SQUARE | 3 | **196** | +193 | added | 2026-11-08 |

| `20-12-09-014` | KATSINA | DUTSIN-MA | OPEN SPACE SOLAR UNG.GABAS | 26 | **273** | +247 | added | 2026-11-08 |

| `24-17-01-019` | LAGOS | OJO | LEFT SIDE OF HASSAN ST/AJAKAIYE ST. | 454 | **454** | 0 | added | 2026-11-08 |

| `37-05-09-012` | FCT | KWALI | DANGARA PRIMARY SCHOOL II | 336 | **424** | +88 | added | 2026-11-08 |

| `24-17-02-009` | LAGOS | OJO | OPEN SPACE AT 27, AIYEPE ST. OKOKO | 731 | **764** | +33 | added | 2026-11-08 |

| `18-22-06-033` | KADUNA | ZANGON KATAF | MATSIRGA II/TRUM | 134 | **135** | +1 | added | 2026-11-08 |

| `33-23-08-007` | SOKOTO | YABO | KAURAR DAGEL MARAFA | 125 | **209** | +84 | added | 2026-11-08 |

| `34-05-09-003` | TARABA | GASSOL | G/BELLO, GARIN BELLO | 288 | **292** | +4 | added | 2026-11-08 |

| `24-12-16-038` | LAGOS | IKORODU | IN FRONT OF LAGOS STATE FIRE STATION, LOSI OBA III | 388 | **456** | +68 | added | 2026-11-08 |

| `17-15-10-001` | JIGAWA | KAFIN HAUSA | MATAKUWA PRI. SCH. | 348 | **428** | +80 | added | 2026-11-08 |

| `12-11-07-019` | EDO | IKPOBA/OKHA | UGBEKUN - OLOGBOSERE PRIMARY SCHOOL II | 879 | **875** | -4 | added | 2026-11-08 |

| `28-06-06-021` | ONDO | AKURE SOUTH | OPEN SPACE AT  AAYE PALACE ROAD | 199 | **301** | +102 | added | 2026-11-08 |

| `04-06-02-002` | ANAMBRA | AWKA NORTH | UDOKA   P/S II | 345 | **391** | +46 | added | 2026-11-08 |

| `27-07-10-001` | OGUN | IFO | OKE OJI  I | 520 | **525** | +5 | added | 2026-11-08 |

| `05-02-03-088` | BAUCHI | BAUCHI | ASIBITIN BAYAN GIDAN BARAYA | 46 | **133** | +87 | added | 2026-11-08 |

| `17-27-06-003` | JIGAWA | YANKWASHI | KARKARNA YAMMA  /PRIMARY  SCHOOL | 1634 | **1712** | +78 | added | 2026-11-08 |

| `24-15-06-016` | LAGOS | LAGOS MAINLAND | IB. ST. (BY HOUSE 44) | 513 | **520** | +7 | added | 2026-11-08 |

| `32-07-07-002` | RIVERS | BONNY | VILLAGE SQUARE, GEORGE AMA | 600 | **665** | +65 | added | 2026-11-08 |

| `10-22-10-014` | DELTA | UVWIE | BY OMATA JUCTN. UDUMULOHO | 120 | **145** | +25 | added | 2026-11-08 |

| `28-13-01-011` | ONDO | ODIGBO | OKE OLUWA ZION, CENTRE OF OKE OLUWA ZION | 258 | **337** | +79 | added | 2026-11-08 |

| `15-06-07-042` | GOMBE | GOMBE | JEKADAFARI PRIM. HEALTH CARE | 128 | **174** | +46 | added | 2026-11-08 |

| `02-16-04-015` | ADAMAWA | NUMAN | NGBALANG PRI.SCH II | 539 | **574** | +35 | added | 2026-11-08 |

| `25-04-05-006` | NASARAWA | KARU | ANG. GWANDARA | 997 | **1053** | +56 | added | 2026-11-08 |

| `09-11-02-017` | CROSS RIVER | IKOM | BUS STOP NTUROKIM | 54 | **103** | +49 | added | 2026-11-08 |

| `29-09-10-018` | OSUN | EGBEDORE | OPEN SPACE AT ALIVE MEDICAL CENTRE JUNCTION DADA ESTATE | 56 | **133** | +77 | added | 2026-11-08 |

| `36-12-02-009` | ZAMFARA | TALATA MAFARA | TASHAR ROGO / BAKIN TASHA | 398 | **401** | +3 | added | 2026-11-08 |

| `01-12-07-019` | ABIA | UGWUNAGBO | ASANNENTU CIVIC HALL III | 48 | **154** | +106 | added | 2026-11-08 |

| `01-12-04-004` | ABIA | UGWUNAGBO | OWERRE ABA IV- OWERRE ABA VILLAGE HALL | 750 | **740** | -10 | restored | 2026-11-08 |

| `20-32-05-015` | KATSINA | SAFANA | KUKAR SAMU PRIMARY SCHOOL | 55 | **87** | +32 | added | 2026-11-08 |

| `15-06-05-011` | GOMBE | GOMBE | BAPPA HAURO, KOFAR  BAPPA | 1477 | **1509** | +32 | added | 2026-11-08 |

| `17-11-05-036` | JIGAWA | GWARAM | R/SHADAL AULAD ISLAMIYYA ?GALAMBI | 114 | **310** | +196 | added | 2026-11-08 |

| `31-05-02-004` | PLATEAU | JOS NORTH | KOFAR MAI UNGWA II | 493 | **489** | -4 | added | 2026-11-08 |

| `37-06-04-127` | FCT | MUNICIPAL | GURARA STREET OPP. BLK. 29 | 342 | **336** | -6 | added | 2026-11-08 |

| `26-11-02-001` | NIGER | KONTAGORA | KOFAR GIDAN BASHARI | 752 | **854** | +102 | added | 2026-11-08 |

| `16-26-06-003` | IMO | OWERRI NORTH | UBOEGBELU PRIMARY SCHOOL I | 567 | **570** | +3 | added | 2026-11-08 |

| `06-04-10-001` | BAYELSA | NEMBE | OLOGOAMA SCH. COMPOUND | 484 | **514** | +30 | added | 2026-11-08 |

| `31-01-10-013` | PLATEAU | BARIKIN LADI | LEA PRI. SCH. KULOSONG | 267 | **276** | +9 | added | 2026-11-08 |

| `08-14-13-001` | BORNO | KAGA | TOBOLO PRI. SCH. / TOBOLO LAWANTI I | 485 | **563** | +78 | added | 2026-11-08 |

| `23-11-04-002` | KWARA | KAIAMA | TUNGA-ABOKI KLGEA SCH | 1495 | **1560** | +65 | added | 2026-11-08 |

| `24-02-10-062` | LAGOS | AJEROMI/IFELODUN | 5, ARO COURT | 85 | **100** | +15 | added | 2026-11-08 |

| `32-19-02-013` | RIVERS | OMUMA | OWAHIA SQUARE, UMUOKPURUKPU ONUMIRI | 223 | **228** | +5 | added | 2026-11-08 |

| `29-01-02-004` | OSUN | ATAKUMOSA EAST | ST. LUKE'S SCHOOL, OWODE | 836 | **820** | -16 | added | 2026-11-08 |

| `07-16-11-015` | BENUE | OJU | OBIBAGWU - OPEN SPACE | 750 | **813** | +63 | added | 2026-11-08 |

| `17-21-04-003` | JIGAWA | MALAM MADORI | GARI GABAS TSOHUWA PRI. SCH. | 923 | **1022** | +99 | added | 2026-11-08 |

| `29-21-05-016` | OSUN | IREWOLE | OPEN SPACE, ST. JUDE HOSPITAL JUNCTION, IKIRE | 96 | **182** | +86 | added | 2026-11-08 |

| `19-18-03-072` | KANO | GWALE | DORAYI KARAMA  PRI. SCH..  VII | 212 | **402** | +190 | added | 2026-11-08 |

| `10-18-06-011` | DELTA | UDU | EKETE SEC SCH, KOTOKOTO | 518 | **593** | +75 | added | 2026-11-08 |

| `31-05-07-028` | PLATEAU | JOS NORTH | PEOPLE'S HOTEL JUNCTION | 916 | **900** | -16 | added | 2026-11-08 |

| `26-11-08-001` | NIGER | KONTAGORA | USALLE GARI | 467 | **515** | +48 | added | 2026-11-08 |

| `16-23-10-015` | IMO | ORU EAST | UMUHU PRIMARY SCHOOL II | 750 | **1311** | +561 | added | 2026-11-08 |

| `03-29-08-008` | AKWA IBOM | URUAN | PRY SCH, USE URUAN I | 501 | **536** | +35 | added | 2026-11-08 |

| `28-02-06-015` | ONDO | AKOKO NORTH WEST | ALA/ALADEGBAYE, ST JAMES CHURCH EGUN | 550 | **577** | +27 | added | 2026-11-08 |

| `11-10-11-020` | EBONYI | IZZI | COMMUNITY SCH. ONWEONWEYA | 61 | **62** | +1 | added | 2026-11-08 |

| `24-11-02-012` | LAGOS | IKEJA | OJODU PRY. SCH. I | 750 | **842** | +92 | added | 2026-11-08 |

| `13-04-04-002` | EKITI | EKITI WEST | OKEMORE, IGBEHIN II | 454 | **465** | +11 | added | 2026-11-08 |

| `06-05-03-015` | BAYELSA | OGBIA | OMYI - OLOGI | 329 | **362** | +33 | added | 2026-11-08 |

| `29-30-05-018` | OSUN | OSOGBO | ALEKUWODO PREMISES | 881 | **917** | +36 | added | 2026-11-08 |

| `02-05-07-009` | ADAMAWA | GOMBI | UNG. WAKILI MALAM/ N/GARKIDA PRY. SCH. II | 750 | **761** | +11 | added | 2026-11-08 |

| `35-02-05-017` | YOBE | BURSARI | RINI KUNU PRIMARY SCHOOL II | 52 | **282** | +230 | added | 2026-11-08 |

| `36-02-04-021` | ZAMFARA | BAKURA | DANBO RIJIYAR BARAWA | 319 | **503** | +184 | added | 2026-11-08 |

| `15-03-07-015` | GOMBE | BILLIRI | HAUSAWA  AYABA, K. SARKI AYABA | 852 | **861** | +9 | added | 2026-11-08 |

| `37-06-03-008` | FCT | MUNICIPAL | LUGBE I / UNG. SARKI (GIDAN MAGORO) | 3311 | **3293** | -18 | added | 2026-11-08 |

| `19-38-03-021` | KANO | TARAUNI | KUNDILA PRIMARY SCHOOL III | 612 | **627** | +15 | added | 2026-11-08 |

| `30-09-12-013` | OYO | IBADAN SOUTH-EAST | ADELABU SHOPPING COMPLEX III | 638 | **617** | -21 | added | 2026-11-08 |

| `02-18-07-002` | ADAMAWA | SONG | BALMA | 850 | **805** | -45 | added | 2026-11-08 |

| `28-10-10-009` | ONDO | ILAJE | OBE OGBARO, NEAR CHIEF ODOKAS HOUSE | 785 | **801** | +16 | added | 2026-11-08 |

| `19-33-07-005` | KANO | RIMIN GADO | GADAWA PRIMARY SCHOOL II | 351 | **380** | +29 | added | 2026-11-08 |

| `37-06-06-022` | FCT | MUNICIPAL | 2. JIWA TSOHO PRIMARY SCHOOL II | 6 | **87** | +81 | added | 2026-11-08 |

| `18-07-10-008` | KADUNA | JEMA'A | RAMIN-DOP/ RAMIN-DOP | 684 | **707** | +23 | added | 2026-11-08 |

| `24-08-05-005` | LAGOS | ETI-OSA | IGBO-EFON TOWN V | 750 | **784** | +34 | added | 2026-11-08 |

| `30-28-06-020` | OYO | ORI IRE | ALASAPA OPEN SPACE | 546 | **545** | -1 | added | 2026-11-08 |

| `10-03-09-015` | DELTA | BOMADI | PERE/GBE HALL AKUGBENE III. | 18 | **128** | +110 | added | 2026-11-08 |

| `19-24-06-007` | KANO | KIRU | MAI DALLA | 453 | **457** | +4 | added | 2026-11-08 |

| `12-01-08-023` | EDO | AKOKO EDO | OPEN SPACE - ATTE, ST JAMES ANG. CHURCH, EROKE QTRS | 103 | **172** | +69 | added | 2026-11-08 |

| `06-07-02-007` | BAYELSA | SOUTHERN IJAW | AGUO OPEN SPACE | 236 | **267** | +31 | added | 2026-11-08 |

| `17-21-01-009` | JIGAWA | MALAM MADORI | KOFAR MAIGARI/MAJIRGA | 245 | **270** | +25 | added | 2026-11-08 |

| `26-16-08-011` | NIGER | MASHEGU | ADOGON MATANE | 794 | **858** | +64 | added | 2026-11-08 |

| `33-08-06-023` | SOKOTO | ILLELA | DUMAJE KWARE | 915 | **916** | +1 | added | 2026-11-08 |

| `24-18-06-041` | LAGOS | OSHODI/ISOLO | 14B,  OKANLAWON STREET | 10 | **32** | +22 | added | 2026-11-08 |

| `25-13-09-009` | NASARAWA | WAMBA | MAMA PRI. SCH. II | 69 | **250** | +181 | added | 2026-11-08 |

| `29-09-10-030` | OSUN | EGBEDORE | OPEN SPACE UNDER CASHEW TREE OPPOSITE AKAYE HOUSE OKINNI | 750 | **880** | +130 | added | 2026-11-08 |

| `29-13-09-027` | OSUN | IFE EAST | OPEN SPACE OPP OWONIKOKO C.I.C.S HALL, ARANSE OLU | 750 | **926** | +176 | added | 2026-11-08 |

| `07-22-06-009` | BENUE | USHONGO | RCM SCHOOL, KAAKIGHIR | 537 | **590** | +53 | added | 2026-11-08 |

| `01-01-01-001` | ABIA | ABA NORTH | RAILWAY QUARTERS - RAILWAY QUARTERS I | 968 | **1006** | +38 | added | 2026-11-08 |

| `32-13-12-020` | RIVERS | IKWERRE | WALI HALL OMUNOBO, IGWURUTA. | 12 | **36** | +24 | added | 2026-11-08 |

| `10-04-04-004` | DELTA | BURUTU | TOBOROBIRI  -  TOBOROBIRI  P/G | 215 | **243** | +28 | added | 2026-11-08 |

| `31-15-05-001` | PLATEAU | RIYOM | RA-HOSS PRY. SCHOOL | 1176 | **1150** | -26 | added | 2026-11-08 |

| `31-08-08-007` | PLATEAU | KANKE | GYANGYANG II | 592 | **666** | +74 | added | 2026-11-08 |

| `26-04-03-003` | NIGER | BORGU | MONNAI Z.E.B. | 750 | **740** | -10 | added | 2026-11-08 |

| `24-10-07-024` | LAGOS | IFAKO-IJAYE | JUNC. OF OLUSOLA OLAWALE STR. OFF NNPC PIPELINE RD | 131 | **165** | +34 | added | 2026-11-08 |

| `31-04-03-012` | PLATEAU | JOS EAST | ZOTT SABO | 429 | **434** | +5 | added | 2026-11-08 |

| `14-03-06-014` | ENUGU | ENUGU EAST | ALULU VILLAGE SQUARE HALL | 160 | **192** | +32 | added | 2026-11-08 |

| `09-14-04-043` | CROSS RIVER | OBUDU | AMAMA PLAYGROUND | 572 | **574** | +2 | added | 2026-11-08 |

| `12-03-01-002` | EDO | ESAN CENTRAL | IBORE PRIMARY SCHOOL , IBORE-II | 956 | **1475** | +519 | added | 2026-11-08 |

| `26-06-05-021` | NIGER | CHANCHAGA | KODONDO BACK OF LIMAWA PRIMARY SCHOOL | 222 | **297** | +75 | added | 2026-11-08 |

| `02-18-05-007` | ADAMAWA | SONG | KUNGO | 385 | **406** | +21 | added | 2026-11-08 |

| `17-02-02-015` | JIGAWA | BABURA | JAN MUTUM PRI SCH II | 56 | **149** | +93 | added | 2026-11-08 |

| `24-05-08-028` | LAGOS | APAPA | LAWANI CLOSE | 677 | **675** | -2 | added | 2026-11-08 |

| `29-13-08-001` | OSUN | IFE EAST | R.C.M. IRAYE | 897 | **848** | -49 | added | 2026-11-08 |

| `24-10-01-020` | LAGOS | IFAKO-IJAYE | 8, KAYODE ST. OGBA | 978 | **952** | -26 | added | 2026-11-08 |

| `19-10-03-026` | KANO | DAWAKI TOFA | ZANGON DAWANAU | 545 | **1000** | +455 | added | 2026-11-08 |

| `25-04-05-001` | NASARAWA | KARU | GWAYA PRI. SCHOOL - PB | 750 | **829** | +79 | added | 2026-11-08 |

| `10-23-02-004` | DELTA | WARRI  NORTH | TEBU  TOWN HALL,  TEBU I | 835 | **864** | +29 | added | 2026-11-08 |

| `14-09-16-006` | ENUGU | IGBO EZE SOUTH | UNADU COUNCIL HALL I | 387 | **399** | +12 | added | 2026-11-08 |

| `31-13-08-040` | PLATEAU | PANKSHIN | KANVEL I | 68 | **90** | +22 | added | 2026-11-08 |

| `32-06-12-013` | RIVERS | ASARI-TORU | IDO TOWN HALL, ESUKKU POLO | 659 | **661** | +2 | added | 2026-11-08 |

| `32-08-17-013` | RIVERS | DEGEMA | GOVT. SEC. SCH HALL, SALO | 488 | **518** | +30 | added | 2026-11-08 |

| `30-05-09-016` | OYO | EGBEDA | OPEN SPACE ARABA VILLAGE BESIDE MTN MAST | 666 | **1063** | +397 | added | 2026-11-08 |

| `07-11-03-029` | BENUE | KWANDE | ANNUNE MARKET SQUARE | 41 | **100** | +59 | added | 2026-11-08 |

| `33-23-10-008` | SOKOTO | YABO | GUM GUMA/GUM GUMA | 309 | **329** | +20 | added | 2026-11-08 |

| `03-29-10-003` | AKWA IBOM | URUAN | MARKET SQUARE, EKPENE UKIM | 750 | **803** | +53 | added | 2026-11-08 |

| `32-03-12-003` | RIVERS | AHOADA WEST | TOWN HALL, EBRIBA II | 297 | **302** | +5 | added | 2026-11-08 |

| `22-21-04-003` | KOGI | YAGBA WEST | YWLGEA AREA, OKOLOKE/EHIN OGGA/IPETU | 686 | **886** | +200 | added | 2026-11-08 |

| `04-17-08-014` | ANAMBRA | ONITSHA-NORTH | ADO GIRLS SECONDARY SCHOOL | 1037 | **1032** | -5 | added | 2026-11-08 |

| `30-24-09-001` | OYO | OLORUNSOGO | AGO ARE | 505 | **580** | +75 | added | 2026-11-08 |

| `20-13-07-013` | KATSINA | FASKARI | REMANYA KOFAR GIDAN HARUNA | 451 | **457** | +6 | added | 2026-11-08 |

| `24-02-05-011` | LAGOS | AJEROMI/IFELODUN | IN FRONT OF THE SCH. GATE (YISA ABIODUN) I | 346 | **351** | +5 | added | 2026-11-08 |

| `37-06-11-049` | FCT | MUNICIPAL | AREA CII / AREA C MARKET BY BOREHOLE | 461 | **462** | +1 | added | 2026-11-08 |

| `24-13-05-146` | LAGOS | KOSOFE | 26 ADISA BALOGUN STREET ALAPERE | 129 | **206** | +77 | added | 2026-11-08 |

| `16-04-03-008` | IMO | EZINIHITTE MBAISE | CHUKWUOMA HALL | 1101 | **1124** | +23 | added | 2026-11-08 |

| `25-12-10-003` | NASARAWA | TOTO | GATE | 522 | **662** | +140 | added | 2026-11-08 |

| `17-03-07-005` | JIGAWA | BIRNIN KUDU | KUMBURA, KUMBURA | 845 | **895** | +50 | added | 2026-11-08 |

| `12-11-09-032` | EDO | IKPOBA/OKHA | OBAYANTOR, OSEMWENDE SEC SCHOOL II | 274 | **392** | +118 | added | 2026-11-08 |

| `07-13-04-026` | BENUE | MAKURDI | NEAR ALH. IBRAHIM IMAN - BAUCHI STREET | 840 | **833** | -7 | added | 2026-11-08 |

| `19-36-11-028` | KANO | SUMAILA | SUMAILA CENTRAL PRI SCH NEW BLOCK IV | 57 | **111** | +54 | added | 2026-11-08 |

| `20-02-03-015` | KATSINA | BATAGARAWA | KATARDA - KATARDA | 757 | **790** | +33 | added | 2026-11-08 |

| `04-12-03-004` | ANAMBRA | IHIALA | UMUEZEALA VILLAGE SQUARE I | 392 | **422** | +30 | added | 2026-11-08 |

| `19-44-07-002` | KANO | WUDIL | KAUYAWA - PRIMARY SCHOOL I | 674 | **692** | +18 | added | 2026-11-08 |

| `33-02-03-013` | SOKOTO | BODINGA | FANFO SH.MAGAJI, TUDUN NUFAWA | 479 | **577** | +98 | added | 2026-11-08 |

| `02-12-01-007` | ADAMAWA | MAYO - BELWA | WAYERE I/ KOFAR J/WAYERE I | 522 | **611** | +89 | added | 2026-11-08 |

| `26-15-04-012` | NIGER | MARIGA | UNG. IBBE | 646 | **747** | +101 | added | 2026-11-08 |

| `36-07-05-056` | ZAMFARA | GUSAU | G/MALAN YAHAYA II/ B/RUWA SEC. SCH | 271 | **306** | +35 | added | 2026-11-08 |

| `18-17-03-028` | KADUNA | LERE | MARIRI/III / L.E.A.MARIRI | 1076 | **1079** | +3 | added | 2026-11-08 |

| `18-09-08-073` | KADUNA | KADUNA NORTH | ISIAKU CLOSE OFF LIBERA RD. | 37 | **45** | +8 | added | 2026-11-08 |

| `07-19-01-023` | BENUE | OTUKPO | FRONT OF EJIGA MEMORIAL COLLEGE EJINYA | 171 | **213** | +42 | added | 2026-11-08 |

| `27-15-04-011` | OGUN | OBAFEMI/OWODE | N.U.D. SCHOOL, ORILE - IMO I | 699 | **846** | +147 | added | 2026-11-08 |

| `04-03-03-014` | ANAMBRA | ANAMBRA EAST | IWUNOR SQUARE II | 382 | **416** | +34 | added | 2026-11-08 |

| `05-10-09-003` | BAUCHI | ITAS/GADAU | GWADAGON,  KOFAR  FADA | 259 | **260** | +1 | added | 2026-11-08 |

| `16-26-01-005` | IMO | OWERRI NORTH | AMUZI AWAKA VILLAGE SQUARE | 827 | **829** | +2 | added | 2026-11-08 |

| `14-03-07-009` | ENUGU | ENUGU EAST | CENTRAL SCHOOL EMENE V | 1132 | **1122** | -10 | added | 2026-11-08 |

| `33-21-03-008` | SOKOTO | WAMAKKO | M.P.S YARABBA - YAR-ABBA | 1142 | **1276** | +134 | added | 2026-11-08 |

| `34-14-02-019` | TARABA | WUKARI | PWADZU PHCC | 55 | **97** | +42 | added | 2026-11-08 |

| `02-18-06-009` | ADAMAWA | SONG | WURO HESSO PRIMARY SCHOOL | 227 | **228** | +1 | added | 2026-11-08 |

| `24-16-12-052` | LAGOS | MUSHIN | 12, BADA ST. II | 306 | **296** | -10 | added | 2026-11-08 |

| `09-01-09-008` | CROSS RIVER | ABI | AGBA PLAY GROUND | 560 | **578** | +18 | added | 2026-11-08 |

| `23-14-03-005` | KWARA | OKE - ERO | ILALE COMMUNITY MARKET | 371 | **472** | +101 | added | 2026-11-08 |

| `06-05-12-018` | BAYELSA | OGBIA | EBEDE CAMP - OTABAGI | 259 | **341** | +82 | added | 2026-11-08 |

| `03-01-11-004` | AKWA IBOM | ABAK | VILLAGE SQUARE, IKOT ETUKUDO | 841 | **841** | 0 | added | 2026-11-08 |

| `22-18-01-006` | KOGI | OLAMABORO | VILLAGE SQUARE EFEKPE, EFEKPE | N/A | **1044** | N/A | added | 2026-11-08 |

| `01-08-10-002` | ABIA | ISUIKWUATO | HOPE VILLE  REHABILITATION CENTRE - UTURU | 820 | **849** | +29 | added | 2026-11-08 |

| `07-22-05-006` | BENUE | USHONGO | MDSS WAAPERA I | 475 | **494** | +19 | added | 2026-11-08 |

| `04-12-13-008` | ANAMBRA | IHIALA | ORSU CENTRAL SCHOOL II | 383 | **394** | +11 | added | 2026-11-08 |

| `09-06-10-011` | CROSS RIVER | BIASE | PRIMARY SCHOOL, UFUT | 476 | **563** | +87 | added | 2026-11-08 |

| `30-29-10-005` | OYO | OYO EAST | ADEWINBI O/S | 873 | **842** | -31 | added | 2026-11-08 |

| `32-22-05-007` | RIVERS | PORT HARCOURT | ST. MARY'S PRIMARY SCHOOL VII | 865 | **847** | -18 | added | 2026-11-08 |

| `02-13-06-016` | ADAMAWA | MICHIKA | ZAIBADARI III / ZAIBADARI PRI. SCH. III | 926 | **977** | +51 | added | 2026-11-08 |

| `18-17-03-029` | KADUNA | LERE | UNG. SARKIN GARU I | 478 | **523** | +45 | added | 2026-11-08 |

| `30-21-09-007` | OYO | OGBOMOSO NORTH | OJUDE FAPOTE | 388 | **391** | +3 | added | 2026-11-08 |

| `29-02-02-002` | OSUN | ATAKUMOSA WEST | PRY SCHOOL, ILOBA | 520 | **612** | +92 | added | 2026-11-08 |

| `03-31-02-053` | AKWA IBOM | UYO | OPEN SPACE,UNIUYO SNR STAFF CLUB, UNIUYO MAIN CAMPUS | 41 | **78** | +37 | added | 2026-11-08 |

| `06-01-10-009` | BAYELSA | BRASS | S.S. OTUO OPEN SPACE | 1034 | **1210** | +176 | added | 2026-11-08 |

| `17-22-10-006` | JIGAWA | MIGA | ZAREKU MAKWALLA/ZAREKU P.S  II | 501 | **592** | +91 | added | 2026-11-08 |

| `04-03-14-002` | ANAMBRA | ANAMBRA EAST | AKWETE PUBLIC SQUARE II | 470 | **524** | +54 | added | 2026-11-08 |

| `18-02-09-025` | KADUNA | CHIKUN | MAHUTA I/ K/G SARKI | 1287 | **1274** | -13 | added | 2026-11-08 |

| `31-13-07-002` | PLATEAU | PANKSHIN | KAPIL | 493 | **503** | +10 | added | 2026-11-08 |

| `11-13-12-001` | EBONYI | ONICHA | AMAKPORO PRIMARY SCHOOL | 750 | **773** | +23 | added | 2026-11-08 |

| `17-16-01-012` | JIGAWA | KAUGAMA | JSS KANTAMARI | 452 | **504** | +52 | added | 2026-11-08 |

| `36-07-09-076` | ZAMFARA | GUSAU | U.B.E LOW COST PRI. SCHOOL VII | 601 | **751** | +150 | added | 2026-11-08 |

| `09-12-10-008` | CROSS RIVER | OBANLIKU | PRIMARY SCHOOL BAGGA | 658 | **677** | +19 | added | 2026-11-08 |

| `30-03-05-003` | OYO | ATIBA | OKANSA | 748 | **735** | -13 | added | 2026-11-08 |

| `01-15-03-034` | ABIA | UMUAHIA NORTH | OGBAGU VILLAGE  SQUARE | 180 | **183** | +3 | added | 2026-11-08 |

| `33-10-04-009` | SOKOTO | KWARE | BALKORI, PRI. SCH. | 810 | **857** | +47 | added | 2026-11-08 |

| `32-02-11-011` | RIVERS | AHOADA EAST | MARKET SQUARE  ODIEMERENYI | 166 | **257** | +91 | added | 2026-11-08 |

| `34-07-07-017` | TARABA | JALINGO | KOFAR TALLAFI V, KUSA DA KOFAR AHMADU NAI | 68 | **193** | +125 | added | 2026-11-08 |

| `12-02-07-025` | EDO | EGOR | OPEN SPACE BY MONTESSORI NUR/PRIMARY SCHOOL / SECONDARY USELU | 275 | **372** | +97 | added | 2026-11-08 |

| `20-12-11-004` | KATSINA | DUTSIN-MA | DARAWA PRI.SCHOOL | 822 | **934** | +112 | added | 2026-11-08 |

| `14-05-01-016` | ENUGU | ENUGU SOUTH | PRIMARY SCHOOL, AMECHI IX | 810 | **805** | -5 | added | 2026-11-08 |

| `34-16-08-014` | TARABA | ZING | YEDC, DISTRICT OFFICE | 152 | **169** | +17 | added | 2026-11-08 |

| `34-05-07-006` | TARABA | GASSOL | GARIN KABO, GARIN KABO | 469 | **476** | +7 | added | 2026-11-08 |

| `31-05-14-009` | PLATEAU | JOS NORTH | ST. THERESA BOYS SCHOOL | 658 | **665** | +7 | added | 2026-11-08 |

| `26-06-11-034` | NIGER | CHANCHAGA | NEW TUNGA PRIMARY SCHOOL | 578 | **657** | +79 | added | 2026-11-08 |

| `29-11-06-008` | OSUN | IFE CENTRAL | IFE GIRLS HIGH SCHOOL | 965 | **974** | +9 | added | 2026-11-08 |

| `13-09-10-008` | EKITI | IJERO | AAFIN - PALACE AREA | 706 | **792** | +86 | added | 2026-11-08 |

| `18-19-02-001` | KADUNA | SABON GARI | AKENZUA HALL/ POLICE GATE ABU | 683 | **696** | +13 | added | 2026-11-08 |

| `24-12-13-002` | LAGOS | IKORODU | IN FRONT OF 11, EBUTE STREET, IJEDE | 857 | **868** | +11 | added | 2026-11-08 |

| `18-23-07-025` | KADUNA | ZARIA | MARAFA RD/K/G BABA SHANI | 161 | **239** | +78 | added | 2026-11-08 |

| `36-04-04-007` | ZAMFARA | BUKKUYUM | KADO / YAR RUNFA | 500 | **500** | 0 | added | 2026-11-08 |

| `32-06-03-024` | RIVERS | ASARI-TORU | THEOPHILUS/OBERI, ABBEY | 221 | **239** | +18 | added | 2026-11-08 |

| `04-10-07-099` | ANAMBRA | IDEMILI NORTH | ST. CHARLES BOROMMEO N/P SCHOOL ODUME | 179 | **318** | +139 | added | 2026-11-08 |

| `31-12-10-010` | PLATEAU | MIKANG | LEA GANG | 75 | **169** | +94 | added | 2026-11-08 |

| `19-42-05-014` | KANO | UNGOGO | TUDUN BARIKI | 610 | **644** | +34 | added | 2026-11-08 |

| `35-04-07-019` | YOBE | FIKA | NGALDA, PRIMARY HEALTH CARE A | 378 | **627** | +249 | added | 2026-11-08 |

| `08-16-10-011` | BORNO | KONDUGA | KA'ALMARI, KA'ALMARI I | 253 | **259** | +6 | added | 2026-11-08 |

| `16-25-01-001` | IMO | OWERRI MUNICIPAL | HOUSING ESTATE PRIMARY SCHOOL I | 959 | **1008** | +49 | added | 2026-11-08 |

| `20-22-01-001` | KATSINA | KURFI | TSAURI 'A' PRIMARY SCHOOL | 750 | **784** | +34 | added | 2026-11-08 |

| `27-15-04-015` | OGUN | OBAFEMI/OWODE | ANG. SCHOOL,  SEMORE  I | 152 | **190** | +38 | added | 2026-11-08 |

| `08-04-04-008` | BORNO | BAYO | DAMPALA PRIMARY SCHOOL | 129 | **134** | +5 | added | 2026-11-08 |

| `18-07-03-019` | KADUNA | JEMA'A | AWOK / KADUWAN VILLAGE SQUARE | 383 | **400** | +17 | added | 2026-11-08 |

| `31-10-05-003` | PLATEAU | LANGTANG SOUTH | MABUDI VIEWING CENTER I | 1297 | **1242** | -55 | added | 2026-11-08 |

| `25-07-11-006` | NASARAWA | KOKONA | RUWAN DOMA | 300 | **815** | +515 | added | 2026-11-08 |

| `10-25-08-007` | DELTA | WARRI SOUTH  WEST | OBIAJA  GBASAN  TOWN  HALL | 488 | **495** | +7 | added | 2026-11-08 |

| `16-12-01-022` | IMO | NGOR OKPALA | OPEN SPACE BY UMUODUGWU PUBLIC PUMP AMALA | 364 | **387** | +23 | added | 2026-11-08 |

| `28-02-03-008` | ONDO | AKOKO NORTH WEST | AFFA 1, COURT HALL NEW GARAGE | 412 | **459** | +47 | added | 2026-11-08 |

| `28-13-09-033` | ONDO | ODIGBO | COMMUNITY HEALTH CENTRE, TEMIDIRE | 80 | **78** | -2 | added | 2026-11-08 |

| `23-08-10-033` | KWARA | ILORIN-WEST | OPEN SPACE OPP C.A.C TAIWO ROAD | 28 | **121** | +93 | added | 2026-11-08 |

| `14-04-05-001` | ENUGU | ENUGU NORTH | COLLIERY PLAY GROUND I | 209 | **208** | -1 | added | 2026-11-08 |

| `02-10-03-004` | ADAMAWA | MADAGALI | GHANTSA/ GHANTSA PRY. SCH. | 567 | **649** | +82 | added | 2026-11-08 |

| `15-05-09-019` | GOMBE | FUNAKAYE | UNG. BAUCH TRANSFORMER | 57 | **101** | +44 | added | 2026-11-08 |

| `20-13-08-018` | KATSINA | FASKARI | BILBIS S/GARI KOFAR GIDAN MAI GARI | 1031 | **1031** | 0 | added | 2026-11-08 |

| `03-16-09-002` | AKWA IBOM | ITU | TOWN HALL, IKOT OBIO ENANG | 750 | **878** | +128 | added | 2026-11-08 |

| `04-17-06-010` | ANAMBRA | ONITSHA-NORTH | OGBOLI/OBOLI ROAD PLAY GROUND II | 614 | **613** | -1 | added | 2026-11-08 |

| `31-02-01-038` | PLATEAU | BASSA | KITAKIBU | 142 | **307** | +165 | added | 2026-11-08 |

| `05-02-01-037` | BAUCHI | BAUCHI | KOFAR INSPECTOR BENI | 35 | **73** | +38 | added | 2026-11-08 |

| `29-24-09-002` | OSUN | OBOKUN | ESA-ODO MARKET SQUARE | 643 | **758** | +115 | added | 2026-11-08 |

| `10-13-03-024` | DELTA | OKPE | OPEN SPACE BY POULTRY JUNCTION, OKUOKOKO | 137 | **187** | +50 | added | 2026-11-08 |

| `29-13-01-017` | OSUN | IFE EAST | OLAGUNSOYE OYINLOLA MODEL PRY SCH, ILOROMU QRTS, ORANFE | 409 | **660** | +251 | added | 2026-11-08 |

| `08-16-10-002` | BORNO | KONDUGA | BULABULIN NGAU. DIS ,BULABULIN NGAU. DIS. | 276 | **281** | +5 | added | 2026-11-08 |

| `20-04-03-014` | KATSINA | BAURE | DOKI B  KOFAR MAIGARI | 349 | **349** | 0 | added | 2026-11-08 |

| `21-05-05-004` | KEBBI | BAGUDO | BAKUBE/BAITINGA (B) | 750 | **788** | +38 | added | 2026-11-08 |

| `20-08-05-007` | KATSINA | DANJA | KAURAN FAWA NEAR M/UNG.HOUSE | 514 | **524** | +10 | added | 2026-11-08 |

| `30-08-06-014` | OYO | IBADAN NORTH WEST | OPPOSITE ALANU NURSERY SCHOOL, ABEBI | 820 | **896** | +76 | added | 2026-11-08 |

| `18-07-12-017` | KADUNA | JEMA'A | JATAU MAZA / JATAU MAZA TATAU | 395 | **396** | +1 | added | 2026-11-08 |

| `22-19-01-007` | KOGI | OMALA | NEAR USMAN AKUTA'S HOUSE OLOMALA III | N/A | **892** | N/A | added | 2026-11-08 |

| `21-11-02-007` | KEBBI | JEGA | SHIYAR KAURA, DANGAMAJI | 965 | **995** | +30 | added | 2026-11-08 |

| `04-12-02-002` | ANAMBRA | IHIALA | NDIEZIKE P/S | 1062 | **1092** | +30 | added | 2026-11-08 |

| `12-02-10-063` | EDO | EGOR | B.D.P.A POLICE POST UGBOWO I | 181 | **249** | +68 | added | 2026-11-08 |

| `20-29-10-001` | KATSINA | MUSAWA | KUNTURYA - KUNTURYA PRI.SCHOOL | 635 | **646** | +11 | added | 2026-11-08 |

| `24-11-07-005` | LAGOS | IKEJA | ALONG FOLAWEWO ST. | 509 | **516** | +7 | added | 2026-11-08 |

| `18-17-11-001` | KADUNA | LERE | KAKUMU/ K/GIDAN MAIUNGUAW | 679 | **734** | +55 | added | 2026-11-08 |

| `27-09-01-021` | OGUN | IJEBU NORTH | OPEN SPACE IN FRONT OF MAGISTRATE COURT | 117 | **163** | +46 | added | 2026-11-08 |

| `01-15-03-016` | ABIA | UMUAHIA NORTH | GOVERNMENT COLLEGE - GOVERNMENT COLLEGE | 1129 | **1133** | +4 | added | 2026-11-08 |

| `32-22-07-063` | RIVERS | PORT HARCOURT | OPEN SPACE FIRE SERVICE | 58 | **76** | +18 | added | 2026-11-08 |

| `31-05-05-026` | PLATEAU | JOS NORTH | PUMP STREET | 36 | **61** | +25 | added | 2026-11-08 |

| `24-03-01-046` | LAGOS | ALIMOSHO | FRONT OF 14, AKOWONJO STREET | 605 | **570** | -35 | added | 2026-11-08 |

| `08-21-10-075` | BORNO | MAIDUGURI M. C. | RAMAT STAFF QUARTERS II | 190 | **192** | +2 | added | 2026-11-08 |

| `22-05-05-005` | KOGI | DEKINA | OKABO OPEN SPACE | 899 | **946** | +47 | added | 2026-11-08 |

| `24-04-11-036` | LAGOS | AMUWO-ODOFIN | END OF 21 ROAD | 925 | **893** | -32 | added | 2026-11-08 |

| `24-05-04-031` | LAGOS | APAPA | BESIDE PELEWURA CRESCENT/CAULCRICK ROAD | 750 | **910** | +160 | added | 2026-11-08 |

| `18-10-01-062` | KADUNA | KADUNA SOUTH | UNGUWAN KWADI BY UNGUWA | 77 | **101** | +24 | added | 2026-11-08 |

| `20-20-04-002` | KATSINA | KANKIA | JIGAWA - JIGAWA PRI.SCHOOL | 535 | **544** | +9 | added | 2026-11-08 |

| `01-09-08-013` | ABIA | OBINGWA | AGBURUIKE   II   -   AGBURUIKE   VILLAGE SQAURE | 357 | **369** | +12 | added | 2026-11-08 |

| `04-08-06-010` | ANAMBRA | DUNUKOFIA | AKWETE SEC. SCHOOL III | 356 | **395** | +39 | added | 2026-11-08 |

| `32-12-06-003` | RIVERS | GOKANA | C.S.S. K-DERE II, ZIZI/NOR I | 621 | **642** | +21 | added | 2026-11-08 |

| `37-06-01-052` | FCT | MUNICIPAL | 1. AREA 1 SEC. 1 AREA 1 PRIMARY SCHOOL | 31 | **43** | +12 | added | 2026-11-08 |

| `03-31-11-006` | AKWA IBOM | UYO | PRY SCH, IBA OKU | 750 | **769** | +19 | added | 2026-11-08 |

| `03-31-10-019` | AKWA IBOM | UYO | OPEN SPACE BY UNIUYO TEACHING HOSPITAL GATE/ NUNG EDIENE | 214 | **390** | +176 | added | 2026-11-08 |

| `04-12-11-005` | ANAMBRA | IHIALA | UMUATUEGWU P/S | 722 | **817** | +95 | added | 2026-11-08 |

| `14-08-17-011` | ENUGU | IGBO EZE NORTH | AGU-EGO UMUADOGWA | 309 | **317** | +8 | added | 2026-11-08 |

| `26-06-01-013` | NIGER | CHANCHAGA | KOFAR DANJUMA | 750 | **732** | -18 | added | 2026-11-08 |

| `34-02-02-028` | TARABA | BALI | MOTOR PARK GATE | 220 | **265** | +45 | added | 2026-11-08 |

| `08-15-08-011` | BORNO | KALA BALGE | SABKARA | 857 | **901** | +44 | added | 2026-11-08 |

| `19-18-04-035` | KANO | GWALE | SARARIN AWAISU PRI. SCH.. IV ABDULLAHI SUKA ISLAMIYYA IX | 27 | **92** | +65 | added | 2026-11-08 |

| `06-05-02-002` | BAYELSA | OGBIA | AGOSUAN - OTUOKPOTI | 750 | **838** | +88 | added | 2026-11-08 |

| `24-05-10-033` | LAGOS | APAPA | ADEKUNLE-DEEN ST./FASSY-CLOSE/ADESHINA STR. | 719 | **693** | -26 | added | 2026-11-08 |

| `36-07-02-036` | ZAMFARA | GUSAU | KATSAURA XX/ G/ SARKIN GUUSAU VI/T/SHIP 1 MODEL PRI. SH | 184 | **229** | +45 | added | 2026-11-08 |

| `18-10-06-046` | KADUNA | KADUNA SOUTH | KW 10 GWARZO ROAD | 46 | **71** | +25 | added | 2026-11-08 |

| `07-19-11-004` | BENUE | OTUKPO | ONDO IPEPE PRIMARY SCH. SCH COMP | 879 | **902** | +23 | added | 2026-11-08 |

| `37-03-06-015` | FCT | GWAGWALADA | UNGWAN DOSHI SETTLEMENT BEFORE PAIKO TOWN | 185 | **433** | +248 | added | 2026-11-08 |

| `10-15-07-019` | DELTA | OSHIMILI - SOUTH | INFRONT OF BEDC OFFICE NNEBISI ROAD I | 65 | **188** | +123 | added | 2026-11-08 |

| `20-03-05-011` | KATSINA | BATSARI | UDA - K/G. MAIUNG | 406 | **405** | -1 | added | 2026-11-08 |

| `28-01-05-005` | ONDO | AKOKO NORTH EAST | CAC PRY SCH., AKERELE/BURAIMO/ASEWE, ST. MICHAELS CAC PRY. SCH. ILEPA | 1094 | **1156** | +62 | added | 2026-11-08 |

| `32-22-19-011` | RIVERS | PORT HARCOURT | DEDE HALL | 664 | **666** | +2 | added | 2026-11-08 |

| `34-13-10-003` | TARABA | USSA | LUMBU YAUSSA, LUMBU YAUSSA PRIMARY SCHOOL | 1179 | **1235** | +56 | added | 2026-11-08 |

| `21-07-09-013` | KEBBI | BUNZA | GIDAN RUWA SHIYAR LIMAN TUNGA | 247 | **353** | +106 | added | 2026-11-08 |

| `23-11-10-005` | KWARA | KAIAMA | KARO CAMP MARKET SQUARE | 750 | **1053** | +303 | added | 2026-11-08 |

| `13-09-07-001` | EKITI | IJERO | AAFIN - TOWN HALL ODO - OWA | 440 | **459** | +19 | added | 2026-11-08 |

| `19-31-03-055` | KANO | NASARAWA | GWAGWARWA PHC GAWUNA I | 31 | **51** | +20 | added | 2026-11-08 |

| `16-21-01-007` | IMO | ORLU | UBAHA SQ. OKPORO | 590 | **597** | +7 | added | 2026-11-08 |

| `02-20-06-019` | ADAMAWA | YOLA NORTH | STATE POLY III | 951 | **920** | -31 | added | 2026-11-08 |

| `07-18-09-001` | BENUE | OKPOKWU | ONO AI-DOGODO MARKET SQUARE - AI-DOGODO | 511 | **517** | +6 | added | 2026-11-08 |

| `05-16-04-002` | BAUCHI | SHIRA | UNGUWAR MUSA,   BAKIN TASHA | 534 | **577** | +43 | added | 2026-11-08 |

| `14-12-07-017` | ENUGU | NKANU WEST | RIVER-SIDE PRIMARY SCHOOL II | 226 | **255** | +29 | added | 2026-11-08 |

| `07-13-01-022` | BENUE | MAKURDI | TSE AMELLA - TSE AMELLA (OPEN SPACE) | 486 | **570** | +84 | added | 2026-11-08 |

| `33-04-07-012` | SOKOTO | GADA | GIDAN RABAMI | 401 | **455** | +54 | added | 2026-11-08 |

| `11-07-08-009` | EBONYI | IKWO | C.P.S UDUKU ENYI | 26 | **343** | +317 | added | 2026-11-08 |

| `03-06-01-002` | AKWA IBOM | ETIM EKPO | VILLAGE SQUARE, UTU IKOT EBORO | 750 | **778** | +28 | added | 2026-11-08 |

| `11-02-04-004` | EBONYI | AFIKPO NORTH | UHERE VILLAGE SQUARE | 725 | **901** | +176 | added | 2026-11-08 |

| `11-09-03-001` | EBONYI | IVO | AKANU PLAY GROUND | 851 | **948** | +97 | added | 2026-11-08 |

| `24-01-06-003` | LAGOS | AGEGE | 17, ODEKU STREET | 417 | **490** | +73 | added | 2026-11-08 |

| `25-08-13-012` | NASARAWA | LAFIA | PRIMARY HEALTH CARE CLINIC | 306 | **376** | +70 | added | 2026-11-08 |

| `24-07-01-011` | LAGOS | EPE | END OF AMOYINBO ST. | 175 | **178** | +3 | added | 2026-11-08 |

| `14-09-14-011` | ENUGU | IGBO EZE SOUTH | OTOBO ETITI | 36 | **89** | +53 | added | 2026-11-08 |

| `07-05-04-010` | BENUE | GBOKO | GBOKO SOUTH - NR ORAKOMBO COMP. | 622 | **609** | -13 | added | 2026-11-08 |

| `25-03-09-020` | NASARAWA | DOMA | UNG. MALLAM ABUBAKAR T. AGABI -OP | 613 | **616** | +3 | added | 2026-11-08 |

| `31-11-07-004` | PLATEAU | MANGU | DOSS/FEBAS/KASSA  11 | 646 | **660** | +14 | added | 2026-11-08 |

| `37-06-05-181` | FCT | MUNICIPAL | OPPOSITE DIAMOND/ACCESS BANK, KADO BIMKO | 76 | **96** | +20 | added | 2026-11-08 |

| `09-06-01-005` | CROSS RIVER | BIASE | PLAYGROUND, ABREDANG | 724 | **743** | +19 | added | 2026-11-08 |

| `19-41-02-010` | KANO | TUDUN WADA | KAFI - TASHAR MANGWARO | 311 | **320** | +9 | added | 2026-11-08 |

| `17-10-10-006` | JIGAWA | GURI | TAKAZZA | 750 | **765** | +15 | added | 2026-11-08 |

| `29-12-01-003` | OSUN | IFEDAYO | ST. STEPHEN SCHOOL, ARAROMI | 780 | **986** | +206 | added | 2026-11-08 |

| `33-02-08-011` | SOKOTO | BODINGA | SHIYAR MARAFA, SHIYAR MARAFA | 378 | **509** | +131 | added | 2026-11-08 |

| `12-12-02-016` | EDO | OREDO | ELEMA  II , GREATER TOMORROW SEC. SCHOOL   II | 799 | **822** | +23 | added | 2026-11-08 |

| `16-17-07-019` | IMO | OGUTA | MAGISTRATE COURT OGUTA | 13 | **60** | +47 | added | 2026-11-08 |

| `14-04-08-013` | ENUGU | ENUGU NORTH | ENUGU CAMPUS III | 1053 | **1043** | -10 | added | 2026-11-08 |

| `01-02-03-047` | ABIA | ABA SOUTH | ABAUKWU VIILAGE HALL IV | 66 | **79** | +13 | added | 2026-11-08 |

| `20-06-10-001` | KATSINA | CHARANCHI | KUNATAU K/G MAI UNGUWA | 368 | **416** | +48 | added | 2026-11-08 |

| `24-10-02-028` | LAGOS | IFAKO-IJAYE | 50, PA ALAO STR. OFF IJU ROAD, BY SKYE BANK | 51 | **81** | +30 | added | 2026-11-08 |

| `10-19-03-008` | DELTA | UGHELLI NORTH | ADEJARHO/IMODJE/ITIVE HALL | 703 | **722** | +19 | added | 2026-11-08 |

| `36-01-08-004` | ZAMFARA | ANKA | KEYA/GIDAN HAKIMI | 418 | **437** | +19 | added | 2026-11-08 |

| `27-14-09-018` | OGUN | IPOKIA | OPEN SPACE AT OLORUNDA JUNCTION | 48 | **173** | +125 | added | 2026-11-08 |

| `34-14-02-025` | TARABA | WUKARI | ST.MARY'S PRIMARY SCHOOL II | 74 | **134** | +60 | added | 2026-11-08 |

| `16-11-03-005` | IMO | MBAITOLI | OBASAMANWU II SQUARE | 526 | **532** | +6 | added | 2026-11-08 |

| `12-06-05-008` | EDO | ESAN WEST | UJEME - UJEME PRIMARY SCHOOL II | 1161 | **1449** | +288 | added | 2026-11-08 |

| `05-13-05-002` | BAUCHI | KIRFI | DEWU,    DEWU PRIMARY SCHOOL II | 622 | **752** | +130 | added | 2026-11-08 |

| `24-03-04-260` | LAGOS | ALIMOSHO | IN FRONT 4, TITI OWOLABI CLOSE, IDIMU | 446 | **442** | -4 | added | 2026-11-08 |

| `03-05-06-011` | AKWA IBOM | ESSIEN UDIM | COUNCIL HALL, IDUNG AFA, IKOT UMOESSIEN | 562 | **559** | -3 | added | 2026-11-08 |

| `30-13-02-004` | OYO | IBARAPA NORTH | OKE-OGUN II | 391 | **470** | +79 | added | 2026-11-08 |

| `35-05-05-006` | YOBE | FUNE | DAURA , PRI. SCH. | 954 | **985** | +31 | added | 2026-11-08 |

| `02-12-07-016` | ADAMAWA | MAYO - BELWA | SEBORE AHMADU II/ SEBORE PRY. SCH. | 563 | **577** | +14 | added | 2026-11-08 |

| `22-20-05-002` | KOGI | YAGBA EAST | OTUN-IDA, ODO ALO OTUN OPEN SPACE | 990 | **1519** | +529 | added | 2026-11-08 |

| `05-02-11-051` | BAUCHI | BAUCHI | EL - DUNIYA HOPTEL,    EL - DUNIYA HOTEL | 627 | **620** | -7 | added | 2026-11-08 |

| `25-11-03-018` | NASARAWA | OBI | KOFAR ALI ARIKA OPEN SPACE | 894 | **904** | +10 | added | 2026-11-08 |

| `24-16-11-019` | LAGOS | MUSHIN | ISHAGA/AJEGUNLE JUNCTION I | 421 | **426** | +5 | added | 2026-11-08 |

| `05-20-08-020` | BAUCHI | ZAKI | OGERE SANDIGALU | 183 | **186** | +3 | added | 2026-11-08 |

| `08-21-10-065` | BORNO | MAIDUGURI M. C. | K.I.C.O.E II | 483 | **471** | -12 | added | 2026-11-08 |

| `13-04-04-001` | EKITI | EKITI WEST | NEAR OLOGBEHIN COMP, IGBEHIN   I | 402 | **419** | +17 | added | 2026-11-08 |

| `31-05-05-001` | PLATEAU | JOS NORTH | ADEBAYO STREET | 633 | **644** | +11 | added | 2026-11-08 |

| `08-27-04-009` | BORNO | SHANI | MAI UNGUWA WABI , KAULE | 413 | **512** | +99 | added | 2026-11-08 |

| `31-17-06-028` | PLATEAU | WASE | PHC BWARAT | 277 | **300** | +23 | added | 2026-11-08 |

| `18-10-05-023` | KADUNA | KADUNA SOUTH | Q4 GORA STREET | 750 | **748** | -2 | added | 2026-11-08 |

| `19-12-08-017` | KANO | FAGGE | DAN WAIRE P.S. II | 859 | **841** | -18 | added | 2026-11-08 |

| `22-05-12-019` | KOGI | DEKINA | OPEN SPACE, AJOMOCHEJA | 95 | **163** | +68 | added | 2026-11-08 |

| `23-10-07-006` | KWARA | ISIN | LGEA SCH  IJI-ISIN II | 488 | **542** | +54 | added | 2026-11-08 |

| `20-14-06-004` | KATSINA | FUNTUA | UNG. BALA MA,AJI UNG. BALA MA'AJI | 834 | **857** | +23 | added | 2026-11-08 |

| `24-02-11-026` | LAGOS | AJEROMI/IFELODUN | 8, LAYODE STREET | 675 | **700** | +25 | added | 2026-11-08 |

| `16-27-07-033` | IMO | OWERRI WEST | UMUMBAZU VILL. HALL NEKEDE | 457 | **730** | +273 | added | 2026-11-08 |

| `20-24-06-014` | KATSINA | MAI'ADUA | GALADIMAWA DISP. | 119 | **153** | +34 | added | 2026-11-08 |

| `14-08-13-007` | ENUGU | IGBO EZE NORTH | UMURA  U.P.S I | 442 | **458** | +16 | added | 2026-11-08 |

| `12-07-08-001` | EDO | ETSAKO CENTRAL | ALAOYE PRY. SCH. (OLD SITE),  UGBAGO/UDABA I | 556 | **554** | -2 | added | 2026-11-08 |

| `12-09-07-001` | EDO | ETSAKO  WEST | EKIODE MOMUDU COL. AREA - MOMODU COLLEGE | 331 | **358** | +27 | added | 2026-11-08 |

| `05-07-10-005` | BAUCHI | GAMAWA | KACHAKAWARI,    KACHAKAWARI  VILLAGE | 370 | **379** | +9 | added | 2026-11-08 |

| `11-11-10-007` | EBONYI | OHAOZARA | AKPU AGWU VILLAGE SQUARE | 695 | **868** | +173 | added | 2026-11-08 |

| `08-21-06-003` | BORNO | MAIDUGURI M. C. | BULAMA ALH.  KANGADI | 514 | **520** | +6 | added | 2026-11-08 |

| `08-13-11-041` | BORNO | JERE | PROFESSORS QUARTERS GATE | 64 | **85** | +21 | added | 2026-11-08 |

| `04-07-11-001` | ANAMBRA | AWKA SOUTH | COMMUNITY PRY. SCHOOL I | 1116 | **1117** | +1 | added | 2026-11-08 |

| `26-15-08-010` | NIGER | MARIGA | KASUWAN KANYA | 252 | **254** | +2 | added | 2026-11-08 |

| `24-10-11-003` | LAGOS | IFAKO-IJAYE | 9, GBELEYI STREET,  ALAKUKO | 1696 | **1692** | -4 | added | 2026-11-08 |

| `12-16-01-017` | EDO | OWAN EAST | OPEN SPACE GENERAL HOSPITAL AFUZE | 40 | **127** | +87 | added | 2026-11-08 |

| `30-20-06-009` | OYO | LAGELU | MODUPE VILLAGE | 145 | **169** | +24 | added | 2026-11-08 |

| `31-02-05-016` | PLATEAU | BASSA | ANGUWAN MISSION  II | 1019 | **1001** | -18 | added | 2026-11-08 |

| `24-10-01-012` | LAGOS | IFAKO-IJAYE | 61, ABEOKUTA ST. OGBA | 654 | **700** | +46 | added | 2026-11-08 |

| `01-01-07-007` | ABIA | ABA NORTH | GULF COURSE PRIMARY SCHOOL  - SCHOOL PREMISES VII | 471 | **463** | -8 | added | 2026-11-08 |

| `37-06-06-057` | FCT | MUNICIPAL | 2. IDU VILLAGE PRIMARY SCHOOL II | 671 | **667** | -4 | added | 2026-11-08 |

| `26-14-02-015` | NIGER | MAGAMA | BARIKI D. SALKA | 807 | **863** | +56 | added | 2026-11-08 |

| `03-31-06-041` | AKWA IBOM | UYO | NUNG EFA HALL. | 89 | **209** | +120 | added | 2026-11-08 |

| `28-06-07-002` | ONDO | AKURE SOUTH | ARAKALE - 16B IJEMIKINS HOUSE | 915 | **890** | -25 | added | 2026-11-08 |

| `30-13-05-014` | OYO | IBARAPA NORTH | ARA OJE OKE OLA | 210 | **234** | +24 | added | 2026-11-08 |

| `22-07-06-010` | KOGI | IDAH | AGRIC FARM CENTRE | 54 | **195** | +141 | added | 2026-11-08 |

| `11-07-11-017` | EBONYI | IKWO | EBE PLAY GROUND | 45 | **99** | +54 | added | 2026-11-08 |

| `08-11-06-012` | BORNO | GWOZA | AHMADU DUDU | 476 | **490** | +14 | added | 2026-11-08 |

| `27-05-06-013` | OGUN | EGBADO SOUTH | ST. JAMES SCHOOL R.M. II OKE ODAN II | 362 | **439** | +77 | added | 2026-11-08 |

| `34-12-01-013` | TARABA | TAKUM | BETE CENTRALPRIMARY SCHOOL | 79 | **271** | +192 | added | 2026-11-08 |

| `21-20-05-020` | KEBBI | YAURI | POST OFFICE | 472 | **552** | +80 | added | 2026-11-08 |

| `29-21-11-001` | OSUN | IREWOLE | IREWOLE MATERNITY, EBUNLA VILLAGE | 278 | **408** | +130 | added | 2026-11-08 |

| `06-08-02-013` | BAYELSA | YENAGOA | C.S.S. FAMGBE I | 47 | **68** | +21 | added | 2026-11-08 |

| `27-03-03-050` | OGUN | ADO ODO-OTA | OPEN SPACE AT BAMISHEBI/ OSHINLOWO STREET BESIDE OXFORD SCHOOL I.L.O | 172 | **296** | +124 | added | 2026-11-08 |

| `16-09-08-006` | IMO | ISIALA MBANO | COMM. SCH. UMUOPARA | 514 | **517** | +3 | added | 2026-11-08 |

| `36-02-03-012` | ZAMFARA | BAKURA | PRIMARY HEALTH CARE DAMRI | 133 | **156** | +23 | added | 2026-11-08 |

| `32-02-10-004` | RIVERS | AHOADA EAST | TOWN HALL I, IHUOWO | 394 | **423** | +29 | added | 2026-11-08 |

| `12-14-01-006` | EDO | OVIA NORTH EAST | IKALADERHAN PRIMARY SCHOOL III | 505 | **608** | +103 | added | 2026-11-08 |

| `20-16-04-021` | KATSINA | JIBIA | KG ZUWAIRA (O/S) | 2 | **146** | +144 | added | 2026-11-08 |

| `19-02-05-010` | KANO | ALBASU | SHASHUWAI II | 1001 | **1012** | +11 | added | 2026-11-08 |

| `26-05-03-019` | NIGER | BOSSO | OPEN SPACE FRONT OF RIVER BASIN GATE | 330 | **377** | +47 | added | 2026-11-08 |

| `11-13-02-004` | EBONYI | ONICHA | OBUNOR PLAY GROUND | 750 | **797** | +47 | added | 2026-11-08 |

| `04-10-09-018` | ANAMBRA | IDEMILI NORTH | ILO OGBE OZALLA II | 410 | **417** | +7 | added | 2026-11-08 |

| `26-25-06-007` | NIGER | WUSHISHI | KUTUNKU | 857 | **1073** | +216 | added | 2026-11-08 |

| `19-27-01-015` | KANO | KURA | RAKAUNA II | 536 | **574** | +38 | added | 2026-11-08 |

| `09-02-03-003` | CROSS RIVER | AKAMKPA | AYIP EKU PLAYGROUND | 286 | **287** | +1 | added | 2026-11-08 |

| `01-04-13-003` | ABIA | BENDE | AMAMBA - AMAMBA VILLAGE HALL II | 780 | **852** | +72 | added | 2026-11-08 |

| `18-08-12-006` | KADUNA | KACHIA | GIDAN MAI KAI/ K/G SARKI | 627 | **646** | +19 | added | 2026-11-08 |

| `24-18-09-072` | LAGOS | OSHODI/ISOLO | JUNCTION OF OJEFIA CRESCENT/ STELLA ONWERE STR | 168 | **201** | +33 | added | 2026-11-08 |

| `32-22-20-095` | RIVERS | PORT HARCOURT | OZUBOKO VI IGBANIBO | 174 | **210** | +36 | added | 2026-11-08 |

| `05-11-09-009` | BAUCHI | JAMA'ARE | SHARABA,  PRIMARY SCHOOL | 261 | **271** | +10 | added | 2026-11-08 |

| `20-16-04-007` | KATSINA | JIBIA | UNG. LIMAN SHEHU I OPEN SPACE UNG. LIMAN | 874 | **873** | -1 | added | 2026-11-08 |

| `18-21-08-006` | KADUNA | SOBA | UNG. HAJJA/ K.G MAIANGUWA | 389 | **439** | +50 | added | 2026-11-08 |

| `29-06-06-002` | OSUN | BORIPE | R.C.M. ORORUWO       II | 731 | **871** | +140 | added | 2026-11-08 |

| `11-02-05-009` | EBONYI | AFIKPO NORTH | ITIM UKWU PRIMARY SCHOOL | 1169 | **1260** | +91 | added | 2026-11-08 |

| `05-02-09-009` | BAUCHI | BAUCHI | GWARBILLI, GWARBILLI | 317 | **514** | +197 | added | 2026-11-08 |

| `10-16-08-010` | DELTA | PATANI | 010 - BOLOU GBENE
II, BOLOU 
ANGIAMA | 5 | **24** | +19 | added | 2026-11-08 |

| `20-01-02-022` | KATSINA | BAKORI | BAKORI GARI IV FSA CLINIC (NEW) | 41 | **238** | +197 | added | 2026-11-08 |

| `30-33-08-015` | OYO | SURULERE | MARKET PRY HEALTH CENTRE | 536 | **770** | +234 | added | 2026-11-08 |

| `30-01-05-004` | OYO | AFIJIO | IJAYE OJUTAYE OPEN SPACE | 525 | **590** | +65 | added | 2026-11-08 |

| `17-18-04-009` | JIGAWA | KIRIKA SAMMA | MALINTA PRI. SCH./ MALINTA | 796 | **837** | +41 | added | 2026-11-08 |

| `19-17-08-001` | KANO | GEZAWA | AUJA RAWAR ALKALI, OPEN SPACE | 815 | **880** | +65 | added | 2026-11-08 |

| `02-18-05-002` | ADAMAWA | SONG | DALLOL | 478 | **475** | -3 | added | 2026-11-08 |

| `17-27-08-006` | JIGAWA | YANKWASHI | MAHAUYA NOMADIC SCH | 112 | **272** | +160 | added | 2026-11-08 |

| `24-19-01-032` | LAGOS | SOMOLU | BAILEY STREET BETWEEN HOUSE NO. 6 & 8 | 706 | **729** | +23 | added | 2026-11-08 |

| `04-19-07-016` | ANAMBRA | ORUMBA NORTH | NGENEUBE | 299 | **364** | +65 | added | 2026-11-08 |

| `19-26-09-007` | KANO | KUNCHI | GALADIMAWA C/GARI | 575 | **665** | +90 | added | 2026-11-08 |

| `33-16-11-018` | SOKOTO | SOKOTO NORTH | GIDAN DARE | 1161 | **1237** | +76 | added | 2026-11-08 |

| `03-09-03-003` | AKWA IBOM | IBESIKPO ASUTAN | MARKET SQUARE, NUNG UDOE | 750 | **822** | +72 | added | 2026-11-08 |

| `18-09-12-022` | KADUNA | KADUNA NORTH | DANMUSA ROAD/ K/GIDAN MR. ELIJAH | 496 | **525** | +29 | added | 2026-11-08 |

| `30-07-05-012` | OYO | IBADAN NORTH EAST | OPEN SPACE INFRONT CHIEF ADEOSUN'S HOUSE LABIRAN II | 132 | **152** | +20 | added | 2026-11-08 |

| `09-07-09-011` | CROSS RIVER | BOKI | PLAYGROUND,  EFFIAYONG | 711 | **768** | +57 | added | 2026-11-08 |

| `25-12-03-004` | NASARAWA | TOTO | KUNKE | 759 | **813** | +54 | added | 2026-11-08 |

| `01-08-10-012` | ABIA | ISUIKWUATO | ABSU PRIMARY SCHOOL II | 49 | **446** | +397 | added | 2026-11-08 |

| `04-12-09-002` | ANAMBRA | IHIALA | UMUOHI CEN. SCHOOL | 1327 | **1518** | +191 | added | 2026-11-08 |

| `15-06-03-015` | GOMBE | GOMBE | WAZIRI BOLARI, KOFAR ALI DOGO | 1047 | **1078** | +31 | added | 2026-11-08 |

| `26-10-02-016` | NIGER | KATCHA | KANGI MABA PRIMARY SCHOOL | 482 | **483** | +1 | added | 2026-11-08 |

| `19-30-08-006` | KANO | MINJIBIR | MAGARAWA TSUDARAI PRIMARY SCHOOL II | 112 | **235** | +123 | added | 2026-11-08 |

| `05-05-09-011` | BAUCHI | DARAZO | GANDUN,  KOFAR SARKI | 321 | **404** | +83 | added | 2026-11-08 |

| `05-06-09-006` | BAUCHI | DASS | DOGON - MAJE/KWAFA,   DOGON  MAJE | 491 | **506** | +15 | added | 2026-11-08 |

| `33-22-05-010` | SOKOTO | WURNO | GIDAN MODI | 397 | **466** | +69 | added | 2026-11-08 |

| `18-23-06-018` | KADUNA | ZARIA | BAREBARI I/ K/G BABA DOKO | 750 | **763** | +13 | added | 2026-11-08 |

| `15-10-09-006` | GOMBE | SHONGOM | LAKENTURUM / KULLUNG, KOFAR J/ KULLUNG | 554 | **617** | +63 | added | 2026-11-08 |

| `20-34-04-003` | KATSINA | ZANGO | SARA    / NABADE KOFAR DAGAU | 419 | **432** | +13 | added | 2026-11-08 |

| `06-03-04-008` | BAYELSA | KOLOKUMA/OPOKUMA | ODOWARI MARKET SQUARE | 395 | **484** | +89 | added | 2026-11-08 |

| `03-18-11-003` | AKWA IBOM | MKPAT ENIN | TOWN HALL, IBIAKU ESA EKPO | 776 | **870** | +94 | added | 2026-11-08 |

| `09-18-09-002` | CROSS RIVER | YALA | PLAY GROUND UHAKILU | 170 | **194** | +24 | added | 2026-11-08 |

| `06-05-04-022` | BAYELSA | OGBIA | OKIKI (2) - OKIKI TOWN | 168 | **179** | +11 | added | 2026-11-08 |

| `15-11-09-022` | GOMBE | YALMALTU/ DEBA | GARIN M. JIBRIL, KOFAR M. JIBRIL | 242 | **241** | -1 | added | 2026-11-08 |

| `20-02-04-014` | KATSINA | BATAGARAWA | SHAGUMBA - SHAGUMBA | 716 | **730** | +14 | added | 2026-11-08 |

| `05-10-02-018` | BAUCHI | ITAS/GADAU | LUTAI,   KOFAR FADA | 379 | **382** | +3 | added | 2026-11-08 |

| `26-22-14-002` | NIGER | SHIRORO | KUPE | 217 | **267** | +50 | added | 2026-11-08 |

| `01-02-07-002` | ABIA | ABA SOUTH | IGWEBUIKE-UMUAGBAI  SEC.SCHOOL II | 912 | **984** | +72 | added | 2026-11-08 |

| `30-32-10-019` | OYO | SAKI WEST | SANGOTE | 624 | **642** | +18 | added | 2026-11-08 |

| `07-22-10-006` | BENUE | USHONGO | LGEA SCHOOL, UKE-KPENGA | 475 | **532** | +57 | added | 2026-11-08 |

| `05-16-04-013` | BAUCHI | SHIRA | KAWANDI,   KOFAR JAURO | 392 | **587** | +195 | added | 2026-11-08 |

| `25-11-01-012` | NASARAWA | OBI | USULLA/PRI.SCHOOL | 820 | **858** | +38 | added | 2026-11-08 |

| `15-08-07-036` | GOMBE | KWAMI | DUMBONA,  DUNBONA | 478 | **478** | 0 | added | 2026-11-08 |

| `27-14-04-018` | OGUN | IPOKIA | ITA ODOJIGAN | 705 | **758** | +53 | added | 2026-11-08 |

| `34-05-06-008` | TARABA | GASSOL | DINYA KUMATU, DINYA KUMATU | 707 | **712** | +5 | added | 2026-11-08 |

| `19-40-10-004` | KANO | TSANYAWA | KWAHO | 524 | **531** | +7 | added | 2026-11-08 |

| `32-13-11-002` | RIVERS | IKWERRE | OMUOKWU VILLAGE SQUARE, OZUAHA II | 773 | **771** | -2 | added | 2026-11-08 |

| `30-20-12-003` | OYO | LAGELU | ST. JAMES SCHOOL, DAGBOLU | 366 | **416** | +50 | added | 2026-11-08 |

| `13-16-06-003` | EKITI | OYE | AT ILUGBO - ILUGBO | 404 | **430** | +26 | added | 2026-11-08 |

| `32-11-03-020` | RIVERS | ETCHE | UMUOGODO II | 750 | **792** | +42 | added | 2026-11-08 |

| `05-15-06-033` | BAUCHI | NINGI | JIMI DISPENSARY | 100 | **288** | +188 | added | 2026-11-08 |

| `17-02-05-013` | JIGAWA | BABURA | RATAYE PRI. SCH./RATAYE YAMMA | 467 | **534** | +67 | added | 2026-11-08 |

| `33-19-01-013` | SOKOTO | TANGAZA | GURAMI/B/KASUWA | 706 | **960** | +254 | added | 2026-11-08 |

| `32-13-09-013` | RIVERS | IKWERRE | OMUOBU B/F VILLAGE HALL, OMAGWA | 586 | **614** | +28 | added | 2026-11-08 |

| `24-11-02-062` | LAGOS | IKEJA | YAKOYO MARKET | 750 | **1152** | +402 | added | 2026-11-08 |

| `18-23-05-020` | KADUNA | ZARIA | MAKWALLA I/ K/G ISA | 554 | **580** | +26 | added | 2026-11-08 |

| `35-14-01-016` | YOBE | POTISKUM | MAZAGAM, MAZAGAM PRI. SCH. | 938 | **1011** | +73 | added | 2026-11-08 |

| `05-07-09-017` | BAUCHI | GAMAWA | BAKORI  BAKORI  VILLAGE | 592 | **657** | +65 | added | 2026-11-08 |

| `20-13-02-011` | KATSINA | FASKARI | UNG. SARKI KOFAR GIDAN MAI UNGUWA | 534 | **579** | +45 | added | 2026-11-08 |

| `20-26-05-007` | KATSINA | MANI | GUNKI - PRI.SCHOOL | 542 | **550** | +8 | added | 2026-11-08 |

| `13-09-01-005` | EKITI | IJERO | ELEMIKAN  - ELEMIKAN'S COMPOUND | 382 | **394** | +12 | added | 2026-11-08 |

| `04-12-03-006` | ANAMBRA | IHIALA | AMORKA COMM. HIGH SCHOOL II | 611 | **618** | +7 | added | 2026-11-08 |

| `19-41-05-006` | KANO | TUDUN WADA | NASSARAWAN JITA PRI. SCH | 465 | **475** | +10 | added | 2026-11-08 |

| `27-03-08-050` | OGUN | ADO ODO-OTA | MARKET SQUARE, IMISE, OWODE OTA | 219 | **476** | +257 | added | 2026-11-08 |

| `12-12-01-029` | EDO | OREDO | ISEKHERE I ,  UYIOSA PRY SCH. III | 793 | **771** | -22 | added | 2026-11-08 |


*(Verified polling units will appear above automatically when the auditor script is run.)*

---

## 🔍 Data Analysis & Integrity Flags

When auditing polling units, watch out for the following red flags to submit for INEC review:
1. **Unusual Spikes**: A 2027 registered voter count exceeding normal population growth rates (e.g. >30% growth compared to 2023 without corresponding demographic changes).
2. **Missing Polling Units**: Polling units that existed in 2023 but return `not_found` in 2027 without prior relocation notices.
3. **Severe Voter Drops**: Unexplained contraction of registered voters where population density is known to be stable.
4. **Corroboration Threshold**: NigeriaElects requires at least **5 corroborating submissions** per polling unit before establishing consensus.

