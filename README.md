Store Rating Platform – Roxiler Full Stack
Assignment
This project is a full stack web application developed as part of the Roxiler Systems Full Stack
Coding Challenge. It allows users to rate stores and admins to manage users, stores, and view
system statistics.
Tech Stack Used
1 Frontend: HTML, CSS, JavaScript
2 Backend: Node.js, Express.js
3 Database: PostgreSQL
4 Authentication: JWT
5 Password Security: bcrypt
User Roles Implemented
1 System Administrator
2 Normal User
3 Store Owner
Backend Setup
1. Go to backend folder and run:
npm install
2. Create a .env file and add:
PORT=4000
DATABASE_URL=postgres://postgres:root@localhost:5432/store_ratings
JWT_SECRET=supersecretkey
3. Start server:
npm start
Backend runs on:
http://localhost:4000
Frontend Setup
Open frontend/index.html directly in browser.
Test Login Credentials (For Reviewer)
Admin Login:
Email: admin@test.com
Password: Admin@123
Normal User:
Email: rawaty634@gmail.com
Features Implemented
1 Secure Login & Signup
2 Role-based access control
3 Admin dashboard
4 Store rating system
5 JWT-based authentication
6 PostgreSQL database integration
Project Status: Fully Working
Developer: Yogender Rawat
