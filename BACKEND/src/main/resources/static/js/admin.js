const API = 'http://localhost:8088/api';

document.addEventListener('DOMContentLoaded', () => loadDashboard());

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
            fetch(`${API}/orders/stats`).then(r => r.json()),
            fetch(`${API}/categories`).then(r => r.json())
        ]);
        document.getElementById('statProducts').textContent = stats.totalProducts;
        document.getElementById('statOrders').textContent = stats.totalOrders;
        document.getElementById('statRevenue').textContent = Number(stats.totalRevenue).toFixed(2) + ' TND';
        document.getElementById('statCategories').textContent = cats.length;
    } catch(e) { showToast('Impossible de se connecter au serveur Spring Boot', 'error'); }

    try {
        const orders = await fetch(`${API}/orders`).then(r => r.json());
        const el = document.getElementById('recentOrdersList');
        if (!orders.length) { el.innerHTML = '<p style="color:#64748b;padding:12px 0">Aucune commande enregistrée.</p>'; return; }
        el.innerHTML = `<table class="admin-table">
            <thead><tr><th>#ID</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead>
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
            <td>${p.category ? p.category.name : '<em style="color:#94a3b8">Aucune</em>'}</td>
            <td>${Number(p.price).toFixed(2)} TND</td>
            <td><span class="stock-badge ${sClass(p.stock)}">${p.stock} unité(s)</span></td>
            <td><div class="action-btns">
                <button class="btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i> Modifier</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
    } catch(e) { showToast('Erreur chargement produits', 'error'); }
}

async function openProductModal(id = null) {
    ['productId','productName','productPrice','productStock','productDescription','productImage'].forEach(x => document.getElementById(x).value = '');
    document.getElementById('productModalTitle').textContent = id ? 'Modifier le produit' : 'Ajouter un produit';

    try {
        const cats = await fetch(`${API}/categories`).then(r => r.json());
        document.getElementById('productCategory').innerHTML =
            '<option value="">Choisir une catégorie</option>' +
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
    const id   = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    const catId = document.getElementById('productCategory').value;
    if (!name || !price || stock === '') { showToast('Remplissez les champs obligatoires (*)','error'); return; }

    const payload = {
        name, price: parseFloat(price), stock: parseInt(stock),
        description: document.getElementById('productDescription').value.trim(),
        imageUrl: document.getElementById('productImage').value.trim(),
        category: catId ? { id: parseInt(catId) } : null
    };
    try {
        const res = await fetch(id ? `${API}/products/${id}` : `${API}/products`, {
            method: id ? 'PUT' : 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        showToast(id ? 'Produit modifié avec succès !' : 'Produit ajouté avec succès !', 'success');
        closeProductModal(); loadAdminProducts();
    } catch(e) { showToast('Erreur lors de l\'enregistrement', 'error'); }
}

async function deleteProduct(id) {
    if (!confirm('Supprimer ce produit définitivement ?')) return;
    try {
        await fetch(`${API}/products/${id}`, { method:'DELETE' });
        showToast('Produit supprimé.', 'success'); loadAdminProducts();
    } catch(e) { showToast('Erreur suppression', 'error'); }
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
                <button class="btn-edit" onclick="editCategory(${c.id})"><i class="fas fa-edit"></i> Modifier</button>
                <button class="btn-delete" onclick="deleteCategory(${c.id})"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>`).join('');
    } catch(e) { showToast('Erreur chargement catégories', 'error'); }
}

function openCategoryModal() {
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Ajouter une catégorie';
    document.getElementById('categoryFormModal').classList.add('open');
}

async function editCategory(id) {
    try {
        const c = await fetch(`${API}/categories/${id}`).then(r => r.json());
        document.getElementById('categoryId').value = c.id;
        document.getElementById('categoryName').value = c.name;
        document.getElementById('categoryDescription').value = c.description || '';
        document.getElementById('categoryModalTitle').textContent = 'Modifier la catégorie';
        document.getElementById('categoryFormModal').classList.add('open');
    } catch(e) {}
}

async function saveCategory() {
    const id   = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    if (!name) { showToast('Le nom est obligatoire !', 'error'); return; }
    const payload = { name, description: document.getElementById('categoryDescription').value.trim() };
    try {
        const res = await fetch(id ? `${API}/categories/${id}` : `${API}/categories`, {
            method: id ? 'PUT' : 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        showToast(id ? 'Catégorie modifiée !' : 'Catégorie ajoutée !', 'success');
        closeCategoryModal(); loadAdminCategories();
    } catch(e) { showToast('Erreur enregistrement', 'error'); }
}

async function deleteCategory(id) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
        await fetch(`${API}/categories/${id}`, { method:'DELETE' });
        showToast('Catégorie supprimée.', 'success'); loadAdminCategories();
    } catch(e) { showToast('Erreur suppression', 'error'); }
}
function closeCategoryModal() { document.getElementById('categoryFormModal').classList.remove('open'); }

// ====== ORDERS ======
async function loadAdminOrders() {
    try {
        const orders = await fetch(`${API}/orders`).then(r => r.json());
        document.getElementById('ordersTableBody').innerHTML = !orders.length
            ? `<tr><td colspan="8" style="text-align:center;color:#64748b;padding:30px">Aucune commande.</td></tr>`
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
    } catch(e) { showToast('Erreur chargement commandes', 'error'); }
}

async function updateStatus(id, status) {
    try {
        await fetch(`${API}/orders/${id}/status`, {
            method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status })
        });
        showToast('Statut mis à jour !', 'success');
    } catch(e) { showToast('Erreur mise à jour', 'error'); }
}

async function deleteOrder(id) {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
        await fetch(`${API}/orders/${id}`, { method:'DELETE' });
        showToast('Commande supprimée.', 'success'); loadAdminOrders();
    } catch(e) { showToast('Erreur suppression', 'error'); }
}

// ====== HELPERS ======
function sClass(s) { return s===0?'out-stock':s<=5?'low-stock':'in-stock'; }
function tStatus(s) { return {PENDING:'En attente',CONFIRMED:'Confirmée',SHIPPED:'Expédiée',DELIVERED:'Livrée',CANCELLED:'Annulée'}[s]||s; }
function fDate(d) { return d ? new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—'; }
function showToast(msg, type='') {
    const t = document.getElementById('toast');
    t.innerHTML = (type==='success'?'<i class="fas fa-check-circle"></i>':type==='error'?'<i class="fas fa-exclamation-circle"></i>':'') + ' ' + msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.className = 'toast', 4000);
}
document.getElementById('productFormModal')?.addEventListener('click', e => { if(e.target.id==='productFormModal') closeProductModal(); });
document.getElementById('categoryFormModal')?.addEventListener('click', e => { if(e.target.id==='categoryFormModal') closeCategoryModal(); });
