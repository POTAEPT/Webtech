// backend/controllers/orderController.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// เชื่อมต่อ Database (ถอยหลัง 1 โฟลเดอร์เพื่อหา store.db)
const dbPath = path.resolve(__dirname, '../data/store.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ orderController: เชื่อมต่อ DB ล้มเหลว:", err.message);
});

// ฟังก์ชันสร้างคำสั่งซื้อ
exports.createOrder = (req, res) => {
    const { user_id, product_id, quantity, total_price } = req.body;

    // 1. Validation เช็คว่าข้อมูลมาครบไหม
    if (!user_id || !product_id || !quantity || !total_price) {
        return res.status(400).json({ error: "ส่งข้อมูลมาไม่ครบถ้วน กรุณาตรวจสอบ" });
    }

    const unit_price = total_price / quantity;

    // 2. เริ่ม Transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION;');

        // Step 1: สร้างบิล ORDERS
        const insertOrderSql = `INSERT INTO ORDERS (user_id, total_amount) VALUES (?, ?)`;
        db.run(insertOrderSql, [user_id, total_price], function(err) {
            if (err) {
                db.run('ROLLBACK;');
                return res.status(500).json({ error: "สร้างบิลไม่สำเร็จ", details: err.message });
            }

            const newOrderId = this.lastID;

            // Step 2: ใส่สินค้าลง ORDER_ITEMS
            const insertItemSql = `INSERT INTO ORDER_ITEMS (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`;
            db.run(insertItemSql, [newOrderId, product_id, quantity, unit_price], function(err) {
                if (err) {
                    db.run('ROLLBACK;');
                    return res.status(500).json({ error: "บันทึกสินค้าลงบิลไม่สำเร็จ", details: err.message });
                }

                // Step 3: Commit
                db.run('COMMIT;', (commitErr) => {
                    if (commitErr) {
                        return res.status(500).json({ error: "ยืนยันข้อมูลลง Database ไม่สำเร็จ" });
                    }
                    
                    res.status(201).json({ 
                        message: "✅ บันทึกคำสั่งซื้อเรียบร้อยแล้ว!", 
                        order_id: newOrderId 
                    });
                });
            });
        });
    });
};