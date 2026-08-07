/**
 * BookVerse Studio — Central Author Directory
 *
 * Schema:
 *   id           string  — stable, used as route param (/authors/:id)
 *   name         string
 *   role         string  — one-line specialty
 *   avatarUrl    string
 *   bio          string  — short bio (used in cards and strips)
 *   fullBio      string  — extended bio (used on Author Profile page)
 *   books        string[] — array of book IDs from books.js
 *   joinDate     string  — "2018" / "Since 2018"
 *   joinedYear   number
 *   followers    string  — formatted count, e.g. "142k"
 *   publications number  — total book count
 *   avgRating    string  — e.g. "4.9 ★"
 *   handle       string  — e.g. "@kalkistudio"
 *   stats        object  — { totalReads, avgRating, wishlistAdds, totalReviews }
 */
export const AUTHORS = [
  {
    id: "kalki-krishnamurthy",
    name: "Kalki Krishnamurthy",
    role: "Historical Realism Icon",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Master storyteller of Tamil historical realism whose sagas redefined dynastic Indian literature.",
    fullBio: "Ramaswamy Krishnamurthy, known by his pen name Kalki, was one of the greatest Tamil writers of the 20th century. Born in 1899 in Puttamangalam, he devoted his life to literature, journalism, and Indian independence. His five-volume epic Ponniyin Selvan — serialized in his own magazine Kalki from 1950 to 1954 — is considered the greatest Tamil historical novel ever written, and remains beloved across generations.",
    books: ["ps-vol1", "ps-vol2", "sivagami-sabatham", "parthiban-kanavu"],
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
    fullBio: "Morgan Housel is a partner at the Collaborative Fund and a former columnist at The Motley Fool and The Wall Street Journal. His writing on behavioral finance, risk, and long-term wealth creation has reached millions worldwide. The Psychology of Money sold over 4 million copies and has been translated into 53 languages.",
    books: ["psychology-money"],
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
    fullBio: "Dr. Avul Pakir Jainulabdeen Abdul Kalam was an aerospace scientist who served as the 11th President of India from 2002 to 2007. Known as the 'Missile Man of India,' he played a crucial role in developing India's ballistic missile and nuclear weapons programs. His autobiography Wings of Fire has inspired generations of Indian students and remains one of the most widely read books in India.",
    books: ["wings-of-fire"],
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
    fullBio: "Cal Newport is a professor of computer science at Georgetown University and the author of six books on the intersection of technology, productivity, and the philosophy of work. His most influential work, Deep Work, argues that the ability to focus without distraction is one of the most valuable skills in the modern economy — and one of the rarest.",
    books: ["deep-work"],
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
    fullBio: "Amish Tripathi is an Indian author known for his mythological fiction series. His debut novel, The Immortals of Meluha, was a self-published success that transformed into one of India's best-selling book series. Amish has sold more than 6 million copies and is credited with creating the market for Indian mythology-based commercial fiction.",
    books: ["immortals-meluha"],
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
    fullBio: "James Clear is the author of Atomic Habits, the #1 New York Times bestseller. His work focuses on habits, decision-making, and continuous improvement, drawing from fields like biology, neuroscience, philosophy, and psychology. His newsletter has more than 2 million subscribers worldwide.",
    books: ["atomic-habits"],
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
    fullBio: "Yuval Noah Harari is an Israeli public intellectual, historian, and professor in the department of history at the Hebrew University of Jerusalem. He is the author of Sapiens, Homo Deus, and 21 Lessons for the 21st Century — books that have collectively sold over 27 million copies in more than 50 languages.",
    books: ["sapiens"],
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
    fullBio: "Arundhati Roy is an Indian author and political activist. Her debut novel, The God of Small Things, won the Booker Prize in 1997 and became a modern classic of postcolonial literature. Roy is equally known for her political essays and her activism on issues of corporate globalization, environmental justice, and indigenous rights.",
    books: ["god-small-things"],
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

/** Find an author by their stable id */
export function getAuthorById(id) {
  return AUTHORS.find(a => a.id === id) || null;
}
