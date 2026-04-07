# RentWise Backend API

A Spring Boot REST API for the RentWise Digital Renting System.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming Language |
| Spring Boot | 3.3.0 | REST API Framework |
| Spring Security | 6.3.0 | Authentication & Authorization |
| Spring Data JPA | 3.3.0 | Database ORM |
| PostgreSQL | Latest | Relational Database |
| JWT (jjwt) | 0.12.5 | Token-based Authentication |
| Lombok | 1.18.34 | Boilerplate Reduction |
| Maven | 3.9+ | Build & Dependency Management |

## Prerequisites

- Java 21 (JDK)
- PostgreSQL database
- Maven 3.9+

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE digital_renting_system;
```

2. The application will auto-create tables on startup (using `ddl-auto=update`)

## Configuration

The application uses `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/digital_renting_system
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Running the Application

### Using Maven Wrapper

```bash
# Set JAVA_HOME to JDK 21
# Windows PowerShell:
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"

# Run the application
./mvnw spring-boot:run
```

### Using JAR

```bash
# Build the JAR
./mvnw clean package -DskipTests

# Run the JAR
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

The API will be available at `http://localhost:8080`

## Project Structure

```
src/main/java/com/backend/
├── BackendApplication.java      # Main entry point
├── config/                      # Configuration classes
│   ├── CorsConfig.java
│   ├── DataInitializer.java     # Seeds default users
│   └── SecurityConfig.java
├── controller/                  # REST Controllers
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── BookingController.java
│   ├── ContactController.java
│   ├── FavoriteController.java
│   ├── NotificationController.java
│   ├── OwnerController.java
│   ├── PaymentController.java
│   ├── PropertyController.java
│   ├── RenterController.java
│   ├── ReviewController.java
│   ├── UploadController.java
│   └── UserController.java
├── dto/                         # Data Transfer Objects
│   ├── request/                 # Request DTOs
│   └── response/                # Response DTOs
├── entity/                      # JPA Entities
│   ├── Booking.java
│   ├── Favorite.java
│   ├── Log.java
│   ├── Notification.java
│   ├── Payment.java
│   ├── Property.java
│   ├── Review.java
│   └── User.java
├── enums/                       # Enumerations
│   ├── BookingStatus.java
│   ├── NotificationEntityType.java
│   ├── NotificationType.java
│   ├── PaymentStatus.java
│   ├── PaymentType.java
│   ├── PropertyCategory.java
│   ├── PropertyStatus.java
│   └── Role.java
├── exception/                   # Exception Handling
│   ├── BadRequestException.java
│   ├── DuplicateResourceException.java
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
├── mapper/                      # Entity-DTO Mappers
├── repository/                  # JPA Repositories
├── security/                    # Security Components
│   ├── CurrentUser.java
│   ├── CustomUserDetailsService.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   └── UserPrincipal.java
└── service/                     # Business Logic
    ├── AuthService.java
    ├── BookingService.java
    ├── ContactService.java
    ├── DashboardService.java
    ├── FavoriteService.java
    ├── FileUploadService.java
    ├── LogService.java
    ├── NotificationService.java
    ├── PaymentService.java
    ├── PropertyService.java
    ├── ReviewService.java
    └── UserService.java
```

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user (requires auth) |
| PUT | `/api/auth/me` | Update current user (requires auth) |
| POST | `/api/auth/change-password` | Change password (requires auth) |

### Properties

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | Public | List all properties (with filters) |
| GET | `/api/properties/{id}` | Public | Get property details |
| POST | `/api/properties` | Owner | Create new property |
| PUT | `/api/properties/{id}` | Owner | Update property |
| DELETE | `/api/properties/{id}` | Owner | Delete property |
| PATCH | `/api/properties/{id}/featured` | Admin | Toggle featured flag |
| PATCH | `/api/properties/{id}/verified?verified=true|false&reason=` | Admin | Verify/reject property |
| GET | `/api/properties/featured` | Public | Get featured properties |
| GET | `/api/properties/owner/{ownerId}` | Owner/Admin | List properties by owner |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings` | Authenticated | List bookings |
| GET | `/api/bookings/{id}` | Authenticated | Get booking details |
| POST | `/api/bookings` | Renter | Create booking |
| PUT | `/api/bookings/{id}` | Owner/Admin | Update booking |
| PATCH | `/api/bookings/{id}/status` | Owner/Admin | Update booking status |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/property/{propertyId}` | Public | Get property reviews |
| POST | `/api/reviews` | Renter | Create review |
| PUT | `/api/reviews/{id}` | Renter | Update review |
| DELETE | `/api/reviews/{id}` | Renter/Admin | Delete review |
| GET | `/api/reviews/my` | Renter | Get reviews written by the current user |

