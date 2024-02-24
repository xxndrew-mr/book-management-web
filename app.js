document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

function addBook() {
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const yearInput = document.getElementById('year');
  const isCompleteSelect = document.getElementById('isComplete');

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const year = parseInt(yearInput.value);
  const isComplete = isCompleteSelect.value === 'true';

  if (title !== '' && author !== '' && !isNaN(year)) {
    const book = { id: generateId(), title, author, year, isComplete };
    saveBook(book);
    loadBooks();
    clearForm();
  }
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function saveBook(book) {
  const books = getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
}

function getBooks() {
  const storedBooks = localStorage.getItem('books');
  return storedBooks ? JSON.parse(storedBooks) : [];
}

function loadBooks() {
  const books = getBooks();
  const belumSelesaiList = document.getElementById('list-belum-selesai');
  const sudahSelesaiList = document.getElementById('list-sudah-selesai');

  removeAllChildNodes(belumSelesaiList);
  removeAllChildNodes(sudahSelesaiList);

  books.forEach(book => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${book.title} - ${book.author} (${book.year})</span>
      <button onclick="moveBook('${book.id}', ${!book.isComplete})">${book.isComplete ? 'Belum Selesai' : 'Selesai'}</button>
      <button onclick="removeBook('${book.id}')">Hapus</button>
    `;
    listItem.draggable = true;
    listItem.ondragstart = function (event) {
      event.dataTransfer.setData('text/plain', book.id);
    };
    if (book.isComplete) {
      sudahSelesaiList.appendChild(listItem);

    } else {
      belumSelesaiList.appendChild(listItem);
    }
  });
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('year').value = '';
  document.getElementById('isComplete').value = 'false';
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function moveBook(bookId, newIsComplete) {
  const books = getBooks();
  const updatedBooks = books.map(book =>
    book.id === bookId ? { ...book, isComplete: newIsComplete } : book
  );
  localStorage.setItem('books', JSON.stringify(updatedBooks));
  loadBooks();
}

function removeBook(bookId) {
  const books = getBooks();
  const updatedBooks = books.filter(book => book.id !== bookId);
  localStorage.setItem('books', JSON.stringify(updatedBooks));
  loadBooks();
}

