/**
 * LA VAGUE - Homepage JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // STATE
    // ==========================================
    const state = {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
        currentLook: 0,
        lookbookImages: [
            { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80', title: 'Urban Nights', number: '01' },
            { src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', title: 'Daylight', number: '02' },
            { src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80', title: 'Skate Park', number: '03' },
            { src: 'https://images.unsplash.com/photo-1492447273231-0f8fecec1e3a?w=600&q=80', title: 'Downtown', number: '04' },
            { src: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=1200&q=80', title: 'After Hours', number: '05' }
        ]
    };

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const elements = {
        nav: document.getElementById('nav'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        navLinks: document.getElementById('navLinks'),
        featuredProducts: document.getElementById('featuredProducts'),
        cartBtn: document.getElementById('cartBtn'),
        cartOverlay: document.getElementById('cartOverlay'),
        cartSidebar: document.getElementById('cartSidebar'),
        cartClose: document.getElementById('cartClose'),
        cartItems: document.getElementById('cartItems'),
        cartSubtotal: document.getElementById('cartSubtotal'),
        cartCount: document.getElementById('cartCount'),
        wishlistCount: document.getElementById('wishlistCount'),
        wishlistBtn: document.getElementById('wishlistBtn'),
        wishlistOverlay: document.getElementById('wishlistOverlay'),
        wishlistSidebar: document.getElementById('wishlistSidebar'),
        wishlistClose: document.getElementById('wishlistClose'),
        wishlistItems: document.getElementById('wishlistItems'),
        searchOverlay: document.getElementById('searchOverlay'),
        searchBtn: document.getElementById('searchBtn'),
        searchClose: document.getElementById('searchClose'),
        searchInput: document.getElementById('searchInput'),
        searchResults: document.getElementById('searchResults'),
        newsletterForm: document.getElementById('newsletterForm'),
        newsletterEmail: document.getElementById('newsletterEmail'),
        lightbox: document.getElementById('lightbox'),
        lightboxOverlay: document.getElementById('lightboxOverlay'),
        lightboxClose: document.getElementById('lightboxClose'),
        lightboxPrev: document.getElementById('lightboxPrev'),
        lightboxNext: document.getElementById('lightboxNext'),
        lightboxImage: document.getElementById('lightboxImage'),
        lightboxNumber: document.getElementById('lightboxNumber'),
        lightboxTitle: document.getElementById('lightboxTitle'),
        lookbookItems: document.querySelectorAll('.lookbook-item'),
        toastContainer: document.getElementById('toastContainer')
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        // Initialize currency selector
        initCurrencySelector();
        
        renderFeaturedProducts();
        
        // Sync with shared CartState if available
        if (typeof CartState !== 'undefined') {
            state.cart = CartState.cart;
            state.wishlist = CartState.wishlist;
        }
        
        updateCartCount();
        updateWishlistCount();
        bindEvents();
        initRevealAnimations();
        
        // Listen for currency changes
        window.addEventListener('currencyChanged', () => {
            renderFeaturedProducts();
            renderCart();
            renderWishlist();
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
    // FEATURED PRODUCTS
    // ==========================================
    function renderFeaturedProducts() {
        const featured = ProductAPI.getFeatured().slice(0, 4);
        
        elements.featuredProducts.innerHTML = featured.map((product, index) => {
            const mainImage = product.images[0];
            const hoverImage = product.images[1];
            const hasUnsplash = mainImage.src.includes('images.unsplash.com');
            
            // Generate srcset for responsive images
            const srcset = hasUnsplash ? ImageOptimizer.createSrcset(mainImage.src, [400, 800, 1200]) : '';
            
            return `
            <article class="product-card reveal-up" onclick="window.location.href='product.html?slug=${product.slug}'">
                <div class="product-image-wrapper">
                    ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                    <img 
                        data-src="${mainImage.src}" 
                        data-optimize="true"
                        alt="${mainImage.alt}" 
                        class="product-image img-loading" 
                        loading="lazy"
                        ${srcset ? `srcset="${srcset}" sizes="(max-width: 768px) 50vw, 25vw"` : `src="${mainImage.src}"`}
                        onload="this.classList.remove('img-loading'); this.classList.add('img-loaded');"
                    >
                    ${hoverImage ? `
                        <img 
                            src="${hoverImage.src}" 
                            alt="${hoverImage.alt}" 
                            class="product-image-hover" 
                            loading="lazy"
                        >` : ''}
                </div>
                <div class="product-info">
                    <p class="product-category">${CATEGORIES.find(c => c.id === product.category)?.name}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${CurrencyConfig.formatPrice(product.price)}</span>
                        ${product.compareAtPrice ? `<span class="original-price">${CurrencyConfig.formatPrice(product.compareAtPrice)}</span>` : ''}
                    </div>
                </div>
            </article>
        `}).join('');
        
        // Apply blur-up loading for images with data-optimize attribute
        if (typeof ImageOptimizer !== 'undefined') {
            setTimeout(() => {
                document.querySelectorAll('img[data-optimize="true"]').forEach(img => {
                    if (img.dataset.src) {
                        ImageOptimizer.blurUpLoad(img, img.dataset.src);
                    }
                });
            }, 100);
        }
    }

    // ==========================================
    // CART
    // ==========================================
    function renderCart() {
        if (state.cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-secondary" onclick="window.closeCart()">Continue Shopping</a>
                </div>
            `;
        } else {
            elements.cartItems.innerHTML = state.cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-variant">${item.color} / ${item.size}</p>
                        <div class="cart-item-actions">
                            <div class="cart-item-qty">
                                <button onclick="window.updateCartQty(${index}, -1)">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="window.updateCartQty(${index}, 1)">+</button>
                            </div>
                            <span class="cart-item-price">${CurrencyConfig.formatPrice(item.price * item.quantity)}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.removeFromCart(${index})">×</button>
                </div>
            `).join('');
        }
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.cartSubtotal.textContent = CurrencyConfig.formatPrice(subtotal);
    }
    
    function openCart() {
        renderCart();
        elements.cartSidebar.classList.add('active');
        elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    window.closeCart = function() {
        elements.cartSidebar.classList.remove('active');
        elements.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    window.updateCartQty = function(index, delta) {
        const item = state.cart[index];
        const newQty = item.quantity + delta;
        if (newQty < 1) {
            state.cart.splice(index, 1);
        } else {
            item.quantity = newQty;
        }
        saveCart();
        renderCart();
        updateCartCount();
    };
    
    window.removeFromCart = function(index) {
        state.cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartCount();
        showToast('Item removed from cart', 'success');
    };
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }
    
    function updateCartCount() {
        const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = count;
        elements.cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // ==========================================
    // WISHLIST
    // ==========================================
    function renderWishlist() {
        if (state.wishlist.length === 0) {
            elements.wishlistItems.innerHTML = `
                <div class="wishlist-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <p>Your wishlist is empty</p>
                    <a href="shop.html" class="btn btn-secondary" onclick="window.closeWishlist()">Start Shopping</a>
                </div>
            `;
            return;
        }
        const wishlistProducts = state.wishlist.map(id => ProductAPI.getById(id)).filter(p => p);
        elements.wishlistItems.innerHTML = wishlistProducts.map(product => `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <img src="${product.images[0].src}" alt="${product.name}">
                </div>
                <div class="wishlist-item-details">
                    <h4 onclick="window.location.href='product.html?slug=${product.slug}'">${product.name}</h4>
                    <p class="wishlist-item-price">${CurrencyConfig.formatPrice(product.price)}</p>
                    <div class="wishlist-item-actions">
                        <button class="btn-add-cart-sm" onclick="window.addToCartFromWishlist('${product.id}')">Add to Cart</button>
                        <button class="btn-remove-sm" onclick="window.removeFromWishlist('${product.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function openWishlist() {
        renderWishlist();
        elements.wishlistSidebar.classList.add('active');
        elements.wishlistOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    window.closeWishlist = function() {
        elements.wishlistSidebar.classList.remove('active');
        elements.wishlistOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    window.addToCartFromWishlist = function(productId) {
        const product = ProductAPI.getById(productId);
        if (!product) return;
        const item = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0].src,
            color: product.colors[0]?.name || 'One Size',
            size: product.sizes[0],
            quantity: 1
        };
        const existingItem = state.cart.find(i => i.id === item.id && i.color === item.color && i.size === item.size);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push(item);
        }
        saveCart();
        updateCartCount();
        showToast(`${product.name} added to cart`, 'success');
    };
    
    window.removeFromWishlist = function(productId) {
        const index = state.wishlist.indexOf(productId);
        if (index > -1) {
            state.wishlist.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
            renderWishlist();
            updateWishlistCount();
            showToast('Removed from wishlist', 'success');
        }
    };
    
    function updateWishlistCount() {
        const count = state.wishlist.length;
        elements.wishlistCount.textContent = count;
        elements.wishlistCount.classList.toggle('active', count > 0);
    }

    // ==========================================
    // SEARCH
    // ==========================================
    function openSearch() {
        elements.searchOverlay.classList.add('active');
        elements.searchInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
        elements.searchOverlay.classList.remove('active');
        elements.searchInput.value = '';
        elements.searchResults.innerHTML = '';
        document.body.style.overflow = '';
    }

    function handleSearch(query) {
        if (!query.trim()) {
            elements.searchResults.innerHTML = '';
            return;
        }
        
        const results = ProductAPI.search(query);
        
        if (results.length === 0) {
            elements.searchResults.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                    No products found for "${query}"
                </div>
            `;
            return;
        }
        
        elements.searchResults.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="window.location.href='product.html?slug=${product.slug}'">
                <img src="${product.images[0].src}" alt="${product.name}">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${CATEGORIES.find(c => c.id === product.category)?.name}</p>
                </div>
                <span class="search-result-price">${CurrencyConfig.formatPrice(product.price)}</span>
            </div>
        `).join('');
    }

    // ==========================================
    // LIGHTBOX
    // ==========================================
    function openLightbox(index) {
        state.currentLook = index;
        updateLightbox();
        elements.lightbox.classList.add('active');
        elements.lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        elements.lightbox.classList.remove('active');
        elements.lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const look = state.lookbookImages[state.currentLook];
        elements.lightboxImage.src = look.src;
        elements.lightboxImage.alt = look.title;
        elements.lightboxNumber.textContent = look.number;
        elements.lightboxTitle.textContent = look.title;
    }

    function prevLook() {
        state.currentLook = (state.currentLook - 1 + state.lookbookImages.length) % state.lookbookImages.length;
        updateLightbox();
    }

    function nextLook() {
        state.currentLook = (state.currentLook + 1) % state.lookbookImages.length;
        updateLightbox();
    }

    // ==========================================
    // TOAST
    // ==========================================
    function showToast(message, type = 'success', action = null) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            ${action ? `<span class="toast-action" onclick="window.openCart()">${action}</span>` : ''}
        `;
        
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toast-in 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ==========================================
    // NEWSLETTER
    // ==========================================
    async function handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = elements.newsletterEmail.value;
        const submitBtn = elements.newsletterForm.querySelector('button[type="submit"]');
        
        // Validate email
        if (!FormValidation.isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            elements.newsletterEmail.classList.add('error');
            setTimeout(() => elements.newsletterEmail.classList.remove('error'), 2000);
            return;
        }
        
        // Set loading state
        ButtonState.setLoading(submitBtn, 'Subscribing...', true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success
        ButtonState.setSuccess(submitBtn, 'Subscribed!', 2000);
        elements.newsletterForm.reset();
        showToast('Welcome to the wave! Check your email.', 'success');
    }

    // ==========================================
    // REVEAL ANIMATIONS
    // ==========================================
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================
    // EVENTS
    // ==========================================
    function bindEvents() {
        // Navigation
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.nav.classList.add('scrolled');
            } else {
                elements.nav.classList.remove('scrolled');
            }
        }, { passive: true });
        
        elements.mobileMenuBtn?.addEventListener('click', () => {
            elements.mobileMenuBtn.classList.toggle('active');
            elements.navLinks?.classList.toggle('active');
        });
        
        // Cart
        elements.cartBtn?.addEventListener('click', openCart);
        elements.cartClose?.addEventListener('click', window.closeCart);
        elements.cartOverlay?.addEventListener('click', window.closeCart);
        
        // Wishlist
        elements.wishlistBtn?.addEventListener('click', openWishlist);
        elements.wishlistClose?.addEventListener('click', window.closeWishlist);
        elements.wishlistOverlay?.addEventListener('click', window.closeWishlist);
        
        // Search with debouncing
        elements.searchBtn?.addEventListener('click', openSearch);
        elements.searchClose?.addEventListener('click', closeSearch);
        
        // Use SearchHelper for consistent debouncing
        SearchHelper.init(elements.searchInput, handleSearch, {
            delay: 300,
            minLength: 1
        });
        
        // Lightbox
        elements.lookbookItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
        
        elements.lightboxClose?.addEventListener('click', closeLightbox);
        elements.lightboxOverlay?.addEventListener('click', closeLightbox);
        elements.lightboxPrev?.addEventListener('click', prevLook);
        elements.lightboxNext?.addEventListener('click', nextLook);
        
        // Newsletter
        elements.newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                closeLightbox();
                window.closeCart();
                window.closeWishlist();
                
                if (elements.navLinks?.classList.contains('active')) {
                    elements.mobileMenuBtn?.click();
                }
            }
            
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
            
            if (elements.lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') prevLook();
                if (e.key === 'ArrowRight') nextLook();
            }
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = elements.nav?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Start
    init();
});
