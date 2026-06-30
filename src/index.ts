import { OpenAPIHono } from '@hono/zod-openapi';
import { authRoutes } from './routes/auth.routes';
import { Scalar } from '@scalar/hono-api-reference';

const app = new OpenAPIHono();

app.route('/v1/auth', authRoutes);

app.doc('/openapi.json', {
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
});

app.get('/', Scalar({ url: '/openapi.json' }));

export default app;
