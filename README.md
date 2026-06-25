# Atlasia Logistics Management System

A comprehensive web and mobile logistics management system with live cargo tracking, multi-portal authentication, and real-time chat functionality.

## Features

- **Three Login Portals**: Admin, Customer, and Transporter
- **Live Cargo Tracking**: Real-time tracking available across all portals
- **Chat System**: Integrated communication with role-based access
  - Customers and Transporters can only chat with Admin
  - Admin portal has separate channels for Customers and Transporters
- **Email Verification**: Email-based OTP verification on login
- **Admin Approval**: Portal allocation requires admin approval after verification
- **Responsive Design**: Works on web browsers and mobile devices
- **Centralized Database**: All data maintained in a single database

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB/PostgreSQL
- **Real-time Communication**: Socket.io
- **Authentication**: JWT with Email OTP

## Project Structure

```
Atlasia-App/
├── frontend/          # React web application
├── backend/           # Node.js Express server
├── mobile/            # Mobile app (if applicable)
├── database/          # Database schemas and migrations
└── docs/              # Documentation
```

## Installation & Setup

See individual README files in `frontend/` and `backend/` directories for detailed setup instructions.

## Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

## Environment Variables

Each service requires a `.env` file. See `.env.example` files in respective directories.

## License

MIT
