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
      console.log('token:', token);
      console.log(
        'check: ',
        token ===
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjgyNTE2MDIzLCJleHAiOjE2ODI1MTk2MjN9.f-fo8eqoHqt8T2w7ynRYaAmi93Rs0IH9ZRJj57CBlUVCn0DVKXLtmY-OXJ7TyRScBCU-T2m_3LHDuFVOyotZHmbkuJmKmtimlord-BDhtZg3pDajuv-aduaTPWDx0rYSbuoMbxbztzFvRJtDQUgSYabBtIfxRCOUxEsGGQmTaFmhOXzI8-nElbJ1c5I_opO3OvoIqI1kJ3XP9BCySEF0bfKz8p8o4-B8E5ZWZQVjVIJB6m1m-uddKE_0Di3g2Wr_zoCoVidIvHwH811pnNVc-aOGHcHv0w3gXJduTNEjvWd_SXL9Ew5jV_utMpXr2RfCxabgskK9SDwnSTNNAIgw-g',
      );
      const payload = await this.jwtService.verifyAsync(token, {
        algorithms: ['RS256'],
        publicKey: process.env.PUBLIC_KEY,
      });
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

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         algorithms: ['RS256'], // Specify the RS256 algorithm
//         publicKey: process.env.PUBLIC_KEY,
//       });
//       // 💡 We're assigning the payload to the request object here
//       // so that we can access it in our route handlers
//       request['user'] = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
