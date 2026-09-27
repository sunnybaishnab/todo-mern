import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Task title must be 120 characters or fewer'],
    },
    priority: {
      type: String,
      required: [true, 'Task priority is required'],
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Task duration is required'],
      validate: {
        validator: (value) => Number.isFinite(value) && value > 0,
        message: 'Duration must be a positive number',
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

const Task = mongoose.model('Task', taskSchema)

export default Task