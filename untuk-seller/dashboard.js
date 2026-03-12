/**
 * dashboard.js — Shared Dashboard Utilities
 */

// ──────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────────────────────────────────

function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = { success: "✅", error: "❌", warn: "⚠️", info: "ℹ️" };
  const toast = document.createElement("div");
  toast.className = `toast ${type !== "success" ? type : ""}`;
  toast.innerHTML = `<span>${icons[type] || "✅"}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ──────────────────────────────────────────────────────────────
// MODAL
// ──────────────────────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id)?.classList.add("open");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
}

// Click outside to close
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
  }
});

// ──────────────────────────────────────────────────────────────
// DARK MODE TOGGLE
// ──────────────────────────────────────────────────────────────

function initDarkMode() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") document.documentElement.setAttribute("data-theme", "dark");

  const btn = document.getElementById("darkModeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  });
}

// ──────────────────────────────────────────────────────────────
// CHART DEFAULTS (Chart.js)
// ──────────────────────────────────────────────────────────────

function getChartDefaults() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    gridColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    textColor: isDark ? "#86efac" : "#6b7280",
    tooltipBg: isDark ? "#1a2e1a" : "#fff",
    tooltipText: isDark ? "#f0fdf4" : "#111827",
  };
}

function makeBarChart(canvasId, labels, datasets, title = "") {
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if (!ctx) return null;
  const d = getChartDefaults();

  // Destroy existing
  if (window._charts && window._charts[canvasId]) {
    window._charts[canvasId].destroy();
  }
  if (!window._charts) window._charts = {};

  const chart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: datasets.length > 1, labels: { color: d.textColor, font: { family: "'Plus Jakarta Sans'" } } },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.textColor,
          borderColor: "rgba(22,163,74,0.2)",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => " " + formatRupiah(ctx.raw),
          },
        },
        title: title ? { display: true, text: title, color: d.textColor } : { display: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.textColor, font: { family: "'Plus Jakarta Sans'", size: 11 } } },
        y: {
          grid: { color: d.gridColor },
          ticks: {
            color: d.textColor,
            font: { family: "'Plus Jakarta Sans'", size: 11 },
            callback: v => "Rp " + (v / 1000) + "k",
          },
        },
      },
    },
  });
  window._charts[canvasId] = chart;
  return chart;
}

function makeLineChart(canvasId, labels, datasets, title = "") {
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if (!ctx) return null;
  const d = getChartDefaults();

  if (window._charts && window._charts[canvasId]) {
    window._charts[canvasId].destroy();
  }
  if (!window._charts) window._charts = {};

  const chart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: datasets.length > 1, labels: { color: d.textColor, font: { family: "'Plus Jakarta Sans'" } } },
        tooltip: {
          backgroundColor: d.tooltipBg,
          titleColor: d.tooltipText,
          bodyColor: d.textColor,
          borderColor: "rgba(22,163,74,0.2)",
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => " " + formatRupiah(ctx.raw),
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.textColor, font: { family: "'Plus Jakarta Sans'", size: 11 } } },
        y: {
          grid: { color: d.gridColor },
          ticks: {
            color: d.textColor,
            font: { family: "'Plus Jakarta Sans'", size: 11 },
            callback: v => "Rp " + (v / 1000) + "k",
          },
        },
      },
    },
  });
  window._charts[canvasId] = chart;
  return chart;
}

// ──────────────────────────────────────────────────────────────
// PAGINATION
// ──────────────────────────────────────────────────────────────

class Paginator {
  constructor(data, pageSize = 10) {
    this.data = data;
    this.pageSize = pageSize;
    this.currentPage = 1;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.data.length / this.pageSize));
  }

  get currentData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  setPage(p) {
    this.currentPage = Math.max(1, Math.min(p, this.totalPages));
  }

  renderControls(containerId, onPageChange) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const total = this.totalPages;
    const cur = this.currentPage;

    let html = `<div class="pagination">`;
    html += `<button class="page-btn" onclick="${onPageChange}(${cur - 1})" ${cur === 1 ? "disabled" : ""}>‹</button>`;

    for (let i = 1; i <= total; i++) {
      if (total > 7 && i > 2 && i < total - 1 && Math.abs(i - cur) > 1) {
        if (i === 3 || i === total - 2) html += `<span style="padding:0 4px;color:var(--text-muted)">…</span>`;
        continue;
      }
      html += `<button class="page-btn ${i === cur ? "active" : ""}" onclick="${onPageChange}(${i})">${i}</button>`;
    }

    html += `<button class="page-btn" onclick="${onPageChange}(${cur + 1})" ${cur === total ? "disabled" : ""}>›</button>`;
    html += `</div>`;
    html += `<span class="text-sm text-muted" style="margin-left:auto">
      ${(cur - 1) * this.pageSize + 1}–${Math.min(cur * this.pageSize, this.data.length)} of ${this.data.length}
    </span>`;

    el.innerHTML = html;
  }
}

// ──────────────────────────────────────────────────────────────
// SEARCH + FILTER
// ──────────────────────────────────────────────────────────────

function filterResi(data, { search = "", seller = "", dateFrom = "", dateTo = "", status = "" } = {}) {
  return data.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || [r.nomor_resi, r.seller, r.produk].some(v => v?.toLowerCase().includes(q));
    const matchSeller = !seller || r.seller === seller;
    const matchStatus = !status || r.status === status;

    let matchDate = true;
    if (dateFrom || dateTo) {
      const d = new Date(r.tanggal);
      if (dateFrom && d < new Date(dateFrom)) matchDate = false;
      if (dateTo && d > new Date(dateTo + "T23:59:59")) matchDate = false;
    }

    return matchSearch && matchSeller && matchStatus && matchDate;
  });
}
