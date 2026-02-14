/**
 * LA VAGUE - Paystack Payment Integration
 * Handles Paystack popup payment flow
 */

(function() {
    'use strict';

    // Configuration
    let PAYSTACK_PUBLIC_KEY = window.PAYSTACK_PUBLIC_KEY || '';
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api' 
        : 'https://la-vague-api.onrender.com/api';

    // State
    let currentOrderId = null;
    let currentOrderData = null;
    let isPaystackAvailable = false;
    let configLoaded = false;

    /**
     * Fetch Paystack configuration from backend
     */
    async function loadPaystackConfig() {
        if (configLoaded) return isPaystackConfigured();
        
        console.log('[PAYSTACK] Loading config from:', `${API_URL}/config/paystack`);
        
        try {
            const response = await fetch(`${API_URL}/config/paystack`, {
                credentials: 'include'
            });
            
            console.log('[PAYSTACK] Config response status:', response.status);
            
            const data = await response.json();
            console.log('[PAYSTACK] Config response:', data);
            
            if (data.success && data.configured) {
                PAYSTACK_PUBLIC_KEY = data.publicKey;
                console.log('[PAYSTACK] Config loaded! Test mode:', data.testMode);
                console.log('[PAYSTACK] Key prefix:', PAYSTACK_PUBLIC_KEY.substring(0, 10) + '...');
                configLoaded = true;
                return true;
            } else {
                console.log('[PAYSTACK] Not configured on backend:', data.error);
                configLoaded = true;
                return false;
            }
        } catch (error) {
            console.error('[PAYSTACK] Failed to load config:', error);
            configLoaded = true;
            return false;
        }
    }

    /**
     * Check if Paystack is configured
     */
    function isPaystackConfigured() {
        return !!PAYSTACK_PUBLIC_KEY && PAYSTACK_PUBLIC_KEY.startsWith('pk_');
    }

    /**
     * Load Paystack script dynamically
     */
    function loadPaystackScript() {
        return new Promise((resolve, reject) => {
            if (window.PaystackPop) {
                isPaystackAvailable = true;
                resolve();
                return;
            }

            if (!isPaystackConfigured()) {
                console.log('[PAYSTACK] Not configured, using manual payment');
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v2/inline.js';
            script.async = true;
            script.onload = () => {
                console.log('[PAYSTACK] Script loaded');
                isPaystackAvailable = true;
                resolve();
            };
            script.onerror = () => {
                console.error('[PAYSTACK] Failed to load script');
                isPaystackAvailable = false;
                resolve(); // Resolve anyway to use fallback
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Paystack payment
     */
    async function initializePaystackPayment(orderId, orderData, customerData) {
        if (!isPaystackAvailable || !window.PaystackPop) {
            throw new Error('Paystack is not available');
        }

        const amountInKobo = Math.round(orderData.total * 100); // Convert to kobo
        
        const paymentData = {
            key: PAYSTACK_PUBLIC_KEY,
            email: customerData.email,
            amount: amountInKobo,
            ref: `LV-${Date.now()}`,
            metadata: {
                order_id: orderId,
                custom_fields: [
                    {
                        display_name: "Order ID",
                        variable_name: "order_id",
                        value: orderId
                    },
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: customerData.name
                    }
                ]
            },
            onClose: function() {
                console.log('[PAYSTACK] Payment window closed');
                handlePaymentClosed(orderId);
            },
            callback: function(response) {
                console.log('[PAYSTACK] Payment callback:', response);
                handlePaymentCallback(orderId, response);
            }
        };

        // Add phone if available (helps with fraud detection)
        if (customerData.phone) {
            paymentData.phone = customerData.phone;
        }

        console.log('[PAYSTACK] Initializing payment:', { orderId, amount: amountInKobo });
        
        const popup = new window.PaystackPop();
        popup.newTransaction(paymentData);
    }

    /**
     * Handle payment window closed
     */
    async function handlePaymentClosed(orderId) {
        // Check if payment was successful via webhook
        console.log('[PAYSTACK] Checking payment status for order:', orderId);
        
        try {
            const status = await checkPaymentStatus(orderId);
            
            if (status === 'paid') {
                // Payment succeeded via webhook
                console.log('[PAYSTACK] Payment confirmed via webhook');
                redirectToConfirmation(orderId);
            } else {
                // Payment was cancelled or pending
                console.log('[PAYSTACK] Payment not completed:', status);
                showPaymentPendingMessage(orderId);
            }
        } catch (error) {
            console.error('[PAYSTACK] Error checking status:', error);
            showPaymentPendingMessage(orderId);
        }
    }

    /**
     * Handle payment callback
     */
    async function handlePaymentCallback(orderId, response) {
        const { reference, status, trans } = response;
        
        console.log('[PAYSTACK] Callback received:', { orderId, reference, status });
        
        if (status === 'success') {
            // Verify payment on backend
            try {
                const verifyResult = await verifyPaymentOnBackend(orderId, reference);
                
                if (verifyResult.success && verifyResult.status === 'paid') {
                    redirectToConfirmation(orderId);
                } else {
                    // Payment pending, webhook will handle it
                    showPaymentPendingMessage(orderId);
                }
            } catch (error) {
                console.error('[PAYSTACK] Verification error:', error);
                showPaymentPendingMessage(orderId);
            }
        } else {
            showPaymentFailedMessage(status);
        }
    }

    /**
     * Check payment status
     */
    async function checkPaymentStatus(orderId) {
        try {
            const response = await fetch(`${API_URL}/orders/lookup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, email: currentOrderData?.customerEmail })
            });
            
            const result = await response.json();
            
            if (result.success && result.order) {
                return result.order.payment_status;
            }
            
            return 'pending';
        } catch (error) {
            console.error('[PAYSTACK] Status check error:', error);
            return 'pending';
        }
    }

    /**
     * Verify payment on backend
     */
    async function verifyPaymentOnBackend(orderId, reference) {
        try {
            // Get CSRF token first
            const csrfResponse = await fetch(`${API_URL}/csrf-token`);
            const csrfData = await csrfResponse.json();
            
            const response = await fetch(`${API_URL}/orders/verify-payment`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfData.csrfToken
                },
                body: JSON.stringify({ orderId, reference })
            });
            
            return await response.json();
        } catch (error) {
            console.error('[PAYSTACK] Backend verification error:', error);
            return { success: false };
        }
    }

    /**
     * Redirect to confirmation page
     */
    function redirectToConfirmation(orderId) {
        localStorage.removeItem('cart');
        window.location.href = `order-confirmation.html?order=${orderId}&status=success`;
    }

    /**
     * Show payment pending message
     */
    function showPaymentPendingMessage(orderId) {
        const message = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #f59e0b; margin-bottom: 1rem;">⏳ Payment Processing</h3>
                <p>Your payment is being processed.</p>
                <p style="margin: 1rem 0;">Order ID: <strong>${orderId}</strong></p>
                <p>You will receive an email confirmation once payment is confirmed.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    You can check your order status on the <a href="track-order.html">order tracking page</a>.
                </p>
                <button onclick="window.location.href='track-order.html'" 
                        style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Track Order
                </button>
            </div>
        `;
        
        showModal(message);
    }

    /**
     * Show payment failed message
     */
    function showPaymentFailedMessage(status) {
        const message = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #dc2626; margin-bottom: 1rem;">❌ Payment Failed</h3>
                <p>Your payment could not be completed.</p>
                <p style="margin: 1rem 0; color: #666;">Status: ${status}</p>
                <p>Please try again or contact support if the problem persists.</p>
                <button onclick="closeModal()" 
                        style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        
        showModal(message);
    }

    /**
     * Show modal
     */
    function showModal(content) {
        // Remove existing modal
        const existingModal = document.getElementById('paystack-modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'paystack-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Close modal
     */
    window.closeModal = function() {
        const modal = document.getElementById('paystack-modal');
        if (modal) modal.remove();
    };

    /**
     * Process order with Paystack
     */
    async function processOrderWithPaystack(orderData) {
        await loadPaystackScript();
        
        if (!isPaystackAvailable) {
            throw new Error('Paystack not available');
        }
        
        // Get CSRF token first (with credentials for cookie)
        let csrfToken = '';
        try {
            const csrfResponse = await fetch(`${API_URL}/csrf-token`, {
                credentials: 'include'
            });
            const csrfData = await csrfResponse.json();
            csrfToken = csrfData.csrfToken;
            console.log('[PAYSTACK] CSRF token obtained');
        } catch (error) {
            console.error('[PAYSTACK] Failed to get CSRF token:', error);
            throw new Error('CSRF token missing - please refresh and try again');
        }
        
        const orderPayload = {
            ...orderData,
            paymentMethod: 'paystack'
        };
        
        console.log('[PAYSTACK] Creating order:', orderPayload);
        
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(orderPayload)
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.error || result.message || 'Failed to create order');
        }
        
        currentOrderId = result.orderId;
        currentOrderData = orderPayload;
        
        console.log('[PAYSTACK] Order created:', currentOrderId);
        
        // Initialize Paystack payment
        await initializePaystackPayment(
            currentOrderId,
            orderPayload,
            {
                email: orderData.customerEmail,
                name: orderData.customerName,
                phone: orderData.customerPhone
            }
        );
        
        return { success: true, orderId: currentOrderId };
    }

    /**
     * Update UI to show Paystack option
     */
    function updatePaymentUI() {
        if (!isPaystackConfigured()) {
            console.log('[PAYSTACK] Not configured, keeping manual payment UI');
            return;
        }
        
        const paymentSection = document.getElementById('paymentSection');
        if (!paymentSection) return;
        
        // Update payment methods to show Paystack
        const paymentMethods = paymentSection.querySelector('.payment-methods');
        if (paymentMethods) {
            paymentMethods.innerHTML = `
                <label class="payment-method active">
                    <input type="radio" name="payment" value="paystack" checked>
                    <span>Pay with Card/Bank Transfer</span>
                    <div class="payment-icons">
                        <span class="payment-icon">💳</span>
                        <span class="payment-icon">🏦</span>
                    </div>
                </label>
                <label class="payment-method">
                    <input type="radio" name="payment" value="manual">
                    <span>Pay on Delivery</span>
                    <div class="payment-icons">
                        <span class="payment-icon">💵</span>
                    </div>
                </label>
            `;
        }
        
        // Hide card form for Paystack (it's handled in popup)
        const cardForm = paymentSection.querySelector('.card-form');
        if (cardForm) {
            cardForm.style.display = 'none';
        }
        
        // Add payment method change handler
        const paymentInputs = paymentSection.querySelectorAll('input[name="payment"]');
        paymentInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const isPaystack = e.target.value === 'paystack';
                if (cardForm) {
                    cardForm.style.display = isPaystack ? 'none' : 'block';
                }
            });
        });
        
        console.log('[PAYSTACK] UI updated');
    }

    // Public API
    window.PaystackCheckout = {
        isConfigured: isPaystackConfigured,
        isAvailable: () => isPaystackAvailable,
        loadScript: loadPaystackScript,
        processOrder: processOrderWithPaystack,
        updateUI: updatePaymentUI,
        
        // Initialize
        init: async function() {
            await loadPaystackConfig(); // Load config first
            await loadPaystackScript();
            updatePaymentUI();
            console.log('[PAYSTACK] Checkout initialized');
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.PaystackCheckout.init();
        });
    } else {
        window.PaystackCheckout.init();
    }
})();
