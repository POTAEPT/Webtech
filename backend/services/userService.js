// backend/services/userService.js
const fs = require('fs').promises;
const path = require('path');

// ชี้เป้าไปที่ไฟล์ Mock Database ของเรา
const usersFilePath = path.join(__dirname, '../data/users.json');

/**
 * ฟังก์ชันค้นหาผู้ใช้งานจาก Email (Username)
 */
async function getUserByEmail(email) {
    try {
        // อ่านไฟล์ JSON
        const data = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(data);

        // ค้นหา User ใน Array ที่มี username ตรงกับ email ที่ส่งเข้ามา
        const foundUser = users.find(u => u.username === email);

        return foundUser;

    } catch (error) {
        console.error("Error reading user database:", error);
        throw new Error("Could not access user data");
    }
}

module.exports = {
    getUserByEmail
};