import { describe, it, expect, vi } from 'vitest';
import { testAIProvider } from '../ai/providerTesting';
import { AI_PROVIDERS } from '../constants';

describe('API Integration Tests', () => {
  // Tests OpenAI
  describe('OpenAI Integration', () => {
    it('tests OpenAI connection with valid key', async () => {
      const result = await testAIProvider('openai', 'sk-test-valid');
      expect(result).toBe(true);
    });

    it('handles invalid OpenAI key', async () => {
      const result = await testAIProvider('openai', 'invalid-key');
      expect(result).toBe(false);
    });

    it('verifies OpenAI model availability', async () => {
      const provider = AI_PROVIDERS.find(p => p.id === 'openai');
      expect(provider?.models).toBeDefined();
      expect(provider?.models.length).toBeGreaterThan(0);
    });
  });

  // Tests Anthropic
  describe('Anthropic Integration', () => {
    it('tests Anthropic connection with valid key', async () => {
      const result = await testAIProvider('anthropic', 'sk-test-valid');
      expect(result).toBe(true);
    });

    it('handles invalid Anthropic key', async () => {
      const result = await testAIProvider('anthropic', 'invalid-key');
      expect(result).toBe(false);
    });
  });

  // Tests Google AI
  describe('Google AI Integration', () => {
    it('tests Google AI connection with valid key', async () => {
      const result = await testAIProvider('google', 'valid-key');
      expect(result).toBe(true);
    });

    it('handles invalid Google AI key', async () => {
      const result = await testAIProvider('google', 'invalid-key');
      expect(result).toBe(false);
    });
  });
});