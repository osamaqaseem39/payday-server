# 🚀 Enhanced HR Dashboard - Complete Hiring Management System

A comprehensive, enterprise-grade HR dashboard built with React, TypeScript, Node.js, and MongoDB. Features advanced authentication, role-based access control, email notifications, file uploads, and comprehensive reporting.

## ✨ **NEW ENHANCED FEATURES**

### 🔐 **Authentication & Security**
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, HR Manager, HR Staff, Interviewer)
- **Password encryption** using bcrypt
- **Session management** with automatic token refresh
- **Secure API endpoints** with middleware protection

### 👥 **User Management**
- **Multi-role user system** with granular permissions
- **User registration and login** with validation
- **Profile management** and password changes
- **Department-based access control**
- **User activity tracking** and last login monitoring

### 📧 **Email Notifications**
- **Automated email templates** for various scenarios
- **Customizable email content** with variable substitution
- **SMTP integration** (Gmail, Outlook, custom servers)
- **Application confirmations** and status updates
- **Interview scheduling** notifications
- **Team member alerts** for new job postings

### 📁 **File Management**
- **Resume uploads** with validation (PDF, DOC, DOCX)
- **Avatar/profile picture** uploads
- **File size limits** and type restrictions
- **Secure file storage** with unique naming
- **File metadata tracking**

### 📊 **Advanced Reporting & Analytics**
- **Hiring metrics dashboard** with real-time data
- **Candidate pipeline visualization** by status
- **Time-to-hire analytics** and trends
- **Department performance** comparisons
- **Application source tracking** and conversion rates
- **Interview success rates** and feedback analysis
- **Custom date range filtering**

### 🎯 **Enhanced Job Management**
- **Advanced job posting** with requirements and benefits
- **Job tagging system** for better categorization
- **Department-specific workflows** and approvals
- **Job status tracking** with audit trails
- **Application analytics** per job posting

### 👨‍💼 **Candidate & Application Management**
- **Comprehensive candidate profiles** with ratings
- **Application status tracking** with detailed workflows
- **Screening score system** for candidate evaluation
- **Source tracking** (website, referral, job boards)
- **Notes and feedback** system for HR staff
- **Rejection reason tracking** for compliance

### 🗓️ **Interview Management**
- **Multi-round interview scheduling** with calendar integration
- **Interviewer assignment** and availability tracking
- **Interview scoring** and feedback collection
- **Next round recommendations** and decision tracking
- **Meeting link management** for virtual interviews

## 🏗️ **Architecture & Technology Stack**

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive UI
- **React Router** for client-side routing
- **React Icons** for consistent iconography
- **Recharts** for data visualization

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email functionality
- **CORS** for cross-origin requests

### **Security Features**
- **JWT token validation** with expiration
- **Role-based middleware** for API protection
- **Input validation** and sanitization
- **File upload security** with type checking
- **Environment variable** configuration
- **HTTPS ready** for production deployment

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB 6+ (local or cloud)
- Gmail account for email (or custom SMTP)

### **1. Clone and Install**
```bash
git clone <your-repo>
cd payday-dashboard
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=3002
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/payday-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **3. Database Setup**
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas cloud service
# Update MONGODB_URI in .env
```

### **4. Run the Application**
```bash
# Development mode (both frontend and backend)
npm run dev:full

# Or run separately:
npm run server    # Backend on port 3002
npm run dev       # Frontend on port 3001
```

## 🔐 **Authentication & User Roles**

### **User Roles & Permissions**

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Admin** | Full system access | All features and data |
| **HR Manager** | HR operations + user management | Jobs, candidates, applications, interviews, users |
| **HR Staff** | Basic HR operations | Jobs, candidates, applications |
| **Interviewer** | Interview management only | Interviews, candidate feedback |

### **API Endpoint Protection**
```typescript
// Example: Admin-only endpoint
app.get('/api/users', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  // Only accessible by admin and HR managers
});

// Example: Authenticated user endpoint
app.get('/api/jobs', authenticateToken, async (req, res) => {
  // Accessible by all authenticated users
});
```

## 📧 **Email System Setup**

### **Gmail Configuration**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password (not your regular password)
3. Use the App Password in your `.env` file

### **Email Templates**
The system includes customizable email templates for:
- Application confirmations
- Interview scheduling
- Status updates
- Team notifications
- Custom communications

### **Template Variables**
```html
<!-- Example email template -->
<h3>Hello {{candidateName}}</h3>
<p>Your application for {{jobTitle}} has been received.</p>
<p>Company: {{companyName}}</p>
```

## 📁 **File Upload System**

