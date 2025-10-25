import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { projectAPI, taskAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  Loader,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskModal from '../components/TaskModal';
import InviteModal from '../components/InviteModal';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchTasks();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getProject(id);
      if (response.data.success) {
        setProject(response.data.data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      navigate('/dashboard');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks(id);
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask({ ...taskData, projectId: id });
      if (response.data.success) {
        toast.success('Task created successfully!');
        setShowCreateModal(false);
        fetchTasks();
      } else {
        toast.error(response.data.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await taskAPI.updateTask(taskId, updates);
      if (response.data.success) {
        toast.success('Task updated successfully!');
        fetchTasks();
        setShowTaskModal(false);
        setSelectedTask(null);
      } else {
        toast.error(response.data.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await taskAPI.deleteTask(taskId);
      if (response.data.success) {
        toast.success('Task deleted successfully!');
        fetchTasks();
        setShowTaskModal(false);
        setSelectedTask(null);
      } else {
        toast.error(response.data.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleInviteUser = async (email) => {
    try {
      const response = await projectAPI.inviteUser(id, email);
      if (response.data.success) {
        toast.success('Invitation sent successfully!');
        setShowInviteModal(false);
      } else {
        toast.error(response.data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
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

  const getTaskStats = () => {
    const todo = tasks.filter(task => task.status === 'todo').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const done = tasks.filter(task => task.status === 'done').length;
    return { todo, inProgress, done };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Project not found</h3>
        <p className="mt-1 text-sm text-gray-500">The project you're looking for doesn't exist.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stats = getTaskStats();

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            {project.description && (
              <p className="text-gray-600">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn btn-outline btn-sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Invite
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Members</p>
                <p className="text-lg font-semibold text-gray-900">{project.members?.length || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">To Do</p>
                <p className="text-lg font-semibold text-gray-900">{stats.todo}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-lg font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Done</p>
                <p className="text-lg font-semibold text-gray-900">{stats.done}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="w-full -mx-4 px-4">
        <DndProvider backend={HTML5Backend}>
          <KanbanBoard
            tasks={tasks}
            onTaskClick={openTaskModal}
            onTaskUpdate={handleUpdateTask}
          />
        </DndProvider>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        projectId={id}
        members={project.members || []}
      />

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        members={project.members || []}
      />

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSubmit={handleInviteUser}
        project={project}
      />
    </div>
  );
};

export default Project;
