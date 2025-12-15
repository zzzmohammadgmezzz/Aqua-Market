new js product
// AquaMarket - Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Global Variables
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds
    let isDarkTheme = localStorage.getItem('theme') !== 'light';
    
    // Initialize the page
    init();
    
    function init() {
        // Initialize all components
        initializeEventListeners();
        initializeHeroSlider();
        initializeCountdownTimers();
        initializeCart();
        initializeMobileMenu();
        initializeModals();
        initializeBackToTop();
        initializeSearch();
        initializeTheme();
        initializeProductPageFeatures();
    }
    
    function initializeEventListeners() {
        // Theme toggle buttons
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });
        
        // Search form
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchInput = this.querySelector('input[type="text"]');
                if (searchInput && searchInput.value.trim()) {
                    performSearch(searchInput.value.trim());
                }
            });
        }
        
        // Mobile menu toggle
        document.querySelector('.menu-toggle')?.addEventListener('click', toggleMobileMenu);
        document.querySelector('.close-mobile-menu')?.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', toggleMobileMenu);
        });
        
        // Cart buttons
        document.querySelectorAll('.cart-btn').forEach(btn => {
            btn.addEventListener('click', toggleCartPanel);
        });
        
        // Account buttons
        document.querySelectorAll('.account-btn').forEach(btn => {
            if (!btn.hasAttribute('href') || btn.getAttribute('href') === '#') {
                btn.addEventListener('click', toggleAccountModal);
            }
        });
        
        // Support button
        document.querySelector('.support-btn')?.addEventListener('click', toggleChatModal);
        
        // Close buttons
        document.querySelectorAll('.close-panel, .close-modal').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Overlay clicks
        document.querySelectorAll('.panel-overlay, .modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', closeAllModals);
        });
        
        // Form submissions
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm && !newsletterForm.id) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
        
        // Slider controls
        document.querySelector('.slider-control.prev')?.addEventListener('click', prevSlide);
        document.querySelector('.slider-control.next')?.addEventListener('click', nextSlide);
        
        // Slider dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Checkout button
        document.querySelector('.checkout-btn')?.addEventListener('click', function() {
            if (cartItems.length === 0) {
                showNotification('سبد خرید شما خالی است', 'error');
                return;
            }
            showNotification('در حال انتقال به صفحه پرداخت...', 'info');
            // In real implementation, redirect to checkout page
            // window.location.href = '/checkout.html';
        });
    }
    
    function initializeProductPageFeatures() {
        // This function handles product page specific features
        if (!document.querySelector('.products-page')) return;
        
        // Add event delegation for product actions
        document.addEventListener('click', function(e) {
            // Handle like button
            if (e.target.closest('.like-btn')) {
                const button = e.target.closest('.like-btn');
                const icon = button.querySelector('i');
                
                button.classList.toggle('active');
                
                if (button.classList.contains('active')) {
                    icon.classList.remove('far', 'fa-heart');
                    icon.classList.add('fas', 'fa-heart');
                    showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
                } else {
                    icon.classList.remove('fas', 'fa-heart');
                    icon.classList.add('far', 'fa-heart');
                    showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
                }
            }
            
            // Handle compare button
            if (e.target.closest('.compare-btn')) {
                showNotification('محصول به لیست مقایسه اضافه شد', 'info');
            }
            
            // Handle add to cart button
            if (e.target.closest('.add-to-cart')) {
                const button = e.target.closest('.add-to-cart');
                const productCard = button.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                const productPrice = productCard.querySelector('.new-price')?.textContent || 
                                   productCard.querySelector('.price-row span:last-child').textContent;
                const productImage = productCard.querySelector('.product-image img')?.src || '';
                const productId = button.getAttribute('data-product');
                
                // Add to cart logic
                const existingItem = cartItems.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({
                        id: productId,
                        title: productTitle,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                // Save to localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                // Update UI
                updateCartCount();
                updateCartPanel();
                showNotification('محصول به سبد خرید اضافه شد', 'success');
                
                // Animate cart button
                animateCartButton();
            }
        });
    }
    
    // Cart functionality
    function initializeCart() {
        updateCartCount();
        updateCartPanel();
    }
    
    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(count => {
            count.textContent = totalItems;
        });
    }
    
    function updateCartPanel() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const cartTotal = document.querySelector('.total-price');
        
        if (!cartItemsContainer) return;
        
        if (cartItems.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            if (cartTotal) cartTotal.textContent = '۰ تومان';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        
        // Calculate total
        let total = 0;
        const itemsHTML = cartItems.map(item => {
            const priceNumber = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
            total += priceNumber * item.quantity;
            
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <div class="cart-item-price">${item.price}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        cartItemsContainer.innerHTML = itemsHTML;
        
        if (cartTotal) {
            cartTotal.textContent = `${total.toLocaleString('fa-IR')} تومان`;
        }
    }
    
    window.updateQuantity = function(productId, change) {
        const item = cartItems.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) item.quantity = 1;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            updateCartPanel();
        }
    };
    
    window.removeFromCart = function(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        updateCartPanel();
        showNotification('محصول از سبد خرید حذف شد', 'info');
    };
    
    function animateCartButton() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.style.transform = 'scale(1.5)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    function toggleCartPanel() {
        const cartPanel = document.querySelector('.cart-panel');
        const cartOverlay = document.querySelector('#cart-overlay');
        
        if (cartPanel && cartOverlay) {
            cartPanel.classList.toggle('active');
            cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartPanel.classList.contains('active') ? 'hidden' : '';
            
            // Update cart panel when opening
            if (cartPanel.classList.contains('active')) {
                updateCartPanel();
            }
        }
    }
    
    // ... rest of the existing functions remain the same ...
    // (همه توابع قبلی مثل toggleTheme، initializeHeroSlider و ... بدون تغییر باقی می‌مانند)
});