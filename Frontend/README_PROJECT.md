
# Digital Renting System Frontend – Complete Guide

This frontend is built with React, TypeScript, Vite, and Tailwind CSS. It provides a modern, role-based interface for Admins, Owners, and Renters.

---

## Tech Stack
- **React** (functional components, hooks)
- **TypeScript** (type safety)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **React Router** (routing)

---

## Project Structure & Key Files

### `src/components/` – UI Components
- **AdminLayout.tsx**: Sidebar layout and navigation for admin pages.
- **OwnerLayout.tsx**: Sidebar layout and navigation for owner pages.
- **RenterLayout.tsx**: Sidebar layout and navigation for renter pages.
- **Navbar.tsx**: Top navigation bar for shared pages.
- **AuthGuard.tsx**: Protects routes based on authentication and user role.
- **PropertyCard.tsx**: Displays property info (image, title, location, price, status, etc.).
- **SearchFilters.tsx**: UI for filtering properties by location, price, type, etc.
- **ui/Button.tsx**: Reusable button component with variants and loading state.
- **ui/Card.tsx**: Card container with header/body/footer for consistent UI blocks.
- **ui/Input.tsx**: Styled input field with error and helper text support.
- **ui/Loading.tsx**: Animated loading spinner for async states.

### `src/pages/` – Pages (grouped by role)
#### Shared
- **Home.tsx**: Landing page with featured properties and testimonials.
- **About.tsx**: Platform story, mission, and stats.
- **Contact.tsx**: Contact form and support info.
- **Faq.tsx**: Frequently asked questions, grouped by category.
- **Login.tsx**: User login form with validation and redirect logic.
- **Register.tsx**: Multi-step registration form for renters/owners.

#### Admin
- **Dashboard.tsx**: Admin overview with stats, recent users, and system logs.
- **Users.tsx**: Manage all users (search, filter, edit, ban, etc.).
- **Properties.tsx**: Manage all properties (search, filter, edit, verify, etc.).
- **Bookings.tsx**: View/manage all bookings on the platform.
- **Reports.tsx**: Analytics and reports (revenue, usage, logs).
- **Settings.tsx**: Platform-wide settings (security, general, etc.).

#### Owner
- **OwnerDashboard.tsx**: Owner's overview (stats, recent activity).
- **MyProperties.tsx**: List and manage properties owned by the user.
- **AddProperty.tsx**: Multi-step form to add a new property.
- **Bookings.tsx**: View/manage bookings for owned properties.
- **Earnings.tsx**: Track revenue and earnings analytics.
- **Reviews.tsx**: View/respond to reviews for owned properties.
- **Settings.tsx**: Owner profile and notification settings.

#### Renter
- **RenterDashboard.tsx**: Renter's overview (bookings, favorites, etc.).
- **Properties.tsx**: Browse/search all available properties.
- **PropertyDetail.tsx**: Detailed view of a property (images, amenities, reviews).
- **Bookings.tsx**: Manage renter's bookings (upcoming, past, etc.).
- **Favorites.tsx**: List of favorited properties.
- **Payments.tsx**: Payment history and details.
- **Reviews.tsx**: Write/view reviews for stays.
- **SearchProperties.tsx**: Advanced property search with filters.
- **Settings.tsx**: Renter profile and notification settings.
- **Profile.tsx**: Renter's personal profile page.

### `src/contexts/` – Context Providers
- **AuthContext.tsx**: Handles authentication, user info, login/register/logout, and role-based access.
- **ThemeContext.tsx**: Manages light/dark mode and theme switching.

### `src/types/` – TypeScript Types
- **index.ts**: Central definitions for Property, User, Booking, and related data models.

### `src/hooks/` and `src/utils/`
- (Currently empty, reserved for custom hooks and utility functions.)

---

## How the Frontend Works
- **Authentication**: Managed by AuthContext; users are redirected to their dashboard after login based on role.
- **Role-based Routing**: AuthGuard and layout components ensure only authorized users access protected pages.
- **Reusable UI**: All UI elements (buttons, cards, inputs) are modular and styled with Tailwind CSS.
- **Data Models**: All main entities (Property, User, Booking) are strongly typed in TypeScript for safety and clarity.
- **State Management**: Contexts for global state (auth, theme); local state for forms and UI.
- **API Integration**: The frontend expects a RESTful backend as described in `Backend/FRONTEND_REQUIREMENTS.md`.

---

## Getting Started
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
3. Visit `http://localhost:5173` in your browser.

---

## Adding or Modifying Components
- Add new UI elements in `src/components/` or `src/components/ui/`.
- Add new pages in the appropriate `src/pages/` subfolder.
- Update or extend types in `src/types/index.ts` as needed.

---

## Notes
- This frontend is designed to work with a compatible backend API.
- For backend/database requirements, see `Backend/FRONTEND_REQUIREMENTS.md`.

---
For questions or contributions, see the project repository or contact the maintainer.
