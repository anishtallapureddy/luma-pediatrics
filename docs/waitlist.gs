// Luma Pediatrics — founding-families waitlist collector.
// Container-bound Apps Script: create it via Extensions → Apps Script from
// inside the Google Sheet that should receive signups. Then deploy it as a
// Web app (Execute as: Me · Who has access: Anyone) and paste the /exec URL
// into SITE.forms.waitlistEndpoint in src/site.config.ts.
// Full instructions: docs/waitlist-setup.md

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Waitlist') || ss.insertSheet('Waitlist');

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Parent / guardian', 'Email',
        'Child age or due date', 'City', 'Page', 'Submitted at (browser)'
      ]);
    }

    var p = (e && e.parameter) ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.parent_name || '',
      p.email || '',
      p.child_age_or_due || '',
      p.city || '',
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
