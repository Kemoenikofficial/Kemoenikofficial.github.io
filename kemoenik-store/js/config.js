const CONFIG = {
    storeName: "Kemoenik Official Store",
    storeAddress: "Kp Cibubuay, Desa Cibodas, Kec. Pasirjambu, Kab. Bandung, 40972",
    whatsappNumber: "6281546450547",
    
    bankAccounts: [
        { bank: "BRI", number: "000501168248506", name: "DANI RAMDANI", logoClass: "logo-bri", cardClass: "bank-card-bri" },
        { bank: "DANA", number: "081546450547", name: "DANI RAMDANI", logoClass: "logo-dana", cardClass: "bank-card-dana" },
        { bank: "SeaBank", number: "901851870313", name: "DANI RAMDANI", logoClass: "logo-seabank", cardClass: "bank-card-seabank" }
    ],
    
    coupons: [ 
        { code: "KEMOENIK26", type: "shipping", value: 15000, minPurchase: 120000 } 
    ],
    
    categories: [ 
        { id: 'all', name: "Semua" }, 
        { id: 'calc', name: "Calculator" }, 
        { id: 'kapsul', name: "Kapsul" }, 
        { id: 'teh', name: "Teh" },
        { id: 'lainnya', name: "Lainnya" }
    ],

    sliders: [
        "/kemoenik-store/images/banners/banner-1.png",
        "/kemoenik-store/images/banners/banner-2.png",
        "/kemoenik-store/images/banners/banner-3.png",
        "/kemoenik-store/images/banners/banner-4.png",
        "/kemoenik-store/images/banners/banner-5.png"
    ],

    testimoniSliders: [
        "/kemoenik-store/images/testimonials/1.png",
        "/kemoenik-store/images/testimonials/2.png",
        "/kemoenik-store/images/testimonials/3.png",
        "/kemoenik-store/images/testimonials/4.png",
        "/kemoenik-store/images/testimonials/5.png",
        "/kemoenik-store/images/testimonials/6.png",
        "/kemoenik-store/images/testimonials/7.png",
        "/kemoenik-store/images/testimonials/8.png",
        "/kemoenik-store/images/testimonials/9.png",
        "/kemoenik-store/images/testimonials/10.png",
        "/kemoenik-store/images/testimonials/11.png",
        "/kemoenik-store/images/testimonials/12.png",
        "/kemoenik-store/images/testimonials/13.png",
        "/kemoenik-store/images/testimonials/14.png",
        "/kemoenik-store/images/testimonials/15.png",
        "/kemoenik-store/images/testimonials/16.png",
        "/kemoenik-store/images/testimonials/17.png",
        "/kemoenik-store/images/testimonials/18.png",
        "/kemoenik-store/images/testimonials/19.png",
        "/kemoenik-store/images/testimonials/20.png"
    ],

    products: [
        { 
            id: 1, 
            category: 'calc', 
            name: "(Gratis Ongkir) CALCULATOR FAT LOSS (Bentuk Website) - Hitung Kalori Harian", 
            price: 40000,
            active: true,
            originalPrice: 40000,
            discount: 50, 
            flashSale: true,
            images: [
                "/kemoenik-store/images/products/calc-1.png",
                "/kemoenik-store/images/products/calc-2.png",
                "/kemoenik-store/images/products/calc-3.png",
                "/kemoenik-store/images/products/calc-4.png",
                "/kemoenik-store/images/products/calc-5.png"
            ], 
            sold: 2547, 
            rating: 4.9, 
            desc: `🔥 CALFATLOSS – Laporan Diet & Kalori Personal (PDF)...`
        },
        { 
            id: 2, 
            category: 'kapsul', 
            name: "KEMOENIK SLIM 1", 
            price: 100000,
            active: true,
            originalPrice: 150000,
            discount: 33, 
            flashSale: true,
            images: [
                "/kemoenik-store/images/products/slim1-1.jpg",
                "/kemoenik-store/images/products/slim1-2.jpg",
                "/kemoenik-store/images/products/slim1-3.jpg",
                "/kemoenik-store/images/products/slim1-4.jpg",
                "/kemoenik-store/images/products/slim1-5.jpg"
            ], 
            sold: 1892, 
            rating: 4.8, 
            desc: `KEMOENIK SLIM 1 - Kapsul Herbal...`,
        },
        { 
            id: 3, 
            category: 'kapsul', 
            name: "KEMOENIK SLIM 2", 
            price: 100000,
            active: true,
            originalPrice: 150000,
            discount: 33, 
            flashSale: true,
            images: [
                "/kemoenik-store/images/products/slim2-1.jpg",
                "/kemoenik-store/images/products/slim2-2.jpg",
                "/kemoenik-store/images/products/slim2-3.jpg",
                "/kemoenik-store/images/products/slim2-4.jpg",
                "/kemoenik-store/images/products/slim2-5.jpg"
            ], 
            sold: 1543, 
            rating: 4.7, 
            desc: `KEMOENIK SLIM 2 - Formula lanjutan...`,
        },
        { 
            id: 4, 
            category: 'teh', 
            name: "TEH KEMOENIK DETOX 1", 
            price: 75000,
            active: true,
            originalPrice: 100000,
            discount: 25, 
            flashSale: true,
            images: [
                "/kemoenik-store/images/products/teh1-1.jpg",
                "/kemoenik-store/images/products/teh1-2.jpg",
                "/kemoenik-store/images/products/teh1-3.jpg",
                "/kemoenik-store/images/products/teh1-4.jpg",
                "/kemoenik-store/images/products/teh1-5.jpg"
            ], 
            sold: 2156, 
            rating: 4.8, 
            desc: `TEH KEMOENIK DETOX - Minuman sehat...`,
        },
        { 
            id: 5, 
            category: 'teh', 
            name: "TEH KEMOENIK DETOX 2", 
            price: 75000,
            active: true,
            originalPrice: 100000,
            discount: 25, 
            flashSale: true,
            images: [
                "/kemoenik-store/images/products/teh2-1.jpg",
                "/kemoenik-store/images/products/teh2-2.jpg",
                "/kemoenik-store/images/products/teh2-3.jpg",
                "/kemoenik-store/images/products/teh2-4.jpg",
                "/kemoenik-store/images/products/teh2-5.jpg"
            ], 
            sold: 1876, 
            rating: 4.8, 
            desc: `TEH KEMOENIK DETOX - Varian kedua...`,
        },
        { 
            id: 6, 
            category: 'lainnya', 
            name: "BUKU PANDUAN DIET SEHAT", 
            price: 55000,
            active: true,
            originalPrice: 75000,
            discount: 27, 
            flashSale: false,
            images: [
                "/kemoenik-store/images/products/buku-1.jpg",
                "/kemoenik-store/images/products/buku-2.jpg",
                "/kemoenik-store/images/products/buku-3.jpg",
                "/kemoenik-store/images/products/buku-4.jpg",
                "/kemoenik-store/images/products/buku-5.jpg"
            ], 
            sold: 987, 
            rating: 4.9, 
            desc: `Buku panduan diet sehat...`,
        }
    ]
};
