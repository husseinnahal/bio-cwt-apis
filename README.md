# Bio CWT - NestJS Backend API

This is the backend API server for the Bio CWT Wood Species and Services CMS project. It manages the PostgreSQL database, coordinates user authentication, uploads files to Cloudinary, and serves dynamic content parameters.

---

## 🔗 API Server URLs

* **Base REST API URL:** **`http://localhost:3000/api`**
* **Interactive Swagger UI API Documentation:** **`http://localhost:3000/api/docs`**

---

## 🚀 Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [PostgreSQL](https://www.postgresql.org/) database running locally or hosted

### Step-by-Step Run Guide
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Sync the PostgreSQL database schema:
   ```bash
   npx prisma db push
   ```
4. Seed the database with the initial layout blocks:
   ```bash
   npx prisma db seed
   ```
5. Start the API server in development mode:
   ```bash
   npm run start:dev
   ```
   * The server runs on port `3000` by default.

---

## 🔑 Environment Variables
Create a file named `.env` in the root of the `backend/` directory and configure the following variables:
```env
# Database Settings
DATABASE_URL="postgresql://username:password@localhost:5432/wood_db?schema=public"

# Server Port and CORS Allowed Origins
PORT=3000
app.corsOrigin="http://localhost:3001"

# JWT Security Keys
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Cloudinary Integration (For uploading images)
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
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
* **Antigravity IDE Agent** by Google DeepMind (Advanced Agentic Coding): Used for writing NestJS CRUD routes, database seeding code, setting up JWT auth strategies, Cloudinary uploads, and generating OpenAPI Swagger annotations.

---

## ⏱️ Development Time Spent
* **Timeline:** 2 days
* **Total Time Invested:** ~12 hours of active work (engineering database models, security features, files processing, and API documentation).
