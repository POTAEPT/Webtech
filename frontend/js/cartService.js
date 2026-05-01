// js/cartService.js

let cart = JSON.parse(localStorage.getItem('amadoCart')) || {};

function updateCartUI() {
    const cartCountSpan = document.querySelector('.cart-nav span');
    if (cartCountSpan) {
        let totalItems = 0;
        for (let productId in cart) {
            totalItems += cart[productId];
        }
        cartCountSpan.textContent = `(${totalItems})`;
    }
}

function saveCart() {
    localStorage.setItem('amadoCart', JSON.stringify(cart));
    updateCartUI();
}

function handleAddToCart(id) {
    if (cart[id]) {
        cart[id] += 1;
    } else {
        cart[id] = 1;
    }
    console.log("Cart Status:", cart);
    saveCart();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});