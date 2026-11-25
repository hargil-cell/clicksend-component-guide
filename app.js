/* Which component? — renders the guide from data.js (GOALS) into the brand guidelines shell.
   One chapter shows at a time; the hash names the chapter (#prove) or a component (#c-quotes-grid). */
(function () {
  "use strict";

  var REQUEST_URL = "#"; // TODO: the component request form or Jira MOPS board
  var UPDATED = "25 November 2026";

  var TALL = ["blog-page-header", "blog-post-page-header", "content-rich-text-01", "content-rich-text-02", "blog-archive-pages", "features-alternating-layout-02"];
  var BADGES = { "default": "Default pick", "new": "New", "auto": "Automatic", "orients": "Non-hero", "homepage": "Homepage only" };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function icon(id, cls) { return '<svg class="' + (cls || "") + '" aria-hidden="true" focusable="false"><use href="#' + id + '"/></svg>'; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var announcer = $("[data-announcer]");
  function announce(t) { if (announcer) { announcer.textContent = ""; setTimeout(function () { announcer.textContent = t; }, 30); } }

  var IMG_SIZES = {"banner-countdown":[1216,82],"banner-dual-action":[1216,106],"banner-input-field":[1216,106],"banner-locale-switch":[1216,96],"banner-single-action":[1216,106],"banner-slim":[1216,84],"blog-archive-pages":[1440,2968],"blog-newsletter-card":[388,324],"blog-page-header":[1440,2748],"blog-post-card":[384,252],"blog-post-page-header":[1440,4333],"blog-section":[1440,666],"contact-page-header":[1440,922],"contact-sections":[1440,676],"content-footer-disclaimer":[1440,232],"content-quote-01":[1440,502],"content-rich-text-01":[1440,4599],"content-rich-text-02":[1440,2454],"content-simple-01":[1440,700],"content-simple-03":[1440,844],"content-simple-04":[1440,620],"content-simple-06":[1440,360],"content-simple-07":[1440,722],"content-simple-action-01":[1440,728],"content-simple-left-01":[1440,706],"content-split-image-01":[1440,1020],"content-split-image-02":[1440,896],"content-split-image-03":[1440,774],"content-table-01":[1440,794],"content-video":[1440,597],"cta-card-horizontal-02":[1440,354],"cta-card-horizontal":[1440,440],"cta-review-logos-01":[1440,426],"cta-simple-centered":[1440,380],"cta-split-image-01":[1440,784],"faq-accordion-02":[1440,894],"features-alternating-layout-02":[1440,2320],"features-comparison-table-01":[1440,1558],"features-icon-cards-02":[1440,924],"features-icon-cards-03":[1440,1346],"features-icons-and-image-02":[1440,1008],"features-icons-and-image-03":[1440,1040],"features-icons-and-image-05":[1440,1126],"features-image-cards-01":[1440,2120],"features-image-cards-02":[1440,998],"features-industries-icons-01":[1440,684],"features-integrations-icons-01":[1440,464],"features-integrations-icons-02":[1440,624],"features-integrations-icons-04":[1440,992],"features-large-screen-mockup-01":[1440,924],"features-list-01":[1440,740],"features-simple-icons-01":[1440,372],"features-simple-icons-02":[1440,736],"features-simple-icons-05":[1440,746],"features-small-tabs-01":[1440,1136],"features-tabs-mockup-08":[1440,942],"features-tabs-mockup-11":[1440,1008],"footer-large-02":[1440,448],"footer-large-13":[1440,531],"footer-small-02":[1440,173],"header-navigation":[1440,440],"header-section":[1440,530],"hero-centered-01":[1440,774],"hero-form-01":[1440,1274],"hero-homepage":[1440,808],"hero-split-form-01":[1440,861],"hero-split-image-01":[1440,830],"hero-split-image-02":[1440,986],"metrics-minimal-centered":[1440,694],"metrics-simple-accent-line":[1440,568],"metrics-split-image-02":[1440,794],"pricing-page-header":[1440,1344],"pricing-section":[1440,922],"sms-template-section":[1440,1086],"social-full-width-dual":[1440,383],"social-full-width":[1440,292],"social-homepage":[1440,297],"social-sms-comparison":[1434,80],"testimonial-case-study-cards":[1440,1002],"testimonial-case-study-split":[1440,640],"testimonial-comparison-cards-01":[1440,948],"testimonial-social-cards-01":[1440,900],"testimonial-social-cards-04":[1440,932]};

  /* ---------- chapters ---------- */
  var START = {
    id: "start", title: "Which component?", short: "Start here",
    intro: "Building a page in Storyblok? Find the component you need and check its rules before you build. Everything here comes from the ClickSend design system."
  };
  var CHAPTERS = [START].concat(GOALS);
  var slugToChapter = {};
  GOALS.forEach(function (g) { g.items.forEach(function (it) { slugToChapter[it.slug] = g.id; }); });

  function findSlug(goal, useText) {
    var exact = goal.items.filter(function (i) { return i.name.toLowerCase() === useText.trim().toLowerCase(); })[0];
    if (exact) return exact.slug;
    var first = useText.split(/ \+ | \/ /)[0].trim().toLowerCase();
    var hit = goal.items.filter(function (i) { return i.name.toLowerCase() === first; })[0] ||
              goal.items.filter(function (i) { return i.name.toLowerCase().indexOf(first) === 0; })[0];
    return hit ? hit.slug : null;
  }

  /* ---------- markup ---------- */
  function heroHTML(ch, idx) {
    var chips = ch.id === "start" ? [["types", "Component types"], ["names", "How naming works"], ["request", "Nothing fits?"]] : [];
    return '<header class="hero">' +
      '<div class="hero__top"><div class="hero__intro">' +
        '<h1 class="hero__title t-display-xl" id="' + ch.id + '-title">' + esc(ch.id === "start" ? START.title : ch.title) + '</h1>' +
        '<p class="hero__lede t-text-xl">' + ch.intro + '</p>' +
      '</div>' +
      '<div class="hero__tools"><div class="theme-switch" role="group" aria-label="Colour theme">' +
        '<button type="button" data-theme-value="light">Light</button><button type="button" data-theme-value="dark">Dark</button></div>' +
        '<nav class="pager" aria-label="Component type arrows">' + pagerHTML(idx) + '</nav></div>' +
      '</div>' +
      (chips.length ? '<nav class="chips" aria-label="On this page"><ul>' + chips.map(function (c) {
        return '<li><a class="chip" href="#' + c[0] + '" data-jump="' + c[0] + '">' + esc(c[1]) + '</a></li>';
      }).join("") + '</ul></nav>' : "") +
    '</header>';
  }
  function pagerHTML(idx) {
    var prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
    function btn(ch, dir) {
      var label = (dir === "prev" ? "Previous component type" : "Next component type") + (ch ? ": " + ch.short : "");
      var ic = icon(dir === "prev" ? "icon-arrow-left" : "icon-arrow-right");
      return ch ? '<a class="pager__btn" href="#' + ch.id + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + ic + '</a>'
                : '<span class="pager__btn" role="link" aria-disabled="true" aria-label="' + esc(label) + '">' + ic + '</span>';
    }
    return btn(prev, "prev") + btn(next, "next");
  }
  function footerHTML(idx) {
    var prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
    var out = '<nav class="footer-nav" aria-label="Previous and next component type">';
    out += prev ? '<a class="footer-nav__link footer-nav__link--prev" href="#' + prev.id + '">' + icon("icon-arrow-left") + '<span><span class="footer-nav__hint">Previous: </span>' + esc(prev.short) + '</span></a>' : '<span></span>';
    out += next ? '<a class="footer-nav__link footer-nav__link--next" href="#' + next.id + '"><span><span class="footer-nav__hint">Next: </span>' + esc(next.short) + '</span>' + icon("icon-arrow-right") + '</a>' : '<span class="footer-nav__link footer-nav__link--next">Last updated ' + UPDATED + '</span>';
    return out + '</nav>';
  }
  function sectionHTML(id, title, bodyHTML, assetsHTML, headExtra) {
    return '<section class="section" id="' + id + '" aria-labelledby="' + id + '-h">' +
      '<div class="section__header"><div class="section__heading"><h2 class="section__title t-display-xs" id="' + id + '-h">' + esc(title) + '</h2>' + (headExtra || "") + '</div>' +
      '<div class="section__body t-text-sm">' + bodyHTML + '</div></div>' +
      (assetsHTML ? '<div class="section__assets">' + assetsHTML + '</div>' : "") +
    '</section>';
  }

  function startBody() {
    function nameCard(slug, variant) {
      return '<a class="name-card" href="#c-' + slug + '"><span class="name-card__shot"><img src="img/' + slug + '.png" alt="" loading="lazy"></span>' +
        '<span class="name-card__name"><span class="name-demo__family">Features</span> <span class="name-demo__dash">–</span> ' + esc(variant) + '</span></a>';
    }
    var names = '<div class="name-pair">' + nameCard("features-icon-cards-03", "Centre heading + icon cards") + nameCard("features-icon-cards-02", "Left heading + icon cards") + '</div>' +
      '<p class="name-demo__legend"><span class="l-fam">Family: what kind of block it is</span><span class="l-var">What makes it different: where the heading sits and what sits under it</span></p>';
    var sections = '<div class="picker">' + GOALS.map(function (g, i) {
      return '<a class="picker__row" href="#' + g.id + '"><span class="picker__if">' + pad(i + 2) + ' · ' + esc(g.short) + '</span><span class="picker__use">' + esc(g.title) + '</span>' + icon("icon-arrow-right", "picker__go") + '</a>';
    }).join("") + '</div>';
    return sectionHTML("types", "Component types",
        '<p>Each type opens with a quick pick. Find what you need, then jump to the component to check its rules.</p><p>Know what you’re after? Search for it — “case study”, “logos”, “sign-up” — in the box on the left.</p>', sections) +
      '<hr class="divider">' +
      sectionHTML("names", "How naming works",
        '<p>Every component is named the same way in Figma and Storyblok: its family, then what makes it different.</p><p>These two are both Features blocks with icon cards. The second part of the name tells you the difference: one centres the heading above the cards, the other puts it on the left.</p>', names) +
      '<hr class="divider">' +
      sectionHTML("request", "Nothing fits?",
        '<p>Don’t adapt a component to make it work — that’s how a site drifts off-brand.</p><p>If nothing here does the job, request a new component and Harry will design it.</p>',
        '<a class="button button--primary" href="' + esc(REQUEST_URL) + '" data-request>Request a component</a>');
  }

  function componentHTML(it) {
    var badge = it.badge ? '<div class="badges"><span class="badge badge--' + esc(it.badge) + '">' + esc(BADGES[it.badge] || it.badge) + '</span></div>' : "";
    var rules = (it.rules || []).map(function (r) { return '<li class="do">' + esc(r) + '</li>'; }).join("") +
                (it.avoid || []).map(function (r) { return '<li class="dont">' + esc(r) + '</li>'; }).join("");
    var body = '<p class="use t-text-md"><strong>Use when</strong> ' + esc(it.use) + '</p>' +
      (rules ? '<ul class="rules">' + rules + '</ul>' : "");
    var assets = "";
    if (it.table) {
      assets += '<div class="picker"><table class="opt-table"><thead><tr>' + it.table.head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
        '</tr></thead><tbody>' + it.table.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div>';
    }
    if (!it.noThumb) {
      var tall = TALL.indexOf(it.slug) >= 0;
      assets += (assets ? '<div style="height:var(--space-24)"></div>' : "") +
        '<figure class="panel shot' + (tall ? " shot--tall" : "") + '"><img src="img/' + esc(it.slug) + '.png"' + (IMG_SIZES[it.slug] ? ' width="' + IMG_SIZES[it.slug][0] + '" height="' + IMG_SIZES[it.slug][1] + '"' : '') + ' alt="' + esc(it.name) + ' preview" loading="lazy"></figure>';
    }
    return sectionHTML("c-" + it.slug, it.name, body, assets, badge);
  }

  function goalBody(g) {
    var pick = '<div class="picker"><div class="picker__row picker__head"><span>If you need…</span><span>Use</span><span></span></div>' + g.picks.map(function (p) {
      var s = findSlug(g, p[1]);
      var inner = '<span class="picker__if">' + esc(p[0]) + '</span><span class="picker__use">' + esc(p[1]) + '</span>' + icon("icon-arrow-right", "picker__go");
      return s ? '<a class="picker__row" href="#c-' + s + '">' + inner + '</a>' : '<div class="picker__row">' + inner + '</div>';
    }).join("") + '</div>';
    var watch = g.watch && g.watch.length ? '<div style="height:var(--space-24)"></div><div class="callout"><div><p class="callout__title">Watch out</p><ul>' + g.watch.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + '</ul></div></div>' : "";
    var out = sectionHTML("pick", "Quick pick", '<p>Find the line that matches what you need, then jump to the component to check its rules.</p>', pick + watch);
    g.items.forEach(function (it) { out += '<hr class="divider">' + componentHTML(it); });
    return out;
  }

  /* ---------- render ---------- */
  var main = $("[data-main]");
  main.innerHTML = CHAPTERS.map(function (ch, i) {
    return '<article class="chapter" id="ch-' + ch.id + '" data-chapter="' + ch.id + '" aria-labelledby="' + ch.id + '-title" hidden>' +
      heroHTML(ch, i) + '<div class="chapter__body">' + (ch.id === "start" ? startBody() : goalBody(ch)) + '</div>' + footerHTML(i) + '</article>';
  }).join("");
  // Section ids repeat per chapter ("pick"); make them unique by chapter
  $$("[data-chapter]").forEach(function (a) {
    var cid = a.getAttribute("data-chapter");
    $$("#pick, #pick-h", a).forEach(function (n) { n.id = n.id.replace("pick", cid + "--pick"); });
    var sec = $("[id='" + cid + "--pick']", a); if (sec) sec.setAttribute("aria-labelledby", cid + "--pick-h");
    $$("[data-jump='pick']", a).forEach(function (c) { c.setAttribute("data-jump", cid + "--pick"); c.setAttribute("href", "#" + cid + "--pick"); });
  });
  $$("[data-request]").forEach(function (a) { a.setAttribute("href", REQUEST_URL); });

  // Thin images (banners, logo rows) stay at their natural width
  $$(".shot img").forEach(function (img) {
    img.addEventListener("load", function () { if (img.naturalWidth / img.naturalHeight > 4) img.parentNode.classList.add("shot--thin"); });
  });

  /* ---------- sidebar nav ---------- */
  var nav = $("[data-chapter-nav]");
  nav.innerHTML = CHAPTERS.map(function (ch, i) {
    var subs = ch.id === "start" ? [["types", "Component types"], ["names", "How naming works"], ["request", "Nothing fits?"]]
      : ch.items.map(function (it) { return ["c-" + it.slug, it.name]; });
    return '<li class="nav-item" data-nav="' + ch.id + '"><a class="nav-link" href="#' + ch.id + '"><span class="nav-num">' + pad(i + 1) + '</span>' + esc(ch.short) + '</a>' +
      '<div class="subnav-wrap"><ul class="subnav">' + subs.map(function (s) { return '<li><a class="subnav-link" href="#' + s[0] + '" data-sub="' + s[0] + '">' + esc(s[1]) + '</a></li>'; }).join("") + '</ul></div></li>';
  }).join("");

  /* ---------- routing ---------- */
  var current = null;
  function chapterFor(hash) {
    if (!hash) return "start";
    if (CHAPTERS.some(function (c) { return c.id === hash; })) return hash;
    if (hash.indexOf("c-") === 0 && slugToChapter[hash.slice(2)]) return slugToChapter[hash.slice(2)];
    if (/--pick$/.test(hash)) return hash.replace(/--pick$/, "");
    if (["anatomy", "chapters", "sections", "types", "names", "request"].indexOf(hash) >= 0) return "start";
    return "start";
  }
  function show(hash, fromHashChange) {
    var cid = chapterFor(hash);
    var switched = cid !== current;
    if (switched) {
      $$("[data-chapter]").forEach(function (a) { a.hidden = a.getAttribute("data-chapter") !== cid; });
      $$(".nav-item").forEach(function (li) { li.classList.toggle("is-active", li.getAttribute("data-nav") === cid); });
      current = cid;
      var ch = CHAPTERS.filter(function (c) { return c.id === cid; })[0];
      document.title = (cid === "start" ? "" : ch.title + " · ") + "Which component? · ClickSend";
      announce(cid === "start" ? "Start here" : ch.title);
    }
    var target = hash && hash !== cid ? document.getElementById(hash) : null;
    if (target) {
      // Smooth only within the same page of the guide; a fresh page jumps straight there
      var smooth = fromHashChange && !switched;
      requestAnimationFrame(function () { target.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "instant" }); });
      if (!smooth) {
        // Fonts and images can still shift the layout, so settle on the target again once they're in
        var settle = function () { if (location.hash.slice(1) === hash) target.scrollIntoView({ block: "start", behavior: "instant" }); };
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
        window.addEventListener("load", settle, { once: true });
      }
    } else if (fromHashChange) {
      window.scrollTo(0, 0);
    }
    closeMenu();
  }
  window.addEventListener("hashchange", function () { show(location.hash.slice(1), true); });

  // Sub-nav highlight follows scrolling
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      $$(".subnav-link").forEach(function (l) { if (l.getAttribute("data-sub") === id) l.setAttribute("aria-current", "location"); else l.removeAttribute("aria-current"); });
      $$(".chip").forEach(function (c) { if (c.getAttribute("data-jump") === id) c.setAttribute("aria-current", "location"); else c.removeAttribute("aria-current"); });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  $$(".section").forEach(function (s) { io.observe(s); });

  /* ---------- theme ---------- */
  var rootEl = document.documentElement;
  function syncTheme() {
    var t = rootEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
    $$(".theme-switch button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-value") === t)); });
  }
  $$(".theme-switch button").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-theme-value");
      rootEl.setAttribute("data-theme", t);
      try { localStorage.setItem("cs-theme", t); } catch (e) {}
      syncTheme(); announce(t === "dark" ? "Dark theme on" : "Light theme on");
    });
  });
  syncTheme();

  /* ---------- drawer (below 1280px) ---------- */
  var sidebar = $("#sidebar"), scrim = $("[data-scrim]"), toggle = $("[data-menu-toggle]");
  function openMenu() { sidebar.classList.add("is-open"); scrim.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); }
  function closeMenu() { sidebar.classList.remove("is-open"); scrim.classList.remove("is-open"); if (toggle) toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", openMenu);
  scrim.addEventListener("click", closeMenu);
  $("[data-menu-close]").addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- search ---------- */
  var input = $("#search"), panel = $("[data-search-panel]"), list = $("#search-results"), empty = $("[data-search-empty]");
  var index = [];
  GOALS.forEach(function (g) {
    g.items.forEach(function (it) {
      index.push({ id: "c-" + it.slug, name: it.name, chapter: g.short,
        text: [it.name, it.figma, it.use].concat(it.rules || [], it.avoid || [], it.table ? [].concat.apply([], it.table.rows) : []).join(" ") });
    });
    g.picks.forEach(function (p) { var s = findSlug(g, p[1]); if (s) index.push({ id: "c-" + s, name: p[1], chapter: g.short, text: p[0] + " " + p[1], pick: p[0] }); });
  });
  var results = [], sel = -1;
  function hl(s, q) { var i = s.toLowerCase().indexOf(q); return i < 0 ? esc(s) : esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length)); }
  function snippet(t, q) { var i = t.toLowerCase().indexOf(q); if (i < 0) return t.slice(0, 90); var s = Math.max(0, i - 30); return (s ? "…" : "") + t.slice(s, s + 100); }
  function runSearch() {
    var q = input.value.trim().toLowerCase();
    if (!q) { panel.hidden = true; input.setAttribute("aria-expanded", "false"); return; }
    var seen = {};
    results = index.filter(function (r) { return r.text.toLowerCase().indexOf(q) >= 0; })
      .sort(function (a, b) { return (b.name.toLowerCase().indexOf(q) >= 0) - (a.name.toLowerCase().indexOf(q) >= 0); })
      .filter(function (r) { if (seen[r.id]) return false; seen[r.id] = 1; return true; }).slice(0, 12);
    sel = results.length ? 0 : -1;
    list.innerHTML = results.map(function (r, i) {
      return '<li class="search__result" role="option" id="sr-' + i + '" aria-selected="' + (i === sel) + '" data-go="' + r.id + '">' +
        '<span class="search__where"><span class="search__chapter">' + esc(r.chapter) + '</span> · ' + hl(r.name, q) + '</span>' +
        '<span class="search__snippet">' + hl(snippet(r.pick || r.text, q), q) + '</span></li>';
    }).join("");
    empty.hidden = !!results.length; empty.textContent = results.length ? "" : "Nothing matches “" + input.value.trim() + "”. Try another word, or request a component.";
    panel.hidden = false; input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-activedescendant", sel >= 0 ? "sr-" + sel : "");
  }
  function go(id) { panel.hidden = true; input.setAttribute("aria-expanded", "false"); input.blur(); if (location.hash === "#" + id) show(id, false); else location.hash = id; }
  input.addEventListener("input", runSearch);
  input.addEventListener("focus", function () { if (input.value.trim()) runSearch(); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!results.length) return; e.preventDefault();
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
      $$(".search__result", list).forEach(function (li, i) { li.setAttribute("aria-selected", String(i === sel)); if (i === sel) li.scrollIntoView({ block: "nearest" }); });
      input.setAttribute("aria-activedescendant", "sr-" + sel);
    } else if (e.key === "Enter" && sel >= 0) { e.preventDefault(); go(results[sel].id); }
    else if (e.key === "Escape") { panel.hidden = true; input.setAttribute("aria-expanded", "false"); }
  });
  list.addEventListener("mousedown", function (e) { var li = e.target.closest("[data-go]"); if (li) { e.preventDefault(); go(li.getAttribute("data-go")); } });
  document.addEventListener("click", function (e) { if (!e.target.closest("[data-search]")) panel.hidden = true; });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault(); if (window.innerWidth < 1280) openMenu(); input.focus();
    }
  });

  show(location.hash.slice(1), false);
})();
