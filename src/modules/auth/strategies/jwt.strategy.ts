import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Audio, Plan, User, UserPlan, Voice } from '../../../entities';
import { Repository } from 'typeorm';
import { endOfMonth, startOfMonth } from 'date-fns';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Audio)
    private audioRepository: Repository<Audio>,
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
    @InjectRepository(UserPlan)
    private userPlanRepository: Repository<UserPlan>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
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

    let user = await this.userRepository.findOne({
      relations: ['userPlan', 'userPlan.plan'],
      where: { id: user_id },
    });

    if (!user.userPlan) {
      const plan = await this.planRepository.findOne({
        where: {
          name: 'Gratuito',
        },
      });

      await this.userPlanRepository.save(
        this.userPlanRepository.create({
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
          plan: {
            id: plan.id,
          },
          user: {
            id: user.id,
          },
        }),
      );

      user = await this.userRepository.findOne({
        relations: ['userPlan', 'userPlan.plan'],
        where: { id: user_id },
      });
    }

    const planSeconds = user.userPlan?.plan.monthlyCredits || 3600;
    const planVoices = user.userPlan?.plan.monthlyVoiceCredits;

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

    const totalVoicesCreated = await this.voiceRepository
      .createQueryBuilder('voice')
      .select('COUNT(voice.id)', 'total')
      .where('voice.userId = :userId', { userId: user.id })
      .andWhere('voice.isActive = :isActive', { isActive: true })
      .getRawOne();

    const usedDurationInSeconds = totalDurationInSeconds.total || 0;
    const creditDifferenceInHours = planSeconds - usedDurationInSeconds;
    const availableVoicesToCreate =
      planVoices - (totalVoicesCreated.total || 0);

    user.planVoices = planVoices;
    user.planSeconds = planSeconds;
    user.usedDurationInSeconds = totalDurationInSeconds.total || 0;
    user.availableDurationInSeconds = creditDifferenceInHours;
    user.availableVoicesToCreate = availableVoicesToCreate;

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
