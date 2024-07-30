import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { validateOrReject, IsUUID } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class ParamValidation {
  constructor(public value: any) {}

  @IsUUID()
  get id() {
    return this.value;
  }
}

export const IsUuidParam = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = request.params[data as string];

    try {
      const paramObject = plainToInstance(ParamValidation, { value: param });
      await validateOrReject(paramObject);
    } catch (errors) {
      throw new ForbiddenException('Invalid UUID format');
    }

    return param;
  },
);
