import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../utils/auth/useAuth';
import toast from 'react-hot-toast';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gdprConsent: false,
    marketingConsent: false
  });

  const navigate = useNavigate();
  const { register, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!formData.gdprConsent) {
        toast.error("Vous devez accepter le traitement de vos données pour continuer.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }

      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (success) {
        toast.success("Inscription réussie !");
        navigate('/app');
      } else {
        toast.error(error || "Une erreur est survenue lors de l'inscription");
      }
    } catch (err) {
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
          Nom complet
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400 dark:text-dark-secondary" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-standard pl-10 w-full"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
          Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 dark:text-dark-secondary" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-standard pl-10 w-full"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
          Mot de passe
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 dark:text-dark-secondary" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-standard pl-10 pr-10 w-full"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
          Confirmer le mot de passe
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 dark:text-dark-secondary" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="input-standard pl-10 pr-10 w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id="gdpr"
              name="gdpr"
              type="checkbox"
              required
              checked={formData.gdprConsent}
              onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark rounded dark:bg-dark-paper"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="gdpr" className="font-medium text-gray-700 dark:text-dark-primary">
              J'accepte le traitement de mes données (RGPD)
            </label>
            <p className="text-gray-500 dark:text-dark-secondary">
              En cochant cette case, vous acceptez notre{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-500">
                politique de confidentialité
              </a>
            </p>
          </div>
        </div>

        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id="marketing"
              name="marketing"
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark rounded dark:bg-dark-paper"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="marketing" className="font-medium text-gray-700 dark:text-dark-primary">
              J'accepte de recevoir des communications marketing
            </label>
            <p className="text-gray-500 dark:text-dark-secondary">
              Vous pouvez vous désabonner à tout moment.
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="button-primary w-full"
        >
          {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
        </button>
      </div>
    </form>
  );
}