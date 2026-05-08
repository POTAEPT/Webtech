document.addEventListener('DOMContentLoaded', () => {
    const cartBody = document.getElementById('cartItemsBody');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');

    const cart = JSON.parse(localStorage.getItem('amadoCart')) || {};
    const cartIds = Object.keys(cart);

    const renderEmpty = (message) => {
        if (cartBody) {
            cartBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">${message}</td>
                </tr>
            `;
        }
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        localStorage.setItem('cartItems', JSON.stringify([]));
        localStorage.setItem('cartTotal', '0');
    };

    if (cartIds.length === 0) {
        renderEmpty('Your cart is empty.');
        return;
    }

    const renderCart = (products) => {
        let subtotal = 0;
        const cartItems = [];
        const rows = cartIds.map((id) => {
            const product = products.find((item) => String(item.id) === String(id));
            if (!product) {
                return '';
            }

            const quantity = Number(cart[id]) || 1;
            const lineTotal = product.price * quantity;
            subtotal += lineTotal;

            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.mainImage
            });

            return `
                <tr>
                    <td class="cart_product_img">
                        <a href="product-details.html?id=${product.id}">
                            <img src="${product.mainImage}" alt="${product.name}">
                        </a>
                    </td>
                    <td class="cart_product_desc">
                        <h5>${product.name}</h5>
                    </td>
                    <td class="price">
                        <span>$${product.price}</span>
                    </td>
                    <td class="qty">
                        <div class="qty-btn d-flex">
                            <p>Qty</p>
                            <div class="quantity">
                                <input type="number" class="qty-text" value="${quantity}" readonly>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (cartBody) {
            cartBody.innerHTML = rows || `
                <tr>
                    <td colspan="4" class="text-center">Your cart is empty.</td>
                </tr>
            `;
        }

        const total = subtotal;
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartTotal', String(total));
    };

    const requestProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const products = await response.json();
            renderCart(products);
        } catch (error) {
            console.error('Failed to load products for cart:', error);
            renderEmpty('Sorry, we could not load your cart right now.');
        }
    };

    requestProducts();
});
