import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Star,
  Heart,
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
import SampleReaderModal from '../../components/book/SampleReaderModal';
import Button from '../../components/common/Button';
import SkeletonCard from '../../components/ui/SkeletonCard';

gsap.registerPlugin(ScrollTrigger);

export default function BookDetails() {
  const { id: slugOrId } = useParams();
  const navigate = useNavigate();
  const {
    getBookById: getBook,
    getAuthorById: getAuthor,
    getReviewsByBookId,
    books,
    wishlistIds,
    libraryBookState,
    toggleWishlist,
    toggleLibrary,
  } = useData();

  const book = getBook(slugOrId);
  const coverRef = useRef(null);

  // Toggle states for reader actions
  const bookIdKey = book?.id || book?._id;
  const wishlisted = book ? wishlistIds.includes(bookIdKey) : false;
  const inLibrary = book ? libraryBookState.some((item) => item.id === bookIdKey || item.bookId === bookIdKey) : false;

  // Modals & Toast State
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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

  const handleSimulatedPurchase = () => {
    setPurchaseModalOpen(false);
    showToast('✓ Purchase confirmed — download ready');
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7 text-[#D3968C]" />
          </div>
          <h2 className="font-editorial-serif text-2xl text-[#2B2B2B]">Book not found</h2>
          <p className="text-sm text-[#6E6A67]">The title you're looking for doesn't exist in our catalog.</p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
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
    { label: 'ISBN', value: `${book.isbn || '978-81-000000'} (Demo ISBN — V1 placeholder)` },
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
          className={`w-4 h-4 ${i < full ? 'text-[#D3968C] fill-[#D3968C]' : 'text-[#E7D9D3]'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#6E6A67]">
          <Link to="/" className="hover:text-[#2B2B2B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/books" className="hover:text-[#2B2B2B] transition-colors">
            Books
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/categories/${categorySlug}`} className="hover:text-[#2B2B2B] transition-colors">
            {book.genre}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#2B2B2B] font-medium truncate max-w-[200px]">{book.title}</span>
        </nav>
      </div>

      {/* Hero Spread */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Cover Image & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-6"
          >
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative overflow-hidden rounded-2xl bg-[#F4EEEA] shadow-2xl shadow-[#2B2B2B]/10 border border-[#E7D9D3] cursor-pointer group"
              title="Click to view full cover"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  ref={coverRef}
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-[115%] object-cover -mt-[5%] group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-[#FAF8F6]/90 backdrop-blur-sm text-xs font-mono font-semibold uppercase tracking-wider text-[#2B2B2B] flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5" />
                  View Cover
                </span>
              </div>

              {book.badge && (
                <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-[#FAF8F6]/90 backdrop-blur-sm text-[10px] uppercase tracking-widest font-mono text-[#2B2B2B] font-semibold border border-[#E7D9D3]/50">
                  {book.badge}
                </span>
              )}
            </div>

            {/* Read Sample + Purchase Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setSampleModalOpen(true)}
                className="w-full shadow-md justify-center"
                icon={BookOpen}
              >
                Read Sample
              </Button>

              <button
                type="button"
                onClick={() => setPurchaseModalOpen(true)}
                className="w-full px-5 py-3.5 rounded-full border-2 border-[#2B2B2B] bg-transparent text-[#2B2B2B] hover:bg-[#2B2B2B] hover:text-[#FAF8F6] transition-all font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 group shadow-sm"
              >
                <Download className="w-4 h-4 text-[#D3968C] group-hover:text-[#FAF8F6] transition-colors" />
                <span>Download ({formatPrice(book.price)})</span>
              </button>
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
                className="px-3 py-1 rounded-full bg-[#E8C8C2]/30 text-[#2B2B2B] text-xs font-mono uppercase tracking-wider hover:bg-[#D3968C] hover:text-[#FAF8F6] transition-colors"
              >
                {book.genre}
              </Link>
              <span className="text-xs text-[#6E6A67] font-mono">
                {book.publisher || 'BookVerse Studio Imprint'} · Published {book.publishYear}
              </span>
            </div>

            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#2B2B2B] tracking-tight leading-[1.1] font-normal">
              {book.title}
            </h1>

            <div className="flex items-center gap-3">
              {author && (
                <Link to={`/authors/${authorSlug}`} className="shrink-0">
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E7D9D3]"
                  />
                </Link>
              )}
              <div>
                <Link
                  to={`/authors/${authorSlug}`}
                  className="text-base font-medium text-[#2B2B2B] hover:text-[#D3968C] transition-colors hover-underline-accent"
                >
                  {book.author}
                </Link>
                {author && (
                  <p className="text-xs text-[#6E6A67]">{author.role}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 font-tabular">
              <div className="flex items-center gap-0.5">{renderStars(book.rating)}</div>
              <span className="text-sm font-medium text-[#2B2B2B]">{book.rating || 4.8}</span>
              <span className="text-sm text-[#6E6A67]">({book.reviewsCount || '1.2k'} reviews)</span>
            </div>

            {book.tagline && (
              <p className="font-editorial-serif text-xl italic text-[#6E6A67] leading-relaxed">
                "{book.tagline}"
              </p>
            )}

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
                About This Book
              </h3>
              <p className="text-base text-[#2B2B2B] leading-[1.8]">
                {book.synopsis}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-[#E7D9D3]">
              <h3 className="text-xs uppercase tracking-widest font-mono text-[#2B2B2B] font-semibold">
                Book Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 py-4 text-xs font-mono">
                {bookSpecs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between border-b border-[#E7D9D3]/60 pb-2">
                    <span className="text-[#6E6A67]">{spec.label}</span>
                    <span className="text-[#2B2B2B] font-semibold font-tabular">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
              <div>
                <span className="text-xs text-[#6E6A67] block mb-1">Editorial Edition</span>
                <span className="font-editorial-serif font-tabular text-3xl font-bold text-[#2B2B2B]">
                  {formatPrice(book.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleWishlist(bookIdKey)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    wishlisted
                      ? 'bg-[#E8C8C2]/40 border-[#D3968C] text-[#2B2B2B] font-semibold'
                      : 'border-[#E7D9D3] text-[#2B2B2B] hover:border-[#D3968C]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#D3968C] text-[#D3968C]' : ''}`} />
                  <span>{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleLibrary(bookIdKey)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                    inLibrary
                      ? 'bg-[#2B2B2B] text-[#FAF8F6] font-semibold border-[#2B2B2B]'
                      : 'border-[#E7D9D3] text-[#2B2B2B] hover:border-[#D3968C]'
                  }`}
                >
                  <Library className="w-4 h-4" />
                  <span>{inLibrary ? 'In Shelf' : 'Add to Shelf'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Author Section */}
      {author && (
        <section className="bg-[#F4EEEA] border-y border-[#E7D9D3] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl">
              <Link to={`/authors/${authorSlug}`} className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E7D9D3] shrink-0">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
                  About the Author
                </span>
                <Link to={`/authors/${authorSlug}`}>
                  <h3 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal hover:text-[#D3968C] transition-colors">
                    {author.name}
                  </h3>
                </Link>
                <p className="text-xs font-mono uppercase tracking-wider text-[#6E6A67]">
                  {author.role}
                </p>
                <p className="text-sm text-[#2B2B2B] leading-relaxed">
                  {author.bio}
                </p>
                <Link
                  to={`/authors/${authorSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#D3968C] hover:underline font-semibold"
                >
                  <span>Explore Author's Shelf</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block mb-1">
                More in {book.genre}
              </span>
              <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
                Related Reading & Recommendations
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedBooks.map((rel) => {
              const relSlug = rel.slug || rel.id || rel._id;
              const relAuthorSlug = rel.author?.toLowerCase().replace(/\s+/g, '-') || 'kalki-krishnamurthy';
              return (
                <div
                  key={relSlug}
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E7D9D3] flex flex-col justify-between hover:border-[#D3968C] transition-all duration-300 group shadow-sm h-full"
                >
                  <div>
                    <Link to={`/books/${relSlug}`} className="block aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EEEA] mb-4">
                      <img
                        src={rel.coverUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
                      {rel.genre}
                    </span>

                    <Link to={`/books/${relSlug}`}>
                      <h3 className="font-editorial-serif text-base font-bold text-[#2B2B2B] line-clamp-1 mt-1 group-hover:text-[#C98579] transition-colors">
                        {rel.title}
                      </h3>
                    </Link>

                    <Link to={`/authors/${relAuthorSlug}`} className="text-xs text-[#6E6A67] hover:text-[#2B2B2B] mt-1 block">
                      By {rel.author}
                    </Link>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#E7D9D3] flex items-center justify-between">
                    <span className="font-editorial-serif text-base font-bold text-[#2B2B2B]">
                      {formatPrice(rel.price)}
                    </span>
                    <Link
                      to={`/books/${relSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B2B2B] group-hover:text-[#D3968C] transition-colors"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox Cover Preview Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
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

      {/* Sample Preview Modal */}
      <SampleReaderModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        book={book}
        onPurchaseClick={() => setPurchaseModalOpen(true)}
      />

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {purchaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-[#FAF8F6] text-[#2B2B2B] rounded-3xl p-8 shadow-2xl border border-[#E7D9D3] space-y-6 text-center"
            >
              <button
                type="button"
                onClick={() => setPurchaseModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-[#6E6A67]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#E8C8C2]/30 border border-[#D3968C] flex items-center justify-center mx-auto text-[#D3968C]">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D3968C] font-semibold">
                  Editorial Purchase
                </span>
                <h3 className="font-editorial-serif text-2xl font-bold">
                  Purchase {book.title}
                </h3>
                <p className="text-sm text-[#6E6A67] leading-relaxed">
                  Purchase <strong>{book.title}</strong> for <span className="font-bold text-[#2B2B2B]">{formatPrice(book.price)}</span> to download the full book edition.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSimulatedPurchase}
                  className="w-full py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D3968C]" />
                  <span>Buy Now ({formatPrice(book.price)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseModalOpen(false)}
                  className="w-full py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider hover:bg-black/5 transition-colors text-[#6E6A67]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[130] px-5 py-3.5 rounded-2xl bg-[#2B2B2B] text-[#FAF8F6] text-xs font-mono shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D3968C]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
