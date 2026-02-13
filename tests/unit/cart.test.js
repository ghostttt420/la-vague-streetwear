/**
 * LA VAGUE - Cart Unit Tests
 * Tests for cart operations: add, remove, update quantity, calculate totals
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  mockCartItems, 
  createMockCartItem,
  mockProducts 
} from '../fixtures/test-data.js';
import { 
  setupCartDOM, 
  setupWishlistDOM,
  getCart, 
  getWishlist, 
  seedCart, 
  seedWishlist,
  clearCartData 
} from '../helpers/test-helpers.js';

// Mock the cart module before importing
describe('Cart Operations', () => {
  let CartState;
  let CurrencyConfig;

  beforeEach(async () => {
    // Set up DOM
    setupCartDOM();
    setupWishlistDOM();
    
    // Clear localStorage
    clearCartData();
    
    // Mock global dependencies
    global.TRANSLATIONS = {
      en: {
        toast: {
          addedToCart: 'added to cart',
          removedFromWishlist: 'Removed from wishlist',
          addedToWishlist: 'Added to wishlist',
          viewCart: 'View Cart'
        }
      }
    };
    global.I18n = {
      t: (key) => {
        const keys = key.split('.');
        let val = global.TRANSLATIONS.en;
        for (const k of keys) val = val?.[k];
        return val || key;
      }
    };
    global.I18n = undefined; // Test without I18n first
    
    // Mock ProductAPI
    global.ProductAPI = {
      getById: (id) => mockProducts.find(p => p.id === id),
      getAll: () => mockProducts
    };
    global.CATEGORIES = [
      { id: 'hoodies', name: 'Hoodies' },
      { id: 'tees', name: 'T-Shirts' }
    ];
    
    // Import the cart module fresh for each test
    // We need to clear the module cache first
    vi.resetModules();
    
    // Dynamically import to get fresh module instance
    const cartModule = await import('../../cart.js');
    CartState = cartModule.CartState || global.CartState;
    CurrencyConfig = cartModule.CurrencyConfig || global.CurrencyConfig;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('CartState Initialization', () => {
    it('should initialize with empty cart from localStorage', () => {
      const cart = getCart();
      expect(cart).toEqual([]);
    });

    it('should load existing cart from localStorage', () => {
      seedCart(mockCartItems);
      const cart = getCart();
      expect(cart).toHaveLength(3);
      expect(cart[0].name).toBe('Classic Oversized Hoodie');
    });

    it('should initialize with empty wishlist from localStorage', () => {
      const wishlist = getWishlist();
      expect(wishlist).toEqual([]);
    });

    it('should load existing wishlist from localStorage', () => {
      seedWishlist(['lv-hoodie-001', 'lv-tee-001']);
      const wishlist = getWishlist();
      expect(wishlist).toHaveLength(2);
      expect(wishlist[0]).toBe('lv-hoodie-001');
    });
  });

  describe('addToCart', () => {
    it('should add new item to empty cart', () => {
      const newItem = createMockCartItem({
        id: 'lv-hoodie-001',
        name: 'Classic Oversized Hoodie',
        price: 145
      });
      
      CartState.addToCart(newItem);
      
      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart[0]).toMatchObject(newItem);
    });

    it('should increase quantity when adding duplicate item (same id, color, size)', () => {
      const item1 = createMockCartItem({
        id: 'lv-hoodie-001',
        name: 'Classic Oversized Hoodie',
        color: 'Black',
        size: 'L',
        quantity: 1
      });
      
      const item2 = createMockCartItem({
        id: 'lv-hoodie-001',
        name: 'Classic Oversized Hoodie',
        color: 'Black',
        size: 'L',
        quantity: 2
      });
      
      CartState.addToCart(item1);
      CartState.addToCart(item2);
      
      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
    });

    it('should add separate items for different colors', () => {
      const item1 = createMockCartItem({
        id: 'lv-hoodie-001',
        color: 'Black',
        size: 'L'
      });
      
      const item2 = createMockCartItem({
        id: 'lv-hoodie-001',
        color: 'Grey',
        size: 'L'
      });
      
      CartState.addToCart(item1);
      CartState.addToCart(item2);
      
      const cart = getCart();
      expect(cart).toHaveLength(2);
    });

    it('should add separate items for different sizes', () => {
      const item1 = createMockCartItem({
        id: 'lv-hoodie-001',
        color: 'Black',
        size: 'L'
      });
      
      const item2 = createMockCartItem({
        id: 'lv-hoodie-001',
        color: 'Black',
        size: 'XL'
      });
      
      CartState.addToCart(item1);
      CartState.addToCart(item2);
      
      const cart = getCart();
      expect(cart).toHaveLength(2);
    });

    it('should add different products as separate items', () => {
      const item1 = createMockCartItem({ id: 'lv-hoodie-001', name: 'Hoodie' });
      const item2 = createMockCartItem({ id: 'lv-tee-001', name: 'Tee' });
      
      CartState.addToCart(item1);
      CartState.addToCart(item2);
      
      const cart = getCart();
      expect(cart).toHaveLength(2);
    });

    it('should persist cart to localStorage after adding item', () => {
      const item = createMockCartItem();
      CartState.addToCart(item);
      
      // Simulate page reload by getting from localStorage directly
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe(item.name);
    });

    it('should show toast notification when adding item', () => {
      const showToastSpy = vi.spyOn(CartState, 'showToast');
      const item = createMockCartItem({ name: 'Test Hoodie' });
      
      CartState.addToCart(item);
      
      expect(showToastSpy).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      seedCart(mockCartItems);
      // Reload cart state
      CartState.cart = getCart();
    });

    it('should remove item at specified index', () => {
      CartState.removeFromCart(0);
      
      const cart = getCart();
      expect(cart).toHaveLength(2);
      expect(cart[0].name).toBe('Wave Box Logo Tee');
    });

    it('should remove middle item correctly', () => {
      CartState.removeFromCart(1);
      
      const cart = getCart();
      expect(cart).toHaveLength(2);
      expect(cart[0].name).toBe('Classic Oversized Hoodie');
      expect(cart[1].name).toBe('Utility Cargo Pants');
    });

    it('should update localStorage after removal', () => {
      CartState.removeFromCart(0);
      
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored).toHaveLength(2);
    });

    it('should handle removing from empty cart gracefully', () => {
      clearCartData();
      CartState.cart = [];
      
      expect(() => CartState.removeFromCart(0)).not.toThrow();
    });

    it('should handle removing with invalid index gracefully', () => {
      expect(() => CartState.removeFromCart(10)).not.toThrow();
    });
  });

  describe('updateCartItemQuantity', () => {
    beforeEach(() => {
      seedCart(mockCartItems);
      CartState.cart = getCart();
    });

    it('should increase quantity with positive delta', () => {
      CartState.updateCartItemQuantity(0, 1);
      
      const cart = getCart();
      expect(cart[0].quantity).toBe(2);
    });

    it('should decrease quantity with negative delta', () => {
      // First item has quantity 1
      CartState.updateCartItemQuantity(1, -1); // Second item has quantity 2
      
      const cart = getCart();
      expect(cart[1].quantity).toBe(1);
    });

    it('should not allow quantity below 1', () => {
      CartState.updateCartItemQuantity(0, -5);
      
      const cart = getCart();
      expect(cart[0].quantity).toBe(1);
    });

    it('should persist updated quantity to localStorage', () => {
      CartState.updateCartItemQuantity(0, 2);
      
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored[0].quantity).toBe(3);
    });

    it('should handle invalid index gracefully', () => {
      expect(() => CartState.updateCartItemQuantity(10, 1)).not.toThrow();
    });
  });

  describe('updateCartCount', () => {
    it('should update cart count badge with total items', () => {
      seedCart(mockCartItems);
      CartState.cart = getCart();
      
      CartState.updateCartCount();
      
      const countBadge = document.getElementById('cartCount');
      // 1 + 2 + 1 = 4 items
      expect(countBadge.textContent).toBe('4');
    });

    it('should hide badge when cart is empty', () => {
      clearCartData();
      CartState.cart = [];
      
      CartState.updateCartCount();
      
      const countBadge = document.getElementById('cartCount');
      expect(countBadge.style.display).toBe('none');
    });

    it('should show badge when cart has items', () => {
      seedCart([mockCartItems[0]]);
      CartState.cart = getCart();
      
      CartState.updateCartCount();
      
      const countBadge = document.getElementById('cartCount');
      expect(countBadge.style.display).toBe('flex');
    });
  });

  describe('addToWishlist', () => {
    it('should add product ID to wishlist', () => {
      CartState.addToWishlist('lv-hoodie-001');
      
      const wishlist = getWishlist();
      expect(wishlist).toContain('lv-hoodie-001');
    });

    it('should remove product ID if already in wishlist', () => {
      seedWishlist(['lv-hoodie-001']);
      CartState.wishlist = getWishlist();
      
      const result = CartState.addToWishlist('lv-hoodie-001');
      
      const wishlist = getWishlist();
      expect(wishlist).not.toContain('lv-hoodie-001');
      expect(result).toBe(false);
    });

    it('should return true when adding new item', () => {
      const result = CartState.addToWishlist('lv-hoodie-001');
      expect(result).toBe(true);
    });

    it('should persist wishlist to localStorage', () => {
      CartState.addToWishlist('lv-tee-001');
      
      const stored = JSON.parse(localStorage.getItem('wishlist'));
      expect(stored).toContain('lv-tee-001');
    });
  });

  describe('removeFromWishlist', () => {
    beforeEach(() => {
      seedWishlist(['lv-hoodie-001', 'lv-tee-001', 'lv-bottom-001']);
      CartState.wishlist = getWishlist();
    });

    it('should remove item at specified index', () => {
      CartState.removeFromWishlist(1);
      
      const wishlist = getWishlist();
      expect(wishlist).toHaveLength(2);
      expect(wishlist).not.toContain('lv-tee-001');
    });

    it('should update localStorage after removal', () => {
      CartState.removeFromWishlist(0);
      
      const stored = JSON.parse(localStorage.getItem('wishlist'));
      expect(stored).toHaveLength(2);
    });
  });

  describe('Cart Total Calculations', () => {
    it('should calculate correct subtotal', () => {
      seedCart(mockCartItems);
      CartState.cart = getCart();
      
      // 145*1 + 65*2 + 135*1 = 145 + 130 + 135 = 410
      const subtotal = CartState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(subtotal).toBe(410);
    });

    it('should calculate correct subtotal with single item', () => {
      const singleItem = [mockCartItems[0]];
      seedCart(singleItem);
      CartState.cart = getCart();
      
      const subtotal = CartState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(subtotal).toBe(145);
    });

    it('should calculate zero subtotal for empty cart', () => {
      const subtotal = CartState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(subtotal).toBe(0);
    });

    it('should handle large quantities correctly', () => {
      const largeQuantityItem = createMockCartItem({
        price: 100,
        quantity: 100
      });
      seedCart([largeQuantityItem]);
      CartState.cart = getCart();
      
      const subtotal = CartState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(subtotal).toBe(10000);
    });
  });

  describe('saveCart and saveWishlist', () => {
    it('should save cart to localStorage', () => {
      CartState.cart = [createMockCartItem()];
      CartState.saveCart();
      
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored).toHaveLength(1);
    });

    it('should save wishlist to localStorage', () => {
      CartState.wishlist = ['lv-hoodie-001'];
      CartState.saveWishlist();
      
      const stored = JSON.parse(localStorage.getItem('wishlist'));
      expect(stored).toContain('lv-hoodie-001');
    });
  });
});

describe('CurrencyConfig', () => {
  let CurrencyConfig;

  beforeEach(async () => {
    vi.resetModules();
    const cartModule = await import('../../cart.js');
    CurrencyConfig = cartModule.CurrencyConfig;
    localStorage.clear();
  });

  describe('getCurrentCurrency', () => {
    it('should return default USD when no currency is set', () => {
      expect(CurrencyConfig.getCurrentCurrency()).toBe('USD');
    });

    it('should return stored currency from localStorage', () => {
      localStorage.setItem('preferredCurrency', 'EUR');
      expect(CurrencyConfig.getCurrentCurrency()).toBe('EUR');
    });
  });

  describe('setCurrency', () => {
    it('should store valid currency in localStorage', () => {
      CurrencyConfig.setCurrency('NGN');
      expect(localStorage.getItem('preferredCurrency')).toBe('NGN');
    });

    it('should return true for valid currency', () => {
      expect(CurrencyConfig.setCurrency('GBP')).toBe(true);
    });

    it('should return false for invalid currency', () => {
      expect(CurrencyConfig.setCurrency('INVALID')).toBe(false);
    });

    it('should dispatch currencyChanged event', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      CurrencyConfig.setCurrency('EUR');
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'currencyChanged',
          detail: { currency: 'EUR' }
        })
      );
    });
  });

  describe('convert', () => {
    it('should return same amount for USD base', () => {
      expect(CurrencyConfig.convert(100, 'USD')).toBe(100);
    });

    it('should convert to NGN correctly', () => {
      expect(CurrencyConfig.convert(100, 'NGN')).toBe(150000); // 100 * 1500
    });

    it('should convert to EUR correctly', () => {
      expect(CurrencyConfig.convert(100, 'EUR')).toBe(92); // 100 * 0.92
    });

    it('should use current currency when target not specified', () => {
      localStorage.setItem('preferredCurrency', 'GBP');
      expect(CurrencyConfig.convert(100)).toBe(79); // 100 * 0.79
    });

    it('should handle zero amount', () => {
      expect(CurrencyConfig.convert(0, 'NGN')).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('should format USD with $ symbol', () => {
      expect(CurrencyConfig.formatPrice(100, 'USD')).toBe('$100.00');
    });

    it('should format NGN with ₦ symbol and no decimals', () => {
      expect(CurrencyConfig.formatPrice(100, 'NGN')).toBe('₦150,000');
    });

    it('should format EUR with € symbol', () => {
      expect(CurrencyConfig.formatPrice(100, 'EUR')).toBe('€92.00');
    });

    it('should format GBP with £ symbol', () => {
      expect(CurrencyConfig.formatPrice(100, 'GBP')).toBe('£79.00');
    });

    it('should use current currency when not specified', () => {
      localStorage.setItem('preferredCurrency', 'EUR');
      expect(CurrencyConfig.formatPrice(50)).toBe('€46.00');
    });

    it('should handle decimal amounts', () => {
      expect(CurrencyConfig.formatPrice(99.99, 'USD')).toBe('$99.99');
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return all supported currencies', () => {
      const currencies = CurrencyConfig.getSupportedCurrencies();
      expect(currencies).toEqual(['USD', 'NGN', 'EUR', 'GBP']);
    });
  });
});
