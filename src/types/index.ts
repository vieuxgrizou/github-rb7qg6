export interface WordPressSite {
  id: string;
  name: string;
  url: string;
  username: string; // Ajout du champ username
  applicationPassword: string;
  aiProvider: string;
  aiModel: string;
  autoGenerate: boolean;
  commentSettings: {
    mode: 'auto' | 'manual';
    frequency: {
      commentsPerDay: number;
      minDelay: number;
      maxDelay: number;
    };
    schedule: {
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
    language: string[];
    replyProbability: number;
    maxCommentsPerPost: number;
    autoCreatePersonas: boolean;
    personaCreationRate: number;
    aiSettings: {
      temperature: number;
      maxTokens: number;
      presencePenalty: number;
      frequencyPenalty: number;
    };
  };
  assignedPersonas: string[];
}

// ... reste du fichier inchangé ...