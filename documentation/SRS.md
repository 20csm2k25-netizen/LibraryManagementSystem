# Library Management System
## Software Requirements Specification (SRS)

**Document Version:** 1.0  
**Date Created:** May 2026  
**Author:** Student  
**Course:** Software Engineering  

---

## 1. INTRODUCTION

### 1.1 Purpose
This document specifies the requirements for a **Library Management System** that enables students to borrow and return books from an online library platform. The system follows Software Engineering principles and implements the complete Software Development Life Cycle (SDLC).

### 1.2 Scope
The Library Management System is a web-based application with the following key features:
- User Registration and Authentication (Signup/Login)
- Book Browsing and Search
- Book Borrowing System (14-day lending period)
- Book Return System with Fine Calculation
- User Dashboard to Track Borrowed Books
- Admin Panel for Book Management (Basic)

### 1.3 Document Organization
This SRS document is organized in phases following the SDLC model:
- **Planning & Requirement Analysis**
- **Design Phase**
- **Implementation Phase**

---

## 2. PLANNING & REQUIREMENT ANALYSIS PHASE

### 2.1 Project Overview
**Project Name:** Library Management System  
**Project Type:** Web Application  
**Platform:** Cross-platform (accessible on Windows, Mac, Linux)  
**Technology Stack:**
- Frontend: HTML5, CSS3, JavaScript (ES6)
- Backend: Node.js with Express.js
- Database: MySQL
- Server: Local/Cloud hosting

### 2.2 Stakeholders
- **Students:** Primary users who borrow and return books
- **Librarian/Admin:** Manages book inventory
- **Faculty:** May supervise the system

### 2.3 Business Requirements

#### 2.3.1 Functional Requirements

**FR-1: User Registration (Signup)**
- User must provide: Username, Email, Full Name, Phone (optional), Password
- System must validate email uniqueness
- System must validate username uniqueness
- System must hash and securely store passwords
- Acceptance Criteria: User can successfully create account and receive confirmation

**FR-2: User Authentication (Login)**
- User must enter valid username and password
- System must verify credentials against database
- System must create user session on successful login
- System must display error message for invalid credentials
- Acceptance Criteria: Authenticated user can access library features

**FR-3: Browse Books**
- System must display all available books with details (title, author, category, availability)
- User must see book cover placeholder and basic info
- User must be able to search books by title, author, or category
- System must show quantity available in real-time
- Acceptance Criteria: User can view and search books

**FR-4: Borrow Book**
- User must select a book from available list
- System must reduce available quantity by 1
- System must create borrowing record with today's date as borrowed_date
- System must calculate due_date as 14 days from borrowed_date
- System must confirm borrowing with due date information
- Acceptance Criteria: User receives book with due date confirmation

**FR-5: Return Book**
- User must be able to view their borrowed books
- User must click "Return" button for any borrowed book
- System must calculate return_date as today
- System must check if return_date exceeds due_date
- System must calculate fine as 1 unit per day late
- System must increase book availability by 1
- Acceptance Criteria: Book returned and availability updated

**FR-6: Track Borrowed Books**
- User must see list of currently borrowed books
- User must see list of previously returned books
- For each book: Title, Author, Borrowed Date, Due Date, Status
- For returned books: Fine amount if applicable
- Acceptance Criteria: User can track all book transactions

**FR-7: Logout**
- User must click logout button
- System must destroy user session
- System must redirect to login page
- Acceptance Criteria: User successfully logged out

#### 2.3.2 Non-Functional Requirements

**NFR-1: Performance**
- System must load book list within 2 seconds
- Search functionality must return results within 1 second
- Database queries must be optimized with indexes
- Acceptance Criteria: System response time meets requirements

**NFR-2: Security**
- Passwords must be hashed using bcrypt algorithm
- Session must use secure HTTP-only cookies
- Database credentials must not be hardcoded
- Acceptance Criteria: No password stored in plaintext

**NFR-3: Usability**
- Interface must be intuitive and professional
- All functions must be accessible within 3 clicks
- System must work on desktop browsers (Chrome, Firefox, Edge)
- Acceptance Criteria: Users can use system without training

