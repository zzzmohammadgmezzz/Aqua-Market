// AquaMag Blog JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize theme toggle
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
    
    // Mobile menu functionality
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
    
    // Account functionality
    const accountBtns = document.querySelectorAll('.account-btn');
    accountBtns.forEach(btn => {
        btn.addEventListener('click', openAccountModal);
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    backToTopBtn.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Load more articles
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
    
    // Sort articles
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortArticles);
    }
    
    // Newsletter forms
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
    
    // Initialize animations
    initScrollAnimations();
    
    // Initialize reading progress
    initReadingProgress();
    
    // Initialize article interactions
    initArticleInteractions();
    
    // Theme toggle function
    function toggleTheme() {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('light-theme', isDarkTheme);
        document.body.classList.toggle('dark-theme', !isDarkTheme);
        
        // Save theme preference to localStorage
        localStorage.setItem('aquamag_theme', isDarkTheme ? 'light' : 'dark');
        
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
    
    // Initialize theme from localStorage
    function initTheme() {
        const savedTheme = localStorage.getItem('aquamag_theme') || 'dark';
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
    
    // Account modal function
    function openAccountModal() {
        // In a real app, this would open account modal
        showNotification('این قابلیت به زودی اضافه خواهد شد', 'info');
    }
    
    // Scroll functions
    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Load more articles function
    function loadMoreArticles() {
        const loadMoreBtn = this;
        const articlesGrid = document.querySelector('.articles-grid');
        
        // Show loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال بارگذاری...';
        loadMoreBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Create new articles (in a real app, this would come from an API)
            const newArticles = [
                {
                    image: '/assets/img/blog/article7.jpg',
                    badge: 'بررسی تخصصی',
                    category: 'hardware',
                    categoryText: 'سخت‌افزار',
                    date: '۳ هفته پیش',
                    title: 'مقایسه خنک‌کننده‌های مایع Corsair و NZXT',
                    excerpt: 'بررسی عملکرد و قیمت بهترین خنک‌کننده‌های مایع بازار',
                    author: '/assets/img/authors/author5.jpg',
                    authorName: 'فاطمه نوری',
                    views: '۱,۲۳۴',
                    comments: '۴۵'
                },
                {
                    image: '/assets/img/blog/article8.jpg',
                    badge: 'اخبار',
                    category: 'gaming',
                    categoryText: 'گیمینگ',
                    date: '۱ ماه پیش',
                    title: 'بررسی بازی Cyberpunk 2077: Ultimate Edition',
                    excerpt: 'آیا پس از آپدیت‌های متعدد، این بازی به وعده‌های خود عمل کرده است؟',
                    author: '/assets/img/authors/author1.jpg',
                    authorName: 'علیرضا محمدی',
                    views: '۸,۷۶۵',
                    comments: '۲۳۴'
                }
            ];
            
            // Add new articles to grid
            newArticles.forEach(article => {
                const articleElement = createArticleElement(article);
                articlesGrid.appendChild(articleElement);
            });
            
            // Reset button
            loadMoreBtn.innerHTML = '<i class="fas fa-redo"></i> بارگذاری مقالات بیشتر';
            loadMoreBtn.disabled = false;
            
            // Show notification
            showNotification('مقالات جدید با موفقیت بارگذاری شدند', 'success');
            
        }, 1500);
    }
    
    // Create article element
    function createArticleElement(article) {
        const articleEl = document.createElement('article');
        articleEl.className = 'article-card';
        articleEl.innerHTML = `
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
                <div class="article-badge">${article.badge}</div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="category ${article.category}">${article.categoryText}</span>
                    <span class="date"><i class="far fa-clock"></i> ${article.date}</span>
                </div>
                <h3 class="article-title">
                    <a href="/blog/article-slug">${article.title}</a>
                </h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-footer">
                    <div class="author">
                        <img src="${article.author}" alt="${article.authorName}" class="author-avatar">
                        <span class="author-name">${article.authorName}</span>
                    </div>
                    <div class="article-stats">
                        <span class="stat"><i class="far fa-eye"></i> ${article.views}</span>
                        <span class="stat"><i class="far fa-comment"></i> ${article.comments}</span>
                    </div>
                </div>
            </div>
        `;
        
        return articleEl;
    }
    
    // Sort articles function
    function sortArticles() {
        const sortValue = this.value;
        const articlesGrid = document.querySelector('.articles-grid');
        const articles = Array.from(articlesGrid.querySelectorAll('.article-card'));
        
        // Show loading state
        articlesGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            // Sort articles based on selection
            articles.sort((a, b) => {
                if (sortValue === 'newest') {
                    return 0; // Already in order
                } else if (sortValue === 'popular') {
                    const viewsA = parseInt(a.querySelector('.stat:first-child').textContent.replace(/,/g, ''));
                    const viewsB = parseInt(b.querySelector('.stat:first-child').textContent.replace(/,/g, ''));
                    return viewsB - viewsA;
                } else if (sortValue === 'commented') {
                    const commentsA = parseInt(a.querySelector('.stat:last-child').textContent.replace(/,/g, ''));
                    const commentsB = parseInt(b.querySelector('.stat:last-child').textContent.replace(/,/g, ''));
                    return commentsB - commentsA;
                }
                return 0;
            });
            
            // Clear and re-append sorted articles
            articlesGrid.innerHTML = '';
            articles.forEach(article => {
                articlesGrid.appendChild(article);
            });
            
            // Restore opacity
            articlesGrid.style.opacity = '1';
            
            // Show notification
            showNotification(`مقالات بر اساس ${this.options[this.selectedIndex].text} مرتب شدند`, 'info');
            
        }, 500);
    }
    
    // Newsletter form handler
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Simple email validation
        if (!email || !isValidEmail(email)) {
            showNotification('لطفاً یک ایمیل معتبر وارد کنید', 'error');
            emailInput.focus();
            return;
        }
        
        // Simulate subscription
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ثبت...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
            
            showNotification('عضویت در خبرنامه با موفقیت انجام شد!', 'success');
        }, 1500);
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.article-card, .featured-article, .sidebar-widget, .stat-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Reading progress (for article pages)
    function initReadingProgress() {
        // This would be implemented on individual article pages
    }
    
    // Article interactions (likes, bookmarks, etc.)
    function initArticleInteractions() {
        // Add click listeners to article cards for analytics
        const articleLinks = document.querySelectorAll('.article-title a, .popular-content h4 a');
        articleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // In a real app, you would track this click
                console.log('Article clicked:', this.getAttribute('href'));
            });
        });
    }
    
    // Notification system
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
                    border-left: 4px solid var(--blog-accent);
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
    
    // Initialize theme on load
    initTheme();
    
    // Add some sample interactions for demo
    console.log('AquaMag blog initialized successfully!');
    
    // Simulate some popular article views updates
    setTimeout(() => {
        const popularArticles = document.querySelectorAll('.popular-article');
        popularArticles.forEach((article, index) => {
            const viewsElement = article.querySelector('.views');
            if (viewsElement) {
                const currentViews = parseInt(viewsElement.textContent.replace(/[^0-9]/g, ''));
                const newViews = currentViews + Math.floor(Math.random() * 100) + 50;
                viewsElement.textContent = newViews.toLocaleString() + ' بازدید';
            }
        });
    }, 3000);
});