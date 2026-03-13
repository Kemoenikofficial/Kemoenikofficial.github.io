/**
 * api.js — KEMOENIK Admin API Bridge
 * Taruh di folder: untuk-admin/
 * Ganti API_URL dengan URL Apps Script kamu
 * Set USE_MOCK = false setelah deploy
 */

const API_URL = "https://script.google.com/macros/s/AKfycbzSB5-HRcBHs7fA2SWJToHcFaTGg4FHzesI7dhwH9MMsJKNzU-qoxlWS49Rz0X9Pq79/exec";
const USE_MOCK = false; // ganti false setelah deploy

/* ═══════════════════════════════════════════
   CORE FETCH
═══════════════════════════════════════════ */

async function apiFetch(params = {}) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

/* ═══════════════════════════════════════════
   ENDPOINTS
═══════════════════════════════════════════ */

async function apiGetResi(filters = {})    { return apiFetch({ action: "getResi",     ...filters }); }
async function apiGetStats(filters = {})   { return apiFetch({ action: "getStats",    ...filters }); }
async function apiGetSellers()             { return apiFetch({ action: "seller" }); }
async function apiGetProduk()              { return apiFetch({ action: "produk" }); }
async function apiGetTahun()               { return apiFetch({ action: "tahun" }); }
async function apiTandaiLunas(seller, jumlah, tahun) {
  return apiFetch({ action: "tandaiLunas", seller, jumlah, tahun: tahun || "" });
}

/* ═══════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════ */

const MOCK_SELLERS = [
  { id: "S01", nama: "LUNISCA2026-01" },
  { id: "S02", nama: "ALNISHOP2026-02" },
  { id: "S03", nama: "SEHATBARENG" },
];

const MOCK_RESI = [
  { tanggal:"2026-03-13", nomor_resi:"JX748599721", seller:"LUNISCA2026-01",  produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"BELUM" },
  { tanggal:"2026-03-13", nomor_resi:"JNE32875502", seller:"LUNISCA2026-01",  produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"LUNAS" },
  { tanggal:"2026-03-12", nomor_resi:"JNE23047595", seller:"LUNISCA2026-01",  produk:"KEMONIK SLIM", qty:1, harga:30000, total:30000, status:"LUNAS" },
  { tanggal:"2026-03-12", nomor_resi:"JNE23047596", seller:"ALNISHOP2026-02", produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"BELUM" },
  { tanggal:"2026-03-11", nomor_resi:"PJX52840348", seller:"ALNISHOP2026-02", produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"LUNAS" },
  { tanggal:"2026-03-11", nomor_resi:"SJX10293847", seller:"SEHATBARENG",     produk:"KEMONIK SLIM", qty:1, harga:30000, total:30000, status:"LUNAS" },
  { tanggal:"2026-03-10", nomor_resi:"JNE20394857", seller:"LUNISCA2026-01",  produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"LUNAS" },
  { tanggal:"2026-03-10", nomor_resi:"JNE20394858", seller:"ALNISHOP2026-02", produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"BELUM" },
  { tanggal:"2026-03-09", nomor_resi:"JTX99887766", seller:"SEHATBARENG",     produk:"KEMONIK SLIM", qty:1, harga:30000, total:30000, status:"BELUM" },
  { tanggal:"2026-03-09", nomor_resi:"PJX11223344", seller:"LUNISCA2026-01",  produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"LUNAS" },
  { tanggal:"2026-03-08", nomor_resi:"JNE55667788", seller:"LUNISCA2026-01",  produk:"KEMONIK SLIM", qty:1, harga:30000, total:30000, status:"BELUM" },
  { tanggal:"2026-03-08", nomor_resi:"SJX99001122", seller:"ALNISHOP2026-02", produk:"KEMONIK SLIM", qty:1, harga:70000, total:70000, status:"LUNAS" },
];

function mockStats(data, seller = "") {
  const filtered = seller ? data.filter(r => r.seller === seller) : data;
  const total_penjualan = filtered.reduce((s,r) => s + r.total, 0);
  const total_lunas     = filtered.filter(r => r.status === "LUNAS").reduce((s,r) => s + r.total, 0);
  const total_belum     = filtered.filter(r => r.status === "BELUM").reduce((s,r) => s + r.total, 0);
  const perMap = {};
  filtered.forEach(r => {
    if (!perMap[r.seller]) perMap[r.seller] = { seller: r.seller, resi:0, penjualan:0, lunas:0, belum:0 };
    perMap[r.seller].resi++;
    perMap[r.seller].penjualan += r.total;
    if (r.status === "LUNAS") perMap[r.seller].lunas += r.total;
    else perMap[r.seller].belum += r.total;
  });
  return {
    total_resi:      filtered.length,
    total_penjualan, total_lunas, total_belum,
    per_seller:      Object.values(perMap).sort((a,b) => b.penjualan - a.penjualan),
    tahun:           "2026"
  };
}

/* ═══════════════════════════════════════════
   WRAPPER DENGAN MOCK FALLBACK
═══════════════════════════════════════════ */

async function loadSellers() {
  if (USE_MOCK) return MOCK_SELLERS;
  return apiGetSellers();
}

async function loadResi(filters = {}) {
  if (USE_MOCK) {
    let d = [...MOCK_RESI];
    if (filters.seller) d = d.filter(r => r.seller === filters.seller);
    if (filters.status) d = d.filter(r => r.status === filters.status);
    return d;
  }
  return apiGetResi(filters);
}

async function loadStats(filters = {}) {
  if (USE_MOCK) return mockStats(MOCK_RESI, filters.seller || "");
  return apiGetStats(filters);
}

async function loadTahun() {
  if (USE_MOCK) return ["2026"];
  return apiGetTahun();
}

async function doTandaiLunas(seller, jumlah, tahun) {
  if (USE_MOCK) {
    let count = 0;
    for (let r of MOCK_RESI) {
      if (r.seller === seller && r.status === "BELUM" && count < jumlah) {
        r.status = "LUNAS"; count++;
      }
    }
    return { status: "ok", updated: count };
  }
  return apiTandaiLunas(seller, jumlah, tahun);
}

/* ═══════════════════════════════════════════
   FORMAT HELPERS
═══════════════════════════════════════════ */

function formatRupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function formatDate(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString("id-ID", { day:"2-digit", month:"2-digit", year:"numeric" });
}

function formatDateShort(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString("id-ID", { day:"2-digit", month:"short" });
}

function exportToCSV(data, filename = "export.csv") {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows    = data.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g,'""')}"`).join(","));
  const csv     = [headers.join(","), ...rows].join("\n");
  const a       = document.createElement("a");
  a.href        = URL.createObjectURL(new Blob([csv], { type:"text/csv;charset=utf-8;" }));
  a.download    = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
