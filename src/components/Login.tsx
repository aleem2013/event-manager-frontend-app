// src/components/Login.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../api/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Calendar, Sparkles } from 'lucide-react';
import { 
  ThemeProvider, 
  PageContainer, 
  FormInput, 
  PrimaryButton, 
  SectionHeader 
} from './theme/ThemeComponents';

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  
  const from = (location.state as any)?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.access_token);
      navigate(from, { replace: true });
      toast.success(t('auth.login.success'));
    },
    onError: () => {
      toast.error(t('auth.login.error'));
    },
  });

  const validateEmail = (email: string) => {
    if (!email) {
      return t('validation.email.required');
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return t('validation.email.invalid');
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return t('validation.password.required');
    }
    if (password.length < 6) {
      return t('validation.password.tooShort');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    const newErrors: FormErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);

    // Only proceed if there are no errors
    if (!emailError && !passwordError) {
      mutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col py-6 px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Top Bar with Animation */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg p-4 flex justify-between items-center">
              {/* Logo Section with Animation */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Calendar className="h-8 w-8 text-blue-600 animate-pulse" />
                  <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    EventPro
                  </span>
                  <div className="text-xs text-gray-500">{t('common.subtitle')}</div>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Styling */}
        <PageContainer>
          <div className="flex-grow flex flex-col justify-center mt-24">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <SectionHeader className="text-center text-3xl mb-2">
                {t('auth.login.title')}
              </SectionHeader>
              <p className="text-center text-gray-600 text-sm mb-8">
                {t('auth.login.welcome')}
              </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white/80 backdrop-blur-lg py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput
                    label={t('auth.login.email')}
                    type="email"
                    validateFn={validateEmail}
                    error={errors.email}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, email: value }));
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder={t('auth.login.emailPlaceholder')}
                  />

                  <FormInput
                    label={t('auth.login.password')}
                    type="password"
                    validateFn={validatePassword}
                    error={errors.password}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, password: value }));
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder={t('auth.login.passwordPlaceholder')}
                  />

                  <div>
                    <PrimaryButton
                      type="submit"
                      disabled={mutation.isPending || !!errors.email || !!errors.password}
                      className="w-full flex justify-center"
                    >
                      {mutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          {t('auth.login.submitting')}
                        </div>
                      ) : (
                        t('auth.login.submit')
                      )}
                    </PrimaryButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </ThemeProvider>
  );
};

export default Login;