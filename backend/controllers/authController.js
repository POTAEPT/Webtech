const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/store.db');
const db = new sqlite3.Database(dbPath);
const JWT_SECRET = 'amado_super_secret_key_2026';

// --- ฟังก์ชันล็อกอิน ---
async function loginUser(req, res) {
    const { username, password } = req.body; // รับเป็น username ตามหน้าบ้าน

    const sql = `SELECT * FROM USERS WHERE username = ?`;
    db.get(sql, [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'ไม่พบผู้ใช้งานหรือรหัสผ่านผิด' });
        }

        // เช็ครหัสผ่านที่เข้ารหัสไว้
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // สร้าง Token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ status: 'success', token, user: { first_name: user.first_name } });
    });
}

// --- ฟังก์ชันลงทะเบียน ---
async function registerUser(req, res) {
    const { username, password, first_name } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO USERS (username, password, first_name) VALUES (?, ?, ?)`;
        
        db.run(sql, [username, hashedPassword, first_name], function(err) {
            if (err) {
                // 🚨 เพิ่มบรรทัดนี้เพื่อสั่งปริ้นท์ Error ตัวจริงออกทาง Terminal
                console.error("❌ Database Error สาเหตุคือ:", err.message);
                return res.status(400).json({ message: 'เกิดข้อผิดพลาดที่ DB' });
            }
            res.status(201).json({ status: 'success', message: 'สมัครสมาชิกสำเร็จ!' });
        });
    } catch (error) {
        console.error("❌ Server Error สาเหตุคือ:", error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { loginUser, registerUser };