class Product {
    constructor(id, name, price, image, category, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.description = description || '';
    }
}

const products = [
    new Product(1, "Wireless Mouse", 229, "mouse.png", "Electronics", "Ergonomic wireless mouse with smooth tracking"),
    new Product(2, "Smart Watch", 779, "watch.png", "Electronics", "Stylish stainless steel smart watch"),
    new Product(3, "Cotton T-Shirt", 250, "tshirt.png", "Clothing", "100% premium cotton t-shirt"),
    new Product(4, "Denim Pants", 300, "jeans.png", "Clothing", "Classic denim jeans perfect fit"),
    new Product(5, "Sports Shoes", 850, "shoes.png", "Footwear", "Lightweight running shoes"),
    new Product(6, "Fast Charger", 299, "charger.png", "Electronics", "USB-C fast charging brick"),
    new Product(7, "Cotton Socks", 99, "socks.png", "Clothing", "Soft breathable cotton socks 3 pairs"),
    new Product(8, "Powerbank", 599, "powerbank.png", "Electronics", "10000mAh portable charger"),
    new Product(9, "Denim Jacket", 899, "jacket.png", "Clothing", "Classic blue denim jacket"),
    new Product(10, "Baseball Cap", 199, "cap.png", "Accessories", "Adjustable cotton cap")
];

let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('wanderCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('wanderCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        saveCart();
        updateCartCount();
        showMessage(`${product.name} added to cart!`, 'success');

        const productCard = document.querySelector(`.product-card[data-id='${productId}']`);
        if (productCard) {
            productCard.classList.add('fade-in');
            setTimeout(() => productCard.classList.remove('fade-in'), 500);
        }
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
    updateCartCount();
    showMessage('Item removed from cart', 'info');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 2000);
}

function renderProducts() {
    const productGrid = document.getElementById('products-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p class="price">${product.price}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            <a href="detail-${product.name.toLowerCase().replace(/\s/g, '-')}.html" class="btn-small">View Details</a>
        `;
        
        productGrid.appendChild(card);
    });
    
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = `(${products.length} items)`;
    }
}

function renderCartPage() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart-message" style="display:block;"><p>🛒 Your cart is currently empty</p><a href="products.html" class="btn">Continue Shopping</a></div>';
        updateOrderSummary();
        return;
    }
    
    cartContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const product = products.find(p => p.id === item.id);
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${product ? product.image : 'placeholder.png'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80'">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
            </div>
            <div class="cart-quantity">
                <label>Quantity:</label>
                <input type="number" value="${item.quantity}" min="1" max="99" data-index="${index}" class="cart-qty-input">
            </div>
            <button class="remove-btn remove-from-cart" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    document.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            let newQty = parseInt(e.target.value);
            if (isNaN(newQty) || newQty < 1) newQty = 1;
            if (newQty > 99) newQty = 99;
            cart[index].quantity = newQty;
            saveCart();
            renderCartPage();
        });
    });
    
    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;
    
    const subtotalSpan = document.getElementById('cart-subtotal');
    const totalSpan = document.getElementById('cart-total');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutItemCount = document.getElementById('checkout-item-count');
    
    if (subtotalSpan) subtotalSpan.textContent = subtotal;
    if (totalSpan) totalSpan.textContent = total;
    if (checkoutSubtotal) checkoutSubtotal.textContent = subtotal;
    if (checkoutTotal) checkoutTotal.textContent = total;
    if (checkoutItemCount) checkoutItemCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function setupCheckoutValidation() {
    const checkoutForm = document.querySelector('.checkout-form form');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const inputs = checkoutForm.querySelectorAll('fieldset:first-child input[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                let errorDiv = input.parentElement.querySelector('.error-message');
                if (!errorDiv) {
                    errorDiv = document.createElement('span');
                    errorDiv.className = 'error-message';
                    input.parentElement.appendChild(errorDiv);
                }
                errorDiv.textContent = 'This field is required';
                isValid = false;
            } else {
                input.classList.remove('error');
                const errorDiv = input.parentElement.querySelector('.error-message');
                if (errorDiv) errorDiv.remove();
            }
        });
        
        const paymentSelected = checkoutForm.querySelector('input[name="payment"]:checked');
        if (!paymentSelected) {
            const paymentFieldset = checkoutForm.querySelector('fieldset:last-child');
            let errorDiv = paymentFieldset.querySelector('.error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                paymentFieldset.appendChild(errorDiv);
            }
            errorDiv.textContent = 'Please select a payment method';
            isValid = false;
        }
        
        if (isValid) {
            alert('Order placed successfully! Thank you for your purchase.');
            cart = [];
            saveCart();
            window.location.href = 'landing.html';
        }
    });
}
const currentUser = {
    name: "Surio",
    orderHistory: [
        { id: 1, date: "December 15, 2024", total: 250, items: ["T-Shirt"], status: "Delivered" },
        { id: 2, date: "December 20, 2024", total: 779, items: ["Smart Watch"], status: "Shipped" }
    ]
};

function setupAccountPage() {
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back, ${currentUser.name}!`;
    }
    
    const orderItems = document.querySelectorAll('.order-list li details');
    orderItems.forEach((details, index) => {
        if (currentUser.orderHistory[index]) {
            const order = currentUser.orderHistory[index];
            details.addEventListener('toggle', () => {
                if (details.open) {
                    let detailsDiv = details.querySelector('.order-details-injected');
                    if (!detailsDiv) {
                        detailsDiv = document.createElement('div');
                        detailsDiv.className = 'order-details-injected';
                        detailsDiv.style.marginTop = '10px';
                        detailsDiv.style.padding = '10px';
                        detailsDiv.style.backgroundColor = '#f9f9f9';
                        detailsDiv.style.borderRadius = '8px';
                        detailsDiv.innerHTML = `
                            <p><strong>Order #ORD-00${order.id}</strong></p>
                            <p>📅 Date: ${order.date}</p>
                            <p>📦 Items: ${order.items.join(', ')}</p>
                            <p>💰 Total: ₱${order.total}</p>
                            <p>🚚 Status: ${order.status}</p>
                        `;
                        details.appendChild(detailsDiv);
                    }
                }
            });
        }
    });
}

function setupEventDelegation() {
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
        if (e.target.classList.contains('remove-from-cart')) {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    renderCartPage();
    setupEventDelegation();
    setupCheckoutValidation();
    setupAccountPage();
    updateCartCount();
});