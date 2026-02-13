/**
 * LA VAGUE - Product Detail Page JavaScript
 * Connected to Backend API
 */

// ==========================================
// API CONFIGURATION
// ==========================================
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://la-vague-api.onrender.com/api';

// API Client for Product Page
const ProductDetailAPI = {
    async getProductBySlug(slug) {
        try {
            const response = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`);
            if (!response.ok) {
                console.error(`[API] Product fetch failed: ${response.status}`);
                throw new Error('Product not found');
            }
            const data = await response.json();
            console.log('[API] Product fetched:', data.product?.name);
            return data.product ? transformProduct(data.product) : null;
        } catch (error) {
            console.error('[API] Error fetching product:', error.message);
            console.warn('[API] Falling back to static data');
            // Fallback to static data
            return ProductAPI.getBySlug(slug);
        }
    },
    
    async getAllProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            return data.products ? data.products.map(transformProduct) : [];
        } catch (error) {
            return ProductAPI.getAll();
        }
    },
    
    async checkStock(productId, color, size) {
        try {
            const response = await fetch(`${API_URL}/inventory/check/${productId}?color=${encodeURIComponent(color)}&size=${encodeURIComponent(size)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            return { available: 999, inStock: true };
        }
    },
    
    async joinWaitlist(productId, color, size, email, name) {
        try {
            const response = await fetch(`${API_URL}/waitlist/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, color, size, email, name })
            });
            const data = await response.json();
            return { success: response.ok, ...data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Transform database product to frontend format
function transformProduct(dbProduct) {
    return {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        category: dbProduct.category,
        price: dbProduct.price,
        compareAtPrice: dbProduct.compare_at_price || dbProduct.compareAtPrice,
        description: dbProduct.description,
        features: Array.isArray(dbProduct.features) ? dbProduct.features : JSON.parse(dbProduct.features || '[]'),
        images: Array.isArray(dbProduct.images) ? dbProduct.images : JSON.parse(dbProduct.images || '[]'),
        colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : JSON.parse(dbProduct.colors || '[]'),
        sizes: Array.isArray(dbProduct.sizes) ? dbProduct.sizes : JSON.parse(dbProduct.sizes || '[]'),
        inventory: typeof dbProduct.inventory === 'object' ? dbProduct.inventory : JSON.parse(dbProduct.inventory || '{}'),
        tags: Array.isArray(dbProduct.tags) ? dbProduct.tags : JSON.parse(dbProduct.tags || '[]'),
        badge: dbProduct.badge,
        createdAt: dbProduct.created_at || dbProduct.createdAt,
        sizeGuide: getSizeGuideForCategory(dbProduct.category)
    };
}

function getSizeGuideForCategory(category) {
    const guides = {
        hoodies: 'oversized',
        tees: 'regular',
        bottoms: 'pants',
        accessories: 'none'
    };
    return guides[category] || 'regular';
}

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // STATE
    // ==========================================
    const state = {
        product: null,
        currentImageIndex: 0,
        selectedColor: null,
        selectedSize: null,
        quantity: 1,
        usingStaticData: false
    };
    
    // Use shared CartState for cart and wishlist
    const getCart = () => typeof CartState !== 'undefined' ? CartState.cart : [];
    const getWishlist = () => typeof CartState !== 'undefined' ? CartState.wishlist : [];

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const elements = {
        // Product info
        breadcrumbProduct: document.getElementById('breadcrumbProduct'),
        mainImage: document.getElementById('mainImage'),
        galleryThumbs: document.getElementById('galleryThumbs'),
        galleryPrev: document.getElementById('galleryPrev'),
        galleryNext: document.getElementById('galleryNext'),
        productCategory: document.getElementById('productCategory'),
        productTitle: document.getElementById('productTitle'),
        productPrice: document.getElementById('productPrice'),
        productOriginalPrice: document.getElementById('productOriginalPrice'),
        productShortDesc: document.getElementById('productShortDesc'),
        productDescription: document.getElementById('productDescription'),
        productFeatures: document.getElementById('productFeatures'),
        selectedColor: document.getElementById('selectedColor'),
        selectedSize: document.getElementById('selectedSize'),
        colorSelector: document.getElementById('colorSelector'),
        sizeSelector: document.getElementById('sizeSelector'),
        sizeGroup: document.getElementById('sizeGroup'),
        qtyMinus: document.getElementById('qtyMinus'),
        qtyPlus: document.getElementById('qtyPlus'),
        quantity: document.getElementById('quantity'),
        addToCartBtn: document.getElementById('addToCartBtn'),
        wishlistToggleBtn: document.getElementById('wishlistToggleBtn'),
        sizeGuideBtn: document.getElementById('sizeGuideBtn'),
        relatedGrid: document.getElementById('relatedGrid'),
        
        // Navigation
        nav: document.getElementById('nav'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        navLinks: document.getElementById('navLinks'),
        cartCount: document.getElementById('cartCount'),
        wishlistCount: document.getElementById('wishlistCount'),
        wishlistBtn: document.getElementById('wishlistBtn'),
        cartBtn: document.getElementById('cartBtn'),
        cartSidebar: document.getElementById('cartSidebar'),
        cartOverlay: document.getElementById('cartOverlay'),
        cartClose: document.getElementById('cartClose'),
        cartItems: document.getElementById('cartItems'),
        cartSubtotal: document.getElementById('cartSubtotal'),
        wishlistSidebar: document.getElementById('wishlistSidebar'),
        wishlistOverlay: document.getElementById('wishlistOverlay'),
        wishlistClose: document.getElementById('wishlistClose'),
        wishlistItems: document.getElementById('wishlistItems'),
        
        // Search
        searchOverlay: document.getElementById('searchOverlay'),
        searchBtn: document.getElementById('searchBtn'),
        searchClose: document.getElementById('searchClose'),
        searchInput: document.getElementById('searchInput'),
        searchResults: document.getElementById('searchResults'),
        
        // Size Guide
        sizeGuideModal: document.getElementById('sizeGuideModal'),
        sizeGuideOverlay: document.getElementById('sizeGuideOverlay'),
        sizeGuideClose: document.getElementById('sizeGuideClose'),
        sizeGuideContent: document.getElementById('sizeGuideContent'),
        
        // Toast
        toastContainer: document.getElementById('toastContainer'),
        
        // Accordion
        accordionHeaders: document.querySelectorAll('.accordion-header')
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    async function init() {
        // Get product from URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            window.location.href = 'shop.html';
            return;
        }
        
        // Try API first, fallback to static
        state.product = await ProductDetailAPI.getProductBySlug(slug);
        state.usingStaticData = !state.product?._fromAPI;
        
        if (!state.product) {
            console.error('[INIT] Product not found, redirecting to shop...');
            showToast('Product not found. Redirecting to shop...', 'error');
            setTimeout(() => {
                window.location.href = 'shop.html';
            }, 2000);
            return;
        }
        
        // Set initial selections
        state.selectedColor = state.product.colors[0]?.name;
        state.selectedSize = state.product.sizes[0];
        
        // Render product
        renderProduct();
        await renderRelatedProducts();
        CartState.updateCartCount();
        CartState.updateWishlistCount();
        updateWishlistButton();
        
        // Initialize reviews
        initReviews(state.product.id);
        
        // Bind events
        bindEvents();
        
        // Update page meta
        updatePageMeta();
    }

    // ==========================================
    // RENDER PRODUCT
    // ==========================================
    function renderProduct() {
        const p = state.product;
        
        // Breadcrumb
        elements.breadcrumbProduct.textContent = p.name;
        
        // Images
        renderGallery();
        
        // Info
        elements.productCategory.textContent = CATEGORIES.find(c => c.id === p.category)?.name;
        elements.productTitle.textContent = p.name;
        elements.productPrice.textContent = CurrencyConfig.formatPrice(p.price);
        elements.productOriginalPrice.textContent = p.compareAtPrice ? CurrencyConfig.formatPrice(p.compareAtPrice) : '';
        elements.productShortDesc.textContent = p.description;
        elements.productDescription.textContent = p.description;
        
        // Features
        elements.productFeatures.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
        
        // Colors
        if (p.colors.length > 1) {
            elements.colorSelector.innerHTML = p.colors.map(color => `
                <button class="color-btn ${state.selectedColor === color.name ? 'active' : ''}" 
                        style="background-color: ${color.value}"
                        onclick="window.selectColor('${color.name}')"
                        title="${color.name}"></button>
            `).join('');
        } else {
            elements.colorSelector.parentElement.style.display = 'none';
        }
        
        // Sizes
        renderSizes();
        
        // Show/hide size guide
        if (!p.sizeGuide) {
            elements.sizeGuideBtn.style.display = 'none';
        }
        
        // Check stock status and render waitlist if needed
        checkAndRenderWaitlist();
    }
    
    async function checkAndRenderWaitlist() {
        const p = state.product;
        const variantKey = `${state.selectedColor}-${state.selectedSize}`;
        const stock = p.inventory[variantKey] || 0;
        
        // Remove existing waitlist UI
        const existingWaitlist = document.getElementById('waitlistSection');
        if (existingWaitlist) {
            existingWaitlist.remove();
        }
        
        if (stock === 0) {
            // Show waitlist UI
            const waitlistHTML = `
                <div id="waitlistSection" class="waitlist-section" style="
                    margin-top: 1.5rem;
                    padding: 1.25rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 12px;
                    border: 1px solid #dee2e6;
                ">
                    <div class="waitlist-header" style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 1rem;
                    ">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <div>
                            <p style="font-weight: 600; color: #212529; margin: 0;">Out of Stock</p>
                            <p style="font-size: 0.875rem; color: #6c757d; margin: 0;">Get notified when this item is back in stock</p>
                        </div>
                    </div>
                    <div class="waitlist-form" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                        <input 
                            type="email" 
                            id="waitlistEmail" 
                            placeholder="Enter your email" 
                            style="
                                flex: 1;
                                min-width: 200px;
                                padding: 0.75rem 1rem;
                                border: 1px solid #ced4da;
                                border-radius: 8px;
                                font-size: 0.9375rem;
                            "
                        >
                        <button 
                            id="waitlistBtn"
                            style="
                                padding: 0.75rem 1.5rem;
                                background: #212529;
                                color: #fff;
                                border: none;
                                border-radius: 8px;
                                font-weight: 500;
                                cursor: pointer;
                                white-space: nowrap;
                            "
                        >
                            Notify Me
                        </button>
                    </div>
                    <p id="waitlistMessage" style="margin-top: 0.75rem; font-size: 0.875rem; display: none;"></p>
                </div>
            `;
            
            // Insert after add to cart button
            elements.addToCartBtn.parentElement.insertAdjacentHTML('afterend', waitlistHTML);
            
            // Bind waitlist events
            document.getElementById('waitlistBtn').addEventListener('click', handleWaitlistSignup);
            document.getElementById('waitlistEmail').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleWaitlistSignup();
            });
            
            // Disable add to cart
            elements.addToCartBtn.disabled = true;
            elements.addToCartBtn.style.opacity = '0.5';
            elements.addToCartBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 6h15l-1.5 9h-12z"></path>
                    <circle cx="9" cy="20" r="1"></circle>
                    <circle cx="18" cy="20" r="1"></circle>
                    <path d="M6 6L5 3H2"></path>
                </svg>
                <span>Out of Stock</span>
            `;
        } else {
            // Enable add to cart
            elements.addToCartBtn.disabled = false;
            elements.addToCartBtn.style.opacity = '1';
            elements.addToCartBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 6h15l-1.5 9h-12z"></path>
                    <circle cx="9" cy="20" r="1"></circle>
                    <circle cx="18" cy="20" r="1"></circle>
                    <path d="M6 6L5 3H2"></path>
                </svg>
                <span data-i18n="product.addToCart">Add to Cart</span>
            `;
        }
    }
    
    async function handleWaitlistSignup() {
        const emailInput = document.getElementById('waitlistEmail');
        const messageEl = document.getElementById('waitlistMessage');
        const email = emailInput.value.trim();
        
        if (!email) {
            messageEl.textContent = 'Please enter your email address';
            messageEl.style.color = '#e74c3c';
            messageEl.style.display = 'block';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageEl.textContent = 'Please enter a valid email address';
            messageEl.style.color = '#e74c3c';
            messageEl.style.display = 'block';
            return;
        }
        
        const btn = document.getElementById('waitlistBtn');
        btn.disabled = true;
        btn.textContent = 'Adding...';
        
        const result = await ProductDetailAPI.joinWaitlist(
            state.product.id,
            state.selectedColor,
            state.selectedSize,
            email
        );
        
        if (result.success) {
            messageEl.textContent = 'You\'ll be notified when this item is back in stock!';
            messageEl.style.color = '#27ae60';
            messageEl.style.display = 'block';
            emailInput.value = '';
            btn.textContent = 'Added!';
            
            showToast('Added to waitlist successfully!', 'success');
        } else {
            messageEl.textContent = result.error || 'Something went wrong. Please try again.';
            messageEl.style.color = '#e74c3c';
            messageEl.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Notify Me';
        }
    }

    function renderGallery() {
        const images = state.product.images || [];
        
        // Fallback if no images
        if (images.length === 0) {
            const placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect fill="%231f2937" width="600" height="750"/><text fill="%239ca3af" x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="24">No Image Available</text></svg>';
            elements.mainImage.src = placeholder;
            elements.mainImage.alt = state.product.name;
            elements.galleryThumbs.innerHTML = '';
            elements.galleryPrev.style.display = 'none';
            elements.galleryNext.style.display = 'none';
            return;
        }
        
        // Ensure current index is valid
        if (state.currentImageIndex >= images.length) {
            state.currentImageIndex = 0;
        }
        
        // Main image
        const currentImage = images[state.currentImageIndex] || images[0];
        elements.mainImage.src = currentImage.src;
        elements.mainImage.alt = currentImage.alt || state.product.name;
        
        // Thumbs
        elements.galleryThumbs.innerHTML = images.map((img, i) => `
            <img src="${img.src}" alt="${img.alt || ''}" 
                 class="gallery-thumb ${i === state.currentImageIndex ? 'active' : ''}"
                 onclick="window.setImage(${i})">
        `).join('');
        
        // Nav visibility
        elements.galleryPrev.style.display = images.length > 1 ? 'flex' : 'none';
        elements.galleryNext.style.display = images.length > 1 ? 'flex' : 'none';
    }

    function renderSizes() {
        const p = state.product;
        
        if (p.sizes.length === 1 && p.sizes[0] === 'OS') {
            elements.sizeGroup.style.display = 'none';
            return;
        }
        
        elements.sizeSelector.innerHTML = p.sizes.map(size => {
            const inStock = p.inventory[`${state.selectedColor}-${size}`] > 0;
            return `
                <button class="size-btn ${state.selectedSize === size ? 'active' : ''} ${!inStock ? 'disabled' : ''}"
                        onclick="${inStock ? `window.selectSize('${size}')` : ''}"
                        ${!inStock ? 'disabled' : ''}>
                    ${size}
                </button>
            `;
        }).join('');
        
        elements.selectedSize.textContent = state.selectedSize;
    }

    async function renderRelatedProducts() {
        // Get all products and filter for related (same category, excluding current)
        let allProducts;
        try {
            allProducts = await ProductDetailAPI.getAllProducts();
        } catch (e) {
            allProducts = ProductAPI.getAll();
        }
        
        const related = allProducts
            .filter(p => p.category === state.product.category && p.id !== state.product.id)
            .slice(0, 4);
        
        if (related.length === 0) {
            elements.relatedGrid.innerHTML = '';
            return;
        }
        
        elements.relatedGrid.innerHTML = related.map(product => `
            <article class="product-card" onclick="window.location.href='product.html?slug=${product.slug}'">
                <div class="product-image-wrapper">
                    ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                    <img src="${product.images[0]?.src || ''}" alt="${product.images[0]?.alt || product.name}" class="product-image" loading="lazy">
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
        `).join('');
    }

    // ==========================================
    // ACTIONS
    // ==========================================
    window.setImage = function(index) {
        state.currentImageIndex = index;
        renderGallery();
    };

    window.selectColor = function(colorName) {
        state.selectedColor = colorName;
        elements.selectedColor.textContent = colorName;
        renderSizes();
        checkAndRenderWaitlist();
        
        // Update main image if color has specific image
        const color = state.product.colors.find(c => c.name === colorName);
        if (color && color.imageIndex !== undefined) {
            window.setImage(color.imageIndex);
        }
    };

    window.selectSize = function(size) {
        state.selectedSize = size;
        renderSizes();
        checkAndRenderWaitlist();
    };

    function updateQuantity(delta) {
        state.quantity = Math.max(1, state.quantity + delta);
        elements.quantity.textContent = state.quantity;
        elements.qtyMinus.disabled = state.quantity <= 1;
    }

    // ==========================================
    // CART
    // ==========================================
    async function addToCart() {
        // Check inventory if using API
        if (!state.usingStaticData) {
            const stockCheck = await ProductDetailAPI.checkStock(
                state.product.id, 
                state.selectedColor, 
                state.selectedSize
            );
            
            if (!stockCheck.inStock) {
                showToast('Sorry, this item is out of stock', 'error');
                return;
            }
            
            if (stockCheck.available < state.quantity) {
                showToast(`Only ${stockCheck.available} items available`, 'error');
                return;
            }
        }
        
        const item = {
            id: state.product.id,
            name: state.product.name,
            price: state.product.price,
            image: state.product.images[0]?.src || '',
            color: state.selectedColor,
            size: state.selectedSize,
            quantity: state.quantity
        };
        
        CartState.addToCart(item);
        
        // Reset quantity
        state.quantity = 1;
        elements.quantity.textContent = 1;
        elements.qtyMinus.disabled = true;
        
        // Update button text with translation
        const addToCartText = (typeof I18n !== 'undefined') ? I18n.t('product.addToCart') : 'Add to Cart';
        elements.addToCartBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 6h15l-1.5 9h-12z"></path>
                <circle cx="9" cy="20" r="1"></circle>
                <circle cx="18" cy="20" r="1"></circle>
                <path d="M6 6L5 3H2"></path>
            </svg>
            <span>${addToCartText}</span>
        `;
    }

    // ==========================================
    // WISHLIST
    // ==========================================
    function toggleWishlist() {
        CartState.addToWishlist(state.product.id);
        updateWishlistButton();
    }

    function updateWishlistButton() {
        const isInWishlist = getWishlist().includes(state.product.id);
        elements.wishlistToggleBtn.classList.toggle('active', isInWishlist);
    }

    // ==========================================
    // SIZE GUIDE
    // ==========================================
    function openSizeGuide() {
        const guide = ProductAPI.getSizeGuide(state.product.sizeGuide);
        if (!guide) return;
        
        elements.sizeGuideContent.innerHTML = `
            <h4>${guide.name}</h4>
            <p style="color: var(--color-text-muted); margin-bottom: 1rem;">All measurements are in ${guide.unit}</p>
            <table class="size-table">
                <thead>
                    <tr>
                        <th>Size</th>
                        ${Object.keys(guide.measurements[0]).filter(k => k !== 'size').map(k => `<th>${k.charAt(0).toUpperCase() + k.slice(1)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${guide.measurements.map(m => `
                        <tr>
                            <td><strong>${m.size}</strong></td>
                            ${Object.entries(m).filter(([k]) => k !== 'size').map(([_, v]) => `<td>${v}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="size-note" data-i18n="sizeGuide.note">
                <strong>Note:</strong> Measurements may vary slightly. For the best fit, measure a similar garment you own and compare.
            </div>
        `;
        
        elements.sizeGuideModal.classList.add('active');
        elements.sizeGuideOverlay.classList.add('active');
    }

    function closeSizeGuide() {
        elements.sizeGuideModal.classList.remove('active');
        elements.sizeGuideOverlay.classList.remove('active');
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
    // TOAST
    // ==========================================
    function showToast(message, type = 'success', action = null) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            ${action ? `<span class="toast-action">${action}</span>` : ''}
        `;
        
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toast-in 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ==========================================
    // PAGE META
    // ==========================================
    function updatePageMeta() {
        document.title = state.product.meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', state.product.meta.description);
        
        // Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        
        if (ogTitle) ogTitle.setAttribute('content', state.product.meta.title);
        if (ogDesc) ogDesc.setAttribute('content', state.product.meta.description);
        if (ogImage) ogImage.setAttribute('content', state.product.images[0].src);
    }

    // ==========================================
    // EVENTS
    // ==========================================
    function bindEvents() {
        // Gallery navigation
        elements.galleryPrev?.addEventListener('click', () => {
            const newIndex = state.currentImageIndex - 1;
            if (newIndex >= 0) window.setImage(newIndex);
        });
        
        elements.galleryNext?.addEventListener('click', () => {
            const newIndex = state.currentImageIndex + 1;
            if (newIndex < state.product.images.length) window.setImage(newIndex);
        });
        
        // Quantity
        elements.qtyMinus?.addEventListener('click', () => updateQuantity(-1));
        elements.qtyPlus?.addEventListener('click', () => updateQuantity(1));
        
        // Add to cart
        elements.addToCartBtn?.addEventListener('click', addToCart);
        
        // Wishlist
        elements.wishlistToggleBtn?.addEventListener('click', toggleWishlist);
        
        // Size guide
        elements.sizeGuideBtn?.addEventListener('click', openSizeGuide);
        elements.sizeGuideClose?.addEventListener('click', closeSizeGuide);
        elements.sizeGuideOverlay?.addEventListener('click', closeSizeGuide);
        
        // Search with debouncing
        elements.searchBtn?.addEventListener('click', openSearch);
        elements.searchClose?.addEventListener('click', closeSearch);
        
        // Use SearchHelper for consistent debouncing
        SearchHelper.init(elements.searchInput, handleSearch, {
            delay: 300,
            minLength: 1
        });
        
        // Accordion
        elements.accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all
                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                
                // Open clicked if wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        
        // Navigation
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                elements.nav?.classList.add('scrolled');
            } else {
                elements.nav?.classList.remove('scrolled');
            }
        }, { passive: true });
        
        elements.mobileMenuBtn?.addEventListener('click', () => {
            elements.mobileMenuBtn.classList.toggle('active');
            elements.navLinks?.classList.toggle('active');
        });
        
        // Cart - use CartState functions
        elements.cartBtn?.addEventListener('click', window.openCart);
        elements.cartClose?.addEventListener('click', window.closeCart);
        elements.cartOverlay?.addEventListener('click', window.closeCart);
        
        // Wishlist - use CartState functions
        elements.wishlistBtn?.addEventListener('click', window.openWishlist);
        elements.wishlistClose?.addEventListener('click', window.closeWishlist);
        elements.wishlistOverlay?.addEventListener('click', window.closeWishlist);
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                closeSizeGuide();
                closeReviewModal();
            }
            
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
            
            // Gallery arrow keys
            if (e.key === 'ArrowLeft' && state.currentImageIndex > 0) {
                window.setImage(state.currentImageIndex - 1);
            }
            if (e.key === 'ArrowRight' && state.currentImageIndex < state.product.images.length - 1) {
                window.setImage(state.currentImageIndex + 1);
            }
        });
    }

    // ==========================================
    // CART & WISHLIST (Using CartState)
    // ==========================================
    
    // Override CartState render functions for this page's UI
    const originalRenderCart = CartState.renderCart;
    CartState.renderCart = function() {
        const cart = getCart();
        if (cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-secondary" onclick="window.closeCart()">Continue Shopping</a>
                </div>
            `;
        } else {
            elements.cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="cart-item-variant">${item.color} / ${item.size}</p>
                        <div class="cart-item-actions">
                            <div class="cart-item-qty">
                                <button onclick="window.productUpdateCartQty(${index}, -1)">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="window.productUpdateCartQty(${index}, 1)">+</button>
                            </div>
                            <span class="cart-item-price">${CurrencyConfig.formatPrice(item.price * item.quantity)}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="window.productRemoveFromCart(${index})">×</button>
                </div>
            `).join('');
        }
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.cartSubtotal.textContent = CurrencyConfig.formatPrice(subtotal);
    };
    
    window.productUpdateCartQty = function(index, delta) {
        CartState.updateCartItemQuantity(index, delta);
        CartState.renderCart();
    };
    
    window.productRemoveFromCart = function(index) {
        CartState.removeFromCart(index);
        showToast('Item removed from cart', 'success');
    };
    
    // Override wishlist render for this page
    const originalRenderWishlist = CartState.renderWishlist;
    CartState.renderWishlist = function() {
        const wishlist = getWishlist();
        if (wishlist.length === 0) {
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
        const wishlistProducts = wishlist.map(id => ProductAPI.getById(id)).filter(p => p);
        elements.wishlistItems.innerHTML = wishlistProducts.map(product => `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <img src="${product.images[0].src}" alt="${product.name}">
                </div>
                <div class="wishlist-item-details">
                    <h4 onclick="window.location.href='product.html?slug=${product.slug}'">${product.name}</h4>
                    <p class="wishlist-item-price">${CurrencyConfig.formatPrice(product.price)}</p>
                    <div class="wishlist-item-actions">
                        <button class="btn-add-cart-sm" onclick="window.productAddToCartFromWishlist('${product.id}')">Add to Cart</button>
                        <button class="btn-remove-sm" onclick="window.productRemoveFromWishlist('${product.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    };
    
    window.productAddToCartFromWishlist = function(productId) {
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
        CartState.addToCart(item);
        showToast(`${product.name} added to cart`, 'success');
    };
    
    window.productRemoveFromWishlist = function(productId) {
        const index = getWishlist().indexOf(productId);
        if (index > -1) {
            CartState.removeFromWishlist(index);
            updateWishlistButton();
            showToast('Removed from wishlist', 'success');
        }
    };

    // Initialize currency selector
    initCurrencySelector();
    
    // Listen for currency changes
    window.addEventListener('currencyChanged', () => {
        if (state.product) {
            renderProduct();
            renderRelatedProducts();
        }
        CartState.renderCart();
        CartState.renderWishlist();
    });
    
    // Start
    init();
});

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
// REVIEWS SYSTEM
// ==========================================
const ReviewsAPI = {
    async getReviews(productId, sort = 'newest', filter = 'all', limit = 10, offset = 0) {
        try {
            const response = await fetch(`${API_URL}/reviews/${productId}?sort=${sort}&filter=${filter}&limit=${limit}&offset=${offset}`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            return await response.json();
        } catch (error) {
            console.error('[Reviews] Error:', error.message);
            return null;
        }
    },
    
    async validateToken(token) {
        try {
            const response = await fetch(`${API_URL}/reviews/validate/${token}`);
            if (!response.ok) throw new Error('Invalid token');
            return await response.json();
        } catch (error) {
            console.error('[Reviews] Token validation error:', error.message);
            return null;
        }
    },
    
    async submitReview(formData) {
        try {
            const response = await fetch(`${API_URL}/reviews/submit`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit review');
            }
            return await response.json();
        } catch (error) {
            console.error('[Reviews] Submit error:', error.message);
            throw error;
        }
    }
};

// Reviews State
const reviewsState = {
    reviews: [],
    stats: null,
    sort: 'newest',
    filter: 'all',
    page: 0,
    limit: 10,
    hasMore: true,
    reviewToken: null,
    selectedRating: 0,
    reviewPhotos: []
};

// Generate star rating HTML
function generateStarRatingHTML(rating, size = 'small') {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const dimension = size === 'large' ? 24 : 16;
    
    let html = '';
    
    for (let i = 0; i < fullStars; i++) {
        html += `<svg width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    
    if (hasHalfStar) {
        html += `<svg width="${dimension}" height="${dimension}" viewBox="0 0 24 24" stroke="#d4af37" stroke-width="1"><defs><linearGradient id="halfStar${rating}"><stop offset="50%" stop-color="#d4af37"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfStar${rating})"/></svg>`;
    }
    
    for (let i = 0; i < emptyStars; i++) {
        html += `<svg width="${dimension}" height="${dimension}" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    
    return html;
}

// Load and display reviews
async function loadReviews(productId) {
    const reviewsList = document.getElementById('reviewsList');
    const reviewsFilters = document.getElementById('reviewsFilters');
    const reviewsSummary = document.getElementById('reviewsSummary');
    
    if (!reviewsList) return;
    
    reviewsList.innerHTML = '<div class="reviews-loading">Loading reviews...</div>';
    
    const result = await ReviewsAPI.getReviews(
        productId, 
        reviewsState.sort, 
        reviewsState.filter,
        reviewsState.limit,
        reviewsState.page * reviewsState.limit
    );
    
    if (!result || !result.success) {
        reviewsList.innerHTML = '<div class="reviews-loading">Unable to load reviews</div>';
        return;
    }
    
    reviewsState.reviews = result.reviews;
    reviewsState.stats = result.stats;
    
    // Show/hide filters based on review count
    if (result.stats.total === 0) {
        reviewsFilters.style.display = 'none';
        reviewsList.innerHTML = `
            <div class="no-reviews">
                <p>No reviews yet</p>
                <p class="text-muted">Be the first to review this product!</p>
            </div>
        `;
    } else {
        reviewsFilters.style.display = 'flex';
        renderReviews();
    }
    
    // Render summary
    renderReviewSummary();
}

// Render review summary
function renderReviewSummary() {
    const stats = reviewsState.stats;
    if (!stats) return;
    
    const avgRatingBig = document.getElementById('avgRatingBig');
    const avgRatingStars = document.getElementById('avgRatingStars');
    const reviewsCountText = document.getElementById('reviewsCountText');
    const ratingBreakdown = document.getElementById('ratingBreakdown');
    
    if (avgRatingBig) avgRatingBig.textContent = stats.averageRating.toFixed(1);
    if (avgRatingStars) avgRatingStars.innerHTML = generateStarRatingHTML(stats.averageRating, 'large');
    if (reviewsCountText) reviewsCountText.textContent = `Based on ${stats.total} review${stats.total !== 1 ? 's' : ''}`;
    
    if (ratingBreakdown) {
        const total = stats.total;
        ratingBreakdown.innerHTML = [5, 4, 3, 2, 1].map(star => {
            const count = stats.distribution[star] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return `
                <div class="rating-bar">
                    <span class="rating-bar-label">${star} star</span>
                    <div class="rating-bar-track">
                        <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="rating-bar-count">${count}</span>
                </div>
            `;
        }).join('');
    }
}

// Render reviews list
function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (reviewsState.reviews.length === 0) {
        reviewsList.innerHTML = '<div class="no-reviews">No reviews match your filters</div>';
        return;
    }
    
    reviewsList.innerHTML = reviewsState.reviews.map(review => {
        const date = new Date(review.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const initials = review.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        
        const photosHtml = review.photos && review.photos.length > 0 ? `
            <div class="review-photos">
                ${review.photos.map(photo => `
                    <img src="${photo}" alt="Review photo" class="review-photo" onclick="window.openPhotoModal('${photo}')">
                `).join('')}
            </div>
        ` : '';
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">
                        <div class="review-avatar">${initials}</div>
                        <div class="review-meta">
                            <h4>${review.customer_name}</h4>
                            <div class="review-rating">
                                ${generateStarRatingHTML(review.rating)}
                            </div>
                        </div>
                    </div>
                    <div class="review-date">
                        ${date}
                        ${review.verified_purchase ? `
                            <span class="review-verified">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Verified Purchase
                            </span>
                        ` : ''}
                    </div>
                </div>
                ${review.title ? `<h4 class="review-title">${review.title}</h4>` : ''}
                <p class="review-text">${review.text}</p>
                ${photosHtml}
            </div>
        `;
    }).join('');
}

// Initialize reviews section
function initReviews(productId) {
    // Check for review token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('review_token');
    
    if (token) {
        reviewsState.reviewToken = token;
        validateAndShowReviewModal(token);
    }
    
    // Load reviews
    loadReviews(productId);
    
    // Bind review filter events
    const reviewSort = document.getElementById('reviewSort');
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    
    if (reviewSort) {
        reviewSort.addEventListener('change', (e) => {
            reviewsState.sort = e.target.value;
            reviewsState.page = 0;
            loadReviews(productId);
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            reviewsState.filter = btn.dataset.filter;
            reviewsState.page = 0;
            loadReviews(productId);
        });
    });
    
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => openReviewModal());
    }
    
    // Initialize review modal events
    initReviewModal();
}

