import { z } from 'zod';
import { RoleModelSchema } from '../../generated/zod/schemas';

const createRoleSchema = RoleModelSchema.pick({
  name: true,
  description: true,
});

type CreateRole = z.infer<typeof createRoleSchema>;

export { createRoleSchema, CreateRole };