### Favorites

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/favorites` | Renter | Get user favorites |
| POST | `/api/favorites` | Renter | Add to favorites |
| DELETE | `/api/favorites/{propertyId}` | Renter | Remove from favorites |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payments` | Authenticated | Get user payments |
| GET | `/api/payments/{id}` | Authenticated | Get payment details |
| POST | `/api/payments` | Renter | Create payment |
| POST | `/api/payments/{id}/refund` | Admin | Refund payment |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | Authenticated | List current user's notifications with filters |
| GET | `/api/notifications/unread-count` | Authenticated | Get unread notification count |
| PATCH | `/api/notifications/{id}/read` | Authenticated | Mark a notification as read |
| PATCH | `/api/notifications/read-all` | Authenticated | Mark all current user's notifications as read |
| DELETE | `/api/notifications/{id}` | Authenticated | Delete a notification |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Get dashboard statistics |
| GET | `/api/admin/reports/revenue` | Admin | Get monthly revenue report data |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/{id}` | Admin | Update user |
| PATCH | `/api/users/{id}/status` | Admin | Approve/reject user account |
| DELETE | `/api/users/{id}` | Admin | Delete user |
| GET | `/api/admin/logs` | Admin | Get all system logs |
| GET | `/api/admin/system-status` | Admin | Get real-time system health status |

#### Get Owner's Bookings

```http
GET /api/owner/bookings
Authorization: Bearer <owner_token>

# Optional query params:
#   status: Booking status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
#   startDate: Filter bookings from this date (YYYY-MM-DD)
#   endDate: Filter bookings up to this date (YYYY-MM-DD)

# Example:
GET /api/owner/bookings?status=CONFIRMED&page=0&size=10
```

**Description:**
Returns a paginated list of bookings for the currently authenticated owner. Supports filtering by status and date range.

**Response Example:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": 1,
        "property": {
          "id": 10,
          "title": "Modern 2-Bedroom Apartment",
          "location": "123 Main Street, New York, NY 10001",
          "category": "APARTMENT",
          "price": 2500.00,
          "image": "https://example.com/image1.jpg",
          "ownerId": 2,
          "ownerName": "Alice Smith"
        },
        "renter": {
          "id": 5,
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "+1234567890"
        },
        "startDate": "2026-04-01",
        "endDate": "2026-04-30",
        "totalPrice": 2500.00,
        "status": "CONFIRMED",
        "paymentStatus": "PAID",
        "specialRequests": "Early check-in if possible.",
        "cancellationReason": null,
        "cancellationPolicy": null,
        "createdAt": "2026-03-13T10:00:00",
        "updatedAt": "2026-03-13T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 1,
    "totalPages": 1
  },
  "timestamp": "2026-03-13T10:00:00",
  "errors": null
}
```

## Owner Earnings Endpoints

### GET /api/owner/earnings
Returns summary data for the owner, including total revenue, monthly revenue, pending revenue, average booking value, total bookings, growth rate, projected revenue, and more.

**Response Example:**
```
{
  "success": true,
  "data": {
    "myEarnings": 125000,
    "monthlyRevenue": 24500,
    "pendingRevenue": 8500,
    "averageBookingValue": 850,
    "totalBookings": 156,
    "growthRate": 12.5,
    "projectedRevenue": 145000,
    ...
  }
}
```

### GET /api/owner/earnings/transactions
Returns a paginated list of payment transactions for the owner (date, property, guest, amount, type, status, payment method, etc.).

**Response Example:**
```
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "date": "2024-03-15",
        "property": "Luxury Downtown Apartment",
        "guest": "John Smith",
        "amount": 750,
        "type": "BOOKING_PAYMENT",
        "status": "COMPLETED",
        "paymentMethod": "Credit Card"
      },
      ...
    ],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10
  }
}
```

