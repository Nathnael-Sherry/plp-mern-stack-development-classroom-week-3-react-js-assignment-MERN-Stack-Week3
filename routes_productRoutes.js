const express = require('express');
const { validateProduct } = require('../middleware/validateProduct');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, ValidationError } = require('../utils/errors');

const router = express.Router();

// In-memory data store (replace with database in production)
let products = [
    { id: '1', name: 'Sample Product', description: 'Sample description', price: 99.99, category: 'Electronics', inStock: true }
];

// GET /api/products - List all products with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 10, search } = req.query;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Search by name
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
        products: paginatedProducts,
        total: filteredProducts.length,
        page: parseInt(page),
        limit: parseInt(limit)
    });
}));

// GET /api/products/:id - Get specific product
router.get('/:id', asyncHandler(async (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    res.json(product);
}));

// POST /api/products - Create new product
router.post('/', authenticate, validateProduct, asyncHandler(async (req, res) => {
    const product = {
        id: Date.now().toString(),
        ...req.body
    };
    products.push(product);
    res.status(201).json(product);
}));

// PUT /api/products/:id - Update product
router.put('/:id', authenticate, validateProduct, asyncHandler(async (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        throw new NotFoundError('Product not found');
    }
    products[index] = { id: req.params.id, ...req.body };
    res.json(products[index]);
}));

// DELETE /api/products/:id - Delete product
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        throw new NotFoundError('Product not found');
    }
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
}));

// GET /api/products/stats - Get product statistics
router.get('/stats', asyncHandler(async (req, res) => {
    const stats = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});
    
    res.json({
        totalProducts: products.length,
        categories: stats
    });
}));

module.exports = router;