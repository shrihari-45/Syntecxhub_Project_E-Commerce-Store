# ShopHub Full-Stack E-Commerce Platform

> **Full-Stack Web Application**  
> Built with **React.js (Vite)**, **Python (Flask REST API)**, **MongoDB**, and **JWT Authentication**.

---

## 🌟 Overview

The **ShopHub Store** is a modern, production-grade e-commerce web platform inspired by industry leaders such as Amazon, Myntra, and Shopify. It features a responsive UI with deep royal blue and electric indigo accents, clean white surfaces, micro-animations, robust server-side stock validation, real-time MongoDB persistence, and an administrative management dashboard.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, JavaScript (ES6+), HTML5, Vanilla CSS3 (Custom Design Tokens), Lucide Icons |
| **Backend** | Python 3, Flask, Flask-CORS, PyJWT, Werkzeug Security, Python-Dotenv |
| **Database** | MongoDB (PyMongo) with transparent local disk-backed mock failover (`mongomock`) |
| **Authentication** | JSON Web Tokens (JWT) with PBKDF2:SHA256 password hashing |
| **State Management**| React Context API (`AuthContext`, `CartContext`, `ToastContext`) |

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Hero & Promotional Showcase**: Promotional hero banner, limited-time flash discount callouts, and trust badges (Free Shipping, Secure Checkout, 30-Day Returns).
- **Responsive Navigation**: Header with logo, Home, Shop, Categories, About, Contact, live search, cart counter badge, and user account menu.
- **Product Catalog & Filters**:
  - Full-text search across product titles and descriptions.
  - Multi-category filtering (Electronics, Fashion, Home & Kitchen, Beauty & Wellness, Audio & Wearables).
  - Dynamic price range filter (Min & Max).
  - Customer rating filter (4★ & above).
  - In-stock availability filter.
  - Sorting by: Featured, Price (Low to High), Price (High to Low), Rating, and Name (A to Z).
- **Product Details Page**:
  - High-resolution product images, discount tags, and stock indicators.
  - Technical specifications table.
  - Verified customer reviews tab.
  - Quantity picker with stock boundaries.
  - "Add to Cart" and express "Buy Now" workflows.
  - Related product recommendations.
- **Shopping Cart**:
  - Slide-in quick cart drawer + full detailed cart page.
  - Real-time subtotal calculation and free shipping threshold tracker.
  - Promo code engine (`SAVE10` for 10% off, `WELCOME20` for 20% off).
  - Persistent cart storage in `localStorage`.
- **Checkout & Order Placement**:
  - Multi-step checkout with recipient shipping address validation.
  - Delivery speed selector (Standard Free Shipping vs. Express Priority).
  - Simulated credit card and cash-on-delivery payment modes.
  - Server-side stock deduction and server-calculated price verification.
  - Instant Order Confirmation screen with unique Order Reference ID.
- **Order History & Real-Time Tracking**:
  - Customer orders page (`/orders`) with order status badges: *Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*.
  - Visual 4-stage tracking timeline bar.

### 🛡️ Administrator Backoffice Console
- **Role-Based Authorization**: Protected backend endpoints requiring `role: "admin"` in JWT claims.
- **Analytics & KPI Dashboard**:
  - Total Revenue ($), Total Orders, Total Products in Catalog, Registered Customers.
- **Product Catalog Management (CRUD)**:
  - Add new products with title, category, price, original price, stock, image URL, and description.
  - Edit existing products with live form validation.
  - Delete products with safe modal confirmation.
  - Low stock warning indicators for items with $\le 5$ units.
- **Order Management & Fulfillment**:
  - View all customer orders with customer email, item list, and total amount.
  - Search orders by reference ID, customer name, or email.
  - Filter orders by fulfillment status.
  - Live status selector (*Pending* $\rightarrow$ *Processing* $\rightarrow$ *Shipped* $\rightarrow$ *Delivered* $\rightarrow$ *Cancelled*) with immediate MongoDB persistence.
