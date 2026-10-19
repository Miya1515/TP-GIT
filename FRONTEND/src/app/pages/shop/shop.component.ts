import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItem, Category, Product } from '../../models/models';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../shared/toast.component';
import { fmt, imgFallback, stockClass, stockLabel } from '../../shared/utils';

type GridState = 'loading' | 'searching' | 'error' | 'ready';

/** Conversion de index.html + js/app.js (version Miya Cosmetics avec authentification) */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastComponent],
  templateUrl: './shop.component.html',
  styles: [`:host { display: contents; }`]
})
export class ShopComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly fmt = fmt;
  readonly stockClass = stockClass;
  readonly stockLabel = stockLabel;
  readonly imgFallback = imgFallback;

  private readonly icons = ['fa-star', 'fa-palette', 'fa-spa', 'fa-leaf', 'fa-gem', 'fa-heart', 'fa-sun', 'fa-magic'];

  cart: CartItem[] = this.loadCart();
  allProducts: Product[] = [];
  products: Product[] = [];
  categories: (Category & { icon: string })[] = [];
  activeCategory: number | null = null;
  gridState: GridState = 'loading';
  productCount = '';
  searchKeyword = '';

  cartOpen = false;
  productModalOpen = false;
  modalProduct: Product | null = null;
  checkoutOpen = false;
  summary: { items: CartItem[]; total: number } | null = null;

  cust = { name: '', email: '', phone: '', address: '' };
  processing = false;
  confirmLabel = 'Confirm Order';

  /**
   * Lit le panier enregistré dans localStorage (clé « cart », comme l'original).
   * Une valeur invalide (autre application sur localhost:4200, JSON corrompu...) est ignorée
   * au lieu de bloquer tout l'affichage de la page.
   */
  private loadCart(): CartItem[] {
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      return Array.isArray(c)
        ? c.filter(i => i && typeof i.id === 'number' && typeof i.price === 'number' && typeof i.qty === 'number')
        : [];
    } catch {
      return [];
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // ─── AUTH / NAVBAR ───
  logout(): void {
    this.auth.clearSession();
    this.router.navigateByUrl('/');
  }

  // ─── CATEGORIES ───
  async loadCategories(): Promise<void> {
    try {
      const cats = await this.api.getCategories();
      this.categories = cats.map((c, i) => ({ ...c, icon: this.icons[i % this.icons.length] }));
    } catch {
      this.toast.show('Could not load categories', 'error');
    }
  }

  // ─── PRODUCTS ───
  async loadProducts(categoryId: number | null = null): Promise<void> {
    this.gridState = 'loading';
    try {
      this.allProducts = categoryId ? await this.api.getProductsByCategory(categoryId) : await this.api.getProducts();
      this.renderProducts(this.allProducts);
    } catch {
      this.gridState = 'error';
    }
  }

  renderProducts(products: Product[]): void {
    this.products = products;
    this.productCount = `${products.length} product(s)`;
    this.gridState = 'ready';
  }

  filterByCategory(categoryId: number | null): void {
    this.activeCategory = categoryId;
    this.loadProducts(categoryId);
  }

  async searchProducts(): Promise<void> {
    const kw = this.searchKeyword.trim();
    if (!kw) {
      this.loadProducts();
      return;
    }
    this.gridState = 'searching';
    try {
      this.renderProducts(await this.api.searchProducts(kw));
    } catch {
      this.toast.show('Search error', 'error');
    }
  }

  scrollToProducts(): void {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ─── MODAL PRODUIT ───
  async openProductModal(id: number): Promise<void> {
    try {
      this.modalProduct = await this.api.getProduct(id);
      this.productModalOpen = true;
    } catch {
      this.toast.show('Error loading product', 'error');
    }
  }
  closeModal(): void {
    this.productModalOpen = false;
  }

  // ─── CART ───
  addToCart(e: Event, productId: number): void {
    e.stopPropagation();
    const p = this.allProducts.find(x => x.id === productId);
    if (!p || p.stock === 0) return;
    const ex = this.cart.find(i => i.id === productId);
    if (ex) {
      if (ex.qty >= p.stock) {
        this.toast.show('Insufficient stock!', 'error');
        return;
      }
      ex.qty++;
    } else {
      this.cart.push({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, qty: 1 });
    }
    this.saveCart();
    this.toast.show(`"${p.name}" added to cart!`, 'success');
  }
  removeFromCart(id: number): void {
    this.cart = this.cart.filter(i => i.id !== id);
    this.saveCart();
  }
  changeQty(id: number, delta: number): void {
    const item = this.cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.removeFromCart(id);
    else this.saveCart();
  }
  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  get totalQty(): number {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  }
  get cartTotal(): number {
    return this.cart.reduce((s, i) => s + i.price * i.qty, 0);
  }
  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }

  // ─── CHECKOUT ───
  goToCheckout(): void {
    if (!this.cart.length) {
      this.toast.show('Your cart is empty!', 'error');
      return;
    }
    this.toggleCart();
    this.summary = { items: this.cart.map(i => ({ ...i })), total: this.cartTotal };

    const nom = localStorage.getItem('nom');
    const email = localStorage.getItem('email');
    if (nom) this.cust.name = nom;
    if (email) this.cust.email = email;

    this.checkoutOpen = true;
  }
  closeCheckoutModal(): void {
    this.checkoutOpen = false;
  }

  async placeOrder(): Promise<void> {
    const name = this.cust.name.trim();
    const email = this.cust.email.trim();
    const phone = this.cust.phone.trim();
    const address = this.cust.address.trim();
    if (!name || !email || !phone || !address) {
      this.toast.show('Please fill all fields!', 'error');
      return;
    }
    if (!email.includes('@')) {
      this.toast.show('Invalid email address!', 'error');
      return;
    }
    this.processing = true;
    try {
      const data = await this.api.createOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        cartItems: this.cart.map(i => ({ productId: i.id, quantity: i.qty }))
      });
      this.cart = [];
      this.saveCart();
      this.closeCheckoutModal();
      this.toast.show(`✅ Order #${data.id} confirmed! Thank you ${name.split(' ')[0]}!`, 'success');
      this.cust = { name: '', email: '', phone: '', address: '' };
    } catch (e: any) {
      const body = e?.error;
      const message =
        (body && typeof body === 'object' && body.error) || (e?.status === 0 ? 'Failed to fetch' : 'Server error');
      this.toast.show('Error: ' + message, 'error');
    } finally {
      this.processing = false;
      this.confirmLabel = 'Place Order';
    }
  }

  onOverlayClick(e: MouseEvent, which: 'product' | 'checkout'): void {
    if (e.target !== e.currentTarget) return;
    if (which === 'product') this.closeModal();
    else this.closeCheckoutModal();
  }
}
