import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/applications - Get all applications with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const company = searchParams.get('company');
  const search = searchParams.get('search');

  let query = 'SELECT * FROM applications WHERE 1=1';
  const params: any[] = [];

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

  return new Promise((resolve) => {
    db.all(query, params, (err: any, rows: any) => {
      if (err) {
        console.error('Error fetching applications:', err.message);
        resolve(NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows));
      }
    });
  });
}

// POST /api/applications - Create new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name, position_title, job_description, salary_range, location,
      application_date, status, application_url, contact_person, contact_email,
      notes, interview_date, follow_up_date
    } = body;

    if (!company_name || !position_title || !application_date) {
      return NextResponse.json(
        { error: 'Company name, position title, and application date are required' },
        { status: 400 }
      );
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

    return new Promise((resolve) => {
      db.run(query, params, function(err: any) {
        if (err) {
          console.error('Error creating application:', err.message);
          resolve(NextResponse.json({ error: 'Failed to create application' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ id: this.lastID, message: 'Application created successfully' }, { status: 201 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}