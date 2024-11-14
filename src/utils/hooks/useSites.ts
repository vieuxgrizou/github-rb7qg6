import { useState, useEffect } from 'react';
import type { WordPressSite } from '../../types';

export function useSites() {
  const [sites, setSites] = useState<WordPressSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Implémenter la récupération des sites depuis l'API
    // Pour l'instant, on utilise des données de test
    setSites([
      {
        id: '1',
        name: 'Blog Principal',
        url: 'https://example.com',
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
      }
    ]);
    setLoading(false);
  }, []);

  return { sites, setSites, loading, error };
}