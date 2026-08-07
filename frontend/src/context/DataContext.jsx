/**
 * BookVerse Studio — Shared Data Context
 *
 * Provides in-memory mutable state for:
 *   - books (with live status updates & new manuscript creation)
 *   - authors
 *   - reviews (reader can add reviews)
 *   - categories
 *   - reader personal library & wishlist state
 *
 * Status changes made in Editorial Workspace (Approve/Reject) are instantly
 * reflected in Writing Studio's My Books, Admin > Books, and public Books listing.
 *
 * No backend — state resets on page refresh (intentional, this is a mock).
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { BOOKS } from '../data/books';
import { AUTHORS } from '../data/authors';
import { REVIEWS } from '../data/reviews';
import { CATEGORIES } from '../data/categories';
import { INITIAL_LIBRARY_BOOKS, INITIAL_WISHLIST_BOOKS } from '../data/mockReaderData';

// ─── Context ─────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [books, setBooks] = useState(BOOKS);
  const [authors] = useState(AUTHORS);          // authors are immutable in this mock
  const [reviews, setReviews] = useState(REVIEWS);
  const [categories] = useState(CATEGORIES);    // categories are immutable in this mock

  // Reader state
  const [wishlistIds, setWishlistIds] = useState(['sapiens', 'atomic-habits', 'immortals-meluha']);
  const [libraryBookState, setLibraryBookState] = useState(INITIAL_LIBRARY_BOOKS);

  /**
   * Add a newly created book from Writing Studio Create Book Wizard.
   */
  const addBook = useCallback((newBook) => {
    const createdBook = {
      id: newBook.id || newBook.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newBook.title,
      subtitle: newBook.subtitle || '',
      author: 'Kalki Krishnamurthy',
      authorId: 'kalki-krishnamurthy',
      genre: newBook.genre || 'Historical Fiction',
      language: newBook.language || 'English',
      price: Number(newBook.price) || 999,
      isbn: newBook.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      rating: 4.8,
      reviewsCount: '0',
      publishYear: Number(newBook.publishYear) || 2026,
      pages: Number(newBook.pages) || 350,
      publisher: newBook.publisher || 'BookVerse Studio Imprint',
      editorPick: false,
      tagline: newBook.subtitle || newBook.title,
      synopsis: newBook.synopsis || '',
      coverUrl: newBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      badge: 'New Submission',
      status: 'In Review',
      lastEdited: 'Just now',
      submittedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
      editorialNotes: 'Submitted for editorial review.',
      manuscriptFileName: newBook.manuscriptFileName || '',
      manuscriptFileType: newBook.manuscriptFileType || 'PDF Document',
      manuscriptFileSize: newBook.manuscriptFileSize || '',
      manuscriptUrl: newBook.manuscriptUrl || null,
    };

    setBooks(prev => [createdBook, ...prev]);
    return createdBook;
  }, []);

  /**
   * Update a book's fields.
   */
  const updateBook = useCallback((bookId, updates) => {
    setBooks(prev =>
      prev.map(b => b.id === bookId ? { ...b, ...updates, lastEdited: 'Just now' } : b)
    );
  }, []);

  /**
   * Delete a book.
   */
  const deleteBook = useCallback((bookId) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  }, []);

  /**
   * Update a book's status.
   */
  const updateBookStatus = useCallback((bookId, newStatus) => {
    setBooks(prev =>
      prev.map(b => b.id === bookId ? { ...b, status: newStatus } : b)
    );
  }, []);

  /**
   * Reader: Toggle Wishlist
   */
  const toggleWishlist = useCallback((bookId) => {
    setWishlistIds(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  }, []);

  /**
   * Reader: Toggle / Add to Library
   */
  const toggleLibrary = useCallback((bookId) => {
    setLibraryBookState(prev => {
      const exists = prev.some(item => item.id === bookId);
      if (exists) {
        return prev.filter(item => item.id !== bookId);
      } else {
        const targetBook = books.find(b => b.id === bookId);
        const newLibraryItem = {
          id: bookId,
          title: targetBook?.title || 'Untitled',
          author: targetBook?.author || 'Unknown',
          genre: targetBook?.genre || 'Fiction',
          coverUrl: targetBook?.coverUrl || '',
          progress: 10,
          currentPage: 25,
          totalPages: targetBook?.pages || 300,
          status: 'Currently Reading',
          lastRead: 'Just now'
        };
        return [newLibraryItem, ...prev];
      }
    });
  }, [books]);

  /**
   * Add a new reader review.
   */
  const addReview = useCallback(({ bookId, reviewer, rating, text }) => {
    const newReview = {
      id: `r-${Date.now()}`,
      bookId,
      reviewer,
      rating,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      text
    };
    setReviews(prev => [newReview, ...prev]);
  }, []);

  // Derived helpers — computed from current state
  const getBookById = useCallback(id => books.find(b => b.id === id) || null, [books]);
  const getAuthorById = useCallback(id => authors.find(a => a.id === id) || null, [authors]);
  const getReviewsByBookId = useCallback(bookId => reviews.filter(r => r.bookId === bookId), [reviews]);
  const getBooksByAuthorId = useCallback(authorId => books.filter(b => b.authorId === authorId), [books]);

  /** Books for Writing Studio — Kalki's manuscripts */
  const studioBooks = books.filter(b => b.authorId === 'kalki-krishnamurthy');

  /** Books in the Editorial review queue */
  const editorialQueue = books.filter(b => b.status === 'In Review' || b.status === 'Rejected');

  /** Wishlist books full objects */
  const wishlistBooks = books.filter(b => wishlistIds.includes(b.id));

  return (
    <DataContext.Provider
      value={{
        // Raw state
        books,
        authors,
        reviews,
        categories,
        wishlistIds,
        libraryBookState,
        wishlistBooks,

        // Mutable actions
        addBook,
        updateBook,
        deleteBook,
        updateBookStatus,
        toggleWishlist,
        toggleLibrary,
        addReview,

        // Derived helpers
        getBookById,
        getAuthorById,
        getReviewsByBookId,
        getBooksByAuthorId,

        // Module-specific slices
        studioBooks,
        editorialQueue,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used inside <DataProvider>');
  }
  return ctx;
}
