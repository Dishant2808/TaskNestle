import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = api;

export const projectAPI = {
  // Get all projects
  getProjects: () => api.get('/projects'),
  
  // Get single project
  getProject: (id) => api.get(`/projects/${id}`),
  
  // Create project
  createProject: (data) => api.post('/projects', data),
  
  // Update project
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  
  // Delete project
  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  // Add members
  addMembers: (id, memberIds) => api.post(`/projects/${id}/members`, { memberIds }),
  
  // Remove members
  removeMembers: (id, memberIds) => api.delete(`/projects/${id}/members`, { data: { memberIds } }),
  
  // Get project members
  getMembers: (id) => api.get(`/projects/${id}/members`),
};

export const taskAPI = {
  // Get tasks for project
  getTasks: (projectId, params = {}) => api.get(`/projects/${projectId}/tasks`, { params }),
  
  // Get single task
  getTask: (id) => api.get(`/tasks/${id}`),
  
  // Create task
  createTask: (data) => api.post(`/projects/${data.projectId}/tasks`, data),
  
  // Update task
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  
  // Delete task
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  
  // Get my tasks
  getMyTasks: (params = {}) => api.get('/tasks/my-tasks', { params }),
  
  // Get task stats
  getTaskStats: (projectId) => api.get(`/projects/${projectId}/tasks/stats`),
};

export const commentAPI = {
  // Get comments for task
  getComments: (taskId) => api.get(`/tasks/${taskId}/comments`),
  
  // Add comment
  addComment: (taskId, text) => api.post(`/tasks/${taskId}/comments`, { text }),
  
  // Update comment
  updateComment: (commentId, text) => api.put(`/comments/${commentId}`, { text }),
  
  // Delete comment
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export const invitationAPI = {
  // Invite user to project
  inviteUser: (projectId, email) => api.post(`/projects/${projectId}/invite`, { email }),
  
  // Accept invitation
  acceptInvitation: (data) => api.post('/invitations/accept', data),
  
  // Verify invitation
  verifyInvitation: (token) => api.get(`/invitations/verify/${token}`),
};

export default api;
