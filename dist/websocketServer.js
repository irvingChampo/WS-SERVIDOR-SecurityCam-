"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');
    const sendDataToClient = async () => {
        try {
            const response = await axios_1.default.get(`${config_1.API_URL}/api/sensor/latest`);
            const ultrasonicResponse = await axios_1.default.get(`${config_1.API_URL}/api/sensor/ultrasonic/latest`);
            const data = response.data;
            const ultrasonicData = ultrasonicResponse.data;
            ws.send(JSON.stringify({ ...data, ...ultrasonicData }));
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('Error obteniendo datos de la API:', error.message);
            }
            else {
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
