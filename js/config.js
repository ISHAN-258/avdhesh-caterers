/**
 * config.js — SINGLE SOURCE OF TRUTH for business/site configuration.
 * Change values here; nothing else in the codebase should hard-code
 * phone numbers, sheet URLs, or discount rules.
 */
window.AVADHESHA_CONFIG = {
  business: {
    nameEn: "Avadhesha Caterers & Tent House",
    nameHi: "अवधेशा कैटर्स एवं टेन्ट हाउस",
    altNameHi: "अवधेशा कैटर्स एवं अनुज क्राकरी",
    ownerHi: "प्रो. अवधेश कुमार विश्वकर्मा",
    contactPersonHi: "दुर्गेश कुमार",
    addressEn: "Mohan Road, near Badi Nahar, Saifalpur, Malihabad, Lucknow, Uttar Pradesh",
    addressHi: "मोहन रोड, बड़ी नहर के पास, सैफुलपुर, मलिहाबाद, लखनऊ",
  },

  // All verified numbers. Do not add numbers that aren't in this list.
  phones: ["9936192081", "9415009116", "9695480751", "9936522568"],

  // The number used for the WhatsApp "Send Enquiry" button + floating CTA.
  // Change this ONE value to switch which number receives WhatsApp enquiries.
  whatsappNumber: "9936192081", // +91 prefixed automatically in code

  // Primary call button number (first verified number).
  primaryCallNumber: "9936192081",

  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mohan+Road+Badi+Nahar+Saifalpur+Malihabad+Lucknow",

  // ---- Google Sheets (source of truth for content) ----
  sheets: {
    menuSheetId: "1Fihacs3Hd0nSz7OR8dNFWUPcIZACtj5mvHIeAtOUSeA",
    reviewSheetId: "16JWYXhG0c9lJCvsShkfwP5q5tyk2JT-q9jMWCfLYZAs",
    // gviz JSON endpoint reads any publicly link-shared ("Anyone with link
    // can view") Google Sheet without an API key, entirely client-side.
    gvizUrl(sheetId, sheetName) {
      const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
      return sheetName ? `${base}&sheet=${encodeURIComponent(sheetName)}` : base;
    },
    // Reviews are WRITTEN through a secure bridge, never directly from the
    // browser with credentials. Deploy apps-script/Code.gs as a Google Apps
    // Script Web App (see README) and paste the /exec URL below.
    reviewSubmitEndpoint: "", // e.g. "https://script.google.com/macros/s/XXXX/exec"
  },

  // ---- Discount rules ----
  // Exactly as specified by the business. Do not invent new tiers.
  // `max: null` means "and above". The 30+ tier is left open-ended because
  // no separate 80+ rule was provided — this is clearly the single place
  // to add one later without touching calculator logic.
  discountTiers: [
    { min: 0, max: 29, percent: 0 },
    { min: 30, max: null, percent: 7.5 },
  ],

  social: {
    // Populate when available. Left empty intentionally — not invented.
  },
};
