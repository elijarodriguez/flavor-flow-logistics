# Firebase Migration Guide

## ✅ Project Setup Complete!

Your Firebase project **flavor-flow-logistics** has been created and configured.

### Firebase Configuration Status:

- ✅ Firebase project created
- ✅ Authentication enabled (Email/Password)
- ✅ Firestore Database created
- ✅ Web app registered
- ✅ `.env.local` configured with API credentials

---

## ✅ Completed: Code Migration

All code has been migrated from Supabase to Firebase. Here's what was changed:

### Files Migrated:

1. **AuthContext.tsx** - Now uses Firebase Authentication
2. **AdminProducts.tsx** - Now uses Firestore + Firebase Storage
3. **AdminOrders.tsx** - Now uses Firestore
4. **AdminDashboard.tsx** - Now uses Firestore
5. **ProductsSection.tsx** - Now uses Firestore

### New Firebase Integration Files:

- `src/integrations/firebase/config.ts` - Firebase initialization
- `src/integrations/firebase/types.ts` - TypeScript type definitions
- `src/integrations/firebase/firestore.ts` - Firestore database operations
- `src/integrations/firebase/storage.ts` - Firebase Storage operations
- `src/integrations/firebase/firestore.rules` - Security rules

---

## 🚀 Remaining Setup Steps

Your `.env.local` is now configured with your Firebase credentials. Here's
what's left:

### 1. **Install Firebase Package**

```bash
npm install firebase
```

### 2. **Deploy Firestore Security Rules**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **flavor-flow-logistics**
3. Go to **Firestore Database** → **Rules** tab
4. Copy the entire content of `src/integrations/firebase/firestore.rules`
5. Paste it into the Firebase Console Rules editor
6. Click **Publish**

### 3. **Create Collections in Firestore (Optional)**

Firestore will auto-create collections when you first write to them. However,
you can manually create them:

1. Go to **Firestore Database** → **Start Collection**
2. Create collections:
   - `products`
   - `orders`
   - `user_roles`

### 4. **Create First Admin User**

1. Go to **Authentication** → **Users** tab
2. Click **Add User**
3. Enter email and password (e.g., admin@example.com)
4. Click **Add User**
5. Copy the **UID** from the user list

### 5. **Link Admin User to Role**

1. Go to **Firestore Database** → **Collections**
2. Create collection: `user_roles`
3. Create a **New Document**
4. Set Document ID to the UID you copied (paste the exact UID)
5. Add field:
   - Field name: `role`
   - Value: `admin`
6. Click **Save**

### 6. **Install Dependencies & Start**

```bash
npm install
npm run dev
```

Your app should now start at `http://localhost:5173`

---

## ✅ Quick Start Recap

| Step                  | Status     | What to do                              |
| --------------------- | ---------- | --------------------------------------- |
| Firebase Project      | ✅ Done    | Your project is ready                   |
| Environment Variables | ✅ Done    | `.env.local` is configured              |
| Install Firebase SDK  | ⏳ Pending | `npm install firebase`                  |
| Deploy Security Rules | ⏳ Pending | Copy rules to Firebase Console          |
| Create Admin User     | ⏳ Pending | Add user in Authentication tab          |
| Link Admin Role       | ⏳ Pending | Add document in `user_roles` collection |
| Start Development     | ⏳ Pending | `npm run dev`                           |

---

## 🧪 Testing Your Setup

Once you complete all steps:

1. **Test Login**: Go to Admin page, sign in with your admin credentials
2. **Test Products Page**: Should load products (empty initially)
3. **Test Product CRUD**: Create/edit/delete a product
4. **Test Dashboard**: Should show product and order stats

---

## 🚀 Next Steps: Firebase Setup

### 1. **Install Firebase Package**

```bash
npm install firebase
```

### 2. **Create Firebase Project**

- Go to https://console.firebase.google.com
- Click "Create Project"
- Name it `flavor-flow-logistics` (or your preferred name)
- Accept Google Analytics (optional)

---

## 🗑️ Clean Up: Remove Supabase

After verifying Firebase is working:

### 1. **Remove Supabase Package**

```bash
npm uninstall @supabase/supabase-js
```

### 2. **Remove Supabase Directory**

Delete the folder: `src/integrations/supabase/`

### 3. **Remove from package.json**

Already removed by npm uninstall, but verify no `@supabase/*` packages remain:

```bash
npm ls | grep supabase
```

### 4. **Remove Supabase Config Files**

- Delete `supabase/` directory (locally stored config)
- Remove `.env` references to Supabase (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

---

## ⚙️ Verification Checklist

**Setup Progress:**

- [x] Firebase project created and configured
- [x] Environment variables configured in `.env.local`
- [x] Code migrated to Firebase
- [ ] Firebase SDK installed (`npm install firebase`)
- [ ] Security rules deployed to Firestore
- [ ] Collections created: products, orders, user_roles
- [ ] First admin user created in Authentication
- [ ] Admin user linked to role in Firestore
- [ ] `npm run dev` works without errors
- [ ] Can sign in to admin dashboard
- [ ] Can view products page
- [ ] Can create, update, delete products (as admin)
- [ ] Can manage orders (as admin)
- [ ] Can add product image URLs
- [ ] All console errors are resolved

---

## 🔒 Security Notes

### Authentication

- **Private User Data**: Only users can view their own roles
- **Admin Operations**: Only admins can create/update/delete products and manage
  orders
- **Public Data**: Products are readable by anyone; active products appear on
  homepage

### Image Management

- Images are stored as URLs, not in cloud storage
- Admins can paste image URLs directly when managing products
- Supports external URLs or local image paths

### Firestore Rules

See `src/integrations/firebase/firestore.rules` for complete rule definitions

---

## 📝 Key Differences: Supabase → Firebase

| Feature           | Supabase         | Firebase                         |
| ----------------- | ---------------- | -------------------------------- |
| **Database**      | PostgreSQL (SQL) | Firestore (NoSQL)                |
| **Query Syntax**  | `.select().eq()` | `.where().get()`                 |
| **Relationships** | Foreign keys     | References/Subcollections        |
| **Real-time**     | Subscriptions    | Listeners (built-in)             |
| **Scaling**       | Vertical         | Automatic horizontal             |
| **Cost**          | Usage-based      | Usage-based (pay-per-read/write) |

---

## 🆘 Troubleshooting

### "Firebase is not configured"

- Check `.env.local` has all required variables
- Restart dev server: `npm run dev`

### "Permission denied" on product operations

- Verify user has admin role in Firestore `user_roles/{uid}` document
- Check security rules are deployed correctly

### "Image not loading"

- Verify the image URL is correct and accessible
- Check that the URL is publicly available (if external)
- For local paths, ensure they're properly formatted

### "Cannot read property of undefined"

- Make sure Firestore documents exist (e.g., `user_roles/{uid}`)
- Check data structure matches types in `src/integrations/firebase/types.ts`

---

## 📚 Resources

- Firebase Docs: https://firebase.google.com/docs
- Firestore Guide: https://firebase.google.com/docs/firestore
- Firebase Auth: https://firebase.google.com/docs/auth
- Firebase Storage: https://firebase.google.com/docs/storage
