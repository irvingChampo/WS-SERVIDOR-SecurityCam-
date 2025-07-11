import request from 'supertest';
import app from '../src/index'; // Asegúrate de exportar `app` desde index.ts

describe('Middleware CORS', () => {
  test('TS-CORS-01: Solicitud desde origen permitido', async () => {
    const res = await request(app)
      .get('/api/sensor/latest')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  test('TS-CORS-02: Solicitud desde origen no permitido', async () => {
    const res = await request(app)
      .get('/api/sensor/latest')
      .set('Origin', 'http://origen-no-permitido.com');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
