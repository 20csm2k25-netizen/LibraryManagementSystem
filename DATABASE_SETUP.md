# 📚 DATABASE SETUP GUIDE
## Step-by-Step Guide to Create Database & User Account

---

## STEP 1: Install MySQL Server (If Not Already Installed)

### On Windows:

1. **Download MySQL:**
   - Go to: https://www.mysql.com/downloads/
   - Click: "MySQL Community Server"
   - Download: MySQL Server (Latest version recommended)

2. **Install MySQL:**
   - Double-click the downloaded file
   - Click: "Next" through setup
   - Choose: "Server Machine" (recommended)
   - Port: Keep default `3306`
   - **Important:** Set a password for `root` user (remember this!)
   - Click: "Finish"

3. **Verify Installation:**
   - Open Command Prompt (cmd)
   - Type: `mysql --version`
   - Should show version number (e.g., `mysql Ver 8.0.23`)

---

## STEP 2: Create Database Using MySQL Command Line

### Method A: Using Command Line (Easiest)

1. **Open Command Prompt (Windows):**
   - Press: `Win + R`
   - Type: `cmd`
   - Press: `Enter`

2. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```
   - Press: `Enter`
   - When prompted for password: Enter the password you set during installation
   - Press: `Enter`

3. **You should see:**
   ```
   Welcome to the MySQL monitor. Commands end with ; or \g.
   mysql>
   ```

4. **Create Database:**
   ```sql
   CREATE DATABASE library_system;
   ```
   - Press: `Enter`
   - You should see: `Query OK, 1 row affected`

5. **Verify Database Created:**
   ```sql
   SHOW DATABASES;
   ```
   - Press: `Enter`
   - You should see `library_system` in the list

---

## STEP 3: Create Database User Account (IMPORTANT!)

This creates a dedicated account for your application (don't use root for production).

### In the MySQL Command Line (still connected):

1. **Create New User:**
   ```sql
   CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'library_password123';
   ```
   - Replace `'library_password123'` with your preferred password
   - Press: `Enter`
   - You should see: `Query OK, 0 rows affected`

2. **Grant Permissions to User:**
   ```sql
   GRANT ALL PRIVILEGES ON library_system.* TO 'library_user'@'localhost';
   ```
   - Press: `Enter`

3. **Apply Changes:**
   ```sql
   FLUSH PRIVILEGES;
   ```
   - Press: `Enter`

4. **Verify User Created:**
   ```sql
   SELECT User, Host FROM mysql.user;
   ```
   - Press: `Enter`
   - You should see `library_user` in the list

5. **Exit MySQL:**
   ```sql
   EXIT;
   ```
   - Press: `Enter`

---

## STEP 4: Create Database Tables

### Method A: Using SQL File (Recommended)

1. **In Command Prompt, navigate to your project:**
   ```bash
   cd "c:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system"
   ```

2. **Connect to MySQL with new user:**
   ```bash
   mysql -u library_user -p library_system < database/library_schema.sql
   ```
   - When prompted: Enter password: `library_password123`
   - Press: `Enter`
   - All tables should be created

3. **Verify Tables Created:**
   ```bash
   mysql -u library_user -p library_system
   ```
   - Enter password: `library_password123`
   - Type: `SHOW TABLES;`
   - You should see: users, books, borrowing_records

### Method B: Using MySQL Workbench (GUI)

1. **Open MySQL Workbench** (installed with MySQL)

2. **Create New Connection:**
   - Click: "+" icon
   - Connection Name: `Library System`
   - Hostname: `localhost`
   - Username: `library_user`
   - Password: `library_password123`
   - Click: "OK"

3. **Open SQL Script:**
   - Click: File → Open SQL Script
   - Select: `database/library_schema.sql`
   - Click: "Execute" (lightning bolt ⚡)

4. **Tables created!** ✓

---

## STEP 5: Update Backend Configuration

### Update server.js with Your Database Credentials

1. **Open:** `backend/server.js` in VS Code

2. **Find this section (around line 25):**
   ```javascript
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'library_system',
     ...
   });
   ```

3. **Replace with your credentials:**
   ```javascript
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'library_user',           // ← Changed
     password: 'library_password123', // ← Changed (your password)
     database: 'library_system',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   });
   ```

4. **Save file:** `Ctrl + S`

---

## STEP 6: Create .env File (Best Practice)

### Create Environment Configuration File

1. **Open:** `backend/.env.example` (in VS Code)

2. **Copy and save as:** `backend/.env` (create new file)

3. **Add your credentials:**
   ```
   DB_HOST=localhost
   DB_USER=library_user
   DB_PASSWORD=library_password123
   DB_NAME=library_system
   DB_PORT=3306
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your_secret_key_here
   ```

4. **Save file:** `Ctrl + S`

### Update server.js to Use .env

1. **At top of server.js, find:**
   ```javascript
   require('dotenv').config();
   ```

2. **Update database connection to use .env:**
   ```javascript
   const pool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'library_user',
     password: process.env.DB_PASSWORD || 'library_password123',
     database: process.env.DB_NAME || 'library_system',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   });
   ```

3. **Save file:** `Ctrl + S`

---

## STEP 7: Install npm Packages & Start Server

### Install Required Packages

1. **Open Command Prompt in project folder:**
   ```bash
   cd backend
   npm install
   ```

2. **Install mysql2 package:**
   ```bash
   npm install mysql2
   ```

3. **Install bcryptjs for password hashing:**
   ```bash
   npm install bcryptjs
   ```

4. **Install dotenv for environment variables:**
   ```bash
   npm install dotenv
   ```

---

## STEP 8: Test Database Connection

### Start the Backend Server

1. **In Command Prompt (in backend folder):**
   ```bash
   npm start
   ```

2. **You should see:**
   ```
   ========================================
   📚 Library Management System Backend
   Server running on http://localhost:5000
   ========================================

   ✓ MySQL Connected Successfully
   ```

   **If you see error:**
   - Check username/password in server.js
   - Check database name
   - Ensure MySQL service is running
   - Check port 3306 is not in use

---

## STEP 9: Open Frontend & Test Signup

### Test That Data is Saved

1. **Open frontend:**
   - Navigate to: `c:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system\frontend`
   - Double-click: `index.html`

2. **Signup with new account:**
   - Click: "Sign Up"
   - Fill form with:
     ```
     Username: testuser123
     Email: testuser@email.com
     Full Name: Test User
     Phone: 1234567890
     Password: password123
     ```
   - Click: "Sign Up"
   - Should see: "Signup successful! Please login."

3. **Check if data saved in database:**
   - Open Command Prompt
   - Type: `mysql -u library_user -p library_system`
   - Enter password
   - Type: `SELECT * FROM users;`
   - You should see your new user in the table!

---

## STEP 10: Verify Complete Setup

### Checklist to Confirm Everything Works

- [ ] MySQL server is running
- [ ] Database `library_system` created
- [ ] User `library_user` created with password
- [ ] Tables created (users, books, borrowing_records)
- [ ] Backend server starts without errors
- [ ] "MySQL Connected Successfully" message appears
- [ ] Frontend loads in browser
- [ ] Can signup with new account
- [ ] New user data appears in database
- [ ] Can login with new credentials
- [ ] Can browse, borrow, return books

---

## 🔍 VERIFY DATA IN DATABASE

### View All Users

```bash
# Connect to MySQL
mysql -u library_user -p library_system