- **Customer Directory**: View registered customer profiles, emails, joined dates, and lifetime order counts.

---

## 🔒 Security & Data Integrity

1. **Server-Side Price Calculation**: Product prices and order totals submitted by the client are strictly ignored and computed directly from MongoDB records.
2. **Stock Verification**: Checkout requests verify available warehouse stock before order placement, deducting units atomically.
3. **Password Hashing**: Uses `werkzeug.security.generate_password_hash` with PBKDF2:SHA256 salt-hashing; passwords are never stored in plaintext.
4. **Token Expiration**: JWT tokens expire after 72 hours, with claim validation on every authenticated request.
5. **Authorization Enforcement**: Customers are blocked with `403 Forbidden` from accessing administrative routes or orders belonging to other users.

---

## 📁 Project Structure

```
ecommerce-store/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation header with live search & cart badge
│   │   │   ├── Footer.jsx              # Footer with brand links & social icons
│   │   │   ├── HeroBanner.jsx          # Promotional banner with CTA buttons
│   │   │   ├── ProductCard.jsx         # Card with discount tag, rating, stock status
│   │   │   ├── ProductFilter.jsx       # Category, price range, and rating filters
│   │   │   ├── CartDrawer.jsx          # Slide-over shopping cart drawer
│   │   │   ├── AuthModal.jsx           # Sign in & registration modal with demo fill
│   │   │   └── AdminProductModal.jsx   # Add/Edit product modal for admins
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Landing page with hero & featured deals
│   │   │   ├── ShopPage.jsx            # Full product catalog with filters & sorting
│   │   │   ├── ProductDetailPage.jsx   # Detailed view with specs & reviews
│   │   │   ├── CartPage.jsx            # Full cart page with promo code validator
│   │   │   ├── CheckoutPage.jsx        # Shipping form & demo payment simulation
│   │   │   ├── OrderSuccessPage.jsx    # Receipt with Order ID confirmation
│   │   │   ├── MyOrdersPage.jsx        # Customer order history & timeline tracker
│   │   │   ├── AdminDashboardPage.jsx  # Admin analytics, CRUD, and status updater
│   │   │   ├── AboutPage.jsx           # Architecture & internship overview
│   │   │   └── ContactPage.jsx         # Customer support form
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # JWT session, login, register, roles
│   │   │   ├── CartContext.jsx         # Cart state, quantities, localStorage
│   │   │   └── ToastContext.jsx        # Toast notification system
│   │   ├── services/
│   │   │   └── api.js                  # Centralized HTTP client with JWT injection
│   │   ├── App.jsx                     # Root application coordinator
│   │   ├── main.jsx                    # React entrypoint
│   │   └── index.css                   # Custom CSS tokens & design system
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── index.html
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py                 # Register, login, current user profile
│   │   │   ├── products.py             # Product catalog, search, filter, CRUD
│   │   │   ├── orders.py               # Checkout, stock deduction, my orders
│   │   │   └── admin.py                # Dashboard stats, order status, users
│   │   ├── models/
│   │   │   ├── user.py                 # User document schema & validation
│   │   │   ├── product.py              # Product document schema & validation
│   │   │   └── order.py                # Order document schema & validation
│   │   ├── middleware/
│   │   │   └── auth.py                 # JWT token_required & admin_required guards
│   │   ├── services/
│   │   │   └── db.py                   # MongoDB connector with auto-failover mock
│   │   └── utils/
│   │       ├── auth_helper.py          # Password hashing & JWT encoder
│   │       ├── serializers.py          # BSON ObjectId to JSON converter
│   │       └── responses.py            # Standardized API response formatters
│   ├── config.py                       # App configuration & environment loader
│   ├── run.py                          # Flask development entrypoint
│   ├── seed.py                         # Realistic database seeder
│   ├── test_api_flow.py                # Automated 7-step API test suite
│   ├── requirements.txt                # Python dependencies
│   └── .env.example                    # Backend environment template
├── .gitignore
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher) & **npm**
- **Python** (v3.10 or higher) & **pip**
- *(Optional)* **MongoDB Community Server** running on `mongodb://localhost:27017` or a MongoDB Atlas URI. If MongoDB is not running locally, the backend automatically activates a high-performance, disk-persisted mock database so the store runs 100% out-of-the-box!

