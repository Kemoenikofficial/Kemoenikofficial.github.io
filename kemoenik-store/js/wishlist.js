let wishlist = [];

function loadWishlist() {
    try { wishlist = JSON.parse(localStorage.getItem('wish')) || []; } catch (e) { wishlist = []; }
    updateWishlistUI();
}

function saveWishlist() {
    localStorage.setItem('wish', JSON.stringify(wishlist));
}

function toggleWishlist(id) {
    const p = CONFIG.products.find(x => x.id === id);
    if (!p) return;
    
    const exist = wishlist.find(w => w.id === id);
    if (exist) {
        wishlist = wishlist.filter(w => w.id !== id);
    } else {
        wishlist.push({ id: p.id, name: p.name, images: p.images });
    }
    
    saveWishlist();
    updateWishlistUI();
    renderProducts();
}

function updateWishlistUI() {
    const el = document.getElementById('wish-count-head');
    const count = wishlist.length;
    
    if (count > 0) {
        el.innerText = count;
        el.classList.remove('hidden');
        el.classList.add('flex');
    } else {
        el.classList.add('hidden');
    }
}

function openWishlist() {
    let content = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Wishlist Saya</h3>
            <button onclick="closeWishlist()" class="text-gray-400 p-2 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>`;
    
    if (wishlist.length === 0) {
        content += '<p class="text-center text-gray-400 py-12">Wishlist masih kosong</p>';
    } else {
        content += `<div class="space-y-3">` + wishlist.map(w => `
            <div class="flex gap-3 items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer" onclick="closeWishlist(); openDetail(${w.id});">
                <img src="${w.images?.[0] || 'images/placeholder.jpg'}" class="w-16 h-16 rounded-xl object-cover">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm text-gray-800">${w.name}</h4>
                    <p class="text-[10px] text-emerald-500 mt-1 font-medium">Klik untuk lihat detail</p>
                </div>
                <button onclick="event.stopPropagation(); toggleWishlist(${w.id}); openWishlist();" class="text-gray-400 hover:text-red-500 p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        `).join('') + `</div>`;
    }
    
    document.getElementById('wishlist-content').innerHTML = content;
    openModal('wishlist-modal');
}

function closeWishlist() {
    closeModal('wishlist-modal');
}