/**
 * LA VAGUE - Backend Server
 * Express.js API with SQLite database
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database('database.sqlite');

// Create tables
function initDatabase() {
    // Products table
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            price INTEGER NOT NULL,
            compare_at_price INTEGER,
            description TEXT,
            features TEXT,
            images TEXT,
            colors TEXT,
            sizes TEXT,
            inventory TEXT,
            tags TEXT,
            badge TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Orders table
    db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            address TEXT NOT NULL,
            apartment TEXT,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip TEXT NOT NULL,
            phone TEXT NOT NULL,
            shipping_method TEXT NOT NULL,
            shipping_cost INTEGER NOT NULL,
            subtotal INTEGER NOT NULL,
            discount INTEGER DEFAULT 0,
            total INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            paystack_reference TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Order items table
    db.exec(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            color TEXT,
            size TEXT,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    `);

    // Insert sample products if empty
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
    if (count.count === 0) {
        seedProducts();
    }
}

function seedProducts() {
    const products = require('./products.js');
    const insert = db.prepare(`
        INSERT INTO products (id, name, slug, category, price, compare_at_price, description, features, images, colors, sizes, inventory, tags, badge)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((products) => {
        for (const p of products) {
            insert.run(
                p.id,
                p.name,
                p.slug,
                p.category,
                p.price,
                p.compareAtPrice,
                p.description,
                JSON.stringify(p.features),
                JSON.stringify(p.images),
                JSON.stringify(p.colors),
                JSON.stringify(p.sizes),
                JSON.stringify(p.inventory),
                JSON.stringify(p.tags),
                p.badge
            );
        }
    });

    insertMany(products.PRODUCTS);
    console.log('Products seeded successfully');
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://api.paystack.co"],
        },
    },
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limiting for orders
const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 orders per hour per IP
    message: 'Order limit reached. Please try again later.'
});

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname)));

// Initialize database
initDatabase();

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all products
app.get('/api/products', (req, res) => {
    try {
        const { category, search, sort = 'featured' } = req.query;
        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category && category !== 'all') {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            sql += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        switch (sort) {
            case 'price-low':
                sql += ' ORDER BY price ASC';
                break;
            case 'price-high':
                sql += ' ORDER BY price DESC';
                break;
            case 'newest':
                sql += ' ORDER BY created_at DESC';
                break;
            default:
                sql += ' ORDER BY created_at DESC';
        }

        const products = db.prepare(sql).all(...params);
        
        // Parse JSON fields
        const parsedProducts = products.map(p => ({
            ...p,
            features: JSON.parse(p.features || '[]'),
            images: JSON.parse(p.images || '[]'),
            colors: JSON.parse(p.colors || '[]'),
            sizes: JSON.parse(p.sizes || '[]'),
            inventory: JSON.parse(p.inventory || '{}'),
            tags: JSON.parse(p.tags || '[]')
        }));

        res.json({ success: true, products: parsedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
});

// Get single product by slug
app.get('/api/products/:slug', (req, res) => {
    try {
        const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Parse JSON fields
        const parsedProduct = {
            ...product,
            features: JSON.parse(product.features || '[]'),
            images: JSON.parse(product.images || '[]'),
            colors: JSON.parse(product.colors || '[]'),
            sizes: JSON.parse(product.sizes || '[]'),
            inventory: JSON.parse(product.inventory || '{}'),
            tags: JSON.parse(product.tags || '[]')
        };

        res.json({ success: true, product: parsedProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
});

// Check inventory
app.post('/api/inventory/check', (req, res) => {
    try {
        const { productId, color, size } = req.body;
        const product = db.prepare('SELECT inventory FROM products WHERE id = ?').get(productId);
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const inventory = JSON.parse(product.inventory || '{}');
        const key = `${color}-${size}`;
        const quantity = inventory[key] || 0;

        res.json({ success: true, quantity, inStock: quantity > 0 });
    } catch (error) {
        console.error('Error checking inventory:', error);
        res.status(500).json({ success: false, error: 'Failed to check inventory' });
    }
});

// Initialize Paystack transaction
app.post('/api/payment/initialize', orderLimiter, async (req, res) => {
    try {
        const { email, amount, metadata } = req.body;

        if (!email || !amount) {
            return res.status(400).json({ success: false, error: 'Email and amount required' });
        }

        const paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
        
        const response = await paystack.transaction.initialize({
            email,
            amount: amount * 100, // Paystack expects amount in kobo (multiply by 100)
            metadata,
            callback_url: `${process.env.FRONTEND_URL}/payment/callback`
        });

        if (response.status) {
            res.json({ 
                success: true, 
                authorization_url: response.data.authorization_url,
                reference: response.data.reference
            });
        } else {
            res.status(400).json({ success: false, error: 'Payment initialization failed' });
        }
    } catch (error) {
        console.error('Paystack error:', error);
        res.status(500).json({ success: false, error: 'Payment service error' });
    }
});

// Verify Paystack payment
app.get('/api/payment/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;
        const paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
        
        const response = await paystack.transaction.verify({ reference });

        res.json({ 
            success: true, 
            status: response.data.status,
            amount: response.data.amount / 100,
            paid_at: response.data.paid_at
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
});

// Create order
app.post('/api/orders', orderLimiter, async (req, res) => {
    try {
        const orderId = 'LV-' + Date.now().toString(36).toUpperCase();
        const {
            email,
            firstName,
            lastName,
            address,
            apartment,
            city,
            state,
            zip,
            phone,
            shippingMethod,
            shippingCost,
            subtotal,
            discount,
            total,
            items,
            paystackReference
        } = req.body;

        // Insert order
        const insertOrder = db.prepare(`
            INSERT INTO orders (id, email, first_name, last_name, address, apartment, city, state, zip, phone, 
                              shipping_method, shipping_cost, subtotal, discount, total, paystack_reference, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
        `);

        insertOrder.run(
            orderId, email, firstName, lastName, address, apartment, city, state, zip, phone,
            shippingMethod, shippingCost, subtotal, discount, total, paystackReference
        );

        // Insert order items
        const insertItem = db.prepare(`
            INSERT INTO order_items (order_id, product_id, name, price, quantity, color, size)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const insertItems = db.transaction((items) => {
            for (const item of items) {
                insertItem.run(orderId, item.id, item.name, item.price, item.quantity, item.color, item.size);
            }
        });

        insertItems(items);

        // Send confirmation email (async, don't wait)
        sendOrderConfirmation(email, orderId, items, total).catch(console.error);

        res.json({ success: true, orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});

// Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
    try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.orderId);

        res.json({ success: true, order: { ...order, items } });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch order' });
    }
});

// Email service
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendOrderConfirmation(email, orderId, items, total) {
    const itemList = items.map(item => 
        `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price * item.quantity}</td>
        </tr>`
    ).join('');

    const mailOptions = {
        from: '"LA VAGUE" <orders@lavague.com>',
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Thank you for your order!</h2>
                <p>Order Number: <strong>${orderId}</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 10px; text-align: left;">Product</th>
                            <th style="padding: 10px; text-align: left;">Qty</th>
                            <th style="padding: 10px; text-align: left;">Total</th>
                        </tr>
                    </thead>
                    <tbody>${itemList}</tbody>
                </table>
                <p style="font-size: 18px; font-weight: bold;">Total: $${total}</p>
                <p>We'll send you another email when your order ships.</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    If you have any questions, reply to this email or contact us at support@lavague.com
                </p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

// 404 handler for API
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Serve 404 page for all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`LA VAGUE Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
