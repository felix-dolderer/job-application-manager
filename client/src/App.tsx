import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import ApplicationDetail from './components/ApplicationDetail';
import Navigation from './components/Navigation';
import { JobApplication } from './types';
import { applicationService } from './services/api';

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApplicationCreated = (newApplication: JobApplication) => {
    setApplications(prev => [newApplication, ...prev]);
  };

  const handleApplicationUpdated = (updatedApplication: JobApplication) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
  };

  const handleApplicationDeleted = (id: number) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchApplications}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  applications={applications} 
                  loading={loading} 
                />
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ApplicationList 
                  applications={applications}
                  loading={loading}
                  onApplicationDeleted={handleApplicationDeleted}
                  onApplicationUpdated={handleApplicationUpdated}
                />
              } 
            />
            <Route 
              path="/applications/new" 
              element={
                <ApplicationForm 
                  onApplicationCreated={handleApplicationCreated}
                />
              } 
            />
            <Route 
              path="/applications/:id" 
              element={
                <ApplicationDetail 
                  onApplicationUpdated={handleApplicationUpdated}
                  onApplicationDeleted={handleApplicationDeleted}
                />
              } 
            />
            <Route 
              path="/applications/:id/edit" 
              element={
                <ApplicationForm 
                  onApplicationCreated={handleApplicationCreated}
                  onApplicationUpdated={handleApplicationUpdated}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
