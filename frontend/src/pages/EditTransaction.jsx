import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditTransaction = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    type: 'expense'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Add API base URL detection
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://finance-tracker-backend-afpg.onrender.com';

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      // FIX: Use correct endpoint to fetch specific transaction
      const response = await axios.get(`${API_BASE_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setFormData({
          title: response.data.title,
          amount: response.data.amount,
          category: response.data.category,
          date: new Date(response.data.date).toISOString().split('T')[0],
          type: response.data.type || 'expense'
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      // If specific transaction fetch fails, try to get all transactions
      fetchAllTransactions();
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const transaction = response.data.find(t => t._id === id);
      if (transaction) {
        setFormData({
          title: transaction.title,
          amount: transaction.amount,
          category: transaction.category,
          date: new Date(transaction.date).toISOString().split('T')[0],
          type: transaction.type || 'expense'
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    // Automatically set type to income when Salary is selected
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
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be positive';
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
      // FIX: Use the same API_BASE_URL for update
      await axios.put(`${API_BASE_URL}/api/transactions/${id}`, {
        ...formData,
        amount: parseFloat(formData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating transaction:', error);
      
      // If update fails due to authentication, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading transaction details...</div>
      </div>
    );
  }

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Refund'];
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Rent', 'Utilities'];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="Enter transaction title"
            />
            {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.amount ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="0.00"
            />
            {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-700 text-white font-semibold'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                💰 Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`p-3 border rounded-lg text-center transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-700 text-white font-semibold'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                💸 Expense
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.category ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            >
              <option value="" className="text-gray-400">Select a category</option>
              <optgroup label="Income Categories">
                {incomeCategories.map(cat => (
                  <option key={cat} value={cat} className="text-gray-800">{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Expense Categories">
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat} className="text-gray-800">{cat}</option>
                ))}
              </optgroup>
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-400">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.date ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
            {errors.date && <p className="mt-2 text-sm text-red-400">{errors.date}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              📝 Update Transaction
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ← Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
