# Job Application Tracker

A modern, full-stack Next.js application to track and manage job applications. Built with TypeScript, Tailwind CSS, and SQLite.

## Features

- 📊 Dashboard with statistics and insights
- 📋 Comprehensive application tracking
- 🔍 Search and filter applications
- 📅 Interview scheduling and reminders
- 💾 Local SQLite database storage
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Fast, optimized Next.js performance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with sqlite3
- **UI Components**: Custom components with modern design
- **HTTP Client**: Axios for API calls
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd job-application-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   │   ├── applications/
│   │   │   └── stats/
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page (Dashboard)
│   ├── components/         # React components
│   │   ├── Dashboard.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── lib/               # Utilities and services
│   │   ├── api.ts         # Client-side API service
│   │   └── database.ts    # Database connection
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── package.json
```

## API Endpoints

- `GET /api/applications` - Get all applications (with optional filters)
- `POST /api/applications` - Create a new application
- `GET /api/applications/[id]` - Get a specific application
- `PUT /api/applications/[id]` - Update an application
- `DELETE /api/applications/[id]` - Delete an application
- `GET /api/stats` - Get application statistics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses SQLite with the following main table:

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
