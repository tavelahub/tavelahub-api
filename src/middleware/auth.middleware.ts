import { createMiddleware } from 'hono/factory';

const authMiddleware = createMiddleware(async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || authHeader.startsWith('Bearer')) {
      throw new Error('Authorization header not provided or invalid');
    }

    const token = authHeader.replace('Bearer ', '');
    // const decodeToken = await decode
  } catch (error) {}
});

export { authMiddleware };
