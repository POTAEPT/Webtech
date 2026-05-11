const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// เชื่อมต่อ Database
const dbPath = path.resolve(__dirname, '../data/store.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ orderRepository: เชื่อมต่อ DB ล้มเหลว:", err.message);
});

class OrderRepository {
    // ย้าย SQL Query และ Transaction มาไว้ที่นี่
    createOrderTransaction(userId, productId, quantity, unitPrice, totalPrice) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION;');

                // Step 1: สร้างบิล ORDERS
                const insertOrderSql = `INSERT INTO ORDERS (user_id, total_amount) VALUES (?, ?)`;
                db.run(insertOrderSql, [userId, totalPrice], function(err) {
                    if (err) {
                        db.run('ROLLBACK;');
                        return reject(err);
                    }

                    const newOrderId = this.lastID;

                    // Step 2: ใส่สินค้าลง ORDER_ITEMS
                    const insertItemSql = `INSERT INTO ORDER_ITEMS (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`;
                    db.run(insertItemSql, [newOrderId, productId, quantity, unitPrice], function(err) {
                        if (err) {
                            db.run('ROLLBACK;');
                            return reject(err);
                        }

                        // Step 3: Commit
                        db.run('COMMIT;', (commitErr) => {
                            if (commitErr) {
                                return reject(commitErr);
                            }
                            // คืนค่า orderId กลับไปเมื่อสำเร็จ
                            resolve(newOrderId);
                        });
                    });
                });
            });
        });
    }
}

module.exports = new OrderRepository();