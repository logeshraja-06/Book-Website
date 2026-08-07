/**
 * BookVerse Studio — Central Book Catalog
 *
 * Schema:
 *   id          string  — stable, used as route param (/books/:id)
 *   title       string
 *   author      string  — display name
 *   authorId    string  — references AUTHORS[].id in authors.js
 *   coverUrl    string
 *   genre       string
 *   language    string
 *   price       number  — in INR (₹)
 *   isbn        string
 *   rating      number
 *   reviewsCount string
 *   publishYear number
 *   pages       number
 *   synopsis    string
 *   tagline     string
 *   badge       string  — editorial label (Editor's Choice, Bestseller, …)
 *   editorPick  boolean
 *   publisher   string  — e.g. "BookVerse Studio Press"
 *   sampleFile  string  — e.g. "ponniyin-selvan-sample.pdf" (stored in src/assets/pdfs/)
 *   status      string  — 'Published' | 'In Review' | 'Draft' | 'Rejected'
 *   submittedDate string — date string, used by Publisher Workspace
 *   editorialNotes string — publisher reviewer notes
 *   manuscriptFileName string — e.g. "Ponniyin_Selvan_Vol1_Manuscript.pdf"
 *   manuscriptFileType string — e.g. "PDF Document"
 *   manuscriptFileSize string — e.g. "4.8 MB"
 *   lastEdited  string  — relative date string, used by Author Portal
 *   draftProgress string — e.g. "45% Completed", only present on Drafts
 *   subtitle    string  — optional subtitle
 */

