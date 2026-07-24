# StayScape

A full-stack vacation rental booking platform inspired by Airbnb. Users can browse properties, book stays, and list their own properties as hosts.

## Features

- User authentication with JWT and hashed passwords
- Browse and search listings by city, price range, and guest capacity
- Create, edit, and delete property listings with image uploads
- Book properties with automatic double-booking prevention
- View and manage bookings as a guest
- View bookings made on your properties as a host
- Editable user profile

## Tech Stack

**Frontend:** React.js, React Router, Bootstrap, Axios

**Backend:** Node.js, Express.js

**Databases:** MySQL (user accounts), MongoDB (listings and bookings)

**Auth:** JSON Web Tokens (JWT), bcrypt for password hashing

**File Uploads:** Multer

## Why two databases

User account data is structured and relational, so it's stored in MySQL. Listings and bookings have more flexible, nested data (locations, amenities lists, image arrays) that fit MongoDB's document model better. MongoDB documents store MySQL user IDs (`hostId`, `guestId`) to link data across both databases, with lookups joined manually in the backend where needed (e.g. showing guest details on a host's bookings page).

## Getting Started

### Prerequisites

- Node.js installed
- MySQL installed and running
- A MongoDB Atlas account (or local MongoDB)

### Backend Setup
cd backend
npm install

Create a `.env` file in `backend/` with:
PORT=5000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=vacation_rental_db
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Create the MySQL database and table:
```sql
CREATE DATABASE vacation_rental_db;
USE vacation_rental_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Run the server:
npm run dev 

### Frontend Setup
cd frontend
npm install
npm start

The app will run on `http://localhost:3000`, backend on `http://localhost:5000`.

## API Endpoints

**Auth**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

**Listings**
- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`
- `GET /api/listings/my-listings`
- `POST /api/listings/upload-images`

**Bookings**
- `POST /api/bookings`
- `GET /api/bookings/my-bookings`
- `GET /api/bookings/host-bookings`
- `PUT /api/bookings/:id/cancel`

Create this file at the root of StayScape/.

