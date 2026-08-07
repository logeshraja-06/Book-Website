import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  User,
  ShieldCheck,
  ArrowUpRight,
  Archive,
  BookOpen,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';

export default function BookReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, getAuthorById, updateBookStatus } = useData();

  const book = getBookById(id);

  const [editorialNotes, setEditorialNotes] = useState(
    book?.editorialNotes ||
      'Manuscript formatting meets BookVerse Studio craft standards. Cover image ratio is verified ~2:3.'
  );

  const [decisionState, setDecisionState] = useState(null); // 'approved' | 'changes' | 'rejected'

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

  const handleApprove = () => {
    updateBookStatus(book.id, 'Published');
    setDecisionState('approved');
  };

  const handleRequestChanges = () => {
    updateBookStatus(book.id, 'In Review');
    setDecisionState('changes');
  };

  const handleReject = () => {
    updateBookStatus(book.id, 'Rejected');
    setDecisionState('rejected');
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
          Manuscript Review Protocol #{book.id.toUpperCase()}
        </span>
      </div>

      {/* ── Full-Width Asymmetric Review Spread ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left 6 Columns: Book Metadata & Cover Spread */}
        <div className="lg:col-span-6 space-y-8 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E7D9D3] shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* Cover Image */}
            <div className="sm:col-span-5 aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EEEA] shadow-md border border-[#E7D9D3]">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>

            {/* Details */}
            <div className="sm:col-span-7 space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#E8C8C2]/30 text-[#2B2B2B] text-xs font-mono uppercase tracking-wider inline-block">
                {book.genre}
              </span>
              <h2 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
                {book.title}
              </h2>
              <p className="text-xs text-[#6E6A67]">By {book.author}</p>
              <p className="text-xs text-[#6E6A67] italic leading-relaxed pt-1">
                "{book.synopsis}"
              </p>

              <div className="pt-4 border-t border-[#E7D9D3] flex items-center justify-between text-xs font-mono text-[#6E6A67]">
                <span>Price: ₹{book.price}</span>
                <span>ISBN: {book.isbn}</span>
              </div>
            </div>

          </div>

          {/* Full Metadata Grid */}
          <div className="pt-6 border-t border-[#E7D9D3] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono text-[#6E6A67]">
            <div>
              <span className="text-[10px] uppercase text-[#6E6A67] block">Pages</span>
              <span className="text-[#2B2B2B] font-semibold">{book.pages || 350}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6E6A67] block">Language</span>
              <span className="text-[#2B2B2B] font-semibold">{book.language}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6E6A67] block">Publish Year</span>
              <span className="text-[#2B2B2B] font-semibold">{book.publishYear}</span>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: File-Chips + Author Info + Reviewer Assessment */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Uploaded Manuscript Files Section (FILE CHIPS ONLY) */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E7D9D3] shadow-sm space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D3968C] font-semibold block">
              Uploaded Manuscript Files (Stored Securely)
            </span>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-[#2B2B2B]">
                  <FileText className="w-5 h-5 text-[#D3968C]" />
                  <div>
                    <span className="font-semibold block">
                      {book.manuscriptFileName || `${book.title.replace(/\s+/g, '_')}_Manuscript.pdf`}
                    </span>
                    <span className="text-[10px] text-[#6E6A67]">
                      {book.manuscriptFileType || 'PDF Document'} · {book.manuscriptFileSize || 'Unknown size'}
                    </span>
                  </div>
                </div>

                {book.manuscriptUrl ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const fileId = book.manuscriptFileId || book.id || book._id;
                        const res = await apiFetch(`/files/manuscript/${fileId}/token`);
                        const downloadUrl = res.data?.downloadUrl
                          ? `http://localhost:5001${res.data.downloadUrl}`
                          : (book.manuscriptUrl.startsWith('http') ? book.manuscriptUrl : `http://localhost:5001${book.manuscriptUrl}`);
                        window.open(downloadUrl, '_blank');
                      } catch (err) {
                        const directUrl = book.manuscriptUrl.startsWith('http')
                          ? book.manuscriptUrl
                          : `http://localhost:5001${book.manuscriptUrl}`;
                        window.open(directUrl, '_blank');
                      }
                    }}
                    className="text-[10px] font-mono text-[#D3968C] uppercase tracking-wider font-semibold hover:underline"
                  >
                    Open & Review
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-[#6E6A67] uppercase tracking-wider">
                    No File Attached
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4EEEA]/50 border border-[#E7D9D3] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-[#2B2B2B]">
                  <Archive className="w-4 h-4 text-[#6E6A67]" />
                  <div>
                    <span className="font-medium block">Supplementary_Materials.zip</span>
                    <span className="text-[10px] text-[#6E6A67]">Archive ZIP · 12.4 MB</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#6E6A67]">Optional</span>
              </div>
            </div>
          </div>

          {/* Author Information */}
          {author && (
            <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E7D9D3] shadow-sm space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6E6A67] block">
                Author Credentials
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E7D9D3]"
                />
                <div className="flex-1">
                  <h4 className="font-editorial-serif text-lg font-bold text-[#2B2B2B]">
                    {author.name}
                  </h4>
                  <p className="text-xs text-[#6E6A67] italic line-clamp-1">"{author.bio}"</p>
                </div>
                <Link
                  to={`/authors/${author.id}`}
                  className="text-xs font-mono text-[#2B2B2B] hover:text-[#D3968C] inline-flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Assessment Notes & Decision Control Panel */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E7D9D3] shadow-sm space-y-6">
            <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
              Reviewer Assessment & Decision
            </h3>

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
                        : decisionState === 'changes'
                        ? 'Revisions Requested'
                        : 'Submission Rejected'}
                    </span>
                  </div>

                  <p className="text-xs text-[#6E6A67] leading-relaxed">
                    {decisionState === 'approved'
                      ? `"${book.title}" has been authorized for publication in the BookVerse Studio catalog. Status updated to Published.`
                      : decisionState === 'changes'
                      ? `Editorial feedback logged for "${book.author}". Status set to In Review.`
                      : `Submission rejected. Status updated to Rejected across all modules.`}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateBookStatus(book.id, 'In Review');
                        setDecisionState(null);
                      }}
                      className="text-xs font-mono text-[#D3968C] hover:underline"
                    >
                      Reset Assessment State
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Notes Textarea (Kept as Editorial Notes as instructed) */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-widest text-[#6E6A67] block">
                      Editorial Notes
                    </label>
                    <textarea
                      rows={4}
                      value={editorialNotes}
                      onChange={(e) => setEditorialNotes(e.target.value)}
                      className="w-full bg-[#FAF8F6] rounded-xl border border-[#E7D9D3] p-4 text-sm text-[#2B2B2B] focus:border-[#D3968C] focus:outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Three Calmly Styled Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {/* Neutral Outline: Reject (NOT RED) */}
                    <button
                      type="button"
                      onClick={handleReject}
                      className="w-full sm:flex-1 py-3.5 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#6E6A67] hover:text-[#2B2B2B] hover:border-[#2B2B2B] transition-colors min-h-[44px]"
                    >
                      Reject
                    </button>

                    {/* Neutral Outline: Request Changes */}
                    <button
                      type="button"
                      onClick={handleRequestChanges}
                      className="w-full sm:flex-1 py-3.5 rounded-full border border-[#E7D9D3] text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] hover:border-[#2B2B2B] transition-colors min-h-[44px]"
                    >
                      Request Changes
                    </button>

                    {/* Primary Accent: Approve */}
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="w-full sm:flex-1 py-3.5 rounded-full bg-[#2B2B2B] text-[#FAF8F6] text-xs font-semibold uppercase tracking-wider hover:bg-[#D3968C] transition-colors shadow-sm min-h-[44px]"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
