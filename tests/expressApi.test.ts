// test/expressApi.test.ts
import request from 'supertest';
import app from '../src/index';

describe('API Gateway Express', () => {
  test('TS-EXPRESS-01: GET /api/sensor/latest devuelve temperature y humidity', async () => {
    const res = await request(app).get('/api/sensor/latest');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('temperature');
    expect(res.body).toHaveProperty('humidity');
  });

  test('TS-EXPRESS-02: GET /api/sensor/ultrasonic/latest devuelve distance y movement', async () => {
    const res = await request(app).get('/api/sensor/ultrasonic/latest');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('distance');
    expect(res.body).toHaveProperty('movement');
  });

  test('TS-EXPRESS-03: Validación de tipos de respuesta', async () => {
    const res1 = await request(app).get('/api/sensor/latest');
    const res2 = await request(app).get('/api/sensor/ultrasonic/latest');

    expect(typeof res1.body.temperature).toBe('number');
    expect(typeof res2.body.movement).toBe('boolean');
  });
});

