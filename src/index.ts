import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST',
}));

app.use(express.json());

app.get('/api/sensor/latest', (req, res) => {
  res.json({ temperature: 22, humidity: 60 });
});

app.get('/api/sensor/ultrasonic/latest', (req, res) => {
  res.json({ distance: 100, movement: true });
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
