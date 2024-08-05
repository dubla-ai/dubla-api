import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Voice } from './voice.entity';
import { Audio } from './audio.entity';
import { Project } from './project.entity';

@Entity({ name: 'paragraphs' })
export class Paragraph extends BaseEntity {
  @Column({ nullable: true })
  title?: string;

  @Column()
  body: string;

  @OneToMany(() => Audio, (audio) => audio.paragraph)
  audios: Audio[];

  @ManyToOne(() => Voice, (voice) => voice.paragraphs)
  voice: Voice;

  @ManyToOne(() => Project, (project) => project.paragraphs)
  project: Project;
}
