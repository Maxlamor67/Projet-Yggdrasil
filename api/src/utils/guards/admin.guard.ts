import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { auth } from '../auth';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(request.headers),
        });

        if (!session) return true;

        if (session.user.role !== 'admin') {
            throw new ForbiddenException('Accès réservé aux administrateurs.');
        }

        return true;
    }
}