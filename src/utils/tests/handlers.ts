import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'fake-jwt-token'
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  // Sites handlers
  http.get('/api/sites', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Site',
        url: 'https://example.com',
        status: 'active'
      }
    ]);
  }),

  // Personas handlers
  http.get('/api/personas', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Persona',
        gender: 'female',
        age: 30,
        writingStyle: 'Professional',
        tone: 'Friendly'
      }
    ]);
  })
];