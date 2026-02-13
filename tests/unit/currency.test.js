/**
 * LA VAGUE - Currency Unit Tests
 * Tests for currency conversion and formatting
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Currency Conversion', () => {
  // Replicate CurrencyConfig for testing
  const CurrencyConfig = {
    rates: {
      USD: 1,
      NGN: 1500,
      EUR: 0.92,
      GBP: 0.79
    },
    symbols: {
      USD: '$',
      NGN: '₦',
      EUR: '€',
      GBP: '£'
    },
    getCurrentCurrency() {
      return localStorage.getItem('preferredCurrency') || 'USD';
    },
    convert(amount, targetCurrency = null) {
      const currency = targetCurrency || this.getCurrentCurrency();
      const rate = this.rates[currency] || 1;
      return amount * rate;
    },
    formatPrice(amount, currency = null) {
      const targetCurrency = currency || this.getCurrentCurrency();
      const convertedAmount = this.convert(amount, targetCurrency);
      const symbol = this.symbols[targetCurrency];
      
      if (targetCurrency === 'NGN') {
        return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
      }
      
      return `${symbol}${convertedAmount.toFixed(2)}`;
    },
    getSupportedCurrencies() {
      return Object.keys(this.rates);
    }
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Exchange Rates', () => {
    it('should have correct USD base rate', () => {
      expect(CurrencyConfig.rates.USD).toBe(1);
    });

    it('should have correct NGN rate', () => {
      expect(CurrencyConfig.rates.NGN).toBe(1500);
    });

    it('should have correct EUR rate', () => {
      expect(CurrencyConfig.rates.EUR).toBe(0.92);
    });

    it('should have correct GBP rate', () => {
      expect(CurrencyConfig.rates.GBP).toBe(0.79);
    });
  });

  describe('Currency Conversion', () => {
    describe('USD conversions', () => {
      it('should return same value for USD to USD', () => {
        expect(CurrencyConfig.convert(100, 'USD')).toBe(100);
        expect(CurrencyConfig.convert(0, 'USD')).toBe(0);
        expect(CurrencyConfig.convert(999.99, 'USD')).toBe(999.99);
      });
    });

    describe('NGN conversions', () => {
      it('should convert USD to NGN correctly', () => {
        expect(CurrencyConfig.convert(1, 'NGN')).toBe(1500);
        expect(CurrencyConfig.convert(100, 'NGN')).toBe(150000);
        expect(CurrencyConfig.convert(0.5, 'NGN')).toBe(750);
      });

      it('should handle zero', () => {
        expect(CurrencyConfig.convert(0, 'NGN')).toBe(0);
      });
    });

    describe('EUR conversions', () => {
      it('should convert USD to EUR correctly', () => {
        expect(CurrencyConfig.convert(100, 'EUR')).toBe(92);
        expect(CurrencyConfig.convert(50, 'EUR')).toBe(46);
        expect(CurrencyConfig.convert(200, 'EUR')).toBe(184);
      });
    });

    describe('GBP conversions', () => {
      it('should convert USD to GBP correctly', () => {
        expect(CurrencyConfig.convert(100, 'GBP')).toBe(79);
        expect(CurrencyConfig.convert(50, 'GBP')).toBe(39.5);
        expect(CurrencyConfig.convert(200, 'GBP')).toBe(158);
      });
    });

    describe('Default currency handling', () => {
      it('should use USD as default when no preference set', () => {
        expect(CurrencyConfig.getCurrentCurrency()).toBe('USD');
      });

      it('should use stored preference when available', () => {
        localStorage.setItem('preferredCurrency', 'EUR');
        expect(CurrencyConfig.getCurrentCurrency()).toBe('EUR');
      });

      it('should convert using stored preference', () => {
        localStorage.setItem('preferredCurrency', 'NGN');
        expect(CurrencyConfig.convert(10)).toBe(15000);
      });
    });

    describe('Large numbers', () => {
      it('should handle large amounts correctly', () => {
        expect(CurrencyConfig.convert(10000, 'NGN')).toBe(15000000);
        expect(CurrencyConfig.convert(1000000, 'EUR')).toBe(920000);
      });
    });

    describe('Small numbers', () => {
      it('should handle small amounts correctly', () => {
        expect(CurrencyConfig.convert(0.01, 'USD')).toBe(0.01);
        expect(CurrencyConfig.convert(0.01, 'NGN')).toBe(15);
      });
    });
  });

  describe('Price Formatting', () => {
    describe('USD formatting', () => {
      it('should format USD with $ symbol and 2 decimals', () => {
        expect(CurrencyConfig.formatPrice(100, 'USD')).toBe('$100.00');
      });

      it('should format decimal amounts correctly', () => {
        expect(CurrencyConfig.formatPrice(99.99, 'USD')).toBe('$99.99');
        expect(CurrencyConfig.formatPrice(0.01, 'USD')).toBe('$0.01');
        expect(CurrencyConfig.formatPrice(0.10, 'USD')).toBe('$0.10');
      });

      it('should format large amounts correctly', () => {
        expect(CurrencyConfig.formatPrice(10000, 'USD')).toBe('$10000.00');
      });
    });

    describe('NGN formatting', () => {
      it('should format NGN with ₦ symbol without decimals', () => {
        expect(CurrencyConfig.formatPrice(100, 'NGN')).toBe('₦150,000');
      });

      it('should use locale string formatting for large numbers', () => {
        expect(CurrencyConfig.formatPrice(1000, 'NGN')).toBe('₦1,500,000');
      });

      it('should handle rounding correctly', () => {
        // 100.5 * 1500 = 150750
        expect(CurrencyConfig.formatPrice(100.5, 'NGN')).toBe('₦150,750');
      });
    });

    describe('EUR formatting', () => {
      it('should format EUR with € symbol and 2 decimals', () => {
        expect(CurrencyConfig.formatPrice(100, 'EUR')).toBe('€92.00');
      });

      it('should handle decimal amounts', () => {
        expect(CurrencyConfig.formatPrice(50.50, 'EUR')).toBe('€46.46');
      });
    });

    describe('GBP formatting', () => {
      it('should format GBP with £ symbol and 2 decimals', () => {
        expect(CurrencyConfig.formatPrice(100, 'GBP')).toBe('£79.00');
      });

      it('should handle decimal amounts', () => {
        expect(CurrencyConfig.formatPrice(25.25, 'GBP')).toBe('£19.95');
      });
    });

    describe('Default currency formatting', () => {
      it('should use stored preference for formatting', () => {
        localStorage.setItem('preferredCurrency', 'EUR');
        expect(CurrencyConfig.formatPrice(50)).toBe('€46.00');
      });
    });

    describe('Edge cases', () => {
      it('should handle zero amount', () => {
        expect(CurrencyConfig.formatPrice(0, 'USD')).toBe('$0.00');
        expect(CurrencyConfig.formatPrice(0, 'NGN')).toBe('₦0');
      });

      it('should handle negative amounts', () => {
        expect(CurrencyConfig.formatPrice(-100, 'USD')).toBe('$-100.00');
      });
    });
  });

  describe('Supported Currencies', () => {
    it('should return all supported currencies', () => {
      const currencies = CurrencyConfig.getSupportedCurrencies();
      expect(currencies).toEqual(['USD', 'NGN', 'EUR', 'GBP']);
    });

    it('should return array of 4 currencies', () => {
      expect(CurrencyConfig.getSupportedCurrencies()).toHaveLength(4);
    });
  });

  describe('Currency Symbols', () => {
    it('should have correct symbol for USD', () => {
      expect(CurrencyConfig.symbols.USD).toBe('$');
    });

    it('should have correct symbol for NGN', () => {
      expect(CurrencyConfig.symbols.NGN).toBe('₦');
    });

    it('should have correct symbol for EUR', () => {
      expect(CurrencyConfig.symbols.EUR).toBe('€');
    });

    it('should have correct symbol for GBP', () => {
      expect(CurrencyConfig.symbols.GBP).toBe('£');
    });
  });
});
