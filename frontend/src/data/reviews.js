/**
 * BookVerse Studio — Reader Reviews
 *
 * Schema:
 *   id        string  — unique review ID
 *   bookId    string  — references BOOKS[].id in books.js
 *   reviewer  string  — reader display name
 *   rating    number  — 1-5
 *   date      string  — formatted date
 *   text      string  — review body
 */
export const REVIEWS = [
  // ── Ponniyin Selvan: The First Flood ─────────────────────────────────────
  { id: "r1", bookId: "ps-vol1", reviewer: "Priya Subramanian", rating: 5, date: "Jan 2026", text: "An absolute masterpiece of Tamil literature. Kalki's prose transports you to the Chola courts with such vividity that you can hear the waves crashing at Nagapattinam. Every character breathes with life." },
  { id: "r2", bookId: "ps-vol1", reviewer: "Arvind Raghavan", rating: 5, date: "Nov 2025", text: "I read the original Tamil and this translation captures the grandeur beautifully. The political intrigue rivals Game of Thrones, but with far more historical depth and emotional nuance." },
  { id: "r3", bookId: "ps-vol1", reviewer: "Meera Krishnan", rating: 4, date: "Sep 2025", text: "Sweeping in its scope and deeply researched. The only reason I'm not giving five stars is that the middle section can feel slow—but it rewards patience ten times over." },

  // ── The Psychology of Money ───────────────────────────────────────────────
  { id: "r4", bookId: "psychology-money", reviewer: "Rohan Mehta", rating: 5, date: "Mar 2026", text: "This book changed how I think about wealth entirely. Housel's storytelling approach makes complex behavioral concepts feel like bedtime stories. I've gifted it to six friends." },
  { id: "r5", bookId: "psychology-money", reviewer: "Sneha Kapoor", rating: 4, date: "Feb 2026", text: "Brilliant collection of essays on money psychology. Each chapter is self-contained yet builds toward a coherent philosophy. The chapter on compounding alone is worth the price." },
  { id: "r6", bookId: "psychology-money", reviewer: "Karthik Iyer", rating: 5, date: "Dec 2025", text: "As a financial advisor, I recommend this to every client before discussing portfolios. It addresses the emotional side of money that spreadsheets never will." },

  // ── Atomic Habits ─────────────────────────────────────────────────────────
  { id: "r7", bookId: "atomic-habits", reviewer: "Ananya Sharma", rating: 5, date: "Apr 2026", text: "The habit stacking concept alone transformed my morning routine. Clear writes with scientific precision but a personal warmth. This is the rare self-help book that actually works." },
  { id: "r8", bookId: "atomic-habits", reviewer: "Vikram Desai", rating: 5, date: "Jan 2026", text: "I've read dozens of productivity books. This is the only one I actually implemented. The 1% improvement framework is deceptively simple but profoundly effective." },
  { id: "r9", bookId: "atomic-habits", reviewer: "Nisha Reddy", rating: 4, date: "Oct 2025", text: "Actionable, evidence-based, and refreshingly free of guru-speak. My only wish is that it spent more time on breaking bad habits rather than forming new ones." },

  // ── Wings of Fire ─────────────────────────────────────────────────────────
  { id: "r10", bookId: "wings-of-fire", reviewer: "Suresh Nair", rating: 5, date: "Feb 2026", text: "Dr. Kalam's humility shines through every page. From his childhood in Rameswaram to leading India's missile program, this is an autobiography that reads like a letter to every young Indian." },
  { id: "r11", bookId: "wings-of-fire", reviewer: "Deepa Venkat", rating: 5, date: "Nov 2025", text: "Required reading for anyone who believes in the power of dreams. Kalam's story is proof that integrity, perseverance, and vision can overcome any obstacle." },
  { id: "r12", bookId: "wings-of-fire", reviewer: "Amit Chandra", rating: 4, date: "Aug 2025", text: "Inspiring and patriotic without being preachy. The technical sections on rocket science are accessible even to non-engineers. A national treasure of a memoir." },

  // ── Deep Work ─────────────────────────────────────────────────────────────
  { id: "r13", bookId: "deep-work", reviewer: "Pooja Gupta", rating: 5, date: "Mar 2026", text: "After reading this, I restructured my entire workday around deep work blocks. The productivity gains have been extraordinary. Newport practices what he preaches." },
  { id: "r14", bookId: "deep-work", reviewer: "Rahul Saxena", rating: 4, date: "Jan 2026", text: "A compelling argument for focused concentration in the age of distraction. Some of the examples feel repetitive, but the core message is urgent and timely." },
  { id: "r15", bookId: "deep-work", reviewer: "Divya Menon", rating: 4, date: "Sep 2025", text: "The distinction between deep work and shallow work is clarifying. I especially valued the practical rules section—it moved this from theory to actionable practice." },

  // ── The Immortals of Meluha ───────────────────────────────────────────────
  { id: "r16", bookId: "immortals-meluha", reviewer: "Aditya Joshi", rating: 5, date: "Apr 2026", text: "Amish has done something remarkable—made ancient mythology feel like a blockbuster thriller. Shiva as a mortal warrior is a genius premise, executed with cinematic energy." },
  { id: "r17", bookId: "immortals-meluha", reviewer: "Kavitha Raman", rating: 4, date: "Feb 2026", text: "Fast-paced, imaginative, and deeply rooted in Indian philosophical traditions. The world-building is rich and the action sequences are genuinely exciting." },
  { id: "r18", bookId: "immortals-meluha", reviewer: "Nikhil Bhatt", rating: 4, date: "Dec 2025", text: "A fresh and bold reimagining of Hindu mythology. The prose is sometimes uneven, but the vision and ambition more than compensate. I finished the entire trilogy in a week." },

  // ── Ikigai ────────────────────────────────────────────────────────────────
  { id: "r19", bookId: "ikigai", reviewer: "Sakura Tanaka", rating: 5, date: "Mar 2026", text: "A gentle, meditative read that helped me rethink what it means to live well. The interviews with Okinawan centenarians are deeply moving and surprisingly practical." },
  { id: "r20", bookId: "ikigai", reviewer: "Lakshmi Rao", rating: 4, date: "Jan 2026", text: "Simple yet profound. It's the kind of book you keep on your nightstand and revisit whenever life feels overwhelming. The chapter on flow resonated deeply." },

  // ── Sapiens ───────────────────────────────────────────────────────────────
  { id: "r21", bookId: "sapiens", reviewer: "Aditi Kulkarni", rating: 5, date: "Apr 2026", text: "Harari's ability to compress 70,000 years of human history into a coherent, provocative narrative is nothing short of genius. This book made me rethink everything." },
  { id: "r22", bookId: "sapiens", reviewer: "Manish Tiwari", rating: 5, date: "Feb 2026", text: "The chapters on the Agricultural Revolution and the power of shared myths are paradigm-shifting. Essential reading for anyone curious about what makes us human." },

  // ── The God of Small Things ───────────────────────────────────────────────
  { id: "r23", bookId: "god-small-things", reviewer: "Preethi Nambiar", rating: 5, date: "Mar 2026", text: "Roy's language is unlike anything I've ever encountered. She writes about heartbreak and injustice with the precision of poetry. Kerala comes alive in every paragraph." },
  { id: "r24", bookId: "god-small-things", reviewer: "Siddharth Menon", rating: 5, date: "Dec 2025", text: "This novel broke my heart and rebuilt it. The way Roy handles caste, love, and loss—through the eyes of children—is devastating and beautiful in equal measure." }
];

/** Get all reviews for a given bookId */
export function getReviewsByBookId(bookId) {
  return REVIEWS.filter(r => r.bookId === bookId);
}
