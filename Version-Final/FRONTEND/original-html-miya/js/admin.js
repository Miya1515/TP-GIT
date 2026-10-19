const API = 'http://localhost:8088/api';

document.addEventListener('DOMContentLoaded', () => {
    // اذا ما فماش token، رجع للlogin
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    loadDashboard();
});

// ====== LOGOUT ======
function doLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('email');
    window.location.href = 'index.html';
}

// ====== NAV ======
function showSection(section, el) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(`section-${section}`).style.display = 'block';
    if (el) el.classList.add('active');
    const actions = { dashboard: loadDashboard, products: loadAdminProducts, categories: loadAdminCategories, orders: loadAdminOrders };
    if (actions[section]) actions[section]();
    return false;
}

// ====== DASHBOARD ======
async function loadDashboard() {
    try {
        const [stats, cats] = await Promise.all([
            fetch(`${API}/orders/stats`, { headers: authHeader() }).then(r => r.json()),
            fetch(`${API}/categories`).then(r => r.json())
        ]);
        document.getElementById('statProducts').textContent = stats.totalProducts;
        document.getElementById('statOrders').textContent = stats.totalOrders;
        document.getElementById('statRevenue').textContent = Number(stats.totalRevenue).toFixed(2) + ' TND';
        document.getElementById('statCategories').textContent = cats.length;
    } catch(e) { showToast('Cannot connect to the server', 'error'); }

    try {
        const orders = await fetch(`${API}/orders`, { headers: authHeader() }).then(r => r.json());
        const el = document.getElementById('recentOrdersList');
        if (!orders.length) { el.innerHTML = '<p style="color:#64748b;padding:12px 0">No orders recorded yet.</p>'; return; }
        el.innerHTML = `<table class="admin-table">
            <thead><tr><th>#ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>${orders.slice(0,6).map(o => `<tr>
                <td><strong>#${o.id}</strong></td>
                <td>${o.customerName}</td>
                <td>${Number(o.totalAmount).toFixed(2)} TND</td>
                <td><span class="status-badge status-${o.status}">${tStatus(o.status)}</span></td>
                <td>${fDate(o.createdAt)}</td>
            </tr>`).join('')}</tbody>
        </table>`;
    } catch(e) {}
}

