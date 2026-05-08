// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// เมื่อมี POST request เข้ามาที่ '/' (ซึ่งจะถูกแปลงเป็น /api/orders ใน server.js)
// จะเรียกใช้ฟังก์ชัน createOrder จาก Controller
router.post('/', orderController.createOrder);

module.exports = router;