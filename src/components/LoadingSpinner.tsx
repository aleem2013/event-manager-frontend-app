import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner: React.FC = () => {
    const { t } = useTranslation();
    
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">{t('common.loading')}</p>
      </div>
    );
  };
  
  export default LoadingSpinner;