import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';

import { authRoutes } from './routes/auth.routes';
import { roleRoutes } from './routes/role.routes';
import { openApiDocConfig } from './config/openapi.config';

const app = new OpenAPIHono();

app.route('/v1/auth', authRoutes);
app.route('/v1/role', roleRoutes);

app.doc('/openapi.json', openApiDocConfig);
app.get('/', Scalar({ url: '/openapi.json' }));

export default app;
