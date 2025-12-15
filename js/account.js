// Account Page JavaScript - Standalone version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize account page
    initAccountPage();
    
    function initAccountPage() {
        // Initialize theme for account page
        initializeAccountTheme();
        
        // Initialize header functionality
        initializeHeader();
        
        // Initialize sidebar navigation
        initializeSidebar();
        
        // Initialize forms
        initializeForms();
        
        // Initialize order tracking
        initializeOrderTracking();
        
        // Initialize buttons and interactions
        initializeButtons();
        
        // Initialize back to top button
        initializeBackToTop();
        
        // Initialize support button
        initializeSupportButton();
    }
    
    // Initialize theme specifically for account page
    function initializeAccountTheme() {
        // Check current theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('theme');
        const isDarkTheme = savedTheme ? savedTheme === 'dark' : true;
        
        // Set initial theme
        setTheme(isDarkTheme);
        
        // Add event listeners to theme toggle buttons
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
                const currentIsDark = document.body.classList.contains('dark-theme');
                setTheme(!currentIsDark);
                
                // Show notification
                showNotification(`تم ${!currentIsDark ? 'تیره' : 'روشن'} فعال شد`, 'success');
            });
        });
    }
    
    // Set theme function
    function setTheme(isDarkTheme) {
        // Update body classes
        document.body.classList.toggle('dark-theme', isDarkTheme);
        document.body.classList.toggle('light-theme', !isDarkTheme);
        
        // Save to localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        // Update theme toggle icons
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
    
    // Initialize header functionality
    function initializeHeader() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const closeMobileMenu = document.querySelector('.close-mobile-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Update hamburger icon
                const icon = this.querySelector('i');
                icon.className = 'fas fa-times';
            });
        }
        
        if (closeMobileMenu && mobileMenu) {
            closeMobileMenu.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Update hamburger icon
                const menuToggleIcon = document.querySelector('.menu-toggle i');
                if (menuToggleIcon) {
                    menuToggleIcon.className = 'fas fa-bars';
                }
            });
        }
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Update hamburger icon
                const menuToggleIcon = document.querySelector('.menu-toggle i');
                if (menuToggleIcon) {
                    menuToggleIcon.className = 'fas fa-bars';
                }
            });
        });
        
        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput.value.trim()) {
                    showNotification(`جستجوی "${searchInput.value}" در حال انجام است`, 'info');
                    // In a real app, you would redirect to search results page
                    // window.location.href = `search.html?q=${encodeURIComponent(searchInput.value)}`;
                }
            });
        }
    }
    
    // Sidebar Navigation
    function initializeSidebar() {
        const menuItems = document.querySelectorAll('.menu-item');
        const contentSections = document.querySelectorAll('.content-section');
        
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get target section
                const targetSection = this.getAttribute('data-section');
                
                // Skip if already active
                if (this.classList.contains('active')) return;
                
                // Remove active class from all menu items
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Add active class to clicked menu item
                this.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show target section
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                    
                    // Scroll to top of section
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Handle logout button click
        const logoutConfirmBtn = document.querySelector('.logout-confirm-btn');
        const cancelLogoutBtn = document.querySelector('.cancel-logout-btn');
        
        if (logoutConfirmBtn) {
            logoutConfirmBtn.addEventListener('click', function() {
                if (confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')) {
                    showNotification('در حال خروج از حساب کاربری...', 'info');
                    setTimeout(() => {
                        // Simulate logout redirect
                        window.location.href = 'index.html';
                    }, 1500);
                }
            });
        }
        
        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', function() {
                // Go back to dashboard
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                    if (menuItem.getAttribute('data-section') === 'dashboard') {
                        menuItem.classList.add('active');
                    }
                });
                
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === 'dashboard') {
                        section.classList.add('active');
                    }
                });
            });
        }
    }
    
    // Form Handling
    function initializeForms() {
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = {
                    firstName: document.getElementById('first-name').value,
                    lastName: document.getElementById('last-name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    birthdate: document.getElementById('birthdate').value,
                    nationalCode: document.getElementById('national-code').value,
                    gender: document.querySelector('input[name="gender"]:checked').value
                };
                
                // Show success message
                showNotification('اطلاعات پروفایل با موفقیت به‌روزرسانی شد', 'success');
            });
        }
        
        // Change password form
        const changePasswordBtn = document.getElementById('change-password-btn');
        const passwordForm = document.getElementById('password-form');
        const changePasswordSection = document.getElementById('change-password-section');
        const cancelPasswordBtn = document.querySelector('.cancel-password-btn');
        
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                changePasswordSection.style.display = 'block';
                this.style.display = 'none';
            });
        }
        
        if (cancelPasswordBtn) {
            cancelPasswordBtn.addEventListener('click', function() {
                changePasswordSection.style.display = 'none';
                changePasswordBtn.style.display = 'inline-flex';
                passwordForm.reset();
            });
        }
        
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const currentPassword = document.getElementById('current-password').value;
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                // Validation
                if (newPassword !== confirmPassword) {
                    showNotification('رمز عبور جدید و تکرار آن مطابقت ندارند', 'error');
                    return;
                }
                
                if (newPassword.length < 6) {
                    showNotification('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', 'error');
                    return;
                }
                
                // Show success message
                showNotification('رمز عبور با موفقیت تغییر کرد', 'success');
                
                // Reset form and hide section
                passwordForm.reset();
                changePasswordSection.style.display = 'none';
                changePasswordBtn.style.display = 'inline-flex';
            });
        }
        
        // Add address button
        const addAddressBtn = document.querySelector('.add-address-btn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', function() {
                showNotification('افزودن آدرس جدید در حال توسعه است', 'info');
            });
        }
        
        // Edit address buttons
        const editAddressBtns = document.querySelectorAll('.edit-address');
        editAddressBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                showNotification('ویرایش آدرس در حال توسعه است', 'info');
            });
        });
        
        // Set default address buttons
        const setDefaultBtns = document.querySelectorAll('.set-default-btn');
        setDefaultBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                showNotification('آدرس با موفقیت به عنوان پیش‌فرض تنظیم شد', 'success');
                
                // Update UI
                document.querySelectorAll('.address-card').forEach(card => {
                    card.classList.remove('default');
                    const badge = card.querySelector('.default-badge');
                    if (badge) badge.remove();
                });
                
                this.closest('.address-card').classList.add('default');
                const addressHeader = this.closest('.address-card').querySelector('.address-header');
                if (addressHeader) {
                    const badge = document.createElement('span');
                    badge.className = 'default-badge';
                    badge.textContent = 'پیش‌فرض';
                    addressHeader.appendChild(badge);
                }
                
                // Change button text and style
                this.innerHTML = '<i class="fas fa-check"></i> پیش‌فرض';
                this.classList.remove('set-default-btn');
                this.classList.add('btn-outline');
                this.disabled = true;
            });
        });
        
        // Delete address buttons
        const deleteAddressBtns = document.querySelectorAll('.btn-danger');
        deleteAddressBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const addressCard = this.closest('.address-card');
                const isDefault = addressCard.classList.contains('default');
                
                if (isDefault) {
                    showNotification('نمی‌توان آدرس پیش‌فرض را حذف کرد. ابتدا آدرس دیگری را به عنوان پیش‌فرض تنظیم کنید.', 'error');
                    return;
                }
                
                if (confirm('آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟')) {
                    addressCard.style.opacity = '0.5';
                    addressCard.style.pointerEvents = 'none';
                    
                    // Simulate API call
                    setTimeout(() => {
                        addressCard.remove();
                        showNotification('آدرس با موفقیت حذف شد', 'success');
                    }, 500);
                }
            });
        });
    }
    
    // Order Tracking
    function initializeOrderTracking() {
        // Order tracking button
        const trackOrderBtn = document.querySelector('.tracking-input .btn');
        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', function() {
                const orderNumber = document.getElementById('order-number').value;
                
                if (!orderNumber.trim()) {
                    showNotification('لطفاً شماره سفارش را وارد کنید', 'error');
                    return;
                }
                
                showNotification(`در حال دریافت وضعیت سفارش ${orderNumber}...`, 'info');
                
                // Simulate API call
                setTimeout(() => {
                    showNotification(`وضعیت سفارش ${orderNumber} به‌روزرسانی شد`, 'success');
                }, 1000);
            });
        }
        
        // Order details buttons
        const orderDetailsBtns = document.querySelectorAll('.order-details-btn, .btn-sm.btn-outline[data-order]');
        orderDetailsBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-order');
                
                // Switch to order tracking section
                const menuItems = document.querySelectorAll('.menu-item');
                const contentSections = document.querySelectorAll('.content-section');
                
                // Remove active class from all menu items
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Add active class to order tracking menu item
                document.querySelector('.menu-item[data-section="order-tracking"]').classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show order tracking section
                document.getElementById('order-tracking').classList.add('active');
                
                // Update order number in tracking input
                const orderNumberInput = document.getElementById('order-number');
                if (orderNumberInput) {
                    orderNumberInput.value = `ORD-2024-00${orderId}`;
                }
                
                // Scroll to top of section
                document.getElementById('order-tracking').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Show notification
                showNotification(`در حال بارگذاری جزئیات سفارش ${orderId}...`, 'info');
            });
        });
    }
    
    // Other Button Interactions
    function initializeButtons() {
        // Add to cart buttons in wishlist
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Animate button
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> اضافه شد';
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
                this.disabled = true;
                
                // Show notification
                showNotification('محصول به سبد خرید اضافه شد', 'success');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('btn-outline');
                    this.classList.add('btn-primary');
                    this.disabled = false;
                }, 2000);
            });
        });
        
        // Remove from wishlist buttons
        const removeWishlistBtns = document.querySelectorAll('.remove-wishlist-btn');
        removeWishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const wishlistItem = this.closest('.wishlist-item');
                
                if (confirm('آیا مطمئن هستید که می‌خواهید این محصول را از لیست علاقه‌مندی‌ها حذف کنید؟')) {
                    wishlistItem.style.opacity = '0.5';
                    wishlistItem.style.pointerEvents = 'none';
                    
                    // Simulate API call
                    setTimeout(() => {
                        wishlistItem.remove();
                        showNotification('محصول از لیست علاقه‌مندی‌ها حذف شد', 'success');
                        
                        // Update wishlist badge count
                        const wishlistBadge = document.querySelector('.menu-item[data-section="wishlist"] .badge');
                        if (wishlistBadge) {
                            let currentCount = parseInt(wishlistBadge.textContent);
                            if (currentCount > 0) {
                                wishlistBadge.textContent = currentCount - 1;
                            }
                        }
                    }, 500);
                }
            });
        });
        
        // New ticket button
        const newTicketBtn = document.querySelector('.new-ticket-btn');
        if (newTicketBtn) {
            newTicketBtn.addEventListener('click', function() {
                showNotification('ایجاد تیکت جدید در حال توسعه است', 'info');
            });
        }
        
        // Change avatar button
        const changeAvatarBtn = document.querySelector('.change-avatar');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', function() {
                showNotification('تغییر عکس پروفایل در حال توسعه است', 'info');
            });
        }
    }
    
    // Back to top button
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
    
    // Support button
    function initializeSupportButton() {
        const supportBtn = document.querySelector('.support-btn');
        if (supportBtn) {
            supportBtn.addEventListener('click', function() {
                showNotification('پشتیبانی آنلاین به زودی فعال خواهد شد', 'info');
            });
        }
    }
    
    // Notification System
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
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: var(--glass-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 2000;
                    backdrop-filter: blur(10px);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                
                .notification.active {
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-right: 4px solid #2ed573;
                }
                
                .notification-error {
                    border-right: 4px solid #ff4757;
                }
                
                .notification-info {
                    border-right: 4px solid var(--accent);
                }
                
                .notification-content i {
                    font-size: 1.2rem;
                }
                
                .notification-success .notification-content i {
                    color: #2ed573;
                }
                
                .notification-error .notification-content i {
                    color: #ff4757;
                }
                
                .notification-info .notification-content i {
                    color: var(--accent);
                }
            `;
            document.head.appendChild(style);
        }
        
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