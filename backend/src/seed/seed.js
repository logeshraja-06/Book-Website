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
    id: "historical-fiction",
    name: "Historical Fiction",
    count: 342,
    desc: "Sweeping dynastic chronicles, ancient empires, and timeless classic literature.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "literary-fiction",
    name: "Literary Fiction",
    count: 280,
    desc: "Profound explorations of human nature, morality, and postcolonial realities.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "science-fiction",
    name: "Science Fiction",
    count: 165,
    desc: "Cybernetic futures, speculative technologies, and interstellar odysseys.",
    coverUrl: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "poetry",
    name: "Poetry",
    count: 140,
    desc: "Rhythmic verses, mystical song offerings, and revolutionary anthems.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "fiction",
    name: "Fiction",
    count: 310,
    desc: "Captivating storytellers from Malgudi to the Garhwal Himalayas and beyond.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "mythology-fiction",
    name: "Mythology / Fiction",
    count: 195,
    desc: "Reimagined ancient legends, Vedic epics, and mythological adventures.",
    coverUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "dystopian",
    name: "Dystopian",
    count: 125,
    desc: "Totalitarian prophecies, surveillance states, and human resilience.",
    coverUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "fantasy",
    name: "Fantasy",
    count: 245,
    desc: "High fantasy legendariums, wizarding academies, and heroic worldbuilding.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "classic",
    name: "Classic",
    count: 290,
    desc: "Enduring achievements of world literature across centuries and cultures.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "self-help",
    name: "Self-Help",
    count: 215,
    desc: "Habit formation, cognitive mastery, and personal transformation systems.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "finance",
    name: "Finance",
    count: 260,
    desc: "Behavioral economics, financial literacy, and compounding wealth strategies.",
    coverUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "science",
    name: "Science",
    count: 130,
    desc: "Cosmology, theoretical physics, and macro-evolutionary histories.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80"
  }
];

