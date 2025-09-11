const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Salary',
      'Freelance',
      'Investment',
      'Food',
      'Transport',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Education',
      'Other'
    ]
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: ['income', 'expense'],
    default: 'expense'
  },
  frequency: {
    type: String,
    enum: ['one-time', 'daily', 'weekly', 'monthly', 'yearly', 'custom'],
    default: 'one-time'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);