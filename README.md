# 📚 Library Management System

A professional, full-stack Library Management System built following Software Engineering principles and SDLC methodology.

## 🎯 Project Overview

A web-based online library platform where students can:
- ✅ Register and create accounts
- ✅ Browse and search available books
- ✅ Borrow books with 14-day lending period
- ✅ Return books and pay fines if overdue
- ✅ Track all borrowed and returned books
- ✅ View borrowing history

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive styling with modern design
- **JavaScript (ES6)** - Interactive features and API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **bcryptjs** - Password hashing
- **Express-Session** - Session management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16+) - [Download](https://nodejs.org)
2. **MySQL Server** (5.7+) - [Download](https://www.mysql.com/downloads/)
3. **Git** (optional) - [Download](https://git-scm.com)
4. **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com)

## 🚀 Installation & Setup

### Step 1: Database Setup

**Option A: Using Command Line (Recommended)**

1. Open MySQL Command Line Client or use any MySQL client
2. Create the database:
   ```sql
   CREATE DATABASE library_system;
   USE library_system;
   ```

3. Run the SQL schema file:
   ```sql
   source path/to/database/library_schema.sql;
   ```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Create new connection
3. Click "File" → "Open SQL Script"
4. Select `database/library_schema.sql`
5. Click "Execute" button

**Verify Installation:**
```sql
USE library_system;
SHOW TABLES;
SELECT * FROM users LIMIT 1;
SELECT * FROM books LIMIT 1;
```

### Step 2: Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```
   
   This installs:
   - express
   - mysql2
   - bcryptjs
   - dotenv
   - cors
   - body-parser
   - express-session

3. Create `.env` file (optional, for custom configuration):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=library_system
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   **Expected output:**
   ```
   ========================================
   📚 Library Management System Backend
   Server running on http://localhost:5000
   ========================================
   
   ✓ MySQL Connected Successfully
   ```

### Step 3: Frontend Setup

**Option A: Simple Browser Open**

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Double-click `index.html` to open in default browser

**Option B: Using Python Server (Recommended)**

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Start Python local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

3. Open browser and go to: `http://localhost:8000`

**Option C: Using VS Code Live Server**

1. Install VS Code Live Server extension
2. Right-click `index.html` → "Open with Live Server"

### Step 4: GitHub Pages Deployment

The frontend can be hosted on GitHub Pages, but the Node.js backend must be deployed separately and exposed over HTTPS.

1. Push the repository to GitHub.
2. Deploy the backend to a host such as Render, Railway, or another Node.js platform.
3. Update `frontend/config.js` with the deployed backend API URL ending in `/api`.
4. Enable GitHub Pages in the repository settings or run the `Deploy Frontend to GitHub Pages` workflow.

If you trigger the workflow manually, you can pass the backend API URL as the `backend_api_url` input so the site is deployed with the correct API endpoint.

## 👤 Test Credentials

Use these credentials to test the system:

### Admin Account
- **Username:** admin
- **Password:** admin123

### Student Accounts
- **Student 1:**
  - Username: student1
  - Password: pass123
  
- **Student 2:**
  - Username: student2
  - Password: pass123

## 📱 Using the Application

### 1. Signup/Login
- New users: Click "Sign Up" and fill the form
- Existing users: Click "Login" and enter credentials

### 2. Browse Books
- Click "Browse Books" in navigation
- View all available books in grid format
- Search by title, author, or category
- Click on book card to see details

### 3. Borrow a Book
- Click "Borrow Now" button on book card
- Confirm in modal dialog
- System automatically sets due date (14 days)

### 4. My Books
- Click "My Books" to view borrowed books
- See borrowed date and due date
- Click "Return" to return a book
- View return history and fines

### 5. Logout
- Click "Logout" button in top-right corner
- Session ends and user returns to login page

## 📚 Sample Data

The database comes pre-loaded with:

**Books (100+ total):**
1. The Prophet - Kahlil Gibran
2. A Brief History of Time - Stephen Hawking
3. The Great Gatsby - F. Scott Fitzgerald
4. Introduction to Algorithms - Cormen, Leiserson, Rivest
5. Thinking, Fast and Slow - Daniel Kahneman
 And much more....

**Users (3 total):**
- 1 Admin account
- 2 Student accounts

## 🗂 Project Structure

```
library-system/
│
├── backend/                          # Node.js/Express Backend
│   ├── server.js                    # Main server file with all API routes
│   ├── package.json                 # Node dependencies
│   ├── .env                         # Environment configuration (create if needed)
│   └── README.md                    # Backend documentation
│
├── frontend/                         # Web UI
│   ├── index.html                   # Main HTML file with all pages
│   ├── styles.css                   # All styling and responsive design
│   ├── script.js                    # JavaScript logic and API calls
│   └── README.md                    # Frontend documentation
│
├── database/                         # Database files
│   ├── library_schema.sql           # Database schema and sample data
│   └── README.md                    # Database documentation
│
├── documentation/                    # Project documentation
│   ├── SRS.md                       # Software Requirements Specification
│   ├── ER_DIAGRAM.txt               # Entity Relationship Diagram
│   └── API_DOCUMENTATION.md         # API endpoints documentation
│
└── README.md                        # This file
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Create new user account
POST   /api/auth/login       - Login with credentials
POST   /api/auth/logout      - Logout current user
GET    /api/auth/me          - Get current user info
```

### Books
```
GET    /api/books            - Get all available books
GET    /api/books/:id        - Get single book details
POST   /api/books            - Add new book (Admin only)
```

### Borrowing
```
POST   /api/borrow           - Borrow a book
POST   /api/return           - Return a borrowed book
GET    /api/mybooks          - Get user's borrowed books
```

For detailed API documentation, see `documentation/API_DOCUMENTATION.md`

## 🐛 Troubleshooting

### Issue: "MySQL Connection Failed"
**Solution:**
- Verify MySQL server is running
- Check MySQL credentials in server.js
- Ensure database `library_system` exists
- Run database schema again: `source database/library_schema.sql`

### Issue: "Cannot find module 'express'"
**Solution:**
- Navigate to backend folder: `cd backend`
- Install dependencies: `npm install`

### Issue: "Port 5000 already in use"
**Solution:**
- Close the application using port 5000
- Or change PORT in server.js and .env file
- Restart the server

### Issue: "Frontend not connecting to backend"
**Solution:**
- Verify backend server is running on port 5000
- Check browser console for errors (F12)
- Ensure API_URL in script.js is correct
- Check CORS is enabled in server.js

### Issue: "Images not loading in browser"
**Solution:**
- Use Live Server instead of direct file open
- Check browser console for path errors
- Verify frontend folder structure

## 🔒 Security Features

✅ Password hashing with bcrypt
✅ SQL injection prevention (parameterized queries)
✅ XSS prevention (HTML escaping)
✅ CORS enabled for API security
✅ Session-based authentication
✅ HTTP-only cookies
✅ Input validation on all endpoints
✅ Referential integrity with foreign keys

## 📊 Database Design

### USERS Table
- user_id (Primary Key)
- username, email (Unique)
- password (Hashed)
- full_name, phone, user_type
- created_at timestamp

### BOOKS Table
- book_id (Primary Key)
- title, author, isbn (Unique)
- category, publication_year
- quantity_available, quantity_total
- description

### BORROWING_RECORDS Table
- record_id (Primary Key)
- user_id, book_id (Foreign Keys)
- borrowed_date, due_date, return_date
- status (borrowed/returned)
- fine_amount

## 📖 SDLC Phases Implemented

### 1. Planning & Requirement Analysis ✅
- Functional and non-functional requirements
- Use case diagrams
- User stories

### 2. Design ✅
- Database design (ER Diagram)
- System architecture
- API design
- UI mockups
- Security design

### 3. Implementation ✅
- Frontend development
- Backend development
- Database creation
- API endpoints
- Testing

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User can signup with valid data
- [ ] Duplicate username rejected
- [ ] Duplicate email rejected
- [ ] User can login with correct password
- [ ] User rejected with wrong password
- [ ] User can logout

#### Books
- [ ] All books displayed on browse page
- [ ] Search filters books correctly
- [ ] Book details modal shows all information
- [ ] Unavailable books show as unavailable
- [ ] Quantity updates after borrow/return

#### Borrowing
- [ ] User can borrow available book
- [ ] Due date set to 14 days from today
- [ ] Cannot borrow unavailable book
- [ ] User can return borrowed book
- [ ] Fine calculated for overdue books
- [ ] Book quantity restored after return

#### UI/UX
- [ ] Pages load correctly
- [ ] Navigation works smoothly
- [ ] Mobile responsive
- [ ] Error messages display properly
- [ ] Success messages display properly

## 📝 Documentation

Complete documentation includes:

1. **SRS.md** - Software Requirements Specification
   - Project overview
   - Functional requirements
   - Non-functional requirements
   - Use cases
   - Design specifications

2. **Database Schema** - library_schema.sql
   - Table definitions
   - Sample data
   - Indexes and constraints

3. **API Documentation** - Detailed endpoint descriptions

4. **This README** - Setup and usage instructions

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- Database design and normalization
- RESTful API design
- Authentication and authorization
- Security best practices
- Software Engineering principles
- SDLC methodology
- Professional code organization

## 📌 Important Notes

1. **Default Port:** Backend runs on port 5000
2. **Database:** Ensure MySQL is running before starting backend
3. **CORS:** Enabled to allow frontend-backend communication
4. **Sessions:** Using in-memory session storage (not production-ready)
5. **Password:** Default MySQL password is empty (modify if needed)

## 🤝 Contributing

To add features or improve:
1. Create a new branch
2. Make changes following code standards
3. Test thoroughly
4. Document changes
5. Submit for review

## 📄 License

This project is created for educational purposes as part of Software Engineering coursework.

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review database logs
3. Check browser console for errors
4. Verify all prerequisites are installed

## ✨ Features Highlights

🎨 **Modern Professional UI**
- Clean, intuitive interface
- Responsive mobile design
- Smooth animations and transitions

🔐 **Secure Authentication**
- Bcrypt password hashing
- Session-based auth
- Input validation

📊 **Complete Database**
- Normalized schema
- Foreign key relationships
- Indexes for performance

🚀 **RESTful API**
- Clear endpoint structure
- Proper HTTP methods
- Error handling

💾 **Data Persistence**
- MySQL database
- Transaction support
- Data integrity

## 🎯 Future Roadmap

- [ ] Advanced search filters
- [ ] Book reviews and ratings
- [ ] Book recommendations
- [ ] Email notifications
- [ ] Admin dashboard with analytics
- [ ] Payment integration for fines
- [ ] Mobile app (React Native)
- [ ] Book pre-orders/reservations

---

**Project Status:** ✅ Complete and Ready for Deployment

**Last Updated:** May 2026

**Version:** 1.0.0

For more detailed documentation, see the `documentation/` folder.
