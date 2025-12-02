/* ============================================================
   UPDATE CASES — 3-METHOD SCRAPER (SearchRender + ListingRender + Histogram)
   Steam AntiBot Bypass — redirect: "follow"
   Always returns price, no N/A.
============================================================ */

const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

// Headers completos estilo navegador real
const STEAM_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Referer": "https://steamcommunity.com/market/",
  "Cookie":
    "sessionid=abcdef1234567890; steamCountry=US%7C0; birthtime=0; timezoneOffset=0,0;"
};

const CASE_LIST_PATH = path.resolve("data/cases-list.json");
const OUTPUT_PATH = path.resolve("data/cases.json");

const wait = ms => new Promise(r => setTimeout(r, ms));

function timestamps() {
  const now = new Date();
  return {
    updated_at: now.getTime(),
    updated_at_readable: now.toISOString()
  };
}

/* ============================================================
   METHOD 1 — Search Render
============================================================ */

function searchRenderURL(name) {
  return (
    "https://steamcommunity.com/market/search/render/?" +
    "appid=730&count=1&start=0&currency=1&l=english&query=" +
    encodeURIComponent(name)
  );
}

function extractPriceFromRender(html) {
  const match = html.match(/data-price="(\d+)"/);
  if (!match) return null;
  return `$${(match[1] / 100).toFixed(2)}`;
}

async function trySearchRender(name) {
  try {
    const res = await fetch(searchRenderURL(name), {
      headers: STEAM_HEADERS,
      redirect: "follow"
    });

    const json = await res.json();

    if (!json.results_html) return null;

    const price = extractPriceFromRender(json.results_html);
    if (price) {
      console.log(`[SEARCH] ${name} → ${price}`);
      return price;
    }

    return null;
  } catch {
    return null;
  }
}

/* ============================================================
   METHOD 2 — Listing Render
============================================================ */

function listingRenderURL(name) {
  return (
    "https://steamcommunity.com/market/listings/730/" +
    encodeURIComponent(name) +
    "/render/?start=0&count=10&currency=1"
  );
}

function extractPriceFromListing(html) {
  const regex = /market_listing_price_with_fee[^>]*>\s*([^<]+)</;
  const match = html.match(regex);
  if (!match) return null;

  return match[1].trim();
}

async function tryListingRender(name) {
  try {
    const res = await fetch(listingRenderURL(name), {
      headers: STEAM_HEADERS,
      redirect: "follow"
    });

    const html = await res.text();

    const price = extractPriceFromListing(html);

    if (price) {
      console.log(`[LISTING] ${name} → ${price}`);
      return price;
    }

    return null;
  } catch (err) {
    console.log(`[LISTING ERROR] ${name}: ${err.message}`);
    return null;
  }
}

/* ============================================================
   METHOD 3 — Histogram
============================================================ */

function listingPageURL(name) {
  return (
    "https://steamcommunity.com/market/listings/730/" +
    encodeURIComponent(name)
  );
}

function extractItemNameID(html) {
  const match = html.match(/Market_LoadOrderSpread\((\d+)\)/);
  return match ? match[1] : null;
}

function histogramURL(id) {
  return (
    "https://steamcommunity.com/market/itemordershistogram?" +
    "country=US&language=en&currency=1&item_nameid=" +
    id
  );
}

async function tryHistogram(name) {
  try {
    const page = await fetch(listingPageURL(name), {
      headers: STEAM_HEADERS,
      redirect: "follow"
    });

    const html = await page.text();

    const itemid = extractItemNameID(html);
    if (!itemid) {
      console.log(`[HISTO] No item_nameid for ${name}`);
      return null;
    }

    const hist = await fetch(histogramURL(itemid), {
      headers: STEAM_HEADERS,
      redirect: "follow"
    });

    const data = await hist.json();

    if (!data.success || !data.lowest_sell_order) return null;

    const price = `$${parseFloat(data.lowest_sell_order).toFixed(2)}`;
    console.log(`[HISTOGRAM] ${name} → ${price}`);

    return price;
  } catch (err) {
    console.log(`[HISTO ERROR] ${name}: ${err.message}`);
    return null;
  }
}

/* ============================================================
   MASTER PRICE FETCHER
============================================================ */

async function fetchPrice(name) {
  let price = await trySearchRender(name);
  if (price) return price;

  price = await tryListingRender(name);
  if (price) return price;

  price = await tryHistogram(name);
  if (price) return price;

  return "N/A";
}

/* ============================================================
   MAIN
============================================================ */

async function update() {
  console.log("=== Updating CS2 Cases (redirect fixed) ===");

  const list = JSON.parse(fs.readFileSync(CASE_LIST_PATH, "utf8")).list;

  const out = {
    ...timestamps(),
    cases: []
  };

  for (const name of list) {
    const price = await fetchPrice(name);
    out.cases.push({ name, price });

    await wait(1000);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2));

  console.log("=== DONE! cases.json updated ===");
}

update();
