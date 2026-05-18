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
    new Product(9, "Wireless Headphones", 1299, "headphones.png", "Electronics", "Noise cancelling bluetooth headphones"),
    new Product(10, "Laptop Backpack", 999, "bag.png", "Accessories", "Water resistant 15.6 inch laptop bag")
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

function loadUsers() {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
        return JSON.parse(savedUsers);
    }
    return [];
}

function saveUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

function registerUser(name, email, password) {
    const users = loadUsers();
    
    if (users.some(user => user.email === email)) {
        showSimpleMessage('Email already registered! Please login.', 'info');
        return false;
    }

    users.push({
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        dateRegistered: new Date().toISOString()
    });
    
    saveUsers(users);
    return true;
}

function validateLogin(email, password) {
    const users = loadUsers();
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        return user;
    }
    return null;
}

let currentUser = {
    name: "Guest",
    orderHistory: []
};

function loadOrderHistory() {
    const savedHistory = localStorage.getItem('wanderOrderHistory');
    if (savedHistory) {
        currentUser.orderHistory = JSON.parse(savedHistory);
    } else {
        currentUser.orderHistory = [
            { id: 1, date: "December 15, 2024", total: 300, items: ["T-Shirt x1"], status: "Delivered" },
            { id: 2, date: "December 20, 2024", total: 829, items: ["Smart Watch x1"], status: "Shipped" }
        ];
        saveOrderHistory();
    }
}

function saveOrderHistory() {
    localStorage.setItem('wanderOrderHistory', JSON.stringify(currentUser.orderHistory));
}

function saveOrderToHistory() {
    if (cart.length === 0) {
        showSimpleMessage('Your cart is empty. Add items before placing an order.', 'info');
        return false;
    }
    
    const newOrder = {
        id: currentUser.orderHistory.length + 1,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50,
        items: cart.map(item => `${item.name} x${item.quantity}`),
        status: "Processing"
    };
    
    currentUser.orderHistory.unshift(newOrder);
    saveOrderHistory();
    return true;
}

function renderOrderHistory() {
    const orderList = document.querySelector('.order-list');
    if (!orderList) return;
    
    orderList.innerHTML = '';
    
    currentUser.orderHistory.forEach(order => {
        const li = document.createElement('li');
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = `Order #ORD-00${order.id} - ₱${order.total} - ${order.date}`;
        
        const detailsDiv = document.createElement('div');
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
        
        details.appendChild(summary);
        details.appendChild(detailsDiv);
        li.appendChild(details);
        orderList.appendChild(li);
    });
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        saveCart();
        updateCartCount();
        showMessageWithViewCart(`${product.name} added to cart!`, 'success');
        
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
    showMessageWithViewCart('Item removed from cart', 'info');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function showMessageWithViewCart(message, type) {
    const messageDiv = document.createElement('div');
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
        display: flex;
        gap: 15px;
        align-items: center;
        font-size: 14px;
    `;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button onclick="window.location.href='cart.html'" style="background:white; color:${type === 'success' ? '#27ae60' : '#3498db'}; border:none; padding:5px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">
            View Cart
        </button>
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 4000);
}

function showSimpleMessage(message, type) {
    const messageDiv = document.createElement('div');
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
        font-size: 14px;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 2000);
}

let currentFilteredProducts = [...products];

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category:checked'))
        .map(cb => cb.value);
    
    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value || 'all';
    
    currentFilteredProducts = products.filter(product => {

        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        if (selectedPrice !== 'all') {
            if (selectedPrice === 'under500' && product.price >= 500) return false;
            if (selectedPrice === '500-1000' && (product.price < 500 || product.price > 1000)) return false;
            if (selectedPrice === 'over1000' && product.price <= 1000) return false;
        }
        
        return true;
    });
    
    renderFilteredProducts();
}

function renderFilteredProducts() {
    const productGrid = document.getElementById('products-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    currentFilteredProducts.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        
        let detailLink = '';
        switch(product.id) {
            case 1: detailLink = 'detail-mouse.html'; break;
            case 2: detailLink = 'detail-watch.html'; break;
            case 3: detailLink = 'detail-tshirt.html'; break;
            case 4: detailLink = 'detail-pants.html'; break;
            case 5: detailLink = 'detail-shoes.html'; break;
            case 6: detailLink = 'detail-charger.html'; break;
            case 7: detailLink = 'detail-socks.html'; break;
            case 8: detailLink = 'detail-powerbank.html'; break;
            case 9: detailLink = 'detail-headphones.html'; break;
            case 10: detailLink = 'detail-bag.html'; break;
            default: detailLink = `detail-${product.name.toLowerCase().replace(/\s/g, '')}.html`;
        }
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p class="price">${product.price}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            <a href="${detailLink}" class="btn-small">View Details</a>
        `;
        
        productGrid.appendChild(card);
    });
    
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = `(${currentFilteredProducts.length} items)`;
    }
}

function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-category');
    const filterRadios = document.querySelectorAll('input[name="price"]');
    
    filterCheckboxes.forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });
    
    filterRadios.forEach(radio => {
        radio.addEventListener('change', filterProducts);
    });
}

