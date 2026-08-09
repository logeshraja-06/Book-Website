import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../context/AuthContext';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';

export default function ReaderStandaloneView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true);
        setError('');
        const res = await apiFetch(`/books/${id}`);
        if (res.success && res.data) {
          setBook(res.data);
        } else {
          setError('Book not found or not published yet.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load book for reading.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadBook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DA] flex items-center justify-center p-6 text-xs font-mono">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#7B021D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#5F594F]">Opening sanctuary reader...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#F5F5DA] flex items-center justify-center p-6">
        <div className="bg-[#FFFDF3] border border-[#D8CFAE] p-8 rounded-3xl text-center space-y-4 max-w-md">
          <h2 className="font-editorial-serif text-2xl font-bold text-[#181616]">Manuscript Unavailable</h2>
          <p className="text-xs text-[#5F594F] font-sans">{error || 'Only published books can be accessed in the reader.'}</p>
          <button
            onClick={() => navigate('/my-shelf')}
            className="px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider"
          >
            Return to My Shelf
          </button>
        </div>
      </div>
    );
  }

  return (
    <DigitalReaderModal
      isOpen={true}
      onClose={() => navigate('/my-shelf')}
      book={book}
      initialPage={1}
    />
  );
}
