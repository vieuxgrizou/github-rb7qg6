import React from 'react';
import { Play, Check, X } from 'lucide-react';
import { testAIProvider, testTextGeneration } from '../utils/ai/providerTesting';
import toast from 'react-hot-toast';

interface ApiKeyTesterProps {
  providerId: string;
  apiKey: string;
}

export default function ApiKeyTester({ providerId, apiKey }: ApiKeyTesterProps) {
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{
    success: boolean;
    response?: string;
    error?: string;
  } | null>(null);

  const handleTest = async () => {
    if (!apiKey) {
      toast.error('Veuillez d\'abord entrer une clé API');
      return;
    }

    setTesting(true);
    try {
      // Test de connexion
      const isValid = await testAIProvider(providerId, apiKey);
      if (!isValid) {
        throw new Error('La clé API est invalide');
      }

      // Test de génération
      const response = await testTextGeneration(providerId, apiKey);
      
      setTestResult({ success: true, response });
      toast.success('Test réussi !');
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error.message 
      });
      toast.error(`Échec du test : ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleTest}
        disabled={testing || !apiKey}
        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
          testing
            ? 'bg-gray-400 cursor-not-allowed'
            : testResult?.success
            ? 'bg-green-600 hover:bg-green-700'
            : testResult?.success === false
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {testing ? (
          <>
            <Play className="animate-spin h-4 w-4 mr-2" />
            Test en cours...
          </>
        ) : testResult?.success ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Test réussi
          </>
        ) : testResult?.success === false ? (
          <>
            <X className="h-4 w-4 mr-2" />
            Test échoué
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Tester la clé
          </>
        )}
      </button>

      {testResult?.success && testResult.response && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-900">Réponse de test :</h4>
          <p className="mt-1 text-sm text-gray-500 bg-gray-50 p-2 rounded">
            {testResult.response}
          </p>
        </div>
      )}

      {testResult?.error && (
        <p className="mt-2 text-sm text-red-600">
          {testResult.error}
        </p>
      )}
    </div>
  );
}