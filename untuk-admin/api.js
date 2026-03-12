/**
 * api.js — Google Sheets API Bridge
 * Replace API_URL with your deployed Google Apps Script Web App URL
 */

const API_URL = "https://script.google.com/macros/s/AKfycbzdc4cmtrU4hMYsugpgRFBXEB6c1by7N-89NmVCwxmRgrqVGCfIUw8zhtbdq04L8fpl/exec";

// ──────────────────────────────────────────────────────────────
// CORE FETCH HELPER
// ──────────────────────────────────────────────────────────────

async function apiFetch(params = {}) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

async function apiPost(body = {}) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API POST Error:", err);
    throw err;
  }
}

// ──────────────────────────────────────────────────────────────
// RESI / TRANSACTIONS
// ──────────────────────────────────────────────────────────────

async function getResi(filters = {}) {
  return apiFetch({ action: "getResi", ...filters });
}

async function getResiSeller(seller) {
  return apiFetch({ action: "getResi", seller });
}

// Bulk mark as LUNAS
// seller: seller name, jumlah: number of items to mark
async function tandaiLunas(seller, jumlah) {
  return apiPost({ action: "tandaiLunas", seller, jumlah: Number(jumlah) });
}

// ──────────────────────────────────────────────────────────────
// SELLERS
// ──────────────────────────────────────────────────────────────

async function getSellers() {
  return apiFetch({ action: "seller" });
}

async function getSellerNames() {
  return apiFetch({ action: "seller" });
}

// ──────────────────────────────────────────────────────────────
// PRODUK
// ──────────────────────────────────────────────────────────────

async function getProduk() {
  return apiFetch({ action: "produk" });
}

// ──────────────────────────────────────────────────────────────
// ANALYTICS (computed client-side from RESI data)
// ──────────────────────────────────────────────────────────────

function computeStats(resiData) {
  const totalResi = resiData.length;
  const sellers = [...new Set(resiData.map(r => r.seller))];
  const totalPenjualan = resiData.reduce((s, r) => s + Number(r.total || r.harga || 0), 0);
  const totalBelumBayar = resiData
    .filter(r => r.status === "BELUM")
    .reduce((s, r) => s + Number(r.total || r.harga || 0), 0);
  const countBelum = resiData.filter(r => r.status === "BELUM").length;

  // Resi hari ini
  const today = new Date().toLocaleDateString("id-ID");
  const resiHariIni = resiData.filter(r => {
    const d = new Date(r.tanggal);
    return d.toLocaleDateString("id-ID") === today;
  }).length;

  return {
    totalResi,
    totalSeller: sellers.length,
    totalPenjualan,
    totalBelumBayar,
    countBelum,
    resiHariIni,
  };
}

function computePenjualanPerSeller(resiData) {
  const map = {};
  resiData.forEach(r => {
    if (!map[r.seller]) map[r.seller] = 0;
    map[r.seller] += Number(r.total || r.harga || 0);
  });
  return Object.entries(map).map(([seller, total]) => ({ seller, total }));
}

function computePenjualanHarian(resiData, days = 7) {
  const map = {};
  resiData.forEach(r => {
    const d = new Date(r.tanggal);
    const label = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
    if (!map[label]) map[label] = { label, total: 0, date: d };
    map[label].total += Number(r.total || r.harga || 0);
  });
  return Object.values(map)
    .sort((a, b) => a.date - b.date)
    .slice(-days);
}

function computeOverdue(resiData) {
  const map = {};
  resiData
    .filter(r => r.status === "BELUM")
    .forEach(r => {
      if (!map[r.seller]) map[r.seller] = 0;
      map[r.seller] += Number(r.total || r.harga || 0);
    });
  return Object.entries(map)
    .map(([seller, total]) => ({ seller, total }))
    .sort((a, b) => b.total - a.total);
}

// ──────────────────────────────────────────────────────────────
// FORMAT HELPERS
// ──────────────────────────────────────────────────────────────

function formatRupiah(n) {
  if (!n && n !== 0) return "Rp 0";
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

// ──────────────────────────────────────────────────────────────
// EXCEL EXPORT (client-side using SheetJS if available)
// ──────────────────────────────────────────────────────────────

function exportToCSV(data, filename = "export.csv") {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA (for demo when API is unavailable)
// ──────────────────────────────────────────────────────────────

const MOCK_RESI = [
  { tanggal: "2024-04-25", nomor_resi: "JX748599721", seller: "LUNISCA2026-01", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "BELUM" },
  { tanggal: "2024-04-25", nomor_resi: "JNE32875502", seller: "LUNISCA2026-01", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "LUNAS" },
  { tanggal: "2024-04-25", nomor_resi: "JNE23047595", seller: "LUNISCA2026-01", produk: "KEMONIK SLIM", qty: 1, harga: 30000, total: 30000, status: "LUNAS" },
  { tanggal: "2024-04-25", nomor_resi: "JNE23047596", seller: "ALNISHOP2026-02", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "BELUM" },
  { tanggal: "2024-04-24", nomor_resi: "PJX52840348", seller: "ALNISHOP2026-02", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "LUNAS" },
  { tanggal: "2024-04-24", nomor_resi: "SJX10293847", seller: "SEHATBARENG", produk: "KEMONIK SLIM", qty: 1, harga: 30000, total: 30000, status: "LUNAS" },
  { tanggal: "2024-04-23", nomor_resi: "JNE20394857", seller: "LUNISCA2026-01", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "LUNAS" },
  { tanggal: "2024-04-23", nomor_resi: "JNE20394858", seller: "ALNISHOP2026-02", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "BELUM" },
  { tanggal: "2024-04-22", nomor_resi: "JTX99887766", seller: "SEHATBARENG", produk: "KEMONIK SLIM", qty: 1, harga: 30000, total: 30000, status: "BELUM" },
  { tanggal: "2024-04-22", nomor_resi: "PJX11223344", seller: "LUNISCA2026-01", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "LUNAS" },
  { tanggal: "2024-04-21", nomor_resi: "JNE55667788", seller: "LUNISCA2026-01", produk: "KEMONIK SLIM", qty: 1, harga: 30000, total: 30000, status: "BELUM" },
  { tanggal: "2024-04-21", nomor_resi: "SJX99001122", seller: "ALNISHOP2026-02", produk: "KEMONIK SLIM", qty: 1, harga: 70000, total: 70000, status: "LUNAS" },
];

const MOCK_SELLERS = ["LUNISCA2026-01", "ALNISHOP2026-02", "SEHATBARENG"];

// Use mock data by default; set to false when real API is ready
const USE_MOCK = false;

async function loadResi(filters = {}) {
  if (USE_MOCK) {
    let data = [...MOCK_RESI];
    if (filters.seller) data = data.filter(r => r.seller === filters.seller);
    return data;
  }
  return getResi(filters);
}

async function loadSellers() {
  if (USE_MOCK) return MOCK_SELLERS;
  return getSellerNames();
}

async function doTandaiLunas(seller, jumlah) {
  if (USE_MOCK) {
    let count = 0;
    for (let r of MOCK_RESI) {
      if (r.seller === seller && r.status === "BELUM" && count < jumlah) {
        r.status = "LUNAS";
        count++;
      }
    }
    return { status: "ok", updated: count };
  }
  return tandaiLunas(seller, jumlah);
}
