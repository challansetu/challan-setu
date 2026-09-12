import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const LAWYER_ALLOWED_KEY = 'lawyerAllowed';
export const LawyerAllowed = () => SetMetadata(LAWYER_ALLOWED_KEY, true);

/**
 * Lawyers don't fit the ADMIN/SUPPORT_AGENT rank hierarchy — they get a hard
 * allowlist instead: only routes explicitly marked @LawyerAllowed() are reachable.
 * Row-level filtering by assigned vehicle prefix happens separately in AdminService.
 */
@Injectable()
export class LawyerScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user?.role !== 'LAWYER') return true;

    const allowed = this.reflector.getAllAndOverride<boolean>(LAWYER_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowed) throw new ForbiddenException('Lawyer accounts can only access the leads section');
    return true;
  }
}
