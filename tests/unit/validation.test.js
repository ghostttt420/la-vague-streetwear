/**
 * LA VAGUE - Validation Unit Tests
 * Tests for form validation (email, phone, credit card)
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Form Validation', () => {
  // Replicate validation functions from utils.js for testing
  const InputMasks = {
    unmask(value) {
      if (!value) return '';
      return value.replace(/\D/g, '');
    },

    creditCard(value) {
      if (!value) return '';
      const digits = value.replace(/\D/g, '');
      const limited = digits.substring(0, 16);
      return limited.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    },

    expiryDate(value) {
      if (!value) return '';
      const digits = value.replace(/\D/g, '');
      const limited = digits.substring(0, 4);
      
      if (limited.length >= 2) {
        const month = limited.substring(0, 2);
        const year = limited.substring(2);
        
        const monthNum = parseInt(month, 10);
        if (monthNum > 12) {
          return '12' + (year ? ' / ' + year : '');
        }
        if (monthNum === 0) {
          return '01' + (year ? ' / ' + year : '');
        }
        
        return month + (year ? ' / ' + year : '');
      }
      
      return limited;
    },

    cvv(value) {
      if (!value) return '';
      return value.replace(/\D/g, '').substring(0, 4);
    },

    phoneNumber(value, country = 'auto') {
      if (!value) return '';
      let digits = value.replace(/[^\d+]/g, '');
      
      if (country === 'auto') {
        if (digits.startsWith('+234') || digits.startsWith('234')) {
          country = 'NG';
        } else if (digits.startsWith('+44') || digits.startsWith('44')) {
          country = 'UK';
        } else if (digits.startsWith('+61') || digits.startsWith('61')) {
          country = 'AU';
        } else if (digits.startsWith('+1') || digits.startsWith('1')) {
          country = 'US';
        } else if (digits.startsWith('0') && digits.length <= 11) {
          country = 'NG';
        } else {
          country = 'US';
        }
      }
      
      let localDigits = digits;
      if (digits.startsWith('+')) {
        localDigits = digits.substring(1);
      }
      
      switch (country) {
        case 'NG':
          if (localDigits.startsWith('234')) {
            localDigits = localDigits.substring(3);
          } else if (localDigits.startsWith('0')) {
            localDigits = localDigits.substring(1);
          }
          localDigits = localDigits.substring(0, 10);
          if (localDigits.length >= 7) {
            return '+234 ' + localDigits.substring(0, 3) + ' ' + localDigits.substring(3, 6) + ' ' + localDigits.substring(6);
          } else if (localDigits.length >= 4) {
            return '+234 ' + localDigits.substring(0, 3) + ' ' + localDigits.substring(3);
          } else if (localDigits.length > 0) {
            return '+234 ' + localDigits;
          }
          return '+234';
          
        case 'UK':
          if (localDigits.startsWith('44')) {
            localDigits = localDigits.substring(2);
          } else if (localDigits.startsWith('0')) {
            localDigits = localDigits.substring(1);
          }
          localDigits = localDigits.substring(0, 10);
          if (localDigits.length >= 5) {
            return '+44 ' + localDigits.substring(0, 4) + ' ' + localDigits.substring(4);
          } else if (localDigits.length > 0) {
            return '+44 ' + localDigits;
          }
          return '+44';
          
        case 'US':
        case 'CA':
        default:
          if (localDigits.startsWith('1')) {
            localDigits = localDigits.substring(1);
          }
          localDigits = localDigits.substring(0, 10);
          if (localDigits.length >= 6) {
            return '+1 (' + localDigits.substring(0, 3) + ') ' + localDigits.substring(3, 6) + '-' + localDigits.substring(6);
          } else if (localDigits.length >= 3) {
            return '+1 (' + localDigits.substring(0, 3) + ') ' + localDigits.substring(3);
          } else if (localDigits.length > 0) {
            return '+1 (' + localDigits;
          }
          return '+1';
      }
    }
  };

  const FormValidation = {
    isValidCreditCard(number) {
      const digits = InputMasks.unmask(number);
      if (digits.length < 13 || digits.length > 19) return false;
      
      let sum = 0;
      let isEven = false;
      
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i), 10);
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0;
    },

    isValidExpiry(value) {
      const digits = InputMasks.unmask(value);
      if (digits.length !== 4) return false;
      
      const month = parseInt(digits.substring(0, 2), 10);
      const year = parseInt('20' + digits.substring(2, 4), 10);
      
      if (month < 1 || month > 12) return false;
      
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      
      return true;
    },

    isValidPhone(value) {
      const digits = InputMasks.unmask(value);
      return digits.length >= 10;
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  };

  describe('Email Validation', () => {
    it('should validate simple email', () => {
      expect(FormValidation.isValidEmail('test@example.com')).toBe(true);
    });

    it('should validate email with subdomain', () => {
      expect(FormValidation.isValidEmail('test@mail.example.com')).toBe(true);
    });

    it('should validate email with plus sign', () => {
      expect(FormValidation.isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should validate email with dots', () => {
      expect(FormValidation.isValidEmail('first.last@example.com')).toBe(true);
    });

    it('should reject email without @', () => {
      expect(FormValidation.isValidEmail('testexample.com')).toBe(false);
    });

    it('should reject email without domain', () => {
      expect(FormValidation.isValidEmail('test@')).toBe(false);
    });

    it('should reject email without local part', () => {
      expect(FormValidation.isValidEmail('@example.com')).toBe(false);
    });

    it('should reject email without TLD', () => {
      expect(FormValidation.isValidEmail('test@example')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(FormValidation.isValidEmail('test @example.com')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(FormValidation.isValidEmail('')).toBe(false);
    });

    it('should reject multiple @ signs', () => {
      expect(FormValidation.isValidEmail('test@@example.com')).toBe(false);
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate US phone number', () => {
      expect(FormValidation.isValidPhone('+1 (555) 123-4567')).toBe(true);
    });

    it('should validate Nigerian phone number', () => {
      expect(FormValidation.isValidPhone('+234 801 234 5678')).toBe(true);
    });

    it('should validate UK phone number', () => {
      expect(FormValidation.isValidPhone('+44 7911 123456')).toBe(true);
    });

    it('should validate phone with 10 digits', () => {
      expect(FormValidation.isValidPhone('5551234567')).toBe(true);
    });

    it('should validate phone with more than 10 digits', () => {
      expect(FormValidation.isValidPhone('+1234567890123')).toBe(true);
    });

    it('should reject phone with less than 10 digits', () => {
      expect(FormValidation.isValidPhone('555123456')).toBe(false);
    });

    it('should reject empty phone', () => {
      expect(FormValidation.isValidPhone('')).toBe(false);
    });

    it('should reject phone with only formatting', () => {
      expect(FormValidation.isValidPhone('()-+')).toBe(false);
    });
  });

  describe('Credit Card Validation (Luhn Algorithm)', () => {
    it('should validate Visa test number', () => {
      expect(FormValidation.isValidCreditCard('4242424242424242')).toBe(true);
    });

    it('should validate Mastercard test number', () => {
      expect(FormValidation.isValidCreditCard('5555555555554444')).toBe(true);
    });

    it('should validate Amex test number', () => {
      expect(FormValidation.isValidCreditCard('378282246310005')).toBe(true);
    });

    it('should validate Discover test number', () => {
      expect(FormValidation.isValidCreditCard('6011111111111117')).toBe(true);
    });

    it('should validate formatted card number', () => {
      expect(FormValidation.isValidCreditCard('4242 4242 4242 4242')).toBe(true);
    });

    it('should reject invalid card number', () => {
      expect(FormValidation.isValidCreditCard('4242424242424241')).toBe(false);
    });

    it('should reject card number with too few digits', () => {
      expect(FormValidation.isValidCreditCard('424242424242')).toBe(false);
    });

    it('should reject card number with too many digits', () => {
      expect(FormValidation.isValidCreditCard('424242424242424242424')).toBe(false);
    });

    it('should reject empty card number', () => {
      expect(FormValidation.isValidCreditCard('')).toBe(false);
    });

    it('should reject card number with letters', () => {
      expect(FormValidation.isValidCreditCard('4242abcd42424242')).toBe(false);
    });
  });

  describe('Expiry Date Validation', () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    it('should validate future date', () => {
      const futureYear = (currentYear + 1).toString().slice(-2);
      expect(FormValidation.isValidExpiry(`12 / ${futureYear}`)).toBe(true);
    });

    it('should validate current month and year', () => {
      const year = currentYear.toString().slice(-2);
      const month = currentMonth.toString().padStart(2, '0');
      expect(FormValidation.isValidExpiry(`${month}${year}`)).toBe(true);
    });

    it('should reject past year', () => {
      const pastYear = (currentYear - 1).toString().slice(-2);
      expect(FormValidation.isValidExpiry(`12 / ${pastYear}`)).toBe(false);
    });

    it('should reject past month in current year', () => {
      if (currentMonth > 1) {
        const year = currentYear.toString().slice(-2);
        const pastMonth = (currentMonth - 1).toString().padStart(2, '0');
        expect(FormValidation.isValidExpiry(`${pastMonth}${year}`)).toBe(false);
      }
    });

    it('should reject invalid month 00', () => {
      const year = (currentYear + 1).toString().slice(-2);
      expect(FormValidation.isValidExpiry(`00 / ${year}`)).toBe(false);
    });

    it('should reject invalid month 13', () => {
      const year = (currentYear + 1).toString().slice(-2);
      expect(FormValidation.isValidExpiry(`13 / ${year}`)).toBe(false);
    });

    it('should reject incomplete date', () => {
      expect(FormValidation.isValidExpiry('12 /')).toBe(false);
      expect(FormValidation.isValidExpiry('12')).toBe(false);
    });

    it('should reject empty date', () => {
      expect(FormValidation.isValidExpiry('')).toBe(false);
    });
  });

  describe('Input Masking', () => {
    describe('Credit Card Masking', () => {
      it('should format 16 digit number with spaces', () => {
        expect(InputMasks.creditCard('4242424242424242')).toBe('4242 4242 4242 4242');
      });

      it('should truncate more than 16 digits', () => {
        expect(InputMasks.creditCard('42424242424242424242')).toBe('4242 4242 4242 4242');
      });

      it('should handle partial input', () => {
        expect(InputMasks.creditCard('4242')).toBe('4242');
        expect(InputMasks.creditCard('424242')).toBe('4242 42');
      });

      it('should remove non-digits', () => {
        expect(InputMasks.creditCard('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
      });

      it('should handle empty input', () => {
        expect(InputMasks.creditCard('')).toBe('');
      });
    });

    describe('Expiry Date Masking', () => {
      it('should format as MM / YY', () => {
        expect(InputMasks.expiryDate('1225')).toBe('12 / 25');
      });

      it('should handle partial input', () => {
        expect(InputMasks.expiryDate('12')).toBe('12');
      });

      it('should cap month at 12', () => {
        expect(InputMasks.expiryDate('1325')).toBe('12 / 25');
      });

      it('should floor month at 01', () => {
        expect(InputMasks.expiryDate('0025')).toBe('01 / 25');
      });

      it('should handle empty input', () => {
        expect(InputMasks.expiryDate('')).toBe('');
      });
    });

    describe('CVV Masking', () => {
      it('should allow 3 digits', () => {
        expect(InputMasks.cvv('123')).toBe('123');
      });

      it('should allow 4 digits', () => {
        expect(InputMasks.cvv('1234')).toBe('1234');
      });

      it('should truncate more than 4 digits', () => {
        expect(InputMasks.cvv('12345')).toBe('1234');
      });

      it('should remove non-digits', () => {
        expect(InputMasks.cvv('12a3')).toBe('123');
      });

      it('should handle empty input', () => {
        expect(InputMasks.cvv('')).toBe('');
      });
    });

    describe('Phone Number Masking', () => {
      describe('US Numbers', () => {
        it('should format US number', () => {
          expect(InputMasks.phoneNumber('5551234567')).toBe('+1 (555) 123-4567');
        });

        it('should format US number with country code', () => {
          expect(InputMasks.phoneNumber('+15551234567')).toBe('+1 (555) 123-4567');
        });
      });

      describe('Nigerian Numbers', () => {
        it('should format Nigerian number', () => {
          expect(InputMasks.phoneNumber('08012345678', 'NG')).toBe('+234 801 234 5678');
        });

        it('should format Nigerian number with country code', () => {
          expect(InputMasks.phoneNumber('+2348012345678')).toBe('+234 801 234 5678');
        });

        it('should auto-detect Nigerian number', () => {
          expect(InputMasks.phoneNumber('08012345678')).toBe('+234 801 234 5678');
        });
      });

      describe('UK Numbers', () => {
        it('should format UK number', () => {
          expect(InputMasks.phoneNumber('07911123456', 'UK')).toBe('+44 7911 123456');
        });

        it('should format UK number with country code', () => {
          expect(InputMasks.phoneNumber('+447911123456')).toBe('+44 7911 123456');
        });
      });

      it('should handle empty input', () => {
        expect(InputMasks.phoneNumber('')).toBe('');
      });
    });

    describe('Unmask', () => {
      it('should remove all non-digits', () => {
        expect(InputMasks.unmask('abc123-456.789')).toBe('123456789');
      });

      it('should handle empty input', () => {
        expect(InputMasks.unmask('')).toBe('');
      });

      it('should handle already unmasked input', () => {
        expect(InputMasks.unmask('123456')).toBe('123456');
      });
    });
  });
});
