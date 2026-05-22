// ============================================================
// Electricom Landing - CMS runtime
// ============================================================
// Loads content JSON from Supabase and injects it into the page.
// Used by both index.html (read-only) and admin.html (read + write).
// ============================================================

(function () {
  const cfg = window.ELECTRICOM_CONFIG;
  if (!cfg || !cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf('PASTE_') === 0) {
    console.warn('[cms] config.js not filled in yet – falling back to static HTML.');
  }

  const supa = (cfg && window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf('PASTE_') !== 0)
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
    : null;

  // ---------- Default content (the "starting" version of the site) ----------
  const DEFAULT_CONTENT = {
    contact: {
      phone_display: '050-948-1242',
      phone_tel: '0509481242',
      phone_intl: '972509481242',
      email: 'ElectriCom.isr@gmail.com',
    },
    hero: {
      badge: 'זמינים עכשיו לפניות חדשות',
      title_pre: 'פתרונות חכמים',
      title_highlight: 'חשמל, תקשורת ואבטחה',
      subtitle: 'אלקטריקום מערכות מתמחה בתכנון והתקנת תשתיות מתקדמות לעסקים ובתים פרטיים. איכות ללא פשרות, שירות אישי וזמינות מלאה - הכל תחת קורת גג אחת.',
      btn_primary: 'קבל הצעת מחיר חינם',
      btn_secondary: 'השירותים שלנו',
      stat1_number: '+30', stat1_label: 'שנות ניסיון',
      stat2_number: '+500', stat2_label: 'לקוחות מרוצים',
      stat3_number: '24/7', stat3_label: 'זמינות לתקלות',
    },
    about: {
      badge_title: '30 שנות מומחיות',
      badge_desc: 'מובילים בתחום עם ניסיון בלתי מתפשר באלפי פרויקטים מוצלחים',
      tag: 'אודות אלקטריקום',
      title: 'מקצוענות ואמינות בכל פרויקט',
      paragraph1: 'אלקטריקום מערכות הוקמה מתוך אמונה שכל לקוח ראוי לפתרון איכותי, מקצועי ומותאם אישית. במשך למעלה משלושים שנה אנחנו מובילים בתחום תשתיות החשמל, התקשורת והאבטחה - ומספקים שירות אישי וחם לצד מומחיות טכנית ברמה הגבוהה ביותר.',
      paragraph2: 'הצוות שלנו מורכב מטכנאים מוסמכים, מהנדסים מנוסים ומומחי אבטחה המתמחים בעבודה עם הציוד המתקדם בעולם - Hikvision, Ruijie, Panduit ועוד.',
      checklist: [
        'חשמלאים מוסמכים ומורשים על פי חוק',
        'אחריות מלאה על כל עבודה ומוצר',
        'שירות מהיר וזמינות גבוהה לקריאות שירות',
        'עבודה רק עם ציוד מהטובים בעולם',
      ],
    },
    services: {
      tag: 'השירותים שלנו',
      title: 'פתרונות מלאים תחת קורת גג אחת',
      subtitle: 'מתכננים, מתקינים ומתחזקים. שלושה תחומי מומחיות מרכזיים, סטנדרט אחד של מקצוענות.',
      items: [
        {
          title: 'תשתיות חשמל ותאורה',
          desc: 'תכנון והתקנת מערכות חשמל לבתים פרטיים, משרדים ומבני תעשייה. פתרונות תאורה חכמים, חסכוניים וקלי תחזוקה.',
          features: ['לוחות חשמל ראשיים ומשניים', 'תאורת LED וגופי תאורה דקורטיביים', 'גנרטורים ומערכות גיבוי', 'תאורת חוץ וגינות', 'בדיקות חשמל ותקנות'],
        },
        {
          title: 'תקשורת ורשתות מחשב',
          desc: 'תשתיות תקשורת מקצועיות לעסקים ולבתים חכמים. עבודה עם ציוד המוביל בעולם - Ruijie ו-Panduit.',
          features: ['כבילה מובנית CAT6 / CAT6A / סיב אופטי', 'נקודות רשת ומדפי תקשורת', 'פתרונות Wi-Fi מתקדמים', 'מתגים ונתבים מנוהלים', 'תכנון תשתיות לבניינים חדשים'],
        },
        {
          title: 'מצלמות ובקרת כניסה',
          desc: 'מערכות אבטחה ומיגון מתקדמות לבתים ועסקים. צפייה מרחוק, התראות בזמן אמת ובקרת גישה מלאה.',
          features: ['מצלמות אבטחה IP ו-AHD', 'אינטרקום ובקרת כניסה לבניינים', 'צפייה מרחוק מהסמארטפון', 'מערכות התראה ואזעקה', 'תחזוקה שוטפת ומענה לתקלות'],
        },
      ],
    },
    why: {
      tag: 'למה לבחור בנו',
      title: 'מה הופך אותנו לבחירה הנכונה',
      subtitle: 'אנחנו לא רק נותני שירות. אנחנו השותפים שלכם להצלחת הפרויקט.',
      items: [
        { title: 'זמינות 24/7', desc: 'אנחנו זמינים לקריאות שירות גם בשעות חריגות ובסופי שבוע' },
        { title: 'אחריות מלאה', desc: 'אחריות מקיפה על כל מוצר ועל איכות העבודה לאורך זמן' },
        { title: 'פתרון מותאם אישית', desc: 'כל פרויקט מקבל תכנון ייעודי המותאם בדיוק לצרכים שלכם' },
        { title: 'איכות ללא פשרות', desc: 'עובדים רק עם הציוד המוביל בעולם וטכנאים מוסמכים' },
      ],
    },
    projects: {
      tag: 'פרויקטים נבחרים',
      title: 'העבודות שלנו מדברות בעד עצמן',
      subtitle: 'מבחר מהפרויקטים שביצענו בשנים האחרונות.',
      items: [
        { title: 'תשתית תקשורת מלאה', subtitle: 'בניין משרדים בן 8 קומות בתל אביב', image: '' },
        { title: 'מערך מצלמות לקניון',  subtitle: '120 מצלמות + בקרת כניסה משולבת',     image: '' },
        { title: 'וילה פרטית יוקרתית',   subtitle: 'תאורה חכמה + מערכת חשמל מלאה',       image: '' },
        { title: 'חדר שרתים מתקדם',      subtitle: 'תכנון והקמת חדר שרתים לחברת הייטק',  image: '' },
        { title: 'בית חכם משולב',        subtitle: 'חשמל + תקשורת + אבטחה בפרויקט אחד',  image: '' },
        { title: 'מפעל ייצור',           subtitle: 'תשתיות חשמל ובקרה תעשייתית',         image: '' },
      ],
    },
    testimonials: {
      tag: 'המלצות לקוחות',
      title: 'מה הלקוחות שלנו אומרים',
      subtitle: 'ההמלצות החמות ביותר מגיעות מהלקוחות שעבדנו איתם.',
      items: [
        { name: 'דניאל כהן', role: 'בעל עסק, רמת גן',    text: 'עבודה מקצועית, נקייה ובזמן. הצוות של אלקטריקום הגיע בדיוק כשאמרו, ביצעו את העבודה ברמה הגבוהה ביותר ועזרו לנו בכל שאלה. ממליץ בחום!', avatar: 'ד.כ', rating: 5 },
        { name: 'מיכל לוי',  role: 'לקוחה פרטית, הרצליה', text: 'התקנו אצלנו מערך מצלמות מלא לבית. תכנון מעולה, התקנה מהירה והכי חשוב - תמיכה זמינה ואדיבה. הכל עובד מצוין ומחיר הוגן.',                  avatar: 'מ.ל', rating: 5 },
        { name: 'יוסי שמש', role: 'מנכ"ל חברת הייטק',    text: 'ביצעו אצלנו תשתית תקשורת מלאה למשרד החדש. תכנון מצוין, ביצוע מקצועי וירידה לפרטים הקטנים ביותר. ממליצים לכל מי שמחפש איכות אמיתית.',          avatar: 'י.ש', rating: 5 },
      ],
    },
    contact_section: {
      tag: 'צור קשר',
      title: 'בואו נדבר על הפרויקט שלכם',
      subtitle: 'השאירו פרטים, נחזור אליכם בהקדם עם הצעת מחיר מותאמת ופתרון מקצועי לצרכים שלכם.',
      whatsapp_title: 'שלח לנו הודעה בוואטסאפ',
      whatsapp_text: 'לחץ על הכפתור והודעה מוכנה תיפתח עבורך באפליקציית הוואטסאפ. נחזור אליך תוך זמן קצר עם הצעה מקצועית.',
      whatsapp_btn: 'לחץ לשליחת הודעה בוואטסאפ',
      whatsapp_footnote: 'זמן תגובה ממוצע: עד 30 דקות בשעות הפעילות',
    },
    footer: {
      description: 'מומחים בתשתיות חשמל, תקשורת ואבטחה. שלושים שנות ניסיון, מאות לקוחות מרוצים, שירות מקצועי בכל הארץ.',
    },
    partners: {
      title: 'המותגים המובילים שאנחנו עובדים איתם',
      items: [
        { name: 'Hikvision',          logo: 'https://www.google.com/s2/favicons?domain=hikvision.com&sz=128' },
        { name: 'Dahua',              logo: 'https://www.google.com/s2/favicons?domain=dahuasecurity.com&sz=128' },
        { name: 'Provision-ISR',      logo: 'https://www.google.com/s2/favicons?domain=provision-isr.com&sz=128' },
        { name: 'Axis Communications',logo: 'https://www.google.com/s2/favicons?domain=axis.com&sz=128' },
        { name: 'Bosch Security',     logo: 'https://www.google.com/s2/favicons?domain=boschsecurity.com&sz=128' },
        { name: 'Cisco',              logo: 'https://www.google.com/s2/favicons?domain=cisco.com&sz=128' },
        { name: 'Aruba (HPE)',        logo: 'https://www.google.com/s2/favicons?domain=arubanetworks.com&sz=128' },
        { name: 'Ubiquiti',           logo: 'https://www.google.com/s2/favicons?domain=ui.com&sz=128' },
        { name: 'MikroTik',           logo: 'https://www.google.com/s2/favicons?domain=mikrotik.com&sz=128' },
        { name: 'Fortinet',           logo: 'https://www.google.com/s2/favicons?domain=fortinet.com&sz=128' },
        { name: 'TP-Link',            logo: 'https://www.google.com/s2/favicons?domain=tp-link.com&sz=128' },
        { name: 'D-Link',             logo: 'https://www.google.com/s2/favicons?domain=dlink.com&sz=128' },
        { name: 'Ruijie',             logo: 'https://www.google.com/s2/favicons?domain=ruijienetworks.com&sz=128' },
        { name: 'Synology',           logo: 'https://www.google.com/s2/favicons?domain=synology.com&sz=128' },
        { name: 'CommScope',          logo: 'https://www.google.com/s2/favicons?domain=commscope.com&sz=128' },
        { name: 'Panduit',            logo: '' },
        { name: 'Schneider Electric', logo: 'https://www.google.com/s2/favicons?domain=se.com&sz=128' },
        { name: 'ABB',                logo: 'https://www.google.com/s2/favicons?domain=abb.com&sz=128' },
        { name: 'Legrand',            logo: 'https://www.google.com/s2/favicons?domain=legrand.com&sz=128' },
        { name: 'Eaton',              logo: 'https://www.google.com/s2/favicons?domain=eaton.com&sz=128' },
        { name: 'Philips',            logo: 'https://www.google.com/s2/favicons?domain=philips.com&sz=128' },
      ],
    },
  };

  // ---------- Helpers ----------
  function getByPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  // Merge defaults with stored content so missing keys still work
  function withDefaults(stored) {
    function merge(def, src) {
      if (Array.isArray(def)) return Array.isArray(src) ? src : def;
      if (def && typeof def === 'object') {
        const out = {};
        const keys = new Set([...Object.keys(def), ...(src ? Object.keys(src) : [])]);
        keys.forEach(k => { out[k] = merge(def[k], src ? src[k] : undefined); });
        return out;
      }
      return (src !== undefined && src !== null) ? src : def;
    }
    return merge(DEFAULT_CONTENT, stored || {});
  }

  // ---------- Data API ----------
  async function fetchContent() {
    if (!supa) return DEFAULT_CONTENT;
    const { data, error } = await supa.from('site_content').select('content').eq('id', 1).maybeSingle();
    if (error) { console.error('[cms] fetch failed:', error); return DEFAULT_CONTENT; }
    return withDefaults(data && data.content);
  }

  async function saveContent(content) {
    if (!supa) throw new Error('Supabase not configured');
    const { error } = await supa.from('site_content').upsert({ id: 1, content }, { onConflict: 'id' });
    if (error) throw error;
  }

  async function uploadImage(file) {
    if (!supa) throw new Error('Supabase not configured');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supa.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supa.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  }

  // ---------- DOM application ----------
  function setText(el, value) {
    if (value === undefined || value === null) return;
    el.textContent = String(value);
  }

  function applyToDom(content) {
    // Plain text fields: <span data-cms="hero.title_pre">
    document.querySelectorAll('[data-cms]').forEach(el => {
      const v = getByPath(content, el.getAttribute('data-cms'));
      if (v !== undefined && v !== null && typeof v !== 'object') setText(el, v);
    });

    // href targets: <a data-cms-href="contact.email" data-cms-href-prefix="mailto:">
    document.querySelectorAll('[data-cms-href]').forEach(el => {
      const v = getByPath(content, el.getAttribute('data-cms-href'));
      if (v === undefined || v === null) return;
      const prefix = el.getAttribute('data-cms-href-prefix') || '';
      const suffix = el.getAttribute('data-cms-href-suffix') || '';
      el.setAttribute('href', `${prefix}${v}${suffix}`);
    });

    // <img data-cms-src="projects.items.0.image">
    document.querySelectorAll('[data-cms-src]').forEach(el => {
      const v = getByPath(content, el.getAttribute('data-cms-src'));
      if (v) {
        el.setAttribute('src', v);
        el.style.display = '';
        if (el.dataset.cmsParentShow) {
          const parent = el.closest(el.dataset.cmsParentShow);
          if (parent) parent.classList.add('has-image');
        }
      } else {
        if (el.dataset.cmsHideIfEmpty) el.style.display = 'none';
      }
    });

    // Lists rendered from JSON arrays — repeat a hidden <template> per item
    document.querySelectorAll('[data-cms-list]').forEach(container => {
      const path = container.getAttribute('data-cms-list');
      const items = getByPath(content, path);
      const tpl = container.querySelector('template[data-cms-tpl]');
      if (!Array.isArray(items) || !tpl) return;
      // Clear all previously-rendered children (everything except the <template> itself)
      Array.from(container.children).forEach(c => { if (c !== tpl) c.remove(); });
      // Double the items if the container needs a seamless loop (used by marquee)
      const renderTimes = container.getAttribute('data-cms-list-double') === 'true' ? 2 : 1;
      for (let r = 0; r < renderTimes; r++) {
      items.forEach((item, idx) => {
        const node = tpl.content.cloneNode(true);
        // Fill {{field}} placeholders inside the cloned subtree
        node.querySelectorAll('[data-cms-field]').forEach(el => {
          const field = el.getAttribute('data-cms-field');
          const v = field === '.' ? item : (item ? item[field] : undefined);
          // "fallback-only" elements should only show when the related image is empty / failed
          const fallbackOnly = el.hasAttribute('data-cms-fallback-only');
          if (fallbackOnly) {
            const sibling = el.parentElement && el.parentElement.querySelector('[data-cms-field-src]');
            const hasImage = sibling && sibling.getAttribute('src');
            el.style.display = hasImage ? 'none' : '';
          }
          if (v !== undefined && v !== null) setText(el, v);
        });
        // Image inside list item
        node.querySelectorAll('[data-cms-field-src]').forEach(el => {
          const field = el.getAttribute('data-cms-field-src');
          const v = item ? item[field] : undefined;
          if (v) {
            el.setAttribute('src', v);
            el.style.display = '';
            // If the image fails to load, hide it and show any fallback-only sibling
            el.addEventListener('error', () => {
              el.style.display = 'none';
              const fb = el.parentElement && el.parentElement.querySelector('[data-cms-fallback-only]');
              if (fb) fb.style.display = '';
            }, { once: true });
          } else {
            el.style.display = 'none';
          }
        });
        // alt attribute from a field
        node.querySelectorAll('[data-cms-field-alt]').forEach(el => {
          const field = el.getAttribute('data-cms-field-alt');
          const v = item ? item[field] : undefined;
          if (v) el.setAttribute('alt', v);
        });
        // Repeating sub-list (e.g. service features)
        node.querySelectorAll('[data-cms-field-list]').forEach(el => {
          const field = el.getAttribute('data-cms-field-list');
          const arr = item ? item[field] : undefined;
          if (Array.isArray(arr)) {
            el.innerHTML = arr.map(line => `<li>${escapeHtml(line)}</li>`).join('');
          }
        });
        // Stars: data-cms-field-stars="rating"
        node.querySelectorAll('[data-cms-field-stars]').forEach(el => {
          const n = Number((item && item[el.getAttribute('data-cms-field-stars')]) || 5);
          const star = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
          el.innerHTML = star.repeat(Math.max(0, Math.min(5, n)));
        });
        // Apply CSS variables driven by item (e.g. brand color per service card)
        node.querySelectorAll('[data-cms-style]').forEach(el => {
          const spec = el.getAttribute('data-cms-style');
          spec.split(';').forEach(pair => {
            const [varName, field] = pair.split(':').map(s => s.trim());
            if (varName && field && item && item[field] !== undefined) {
              el.style.setProperty(varName, item[field]);
            }
          });
        });
        container.appendChild(node);
        void idx;
      });
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // ---------- Public API ----------
  window.CMS = {
    supabase: supa,
    DEFAULT_CONTENT,
    withDefaults,
    fetchContent,
    saveContent,
    uploadImage,
    applyToDom,
  };

  // Auto-apply on index.html (skipped if [data-cms-no-auto] is on <body>)
  document.addEventListener('DOMContentLoaded', async () => {
    if (document.body && document.body.hasAttribute('data-cms-no-auto')) return;
    try {
      const content = await fetchContent();
      applyToDom(content);
    } catch (e) {
      console.error('[cms] apply failed', e);
    }
  });
})();
