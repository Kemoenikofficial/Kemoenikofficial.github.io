let currentSlide = 0;
let activeCategory = 'all';
let slideInterval = null;
let testimoniInterval = null;
let testimoniIndex = 0;
let currentGallerySlide = 0;
let totalGallerySlides = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadWishlist();
    
    renderCategories();
    renderProducts();
    renderSliders();
    renderTestimoniSlider();
    renderPromoProducts();
    
    document.getElementById('wa-btn-header').href = `https://wa.me/${CONFIG.whatsappNumber}`;
    document.getElementById('store-name').innerText = CONFIG.storeName;
});

function renderCategories() {
    const container = document.getElementById('category-list');
    container.innerHTML = CONFIG.categories.map(c => `
       <div onclick="filterCategory('${c.id}')" 
            class="category-text ${c.id === activeCategory ? 'active' : ''}">
           ${c.name}
       </div>
    `).join('');
}

function filterCategory(id) {
    activeCategory = id;
    renderCategories();
    renderProducts();
    document.getElementById('product-section').scrollIntoView({ behavior: 'smooth' });
}

function renderProducts() {
    const container = document.getElementById('product-grid');
    
    let data = CONFIG.products.filter(p => p.active === true);
    
    if (activeCategory !== 'all') {
        data = data.filter(p => p.category === activeCategory);
    }
    
    container.innerHTML = data.map(p => {
        const imgSrc = p.images?.[0] || 'images/placeholder.jpg';
        const isWished = wishlist.some(w => w.id === p.id);
        const finalPrice = p.price - Math.floor(p.price * (p.discount || 0) / 100);
        
        return `
        <div class="product-card" onclick="openDetail(${p.id})">
            <div class="product-img-wrapper">
                <img src="${imgSrc}" class="product-img" alt="${p.name}" loading="lazy">
                
                ${p.flashSale ? '<span class="flash-sale-badge">Flash Sale</span>' : ''}
                ${p.discount > 0 ? `<span class="discount-badge">${p.discount}% OFF</span>` : ''}
                
                <button onclick="event.stopPropagation(); toggleWishlist(${p.id})" class="wishlist-btn-card ${isWished ? 'active' : ''}" aria-label="Toggle Wishlist">
                    <svg fill="${isWished ? '#ef4444' : 'none'}" stroke="${isWished ? '#ef4444' : '#9ca3af'}" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                
                <div class="product-meta">
                    <span class="rating-stars">
                        ${generateStars(p.rating)}
                        <span class="ml-1 text-gray-600">${p.rating}</span>
                    </span>
                    <span class="sold-count">| ${formatSold(p.sold)} terjual</span>
                </div>
                
                <div class="product-price">${formatPrice(finalPrice)}</div>
                ${p.originalPrice ? `<div class="product-price-original">${formatPrice(p.originalPrice)}</div>` : '<div style="height: 16px;"></div>'}
                
                <button onclick="event.stopPropagation(); addCart(${p.id})" class="product-btn">+ Keranjang</button>
            </div>
        </div>`;
    }).join('');
}

