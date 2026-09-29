export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7265/api';

export const endpoints = {
  employees: `${API_BASE_URL}/Employee`,
  branches: `${API_BASE_URL}/Branch`,
  appointments: `${API_BASE_URL}/Appointment`
};