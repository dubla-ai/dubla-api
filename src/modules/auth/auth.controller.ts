import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpRequestDto, SignInRequestDto } from '../users/dto/request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto) {
    const response = this.authService.login(signInDto);

    if (!response) throw new UnauthorizedException();

    return response;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpRequestDto) {
    const response = this.authService.signUp(signUpDto);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req): any {
    return req.user;
  }
}
