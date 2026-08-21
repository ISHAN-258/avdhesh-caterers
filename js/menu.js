/**
 * menu.js — renders the browsable menu grid + search/filter, and keeps
 * the "selected plate" state used by the builder/calculator/whatsapp flow.
 */
const AvadheshaMenu = (() => {
  let allItems = [];
  let categories = []; // [{slug, en, hi}]
  let selected = new Map(); // item_slug -> item
  let activeCategory = "all";
  let searchTerm = "";
  let currentLang = "en";
  const listeners = [];

  function normalizeImageUrl(url) {
    if (!url) return "";

    let value = String(url).trim();

    // Google Drive:
    // https://drive.google.com/file/d/FILE_ID/view
    let match = value.match(
      /drive\.google\.com\/file\/d\/([^/]+)/
    );

    if (match) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }

    // Google Drive:
    // https://drive.google.com/open?id=FILE_ID
    match = value.match(
      /drive\.google\.com\/open\?id=([^&]+)/
    );

    if (match) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }

    // Google Drive:
    // https://drive.google.com/uc?id=FILE_ID
    match = value.match(
      /drive\.google\.com\/uc\?(?:[^#]*&)?id=([^&]+)/
    );

    if (match) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }

    // Googleusercontent image
    if (
      value.includes("googleusercontent.com") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return value;
  }

  function onSelectionChange(fn) {
    listeners.push(fn);
  }

  function notify() {
    listeners.forEach(fn => fn(getSelectedItems()));
  }

  function setData(items) {
    allItems = items;

    const map = new Map();

    items.forEach(it => {
      if (!map.has(it.category_slug)) {
        map.set(it.category_slug, {
          slug: it.category_slug,
          en: it.category_en,
          hi: it.category_hi
        });
      }
    });

    categories = Array.from(map.values());
  }

  function setLang(lang) {
    currentLang = lang;
  }

  function getSelectedItems() {
    return Array.from(selected.values());
  }

  function toggleItem(slug) {
    const item = allItems.find(
      i => i.item_slug === slug
    );

    if (!item || item.price == null) return;

    if (selected.has(slug)) {
      selected.delete(slug);
    } else {
      selected.set(slug, item);
    }

    notify();
  }

  function removeItem(slug) {
    selected.delete(slug);
    notify();
  }

  function clearSelection() {
    selected.clear();
    notify();
  }

  function filteredItems() {
    const term = searchTerm.trim().toLowerCase();

    return allItems.filter(it => {
      const inCategory =
        activeCategory === "all" ||
        it.category_slug === activeCategory;

      if (!inCategory) return false;

      if (!term) return true;

      return (
        it.item_en.toLowerCase().includes(term) ||
        it.item_hi.includes(searchTerm.trim()) ||
        it.category_en.toLowerCase().includes(term) ||
        it.category_hi.includes(searchTerm.trim())
      );
    });
  }

  function groupByCategory(items) {
    const groups = new Map();

    items.forEach(it => {
      if (!groups.has(it.category_slug)) {
        groups.set(it.category_slug, []);
      }

      groups
        .get(it.category_slug)
        .push(it);
    });

    return groups;
  }

  function renderFilters(container, onFilterChange) {
    const L =
      window.AVADHESHA_I18N[currentLang];

    container.innerHTML = "";

    const allBtn =
      document.createElement("button");

    allBtn.className =
      "chip" +
      (activeCategory === "all"
        ? " chip--active"
        : "");

    allBtn.textContent = L.filter_all;

    allBtn.addEventListener(
      "click",
      () => {
        activeCategory = "all";
        onFilterChange();
      }
    );

    container.appendChild(allBtn);

    categories.forEach(cat => {
      const btn =
        document.createElement("button");

      btn.className =
        "chip" +
        (activeCategory === cat.slug
          ? " chip--active"
          : "");

      btn.textContent =
        currentLang === "hi"
          ? cat.hi
          : cat.en;

      btn.addEventListener(
        "click",
        () => {
          activeCategory = cat.slug;
          onFilterChange();
        }
      );

      container.appendChild(btn);
    });
  }

  function renderGrid(container) {
    const L =
      window.AVADHESA_I18N[currentLang];

    const items = filteredItems();

    // DEBUG — image data check
    console.log(
      "MENU FIRST ITEM:",
      items[0]
    );

    console.log(
      "IMAGE LINK:",
      items[0]?.image_link
    );

    console.log(
      "IMAGE TYPE:",
      typeof items[0]?.image_link
    );

    const groups =
      groupByCategory(items);

    container.innerHTML = "";

    if (!items.length) {
      const empty =
        document.createElement("p");

      empty.className =
        "menu-empty";

      empty.textContent =
        currentLang === "hi"
          ? "कोई डिश नहीं मिली।"
          : "No dishes found.";

      container.appendChild(empty);

      return;
    }

    groups.forEach(
      (groupItems, slug) => {
        const catMeta =
          categories.find(
            c => c.slug === slug
          ) || {
            en: slug,
            hi: slug
          };

        const section =
          document.createElement("div");

        section.className =
          "menu-group fade-in";

        const heading =
          document.createElement("h3");

        heading.className =
          "menu-group__title";

        heading.textContent =
          currentLang === "hi"
            ? catMeta.hi
            : catMeta.en;

        section.appendChild(heading);

        const grid =
          document.createElement("div");

        grid.className =
          "menu-grid";

        groupItems.forEach(item => {
          const card =
            document.createElement("div");

          const isSelected =
            selected.has(
              item.item_slug
            );

          card.className =
            "menu-card" +
            (isSelected
              ? " menu-card--selected"
              : "");

          /*
           * -------------------------
           * FOOD IMAGE
           * -------------------------
           */

          if (item.image_link) {
            const imageWrap =
              document.createElement("div");

            imageWrap.className =
              "menu-card__image-wrap";

            const img =
              document.createElement("img");

            img.className =
              "menu-card__image";

            img.loading = "lazy";

            img.alt =
              currentLang === "hi"
                ? item.item_hi
                : item.item_en;

            const imageUrl =
              normalizeImageUrl(
                item.image_link
              );

            console.log(
              "IMAGE FOR:",
              item.item_en,
              imageUrl
            );

            img.src = imageUrl;

            img.addEventListener(
              "load",
              () => {
                console.log(
                  "IMAGE LOADED:",
                  item.item_en
                );
              }
            );

            img.addEventListener(
              "error",
              () => {
                console.warn(
                  "IMAGE FAILED:",
                  item.item_en,
                  imageUrl
                );

                imageWrap.remove();
              }
            );

            imageWrap.appendChild(img);

            card.appendChild(imageWrap);
          }

          /*
           * -------------------------
           * ITEM NAME
           * -------------------------
           */

          const name =
            document.createElement("div");

          name.className =
            "menu-card__name";

          name.textContent =
            currentLang === "hi"
              ? item.item_hi
              : item.item_en;

          /*
           * -------------------------
           * PRICE
           * -------------------------
           */

          const sub =
            document.createElement("div");

          sub.className =
            "menu-card__sub";

          sub.textContent =
            item.price != null
              ? `${AvadheshaCalculator.formatINR(
                  item.price
                )} · ${L.per_plate}`
              : L.unavailable;

          /*
           * -------------------------
           * ADD BUTTON
           * -------------------------
           */

          const btn =
            document.createElement("button");

          btn.type = "button";

          btn.className =
            "menu-card__btn" +
            (isSelected
              ? " menu-card__btn--added"
              : "");

          btn.disabled =
            item.price == null;

          btn.textContent =
            isSelected
              ? `✓ ${L.added_to_plate}`
              : `+ ${L.add_to_plate}`;

          btn.addEventListener(
            "click",
            () => {
              toggleItem(
                item.item_slug
              );
            }
          );

          card.appendChild(name);
          card.appendChild(sub);
          card.appendChild(btn);

          grid.appendChild(card);
        });

        section.appendChild(grid);

        container.appendChild(section);
      }
    );
  }

  function setSearchTerm(term) {
    searchTerm = term;
  }

  return {
    setData,
    setLang,
    getSelectedItems,
    toggleItem,
    removeItem,
    clearSelection,
    renderFilters,
    renderGrid,
    setSearchTerm,
    onSelectionChange,

    get categories() {
      return categories;
    },

    get allItems() {
      return allItems;
    }
  };
})();
