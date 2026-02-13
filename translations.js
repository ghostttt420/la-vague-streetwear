/**
 * LA VAGUE - Translation Dictionary
 * Minimal translations for key UI elements
 */

const TRANSLATIONS = {
    en: {
        nav: {
            home: 'Home',
            shop: 'Shop',
            collections: 'Collections',
            lookbook: 'Lookbook',
            about: 'About',
            contact: 'Contact',
            cart: 'Cart',
            wishlist: 'Wishlist',
            search: 'Search'
        },
        product: {
            addToCart: 'Add to Cart',
            soldOut: 'Sold Out',
            sizeGuide: 'Size Guide',
            description: 'Description',
            shipping: 'Shipping',
            reviews: 'Reviews',
            writeReview: 'Write a Review',
            submitReview: 'Submit Review',
            rating: 'Rating',
            reviewTitle: 'Review Title',
            reviewText: 'Review',
            yourName: 'Your Name',
            email: 'Email',
            orderId: 'Order ID (optional)',
            verifiedPurchase: 'Verified Purchase'
        },
        cart: {
            title: 'Your Cart',
            empty: 'Your cart is empty',
            continueShopping: 'Continue Shopping',
            subtotal: 'Subtotal',
            checkout: 'Checkout'
        },
        common: {
            close: 'Close',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success'
        }
    },
    fr: {
        nav: {
            home: 'Accueil',
            shop: 'Boutique',
            collections: 'Collections',
            lookbook: 'Lookbook',
            about: 'À Propos',
            contact: 'Contact',
            cart: 'Panier',
            wishlist: 'Favoris',
            search: 'Recherche'
        },
        product: {
            addToCart: 'Ajouter au Panier',
            soldOut: 'Épuisé',
            sizeGuide: 'Guide des Tailles',
            description: 'Description',
            shipping: 'Livraison',
            reviews: 'Avis',
            writeReview: 'Écrire un Avis',
            submitReview: 'Soumettre',
            rating: 'Note',
            reviewTitle: 'Titre de l\'avis',
            reviewText: 'Votre avis',
            yourName: 'Votre nom',
            email: 'Email',
            orderId: 'N° de commande (optionnel)',
            verifiedPurchase: 'Achat Vérifié'
        },
        cart: {
            title: 'Votre Panier',
            empty: 'Votre panier est vide',
            continueShopping: 'Continuer les achats',
            subtotal: 'Sous-total',
            checkout: 'Commander'
        },
        common: {
            close: 'Fermer',
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès'
        }
    },
    ar: {
        nav: {
            home: 'الرئيسية',
            shop: 'المتجر',
            collections: 'المجموعات',
            lookbook: 'لوك بوك',
            about: 'من نحن',
            contact: 'اتصل بنا',
            cart: 'سلة التسوق',
            wishlist: 'المفضلة',
            search: 'بحث'
        },
        product: {
            addToCart: 'أضف إلى السلة',
            soldOut: 'نفذت الكمية',
            sizeGuide: 'دليل المقاسات',
            description: 'الوصف',
            shipping: 'الشحن',
            reviews: 'التقييمات',
            writeReview: 'كتابة تقييم',
            submitReview: 'إرسال التقييم',
            rating: 'التقييم',
            reviewTitle: 'عنوان التقييم',
            reviewText: 'التقييم',
            yourName: 'الاسم',
            email: 'البريد الإلكتروني',
            orderId: 'رقم الطلب (اختياري)',
            verifiedPurchase: 'شراء موثق'
        },
        cart: {
            title: 'سلة التسوق',
            empty: 'سلة التسوق فارغة',
            continueShopping: 'مواصلة التسوق',
            subtotal: 'المجموع الفرعي',
            checkout: 'إتمام الشراء'
        },
        common: {
            close: 'إغلاق',
            loading: 'جاري التحميل...',
            error: 'خطأ',
            success: 'نجاح'
        }
    }
};

// Translation helper function
function t(key, lang = null) {
    const currentLang = lang || localStorage.getItem('preferredLanguage') || 'en';
    const keys = key.split('.');
    let value = TRANSLATIONS[currentLang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // Fallback to English
            value = TRANSLATIONS.en;
            for (const k2 of keys) {
                value = value?.[k2] || key;
            }
            return value;
        }
    }
    
    return value || key;
}

// Apply translations to elements with data-i18n attribute
function applyTranslations() {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key, lang);
        if (translation && translation !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        }
    });
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', applyTranslations);
