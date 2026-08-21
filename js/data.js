/**
 * data.js — menu data layer.
 *
 * Source of truth is the Google Sheet (columns: category_slug, category_hi,
 * category_en, item_hi, item_en, item_slug, estimated_price_inr, image_link).
 * We fetch it live via the Google Visualization ("gviz") JSON endpoint,
 * which works for any sheet shared as "Anyone with the link can view"
 * without exposing an API key. If the live fetch fails (offline preview,
 * network blocked, sheet temporarily unavailable) we fall back to the
 * SEED_MENU snapshot below so the site still works.
 *
 * SEED_MENU was captured directly from the current Rate_list sheet — every
 * row, price, and slug below matches the sheet at the time of writing.
 * Nothing here is invented.
 */

const SEED_MENU = [
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","कोल्ड कॉफी","Cold Coffee","cold_coffee",40],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","हॉट कॉफी","Hot Coffee","hot_coffee",30],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","टमैटो सूप","Tomato Soup","tomato_soup",30],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","स्वीट कार्न सूप","Sweet Corn Soup","sweet_corn_soup",35],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","मिक्स वेजीटेबल सूप","Mix Vegetable Soup","mix_vegetable_soup",30],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","हाट एण्ड सौर सूप","Hot and Sour Soup","hot_and_sour_soup",35],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","वेज क्रीम सूप","Veg Cream Soup","veg_cream_soup",35],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","मिक्तौनी सूप","Minestrone Soup","minestrone_soup",40],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","फ्रेश ओनियन टोस्ट सूप","Fresh Onion Toast Soup","fresh_onion_toast_soup",40],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","मशरूम मिक्तौनी सूप","Mushroom Minestrone Soup","mushroom_minestrone_soup",45],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","वेज पिक्कींग सूप (चाईनीज)","Veg Peking Soup (Chinese)","veg_peking_soup_chinese",40],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","आम का पना","Aam Panna","aam_panna",25],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","फ्रेश जूस","Fresh Juice","fresh_juice",45],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","कोल्ड ड्रिंक","Cold Drink","cold_drink",20],
["cold_hot_drinks","कोल्ड/हॉट ड्रिंक्स","Cold & Hot Drinks","ठंडाई","Thandai","thandai",40],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पनीर रोल","Paneer Roll","paneer_roll",55],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पनीर फिंगर","Paneer Finger","paneer_finger",50],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पनीर थ्री इन वन","Paneer Three in One","paneer_three_in_one",60],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पनीर हरा कबाब","Paneer Hara Kebab","paneer_hara_kebab",50],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","स्प्रिंग रोल","Spring Roll","spring_roll",40],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मिनी रोल","Mini Roll","mini_roll",35],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","आलू मटर नेस्ट","Aloo Matar Nest","aloo_matar_nest",40],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मलेशियन रोल","Malaysian Roll","malaysian_roll",45],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पालक रोल","Palak Roll","palak_roll",35],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","वेज केप्सी","Veg Crispy / Kepsi","veg_crispy_kepsi",40],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मिनी कटलेट","Mini Cutlet","mini_cutlet",30],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पटेटो फिंगर","Potato Finger","potato_finger",30],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","वेज्जी पटेटो","Veggie Potato","veggie_potato",35],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पटेटो फिंगर चिली","Potato Finger Chilli","potato_finger_chilli",40],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मिनी वेज कबाब","Mini Veg Kebab","mini_veg_kebab",35],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मिनी समोसा","Mini Samosa","mini_samosa",20],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पालक समोसा","Palak Samosa","palak_samosa",25],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","पोटली समोसा","Potli Samosa","potli_samosa",30],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","हरियाली कबाब","Hariyali Kebab","hariyali_kebab",40],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मशरूम स्टिक","Mushroom Stick","mushroom_stick",55],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मशरूम तन्दूरी","Mushroom Tandoori","mushroom_tandoori",60],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मिनी काजू बर्फी","Mini Kaju Barfi","mini_kaju_barfi",45],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","रस भरी","Rasbhari","rasbhari",30],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मिनी औरंज पेठा","Mini Orange Petha","mini_orange_petha",25],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","मेवे की पोटली","Mewe Ki Potli","mewe_ki_potli",50],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","चीज़ बाउल","Cheese Ball","cheese_ball",55],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","केला चिप्स","Banana Chips","banana_chips",20],
["snacks_sweets_salted","स्नैक्स स्वीट्स/साल्टेड","Snacks Sweets & Salted","सिन्धी खस्ता","Sindhi Khasta","sindhi_khasta",25],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","शाही पनीर","Shahi Paneer","shahi_paneer",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","मटर पनीर","Matar Paneer","matar_paneer",65],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर कोरमा","Paneer Korma","paneer_korma",80],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर सफेद ग्रेवी","Paneer White Gravy","paneer_white_gravy",80],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर दो प्याजा","Paneer Do Pyaza","paneer_do_pyaza",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर बटर मसाला","Paneer Butter Masala","paneer_butter_masala",80],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पालक पनीर","Palak Paneer","palak_paneer",70],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर हरा भरा","Paneer Hara Bhara","paneer_hara_bhara",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","चिली पनीर","Chilli Paneer","chilli_paneer",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर कोफ्ता कड़ी","Paneer Kofta Curry","paneer_kofta_curry",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर लबाबदर","Paneer Lababdar","paneer_lababdar",85],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर हाण्डी","Paneer Handi","paneer_handi",80],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","खोया पनीर","Khoya Paneer","khoya_paneer",85],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","कढ़ाई पनीर","Kadhai Paneer","kadhai_paneer",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर सागवाला","Paneer Saagwala","paneer_saagwala",70],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर भुजिया","Paneer Bhurji","paneer_bhurji",75],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","पनीर पसन्दा","Paneer Pasanda","paneer_pasanda",85],
["awadh_ki_shaan","अवध की शान","Awadh Ki Shaan","मटर मशरूम काजू","Matar Mushroom Kaju","matar_mushroom_kaju",80],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","दाल मखानी","Dal Makhani","dal_makhani",50],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","चना दाल मसालेदार","Chana Dal Masaledar","chana_dal_masaledar",40],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","शाही दाल","Shahi Dal","shahi_dal",45],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","नौरतन दाल","Navratan Dal","navratan_dal",50],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","अरहर दाल तड़का","Arhar Dal Tadka","arhar_dal_tadka",35],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","दाल चना मसाला","Dal Chana Masala","dal_chana_masala",40],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","दाल मटका","Dal Matka","dal_matka",45],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","पंचमेल दाल","Panchmel Dal","panchmel_dal",45],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","उरद दाल ड्राई","Urad Dal Dry","urad_dal_dry",35],
["shahi_dalen","शाही दालें","Shahi Dal (Lentils)","पंजाबी छोला","Punjabi Chhola","punjabi_chhola",45],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","मलाई कोफ्ता","Malai Kofta","malai_kofta",65],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","नौरतन कोफ्ता","Navratan Kofta","navratan_kofta",60],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","रसभरी कोफ्ता","Rasbhari Kofta","rasbhari_kofta",60],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","पालक कोफ्ता","Palak Kofta","palak_kofta",50],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","कटहल कोफ्ता","Kathal Kofta","kathal_kofta",55],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","मिक्स वेजि़टेबल कोफ्ता","Mix Vegetable Kofta","mix_vegetable_kofta",50],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","लौंग कोफ्ता","Laung Kofta","laung_kofta",55],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","केला कोफ्ता","Raw Banana Kofta","raw_banana_kofta",50],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","चाप कोफ्ता","Chaap Kofta","chaap_kofta",60],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","भसिण्ड कोफ्ता","Bhasind Kofta (Lotus Stem)","bhasind_kofta",60],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","बनारसी दम आलू","Banarasi Dum Aloo","banarasi_dum_aloo",50],
["bahar_e_kofta","बहार-ए-कोफ्ता","Bahar-e-Kofta","कश्मीरी दम आलू","Kashmiri Dum Aloo","kashmiri_dum_aloo",55],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","मिक्स वेज","Mix Veg","mix_veg",45],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू परवल","Aloo Parwal","aloo_parwal",40],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू मसाला","Aloo Masala","aloo_masala",30],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू जीरा ड्राई","Aloo Jeera Dry","aloo_jeera_dry",30],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","चाट आलू","Chaat Aloo","chaat_aloo",35],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू गोभी मटर","Aloo Gobhi Matar","aloo_gobhi_matar",40],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू सोया मेथी","Aloo Soya Methi","aloo_soya_methi",35],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू मटर","Aloo Matar","aloo_matar",35],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू कश्मीरी","Aloo Kashmiri","aloo_kashmiri",45],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू धनिया","Aloo Dhaniya","aloo_dhaniya",35],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","आलू मटर ड्राई","Aloo Matar Dry","aloo_matar_dry",35],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","दम मटर ड्राई","Dum Matar Dry","dum_matar_dry",40],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","दम आलू पालक","Dum Aloo Palak","dum_aloo_palak",40],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","गोभी मुसल्लम","Gobhi Musallam","gobhi_musallam",55],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","गोभी मसाला","Gobhi Masala","gobhi_masala",40],
["seasonal_vegetables","सीजनल वेजि़टेबिल","Seasonal Vegetables","गोभी फ्राई","Gobhi Fry","gobhi_fry",40],
].map(r => ({
  category_slug: r[0], category_hi: r[1], category_en: r[2],
  item_hi: r[3], item_en: r[4], item_slug: r[5], estimated_price_inr: r[6],
  image_link: "",
}));

