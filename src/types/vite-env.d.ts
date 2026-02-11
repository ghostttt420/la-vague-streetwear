/// <reference types="vite/client" />

/**
 * LA VAGUE - Vite Environment Types
 * Type definitions for Vite environment variables
 */

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_PAYSTACK_PUBLIC_KEY: string;
    readonly VITE_SITE_URL: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
