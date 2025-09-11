import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const TransactionList = ({ transactions }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeBadge = (type) => {
    return type === 'income' ? 'bg-green-800 text-green-100 border border-green-700' : 'bg-red-800 text-red-100 border border-red-700';
  };

  const getFrequencyBadge = (frequency) => {
    const styles = {
      'one-time': 'bg-gray-800 text-gray-100 border border-gray-700',
      'daily': 'bg-blue-800 text-blue-100 border border-blue-700',
      'weekly': 'bg-purple-800 text-purple-100 border border-purple-700',
      'monthly': 'bg-yellow-800 text-yellow-100 border border-yellow-700',
      'yearly': 'bg-indigo-800 text-indigo-100 border border-indigo-700',
      'custom': 'bg-pink-800 text-pink-100 border border-pink-700'
    };
    return styles[frequency] || 'bg-gray-800 text-gray-100';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Salary': '💼', 'Freelance': '💻', 'Investment': '📈', 'Food': '🍕',
      'Transport': '🚗', 'Entertainment': '🎬', 'Shopping': '🛍️', 'Healthcare': '🏥',
      'Education': '🎓', 'Rent': '🏠', 'Utilities': '💡', 'Bonus': '🎁', 'Gift': '🎁'
    };
    return icons[category] || '📊';
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, sortConfig, filterType, filterCategory, searchTerm]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const uniqueCategories = [...new Set(transactions.map(t => t.category))].sort();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-900 rounded-lg shadow-lg">
        <div className="text-6xl mb-4 text-gray-100">📊</div>
        <h3 className="text-xl font-semibold text-gray-200 mb-2">No transactions yet</h3>
        <p className="text-gray-400 mb-4">Start by adding your first transaction</p>
        <Link to="/add" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          ➕ Add First Transaction
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <span className="text-sm text-gray-400">
              Showing {filteredAndSortedTransactions.length} of {transactions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {['title', 'amount', 'type', 'frequency', 'category', 'date'].map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <span className="text-xs">{getSortIcon(key)}</span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredAndSortedTransactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-800">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{transaction.type === 'income' ? '💰' : '💸'}</span>
                    <div>
                      <div className="font-medium text-gray-200">{transaction.title}</div>
                      {transaction.description && (
                        <div className="text-sm text-gray-400 truncate max-w-xs">{transaction.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyBadge(transaction.frequency)}`}>
                    {transaction.frequency}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getCategoryIcon(transaction.category)}</span>
                    <span className="text-sm font-medium text-gray-200">{transaction.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-200">{formatDate(transaction.date)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link to={`/${transaction._id}/edit`} className="inline-flex items-center px-3 py-1 bg-blue-800 text-blue-100 rounded-md hover:bg-blue-700 text-sm">
                      ✏️ Edit
                    </Link>
                    <Link to={`/${transaction._id}/delete`} className="inline-flex items-center px-3 py-1 bg-red-800 text-red-100 rounded-md hover:bg-red-700 text-sm">
                      🗑️ Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedTransactions.length === 0 && transactions.length > 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-gray-200">🔍</div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">No transactions found</h3>
          <p className="text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
