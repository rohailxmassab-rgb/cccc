export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients: string[];
  ratings: number;
  available: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  timestamp: any;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
