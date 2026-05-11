const orderRepo = require('../repositories/orderRepository');

class OrderService {
    async processOrder(userId, productId, quantity) {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            const products = await response.json();
            const product = products.find(p => String(p.id) === String(productId) || p.name === productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const unitPrice = product.price;
            const totalPrice = unitPrice * quantity;

            // สั่งให้ Repository ทำงานกับ Database
            const newOrderId = await orderRepo.createOrderTransaction(
                userId,
                productId,
                quantity,
                unitPrice,
                totalPrice
            );

            try {
                await fetch(`http://127.0.0.1:3000/api/products/${productId}/reduce-stock`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity })
                });
            } catch (stockError) {
                console.warn('⚠️ Stock reduction failed:', stockError);
            }

            return newOrderId;
        } catch (error) {
            console.error('❌ OrderService Error:', error);
            throw error;
        }
    }
}

module.exports = new OrderService();