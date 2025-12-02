/* ============================================================
   SERVER STATUS — Using steamstat.us API
============================================================ */

const API_URL = "https://steamstat.us/status.json";

/* DOM */
const panel = document.getElementById("server-status-panel");
const toggleBtn = document.getElementById("server-status-toggle");
const summaryText = document.getElementById("server-status-summary");
const headerBar = document.getElementById("server-status-header");

const globalList = document.getElementById("ss-global-list");
const regionList = document.getElementById("ss-region-list");

/* Toggle accordion */
headerBar.addEventListener("click", () => {
    const expanded = panel.classList.toggle("expanded");
    toggleBtn.textContent = expanded ? "▲" : "▼";
});

/* Fetch data */
async function loadServerStatus() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // GLOBAL SERVICES
        const services = data.services;

        const globalItems = [
            ["Matchmaking", services.matchmaking.online],
            ["Inventory", services.csgo_community.inventory],
            ["Community", services.community.online],
            ["Store", services.store.online]
        ];

        globalList.innerHTML = "";
        globalItems.forEach(([name, status]) => {
            globalList.innerHTML += `<li>${name}: ${formatStatus(status)}</li>`;
        });

        // SUMMARY (top line)
        const allGood = globalItems.every(item => item[1] === true);
        summaryText.innerHTML = allGood 
            ? `<span class="status-online">ONLINE</span>` 
            : `<span class="status-slow">ISSUES</span>`;

        // REGIONAL SERVERS (filtered)
        const regions = data.cmg;
        const wantedRegions = ["EU West", "EU East", "US East", "US West"];

        regionList.innerHTML = "";
        wantedRegions.forEach(region => {
            const entry = regions[region];
            if (!entry) return;

            const flag = getFlag(region);

            regionList.innerHTML += `
                <li>${flag} ${region}: ${formatStatus(entry.online)}</li>
            `;
        });

    } catch (err) {
        summaryText.innerHTML = `<span class="status-offline">ERROR</span>`;
        console.error("Server status error:", err);
    }
}

/* Helpers */
function formatStatus(state) {
    if (state === true) return `<span class="status-online">Online</span>`;
    if (state === false) return `<span class="status-offline">Offline</span>`;
    return `<span class="status-slow">Slow</span>`;
}

/* Flags by region */
function getFlag(region) {
    if (region.includes("US")) return "🇺🇸";
    if (region.includes("EU West")) return "🇬🇧";
    if (region.includes("EU East")) return "🇩🇪";
    return "🌐";
}

/* Start */
loadServerStatus();
setInterval(loadServerStatus, 60000);
