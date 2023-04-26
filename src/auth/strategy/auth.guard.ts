import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { publicKey } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('vao day nayyyy');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      console.log('vao day nay');
      const payload = this.jwtService.verify(
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjgyNTA5NjIyLCJleHAiOjE2ODI1OTYwMjJ9.pORkt0G9KGSYIluZThMLAqLncrtTOF5Pvd4oqklckDX4P9gkmJlsR_uVSDJCMIZMBDilby9PaRa7O91VcjvRSzHMg0SJu65ncWyf7a2m_PDywOBqrXMxEpwb95fquewOS_DfvOuKpXbAOKZZuBpueMsEbEPAr6l8DpCapTGFTBI2d7pvZnPi2zUr8YeHsYiLLWFS-mykGCCBeOEYQwoFVoku-yPQ363qjP6nUBeb81nYIx6jVJBMb-eRj5w_GriPUXsDxVsozTwTjwcBeM0_z_sFzLH5fIWpY756WkE95vbO_6PteuXju5zYpRlkGhE_lYH6I0TEQ7bGzpM1OuMBow',
        {
          algorithms: ['RS256'],
          publicKey: publicKey.toString(),
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
