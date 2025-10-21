import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifyJwt } from '../config/jwt.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<{
            headers: Record<string, string | undefined>;
            user?: { id: string; username?: string };
        }>();

        const headers: Record<string, string | undefined> | undefined =
            req && typeof req === 'object' ? req.headers : undefined;

        const authHeader = headers?.authorization;
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid authorization header');
        }
        const token = authHeader.replace('Bearer ', '');
        const user = verifyJwt(token) as { id: string; username?: string } | null;
        if (!user || typeof user.id !== 'string') {
            throw new UnauthorizedException('Invalid token');
        }
        try {
            req.user = user;
        } catch (e) {
            console.error('error attaching user to request:', e);
        }
        return true;
    }
}
