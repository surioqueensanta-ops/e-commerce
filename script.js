// Laboratory 6: DOM Scripting

// Task 1: Data Structure - Product Class
class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

const products = [
    new Product(1, "Wireless Headphones", 890, "headphone.png"),
    new Product(2, "Smart Watch", 599, "watch.png"),
    new Product(3, "Casual T-Shirt", 399, "tshirt.png"),
    new Product(4, "Running Shoes", 1500, "shoes.png"),
    new Product(5, "Backpack", 899, "backpack.png"),
    new Product(6, "Wireless Mouse", 250, "mouse.png"),
    new Product(7, "Denim Jeans", 399, "jeans.png"),
    new Product(8, "Coffee Mug", 110, "mug.png"),
    new Product(9, "Sunglasses", 150, "sunglasses.jpg"),
    new Product(10, "Phone Case", 370, "case.png")
];

// Task 3: Cart State
let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Cart loaded:', cart.length, 'items');
    }
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    console.log('Cart saved:', cart.length, 'items');
}

// ============================================
// ORDER HISTORY FUNCTIONS (ADD THESE)
// ============================================

// Load orders from localStorage
function loadOrders() {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
        currentUser.orderHistory = JSON.parse(savedOrders);
        console.log('Orders loaded:', currentUser.orderHistory.length);
    } else {
        // Add sample orders if none exist
        currentUser.orderHistory = [
            { 
                id: 1, 
                orderNumber: "ORD-001", 
                date: "Feb 11, 2026", 
                total: 890, 
                items: ["Wireless Headphones"],
                status: "Delivered"
            },
            { 
                id: 2, 
                orderNumber: "ORD-002", 
                date: "Feb 12, 2026", 
                total: 399, 
                items: ["Casual T-Shirt"],
                status: "Delivered"
            }
        ];
        saveOrders();
    }
}

// Save orders to localStorage
function saveOrders() {
    localStorage.setItem('orderHistory', JSON.stringify(currentUser.orderHistory));
    console.log('Orders saved:', currentUser.orderHistory.length);
}

