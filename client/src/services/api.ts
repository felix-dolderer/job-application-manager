import axios from 'axios';
import { JobApplication, Statistics, FilterOptions } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const applicationService = {
  // Get all applications with optional filters
  getApplications: async (filters?: FilterOptions): Promise<JobApplication[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.company) params.append('company', filters.company);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get(`/api/applications?${params.toString()}`);
    return response.data;
  },

  // Get single application by ID
  getApplication: async (id: number): Promise<JobApplication> => {
    const response = await api.get(`/api/applications/${id}`);
    return response.data;
  },

  // Create new application
  createApplication: async (application: Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; message: string }> => {
    const response = await api.post('/api/applications', application);
    return response.data;
  },

  // Update application
  updateApplication: async (id: number, application: Partial<JobApplication>): Promise<{ message: string }> => {
    const response = await api.put(`/api/applications/${id}`, application);
    return response.data;
  },

  // Delete application
  deleteApplication: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/applications/${id}`);
    return response.data;
  },

  // Get statistics
  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get('/api/stats');
    return response.data;
  },
};

export default api;