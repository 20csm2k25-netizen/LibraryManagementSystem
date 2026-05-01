# 📸 VISUAL STEP-BY-STEP SETUP GUIDE
## What You'll See at Each Step

---

## STEP 1: Open MySQL Command Line

### What to Do:
1. Press: `Windows Key + R`
2. Type: `cmd`
3. Press: `Enter`

### What You'll See:
```
C:\Users\MEGABYTE>
```

**This is Command Prompt. Ready for next step!**

---

## STEP 2: Connect to MySQL

### Type This:
```bash
mysql -u root -p
```

### Press: Enter

### What You'll See:
```
Enter password: ________
```

**Type your MySQL root password (what you set during MySQL installation)**

### After Password:
```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
mysql>
```

**🎉 Connected! You now see `mysql>` prompt**

---

## STEP 3: Create Database

### Type This:
```sql
CREATE DATABASE library_system;
```

### Press: Enter

### What You'll See:
```
Query OK, 1 row affected (0.05 sec)
mysql>
```

**✓ Database created successfully!**

---

## STEP 4: Create User Account

### Type This:
```sql
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'library_password123';
```

### Press: Enter

### What You'll See:
```
Query OK, 0 rows affected (0.03 sec)
mysql>
```

**✓ User account created!**

---

## STEP 5: Grant Permissions

### Type This:
```sql
GRANT ALL PRIVILEGES ON library_system.* TO 'library_user'@'localhost';
```

### Press: Enter

### What You'll See:
```
Query OK, 0 rows affected (0.02 sec)
mysql>
```

**✓ Permissions granted!**

---

## STEP 6: Apply Changes

### Type This:
```sql
FLUSH PRIVILEGES;
```

### Press: Enter

### What You'll See:
```
Query OK, 0 rows affected (0.02 sec)
mysql>
```

**✓ Changes applied!**

---

## STEP 7: Exit MySQL

### Type This:
```sql
EXIT;
```

### Press: Enter

### What You'll See:
```
Bye
C:\Users\MEGABYTE>
```

**Back to Command Prompt. You should see `C:\Users\MEGABYTE>`**

---

## STEP 8: Create Database Tables

### Navigate to Project Folder:

Type This:
```bash
cd "c:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system"
```

### Press: Enter

### What You'll See:
```
C:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system>
```

**✓ You're in project folder!**

### Run SQL File:

Type This:
```bash
mysql -u library_user -p library_system < database/library_schema.sql
```

### Press: Enter

### Type Password:
```
library_password123
```

### Press: Enter

### What You'll See:
```
C:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system>
```

**No error = Success! Tables created! ✓**

---

## STEP 9: Verify Tables (Optional)

### Connect to Database:

```bash
mysql -u library_user -p library_system
```

Type password: `library_password123`

### View Tables:

```sql
SHOW TABLES;
```

### What You'll See:
```
+----------------------+
| Tables_in_library_system |
+----------------------+
| borrowing_records    |
| books                |
| users                |
+----------------------+
3 rows in set (0.00 sec)
mysql>
```

**✓ All 3 tables created!**

### View Users:

```sql
SELECT * FROM users;
```

### What You'll See:
```
+--------+----------+--------------------+----------+-----------+-------+--------+---------------------+-----------+
| user_id| username | email              | password | full_name | phone | user_..| created_at          | is_active |
+--------+----------+--------------------+----------+-----------+-------+--------+---------------------+-----------+
|      1 | admin    | admin@library.com  | $2a...   | Admin ... | 12... | admin  | 2026-05-01 10:...   |         1 |
|      2 | student1 | student1@email.com | $2a...   | Ahmed ... | 98... | student| 2026-05-01 10:...   |         1 |
+--------+----------+--------------------+----------+-----------+-------+--------+---------------------+-----------+
2 rows in set (0.00 sec)
mysql>
```

**✓ Sample data loaded!**

### Exit:

```sql
EXIT;
```

---

## STEP 10: Update Backend Code

### Open File:
1. Open VS Code (or any editor)
2. Open folder: `library-system`
3. Open file: `backend/server.js`

### Find This (around line 25):
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'library_system',
```

### Change To:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'library_user',
  password: 'library_password123',
  database: 'library_system',
```

### What You'll See in Editor:
- Line 25-30 changed with new credentials
- No error squiggles

### Save:
- Press: `Ctrl + S`

**✓ Backend configured!**

---

## STEP 11: Install Backend Packages

### Open Command Prompt in Backend Folder:

```bash
cd backend
npm install
```

