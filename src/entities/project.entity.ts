import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Paragraph } from './paragraph.entity';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.project)
  paragraphs: Paragraph[];
}
