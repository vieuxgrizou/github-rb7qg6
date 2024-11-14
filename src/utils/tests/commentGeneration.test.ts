import { describe, it, expect, vi } from 'vitest';
import { commentService } from '../ai/commentService';
import type { WordPressSite, Persona, CommentTemplate } from '../../types';

describe('Comment Generation Service', () => {
  // Configuration de test
  const mockSite: WordPressSite = {
    id: '1',
    name: 'Test Site',
    url: 'https://example.com',
    username: 'admin',
    applicationPassword: 'test:pass',
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    autoGenerate: true,
    commentSettings: {
      mode: 'auto',
      frequency: {
        commentsPerDay: 5,
        minDelay: 1,
        maxDelay: 2
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
    assignedPersonas: ['persona1', 'persona2']
  };

  const mockPersonas: Persona[] = [
    {
      id: 'persona1',
      name: 'Jean Dupont',
      gender: 'male',
      age: 35,
      writingStyle: 'Informel',
      writingStyleDescription: 'Style décontracté',
      tone: 'Amical',
      toneDescription: 'Ton sympathique',
      languages: ['fr', 'en'],
      errorRate: 0.05,
      topics: [],
      emoji: true,
      useHashtags: true,
      mentionOthers: false,
      includeMedia: false
    },
    {
      id: 'persona2',
      name: 'Marie Martin',
      gender: 'female',
      age: 28,
      writingStyle: 'Professionnel',
      writingStyleDescription: 'Style formel',
      tone: 'Neutre',
      toneDescription: 'Ton professionnel',
      languages: ['fr'],
      errorRate: 0.02,
      topics: [],
      emoji: false,
      useHashtags: false,
      mentionOthers: false,
      includeMedia: false
    }
  ];

  const mockTemplates: CommentTemplate[] = [
    {
      id: 'template1',
      name: 'Template Informel',
      description: 'Pour les commentaires décontractés',
      template: "J'aime beaucoup cet article sur {{sujet}}. {{point_fort}} 👍",
      style: 'Informel',
      flexibility: 0.7,
      contextRules: [],
      variables: [],
      topics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template2',
      name: 'Template Professionnel',
      description: 'Pour les commentaires formels',
      template: "Une analyse pertinente sur {{sujet}}. {{argument}}.",
      style: 'Professionnel',
      flexibility: 0.5,
      contextRules: [],
      variables: [],
      topics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const testContext = {
    postId: 'post1',
    postTitle: 'Test Article',
    postContent: 'This is a test article content.',
    existingComments: []
  };

  it('generates comments with assigned personas', async () => {
    const results = await commentService.generateComments({
      site: mockSite,
      personas: mockPersonas,
      templates: mockTemplates,
      context: testContext
    });

    // Vérifier que des commentaires ont été générés
    expect(results.success.length).toBeGreaterThan(0);
    expect(results.failed.length).toBe(0);

    // Vérifier que seuls les personas assignés ont été utilisés
    results.success.forEach(result => {
      expect(mockSite.assignedPersonas).toContain(result.persona);
    });
  });

  it('matches templates with persona styles', async () => {
    const results = await commentService.generateComments({
      site: mockSite,
      personas: mockPersonas,
      templates: mockTemplates,
      context: testContext
    });

    results.success.forEach(result => {
      if (result.template) {
        const persona = mockPersonas.find(p => p.id === result.persona);
        const template = mockTemplates.find(t => t.id === result.template);
        expect(template?.style).toBe(persona?.writingStyle);
      }
    });
  });

  it('generates replies to comments', async () => {
    const reply = await commentService.generateReply(
      {
        site: mockSite,
        personas: mockPersonas,
        templates: mockTemplates,
        context: testContext
      },
      'comment1',
      'Excellent article, très instructif !'
    );

    // La réponse peut être null selon la probabilité de réponse
    if (reply) {
      expect(reply.reply).toBeDefined();
      expect(mockSite.assignedPersonas).toContain(reply.persona);
    }
  });

  it('respects language requirements', async () => {
    // Créer un site qui ne supporte que le français
    const frenchOnlySite = {
      ...mockSite,
      commentSettings: {
        ...mockSite.commentSettings,
        language: ['fr']
      }
    };

    const results = await commentService.generateComments({
      site: frenchOnlySite,
      personas: mockPersonas,
      templates: mockTemplates,
      context: testContext
    });

    // Vérifier que tous les personas utilisés supportent le français
    results.success.forEach(result => {
      const persona = mockPersonas.find(p => p.id === result.persona);
      expect(persona?.languages).toContain('fr');
    });
  });
});