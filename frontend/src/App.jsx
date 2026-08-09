import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import BooksListing from './pages/public/BooksListing';
import BookDetails from './pages/public/BookDetails';
import AuthorsListing from './pages/public/AuthorsListing';
import AuthorProfile from './pages/public/AuthorProfile';
import CategoriesPage from './pages/public/CategoriesPage';
import CategoryDetail from './pages/public/CategoryDetail';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import BlogPage from './pages/public/BlogPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import PublisherLoginPage from './pages/auth/PublisherLoginPage';

import ReaderRegisterPage from './pages/auth/ReaderRegisterPage';
import AuthorRegisterPage from './pages/auth/AuthorRegisterPage';

// Reader Module Imports ("My Shelf")
import ReaderLayout from './components/layout/ReaderLayout';
import MyLibraryView from './pages/reader/MyLibraryView';
import WishlistView from './pages/reader/WishlistView';
import BookmarksView from './pages/reader/BookmarksView';
import ReviewsView from './pages/reader/ReviewsView';
import ProfileView from './pages/reader/ProfileView';
import ReaderStandaloneView from './pages/reader/ReaderStandaloneView';

// Author Module Imports (Simplified 6-Page Suite)
import AuthorLayout from './components/layout/AuthorLayout';
import AuthorDashboard from './pages/author/AuthorDashboard';
import AuthorBooksView from './pages/author/AuthorBooksView';
import AuthorUploadWizard from './pages/author/AuthorUploadWizard';
import AuthorEditBook from './pages/author/AuthorEditBook';
import AuthorAnalytics from './pages/author/AuthorAnalytics';
import AuthorProfileView from './pages/author/AuthorProfileView';

// Publisher Workspace Imports
import PublisherLayout from './components/layout/PublisherLayout';
import PublisherHome from './pages/publisher/PublisherHome';
import ReviewQueue from './pages/publisher/ReviewQueue';
import BookReview from './pages/publisher/BookReview';
import PublisherAuthors from './pages/publisher/PublisherAuthors';
import PublisherBooks from './pages/publisher/PublisherBooks';
import PublisherCategories from './pages/publisher/PublisherCategories';
import PublisherReports from './pages/publisher/PublisherReports';
import PublisherProfileView from './pages/publisher/PublisherProfileView';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#FAF8F6] text-[#2B2B2B]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksListing />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/authors" element={<AuthorsListing />} />
            <Route path="/authors/:id" element={<AuthorProfile />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            
            {/* Dedicated Registration Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/reader" element={<ReaderRegisterPage />} />
            <Route path="/register/author" element={<AuthorRegisterPage />} />
            <Route path="/register" element={<Navigate to="/register/reader" replace />} />

            {/* Publisher Internal Login */}
            <Route path="/publisher/login" element={<PublisherLoginPage />} />

            {/* Legacy Author Page Redirects */}
            <Route path="/become-author" element={<Navigate to="/login" replace />} />
            <Route path="/author/register" element={<Navigate to="/login" replace />} />

            {/* Reader Portal Nested Routes ("My Shelf") */}
            <Route
              path="/my-shelf"
              element={
                <ProtectedRoute allowedRoles={['reader', 'author', 'publisher']}>
                  <ReaderLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MyLibraryView />} />
              <Route path="wishlist" element={<WishlistView />} />
              <Route path="bookmarks" element={<BookmarksView />} />
              <Route path="reviews" element={<ReviewsView />} />
              <Route path="profile" element={<ProfileView />} />
            </Route>

            {/* Standalone Reader Route */}
            <Route
              path="/reader/:id"
              element={
                <ProtectedRoute allowedRoles={['reader', 'author', 'publisher']}>
                  <ReaderStandaloneView />
                </ProtectedRoute>
              }
            />

            {/* Legacy Library & Profile Route Redirects */}
            <Route path="/library/*" element={<Navigate to="/my-shelf" replace />} />
            <Route path="/profile" element={<Navigate to="/my-shelf/profile" replace />} />

            {/* Simplified 6-Page Author Module Nested Routes */}
            <Route
              path="/author"
              element={
                <ProtectedRoute allowedRoles={['author', 'publisher']}>
                  <AuthorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AuthorDashboard />} />
              <Route path="books" element={<AuthorBooksView />} />
              <Route path="upload" element={<AuthorUploadWizard />} />
              <Route path="books/:id/edit" element={<AuthorEditBook />} />
              <Route path="analytics" element={<AuthorAnalytics />} />
              <Route path="profile" element={<AuthorProfileView />} />
            </Route>

            {/* Publisher Workspace Nested Routes */}
            <Route
              path="/publisher"
              element={
                <ProtectedRoute allowedRoles={['publisher']}>
                  <PublisherLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PublisherHome />} />
              <Route path="queue" element={<ReviewQueue />} />
              <Route path="review/:submissionId" element={<BookReview />} />
              <Route path="authors" element={<PublisherAuthors />} />
              <Route path="books" element={<PublisherBooks />} />
              <Route path="categories" element={<PublisherCategories />} />
              <Route path="reports" element={<PublisherReports />} />
              <Route path="profile" element={<PublisherProfileView />} />
            </Route>

            {/* Fallback 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
