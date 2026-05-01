# API Documentation
## Library Management System - REST API Reference

**Base URL:** `http://localhost:5000/api`

---

## Authentication Endpoints

### 1. Signup (Create New User)
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "student1",
  "email": "student1@email.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "1234567890"
}
```

**Response (Success - 201):**
```json
{
  "message": "Signup successful! Please login."
}
```

**Response (Error - 400):**
```json
{
  "message": "Username or email already exists"
}
```

**Validation:**
- username: Required, unique, alphanumeric
- email: Required, valid email format, unique
- password: Required, minimum 6 characters recommended
- full_name: Required
- phone: Optional

---

### 2. Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "student1",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "user": {
    "user_id": 1,
    "username": "student1",
    "full_name": "John Doe",
    "user_type": "student"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid username or password"
}
```

**Notes:**
- Creates session cookie automatically
- Use credentials: include for subsequent requests

---

### 3. Logout
**Endpoint:** `POST /auth/logout`

**Request Body:** (Empty)

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

**Notes:**
- Destroys user session
- Clears session cookie

---

### 4. Get Current User
**Endpoint:** `GET /auth/me`

**Request Headers:**
```
Cookie: connect.sid=<session_id>
```

**Response (Success - 200):**
```json
{
  "user_id": 1,
  "username": "student1"
}
```

**Response (Error - 401):**
```json
{
  "message": "Not authenticated"
}
```

---

## Books Endpoints

### 1. Get All Books
**Endpoint:** `GET /books`

**Query Parameters:**
- `category` (optional): Filter by category
- `available` (optional): true/false for availability filter

**Response (Success - 200):**
```json
[
  {
    "book_id": 1,
    "title": "The Prophet",
    "author": "Kahlil Gibran",
    "isbn": "978-0-394-40452-8",
    "category": "Philosophy",
    "publication_year": 1923,
    "quantity_available": 3,
    "quantity_total": 3,
    "description": "Inspiring philosophical work..."
  },
  {
    "book_id": 2,
    "title": "A Brief History of Time",
    "author": "Stephen Hawking",
    "isbn": "978-0-553-38016-3",
    "category": "Science",
    "publication_year": 1988,
    "quantity_available": 2,
    "quantity_total": 2,
    "description": "Exploration of space, time..."
  }
]
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/books
```

---

### 2. Get Single Book
**Endpoint:** `GET /books/:id`

**URL Parameters:**
- `id` (required): Book ID

**Response (Success - 200):**
```json
{
  "book_id": 1,
  "title": "The Prophet",
  "author": "Kahlil Gibran",
  "isbn": "978-0-394-40452-8",
  "category": "Philosophy",
  "publication_year": 1923,
  "quantity_available": 3,
  "quantity_total": 3,
  "description": "Inspiring philosophical work about life and spirituality"
}
```

**Response (Error - 404):**
```json
{
  "message": "Book not found"
}
```

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/books/1
```

---

### 3. Add New Book (Admin Only)
**Endpoint:** `POST /books`

**Request Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0-13-235088-4",
  "category": "Programming",
  "publication_year": 2008,
  "quantity_total": 5,
  "description": "A handbook of agile software craftsmanship"
}
```

**Response (Success - 201):**
```json
{
  "message": "Book added successfully"
}
```

**Response (Error - 403):**
```json
{
  "message": "Admin access required"
}
```

**Response (Error - 400):**
```json
{
  "message": "Missing required fields"
}
```

---

## Borrowing Endpoints

### 1. Borrow a Book
**Endpoint:** `POST /borrow`

**Request Body:**
```json
{
  "book_id": 1
}
```

**Response (Success - 201):**
```json
{
  "message": "Book borrowed successfully! Due date: Mon May 15 2026"
}
```

**Response (Error - 400):**
```json
{
  "message": "Book not available"
}
```

**Response (Error - 401):**
```json
{
  "message": "Please login first"
}
```

**Business Logic:**
- Reduces book quantity by 1
- Creates borrowing record with status: 'borrowed'
- Sets due date to 14 days from today
- Returns success message with due date

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/borrow \
  -H "Content-Type: application/json" \
  -d '{"book_id": 1}' \
  --cookie "connect.sid=<session_id>"
