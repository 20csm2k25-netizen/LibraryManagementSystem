# ⚡ QUICK COMMAND REFERENCE
## Copy-Paste Commands to Setup Database

---

## STEP 1: Connect to MySQL (Copy-Paste This)

### Open Command Prompt and run:
```bash
mysql -u root -p
```

**Then enter your MySQL root password** (the one you set during MySQL installation)

---

## STEP 2: Create Database & User (Copy-Paste Each Line)

### After you see `mysql>` prompt, paste these commands one by one:

```sql
CREATE DATABASE library_system;
```

Press Enter. You should see: `Query OK, 1 row affected`

```sql
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'library_password123';
```

Press Enter. You should see: `Query OK, 0 rows affected`

```sql
GRANT ALL PRIVILEGES ON library_system.* TO 'library_user'@'localhost';
```

Press Enter. You should see: `Query OK, 0 rows affected`

```sql
FLUSH PRIVILEGES;
```

Press Enter.

```sql
EXIT;
```

Press Enter to exit MySQL.

---

## STEP 3: Create Tables (Copy-Paste This)

### In Command Prompt, navigate to project folder:

```bash
cd "c:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system"
```

### Then run:

```bash
mysql -u library_user -p library_system < database/library_schema.sql
```

When prompted for password, type: `library_password123` and press Enter.

---

## STEP 4: Verify Tables Created

### Connect again and check:

```bash
mysql -u library_user -p library_system
```

Password: `library_password123`

Then type:
```sql
SHOW TABLES;
```

You should see 3 tables:
- borrowing_records
- books
- users

Type `EXIT;` to quit.

---

## STEP 5: Update Backend (Copy This Code)

### Open: backend/server.js

Find this section (around line 25):
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'library_system',
```

Replace with:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'library_user',
  password: 'library_password123',
  database: 'library_system',
```

**Save file: Ctrl + S**

---

## STEP 6: Install Backend Dependencies

### Open Command Prompt in backend folder:

```bash
cd backend
npm install
```

Wait for it to finish...

---

## STEP 7: Start Backend

### In same Command Prompt:

```bash
npm start
```

You should see:
```
✓ MySQL Connected Successfully
Server running on http://localhost:5000
```

**Leave this running! Open new Command Prompt for next steps.**

---

## STEP 8: Start Frontend

### Open new Command Prompt and run:

```bash
cd "c:\Users\MEGABYTE\OneDrive\Desktop\SWE ASSIGNMENT\library-system\frontend"
python -m http.server 8000
```

Or simpler: Just double-click `index.html` in frontend folder.

---

## STEP 9: Test Signup

1. Go to: http://localhost:8000 (if using Python server)
2. Click: Sign Up
3. Fill form:
   - Username: testuser123
   - Email: testuser@email.com
   - Full Name: Test User
   - Phone: 1234567890
   - Password: password123
4. Click: Sign Up
5. You should see: "Signup successful! Please login."

---

## STEP 10: Verify Data in Database

### Open Command Prompt and run:

```bash
mysql -u library_user -p library_system
```

Password: `library_password123`

Then type:
```sql
SELECT * FROM users;
```

You should see your new user!

---

## 🎯 ALL IMPORTANT CREDENTIALS

```
MySQL Root (during installation):
User: root
Password: (whatever you created)

Library Database:
Database Name: library_system
User: library_user
Password: library_password123
Host: localhost
Port: 3306

Backend:
Port: 5000
URL: http://localhost:5000

Frontend:
Port: 8000 (if using Python server)
URL: http://localhost:8000
```

**SAVE THESE CREDENTIALS SOMEWHERE SAFE!**

---

## 🔧 IF SOMETHING GOES WRONG

### "MySQL Connection Failed" or "Access Denied"

Check server.js line ~25:
```javascript
user: 'library_user',           // ← Must be exactly 'library_user'
password: 'library_password123', // ← Must match exactly
database: 'library_system',     // ← Must be exactly 'library_system'
```

### "Port 5000 already in use"

Find what's using it and close it, or:
- Change port in server.js: `const PORT = 3000;`

### "Cannot find module 'mysql2'"

Run in backend folder:
```bash
npm install mysql2
```

### "Frontend blank/not loading"

Make sure backend is running! You should see in Command Prompt:
```
✓ MySQL Connected Successfully
Server running on http://localhost:5000
```

### "Signup not saving to database"

1. Check backend console for errors
2. Verify credentials in server.js
3. Verify database and tables exist
4. Run: `SELECT * FROM users;` in MySQL

---

## 📋 COMPLETE SETUP SUMMARY

```
┌─────────────────────────────────────┐
│ 1. MySQL Installed & Running        │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 2. Create Database & User           │
│    (Copy-paste SQL commands)         │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 3. Create Tables                    │
│    (Run library_schema.sql)          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 4. Update backend/server.js         │
│    (Change credentials)              │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 5. npm install in backend folder    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 6. npm start (start backend)        │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 7. Open frontend in browser         │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 8. Test Signup                      │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│ 9. Verify Data in Database          │
│    ✅ COMPLETE!                      │
└─────────────────────────────────────┘
```

---

## ✅ VERIFY EVERYTHING WORKS

Run these commands to check:

### Check MySQL connection:
```bash
mysql -u library_user -p library_system -e "SELECT COUNT(*) as user_count FROM users;"
```
Password: `library_password123`

Should show: `user_count: 3` (or more if you added users)

### Check database tables:
```bash
mysql -u library_user -p library_system -e "SHOW TABLES;"
```

Should show:
```
borrowing_records
books
users
```

### Check sample books:
```bash
mysql -u library_user -p library_system -e "SELECT * FROM books LIMIT 1;"
```

Should show book data.

---

## 🚀 WHEN YOU SEE THIS - YOU'RE READY!

```
✓ MySQL Connected Successfully
Server running on http://localhost:5000

Frontend loads in browser
Signup form appears
Can click "Sign Up"
Message says "Signup successful!"
Can login with new account
Can browse books
Can borrow/return books
```

---

## 💡 QUICK TROUBLESHOOTING

| Error | Solution |
|-------|----------|
| "Can't connect to MySQL" | Ensure MySQL service is running |
| "Access Denied" | Check username/password match exactly |
| "Unknown database" | Run CREATE DATABASE command |
| "Port 5000 in use" | Change port or close other app |
| "Cannot find module" | Run `npm install` |
| "Frontend shows blank" | Use Python server, don't use file:// |
| "Data not saving" | Check backend console for errors |

---

## 📞 NEED HELP?

1. **Database won't connect?** 
   → Check if MySQL is running
   → Check credentials match exactly

2. **Data not saving?**
   → Check backend console for errors (F12)
   → Verify database tables exist
   → Run `SELECT * FROM users;` to verify

3. **Frontend not loading?**
   → Use Python server: `python -m http.server 8000`
   → Don't open file directly in browser

4. **Backend won't start?**
   → Check MySQL is running
   → Check port 5000 not in use
   → Run `npm install` first

---

## 🎯 YOU'RE ALL SET!

Your database is now:
✅ Created
✅ Connected
✅ Saving student data
✅ Production-ready

**Signup → Data Saved → Login Works! 🎉**
