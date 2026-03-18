let cart = [];
let appliedCoupon = null;
let lastCheckoutData = { customer: {}, method: 'transfer', coupon: null };
let currentInvoice = {};

function loadCart() {
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { cart = []; }
    updateStickyBar();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addCart(id) {
    const p = CONFIG.products.find(x => x.id === id);
    if (!p) return;
    
    const exist = cart.find(i => i.id === id);
    const finalPrice = p.price - Math.floor(p.price * (p.discount || 0) / 100);
    
    if (exist) {
        exist.qty++;
    } else {
        cart.push({
            id: p.id,
            name: p.name,
            price: finalPrice,
            images: p.images,
            qty: 1
        });
    }
    
    saveCart();
    updateStickyBar();
}

function updateCartQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty < 1) {
            cart = cart.filter(x => x.id !== id);
        }
        saveCart();
        renderCartModal();
        updateStickyBar();
    }
}

function updateStickyBar() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    
    document.getElementById('sticky-count').innerText = count;
    document.getElementById('sticky-items').innerText = count;
    document.getElementById('sticky-total').innerText = formatPrice(total);
    document.getElementById('sticky-bar').style.display = count > 0 ? 'block' : 'none';
}

function openCart() {
    renderCartModal();
    openModal('cart-modal');
}

function closeCart() {
    closeModal('cart-modal');
}

