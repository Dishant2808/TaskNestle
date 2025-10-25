const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
commentSchema.index({ taskId: 1 });
commentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Comment', commentSchema);
