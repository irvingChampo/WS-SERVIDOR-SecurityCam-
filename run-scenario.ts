// irvingchampo-ws-servidor-securitycam-/run-scenario.ts

import axios from 'axios';

const API_URL = 'http://localhost:5001'; 

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const logIssue = (type: 'BUG' | 'DEFECTO', description: string, ticket: string) => {
  console.log(`\n--- REGISTRO DE PROBLEMA ---`);
  console.log(`Tipo: ${type}, Ticket: ${ticket} (Creado)`);
  console.log(`Descripción: ${description}`);
  console.log(`--------------------------\n`);
};

const logResolution = (ticket: string, solution: string) => {
    console.log(`\n--- REGISTRO DE SOLUCIÓN ---`);
    console.log(`Ticket: ${ticket} (Resuelto)`);
    console.log(`Solución Aplicada: ${solution}`);
    console.log(`----------------------------\n`);
};

async function testMTBF() {
  console.log('--- INICIANDO PRUEBA DE MTBF (Tiempo Medio Entre Fallos) ---');
  await axios.post(`${API_URL}/api/simulation/recover`);
  const startTime = Date.now();
  console.log(`[${new Date().toLocaleTimeString()}] Sistema iniciado. Lanzando ataque de estrés...`);

  const timeToFailure = Math.random() * 10000 + 5000; 
  await sleep(timeToFailure);

  await axios.post(`${API_URL}/api/simulation/fail`);
  const endTime = Date.now();
  const mtbf = (endTime - startTime) / 1000;
  
  console.log(`[${new Date().toLocaleTimeString()}] ¡FALLO PROVOCADO!`);
  logIssue('BUG', 'El servidor de API dejó de responder bajo carga.', 'JIRA-451');
  console.log(`RESULTADO: El sistema operó correctamente durante ${mtbf.toFixed(2)} segundos.`);
  console.log(`--- FIN DE PRUEBA DE MTBF ---\n`);
}

async function testMTTR() {
  console.log('--- INICIANDO PRUEBA DE MTTR (Tiempo Medio para Reparar) ---');
  console.log(`[${new Date().toLocaleTimeString()}] El fallo ha sido detectado por el sistema de monitoreo (ver otra terminal).`);
  const detectionTime = Date.now();

  console.log('Equipo de mantenimiento aplicando parche (simulando 4 segundos)...');
  await sleep(4000);
  
  await axios.post(`${API_URL}/api/simulation/recover`);
  const recoveryTime = Date.now();
  const mttr = (recoveryTime - detectionTime) / 1000;

  console.log(`[${new Date().toLocaleTimeString()}] ¡SISTEMA RECUPERADO!`);
  logResolution('JIRA-451', 'Se reinició el servicio de la API.');
  console.log(`RESULTADO: La reparación tardó ${mttr.toFixed(2)} segundos.`);
  console.log('--- FIN DE PRUEBA DE MTTR ---\n');
}

async function run() {
  console.log('*** INICIANDO GUÍA DE MONITOREO DE PROYECTOS ***\n');
  
  await testMTBF();
  await sleep(3000); 
  await testMTTR();

  console.log('*** TODAS LAS PRUEBAS HAN FINALIZADO ***');
}

run();