/**
 * dashboard.js — Shared utilities
 * untuk-admin/
 */

/* ── TOAST ── */
function showToast(msg, type = "success") {
  let c = document.querySelector(".toast-container");
  if (!c) { c = document.createElement("div"); c.className = "toast-container"; document.body.appendChild(c); }
  const icons = { success:"✅", error:"❌", warn:"⚠️", info:"ℹ️" };
  const t = document.createElement("div");
  t.className = `toast ${type !== "success" ? type : ""}`;
  t.innerHTML = `<span>${icons[type] || "✅"}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = "toastOut .3s ease forwards"; setTimeout(() => t.remove(), 300); }, 3000);
}

/* ── MODAL ── */
function openModal(id)  { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }
document.addEventListener("click", e => { if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("open"); });

/* ── DARK MODE ── */
function initDarkMode() {
  if (localStorage.getItem("theme") === "dark") document.documentElement.setAttribute("data-theme", "dark");
  const btn = document.getElementById("darkModeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) { document.documentElement.removeAttribute("data-theme"); localStorage.setItem("theme","light"); btn.textContent = "🌙"; }
    else       { document.documentElement.setAttribute("data-theme","dark"); localStorage.setItem("theme","dark"); btn.textContent = "☀️"; }
  });
}

/* ── CHART DEFAULTS ── */
function chartDefaults() {
  return {
    gridColor:   "rgba(221,228,218,.6)",
    textColor:   "#8A9A92",
    tooltipBg:   "#fff",
    tooltipText: "#1E2B26",
  };
}

function makeBarChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if (!ctx) return null;
  if (!window._charts) window._charts = {};
  if (window._charts[canvasId]) window._charts[canvasId].destroy();
  const d = chartDefaults();
  window._charts[canvasId] = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor:d.tooltipBg, titleColor:d.tooltipText, bodyColor:d.textColor, borderColor:"#DDE4DA", borderWidth:1, padding:12,
          callbacks: { label: c => " " + formatRupiah(c.raw) } }
      },
      scales: {
        x: { grid:{display:false}, ticks:{color:d.textColor, font:{family:"'Inter'",size:11}} },
        y: { grid:{color:d.gridColor}, ticks:{color:d.textColor, font:{family:"'Inter'",size:11}, callback: v => "Rp "+(v/1000)+"k"} }
      }
    }
  });
  return window._charts[canvasId];
}

function makeLineChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if (!ctx) return null;
  if (!window._charts) window._charts = {};
  if (window._charts[canvasId]) window._charts[canvasId].destroy();
  const d = chartDefaults();
  window._charts[canvasId] = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor:d.tooltipBg, titleColor:d.tooltipText, bodyColor:d.textColor, borderColor:"#DDE4DA", borderWidth:1, padding:12,
          callbacks: { label: c => " " + formatRupiah(c.raw) } }
      },
      scales: {
        x: { grid:{display:false}, ticks:{color:d.textColor, font:{family:"'Inter'",size:11}} },
        y: { grid:{color:d.gridColor}, ticks:{color:d.textColor, font:{family:"'Inter'",size:11}, callback: v => "Rp "+(v/1000)+"k"} }
      }
    }
  });
  return window._charts[canvasId];
}

/* ── PAGINATOR ── */
class Paginator {
  constructor(data, pageSize = 10) { this.data = data; this.pageSize = pageSize; this.currentPage = 1; }
  get totalPages()  { return Math.max(1, Math.ceil(this.data.length / this.pageSize)); }
  get currentData() { const s = (this.currentPage-1)*this.pageSize; return this.data.slice(s, s+this.pageSize); }
  setPage(p)        { this.currentPage = Math.max(1, Math.min(p, this.totalPages)); }
  renderControls(containerId, fnName) {
    const el = document.getElementById(containerId); if (!el) return;
    const { totalPages:total, currentPage:cur } = this;
    let html = `<div class="pagination"><button class="page-btn" onclick="${fnName}(${cur-1})" ${cur===1?"disabled":""}>‹</button>`;
    for (let i=1; i<=total; i++) {
      if (total>7 && i>2 && i<total-1 && Math.abs(i-cur)>1) { if (i===3||i===total-2) html+=`<span style="padding:0 4px;color:var(--text3)">…</span>`; continue; }
      html += `<button class="page-btn ${i===cur?"active":""}" onclick="${fnName}(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="${fnName}(${cur+1})" ${cur===total?"disabled":""}>›</button></div>`;
    html += `<span class="text-sm text-muted" style="margin-left:auto">${(cur-1)*this.pageSize+1}–${Math.min(cur*this.pageSize,this.data.length)} / ${this.data.length}</span>`;
    el.innerHTML = html;
  }
}

/* ── FILTER RESI ── */
function filterResi(data, { search="", seller="", status="", dateFrom="", dateTo="" } = {}) {
  return data.filter(r => {
    const q = search.toLowerCase();
    const ms = !q || [r.nomor_resi, r.seller, r.produk].some(v => v?.toLowerCase().includes(q));
    const msl = !seller || r.seller === seller;
    const mst = !status || r.status === status;
    let md = true;
    if (dateFrom||dateTo) { const d=new Date(r.tanggal); if(dateFrom&&d<new Date(dateFrom))md=false; if(dateTo&&d>new Date(dateTo+"T23:59:59"))md=false; }
    return ms && msl && mst && md;
  });
}
