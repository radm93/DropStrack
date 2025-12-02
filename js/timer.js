/* ============================================================
   timer.js — Weekly Drop Reset (Steam 2003 Retro UI)
============================================================ */

import { retroLog } from "./ui.js";

/* ------------------------------------------------------------
   OFFICIAL WEEKLY RESET TIME → Wednesday 02:00 UTC
------------------------------------------------------------ */
const RESET_UTC_DAY = 3;   // Wednesday
const RESET_UTC_HOUR = 2;
const RESET_UTC_MIN = 0;

/* ------------------------------------------------------------
   Compute next reset date
------------------------------------------------------------ */
function getNextResetDate() {
    const now = new Date();
    const next = new Date();

    next.setUTCDate(
        now.getUTCDate() +
        ((RESET_UTC_DAY + 7 - now.getUTCDay()) % 7)
    );

    next.setUTCHours(RESET_UTC_HOUR, RESET_UTC_MIN, 0, 0);

    if (next <= now) next.setUTCDate(next.getUTCDate() + 7);

    return next;
}

/* ------------------------------------------------------------
   Padding helper
------------------------------------------------------------ */
const pad = n => n.toString().padStart(2, "0");

/* ------------------------------------------------------------
   Dynamic message
------------------------------------------------------------ */
function getDynamicMessage(diff) {
    if (diff <= 0) return "The weekly reset just occurred!";

    const hrs = diff / 36e5;

    if (hrs < 1)  return "The weekly reset is happening now!";
    if (hrs < 6)  return "Approaching the next weekly reset.";
    if (hrs < 24) return "A new weekly reset is coming soon.";
    if (hrs < 48) return "We're getting closer to the next weekly reset.";

    return "The next weekly reset is scheduled normally.";
}

/* ------------------------------------------------------------
   Render structure (NO extra panel!)
------------------------------------------------------------ */
function renderTimer(container) {
    container.innerHTML = `
        <div id="timer-status" class="timer-status"></div>

        <div class="timer-grid">

            <div class="timer-box">
                <div id="t-days" class="timer-number">00</div>
                <div class="timer-label">Days</div>
            </div>

            <div class="timer-box">
                <div id="t-hours" class="timer-number">00</div>
                <div class="timer-label">Hours</div>
            </div>

            <div class="timer-box">
                <div id="t-mins" class="timer-number">00</div>
                <div class="timer-label">Minutes</div>
            </div>

            <div class="timer-box">
                <div id="t-secs" class="timer-number">00</div>
                <div class="timer-label">Seconds</div>
            </div>

        </div>
    `;
}

/* ------------------------------------------------------------
   MAIN INIT
------------------------------------------------------------ */
export function initTimer() {
    const container = document.getElementById("timer-section");
    if (!container) return retroLog("Timer container missing.");

    renderTimer(container);

    const msg = document.getElementById("timer-status");
    const d = document.getElementById("t-days");
    const h = document.getElementById("t-hours");
    const m = document.getElementById("t-mins");
    const s = document.getElementById("t-secs");

    function update() {
        const now = new Date();
        const next = getNextResetDate();
        const diff = next - now;

        d.textContent = pad(Math.floor(diff / 86400000));
        h.textContent = pad(Math.floor((diff / 3600000) % 24));
        m.textContent = pad(Math.floor((diff / 60000) % 60));
        s.textContent = pad(Math.floor((diff / 1000) % 60));

        msg.textContent = getDynamicMessage(diff);

        document.querySelectorAll(".timer-number").forEach(el => {
            el.classList.add("tick");
            setTimeout(() => el.classList.remove("tick"), 140);
        });
    }

    update();
    setInterval(update, 1000);

    retroLog("Timer initialized.");
}

window.DropStrackTimer = { initTimer };
