import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(formData.amount)) newErrors.amount = 'Amount must be a number';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/transactions', {
        ...formData,
        amount: parseFloat(formData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center tracking-wide">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 sm:mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
              placeholder="Enter transaction title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 sm:mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 bg-gray-700 border ${errors.amount ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
              placeholder="0.00"
            />
            {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 sm:mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 bg-gray-700 border ${errors.category ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            >
              <option value="" className="text-gray-400">Select a category</option>
              <option value="Salary" className="text-gray-800">Salary</option>
              <option value="Freelance" className="text-gray-800">Freelance</option>
              <option value="Investment" className="text-gray-800">Investment</option>
              <option value="Food" className="text-gray-800">Food</option>
              <option value="Transport" className="text-gray-800">Transport</option>
              <option value="Entertainment" className="text-gray-800">Entertainment</option>
              <option value="Shopping" className="text-gray-800">Shopping</option>
              <option value="Healthcare" className="text-gray-800">Healthcare</option>
              <option value="Education" className="text-gray-800">Education</option>
              <option value="Other" className="text-gray-800">Other</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 sm:mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 bg-gray-700 border ${errors.date ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
            <button
              type="submit"
              className="flex-1 px-4 sm:px-5 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add Transaction
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 sm:px-5 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
