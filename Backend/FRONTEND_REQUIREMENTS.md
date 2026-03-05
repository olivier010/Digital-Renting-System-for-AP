# Backend & Database Requirements for Digital Renting System

This document summarizes the backend and database requirements based on the current frontend implementation. It is intended to guide backend and database development to ensure compatibility with the frontend features and data flows.

## User Roles
- **Admin**: Manages users, properties, bookings, reports, and platform settings.
- **Owner (Landlord)**: Manages their own properties, bookings, earnings, reviews, and settings.
- **Renter (Tenant)**: Searches properties, books rentals, manages bookings, payments, reviews, favorites, and profile.

## Core Entities & Data Models

### User
- id (string)
- name (string)
- email (string)
- phone (string)
- role: 'tenant' | 'landlord' | 'admin'
- avatar (string, optional)
- password (hashed, backend only)
- status (active, banned, etc.)
- createdAt, updatedAt

### Property
- id (string)
- title (string)
- description (string)
- price (number)
- location (string)
- bedrooms (number)
- bathrooms (number)
- area (number)
- type: 'apartment' | 'house' | 'condo' | 'studio'
- images (array of string URLs)
- amenities (array of string)
- available (boolean)
- owner (User reference)
- createdAt, updatedAt
- status (active, inactive, pending, etc.)
- featured (boolean)
- verified (boolean)

### Booking
- id (string)
- propertyId (Property reference)
- tenantId (User reference)
- startDate, endDate (date)
- totalPrice (number)
- status: 'pending' | 'confirmed' | 'cancelled'
- paymentStatus: 'paid' | 'unpaid' | 'refunded'
- createdAt

### Review
- id (string)
- propertyId (Property reference)
- bookingId (Booking reference)
- reviewerId (User reference)
- rating (number)
- review (string)
- date (date)
- hostResponse (string, optional)

### Payment
- id (string)
- bookingId (Booking reference)
- tenantId (User reference)
- amount (number)
- status: 'completed' | 'pending' | 'refunded'
- method: 'credit_card' | 'paypal' | ...
- date (date)

## Key Backend API Endpoints (REST Example)

### Auth
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET  /api/auth/me

### Users
- GET    /api/users
- GET    /api/users/:id
- POST   /api/users (admin)
- PATCH  /api/users/:id
- DELETE /api/users/:id (admin)

### Properties
- GET    /api/properties
- GET    /api/properties/:id
- POST   /api/properties (owner)
- PATCH  /api/properties/:id (owner/admin)
- DELETE /api/properties/:id (owner/admin)

### Bookings
- GET    /api/bookings
- GET    /api/bookings/:id
- POST   /api/bookings (renter)
- PATCH  /api/bookings/:id (owner/admin)
- DELETE /api/bookings/:id (owner/admin)

### Reviews
- GET    /api/reviews?propertyId=xxx
- POST   /api/reviews (renter)
- PATCH  /api/reviews/:id (renter/owner)

### Payments
- GET    /api/payments
- POST   /api/payments (renter)

### Admin
- GET    /api/admin/reports
- GET    /api/admin/settings
- PATCH  /api/admin/settings

## Additional Features
- Filtering, searching, and sorting for properties, users, bookings, etc.
- Dashboard analytics for admin and owners.
- Notification system (email, push, in-app).
- File upload support for property images and user avatars.
- Security: authentication (JWT/session), authorization, rate limiting, input validation.

---

This document should be updated as frontend features evolve. Use it as a reference for backend and database schema design to ensure seamless integration with the frontend.
