import React, { useState, useEffect } from 'react';
import { X, Loader, Calendar, User, MessageCircle, Trash2, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { commentAPI } from '../services/api';
import { toast } from 'react-toastify';

const TaskModal = ({ isOpen, onClose, task, onUpdate, onDelete, members = [] }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (task && isOpen) {
      setEditData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        assignedTo: task.assignedTo?._id || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        status: task.status || 'todo'
      });
      fetchComments();
    }
  }, [task, isOpen]);

  const fetchComments = async () => {
    if (!task) return;
    
    try {
      setLoading(true);
      const response = await commentAPI.getComments(task._id);
      if (response.data.success) {
        setComments(response.data.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setCommentLoading(true);
      const response = await commentAPI.addComment(task._id, newComment);
      if (response.data.success) {
        setComments([...comments, response.data.data.comment]);
        setNewComment('');
        toast.success('Comment added successfully!');
      } else {
        toast.error(response.data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onUpdate(task._id, editData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await onDelete(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {editing ? 'Edit Task' : 'Task Details'}
                </h3>
                <div className="flex space-x-2">
                  <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Task Details */}
              <div className="space-y-4">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        className="input mt-1"
                        value={editData.title}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        className="input mt-1"
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          className="input mt-1"
                          value={editData.priority}
                          onChange={(e) => setEditData({...editData, priority: e.target.value})}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          className="input mt-1"
                          value={editData.status}
                          onChange={(e) => setEditData({...editData, status: e.target.value})}
                        >
                          <option value="todo">To Do</option>
                          <option value="discovery">Discovery</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="testing">Testing</option>
                          <option value="completed">Completed</option>
                          <option value="hold">Hold</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Assign To</label>
                        <select
                          className="input mt-1"
                          value={editData.assignedTo}
                          onChange={(e) => setEditData({...editData, assignedTo: e.target.value})}
                        >
                          <option value="">Unassigned</option>
                          {members.map((member) => (
                            <option key={member._id} value={member._id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                          type="date"
                          className="input mt-1"
                          value={editData.dueDate}
                          onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditing(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                      {task.description && (
                        <p className="text-gray-600 mt-2">{task.description}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">Assigned to:</span>
                        <span className="ml-2 font-medium">
                          {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                        </span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">Due:</span>
                          <span className="ml-2 font-medium">
                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Comments Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comments ({comments.length})
                </h4>
                
                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="input flex-1"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={commentLoading || !newComment.trim()}
                    >
                      {commentLoading ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </form>
                
                {/* Comments List */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4">
                      <Loader className="h-6 w-6 animate-spin mx-auto" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {comment.createdBy.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{comment.createdBy.name}</span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
