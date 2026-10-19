import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Category, Order, OrderStats, Product } from '../../models/models';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../shared/toast.component';
import { fDate, imgFallback, ORDER_STATUSES, sClass, tStatus } from '../../shared/utils';

type Section = 'dashboard' | 'products' | 'categories' | 'orders';

/** Conversion de admin.html + js/admin.js (version Miya Cosmetics avec authentification) */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastComponent],
  templateUrl: './admin.component.html',
  styles: [`:host { display: contents; }`]
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly sClass = sClass;
  readonly tStatus = tStatus;
  readonly fDate = fDate;
  readonly imgFallback = imgFallback;
  readonly statuses = ORDER_STATUSES;
  readonly Number = Number;

  section: Section = 'dashboard';

  // Dashboard
  statProducts: string | number = '...';
  statOrders: string | number = '...';
  statRevenue = '...';
  statCategories: string | number = '...';
  recentOrders: Order[] | null = null;

  // Listes
  products: Product[] = [];
  categories: Category[] = [];
  orders: Order[] = [];
  ordersLoaded = false;
  categoryOptions: Category[] = [];

  // Modal produit
  productModalOpen = false;
  productModalTitle = 'Add Product';
  pf = this.emptyProduct();

  // Modal catégorie
  categoryModalOpen = false;
  categoryModalTitle = 'Add Category';
  cf = { id: '', name: '', description: '' };

  ngOnInit(): void {
    // <body class="admin-body"> comme dans admin.html
    document.body.classList.add('admin-body');
    this.loadDashboard();
  }
  ngOnDestroy(): void {
    document.body.classList.remove('admin-body');
  }

  // ====== LOGOUT ======
  doLogout(): void {
    this.auth.clearSession();
    this.router.navigateByUrl('/');
  }

  // ====== NAV ======
  showSection(section: Section, e?: Event): void {
    e?.preventDefault();
    this.section = section;
    const actions: Record<Section, () => void> = {
      dashboard: () => this.loadDashboard(),
      products: () => this.loadAdminProducts(),
      categories: () => this.loadAdminCategories(),
      orders: () => this.loadAdminOrders()
    };
    actions[section]();
  }

  // ====== DASHBOARD ======
  async loadDashboard(): Promise<void> {
    try {
      const [stats, cats]: [OrderStats, Category[]] = await Promise.all([this.api.getStats(), this.api.getCategories()]);
      this.statProducts = stats.totalProducts;
      this.statOrders = stats.totalOrders;
      this.statRevenue = Number(stats.totalRevenue).toFixed(2) + ' TND';
      this.statCategories = cats.length;
    } catch {
      this.toast.show('Cannot connect to the server', 'error');
    }

    try {
      this.recentOrders = await this.api.getOrders();
    } catch {
      /* silencieux, comme l'original */
    }
  }

  // ====== PRODUCTS ======
  async loadAdminProducts(): Promise<void> {
    try {
      this.products = await this.api.getProducts();
    } catch {
      this.toast.show('Error loading products', 'error');
    }
  }

  private emptyProduct() {
    return {
      id: '',
      name: '',
      categoryId: '',
      price: null as number | null,
      stock: null as number | null,
      description: '',
      imageUrl: ''
    };
  }

  async openProductModal(id: number | null = null): Promise<void> {
    this.pf = this.emptyProduct();
    this.productModalTitle = id ? 'Edit Product' : 'Add Product';
    try {
      this.categoryOptions = await this.api.getCategories();
    } catch {
      /* silencieux */
    }
    if (id) {
      try {
        const p = await this.api.getProduct(id);
        this.pf = {
          id: String(p.id),
          name: p.name,
          price: p.price,
          stock: p.stock,
          description: p.description || '',
          imageUrl: p.imageUrl || '',
          categoryId: p.category ? String(p.category.id) : ''
        };
      } catch {
        /* silencieux */
      }
    }
    this.productModalOpen = true;
  }
  editProduct(id: number): void {
    this.openProductModal(id);
  }

  async saveProduct(): Promise<void> {
    const id = this.pf.id;
    const name = this.pf.name.trim();
    const price = this.pf.price === null || this.pf.price === undefined ? '' : String(this.pf.price);
    const stock = this.pf.stock === null || this.pf.stock === undefined ? '' : String(this.pf.stock);
    const catId = this.pf.categoryId;
    if (!name || !price || stock === '') {
      this.toast.show('Please fill in required fields (*)', 'error');
      return;
    }
    const payload = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: this.pf.description.trim(),
      imageUrl: this.pf.imageUrl.trim(),
      category: catId ? { id: parseInt(catId) } : null
    };
    try {
      await this.api.saveProduct(id, payload);
      this.toast.show(id ? 'Product updated successfully!' : 'Product added successfully!', 'success');
      this.closeProductModal();
      this.loadAdminProducts();
    } catch {
      this.toast.show('Error saving product', 'error');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    if (!confirm('Permanently delete this product?')) return;
    try {
      await this.api.deleteProduct(id);
      this.toast.show('Product deleted.', 'success');
      this.loadAdminProducts();
    } catch {
      this.toast.show('Error deleting product', 'error');
    }
  }
  closeProductModal(): void {
    this.productModalOpen = false;
  }

  // ====== CATEGORIES ======
  async loadAdminCategories(): Promise<void> {
    try {
      this.categories = await this.api.getCategories();
    } catch {
      this.toast.show('Error loading categories', 'error');
    }
  }

  openCategoryModal(): void {
    this.cf = { id: '', name: '', description: '' };
    this.categoryModalTitle = 'Add Category';
    this.categoryModalOpen = true;
  }

  async editCategory(id: number): Promise<void> {
    try {
      const c = await this.api.getCategory(id);
      this.cf = { id: String(c.id), name: c.name, description: c.description || '' };
      this.categoryModalTitle = 'Edit Category';
      this.categoryModalOpen = true;
    } catch {
      /* silencieux */
    }
  }

  async saveCategory(): Promise<void> {
    const id = this.cf.id;
    const name = this.cf.name.trim();
    if (!name) {
      this.toast.show('Name is required!', 'error');
      return;
    }
    const payload = { name, description: this.cf.description.trim() };
    try {
      await this.api.saveCategory(id, payload);
      this.toast.show(id ? 'Category updated!' : 'Category added!', 'success');
      this.closeCategoryModal();
      this.loadAdminCategories();
    } catch {
      this.toast.show('Error saving category', 'error');
    }
  }

  async deleteCategory(id: number): Promise<void> {
    if (!confirm('Delete this category?')) return;
    try {
      await this.api.deleteCategory(id);
      this.toast.show('Category deleted.', 'success');
      this.loadAdminCategories();
    } catch {
      this.toast.show('Error deleting category', 'error');
    }
  }
  closeCategoryModal(): void {
    this.categoryModalOpen = false;
  }

  // ====== ORDERS ======
  async loadAdminOrders(): Promise<void> {
    try {
      this.orders = await this.api.getOrders();
      this.ordersLoaded = true;
    } catch {
      this.toast.show('Error loading orders', 'error');
    }
  }

  async updateStatus(id: number, status: string): Promise<void> {
    try {
      await this.api.updateOrderStatus(id, status);
      this.toast.show('Status updated!', 'success');
    } catch {
      this.toast.show('Error updating status', 'error');
    }
  }

  async deleteOrder(id: number): Promise<void> {
    if (!confirm('Delete this order?')) return;
    try {
      await this.api.deleteOrder(id);
      this.toast.show('Order deleted.', 'success');
      this.loadAdminOrders();
    } catch {
      this.toast.show('Error deleting order', 'error');
    }
  }

  // ====== HELPERS ======
  selectValue(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }
  onOverlayClick(e: MouseEvent, which: 'product' | 'category'): void {
    if (e.target !== e.currentTarget) return;
    if (which === 'product') this.closeProductModal();
    else this.closeCategoryModal();
  }
}
