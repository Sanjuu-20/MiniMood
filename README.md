# MiniMood

One line, one mood, every day.

A simple daily mood tracking journal application.

## Features

- Daily mood logging with 40 different mood options
- Add optional notes to each entry (up to 200 characters)
- Calendar view to see mood history at a glance
- Statistics page with mood frequency and streak tracking
- User authentication with JWT tokens
- One entry per day (updates if you log again the same day)

## Tech Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT, bcrypt
- Validation: Zod
- Frontend: Vanilla HTML, CSS, JavaScript

## Installation

1. Clone the repository
```bash
git clone https://github.com/Sanjuu-20/MiniMood.git
cd minimood
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```
DATABASE_URL=postgresql://username:password@localhost:5432/minimood
JWT_SECRET=your-secret-key
PORT=3000
```

4. Initialize the database
```bash
npm run db:init
```

5. Start the server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

6. Open in browser at `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT token
- GET /api/auth/me - Get current user profile

### Entries
- POST /api/entries - Create or update entry for a date
- GET /api/entries - Get all entries with pagination
- GET /api/entries/today - Get today's entry
- GET /api/entries/range - Get entries within a date range
- GET /api/entries/stats - Get mood statistics
- GET /api/entries/:date - Get entry for a specific date
- DELETE /api/entries/:date - Delete entry for a specific date

### Moods
- GET /api/moods - Get all available moods

