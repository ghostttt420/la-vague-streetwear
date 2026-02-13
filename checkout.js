/**
 * LA VAGUE - Checkout Page JavaScript
 */

console.log('=== CHECKOUT.JS LOADED ===');

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== CHECKOUT DOM LOADED ===');
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
        console.log('Cart items:', state.cart.length);
        if (state.cart.length === 0) {
            console.log('Cart is empty, redirecting to shop...');
            window.location.href = 'shop.html';
            return;
        }
        
        console.log('Initializing checkout...');
        
        // Initialize currency selector
        initCurrencySelector();
        
        updateShippingPrices();
        renderOrderSummary();
        updateTotals();
        bindEvents();
        console.log('Checkout initialized successfully');
        
        // Nav scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.nav?.classList.add('scrolled');
            } else {
                elements.nav?.classList.remove('scrolled');
            }
        }, { passive: true });
        
        // Listen for currency changes
        window.addEventListener('currencyChanged', () => {
            updateShippingPrices();
            renderOrderSummary();
            updateTotals();
        });
    }
    
    // ==========================================
    // CURRENCY SELECTOR
    // ==========================================
    function initCurrencySelector() {
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            // Set initial value from localStorage
            const currentCurrency = CurrencyConfig.getCurrentCurrency();
            currencySelect.value = currentCurrency;
            
            // Handle currency change
            currencySelect.addEventListener('change', (e) => {
                CurrencyConfig.setCurrency(e.target.value);
            });
        }
    }
    
    // ==========================================
    // SHIPPING PRICES
    // ==========================================
    function updateShippingPrices() {
        const standardShippingEl = document.getElementById('standardShipping');
        const expressShippingEl = document.getElementById('expressShipping');
        
        if (standardShippingEl) {
            const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (subtotal >= 150) {
                standardShippingEl.textContent = 'FREE';
            } else {
                standardShippingEl.textContent = CurrencyConfig.formatPrice(10);
            }
        }
        
        if (expressShippingEl) {
            expressShippingEl.textContent = CurrencyConfig.formatPrice(25);
        }
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
                <span class="summary-item-price">${CurrencyConfig.formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }

    function updateTotals() {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + state.shipping - state.discount;
        
        elements.summarySubtotal.textContent = CurrencyConfig.formatPrice(subtotal);
        elements.summaryShipping.textContent = state.shipping === 0 ? 'FREE' : CurrencyConfig.formatPrice(state.shipping);
        elements.summaryTotal.textContent = CurrencyConfig.formatPrice(total);
        
        if (state.discount > 0) {
            elements.summaryDiscount.textContent = `-${CurrencyConfig.formatPrice(state.discount)}`;
            elements.discountLine.style.display = 'flex';
        } else {
            elements.discountLine.style.display = 'none';
        }
        
        // Free shipping threshold
        if (subtotal >= 150) {
            state.shipping = 0;
            const freeText = (typeof I18n !== 'undefined') ? I18n.t('checkout.free') : 'FREE';
            elements.summaryShipping.textContent = freeText;
            const standardShippingEl = document.getElementById('standardShipping');
            if (standardShippingEl) standardShippingEl.textContent = freeText;
        } else {
            document.getElementById('standardShipping').textContent = CurrencyConfig.formatPrice(10);
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
    // FORM HANDLING & INPUT MASKING
    // ==========================================
    function formatCardNumber(value) {
        return InputMasks.creditCard(value);
    }

    function formatExpiry(value) {
        return InputMasks.expiryDate(value);
    }

    function formatPhone(value) {
        return InputMasks.phoneNumber(value, 'auto');
    }

    function formatCVV(value) {
        return InputMasks.cvv(value);
    }

    async function handlePlaceOrder(e) {
        e.preventDefault();
        console.log('=== PLACE ORDER CLICKED ===');
        
        // Basic validation
        const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone'];
        let isValid = true;
        const missingFields = [];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            console.log(`Field ${field}:`, input ? (input.value ? 'has value' : 'EMPTY') : 'NOT FOUND');
            if (!input || !input.value.trim()) {
                isValid = false;
                missingFields.push(field);
                input?.classList.add('error');
            } else {
                input?.classList.remove('error');
            }
        });
        
        // Validate email format
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value && !FormValidation.isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate phone
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value && !FormValidation.isValidPhone(phoneInput.value)) {
            isValid = false;
            phoneInput.classList.add('error');
            showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        if (!isValid) {
            console.log('Validation failed, missing:', missingFields);
            showToast('Please fill in all required fields', 'error');
            return;
        }
        console.log('Validation passed');
        
        // Get form data - Match server.js expected format
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const orderData = {
            customerEmail: document.getElementById('email').value,
            customerName: `${firstName} ${lastName}`,
            customerPhone: document.getElementById('phone').value,
            shippingAddress: {
                address: document.getElementById('address').value,
                apartment: document.getElementById('apartment')?.value || '',
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            },
            shippingMethod: document.querySelector('input[name="shipping"]:checked')?.value || 'standard',
            shippingCost: state.shipping,
            subtotal: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            discount: state.discount,
            total: parseFloat(document.getElementById('summaryTotal').textContent.replace('$', '')) || 0,
            items: state.cart,
            paymentMethod: 'manual',
            notes: ''
        };
        
        // Show loading state with spinner
        ButtonState.setLoading(elements.placeOrderBtn, 'Processing Order...', true);
        
        try {
            // Try to send to backend API
            const API_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000/api' 
                : 'https://la-vague-api.onrender.com/api';
            
            console.log('Sending order to API:', API_URL);
            console.log('Order data:', JSON.stringify(orderData, null, 2));
            
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            console.log('API Response status:', response.status);
            
            const result = await response.json();
            console.log('API Result:', result);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${result.error || 'Unknown error'}`);
            }
            
            if (result.success) {
                // Save to localStorage for admin fallback (use format admin.js expects)
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                orders.unshift({
                    id: result.orderId,
                    firstName: firstName,
                    lastName: lastName,
                    email: orderData.customerEmail,
                    phone: orderData.customerPhone,
                    address: orderData.shippingAddress.address,
                    apartment: orderData.shippingAddress.apartment,
                    city: orderData.shippingAddress.city,
                    state: orderData.shippingAddress.state,
                    zip: orderData.shippingAddress.zip,
                    shippingCost: orderData.shippingCost,
                    subtotal: orderData.subtotal,
                    discount: orderData.discount,
                    total: orderData.total,
                    items: orderData.items,
                    status: 'pending',
                    date: new Date().toISOString(),
                    created_at: new Date().toISOString()
                });
                localStorage.setItem('orders', JSON.stringify(orders));
                console.log('Order saved to localStorage:', result.orderId);
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Show success state
                ButtonState.setSuccess(elements.placeOrderBtn, 'Order Placed!', 2000);
                
                setTimeout(() => {
                    window.location.href = `order-confirmation.html?order=${result.orderId}`;
                }, 1500);
            } else {
                throw new Error(result.error || 'Order failed');
            }
        } catch (error) {
            console.error('Order API error:', error);
            console.error('Error stack:', error.stack);
            
            // Show error state on button
            ButtonState.setError(elements.placeOrderBtn, 'Try Again', 3000);
            
            // Show detailed error to user
            const errorDetails = `API Error: ${error.message}\n\nPlease check the browser console (F12) for more details.\n\nThe order will be saved locally but will NOT appear in the admin panel until the API connection is fixed.`;
            alert(errorDetails);
            
            // Fallback: Save order locally (use format admin.js expects)
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const fallbackOrder = {
                id: 'LV-' + Date.now().toString(36).toUpperCase(),
                firstName: firstName,
                lastName: lastName,
                email: orderData.customerEmail,
                phone: orderData.customerPhone,
                address: orderData.shippingAddress.address,
                apartment: orderData.shippingAddress.apartment,
                city: orderData.shippingAddress.city,
                state: orderData.shippingAddress.state,
                zip: orderData.shippingAddress.zip,
                shippingCost: orderData.shippingCost,
                subtotal: orderData.subtotal,
                discount: orderData.discount,
                total: orderData.total,
                items: orderData.items,
                status: 'pending',
                date: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
            orders.unshift(fallbackOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            console.log('Order saved to localStorage (fallback):', fallbackOrder.id);
            
            // Clear cart
            localStorage.removeItem('cart');
            
            showToast('Order saved locally (API failed)', 'success');
            
            setTimeout(() => {
                window.location.href = `order-confirmation.html?order=${fallbackOrder.id}`;
            }, 1500);
        }
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
        elements.applyDiscount?.addEventListener('click', async function() {
            ButtonState.setLoading(this, 'Applying...', false);
            await applyDiscountCode();
            ButtonState.reset(this);
        });
        elements.discountCode?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                elements.applyDiscount?.click();
            }
        });
        
        // Card formatting with input masks
        elements.cardNumber?.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldLength = e.target.value.length;
            e.target.value = formatCardNumber(e.target.value);
            // Adjust cursor position after formatting
            const newLength = e.target.value.length;
            e.target.setSelectionRange(cursorPosition + (newLength - oldLength), cursorPosition + (newLength - oldLength));
        });
        
        elements.expiry?.addEventListener('input', (e) => {
            e.target.value = formatExpiry(e.target.value);
        });
        
        // Phone formatting with auto country detection
        const phoneInput = document.getElementById('phone');
        phoneInput?.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldLength = e.target.value.length;
            e.target.value = formatPhone(e.target.value);
            // Adjust cursor position
            const newLength = e.target.value.length;
            e.target.setSelectionRange(cursorPosition + (newLength - oldLength), cursorPosition + (newLength - oldLength));
        });
        
        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        cvvInput?.addEventListener('input', (e) => {
            e.target.value = formatCVV(e.target.value);
        });
        
        // Place order
        console.log('Place Order Button:', elements.placeOrderBtn ? 'FOUND' : 'NOT FOUND');
        if (elements.placeOrderBtn) {
            elements.placeOrderBtn.addEventListener('click', handlePlaceOrder);
            console.log('Event listener attached to place order button');
        } else {
            console.error('ERROR: Place Order button not found!');
        }
    }

    // Start
    init();
});
