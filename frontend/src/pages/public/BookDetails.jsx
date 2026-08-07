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
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import SampleReaderModal from '../../components/book/SampleReaderModal';
import Button from '../../components/common/Button';

gsap.registerPlugin(ScrollTrigger);

export default function BookDetails() {
  const { id } = useParams();
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

  const book = getBook(id);
  const coverRef = useRef(null);

  // Toggle states for reader actions
  const wishlisted = book ? wishlistIds.includes(book.id) : false;
  const inLibrary = book ? libraryBookState.some((item) => item.id === book.id) : false;

  // Modals & Toast State
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Parallax on cover image
  useEffect(() => {
    if (!coverRef.current || !book) return;

    const ctx = gsap.context(() => {
      gsap.to(coverRef.current, {
        yPercent: 12,
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
    showToast('✓ Purchase simulated — download would begin here');
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
  const bookReviews = getReviewsByBookId(id);
  const relatedBooks = books.filter((b) => b.id !== book.id).slice(0, 4);

  // Specifications key-value pairs
  const bookSpecs = [
    { label: 'Pages', value: `${book.pages || 350} pages` },
    { label: 'Format', value: 'Hardcover Editorial Edition' },
    { label: 'ISBN', value: book.isbn },
    { label: 'Language', value: book.language },
    { label: 'Publisher', value: book.publisher || 'BookVerse Studio Imprint' },
    { label: 'Publication Year', value: book.publishYear },
  ];

  const renderStars = (rating) => {
    const full = Math.floor(rating);
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
            <div className="relative overflow-hidden rounded-2xl bg-[#F4EEEA] shadow-2xl shadow-[#2B2B2B]/10 border border-[#E7D9D3]">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  ref={coverRef}
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-[115%] object-cover -mt-[5%]"
                />
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
                <span>Download (₹{book.price.toLocaleString()})</span>
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
              <span className="px-3 py-1 rounded-full bg-[#E8C8C2]/30 text-[#2B2B2B] text-xs font-mono uppercase tracking-wider">
                {book.genre}
              </span>
              <span className="text-xs text-[#6E6A67] font-mono">
                {book.publisher || 'BookVerse Studio Imprint'} · Published {book.publishYear}
              </span>
            </div>

            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-[#2B2B2B] tracking-tight leading-[1.1] font-normal">
              {book.title}
            </h1>

            <div className="flex items-center gap-3">
              {author && (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E7D9D3]"
                />
              )}
              <div>
                <Link
                  to={author ? `/authors/${author.id}` : '/authors'}
                  className="text-base font-medium text-[#2B2B2B] hover:text-[#D3968C] transition-colors hover-underline-accent"
                >
                  {book.author}
                </Link>
                {author && (
                  <p className="text-xs text-[#6E6A67]">{author.role}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">{renderStars(book.rating)}</div>
              <span className="text-sm font-medium text-[#2B2B2B]">{book.rating}</span>
              <span className="text-sm text-[#6E6A67]">({book.reviewsCount} reviews)</span>
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
                    <span className="text-[#2B2B2B] font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
              <div>
                <span className="text-xs text-[#6E6A67] block mb-1">Editorial Edition</span>
                <span className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
                  ₹{book.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleWishlist(book.id)}
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
                  onClick={() => toggleLibrary(book.id)}
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

      {/* About Author */}
      {author && (
        <section className="bg-[#F4EEEA] border-y border-[#E7D9D3] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E7D9D3] shrink-0">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold">
                  About the Author
                </span>
                <h3 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
                  {author.name}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-[#6E6A67]">
                  {author.role} · {author.location}
                </p>
                <p className="text-sm text-[#2B2B2B] leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
                  Purchase <strong>{book.title}</strong> for <span className="font-bold text-[#2B2B2B]">₹{book.price.toLocaleString()}</span> to download the full book edition.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSimulatedPurchase}
                  className="w-full py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D3968C]" />
                  <span>Buy Now (₹{book.price.toLocaleString()})</span>
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
