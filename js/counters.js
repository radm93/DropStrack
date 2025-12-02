/* ============================================================
   counters.js — Retro Counters (Steam 2003 UI)
============================================================ */

export async function initCounters() {
    console.log("[DropStrack 2003 UI] Starting counters...");

    const container = document.getElementById("counters-section");
    if (!container) return;

    let data;
    try {
        data = await fetch("https://drops-api.dropstrackw.workers.dev/api/cs2/timers")
            .then(r => r.json());
    } catch (err) {
        console.error("Error loading timers API:", err);
        container.innerHTML = "<p class='error-msg'>Failed to load counters.</p>";
        return;
    }

    const LAST_CASE_DATE      = data.last_case.date;
    const LAST_OPERATION_DATE = data.last_operation.date;

    const IMG_CASE      = data.last_case.img;
    const IMG_OPERATION = data.last_operation.img;

    /* Rendering */
    container.innerHTML = `
        <div class="block-title">CS2 Case & Operation Timers</div>

        <div class="counter-grid">

            <!-- Case Timer -->
            <div class="counter-card age-mid" id="card-cases">
                <img class="counter-icon" src="${IMG_CASE}">
                <div class="counter-label">Last Case Added</div>
                <div id="counter-cases" class="counter-time"></div>
            </div>

            <!-- Operation Timer -->
            <div class="counter-card age-high" id="card-operation">
                <img class="counter-icon" src="${IMG_OPERATION}">
                <div class="counter-label">Last Operation</div>
                <div id="counter-operation" class="counter-time"></div>
            </div>

        </div>
    `;

    /* Initialize both counters */
    startCounter("counter-cases", LAST_CASE_DATE, "card-cases");
    startCounter("counter-operation", LAST_OPERATION_DATE, "card-operation");
}


/* ============================================================
   Live Counter Function (Unified)
============================================================ */

export function startCounter(elementId, dateString, cardId) {
    const el = document.getElementById(elementId);
    const card = document.getElementById(cardId);

    const target = new Date(dateString).getTime();

    function update() {
        const now = Date.now();
        const diff = now - target;

        let seconds = Math.floor(diff / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours   = Math.floor(minutes / 60);
        let days    = Math.floor(hours / 24);

        hours   %= 24;
        minutes %= 60;
        seconds %= 60;

        el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        /* Color system (same as Steam UI look) */
        if (days < 150) {
            card.className = "counter-card age-low";
        } else if (days < 600) {
            card.className = "counter-card age-mid";
        } else {
            card.className = "counter-card age-high";
        }
    }

    update();
    setInterval(update, 1000);
}
