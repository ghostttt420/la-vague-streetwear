/**
 * LA VAGUE - Internationalization (i18n) Translations
 * Supports English (default), French, and Arabic
 */

const TRANSLATIONS = {
    en: {
        // Navigation
        nav: {
            home: 'Home',
            shop: 'Shop',
            collections: 'Collections',
            lookbook: 'Lookbook',
            about: 'About',
            contact: 'Contact',
            search: 'Search',
            wishlist: 'Wishlist',
            cart: 'Cart',
            menu: 'Menu'
        },
        
        // Hero Section
        hero: {
            title: 'Ride the Wave',
            description: 'Timeless streetwear crafted for those who set the trend, not follow it.',
            shopCollection: 'Shop Collection',
            viewLookbook: 'View Lookbook',
            scroll: 'Scroll'
        },
        
        // Announcement Bar
        announcement: {
            freeShipping: 'FREE SHIPPING ON ORDERS OVER $150',
            newDrop: 'NEW DROP AVAILABLE NOW'
        },
        
        // Marquee
        marquee: {
            newDrop: 'NEW DROP AVAILABLE NOW',
            freeShipping: 'FREE SHIPPING ON ORDERS OVER $150',
            limitedEdition: 'LIMITED EDITION PIECES'
        },
        
        // Featured Products
        featured: {
            tag: 'Bestsellers',
            title: 'Most Wanted',
            viewAll: 'View All Products'
        },
        
        // Collections
        collections: {
            tag: 'Collections',
            title: 'Shop by Category',
            hoodies: 'Hoodies',
            hoodiesDesc: 'Premium heavyweight essentials',
            tees: 'T-Shirts',
            teesDesc: 'Bold statements, premium fit',
            bottoms: 'Bottoms',
            bottomsDesc: 'From cargo to denim',
            accessories: 'Accessories',
            accessoriesDesc: 'Complete the look',
            shopNow: 'Shop Now →',
            new: 'New'
        },
        
        // Lookbook
        lookbook: {
            tag: 'Lookbook',
            title: 'Style Guide'
        },
        
        // About
        about: {
            tag: 'About Us',
            title: 'Born from the Streets,\nRefined for the Future',
            organicCotton: 'Organic Cotton',
            madeInNigeria: 'Made in Nigeria',
            timelessDesign: 'Timeless Design'
        },
        
        // Newsletter
        newsletter: {
            title: 'Join the Wave',
            description: 'Subscribe for early access to drops, exclusive offers, and behind-the-scenes content.',
            placeholder: 'Enter your email',
            subscribe: 'Subscribe',
            note: 'No spam, just waves. Unsubscribe anytime.'
        },
        
        // Footer
        footer: {
            tagline: 'Ride the wave. Timeless streetwear for the modern individual.',
            shop: 'Shop',
            allProducts: 'All Products',
            help: 'Help',
            shipping: 'Shipping',
            returns: 'Returns',
            faq: 'FAQ',
            company: 'Company',
            rights: 'All rights reserved.'
        },
        
        // Shop Page
        shop: {
            title: 'Shop All',
            description: 'Premium streetwear crafted in Nigeria',
            all: 'All',
            filter: 'Filter',
            featured: 'Featured',
            newest: 'Newest',
            priceLow: 'Price: Low to High',
            priceHigh: 'Price: High to Low',
            name: 'Name',
            products: 'products',
            filters: 'Filters',
            categories: 'Categories',
            allProducts: 'All Products',
            priceRange: 'Price Range',
            tags: 'Tags',
            onSale: 'On Sale',
            newArrivals: 'New Arrivals',
            bestsellers: 'Bestsellers',
            clearAll: 'Clear All',
            apply: 'Apply Filters',
            noProducts: 'No products found',
            tryAdjusting: 'Try adjusting your filters or search criteria',
            clearFilters: 'Clear All Filters'
        },
        
        // Product Page
        product: {
            color: 'Color',
            size: 'Size',
            select: 'Select',
            sizeGuide: 'Size Guide',
            addToCart: 'Add to Cart',
            added: 'Added!',
            freeShipping: 'Free shipping over $150',
            shipsIn: 'Ships within 24 hours',
            returns: '30-day returns',
            description: 'Description',
            shippingReturns: 'Shipping & Returns',
            shippingText: 'Free standard shipping on all orders over $150. Orders are processed within 24 hours and typically arrive within 3-5 business days.',
            returnsText: 'We accept returns within 30 days of delivery. Items must be unworn with original tags attached.',
            youMayAlsoLike: 'You May Also Like'
        },
        
        // Cart
        cart: {
            title: 'Your Cart',
            empty: 'Your cart is empty',
            continueShopping: 'Continue Shopping',
            subtotal: 'Subtotal',
            checkout: 'Checkout',
            note: 'Shipping & taxes calculated at checkout',
            wishlist: 'Your Wishlist',
            wishlistEmpty: 'Your wishlist is empty',
            startShopping: 'Start Shopping',
            remove: 'Remove',
            quantity: 'Quantity'
        },
        
        // Checkout
        checkout: {
            continueShopping: 'Continue Shopping',
            secure: 'Secure Checkout',
            contact: 'Contact',
            email: 'Email',
            newsletter: 'Email me with news and offers',
            shippingAddress: 'Shipping Address',
            firstName: 'First Name',
            lastName: 'Last Name',
            address: 'Address',
            apartment: 'Apartment, suite, etc. (optional)',
            city: 'City',
            state: 'State',
            zip: 'ZIP Code',
            phone: 'Phone',
            shippingMethod: 'Shipping Method',
            standardShipping: 'Standard Shipping',
            standardTime: '3-5 business days',
            expressShipping: 'Express Shipping',
            expressTime: '1-2 business days',
            payment: 'Payment',
            secureNote: 'All transactions are secure and encrypted.',
            creditCard: 'Credit Card',
            cardNumber: 'Card Number',
            expiry: 'Expiration Date',
            cvv: 'CVV',
            nameOnCard: 'Name on Card',
            saveInfo: 'Save this information for next time',
            completeOrder: 'Complete Order',
            processing: 'Processing...',
            termsNote: 'By placing your order, you agree to our Terms of Service and Privacy Policy.',
            orderSummary: 'Order Summary',
            discountCode: 'Discount code',
            apply: 'Apply',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            discount: 'Discount',
            total: 'Total',
            free: 'FREE'
        },
        
        // Quick View
        quickView: {
            addToCart: 'Add to Cart',
            sizeGuide: 'Size Guide'
        },
        
        // Size Guide
        sizeGuide: {
            title: 'Size Guide',
            note: 'Measurements may vary slightly. For the best fit, measure a similar garment you own and compare.'
        },
        
        // Toast Messages
        toast: {
            addedToCart: 'Added to cart',
            addedToWishlist: 'Added to wishlist',
            removedFromWishlist: 'Removed from wishlist',
            viewCart: 'View Cart',
            error: 'Error',
            success: 'Success'
        },
        
        // Search
        search: {
            placeholder: 'Search products...',
            noResults: 'No products found for',
            close: 'Close'
        },
        
        // Breadcrumb
        breadcrumb: {
            home: 'Home',
            shop: 'Shop'
        }
    },
    
    fr: {
        // Navigation
        nav: {
            home: 'Accueil',
            shop: 'Boutique',
            collections: 'Collections',
            lookbook: 'Lookbook',
            about: 'À Propos',
            contact: 'Contact',
            search: 'Rechercher',
            wishlist: 'Favoris',
            cart: 'Panier',
            menu: 'Menu'
        },
        
        // Hero Section
        hero: {
            title: 'Surfez la Vague',
            description: 'Streetwear intemporel conçu pour ceux qui créent les tendances, pas ceux qui les suivent.',
            shopCollection: 'Voir la Collection',
            viewLookbook: 'Voir le Lookbook',
            scroll: 'Défiler'
        },
        
        // Announcement Bar
        announcement: {
            freeShipping: 'LIVRAISON GRATUITE DÈS 150$',
            newDrop: 'NOUVELLE COLLECTION DISPONIBLE'
        },
        
        // Marquee
        marquee: {
            newDrop: 'NOUVELLE COLLECTION DISPONIBLE',
            freeShipping: 'LIVRAISON GRATUITE DÈS 150$',
            limitedEdition: 'PIÈCES ÉDITION LIMITÉE'
        },
        
        // Featured Products
        featured: {
            tag: 'Best-sellers',
            title: 'Les Plus Populaires',
            viewAll: 'Voir Tous les Produits'
        },
        
        // Collections
        collections: {
            tag: 'Collections',
            title: 'Acheter par Catégorie',
            hoodies: 'Sweats',
            hoodiesDesc: 'Essentiels premium épais',
            tees: 'T-Shirts',
            teesDesc: 'Déclarations audacieuses, coupe premium',
            bottoms: 'Bas',
            bottomsDesc: 'Du cargo au denim',
            accessories: 'Accessoires',
            accessoriesDesc: 'Complétez le look',
            shopNow: 'Acheter →',
            new: 'Nouveau'
        },
        
        // Lookbook
        lookbook: {
            tag: 'Lookbook',
            title: 'Guide de Style'
        },
        
        // About
        about: {
            tag: 'À Propos',
            title: 'Né dans la Rue,\nAffiné pour l\'Avenir',
            organicCotton: 'Coton Bio',
            madeInNigeria: 'Fabriqué au Nigeria',
            timelessDesign: 'Design Intemporel'
        },
        
        // Newsletter
        newsletter: {
            title: 'Rejoignez la Vague',
            description: 'Abonnez-vous pour un accès anticipé aux nouveautés, offres exclusives et contenu exclusif.',
            placeholder: 'Entrez votre email',
            subscribe: 'S\'abonner',
            note: 'Pas de spam, que des vagues. Désabonnez-vous à tout moment.'
        },
        
        // Footer
        footer: {
            tagline: 'Surfez la vague. Streetwear intemporel pour l\'individu moderne.',
            shop: 'Boutique',
            allProducts: 'Tous les Produits',
            help: 'Aide',
            shipping: 'Livraison',
            returns: 'Retours',
            faq: 'FAQ',
            company: 'Entreprise',
            rights: 'Tous droits réservés.'
        },
        
        // Shop Page
        shop: {
            title: 'Tous les Produits',
            description: 'Streetwear premium fabriqué au Nigeria',
            all: 'Tout',
            filter: 'Filtrer',
            featured: 'En Vedette',
            newest: 'Nouveautés',
            priceLow: 'Prix : Croissant',
            priceHigh: 'Prix : Décroissant',
            name: 'Nom',
            products: 'produits',
            filters: 'Filtres',
            categories: 'Catégories',
            allProducts: 'Tous les Produits',
            priceRange: 'Gamme de Prix',
            tags: 'Tags',
            onSale: 'En Promotion',
            newArrivals: 'Nouveautés',
            bestsellers: 'Best-sellers',
            clearAll: 'Tout Effacer',
            apply: 'Appliquer',
            noProducts: 'Aucun produit trouvé',
            tryAdjusting: 'Essayez d\'ajuster vos filtres ou critères de recherche',
            clearFilters: 'Effacer Tous les Filtres'
        },
        
        // Product Page
        product: {
            color: 'Couleur',
            size: 'Taille',
            select: 'Sélectionner',
            sizeGuide: 'Guide des Tailles',
            addToCart: 'Ajouter au Panier',
            added: 'Ajouté!',
            freeShipping: 'Livraison gratuite dès 150$',
            shipsIn: 'Expédié sous 24h',
            returns: 'Retours sous 30 jours',
            description: 'Description',
            shippingReturns: 'Livraison & Retours',
            shippingText: 'Livraison standard gratuite sur toutes les commandes de plus de 150$. Les commandes sont traitées sous 24 heures et arrivent généralement sous 3 à 5 jours ouvrés.',
            returnsText: 'Nous acceptons les retours dans les 30 jours suivant la livraison. Les articles doivent être non portés avec les étiquettes d\'origine.',
            youMayAlsoLike: 'Vous Aimerez Aussi'
        },
        
        // Cart
        cart: {
            title: 'Votre Panier',
            empty: 'Votre panier est vide',
            continueShopping: 'Continuer les Achats',
            subtotal: 'Sous-total',
            checkout: 'Commander',
            note: 'Livraison et taxes calculées à la commande',
            wishlist: 'Vos Favoris',
            wishlistEmpty: 'Votre liste de favoris est vide',
            startShopping: 'Commencer les Achats',
            remove: 'Retirer',
            quantity: 'Quantité'
        },
        
        // Checkout
        checkout: {
            continueShopping: 'Continuer les Achats',
            secure: 'Paiement Sécurisé',
            contact: 'Contact',
            email: 'Email',
            newsletter: 'M\'envoyer les actualités et offres',
            shippingAddress: 'Adresse de Livraison',
            firstName: 'Prénom',
            lastName: 'Nom',
            address: 'Adresse',
            apartment: 'Appartement, etc. (optionnel)',
            city: 'Ville',
            state: 'État',
            zip: 'Code Postal',
            phone: 'Téléphone',
            shippingMethod: 'Mode de Livraison',
            standardShipping: 'Livraison Standard',
            standardTime: '3-5 jours ouvrés',
            expressShipping: 'Livraison Express',
            expressTime: '1-2 jours ouvrés',
            payment: 'Paiement',
            secureNote: 'Toutes les transactions sont sécurisées et cryptées.',
            creditCard: 'Carte de Crédit',
            cardNumber: 'Numéro de Carte',
            expiry: 'Date d\'Expiration',
            cvv: 'CVV',
            nameOnCard: 'Nom sur la Carte',
            saveInfo: 'Sauvegarder ces informations',
            completeOrder: 'Valider la Commande',
            processing: 'Traitement...',
            termsNote: 'En passant votre commande, vous acceptez nos Conditions d\'Utilisation et Politique de Confidentialité.',
            orderSummary: 'Récapitulatif',
            discountCode: 'Code promo',
            apply: 'Appliquer',
            subtotal: 'Sous-total',
            shipping: 'Livraison',
            discount: 'Réduction',
            total: 'Total',
            free: 'GRATUIT'
        },
        
        // Quick View
        quickView: {
            addToCart: 'Ajouter au Panier',
            sizeGuide: 'Guide des Tailles'
        },
        
        // Size Guide
        sizeGuide: {
            title: 'Guide des Tailles',
            note: 'Les mesures peuvent légèrement varier. Pour le meilleur ajustement, mesurez un vêtement similaire que vous possédez et comparez.'
        },
        
        // Toast Messages
        toast: {
            addedToCart: 'Ajouté au panier',
            addedToWishlist: 'Ajouté aux favoris',
            removedFromWishlist: 'Retiré des favoris',
            viewCart: 'Voir le Panier',
            error: 'Erreur',
            success: 'Succès'
        },
        
        // Search
        search: {
            placeholder: 'Rechercher des produits...',
            noResults: 'Aucun produit trouvé pour',
            close: 'Fermer'
        },
        
        // Breadcrumb
        breadcrumb: {
            home: 'Accueil',
            shop: 'Boutique'
        }
    },
    
    ar: {
        // Navigation
        nav: {
            home: 'الرئيسية',
            shop: 'المتجر',
            collections: 'المجموعات',
            lookbook: 'لوك بوك',
            about: 'من نحن',
            contact: 'تواصل معنا',
            search: 'بحث',
            wishlist: 'المفضلة',
            cart: 'السلة',
            menu: 'القائمة'
        },
        
        // Hero Section
        hero: {
            title: 'اركب الموجة',
            description: 'ملابس شارع خالدة مصممة لمن يصنعون الموضة، لا من يتبعونها.',
            shopCollection: 'تسوق المجموعة',
            viewLookbook: 'عرض لوك بوك',
            scroll: 'اسحب للأسفل'
        },
        
        // Announcement Bar
        announcement: {
            freeShipping: 'شحن مجاني للطلبات فوق 150$',
            newDrop: 'تشكيلة جديدة متوفرة الآن'
        },
        
        // Marquee
        marquee: {
            newDrop: 'تشكيلة جديدة متوفرة الآن',
            freeShipping: 'شحن مجاني للطلبات فوق 150$',
            limitedEdition: 'قطع إصدار محدود'
        },
        
        // Featured Products
        featured: {
            tag: 'الأكثر مبيعاً',
            title: 'الأكثر طلباً',
            viewAll: 'عرض جميع المنتجات'
        },
        
        // Collections
        collections: {
            tag: 'المجموعات',
            title: 'تسوق حسب الفئة',
            hoodies: 'هوديز',
            hoodiesDesc: 'قطع أساسية فاخرة',
            tees: 'تيشيرتات',
            teesDesc: 'تصاميم جريئة، قماش مميز',
            bottoms: 'بناطيل',
            bottomsDesc: 'من الكارجو للجينز',
            accessories: 'إكسسوارات',
            accessoriesDesc: 'أكمل إطلالتك',
            shopNow: 'تسوق الآن →',
            new: 'جديد'
        },
        
        // Lookbook
        lookbook: {
            tag: 'لوك بوك',
            title: 'دليل الأناقة'
        },
        
        // About
        about: {
            tag: 'من نحن',
            title: 'ولدنا من الشارع،\nتطورنا للمستقبل',
            organicCotton: 'قطن عضوي',
            madeInNigeria: 'صنع في نيجيريا',
            timelessDesign: 'تصميم خالد'
        },
        
        // Newsletter
        newsletter: {
            title: 'انضم للموجة',
            description: 'اشترك للحصول على وصول مبكر للتشكيلات الجديدة والعروض الحصرية.',
            placeholder: 'أدخل بريدك الإلكتروني',
            subscribe: 'اشتراك',
            note: 'لا رسائل مزعجة، فقط موجات. يمكنك إلغاء الاشتراك في أي وقت.'
        },
        
        // Footer
        footer: {
            tagline: 'اركب الموجة. ملابس شارع خالدة للإنسان العصري.',
            shop: 'المتجر',
            allProducts: 'جميع المنتجات',
            help: 'المساعدة',
            shipping: 'الشحن',
            returns: 'الإرجاع',
            faq: 'الأسئلة الشائعة',
            company: 'الشركة',
            rights: 'جميع الحقوق محفوظة.'
        },
        
        // Shop Page
        shop: {
            title: 'جميع المنتجات',
            description: 'ملابس شارع فاخرة مصنوعة في نيجيريا',
            all: 'الكل',
            filter: 'تصفية',
            featured: 'المميز',
            newest: 'الأحدث',
            priceLow: 'السعر: من الأقل للأعلى',
            priceHigh: 'السعر: من الأعلى للأقل',
            name: 'الاسم',
            products: 'منتجات',
            filters: 'الفلاتر',
            categories: 'الفئات',
            allProducts: 'جميع المنتجات',
            priceRange: 'نطاق السعر',
            tags: 'الوسوم',
            onSale: 'تخفيضات',
            newArrivals: 'وصل حديثاً',
            bestsellers: 'الأكثر مبيعاً',
            clearAll: 'مسح الكل',
            apply: 'تطبيق',
            noProducts: 'لم يتم العثور على منتجات',
            tryAdjusting: 'حاول تعديل الفلاتر أو معايير البحث',
            clearFilters: 'مسح جميع الفلاتر'
        },
        
        // Product Page
        product: {
            color: 'اللون',
            size: 'المقاس',
            select: 'اختر',
            sizeGuide: 'دليل المقاسات',
            addToCart: 'أضف للسلة',
            added: 'تم الإضافة!',
            freeShipping: 'شحن مجاني للطلبات فوق 150$',
            shipsIn: 'الشحن خلال 24 ساعة',
            returns: 'إرجاع خلال 30 يوم',
            description: 'الوصف',
            shippingReturns: 'الشحن والإرجاع',
            shippingText: 'شحن قياسي مجاني لجميع الطلبات فوق 150$. تُعالج الطلبات خلال 24 ساعة وتصل عادةً خلال 3-5 أيام عمل.',
            returnsText: 'نقبل الإرجاع خلال 30 يوماً من التوصيل. يجب أن تكون المنتجات غير مستخدمة مع الوسوم الأصلية.',
            youMayAlsoLike: 'قد يعجبك أيضاً'
        },
        
        // Cart
        cart: {
            title: 'سلة التسوق',
            empty: 'سلة التسوق فارغة',
            continueShopping: 'مواصلة التسوق',
            subtotal: 'المجموع الفرعي',
            checkout: 'إتمام الشراء',
            note: 'الشحن والضرائب تحسب عند الدفع',
            wishlist: 'المفضلة',
            wishlistEmpty: 'قائمة المفضلة فارغة',
            startShopping: 'ابدأ التسوق',
            remove: 'إزالة',
            quantity: 'الكمية'
        },
        
        // Checkout
        checkout: {
            continueShopping: 'مواصلة التسوق',
            secure: 'دفع آمن',
            contact: 'التواصل',
            email: 'البريد الإلكتروني',
            newsletter: 'أرسل لي الأخبار والعروض',
            shippingAddress: 'عنوان الشحن',
            firstName: 'الاسم الأول',
            lastName: 'اسم العائلة',
            address: 'العنوان',
            apartment: 'شقة، جناح، إلخ (اختياري)',
            city: 'المدينة',
            state: 'الولاية',
            zip: 'الرمز البريدي',
            phone: 'الهاتف',
            shippingMethod: 'طريقة الشحن',
            standardShipping: 'الشحن القياسي',
            standardTime: '3-5 أيام عمل',
            expressShipping: 'الشحن السريع',
            expressTime: '1-2 يوم عمل',
            payment: 'الدفع',
            secureNote: 'جميع المعاملات آمنة ومشفرة.',
            creditCard: 'بطاقة ائتمان',
            cardNumber: 'رقم البطاقة',
            expiry: 'تاريخ الانتهاء',
            cvv: 'CVV',
            nameOnCard: 'الاسم على البطاقة',
            saveInfo: 'حفظ هذه المعلومات للمرة القادمة',
            completeOrder: 'إتمام الطلب',
            processing: 'جاري المعالجة...',
            termsNote: 'بتقديم طلبك، فإنك توافق على شروط الخدمة وسياسة الخصوصية.',
            orderSummary: 'ملخص الطلب',
            discountCode: 'كود الخصم',
            apply: 'تطبيق',
            subtotal: 'المجموع الفرعي',
            shipping: 'الشحن',
            discount: 'الخصم',
            total: 'الإجمالي',
            free: 'مجاني'
        },
        
        // Quick View
        quickView: {
            addToCart: 'أضف للسلة',
            sizeGuide: 'دليل المقاسات'
        },
        
        // Size Guide
        sizeGuide: {
            title: 'دليل المقاسات',
            note: 'قد تختلف القياسات قليلاً. للحصول على أفضل مقاس، قم بقياس قطعة ملابس مماثلة تمتلكها وقارن.'
        },
        
        // Toast Messages
        toast: {
            addedToCart: 'تمت الإضافة للسلة',
            addedToWishlist: 'تمت الإضافة للمفضلة',
            removedFromWishlist: 'تمت الإزالة من المفضلة',
            viewCart: 'عرض السلة',
            error: 'خطأ',
            success: 'نجاح'
        },
        
        // Search
        search: {
            placeholder: 'البحث في المنتجات...',
            noResults: 'لم يتم العثور على منتجات لـ',
            close: 'إغلاق'
        },
        
        // Breadcrumb
        breadcrumb: {
            home: 'الرئيسية',
            shop: 'المتجر'
        }
    }
};

// Language metadata for UI
const LANGUAGE_METADATA = {
    en: {
        code: 'en',
        name: 'English',
        flag: '🇬🇧',
        dir: 'ltr'
    },
    fr: {
        code: 'fr',
        name: 'Français',
        flag: '🇫🇷',
        dir: 'ltr'
    },
    ar: {
        code: 'ar',
        name: 'العربية',
        flag: '🇸🇦',
        dir: 'rtl'
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRANSLATIONS, LANGUAGE_METADATA };
}
