(function () {
  var root = document.documentElement;
  root.removeAttribute("data-theme");
  try {
    localStorage.removeItem("theme");
  } catch (e) {}

  var N = 8;
  var cv = document.getElementById("led");
  var ctx = cv.getContext("2d");
  var statusEl = document.getElementById("matrix-status");
  var bestEl = document.getElementById("matrix-best");
  var resetBtn = document.getElementById("matrix-reset");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var size = 360;
  var colors = {};
  var best = 3;
  var rows, r, len, pos, dir, acc, last, flash, flashUntil;

  try {
    best = Math.max(3, Math.min(N, parseInt(localStorage.getItem("tower-best"), 10) || 3));
  } catch (e) {}
  bestEl.textContent = String(best);

  // Read once per theme change instead of three getComputedStyle calls per frame.
  function readColors() {
    var s = getComputedStyle(root);
    colors = {
      fg: s.getPropertyValue("--fg").trim() || "#101916",
      accent: s.getPropertyValue("--accent").trim() || "#0b6b52",
      led: s.getPropertyValue("--led").trim() || "#9e6b00"
    };
  }

  function setStatus(note) {
    statusEl.textContent = "Height " + r + "/8 · " + note;
  }

  function saveBest() {
    if (r <= best) return;
    best = r;
    bestEl.textContent = String(best);
    try {
      localStorage.setItem("tower-best", String(best));
    } catch (e) {}
  }

  function fit() {
    size = cv.clientWidth || 360;
    cv.width = cv.height = Math.round(size * dpr);
    ctx.setTransform(cv.width / size, 0, 0, cv.width / size, 0, 0);
  }

  function reset() {
    rows = [{ s: 2, l: 4 }, { s: 3, l: 3 }, { s: 3, l: 2 }];
    r = 3;
    len = 2;
    pos = 0;
    dir = 1;
    acc = 0;
    flash = null;
    setStatus(reduced ? "Aim, then Space" : "Space or tap");
  }

  function interval() {
    return Math.max(70, 190 - r * 16);
  }

  function draw() {
    var cell = size / N;
    var pad = cell * 0.14;
    var w = cell - pad * 2;
    var flashing = flash && Date.now() < flashUntil;
    ctx.clearRect(0, 0, size, size);
    for (var y = 0; y < N; y++) {
      // Row 0 sits at the bottom of the matrix to match physical stacking.
      var row = N - 1 - y;
      for (var x = 0; x < N; x++) {
        var lock = row < rows.length && x >= rows[row].s && x < rows[row].s + rows[row].l;
        var move = row === r && r < N && x >= pos && x < pos + len;
        var on = lock || move;
        ctx.globalAlpha = on ? 1 : 0.14;
        ctx.fillStyle = move ? colors.led : (on ? colors.accent : colors.fg);
        if (flashing && on) ctx.fillStyle = flash === "bad" ? colors.led : colors.accent;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x * cell + pad, y * cell + pad, w, w, cell * 0.18);
        else ctx.rect(x * cell + pad, y * cell + pad, w, w);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function endRound(kind, note, ms) {
    flash = kind;
    flashUntil = Date.now() + ms;
    setStatus(note);
    draw();
    setTimeout(function () {
      reset();
      draw();
    }, ms + 50);
  }

  function press() {
    if (flash) return;
    var prev = rows[r - 1];
    var s = Math.max(pos, prev.s);
    var e = Math.min(pos + len, prev.s + prev.l);
    if (e - s <= 0) {
      endRound("bad", "Missed, resetting", 700);
      return;
    }
    rows.push({ s: s, l: e - s });
    len = e - s;
    r += 1;
    saveBest();
    if (r >= N) {
      endRound("good", "Tower complete!", 900);
      return;
    }
    pos = 0;
    dir = 1;
    acc = 0;
    setStatus("Locked · width " + len);
    draw();
  }

  // Reduced motion: the bar holds still and the player aims it by hand.
  function aim(to) {
    pos = Math.max(0, Math.min(N - len, to));
    draw();
  }

  function tick(t) {
    if (last == null) last = t;
    var dt = t - last;
    last = t;
    if (!flash && r < N) {
      acc += dt;
      var iv = interval();
      while (acc >= iv) {
        acc -= iv;
        pos += dir;
        if (pos + len >= N) {
          pos = N - len;
          dir = -1;
        } else if (pos <= 0) {
          pos = 0;
          dir = 1;
        }
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  cv.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    if (reduced && !flash) {
      var col = Math.floor((e.offsetX / size) * N);
      if (col < pos || col >= pos + len) {
        aim(col - Math.floor(len / 2));
        return;
      }
    }
    press();
  });
  cv.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.key === "Enter") {
      e.preventDefault();
      press();
    } else if (reduced && !flash && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      aim(pos + (e.key === "ArrowLeft" ? -1 : 1));
    }
  });
  resetBtn.addEventListener("click", function () {
    reset();
    draw();
  });
  window.addEventListener("resize", function () {
    fit();
    draw();
  });

  fit();
  readColors();
  reset();
  draw();
  if (!reduced) requestAnimationFrame(tick);

  var filterBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var searchInput = document.getElementById("project-search");
  var emptyState = document.getElementById("project-empty");
  var countEl = document.getElementById("project-count");
  var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));
  var activeCat = "all";

  // Counts come from the list itself so they cannot drift from the HTML.
  filterBtns.forEach(function (btn) {
    var cat = btn.getAttribute("data-filter");
    var n = projects.filter(function (p) {
      return cat === "all" || p.getAttribute("data-category") === cat;
    }).length;
    btn.textContent += " (" + n + ")";
  });

  function applyFilters() {
    var q = searchInput.value.toLowerCase().trim();
    var shown = 0;
    projects.forEach(function (item) {
      var visible =
        (activeCat === "all" || item.getAttribute("data-category") === activeCat) &&
        (!q || item.textContent.toLowerCase().indexOf(q) !== -1);
      item.hidden = !visible;
      if (visible) shown += 1;
    });
    countEl.textContent = "Showing " + shown + " of " + projects.length + " archive projects";
    emptyState.hidden = shown > 0;
  }

  function setCategory(cat) {
    activeCat = cat;
    filterBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === cat));
    });
    applyFilters();
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setCategory(btn.getAttribute("data-filter"));
    });
  });
  searchInput.addEventListener("input", applyFilters);
  document.getElementById("project-reset").addEventListener("click", function () {
    searchInput.value = "";
    setCategory("all");
    searchInput.focus();
  });

  // Hero hardware chips either jump to a flagship card or filter the archive.
  Array.prototype.slice.call(document.querySelectorAll(".chip")).forEach(function (chip) {
    chip.addEventListener("click", function () {
      var targetSel = chip.getAttribute("data-jump");
      var query = chip.getAttribute("data-search");
      if (targetSel) {
        var el = document.querySelector(targetSel);
        if (!el) return;
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
        el.classList.add("flash-target");
        el.focus({ preventScroll: true });
        setTimeout(function () {
          el.classList.remove("flash-target");
        }, 1200);
      } else if (query) {
        searchInput.value = query;
        setCategory("all");
        var workEl = document.getElementById("work");
        if (workEl) workEl.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    });
  });

  applyFilters();
})();
