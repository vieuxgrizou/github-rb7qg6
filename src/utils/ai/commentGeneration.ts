import type { WordPressSite, Persona, CommentTemplate } from '../types';
import { AI_PROVIDERS } from '../constants';
import { apiClient } from '../api/client';

export interface CommentContext {
  postTitle: string;
  postContent: string;
  existingComments: string[];
  template?: CommentTemplate;
  parentComment?: string;
  isReply?: boolean;
}

export interface GeneratedComment {
  content: string;
  metadata: {
    style: string;
    tone: string;
    language: string;
    timestamp: string;
    isReply?: boolean;
    templateId?: string;
  };
}

export async function generateComment(
  site: WordPressSite,
  persona: Persona,
  context: CommentContext
): Promise<GeneratedComment> {
  try {
    const provider = AI_PROVIDERS.find(p => p.id === site.aiProvider);
    if (!provider) {
      throw new Error('Fournisseur d\'IA non trouvé');
    }

    const model = provider.models.find(m => m.id === site.aiModel);
    if (!model) {
      throw new Error('Modèle d\'IA non trouvé');
    }

    // Construction du prompt
    const prompt = buildPrompt(persona, context);

    // Appel à l'API pour la génération
    const response = await apiClient.post('/ai/generate', {
      provider: site.aiProvider,
      model: site.aiModel,
      prompt,
      settings: site.commentSettings.aiSettings,
      context: {
        persona: {
          style: persona.writingStyle,
          tone: persona.tone,
          language: persona.languages[0]
        },
        template: context.template,
        isReply: context.isReply
      }
    });

    return {
      content: response.data.content,
      metadata: {
        style: persona.writingStyle,
        tone: persona.tone,
        language: persona.languages[0],
        timestamp: new Date().toISOString(),
        isReply: context.isReply,
        templateId: context.template?.id
      }
    };
  } catch (error) {
    throw new Error(`Erreur lors de la génération du commentaire : ${error.message}`);
  }
}

function buildPrompt(persona: Persona, context: CommentContext): string {
  let prompt = `En tant que ${persona.name}, une personne de ${persona.age} ans avec un style d'écriture ${
    persona.writingStyle.toLowerCase()
  } et un ton ${persona.tone.toLowerCase()}, `;

  if (context.isReply) {
    prompt += `répondez au commentaire suivant sur l'article "${context.postTitle}" :

Commentaire parent :
${context.parentComment}`;
  } else {
    prompt += `écrivez un commentaire sur l'article "${context.postTitle}"`;
  }

  if (context.template) {
    prompt += `\n\nUtilisez ce modèle comme guide (flexibilité: ${context.template.flexibility * 100}%) :
${context.template.template}`;
  }

  prompt += `\n\nContenu de l'article :
${context.postContent}

Instructions :
- Restez naturel et authentique
- Utilisez un langage approprié au style et au ton définis
- Faites référence au contenu de l'article
- Limitez-vous à 2-3 phrases
${persona.emoji ? '- Vous pouvez utiliser des emoji de manière naturelle' : ''}
${persona.useHashtags ? '- Vous pouvez utiliser des hashtags pertinents' : ''}`;

  return prompt;
}