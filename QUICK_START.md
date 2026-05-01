# 🚀 Quick Start Guide - Library Management System

Get up and running in 5 minutes!

## ⚡ 5-Minute Setup

### Step 1: Database (1 minute)

**Windows:**
1. Open Command Prompt
2. Type: `mysql -u root`
3. Paste this entire code:
```sql
CREATE DATABASE library_system;
USE library_system;
CREATE TABLE users (user_id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, full_name VARCHAR(100) NOT NULL, phone VARCHAR(15), address TEXT, user_type ENUM('student', 'admin') DEFAULT 'student', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, is_active BOOLEAN DEFAULT TRUE);
CREATE TABLE books (book_id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255) NOT NULL, author VARCHAR(100) NOT NULL, isbn VARCHAR(20) UNIQUE NOT NULL, category VARCHAR(50) NOT NULL, publication_year INT, quantity_available INT DEFAULT 0, quantity_total INT NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE borrowing_records (record_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT NOT NULL, book_id INT NOT NULL, borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, due_date DATE NOT NULL, return_date DATE, status ENUM('borrowed', 'returned') DEFAULT 'borrowed', fine_amount DECIMAL(10, 2) DEFAULT 0.00, FOREIGN KEY (user_id) REFERENCES users(user_id), FOREIGN KEY (book_id) REFERENCES books(book_id));
INSERT INTO users VALUES (NULL, 'admin', 'admin@library.com', '$2a$10$...', 'Admin User', '1234567890', NULL, 'admin', NOW(), 1);
INSERT INTO users VALUES (NULL, 'student1', 'student1@email.com', '$2a$10$...', 'Ahmed Khan', '9876543210', NULL, 'student', NOW(), 1);
INSERT INTO books VALUES (NULL, 'The Prophet', 'Kahlil Gibran', '978-0-394-40452-8', 'Philosophy', 1923, 3, 3, 'Inspiring philosophical work', NOW());
INSERT INTO books VALUES (NULL, 'A Brief History of Time', 'Stephen Hawking', '978-0-553-38016-3', 'Science', 1988, 2, 2, 'Exploration of space', NOW());
```

**Or Simply:**
1. Open MySQL Workbench
2. Click File → Open SQL Script
3. Select: `database/library_schema.sql`
4. Click Execute (⚡ icon)

### Step 2: Backend (2 minutes)

```bash
cd backend
npm install
npm start
```

**Expected:**
```
Server running on http://localhost:5000
✓ MySQL Connected Successfully
```

### Step 3: Frontend (1 minute)

**Option A: Double-click**
```
Double-click: frontend/index.html
```

**Option B: Python Server**
```bash
cd frontend
python -m http.server 8000
# Open http://localhost:8000
```

**Option C: VS Code Live Server**
```
Right-click index.html → Open with Live Server
```

---

## 🧪 Test Immediately

**Login with:**
- Username: `student1`
- Password: `pass123`

**Test these features:**
1. ✅ Login
2. ✅ Browse Books
3. ✅ Search Books
4. ✅ Borrow a Book
5. ✅ View My Books
6. ✅ Return a Book
7. ✅ Logout

---

## 📋 What You Get

✅ **Complete Backend**
- Express.js API with all endpoints
- MySQL database with sample data
- User authentication with bcrypt
- Book borrowing system with fine calculation

✅ **Beautiful Frontend**
- Professional responsive UI
- Real-time book search
- Modal book details
- Responsive mobile design

✅ **Full Documentation**
- Software Requirements Specification (SRS.md)
- API Documentation
- Database Schema
- This Quick Start Guide

---

## 🔧 If Something Goes Wrong

### "Cannot connect to database"
```bash
# Make sure MySQL is running
# Windows: Search "MySQL 5.7 Command Line Client"
# Or check Services: Win+R → services.msc → Find MySQL
```

### "Port 5000 already in use"
```bash
# Change port in server.js (line ~10)
const PORT = 3000; // Change this
```

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### "Frontend blank/not loading"
- Use Python server instead of direct file open
- Check browser console (F12)
- Refresh page (Ctrl+R)

---

## 📱 Features Overview

### 👤 Authentication
- Modern signup form
- Secure login
- Session-based authentication
- Logout functionality

### 📚 Browse Books
- Grid layout
- Search by title/author/category
- Real-time availability
- Book details modal