### **Supported File Types**
- **Resumes**: PDF, DOC, DOCX
- **Images**: JPG, PNG, GIF
- **File Size Limit**: 5MB per file

### **Upload Endpoints**
```typescript
// Resume upload
POST /api/upload/resume
Content-Type: multipart/form-data
Authorization: Bearer <token>

// Avatar upload
POST /api/upload/avatar
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### **File Storage**
- Files are stored in `uploads/` directory
- Unique filenames prevent conflicts
- File metadata stored in database
- Secure access control

## 📊 **Reporting & Analytics**

### **Available Reports**
1. **Hiring Metrics Dashboard**
   - Total applications by period
   - Applications by status
   - Department-wise breakdown
   - Time-to-hire analytics

2. **Candidate Pipeline Report**
   - Status distribution
   - Conversion rates
   - Source effectiveness
   - Interview success rates

3. **Department Performance**
   - Job posting success
   - Application quality
   - Hiring efficiency
   - Cost per hire

### **API Endpoints**
```typescript
// Hiring metrics with date filtering
GET /api/reports/hiring-metrics?startDate=2024-01-01&endDate=2024-12-31

// Candidate pipeline visualization
GET /api/reports/candidate-pipeline

// Enhanced dashboard stats
GET /api/dashboard/stats
```

## 🔧 **Development & Customization**

### **Adding New Roles**
```typescript
// In server.js, update the requireRole middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
```

### **Creating Custom Email Templates**
```typescript
// Add new template to database
const template = new EmailTemplate({
  name: 'welcome_email',
  subject: 'Welcome to {{companyName}}',
  body: '<h1>Welcome {{candidateName}}!</h1>',
  variables: ['companyName', 'candidateName']
});
```

### **Extending Data Models**
```typescript
// Add new fields to existing schemas
const jobSchema = new mongoose.Schema({
  // ... existing fields
  newField: { type: String },
  customMetadata: { type: Map, of: String }
});
```

## 🚀 **Production Deployment**

### **Environment Setup**
```env
NODE_ENV=production
JWT_SECRET=very-long-random-secret-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
EMAIL_USER=production-email@company.com
EMAIL_PASS=production-app-password
```

### **Security Considerations**
- Use strong JWT secrets
- Enable HTTPS
- Set up proper CORS origins
- Implement rate limiting
- Use environment variables for secrets
- Regular security updates

### **Performance Optimization**
- Database indexing
- File compression
- CDN for static assets
- Caching strategies
- Load balancing

## 📱 **API Documentation**

### **Authentication Endpoints**
```typescript
POST /api/auth/register    // User registration
POST /api/auth/login       // User login
GET  /api/users            // Get all users (admin/hr_manager)
PUT  /api/users/:id        // Update user (admin/hr_manager)
```

### **Core HR Endpoints**
```typescript
// Jobs
GET    /api/jobs           // List jobs with filters
POST   /api/jobs           // Create job (authenticated)
PUT    /api/jobs/:id       // Update job (authenticated)
DELETE /api/jobs/:id       // Delete job (admin/hr_manager)

// Candidates
GET    /api/candidates      // List candidates
POST   /api/candidates     // Create candidate
PUT    /api/candidates/:id // Update candidate
DELETE /api/candidates/:id // Delete candidate

// Applications
GET    /api/applications   // List applications
POST   /api/applications   // Create application
PUT    /api/applications/:id // Update application
DELETE /api/applications/:id // Delete application

// Interviews
GET    /api/interviews     // List interviews
POST   /api/interviews     // Create interview
PUT    /api/interviews/:id // Update interview
DELETE /api/interviews/:id // Delete interview
```

### **File Upload Endpoints**
```typescript
POST /api/upload/resume    // Upload resume
POST /api/upload/avatar    // Upload avatar
```

### **Reporting Endpoints**
```typescript
GET /api/reports/hiring-metrics      // Hiring analytics
GET /api/reports/candidate-pipeline  // Pipeline visualization
GET /api/dashboard/stats             // Dashboard statistics
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **Email Not Sending**
   - Verify Gmail credentials
   - Check 2FA and App Password setup
   - Review SMTP settings

3. **File Upload Failures**
   - Check file size limits
   - Verify file type restrictions
   - Ensure uploads directory exists

4. **Authentication Issues**
   - Verify JWT_SECRET in `.env`
   - Check token expiration
   - Clear browser storage if needed

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run server

# Check server logs
npm run server 2>&1 | tee server.log
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**🎉 Congratulations! You now have a production-ready, enterprise-grade HR dashboard with all the advanced features needed for modern hiring management!** 