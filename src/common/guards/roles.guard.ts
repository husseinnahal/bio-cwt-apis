// Guard that checks the user's role against required roles defined by the @Roles() decorator.
// Blocks execution and throws ForbiddenException if user lacks the required role.

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '@common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles metadata attached to handler or controller class
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, route is public/accessible
    if (!requiredRoles) {
      return true;
    }

    // Extract authenticated user (populated by JwtAuthGuard/Passport) from HTTP request
    const { user } = context.switchToHttp().getRequest();

    // Verify if the user's role matches any of the required roles
    return requiredRoles.some((role) => user?.role === role);
  }
}
