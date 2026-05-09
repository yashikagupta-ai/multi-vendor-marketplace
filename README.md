# Multi-Vendor Marketplace

A scalable and production-ready **Multi-Vendor Marketplace Platform** built using the **MERN Stack**. The platform allows multiple independent vendors to manage their own storefronts, products, inventory, and orders while buyers can browse products from different vendors and complete purchases using a unified checkout system.

This project includes secure authentication, vendor management, admin controls, Stripe Connect split payments, commission handling, dispute resolution, analytics dashboards, and JSP-based reporting modules.

---

# 🚀 Features

## 👤 Buyer Features
- User Registration & Login
- JWT Authentication
- Browse Products
- Search & Filter Products
- Product Details Page
- Add to Cart
- Wishlist
- Multi-Vendor Cart
- Unified Checkout
- Order Tracking
- Order History
- Product Reviews & Ratings
- Raise Disputes
- Profile Management

---

## 🏪 Vendor Features
- Vendor Registration & Login
- Vendor Dashboard
- Storefront Management
- Product CRUD Operations
- Inventory Management
- Upload Product Images
- Order Management
- Revenue Analytics
- Stripe Connect Onboarding
- Commission Tracking
- Payout Monitoring
- Respond to Disputes

---

## 🛡️ Admin Features
- Admin Dashboard
- Vendor Approval/Rejection
- Manage Users & Products
- Manage Disputes
- Commission Configuration
- Platform Analytics
- Revenue Monitoring
- User Suspension/Banning
- Sales Reports
- Vendor Payout Approval

---

# 💳 Payment & Commission System

- Stripe Connect Integration
- Split Payments Between Platform & Vendors
- Automatic Commission Deduction
- Vendor Payout Tracking
- Refund Handling
- Transaction Management

---

# ⚖️ Dispute Resolution Module

The platform includes a dispute handling system where:
1. Buyers can raise disputes
2. Vendors can respond
3. Admins mediate and resolve issues

### Dispute Status
- Open
- In Review
- Resolved
- Rejected

---

# 🛠️ Tech Stack

## Frontend
- React JS
- React Router DOM
- Tailwind CSS
- Axios
- Redux Toolkit / Context API
- Framer Motion
- Recharts / Chart.js

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Security
- JWT Authentication
- bcrypt Password Hashing
- Role-Based Access Control
- Helmet
- CORS
- Rate Limiting

## Payments
- Stripe Connect

## Reporting
- JSP & JSTL

## DevOps
- Docker
- Docker Compose

---

# 📂 Project Structure

```bash
multi-vendor-marketplace/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── redux/
│   └── services/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── jsp-module/
│   ├── payout-report.jsp
│   └── commission-summary.jsp
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🔐 Authentication & Authorization

- JWT Access Tokens
- Password Encryption using bcrypt
- Protected Routes
- Role-Based Middleware
- Vendor/Admin Access Control

---

# 🗄️ Database Models

Main MongoDB Collections:
- Users
- Vendors
- Products
- Categories
- Orders
- Payments
- Transactions
- Reviews
- Disputes
- Commission Ledger
- Payouts
- Notifications

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/multi-vendor-marketplace.git
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret

STRIPE_WEBHOOK_SECRET=your_webhook_secret

CLIENT_URL=http://localhost:3000
```

---

# 🐳 Docker Setup

Run the project using Docker:

```bash
docker-compose up --build
```

---

# 🎨 UI Features

- Responsive Design
- Modern Marketplace UI
- Dark Mode
- Smooth Animations
- Reusable Components
- Dashboard Analytics
- Toast Notifications
- Loading Skeletons

---

# 🔒 Security Features

- Helmet Security
- JWT Authentication
- Password Hashing
- CORS Protection
- Input Validation
- Protected APIs
- Rate Limiting

---

# 📈 Future Enhancements

- AI Product Recommendations
- Real-Time Chat System
- Socket.IO Notifications
- Redis Caching
- Elasticsearch Integration
- OTP Authentication
- Cloudinary Image Uploads
- Mobile Application

---

# 👨‍💻 Contributors

- Yashika
- Team Members

---

# 📄 License

This project is developed for academic and educational purposes.

---

# ⭐ Conclusion

The Multi-Vendor Marketplace is a complete full-stack e-commerce platform demonstrating advanced backend architecture, secure payment integration, vendor management, commission handling, and real-world marketplace functionality using modern web technologies.
