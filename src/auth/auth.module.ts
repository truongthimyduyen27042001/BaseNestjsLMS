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

import * as crypto from 'crypto';

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// Store keys in environment variables
process.env.PUBLIC_KEY = publicKey;
process.env.PRIVATE_KEY = privateKey;

@Module({
  imports: [
    PassportModule,
    LoggerModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {
          privateKey: process.env.PRIVATE_KEY,
          publicKey: process.env.PUBLIC_KEY,
          signOptions: { expiresIn: '1d', algorithm: 'RS256' },
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
