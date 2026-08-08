import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  Archive,
  BookOpen,
  Eye,
  RotateCcw,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';

export default function BookReview() {
  const { id } = useParams();
  const { getBookById, getAuthorById, updateBookStatus, fetchEditorialData, fetchPublicData } = useData();

  const book = getBookById(id);

  const [editorialNotes, setEditorialNotes] = useState(
    book?.editorialNotes || book?.revisionNotes || book?.rejectionReason ||
      'Manuscript formatting meets BookVerse Studio craft standards. Cover image ratio is verified ~2:3.'
  );

  const [decisionState, setDecisionState] = useState(null); // 'approved' | 'revision' | 'rejected'
  const [errorMessage, setErrorMessage] = useState('');

  if (!book) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="font-editorial-serif text-2xl text-[#211D1D]">Manuscript Record Not Found</h3>
        <Link to="/publisher/queue" className="text-xs font-mono text-[#7B021D] hover:underline font-bold">
          Return to Review Queue
        </Link>
      </div>
    );
  }

  const author = getAuthorById(book.authorId);
  const targetId = book.id || book._id;
  const pdfUrl = book.pdfPath || book.manuscriptUrl
    ? (book.pdfPath || book.manuscriptUrl).startsWith('http')
      ? (book.pdfPath || book.manuscriptUrl)
      : `http://localhost:5001${book.pdfPath || book.manuscriptUrl}`
    : null;

  const handleApprove = async () => {
    setErrorMessage('');
    try {
      await apiFetch(`/editorial/books/${targetId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ notes: editorialNotes })
      });
      await updateBookStatus(targetId, 'Published', editorialNotes);
      if (fetchEditorialData) await fetchEditorialData();
      if (fetchPublicData) await fetchPublicData();
      setDecisionState('approved');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to approve manuscript.');
    }
  };

  const handleRequestRevision = async () => {
    setErrorMessage('');
    if (!editorialNotes.trim()) {
      setErrorMessage('Revision notes are required when requesting revisions.');
      return;
    }
    try {
      await apiFetch(`/editorial/books/${targetId}/revision`, {
        method: 'PUT',
        body: JSON.stringify({ notes: editorialNotes, revisionNotes: editorialNotes })
      });
      await updateBookStatus(targetId, 'Needs Revision', editorialNotes);
      if (fetchEditorialData) await fetchEditorialData();
      if (fetchPublicData) await fetchPublicData();
      setDecisionState('revision');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to request revisions.');
    }
  };

  const handleReject = async () => {
    setErrorMessage('');
    if (!editorialNotes.trim()) {
      setErrorMessage('Rejection reason is required when rejecting a submission.');
      return;
    }
    try {
      await apiFetch(`/editorial/books/${targetId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ notes: editorialNotes, rejectionReason: editorialNotes })
      });
      await updateBookStatus(targetId, 'Rejected', editorialNotes);
      if (fetchEditorialData) await fetchEditorialData();
      if (fetchPublicData) await fetchPublicData();
      setDecisionState('rejected');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reject manuscript.');
    }
  };

  return (
    <div className="space-y-8">
      {/* ── 1. BACK NAVIGATION BAR ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E9E5C8] pb-4 gap-2 sm:gap-0">
        <Link
          to="/publisher/queue"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#6B5E5E] hover:text-[#7B021D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#7B021D]" />
          <span>Back to Review Queue</span>
        </Link>

        <span className="text-xs font-mono text-[#7B021D] uppercase tracking-wider font-bold">
          Manuscript Protocol #{String(targetId).slice(-6).toUpperCase()}
        </span>
      </div>

      {/* ── 2. 3-COLUMN EDITORIAL CONTROL DESK LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Book Metadata (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F5DA] shadow-md border border-[#E9E5C8]">
            <img src={book.coverImage || book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-[#7B021D] text-[10px] font-mono uppercase tracking-wider inline-block font-bold">
              {book.genre}
            </span>
            <h2 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
              {book.title}
            </h2>
            <p className="text-xs text-[#6B5E5E] font-sans">By {book.author}</p>
            <p className="text-xs text-[#6B5E5E] italic leading-relaxed pt-1 line-clamp-4 font-sans">
              "{book.synopsis}"
            </p>
          </div>

          <div className="pt-4 border-t border-[#E9E5C8] space-y-2.5 text-xs font-mono text-[#6B5E5E]">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-[#7B021D]">{book.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-bold text-[#211D1D]">₹{book.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Language:</span>
              <span className="text-[#211D1D]">{book.language}</span>
            </div>
            <div className="flex justify-between">
              <span>ISBN:</span>
              <span className="font-bold text-[#7B021D]">{book.isbn || 'BV-978-INTERNAL'}</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Integrated PDF Reader (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md">
          <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-3">
            <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#7B021D]" />
              Integrated PDF Reader
            </h3>
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#7B021D] uppercase tracking-wider font-bold hover:underline"
              >
                Open Fullscreen
              </a>
            )}
          </div>

          {pdfUrl ? (
            <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-[#E9E5C8] bg-[#F5F5DA] shadow-inner">
              <iframe
                src={pdfUrl}
                title={`PDF Viewer - ${book.title}`}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="w-full h-[340px] rounded-2xl border border-dashed border-[#E9E5C8] bg-[#FFFDF3]/60 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <FileText className="w-10 h-10 text-[#7B021D]" />
              <p className="font-editorial-serif text-base font-bold text-[#211D1D]">
                No PDF Manuscript Uploaded
              </p>
              <p className="text-xs text-[#6B5E5E] font-sans">
                This manuscript draft has no associated PDF file attached yet.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Reviewer Assessment & Decision (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl p-6 border border-[#E9E5C8] shadow-md">
          <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D]">
            Reviewer Assessment & Decision
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

          <AnimatePresence mode="wait">
            {decisionState ? (
              <motion.div
                key="decision"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  {decisionState === 'approved' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : decisionState === 'revision' ? (
                    <RotateCcw className="w-6 h-6 text-amber-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}

                  <span className="font-editorial-serif text-lg font-bold">
                    {decisionState === 'approved'
                      ? 'Manuscript Approved'
                      : decisionState === 'revision'
                      ? 'Revisions Requested'
                      : 'Submission Rejected'}
                  </span>
                </div>

                <p className="text-xs text-[#6B5E5E] leading-relaxed font-sans">
                  {decisionState === 'approved'
                    ? `"${book.title}" has been authorized for publication. Status updated in MongoDB to Published.`
                    : decisionState === 'revision'
                    ? `Revision notes logged for "${book.author}". Status updated to Needs Revision.`
                    : `Submission rejected. Status updated to Rejected.`}
                </p>

                <div className="pt-2 border-t border-[#E9E5C8]">
                  <button
                    type="button"
                    onClick={() => {
                      updateBookStatus(targetId, 'In Review');
                      setDecisionState(null);
                    }}
                    className="text-xs font-mono text-[#7B021D] hover:underline font-bold inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Decision State</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] block font-bold">
                    Editorial Notes / Reason
                  </label>
                  <textarea
                    rows={5}
                    value={editorialNotes}
                    onChange={(e) => setEditorialNotes(e.target.value)}
                    placeholder="Enter editorial evaluation notes, revision requirements, or rejection reason…"
                    className="w-full bg-[#FFFDF3] rounded-2xl border border-[#E9E5C8] p-4 text-xs text-[#211D1D] focus:border-[#7B021D] focus:outline-none transition-colors resize-none leading-relaxed font-mono shadow-inner"
                  />
                </div>

                <div className="space-y-2.5 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    className="w-full py-3 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md"
                  >
                    Approve & Publish
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequestRevision}
                    className="w-full py-3 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-xs font-mono font-bold uppercase tracking-wider text-[#211D1D] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors shadow-2xs"
                  >
                    Needs Revision
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReject}
                    className="w-full py-3 rounded-full bg-[#FFFDF3] border border-[#E9E5C8] text-xs font-mono font-bold uppercase tracking-wider text-[#6B5E5E] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                  >
                    Reject Submission
                  </motion.button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