function renderPromoProducts() {
    const container = document.getElementById('promo-container');
    if (!container) return;

    const promoProducts = CONFIG.products
        .filter(p => p.active === true && p.flashSale === true)
        .slice(0, 6);

    if (promoProducts.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-4 col-span-2">Tidak ada promo saat ini</p>';
        return;
    }

    container.innerHTML = promoProducts.map(p => {
        const finalPrice = p.price - Math.floor(p.price * (p.discount || 0) / 100);
        
        return `
        <div class="promo-card" onclick="openDetail(${p.id})">
            <img src="${p.images?.[0] || 'images/placeholder.jpg'}" alt="${p.name}">
            <div class="promo-content">
                <div class="promo-title">${p.name}</div>
                <div>
                    <span class="promo-price">${formatPrice(finalPrice)}</span>
                    ${p.originalPrice ? `<span class="promo-old-price">${formatPrice(p.originalPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `}).join('');
}

function openDetail(id) {
    let p = CONFIG.products.find(x => x.id == id);
    if(!p) return;
    
    const finalPrice = p.price - Math.floor(p.price * (p.discount || 0) / 100);
    const hasMultipleImages = p.images && p.images.length > 1;
    
    const galleryHtml = hasMultipleImages ? `
        <div id="product-gallery">
            <div id="gallery-slider">
                ${p.images.map((img, idx) => `
                    <img src="${img}" alt="${p.name} - ${idx + 1}">
                `).join('')}
            </div>
            
            <div style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 10;">
                ${p.images.map((_, idx) => `
                    <button onclick="goToGallerySlide(${idx})" 
                        class="gallery-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></button>
                `).join('')}
            </div>
            
            <button onclick="prevGallerySlide()" class="gallery-nav gallery-prev">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onclick="nextGallerySlide()" class="gallery-nav gallery-next">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
        </div>
    ` : `
        <div class="relative">
            <img src="${p.images?.[0] || 'images/placeholder.jpg'}" class="w-full aspect-square object-cover" alt="${p.name}">
        </div>
    `;
    
    const content = `
    <div class="relative bg-gray-100">
        ${galleryHtml}
        
        <button onclick="closeDetail()" class="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition z-20">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        ${p.flashSale ? '<span class="flash-sale-badge">Flash Sale</span>' : ''}
    </div>
    <div class="p-5 bg-white rounded-t-3xl -mt-6 relative">
        <h2 class="text-lg font-bold text-gray-800 mb-2">${p.name}</h2>
        
        <div class="flex items-center gap-3 mb-3">
            <span class="rating-stars text-sm">
                ${generateStars(p.rating || 5)}
                <span class="ml-1 text-gray-700 font-semibold">${p.rating || 5}</span>
            </span>
            <span class="text-gray-400">|</span>
            <span class="text-sm text-gray-500">${formatSold(p.sold || 100)} terjual</span>
        </div>
        
        <div class="flex items-baseline gap-2 mb-4">
            <span class="text-2xl font-bold" style="color: var(--primary-dark);">${formatPrice(finalPrice || p.price)}</span>
            ${p.originalPrice ? `<span class="text-sm text-gray-400 line-through">${formatPrice(p.originalPrice)}</span>` : ''}
            ${p.discount > 0 ? `<span class="text-xs font-bold px-2 py-1 rounded-full" style="background: #FEF3C7; color: #B45309;">${p.discount}% OFF</span>` : ''}
        </div>
        
        <div class="border-t border-b border-gray-100 my-4 py-4">
            <h4 class="font-semibold mb-2 text-sm text-gray-700">Deskripsi Produk</h4>
            <p class="text-sm text-gray-600 leading-relaxed">${p.desc || 'Produk berkualitas dari Kemoenik Official Store.'}</p>
        </div>
        
        <div class="flex gap-3 mt-4">
            <button onclick="addCart(${p.id}); closeDetail();" class="flex-1 bg-white border-2 font-semibold py-3 rounded-xl transition-colors" style="border-color: var(--primary); color: var(--primary-dark);">Tambah</button>
            <button onclick="addCart(${p.id}); closeDetail(); openCart();" class="flex-1 btn-primary py-3">Beli Sekarang</button>
        </div>
    </div>`;
    
    document.getElementById('detail-content').innerHTML = content;
    openModal('detail-modal');
    
    if (hasMultipleImages) {
        initGallery(p.images.length);
    }
}

function closeDetail() {
    closeModal('detail-modal');
}

function initGallery(total) {
    currentGallerySlide = 0;
    totalGallerySlides = total;
}

function updateGallerySlider() {
    const slider = document.getElementById('gallery-slider');
    if (slider) {
        slider.style.transform = `translateX(-${currentGallerySlide * 100}%)`;
        
        document.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentGallerySlide);
        });
    }
}

function nextGallerySlide() {
    if (currentGallerySlide < totalGallerySlides - 1) {
        currentGallerySlide++;
        updateGallerySlider();
    }
}

function prevGallerySlide() {
    if (currentGallerySlide > 0) {
        currentGallerySlide--;
        updateGallerySlider();
    }
}

function goToGallerySlide(index) {
    currentGallerySlide = index;
    updateGallerySlider();
}

function renderSliders() {
    const sliderContainer = document.getElementById('hero-slider');
    const dotsContainer = document.getElementById('slider-dots');
    
    sliderContainer.innerHTML = CONFIG.sliders.map((img, i) => `
        <div class="slide-item">
            <img src="${img}" alt="Banner ${i + 1}" loading="lazy">
        </div>
    `).join('');
    
    dotsContainer.innerHTML = CONFIG.sliders.map((_, i) => `
        <button onclick="goToSlide(${i})" class="dot ${i === 0 ? 'active' : ''}"></button>
    `).join('');
    
    startSlider();
}

function startSlider() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % CONFIG.sliders.length;
        updateSlider();
    }, 4000);
}

function updateSlider() {
    const slider = document.getElementById('hero-slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    document.querySelectorAll('#slider-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    startSlider();
}

function renderTestimoniSlider() {
    const container = document.getElementById('category-slider');
    const dotsContainer = document.getElementById('category-slider-dots');

    container.innerHTML = CONFIG.testimoniSliders.map((img, i) => `
        <div class="slide-item">
            <img src="${img}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover; border-radius: 16px;">
        </div>
    `).join('');

    dotsContainer.innerHTML = CONFIG.testimoniSliders.map((_, i) => `
        <div class="dot ${i === 0 ? 'active' : ''}" onclick="goToTestimoniSlide(${i})"></div>
    `).join('');

    startTestimoniSlider();
}

function startTestimoniSlider() {
    if (testimoniInterval) clearInterval(testimoniInterval);
    testimoniInterval = setInterval(() => {
        testimoniIndex = (testimoniIndex + 1) % CONFIG.testimoniSliders.length;
        updateTestimoniSlider();
    }, 4000);
}

function updateTestimoniSlider() {
    const slider = document.getElementById('category-slider');
    slider.style.transform = `translateX(-${testimoniIndex * 100}%)`;

    document.querySelectorAll('#category-slider-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === testimoniIndex);
    });
}

function goToTestimoniSlide(index) {
    testimoniIndex = index;
    updateTestimoniSlider();
}

function toggleSearch() {
    document.getElementById('search-bar').classList.toggle('hidden');
    if (!document.getElementById('search-bar').classList.contains('hidden')) {
        document.getElementById('search-input').focus();
    }
}

function searchProducts() {
    const term = document.getElementById('search-input').value.toLowerCase().trim();
    
    const filtered = CONFIG.products.filter(p => 
        p.active === true && 
        (p.name.toLowerCase().includes(term) || 
        (p.desc && p.desc.toLowerCase().includes(term)))
    );
    
    activeCategory = 'all';
    renderCategories();
    
    const container = document.getElementById('product-grid');
    if (filtered.length === 0) {
        container.innerHTML = '<p class="col-span-2 text-center text-gray-400 py-12">Produk tidak ditemukan</p>';
    } else {
        container.innerHTML = filtered.map(p => {
            const imgSrc = p.images?.[0] || 'images/placeholder.jpg';
            const isWished = wishlist.some(w => w.id === p.id);
            const finalPrice = p.price - Math.floor(p.price * (p.discount || 0) / 100);
            
            return `
            <div class="product-card" onclick="openDetail(${p.id})">
                <div class="product-img-wrapper">
                    <img src="${imgSrc}" class="product-img" alt="${p.name}" loading="lazy">
                    ${p.flashSale ? '<span class="flash-sale-badge">Flash Sale</span>' : ''}
                    ${p.discount > 0 ? `<span class="discount-badge">${p.discount}% OFF</span>` : ''}
                    <button onclick="event.stopPropagation(); toggleWishlist(${p.id})" class="wishlist-btn-card ${isWished ? 'active' : ''}">
                        <svg fill="${isWished ? '#ef4444' : 'none'}" stroke="${isWished ? '#ef4444' : '#9ca3af'}" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-meta">
                        <span class="rating-stars">
                            ${generateStars(p.rating)}
                            <span class="ml-1 text-gray-600">${p.rating}</span>
                        </span>
                        <span class="sold-count">| ${formatSold(p.sold)} terjual</span>
                    </div>
                    <div class="product-price">${formatPrice(finalPrice)}</div>
                    ${p.originalPrice ? `<div class="product-price-original">${formatPrice(p.originalPrice)}</div>` : '<div style="height: 16px;"></div>'}
                    <button onclick="event.stopPropagation(); addCart(${p.id})" class="product-btn">+ Keranjang</button>
                </div>
            </div>`;
        }).join('');
    }
}

function openTracking() {
    document.getElementById('tracking-content').innerHTML = `
        <button onclick="closeTracking()" class="absolute top-4 right-4 text-gray-400 p-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="font-bold text-lg mb-4">Lacak Resi J&T</h3>
        <div class="flex gap-2 mb-6">
            <input type="text" id="tracking-input" class="input-style mb-0 text-sm flex-1" placeholder="Masukkan No. Resi">
            <button onclick="simulateTracking()" class="text-white px-4 rounded-xl text-xs font-bold" style="background: #1F2937;">Lacak</button>
        </div>
        <div id="tracking-result"></div>`;
    openModal('tracking-modal');
}

function closeTracking() {
    closeModal('tracking-modal');
}

function simulateTracking() {
    const resi = document.getElementById('tracking-input').value.trim();
    if (!resi) {
        alert("Masukkan nomor resi!");
        return;
    }
    
    const steps = ["Paket Diproses di Gudang", "Menuju Transit Hub", "Dalam Perjalanan", "Dibawa Kurir", "Terkirim"];
    const current = Math.floor(Math.random() * 5);
    
    let html = `<h4 class="font-bold mb-4 text-sm">Resi: ${resi}</h4>`;
    steps.forEach((s, i) => {
        const isActive = i <= current;
        html += `
            <div class="relative pl-6 pb-4">
                <div class="absolute left-0 top-1 w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}"></div>
                ${i < steps.length - 1 ? `<div class="absolute left-[5px] top-4 w-0.5 h-full ${i < current ? 'bg-emerald-500' : 'bg-gray-200'}"></div>` : ''}
                <p class="font-medium text-sm ${isActive ? 'text-gray-800' : 'text-gray-400'}">${s}</p>
            </div>`;
    });
    
    document.getElementById('tracking-result').innerHTML = html;
}