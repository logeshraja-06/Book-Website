# BookVerse Studio

> **BookVerse Studio** — a premium digital publishing platform where Readers, Authors, Publishers, and Admins operate inside one ecosystem.

---

## 📖 About the Project

**BookVerse Studio** is a frontend-only V1 application designed to demonstrate production-grade UI/UX craft, architectural state management, and responsive editorial typography. Built with a calm, magazine-spread visual language inspired by the design precision of Apple, Stripe, Linear, Notion, and Medium, BookVerse Studio avoids generic e-commerce and admin templates in favor of a bespoke, editorial aesthetic.

While this version operates on centralized mock state (with live in-memory updates across modules), every layout, interaction, and responsive breakpoint has been crafted to simulate a live, real-world digital publishing software product.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (JavaScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Physics**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏛️ Module Architecture & Routes

BookVerse Studio is divided into five distinct modules, each tailored to a specific user persona:

### 1. Public Website
The discovery portal for readers to browse curated works, explore author bibliographies, and inspect literary categories.
- `/` — Editorial Hero, Spotlight Book, Featured Strip, Author Highlights
- `/books` — Minimalist filter/sort bar, search, card-based book catalog
- `/books/:id` — Asymmetric editorial spread, 3D parallax cover, reader actions, reviews
- `/authors` — Directory of registered authors and contributors
- `/authors/:id` — Author profile, biography essay, and bibliography shelf
- `/categories` — Genre taxonomy and category cards
- `/about` — Platform philosophy and publishing manifesto
- `/contact` — Reader and author query form

### 2. Reader Module (`/library`)
A personal, calm "reading shelf" experience focused on reader progress and bookmarked titles.
- `/library` — My Library bookshelf with accent reading-progress indicators
- `/library/wishlist` — Someday shelf for saved titles
- `/library/bookmarks` — Bookmarked passages and highlights
- `/library/reviews` — Reader review history and community voices
- `/library/profile` — Reader preferences and reading statistics

### 3. Author Module — *Writing Studio* (`/studio`)
A focused, distraction-free creative workspace for authors to manage, draft, and publish their own manuscripts.
- `/studio` — Writing Studio home, active draft prompt, manuscript catalog
- `/studio/books` — Editorial list of published, in-review, and draft works
- `/studio/create` — 3-Step manuscript creator wizard (Metadata, 3D Cover Physics, Final Preview)
- `/studio/analytics` — Readership growth trajectory and engagement metrics
- `/studio/profile` — Author profile, studio handle, and DRM-free status

### 4. Publisher Module — *Editorial Workspace* (`/editorial`)
An authoritative review tool for independent publisher editors to assess submitted manuscripts and authorize catalog placement.
- `/editorial` — Editorial Workspace overview, review metrics, queue preview
- `/editorial/queue` — Full submission queue of pending and assessed works
- `/editorial/review/:id` — Split-screen manuscript statement & editorial assessment notes panel

### 5. Admin Module (`/admin`)
A high-density yet quiet system overview for superadmins to manage platform health and catalog taxonomy.
- `/admin` — Typographic platform statistics and recent manuscript activity
- `/admin/books` — Catalog index table with live status toggles and removal actions
- `/admin/authors` — Registered author directory
- `/admin/users` — Reader account directory
- `/admin/categories` — Genre taxonomy configuration
- `/admin/reports` — Catalog distribution and genre breakdown reports

---

## 🎨 Design System

BookVerse Studio strictly enforces a curated, high-craft color palette and motion vocabulary:

### Color Palette

| Token | Hex Code | Usage |
|---|---|---|
| `background` | `#FAF8F6` | Primary page background |
| `secondary` | `#F4EEEA` | Secondary section background & input fill |
| `card` | `#FFFFFF` | Surface cards & containers |
| `text-primary` | `#2B2B2B` | Primary typography & headlines |
| `text-secondary` | `#6E6A67` | Sub-headlines, metadata, & secondary body copy |
| `border` | `#E7D9D3` | Divider lines & container borders |
| `accent` | `#D3968C` | Primary CTAs, active nav underlines, star highlights |
| `accent-hover` | `#C98579` | Interactive hover states |
| `accent-light` | `#E8C8C2` | Subtle badge fills & progress line highlights |

### Motion & Typography Philosophy
- **Typography**: Editorial serif (`Fraunces`) for headlines; clean sans-serif (`Inter`) & monospace for UI metrics and metadata.
- **Animations**: Soft blur reveals, scroll-triggered parallax, 3D perspective book-tilt hover physics (`rotateX/Y` max 16deg).
- **Timing**: 300ms–800ms ease-out transitions. Zero flash, bounce, or neon/glow effects.

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `pnpm`

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bookverse-studio.git

# 2. Navigate to the project directory
cd bookverse-studio

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
# Build the production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📸 Screenshots

> *Replace placeholder paths below with actual application screenshots.*

| Page / Module | Preview |
|---|---|
| **Home Page** | `![Home Page](./screenshots/home.png)` |
| **Books Listing** | `![Books Listing](./screenshots/books-listing.png)` |
| **Book Details** | `![Book Details](./screenshots/book-details.png)` |
| **Writing Studio** | `![Writing Studio](./screenshots/writing-studio.png)` |
| **Editorial Workspace** | `![Editorial Workspace](./screenshots/editorial-workspace.png)` |
| **Admin Dashboard** | `![Admin Dashboard](./screenshots/admin-dashboard.png)` |

---

## 🚀 Roadmap & Deferred V2 Scope

The following features were intentionally deferred from the V1 scope to maintain a strict focus on frontend UI/UX craft:

- 💳 **Monetization & Payments**: Real payment gateway integration (Stripe / Razorpay).
- 🔒 **DRM & Encryption**: Encrypted file delivery and digital rights protection.
- 💰 **Royalty Calculations**: Automatic revenue distribution and tax withholding.
- 💬 **Messaging & Community**: Live author-reader direct messaging and forums.
- 📅 **Events & Tour**: Virtual book launches, live Q&As, and tour scheduling.
- 🎙️ **Audio & Podcasts**: Built-in audiobook player and podcast hosting.
- ☁️ **Cloud Storage**: AWS S3 / Cloudflare R2 manuscript storage.
- 📊 **Advanced Analytics**: Real-time sales telemetry, cohort analysis, and heatmaps.
- 🤖 **AI Features**: AI prose editing, auto-summarization, and cover generation.
- 📜 **Version History**: Git-style revision history for manuscript drafts.
- 👥 **Live Collaboration**: Real-time multi-author co-writing (WebSocket / Yjs).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
