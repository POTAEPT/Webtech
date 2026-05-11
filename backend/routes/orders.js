// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 1. นำเข้า Middleware ที่เราเพิ่งสร้าง
const authMiddleware = require('../middlewares/authMiddleware');

// 2. เอา authMiddleware ไปคั่นกลางระหว่าง '/' กับ orderController
router.post('/', authMiddleware, orderController.createOrder);

module.exports = router;