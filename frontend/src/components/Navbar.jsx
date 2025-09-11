import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false); 
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 text-white p-4 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
        >
          Finance Tracker
        </Link>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            {isOpen ? '✖️' : '☰'}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <span className="text-gray-300">
                Welcome, <span className="font-medium text-white">{user.name}</span>
              </span>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/add"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
              >
                ➕ Add Transaction
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-2">
          {user ? (
            <>
              <span className="block text-gray-300 py-1 px-2">Welcome, <span className="font-medium text-white">{user.name}</span></span>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-white py-2 px-2 rounded transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/add"
                onClick={() => setIsOpen(false)}
                className="block bg-indigo-600 hover:bg-indigo-700 py-2 px-2 rounded text-white font-medium transition-all duration-300"
              >
                ➕ Add Transaction
              </Link>
              <button
                onClick={handleLogout}
                className="block text-gray-300 hover:text-white py-2 px-2 rounded w-full text-left font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-white py-2 px-2 rounded transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block bg-indigo-600 hover:bg-indigo-700 py-2 px-2 rounded text-white font-medium transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
