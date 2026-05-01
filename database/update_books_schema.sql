-- Update Library System - Add Book Cover Images and Enhanced Categories
-- Created: May 2026

USE library_system;

-- Add image_url column to books table
ALTER TABLE books ADD COLUMN cover_image_url TEXT AFTER description;

-- Clear existing sample books
DELETE FROM borrowing_records WHERE book_id > 0;
DELETE FROM books WHERE book_id > 0;

-- Insert Enhanced Sample Data with Categories and Images
INSERT INTO books (title, author, isbn, category, publication_year, quantity_available, quantity_total, description, cover_image_url) VALUES

-- Computer Science Books
('Introduction to Algorithms', 'Cormen, Leiserson, Rivest', '978-0-262-03384-8', 'Computer Science', 2009, 3, 3, 
'The most comprehensive guide to algorithms in computer science. Essential reading for every programmer.',
'https://images-na.ssl-images-amazon.com/images/P/0262033844.01.L.jpg'),

('Design Patterns', 'Gang of Four', '978-0-201-63361-0', 'Computer Science', 1994, 2, 2, 
'Essential patterns for object-oriented software design. A must-read for software architects.',
'https://images-na.ssl-images-amazon.com/images/P/0201633612.01.L.jpg'),

('Clean Code', 'Robert C. Martin', '978-0-132-35088-2', 'Computer Science', 2008, 3, 3, 
'Learn how to write clean, readable, and maintainable code. Industry standard for code quality.',
'https://images-na.ssl-images-amazon.com/images/P/0132350882.01.L.jpg'),

('The Pragmatic Programmer', 'Hunt & Thomas', '978-0-201-61622-4', 'Computer Science', 1999, 2, 2, 
'Practical programming advice from experienced developers. Tips and tricks for daily coding challenges.',
'https://images-na.ssl-images-amazon.com/images/P/0201616224.01.L.jpg'),

-- Business & Management
('The Lean Startup', 'Eric Ries', '978-0-307-88789-4', 'Business', 2011, 2, 2, 
'Revolutionizing how new ventures are created and managed. The ultimate guide to business innovation.',
'https://images-na.ssl-images-amazon.com/images/P/0307887898.01.L.jpg'),

('Good to Great', 'Jim Collins', '978-0-06-662099-2', 'Business', 2001, 2, 2, 
'Why some companies make the leap and others don''t. Strategic insights for organizational excellence.',
'https://images-na.ssl-images-amazon.com/images/P/0066620996.01.L.jpg'),

-- Science & Technology
('A Brief History of Time', 'Stephen Hawking', '978-0-553-38016-3', 'Science', 1988, 3, 3, 
'From the Big Bang to Black Holes. Understanding the universe and our place in it.',
'https://images-na.ssl-images-amazon.com/images/P/0553380163.01.L.jpg'),

('Cosmos', 'Carl Sagan', '978-0-394-50294-5', 'Science', 1980, 2, 2, 
'A journey through space and time. Explore the wonders of the universe with a legendary scientist.',
'https://images-na.ssl-images-amazon.com/images/P/0394502949.01.L.jpg'),

-- Literature & Philosophy
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Literature', 1925, 4, 4, 
'Classic American novel exploring dreams, wealth, and the American Dream.',
'https://images-na.ssl-images-amazon.com/images/P/0743273563.01.L.jpg'),

('The Prophet', 'Kahlil Gibran', '978-0-394-40452-8', 'Philosophy', 1923, 3, 3, 
'Inspiring philosophical reflections on life, love, freedom, and human existence.',
'https://images-na.ssl-images-amazon.com/images/P/0394404521.01.L.jpg'),

-- Psychology & Self-Help
('Thinking, Fast and Slow', 'Daniel Kahneman', '978-0-374-27563-1', 'Psychology', 2011, 3, 3, 
'Explore the two systems of human thought and understand how we make decisions.',
'https://images-na.ssl-images-amazon.com/images/P/0374275633.01.L.jpg'),

('Atomic Habits', 'James Clear', '978-0-735-21141-3', 'Self-Help', 2018, 4, 4, 
'Tiny changes, remarkable results. The revolutionary system for building good habits and breaking bad ones.',
'https://images-na.ssl-images-amazon.com/images/P/0735211418.01.L.jpg');
