import { SetMetadata } from '@nestjs/common';
import { TraderRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TraderRole[]): MethodDecorator =>
  SetMetadata(ROLES_KEY, roles);
