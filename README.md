# EduWis MERN Quiz App

A full-stack quiz application built with the MERN stack (MongoDB, Express, React, Node.js) and Firebase authentication. The app allows users to register, take quizzes, view results, and provides admin features for quiz and user management.

## Features

- User registration and login (with Firebase authentication)
- Take quizzes and view results
- Admin dashboard for managing quizzes and users
- Responsive React frontend
- RESTful API backend with Express and MongoDB

## Project Structure

```
mern/
  client/      # React frontend
  server/      # Express backend
```

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Firebase project (for authentication)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Egenue/Eduwise.git
cd Eduwise
```

### 2. Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

### 3. Set up environment variables

#### Backend

Create a `.env` file in the `server/` directory with the following:

```
MONGO_URI=your_mongodb_connection_string
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# Add other Firebase config as needed
JWT_SECRET=your_jwt_secret
```

#### Frontend

Update `client/src/firebase.js` with your Firebase config.

### 4. Run the application

#### Backend

```bash
cd server
npm start
```

#### Frontend

```bash
cd client
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000) by default.

## Scripts

- `npm start` — Start the development server
- `npm run build` — Build for production
- `npm test` — Run tests

## Folder Structure

- `client/` — React app (frontend)
- `server/` — Express app (backend)
  - `controllers/` — Route controllers
  - `models/` — Mongoose models
  - `routes/` — API routes

## License

[MIT](LICENSE)
