/**
 * Code.gs — deploy this INSIDE the review Google Sheet
 * (Extensions → Apps Script), then deploy as a Web App.
 *
 * This is the secure bridge for review submissions:
 *   Browser (review form) → this Web App → Review Google Sheet
 *
 * No API key or credential is ever exposed to the browser; the Apps
 * Script runs with the sheet owner's authorisation instead.
 *
 * SETUP
 * 1. Open the review sheet → Extensions → Apps Script.
 * 2. Paste this file's contents, replacing any starter code.
 * 3. Click Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the generated /exec URL.
 * 5. Put that URL into js/config.js → sheets.reviewSubmitEndpoint.
 *
 * Sheet columns expected (row 1 header): Name | Review | Rating | Approved | Timestamp
 * New submissions are appended with Approved left BLANK so nothing
 * publishes until the business owner reviews it and types "Yes" in
 * the Approved column.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const name = sanitize_(data.name);
    const review = sanitize_(data.review);
    const rating = clampRating_(data.rating);
    const eventType = sanitize_(data.eventType || "");
    const timestamp = data.timestamp || new Date().toISOString();

    if (!name || !review || !rating) {
      return jsonResponse_({ ok: false, error: "Missing required fields" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1")
      || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Columns: Name, Review, Rating, Approved, Timestamp, EventType
    sheet.appendRow([name, review, rating, "", timestamp, eventType]);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function sanitize_(str) {
  return String(str || "").trim().slice(0, 1000);
}

function clampRating_(r) {
  const n = parseInt(r, 10);
  if (!Number.isFinite(n)) return null;
  return Math.min(5, Math.max(1, n));
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
