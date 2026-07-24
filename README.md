# ⌚ Shiv Watch Store

> A modern, responsive e-commerce web application for premium timepieces, crafted with React 18, Vite, and Framer Motion.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)

---

## 📌 Project Overview

**Shiv Watch Store** is a full-featured e-commerce platform designed to offer a seamless shopping experience for watch enthusiasts. Users can explore a realistic catalog of 28 luxury, sport, casual, and smart watches, filter products dynamically, inspect detailed specifications, manage shopping carts and wishlists, and place orders with local persistence.

---

## ✨ Features

- 🛍️ **Realistic Product Catalog**: Browse 28 well-known watch brands (Rolex, Titan, Fossil, Casio, Seiko, Apple, Omega, Tissot, and more).
- 🔍 **Dynamic Filtering & Search**: Instant text search, category-based filtering (*Luxury*, *Sport*, *Casual*, *Smart*), price range controls, and price sorting.
- 👁️ **Quick View & Product Detail**: Modal quick view and detailed product pages featuring multi-image galleries, ratings, and customer reviews.
- 🛒 **Persistent Cart & Wishlist**: User-isolated state management powered by LocalStorage for adding, updating quantities, and removing items.
- 📦 **Checkout & Order Management**: Real-time order creation, item summary calculation, and status tracking.
- 🔐 **User Authentication**: Login and registration system supporting guest and user-specific data isolation.
- 🎨 **Responsive & Micro-Animated UI**: Optimized layout across mobile, tablet, and desktop screens with smooth Framer Motion animations and custom toast alerts.

---

## 🛠️ Technologies Used

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://reactjs.org/) |
| **Build Tool & Dev Server** | [Vite 5](https://vitejs.dev/) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Styling** | Vanilla CSS (CSS Grid, Flexbox, Custom Variables) |
| **Data Storage** | Browser LocalStorage API |

---

## 🖼️ Screenshots

> *Placeholder image paths — replace with actual app screenshots.*

| Home Showcase | Shop Catalog |
| :---: | :---: |
| `![Home Page](docs/screenshots/home.png)` | `![Shop Page](docs/screenshots/shop.png)` |

| Product View | Cart & Checkout |
| :---: | :---: |
| `![Product Page](docs/screenshots/product.png)` | `![Cart Page](docs/screenshots/cart.png)` |

---

## ⚙️ Installation & Running Locally

Follow these steps to set up the project locally on your machine:

### Prerequisites
- Node.js (v16.x or higher)
- npm (v8.x or higher)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pavanporiya/shiv-watch-store.git
   cd shiv-watch-store
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## 🔄 CRUD Functionality

The application implements full CRUD operations client-side via LocalStorage:

- **Create**:
  - Add items to Shopping Cart (`addToCartHelper`)
  - Save items to Wishlist (`addToWishlistHelper`)
  - Generate new Customer Orders (`createOrderHelper`)
- **Read**:
  - Load product catalog from structured `products.json`
  - Retrieve user cart, wishlist items, and order history from LocalStorage
- **Update**:
  - Increment / decrement product quantities in Cart (`updateCartQtyHelper`)
  - Update user authentication session state
- **Delete**:
  - Remove specific products from Cart (`removeFromCartHelper`)
  - Remove items from Wishlist (`removeFromWishlistHelper`)
  - Clear entire cart upon successful order placement

---

## 📱 Responsive Design

Shiv Watch Store is engineered with a mobile-first responsive design strategy:

- **Mobile (320px – 480px)**: Single-column grid layouts, touch-friendly buttons, compact navigation drawer, and collapsible filter accordions.
- **Tablet (768px – 1024px)**: 2-to-3 column product grids, responsive sidebars, and adaptive typography.
- **Desktop (1024px+)**: Full multi-column shop layout, sticky sidebars, high-resolution hero banners, and side-by-side product galleries.

---

## 📁 Folder Structure

```
shiv-watch-store/
├── public/
│   ├── favicon.ico
│   └── images/               # Local product & showcase assets
├── src/
│   ├── components/           # Reusable UI components (Navbar, Toast, Reveal, etc.)
│   ├── data/
│   │   └── products.json     # 28 realistic product records with full attributes
│   ├── pages/                # Page views (Home, Shop, Product, Cart, Orders, Auth)
│   ├── styles/               # Component-level & global CSS files
│   ├── utils/
│   │   └── storage.js        # LocalStorage CRUD helper functions
│   ├── App.jsx               # Application root & route definitions
│   └── main.jsx              # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Future Improvements

- [ ] **Backend Integration**: Connect to a Node.js / Express backend with MongoDB database storage.
- [ ] **Payment Gateway**: Integrate Stripe or Razorpay for live test payments.
- [ ] **Advanced Filtering**: Add filter by watch movements (Automatic, Quartz, Solar) and case diameter.
- [ ] **User Reviews & Ratings**: Allow authenticated users to submit star ratings and text reviews.
- [ ] **Dark Mode Toggle**: System-wide theme switcher between Light and Dark mode.

---

## 👤 Author

**Pavan Poriya**
- GitHub: [@pavanporiya](https://github.com/pavanporiya)
- Project Repository: [shiv-watch-store](https://github.com/pavanporiya/shiv-watch-store)
