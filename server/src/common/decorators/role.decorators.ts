import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { Permission } from 'src/types/permission.types';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

export const PERMISSIONS_KEY = 'permissions';
export const ROLES_KEY = 'roles';

export function Auth(roles: string[] = [], permissions: Permission[] = []) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    SetMetadata(PERMISSIONS_KEY, permissions),
    UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard),
  );
}