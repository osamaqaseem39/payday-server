# Payday Server

A pure Express.js backend server for the Payday application, providing authentication, user management, and HR dashboard functionality.

## Features

- **Authentication System**: JWT-based authentication with bcrypt password hashing
- **User Management**: Role-based access control (admin, hr_manager, hr_staff, interviewer)
- **MongoDB Integration**: Mongoose ODM for database operations
- **Email Notifications**: Nodemailer integration for sending emails
- **File Uploads**: Multer middleware for handling file uploads
- **RESTful API**: Complete REST API for all CRUD operations
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: dotenv for environment variable management

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### User Management
- `GET /api/users` - List all users (admin only)
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users` - Create new user (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Candidates
- `GET /api/candidates` - List all candidates
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Applications
- `GET /api/applications` - List all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Interviews
- `GET /api/interviews` - List all interviews
- `POST /api/interviews` - Create new interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview

### Reports
- `GET /api/reports/hiring-metrics` - Hiring metrics (admin/hr_manager)
- `GET /api/reports/candidate-pipeline` - Candidate pipeline (admin/hr_manager)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3002
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

3. **Start Server**
   ```bash
   npm start
   # or
   npm run dev
   ```

## Deployment

This server is configured for deployment on Vercel with the included `vercel.json` configuration file.

## Database Schema

### User Model
- `username`: String (unique)
- `email`: String (unique)
- `password`: String (hashed)
- `firstName`: String
- `lastName`: String
- `department`: String
- `role`: Enum (admin, hr_manager, hr_staff, interviewer)
- `isActive`: Boolean
- `createdAt`: Date

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- CORS protection
- Input validation and sanitization

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **File Handling**: Multer
- **Email**: Nodemailer
- **Environment**: dotenv 