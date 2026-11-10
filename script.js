(function () {
  "use strict";
  var R = window.RECIPE;
  var SRC = R.sources;

  // ---------- helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function textOf(line) { return typeof line === "string" ? line : line.text; }

  // Line diff using longest common subsequence.
  function diffLines(a, b) {
    var n = a.length, m = b.length, i, j;
    var dp = [];
    for (i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var ops = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { ops.push({ type: "same", text: a[i], o: i, n: j }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ type: "del", text: a[i], o: i }); i++; }
      else { ops.push({ type: "add", text: b[j], n: j }); j++; }
    }
    while (i < n) { ops.push({ type: "del", text: a[i], o: i }); i++; }
    while (j < m) { ops.push({ type: "add", text: b[j], n: j }); j++; }
    // Group consecutive changes into hunks.
    var hunk = -1, inHunk = false;
    ops.forEach(function (op) {
      if (op.type === "same") { inHunk = false; return; }
      if (!inHunk) { hunk++; inHunk = true; }
      op.hunk = hunk;
    });
    ops.hunks = hunk + 1;
    return ops;
  }

  function fileHead(name, ops, note) {
    var frag = document.createDocumentFragment();
    var head = el("div", "file-head");
    head.appendChild(el("span", "file-name", name));
    if (ops) {
      var adds = ops.filter(function (o) { return o.type === "add"; }).length;
      var dels = ops.filter(function (o) { return o.type === "del"; }).length;
      var stat = el("span", "file-stat");
      stat.appendChild(el("span", "a", "+" + adds));
      stat.appendChild(document.createTextNode(" "));
      stat.appendChild(el("span", "d", "-" + dels));
      head.appendChild(stat);
    }
    frag.appendChild(head);
    if (note) frag.appendChild(el("div", "file-note", note));
    return frag;
  }

  function row(op) {
    var r = el("div", "row " + op.type);
    if (/^#/.test(op.text)) r.classList.add("head");
    r.appendChild(el("span", "n", op.o != null ? String(op.o + 1) : ""));
    r.appendChild(el("span", "n", op.n != null ? String(op.n + 1) : ""));
    r.appendChild(el("span", "s", op.type === "add" ? "+" : op.type === "del" ? "-" : " "));
    r.appendChild(el("span", "t", op.text));
    return r;
  }

  function comment(author, src, pace, trades, why) {
    var c = el("div", "comment");
    c.style.setProperty("--src", "var(--" + (src === "onhand" ? "other" : src) + ")");
    var who = el("div", "who");
    who.appendChild(el("strong", null, author));
    who.appendChild(document.createTextNode("commented"));
    if (src) who.appendChild(el("span", "tag src-" + src, SRC[src]));
    if (pace) who.appendChild(el("span", "tag " + pace, pace === "fast" ? "fast choice" : "slow choice"));
    (trades || []).forEach(function (t) { who.appendChild(el("span", "tag", "traded " + t)); });
    c.appendChild(who);
    if (why) c.appendChild(el("p", null, why));
    return c;
  }

  // ---------- Files changed ----------
  var oldLines = R.original.lines;
  var newLines = R.thea.lines.map(textOf);
  var meta = {};
  R.thea.lines.forEach(function (l, i) { if (typeof l !== "string") meta[i] = l; });
  var ops = diffLines(oldLines, newLines);

  // Each hunk takes the source of its first tagged added line.
  var hunkSrc = {};
  ops.forEach(function (op) {
    if (op.type === "add" && meta[op.n]) {
      var s = meta[op.n].src || (meta[op.n].note && meta[op.n].note.source);
      if (s && hunkSrc[op.hunk] == null) hunkSrc[op.hunk] = s;
    }
  });
  ops.forEach(function (op) {
    if (op.type === "same") return;
    var m = op.type === "add" ? meta[op.n] : null;
    op.src = (m && (m.src || (m.note && m.note.source))) || hunkSrc[op.hunk] || "twist";
  });

  document.getElementById("change-count").textContent = ops.hunks;

  var fileEl = document.getElementById("file-cookies");
  fileEl.appendChild(fileHead(R.thea.name, ops, "Base: " + R.original.source));
  var diffEl = el("div", "diff");
  ops.forEach(function (op) {
    var r = row(op);
    if (op.src) r.dataset.src = op.src;
    diffEl.appendChild(r);
    var m = op.type === "add" ? meta[op.n] : null;
    if (m && m.note) {
      var c = comment("thea-ishida", m.note.source, m.note.pace, null, m.note.why);
      c.dataset.src = m.note.source;
      diffEl.appendChild(c);
    }
  });
  fileEl.appendChild(diffEl);

  // Filters
  var used = [];
  ops.forEach(function (op) { if (op.src && used.indexOf(op.src) < 0) used.push(op.src); });
  var hidden = {};
  var filters = document.getElementById("filters");
  used.forEach(function (s) {
    var b = el("button", "chip src-" + s);
    b.type = "button";
    b.setAttribute("aria-pressed", "true");
    b.appendChild(el("span", "dot"));
    b.appendChild(el("span", "lbl", SRC[s]));
    b.addEventListener("click", function () {
      hidden[s] = !hidden[s];
      b.setAttribute("aria-pressed", hidden[s] ? "false" : "true");
      diffEl.querySelectorAll("[data-src]").forEach(function (n) {
        n.classList.toggle("dim", !!hidden[n.dataset.src]);
      });
    });
    filters.appendChild(b);
  });

  // Waters' principles: unchanged, but forkable.
  var pEl = document.getElementById("file-principles");
  pEl.appendChild(fileHead(R.principles.name, null,
    "No changes. Even Waters' advice against being ruled by recipes is a list of rules (" +
    R.principles.source + "). You can fork this file too."));
  var pDiff = el("div", "diff");
  R.principles.lines.forEach(function (t, i) { pDiff.appendChild(row({ type: "same", text: t, o: i, n: i })); });
  pEl.appendChild(pDiff);

  // ---------- Time ----------
  var barsDone = false;
  function fmt(min) {
    if (min < 60) return min + " min";
    var h = Math.floor(min / 60), m = min % 60;
    return h + " hr" + (m ? " " + m + " min" : "");
  }
  var max = Math.max.apply(null, R.times.map(function (t) { return t.minutes; }));
  var barsEl = document.getElementById("time-bars");
  R.times.forEach(function (t) {
    var r = el("div", "bar-row" + (/^My /.test(t.label) ? " me" : ""));
    var lab = el("div", "bar-label");
    lab.appendChild(el("span", null, t.label));
    lab.appendChild(el("strong", null, fmt(t.minutes)));
    var track = el("div", "bar-track");
    var fill = el("div", "bar-fill");
    fill.dataset.w = (t.minutes / max * 100).toFixed(1) + "%";
    track.setAttribute("role", "img");
    track.setAttribute("aria-label", t.label + ": " + fmt(t.minutes));
    track.appendChild(fill);
    r.appendChild(lab); r.appendChild(track);
    barsEl.appendChild(r);
  });
  function growBars() {
    if (barsDone) return;
    barsDone = true;
    requestAnimationFrame(function () {
      barsEl.querySelectorAll(".bar-fill").forEach(function (f) { f.style.width = f.dataset.w; });
    });
  }

  // ---------- Tabs ----------
  var tabs = document.querySelectorAll(".tabs button");
  function show(name) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.tab === name ? "true" : "false"); });
    ["diff", "time", "fork"].forEach(function (n) { document.getElementById("tab-" + n).hidden = n !== name; });
    if (name === "time") growBars();
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.dataset.tab); }); });

  // ---------- Fork ----------
  var bases = {
    original: R.original.lines,
    thea: newLines,
    principles: R.principles.lines
  };
  var baseNames = { original: R.original.name, thea: R.thea.name, principles: R.principles.name };
  var state = { base: "original", text: bases.original.join("\n"), tags: {} };

  var baseSel = document.getElementById("fork-base");
  var ta = document.getElementById("fork-text");
  var tagsEl = document.getElementById("fork-tags");
  var forkDiff = document.getElementById("fork-diff");
  var statusEl = document.getElementById("fork-status");

  function userLines() {
    return state.text.split("\n").map(function (s) { return s.replace(/\s+$/, ""); }).filter(function (s, i, arr) {
      return !(s === "" && i === arr.length - 1);
    });
  }

  function renderTags(fops) {
    tagsEl.textContent = "";
    var adds = fops.filter(function (o) { return o.type === "add" && o.text.trim() !== ""; });
    if (!adds.length) {
      tagsEl.appendChild(el("p", "empty", "Edit a line above and it will show up here to tag."));
      return;
    }
    adds.forEach(function (op) {
      var key = op.text;
      var tag = state.tags[key] || (state.tags[key] = { src: "", trade: [] });
      var box = el("div", "tagrow");
      box.appendChild(el("div", "line", "+ " + op.text));
      var ctrls = el("div", "ctrls");
      var lab = el("label", null, "Came from ");
      var sel = document.createElement("select");
      sel.appendChild(new Option("choose...", ""));
      Object.keys(SRC).forEach(function (k) { sel.appendChild(new Option(SRC[k], k)); });
      sel.value = tag.src;
      sel.addEventListener("change", function () { tag.src = sel.value; renderDiff(fops); });
      lab.appendChild(sel);
      ctrls.appendChild(lab);
      ctrls.appendChild(el("span", "muted", "Traded:"));
      ["time", "money", "effort"].forEach(function (t) {
        var l = el("label", "trade");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = tag.trade.indexOf(t) >= 0;
        cb.addEventListener("change", function () {
          tag.trade = tag.trade.filter(function (x) { return x !== t; });
          if (cb.checked) tag.trade.push(t);
          renderDiff(fops);
        });
        l.appendChild(cb);
        l.appendChild(document.createTextNode(t));
        ctrls.appendChild(l);
      });
      box.appendChild(ctrls);
      tagsEl.appendChild(box);
    });
  }

  function renderDiff(fops) {
    forkDiff.textContent = "";
    forkDiff.appendChild(fileHead("your-fork-of-" + baseNames[state.base], fops));
    var d = el("div", "diff");
    if (!fops.hunks) d.appendChild(el("p", "empty", "No changes yet. Same as the base."));
    fops.forEach(function (op) {
      d.appendChild(row(op));
      var t = op.type === "add" && state.tags[op.text];
      if (t && (t.src || t.trade.length)) d.appendChild(comment("you", t.src, null, t.trade, null));
    });
    forkDiff.appendChild(d);
  }

  function update(rebuildTags) {
    var fops = diffLines(bases[state.base], userLines());
    if (rebuildTags) renderTags(fops);
    renderDiff(fops);
  }

  var timer;
  ta.addEventListener("input", function () {
    state.text = ta.value;
    statusEl.textContent = "";
    clearTimeout(timer);
    timer = setTimeout(function () { update(true); }, 250);
  });
  baseSel.addEventListener("change", function () {
    state.base = baseSel.value;
    state.text = bases[state.base].join("\n");
    state.tags = {};
    ta.value = state.text;
    statusEl.textContent = "";
    update(true);
  });
  document.getElementById("fork-reset").addEventListener("click", function () {
    state.text = bases[state.base].join("\n");
    state.tags = {};
    ta.value = state.text;
    history.replaceState(null, "", location.pathname + location.search);
    statusEl.textContent = "Back to the base file.";
    update(true);
  });

  // Fork lives in the URL so nothing is stored or sent anywhere.
  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  document.getElementById("fork-save").addEventListener("click", function () {
    // Keep only tags for lines still in the fork.
    var lines = userLines(), tags = {};
    Object.keys(state.tags).forEach(function (k) {
      var t = state.tags[k];
      if (lines.indexOf(k) >= 0 && (t.src || t.trade.length)) tags[k] = t;
    });
    var link = location.origin + location.pathname + "#fork=" + encode({ b: state.base, t: state.text, g: tags });
    history.replaceState(null, "", link);
    statusEl.textContent = "Saved. Copy the link from the address bar to share your fork.";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(function () {
        statusEl.textContent = "Saved. The link to your fork is copied.";
      }, function () {});
    }
  });

  function loadFromHash() {
    var m = location.hash.match(/^#fork=(.+)$/);
    if (!m) return false;
    try {
      var d = decode(m[1]);
      if (!bases[d.b] || typeof d.t !== "string") return false;
      state.base = d.b; state.text = d.t; state.tags = d.g || {};
      Object.keys(state.tags).forEach(function (k) {
        var t = state.tags[k];
        if (typeof t.src !== "string" || !Array.isArray(t.trade)) delete state.tags[k];
      });
      statusEl.textContent = "You opened someone's fork. Change it and save your own.";
      return true;
    } catch (e) { return false; }
  }

  var fromLink = loadFromHash();
  baseSel.value = state.base;
  ta.value = state.text;
  update(true);
  show(fromLink ? "fork" : "diff");
})();
