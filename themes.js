/* ═══════════════════════════════════════════════════════════════
   themes.js — Islamic Resources Site
   Centralised theme picker logic for all pages.

   To add a new theme:
     1. Add its colours to themes.css
     2. Add its entry to THEMES array below (name, label, bg)
     3. That's it — all pages update automatically
   ═══════════════════════════════════════════════════════════════ */

(function () {
    var THEME_KEY = 'ir-theme';

    /* ── Add new themes here ───────────────────────────────────
       name   : matches data-theme attribute and themes.css block
       label  : text shown in the picker
       bg     : swatch colour + browser toolbar colour          */
    var THEMES = [
        { name: 'day',    label: 'Day \u2014 Parchment',      bg: '#f7f3eb' },
        { name: 'umber',  label: 'Night \u2014 Warm Umber',   bg: '#1a1208' },
        { name: 'black',  label: 'Night \u2014 Near Black',   bg: '#0f0d0b' },
        { name: 'teal',   label: 'Night \u2014 Teal Slate',   bg: '#0d1418' },
        { name: 'indigo', label: 'Night \u2014 Deep Indigo',  bg: '#0e0c18' },
        { name: 'bw',     label: 'Black \u2014 High Contrast', bg: '#ffffff' },
    ];

    var metaTheme = document.querySelector('meta[name="theme-color"]');

    /* Apply theme to <html> element */
    function applyTheme(name) {
        var html = document.documentElement;
        if (name === 'day') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', name);
        }
        var theme = THEMES.find(function(t) { return t.name === name; });
        if (theme && metaTheme) metaTheme.setAttribute('content', theme.bg);
    }

    /* Update active state on picker options */
    function updateActiveState(name) {
        document.querySelectorAll('.theme-option').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.theme === name);
        });
    }

    /* Public: called by onclick on each option button */
    window.setTheme = function (name) {
        applyTheme(name);
        localStorage.setItem(THEME_KEY, name);
        updateActiveState(name);
        document.getElementById('themePanel').classList.remove('open');
    };

    /* Build the picker HTML and inject into page */
    function buildPicker() {
        /* Button */
        var btn = document.createElement('button');
        btn.className = 'theme-btn';
        btn.id = 'themeBtn';
        btn.setAttribute('aria-label', 'Change colour theme');
        btn.textContent = '🎨';

        /* Panel */
        var panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.id = 'themePanel';

        var label = document.createElement('div');
        label.className = 'theme-panel-label';
        label.textContent = 'Choose Theme';
        panel.appendChild(label);

        THEMES.forEach(function (theme) {
            var opt = document.createElement('button');
            opt.className = 'theme-option';
            opt.dataset.theme = theme.name;
            opt.setAttribute('onclick', "setTheme('" + theme.name + "')");

            var swatch = document.createElement('span');
            swatch.className = 'theme-swatch';
            swatch.style.background = theme.bg;
            if (theme.name === 'day') swatch.style.borderColor = '#d4c9b8';

            var nameSpan = document.createElement('span');
            nameSpan.className = 'theme-option-name';
            nameSpan.textContent = theme.label;

            opt.appendChild(swatch);
            opt.appendChild(nameSpan);
            panel.appendChild(opt);
        });

        document.body.appendChild(btn);
        document.body.appendChild(panel);

        /* Toggle open/close */
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            panel.classList.toggle('open');
        });
        document.addEventListener('click', function () {
            panel.classList.remove('open');
        });
        panel.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        /* Set active state on current theme */
        var saved = localStorage.getItem(THEME_KEY) || 'day';
        updateActiveState(saved);
    }

    /* Apply saved theme immediately (before paint — no flash) */
    var saved = localStorage.getItem(THEME_KEY) || 'day';
    applyTheme(saved);

    /* Build picker once DOM is ready */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildPicker);
    } else {
        buildPicker();
    }
})();
