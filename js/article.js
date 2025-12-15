// Article Page JavaScript - Complete Solution
document.addEventListener('DOMContentLoaded', function() {
    console.log('Article page initialized');
    
    // Initialize all modules
    initMobileMenu();
    initThemeToggle();
    initTableOfContents();
    initCommentSystem();
    initShareButtons();
    initBackToTop();
    initReadingProgress();
    initNewsletterForm();
    initViewCounter();
    initImageLazyLoading();
    initSmoothScrolling();
    initResponsiveTables();
});

// ===== Mobile Menu =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileMenu.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Add animation
            setTimeout(() => {
                mobileMenu.querySelector('.mobile-menu-container').style.transform = 'translateX(0)';
            }, 10);
        });
        
        closeMobileMenu.addEventListener('click', function() {
            closeMobileMenuFunc();
        });
        
        // Close when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenuFunc();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
                closeMobileMenuFunc();
            }
        });
        
        function closeMobileMenuFunc() {
            mobileMenu.querySelector('.mobile-menu-container').style.transform = 'translateX(100%)';
            setTimeout(() => {
                mobileMenu.setAttribute('aria-hidden', 'true');
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

// ===== Theme Toggle =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    function toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcons('light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcons('dark');
        }
    }
    
    function updateThemeIcons(theme) {
        const icons = document.querySelectorAll('.theme-toggle i');
        icons.forEach(icon => {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(savedTheme + '-theme');
    updateThemeIcons(savedTheme);
    
    // Add event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
}

// ===== Table of Contents =====
function initTableOfContents() {
    const tocContainer = document.querySelector('.table-of-contents');
    if (!tocContainer) return;
    
    const tocLinks = tocContainer.querySelectorAll('a[href^="#"]');
    const sections = [];
    
    tocLinks.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        const section = document.getElementById(id);
        if (section) {
            sections.push({ id, element: section, link });
        }
    });
    
    // Add click events
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Update URL without page reload
                history.pushState(null, null, `#${targetId}`);
                
                // Update active link
                updateActiveTocLink(targetId);
            }
        });
    });
    
    // Intersection Observer for highlighting active section
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveTocLink(entry.target.id);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        if (section.element) {
            observer.observe(section.element);
        }
    });
    
    // Mobile TOC toggle
    if (window.innerWidth <= 768) {
        createMobileTocToggle();
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileTocToggle();
        } else {
            removeMobileTocToggle();
        }
    });
}

function updateActiveTocLink(activeId) {
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

function createMobileTocToggle() {
    if (document.querySelector('.toc-toggle')) return;
    
    const tocContainer = document.querySelector('.table-of-contents');
    if (!tocContainer) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toc-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-list"></i> فهرست مطالب';
    
    tocContainer.parentNode.insertBefore(toggleBtn, tocContainer);
    
    toggleBtn.addEventListener('click', function() {
        tocContainer.classList.toggle('mobile-hidden');
        this.classList.toggle('active');
    });
    
    tocContainer.classList.add('mobile-hidden');
}

function removeMobileTocToggle() {
    const toggleBtn = document.querySelector('.toc-toggle');
    const tocContainer = document.querySelector('.table-of-contents');
    
    if (toggleBtn) {
        toggleBtn.remove();
    }
    
    if (tocContainer) {
        tocContainer.classList.remove('mobile-hidden');
    }
}

// ===== Comment System =====
function initCommentSystem() {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const commentText = document.getElementById('comment-text');
    const charCounter = commentForm.querySelector('.char-counter');
    const commentsCount = document.querySelector('.comments-count');
    
    // Character counter
    if (commentText && charCounter) {
        commentText.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length}/1000 کاراکتر`;
            
            if (length > 900) {
                charCounter.style.color = '#ff9800';
            } else if (length > 990) {
                charCounter.style.color = '#f44336';
            } else {
                charCounter.style.color = 'var(--text-secondary)';
            }
            
            // Limit to 1000 characters
            if (length > 1000) {
                this.value = this.value.substring(0, 1000);
            }
        });
        
        // Initialize counter
        commentText.dispatchEvent(new Event('input'));
    }
    
    // Form submission
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('comment-name').value.trim();
        const email = document.getElementById('comment-email').value.trim();
        const text = commentText.value.trim();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Validation
        let isValid = true;
        const errors = [];
        
        if (name.length < 2) {
            isValid = false;
            errors.push('نام باید حداقل ۲ کاراکتر باشد');
            showInputError('comment-name');
        } else {
            removeInputError('comment-name');
        }
        
        if (!isValidEmail(email)) {
            isValid = false;
            errors.push('ایمیل معتبر وارد کنید');
            showInputError('comment-email');
        } else {
            removeInputError('comment-email');
        }
        
        if (text.length < 10) {
            isValid = false;
            errors.push('نظر باید حداقل ۱۰ کاراکتر باشد');
            showInputError('comment-text');
        } else {
            removeInputError('comment-text');
        }
        
        if (isValid) {
            // Simulate API call
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                showNotification('نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.', 'success');
                
                // Reset form
                commentForm.reset();
                if (charCounter) {
                    charCounter.textContent = '0/1000 کاراکتر';
                    charCounter.style.color = 'var(--text-secondary)';
                }
                
                // Update comments count
                if (commentsCount) {
                    const currentCount = parseInt(commentsCount.textContent) || 87;
                    commentsCount.textContent = currentCount + 1;
                }
                
                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        } else {
            showNotification(errors.join('<br>'), 'error');
        }
    });
    
    // Reply functionality
    const replyButtons = document.querySelectorAll('.comment-reply');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const comment = this.closest('.comment');
            const commentAuthor = comment.querySelector('.comment-author').textContent;
            
            // Remove existing reply form
            const existingForm = document.querySelector('.reply-form');
            if (existingForm) {
                existingForm.remove();
            }
            
            // Create reply form
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <div class="form-group">
                    <textarea placeholder="پاسخ به ${commentAuthor}..." rows="3" maxlength="500"></textarea>
                    <div class="char-counter" style="font-size: 0.8rem; margin-top: 0.25rem;">0/500 کاراکتر</div>
                </div>
                <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button type="button" class="cancel-reply btn btn-outline">
                        انصراف
                    </button>
                    <button type="button" class="submit-reply btn btn-primary">
                        ارسال پاسخ
                    </button>
                </div>
            `;
            
            comment.querySelector('.comment-content').appendChild(replyForm);
            
            // Focus on textarea
            const replyTextarea = replyForm.querySelector('textarea');
            replyTextarea.focus();
            
            // Character counter for reply
            const replyCharCounter = replyForm.querySelector('.char-counter');
            replyTextarea.addEventListener('input', function() {
                const length = this.value.length;
                replyCharCounter.textContent = `${length}/500 کاراکتر`;
                
                if (length > 450) {
                    replyCharCounter.style.color = '#ff9800';
                } else if (length > 490) {
                    replyCharCounter.style.color = '#f44336';
                } else {
                    replyCharCounter.style.color = 'var(--text-secondary)';
                }
                
                if (length > 500) {
                    this.value = this.value.substring(0, 500);
                }
            });
            
            // Cancel reply
            replyForm.querySelector('.cancel-reply').addEventListener('click', function() {
                replyForm.remove();
            });
            
            // Submit reply
            replyForm.querySelector('.submit-reply').addEventListener('click', function() {
                const replyText = replyTextarea.value.trim();
                
                if (replyText.length < 5) {
                    showNotification('پاسخ باید حداقل ۵ کاراکتر باشد', 'error');
                    return;
                }
                
                const replyBtn = this;
                const originalText = replyBtn.textContent;
                replyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
                replyBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('پاسخ شما ثبت شد', 'success');
                    replyForm.remove();
                    replyBtn.textContent = originalText;
                    replyBtn.disabled = false;
                }, 1000);
            });
        });
    });
}

