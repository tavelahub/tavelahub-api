import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { registerSchema } from '../modules/auth/auth.schema';

const authRoutes = new OpenAPIHono();
const tags = ['Auth'];

// Register
authRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    summary: 'register',
    description: 'Register employee contains email and password',
    tags,
    request: { body: { content: { 'application/json': { schema: registerSchema } } } },
    responses: {
      201: { description: 'successfully register' },
      400: { description: 'invalid payload' },
      409: { description: 'user already exist' },
      408: { description: 'request time out' },
      500: { description: 'internal server error. failed to register' },
    },
  }),
  async (c) => {
    return c.json({ message: 'not implement yet' });
  },
);

// Login
// Logout
// Refresh token
// Me

export { authRoutes };