### GET /api/owner/earnings/properties
Returns per-property earnings for the owner, including property ID, title, total revenue, bookings count, occupancy rate, average price, and growth.

**Response Example:**
```
{
  "success": true,
  "data": [
    {
      "propertyId": 1,
      "propertyTitle": "Luxury Downtown Apartment",
      "totalRevenue": 42000,
      "bookingsCount": 18,
      "occupancyRate": 85.0,
      "averagePrice": 2333,
      "growth": 15.2
    },
    ...
  ]
}
```
### Renter

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/renter/dashboard` | Renter | Get renter dashboard |
| GET | `/api/renter/bookings` | Renter | Get renter's bookings |

---

## API Request Body Examples

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "role": "RENTER"
}
```
> **Note:** `role` must be either `RENTER` or `OWNER` (ADMIN cannot self-register)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Update Current User
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321",
  "bio": "I'm looking for a nice apartment in the city center.",
  "location": "New York, USA",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456",
  "confirmPassword": "newSecurePassword456"
}
```

---

### Properties

#### Create Property (Owner only)
```http
POST /api/properties
Authorization: Bearer <owner_token>
Content-Type: application/json

{
  "title": "Modern 2-Bedroom Apartment",
  "description": "Beautiful apartment with city views, fully furnished with modern amenities. Located in the heart of downtown.",
  "category": "APARTMENT",
  "location": "123 Main Street, New York, NY 10001",
  "price": 2500.00,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  "rules": "No smoking. No pets. Quiet hours after 10 PM."
}
```
> **Categories:** `HOUSE`, `APARTMENT`, `CAR`, `LAND`, `COMMERCIAL`, `OTHER`

#### Update Property
```http
PUT /api/properties/{id}
Authorization: Bearer <owner_token>
Content-Type: application/json

{
  "title": "Luxury 2-Bedroom Apartment",
  "description": "Updated description with more details.",
  "price": 2800.00,
  "isAvailable": true,
  "isFeatured": true,
  "rules": "No smoking. Small pets allowed."
}
```

---

### Bookings

#### Create Booking (Renter only)
```http
POST /api/bookings
Authorization: Bearer <renter_token>
Content-Type: application/json

{
  "propertyId": 1,
  "startDate": "2026-04-01",
  "endDate": "2026-04-30",
  "specialRequests": "Early check-in if possible. Need parking space."
}
```

#### Update Booking (Owner/Admin)
```http
PUT /api/bookings/{id}
Authorization: Bearer <owner_token>
Content-Type: application/json

{
  "startDate": "2026-04-05",
  "endDate": "2026-05-05",
  "status": "CONFIRMED",
  "specialRequests": "Updated requests"
}
```
> **Status options:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

#### Update Booking Status
```http
PATCH /api/bookings/{id}/status?status=CONFIRMED
Authorization: Bearer <owner_token>
```

#### Cancel Booking
```http
PATCH /api/bookings/{id}/status?status=CANCELLED&cancellationReason=Tenant%20requested%20cancellation
Authorization: Bearer <owner_token>
```

---

### Reviews

#### Create Review (Renter only)
```http
POST /api/reviews
Authorization: Bearer <renter_token>
Content-Type: application/json

{
  "propertyId": 1,
  "bookingId": 1,
  "rating": 5,
  "comment": "Amazing property! The apartment was clean, well-maintained, and exactly as described. The owner was very responsive and helpful."
}
```
> **Rating:** 1-5 (integer)

#### Update Review
```http
PUT /api/reviews/{id}
Authorization: Bearer <renter_token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review - Great place but had some minor issues with hot water."
}
```

---

### Favorites

#### Add to Favorites (Renter only)
```http
POST /api/favorites
Authorization: Bearer <renter_token>
Content-Type: application/json

{
  "propertyId": 1
}
```

---

### Payments

#### Create Payment (Renter only)
```http
POST /api/payments
Authorization: Bearer <renter_token>
Content-Type: application/json

{
  "bookingId": 1,
  "type": "BOOKING_PAYMENT",
  "amount": 2500.00,
  "method": "CREDIT_CARD",
  "cardLastFour": "4242"
}
```
> **Payment Types:** `BOOKING_PAYMENT`, `SECURITY_DEPOSIT`, `SERVICE_FEE`
> **Payment Methods:** `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `PAYPAL`

