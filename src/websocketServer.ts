// src/websocketServer.ts
import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';
import { API_URL } from './config';

export function createWebSocketServer(port = 8080) {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Nuevo cliente conectado');

    const sendDataToClient = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/sensor/latest`);
        const ultrasonicResponse = await axios.get(`${API_URL}/api/sensor/ultrasonic/latest`);
        const data = response.data;
        const ultrasonicData = ultrasonicResponse.data;
    
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ ...data, ...ultrasonicData }));
        }
      } catch (error: any) {
        console.error('Error obteniendo datos de la API:', error.message);
        // no quebramos el intervalo
      }
    };

    const interval = setInterval(sendDataToClient, 1000);

    ws.on('close', () => {
      clearInterval(interval);
      console.log('Cliente desconectado');
    });

    ws.on('error', (error) => {
      console.error('Error en la conexión WebSocket:', error);
      ws.close();
    });
  });

  console.log(`Servidor WebSocket escuchando en el puerto ${port}`);
  return wss;
}

// Solo arrancamos si se ejecuta directamente
if (require.main === module) {
  createWebSocketServer();
}
