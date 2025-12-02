/* ============================================================
   CS2/CSGO CASES — Release Date Database + Filters
============================================================ */

/* ------------------------------------------------------------
   IMAGE MAP
------------------------------------------------------------ */
const IMAGE_MAP = {
  "CS20 Case": "CS20_Case.webp",
  "CS:GO Weapon Case": "CS_GO_Weapon_Case.webp",
  "CS:GO Weapon Case 2": "CS_GO_Weapon_Case_2.webp",
  "CS:GO Weapon Case 3": "CS_GO_Weapon_Case_3.webp",

  "Chroma 2 Case": "Chroma_2_Case.webp",
  "Chroma 3 Case": "Chroma_3_Case.webp",
  "Chroma Case": "Chroma_Case.webp",

  "Clutch Case": "Clutch_Case.webp",
  "Danger Zone Case": "Danger_Zone_Case.webp",
  "Dreams & Nightmares Case": "Dreams_&_Nightmares_Case.webp",

  "Falchion Case": "Falchion_Case.webp",
  "Fever Case": "Fever_Case.webp",
  "Fracture Case": "Fracture_Case.webp",

  "Gallery Case": "Gallery_Case.webp",

  "Gamma 2 Case": "Gamma_2_Case.webp",
  "Gamma Case": "Gamma_Case.webp",
  "Glove Case": "Glove_Case.webp",

  "Horizon Case": "Horizon_Case.webp",
  "Huntsman Weapon Case": "Huntsman_Weapon_Case.webp",

  "Kilowatt Case": "Kilowatt_Case.webp",

  "Operation Bravo Case": "Operation_Bravo_Case.webp",
  "Operation Breakout Weapon Case": "Operation_Breakout_Weapon_Case.webp",
  "Operation Broken Fang Case": "Operation_Broken_Fang_Case.png",
  "Operation Hydra Case": "Operation_Hydra_Case.webp",
  "Operation Phoenix Weapon Case": "Operation_Phoenix_Weapon_Case.webp",
  "Operation Vanguard Weapon Case": "Operation_Vanguard_Weapon_Case.webp",
  "Operation Wildfire Case": "Operation_Wildfire_Case.webp",

  "Operation Riptide Case": "Operation_Riptide_Case.webp",
  "Shattered Web Case": "Shattered_Web_Case.webp",
  "Anubis Collection Package": "Anubis_Collection_Package.webp",

  "Prisma 2 Case": "Prisma_2_Case.webp",
  "Prisma Case": "Prisma_Case.webp",

  "Recoil Case": "Recoil_Case.webp",
  "Revolution Case": "Revolution_Case.webp",
  "Revolver Case": "Revolver_Case.webp",

  "Sealed Genesis Terminal": "Sealed_Genesis_Terminal.webp",

  "Shadow Case": "Shadow_Case.webp",
  "Snakebite Case": "Snakebite_Case.webp",

  "Spectrum 2 Case": "Spectrum_2_Case.webp",
  "Spectrum Case": "Spectrum_Case.webp",

  "Winter Offensive Weapon Case": "Winter_Offensive_Weapon_Case.webp",

  "X-Ray P250 Package": "X-Ray_P250_Package.png",

  "eSports 2013 Case": "eSports_2013_Case.png",
  "eSports 2013 Winter Case": "eSports_2013_Winter_Case.png",
  "eSports 2014 Summer Case": "eSports_2014_Summer_Case.png"
};


/* ------------------------------------------------------------
   INIT
------------------------------------------------------------ */
export async function initCases() {
  const section = document.getElementById("cases-section");
  if (!section) return;

  const url = "data/cases.json";

  let data;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    data = await res.json();
  } catch (e) {
    section.innerHTML = "<p>Error loading cases.json</p>";
    return;
  }

  const cases = data.cases.map(c => ({
    ...c,
    release_year: c.release_date.split("-")[0]
  }));

  section.innerHTML = `
    <div id="cases-filters"></div>
    <div id="cases-grid" class="cases-grid"></div>
  `;

  const grid = document.getElementById("cases-grid");
  const filters = document.getElementById("cases-filters");

  /* ========= FILTER BAR ========== */
  filters.innerHTML = `
    <div class="cases-filters">

        <div class="filter-group">
            <label>Year</label>
            <select id="filter-year">
                <option value="all">All</option>
                ${[...new Set(cases.map(c => c.release_year))]
                  .sort((a,b) => b - a)
                  .map(y => `<option value="${y}">${y}</option>`).join("")}
            </select>
        </div>

        <div class="filter-group">
            <label>Order</label>
            <select id="filter-order">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
            </select>
        </div>

        <div class="filter-group full">
            <label>Search</label>
            <input id="filter-search" type="text" placeholder="Search cases…">
        </div>

    </div>
  `;

  /* ========= RENDER FUNCTION ========== */
  function renderCases(list) {
    grid.innerHTML = "";

    list.forEach(c => {
      const img = IMAGE_MAP[c.name]
        ? `./assets/cases/${IMAGE_MAP[c.name]}`
        : "./assets/placeholder.png";

      const card = document.createElement("div");
      card.className = "case-card";

      card.innerHTML = `
        <div class="case-name">${c.name}</div>

        <div class="case-img-box">
            <img src="${img}" class="case-img" alt="${c.name}">
        </div>

        <div class="case-info">
            <small>Added on</small>
            <div class="case-date">${c.release_date}</div>
        </div>

        <a class="case-button"
           href="https://steamcommunity.com/market/listings/730/${encodeURIComponent(c.name)}"
           target="_blank">
           View on Steam
        </a>
      `;

      grid.appendChild(card);
    });
  }

  /* ========= SORTING ========= */
  function sortNewest(list) {
    return [...list].sort((a,b) =>
      new Date(b.release_date) - new Date(a.release_date)
    );
  }

  let filtered = sortNewest(cases);
  renderCases(filtered);

  /* ========= FILTER LOGIC ========= */
  const yearSel = document.getElementById("filter-year");
  const orderSel = document.getElementById("filter-order");
  const searchInput = document.getElementById("filter-search");

  function applyFilters() {
    let list = [...cases];

    if (yearSel.value !== "all") {
      list = list.filter(c => c.release_year === yearSel.value);
    }

    if (searchInput.value.trim() !== "") {
      const q = searchInput.value.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }

    if (orderSel.value === "newest") {
      list = sortNewest(list);
    } else {
      list = [...list].sort((a,b) =>
        new Date(a.release_date) - new Date(b.release_date)
      );
    }

    renderCases(list);
  }

  yearSel.addEventListener("change", applyFilters);
  orderSel.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);
}
