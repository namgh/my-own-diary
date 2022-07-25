import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ICurrentUser {
  id: string;
  email: string;
  exp: number;
}

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext): ICurrentUser => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