### What You'll See:
```
npm WARN deprecated ...

> Library Management System Backend

added 84 packages from 1234 contributors ...
npm notice ...
```

Wait for it to complete (2-3 minutes)...

### When Done:
```
added 84 packages in 2m15s
```

**✓ All packages installed!**

---

## STEP 12: Start Backend Server

### In Same Command Prompt:

```bash
npm start
```

### What You'll See (Successful):
```
========================================
📚 Library Management System Backend
Server running on http://localhost:5000
========================================

✓ MySQL Connected Successfully
```

**🎉 Backend is running! Leave this Command Prompt open!**

### If You See Error:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**❌ Problem:** MySQL not running or wrong credentials
**Solution:** 
- Make sure MySQL is running
- Check credentials match in server.js
- Restart command

---

## STEP 13: Open New Command Prompt for Frontend

### Open New Command Prompt:
1. Press: `Windows Key + R`
2. Type: `cmd`
3. Press: `Enter`

### Navigate to Frontend:

```bash
cd "c:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system\frontend"
```

### Start Python Server:

```bash
python -m http.server 8000
```

### What You'll See:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

**✓ Frontend server running!**

---

## STEP 14: Open Browser

### In Web Browser (Chrome, Firefox, Edge):

Go to: `http://localhost:8000`

### What You'll See:

