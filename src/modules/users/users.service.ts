import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities';
import { Brackets, Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/request/sign-up.request.dto';
import { SignUpResponseDto } from './dto/response/sign-up.response.dto';
import { hashPassword, patchIfPresent } from '../../utils';
import { PaginationQueryRequestDto } from '../../shared/dtos';
import { PaginationResponseDto } from '../../shared/dtos/response/pagination-dto.response';
import { UpdateUserRequestDto } from './dto/request/update.request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: await hashPassword(newPassword),
    });

    return;
  }

  async create(signUpDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const findUser = await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (findUser) {
      throw new UnprocessableEntityException(
        'Já existe um usuário com esse email.',
      );
    }

    const user = this.userRepository.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: await hashPassword(signUpDto.password),
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      username: user.email,
    };
  }

  async findAll(
    user: User,
    paginationQuery: PaginationQueryRequestDto,
  ): Promise<PaginationResponseDto> {
    const { page, limit, orderBy, search } = paginationQuery;
    const skippedItems = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user');

    switch (orderBy) {
      case 'recent':
        query.orderBy('user.createdAt', 'DESC');
        break;
      case 'old':
        query.orderBy('user.createdAt', 'ASC');
        break;
      case 'az':
        query.orderBy('user.name', 'ASC');
        break;
      case 'za':
        query.orderBy('user.name', 'DESC');
        break;
      default:
        query.orderBy('user.createdAt', 'DESC');
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.name) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
          }).orWhere('LOWER(user.email) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
          });
        }),
      );
    }

    const totalCount = await query.getCount();
    const users = await query.skip(skippedItems).take(limit).getMany();

    return {
      filter: paginationQuery,
      totalCount,
      page,
      data: users,
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      relations: ['organization', 'userRecoveryPass'],
      where: {
        email,
      },
    });
  }

  async updateUser(
    loggedUser: User,
    patchUser: UpdateUserRequestDto,
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      relations: ['organization'],
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (
      patchUser.password &&
      patchUser.password !== patchUser.confirmPassword
    ) {
      throw new UnprocessableEntityException(
        'A senha deve ser igual a confirmação de senha.',
      );
    }

    if (patchUser.password && patchUser.password.length < 8) {
      throw new UnprocessableEntityException(
        'A senha deve ter no mínimo 8 caracteres.',
      );
    }

    if (patchUser.password) {
      user.password = await hashPassword(patchUser.password);
    }

    patchIfPresent(user, 'name', patchUser.name);
    patchIfPresent(user, 'email', patchUser.email);

    await this.userRepository.update(userId, {
      ...user,
    });

    return;
  }
}
