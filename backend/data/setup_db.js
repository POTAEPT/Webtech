const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'store.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ เชื่อมต่อล้มเหลว:", err.message);
    } else {
        console.log("✅ สร้าง/เชื่อมต่อไฟล์ store.db สำเร็จ");
    }
});

db.serialize(() => {
    // เปิดระบบ Foreign Key เพื่อป้องกันข้อมูลขยะ
    db.run("PRAGMA foreign_keys = ON;");

    // ==========================================
    // Phase 1: สร้างตารางทั้งหมดตาม ER Diagram
    // ==========================================
    console.log("กำลังสร้างตาราง...");

    // 1. ตาราง USERS
    db.run(`CREATE TABLE IF NOT EXISTS USERS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        date_of_registration DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. ตาราง PRODUCTS
    db.run(`CREATE TABLE IF NOT EXISTS PRODUCTS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT,
        mainImage TEXT,
        hoverImage TEXT,
        productUrl TEXT,
        rating INTEGER
    )`);

    // 3. ตาราง ORDERS (เชื่อมกับ USERS)
    db.run(`CREATE TABLE IF NOT EXISTS ORDERS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_amount REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
    )`);

    // 4. ตาราง ORDER_ITEMS (เชื่อมกับ ORDERS และ PRODUCTS)
    db.run(`CREATE TABLE IF NOT EXISTS ORDER_ITEMS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES ORDERS(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES PRODUCTS(id)
    )`);

    console.log("✅ สร้างโครงสร้างตารางทั้ง 4 ตารางสำเร็จ!");

    // ==========================================
    // Phase 2: ย้ายข้อมูลจาก JSON (Data Seeding)
    // ==========================================
    console.log("กำลังย้ายข้อมูล Master Data...");

    // --- Seeding PRODUCTS ---
    try {
        const productsPath = path.resolve(__dirname, 'products.json');
        if (fs.existsSync(productsPath)) {
            const rawProducts = fs.readFileSync(productsPath, 'utf8');
            const products = JSON.parse(rawProducts);

            // เตรียมคำสั่ง Insert (สังเกตว่าเราบังคับใส่ id ตาม JSON เพื่อความเป๊ะของข้อมูลอ้างอิง)
            const stmtProduct = db.prepare("INSERT INTO PRODUCTS (id, name, price, category, mainImage, hoverImage, productUrl, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            
            products.forEach(p => {
                stmtProduct.run([p.id, p.name, p.price, p.category, p.mainImage, p.hoverImage, p.productUrl, p.rating]);
            });
            stmtProduct.finalize();
            console.log(`✅ ย้ายข้อมูลสินค้าลงตาราง PRODUCTS สำเร็จ (${products.length} รายการ)`); // จะได้ 21 รายการตามไฟล์
        }
    } catch (err) {
        console.error("❌ Error products.json:", err.message);
    }

    // --- Seeding USERS ---
    try {
        const usersPath = path.resolve(__dirname, 'users.json');
        if (fs.existsSync(usersPath)) {
            const rawUsers = fs.readFileSync(usersPath, 'utf8');
            const users = JSON.parse(rawUsers);

            // เตรียมคำสั่ง Insert สำหรับ Users
            const stmtUser = db.prepare("INSERT INTO USERS (id, username, password, first_name, date_of_registration) VALUES (?, ?, ?, ?, ?)");
            
            users.forEach(u => {
                stmtUser.run([u.id, u.username, u.password, u.first_name, u.date_of_registration]);
            });
            stmtUser.finalize();
            console.log(`✅ ย้ายข้อมูลผู้ใช้งานลงตาราง USERS สำเร็จ (${users.length} รายการ)`); // จะได้ 10 รายการตามไฟล์
        }
    } catch (err) {
        console.error("❌ Error users.json:", err.message);
    }
});

// ปิดการเชื่อมต่อ
db.close((err) => {
    if (err) console.error(err.message);
    console.log("🔌 ปิดการเชื่อมต่อ Database. ระบบพร้อมนำไปเชื่อมต่อกับ Express แล้ว!");
});