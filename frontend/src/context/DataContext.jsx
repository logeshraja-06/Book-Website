import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BOOKS } from '../data/books';
import { AUTHORS } from '../data/authors';
import { REVIEWS } from '../data/reviews';
import { CATEGORIES } from '../data/categories';
import { INITIAL_LIBRARY_BOOKS } from '../data/mockReaderData';
import { useAuth, apiFetch } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser, token } = useAuth();

  const [books, setBooks] = useState(BOOKS);
  const [authors, setAuthors] = useState(AUTHORS);
  const [reviews, setReviews] = useState(REVIEWS);
  const [categories, setCategories] = useState(CATEGORIES);

  const [studioBooks, setStudioBooks] = useState([]);
  const [editorialQueue, setEditorialQueue] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [libraryBookState, setLibraryBookState] = useState(INITIAL_LIBRARY_BOOKS);
  const [wishlistIds, setWishlistIds] = useState(['sapiens', 'atomic-habits', 'immortals-meluha']);

  // 1. Fetch Public Books, Authors & Categories on Mount
  const fetchPublicData = useCallback(async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.allSettled([
        apiFetch('/books'),
        apiFetch('/authors'),
        apiFetch('/categories')
      ]);

      if (booksRes.status === 'fulfilled' && booksRes.value.success && booksRes.value.data) {
        setBooks(booksRes.value.data);
      }
      if (authorsRes.status === 'fulfilled' && authorsRes.value.success && authorsRes.value.data) {
        setAuthors(authorsRes.value.data);
      }
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value.success && categoriesRes.value.data) {
        setCategories(categoriesRes.value.data);
      }
    } catch (err) {
      console.warn('[DataContext] Backend fetch notice:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  // 2. Role-Based Module State Rehydration (Studio / Editorial / Reader)
  const fetchModuleData = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      // Author Studio Books
      if (currentUser.role === 'author') {
        const studioRes = await apiFetch('/studio/books').catch(() => null);
        if (studioRes?.success && studioRes.data) {
          setStudioBooks(studioRes.data);
        }
      }

      // Publisher Editorial Queue
      if (currentUser.role === 'publisher' || currentUser.role === 'admin') {
        const queueRes = await apiFetch('/editorial/queue').catch(() => null);
        if (queueRes?.success && queueRes.data) {
          setEditorialQueue(queueRes.data);
        }
      }

      // Reader Library & Wishlist
      if (currentUser.role) {
        const [libRes, wishRes] = await Promise.allSettled([
          apiFetch('/reader/library').catch(() => null),
          apiFetch('/reader/wishlist').catch(() => null)
        ]);

        if (libRes.status === 'fulfilled' && libRes.value?.success && libRes.value.data) {
          setLibraryBookState(libRes.value.data);
        }
        if (wishRes.status === 'fulfilled' && wishRes.value?.success && wishRes.value.data) {
          setWishlistBooks(wishRes.value.data);
          setWishlistIds(wishRes.value.data.map(b => b.id || b._id));
        }
      }
    } catch (err) {
      console.warn('[DataContext] Module fetch notice:', err.message);
    }
  }, [token, currentUser]);

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  /**
   * Add a newly created book from Writing Studio Create Book Wizard.
   */
  const addBook = useCallback(async (newBook) => {
    try {
      const formData = new FormData();
      formData.append('title', newBook.title || 'Untitled Manuscript');
      if (newBook.subtitle) formData.append('subtitle', newBook.subtitle);
      if (newBook.genre) formData.append('genre', newBook.genre);
      if (newBook.language) formData.append('language', newBook.language);
      if (newBook.price) formData.append('price', String(newBook.price));
      if (newBook.synopsis) formData.append('synopsis', newBook.synopsis);
      if (newBook.tagline) formData.append('tagline', newBook.tagline);
      formData.append('status', newBook.status || 'In Review');

      if (newBook.coverImage instanceof File) {
        formData.append('coverImage', newBook.coverImage);
      } else if (newBook.coverFile instanceof File) {
        formData.append('coverImage', newBook.coverFile);
      } else if (newBook.coverUrl) {
        formData.append('coverUrl', newBook.coverUrl);
      }

      if (newBook.manuscriptFile instanceof File) {
        formData.append('manuscriptFile', newBook.manuscriptFile);
      } else if (newBook.pdfFile instanceof File) {
        formData.append('manuscriptFile', newBook.pdfFile);
      }

      const res = await apiFetch('/studio/books', {
        method: 'POST',
        body: formData
      });

      if (res.success && res.data) {
        const createdBook = {
          ...res.data,
          id: res.data.id || res.data._id
        };
        setBooks(prev => [createdBook, ...prev]);
        setStudioBooks(prev => [createdBook, ...prev]);
        fetchPublicData();
        return createdBook;
      }
    } catch (err) {
      console.warn('[addBook API Fallback]:', err.message);
    }

    // In-memory fallback
    const createdBook = {
      id: newBook.id || newBook.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newBook.title,
      subtitle: newBook.subtitle || '',
      author: currentUser?.name || 'Kalki Krishnamurthy',
      authorId: currentUser?.id || 'kalki-krishnamurthy',
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
    setStudioBooks(prev => [createdBook, ...prev]);
    return createdBook;
  }, [currentUser, fetchPublicData]);

  /**
   * Update a book's fields.
   */
  const updateBook = useCallback(async (bookId, updates) => {
    try {
      const hasFiles = updates.coverImage instanceof File || updates.manuscriptFile instanceof File || updates.pdfFile instanceof File;
      let body;

      if (hasFiles) {
        body = new FormData();
        Object.keys(updates).forEach(key => {
          if (key === 'coverImage' || key === 'coverFile') {
            if (updates[key] instanceof File) body.append('coverImage', updates[key]);
          } else if (key === 'manuscriptFile' || key === 'pdfFile') {
            if (updates[key] instanceof File) body.append('manuscriptFile', updates[key]);
          } else if (updates[key] !== undefined && updates[key] !== null) {
            body.append(key, String(updates[key]));
          }
        });
      } else {
        body = JSON.stringify(updates);
      }

      const res = await apiFetch(`/studio/books/${bookId}`, {
        method: 'PUT',
        body
      });

      if (res.success && res.data) {
        const updated = { ...res.data, id: res.data.id || res.data._id };
        setBooks(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? updated : b));
        setStudioBooks(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? updated : b));
        fetchPublicData();
        return;
      }
    } catch (err) {
      console.warn('[updateBook API Fallback]:', err.message);
    }

    setBooks(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? { ...b, ...updates, lastEdited: 'Just now' } : b));
    setStudioBooks(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? { ...b, ...updates, lastEdited: 'Just now' } : b));
  }, [fetchPublicData]);

  /**
   * Delete a book.
   */
  const deleteBook = useCallback(async (bookId) => {
    try {
      await apiFetch(`/studio/books/${bookId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[deleteBook API Fallback]:', err.message);
    }

    setBooks(prev => prev.filter(b => b.id !== bookId && b._id !== bookId));
    setStudioBooks(prev => prev.filter(b => b.id !== bookId && b._id !== bookId));
  }, []);

  /**
   * Update a book's status (Approve / Reject / Request Changes / Submit).
   */
  const updateBookStatus = useCallback(async (bookId, newStatus, notes) => {
    try {
      let endpoint = '';
      if (newStatus === 'Published') {
        endpoint = `/editorial/books/${bookId}/approve`;
      } else if (newStatus === 'Rejected') {
        endpoint = `/editorial/books/${bookId}/reject`;
      } else if (newStatus === 'In Review') {
        endpoint = `/editorial/books/${bookId}/request-changes`;
      }

      if (endpoint) {
        const res = await apiFetch(endpoint, {
          method: 'PUT',
          body: JSON.stringify({ notes: notes || 'Editorial review decision updated.' })
        });
        if (res.success && res.data) {
          const updated = { ...res.data, id: res.data.id || res.data._id };
          setBooks(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? updated : b));
          setEditorialQueue(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? updated : b));
          fetchPublicData();
          return;
        }
      }
    } catch (err) {
      console.warn('[updateBookStatus API Fallback]:', err.message);
    }

    setBooks(prev => prev.map(b => (b.id === bookId || b._id === bookId) ? { ...b, status: newStatus } : b));
  }, [fetchPublicData]);

  /**
   * Reader: Toggle Wishlist
   */
  const toggleWishlist = useCallback(async (bookId) => {
    try {
      const res = await apiFetch(`/reader/wishlist/${bookId}`, { method: 'POST' });
      if (res.success && res.data) {
        setWishlistBooks(res.data);
        setWishlistIds(res.data.map(b => b.id || b._id));
        return;
      }
    } catch (err) {
      console.warn('[toggleWishlist API Fallback]:', err.message);
    }

    setWishlistIds(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  }, []);

  /**
   * Reader: Toggle / Add to Library
   */
  const toggleLibrary = useCallback(async (bookId) => {
    try {
      const res = await apiFetch(`/reader/library/${bookId}`, { method: 'POST' });
      if (res.success && res.data) {
        setLibraryBookState(res.data);
        return;
      }
    } catch (err) {
      console.warn('[toggleLibrary API Fallback]:', err.message);
    }

    setLibraryBookState(prev => {
      const exists = prev.some(item => item.id === bookId || item._id === bookId);
      if (exists) {
        return prev.filter(item => item.id !== bookId && item._id !== bookId);
      } else {
        const targetBook = books.find(b => b.id === bookId || b._id === bookId);
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
  const addReview = useCallback(async ({ bookId, reviewer, rating, text }) => {
    try {
      const res = await apiFetch('/reader/reviews', {
        method: 'POST',
        body: JSON.stringify({ bookId, rating, text })
      });
      if (res.success && res.data) {
        setReviews(prev => [res.data, ...prev]);
        fetchPublicData();
        return;
      }
    } catch (err) {
      console.warn('[addReview API Fallback]:', err.message);
    }

    const newReview = {
      id: `r-${Date.now()}`,
      bookId,
      reviewer,
      rating,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      text
    };
    setReviews(prev => [newReview, ...prev]);
  }, [fetchPublicData]);

  // Derived helpers — computed from current state with ID matching flexibility
  const getBookById = useCallback(id => {
    return books.find(b => b.id === id || b._id === id || b.legacyId === id) || null;
  }, [books]);

  const getAuthorById = useCallback(id => {
    return authors.find(a => a.id === id || a._id === id || a.legacyId === id) || null;
  }, [authors]);

  const getReviewsByBookId = useCallback(bookId => {
    return reviews.filter(r => r.bookId === bookId || r.bookId?._id === bookId);
  }, [reviews]);

  const getBooksByAuthorId = useCallback(authorId => {
    return books.filter(b => b.authorId === authorId || b.authorId?._id === authorId);
  }, [books]);

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
        studioBooks: studioBooks.length > 0 ? studioBooks : books.filter(b => b.authorId === 'kalki-krishnamurthy' || b.author === currentUser?.name),
        editorialQueue: editorialQueue.length > 0 ? editorialQueue : books.filter(b => b.status === 'In Review' || b.status === 'Rejected'),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used inside <DataProvider>');
  }
  return ctx;
}
