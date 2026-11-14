import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ROLES_KEY } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { BooksController } from './books.controller.js';

describe('BooksController authorization metadata', () => {
  it.each(['create', 'update', 'remove'] as const)(
    '%s requires JWT authentication and the librarian role',
    (handlerName) => {
      const handler = BooksController.prototype[handlerName];
      const guards = Reflect.getMetadata(GUARDS_METADATA, handler);

      expect(guards).toEqual([JwtAuthGuard, RolesGuard]);
      expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual([
        Role.LIBRARIAN,
      ]);
    },
  );

  it('keeps book reads public', () => {
    const findAll = Object.getOwnPropertyDescriptor(
      BooksController.prototype,
      'findAll',
    )?.value;
    const findOne = Object.getOwnPropertyDescriptor(
      BooksController.prototype,
      'findOne',
    )?.value;

    expect(Reflect.getMetadata(GUARDS_METADATA, findAll)).toBeUndefined();
    expect(Reflect.getMetadata(GUARDS_METADATA, findOne)).toBeUndefined();
  });
});
