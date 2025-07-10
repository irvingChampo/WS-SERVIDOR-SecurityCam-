import WebSocket from 'ws';

import '../src/websocketServer';

describe('WebSocket Server - Validación de sensores', () => {
  test('TS-WS-01: Conexión exitosa de cliente WebSocket', (done) => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.on('open', () => {
      ws.once('message', (message) => {
        expect(typeof message.toString()).toBe('string');
        ws.close();
        done();
      });
    });
  }, 10000);

  test('TS-WS-02: Cliente recibe datos correctos', (done) => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.on('open', () => {
      ws.once('message', (message) => {
        const data = JSON.parse(message.toString());
        expect(data).toHaveProperty('temperature');
        expect(data).toHaveProperty('humidity');
        expect(data).toHaveProperty('distance');
        expect(data).toHaveProperty('movement');
        ws.close();
        done();
      });
    });
  }, 10000);

  test('TS-WS-03: Desconexión limpia', (done) => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.on('open', () => {
      ws.on('close', () => {
        done();
      });
      ws.close();
    });
  }, 10000);

  test('TS-WS-04: Fallo en conexión a API (simulado)', (done) => {
    const originalConsole = console.error;
    let errorLogged = false;

    console.error = (msg: any) => {
      if (msg && msg.toString().includes('Error obteniendo datos de la API')) {
        errorLogged = true;
      }
    };

    process.env.API_URL = 'http://localhost:5999'; // API caída simulada

    const ws = new WebSocket('ws://localhost:8080');

    ws.on('open', () => {
      setTimeout(() => {
        expect(errorLogged).toBe(true);
        console.error = originalConsole;
        ws.close();
        done();
      }, 1500);
    });
  }, 10000);

  test('TS-WS-05: Formato de mensaje inválido (simulado)', (done) => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.on('open', () => {
      ws.on('message', (msg) => {
        try {
          const parsed = JSON.parse(msg.toString());
          expect(parsed).toHaveProperty('temperature');
          done();
        } catch (e) {
          fail('Mensaje malformado recibido y no fue manejado correctamente');
        } finally {
          ws.close();
        }
      });
    });
  }, 10000);
});
