import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader,
  FolderOpen,
  TrendingUp,
  Shield,
  BarChart3,
  Activity,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  User,
  Building
} from 'lucide-react';

const Schedule = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjects();
      if (response.data.success) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-1">Manage your project schedule and deadlines</p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : project.status === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status === 'active' ? 'In Progress' : project.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>{project.members?.length || 0} team members</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Status: {project.status === 'active' ? 'In Progress' : project.status}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to={`/project/${project._id}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Link
              to="/projects"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;