**NFR-4: Reliability**
- System must handle up to 100 concurrent users
- Database must have backup mechanism
- System must log all errors for debugging
- Acceptance Criteria: System uptime > 99%

**NFR-5: Maintainability**
- Code must follow industry standards
- Code must be well-commented
- Architecture must be modular
- Acceptance Criteria: New developers can understand code

### 2.4 Use Cases

#### Use Case-1: Student Signup
**Actor:** New Student  
**Precondition:** Student not registered  
**Main Flow:**
1. Student opens application
2. Student clicks "Sign Up"
3. Student enters username, email, full name, phone, password
4. System validates all fields
5. System creates user account
6. System displays confirmation message

**Postcondition:** Student account created, can login

#### Use Case-2: Student Borrow Book
**Actor:** Registered Student  
**Precondition:** Student logged in, book available  
**Main Flow:**
1. Student navigates to "Browse Books"
2. Student searches or browses books
3. Student clicks "Borrow Now"
4. System creates borrowing record
5. System updates book availability
6. System displays success message with due date

**Postcondition:** Book added to student's borrowed list, availability reduced

#### Use Case-3: Student Return Book
**Actor:** Registered Student  
**Precondition:** Student has borrowed book, logged in  
**Main Flow:**
1. Student navigates to "My Books"
2. Student views currently borrowed books
3. Student clicks "Return" button
4. System records return date
5. System calculates fine if overdue
6. System updates book availability
7. System shows return confirmation

**Postcondition:** Book marked as returned, fine recorded if applicable

### 2.5 System Requirements

**Hardware Requirements:**
- Server: Minimum 2GB RAM, 20GB storage
- Client: Any device with modern web browser

**Software Requirements:**
- Node.js v16 or higher
- MySQL Server 5.7 or higher
- Modern browsers: Chrome 90+, Firefox 88+, Edge 90+

---

## 3. DESIGN PHASE

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────┐
│           CLIENT LAYER (Frontend)                │
│  HTML/CSS/JavaScript - Responsive Web UI        │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/REST API
┌──────────────────▼──────────────────────────────┐
│         APPLICATION LAYER (Backend)              │
│  Express.js Server with Route Handlers           │
│  - Authentication Routes                         │
│  - Book Management Routes                        │
│  - Borrowing Management Routes                   │
└──────────────────┬──────────────────────────────┘
                   │ SQL Queries
┌──────────────────▼──────────────────────────────┐
│         DATA LAYER (Database)                    │
│  MySQL Database with Tables:                     │
│  - users                                          │
│  - books                                          │
│  - borrowing_records                              │
└─────────────────────────────────────────────────┘
```

### 3.2 Database Design

#### 3.2.1 Entity Relationship Diagram (ER Diagram)

```
┌──────────────────────┐         ┌──────────────────────┐
│       USERS          │         │      BOOKS           │
├──────────────────────┤         ├──────────────────────┤
│ user_id (PK)         │         │ book_id (PK)         │
│ username (UNIQUE)    │         │ title                │
│ email (UNIQUE)       │         │ author               │
│ password             │         │ isbn (UNIQUE)        │
│ full_name            │         │ category             │
│ phone                │         │ publication_year     │
│ user_type            │         │ quantity_available   │
│ created_at           │         │ quantity_total       │
│ is_active            │         │ description          │
└──────────────────────┘         │ created_at           │
         │                       └──────────────────────┘
         │ (1:N)                          ▲
         │                               │
         │                         (N:1) │
         │                               │
         └─────────────────────┬─────────┘
                               │
                  ┌────────────▼────────────┐
                  │  BORROWING_RECORDS      │
                  ├────────────────────────┤
                  │ record_id (PK)         │
                  │ user_id (FK)           │
                  │ book_id (FK)           │
                  │ borrowed_date          │
                  │ due_date               │
                  │ return_date            │
                  │ status                 │
                  │ fine_amount            │
                  └────────────────────────┘
