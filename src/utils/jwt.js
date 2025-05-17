import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

export function signJwt(payload, expiresIn = '24h') {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}
