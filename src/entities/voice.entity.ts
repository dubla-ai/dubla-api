import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Paragraph } from './paragraph.entity';

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
}