```

#### 3.2.2 Table Specifications

**USERS Table:**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| user_id | INT | PK, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User email |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| full_name | VARCHAR(100) | NOT NULL | User full name |
| phone | VARCHAR(15) | NULLABLE | Contact number |
| user_type | ENUM | DEFAULT 'student' | student or admin |
| created_at | TIMESTAMP | DEFAULT NOW | Account creation time |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |

**BOOKS Table:**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| book_id | INT | PK, AUTO_INCREMENT | Unique book identifier |
| title | VARCHAR(255) | NOT NULL | Book title |
| author | VARCHAR(100) | NOT NULL | Book author |
| isbn | VARCHAR(20) | UNIQUE, NOT NULL | ISBN number |
| category | VARCHAR(50) | NOT NULL | Book category |
| publication_year | INT | NULLABLE | Year of publication |
| quantity_available | INT | DEFAULT 0 | Copies available |
| quantity_total | INT | NOT NULL | Total copies |
| description | TEXT | NULLABLE | Book description |
| created_at | TIMESTAMP | DEFAULT NOW | Entry creation time |

**BORROWING_RECORDS Table:**
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| record_id | INT | PK, AUTO_INCREMENT | Unique record ID |
| user_id | INT | FK → users.user_id | Student ID |
| book_id | INT | FK → books.book_id | Book ID |
| borrowed_date | TIMESTAMP | NOT NULL | Borrow date/time |
| due_date | DATE | NOT NULL | Return due date |
| return_date | DATE | NULLABLE | Actual return date |
| status | ENUM | DEFAULT 'borrowed' | 'borrowed' or 'returned' |
| fine_amount | DECIMAL(10,2) | DEFAULT 0 | Late fee if applicable |

### 3.3 API Design

#### 3.3.1 Authentication Endpoints

**POST /api/auth/signup**
- Request: `{ username, email, password, full_name, phone }`
- Response: `{ message: "Signup successful" }`
- Status: 201 Created / 400 Bad Request

**POST /api/auth/login**
- Request: `{ username, password }`
- Response: `{ message, user: { user_id, username, full_name } }`
- Status: 200 OK / 401 Unauthorized

**POST /api/auth/logout**
- Response: `{ message: "Logged out successfully" }`
- Status: 200 OK

**GET /api/auth/me**
- Response: `{ user_id, username }`
- Status: 200 OK / 401 Unauthorized

#### 3.3.2 Books Endpoints

**GET /api/books**
- Response: `[{ book_id, title, author, category, quantity_available, ... }]`
- Status: 200 OK

**GET /api/books/:id**
- Response: Single book object
- Status: 200 OK / 404 Not Found

**POST /api/books** (Admin only)
- Request: `{ title, author, isbn, category, quantity_total, description }`
- Response: `{ message: "Book added" }`
- Status: 201 Created / 403 Forbidden

#### 3.3.3 Borrowing Endpoints

**POST /api/borrow**
- Request: `{ book_id }`
- Response: `{ message: "Borrowed successfully", due_date }`
- Status: 201 Created / 400 Bad Request / 401 Unauthorized

**POST /api/return**
- Request: `{ record_id }`
- Response: `{ message: "Returned successfully" }`
- Status: 200 OK / 404 Not Found / 401 Unauthorized

**GET /api/mybooks**
- Response: `[{ record_id, book_id, title, author, status, fine_amount, ... }]`
- Status: 200 OK / 401 Unauthorized

### 3.4 User Interface Design

#### 3.4.1 Page Layouts

**Login/Signup Page:**
- Two-tab interface (Login | Signup)
- Form validation with error messages
- Professional gradient background
- Responsive mobile design

**Home Page:**
- Welcome section with hero image
- Feature cards (Browse, Borrow, Track)
- Call-to-action button to browse books

**Browse Books Page:**
- Search bar for filtering
- Grid layout showing book cards
- Each card: Title, Author, Category, Availability, Borrow button
- Book modal with detailed information

**My Books Page:**
- Two sections: Currently Borrowed | Return History
- Display due dates with overdue indicators
- Return button for borrowed books
- Fine amount display for returned books

**Navigation Bar:**
- Logo and branding
- Navigation links: Home, Browse Books, My Books, Logout
- Responsive hamburger menu for mobile

### 3.5 Security Design

**Authentication & Authorization:**
- Passwords hashed with bcrypt (salt rounds: 10)
- Session-based authentication with HTTP-only cookies
- User validation on every protected endpoint

**Data Protection:**
- SQL injection prevention using parameterized queries
- XSS prevention through HTML escaping
- CORS enabled for API requests
- No sensitive data in URLs

**Database:**
- Foreign key constraints to maintain referential integrity
- Indexes on frequently queried columns
- Automatic timestamps for audit trails

---

## 4. IMPLEMENTATION PHASE

### 4.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5/CSS3/JavaScript | User interface |
| Backend | Node.js + Express.js | API server |
| Database | MySQL | Data persistence |
| Security | bcryptjs | Password hashing |
| Middleware | CORS, Body-Parser | Request handling |

### 4.2 Project Structure

```
library-system/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── database/
│   └── library_schema.sql
└── documentation/
    └── SRS.md
