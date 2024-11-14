import React from 'react';
import { X, Globe2, Key, Lock, MessageSquare, RefreshCw } from 'lucide-react';
import type { WordPressSite } from '../types';
import { validateWordPressConnection } from '../utils/wordpress/validation';
import { AI_PROVIDERS } from '../utils/aiProviders';
import { generateComment } from '../utils/ai/commentGeneration';
import { useAuth } from '../utils/auth/useAuth';
import { useApiKeys } from '../utils/store/apiKeys';
import toast from 'react-hot-toast';

interface SiteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: WordPressSite) => void;
  site?: WordPressSite | null;
}

export default function SiteSettingsModal({ isOpen, onClose, onSave, site }: SiteSettingsModalProps) {
  const { user, checkSession } = useAuth();
  const { getApiKey } = useApiKeys();
  const [activeTab, setActiveTab] = React.useState<'basic' | 'ai' | 'comments'>('basic');
  const [isTesting, setIsTesting] = React.useState(false);
  const [isGeneratingComment, setIsGeneratingComment] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<'none' | 'success' | 'error'>(
    site ? 'success' : 'none'
  );
  const [error, setError] = React.useState<string | null>(null);
  const [generatedComment, setGeneratedComment] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState<WordPressSite>(site || {
    id: crypto.randomUUID(),
    name: '',
    url: '',
    username: '',
    applicationPassword: '',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    autoGenerate: true,
    commentSettings: {
      mode: 'auto',
      frequency: {
        commentsPerDay: 5,
        minDelay: 30,
        maxDelay: 120
      },
      schedule: {
        startTime: '09:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      language: ['fr'],
      replyProbability: 0.3,
      maxCommentsPerPost: 3,
      autoCreatePersonas: true,
      personaCreationRate: 2,
      aiSettings: {
        temperature: 0.7,
        maxTokens: 1000,
        presencePenalty: 0,
        frequencyPenalty: 0
      }
    },
    assignedPersonas: []
  });

  // Vérifier la session à l'ouverture du modal et lors des actions importantes
  React.useEffect(() => {
    const verifySession = async () => {
      const isValid = await checkSession();
      if (!isValid) {
        toast.error('Session expirée, veuillez vous reconnecter');
        onClose();
      }
    };

    if (isOpen) {
      verifySession();
    }
  }, [isOpen, checkSession, onClose]);

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      setError(null);

      // Vérifier la session
      const isValid = await checkSession();
      if (!isValid) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      // Validation de base
      if (!formData.url.trim()) {
        throw new Error("L'URL du site est requise");
      }
      if (!formData.username.trim()) {
        throw new Error("L'identifiant WordPress est requis");
      }
      if (!formData.applicationPassword.trim()) {
        throw new Error("Le mot de passe d'application est requis");
      }

      // Format URL if needed
      let url = formData.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Test de connexion
      const result = await validateWordPressConnection(url, formData.applicationPassword);
      
      if (result.success) {
        setConnectionStatus('success');
        toast.success('Connexion WordPress réussie !');
        
        // Mettre à jour le nom du site si non défini
        if (!formData.name && result.siteInfo?.name) {
          setFormData(prev => ({
            ...prev,
            name: result.siteInfo!.name
          }));
        }
      } else {
        setConnectionStatus('error');
        throw new Error(result.error || "Impossible de se connecter au site WordPress");
      }
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestCommentGeneration = async () => {
    try {
      // Vérifier la session
      const isValid = await checkSession();
      if (!isValid) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      setIsGeneratingComment(true);
      setGeneratedComment(null);
      setError(null);

      // Vérifier que la connexion a été testée
      if (connectionStatus !== 'success') {
        throw new Error('Veuillez d\'abord tester la connexion au site');
      }

      // Vérifier que la clé API est configurée
      const apiKey = getApiKey(formData.aiProvider);
      if (!apiKey) {
        throw new Error(`Veuillez d'abord configurer la clé API ${formData.aiProvider} dans les paramètres`);
      }

      // Simuler un contexte d'article pour le test
      const testContext = {
        postTitle: "Article de test",
        postContent: "Ceci est un article de test pour vérifier la génération de commentaires.",
        existingComments: []
      };

      // Générer un commentaire de test
      const result = await generateComment({
        ...formData,
        apiKey
      }, {
        id: 'test',
        name: 'Test Persona',
        writingStyle: 'Informel',
        tone: 'Amical',
        languages: ['fr'],
        errorRate: 0,
        age: 30,
        gender: 'other',
        topics: [],
        emoji: true,
        useHashtags: false,
        mentionOthers: false,
        includeMedia: false
      }, testContext);

      setGeneratedComment(result.content);
      toast.success('Commentaire généré avec succès !');
    } catch (err) {
      setError(err.message);
      toast.error(`Erreur lors de la génération : ${err.message}`);
    } finally {
      setIsGeneratingComment(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Vérifier la session
      const isValid = await checkSession();
      if (!isValid) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      setIsSaving(true);
      setError(null);

      // Si c'est un nouveau site, on vérifie que la connexion a été testée
      if (!site && connectionStatus !== 'success') {
        throw new Error('Veuillez tester la connexion avant de sauvegarder');
      }

      // Normaliser l'URL si nécessaire
      let url = formData.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Mettre à jour les données avec l'URL normalisée
      const updatedData = {
        ...formData,
        url
      };

      // Appeler la fonction de sauvegarde
      await onSave(updatedData);
      
      // Fermer le modal
      onClose();
      
      // Afficher un message de succès
      toast.success(site ? 'Site mis à jour avec succès' : 'Site ajouté avec succès');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="container-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-dark">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
            {site ? 'Modifier le site' : 'Ajouter un site'}
          </h2>
          <button onClick={onClose} className="text-gray-400 dark:text-dark-secondary hover:text-gray-500 dark:hover:text-dark-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="border-b border-gray-200 dark:border-dark">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('basic')}
                className={`${
                  activeTab === 'basic'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                    : 'border-transparent text-gray-500 dark:text-dark-secondary hover:text-gray-700 dark:hover:text-dark-primary hover:border-gray-300 dark:hover:border-dark'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Informations de base
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`${
                  activeTab === 'ai'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                    : 'border-transparent text-gray-500 dark:text-dark-secondary hover:text-gray-700 dark:hover:text-dark-primary hover:border-gray-300 dark:hover:border-dark'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Configuration IA
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`${
                  activeTab === 'comments'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-500'
                    : 'border-transparent text-gray-500 dark:text-dark-secondary hover:text-gray-700 dark:hover:text-dark-primary hover:border-gray-300 dark:hover:border-dark'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Paramètres des commentaires
              </button>
            </nav>
          </div>

          <div className="mt-4">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 input-standard w-full"
                    placeholder="Mon Blog WordPress"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    URL du site
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary">
                      <Globe2 className="h-4 w-4" />
                    </span>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg input-standard"
                      placeholder="https://monsite.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Identifiant WordPress
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary">
                      <Key className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg input-standard"
                      placeholder="admin"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Mot de passe d'application
                  </label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-dark bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-dark-secondary">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={formData.applicationPassword}
                      onChange={(e) => setFormData({ ...formData, applicationPassword: e.target.value })}
                      className="flex-1 min-w-0 block w-full px-3 rounded-none rounded-r-lg input-standard"
                      placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-secondary">
                    Créez un mot de passe d'application dans les paramètres de votre site WordPress
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className={`button-secondary ${
                      connectionStatus === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                      connectionStatus === 'error' ? 'bg-red-50 text-red-700 border-red-200' : ''
                    }`}
                  >
                    {isTesting ? 'Test en cours...' : 'Tester la connexion'}
                  </button>

                  {error && (
                    <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-red-700 dark:text-red-200 whitespace-pre-line">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Fournisseur d'IA
                  </label>
                  <select
                    value={formData.aiProvider}
                    onChange={(e) => setFormData({
                      ...formData,
                      aiProvider: e.target.value,
                      aiModel: AI_PROVIDERS.find(p => p.id === e.target.value)?.models[0].id || ''
                    })}
                    className="mt-1 input-standard w-full"
                  >
                    {AI_PROVIDERS.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {provider.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Modèle
                  </label>
                  <select
                    value={formData.aiModel}
                    onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
                    className="mt-1 input-standard w-full"
                  >
                    {AI_PROVIDERS.find(p => p.id === formData.aiProvider)?.models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                    Test de génération
                  </label>
                  <button
                    onClick={handleTestCommentGeneration}
                    disabled={isGeneratingComment || !getApiKey(formData.aiProvider)}
                    className="mt-2 button-secondary"
                  >
                    {isGeneratingComment ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Tester la génération
                      </>
                    )}
                  </button>

                  {generatedComment && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-dark-primary mb-2">
                        Commentaire généré :
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-dark-secondary">
                        {generatedComment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary mb-2">
                    Mode de génération
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.commentSettings.mode === 'manual'}
                        onChange={() => setFormData({
                          ...formData,
                          commentSettings: {
                            ...formData.commentSettings,
                            mode: 'manual'
                          },
                          autoGenerate: false
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                        Manuel - Vous validez chaque commentaire avant publication
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.commentSettings.mode === 'auto'}
                        onChange={() => setFormData({
                          ...formData,
                          commentSettings: {
                            ...formData.commentSettings,
                            mode: 'auto'
                          },
                          autoGenerate: true
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-dark-secondary">
                        Automatique - Les commentaires sont publiés selon la planification
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                      Commentaires par jour
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.commentSettings.frequency.commentsPerDay}
                      onChange={(e) => setFormData({
                        ...formData,
                        commentSettings: {
                          ...formData.commentSettings,
                          frequency: {
                            ...formData.commentSettings.frequency,
                            commentsPerDay: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="mt-1 input-standard w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary">
                      Probabilité de réponse
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.commentSettings.replyProbability}
                      onChange={(e) => setFormData({
                        ...formData,
                        commentSettings: {
                          ...formData.commentSettings,
                          replyProbability: parseFloat(e.target.value)
                        }
                      })}
                      className="mt-1 input-standard w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary mb-2">
                    Horaires
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-dark-secondary">
                        Début
                      </label>
                      <input
                        type="time"
                        value={formData.commentSettings.schedule.startTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          commentSettings: {
                            ...formData.commentSettings,
                            schedule: {
                              ...formData.commentSettings.schedule,
                              startTime: e.target.value
                            }
                          }
                        })}
                        className="mt-1 input-standard w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 dark:text-dark-secondary">
                        Fin
                      </label>
                      <input
                        type="time"
                        value={formData.commentSettings.schedule.endTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          commentSettings: {
                            ...formData.commentSettings,
                            schedule: {
                              ...formData.commentSettings.schedule,
                              endTime: e.target.value
                            }
                          }
                        })}
                        className="mt-1 input-standard w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-dark">
            <button
              onClick={onClose}
              className="button-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="button-primary"
              disabled={isSaving || (!site && connectionStatus !== 'success')}
            >
              {isSaving ? 'Sauvegarde...' : (site ? 'Mettre à jour' : 'Ajouter')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}