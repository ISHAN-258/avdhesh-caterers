/**
 * reviews.js — displays approved reviews from the review Google Sheet and
 * submits new reviews through a secure Apps Script bridge (never writing
 * to the sheet directly from client-side credentials).
 */
const AvadheshaReviews = (() => {
  let reviews = [];

  function setData(list) { reviews = list; }

  function approvedReviews() {
    // If the sheet has no Approved column filled in at all, nothing is
    // auto-published — moderation must be explicit. This keeps us from
    // publishing unmoderated content.
    return reviews.filter(r => r.approved);
  }

  function averageRating() {
    const rated = approvedReviews().filter(r => r.rating != null);
    if (!rated.length) return null;
    const sum = rated.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / rated.length) * 10) / 10;
  }

  function renderSummary(container, lang) {
    const avg = averageRating();
    const count = approvedReviews().length;
    container.innerHTML = "";
    if (!avg || !count) return; // never fabricate a number
    const wrap = document.createElement("div");
    wrap.className = "reviews-summary";
    const stars = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));
    wrap.innerHTML = `
      <span class="reviews-summary__score">${avg}</span>
      <span class="reviews-summary__stars">${stars}</span>
      <span class="reviews-summary__count">${count} ${lang === "hi" ? "समीक्षाएं" : "reviews"}</span>
    `;
    container.appendChild(wrap);
  }

  function renderList(container, lang) {
    const L = window.AVADHESHA_I18N[lang];
    const list = approvedReviews();
    container.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "reviews-empty";
      empty.textContent = L.no_reviews_yet;
      container.appendChild(empty);
      return;
    }
    list.forEach(r => {
      const card = document.createElement("div");
      card.className = "review-card fade-in";
      const stars = r.rating ? "★".repeat(r.rating) + "☆".repeat(5 - r.rating) : "";
      card.innerHTML = `
        <div class="review-card__top">
          <span class="review-card__name">${AvadheshaData.sanitize(r.name)}</span>
          <span class="review-card__stars">${stars}</span>
        </div>
        ${r.eventType ? `<span class="review-card__tag">${AvadheshaData.sanitize(r.eventType)}</span>` : ""}
        <p class="review-card__text">${AvadheshaData.sanitize(r.review)}</p>
      `;
      container.appendChild(card);
    });
  }

  async function submitReview(payload) {
    const endpoint = window.AVADHESHA_CONFIG.sheets.reviewSubmitEndpoint;
    if (!endpoint) {
      return { ok: false, reason: "not_configured" };
    }
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors", // Apps Script Web Apps commonly require no-cors from the browser
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return { ok: true };
    } catch (err) {
      console.warn("[Avadhesha] Review submit failed:", err.message);
      return { ok: false, reason: "network" };
    }
  }

  return { setData, approvedReviews, averageRating, renderSummary, renderList, submitReview };
})();