```

---

### 2. Return a Book
**Endpoint:** `POST /return`

**Request Body:**
```json
{
  "record_id": 5
}
```

**Response (Success - 200):**
```json
{
  "message": "Book returned successfully!"
}
```

**Response (with Fine - 200):**
```json
{
  "message": "Book returned successfully. Fine: 5 units for 5 days late"
}
```

**Response (Error - 404):**
```json
{
  "message": "Borrowing record not found"
}
```

**Business Logic:**
- Records return date as today
- Checks if return date exceeds due date
- Calculates fine as 1 unit per day late
- Updates record status to 'returned'
- Increases book quantity by 1

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/return \
  -H "Content-Type: application/json" \
  -d '{"record_id": 5}' \
  --cookie "connect.sid=<session_id>"
```

---

### 3. Get User's Books
**Endpoint:** `GET /mybooks`

**Response (Success - 200):**
```json
[
  {
    "record_id": 1,
    "book_id": 1,
    "title": "The Prophet",
    "author": "Kahlil Gibran",
    "borrowed_date": "2026-05-01T10:30:00.000Z",
    "due_date": "2026-05-15",
    "return_date": null,
    "status": "borrowed",
    "fine_amount": 0
  },
  {
    "record_id": 2,
    "book_id": 2,
    "title": "A Brief History of Time",
    "author": "Stephen Hawking",
    "borrowed_date": "2026-04-15T09:00:00.000Z",
    "due_date": "2026-04-29",
    "return_date": "2026-04-30",
    "status": "returned",
    "fine_amount": 1
  }
]
```

**Response (Error - 401):**
```json
{
  "message": "Please login first"
}
```

**Response (Empty - 200):**
```json
[]
```

---

## Error Handling

### Standard Error Responses

**400 - Bad Request**
```json
{
  "message": "Missing required fields"
}
```

**401 - Unauthorized**
```json
{
  "message": "Please login first"
}
```

**403 - Forbidden**
```json
{
  "message": "Admin access required"
}
```

**404 - Not Found**
```json
{
  "message": "Book not found"
}
```

**500 - Server Error**
```json
{
  "message": "Server error during operation"
}
```

---

## Request/Response Headers

### Standard Request Headers
```
Content-Type: application/json
Cookie: connect.sid=<session_id>
```

### Standard Response Headers
```
Content-Type: application/json
Set-Cookie: connect.sid=<session_id>
```

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"pass123"}' \
  -c cookies.txt
```

### Browse Books
```bash
curl -X GET http://localhost:5000/api/books \
  -b cookies.txt
```

### Borrow Book
```bash
curl -X POST http://localhost:5000/api/borrow \
  -H "Content-Type: application/json" \
  -d '{"book_id":1}' \
  -b cookies.txt
```

### View My Books
```bash
curl -X GET http://localhost:5000/api/mybooks \
  -b cookies.txt
```

### Return Book
```bash
curl -X POST http://localhost:5000/api/return \
  -H "Content-Type: application/json" \
  -d '{"record_id":1}' \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## Rate Limiting & Throttling

Currently not implemented. For production, implement:
- Rate limiting: 100 requests per minute per IP
- Request timeout: 30 seconds
- Max payload size: 1MB

---

## Authentication Flow

1. User signs up with credentials
2. User logs in with username/password
3. Server creates session and sends session cookie
4. Client includes cookie in subsequent requests
5. Server validates session on each request
6. User logs out to destroy session

---

## Data Validation Rules

**Username:**
- Length: 3-50 characters
- Characters: Alphanumeric + underscore
- Unique in database

**Email:**
- Valid email format
- Unique in database

**Password:**
- Length: 6+ characters recommended
- Should include mixed case and numbers
- Hashed with bcrypt before storage

**Book ISBN:**
- Unique in database
- Standard ISBN format

---

## API Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/POST |
| 201 | Created | New resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database/server error |

---

## Performance Notes

- Database queries use indexes on frequently used columns
- Borrowing records sorted by date (most recent first)
- Search operations optimized with LIKE queries
- Session cookies auto-destroy after inactivity

---

**API Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Production Ready
