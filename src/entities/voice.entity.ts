import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Paragraph } from './paragraph.entity';
import { Audio } from './audio.entity';
import { User } from './user.entity';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AgeGroup {
  TEENAGER = 'TEENAGER',
}

@Entity({ name: 'voices' })
export class Voice extends BaseEntity {
  @Column()
  providerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  gender: GenderEnum;

  @Column({ nullable: true })
  ageGroup: AgeGroup;

  @Column({ nullable: true })
  style: string;

  @Column({ nullable: true })
  preview: string;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.voice)
  paragraphs: Paragraph[];

  @OneToMany(() => Audio, (audio) => audio.voice)
  audios: Audio[];

  @ManyToOne(() => User, (user) => user.voices)
  user: User;
}
