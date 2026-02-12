/**
 * LA VAGUE - Shared Page JavaScript (FAQ, Shipping, Contact, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // STATE
    // ==========================================
    const state = {
        cart: JSON.parse(localStorage.getItem('cart')) || []
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const elements = {
        nav: document.getElementById('nav'),
        cartCount: document.getElementById('cartCount'),
        cartOverlay: document.getElementById('cartOverlay'),
        cartSidebar: document.getElementById('cartSidebar'),
        cartClose: document.getElementById('cartClose'),
        cartItems: document.getElementById('cartItems'),
        cartSubtotal: document.getElementById('cartSubtotal'),
        cartBtn: document.getElementById('cartBtn'),
        searchOverlay: document.getElementById('searchOverlay'),
        searchBtn: document.getElementById('searchBtn'),
        searchClose: document.getElementById('searchClose'),
        searchInput: document.getElementById('searchInput'),
        searchResults: document.getElementById('searchResults'),
        faqItems: document.querySelectorAll('.faq-item'),
        toastContainer: document.getElementById('toastContainer')
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        updateCartCount();
        bindEvents();
        initFAQ();
        
        // Nav scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.nav?.classList.add('scrolled');
            } else {
                elements.nav?.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ==========================================
    // CART
    // ==========================================
    function renderCart() {
        if (state.cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-secondary" onclick="window.closeCart()">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        elements.cartItems.innerHTML = state.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-variant">${item.color} / ${item.size}</p>
                    <div class="cart-item-actions">
                        <div class="cart-item-qty">
                            <button onclick="window.updateCartQty(${index}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="window.updateCartQty(${index}, 1)">+</button>
                        </div>
                        <span class="cart-item-price">$${item.price * item.quantity}</span>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="window.removeFromCart(${index})">×</button>
            </div>
        `).join('');
        
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.cartSubtotal.textContent = `$${subtotal}`;
    }

    function openCart() {
        renderCart();
        elements.cartSidebar.classList.add('active');
        elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closeCart = function() {
        elements.cartSidebar.classList.remove('active');
        elements.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.updateCartQty = function(index, delta) {
        const item = state.cart[index];
        const newQty = item.quantity + delta;
        
        if (newQty < 1) {
            state.cart.splice(index, 1);
        } else {
            item.quantity = newQty;
        }
        
        saveCart();
        renderCart();
        updateCartCount();
    };

    window.removeFromCart = function(index) {
        state.cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartCount();
        showToast('Item removed from cart', 'success');
    };

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }

    function updateCartCount() {
        const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = count;
        elements.cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // ==========================================
    // FAQ
    // ==========================================
    function initFAQ() {
        elements.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                elements.faqItems.forEach(i => i.classList.remove('active'));
                
                // Open clicked if wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ==========================================
    // SEARCH
    // ==========================================
    function openSearch() {
        elements.searchOverlay.classList.add('active');
        elements.searchInput?.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
        elements.searchOverlay.classList.remove('active');
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.searchResults) elements.searchResults.innerHTML = '';
        document.body.style.overflow = '';
    }

    function handleSearch(query) {
        if (!query.trim() || !elements.searchResults) {
            if (elements.searchResults) elements.searchResults.innerHTML = '';
            return;
        }
        
        const results = ProductAPI.search(query);
        
        if (results.length === 0) {
            elements.searchResults.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                    No products found for "${query}"
                </div>
            `;
            return;
        }
        
        elements.searchResults.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="window.location.href='product.html?slug=${product.slug}'">
                <img src="${product.images[0].src}" alt="${product.name}">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${CATEGORIES.find(c => c.id === product.category)?.name}</p>
                </div>
                <span class="search-result-price">$${product.price}</span>
            </div>
        `).join('');
    }

    // ==========================================
    // TOAST
    // ==========================================
    function showToast(message, type = 'success') {
        if (!elements.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="toast-message">${message}</span>`;
        
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toast-in 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            const formData = {
                name: `${document.getElementById('firstName')?.value || ''} ${document.getElementById('lastName')?.value || ''}`.trim(),
                email: document.getElementById('email')?.value,
                subject: document.getElementById('subject')?.value,
                message: document.getElementById('message')?.value
            };
            
            // Add order number if provided
            const orderNumber = document.getElementById('orderNumber')?.value;
            if (orderNumber) {
                formData.message = `Order Number: ${orderNumber}\n\n${formData.message}`;
            }
            
            try {
                const API_URL = window.location.hostname === 'localhost' 
                    ? 'http://localhost:3000/api' 
                    : 'https://la-vague-api.onrender.com/api';
                
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showToast('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showToast(result.error || 'Failed to send message', 'error');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                showToast('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // EVENTS
    // ==========================================
    function bindEvents() {
        // Cart
        elements.cartBtn?.addEventListener('click', openCart);
        elements.cartClose?.addEventListener('click', window.closeCart);
        elements.cartOverlay?.addEventListener('click', window.closeCart);
        
        // Search
        elements.searchBtn?.addEventListener('click', openSearch);
        elements.searchClose?.addEventListener('click', closeSearch);
        
        let searchTimeout;
        elements.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
        });
        
        // Contact form
        initContactForm();
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                window.closeCart();
            }
            
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });
    }

    // Start
    init();
});
