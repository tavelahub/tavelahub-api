import 'dotenv/config';
import { sign } from 'hono/jwt';

const tokenSecretKey = String(process.env.JWT_SECRET);
const ACCESS_TOKEN_EXP = 60 * 60; // 60 minutes
const REFRESH_TOKEN_EXP = 60 * 60 * 24 * 7; // 7 days

async function signAccessToken(payload: { userId: string; email: string }) {
  return await sign(
    {
      sub: payload.userId,
      email: payload.email,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXP,
    },
    tokenSecretKey,
    'HS256',
  );
}

async function signRefreshToken(payload: { userId: string; email?: string }) {
  return await sign(
    {
      sub: payload.userId,
      email: payload.email,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
      exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXP,
    },
    tokenSecretKey,
    'HS256',
  );
}

export { signAccessToken, signRefreshToken };
