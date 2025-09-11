import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditTransaction = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const transaction = response.data.find(t => t._id === id);
      if (transaction) {
        setFormData({
          title: transaction.title,
          amount: transaction.amount,
          category: transaction.category,
          date: new Date(transaction.date).toISOString().split('T')[0]
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      setLoading(false);
    }
  };

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
      await axios.put(`http://localhost:5000/api/transactions/${id}`, {
        ...formData,
        amount: parseFloat(formData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading transaction details...</div>
      </div>
    );
  }

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

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
            >
              Update Transaction
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;