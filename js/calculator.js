/**
 * calculator.js — pure pricing logic, no DOM access.
 * Base Total = Selected Menu Cost × Guests
 * Discount   = Base Total × applicable %
 * Total      = Base Total − Discount
 */
const AvadheshaCalculator = (() => {
  function ratePerPlate(selectedItems) {
    return selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  function discountPercentFor(guests) {
    const tiers = window.AVADHESHA_CONFIG.discountTiers;
    for (const tier of tiers) {
      const withinMin = guests >= tier.min;
      const withinMax = tier.max === null || guests <= tier.max;
      if (withinMin && withinMax) return tier.percent;
    }
    return 0;
  }

  function quote(selectedItems, guests) {
    const perPlate = ratePerPlate(selectedItems);
    const g = Math.max(0, parseInt(guests, 10) || 0);
    const base = perPlate * g;
    const discountPercent = discountPercentFor(g);
    const discount = Math.round(base * (discountPercent / 100));
    const total = Math.round(base - discount);
    return {
      perPlate,
      guests: g,
      base: Math.round(base),
      discountPercent,
      discount,
      total,
    };
  }

  function formatINR(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  return { ratePerPlate, discountPercentFor, quote, formatINR };
})();
