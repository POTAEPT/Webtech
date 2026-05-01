// backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// เมื่อมี GET Request เข้ามาที่ '/' ของ Route นี้ 
// ให้ส่งงานต่อให้ฟังก์ชัน getProducts ใน Controller ทำงาน
router.get('/', productController.getProducts);

module.exports = router;