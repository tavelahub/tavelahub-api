import * as argon2 from 'argon2';
import { z } from 'zod';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';

import { prisma } from '../lib/prisma';
import {
  internalServerError,
  loginSchema,
  successAuthLogin,
  timeOutError,
  unauthorizedError,
  unprocessableEntityError,
} from '../modules/auth/auth.schema';
import { signAccessToken, signRefreshToken } from '../lib/auth';
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace';
import { getUserByEmail } from '../modules/user/user.services';
import { addDays } from '../lib/date';

const tags = ['Auth'];

/**
 * default hook for validating request
 */
const authRoutes = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);

      return c.json(
        {
          success: false,
          message: 'Validation failed.',
          errors: [fieldErrors],
        },
        422,
      );
    }
  },
});

// register

// login
authRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    summary: 'Login',
    description: 'Login user contains email and password',
    tags,
    request: { body: { content: { 'application/json': { schema: loginSchema } } } },
    responses: {
      200: {
        description: 'Login successful.',
        content: { 'application/json': { schema: successAuthLogin } },
      },
      401: {
        description: 'Unauthorized',
        content: { 'application/json': { schema: unauthorizedError } },
      },
      408: {
        description: 'request time out',
        content: { 'application/json': { schema: timeOutError } },
      },
      422: {
        description: 'Validation failed',
        content: { 'application/json': { schema: unprocessableEntityError } },
      },
      500: {
        description: 'internal server error. failed to register',
        content: { 'application/json': { schema: internalServerError } },
      },
    },
  }),
  async (c) => {
    try {
      const { email, password } = c.req.valid('json');
      const user = await getUserByEmail(email);

      if (!user.password) throw new Error('internal server error'); // not implemented yet

      if (!(await argon2.verify(user.password.hash, password)))
        throw new Error('Invalid credential');

      const accessToken = await signAccessToken({ userId: user.id, email: user.email });
      const refreshToken = await signRefreshToken({ userId: user.id });

      await prisma.refreshToken.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          token: refreshToken,
          expiresAt: addDays(new Date(), 7),
        },
        update: {
          userId: user.id,
          token: refreshToken,
          expiresAt: addDays(new Date(), 7),
        },
      });

      return c.json(
        {
          success: true,
          message: 'Login successful.',
          data: {
            accessToken,
            refreshToken,
            expiresIn: 3600,
          },
        },
        200,
      );
    } catch (error) {
      // PRISMA ERROR
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return c.json(
            {
              success: false,
              message: 'Invalid email and password',
            },
            401,
          );
        }
      }

      return c.json({ success: false, message: 'internal server error. failed to register' }, 500);
    }
  },
);

// Logout
// Refresh token
// Me

export { authRoutes };
