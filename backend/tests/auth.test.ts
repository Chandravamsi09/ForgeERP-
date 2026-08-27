import { hashPassword, comparePassword } from '../src/utils/password';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/utils/jwt';
import { UserRole } from '@forge-erp/shared';

describe('Auth & RBAC Module Unit Tests', () => {
  const testPayload = {
    userId: 'usr_test_123',
    tenantId: 'tnt_acme_corp',
    email: 'admin@acme.com',
    roles: [UserRole.ADMIN],
  };

  test('1. Password Hashing: should securely hash passwords and verify matching hashes', async () => {
    const rawPassword = 'StrongPassword123!';
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    expect(hashed).toMatch(/^\$2[aby]\$\d+\$/);

    const isMatch = await comparePassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword('WrongPassword!', hashed);
    expect(isWrongMatch).toBe(false);
  });

  test('2. JWT Lifecycle: should generate valid Access Token and verify payload correctly', () => {
    const accessToken = generateAccessToken(testPayload);
    expect(typeof accessToken).toBe('string');

    const decoded = verifyAccessToken(accessToken);
    expect(decoded.userId).toBe(testPayload.userId);
    expect(decoded.tenantId).toBe(testPayload.tenantId);
    expect(decoded.email).toBe(testPayload.email);
    expect(decoded.roles).toContain(UserRole.ADMIN);
  });

  test('3. JWT Refresh Token: should generate valid Refresh Token and verify signature', () => {
    const refreshToken = generateRefreshToken(testPayload);
    expect(typeof refreshToken).toBe('string');

    const decoded = verifyRefreshToken(refreshToken);
    expect(decoded.userId).toBe(testPayload.userId);
    expect(decoded.tenantId).toBe(testPayload.tenantId);
  });

  test('4. Token Rejection: should throw error when verifying invalid or tampered JWT', () => {
    const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature';
    expect(() => verifyAccessToken(tamperedToken)).toThrow();
  });

  test('5. Multi-Tenant Scoping: token must strictly contain tenant context for database scoping', () => {
    const tenantA = { ...testPayload, tenantId: 'tenant_alpha' };
    const tenantB = { ...testPayload, tenantId: 'tenant_beta' };

    const tokenA = generateAccessToken(tenantA);
    const tokenB = generateAccessToken(tenantB);

    const decodedA = verifyAccessToken(tokenA);
    const decodedB = verifyAccessToken(tokenB);

    expect(decodedA.tenantId).not.toBe(decodedB.tenantId);
    expect(decodedA.tenantId).toBe('tenant_alpha');
    expect(decodedB.tenantId).toBe('tenant_beta');
  });
});
