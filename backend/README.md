# 🏋️ Stitch | Vortex Labs — Backend API

Node.js + Express REST API for the Stitch Gym Supplements e-commerce platform.

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js              ← Entry point
│   ├── app.js                 ← Express app config
│   ├── config/
│   │   ├── db.js              ← MongoDB connection
│   │   └── data.js            ← In-memory seed data (no-DB fallback)
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   └── order.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── user.routes.js
│   │   └── biometric.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── user.controller.js
│   │   └── biometric.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── utils/
│       └── helpers.js
├── .env                       ← Environment variables (create from .env.example)
├── .env.example
├── package.json
└── README.md
```

## 🚀 Setup & Run

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
# Copy the example env file
copy .env.example .env
# Edit .env as needed (MongoDB URI, JWT secret, etc.)
```

### 3. Start the server

**Development (auto-restart on file changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server starts at → **http://localhost:5000**

---

## 📡 API Endpoints

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user (🔒 auth required) |
| POST | `/api/auth/logout` | Logout |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?category=Protein&sort=price_asc&search=iso`) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/slug/:slug` | Get product by slug |
| POST | `/api/products/:id/reviews` | Add a review (🔒 auth required) |
| POST | `/api/products` | Create product (🔒 admin) |
| PUT | `/api/products/:id` | Update product (🔒 admin) |
| DELETE | `/api/products/:id` | Delete product (🔒 admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart (guest or user) |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/item/:itemId` | Update item quantity |
| DELETE | `/api/cart/item/:itemId` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |
| POST | `/api/cart/promo` | Apply promo code |

**Available Promo Codes:** `STITCH10`, `VORTEX20`, `FLAT200`, `NEWUSER`

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/my-orders` | Get user's orders (🔒 auth) |
| GET | `/api/orders/:id` | Get order by ID |
| PUT | `/api/orders/:id/status` | Update order status (🔒 admin) |

### Biometric
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/biometric/calculate` | Calculate BMR, TDEE, protein needs |
| GET | `/api/biometric/stacks` | Get supplement stacks by goal |

**Calculate body:** `{ weight, height, age, gender, activityLevel, goal }`  
**Goals:** `muscle-gain` | `fat-loss` | `endurance` | `general-health`  
**Activity levels:** `sedentary` | `light` | `moderate` | `active` | `very-active`

---

## 🗄️ MongoDB (Optional)

The server works **without MongoDB** using in-memory data (data resets on restart).

To enable persistent storage:
1. [Install MongoDB Community](https://www.mongodb.com/try/download/community) locally, **or**
2. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
3. Update `MONGO_URI` in your `.env` file

---

## 🔐 Authentication

Protected routes require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

Get the token from `/api/auth/login` or `/api/auth/register`.