#### Refund Payment (Admin only)
```http
POST /api/payments/{id}/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Booking cancelled by owner",
  "refundAmount": 2500.00
}
```
> **Note:** `refundAmount` is optional. If not provided, full amount will be refunded.

---

### Admin - User Management

#### Update User (Admin only)
```http
PUT /api/users/{id}?role=OWNER&isActive=true
Authorization: Bearer <admin_token>
```

#### Update User Status
```http
PATCH /api/users/{id}/status?isActive=false
Authorization: Bearer <admin_token>
```

---

### Notifications

#### List Notifications (Current User)
```http
GET /api/notifications?page=0&size=10&unread=true&type=BOOKING_STATUS_CHANGED&from=2026-04-01T00:00:00&to=2026-04-30T23:59:59
Authorization: Bearer <token>
```

**Supported query params:**
- `page`, `size`
- `unread` (`true` or `false`)
- `type` (e.g. `BOOKING_CREATED`, `BOOKING_STATUS_CHANGED`, `PAYMENT_SUCCEEDED`, `PAYMENT_FAILED`, `REVIEW_RECEIVED`, `PROPERTY_VERIFIED`, `USER_PENDING_APPROVAL`)
- `from`, `to` (ISO date-time)

> For booking notifications, statuses are `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.

**Response Example:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": 42,
        "type": "BOOKING_STATUS_CHANGED",
        "title": "Booking status updated",
        "body": "Your booking status is now CONFIRMED.",
        "isRead": false,
        "createdAt": "2026-04-06T10:15:30",
        "readAt": null,
        "actorUserId": 7,
        "entityType": "BOOKING",
        "entityId": 101,
        "metadata": "status=CONFIRMED"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-04-06T10:16:00"
}
```

#### Get Unread Count
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "unreadCount": 5
  },
  "timestamp": "2026-04-06T10:20:00"
}
```

#### Mark One Notification as Read
```http
PATCH /api/notifications/{id}/read
Authorization: Bearer <token>
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Notification marked as read",
  "data": {
    "id": 42,
    "isRead": true,
    "readAt": "2026-04-06T10:25:00"
  },
  "timestamp": "2026-04-06T10:25:00"
}
```

#### Mark All Notifications as Read
```http
PATCH /api/notifications/read-all
Authorization: Bearer <token>
```

**Response Example:**
```json
{
  "status": 200,
  "message": "All notifications marked as read",
  "data": {
    "updatedCount": 12
  },
  "timestamp": "2026-04-06T10:30:00"
}
```

#### Delete Notification
```http
DELETE /api/notifications/{id}
Authorization: Bearer <token>
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Notification deleted successfully",
  "data": null,
  "timestamp": "2026-04-06T10:35:00"
}
```

> **Security note:** users only see/update/delete their own notifications.

---

### Admin - System Logs & Status

#### Get System Logs
```http
GET /api/admin/logs
Authorization: Bearer <admin_token>
```
**Description:**
Returns a list of system log entries (level, message, timestamp, etc.).

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "level": "INFO",
      "message": "User registered: admin@rentwise.com",
      "timestamp": "2026-03-27T00:00:00"
    },
    {
      "id": 2,
      "level": "ERROR",
      "message": "Unhandled exception: Database connection lost",
      "timestamp": "2026-03-27T00:10:00"
    }
  ]
}
```

#### Get System Status
```http
GET /api/admin/system-status
Authorization: Bearer <admin_token>
```
**Description:**
Returns real-time health status for core system components (database, external APIs, file storage, message queue, uptime, error count, etc.).

**Response Example:**
```json
{
  "success": true,
  "data": {
    "database": "UP",
    "externalApis": {
      "paymentGateway": "UP",
      "emailService": "DOWN"
    },
    "fileStorage": "UP",
    "messageQueue": "UP",
    "uptime": "1:23:45",
    "recentErrorCount": 2
  }
}
```

> **Note:** These endpoints are admin-only and require a valid JWT token with ADMIN role.

---

