import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { createRoleSchema } from '../modules/role/role.schema';
import { prisma } from '../lib/prisma';

const roleRoutes = new OpenAPIHono();
const roleTags = ['Role'];

// get role

// create role
roleRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/roles',
    summary: 'Create roles',
    description: 'Create roles. only user with super admin role can create new role.',
    tags: roleTags,
    request: { body: { content: { 'application/json': { schema: createRoleSchema } } } },
    responses: {
      201: {
        description: 'Success create new role.',
      },
      401: {
        description: 'Unauthorized',
      },
      408: {
        description: 'request time out',
      },
      409: {
        description: 'Conflict roles name. role name already exist in database.',
      },
      422: {
        description: 'Validation failed',
      },
      500: {
        description: 'internal server error. failed to register',
      },
    },
  }),
  async (c) => {
    try {
      const { name, description } = c.req.valid('json');
      const result = await prisma.role.create({
        data: {
          name,
          description,
        },
      });

      return c.json(
        {
          success: true,
          message: 'success create new role.',
          data: result,
        },
        201,
      );
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'internal server error',
          errors: error,
        },
        500,
      );
    }
  },
);

export { roleRoutes };
