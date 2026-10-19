const API = 'http://localhost:8088/api';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let allProducts = [];

// ─── AUTH / NAVBAR ────────────────────────────────────────────
function updateNavbar() {
    const token = localStorage.getItem('token');
    const nom   = localStorage.getItem('nom');
    const role  = localStorage.getItem('role');
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (token) {
        navAuth.innerHTML = `
            <span style="color:#c88a8f;font-weight:bold;margin-right:12px;">👤 ${nom}</span>
            ${role === 'ADMIN' ? `<a href="/admin.html" style="margin-right:8px;color:#c88a8f;text-decoration:none;font-weight:bold;"><i class="fas fa-user-shield"></i> Admin</a>` : ''}
            <button onclick="logout()" style="background:#e8b4b8;color:white;border:none;padding:8px 18px;border-radius:40px;font-weight:bold;cursor:pointer;">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>`;
    } else {
        navAuth.innerHTML = `
            <a href="/login.html" style="padding:8px 16px;border-radius:40px;border:1px solid #e8b4b8;color:#c88a8f;text-decoration:none;font-weight:bold;margin-right:6px;">
                <i class="fas fa-sign-in-alt"></i> Login
            </a>
            <a href="/register.html" style="padding:8px 16px;border-radius:40px;background:#e8b4b8;color:white;text-decoration:none;font-weight:bold;">
                <i class="fas fa-user-plus"></i> Register
            </a>`;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('email');
    window.location.href = '/index.html';
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadCategories();
    loadProducts();
    renderCart();
    document.getElementById('searchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') searchProducts();
    });
});

// ─── CATEGORIES ───────────────────────────────────────────────
async function loadCategories() {
    try {
        const res = await fetch(`${API}/categories`);
        const cats = await res.json();
        const filters = document.getElementById('categoryFilters');
        const icons = ['fa-star', 'fa-palette', 'fa-spa', 'fa-leaf', 'fa-gem', 'fa-heart', 'fa-sun', 'fa-magic'];
        cats.forEach((cat, i) => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.innerHTML = `<i class="fas ${icons[i % icons.length]}"></i> ${cat.name}`;
            btn.onclick = () => filterByCategory(cat.id, btn);
            filters.appendChild(btn);
        });
    } catch(e) { showToast('Could not load categories', 'error'); }
}

// ─── PRODUCTS ─────────────────────────────────────────────────
async function loadProducts(categoryId = null) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i><p>Loading...</p></div>`;
    try {
        const url = categoryId ? `${API}/products/category/${categoryId}` : `${API}/products`;
        const res = await fetch(url);
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch(e) {
        grid.innerHTML = `<div class="loading-spinner"><i class="fas fa-exclamation-triangle"></i><p>Failed to connect to server</p></div>`;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    document.getElementById('productCount').textContent = `${products.length} product(s)`;
    if (!products.length) {
        grid.innerHTML = `<div class="loading-spinner"><i class="fas fa-box-open"></i><p>No products found.</p></div>`;
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="openProductModal(${p.id})">
            <img class="product-image" src="${p.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Missing'">
            <div class="product-info">
                <div class="product-category">${p.category ? p.category.name : 'General'}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.description || ''}</div>
                <div class="product-footer">
                    <span class="product-price">${fmt(p.price)}</span>
                    <span class="stock-badge ${stockClass(p.stock)}">${stockLabel(p.stock)}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(event,${p.id})" ${p.stock===0?'disabled':''}><i class="fas fa-cart-plus"></i> Add to cart</button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(categoryId, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProducts(categoryId);
}

async function searchProducts() {
    const kw = document.getElementById('searchInput').value.trim();
    if (!kw) { loadProducts(); return; }
    document.getElementById('productsGrid').innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i></div>`;
    try {
        const res = await fetch(`${API}/products/search?keyword=${encodeURIComponent(kw)}`);
        renderProducts(await res.json());
    } catch(e) { showToast('Search error', 'error'); }
}

// ─── MODAL PRODUIT ────────────────────────────────────────────
async function openProductModal(id) {
    try {
        const p = await (await fetch(`${API}/products/${id}`)).json();
        document.getElementById('modalBody').innerHTML = `
            <img class="modal-product-img" src="${p.imageUrl||'https://via.placeholder.com/600x400?text=No+Image'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Missing'">
            <div class="product-category">${p.category?p.category.name:'General'}</div>
            <div class="modal-product-name">${p.name}</div>
            <div class="modal-product-price">${fmt(p.price)}</div>
            <div class="modal-product-desc">${p.description||'No description available.'}</div>
            <div style="margin-bottom:16px"><span class="stock-badge ${stockClass(p.stock)}">${stockLabel(p.stock)} — ${p.stock} in stock</span></div>
            <button class="modal-add-btn" onclick="addToCart(event,${p.id});closeModal();" ${p.stock===0?'disabled':''}><i class="fas fa-cart-plus"></i> Add to cart</button>`;
        document.getElementById('productModal').classList.add('open');
    } catch(e) { showToast('Error loading product', 'error'); }
}
function closeModal() { document.getElementById('productModal').classList.remove('open'); }

