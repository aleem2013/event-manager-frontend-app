import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  if (isLoading) {
    return null;
  }
  
  return (
    <footer className="py-4 px-6 bg-gray-50 border-t mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-1 mb-2 sm:mb-0">
          <span>{t('footer.copyright', { year: currentYear })}</span>
          <span className="mx-1">|</span>
          <span>{t('footer.by')}</span>
          <a 
            href="mailto:aleem.btech@gmail.com"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors ml-1"
            aria-label={t('footer.emailLabel')}
          >
            <span>Aleem Mohammed</span>
            <Mail className="h-4 w-4" />
          </a>
        </div>
        <div className="text-center sm:text-right">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;