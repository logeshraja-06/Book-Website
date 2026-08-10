/**
 * BookVerse Studio — Central Author Directory
 *
 * Schema:
 *   id           string   — stable, used as route param (/authors/:id)
 *   name         string
 *   role         string   — one-line specialty
 *   avatarUrl    string
 *   bio          string   — short bio (used in cards and strips)
 *   fullBio      string   — extended bio (used on Author Profile page)
 *   books        string[] — array of book IDs from booksData.js
 *   joinDate     string   — "Since 2018"
 *   joinedYear   number
 *   followers    string   — formatted count, e.g. "142k"
 *   publications number   — total book count
 *   avgRating    string   — e.g. "4.9 ★"
 *   handle       string   — e.g. "@kalkistudio"
 *   stats        object   — { totalReads, avgRating, wishlistAdds, totalReviews }
 */
export const AUTHORS = [
  // ── TAMIL AUTHORS (11) ──
  {
    id: "kalki-krishnamurthy",
    name: "Kalki Krishnamurthy",
    role: "Tamil Historical Realism Icon",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Master storyteller of Tamil historical realism whose sagas redefined dynastic Indian literature.",
    fullBio: "Ramaswamy Krishnamurthy, known by his pen name Kalki, was one of the greatest Tamil writers of the 20th century. Born in 1899 in Puttamangalam, he devoted his life to literature, journalism, and Indian independence. His five-volume epic Ponniyin Selvan is considered the greatest Tamil historical novel ever written.",
    books: ["ps-vol1", "sivagami-sabatham"],
    joinDate: "Since 2018",
    joinedYear: 2018,
    followers: "142k",
    publications: 2,
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
    id: "jeyamohan",
    name: "Jeyamohan",
    role: "Epic Novelist & Philosopher",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Visionary chronicler and author of Venmurasu, one of the longest literary epics in modern world literature.",
    fullBio: "B. Jeyamohan is an acclaimed Tamil and Malayalam writer and literary critic. His monumental work Venmurasu is a 26-volume reimagining of the Mahabharata that spans tens of thousands of pages. His storytelling bridges classical mythology with profound psychological realism.",
    books: ["venmurasu"],
    joinDate: "Since 2019",
    joinedYear: 2019,
    followers: "98k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@jeyamohan",
    stats: {
      totalReads: "94.5k",
      avgRating: "4.9 ★",
      wishlistAdds: "14.2k",
      totalReviews: "2.8k"
    }
  },
  {
    id: "s-ramakrishnan",
    name: "S. Ramakrishnan",
    role: "Sahitya Akademi Laureate",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Distinguished novelist, playwright, and essayist capturing pastoral Tamil narratives and indigenous music.",
    fullBio: "S. Ramakrishnan is an eminent contemporary Tamil author who won the Sahitya Akademi Award for his novel Sancharam. His extensive body of work encompasses novels, short story collections, travelogues, and insightful world cinema essays.",
    books: ["sancharam"],
    joinDate: "Since 2020",
    joinedYear: 2020,
    followers: "76k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@sramakrishnan",
    stats: {
      totalReads: "68.2k",
      avgRating: "4.8 ★",
      wishlistAdds: "9.8k",
      totalReviews: "1.9k"
    }
  },
  {
    id: "sujatha-rangarajan",
    name: "Sujatha Rangarajan",
    role: "Tamil Sci-Fi & Technothriller Pioneer",
    avatarUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
    bio: "Iconic engineer and writer who revolutionized Tamil popular literature with speculative science fiction.",
    fullBio: "S. Rangarajan, writing under the pseudonym Sujatha, was a prolific Indian author and engineer who led the design of India's electronic voting machines. His speculative sci-fi novels En Iniya Iyanthira and Meendum Jeano anticipated artificial intelligence decades before the modern era.",
    books: ["en-iniya-iyanthira", "meendum-jeano"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "128k",
    publications: 2,
    avgRating: "4.8 ★",
    handle: "@sujathawriter",
    stats: {
      totalReads: "116.4k",
      avgRating: "4.8 ★",
      wishlistAdds: "16.1k",
      totalReviews: "3.4k"
    }
  },
  {
    id: "jayakanthan",
    name: "Jayakanthan",
    role: "Jnanpith Laureate & Social Realist",
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&q=80",
    bio: "Fearless pioneer of modern Tamil social realism exploring human dignity, morality, and working-class struggles.",
    fullBio: "D. Jayakanthan was an iconic Indian writer, journalist, and essayist. Awarded both the Jnanpith and Sahitya Akademi awards, his works such as Sila Nerangalil Sila Manithargal challenged conservative societal norms with unflinching empathy.",
    books: ["sila-nerangalil-sila-manithargal"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "84k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@jayakanthan",
    stats: {
      totalReads: "82.0k",
      avgRating: "4.9 ★",
      wishlistAdds: "11.5k",
      totalReviews: "2.1k"
    }
  },
  {
    id: "ashokamitran",
    name: "Ashokamitran",
    role: "Master of Understated Urban Realism",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Celebrated chronicler of mid-century Chennai life, characterized by gentle irony and spare, poignant prose.",
    fullBio: "J. Thyagarajan, known by his pen name Ashokamitran, was one of the most influential post-independence Tamil writers. His masterpiece Thanneer addressed urban water scarcity with profound subtlety, while his memoirs offer legendary portraits of the early Indian film studio era.",
    books: ["thanneer"],
    joinDate: "Since 2018",
    joinedYear: 2018,
    followers: "62k",
    publications: 1,
    avgRating: "4.7 ★",
    handle: "@ashokamitran",
    stats: {
      totalReads: "54.7k",
      avgRating: "4.7 ★",
      wishlistAdds: "7.9k",
      totalReviews: "1.3k"
    }
  },
  {
    id: "indira-parthasarathy",
    name: "Indira Parthasarathy",
    role: "Historical & Political Dramatist",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    bio: "Distinguished playwright and scholar blending psychological depth with historical agrarian realities.",
    fullBio: "R. Parthasarathy, writing as Indira Parthasarathy, is an acclaimed Tamil novelist and dramatist. His landmark novel Kuruthi Punal, based on the Kilvenmani tragedy, earned the Sahitya Akademi Award and remains a touchstone of Indian political literature.",
    books: ["kuruthi-punal"],
    joinDate: "Since 2019",
    joinedYear: 2019,
    followers: "51k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@indiraparthasarathy",
    stats: {
      totalReads: "49.3k",
      avgRating: "4.8 ★",
      wishlistAdds: "6.8k",
      totalReviews: "1.1k"
    }
  },
  {
    id: "thi-janakiraman",
    name: "Thi. Janakiraman",
    role: "Carnatic & Sensory Prose Master",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    bio: "Lyrical stylist renowned for his rich sensory depictions of the Kaveri delta, music, and complex human relationships.",
    fullBio: "Thi. Janakiraman was an extraordinary Tamil novelist whose masterpiece Mogamul explored the intersection of Carnatic music, obsessive love, and spiritual longing. His evocative prose captures the cultural heartland of Tanjore with unparalleled grace.",
    books: ["mogamul"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "73k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@thijanakiraman",
    stats: {
      totalReads: "67.4k",
      avgRating: "4.9 ★",
      wishlistAdds: "9.2k",
      totalReviews: "1.7k"
    }
  },
  {
    id: "pudhumaipithan",
    name: "Pudhumaipithan",
    role: "Father of Modern Tamil Short Story",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Transformational modernist who liberated the Tamil short story through sharp satire, realism, and existential depth.",
    fullBio: "C. Viruthachalam, best known as Pudhumaipithan, revolutionized 20th-century Tamil prose. His bold experimentation with narrative voice, philosophical irony, and psychological introspection established modern Tamil short fiction on par with world classics.",
    books: ["pudhumaipithan-sirukathaigal"],
    joinDate: "Since 2015",
    joinedYear: 2015,
    followers: "110k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@pudhumaipithan",
    stats: {
      totalReads: "105.1k",
      avgRating: "4.9 ★",
      wishlistAdds: "15.3k",
      totalReviews: "3.1k"
    }
  },
  {
    id: "bharathiyar",
    name: "Bharathiyar",
    role: "Mahakavi & National Poet",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Visionary poet, patriot, and social reformer whose fiery verses ignited modern Tamil poetic renaissance.",
    fullBio: "Subramania Bharathi, universally celebrated as Mahakavi Bharathiyar, was a pioneer of modern Tamil poetry. His passionate anthems for Indian independence, women's liberation, and human unity permanently shaped the conscience of Tamil literature.",
    books: ["bharathiyar-kavithaigal"],
    joinDate: "Since 2015",
    joinedYear: 2015,
    followers: "240k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@mahakavibharathi",
    stats: {
      totalReads: "215.8k",
      avgRating: "4.9 ★",
      wishlistAdds: "32.4k",
      totalReviews: "6.8k"
    }
  },
  {
    id: "bharathidasan",
    name: "Bharathidasan",
    role: "Puratchi Kavi & Rationalist Bard",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Revolutionary poet and Dravidian pioneer whose rhythmic verses championed social equality and Tamil linguistic pride.",
    fullBio: "Kanaka Subburathinam, writing as Bharathidasan, was a major 20th-century Tamil poet and rationalist. Honored with the title 'Puratchi Kavingnar' (Revolutionary Poet), his poetry championed egalitarian society, secularism, and literary renaissance.",
    books: ["bharathidasan-kavithaigal"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "89k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@bharathidasan",
    stats: {
      totalReads: "77.2k",
      avgRating: "4.8 ★",
      wishlistAdds: "10.4k",
      totalReviews: "2.0k"
    }
  },

  // ── INDIAN ENGLISH AUTHORS (10) ──
  {
    id: "rk-narayan",
    name: "R.K. Narayan",
    role: "Chronicler of Malgudi & Indian Life",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Beloved novelist who enchanted the literary world with the timeless, humorous fictional town of Malgudi.",
    fullBio: "Rasipuram Krishnaswami Iyer Narayanaswami is one of early Indian literature's leading figures in English. Over a six-decade career, his gentle irony, memorable human characters, and exquisite simplicity placed Malgudi alongside the great literary landscapes of world fiction.",
    books: ["malgudi-days", "the-guide", "swami-and-friends"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "185k",
    publications: 3,
    avgRating: "4.9 ★",
    handle: "@rknarayan",
    stats: {
      totalReads: "162.0k",
      avgRating: "4.9 ★",
      wishlistAdds: "22.5k",
      totalReviews: "4.6k"
    }
  },
  {
    id: "ruskin-bond",
    name: "Ruskin Bond",
    role: "Bard of the Garhwal Hills",
    avatarUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
    bio: "Legendary storyteller whose warm, evocative tales capture the serenity and flora of the Indian Himalayas.",
    fullBio: "Ruskin Bond is an Indian author of British descent whose career spans more than seventy years. Residing in Landour, Mussoorie, his heartfelt stories for children and adults celebrate nature, mountain friendships, and the simple beauty of hill-town life.",
    books: ["the-room-on-the-roof", "the-blue-umbrella"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "160k",
    publications: 2,
    avgRating: "4.8 ★",
    handle: "@ruskinbond",
    stats: {
      totalReads: "140.2k",
      avgRating: "4.8 ★",
      wishlistAdds: "19.8k",
      totalReviews: "3.7k"
    }
  },
  {
    id: "arundhati-roy",
    name: "Arundhati Roy",
    role: "Booker Laureate & Essayist",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    bio: "Booker Prize-winning author whose prose blends lyrical beauty with uncompromising political urgency.",
    fullBio: "Arundhati Roy is an Indian novelist and activist whose debut novel The God of Small Things won the Booker Prize in 1997. She is recognized internationally for her passionate essays on human rights, environment, and social justice.",
    books: ["god-of-small-things"],
    joinDate: "Since 2019",
    joinedYear: 2019,
    followers: "92k",
    publications: 1,
    avgRating: "4.7 ★",
    handle: "@arundhatiroy",
    stats: {
      totalReads: "76.8k",
      avgRating: "4.7 ★",
      wishlistAdds: "11.2k",
      totalReviews: "1.4k"
    }
  },
  {
    id: "chetan-bhagat",
    name: "Chetan Bhagat",
    role: "Contemporary Popular Fiction Novelist",
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&q=80",
    bio: "Bestselling author who brought accessible, youth-centric commercial storytelling to millions of Indian readers.",
    fullBio: "Chetan Bhagat is an Indian author and columnist whose debut novel Five Point Someone captured the anxieties and humor of premier college life. His books have sparked blockbuster film adaptations and introduced millions to recreational reading.",
    books: ["five-point-someone"],
    joinDate: "Since 2018",
    joinedYear: 2018,
    followers: "135k",
    publications: 1,
    avgRating: "4.6 ★",
    handle: "@chetanbhagat",
    stats: {
      totalReads: "128.4k",
      avgRating: "4.6 ★",
      wishlistAdds: "14.1k",
      totalReviews: "2.9k"
    }
  },
  {
    id: "amish-tripathi",
    name: "Amish Tripathi",
    role: "Mythological Pop-Culture Pioneer",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Pioneer of modern Indian mythological fantasy with over 6 million printed copies worldwide.",
    fullBio: "Amish Tripathi is an Indian author known for his Shiva Trilogy and Ram Chandra Series. His debut novel The Immortals of Meluha unlocked a massive contemporary appetite for mytho-historical fiction.",
    books: ["immortals-meluha"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "115k",
    publications: 1,
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
    id: "sudha-murty",
    name: "Sudha Murty",
    role: "Philanthropist & Moral Essayist",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Beloved author and educator known for simple, inspiring stories of compassion, humility, and Indian values.",
    fullBio: "Sudha Murty is an Indian educator, author, and former chairperson of the Infosys Foundation. Her memoirs and essay collections such as Wise and Otherwise reflect authentic grassroots experiences with warmth and timeless moral clarity.",
    books: ["wise-and-otherwise", "three-thousand-stitches"],
    joinDate: "Since 2018",
    joinedYear: 2018,
    followers: "220k",
    publications: 2,
    avgRating: "4.9 ★",
    handle: "@sudhamurty",
    stats: {
      totalReads: "195.4k",
      avgRating: "4.9 ★",
      wishlistAdds: "28.6k",
      totalReviews: "5.8k"
    }
  },
  {
    id: "devdutt-pattanaik",
    name: "Devdutt Pattanaik",
    role: "Mythologist & Cultural Illustrator",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Mythologist decoding ancient symbols, epics, and Vedic traditions for contemporary leadership and life.",
    fullBio: "Devdutt Pattanaik is a physician-turned-author who has written extensively on Hindu, Buddhist, and Jain mythologies. His works like Myth = Mithya decode ancient philosophical worldviews through accessible narratives and signature line drawings.",
    books: ["myth-mithya"],
    joinDate: "Since 2019",
    joinedYear: 2019,
    followers: "105k",
    publications: 1,
    avgRating: "4.7 ★",
    handle: "@devduttmyth",
    stats: {
      totalReads: "89.1k",
      avgRating: "4.7 ★",
      wishlistAdds: "12.8k",
      totalReviews: "2.3k"
    }
  },
  {
    id: "vikram-seth",
    name: "Vikram Seth",
    role: "Epic Novelist & Classical Poet",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    bio: "Acclaimed polymath and novelist whose panoramic saga A Suitable Boy is an epic masterpiece of post-partition India.",
    fullBio: "Vikram Seth is an Indian novelist and poet who achieved international acclaim for his 1,349-page magnum opus A Suitable Boy. His mastery over metered verse, travelogues, and intricate family tapestries marks him as one of India's finest literary masters.",
    books: ["a-suitable-boy"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "88k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@vikramseth",
    stats: {
      totalReads: "79.5k",
      avgRating: "4.8 ★",
      wishlistAdds: "11.7k",
      totalReviews: "2.2k"
    }
  },
  {
    id: "khushwant-singh",
    name: "Khushwant Singh",
    role: "Unvarnished Historian & Satirist",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Iconic editor and author whose harrowing partition classic Train to Pakistan captures human tragedy and courage.",
    fullBio: "Khushwant Singh was a preeminent Indian journalist, lawyer, and historian. His historical novel Train to Pakistan vividly portrays the human devastation of the 1947 partition of India with devastating honesty and profound compassion.",
    books: ["train-to-pakistan"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "112k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@khushwantsingh",
    stats: {
      totalReads: "98.7k",
      avgRating: "4.8 ★",
      wishlistAdds: "14.6k",
      totalReviews: "2.9k"
    }
  },
  {
    id: "rabindranath-tagore",
    name: "Rabindranath Tagore",
    role: "Nobel Laureate & Universal Bard",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "First non-European Nobel laureate in Literature whose transcendent poetry and humanist vision reshaped world art.",
    fullBio: "Rabindranath Tagore was a Bengali polymath who reshaped Bengali literature and Indian art. In 1913, he became the first Asian to win the Nobel Prize in Literature for his spiritual and mystical poetry collection Gitanjali.",
    books: ["gitanjali"],
    joinDate: "Since 2015",
    joinedYear: 2015,
    followers: "280k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@gurudevtagore",
    stats: {
      totalReads: "245.0k",
      avgRating: "4.9 ★",
      wishlistAdds: "36.8k",
      totalReviews: "7.4k"
    }
  },

  // ── GLOBAL CLASSICS & NON-FICTION AUTHORS (14) ──
  {
    id: "george-orwell",
    name: "George Orwell",
    role: "Dystopian & Political Satirist",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Prophetic English novelist and essayist whose warnings against totalitarianism remain vital cultural touchstones.",
    fullBio: "Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, and critic. His legendary novels 1984 and Animal Farm provided enduring frameworks for understanding political language, propaganda, and state surveillance.",
    books: ["1984", "animal-farm"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "295k",
    publications: 2,
    avgRating: "4.9 ★",
    handle: "@georgeorwell",
    stats: {
      totalReads: "260.4k",
      avgRating: "4.9 ★",
      wishlistAdds: "38.2k",
      totalReviews: "8.1k"
    }
  },
  {
    id: "jk-rowling",
    name: "J.K. Rowling",
    role: "Fantasy & Wizarding World Creator",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Author of the world-spanning Harry Potter series that defined childhood and fantasy reading for generations.",
    fullBio: "J.K. Rowling is a British author and philanthropist. Her seven Harry Potter fantasy books have sold more than 600 million copies worldwide and sparked an enduring global literary phenomenon.",
    books: ["harry-potter-philosophers-stone"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "350k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@jkrowling",
    stats: {
      totalReads: "310.8k",
      avgRating: "4.9 ★",
      wishlistAdds: "45.0k",
      totalReviews: "9.5k"
    }
  },
  {
    id: "jrr-tolkien",
    name: "J.R.R. Tolkien",
    role: "Father of High Fantasy & Middle-earth",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Oxford philologist and worldbuilder whose Middle-earth legendarium created the cornerstone of modern fantasy.",
    fullBio: "John Ronald Reuel Tolkien was an English philologist, poet, and university professor. His epic high-fantasy masterpiece The Lord of the Rings has inspired generations of authors and remains a titan of 20th-century literature.",
    books: ["the-lord-of-the-rings"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "310k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@jrrtolkien",
    stats: {
      totalReads: "285.6k",
      avgRating: "4.9 ★",
      wishlistAdds: "41.3k",
      totalReviews: "8.7k"
    }
  },
  {
    id: "f-scott-fitzgerald",
    name: "F. Scott Fitzgerald",
    role: "Chronicler of the Jazz Age",
    avatarUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
    bio: "Brilliant voice of the 1920s Lost Generation whose prose captures the intoxicating illusion of the American Dream.",
    fullBio: "Francis Scott Key Fitzgerald was an American novelist whose tragic masterpiece The Great Gatsby is celebrated as one of the quintessential achievements of modern American literature.",
    books: ["the-great-gatsby"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "140k",
    publications: 1,
    avgRating: "4.7 ★",
    handle: "@fsfitzgerald",
    stats: {
      totalReads: "125.0k",
      avgRating: "4.7 ★",
      wishlistAdds: "18.2k",
      totalReviews: "3.6k"
    }
  },
  {
    id: "harper-lee",
    name: "Harper Lee",
    role: "Pulitzer Laureate & Moral Icon",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Pulitzer Prize-winning author whose timeless novel To Kill a Mockingbird examines justice, empathy, and integrity.",
    fullBio: "Nelle Harper Lee was an American novelist who received the Presidential Medal of Freedom. Her landmark work To Kill a Mockingbird has been translated into over forty languages and taught in classrooms across the globe.",
    books: ["to-kill-a-mockingbird"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "190k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@harperlee",
    stats: {
      totalReads: "172.5k",
      avgRating: "4.9 ★",
      wishlistAdds: "24.9k",
      totalReviews: "5.2k"
    }
  },
  {
    id: "jane-austen",
    name: "Jane Austen",
    role: "Mistress of Regency Wit & Romance",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    bio: "Pioneering English novelist whose razor-sharp wit and social commentary defined the romantic classic novel.",
    fullBio: "Jane Austen was an English novelist known for her realism, biting irony, and profound social insight. Her enduring classic Pride and Prejudice continues to captivate readers with its unforgettable dynamic between Elizabeth Bennet and Mr. Darcy.",
    books: ["pride-and-prejudice"],
    joinDate: "Since 2015",
    joinedYear: 2015,
    followers: "260k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@janeausten",
    stats: {
      totalReads: "235.0k",
      avgRating: "4.9 ★",
      wishlistAdds: "34.1k",
      totalReviews: "7.0k"
    }
  },
  {
    id: "leo-tolstoy",
    name: "Leo Tolstoy",
    role: "Titan of Russian Epic Realism",
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&q=80",
    bio: "Russian master whose monumental works War and Peace and Anna Karenina encompass the entirety of human existence.",
    fullBio: "Count Lev Nikolayevich Tolstoy is widely regarded as one of the greatest authors in human history. His mastery of historical panorama, spiritual quest, and intimate psychological realism set the global standard for the novel.",
    books: ["war-and-peace"],
    joinDate: "Since 2015",
    joinedYear: 2015,
    followers: "210k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@leotolstoy",
    stats: {
      totalReads: "188.0k",
      avgRating: "4.8 ★",
      wishlistAdds: "27.5k",
      totalReviews: "5.5k"
    }
  },
  {
    id: "paulo-coelho",
    name: "Paulo Coelho",
    role: "Philosophical Storyteller & Mystic",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Brazilian author whose spiritual fable The Alchemist has inspired millions to follow their Personal Legend.",
    fullBio: "Paulo Coelho is a Brazilian lyricist and novelist who is one of the most widely read authors in the world. His beloved allegory The Alchemist holds the Guinness World Record for the most translated book by a living author.",
    books: ["the-alchemist"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "245k",
    publications: 1,
    avgRating: "4.7 ★",
    handle: "@paulocoelho",
    stats: {
      totalReads: "220.0k",
      avgRating: "4.7 ★",
      wishlistAdds: "31.2k",
      totalReviews: "6.4k"
    }
  },
  {
    id: "james-clear",
    name: "James Clear",
    role: "Habits & Behavioral Science Author",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    bio: "Author and speaker focused on habits, decision-making, and continuous improvement in work and life.",
    fullBio: "James Clear is the author of Atomic Habits, the #1 New York Times bestseller that has sold over 15 million copies. Drawing on biology, neuroscience, and psychology, his framework simplifies actionable personal growth.",
    books: ["atomic-habits"],
    joinDate: "Since 2020",
    joinedYear: 2020,
    followers: "204k",
    publications: 1,
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
    id: "morgan-housel",
    name: "Morgan Housel",
    role: "Behavioral Finance Strategist",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Partner at Collaborative Fund examining human irrationality, risk, and compound wealth.",
    fullBio: "Morgan Housel is a partner at the Collaborative Fund and a former columnist at The Motley Fool and The Wall Street Journal. His bestseller The Psychology of Money has sold over 4 million copies worldwide.",
    books: ["psychology-of-money"],
    joinDate: "Since 2021",
    joinedYear: 2021,
    followers: "98k",
    publications: 1,
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
    id: "robert-kiyosaki",
    name: "Robert Kiyosaki",
    role: "Personal Finance Educator",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Financial literacy educator whose classic Rich Dad Poor Dad challenged traditional beliefs about money and assets.",
    fullBio: "Robert Toru Kiyosaki is an American businessman and author. His groundbreaking personal finance book Rich Dad Poor Dad has remained a global bestseller for over two decades, teaching asset accumulation and financial independence.",
    books: ["rich-dad-poor-dad"],
    joinDate: "Since 2018",
    joinedYear: 2018,
    followers: "175k",
    publications: 1,
    avgRating: "4.7 ★",
    handle: "@robertkiyosaki",
    stats: {
      totalReads: "155.0k",
      avgRating: "4.7 ★",
      wishlistAdds: "21.0k",
      totalReviews: "4.3k"
    }
  },
  {
    id: "stephen-hawking",
    name: "Stephen Hawking",
    role: "Theoretical Physicist & Cosmologist",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bio: "Theoretical physicist and cosmologist who brought the mysteries of black holes and the universe to all humanity.",
    fullBio: "Stephen William Hawking was an English theoretical physicist and director of research at the Centre for Theoretical Cosmology at Cambridge. His landmark book A Brief History of Time unlocked cosmology for millions of general readers.",
    books: ["a-brief-history-of-time"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "270k",
    publications: 1,
    avgRating: "4.9 ★",
    handle: "@stephenhawking",
    stats: {
      totalReads: "240.2k",
      avgRating: "4.9 ★",
      wishlistAdds: "33.5k",
      totalReviews: "6.9k"
    }
  },
  {
    id: "yuval-harari",
    name: "Yuval Noah Harari",
    role: "Historian & Macro-Evolutionary Thinker",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    bio: "Historian and philosopher renowned for sweeping macro-histories tracing human civilization from stone to silicon.",
    fullBio: "Yuval Noah Harari is an Israeli public intellectual, historian, and professor at Hebrew University. His international phenomenon Sapiens has sold over 25 million copies and transformed how we comprehend species survival and collective fictions.",
    books: ["sapiens"],
    joinDate: "Since 2016",
    joinedYear: 2016,
    followers: "178k",
    publications: 1,
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
    id: "daniel-kahneman",
    name: "Daniel Kahneman",
    role: "Nobel Laureate in Behavioral Economics",
    avatarUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
    bio: "Nobel laureate psychologist who reshaped economics by uncovering human cognitive biases and fast vs slow thinking.",
    fullBio: "Daniel Kahneman was an Israeli-American psychologist and Nobel laureate in Economic Sciences. His seminal book Thinking, Fast and Slow synthesized decades of cognitive research into System 1 and System 2 human decision-making.",
    books: ["thinking-fast-and-slow"],
    joinDate: "Since 2017",
    joinedYear: 2017,
    followers: "192k",
    publications: 1,
    avgRating: "4.8 ★",
    handle: "@danielkahneman",
    stats: {
      totalReads: "168.0k",
      avgRating: "4.8 ★",
      wishlistAdds: "23.4k",
      totalReviews: "4.8k"
    }
  }
];

/** Find an author by their stable id */
export function getAuthorById(id) {
  return AUTHORS.find(a => a.id === id || a.slug === id) || null;
}
