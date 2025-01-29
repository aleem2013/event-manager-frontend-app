import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Calendar, Sparkles, Film, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  if (isLoginPage) return null;

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-violet-900 shadow-lg relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="EventPro Home"
            >
              <div className="relative">
                <Calendar className="h-8 w-8 text-white group-hover:text-blue-300 transition-colors" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                               from-blue-200 to-purple-200 group-hover:from-blue-100 group-hover:to-purple-100">
                  EventPro
                </span>
                <span className="text-xs text-blue-200 group-hover:text-blue-100">Entertainment & Media</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex md:ml-8 md:space-x-8">
                {isAdmin() && (
                  <Link
                    to="/create-event"
                    className="flex items-center px-3 py-1 text-blue-100 hover:text-white transition-colors
                             rounded-full hover:bg-white/10"
                  >
                    <Film className="h-4 w-4 mr-2" />
                    {t('events.create.title')}
                  </Link>
                )}
                <Link
                  to="/scan"
                  className="flex items-center px-3 py-1 text-blue-100 hover:text-white transition-colors
                           rounded-full hover:bg-white/10"
                >
                  <Music className="h-4 w-4 mr-2" />
                  {t('tickets.scan.title')}
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Auth Buttons and Language Switcher */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-blue-100 border border-blue-400/30 hover:bg-white/10 
                             transition-all duration-300"
                  >
                    {t('auth.register.title')}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white 
                           hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('auth.logout.title')}
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center space-x-4 md:hidden">
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 bg-gradient-to-b from-transparent to-blue-900/50 backdrop-blur-lg">
            {isAuthenticated && (
              <div className="space-y-2 pt-2 pb-3">
                {isAdmin() && (
                  <Link
                    to="/create-event"
                    className="block px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg 
                             transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Film className="h-4 w-4 mr-2" />
                    {t('events.create.title')}
                  </Link>
                )}
                <Link
                  to="/scan"
                  className="block px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg 
                           transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Music className="h-4 w-4 mr-2" />
                  {t('tickets.scan.title')}
                </Link>
              </div>
            )}
            
            <div className="pt-4 border-t border-blue-800">
              {isAuthenticated ? (
                <div className="space-y-2 p-2">
                  {isAdmin() && (
                    <Link
                      to="/register"
                      className="block w-full text-center px-4 py-2 rounded-lg text-blue-100 border border-blue-400/30 
                               hover:bg-white/10 transition-colors"
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
                    className="block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 
                             text-white hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    {t('auth.logout.title')}
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