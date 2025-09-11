import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const DeleteTransaction = () => {
  const [transaction, setTransaction] = useState(null);
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
      setTransaction(response.data);
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
      const foundTransaction = response.data.find(t => t._id === id);
      setTransaction(foundTransaction);
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

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      // FIX: Use the same API_BASE_URL for delete
      await axios.delete(`${API_BASE_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      
      // If delete fails due to authentication, redirect to login
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

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center">
          <p className="text-gray-300 mb-4">Transaction not found.</p>
          <Link 
            to="/" 
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">Delete Transaction</h2>
        <p className="text-gray-300 mb-6 text-center">Are you sure you want to delete this transaction? This action cannot be undone.</p>
        
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8">
          <div className="space-y-3">
            <p className="text-gray-300">
              <strong className="text-gray-400">Title:</strong> {transaction.title}
            </p>
            <p className={`font-medium ${
              transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
            }`}>
              <strong className="text-gray-400">Amount:</strong> ${Math.abs(transaction.amount).toFixed(2)}
              <span className="text-gray-400 ml-1">
                ({transaction.type})
              </span>
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-400">Category:</strong> {transaction.category}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-400">Date:</strong> {new Date(transaction.date).toLocaleDateString()}
            </p>
            {transaction.description && (
              <p className="text-gray-300">
                <strong className="text-gray-400">Description:</strong> {transaction.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🗑️ Confirm Delete
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ← Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTransaction;
