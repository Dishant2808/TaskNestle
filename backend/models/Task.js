const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['todo', 'discovery', 'in-progress', 'review', 'testing', 'completed', 'hold', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });

// Virtual for comment count
taskSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'taskId',
  count: true
});

// Ensure virtual fields are serialized
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