---

### 2. Backend Setup

1. Open your terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   ```bash
   # Copy the example file to .env
   cp .env.example .env
   ```
4. Seed the database with sample products, admin, and customer users:
   ```bash
   python seed.py
   ```
5. Start the Flask server:
   ```bash
   python run.py
   ```
   *The API will start running at `http://127.0.0.1:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   # Copy the example file to .env
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://127.0.0.1:5173`.*

---

## 🔑 Demo Test Credentials

To simplify grading and reviewer evaluation, the login dialog includes **1-Click Fast-Fill buttons**:

| Account Type | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@shophub.com` | `Admin@123` | Full Admin Dashboard, Product CRUD, Order Status Controls |
| **Customer** | `alex@example.com` | `Customer@123` | Browsing, Cart, Checkout, Personal Order History |
| **Customer 2** | `sarah@example.com` | `Customer@123` | Browsing, Cart, Checkout, Personal Order History |

---

## 🎟️ Demo Promo Codes

During checkout or in the cart page, test coupons can be applied:
- `SAVE10` $\rightarrow$ **10% Discount** on subtotal
- `WELCOME20` $\rightarrow$ **20% Discount** on subtotal

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer account
- `POST /api/auth/login` — Authenticate and receive a signed JWT token
- `GET /api/auth/me` — Fetch currently authenticated user profile *(Requires JWT)*

### Products (`/api/products`)
- `GET /api/products` — Retrieve paginated products with search, category, price, and rating filters
- `GET /api/products/categories` — List distinct categories with product counts
- `GET /api/products/<id>` — Retrieve full details for a single product
- `POST /api/products` — Create a new product *(Admin only)*
- `PUT /api/products/<id>` — Update an existing product *(Admin only)*
- `DELETE /api/products/<id>` — Delete a product *(Admin only)*

### Orders (`/api/orders`)
- `POST /api/orders` — Validate stock, calculate totals, and place order *(Requires JWT)*
- `GET /api/orders/my-orders` — Retrieve past orders for current customer *(Requires JWT)*
- `GET /api/orders/<id>` — Retrieve detailed order summary *(Customer or Admin)*

### Administration (`/api/admin`)
- `GET /api/admin/dashboard` — Get total revenue, order count, product count, and customer metrics *(Admin only)*
- `GET /api/admin/orders` — List and filter all store customer orders *(Admin only)*
- `PUT /api/admin/orders/<id>/status` — Update order fulfillment status *(Admin only)*
- `GET /api/admin/users` — List registered customers and order statistics *(Admin only)*

---

## 🧪 Automated Verification Suite

Run the automated integration test script to verify all 7 core flows and security boundaries:

```bash
python backend/test_api_flow.py
```

Expected output:
```
[*] Starting ShopHub API Integration Verification...
[TEST 1/7 PASS] Backend health verified: 200 OK.
[TEST 2/7 PASS] Catalog products retrieved: Apple MacBook Pro 14 M3 Chip... ($1599.0)
[TEST 3/7 PASS] Customer login verified (Token issued, User: Alex Johnson).
[TEST 4/7 PASS] Admin login verified (Role: admin).
[TEST 5/7 PASS] Role authorization verified: customer received 403 Forbidden on admin endpoint.
[TEST 6/7 PASS] Customer order created in DB! ID: 66..., Server Total: $...
[TEST 7/7 PASS] Admin updated order status in DB to: Shipped

>>> ALL 7 AUTOMATED INTEGRATION TESTS COMPLETED WITH 100% SUCCESS! <<<
```

---

## 📄 License & Attribution

Designed and engineered as a complete full-stack portfolio e-commerce platform.
