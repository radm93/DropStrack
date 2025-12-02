/* ============================================================
   FAQ Counters — DropStrack (Steam 2003 Retro UI)
============================================================ */

export async function initFAQ() {

    const container = document.getElementById("faq-section");
    if (!container) return;

    /* ------------------------------------------------------------
       1) Obtener datos del Worker
    ------------------------------------------------------------ */
    let data;
    try {
        data = await fetch("https://drops-api.dropstrackw.workers.dev/api/cs2/timers")
            .then(r => r.json());
    } catch (err) {
        console.error("FAQ API error:", err);
        return;
    }

    const lastCase = data.last_case;
    const lastOp   = data.last_operation;

    /* ------------------------------------------------------------
       2) Normalizar atributos para que NUNCA falle
          (si no existe image → usar img)
    ------------------------------------------------------------ */
    const caseImg = lastCase.image ?? lastCase.img ?? "";
    const opImg   = lastOp.image   ?? lastOp.img   ?? "";

    const caseDate = lastCase.date ?? "";
    const opDate   = lastOp.date   ?? "";

    /* ------------------------------------------------------------
       3) Insertar datos en el HTML
    ------------------------------------------------------------ */
    document.getElementById("faq-date-case").textContent = formatDateEN(caseDate);
    document.getElementById("faq-date-op").textContent   = formatDateEN(opDate);

    document.getElementById("faq-img-case").src = caseImg;
    document.getElementById("faq-img-op").src   = opImg;

    /* ------------------------------------------------------------
       4) Iniciar contadores
    ------------------------------------------------------------ */
    startFAQCounter("faq-counter-case", caseDate);
    startFAQCounter("faq-counter-op",   opDate);
}


/* ============================================================
   FORMATEAR FECHAS A ESTILO ENGLISH
============================================================ */
function formatDateEN(iso) {
    if (!iso) return "Unknown";

    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


/* ============================================================
   CONTADOR (Días - Horas - Minutos - Segundos)
============================================================ */
function startFAQCounter(id, date) {
    const el = document.getElementById(id);
    if (!el || !date) return;

    const target = new Date(date).getTime();

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
    }

    update();
    setInterval(update, 1000);
}