// Add new order
function addOrder(orderData) {
    const newOrder = {
        id: Date.now(),
        orderNumber: `ORD-${String(currentUser.orderHistory.length + 1).padStart(3, '0')}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: orderData.total,
        items: orderData.items,
        status: "Processing"
    };
    currentUser.orderHistory.unshift(newOrder);
    saveOrders();
    if (document.getElementById('order-history-container')) {
        renderOrderHistory();
    }
    console.log('New order added:', newOrder);
}

// Render Order History
function renderOrderHistory() {
    const container = document.getElementById('order-history-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (currentUser.orderHistory.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No orders yet. Start shopping!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '40px';
        emptyMessage.style.color = '#666';
        container.appendChild(emptyMessage);
        return;
    }
    
    currentUser.orderHistory.forEach((order) => {
        const details = document.createElement('details');
        details.className = 'order-details';
        details.setAttribute('data-order-id', order.id);
        
        const summary = document.createElement('summary');
        summary.innerHTML = `
            <strong>${order.orderNumber}</strong> - ${order.date}
            <span style="float: right;">₱${order.total.toLocaleString()}</span>
            <br>
            <small style="color: ${order.status === 'Delivered' ? '#22c55e' : '#f59e0b'}">
                Status: ${order.status}
            </small>
        `;
        
        const content = document.createElement('div');
        content.className = 'order-content';
        
        const itemsList = document.createElement('div');
        itemsList.innerHTML = `
            <h4>Items Purchased:</h4>
            <ul style="margin-left: 20px; margin-top: 10px; margin-bottom: 15px;">
                ${order.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p><strong>Total Amount:</strong> ₱${order.total.toLocaleString()}</p>
            <p><strong>Order Date:</strong> ${order.date}</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        `;
        
        content.appendChild(itemsList);
        details.appendChild(summary);
        details.appendChild(content);
        container.appendChild(details);
    });
}

// Task 5: Mock User Data
const currentUser = {
    name: "Queensanta",
    email: "queensanta@example.com",
    orderHistory: []
};

// Task 5: Dynamic Greeting
function updateGreeting() {
    const welcomeHeader = document.getElementById('welcome-header');
    if (welcomeHeader) {
        welcomeHeader.textContent = `Welcome, ${currentUser.name}!`;
    }
}

// Initialize account page
function initAccountPage() {
    if (document.getElementById('welcome-header')) {
        loadOrders();
        updateGreeting();
        renderOrderHistory();
        console.log('Account page initialized with', currentUser.orderHistory.length, 'orders');
    }
}

// Task 2: Dynamic Product Rendering
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    
    if (productGrid) {
        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const article = document.createElement('article');
            article.className = 'product-card';
            
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            
            const h3 = document.createElement('h3');
            h3.textContent = product.name;
            
            const p = document.createElement('p');
            p.className = 'price';
            p.textContent = product.price;
            
            const button = document.createElement('button');
            button.textContent = 'Add to Cart';
            button.className = 'add-to-cart';
            button.setAttribute('data-id', product.id);
            
            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(p);
            article.appendChild(button);
            
            productGrid.appendChild(article);
        });
    }
}

// Task 3: Event Delegation - Products Page
document.body.addEventListener('click', function(event) {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
        const productId = parseInt(addButton.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            cart.push(product);
            saveCart();
            
            console.log('Added to cart:', product.name);
            console.log('Cart now has:', cart.length, 'items');
            
            // Task 6: Animation
            const productCard = addButton.closest('.product-card');
            if (productCard) {
                productCard.classList.add('fade-in');
                setTimeout(() => {
                    productCard.classList.remove('fade-in');
                }, 500);
            }

            alert(`${product.name} added to cart! (${cart.length} items in cart)`);
        }
        renderCart();
    }
});

// Handle detail page Add to Cart buttons
document.body.addEventListener('click', function(event) {
    const detailButton = event.target.closest('.add-to-cart-detail');
    if (detailButton) {
        const productId = parseInt(detailButton.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            const quantityInput = document.getElementById(`quantity-${productId}`);
            let quantity = 1;
            if (quantityInput) {
                quantity = parseInt(quantityInput.value);
            }
            
            for (let i = 0; i < quantity; i++) {
                cart.push(product);
            }
            saveCart();
            
            console.log('Added to cart:', product.name, 'x', quantity);
            console.log('Cart now has:', cart.length, 'items');
            
            const productDetail = detailButton.closest('.product-detail');
            if (productDetail) {
                productDetail.classList.add('fade-in');
                setTimeout(() => {
                    productDetail.classList.remove('fade-in');
                }, 500);
            }
            
            alert(`${product.name} x${quantity} added to cart! (${cart.length} items in cart)`);
        }
        renderCart();
    }
});

// Task 3: Render Cart Function
function renderCart() {
    const cartList = document.querySelector('.cart-list');
    const cartTotalSpan = document.querySelector('.cart-total');
    
    console.log('Rendering cart. Cart items:', cart.length);
    
    if (cartList) {
        cartList.innerHTML = '';
        
        if (cart.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Your cart is empty';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#666';
            cartList.appendChild(emptyMessage);
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.setAttribute('data-index', index);
                
                const productText = document.createTextNode(`${item.name} - ${item.price} `);
                li.appendChild(productText);
                
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = 1;
                quantityInput.min = 0;
                quantityInput.className = 'cart-quantity';
                quantityInput.setAttribute('data-index', index);
                
                li.appendChild(quantityInput);
                cartList.appendChild(li);
            });
        }
    } else {
        console.log('Cart list not found on this page');
    }
    
    if (cartTotalSpan) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalSpan.textContent = total;
        console.log('Cart total:', total);
    }
}

// Task 3: Quantity Adjustment
function setupQuantityListeners() {
    const cartList = document.querySelector('.cart-list');
    
    if (cartList) {
        cartList.addEventListener('change', function(event) {
            if (event.target.classList.contains('cart-quantity')) {
                const index = parseInt(event.target.getAttribute('data-index'));
                const newQuantity = parseInt(event.target.value);
                
                if (newQuantity === 0) {
                    cart = cart.filter((_, i) => i !== index);
                    saveCart();
                }
                
                renderCart();
                setupQuantityListeners();
            }
        });
    }
}

// Task 4: Form Validation (UPDATED to save orders)
function setupFormValidation() {
    const form = document.getElementById('checkout-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let isValid = true;
            
            const nameInput = document.querySelector('#name');
            const streetInput = document.querySelector('#street');
            const zipcodeInput = document.querySelector('#zipcode');
            const barangayInput = document.querySelector('#barangay');
            const provinceInput = document.querySelector('#province');
            const paymentSelected = document.querySelector('input[name="payment"]:checked');
            
            document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
            document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
            
            if (!nameInput || !nameInput.value.trim()) {
                const errorMsg = document.querySelector('#name-error');
                if (errorMsg) errorMsg.textContent = 'Name is required';
                if (nameInput) nameInput.classList.add('error');
                isValid = false;
            }
            
            if (!streetInput || !streetInput.value.trim()) {
                const errorMsg = document.querySelector('#street-error');
                if (errorMsg) errorMsg.textContent = 'Street is required';
                if (streetInput) streetInput.classList.add('error');
                isValid = false;
            }
            
            if (!zipcodeInput || !zipcodeInput.value.trim()) {
                const errorMsg = document.querySelector('#zipcode-error');
                if (errorMsg) errorMsg.textContent = 'Zip code is required';
                if (zipcodeInput) zipcodeInput.classList.add('error');
                isValid = false;
            }
            
            if (!barangayInput || !barangayInput.value.trim()) {
                const errorMsg = document.querySelector('#barangay-error');
                if (errorMsg) errorMsg.textContent = 'Barangay is required';
                if (barangayInput) barangayInput.classList.add('error');
                isValid = false;
            }
            
            if (!provinceInput || !provinceInput.value.trim()) {
                const errorMsg = document.querySelector('#province-error');
                if (errorMsg) errorMsg.textContent = 'Province is required';
                if (provinceInput) provinceInput.classList.add('error');
                isValid = false;
            }
            
            if (!paymentSelected) {
                const errorMsg = document.querySelector('#payment-error');
                if (errorMsg) errorMsg.textContent = 'Please select a payment method';
                isValid = false;
            }
            
            if (!isValid) {
                console.log('Form has errors - please fix them');
            } else {
                // Calculate total from cart
                const total = cart.reduce((sum, item) => sum + item.price, 0);
                
                // Create order data
                const orderData = {
                    total: total,
                    items: cart.map(item => item.name)
                };
                
                // Add order to history
                addOrder(orderData);
                
                // Clear cart
                cart = [];
                saveCart();
                
                console.log('Form submitted successfully! Order placed.');
                alert('Order placed successfully!');
                
                // Redirect to account page to see order
                window.location.href = 'account.html';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded:', window.location.pathname);
    
    loadCart();
    
    // Task 2
    if (document.querySelector('.product-grid')) {
        renderProducts();
        console.log('Products page - rendered products');
    }
    // Task 3
    if (document.querySelector('.cart-list')) {
        renderCart();
        setupQuantityListeners();
        console.log('Cart page - rendered cart with', cart.length, 'items');
    }
    // Task 4
    if (document.getElementById('checkout-form')) {
        setupFormValidation();
        const orderTotalSpan = document.getElementById('order-total');
        if (orderTotalSpan) {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            orderTotalSpan.textContent = total;
        }
        console.log('Checkout page - order total:', cart.reduce((sum, item) => sum + item.price, 0));
    }
    
    if (document.getElementById('welcome-header')) {
        initAccountPage();
    }
});