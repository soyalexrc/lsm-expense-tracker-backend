import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilService {
  constructor(private readonly jwtService: JwtService) {}

  decode(token: string): any {
    const jwt = token.replace('Bearer', '').trim();
    return this.jwtService.decode(jwt);
  }

  getCleanToken(token: string): string {
    return token.replace('Bearer', '').trim();
  }
}
