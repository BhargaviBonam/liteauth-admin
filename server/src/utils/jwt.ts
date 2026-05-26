import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'liteauth-super-secret-key-2026';
const EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '7d';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
