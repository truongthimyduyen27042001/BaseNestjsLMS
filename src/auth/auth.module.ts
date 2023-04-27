import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { publicKey, privateKey } from 'src/utils/keys';

@Module({
  imports: [
    PassportModule,
    LoggerModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {
          privateKey,
          publicKey,
          signOptions: { expiresIn: '1h', algorithm: 'RS256' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