```

### 4.3 Installation & Setup Instructions

#### 4.3.1 Database Setup

1. Install MySQL Server
2. Open MySQL command line
3. Run: `source database/library_schema.sql`
4. Verify tables created:
   ```sql
   USE library_system;
   SHOW TABLES;
   ```

#### 4.3.2 Backend Setup

1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file (if needed):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=library_system
   ```
4. Start server: `npm start` or `npm run dev`
5. Verify: Server should be running on http://localhost:5000

#### 4.3.3 Frontend Setup

1. Navigate to frontend folder: `cd frontend`
2. Open `index.html` in a web browser
3. Or use a local server:
   - Python 3: `python -m http.server 8000`
   - Or use VS Code Live Server extension
4. Access at: http://localhost:3000 (or browser port)

### 4.4 Testing Scenarios

#### Test Case-1: User Signup
- **Input:** Valid username, email, password, full_name
- **Expected:** User account created, message displayed
- **Status:** ✓ Pass

#### Test Case-2: User Login
- **Input:** Valid username and password
- **Expected:** User authenticated, home page displayed
- **Status:** ✓ Pass

#### Test Case-3: Browse Books
- **Input:** User on home page
- **Expected:** All books displayed with availability
- **Status:** ✓ Pass

#### Test Case-4: Search Books
- **Input:** Search term "algorithm"
- **Expected:** Books with "algorithm" in title/author displayed
- **Status:** ✓ Pass

#### Test Case-5: Borrow Book
- **Input:** User clicks borrow on available book
- **Expected:** Book added to user's list, quantity reduced
- **Status:** ✓ Pass

#### Test Case-6: Return Book
- **Input:** User clicks return button
- **Expected:** Book marked returned, fine calculated if overdue
- **Status:** ✓ Pass

### 4.5 Sample Data

Sample users are pre-loaded in database:
- **Admin:** Username: admin, Password: admin123
- **Student1:** Username: student1, Password: pass123
- **Student2:** Username: student2, Password: pass123

Sample books (5 books with 2-4 copies each) are pre-loaded.

---

## 5. KEY FEATURES IMPLEMENTED

✅ User Registration with validation
✅ Secure Login/Authentication
✅ Browse and Search Books
✅ Borrow Books (14-day lending period)
✅ Return Books (with fine calculation)
✅ Track Borrowed Books
✅ View Return History
✅ Professional UI/UX Design
✅ Responsive Mobile Design
✅ Secure Password Storage (bcrypt)
✅ Database with relationships and constraints
✅ RESTful API endpoints
✅ Error handling and validation

---

## 6. FUTURE ENHANCEMENTS

- Book reviews and ratings
- Advance reservations for unavailable books
- Email notifications for due dates
- Admin dashboard with analytics
- Payment integration for fines
- Mobile app (React Native)
- Library announcements and news
- Book recommendations based on history

---

## 7. CONCLUSION

This Library Management System demonstrates a complete Software Engineering project following SDLC principles with:
- **Planning:** Clear requirements and use cases
- **Design:** Database design, API structure, UI mockups
- **Implementation:** Full-stack application with MySQL backend
- **Professional Quality:** Security, validation, error handling

The system is ready for deployment and can be extended with additional features as needed.

---

**Document Status:** Complete  
**Approval Date:** May 2026  
**Next Review:** After first deployment
