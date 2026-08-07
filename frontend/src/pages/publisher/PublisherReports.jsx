import { useData } from '../../context/DataContext';

export default function PublisherReports() {
  const { books, authors, reviews } = useData();

  const totalSubmitted = books.length;
  const totalPublished = books.filter((b) => b.status === 'Published').length;
  const totalAuthors = authors.length;
  const totalReviews = reviews.length;

  const genreBreakdown = [
    { genre: 'Historical Fiction', count: 6, percentage: 38 },
    { genre: 'Philosophy & Essays', count: 4, percentage: 25 },
    { genre: 'Behavioral Science', count: 3, percentage: 19 },
    { genre: 'Mythological Fiction', count: 3, percentage: 18 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#E7D9D3] pb-4">
        <h2 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
          Platform Summary Reports
        </h2>
        <p className="text-xs text-[#6E6A67]">Minimal V1 catalog distribution and readership volume metrics</p>
      </div>

      {/* 4 Typographic Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#E7D9D3]">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Books Submitted
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            {totalSubmitted}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Books Published
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            {totalPublished}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Active Authors
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            {totalAuthors}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6E6A67]">
            Reader Reviews
          </span>
          <p className="font-editorial-serif text-3xl font-bold text-[#2B2B2B]">
            {totalReviews}
          </p>
        </div>
      </div>

      {/* Catalog Distribution Breakdown Chart */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E7D9D3] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
              Catalog Distribution by Genre
            </h3>
            <p className="text-xs text-[#6E6A67]">Percentage share of published and reviewed titles</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {genreBreakdown.map((item) => (
            <div key={item.genre} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#2B2B2B]">{item.genre}</span>
                <span className="text-[#6E6A67]">{item.count} Titles ({item.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F4EEEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D3968C] rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
