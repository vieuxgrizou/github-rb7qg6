import React from 'react';
import { Key, Save, HelpCircle } from 'lucide-react';
import ApiKeyTester from '../components/ApiKeyTester';
import { AI_PROVIDERS } from '../utils/aiProviders';

export default function ApiSettings() {
  const [apiKeys, setApiKeys] = React.useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = React.useState(true);

  return (
    <div className="space-y-6">
      <div className="container-card">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
                Configuration des API
              </h3>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
              Configurez vos clés API pour les différents services d'IA.
              Ces clés seront utilisées pour tous vos sites.
            </p>
          </div>

          {showHelp && (
            <div className="md:col-span-2 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Comment obtenir les clés API ?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <strong>OpenAI :</strong> Créez un compte sur{' '}
                          <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">
                            platform.openai.com
                          </a>
                          {' '}et générez une clé API dans les paramètres.
                        </li>
                        <li>
                          <strong>Anthropic :</strong> Inscrivez-vous sur{' '}
                          <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline">
                            console.anthropic.com
                          </a>
                          {' '}pour obtenir une clé API Claude.
                        </li>
                        <li>
                          <strong>Google AI :</strong> Créez un projet sur{' '}
                          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">
                            Google Cloud Console
                          </a>
                          {' '}et activez l'API Gemini.
                        </li>
                        <li>
                          <strong>Mistral AI :</strong> Obtenez une clé sur{' '}
                          <a href="https://console.mistral.ai" target="_blank" rel="noopener noreferrer" className="underline">
                            console.mistral.ai
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 md:mt-0 md:col-span-2">
            <form className="space-y-6">
              {AI_PROVIDERS.map(provider => (
                <div key={provider.id} className="bg-gray-50 dark:bg-dark-hover p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-dark-primary">
                        {provider.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
                        {provider.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-dark-secondary">
                      {provider.models.map(model => (
                        <div key={model.id} className="text-right">
                          {model.name}
                          <span className="ml-2 text-xs text-gray-400 dark:text-dark-secondary">
                            Max {Math.round(model.maxTokens / 1000)}k tokens
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                      Clé API {provider.name}
                    </label>
                    <div className="mt-1 flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark text-gray-500 dark:text-dark-secondary">
                        <Key className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        value={apiKeys[provider.id] || ''}
                        onChange={(e) => setApiKeys({
                          ...apiKeys,
                          [provider.id]: e.target.value
                        })}
                        className="input-standard flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg"
                        placeholder={`Clé ${provider.name}`}
                      />
                    </div>

                    <div className="mt-2">
                      <ApiKeyTester
                        providerId={provider.id}
                        apiKey={apiKeys[provider.id] || ''}
                      />
                    </div>

                    <div className="mt-2 text-sm text-gray-500 dark:text-dark-secondary">
                      {provider.id === 'openai' && (
                        <>
                          <p>Format de clé : sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                          <p>Coût estimé : ~$0.01 par 1000 mots générés</p>
                        </>
                      )}
                      {provider.id === 'anthropic' && (
                        <>
                          <p>Format de clé : sk-ant-xxxxxxxxxxxxxxxxxxxxx</p>
                          <p>Coût estimé : ~$0.015 par 1000 mots générés</p>
                        </>
                      )}
                      {provider.id === 'google' && (
                        <>
                          <p>Format de clé : AIzaSy...</p>
                          <p>Coût estimé : ~$0.008 par 1000 mots générés</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="button-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-card">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-primary">
            Utilisation et quotas
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-dark-secondary">
            <p>Suivez votre consommation d'API et gérez vos quotas.</p>
          </div>
          <div className="mt-5 border-t border-gray-200 dark:border-dark">
            <dl className="divide-y divide-gray-200 dark:divide-dark">
              {AI_PROVIDERS.map(provider => (
                <div key={provider.id} className="py-4 space-y-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-dark-secondary">
                    {provider.name}
                  </dt>
                  <dd className="flex justify-between mt-1">
                    <div className="text-sm text-gray-900 dark:text-dark-primary">
                      0 / 1000 requêtes
                    </div>
                    <div className="text-sm text-gray-500 dark:text-dark-secondary">
                      Renouvellement dans 30 jours
                    </div>
                  </dd>
                  <div className="w-full bg-gray-200 dark:bg-dark rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}