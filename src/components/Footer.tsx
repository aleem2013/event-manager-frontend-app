import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Add this import

const Footer: React.FC = () => {
  const { isLoading } = useAuth();
  const currentYear = new Date().getFullYear();
  
  // Don't render footer if loading
  if (isLoading) {
    return null;
  }
  
  return (
    <footer className="py-4 px-6 bg-gray-50 border-t">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div>© {currentYear} Event Manager | Developed by  
            <a href="mailto:aleem.btech@gmail.com"> Aleem Mohammed</a>
        </div>
        <div>All rights reserved. Unauthorized use prohibited.</div>
      </div>
    </footer>
  );
};

export default Footer;