### 🏷️ Borrow Books
- One-click borrowing
- Automatic due date (14 days)
- Availability updates instantly
- Success confirmation

### ↩️ Return Books
- View all borrowed books
- Return with one click
- Automatic fine calculation
- Return history

### 📊 Dashboard
- My Books page
- Borrowed vs Returned sections
- Overdue indicators
- Fine tracking

---

## 🎯 Next Steps After Setup

1. **Customize:**
   - Change company name in index.html
   - Modify colors in styles.css
   - Add your books to database

2. **Deploy:**
   - Use services like Heroku/Railway for backend
   - Use Netlify/Vercel for frontend
   - Use MongoDB/PostgreSQL for database

3. **Add Features:**
   - Book reviews
   - Email notifications
   - Admin dashboard
   - Book reservations

4. **Secure:**
   - Use environment variables
   - Enable HTTPS
   - Add rate limiting
   - Use production session storage

---

## 📞 Common Tasks

### Add More Books to Database

```sql
INSERT INTO books (title, author, isbn, category, publication_year, quantity_available, quantity_total, description) 
VALUES ('Your Book', 'Author Name', 'ISBN-HERE', 'Category', 2026, 5, 5, 'Description');
```

### Change Lending Period

Edit in backend/server.js (line ~220):
```javascript
// Change 14 to your desired days
const dueDate = new Date(today.setDate(today.getDate() + 14));
```

### Change Fine Amount

Edit in backend/server.js (line ~305):
```javascript
// Change 1 to your desired fine per day
fine = daysLate * 1;
```

### Modify UI Colors

Edit in frontend/styles.css (line ~10):
```css
--primary-color: #2563eb;      /* Change this */
--secondary-color: #1e40af;    /* And this */
```

---

## 📊 Project Statistics

| Component | Lines of Code |
|-----------|---------------|
| Backend (server.js) | ~400 |
| Frontend HTML | ~150 |
| Frontend CSS | ~500 |
| Frontend JavaScript | ~400 |
| Database Schema | ~80 |
| **Total** | **~1,530** |

---

## 🎓 Learning Checklist

After completion, you should understand:

- [ ] How to create MySQL database and tables
- [ ] How to build RESTful API with Express.js
- [ ] How to hash passwords securely (bcrypt)
- [ ] How to use sessions for authentication
- [ ] How to fetch API from JavaScript
- [ ] How to design responsive CSS layouts
- [ ] How to validate form inputs
- [ ] How to handle errors gracefully
- [ ] How to write SQL queries
- [ ] How to follow SDLC methodology

---

## 🏆 Submission Checklist

Before submitting, ensure:

- [ ] Database created and populated
- [ ] Backend server runs without errors
- [ ] Frontend loads in browser
- [ ] Can signup and create account
- [ ] Can login with credentials
- [ ] Can browse and search books
- [ ] Can borrow and return books
- [ ] Can view borrowed books
- [ ] Fine calculation works
- [ ] UI is professional and responsive
- [ ] All documentation is complete
- [ ] Code is clean and commented
- [ ] No error messages in console

---

## 📝 For Your Report/Word Document

When creating your assignment report, include:

1. **Cover Page**
   - Project Title
   - Your Name & Student ID
   - Date
   - Course Name

2. **Executive Summary**
   - Project overview
   - Technologies used
   - Key features

3. **SDLC Phases**
   - Planning (requirements)
   - Design (architecture, database)
   - Implementation (code, features)
   - Testing (test cases)

4. **Database Design**
   - ER Diagram (included in SRS)
   - Table specifications
   - Sample data

5. **System Features**
   - Screenshots of each feature
   - Feature descriptions
   - How to use

6. **Technical Implementation**
   - Architecture overview
   - API endpoints
   - Code snippets (important parts)

7. **Results & Testing**
   - Test cases and results
   - Screenshots of functionality
   - Performance metrics

8. **Conclusion**
   - What you learned
   - Challenges overcome
   - Future enhancements

9. **Appendices**
   - Complete code
   - Database schema
   - User manual

---

## 🎉 You're Done!

Your Library Management System is complete and ready for submission!

**What You Have:**
✅ Full-stack web application
✅ Professional UI/UX
✅ Secure authentication
✅ Complete database
✅ RESTful API
✅ Comprehensive documentation

**Total Time:** ~5 minutes setup + ~30 minutes exploration

---

**Questions?** Check README.md or documentation/ folder

**Ready to submit!** 🚀
