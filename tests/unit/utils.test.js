/**
 * LA VAGUE - Utils Unit Tests
 * Tests for utility functions
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('Utility Functions', () => {
  describe('DebounceThrottle', () => {
    const DebounceThrottle = {
      debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },

      throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      }
    };

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('debounce', () => {
      it('should delay function execution', () => {
        const func = vi.fn();
        const debouncedFunc = DebounceThrottle.debounce(func, 300);

        debouncedFunc();
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);
        expect(func).toHaveBeenCalledTimes(1);
      });

      it('should reset timer on subsequent calls', () => {
        const func = vi.fn();
        const debouncedFunc = DebounceThrottle.debounce(func, 300);

        debouncedFunc();
        vi.advanceTimersByTime(200);
        debouncedFunc();
        vi.advanceTimersByTime(200);
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(1);
      });

      it('should pass arguments to debounced function', () => {
        const func = vi.fn();
        const debouncedFunc = DebounceThrottle.debounce(func, 300);

        debouncedFunc('arg1', 'arg2');
        vi.advanceTimersByTime(300);
        expect(func).toHaveBeenCalledWith('arg1', 'arg2');
      });

      it('should use default wait time of 300ms', () => {
        const func = vi.fn();
        const debouncedFunc = DebounceThrottle.debounce(func);

        debouncedFunc();
        vi.advanceTimersByTime(299);
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(func).toHaveBeenCalled();
      });
    });

    describe('throttle', () => {
      it('should execute function immediately on first call', () => {
        const func = vi.fn();
        const throttledFunc = DebounceThrottle.throttle(func, 100);

        throttledFunc();
        expect(func).toHaveBeenCalledTimes(1);
      });

      it('should not execute function during throttle period', () => {
        const func = vi.fn();
        const throttledFunc = DebounceThrottle.throttle(func, 100);

        throttledFunc();
        throttledFunc();
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(1);
      });

      it('should execute function again after throttle period', () => {
        const func = vi.fn();
        const throttledFunc = DebounceThrottle.throttle(func, 100);

        throttledFunc();
        vi.advanceTimersByTime(100);
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(2);
      });

      it('should pass arguments to throttled function', () => {
        const func = vi.fn();
        const throttledFunc = DebounceThrottle.throttle(func, 100);

        throttledFunc('arg1', 'arg2');
        expect(func).toHaveBeenCalledWith('arg1', 'arg2');
      });

      it('should use default limit of 100ms', () => {
        const func = vi.fn();
        const throttledFunc = DebounceThrottle.throttle(func);

        throttledFunc();
        vi.advanceTimersByTime(99);
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1);
        throttledFunc();
        expect(func).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('ImageOptimizer', () => {
    const ImageOptimizer = {
      _supportsWebP: null,
      _supportsAVIF: null,

      async supportsWebP() {
        if (this._supportsWebP !== null) return this._supportsWebP;
        
        return new Promise((resolve) => {
          const webP = new Image();
          webP.onload = () => {
            this._supportsWebP = true;
            resolve(true);
          };
          webP.onerror = () => {
            this._supportsWebP = false;
            resolve(false);
          };
          webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
        });
      },

      async supportsAVIF() {
        if (this._supportsAVIF !== null) return this._supportsAVIF;
        
        return new Promise((resolve) => {
          const avif = new Image();
          avif.onload = () => {
            this._supportsAVIF = true;
            resolve(true);
          };
          avif.onerror = () => {
            this._supportsAVIF = false;
            resolve(false);
          };
          avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
      },

      async getBestFormat() {
        if (await this.supportsAVIF()) return 'avif';
        if (await this.supportsWebP()) return 'webp';
        return 'jpeg';
      },

      createSrcset(baseUrl, widths = [400, 800, 1200]) {
        if (!baseUrl || baseUrl.startsWith('data:')) return '';
        
        if (baseUrl.includes('images.unsplash.com')) {
          return widths
            .map(w => {
              const url = new URL(baseUrl);
              url.searchParams.set('w', w);
              return `${url.toString()} ${w}w`;
            })
            .join(', ');
        }
        
        return widths
          .map(w => `${baseUrl}?w=${w} ${w}w`)
          .join(', ');
      },

      getLQIP(url) {
        if (!url || url.startsWith('data:')) return '';
        
        if (url.includes('images.unsplash.com')) {
          const lqipUrl = new URL(url);
          lqipUrl.searchParams.set('w', 20);
          lqipUrl.searchParams.set('q', 10);
          lqipUrl.searchParams.set('blur', 10);
          return lqipUrl.toString();
        }
        
        return '';
      }
    };

    beforeEach(() => {
      ImageOptimizer._supportsWebP = null;
      ImageOptimizer._supportsAVIF = null;
    });

    describe('getBestFormat', () => {
      it('should return cached format if available', async () => {
        ImageOptimizer._supportsAVIF = true;
        const format = await ImageOptimizer.getBestFormat();
        expect(format).toBe('avif');
      });

      it('should prefer AVIF if supported', async () => {
        ImageOptimizer._supportsAVIF = true;
        const format = await ImageOptimizer.getBestFormat();
        expect(format).toBe('avif');
      });

      it('should fallback to WebP if AVIF not supported', async () => {
        ImageOptimizer._supportsAVIF = false;
        ImageOptimizer._supportsWebP = true;
        const format = await ImageOptimizer.getBestFormat();
        expect(format).toBe('webp');
      });

      it('should fallback to jpeg if neither supported', async () => {
        ImageOptimizer._supportsAVIF = false;
        ImageOptimizer._supportsWebP = false;
        const format = await ImageOptimizer.getBestFormat();
        expect(format).toBe('jpeg');
      });
    });

    describe('createSrcset', () => {
      it('should create srcset for Unsplash images', () => {
        const url = 'https://images.unsplash.com/photo-123?w=800&q=80';
        const srcset = ImageOptimizer.createSrcset(url);
        
        expect(srcset).toContain('400w');
        expect(srcset).toContain('800w');
        expect(srcset).toContain('1200w');
      });

      it('should create srcset for regular images', () => {
        const url = 'https://example.com/image.jpg';
        const srcset = ImageOptimizer.createSrcset(url);
        
        expect(srcset).toContain('?w=400');
        expect(srcset).toContain('?w=800');
        expect(srcset).toContain('?w=1200');
      });

      it('should return empty string for data URLs', () => {
        const srcset = ImageOptimizer.createSrcset('data:image/png;base64,abc');
        expect(srcset).toBe('');
      });

      it('should return empty string for empty URL', () => {
        const srcset = ImageOptimizer.createSrcset('');
        expect(srcset).toBe('');
      });

      it('should use custom widths when provided', () => {
        const url = 'https://example.com/image.jpg';
        const srcset = ImageOptimizer.createSrcset(url, [200, 400]);
        
        expect(srcset).toContain('200w');
        expect(srcset).toContain('400w');
        expect(srcset).not.toContain('800w');
      });
    });

    describe('getLQIP', () => {
      it('should generate LQIP for Unsplash images', () => {
        const url = 'https://images.unsplash.com/photo-123?w=800&q=80';
        const lqip = ImageOptimizer.getLQIP(url);
        
        expect(lqip).toContain('w=20');
        expect(lqip).toContain('q=10');
        expect(lqip).toContain('blur=10');
      });

      it('should return empty string for non-Unsplash images', () => {
        const url = 'https://example.com/image.jpg';
        const lqip = ImageOptimizer.getLQIP(url);
        expect(lqip).toBe('');
      });

      it('should return empty string for data URLs', () => {
        const lqip = ImageOptimizer.getLQIP('data:image/png;base64,abc');
        expect(lqip).toBe('');
      });

      it('should return empty string for empty URL', () => {
        const lqip = ImageOptimizer.getLQIP('');
        expect(lqip).toBe('');
      });
    });
  });

  describe('ButtonState', () => {
    const ButtonState = {
      setLoading(button, loadingText = 'Loading...', addSpinner = true) {
        if (!button) return;
        
        if (!button.dataset.originalText) {
          button.dataset.originalText = button.textContent;
        }
        if (!button.dataset.originalDisabled) {
          button.dataset.originalDisabled = button.disabled;
        }
        
        button.disabled = true;
        button.classList.add('btn-loading');
        
        if (addSpinner) {
          button.innerHTML = `<span class="btn-spinner">...</span> ${loadingText}`;
        } else {
          button.textContent = loadingText;
        }
      },

      setSuccess(button, successText = 'Success!', resetDelay = 2000) {
        if (!button) return;
        
        button.disabled = true;
        button.classList.remove('btn-loading');
        button.classList.add('btn-success');
        button.innerHTML = `<span class="btn-checkmark">✓</span> ${successText}`;
      },

      setError(button, errorText = 'Error!', resetDelay = 3000) {
        if (!button) return;
        
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.classList.add('btn-error');
        button.innerHTML = `<span class="btn-error-icon">✗</span> ${errorText}`;
      },

      reset(button) {
        if (!button) return;
        
        button.disabled = button.dataset.originalDisabled === 'true';
        button.classList.remove('btn-loading', 'btn-success', 'btn-error');
        button.textContent = button.dataset.originalText || button.textContent;
      }
    };

    let button;

    beforeEach(() => {
      button = document.createElement('button');
      button.textContent = 'Original Text';
      button.disabled = false;
    });

    describe('setLoading', () => {
      it('should disable button', () => {
        ButtonState.setLoading(button);
        expect(button.disabled).toBe(true);
      });

      it('should add loading class', () => {
        ButtonState.setLoading(button);
        expect(button.classList.contains('btn-loading')).toBe(true);
      });

      it('should change button text', () => {
        ButtonState.setLoading(button, 'Loading...');
        expect(button.textContent).toContain('Loading...');
      });

      it('should store original text', () => {
        ButtonState.setLoading(button);
        expect(button.dataset.originalText).toBe('Original Text');
      });

      it('should handle null button gracefully', () => {
        expect(() => ButtonState.setLoading(null)).not.toThrow();
      });
    });

    describe('setSuccess', () => {
      it('should disable button', () => {
        ButtonState.setSuccess(button);
        expect(button.disabled).toBe(true);
      });

      it('should remove loading class', () => {
        button.classList.add('btn-loading');
        ButtonState.setSuccess(button);
        expect(button.classList.contains('btn-loading')).toBe(false);
      });

      it('should add success class', () => {
        ButtonState.setSuccess(button);
        expect(button.classList.contains('btn-success')).toBe(true);
      });

      it('should change button text', () => {
        ButtonState.setSuccess(button, 'Saved!');
        expect(button.textContent).toContain('Saved!');
      });

      it('should handle null button gracefully', () => {
        expect(() => ButtonState.setSuccess(null)).not.toThrow();
      });
    });

    describe('setError', () => {
      it('should keep button enabled', () => {
        ButtonState.setError(button);
        expect(button.disabled).toBe(false);
      });

      it('should remove loading class', () => {
        button.classList.add('btn-loading');
        ButtonState.setError(button);
        expect(button.classList.contains('btn-loading')).toBe(false);
      });

      it('should add error class', () => {
        ButtonState.setError(button);
        expect(button.classList.contains('btn-error')).toBe(true);
      });

      it('should change button text', () => {
        ButtonState.setError(button, 'Failed!');
        expect(button.textContent).toContain('Failed!');
      });

      it('should handle null button gracefully', () => {
        expect(() => ButtonState.setError(null)).not.toThrow();
      });
    });

    describe('reset', () => {
      it('should restore original text', () => {
        ButtonState.setLoading(button);
        ButtonState.reset(button);
        expect(button.textContent).toBe('Original Text');
      });

      it('should restore original disabled state', () => {
        ButtonState.setLoading(button);
        ButtonState.reset(button);
        expect(button.disabled).toBe(false);
      });

      it('should remove state classes', () => {
        button.classList.add('btn-loading', 'btn-success', 'btn-error');
        ButtonState.reset(button);
        expect(button.classList.contains('btn-loading')).toBe(false);
        expect(button.classList.contains('btn-success')).toBe(false);
        expect(button.classList.contains('btn-error')).toBe(false);
      });

      it('should handle null button gracefully', () => {
        expect(() => ButtonState.reset(null)).not.toThrow();
      });
    });
  });

  describe('SearchHelper', () => {
    const SearchHelper = {
      createDebouncedSearch(searchFn, delay = 300) {
        let timeout;
        return function(query) {
          clearTimeout(timeout);
          timeout = setTimeout(() => searchFn(query), delay);
        };
      }
    };

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce search calls', () => {
      const searchFn = vi.fn();
      const debouncedSearch = SearchHelper.createDebouncedSearch(searchFn, 300);

      debouncedSearch('a');
      debouncedSearch('ab');
      debouncedSearch('abc');

      expect(searchFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(searchFn).toHaveBeenCalledTimes(1);
      expect(searchFn).toHaveBeenCalledWith('abc');
    });

    it('should use custom delay', () => {
      const searchFn = vi.fn();
      const debouncedSearch = SearchHelper.createDebouncedSearch(searchFn, 500);

      debouncedSearch('test');
      vi.advanceTimersByTime(400);
      expect(searchFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(searchFn).toHaveBeenCalled();
    });

    it('should pass query to search function', () => {
      const searchFn = vi.fn();
      const debouncedSearch = SearchHelper.createDebouncedSearch(searchFn, 300);

      debouncedSearch('search query');
      vi.advanceTimersByTime(300);
      expect(searchFn).toHaveBeenCalledWith('search query');
    });
  });
});
