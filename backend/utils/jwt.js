import jwt from "jsonwebtoken";

/**
 * Signs a JWT with application secret and options (default 7d expiry)
 * @param {object} payload - JWT payload
 * @param {object} options - Optional JWT options (e.g., expiresIn)
 * @returns {string} JWT token
 */
export function signJwt(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in environment");
  return jwt.sign(payload, secret, { expiresIn: "7d", ...options });
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token
 * @returns {object} Decoded payload
 */
export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in environment");
  return jwt.verify(token, secret);
}