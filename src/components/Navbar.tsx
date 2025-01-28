import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoginPage) return null; // Don't render navbar on login page

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              aria-label="EventPro Home"
            >
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <span>EventPro</span>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex md:ml-8 md:space-x-8">
                {isAdmin() && (
                  <Link
                    to="/create-event"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {t('events.create.title')}
                  </Link>
                )}
                <Link
                  to="/scan"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {t('tickets.scan.title')}
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {t('auth.register.title')}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            {isAuthenticated && (
              <div className="space-y-2 pt-2 pb-3">
                {isAdmin() && (
                  <Link
                    to="/create-event"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('events.create.title')}
                  </Link>
                )}
                <Link
                  to="/scan"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('tickets.scan.title')}
                </Link>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  {isAdmin() && (
                    <Link
                      to="/register"
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('auth.register.title')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;