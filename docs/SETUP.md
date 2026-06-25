# Setup Guide for Atlasia Logistics Management System

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL or MongoDB (for database)
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database
```bash
# For PostgreSQL
psql -U postgres -d atlasia_logistics -f ../database/schema.sql
```

### 4. Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env if needed
```

### 3. Start Development Server
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

### Backend
```
backend/
├── src/
│   ├── index.js          # Main server file
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── cargo.js
│   │   └── chat.js
│   ├── models/           # Database models
│   ├── controllers/      # Business logic
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── .env.example
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── pages/            # Page components
│   │   ├── LandingPage.js
│   │   ├── LoginPage.js
│   │   └── portals/
│   │       ├── AdminPortal.js
│   │       ├── CustomerPortal.js
│   │       └── TransporterPortal.js
│   ├── components/       # Reusable components
│   ├── services/         # API services
│   ├── App.js
│   └── index.js
├── public/
├── .env.example
└── package.json
```

## Database Configuration

### PostgreSQL
Update your `.env` file:
```
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atlasia_logistics
DB_USER=postgres
DB_PASSWORD=your_password
```

### MongoDB (Optional)
Update your `.env` file:
```
DB_TYPE=mongodb
MONGO_URI=mongodb://localhost:27017/atlasia_logistics
```

## Email Configuration

Set up email service in `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # Use app-specific password for Gmail
EMAIL_FROM=noreply@atlasia.com
```

## Running in Production

### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
# Deploy the build/ folder to your hosting service
```

## Troubleshooting

### Port Already in Use
- Change the PORT in `.env` or use: `PORT=8000 npm run dev`

### Database Connection Error
- Verify database is running
- Check credentials in `.env`
- Ensure database exists: `createdb atlasia_logistics`

### Email Not Sending
- Verify email credentials
- For Gmail: Use app-specific password
- Check firewall/network settings

## Support

For issues or questions, please refer to the documentation or contact support.
