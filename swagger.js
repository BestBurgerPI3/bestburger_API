import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { PORT, HOSTNAME } from './config.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIs',
      version: '1.0.0',
      description: 'Documentación de la API'
    },
    servers: [
      {
        url: `http://35.225.149.42:${PORT}`, 
      },
    ],
  },
  apis: ['./routes/*.js'],
};

/**
 * @swagger
 * tags:
 *   - name: "Endpoints Restaurantes"
 *     description: "Endpoints BestBurger"
 */

/**
 * @swagger
 * tags:
 *   - name: "Endpoints Usuario"
 *     description: "Endpoints BestBurger"
 */

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
