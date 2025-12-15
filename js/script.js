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
    }
    
    function initializeEventListeners() {
        // Theme toggle buttons - CRITICAL FIX
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });
        
        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
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
        
        // Account buttons (except those that are links)
        document.querySelectorAll('.account-btn').forEach(btn => {
            if (!btn.hasAttribute('href') || btn.getAttribute('href') === '#') {
                btn.addEventListener('click', toggleAccountModal);
            }
        });
        
        // Support button
        document.querySelector('.support-btn')?.addEventListener('click', toggleChatModal);
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
        
        // Like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', toggleLike);
        });
        
        // Compare buttons
        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', toggleCompare);
        });
        
        // Close buttons
        document.querySelectorAll('.close-panel, .close-modal').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Overlay clicks
        document.querySelectorAll('.panel-overlay, .modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', closeAllModals);
        });
        
        // Form submissions
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
        
        // Slider controls
        document.querySelector('.slider-control.prev')?.addEventListener('click', prevSlide);
        document.querySelector('.slider-control.next')?.addEventListener('click', nextSlide);
        
        // Slider dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
    }
    
    // Theme functionality
    function initializeTheme() {
        // Load saved theme
        loadSavedTheme();
    }
    
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        updateTheme();
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        showNotification(`تم ${isDarkTheme ? 'تیره' : 'روشن'} فعال شد`, 'success');
    }
    
    function updateTheme() {
        const body = document.body;
        body.classList.toggle('dark-theme', isDarkTheme);
        body.classList.toggle('light-theme', !isDarkTheme);
        
        // Update icons
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            const moonIcon = btn.querySelector('.fa-moon');
            const sunIcon = btn.querySelector('.fa-sun');
            
            if (moonIcon && sunIcon) {
                if (isDarkTheme) {
                    moonIcon.style.display = 'block';
                    sunIcon.style.display = 'none';
                } else {
                    moonIcon.style.display = 'none';
                    sunIcon.style.display = 'block';
                }
            }
        });
    }
    
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        isDarkTheme = savedTheme === 'dark';
        updateTheme();
    }
    
    // Search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    resetSearch();
                }
            });
        }
    }
    
    function performSearch(query) {
        // اینجا می‌توانید منطق جستجوی واقعی را پیاده‌سازی کنید
        console.log('جستجو برای:', query);
        showNotification(`در حال جستجو برای "${query}"...`, 'info');
    }
    
    window.resetSearch = function() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        showNotification('جستجو بازنشانی شد', 'info');
    };
    
    // Mobile menu functionality
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const isOpen = mobileMenu.classList.toggle('active');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', isOpen);
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        }
        
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    
    // Cart functionality
    function initializeCart() {
        updateCartCount();
        updateCartPanel();
    }
    
    function addToCart(e) {
        const button = e.currentTarget;
        const productId = button.getAttribute('data-product');
        const productCard = button.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.new-price')?.textContent || 
                           productCard.querySelector('.price-row span:last-child').textContent;
        const productImage = productCard.querySelector('.product-image img')?.src || '';
        
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
    
    // Modal functionality
    function initializeModals() {
        // Modal event listeners are already in initializeEventListeners
    }
    
    function toggleAccountModal() {
        const modal = document.querySelector('.account-modal');
        const overlay = document.querySelector('#account-overlay');
        
        if (modal && overlay) {
            modal.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = modal.classList.contains('active') ? 'hidden' : '';
        }
    }
    
    function toggleChatModal() {
        const modal = document.querySelector('.chat-modal');
        const overlay = document.querySelector('#chat-overlay');
        
        if (modal && overlay) {
            modal.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = modal.classList.contains('active') ? 'hidden' : '';
            
            // Initialize chat if opening
            if (modal.classList.contains('active')) {
                initializeChat();
            }
        }
    }
    
    function closeAllModals() {
        // Close all panels and modals
        document.querySelectorAll('.side-panel, .modal').forEach(panel => {
            panel.classList.remove('active');
        });
        
        document.querySelectorAll('.panel-overlay, .modal-overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });
        
        document.body.style.overflow = '';
    }
    
    // Hero slider functionality
    function initializeHeroSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;
        
        // Set first slide as active
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        
        // Start autoplay
        startSliderAutoplay();
        
        // Pause on hover
        const slider = document.querySelector('.slider-container');
        if (slider) {
            slider.addEventListener('mouseenter', pauseSliderAutoplay);
            slider.addEventListener('mouseleave', startSliderAutoplay);
        }
    }
    
    function startSliderAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    function pauseSliderAutoplay() {
        if (slideInterval) clearInterval(slideInterval);
    }
    
    function nextSlide() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide]?.classList.remove('active');
        
        currentSlide = (currentSlide + 1) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide]?.classList.add('active');
    }
    
    function prevSlide() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide]?.classList.remove('active');
        
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide]?.classList.add('active');
    }
    
    function goToSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide]?.classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide]?.classList.add('active');
        
        // Restart autoplay
        startSliderAutoplay();
    }
    
    // Countdown timers
    function initializeCountdownTimers() {
        const timers = document.querySelectorAll('.timer .timer-text');
        
        timers.forEach(timer => {
            // Set random time for demo (1-24 hours)
            const hours = Math.floor(Math.random() * 24) + 1;
            const minutes = Math.floor(Math.random() * 60);
            const seconds = Math.floor(Math.random() * 60);
            
            let totalSeconds = hours * 3600 + minutes * 60 + seconds;
            
            // Update timer immediately
            updateTimerDisplay(timer, totalSeconds);
            
            // Update every second
            const interval = setInterval(() => {
                totalSeconds--;
                
                if (totalSeconds <= 0) {
                    clearInterval(interval);
                    timer.textContent = 'منقضی شده';
                    timer.parentElement.style.color = '#ff4757';
                } else {
                    updateTimerDisplay(timer, totalSeconds);
                }
            }, 1000);
        });
    }
    
    function updateTimerDisplay(timerElement, totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Like button functionality
    function toggleLike(e) {
        const button = e.currentTarget;
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
    
    // Compare button functionality
    function toggleCompare(e) {
        const button = e.currentTarget;
        showNotification('محصول به لیست مقایسه اضافه شد', 'info');
    }
    
    // Back to top functionality
    function initializeBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Form handling
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (email && validateEmail(email)) {
            showNotification('عضویت در خبرنامه با موفقیت انجام شد', 'success');
            e.target.reset();
        } else {
            showNotification('لطفاً یک ایمیل معتبر وارد کنید', 'error');
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Chat functionality
    function initializeChat() {
        const chatInput = document.querySelector('.chat-input input');
        const sendBtn = document.querySelector('.send-btn');
        const chatMessages = document.querySelector('.chat-messages');
        
        if (!chatInput || !sendBtn || !chatMessages) return;
        
        const sendMessage = () => {
            const message = chatInput.value.trim();
            
            if (!message) return;
            
            // Add user message
            addMessage(message, 'sent');
            
            // Clear input
            chatInput.value = '';
            
            // Simulate bot response after a delay
            setTimeout(() => {
                const responses = [
                    "متشکرم از پیام شما. چگونه می‌توانم کمک کنم؟",
                    "لطفاً منتظر بمانید، همکاران ما به زودی با شما تماس خواهند گرفت.",
                    "برای اطلاعات بیشتر می‌توانید با پشتیبانی تماس بگیرید: ۰۲۱-۱۲۳۴۵۶۷۸",
                    "سوال شما ثبت شد. در اسرع وقت پاسخ داده خواهد شد."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'received');
            }, 1000 + Math.random() * 2000);
        };
        
        sendBtn.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function addMessage(text, type) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${type}`;
            
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
                <span class="message-time">${timeString}</span>
            `;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page and animate in
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('active'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
});