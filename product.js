/**
 * LA VAGUE - Product Detail Page JavaScript
 */

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
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        wishlist: JSON.parse(localStorage.getItem('wishlist')) || []
    };

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
    function init() {
        // Get product from URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            window.location.href = 'shop.html';
            return;
        }
        
        state.product = ProductAPI.getBySlug(slug);
        
        if (!state.product) {
            window.location.href = 'shop.html';
            return;
        }
        
        // Set initial selections
        state.selectedColor = state.product.colors[0]?.name;
        state.selectedSize = state.product.sizes[0];
        
        // Render product
        renderProduct();
        renderRelatedProducts();
        updateCartCount();
        updateWishlistCount();
        updateWishlistButton();
        
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
        elements.productPrice.textContent = `$${p.price}`;
        elements.productOriginalPrice.textContent = p.compareAtPrice ? `$${p.compareAtPrice}` : '';
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
    }

    function renderGallery() {
        const images = state.product.images;
        
        // Main image
        elements.mainImage.src = images[state.currentImageIndex].src;
        elements.mainImage.alt = images[state.currentImageIndex].alt;
        
        // Thumbs
        elements.galleryThumbs.innerHTML = images.map((img, i) => `
            <img src="${img.src}" alt="${img.alt}" 
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

    function renderRelatedProducts() {
        const related = ProductAPI.getRelated(state.product.id, 4);
        
        elements.relatedGrid.innerHTML = related.map(product => `
            <article class="product-card" onclick="window.location.href='product.html?slug=${product.slug}'">
                <div class="product-image-wrapper">
                    ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                    <img src="${product.images[0].src}" alt="${product.images[0].alt}" class="product-image" loading="lazy">
                </div>
                <div class="product-info">
                    <p class="product-category">${CATEGORIES.find(c => c.id === product.category)?.name}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.compareAtPrice ? `<span class="original-price">$${product.compareAtPrice}</span>` : ''}
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
        
        // Update main image if color has specific image
        const color = state.product.colors.find(c => c.name === colorName);
        if (color && color.imageIndex !== undefined) {
            window.setImage(color.imageIndex);
        }
    };

    window.selectSize = function(size) {
        state.selectedSize = size;
        renderSizes();
    };

    function updateQuantity(delta) {
        state.quantity = Math.max(1, state.quantity + delta);
        elements.quantity.textContent = state.quantity;
        elements.qtyMinus.disabled = state.quantity <= 1;
    }

    // ==========================================
    // CART
    // ==========================================
    function addToCart() {
        const item = {
            id: state.product.id,
            name: state.product.name,
            price: state.product.price,
            image: state.product.images[0].src,
            color: state.selectedColor,
            size: state.selectedSize,
            quantity: state.quantity
        };
        
        const existingItem = state.cart.find(i => 
            i.id === item.id && i.color === item.color && i.size === item.size
        );
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            state.cart.push(item);
        }
        
        saveCart();
        updateCartCount();
        showToast(`${state.product.name} added to cart`, 'success', 'View Cart');
        
        // Reset quantity
        state.quantity = 1;
        elements.quantity.textContent = 1;
        elements.qtyMinus.disabled = true;
    }

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
    function toggleWishlist() {
        const index = state.wishlist.indexOf(state.product.id);
        
        if (index > -1) {
            state.wishlist.splice(index, 1);
            showToast('Removed from wishlist', 'success');
        } else {
            state.wishlist.push(state.product.id);
            showToast('Added to wishlist', 'success');
        }
        
        saveWishlist();
        updateWishlistCount();
        updateWishlistButton();
    }

    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    }

    function updateWishlistCount() {
        const count = state.wishlist.length;
        elements.wishlistCount.textContent = count;
        elements.wishlistCount.classList.toggle('active', count > 0);
    }

    function updateWishlistButton() {
        const isInWishlist = state.wishlist.includes(state.product.id);
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
            <div class="size-note">
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
                <span class="search-result-price">$${product.price}</span>
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
        
        // Search
        elements.searchBtn?.addEventListener('click', openSearch);
        elements.searchClose?.addEventListener('click', closeSearch);
        
        let searchTimeout;
        elements.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
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
        
        // Cart
        elements.cartBtn?.addEventListener('click', openCart);
        elements.cartClose?.addEventListener('click', closeCart);
        elements.cartOverlay?.addEventListener('click', closeCart);
        
        // Wishlist
        elements.wishlistBtn?.addEventListener('click', openWishlist);
        elements.wishlistClose?.addEventListener('click', closeWishlist);
        elements.wishlistOverlay?.addEventListener('click', closeWishlist);
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                closeSizeGuide();
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
    // CART & WISHLIST
    // ==========================================
    function openCart() {
        renderCart();
        elements.cartSidebar.classList.add('active');
        elements.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        elements.cartSidebar.classList.remove('active');
        elements.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function renderCart() {
        if (state.cart.length === 0) {
            elements.cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-secondary" onclick="closeCart()">Continue Shopping</a>
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
                                <button onclick="updateCartQty(${index}, -1)">−</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateCartQty(${index}, 1)">+</button>
                            </div>
                            <span class="cart-item-price">$${item.price * item.quantity}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
                </div>
            `).join('');
        }
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.cartSubtotal.textContent = `$${subtotal}`;
    }
    
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
    
    function openWishlist() {
        renderWishlist();
        elements.wishlistSidebar.classList.add('active');
        elements.wishlistOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeWishlist() {
        elements.wishlistSidebar.classList.remove('active');
        elements.wishlistOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function renderWishlist() {
        if (state.wishlist.length === 0) {
            elements.wishlistItems.innerHTML = `
                <div class="wishlist-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <p>Your wishlist is empty</p>
                    <a href="shop.html" class="btn btn-secondary" onclick="closeWishlist()">Start Shopping</a>
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
                    <p class="wishlist-item-price">$${product.price}</p>
                    <div class="wishlist-item-actions">
                        <button class="btn-add-cart-sm" onclick="addToCartFromWishlist('${product.id}')">Add to Cart</button>
                        <button class="btn-remove-sm" onclick="removeFromWishlist('${product.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
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
            updateWishlistButton();
        }
    };

    // Start
    init();
});
