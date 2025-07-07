'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobApplication, Statistics } from '@/types';
import { applicationService } from '@/lib/api';
import { format } from 'date-fns';

interface DashboardProps {
  applications: JobApplication[];
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ applications, loading }) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await applicationService.getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [applications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview Completed':
        return 'bg-purple-100 text-purple-800';
      case 'Waiting for Response':
        return 'bg-orange-100 text-orange-800';
      case 'Offer Received':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentApplications = applications
    .sort((a, b) => new Date(b.created_at || b.application_date).getTime() - new Date(a.created_at || a.application_date).getTime())
    .slice(0, 5);

  const upcomingInterviews = applications
    .filter(app => app.interview_date && new Date(app.interview_date) > new Date())
    .sort((a, b) => new Date(a.interview_date!).getTime() - new Date(b.interview_date!).getTime())
    .slice(0, 3);

  if (loading || statsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/applications/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Application
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
          </div>
        </div>

        {stats?.byStatus.map((item) => (
          <div key={item.status} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                <span className="text-sm font-medium">{item.status}</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {app.position_title}
                    </Link>
                    <p className="text-sm text-gray-600">{app.company_name}</p>
                    <p className="text-xs text-gray-500">
                      Applied {format(new Date(app.application_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No applications yet</p>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
          {upcomingInterviews.length > 0 ? (
            <div className="space-y-4">
              {upcomingInterviews.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {app.position_title}
                    </Link>
                    <p className="text-sm text-gray-600">{app.company_name}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(app.interview_date!), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className="text-2xl">📅</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming interviews</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;