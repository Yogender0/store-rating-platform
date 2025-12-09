FINAL CLEAN README (COPY EVERYTHING BELOW)
# Store Rating Platform – Roxiler Full Stack Assignment

This project is a full-stack web application developed as part of the **Roxiler Systems Full Stack Coding Challenge**.  
It allows users to rate stores, while administrators manage users, stores, and view platform statistics.

---

## 🚀 Tech Stack Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **Password Security:** bcrypt

---

## 👥 User Roles Implemented

1. **System Administrator**
2. **Normal User**
3. **Store Owner**

---

## ⚙️ Backend Setup Instructions

1. Go to the backend folder:
   ```bash
   cd backend


Install dependencies:

npm install


Create a .env file inside the backend folder and add:

PORT=4000
DATABASE_URL=postgres://postgres:root@localhost:5432/store_ratings
JWT_SECRET=supersecretkey


Start the backend server:

npm start


✅ Backend will run at:

http://localhost:4000

🌐 Frontend Setup

Open this file directly in your browser:

frontend/index.html

🔐 Test Login Credentials (For Reviewer)
✅ Admin Login

Email: admin@test.com

Password: Admin@123

✅ Normal User Login

Email: rawaty634@gmail.com

Password: (User-created during signup)

✅ Features Implemented

Secure Login & Signup

Role-Based Access Control (Admin, User, Store Owner)

Admin Dashboard with:

Total Users

Total Stores

Total Ratings

Store Rating System (1–5 scale)

JWT-based Authentication

PostgreSQL Database Integration

Password Hashing using bcrypt

Search & Filter Functionality

📌 Project Status

✅ Fully Working & Tested