```
┌─────────────────────────────────────────────┐
│                                             │
│              📚 Library System              │
│       Professional Online Library Platform  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ [Login] [Sign Up]          ← Tabs    │   │
│  ├──────────────────────────────────────┤   │
│  │ Welcome Back                         │   │
│  │                                      │   │
│  │ Username: [_______________]          │   │
│  │ Password: [_______________]          │   │
│  │                                      │   │
│  │      [Login Button]                  │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**🎉 Beautiful login page loaded!**

---

## STEP 15: Test Signup

### Click: Sign Up Tab

### What You'll See:

```
┌─────────────────────────────────────────────┐
│ [Login] [Sign Up]                           │
│         ↑ This tab becomes active           │
├─────────────────────────────────────────────┤
│ Create Account                              │
│                                             │
│ Username:    [_______________]              │
│ Email:       [_______________]              │
│ Full Name:   [_______________]              │
│ Phone:       [_______________]              │
│ Password:    [_______________]              │
│                                             │
│      [Sign Up Button]                       │
└─────────────────────────────────────────────┘
```

### Fill Form:
```
Username:    newstudent
Email:       newstudent@email.com
Full Name:   New Student
Phone:       03001234567
Password:    password123
```

### Click: Sign Up

### What You'll See (Success):

```
┌──────────────────────────────────────────┐
│  ✓ Signup successful! Please login.     │
│                                          │
│              [ OK ]                      │
└──────────────────────────────────────────┘
```

**🎉 User account created!**

---

## STEP 16: Verify Data in Database

### Open Command Prompt:

```bash
mysql -u library_user -p library_system
```

Password: `library_password123`

### Check Users:

```sql
SELECT username, email, full_name FROM users ORDER BY user_id DESC LIMIT 1;
```

### What You'll See:

```
+-------------+---------------------+---------------+
| username    | email               | full_name     |
+-------------+---------------------+---------------+
| newstudent  | newstudent@email... | New Student   |
+-------------+---------------------+---------------+
1 row in set (0.00 sec)
```

**✅ DATA SAVED IN DATABASE! SUCCESS!**

---

## STEP 17: Login with New Account

### Click: Login Tab

### Fill Form:
```
Username: newstudent
Password: password123
```

### Click: Login

### What You'll See (Success):

```
┌─────────────────────────────────────────────────┐
│        Welcome to Our Digital Library           │
│  Access thousands of books from anywhere       │
│                                                 │
│     [Browse Books Button]                       │
│                                                 │
│  ┌─────────────────┐ ┌─────────────────┐       │
│  │ 📖 Browse Books │ │ 📚 Borrow Book  │       │
│  │                 │ │                 │       │
│  │ Explore library │ │ Borrow with     │       │
│  │                 │ │ 14-day period   │       │
│  └─────────────────┘ └─────────────────┘       │
│  ┌─────────────────┐                           │
│  │ ⏰ Track Books  │                           │
│  │                 │                           │
│  │ View borrowed   │                           │
│  │ books & due     │                           │
│  └─────────────────┘                           │
└─────────────────────────────────────────────────┘
```

**🎉 Logged in successfully! Home page showing!**

---

## STEP 18: Browse Books

### Click: Browse Books

### What You'll See:

```
┌────────────────────────────────────────────┐
│ 📖 Browse Our Library                      │
│                                            │
│ [Search box: Search by title...]           │
│                                            │
│ ┌──────────────┐ ┌──────────────┐        │
│ │   📖 Book    │ │   📖 Book    │        │
│ │ Title: The..  │ │ Title: A B.. │        │
│ │ Author: Ka..  │ │ Author: St.. │        │
│ │ Philosophy    │ │ Science      │        │
│ │ ✓ 3 Available │ │ ✓ 2 Available│        │
│ │ [Borrow Now]  │ │ [Borrow Now] │        │
│ └──────────────┘ └──────────────┘        │
│                                            │
│ ┌──────────────┐ ┌──────────────┐        │
│ │   📖 Book    │ │   📖 Book    │        │
│ │ Title: The..  │ │ Title: Intr.. │       │
│ │ Author: F.S.. │ │ Author: Co.. │       │
│ │ Literature    │ │ Com...Science │       │
│ │ ✓ 4 Available │ │ ✓ 2 Available│       │
│ │ [Borrow Now]  │ │ [Borrow Now] │       │
│ └──────────────┘ └──────────────┘        │
└────────────────────────────────────────────┘
```

**✓ All books displayed!**

---

## STEP 19: Borrow a Book

### Click: Borrow Now Button

### What You'll See:

```
┌──────────────────────────────────────────────┐
│  ✓ Book borrowed successfully!              │
│  Due date: Thu May 15 2026                  │
│                                             │
│              [ OK ]                         │
└──────────────────────────────────────────────┘
```

**✓ Book borrowed!**

---

## STEP 20: View Your Books

### Click: My Books

### What You'll See:

```
┌─────────────────────────────────────────────┐
│ 📚 My Borrowed Books                        │
│                                             │
│ Currently Borrowed 📖                       │
│                                             │
│ ┌────────────────────────────────────────┐  │
│ │ The Prophet                            │  │
│ │ Kahlil Gibran                          │  │
│ │                                        │  │
│ │ Borrowed: May 1, 2026                  │  │
│ │ Due: May 15, 2026                      │  │
│ │ Status: Borrowed                       │  │
│ │ [Return Book Button]                   │  │
│ └────────────────────────────────────────┘  │
│                                             │
│ Return History 📚                           │
│ (No returned books yet)                    │
└─────────────────────────────────────────────┘
```

**✓ Your books displayed!**

---

## ✅ COMPLETE! SYSTEM WORKING!

### What You've Accomplished:

✅ Created MySQL database
✅ Created database user account
✅ Loaded sample data
✅ Connected backend to database
✅ Started backend server
✅ Started frontend server
✅ Signed up new student
✅ **Verified data saved in database** ← MOST IMPORTANT!
✅ Logged in successfully
✅ Browsed books
✅ Borrowed books
✅ Viewed borrowed books

---

## 🎯 KEY VERIFICATION POINTS

### Backend Console Should Show:
```
✓ MySQL Connected Successfully
Server running on http://localhost:5000
```

### Frontend Should Load:
- Login page appears
- Beautiful gradient background
- All buttons responsive

### Signup Should Work:
- Form validates input
- Shows success message
- Can login immediately after

### Database Should Have:
- New user in `users` table
- Password hashed (not plain text)
- created_at timestamp added
- user_id auto-incremented

---

## 📊 YOUR SYSTEM ARCHITECTURE

```
┌─────────────────┐
│  Browser (UI)   │
│  Frontend       │ ← What student sees
└────────┬────────┘
         │ HTTP/JSON
         │
┌────────▼────────┐
│  Backend API    │
│  Node.js Server │ ← Processes requests
└────────┬────────┘
         │ SQL Queries
         │
┌────────▼────────┐
│ MySQL Database  │
│ (Data Storage)  │ ← Persistent storage
└─────────────────┘
```

---

## 🚀 YOU'RE READY FOR YOUR ASSIGNMENT!

You now have a complete, working Library Management System where:

✅ Students can signup
✅ Data automatically saved to database
✅ Password securely hashed
✅ Students can login
✅ All features working
✅ Professional UI
✅ Production-ready

**Congratulations! Your assignment is complete! 🎉📚**

---

## 📝 FOR YOUR REPORT

Include these screenshots:
1. Login page (show beautiful UI)
2. Signup form (show all fields)
3. Home page (show features)
4. Browse books page (show grid)
5. Borrowed books page
6. MySQL database showing new user

**You have everything needed! ✨**
