
# RentWise – Digital Renting System

A full-stack property rental platform built with React/TypeScript (frontend) and Spring Boot (backend). Provides role-based interfaces for **Admins**, **Property Owners**, and **Renters**.

> **Current Status**: The frontend is fully built with mock data. The backend needs to be implemented to replace all hardcoded data with real API integration.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Requirements](#backend-requirements)
- [Getting Started](#getting-started)

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool / dev server |
| Tailwind CSS | 3.4.19 | Utility-first styling |
| React Router DOM | 7.13.1 | Client-side routing |
| Lucide React | 0.577.0 | Icon library |

### Backend (To Build)
| Technology | Purpose |
|---|---|
| Spring Boot 3 | REST API framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Database ORM |
| PostgreSQL / MySQL | Relational database |
| JWT | Token-based auth |
| Maven | Build & dependency management |

---

## Frontend Architecture

### Project Structure

```
src/
├── App.tsx                    # Root component with all route definitions
├── main.tsx                   # Entry point
├── components/
│   ├── AdminLayout.tsx        # Admin sidebar + navigation
│   ├── OwnerLayout.tsx        # Owner sidebar + navigation
│   ├── RenterLayout.tsx       # Renter sidebar + navigation
│   ├── Navbar.tsx             # Public pages top navbar
│   ├── AuthGuard.tsx          # Role-based route protection
│   ├── PropertyCard.tsx       # Property listing card
│   ├── SearchFilters.tsx      # Property search/filter form
│   └── ui/                    # Reusable primitives (Button, Card, Input, Loading)
├── contexts/
│   ├── AuthContext.tsx         # Auth state, login/register/logout
│   └── ThemeContext.tsx        # Light/dark theme toggle
├── pages/
│   ├── shared/                # Public pages (Home, Login, Register, About, Contact, FAQ)
│   ├── admin/                 # Admin dashboard, users, properties, bookings, reports, settings
│   ├── owner/                 # Owner dashboard, properties CRUD, bookings, earnings, reviews
│   └── renter/                # Renter dashboard, search, bookings, favorites, payments, reviews
├── types/index.ts              # TypeScript interfaces (Property, User, Booking)
├── hooks/                      # (empty – for custom hooks)
└── utils/                      # (empty – for API client, helpers)
```

### Routing Map

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/properties` | Browse Properties | Public |
| `/properties/:id` | Property Detail | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/faq` | FAQ | Public |
| `/admin/dashboard` | Admin Dashboard | Admin only |
| `/admin/users` | User Management | Admin only |
| `/admin/properties` | Property Management | Admin only |
| `/admin/bookings` | Booking Management | Admin only |
| `/admin/reports` | Reports & Analytics | Admin only |
| `/admin/settings` | Platform Settings | Admin only |
| `/owner/dashboard` | Owner Dashboard | Owner only |
| `/owner/properties` | My Properties | Owner only |
| `/owner/add-property` | Add Property | Owner only |
| `/owner/properties/:id/edit` | Edit Property | Owner only |
| `/owner/bookings` | Owner Bookings | Owner only |
| `/owner/earnings` | Earnings Analytics | Owner only |
| `/owner/reviews` | Reviews Received | Owner only |
| `/owner/settings` | Owner Settings | Owner only |
| `/renter/dashboard` | Renter Dashboard | Renter only |
| `/renter/search` | Search Properties | Renter only |
| `/renter/bookings` | My Bookings | Renter only |
| `/renter/favorites` | Saved Properties | Renter only |
| `/renter/payments` | Payment History | Renter only |
| `/renter/reviews` | My Reviews | Renter only |
| `/renter/settings` | Renter Settings | Renter only |

### Authentication Flow (Currently Mock)

1. User submits login form → `AuthContext.login({ email, password, rememberMe })`
2. Credentials validated against hardcoded mock user list
3. Token stored: `rentwise_token` in localStorage (rememberMe) or sessionStorage
4. User object stored: `rentwise_user` (JSON)
5. On app load, checks storage for existing session
6. `AuthGuard` components redirect unauthorized users to `/login`
7. Role-based redirects after login: admin → `/admin/dashboard`, owner → `/owner/dashboard`, renter → `/renter/dashboard`

### Data Models (from `src/types/index.ts`)

```typescript
interface Property {
  id: string; title: string; description: string; price: number;
  location: string;
  category: 'house' | 'apartment' | 'car' | 'land' | 'commercial' | 'other';
  images: string[]; available: boolean;
  bookings: number; rating: number; reviews: number;
  status: 'active' | 'inactive';
  owner: { id: string; name: string; email: string; phone: string };
  createdAt: string; updatedAt: string;
}

interface User {
  id: string; name: string; email: string; phone: string;
  role: 'tenant' | 'landlord' | 'admin'; avatar?: string;
}

interface Booking {
  id: string; propertyId: string; tenantId: string;
  startDate: string; endDate: string; totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled'; createdAt: string;
}
```

### Extended User Model (from `AuthContext.tsx`)

```typescript
type UserType = 'renter' | 'owner' | 'admin'

interface AuthUser {
  id: string; email: string; firstName: string; lastName: string;
  type: UserType; avatar?: string; phone?: string;
  joinedAt: string; lastLogin?: string; isActive: boolean;
}
```

> **Note**: There is a mismatch between `types/index.ts` (role: tenant/landlord/admin) and `AuthContext.tsx` (type: renter/owner/admin). The backend should unify these into one consistent model.

### Property Categories

Properties are organized into 6 categories (replacing the old type system):

| Category | Icon | Examples |
|---|---|---|
| House | 🏠 | Family homes, villas, bungalows |
| Apartment | 🏢 | Flats, studios, penthouses |
| Car | 🚗 | Vehicles for daily/monthly rental |
| Land | 🏞️ | Plots for residential/commercial use |
| Commercial | 🏪 | Office spaces, retail shops |
| Other | 📦 | Any other rentable assets |

### Property Card Display

All property cards (owner & renter side) consistently show:
- Property name
- Location
- Price per month
- Category badge with icon
- Owner contact phone
- Number of bookings
- Rating & number of reviews

Owner cards additionally show: toggle active/inactive, edit, view, and delete actions.

### Add Property Form (Owner)

Simplified single-page form with:
1. **Category selector** — 6 icon buttons (House, Apartment, Car, Land, Commercial, Other)
2. **Property Name** — text input
3. **Location** — text input
4. **Price/month** — number input
5. **Description** — textarea (owner describes the property manually)
6. **Photos** — optional file upload

---

## Backend Requirements

### 1. Database Schema (6 Core Tables)

#### `users`
| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID / BIGINT | NOT NULL | Primary key |
| first_name | VARCHAR(100) | NOT NULL | Required |
| last_name | VARCHAR(100) | NOT NULL | Required |
| email | VARCHAR(255) | NOT NULL | Unique |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed |
| phone | VARCHAR(20) | NULL | Optional |
| role | ENUM | NOT NULL | `ADMIN`, `OWNER`, `RENTER` |
| avatar | VARCHAR(500) | NULL | URL or file path |
| bio | TEXT | NULL | Optional |
| location | VARCHAR(255) | NULL | Optional |
| company_name | VARCHAR(255) | NULL | Owner only |
| tax_id | VARCHAR(50) | NULL | Owner only |
| is_active | BOOLEAN | NOT NULL | Default true |
| is_verified | BOOLEAN | NOT NULL | Default false |
| joined_at | TIMESTAMP | NOT NULL | Auto-set on creation |
| last_login | TIMESTAMP | NULL | Updated on each login |
| created_at | TIMESTAMP | NOT NULL | Auto-set |
| updated_at | TIMESTAMP | NOT NULL | Auto-updated |

#### `properties`
| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID / BIGINT | NOT NULL | Primary key |
| owner_id | FK → users | NOT NULL | Foreign key |
| title | VARCHAR(255) | NOT NULL | Required |
| description | TEXT | NOT NULL | Required |
| category | ENUM | NOT NULL | `HOUSE`, `APARTMENT`, `CAR`, `LAND`, `COMMERCIAL`, `OTHER` |
| location | VARCHAR(500) | NOT NULL | Required |
| price | DECIMAL(10,2) | NOT NULL | Per month |
| is_available | BOOLEAN | NOT NULL | Default true |
| is_featured | BOOLEAN | NOT NULL | Default false |
| is_verified | BOOLEAN | NOT NULL | Default false |
| status | ENUM | NOT NULL | `ACTIVE`, `INACTIVE`, `PENDING`, `SUSPENDED` |
| images | JSON / separate table | NULL | Array of image URLs |
| rules | JSON | NULL | Optional property rules |
| bookings_count | INT | NOT NULL | Default 0 |
| rating | DECIMAL(2,1) | NOT NULL | Default 0.0 |
| reviews_count | INT | NOT NULL | Default 0 |
| views_count | INT | NOT NULL | Default 0 |
| saves_count | INT | NOT NULL | Default 0 |
| created_at | TIMESTAMP | NOT NULL | Auto-set |
| updated_at | TIMESTAMP | NOT NULL | Auto-updated |

#### `bookings`
| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID / BIGINT | NOT NULL | Primary key |
| property_id | FK → properties | NOT NULL | Foreign key |
| renter_id | FK → users | NOT NULL | Foreign key |
| start_date | DATE | NOT NULL | Check-in |
| end_date | DATE | NOT NULL | Check-out |
| guests | INT | NOT NULL | Number of guests |
| total_price | DECIMAL(10,2) | NOT NULL | Calculated |
| status | ENUM | NOT NULL | Default `PENDING` |
| payment_status | ENUM | NOT NULL | Default `UNPAID` |
| special_requests | TEXT | NULL | Optional |
| cancellation_reason | TEXT | NULL | If cancelled |
| cancellation_policy | VARCHAR(50) | NULL | flexible/moderate/strict |
| created_at | TIMESTAMP | NOT NULL | Auto-set |
| updated_at | TIMESTAMP | NOT NULL | Auto-updated |

#### `reviews`
| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID / BIGINT | NOT NULL | Primary key |
| property_id | FK → properties | NOT NULL | Foreign key |
| booking_id | FK → bookings | NOT NULL | Foreign key |
| reviewer_id | FK → users | NOT NULL | Foreign key |
| overall_rating | INT | NOT NULL | 1–5 |
| cleanliness | INT | NULL | 1–5, optional |
| communication | INT | NULL | 1–5, optional |
| check_in | INT | NULL | 1–5, optional |
| accuracy | INT | NULL | 1–5, optional |
| location_rating | INT | NULL | 1–5, optional |
| value | INT | NULL | 1–5, optional |
| comment | TEXT | NOT NULL | Required |
| would_recommend | BOOLEAN | NULL | Optional |
| host_response | TEXT | NULL | Owner reply |
| host_response_date | TIMESTAMP | NULL | Set when owner replies |
| is_verified | BOOLEAN | NOT NULL | Default false |
| helpful_count | INT | NOT NULL | Default 0 |
| created_at | TIMESTAMP | NOT NULL | Auto-set |

#### `payments`
| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID / BIGINT | NOT NULL | Primary key |
| booking_id | FK → bookings | NOT NULL | Foreign key |
| renter_id | FK → users | NOT NULL | Foreign key |
| type | ENUM | NOT NULL | `BOOKING_PAYMENT`, `SECURITY_DEPOSIT`, `SERVICE_FEE` |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| status | ENUM | NOT NULL | `COMPLETED`, `PENDING`, `REFUNDED` |
| method | VARCHAR(50) | NOT NULL | credit_card, paypal, etc. |
| card_last_four | VARCHAR(4) | NULL | Optional |
| invoice_id | VARCHAR(50) | NULL | Optional |
| refund_date | TIMESTAMP | NULL | If refunded |
| refund_amount | DECIMAL(10,2) | NULL | If partial refund |
| refund_reason | TEXT | NULL | If refunded |
| created_at | TIMESTAMP | NOT NULL | Auto-set |

#### `favorites`
| Column | Type | Nullable | Notes |
|---|---|---|---|
| id | UUID / BIGINT | NOT NULL | Primary key |
| renter_id | FK → users | NOT NULL | Foreign key |
| property_id | FK → properties | NOT NULL | Foreign key |
| saved_at | TIMESTAMP | NOT NULL | Auto-set |
| UNIQUE | (renter_id, property_id) | | Composite constraint |

### 2. REST API Endpoints

#### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user (renter/owner) | Public |
| POST | `/api/auth/login` | Login, returns JWT token | Public |
| POST | `/api/auth/logout` | Invalidate token | Authenticated |
| GET | `/api/auth/me` | Get current user profile | Authenticated |
| PUT | `/api/auth/me` | Update current user profile | Authenticated |
| PUT | `/api/auth/password` | Change password | Authenticated |

**Register Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "role": "RENTER | OWNER"
}
```

**Login Request Body**:
```json
{ "email": "string", "password": "string" }
```

**Login Response**:
```json
{
  "token": "jwt-string",
  "user": { "id", "email", "firstName", "lastName", "role", "avatar", "isActive", "joinedAt" }
}
```

#### Users (Admin)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users` | List all users (paginated, filterable) | Admin |
| GET | `/api/users/:id` | Get user details | Admin |
| PUT | `/api/users/:id` | Update user (role, status) | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PATCH | `/api/users/:id/status` | Ban/suspend/activate user | Admin |

**Query Parameters for GET /api/users**:
- `role` – filter by ADMIN, OWNER, RENTER
- `status` – filter by active, pending, suspended
- `search` – search by name or email
- `page`, `size`, `sort`

#### Properties
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/properties` | List properties (paginated, filterable) | Public |
| GET | `/api/properties/:id` | Get property detail | Public |
| POST | `/api/properties` | Create property | Owner |
| PUT | `/api/properties/:id` | Update property | Owner (own) / Admin |
| DELETE | `/api/properties/:id` | Delete property | Owner (own) / Admin |
| PATCH | `/api/properties/:id/status` | Approve/suspend property | Admin |
| PATCH | `/api/properties/:id/featured` | Toggle featured status | Admin |
| GET | `/api/properties/owner/:ownerId` | List owner's properties | Owner / Admin |
| GET | `/api/properties/featured` | List featured properties | Public |

**Query Parameters for GET /api/properties**:
- `location` – filter by location string
- `category` – house, apartment, car, land, commercial, other
- `minPrice`, `maxPrice` – price range
- `available` – true/false
- `sort` – price, rating, newest
- `page`, `size`

**Create Property Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "category": "HOUSE | APARTMENT | CAR | LAND | COMMERCIAL | OTHER",
  "location": "string",
  "price": 0.00
}
```

#### Bookings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/bookings` | List bookings (filtered by role) | Authenticated |
| GET | `/api/bookings/:id` | Get booking detail | Authenticated |
| POST | `/api/bookings` | Create booking | Renter |
| PUT | `/api/bookings/:id` | Update booking | Owner / Admin |
| PATCH | `/api/bookings/:id/status` | Confirm/cancel booking | Owner / Admin |
| GET | `/api/bookings/renter/:renterId` | Renter's bookings | Renter (own) / Admin |
| GET | `/api/bookings/property/:propertyId` | Property's bookings | Owner (own) / Admin |

**Query Parameters for GET /api/bookings**:
- `status` – pending, confirmed, cancelled, completed
- `startDate`, `endDate` – date range filter
- `page`, `size`

**Create Booking Request Body**:
```json
{
  "propertyId": "string",
  "startDate": "2026-03-10",
  "endDate": "2026-03-15",
  "guests": 2,
  "specialRequests": "string (optional)"
}
```

#### Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/reviews/property/:propertyId` | Reviews for a property | Public |
| GET | `/api/reviews/reviewer/:userId` | Reviews by a user | Authenticated |
| GET | `/api/reviews/pending` | Bookings awaiting review | Renter |
| POST | `/api/reviews` | Write a review | Renter |
| PUT | `/api/reviews/:id` | Edit review | Renter (own) |
| POST | `/api/reviews/:id/response` | Owner responds to review | Owner |

**Create Review Request Body**:
```json
{
  "propertyId": "string", "bookingId": "string",
  "overallRating": 5,
  "cleanliness": 5, "communication": 5, "checkIn": 5,
  "accuracy": 5, "locationRating": 5, "value": 5,
  "comment": "string", "wouldRecommend": true
}
```

#### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/payments` | List payments for current user | Authenticated |
| GET | `/api/payments/:id` | Payment detail | Authenticated |
| POST | `/api/payments` | Process payment | Renter |
| POST | `/api/payments/:id/refund` | Refund a payment | Admin |

**Query Parameters for GET /api/payments**:
- `status` – completed, pending, refunded
- `type` – booking_payment, security_deposit, service_fee
- `page`, `size`

#### Favorites
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/favorites` | List renter's favorites | Renter |
| POST | `/api/favorites/:propertyId` | Add to favorites | Renter |
| DELETE | `/api/favorites/:propertyId` | Remove from favorites | Renter |

#### Admin Dashboard & Reports
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Aggregate stats (users, properties, revenue, bookings) | Admin |
| GET | `/api/admin/reports/revenue` | Revenue data over time | Admin |
| GET | `/api/admin/reports/users` | User growth metrics | Admin |
| GET | `/api/admin/reports/bookings` | Booking analytics | Admin |
| GET | `/api/admin/logs` | System logs | Admin |
| GET | `/api/admin/issues` | Reported issues | Admin |
| GET | `/api/admin/settings` | Platform settings | Admin |
| PUT | `/api/admin/settings` | Update platform settings | Admin |

#### Owner Dashboard & Earnings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/owner/dashboard` | Owner stats (properties, bookings, revenue, occupancy) | Owner |
| GET | `/api/owner/earnings` | Earnings breakdown by month/property | Owner |
| GET | `/api/owner/earnings/transactions` | Recent transactions | Owner |

#### File Upload
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/upload/image` | Upload property image or avatar | Authenticated |
| DELETE | `/api/upload/image/:id` | Delete uploaded image | Authenticated |

#### Contact / Support
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/contact` | Submit contact form | Public |

### 3. Security Requirements

- **Authentication**: JWT token-based. Token sent as `Authorization: Bearer <token>` header.
- **Password Hashing**: BCrypt with strength 10+
- **Role-Based Authorization**: Admin, Owner, Renter with Spring Security `@PreAuthorize`
- **Input Validation**: Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Size`, etc.)
- **CORS**: Allow frontend origin (default `http://localhost:5173`)
- **Rate Limiting**: On login (max 5 attempts), registration, and API endpoints
- **Session Timeout**: Configurable (frontend shows 30 min default in admin settings)
- **2FA Support**: Optional, toggleable per user (admin settings show this feature)
- **File Upload Validation**: Max file size, allowed types (images only), virus scanning

### 4. Business Logic Requirements

| Feature | Rule |
|---|---|
| Registration | Only RENTER and OWNER roles can self-register. Admin accounts created manually. |
| Property Creation | Only owners can create. Properties start as PENDING if admin approval is enabled. |
| Booking | Renter cannot book own property. Date overlap validation required. Price auto-calculated from (months × price). |
| Reviews | Only the renter who completed a stay can review. One review per booking. |
| Favorites | A renter can favorite a property once. Duplicate check via unique constraint. |
| Payments | Created when a booking is confirmed. Refund only by admin. |
| Cancellation | Owner/admin can cancel. Apply cancellation policy rules (flexible/moderate/strict). |
| Earnings | Aggregated from completed booking payments for the owner's properties. |
| Admin Reports | Aggregate queries across all users, properties, bookings, and payments. |
| Search | Full-text or LIKE-based search on property title, description, location. |

### 5. Additional Backend Features

- **Pagination**: All list endpoints return paginated results (`page`, `size`, `totalElements`, `totalPages`)
- **Sorting**: Configurable sort fields and direction
- **Error Handling**: Consistent error response format:
  ```json
  { "status": 400, "error": "Bad Request", "message": "Validation failed", "timestamp": "...", "details": [...] }
  ```
- **Notification System**: Email notifications for booking confirmation, cancellation, new review, payment receipt (frontend has 8–9 notification preferences per role)
- **Image Storage**: Local filesystem or cloud storage (S3/Cloudinary) for property images and avatars
- **Admin Settings Persistence**: Store platform settings in a `settings` table or config
- **Audit Logging**: Track user actions for admin system logs view

### 6. Spring Boot Project Structure (Recommended)

```
src/main/java/com/backend/
├── config/                    # SecurityConfig, CorsConfig, JwtConfig
├── controller/                # REST controllers
│   ├── AuthController.java
│   ├── UserController.java
│   ├── PropertyController.java
│   ├── BookingController.java
│   ├── ReviewController.java
│   ├── PaymentController.java
│   ├── FavoriteController.java
│   ├── AdminController.java
│   ├── OwnerController.java
│   ├── UploadController.java
│   └── ContactController.java
├── dto/                       # Request/Response DTOs
├── entity/                    # JPA entities (User, Property, Booking, Review, Payment, Favorite)
├── enums/                     # Role, PropertyCategory, BookingStatus, PaymentStatus, etc.
├── event/                     # Spring Events (e.g., BookingConfirmedEvent → trigger email)
├── exception/                 # Custom exceptions + global handler
├── mapper/                    # Entity ↔ DTO mappers (MapStruct or manual)
├── repository/                # Spring Data JPA repositories
├── security/                  # JWT filter, UserDetailsService, token provider
├── service/                   # Business logic services
├── specification/             # JPA Specifications for dynamic filtering (category, price, location)
├── util/                      # Helpers (file upload, email, etc.)
└── validation/                # Custom validators (@ValidDateRange, @UniqueEmail, etc.)
```

---

## Getting Started

### Frontend
```bash
cd Frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend (once implemented)
```bash
cd Backend
./mvnw spring-boot:run
# → http://localhost:8080
```

### Mock Login Credentials (Frontend Only)
| Role | Email | Password |
|---|---|---|
| Admin | admin@rentwise.com | admin123 |
| Owner | owner@rentwise.com | owner123 |
| Renter | renter@rentwise.com | renter123 |

---

## Integration Checklist

When connecting the frontend to the real backend, the following changes are required in the frontend:

- [ ] Create an API client utility in `src/utils/api.ts` (axios or fetch wrapper with JWT headers)
- [ ] Replace mock data in `AuthContext.tsx` with real `/api/auth/login` and `/api/auth/register` calls
- [ ] Replace all hardcoded mock data in page components with API calls
- [ ] Add proper error handling for network failures
- [ ] Implement token refresh or re-login on 401 responses
- [ ] Unify the User type mismatch (`tenant/landlord` vs `renter/owner`) across types and auth context
- [ ] Update admin Properties page to use the new category-based property model
- [ ] Wire up image upload to `/api/upload/image` in AddProperty and Settings pages
- [ ] Connect contact form to `/api/contact` endpoint
- [ ] Implement real pagination for all list views

---

## Notes

- The frontend is **fully functional with mock data** — no backend is required to preview the UI.
- All property data, user data, bookings, payments, and reviews shown are hardcoded in each page component.
- Mock data uses **local locations** (Kigali, Gisenyi, Musanze, etc.) and Rwandan phone numbers.
- Property categories include non-real-estate assets like **Cars** — the platform is a general digital renting system, not limited to housing.
- The `hooks/` and `utils/` directories are empty and reserved for API integration utilities and custom hooks.
- See `Backend/FRONTEND_REQUIREMENTS.md` for the original backend requirements summary.
