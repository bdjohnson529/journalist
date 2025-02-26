import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navigation: React.FC = () => {
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center text-xl font-bold text-primary">
                <img 
                  src="/pen.png" 
                  alt="Pen icon" 
                  className="mr-2 h-5 w-5"
                />
                <span>Journalist</span>
              </Link>
            </div>
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-primary hover:border-primary"
              >
                Upload
              </Link>
              <Link
                to="/journal"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-primary hover:border-primary"
              >
                Journal
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-primary hover:border-primary"
              >
                Insights
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Desktop sign out button */}
          <div className="hidden sm:flex sm:items-center">
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-80"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-primary hover:bg-gray-50 hover:border-primary text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Upload
          </Link>
          <Link
            to="/journal"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-primary hover:bg-gray-50 hover:border-primary text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Journal
          </Link>
          <Link
            to="/insights"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-primary hover:bg-gray-50 hover:border-primary text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Insights
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-primary hover:bg-gray-50 hover:border-primary text-base font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 