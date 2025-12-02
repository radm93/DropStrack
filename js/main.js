/* =========================================================
   MAIN — INICIALIZACIÓN GLOBAL DE DROPSTRACK (STEAM 2003)
========================================================= */

import { initUI, retroLog } from "./ui.js";
import { initTimer } from "./timer.js";
import { initPatches } from "./patches.js";
import { initCounters } from "./counters.js";
import { initFAQ } from "./faq.js";
import { initPlayers } from "./players.js";
import { initCases } from "./cases.js";


/* ---------------------------------------------------------
   1. Año dinámico en el footer
--------------------------------------------------------- */
function initFooter() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
        const year = new Date().getFullYear();
        yearEl.textContent = `© ${year}`;
    }
}

/* ---------------------------------------------------------
   2. Inicialización principal
--------------------------------------------------------- */
function initDropStrack() {
    retroLog("Inicializando DropStrack (modo retro 2003)...");

    initUI();
    initTimer();
    initPatches();
    initCounters();
    initFAQ();
    initFooter();       // ✔️ AHORA EXISTE
    initPlayers();
    initCases();


    retroLog("DropStrack completamente iniciado.");
}

/* ---------------------------------------------------------
   3. Ejecutar cuando cargue el DOM
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", initDropStrack);

/* ---------------------------------------------------------
   4. Exponer funciones para debug
--------------------------------------------------------- */
window.DropStrack = {
    initDropStrack,
    initFooter
};
