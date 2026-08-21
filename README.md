# Avadhesha Caterers & Tent House — Website

A bilingual (English/Hindi) catering website with a live menu pulled from
Google Sheets, a "Build Your Menu" event-quotation calculator, and a
review system backed by a second Google Sheet.

No build step is required — it's a static site (HTML/CSS/vanilla JS).

## Quick start

Just open `index.html` in a browser, or serve the folder with any static
file server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## How the Google Sheets integration works

- **Menu sheet** (`Rate_list`): columns `category_slug, category_hi,
  category_en, item_hi, item_en, item_slug, estimated_price_inr,
  image_link`. The site fetches this live, client-side, via Google's
  public "gviz" JSON endpoint — no API key needed, as long as the sheet
  is shared as **"Anyone with the link → Viewer"**.
- **Review sheet**: columns `Name, Review, Rating, Approved, Timestamp`.
  Read the same way. Only rows with `Approved` set to `Yes`/`True`/`1`
  are shown publicly — nothing publishes automatically.
- If a live fetch fails (offline, sheet made private, temporary network
  issue), the site falls back to a snapshot of the menu embedded in
  `js/data.js` (`SEED_MENU`) so the page still works. That snapshot
  should be refreshed occasionally if the sheet changes a lot — but the
  live sheet is always the source of truth when reachable.

### Menu sheet size note

The current preview showed 99 dishes across 6 categories (Cold & Hot
Drinks, Snacks Sweets & Salted, Awadh Ki Shaan, Shahi Dal, Bahar-e-Kofta,
Seasonal Vegetables). If more rows/categories (breakfast, rice, breads,
Chinese, chaat, desserts, etc.) exist further down the sheet, **the live
site will automatically pick them up** — the fetch logic reads the whole
sheet, it isn't limited to what was visible during setup.

## Enabling review submissions

Review reading works out of the box. Review *writing* needs a small,
secure bridge so no credentials are exposed in the browser:

1. Open the review Google Sheet → **Extensions → Apps Script**.
2. Paste in `apps-script/Code.gs`.
3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*.
4. Copy the `/exec` URL it gives you.
5. Paste it into `js/config.js` → `sheets.reviewSubmitEndpoint`.

New reviews are appended with `Approved` left blank, so the business
owner can review and mark `Yes` in that column before anything appears
on the public site.

## Configuration

Everything business-specific lives in **`js/config.js`**:

- Business name (English/Hindi), address, owner/contact names
- Phone numbers and the WhatsApp number used for enquiries
- Google Sheet IDs
- Discount tiers

### Discount tiers

```js
discountTiers: [
  { min: 0,  max: 29,   percent: 0 },
  { min: 30, max: null, percent: 7.5 }, // null = "and above"
]
```

Only the two tiers the business specified (0–29 guests → 0%, 30+ guests
→ 7.5%) are implemented. No 80+ tier was provided, so 30+ stays
open-ended rather than inventing a new number — add a new tier object
here the moment the business gives you one, e.g.:

```js
{ min: 80, max: null, percent: 10 },
```

## Structure

```
index.html            All page sections/markup
css/styles.css         Design system + layout + responsiveness
js/config.js            Business config (single source of truth)
js/i18n.js               English/Hindi UI copy + event type list
js/data.js                Google Sheets fetch, parsing, validation, seed fallback
js/calculator.js           Pure pricing/discount math
js/whatsapp.js               WhatsApp link + message builders
js/menu.js                    Menu rendering, search/filter, plate selection state
js/reviews.js                  Review rendering + submission
js/main.js                      App bootstrap, language switching, form wiring
apps-script/Code.gs    Secure review-submission bridge (deploy separately)
```

## What was intentionally left out (per the brief)

No fabricated content was added anywhere: no invented years of
experience, customer counts, awards, or discount tiers beyond what was
specified. The average rating and review count are computed only from
real approved review data — if there are no approved reviews yet, that
section stays empty rather than showing a placeholder number.
