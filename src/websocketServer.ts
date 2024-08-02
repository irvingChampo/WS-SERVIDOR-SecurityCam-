import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';
import { API_URL } from './config';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('Nuevo cliente conectado');

  const sendDataToClient = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sensor/latest`);
      const ultrasonicResponse = await axios.get(`${API_URL}/api/sensor/ultrasonic/latest`);
      const data = response.data;
      const ultrasonicData = ultrasonicResponse.data;
  
      ws.send(JSON.stringify({ ...data, ...ultrasonicData }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error obteniendo datos de la API:', error.message);
      } else {
        console.error('Error inesperado:', error);
      }
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

console.log('Servidor WebSocket escuchando en el puerto 8080');
