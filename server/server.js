const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all applications
app.get('/api/applications', (req, res) => {
  const { status, company, search } = req.query;
  
  let query = 'SELECT * FROM applications WHERE 1=1';
  let params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (company) {
    query += ' AND company_name LIKE ?';
    params.push(`%${company}%`);
  }

  if (search) {
    query += ' AND (company_name LIKE ? OR position_title LIKE ? OR job_description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching applications:', err.message);
      res.status(500).json({ error: 'Failed to fetch applications' });
    } else {
      res.json(rows);
    }
  });
});

// Get single application
app.get('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM applications WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching application:', err.message);
      res.status(500).json({ error: 'Failed to fetch application' });
    } else if (!row) {
      res.status(404).json({ error: 'Application not found' });
    } else {
      res.json(row);
    }
  });
});

// Create new application
app.post('/api/applications', (req, res) => {
  const {
    company_name, position_title, job_description, salary_range, location,
    application_date, status, application_url, contact_person, contact_email,
    notes, interview_date, follow_up_date
  } = req.body;

  if (!company_name || !position_title || !application_date) {
    return res.status(400).json({ error: 'Company name, position title, and application date are required' });
  }

  const query = `INSERT INTO applications (
    company_name, position_title, job_description, salary_range, location,
    application_date, status, application_url, contact_person, contact_email,
    notes, interview_date, follow_up_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    company_name, position_title, job_description, salary_range, location,
    application_date, status || 'Applied', application_url, contact_person,
    contact_email, notes, interview_date, follow_up_date
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error creating application:', err.message);
      res.status(500).json({ error: 'Failed to create application' });
    } else {
      res.status(201).json({ id: this.lastID, message: 'Application created successfully' });
    }
  });
});

// Update application
app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const {
    company_name, position_title, job_description, salary_range, location,
    application_date, status, application_url, contact_person, contact_email,
    notes, interview_date, follow_up_date
  } = req.body;

  const query = `UPDATE applications SET
    company_name = ?, position_title = ?, job_description = ?, salary_range = ?,
    location = ?, application_date = ?, status = ?, application_url = ?,
    contact_person = ?, contact_email = ?, notes = ?, interview_date = ?,
    follow_up_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`;

  const params = [
    company_name, position_title, job_description, salary_range, location,
    application_date, status, application_url, contact_person, contact_email,
    notes, interview_date, follow_up_date, id
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error updating application:', err.message);
      res.status(500).json({ error: 'Failed to update application' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Application not found' });
    } else {
      res.json({ message: 'Application updated successfully' });
    }
  });
});

// Delete application
app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM applications WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting application:', err.message);
      res.status(500).json({ error: 'Failed to delete application' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Application not found' });
    } else {
      res.json({ message: 'Application deleted successfully' });
    }
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM applications',
    'SELECT status, COUNT(*) as count FROM applications GROUP BY status',
    'SELECT DATE(application_date) as date, COUNT(*) as count FROM applications WHERE application_date >= date("now", "-30 days") GROUP BY DATE(application_date) ORDER BY date',
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }))
  .then(([totalResult, statusResult, recentResult]) => {
    res.json({
      total: totalResult[0].total,
      byStatus: statusResult,
      recentApplications: recentResult
    });
  })
  .catch(err => {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});