import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, CheckCircle, Info, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BOOKS } from '../data/books';
import { AUTHORS } from '../data/authors';
import { REVIEWS } from '../data/reviews';
import { CATEGORIES } from '../data/categories';
import { INITIAL_LIBRARY_BOOKS } from '../data/mockReaderData';
import { useAuth, apiFetch } from './AuthContext';

export const normalizeLibraryBook = (item, allBooks = []) => {
  if (!item) return null;

  // Extract populated book object if present
  const rawBook = (item.bookId && typeof item.bookId === 'object') ? item.bookId : null;
  const bookIdStr = (item.bookId && typeof item.bookId === 'string')
    ? item.bookId
    : (rawBook?._id || rawBook?.id || item._id || item.id || item.slug);

  // Look up in catalog allBooks if available
  const catalogMatch = Array.isArray(allBooks)
    ? allBooks.find(
        (b) =>
          (b._id && b._id.toString() === bookIdStr?.toString()) ||
          b.id === bookIdStr ||
          b.slug === bookIdStr ||
          b.legacyId === bookIdStr
      )
    : null;

  const source = rawBook || catalogMatch || (typeof item === 'object' ? item : {});

  const _id = source._id || rawBook?._id || catalogMatch?._id || item._id || bookIdStr;
  const id = source.id || source.slug || source.legacyId || _id;
  const slug = source.slug || rawBook?.slug || catalogMatch?.slug || item.slug || id;

  // Never use "Literature" as title
  const title = (source.title && source.title !== 'Literature')
    ? source.title
    : (rawBook?.title || catalogMatch?.title || (item.title && item.title !== 'Literature' ? item.title : 'Untitled Book'));

  const author = source.author || rawBook?.author || catalogMatch?.author || item.author || 'BookVerse Author';
  const genre = source.genre || rawBook?.genre || catalogMatch?.genre || item.genre || 'Literature';
  const coverUrl = source.coverUrl || source.coverImage || rawBook?.coverUrl || rawBook?.coverImage || catalogMatch?.coverUrl || catalogMatch?.coverImage || item.coverUrl || item.coverImage || '';
  const coverImage = source.coverImage || coverUrl;
  const price = source.price !== undefined ? source.price : (rawBook?.price !== undefined ? rawBook.price : (catalogMatch?.price !== undefined ? catalogMatch.price : 499));
  const rating = source.rating || rawBook?.rating || catalogMatch?.rating || 4.8;
  const pages = source.pages || rawBook?.pages || catalogMatch?.pages || item.totalPages || 350;

  const curPage = Number(item.currentPage || item.pageNumber || 1);
  const totPages = Number(item.totalPages || pages || 350);
  const progPct = item.progress !== undefined
    ? Number(item.progress)
    : (item.progressPercent !== undefined ? Number(item.progressPercent) : Math.min(100, Math.round((curPage / totPages) * 100)));
  const statusStr = progPct >= 100 ? 'Completed' : (item.status || 'Currently Reading');
  const lastReadDate = item.lastReadAt || item.lastRead || 'Recently';
  const bmCount = item.bookmarksCount || 0;

  return {
    ...source,
    _id,
    id,
    slug,
    title,
    author,
    genre,
    coverUrl,
    coverImage,
    price,
    rating,
    pages,
    currentPage: curPage,
    totalPages: totPages,
    progress: progPct,
    progressPercent: progPct,
    status: statusStr,
    lastReadAt: lastReadDate,
    lastRead: lastReadDate,
    bookmarksCount: bmCount,
    bookId: _id
  };
};

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser, token } = useAuth();

  const [books, setBooks] = useState(BOOKS);
  const [editorialBooks, setEditorialBooks] = useState([]);
  const [authors, setAuthors] = useState(AUTHORS);
  const [reviews, setReviews] = useState(REVIEWS);
  const [categories, setCategories] = useState(CATEGORIES);

  const [studioBooks, setStudioBooks] = useState([]);
  const [editorialQueue, setEditorialQueue] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [libraryBookState, setLibraryBookState] = useState(() => INITIAL_LIBRARY_BOOKS.map((b) => normalizeLibraryBook(b, BOOKS)));
  const [wishlistIds, setWishlistIds] = useState(['sapiens', 'atomic-habits', 'immortals-meluha']);
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [purchasedBookIds, setPurchasedBookIds] = useState([]);

  // Global Wishlist Toast & Auth Modal State
  const [toastState, setToastState] = useState({ show: false, message: '', type: 'success' });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeReaderBook, setActiveReaderBook] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState((prev) => ({ ...prev, show: false }));
    }, 3200);
  }, []);

  // Helper: check if a book is wishlisted using ID, _id, or slug
  const isBookInWishlist = useCallback((bookOrId) => {
    if (!bookOrId) return false;
    const targetId = typeof bookOrId === 'string' ? bookOrId : (bookOrId._id || bookOrId.id || bookOrId.slug);
    const targetStr = targetId?.toString();
    return wishlistIds.some((id) => id === targetId || id?.toString() === targetStr) ||
      wishlistBooks.some((wb) => {
        const wbId = wb._id?.toString() || wb.id || wb.slug;
        return wbId === targetStr || wb._id === targetId || wb.id === targetId || wb.slug === targetId;
      });
  }, [wishlistIds, wishlistBooks]);

  // Helper: check if a book is bookmarked using ID, _id, or slug
  const isBookBookmarked = useCallback((bookOrId) => {
    if (!bookOrId) return false;
    const targetId = typeof bookOrId === 'string' ? bookOrId : (bookOrId._id || bookOrId.id || bookOrId.slug);
    const targetStr = targetId?.toString();
    return bookmarkIds.some((id) => id === targetId || id?.toString() === targetStr) ||
      bookmarks.some((bm) => {
        const bmBookId = bm.bookId?._id || bm.bookId?.id || bm.bookId;
        const bmStr = bmBookId?.toString();
        return bmBookId === targetId || bmStr === targetStr;
      });
  }, [bookmarkIds, bookmarks]);

  // Helper: check if a book is purchased by current user
  const isBookPurchased = useCallback((bookOrId) => {
    if (!bookOrId) return false;
    const targetId = typeof bookOrId === 'string' ? bookOrId : (bookOrId._id || bookOrId.id || bookOrId.slug);
    const targetStr = targetId?.toString();
    return purchasedBookIds.some((id) => id === targetId || id?.toString() === targetStr) ||
      libraryBookState.some((libItem) => {
        const libId = libItem._id?.toString() || libItem.id || libItem.slug;
        return libId === targetStr || libItem._id === targetId || libItem.id === targetId || libItem.slug === targetId;
      });
  }, [purchasedBookIds, libraryBookState]);

  // 1. Fetch Public Books (merge by ID), Authors & Categories on Mount
  const fetchPublicData = useCallback(async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.allSettled([
        apiFetch('/books'),
        apiFetch('/authors'),
        apiFetch('/categories')
      ]);

      if (booksRes.status === 'fulfilled' && booksRes.value?.success && booksRes.value.data) {
        setBooks((prev) => {
          const map = new Map();
          prev.forEach((b) => {
            const key = b.slug || b.legacyId || b.id || b._id;
            if (key) map.set(key, b);
          });
          (booksRes.value.data || []).forEach((b) => {
            const key = b.slug || b.legacyId || b.id || b._id;
            const existing = key ? map.get(key) : null;
            const coverImage = (b.coverUrl && !b.coverUrl.includes('unsplash') ? b.coverUrl : null) || b.coverImage || existing?.coverImage || b.coverUrl;
            if (key) {
              map.set(key, { ...existing, ...b, id: b.id || b.slug || b._id, coverImage, coverUrl: coverImage });
            }
          });
          return Array.from(map.values());
        });
      }
      if (authorsRes.status === 'fulfilled' && authorsRes.value?.success && authorsRes.value.data) {
        setAuthors(authorsRes.value.data);
      }
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.success && categoriesRes.value.data) {
        setCategories(categoriesRes.value.data);
      }
    } catch (err) {
      console.warn('[DataContext] Backend fetch notice:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  // 2. Fetch Editorial Data (Full Catalog + Review Queue for Publisher/Admin)
  const fetchEditorialData = useCallback(async () => {
    if (!token || !currentUser) return;
    if (currentUser.role !== 'publisher' && currentUser.role !== 'admin') return;

    try {
      const [booksRes, queueRes] = await Promise.allSettled([
        apiFetch('/editorial/books'),
        apiFetch('/editorial/queue')
      ]);

      if (booksRes.status === 'fulfilled' && booksRes.value?.success && booksRes.value.data) {
        setEditorialBooks(booksRes.value.data);
      }
      if (queueRes.status === 'fulfilled' && queueRes.value?.success && queueRes.value.data) {
        setEditorialQueue(queueRes.value.data);
      }
    } catch (err) {
      console.warn('[DataContext] Editorial fetch notice:', err.message);
    }
  }, [token, currentUser]);

  // 3. Role-Based Module State Rehydration (Studio / Editorial / Reader)
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

      // Publisher Editorial Data
      if (currentUser.role === 'publisher' || currentUser.role === 'admin') {
        fetchEditorialData();
      }

      // Reader Library, Wishlist, Bookmarks & Purchases
      if (currentUser.role) {
        const [libRes, wishRes, bmRes] = await Promise.allSettled([
          apiFetch('/reader/library').catch(() => null),
          apiFetch('/reader/wishlist').catch(() => null),
          apiFetch('/reader/bookmarks').catch(() => null)
        ]);

        if (libRes.status === 'fulfilled' && libRes.value?.success && libRes.value.data) {
          const formattedLibrary = libRes.value.data
            .map((item) => normalizeLibraryBook(item, books))
            .filter(Boolean);
          setLibraryBookState(formattedLibrary);
          const purchasedIds = formattedLibrary.map((b) => b._id?.toString() || b.id || b.slug);
          setPurchasedBookIds(purchasedIds);
        }
        if (wishRes.status === 'fulfilled' && wishRes.value?.success && wishRes.value.data) {
          const formattedWishlist = wishRes.value.data
            .map((item) => normalizeLibraryBook({ bookId: item }, books))
            .filter(Boolean);
          setWishlistBooks(formattedWishlist);
          setWishlistIds(formattedWishlist.map((b) => b._id?.toString() || b.id || b.slug));
        }
        if (bmRes.status === 'fulfilled' && bmRes.value?.success && bmRes.value.data) {
          setBookmarks(bmRes.value.data);
          setBookmarkIds(bmRes.value.data.map((bm) => bm.bookId?._id || bm.bookId?.id || bm.bookId));
        }
      }
    } catch (err) {
      console.warn('[DataContext] Module fetch notice:', err.message);
    }
  }, [token, currentUser, fetchEditorialData]);

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
      if (newBook.isbn) formData.append('isbn', newBook.isbn);
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
        setBooks((prev) => [createdBook, ...prev]);
        setStudioBooks((prev) => [createdBook, ...prev]);
        setEditorialQueue((prev) => [createdBook, ...prev]);
        setEditorialBooks((prev) => [createdBook, ...prev]);

        fetchPublicData();
        fetchEditorialData();
        return createdBook;
      }
      throw new Error(res.message || 'Failed to create book record in database.');
    } catch (err) {
      console.error('[addBook Error]:', err.message);
      throw err;
    }
  }, [fetchPublicData, fetchEditorialData]);

  /**
   * Edit/Update an existing book.
   */
  const updateBook = useCallback(async (bookId, updates) => {
    try {
      let body;
      const isMultipart = updates.coverFile instanceof File || updates.manuscriptFile instanceof File;

      if (isMultipart) {
        body = new FormData();
        Object.keys(updates).forEach((key) => {
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
        setBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
        setStudioBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
        setEditorialBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
        fetchPublicData();
        fetchEditorialData();
        return;
      }
    } catch (err) {
      console.warn('[updateBook API Fallback]:', err.message);
    }

    setBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? { ...b, ...updates, lastEdited: 'Just now' } : b));
    setStudioBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? { ...b, ...updates, lastEdited: 'Just now' } : b));
    setEditorialBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? { ...b, ...updates, lastEdited: 'Just now' } : b));
  }, [fetchPublicData, fetchEditorialData]);

  /**
   * Delete a book.
   */
  const deleteBook = useCallback(async (bookId) => {
    try {
      await apiFetch(`/studio/books/${bookId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[deleteBook API Fallback]:', err.message);
    }

    setBooks((prev) => prev.filter((b) => b.id !== bookId && b._id !== bookId));
    setStudioBooks((prev) => prev.filter((b) => b.id !== bookId && b._id !== bookId));
    setEditorialQueue((prev) => prev.filter((b) => b.id !== bookId && b._id !== bookId));
    setEditorialBooks((prev) => prev.filter((b) => b.id !== bookId && b._id !== bookId));
  }, []);

  /**
   * Update a book's status (Approve / Reject / Request Changes / Submit).
   */
  const updateBookStatus = useCallback(async (bookId, newStatus, notes) => {
    try {
      let endpoint = '';
      if (newStatus === 'Approved') {
        endpoint = `/editorial/books/${bookId}/approve`;
      } else if (newStatus === 'Published') {
        endpoint = `/editorial/books/${bookId}/publish`;
      } else if (newStatus === 'Rejected') {
        endpoint = `/editorial/books/${bookId}/reject`;
      } else if (newStatus === 'In Review') {
        endpoint = `/editorial/books/${bookId}/request-changes`;
      }

      if (endpoint) {
        const res = await apiFetch(endpoint, {
          method: 'PUT',
          body: JSON.stringify({ notes: notes || 'Editorial review decision updated.', rejectionReason: notes })
        });
        if (res.success && res.data) {
          const updated = { ...res.data, id: res.data.id || res.data._id };
          setBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
          setEditorialBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
          setEditorialQueue((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
          setStudioBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
          fetchPublicData();
          fetchEditorialData();
          return updated;
        }
        throw new Error(res.message || `Failed to update status to ${newStatus}`);
      }
    } catch (err) {
      console.error('[updateBookStatus Error]:', err.message);
      throw err;
    }
  }, [fetchPublicData, fetchEditorialData]);

const regenerateBookCover = useCallback(async (bookId) => {
  try {
    const res = await apiFetch(`/editorial/books/${bookId}/regenerate-cover`, {
      method: 'POST'
    });
    if (res.success && res.data) {
      const updated = { ...res.data, id: res.data.id || res.data._id };
      setBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
      setEditorialBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
      setStudioBooks((prev) => prev.map((b) => (b.id === bookId || b._id === bookId) ? updated : b));
      return updated;
    }
    throw new Error(res.message || 'Failed to regenerate cover');
  } catch (err) {
    console.error('[regenerateBookCover Error]:', err.message);
    throw err;
  }
}, []);

  /**
   * Reader: Toggle Wishlist with Instant Sync & Auth Prompt Modal Trigger
   */
  const toggleWishlist = useCallback(async (bookOrId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return false;
    }

    const targetId = typeof bookOrId === 'string' ? bookOrId : (bookOrId.id || bookOrId._id || bookOrId.slug);
    const targetBook = typeof bookOrId === 'object' ? bookOrId : books.find((b) => b.id === targetId || b._id === targetId || b.slug === targetId);

    const isCurrentlySaved = wishlistIds.some((id) => id?.toString() === targetId?.toString()) ||
      wishlistBooks.some((b) => (b.id || b._id || b.slug)?.toString() === targetId?.toString());

    if (isCurrentlySaved) {
      setWishlistIds((prev) => prev.filter((id) => id?.toString() !== targetId?.toString()));
      setWishlistBooks((prev) => prev.filter((b) => (b.id || b._id || b.slug)?.toString() !== targetId?.toString()));
      showToast('Removed from your wishlist', 'info');
    } else {
      setWishlistIds((prev) => [...prev, targetId]);
      if (targetBook) {
        const normalized = normalizeLibraryBook({ bookId: targetBook }, books);
        setWishlistBooks((prev) => [...prev, normalized || targetBook]);
      }
      showToast('Added to your wishlist', 'success');
    }

    try {
      const res = await apiFetch(`/reader/wishlist/${targetId}`, { method: 'POST' });
      if (res.success && res.data) {
        const formatted = res.data.map((item) => normalizeLibraryBook({ bookId: item }, books)).filter(Boolean);
        setWishlistBooks(formatted);
        setWishlistIds(formatted.map((b) => b.id || b._id || b.slug));
      }
    } catch (err) {
      console.warn('[toggleWishlist API Fallback]:', err.message);
    }
  }, [currentUser, wishlistIds, wishlistBooks, books, showToast]);

  /**
   * Reader: Delete Bookmark
   */
  const deleteBookmark = useCallback(async (bookmarkIdOrBookId, pageNumber) => {
    try {
      let endpoint = `/reader/bookmarks/${bookmarkIdOrBookId}`;
      if (pageNumber) {
        endpoint = `/reader/books/${bookmarkIdOrBookId}/bookmarks/${pageNumber}`;
      }
      const res = await apiFetch(endpoint, { method: 'DELETE' });
      if (res.success && res.data) {
        setBookmarks(res.data);
        setBookmarkIds(res.data.map((bm) => bm.bookId?._id || bm.bookId?.id || bm.bookId));
      } else {
        setBookmarks((prev) => prev.filter((bm) => bm._id !== bookmarkIdOrBookId && bm.id !== bookmarkIdOrBookId));
      }
      showToast('Bookmark removed', 'info');
    } catch (err) {
      console.warn('[deleteBookmark Error]:', err.message);
      setBookmarks((prev) => prev.filter((bm) => bm._id !== bookmarkIdOrBookId && bm.id !== bookmarkIdOrBookId));
    }
  }, [showToast]);

  /**
   * Reader: Toggle Bookmark with Instant Sync & Auth Prompt Modal Trigger
   */
  const toggleBookmark = useCallback(async (bookOrId) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return false;
    }

    const targetId = typeof bookOrId === 'string' ? bookOrId : (bookOrId.id || bookOrId._id || bookOrId.slug);
    const targetBook = typeof bookOrId === 'object' ? bookOrId : books.find((b) => b.id === targetId || b._id === targetId || b.slug === targetId);

    const existingBookmark = bookmarks.find((bm) => {
      const bId = bm.bookId?._id || bm.bookId?.id || bm.bookId;
      return bId === targetId || bm.bookId === targetId;
    });

    if (existingBookmark) {
      // Remove bookmark
      setBookmarks((prev) => prev.filter((bm) => bm._id !== existingBookmark._id && bm.bookId !== targetId));
      setBookmarkIds((prev) => prev.filter((id) => id !== targetId));
      showToast('Bookmark removed', 'info');

      try {
        const res = await apiFetch(`/reader/bookmarks/${existingBookmark._id || targetId}`, { method: 'DELETE' });
        if (res.success && res.data) {
          setBookmarks(res.data);
          setBookmarkIds(res.data.map((bm) => bm.bookId?._id || bm.bookId?.id || bm.bookId));
        }
      } catch (err) {
        console.warn('[toggleBookmark DELETE Fallback]:', err.message);
      }
    } else {
      // Add bookmark
      setBookmarkIds((prev) => [...prev, targetId]);
      showToast('Bookmark saved to your library', 'success');

      try {
        const res = await apiFetch('/reader/bookmarks', {
          method: 'POST',
          body: JSON.stringify({ bookId: targetId, pageRef: 'Page 1' })
        });
        if (res.success && res.data) {
          setBookmarks((prev) => [res.data, ...prev]);
        }
      } catch (err) {
        console.warn('[toggleBookmark POST Fallback]:', err.message);
      }
    }
  }, [currentUser, bookmarks, books, showToast]);

  /**
   * Reader: Purchase Book (Development Transaction)
   */
  const purchaseBook = useCallback(async (bookOrId, price) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return false;
    }

    const targetId = typeof bookOrId === 'string' ? bookOrId : (bookOrId.id || bookOrId._id || bookOrId.slug);
    const targetBook = typeof bookOrId === 'object' ? bookOrId : books.find((b) => b.id === targetId || b._id === targetId || b.slug === targetId);

    try {
      const res = await apiFetch('/reader/purchase', {
        method: 'POST',
        body: JSON.stringify({ bookId: targetId, price: price || targetBook?.price || 499 })
      });

      if (res.success && res.data) {
        setPurchasedBookIds((prev) => [...new Set([...prev, targetId, targetBook?._id?.toString()])].filter(Boolean));
        if (res.data.library) {
          const formatted = res.data.library
            .map((item) => normalizeLibraryBook(item, books))
            .filter(Boolean);
          setLibraryBookState(formatted);
        }
        showToast(`Purchased "${targetBook?.title || 'Book'}" successfully!`, 'success');
        fetchModuleData();
        return true;
      }
    } catch (err) {
      console.warn('[purchaseBook API Fallback]:', err.message);
    }

    // In-memory fallback
    setPurchasedBookIds((prev) => [...new Set([...prev, targetId])]);
    if (targetBook) {
      const normalizedFallback = normalizeLibraryBook({
        bookId: targetBook,
        progress: 0,
        currentPage: 1,
        totalPages: targetBook.pages || 320,
        status: 'Currently Reading',
        lastRead: 'Just now'
      }, books);
      if (normalizedFallback) {
        setLibraryBookState((prev) => [normalizedFallback, ...prev]);
      }
    }
    showToast(`Purchased "${targetBook?.title || 'Book'}" successfully!`, 'success');
    return true;
  }, [currentUser, books, showToast, fetchModuleData]);

  /**
   * Reader: Save Reading Progress
   */
  const saveReadingProgress = useCallback(async ({ bookId, currentPage, totalPages }) => {
    if (!currentUser) return;
    try {
      const res = await apiFetch('/reader/progress', {
        method: 'POST',
        body: JSON.stringify({ bookId, currentPage, totalPages })
      });
      if (res.success && res.data) {
        fetchModuleData();
      }
    } catch (err) {
      console.warn('[saveReadingProgress API Fallback]:', err.message);
    }
  }, [currentUser, fetchModuleData]);

  /**
   * Reader: Toggle / Add to Library
   */
  const toggleLibrary = useCallback(async (bookId) => {
    try {
      const res = await apiFetch(`/reader/library/${bookId}`, { method: 'POST' });
      if (res.success && res.data) {
        const formatted = (Array.isArray(res.data) ? res.data : [])
          .map((item) => normalizeLibraryBook(item, books))
          .filter(Boolean);
        setLibraryBookState(formatted);
        return;
      }
    } catch (err) {
      console.warn('[toggleLibrary API Fallback]:', err.message);
    }

    setLibraryBookState((prev) => {
      const targetIdStr = bookId?.toString();
      const exists = prev.some((item) => item.id === bookId || item._id?.toString() === targetIdStr || item.slug === bookId);
      if (exists) {
        return prev.filter((item) => item.id !== bookId && item._id?.toString() !== targetIdStr && item.slug !== bookId);
      } else {
        const targetBook = books.find((b) => b.id === bookId || b._id?.toString() === targetIdStr || b.slug === bookId);
        const newLibraryItem = normalizeLibraryBook({
          bookId: targetBook || bookId,
          progress: 10,
          currentPage: 25,
          totalPages: targetBook?.pages || 300,
          status: 'Currently Reading',
          lastRead: 'Just now'
        }, books);
        return newLibraryItem ? [newLibraryItem, ...prev] : prev;
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
        setReviews((prev) => [res.data, ...prev]);
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
    setReviews((prev) => [newReview, ...prev]);
  }, [fetchPublicData]);

  // Derived helpers
  const getBookById = useCallback((id) => {
    if (!id) return null;
    return editorialBooks.find((b) => b.slug === id || b.id === id || b._id === id || b.legacyId === id) ||
           books.find((b) => b.slug === id || b.id === id || b._id === id || b.legacyId === id) || null;
  }, [editorialBooks, books]);

  const getAuthorById = useCallback((id) => {
    if (!id) return null;
    return authors.find((a) => a.slug === id || a.id === id || a._id === id || a.legacyId === id || a.name?.toLowerCase().replace(/\s+/g, '-') === id) || null;
  }, [authors]);

  const getReviewsByBookId = useCallback((bookId) => {
    return reviews.filter((r) => r.bookId === bookId || r.bookId?._id === bookId);
  }, [reviews]);

  const getBooksByAuthorId = useCallback((authorId) => {
    return (editorialBooks.length > 0 ? editorialBooks : books).filter((b) => b.authorId === authorId || b.authorId?._id === authorId);
  }, [editorialBooks, books]);

  const getBookmarkForBook = useCallback((bookId) => {
    if (!bookId) return null;
    return bookmarks.find((bm) => {
      const bId = bm.bookId?._id || bm.bookId?.id || bm.bookId;
      return bId === bookId;
    }) || null;
  }, [bookmarks]);

  return (
    <DataContext.Provider
      value={{
        books,
        editorialBooks,
        authors,
        reviews,
        categories,
        wishlistIds,
        bookmarkIds,
        bookmarks,
        purchasedBookIds,
        libraryBookState,
        wishlistBooks,

        fetchPublicData,
        fetchEditorialData,
        fetchModuleData,
        addBook,
        updateBook,
        deleteBook,
        updateBookStatus,
        regenerateBookCover,
        toggleWishlist,
        toggleBookmark,
        deleteBookmark,
        purchaseBook,
        saveReadingProgress,
        toggleLibrary,
        addReview,
        isBookInWishlist,
        isBookBookmarked,
        isBookPurchased,
        showToast,

        getBookById,
        getAuthorById,
        getReviewsByBookId,
        getBooksByAuthorId,
        getBookmarkForBook,

        activeReaderBook,
        setActiveReaderBook,

        studioBooks: studioBooks.length > 0 ? studioBooks : books.filter((b) => b.authorId === 'kalki-krishnamurthy' || b.author === currentUser?.name),
        editorialQueue: editorialQueue.length > 0 ? editorialQueue : (editorialBooks.length > 0 ? editorialBooks.filter((b) => b.status === 'Submitted' || b.status === 'submitted' || b.status === 'In Review' || b.status === 'Pending Review' || b.status === 'Rejected') : books.filter((b) => b.status === 'Submitted' || b.status === 'submitted' || b.status === 'In Review' || b.status === 'Pending Review' || b.status === 'Rejected')),
      }}
    >
      {children}

      {/* ── GLOBAL EDITORIAL WISHLIST TOAST ── */}
      <AnimatePresence>
        {toastState.show && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 right-8 z-50 bg-[#181616] text-[#F5F5DA] px-5 py-3.5 rounded-2xl border border-[#D8CFAE]/30 shadow-2xl flex items-center gap-3 font-editorial-sans text-xs font-semibold select-none pointer-events-none"
          >
            {toastState.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-[#212842]" />
            ) : (
              <Info className="w-4 h-4 text-[#D8CFAE]" />
            )}
            <span>{toastState.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GLOBAL SIGN-IN PROMPT MODAL (LOGGED OUT USERS) ── */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="fixed inset-0 bg-[#181616]/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-3xl bg-[#FFFDF3] border border-[#D8CFAE] p-6 sm:p-8 shadow-2xl z-10 text-center space-y-6"
            >
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#5F594F] hover:text-[#181616] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] flex items-center justify-center mx-auto text-[#212842] shadow-xs">
                <Bookmark className="w-6 h-6 text-[#212842]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial-serif text-2xl font-bold text-[#181616] tracking-tight">
                  Sign in to save books to your personal library.
                </h3>
                <p className="text-xs text-[#5F594F] font-sans leading-relaxed">
                  Create an account or sign in to save your favorite titles, sync bookmarks across devices, and access curated reading shelves.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setAuthModalOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-[0.1em] hover:bg-[#181E33] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setAuthModalOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#FFFDF3] border border-[#D8CFAE] text-[#181616] text-xs font-mono font-bold uppercase tracking-[0.1em] hover:border-[#212842] hover:bg-[#F5F5DA] transition-all shadow-2xs"
                >
                  <span>Create Account</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
