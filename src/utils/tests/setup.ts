import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Handlers pour mocker les appels API
export const handlers = [
  // Auth
  http.post('/api/auth/login', async () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      }
    });
  }),

  // Sites
  http.get('/api/sites', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Site',
        url: 'https://example.com'
      }
    ]);
  }),

  // API Keys
  http.post('/api/test-key', async ({ request }) => {
    const { provider, key } = await request.json();
    if (key.startsWith('valid_')) {
      return HttpResponse.json({ success: true });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // Webhooks
  http.post('/api/webhooks/test', async ({ request }) => {
    const signature = request.headers.get('X-Webhook-Signature');
    if (!signature) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({ success: true });
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());