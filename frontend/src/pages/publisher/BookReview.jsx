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
  Eye
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
        <h3 className="font-editorial-serif text-2xl text-[#2B2B2B]">Manuscript Record Not Found</h3>
        <Link to="/publisher/queue" className="text-xs font-mono text-[#D3968C] hover:underline">
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
    <div className="space-y-10">
      {/* Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E7D9D3] pb-4 gap-2 sm:gap-0">
        <Link
          to="/publisher/queue"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] transition-colors min-h-[44px] sm:min-h-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Queue</span>
        </Link>

        <span className="text-xs font-mono text-[#D3968C] uppercase tracking-wider font-semibold">
          Manuscript Review Protocol #{String(targetId).slice(-6).toUpperCase()}
        </span>
      </div>

      {/* ── 3-Column Review Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Book Metadata (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 bg-[#FFFFFF] rounded-3xl p-6 border border-[#E7D9D3] shadow-sm">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EEEA] shadow-md border border-[#E7D9D3]">
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#E8C8C2]/30 text-[#2B2B2B] text-[10px] font-mono uppercase tracking-wider inline-block">
              {book.genre}
            </span>
            <h2 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
              {book.title}
            </h2>
            <p className="text-xs text-[#6E6A67]">By {book.author}</p>
            <p className="text-xs text-[#6E6A67] italic leading-relaxed pt-1 line-clamp-4">
              "{book.synopsis}"
            </p>
          </div>

          <div className="pt-4 border-t border-[#E7D9D3] space-y-2 text-xs font-mono text-[#6E6A67]">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-[#2B2B2B]">{book.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span>₹{book.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Language:</span>
              <span>{book.language}</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Integrated PDF Reader (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-[#FFFFFF] rounded-3xl p-6 border border-[#E7D9D3] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-3">
            <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#D3968C]" />
              Integrated PDF Reader
            </h3>
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#D3968C] uppercase tracking-wider font-semibold hover:underline"
              >
                Open Fullscreen
              </a>
            )}
          </div>

          {pdfUrl ? (
            <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-[#E7D9D3] bg-[#F4EEEA]">
              <iframe
                src={pdfUrl}
                title={`PDF Viewer - ${book.title}`}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="w-full h-[320px] rounded-2xl border border-dashed border-[#E7D9D3] bg-[#F4EEEA]/50 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <FileText className="w-10 h-10 text-[#D3968C]" />
              <p className="font-editorial-serif text-base font-semibold text-[#2B2B2B]">
                No PDF Manuscript Uploaded
              </p>
              <p className="text-xs text-[#6E6A67]">
                This manuscript draft has no associated PDF file attached yet.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Reviewer Assessment & Decision (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 bg-[#FFFFFF] rounded-3xl p-6 border border-[#E7D9D3] shadow-sm">
          <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B]">
            Reviewer Assessment & Decision
          </h3>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          <AnimatePresence mode="wait">
            {decisionState ? (
              <motion.div
                key="decision"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-[#E8C8C2]/20 border border-[#D3968C] text-[#2B2B2B] space-y-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#D3968C]" />
                  <span className="font-editorial-serif text-lg font-bold">
                    {decisionState === 'approved'
                      ? 'Manuscript Approved'
                      : decisionState === 'revision'
                      ? 'Revisions Requested'
                      : 'Submission Rejected'}
                  </span>
                </div>

                <p className="text-xs text-[#6E6A67] leading-relaxed">
                  {decisionState === 'approved'
                    ? `"${book.title}" has been authorized for publication. Status updated to Published.`
                    : decisionState === 'revision'
                    ? `Revision notes logged for "${book.author}". Status set to Needs Revision.`
                    : `Submission rejected. Status updated to Rejected.`}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateBookStatus(targetId, 'In Review');
                      setDecisionState(null);
                    }}
                    className="text-xs font-mono text-[#D3968C] hover:underline"
                  >
                    Reset Decision State
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#6E6A67] block">
                    Editorial Notes / Reason
                  </label>
                  <textarea
                    rows={5}
                    value={editorialNotes}
                    onChange={(e) => setEditorialNotes(e.target.value)}
                    placeholder="Enter editorial evaluation notes, revision requirements, or rejection reason…"
                    className="w-full bg-[#FAF8F6] rounded-xl border border-[#E7D9D3] p-4 text-xs text-[#2B2B2B] focus:border-[#D3968C] focus:outline-none transition-colors resize-none leading-relaxed font-mono"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="w-full py-3 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-sm"
                  >
                    Approve & Publish
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestRevision}
                    className="w-full py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] hover:border-[#2B2B2B] transition-colors"
                  >
                    Needs Revision
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    className="w-full py-3 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-rose-600 hover:border-rose-600 transition-colors"
                  >
                    Reject Submission
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
