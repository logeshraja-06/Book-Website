export const READER_PROFILE = {
  name: "Ananya Sharma",
  handle: "@ananyareads",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  bio: "Curator of personal digital libraries, lover of Tamil historical realism, behavioral science, and quiet afternoon reading.",
  stats: {
    booksRead: 34,
    pagesCompleted: "12,400",
    memberSince: "2023",
    currentStreak: "14 Days"
  },
  favoriteGenres: ["Historical Fiction", "Behavioral Economics", "Philosophy & Mindset", "Literary Epics"]
};

export const INITIAL_LIBRARY_BOOKS = [
  {
    id: "ps-vol1",
    title: "Ponniyin Selvan: The First Flood",
    author: "Kalki Krishnamurthy",
    genre: "Historical Fiction",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    progress: 82,
    currentPage: 442,
    totalPages: 540,
    status: "Currently Reading",
    lastRead: "Yesterday"
  },
  {
    id: "psychology-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Behavioral Economics",
    coverUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80",
    progress: 100,
    currentPage: 252,
    totalPages: 252,
    status: "Completed",
    lastRead: "2 weeks ago"
  },
  {
    id: "deep-work",
    title: "Deep Work: Rules for Focused Success",
    author: "Cal Newport",
    genre: "Productivity",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    progress: 45,
    currentPage: 136,
    totalPages: 304,
    status: "Currently Reading",
    lastRead: "3 days ago"
  },
  {
    id: "god-small-things",
    title: "The God of Small Things",
    author: "Arundhati Roy",
    genre: "Literary Fiction",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    progress: 100,
    currentPage: 340,
    totalPages: 340,
    status: "Completed",
    lastRead: "1 month ago"
  }
];

export const INITIAL_WISHLIST_BOOKS = [
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History & Anthropology",
    price: 599,
    rating: 4.7,
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    addedDate: "Saved Oct 2025"
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Improvement",
    price: 550,
    rating: 4.9,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    addedDate: "Saved Nov 2025"
  },
  {
    id: "immortals-meluha",
    title: "The Immortals of Meluha",
    author: "Amish Tripathi",
    genre: "Mythological Fiction",
    price: 385,
    rating: 4.6,
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    addedDate: "Saved Dec 2025"
  }
];

export const INITIAL_BOOKMARKS = [
  {
    id: "bm-1",
    bookTitle: "Ponniyin Selvan: The First Flood",
    bookId: "ps-vol1",
    pageRef: "PAGE 142 · CHAPTER IX",
    quote: "The waters of the Kaveri do not merely nurture crops; they carry the whispers of kings and the tears of forgotten queens.",
    note: "Resonates with Kalki's nautical description of the Chola fleet setting sail for Lanka.",
    dateSaved: "3 days ago"
  },
  {
    id: "bm-2",
    bookTitle: "The Psychology of Money",
    bookId: "psychology-money",
    pageRef: "PAGE 88 · CHAPTER 7",
    quote: "Highest form of wealth is the ability to wake up every morning and say, 'I can do whatever I want today.'",
    note: "Essential reminder on financial freedom vs material status.",
    dateSaved: "2 weeks ago"
  },
  {
    id: "bm-3",
    bookTitle: "Deep Work",
    bookId: "deep-work",
    pageRef: "PAGE 34 · PART 1",
    quote: "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction.",
    note: "Key principle for structured morning writing sessions.",
    dateSaved: "1 month ago"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    bookTitle: "The Psychology of Money",
    bookId: "psychology-money",
    author: "Morgan Housel",
    coverUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    dateWritten: "March 14, 2026",
    reviewText: "A profound shift in perspective. Housel succeeds because he treats money not as an engineering problem of numbers, but as a psychological study of human temperament, fear, and compounding behavior."
  },
  {
    id: "rev-2",
    bookTitle: "The God of Small Things",
    bookId: "god-small-things",
    author: "Arundhati Roy",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    dateWritten: "February 2, 2026",
    reviewText: "Roy's syntax is sheer poetry. The way she unravels Kerala's social fabric through the eyes of Estha and Rahel is unforgettable. A masterclass in sensory prose."
  }
];
