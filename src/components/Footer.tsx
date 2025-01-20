import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
        <div>
          © {currentYear} Event Manager. All rights reserved.
        </div>
        <div className="text-right">
          <p>Unauthorized use or reproduction of this application is strictly prohibited.</p>
          <p className="text-gray-500">
            Developed by 
            <span className="font-medium text-blue-600">
            <a href="mailto:aleem.btech@gmail.com">Aleem Mohammed</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;