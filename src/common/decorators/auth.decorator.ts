import { applyDecorators, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(ClerkAuthGuard));
};
