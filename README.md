# Store Rating Platform – Roxiler Full Stack Assignment

This project is a full stack web application built as part of the **Roxiler Systems Internship Coding Challenge**.

---

## 🚀 Tech Stack
- Frontend: React.js
- Backend: Node.js with Express.js
- Database: PostgreSQL
- Authentication: JWT
- Password Hashing: bcrypt

---

## 👥 User Roles Implemented
1. System Administrator  
2. Normal User  
3. Store Owner  

---

## ✅ Features

### 🔹 Admin
- Add users & stores
- View all users & stores
- Filter by name, email, address, role
- Dashboard statistics:
  - Total users
  - Total stores
  - Total ratings

### 🔹 Normal User
- Signup & Login
- View all stores
- Search by name & address
- Submit & update ratings (1–5)

### 🔹 Store Owner
- View users who rated their store
- View average rating

---

## ✅ Validations
- Name: 20–60 characters
- Address: Max 400 characters
- Password: 8–16 characters with uppercase & special character

---

## 🗄️ Database
PostgreSQL schema with:
- users
- stores
- ratings

---

## 🛠️ How to Run Locally

### Backend
```bash
cd backend
npm install
npm start
