# BookVerse Studio — Backend REST API

Production-ready Express & MongoDB REST API for **BookVerse Studio**, powering public readers, Writing Studio (authors), Editorial Workspace (publishers), and system administration.

---

## 🚀 Tech Stack

- **Runtime**: Node.js (LTS) + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT (Bearer Authorization Header) + bcryptjs
- **Uploads**: Multer (Local `/uploads/covers` and `/uploads/manuscripts`)
- **Logging**: Morgan
- **Validation**: express-validator & async wrappers

---

## 🛠️ Setup & Local Installation

### 1. Environment Configuration
Ensure `.env` file exists inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookverse_studio
JWT_SECRET=bookverse_studio_jwt_secret_key_2026_production
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Seed Database
Wipes and populates the database with realistic BookVerse catalog data and 4 default role accounts:

```bash
npm run seed
```

#### Seed Account Credentials:
| Role | Email | Password | Access Level |
|---|---|---|---|
| **Reader** | `ananya@bookverse.in` | `password123` | Shelf, Wishlist, Bookmarks, Reviews |
| **Author** | `kalki@bookverse.in` | `password123` | Writing Studio, Books, Analytics, Profile |
| **Publisher** | `editor@bookverse.studio` | `password123` | Editorial Workspace, Review Queue, Approval |
| **Admin** | `admin@bookverse.studio` | `password123` | Full System Administration |

---

## 📡 API Endpoints Reference

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a reader or author account
- `POST /api/auth/login` — Login user (returns JWT token and user profile)
- `GET /api/auth/me` — *(Protected)* Get current logged-in user profile

### 2. Public Catalog (`/api/books`, `/api/authors`, `/api/categories`)
- `GET /api/books` — Get published books (supports `?genre=`, `?language=`, `?search=`, `?sort=`, `?page=`, `?limit=`)
- `GET /api/books/:id` — Get published book details by ID
- `GET /api/books/:bookId/reviews` — Get reader reviews for a book
- `GET /api/authors` — Get public author directory
- `GET /api/authors/:id` — Get author profile and published bibliography
- `GET /api/categories` — Get catalog genre categories

### 3. Reader Portal (`/api/reader`) *(Protected: reader, author, publisher, admin)*
- `GET /api/reader/library` — Get reader personal shelf
- `POST /api/reader/library/:bookId` — Toggle add/remove book in personal shelf
- `GET /api/reader/wishlist` — Get reader wishlist
- `POST /api/reader/wishlist/:bookId` — Toggle add/remove book in wishlist
- `GET /api/reader/bookmarks` — Get saved bookmarks
- `POST /api/reader/bookmarks` — Add new reading bookmark
- `DELETE /api/reader/bookmarks/:id` — Delete bookmark
- `GET /api/reader/reviews` — Get reviews written by current reader
- `POST /api/reader/reviews` — Submit review for a book (enforces 1 review per user/book)
- `DELETE /api/reader/reviews/:id` — Delete reader review
- `PUT /api/reader/profile` — Update reader profile details

### 4. Author Writing Studio (`/api/studio`) *(Protected: author)*
- `GET /api/studio/books` — Get books written by current author
- `POST /api/studio/books` — Create new manuscript draft *(Supports multipart `coverImage` & `manuscriptFile`)*
- `PUT /api/studio/books/:id` — Edit book metadata *(Allowed for Draft or In Review status)*
- `DELETE /api/studio/books/:id` — Delete manuscript draft
- `POST /api/studio/books/:id/submit` — Submit draft for publisher review (`Draft` → `In Review`)
- `GET /api/studio/analytics` — Get readership analytics and monthly trends
- `PUT /api/studio/profile` — Update author public bio and social links

### 5. Publisher Editorial Workspace (`/api/editorial`) *(Protected: publisher)*
- `GET /api/editorial/queue` — Get review queue (`In Review` or `Rejected` titles)
- `GET /api/editorial/books/:id` — Get submission details for review
- `PUT /api/editorial/books/:id/approve` — Approve submission (`In Review` → `Published`, stamps editorial notes)
- `PUT /api/editorial/books/:id/reject` — Reject submission (`In Review` → `Rejected`, stamps editorial notes)
- `PUT /api/editorial/books/:id/request-changes` — Request changes (`In Review` → `In Review`, stamps editorial notes)
- `GET /api/editorial/authors` — Get all authors in catalog
- `GET /api/editorial/books` — Get full catalog books (filterable by status)
- `GET /api/editorial/categories` — Get editorial categories
- `POST /api/editorial/categories` — Create category
- `DELETE /api/editorial/categories/:id` — Delete category
- `GET /api/editorial/reports` — Get summary reporting metrics

### 6. Admin Control (`/api/admin`) *(Protected: admin)*
- `GET /api/admin/stats` — High-level system statistics
- `GET /api/admin/books` — Manage all catalog books
- `GET /api/admin/authors` — Manage all author accounts
- `GET /api/admin/users` — Manage all user accounts
- `DELETE /api/admin/users/:id` — Delete user account
- `GET /api/admin/categories` — Manage categories
- `GET /api/admin/reports` — Detailed analytical reports

---

## 📦 Consistent API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Published books fetched successfully",
  "data": [ ... ],
  "total": 12,
  "page": 1,
  "pages": 1
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Book not found",
  "statusCode": 404
}
```
