import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryRequestDto } from '../../shared/dtos';
import { SignUpRequestDto } from './dto/request';
import { User } from '../../entities';
import { UpdateUserRequestDto } from './dto/request/update.request.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { IsUuidParam } from '../../validators';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findAll(
    @GetUser() user: User,
    @Query() query: PaginationQueryRequestDto,
    @IsUuidParam('id') organizationId: string,
  ) {
    return this.usersService.findAll(user, { ...query, organizationId });
  }

  @Patch(':id')
  async patchUser(
    @GetUser() user: User,
    @Body() body: UpdateUserRequestDto,
    @IsUuidParam('id') userId: string,
  ) {
    return await this.usersService.updateUser(user, body, userId);
  }

  @Post()
  async createUser(@Body() signUpDto: SignUpRequestDto) {
    return await this.usersService.create(signUpDto);
  }
}
