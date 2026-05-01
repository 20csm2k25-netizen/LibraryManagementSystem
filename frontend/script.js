// Library Management System - Enhanced Frontend
// API Base URL
const API_URL = resolveApiUrl();

// Global state
let currentUser = null;
let allBooks = [];
let userBooks = [];
let currentFilter = 'all';

// ============================================
// INITIALIZATION
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
});

function resolveApiUrl() {
    const localApiUrl = 'http://localhost:5000/api';
    const storedApiUrl = normalizeApiUrl(localStorage.getItem('API_URL'));
    if (storedApiUrl) {
        return storedApiUrl;
    }

    const configuredApiUrl = normalizeApiUrl(window.APP_CONFIG?.API_URL || window.__API_URL__);
    if (configuredApiUrl) {
        localStorage.setItem('API_URL', configuredApiUrl);
        return configuredApiUrl;
    }

    const isLocalEnvironment = window.location.protocol === 'file:' || ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    if (isLocalEnvironment) {
        return localApiUrl;
    }

    const enteredApiUrl = window.prompt('Enter the deployed backend API URL (for example: https://your-backend.example.com/api):', '');
    const normalizedEnteredUrl = normalizeApiUrl(ensureApiSuffix(enteredApiUrl));
    if (normalizedEnteredUrl) {
        localStorage.setItem('API_URL', normalizedEnteredUrl);
        return normalizedEnteredUrl;
    }

    return '';
}

function normalizeApiUrl(url) {
    return (url || '').trim().replace(/\/$/, '');
}

function ensureApiSuffix(url) {
    const normalizedUrl = normalizeApiUrl(url);
    if (!normalizedUrl) {
        return '';
    }

    return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
}

function apiEndpoint(path) {
    if (!API_URL) {
        throw new Error('Backend API URL is not configured.');
    }

    return `${API_URL}${path}`;
}

