const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Author = require('../models/Author');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Category = require('../models/Category');
const { dropGridFSBuckets } = require('../config/gridfs');

const CATEGORIES_DATA = [
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

const AUTHORS_DATA = [
  {
    id: "kalki-krishnamurthy",
    name: "Kalki Krishnamurthy",
    role: "Historical Realism Icon",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Master storyteller of Tamil historical realism whose sagas redefined dynastic Indian literature.",
    fullBio: "Ramaswamy Krishnamurthy, known by his pen name Kalki, was one of the greatest Tamil writers of the 20th century. Born in 1899 in Puttamangalam, he devoted his life to literature, journalism, and Indian independence. His five-volume epic Ponniyin Selvan — serialized in his own magazine Kalki from 1950 to 1954 — is considered the greatest Tamil historical novel ever written, and remains beloved across generations.",
    joinDate: "Since 2018",
    joinedYear: 2018,
    followers: "142k",
    publications: 18,
    avgRating: "4.9 ★",
    handle: "@kalkistudio",
    stats: {
      totalReads: "142.8k",
      avgRating: "4.9 ★",
      wishlistAdds: "18.4k",
      totalReviews: "3.2k"
    }
  },
  {
    id: "morgan-housel",
    name: "Morgan Housel",
    role: "Behavioral Finance Writer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Partner at Collaborative Fund examining human irrationality, risk, and compound wealth.",
    fullBio: "Morgan Housel is a partner at the Collaborative Fund and a former columnist at The Motley Fool and The Wall Street Journal. His writing on behavioral finance, risk, and long-term wealth creation has reached millions worldwide.",
    joinDate: "Since 2021",
    joinedYear: 2021,
    followers: "98k",
    publications: 3,
    avgRating: "4.8 ★",
    handle: "@morganhousel",
    stats: {
      totalReads: "98.2k",
      avgRating: "4.8 ★",
      wishlistAdds: "12.1k",
      totalReviews: "1.8k"
    }
  },
  {
    id: "apj-kalam",
    name: "Dr. A.P.J. Abdul Kalam",
    role: "Visionary & Scientist",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Scientist, author, and 11th President of India dedicated to empowering youth through science.",
    fullBio: "Dr. Avul Pakir Jainulabdeen Abdul Kalam was an aerospace scientist who served as the 11th President of India from 2002 to 2007.",
    joinDate: "Since 2015",
    joinedYear: 2015,
    followers: "310k",
    publications: 12,
    avgRating: "4.8 ★",
    handle: "@apjkalam",
    stats: {
      totalReads: "210.5k",
      avgRating: "4.8 ★",
      wishlistAdds: "28.7k",
      totalReviews: "4.9k"
    }
  },
  {
    id: "cal-newport",
    name: "Cal Newport",
    role: "Georgetown Professor & Essayist",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Computer science professor writing on digital minimalism, deep focus, and career craftsmanship.",
    fullBio: "Cal Newport is a professor of computer science at Georgetown University and the author of six books.",
    joinDate: "Since 2019",
    joinedYear: 2019,
    followers: "86k",
    publications: 7,
    avgRating: "4.7 ★",
    handle: "@calnewport",
    stats: {
      totalReads: "62.4k",
      avgRating: "4.7 ★",
      wishlistAdds: "8.2k",
      totalReviews: "940"
    }
  },
  {
    id: "amish-tripathi",
    name: "Amish Tripathi",
    role: "Mythological Fiction Novelist",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Pioneer of modern Indian mythological pop-culture with over 6 million printed copies worldwide.",
    fullBio: "Amish Tripathi is an Indian author known for his mythological fiction series.",
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "115k",
    publications: 10,
    avgRating: "4.6 ★",
    handle: "@amishtripathi",
    stats: {
      totalReads: "88.9k",
      avgRating: "4.6 ★",
      wishlistAdds: "14.3k",
      totalReviews: "2.1k"
    }
  },
  {
    id: "james-clear",
    name: "James Clear",
    role: "Habits & Performance Writer",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Author and speaker focused on habits, decision-making, and continuous improvement in work and life.",
    fullBio: "James Clear is the author of Atomic Habits, the #1 New York Times bestseller.",
    joinDate: "Since 2020",
    joinedYear: 2020,
    followers: "204k",
    publications: 2,
    avgRating: "4.9 ★",
    handle: "@jamesclear",
    stats: {
      totalReads: "180.4k",
      avgRating: "4.9 ★",
      wishlistAdds: "24.8k",
      totalReviews: "5.6k"
    }
  },
  {
    id: "yuval-harari",
    name: "Yuval Noah Harari",
    role: "Historian & Public Intellectual",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    bio: "Israeli historian and professor at Hebrew University, known for sweeping macro-histories of humankind.",
    fullBio: "Yuval Noah Harari is an Israeli public intellectual, historian, and professor.",
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "178k",
    publications: 5,
    avgRating: "4.7 ★",
    handle: "@yuvalharari",
    stats: {
      totalReads: "142.1k",
      avgRating: "4.7 ★",
      wishlistAdds: "19.5k",
      totalReviews: "3.5k"
    }
  },
  {
    id: "arundhati-roy",
    name: "Arundhati Roy",
    role: "Novelist & Essayist",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    bio: "Booker Prize-winning author and activist whose prose blends lyrical beauty with political urgency.",
    fullBio: "Arundhati Roy is an Indian author and political activist.",
    joinDate: "Since 2019",
    joinedYear: 2019,
    followers: "92k",
    publications: 4,
    avgRating: "4.7 ★",
    handle: "@arundhatiroy",
    stats: {
      totalReads: "76.8k",
      avgRating: "4.7 ★",
      wishlistAdds: "11.2k",
      totalReviews: "1.4k"
    }
  }
];

// Note on Seed Cover URLs:
// Seeded books use direct Unsplash cover URLs for fast seeding. Real GridFS storage applies
// to NEW manuscript and cover file uploads created dynamically through the application.
const BOOKS_DATA = [
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
    synopsis: "No matter your goals, Atomic Habits offers a proven framework for improving every day through compounding 1% micro-habits.",
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
    synopsis: "The inspiring journey of India's Missile Man and 11th President, tracing his perseverance, technological breakthroughs, and vision for young minds.",
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
    synopsis: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a super skill in the 21st century economy.",
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
    synopsis: "What if Lord Shiva was a tribal warrior whose heroism turned him into a god? A thrilling reimagining of ancient Indian mythology.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "Mythic Saga",
    status: "Published",
    lastEdited: "Jun 15, 2025",
    submittedDate: "May 20, 2025",
    editorialNotes: "Approved for catalog publication."
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
    synopsis: "Yuval Noah Harari traces the arc of human history from the Stone Age to the Silicon Age, examining how Homo sapiens came to dominate the planet.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    badge: "Landmark Work",
    status: "Published",
    lastEdited: "Dec 14, 2025",
    submittedDate: "Dec 01, 2025",
    editorialNotes: "Approved for full catalog publication."
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
    synopsis: "Set in the lush landscape of Kerala, Roy's debut novel tells the story of fraternal twins Rahel and Estha, whose lives are shaped by the 'Love Laws'.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    badge: "Booker Prize",
    status: "Published",
    lastEdited: "Jan 02, 2026",
    submittedDate: "Dec 10, 2025",
    editorialNotes: "Approved. Booker Prize winner, flagship literary fiction."
  },
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

const REVIEWS_DATA = [
  { id: "r1", bookId: "ps-vol1", reviewer: "Priya Subramanian", rating: 5, date: "Jan 2026", text: "An absolute masterpiece of Tamil literature. Kalki's prose transports you to the Chola courts with such vividity that you can hear the waves crashing at Nagapattinam." },
  { id: "r2", bookId: "ps-vol1", reviewer: "Arvind Raghavan", rating: 5, date: "Nov 2025", text: "I read the original Tamil and this translation captures the grandeur beautifully. The political intrigue rivals Game of Thrones." },
  { id: "r4", bookId: "psychology-money", reviewer: "Rohan Mehta", rating: 5, date: "Mar 2026", text: "This book changed how I think about wealth entirely. Housel's storytelling approach makes complex behavioral concepts feel like bedtime stories." },
  { id: "r7", bookId: "atomic-habits", reviewer: "Ananya Sharma", rating: 5, date: "Apr 2026", text: "The habit stacking concept alone transformed my morning routine. Clear writes with scientific precision but a personal warmth." },
  { id: "r10", bookId: "wings-of-fire", reviewer: "Suresh Nair", rating: 5, date: "Feb 2026", text: "Dr. Kalam's humility shines through every page. From his childhood in Rameswaram to leading India's missile program, this is an autobiography that reads like a letter to every young Indian." }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookverse_studio';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Drop GridFS buckets & legacy collection indexes
    await dropGridFSBuckets();
    try {
      await mongoose.connection.collection('reviews').dropIndexes();
    } catch (e) {
      // ignore
    }

    // 1. Clear Existing Data
    await User.deleteMany({});
    await Author.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    await Category.deleteMany({});
    console.log('[Seed] Cleared existing collections & GridFS buckets.');

    // 2. Create Seed Users for each role with bcrypt passwords
    const readerUser = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@bookverse.in',
      password: 'password123',
      role: 'reader',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Avid collector of historical realism and modern Indian philosophy.',
      handle: '@ananyareads'
    });

    const authorUser = await User.create({
      name: 'Kalki Krishnamurthy',
      email: 'kalki@bookverse.in',
      password: 'password123',
      role: 'author',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Master storyteller of Tamil historical realism whose sagas redefined dynastic Indian literature.',
      handle: '@kalkistudio'
    });

    const publisherUser = await User.create({
      name: 'Editorial Control Desk',
      email: 'editor@bookverse.studio',
      password: 'password123',
      role: 'publisher',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      bio: 'Chief Editor & Catalog Registrar',
      handle: '@bookverse_editor'
    });

    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@bookverse.studio',
      password: 'password123',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      bio: 'BookVerse Studio System Administrator',
      handle: '@admin'
    });

    console.log('[Seed] Created seed users for all 4 roles.');

    // 3. Seed Categories
    await Category.insertMany(CATEGORIES_DATA);
    console.log('[Seed] Inserted Categories.');

    // 4. Seed Authors
    const authorMap = {}; // legacyId -> Author _id
    for (const aData of AUTHORS_DATA) {
      const authorDoc = await Author.create({
        ...aData,
        legacyId: aData.id,
        userId: aData.id === 'kalki-krishnamurthy' ? authorUser._id : null
      });
      authorMap[aData.id] = authorDoc._id;
    }
    console.log('[Seed] Inserted Authors.');

    // 5. Seed Books
    const bookMap = {}; // legacyId -> Book _id
    for (const bData of BOOKS_DATA) {
      const authorObjId = authorMap[bData.authorId] || authorMap['kalki-krishnamurthy'];
      const bookDoc = await Book.create({
        ...bData,
        legacyId: bData.id,
        authorId: authorObjId
      });
      bookMap[bData.id] = bookDoc._id;
    }
    console.log('[Seed] Inserted Books.');

    // Link books back to author models
    for (const aData of AUTHORS_DATA) {
      const authorObjId = authorMap[aData.id];
      if (authorObjId && aData.books && aData.books.length > 0) {
        const bookObjIds = aData.books.map((bId) => bookMap[bId]).filter(Boolean);
        await Author.findByIdAndUpdate(authorObjId, { books: bookObjIds });
      }
    }

    // 6. Seed Reviews
    for (const rData of REVIEWS_DATA) {
      const bookObjId = bookMap[rData.bookId];
      if (bookObjId) {
        await Review.create({
          bookId: bookObjId,
          reviewer: rData.reviewer,
          reviewerId: rData.reviewer === 'Ananya Sharma' ? readerUser._id : null,
          rating: rData.rating,
          date: rData.date,
          text: rData.text
        });
      }
    }
    console.log('[Seed] Inserted Reviews.');

    // 7. Seed Initial Wishlist & Library for Reader User
    const psVol1Id = bookMap['ps-vol1'];
    const psychId = bookMap['psychology-money'];

    if (psVol1Id && psychId) {
      readerUser.wishlistBookIds = [psychId];
      readerUser.library = [
        {
          bookId: psVol1Id,
          progress: 35,
          currentPage: 189,
          totalPages: 540,
          status: 'Currently Reading',
          lastRead: 'Yesterday'
        }
      ];
      await readerUser.save();
    }

    console.log('==========================================================');
    console.log('✅ BookVerse Studio Database Seeded Successfully!');
    console.log(`   Categories: ${CATEGORIES_DATA.length}`);
    console.log(`   Authors:    ${AUTHORS_DATA.length}`);
    console.log(`   Books:      ${BOOKS_DATA.length} (${BOOKS_DATA.filter(b=>b.status==='Published').length} Published, ${BOOKS_DATA.filter(b=>b.status==='In Review').length} In Review, ${BOOKS_DATA.filter(b=>b.status==='Draft').length} Draft)`);
    console.log(`   Reviews:    ${REVIEWS_DATA.length}`);
    console.log('──────────────────────────────────────────────────────────');
    console.log('Seed Credentials (password: password123):');
    console.log('  Reader:    ananya@bookverse.in');
    console.log('  Author:    kalki@bookverse.in');
    console.log('  Publisher: editor@bookverse.studio');
    console.log('  Admin:     admin@bookverse.studio');
    console.log('==========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
