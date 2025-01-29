import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string;
    validateFn?: (value: string) => string | undefined;
    onChange?: (value: string) => void;
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

export const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    className = '', 
    error,
    validateFn,
    onChange,
    ...props 
  }) => {
    const [touched, setTouched] = useState(false);
    const [localError, setLocalError] = useState<string>();
    const [value, setValue] = useState('');
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      if (validateFn) {
        const validationError = validateFn(newValue);
        setLocalError(validationError);
      }
      
      if (onChange) {
        onChange(newValue);
      }
    };
  
    const handleBlur = () => {
      setTouched(true);
      if (validateFn) {
        const validationError = validateFn(value);
        setLocalError(validationError);
      }
    };
  
    const displayError = touched && (error || localError);
    const inputStyles = displayError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            {...props}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm 
                       transition-all duration-200 
                       ${inputStyles}
                       ${className}`}
          />
          {displayError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {displayError && (
          <p className="mt-1 text-sm text-red-600 animate-fadeIn">
            {error || localError}
          </p>
        )}
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