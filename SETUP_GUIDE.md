# 🇳🇬 INEC Polling Unit Voter Auditor — Setup & Quickstart Guide

This guide explains how to set up and run the automated **INEC Polling Unit Voter Auditor** on any Windows, Mac, or Linux computer. 

With this tool, you can automatically audit hundreds of polling units across Nigeria in minutes, comparing the **2027 preliminary voters register** with the **2023 election register** and contributing verified records directly to the nationwide crowdsourced campaign at **[check.nigeriaelects.com](https://check.nigeriaelects.com)**.

---

## 🛠️ Step 1: Requirements (Takes 2 Minutes)

You only need **Node.js** (v20 or higher) installed on your computer.

1. Check if Node.js is already installed:
   * Open your terminal (**PowerShell** on Windows, or **Terminal** on Mac/Linux) and run:
     ```bash
     node -v
     ```
2. If it is not installed or says *command not found*:
   * Download and install the LTS version from **[nodejs.org](https://nodejs.org/)**.

---

## 📁 Step 2: Download the Files

Place these two items in a project folder (e.g. `C:\Users\YourName\Documents\VoterAudit`):

1. The script: [`scripts/inec_voter_auditor.mjs`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/scripts/inec_voter_auditor.mjs)
2. A configuration file named [`.env`](file:///c:/Users/CI-STAFF/Documents/RetailPOS/.env) in the root of the folder.

---

## 🔑 Step 3: Get Your INEC Session Cookie (30 Seconds)

INEC requires a signed-in account to view polling unit voter registers.

1. Open your browser and go to:  
   👉 **[display.inecnigeria.org/signin](https://display.inecnigeria.org/signin)**
2. Sign in with your email address or Google account.
3. Once you see the **"Find your polling unit"** screen:
   * Press **`F12`** on your keyboard (or right-click anywhere and click **Inspect**).
   * Click on the **Network** tab at the top of Developer Tools.
   * Refresh the page (**`F5`** or `Ctrl + R`).
   * Click on the request named **`session`** or **`find`** in the list.
   * On the right panel, make sure **Headers** is selected, then scroll down to **Request Headers**.
   * Locate the line starting with **`Cookie:`**, right-click it, and select **Copy value**.

---

## ⚙️ Step 4: Configure Your `.env` File

Open the [`.env`] file in your text editor (Notepad, VS Code, etc.) and paste your copied cookie:

```env
# Account 1 Cookie
INEC_COOKIE_1="paste_your_copied_cookie_here"

# Account 2 Cookie (Optional: for running a second terminal in parallel)
INEC_COOKIE_2=""
```

---

## 🚀 Step 5: Start Auditing!

Open your terminal in the project folder and run:

### Option A: Standard Autonomous Mode (Recommended)
```powershell
node scripts/inec_voter_auditor.mjs
```
The agent will:
1. Fetch assigned polling units from **NigeriaElects**.
2. Query **INEC's portal** directly in the background using your session.
3. Retrieve the live 2027 registered voter count.
4. Submit the count to NigeriaElects, calculate 2023 vs 2027 voter differences, and save every record.

### Option B: Run in Batches of 50
```powershell
node scripts/inec_voter_auditor.mjs --limit 50
```

### Option C: Run Two Terminals in Parallel (2× Speed 🚀)
If you have a second email account (e.g., work email or personal email):
1. Sign in to INEC using that second email in an Incognito window or different browser.
2. Paste that second cookie into `INEC_COOKIE_2=""` in your `.env`.
3. Open two separate terminals:
   * **Terminal 1**:
     ```powershell
     node scripts/inec_voter_auditor.mjs --worker 1
     ```
   * **Terminal 2**:
     ```powershell
     node scripts/inec_voter_auditor.mjs --worker 2
     ```
Both workers will pull different polling units simultaneously and safely append to the same database!

---

## 📊 Where is the Data Saved?

Every single verified polling unit is automatically saved into:

1. **`data/voter_records.csv`**: Standard spreadsheet ready to open in Excel or Google Sheets.
2. **`data/voter_records.json`**: Structured JSON database.
3. **`INEC_POLLING_UNIT_AUDIT.md`**: Live markdown report tracking all verified units and voter change percentages.

---

## 💡 Important Rules & Pro-Tips

| Rule | Explanation |
| :--- | :--- |
| **400 PUs Per Day Limit** | INEC restricts each email account to **400 polling units per calendar day**. Once you hit 400, simply sign in with a different email address to get a fresh 400-unit quota immediately. |
| **Rate Limit** | INEC allows a maximum of **10 lookups per minute**. The script has a built-in safe delay to ensure your account never gets banned or throttled. |
| **AWS WAF Refresh** | If the terminal says session expired or asks for input after ~30 minutes, simply refresh the INEC page in your browser (`F5`), copy the fresh cookie, and paste it into `.env`. |
| **Safe Stopping** | You can pause or stop the script at any time by pressing **`Ctrl + C`**. You will never lose any verified records. |