### Contact Form (Public)

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "subject": "Question about listings",
  "message": "I have a question about how to list my property on your platform. Could you please provide more information?"
}
```

---

### File Upload

#### Upload Image
```http
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary image data>
```

#### Upload Multiple Images
```http
POST /api/upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <binary image data>
files: <binary image data>
files: <binary image data>
```

## Default Test Users

Created automatically on first startup:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentwise.com | admin123 |
| Owner | owner@rentwise.com | owner123 |
| Renter | renter@rentwise.com | renter123 |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Request
```json
POST /api/auth/login
{
  "email": "admin@rentwise.com",
  "password": "admin123"
}
```

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@rentwise.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    }
  }
}
```

### Using the Token
Include the token in the `Authorization` header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-03-08T12:00:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["field error 1", "field error 2"],
  "timestamp": "2026-03-08T12:00:00"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
```

---

## HTTP Status Codes

### Success Codes

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `200 OK` | Request successful | GET, PUT, PATCH requests |
| `201 Created` | Resource created successfully | POST requests (register, create property, etc.) |
| `204 No Content` | Request successful, no content returned | DELETE requests |

### Client Error Codes

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `400 Bad Request` | Invalid request data | Validation errors, malformed JSON, invalid parameters |
| `401 Unauthorized` | Authentication required | Missing or invalid JWT token |
| `403 Forbidden` | Access denied | User doesn't have permission (e.g., Renter accessing Admin endpoint) |
| `404 Not Found` | Resource not found | Property/User/Booking ID doesn't exist |
| `409 Conflict` | Resource conflict | Duplicate email registration, overlapping booking dates |
| `422 Unprocessable Entity` | Validation failed | Field validation errors (invalid email format, etc.) |

### Server Error Codes

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `500 Internal Server Error` | Unexpected server error | Database errors, unhandled exceptions |
| `503 Service Unavailable` | Service temporarily unavailable | Database connection issues |

---

## Error Response Examples

### 400 Bad Request - Validation Error
```json
{
  "status": 400,
  "message": "Validation failed",
  "data": null,
  "timestamp": "2026-03-08T12:00:00",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "status": 401,
  "message": "Invalid or expired token",
  "data": null,
  "timestamp": "2026-03-08T12:00:00",
  "errors": null
}
```

### 403 Forbidden - Access Denied
```json
{
  "status": 403,
  "message": "Access denied. You don't have permission to access this resource.",
  "data": null,
  "timestamp": "2026-03-08T12:00:00",
  "errors": null
}
```

### 404 Not Found - Resource Not Found
```json
{
  "status": 404,
  "message": "Property not found with id: 999",
  "data": null,
  "timestamp": "2026-03-08T12:00:00",
  "errors": null
}
```

### 409 Conflict - Duplicate Resource
```json
{
  "status": 409,
  "message": "Email already registered",
  "data": null,
  "timestamp": "2026-03-08T12:00:00",
  "errors": null
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An unexpected error occurred",
  "data": null,
  "timestamp": "2026-03-08T12:00:00",
  "errors": null
}
```

## Frontend Integration

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Example API Call
```javascript
// Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@rentwise.com',
    password: 'admin123'
  })
});
const data = await response.json();
const token = data.data.token;

// Authenticated request
const properties = await fetch(`${API_BASE_URL}/properties`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Troubleshooting

### Port Already in Use
```powershell
# Find and kill process on port 8080
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
```

### Database Connection Error
- Ensure PostgreSQL is running
- Verify database `digital_renting_system` exists
- Check credentials in `application.properties`

### IDE Red Lines (Configuration Properties)
These are IDE indexing issues, not actual errors:
1. Right-click `pom.xml` → Maven → Reload Project
2. Or press `Ctrl+Shift+O`
3. If persists: File → Invalidate Caches → Invalidate and Restart

## License

This project is for educational purposes - Asia Pacific University.

## User Registration & Admin Approval

- When a user registers, their account is created with `is_active = false` (not active).
- The user cannot log in until an admin approves their account.
- Admins can view and manage users via the `/api/users` endpoints (admin only).
- To approve a user, an admin should activate the user using:

```
PATCH /api/users/{id}/status?isActive=true
```

- If a user tries to log in before approval, they will receive an error: `Account not yet approved by admin.`
