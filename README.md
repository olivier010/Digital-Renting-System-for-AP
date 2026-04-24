# RentWise — Digital Renting System

> A full-stack platform for digital property, car, and equipment rentals. Built with Spring Boot (Java) for the backend and React + Vite for the frontend.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Overview](#api-overview)
- [Default Test Users](#default-test-users)
- [License](#license)

---

## Project Overview

**RentWise** is a digital platform that connects renters and property owners, making it easy to list, discover, and book properties, vehicles, and more. The system supports user authentication, property management, bookings, payments, reviews, and admin controls.

---

## Features
- User authentication (JWT-based)
- Role-based access: Admin, Owner, Renter
- Property listing, search, and filtering
- Booking management
- Payment processing and refunds
- Reviews and ratings
- Favorites (wishlists)
- File/image uploads
- Admin dashboard and user management
- Responsive, modern frontend UI

---

## Tech Stack

### Backend
| Technology         | Version   | Purpose                        |
|--------------------|-----------|--------------------------------|
| Java               | 21        | Programming Language           |
| Spring Boot        | 3.3.0     | REST API Framework             |
| Spring Security    | 6.3.0     | Authentication & Authorization |
| Spring Data JPA    | 3.3.0     | Database ORM                   |
| PostgreSQL         | Latest    | Relational Database            |
| JWT (jjwt)         | 0.12.5    | Token-based Authentication     |
| Lombok             | 1.18.34   | Boilerplate Reduction          |
| Maven              | 3.9+      | Build & Dependency Management  |

### Frontend
| Technology         | Version   | Purpose                        |
|--------------------|-----------|--------------------------------|
| React              | 19.x      | UI Library                     |
| Vite               | 7.x       | Frontend Build Tool            |
| TypeScript         | 5.9.x     | Type Safety                    |
| Tailwind CSS       | 3.4.x     | Styling                        |
| jsPDF              | 4.2.x     | PDF Generation                 |

---

## Backend Setup

### Prerequisites
- Java 21 (JDK)
- PostgreSQL database
- Maven 3.9+

### Database Setup
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE digital_renting_system;
   ```
2. The application will auto-create tables on startup.

### Configuration
Edit `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/digital_renting_system
spring.datasource.username=postgres
spring.datasource.password=your_password
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Running the Backend
From the `Backend/` directory:
```bash
# Set JAVA_HOME to JDK 21 (if needed)
# Windows PowerShell:
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"

# Run with Maven Wrapper
./mvnw spring-boot:run

# Or build and run the JAR
./mvnw clean package -DskipTests
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```
API will be available at `http://localhost:8080`

---

## Frontend Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install & Run
From the `Frontend/` directory:
```bash
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

---

## API Overview

The backend exposes a RESTful API for authentication, property management, bookings, payments, reviews, and more. See [Backend api  readme.md](Frontend/Backend%20api%20%20readme.md) for full details and request/response examples.

### Example Endpoints
- `POST   /api/auth/register` — Register new user
- `POST   /api/auth/login` — Login and get JWT token
- `GET    /api/properties` — List all properties
- `POST   /api/properties` — Create new property (Owner)
- `GET    /api/bookings` — List bookings (Authenticated)
- `POST   /api/payments` — Create payment (Renter)
- `GET    /api/admin/dashboard` — Admin dashboard stats

### Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Default Test Users

On first startup, these users are created automatically:

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@rentwise.com   | admin123  |
| Owner | owner@rentwise.com   | owner123  |
| Renter| renter@rentwise.com  | renter123 |

---

## License

This project is for educational purposes — Asia Pacific University.
