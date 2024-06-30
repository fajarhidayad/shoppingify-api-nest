import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/modules/auth/interfaces/payload.interface';

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return data ? user[data] : user;
  },
);
