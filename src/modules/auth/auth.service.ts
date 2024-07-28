import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { SignInRequestDto } from '../users/dto/request/sign-in.request.dto';
import { JwtPayloadAuthDto } from './dto/request/jwt-payload-auth.dto';
import { TEXT_RESOURCE } from '../../middlewares/language.middleware';
import { SignUpRequestDto } from '../users/dto/request/sign-up.request.dto';
import { SignUpResponseDto } from '../users/dto/response/sign-up.response.dto';
import { comparePasswords } from '../../utils/crypto';
import { TokenAuthResponseDto } from '../users/dto/response/token-auth.response.dto';
import { CreateAppRequestDto } from '../users/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { DistribuitionChannelIntegration } from '../../entities';
import { Repository } from 'typeorm';
import IDistribuitionChannelService from '../../services/distribuition-channel/distribuition-channel.service.interface';
import { DISTRIBUITION_CHANNEL_SERVICE } from '../../services/services';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(DISTRIBUITION_CHANNEL_SERVICE)
    private distribuitionChannelService: IDistribuitionChannelService,
    @InjectRepository(DistribuitionChannelIntegration)
    private distribuitionChannelIntegrationRepository: Repository<DistribuitionChannelIntegration>,
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
      organization_id: user.organizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      name: user.name,
      avatar: null,
    };
  }

  async signUp(signUp: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.usersService.findByEmail(signUp.username);

    if (user) {
      throw new HttpException(
        TEXT_RESOURCE.AUTH_ERROR_EXIST_USER,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.usersService.create(signUp);
  }

  async createApp(app: CreateAppRequestDto) {
    const distribuitionChannel =
      await this.distribuitionChannelIntegrationRepository.findOne({
        where: { id: app.state },
      });

    if (!distribuitionChannel) {
      throw new ForbiddenException(
        'Distribuition Channel Integration does not exist',
      );
    }

    const credentials = await this.distribuitionChannelService.requestToken(
      distribuitionChannel,
      app.code,
    );

    await this.distribuitionChannelIntegrationRepository.update(
      distribuitionChannel.id,
      {
        refreshToken: credentials.refresh_token,
        accessToken: credentials.access_token,
      },
    );

    /** TODO: Redirects user to any page we want here */
  }
}
