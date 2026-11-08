# INEC Polling Unit Voter Check & Audit Guide

INEC has restricted the amount of time each person can spend on its website, so we need as many people as possible to help with this exercise.

### Here’s what we’re doing:

We’re counting the number of registered voters in each polling unit for 2027 and comparing it with the number of registered voters in that same polling unit in 2023.

INEC won’t show us the full register, so we have to do this ourselves, one polling unit at a time.

---

## 📋 Manual Step-by-Step Instructions

Here’s how you can help. It takes just **60 seconds**!

* **STEP 1**: Go to this link ⤵️  
  [check.nigeriaelects.com](https://check.nigeriaelects.com)

* **STEP 2**: Copy the code generated where it says **“Your Polling Unit”**. It’s the code containing numbers and dashes (e.g. `24-01-01-001`).

* **STEP 3**: Go to the INEC website and scroll down to **“Find a Polling Unit”** (or go directly to [display.inecnigeria.org/find](https://display.inecnigeria.org/find)).  
  Paste the code you copied into the **PU Code** box and click **“Find”**.

* **STEP 4**: The polling unit information will appear, including the number of registered voters.  
  Copy **ONLY** the number of registered voters (the whole number, without the dashes or commas).

* **STEP 5**: Return to the first website, paste the number into the space provided for registered voters and click **Submit**.

**That’s all!**

See the attached video for a visual guide.

60 seconds of your time can help us build a clearer picture of what’s happening with our voters’ register.  
Please participate and share this with other Nigerians. The more people who help, the more polling units we can cover.

---

## 🤖 Automated Tool & Central Data Store

If you would like to run this automatically or store all verified records systematically:

1. **Automation Script**: [`scripts/inec_voter_auditor.mjs`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/scripts/inec_voter_auditor.mjs)
   - Runs in interactive mode (auto-copies PU codes to your clipboard, prompts for count, and submits).
   - Or runs in full autonomous mode if you pass your INEC session cookie (`--cookie <cookie>`).

2. **Master Audit Document**: [`INEC_POLLING_UNIT_AUDIT.md`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/INEC_POLLING_UNIT_AUDIT.md)
   - Contains real-time Markdown tables of all audited polling units.

3. **Data Records**:
   - CSV export: [`data/voter_records.csv`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/data/voter_records.csv)
   - JSON data: [`data/voter_records.json`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/data/voter_records.json)

To run the automated helper:
```powershell
node scripts/inec_voter_auditor.mjs
```
