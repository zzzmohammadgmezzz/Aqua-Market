// AquaMarket - Product Page JavaScript (Enhanced)
document.addEventListener('DOMContentLoaded', function() {
    // Global Variables
    let products = [];
    let filteredProducts = [];
    let currentPage = 1;
    const productsPerPage = 12;
    let currentView = 'grid';
    let activeFilters = {
        category: [],
        brand: [],
        discount: [],
        availability: ['in-stock'],
        price: { min: 0, max: 100000000 }
    };
    let cartItems = JSON.parse(localStorage.getItem('aquamarket_cart')) || [];
    
    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const productsLoading = document.getElementById('products-loading');
    const filterToggle = document.getElementById('filter-toggle');
    const productsSidebar = document.getElementById('products-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sortSelect = document.getElementById('sort-by');
    const viewButtons = document.querySelectorAll('.view-btn');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const resetFiltersBtn = document.querySelector('.reset-filters');
    const pagination = document.querySelector('.pagination');
    const quickViewModal = document.getElementById('quick-view-modal');
    const quickViewOverlay = document.getElementById('quick-view-overlay');
    const activeFiltersContainer = document.getElementById('active-filters');
    const filterCountElement = document.querySelector('.filter-count');
    const resultsCountElement = document.querySelector('.results-count');
    const cartCountElement = document.querySelector('.cart-count');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    
    // Initialize the product page
    initProductPage();
    
    function initProductPage() {
        // Load products data
        loadProductsData();
        
        // Initialize event listeners
        setupProductEventListeners();
        
        // Initialize filters
        initFilters();
        
        // Initialize cart
        updateCartUI();
        
        // Check URL parameters for filters
        checkUrlParameters();
    }
    
    function loadProductsData() {
        // Show loading state
        showLoadingState();
        
        // In a real application, this would be an API call
        setTimeout(() => {
            products = generateProductsData();
            filteredProducts = [...products];
            
            // Render products
            renderProducts();
            
            // Update pagination
            updatePagination();
            
            // Update results count
            updateResultsCount();
        }, 1500);
    }
    
    function generateProductsData() {
        const products = [
            {
                id: 1,
                name: "کارت گرافیک GeForce RTX 4080 Gaming OC",
                category: "gpu",
                brand: "nvidia",
                price: 38250000,
                oldPrice: 45000000,
                discount: 15,
                image: "/assets/img/rtx 4080.webp",
                inStock: true,
                description: "کارت گرافیک قدرتمند GeForce RTX 4080 با معماری Ada Lovelace، 16GB حافظه GDDR6X، فرکانس بالا و سیستم خنک‌کننده پیشرفته برای گیمینگ 4K و رندرینگ حرفه‌ای",
                specs: {
                    'مدل': "RTX 4080 Gaming OC",
                    'برند': "GIGABYTE",
                    'حافظه': "16GB GDDR6X",
                    'فرکانس': "2550 MHz",
                    'خروجی': "3x DisplayPort, 1x HDMI",
                    'گارانتی': "۳۶ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["پرفروش", "جدید"]
            },
            {
                id: 2,
                name: "پردازنده Intel Core i9-14900K",
                category: "cpu",
                brand: "intel",
                price: 24500000,
                oldPrice: null,
                discount: 0,
                image: "/assets/img/cpu i9.jpg",
                inStock: true,
                description: "پردازنده قدرتمند Core i9 نسل 14 با 24 هسته (8 P-Core + 16 E-Core) و فرکانس Turbo تا 6.0 GHz، مناسب برای گیمینگ و کارهای سنگین رندرینگ",
                specs: {
                    'مدل': "Core i9-14900K",
                    'برند': "Intel",
                    'هسته‌ها': "24 هسته (8P+16E)",
                    'فرکانس': "تا 6.0 GHz",
                    'کش': "36MB L3",
                    'سوکت': "LGA 1700",
                    'گارانتی': "۳۶ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["جدید", "پرفروش"]
            },
            {
                id: 3,
                name: "کیت رم 32GB DDR5 6000MHz Corsair",
                category: "ram",
                brand: "corsair",
                price: 7650000,
                oldPrice: 8500000,
                discount: 10,
                image: "/assets/img/1715359911662_879.webp",
                inStock: true,
                description: "کیت رم 32GB DDR5 با فرکانس 6000MHz و تایمینگ CL30، مجهز به هیت‌سینک آلومینیومی و RGB قابل تنظیم، مناسب برای سیستم‌های گیمینگ حرفه‌ای",
                specs: {
                    'مدل': "Vengeance RGB",
                    'برند': "Corsair",
                    'ظرفیت': "32GB (2x16GB)",
                    'فرکانس': "6000MHz",
                    'تایمینگ': "CL30",
                    'ولتاژ': "1.35V",
                    'گارانتی': "۳۶ ماهه",
                    'موجودی': "موجود در انبار"
                },
                tags: ["تخفیف‌دار"]
            },
            {
                id: 4,
                name: "مادربرد GIGABYTE Z790 AORUS Elite",
                category: "motherboard",
                brand: "gigabyte",
                price: 18700000,
                oldPrice: null,
                discount: 0,
                image: "/assets/img/1715348676245_422.webp",
                inStock: true,
                description: "مادربرد Z790 با طراحی قدرتمند، پشتیبانی از DDR5، اسلات PCIe 5.0، سیستم خنک‌کننده پیشرفته و پورت‌های متعدد برای اسمبل سیستم گیمینگ حرفه‌ای",
                specs: {
                    'مدل': "Z790 AORUS Elite",
                    'برند': "GIGABYTE",
                    'سوکت': "LGA 1700",
                    'چیپست': "Z790",
                    'رم': "4x DDR5",
                    'اسلات توسعه': "PCIe 5.0 x16",
                    'گارانتی': "۳۶ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["جدید"]
            },
            {
                id: 5,
                name: "کارت گرافیک Radeon RX 7900 XT",
                category: "gpu",
                brand: "amd",
                price: 31500000,
                oldPrice: 35000000,
                discount: 10,
                image: "/assets/img/2c7a7f6c8910e7e9b75fb53296c07bd82cc81e16_1679224656.jpg",
                inStock: true,
                description: "کارت گرافیک AMD Radeon RX 7900 XT با معماری RDNA 3، 20GB حافظه GDDR6، رهیاب Ray و عملکرد استثنایی در گیمینگ 4K و رندرینگ",
                specs: {
                    'مدل': "RX 7900 XT",
                    'برند': "ASUS",
                    'حافظه': "20GB GDDR6",
                    'فرکانس': "2450 MHz",
                    'خروجی': "2x DisplayPort 2.1, 2x HDMI 2.1",
                    'گارانتی': "۳۶ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["تخفیف‌دار"]
            },
            {
                id: 6,
                name: "مانیتور گیمینگ 27 اینچ 240Hz Cooler Master",
                category: "monitors",
                brand: "cooler-master",
                price: 13875000,
                oldPrice: 18500000,
                discount: 25,
                image: "/assets/img/Cooler-Master-GM27-CFX-1.jpg.webp",
                inStock: true,
                description: "مانیتور گیمینگ 27 اینچی با نرخ تازه‌سازی 240Hz، زمان پاسخگویی 1ms، پشتیبانی از FreeSync و G-Sync، و رزولوشن QHD برای تجربه گیمینگ نرم و بی‌نقص",
                specs: {
                    'مدل': "GM27-CFX",
                    'برند': "Cooler Master",
                    'سایز': "27 اینچ",
                    'رزولوشن': "2560x1440 (QHD)",
                    'نرخ تازه‌سازی': "240Hz",
                    'زمان پاسخ': "1ms",
                    'گارانتی': "۲۴ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["تخفیف‌دار", "پرفروش"]
            },
            {
                id: 7,
                name: "هارد SSD NVMe 2TB M.2 Acer",
                category: "storage",
                brand: "acer",
                price: 5780000,
                oldPrice: 6800000,
                discount: 15,
                image: "/assets/img/10305010-ACER-2TB-FA100-1-500x500.jpg",
                inStock: true,
                description: "هارد SSD NVMe M.2 با ظرفیت 2TB، سرعت خواندن تا 3300MB/s و نوشتن تا 2700MB/s، مناسب برای افزایش سرعت بوت و لودینگ بازی‌ها",
                specs: {
                    'مدل': "FA100 2TB",
                    'برند': "Acer",
                    'ظرفیت': "2TB",
                    'سرعت خواندن': "3300MB/s",
                    'سرعت نوشتن': "2700MB/s",
                    'اینترفیس': "NVMe PCIe Gen3",
                    'گارانتی': "۶۰ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["تخفیف‌دار"]
            },
            {
                id: 8,
                name: "پاور 1000W 80 Plus Gold Corsair",
                category: "psu",
                brand: "corsair",
                price: 7600000,
                oldPrice: 9500000,
                discount: 20,
                image: "/assets/img/71JZq95ucdL._AC_UF894,1000_QL80_.jpg",
                inStock: true,
                description: "پاور 1000W با گواهینامه 80 Plus Gold، بازدهی بالا، کابل‌های ماژولار، خنک‌کننده سایلنت و حفاظت‌های کامل برای سیستم‌های گیمینگ پر مصرف",
                specs: {
                    'مدل': "RM1000x",
                    'برند': "Corsair",
                    'توان': "1000W",
                    'گواهینامه': "80 Plus Gold",
                    'کابل‌ها': "ماژولار",
                    'خنک‌کننده': "135mm فن",
                    'گارانتی': "۱۰ ساله",
                    'موجودی': "موجود در انبار"
                },
                //// tags: ["تخفیف‌دار"]
            },
            {
                id: 9,
                name: "کیبورد مکانیکی گیمینگ RGB Redragon",
                category: "accessories",
                brand: "redragon",
                price: 4200000,
                oldPrice: null,
                discount: 0,
                image: "/assets/img/K599 Deimos RGB 3.webp",
                inStock: true,
                description: "کیبورد مکانیکی گیمینگ وایرلس با سوئیچ‌های Blue، نورپردازی RGB کامل، طراحی ارگونومیک و قابلیت اتصال از طریق بلوتوث یا USB برای گیمینگ حرفه‌ای",
                specs: {
                    'مدل': "K599 Deimos",
                    'برند': "Redragon",
                    'سوئیچ': "Blue Mechanical",
                    'اتصال': "بلوتوث + USB",
                    'نورپردازی': "RGB",
                    'قابلیت‌ها': "Anti-ghosting",
                    'گارانتی': "۲۴ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["جدید"]
            },
            {
                id: 10,
                name: "ماوس گیمینگ وایرلس Logitech",
                category: "accessories",
                brand: "logitech",
                price: 2800000,
                oldPrice: null,
                discount: 0,
                image: "/assets/img/wireless-imice-gw-x7.jpg",
                inStock: true,
                description: "ماوس گیمینگ وایرلس با سنسور Hero 25K، 11 دکمه قابل برنامه‌ریزی، نورپردازی RGB و باتری با عمر طولانی برای دقت و سرعت بالا در بازی‌ها",
                specs: {
                    'مدل': "G Pro X Superlight",
                    'برند': "Logitech",
                    'سنسور': "Hero 25K",
                    'DPI': "25600",
                    'دکمه‌ها': "11 عدد",
                    'اتصال': "2.4GHz Wireless",
                    'گارانتی': "۲۴ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["پرفروش"]
            },
            {
                id: 11,
                name: "هدست گیمینگ 7.1 Surround SteelSeries",
                category: "audio",
                brand: "steelseries",
                price: 3500000,
                oldPrice: null,
                discount: 0,
                image: "/assets/img/0777883_v1657108264_N53334869A_1.jpg.jpeg",
                inStock: true,
                description: "هدست گیمینگ با صدای ساراند 7.1 مجازی، میکروفون با کیفیت بالا، طراحی راحت برای استفاده طولانی مدت و نورپردازی RGB برای تجربه صوتی بی‌نقص",
                specs: {
                    'مدل': "Arctis Nova 7",
                    'برند': "SteelSeries",
                    'صدا': "7.1 Surround",
                    'میکروفون': "ClearCast Gen 2",
                    'اتصال': "Wireless + 3.5mm",
                    'باتری': "38 ساعت",
                    'گارانتی': "۲۴ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["جدید"]
            },
            {
                id: 12,
                name: "صندلی گیمینگ ارگونومیک ThunderX3",
                category: "accessories",
                brand: "thunderx3",
                price: 12000000,
                oldPrice: null,
                discount: 0,
                image: "/assets/img/738603470020.jpg.956.png",
                inStock: true,
                description: "صندلی گیمینگ ارگونومیک با قابلیت تنظیم ارتفاع، پشتیبانی از کمر، دسته‌های 4D، جنس چرم مصنوعی با کیفیت و طراحی مناسب برای sessions طولانی گیمینگ",
                specs: {
                    'مدل': "TC5 Max",
                    'برند': "ThunderX3",
                    'قابلیت‌ها': "4D Armrests",
                    'جنس': "PVC Leather",
                    'حداکثر وزن': "150kg",
                    'رنگ‌بندی': "مشکی + آبی",
                    'گارانتی': "۲۴ ماهه",
                    'موجودی': "موجود در انبار"
                },
                // tags: ["پرفروش"]
            }
        ];
        
        // Generate more products to reach 50
        for (let i = 13; i <= 50; i++) {
            const categories = ['gpu', 'cpu', 'ram', 'motherboard', 'storage', 'psu', 'case', 'cooling', 'monitors', 'accessories', 'audio'];
            const brands = ['nvidia', 'amd', 'intel', 'asus', 'msi', 'gigabyte', 'corsair', 'kingston', 'cooler-master', 'logitech', 'steelseries'];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const hasDiscount = Math.random() > 0.5;
            const discount = hasDiscount ? Math.floor(Math.random() * 40) + 10 : 0;
            const oldPrice = hasDiscount ? Math.floor(Math.random() * 50000000) + 5000000 : 0;
            const price = hasDiscount ? oldPrice - (oldPrice * discount / 100) : Math.floor(Math.random() * 50000000) + 5000000;
            const inStock = Math.random() > 0.1;
            
            products.push({
                id: i,
                name: `محصول نمونه ${i}`,
                category: category,
                brand: brand,
                price: price,
                oldPrice: hasDiscount ? oldPrice : null,
                discount: discount,
                image: `/assets/img/prod${(i % 10) + 1}.jpg`,
                inStock: inStock,
                description: 'این یک توضیح نمونه برای محصول است که ویژگی‌ها و مشخصات آن را توصیف می‌کند.',
                specs: {
                    'مدل': `MODEL-${i}`,
                    'برند': brand.toUpperCase(),
                    'گارانتی': '۳۶ ماهه',
                    'موجودی': inStock ? 'موجود در انبار' : 'ناموجود'
                },
                // tags: hasDiscount ? ['تخفیف‌دار'] : []
            });
        }
        
        return products;
    }
    
    function setupProductEventListeners() {
        // Filter toggle
        filterToggle.addEventListener('click', toggleSidebar);
        closeSidebar.addEventListener('click', toggleSidebar);
        
        // Sort select
        sortSelect.addEventListener('change', handleSortChange);
        
        // View toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', handleViewChange);
        });
        
        // Filter actions
        applyFiltersBtn.addEventListener('click', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        // Pagination
        pagination.addEventListener('click', handlePagination);
        
        // Quick view modal
        quickViewOverlay.addEventListener('click', closeQuickView);
        
        // Cart panel
        cartOverlay.addEventListener('click', closeCartPanel);
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (quickViewModal.classList.contains('active')) {
                    closeQuickView();
                }
                if (cartPanel.classList.contains('active')) {
                    closeCartPanel();
                }
                if (productsSidebar.classList.contains('active')) {
                    toggleSidebar();
                }
            }
        });
        
        // Theme toggle
        const themeToggleBtns = document.querySelectorAll('.theme-toggle');
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });
        
        // Mobile menu
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMobileMenu = document.querySelector('.close-mobile-menu');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Cart button
        const cartBtns = document.querySelectorAll('.cart-btn');
        cartBtns.forEach(btn => {
            btn.addEventListener('click', openCartPanel);
        });
        
        // Account button
        const accountBtns = document.querySelectorAll('.account-btn');
        accountBtns.forEach(btn => {
            btn.addEventListener('click', openAccountModal);
        });
    }
    
    function initFilters() {
        // Price range slider
        initPriceRangeSlider();
        
        // Filter checkboxes
        const filterCheckboxes = document.querySelectorAll('.filter-option input');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateActiveFilters);
        });
    }
    
    function initPriceRangeSlider() {
        const rangeMin = document.querySelector('.range-min');
        const rangeMax = document.querySelector('.range-max');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const minPriceDisplay = document.querySelector('.min-price-display');
        const maxPriceDisplay = document.querySelector('.max-price-display');
        const sliderTrack = document.querySelector('.slider-track');
        
        function updateSlider() {
            const minVal = parseInt(rangeMin.value);
            const maxVal = parseInt(rangeMax.value);
            
            if (maxVal < minVal + 1000000) {
                if (this === rangeMin) {
                    rangeMin.value = maxVal - 1000000;
                } else {
                    rangeMax.value = minVal + 1000000;
                }
            }
            
            const finalMinVal = parseInt(rangeMin.value);
            const finalMaxVal = parseInt(rangeMax.value);
            
            minPriceInput.value = finalMinVal.toLocaleString();
            maxPriceInput.value = finalMaxVal.toLocaleString();
            
            minPriceDisplay.textContent = finalMinVal.toLocaleString() + ' تومان';
            maxPriceDisplay.textContent = finalMaxVal.toLocaleString() + ' تومان';
            
            const minPercent = (finalMinVal / rangeMin.max) * 100;
            const maxPercent = (finalMaxVal / rangeMax.max) * 100;
            
            sliderTrack.style.left = `${minPercent}%`;
            sliderTrack.style.right = `${100 - maxPercent}%`;
            
            // Update active filters
            activeFilters.price.min = finalMinVal;
            activeFilters.price.max = finalMaxVal;
        }
        
        rangeMin.addEventListener('input', updateSlider);
        rangeMax.addEventListener('input', updateSlider);
        
        minPriceInput.addEventListener('change', function() {
            const value = parseInt(this.value.replace(/,/g, '')) || 0;
            rangeMin.value = Math.min(value, rangeMax.value - 1000000);
            updateSlider.call(rangeMin);
        });
        
        maxPriceInput.addEventListener('change', function() {
            const value = parseInt(this.value.replace(/,/g, '')) || 100000000;
            rangeMax.value = Math.max(value, rangeMin.value + 1000000);
            updateSlider.call(rangeMax);
        });
        
        // Initialize slider values
        updateSlider();
    }
    
    function updateActiveFilters() {
        const type = this.name;
        const value = this.value;
        const isChecked = this.checked;
        
        if (isChecked) {
            if (!activeFilters[type].includes(value)) {
                activeFilters[type].push(value);
            }
        } else {
            activeFilters[type] = activeFilters[type].filter(item => item !== value);
        }
        
        updateFilterCount();
    }
    
    function updateFilterCount() {
        let count = 0;
        
        // Count category filters
        count += activeFilters.category.length;
        
        // Count brand filters
        count += activeFilters.brand.length;
        
        // Count discount filters
        count += activeFilters.discount.length;
        
        // Count availability filters (excluding default in-stock)
        count += activeFilters.availability.filter(a => a !== 'in-stock').length;
        
        // Count price filter if not default
        if (activeFilters.price.min > 0 || activeFilters.price.max < 100000000) {
            count += 1;
        }
        
        // Update filter count badge
        filterCountElement.textContent = count;
        
        // Update filter toggle text
        const filterToggleText = filterToggle.querySelector('span:not(.filter-count)');
        if (count > 0) {
            filterToggleText.textContent = `فیلترها (${count})`;
        } else {
            filterToggleText.textContent = 'فیلترها';
        }
    }
    
    function applyFilters() {
        // Close sidebar on mobile
        if (window.innerWidth <= 992) {
            toggleSidebar();
        }
        
        // Filter products
        filterProducts();
        
        // Reset to first page
        currentPage = 1;
        
        // Render products
        renderProducts();
        
        // Update pagination
        updatePagination();
        
        // Update active filters display
        updateActiveFiltersDisplay();
        
        // Update results count
        updateResultsCount();
        
        // Show notification
        showNotification('فیلترها اعمال شدند', 'success');
    }
    
    function resetFilters() {
        // Reset active filters
        activeFilters = {
            category: [],
            brand: [],
            discount: [],
            availability: ['in-stock'],
            price: { min: 0, max: 100000000 }
        };
        
        // Reset UI
        const filterCheckboxes = document.querySelectorAll('.filter-option input');
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Check "in-stock" by default
        document.querySelector('input[name="availability"][value="in-stock"]').checked = true;
        
        // Reset price range
        const rangeMin = document.querySelector('.range-min');
        const rangeMax = document.querySelector('.range-max');
        rangeMin.value = 0;
        rangeMax.value = 100000000;
        initPriceRangeSlider();
        
        // Reset sort
        sortSelect.value = 'newest';
        
        // Apply reset
        applyFilters();
        
        // Show notification
        showNotification('فیلترها بازنشانی شدند', 'info');
    }
    
    function filterProducts() {
        filteredProducts = products.filter(product => {
            // Category filter
            if (activeFilters.category.length > 0 && !activeFilters.category.includes(product.category)) {
                return false;
            }
            
            // Brand filter
            if (activeFilters.brand.length > 0 && !activeFilters.brand.includes(product.brand)) {
                return false;
            }
            
            // Discount filter
            if (activeFilters.discount.length > 0) {
                const meetsDiscount = activeFilters.discount.some(discount => {
                    return product.discount >= parseInt(discount);
                });
                if (!meetsDiscount) return false;
            }
            
            // Availability filter
            if (activeFilters.availability.length > 0) {
                if (activeFilters.availability.includes('in-stock') && !product.inStock) {
                    return false;
                }
                if (activeFilters.availability.includes('pre-order') && product.inStock) {
                    return false;
                }
            }
            
            // Price filter
            if (product.price < activeFilters.price.min || product.price > activeFilters.price.max) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        applySorting();
    }
    
    function applySorting() {
        const sortValue = sortSelect.value;
        
        switch (sortValue) {
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                // In a real app, this would be based on sales data
                // For demo, we'll use a combination of discount and ID
                filteredProducts.sort((a, b) => {
                    const scoreA = (a.discount || 0) + (a.tags?.includes('پرفروش') ? 50 : 0);
                    const scoreB = (b.discount || 0) + (b.tags?.includes('پرفروش') ? 50 : 0);
                    return scoreB - scoreA;
                });
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'discount':
                filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            default:
                filteredProducts.sort((a, b) => b.id - a.id);
        }
    }
    
    function updateActiveFiltersDisplay() {
        activeFiltersContainer.innerHTML = '';
        
        // Category filters
        activeFilters.category.forEach(category => {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                <span>${getCategoryName(category)}</span>
                <button class="remove-filter" data-type="category" data-value="${category}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        });
        
        // Brand filters
        activeFilters.brand.forEach(brand => {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                <span>${getBrandName(brand)}</span>
                <button class="remove-filter" data-type="brand" data-value="${brand}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        });
        
        // Discount filters
        activeFilters.discount.forEach(discount => {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                <span>تخفیف ${discount}%+</span>
                <button class="remove-filter" data-type="discount" data-value="${discount}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        });
        
        // Availability filters (excluding default in-stock)
        activeFilters.availability.forEach(availability => {
            if (availability !== 'in-stock') {
                const filterElement = document.createElement('div');
                filterElement.className = 'active-filter';
                filterElement.innerHTML = `
                    <span>${getAvailabilityName(availability)}</span>
                    <button class="remove-filter" data-type="availability" data-value="${availability}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                activeFiltersContainer.appendChild(filterElement);
            }
        });
        
        // Price filter if not default
        if (activeFilters.price.min > 0 || activeFilters.price.max < 100000000) {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                <span>قیمت: ${activeFilters.price.min.toLocaleString()} - ${activeFilters.price.max.toLocaleString()}</span>
                <button class="remove-filter" data-type="price">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        }
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-filter');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');
                
                if (type === 'price') {
                    // Reset price filter
                    activeFilters.price = { min: 0, max: 100000000 };
                    const rangeMin = document.querySelector('.range-min');
                    const rangeMax = document.querySelector('.range-max');
                    rangeMin.value = 0;
                    rangeMax.value = 100000000;
                    initPriceRangeSlider();
                } else {
                    // Remove specific filter
                    activeFilters[type] = activeFilters[type].filter(item => item !== value);
                    
                    // Uncheck corresponding checkbox
                    const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                }
                
                // Reapply filters
                applyFilters();
            });
        });
    }
    
    function getCategoryName(category) {
        const categories = {
            'gpu': 'کارت گرافیک',
            'cpu': 'پردازنده',
            'ram': 'رم',
            'motherboard': 'مادربرد',
            'storage': 'ذخیره‌سازی',
            'psu': 'پاور',
            'case': 'کیس',
            'cooling': 'خنک‌کننده',
            'monitors': 'مانیتور',
            'accessories': 'لوازم جانبی',
            'audio': 'تجهیزات صوتی'
        };
        return categories[category] || category;
    }
    
    function getBrandName(brand) {
        const brands = {
            'nvidia': 'NVIDIA',
            'amd': 'AMD',
            'intel': 'Intel',
            'asus': 'ASUS',
            'msi': 'MSI',
            'gigabyte': 'GIGABYTE',
            'corsair': 'Corsair',
            'kingston': 'Kingston',
            'cooler-master': 'Cooler Master',
            'logitech': 'Logitech',
            'steelseries': 'SteelSeries',
            'redragon': 'Redragon',
            'thunderx3': 'ThunderX3',
            'acer': 'Acer'
        };
        return brands[brand] || brand;
    }
    
    function getAvailabilityName(availability) {
        const availabilities = {
            'in-stock': 'موجود در انبار',
            'pre-order': 'پیش‌فروش'
        };
        return availabilities[availability] || availability;
    }
    
    function handleSortChange() {
        applySorting();
        renderProducts();
        updateResultsCount();
    }
    
    function handleViewChange() {
        const view = this.getAttribute('data-view');
        
        // Update active view button
        viewButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Update current view
        currentView = view;
        
        // Update products grid
        productsGrid.classList.remove('grid-view', 'list-view');
        productsGrid.classList.add(`${view}-view`);
        
        // Re-render products
        renderProducts();
    }
    
    function renderProducts() {
        // Hide loading state
        hideLoadingState();
        
        // Clear products grid
        productsGrid.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        if (productsToShow.length === 0) {
            showEmptyState();
            return;
        }
        
        // Create product cards
        productsToShow.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product', product.id);
        
        const discountBadge = product.discount > 0 ? 
            `<div class="discount-badge">-${product.discount}%</div>` : '';
        
        const oldPrice = product.oldPrice ? 
            `<span class="old-price">${product.oldPrice.toLocaleString()} تومان</span>` : '';
        
        const stockStatus = product.inStock ? 
            '<span class="stock-status in-stock">موجود در انبار</span>' : 
            '<span class="stock-status out-of-stock">ناموجود</span>';
        
        const quickViewBtn = product.inStock ? 
            `<button class="action-btn quick-view-btn" aria-label="مشاهده سریع" data-product="${product.id}">
                <i class="fas fa-eye"></i>
            </button>` : '';
        
        const tagsHTML = product.tags && product.tags.length > 0 ? 
            `<div class="product-tags">${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}</div>` : '';
        
        card.innerHTML = `
            <div class="product-image">
                <!-- REPLACE: ${product.image} -->
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-actions">
                    ${quickViewBtn}
                    <button class="action-btn like-btn" aria-label="افزودن به علاقه‌مندی‌ها">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                ${discountBadge}
                ${tagsHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                ${currentView === 'list' ? `<p class="product-description">${product.description}</p>` : ''}
                <div class="price-row">
                    ${oldPrice}
                    <span class="new-price">${product.price.toLocaleString()} تومان</span>
                </div>
                ${stockStatus}
                ${currentView === 'list' ? `<div class="product-specs">${Object.entries(product.specs).slice(0, 3).map(([key, value]) => `<div class="spec-item"><span class="spec-name">${key}:</span> <span class="spec-value">${value}</span></div>`).join('')}</div>` : ''}
                <button class="btn add-to-cart" data-product="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? '<i class="fas fa-shopping-cart"></i> افزودن به سبد خرید' : 'ناموجود'}
                </button>
            </div>
        `;
        
        // Add event listeners
        const addToCartBtn = card.querySelector('.add-to-cart');
        const likeBtn = card.querySelector('.like-btn');
        const quickViewBtnElement = card.querySelector('.quick-view-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                if (product.inStock) {
                    addToCart(product);
                }
            });
        }
        
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                toggleLike(this);
            });
        }
        
        if (quickViewBtnElement) {
            quickViewBtnElement.addEventListener('click', function() {
                openQuickView(product);
            });
        }
        
        return card;
    }
    
    function showLoadingState() {
        productsLoading.style.display = 'flex';
        productsGrid.innerHTML = '';
    }
    
    function hideLoadingState() {
        productsLoading.style.display = 'none';
    }
    
    function showEmptyState() {
        productsGrid.innerHTML = `
            <div class="products-empty">
                <i class="fas fa-search"></i>
                <h3>محصولی یافت نشد</h3>
                <p>متأسفانه هیچ محصولی با فیلترهای انتخاب شده مطابقت ندارد.</p>
                <button class="btn btn-primary reset-filters">بازنشانی فیلترها</button>
            </div>
        `;
        
        // Add event listener to reset button
        const resetBtn = productsGrid.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }
    }
    
    function updateResultsCount() {
        const startIndex = (currentPage - 1) * productsPerPage + 1;
        const endIndex = Math.min(currentPage * productsPerPage, filteredProducts.length);
        const total = filteredProducts.length;
        
        resultsCountElement.textContent = `نمایش ${startIndex}-${endIndex} از ${total} محصول`;
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const paginationNumbers = document.querySelector('.pagination-numbers');
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');
        
        // Update prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // Update pagination numbers
        if (totalPages <= 1) {
            paginationNumbers.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="pagination-number ${i === currentPage ? 'active' : ''}">${i}</button>
                `;
            }
        } else {
            // Show limited pages with ellipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    paginationHTML += `
                        <button class="pagination-number ${i === currentPage ? 'active' : ''}">${i}</button>
                    `;
                }
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
                paginationHTML += `<button class="pagination-number">${totalPages}</button>`;
            } else if (currentPage >= totalPages - 2) {
                paginationHTML += `<button class="pagination-number">1</button>`;
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    paginationHTML += `
                        <button class="pagination-number ${i === currentPage ? 'active' : ''}">${i}</button>
                    `;
                }
            } else {
                paginationHTML += `<button class="pagination-number">1</button>`;
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    paginationHTML += `
                        <button class="pagination-number ${i === currentPage ? 'active' : ''}">${i}</button>
                    `;
                }
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
                paginationHTML += `<button class="pagination-number">${totalPages}</button>`;
            }
        }
        
        paginationNumbers.innerHTML = paginationHTML;
        
        // Add event listeners to pagination numbers
        const paginationNumbersBtns = paginationNumbers.querySelectorAll('.pagination-number');
        paginationNumbersBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.textContent);
                if (!isNaN(page)) {
                    currentPage = page;
                    renderProducts();
                    updatePagination();
                    updateResultsCount();
                    
                    // Scroll to top of products
                    productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    function handlePagination(e) {
        if (e.target.classList.contains('pagination-btn')) {
            e.preventDefault();
            
            if (e.target.classList.contains('prev') && currentPage > 1) {
                currentPage--;
            } else if (e.target.classList.contains('next') && currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
                currentPage++;
            }
            
            renderProducts();
            updatePagination();
            updateResultsCount();
            
            // Scroll to top of products
            productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function toggleSidebar() {
        productsSidebar.classList.toggle('active');
        
        // Add overlay when sidebar is active
        if (productsSidebar.classList.contains('active')) {
            const overlay = document.createElement('div');
            overlay.className = 'panel-overlay sidebar-overlay active';
            overlay.id = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', toggleSidebar);
        } else {
            const overlay = document.getElementById('sidebar-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }
    
    // Cart Functions
    function addToCart(product) {
        // Check if product is already in cart
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        // Update cart UI
        updateCartUI();
        
        // Save to localStorage
        localStorage.setItem('aquamarket_cart', JSON.stringify(cartItems));
        
        // Show success feedback
        showNotification('محصول با موفقیت به سبد خرید اضافه شد', 'success');
        
        // Add animation to cart button
        animateCartButton();
        
        // Open cart panel if it's not already open
        if (!cartPanel.classList.contains('active')) {
            openCartPanel();
        }
    }
    
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const totalPrice = document.querySelector('.total-price');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        // Update cart count
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Calculate total price
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = total.toLocaleString() + ' تومان';
        
        // Update cart items
        if (cartItems.length === 0) {
            emptyCart.style.display = 'flex';
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCart);
            checkoutBtn.disabled = true;
        } else {
            emptyCart.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            
            cartItems.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            checkoutBtn.disabled = false;
            
            // Add event listeners to quantity buttons
            const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
            const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
            const removeButtons = document.querySelectorAll('.remove-item');
            
            decreaseButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    updateCartQuantity(this.getAttribute('data-id'), -1);
                });
            });
            
            increaseButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    updateCartQuantity(this.getAttribute('data-id'), 1);
                });
            });
            
            removeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    removeFromCart(this.getAttribute('data-id'));
                });
            });
        }
    }
    
    function updateCartQuantity(productId, change) {
        const item = cartItems.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartUI();
                localStorage.setItem('aquamarket_cart', JSON.stringify(cartItems));
            }
        }
    }
    
    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        updateCartUI();
        localStorage.setItem('aquamarket_cart', JSON.stringify(cartItems));
        showNotification('محصول از سبد خرید حذف شد', 'info');
    }
    
    function openCartPanel() {
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCartPanel() {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function animateCartButton() {
        cartCountElement.style.transform = 'scale(1.5)';
        
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Like Button Function
    function toggleLike(button) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        
        if (button.classList.contains('active')) {
            icon.classList.remove('far', 'fa-heart');
            icon.classList.add('fas', 'fa-heart');
            showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
            
            // Add animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 300);
        } else {
            icon.classList.remove('fas', 'fa-heart');
            icon.classList.add('far', 'fa-heart');
            showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
        }
    }
    
    // Quick View Functions
    function openQuickView(product) {
        const modalBody = quickViewModal.querySelector('.modal-body');
        
        // Create quick view content
        const quickViewHTML = createQuickViewHTML(product);
        modalBody.innerHTML = quickViewHTML;
        
        // Initialize quick view events
        initQuickViewEvents(product);
        
        // Show modal
        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeQuickView() {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function createQuickViewHTML(product) {
        const discountBadge = product.discount > 0 ? 
            `<div class="quick-view-discount">-${product.discount}%</div>` : '';
        
        const oldPrice = product.oldPrice ? 
            `<span class="old-price">${product.oldPrice.toLocaleString()} تومان</span>` : '';
        
        const specsHTML = Object.entries(product.specs).map(([key, value]) => `
            <li>
                <span class="spec-name">${key}:</span>
                <span class="spec-value">${value}</span>
            </li>
        `).join('');
        
        return `
            <div class="quick-view-content">
                <div class="quick-view-images">
                    <div class="quick-view-main-image">
                        <!-- REPLACE: ${product.image} -->
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="quick-view-thumbnails">
                        <div class="quick-view-thumbnail active">
                            <!-- REPLACE: ${product.image} -->
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <!-- In a real app, you would have multiple thumbnails -->
                        <div class="quick-view-thumbnail">
                            <!-- REPLACE: /assets/img/prod2.jpg -->
                            <img src="/assets/img/prod2.jpg" alt="${product.name}">
                        </div>
                        <div class="quick-view-thumbnail">
                            <!-- REPLACE: /assets/img/prod3.jpg -->
                            <img src="/assets/img/prod3.jpg" alt="${product.name}">
                        </div>
                    </div>
                </div>
                <div class="quick-view-details">
                    <h3 class="quick-view-title">${product.name}</h3>
                    <div class="quick-view-price">
                        ${oldPrice}
                        <span class="new-price">${product.price.toLocaleString()} تومان</span>
                        ${discountBadge}
                    </div>
                    <p class="quick-view-description">${product.description}</p>
                    <div class="quick-view-specs">
                        <h4>مشخصات فنی</h4>
                        <ul>
                            ${specsHTML}
                        </ul>
                    </div>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary add-to-cart-quick" data-product="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
                        </button>
                        <button class="btn btn-outline like-btn-quick">
                            <i class="far fa-heart"></i>
                            افزودن به علاقه‌مندی‌ها
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function initQuickViewEvents(product) {
        // Thumbnail click events
        const thumbnails = quickViewModal.querySelectorAll('.quick-view-thumbnail');
        const mainImage = quickViewModal.querySelector('.quick-view-main-image img');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image
                const thumbImg = this.querySelector('img');
                mainImage.src = thumbImg.src;
            });
        });
        
        // Add to cart button
        const addToCartBtn = quickViewModal.querySelector('.add-to-cart-quick');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                if (product.inStock) {
                    addToCart(product);
                    closeQuickView();
                }
            });
        }
        
        // Like button
        const likeBtn = quickViewModal.querySelector('.like-btn-quick');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
                }
            });
        }
    }
    
    // Theme Toggle Function
    function toggleTheme() {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('light-theme', isDarkTheme);
        document.body.classList.toggle('dark-theme', !isDarkTheme);
        
        // Save theme preference to localStorage
        localStorage.setItem('aquamarket_theme', isDarkTheme ? 'light' : 'dark');
        
        // Update icon
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            if (isDarkTheme) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
        
        // Show notification
        showNotification(`تم ${isDarkTheme ? 'روشن' : 'تیره'} فعال شد`, 'info');
    }
    
    // Account Modal Function
    function openAccountModal() {
        const accountModal = document.getElementById('account-modal');
        const accountOverlay = document.getElementById('account-overlay');
        
        accountModal.classList.add('active');
        accountOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Check URL Parameters
    function checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for filter parameter
        const filter = urlParams.get('filter');
        if (filter === 'bestsellers') {
            sortSelect.value = 'popular';
            handleSortChange();
        } else if (filter === 'discounts') {
            // Check discount filter
            document.querySelector('input[name="discount"][value="10"]').checked = true;
            updateActiveFilters.call(document.querySelector('input[name="discount"][value="10"]'));
            applyFilters();
        }
        
        // Check for category parameter
        const category = urlParams.get('category');
        if (category) {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) {
                checkbox.checked = true;
                updateActiveFilters.call(checkbox);
                applyFilters();
            }
        }
        
        // Check for sort parameter
        const sort = urlParams.get('sort');
        if (sort) {
            sortSelect.value = sort;
            handleSortChange();
        }
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Close button event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                closeNotification(notification);
            }
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.classList.remove('active');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Initialize theme from localStorage
    function initTheme() {
        const savedTheme = localStorage.getItem('aquamarket_theme') || 'dark';
        const isDark = savedTheme === 'dark';
        
        document.body.classList.toggle('dark-theme', isDark);
        document.body.classList.toggle('light-theme', !isDark);
        
        // Update icon
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            if (isDark) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }
    
    // Initialize theme on load
    initTheme();
});