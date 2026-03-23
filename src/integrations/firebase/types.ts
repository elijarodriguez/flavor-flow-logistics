// Product type
export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    flavors: string[];
    imageUrl: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductForm {
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    flavors: string[];
    imageUrl: string;
    isActive: boolean;
}

// Order types
export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    notes: string | null;
    trackingNumber: string | null;
    courier: string | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    flavor?: string;
}

export interface OrderForm {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    notes: string | null;
}

// User role type
export interface UserRole {
    uid: string;
    role: "admin" | "user";
    createdAt: Date;
}
