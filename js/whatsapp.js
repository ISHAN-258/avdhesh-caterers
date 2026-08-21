/**
 * whatsapp.js — builds wa.me links for the floating CTA and the
 * full quotation enquiry message.
 */
const AvadheshaWhatsApp = (() => {
  function digitsOnly(n) {
    return String(n || "").replace(/\D/g, "");
  }

  function waLink(number, message) {
    const num = digitsOnly(number);
    const withCountry = num.startsWith("91") ? num : `91${num}`;
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${withCountry}${text}`;
  }

  function simpleGreeting(lang) {
    const biz = window.AVADHESHA_CONFIG.business;
    return lang === "hi"
      ? `नमस्ते ${biz.nameHi}, मुझे अपने इवेंट के लिए कैटरिंग के बारे में जानकारी चाहिए।`
      : `Hello ${biz.nameEn}, I would like to know more about catering for my event.`;
  }

  function quotationMessage({ lang, customerName, eventType, eventTypeLabel, date, guests, venue, items, quote }) {
    const L = window.AVADHESHA_I18N[lang] || window.AVADHESHA_I18N.en;
    const biz = window.AVADHESHA_CONFIG.business;
    const itemLines = items.map(it => `- ${lang === "hi" ? it.item_hi : it.item_en}`).join("\n");

    const lines = lang === "hi"
      ? [
          `नमस्ते ${biz.nameHi},`,
          ``,
          `मुझे अपने इवेंट के लिए कैटरिंग के बारे में पूछताछ करनी है।`,
          ``,
          `नाम: ${customerName || "-"}`,
          `इवेंट: ${eventTypeLabel || "-"}`,
          `तारीख: ${date || "-"}`,
          `मेहमान: ${guests || "-"}`,
          `वेन्यू: ${venue || "-"}`,
          ``,
          `चयनित मेन्यू:`,
          itemLines || "- (कोई आइटम नहीं चुना गया)",
          ``,
          `अनुमानित कुल राशि: ${AvadheshaCalculator.formatINR(quote.total)}`,
          ``,
          `कृपया अंतिम कोटेशन एवं कन्फर्मेशन के लिए संपर्क करें।`,
          `यह एक अनुमानित कोटेशन है, अंतिम मूल्य नहीं।`,
        ]
      : [
          `Hello ${biz.nameEn},`,
          ``,
          `I would like to enquire about catering for my event.`,
          ``,
          `Name: ${customerName || "-"}`,
          `Event: ${eventTypeLabel || "-"}`,
          `Date: ${date || "-"}`,
          `Guests: ${guests || "-"}`,
          `Venue: ${venue || "-"}`,
          ``,
          `Selected Menu:`,
          itemLines || "- (no items selected)",
          ``,
          `Estimated Total: ${AvadheshaCalculator.formatINR(quote.total)}`,
          ``,
          `Please contact me for final quotation and confirmation.`,
          `This is an estimated quotation, not the final legally binding price.`,
        ];
    return lines.join("\n");
  }

  return { waLink, simpleGreeting, quotationMessage, digitsOnly };
})();