// ====== PRODUCTS ======
async function loadAdminProducts() {
    try {
        const products = await fetch(`${API}/products`).then(r => r.json());
        document.getElementById('productsTableBody').innerHTML = products.map(p => `<tr>
            <td><img src="${p.imageUrl||`https://picsum.photos/seed/p${p.id}/100/100`}" alt="${p.name}" onerror="this.src='https://picsum.photos/100/100'"></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.category ? p.category.name : '<em style="color:#94a3b8">None</em>'}</td>
            <td>${Number(p.price).toFixed(2)} TND</td>
            <td><span class="stock-badge ${sClass(p.stock)}">${p.stock} unit(s)</span></td>
            <td><div class="action-btns">
                <button class="btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
    } catch(e) { showToast('Error loading products', 'error'); }
}

async function openProductModal(id = null) {
    ['productId','productName','productPrice','productStock','productDescription','productImage'].forEach(x => document.getElementById(x).value = '');
    document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add Product';
    try {
        const cats = await fetch(`${API}/categories`).then(r => r.json());
        document.getElementById('productCategory').innerHTML =
            '<option value="">Choose a category</option>' +
            cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch(e) {}
    if (id) {
        try {
            const p = await fetch(`${API}/products/${id}`).then(r => r.json());
            document.getElementById('productId').value = p.id;
            document.getElementById('productName').value = p.name;
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productStock').value = p.stock;
            document.getElementById('productDescription').value = p.description || '';
            document.getElementById('productImage').value = p.imageUrl || '';
            if (p.category) document.getElementById('productCategory').value = p.category.id;
        } catch(e) {}
    }
    document.getElementById('productFormModal').classList.add('open');
}
function editProduct(id) { openProductModal(id); }

async function saveProduct() {
    const id    = document.getElementById('productId').value;
    const name  = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    const catId = document.getElementById('productCategory').value;
    if (!name || !price || stock === '') { showToast('Please fill in required fields (*)','error'); return; }
    const payload = {
        name, price: parseFloat(price), stock: parseInt(stock),
        description: document.getElementById('productDescription').value.trim(),
        imageUrl: document.getElementById('productImage').value.trim(),
        category: catId ? { id: parseInt(catId) } : null
    };
    try {
        const res = await fetch(id ? `${API}/products/${id}` : `${API}/products`, {
            method: id ? 'PUT' : 'POST',
            headers: authHeader(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        showToast(id ? 'Product updated successfully!' : 'Product added successfully!', 'success');
        closeProductModal(); loadAdminProducts();
    } catch(e) { showToast('Error saving product', 'error'); }
}

async function deleteProduct(id) {
    if (!confirm('Permanently delete this product?')) return;
    try {
        await fetch(`${API}/products/${id}`, { method:'DELETE', headers: authHeader() });
        showToast('Product deleted.', 'success'); loadAdminProducts();
    } catch(e) { showToast('Error deleting product', 'error'); }
}
function closeProductModal() { document.getElementById('productFormModal').classList.remove('open'); }

// ====== CATEGORIES ======
async function loadAdminCategories() {
    try {
        const cats = await fetch(`${API}/categories`).then(r => r.json());
        document.getElementById('categoriesTableBody').innerHTML = cats.map(c => `<tr>
            <td><strong>#${c.id}</strong></td>
            <td><strong>${c.name}</strong></td>
            <td>${c.description || '<em style="color:#94a3b8">—</em>'}</td>
            <td><div class="action-btns">
                <button class="btn-edit" onclick="editCategory(${c.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-delete" onclick="deleteCategory(${c.id})"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
    } catch(e) { showToast('Error loading categories', 'error'); }
}

function openCategoryModal() {
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryFormModal').classList.add('open');
}

async function editCategory(id) {
    try {
        const c = await fetch(`${API}/categories/${id}`).then(r => r.json());
        document.getElementById('categoryId').value = c.id;
        document.getElementById('categoryName').value = c.name;
        document.getElementById('categoryDescription').value = c.description || '';
        document.getElementById('categoryModalTitle').textContent = 'Edit Category';
        document.getElementById('categoryFormModal').classList.add('open');
    } catch(e) {}
}

async function saveCategory() {
    const id   = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    if (!name) { showToast('Name is required!', 'error'); return; }
    const payload = { name, description: document.getElementById('categoryDescription').value.trim() };
    try {
        const res = await fetch(id ? `${API}/categories/${id}` : `${API}/categories`, {
            method: id ? 'PUT' : 'POST',
            headers: authHeader(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        showToast(id ? 'Category updated!' : 'Category added!', 'success');
        closeCategoryModal(); loadAdminCategories();
    } catch(e) { showToast('Error saving category', 'error'); }
}

async function deleteCategory(id) {
    if (!confirm('Delete this category?')) return;
    try {
        await fetch(`${API}/categories/${id}`, { method:'DELETE', headers: authHeader() });
        showToast('Category deleted.', 'success'); loadAdminCategories();
    } catch(e) { showToast('Error deleting category', 'error'); }
}
function closeCategoryModal() { document.getElementById('categoryFormModal').classList.remove('open'); }

// ====== ORDERS ======
async function loadAdminOrders() {
    try {
        const orders = await fetch(`${API}/orders`, { headers: authHeader() }).then(r => r.json());
        document.getElementById('ordersTableBody').innerHTML = !orders.length
            ? `<tr><td colspan="8" style="text-align:center;color:#64748b;padding:30px">No orders found.</td></tr>`
            : orders.map(o => `<tr>
                <td><strong>#${o.id}</strong></td>
                <td>${o.customerName}</td>
                <td>${o.customerEmail}</td>
                <td>${o.customerPhone}</td>
                <td><strong>${Number(o.totalAmount).toFixed(2)} TND</strong></td>
                <td>
                    <select class="status-select" onchange="updateStatus(${o.id}, this.value)">
                        ${['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s =>
                `<option value="${s}" ${o.status===s?'selected':''}>${tStatus(s)}</option>`
            ).join('')}
                    </select>
                </td>
                <td>${fDate(o.createdAt)}</td>
                <td><button class="btn-delete" onclick="deleteOrder(${o.id})"><i class="fas fa-trash"></i></button></td>
            </tr>`).join('');
    } catch(e) { showToast('Error loading orders', 'error'); }
}

async function updateStatus(id, status) {
    try {
        await fetch(`${API}/orders/${id}/status`, {
            method:'PUT', headers: authHeader(), body: JSON.stringify({ status })
        });
        showToast('Status updated!', 'success');
    } catch(e) { showToast('Error updating status', 'error'); }
}

async function deleteOrder(id) {
    if (!confirm('Delete this order?')) return;
    try {
        await fetch(`${API}/orders/${id}`, { method:'DELETE', headers: authHeader() });
        showToast('Order deleted.', 'success'); loadAdminOrders();
    } catch(e) { showToast('Error deleting order', 'error'); }
}

// ====== HELPERS ======
function authHeader() {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}
function sClass(s) { return s===0?'out-stock':s<=5?'low-stock':'in-stock'; }
function tStatus(s) { return {PENDING:'Pending',CONFIRMED:'Confirmed',SHIPPED:'Shipped',DELIVERED:'Delivered',CANCELLED:'Cancelled'}[s]||s; }
function fDate(d) { return d ? new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'; }
function showToast(msg, type='') {
    const t = document.getElementById('toast');
    t.innerHTML = (type==='success'?'<i class="fas fa-check-circle"></i>':type==='error'?'<i class="fas fa-exclamation-circle"></i>':'') + ' ' + msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.className = 'toast', 4000);
}
document.getElementById('productFormModal')?.addEventListener('click', e => { if(e.target.id==='productFormModal') closeProductModal(); });
document.getElementById('categoryFormModal')?.addEventListener('click', e => { if(e.target.id==='categoryFormModal') closeCategoryModal(); });