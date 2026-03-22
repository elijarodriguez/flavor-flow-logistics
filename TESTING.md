# Firebase Testing Guide

## 🧪 Testing Checklist

Complete these tests in order to verify everything works:

### **Phase 1: Setup & Initial Load**

- [ ] Start dev server: `npm run dev`
- [ ] App loads at http://localhost:5173
- [ ] No console errors
- [ ] Homepage displays with products section

### **Phase 2: Authentication**

- [ ] Click "Admin" in navigation
- [ ] Redirected to login page
- [ ] Sign in with your admin credentials
- [ ] Successfully logged in
- [ ] Welcome message shows admin status
- [ ] "Dashboard" menu items appear
- [ ] Logout works

### **Phase 3: Products Page**

- [ ] Navigate to Products admin page
- [ ] Page loads (even if empty)
- [ ] Click "Add Product" button
- [ ] Form opens with fields:
  - [ ] Name
  - [ ] Category
  - [ ] Description
  - [ ] Price
  - [ ] Stock
  - [ ] Flavors
  - [ ] Image URL
  - [ ] Active checkbox
- [ ] Fill in test product:
  ```
  Name: Test Siomai
  Category: Test
  Description: This is a test product
  Price: 50
  Stock: 100
  Flavors: Original, Spicy
  Image URL: https://via.placeholder.com/300x300?text=Test+Product
  Active: checked
  ```
- [ ] Click "Save Product"
- [ ] Success message appears
- [ ] Product appears in list
- [ ] Product card shows:
  - [ ] Image from URL
  - [ ] Name
  - [ ] Category
  - [ ] Price
  - [ ] Stock count
  - [ ] Flavors
  - [ ] Active badge

### **Phase 4: Product Management**

- [ ] Click "Edit" on test product
- [ ] Form populates with correct data
- [ ] Change name to "Updated Siomai"
- [ ] Change price to 75
- [ ] Click "Save Product"
- [ ] Changes appear in list
- [ ] Click "Delete" on test product
- [ ] Confirmation appears
- [ ] Product removed from list

### **Phase 5: Orders Page**

- [ ] Navigate to Orders admin page
- [ ] Page loads with table headers:
  - [ ] Customer
  - [ ] Email
  - [ ] Phone
  - [ ] Total
  - [ ] Status
  - [ ] Date
  - [ ] Action
- [ ] Status dropdown works (Pending → Processing → Shipped, etc.)
- [ ] CSV import button visible
- [ ] (Optional) Test CSV import with sample data

### **Phase 6: Dashboard**

- [ ] Navigate to Dashboard
- [ ] Statistics cards display:
  - [ ] Total Products count
  - [ ] Pending Orders count
  - [ ] Delivered count
  - [ ] Total Revenue
- [ ] Charts load (or show "No data yet" if empty)
- [ ] Recent Orders section visible
- [ ] No errors in console

### **Phase 7: Public Products Section**

- [ ] Go back to home page
- [ ] Scroll to "Products" section
- [ ] Created test product appears
- [ ] Product displays correctly with:
  - [ ] Image from URL
  - [ ] Name
  - [ ] Category
  - [ ] Description
  - [ ] Price
  - [ ] Flavors

### **Phase 8: Firestore Verification**

Open Firebase Console and verify data:

- [ ] Go to Firestore Database → Collections
- [ ] `products` collection exists with your test product
- [ ] `user_roles` collection exists with your admin user
- [ ] Document structure matches `src/integrations/firebase/types.ts`

---

## 🐛 Common Issues & Solutions

| Issue                             | Solution                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------- |
| **"Firebase is not initialized"** | Check `.env.local` has correct API key, restart dev server                      |
| **"Permission denied" error**     | Verify admin role in `user_roles/{uid}` document, check security rules deployed |
| **Products don't save**           | Check browser console for errors, verify Firestore has write permissions        |
| **Image not showing**             | Image URL must be publicly accessible (not localhost URLs)                      |
| **Can't login**                   | Verify user exists in Firebase Authentication                                   |
| **Dashboard shows no data**       | Create at least one product first, data refreshes automatically                 |

---

## 📝 Test Data Generator

If you want to add multiple products for testing:

```javascript
// Run in browser console on AdminProducts page
const products = [
    { name: "Pork Siomai", category: "Siomai", price: 50, stock: 100 },
    { name: "Beef Siomai", category: "Siomai", price: 60, stock: 80 },
    { name: "Shrimp Lumpia", category: "Lumpia", price: 40, stock: 120 },
    {
        name: "Longganisang Calumpit",
        category: "Longganisa",
        price: 80,
        stock: 50,
    },
];
console.log(JSON.stringify(products, null, 2));
```

---

## ✅ Success Criteria

All tests pass when:

- ✅ Can create products ✅ Can edit products
- ✅ Can delete products
- ✅ Can view dashboard with data
- ✅ Can manage orders
- ✅ Public site shows products
- ✅ No console errors
- ✅ Data persists in Firestore
