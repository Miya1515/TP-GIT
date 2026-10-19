export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: Category | null;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  qty: number;
}

export interface AuthResponse {
  token: string;
  role: string;
  nom: string;
  email: string;
}
