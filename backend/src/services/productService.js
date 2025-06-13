// backend/src/services/productService.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises'; // Use fs.promises for async file operations

// Get the current directory name in an ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let productsData = [];

// Function to load products data
const loadProductsData = async () => {
    try {
        const filePath = join(__dirname, '../../../data/products.json');
        const data = await fs.readFile(filePath, 'utf8');
        productsData = JSON.parse(data);
        console.log("Products data loaded successfully.");
    } catch (error) {
        console.error("Error loading products data:", error);
        productsData = []; // Ensure it's an empty array on error
    }
};

// Load data immediately when the module is imported
// Or you could call this in initializeAgent() if preferred
loadProductsData();


export const searchProducts = async (query) => {
    // Simulate async DB call
    await new Promise(resolve => setTimeout(resolve, 200));

    if (productsData.length === 0) {
        console.warn("Products data not loaded. Attempting to reload.");
        await loadProductsData(); // Try to load data if it failed initially
        if (productsData.length === 0) {
            return []; // If still no data, return empty
        }
    }

    const lowerCaseQuery = query.toLowerCase();
    return productsData.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
    );
};