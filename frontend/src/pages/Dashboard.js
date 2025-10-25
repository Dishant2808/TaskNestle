import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectAPI, taskAPI } from '../services/api';
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
  Activity
} from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import InviteModal from '../components/InviteModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
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

  const fetchTasks = async () => {
    try {
      // getMyTasks now handles admin vs user logic on the backend
      const response = await taskAPI.getMyTasks();
      
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Don't show error toast for tasks as it's not critical
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await projectAPI.createProject(projectData);
      if (response.data.success) {
        toast.success('Project created successfully!');
        setShowCreateModal(false);
        fetchProjects();
      } else {
        toast.error(response.data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleInviteUser = async (email) => {
    if (!selectedProject) return;
    
    try {
      const response = await projectAPI.inviteUser(selectedProject._id, email);
      if (response.data.success) {
        toast.success('Invitation sent successfully!');
        setShowInviteModal(false);
        setSelectedProject(null);
      } else {
        toast.error(response.data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const openInviteModal = (project) => {
    setSelectedProject(project);
    setShowInviteModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'archived':
        return <FolderOpen className="h-4 w-4" />;
      case 'completed':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}. Here's what's happening with your projects.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </button>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects.reduce((acc, project) => acc + (project.members?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <div key={project._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{project.title}</p>
                <p className="text-sm text-gray-500">Created {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to={`/project/${project._id}`}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">Projects will appear here once created.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          <Link to="/schedule" className="text-sm text-purple-600 hover:text-purple-700">View All</Link>
        </div>
        <div className="space-y-3">
          {projects.slice(0, 3).map((project) => (
            <div key={project._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{project.title}</p>
                <p className="text-sm text-gray-500">
                  {project.status === 'active' ? 'In Progress' : project.status}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'active' ? 'In Progress' : project.status}
                </span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="mx-auto h-8 w-8 text-gray-400" />
              <p className="text-sm mt-2">No scheduled tasks today</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Backlog */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Task Backlog</h3>
          <Link to="/backlog" className="text-sm text-purple-600 hover:text-purple-700">View All</Link>
        </div>
        <div className="space-y-3">
          {tasks.filter(task => ['todo', 'discovery', 'in-progress'].includes(task.status)).slice(0, 4).map((task) => (
            <div key={task._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-500">
                  {task.assignedTo?.name || 'Unassigned'} • {task.projectId?.title || 'No Project'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'todo' 
                    ? 'bg-gray-100 text-gray-800' 
                    : task.status === 'discovery'
                    ? 'bg-purple-100 text-purple-800'
                    : task.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.status === 'todo' ? 'To Do' : 
                   task.status === 'discovery' ? 'Discovery' :
                   task.status === 'in-progress' ? 'In Progress' : task.status}
                </span>
              </div>
            </div>
          ))}
          {tasks.filter(task => ['todo', 'discovery', 'in-progress'].includes(task.status)).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Clock className="mx-auto h-8 w-8 text-gray-400" />
              <p className="text-sm mt-2">No tasks in backlog</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/projects"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderOpen className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">View All Projects</h4>
              <p className="text-sm text-gray-500">Manage and organize your projects</p>
            </div>
          </Link>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Create New Project</h4>
              <p className="text-sm text-gray-500">Start a new project from scratch</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setSelectedProject(null);
        }}
        onSubmit={handleInviteUser}
        project={selectedProject}
      />
    </div>
  );
};

export default Dashboard;
