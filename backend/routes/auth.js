// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// ดึง Controller ที่เราเขียนไว้เมื่อกี้เข้ามา
const authController = require('../controllers/authController');

// 💡 Logic สำคัญ: ตรงนี้ต้องใช้ .post() นะครับ เพราะเราส่งข้อมูลแบบ POST 
router.post('/login', authController.loginUser);

// ส่งออก router ไปให้ server.js ใช้งาน
module.exports = router;