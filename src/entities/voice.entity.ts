import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Paragraph } from './paragraph.entity';
import { Audio } from './audio.entity';
import { User } from './user.entity';

enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum AgeGroup {
  TEENAGER = 'TEENAGER',
}

@Entity({ name: 'voices' })
export class Voice extends BaseEntity {
  @Column()
  providerId: string;

  @Column()
  name: string;

  @Column()
  gender: GenderEnum;

  @Column()
  ageGroup: AgeGroup;

  @Column()
  style: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.voice)
  paragraphs: Paragraph[];

  @OneToMany(() => Audio, (audio) => audio.voice)
  audios: Audio[];

  @ManyToOne(() => User, (user) => user.voices)
  user: User;
}
