import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 px-6 bg-gray-50 border-t">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div>© {currentYear} Event Manager | Developed by 
            <a href="mailto:aleem.btech@gmail.com">Aleem Mohammed</a>
        </div>
        <div>All rights reserved. Unauthorized use prohibited.</div>
      </div>
    </footer>
  );
};

export default Footer;