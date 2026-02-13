/**
 * LA VAGUE - Test Helpers
 * Utility functions for testing
 */

import { vi } from 'vitest';

// ==========================================
// DOM HELPERS
// ==========================================

/**
 * Create a DOM element with attributes and children
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'className') {
      element.className = value;
    } else if (key.startsWith('on')) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Set up cart sidebar DOM elements
 */
export function setupCartDOM() {
  document.body.innerHTML = `
    <div id="cartSidebar">
      <div class="cart-header">
        <h3>Your Cart</h3>
        <button id="cartClose">Close</button>
      </div>
      <div id="cartItems"></div>
      <div class="cart-footer">
        <div class="cart-subtotal">
          <span>Subtotal</span>
          <span id="cartSubtotal">$0.00</span>
        </div>
        <a href="checkout.html" class="btn btn-primary">Checkout</a>
      </div>
    </div>
    <div id="cartOverlay"></div>
    <button id="cartBtn">Cart</button>
    <span class="cart-count" id="cartCount">0</span>
  `;
}

/**
 * Set up wishlist sidebar DOM elements
 */
export function setupWishlistDOM() {
  document.body.innerHTML += `
    <div id="wishlistSidebar">
      <div class="wishlist-header">
        <h3>Your Wishlist</h3>
        <button id="wishlistClose">Close</button>
      </div>
      <div id="wishlistItems"></div>
    </div>
    <div id="wishlistOverlay"></div>
    <button id="wishlistBtn">Wishlist</button>
    <span class="wishlist-count" id="wishlistCount">0</span>
  `;
}

/**
 * Set up navigation DOM
 */
export function setupNavDOM() {
  document.body.innerHTML += `
    <nav id="nav">
      <div class="nav-actions">
        <button id="wishlistBtn" class="wishlist-btn">Wishlist</button>
        <button id="cartBtn" class="cart-btn">Cart</button>
        <button class="mobile-menu-btn">Menu</button>
      </div>
    </nav>
  `;
}

/**
 * Set up checkout page DOM
 */
export function setupCheckoutDOM() {
  document.body.innerHTML = `
    <nav id="nav"></nav>
    <div class="checkout-container">
      <form id="checkoutForm">
        <input type="email" id="email" name="email" />
        <input type="text" id="firstName" name="firstName" />
        <input type="text" id="lastName" name="lastName" />
        <input type="text" id="address" name="address" />
        <input type="text" id="apartment" name="apartment" />
        <input type="text" id="city" name="city" />
        <input type="text" id="state" name="state" />
        <input type="text" id="zip" name="zip" />
        <input type="tel" id="phone" name="phone" />
        <input type="text" id="cardNumber" name="cardNumber" />
        <input type="text" id="expiry" name="expiry" />
        <input type="text" id="cvv" name="cvv" />
        <button type="submit" id="placeOrderBtn">Complete Order</button>
      </form>
      <div class="order-summary">
        <div id="summaryItems"></div>
        <div class="summary-line">
          <span>Subtotal</span>
          <span id="summarySubtotal">$0.00</span>
        </div>
        <div class="summary-line">
          <span>Shipping</span>
          <span id="summaryShipping">$0.00</span>
        </div>
        <div id="discountLine" style="display: none;">
          <span>Discount</span>
          <span id="summaryDiscount">-$0.00</span>
        </div>
        <div class="summary-line total">
          <span>Total</span>
          <span id="summaryTotal">$0.00</span>
        </div>
        <input type="text" id="discountCode" placeholder="Discount code" />
        <button id="applyDiscount">Apply</button>
      </div>
    </div>
    <div id="toastContainer"></div>
  `;
}

// ==========================================
// MOCK HELPERS
// ==========================================

/**
 * Mock fetch API
 */
export function mockFetch(response, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response))
  });
}

/**
 * Mock fetch with error
 */
export function mockFetchError(errorMessage = 'Network error') {
  global.fetch = vi.fn().mockRejectedValue(new Error(errorMessage));
}

/**
 * Mock localStorage with data
 */
export function mockLocalStorage(data = {}) {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });
}

/**
 * Create a mock event
 */
export function createMockEvent(overrides = {}) {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: { value: '' },
    currentTarget: { value: '' },
    key: '',
    keyCode: 0,
    ...overrides
  };
}

// ==========================================
// ASSERTION HELPERS
// ==========================================

/**
 * Assert that an element has specific text content
 */
export function expectElementToHaveText(element, text) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  expect(element).not.toBeNull();
  expect(element.textContent).toContain(text);
}

/**
 * Assert that an element has specific class
 */
export function expectElementToHaveClass(element, className) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  expect(element).not.toBeNull();
  expect(element.classList.contains(className)).toBe(true);
}

/**
 * Assert localStorage has item with specific value
 */
export function expectLocalStorageItem(key, expectedValue) {
  const item = localStorage.getItem(key);
  expect(item).not.toBeNull();
  expect(JSON.parse(item)).toEqual(expectedValue);
}

// ==========================================
// ASYNC HELPERS
// ==========================================

/**
 * Wait for a specified duration
 */
export function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for next tick
 */
export function nextTick() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Wait for element to appear in DOM
 */
export async function waitForElement(selector, timeout = 1000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await wait(10);
  }
  throw new Error(`Element ${selector} not found within ${timeout}ms`);
}

// ==========================================
// CURRENCY HELPERS
// ==========================================

/**
 * Format price for assertions
 */
export function formatPriceForAssertion(amount, currency = 'USD') {
  const symbols = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' };
  const rates = { USD: 1, NGN: 1500, EUR: 0.92, GBP: 0.79 };
  
  const convertedAmount = amount * (rates[currency] || 1);
  const symbol = symbols[currency] || '$';
  
  if (currency === 'NGN') {
    return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
  }
  return `${symbol}${convertedAmount.toFixed(2)}`;
}

// ==========================================
// FORM HELPERS
// ==========================================

/**
 * Fill form fields
 */
export function fillForm(fields) {
  Object.entries(fields).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

/**
 * Get form data as object
 */
export function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};
  
  const data = {};
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input.name || input.id) {
      data[input.name || input.id] = input.value;
    }
  });
  return data;
}

// ==========================================
// CART HELPERS
// ==========================================

/**
 * Add items to cart in localStorage
 */
export function seedCart(items) {
  localStorage.setItem('cart', JSON.stringify(items));
}

/**
 * Add items to wishlist in localStorage
 */
export function seedWishlist(productIds) {
  localStorage.setItem('wishlist', JSON.stringify(productIds));
}

/**
 * Clear cart and wishlist
 */
export function clearCartData() {
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
}

/**
 * Get cart from localStorage
 */
export function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

/**
 * Get wishlist from localStorage
 */
export function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}
