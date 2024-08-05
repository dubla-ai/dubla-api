import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userPlans',
        'userPlan',
        'userPlan.startDate <= :currentDate AND userPlan.endDate >= :currentDate',
        { currentDate: new Date() },
      )
      .leftJoinAndSelect('userPlan.plan', 'plan')
      .where('user.id = :userId', { userId: user_id })
      .getOne();

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
