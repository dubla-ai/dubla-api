import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { SignInRequestDto, SignUpRequestDto } from '../users/dto/request';
import { JwtPayloadAuthDto } from './dto/request/jwt-payload-auth.dto';
import { SignUpResponseDto } from '../users/dto/response/sign-up.response.dto';
import { comparePasswords } from '../../utils/crypto';
import { TokenAuthResponseDto } from '../users/dto/response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    signInDto: SignInRequestDto,
  ): Promise<TokenAuthResponseDto | undefined> {
    const user = await this.usersService.findByEmail(signInDto.username);

    if (!user) return undefined;

    const correctPassword = await comparePasswords(
      signInDto.password,
      user.password,
    );

    if (!correctPassword) return undefined;

    const payload: JwtPayloadAuthDto = {
      user_id: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      name: user.name,
      avatar: null,
    };
  }

  async signUp(signUp: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.usersService.findByEmail(signUp.email);

    if (user) {
      throw new HttpException('Usuário existente', HttpStatus.BAD_REQUEST);
    }

    return await this.usersService.create(signUp);
  }
}
