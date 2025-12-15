// Product Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail Gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newImageSrc = this.getAttribute('data-image');
            mainImage.src = newImageSrc;
            mainImage.alt = this.querySelector('img').alt;
            
            // Add animation to main image
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        });
    });
    
    // Quantity Selector
    const quantityInput = document.querySelector('.quantity');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    
    if (decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                animateQuantityChange();
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
            animateQuantityChange();
        });
    }
    
    function animateQuantityChange() {
        quantityInput.style.transform = 'scale(1.1)';
        setTimeout(() => {
            quantityInput.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Tabs Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Like Button
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
                
                // Add animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
            }
        });
    }
    
    // Like buttons in related products
    const relatedLikeButtons = document.querySelectorAll('.related-products .like-btn');
    relatedLikeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('به علاقه‌مندی‌ها اضافه شد', 'success');
                
                // Add animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('از علاقه‌مندی‌ها حذف شد', 'info');
            }
        });
    });
    
    // Add to cart buttons in related products
    const relatedAddToCartButtons = document.querySelectorAll('.related-products .add-to-cart');
    relatedAddToCartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            showNotification(`${productTitle} به سبد خرید اضافه شد`, 'success');
            
            // Add animation to button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Countdown Timer
    function updateTimer() {
        const timerElement = document.querySelector('.timer-text');
        if (!timerElement) return;
        
        let time = timerElement.textContent.split(':');
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        let seconds = parseInt(time[2]);
        
        if (seconds > 0) {
            seconds--;
        } else {
            if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // Timer expired
                    timerElement.textContent = 'منقضی شده';
                    timerElement.parentElement.style.color = '#ff4757';
                    return;
                }
            }
        }
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update timer every second
    setInterval(updateTimer, 1000);
    
    // Notification function
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
    
    // Initialize animations for elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .section-title');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    // کد اضطراری برای نمایش دکمه‌ها
document.addEventListener('DOMContentLoaded', function() {
    // ایجاد دکمه‌ها به صورت پویا اگر وجود ندارند
    if (!document.querySelector('.product-actions')) {
        const productInfo = document.querySelector('.product-info');
        const productPrice = document.querySelector('.product-price');
        
        if (productInfo && productPrice) {
            const actionsHTML = `
                <div class="product-actions" style="display: flex; gap: 15px; margin: 25px 0; flex-wrap: wrap;">
                    <button class="btn btn-primary add-to-cart" data-product="1" 
                            style="background: #00cfcf; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-cart-plus"></i>
                        افزودن به سبد خرید
                    </button>
                    <button class="btn btn-outline like-btn"
                            style="background: transparent; color: #00cfcf; padding: 12px 24px; border: 2px solid #00cfcf; border-radius: 8px; cursor: pointer;">
                        <i class="far fa-heart"></i>
                        افزودن به علاقه‌مندی‌ها
                    </button>
                </div>
            `;
            
            productPrice.insertAdjacentHTML('afterend', actionsHTML);
        }
    }
    
    // مطمئن شوید دکمه‌ها قابل مشاهده هستند
    setTimeout(() => {
        const buttons = document.querySelectorAll('.product-actions, .btn');
        buttons.forEach(btn => {
            btn.style.display = 'flex';
            btn.style.visibility = 'visible';
            btn.style.opacity = '1';
        });
    }, 100);
});
});
