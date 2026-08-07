/**
 * BookVerse Studio — Genre Categories
 * Used across: Categories page, filter selects (BooksListing), Admin Categories
 */
export const CATEGORIES = [
  {
    id: "literary-epics",
    name: "Literary & Historical Epics",
    count: 342,
    desc: "Sweeping dynastic chronicles, ancient mythologies, and timeless classic literature.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "philosophy-mindset",
    name: "Philosophy & Mindset",
    count: 189,
    desc: "Ancient wisdom, Stoic principles, and practical existential thought.",
    coverUrl: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "business-economics",
    name: "Business & Behavioral Economics",
    count: 254,
    desc: "Wealth psychology, strategy, venture craft, and organizational design.",
    coverUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "biographies-memoirs",
    name: "Biographies & Memoirs",
    count: 120,
    desc: "Intimate life stories of visionaries, statesmen, and cultural pioneers.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "science-deeptech",
    name: "Science & Deep Technology",
    count: 96,
    desc: "Aeronautics, quantum computing, artificial general intelligence, and physics.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "poetry-verse",
    name: "Poetry & Modern Verse",
    count: 78,
    desc: "Rhythmic expression, lyricism, and contemporary spoken word anthologies.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1200&q=80"
  }
];

/** Plain genre name list for filter dropdowns */
export const GENRE_NAMES = CATEGORIES.map(c => c.name);
