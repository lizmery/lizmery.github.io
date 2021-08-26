// Book Class: Represents a Book
class Book {
    constructor(title, author, genre, rating, comments, status) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.rating = rating;
        this.comments = comments;
        this.status = status;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => {
            if(book.status === 'unread') {
                UI.addBookToUnreadList(book);
            } else if (book.status === 'read') {
                UI.addBookToReadList(book);
            }
        });
    }

    static addBookToReadList(book) {
        const readList = document.querySelector('#read-list');
        $('.completed').css('visibility', 'visible');

        const readRow = document.createElement('tr');
        readRow.classList.add('book-row');
        readRow.dataset.title = book.title;

        readRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.rating}</td>
            <td>${book.comments}</td>
            <td>
                <a href="#" id="delete" class="btn btn-danger btn-sm delete" data-title='${book.title}' onclick="deleteReadRow(this.parentNode.parentNode.rowIndex, title='${book.title}')">X</a>
            </td>
        `;

        readList.appendChild(readRow);
    }

    static addBookToUnreadList(book) {
        const unreadList = document.querySelector('#unread-list');
        $('.unread').css('visibility', 'visible');

        const unreadRow = document.createElement('tr');
        unreadRow.classList.add('book-row');
        unreadRow.dataset.title = book.title;

        unreadRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.rating}</td>
            <td>${book.comments}</td>
            <td>
                <a href="#" id="check" class="btn btn-success btn-sm check" data-title="${book.title}" onclick="moveUnreadToRead(this.parentNode.parentNode.rowIndex, title='${book.title}', author='${book.author}', genre='${book.genre}', rating='${book.rating}', comments='${book.comments}', status='${book.status}')">&#10003;</a>
                <a href="#" id="delete" class="btn btn-danger btn-sm delete" data-title="${book.title}" onclick="deleteUnreadRow(this.parentNode.parentNode.rowIndex, title='${book.title}')">X</a>
            </td>
        `;

        unreadList.appendChild(unreadRow);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish alert in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);

    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#genre').value = '';
        document.querySelector('#rating').value = '';
        document.querySelector('#comments').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Book(s)
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add Book
document.querySelector('.btn').addEventListener('click', (e) => {
    //Prevent actual Submit
    e.preventDefault();

    // Get form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const genre = document.querySelector('#genre').value;
    const rating = document.querySelector('#rating').value;
    const comments = document.querySelector('#comments').value;

    // Validate
    if(title === '' || author === '' || genre === '') {
        UI.showAlert('Please fill in all fields', 'primary');
    } else {
        const status = document.querySelector('input[type=radio][name=status]:checked').value;

        if(status === 'unread') {
            // Instantiate book
            const book = new Book(title, author, genre, rating, comments, status);

            // Add book to UI
            UI.addBookToUnreadList(book);

            // Add book to Store
            Store.addBook(book);

            // Show success message
            UI.showAlert('Book Added!', 'secondary');

            // Clear fields
            UI.clearFields();
        } else {
            // Instantiate book
            const book = new Book(title, author, genre, rating, comments, status);

            // Add book to UI
            UI.addBookToReadList(book);

            // Add book to Store
            Store.addBook(book);

            // Show success message
            UI.showAlert('Book Added!', 'secondary');

            // Clear fields
            UI.clearFields();
        }
    }
});

// Function: Remove Book from Read (Completed) List
function deleteReadRow(i, title) {
    // Remove book from UI
    document.getElementById('readTable').deleteRow(i);

    // Remove book from Store
    Store.removeBook(title);

    // Show success message
    UI.showAlert('Book Removed', 'danger');
}

// Function: Remove Book from Unread List
function deleteUnreadRow(i, title) {
    // Remove book from UI
    document.getElementById('unreadTable').deleteRow(i);

    // Remove book from Store
    Store.removeBook(title);

    // Show success message
    UI.showAlert('Book Removed', 'danger');
}

// Function: Move Unread Book to Read (Completed) Book Table
function moveUnreadToRead(i, title, author, genre, rating, comments, status) {
    // Remove book from UI
    document.getElementById('unreadTable').deleteRow(i);

    // Remove book from Store
    Store.removeBook(title);

    // Add to Read List
    const book = new Book(title, author, genre, rating, comments, status);
    UI.addBookToReadList(book);

    // Add book to Store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Completed!', 'success');
}
