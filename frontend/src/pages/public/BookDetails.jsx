import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Star,
  Bookmark,
  Library,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  ShoppingBag,
  CheckCircle2,
  X,
  Maximize2,
  ArrowUpRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import Button from '../../components/common/Button';
import BookCover from '../../components/book/BookCover';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';
import { RelatedBookCard } from '../../components/book/BookCardComponents';

gsap.registerPlugin(ScrollTrigger);

export default function BookDetails() {
  const { id: slugOrId } = useParams();
  const navigate = useNavigate();
  const {
    getBookById: getBook,
    getAuthorById: getAuthor,
    books,
    isBookInWishlist,
    isBookBookmarked,
    isBookPurchased,
    toggleWishlist,
    toggleBookmark,
    purchaseBook,
    setActiveReaderBook,
    activeReaderBook,
  } = useData();

  const book = getBook(slugOrId);
  const coverRef = useRef(null);

  // Dynamic state checks
  const wishlisted = isBookInWishlist(book);
  const bookmarked = isBookBookmarked(book);
  const purchased = isBookPurchased(book);

  // Modals & Toast State
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Parallax on cover image
  useEffect(() => {
    if (!coverRef.current || !book) return;

    const ctx = gsap.context(() => {
      gsap.to(coverRef.current, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: coverRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [book]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmPurchase = async () => {
    setIsPurchasing(true);
    try {
      await purchaseBook(book, book.price);
      setPurchaseModalOpen(false);
      showToast('✓ Purchase confirmed — added to My Shelf');
    } catch (err) {
      showToast(`Purchase completed: ${err.message}`);
      setPurchaseModalOpen(false);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!purchased) {
      showToast('Purchase required to download PDF', 'info');
      setPurchaseModalOpen(true);
      return;
    }
    const bookId = book.id || book._id;
    window.open(`http://localhost:5001/api/reader/books/${bookId}/pdf`, '_blank');
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-[#F5F5DA] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFFDF3] border border-[#D8CFAE] flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7 text-[#7B021D]" />
          </div>
          <h2 className="font-editorial-serif text-2xl text-[#181616]">Book not found</h2>
          <p className="text-sm text-[#5F594F]">The title you're looking for doesn't exist in our catalog.</p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const author = getAuthor(book.authorId);
  const authorSlug = author?.slug || book.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
  const categorySlug = book.genre?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general';

  // Same genre prioritized related books
  const sameGenreBooks = books.filter((b) => (b.slug || b.id) !== (book.slug || book.id) && b.genre === book.genre);
  const otherBooks = books.filter((b) => (b.slug || b.id) !== (book.slug || book.id) && b.genre !== book.genre);
  const relatedBooks = [...sameGenreBooks, ...otherBooks].slice(0, 4);

  // Specifications key-value pairs
  const bookSpecs = [
    { label: 'Catalog ID', value: book.bookCode || `BVS-2026-${String(book.id || '000001').slice(-6).toUpperCase()}` },
    { label: 'ISBN', value: book.isbn || 'BV-978-INTERNAL' },
    { label: 'Pages', value: `${book.pages || 350} pages` },
    { label: 'Format', value: 'Hardcover Editorial Edition' },
    { label: 'Language', value: book.language || 'English' },
    { label: 'Publisher', value: book.publisher || 'BookVerse Studio Imprint' },
    { label: 'Publication Year', value: book.publishYear || 2026 },
  ];

  const renderStars = (rating) => {
    const full = Math.floor(rating || 5);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < full ? 'text-[#7B021D] fill-[#7B021D]' : 'text-[#D8CFAE]'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#F5F5DA]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#5F594F]">
          <Link to="/" className="hover:text-[#181616] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#D8CFAE]" />
          <Link to="/books" className="hover:text-[#181616] transition-colors">
            Books
          </Link>
          <ChevronRight className="w-3 h-3 text-[#D8CFAE]" />
          <span className="text-[#181616] font-medium truncate max-w-xs">{book.title}</span>
        </nav>
      </div>

      {/* Main Details Hero Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Book Cover Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-28"
          >
            <div
              onClick={() => setLightboxOpen(true)}
              className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl border border-[#D8CFAE] bg-[#FFFDF3]"
            >
              <div className="aspect-[3/4] relative">
                <BookCover
                  book={book}
                  variant="default"
                  imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-[#FFFDF3]/90 backdrop-blur-sm text-xs font-mono font-bold uppercase tracking-wider text-[#181616] flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5 text-[#7B021D]" />
                  View Cover
                </span>
              </div>

              {book.badge && (
                <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-[#FFFDF3]/90 backdrop-blur-sm text-[10px] uppercase tracking-widest font-mono text-[#7B021D] font-bold border border-[#D8CFAE]">
                  {book.badge}
                </span>
              )}
            </div>

            {/* Read Now / Purchase + PDF Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {purchased ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setActiveReaderBook(book)}
                    className="w-full shadow-md justify-center"
                    icon={BookOpen}
                  >
                    Read Now
                  </Button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full px-5 py-3.5 rounded-full border-2 border-[#7B021D] bg-[#F8F6E5] text-[#7B021D] hover:bg-[#7B021D] hover:text-[#F5F5DA] transition-all font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setPurchaseModalOpen(true)}
                    className="w-full shadow-md justify-center"
                    icon={ShoppingBag}
                  >
                    Purchase — {formatPrice(book.price)}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setPurchaseModalOpen(true)}
                    className="w-full px-5 py-3.5 rounded-full border-2 border-[#D8CFAE] bg-[#F8F6E5] text-[#181616] hover:border-[#7B021D] hover:text-[#7B021D] transition-all font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Download className="w-4 h-4 text-[#7B021D]" />
                    <span>PDF Edition</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={`/categories/${categorySlug}`}
                className="px-3.5 py-1 rounded-full bg-[#FFFDF3] border border-[#D8CFAE] text-[#7B021D] text-xs font-mono uppercase tracking-wider font-bold hover:border-[#7B021D] transition-colors"
              >
                {book.genre}
              </Link>
              <span className="text-xs text-[#5F594F] font-mono">
                {book.publisher || 'BookVerse Studio Imprint'} · Published {book.publishYear}
              </span>
            </div>

            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#181616] tracking-tight leading-[1.1] font-normal">
              {book.title}
            </h1>

            <div className="flex items-center gap-3">
              {author && (
                <Link to={`/authors/${authorSlug}`} className="shrink-0">
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D8CFAE]"
                  />
                </Link>
              )}
              <div>
                <Link
                  to={`/authors/${authorSlug}`}
                  className="text-base font-bold text-[#181616] hover:text-[#7B021D] transition-colors"
                >
                  {book.author}
                </Link>
                <span className="text-xs text-[#5F594F] font-mono block">
                  {author?.role || 'Author'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-tabular">
              <div className="flex items-center gap-0.5">{renderStars(book.rating)}</div>
              <span className="text-sm font-medium text-[#181616]">{book.rating || 4.8}</span>
              <span className="text-sm text-[#5F594F]">({book.reviewsCount || '1.2k'} reviews)</span>
            </div>

            {book.tagline && (
              <p className="font-editorial-serif text-xl italic text-[#5F594F] leading-relaxed">
                "{book.tagline}"
              </p>
            )}

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold">
                About This Book
              </h3>
              <p className="text-base text-[#181616] leading-[1.8]">
                {book.synopsis}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#DED7BD]">
              <h3 className="text-xs uppercase tracking-widest font-mono text-[#181616] font-bold">
                Book Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 py-4 text-xs font-mono">
                {bookSpecs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between border-b border-[#DED7BD] pb-2">
                    <span className="text-[#5F594F]">{spec.label}</span>
                    <span className="text-[#181616] font-bold font-tabular">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar: Wishlist & Bookmark */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-[#DED7BD]">
              <div>
                <span className="text-xs text-[#5F594F] block mb-1">Price</span>
                <span className="font-editorial-sans font-tabular text-3xl font-bold tracking-tight text-[#181616]">
                  {formatPrice(book.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Wishlist Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(book)}
                  className={`px-5 py-2.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                    wishlisted
                      ? 'bg-[#7B021D] border-[#7B021D] text-[#F5F5DA] font-bold shadow-sm'
                      : 'border-[#D8CFAE] text-[#181616] hover:border-[#7B021D] bg-[#FFFDF3]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${wishlisted ? 'fill-[#F5F5DA] text-[#F5F5DA]' : 'text-[#7B021D]'}`} />
                  <span>{wishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </motion.button>

                {/* Bookmark Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleBookmark(book)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    bookmarked
                      ? 'bg-[#181616] text-[#F5F5DA] font-bold border-[#181616]'
                      : 'border-[#D8CFAE] text-[#181616] hover:border-[#7B021D] bg-[#FFFDF3]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#F5F5DA] text-[#F5F5DA]' : ''}`} />
                  <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Author Section */}
      {author && (
        <section className="bg-[#FFFDF3] border-y border-[#D8CFAE] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl">
              <Link to={`/authors/${authorSlug}`} className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D8CFAE] shrink-0">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold">
                  About the Author
                </span>
                <Link to={`/authors/${authorSlug}`}>
                  <h3 className="font-editorial-serif text-2xl text-[#181616] font-normal hover:text-[#7B021D] transition-colors">
                    {author.name}
                  </h3>
                </Link>
                <p className="text-xs font-mono uppercase tracking-wider text-[#5F594F]">
                  {author.role}
                </p>
                <p className="text-sm text-[#181616] leading-relaxed">
                  {author.bio}
                </p>
                <Link
                  to={`/authors/${authorSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#7B021D] hover:underline font-bold"
                >
                  <span>Explore Author's Catalogue</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 border-t border-[#D8CFAE]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[#181616]">
              Related Works in {book.genre}
            </h2>
            <Link
              to="/books"
              className="text-xs uppercase tracking-wider font-mono text-[#7B021D] hover:underline"
            >
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedBooks.map((rel, idx) => (
              <RelatedBookCard key={rel.slug || rel.id || rel._id} book={rel} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Cover Preview Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#F5F5DA]/90 backdrop-blur-md cursor-pointer select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-[#D8CFAE]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#181616]/80 text-[#F5F5DA] hover:bg-[#181616] transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-auto object-contain max-h-[85vh] rounded-3xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {purchaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-[#FFFDF3] text-[#181616] rounded-3xl p-8 shadow-2xl border border-[#D8CFAE] space-y-6 text-center"
            >
              <button
                type="button"
                onClick={() => setPurchaseModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F8F6E5] text-[#5F594F]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#F8F6E5] border border-[#D8CFAE] flex items-center justify-center mx-auto text-[#7B021D]">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#7B021D] font-bold">
                  Order Summary
                </span>
                <h3 className="font-editorial-serif text-2xl font-bold">
                  Purchase {book.title}
                </h3>
                <div className="p-4 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] text-left text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#5F594F]">Item:</span>
                    <span className="font-bold text-[#181616] truncate max-w-[200px]">{book.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F594F]">Format:</span>
                    <span className="text-[#181616]">Full PDF & Reading Edition</span>
                  </div>
                  <div className="flex justify-between border-t border-[#DED7BD] pt-1.5 font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#7B021D]">{formatPrice(book.price)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  disabled={isPurchasing}
                  onClick={handleConfirmPurchase}
                  className="w-full py-3.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F5F5DA]" />
                  <span>{isPurchasing ? 'Processing...' : `Confirm Purchase (${formatPrice(book.price)})`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseModalOpen(false)}
                  className="w-full py-3 rounded-full border border-[#D8CFAE] text-xs font-mono uppercase tracking-wider hover:bg-[#F8F6E5] transition-colors text-[#5F594F]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Digital Reader Modal */}
      {activeReaderBook && (
        <DigitalReaderModal
          isOpen={Boolean(activeReaderBook)}
          onClose={() => setActiveReaderBook(null)}
          book={activeReaderBook}
          initialPage={activeReaderBook.currentPage || 1}
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[130] px-5 py-3.5 rounded-2xl bg-[#7B021D] text-[#F5F5DA] text-xs font-mono shadow-2xl flex items-center gap-3 border border-[#D8CFAE]/20"
          >
            <CheckCircle2 className="w-4 h-4 text-[#F5F5DA]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
