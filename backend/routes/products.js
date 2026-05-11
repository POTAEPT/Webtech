// backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 1. Route สำหรับค้นหาตามหมวดหมู่ (Gatekeeper)
// เมื่อมีคนยิง GET มาที่ /api/products/category?category=...
router.get('/category', productController.getProductsByCategory);

// 2. Route ดั้งเดิม สำหรับดึงสินค้าทั้งหมด
// เมื่อมีคนยิง GET มาที่ /api/products เฉยๆ
router.get('/', productController.getProducts);

// 3. Route สำหรับลดจำนวนสินค้าในสต็อก
router.patch('/:id/reduce-stock', productController.reduceProductStock);

module.exports = router;