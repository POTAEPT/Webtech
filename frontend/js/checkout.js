document.addEventListener('DOMContentLoaded', () => {
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    const computeTotal = (items) => items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const loadCartItems = async () => {
        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (storedItems.length > 0) {
            return storedItems;
        }

        const rawCart = JSON.parse(localStorage.getItem('amadoCart')) || {};
        const cartIds = Object.keys(rawCart);
        if (cartIds.length === 0) {
            return [];
        }

        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        const items = cartIds.map((id) => {
            const product = products.find((item) => String(item.id) === String(id));
            if (!product) return null;
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: Number(rawCart[id]) || 1,
                image: product.mainImage
            };
        }).filter(Boolean);

        localStorage.setItem('cartItems', JSON.stringify(items));
        localStorage.setItem('cartTotal', String(computeTotal(items)));
        return items;
    };

    let cartItems = [];

    const initCheckout = async () => {
        try {
            cartItems = await loadCartItems();
            const storedTotal = Number(localStorage.getItem('cartTotal')) || 0;
            const total = cartItems.length > 0 ? computeTotal(cartItems) : storedTotal;

            if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

            if (placeOrderBtn) {
                placeOrderBtn.disabled = cartItems.length === 0;
            }
        } catch (error) {
            console.error('Failed to load checkout cart:', error);
            if (placeOrderBtn) placeOrderBtn.disabled = true;
        }
    };

    if (!placeOrderBtn) {
        initCheckout();
        return;
    }

    initCheckout();

    const parseUserIdFromToken = (token) => {
        try {
            const payload = token.split('.')[1];
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = atob(normalized);
            const data = JSON.parse(decoded);
            return data.id;
        } catch (error) {
            return null;
        }
    };

    placeOrderBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('amado_token');
        if (!token) {
            alert('Please login before placing an order.');
            return;
        }

        const userId = parseUserIdFromToken(token);
        if (!userId) {
            alert('Could not identify the current user. Please login again.');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            for (const item of cartItems) {
                const payload = {
                    user_id: userId,
                    product_id: item.id,
                    quantity: item.quantity,
                    total_price: item.price * item.quantity
                };

                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to place order.');
                }
            }

            localStorage.removeItem('amadoCart');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartTotal');

            window.location.href = 'index.html';
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place your order. Please try again.');
        }
    });
});
