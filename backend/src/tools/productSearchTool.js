// backend/src/tools/productSearchTool.js
import { Tool } from "@langchain/core/tools";
import { searchProducts } from '../services/productService.js';

class ProductSearchTool extends Tool {
    name = "product_search";
    description = "Useful for searching for products in the e-commerce catalog based on keywords, categories, or price ranges. Input should be a concise string representing the search query (e.g., 'blue t-shirt', 'laptops under $1000').";

    async _call(query) {
        try {
            const products = await searchProducts(query);
            if (products && products.length > 0) {
                // Return a concise summary or relevant details
                return JSON.stringify(products.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    category: p.category
                    // You can add more fields if relevant, but keep it concise for LLM
                })));
            } else {
                return "No products found for that query.";
            }
        } catch (error) {
            console.error("Error in product_search tool:", error);
            return "An error occurred while searching for products.";
        }
    }
}

export const productSearchTool = new ProductSearchTool();