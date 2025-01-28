import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../api/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Calendar } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <div className="min-h-screen flex flex-col py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      {/* Top Bar with Logo and Language Switcher */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-white shadow-sm">
        {/* Company Logo/Title */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">EventPro</span>
        </div>
        
        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-center mt-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-8">
            {t('auth.login.title')}
          </h1>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('auth.login.email')}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('auth.login.password')}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {mutation.isPending ? t('auth.login.submitting') : t('auth.login.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;