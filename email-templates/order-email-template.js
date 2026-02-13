/**
 * LA VAGUE Order Email Templates
 * Responsive HTML email templates for order notifications
 */

// Brand colors
const BRAND = {
    primary: '#c41e3a',      // LA VAGUE red
    primaryDark: '#a01830',
    secondary: '#1a1a1a',    // Dark gray
    light: '#f8f8f8',        // Light gray background
    white: '#ffffff',
    text: '#333333',
    textLight: '#666666',
    border: '#e0e0e0',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8'
};

// Status configuration
const STATUS_CONFIG = {
    pending: {
        color: BRAND.warning,
        icon: '⏳',
        title: 'Order Pending',
        message: 'Your order has been received and is awaiting processing.'
    },
    processing: {
        color: BRAND.info,
        icon: '📦',
        title: 'Order Processing',
        message: 'Your order is being prepared for shipment.'
    },
    shipped: {
        color: BRAND.primary,
        icon: '🚚',
        title: 'Order Shipped',
        message: 'Your order is on its way! Track your package below.'
    },
    delivered: {
        color: BRAND.success,
        icon: '✅',
        title: 'Order Delivered',
        message: 'Your order has been delivered. Enjoy your purchase!'
    },
    cancelled: {
        color: BRAND.danger,
        icon: '❌',
        title: 'Order Cancelled',
        message: 'Your order has been cancelled. If you have any questions, please contact us.'
    }
};

/**
 * Format price from cents to currency string
 */
function formatPrice(cents, currency = '₦') {
    if (cents === undefined || cents === null) return `${currency}0.00`;
    return `${currency}${(cents / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate order items HTML
 */
function generateOrderItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return '<p style="color: #666;">No items</p>';
    }

    return items.map(item => `
        <tr>
            <td style="padding: 15px 10px; border-bottom: 1px solid ${BRAND.border};">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td width="60" style="vertical-align: top;">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />` : '<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 4px;"></div>'}
                        </td>
                        <td style="vertical-align: top; padding-left: 10px;">
                            <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${BRAND.secondary};">${item.name}</p>
                            ${item.color ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND.textLight};">Color: ${item.color}</p>` : ''}
                            ${item.size ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND.textLight};">Size: ${item.size}</p>` : ''}
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND.textLight};">Qty: ${item.quantity}</p>
                        </td>
                        <td width="100" style="vertical-align: top; text-align: right;">
                            <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${BRAND.secondary};">${formatPrice(item.price * item.quantity)}</p>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND.textLight};">${formatPrice(item.price)} each</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join('');
}

/**
 * Generate shipping address HTML
 */
function generateShippingAddress(address) {
    if (!address) return '<p style="color: #666;">No address provided</p>';
    
    const parts = [
        address.fullName,
        address.address,
        address.apartment,
        `${address.city}${address.state ? `, ${address.state}` : ''}`,
        address.postalCode,
        address.country || 'Nigeria',
        address.phone ? `Phone: ${address.phone}` : null
    ].filter(Boolean);

    return parts.map(part => `<p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.text};">${part}</p>`).join('');
}

/**
 * Generate tracking section HTML
 */
function generateTrackingSection(status, trackingNumber, trackingUrl) {
    if (status === 'pending' || status === 'processing' || status === 'cancelled') {
        return '';
    }

    const trackingInfo = trackingNumber ? `
        <tr>
            <td style="padding: 20px; background-color: ${BRAND.light}; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: ${BRAND.secondary};">📦 Tracking Information</h3>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND.text};">
                    <strong>Tracking Number:</strong> ${trackingNumber}
                </p>
                ${trackingUrl ? `
                <p style="margin: 0;">
                    <a href="${trackingUrl}" style="display: inline-block; padding: 10px 20px; background-color: ${BRAND.primary}; color: ${BRAND.white}; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Track Your Package</a>
                </p>
                ` : ''}
            </td>
        </tr>
    ` : '';

    return trackingInfo ? `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">${trackingInfo}</table>` : '';
}

/**
 * Generate order status timeline
 */
