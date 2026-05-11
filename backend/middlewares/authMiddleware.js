// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// ในโปรเจคจริงคีย์นี้จะอยู่ในไฟล์ .env นะครับ (ต้องเป็นคีย์เดียวกับที่ระบบ Auth ใช้สร้าง Token)
const SECRET_KEY = 'amado_super_secret_key_2026'; 

const verifyToken = (req, res, next) => {
    // 1. มองหา Header ที่ชื่อ Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: "Access Denied: ไม่พบ Token กรุณาล็อกอิน" });

    // 2. ปกติ Token จะมาในรูปแบบ "Bearer eyJhbGciOi..." เราจึงต้องตัดคำว่า Bearer ออก
    const token = authHeader.split(' ')[1];

    try {
        // 3. ถอดรหัสและยืนยันความถูกต้องของ Token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 4. ฝังข้อมูล User (เช่น id) ที่แกะได้ ลงไปใน Request ซะเลย!
        req.user = decoded; 
        
        // 5. ปล่อยผ่านให้เข้าไปหา Controller ได้
        next(); 
    } catch (error) {
        res.status(403).json({ error: "Invalid Token: โทเคนหมดอายุหรือไม่ถูกต้อง" });
    }
};

module.exports = verifyToken;