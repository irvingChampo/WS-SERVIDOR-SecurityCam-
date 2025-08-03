// irvingchampo-ws-servidor-securitycam-/src/websocketServer.ts

import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';
import { API_URL } from './config';

export function createWebSocketServer(port = 8080) {
  const wss = new WebSocketServer({ port });

  // --- INICIO DE CAMBIOS ---

  const checkApiStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sensor/latest`);
      const ultrasonicResponse = await axios.get(`${API_URL}/api/sensor/ultrasonic/latest`);
      
      console.log('[MONITOR] Estado del sistema: OK.');
      
      const data = response.data;
      const ultrasonicData = ultrasonicResponse.data;
      const message = JSON.stringify({ status: 'OK', ...data, ...ultrasonicData });

      // 2. Enviar el mensaje a TODOS los clientes que estén conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });

    } catch (error: any) {
      console.error(`[MONITOR] ¡FALLO DETECTADO! No se pudo conectar a la API.`);
      const errorMessage = JSON.stringify({ status: 'FAILURE', message: 'API is down' });
      
      // Enviar el mensaje de error a TODOS los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(errorMessage);
        }
      });
    }
  };

  // 3. Iniciar la revisión periódica inmediatamente
  setInterval(checkApiStatus, 2000);

  // El evento 'connection' ahora solo sirve para registrar nuevos clientes
  wss.on('connection', (ws: WebSocket) => {
    console.log('[MONITOR] Nuevo cliente (Frontend) conectado.');
    
    ws.on('close', () => {
      console.log('[MONITOR] Cliente (Frontend) desconectado.');
    });

    ws.on('error', (error) => {
      console.error('[MONITOR] Error en un cliente:', error);
    });
  });

  // --- FIN DE CAMBIOS ---

  console.log(`[MONITOR] Servidor de monitoreo WebSocket escuchando en el puerto ${port}`);
  return wss;
}

if (require.main === module) {
  createWebSocketServer();
}