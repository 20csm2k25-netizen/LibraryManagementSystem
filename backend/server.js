// Library Management System - Backend Server
// Created: May 2026

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'library-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Database Connection
pool.getConnection()
  .then(connection => {
    console.log('✓ MySQL Connected Successfully');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database Connection Failed:', err.message);
  });

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Signup - Create New User
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, full_name, phone } = req.body;

    // Validate input
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const connection = await pool.getConnection();

    // Check if user already exists
    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.query(
      'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, phone || '']
    );

    connection.release();
    return res.status(201).json({ message: 'Signup successful! Please login.' });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login - Authenticate User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const connection = await pool.getConnection();

    // Get user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // Support legacy seeded users with plain-text passwords and upgrade them on first login.
    const storedPassword = user.password || '';
    const isBcryptHash = /^\$2[aby]?\$/.test(storedPassword);
    let passwordMatch = false;

    if (isBcryptHash) {
      passwordMatch = await bcrypt.compare(password, storedPassword);
    } else {
      passwordMatch = password === storedPassword;

      if (passwordMatch) {
        const upgradedPassword = await bcrypt.hash(password, 10);
        await connection.query(
          'UPDATE users SET password = ? WHERE user_id = ?',
          [upgradedPassword, user.user_id]
        );
      }
    }

    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    connection.release();

    // Store user in session
    req.session.userId = user.user_id;
    req.session.username = user.username;
    req.session.fullName = user.full_name;
    req.session.userType = user.user_type;

    return res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        user_type: user.user_type
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    return res.json({ message: 'Logged out successfully' });
  });
});

// Get Current User
app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  pool.query(
    'SELECT user_id, username, full_name FROM users WHERE user_id = ?',
    [req.session.userId]
  )
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = rows[0];
      res.json({
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name || user.username
      });
    })
    .catch((error) => {
      console.error('Get Current User Error:', error);
      res.status(500).json({ message: 'Error retrieving current user' });
    });
});

// ============================================
// BOOKS ROUTES
// ============================================

// Get All Available Books
app.get('/api/books', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [books] = await connection.query('SELECT * FROM books WHERE quantity_available > 0');
    connection.release();
    res.json(books);
  } catch (error) {
    console.error('Get Books Error:', error);
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get Single Book
app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [books] = await connection.query('SELECT * FROM books WHERE book_id = ?', [id]);
    connection.release();

    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(books[0]);
  } catch (error) {
    console.error('Get Book Error:', error);
    res.status(500).json({ message: 'Error retrieving book' });
  }
});

// Add New Book (Admin Only)
app.post('/api/books', async (req, res) => {
  try {
    if (req.session.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, author, isbn, category, publication_year, quantity_total, description } = req.body;

    if (!title || !author || !isbn || !quantity_total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO books (title, author, isbn, category, publication_year, quantity_available, quantity_total, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, isbn, category, publication_year || 2026, quantity_total, quantity_total, description || '']
    );
    connection.release();

    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    console.error('Add Book Error:', error);
    res.status(500).json({ message: 'Error adding book' });
  }
});

// ============================================
// BORROWING ROUTES
// ============================================

// Borrow a Book
app.post('/api/borrow', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const { book_id } = req.body;
    const user_id = req.session.userId;

    if (!book_id) {
      return res.status(400).json({ message: 'Book ID required' });
    }

    const connection = await pool.getConnection();

    // Check if student already borrowed 3 books (borrow limit)
    const [borrowedBooks] = await connection.query(
      'SELECT COUNT(*) as count FROM borrowing_records WHERE user_id = ? AND return_date IS NULL',
      [user_id]
    );

    if (borrowedBooks[0].count >= 3) {
      connection.release();
      return res.status(400).json({ message: 'You have reached the maximum limit of 3 borrowed books' });
    }

    // Check if book exists and has copies available
    const [books] = await connection.query(
      'SELECT * FROM books WHERE book_id = ? AND quantity_available > 0',
      [book_id]
    );

    if (books.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Book not available' });
    }

    // Calculate due date (14 days from now)
    const today = new Date();
    const dueDate = new Date(today.setDate(today.getDate() + 14));

    // Create borrowing record
    await connection.query(
      'INSERT INTO borrowing_records (user_id, book_id, due_date) VALUES (?, ?, ?)',
      [user_id, book_id, dueDate.toISOString().split('T')[0]]
    );

    // Update book quantity
    await connection.query(
      'UPDATE books SET quantity_available = quantity_available - 1 WHERE book_id = ?',
      [book_id]
    );

    connection.release();
    res.status(201).json({ message: 'Book borrowed successfully! Due date: ' + dueDate.toDateString() });

  } catch (error) {
    console.error('Borrow Error:', error);
    res.status(500).json({ message: 'Error borrowing book' });
  }
});

