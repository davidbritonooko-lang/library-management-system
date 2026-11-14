import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../generated/prisma/client.js';
import { RolesGuard } from './roles.guard.js';
import { ROLES_KEY } from './roles.decorator.js';

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: vi.fn() };
  let guard: RolesGuard;

  function contextFor(role?: Role): ExecutionContext {
    const request = role ? { user: { userId: 'user-1', role } } : {};
    return {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('allows requests when no role metadata is declared', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(guard.canActivate(contextFor())).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      ROLES_KEY,
      expect.any(Array),
    );
  });

  it('allows a librarian for librarian-only routes', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.LIBRARIAN]);
    expect(guard.canActivate(contextFor(Role.LIBRARIAN))).toBe(true);
  });

  it('denies a patron for librarian-only routes', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.LIBRARIAN]);
    expect(guard.canActivate(contextFor(Role.PATRON))).toBe(false);
  });
});
