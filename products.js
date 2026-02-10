/**
 * LA VAGUE - Product Catalog
 * Complete product data structure for streetwear e-commerce
 */

const PRODUCTS = [
    {
        id: 'lv-hoodie-001',
        name: 'Classic Oversized Hoodie',
        slug: 'classic-oversized-hoodie',
        category: 'hoodies',
        price: 145,
        compareAtPrice: null,
        description: 'Crafted from 450gsm heavyweight cotton, our signature hoodie features a relaxed oversized fit, dropped shoulders, and our embroidered wave logo. Built to last, designed to stand out.',
        features: [
            '450gsm 100% Organic Cotton',
            'Double-layered hood',
            'Embroidered logo detail',
            'Made in Nigeria',
            'Oversized fit'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', alt: 'Classic Oversized Hoodie - Black' },
            { src: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80', alt: 'Classic Oversized Hoodie - Detail' },
            { src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', alt: 'Classic Oversized Hoodie - Fit' }
        ],
        colors: [
            { name: 'Black', value: '#0a0a0a', imageIndex: 0 },
            { name: 'Ash Grey', value: '#8a8a8a', imageIndex: 1 },
            { name: 'Cream', value: '#f5f5dc', imageIndex: 2 }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        sizeGuide: 'oversized',
        inventory: {
            'Black-XS': 12, 'Black-S': 25, 'Black-M': 30, 'Black-L': 28, 'Black-XL': 20, 'Black-XXL': 8,
            'Ash Grey-XS': 8, 'Ash Grey-S': 15, 'Ash Grey-M': 22, 'Ash Grey-L': 18, 'Ash Grey-XL': 12, 'Ash Grey-XXL': 5,
            'Cream-XS': 5, 'Cream-S': 10, 'Cream-M': 15, 'Cream-L': 12, 'Cream-XL': 8, 'Cream-XXL': 3
        },
        tags: ['bestseller', 'signature'],
        badge: 'Bestseller',
        meta: {
            title: 'Classic Oversized Hoodie | LA VAGUE',
            description: 'Premium 450gsm heavyweight cotton hoodie. Oversized fit with embroidered wave logo. Made in Nigeria.'
        }
    },
    {
        id: 'lv-hoodie-002',
        name: 'Wave Logo Zip Hoodie',
        slug: 'wave-logo-zip-hoodie',
        category: 'hoodies',
        price: 165,
        compareAtPrice: null,
        description: 'Full-zip hoodie featuring our signature wave logo across the back. Premium heavyweight cotton with brushed interior for ultimate comfort.',
        features: [
            '420gsm heavyweight cotton',
            'Brushed fleece interior',
            'Oversized back print',
            'YKK zipper',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80', alt: 'Wave Logo Zip Hoodie' },
            { src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', alt: 'Wave Logo Zip Hoodie - Detail' }
        ],
        colors: [
            { name: 'Black', value: '#0a0a0a', imageIndex: 0 },
            { name: 'Heather Grey', value: '#6a6a6a', imageIndex: 1 }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        sizeGuide: 'oversized',
        inventory: {
            'Black-S': 15, 'Black-M': 20, 'Black-L': 25, 'Black-XL': 18, 'Black-XXL': 10,
            'Heather Grey-S': 10, 'Heather Grey-M': 15, 'Heather Grey-L': 12, 'Heather Grey-XL': 8, 'Heather Grey-XXL': 5
        },
        tags: ['new', 'signature'],
        badge: 'New',
        meta: {
            title: 'Wave Logo Zip Hoodie | LA VAGUE',
            description: 'Full-zip hoodie with oversized back print. Premium heavyweight cotton with YKK zipper.'
        }
    },
    {
        id: 'lv-tee-001',
        name: 'Wave Box Logo Tee',
        slug: 'wave-box-logo-tee',
        category: 'tees',
        price: 65,
        compareAtPrice: null,
        description: 'The essential LA VAGUE tee. Heavyweight 240gsm cotton with our iconic box logo print. Pre-shrunk for the perfect fit wash after wash.',
        features: [
            '240gsm heavyweight cotton',
            'Pre-shrunk',
            'Screen printed logo',
            'Reinforced collar',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', alt: 'Wave Box Logo Tee - White' },
            { src: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', alt: 'Wave Box Logo Tee - Black' }
        ],
        colors: [
            { name: 'White', value: '#ffffff', imageIndex: 0 },
            { name: 'Black', value: '#0a0a0a', imageIndex: 1 }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        sizeGuide: 'regular',
        inventory: {
            'White-XS': 20, 'White-S': 35, 'White-M': 50, 'White-L': 45, 'White-XL': 30, 'White-XXL': 15,
            'Black-XS': 18, 'Black-S': 32, 'Black-M': 48, 'Black-L': 42, 'Black-XL': 28, 'Black-XXL': 12
        },
        tags: ['bestseller', 'essential'],
        badge: 'Essential',
        meta: {
            title: 'Wave Box Logo Tee | LA VAGUE',
            description: 'Essential heavyweight tee with iconic box logo. 240gsm cotton, pre-shrunk, made in Nigeria.'
        }
    },
    {
        id: 'lv-tee-002',
        name: 'Vintage Wash Graphic Tee',
        slug: 'vintage-wash-graphic-tee',
        category: 'tees',
        price: 75,
        compareAtPrice: 85,
        description: 'Vintage-inspired graphic tee with enzyme wash for that worn-in feel. Features original LA VAGUE artwork on the back.',
        features: [
            '200gsm cotton',
            'Enzyme washed',
            'Distressed print',
            'Vintage fit',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', alt: 'Vintage Wash Graphic Tee' },
            { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', alt: 'Vintage Wash Graphic Tee - Back' }
        ],
        colors: [
            { name: 'Washed Black', value: '#2a2a2a', imageIndex: 0 },
            { name: 'Washed Grey', value: '#5a5a5a', imageIndex: 1 }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        sizeGuide: 'regular',
        inventory: {
            'Washed Black-S': 12, 'Washed Black-M': 18, 'Washed Black-L': 22, 'Washed Black-XL': 15, 'Washed Black-XXL': 8,
            'Washed Grey-S': 10, 'Washed Grey-M': 15, 'Washed Grey-L': 18, 'Washed Grey-XL': 12, 'Washed Grey-XXL': 6
        },
        tags: ['sale', 'limited'],
        badge: 'Sale',
        meta: {
            title: 'Vintage Wash Graphic Tee | LA VAGUE',
            description: 'Vintage-inspired tee with enzyme wash and distressed print. Limited edition.'
        }
    },
    {
        id: 'lv-tee-003',
        name: 'LA VAGUE Long Sleeve',
        slug: 'la-vague-long-sleeve',
        category: 'tees',
        price: 85,
        compareAtPrice: null,
        description: 'Premium long sleeve tee with sleeve prints. Perfect for layering or wearing solo. Heavyweight cotton with a soft hand feel.',
        features: [
            '260gsm heavyweight cotton',
            'Sleeve prints',
            'Relaxed fit',
            'Ribbed cuffs',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', alt: 'LA VAGUE Long Sleeve - Black' },
            { src: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80', alt: 'LA VAGUE Long Sleeve - White' }
        ],
        colors: [
            { name: 'Black', value: '#0a0a0a', imageIndex: 0 },
            { name: 'White', value: '#ffffff', imageIndex: 1 }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        sizeGuide: 'regular',
        inventory: {
            'Black-S': 15, 'Black-M': 25, 'Black-L': 30, 'Black-XL': 20, 'Black-XXL': 10,
            'White-S': 12, 'White-M': 20, 'White-L': 25, 'White-XL': 18, 'White-XXL': 8
        },
        tags: ['new'],
        badge: 'New',
        meta: {
            title: 'LA VAGUE Long Sleeve | LA VAGUE',
            description: 'Premium long sleeve with sleeve prints. 260gsm heavyweight cotton, made in Nigeria.'
        }
    },
    {
        id: 'lv-bottom-001',
        name: 'Utility Cargo Pants',
        slug: 'utility-cargo-pants',
        category: 'bottoms',
        price: 135,
        compareAtPrice: null,
        description: 'Functional cargo pants with multiple pockets and adjustable hem. Relaxed fit with a slight taper. Premium cotton twill construction.',
        features: [
            '320gsm cotton twill',
            '6 pockets total',
            'Adjustable drawstring hem',
            'Relaxed taper fit',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', alt: 'Utility Cargo Pants - Olive' },
            { src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', alt: 'Utility Cargo Pants - Black' }
        ],
        colors: [
            { name: 'Olive', value: '#4a5d23', imageIndex: 0 },
            { name: 'Black', value: '#0a0a0a', imageIndex: 1 }
        ],
        sizes: ['28', '30', '32', '34', '36', '38'],
        sizeGuide: 'pants',
        inventory: {
            'Olive-28': 5, 'Olive-30': 12, 'Olive-32': 18, 'Olive-34': 15, 'Olive-36': 8, 'Olive-38': 4,
            'Black-28': 8, 'Black-30': 15, 'Black-32': 22, 'Black-34': 18, 'Black-36': 10, 'Black-38': 5
        },
        tags: ['bestseller'],
        badge: 'Bestseller',
        meta: {
            title: 'Utility Cargo Pants | LA VAGUE',
            description: 'Functional cargo pants with 6 pockets and adjustable hem. Premium cotton twill, made in Nigeria.'
        }
    },
    {
        id: 'lv-bottom-002',
        name: 'Relaxed Denim Jeans',
        slug: 'relaxed-denim-jeans',
        category: 'bottoms',
        price: 155,
        compareAtPrice: null,
        description: 'Premium Japanese selvedge denim in a relaxed fit. Raw wash that will develop unique character over time. Embroidered wave detail on back pocket.',
        features: [
            '14oz Japanese selvedge denim',
            'Raw wash',
            'Relaxed fit',
            'Embroidered back pocket',
            'Made in Japan'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=80', alt: 'Relaxed Denim Jeans' },
            { src: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80', alt: 'Relaxed Denim Jeans - Detail' }
        ],
        colors: [
            { name: 'Raw Indigo', value: '#1a2744', imageIndex: 0 }
        ],
        sizes: ['28', '30', '32', '34', '36', '38'],
        sizeGuide: 'pants',
        inventory: {
            'Raw Indigo-28': 3, 'Raw Indigo-30': 8, 'Raw Indigo-32': 12, 'Raw Indigo-34': 10, 'Raw Indigo-36': 6, 'Raw Indigo-38': 3
        },
        tags: ['premium', 'limited'],
        badge: 'Limited',
        meta: {
            title: 'Relaxed Denim Jeans | LA VAGUE',
            description: '14oz Japanese selvedge denim in relaxed fit. Raw wash with embroidered wave detail.'
        }
    },
    {
        id: 'lv-bottom-003',
        name: 'Essential Sweatpants',
        slug: 'essential-sweatpants',
        category: 'bottoms',
        price: 95,
        compareAtPrice: null,
        description: 'Everyday essential sweatpants. Heavyweight fleece with embroidered logo. Relaxed fit with tapered leg.',
        features: [
            '400gsm fleece',
            'Embroidered logo',
            'Relaxed taper fit',
            'Elastic cuffs',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1517445312882-141c036c65dc?w=800&q=80', alt: 'Essential Sweatpants - Black' },
            { src: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80', alt: 'Essential Sweatpants - Grey' }
        ],
        colors: [
            { name: 'Black', value: '#0a0a0a', imageIndex: 0 },
            { name: 'Heather Grey', value: '#8a8a8a', imageIndex: 1 }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        sizeGuide: 'oversized',
        inventory: {
            'Black-XS': 10, 'Black-S': 20, 'Black-M': 30, 'Black-L': 25, 'Black-XL': 15, 'Black-XXL': 8,
            'Heather Grey-XS': 8, 'Heather Grey-S': 15, 'Heather Grey-M': 25, 'Heather Grey-L': 20, 'Heather Grey-XL': 12, 'Heather Grey-XXL': 6
        },
        tags: ['essential'],
        badge: 'Essential',
        meta: {
            title: 'Essential Sweatpants | LA VAGUE',
            description: 'Everyday essential sweatpants in heavyweight fleece. Relaxed taper fit, made in Nigeria.'
        }
    },
    {
        id: 'lv-acc-001',
        name: 'Wave Logo Cap',
        slug: 'wave-logo-cap',
        category: 'accessories',
        price: 45,
        compareAtPrice: null,
        description: 'Classic 6-panel cap with embroidered wave logo. Adjustable strapback closure. Premium cotton twill.',
        features: [
            'Cotton twill construction',
            'Embroidered front logo',
            'Adjustable strapback',
            'Unstructured panels',
            'One size fits most'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', alt: 'Wave Logo Cap - Black' }
        ],
        colors: [
            { name: 'Black', value: '#0a0a0a', imageIndex: 0 }
        ],
        sizes: ['OS'],
        sizeGuide: null,
        inventory: {
            'Black-OS': 50
        },
        tags: ['accessories'],
        badge: null,
        meta: {
            title: 'Wave Logo Cap | LA VAGUE',
            description: 'Classic 6-panel cap with embroidered wave logo. Adjustable strapback, cotton twill.'
        }
    },
    {
        id: 'lv-acc-002',
        name: 'Essential Tote Bag',
        slug: 'essential-tote-bag',
        category: 'accessories',
        price: 35,
        compareAtPrice: null,
        description: 'Heavyweight canvas tote bag with printed logo. Perfect for everyday use or carrying your gear.',
        features: [
            '16oz canvas',
            'Screen printed logo',
            'Internal pocket',
            'Reinforced handles',
            'Made in Nigeria'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', alt: 'Essential Tote Bag - Natural' },
            { src: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80', alt: 'Essential Tote Bag - Black' }
        ],
        colors: [
            { name: 'Natural', value: '#d4c4b0', imageIndex: 0 },
            { name: 'Black', value: '#0a0a0a', imageIndex: 1 }
        ],
        sizes: ['OS'],
        sizeGuide: null,
        inventory: {
            'Natural-OS': 30,
            'Black-OS': 25
        },
        tags: ['accessories'],
        badge: null,
        meta: {
            title: 'Essential Tote Bag | LA VAGUE',
            description: 'Heavyweight canvas tote bag with printed logo. 16oz canvas, internal pocket.'
        }
    },
    {
        id: 'lv-acc-003',
        name: 'Wave Logo Socks (2-Pack)',
        slug: 'wave-logo-socks-2pack',
        category: 'accessories',
        price: 25,
        compareAtPrice: null,
        description: 'Premium cotton blend socks with embroidered wave logo. Cushioned sole for comfort. 2-pack.',
        features: [
            'Cotton blend',
            'Embroidered logo',
            'Cushioned sole',
            'Ribbed cuff',
            '2-pack'
        ],
        images: [
            { src: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80', alt: 'Wave Logo Socks - White' }
        ],
        colors: [
            { name: 'White/Black', value: '#ffffff', imageIndex: 0 }
        ],
        sizes: ['OS'],
        sizeGuide: null,
        inventory: {
            'White/Black-OS': 100
        },
        tags: ['accessories', 'essential'],
        badge: 'Essential',
        meta: {
            title: 'Wave Logo Socks (2-Pack) | LA VAGUE',
            description: 'Premium cotton blend socks with embroidered wave logo. Cushioned sole, 2-pack.'
        }
    }
];

// Category definitions
const CATEGORIES = [
    { id: 'all', name: 'All Products', slug: 'all' },
    { id: 'hoodies', name: 'Hoodies', slug: 'hoodies' },
    { id: 'tees', name: 'T-Shirts', slug: 'tees' },
    { id: 'bottoms', name: 'Bottoms', slug: 'bottoms' },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' }
];

// Size guides
const SIZE_GUIDES = {
    regular: {
        name: 'Regular Fit',
        unit: 'inches',
        measurements: [
            { size: 'XS', chest: '34-36', length: '26', sleeve: '7.5' },
            { size: 'S', chest: '36-38', length: '27', sleeve: '8' },
            { size: 'M', chest: '38-40', length: '28', sleeve: '8.5' },
            { size: 'L', chest: '40-42', length: '29', sleeve: '9' },
            { size: 'XL', chest: '42-44', length: '30', sleeve: '9.5' },
            { size: 'XXL', chest: '44-46', length: '31', sleeve: '10' }
        ]
    },
    oversized: {
        name: 'Oversized Fit',
        unit: 'inches',
        measurements: [
            { size: 'XS', chest: '40-42', length: '28', sleeve: '22' },
            { size: 'S', chest: '42-44', length: '29', sleeve: '22.5' },
            { size: 'M', chest: '44-46', length: '30', sleeve: '23' },
            { size: 'L', chest: '46-48', length: '31', sleeve: '23.5' },
            { size: 'XL', chest: '48-50', length: '32', sleeve: '24' },
            { size: 'XXL', chest: '50-52', length: '33', sleeve: '24.5' }
        ]
    },
    pants: {
        name: 'Bottoms',
        unit: 'inches',
        measurements: [
            { size: '28', waist: '28', inseam: '30', hip: '36' },
            { size: '30', waist: '30', inseam: '30', hip: '38' },
            { size: '32', waist: '32', inseam: '30', hip: '40' },
            { size: '34', waist: '34', inseam: '30', hip: '42' },
            { size: '36', waist: '36', inseam: '30', hip: '44' },
            { size: '38', waist: '38', inseam: '30', hip: '46' }
        ]
    }
};

// Helper functions
const ProductAPI = {
    getAll: () => PRODUCTS,
    
    getById: (id) => PRODUCTS.find(p => p.id === id),
    
    getBySlug: (slug) => PRODUCTS.find(p => p.slug === slug),
    
    getByCategory: (category) => {
        if (category === 'all') return PRODUCTS;
        return PRODUCTS.filter(p => p.category === category);
    },
    
    getFeatured: () => PRODUCTS.filter(p => p.tags.includes('bestseller')),
    
    getNewArrivals: () => PRODUCTS.filter(p => p.tags.includes('new')),
    
    getSale: () => PRODUCTS.filter(p => p.compareAtPrice !== null),
    
    search: (query) => {
        const lowerQuery = query.toLowerCase();
        return PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    },
    
    checkInventory: (productId, color, size) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return 0;
        const key = `${color}-${size}`;
        return product.inventory[key] || 0;
    },
    
    getRelated: (productId, limit = 4) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return [];
        return PRODUCTS
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, limit);
    },
    
    getCategories: () => CATEGORIES,
    
    getSizeGuide: (type) => SIZE_GUIDES[type] || null
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCTS, CATEGORIES, SIZE_GUIDES, ProductAPI };
}
