# Payday HR Dashboard Server

A comprehensive HR management system built with Node.js, Express, and MongoDB.

## 🏗️ Project Structure

```
payday-dashboard/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── jobController.js     # Job management logic
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization middleware
│   │   └── upload.js            # File upload middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Job.js               # Job model
│   │   ├── Candidate.js         # Candidate model
│   │   ├── Application.js       # Application model
│   │   ├── Interview.js         # Interview model
│   │   └── EmailTemplate.js     # Email template model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── jobs.js              # Job management routes
│   └── utils/
│       └── email.js             # Email utility functions
├── server.js                    # Main server file
├── package.json
├── vercel.json                  # Vercel deployment configuration
└── README.md
```

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Job Management**: Create, read, update, and delete job postings
- **Candidate Management**: Track candidate information and applications
- **Interview Scheduling**: Manage interview processes
- **Email Notifications**: Automated email notifications
- **File Uploads**: Resume and document upload functionality
- **Advanced Reporting**: Hiring metrics and analytics

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Health Check
- `GET /api/health` - Server health status

## 🔧 Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment
The project is configured for Vercel deployment with:
- Serverless function configuration
- Environment variable support
- Automatic routing

### Environment Variables for Production
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

## 📝 Code Organization

### Models
Each model is in its own file under `src/models/` with proper schema definitions.

### Controllers
Business logic is separated into controllers under `src/controllers/`:
- `authController.js` - Authentication operations
- `jobController.js` - Job management operations

### Routes
API routes are organized by feature under `src/routes/`:
- `auth.js` - Authentication routes
- `jobs.js` - Job management routes

### Middleware
Reusable middleware functions under `src/middleware/`:
- `auth.js` - Authentication and authorization
- `upload.js` - File upload handling

### Utils
Utility functions under `src/utils/`:
- `email.js` - Email sending functionality

## 🔒 Security Features

- JWT token authentication
- Role-based access control (admin, hr_manager, hr_staff, interviewer)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration

## 📊 Database Schema

The application uses MongoDB with the following collections:
- **Users**: Staff and admin accounts
- **Jobs**: Job postings and requirements
- **Candidates**: Candidate information
- **Applications**: Job applications
- **Interviews**: Interview scheduling and feedback
- **EmailTemplates**: Reusable email templates

## 🤝 Contributing

1. Follow the established folder structure
2. Add new models in `src/models/`
3. Create controllers in `src/controllers/`
4. Define routes in `src/routes/`
5. Add middleware in `src/middleware/`
6. Update this README with new features

## 📄 License

This project is licensed under the MIT License. 