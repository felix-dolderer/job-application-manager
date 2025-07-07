import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/applications/[id] - Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  return new Promise((resolve) => {
    db.get('SELECT * FROM applications WHERE id = ?', [id], (err: any, row: any) => {
      if (err) {
        console.error('Error fetching application:', err.message);
        resolve(NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 }));
      } else if (!row) {
        resolve(NextResponse.json({ error: 'Application not found' }, { status: 404 }));
      } else {
        resolve(NextResponse.json(row));
      }
    });
  });
}

// PUT /api/applications/[id] - Update application
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const {
      company_name, position_title, job_description, salary_range, location,
      application_date, status, application_url, contact_person, contact_email,
      notes, interview_date, follow_up_date
    } = body;

    const query = `UPDATE applications SET
      company_name = ?, position_title = ?, job_description = ?, salary_range = ?,
      location = ?, application_date = ?, status = ?, application_url = ?,
      contact_person = ?, contact_email = ?, notes = ?, interview_date = ?,
      follow_up_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`;

    const queryParams = [
      company_name, position_title, job_description, salary_range, location,
      application_date, status, application_url, contact_person, contact_email,
      notes, interview_date, follow_up_date, id
    ];

    return new Promise((resolve) => {
      db.run(query, queryParams, function(err: any) {
        if (err) {
          console.error('Error updating application:', err.message);
          resolve(NextResponse.json({ error: 'Failed to update application' }, { status: 500 }));
        } else if (this.changes === 0) {
          resolve(NextResponse.json({ error: 'Application not found' }, { status: 404 }));
        } else {
          resolve(NextResponse.json({ message: 'Application updated successfully' }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  return new Promise((resolve) => {
    db.run('DELETE FROM applications WHERE id = ?', [id], function(err: any) {
      if (err) {
        console.error('Error deleting application:', err.message);
        resolve(NextResponse.json({ error: 'Failed to delete application' }, { status: 500 }));
      } else if (this.changes === 0) {
        resolve(NextResponse.json({ error: 'Application not found' }, { status: 404 }));
      } else {
        resolve(NextResponse.json({ message: 'Application deleted successfully' }));
      }
    });
  });
}