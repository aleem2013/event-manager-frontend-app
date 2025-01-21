import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

export default LoadingSpinner;