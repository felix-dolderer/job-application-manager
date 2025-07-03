# Job Application Tracker

A modern web application to help you track and manage your job applications during your job search. Built with React (TypeScript) frontend and Node.js/Express backend with SQLite database.

## Features

### 🎯 Core Functionality
- **Add Applications**: Track company name, position, location, salary range, and more
- **Status Management**: Update application status (Applied, Interview Scheduled, Rejected, etc.)
- **Search & Filter**: Find applications by company, position, or location
- **Detailed View**: View comprehensive details for each application

### 📊 Dashboard & Analytics
- **Overview Dashboard**: Get insights into your job search progress
- **Application Statistics**: View breakdown by status and recent activity
- **Upcoming Interviews**: Track scheduled interviews
- **Recent Applications**: See your most recent applications

### 🔍 Organization Features
- **Advanced Filtering**: Filter by status, company, or search terms
- **Sorting Options**: Sort by date, company, or status
- **Contact Tracking**: Store contact person and email information
- **Notes & Follow-ups**: Add notes and set follow-up dates

### 💼 Professional Tracking
- **Interview Scheduling**: Track interview dates and outcomes
- **Application URLs**: Save links to job postings
- **Salary Tracking**: Record salary ranges for comparison
- **Timeline**: View application history and updates

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data storage
- **CORS** enabled for cross-origin requests
- **Body Parser** for request parsing

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for modern, responsive styling
- **Axios** for API communication
- **date-fns** for date formatting

## Getting Started

### Prerequisites
- Node.js 16+ installed on your system
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-application-tracker
   ```

2. **Install dependencies for all components**
   ```bash
   npm run install-all
   ```
   This command will install dependencies for the root, server, and client.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend client (port 3000) concurrently.

### Manual Setup (Alternative)

If you prefer to run the servers separately:

1. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend client** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```
   Client will run on http://localhost:3000

### Database Setup

The SQLite database will be automatically created when you first start the server. Sample data is included to help you get started quickly.

## Usage Guide

### Adding Your First Application

1. Click "Add New Application" or navigate to the "Add New" tab
2. Fill in the required fields:
   - **Company Name** (required)
   - **Position Title** (required)
   - **Application Date** (required)
3. Optionally add additional details like salary range, location, notes, etc.
4. Click "Create Application"

### Managing Applications

- **View All**: Navigate to "Applications" to see your complete list
- **Search**: Use the search bar to find specific companies or positions
- **Filter**: Filter by status to focus on specific application stages
- **Sort**: Organize by date, company name, or status
- **Quick Status Update**: Change status directly from the list view

### Using the Dashboard

The dashboard provides a quick overview of your job search:
- **Total Applications**: See how many applications you've submitted
- **Status Breakdown**: Visual breakdown of applications by current status
- **Recent Activity**: Your most recently added applications
- **Upcoming Interviews**: Don't miss any scheduled interviews

### Application Details

Click on any application to view:
- Complete application information
- Timeline of activities
- Contact information
- Notes and follow-up reminders
- Quick edit and delete options

## API Endpoints

The backend provides a REST API with the following endpoints:

- `GET /api/applications` - Get all applications (with optional filtering)
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/stats` - Get application statistics

## Configuration

### Environment Variables

Create a `.env` file in the server directory for custom configuration:

```env
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Database Schema

The application uses a single SQLite table with the following structure:

```sql
applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_description TEXT,
  salary_range TEXT,
  location TEXT,
  application_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  application_url TEXT,
  contact_person TEXT,
  contact_email TEXT,
  notes TEXT,
  interview_date DATE,
  follow_up_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Application Status Options

- **Applied**: Initial application submitted
- **Interview Scheduled**: Interview has been scheduled
- **Interview Completed**: Interview process completed
- **Waiting for Response**: Awaiting feedback after interview
- **Offer Received**: Job offer has been extended
- **Rejected**: Application was not successful
- **Withdrawn**: You withdrew your application

## Development

### Available Scripts

In the project root:
- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run install-all` - Install dependencies for all components

In the server directory:
- `npm run dev` - Start server with nodemon (auto-restart)
- `npm start` - Start server in production mode

In the client directory:
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### File Structure

```
job-application-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── database.js         # Database setup and initialization
│   ├── server.js           # Express server and API routes
│   └── package.json
├── package.json            # Root package.json with scripts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Ensure both client and server are running
3. Verify database connection
4. Check network connectivity between frontend and backend

## Roadmap

Future enhancements could include:
- Email notifications for follow-ups
- Integration with job boards
- Export functionality (PDF, CSV)
- Advanced analytics and reporting
- Multi-user support with authentication
- Mobile app companion

---

**Happy job hunting! 🎯**