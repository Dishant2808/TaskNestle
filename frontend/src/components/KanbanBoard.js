import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { Plus, Clock, AlertCircle, CheckCircle, Search, Eye, TestTube, Pause, X } from 'lucide-react';

const KanbanBoard = ({ tasks, onTaskClick, onTaskUpdate }) => {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: Clock,
      color: 'bg-gray-100 text-gray-800',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      id: 'discovery',
      title: 'Discovery',
      icon: Search,
      color: 'bg-purple-100 text-purple-800',
      tasks: tasks.filter(task => task.status === 'discovery')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: AlertCircle,
      color: 'bg-blue-100 text-blue-800',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      id: 'review',
      title: 'Review',
      icon: Eye,
      color: 'bg-yellow-100 text-yellow-800',
      tasks: tasks.filter(task => task.status === 'review')
    },
    {
      id: 'testing',
      title: 'Testing',
      icon: TestTube,
      color: 'bg-orange-100 text-orange-800',
      tasks: tasks.filter(task => task.status === 'testing')
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
      tasks: tasks.filter(task => task.status === 'completed')
    },
    {
      id: 'hold',
      title: 'Hold',
      icon: Pause,
      color: 'bg-red-100 text-red-800',
      tasks: tasks.filter(task => task.status === 'hold')
    },
    {
      id: 'cancelled',
      title: 'Cancelled',
      icon: X,
      color: 'bg-gray-100 text-gray-600',
      tasks: tasks.filter(task => task.status === 'cancelled')
    }
  ];

  const handleTaskDrop = (taskId, newStatus) => {
    onTaskUpdate(taskId, { status: newStatus });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 150px)' }}>
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onTaskDrop={handleTaskDrop}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};

const Column = ({ column, onTaskDrop, onTaskClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.status !== column.id) {
        onTaskDrop(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const Icon = column.icon;

  return (
    <div
      ref={drop}
      className={`rounded-lg border-2 border-dashed p-6 min-h-[calc(100vh-200px)] w-96 flex-shrink-0 transition-colors ${
        isOver ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className={`badge ${column.color}`}>
            {column.tasks.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {column.tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Icon className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">No tasks in this column</p>
          </div>
        ) : (
          column.tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
