const STORAGE_KEY = 'little-bookshop-demo-data';

const initialData = {
  categories: [
    { id: 'classics', name: 'Classics', description: 'Timeless stories for every shelf.', is_archived: false },
    { id: 'stories', name: 'Stories', description: 'Small books with big feelings.', is_archived: false },
    { id: 'illustrated', name: 'Illustrated', description: 'Beautifully told and beautifully seen.', is_archived: false },
  ],
  books: [
    { id: 'secret-garden', title: 'The Secret Garden', author: 'Frances Hodgson Burnett', category_id: 'classics', category: 'Classics', price: 12.5, stock: 8, cover_url: 'https://covers.openlibrary.org/b/isbn/9780141321066-M.jpg', description: 'A lonely garden, a locked door, and a little magic waiting to bloom.', is_archived: false },
    { id: 'little-prince', title: 'The Little Prince', author: 'Antoine de Saint-Exupery', category_id: 'stories', category: 'Stories', price: 10, stock: 5, cover_url: 'https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg', description: 'A tender, timeless story about friendship and seeing with the heart.', is_archived: false },
    { id: 'pride-prejudice', title: 'Pride and Prejudice', author: 'Jane Austen', category_id: 'classics', category: 'Classics', price: 14, stock: 4, cover_url: 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg', description: 'A sparkling story of first impressions, family, and finding your person.', is_archived: false },
    { id: 'boy-mole-fox-horse', title: 'The Boy, the Mole, the Fox and the Horse', author: 'Charlie Mackesy', category_id: 'illustrated', category: 'Illustrated', price: 19, stock: 3, cover_url: 'https://covers.openlibrary.org/b/isbn/9780062976581-M.jpg', description: 'An illustrated tale about kindness, courage, and asking for help.', is_archived: false },
  ],
  favorites: [],
};

function readStore() {
  const savedData = window.localStorage.getItem(STORAGE_KEY);
  return savedData ? JSON.parse(savedData) : JSON.parse(JSON.stringify(initialData));
}

function writeStore(store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function withCategory(book, categories) {
  const category = categories.find((item) => item.id === book.category_id);
  return { ...book, category: category?.name || book.category || 'Uncategorised', categories: category ? { name: category.name } : null };
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getBooks({ search = '', includeArchived = false } = {}) {
  const { books, categories } = readStore();
  const query = search.trim().toLowerCase();
  return books
    .filter((book) => (includeArchived || !book.is_archived)
      && (!query || `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query)))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((book) => withCategory(book, categories));
}

export async function getBook(id) {
  const { books, categories } = readStore();
  const book = books.find((item) => item.id === id && !item.is_archived);
  return book ? withCategory(book, categories) : null;
}

export async function getCategories({ includeArchived = false } = {}) {
  const { categories } = readStore();
  return categories
    .filter((category) => includeArchived || !category.is_archived)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveBook(book) {
  const store = readStore();
  const category = store.categories.find((item) => item.id === book.category_id);
  const savedBook = {
    ...book,
    id: book.id || makeId('book'),
    categories: category ? { name: category.name } : null,
    category: category?.name || 'Uncategorised',
  };
  const index = store.books.findIndex((item) => item.id === savedBook.id);
  if (index < 0) store.books.push(savedBook);
  else store.books[index] = savedBook;
  writeStore(store);
}

export async function saveCategory(category) {
  const store = readStore();
  const savedCategory = { ...category, id: category.id || makeId('category') };
  const index = store.categories.findIndex((item) => item.id === savedCategory.id);
  if (index < 0) store.categories.push(savedCategory);
  else store.categories[index] = savedCategory;
  writeStore(store);
}

export async function archiveBook(id, archived) {
  const store = readStore();
  const book = store.books.find((item) => item.id === id);
  if (!book) throw new Error('That book is no longer in the catalogue.');
  book.is_archived = archived;
  writeStore(store);
}

export async function archiveCategory(id, archived) {
  const store = readStore();
  const category = store.categories.find((item) => item.id === id);
  if (!category) throw new Error('That category is no longer in the catalogue.');
  category.is_archived = archived;
  writeStore(store);
}

export async function updateStock(id, stock) {
  const store = readStore();
  const book = store.books.find((item) => item.id === id);
  if (!book) throw new Error('That book is no longer in the catalogue.');
  book.stock = stock;
  writeStore(store);
}

export async function buyBook(id) {
  const store = readStore();
  const book = store.books.find((item) => item.id === id && !item.is_archived);
  if (!book) throw new Error('That book is no longer available.');
  if (Number(book.stock) < 1) throw new Error('This book is out of stock.');
  book.stock = Number(book.stock) - 1;
  writeStore(store);
  return withCategory(book, store.categories);
}

export async function getFavorites(userId) {
  const { books, categories, favorites } = readStore();
  const favoriteIds = favorites.filter((item) => item.user_id === userId).map((item) => item.book_id);
  return books
    .filter((book) => favoriteIds.includes(book.id) && !book.is_archived)
    .map((book) => withCategory(book, categories));
}

export async function toggleFavorite(userId, bookId, isFavorite) {
  const store = readStore();
  store.favorites = store.favorites.filter((item) => (
    item.user_id !== userId || item.book_id !== bookId
  ));
  if (!isFavorite) store.favorites.push({ user_id: userId, book_id: bookId });
  writeStore(store);
}
