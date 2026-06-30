import { z } from 'zod';
import { UserModelSchema } from '../../generated/zod/schemas';

export const registerSchema = UserModelSchema.pick({
  email: true,
  password: true,
}).extend({
  email: z
    .email({ pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })
    .trim()
    .min(5)
    .max(100)
    .openapi({ example: 'jhondoe@exampl.io' }),
  password: z
    .string()
    .regex(/^((?=.*[A-Za-z])(?=.*\d))(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .min(8)
    .max(100)
    .openapi({ example: 'Jhon1234*' }),
});
