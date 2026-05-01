-- Library Management System Database Schema
-- Created: May 2026
-- Database: MySQL

-- Create Database
CREATE DATABASE IF NOT EXISTS library_system;
USE library_system;

-- Users Table (Students/Members)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    user_type ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Books Table
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    publication_year INT,
    quantity_available INT DEFAULT 0,
    quantity_total INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowing Records Table
CREATE TABLE borrowing_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed',
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- Create Index for faster queries
CREATE INDEX idx_user_id ON borrowing_records(user_id);
CREATE INDEX idx_book_id ON borrowing_records(book_id);
CREATE INDEX idx_status ON borrowing_records(status);

-- Sample Data: Users
INSERT INTO users (username, email, password, full_name, phone, user_type) VALUES
('admin', 'admin@library.com', 'admin123', 'Admin User', '1234567890', 'admin'),
('student1', 'student1@email.com', 'pass123', 'Ahmed Khan', '9876543210', 'student'),
('student2', 'student2@email.com', 'pass123', 'Fatima Ali', '8765432109', 'student'),
('ahsan', '20csm2k25@gmail.com', 'pass123', 'Ahsan Ali', '', 'student');

-- Sample Data: Books
INSERT INTO books (title, author, isbn, category, publication_year, quantity_available, quantity_total, description) VALUES
('The Prophet', 'Kahlil Gibran', '978-0-394-40452-8', 'Philosophy', 1923, 3, 3, 'Inspiring philosophical work about life and spirituality'),
('A Brief History of Time', 'Stephen Hawking', '978-0-553-38016-3', 'Science', 1988, 2, 2, 'Exploration of space, time, and the universe'),
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Literature', 1925, 4, 4, 'Classic American novel about ambition and love'),
('Introduction to Algorithms', 'Cormen, Leiserson, Rivest', '978-0-262-03384-8', 'Computer Science', 2009, 2, 2, 'Comprehensive guide to algorithms and data structures'),
('Thinking, Fast and Slow', 'Daniel Kahneman', '978-0-374-27563-1', 'Psychology', 2011, 1, 1, 'Exploration of human thinking and decision making');
