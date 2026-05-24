/* ============================================================
 *  Electricom – Professional Accessibility Module
 *  עומד בתקן ישראלי 5568 (WCAG 2.1 AA) ובתקנות שוויון
 *  זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות) התשע"ג-2013
 * ============================================================ */
(function () {
    'use strict';

    if (window.__A11Y_LOADED__) return;
    window.__A11Y_LOADED__ = true;

    const STORAGE_KEY = 'electricom_a11y_v2';
    const COORDINATOR = {
        name: 'ליאור',
        phone: '050-948-1242',
        phoneTel: '0509481242',
        email: 'ElectriCom.isr@gmail.com',
        company: 'אלקטריקום מערכות',
        lastUpdated: 'מאי 2026'
    };

    /* ---------- מצב ברירת מחדל ---------- */
    const defaultState = {
        textSize: 0,         // -2..+4 (כל שלב = 10%)
        lineHeight: 0,       // 0..3
        letterSpacing: 0,    // 0..3
        contrast: null,      // null | 'high' | 'inverted' | 'dark' | 'light'
        saturation: null,    // null | 'monochrome' | 'desaturate' | 'saturate'
        highlightLinks: false,
        highlightHeadings: false,
        readableFont: false,
        bigCursor: false,
        stopAnimations: false,
        readingGuide: false,
        readingMask: false,
        textAlign: null,     // null | 'right' | 'left' | 'center'
        screenReader: false  // הקראת טקסט
    };

    let state = loadState();

    /* ---------- CSS ---------- */
    const CSS = `
    /* ======== A11Y Toggle Button ======== */
    .a11y-fab {
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: #2563eb;
        color: #ffffff;
        border: 3px solid #ffffff;
        box-shadow: 0 6px 24px rgba(0,0,0,0.25);
        z-index: 99990;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s ease, background 0.25s ease;
    }
    .a11y-fab:hover, .a11y-fab:focus-visible {
        background: #1e40af;
        transform: scale(1.08);
        outline: 3px solid #fbbf24;
        outline-offset: 2px;
    }
    .a11y-fab svg { width: 32px; height: 32px; }

    /* ======== Panel ======== */
    .a11y-panel {
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: 360px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 48px);
        background: #ffffff;
        color: #0f172a;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 99991;
        display: flex;
        flex-direction: column;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
        font-family: 'Assistant', system-ui, sans-serif;
        direction: rtl;
    }
    .a11y-panel.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
    }
    .a11y-panel-header {
        padding: 18px 20px;
        background: linear-gradient(135deg, #22a657 0%, #2563eb 100%);
        color: #fff;
        border-radius: 16px 16px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .a11y-panel-header h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .a11y-panel-close {
        background: rgba(255,255,255,0.2);
        color: #fff;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    }
    .a11y-panel-close:hover, .a11y-panel-close:focus-visible {
        background: rgba(255,255,255,0.35);
        outline: 2px solid #fbbf24;
    }
    .a11y-panel-body {
        padding: 16px 20px 20px;
        overflow-y: auto;
        flex: 1;
    }
    .a11y-section {
        margin-bottom: 18px;
    }
    .a11y-section-title {
        font-size: 13px;
        font-weight: 700;
        color: #475569;
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid #e2e8f0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .a11y-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }
    .a11y-grid.cols-3 {
        grid-template-columns: 1fr 1fr 1fr;
    }
    .a11y-btn {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 8px;
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        text-align: center;
        font-family: inherit;
        line-height: 1.2;
        min-height: 70px;
        justify-content: center;
    }
    .a11y-btn svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
    }
    .a11y-btn:hover, .a11y-btn:focus-visible {
        background: #eff6ff;
        border-color: #2563eb;
        color: #2563eb;
        outline: none;
    }
    .a11y-btn.active {
        background: #2563eb;
        border-color: #2563eb;
        color: #ffffff;
    }
    .a11y-btn:focus-visible {
        outline: 3px solid #fbbf24;
        outline-offset: 2px;
    }
    .a11y-stepper {
        display: flex;
        align-items: center;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        padding: 6px;
        gap: 6px;
    }
    .a11y-stepper-label {
        flex: 1;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        line-height: 1.2;
    }
    .a11y-stepper-label small {
        display: block;
        font-size: 11px;
        color: #64748b;
        font-weight: 500;
    }
    .a11y-stepper button {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid #cbd5e1;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        color: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        font-family: inherit;
    }
    .a11y-stepper button:hover:not(:disabled),
    .a11y-stepper button:focus-visible {
        background: #2563eb;
        color: #fff;
        outline: none;
    }
    .a11y-stepper button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .a11y-panel-footer {
        padding: 12px 20px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
        background: #f8fafc;
        border-radius: 0 0 16px 16px;
    }
    .a11y-footer-btn {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        border: none;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
    }
    .a11y-footer-btn.reset {
        background: #dc2626;
        color: #fff;
    }
    .a11y-footer-btn.reset:hover, .a11y-footer-btn.reset:focus-visible {
        background: #b91c1c;
        outline: 3px solid #fbbf24;
        outline-offset: 2px;
    }
    .a11y-footer-btn.statement {
        background: #0f172a;
        color: #fff;
    }
    .a11y-footer-btn.statement:hover, .a11y-footer-btn.statement:focus-visible {
        background: #1e293b;
        outline: 3px solid #fbbf24;
        outline-offset: 2px;
    }
    .a11y-shortcut-hint {
        font-size: 11px;
        color: #94a3b8;
        text-align: center;
        margin-top: 8px;
    }

    /* ======== הצהרת נגישות (Modal) ======== */
    .a11y-statement-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 99995;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    .a11y-statement-overlay.open { display: flex; }
    .a11y-statement-modal {
        background: #fff;
        border-radius: 20px;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 0;
        width: 100%;
        direction: rtl;
        position: relative;
    }
    .a11y-statement-header {
        padding: 28px 36px 20px;
        border-bottom: 1px solid #e2e8f0;
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 2;
        border-radius: 20px 20px 0 0;
    }
    .a11y-statement-header h2 {
        font-size: 26px;
        margin: 0;
        color: #0f172a;
        font-weight: 700;
    }
    .a11y-statement-close {
        position: absolute;
        top: 18px;
        left: 18px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #f1f5f9;
        border: none;
        font-size: 22px;
        font-weight: bold;
        cursor: pointer;
        color: #334155;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .a11y-statement-close:hover, .a11y-statement-close:focus-visible {
        background: #e2e8f0;
        outline: 3px solid #fbbf24;
    }
    .a11y-statement-body {
        padding: 24px 36px 36px;
        line-height: 1.8;
        color: #1e293b;
        font-size: 16px;
    }
    .a11y-statement-body h3 {
        font-size: 19px;
        margin: 22px 0 10px;
        color: #0f172a;
        font-weight: 700;
    }
    .a11y-statement-body p { margin-bottom: 12px; }
    .a11y-statement-body ul { margin: 0 20px 14px 0; padding-right: 20px; }
    .a11y-statement-body li { margin-bottom: 6px; }
    .a11y-statement-body a { color: #2563eb; font-weight: 600; }
    .a11y-statement-body a:hover { text-decoration: underline; }
    .a11y-statement-contact {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-right: 4px solid #2563eb;
        border-radius: 10px;
        padding: 18px 22px;
        margin-top: 16px;
    }
    .a11y-meta {
        font-size: 13px;
        color: #64748b;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
    }

    /* ======== מצבים מופעלים על ה-body ======== */
    /* גודל טקסט - מוחל עם CSS variable */
    html.a11y-text-scale { font-size: var(--a11y-text-scale, 100%) !important; }

    /* גובה שורה */
    body.a11y-line-1 *, body.a11y-line-1 { line-height: 1.7 !important; }
    body.a11y-line-2 *, body.a11y-line-2 { line-height: 2 !important; }
    body.a11y-line-3 *, body.a11y-line-3 { line-height: 2.4 !important; }

    /* ריווח אותיות */
    body.a11y-letter-1 * { letter-spacing: 0.05em !important; }
    body.a11y-letter-2 * { letter-spacing: 0.1em !important; word-spacing: 0.15em !important; }
    body.a11y-letter-3 * { letter-spacing: 0.18em !important; word-spacing: 0.25em !important; }

    /* ניגודיות */
    html.a11y-contrast-high, html.a11y-contrast-high body { background: #000 !important; color: #fff !important; }
    html.a11y-contrast-high * {
        background-color: transparent !important;
        color: #ffff00 !important;
        border-color: #ffff00 !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }
    html.a11y-contrast-high a, html.a11y-contrast-high a * { color: #00ffff !important; }
    html.a11y-contrast-high button, html.a11y-contrast-high input, html.a11y-contrast-high select, html.a11y-contrast-high textarea {
        background: #000 !important;
        color: #fff !important;
        border: 2px solid #ffff00 !important;
    }
    html.a11y-contrast-high img, html.a11y-contrast-high video, html.a11y-contrast-high svg { opacity: 0.85; }
    html.a11y-contrast-high .a11y-fab, html.a11y-contrast-high .a11y-panel, html.a11y-contrast-high .a11y-panel * { all: revert; }

    html.a11y-contrast-inverted { filter: invert(100%) hue-rotate(180deg); }
    html.a11y-contrast-inverted img, html.a11y-contrast-inverted video, html.a11y-contrast-inverted picture, html.a11y-contrast-inverted iframe, html.a11y-contrast-inverted svg { filter: invert(100%) hue-rotate(180deg); }
    html.a11y-contrast-inverted .a11y-fab, html.a11y-contrast-inverted .a11y-panel, html.a11y-contrast-inverted .a11y-statement-overlay { filter: invert(100%) hue-rotate(180deg); }

    html.a11y-contrast-dark, html.a11y-contrast-dark body { background: #0a0a0a !important; color: #f1f5f9 !important; }
    html.a11y-contrast-dark *:not(.a11y-fab):not(.a11y-fab *):not(.a11y-panel):not(.a11y-panel *):not(.a11y-statement-overlay):not(.a11y-statement-overlay *) {
        background-color: transparent !important;
        color: #f1f5f9 !important;
        border-color: #475569 !important;
    }
    html.a11y-contrast-dark img, html.a11y-contrast-dark video { opacity: 0.9; }

    html.a11y-contrast-light, html.a11y-contrast-light body { background: #ffffff !important; }
    html.a11y-contrast-light *:not(.a11y-fab):not(.a11y-fab *):not(.a11y-panel):not(.a11y-panel *):not(.a11y-statement-overlay):not(.a11y-statement-overlay *) {
        background-color: #ffffff !important;
        background-image: none !important;
        color: #000000 !important;
        text-shadow: none !important;
        box-shadow: none !important;
    }
    html.a11y-contrast-light a, html.a11y-contrast-light a *:not(.a11y-fab):not(.a11y-fab *) { color: #0033cc !important; text-decoration: underline !important; }

    /* רוויה */
    html.a11y-saturation-monochrome { filter: grayscale(100%); }
    html.a11y-saturation-monochrome .a11y-fab, html.a11y-saturation-monochrome .a11y-panel, html.a11y-saturation-monochrome .a11y-statement-overlay { filter: grayscale(0%); }
    html.a11y-saturation-desaturate { filter: saturate(50%); }
    html.a11y-saturation-saturate { filter: saturate(180%); }

    /* קישורים מודגשים */
    body.a11y-highlight-links a, body.a11y-highlight-links a * {
        text-decoration: underline !important;
        text-underline-offset: 3px !important;
        text-decoration-thickness: 2px !important;
        font-weight: 700 !important;
        background: #fef9c3 !important;
        color: #1e40af !important;
        outline: 1px dashed #1e40af;
        outline-offset: 2px;
    }

    /* כותרות מודגשות */
    body.a11y-highlight-headings h1,
    body.a11y-highlight-headings h2,
    body.a11y-highlight-headings h3,
    body.a11y-highlight-headings h4,
    body.a11y-highlight-headings h5,
    body.a11y-highlight-headings h6 {
        background: #fef08a !important;
        color: #1e293b !important;
        padding: 4px 10px !important;
        border-right: 4px solid #2563eb !important;
        text-shadow: none !important;
        font-weight: 800 !important;
    }

    /* גופן קריא (לא דיסלקטי) */
    body.a11y-readable-font, body.a11y-readable-font * {
        font-family: 'Arial', 'Tahoma', 'Verdana', sans-serif !important;
        letter-spacing: 0.02em;
    }

    /* סמן עכבר מוגדל */
    html.a11y-big-cursor, html.a11y-big-cursor * {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'><path fill='%23000' stroke='%23fff' stroke-width='1.5' d='M3 2l7 18 2.5-7.5L20 10z'/></svg>") 4 4, auto !important;
    }
    html.a11y-big-cursor a, html.a11y-big-cursor button, html.a11y-big-cursor [role='button'] {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'><path fill='%232563eb' stroke='%23fff' stroke-width='1.5' d='M9 2v8h3l-4 12-4-12h3V2z' transform='rotate(0)'/></svg>") 8 4, pointer !important;
    }

    /* עצירת אנימציות */
    html.a11y-stop-animations *, html.a11y-stop-animations *::before, html.a11y-stop-animations *::after {
        animation-duration: 0s !important;
        animation-iteration-count: 0 !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
    }
    html.a11y-stop-animations video, html.a11y-stop-animations [autoplay] {
        animation-play-state: paused !important;
    }

    /* מדריך קריאה (קו אופקי שעוקב אחרי העכבר) */
    .a11y-reading-guide-bar {
        position: fixed;
        left: 0;
        right: 0;
        height: 40px;
        background: rgba(0, 0, 0, 0.7);
        border-top: 2px solid #fbbf24;
        border-bottom: 2px solid #fbbf24;
        pointer-events: none;
        z-index: 99988;
        transition: top 0.05s linear;
    }

    /* מסיכת קריאה (חלון שקוף בלבד באזור העכבר) */
    .a11y-reading-mask-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 99987;
        background: rgba(0,0,0,0.7);
        -webkit-mask-image: radial-gradient(circle 140px at var(--mx, 50%) var(--my, 50%), transparent 99%, black 100%);
        mask-image: radial-gradient(circle 140px at var(--mx, 50%) var(--my, 50%), transparent 99%, black 100%);
    }

    /* יישור טקסט */
    body.a11y-align-right *:not(.a11y-fab):not(.a11y-fab *):not(.a11y-panel):not(.a11y-panel *) { text-align: right !important; }
    body.a11y-align-left *:not(.a11y-fab):not(.a11y-fab *):not(.a11y-panel):not(.a11y-panel *) { text-align: left !important; }
    body.a11y-align-center *:not(.a11y-fab):not(.a11y-fab *):not(.a11y-panel):not(.a11y-panel *) { text-align: center !important; }

    /* פוקוס משופר לניווט מקלדת */
    body.a11y-keyboard-focus *:focus-visible {
        outline: 4px solid #fbbf24 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.4) !important;
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
        .a11y-panel {
            width: calc(100vw - 16px);
            left: 8px;
            bottom: 8px;
            max-height: calc(100vh - 16px);
        }
        .a11y-fab { width: 50px; height: 50px; bottom: 16px; left: 16px; }
        .a11y-fab svg { width: 28px; height: 28px; }
        .a11y-statement-modal { max-height: 95vh; }
        .a11y-statement-header { padding: 20px 22px 16px; }
        .a11y-statement-body { padding: 18px 22px 26px; font-size: 15px; }
    }

    /* הסתרת אלמנטים בהדפסה */
    @media print {
        .a11y-fab, .a11y-panel, .a11y-statement-overlay, .a11y-reading-guide-bar, .a11y-reading-mask-overlay { display: none !important; }
    }
    `;

    /* ---------- HTML ---------- */
    const TOGGLE_HTML = `
    <button class="a11y-fab" id="a11yFab" aria-label="פתח תפריט נגישות (Alt+1)" aria-expanded="false" aria-controls="a11yPanel" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <circle cx="12" cy="6.5" r="1.6" fill="currentColor" stroke="none"/>
            <path d="M5.5 9.5h13M10 9.5v4.5l-1.5 5M14 9.5v4.5l1.5 5" stroke-linecap="round"/>
        </svg>
    </button>`;

    const PANEL_HTML = `
    <div class="a11y-panel" id="a11yPanel" role="dialog" aria-modal="false" aria-labelledby="a11yPanelTitle">
        <div class="a11y-panel-header">
            <h2 id="a11yPanelTitle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="6.5" r="1.6" fill="currentColor"/><path d="M5.5 9.5h13M10 9.5v4.5l-1.5 5M14 9.5v4.5l1.5 5" stroke-linecap="round"/>
                </svg>
                תפריט נגישות
            </h2>
            <button class="a11y-panel-close" id="a11yPanelClose" aria-label="סגור תפריט נגישות" type="button">&times;</button>
        </div>
        <div class="a11y-panel-body">

            <div class="a11y-section">
                <div class="a11y-section-title">התאמת טקסט</div>
                <div class="a11y-grid cols-3">
                    <div class="a11y-stepper" role="group" aria-label="גודל טקסט">
                        <button type="button" data-step="textSize" data-dir="-1" aria-label="הקטן טקסט">−</button>
                        <span class="a11y-stepper-label">גודל<small id="a11yTextLabel">רגיל</small></span>
                        <button type="button" data-step="textSize" data-dir="1" aria-label="הגדל טקסט">+</button>
                    </div>
                    <div class="a11y-stepper" role="group" aria-label="ריווח שורות">
                        <button type="button" data-step="lineHeight" data-dir="-1" aria-label="הקטן ריווח שורות">−</button>
                        <span class="a11y-stepper-label">שורות<small id="a11yLineLabel">רגיל</small></span>
                        <button type="button" data-step="lineHeight" data-dir="1" aria-label="הגדל ריווח שורות">+</button>
                    </div>
                    <div class="a11y-stepper" role="group" aria-label="ריווח אותיות">
                        <button type="button" data-step="letterSpacing" data-dir="-1" aria-label="הקטן ריווח אותיות">−</button>
                        <span class="a11y-stepper-label">אותיות<small id="a11yLetterLabel">רגיל</small></span>
                        <button type="button" data-step="letterSpacing" data-dir="1" aria-label="הגדל ריווח אותיות">+</button>
                    </div>
                </div>
            </div>

            <div class="a11y-section">
                <div class="a11y-section-title">ניגודיות וצבעים</div>
                <div class="a11y-grid">
                    <button type="button" class="a11y-btn" data-toggle="contrast" data-value="high" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v20" fill="currentColor"/></svg>
                        ניגודיות גבוהה
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="contrast" data-value="inverted" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20z" fill="currentColor"/><circle cx="12" cy="12" r="10"/></svg>
                        ניגודיות הפוכה
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="contrast" data-value="dark" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        מצב כהה
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="contrast" data-value="light" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-linecap="round"/></svg>
                        מצב בהיר
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="saturation" data-value="monochrome" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18" fill="currentColor"/></svg>
                        גווני אפור
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="saturation" data-value="saturate" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="8" cy="9" r="4"/><circle cx="16" cy="9" r="4"/><circle cx="12" cy="15" r="4"/></svg>
                        רוויית צבע
                    </button>
                </div>
            </div>

            <div class="a11y-section">
                <div class="a11y-section-title">קריאות ותוכן</div>
                <div class="a11y-grid">
                    <button type="button" class="a11y-btn" data-toggle="highlightLinks" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        הדגשת קישורים
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="highlightHeadings" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4v16M18 4v16M6 12h12" stroke-linecap="round"/></svg>
                        הדגשת כותרות
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="readableFont" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7V4h16v3M9 20h6M12 4v16" stroke-linecap="round"/></svg>
                        גופן קריא
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="bigCursor" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 2l7 18 2.5-7.5L20 10z"/></svg>
                        סמן מוגדל
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="readingGuide" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12h20M2 8h20M2 16h20" stroke-linecap="round"/></svg>
                        סרגל קריאה
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="readingMask" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><rect x="2" y="2" width="20" height="20" rx="3"/></svg>
                        מסיכת קריאה
                    </button>
                </div>
            </div>

            <div class="a11y-section">
                <div class="a11y-section-title">תנועה וניווט</div>
                <div class="a11y-grid">
                    <button type="button" class="a11y-btn" data-toggle="stopAnimations" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
                        עצור אנימציות
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="screenReader" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke-linecap="round"/></svg>
                        הקראת טקסט
                    </button>
                </div>
            </div>

            <div class="a11y-section">
                <div class="a11y-section-title">יישור טקסט</div>
                <div class="a11y-grid cols-3">
                    <button type="button" class="a11y-btn" data-toggle="textAlign" data-value="right" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 6H3M21 10H7M21 14H3M21 18H9" stroke-linecap="round"/></svg>
                        ימין
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="textAlign" data-value="center" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 6H3M18 10H6M21 14H3M18 18H6" stroke-linecap="round"/></svg>
                        מרכז
                    </button>
                    <button type="button" class="a11y-btn" data-toggle="textAlign" data-value="left" aria-pressed="false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 6H3M17 10H3M21 14H3M15 18H3" stroke-linecap="round"/></svg>
                        שמאל
                    </button>
                </div>
            </div>

            <p class="a11y-shortcut-hint">קיצור: Alt+1 לפתיחה • ESC לסגירה</p>
        </div>
        <div class="a11y-panel-footer">
            <button type="button" class="a11y-footer-btn statement" id="a11yOpenStatement">הצהרת נגישות</button>
            <button type="button" class="a11y-footer-btn reset" id="a11yResetAll">איפוס מלא</button>
        </div>
    </div>`;

    const STATEMENT_HTML = `
    <div class="a11y-statement-overlay" id="a11yStatementOverlay" role="dialog" aria-modal="true" aria-labelledby="a11yStatementTitle">
        <div class="a11y-statement-modal">
            <div class="a11y-statement-header">
                <h2 id="a11yStatementTitle">הצהרת נגישות</h2>
                <button class="a11y-statement-close" id="a11yStatementClose" aria-label="סגור הצהרת נגישות" type="button">&times;</button>
            </div>
            <div class="a11y-statement-body">
                <p>חברת <strong>${COORDINATOR.company}</strong> רואה חשיבות עליונה בהנגשת השירותים והתכנים שלה לכלל הציבור, לרבות אנשים עם מוגבלויות. אנו מאמינים שמתן שירות שוויוני ונגיש הוא אחריות חברתית ומחויבות משפטית כאחד.</p>

                <h3>הבסיס החוקי</h3>
                <p>אתר זה נבנה והונגש בהתאם להוראות:</p>
                <ul>
                    <li>חוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998</li>
                    <li>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013</li>
                    <li>תקן ישראלי ת"י 5568 ברמת AA</li>
                    <li>הנחיות WCAG 2.1 של ארגון W3C ברמת AA</li>
                </ul>

                <h3>אמצעי הנגישות באתר</h3>
                <ul>
                    <li><strong>תפריט נגישות מקיף</strong> - הנגיש מכל עמוד באמצעות כפתור בפינה השמאלית-תחתונה או באמצעות הקיצור Alt+1</li>
                    <li><strong>התאמת טקסט</strong> - הגדלה/הקטנה (4 רמות), שינוי ריווח שורות וריווח אותיות</li>
                    <li><strong>ניגודיות וצבעים</strong> - ניגודיות גבוהה, ניגודיות הפוכה, מצב כהה, מצב בהיר, גווני אפור, רוויית צבע</li>
                    <li><strong>קריאות</strong> - הדגשת קישורים, הדגשת כותרות, גופן קריא, סרגל קריאה, מסיכת קריאה, סמן עכבר מוגדל</li>
                    <li><strong>תנועה</strong> - אפשרות לעצור אנימציות (חשוב לאנשים עם רגישות לתנועה ואפילפסיה)</li>
                    <li><strong>הקראת טקסט</strong> - לחיצה על טקסט תפעיל הקראה קולית באמצעות מנוע ההקראה של הדפדפן</li>
                    <li><strong>ניווט מלא במקלדת</strong> - כל מרכיבי האתר ניתנים להפעלה ללא עכבר באמצעות מקש Tab</li>
                    <li><strong>תיוג ARIA</strong> - תמיכה בקוראי מסך (NVDA, JAWS, VoiceOver) עם תיוג סמנטי מלא</li>
                    <li><strong>טקסט חלופי</strong> - תיאורי חלופה (alt) לכל התמונות והסמלים המשמעותיים</li>
                    <li><strong>מבנה כותרות סמנטי</strong> - מאפשר ניווט קל באמצעות קוראי מסך</li>
                    <li><strong>דילוג לתוכן</strong> - קישור "דלג לתוכן הראשי" מופיע ראשון בעת ניווט במקלדת</li>
                    <li><strong>שמירת העדפות</strong> - הגדרות המשתמש נשמרות בדפדפן ומופעלות בביקורים חוזרים</li>
                    <li><strong>תמיכה ב-prefers-reduced-motion</strong> - האתר מכבד הגדרות מערכת ההפעלה להפחתת תנועה</li>
                </ul>

                <h3>הסתייגויות וחריגים</h3>
                <p>במידת האפשר, האתר הונגש במלואו. עם זאת, ייתכן שתוכן צד שלישי המוטמע באתר (כגון מפות, סרטוני YouTube, או רכיבי צד שלישי אחרים) אינו נגיש במלואו, מאחר ואינו תחת שליטתנו הישירה. אם נתקלת ברכיב כזה, נשמח שתפנה אלינו ונפעל לפתרון.</p>

                <h3>פנייה לרכז הנגישות</h3>
                <p>נתקלת בקושי בנגישות האתר? יש לך הצעה לשיפור? נשמח לשמוע ולסייע בהקדם האפשרי.</p>
                <div class="a11y-statement-contact">
                    <p style="margin-bottom:6px;"><strong>שם רכז הנגישות:</strong> ${COORDINATOR.name}</p>
                    <p style="margin-bottom:6px;"><strong>טלפון:</strong> <a href="tel:${COORDINATOR.phoneTel}" dir="ltr">${COORDINATOR.phone}</a></p>
                    <p style="margin-bottom:6px;"><strong>דוא"ל:</strong> <a href="mailto:${COORDINATOR.email}">${COORDINATOR.email}</a></p>
                    <p style="margin-bottom:0;"><strong>זמני מענה:</strong> ימים א'-ה', בין השעות 09:00–18:00</p>
                </div>

                <h3>הגשת תלונה</h3>
                <p>אם פנייתך לא נענתה לשביעות רצונך, באפשרותך להגיש תלונה לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד המשפטים:</p>
                <ul>
                    <li>אתר: <a href="https://www.gov.il/he/departments/equal_rights_authority" target="_blank" rel="noopener">www.gov.il/he/departments/equal_rights_authority</a></li>
                    <li>טלפון: 02-6549555</li>
                </ul>

                <div class="a11y-meta">
                    <p style="margin:0;">תאריך הצהרת נגישות זו: ${COORDINATOR.lastUpdated}</p>
                    <p style="margin:4px 0 0;">האתר עובר בדיקות נגישות תקופתיות לשמירה על תאימות מלאה לתקן.</p>
                </div>
            </div>
        </div>
    </div>`;

    /* ---------- Init ---------- */
    function init() {
        injectCSS();
        injectHTML();
        bindEvents();
        applyState();
        hookExistingLinks();
    }

    function injectCSS() {
        const style = document.createElement('style');
        style.id = 'a11y-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function injectHTML() {
        const wrap = document.createElement('div');
        wrap.id = 'a11y-root';
        wrap.innerHTML = TOGGLE_HTML + PANEL_HTML + STATEMENT_HTML;
        document.body.appendChild(wrap);
    }

    function hookExistingLinks() {
        // הקישור הישן בפוטר #a11yStatement → פתיחת המודאל החדש
        document.querySelectorAll('#a11yStatement, [data-a11y-statement]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openStatement();
            });
        });
    }

    /* ---------- Persistence ---------- */
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...defaultState };
            return { ...defaultState, ...JSON.parse(raw) };
        } catch (e) {
            return { ...defaultState };
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* ignore quota errors */ }
    }

    /* ---------- Events ---------- */
    function bindEvents() {
        const fab = document.getElementById('a11yFab');
        const panel = document.getElementById('a11yPanel');
        const closeBtn = document.getElementById('a11yPanelClose');
        const resetBtn = document.getElementById('a11yResetAll');
        const openStatementBtn = document.getElementById('a11yOpenStatement');
        const statementOverlay = document.getElementById('a11yStatementOverlay');
        const statementClose = document.getElementById('a11yStatementClose');

        fab.addEventListener('click', togglePanel);
        closeBtn.addEventListener('click', closePanel);
        resetBtn.addEventListener('click', resetAll);
        openStatementBtn.addEventListener('click', openStatement);
        statementClose.addEventListener('click', closeStatement);
        statementOverlay.addEventListener('click', (e) => {
            if (e.target === statementOverlay) closeStatement();
        });

        // Toggle buttons (boolean and value-based)
        panel.querySelectorAll('[data-toggle]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.toggle;
                const value = btn.dataset.value;
                if (value !== undefined) {
                    state[key] = (state[key] === value) ? null : value;
                } else {
                    state[key] = !state[key];
                }
                applyState();
                saveState();
            });
        });

        // Steppers
        panel.querySelectorAll('[data-step]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.step;
                const dir = parseInt(btn.dataset.dir, 10);
                const limits = {
                    textSize: [-2, 4],
                    lineHeight: [0, 3],
                    letterSpacing: [0, 3]
                };
                const [min, max] = limits[key];
                state[key] = Math.max(min, Math.min(max, (state[key] || 0) + dir));
                applyState();
                saveState();
            });
        });

        // Keyboard shortcut: Alt+1 to open
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                togglePanel();
            }
            if (e.key === 'Escape') {
                if (statementOverlay.classList.contains('open')) {
                    closeStatement();
                } else if (panel.classList.contains('open')) {
                    closePanel();
                }
            }
        });

        // Click outside panel closes it
        document.addEventListener('click', (e) => {
            if (panel.classList.contains('open') &&
                !panel.contains(e.target) &&
                !fab.contains(e.target)) {
                closePanel();
            }
        });

        // Reading guide tracker
        document.addEventListener('mousemove', onMouseMove);

        // Screen reader on click
        document.addEventListener('click', (e) => {
            if (!state.screenReader) return;
            if (e.target.closest('.a11y-panel') || e.target.closest('.a11y-fab') || e.target.closest('.a11y-statement-overlay')) return;
            const text = (e.target.innerText || e.target.alt || e.target.title || '').trim();
            if (text && text.length > 0 && text.length < 1500) {
                speak(text);
            }
        }, true);
    }

    function togglePanel() {
        const panel = document.getElementById('a11yPanel');
        if (panel.classList.contains('open')) closePanel();
        else openPanel();
    }
    function openPanel() {
        const panel = document.getElementById('a11yPanel');
        const fab = document.getElementById('a11yFab');
        panel.classList.add('open');
        fab.setAttribute('aria-expanded', 'true');
        // focus first interactive element
        setTimeout(() => {
            const firstBtn = panel.querySelector('.a11y-stepper button, .a11y-btn');
            if (firstBtn) firstBtn.focus();
        }, 100);
    }
    function closePanel() {
        const panel = document.getElementById('a11yPanel');
        const fab = document.getElementById('a11yFab');
        panel.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
    }
    function openStatement() {
        const overlay = document.getElementById('a11yStatementOverlay');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const closeBtn = document.getElementById('a11yStatementClose');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }
    function closeStatement() {
        const overlay = document.getElementById('a11yStatementOverlay');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    /* ---------- Apply state to DOM ---------- */
    function applyState() {
        const html = document.documentElement;
        const body = document.body;

        // Text size (1 step = 10%)
        const scalePercent = 100 + (state.textSize * 10);
        html.style.setProperty('--a11y-text-scale', scalePercent + '%');
        if (state.textSize !== 0) html.classList.add('a11y-text-scale');
        else html.classList.remove('a11y-text-scale');
        setLabel('a11yTextLabel', state.textSize === 0 ? 'רגיל' : (state.textSize > 0 ? `+${state.textSize}` : state.textSize));

        // Line height
        ['a11y-line-1', 'a11y-line-2', 'a11y-line-3'].forEach(c => body.classList.remove(c));
        if (state.lineHeight > 0) body.classList.add(`a11y-line-${state.lineHeight}`);
        setLabel('a11yLineLabel', state.lineHeight === 0 ? 'רגיל' : `+${state.lineHeight}`);

        // Letter spacing
        ['a11y-letter-1', 'a11y-letter-2', 'a11y-letter-3'].forEach(c => body.classList.remove(c));
        if (state.letterSpacing > 0) body.classList.add(`a11y-letter-${state.letterSpacing}`);
        setLabel('a11yLetterLabel', state.letterSpacing === 0 ? 'רגיל' : `+${state.letterSpacing}`);

        // Contrast (mutually exclusive)
        ['high', 'inverted', 'dark', 'light'].forEach(v => html.classList.remove(`a11y-contrast-${v}`));
        if (state.contrast) html.classList.add(`a11y-contrast-${state.contrast}`);

        // Saturation (mutually exclusive with contrast filters where they overlap)
        ['monochrome', 'desaturate', 'saturate'].forEach(v => html.classList.remove(`a11y-saturation-${v}`));
        if (state.saturation) html.classList.add(`a11y-saturation-${state.saturation}`);

        // Highlight links
        body.classList.toggle('a11y-highlight-links', !!state.highlightLinks);
        body.classList.toggle('a11y-highlight-headings', !!state.highlightHeadings);
        body.classList.toggle('a11y-readable-font', !!state.readableFont);
        html.classList.toggle('a11y-big-cursor', !!state.bigCursor);
        html.classList.toggle('a11y-stop-animations', !!state.stopAnimations);

        // Text alignment (mutually exclusive)
        ['right', 'left', 'center'].forEach(v => body.classList.remove(`a11y-align-${v}`));
        if (state.textAlign) body.classList.add(`a11y-align-${state.textAlign}`);

        // Reading guide
        updateReadingGuide();
        updateReadingMask();

        // Keyboard focus enhancement always on once user opens panel
        body.classList.add('a11y-keyboard-focus');

        // Update button visual state
        updateButtonStates();
    }

    function updateButtonStates() {
        document.querySelectorAll('[data-toggle]').forEach(btn => {
            const key = btn.dataset.toggle;
            const value = btn.dataset.value;
            let active = false;
            if (value !== undefined) active = state[key] === value;
            else active = !!state[key];
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function setLabel(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    /* ---------- Reading guide / mask ---------- */
    let guideBar = null;
    let maskOverlay = null;

    function updateReadingGuide() {
        if (state.readingGuide && !guideBar) {
            guideBar = document.createElement('div');
            guideBar.className = 'a11y-reading-guide-bar';
            guideBar.style.top = '50%';
            document.body.appendChild(guideBar);
        } else if (!state.readingGuide && guideBar) {
            guideBar.remove();
            guideBar = null;
        }
    }
    function updateReadingMask() {
        if (state.readingMask && !maskOverlay) {
            maskOverlay = document.createElement('div');
            maskOverlay.className = 'a11y-reading-mask-overlay';
            document.body.appendChild(maskOverlay);
        } else if (!state.readingMask && maskOverlay) {
            maskOverlay.remove();
            maskOverlay = null;
        }
    }
    function onMouseMove(e) {
        if (guideBar) {
            guideBar.style.top = (e.clientY - 20) + 'px';
        }
        if (maskOverlay) {
            maskOverlay.style.setProperty('--mx', e.clientX + 'px');
            maskOverlay.style.setProperty('--my', e.clientY + 'px');
        }
    }

    /* ---------- Speech ---------- */
    function speak(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'he-IL';
            u.rate = 0.95;
            window.speechSynthesis.speak(u);
        } catch (e) { /* ignore */ }
    }

    /* ---------- Reset ---------- */
    function resetAll() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        state = { ...defaultState };
        applyState();
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }

    /* ---------- Boot ---------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
