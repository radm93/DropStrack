/**
 * i18n.js — Automatic language detection + DOM translation
 *
 * HOW IT WORKS:
 *   1. window.LANG and window.T are set SYNCHRONOUSLY when this script loads
 *      (this happens in <head> before the DOM exists — no DOM access here).
 *   2. The actual DOM translation (setting textContent on [data-i18n] elements)
 *      is deferred to DOMContentLoaded so the body exists before we touch it.
 *   3. app.js (loaded at end of <body>) can safely use window.T and window.LANG
 *      because they are already set by step 1.
 */

/* ── TRANSLATIONS ────────────────────────────────── */
var TRANSLATIONS = {
  en: {
    eyebrow:      'Weekly Care Package Reset',
    h1Line1:      'NEXT DROP',
    h1Line2:      'RESET',
    heroDesc:     'Every Wednesday at 01:00 GMT · Prime Status Required',
    timerLabel:   'Countdown to Weekly Reset',
    days:         'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs',
    weekStart:    'Week start', weekReset: 'Reset',
    scrollHint:   'scroll',
    localLabel:   'Local', nextLabel: 'Next',
    statReset:    'Resets every', statXpLabel: 'XP needed',
    statXp:       'Official Valve servers',
    statItems:    'Items / drop', statItemsSub: 'Pick 2 of 4',
    statPrime:    'Required', statCases: 'Active cases', statDropPool: 'Drop pool',
    activeTitle:  'Active Drop Pool',
    activeSub:    'Weekly Care Package cases', activeBadge: 'Active',
    allTitle:     'All CS2 Cases', allSub: 'Full Steam Market',
    howTitle:     'How It Works',
    s1t: 'Get Prime',
    s1p: 'Prime Status required. One-time purchase of $14.99 on Steam.',
    s2t: 'Wait for Reset',
    s2p: 'Every Wednesday at 01:00 GMT the weekly cycle resets.',
    s3t: 'Earn 5,000 XP',
    s3p: 'Play on official Valve servers. First rank-up of the week unlocks your drop.',
    s4t: 'Claim Reward',
    s4p: 'Choose 2 of 4 presented items. Appears after the match or in Store → Home.',
    sortDefault:  'Default', sortPriceAsc: 'Price ↑',
    sortPriceDesc:'Price ↓', sortNameAsc: 'Name A→Z',
    priceNote:    'Prices updated every 6h — GitHub Actions + Steam Market',
    loadingPrices:'Loading prices…',
    pricesAt:     'Prices cached at',
    pricesFail:   'Prices unavailable — check api/prices.json',
    noPrice:      'N/A', market: '→ Market',
  },
  es: {
    eyebrow:      'Reset del Weekly Care Package',
    h1Line1:      'PRÓXIMO DROP',
    h1Line2:      'RESET',
    heroDesc:     'Cada miércoles a las 01:00 GMT · Requiere Prime Status',
    timerLabel:   'Cuenta regresiva al reset semanal',
    days:         'Días', hours: 'Horas', mins: 'Min', secs: 'Seg',
    weekStart:    'Inicio semana', weekReset: 'Reset',
    scrollHint:   'bajar',
    localLabel:   'Local', nextLabel: 'Próximo',
    statReset:    'Resetea cada', statXpLabel: 'XP necesario',
    statXp:       'Servidores oficiales Valve',
    statItems:    'Ítems por drop', statItemsSub: 'Elegís 2 de 4',
    statPrime:    'Requerido', statCases: 'Cajas activas', statDropPool: 'Drop pool',
    activeTitle:  'Active Drop Pool',
    activeSub:    'Cajas del Weekly Care Package', activeBadge: 'Activo',
    allTitle:     'Todas las Cajas CS2', allSub: 'Mercado completo de Steam',
    howTitle:     'Cómo Funciona',
    s1t: 'Tené Prime',
    s1p: 'Sin Prime Status no recibís drops. Compra única de $14.99 en Steam.',
    s2t: 'Esperá el reset',
    s2p: 'Cada miércoles a las 01:00 GMT se reinicia el ciclo semanal.',
    s3t: 'Ganá 5.000 XP',
    s3p: 'Jugá en servidores oficiales Valve. El primer rank-up de la semana desbloquea el drop.',
    s4t: 'Reclamá la recompensa',
    s4p: 'Se te presentan 4 ítems, elegís 2. Aparece post-partida o en Tienda → Inicio.',
    sortDefault:  'Por defecto', sortPriceAsc: 'Precio ↑',
    sortPriceDesc:'Precio ↓',   sortNameAsc: 'Nombre A→Z',
    priceNote:    'Precios actualizados cada 6h — GitHub Actions + Steam Market',
    loadingPrices:'Cargando precios…',
    pricesAt:     'Precios cacheados a las',
    pricesFail:   'Precios no disponibles — revisá api/prices.json',
    noPrice:      'N/D', market: '→ Mercado',
  },
  pt: {
    eyebrow:      'Reset do Weekly Care Package',
    h1Line1:      'PRÓXIMO DROP',
    h1Line2:      'RESET',
    heroDesc:     'Toda quarta às 01:00 GMT · Prime Status obrigatório',
    timerLabel:   'Contagem regressiva para o reset semanal',
    days:         'Dias', hours: 'Horas', mins: 'Min', secs: 'Seg',
    weekStart:    'Início semana', weekReset: 'Reset',
    scrollHint:   'rolar',
    localLabel:   'Local', nextLabel: 'Próximo',
    statReset:    'Reseta a cada', statXpLabel: 'XP necessário',
    statXp:       'Servidores oficiais Valve',
    statItems:    'Itens / drop', statItemsSub: 'Escolha 2 de 4',
    statPrime:    'Obrigatório', statCases: 'Caixas ativas', statDropPool: 'Drop pool',
    activeTitle:  'Active Drop Pool',
    activeSub:    'Caixas do Weekly Care Package', activeBadge: 'Ativo',
    allTitle:     'Todas as Caixas CS2', allSub: 'Mercado completo Steam',
    howTitle:     'Como Funciona',
    s1t: 'Tenha Prime',
    s1p: 'Prime obrigatório. Compra única de $14.99 na Steam.',
    s2t: 'Espere o reset',
    s2p: 'Toda quarta às 01:00 GMT o ciclo reinicia.',
    s3t: 'Ganhe 5.000 XP',
    s3p: 'Jogue em servidores oficiais Valve. Primeiro rank-up libera o drop.',
    s4t: 'Resgate a recompensa',
    s4p: 'Escolha 2 de 4 itens. Aparece após a partida ou em Loja → Início.',
    sortDefault:  'Padrão', sortPriceAsc: 'Preço ↑',
    sortPriceDesc:'Preço ↓', sortNameAsc: 'Nome A→Z',
    priceNote:    'Preços atualizados a cada 6h — GitHub Actions + Steam Market',
    loadingPrices:'Carregando preços…',
    pricesAt:     'Preços em cache às',
    pricesFail:   'Preços indisponíveis — verifique api/prices.json',
    noPrice:      'N/D', market: '→ Mercado',
  },
  ru: {
    eyebrow:      'Сброс еженедельного пакета',
    h1Line1:      'СЛЕДУЮЩИЙ ДРОП',
    h1Line2:      'СБРОС',
    heroDesc:     'Каждую среду в 01:00 GMT · Требуется Prime Status',
    timerLabel:   'Обратный отсчёт до сброса',
    days:         'Дней', hours: 'Часов', mins: 'Мин', secs: 'Сек',
    weekStart:    'Начало недели', weekReset: 'Сброс',
    scrollHint:   'вниз',
    localLabel:   'Местное', nextLabel: 'Следующий',
    statReset:    'Сброс каждые', statXpLabel: 'Нужно XP',
    statXp:       'Официальные серверы Valve',
    statItems:    'Предметов / дроп', statItemsSub: 'Выберите 2 из 4',
    statPrime:    'Требуется', statCases: 'Активных кейсов', statDropPool: 'Пул дропов',
    activeTitle:  'Активный пул дропов',
    activeSub:    'Кейсы Weekly Care Package', activeBadge: 'Активно',
    allTitle:     'Все кейсы CS2', allSub: 'Полный рынок Steam',
    howTitle:     'Как это работает',
    s1t: 'Получите Prime',
    s1p: 'Без Prime дропы недоступны. Разовая покупка $14.99 в Steam.',
    s2t: 'Дождитесь сброса',
    s2p: 'Каждую среду в 01:00 GMT начинается новый недельный цикл.',
    s3t: 'Заработайте 5000 XP',
    s3p: 'Играйте на официальных серверах Valve. Первый ранг-ап открывает дроп.',
    s4t: 'Заберите награду',
    s4p: 'Выберите 2 из 4 предметов. Появляется после матча или в Магазине.',
    sortDefault:  'По умолчанию', sortPriceAsc: 'Цена ↑',
    sortPriceDesc:'Цена ↓',       sortNameAsc: 'Имя А→Я',
    priceNote:    'Цены обновляются каждые 6ч — GitHub Actions + Steam Market',
    loadingPrices:'Загрузка цен…',
    pricesAt:     'Кэш цен в',
    pricesFail:   'Цены недоступны — проверьте api/prices.json',
    noPrice:      'Н/Д', market: '→ Рынок',
  },
};

/* ── DETECT LANGUAGE ─────────────────────────────── */
function detectLang() {
  var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('pt')) return 'pt';
  if (nav.startsWith('ru')) return 'ru';
  return 'en';
}

/* Step 1 — set globals synchronously (safe in <head>, no DOM needed) */
window.LANG = detectLang();
window.T    = TRANSLATIONS[window.LANG] || TRANSLATIONS.en;

/* Step 2 — translate DOM elements once the body is ready */
document.addEventListener('DOMContentLoaded', function () {
  // Set lang attribute on <html>
  document.documentElement.lang = window.LANG;

  // Translate every element with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (window.T[key] !== undefined) {
      el.textContent = window.T[key];
    }
  });

  // Keep the glitch data-t attribute in sync (it is the source for CSS ::before/::after)
  var glitch = document.querySelector('.glitch[data-t]');
  if (glitch && window.T.h1Line2) {
    glitch.setAttribute('data-t', window.T.h1Line2);
  }
});
