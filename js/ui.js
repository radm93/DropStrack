/* ============================================================
   ui.js — DropStrack UI Utilities (Steam 2003 Retro)
============================================================ */

/* ------------------------------------------------------------
   1. Fallback global de imágenes
------------------------------------------------------------ */
const FALLBACK_ITEM = "assets/fallback-item.png";

export function applyImageFallback(selector = "img") {
    const imgs = document.querySelectorAll(selector);

    imgs.forEach(img => {
        img.addEventListener("error", () => {
            img.src = FALLBACK_ITEM;
        }, { once: true });
    });
}

/* ------------------------------------------------------------
   2. Agregar clase de hover retro (CSS controla el diseño)
------------------------------------------------------------ */
export function enableRetroHover() {
    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.add("retro-hover");
    });
}

/* ------------------------------------------------------------
   3. Animación retro Glow (útil para timers, counters, etc)
------------------------------------------------------------ */
export function retroGlow(el) {
    if (!el) return;
    el.classList.add("retro-glow");
    setTimeout(() => el.classList.remove("retro-glow"), 180);
}

/* ------------------------------------------------------------
   4. Sutil pulso retro
------------------------------------------------------------ */
export function retroPulse(el) {
    if (!el) return;
    el.classList.add("retro-pulse");
    setTimeout(() => el.classList.remove("retro-pulse"), 200);
}

/* ------------------------------------------------------------
   5. Logging estilo 2003
------------------------------------------------------------ */
export function retroLog(msg) {
    console.log(`[DropStrack 2003 UI] ${msg}`);
}

/* ------------------------------------------------------------
   6. Inicialización global UI
------------------------------------------------------------ */
export function initUI() {
    applyImageFallback();
    enableRetroHover();
    retroLog("UI retro initialized.");
}

/* ------------------------------------------------------------
   7. Exponer para debugging
------------------------------------------------------------ */
window.DropStrackUI = {
    applyImageFallback,
    enableRetroHover,
    retroGlow,
    retroPulse,
    retroLog
};
