import { useMutation } from '@tanstack/react-query';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.access_token);
      navigate('/');
      toast.success(t('auth.register.success'));
    },
    onError: () => {
      toast.error(t('auth.register.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{t('auth.register.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('auth.register.name')}</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('auth.register.email')}</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('auth.register.password')}</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? t('auth.register.submitting') : t('auth.register.submit')}
        </button>
      </form>
    </div>
  );
};

export default Register;