export const BOOKS = [
  // ─── FEATURED / PUBLISHED ──────────────────────────────────────────────────
  {
    id: "ps-vol1",
    title: "Ponniyin Selvan: The First Flood",
    subtitle: "Book I of the Chola Empire Saga",
    author: "Kalki Krishnamurthy",
    authorId: "kalki-krishnamurthy",
    genre: "Historical Fiction",
    language: "Tamil / English",
    price: 1299,
    isbn: "978-9388300253",
    rating: 4.9,
    reviewsCount: "15.2k",
    publishYear: 1954,
    pages: 540,
    editorPick: true,
    tagline: "The Masterpiece of Chola Dynastic Intrigue",
    synopsis: "Step into the 10th-century Chola Empire. A majestic saga of royal conspiracies, nautical journeys across Sri Lanka, and unrequited love that defined Tamil literature.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    badge: "Editor's Choice 2026",
    sampleFile: "ponniyin-selvan-sample.pdf",
    status: "Published",
    lastEdited: "Aug 14, 2025",
    submittedDate: "Aug 01, 2025",
    editorialNotes: "Sensational historical accuracy. Nautical research on 10th-century Indian Ocean vessels is pristine."
  },
  {
    id: "psychology-money",
    title: "The Psychology of Money",
    subtitle: "Timeless Lessons on Wealth, Greed, and Happiness",
    author: "Morgan Housel",
    authorId: "morgan-housel",
    genre: "Behavioral Economics",
    language: "English",
    price: 499,
    isbn: "978-0857197689",
    rating: 4.8,
    reviewsCount: "28.4k",
    publishYear: 2020,
    pages: 252,
    editorPick: false,
    tagline: "Timeless Lessons on Wealth & Behavior",
    synopsis: "Doing well with money has little to do with how smart you are and a lot to do with how you behave. Housel shares 19 short stories exploring the weird ways people think about money.",
    coverUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    status: "Published",
    lastEdited: "Sep 05, 2025",
    submittedDate: "Aug 15, 2025",
    editorialNotes: "Approved for full catalog publication."
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    subtitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    author: "James Clear",
    authorId: "james-clear",
    genre: "Self-Improvement",
    language: "English",
    price: 550,
    isbn: "978-0735211292",
    rating: 4.9,
    reviewsCount: "42.1k",
    publishYear: 2018,
    pages: 320,
    editorPick: false,
    tagline: "Tiny Changes, Remarkable Results",
    synopsis: "No matter your goals, Atomic Habits offers a proven framework for improving every day through compounding 1% micro-habits. Clear distills the science of small behavioral changes into an actionable system built on identity-based habits, environment design, and the compounding power of getting just 1% better each day.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    badge: "Essential Read",
    status: "Published",
    lastEdited: "Oct 10, 2025",
    submittedDate: "Sep 20, 2025",
    editorialNotes: "Approved for catalog publication."
  },
  {
    id: "wings-of-fire",
    title: "Wings of Fire: An Autobiography",
    subtitle: "From Rameswaram to the Missile Program",
    author: "Dr. A.P.J. Abdul Kalam",
    authorId: "apj-kalam",
    genre: "Memoir & Science",
    language: "English",
    price: 399,
    isbn: "978-8173711466",
    rating: 4.8,
    reviewsCount: "18.9k",
    publishYear: 1999,
    pages: 180,
    editorPick: true,
    tagline: "From Rameswaram to the Missile Program",
    synopsis: "The inspiring journey of India's Missile Man and 11th President, tracing his perseverance, technological breakthroughs, and vision for young minds. From his childhood in Rameswaram to leading India's space and missile programs, Kalam recounts a life shaped by curiosity, mentorship, and an unwavering belief in the potential of India's youth.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    badge: "National Heritage",
    status: "Published",
    lastEdited: "Nov 01, 2025",
    submittedDate: "Oct 05, 2025",
    editorialNotes: "Approved. Landmark national memoir."
  },
  {
    id: "deep-work",
    title: "Deep Work: Rules for Focused Success",
    subtitle: "Rules for Focused Success in a Distracted World",
    author: "Cal Newport",
    authorId: "cal-newport",
    genre: "Productivity",
    language: "English",
    price: 450,
    isbn: "978-1455586691",
    rating: 4.7,
    reviewsCount: "9.8k",
    publishYear: 2016,
    pages: 304,
    editorPick: false,
    tagline: "Focused Concentration in a Distracted World",
    synopsis: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a super skill in the 21st century economy. Newport argues that the ability to concentrate intensely is both increasingly rare and increasingly valuable, and provides four discipline-based rules for transforming your work habits.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    badge: "Modern Classic",
    status: "Published",
    lastEdited: "May 10, 2024",
    submittedDate: "Apr 01, 2024",
    editorialNotes: "Approved. Strong readership trajectory."
  },
  {
    id: "immortals-meluha",
    title: "The Immortals of Meluha",
    subtitle: "1900 BC. The Legend of the Neelkanth Begins.",
    author: "Amish Tripathi",
    authorId: "amish-tripathi",
    genre: "Mythological Fiction",
    language: "English",
    price: 385,
    isbn: "978-9380658742",
    rating: 4.6,
    reviewsCount: "21.3k",
    publishYear: 2010,
    pages: 390,
    editorPick: false,
    tagline: "1900 BC. The Legend of the Neelkanth Begins.",
    synopsis: "What if Lord Shiva was a tribal warrior whose heroism turned him into a god? A thrilling reimagining of ancient Indian mythology. Set in 1900 BC, a Tibetan immigrant named Shiva arrives in the land of Meluha and is drawn into an epic conflict between the Suryavanshis and the Chandravanshis.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "Mythic Saga",
    status: "Published",
    lastEdited: "Jun 15, 2025",
    submittedDate: "May 20, 2025",
    editorialNotes: "Approved for catalog publication."
  },
  {
    id: "ikigai",
    title: "Ikigai: The Japanese Secret to a Long and Happy Life",
    subtitle: "Finding Your Reason for Being",
    author: "Héctor García & Francesc Miralles",
    authorId: "hector-garcia",
    genre: "Philosophy & Mindset",
    language: "English",
    price: 350,
    isbn: "978-0143130727",
    rating: 4.5,
    reviewsCount: "31.7k",
    publishYear: 2016,
    pages: 208,
    editorPick: false,
    tagline: "Finding Your Reason for Being",
    synopsis: "Bringing together the wisdom of Japanese centenarians, this book reveals the secrets to longevity and fulfillment. Through interviews with residents of Okinawa—the world's longest-living community—the authors uncover practices of purpose, flow, friendship, and diet that sustain a meaningful life.",
    coverUrl: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=800&q=80",
    badge: "Wisdom",
    status: "Published",
    lastEdited: "Jul 20, 2025",
    submittedDate: "Jun 30, 2025",
    editorialNotes: "Approved. Perennial bestseller category."
  },
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    subtitle: "From the Cognitive Revolution to AI",
    author: "Yuval Noah Harari",
    authorId: "yuval-harari",
    genre: "History & Anthropology",
    language: "English",
    price: 599,
    isbn: "978-0062316097",
    rating: 4.7,
    reviewsCount: "35.2k",
    publishYear: 2011,
    pages: 498,
    editorPick: true,
    tagline: "From the Cognitive Revolution to AI",
    synopsis: "Yuval Noah Harari traces the arc of human history from the Stone Age to the Silicon Age, examining how Homo sapiens came to dominate the planet through cognitive, agricultural, and scientific revolutions—and what our species might become next.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    badge: "Landmark Work",
    status: "Published",
    lastEdited: "Dec 14, 2025",
    submittedDate: "Dec 01, 2025",
    editorialNotes: "Approved for full catalog publication."
  },
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    subtitle: "Two Systems That Drive the Way We Think",
    author: "Daniel Kahneman",
    authorId: "daniel-kahneman",
    genre: "Behavioral Economics",
    language: "English",
    price: 525,
    isbn: "978-0374533557",
    rating: 4.6,
    reviewsCount: "22.8k",
    publishYear: 2011,
    pages: 499,
    editorPick: false,
    tagline: "Two Systems That Drive the Way We Think",
    synopsis: "Nobel laureate Daniel Kahneman takes the reader on a groundbreaking tour of the mind, explaining the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.",
    coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    badge: "Nobel Prize",
    status: "Published",
    lastEdited: "Mar 05, 2025",
    submittedDate: "Feb 10, 2025",
    editorialNotes: "Approved. Nobel-tier reference material."
  },
  {
    id: "white-tiger",
    title: "The White Tiger",
    subtitle: "A Darkly Humorous Portrait of Modern India",
    author: "Aravind Adiga",
    authorId: "aravind-adiga",
    genre: "Literary Fiction",
    language: "English",
    price: 425,
    isbn: "978-1416562603",
    rating: 4.4,
    reviewsCount: "12.1k",
    publishYear: 2008,
    pages: 321,
    editorPick: false,
    tagline: "A Darkly Humorous Portrait of Modern India",
    synopsis: "Told through a series of letters to the Chinese Premier, Balram Halwai narrates his journey from a village tea shop to becoming a successful entrepreneur in Bangalore, exposing India's class struggle with dark wit and unflinching honesty.",
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80",
    badge: "Booker Prize",
    status: "Published",
    lastEdited: "Nov 28, 2025",
    submittedDate: "Nov 01, 2025",
    editorialNotes: "Approved for catalog publication."
  },
  {
    id: "train-to-pakistan",
    title: "Train to Pakistan",
    subtitle: "Partition Through a Village's Eyes",
    author: "Khushwant Singh",
    authorId: "khushwant-singh",
    genre: "Historical Fiction",
    language: "English",
    price: 299,
    isbn: "978-0143065883",
    rating: 4.5,
    reviewsCount: "8.4k",
    publishYear: 1956,
    pages: 181,
    editorPick: false,
    tagline: "Partition Through a Village's Eyes",
    synopsis: "Set in the fictional border village of Mano Majra during the partition of India in 1947, this searing novel examines the communal violence and moral complexities faced by ordinary people caught in extraordinary historical upheaval.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80",
    badge: "Partition Classic",
    status: "Published",
    lastEdited: "Apr 14, 2025",
    submittedDate: "Mar 20, 2025",
    editorialNotes: "Approved. Historical canon."
  },
  {
    id: "god-small-things",
    title: "The God of Small Things",
    subtitle: "Love, Loss, and the Laws That Break",
    author: "Arundhati Roy",
    authorId: "arundhati-roy",
    genre: "Literary Fiction",
    language: "English",
    price: 475,
    isbn: "978-0812979657",
    rating: 4.7,
    reviewsCount: "14.6k",
    publishYear: 1997,
    pages: 340,
    editorPick: true,
    tagline: "Love, Loss, and the Laws That Break",
    synopsis: "Set in the lush landscape of Kerala, Roy's debut novel tells the story of fraternal twins Rahel and Estha, whose lives are shaped by the 'Love Laws' that dictate who should be loved and how much. A lyrical meditation on caste, forbidden love, and political turmoil in postcolonial India.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    badge: "Booker Prize",
    status: "Published",
    lastEdited: "Jan 02, 2026",
    submittedDate: "Dec 10, 2025",
    editorialNotes: "Approved. Booker Prize winner, flagship literary fiction."
  },

  // ─── IN REVIEW (submitted to Editorial Workspace) ─────────────────────────
  {
    id: "ps-vol2",
    title: "Ponniyin Selvan: The Cyclone",
    subtitle: "Book II of the Chola Empire Saga",
    author: "Kalki Krishnamurthy",
    authorId: "kalki-krishnamurthy",
    genre: "Historical Fiction",
    language: "Tamil / English",
    price: 1199,
    isbn: "978-9388300260",
    rating: 4.8,
    reviewsCount: "0",
    publishYear: 1955,
    pages: 480,
    editorPick: false,
    tagline: "The Cyclone Gathers Over Thanjavur",
    synopsis: "Arulmozhivarman faces tempestuous seas off the coast of Eelam as political storm clouds gather over Thanjavur.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "",
    status: "In Review",
    lastEdited: "Jan 22, 2026",
    submittedDate: "Jan 22, 2026",
    editorialNotes: "Sensational historical accuracy. Nautical research on 10th-century Indian Ocean vessels is pristine."
  },

  // ─── DRAFT (in progress in Writing Studio) ────────────────────────────────
  {
    id: "sivagami-sabatham",
    title: "Sivagamiyin Sabatham",
    subtitle: "The Vow of Sivagami — Chalukya Pallava Conflict",
    author: "Kalki Krishnamurthy",
    authorId: "kalki-krishnamurthy",
    genre: "Historical Romance",
    language: "Tamil / English",
    price: 999,
    isbn: "978-9388300291",
    rating: 0,
    reviewsCount: "0",
    publishYear: 2026,
    pages: 360,
    editorPick: false,
    tagline: "7th-century Kanchi. Duty, love, and sacrifice.",
    synopsis: "7th-century Kanchi. The tragic romance between Prince Narasimhavarman and the divine dancer Sivagami amidst war.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    badge: "",
    status: "Draft",
    lastEdited: "2 days ago",
    submittedDate: "—",
    editorialNotes: "Promising prose. Proofreading required for Chapter IV translation.",
    draftProgress: "45% Completed"
  },
  {
    id: "parthiban-kanavu",
    title: "Parthiban Kanavu",
    subtitle: "The Dream of Parthiban",
    author: "Kalki Krishnamurthy",
    authorId: "kalki-krishnamurthy",
    genre: "Historical Fiction",
    language: "English",
    price: 750,
    isbn: "978-8173711422",
    rating: 4.7,
    reviewsCount: "6.1k",
    publishYear: 1943,
    pages: 290,
    editorPick: false,
    tagline: "The Chola King's Dream Lives On",
    synopsis: "The Chola king Parthiban sacrifices his life fighting the Pallavas, passing his dream of Chola independence to his son Vikraman.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    badge: "Classic",
    status: "Published",
    lastEdited: "May 10, 2024",
    submittedDate: "Apr 15, 2024",
    editorialNotes: "Approved. Classic Tamil historical fiction."
  }
];

// ─── DERIVED HELPERS (no duplication needed elsewhere) ───────────────────────

/** Featured books shown on Home page spotlight strip (first 6 with status=Published) */
export const FEATURED_BOOKS = BOOKS.filter(b => b.editorPick || BOOKS.indexOf(b) < 6);

/** All genres extracted from catalog */
export const ALL_GENRES = [...new Set(BOOKS.map(b => b.genre))];

/** All languages extracted from catalog */
export const ALL_LANGUAGES = [...new Set(BOOKS.map(b => b.language))];

/** Find a book by its stable id */
export function getBookById(id) {
  return BOOKS.find(b => b.id === id) || null;
}

/** Books belonging to a specific author */
export function getBooksByAuthorId(authorId) {
  return BOOKS.filter(b => b.authorId === authorId);
}
