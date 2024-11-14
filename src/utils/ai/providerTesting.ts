import { AI_PROVIDERS } from '../constants';
import { throwAppError } from '../errorHandling';
import toast from 'react-hot-toast';

export async function testAIProvider(providerId: string, apiKey: string): Promise<boolean> {
  const provider = AI_PROVIDERS.find(p => p.id === providerId);
  if (!provider) {
    throwAppError('Fournisseur d\'IA non trouvé', 'AI_PROVIDER_NOT_FOUND');
  }

  try {
    // Test simple pour chaque fournisseur
    switch (providerId) {
      case 'openai':
        return await testOpenAI(apiKey);
      case 'anthropic':
        return await testAnthropic(apiKey);
      case 'google':
        return await testGoogle(apiKey);
      case 'mistral':
        return await testMistral(apiKey);
      case 'cohere':
        return await testCohere(apiKey);
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error testing ${providerId}:`, error);
    toast.error(`Erreur lors du test de ${provider.name}: ${error.message}`);
    return false;
  }
}

async function testOpenAI(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.data?.length > 0;
  } catch (error) {
    throw new Error(`OpenAI test failed: ${error.message}`);
  }
}

async function testAnthropic(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Test' }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    return true;
  } catch (error) {
    throw new Error(`Anthropic test failed: ${error.message}`);
  }
}

async function testGoogle(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro?key=${apiKey}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Google AI API error');
    }

    return true;
  } catch (error) {
    throw new Error(`Google AI test failed: ${error.message}`);
  }
}

async function testMistral(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.mistral.ai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Mistral API error');
    }

    return true;
  } catch (error) {
    throw new Error(`Mistral test failed: ${error.message}`);
  }
}

async function testCohere(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Cohere API error');
    }

    return true;
  } catch (error) {
    throw new Error(`Cohere test failed: ${error.message}`);
  }
}

// Fonction utilitaire pour tester la génération de texte
export async function testTextGeneration(providerId: string, apiKey: string): Promise<string> {
  const testPrompt = "Générer une courte réponse de test.";
  
  try {
    switch (providerId) {
      case 'openai':
        return await testOpenAIGeneration(apiKey, testPrompt);
      case 'anthropic':
        return await testAnthropicGeneration(apiKey, testPrompt);
      case 'google':
        return await testGoogleGeneration(apiKey, testPrompt);
      default:
        throw new Error('Fournisseur non supporté');
    }
  } catch (error) {
    throw new Error(`Test de génération échoué: ${error.message}`);
  }
}

async function testOpenAIGeneration(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50
    })
  });

  if (!response.ok) {
    throw new Error('Échec de la génération OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function testAnthropicGeneration(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error('Échec de la génération Anthropic');
  }

  const data = await response.json();
  return data.content[0].text;
}

async function testGoogleGeneration(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!response.ok) {
    throw new Error('Échec de la génération Google AI');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}