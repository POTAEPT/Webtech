const orderService = require('../services/orderService');

// ฟังก์ชันสร้างคำสั่งซื้อ
exports.createOrder = async (req, res) => {
    const { user_id, product_id, quantity, total_price } = req.body;

    // 1. Validation เช็คว่าข้อมูลมาครบไหม (Controller's job)
    if (!user_id || !product_id || !quantity || !total_price) {
        return res.status(400).json({ error: "ส่งข้อมูลมาไม่ครบถ้วน กรุณาตรวจสอบ" });
    }

    try {
        // 2. เรียกใช้งาน Service แทนการเขียน SQL โดยตรง
        const newOrderId = await orderService.processOrder(user_id, product_id, quantity, total_price);

        // 3. Response
        res.status(201).json({ 
            message: "✅ บันทึกคำสั่งซื้อเรียบร้อยแล้ว!", 
            order_id: newOrderId 
        });
    } catch (error) {
        console.error("❌ Controller Error:", error);
        res.status(500).json({ error: "บันทึกคำสั่งซื้อไม่สำเร็จ", details: error.message });
    }
};