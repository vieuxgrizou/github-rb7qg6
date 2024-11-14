import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../utils/auth/useAuth';

export default function TwoFactorForm() {
  const [code, setCode] = React.useState('');
  const navigate = useNavigate();
  const { verifyTwoFactor, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyTwoFactor(code);
    if (success) {
      navigate('/app');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-earth-700">
          Code d'authentification
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-earth-400" />
          </div>
          <input
            id="code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block w-full pl-10 sm:text-sm border-earth-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="123456"
            pattern="[0-9]*"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Vérifier
        </button>
      </div>
    </form>
  );
}