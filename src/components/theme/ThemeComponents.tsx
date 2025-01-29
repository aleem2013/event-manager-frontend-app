import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};

export const EventCard: React.FC<ComponentProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white backdrop-blur-lg bg-opacity-90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                 text-white px-4 py-2 rounded-md transform hover:scale-105 transition-all duration-300 
                 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
                 disabled:hover:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SectionHeader: React.FC<ComponentProps> = ({ children, className = '' }) => {
  return (
    <h1 className={`text-2xl font-bold bg-clip-text text-transparent 
                    bg-gradient-to-r from-blue-600 to-blue-800 ${className}`}>
      {children}
    </h1>
  );
};

export const NavbarWrapper: React.FC<ComponentProps> = ({ children }) => {
  return (
    <nav className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg border-b border-gray-100">
      {children}
    </nav>
  );
};

export const FormInput: React.FC<FormInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

export const PageContainer: React.FC<ComponentProps> = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  );
};

export const EnhancedFooter: React.FC<ComponentProps> = ({ children }) => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 py-6">
      {children}
    </footer>
  );
};

export const TicketCard: React.FC<ComponentProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6
                    border border-gray-100 bg-opacity-90 backdrop-blur-lg">
      {children}
    </div>
  );
};

export const EnhancedLoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
};