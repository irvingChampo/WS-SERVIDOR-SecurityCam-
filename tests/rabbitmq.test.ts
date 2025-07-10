import { connectToRabbitMQ } from '../src/rabbitmq';

describe('Conexión a RabbitMQ', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); 
    process.env = { ...OLD_ENV }; 
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('TS-CONFIG-01: conexión exitosa con URL válida', async () => {
    process.env.RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
    const result = await connectToRabbitMQ();
    expect(result).toBe('connected');
  });

  test('TS-CONFIG-02: error por usuario incorrecto', async () => {
    process.env.RABBITMQ_URL = 'amqp://wrong:wrong@localhost:5672';
    const result = await connectToRabbitMQ();
    expect(result).toBe('error');
  });

  test('TS-CONFIG-03: error por URL inválida', async () => {
    process.env.RABBITMQ_URL = 'xxx://mal@url';
    const result = await connectToRabbitMQ();
    expect(result).toBe('error');
  });
});
