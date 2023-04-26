import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { privateKey } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private logger: LoggerService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(user: any): Promise<Record<string, any>> {
    let isValid = false;

    //transform body into DTO
    const userDTO = new UserDTO();
    userDTO.email = user.email;
    userDTO.password = user.password;

    //validate DTO against validate function from class-validator
    await validate(userDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug(`${errors} - @@@@@@@`, AuthService.name);
      } else {
        isValid = true;
      }
    });
    console.log('debug');
    //get information
    if (isValid) {
      const userDetails = await this.userRepository.findOne({
        where: {
          email: userDTO.email,
        },
      });
      if (userDetails == null) {
        console.log('khong tim thay');
        return { status: 401, message: 'Invalid credentials' };
      }

      //check if password is match with saved password

      console.log('debug 2');

      const isPasswordValid = bcrypt.compareSync(
        user.password,
        userDetails.password,
      );

      if (isPasswordValid) {
        console.log('dung roi nay');
        return {
          status: 200,
          msg: {
            data: userDetails,
            access_token: this.jwtService.sign(
              { email: userDTO.email },
              {
                algorithm: 'RS256',
                privateKey,
              },
            ),
          },
        };
      } else {
        console.log('no sai roi');
        return { status: 401, msg: 'Password is invalid' };
      }
    }
  }

  async register(body: any): Promise<Record<string, any>> {
    let isValid = false;

    //transform body
    const userDTO = new UserDTO();
    userDTO.email = body.email;
    userDTO.password = bcrypt.hashSync(body.password, 10);

    //valid DTO agains validate function from class-validator
    await validate(userDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug(`${errors} BBBBBBBBBBBBBBBBBBBB`, AuthService.name);
        console.log('error :', errors);
      } else {
        isValid = true;
      }
    });

    if (isValid) {
      await this.userRepository.save(userDTO).catch((error) => {
        this.logger.debug(error.message + 'CCCCCCCCCCC', AuthService.name);
        isValid = false;
      });
      if (isValid) {
        return { status: 201, content: { msg: `User created with success` } };
      } else {
        return { status: 400, content: { msg: 'User already exists roi ne' } };
      }
    } else {
      return { status: 400, content: { msg: 'Invalid content' } };
    }
  }
}
