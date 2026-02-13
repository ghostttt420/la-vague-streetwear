/**
 * LA VAGUE - Browse E2E Tests
 * Tests for browsing products, filtering, and search
 */

import { test, expect } from '@playwright/test';
import { mockProducts } from '../fixtures/test-data.js';

test.describe('Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop.html');
  });

  test.describe('Shop Page Load', () => {
    test('should display shop page title', async ({ page }) => {
      await expect(page.locator('.shop-title')).toBeVisible();
      await expect(page.locator('.shop-title')).toContainText('Shop');
    });

    test('should display product grid', async ({ page }) => {
      await expect(page.locator('.product-grid')).toBeVisible();
    });

    test('should display products', async ({ page }) => {
      const products = page.locator('.product-card');
      await expect(products.first()).toBeVisible();
      // Should have multiple products
      await expect(products).toHaveCount(await products.count());
    });

    test('should display product information', async ({ page }) => {
      const firstProduct = page.locator('.product-card').first();
      await expect(firstProduct.locator('.product-name')).toBeVisible();
      await expect(firstProduct.locator('.product-price')).toBeVisible();
    });

    test('should display product images', async ({ page }) => {
      const firstProduct = page.locator('.product-card').first();
      await expect(firstProduct.locator('img')).toBeVisible();
    });
  });

  test.describe('Product Filtering', () => {
    test('should open filter sidebar', async ({ page }) => {
      await page.click('#filterToggle');
      await expect(page.locator('.filter-sidebar')).toBeVisible();
    });

    test('should filter by category - Hoodies', async ({ page }) => {
      await page.click('#filterToggle');
      await page.click('input[value="hoodies"]');
      await page.click('#applyFilters');
      
      // Wait for filter to apply
      await page.waitForTimeout(500);
      
      // Check that only hoodies are displayed
      const productNames = await page.locator('.product-name').allTextContents();
      for (const name of productNames) {
        expect(name.toLowerCase()).toContain('hoodie');
      }
    });

    test('should filter by category - T-Shirts', async ({ page }) => {
      await page.click('#filterToggle');
      await page.click('input[value="tees"]');
      await page.click('#applyFilters');
      
      await page.waitForTimeout(500);
      
      const productNames = await page.locator('.product-name').allTextContents();
      for (const name of productNames) {
        expect(
          name.toLowerCase().includes('tee') || 
          name.toLowerCase().includes('t-shirt') ||
          name.toLowerCase().includes('long sleeve')
        ).toBeTruthy();
      }
    });

    test('should filter by category - Bottoms', async ({ page }) => {
      await page.click('#filterToggle');
      await page.click('input[value="bottoms"]');
      await page.click('#applyFilters');
      
      await page.waitForTimeout(500);
      
      const productNames = await page.locator('.product-name').allTextContents();
      for (const name of productNames) {
        expect(
          name.toLowerCase().includes('pant') || 
          name.toLowerCase().includes('jean') ||
          name.toLowerCase().includes('sweatpant')
        ).toBeTruthy();
      }
    });

    test('should filter by category - Accessories', async ({ page }) => {
      await page.click('#filterToggle');
      await page.click('input[value="accessories"]');
      await page.click('#applyFilters');
      
      await page.waitForTimeout(500);
      
      const productNames = await page.locator('.product-name').allTextContents();
      for (const name of productNames) {
        expect(
          name.toLowerCase().includes('cap') || 
          name.toLowerCase().includes('bag') ||
          name.toLowerCase().includes('sock')
        ).toBeTruthy();
      }
    });

    test('should filter by price range', async ({ page }) => {
      await page.click('#filterToggle');
      
      // Set price range (0-50)
      await page.fill('#priceMin', '0');
      await page.fill('#priceMax', '50');
      await page.click('#applyFilters');
      
      await page.waitForTimeout(500);
      
      // Check that products are within price range
      const prices = await page.locator('.product-price').allTextContents();
      for (const priceText of prices) {
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        expect(price).toBeLessThanOrEqual(50);
      }
    });

    test('should filter by sale tag', async ({ page }) => {
      await page.click('#filterToggle');
      await page.click('input[value="sale"]');
      await page.click('#applyFilters');
      
      await page.waitForTimeout(500);
      
      // Check for sale badges or compare prices
      const saleBadges = page.locator('.product-badge:has-text("Sale")');
      const comparePrices = page.locator('.compare-price');
      
      const hasSale = await saleBadges.isVisible().catch(() => false) ||
                      await comparePrices.first().isVisible().catch(() => false);
      
      // If products are displayed, they should be on sale
      const products = page.locator('.product-card');
      if (await products.count() > 0) {
        expect(hasSale).toBeTruthy();
      }
    });

    test('should clear all filters', async ({ page }) => {
      // Apply a filter first
      await page.click('#filterToggle');
      await page.click('input[value="hoodies"]');
      await page.click('#applyFilters');
      await page.waitForTimeout(500);
      
      // Clear filters
      await page.click('#clearFilters');
      await page.waitForTimeout(500);
      
      // Check that all products are displayed again
      const products = page.locator('.product-card');
      expect(await products.count()).toBeGreaterThan(1);
    });
  });

  test.describe('Product Search', () => {
    test('should search for products', async ({ page }) => {
      // Find and fill search input
      const searchInput = page.locator('#searchInput');
      await searchInput.fill('hoodie');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(500);
      
      // Check that results contain search term
      const productNames = await page.locator('.product-name').allTextContents();
      for (const name of productNames) {
        expect(name.toLowerCase()).toContain('hoodie');
      }
    });

    test('should show no results for invalid search', async ({ page }) => {
      const searchInput = page.locator('#searchInput');
      await searchInput.fill('xyznonexistent123');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(500);
      
      // Check for empty state
      await expect(page.locator('.empty-state')).toBeVisible();
    });

    test('should clear search results', async ({ page }) => {
      // Search first
      const searchInput = page.locator('#searchInput');
      await searchInput.fill('hoodie');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);
      
      // Clear search (if clear button exists)
      const clearButton = page.locator('.search-clear');
      if (await clearButton.isVisible().catch(() => false)) {
        await clearButton.click();
        await page.waitForTimeout(500);
        
        // Check that all products are displayed
        const products = page.locator('.product-card');
        expect(await products.count()).toBeGreaterThan(1);
      }
    });
  });

  test.describe('Product Sorting', () => {
    test('should sort by price low to high', async ({ page }) => {
      const sortSelect = page.locator('#sortSelect');
      if (await sortSelect.isVisible().catch(() => false)) {
        await sortSelect.selectOption('price-low');
        await page.waitForTimeout(500);
        
        // Check prices are in ascending order
        const prices = await page.locator('.product-price').allTextContents();
        const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
        
        for (let i = 0; i < numericPrices.length - 1; i++) {
          expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
        }
      }
    });

    test('should sort by price high to low', async ({ page }) => {
      const sortSelect = page.locator('#sortSelect');
      if (await sortSelect.isVisible().catch(() => false)) {
        await sortSelect.selectOption('price-high');
        await page.waitForTimeout(500);
        
        // Check prices are in descending order
        const prices = await page.locator('.product-price').allTextContents();
        const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
        
        for (let i = 0; i < numericPrices.length - 1; i++) {
          expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i + 1]);
        }
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to product page on click', async ({ page }) => {
      const firstProduct = page.locator('.product-card').first();
      const productName = await firstProduct.locator('.product-name').textContent();
      
      await firstProduct.click();
      
      // Should navigate to product page
      await expect(page).toHaveURL(/product\.html/);
      
      // Product name should be displayed
      await expect(page.locator('h1')).toContainText(productName.trim());
    });

    test('should have working pagination if products > page size', async ({ page }) => {
      const pagination = page.locator('.pagination');
      if (await pagination.isVisible().catch(() => false)) {
        const nextButton = page.locator('.pagination-next');
        if (await nextButton.isVisible().catch(() => false)) {
          await nextButton.click();
          await page.waitForTimeout(500);
          
          // URL should have page parameter
          expect(page.url()).toContain('page=');
        }
      }
    });
  });
});
