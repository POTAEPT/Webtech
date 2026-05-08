// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService'); 

const JWT_SECRET = 'amado_super_secret_key_2026'; 

// ฟังก์ชัน loginUser เดิม... (ยังคงไว้เหมือนเดิม)
async function loginUser(req, res) { /* โค้ดเดิมของคุณ */ }

// 🆕 ฟังก์ชันใหม่สำหรับจัดการการสมัครสมาชิก
async function registerUser(req, res) {
    try {
        // 1. ดึงข้อมูลที่ส่งมาจาก Frontend (ผ่าน fetch body)
        const { name, email, password } = req.body;

        // 2. Backend Validation (ด่านตรวจที่ 1)
        // ตรวจสอบว่าส่งข้อมูลมาครบหรือไม่ ป้องกันการใช้ Postman ยิง API มาแบบโล่งๆ
        if (!name || !email || !password) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
            });
        }

        // 3. ตรวจสอบอีเมลซ้ำ (ด่านตรวจที่ 2)
        // เรียกใช้ Service เพื่อหาว่ามีอีเมลนี้ในระบบหรือยัง
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            // ถ้ามีแล้ว ให้ตอบกลับด้วย Status 409 Conflict
            return res.status(409).json({ 
                status: 'fail', 
                message: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' 
            });
        }

        // 4. 🛡️ Security Logic: การเข้ารหัสผ่าน (Hashing)
        // ห้ามบันทึกรหัสผ่านแบบ Plaintext เด็ดขาด! เราจะใช้ bcrypt ในการ Hash
        const saltRounds = 10; // กำหนดความซับซ้อนของการเข้ารหัส (ยิ่งเยอะยิ่งปลอดภัย แต่เซิร์ฟเวอร์จะคำนวณนานขึ้น)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. ส่งข้อมูลไปบันทึกลง Database ผ่าน Service
        await userService.createUser({
            name: name,
            email: email,
            password: hashedPassword // ส่งรหัสผ่านที่ Hash แล้วไปบันทึกเท่านั้น!
        });

        // 6. เมื่อทุกอย่างเสร็จสมบูรณ์ ตอบกลับหน้าบ้านด้วย Status 201 (Created)
        res.status(201).json({
            status: 'success',
            message: 'สมัครสมาชิกสำเร็จเรียบร้อยแล้ว!'
        });

    } catch (error) {
        // ดักจับ Error กรณีมีพังกลางทาง (เช่น สิทธิ์การเขียนไฟล์ JSON ถูกปฏิเสธ)
        console.error("Register Error:", error);
        res.status(500).json({ 
            status: 'error', 
            message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' 
        });
    }
}

module.exports = {
    loginUser,
    registerUser // Export ฟังก์ชันออกไปให้ Router ใช้งาน
};