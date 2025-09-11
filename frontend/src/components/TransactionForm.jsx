import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionForm = ({ transaction, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    frequency: 'one-time',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && transaction) {
      setFormData({
        title: transaction.title || '',
        amount: transaction.amount || '',
        category: transaction.category || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: transaction.type || 'expense',
        frequency: transaction.frequency || 'one-time',
        description: transaction.description || ''
      });
    }
  }, [transaction, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    // Automatically set type to "income" when Salary is selected
    if (name === 'category' && value === 'Salary') {
      updatedFormData.type = 'income';
    }

    setFormData(updatedFormData);
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) newErrors.amount = 'Must be positive number';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Refund'];
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Rent', 'Utilities'];

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          {isEditing ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <p className="text-gray-400 mt-2">
          {isEditing ? 'Update your transaction details' : 'Track your income and expenses'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none bg-gray-800 text-white placeholder-gray-500 ${
              errors.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-indigo-500'
            }`}
          />
          {errors.title && <p className="mt-2 text-sm text-red-400">⚠ {errors.title}</p>}
        </div>

        {/* Amount & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">$</span>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none bg-gray-800 text-white placeholder-gray-500 ${
                  errors.amount ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.amount && <p className="mt-2 text-sm text-red-400">⚠ {errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-700 text-white font-semibold shadow-md'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                💰 Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-700 text-white font-semibold shadow-md'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                💸 Expense
              </button>
            </div>
          </div>
        </div>

        {/* Category & Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none bg-gray-800 text-white placeholder-gray-500 ${
                errors.category ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-indigo-500'
              }`}
            >
              <option value="">Select category</option>
              <optgroup label="Income Categories">
                {incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Expense Categories">
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-400">⚠ {errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Frequency *</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-800 text-white"
            >
              <option value="one-time">One Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Date & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none bg-gray-800 text-white ${
                errors.date ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-indigo-500'
              }`}
            />
            {errors.date && <p className="mt-2 text-sm text-red-400">⚠ {errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-800 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-all"
          >
            {isSubmitting ? '⏳ Processing...' : isEditing ? '📝 Update' : '➕ Add Transaction'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 shadow-md transition-all"
          >
            ← Cancel
          </button>
        </div>
      </form>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="font-semibold text-indigo-400 mb-2">💡 Quick Tips:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Selecting "Salary" will automatically set type to Income</li>
          <li>• Use specific titles for better tracking</li>
          <li>• Set recurring transactions for regular items</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionForm;