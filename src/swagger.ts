// In src/v1/swagger.ts
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

// Basic Meta Informations about our API
const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Meter API',
      version: '1.0.0'
    },
  },
  apis: ['./src/routes/*.ts'],
};

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options);

// Function to setup our docs
const swaggerDocs = (app: Application, port: number): void => {
  // Route-Handler to visit our docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Make our docs in JSON format available
  app.get('/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(`Version 1 Docs are available on http://localhost:${port}/docs`);
};

export { swaggerDocs };
