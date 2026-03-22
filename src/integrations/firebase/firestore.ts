import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { firestore } from "./config";
import { Order, OrderForm, OrderItem, Product, ProductForm } from "./types";

// ============================================================================
// PRODUCTS COLLECTION
// ============================================================================

export async function getProducts(): Promise<Product[]> {
    try {
        const querySnapshot = await getDocs(collection(firestore, "products"));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getActiveProducts(): Promise<Product[]> {
    try {
        const q = query(
            collection(firestore, "products"),
            where("isActive", "==", true),
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[];
    } catch (error) {
        console.error("Error fetching active products:", error);
        return [];
    }
}

export async function getProduct(id: string): Promise<Product | null> {
    try {
        const docSnap = await getDoc(doc(firestore, "products", id));
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
            } as Product;
        }
        return null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function createProduct(
    data: ProductForm,
): Promise<string | null> {
    try {
        const now = Timestamp.now();
        const newProduct = {
            ...data,
            createdAt: now,
            updatedAt: now,
        };
        const docRef = await addDoc(
            collection(firestore, "products"),
            newProduct,
        );
        return docRef.id;
    } catch (error) {
        console.error("Error creating product:", error);
        return null;
    }
}

export async function updateProduct(
    id: string,
    data: Partial<ProductForm>,
): Promise<boolean> {
    try {
        await updateDoc(doc(firestore, "products", id), {
            ...data,
            updatedAt: Timestamp.now(),
        });
        return true;
    } catch (error) {
        console.error("Error updating product:", error);
        return false;
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(firestore, "products", id));
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
}

// ============================================================================
// ORDERS COLLECTION
// ============================================================================

export async function getOrders(): Promise<Order[]> {
    try {
        const querySnapshot = await getDocs(collection(firestore, "orders"));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Order[];
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export async function getOrder(id: string): Promise<Order | null> {
    try {
        const docSnap = await getDoc(doc(firestore, "orders", id));
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
            } as Order;
        }
        return null;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

export async function createOrder(data: OrderForm): Promise<string | null> {
    try {
        const now = Timestamp.now();
        const total = data.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        const newOrder = {
            ...data,
            total,
            status: "Pending" as const,
            createdAt: now,
            updatedAt: now,
        };
        const docRef = await addDoc(collection(firestore, "orders"), newOrder);
        return docRef.id;
    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
}

export async function updateOrder(
    id: string,
    data: Partial<Order>,
): Promise<boolean> {
    try {
        const updateData: any = { ...data, updatedAt: Timestamp.now() };
        // Remove id and dates from update data if they exist
        delete updateData.id;
        delete updateData.createdAt;

        await updateDoc(doc(firestore, "orders", id), updateData);
        return true;
    } catch (error) {
        console.error("Error updating order:", error);
        return false;
    }
}

export async function deleteOrder(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(firestore, "orders", id));
        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        return false;
    }
}

// ============================================================================
// USER ROLES COLLECTION
// ============================================================================

export async function getUserRole(uid: string): Promise<string | null> {
    try {
        const docSnap = await getDoc(doc(firestore, "user_roles", uid));
        if (docSnap.exists()) {
            return docSnap.data().role || null;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

export async function setUserRole(
    uid: string,
    role: string,
): Promise<boolean> {
    try {
        await setDoc(doc(firestore, "user_roles", uid), {
            role,
            createdAt: Timestamp.now(),
        });
        return true;
    } catch (error) {
        console.error("Error setting user role:", error);
        return false;
    }
}
