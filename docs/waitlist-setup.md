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
// Luma Pediatrics — founding-families waitlist collector.
// Container-bound Apps Script: create it via Extensions → Apps Script from
// inside the Google Sheet that should receive signups.

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Waitlist') || ss.insertSheet('Waitlist');

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Parent / guardian', 'Email',
        'Child age or due date', 'Mobile phone', 'Page', 'Submitted at (browser)'
      ]);
    }

    var p = (e && e.parameter) ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.parent_name || '',
      p.email || '',
      p.child_age_or_due || '',
      p.phone || '',
      p.page || '',
      p.submitted_at || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you confirm the endpoint is live by opening the URL in a browser.
function doGet() {
  return ContentService.createTextOutput('Luma Pediatrics waitlist endpoint is live.');
}
```

---

## How it works / notes

- The form posts `parent_name`, `email`, `child_age_or_due`, `phone`, `page`, and
  `submitted_at`. Add fields to the form + the `appendRow(...)` call together if
  you want to capture more.
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
