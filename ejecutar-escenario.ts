// run-scenario.ts
import axios from 'axios';

const API_URL = 'http://localhost:5001'; // La URL de tu API

// Función para pausar la ejecución
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para registrar un bug/defecto en nuestro "sistema de conteo" (la consola)
const logIssue = (type: 'BUG' | 'DEFECTO', description: string, ticket: string) => {
  console.log(`\n--- REGISTRO DE PROBLEMA ---`);
  console.log(`Tipo: ${type}`);
  console.log(`Descripción: ${description}`);
  console.log(`Ticket: ${ticket} (Creado)`);
  console.log(`--------------------------\n`);
};

const logResolution = (ticket: string) => {
    console.log(`\n--- REGISTRO DE SOLUCIÓN ---`);
    console.log(`El problema del ticket ${ticket} ha sido resuelto.`);
    console.log(`----------------------------\n`);
};

// Escenario 1: Medir el Tiempo Medio Entre Fallos (MTBF)
async function testMTBF() {
  console.log('--- INICIANDO PRUEBA DE MTBF ---');
  await axios.post(`${API_URL}/api/simulation/recover`); // Aseguramos que el sistema esté funcional
  
  const startTime = Date.now();
  console.log('Sistema iniciado. Esperando a que ocurra un fallo...');

  // Simulamos un "ataque de estrés" que causa un fallo después de un tiempo aleatorio
  const timeToFailure = Math.random() * 10000 + 5000; // Falla entre 5 y 15 segundos
  await sleep(timeToFailure);

  // Provocamos el fallo
  await axios.post(`${API_URL}/api/simulation/fail`);
  const endTime = Date.now();
  
  const mtbf = (endTime - startTime) / 1000; // en segundos
  console.log(`¡FALLO PROVOCADO! El sistema operó correctamente durante ${mtbf.toFixed(2)} segundos.`);
  console.log(`Resultado MTBF de esta prueba: ${mtbf.toFixed(2)}s`);
  logIssue('BUG', 'El servidor de la API dejó de responder bajo carga.', 'JIRA-451');
  console.log('--- FIN DE PRUEBA DE MTBF ---\n');
  return mtbf;
}

// Escenario 2: Medir el Tiempo Medio para Reparar (MTTR)
async function testMTTR() {
  console.log('--- INICIANDO PRUEBA DE MTTR ---');
  
  // Asumimos que el fallo ya ocurrió (lo detecta nuestro WebSocket)
  console.log('El fallo ha sido detectado por el sistema de monitoreo.');
  const detectionTime = Date.now();

  // Simulamos el tiempo que tarda el equipo en diagnosticar y aplicar una solución
  console.log('Equipo de mantenimiento trabajando en la solución (simulando 4 segundos)...');
  await sleep(4000);
  
  // Aplicamos la "reparación"
  await axios.post(`${API_URL}/api/simulation/recover`);
  console.log('Solución aplicada. Reiniciando servicios...');
  const recoveryTime = Date.now();

  const mttr = (recoveryTime - detectionTime) / 1000; // en segundos
  console.log(`¡SISTEMA RECUPERADO! La reparación tardó ${mttr.toFixed(2)} segundos.`);
  console.log(`Resultado MTTR de esta prueba: ${mttr.toFixed(2)}s`);
  logResolution('JIRA-451');
  console.log('--- FIN DE PRUEBA DE MTTR ---\n');
  return mttr;
}

// Escenario 3: Simular y registrar un defecto (no un fallo crítico)
async function testDefect() {
    console.log('--- INICIANDO PRUEBA DE DEFECTO ---');
    await axios.post(`${API_URL}/api/simulation/slowdown`);
    logIssue('DEFECTO', 'La API responde con lentitud debido a una consulta ineficiente.', 'JIRA-452');
    
    console.log('El sistema ahora está lento. Monitoreando por 8 segundos...');
    await sleep(8000);

    await axios.post(`${API_URL}/api/simulation/recover`);
    logResolution('JIRA-452');
    console.log('--- FIN DE PRUEBA DE DEFECTO ---\n');
}

// Ejecutor principal
async function run() {
  console.log('*** INICIANDO GUÍA DE MONITOREO DE PROYECTOS ***\n');
  
  await testMTBF();
  await sleep(2000); // Pausa entre pruebas
  await testMTTR();
  await sleep(2000); // Pausa entre pruebas
  await testDefect();

  console.log('*** TODAS LAS PRUEBAS HAN FINALIZADO ***');
  console.log('Revisa los logs de la API y del servidor WebSocket para ver el comportamiento completo.');
}

run();