function generateStatusTimeline(currentStatus) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentStatus === 'cancelled') {
        return '';
    }

    const statusItems = statuses.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const statusConfig = STATUS_CONFIG[status];
        
        return `
            <td style="text-align: center; padding: 10px 5px;">
                <div style="width: 30px; height: 30px; line-height: 30px; border-radius: 50%; background-color: ${isActive ? statusConfig.color : BRAND.border}; color: ${isActive ? BRAND.white : BRAND.textLight}; font-size: 14px; margin: 0 auto 5px;">
                    ${isActive ? '✓' : (index + 1)}
                </div>
                <p style="margin: 0; font-size: 11px; color: ${isActive ? statusConfig.color : BRAND.textLight}; text-transform: capitalize; font-weight: ${isCurrent ? '600' : '400'};">${status}</p>
            </td>
        `;
    }).join('');

    return `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0;">
            <tr>${statusItems}</tr>
        </table>
    `;
}

/**
 * Base email template wrapper
 */
function baseTemplate(content, subject) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 20px !important; }
            .header { padding: 20px !important; }
            .order-details { padding: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; -webkit-font-smoothing: antialiased;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; background-color: ${BRAND.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${content}
                </table>
                
                <!-- Footer -->
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; margin-top: 20px;">
                    <tr>
                        <td style="padding: 20px; text-align: center; color: ${BRAND.textLight}; font-size: 12px;">
                            <p style="margin: 0 0 10px 0;">
                                <a href="https://la-vague.store" style="color: ${BRAND.primary}; text-decoration: none;">Visit our store</a> | 
                                <a href="https://la-vague.store/contact.html" style="color: ${BRAND.primary}; text-decoration: none;">Contact us</a>
                            </p>
                            <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} LA VAGUE. All rights reserved.</p>
                            <p style="margin: 0; font-size: 11px; color: #999;">
                                You received this email because you placed an order on our website.<br>
                                If you have any questions, please reply to this email or contact our support team.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Generate order email based on status
 */
export function generateOrderEmail(order, status) {
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const isConfirmation = status === 'pending';
    const subject = isConfirmation 
        ? `Order Confirmation - ${order.id}` 
        : `${statusConfig.title} - ${order.id}`;

    const headerColor = status === 'cancelled' ? BRAND.danger : (isConfirmation ? BRAND.success : statusConfig.color);
    const headerIcon = isConfirmation ? '🎉' : statusConfig.icon;
    const headerTitle = isConfirmation ? 'Thank You for Your Order!' : statusConfig.title;
    const headerMessage = isConfirmation 
        ? `We've received your order and will send you a confirmation once your items are on their way.` 
        : statusConfig.message;

    const content = `
        <!-- Header -->
        <tr>
            <td class="header" style="background-color: ${headerColor}; padding: 30px; text-align: center;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td style="text-align: center; padding-bottom: 15px;">
                            <img src="https://la-vague.store/la-vague-red-wordmark.png" alt="LA VAGUE" style="max-width: 150px; height: auto; filter: brightness(0) invert(1);" />
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 10px;">${headerIcon}</div>
                            <h1 style="margin: 0; font-size: 24px; color: ${BRAND.white}; font-weight: 600;">${headerTitle}</h1>
                            <p style="margin: 10px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">${headerMessage}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td class="content" style="padding: 30px;">
                <!-- Order Info -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                    <tr>
                        <td style="background-color: ${BRAND.light}; padding: 20px; border-radius: 8px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td width="50%" style="vertical-align: top;">
                                        <p style="margin: 0 0 5px 0; font-size: 12px; color: ${BRAND.textLight}; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                                        <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${BRAND.secondary};">${order.id}</p>
                                    </td>
                                    <td width="50%" style="vertical-align: top; text-align: right;">
                                        <p style="margin: 0 0 5px 0; font-size: 12px; color: ${BRAND.textLight}; text-transform: uppercase; letter-spacing: 0.5px;">Order Date</p>
                                        <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${BRAND.secondary};">${formatDate(order.created_at || order.createdAt)}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                ${generateStatusTimeline(status)}

                <!-- Order Items -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                    <tr>
                        <td>
                            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: ${BRAND.secondary};">Order Summary</h2>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${BRAND.white}; border: 1px solid ${BRAND.border}; border-radius: 8px;">
                                ${generateOrderItems(order.items)}
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Order Totals -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                    <tr>
                        <td style="background-color: ${BRAND.light}; padding: 20px; border-radius: 8px;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 5px 0;">
                                        <p style="margin: 0; font-size: 14px; color: ${BRAND.text};">Subtotal</p>
                                    </td>
                                    <td style="padding: 5px 0; text-align: right;">
                                        <p style="margin: 0; font-size: 14px; color: ${BRAND.text};">${formatPrice(order.subtotal)}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;">
                                        <p style="margin: 0; font-size: 14px; color: ${BRAND.text};">Shipping</p>
                                    </td>
                                    <td style="padding: 5px 0; text-align: right;">
                                        <p style="margin: 0; font-size: 14px; color: ${BRAND.text};">${formatPrice(order.shipping_cost || order.shippingCost)}</p>
                                    </td>
                                </tr>
                                ${(order.discount && order.discount > 0) ? `
                                <tr>
                                    <td style="padding: 5px 0;">
                                        <p style="margin: 0; font-size: 14px; color: ${BRAND.success};">Discount</p>
                                    </td>
                                    <td style="padding: 5px 0; text-align: right;">
                                        <p style="margin: 0; font-size: 14px; color: ${BRAND.success};">-${formatPrice(order.discount)}</p>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 10px 0; border-top: 2px solid ${BRAND.border};">
                                        <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${BRAND.secondary};">Total</p>
                                    </td>
                                    <td style="padding: 10px 0; border-top: 2px solid ${BRAND.border}; text-align: right;">
                                        <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${BRAND.primary};">${formatPrice(order.total)}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Shipping Address -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                    <tr>
                        <td>
                            <h2 style="margin: 0 0 15px 0; font-size: 18px; color: ${BRAND.secondary};">Shipping Address</h2>
                            <div style="background-color: ${BRAND.light}; padding: 20px; border-radius: 8px;">
                                ${generateShippingAddress(order.shipping_address || order.shippingAddress)}
                            </div>
                        </td>
                    </tr>
                </table>

                ${generateTrackingSection(status, order.trackingNumber, order.trackingUrl)}

                <!-- Contact Info -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
                    <tr>
                        <td style="background-color: ${BRAND.secondary}; padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: ${BRAND.white};">Need Help?</h3>
                            <p style="margin: 0 0 15px 0; font-size: 14px; color: rgba(255,255,255,0.8);">
                                If you have any questions about your order, our team is here to help.
                            </p>
                            <p style="margin: 0;">
                                <a href="mailto:support@la-vague.store" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 600;">support@la-vague.store</a> | 
                                <a href="https://la-vague.store/contact.html" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 600;">Contact Form</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `;

    return {
        subject,
        html: baseTemplate(content, subject)
    };
}

/**
 * Generate order confirmation email
 */
export function generateOrderConfirmationEmail(order) {
    return generateOrderEmail(order, 'pending');
}

/**
 * Generate order status update email
 */
export function generateOrderStatusEmail(order, newStatus) {
    return generateOrderEmail(order, newStatus);
}

/**
 * Generate test email preview
 */
export function generateTestEmail(order, status = 'pending') {
    const sampleOrder = order || {
        id: 'LV-TEST123',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        created_at: new Date().toISOString(),
        items: [
            {
                name: 'Classic White Shirt',
                price: 4500,
                quantity: 2,
                color: 'White',
                size: 'M',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200'
            },
            {
                name: 'Slim Fit Chinos',
                price: 6500,
                quantity: 1,
                color: 'Khaki',
                size: '32'
            }
        ],
        subtotal: 15500,
        shipping_cost: 1500,
        discount: 0,
        total: 17000,
        shipping_address: {
            fullName: 'John Doe',
            address: '123 Main Street',
            apartment: 'Apt 4B',
            city: 'Lagos',
            state: 'Lagos State',
            postalCode: '100001',
            country: 'Nigeria',
            phone: '+234 123 456 7890'
        },
        trackingNumber: 'TRK123456789',
        trackingUrl: 'https://tracking.example.com/TRK123456789'
    };

    return generateOrderEmail(sampleOrder, status);
}

export default {
    generateOrderEmail,
    generateOrderConfirmationEmail,
    generateOrderStatusEmail,
    generateTestEmail
};
