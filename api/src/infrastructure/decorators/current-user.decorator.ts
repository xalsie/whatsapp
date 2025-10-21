import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
    user?: unknown;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req && typeof req.user !== 'undefined' ? req.user : undefined;
});
