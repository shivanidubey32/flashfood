# FlashFood Deployment Guide (Render)

This guide walks you through deploying your FlashFood MERN application to Render as a **Single Web Service** (Monolithic Deployment). The codebase has been fully prepared for production.

## 1. What Has Changed?

The following modifications were made to make your application production-ready:
1. **`backend/routes/uploadRoutes.js`**: Completely rewritten to upload images directly to Cloudinary using `multer-storage-cloudinary`.
2. **`backend/server.js`**: Added a `/api/health` endpoint, configured `express.static` to serve your React frontend (`frontend/dist`), and updated CORS/Socket.io settings.
3. **`frontend/src/...`**: Replaced all hardcoded `http://localhost:5000` strings with dynamic relative URLs that work natively in production.
4. **`package.json`**: Created a root-level file with recursive install and build commands.
5. **`render.yaml`**: Added Infrastructure-as-Code for 1-click deployments.
6. **`.gitignore`**: Ensured `.env` and `node_modules` are ignored.

---

## 2. Environment Variables Required

When deploying to Render, you must configure these **Environment Variables** in the Render Dashboard (do NOT commit these to GitHub):

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Tells Node/React to run in optimized mode. |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string. |
| `JWT_SECRET` | `your_super_secret_key` | Secret key for signing auth tokens. |
| `CLOUDINARY_CLOUD_NAME` | `dxabc123` | Your Cloudinary Cloud Name. |
| `CLOUDINARY_API_KEY` | `1234567890` | Your Cloudinary API Key. |
| `CLOUDINARY_API_SECRET`| `AbCdEfG...` | Your Cloudinary API Secret. |

*(Note: Render automatically provides the `PORT` variable, you do not need to set it).*

---

## 3. Deployment Commands

Render will automatically run these commands during the deployment process because we defined them in `render.yaml` and the root `package.json`:

* **Build Command:** `npm run build` *(Installs backend/frontend dependencies, then builds Vite).*
* **Start Command:** `npm start` *(Starts the backend server, which also serves the frontend).*

---

## 4. Step-by-Step GitHub Workflow

To get your code onto Render, it must be pushed to GitHub first.

1. **Initialize Git (if not done already):**
   Open a terminal in your project root and run:
   ```bash
   git init
   git add .
   git commit -m "Prepare for production deployment"
   ```
2. **Push to GitHub:**
   Go to [GitHub](https://github.com/), create a new repository (e.g., `flashfood`), and follow the instructions to push your local repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/flashfood.git
   git branch -M main
   git push -u origin main
   ```

---

## 5. Step-by-Step Render Deployment

1. Create a free account at [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `flashfood` repository.
4. Render will automatically detect the `render.yaml` file in your repository! It will set up the "flashfood-production" service for you.
5. **Wait! Before deploying**, Render will ask you to fill in the environment variables (MONGO_URI, JWT_SECRET, and CLOUDINARY credentials). Paste them in securely.
6. Click **Create Web Service**.

Render will now run `npm run build`, compile your React app, and start your Node server. Once the build finishes (usually ~2-4 minutes), you can click the generated URL (e.g., `https://flashfood-production.onrender.com`) and your app will be live globally!
