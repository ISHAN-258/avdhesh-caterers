/**
 * main.js — app bootstrap: language switching, static-copy translation,
 * builder form wiring, quotation summary, mobile CTA, scroll-in animation.
 */
(function () {
  const STORAGE_KEY = "avadhesha_lang";
  let lang = (function initialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "hi") return stored;
    } catch (e) { /* storage unavailable */ }
    return "en";
  })();

  const state = {
    eventType: "",
    guests: "",
    venue: "",
    date: "",
    customerName: "",
    mobile: "",
    requirements: "",
    contactPref: "whatsapp",
  };

  function t(key) {
    return window.AVADHESHA_I18N[lang][key] || key;
  }

  function applyStaticTranslations() {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll(".lang-toggle__btn").forEach(btn => {
      btn.classList.toggle("lang-toggle__btn--active", btn.dataset.lang === lang);
    });
    const biz = window.AVADHESHA_CONFIG.business;
    document.querySelectorAll("[data-biz-name]").forEach(el => {
      el.textContent = lang === "hi" ? biz.nameHi : biz.nameEn;
    });
    document.querySelectorAll("[data-biz-address]").forEach(el => {
      el.textContent = lang === "hi" ? biz.addressHi : biz.addressEn;
    });
  }

  function renderEventTypeOptions() {
    const select = document.getElementById("eventTypeSelect");
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="" disabled ${!current ? "selected" : ""}>${lang === "hi" ? "चुनें" : "Select"}</option>`;
    window.AVADHESHA_EVENT_TYPES.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = lang === "hi" ? opt.hi : opt.en;
      if (opt.value === current) o.selected = true;
      select.appendChild(o);
    });
  }

  function eventTypeLabel(value) {
    const found = window.AVADHESHA_EVENT_TYPES.find(o => o.value === value);
    if (!found) return "";
    return lang === "hi" ? found.hi : found.en;
  }

  function renderSelectedMenu() {
    const container = document.getElementById("selectedMenuList");
    const items = AvadheshaMenu.getSelectedItems();
    container.innerHTML = "";
    if (!items.length) {
      const p = document.createElement("p");
      p.className = "selected-empty";
      p.textContent = t("no_items_selected");
      container.appendChild(p);
      return;
    }
    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "selected-row";
      row.innerHTML = `
        <span>${lang === "hi" ? item.item_hi : item.item_en}</span>
        <span class="selected-row__right">
          <span>${AvadheshaCalculator.formatINR(item.price)}</span>
          <button type="button" class="selected-row__remove" aria-label="remove">✕</button>
        </span>
      `;
      row.querySelector("button").addEventListener("click", () => AvadheshaMenu.removeItem(item.item_slug));
      container.appendChild(row);
    });
  }

  function renderQuotation() {
    const items = AvadheshaMenu.getSelectedItems();
    const guests = parseInt(state.guests, 10) || 0;
    const q = AvadheshaCalculator.quote(items, guests);
    const box = document.getElementById("quotationBox");

    if (!items.length || !guests) {
      box.classList.add("quotation--hidden");
      return;
    }
    box.classList.remove("quotation--hidden");
    document.getElementById("qEventType").textContent = eventTypeLabel(state.eventType) || "—";
    document.getElementById("qGuests").textContent = guests;
    document.getElementById("qVenue").textContent = state.venue || "—";
    document.getElementById("qItemsCount").textContent = items.length;
    document.getElementById("qBase").textContent = AvadheshaCalculator.formatINR(q.base);
    document.getElementById("qDiscount").textContent =
      `${AvadheshaCalculator.formatINR(q.discount)} (${q.discountPercent}%)`;
    document.getElementById("qTotal").textContent = AvadheshaCalculator.formatINR(q.total);

    const waBtn = document.getElementById("sendWhatsappBtn");
    waBtn.onclick = () => {
      const msg = AvadheshaWhatsApp.quotationMessage({
        lang, customerName: state.customerName, eventType: state.eventType,
        eventTypeLabel: eventTypeLabel(state.eventType), date: state.date,
        guests, venue: state.venue, items, quote: q,
      });
      window.open(AvadheshaWhatsApp.waLink(window.AVADHESHA_CONFIG.whatsappNumber, msg), "_blank");
    };
  }

  function wireBuilderForm() {
    const eventTypeSelect = document.getElementById("eventTypeSelect");
    const guestsInput = document.getElementById("guestsInput");
    const venueInput = document.getElementById("venueInput");
    const dateInput = document.getElementById("dateInput");
    const nameInput = document.getElementById("nameInput");
    const mobileInput = document.getElementById("mobileInput");
    const reqInput = document.getElementById("requirementsInput");

    eventTypeSelect.addEventListener("change", e => { state.eventType = e.target.value; renderQuotation(); });
    guestsInput.addEventListener("input", e => { state.guests = e.target.value; renderQuotation(); });
    venueInput.addEventListener("input", e => { state.venue = e.target.value; renderQuotation(); });
    dateInput.addEventListener("input", e => { state.date = e.target.value; });
    nameInput.addEventListener("input", e => { state.customerName = e.target.value; });
    mobileInput.addEventListener("input", e => { state.mobile = e.target.value; });
    reqInput.addEventListener("input", e => { state.requirements = e.target.value; });

    AvadheshaMenu.onSelectionChange(() => {
      renderSelectedMenu();
      renderQuotation();
    });
  }

  function wireSearchAndFilters() {
    const searchInput = document.getElementById("menuSearch");
    const filterContainer = document.getElementById("menuFilters");
    const gridContainer = document.getElementById("menuGrid");

    function rerender() {
      AvadheshaMenu.renderFilters(filterContainer, rerenderAll);
      AvadheshaMenu.renderGrid(gridContainer);
      observeFadeIns();
    }
    function rerenderAll() { rerender(); }

    searchInput.addEventListener("input", e => {
      AvadheshaMenu.setSearchTerm(e.target.value);
      AvadheshaMenu.renderGrid(gridContainer);
      observeFadeIns();
    });

    rerender();
  }

  function wireLanguageToggle() {
    document.querySelectorAll(".lang-toggle__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        lang = btn.dataset.lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        AvadheshaMenu.setLang(lang);
        applyStaticTranslations();
        renderEventTypeOptions();
        wireSearchAndFilters();
        renderSelectedMenu();
        renderQuotation();
        renderReviewsUI();
      });
    });
  }

  function wireMobileCta() {
    const callLink = document.getElementById("mobileCallBtn");
    const waLink = document.getElementById("mobileWaBtn");
    const menuBtn = document.getElementById("mobileMenuBtn");
    callLink.href = `tel:+91${window.AVADHESHA_CONFIG.primaryCallNumber}`;
    waLink.href = AvadheshaWhatsApp.waLink(window.AVADHESHA_CONFIG.whatsappNumber, AvadheshaWhatsApp.simpleGreeting(lang));
    menuBtn.addEventListener("click", () => {
      document.getElementById("builder").scrollIntoView({ behavior: "smooth" });
    });
  }

  function wireHeroAndHeaderCtas() {
    document.querySelectorAll("[data-scroll-to]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(el.dataset.scrollTo);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });
    document.querySelectorAll("[data-call-link]").forEach(el => {
      el.href = `tel:+91${window.AVADHESHA_CONFIG.primaryCallNumber}`;
    });
    document.querySelectorAll("[data-wa-link]").forEach(el => {
      el.href = AvadheshaWhatsApp.waLink(window.AVADHESHA_CONFIG.whatsappNumber, AvadheshaWhatsApp.simpleGreeting(lang));
    });
    document.querySelectorAll("[data-maps-link]").forEach(el => {
      el.href = window.AVADHESHA_CONFIG.mapsUrl;
    });
  }

  function renderContactPhones() {
    const container = document.getElementById("phoneList");
    container.innerHTML = "";
    window.AVADHESHA_CONFIG.phones.forEach(num => {
      const a = document.createElement("a");
      a.href = `tel:+91${num}`;
      a.className = "phone-pill";
      a.textContent = num;
      container.appendChild(a);
    });
  }

  function renderReviewsUI() {
    const summaryEl = document.getElementById("reviewsSummary");
    const listEl = document.getElementById("reviewsList");
    AvadheshaReviews.renderSummary(summaryEl, lang);
    AvadheshaReviews.renderList(listEl, lang);
  }

  function wireReviewForm() {
    const form = document.getElementById("reviewForm");
    const thanksEl = document.getElementById("reviewThanks");
    let currentRating = 0;
    const starsWrap = document.getElementById("ratingStars");

    function paintStars() {
      starsWrap.querySelectorAll("button").forEach((b, i) => {
        b.textContent = i < currentRating ? "★" : "☆";
        b.classList.toggle("star--on", i < currentRating);
      });
    }
    for (let i = 0; i < 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "star";
      b.textContent = "☆";
      b.addEventListener("click", () => { currentRating = i + 1; paintStars(); });
      starsWrap.appendChild(b);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("reviewName").value.trim();
      const eventType = document.getElementById("reviewEventType").value;
      const text = document.getElementById("reviewText").value.trim();
      if (!name || !text || !currentRating) return;

      const payload = {
        name, review: text, rating: currentRating,
        eventType: eventTypeLabel(eventType), timestamp: new Date().toISOString(),
      };
      const result = await AvadheshaReviews.submitReview(payload);
      thanksEl.classList.remove("hidden");
      thanksEl.textContent = result.ok
        ? t("review_thanks")
        : (lang === "hi"
            ? "समीक्षा सबमिट करने के लिए सिस्टम अभी सेट अप हो रहा है। कृपया WhatsApp पर संपर्क करें।"
            : "Review submission isn't fully set up yet — please share your feedback via WhatsApp for now.");
      form.reset();
      currentRating = 0;
      paintStars();
    });
  }

  function observeFadeIns() {
    const els = document.querySelectorAll(".fade-in:not(.fade-in--visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("fade-in--visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in--visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  function setJsonLd() {
    const cfg = window.AVADHESHA_CONFIG;
    const ld = {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      name: cfg.business.nameEn,
      alternateName: cfg.business.nameHi,
      address: {
        "@type": "PostalAddress",
        streetAddress: cfg.business.addressEn,
        addressLocality: "Lucknow",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      telephone: `+91${cfg.primaryCallNumber}`,
      areaServed: "Lucknow, Malihabad",
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  async function boot() {
    setJsonLd();
    applyStaticTranslations();
    renderEventTypeOptions();
    renderContactPhones();
    wireBuilderForm();
    wireLanguageToggle();
    wireMobileCta();
    wireHeroAndHeaderCtas();
    wireReviewForm();

    const menuStatus = document.getElementById("menuStatus");
    menuStatus.textContent = t("loading_menu");

    const { items, source } = await AvadheshaData.fetchMenu();
    AvadheshaMenu.setData(items);
    AvadheshaMenu.setLang(lang);
    wireSearchAndFilters();
    menuStatus.textContent = source === "seed" ? t("menu_load_error") : "";

    const { reviews } = await AvadheshaData.fetchReviews();
    AvadheshaReviews.setData(reviews);
    renderReviewsUI();

    renderSelectedMenu();
    observeFadeIns();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
