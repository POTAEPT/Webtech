// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// สมมติว่าเรามี userService ที่ต่อกับ SQLite เรียบร้อยแล้ว
const userService = require('../services/userService'); 

// ในการทำงานจริง ค่า Secret ห้าม Hardcode ไว้ในไฟล์เด็ดขาด! 
// ต้องดึงมาจากไฟล์ .env (เช่น process.env.JWT_SECRET)
const JWT_SECRET = 'amado_super_secret_key_2026'; 

async function loginUser(req, res) {
    try {
        // 1. รับค่า email และ password จาก Request Body
        const { email, password } = req.body;

        // Gatekeeper: เช็คเบื้องต้นว่าส่งข้อมูลมาครบไหม
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Please provide email and password' 
            });
        }

        // 2. ค้นหา User ใน Database ด้วย Email (SQLite)
        const user = await userService.getUserByEmail(email);

        // ถ้าไม่เจอ Email ในระบบ (User = null) 
        if (!user) {
            // 🛡️ Security Tip: เราจะไม่บอกแฮกเกอร์ว่า "ไม่พบ Email นี้" 
            // แต่เราจะบอกกว้างๆ ว่า "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง" (Invalid credentials)
            // เพื่อป้องกันการสุ่มเดา Email ในระบบ (Username Enumeration)
            return res.status(401).json({ 
                status: 'fail', 
                message: 'User Unauthorized: Invalid credentials.' 
            });
        }

        // 3. ใช้ bcrypt ตรวจสอบรหัสผ่าน
        // bcrypt.compare จะนำรหัสผ่านแบบ Plaintex
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'Pass Unauthorized: Invalid credentials.' 
            });
        }

        // 4. เมื่อรหัสผ่านถูกต้อง สร้าง JWT (JSON Web Token)
        // ประกอบด้วย 3 ส่วน: Payload (ข้อมูลที่อยากฝัง), Secret Key (กุญแจล็อค), Options (เช่น วันหมดอายุ)
        const token = jwt.sign(
            { id: user.id }, // ฝังเฉพาะ ID ลงไป (ไม่ควรฝัง Password หรือข้อมูล Sensitive ลงใน Token)
            JWT_SECRET,
            { expiresIn: '2h' } // กำหนดให้ Token หมดอายุใน 2 ชั่วโมง
        );

        // 5. ส่ง Token กลับไปให้ Frontend (พร้อม Status 200 OK)
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal Server Error' 
        });
    }
}

module.exports = {
    loginUser
};