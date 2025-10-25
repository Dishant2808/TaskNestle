import React, { useState } from 'react';
import { X, Loader, Mail, User, Shield, UserPlus } from 'lucide-react';

const CreateUserModal = ({ isOpen, onClose, onSubmit, projects = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    projectId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'member',
        projectId: ''
      });
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'member',
      projectId: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <UserPlus className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
                  <p className="text-sm text-gray-500">Add a team member and send login credentials</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="input mt-1"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="input mt-1"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="input mt-1"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be sent to the user via email
                  </p>
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    id="role"
                    className="input mt-1"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                  Add to Project (Optional)
                </label>
                <select
                  name="projectId"
                  id="projectId"
                  className="input mt-1"
                  value={formData.projectId}
                  onChange={handleChange}
                >
                  <option value="">Select a project (optional)</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Email Notification</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Login credentials will be automatically sent to the user's email address.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Create & Send Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