// Return a Book
app.post('/api/return', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const { record_id } = req.body;
    const user_id = req.session.userId;

    if (!record_id) {
      return res.status(400).json({ message: 'Record ID required' });
    }

    const connection = await pool.getConnection();

    // Get borrowing record
    const [records] = await connection.query(
      'SELECT * FROM borrowing_records WHERE record_id = ? AND user_id = ?',
      [record_id, user_id]
    );

    if (records.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Borrowing record not found' });
    }

    const record = records[0];
    const returnDate = new Date();
    const dueDate = new Date(record.due_date);
    let fine = 0;

    // Calculate fine if late (1 unit per day)
    if (returnDate > dueDate) {
      const daysLate = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 1; // 1 unit currency per day
    }

    // Update borrowing record
    await connection.query(
      'UPDATE borrowing_records SET return_date = ?, status = ?, fine_amount = ? WHERE record_id = ?',
      [returnDate.toISOString().split('T')[0], 'returned', fine, record_id]
    );

    // Update book quantity
    await connection.query(
      'UPDATE books SET quantity_available = quantity_available + 1 WHERE book_id = ?',
      [record.book_id]
    );

    connection.release();

    const message = fine > 0 
      ? `Book returned successfully. Fine: ${fine} units for ${Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24))} days late`
      : 'Book returned successfully!';

    res.json({ message });

  } catch (error) {
    console.error('Return Error:', error);
    res.status(500).json({ message: 'Error returning book' });
  }
});

// Get User's Borrowed Books
app.get('/api/mybooks', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const connection = await pool.getConnection();
    const [records] = await connection.query(
      `SELECT br.record_id, b.book_id, b.title, b.author, br.borrowed_date, br.due_date, br.status, br.fine_amount
       FROM borrowing_records br
       JOIN books b ON br.book_id = b.book_id
       WHERE br.user_id = ?
       ORDER BY br.borrowed_date DESC`,
      [req.session.userId]
    );
    connection.release();
    res.json(records);

  } catch (error) {
    console.error('Get My Books Error:', error);
    res.status(500).json({ message: 'Error retrieving your books' });
  }
});

// Get Dashboard Stats
app.get('/api/stats', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const connection = await pool.getConnection();

    // Total books available
    const [totalBooks] = await connection.query(
      'SELECT COUNT(*) as count FROM books WHERE quantity_available > 0'
    );

    // Books borrowed by user (not returned)
    const [borrowedBooks] = await connection.query(
      'SELECT COUNT(*) as count FROM borrowing_records WHERE user_id = ? AND status = "borrowed"',
      [req.session.userId]
    );

    // Books due soon (next 7 days, not returned)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [dueBooks] = await connection.query(
      'SELECT COUNT(*) as count FROM borrowing_records WHERE user_id = ? AND status = "borrowed" AND due_date <= ? AND due_date >= ?',
      [req.session.userId, nextWeek.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );

    connection.release();

    res.json({
      booksAvailable: totalBooks[0].count,
      booksBorrowed: borrowedBooks[0].count,
      booksDueSoon: dueBooks[0].count
    });

  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ message: 'Error retrieving stats' });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`📚 Library Management System Backend`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`========================================\n`);
});
