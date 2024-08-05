import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Audio, User } from '../../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Audio)
    private audioRepository: Repository<Audio>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    user_id: string;
    organization_id: string;
  }): Promise<User> {
    const { user_id } = payload;

    const user = await this.userRepository.findOne({
      relations: ['userPlan', 'userPlan.plan'],
      where: { id: user_id },
    });

    const planSeconds = user.userPlan?.plan.monthlyCredits || 3600;

    const totalDurationInSeconds = await this.audioRepository
      .createQueryBuilder('audio')
      .select('SUM(audio.durationInSeconds)', 'total')
      .innerJoin('audio.paragraph', 'paragraph')
      .innerJoin('paragraph.project', 'project')
      .where('project.userId = :userId', { userId: user.id })
      .andWhere('audio.createdAt BETWEEN :start AND :end', {
        start: user.userPlan.startDate,
        end: user.userPlan.endDate,
      })
      .getRawOne();

    const usedDurationInSeconds = totalDurationInSeconds.total || 0;
    const creditDifferenceInHours = planSeconds - usedDurationInSeconds;

    user.planSeconds = planSeconds;
    user.usedDurationInSeconds = totalDurationInSeconds.total || 0;
    user.creditDifferenceInHours = creditDifferenceInHours;

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
