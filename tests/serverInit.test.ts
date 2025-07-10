import app from '../src/index';
import http from 'http';

describe('Inicialización del servidor Express', () => {
  let server: http.Server;

  afterEach((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  test('TS-EXPRESS-01: Inicio exitoso en puerto 5000', (done) => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    process.env.PORT = '5000';

    server = app.listen(process.env.PORT, () => {
      expect(spy).toHaveBeenCalledWith('Servidor Express escuchando en el puerto 5000');
      spy.mockRestore();
      done();
    });
  });

  test('TS-EXPRESS-02: Puerto ocupado', (done) => {
    const port = 5050;

    const tempServer = http.createServer().listen(port, () => {
      try {
        const duplicateServer = app.listen(port);

        duplicateServer.on('error', (err: any) => {
          expect(err.code).toBe('EADDRINUSE');
          tempServer.close(() => {
            done();
          });
        });
      } catch (error) {
        expect((error as any).code).toBe('EADDRINUSE');
        tempServer.close(() => {
          done();
        });
      }
    });
  });
});
