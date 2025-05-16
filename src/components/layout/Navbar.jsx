import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toggleMenu();
    closeUserDropdown();
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-display font-bold text-gray-900">Student Design</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex space-x-10">
              <Link 
                to="/"
                className={`font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/gallery"
                className={`font-medium transition-colors duration-200 ${
                  isActive('/gallery') 
                    ? 'text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Gallery
              </Link>
              <Link 
                to="/teams"
                className={`font-medium transition-colors duration-200 ${
                  isActive('/teams') 
                    ? 'text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Teams
              </Link>
              {currentUser && (
                <Link 
                  to="/upload"
                  className={`font-medium transition-colors duration-200 ${
                    isActive('/upload') 
                      ? 'text-primary-600' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Upload
                </Link>
              )}
            </div>
          </div>

          {/* Action Buttons - Right */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative user-dropdown-container">
                <button 
                  onClick={toggleUserDropdown}
                  className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <UserCircleIcon className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="font-medium text-gray-800">{currentUser.name}</span>
                </button>
                <div 
                  className={`
                    absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-10
                    transform origin-top-right transition-all duration-200
                    ${isUserDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                  `}
                >
                  <Link 
                    to={`/profile/${currentUser.id}`} 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-primary-600" />
                      <span>My Profile</span>
                    </div>
                  </Link>
                  <Link 
                    to="/teams" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 mr-2 text-primary-600" />
                      <span>My Teams</span>
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-accent-600" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-6 py-2 font-medium transition-colors duration-200 ${
                    isActive('/login')
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`px-6 py-2 font-medium rounded-full transition-colors duration-200 ${
                    isActive('/register')
                      ? 'bg-primary-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden bg-white absolute w-full left-0 z-20 border-t border-gray-100 shadow-lg
          transition-all duration-300 transform origin-top
          ${isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
        `}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link 
            to="/" 
            className={`block py-2 font-medium ${
              isActive('/') 
                ? 'text-primary-600' 
                : 'text-gray-700 hover:text-primary-600'
            }`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className={`block py-2 font-medium ${
              isActive('/gallery') 
                ? 'text-primary-600' 
                : 'text-gray-700 hover:text-primary-600'
            }`}
            onClick={toggleMenu}
          >
            Gallery
          </Link>
          <Link 
            to="/teams" 
            className={`block py-2 font-medium ${
              isActive('/teams') 
                ? 'text-primary-600' 
                : 'text-gray-700 hover:text-primary-600'
            }`}
            onClick={toggleMenu}
          >
            Teams
          </Link>
          
          {currentUser ? (
            <>
              <Link 
                to="/upload" 
                className={`block py-2 font-medium ${
                  isActive('/upload') 
                    ? 'text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={toggleMenu}
              >
                Upload Design
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <Link 
                to={`/profile/${currentUser.id}`} 
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={toggleMenu}
              >
                <div className="flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-primary-600" />
                  <span>My Profile</span>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left py-2 text-gray-700 hover:text-primary-600"
              >
                <div className="flex items-center">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-accent-600" />
                  <span>Logout</span>
                </div>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/login" 
                className={`block px-4 py-2 text-center font-medium border border-gray-200 rounded-lg ${
                  isActive('/login')
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600 hover:border-primary-600'
                }`}
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`block px-4 py-2 text-center text-white font-medium rounded-lg ${
                  isActive('/register')
                    ? 'bg-primary-700'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
                onClick={toggleMenu}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar; 