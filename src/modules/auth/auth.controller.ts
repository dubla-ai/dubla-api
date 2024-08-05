import * as _ from 'lodash';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpRequestDto, SignInRequestDto } from '../users/dto/request';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities';
import { GetDashboardRequest } from './dto/request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto) {
    const response = this.authService.login(signInDto);

    if (!response) throw new UnauthorizedException();

    return response;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpRequestDto) {
    return await this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req): any {
    return _.omit(req.user, ['password']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/dashboard')
  async getDashboard(
    @GetUser() loggedUser: User,
    @Query() params: GetDashboardRequest,
  ) {
    return await this.authService.getDashboard(loggedUser, params);
  }
}
