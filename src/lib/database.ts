import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/job_tracker.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  db.run(`CREATE TABLE IF NOT EXISTS applications (
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
  )`, (err) => {
    if (err) {
      console.error('Error creating applications table:', err.message);
    } else {
      console.log('Applications table ready');
    }
  });

  // Add some sample data if the table is empty
  db.get("SELECT COUNT(*) as count FROM applications", (err, row: any) => {
    if (!err && row.count === 0) {
      const sampleData = [
        {
          company_name: 'TechCorp Inc.',
          position_title: 'Software Engineer',
          job_description: 'Full-stack development role working with React and Node.js',
          salary_range: '$80,000 - $120,000',
          location: 'San Francisco, CA',
          application_date: '2024-01-15',
          status: 'Interview Scheduled',
          application_url: 'https://techcorp.com/careers/123',
          contact_person: 'Sarah Johnson',
          contact_email: 'sarah@techcorp.com',
          notes: 'Great company culture, very interested in this role',
          interview_date: '2024-01-25'
        },
        {
          company_name: 'DataSoft Solutions',
          position_title: 'Frontend Developer',
          job_description: 'React specialist for e-commerce platform',
          salary_range: '$70,000 - $95,000',
          location: 'Remote',
          application_date: '2024-01-10',
          status: 'Applied',
          application_url: 'https://datasoft.com/jobs/456',
          notes: 'Applied through LinkedIn, waiting for response'
        }
      ];

      sampleData.forEach(app => {
        db.run(`INSERT INTO applications (
          company_name, position_title, job_description, salary_range, location,
          application_date, status, application_url, contact_person, contact_email,
          notes, interview_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          app.company_name, app.position_title, app.job_description, app.salary_range,
          app.location, app.application_date, app.status, app.application_url,
          app.contact_person, app.contact_email, app.notes, app.interview_date
        ]);
      });
      console.log('Sample data inserted');
    }
  });
}

export default db;