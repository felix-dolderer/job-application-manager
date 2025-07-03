import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { JobApplication } from '../types';
import { applicationService } from '../services/api';
import { format } from 'date-fns';

interface ApplicationDetailProps {
  onApplicationUpdated: (application: JobApplication) => void;
  onApplicationDeleted: (id: number) => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  onApplicationUpdated,
  onApplicationDeleted,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const app = await applicationService.getApplication(parseInt(id));
        setApplication(app);
        setError(null);
      } catch (err) {
        setError('Failed to load application details');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

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

  const handleDelete = async () => {
    if (!application) return;
    
    if (window.confirm(`Are you sure you want to delete the application for ${application.company_name}?`)) {
      try {
        await applicationService.deleteApplication(application.id!);
        onApplicationDeleted(application.id!);
        navigate('/applications');
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Application not found'}</p>
          <Link
            to="/applications"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {application.position_title}
          </h1>
          <p className="text-xl text-gray-600">{application.company_name}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
          
          <div className="flex space-x-2">
            <Link
              to={`/applications/${application.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-900">{application.company_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Position</label>
                <p className="text-gray-900">{application.position_title}</p>
              </div>

              {application.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">📍 {application.location}</p>
                </div>
              )}

              {application.salary_range && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Salary Range</label>
                  <p className="text-gray-900">💰 {application.salary_range}</p>
                </div>
              )}

              {application.application_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Application URL</label>
                  <a
                    href={application.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {application.application_url}
                  </a>
                </div>
              )}
            </div>

            {/* Dates and Status */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Timeline
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-500">Application Date</label>
                <p className="text-gray-900">
                  📅 {format(new Date(application.application_date), 'MMMM dd, yyyy')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>

              {application.interview_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Interview Date</label>
                  <p className="text-gray-900">
                    🎯 {format(new Date(application.interview_date), 'MMMM dd, yyyy')}
                  </p>
                </div>
              )}

              {application.follow_up_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Follow-up Date</label>
                  <p className="text-gray-900">
                    📞 {format(new Date(application.follow_up_date), 'MMMM dd, yyyy')}
                  </p>
                </div>
              )}

              {application.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900 text-sm">
                    {format(new Date(application.created_at), 'MMMM dd, yyyy \'at\' h:mm a')}
                  </p>
                </div>
              )}

              {application.updated_at && application.updated_at !== application.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 text-sm">
                    {format(new Date(application.updated_at), 'MMMM dd, yyyy \'at\' h:mm a')}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {(application.contact_person || application.contact_email) && (
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.contact_person && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-gray-900">👤 {application.contact_person}</p>
                    </div>
                  )}

                  {application.contact_email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contact Email</label>
                      <a
                        href={`mailto:${application.contact_email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        📧 {application.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Description */}
            {application.job_description && (
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Job Description
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.job_description}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Notes
                </h2>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <Link
            to="/applications"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Applications
          </Link>
          
          <div className="space-x-3">
            <Link
              to={`/applications/${application.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Edit Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;