const AvadheshaData = (() => {
  /** Basic HTML-escape for anything rendered from sheet text. */
  function sanitize(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /** Parse Google's gviz JSON (wrapped in a JS callback) into rows of cells. */
  function parseGviz(text) {
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    if (!match) throw new Error("Unexpected gviz response format");
    const json = JSON.parse(match[1]);
    if (json.status === "error") throw new Error("Sheet returned an error");
    const cols = json.table.cols.map((c, i) => (c.label || c.id || `col${i}`).trim());
    const rows = json.table.rows.map(r => r.c.map(c => (c ? c.v : null)));
    return { cols, rows };
  }

  /** Turn header row + data rows into an array of clean row-objects keyed by header name. */
  function rowsToObjects(cols, rows) {
    // Sheet's row 1 is a header row of column keys (category_slug, item_en, ...).
    // gviz sometimes returns generic col ids (A, B, C) when the header row
    // isn't formatted as a header — handle both by using row[0] as fallback header.
    let headerNames = cols;
    let dataRows = rows;
    const looksGeneric = cols.every(c => /^[A-Z]$|^col\d+$/.test(c));
    if (looksGeneric && rows.length) {
      headerNames = rows[0].map(v => (v == null ? "" : String(v).trim()));
      dataRows = rows.slice(1);
    }
    return dataRows.map(r => {
      const obj = {};
      headerNames.forEach((h, i) => { obj[h] = r[i]; });
      return obj;
    });
  }

  /** Validate + normalise one menu row. Returns null if the row should be skipped. */
  function cleanMenuRow(row) {
    const category_slug = (row.category_slug || "").toString().trim();
    const item_en = (row.item_en || "").toString().trim();
    const item_hi = (row.item_hi || "").toString().trim();
    if (!category_slug && !item_en && !item_hi) return null; // empty row
    if (!item_en && !item_hi) return null; // no usable name in either language

    const priceRaw = row.estimated_price_inr;
    const priceNum = typeof priceRaw === "number" ? priceRaw : parseFloat(priceRaw);
    const hasValidPrice = Number.isFinite(priceNum) && priceNum > 0;

    return {
      category_slug: category_slug || "uncategorised",
      category_hi: (row.category_hi || "").toString().trim() || category_slug,
      category_en: (row.category_en || "").toString().trim() || category_slug,
      item_hi: item_hi || item_en,
      item_en: item_en || item_hi,
      item_slug: (row.item_slug || "").toString().trim() || (item_en || item_hi).toLowerCase().replace(/\s+/g, "_"),
      price: hasValidPrice ? Math.round(priceNum) : null,
      image_link: (row.image_link || "").toString().trim(),
    };
  }

  /** De-duplicate by item_slug, keep first occurrence. */
  function dedupe(items) {
    const seen = new Set();
    const out = [];
    for (const it of items) {
      const key = it.item_slug + "::" + it.category_slug;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(it);
    }
    return out;
  }

  async function fetchMenu() {
    const cfg = window.AVADHESHA_CONFIG;
    try {
      const url = cfg.sheets.gvizUrl(cfg.sheets.menuSheetId);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not OK");
      const text = await res.text();
      const { cols, rows } = parseGviz(text);
      const objs = rowsToObjects(cols, rows);
      const cleaned = objs.map(cleanMenuRow).filter(Boolean);
      if (!cleaned.length) throw new Error("Sheet returned no usable rows");
      return { items: dedupe(cleaned), source: "live" };
    } catch (err) {
      console.warn("[Avadhesha] Live menu fetch failed, using seed data:", err.message);
      return { items: SEED_MENU.map(cleanMenuRow).filter(Boolean), source: "seed" };
    }
  }

  function cleanReviewRow(row) {
    const name = (row.Name || row.name || "").toString().trim();
    const review = (row.Review || row.review || "").toString().trim();
    if (!name || !review) return null;
    let rating = row.Rating ?? row.rating;
    rating = typeof rating === "number" ? rating : parseFloat(rating);
    if (!Number.isFinite(rating)) rating = null;
    rating = rating ? Math.min(5, Math.max(1, Math.round(rating))) : null;
    const approvedRaw = (row.Approved ?? row.approved ?? "").toString().trim().toLowerCase();
    const approved = ["yes", "true", "approved", "y", "1"].includes(approvedRaw);
    const eventType = (row.EventType || row["Event Type"] || row.event_type || "").toString().trim();
    return { name, review, rating, approved, eventType, timestamp: row.Timestamp || row.timestamp || "" };
  }

  async function fetchReviews() {
    const cfg = window.AVADHESHA_CONFIG;
    try {
      const url = cfg.sheets.gvizUrl(cfg.sheets.reviewSheetId);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not OK");
      const text = await res.text();
      const { cols, rows } = parseGviz(text);
      const objs = rowsToObjects(cols, rows);
      const cleaned = objs.map(cleanReviewRow).filter(Boolean);
      return { reviews: cleaned, source: "live" };
    } catch (err) {
      console.warn("[Avadhesha] Live reviews fetch failed:", err.message);
      return { reviews: [], source: "unavailable" };
    }
  }

  return { fetchMenu, fetchReviews, sanitize };
})();
