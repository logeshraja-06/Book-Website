/**
 * DEPRECATED — kept only as a compatibility shim.
 * All data now lives in:
 *   src/data/books.js, src/data/authors.js, src/data/reviews.js, src/data/categories.js
 *
 * Do not add new data here. Import directly from the canonical files.
 */
export {
  BOOKS,
  FEATURED_BOOKS,
  ALL_GENRES,
  ALL_LANGUAGES,
  getBookById,
  getBooksByAuthorId,
} from './books';

// ALL_BOOKS alias (legacy name used by some consumers)
export { BOOKS as ALL_BOOKS } from './books';

export {
  AUTHORS,
  getAuthorById,
} from './authors';

export {
  REVIEWS,
  getReviewsByBookId,
} from './reviews';

export { CATEGORIES } from './categories';

// Legacy: EXTENDED_BOOKS was just the non-featured portion — alias to full catalog
export { BOOKS as EXTENDED_BOOKS } from './books';