function renderProducts() {
    const productGrid = document.getElementById('products-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    const productsToRender = currentFilteredProducts.length > 0 && currentFilteredProducts.length !== products.length 
        ? currentFilteredProducts 
        : products;
    
    productsToRender.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        
        let detailLink = '';
        switch(product.id) {
            case 1: detailLink = 'detail-mouse.html'; break;
            case 2: detailLink = 'detail-watch.html'; break;
            case 3: detailLink = 'detail-tshirt.html'; break;
            case 4: detailLink = 'detail-pants.html'; break;
            case 5: detailLink = 'detail-shoes.html'; break;
            case 6: detailLink = 'detail-charger.html'; break;
            case 7: detailLink = 'detail-socks.html'; break;
            case 8: detailLink = 'detail-powerbank.html'; break;
            case 9: detailLink = 'detail-headphones.html'; break;
            case 10: detailLink = 'detail-bag.html'; break;
            default: detailLink = `detail-${product.name.toLowerCase().replace(/\s/g, '')}.html`;
        }
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p class="price">${product.price}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            <a href="${detailLink}" class="btn-small">View Details</a>
        `;
        
        productGrid.appendChild(card);
    });
    
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = `(${productsToRender.length} items)`;
    }
}

function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;
    
    const featuredProducts = products.slice(0, 6);
    
    featuredGrid.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        
        let detailLink = '';
        switch(product.id) {
            case 1: detailLink = 'detail-mouse.html'; break;
            case 2: detailLink = 'detail-watch.html'; break;
            case 3: detailLink = 'detail-tshirt.html'; break;
            case 4: detailLink = 'detail-pants.html'; break;
            case 5: detailLink = 'detail-shoes.html'; break;
            case 6: detailLink = 'detail-charger.html'; break;
            default: detailLink = `detail-${product.name.toLowerCase().replace(/\s/g, '')}.html`;
        }
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p class="price">${product.price}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            <a href="${detailLink}" class="btn-small">View Details</a>
        `;
        
        featuredGrid.appendChild(card);
    });
}

function setupDetailPageCart() {
    const detailButtons = document.querySelectorAll('.add-to-cart-detail');
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            if (quantity > 0 && quantity <= 99) {
                addToCart(productId, quantity);
            } else {
                showMessageWithViewCart('Please enter a valid quantity (1-99)', 'info');
            }
        });
    });
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
            if (saveOrderToHistory()) {
                showSimpleMessage('Order placed successfully! Thank you for your purchase.', 'success');
                cart = [];
                saveCart();
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1500);
            }
        }
    });
}

function setupAccountPage() {
    
    const loggedInName = localStorage.getItem('currentUser');
    if (loggedInName) {
        currentUser.name = loggedInName;
    }
    
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back, ${currentUser.name}!`;
    }

    loadOrderHistory();
    renderOrderHistory();
}

function setupLoginValidation() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email')?.value || '';
        const password = document.getElementById('login-password')?.value || '';
        
        if (!email || !password) {
            showSimpleMessage('Please enter both email and password', 'info');
            return;
        }
        
        if (!email.includes('@')) {
            showSimpleMessage('Please enter a valid email address', 'info');
            return;
        }
        
        const user = validateLogin(email, password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', user.name);
            localStorage.setItem('currentUserEmail', user.email);
            
            currentUser.name = user.name;
            
            showSimpleMessage(`Welcome back, ${user.name}! Redirecting...`, 'success');
            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 1500);
        } else {
            const users = loadUsers();
            const emailExists = users.some(user => user.email === email);
            
            if (!emailExists) {
                showSimpleMessage('Account not found. Please sign up first.', 'info');
            } else {
                showSimpleMessage('Incorrect password. Please try again.', 'info');
            }
        }
    });
}

function setupSignupValidation() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('fullname')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const password = document.getElementById('password')?.value || '';
        const confirm = document.getElementById('confirm')?.value || '';
        
        if (!name || !email || !password) {
            showSimpleMessage('Please fill in all required fields', 'info');
            return;
        }
        
        if (!email.includes('@')) {
            showSimpleMessage('Please enter a valid email address', 'info');
            return;
        }
        
        if (password !== confirm) {
            showSimpleMessage('Passwords do not match!', 'info');
            return;
        }
        
        if (password.length < 8) {
            showSimpleMessage('Password must be at least 8 characters', 'info');
            return;
        }
        
        const registered = registerUser(name, email, password);
        
        if (registered) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', name);
            localStorage.setItem('currentUserEmail', email);
            
            currentUser.name = name;
            
            showSimpleMessage('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 1500);
        }
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserEmail');
            showSimpleMessage('Logged out successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 1000);
        });
    }
}

function setupEventDelegation() {
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId, 1);
        }
        if (e.target.classList.contains('remove-from-cart')) {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        }
    });
}

function addAnimationStyles() {
    if (!document.querySelector('#dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .fade-in {
                animation: addToCartPulse 0.5s ease-in-out;
            }
            @keyframes addToCartPulse {
                0% { transform: scale(1); background-color: white; }
                50% { transform: scale(1.05); background-color: #e67e22; color: white; }
                100% { transform: scale(1); background-color: white; }
            }
            .error-message {
                color: #e74c3c;
                font-size: 12px;
                margin-top: 5px;
                display: block;
            }
            input.error {
                border: 2px solid #e74c3c !important;
                background-color: #ffe6e6 !important;
            }
        `;
        document.head.appendChild(style);
    }
}
// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/v1/products';

// Fetch all products from backend
async function fetchProducts() {
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const products = await response.json();
        console.log('Products loaded from database:', products);
        return products;
        
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadOrderHistory();       
    renderProducts();          
    renderFeaturedProducts();   
    renderCartPage();       
    setupEventDelegation();
    setupCheckoutValidation();
    setupAccountPage();
    setupDetailPageCart();   
    setupFilters();      
    setupLoginValidation();   
    setupSignupValidation();    
    setupLogout();            
    updateCartCount();
    addAnimationStyles();
});