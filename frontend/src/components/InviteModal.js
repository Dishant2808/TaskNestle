import React, { useState } from 'react';
import { X, Loader, Mail } from 'lucide-react';

const InviteModal = ({ isOpen, onClose, onSubmit, project }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(email);
      setEmail('');
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
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
              <div>
                <h3 className="text-lg font-medium text-gray-900">Invite Team Member</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Invite someone to join <strong>{project?.title}</strong>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="input pl-10"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send an invitation email to this address
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
