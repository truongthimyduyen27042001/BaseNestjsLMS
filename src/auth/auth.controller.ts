import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './strategy/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async index(@Req() req, @Res() res, @Body() body) {
    res.status(200).json({
      message: 'Welcom you to the worldwwww2222w',
    });
  }

  @Post('login')
  async login(@Req() req, @Res() res, @Body() body) {
    const auth = await this.authService.login(body);
    res.status(auth.status).json(auth.msg);
  }

  @Post('register')
  async register(@Req() req, @Res() res, @Body() body) {
    console.log('no vao day');
    const auth = await this.authService.register(body);
    res.status(auth.status).json(auth.content);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req, @Res() res) {
    // return req.user;
    return res.send('pass roi nesdsdsd');
  }
}
