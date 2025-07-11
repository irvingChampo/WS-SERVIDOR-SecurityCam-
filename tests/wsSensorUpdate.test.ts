import { createWebSocketServer } from '../src/websocketServer';
import WebSocket from 'ws';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WebSocket - Actualización de Sensores', () => {
  let wss: ReturnType<typeof createWebSocketServer>;
  const port = 8181;

  beforeAll(() => {
    wss = createWebSocketServer(port);
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    wss.close();
  });

  test('TS-WS-01: Conexión exitosa y recepción periódica', (done) => {
    mockedAxios.get.mockResolvedValueOnce({ data: { temperature: 25, humidity: 55 } });
    mockedAxios.get.mockResolvedValueOnce({ data: { distance: 150, movement: false } });

    const client = new WebSocket(`ws://localhost:${port}`);
    let receivedCount = 0;

    client.on('message', (data) => {
      receivedCount++;
      if (receivedCount === 2) {
        expect(data.toString()).toContain('temperature');
        done();
      }
    });

    jest.advanceTimersByTime(2000);
  });

  test('TS-WS-02: Mensaje contiene campos esperados', (done) => {
    mockedAxios.get.mockResolvedValueOnce({ data: { temperature: 30, humidity: 60 } });
    mockedAxios.get.mockResolvedValueOnce({ data: { distance: 80, movement: true } });

    const client = new WebSocket(`ws://localhost:${port}`);

    client.on('message', (data) => {
      const payload = JSON.parse(data.toString());
      expect(payload).toHaveProperty('temperature');
      expect(payload).toHaveProperty('humidity');
      expect(payload).toHaveProperty('distance');
      expect(payload).toHaveProperty('movement');
      done();
    });

    jest.advanceTimersByTime(1000);
  });

  test('TS-WS-03: Desconexión limpia', (done) => {
    const client = new WebSocket(`ws://localhost:${port}`);
    const spy = jest.spyOn(console, 'log').mockImplementation();

    client.on('open', () => {
      client.close();
    });

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('Cliente desconectado');
      spy.mockRestore();
      done();
    }, 100);
  });

  test('TS-WS-04: API caída no interrumpe conexión', (done) => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API main down'));
    mockedAxios.get.mockResolvedValueOnce({ data: { distance: 100, movement: true } });

    const client = new WebSocket(`ws://localhost:${port}`);
    const spy = jest.spyOn(console, 'error').mockImplementation();

    client.on('open', () => {
      jest.advanceTimersByTime(1000);
      expect(spy).toHaveBeenCalledWith('Error obteniendo datos de la API:', 'API main down');
      expect(client.readyState).toBe(WebSocket.OPEN);
      spy.mockRestore();
      done();
    });
  });

  test('TS-WS-05: JSON malformado no desconecta cliente', (done) => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });
    mockedAxios.get.mockResolvedValueOnce({ data: { distance: 50, movement: true } });

    const spy = jest.spyOn(console, 'error').mockImplementation();

    const client = new WebSocket(`ws://localhost:${port}`);
    client.on('message', (data) => {
      expect(client.readyState).toBe(WebSocket.OPEN);
      spy.mockRestore();
      done();
    });

    jest.advanceTimersByTime(1000);
  });
});
