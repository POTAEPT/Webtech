// backend/services/productService.js
const fs = require('fs').promises; // ใช้ File System แบบ Promise (Asynchronous)
const path = require('path');

// กำหนด Path ไปหาไฟล์ products.json ให้ถูกต้อง
const dataFilePath = path.join(__dirname, '../data/products.json');

/**
 * ดึงข้อมูลสินค้าทั้งหมดจากไฟล์ JSON
 */
async function getAllProducts() {
    try {
        // อ่านไฟล์แบบ Asynchronous เพื่อไม่ให้เซิร์ฟเวอร์โดนบล็อกการทำงาน (Non-blocking I/O)
        const data = await fs.readFile(dataFilePath, 'utf8');
        // แปลง String เป็น JSON Object
        return JSON.parse(data);
    } catch (error) {
        // ถ้าหาไฟล์ไม่เจอ หรือ JSON พัง ให้โยน Error ออกไปให้ Controller จัดการ
        throw new Error('Could not fetch products data');
    }
}

// นำออก (Export) ฟังก์ชันไปให้ Controller ใช้งาน
module.exports = {
    getAllProducts
};