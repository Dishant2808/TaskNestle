import React from 'react';
import { useDrag } from 'react-dnd';
import { format } from 'date-fns';
import { Calendar, User, MessageCircle } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Normal Priority';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`card cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 ${
        getPriorityColor(task.priority)
      } ${isDragging ? 'opacity-50' : ''} ${isOverdue ? 'ring-2 ring-red-200' : ''}`}
    >
      <div className="card-content">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
          <span className={`badge badge-${task.priority} text-xs`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {task.assignedTo && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate max-w-20">
                  {task.assignedTo.name}
                </span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center ${isOverdue ? 'text-red-600' : ''}`}>
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {format(new Date(task.dueDate), 'MMM dd')}
                </span>
              </div>
            )}
            
            {task.commentCount > 0 && (
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>{task.commentCount}</span>
              </div>
            )}
          </div>
        </div>
        
        {isOverdue && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            Overdue
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
