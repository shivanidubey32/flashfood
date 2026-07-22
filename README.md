# FlashFood 🍔🥗

**FlashFood** is a hyper-local, real-time marketplace web application built to combat food waste and improve food affordability. It connects local merchants (restaurants, cafes, bakeries) who have surplus, unsold food with customers who want to purchase high-quality meals at steep discounts before closing time.

![FlashFood Live Demo](https://img.shields.io/badge/Live_Demo-Available-success?style=for-the-badge)

## 🌐 Live Demo
The application is currently live! Check it out here:
**[https://flashfood-o1tm.onrender.com](https://flashfood-o1tm.onrender.com)**

---

## 🎯 Problem Statement & Solution

**The Problem:** Every single day, local eateries are forced to throw away perfectly good surplus food, resulting in massive environmental harm and lost revenue. Meanwhile, many people in the community struggle to find affordable, high-quality meals. 

**The Solution:** FlashFood provides a dual-sided marketplace. 
1. **Merchants** can quickly snap a photo of surplus inventory, set a discounted price, and list it on the platform.
2. **Customers** can browse local deals on an interactive map, purchase food at a massive discount, and rescue it from the landfill.

---

## 🛠️ Tech Stack (MERN)

FlashFood is a Full-Stack application built using the **MERN** stack and modern web development tools.

* **Frontend:** React.js (via Vite), Tailwind CSS, Framer Motion (for fluid animations), React Router, and React-Leaflet (for interactive maps).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB & Mongoose (ODM).
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt (password hashing).
* **Image Hosting:** Cloudinary (via multer-storage-cloudinary).
* **Deployment:** Hosted monolithically on Render.

---

## ✨ Key Features

* **Role-Based Dashboards:** Separate, tailored experiences for Customers and Merchants.
* **Interactive Map View:** Customers can discover surplus food deals near their physical location using Leaflet.js.
* **Real-time Image Uploads:** Merchants can upload photos of their food securely to Cloudinary.
* **Review System:** Customers can leave food-specific 5-star ratings and reviews on items they've purchased.
* **Order Management:** Secure checkout process with unique QR code generation for safe, in-store pickup verification.

---

## 🚀 Running the Project Locally

If you would like to run this project on your own machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivanidubey32/flashfood.git
   cd flashfood
   ```

2. **Install Dependencies**
   ```bash
   npm run install-all
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your private keys (Use `.env.example` as a template):
   ```env
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the Development Servers**
   Open two terminals.
   
   *Terminal 1 (Backend):*
   ```bash
   cd backend
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   cd frontend
   npm run dev
   ```

---
*Created as a Final Year Academic Project to demonstrate Full-Stack Engineering capabilities.*
