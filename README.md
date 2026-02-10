# LA VAGUE - Premium Streetwear Website

A professional, full-featured e-commerce website for the LA VAGUE streetwear brand.

## 🌊 Live Demo

Open `index.html` in your browser to see the website.

## 📁 Project Structure

```
la vague/
├── index.html              # Homepage
├── shop.html               # Shop page with filters
├── product.html            # Product detail page
├── products.js             # Product catalog data
├── styles.css              # Base styles
├── home-styles.css         # Homepage specific styles
├── shop-styles.css         # Shop page styles
├── product-styles.css      # Product detail styles
├── home.js                 # Homepage JavaScript
├── shop.js                 # Shop page JavaScript
├── product.js              # Product detail JavaScript
├── la-vague-red-wordmark.png  # Brand logo
└── README.md               # This file
```

## ✨ Features

### Homepage
- Animated hero section with logo reveal
- Featured products grid (bestsellers)
- Collection categories with hover effects
- Lookbook gallery with lightbox
- Newsletter signup
- Smooth scroll animations

### Shop Page
- **Product Grid**: Responsive 4-column layout
- **Filters**: Category, price range, tags (sale, new, bestseller)
- **Sorting**: Featured, newest, price, name
- **Quick View**: Modal for fast product preview
- **Wishlist**: Heart icon to save favorites
- **Search**: Real-time product search (Cmd/Ctrl + K)

### Product Detail Page
- **Image Gallery**: Main image with thumbnail navigation
- **Color Selector**: Visual color swatches
- **Size Selector**: Size buttons with stock status
- **Size Guide**: Modal with measurement tables
- **Related Products**: You May Also Like section
- **Add to Cart**: With quantity selector

### Cart System
- Slide-out cart sidebar
- Persistent storage (localStorage)
- Quantity adjustment
- Remove items
- Subtotal calculation
- Toast notifications

### Wishlist
- Heart icon on all product cards
- Persistent storage
- Count badge in navigation

### Technical Features
- **Responsive Design**: Mobile-first approach
- **Lazy Loading**: Images load as needed
- **SEO Optimized**: Meta tags, structured data
- **Performance**: Intersection Observer for animations
- **Accessibility**: ARIA labels, keyboard navigation

## 🛍️ Product Data

Products are defined in `products.js` with:
- ID, name, slug, category
- Price (with compare-at price for sales)
- Multiple images
- Color variants with hex values
- Size options
- Inventory tracking per variant
- Tags (bestseller, new, sale, limited)
- Size guide references

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (dark)
- **Text**: `#ffffff` (white)
- **Accent**: `#dc2626` (red)
- **Muted**: `#888888` (gray)

### Typography
- **Headings**: Oswald (bold, uppercase)
- **Body**: Inter (clean, modern)

## 🚀 Getting Started

1. Open `index.html` in your browser
2. Navigate through the site using the menu
3. Shop page shows all products with filters
4. Click any product to see detail page
5. Add items to cart
6. Cart persists across page refreshes

## 📝 Adding New Products

Edit `products.js` and add a new product object to the `PRODUCTS` array:

```javascript
{
    id: 'lv-xxx-001',
    name: 'Product Name',
    slug: 'product-slug',
    category: 'hoodies', // hoodies, tees, bottoms, accessories
    price: 99,
    compareAtPrice: null, // or price for sales
    description: 'Product description...',
    features: ['Feature 1', 'Feature 2'],
    images: [
        { src: 'image-url.jpg', alt: 'Description' }
    ],
    colors: [
        { name: 'Black', value: '#0a0a0a', imageIndex: 0 }
    ],
    sizes: ['S', 'M', 'L'],
    sizeGuide: 'regular', // or 'oversized', 'pants'
    inventory: {
        'Black-S': 10,
        'Black-M': 15
    },
    tags: ['new', 'bestseller'],
    badge: 'New', // or 'Sale', 'Bestseller', 'Essential'
    meta: {
        title: 'Product Name | LA VAGUE',
        description: 'SEO description'
    }
}
```

## 🖼️ Image Requirements

- **Product Images**: 800x1000px or 3:4 aspect ratio
- **Collection Images**: 800x800px or 1:1 aspect ratio
- **Lookbook Images**: 1200x800px or 3:2 aspect ratio
- **Format**: JPG or WebP for photos, PNG for logos
- **Optimization**: Compress images for web

## 🔧 Customization

### Change Brand Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-bg: #0a0a0a;
    --color-accent: #dc2626;
    /* ... */
}
```

### Update Announcement Bar
Edit the text in `index.html`:
```html
<div class="announcement-bar">
    <span>YOUR MESSAGE HERE</span>
</div>
```

### Modify Shipping Threshold
Search for `$150` in all files and update the amount.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## ⚡ Performance Tips

1. Compress all images
2. Use WebP format with JPG fallback
3. Enable browser caching
4. Use a CDN for images
5. Minify CSS/JS for production

## 📄 License

This is a proprietary website for LA VAGUE brand.

---

**Built with passion. Ride the wave.** 🌊
