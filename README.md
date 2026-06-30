# Bio CWT - NestJS Backend API

This is the backend API server for the Bio CWT Wood Species and Services CMS project. It manages the PostgreSQL database, coordinates user authentication, uploads files to Cloudinary, and serves dynamic content parameters.

---

## 🔗 API Server URLs

* **Base REST API URL:** **`https://bio-cwt-apis.onrender.com/api`**
* **Interactive Swagger UI API Documentation:** **`https://bio-cwt-apis.onrender.com/api/docs`**

---

## 🚀 Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [PostgreSQL](https://www.postgresql.org/) database running locally or hosted

### Step-by-Step Run Guide
1. Install npm dependencies:
   ```bash
   npm install
   ```
2. Sync the PostgreSQL database schema:
   ```bash
   npx prisma db push
   ```
3. Seed the database with the initial layout blocks:
   ```bash
   npx prisma db seed
   ```
4. Start the API server in development mode:
   ```bash
   npm run start:dev
   ```
   * The server runs on port `3000` by default.

---

## 🔑 Environment Variables
Create a file named `.env` in the root and configure the following variables:
```env
# Database Settings
DATABASE_URL="postgresql://neondb_owner:npg_ofeC5gw6Tcal@ep-wispy-resonance-atfrs8g1.c-9.us-east-1.aws.neon.tech/postegresssql?"


# Server Port and CORS Allowed Origins
PORT=3000
CORS_ORIGIN=https://bio-cwt-delta.vercel.app

# JWT Security Keys
JWT_SECRET="super-secret-key-123456"
JWT_REFRESH_SECRET="super-secret-refresh-key-123456"
JWT_EXPIRES_IN="30m"
JWT_REFRESH_EXPIRES_IN="15d"

# Cloudinary Integration (For uploading images)
CLOUDINARY_CLOUD_NAME="dgbv55ifs"
CLOUDINARY_API_KEY="417878541532274"
CLOUDINARY_API_SECRET="tkaKne4Mw7-lnlm1V38qQDI2HFs"

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=2000

#Database Seed Credentials
SEED_ADMIN_EMAIL="admin@wood.com"
SEED_ADMIN_PASSWORD="admin123"
```

---

## 🗄️ Database Setup & Models (Prisma)

The application uses Prisma ORM to communicate with PostgreSQL. The database is organized into four main models defined in `prisma/schema.prisma`:
* **`User`**: Admin account records used for logging into the dashboard.
* **`CmsContent`**: Stores the dynamic JSON layouts for the website homepage sections (Hero carousel, About Us description, Advantages list, and Gallery/Our Work carousel).
* **`WoodType`**: Stores wood product profiles including their features array (`{ label: string; positive: boolean }`).
* **`Service`**: Stores custom services alongside pricing matrices (calculated per cubic meter).

Whenever you update the database schemas, remember to run:
```bash
npx prisma generate
```

---

## ⚙️ Backend Architecture Overview

* **Framework:** NestJS (modular structure)
* **Modules:**
  * `AuthModule`: Implements JWT bearer tokens, validation guards, and credentials verification.
  * `CmsModule`: Handles key-value configuration updates with dynamic validation checks.
  * `ServicesModule`: Handles catalog management and calculation price matrices.
  * `WoodTypesModule`: Coordinates FormData processing, uploads media streams to Cloudinary, and saves wood species information.
  * `CloudinaryModule`: Binds with the cloud SDK to execute secure file uploads.

---

## 🤖 AI Tools Used
* **Claude (Anthropic)**: Used for writing NestJS CRUD routes and functional modules.

---

## ⏱️ Development Time Spent
* **Timeline:** 1 day
* **Total Time Invested:** ~6 hours of active work (engineering database models, security features, files processing, and API documentation).
