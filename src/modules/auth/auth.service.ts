import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { SignInRequestDto, SignUpRequestDto } from '../users/dto/request';
import { JwtPayloadAuthDto } from './dto/request/jwt-payload-auth.dto';
import { SignUpResponseDto } from '../users/dto/response/sign-up.response.dto';
import { comparePasswords } from '../../utils/crypto';
import { TokenAuthResponseDto } from '../users/dto/response';
import { Audio, Project, User, Voice } from '../../entities';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDashboardRequest } from './dto/request';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Audio)
    private audioRepository: Repository<Audio>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
  ) {}

  async login(
    signInDto: SignInRequestDto,
  ): Promise<TokenAuthResponseDto | undefined> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) return undefined;

    const correctPassword = await comparePasswords(
      signInDto.password,
      user.password,
    );

    if (!correctPassword) {
      throw new ForbiddenException('Senha incorreta');
    }

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

  async getDashboard(user: User, filters: GetDashboardRequest): Promise<any> {
    const { startDate, endDate } = filters;
    const monthlyCredits = user.userPlans[0]?.plan.monthlyCredits || 3600;

    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const totalDurationInSeconds = await this.audioRepository
      .createQueryBuilder('audio')
      .select('SUM(audio.durationInSeconds)', 'total')
      .innerJoin('audio.paragraph', 'paragraph')
      .innerJoin('paragraph.project', 'project')
      .where('project.userId = :userId', { userId: user.id })
      .andWhere('audio.createdAt BETWEEN :start AND :end', { start, end })
      .getRawOne();

    const totalDurationUsedInSecondsFiltered = await this.audioRepository
      .createQueryBuilder('audio')
      .select('SUM(audio.durationInSeconds)', 'total')
      .innerJoin('audio.paragraph', 'paragraph')
      .innerJoin('paragraph.project', 'project')
      .where('project.userId = :userId', { userId: user.id })
      .andWhere('audio.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    const usedDurationInSeconds = totalDurationInSeconds.total || 0;
    const creditDifferenceInHours = monthlyCredits - usedDurationInSeconds;

    const totalProjects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('project.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getCount();

    const totalVoices = await this.voiceRepository
      .createQueryBuilder('voice')
      .leftJoinAndSelect('voice.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('voice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getCount();

    const rawDailyUsage = await this.audioRepository
      .createQueryBuilder('audio')
      .select('DATE(audio.createdAt)', 'day')
      .addSelect('SUM(audio.durationInSeconds)', 'total')
      .innerJoin('audio.paragraph', 'paragraph')
      .innerJoin('paragraph.project', 'project')
      .where('project.userId = :userId', { userId: user.id })
      .andWhere('audio.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE(audio.createdAt)')
      .orderBy('DATE(audio.createdAt)')
      .getRawMany();

    const dailyUsageMap = rawDailyUsage.reduce((acc, entry) => {
      acc[format(entry.day, 'yyyy-MM-dd')] = parseFloat(entry.total);
      return acc;
    }, {});

    const getAllDaysBetween = (
      startDate: string,
      endDate: string,
    ): string[] => {
      return eachDayOfInterval({ start: startDate, end: endDate }).map((date) =>
        format(date, 'yyyy-MM-dd'),
      );
    };

    const allDays = getAllDaysBetween(startDate, endDate);

    const formattedDailyUsage = allDays.map((day) => ({
      day,
      total: dailyUsageMap[day] || 0,
    }));
    return {
      secondsAvailable: creditDifferenceInHours,
      secondsInPlan: monthlyCredits,
      secondsUsed: totalDurationUsedInSecondsFiltered.total || 0,
      totalProjects,
      totalVoices,
      usage: formattedDailyUsage,
    };
  }
}
