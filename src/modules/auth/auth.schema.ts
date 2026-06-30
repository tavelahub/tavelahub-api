import { z } from 'zod';
import { UserModelSchema } from '../../generated/zod/schemas';

const loginSchema = UserModelSchema.pick({
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
    .openapi({
      example: 'Jhon1234*',
      description:
        'Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*#?&).',
    }),
});

const successAuthLogin = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'Login successful.' }),
  data: z.object({
    accessToken: z.string().openapi({
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    }),
    refreshToken: z.string().openapi({
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
    }),
    expiresIn: z.number().openapi({ example: 3600 }),
  }),
});

const errorMessageTemplate = z.object({
  success: z.boolean(),
  message: z.string(),
});

const unauthorizedError = errorMessageTemplate.openapi({
  example: {
    success: false,
    message: 'Invalid email or password.',
  },
});

const unprocessableEntityError = errorMessageTemplate
  .extend({
    errors: z.array(z.record(z.string(), z.array(z.string()))),
  })
  .openapi({
    example: {
      success: false,
      message: 'Validation failed.',
      errors: [
        {
          email: ['Email is required.'],
          password: ['Password must be at least 8 characters.'],
        },
      ],
    },
  });

const internalServerError = errorMessageTemplate.openapi({
  example: {
    success: false,
    message: 'internal server error. failed to login.',
  },
});

const timeOutError = errorMessageTemplate.openapi({
  example: {
    success: false,
    message: 'request time out. failed to login.',
  },
});

export {
  loginSchema,
  successAuthLogin,
  unprocessableEntityError,
  unauthorizedError,
  timeOutError,
  internalServerError,
};
