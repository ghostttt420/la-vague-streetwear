/**
 * LA VAGUE - Checkout Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // STATE
    // ==========================================
    const state = {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        shipping: 10,
        discount: 0,
        discountCode: null
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const elements = {
        nav: document.getElementById('nav'),
        summaryItems: document.getElementById('summaryItems'),
        summarySubtotal: document.getElementById('summarySubtotal'),
        summaryShipping: document.getElementById('summaryShipping'),
        summaryDiscount: document.getElementById('summaryDiscount'),
        summaryTotal: document.getElementById('summaryTotal'),
        discountLine: document.getElementById('discountLine'),
        discountCode: document.getElementById('discountCode'),
        applyDiscount: document.getElementById('applyDiscount'),
        shippingOptions: document.querySelectorAll('input[name="shipping"]'),
        placeOrderBtn: document.getElementById('placeOrderBtn'),
        cardNumber: document.getElementById('cardNumber'),
        expiry: document.getElementById('expiry'),
        toastContainer: document.getElementById('toastContainer')
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        if (state.cart.length === 0) {
            window.location.href = 'shop.html';
            return;
        }
        
        renderOrderSummary();
        updateTotals();
        bindEvents();
        
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
    // ORDER SUMMARY
    // ==========================================
    function renderOrderSummary() {
        elements.summaryItems.innerHTML = state.cart.map(item => `
            <div class="summary-item">
                <div class="summary-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="summary-item-qty">${item.quantity}</span>
                </div>
                <div class="summary-item-details">
                    <p class="summary-item-name">${item.name}</p>
                    <p class="summary-item-variant">${item.color} / ${item.size}</p>
                </div>
                <span class="summary-item-price">$${item.price * item.quantity}</span>
            </div>
        `).join('');
    }

    function updateTotals() {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + state.shipping - state.discount;
        
        elements.summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        elements.summaryShipping.textContent = `$${state.shipping.toFixed(2)}`;
        elements.summaryTotal.textContent = `$${total.toFixed(2)}`;
        
        if (state.discount > 0) {
            elements.summaryDiscount.textContent = `-$${state.discount.toFixed(2)}`;
            elements.discountLine.style.display = 'flex';
        } else {
            elements.discountLine.style.display = 'none';
        }
        
        // Free shipping threshold
        if (subtotal >= 150) {
            state.shipping = 0;
            elements.summaryShipping.textContent = 'FREE';
            document.getElementById('standardShipping').textContent = 'FREE';
        }
    }

    // ==========================================
    // DISCOUNT CODE
    // ==========================================
    function applyDiscountCode() {
        const code = elements.discountCode.value.trim().toUpperCase();
        
        if (!code) {
            showToast('Please enter a discount code', 'error');
            return;
        }
        
        // Mock discount codes
        const codes = {
            'WELCOME10': 10,
            'WAVE20': 20,
            'FREESHIP': 0 // Special handling for free shipping
        };
        
        if (codes[code] !== undefined) {
            if (code === 'FREESHIP') {
                state.shipping = 0;
                state.discount = 0;
                showToast('Free shipping applied!', 'success');
            } else {
                const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                state.discount = (subtotal * codes[code]) / 100;
                showToast(`${codes[code]}% discount applied!`, 'success');
            }
            
            state.discountCode = code;
            updateTotals();
            elements.discountCode.value = '';
        } else {
            showToast('Invalid discount code', 'error');
        }
    }

    // ==========================================
    // FORM HANDLING
    // ==========================================
    function formatCardNumber(value) {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    function formatExpiry(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1 / $2').trim();
    }

    function handlePlaceOrder(e) {
        e.preventDefault();
        
        // Basic validation
        const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone', 'cardNumber', 'expiry', 'cvv', 'cardName'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                isValid = false;
                input?.classList.add('error');
            } else {
                input?.classList.remove('error');
            }
        });
        
        if (!isValid) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate order processing
        elements.placeOrderBtn.textContent = 'Processing...';
        elements.placeOrderBtn.disabled = true;
        
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success and redirect
            showToast('Order placed successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'order-confirmation.html';
            }, 1500);
        }, 2000);
    }

    // ==========================================
    // TOAST
    // ==========================================
    function showToast(message, type = 'success') {
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
    // EVENTS
    // ==========================================
    function bindEvents() {
        // Shipping option change
        elements.shippingOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                state.shipping = e.target.value === 'express' ? 25 : (state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) >= 150 ? 0 : 10);
                updateTotals();
            });
        });
        
        // Discount code
        elements.applyDiscount?.addEventListener('click', applyDiscountCode);
        elements.discountCode?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyDiscountCode();
        });
        
        // Card formatting
        elements.cardNumber?.addEventListener('input', (e) => {
            e.target.value = formatCardNumber(e.target.value);
        });
        
        elements.expiry?.addEventListener('input', (e) => {
            e.target.value = formatExpiry(e.target.value);
        });
        
        // Place order
        elements.placeOrderBtn?.addEventListener('click', handlePlaceOrder);
    }

    // Start
    init();
});
