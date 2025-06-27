import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;

  beforeEach(async () => {
    // Mock dependencies
    prisma = { user: { findUnique: vi.fn(), create: vi.fn() } };
    const jwt = { signAsync: vi.fn().mockResolvedValue('token') };
    const config = { get: vi.fn().mockReturnValue('secret') };
    service = new AuthService(config as any, prisma as any, jwt as any);
  });

  it('should throw if user not found on signIn', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.signIn({
        email: 'a@a.com', password: '123456',
        username: 'abc',
        role: 'user'
    })).rejects.toThrow();
  });
}); 