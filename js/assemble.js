// AquaMarket Assemble Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Global Variables
    let currentStep = 1;
    let selectedPurpose = '';
    let selectedComponents = {
        cpu: {
            id: 'cpu-1',
            name: 'Intel Core i9-14900K',
            price: 24500000,
            specs: '24 هسته (8P+16E) - فرکانس تا 6.0GHz',
            image: '/assets/img/components/cpu-intel.jpg'
        },
        motherboard: null,
        gpu: null,
        ram: null,
        storage: null,
        psu: null,
        case: null
    };
    
    // DOM Elements
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const purposeCards = document.querySelectorAll('.purpose-card');
    const componentCards = document.querySelectorAll('.component-card');
    const changeButtons = document.querySelectorAll('.change-component');
    const componentModal = document.getElementById('component-modal');
    const componentOverlay = document.getElementById('component-overlay');
    const closeModal = document.querySelector('.close-modal');
    const componentsList = document.querySelector('.components-list');
    const restartButton = document.querySelector('.restart-wizard');
    
    // Initialize the assemble tool
    initAssembleTool();
    
    function initAssembleTool() {
        // Initialize event listeners
        setupEventListeners();
        
        // Initialize component selections
        updateSystemSummary();
        
        // Initialize performance preview
        updatePerformancePreview();
    }
    
    function setupEventListeners() {
        // Step navigation
        nextButtons.forEach(btn => {
            btn.addEventListener('click', goToNextStep);
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', goToPrevStep);
        });
        
        // Step indicators
        stepIndicators.forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.getAttribute('data-step'));
                if (stepNumber < currentStep) {
                    goToStep(stepNumber);
                }
            });
        });
        
        // Purpose selection
        purposeCards.forEach(card => {
            card.addEventListener('click', function() {
                selectPurpose(this.getAttribute('data-purpose'));
            });
        });
        
        // Component selection modal
        changeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const componentCard = this.closest('.component-card');
                const componentType = componentCard.getAttribute('data-component');
                openComponentModal(componentType);
            });
        });
        
        // Modal controls
        closeModal.addEventListener('click', closeComponentModal);
        componentOverlay.addEventListener('click', closeComponentModal);
        
        // Restart wizard
        if (restartButton) {
            restartButton.addEventListener('click', restartWizard);
        }
        
        // Component selection in modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-component')) {
                const componentItem = e.target.closest('.component-item');
                selectComponent(componentItem);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && componentModal.classList.contains('active')) {
                closeComponentModal();
            }
        });
        
        // Filter changes
        const brandFilter = document.getElementById('brand-filter');
        const priceFilter = document.getElementById('price-filter');
        
        if (brandFilter) {
            brandFilter.addEventListener('change', filterComponents);
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', filterComponents);
        }
    }
    
    // Step Navigation Functions
    function goToNextStep() {
        const nextStep = parseInt(this.getAttribute('data-next'));
        
        // Validate current step before proceeding
        if (validateStep(currentStep)) {
            goToStep(nextStep);
        }
    }
    
    function goToPrevStep() {
        const prevStep = parseInt(this.getAttribute('data-prev'));
        goToStep(prevStep);
    }
    
    function goToStep(stepNumber) {
        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show new step
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
        
        // Update current step
        currentStep = stepNumber;
        
        // Special actions for specific steps
        if (stepNumber === 3) {
            updateFinalReview();
        } else if (stepNumber === 4) {
            calculateFinalResults();
        }
    }
    
    function validateStep(step) {
        switch (step) {
            case 1:
                if (!selectedPurpose) {
                    showNotification('لطفاً هدف سیستم خود را انتخاب کنید', 'error');
                    return false;
                }
                return true;
                
            case 2:
                const selectedCount = Object.values(selectedComponents).filter(comp => comp !== null).length;
                if (selectedCount < 3) {
                    showNotification('لطفاً حداقل ۳ قطعه اصلی را انتخاب کنید', 'error');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    // Purpose Selection
    function selectPurpose(purpose) {
        selectedPurpose = purpose;
        
        // Update UI
        purposeCards.forEach(card => {
            card.classList.remove('active');
        });
        
        document.querySelector(`.purpose-card[data-purpose="${purpose}"]`).classList.add('active');
        
        // Update component recommendations based on purpose
        updateComponentRecommendations(purpose);
        
        showNotification(`هدف سیستم "${getPurposeName(purpose)}" انتخاب شد`, 'success');
    }
    
    function getPurposeName(purpose) {
        const purposes = {
            'gaming': 'گیمینگ حرفه‌ای',
            'streaming': 'استریم و محتوا',
            'workstation': 'ایستگاه کاری',
            'office': 'اداری و مطالعه'
        };
        return purposes[purpose] || purpose;
    }
    
    function updateComponentRecommendations(purpose) {
        // In a real app, this would fetch recommendations from an API
        console.log(`Updating recommendations for: ${purpose}`);
    }
    
    // Component Selection Modal
    function openComponentModal(componentType) {
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = `انتخاب ${getComponentName(componentType)}`;
        
        // Load components for this type
        loadComponents(componentType);
        
        // Show modal
        componentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeComponentModal() {
        componentModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function getComponentName(type) {
        const names = {
            'cpu': 'پردازنده',
            'motherboard': 'مادربرد',
            'gpu': 'کارت گرافیک',
            'ram': 'حافظه رم',
            'storage': 'ذخیره‌سازی',
            'psu': 'منبع تغذیه',
            'case': 'کیس'
        };
        return names[type] || type;
    }
    
    function loadComponents(componentType) {
        // In a real app, this would fetch from an API
        // For demo, we'll use sample data
        
        const components = getSampleComponents(componentType);
        const currentComponent = selectedComponents[componentType];
        
        componentsList.innerHTML = '';
        
        components.forEach(component => {
            const isSelected = currentComponent && currentComponent.id === component.id;
            
            const componentElement = document.createElement('div');
            componentElement.className = `component-item ${isSelected ? 'selected' : ''}`;
            componentElement.innerHTML = `
                <div class="component-image">
                    <img src="${component.image}" alt="${component.name}">
                </div>
                <div class="component-details">
                    <h4>${component.name}</h4>
                    <p>${component.specs}</p>
                    <div class="component-specs">
                        ${component.extraSpecs.map(spec => `<span class="spec">${spec}</span>`).join('')}
                    </div>
                </div>
                <div class="component-actions">
                    <span class="component-price">${component.price.toLocaleString()} تومان</span>
                    <button class="btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm select-component">
                        ${isSelected ? 'انتخاب شده' : 'انتخاب'}
                    </button>
                </div>
            `;
            
            componentElement.setAttribute('data-component-id', component.id);
            componentElement.setAttribute('data-component-type', componentType);
            
            componentsList.appendChild(componentElement);
        });
    }
    
    function getSampleComponents(type) {
        const components = {
            cpu: [
                {
                    id: 'cpu-1',
                    name: 'Intel Core i9-14900K',
                    specs: '24 هسته (8P+16E) - فرکانس تا 6.0GHz - کش 36MB',
                    price: 24500000,
                    image: '/assets/img/components/cpu-intel.jpg',
                    extraSpecs: ['سوکت: LGA 1700', 'TDP: 125W']
                },
                {
                    id: 'cpu-2',
                    name: 'AMD Ryzen 9 7950X',
                    specs: '16 هسته - 32 رشته - فرکانس تا 5.7GHz - کش 80MB',
                    price: 22800000,
                    image: '/assets/img/components/cpu-amd.jpg',
                    extraSpecs: ['سوکت: AM5', 'TDP: 170W']
                },
                {
                    id: 'cpu-3',
                    name: 'Intel Core i7-14700K',
                    specs: '20 هسته (8P+12E) - فرکانس تا 5.6GHz - کش 33MB',
                    price: 18500000,
                    image: '/assets/img/components/cpu-intel-2.jpg',
                    extraSpecs: ['سوکت: LGA 1700', 'TDP: 125W']
                }
            ],
            motherboard: [
                {
                    id: 'mb-1',
                    name: 'ASUS ROG Maximus Z790 Hero',
                    specs: 'Intel Z790 - 4x DDR5 - PCIe 5.0',
                    price: 18700000,
                    image: '/assets/img/components/motherboard-asus.jpg',
                    extraSpecs: ['سوکت: LGA 1700', 'فرمت: ATX']
                },
                {
                    id: 'mb-2',
                    name: 'GIGABYTE X670E AORUS Master',
                    specs: 'AMD X670 - 4x DDR5 - PCIe 5.0',
                    price: 16500000,
                    image: '/assets/img/components/motherboard-gigabyte.jpg',
                    extraSpecs: ['سوکت: AM5', 'فرمت: ATX']
                }
            ],
            gpu: [
                {
                    id: 'gpu-1',
                    name: 'NVIDIA GeForce RTX 4090',
                    specs: '24GB GDDR6X - 16384 CUDA Cores',
                    price: 68500000,
                    image: '/assets/img/components/gpu-nvidia.jpg',
                    extraSpecs: ['PCIe 4.0', 'TDP: 450W']
                },
                {
                    id: 'gpu-2',
                    name: 'AMD Radeon RX 7900 XTX',
                    specs: '24GB GDDR6 - 6144 Stream Processors',
                    price: 42500000,
                    image: '/assets/img/components/gpu-amd.jpg',
                    extraSpecs: ['PCIe 4.0', 'TDP: 355W']
                }
            ]
        };
        
        return components[type] || [];
    }
    
    function selectComponent(componentItem) {
        const componentId = componentItem.getAttribute('data-component-id');
        const componentType = componentItem.getAttribute('data-component-type');
        
        // Get component data (in real app, this would come from API)
        const component = getComponentById(componentType, componentId);
        
        if (component) {
            selectedComponents[componentType] = component;
            
            // Update UI
            updateComponentCard(componentType, component);
            updateSystemSummary();
            updatePerformancePreview();
            checkCompatibility();
            
            closeComponentModal();
            
            showNotification(`${getComponentName(componentType)} با موفقیت انتخاب شد`, 'success');
        }
    }
    
    function getComponentById(type, id) {
        const components = getSampleComponents(type);
        return components.find(comp => comp.id === id);
    }
    
    function updateComponentCard(componentType, component) {
        const componentCard = document.querySelector(`.component-card[data-component="${componentType}"]`);
        
        if (componentCard) {
            // Update status
            const statusElement = componentCard.querySelector('.component-status');
            statusElement.textContent = 'انتخاب شده';
            statusElement.className = 'component-status selected';
            
            // Update preview
            const previewElement = componentCard.querySelector('.component-preview');
            previewElement.className = 'component-preview';
            previewElement.innerHTML = `
                <img src="${component.image}" alt="${component.name}">
                <div class="component-info">
                    <h4>${component.name}</h4>
                    <p>${component.specs}</p>
                    <span class="component-price">${component.price.toLocaleString()} تومان</span>
                </div>
            `;
            
            // Update card appearance
            componentCard.classList.add('active');
        }
    }
    
    // System Summary and Calculations
    function updateSystemSummary() {
        const totalPrice = calculateTotalPrice();
        const selectedCount = Object.values(selectedComponents).filter(comp => comp !== null).length;
        
        // Update summary items
        document.querySelector('.summary-item .item-value:first-child').textContent = 
            `${totalPrice.toLocaleString()} تومان`;
        
        document.querySelector('.summary-item .item-value:nth-child(2)').textContent = 
            `${selectedCount} از ۷`;
    }
    
    function calculateTotalPrice() {
        return Object.values(selectedComponents).reduce((total, component) => {
            return total + (component ? component.price : 0);
        }, 0);
    }
    
    function updatePerformancePreview() {
        // Calculate performance scores based on selected components
        const gamingScore = calculateGamingPerformance();
        const renderingScore = calculateRenderingPerformance();
        const dailyScore = calculateDailyPerformance();
        
        // Update progress bars
        updateProgressBar('.performance-bar:nth-child(1) .bar-fill', gamingScore);
        updateProgressBar('.performance-bar:nth-child(2) .bar-fill', renderingScore);
        updateProgressBar('.performance-bar:nth-child(3) .bar-fill', dailyScore);
        
        // Update scores
        document.querySelector('.performance-bar:nth-child(1) .bar-score').textContent = `${gamingScore}%`;
        document.querySelector('.performance-bar:nth-child(2) .bar-score').textContent = `${renderingScore}%`;
        document.querySelector('.performance-bar:nth-child(3) .bar-score').textContent = `${dailyScore}%`;
    }
    
    function updateProgressBar(selector, score) {
        const barFill = document.querySelector(selector);
        if (barFill) {
            barFill.style.width = `${score}%`;
            barFill.setAttribute('data-score', score);
        }
    }
    
    function calculateGamingPerformance() {
        // Simplified calculation based on components
        let score = 50; // Base score
        
        if (selectedComponents.gpu) {
            score += 30;
        }
        
        if (selectedComponents.cpu) {
            score += 15;
        }
        
        if (selectedComponents.ram) {
            score += 5;
        }
        
        return Math.min(score, 100);
    }
    
    function calculateRenderingPerformance() {
        let score = 40; // Base score
        
        if (selectedComponents.cpu) {
            score += 35;
        }
        
        if (selectedComponents.gpu) {
            score += 20;
        }
        
        if (selectedComponents.ram) {
            score += 5;
        }
        
        return Math.min(score, 100);
    }
    
    function calculateDailyPerformance() {
        let score = 70; // Base score
        
        if (selectedComponents.cpu) {
            score += 15;
        }
        
        if (selectedComponents.storage) {
            score += 10;
        }
        
        if (selectedComponents.ram) {
            score += 5;
        }
        
        return Math.min(score, 100);
    }
    
    function checkCompatibility() {
        // Basic compatibility checks
        const alertsContainer = document.querySelector('.compatibility-alerts');
        let alerts = [];
        
        // Check CPU and Motherboard compatibility
        if (selectedComponents.cpu && selectedComponents.motherboard) {
            const cpuSocket = 'LGA 1700'; // This would come from component data
            const mbSocket = 'LGA 1700'; // This would come from component data
            
            if (cpuSocket !== mbSocket) {
                alerts.push({
                    type: 'error',
                    message: 'سوکت پردازنده و مادربرد سازگار نیستند'
                });
            }
        }
        
        // Check PSU wattage
        if (selectedComponents.psu) {
            const totalPower = calculatePowerConsumption();
            const psuWattage = 850; // This would come from component data
            
            if (totalPower > psuWattage * 0.8) {
                alerts.push({
                    type: 'warning',
                    message: 'منبع تغذیه ممکن است برای این سیستم کافی نباشد'
                });
            }
        }
        
        // Update alerts UI
        if (alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i>
                    <span>همه قطعات با هم سازگار هستند</span>
                </div>
            `;
            
            document.querySelector('.compatibility-high').textContent = 'عالی';
        } else {
            // Show compatibility alerts
            alertsContainer.innerHTML = alerts.map(alert => `
                <div class="alert alert-${alert.type}">
                    <i class="fas fa-${alert.type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                    <span>${alert.message}</span>
                </div>
            `).join('');
            
            document.querySelector('.compatibility-high').textContent = 'نیاز به بررسی';
        }
    }
    
    function calculatePowerConsumption() {
        // Simplified power calculation
        let power = 0;
        
        if (selectedComponents.cpu) power += 150;
        if (selectedComponents.gpu) power += 300;
        if (selectedComponents.ram) power += 30;
        if (selectedComponents.storage) power += 20;
        
        return power;
    }
    
    function updateFinalReview() {
        // Update system specs in final review
        const specsGrid = document.querySelector('.specs-grid');
        
        if (specsGrid) {
            specsGrid.innerHTML = Object.entries(selectedComponents).map(([type, component]) => `
                <div class="spec-item">
                    <span class="spec-label">${getComponentName(type)}:</span>
                    <span class="spec-value">${component ? component.name : 'در حال انتخاب...'}</span>
                </div>
            `).join('');
        }
        
        // Animate performance bars
        setTimeout(() => {
            const performanceBars = document.querySelectorAll('.bar-fill');
            performanceBars.forEach(bar => {
                const score = bar.getAttribute('data-score');
                bar.style.width = `${score}%`;
            });
        }, 500);
    }
    
    function calculateFinalResults() {
        const overallScore = calculateOverallScore();
        
        // Update circle progress
        const circleProgress = document.querySelector('.circle-progress');
        const scoreNumber = document.querySelector('.score-number');
        
        if (circleProgress && scoreNumber) {
            // Animate the score
            let currentScore = 0;
            const targetScore = overallScore;
            const duration = 2000;
            const steps = 60;
            const increment = targetScore / steps;
            
            const timer = setInterval(() => {
                currentScore += increment;
                if (currentScore >= targetScore) {
                    currentScore = targetScore;
                    clearInterval(timer);
                }
                
                scoreNumber.textContent = Math.round(currentScore);
                circleProgress.style.background = 
                    `conic-gradient(var(--assemble-accent) 0% ${currentScore}%, var(--bg-dark) ${currentScore}% 100%)`;
            }, duration / steps);
        }
        
        // Update breakdown scores based on purpose
        updateBreakdownScores();
    }
    
    function calculateOverallScore() {
        // Calculate weighted score based on purpose and components
        const gamingScore = calculateGamingPerformance();
        const renderingScore = calculateRenderingPerformance();
        const dailyScore = calculateDailyPerformance();
        
        let weights = { gaming: 0.33, rendering: 0.33, daily: 0.34 };
        
        // Adjust weights based on purpose
        if (selectedPurpose === 'gaming') {
            weights = { gaming: 0.6, rendering: 0.2, daily: 0.2 };
        } else if (selectedPurpose === 'streaming') {
            weights = { gaming: 0.4, rendering: 0.4, daily: 0.2 };
        } else if (selectedPurpose === 'workstation') {
            weights = { gaming: 0.2, rendering: 0.6, daily: 0.2 };
        } else if (selectedPurpose === 'office') {
            weights = { gaming: 0.1, rendering: 0.2, daily: 0.7 };
        }
        
        return Math.round(
            gamingScore * weights.gaming +
            renderingScore * weights.rendering +
            dailyScore * weights.daily
        );
    }
    
    function updateBreakdownScores() {
        // Update star ratings based on performance
        const gamingStars = calculateStarRating(calculateGamingPerformance());
        const renderingStars = calculateStarRating(calculateRenderingPerformance());
        const dailyStars = calculateStarRating(calculateDailyPerformance());
        
        updateStarRating('.breakdown-item:nth-child(1)', gamingStars);
        updateStarRating('.breakdown-item:nth-child(2)', renderingStars);
        updateStarRating('.breakdown-item:nth-child(3)', dailyStars);
    }
    
    function calculateStarRating(score) {
        // Convert percentage to 5-star rating
        if (score >= 90) return 5;
        if (score >= 80) return 4.5;
        if (score >= 70) return 4;
        if (score >= 60) return 3.5;
        if (score >= 50) return 3;
        if (score >= 40) return 2.5;
        if (score >= 30) return 2;
        if (score >= 20) return 1.5;
        if (score >= 10) return 1;
        return 0.5;
    }
    
    function updateStarRating(selector, stars) {
        const breakdownItem = document.querySelector(selector);
        if (breakdownItem) {
            const starsElement = breakdownItem.querySelector('.breakdown-stars');
            const scoreElement = breakdownItem.querySelector('.breakdown-score');
            
            if (starsElement && scoreElement) {
                starsElement.innerHTML = '';
                
                // Add full stars
                for (let i = 1; i <= Math.floor(stars); i++) {
                    starsElement.innerHTML += '<i class="fas fa-star"></i>';
                }
                
                // Add half star if needed
                if (stars % 1 !== 0) {
                    starsElement.innerHTML += '<i class="fas fa-star-half-alt"></i>';
                }
                
                // Add empty stars
                const emptyStars = 5 - Math.ceil(stars);
                for (let i = 0; i < emptyStars; i++) {
                    starsElement.innerHTML += '<i class="far fa-star"></i>';
                }
                
                scoreElement.textContent = `${stars}/۵`;
            }
        }
    }
    
    function filterComponents() {
        // In a real app, this would filter the components list
        console.log('Filtering components...');
    }
    
    function restartWizard() {
        // Reset all selections
        selectedPurpose = '';
        selectedComponents = {
            cpu: {
                id: 'cpu-1',
                name: 'Intel Core i9-14900K',
                price: 24500000,
                specs: '24 هسته (8P+16E) - فرکانس تا 6.0GHz',
                image: '/assets/img/components/cpu-intel.jpg'
            },
            motherboard: null,
            gpu: null,
            ram: null,
            storage: null,
            psu: null,
            case: null
        };
        
        // Reset UI
        purposeCards.forEach(card => card.classList.remove('active'));
        componentCards.forEach(card => {
            card.classList.remove('active');
            const statusElement = card.querySelector('.component-status');
            if (statusElement) {
                statusElement.textContent = 'انتخاب نشده';
                statusElement.className = 'component-status';
            }
            
            const previewElement = card.querySelector('.component-preview');
            if (previewElement && !card.querySelector('.component-preview.empty')) {
                previewElement.className = 'component-preview empty';
                previewElement.innerHTML = `
                    <i class="fas fa-plus-circle"></i>
                    <p>${getComponentName(card.getAttribute('data-component'))} انتخاب کنید</p>
                `;
            }
        });
        
        // Go back to first step
        goToStep(1);
        
        showNotification('اسمبل هوشمند مجدداً راه‌اندازی شد', 'info');
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
                    border-left: 4px solid var(--assemble-accent);
                }
                
                .notification-error {
                    border-left: 4px solid #ff4757;
                }
                
                .notification-info {
                    border-left: 4px solid #007bff;
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
    
    console.log('Assemble tool initialized successfully!');
});