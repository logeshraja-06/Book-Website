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
  favoriteGenres: ["Historical Fiction", "Finance", "Fiction", "Literary Fiction"]
};

export const INITIAL_LIBRARY_BOOKS = [
  {
    id: "ps-vol1",
    title: "Ponniyin Selvan",
    subtitle: "The Masterpiece of Chola Dynastic Intrigue",
    author: "Kalki Krishnamurthy",
    genre: "Historical Fiction",
    language: "Tamil",
    price: 1250,
    coverUrl: "/assets/books/ponniyin-selvan.webp",
    coverImage: "/assets/books/ponniyin-selvan.webp",
    progress: 35,
    currentPage: 189,
    totalPages: 540,
    status: "Currently Reading",
    lastRead: "Yesterday"
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    subtitle: "Timeless Lessons on Wealth, Greed, and Happiness",
    author: "Morgan Housel",
    genre: "Finance",
    language: "English",
    price: 499,
    coverUrl: "/assets/books/psychology-of-money.webp",
    coverImage: "/assets/books/psychology-of-money.webp",
    progress: 100,
    currentPage: 252,
    totalPages: 252,
    status: "Completed",
    lastRead: "2 weeks ago"
  },
  {
    id: "malgudi-days",
    title: "Malgudi Days",
    subtitle: "Tales of the Enchanted South Indian Town",
    author: "R.K. Narayan",
    genre: "Fiction",
    language: "English",
    price: 399,
    coverUrl: "/assets/books/malgudi-days.webp",
    coverImage: "/assets/books/malgudi-days.webp",
    progress: 55,
    currentPage: 143,
    totalPages: 260,
    status: "Currently Reading",
    lastRead: "3 days ago"
  },
  {
    id: "god-of-small-things",
    title: "The God of Small Things",
    subtitle: "A Novel of Caste, Family, and Memory in Kerala",
    author: "Arundhati Roy",
    genre: "Literary Fiction",
    language: "English",
    price: 499,
    coverUrl: "/assets/books/malgudi-days.webp",
    coverImage: "/assets/books/malgudi-days.webp",
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
    title: "Sapiens",
    subtitle: "A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    price: 599,
    rating: 4.7,
    coverUrl: "/assets/books/psychology-of-money.webp",
    coverImage: "/assets/books/psychology-of-money.webp",
    addedDate: "Saved Oct 2025"
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    subtitle: "Tiny Changes, Remarkable Results",
    author: "James Clear",
    genre: "Self-Help",
    price: 550,
    rating: 4.9,
    coverUrl: "/assets/books/atomic-habits.webp",
    coverImage: "/assets/books/atomic-habits.webp",
    addedDate: "Saved Nov 2025"
  },
  {
    id: "immortals-meluha",
    title: "The Immortals of Meluha",
    subtitle: "Shiva Trilogy — Book 1",
    author: "Amish Tripathi",
    genre: "Mythology / Fiction",
    price: 395,
    rating: 4.7,
    coverUrl: "/assets/books/rich-dad-poor-dad.webp",
    coverImage: "/assets/books/rich-dad-poor-dad.webp",
    addedDate: "Saved Dec 2025"
  }
];

export const INITIAL_BOOKMARKS = [
  {
    id: "bm-1",
    bookTitle: "Ponniyin Selvan",
    bookId: "ps-vol1",
    pageRef: "PAGE 142 · CHAPTER IX",
    quote: "The waters of the Kaveri do not merely nurture crops; they carry the whispers of kings and the tears of forgotten queens.",
    note: "Resonates with Kalki's nautical description of the Chola fleet setting sail for Lanka.",
    dateSaved: "3 days ago"
  },
  {
    id: "bm-2",
    bookTitle: "The Psychology of Money",
    bookId: "psychology-of-money",
    pageRef: "PAGE 88 · CHAPTER 7",
    quote: "Highest form of wealth is the ability to wake up every morning and say, 'I can do whatever I want today.'",
    note: "Essential reminder on financial freedom vs material status.",
    dateSaved: "2 weeks ago"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    bookTitle: "The Psychology of Money",
    bookId: "psychology-of-money",
    author: "Morgan Housel",
    coverUrl: "/assets/books/psychology-of-money.webp",
    rating: 5,
    dateWritten: "March 14, 2026",
    reviewText: "A profound shift in perspective. Housel succeeds because he treats money not as an engineering problem of numbers, but as a psychological study of human temperament, fear, and compounding behavior."
  },
  {
    id: "rev-2",
    bookTitle: "The God of Small Things",
    bookId: "god-of-small-things",
    author: "Arundhati Roy",
    coverUrl: "/assets/books/malgudi-days.webp",
    rating: 5,
    dateWritten: "February 2, 2026",
    reviewText: "Roy's syntax is sheer poetry. The way she unravels Kerala's social fabric through the eyes of Estha and Rahel is unforgettable. A masterclass in sensory prose."
  }
];