# View all users
SELECT * FROM users;

# View specific user
SELECT username, email, full_name FROM users WHERE username = 'testuser123';

# Count users
SELECT COUNT(*) FROM users;
```

### View All Books

```sql
SELECT book_id, title, author, quantity_available FROM books;
```

### View Borrowing Records

```sql
SELECT * FROM borrowing_records;
```

---

## 📝 IMPORTANT CREDENTIALS TO REMEMBER

**MySQL Root (Created during installation):**
```
User: root
Password: (whatever you set during MySQL installation)
```

**Database User (For your application):**
```
User: library_user
Password: library_password123
Database: library_system
Host: localhost
Port: 3306
```

**Store these safely!** You'll need them later.

---

## ⚙️ QUICK REFERENCE

| Item | Value |
|------|-------|
| Database Name | library_system |
| Database User | library_user |
| Database Password | library_password123 |
| Host | localhost |
| Port | 3306 |
| Backend Port | 5000 |

---

## 🐛 TROUBLESHOOTING

### Error: "Access Denied for user 'root'@'localhost'"
- You entered wrong MySQL root password
- Reset MySQL: Uninstall and reinstall with new password

### Error: "Unknown Database 'library_system'"
- Database not created yet
- Run Step 2 to create database

### Error: "Can't connect to MySQL Server"
- MySQL service not running
- Windows: Search "Services" → Start "MySQL80" service

### Error: "Module not found: mysql2"
- npm packages not installed
- Run: `npm install` in backend folder

### Error: "EADDRINUSE: address already in use :::5000"
- Port 5000 already in use
- Close other application using port 5000
- Or change port in server.js

### Signup page not showing user in database
- Check backend console for errors
- Verify credentials in server.js
- Run: `npm start` again
- Check browser console (F12) for errors

---

## ✅ WHEN YOU SEE THIS - YOU'RE DONE!

```
✓ MySQL Connected Successfully
Server running on http://localhost:5000

Frontend loads without errors
Signup creates new user
Data appears in database
Login works with new credentials
```

---

## 🎯 WHAT HAPPENS WHEN STUDENT SIGNS UP

**Flow:**
1. Student enters signup form (username, email, password, name, phone)
2. Frontend sends data to backend API
3. Backend validates data
4. Backend hashes password with bcrypt
5. Backend inserts data into database
6. Frontend shows success message
7. **✓ Data now saved in your database!**

**You can verify by:**
```sql
SELECT username, email, full_name, created_at FROM users ORDER BY created_at DESC;
```

This shows newest users first!

---

## 🚀 YOU'RE READY!

Your database is now:
✅ Created
✅ Connected to backend
✅ Saving student data
✅ Ready for production

**Start backend → Open frontend → Signup → Check database! 🎉**

