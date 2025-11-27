/**
 * Cloud Functions para Firebase - API de Promesa
 *
 * Este archivo es el punto de entrada principal para todas las Cloud Functions.
 * Aquí se exportan las funciones que Firebase desplegará.
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Cargar variables de entorno
require("./config/enviroment");

// Inicializar Firebase Admin SDK
admin.initializeApp();

// Configuración global para todas las funciones
// Limita el número máximo de instancias para control de costos
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1", // Puedes cambiar la región según tu necesidad
});

// ========== IMPORTAR LA APLICACIÓN EXPRESS ==========
// const createApp = require('./src/app');

/**
 * Cloud Function principal de la API
 *
 * Esta función maneja todas las peticiones HTTP a través de Express.
 *
 * URL de desarrollo: http://localhost:5001/[PROJECT-ID]/us-central1/api
 * URL de producción: https://us-central1-[PROJECT-ID].cloudfunctions.net/api
 *
 * Ejemplos de uso:
 * - GET  /api/users          - Obtener todos los usuarios
 * - GET  /api/users/:id      - Obtener un usuario específico
 * - POST /api/users          - Crear un nuevo usuario
 * - PUT  /api/users/:id      - Actualizar un usuario
 * - DELETE /api/users/:id    - Eliminar un usuario
 */
/*
exports.api = onRequest(
  {
    // Configuración específica de esta función
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: '256MiB',
    cors: true // Habilitar CORS automáticamente
  },
  (request, response) => {
    logger.info('API Request received', {
      method: request.method,
      path: request.path,
      url: request.url
    });

    // Crear y ejecutar la aplicación Express
    const app = createApp();
    app(request, response);
  }
);
*/

/**
 * Cloud Functions del módulo Profile
 */
const profileModule = require("./src/modules/Profile");
exports.profile = profileModule.profile;

/**
 * Cloud Functions del módulo Task
 */
const taskModule = require("./src/modules/Task");
exports.task = taskModule.task;

/**
 * Función disparada por Authentication
 * Crea perfil automáticamente cuando un usuario se registra
 */
const functions = require("firebase-functions/v1");
const profileService = require("./src/services/profile.service");

exports.onAuthUserCreated = functions.auth.user().onCreate(async (user) => {
  // Trigger de creación de usuario - v1.2 (Force Deploy)
  try {
    logger.info(`Nuevo usuario autenticado: ${user.uid}`);

    // Crear perfil de usuario usando el servicio
    await profileService.createProfile(user.uid, {
      nombreCompleto: user.displayName || null,
      imagenPerfil: user.photoURL || null,
    });

    logger.info(`Perfil creado exitosamente para: ${user.uid}`);
    return null;
  } catch (error) {
    logger.error(`Error creando perfil para ${user.uid}:`, error);
    return null;
  }
});

exports.onAuthUserDeleted = functions.auth.user().onDelete(async (user) => {
  logger.info(`Usuario eliminado: ${user.uid}`);

  // Eliminar perfil usando el servicio
  await profileService.deleteProfile(user.uid);

  return null;
});

/**
 * Ejemplo de Cloud Function simple (sin Express)
 *
 * Esta es una función básica que puedes usar como referencia
 * para funciones que no necesitan Express.
 */
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello World function called");

  response.status(200).json({
    success: true,
    message: "¡Hola desde Firebase Cloud Functions!",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Ejemplo de función programada (Scheduled Function)
 *
 * Descomenta este código para crear una función que se ejecute automáticamente
 * según un horario (usando sintaxis cron).
 */
/*
const { onSchedule } = require('firebase-functions/v2/scheduler');

exports.scheduledFunction = onSchedule(
  {
    schedule: 'every 24 hours', // También puedes usar: '0 0 * * *' para medianoche
    timeZone: 'America/Argentina/Buenos_Aires'
  },
  async (event) => {
    logger.info('Función programada ejecutándose');

    // Aquí puedes hacer tareas programadas como:
    // - Limpiar datos antiguos
    // - Enviar notificaciones
    // - Generar reportes
    // - Sincronizar datos

    return null;
  }
);
*/

/**
 * Ejemplo de función disparada por Firestore
 *
 * Descomenta este código para crear una función que se ejecute
 * cuando un documento en Firestore sea creado, actualizado o eliminado.
 */
/*
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');

exports.onUserCreated = onDocumentCreated(
  'users/{userId}',
  async (event) => {
    const snapshot = event.data;
    const userId = event.params.userId;

    logger.info(`Nuevo usuario creado: ${userId}`);

    // Aquí puedes:
    // - Enviar email de bienvenida
    // - Crear documentos relacionados
    // - Actualizar estadísticas

    return null;
  }
);

exports.onUserUpdated = onDocumentUpdated(
  'users/{userId}',
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const userId = event.params.userId;

    logger.info(`Usuario actualizado: ${userId}`);

    // Aquí puedes detectar cambios específicos
    if (beforeData.email !== afterData.email) {
      logger.info('El email del usuario cambió');
    }

    return null;
  }
);
*/
