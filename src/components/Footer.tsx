import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  if (isLoading) {
    return null;
  }
  
  return (
    <footer className="py-4 px-6 bg-gray-50 border-t">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div>
          {t('footer.copyright', { year: currentYear })} | {t('footer.by')}
          <a href="mailto:aleem.btech@gmail.com"> Aleem Mohammed</a>
        </div>
        <div>{t('footer.rights')}</div>
      </div>
    </footer>
  );
};

export default Footer;