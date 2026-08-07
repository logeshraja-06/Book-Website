// Centralized Route Path Constants
export className RoutePaths {
  // Public
  static HOME = '/';
  static BOOKS = '/books';
  static BOOK_DETAILS = '/books/:id';
  static AUTHORS = '/authors';
  static AUTHOR_PROFILE = '/authors/:id';
  static CATEGORIES = '/categories';
  static ABOUT = '/about';
  static CONTACT = '/contact';
  static BLOG = '/blog';

  // Auth
  static LOGIN = '/login';
  static PUBLISHER_LOGIN = '/publisher/login';

  // Reader Portal ("My Shelf")
  static MY_SHELF = '/my-shelf';
  static WISHLIST = '/my-shelf/wishlist';
  static BOOKMARKS = '/my-shelf/bookmarks';
  static REVIEWS = '/my-shelf/reviews';
  static READER_PROFILE = '/my-shelf/profile';

  // Author Module
  static AUTHOR_DASHBOARD = '/author/dashboard';
  static AUTHOR_BOOKS = '/author/books';
  static AUTHOR_UPLOAD = '/author/upload';
  static AUTHOR_EDIT_BOOK = '/author/books/:id/edit';
  static AUTHOR_ANALYTICS = '/author/analytics';
  static AUTHOR_PROFILE = '/author/profile';

  // Publisher Workspace
  static PUBLISHER_HOME = '/publisher';
  static PUBLISHER_QUEUE = '/publisher/queue';
  static PUBLISHER_REVIEW = '/publisher/review/:submissionId';
  static PUBLISHER_AUTHORS = '/publisher/authors';
  static PUBLISHER_BOOKS = '/publisher/books';
  static PUBLISHER_CATEGORIES = '/publisher/categories';
  static PUBLISHER_REPORTS = '/publisher/reports';
}