// ─── CART ─────────────────────────────────────────────────────
function addToCart(e, productId) {
    e.stopPropagation();
    const p = allProducts.find(x => x.id === productId);
    if (!p || p.stock === 0) return;
    const ex = cart.find(i => i.id === productId);
    if (ex) {
        if (ex.qty >= p.stock) { showToast('Insufficient stock!', 'error'); return; }
        ex.qty++;
    } else {
        cart.push({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, qty: 1 });
    }
    saveCart(); renderCart();
    showToast(`"${p.name}" added to cart!`, 'success');
}
function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(); renderCart(); }
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { saveCart(); renderCart(); }
}
function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function renderCart() {
    const totalQty = cart.reduce((s,i) => s+i.qty, 0);
    const total    = cart.reduce((s,i) => s + i.price*i.qty, 0);
    document.getElementById('cartBadge').textContent = totalQty;
    const el     = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    if (!cart.length) {
        el.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-basket"></i><p>Your cart is empty</p></div>`;
        footer.style.display = 'none'; return;
    }
    footer.style.display = 'block';
    el.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imageUrl||'https://via.placeholder.com/100x100?text=No+Image'}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Image+Missing'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${fmt(item.price * item.qty)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id},-1)"><i class="fas fa-minus"></i></button>
                    <span class="qty-display">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id},1)"><i class="fas fa-plus"></i></button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>`).join('');
    document.getElementById('cartTotal').textContent = fmt(total);
}
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

// ─── CHECKOUT ─────────────────────────────────────────────────
function goToCheckout() {
    if (!cart.length) { showToast('Your cart is empty!', 'error'); return; }
    toggleCart();
    const total = cart.reduce((s,i) => s + i.price*i.qty, 0);
    document.getElementById('orderSummaryCheckout').innerHTML = `
        <h4>Order Summary</h4>
        ${cart.map(i => `<div class="order-summary-item"><span>${i.name} × ${i.qty}</span><span>${fmt(i.price*i.qty)}</span></div>`).join('')}
        <div class="order-total-row"><span>Total</span><span>${fmt(total)}</span></div>`;

    const nom   = localStorage.getItem('nom');
    const email = localStorage.getItem('email');
    if (nom)   document.getElementById('custName').value  = nom;
    if (email) document.getElementById('custEmail').value = email;

    document.getElementById('checkoutModal').classList.add('open');
}
function closeCheckoutModal() { document.getElementById('checkoutModal').classList.remove('open'); }

async function placeOrder() {
    const name    = document.getElementById('custName').value.trim();
    const email   = document.getElementById('custEmail').value.trim();
    const phone   = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    if (!name || !email || !phone || !address) { showToast('Please fill all fields!', 'error'); return; }
    if (!email.includes('@')) { showToast('Invalid email address!', 'error'); return; }
    const btn = document.querySelector('.btn-confirm');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    try {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const res = await fetch(`${API}/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                customerName: name, customerEmail: email,
                customerPhone: phone, shippingAddress: address,
                cartItems: cart.map(i => ({ productId: i.id, quantity: i.qty }))
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server error');
        cart = []; saveCart(); renderCart(); closeCheckoutModal();
        showToast(`✅ Order #${data.id} confirmed! Thank you ${name.split(' ')[0]}!`, 'success');
        document.querySelectorAll('#custName,#custEmail,#custPhone,#custAddress').forEach(inp => inp.value = '');
    } catch(e) { showToast('Error: ' + e.message, 'error'); }
    finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order'; }
}

// ─── UTILS ────────────────────────────────────────────────────
function fmt(p) { return Number(p).toFixed(2) + ' TND'; }
function stockClass(s) { return s === 0 ? 'out-stock' : s <= 5 ? 'low-stock' : 'in-stock'; }
function stockLabel(s) { return s === 0 ? 'Out of stock' : s <= 5 ? 'Low stock' : 'In stock'; }
function showToast(msg, type='') {
    const t = document.getElementById('toast');
    t.innerHTML = (type==='success'?'<i class="fas fa-check-circle"></i>':type==='error'?'<i class="fas fa-exclamation-circle"></i>':'') + ' ' + msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.className = 'toast', 4000);
}
document.getElementById('productModal')?.addEventListener('click', e => { if(e.target.id==='productModal') closeModal(); });
document.getElementById('checkoutModal')?.addEventListener('click', e => { if(e.target.id==='checkoutModal') closeCheckoutModal(); });