import { OpenAPIObjectConfigure } from '@hono/zod-openapi';
import { Env } from 'hono';

const openApiDocConfig: OpenAPIObjectConfigure<Env, any> = {
  openapi: '3.0.4',
  info: {
    version: '1.0.0',
    title: 'Tavelahub API',
    description: 'Restful API for Tavelahub',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
};

export { openApiDocConfig };
