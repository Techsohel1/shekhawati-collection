# Shekhawati Collection — Premium International E-Commerce Platform

A luxurious, high-performance, and feature-rich MERN stack e-commerce web platform custom built for **Shekhawati Collection**. The application targets high-end audiences across the **USA, UK, Europe, Canada, and Australia**, using a Cream + White + Gold + Maroon color palette and premium serif typography.

---

## Architectural Highlights

- **Dual-Database Adapter (`db.js`)**: Plug-and-play capability. If `MONGODB_URI` is specified in a `.env` file, the server connects to MongoDB. If not, it falls back to an **offline local JSON file database** inside `backend/data/`, allowing instant out-of-the-box local runs with zero configuration!
- **AI-Powered Dropdown Search**: Real-time autocomplete suggestions matching titles and categories as you type in the header.
- **Dynamic Multi-Currency Switcher**: Active rates updates (USD, GBP, EUR, CAD, AUD) that instantly convert and symbol-format prices across the home listings, filter dashboards, detail specifications, cart totals, and invoices.
- **Specification Comparison Sheet**: Expandable slide-up compare tray letting buyers align technical specs, ratings, pricing, and stock status for up to 3 products.
- **Reward Loyalty Points**: Customer purchases award points (1 point per $10 USD spent) which can be redeemed at checkout for discounts ($0.10 per point).
- **Client Relations Live Chat**: Inline support bubble powered by keywords answering shipping, return, and catalog policies.
- **Printable Invoice Downloads**: Complete invoice builder rendering customer billing blocks, line-item summaries, and logistics tracking codes.
- **Admin Control Console**: Metric panels, shipping status changes (`Ordered` -> `Processing` -> `Shipped` -> `Out for Delivery` -> `Delivered`), catalog CRUD, and coupon spawning.

---

## Setup & Launch Guide

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16+) installed.

### 2. Seeding & Launching Backend Server
Open your terminal in the root directory:
```bash
# Navigate to backend
cd backend

# Install dependencies (Express, CORS, JWT, BcryptJS, Mongoose)
npm install

# (Optional) If you have a MongoDB Atlas connection, add MONGODB_URI in a .env file:
# MONGODB_URI=mongodb+srv://...

# Seed initial database (creates 12 luxury products, promo coupons, and Admin profile)
npm run seed

# Start Express server (runs on http://localhost:5000)
npm start
```

### 3. Launching React Client
Open a second terminal window in the root directory:
```bash
# Navigate to frontend
cd frontend

# Install client packages (React 19, Vite, React Router, Lucide Icons)
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## Testing Credentials

| Account Role | Email Address | Password | Privileges |
|---|---|---|---|
| **Store Owner (Admin)** | `shekhawaticollection@gmail.com` | `AdminPassword123` | Full access to Admin Console in Profile tab |
| **New Registrations** | *Create any user* | *Any password* | Profile wishlist, order history, loyalty points |

---

## Checkout & Payment Mockups
- Choose **Stripe / Cards** payment on checkout.
- Fill standard mock details (e.g. Visa card number `4242 4242 4242 4242`, Expiry `12/28`, CVV `123`).
- On successful placement, click **Download Invoice** to review receipt or save as PDF.
- Copy the tracking number (e.g., `SC-TRACK-XXXXXX`), head over to the **Track Order** page, and search to check shipping progress.
