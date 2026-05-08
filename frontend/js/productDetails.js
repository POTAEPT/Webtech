document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productIdParam = params.get('id');

    const breadcrumbEl = document.getElementById('productBreadcrumb');
    const priceEl = document.getElementById('productPrice');
    const nameEl = document.getElementById('productName');
    const nameLinkEl = document.getElementById('productNameLink');
    const descriptionEl = document.getElementById('productDescription');
    const imageEl = document.getElementById('productImage');
    const imageLinkEl = document.getElementById('productImageLink');
    const imageIndicatorEl = document.getElementById('productImageIndicator');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const qtyInput = document.getElementById('qty');

    const setErrorState = (message) => {
        if (nameEl) nameEl.textContent = 'Product not found';
        if (priceEl) priceEl.textContent = '$0';
        if (descriptionEl) descriptionEl.textContent = message;
        if (breadcrumbEl) breadcrumbEl.textContent = 'Product';
        if (addToCartBtn) addToCartBtn.disabled = true;
    };

    if (!productIdParam) {
        setErrorState('Missing product id in the URL.');
        return;
    }

    const productId = Number(productIdParam);
    if (Number.isNaN(productId)) {
        setErrorState('Invalid product id.');
        return;
    }

    const updateImage = (url) => {
        if (imageEl) imageEl.src = url;
        if (imageLinkEl) imageLinkEl.href = url;
        if (imageIndicatorEl) imageIndicatorEl.style.backgroundImage = `url(${url})`;
    };

    const renderProduct = (product) => {
        if (nameEl) nameEl.textContent = product.name || 'Product';
        if (nameLinkEl) nameLinkEl.href = `product-details.html?id=${product.id}`;
        if (breadcrumbEl) breadcrumbEl.textContent = product.name || 'Product';
        if (priceEl) priceEl.textContent = `$${product.price}`;
        if (descriptionEl) {
            descriptionEl.textContent = product.description || 'No description available.';
        }

        if (product.mainImage) {
            updateImage(product.mainImage);
        }
    };

    const attachAddToCart = (product) => {
        if (!addToCartBtn) return;
        addToCartBtn.addEventListener('click', () => {
            if (typeof handleAddToCart !== 'function') {
                console.error('handleAddToCart is missing. Ensure cartService.js is loaded.');
                return;
            }

            const qty = qtyInput ? Math.max(1, Number(qtyInput.value) || 1) : 1;
            for (let i = 0; i < qty; i += 1) {
                handleAddToCart(product.id);
            }
        });
    };

    const requestProduct = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const products = await response.json();
            const product = products.find((item) => String(item.id) === String(productIdParam));

            if (!product) {
                setErrorState('We could not find this product.');
                return;
            }

            renderProduct(product);
            attachAddToCart(product);
        } catch (error) {
            console.error('Failed to load product data:', error);
            setErrorState('Sorry, we could not load this product right now.');
        }
    };

    requestProduct();
});