function renderCartModal() {
    const content = document.getElementById('cart-content');
    content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Keranjang Belanja</h3>
            <button onclick="closeCart()" class="text-gray-400 p-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        
        <div id="cart-list" class="max-h-48 overflow-y-auto border-b pb-4 mb-4" style="-webkit-overflow-scrolling: touch;"></div>
        
        <div class="mb-4">
            <div class="flex gap-2">
                <input type="text" id="coupon-input" class="input-style mb-0 text-sm flex-1" placeholder="Kode Kupon" value="${appliedCoupon ? appliedCoupon.code : ''}">
                <button onclick="applyCoupon()" class="text-white px-4 rounded-xl text-xs font-bold" style="background: #1F2937;">Pakai</button>
            </div>
            <p id="coupon-msg" class="text-[11px] mt-1 hidden"></p>
        </div>
        
        <div class="mb-4 bg-gray-50 p-3 rounded-xl text-xs text-gray-600">
            <p class="font-semibold text-gray-700 mb-1">Ongkos Kirim:</p>
            <p class="text-gray-500">Akan dikonfirmasi via WhatsApp.</p>
        </div>
        
        <div class="mb-4">
            <label class="text-xs text-gray-500 font-medium">Metode Pembayaran</label>
            <select id="payment-method" class="input-style mb-0 text-sm mt-1" onchange="handlePaymentChange()">
                <option value="transfer" ${lastCheckoutData.method === 'transfer' ? 'selected' : ''}>Transfer Produk + Ongkir</option>
                <option value="cod_ongkir" ${lastCheckoutData.method === 'cod_ongkir' ? 'selected' : ''}>COD Ongkir Saja</option>
                <option value="cod_full" ${lastCheckoutData.method === 'cod_full' ? 'selected' : ''}>COD Full (Bayar Ditempat)</option>
            </select>
            <p id="payment-note" class="text-[10px] text-gray-400 mt-1 hidden"></p>
        </div>

        <div id="transfer-method-container" class="mb-4">
            <label class="text-xs text-gray-500 font-medium">Transfer Melalui</label>
            <select id="transfer-bank" class="input-style text-sm mt-1">
                <option value="BRI">Bank BRI</option>
                <option value="DANA">DANA</option>
                <option value="SeaBank">SeaBank</option>
            </select>
        </div>

        <div class="bg-emerald-50 p-4 rounded-xl mb-4 text-sm">
            <div class="flex justify-between mb-1"><span class="text-gray-600">Subtotal</span><span id="sum-subtotal">${formatPrice(0)}</span></div>
            <div class="flex justify-between mb-1 text-red-500"><span>Diskon Ongkir</span><span id="sum-disc">- ${formatPrice(0)}</span></div>
            <div class="border-t mt-2 pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span id="sum-total" style="color: var(--primary-dark);">${formatPrice(0)}</span>
            </div>
        </div>
        
        <button onclick="proceedToCheckout()" class="btn-primary">Checkout Sekarang</button>`;
    
    renderCartItems();
    updateCartSummary();
    handlePaymentChange();
}

function renderCartItems() {
    const el = document.getElementById('cart-list');
    
    if (cart.length === 0) {
        el.innerHTML = '<p class="text-center text-gray-400 py-8 text-sm">Keranjang kosong</p>';
        return;
    }
    
    el.innerHTML = cart.map(i => `
        <div class="flex gap-3 items-center mb-3 pb-3 border-b border-gray-100">
            <img src="${i.images?.[0] || 'https://placehold.co/100'}" class="w-14 h-14 rounded-xl object-cover">
            <div class="flex-1">
                <h4 class="font-semibold text-sm text-gray-800">${i.name}</h4>
                <div class="flex items-center gap-2 mt-1">
                    <button onclick="updateCartQty(${i.id}, -1)" class="w-6 h-6 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition">-</button>
                    <span class="text-sm font-bold">${i.qty}</span>
                    <button onclick="updateCartQty(${i.id}, 1)" class="w-6 h-6 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition">+</button>
                </div>
            </div>
            <span class="text-sm font-bold" style="color: var(--primary-dark);">${formatPrice(i.price * i.qty)}</span>
        </div>
    `).join('');
}

function updateCartSummary() {
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const method = document.getElementById('payment-method')?.value;
    let disc = 0;
    
    if (appliedCoupon && method !== 'cod_full') {
        disc = appliedCoupon.value;
    }
    
    document.getElementById('sum-subtotal').innerText = formatPrice(subtotal);
    document.getElementById('sum-disc').innerText = `- ${formatPrice(disc)}`;
    document.getElementById('sum-total').innerText = formatPrice(Math.max(0, subtotal - disc));
}

function handlePaymentChange() {
    const method = document.getElementById('payment-method').value;
    const transferBox = document.getElementById('transfer-method-container');
    const note = document.getElementById('payment-note');
    
    if (method === 'cod_full') {
        transferBox.classList.add('hidden');
        note.innerText = "COD Full tidak mendapat potongan ongkir.";
        note.classList.remove('hidden');
    } else {
        transferBox.classList.remove('hidden');
        note.classList.add('hidden');
    }
    lastCheckoutData.method = method;
    updateCartSummary();
}

function applyCoupon() {
    const code = document.getElementById('coupon-input').value.toUpperCase();
    const coupon = CONFIG.coupons.find(x => x.code === code);
    const msg = document.getElementById('coupon-msg');
    const method = document.getElementById('payment-method').value;
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    
    msg.classList.remove('hidden');
    
    if (method === 'cod_full') {
        msg.innerText = "Gagal! COD Full tidak dapat menggunakan kupon.";
        msg.style.color = '#EF4444';
        appliedCoupon = null;
    } else if (coupon) {
        if (subtotal >= coupon.minPurchase) {
            appliedCoupon = coupon;
            lastCheckoutData.coupon = coupon;
            msg.innerText = "Kupon berhasil diterapkan!";
            msg.style.color = '#059669';
            msg.style.fontWeight = '600';
        } else {
            appliedCoupon = null;
            lastCheckoutData.coupon = null;
            msg.innerText = `Minimal belanja ${formatPrice(coupon.minPurchase)}`;
            msg.style.color = '#EF4444';
        }
    } else {
        appliedCoupon = null;
        lastCheckoutData.coupon = null;
        msg.innerText = "Kode kupon tidak valid";
        msg.style.color = '#EF4444';
    }
    
    updateCartSummary();
}

function proceedToCheckout() {
    if (cart.length === 0) return;
    closeCart();
    renderCheckout(lastCheckoutData.customer || {});
    openModal('checkout-modal');
}

function renderCheckout(data) {
    const content = document.getElementById('checkout-content');
    content.innerHTML = `
        <button onclick="backToCart()" class="absolute top-4 right-4 text-gray-400 p-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="font-bold text-lg mb-4">Data Pengiriman</h3>
        
        <input type="text" id="c-name" class="input-style" placeholder="Nama Lengkap *" value="${data.name || ''}">
        <input type="tel" id="c-phone" class="input-style" placeholder="Nomor WhatsApp *" value="${data.phone || ''}">
        <input type="text" id="c-address" class="input-style" placeholder="Alamat Lengkap (RT/RW + Desa) *" value="${data.address || ''}">
        <input type="text" id="c-district" class="input-style" placeholder="Kecamatan *" value="${data.district || ''}">
        <input type="text" id="c-city" class="input-style" placeholder="Kabupaten/Kota *" value="${data.city || ''}">
        <input type="text" id="c-prov" class="input-style" placeholder="Provinsi *" value="${data.prov || ''}">
        <input type="text" id="c-notes" class="input-style" placeholder="Catatan (Opsional)" value="${data.notes || ''}">
        
        <button onclick="generateInvoice()" class="btn-primary mt-2">Buat Pesanan</button>`;
}

function backToCart() {
    closeModal('checkout-modal');
    openCart();
}

function generateInvoice() {
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const address = document.getElementById('c-address').value.trim();
    const district = document.getElementById('c-district').value.trim();
    const city = document.getElementById('c-city').value.trim();
    const prov = document.getElementById('c-prov').value.trim();
    const notes = document.getElementById('c-notes').value.trim();
    const payMethod = lastCheckoutData.method;
    
    if (!name || !phone || !address || !district || !city || !prov) {
        alert("Mohon lengkapi semua data wajib!");
        return;
    }
    
    lastCheckoutData.customer = { name, phone, address, district, city, prov, notes };
    lastCheckoutData.coupon = appliedCoupon;
    
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    let disc = 0;
    if (payMethod !== 'cod_full' && appliedCoupon) {
        disc = appliedCoupon.value;
    }
    const total = Math.max(0, subtotal - disc);
    const orderId = generateOrderId();
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    currentInvoice = {
        id: orderId,
        date: dateStr,
        customer: lastCheckoutData.customer,
        items: [...cart],
        subtotal,
        disc,
        total,
        payment: payMethod,
        notes,
        selectedBank: document.getElementById('transfer-bank')?.value || 'BRI'
    };
    
    cart = [];
    saveCart();
    updateStickyBar();
    closeModal('checkout-modal');
    
    const selectedBank = currentInvoice.selectedBank;
    const filteredBank = CONFIG.bankAccounts.find(b => b.bank === selectedBank);
    
    let paymentInfoHtml = '';
    if (payMethod === 'cod_full') {
        paymentInfoHtml = `
            <div style="margin-top:20px; border-top:1px dashed #ddd; padding-top:15px;">
                <h4 style="color:#DC2626; font-weight:bold; margin-bottom:8px;">BAYAR DI TEMPAT (COD)</h4>
                <p style="font-size:12px; color:#6B7280;">Total dibayar saat barang diterima.</p>
            </div>`;
    } else {
        paymentInfoHtml = `
            <div style="margin-top:20px; border-top:1px dashed #ddd; padding-top:15px;">
                <h4 style="font-weight:bold; margin-bottom:10px;">INFORMASI PEMBAYARAN</h4>
                <div class="bank-card-modern ${filteredBank.cardClass}">
                    <div class="bank-logo-container">
                        <div class="bank-logo-box ${filteredBank.logoClass}">${filteredBank.bank}</div>
                        <span class="bank-name-modern">${filteredBank.bank}</span>
                    </div>
                    <div class="bank-number-container">
                        <span class="bank-number-modern">${filteredBank.number}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${filteredBank.number}', this)">Salin</button>
                    </div>
                    <div class="bank-owner-badge">a.n. ${filteredBank.name}</div>
                </div>
            </div>`;
    }
    
    const invoiceHtml = `
        <div class="invoice-card">
            <div style="text-align:center; margin-bottom:20px;">
                <img src="images/logo/Logo-Kemoenik.jpg" style="width:60px; margin:0 auto 8px auto; display:block; border-radius:12px;">
                <h2 style="font-size:16px; font-weight:800; color:#1F2937;">KEMOENIK OFFICIAL STORE</h2>
                <p style="font-size:11px; color:#6B7280; margin-top:4px;">${CONFIG.storeAddress}</p>
            </div>
            
            <hr style="margin:15px 0; border-style:dashed;">
            
            <h3 style="text-align:center; font-weight:bold; margin-bottom:20px; font-size:14px;">INVOICE PESANAN</h3>
            
            <div style="margin-bottom: 20px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f3f4f6; padding: 8px 0;">
                    <span style="font-weight: 600;">Order ID</span>
                    <span style="font-family: monospace;">#${orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f3f4f6; padding: 8px 0;">
                    <span>Tanggal</span>
                    <span>${dateStr}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span>Status</span>
                    <span style="color: #D97706; font-weight: bold;">Menunggu Pembayaran</span>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; font-size: 12px;">
                <h4 style="font-weight: bold; margin-bottom: 8px; color:#374151;">DATA PEMBELI</h4>
                <p style="color: #1F2937; font-weight: 600;">${name}</p>
                <p style="color: #6B7280; font-size: 11px;">${phone}</p>
                <p style="color: #9CA3AF; font-size: 11px; margin-top: 4px;">${address}, Kec. ${district}, ${city}, ${prov}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; margin-bottom: 12px; font-size: 12px;">DETAIL PESANAN</h4>
                <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
                            <th style="text-align: left; padding: 8px;">Item</th>
                            <th style="text-align: center; padding: 8px; width: 40px;">Qty</th>
                            <th style="text-align: right; padding: 8px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentInvoice.items.map(i => `
                            <tr style="border-bottom: 1px solid #f3f4f6;">
                                <td style="padding: 8px;">${i.name}</td>
                                <td style="padding: 8px; text-align: center;">${i.qty}</td>
                                <td style="padding: 8px; text-align: right;">${formatPrice(i.price * i.qty)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="background: #F0FDF4; padding: 16px; border-radius: 12px; font-size: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #EF4444;"><span>Diskon</span><span>- ${formatPrice(disc)}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>Ongkir</span><span style="color: #9CA3AF; font-size: 10px;">(Konfirmasi Admin)</span></div>
                <div style="border-top: 1px solid #D1FAE5; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
                    <span>Total Bayar</span>
                    <span style="color: #059669;">${formatPrice(total)}</span>
                </div>
            </div>
            
            <div style="font-size: 11px; color: #374151; margin-bottom: 12px; font-weight: 600;">
                Metode: ${payMethod === 'cod_full' ? 'COD Full (Bayar Ditempat)' : payMethod === 'cod_ongkir' ? 'COD Ongkir Saja' : 'Transfer Bank'}
            </div>
            
            ${paymentInfoHtml}
            
            ${notes ? `<div style="margin-top: 16px; font-size: 11px; color: #6B7280; border-top: 1px solid #e5e7eb; padding-top: 12px;">Catatan: ${notes}</div>` : ''}

            <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e5e7eb; font-size:10px; text-align:center; color:#9CA3AF;">
                <p style="font-weight: 600; color: #6B7280;">Terima kasih telah berbelanja!</p>
                <p style="margin-top: 4px;">Pesanan akan diproses setelah konfirmasi pembayaran</p>
            </div>
        </div>`;
    
    document.getElementById('invoice-container').innerHTML = invoiceHtml;
    openModal('invoiceModal');
}

function closeInvoice() {
    closeModal('invoiceModal');
    window.scrollTo(0, 0);
}

function editInvoice() {
    cart = [...currentInvoice.items];
    saveCart();
    updateStickyBar();
    appliedCoupon = lastCheckoutData.coupon || null;
    closeModal('invoiceModal');
    openCart();
}

function printInvoice() {
    window.print();
}

function generateWAText() {
    const d = currentInvoice;
    const addr = d.customer;
    
    let text = `*INVOICE PESANAN*\n`;
    text += `====================\n`;
    text += `Order ID: #${d.id}\n`;
    text += `Tanggal: ${d.date}\n\n`;
    text += `*DATA PEMBELI*\n`;
    text += `Nama: ${addr.name}\n`;
    text += `No HP: ${addr.phone}\n`;
    text += `Alamat: ${addr.address}, Kec. ${addr.district}, ${addr.city}, ${addr.prov}\n\n`;
    text += `*DETAIL PESANAN*\n`;
    text += `-------------------\n`;
    d.items.forEach(i => {
        text += `${i.name}\n`;
        text += `${i.qty} x ${formatPrice(i.price)} = ${formatPrice(i.price * i.qty)}\n`;
    });
    text += `-------------------\n`;
    text += `Subtotal: ${formatPrice(d.subtotal)}\n`;
    text += `Diskon: ${formatPrice(d.disc)}\n`;
    text += `Ongkir: (Konfirmasi Admin)\n`;
    text += `*TOTAL: ${formatPrice(d.total)}*\n\n`;
    text += `Metode: ${d.payment === 'cod_full' ? 'COD Full' : d.payment === 'cod_ongkir' ? 'COD Ongkir' : 'Transfer'}\n`;
    if (d.notes) text += `\nCatatan: ${d.notes}`;
    return text;
}

function sendInvoiceWA() {
    const text = generateWAText();
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
}