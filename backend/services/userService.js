// backend/services/userService.js
const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

// ฟังก์ชันเดิมที่มีอยู่แล้ว
async function getUserByEmail(email) {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(data);
        const foundUser = users.find(u => u.username === email);
        return foundUser;
    } catch (error) {
        console.error("Error reading user database:", error);
        throw new Error("Could not access user data");
    }
}

// 🆕 สร้างฟังก์ชันใหม่สำหรับบันทึกผู้ใช้ลงฐานข้อมูล
async function createUser(userData) {
    try {
        // 1. อ่านข้อมูลทั้งหมดจากไฟล์ JSON ขึ้นมาก่อน
        const data = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(data);

        // 2. Logic การสร้าง ID อัตโนมัติ (Auto-increment)
        // ตรวจสอบว่าใน Array มีผู้ใช้หรือยัง ถ้ามีให้หา ID ที่มากที่สุดแล้วบวก 1 ถ้าไม่มีให้เริ่มที่ 1
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        // 3. ประกอบร่าง Object ผู้ใช้คนใหม่ ให้โครงสร้างตรงกับ users.json
        const newUser = {
            id: newId,
            username: userData.email, // เราใช้อีเมลเป็น Username
            password: userData.password, // ค่านี้ต้องถูก Hash มาแล้วจาก Controller!
            first_name: userData.name,
            date_of_registration: new Date().toISOString() // เก็บเวลา ณ ปัจจุบันในรูปแบบมาตรฐาน ISO
        };

        // 4. นำ Object ใหม่ ดัน (Push) เข้าไปใน Array
        users.push(newUser);

        // 5. แปลง Array กลับเป็นสตริง JSON (null, 2 คือการจัด Format ให้ไฟล์เว้นบรรทัดอ่านง่าย)
        // แล้วเขียนทับไฟล์เดิม
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        // คืนค่าข้อมูลคนที่เพิ่งสร้างสำเร็จกลับไป (แต่จะไม่ส่ง Password กลับไปแสดงผลนะ ปลอดภัยไว้ก่อน)
        return newUser;

    } catch (error) {
        console.error("Error writing user database:", error);
        throw new Error("Could not save user data");
    }
}

module.exports = {
    getUserByEmail,
    createUser // อย่าลืม Export ออกไปด้วย
};