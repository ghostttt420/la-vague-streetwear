/**
 * LA VAGUE - Utility Functions
 * Technical debt fixes: Input masking, debouncing, button states, image optimization
 */

// ==========================================
// INPUT MASKING UTILITIES
// ==========================================

const InputMasks = {
    /**
     * Format credit card number (4242 4242 4242 4242)
     */
    creditCard(value) {
        if (!value) return '';
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Limit to 16 digits
        const limited = digits.substring(0, 16);
        // Add space every 4 digits
        return limited.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    },

    /**
     * Format expiry date (MM / YY)
     */
    expiryDate(value) {
        if (!value) return '';
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Limit to 4 digits
        const limited = digits.substring(0, 4);
        
        if (limited.length >= 2) {
            const month = limited.substring(0, 2);
            const year = limited.substring(2);
            
            // Validate month (01-12)
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

    /**
     * Format phone number based on country
     * Supports: US, UK, NG (Nigeria), CA (Canada), AU (Australia)
     */
    phoneNumber(value, country = 'auto') {
        if (!value) return '';
        
        // Remove all non-digits except +
        let digits = value.replace(/[^\d+]/g, '');
        
        // Auto-detect country from prefix
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
                // Likely Nigerian local format
                country = 'NG';
            } else {
                country = 'US'; // Default
            }
        }
        
        // Remove country code for formatting
        let localDigits = digits;
        if (digits.startsWith('+')) {
            localDigits = digits.substring(1);
        }
        
        switch (country) {
            case 'NG': // Nigeria: +234 XXX XXX XXXX or 0XX XXX XXXX
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
                
            case 'UK': // UK: +44 XXXX XXXXXX
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
                
            case 'AU': // Australia: +61 X XXXX XXXX
                if (localDigits.startsWith('61')) {
                    localDigits = localDigits.substring(2);
                } else if (localDigits.startsWith('0')) {
                    localDigits = localDigits.substring(1);
                }
                localDigits = localDigits.substring(0, 9);
                if (localDigits.length >= 5) {
                    return '+61 ' + localDigits.substring(0, 1) + ' ' + localDigits.substring(1, 5) + ' ' + localDigits.substring(5);
                } else if (localDigits.length > 0) {
                    return '+61 ' + localDigits;
                }
                return '+61';
                
            case 'US':
            case 'CA': // US/Canada: +1 (XXX) XXX-XXXX
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
    },

    /**
     * Format CVV (3-4 digits)
     */
    cvv(value) {
        if (!value) return '';
        return value.replace(/\D/g, '').substring(0, 4);
    },

    /**
     * Unmask any formatted value to get raw digits
     */
    unmask(value) {
        if (!value) return '';
        return value.replace(/\D/g, '');
    }
};

// ==========================================
// DEBOUNCING & THROTTLING
// ==========================================

const DebounceThrottle = {
    /**
     * Debounce function - delays execution until after wait period of inactivity
     */
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

    /**
     * Throttle function - limits execution to once per wait period
     */
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

// ==========================================
// BUTTON STATE MANAGEMENT
// ==========================================

const ButtonState = {
    /**
     * Set button to loading state
     * @param {HTMLButtonElement} button - The button element
     * @param {string} loadingText - Text to show while loading (default: 'Loading...')
     * @param {boolean} addSpinner - Whether to add a spinner icon
     */
    setLoading(button, loadingText = 'Loading...', addSpinner = true) {
        if (!button) return;
        
        // Store original state
        if (!button.dataset.originalText) {
            button.dataset.originalText = button.textContent;
        }
        if (!button.dataset.originalDisabled) {
            button.dataset.originalDisabled = button.disabled;
        }
        
        // Set loading state
        button.disabled = true;
        button.classList.add('btn-loading');
        
        if (addSpinner) {
            button.innerHTML = `
                <span class="btn-spinner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke-linecap="round"/>
                    </svg>
                </span>
                ${loadingText}
            `;
        } else {
            button.textContent = loadingText;
        }
    },

    /**
     * Set button to success state
     * @param {HTMLButtonElement} button - The button element
     * @param {string} successText - Text to show on success (default: 'Success!')
     * @param {number} resetDelay - Delay before resetting (default: 2000ms)
     */
    setSuccess(button, successText = 'Success!', resetDelay = 2000) {
        if (!button) return;
        
        button.disabled = true;
        button.classList.remove('btn-loading');
        button.classList.add('btn-success');
        button.innerHTML = `
            <span class="btn-checkmark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            ${successText}
        `;
        
        if (resetDelay > 0) {
            setTimeout(() => this.reset(button), resetDelay);
        }
    },

    /**
     * Set button to error state
     * @param {HTMLButtonElement} button - The button element
     * @param {string} errorText - Text to show on error (default: 'Error!')
     * @param {number} resetDelay - Delay before resetting (default: 3000ms)
     */
    setError(button, errorText = 'Error!', resetDelay = 3000) {
        if (!button) return;
        
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.classList.add('btn-error');
        button.innerHTML = `
            <span class="btn-error-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            </span>
            ${errorText}
        `;
        
        if (resetDelay > 0) {
            setTimeout(() => this.reset(button), resetDelay);
        }
    },

    /**
     * Reset button to original state
     * @param {HTMLButtonElement} button - The button element
     */
    reset(button) {
        if (!button) return;
        
        button.disabled = button.dataset.originalDisabled === 'true';
        button.classList.remove('btn-loading', 'btn-success', 'btn-error');
        button.textContent = button.dataset.originalText || button.textContent;
    }
};

// ==========================================
// IMAGE OPTIMIZATION
// ==========================================

const ImageOptimizer = {
    // Cache for format support detection
    _supportsWebP: null,
    _supportsAVIF: null,

    /**
     * Detect WebP support
     */
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

    /**
     * Detect AVIF support
     */
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

    /**
     * Get best supported image format
     */
    async getBestFormat() {
        if (await this.supportsAVIF()) return 'avif';
        if (await this.supportsWebP()) return 'webp';
        return 'jpeg';
    },

    /**
     * Create responsive srcset for an image
     * @param {string} baseUrl - Base image URL
     * @param {number[]} widths - Array of widths to generate
     * @returns {string} srcset attribute value
     */
    createSrcset(baseUrl, widths = [400, 800, 1200]) {
        if (!baseUrl || baseUrl.startsWith('data:')) return '';
        
        // For Unsplash images, use their resize API
        if (baseUrl.includes('images.unsplash.com')) {
            return widths
                .map(w => {
                    const url = new URL(baseUrl);
                    url.searchParams.set('w', w);
                    return `${url.toString()} ${w}w`;
                })
                .join(', ');
        }
        
        // For other images, assume the URL supports ?w= or similar
        // This can be customized based on your CDN/image service
        return widths
            .map(w => `${baseUrl}?w=${w} ${w}w`)
            .join(', ');
    },

    /**
     * Generate a low-quality placeholder (LQIP) from an image URL
     * For Unsplash, we use a tiny blurred version
     */
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
    },

    /**
     * Apply blur-up loading effect to an image
     * @param {HTMLImageElement} img - The image element
     * @param {string} src - The final image source
     * @param {Object} options - Options for the effect
     */
    async blurUpLoad(img, src, options = {}) {
        const {
            lqipSrc = this.getLQIP(src),
            transitionDuration = 300
        } = options;
        
        if (!img || !src) return;
        
        // Set up styles for transition
        img.style.transition = `opacity ${transitionDuration}ms ease, filter ${transitionDuration}ms ease`;
        img.style.opacity = '0';
        
        // If we have an LQIP, use it first
        if (lqipSrc) {
            img.style.filter = 'blur(10px)';
            img.src = lqipSrc;
            img.style.opacity = '1';
        }
        
        // Load the full image
        const fullImg = new Image();
        fullImg.onload = () => {
            img.src = src;
            img.style.filter = 'blur(0px)';
            img.style.opacity = '1';
            img.classList.add('img-loaded');
            img.classList.remove('img-loading');
        };
        fullImg.onerror = () => {
            img.classList.add('img-error');
            img.classList.remove('img-loading');
        };
        fullImg.src = src;
        
        img.classList.add('img-loading');
    },

    /**
     * Enhance an existing image with blur-up loading and srcset
     * @param {HTMLImageElement} img - The image element to enhance
     * @param {Object} options - Enhancement options
     */
    async enhanceImage(img, options = {}) {
        if (!img) return;
        
        const {
            enableBlurUp = true,
            enableSrcset = true,
            sizes = '(max-width: 768px) 100vw, 50vw'
        } = options;
        
        const src = img.dataset.src || img.src;
        if (!src || src.startsWith('data:')) return;
        
        // Add srcset if enabled
        if (enableSrcset && !img.srcset) {
            const srcset = this.createSrcset(src);
            if (srcset) {
                img.srcset = srcset;
                img.sizes = sizes;
            }
        }
        
        // Apply blur-up loading if enabled
        if (enableBlurUp) {
            await this.blurUpLoad(img, src);
        }
    },

    /**
     * Initialize image optimization for all images on the page
     * @param {string} selector - CSS selector for images to optimize
     */
    init(selector = 'img[data-optimize="true"]') {
        const images = document.querySelectorAll(selector);
        images.forEach(img => this.enhanceImage(img));
    }
};

// ==========================================
// FORM VALIDATION HELPERS
// ==========================================

const FormValidation = {
    /**
     * Validate credit card number using Luhn algorithm
     */
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

    /**
     * Validate expiry date (not expired)
     */
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

    /**
     * Validate phone number
     */
    isValidPhone(value) {
        const digits = InputMasks.unmask(value);
        // Minimum 10 digits for most countries
        return digits.length >= 10;
    },

    /**
     * Validate email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// ==========================================
// SEARCH WITH DEBOUNCING
// ==========================================

const SearchHelper = {
    /**
     * Create a debounced search handler
     * @param {Function} searchFn - The search function to call
     * @param {number} delay - Debounce delay in ms (default: 300)
     * @returns {Function} Debounced search handler
     */
    createDebouncedSearch(searchFn, delay = 300) {
        return DebounceThrottle.debounce((query) => {
            searchFn(query);
        }, delay);
    },

    /**
     * Initialize search input with debouncing
     * @param {HTMLInputElement} input - The search input element
     * @param {Function} onSearch - Callback function(query)
     * @param {Object} options - Options
     */
    init(input, onSearch, options = {}) {
        if (!input) return;
        
        const {
            delay = 300,
            minLength = 2,
            onFocus = null
        } = options;
        
        const debouncedSearch = this.createDebouncedSearch((query) => {
            if (query.length >= minLength || query.length === 0) {
                onSearch(query);
            }
        }, delay);
        
        input.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
        
        if (onFocus) {
            input.addEventListener('focus', onFocus);
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        InputMasks,
        DebounceThrottle,
        ButtonState,
        ImageOptimizer,
        FormValidation,
        SearchHelper
    };
}
