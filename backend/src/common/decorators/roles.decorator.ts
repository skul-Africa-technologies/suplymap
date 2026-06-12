import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (..._roles: string[]): MethodDecorator =>
  SetMetadata(ROLES_KEY, _roles);
