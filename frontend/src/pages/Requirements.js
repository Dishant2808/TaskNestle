import React, { useState, useEffect } from 'react';
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

const Requirements = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

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

  // Mock data for demonstration
  const mockCards = [
    {
      id: 1,
      title: "Slack Chat - AI to data dictionary",
      subtitle: "Uncharted",
      description: "Create a Slack Bot to allow users to chat and ask how to best pull and filter data...",
      status: "testing",
      assignee: "Patrick",
      dueDate: "Oct 15, 2025",
      priority: "high",
      client: "Uncharted",
      estimates: { est: "2h", act: "0h", rem: "2h" }
    },
    {
      id: 2,
      title: "Uncharted Systems Overview - Call with Sponsor Team",
      subtitle: "Uncharted", 
      description: "Call with Skyler, Shiloh, Ben, Taryn, etc. and we went over airtable...",
      status: "completed",
      assignee: "Gaurav N",
      dueDate: "Oct 10, 2025",
      priority: "medium",
      client: "Uncharted",
      estimates: { est: "1h", act: "1h", rem: "0h" }
    },
    {
      id: 3,
      title: "Afternoon Consultation",
      subtitle: "Uncharted",
      description: "Afternoon Consultation with Skyler - Discussed Airtable View for Members...",
      status: "completed",
      assignee: "Jone",
      dueDate: "Oct 8, 2025",
      priority: "low",
      client: "Uncharted",
      estimates: { est: "1h", act: "1h", rem: "0h" }
    },
    {
      id: 4,
      title: "WhatsApp Group Automatic Addition",
      subtitle: "Uncharted",
      description: "Add a button on the Event Details Interface that when clicked, will...",
      status: "hold",
      assignee: "Patrick",
      dueDate: "Oct 20, 2025",
      priority: "high",
      client: "Uncharted",
      label: "Client Input Required"
    },
    {
      id: 5,
      title: "NLOs for Newsletters",
      subtitle: "Uncharted",
      description: "NLO Specific Newsletters see comments",
      status: "hold",
      assignee: "Gaurav N",
      dueDate: "Oct 18, 2025",
      priority: "medium",
      client: "Uncharted",
      label: "Client Input Required"
    },
    {
      id: 6,
      title: "Breakout conversations - Link to Sponsor Recommendations",
      subtitle: "Uncharted",
      description: "Show Sponsors what breakout groups what certain people will be in...",
      status: "cancelled",
      assignee: "Osinachi",
      dueDate: "Oct 5, 2025",
      priority: "low",
      client: "Uncharted"
    }
  ];

  const columns = [
    { id: 'testing', title: 'Testing', count: 1, color: 'bg-purple-100 text-purple-800' },
    { id: 'completed', title: 'Completed', count: 420, color: 'bg-green-100 text-green-800' },
    { id: 'hold', title: 'Hold', count: 3, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'cancelled', title: 'Cancelled', count: 58, color: 'bg-red-100 text-red-800' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      testing: 'border-l-purple-500 bg-purple-50',
      completed: 'border-l-green-500 bg-green-50',
      hold: 'border-l-yellow-500 bg-yellow-50',
      cancelled: 'border-l-red-500 bg-red-50'
    };
    return colors[status] || 'border-l-gray-500 bg-gray-50';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading requirements board...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Requirements Board</h1>
            <p className="text-gray-600 mt-1">Manage your requirements through the development lifecycle</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            + New Card
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Q Search by card number or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <User className="h-4 w-4 mr-1" />
              Assignee
            </button>
            <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Priority
            </button>
            <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Building className="h-4 w-4 mr-1" />
              Client
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnCards = mockCards.filter(card => card.status === column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className={`${column.color} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{column.title}</h3>
                  <span className="text-sm font-medium">{column.count}</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {columnCards.map((card) => (
                  <div key={card.id} className={`${getStatusColor(card.status)} border-l-4 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">#{card.id} {card.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Assigned: {card.assignee}</span>
                      <span>Due: {card.dueDate}</span>
                    </div>
                    
                    {card.estimates && (
                      <div className="text-xs text-gray-500 mb-3">
                        Est: {card.estimates.est} • Act: {card.estimates.act} • Rem: {card.estimates.rem}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(card.priority)}`}>
                          {card.priority}
                        </span>
                        {card.label && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {card.label}
                          </span>
                        )}
                      </div>
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
          <Building className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Requirements;