const AUTHORS_DATA = [
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
    fullBio: "B. Jeyamohan is an acclaimed Tamil and Malayalam writer and literary critic. His monumental work Venmurasu is a 26-volume reimagining of the Mahabharata that spans tens of thousands of pages.",
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
    fullBio: "S. Ramakrishnan is an eminent contemporary Tamil author who won the Sahitya Akademi Award for his novel Sancharam.",
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
    fullBio: "S. Rangarajan, writing under the pseudonym Sujatha, was a prolific Indian author and engineer who led the design of India's electronic voting machines.",
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
    fullBio: "D. Jayakanthan was an iconic Indian writer, journalist, and essayist. Awarded both the Jnanpith and Sahitya Akademi awards, his works challenged conservative norms with unflinching empathy.",
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
    fullBio: "J. Thyagarajan, known as Ashokamitran, was one of the most influential post-independence Tamil writers. His masterpiece Thanneer addressed urban water scarcity with profound subtlety.",
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
    fullBio: "R. Parthasarathy, writing as Indira Parthasarathy, is an acclaimed Tamil novelist and dramatist whose landmark novel Kuruthi Punal earned the Sahitya Akademi Award.",
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
    fullBio: "Thi. Janakiraman was an extraordinary Tamil novelist whose masterpiece Mogamul explored the intersection of Carnatic music, obsessive love, and spiritual longing.",
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
    fullBio: "C. Viruthachalam, best known as Pudhumaipithan, revolutionized 20th-century Tamil prose with bold philosophical irony and psychological introspection.",
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
    fullBio: "Subramania Bharathi, universally celebrated as Mahakavi Bharathiyar, was a pioneer of modern Tamil poetry whose passionate anthems permanently shaped the conscience of Indian literature.",
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
    fullBio: "Kanaka Subburathinam, writing as Bharathidasan, was a major 20th-century Tamil poet whose poetry championed egalitarian society, secularism, and literary renaissance.",
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
    fullBio: "R.K. Narayan is one of early Indian literature's leading figures in English. Over a six-decade career, his gentle irony placed Malgudi alongside the great landscapes of world fiction.",
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
    fullBio: "Ruskin Bond is an Indian author of British descent whose career spans more than seventy years, celebrating mountain friendships and the beauty of hill-town life.",
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
    fullBio: "Arundhati Roy is an Indian novelist and activist whose debut novel The God of Small Things won the Booker Prize in 1997.",
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
    fullBio: "Chetan Bhagat is an Indian author and columnist whose debut novel Five Point Someone captured the humor and anxieties of college life.",
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
    fullBio: "Amish Tripathi is an Indian author known for his Shiva Trilogy and Ram Chandra Series.",
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
    fullBio: "Sudha Murty is an Indian educator, author, and former chairperson of the Infosys Foundation whose essay collections reflect authentic moral clarity.",
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
    fullBio: "Devdutt Pattanaik has written extensively on Hindu and Indian mythologies, decoding ancient philosophical worldviews.",
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
    fullBio: "Vikram Seth is an Indian novelist and poet who achieved international acclaim for his 1,349-page magnum opus A Suitable Boy.",
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
    fullBio: "Khushwant Singh was a preeminent Indian journalist and historian whose novel Train to Pakistan vividly portrays the human devastation of partition.",
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
    fullBio: "Rabindranath Tagore was a Bengali polymath who became the first Asian to win the Nobel Prize in Literature in 1913 for Gitanjali.",
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

  // ── GLOBAL CLASSICS & NON-FICTION (14) ──
  {
    id: "george-orwell",
    name: "George Orwell",
    role: "Dystopian & Political Satirist",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bio: "Prophetic English novelist and essayist whose warnings against totalitarianism remain vital cultural touchstones.",
    fullBio: "George Orwell's legendary novels 1984 and Animal Farm provided enduring frameworks for understanding political language and totalitarian state surveillance.",
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
    fullBio: "J.K. Rowling's seven Harry Potter fantasy books have sold more than 600 million copies worldwide.",
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
    fullBio: "J.R.R. Tolkien's epic high-fantasy masterpiece The Lord of the Rings has inspired generations of authors and worldbuilders.",
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
    fullBio: "F. Scott Fitzgerald's tragic masterpiece The Great Gatsby is celebrated as one of the quintessential achievements of American literature.",
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
    fullBio: "Harper Lee's landmark work To Kill a Mockingbird has been translated into over forty languages and taught across the globe.",
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
    fullBio: "Jane Austen's enduring classic Pride and Prejudice continues to captivate readers with its unforgettable romantic duel.",
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
    fullBio: "Leo Tolstoy's mastery of historical panorama and intimate psychological realism set the global standard for the novel.",
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
    fullBio: "Paulo Coelho's beloved allegory The Alchemist holds the world record for the most translated book by a living author.",
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
    fullBio: "James Clear is the author of Atomic Habits, the #1 New York Times bestseller that has sold over 15 million copies worldwide.",
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
    fullBio: "Morgan Housel's bestseller The Psychology of Money has sold over 4 million copies and been translated into 53 languages.",
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
    fullBio: "Robert Kiyosaki's groundbreaking personal finance book Rich Dad Poor Dad has remained a global bestseller for over two decades.",
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
    fullBio: "Stephen Hawking was director of research at the Centre for Theoretical Cosmology at Cambridge. His landmark book A Brief History of Time unlocked cosmology for millions.",
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
    fullBio: "Yuval Noah Harari's international phenomenon Sapiens has sold over 25 million copies and transformed how we comprehend species survival.",
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
    fullBio: "Daniel Kahneman was a Nobel laureate whose seminal book Thinking, Fast and Slow synthesized decades of cognitive research into human decision-making.",
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

const BOOKS_DATA = [
  // ── TAMIL LITERATURE & HISTORICAL (13) ──
  {
    id: "ps-vol1",
    title: "Ponniyin Selvan",
    subtitle: "The Masterpiece of Chola Dynastic Intrigue",
    author: "Kalki Krishnamurthy",
    authorId: "kalki-krishnamurthy",
    genre: "Historical Fiction",
    language: "Tamil",
    price: 1250,
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
    id: "sivagami-sabatham",
    title: "Sivagamiyin Sabatham",
    subtitle: "The Vow of Sivagami — Pallava Dynasty Epic",
    author: "Kalki Krishnamurthy",
    authorId: "kalki-krishnamurthy",
    genre: "Historical Fiction",
    language: "Tamil",
    price: 850,
    isbn: "978-8177641264",
    rating: 4.9,
    reviewsCount: "9.8k",
    publishYear: 1944,
    pages: 480,
    editorPick: false,
    tagline: "The Golden Era of Vatapi and Kanchi",
    synopsis: "Set in 7th-century South India amidst the monumental war between the Pallavas of Kanchi and the Chalukyas of Vatapi, woven with art, sculpture, and royal oath.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "Tamil Classic",
    status: "Published",
    lastEdited: "Jan 10, 2026",
    submittedDate: "Dec 01, 2025",
    editorialNotes: "Pallava-era historical masterpiece."
  },
  {
    id: "venmurasu",
    title: "Venmurasu",
    subtitle: "The White Drum — Modern Epic Reimagining",
    author: "Jeyamohan",
    authorId: "jeyamohan",
    genre: "Literary Fiction",
    language: "Tamil",
    price: 1450,
    isbn: "978-9388301188",
    rating: 4.9,
    reviewsCount: "8.4k",
    publishYear: 2014,
    pages: 920,
    editorPick: false,
    tagline: "An Unprecedented Modern Epic of Ancient Thought",
    synopsis: "A towering literary reimagining of classical Indian lore, exploring the emotional complexity and existential conflicts of legendary dynastic archetypes.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    badge: "Literary Monument",
    status: "Published",
    lastEdited: "Sep 15, 2025",
    submittedDate: "Aug 20, 2025",
    editorialNotes: "Astounding philosophical depth and lyrical Tamil cadence."
  },
  {
    id: "sancharam",
    title: "Sancharam",
    subtitle: "The Wandering Nadaswaram Troupe",
    author: "S. Ramakrishnan",
    authorId: "s-ramakrishnan",
    genre: "Literary Fiction",
    language: "Tamil",
    price: 480,
    isbn: "978-8188643509",
    rating: 4.8,
    reviewsCount: "6.2k",
    publishYear: 2018,
    pages: 380,
    editorPick: false,
    tagline: "Sahitya Akademi Winning Pastoral Saga",
    synopsis: "A deeply moving chronicle following the lives and hardships of traditional Nadaswaram musicians wandering the arid landscapes of Tamil Nadu.",
    coverUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    badge: "Sahitya Akademi Award",
    status: "Published",
    lastEdited: "Oct 12, 2025",
    submittedDate: "Sep 25, 2025",
    editorialNotes: "Celebrated narrative celebrating indigenous folk music."
  },
  {
    id: "en-iniya-iyanthira",
    title: "En Iniya Iyanthira",
    subtitle: "My Sweet Robot — Speculative Dystopia",
    author: "Sujatha Rangarajan",
    authorId: "sujatha-rangarajan",
    genre: "Science Fiction",
    language: "Tamil",
    price: 390,
    isbn: "978-8188643219",
    rating: 4.8,
    reviewsCount: "11.6k",
    publishYear: 1987,
    pages: 310,
    editorPick: false,
    tagline: "The Foreseeing Vision of Cybernetic Governance",
    synopsis: "In a hyper-controlled dystopian future ruled by an authoritarian machine monarch, a group of rebels and a self-aware robotic companion fight for humanity.",
    coverUrl: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=800&q=80",
    badge: "Sci-Fi Classic",
    status: "Published",
    lastEdited: "Nov 05, 2025",
    submittedDate: "Oct 18, 2025",
    editorialNotes: "Groundbreaking Tamil speculative fiction."
  },
  {
    id: "meendum-jeano",
    title: "Meendum Jeano",
    subtitle: "The Return of Jeano — Cybernetic Odyssey",
    author: "Sujatha Rangarajan",
    authorId: "sujatha-rangarajan",
    genre: "Science Fiction",
    language: "Tamil",
    price: 420,
    isbn: "978-8188643226",
    rating: 4.7,
    reviewsCount: "8.9k",
    publishYear: 1989,
    pages: 290,
    editorPick: false,
    tagline: "Sentient Machines and Human Destiny",
    synopsis: "The thrilling continuation of Jeano's odyssey, examining the ethical frontier between robotic sentience, human fragility, and planetary freedom.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80",
    badge: "Futurist Fiction",
    status: "Published",
    lastEdited: "Dec 01, 2025",
    submittedDate: "Nov 12, 2025",
    editorialNotes: "Visionary techno-thriller narrative."
  },
  {
    id: "sila-nerangalil-sila-manithargal",
    title: "Sila Nerangalil Sila Manithargal",
    subtitle: "Sometimes, Certain People",
    author: "Jayakanthan",
    authorId: "jayakanthan",
    genre: "Literary Fiction",
    language: "Tamil",
    price: 450,
    isbn: "978-8177641554",
    rating: 4.9,
    reviewsCount: "12.3k",
    publishYear: 1970,
    pages: 350,
    editorPick: false,
    tagline: "Sahitya Akademi Winning Moral Masterpiece",
    synopsis: "An unsparing social drama following Ganga, a young woman navigating hypocrisy and societal castigation with unwavering personal truth.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    badge: "Social Realism Icon",
    status: "Published",
    lastEdited: "Jan 12, 2026",
    submittedDate: "Dec 18, 2025",
    editorialNotes: "Bold, empathetic interrogation of cultural ethics."
  },
  {
    id: "thanneer",
    title: "Thanneer",
    subtitle: "Water — The Chronicle of a Parched City",
    author: "Ashokamitran",
    authorId: "ashokamitran",
    genre: "Literary Fiction",
    language: "Tamil",
    price: 360,
    isbn: "978-8188643110",
    rating: 4.7,
    reviewsCount: "7.1k",
    publishYear: 1973,
    pages: 220,
    editorPick: false,
    tagline: "A Sparse, Unforgettable Portrayal of Urban Scarcity",
    synopsis: "Set during Chennai's punishing summer droughts, this understated masterpiece depicts ordinary families whose daily rhythms revolve around the struggle for drinking water.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "Urban Realism",
    status: "Published",
    lastEdited: "Nov 20, 2025",
    submittedDate: "Nov 02, 2025",
    editorialNotes: "Exquisitely restrained ecological and human portrait."
  },
  {
    id: "kuruthi-punal",
    title: "Kuruthi Punal",
    subtitle: "River of Blood — Agrarian Conflict",
    author: "Indira Parthasarathy",
    authorId: "indira-parthasarathy",
    genre: "Historical / Literary",
    language: "Tamil",
    price: 410,
    isbn: "978-8177641882",
    rating: 4.8,
    reviewsCount: "5.9k",
    publishYear: 1975,
    pages: 280,
    editorPick: false,
    tagline: "Sahitya Akademi Award Winning Political Chronicle",
    synopsis: "A searing examination of class confrontation and rural landlordism in Tanjore, inspired by the historical struggles of landless farm laborers.",
    coverUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=800&q=80",
    badge: "Political Classic",
    status: "Published",
    lastEdited: "Dec 08, 2025",
    submittedDate: "Nov 21, 2025",
    editorialNotes: "Powerful dramatization of agrarian unrest."
  },
  {
    id: "mogamul",
    title: "Mogamul",
    subtitle: "The Thorn of Passion",
    author: "Thi. Janakiraman",
    authorId: "thi-janakiraman",
    genre: "Literary Fiction",
    language: "Tamil",
    price: 520,
    isbn: "978-8188643899",
    rating: 4.9,
    reviewsCount: "9.4k",
    publishYear: 1966,
    pages: 440,
    editorPick: false,
    tagline: "A Lyrical Odyssey of Carnatic Music & Passion",
    synopsis: "The haunting tale of Babu, an aspiring classical vocalist in Kumbakonam whose artistic journey becomes inseparable from his complex devotion to Yamuna.",
    coverUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    badge: "Carnatic Literature",
    status: "Published",
    lastEdited: "Jan 18, 2026",
    submittedDate: "Dec 29, 2025",
    editorialNotes: "Magnificent sensory prose capturing Thanjavur musical heritage."
  },
  {
    id: "pudhumaipithan-sirukathaigal",
    title: "Pudhumaipithan Sirukathaigal",
    subtitle: "The Definitive Short Story Collection",
    author: "Pudhumaipithan",
    authorId: "pudhumaipithan",
    genre: "Short Stories",
    language: "Tamil",
    price: 460,
    isbn: "978-8177641011",
    rating: 4.9,
    reviewsCount: "13.8k",
    publishYear: 1940,
    pages: 360,
    editorPick: false,
    tagline: "Foundational Masterpieces of Modern Tamil Fiction",
    synopsis: "A cornerstone anthology containing iconic stories like 'Kadavulum Kandasamy Pillaiyum' and 'Shaapavimochana', blending mythic subversion with razor-sharp satire.",
    coverUrl: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=800&q=80",
    badge: "Anthology Landmark",
    status: "Published",
    lastEdited: "Sep 22, 2025",
    submittedDate: "Sep 01, 2025",
    editorialNotes: "Unrivaled philosophical irony and modern storytelling craft."
  },
  {
    id: "bharathiyar-kavithaigal",
    title: "Bharathiyar Kavithaigal",
    subtitle: "Complete Patriotic & Lyrical Verses",
    author: "Bharathiyar",
    authorId: "bharathiyar",
    genre: "Poetry",
    language: "Tamil",
    price: 490,
    isbn: "978-8177641004",
    rating: 4.9,
    reviewsCount: "25.6k",
    publishYear: 1921,
    pages: 420,
    editorPick: false,
    tagline: "Immortal Anthems of Freedom, Humanity, and Courage",
    synopsis: "The definitive anthology of Subramania Bharathi's transformative poetry, spanning patriotic declarations, devotional odes, and songs for women's liberation.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    badge: "National Heritage",
    status: "Published",
    lastEdited: "Aug 10, 2025",
    submittedDate: "Jul 28, 2025",
    editorialNotes: "Timeless lyrical treasures of the modern Tamil renaissance."
  },
  {
    id: "bharathidasan-kavithaigal",
    title: "Bharathidasan Kavithaigal",
    subtitle: "Revolutionary Verses of Equality and Language",
    author: "Bharathidasan",
    authorId: "bharathidasan",
    genre: "Poetry",
    language: "Tamil",
    price: 440,
    isbn: "978-8177641028",
    rating: 4.8,
    reviewsCount: "11.1k",
    publishYear: 1938,
    pages: 340,
    editorPick: false,
    tagline: "Fiery Rhythms of Social Progress and Rationalism",
    synopsis: "A vibrant poetic collection celebrating Tamil cultural identity, secular brotherhood, educational reform, and radical egalitarianism.",
    coverUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80",
    badge: "Revolutionary Verse",
    status: "Published",
    lastEdited: "Oct 04, 2025",
    submittedDate: "Sep 16, 2025",
    editorialNotes: "Resonant, progressive rhythmic mastery."
  },

  // ── INDIAN ENGLISH LITERATURE & ESSAYS (14) ──
  {
    id: "malgudi-days",
    title: "Malgudi Days",
    subtitle: "Tales of the Enchanted South Indian Town",
    author: "R.K. Narayan",
    authorId: "rk-narayan",
    genre: "Fiction",
    language: "English",
    price: 399,
    isbn: "978-8185986173",
    rating: 4.9,
    reviewsCount: "22.4k",
    publishYear: 1943,
    pages: 260,
    editorPick: true,
    tagline: "The Timeless Charm of India's Most Beloved Town",
    synopsis: "Thirty-two warm, humorous vignettes exploring the everyday eccentricities, dreams, and ironies of ordinary residents living in fictional Malgudi.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    badge: "Essential Classic",
    status: "Published",
    lastEdited: "Oct 28, 2025",
    submittedDate: "Oct 10, 2025",
    editorialNotes: "World-renowned gentle irony and human observation."
  },
  {
    id: "the-guide",
    title: "The Guide",
    subtitle: "From Tour Guide to Accidental Saint",
    author: "R.K. Narayan",
    authorId: "rk-narayan",
    genre: "Fiction",
    language: "English",
    price: 350,
    isbn: "978-8185986005",
    rating: 4.8,
    reviewsCount: "16.8k",
    publishYear: 1958,
    pages: 220,
    editorPick: false,
    tagline: "Sahitya Akademi Award Winning Masterpiece",
    synopsis: "Raju, a charming and corrupt tour guide in Malgudi, undergoes a dramatic transformation into a revered holy man during a devastating drought.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    badge: "Literary Classic",
    status: "Published",
    lastEdited: "Nov 14, 2025",
    submittedDate: "Oct 29, 2025",
    editorialNotes: "Profound philosophical exploration of identity and expectation."
  },
  {
    id: "swami-and-friends",
    title: "Swami and Friends",
    subtitle: "Childhood Adventures in Malgudi",
    author: "R.K. Narayan",
    authorId: "rk-narayan",
    genre: "Fiction",
    language: "English",
    price: 299,
    isbn: "978-8185986012",
    rating: 4.8,
    reviewsCount: "19.5k",
    publishYear: 1935,
    pages: 190,
    editorPick: false,
    tagline: "The Unforgettable Joy and Mischief of Youth",
    synopsis: "Ten-year-old Swaminathan navigates colonial schoolmasters, cricket rivalries, and childhood friendships against the backdrop of 1930s British India.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    badge: "Youth Classic",
    status: "Published",
    lastEdited: "Dec 03, 2025",
    submittedDate: "Nov 15, 2025",
    editorialNotes: "Delightful debut novel inaugurating the Malgudi universe."
  },
  {
    id: "the-room-on-the-roof",
    title: "The Room on the Roof",
    subtitle: "An Indian Himalayan Coming-of-Age",
    author: "Ruskin Bond",
    authorId: "ruskin-bond",
    genre: "Fiction",
    language: "English",
    price: 320,
    isbn: "978-0140103663",
    rating: 4.8,
    reviewsCount: "14.1k",
    publishYear: 1956,
    pages: 180,
    editorPick: false,
    tagline: "John Llewellyn Rhys Prize Winning Debut",
    synopsis: "Rusty, an orphaned Anglo-Indian boy, runs away from his strict guardian in Dehradun and discovers warmth, Holi festivities, and lifelong camaraderie.",
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80",
    badge: "Himalayan Classic",
    status: "Published",
    lastEdited: "Sep 08, 2025",
    submittedDate: "Aug 19, 2025",
    editorialNotes: "Lyrical and heartfelt coming-of-age portrait."
  },
  {
    id: "the-blue-umbrella",
    title: "The Blue Umbrella",
    subtitle: "A Tale of Innocence and Forgiveness",
    author: "Ruskin Bond",
    authorId: "ruskin-bond",
    genre: "Fiction",
    language: "English",
    price: 250,
    isbn: "978-8171673407",
    rating: 4.8,
    reviewsCount: "18.3k",
    publishYear: 1980,
    pages: 110,
    editorPick: false,
    tagline: "A Gentle Mountain Story of Kindness",
    synopsis: "In a quiet Garhwal village, young Binya trades her lucky leopard-claw pendant for a dazzling blue umbrella, sparking envy and redemption in the community.",
    coverUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=800&q=80",
    badge: "Modern Fable",
    status: "Published",
    lastEdited: "Aug 29, 2025",
    submittedDate: "Aug 10, 2025",
    editorialNotes: "Short, luminous moral tale."
  },
  {
    id: "god-of-small-things",
    title: "The God of Small Things",
    subtitle: "A Novel of Caste, Family, and Memory in Kerala",
    author: "Arundhati Roy",
    authorId: "arundhati-roy",
    genre: "Literary Fiction",
    language: "English",
    price: 499,
    isbn: "978-0812979657",
    rating: 4.8,
    reviewsCount: "26.4k",
    publishYear: 1997,
    pages: 340,
    editorPick: true,
    tagline: "Man Booker Prize-Winning Masterpiece",
    synopsis: "Set in lush Ayemenem, Kerala, fraternal twins Rahel and Estha navigate family secrets, love laws, and social boundaries that dictate who should be loved and how.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    badge: "Booker Prize Winner",
    status: "Published",
    lastEdited: "Nov 15, 2025",
    submittedDate: "Oct 22, 2025",
    editorialNotes: "Celebrated Booker Prize winning novel."
  },
  {
    id: "five-point-someone",
    title: "Five Point Someone",
    subtitle: "What Not to Do at IIT",
    author: "Chetan Bhagat",
    authorId: "chetan-bhagat",
    genre: "Fiction",
    language: "English",
    price: 295,
    isbn: "978-8129104595",
    rating: 4.6,
    reviewsCount: "35.8k",
    publishYear: 2004,
    pages: 270,
    editorPick: false,
    tagline: "The Campus Sensation That Inspired 3 Idiots",
    synopsis: "Three friends at IIT struggle to cope with rigorous grading systems, strict professors, and impossible expectations while finding love and meaning.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    status: "Published",
    lastEdited: "Oct 19, 2025",
    submittedDate: "Oct 01, 2025",
    editorialNotes: "High-engagement popular campus narrative."
  },
  {
    id: "immortals-meluha",
    title: "The Immortals of Meluha",
    subtitle: "Shiva Trilogy — Book 1",
    author: "Amish Tripathi",
    authorId: "amish-tripathi",
    genre: "Mythology / Fiction",
    language: "English",
    price: 395,
    isbn: "978-9380658742",
    rating: 4.7,
    reviewsCount: "31.8k",
    publishYear: 2010,
    pages: 390,
    editorPick: false,
    tagline: "The Legend of the Neelkanth Begins",
    synopsis: "1900 BC. In ancient Meluha, a Tibetan tribal leader named Shiva arrives, fulfilling an ancient prophecy and confronting dark forces threatening the empire.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    badge: "Mythic Saga",
    status: "Published",
    lastEdited: "Dec 05, 2025",
    submittedDate: "Nov 18, 2025",
    editorialNotes: "High-paced mythological adventure."
  },
  {
    id: "wise-and-otherwise",
    title: "Wise and Otherwise",
    subtitle: "A Salute to Life and Human Nature",
    author: "Sudha Murty",
    authorId: "sudha-murty",
    genre: "Essays",
    language: "English",
    price: 299,
    isbn: "978-0143062226",
    rating: 4.9,
    reviewsCount: "21.7k",
    publishYear: 2002,
    pages: 230,
    editorPick: false,
    tagline: "Touching True Accounts from Rural and Urban India",
    synopsis: "Fifty insightful non-fiction vignettes documenting Sudha Murty's encounters with courage, deceit, generosity, and resilience across the Indian subcontinent.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    badge: "Inspirational",
    status: "Published",
    lastEdited: "Nov 28, 2025",
    submittedDate: "Nov 10, 2025",
    editorialNotes: "Authentic, heartwarming moral essays."
  },
  {
    id: "three-thousand-stitches",
    title: "Three Thousand Stitches",
    subtitle: "Ordinary People, Extraordinary Lives",
    author: "Sudha Murty",
    authorId: "sudha-murty",
    genre: "Biography / Essays",
    language: "English",
    price: 320,
    isbn: "978-0143440055",
    rating: 4.9,
    reviewsCount: "17.9k",
    publishYear: 2017,
    pages: 250,
    editorPick: false,
    tagline: "Candid Memoirs of Philanthropy and Social Empowerment",
    synopsis: "Eleven deeply personal essays recounting Murty's mission to rehabilitate thousands of women, her engineering college days as the sole female student, and life lessons.",
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80",
    badge: "Memoir Landmark",
    status: "Published",
    lastEdited: "Dec 16, 2025",
    submittedDate: "Dec 01, 2025",
    editorialNotes: "Inspiring memoir on grassroots empowerment."
  },
  {
    id: "myth-mithya",
    title: "Myth = Mithya",
    subtitle: "Decoding Hindu Mythology",
    author: "Devdutt Pattanaik",
    authorId: "devdutt-pattanaik",
    genre: "Mythology",
    language: "English",
    price: 399,
    isbn: "978-0143065111",
    rating: 4.7,
    reviewsCount: "12.6k",
    publishYear: 2006,
    pages: 260,
    editorPick: false,
    tagline: "A Visual and Philosophical Guide to Sacred Lore",
    synopsis: "An illuminating compendium unraveling Hindu deities, cosmic cycles, and sacred symbols through lucid explanations and original line illustrations.",
    coverUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80",
    badge: "Cultural Analysis",
    status: "Published",
    lastEdited: "Jan 05, 2026",
    submittedDate: "Dec 20, 2025",
    editorialNotes: "Brilliant visual and thematic breakdown of ancient lore."
  },
  {
    id: "a-suitable-boy",
    title: "A Suitable Boy",
    subtitle: "A Panoramic Masterpiece of Post-Independence India",
    author: "Vikram Seth",
    authorId: "vikram-seth",
    genre: "Fiction",
    language: "English",
    price: 1199,
    isbn: "978-0140230215",
    rating: 4.8,
    reviewsCount: "15.4k",
    publishYear: 1993,
    pages: 1350,
    editorPick: false,
    tagline: "One of the Longest and Most Rewarding English Novels",
    synopsis: "Set in early 1950s India, this panoramic epic follows Lata Mehra's mother searching for a suitable groom, intertwining four extended families in national transition.",
    coverUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=800&q=80",
    badge: "Epic Fiction",
    status: "Published",
    lastEdited: "Nov 10, 2025",
    submittedDate: "Oct 25, 2025",
    editorialNotes: "Peerless panorama of familial and national drama."
  },
  {
    id: "train-to-pakistan",
    title: "Train to Pakistan",
    subtitle: "A Harrowing Tale of Partition and Humanity",
    author: "Khushwant Singh",
    authorId: "khushwant-singh",
    genre: "Historical Fiction",
    language: "English",
    price: 350,
    isbn: "978-0143065883",
    rating: 4.8,
    reviewsCount: "18.2k",
    publishYear: 1956,
    pages: 200,
    editorPick: false,
    tagline: "A Shattering Historical Novel of the 1947 Border",
    synopsis: "In the peaceful border village of Mano Majra, Sikhs and Muslims live side-by-side until a ghost train carrying corpses arrives, fracturing community bonds.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    badge: "Partition Classic",
    status: "Published",
    lastEdited: "Oct 15, 2025",
    submittedDate: "Sep 28, 2025",
    editorialNotes: "Uncompromising historical honesty and human tragedy."
  },
  {
    id: "gitanjali",
    title: "Gitanjali",
    subtitle: "Song Offerings — Nobel Prize Collection",
    author: "Rabindranath Tagore",
    authorId: "rabindranath-tagore",
    genre: "Poetry",
    language: "English/Bengali",
    price: 380,
    isbn: "978-0486414171",
    rating: 4.9,
    reviewsCount: "28.3k",
    publishYear: 1910,
    pages: 140,
    editorPick: false,
    tagline: "Nobel Prize in Literature 1913 Winning Masterpiece",
    synopsis: "A mystical anthology of 103 prose poems expressing profound spiritual devotion, unity with nature, and the sublime intimacy of human existence.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    badge: "Nobel Prize Masterpiece",
    status: "Published",
    lastEdited: "Aug 18, 2025",
    submittedDate: "Aug 05, 2025",
    editorialNotes: "Transcendental lyricism of global stature."
  },

  // ── GLOBAL CLASSICS & NON-FICTION (15) ──
  {
    id: "1984",
    title: "1984",
    subtitle: "The Definitive Dystopian Prophecy",
    author: "George Orwell",
    authorId: "george-orwell",
    genre: "Dystopian",
    language: "English",
    price: 450,
    isbn: "978-0451524935",
    rating: 4.9,
    reviewsCount: "48.9k",
    publishYear: 1949,
    pages: 328,
    editorPick: true,
    tagline: "Big Brother is Watching You",
    synopsis: "Winston Smith lives under the oppressive surveillance of the Party in Oceania. His quiet rebellion against totalitarian control exposes the terrifying power of doublespeak.",
    coverUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    badge: "Dystopian Icon",
    status: "Published",
    lastEdited: "Jan 15, 2026",
    submittedDate: "Dec 12, 2025",
    editorialNotes: "Prophetic exploration of totalitarian mind-control."
  },
  {
    id: "animal-farm",
    title: "Animal Farm",
    subtitle: "A Fairy Story of Revolution and Betrayal",
    author: "George Orwell",
    authorId: "george-orwell",
    genre: "Political Fiction",
    language: "English",
    price: 350,
    isbn: "978-0451526342",
    rating: 4.8,
    reviewsCount: "39.2k",
    publishYear: 1945,
    pages: 140,
    editorPick: false,
    tagline: "All Animals Are Equal, But Some Are More Equal Than Others",
    synopsis: "A brilliant allegorical fable in which farm animals overthrow their human master, only to see a ruthless totalitarian hierarchy emerge from their own ranks.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    badge: "Allegorical Classic",
    status: "Published",
    lastEdited: "Dec 20, 2025",
    submittedDate: "Dec 05, 2025",
    editorialNotes: "Timeless political satire on corrupted ideals."
  },
  {
    id: "harry-potter-philosophers-stone",
    title: "Harry Potter and the Philosopher's Stone",
    subtitle: "Book I of the Hogwarts Saga",
    author: "J.K. Rowling",
    authorId: "jk-rowling",
    genre: "Fantasy",
    language: "English",
    price: 599,
    isbn: "978-0747532699",
    rating: 4.9,
    reviewsCount: "62.4k",
    publishYear: 1997,
    pages: 352,
    editorPick: false,
    tagline: "Let the Magic Begin",
    synopsis: "An orphaned boy discovers on his eleventh birthday that he is a wizard with a great destiny, entering the enchanted world of Hogwarts School of Witchcraft and Wizardry.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80",
    badge: "Fantasy Phenomenon",
    status: "Published",
    lastEdited: "Jan 08, 2026",
    submittedDate: "Dec 18, 2025",
    editorialNotes: "Modern classic that defined world children's literature."
  },
  {
    id: "the-lord-of-the-rings",
    title: "The Lord of the Rings",
    subtitle: "The Complete High Fantasy Legendarium",
    author: "J.R.R. Tolkien",
    authorId: "jrr-tolkien",
    genre: "Fantasy",
    language: "English",
    price: 1299,
    isbn: "978-0618640157",
    rating: 4.9,
    reviewsCount: "54.1k",
    publishYear: 1954,
    pages: 1178,
    editorPick: false,
    tagline: "One Ring to Rule Them All",
    synopsis: "Frodo Baggins undertakes a perilous quest across Middle-earth to destroy the One Ring in the fires of Mount Doom before the Dark Lord Sauron conquers all.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "High Fantasy Masterpiece",
    status: "Published",
    lastEdited: "Nov 22, 2025",
    submittedDate: "Nov 01, 2025",
    editorialNotes: "Unrivaled high fantasy myth-making."
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    subtitle: "The American Dream in the Roaring Twenties",
    author: "F. Scott Fitzgerald",
    authorId: "f-scott-fitzgerald",
    genre: "Classic",
    language: "English",
    price: 399,
    isbn: "978-0743273565",
    rating: 4.7,
    reviewsCount: "36.8k",
    publishYear: 1925,
    pages: 180,
    editorPick: false,
    tagline: "So We Beat On, Boats Against the Current",
    synopsis: "Mysterious millionaire Jay Gatsby orchestrates extravagant Long Island parties in an obsessive pursuit of his lost love, Daisy Buchanan, during the Jazz Age.",
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80",
    badge: "American Classic",
    status: "Published",
    lastEdited: "Oct 14, 2025",
    submittedDate: "Sep 30, 2025",
    editorialNotes: "Luminous critique of wealth, obsession, and disillusionment."
  },
  {
    id: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    subtitle: "A Timeless Lesson in Conscience and Courage",
    author: "Harper Lee",
    authorId: "harper-lee",
    genre: "Classic",
    language: "English",
    price: 450,
    isbn: "978-0060935467",
    rating: 4.9,
    reviewsCount: "44.5k",
    publishYear: 1960,
    pages: 336,
    editorPick: false,
    tagline: "The Pulitzer Prize-Winning Story of Justice and Empathy",
    synopsis: "In 1930s Alabama, young Scout Finch witnesses her father Atticus defend an innocent Black man falsely accused of a crime, confronting prejudice with moral resolve.",
    coverUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    badge: "Pulitzer Laureate",
    status: "Published",
    lastEdited: "Jan 02, 2026",
    submittedDate: "Dec 15, 2025",
    editorialNotes: "Unshakable moral clarity and unforgettable characters."
  },
  {
    id: "pride-and-prejudice",
    title: "Pride and Prejudice",
    subtitle: "The Masterpiece of Regency Romance and Wit",
    author: "Jane Austen",
    authorId: "jane-austen",
    genre: "Romance / Classic",
    language: "English",
    price: 420,
    isbn: "978-0141439518",
    rating: 4.9,
    reviewsCount: "51.3k",
    publishYear: 1813,
    pages: 432,
    editorPick: false,
    tagline: "A Truth Universally Acknowledged",
    synopsis: "Spirited Elizabeth Bennet and haughty Mr. Darcy clash over class distinctions and first impressions in a witty romantic duel of Regency society.",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    badge: "Romantic Icon",
    status: "Published",
    lastEdited: "Nov 30, 2025",
    submittedDate: "Nov 12, 2025",
    editorialNotes: "Sparkling social satire and peerless dialogue."
  },
  {
    id: "war-and-peace",
    title: "War and Peace",
    subtitle: "The Monumental Russian Epic",
    author: "Leo Tolstoy",
    authorId: "leo-tolstoy",
    genre: "Classic",
    language: "English",
    price: 950,
    isbn: "978-1400079988",
    rating: 4.8,
    reviewsCount: "29.7k",
    publishYear: 1869,
    pages: 1225,
    editorPick: false,
    tagline: "The Complete Canvas of Human Destiny and War",
    synopsis: "Tolstoy weaves the lives of five aristocratic Russian families through Napoleon's 1812 invasion, offering a staggering philosophical inquiry into historical forces and human soul.",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80",
    badge: "Literary Titan",
    status: "Published",
    lastEdited: "Dec 28, 2025",
    submittedDate: "Dec 08, 2025",
    editorialNotes: "Unrivaled epic breadth and psychological realism."
  },
  {
    id: "the-alchemist",
    title: "The Alchemist",
    subtitle: "A Fable About Following Your Dream",
    author: "Paulo Coelho",
    authorId: "paulo-coelho",
    genre: "Fiction",
    language: "English",
    price: 399,
    isbn: "978-0062315007",
    rating: 4.7,
    reviewsCount: "58.6k",
    publishYear: 1988,
    pages: 208,
    editorPick: false,
    tagline: "When You Want Something, All the Universe Conspires to Help You",
    synopsis: "Santiago, an Andalusian shepherd boy, journeys across the Egyptian desert in search of treasure buried near the Pyramids, discovering wisdom and destiny.",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    badge: "International Bestseller",
    status: "Published",
    lastEdited: "Jan 22, 2026",
    submittedDate: "Jan 05, 2026",
    editorialNotes: "Inspiring allegorical fable on destiny and faith."
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    subtitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    author: "James Clear",
    authorId: "james-clear",
    genre: "Self-Help",
    language: "English",
    price: 550,
    isbn: "978-0735211292",
    rating: 4.9,
    reviewsCount: "42.1k",
    publishYear: 2018,
    pages: 320,
    editorPick: true,
    tagline: "Tiny Changes, Remarkable Results",
    synopsis: "No matter your goals, Atomic Habits offers a proven framework for improving every day through compounding 1% micro-habits.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    badge: "Essential Read",
    status: "Published",
    lastEdited: "Oct 10, 2025",
    submittedDate: "Sep 20, 2025",
    editorialNotes: "Approved for catalog publication."
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    subtitle: "Timeless Lessons on Wealth, Greed, and Happiness",
    author: "Morgan Housel",
    authorId: "morgan-housel",
    genre: "Finance",
    language: "English",
    price: 499,
    isbn: "978-0857197689",
    rating: 4.8,
    reviewsCount: "28.4k",
    publishYear: 2020,
    pages: 252,
    editorPick: true,
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
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    subtitle: "What the Rich Teach Their Kids About Money",
    author: "Robert Kiyosaki",
    authorId: "robert-kiyosaki",
    genre: "Finance",
    language: "English",
    price: 380,
    isbn: "978-1612680194",
    rating: 4.7,
    reviewsCount: "38.9k",
    publishYear: 1997,
    pages: 336,
    editorPick: false,
    tagline: "Financial Literacy & Cash Flow Mindset",
    synopsis: "Explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    badge: "Financial Classic",
    status: "Published",
    lastEdited: "Oct 01, 2025",
    submittedDate: "Sep 15, 2025",
    editorialNotes: "Foundational financial mindset text."
  },
  {
    id: "a-brief-history-of-time",
    title: "A Brief History of Time",
    subtitle: "From the Big Bang to Black Holes",
    author: "Stephen Hawking",
    authorId: "stephen-hawking",
    genre: "Science",
    language: "English",
    price: 499,
    isbn: "978-0553380163",
    rating: 4.9,
    reviewsCount: "31.2k",
    publishYear: 1988,
    pages: 256,
    editorPick: false,
    tagline: "A Masterpiece of Popular Cosmology and Physics",
    synopsis: "Stephen Hawking explores fundamental questions about the cosmos: where did the universe begin, can time run backward, and what secrets lie inside black holes?",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    badge: "Science Landmark",
    status: "Published",
    lastEdited: "Nov 12, 2025",
    submittedDate: "Oct 24, 2025",
    editorialNotes: "Pioneering cosmology accessible to all readers."
  },
  {
    id: "sapiens",
    title: "Sapiens",
    subtitle: "A Brief History of Humankind",
    author: "Yuval Noah Harari",
    authorId: "yuval-harari",
    genre: "History",
    language: "English",
    price: 599,
    isbn: "978-0062316097",
    rating: 4.7,
    reviewsCount: "35.2k",
    publishYear: 2011,
    pages: 498,
    editorPick: false,
    tagline: "From the Cognitive Revolution to AI",
    synopsis: "Yuval Noah Harari traces the arc of human history from the Stone Age to the Silicon Age, examining how Homo sapiens came to dominate the planet through shared fictions.",
    coverUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80",
    badge: "Landmark Work",
    status: "Published",
    lastEdited: "Dec 14, 2025",
    submittedDate: "Dec 01, 2025",
    editorialNotes: "Approved for full catalog publication."
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    subtitle: "The Two Systems That Drive the Way We Think",
    author: "Daniel Kahneman",
    authorId: "daniel-kahneman",
    genre: "Psychology",
    language: "English",
    price: 599,
    isbn: "978-0374533557",
    rating: 4.8,
    reviewsCount: "27.8k",
    publishYear: 2011,
    pages: 512,
    editorPick: false,
    tagline: "Nobel Laureate's Tour Through Human Decision-Making",
    synopsis: "Kahneman explains the two modes of thinking: System 1 (fast, emotional) and System 2 (slower, deliberate), exploring the cognitive biases that govern our choices.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
    badge: "Behavioral Science Icon",
    status: "Published",
    lastEdited: "Jan 16, 2026",
    submittedDate: "Dec 22, 2025",
    editorialNotes: "Foundational text on cognitive psychology."
  }
];

const REVIEWS_DATA = [
  { id: "r1", bookId: "ps-vol1", reviewer: "Priya Subramanian", rating: 5, date: "Jan 2026", text: "An absolute masterpiece of Tamil literature. Kalki's prose transports you to the Chola courts with such vividity that you can hear the waves crashing at Nagapattinam." },
  { id: "r2", bookId: "ps-vol1", reviewer: "Arvind Raghavan", rating: 5, date: "Nov 2025", text: "I read the original Tamil and this translation captures the grandeur beautifully. The political intrigue rivals Game of Thrones." },
  { id: "r4", bookId: "psychology-of-money", reviewer: "Rohan Mehta", rating: 5, date: "Mar 2026", text: "This book changed how I think about wealth entirely. Housel's storytelling approach makes complex behavioral concepts feel like bedtime stories." },
  { id: "r7", bookId: "atomic-habits", reviewer: "Ananya Sharma", rating: 5, date: "Apr 2026", text: "The habit stacking concept alone transformed my morning routine. Clear writes with scientific precision but a personal warmth." },
  { id: "r10", bookId: "malgudi-days", reviewer: "Suresh Nair", rating: 5, date: "Feb 2026", text: "R.K. Narayan's gentle warmth shines through every page. Reading Swami and his friends takes me right back to lazy school afternoons." }
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
    const slugify = require('../utils/slugify');
    const authorMap = {}; // legacyId -> Author _id
    for (const aData of AUTHORS_DATA) {
      const aSlug = aData.id || slugify(aData.name);
      const { books: _bks, ...authorPayload } = aData;
      const authorDoc = await Author.create({
        ...authorPayload,
        slug: aSlug,
        legacyId: aData.id,
        genres: [aData.role ? aData.role.replace(/Icon|Writer|Novelist|Scientist|Professor|Essayist|Intellectual|Laureate|Bard|Pioneer|Creator|Strategist|Educator|Thinker/gi, '').trim() : 'Literature'],
        socialLinks: { twitter: aData.handle || '@author', website: 'https://bookverse.studio' },
        userId: aData.id === 'kalki-krishnamurthy' ? authorUser._id : null
      });
      authorMap[aData.id] = authorDoc._id;
    }
    console.log('[Seed] Inserted Authors.');

    // 5. Seed Books
    const bookMap = {}; // legacyId -> Book _id
    let bIdx = 1;
    for (const bData of BOOKS_DATA) {
      const authorObjId = authorMap[bData.authorId] || authorMap['kalki-krishnamurthy'];
      const bSlug = bData.id || slugify(bData.title);
      const seqStr = String(bIdx).padStart(6, '0');
      const bookDoc = await Book.create({
        ...bData,
        slug: bSlug,
        bookCode: `BVS-${bData.publishYear || 2026}-${seqStr}`,
        legacyId: bData.id,
        authorId: authorObjId,
        publisherId: publisherUser._id
      });
      bookMap[bData.id] = bookDoc._id;
      bIdx++;
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
    const psychId = bookMap['psychology-of-money'];
    const malgudiId = bookMap['malgudi-days'];
    const habitsId = bookMap['atomic-habits'];

    if (psVol1Id && psychId && malgudiId) {
      readerUser.wishlistBookIds = habitsId ? [habitsId] : [psychId];
      readerUser.library = [
        {
          bookId: psVol1Id,
          progress: 35,
          currentPage: 189,
          totalPages: 540,
          status: 'Currently Reading',
          lastRead: 'Yesterday'
        },
        {
          bookId: psychId,
          progress: 100,
          currentPage: 252,
          totalPages: 252,
          status: 'Completed',
          lastRead: '2 weeks ago'
        },
        {
          bookId: malgudiId,
          progress: 55,
          currentPage: 143,
          totalPages: 260,
          status: 'Currently Reading',
          lastRead: '3 days ago'
        }
      ];
      await readerUser.save();
    }

    console.log('==========================================================');
    console.log('✅ BookVerse Studio Database Seeded Successfully!');
    console.log(`   Categories: ${CATEGORIES_DATA.length}`);
    console.log(`   Authors:    ${AUTHORS_DATA.length}`);
    console.log(`   Books:      ${BOOKS_DATA.length} (${BOOKS_DATA.filter(b=>b.status==='Published').length} Published)`);
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
