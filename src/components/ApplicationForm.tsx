import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JobApplication, ApplicationStatus } from '../types';
import { applicationService } from '../services/api';
import { format } from 'date-fns';

interface ApplicationFormProps {
  onApplicationCreated?: (application: JobApplication) => void;
  onApplicationUpdated?: (application: JobApplication) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onApplicationCreated,
  onApplicationUpdated,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    job_description: '',
    salary_range: '',
    location: '',
    application_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Applied' as ApplicationStatus,
    application_url: '',
    contact_person: '',
    contact_email: '',
    notes: '',
    interview_date: '',
    follow_up_date: '',
  });

  const statusOptions: ApplicationStatus[] = [
    'Applied',
    'Interview Scheduled',
    'Interview Completed',
    'Waiting for Response',
    'Offer Received',
    'Rejected',
    'Withdrawn',
  ];

  useEffect(() => {
    if (isEditing && id) {
      const fetchApplication = async () => {
        try {
          setLoading(true);
          const app = await applicationService.getApplication(parseInt(id));
          setFormData({
            company_name: app.company_name,
            position_title: app.position_title,
            job_description: app.job_description || '',
            salary_range: app.salary_range || '',
            location: app.location || '',
            application_date: app.application_date,
            status: app.status,
            application_url: app.application_url || '',
            contact_person: app.contact_person || '',
            contact_email: app.contact_email || '',
            notes: app.notes || '',
            interview_date: app.interview_date || '',
            follow_up_date: app.follow_up_date || '',
          });
        } catch (error) {
          console.error('Error fetching application:', error);
          alert('Failed to load application data.');
          navigate('/applications');
        } finally {
          setLoading(false);
        }
      };

      fetchApplication();
    }
  }, [isEditing, id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name.trim() || !formData.position_title.trim()) {
      alert('Company name and position title are required.');
      return;
    }

    try {
      setLoading(true);

      if (isEditing && id) {
        await applicationService.updateApplication(parseInt(id), formData);
        const updatedApp = await applicationService.getApplication(parseInt(id));
        onApplicationUpdated?.(updatedApp);
        alert('Application updated successfully!');
      } else {
        const result = await applicationService.createApplication(formData);
        const newApp = await applicationService.getApplication(result.id);
        onApplicationCreated?.(newApp);
        alert('Application created successfully!');
      }

      navigate('/applications');
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Application' : 'Add New Application'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your job application details' : 'Add a new job application to track'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Google, Microsoft, etc."
            />
          </div>

          {/* Position Title */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Title *
            </label>
            <input
              type="text"
              name="position_title"
              value={formData.position_title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Engineer, Product Manager, etc."
            />
          </div>

          {/* Location */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., San Francisco, CA or Remote"
            />
          </div>

          {/* Salary Range */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., $80,000 - $120,000"
            />
          </div>

          {/* Application Date */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Date *
            </label>
            <input
              type="date"
              name="application_date"
              value={formData.application_date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Application URL */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application URL
            </label>
            <input
              type="url"
              name="application_url"
              value={formData.application_url}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Interview Date */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Date
            </label>
            <input
              type="date"
              name="interview_date"
              value={formData.interview_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Person */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Smith"
            />
          </div>

          {/* Contact Email */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@company.com"
            />
          </div>

          {/* Follow-up Date */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              name="follow_up_date"
              value={formData.follow_up_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Job Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Job requirements, responsibilities, etc."
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes, thoughts, interview feedback, etc."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/applications')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Application' : 'Create Application')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;