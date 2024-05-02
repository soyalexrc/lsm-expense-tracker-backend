import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';
import { JwtUtilService } from '../services/jwt-util/jwt-util.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger();
  constructor(
    private configService: ConfigService,
    private jwtUtil: JwtUtilService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.jwtUtil.getCleanToken(request.body?.token);
    try {
      await clerkClient.verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      });
    } catch (err) {
      this.logger.error(err);
      return false;
    }
    return true;
  }
}
