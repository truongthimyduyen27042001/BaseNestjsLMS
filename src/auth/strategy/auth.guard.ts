import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify(
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjgyNTEwNDAwLCJleHAiOjE2ODI1OTY4MDB9.bNTjS4bi01W61B6goRuaSzYOQrej_E414B5Pt8208-9AbxnmcrBGP0YjYvI_VHZ_yaYkxCCdZPlq_iN5_vJRbrEOnpEOP1TElxkS3Pspm54mLk0pcJTcCd9bOlU4vZSYlhNHJKbroQHofuSvIjx6luvLC8HdQEY8gkMlJdEP4iYA0WWNMmHlRX7dBDexW7IjQSO_h7JOg1NcylPEMY6OT16YGpcCnGzd7nz6oDxrpjfV10LDYcUwhyMBiKoxrRSjzCEQm5ouQL1XZUWSQVhbcC554MYCpwXEtsQfHU-cBlLQ1YHidirU8IbijDA4xGNvLmG5DgblJkF9PspgpZkS2Q',
        {
          algorithms: ['RS256'],
          publicKey: process.env.PUBLIC_KEY,
        },
      );
      console.log('payload: ', payload);
      request['user'] = payload;
      console.log('payload: ', payload);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(@Request() request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