// Validate token and show modal
async function validateAndShowReviewModal(token) {
    const result = await ReviewsAPI.validateToken(token);
    
    if (!result) {
        showToast('Invalid or expired review link', 'error');
        return;
    }
    
    // Show review modal
    openReviewModal(result.product, token);
}

// Open review modal
function openReviewModal(product = null, token = null) {
    const modal = document.getElementById('reviewModal');
    const overlay = document.getElementById('reviewOverlay');
    const productInfo = document.getElementById('reviewProductInfo');
    const tokenInput = document.getElementById('reviewToken');
    
    if (!modal) return;
    
    if (product) {
        productInfo.innerHTML = `
            <img src="${product.images?.[0]?.src || ''}" alt="${product.name}">
            <h4>${product.name}</h4>
        `;
    } else if (window.state && window.state.product) {
        const p = window.state.product;
        productInfo.innerHTML = `
            <img src="${p.images?.[0]?.src || ''}" alt="${p.name}">
            <h4>${p.name}</h4>
        `;
    }
    
    if (token) {
        tokenInput.value = token;
    }
    
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close review modal
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    const overlay = document.getElementById('reviewOverlay');
    
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    resetReviewForm();
}

// Reset review form
function resetReviewForm() {
    const form = document.getElementById('reviewForm');
    const starInput = document.getElementById('starRatingInput');
    const photoPreview = document.getElementById('reviewPhotoPreview');
    
    if (form) form.reset();
    
    reviewsState.selectedRating = 0;
    reviewsState.reviewPhotos = [];
    
    if (starInput) {
        starInput.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
            btn.querySelector('svg').setAttribute('fill', 'none');
        });
    }
    
    if (photoPreview) photoPreview.innerHTML = '';
    
    const ratingLabel = document.getElementById('ratingLabel');
    if (ratingLabel) ratingLabel.textContent = 'Select a rating';
}

