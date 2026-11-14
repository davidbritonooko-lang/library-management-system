export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error(
      'JWT_SECRET must be configured with at least 32 random bytes',
    );
  }
  return secret;
}
