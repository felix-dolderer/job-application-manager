import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET /api/stats - Get statistics
export async function GET() {
  const queries = [
    'SELECT COUNT(*) as total FROM applications',
    'SELECT status, COUNT(*) as count FROM applications GROUP BY status',
    'SELECT DATE(application_date) as date, COUNT(*) as count FROM applications WHERE application_date >= date("now", "-30 days") GROUP BY DATE(application_date) ORDER BY date',
  ];

  return new Promise((resolve) => {
    Promise.all(queries.map(query => {
      return new Promise((queryResolve, queryReject) => {
        db.all(query, (err: any, rows: any) => {
          if (err) queryReject(err);
          else queryResolve(rows);
        });
      });
    }))
    .then(([totalResult, statusResult, recentResult]: any[]) => {
      resolve(NextResponse.json({
        total: totalResult[0].total,
        byStatus: statusResult,
        recentApplications: recentResult
      }));
    })
    .catch((err: any) => {
      console.error('Error fetching stats:', err.message);
      resolve(NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 }));
    });
  });
}