// Initialize review modal events
function initReviewModal() {
    const closeBtn = document.getElementById('reviewModalClose');
    const overlay = document.getElementById('reviewOverlay');
    const form = document.getElementById('reviewForm');
    const starBtns = document.querySelectorAll('#starRatingInput button');
    const photoUpload = document.getElementById('photoUploadZone');
    const photoInput = document.getElementById('reviewPhotos');
    
    if (closeBtn) closeBtn.addEventListener('click', closeReviewModal);
    if (overlay) overlay.addEventListener('click', closeReviewModal);
    
    // Star rating
    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = parseInt(btn.dataset.rating);
            reviewsState.selectedRating = rating;
            
            starBtns.forEach((b, i) => {
                if (i < rating) {
                    b.classList.add('active');
                    b.querySelector('svg').setAttribute('fill', '#d4af37');
                } else {
                    b.classList.remove('active');
                    b.querySelector('svg').setAttribute('fill', 'none');
                }
            });
            
            const labels = ['Poor', 'Fair', 'Average', 'Good', 'Excellent'];
            const ratingLabel = document.getElementById('ratingLabel');
            if (ratingLabel) ratingLabel.textContent = labels[rating - 1];
        });
    });
    
    // Photo upload
    if (photoUpload && photoInput) {
        photoUpload.addEventListener('click', () => photoInput.click());
        
        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const remainingSlots = 5 - reviewsState.reviewPhotos.length;
            
            if (files.length > remainingSlots) {
                showToast(`You can only upload up to 5 photos`, 'error');
            }
            
            const toAdd = files.slice(0, remainingSlots);
            
            toAdd.forEach(file => {
                if (!file.type.startsWith('image/')) return;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    reviewsState.reviewPhotos.push({ file, preview: e.target.result });
                    updatePhotoPreview();
                };
                reader.readAsDataURL(file);
            });
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (reviewsState.selectedRating === 0) {
                showToast('Please select a rating', 'error');
                return;
            }
            
            const token = document.getElementById('reviewToken').value;
            if (!token) {
                showToast('You must have a valid purchase to leave a review', 'error');
                return;
            }
            
            const submitBtn = document.getElementById('submitReviewBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            const formData = new FormData();
            formData.append('token', token);
            formData.append('rating', reviewsState.selectedRating);
            formData.append('title', document.getElementById('reviewTitle').value);
            formData.append('text', document.getElementById('reviewText').value);
            formData.append('customerName', document.getElementById('reviewerName').value);
            
            reviewsState.reviewPhotos.forEach(photo => {
                formData.append('photos', photo.file);
            });
            
            try {
                await ReviewsAPI.submitReview(formData);
                showToast('Review submitted successfully! It will appear after approval.', 'success');
                closeReviewModal();
                
                // Reload reviews
                if (window.state && window.state.product) {
                    loadReviews(window.state.product.id);
                }
            } catch (error) {
                showToast(error.message || 'Failed to submit review', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            }
        });
    }
}

// Update photo preview
function updatePhotoPreview() {
    const container = document.getElementById('reviewPhotoPreview');
    if (!container) return;
    
    container.innerHTML = reviewsState.reviewPhotos.map((photo, index) => `
        <div class="photo-preview">
            <img src="${photo.preview}" alt="Preview">
            <button type="button" class="remove-photo" onclick="window.removeReviewPhoto(${index})">×</button>
        </div>
    `).join('');
}

// Remove review photo
window.removeReviewPhoto = function(index) {
    reviewsState.reviewPhotos.splice(index, 1);
    updatePhotoPreview();
};

// Open photo modal
window.openPhotoModal = function(photoUrl) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="photo-modal-overlay" onclick="this.parentElement.remove()"></div>
        <img src="${photoUrl}" alt="Review photo" onclick="this.parentElement.remove()">
    `;
    document.body.appendChild(modal);
};
