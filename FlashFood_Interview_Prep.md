# FlashFood: Project Summary & Architecture Guide

## 1. Project Summary & Purpose

**What is FlashFood?**
FlashFood is a hyper-local, real-time marketplace web application designed to combat food waste. It connects local merchants (restaurants, cafes, bakeries, and grocery stores) who have surplus, unsold food at the end of the day with customers who want to purchase high-quality meals at a steep discount.

**Why did you build this? (Interview Answer)**
"I built this project to solve a real-world, dual-sided problem: food waste and food affordability. Every day, local eateries are forced to throw away perfectly good surplus food, resulting in lost revenue and environmental harm. FlashFood bridges this gap. I built this to demonstrate my ability to architect a complete Full-Stack application that handles real-world complexities like multi-role user authentication (Merchants vs. Customers), geospatial map data, file uploads, dynamic inventory management, and a seamless, animated user experience."

**Core Use Cases:**
1. **For Merchants:** A bakery has 10 loaves of bread left near closing time. Instead of throwing them away, the merchant snaps a picture and lists them on FlashFood at 70% off. 
2. **For Customers:** A user opens the FlashFood Map View, automatically locates deals near their current GPS location, pays for the discounted food, and receives a secure QR code to verify their pickup at the store.

---

## 2. Technology Stack & Justification

Below is the breakdown of the MERN (MongoDB, Express, React, Node) stack technologies used, and the exact reasons *why* they were chosen.

### Frontend (Client-Side)

* **React.js (via Vite)**
  * **Why:** React allows for a component-driven architecture, making the UI modular, reusable, and easy to maintain. I chose **Vite** over traditional Webpack/Create-React-App because Vite offers incredibly fast Hot Module Replacement (HMR) and optimized build times, significantly speeding up the development cycle.
* **Tailwind CSS**
  * **Why:** Tailwind is a utility-first CSS framework. It allowed me to rapidly build a highly custom, responsive, and modern UI (featuring glassmorphism, soft shadows, and clean layouts) directly inside my JSX without having to manage massive, tangled CSS stylesheets.
* **Framer Motion**
  * **Why:** To make the application feel premium and alive. Framer Motion was used to implement fluid page transitions, modal popups, and micro-interactions (like hovering over food cards). A dynamic UI drastically increases user engagement.
* **React-Leaflet (Leaflet.js)**
  * **Why:** I needed a way to plot merchants on a real-world map so users could discover local deals. Leaflet is a lightweight, open-source mapping library. `react-leaflet` allowed me to seamlessly integrate interactive maps, custom pins, and HTML5 Geolocation directly into React components.
* **Axios**
  * **Why:** Used for making HTTP requests to the backend API. It is preferred over the native `fetch` API because it automatically transforms JSON data and makes it exceptionally easy to configure global "interceptors" (e.g., automatically attaching the JWT authentication token to every request).

### Backend (Server-Side)

* **Node.js & Express.js**
  * **Why:** Node.js allows for writing the backend in JavaScript, keeping the entire stack in a single language. Express.js is a minimal and flexible web framework that makes it incredibly easy to set up RESTful API routes, handle HTTP requests, and manage middleware (like authentication and error handling).
* **MongoDB & Mongoose**
  * **Why:** MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. This is perfect for a fast-paced project where data schemas (like adding a 'coordinates' field to a user) might evolve. **Mongoose** was used as an ODM (Object Data Modeling) library to enforce strict schemas, validate data (e.g., ensuring ratings are between 1 and 5), and easily populate relationships (like linking a Review to a specific Food Listing and User).
* **JSON Web Tokens (JWT)**
  * **Why:** Used for secure, stateless authentication. Instead of storing user sessions in server memory, the server issues a cryptographically signed token. This allows the backend to securely verify if a request is coming from a 'Customer' or a 'Merchant' without hitting the database for every single route.
* **Bcrypt.js**
  * **Why:** Security best practices dictate that passwords should never be stored in plain text. Bcrypt hashes and salts user passwords before they are saved to MongoDB, protecting user accounts even if the database is compromised.
* **Multer**
  * **Why:** Essential for handling `multipart/form-data`. When a merchant uploads a picture of their food, Multer securely parses the incoming file stream and saves it to the server's file system so it can be served to the frontend.
