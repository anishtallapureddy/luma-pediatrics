# Founding-families waitlist — Google Sheet backend

The homepage/hero **"Join the founding-families list"** form
(`src/components/WaitlistForm.astro`) submits each signup to a **Google Apps
Script Web App**, which appends a row to a **Google Sheet you own**. No email,
no third-party account, no monthly cost — the data lives in your spreadsheet and
you can sort, filter, or export it anytime.

Once deployed, paste the Web App URL into
`SITE.forms.waitlistEndpoint` in `src/site.config.ts`.

---

## One-time setup (about 2–3 minutes)

1. **Create the Sheet.** Go to <https://sheets.new> and name it something like
   `Luma Pediatrics — Founding Families`.

2. **Open the script editor.** In that Sheet: **Extensions → Apps Script**.

3. **Paste the script.** Delete any starter code, paste the code from
   [`waitlist.gs`](./waitlist.gs) below, and click **Save** (💾).

4. **Deploy as a Web App.**
   - Click **Deploy → New deployment**.
   - Click the gear ⚙️ next to "Select type" and choose **Web app**.
   - **Description:** `Waitlist collector`
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
// Luma Pediatrics — founding-families waitlist collector (field-agnostic).
//
// Container-bound Apps Script: create it via Extensions → Apps Script from
// inside the Google Sheet that should receive signups. Then deploy it as a
// Web app (Execute as: Me · Who has access: Anyone) and paste the /exec URL
// into SITE.forms.waitlistEndpoint in src/site.config.ts.
// Full instructions: docs/waitlist-setup.md
//
// Field-agnostic by design: it records whatever fields the form posts and adds
// a new column automatically the first time it sees a new field. You never need
// to edit or redeploy this script when the form's fields change.

// Friendly column labels for known fields. Unknown fields fall back to a
// title-cased version of the field key, so brand-new form fields still get a
// readable column header with zero code changes.
var FIELD_LABELS = {
  parent_name: 'Parent / guardian',
  email: 'Email',
  phone: 'Mobile phone',
  child_age_or_due: 'Child age or due date',
  page: 'Page',
  submitted_at: 'Submitted at (browser)'
};

// Left-to-right column order used only when creating a brand-new sheet.
var PREFERRED_ORDER = ['Timestamp', 'parent_name', 'email', 'phone', 'child_age_or_due', 'page', 'submitted_at'];

// Fields that are never stored (spam honeypot, etc.).
var IGNORED_FIELDS = ['botcheck'];

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

    // Map this submission into { columnLabel: value }, always stamping a
    // server-side Timestamp.
    var values = { Timestamp: new Date() };
    Object.keys(params).forEach(function (key) {
      if (IGNORED_FIELDS.indexOf(key) === -1) values[labelFor(key)] = params[key];
    });

    // Current header labels (empty when the sheet is brand new).
    var headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
      : [];

    if (headers.length === 0) {
      // Seed a new sheet with the preferred known columns, then any extras.
      headers = PREFERRED_ORDER.map(labelFor);
      Object.keys(values).forEach(function (label) {
        if (headers.indexOf(label) === -1) headers.push(label);
      });
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    } else {
      // Existing sheet: append any never-seen columns on the right. Existing
      // columns are never reordered, so previously written rows stay aligned.
      var added = Object.keys(values).filter(function (label) { return headers.indexOf(label) === -1; });
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
  return ContentService.createTextOutput('Luma Pediatrics waitlist endpoint is live.');
}
```

---

## How it works / notes

- The script is **field-agnostic**: it records whatever fields the form posts and
  adds a new column automatically the first time it sees a new field. Add, remove,
  or rename form fields freely — no script edit or redeploy needed. (A `botcheck`
  honeypot field is ignored.)
- Submissions use `fetch(..., { mode: 'no-cors' })` because Apps Script Web Apps
  don't send CORS headers. The row is still written; the browser just can't read
  the response, so the site optimistically shows the success message. (A honeypot
  field blocks basic bots.)
- **Updating the script?** After editing `waitlist.gs`, run
  **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy** so the
  live URL picks up your changes (the `/exec` URL stays the same).
- **Before the endpoint is set**, the form stays visible but, on submit, shows a
  friendly "call or text us" message instead of collecting — so nothing breaks.
- Want email notifications too? Add a
  `MailApp.sendEmail('you@example.com', 'New waitlist signup', p.email)` line
  inside `doPost`, or add a Sheet → **Tools → Notification settings**.
