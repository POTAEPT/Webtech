// backend/controllers/orderController.js
const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
    // ❌ ตัด user_id ออกจาก req.body เพราะไม่ไว้ใจหน้าบ้าน
    const { product_id, quantity } = req.body;
    
    // ✅ ดึง user_id มาจาก Token ที่ผ่านการตรวจสอบแล้วแทน ปลอดภัย 100%
    const user_id = req.user.id; 

    if (!product_id || !quantity) {
        return res.status(400).json({ error: "ส่งข้อมูลมาไม่ครบถ้วน กรุณาตรวจสอบ" });
    }

    try {
        const newOrderId = await orderService.processOrder(user_id, product_id, quantity);

        res.status(201).json({ 
            message: "✅ บันทึกคำสั่งซื้อเรียบร้อยแล้ว!", 
            order_id: newOrderId 
        });
    } catch (error) {
        console.error("❌ Controller Error:", error);
        res.status(500).json({ error: "บันทึกคำสั่งซื้อไม่สำเร็จ", details: error.message });
    }
};