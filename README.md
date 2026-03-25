# Jimmela — Snack E-Commerce Platform

## Overview

Jimmela is a full-stack snack e-commerce platform built with **React + TypeScript + Firebase**. It features a public-facing storefront for customers and a comprehensive admin dashboard for business operations.

---

## 🌐 Public Website (Client Side)

The customer-facing website is a single-page application designed to showcase products and drive sales.

### Pages & Sections

| Section | Description |
|---------|-------------|
| **Hero** | Eye-catching landing banner with brand messaging and call-to-action |
| **Products** | Browsable product catalog with categories, flavors, and pricing |
| **Franchise** | Information section for potential franchise partners |
| **Contact** | Contact form for customer inquiries (integrated with email) |
| **Footer** | Business links, social media, and brand info |
| **WhatsApp Button** | Floating button for instant customer support via WhatsApp |

### Key Features
- Responsive design (mobile, tablet, desktop)
- Product cards with images, descriptions, pricing, and flavor options
- Smooth scroll navigation between sections
- SEO-optimized with semantic HTML

---

## 🔒 Admin Dashboard (Tracking & Management)

The admin side is a protected multi-page dashboard accessible only to authenticated administrators.

### Authentication
- Firebase Authentication (email/password)
- Role-based access control via Firestore `user_roles` collection
- Protected routes — unauthorized users are redirected to the login page

### Admin Pages

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/admin` | Overview with key metrics and quick stats |
| **Products** | `/admin/products` | Full CRUD for product catalog (name, price, stock, flavors, category, image) |
| **Orders** | `/admin/orders` | View, filter, and manage customer orders; CSV import support |
| **Tracking** | `/admin/tracking` | Inventory monitoring + delivery lifecycle management |
| **Settings** | `/admin/settings` | Admin account and app configuration |

### Tracking System (Detail)

The tracking page is split into two tabs:

#### 📦 Inventory Tab
- **Stock summary cards**: In Stock / Low Stock / Out of Stock counts
- **Low stock alerts**: Banner warning when products fall below 50 packs or hit zero
- **Product table**: Sortable list showing product name, category, flavors, current stock, status badge, and price
- **Category filters**: Filter inventory by product category
- **Search**: Find products by name
- **Bulk stock update**: Enter edit mode to update stock levels for multiple products at once

#### 🚚 Delivery Tab
- **Delivery summary cards**: Processing / In Transit / Delivered counts
- **Order table**: Lists all active orders with customer info, address, total, status, tracking number, and courier
- **Ship order flow**: Dialog to add tracking number and courier details, then mark as "Shipped"
- **Mark delivered**: One-click button to mark shipped orders as "Delivered" with timestamp
- **Status badges**: Color-coded (amber → Processing, blue → Shipped, green → Delivered)

---

## 🗄️ Database Schema (Firebase Firestore)

### Collections

#### `products`
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Product name |
| `category` | string | Product category |
| `description` | string | Product description |
| `price` | number | Price in PHP (₱) |
| `stock` | number | Current stock in packs |
| `flavors` | string[] | Available flavors |
| `imageUrl` | string | Product image URL |
| `isActive` | boolean | Whether product is visible |
| `createdAt` | timestamp | Creation date |
| `updatedAt` | timestamp | Last update date |

#### `orders`
| Field | Type | Description |
|-------|------|-------------|
| `customerName` | string | Customer full name |
| `customerEmail` | string | Customer email |
| `customerPhone` | string | Customer phone number |
| `customerAddress` | string | Delivery address |
| `items` | array | List of ordered items (productId, name, qty, price, flavor) |
| `total` | number | Order total in PHP |
| `status` | string | Pending → Processing → Shipped → Delivered / Cancelled |
| `trackingNumber` | string \| null | Courier tracking number |
| `courier` | string \| null | Courier name (e.g. J&T, LBC) |
| `shippedAt` | timestamp \| null | When order was shipped |
| `deliveredAt` | timestamp \| null | When order was delivered |
| `notes` | string \| null | Admin notes |
| `createdAt` | timestamp | Order creation date |
| `updatedAt` | timestamp | Last update date |

#### `user_roles`
| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Firebase Auth user ID |
| `role` | string | `admin` or `user` |
| `createdAt` | timestamp | Role assignment date |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State | TanStack React Query |
| Routing | React Router v6 |
| Backend | Firebase (Auth, Firestore) |
| Icons | Lucide React |
| Notifications | Sonner (toast) |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   ├── Navbar.tsx        # Navigation bar
│   ├── HeroSection.tsx   # Landing hero
│   ├── ProductsSection.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   └── WhatsAppButton.tsx
├── contexts/
│   └── AuthContext.tsx   # Firebase auth state provider
├── integrations/
│   └── firebase/
│       ├── config.ts     # Firebase app initialization
│       ├── firestore.ts  # Firestore CRUD operations
│       └── types.ts      # TypeScript interfaces
├── pages/
│   ├── Index.tsx         # Public homepage
│   ├── AdminLogin.tsx    # Admin login page
│   ├── AdminLayout.tsx   # Dashboard shell with sidebar
│   ├── AdminDashboard.tsx
│   ├── AdminProducts.tsx # Product CRUD
│   ├── AdminOrders.tsx   # Order management
│   ├── AdminTracking.tsx # Inventory + delivery tracking
│   └── AdminSettings.tsx
└── data/
    └── products.ts       # Static product data (fallback)
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Requires Firebase environment variables in `.env`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
