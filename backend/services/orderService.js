const orderRepo = require('../repositories/orderRepository');

class OrderService {
    async processOrder(userId, productId, quantity, totalPrice) {
        // Business Logic: การคำนวณราคาต่อชิ้น ถูกแยกมาไว้ตรงนี้
        const unitPrice = totalPrice / quantity;

        // สั่งให้ Repository ทำงานกับ Database
        const newOrderId = await orderRepo.createOrderTransaction(
            userId, 
            productId, 
            quantity, 
            unitPrice, 
            totalPrice
        );
        
        return newOrderId;
    }
}

module.exports = new OrderService();