// ===== Share Buttons =====
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn:not(.native-share)');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList[1]; // Get platform class
            let shareUrl;
            
            switch(platform) {
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, 'share', 'width=600,height=400');
        });
    });
    
    // Native share API
    if (navigator.share) {
        // Create native share button if not exists
        if (!document.querySelector('.share-btn.native-share')) {
            const nativeShareBtn = document.createElement('button');
            nativeShareBtn.className = 'share-btn native-share';
            nativeShareBtn.innerHTML = '<i class="fas fa-share-alt"></i> اشتراک گذاری';
            
            nativeShareBtn.addEventListener('click', async function() {
                try {
                    await navigator.share({
                        title: document.title,
                        text: 'این مقاله را بخوانید:',
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('اشتراک‌گذاری لغو شد:', err);
                }
            });
            
            const shareContainer = document.querySelector('.share-buttons');
            if (shareContainer) {
                shareContainer.appendChild(nativeShareBtn);
            }
        }
    }
}

// ===== Back to Top =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
            }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Reading Progress =====
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const article = document.querySelector('.article-main');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        const progress = Math.min(100, Math.max(0, 
            (scrollPosition - articleTop + windowHeight) / (articleHeight + windowHeight) * 100
        ));
        
        progressBar.style.width = `${progress}%`;
    });
}

// ===== Newsletter Form =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const submitBtn = this.querySelector('button[type="submit"]');
        
        if (!isValidEmail(email)) {
            showNotification('لطفا یک ایمیل معتبر وارد کنید', 'error');
            emailInput.focus();
            return;
        }
        
        // Simulate API call
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('با تشکر! شما با موفقیت در خبرنامه ثبت شدید.', 'success');
            newsletterForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===== View Counter =====
function initViewCounter() {
    const viewCountElement = document.querySelector('.view-count');
    if (!viewCountElement) return;
    
    // Simulate view count increment
    const currentViews = parseInt(viewCountElement.textContent.replace(/,/g, '')) || 2451;
    const newViews = currentViews + Math.floor(Math.random() * 10) + 1;
    
    // Format number with Persian commas
    viewCountElement.textContent = newViews.toLocaleString('fa-IR');
    
    // Update meta views
    const metaViews = document.querySelector('.article-meta .views');
    if (metaViews) {
        metaViews.innerHTML = `<i class="far fa-eye"></i> ${newViews.toLocaleString('fa-IR')} بازدید`;
    }
}

// ===== Image Lazy Loading =====
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// ===== Smooth Scrolling =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                smoothScrollTo(targetElement);
            }
        });
    });
}

function smoothScrollTo(element) {
    const startPosition = window.pageYOffset;
    const targetPosition = element.getBoundingClientRect().top + startPosition - 100;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ===== Responsive Tables =====
function initResponsiveTables() {
    const tables = document.querySelectorAll('.performance-table, .comparison-table');
    
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.style.overflowX = 'auto';
        wrapper.style.margin = '1rem 0';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

// ===== Helper Functions =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showInputError(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.style.borderColor = '#f44336';
        input.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.2)';
    }
}

function removeInputError(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.transform = 'translateX(-100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(-100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Window Load =====
window.addEventListener('load', function() {
    // Final initialization after everything loads
    setTimeout(() => {
        initViewCounter();
        initImageLazyLoading();
    }, 1000);
    
    // Handle hash on page load
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                smoothScrollTo(targetElement);
                updateActiveTocLink(window.location.hash.substring(1));
            }, 500);
        }
    }
});