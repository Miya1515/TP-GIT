import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, Category, Order, OrderStats, Product } from '../models/models';

/**
 * Accès aux endpoints REST du backend Spring Boot existant (aucune modification côté backend).
 * L'en-tête Authorization est envoyé exactement là où le JavaScript d'origine l'envoyait.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly API = environment.apiUrl;

  /** Équivalent de authHeader() (admin.js) */
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
  }

  /** Équivalent de l'en-tête optionnel de placeOrder() (app.js) */
  private optionalAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token');
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return headers;
  }

  // ===== AUTH =====
  login(email: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(this.http.post<AuthResponse>(`${this.API}/auth/login`, { email, password }));
  }
  register(nom: string, email: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(this.http.post<AuthResponse>(`${this.API}/auth/register`, { nom, email, password }));
  }

  // ===== CATEGORIES =====
  getCategories(): Promise<Category[]> {
    return firstValueFrom(this.http.get<Category[]>(`${this.API}/categories`));
  }
  getCategory(id: number | string): Promise<Category> {
    return firstValueFrom(this.http.get<Category>(`${this.API}/categories/${id}`));
  }
  saveCategory(id: string, payload: { name: string; description: string }): Promise<unknown> {
    return firstValueFrom(
      id
        ? this.http.put(`${this.API}/categories/${id}`, payload, { headers: this.authHeaders() })
        : this.http.post(`${this.API}/categories`, payload, { headers: this.authHeaders() })
    );
  }
  deleteCategory(id: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.API}/categories/${id}`, { headers: this.authHeaders() }));
  }

  // ===== PRODUCTS =====
  getProducts(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`${this.API}/products`));
  }
  getProductsByCategory(categoryId: number): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`${this.API}/products/category/${categoryId}`));
  }
  searchProducts(keyword: string): Promise<Product[]> {
    return firstValueFrom(
      this.http.get<Product[]>(`${this.API}/products/search?keyword=${encodeURIComponent(keyword)}`)
    );
  }
  getProduct(id: number | string): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`${this.API}/products/${id}`));
  }
  saveProduct(id: string, payload: unknown): Promise<unknown> {
    return firstValueFrom(
      id
        ? this.http.put(`${this.API}/products/${id}`, payload, { headers: this.authHeaders() })
        : this.http.post(`${this.API}/products`, payload, { headers: this.authHeaders() })
    );
  }
  deleteProduct(id: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.API}/products/${id}`, { headers: this.authHeaders() }));
  }

  // ===== ORDERS =====
  getOrders(): Promise<Order[]> {
    return firstValueFrom(this.http.get<Order[]>(`${this.API}/orders`, { headers: this.authHeaders() }));
  }
  getStats(): Promise<OrderStats> {
    return firstValueFrom(this.http.get<OrderStats>(`${this.API}/orders/stats`, { headers: this.authHeaders() }));
  }
  createOrder(payload: unknown): Promise<{ id: number }> {
    return firstValueFrom(
      this.http.post<{ id: number }>(`${this.API}/orders`, payload, { headers: this.optionalAuthHeaders() })
    );
  }
  updateOrderStatus(id: number, status: string): Promise<unknown> {
    return firstValueFrom(
      this.http.put(`${this.API}/orders/${id}/status`, { status }, { headers: this.authHeaders() })
    );
  }
  deleteOrder(id: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.API}/orders/${id}`, { headers: this.authHeaders() }));
  }
}
