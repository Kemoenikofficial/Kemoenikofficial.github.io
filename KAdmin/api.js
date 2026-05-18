/**
 * api.js — KEMOENIK v2.0
 * ========================
 * Update: logika revisi lengkap
 * - Harga admin vs seller
 * - Status SEBAGIAN
 * - Tandai lunas by nominal Rp
 * - Return dengan barang_kembali
 * - Kredit kirim ulang
 * - Riwayat pembayaran
 */

const API_URL = "https://script.google.com/macros/s/AKfycbyiEETd12P2Ga0uUL3NBRWNGrWlMuPTzqaqrB8T1YExzSgIMSOJI8qtbvwZ7tm_vGDwZQ/exec";
const USE_MOCK = false;

// ══════════════════════════════════════════════
//  CORE FETCH
// ══════════════════════════════════════════════
async function apiFetch(params = {}) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) url.searchParams.append(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// ══════════════════════════════════════════════
//  ENDPOINTS
// ══════════════════════════════════════════════
async function apiGetResi(filters = {})      { return apiFetch({ action: "getResi",       ...filters }); }
async function apiGetStats(filters = {})     { return apiFetch({ action: "getStats",      ...filters }); }
async function apiGetReturn(filters = {})    { return apiFetch({ action: "getReturn",     ...filters }); }
async function apiGetKredit(filters = {})    { return apiFetch({ action: "getKredit",     ...filters }); }
async function apiGetPembayaran(filters = {}) { return apiFetch({ action: "getPembayaran",...filters }); }
async function apiGetSellers()               { return apiFetch({ action: "seller" }); }
async function apiGetProduk()                { return apiFetch({ action: "produk" }); }
async function apiGetTahun()                 { return apiFetch({ action: "tahun" }); }
async function apiGetStok()                  { return apiFetch({ action: "getStok" }); }

// Tandai lunas — sekarang pakai nominal Rp
async function apiTandaiLunas(seller, nominal, tahun, catatan = "") {
  return apiFetch({
    action  : "tandaiLunas",
    seller,
    nominal : nominal,
    tahun   : tahun || "",
    catatan : catatan || "",
  });
}

// Scan return — sekarang ada field barang_kembali
async function apiScanReturn(resi, alasan, barangKembali = "TIDAK") {
  return apiFetch({
    action         : "scanReturn",
    resi,
    alasan,
    barang_kembali : barangKembali,
  });
}

// Pakai kredit kirim ulang
async function apiPakaiKredit(seller, resiAsal) {
  return apiFetch({ action: "pakaiKredit", seller, resi_asal: resiAsal });
}

// ══════════════════════════════════════════════
//  WRAPPER DENGAN MOCK FALLBACK
// ══════════════════════════════════════════════
async function loadSellers() {
  if (USE_MOCK) return MOCK_SELLERS;
  return apiGetSellers();
}

async function loadProduk() {
  if (USE_MOCK) return MOCK_PRODUK;
  return apiGetProduk();
}

async function loadResi(filters = {}) {
  if (USE_MOCK) {
    let d = [...MOCK_RESI];
    if (filters.seller) d = d.filter(r => r.seller === filters.seller);
    if (filters.status) d = d.filter(r => r.status === filters.status);
    if (filters.tipe)   d = d.filter(r => r.tipe_akun === filters.tipe);
    return d;
  }
  return apiGetResi(filters);
}

async function loadStats(filters = {}) {
  if (USE_MOCK) return mockStats(MOCK_RESI, filters.seller || "");
  return apiGetStats(filters);
}

async function loadReturn(filters = {}) {
  if (USE_MOCK) return MOCK_RETURN;
  return apiGetReturn(filters);
}

async function loadKredit(filters = {}) {
  if (USE_MOCK) return MOCK_KREDIT;
  return apiGetKredit(filters);
}

async function loadPembayaran(filters = {}) {
  if (USE_MOCK) return MOCK_PEMBAYARAN;
  return apiGetPembayaran(filters);
}

async function loadTahun() {
  if (USE_MOCK) return ["2026"];
  return apiGetTahun();
}

async function loadStok() {
  if (USE_MOCK) return MOCK_STOK;
  return apiGetStok();
}

// Tandai lunas — parameter berubah: nominal (Rp) bukan jumlah produk
async function doTandaiLunas(seller, nominal, tahun, catatan = "") {
  if (USE_MOCK) {
    const belum = MOCK_RESI.filter(r => r.seller === seller && (r.status === "BELUM" || r.status === "SEBAGIAN"))
      .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    let sisaUang     = parseFloat(nominal);
    const resiLunas  = [];

    for (const r of belum) {
      if (sisaUang <= 0) break;
      const sisa = r.sisa || r.total;
      if (sisaUang >= sisa) {
        r.terbayar = r.total;
        r.sisa     = 0;
        r.status   = "LUNAS";
        sisaUang  -= sisa;
        resiLunas.push(r.nomor_resi + " (LUNAS)");
      } else {
        r.terbayar = (r.terbayar || 0) + sisaUang;
        r.sisa     = sisa - sisaUang;
        r.status   = "SEBAGIAN";
        sisaUang   = 0;
        resiLunas.push(r.nomor_resi + " (SEBAGIAN)");
      }
    }

    return {
      status        : "ok",
      resi_diproses : resiLunas.length,
      resi_dilunasi : resiLunas,
      sisa_uang     : sisaUang > 0 ? sisaUang : 0,
    };
  }
  return apiTandaiLunas(seller, nominal, tahun, catatan);
}

async function doScanReturn(resi, alasan, barangKembali = "TIDAK") {
  if (USE_MOCK) {
    const found = MOCK_RESI.find(r => r.nomor_resi === resi);
    if (!found) return { status: "error", pesan: "Resi tidak ditemukan" };
    found.status = "RETURN";
    return { status: "ok", seller: found.seller, produk: found.produk, qty: found.qty, barang_kembali: barangKembali };
  }
  return apiScanReturn(resi, alasan, barangKembali);
}

// ══════════════════════════════════════════════
//  FORMAT HELPERS
// ══════════════════════════════════════════════
function formatRupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function formatDate(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateShort(s) {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

// Badge status — sekarang include SEBAGIAN
function badgeStatus(status) {
  const map = {
    "LUNAS"    : `<span class="badge badge-lunas">LUNAS</span>`,
    "BELUM"    : `<span class="badge badge-belum">BELUM</span>`,
    "SEBAGIAN" : `<span class="badge badge-sebagian">SEBAGIAN</span>`,
    "RETURN"   : `<span class="badge badge-return">RETURN</span>`,
  };
  return map[(status || "").toUpperCase()] || `<span class="badge">${status}</span>`;
}

function exportToCSV(data, filename = "export.csv") {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows    = data.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
  const csv     = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  const a       = document.createElement("a");
  a.href        = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  a.download    = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ══════════════════════════════════════════════
//  MOCK DATA — lengkap dengan field baru
// ══════════════════════════════════════════════
const MOCK_SELLERS = [
  { id: "S01", nama: "LUNISCA2026-01" },
  { id: "S02", nama: "ALNISHOP2026-02" },
  { id: "S03", nama: "SEHATBARENG" },
];

const MOCK_PRODUK = [
  { kode: "SLIM", nama: "KEMOENIK SLIM", harga_seller: 60000, harga_admin: 70000 },
  { kode: "BOLD", nama: "KEMOENIK BOLD", harga_seller: 55000, harga_admin: 65000 },
];

const MOCK_RESI = [
  { tanggal:"2026-03-13", nomor_resi:"JX748599721", tipe_akun:"SELLER",   seller:"LUNISCA2026-01",  produk:"KEMOENIK SLIM", qty:1, harga:60000, total:60000, terbayar:0,     sisa:60000, status:"BELUM" },
  { tanggal:"2026-03-13", nomor_resi:"JNE32875502", tipe_akun:"SELLER",   seller:"LUNISCA2026-01",  produk:"KEMOENIK SLIM", qty:1, harga:60000, total:60000, terbayar:60000, sisa:0,     status:"LUNAS" },
  { tanggal:"2026-03-12", nomor_resi:"JNE23047595", tipe_akun:"OFFICIAL", seller:"KEMOENIK OFFICIAL", produk:"KEMOENIK SLIM", qty:1, harga:70000, total:70000, terbayar:70000, sisa:0,   status:"LUNAS" },
  { tanggal:"2026-03-12", nomor_resi:"JNE23047596", tipe_akun:"SELLER",   seller:"ALNISHOP2026-02", produk:"KEMOENIK SLIM", qty:2, harga:60000, total:120000, terbayar:60000, sisa:60000, status:"SEBAGIAN" },
  { tanggal:"2026-03-11", nomor_resi:"PJX52840348", tipe_akun:"SELLER",   seller:"ALNISHOP2026-02", produk:"KEMOENIK SLIM", qty:1, harga:60000, total:60000, terbayar:0,     sisa:60000, status:"BELUM" },
  { tanggal:"2026-03-11", nomor_resi:"SJX10293847", tipe_akun:"SELLER",   seller:"SEHATBARENG",     produk:"KEMOENIK SLIM", qty:1, harga:60000, total:60000, terbayar:0,     sisa:60000, status:"RETURN" },
];

const MOCK_RETURN = [
  { tanggal_return:"2026-03-11", nomor_resi:"SJX10293847", seller:"SEHATBARENG", produk:"KEMOENIK SLIM", qty:1, alasan:"Tidak ada penerima", barang_kembali:"YA",  status_bayar:"BELUM" },
  { tanggal_return:"2026-03-10", nomor_resi:"JNE99887766", seller:"LUNISCA2026-01", produk:"KEMOENIK SLIM", qty:1, alasan:"Alamat tidak ditemukan", barang_kembali:"TIDAK", status_bayar:"BELUM" },
];

const MOCK_KREDIT = [
  { tanggal_masuk:"2026-03-11", resi_asal:"SJX10293847", seller:"SEHATBARENG", produk:"KEMOENIK SLIM", qty_kredit:1, status_kredit:"TERSEDIA" },
];

const MOCK_PEMBAYARAN = [
  { tanggal_bayar:"2026-03-13 10:30:00", seller:"LUNISCA2026-01", nominal_transfer:60000, resi_dilunasi:["JNE32875502 (LUNAS)"], catatan:"Transfer BCA" },
];

const MOCK_STOK = [
  { produk:"KEMOENIK SLIM", stok_masuk:500, keluar:6, kembali:1, kirim_ulang:0, net_keluar:5, sisa:495, warning:false },
  { produk:"KEMOENIK BOLD", stok_masuk:200, keluar:195, kembali:0, kirim_ulang:0, net_keluar:195, sisa:5, warning:true },
];

function mockStats(data, seller = "") {
  const filtered = seller ? data.filter(r => r.seller === seller && r.tipe_akun === "SELLER") : data;
  const total_penjualan = filtered.reduce((s, r) => s + r.total, 0);
  const total_lunas     = filtered.filter(r => r.status === "LUNAS").reduce((s, r) => s + r.total, 0)
                        + filtered.filter(r => r.status === "SEBAGIAN").reduce((s, r) => s + r.terbayar, 0);
  const total_belum     = filtered.filter(r => r.status === "BELUM").reduce((s, r) => s + r.sisa, 0)
                        + filtered.filter(r => r.status === "SEBAGIAN").reduce((s, r) => s + r.sisa, 0);
  const total_sebagian  = filtered.filter(r => r.status === "SEBAGIAN").reduce((s, r) => s + r.sisa, 0);

  const perMap = {};
  filtered.filter(r => r.tipe_akun === "SELLER").forEach(r => {
    if (!perMap[r.seller]) perMap[r.seller] = { seller: r.seller, resi: 0, penjualan: 0, lunas: 0, belum: 0, sebagian: 0, return: 0 };
    perMap[r.seller].resi++;
    perMap[r.seller].penjualan += r.total;
    if (r.status === "LUNAS")    perMap[r.seller].lunas    += r.total;
    if (r.status === "BELUM")    perMap[r.seller].belum    += r.sisa;
    if (r.status === "SEBAGIAN") perMap[r.seller].sebagian += r.sisa;
    if (r.status === "RETURN")   perMap[r.seller].return++;
  });

  return {
    total_resi      : filtered.length,
    total_penjualan,
    total_lunas,
    total_belum,
    total_sebagian,
    total_return    : filtered.filter(r => r.status === "RETURN").length,
    per_seller      : Object.values(perMap).sort((a, b) => b.penjualan - a.penjualan),
    tahun           : "2026",
  };
}
