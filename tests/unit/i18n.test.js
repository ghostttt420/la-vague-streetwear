/**
 * LA VAGUE - i18n Unit Tests
 * Tests for translation system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mockTranslations, mockLanguageMetadata } from '../fixtures/test-data.js';

describe('I18n Translation System', () => {
  // Replicate I18n functionality for testing
  const createI18n = () => ({
    currentLang: 'en',
    
    init() {
      const savedLang = localStorage.getItem('laVagueLanguage');
      if (savedLang && mockTranslations[savedLang]) {
        this.currentLang = savedLang;
      }
      this.setLanguage(this.currentLang, false);
      return this.currentLang;
    },
    
    setLanguage(lang, save = true) {
      if (!mockTranslations[lang]) {
        console.warn(`Language "${lang}" not found, falling back to English`);
        lang = 'en';
      }
      
      this.currentLang = lang;
      
      if (save) {
        localStorage.setItem('laVagueLanguage', lang);
      }
      
      const langMeta = mockLanguageMetadata[lang];
      
      // Simulate DOM updates
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = langMeta.dir;
      }
      
      // Dispatch custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChanged', { 
          detail: { language: lang, dir: langMeta.dir } 
        }));
      }
      
      return lang;
    },
    
    getTranslation(key) {
      const keys = key.split('.');
      let value = mockTranslations[this.currentLang];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English
          value = mockTranslations.en;
          for (const fk of keys) {
            if (value && typeof value === 'object' && fk in value) {
              value = value[fk];
            } else {
              return null;
            }
          }
          return value;
        }
      }
      
      return value;
    },
    
    t(key, vars = {}) {
      let translation = this.getTranslation(key);
      
      if (!translation) return key;
      
      // Replace variables
      Object.keys(vars).forEach(varKey => {
        translation = translation.replace(new RegExp(`{{${varKey}}}`, 'g'), vars[varKey]);
      });
      
      return translation;
    },
    
    getCurrentLang() {
      return this.currentLang;
    },
    
    getCurrentDir() {
      return mockLanguageMetadata[this.currentLang].dir;
    },
    
    isRTL() {
      return this.getCurrentDir() === 'rtl';
    }
  });

  let I18n;

  beforeEach(() => {
    localStorage.clear();
    I18n = createI18n();
    
    // Setup DOM
    document.documentElement.innerHTML = '<html lang="en" dir="ltr"></html>';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should default to English on init', () => {
      const lang = I18n.init();
      expect(lang).toBe('en');
      expect(I18n.currentLang).toBe('en');
    });

    it('should load saved language preference from localStorage', () => {
      localStorage.setItem('laVagueLanguage', 'fr');
      I18n = createI18n();
      const lang = I18n.init();
      expect(lang).toBe('fr');
    });

    it('should fallback to English if saved language is invalid', () => {
      localStorage.setItem('laVagueLanguage', 'invalid');
      I18n = createI18n();
      const lang = I18n.init();
      expect(lang).toBe('en');
    });
  });

  describe('setLanguage', () => {
    it('should set language to French', () => {
      I18n.setLanguage('fr');
      expect(I18n.currentLang).toBe('fr');
    });

    it('should set language to Arabic', () => {
      I18n.setLanguage('ar');
      expect(I18n.currentLang).toBe('ar');
    });

    it('should save language to localStorage by default', () => {
      I18n.setLanguage('fr');
      expect(localStorage.getItem('laVagueLanguage')).toBe('fr');
    });

    it('should not save language when save parameter is false', () => {
      I18n.setLanguage('fr', false);
      expect(localStorage.getItem('laVagueLanguage')).toBeNull();
    });

    it('should fallback to English for invalid language', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const lang = I18n.setLanguage('invalid');
      expect(lang).toBe('en');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));
    });

    it('should dispatch languageChanged event', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      I18n.setLanguage('fr');
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'languageChanged',
          detail: { language: 'fr', dir: 'ltr' }
        })
      );
    });

    it('should update document lang attribute', () => {
      I18n.setLanguage('fr');
      expect(document.documentElement.lang).toBe('fr');
    });

    it('should update document dir attribute', () => {
      I18n.setLanguage('ar');
      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  describe('getTranslation', () => {
    beforeEach(() => {
      I18n.init();
    });

    it('should get simple translation key', () => {
      const translation = I18n.getTranslation('nav.home');
      expect(translation).toBe('Home');
    });

    it('should get nested translation key', () => {
      const translation = I18n.getTranslation('cart.title');
      expect(translation).toBe('Your Cart');
    });

    it('should return French translation when language is French', () => {
      I18n.setLanguage('fr');
      const translation = I18n.getTranslation('nav.home');
      expect(translation).toBe('Accueil');
    });

    it('should return Arabic translation when language is Arabic', () => {
      I18n.setLanguage('ar');
      const translation = I18n.getTranslation('nav.home');
      expect(translation).toBe('الرئيسية');
    });

    it('should fallback to English for missing translation', () => {
      I18n.setLanguage('fr');
      // Add a key that exists in English but not French
      const translation = I18n.getTranslation('toast.viewCart');
      expect(translation).toBe('View Cart');
    });

    it('should return null for non-existent key', () => {
      const translation = I18n.getTranslation('nonexistent.key');
      expect(translation).toBeNull();
    });

    it('should return null for deeply non-existent key', () => {
      const translation = I18n.getTranslation('nav.nonexistent.subkey');
      expect(translation).toBeNull();
    });
  });

  describe('t() - Translation with variables', () => {
    beforeEach(() => {
      I18n.init();
    });

    it('should return translation without variables', () => {
      const translation = I18n.t('nav.home');
      expect(translation).toBe('Home');
    });

    it('should replace single variable', () => {
      // Add a translation with variable
      mockTranslations.en.test = {
        greeting: 'Hello, {{name}}!'
      };
      const translation = I18n.t('test.greeting', { name: 'John' });
      expect(translation).toBe('Hello, John!');
    });

    it('should replace multiple variables', () => {
      mockTranslations.en.test = {
        order: 'Order {{orderId}} - Total: {{total}}'
      };
      const translation = I18n.t('test.order', { orderId: '123', total: '$100' });
      expect(translation).toBe('Order 123 - Total: $100');
    });

    it('should return key if translation not found', () => {
      const translation = I18n.t('nonexistent.key');
      expect(translation).toBe('nonexistent.key');
    });

    it('should handle missing variables gracefully', () => {
      mockTranslations.en.test = {
        greeting: 'Hello, {{name}}!'
      };
      const translation = I18n.t('test.greeting', {});
      expect(translation).toBe('Hello, {{name}}!');
    });
  });

  describe('getCurrentLang', () => {
    it('should return current language code', () => {
      I18n.init();
      expect(I18n.getCurrentLang()).toBe('en');
    });

    it('should return updated language after change', () => {
      I18n.init();
      I18n.setLanguage('fr');
      expect(I18n.getCurrentLang()).toBe('fr');
    });
  });

  describe('getCurrentDir', () => {
    it('should return ltr for English', () => {
      I18n.setLanguage('en');
      expect(I18n.getCurrentDir()).toBe('ltr');
    });

    it('should return ltr for French', () => {
      I18n.setLanguage('fr');
      expect(I18n.getCurrentDir()).toBe('ltr');
    });

    it('should return rtl for Arabic', () => {
      I18n.setLanguage('ar');
      expect(I18n.getCurrentDir()).toBe('rtl');
    });
  });

  describe('isRTL', () => {
    it('should return false for English', () => {
      I18n.setLanguage('en');
      expect(I18n.isRTL()).toBe(false);
    });

    it('should return false for French', () => {
      I18n.setLanguage('fr');
      expect(I18n.isRTL()).toBe(false);
    });

    it('should return true for Arabic', () => {
      I18n.setLanguage('ar');
      expect(I18n.isRTL()).toBe(true);
    });
  });

  describe('Language Metadata', () => {
    it('should have correct metadata for English', () => {
      const meta = mockLanguageMetadata.en;
      expect(meta.code).toBe('en');
      expect(meta.name).toBe('English');
      expect(meta.flag).toBe('🇬🇧');
      expect(meta.dir).toBe('ltr');
    });

    it('should have correct metadata for French', () => {
      const meta = mockLanguageMetadata.fr;
      expect(meta.code).toBe('fr');
      expect(meta.name).toBe('Français');
      expect(meta.flag).toBe('🇫🇷');
      expect(meta.dir).toBe('ltr');
    });

    it('should have correct metadata for Arabic', () => {
      const meta = mockLanguageMetadata.ar;
      expect(meta.code).toBe('ar');
      expect(meta.name).toBe('العربية');
      expect(meta.flag).toBe('🇸🇦');
      expect(meta.dir).toBe('rtl');
    });
  });

  describe('Translation Completeness', () => {
    it('should have all required translation keys in English', () => {
      const en = mockTranslations.en;
      expect(en.nav).toBeDefined();
      expect(en.cart).toBeDefined();
      expect(en.product).toBeDefined();
      expect(en.toast).toBeDefined();
    });

    it('should have all required translation keys in French', () => {
      const fr = mockTranslations.fr;
      expect(fr.nav).toBeDefined();
      expect(fr.cart).toBeDefined();
      expect(fr.product).toBeDefined();
      expect(fr.toast).toBeDefined();
    });

    it('should have all required translation keys in Arabic', () => {
      const ar = mockTranslations.ar;
      expect(ar.nav).toBeDefined();
      expect(ar.cart).toBeDefined();
      expect(ar.product).toBeDefined();
      expect(ar.toast).toBeDefined();
    });

    it('should have matching keys across all languages for core translations', () => {
      const enKeys = Object.keys(mockTranslations.en.nav);
      const frKeys = Object.keys(mockTranslations.fr.nav);
      const arKeys = Object.keys(mockTranslations.ar.nav);
      
      expect(frKeys).toEqual(enKeys);
      expect(arKeys).toEqual(enKeys);
    });
  });
});
