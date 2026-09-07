# Practice updates — Google Sheet backend

The **"Stay Updated on Luma"** form
(`src/components/WaitlistForm.astro`) submits each signup to a **Google Apps
Script Web App**, which appends a row to a **Google Sheet you own**. No
separate marketing platform or monthly cost is required—the data lives in your
spreadsheet, where you can sort, filter, or export it anytime.

Once deployed, paste the Web App URL into
`SITE.forms.waitlistEndpoint` in `src/site.config.ts`.

---

## One-time setup (about 2–3 minutes)

1. **Create the Sheet.** Go to <https://sheets.new> and name it something like
   `Luma Pediatrics — Practice Updates`.

2. **Open the script editor.** In that Sheet: **Extensions → Apps Script**.

3. **Paste the script.** Delete any starter code, paste the code from
   [`waitlist.gs`](./waitlist.gs) below, and click **Save** (💾).

4. **Deploy as a Web App.**
   - Click **Deploy → New deployment**.
   - Click the gear ⚙️ next to "Select type" and choose **Web app**.
   - **Description:** `Practice updates collector`
   - **Execute as:** **Me** (your Google account).
   - **Who has access:** **Anyone**. *(Required so the public website can post
     to it. The URL is unguessable and the script only ever appends rows — it
     never reads or returns your data.)*
   - Click **Deploy**, then **Authorize access** and approve the permissions
     (you may see an "unverified app" screen — click **Advanced → Go to
     &lt;project&gt; (unsafe)**; it's your own script).

5. **Copy the Web app URL.** It ends in `/exec`, e.g.
   `https://script.google.com/macros/s/AKfy…/exec`.

6. **Activate it on the site.** Paste that URL into `src/site.config.ts`:

   ```ts
   forms: {
     // …
     waitlistEndpoint: 'https://script.google.com/macros/s/AKfy…/exec',
   },
   ```

   Commit + push and the form goes live. (Or send the URL to your dev and they'll
   paste it in.)

---

## The script — `waitlist.gs`

```javascript
// Luma Pediatrics — practice-updates signup collector.
//
// Container-bound Apps Script: create it via Extensions → Apps Script from
// inside the Google Sheet that should receive signups. Then deploy it as a
// Web app (Execute as: Me · Who has access: Anyone) and paste the /exec URL
// into SITE.forms.waitlistEndpoint in src/site.config.ts.
// Full instructions: docs/waitlist-setup.md
//
var FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  consent: 'Consent',
  consent_version: 'Consent version',
  page: 'Page',
  submitted_at: 'Submitted at (browser)'
};

// Only these public fields are retained. Unknown or manually injected fields
// are discarded so the endpoint cannot become patient intake.
var ALLOWED_FIELDS = ['name', 'email', 'consent', 'consent_version', 'page', 'submitted_at'];
var PREFERRED_ORDER = ['Timestamp'].concat(ALLOWED_FIELDS);

// ── Daily digest ─────────────────────────────────────────────────────────────
// Who receives the once-a-day summary of new signups.
var DIGEST_RECIPIENTS = ['anish@lumapediatrics.com', 'drt@lumapediatrics.com', 'hello@lumapediatrics.com'];
// Hour (0-23) in the project's timezone for the daily digest trigger.
var DIGEST_HOUR = 7;

function labelFor(key) {
  if (key === 'Timestamp') return 'Timestamp';
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key.replace(/[_-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(30000); } catch (ignore) {}
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Waitlist') || ss.insertSheet('Waitlist');
    var params = (e && e.parameter) ? e.parameter : {};

    // Honeypot: return success but do not record obvious bots.
    if (params.botcheck) return jsonOut({ ok: true });

    var email = String(params.email || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || params.consent !== 'yes') {
      return jsonOut({ ok: false, error: 'Valid email and affirmative consent are required.' });
    }

    // Map only allowlisted fields, always stamping a server-side Timestamp.
    var values = { Timestamp: new Date() };
    ALLOWED_FIELDS.forEach(function (key) {
      if (params[key] != null) values[labelFor(key)] = params[key];
    });

    // Current header labels (empty when the sheet is brand new).
    var headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
      : [];

    if (headers.length === 0) {
      // Seed a new sheet with the approved columns.
      headers = PREFERRED_ORDER.map(labelFor);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    } else {
      // Add newly approved columns without retaining unknown submitted fields.
      var approvedLabels = PREFERRED_ORDER.map(labelFor);
      var added = approvedLabels.filter(function (label) { return headers.indexOf(label) === -1; });
      if (added.length) {
        sheet.getRange(1, headers.length + 1, 1, added.length).setValues([added]).setFontWeight('bold');
        headers = headers.concat(added);
      }
    }

    // Write the row aligned to the header order.
    var row = headers.map(function (label) { return values[label] != null ? values[label] : ''; });
    sheet.appendRow(row);

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Optional: open the /exec URL in a browser to confirm the endpoint is live.
function doGet() {
  return ContentService.createTextOutput('Luma Pediatrics practice-updates endpoint is live.');
}

// ── Daily signup digest ──────────────────────────────────────────────────────
// Emails DIGEST_RECIPIENTS a summary of every signup since the previous digest.
// Runs on a daily time trigger — install it ONCE by running
// createDailyDigestTrigger() from the Apps Script editor (Run ▸ the function),
// approving the extra Gmail/trigger permissions when prompted. No email is sent
// on days with zero new signups.
function sendDailyDigest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Waitlist');
  if (!sheet || sheet.getLastRow() < 2) return; // header only / empty

  var now = new Date();
  var props = PropertiesService.getScriptProperties();
  var last = props.getProperty('lastDigestAt');
  var since = last ? new Date(last) : new Date(now.getTime() - 24 * 60 * 60 * 1000);

  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(String);
  var tsCol = headers.indexOf('Timestamp');
  if (tsCol === -1) tsCol = 0;

  var fresh = [];
  for (var i = 1; i < data.length; i++) {
    var ts = data[i][tsCol];
    if (ts instanceof Date && ts > since) fresh.push(data[i]);
  }

  if (fresh.length === 0) {
    props.setProperty('lastDigestAt', now.toISOString()); // advance window
    return;
  }

  var tz = ss.getSpreadsheetTimeZone();
  var count = fresh.length;
  var plural = count === 1 ? '' : 's';
  var subject = 'Luma practice updates — ' + count + ' new signup' + plural +
    ' (' + Utilities.formatDate(now, tz, 'EEE, MMM d') + ')';

  var html = '<p style="font-family:Arial,sans-serif">' + count + ' new practice-updates signup' +
    plural + ' since the last update:</p>' +
    '<table cellpadding="8" cellspacing="0" ' +
    'style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;border:1px solid #ddd">' +
    '<tr style="background:#f4f1ea">';
  headers.forEach(function (h) { html += '<th align="left" style="border:1px solid #ddd">' + esc(h) + '</th>'; });
  html += '</tr>';
  fresh.forEach(function (row) {
    html += '<tr>';
    row.forEach(function (cell) {
      var v = (cell instanceof Date) ? Utilities.formatDate(cell, tz, 'MMM d, yyyy h:mm a') : cell;
      html += '<td style="border:1px solid #ddd">' + esc(v == null ? '' : v) + '</td>';
    });
    html += '</tr>';
  });
  html += '</table>' +
    '<p style="font-family:Arial,sans-serif;color:#888;font-size:12px">Full sheet: ' +
    '<a href="' + ss.getUrl() + '">' + ss.getName() + '</a></p>';

  MailApp.sendEmail({ to: DIGEST_RECIPIENTS.join(','), subject: subject, htmlBody: html });
  props.setProperty('lastDigestAt', now.toISOString());
}

function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Run this ONCE from the editor to (re)install the daily digest trigger.
function createDailyDigestTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendDailyDigest') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendDailyDigest').timeBased().everyDays(1).atHour(DIGEST_HOUR).create();
}
```

---

## How it works / notes

- The script stores only `name`, `email`, `consent`, `consent_version`, `page`,
  and `submitted_at`. Unknown fields are discarded, and a valid email plus
  affirmative consent are required server-side.
- Submissions use `fetch(..., { mode: 'no-cors' })` because Apps Script Web Apps
  don't send CORS headers. The row is still written; the browser just can't read
  the response, so the site optimistically shows the success message. (A honeypot
  field blocks basic bots.)
- **Updating the script?** After editing `waitlist.gs`, run
  **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy** so the
  live URL picks up your changes (the `/exec` URL stays the same).
- **Before the endpoint is set**, the form stays visible but, on submit, directs
  visitors to the public email address instead of collecting.
- Want a summary email? A **daily digest** to the team is built in — see
  **Daily signup digest** below.


---

## Daily internal signup digest

The script can email the team a once-a-day summary of new signups.

1. Recipients live in `DIGEST_RECIPIENTS` near the top of `waitlist.gs` (currently
   `anish@`, `drt@`, and `hello@lumapediatrics.com`). Send time is `DIGEST_HOUR`
   (default **7 AM**, the project's timezone under **Project Settings**).
2. In the Apps Script editor, choose **`createDailyDigestTrigger`** in the function
   dropdown and click **Run** once. Approve the extra Gmail + trigger permissions.
3. Done. Each day it emails a table of every signup since the previous digest.
   Days with zero new signups send nothing. The digest reads the Sheet directly, so
   it does **not** require redeploying the web app.

To change recipients or timing, edit `DIGEST_RECIPIENTS` / `DIGEST_HOUR` and re-run
`createDailyDigestTrigger` (it clears the old trigger first).
