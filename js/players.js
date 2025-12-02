// =========================================================
// UTIL — number formatting
// =========================================================
function formatNumber(num) {
    if (num === null || num === undefined) return "--";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// =========================================================
// Wait for DOM element (safe load)
// =========================================================
function waitForElement(id) {
    return new Promise(resolve => {
        const check = setInterval(() => {
            const el = document.getElementById(id);
            if (el) {
                clearInterval(check);
                resolve(el);
            }
        }, 50);
    });
}

// =========================================================
// Load CS2 stats
// =========================================================
async function loadCS2Stats(headerEl) {
    const apiURL = "https://ds-players-proxy.dropstrackw.workers.dev/api/stats";

    try {
        const res = await fetch(apiURL);
        if (!res.ok) throw new Error("Bad response");

        const data = await res.json();
        console.log("[DropStrack 2003 UI] Stats:", data);

        headerEl.textContent = formatNumber(data.current);

    } catch (err) {
        console.error("[DropStrack 2003 UI] Error loading stats:", err);
        headerEl.textContent = "--";
    }
}

// =========================================================
// Public initializer
// =========================================================
export async function initPlayers() {

    // Wait for the header element
    const headerEl = await waitForElement("players-current-header");

    // Load initial value
    loadCS2Stats(headerEl);

    // Auto-refresh every 60s
    setInterval(() => loadCS2Stats(headerEl), 60000);
}
