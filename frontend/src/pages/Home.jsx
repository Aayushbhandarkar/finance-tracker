import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionList from '../components/TransactionList';
import { useAuth } from '../context/AuthContext'; 

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const { user } = useAuth(); 

  useEffect(() => {
    fetchTransactions();
  }, []);

  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://finance-tracker-backend-afpg.onrender.com';

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const totalTransactions = transactions.length;
    const totalTurnover = totalIncome + Math.abs(totalExpenses);

    const categoryWiseIncome = {};
    const categoryWiseExpense = {};

    incomeTransactions.forEach(t => {
      categoryWiseIncome[t.category] = (categoryWiseIncome[t.category] || 0) + t.amount;
    });

    expenseTransactions.forEach(t => {
      categoryWiseExpense[t.category] = (categoryWiseExpense[t.category] || 0) + t.amount;
    });

    return {
      totalIncome,
      totalExpenses: Math.abs(totalExpenses),
      balance,
      totalTransactions,
      totalTurnover,
      categoryWiseIncome,
      categoryWiseExpense
    };
  };

  const {
    totalIncome,
    totalExpenses,
    balance,
    totalTransactions,
    totalTurnover,
    categoryWiseIncome,
    categoryWiseExpense
  } = calculateAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your finances...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header with Time Range Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Finance Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-green-400">Total Income</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">${totalIncome.toFixed(2)}</p>
          <div className="w-full bg-gray-700 h-2 mt-4 rounded-full">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${totalIncome > 0 ? Math.min(100, (totalIncome/(totalIncome+totalExpenses))*100) : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-red-400">Total Expenses</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">${totalExpenses.toFixed(2)}</p>
          <div className="w-full bg-gray-700 h-2 mt-4 rounded-full">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${totalExpenses > 0 ? Math.min(100, (totalExpenses/(totalIncome+totalExpenses))*100) : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-400">Total Transactions</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{totalTransactions}</p>
        </div>

        <div className={`bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg ${balance >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <h3 className={`text-lg font-semibold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>Balance</h3>
          <p className={`text-2xl sm:text-3xl font-bold mt-2 ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Turnover Card */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <h3 className="text-lg font-semibold text-purple-400">Total Turnover</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">${totalTurnover.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Category-wise Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Income by Category */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-green-400">Income by Category</h3>
          {Object.keys(categoryWiseIncome).length > 0 ? (
            <div className="space-y-2 sm:space-y-4">
              {Object.entries(categoryWiseIncome).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="font-medium text-white">{category}</span>
                  </div>
                  <span className="text-green-400 font-bold">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 text-gray-400">
              <p>No income transactions yet</p>
            </div>
          )}
        </div>

        {/* Expenses by Category */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-red-400">Expenses by Category</h3>
          {Object.keys(categoryWiseExpense).length > 0 ? (
            <div className="space-y-2 sm:space-y-4">
              {Object.entries(categoryWiseExpense).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="font-medium text-white">{category}</span>
                  </div>
                  <span className="text-red-400 font-bold">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 text-gray-400">
              <p>No expense transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add Transaction
          </button>
        </div>
        {transactions.length > 0 ? (
          <TransactionList transactions={transactions} />
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p className="text-xl">No transactions found</p>
            <p className="mt-2">Add your first transaction to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
