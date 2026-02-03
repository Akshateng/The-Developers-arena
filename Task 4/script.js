// Main JavaScript for Coffee House Website

// ==================== MOBILE MENU ====================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('nav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !nav.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with slide-up class
document.querySelectorAll('.slide-up').forEach(el => {
    observer.observe(el);
});

// ==================== STATS COUNTER ====================
const statsSection = document.querySelector('.stats');
let statsAnimated = false;

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ==================== TESTIMONIAL SLIDER ====================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }
}

// Auto-rotate testimonials
if (testimonialCards.length > 0) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });
}

// ==================== NEWSLETTER FORM ====================
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        const messageDiv = document.querySelector('.newsletter-message');
        
        // Simulate form submission
        messageDiv.textContent = 'Thank you for subscribing! Check your email for confirmation.';
        messageDiv.classList.add('show', 'success');
        newsletterForm.reset();
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    });
}

// ==================== MENU FILTER ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const menuBoxes = document.querySelectorAll('.menu-box');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        menuBoxes.forEach(box => {
            if (category === 'all' || box.getAttribute('data-category') === category) {
                box.style.display = 'block';
                setTimeout(() => {
                    box.style.opacity = '1';
                    box.style.transform = 'translateY(0)';
                }, 10);
            } else {
                box.style.opacity = '0';
                box.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    box.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ==================== SHOPPING CART ====================
let cart = [];
const cartModal = document.getElementById('cartModal');
const floatingCart = document.getElementById('floatingCart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const closeCart = document.querySelector('.close-cart');

// Add to cart functionality
const addToCartBtns = document.querySelectorAll('.add-to-cart');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.getAttribute('data-item');
        const price = parseInt(btn.getAttribute('data-price'));
        
        addToCart(item, price);
        
        // Visual feedback
        btn.textContent = 'Added!';
        btn.style.background = '#4caf50';
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.background = '';
        }, 1000);
    });
});

function addToCart(item, price) {
    // Check if item already exists
    const existingItem = cart.find(i => i.name === item);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: item, price: price, quantity: 1 });
    }
    
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} x${item.quantity}</div>
                    <div class="cart-item-price">₹${item.price * item.quantity}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
    
    // Show/hide floating cart
    if (totalItems > 0) {
        floatingCart.style.display = 'block';
    } else {
        floatingCart.style.display = 'none';
    }
}

// Open cart modal
if (floatingCart) {
    floatingCart.addEventListener('click', () => {
        cartModal.classList.add('show');
    });
}

// Close cart modal
if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });
}

// Close cart when clicking outside
if (cartModal) {
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
}

// Checkout button
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your order! Total: ₹' + cartTotal.textContent + '\n\nThis is a demo. In a real application, this would process your payment.');
            cart = [];
            updateCart();
            cartModal.classList.remove('show');
        }
    });
}

// ==================== CONTACT FORM VALIDATION ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            const formSuccess = document.getElementById('formSuccess');
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                formSuccess.classList.remove('show');
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('error');
                });
            }, 3000);
        }
    });
}

function validateField(field) {
    const parent = field.parentElement;
    const errorMsg = parent.querySelector('.error-message');
    let isValid = true;
    let message = '';
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    // Phone validation (optional but if filled, should be valid)
    if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
            isValid = false;
            message = 'Please enter a valid 10-digit phone number';
        }
    }
    
    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !field.value) {
        isValid = false;
        message = 'Please select an option';
    }
    
    if (!isValid) {
        parent.classList.add('error');
        if (errorMsg) errorMsg.textContent = message;
    } else {
        parent.classList.remove('error');
        if (errorMsg) errorMsg.textContent = '';
    }
    
    return isValid;
}

// ==================== FAQ ACCORDION ====================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// ==================== BACK TO TOP BUTTON ====================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== SMOOTH SCROLLING ====================
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

// ==================== LAZY LOADING IMAGES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== EASTER EGG - COFFEE EMOJI ANIMATION ====================
const coffeeEmoji = document.querySelector('.coffee-emoji');
if (coffeeEmoji) {
    let clickCount = 0;
    coffeeEmoji.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            coffeeEmoji.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                coffeeEmoji.style.animation = '';
                clickCount = 0;
            }, 1000);
        }
    });
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ==================== CONSOLE MESSAGE ====================
console.log('%c☕ Welcome to Coffee House! ☕', 'color: #d7a86e; font-size: 20px; font-weight: bold;');
console.log('%cEnjoy your visit and have a great day!', 'color: #3e2723; font-size: 14px;');