import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  BookOpen,
  Eye,
  RotateCcw,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';
import { handleImgError, DEFAULT_BOOK_COVER } from '../../utils/imageFallback';
import { useTranslation } from 'react-i18next';

export default function BookReview() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getBookById, updateBookStatus, fetchEditorialData, fetchPublicData } = useData();

  const book = getBookById(id);

  const [editorialNotes, setEditorialNotes] = useState(
    book?.editorialNotes || book?.revisionNotes || book?.rejectionReason ||
      'Manuscript formatting meets BookVerse Studio craft standards. Cover image ratio is verified ~2:3.'
  );

  const [decisionState, setDecisionState] = useState(book?.status ? book.status.toLowerCase() : null); // 'approved' | 'published' | 'revision' | 'rejected'
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [manuscriptViewUrl, setManuscriptViewUrl] = useState(null);
  const [manuscriptLoading, setManuscriptLoading] = useState(false);
  const [manuscriptError, setManuscriptError] = useState(null);

  const targetId = book?.id || book?._id;

  useEffect(() => {
    let isMounted = true;
    const fetchManuscriptToken = async () => {
      if (!book || !book.hasManuscript || !targetId) {
        setManuscriptViewUrl(null);
        setManuscriptLoading(false);
        setManuscriptError(null);
        return;
      }

      setManuscriptLoading(true);
      setManuscriptError(null);

      try {
        const res = await apiFetch(`/files/manuscript/${targetId}/token`);
        if (!isMounted) return;

        if (res && res.data && res.data.downloadUrl) {
          const fullUrl = `http://localhost:5001${res.data.downloadUrl}`;
          setManuscriptViewUrl(fullUrl);
        } else {
          setManuscriptError('Unable to load manuscript preview.');
        }
      } catch (err) {
        if (!isMounted) return;
        setManuscriptError('Unable to load manuscript preview.');
      } finally {
        if (isMounted) {
          setManuscriptLoading(false);
        }
      }
    };

    fetchManuscriptToken();

    return () => {
      isMounted = false;
    };
  }, [targetId, book?.hasManuscript]);

  if (!book) {
    return (
      <div className="py-20 text-center space-y-4 bg-[#F5F5DA] rounded-3xl p-6">
        <h3 className="font-editorial-serif text-2xl text-[#181616]">{t('publisher.bookReview.notFoundTitle')}</h3>
        <Link to="/publisher/queue" className="text-xs font-mono text-[#212842] hover:underline font-bold">
          {t('publisher.bookReview.backToQueue')}
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await updateBookStatus(targetId, 'Approved', editorialNotes);
      setDecisionState('approved');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to approve manuscript.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await updateBookStatus(targetId, 'Published', editorialNotes);
      setDecisionState('published');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to publish book.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    setErrorMessage('');
    if (!editorialNotes.trim()) {
      setErrorMessage(t('publisher.bookReview.errorRevisionNotes'));
      return;
    }
    setIsLoading(true);
    try {
      await updateBookStatus(targetId, 'In Review', editorialNotes);
      setDecisionState('revision');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to request revisions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setErrorMessage('');
    if (!editorialNotes.trim()) {
      setErrorMessage(t('publisher.bookReview.errorRejectionReason'));
      return;
    }
    setIsLoading(true);
    try {
      await updateBookStatus(targetId, 'Rejected', editorialNotes);
      setDecisionState('rejected');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reject manuscript.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadyApproved = book.status === 'Approved' || decisionState === 'approved';
  const isAlreadyPublished = book.status === 'Published' || decisionState === 'published';

  return (
    <div className="space-y-8 bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl min-h-screen">
      {/* ── 1. BACK NAVIGATION BAR ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D8CFAE] pb-4 gap-2 sm:gap-0">
        <Link
          to="/publisher/queue"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5F594F] hover:text-[#212842] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#212842]" />
          <span>{t('publisher.bookReview.backToQueueLink')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-xs font-mono text-[#212842] uppercase tracking-wider font-bold">
            {t('publisher.bookReview.status')} {book.status}
          </span>
          <span className="text-xs font-mono text-[#5F594F] uppercase tracking-wider font-bold">
            {t('publisher.bookReview.protocol')}{String(targetId).slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── 2. 3-COLUMN EDITORIAL CONTROL DESK LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Book Metadata (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 bg-[#FFFDF3] rounded-3xl p-6 border border-[#D8CFAE] shadow-md">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F8F6E5] shadow-md border border-[#D8CFAE]">
            <img
              src={book.coverImage || book.coverUrl || DEFAULT_BOOK_COVER}
              alt={book.title}
              onError={(e) => handleImgError(e, DEFAULT_BOOK_COVER)}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-[#212842] text-[10px] font-mono uppercase tracking-wider inline-block font-bold">
              {book.genre}
            </span>
            <h2 className="font-editorial-serif text-xl font-bold text-[#181616]">
              {book.title}
            </h2>
            <p className="text-xs text-[#5F594F] font-sans">By {book.author}</p>
            <p className="text-xs text-[#5F594F] italic leading-relaxed pt-1 line-clamp-4 font-sans">
              "{book.synopsis}"
            </p>
          </div>

          <div className="pt-4 border-t border-[#DED7BD] space-y-2.5 text-xs font-mono text-[#5F594F]">
            <div className="flex justify-between">
              <span>{t('publisher.bookReview.status')}</span>
              <span className="font-bold text-[#212842]">{book.status}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('publisher.bookReview.specPrice')}</span>
              <span className="font-bold text-[#181616]">₹{book.price}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('publisher.bookReview.specLanguageLabel')}</span>
              <span className="text-[#181616]">{book.language}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('publisher.bookReview.specIsbnLabel')}</span>
              <span className="font-bold text-[#212842]">{book.isbn || 'BV-978-INTERNAL'}</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Integrated PDF Reader (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-[#FFFDF3] rounded-3xl p-6 border border-[#D8CFAE] shadow-md">
          <div className="flex items-center justify-between border-b border-[#DED7BD] pb-3">
            <h3 className="font-editorial-serif text-lg font-bold text-[#181616] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#212842]" />
              {t('publisher.bookReview.pdfReaderTitle')}
            </h3>
            {manuscriptViewUrl && (
              <a
                href={manuscriptViewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#212842] uppercase tracking-wider font-bold hover:underline"
              >
                {t('publisher.bookReview.openFullscreen')}
              </a>
            )}
          </div>

          {manuscriptLoading ? (
            <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-[#D8CFAE] bg-[#F8F6E5] shadow-inner flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#212842] border-t-transparent animate-spin" />
              <p className="font-mono text-xs text-[#5F594F]">
                Loading manuscript preview…
              </p>
            </div>
          ) : manuscriptViewUrl ? (
            <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-[#D8CFAE] bg-[#F8F6E5] shadow-inner">
              <iframe
                src={manuscriptViewUrl}
                title={`PDF Viewer - ${book.title}`}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="w-full h-[340px] rounded-2xl border border-dashed border-[#D8CFAE] bg-[#F8F6E5] flex flex-col items-center justify-center p-6 text-center space-y-2">
              <FileText className="w-10 h-10 text-[#212842]" />
              <p className="font-editorial-serif text-base font-bold text-[#181616]">
                {t('publisher.bookReview.noPdfTitle')}
              </p>
              <p className="text-xs text-[#5F594F] font-sans">
                {manuscriptError || t('publisher.bookReview.noPdfDesc')}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Reviewer Assessment & Decision (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 bg-[#FFFDF3] rounded-3xl p-6 border border-[#D8CFAE] shadow-md">
          <h3 className="font-editorial-serif text-lg font-bold text-[#181616]">
            {t('publisher.bookReview.reviewDecisionTitle')}
          </h3>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form and Action Controls */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-widest text-[#212842] block font-bold">
                {t('publisher.bookReview.notesLabel')}
              </label>
              <textarea
                rows={5}
                value={editorialNotes}
                onChange={(e) => setEditorialNotes(e.target.value)}
                placeholder={t('publisher.bookReview.notesPlaceholder')}
                className="w-full bg-[#FFFDF3] rounded-2xl border border-[#D8CFAE] p-4 text-xs text-[#181616] focus:border-[#212842] focus:outline-none transition-colors resize-none leading-relaxed font-mono shadow-inner"
              />
            </div>

            <div className="space-y-3 pt-2">
              {/* If Approved, show Publish button */}
              {isAlreadyApproved && !isAlreadyPublished && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  onClick={handlePublish}
                  className="w-full py-3.5 rounded-full bg-emerald-700 text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F5F5DA]" />
                  <span>{isLoading ? t('publisher.bookReview.publishing') : t('publisher.bookReview.publishToCatalog')}</span>
                </motion.button>
              )}

              {/* If not yet Approved or Published, show Approve button */}
              {!isAlreadyApproved && !isAlreadyPublished && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  onClick={handleApprove}
                  className="w-full py-3.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F5F5DA]" />
                  <span>{isLoading ? t('publisher.bookReview.approving') : t('publisher.bookReview.approveManuscript')}</span>
                </motion.button>
              )}

              {/* If already Published, show indicator */}
              {isAlreadyPublished && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('publisher.bookReview.publishedBadge')}</span>
                </div>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                onClick={handleRequestRevision}
                className="w-full py-3 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-xs font-mono font-bold uppercase tracking-wider text-[#181616] hover:border-[#212842] hover:text-[#212842] transition-colors shadow-2xs"
              >
                {t('publisher.bookReview.needsRevision')}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                onClick={handleReject}
                className="w-full py-3 rounded-full bg-[#FFFDF3] border border-[#D8CFAE] text-xs font-mono font-bold uppercase tracking-wider text-[#5F594F] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>{t('publisher.bookReview.rejectSubmission')}</span>
              </motion.button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
