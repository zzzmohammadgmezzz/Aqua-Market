// About Page JavaScript - Completely Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('About page loaded - Initializing...');
    
    // Initialize everything
    initAboutPage();
    
    function initAboutPage() {
        // Initialize theme
        initTheme();
        
        // Setup all event listeners
        setupEventListeners();
        
        // Initialize animations
        initAnimations();
        
        console.log('About page initialized successfully!');
    }
    
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Mobile menu functionality
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMobileMenu = document.getElementById('closeMobileMenu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                console.log('Menu toggle clicked');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Update hamburger icon
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            });
        } else {
            console.error('Menu elements not found');
        }
        
        if (closeMobileMenu && mobileMenu) {
            closeMobileMenu.addEventListener('click', function() {
                console.log('Close menu clicked');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Update hamburger icon
                const icon = document.querySelector('.menu-toggle i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
        
        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Update hamburger icon
                const icon = document.querySelector('.menu-toggle i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Theme toggle
        const themeToggleBtns = document.querySelectorAll('.theme-toggle');
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });
        
        // Cart button
        const cartBtns = document.querySelectorAll('.cart-btn');
        cartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                showNotification('سبد خرید در حال توسعه است', 'info');
            });
        });
        
        // Account button
        const accountBtns = document.querySelectorAll('.account-btn');
        accountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                showNotification('صفحه حساب کاربری در حال توسعه است', 'info');
            });
        });
        
        // Escape key to close mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Update hamburger icon
                    const icon = document.querySelector('.menu-toggle i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
        
        console.log('Event listeners setup completed');
    }
    
    function initTheme() {
        console.log('Initializing theme...');
        const savedTheme = localStorage.getItem('aquamarket_theme') || 'dark';
        const isDark = savedTheme === 'dark';
        
        document.body.classList.toggle('dark-theme', isDark);
        document.body.classList.toggle('light-theme', !isDark);
        
        // Update icons
        updateThemeIcons(isDark);
        console.log('Theme initialized:', savedTheme);
    }
    
    function toggleTheme() {
        console.log('Toggling theme...');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('light-theme', isDarkTheme);
        document.body.classList.toggle('dark-theme', !isDarkTheme);
        
        // Save theme preference
        const newTheme = !isDarkTheme ? 'dark' : 'light';
        localStorage.setItem('aquamarket_theme', newTheme);
        
        // Update icons
        updateThemeIcons(!isDarkTheme);
        
        // Show notification
        showNotification(`تم ${!isDarkTheme ? 'تیره' : 'روشن'} فعال شد`, 'success');
        console.log('Theme toggled to:', newTheme);
    }
    
    function updateThemeIcons(isDark) {
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
    
    function initAnimations() {
        console.log('Initializing animations...');
        
        // Animation on scroll for stats
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
        
        // Add loading animation to gallery images
        const galleryImages = document.querySelectorAll('.gallery-item img');
        galleryImages.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Set initial opacity for fade-in effect
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
        
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        console.log('Animations initialized');
    }
    
    // Animate stats numbers - FIXED VERSION
    function animateStats() {
        console.log('Animating stats...');
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        statNumbers.forEach(stat => {
            const originalValue = stat.textContent;
            const target = parseInt(stat.getAttribute('data-target'));
            
            // If already has the correct value, don't animate
            if (originalValue.includes('+') || originalValue.includes('/')) {
                return;
            }
            
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    // Format the final number with Persian formatting
                    stat.textContent = formatNumber(current) + getSuffix(stat.textContent);
                } else {
                    stat.textContent = formatNumber(Math.floor(current)) + getSuffix(stat.textContent);
                }
            }, 16);
        });
    }
    
    // Get suffix from original text (+ or /)
    function getSuffix(text) {
        if (text.includes('+')) return '+';
        if (text.includes('/')) return '/';
        return '';
    }
    
    // Format numbers with Persian/Arabic digits and commas
    function formatNumber(number) {
        if (number < 1000) {
            return convertToPersian(number.toString());
        }
        
        // Convert to string and add commas
        const numberString = number.toLocaleString('en-US');
        
        // Convert Western Arabic numerals to Persian/Arabic numerals
        return convertToPersian(numberString);
    }
    
    // Convert Western Arabic numerals to Persian/Arabic numerals
    function convertToPersian(text) {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return text.replace(/\d/g, function(match) {
            return persianNumbers[parseInt(match)];
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
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
        
        // Add styles for notification if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 2000;
                    background: var(--glass-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    max-width: 350px;
                    backdrop-filter: blur(10px);
                }
                
                .notification.active {
                    transform: translateX(0);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 20px;
                }
                
                .notification-message {
                    color: var(--text-primary);
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    margin-right: 10px;
                    transition: color 0.2s;
                    padding: 5px;
                    border-radius: 50%;
                }
                
                .notification-close:hover {
                    color: var(--text-primary);
                    background-color: rgba(0, 0, 0, 0.1);
                }
                
                .notification-success {
                    border-left: 4px solid #2ed573;
                }
                
                .notification-error {
                    border-left: 4px solid #ff4757;
                }
                
                .notification-info {
                    border-left: 4px solid var(--accent);
                }
            `;
            document.head.appendChild(style);
        }
        
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
    
    // Initialize stats with formatted numbers on load
    function initializeStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            if (stat.hasAttribute('data-target')) {
                const target = stat.getAttribute('data-target');
                const suffix = getSuffix(stat.textContent);
                stat.textContent = formatNumber(parseInt(target)) + suffix;
            }
        });
    }
    
    // Call initialization
    initializeStats();
    
    // Test function to verify JS is working
    function testFunctionality() {
        console.log('Testing functionality...');
        
        // Test theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            console.log('Theme toggle found');
        }
        
        // Test menu toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            console.log('Menu toggle found');
        }
        
        // Test social links
        const socialLinks = document.querySelectorAll('.social-link');
        console.log('Social links found:', socialLinks.length);
        
        console.log('Functionality test completed');
    }
    
    // Run test
    setTimeout(testFunctionality, 1000);
});