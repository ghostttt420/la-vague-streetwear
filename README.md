# LA VAGUE - Premium Streetwear Website

A professional, full-featured e-commerce website for the LA VAGUE streetwear brand.

## 🌐 Live Demo

Open `index.html` in your browser to see the website.

## 📁 Project Structure

```
la vague/
├── index.html              # Homepage
├── shop.html               # Shop page with filters
├── product.html            # Product detail page
├── checkout.html           # Checkout page
├── faq.html                # FAQ page
├── shipping.html           # Shipping info page
├── returns.html            # Returns policy page
├── contact.html            # Contact page
├── order-confirmation.html # Order success page
├── 404.html                # 404 error page
├── products.js             # Product catalog data
├── styles.css              # Base styles
├── home-styles.css         # Homepage specific styles
├── shop-styles.css         # Shop page styles
├── product-styles.css      # Product detail styles
├── checkout-styles.css     # Checkout styles
├── page-styles.css         # Content pages styles
├── home.js                 # Homepage JavaScript
├── shop.js                 # Shop page JavaScript
├── product.js              # Product detail JavaScript
├── checkout.js             # Checkout JavaScript
├── checkout-api.js         # API integration
├── page.js                 # Shared page JavaScript
├── server.js               # Node.js backend
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── la-vague-red-wordmark.png  # Brand logo
└── README.md               # This file
```

## 🚀 Quick Start (Frontend Only)

1. Open `index.html` in your browser
2. Navigate through the site using the menu
3. Shop page shows all products with filters
4. Click any product to see detail page
5. Add items to cart
6. Cart persists across page refreshes (localStorage)

## 🖥️ Backend Setup (For Full Functionality)

### Prerequisites
- Node.js 16+ installed
- Paystack account (for payments)
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Install dependencies:**
```bash
cd "la vague"
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Configure .env file:**
```env
# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Paystack (Get from https://dashboard.paystack.com)
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. **Start the server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

5. **Open in browser:**
Navigate to `http://localhost:3000`

## ✨ Features

### Frontend Features
- Responsive design (mobile-first)
- Product catalog with 11 products
- Product filtering by category
- Product sorting (price, name, newest)
- Quick view modal
- Image gallery on product pages
- Size guide modal
- Cart sidebar with persistent storage
- Wishlist functionality
- Search overlay (Cmd/Ctrl + K)
- Toast notifications
- Loading skeletons
- Lazy loading images
- Smooth scroll animations

### Backend Features (With Server)
- **Real Payments:** Paystack integration for Nigerian payments
- **Order Management:** Database-backed orders with SQLite
- **Email Notifications:** Order confirmations via email
- **Inventory Tracking:** Real-time stock management
- **API Endpoints:** RESTful API for products and orders
- **Security:** Helmet.js, rate limiting, CORS
- **Compression:** Gzip compression for responses

## 🛍️ Product Categories

- **Hoodies** - Classic Oversized, Zip Hoodies
- **T-Shirts** - Box Logo, Vintage Wash, Long Sleeve
- **Bottoms** - Cargo Pants, Denim Jeans, Sweatpants
- **Accessories** - Caps, Tote Bags, Socks

## 💳 Payment Integration

The checkout supports **Paystack** for Nigerian payments:

1. Card payments (Visa, Mastercard, Verve)
2. Bank transfers
3. USSD
4. Mobile money

Test cards for Paystack:
- Card: 4084 0840 8408 4081
- Expiry: Any future date
- CVV: 000
- PIN: 1234

## 📧 Email Configuration

### Gmail Setup:
1. Enable 2-factor authentication
2. Generate an "App Password"
3. Use the app password in SMTP_PASS

### SendGrid Setup:
1. Create account at sendgrid.com
2. Create an API key
3. Use API key as SMTP_PASS

## 🔒 Security Features

- **Helmet.js:** Security headers (CSP, HSTS, etc.)
- **Rate Limiting:** API abuse prevention
- **Input Validation:** SQL injection protection via prepared statements
- **CORS:** Configured for frontend domain
- **Content Security Policy:** XSS protection

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List all products |
| GET | `/api/products/:slug` | Get single product |
| POST | `/api/inventory/check` | Check stock |
| POST | `/api/payment/initialize` | Start payment |
| GET | `/api/payment/verify/:ref` | Verify payment |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get order details |

## 🎨 Design System

### Colors
- **Background:** `#0a0a0a` (dark)
- **Text:** `#ffffff` (white)
- **Accent:** `#dc2626` (red)
- **Muted:** `#888888` (gray)

### Typography
- **Headings:** Oswald (bold, uppercase)
- **Body:** Inter (clean, modern)

## 🖼️ Image Requirements

- **Product Images:** 800x1000px or 3:4 aspect ratio
- **Collection Images:** 800x800px or 1:1 aspect ratio
- **Lookbook Images:** 1200x800px or 3:2 aspect ratio
- **Format:** JPG or WebP for photos, PNG for logos

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
Edit in `index.html`:
```html
<div class="announcement-bar">
    <span>YOUR MESSAGE HERE</span>
</div>
```

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

## 🚢 Deployment

### Static Hosting (Netlify/Vercel)
1. Connect GitHub repo
2. Build command: (none for static)
3. Publish directory: `/`

### Full Stack (Heroku/Railway/Render)
1. Set environment variables
2. Build command: `npm install`
3. Start command: `npm start`

## 📄 License

This is a proprietary website for LA VAGUE brand.

---

**Built with passion. Ride the wave.** 🌊
