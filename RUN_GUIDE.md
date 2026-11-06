# 🚀 Stitch | Vortex Labs — Full Stack Run Guide

This guide explains how to run both the **Backend API** and the **Frontend Web Application** together.

---

## ⚡ Quick Start (Currently Running!)

The unified server is **already active and running** right now:

- 🌐 **Frontend Storefront**: [http://localhost:5000](http://localhost:5000)
- 📡 **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- 🩺 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📋 Table of Contents
1. [Project Directory Architecture](#1-project-directory-architecture)
2. [Method 1: Run Together (Recommended - Unified Server)](#2-method-1-run-together-recommended)
3. [Method 2: Run Separately (Independent Dev Servers)](#3-method-2-run-separately)
4. [Page Directory & Navigation URLs](#4-page-directory--navigation-urls)
5. [Backend API Endpoints](#5-backend-api-endpoints)
6. [Database (Optional MongoDB Setup)](#6-database-optional-mongodb-setup)

---

## 1. Project Directory Architecture

```
stitch_gym_supplements_e_commerce_platform/
├── package.json              ← Root script runner
├── RUN_GUIDE.md              ← This manual
│
├── frontend/                 ← HTML5 / CSS3 / Vanilla JS Client
│   ├── index.html            ← Storefront & Hero Showcase
│   ├── products.html         ← Full Catalog with category filters & sorting
│   ├── product_detail.html   ← ISO Matrix detail, nutrition & reviews
│   ├── cart.html             ← Interactive Cart & Fast Pay checkout
│   ├── biometric.html        ← BMR / TDEE calculator & stack advisor
│   ├── interactive_catalog.html ← 3D category explorer & quick view
│   ├── styles.css            ← Shared athletic cyber aesthetic design system
│   └── script.js             ← Cart state & API client integrations
│
└── backend/                  ← Node.js + Express REST API
    ├── package.json          ← Backend dependencies & scripts
    ├── .env                  ← Environment variables (PORT, JWT_SECRET, etc.)
    └── src/
        ├── server.js         ← Server entry point & listener
        ├── app.js            ← Express app, CORS, rate-limiting & static hosting
        ├── config/
        │   ├── db.js         ← MongoDB connection with auto-fallback
        │   └── data.js       ← Seed catalog with 8 products (in-memory mode)
        ├── models/           ← Mongoose schemas (User, Product, Cart, Order)
        ├── routes/           ← Auth, Products, Cart, Orders, Users, Biometric
        ├── controllers/      ← Request business logic
        └── middleware/       ← JWT authentication & authorization
```

---

## 2. Method 1: Run Together (Recommended)

The Express backend includes built-in static file hosting for the `frontend/` directory. One command serves **both** the client web app and the REST API on port `5000` with zero CORS hurdles.

### Step 1: Open Terminal in the Project Root
```bash
cd "c:\Users\Yogesh Kumar\Desktop\stitch_gym_supplements_e_commerce_platform"
```

### Step 2: Install Backend Dependencies (First Time Only)
```bash
npm run install:all
```

### Step 3: Start the Full Stack Server
```bash
npm start
```
*(Or `npm run dev` to start with nodemon if installed)*

### Step 4: Open in Your Browser
Open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 3. Method 2: Run Separately

If you prefer running a dedicated frontend server (e.g., VS Code Live Server or `serve`) alongside the Node.js API:

### Terminal 1: Backend API
```bash
cd backend
npm run dev
```
> The API will be listening on `http://localhost:5000/api`

### Terminal 2: Frontend Local Server
You can use any of the following:

- **Using VS Code Live Server**: Right-click `frontend/index.html` → *Open with Live Server* (`http://127.0.0.1:5500`)
- **Using npx serve**:
  ```bash
  npx serve frontend -p 3000
  ```
  Then open `http://localhost:3000`.

*(CORS in `backend/src/app.js` is already pre-configured to accept requests from ports `5500`, `3000`, `5000`, and `null` file origins).*

---

## 4. Page Directory & Navigation URLs

When running on `http://localhost:5000`:

| Page | URL | Description |
|------|-----|-------------|
| **Home / Storefront** | [http://localhost:5000/](http://localhost:5000/) | Hero section, featured supplements, trust badges |
| **Product Catalog** | [http://localhost:5000/products.html](http://localhost:5000/products.html) | All 8 supplement formulations, price filters, category tabs |
| **Product Detail** | [http://localhost:5000/product_detail.html](http://localhost:5000/product_detail.html) | Size/flavour picker, nutrition panel, reviews |
| **Cart & Fast Pay** | [http://localhost:5000/cart.html](http://localhost:5000/cart.html) | Cart items, promo code validator, UPI / Card / COD checkout |
| **Biometric Performance** | [http://localhost:5000/biometric.html](http://localhost:5000/biometric.html) | Interactive BMR, TDEE, Daily Protein Intake calculator |
| **Interactive Catalog** | [http://localhost:5000/interactive_catalog.html](http://localhost:5000/interactive_catalog.html) | Category cards with quick-view modal |

---

## 5. Backend API Endpoints

### Health & System
- `GET /api/health` — Checks if server is alive

### Products
- `GET /api/products` — Retrieve all supplements (supports `?category=Protein&sort=price_asc&search=iso`)
- `GET /api/products/featured` — Retrieve featured products
- `GET /api/products/:id` — Retrieve product details by ID
- `GET /api/products/slug/:slug` — Retrieve product by URL slug

### Cart & Orders
- `GET /api/cart` — Retrieve session / user cart
- `POST /api/cart/add` — Add item (`{ productId, name, price, quantity, flavour, size }`)
- `POST /api/cart/promo` — Validate coupon (`STITCH10`, `VORTEX20`, `FLAT200`, `NEWUSER`)
- `POST /api/orders` — Place order with shipping details & payment method

### Biometric Engine
- `POST /api/biometric/calculate` — Accepts `{ weight, height, age, gender, activityLevel, goal }` and returns computed BMR, TDEE, target calories, and recommended supplement stack.

---

## 6. Database (Optional MongoDB Setup)

The platform is designed to **work out-of-the-box with zero configuration**:
- If MongoDB is not running, it automatically operates in **in-memory mode** using pre-seeded supplement formulations.
- To persist data permanently, install MongoDB locally or use MongoDB Atlas:
  1. Open `backend/.env`
  2. Set `MONGO_URI=mongodb://localhost:27017/stitch_vortex_labs` (or your Atlas connection string)
  3. Restart the server. It will automatically detect and connect to MongoDB.
