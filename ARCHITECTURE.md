# Facility Management System - Full Stack Architecture

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + React Router + Axios
- **Backend**: Java Spring Boot 3.x + Spring Data JPA + Spring Security
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens) + BCrypt

## Project Structure
```
facility_management/
├── backend/                  # Spring Boot application
│   └── src/main/java/com/facility/
│       ├── controller/       # REST controllers
│       ├── service/          # Business logic
│       ├── repository/       # JPA repositories
│       ├── entity/           # JPA entities
│       ├── dto/              # Data Transfer Objects
│       ├── exception/        # Global exception handling
│       ├── config/           # Security, CORS, etc.
│       └── util/             # Utilities (JWT, etc.)
├── frontend/                 # React + Vite application
│   └── src/
│       ├── pages/            # Page components
│       ├── components/       # Reusable components
│       ├── services/         # API service calls
│       ├── context/          # React context (Auth)
│       └── router/           # Route definitions
└── database/
    ├── schema.sql            # Database schema
    └── seed.sql              # Sample data
```
