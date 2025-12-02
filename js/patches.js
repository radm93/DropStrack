/* ============================================================
   patches.js — Latest CS2 Updates (Steam 2003 Retro UI)
============================================================ */

const PATCH_API = "https://drops-api.dropstrackw.workers.dev/api/patch/cs2";

export async function initPatches() {
    console.log("[DropStrack 2003 UI] Loading patch notes...");

    const container = document.getElementById("updates-section");
    if (!container) return;

    container.innerHTML = `
        <div class="block-title">Latest CS2 Updates</div>
        <div class="loader">Loading updates...</div>
    `;

    try {
        const res = await fetch(PATCH_API);
        const patches = await res.json();

        container.innerHTML = `
            <div class="block-title">Latest CS2 Updates</div>
            <div class="updates-grid"></div>
        `;

        const grid = container.querySelector(".updates-grid");

        patches.forEach(update => {
            const card = document.createElement("div");
            card.className = "update-card";

            const date = new Date(update.date).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const cleanedExcerpt = update.excerpt
                .replace(/\\/g, "")
                .replace(/\s+/g, " ")
                .trim();

            card.innerHTML = `
                <div class="update-head">
                    <div class="update-title">${update.title}</div>
                    <div class="update-date">${date}</div>
                </div>

                <div class="update-excerpt">
                    ${cleanedExcerpt}
                </div>

                <div class="update-btn-wrapper">
                    <a href="${update.url}" target="_blank" class="update-btn">View Details</a>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading patch notes:", err);
        container.innerHTML = `
            <div class="block-title">Latest CS2 Updates</div>
            <div class="error-msg">Failed to load patch notes.</div>
        `;
    }
}