async function checkUserSession() {
    try {
        const response = await fetch(apiEndpoint('/auth/me'), {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data;
            showPage('home');
            updateUserProfile();
            loadDashboardData();
        }
    } catch (error) {
        console.error('Session check failed:', error);
    }
}

function updateUserProfile() {
    if (currentUser) {
        const displayName = currentUser.full_name || currentUser.username;
        document.getElementById('userProfile').innerHTML = `
            <div class="user-info">
                <span class="user-icon">👤</span>
                <span class="user-name">${escapeHtml(displayName)}</span>
            </div>
        `;
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch(apiEndpoint('/stats'), {
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.error('Failed to load dashboard stats');
            return;
        }
        
        const stats = await response.json();
        
        // Update dashboard stats
        document.getElementById('totalBooksCount').textContent = stats.booksAvailable;
        document.getElementById('myBooksCount').textContent = stats.booksBorrowed;
        document.getElementById('dueCount').textContent = stats.booksDueSoon;
        
        // Load currently borrowed books
        loadCurrentlyBorrowedBooks();
        
    } catch (error) {
        console.error('Load Dashboard Data Error:', error);
    }
}

// Load Currently Borrowed Books for Dashboard
async function loadCurrentlyBorrowedBooks() {
    try {
        const response = await fetch(apiEndpoint('/mybooks'), {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to load books');
        
        const books = await response.json();
        const borrowedBooks = books.filter(b => b.status === 'borrowed');
        
        const container = document.getElementById('currentBooksContainer');
        if (borrowedBooks.length === 0) {
            container.innerHTML = '<p class="empty-state">No books currently borrowed. Start by browsing our collection!</p>';
            return;
        }
        
        container.innerHTML = borrowedBooks.map(book => `
            <div class="book-row">
                <div class="book-row-info">
                    <h3>${escapeHtml(book.title)}</h3>
                    <p>${escapeHtml(book.author)}</p>
                </div>
                <div>
                    <p><strong>Due:</strong></p>
                    <p style="color: ${isOverdue(book.due_date) ? '#dc2626' : 'inherit'}">
                        ${formatDate(book.due_date)} ${isOverdue(book.due_date) ? '⚠️ OVERDUE' : ''}
                    </p>
                </div>
                <button class="btn-success" onclick="returnBook(${book.record_id})">Return</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Load Currently Borrowed Books Error:', error);
    }
}

// ============================================
// PAGE MANAGEMENT
// ============================================

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // If not authenticated, show auth page
    if (!currentUser && pageName !== 'auth') {
        showAuthPage();
        return;
    }

    // Show requested page
    const pageId = pageName === 'auth' ? 'auth-page' : pageName + '-page';
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        updateUserProfile();

        // Load data when page is shown
        if (pageName === 'home') {
            loadDashboardData();
        } else if (pageName === 'books') {
            loadBooks();
        } else if (pageName === 'mybooks') {
            loadUserBooks();
        }
    }
}

function showAuthPage() {
    document.getElementById('auth-page').classList.add('active');
}

// ============================================
// AUTHENTICATION
// ============================================

function switchAuthMode(mode, evt) {
    // Update buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = (evt && evt.target) || (window.event && window.event.target);
    if (targetBtn && targetBtn.classList) {
        targetBtn.classList.add('active');
    } else {
        const selector = mode === 'login' ? '.toggle-btn:first-child' : '.toggle-btn:last-child';
        const btn = document.querySelector(selector);
        if (btn) btn.classList.add('active');
    }

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    if (mode === 'login') {
        document.getElementById('login-form').classList.add('active');
    } else {
        document.getElementById('signup-form').classList.add('active');
    }
}

// Login Form Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
        const response = await fetch(apiEndpoint('/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.message || 'Login failed';
            errorEl.classList.add('show');
            return;
        }

        currentUser = data.user;
        errorEl.classList.remove('show');
        document.getElementById('login-form').reset();
    updateUserProfile();
        showPage('home');

    } catch (error) {
        console.error('Login Error:', error);
        errorEl.textContent = 'Server error. Please try again.';
        errorEl.classList.add('show');
    }
});

// Signup Form Handler
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const full_name = document.getElementById('signup-fullname').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');

    try {
        const response = await fetch(apiEndpoint('/auth/signup'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, full_name, phone })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.message || 'Signup failed';
            errorEl.classList.add('show');
            return;
        }

        // Show success and switch to login
        alert('✓ ' + data.message);
        document.getElementById('signup-form').reset();
        switchAuthMode('login');
        errorEl.classList.remove('show');

    } catch (error) {
        console.error('Signup Error:', error);
        errorEl.textContent = 'Server error. Please try again.';
        errorEl.classList.add('show');
    }
});

function logout() {
    fetch(apiEndpoint('/auth/logout'), {
        method: 'POST',
        credentials: 'include'
    })
    .then(() => {
        currentUser = null;
        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();
        switchAuthMode('login');
        showAuthPage();
    })
    .catch(error => console.error('Logout Error:', error));
}

// ============================================
// BOOKS MANAGEMENT
// ============================================

async function loadBooks() {
    try {
        const response = await fetch(apiEndpoint('/books'), {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to load books');
        
        allBooks = await response.json();
        displayBooks(allBooks);

    } catch (error) {
        console.error('Load Books Error:', error);
        document.getElementById('books-container').innerHTML = 
            '<p class="empty-state">Failed to load books. Please refresh the page.</p>';
    }
}

function displayBooks(books) {
    const container = document.getElementById('books-container');
    
    if (books.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>📚 No books available</h3><p>Check back soon!</p></div>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.book_id})">
            <div class="book-cover">
                <img src="${getBookCoverUrl(book)}" alt="${escapeHtml(book.title)} cover" onerror="this.onerror=null;this.src='${getFallbackCover(book.title, book.book_id)}';">
                <div class="book-cover-overlay"></div>
            </div>
            <div class="book-info">
                <h3>${escapeHtml(book.title)}</h3>
                <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
                <span class="book-category">${book.category}</span>
                <div class="book-availability ${book.quantity_available > 0 ? '' : 'unavailable'}">
                    ${book.quantity_available > 0 
                        ? `✓ ${book.quantity_available} Available` 
                        : '✗ Not Available'}
                </div>
                <button class="btn-primary" onclick="borrowBook(event, ${book.book_id})" 
                    ${book.quantity_available === 0 ? 'disabled' : ''}>
                    Borrow Now
                </button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    currentFilter = category;

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const activeButton = buttons.find(btn => btn.textContent.trim().toLowerCase().includes(category.toLowerCase())) || buttons[0];
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const filtered = allBooks.filter(book => {
        const matchesSearch = !searchTerm ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm);

        const matchesCategory = category === 'all' || book.category === category;
        return matchesSearch && matchesCategory;
    });

    displayBooks(filtered);
}

function getBookCoverUrl(book) {
    if (book.cover_image_url) {
        return book.cover_image_url;
    }

    if (book.isbn) {
        return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn)}-L.jpg`;
    }

    return getFallbackCover(book.title, book.book_id);
}

function getFallbackCover(title, bookId) {
    const colors = [
        '#2563eb', '#0f766e', '#7c3aed', '#b45309', '#be185d',
        '#1d4ed8', '#047857', '#4c1d95', '#b91c1c', '#0f172a'
    ];
    const color = colors[bookId % colors.length];
    const accent = adjustBrightness(color, -20);
    const safeTitle = escapeHtml(title).replace(/&amp;/g, '&');
    const titleLines = splitTitleForCover(safeTitle);

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
            <defs>
                <linearGradient id="grad${bookId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${color}" />
                    <stop offset="100%" stop-color="${accent}" />
                </linearGradient>
            </defs>
            <rect width="400" height="600" rx="32" fill="url(#grad${bookId})" />
            <rect x="28" y="28" width="344" height="544" rx="24" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="4" />
            <text x="50%" y="45%" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">
                ${titleLines.map((line, index) => `<tspan x="50%" dy="${index === 0 ? 0 : 42}">${line}</tspan>`).join('')}
            </text>
            <text x="50%" y="82%" fill="rgba(255,255,255,0.85)" font-family="Arial, sans-serif" font-size="20" text-anchor="middle">Digital Library</text>
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function adjustBrightness(color, percent) {
    const value = parseInt(color.replace('#', ''), 16);
    const amount = Math.round(2.55 * percent);
    const red = Math.max(0, Math.min(255, (value >> 16) + amount));
    const green = Math.max(0, Math.min(255, (value >> 8 & 0x00FF) + amount));
    const blue = Math.max(0, Math.min(255, (value & 0x0000FF) + amount));
    return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
}

function splitTitleForCover(title) {
    const words = title.replace(/\s+/g, ' ').trim().split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length > 18) {
            if (currentLine) {
                lines.push(currentLine.trim());
            }
            currentLine = word;
        } else {
            currentLine = (currentLine + ' ' + word).trim();
        }
    });

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines.slice(0, 3);
}

function filterBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );

    if (currentFilter !== 'all') {
        displayBooks(filtered.filter(book => book.category === currentFilter));
        return;
    }
    displayBooks(filtered);
}

function showBookDetails(bookId) {
    const book = allBooks.find(b => b.book_id === bookId);
    if (!book) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${escapeHtml(book.title)}</h2>
        <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Category:</strong> ${book.category}</p>
        <p><strong>Publication Year:</strong> ${book.publication_year}</p>
        <p><strong>Description:</strong> ${escapeHtml(book.description || 'No description available')}</p>
        <p><strong>Availability:</strong> <span class="book-availability ${book.quantity_available > 0 ? '' : 'unavailable'}">
            ${book.quantity_available > 0 
                ? `${book.quantity_available} of ${book.quantity_total} copies available` 
                : 'Currently unavailable'}
        </span></p>
        <button class="btn-primary" onclick="borrowBook(null, ${book.book_id})" 
            ${book.quantity_available === 0 ? 'disabled' : ''}>
            Borrow This Book
        </button>
    `;
    
    document.getElementById('book-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('book-modal').classList.remove('show');
}

// Click outside modal to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('book-modal');
    if (e.target === modal) {
        closeModal();
    }
});

async function borrowBook(event, bookId) {
    if (event) event.stopPropagation();

    try {
        const response = await fetch(apiEndpoint('/borrow'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ book_id: bookId })
        });

        const data = await response.json();

        if (!response.ok) {
            alert('❌ ' + data.message);
            return;
        }

        alert('✓ ' + data.message);
        closeModal();
        loadBooks();
        loadUserBooks();

    } catch (error) {
        console.error('Borrow Error:', error);
        alert('Error borrowing book. Please try again.');
    }
}

// ============================================
// USER BOOKS MANAGEMENT
// ============================================

async function loadUserBooks() {
    try {
        const response = await fetch(apiEndpoint('/mybooks'), {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to load user books');
        
        userBooks = await response.json();
        displayUserBooks(userBooks);

    } catch (error) {
        console.error('Load User Books Error:', error);
        document.getElementById('mybooks-container').innerHTML = 
            '<p class="empty-state">Failed to load your books. Please refresh the page.</p>';
    }
}

function displayUserBooks(books) {
    const container = document.getElementById('mybooks-container');
    
    if (books.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📚 No books borrowed yet</h3>
                <p>Start exploring our library and borrow some books!</p>
                <button class="btn-primary" onclick="showPage('books')" style="margin-top: 1rem;">
                    Browse Books
                </button>
            </div>
        `;
        return;
    }

    // Separate borrowed and returned books
    const borrowed = books.filter(b => b.status === 'borrowed');
    const returned = books.filter(b => b.status === 'returned');

    let html = '';

    if (borrowed.length > 0) {
        html += '<h2 style="margin-top: 2rem; margin-bottom: 1rem;">Currently Borrowed 📖</h2>';
        html += borrowed.map(book => `
            <div class="book-row">
                <div class="book-row-info">
                    <h3>${escapeHtml(book.title)}</h3>
                    <p>${escapeHtml(book.author)}</p>
                </div>
                <div>
                    <p><strong>Borrowed:</strong></p>
                    <p>${formatDate(book.borrowed_date)}</p>
                </div>
                <div>
                    <p><strong>Due:</strong></p>
                    <p style="color: ${isOverdue(book.due_date) ? '#dc2626' : 'inherit'}">
                        ${formatDate(book.due_date)} ${isOverdue(book.due_date) ? '⚠️ OVERDUE' : ''}
                    </p>
                </div>
                <div class="book-status borrowed">
                    Borrowed
                </div>
                <button class="btn-success" onclick="returnBook(${book.record_id})">
                    Return
                </button>
            </div>
        `).join('');
    }

    if (returned.length > 0) {
        html += '<h2 style="margin-top: 2rem; margin-bottom: 1rem;">Return History 📚</h2>';
        html += returned.map(book => `
            <div class="book-row">
                <div class="book-row-info">
                    <h3>${escapeHtml(book.title)}</h3>
                    <p>${escapeHtml(book.author)}</p>
                </div>
                <div>
                    <p><strong>Borrowed:</strong></p>
                    <p>${formatDate(book.borrowed_date)}</p>
                </div>
                <div>
                    <p><strong>Returned:</strong></p>
                    <p>${formatDate(book.return_date)}</p>
                </div>
                <div class="book-status returned">
                    Returned
                </div>
                <div>
                    ${book.fine_amount > 0 ? `<span style="color: #dc2626; font-weight: bold;">Fine: ${book.fine_amount}</span>` : 'No fine'}
                </div>
            </div>
        `).join('');
    }

    container.innerHTML = html;
}

async function returnBook(recordId) {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
        const response = await fetch(apiEndpoint('/return'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ record_id: recordId })
        });

        const data = await response.json();

        if (!response.ok) {
            alert('❌ ' + data.message);
            return;
        }

        alert('✓ ' + data.message);
        loadUserBooks();
        loadBooks();

    } catch (error) {
        console.error('Return Error:', error);
        alert('Error returning book. Please try again.');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================

// Check if user is already logged in
window.addEventListener('load', () => {
    fetch(apiEndpoint('/auth/me'), {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.user_id) {
            currentUser = data;
            showPage('home');
            updateUserProfile();
        } else {
            showAuthPage();
        }
    })
    .catch(() => showAuthPage());
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger?.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});
