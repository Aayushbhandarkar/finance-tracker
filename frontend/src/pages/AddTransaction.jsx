import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionList from '../components/TransactionList';
import AddTransaction from './AddTransaction';

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // toggle AddTransaction form
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://finance-tracker-backend-afpg.onrender.com/api/transactions',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handleAddTransactionSuccess = () => {
    setShowAddForm(false); // close the form
    fetchTransactions();   // refresh transactions
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
      {/* Header */}
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
        {/* Total Income */}
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

        {/* Total Expenses */}
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

        {/* Total Transactions */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-400">Total Transactions</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{totalTransactions}</p>
        </div>

        {/* Balance */}
        <div className={`bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg ${balance >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <h3 className={`text-lg font-semibold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>Balance</h3>
          <p className={`text-2xl sm:text-3xl font-bold mt-2 ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Transaction
        </button>
      </div>

      {/* Show AddTransaction Form */}
      {showAddForm && <AddTransaction onSuccess={handleAddTransactionSuccess} />}

      {/* Transactions List */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
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
