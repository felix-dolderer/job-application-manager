import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { JobApplication, ApplicationStatus } from '../types';
import { applicationService } from '../services/api';
import { format } from 'date-fns';

interface ApplicationListProps {
  applications: JobApplication[];
  loading: boolean;
  onApplicationDeleted: (id: number) => void;
  onApplicationUpdated: (application: JobApplication) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  loading,
  onApplicationDeleted,
  onApplicationUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const statusOptions: ApplicationStatus[] = [
    'Applied',
    'Interview Scheduled',
    'Interview Completed',
    'Waiting for Response',
    'Offer Received',
    'Rejected',
    'Withdrawn',
  ];

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

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter((app) => {
      const matchesSearch = searchTerm === '' || 
        app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === '' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.application_date).getTime() - new Date(b.application_date).getTime();
          break;
        case 'company':
          comparison = a.company_name.localeCompare(b.company_name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleDelete = async (id: number, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete the application for ${companyName}?`)) {
      try {
        await applicationService.deleteApplication(id);
        onApplicationDeleted(id);
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: ApplicationStatus) => {
    try {
      await applicationService.updateApplication(id, { status: newStatus });
      const updatedApp = applications.find(app => app.id === id);
      if (updatedApp) {
        onApplicationUpdated({ ...updatedApp, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <Link
          to="/applications/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Application
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by company, position, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'company' | 'status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Application Date</option>
              <option value="company">Company</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedApplications.length} of {applications.length} applications
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredAndSortedApplications.length > 0 ? (
          filteredAndSortedApplications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      to={`/applications/${app.id}`}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {app.position_title}
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-2">{app.company_name}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {app.location && (
                      <span>📍 {app.location}</span>
                    )}
                    {app.salary_range && (
                      <span>💰 {app.salary_range}</span>
                    )}
                    <span>📅 Applied {format(new Date(app.application_date), 'MMM dd, yyyy')}</span>
                    {app.interview_date && (
                      <span>🎯 Interview {format(new Date(app.interview_date), 'MMM dd, yyyy')}</span>
                    )}
                  </div>

                  {app.notes && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{app.notes}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id!, e.target.value as ApplicationStatus)}
                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <Link
                    to={`/applications/${app.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit"
                  >
                    ✏️
                  </Link>

                  <button
                    onClick={() => handleDelete(app.id!, app.company_name)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 text-lg">
              {applications.length === 0 
                ? "No applications yet. Add your first application to get started!"
                : "No applications match your current filters."
              }
            </p>
            {applications.length === 0 && (
              <Link
                to="/applications/new"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Application
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;