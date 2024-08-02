"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
}));
app.use(express_1.default.json());
app.get('/api/sensor/latest', (req, res) => {
    res.json({ temperature: 22, humidity: 60 });
});
app.get('/api/sensor/ultrasonic/latest', (req, res) => {
    res.json({ distance: 100, movement: true });
});
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
